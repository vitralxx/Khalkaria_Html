'use strict';
// Estado de jogo na ficha (03 §16, passo 3): as ações de um clique do KhEdicao.acao
// (condições, descansos, usos, consumir) e a faixa "Em jogo" do KhFichaAbas.
// As regras saem do contrato (descanso.curto/longo, recargas) e do texto canônico
// do Desnutrido; o máximo de usos, de data/usos.json (usos/1). Tudo puro: nada grava.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const KE = require('../../js/ficha/kh-estado.js');
const ED = require('../../js/ficha/kh-edicao.js');
const RG = require('../../js/ficha/kh-regras.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');

const RAIZ = path.join(__dirname, '..', '..');
const USOS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'usos.json'), 'utf8'));
const D = RG.dados();

function ficha(op) {
  const f = KE.novaFicha({ nome: 'Teste' });
  f.identidade.classe = { id: 'classe-monge', nome: 'Monge' };
  return Object.assign(f, op || {});
}
// aplica as mudanças de um resultado do acao numa cópia
function aplica(f, r) {
  assert.ok(r.ok, r.erro);
  const g = JSON.parse(JSON.stringify(f));
  r.mudancas.forEach((m) => {
    const ps = m.caminho.split('.');
    let o = g;
    ps.slice(0, -1).forEach((k) => { o = o[k]; });
    o[ps[ps.length - 1]] = m.valor;
  });
  return g;
}
const cond = (f, id) => f.condicoes.filter((c) => c.id === id);
const seq = () => { let i = 0; return () => ((i++ * 7) % 36) / 36; };

test('condição: nova, +1 até o máximo, −1 até 1, remover; derivada não entra à mão', () => {
  let f = ficha();
  const op = { aleatorio: seq() };
  f = aplica(f, ED.acao(f, 'condicao.nova', 'atordoado', op));
  assert.equal(cond(f, 'atordoado').length, 1);
  assert.equal(cond(f, 'atordoado')[0].x, null);
  assert.equal(ED.acao(f, 'condicao.nova', 'atordoado', op).ok, false, 'sem X, a ativa não entra outra vez');
  f = aplica(f, ED.acao(f, 'condicao.nova', 'exaustao', op));
  const uid = cond(f, 'exaustao')[0].uid;
  for (let i = 0; i < 4; i++) f = aplica(f, ED.acao(f, 'condicao.mais', uid, op));
  assert.equal(cond(f, 'exaustao')[0].x, 5);
  assert.equal(ED.acao(f, 'condicao.mais', uid, op).ok, false, 'Exaustão vai até 5');
  for (let i = 0; i < 4; i++) f = aplica(f, ED.acao(f, 'condicao.menos', uid, op));
  assert.equal(ED.acao(f, 'condicao.menos', uid, op).ok, false, 'o mínimo é 1');
  f = aplica(f, ED.acao(f, 'condicao.remover', uid, op));
  assert.equal(cond(f, 'exaustao').length, 0);
  ['morrendo', 'exaurido', 'oco', 'sobrepeso-leve', 'sobrepeso-extremo'].forEach((id) => {
    assert.equal(ED.acao(f, 'condicao.nova', id, op).ok, false, id + ' vem dos números');
  });
});

test('descanso longo com comida e luz: Exaustão e Desnutrido −1, temporária some, usos curto, longo e dia voltam', () => {
  const f = ficha();
  f.condicoes = [{ uid: 'c1', id: 'exaustao', x: 2, duracao: null }, { uid: 'c2', id: 'desnutrido', x: 1, duracao: null },
    { uid: 'c3', id: 'lento', x: 1, duracao: null }];
  f.recursos.saude.temporaria = 6;
  f.entradas = [
    { uid: 'e1', tipo: 'tecnica', id: 'espadachim-trebado', estado: { usos: { gastos: 2 } } },          // longo
    { uid: 'e2', tipo: 'carta', id: 'limiar-pacto-sanguinario', estado: { usos: { gastos: 1 } } },     // dia
    { uid: 'e3', tipo: 'tecnica', id: 'teurgo-respiracao-primordial', estado: { usos: { gastos: 1 } } } // curto
  ];
  ['espadachim-trebado', 'limiar-pacto-sanguinario', 'teurgo-respiracao-primordial'].forEach((id) => assert.ok(USOS.porId[id], id));
  const r = ED.acao(f, 'descanso.longo', 'completo', { usos: USOS.porId });
  const g = aplica(f, r);
  assert.equal(cond(g, 'exaustao')[0].x, 1);
  assert.equal(cond(g, 'desnutrido').length, 0, 'Desnutrido 1 → sai');
  assert.equal(cond(g, 'lento')[0].x, 1, 'condição sem duração fica');
  assert.equal(g.recursos.saude.temporaria, 0);
  assert.equal(g.entradas[0].estado.usos.gastos, 0);
  assert.equal(g.entradas[1].estado.usos.gastos, 0);
  assert.equal(g.entradas[2].estado.usos.gastos, 0, 'o longo devolve também os curtos (03 §18)');
  assert.match(r.aviso, /Exaustão 2 → 1/);
});

