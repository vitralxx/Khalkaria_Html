'use strict';
// Schema v3 (F3a): data/ficha.schema.json '3.0' concorda com o KhEstado e com o
// dado (24 perícias de data/pericias.json, 14 tipos de dano do contrato e do
// tools/alvos_destino.json), recusa ajuste em caminho de estado, e o validador
// mínimo (tools/testes/esquema-min.js, sem pip) faz o que promete.
const test = require('node:test');
const assert = require('node:assert/strict');

const E = require('../../js/ficha/kh-estado.js');
const { validar } = require('./esquema-min.js');
const { lerJSON } = require('./estado-apoio.js');

const S = lerJSON('data', 'ficha.schema.json');
const REGRAS = lerJSON('data', 'balanceamento', 'ficha-digital-regras.json');
const ALVOS = lerJSON('tools', 'alvos_destino.json');
const PERICIAS = lerJSON('data', 'pericias.json');

test('esquema-min: tipos, required, additionalProperties, $ref, oneOf, pattern', () => {
  const s = {
    type: 'object', required: ['a'], additionalProperties: false,
    properties: { a: { type: 'integer', minimum: 1 }, b: { $ref: '#/$defs/b' } },
    $defs: { b: { oneOf: [{ type: 'null' }, { type: 'string', pattern: '^x' }] } }
  };
  assert.deepEqual(validar(s, { a: 1, b: null }), []);
  assert.deepEqual(validar(s, { a: 1, b: 'xy' }), []);
  assert.equal(validar(s, { a: 0 }).length, 1);
  assert.equal(validar(s, { b: 'y' }).length, 2);            // falta a; b não casa ramo nenhum
  assert.equal(validar(s, { a: 1, c: 1 }).length, 1);        // propriedade não prevista
  assert.equal(validar(s, { a: 1.5 }).length, 1);            // number não é integer
  assert.deepEqual(validar({ type: 'number' }, 3), []);      // integer é number
  assert.throws(() => validar({ if: {} }, 1), /não suportada/);
  assert.deepEqual(validar({ items: { $ref: '#' }, type: 'array' }, [[], [[]]]), []);
});

test('novaFicha valida no schema v3 e nasce 3.0 com id aleatório', () => {
  const f = E.novaFicha({ nome: 'Teste', nivel: 3 });
  assert.deepEqual(validar(S, f), []);
  assert.equal(f.schemaVersion, '3.0');
  assert.equal(S.properties.schemaVersion.const, '3.0');
  assert.match(f.id, /^f[a-z0-9]{12}$/);
  assert.notEqual(E.novaFicha().id, E.novaFicha().id);
});

test('24 perícias: schema, KhEstado e data/pericias.json iguais (grau 0-4)', () => {
  const dado = PERICIAS.pericias.map((p) => p.slug);
  assert.equal(dado.length, 24);
  assert.deepEqual(E.PERICIAS, dado);
  assert.deepEqual(S.properties.pericias.required, dado);
  assert.deepEqual(S.properties.pericias.propertyNames.enum, dado);
  assert.deepEqual(S.properties.pericias.additionalProperties, { type: 'integer', minimum: 0, maximum: 4 });
  const maior = PERICIAS.pericias.filter((p) => p.modo === 'maior');
  assert.deepEqual(Object.keys(E.PERICIAS_MAIOR).sort(), maior.map((p) => p.slug).sort());
  maior.forEach((p) => {
    assert.deepEqual(E.PERICIAS_MAIOR[p.slug], p.atributos, p.slug);
    assert.deepEqual(S.properties.periciasAttr.properties[p.slug].enum, p.atributos, p.slug);
  });
});

test('14 tipos de dano e 4 categorias de Ae: contrato, alvos_destino, schema e KhEstado', () => {
  const cat = REGRAS.dano.categorias;
  const doContrato = [].concat(...Object.values(cat));
  assert.equal(doContrato.length, 14);
  assert.equal(REGRAS.dano.totalDeTipos, 14);
  assert.deepEqual([...E.TIPOS_DANO].sort(), [...doContrato].sort());
  assert.deepEqual(E.TIPOS_DANO, ALVOS.placeholders['<tipo>']);
  assert.deepEqual(E.CATEGORIAS_AE, ALVOS.placeholders['<categoria>']);
  const r = S.properties.resistencias.properties;
  assert.deepEqual(r.tipos.required, E.TIPOS_DANO);
  assert.deepEqual(r.aeCategoria.propertyNames.enum, E.CATEGORIAS_AE);
  assert.deepEqual(REGRAS.dano.camadasDaGrade, ['R', 'I', 'V', 'Ae']);
  assert.deepEqual(S.$defs.defesaTipo.required, ['R', 'I', 'V', 'ae']);
});

