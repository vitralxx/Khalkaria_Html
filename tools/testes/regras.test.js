'use strict';
// Motor de regras da ficha (F3b, modo sombra): KhRegras + KhEfeitos + KhAjustes
// sobre js/ficha/00-regras-dados.js (tools/gerar_regras_ficha.py). Puro, node.
// Cobre: fórmula por fórmula e os exemplos do contrato (modificador, Saúde/
// Stamina/Éter com V/G/R e o "maior" trocável, Evasão Passiva e Ativa, CD,
// Movimento na ordem L25, carga e capacidade, custo de magia D82/D96,
// progressão da PMA), vantagem/desvantagem (D81), condições (X, empilhamento,
// implicação, imunidade), itens pelo "quando", ajuste por nó com propagação,
// fórmula simbólica e numérica em todo nó, e catálogo indisponível.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const R = require('../../js/ficha/kh-regras.js');
const F = require('../../js/ficha/kh-efeitos.js');
const AJ = require('../../js/ficha/kh-ajustes.js');
const E = require('../../js/ficha/kh-estado.js');
const D = require('../../js/ficha/00-regras-dados.js');
const A = require('./estado-apoio.js');

const CONTRATO = A.lerJSON('data', 'balanceamento', 'ficha-digital-regras.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const ARMA = (x) => Object.assign({ dados: '1d6', tipo: 'cortante', atributo: 'DES', acoes: 1, bonusAtacar: 0,
  arquetipo: 'leve', arremessar: null, margemAmeaca: 20, multiplicadorCritico: 2, danoExtra: [] }, x);
// efeitos sintéticos (o formato de data/efeitos.json), para contas determinísticas
const EF = {
  'item-t-leve': { quando: null, acumulaCopia: true, mods: [], arma: ARMA({}), status: 'canonico' },
  'item-t-pesada': { quando: null, acumulaCopia: true, mods: [], arma: ARMA({ dados: '2d8', atributo: 'FOR', acoes: 2, arquetipo: 'pesada' }), status: 'canonico' },
  'item-t-arremesso': { quando: null, acumulaCopia: true, mods: [], arma: ARMA({ arremessar: 1 }), status: 'canonico' },
  'item-t-anel': { quando: 'equipado', acumulaCopia: true, status: 'canonico', mods: [
    { alvo: 'resistencia.fogo', op: 'fixa', valor: true, quando: 'equipado', acumula: true, status: 'canonico' },
    { alvo: 'ae.elemental', op: 'soma', valor: 2, quando: 'equipado', acumula: true, status: 'canonico' },
    { alvo: 'ae.todos', op: 'soma', valor: 1, quando: 'equipado', acumula: true, status: 'canonico' }] },
  'item-t-amuleto': { quando: 'carregado', acumulaCopia: false, status: 'decisao', mods: [
    { alvo: 'pericia.percepcao', op: 'soma', valor: 2, quando: 'carregado', acumula: true, status: 'decisao' }] },
  'item-t-brasas': { quando: 'carregado', acumulaCopia: true, status: 'canonico', mods: [
    { alvo: 'pericia.vontade', op: 'soma', valor: 3, quando: 'carregado', acumula: false, status: 'canonico' }] },
  'item-t-colar': { quando: 'carregado', acumulaCopia: true, status: 'canonico', mods: [
    { alvo: 'pericia.vontade', op: 'soma', valor: 1, quando: 'carregado', acumula: true, status: 'canonico' }] },
  'item-t-vantagem': { quando: 'carregado', acumulaCopia: true, status: 'canonico', mods: [
    { alvo: 'pericia.furtividade', op: 'vantagem', quando: 'carregado', status: 'canonico' }] },
  'item-t-escudo': { quando: 'equipado', acumulaCopia: true, status: 'canonico', mods: [
    { alvo: 'pericia.defender', op: 'soma', valor: 1, quando: 'equipado', condicao: 'reacaoDefender', acumula: true, status: 'canonico' },
    { alvo: 'movimento', op: 'soma', valor: -1.5, quando: 'equipado', acumula: true, status: 'canonico' }] },
  'item-t-capa': { quando: 'equipado', acumulaCopia: true, status: 'canonico', mods: [
    { alvo: 'evasao.passiva', op: 'soma', valor: 1, quando: 'equipado', acumula: true, status: 'aprovado' }] },
  // mesma forma da Coroa de Kha (decisão): +2 DES
  'item-t-coroa': { quando: 'carregado', acumulaCopia: false, status: 'decisao', mods: [
    { alvo: 'atributo.DES', op: 'soma', valor: 2, quando: 'carregado', acumula: true, status: 'decisao' }] },
  // fonte sem status em CON (para a propagação até o tique de Morrendo)
  'item-t-con': { quando: 'carregado', acumulaCopia: false, status: 'semStatus', mods: [
    { alvo: 'atributo.CON', op: 'soma', valor: 2, quando: 'carregado', acumula: true, status: 'semStatus' }] },
  // percentual sintético no máximo (a forma do Sacrifício Vivo ×0,5)
  'item-t-meia': { quando: 'carregado', acumulaCopia: false, status: 'canonico', mods: [
    { alvo: 'recurso.stamina.max', op: 'multiplica', valor: 0.5, quando: 'carregado', acumula: true, status: 'canonico' }] },
  'item-t-pma-soma': { quando: 'carregado', acumulaCopia: false, status: 'aprovado', mods: [
    { alvo: 'pma', op: 'soma', valor: 2, quando: 'carregado', acumula: true, status: 'aprovado' }] },
  'item-t-pma-fixa': { quando: 'carregado', acumulaCopia: false, status: 'aprovado', mods: [
    { alvo: 'pma', op: 'fixa', valor: -3, quando: 'carregado', acumula: true, status: 'aprovado' }] }
};
let nUid = 0;
const item = (id, extra) => Object.assign({ uid: 'i' + (++nUid), id, nome: id.replace(/^item-/, ''), qtd: 1,
  empilhavel: false, equipado: false, sintonizado: false, avulso: false }, extra || {});
const avulso = (nome, qtd) => ({ uid: 'a' + (++nUid), id: '', nome, qtd, empilhavel: false, equipado: false, sintonizado: false, avulso: true });

// ficha v3 mínima com classe, raça e atributos
function ficha(o) {
  o = o || {};
  const f = E.novaFicha({ nome: 'Teste', nivel: o.nivel || 1 }, { agora: () => '2026-09-28T12:00:00.000Z' });
  if (o.classe) f.identidade.classe = { id: 'classe-' + o.classe, nome: o.classe };
  if (o.raca) f.identidade.raca = { id: 'raca-' + o.raca, nome: o.raca };
  if (o.subespecie) f.identidade.subespecie = { id: o.subespecie, nome: o.subespecie };
  if (o.variante) f.identidade.variante = { id: o.variante, nome: o.variante };
  if (o.attrs) Object.assign(f.atributos.base, o.attrs);
  if (o.escolhas) f.identidade.escolhas = o.escolhas;
  if (o.pericias) Object.assign(f.pericias, o.pericias);
  return f;
}
const cond = (id, x) => ({ uid: 'c' + (++nUid), id, x: x == null ? null : x, duracao: null });
const avalia = (f, op) => R.avaliar(f, Object.assign({ efeitos: EF }, op || {}));
const val = (r, c) => r.nos[c].valor;
const termo = (no, re) => no.termos.find((t) => re.test(t.rotulo));

// ---------------- carga e dados compilados ----------------
test('as fontes carregam no node; o artefato js/ficha.js segue devolvendo o KhInv', () => {
  assert.equal(typeof R.avaliar, 'function');
  assert.equal(typeof F.coletar, 'function');
  assert.equal(typeof AJ.aplicar, 'function');
  const art = require('../../js/ficha.js');
  assert.equal(typeof art.calcular, 'function');
  assert.equal(art.avaliar, undefined);
  assert.equal(typeof globalThis.window, 'undefined');
});