test('descanso longo sem comida ou luz: nada que exige descanso longo sai, Desnutrido +1, usos voltam', () => {
  const f = ficha();
  f.condicoes = [{ uid: 'c1', id: 'exaustao', x: 2, duracao: null }];
  f.entradas = [{ uid: 'e1', tipo: 'tecnica', id: 'espadachim-trebado', estado: { usos: { gastos: 3 } } }];
  let g = aplica(f, ED.acao(f, 'descanso.longo', 'sem', { usos: USOS.porId, aleatorio: seq() }));
  assert.equal(cond(g, 'exaustao')[0].x, 2);
  assert.equal(cond(g, 'desnutrido')[0].x, 1);
  assert.equal(g.entradas[0].estado.usos.gastos, 0);
  g = aplica(g, ED.acao(g, 'descanso.longo', 'sem', { usos: USOS.porId, aleatorio: seq() }));
  assert.equal(cond(g, 'desnutrido').length, 1, 'soma no mesmo, não duplica');
  assert.equal(cond(g, 'desnutrido')[0].x, 2);
});

test('descanso curto: só os usos curto; sem nada a fazer, avisa', () => {
  const f = ficha();
  f.entradas = [{ uid: 'e1', tipo: 'tecnica', id: 'teurgo-respiracao-primordial', estado: { usos: { gastos: 1 } } },
    { uid: 'e2', tipo: 'tecnica', id: 'espadachim-trebado', estado: { usos: { gastos: 1 } } }];
  const g = aplica(f, ED.acao(f, 'descanso.curto', null, { usos: USOS.porId }));
  assert.equal(g.entradas[0].estado.usos.gastos, 0);
  assert.equal(g.entradas[1].estado.usos.gastos, 1);
  assert.equal(ED.acao(g, 'descanso.curto', null, { usos: USOS.porId }).ok, false);
});

test('Reagentes volta ao máximo no descanso longo (descanso.longo.efeitos)', () => {
  const f = ficha();
  f.identidade.classe = { id: 'classe-alquimista', nome: 'Alquimista' };
  f.meta.nivel = 2;
  f.recursos.classe = { id: 'reagentes', nome: 'Reagentes', atual: 1 };
  const av = RG.avaliar(f, {});
  const mx = av.nos['recurso.classe.max'];
  assert.equal(mx.medidor, 'reagentes');
  const g = aplica(f, ED.acao(f, 'descanso.longo', 'completo', { nos: av.nos }));
  assert.equal(g.recursos.classe.atual, mx.valor);
});