test('ajustes: o padrão do schema é o KhEstado.PADRAO_AJUSTE', () => {
  assert.equal(new RegExp(S.properties.ajustes.propertyNames.pattern).source, E.PADRAO_AJUSTE.source);
});

test('ajuste só em caminho derivado: recurso.saude.atual e demais estados recusados', () => {
  const aceita = ['recurso.saude.max', 'recurso.classe.max', 'pericia.atacar.total', 'pericia.oficio-alquimia.total',
    'evasao.ativa', 'evasao.passiva', 'cd', 'movimento', 'ar', 'acoes', 'atributo.DES.mod', 'atributo.FOR.total',
    'ae.fogo', 'ae.ordinario', 'ae.todos', 'resistencia.cortante', 'vulnerabilidade.primordial',
    'capacidade.bugigangas', 'magia.magia-fagulha.custo', 'ataque.u123.atacar', 'limiar.saldo'];
  const recusa = ['recurso.saude.atual', 'recurso.stamina.atual', 'recurso.saude.temporaria', 'atributo.DES.base',
    'pericia.atacar.grau', 'pericia.oficio.total', 'sins', 'vhelor.marcas', 'ae.outros', 'resistencia.ordinario',
    'evasao', 'meta.nivel', 'recurso.saude.max.extra', ''];
  aceita.forEach((c) => assert.ok(E.ehCaminhoDeAjuste(c), c));
  recusa.forEach((c) => assert.ok(!E.ehCaminhoDeAjuste(c), c));
  const aj = { modo: 'fixa', valor: 3, desde: '2026-09-28T00:00:00.000Z' };
  const f = E.novaFicha();
  f.ajustes['recurso.saude.max'] = aj;
  assert.deepEqual(validar(S, f), []);
  f.ajustes['recurso.saude.atual'] = aj;
  assert.equal(validar(S, f).length, 1, 'o schema recusa ajuste em estado');
  assert.equal(E.validarAjuste('recurso.saude.atual', aj), 'caminho-de-estado');
  assert.equal(E.ajustar(E.novaFicha(), 'recurso.saude.atual', aj), 'caminho-de-estado');
});

test('ajuste: modo, valor e temporário validados; booleano só em R/I/V', () => {
  const d = '2026-09-28T00:00:00.000Z';
  assert.equal(E.validarAjuste('cd', { modo: 'soma', valor: 2, desde: d }), null);
  assert.equal(E.validarAjuste('cd', { modo: 'x', valor: 2 }), 'modo-invalido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: '2' }), 'valor-invalido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: true }), 'valor-invalido');
  assert.equal(E.validarAjuste('resistencia.fogo', { modo: 'fixa', valor: true }), null);
  assert.equal(E.validarAjuste('resistencia.fogo', { modo: 'soma', valor: true }), 'modo-invalido');
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: 1, temporario: { fim: 'descansoLongo' } }), null);
  assert.equal(E.validarAjuste('cd', { modo: 'fixa', valor: 1, temporario: { fim: 'amanha' } }), 'temporario-invalido');
  const f = E.novaFicha();
  assert.equal(E.ajustar(f, 'evasao.passiva', { modo: 'soma', valor: 1, motivo: 'Capa', temporario: { fim: 'fimCombate' } },
    { agora: () => d }), null);
  assert.deepEqual(f.ajustes['evasao.passiva'], { modo: 'soma', valor: 1, motivo: 'Capa', temporario: { fim: 'fimCombate' }, desde: d });
  assert.deepEqual(validar(S, f), []);
  assert.equal(E.desajustar(f, 'evasao.passiva'), true);
  assert.equal(E.desajustar(f, 'evasao.passiva'), false);
  assert.deepEqual(f.ajustes, {});
});

test('índice e "exportar todas" (fichas/1) validam nos $defs', () => {
  const f = E.novaFicha({ nome: 'A' });
  const ind = { schema: 'fichas/1', ultimaAtiva: f.id, projecaoV2: null,
    fichas: [{ id: f.id, nome: 'A', classe: '', nivel: 1, atualizadoEm: '2026-09-28T00:00:00.000Z' }] };
  assert.deepEqual(validar(S, ind, '#/$defs/indiceFichas'), []);
  const pac = E.pacoteTodas([E.exportarFicha(f, { modo: 'mesa', turno: 1, log: [] }).dados]).dados;
  assert.deepEqual(validar(S, pac, '#/$defs/pacoteFichas'), []);
  pac.fichas[0].schemaVersion = '2.0';
  assert.ok(validar(S, pac, '#/$defs/pacoteFichas').length > 0);
});