test('navegador (vm): as fontes do ORDEM registram KhRegrasDados/KhEfeitos/KhAjustes/KhRegras e avaliam sem storage', () => {
  const toque = [];
  const proibido = new Proxy({}, { get: (_, k) => { toque.push(String(k)); throw new Error('storage tocado'); } });
  const win = { localStorage: proibido, sessionStorage: proibido };
  const sb = vm.createContext({ window: win });
  const ordem = fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha', 'ORDEM'), 'utf8').split(/\r?\n/)
    .map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && l !== 'ficha-v2.js');
  assert.deepEqual(ordem, ['00-regras-dados.js', 'kh-inv.js', 'kh-estado.js', 'kh-efeitos.js', 'kh-ajustes.js', 'kh-regras.js']);
  ordem.forEach((n) => vm.runInContext(fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha', n), 'utf8'), sb, { filename: n }));
  ['KhRegrasDados', 'KhInv', 'KhEstado', 'KhEfeitos', 'KhAjustes', 'KhRegras'].forEach((k) => assert.ok(win[k], k));
  const r = win.KhRegras.avaliar(ficha({ classe: 'monge', raca: 'humano', nivel: 2 }));
  assert.equal(r.nos['recurso.saude.max'].valor, 10 + 5 * 2);
  assert.deepEqual(toque, []);
});

test('regras compiladas: versão do contrato, AST com status e fonte em todo nó, status só do vocabulário', () => {
  assert.equal(D.schema, 'regras-dados/1');
  assert.ok(D.versao.startsWith(CONTRATO.schemaVersion + '+'));
  assert.equal(D.pericias.length, 24);
  assert.equal(Object.keys(D.condicoes).length, 30);
  let nos = 0;
  (function anda(o) {
    if (!o || typeof o !== 'object') return;
    if (typeof o.t === 'string' && ['num', 'ref', 'op', 'neg', 'fn', 'esc', 'dado'].includes(o.t)) {
      nos++;
      assert.ok(o.st && o.fo, 'nó de AST sem st/fo: ' + JSON.stringify(o).slice(0, 80));
    }
    if (typeof o.st === 'string') assert.ok(o.st in D.selos, 'status fora do mapa: ' + o.st);
    Object.values(o).forEach(anda);
  })(D);
  assert.ok(nos > 50, 'fórmulas em AST');
  assert.ok(!JSON.stringify(D).includes('emDesenho'));
  assert.ok(!/\beval\s*\(|new Function/.test(fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha', 'kh-regras.js'), 'utf8')), 'sem eval');
});

// ---------------- modificador (D80) e atributos ----------------
test('modificador = ⌊(attr − 10)/2⌋ bate com a tabela do contrato de 1 a 30', () => {
  const tab = CONTRATO.atributos.modificador.tabela;
  Object.keys(tab).forEach((faixa) => {
    faixa.split('-').map(Number).forEach((v) => {
      const r = R.avaliar(ficha({ attrs: { FOR: v } }));
      assert.equal(val(r, 'atributo.FOR.mod'), tab[faixa], 'FOR ' + v);
    });
  });
  const r = R.avaliar(ficha({ attrs: { DES: 17 } }));
  assert.equal(r.nos['atributo.DES.mod'].formula.simbolica, '⌊(DES − 10) / 2⌋');
  assert.equal(r.nos['atributo.DES.mod'].formula.numerica, '= ⌊(17 − 10) / 2⌋ = 3');
});

test('atributo: raça com "ou" pela escolha, escolha pendente fica na trilha, migrado não soma de novo, +2 por nível', () => {
  let r = R.avaliar(ficha({ raca: 'dryad', attrs: { DES: 14, SAB: 12 }, escolhas: { 'raca.atributos.0': 'DES', 'raca.atributos.1': 'SAB' } }));
  assert.equal(val(r, 'atributo.DES.total'), 16);
  assert.equal(val(r, 'atributo.SAB.total'), 11);
  assert.match(r.nos['atributo.DES.total'].formula.numerica, /= 14 \+ 2 = 16/);
  r = R.avaliar(ficha({ raca: 'dryad', attrs: { DES: 14 } }));
  assert.equal(val(r, 'atributo.DES.total'), 14);
  const pend = termo(r.nos['atributo.DES.total'], /Dryad/);
  assert.equal(pend.ativo, false);
  assert.match(pend.motivo, /escolha pendente/);
  r = R.avaliar(ficha({ raca: 'anao', attrs: { CON: 12 }, escolhas: { 'raca.atributos': 'alternativo' } }));
  assert.equal(val(r, 'atributo.CON.total'), 12, 'o alternativo do Anão não mexe em CON');
  assert.equal(val(r, 'atributo.DES.total'), 11);
  const f = ficha({ raca: 'anao', nivel: 3, attrs: { CON: 16 } });
  f.atributos.porNivel = { 2: { CON: 1, FOR: 1 }, 3: { CON: 2 }, 4: { CON: 2 } };
  r = R.avaliar(f);
  assert.equal(val(r, 'atributo.CON.total'), 16 + 2 + 1 + 2, 'nível 4 fica fora (acima do nível 3)');
  assert.match(termo(r.nos['atributo.CON.total'], /Nível 4/).motivo, /acima do nível/);
  f.atributos.migradoTotal = true; f.atributos.nivelMigrado = 3;
  r = R.avaliar(f);
  assert.equal(val(r, 'atributo.CON.total'), 16, 'total migrado da v2: raça e níveis já dentro');
});

test('Exaustão 4 divide o atributo (floor) e isso cascateia no máximo', () => {
  const f = ficha({ classe: 'brutalista', nivel: 2, attrs: { CON: 16 } });
  f.condicoes.push(cond('exaustao', 4));
  const r = avalia(f);
  assert.equal(val(r, 'atributo.CON.total'), 8);
  assert.equal(val(r, 'atributo.CON.mod'), -1);
  assert.equal(val(r, 'recurso.saude.max'), 10 + 8 * 2 - 1 * 2);
  assert.equal(val(r, 'movimento'), null, 'sem raça, sem base');
});

// ---------------- recursos ----------------
test('Saúde máx. = 10 + Vitalidade × Nível + Mod.CON × Nível, com a fórmula do tooltip', () => {
  const r = R.avaliar(ficha({ classe: 'espadachim', nivel: 3, attrs: { CON: 14 } }));
  const no = r.nos['recurso.saude.max'];
  assert.equal(no.valor, 34);
  assert.equal(no.formula.simbolica, '10 + Vitalidade × Nível + Mod.CON × Nível');
  assert.equal(no.formula.numerica, '= 10 + 6 × 3 + 2 × 3 = 34');
  assert.deepEqual(no.selos, []);
  assert.equal(termo(no, /Vitalidade/).fonte.id, 'classe-espadachim');
});

test('Stamina e Éter: o maior dos dois, trocável à mão (D7), com selo de decisão do Pedro', () => {
  const f = ficha({ classe: 'batedor', nivel: 2, attrs: { FOR: 10, DES: 16, INT: 11, SAB: 15 } });
  let r = R.avaliar(f);
  assert.equal(val(r, 'recurso.stamina.max'), 8 + 7 * 2 + 3 * 2);
  assert.equal(val(r, 'recurso.eter.max'), 6 + 4 * 2 + 2 * 2);
  assert.match(r.nos['recurso.stamina.max'].formula.simbolica, /maior\(Mod\.FOR, Mod\.DES\)/);
  assert.deepEqual(r.nos['recurso.stamina.max'].selos, ['decisaoPedro']);
  f.identidade.escolhas = { 'attr.recurso.stamina': 'FOR' };
  r = R.avaliar(f);
  assert.equal(val(r, 'recurso.stamina.max'), 8 + 7 * 2 + 0);
  assert.match(r.nos['recurso.stamina.max'].formula.simbolica, /Mod\.FOR \(escolhido\)/);
});

test('recurso sem classe e recurso de classe sem regra (Espadachim/Teurgo) saem com selo, nunca inventados', () => {
  let r = R.avaliar(ficha({ attrs: { CON: 14 } }));
  assert.equal(val(r, 'recurso.saude.max'), null);
  assert.match(r.nos['recurso.saude.max'].formula.numerica, /classe não definida/);
  r = R.avaliar(ficha({ classe: 'teurgo', nivel: 2 }));
  const no = r.nos['recurso.classe.max'];
  assert.equal(no.valor, null);
  assert.equal(no.status, 'pedroDecide');
  assert.deepEqual(no.selos, ['pendentePedro']);
  assert.match(no.formula.numerica, /PENDENTE PEDRO/);
  r = R.avaliar(ficha({ classe: 'alquimista', nivel: 3, attrs: { INT: 14 } }));
  assert.equal(val(r, 'recurso.classe.max'), 3 * 3 + 2);
  assert.equal(r.nos['recurso.classe.max'].rotulo, 'Reagentes máx.');
  r = R.avaliar(ficha({ classe: 'batedor', nivel: 1 }));
  assert.deepEqual(r.nos['recurso.classe.max'].selos, ['avisoClasse'], 'Batedor em rework');
});

test('Desnutrido X entra na etapa de condição do máximo (−10 × X) e o piso é 0', () => {
  const f = ficha({ classe: 'teurgo', nivel: 1, attrs: { CON: 10 } });
  f.condicoes.push(cond('desnutrido', 2));
  const r = avalia(f);
  assert.equal(val(r, 'recurso.saude.max'), 0);
  assert.match(r.nos['recurso.saude.max'].formula.numerica, /máx\(0,/);
  assert.equal(termo(r.nos['recurso.saude.max'], /Desnutrido 2/).valor, -20);
});

test('Saúde temporária: não soma, fica a maior (D15)', () => {
  assert.equal(R.temporaria(5, 3), 5);
  assert.equal(R.temporaria(2, 7), 7);
});

// ---------------- Evasão, CD ----------------
test('Evasão Passiva = 10 + Mod.DES; Ativa = Passiva + dado de Defender, sem atributo no dado (D8)', () => {
  const f = ficha({ classe: 'monge', attrs: { DES: 16 }, pericias: { defender: 1 } });
  let r = avalia(f);
  assert.equal(val(r, 'evasao.passiva'), 13);
  assert.equal(val(r, 'pericia.defender.total'), '1d8');
  assert.equal(val(r, 'evasao.ativa'), '13 + 1d8');
  assert.equal(r.nos['evasao.ativa'].formula.simbolica, 'Evasão Passiva + Dado de Defender');
  assert.ok(!r.nos['pericia.defender.total'].termos.some((t) => /Mod\./.test(t.rotulo)), 'o dado não soma atributo');
  // escudo: +1 Defender só na reação (vale na Ativa); capa: +1 Evasão Passiva (aprovado → selo)
  f.inventario.equipamentos.push(item('item-t-escudo', { equipado: true }), item('item-t-capa', { equipado: true }));
  r = avalia(f);
  assert.equal(val(r, 'evasao.passiva'), 14);
  assert.deepEqual(r.nos['evasao.passiva'].selos, ['decisaoPedro']);
  assert.equal(val(r, 'pericia.defender.total'), '1d8 + 1');
  assert.equal(val(r, 'evasao.ativa'), '15 + 1d8');
  // condição: Atordoado −2 na Evasão (alvo 'evasao' do contrato vira evasao.passiva)
  f.condicoes.push(cond('atordoado'));
  r = avalia(f);
  assert.equal(val(r, 'evasao.passiva'), 12);
});

test('CD: fórmula da classe; Espadachim com o maior de DES/FOR, trocável', () => {
  let r = R.avaliar(ficha({ classe: 'monge', attrs: { DES: 14, SAB: 16 } }));
  assert.equal(val(r, 'cd'), 10 + 2 + 3);
  const f = ficha({ classe: 'espadachim', attrs: { DES: 12, FOR: 16, CON: 14 } });
  r = R.avaliar(f);
  assert.equal(val(r, 'cd'), 10 + 3 + 2);
  assert.deepEqual(r.nos.cd.selos, ['decisaoPedro']);
  f.identidade.escolhas = { 'attr.cd': 'DES' };
  assert.equal(val(R.avaliar(f), 'cd'), 10 + 1 + 2);
  assert.equal(val(R.avaliar(ficha()), 'cd'), null);
});

// ---------------- perícias ----------------
test('perícia = Mod + treino (+2 por grau) + Mods; "maior" trocável (D7); Atacar sem atributo (porArma)', () => {
  const f = ficha({ attrs: { DES: 16, INT: 12, FOR: 8 }, pericias: { furtividade: 2, convencimento: 1, atacar: 3 } });
  let r = R.avaliar(f);
  assert.equal(val(r, 'pericia.furtividade.total'), 3 + 4);
  assert.equal(val(r, 'pericia.convencimento.total'), 3 + 2);
  assert.equal(r.nos['pericia.convencimento.total'].escolha.usado, 'DES');
  assert.equal(val(r, 'pericia.atacar.total'), 6);
  assert.equal(r.nos['pericia.atacar.total'].semAtributo, true);
  f.periciasAttr = { convencimento: 'INT' };
  r = R.avaliar(f);
  assert.equal(val(r, 'pericia.convencimento.total'), 1 + 2);
  assert.equal(r.nos['pericia.convencimento.total'].escolha.trocado, true);
});

test('vantagem/desvantagem (D81): 2 V = 1 V, V + D = normal, forçado à mão, Defender rola o próprio dado 2×', () => {
  assert.equal(R.resolverTeste([{ op: 'vantagem' }, { op: 'vantagem' }]).modo, 'vantagem');
  assert.equal(R.resolverTeste([{ op: 'vantagem' }, { op: 'vantagem' }]).expressao, '2d20kh1');
  const vd = R.resolverTeste([{ op: 'vantagem' }, { op: 'desvantagem' }]);
  assert.equal(vd.modo, 'normal');
  assert.equal(vd.anuladas, true);
  assert.equal(vd.expressao, '1d20');
  assert.equal(R.resolverTeste([{ op: 'desvantagem' }]).expressao, '2d20kl1');
  assert.equal(R.resolverTeste([], 'vantagem').modo, 'vantagem');
  assert.equal(R.resolverTeste([{ op: 'vantagem' }], null, '1d8').expressao, '2×1d8, o maior');
  // pelas fontes da ficha: Cego dá desvantagem em Atacar; Exaustão 1 em física; item dá vantagem
  const f = ficha({ attrs: { DES: 14 } });
  f.condicoes.push(cond('cego'), cond('exaustao', 1));
  f.inventario.bugigangas.push(item('item-t-vantagem'));
  const r = avalia(f);
  assert.equal(r.nos['pericia.atacar.total'].rolagem.modo, 'desvantagem');
  assert.equal(r.nos['pericia.furtividade.total'].rolagem.modo, 'normal', 'V do item + D da Exaustão se anulam');
  assert.equal(r.nos['pericia.furtividade.total'].rolagem.anuladas, true);
  assert.equal(r.nos['pericia.percepcao.total'].rolagem.modo, 'normal');
  assert.equal(val(r, 'pericia.percepcao.total'), 0 - 5, 'Cego: −5 em Percepção');
});

// ---------------- Movimento (L25) e carga ----------------
test('Movimento: Dryad com Sobrepeso Leve = 4,5 (10,5 × 0,5 = 5,25 → múltiplo de 1,5)', () => {
  const f = ficha({ raca: 'dryad', attrs: { FOR: 10 } });
  f.inventario.bugigangas.push(avulso('Pedras', 15));
  const r = avalia(f);
  assert.equal(val(r, 'capacidade.bugigangas'), 10);
  assert.equal(val(r, 'carga'), 'leve');
  assert.equal(val(r, 'movimento'), 4.5);
  assert.match(r.nos.movimento.formula.numerica, /10,5\) × 0,5 = 5,25 → 4,5/);
  assert.equal(val(r, 'pericia.atacar.total'), -2, 'Sobrepeso Leve: −2 nas perícias físicas');
  assert.ok(r.condicoes.some((c) => c.id === 'sobrepeso-leve' && c.origem === 'carga'));
  f.inventario.bugigangas[0].qtd = 20;
  assert.equal(val(avalia(f), 'movimento'), 1.5, 'Sobrepeso Extremo fixa 1,5');
});

test('Movimento: Caído + Enraizado = 0 (fixo vence tudo, entre fixos o menor); somas e Lento X', () => {
  const f = ficha({ raca: 'humano' });
  f.condicoes.push(cond('caido'), cond('enraizado'));
  let r = avalia(f);
  assert.equal(val(r, 'movimento'), 0);
  assert.match(termo(r.nos.movimento, /Caído/).motivo, /entre fixos vale o menor/);
  const g = ficha({ raca: 'humano' });
  g.condicoes.push(cond('lento', 1), cond('lento', 1));
  g.inventario.equipamentos.push(item('item-t-escudo', { equipado: true }));
  r = avalia(g);
  assert.equal(val(r, 'movimento'), 9 - 1.5 - 6, 'mesma condição com X soma X (Lento 2)');
  assert.equal(val(r, 'acoes'), 1);
  // Agarrado implica Enraizado (derivada)
  const h = ficha({ raca: 'humano' });
  h.condicoes.push(cond('agarrado'));
  r = avalia(h);
  assert.equal(val(r, 'movimento'), 0);
  assert.ok(r.condicoes.some((c) => c.id === 'enraizado' && c.origem === 'implicada' && c.de === 'agarrado'));
  // inseto: base pela subespécie
  assert.equal(val(R.avaliar(ficha({ raca: 'inseto', subespecie: 'inseto-barata' })), 'movimento'), 10.5);
});

test('capacidade = máx(1, base + Mod.FOR) + bônus do KhInv; ações com Atordoado e Paralisado', () => {
  const f = ficha({ attrs: { FOR: 3 } });
  let r = avalia(f);
  assert.equal(val(r, 'capacidade.equipamentos'), 1);
  assert.equal(val(r, 'capacidade.bugigangas'), 6);
  assert.equal(r.nos['capacidade.equipamentos'].formula.numerica, '= máx(1, 2 − 4) = 1');
  f.inventario.bugigangas.push(item('item-mochila-reforcada', { inv: { capacidade: { bug: 3, equip: 1 }, acumula: false } }));
  r = R.avaliar(f, { efeitos: EFEITOS });
  assert.equal(val(r, 'capacidade.bugigangas'), 9);
  assert.equal(val(r, 'capacidade.equipamentos'), 2);
  const mochila = r.efeitos.mods.filter((m) => m.fonte.id === 'item-mochila-reforcada');
  assert.ok(mochila.length && mochila.every((m) => !m.ativo && /KhInv/.test(m.motivo)), 'sem contar duas vezes');
  const g = ficha();
  g.condicoes.push(cond('atordoado'));
  assert.equal(val(avalia(g), 'acoes'), 1);
  g.condicoes.push(cond('paralisado'));
  assert.equal(val(avalia(g), 'acoes'), 0);
});

// ---------------- magia (D82, D96) ----------------
test('custo de magia: Nv2 Contida = 1, Truque Forçado + Canalização = 1, Nível 1 Normal = 0 (e os exemplos do contrato)', () => {
  const c = (p) => R.custoMagia(p, D).valor;
  assert.equal(c({ nivel: 2, intensidade: 'contida' }), 1);
  assert.equal(c({ nivel: 1, intensidade: 'forcada', descontos: [{ valor: 1, fonte: { nome: 'Canalização Eficiente' } }] }), 1);
  assert.equal(c({ nivel: 1, intensidade: 'normal' }), 0);
  assert.equal(c({ nivel: 1, intensidade: 'normal', descontos: [{ valor: 2, porModulacao: 2, pisoModulacao: 1, fonte: { nome: 'Escola Visceral' } }] }), 0,
    'Truque Normal + Escola Visceral = 0 (a exceção ignora descontos)');
  assert.equal(c({ nivel: 2, intensidade: 'contida', descontos: [{ valor: 1 }] }), 1, 'Nv2 Contida com −1 = 1');
  assert.equal(c({ nivel: 3, intensidade: 'normal', modulacoes: [{ id: 'ancorar', custo: 2 }],
    descontos: [{ valor: 2, porModulacao: 2, pisoModulacao: 1, fonte: { nome: 'Escola Visceral' } }] }), 3, '(4−2) + máx(1, 2−2) = 3');
  assert.equal(c({ nivel: 1, intensidade: 'normal', modulacoes: [{ id: 'compartilhar', custo: 0 }] }), 1, 'modulação grátis ainda é modulação');
  assert.equal(c({ nivel: 2, intensidade: 'contida', pactuada: true }), 0, 'Magia Pactuada em Contida (D96)');
  assert.equal(c({ nivel: 2, intensidade: 'normal', multiplicadores: [{ fator: 2 }], descontos: [{ valor: 1 }] }), 3, '× antes do desconto (P39)');
  const nv1c = R.custoMagia({ nivel: 1, intensidade: 'contida' }, D);
  assert.equal(nv1c.valor, null);
  assert.ok(nv1c.avisos.some((a) => /não possuem a intensidade Contida/.test(a.msg)));
  CONTRATO.magia.exemplosDoPiso.length && Object.entries(CONTRATO.magia.tabelaCusto).forEach(([nv, l]) => {
    Object.entries(l).forEach(([it, v]) => assert.equal(c({ nivel: +nv, intensidade: it }), v, 'tabelaCusto ' + nv + '/' + it));
  });
  const no = R.custoMagia({ nivel: 2, intensidade: 'contida' }, D);
  assert.equal(no.formula.simbolica, 'máx(1, Base Nv2 + Contida)');
  assert.equal(no.formula.numerica, '= máx(1, 2 − 2) = 1');
});

test('custo de magia na ficha: pela entrada (intensidade, modulação da escola) e Mente Fraca (×2 Éter)', () => {
  const f = ficha({ classe: 'teurgo' });
  f.entradas.push({ uid: 'm1', tipo: 'magia', id: 'magia-fagulha', estado: { intensidade: 'normal', modulacoes: ['carregar'] },
    cache: { nome: 'Fagulha', versaoCatalogo: '' }, mods: [] });
  f.entradas.push({ uid: 'm2', tipo: 'magia', id: 'magia-dardo-arcano', estado: { intensidade: 'normal' },
    cache: { nome: 'Dardo Arcano', versaoCatalogo: '' }, mods: [] });
  let r = R.avaliar(f);
  assert.equal(val(r, 'magia.magia-fagulha.custo'), 0 + 0 + 3);
  assert.equal(val(r, 'magia.magia-dardo-arcano.custo'), 2);
  f.entradas.push({ uid: 'd1', tipo: 'dor', id: 'abismo-mente-fraca', estado: {}, cache: { nome: 'Mente Fraca', versaoCatalogo: '' }, mods: [] });
  r = R.avaliar(f);
  assert.equal(val(r, 'magia.magia-dardo-arcano.custo'), 4);
});

// ---------------- ataque e PMA ----------------
test('progressão de ataques (display): Atacar +5, Mod +2, pma −5 → "1º +7 · 2º +2 · 3º −3"; Pesada mostra 1 linha', () => {
  const f = ficha({ attrs: { DES: 14, FOR: 14 } });
  const leve = item('item-t-leve', { equipado: true }), pesada = item('item-t-pesada', { equipado: true });
  f.inventario.equipamentos.push(leve, pesada);
  f.ajustes['pericia.atacar.total'] = { modo: 'fixa', valor: 5, desde: 'x' };
  let r = avalia(f);
  const no = r.nos['ataque.' + leve.uid + '.atacar'];
  assert.equal(no.valor, 7);
  assert.equal(no.progressao.texto, '1º +7 · 2º +2 · 3º −3');
  assert.equal(r.nos['ataque.' + pesada.uid + '.atacar'].progressao.texto, '1º +7');
  assert.equal(val(r, 'ataque.' + leve.uid + '.dano'), '1d6 + 2');
  // ajuste em Atacar muda a progressão; Atordoado corta ações
  f.ajustes['pericia.atacar.total'].valor = 6;
  f.condicoes.push(cond('atordoado'));
  r = avalia(f);
  assert.equal(r.nos['ataque.' + leve.uid + '.atacar'].progressao.texto, '1º +8');
  assert.equal(r.nos['ataque.' + pesada.uid + '.atacar'].progressao.texto, '', 'Pesada com 1 ação: nenhum ataque');
});

// ---------------- defesa ----------------
test('Ar e Ae em camadas (D85, L26, L34): Ar só no Ordinário, Ae(Todos) só nos 9 atípicos, R/I/V dos itens', () => {
  const f = ficha({ raca: 'anao', variante: 'anao-caxon' });
  f.resistencias.tipos.fogo.ae = 1;
  f.inventario.equipamentos.push(item('item-t-anel', { equipado: true }), item('item-gambeson', { equipado: true, inv: { armadura: 'Pesada' } }));
  const ef = Object.assign({}, EF, { 'item-gambeson': EFEITOS.porId['item-gambeson'] });
  const r = R.avaliar(f, { efeitos: ef });
  assert.equal(val(r, 'ar'), 3 + 2, 'Ar natural do Caxon + Gambeson, sem teto');
  assert.equal(val(r, 'defesa.cortante'), 5);
  assert.equal(val(r, 'defesa.contundente'), 5 + 3);
  assert.equal(val(r, 'defesa.fogo'), 1 + 2 + 1);
  assert.equal(r.nos['defesa.fogo'].extra.R, true);
  assert.equal(val(r, 'resistencia.fogo'), true);
  assert.equal(val(r, 'defesa.forca'), 0, 'Força: sem Ae de categoria e fora do Ae(Todos)');
  assert.match(termo(r.nos['defesa.forca'], /Ae de categoria/).motivo, /Outros/);
  // o Ar natural do Caxon não vale para o Krichama
  assert.equal(val(R.avaliar(ficha({ raca: 'anao', variante: 'anao-krichama' })), 'ar'), 0);
});

// ---------------- itens e efeitos ----------------
test('itens pelo "quando": equipado só equipado, acumulaCopia false conta 1, acumula:false vale o maior', () => {
  const f = ficha({ attrs: { SAB: 10 } });
  f.inventario.equipamentos.push(item('item-t-capa'));
  f.inventario.bugigangas.push(item('item-t-amuleto', { qtd: 2 }), item('item-t-amuleto'));
  f.inventario.bugigangas.push(item('item-t-brasas'), item('item-t-colar'));
  const r = avalia(f);
  assert.equal(val(r, 'evasao.passiva'), 10, 'capa não equipada');
  assert.match(r.efeitos.mods.find((m) => m.fonte.id === 'item-t-capa').motivo, /equipado/);
  assert.equal(val(r, 'pericia.percepcao.total'), 2, 'amuleto: outra cópia não acumula');
  assert.equal(val(r, 'pericia.vontade.total'), 3, 'Brasas (+3, acumula:false) vence o Colar (+1)');
  assert.match(termo(r.nos['pericia.vontade.total'], /colar/).motivo, /não acumula/);
  assert.deepEqual(r.nos['pericia.percepcao.total'].selos, ['decisaoPedro']);
});

test('condição com imunidade não mexe nos números; condição sem X usa o padrão com selo', () => {
  const f = ficha({ raca: 'humano' });
  f.imunidadesCondicao = ['lento'];
  f.condicoes.push(cond('lento', 2));
  let r = avalia(f);
  assert.equal(val(r, 'movimento'), 9);
  assert.match(r.efeitos.mods.find((m) => m.fonte.id === 'lento').motivo, /imune/);
  const g = ficha({ raca: 'humano' });
  g.condicoes.push(cond('lento'));
  r = avalia(g);
  assert.equal(val(r, 'movimento'), 6, 'Lento sem X = Lento 1 (G8)');
  assert.ok(r.nos.movimento.selos.includes('decisaoPedro'), 'o padrão G8 é decisão: sai com selo');
});

// ---------------- ajustes (M2) ----------------
test('ajuste por nó: fixo e diferença, "calculado X · ajustado Y", propaga para os dependentes', () => {
  const f = ficha({ raca: 'humano', classe: 'monge', attrs: { DES: 14 }, pericias: { defender: 1 } });
  f.ajustes['atributo.DES.mod'] = { modo: 'fixa', valor: 5, desde: 'x', motivo: 'bênção' };
  let r = avalia(f);
  assert.equal(val(r, 'atributo.DES.mod'), 5);
  assert.equal(r.nos['atributo.DES.mod'].calculado, 2);
  assert.match(r.nos['atributo.DES.mod'].formula.numerica, /calculado 2 · ajustado 5$/);
  assert.ok(r.nos['atributo.DES.mod'].selos.includes('ajuste'));
  assert.equal(val(r, 'evasao.passiva'), 15, 'Evasão lê o Mod.DES ajustado');
  assert.equal(val(r, 'pericia.reflexos.total'), 5);
  assert.equal(val(r, 'evasao.ativa'), '15 + 1d8');
  f.ajustes['evasao.passiva'] = { modo: 'soma', valor: 2, desde: 'x' };
  r = avalia(f);
  assert.equal(val(r, 'evasao.passiva'), 17);
  assert.equal(val(r, 'evasao.ativa'), '17 + 1d8', 'a Ativa acompanha a Passiva ajustada');
  f.ajustes['pericia.defender.total'] = { modo: 'fixa', valor: '1d12', desde: 'x' };
  f.ajustes['evasao.ativa'] = { modo: 'soma', valor: 1, desde: 'x' };
  r = avalia(f);
  assert.equal(val(r, 'evasao.ativa'), '18 + 1d12');
  // Movimento: fixo e a propagação pela carga (capacidade ajustada tira o Sobrepeso)
  const g = ficha({ raca: 'humano', attrs: { FOR: 10 } });
  g.inventario.bugigangas.push(avulso('Pedras', 15));
  r = avalia(g);
  assert.equal(val(r, 'movimento'), 4.5);
  g.ajustes['capacidade.bugigangas'] = { modo: 'soma', valor: 10, desde: 'x' };
  r = avalia(g);
  assert.equal(val(r, 'carga'), 'nenhuma');
  assert.equal(val(r, 'movimento'), 9);
  g.ajustes.movimento = { modo: 'fixa', valor: 12, desde: 'x', calculadoEm: 7.5 };
  r = avalia(g);
  assert.equal(val(r, 'movimento'), 12);
  assert.equal(r.nos.movimento.calculado, 9);
  assert.match(r.nos.movimento.formula.numerica, /calculado 9 · ajustado 12$/);
  assert.equal(r.nos.movimento.ajuste.mudou, true);
  assert.ok(r.nos.movimento.avisos.some((a) => /mudou de 7,5 para 9/.test(a.msg)));
  const l = AJ.listar(g, r.nos);
  assert.deepEqual(l.map((x) => [x.caminho, x.calculado, x.ajustado]), [['capacidade.bugigangas', 10, 20], ['movimento', 9, 12]]);
});

test('ajuste em Saúde máx. muda o tique de Morrendo; caminho de estado é recusado', () => {
  const f = ficha({ classe: 'brutalista', nivel: 3, attrs: { CON: 14 } });
  let r = R.avaliar(f);
  assert.equal(val(r, 'recurso.saude.max'), 10 + 24 + 6);
  assert.equal(val(r, 'morrendo.tique'), 4);
  assert.deepEqual(r.nos['morrendo.tique'].selos, ['decisaoPedro']);
  f.ajustes['recurso.saude.max'] = { modo: 'fixa', valor: 70, desde: 'x' };
  assert.equal(val(R.avaliar(f), 'morrendo.tique'), 7);
  const g = ficha({ classe: 'brutalista' });
  g.ajustes['recurso.saude.atual'] = { modo: 'fixa', valor: 3, desde: 'x' };
  r = R.avaliar(g);
  assert.ok(r.avisos.some((a) => a.caminho === 'recurso.saude.atual'));
  assert.equal(E.validarAjuste('recurso.saude.atual', { modo: 'fixa', valor: 3 }), 'caminho-de-estado');
});

test('Limiar: 4 pontos por nível (2–5) menos o custo das cartas por posição; especial custa 2 (D13)', () => {
  const f = ficha({ nivel: 3 });
  const carta = (id, estado) => ({ uid: id, tipo: 'carta', id, estado, cache: { nome: id, versaoCatalogo: '' }, mods: [] });
  f.entradas.push(carta('limiar-a', { posicaoNaMao: 1 }), carta('limiar-b', { posicaoNaMao: 2 }),
    carta('limiar-c', { posicaoNaMao: 3 }), carta('limiar-d', { especial: true, pontos: { FOR: 1, DES: 1 } }), carta('limiar-e', {}));
  const r = R.avaliar(f);
  assert.equal(val(r, 'limiar.saldo'), 8 - 0 - 2 - 3 - 2);
  assert.match(termo(r.nos['limiar.saldo'], /limiar-e/).motivo, /posição na mão não anotada/);
  assert.equal(val(r, 'atributo.FOR.total'), 11, 'carta especial: +2 atributo distribuído');
});

// ---------------- fórmula em todo nó, selos, catálogo indisponível ----------------
function fichaCheia() {
  const f = ficha({ raca: 'dryad', classe: 'espadachim', nivel: 4, attrs: { FOR: 14, DES: 16, CON: 13, INT: 9, SAB: 12 },
    escolhas: { 'raca.atributos.0': 'DES', 'raca.atributos.1': 'INT' }, pericias: { atacar: 2, defender: 1, oficio: 0 } });
  f.condicoes.push(cond('lento', 1), cond('bebado'), cond('enfeiticado'));
  f.inventario.equipamentos.push(item('item-adaga-de-kali', { equipado: true }), item('item-gambeson', { equipado: true, inv: { armadura: 'Pesada' } }));
  f.inventario.bugigangas.push(item('item-mochila-reforcada', { inv: { capacidade: { bug: 3, equip: 1 }, acumula: false } }));
  f.entradas.push({ uid: 'm', tipo: 'magia', id: 'magia-dardo-arcano', estado: { intensidade: 'forcada' }, cache: { nome: 'Dardo', versaoCatalogo: '' }, mods: [] });
  f.entradas.push({ uid: 't', tipo: 'tecnica', id: 'monge-explosao', estado: {}, cache: { nome: 'Explosão', versaoCatalogo: '' }, mods: [] });
  f.ajustes.cd = { modo: 'soma', valor: 1, desde: 'x' };
  return f;
}

test('todo nó tem fórmula simbólica e numérica não vazias; todo termo tem status; não canônico sai com selo', () => {
  [ficha(), ficha({ classe: 'teurgo' }), fichaCheia()].forEach((f) => {
    const r = R.avaliar(f, { efeitos: EFEITOS });
    assert.ok(r.ordem.length > 100);
    r.ordem.forEach((c) => {
      const no = r.nos[c];
      assert.ok(no.formula.simbolica && no.formula.simbolica.trim(), c + ': simbólica vazia');
      assert.ok(/^= \S/.test(no.formula.numerica), c + ': numérica vazia ou sem "="');
      no.termos.forEach((t) => {
        assert.ok(t.status in D.selos, c + ': termo sem status do mapa (' + t.status + ')');
        assert.ok(t.fonte && t.fonte.tipo, c + ': termo sem fonte');
        if (t.ativo && D.selos[t.status]) assert.ok(no.selos.includes(D.selos[t.status]), c + ': termo ' + t.status + ' sem selo');
      });
    });
  });
});

test('ordem topológica: todo nó vem depois das dependências (Mod antes de Evasão, Passiva antes da Ativa…)', () => {
  const r = R.avaliar(fichaCheia(), { efeitos: EFEITOS });
  const pos = (c) => r.ordem.indexOf(c);
  assert.ok(pos('atributo.DES.total') < pos('atributo.DES.mod'));
  assert.ok(pos('atributo.DES.mod') < pos('evasao.passiva'));
  assert.ok(pos('evasao.passiva') < pos('evasao.ativa'));
  assert.ok(pos('pericia.defender.total') < pos('evasao.ativa'));
  assert.ok(pos('capacidade.bugigangas') < pos('carga'));
  assert.ok(pos('carga') < pos('movimento'));
  assert.ok(pos('recurso.saude.max') < pos('morrendo.tique'));
  assert.ok(r.ordem.filter((c) => /^ataque\..*\.atacar$/.test(c)).every((c) => pos('pericia.atacar.total') < pos(c)));
});

test('técnica só vale ativa; a trilha diz de onde veio cada Mod', () => {
  const f = fichaCheia();
  let r = R.avaliar(f, { efeitos: EFEITOS });
  const ex = r.efeitos.mods.find((m) => m.fonte.id === 'monge-explosao');
  assert.equal(ex.ativo, false);
  assert.match(ex.motivo, /técnica/);
  assert.equal(r.nos.movimento.valor, 10.5 - 1.5 - 3, 'Dryad − Gambeson − Lento 1');
  f.entradas.find((e) => e.id === 'monge-explosao').estado.ativo = true;
  r = R.avaliar(f, { efeitos: EFEITOS });
  assert.equal(r.nos.movimento.valor, (10.5 - 1.5 - 3) * 2, 'Explosão ativa: × 2 depois das somas');
  const t = F.trilha(r.efeitos, 'movimento').map((m) => m.fonte.id);
  ['item-gambeson', 'lento', 'monge-explosao'].forEach((id) => assert.ok(t.includes(id), id + ' na trilha'));
  assert.ok(F.porFonte(r.efeitos)['ajuste:cd'], 'o ajuste também está na trilha');
});

test('catálogo indisponível: o snapshot entrada.mods, reconciliado e depois órfão, dá o mesmo número', () => {
  // o catálogo real ainda não tem Mods (data/catalogo/*.json): uma cópia com uma origem que dá +1 na Passiva
  const ents = A.entradasCatalogo().map((e) => (e.id === 'origem-academico'
    ? Object.assign({}, e, { mods: [{ alvo: 'evasao.passiva', op: 'soma', valor: 1, status: 'decisao' }] }) : e));
  const idx = E.indiceCatalogo(ents, 'com-mods');
  const f = ficha({ attrs: { DES: 14 } });
  f.entradas.push({ uid: 'o1', tipo: 'origem', id: 'origem-academico', estado: {}, cache: { nome: 'Acadêmico', versaoCatalogo: '' }, mods: [] });
  assert.equal(val(R.avaliar(f, { efeitos: EF, catalogo: idx }), 'evasao.passiva'), 12, 'sem reconciliar, ainda sem snapshot');
  assert.deepEqual(E.reconciliar(f, idx), []);
  assert.equal(f.entradas[0].mods.length, 1, 'o snapshot acompanha o catálogo');
  const com = R.avaliar(f, { efeitos: EF, catalogo: idx });
  assert.equal(val(com, 'evasao.passiva'), 13);
  assert.deepEqual(com.nos['evasao.passiva'].selos, ['decisaoPedro']);
  // o id some do catálogo: a entrada fica órfã e o snapshot segue valendo
  const idx2 = E.indiceCatalogo(ents.filter((e) => e.id !== 'origem-academico'), 'sem-academico');
  assert.deepEqual(E.reconciliar(f, idx2), ['o1']);
  assert.equal(f.entradas[0].orfao.motivo, 'sumiu');
  [R.avaliar(f, { efeitos: EF, catalogo: idx2 }), R.avaliar(f, { efeitos: EF, catalogo: null })].forEach((sem) => {
    assert.deepEqual(sem.ordem, com.ordem);
    sem.ordem.forEach((c) => assert.deepEqual(sem.nos[c].valor, com.nos[c].valor, c));
    const m = sem.efeitos.mods.find((x) => x.fonte.id === 'origem-academico');
    assert.equal(m.ativo, true);
    assert.match(m.motivo, /entrada órfã/);
  });
  // sem data/efeitos.json: os itens saem dos números, mas com aviso (nada calado)
  const g = fichaCheia();
  const semEf = R.avaliar(g, { efeitos: null });
  assert.ok(semEf.avisos.some((a) => a.tipo === 'efeitos-indisponiveis'));
  assert.equal(semEf.nos.ar.valor, R.avaliar(g, { efeitos: EFEITOS }).nos.ar.valor - 2);
});

test('migração real (Lira, Batedor nv2): o calculado do KhRegras é o que o F3a contou à mão e poda os ajustes', () => {
  const V2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'ficha-v2-sintetica.json'), 'utf8'));
  const idx = E.indiceCatalogo(A.entradasCatalogo(), 'teste-1');
  const op = { agora: () => '2026-09-28T12:00:00.000Z', aleatorio: A.semente(7), catalogo: idx };
  const f = E.migrar(V2, op).ficha;
  const calc = R.calculados(f, { efeitos: EFEITOS });
  const esperado = { 'evasao.passiva': 13, 'recurso.classe.max': 5, 'recurso.saude.max': 20, 'recurso.stamina.max': 28, cd: 15 };
  Object.keys(esperado).forEach((k) => assert.equal(calc[k], esperado[k], k));
  const g = E.migrar(V2, Object.assign({}, op, { calculado: (x) => R.calculados(x, { efeitos: EFEITOS }) })).ficha;
  assert.equal(g.migracao.ajustesPendentesDePoda, undefined);
  assert.equal(g.ajustes['evasao.passiva'], undefined, 'Evasão 13 digitada = calculada: sem ajuste');
  const r = R.avaliar(g, { efeitos: EFEITOS });
  assert.equal(val(r, 'recurso.saude.max'), 22, 'o máximo digitado na v2 (22) segue como ajuste');
  assert.equal(r.nos['recurso.saude.max'].calculado, 20);
});

// ---------------- correções da revisão da F3b ----------------
test('fórmula numérica com Mod negativo multiplicando o Nível: "10 + 3 × 3 − 2 × 3" (sem parêntese quebrado)', () => {
  const r = R.avaliar(ficha({ classe: 'teurgo', nivel: 3, attrs: { FOR: 6, DES: 7, CON: 7, INT: 8, SAB: 9 } }));
  assert.equal(r.nos['recurso.saude.max'].formula.numerica, '= 10 + 3 × 3 − 2 × 3 = 13');
  assert.equal(r.nos['recurso.stamina.max'].formula.numerica, '= 8 + 3 × 3 − 2 × 3 = 11');
  assert.equal(r.nos['recurso.eter.max'].formula.numerica, '= 6 + 9 × 3 − 1 × 3 = 30');
  assert.equal(r.nos['pericia.reflexos.total'].formula.numerica, '= −2 + 0 = −2');
  const soma = (b) => R.aval({ t: 'op', op: '+', a: { t: 'num', v: 1 }, b }, { ref: () => ({}) }).num;
  assert.equal(soma({ t: 'num', v: -2 }), '1 − 2');
  assert.equal(soma({ t: 'op', op: '+', a: { t: 'num', v: -2 }, b: { t: 'num', v: 3 } }), '1 − 2 + 3');
});

test('status não canônico se propaga pelos nós dependentes (atributo → Mod → Evasão, perícia, CD, Morrendo)', () => {
  const f = ficha({ classe: 'monge', attrs: { DES: 14, SAB: 12 }, pericias: { defender: 1 } });
  f.inventario.bugigangas.push(item('item-t-coroa'));
  let r = avalia(f);
  assert.equal(val(r, 'atributo.DES.total'), 16);
  ['atributo.DES.total', 'atributo.DES.mod', 'evasao.passiva', 'evasao.ativa', 'pericia.reflexos.total', 'cd']
    .forEach((c) => assert.ok(r.nos[c].selos.includes('decisaoPedro'), c + ' sem o selo da fonte decisão'));
  assert.deepEqual(r.nos['atributo.FOR.mod'].selos, [], 'o que não depende de DES fica sem selo');
  // variante sem status (Dryad Cascaferro): o selo sai da Passiva e chega à Ativa
  r = R.avaliar(ficha({ raca: 'dryad', variante: 'dryad-cascaferro', classe: 'monge', nivel: 5, attrs: { DES: 14 } }));
  assert.ok(r.nos['evasao.passiva'].selos.includes('pendenteBalanceamento'));
  assert.ok(r.nos['evasao.ativa'].selos.includes('pendenteBalanceamento'));
  // CON sem status: o selo chega à Saúde máx. e ao tique de Morrendo
  const h = ficha({ classe: 'brutalista', nivel: 2, attrs: { CON: 12 } });
  h.inventario.bugigangas.push(item('item-t-con'));
  r = avalia(h);
  assert.ok(r.nos['recurso.saude.max'].selos.includes('pendenteBalanceamento'));
  assert.ok(r.nos['morrendo.tique'].selos.includes('pendenteBalanceamento'));
});

test('"extra" da fonte nunca some: Premonição Etérica troca o dado de Defender (2d6) e o "+1 Reação Máxima" vira lembrete', () => {
  const f = ficha({ raca: 'corrompido', attrs: { DES: 12 }, pericias: { defender: 1 } });
  f.entradas.push({ uid: 'p', tipo: 'corrupcao', id: 'corrompido-premonicao-eterica', estado: {}, cache: { nome: 'Premonição Etérica', versaoCatalogo: '' }, mods: [] });
  let r = R.avaliar(f);
  assert.equal(val(r, 'evasao.passiva'), 12);
  assert.equal(val(r, 'pericia.defender.total'), '2d6', 'o 1d8 do Treinado é menor: vale 2d6');
  assert.equal(val(r, 'evasao.ativa'), '12 + 2d6');
  assert.ok(r.nos['pericia.defender.total'].selos.includes('decisaoPedro'));
  assert.ok(r.nos['evasao.ativa'].selos.includes('decisaoPedro'));
  assert.equal(termo(r.nos['pericia.defender.total'], /^Dado de Defender \(/).ativo, false);
  assert.ok(r.nos['evasao.passiva'].lembretes.some((l) => l.op === 'extra' && /2d6/.test(l.msg)));
  f.pericias.defender = 4;
  r = R.avaliar(f);
  assert.equal(val(r, 'pericia.defender.total'), '2d8', 'o Lendário mantém 2d8');
  assert.match(termo(r.nos['pericia.defender.total'], /Premonição/).motivo, /não é menor/);
  const g = ficha({ attrs: { DES: 10 } });
  g.entradas.push({ uid: 'e', tipo: 'beneficio', id: 'abismo-esquiva-lendaria', estado: {}, cache: { nome: 'Esquiva Lendária', versaoCatalogo: '' }, mods: [] });
  r = R.avaliar(g);
  assert.equal(val(r, 'evasao.passiva'), 15);
  ['evasao.passiva', 'evasao.ativa'].forEach((c) => {
    assert.ok(r.nos[c].lembretes.some((l) => l.op === 'extra' && /Reacao Maxima/.test(l.msg)), c);
    assert.equal(termo(r.nos[c], /além do número/).status, 'semStatus', c);
  });
});

test('Exaurido marca as 24 perícias; estados finais (Exaustão 5, Saúde/Éter abaixo de −⌊máx/2⌋, Desnutrido zerando) só alertam', () => {
  const f = ficha({ classe: 'teurgo', nivel: 2, attrs: { CON: 12, INT: 12 } });
  f.condicoes.push(cond('exaurido'), cond('exaustao', 5));
  let r = avalia(f);
  D.pericias.forEach((p) => assert.ok(r.nos['pericia.' + p.id + '.total'].lembretes.some((l) => l.op === 'semAcao' && l.alvo === 'todasAsPericias'), p.id));
  const ex = r.alertas.find((a) => a.id === 'exaustao-5');
  assert.equal(ex.tipo, 'estado-final');
  assert.equal(ex.automatico, false);
  assert.match(ex.msg, /morte/);
  const smax = val(r, 'recurso.saude.max'), emax = val(r, 'recurso.eter.max');
  f.recursos.saude.atual = -Math.floor(smax / 2);
  f.recursos.eter.atual = -Math.floor(emax / 2);
  r = avalia(f);
  assert.ok(!r.alertas.some((a) => a.id === 'saude-abaixo-metade-negativa'), 'no limite exato ainda não');
  f.recursos.saude.atual -= 1; f.recursos.eter.atual -= 1;
  r = avalia(f);
  const sa = r.alertas.find((a) => a.id === 'saude-abaixo-metade-negativa');
  assert.equal(sa.status, 'canonico');
  assert.equal(sa.formula.numerica, '= ' + R.fmt(f.recursos.saude.atual) + ' < −⌊' + smax + ' / 2⌋ = ' + R.fmt(-Math.floor(smax / 2)));
  const ea = r.alertas.find((a) => a.id === 'eter-metade-negativa');
  assert.match(ea.msg, /mestre/);
  assert.equal(ea.selo, 'pendenteBalanceamento', 'o mínimo do Éter não tem status no contrato');
  assert.equal(f.recursos.saude.atual, -Math.floor(smax / 2) - 1, 'nada é aplicado na ficha');
  const g = ficha({ classe: 'teurgo', nivel: 1, attrs: { CON: 10 } });
  g.condicoes.push(cond('desnutrido', 2));
  r = avalia(g);
  assert.ok(r.alertas.some((a) => a.id === 'desnutrido-max-zero'));
  assert.ok(!r.avisos.some((a) => a.tipo === 'estado-final-sem-detector'), 'todo estado final do contrato tem detector');
});

test('máximo: dívida acumulada (Exigente) entra DEPOIS do percentual (ordemMaximo, P03)', () => {
  const f = ficha({ classe: 'teurgo', nivel: 1, attrs: { FOR: 10, DES: 10 } });
  f.inventario.bugigangas.push(item('item-t-meia'));
  f.entradas.push({ uid: 'x', tipo: 'dor', id: 'abismo-exigente', estado: { acumulado: -4 }, cache: { nome: 'Exigente', versaoCatalogo: '' }, mods: [] });
  const r = avalia(f);
  assert.equal(val(r, 'recurso.stamina.max'), Math.floor((8 + 3) * 0.5 - 4), '(11 × 0,5) − 4, não (11 − 4) × 0,5');
  assert.match(termo(r.nos['recurso.stamina.max'], /Exigente/).motivo, /depois do percentual/);
  assert.match(r.nos['recurso.stamina.max'].formula.numerica, /\) × 0,5 − 4/);
});

test('tooltips sem repetir o resultado; Limiar no nível 1 sem "níveis de 2 a 1"', () => {
  const r = R.avaliar(ficha({ classe: 'monge', raca: 'humano', nivel: 3, attrs: { DES: 16 }, pericias: { defender: 1 } }));
  assert.equal(r.nos['evasao.ativa'].formula.numerica, '= 13 + 1d8');
  assert.equal(r.nos.movimento.formula.numerica, '= 9');
  assert.equal(r.nos.acoes.formula.numerica, '= 3');
  assert.equal(r.nos['limiar.saldo'].formula.numerica, '= 8');
  const l = R.avaliar(ficha({ nivel: 1 })).nos['limiar.saldo'];
  assert.match(l.formula.simbolica, /^nenhum nível com pontos ainda/);
  assert.doesNotMatch(l.formula.simbolica, /de 2 a 1/);
});

test('PMA: "soma" soma sobre a PMA em vigor; fixo + soma sai com selo (ordem fora do contrato)', () => {
  const f = ficha({ attrs: { DES: 14 } });
  const leve = item('item-t-leve', { equipado: true });
  f.inventario.equipamentos.push(leve);
  f.inventario.bugigangas.push(item('item-t-pma-soma'));
  let no = avalia(f).nos['ataque.' + leve.uid + '.atacar'];
  assert.equal(no.progressao.pma, -3, '−5 + 2');
  assert.equal(termo(no, /pma-soma/).ativo, true);
  f.inventario.bugigangas.push(item('item-t-pma-fixa'));
  no = avalia(f).nos['ataque.' + leve.uid + '.atacar'];
  assert.equal(no.progressao.pma, -1, 'fixo −3, depois + 2');
  assert.equal(termo(no, /pma-soma/).status, 'semStatus');
  assert.ok(no.selos.includes('pendenteBalanceamento'));
  // Mãos Rápidas (escopo turno) fica fora com o motivo, nunca calada
  const g = ficha({ attrs: { DES: 14 } });
  g.inventario.equipamentos.push(leve);
  g.entradas.push({ uid: 'mr', tipo: 'tecnica', id: 'batedor-maos-rapidas', estado: { ativo: true }, cache: { nome: 'Mãos Rápidas', versaoCatalogo: '' }, mods: [] });
  const t = termo(avalia(g).nos['ataque.' + leve.uid + '.atacar'], /Mãos Rápidas/);
  assert.equal(t.ativo, false);
  assert.match(t.motivo, /situacional/);
});

test('Stamina comprometida (D19): disponível = atual − reserva, termo removível e com selo', () => {
  const f = ficha({ classe: 'monge' });
  f.recursos.stamina.atual = 10;
  let r = R.avaliar(f);
  assert.equal(val(r, 'recurso.stamina.disponivel'), 10);
  assert.deepEqual(r.nos['recurso.stamina.disponivel'].selos, []);
  f.recursos.stamina.comprometida = 3;
  r = R.avaliar(f);
  assert.equal(val(r, 'recurso.stamina.disponivel'), 7);
  assert.equal(r.nos['recurso.stamina.disponivel'].formula.numerica, '= 10 − 3 = 7');
  assert.deepEqual(r.nos['recurso.stamina.disponivel'].selos, ['decisaoPedro']);
  assert.equal(R.calculados(f)['recurso.stamina.disponivel'], undefined, 'não é caminho de ajuste (é estado)');
});