test('usos: o máximo pela fórmula (1 + Mod.SAB), gastar até o fim, devolver', () => {
  const f = ficha();
  f.atributos.base.SAB = 14;                                           // Mod +2
  f.entradas = [{ uid: 'e1', tipo: 'traco', id: 'humano-persistencia-humana', estado: {} }];
  const reg = USOS.porId['humano-persistencia-humana'];
  const nos = RG.avaliar(f, {}).nos;
  const mx = ED.maxUsos(reg, f, nos);
  assert.equal(mx.valor, 1 + nos['atributo.SAB.mod'].valor);
  assert.deepEqual(mx.partes.map((p) => p.rotulo), ['', 'Mod.SAB']);
  let g = f;
  for (let i = 0; i < mx.valor; i++) g = aplica(g, ED.acao(g, 'uso.gastar', 'e1', { usos: USOS.porId, nos }));
  assert.equal(ED.gastosDe(g.entradas[0]), mx.valor);
  const sem = ED.acao(g, 'uso.gastar', 'e1', { usos: USOS.porId, nos });
  assert.equal(sem.ok, false);
  assert.match(sem.erro, /descanso longo/);
  g = aplica(g, ED.acao(g, 'uso.devolver', 'e1', { usos: USOS.porId, nos }));
  assert.equal(ED.gastosDe(g.entradas[0]), mx.valor - 1);
  // turno, rodada, combate e cena: a Mesa conta, a ficha não
  g.entradas.push({ uid: 'e2', tipo: 'tecnica', id: 'espadachim-brecha', estado: {} });
  assert.equal(ED.acao(g, 'uso.gastar', 'e2', { usos: USOS.porId, nos }).ok, false);
});

test('consumir: tira 1; o último sai do inventário', () => {
  const f = ficha();
  f.inventario.bugigangas = [{ uid: 'i1', nome: 'Poção', categoria: 'Consumível', qtd: 2 }];
  let g = aplica(f, ED.acao(f, 'consumir', 'i1', {}));
  assert.equal(g.inventario.bugigangas[0].qtd, 1);
  g = aplica(g, ED.acao(g, 'consumir', 'i1', {}));
  assert.equal(g.inventario.bugigangas.length, 0);
  assert.equal(ED.acao(g, 'consumir', 'i1', {}).ok, false);
});

test('faixa Em jogo: recursos, condições com origem, + Condição sem as derivadas e descansos só na edição', () => {
  const f = ficha();
  f.recursos.saude.atual = 10;
  f.recursos.stamina.atual = 5;
  f.recursos.saude.temporaria = 4;
  f.condicoes = [{ uid: 'c1', id: 'adormecido', x: null, duracao: null }, { uid: 'c2', id: 'lento', x: 2, duracao: null }];
  const res = { estado: 'ok', ficha: f, av: RG.avaliar(f, {}) };
  const M = FA.criar({ prefixo: 'fp' });
  const dados = { catalogos: [JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'catalogo', 'condicao.json'), 'utf8'))], usos: USOS };
  const ler = M.paineis(res, { dados, D, base: '../' });
  assert.ok(ler.jogo && ler.jogo.rec && ler.jogo.cond);
  assert.match(ler.jogo.rec, /data-campo="jogo-saude"/);
  assert.match(ler.jogo.rec, /\+4<span class="fp-jogo-temp-rot"> temporária<\/span>/);
  assert.match(ler.jogo.cond, /Lento 2/);
  assert.match(ler.jogo.cond, /Inconsciente <span class="fp-sub">por Adormecido<\/span>/);
  assert.doesNotMatch(ler.jogo.cond, /data-ed-acao/, 'sem o Ensaio, só leitura');
  const ed = M.paineis(res, { dados, D, base: '../', editar: 'pagina' });
  assert.match(ed.jogo.cond, /data-ed-acao="descanso.curto"/);
  assert.match(ed.jogo.cond, /data-ed-acao="descanso.longo" data-ed-arg="sem"/);
  assert.match(ed.jogo.cond, /data-ed-acao="condicao.remover" data-ed-arg="c2"/);
  assert.doesNotMatch(ed.jogo.cond, /data-ed-arg="morrendo"/, 'derivada não está no + Condição');
  assert.match(ed.jogo.cond, /data-ed-acao="condicao.nova" data-ed-arg="descontrolado"/);
  // os ids das abas não mudam com a faixa: ela vem depois na mesma passada
  const sem = Object.keys(ed.paineis).map((k) => ed.paineis[k]).join('');
  const ids = (s) => (s.match(/id="fp-d-\d+"/g) || []);
  assert.ok(ids(sem).length > 0);
  assert.ok(ids(ed.jogo.rec).every((i) => ids(sem).indexOf(i) < 0), 'ids da faixa são novos');
});

test('usos por decisão do Pedro (03 §18): Frenesi por nível e Fortaleza de Aço com mínimo 1', () => {
  const f = ficha();
  const fr = USOS.porId['brutalista-frenesi'];
  f.meta.nivel = 2;
  assert.equal(ED.maxUsos(fr, f, {}).valor, 1);
  f.meta.nivel = 4;
  assert.equal(ED.maxUsos(fr, f, {}).valor, 2);
  const fo = USOS.porId['brutalista-fortaleza-de-aco'];
  assert.equal(fo.periodo, 'combate', 'por combate: a Mesa conta');
  const m = ED.maxUsos(fo, f, { 'atributo.CON.mod': { valor: -1 } });
  assert.deepEqual([m.valor, m.minimo], [1, 1]);
  assert.equal(ED.maxUsos(fo, f, { 'atributo.CON.mod': { valor: 3 } }).valor, 3);
});

test('no descanso: lembretes do texto e o Kit de Manutenção soma na pilha (Auto-Reparador)', () => {
  const f = ficha();
  f.entradas = [{ uid: 'e1', tipo: 'tecnologia', id: 'automato-auto-reparador', cache: { nome: 'Auto-Reparador' }, estado: {} },
    { uid: 'e2', tipo: 'tecnica', id: 'artilheiro-municao-especial', cache: { nome: 'Munição Especial' }, estado: {} }];
  const op = { usos: USOS.porId, aoDescansar: USOS.aoDescansar };
  // sem a pilha: só lembretes (e o curto, sem nada a mudar, avisa sem gravar)
  const c = ED.acao(f, 'descanso.curto', null, op);
  assert.equal(c.ok, false);
  assert.match(c.erro, /Munição Especial: Durante um descanso curto, você pode criar 1 Munição Especial como ação de descanso curto/);
  const l0 = ED.acao(f, 'descanso.longo', 'completo', op);
  assert.match(l0.erro || l0.aviso, /Auto-Reparador: Cria 1 Kit de Manutenção por descanso longo \(adicione pelo Bazar\)/);
  // com a pilha: +1
  f.inventario.bugigangas = [{ uid: 'i1', nome: 'Kit de Manutenção', categoria: 'Consumível', qtd: 2 }];
  const r = ED.acao(f, 'descanso.longo', 'completo', op);
  const g = aplica(f, r);
  assert.equal(g.inventario.bugigangas[0].qtd, 3);
  assert.match(r.aviso, /Kit de Manutenção ×2 → ×3 \(Auto-Reparador\)/);
  assert.match(r.aviso, /Munição Especial: durante um descanso longo, você pode criar 2 munições Especiais/);
});

test('usos da variante (03 §18): guardados na referência da identidade, zerados no descanso e na troca', () => {
  const f = ficha();
  f.identidade.raca = { id: 'raca-humano', nome: 'Humano' };
  f.identidade.variante = { id: 'humano-estudioso', nome: 'Estudioso' };
  assert.equal(USOS.porId['humano-estudioso'].periodo, 'longo');
  const op = { usos: USOS.porId };
  let g = aplica(f, ED.acao(f, 'uso.gastar', 'identidade.variante', op));
  assert.deepEqual(g.identidade.variante, { id: 'humano-estudioso', nome: 'Estudioso', estado: { usos: { gastos: 1 } } });
  const sem = ED.acao(g, 'uso.gastar', 'identidade.variante', op);
  assert.equal(sem.ok, false);
  assert.match(sem.erro, /Estudioso: sem usos até o descanso longo/);
  assert.equal(ED.acao(g, 'uso.gastar', 'identidade.classe', op).ok, false, 'só variante e subespécie');
  g = aplica(g, ED.acao(g, 'descanso.longo', 'completo', op));
  assert.equal(g.identidade.variante.estado.usos.gastos, 0);
  // o desenho: o card da variante em Diversas leva o contador da referência
  g.identidade.variante.estado.usos.gastos = 1;
  const res = { estado: 'ok', ficha: g, av: RG.avaliar(g, {}) };
  const dados = { catalogos: ['variante'].map((t) => JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'catalogo', t + '.json'), 'utf8'))), usos: USOS };
  const h = FA.criar({ prefixo: 'fp' }).paineis(res, { dados, D, base: '../', editar: 'pagina' }).paineis.tecnicas;
  assert.match(h, /aria-label="0 de 1 restantes"/);
  assert.match(h, /data-ed-acao="uso.devolver" data-ed-arg="identidade.variante"/);
});
