'use strict';
// Levar para a ficha do Ensaio e o export do Bestiário (F4.6c;
// docs/ficha-digital/07-f4-6-ensaio.md §4): js/ficha/kh-levar.js (KhLevar) e o
// que o drawer da ficha nova (js/ficha/kh-ficha-drawer.js) e a página da ficha
// (js/ficha-pagina.js) fazem com ele. Cobre:
//   - as puras: a ref do card (refDoCard, o MIME application/x-khalkaria-ref,
//     o text/plain da v2.1), os destinos de cada tipo (levar), a repetida, a
//     órfã (nunca apagada), o alias do Bazar (data/bazar-renomeados.json), a
//     carta rara sem efeito, o que falta escolher na identidade, o Bestiário
//     (o mapeamento do CLAUDE.md §5 com os valores do motor, ajustes dentro) e
//     o garantir (o catálogo inteiro; o fetch falho aborta);
//   - no navegador (vm com o kh-ui.js e as fontes do ORDEM, sobre o DOM mínimo,
//     o mesmo harness do ensaio.test.js): sem a prévia e sem o Ensaio nada muda
//     (os controles do build ficam hidden e vazios, o clique, a tecla e o
//     arrasto seguem para a v2.1); com o Ensaio, os 7 tipos de card pelo
//     clique, pela tecla A e pelo arrasto (a alça e o soltar no drawer), o
//     "na ficha", a repetida, o Desfazer do recado, sair (também pelo pageshow
//     do bfcache) e o export do Bestiário na página e no drawer (com o fetch
//     falhando: nada baixado). Em tudo, o armazenamento ESPIÃO: nenhuma escrita
//     no localStorage, e no sessionStorage só o prefixo khalkaria_ensaio: e a marca.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const A = require('./estado-apoio.js');
const DOM = require('./dom-mini.js');
const L = require('../../js/ficha/kh-levar.js');
const E = require('../../js/ficha/kh-ensaio.js');
const KI = require('../../js/ficha/kh-inv.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');
const FP = require('../../js/ficha-pagina.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const DADOS = Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] });
const BAZAR = (() => { const b = A.lerJSON('data', 'bazar.json'); return Array.isArray(b) ? b : b.itens; })();
const CTX = FA.contexto(DADOS);
const BZ = KI.indexar(BAZAR);
const CAT = { ctx: CTX, bazar: BZ, versao: '', erros: [] };
const PRE = 'khalkaria_ensaio:';
const MARCA = 'khalkaria_ensaio_ligado';
const MIME = 'application/x-khalkaria-ref';
const copia = (x) => JSON.parse(JSON.stringify(x));
const doEnsaio = (k) => typeof k === 'string' && (k.startsWith(PRE) || k === MARCA);
function soEnsaio(st, onde) {
  st.escritas.forEach((w) => assert.ok(w[0] !== 'clear' && doEnsaio(w[1]), (onde || '') + ': escrita fora do prefixo ' + JSON.stringify(w)));
}
// uma ficha em branco do ensaio (o armazém de verdade, sobre um storage falso)
function branca() {
  const ss = A.armazenamento();
  E.entrar(ss, A.soLeitura({}), { dados: DADOS });
  const arm = E.armazem(ss);
  return { ss, arm, id: arm.ativa(), f: () => arm.ler(arm.ativa()) };
}
// leva e grava (um passo do armazém, como a interface)
function leva(b, ref, cat) {
  const r = L.levar(b.f(), ref, cat || CAT, {});
  if (r.ok && r.mudou) assert.equal(b.arm.editar(b.id, r.mudancas, r.rotulo).ok, true, 'gravou ' + JSON.stringify(ref));
  return r;
}

// ---------------------------------------------------------------- puras
test('a ref: o card marcado pelo build (o nome do rótulo, sem emoji), o MIME {v:1,tipo,id} e o text/plain da v2.1', () => {
  const doc = DOM.documento();
  doc.body.innerHTML = '<div class="spell-card" data-kf-tipo="magia" data-kf-id="magia-centelha"><button type="button" class="ent-add" hidden aria-keyshortcuts="A" ' +
    'aria-label="Levar para a ficha: Centelha \u{1F525}"></button><span class="ent-alca" hidden aria-hidden="true"></span><h4>Centelha</h4></div>' +
    '<table><tbody><tr class="item-card" data-n="Corda (5m)" data-kf-tipo="item" data-kf-id="item-corda-5m"><td class="c-nome"><div class="c-nome-in">' +
    '<button type="button" class="ent-add" hidden aria-keyshortcuts="A" aria-label="Levar para a ficha: Corda (5m)"></button><span class="ent-alca" hidden aria-hidden="true"></span>' +
    '<span class="item-name">Corda (5m)</span></div></td></tr></tbody></table><p id="solto">x</p>';
  assert.deepEqual(copia(L.refDoCard(doc.querySelector('h4'))), { tipo: 'magia', id: 'magia-centelha', nome: 'Centelha' });
  assert.deepEqual(copia(L.refDoCard(doc.querySelector('.item-name'))), { tipo: 'item', id: 'item-corda-5m', nome: 'Corda (5m)' }, 'na tabela do Bazar, os controles na célula do nome');
  assert.equal(L.refDoCard(doc.getElementById('solto')), null);
  assert.equal(L.refDoCard(null), null);
  const p = L.payloadRef({ tipo: 'magia', id: 'magia-centelha', nome: 'Centelha' });
  assert.deepEqual(JSON.parse(p), { v: 1, tipo: 'magia', id: 'magia-centelha' }, 'só v, tipo e id');
  assert.deepEqual(copia(L.lerRef(p)), { tipo: 'magia', id: 'magia-centelha' });
  ['', '{x', '[]', '{"v":2,"tipo":"magia","id":"a"}', '{"v":1,"tipo":"magia"}', '{"v":1,"tipo":"","id":"a"}', '{"v":1,"tipo":3,"id":"a"}']
    .forEach((t) => assert.equal(L.lerRef(t), null, t));
  // o text/plain da v2.1: o item do Bazar e o card decorado (pelo nome, só se for único; a corrupção com o custo)
  assert.deepEqual(copia(L.refDoV2({ _bazar: true, item: { id: 'item-corda-5m', nome: 'Corda (5m)' } })).id, 'item-corda-5m');
  assert.deepEqual(copia(L.refDoV2(JSON.stringify({ _campo: 'tecnicas', tipo: 'tecnica', nome: 'Alquimia Rápida' }), CTX)),
    { tipo: 'tecnica', id: 'alquimista-alquimia-rapida', nome: 'Alquimia Rápida' });
  assert.equal(L.refDoV2({ tipo: 'magia', nome: 'Não Existe' }, CTX), null);
  assert.equal(L.refDoV2({ tipo: 'sei-la', nome: 'Centelha' }, CTX), null);
  assert.equal(L.refDoV2('{x', CTX), null);
  const corr = Object.keys(CTX.porId).find((k) => k.startsWith('corrupcao:'));
  if (corr) {
    const e = CTX.porId[corr];
    assert.equal(L.refDoV2({ tipo: 'corrupção', nome: e.nome + ' (-1)' }, CTX).id, e.id, 'a v2 grava a corrupção com o custo');
  }
  assert.equal(L.MIME, MIME);
});

test('levar (puro): cada tipo no destino certo, e a ficha recebida não muda', () => {
  const b = branca();
  const casos = [
    [{ tipo: 'tecnica', id: 'alquimista-alquimia-rapida' }, 'tecnicas', 'entradas'],
    [{ tipo: 'marca', id: 'alquimista-pai-de-pet' }, 'tecnicas', 'entradas'],
    [{ tipo: 'ultimate', id: 'alquimista-tita' }, 'tecnicas', 'entradas'],
    [{ tipo: 'traco', id: 'anao-visao-no-escuro' }, 'tecnicas', 'entradas'],
    [{ tipo: 'tecnologia', id: 'automato-visao-termica' }, 'tecnicas', 'entradas'],
    [{ tipo: 'magia', id: 'magia-centelha' }, 'grimorio', 'entradas'],
    [{ tipo: 'carta', id: 'limiar-alma-resiliente' }, 'cartas', 'entradas'],
    [{ tipo: 'dor', id: 'abismo-estabanado' }, 'cartas', 'entradas'],
    [{ tipo: 'beneficio', id: 'abismo-olhos-da-noite' }, 'cartas', 'entradas'],
    [{ tipo: 'item', id: 'item-corda-5m' }, 'inventario', 'inventario.bugigangas'],
    [{ tipo: 'item', id: 'item-arma-arremesso' }, 'inventario', 'inventario.equipamentos'],
    [{ tipo: 'raca', id: 'raca-anao' }, 'identidade', 'identidade.raca'],
    [{ tipo: 'variante', id: 'anao-krichama' }, 'identidade', 'identidade.variante'],
    [{ tipo: 'classe', id: 'classe-espadachim' }, 'identidade', 'identidade.classe'],
    [{ tipo: 'origem', id: 'origem-academico' }, 'identidade', 'identidade.origem'],
    [{ tipo: 'condicao', id: 'morrendo' }, 'condicoes', 'condicoes']
  ];
  const ABA = { tecnicas: 'tecnicas', grimorio: 'grimorio', cartas: 'cartas', inventario: 'bazar', identidade: 'nucleo', condicoes: 'nucleo' };
  for (const [ref, destino, caminho] of casos) {
    const antes = JSON.stringify(b.f());
    const f = b.f();
    const r = L.levar(f, ref, CAT, {});
    assert.equal(JSON.stringify(f), antes, 'puro: ' + ref.id);
    assert.equal(r.ok, true, ref.id + ': ' + r.erro);
    assert.equal(r.mudou, true);
    assert.equal(r.destino, destino, ref.id);
    assert.equal(r.aba, ABA[destino]);
    assert.ok(r.mudancas.some((m) => m.caminho === caminho), ref.id + ': ' + JSON.stringify(r.mudancas.map((m) => m.caminho)));
    assert.equal(r.orfa, false, ref.id);
    assert.match(r.rotulo, /^Levar: /);
    assert.equal(b.arm.editar(b.id, r.mudancas, r.rotulo).ok, true, 'o validador do armazém aceita: ' + ref.id);
  }
  const f = b.f();
  assert.deepEqual(f.entradas.map((e) => e.tipo + ':' + e.id), casos.slice(0, 9).map(([r]) => r.tipo + ':' + r.id));
  assert.ok(f.entradas.every((e) => /^u[a-z0-9]{10}$/.test(e.uid) && e.cache.nome && e.adicionadoEm));
  assert.deepEqual(['raca', 'variante', 'classe', 'origem'].map((k) => f.identidade[k].id), ['raca-anao', 'anao-krichama', 'classe-espadachim', 'origem-academico']);
  assert.deepEqual(f.condicoes.map((c) => c.id), ['morrendo']);
  assert.deepEqual(f.inventario.bugigangas.map((e) => e.id), ['item-corda-5m']);
  assert.deepEqual(f.inventario.equipamentos.map((e) => e.id), ['item-arma-arremesso']);
  // o que não vai para a ficha, ou sem ficha
  assert.match(L.levar(f, { tipo: 'sei-la', id: 'x' }, CAT).erro, /não vai para a ficha/);
  assert.equal(L.levar(null, { tipo: 'magia', id: 'x' }, CAT).erro, L.SEM_FICHA);
  assert.equal(L.levar(f, null, CAT).ok, false);
  assert.equal(L.levar(f, { tipo: 'magia' }, CAT).ok, false, 'sem id');
  soEnsaio(b.ss, 'puro');
});

test('identidade: avisa o que falta escolher (não bloqueia); a variante de outra raça recusa; sem raça, a variante a traz', () => {
  const b = branca();
  assert.deepEqual(L.faltaEscolher(b.f(), CTX), ['a raça', 'a classe', 'a origem']);
  let r = leva(b, { tipo: 'raca', id: 'raca-anao' });
  assert.deepEqual(copia(r.falta), ['a variante (Krichama ou Caxon)', 'a classe', 'a origem']);
  assert.equal(r.aviso, 'Raça da ficha do ensaio: Anão. Falta escolher a variante (Krichama ou Caxon), a classe e a origem.');
  r = leva(b, { tipo: 'classe', id: 'classe-espadachim' });
  assert.ok(r.falta.some((x) => /^o ramo \(/.test(x)), 'o ramo da classe');
  // trocar a raça: a variante de outra raça sai (as regras do KhEdicao)
  leva(b, { tipo: 'variante', id: 'anao-krichama' });
  r = leva(b, { tipo: 'raca', id: 'raca-humano' });
  assert.equal(b.f().identidade.variante.id, null);
  assert.match(r.aviso, /A raça era Anão\./);
  assert.match(r.aviso, /A variante Krichama saiu: é de outra raça\./);
  // a variante de outra raça: recusa e não muda nada
  const antes = JSON.stringify(b.f());
  r = L.levar(b.f(), { tipo: 'variante', id: 'anao-caxon' }, CAT);
  assert.equal(r.ok, false);
  assert.match(r.erro, /é de outra raça \(Anão\); a da ficha do ensaio é Humano/);
  assert.equal(JSON.stringify(b.f()), antes);
  // sem raça, a variante traz a raça junto
  const c = branca();
  r = leva(c, { tipo: 'subespecie', id: 'inseto-besouro' });
  assert.equal(c.f().identidade.raca.id, 'raca-inseto');
  assert.equal(c.f().identidade.subespecie.id, 'inseto-besouro');
  assert.match(r.aviso, /A raça veio junto: Inseto\./);
  // tudo escolhido
  const d = branca();
  ['raca-humano', 'classe-alquimista', 'origem-academico'].forEach((id) => leva(d, { tipo: id.split('-')[0], id }));
  leva(d, { tipo: 'variante', id: Object.values(CTX.porId).find((e) => e.tipo === 'variante' && e.raca === 'humano').id });
  const ramo = Object.keys(CTX.ramos).find((k) => CTX.ramos[k].classe === 'alquimista');
  d.arm.editar(d.id, [{ caminho: 'identidade.ramo', valor: { id: ramo, nome: CTX.ramos[ramo].nome } }], 'ramo');
  assert.deepEqual(L.faltaEscolher(d.f(), CTX), []);
  assert.match(leva(d, { tipo: 'origem', id: 'origem-ferreiro' }).aviso, /Nada mais a escolher na identidade\./);
});

test('repetida (tipo:id): avisa e não duplica; o item soma na mesma linha (como no Bazar)', () => {
  const b = branca();
  const refs = [{ tipo: 'tecnica', id: 'alquimista-alquimia-rapida' }, { tipo: 'magia', id: 'magia-centelha' },
    { tipo: 'carta', id: 'limiar-alma-resiliente' }, { tipo: 'raca', id: 'raca-anao' }, { tipo: 'condicao', id: 'morrendo' }];
  refs.forEach((ref) => leva(b, ref));
  const antes = JSON.stringify(b.f());
  refs.forEach((ref) => {
    const r = L.levar(b.f(), ref, CAT, {});
    assert.equal(r.ok, true);
    assert.equal(r.mudou, false, ref.id);
    assert.equal(r.repetida, true);
    assert.deepEqual(r.mudancas, []);
    assert.match(r.aviso, /já (está|é) .* da ficha do ensaio: nada mudou\.$/, r.aviso);
  });
  assert.equal(JSON.stringify(b.f()), antes);
  assert.equal(L.levar(b.f(), refs[1], CAT).aviso, 'Centelha já está no Grimório da ficha do ensaio: nada mudou.');
  // o item: a mesma linha, +1
  leva(b, { tipo: 'item', id: 'item-corda-5m' });
  const r = leva(b, { tipo: 'item', id: 'item-corda-5m' });
  assert.equal(r.fundiu, true);
  assert.equal(r.qtd, 2);
  assert.equal(b.f().inventario.bugigangas.length, 1);
  assert.equal(b.f().inventario.bugigangas[0].qtd, 2);
  assert.match(r.aviso, /já estava no inventário da ficha do ensaio: agora são 2/);
  // as chaves do "na ficha"
  const s = L.chaves(b.f(), BZ);
  ['tecnica:alquimista-alquimia-rapida', 'magia:magia-centelha', 'carta:limiar-alma-resiliente', 'raca:raca-anao', 'condicao:morrendo', 'item:item-corda-5m']
    .forEach((k) => assert.equal(s[k], true, k));
});

test('órfã: o id que sumiu do catálogo entra com o nome do card e nunca é apagada (nem pelo levar seguinte, nem pelo motor)', () => {
  const b = branca();
  let r = leva(b, { tipo: 'tecnica', id: 'tecnica-que-sumiu', nome: 'Golpe Antigo \u{2694}\u{FE0F}' });
  assert.equal(r.orfa, true);
  assert.match(r.aviso, /^Golpe Antigo foi para as Técnicas da ficha do ensaio: o id não está no catálogo, e a entrada fica órfã/);
  let e = b.f().entradas[0];
  assert.deepEqual(copia(e.orfao), { motivo: 'sumiu' });
  assert.equal(e.cache.nome, 'Golpe Antigo', 'o nome do card, sem emoji');
  // o catálogo daquele tipo não carregou: o motivo diz isso
  r = L.levar(b.f(), { tipo: 'magia', id: 'magia-x', nome: 'X' }, Object.assign({}, CAT, { erros: ['data/catalogo/magia.json'] }));
  assert.deepEqual(copia(r.mudancas[0].valor.slice(-1)[0].orfao), { motivo: 'sem-catalogo' });
  // condição e identidade fora do catálogo
  r = leva(b, { tipo: 'condicao', id: 'condicao-sumida', nome: 'Sumida' });
  assert.equal(r.orfa, true);
  assert.equal(b.f().condicoes[0].cache.nome, 'Sumida');
  r = leva(b, { tipo: 'origem', id: 'origem-sumida', nome: 'Velha' });
  assert.deepEqual(copia(b.f().identidade.origem), { id: null, nome: 'Velha' });
  // o item fora do catálogo do Bazar: órfão (pesa pelo retrato do arrasto)
  r = leva(b, { tipo: 'item', id: 'item-sumido', nome: 'Velharia', item: { id: 'item-sumido', nome: 'Velharia', categoria: 'Bugiganga' } });
  assert.equal(r.orfa, true);
  assert.equal(b.f().inventario.bugigangas[0].orfao, true);
  // levar outras coisas depois não apaga nenhuma órfã; o motor também não
  leva(b, { tipo: 'magia', id: 'magia-centelha' });
  leva(b, { tipo: 'item', id: 'item-corda-5m' });
  const f = b.f();
  assert.ok(f.entradas.some((x) => x.id === 'tecnica-que-sumiu'));
  assert.ok(f.condicoes.some((x) => x.id === 'condicao-sumida'));
  assert.ok(f.inventario.bugigangas.some((x) => x.id === 'item-sumido'));
  const res = E.calcular(b.ss, DADOS, '');
  assert.equal(res.estado, 'ok');
  assert.ok(res.ficha.entradas.some((x) => x.id === 'tecnica-que-sumiu'), 'o calcular não apaga');
  // de novo: repetida, não outra órfã
  e = L.levar(b.f(), { tipo: 'tecnica', id: 'tecnica-que-sumiu', nome: 'Golpe Antigo' }, CAT);
  assert.equal(e.repetida, true);
});

test('alias do Bazar (data/bazar-renomeados.json): o id antigo resolve para o atual; a linha antiga passa ao id novo e soma', () => {
  const ren = A.lerJSON('data', 'bazar-renomeados.json').renomeados;
  const [velho, { novo }] = Object.entries(ren).find(([, v]) => v.novo === 'item-lagrima-do-tempo');
  assert.equal(velho, 'item-lagrimas-do-tempo');
  const b = branca();
  let r = leva(b, { tipo: 'item', id: velho, nome: 'Lágrimas do Tempo' });
  assert.equal(r.orfa, false);
  assert.equal(r.id, novo);
  assert.equal(b.f().inventario.bugigangas[0].id, novo, 'grava o id atual');
  assert.equal(b.f().inventario.bugigangas[0].nome, 'Lágrima do Tempo');
  // uma ficha com a linha guardada no id antigo (export velho): levar o atual soma nela
  const c = branca();
  const linha = KI.mesclar({ bugigangas: [], equipamentos: [] }, Object.assign({}, BZ.porId[novo], { id: velho }), { qtd: 1 });
  const inv = { bugigangas: [], equipamentos: [] };
  KI.mesclar(inv, Object.assign({}, BZ.porId[novo], { id: velho, nome: 'Lágrimas do Tempo' }), { qtd: 3 });
  assert.ok(linha);
  c.arm.editar(c.id, [{ caminho: 'inventario.bugigangas', valor: inv.bugigangas }], 'export velho');
  assert.equal(L.chaves(c.f(), BZ)['item:' + novo], true, 'o "na ficha" vale pelo id atual');
  r = leva(c, { tipo: 'item', id: novo });
  assert.equal(r.fundiu, true);
  assert.equal(r.qtd, 4);
  assert.deepEqual(c.f().inventario.bugigangas.map((e) => [e.id, e.qtd]), [[novo, 4]]);
});

test('carta rara: nunca leva o efeito (o catálogo não o tem; o card nunca é lido); a comum leva o resumo', () => {
  const b = branca();
  const rara = Object.values(CTX.porId).find((e) => e.tipo === 'carta' && e.categoria === 'rara');
  assert.ok(rara, 'há rara no catálogo');
  let r = leva(b, { tipo: 'carta', id: rara.id, nome: rara.nome + ' com efeito inventado' });
  assert.equal(r.rara, true);
  let e = b.f().entradas.find((x) => x.id === rara.id);
  assert.deepEqual(Object.keys(e.cache).sort(), ['nome', 'versaoCatalogo']);
  assert.equal(e.cache.nome, rara.nome, 'o nome do catálogo, não o do card');
  r = leva(b, { tipo: 'carta', id: 'limiar-alma-resiliente' });
  assert.equal(r.rara, false);
  e = b.f().entradas.find((x) => x.id === 'limiar-alma-resiliente');
  assert.equal(e.cache.resumo, CTX.porId['carta:limiar-alma-resiliente'].resumo);
});

// a ficha do Bestiário: as chaves do exportBestiario da v2.1 (CLAUDE.md §5)
const CHAVES_BEST = ['type', 'name', 'race', 'npc_class', 'level', 'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom',
  'health_max', 'stamina_max', 'ether_max', 'evasion', 'movement', 'armor', 'prof_attack', 'prof_defend', 'prof_movement',
  'prof_fortitude', 'prof_will', 'prof_reflexes', 'prof_perception', 'prof_survival', 'prof_stealth', 'prof_crime', 'prof_initiative',
  'prof_knowledge', 'prof_medicine', 'prof_investigation', 'prof_religion', 'prof_mystic', 'prof_persuasion', 'prof_intimidation',
  'prof_insight', 'prof_deception', 'prof_motivate', 'prof_craft', 'craft_attr', 'resistances', 'immunities', 'armor_specific',
  'abilities', 'weapons'];
// o esperado, campo a campo, do resultado do motor
function esperado(res) {
  const n = (c) => res.av.nos[c].valor, f = res.ficha;
  return {
    type: 'npc', name: f.meta.nome || 'Personagem', race: f.identidade.raca.nome, npc_class: f.identidade.classe.nome, level: f.meta.nivel,
    strength: n('atributo.FOR.total'), dexterity: n('atributo.DES.total'), constitution: n('atributo.CON.total'),
    intelligence: n('atributo.INT.total'), wisdom: n('atributo.SAB.total'),
    health_max: n('recurso.saude.max'), stamina_max: n('recurso.stamina.max'), ether_max: n('recurso.eter.max'),
    evasion: n('evasao.passiva'), movement: n('movimento'), armor: n('ar')
  };
}

test('Bestiário (puro): o mapeamento do CLAUDE.md §5, com os valores do motor (ajustes dentro), prof_* em grau 0–4, R/I em texto, abilities e weapons', () => {
  const ss = A.armazenamento();
  E.entrar(ss, A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) }), { dados: DADOS });
  const arm = E.armazem(ss), id = arm.ativa();
  const b = { ss, arm, id, f: () => arm.ler(id) };
  leva(b, { tipo: 'magia', id: 'magia-centelha' });
  leva(b, { tipo: 'tecnica', id: 'alquimista-alquimia-rapida' });
  leva(b, { tipo: 'carta', id: 'limiar-alma-resiliente' });
  leva(b, { tipo: 'item', id: 'item-arma-arremesso' });
  assert.equal(arm.editar(id, [{ caminho: 'resistencias.tipos.frio.R', valor: true }, { caminho: 'pericias.oficio-ferraria', valor: 3 }], 'teste').ok, true);
  const res = E.calcular(ss, DADOS, '');
  assert.equal(res.estado, 'ok');
  const x = L.bestiario(res, { ctx: CTX, bazar: BZ });
  assert.deepEqual(Object.keys(x), CHAVES_BEST);
  const esp = esperado(res);
  Object.keys(esp).forEach((k) => assert.deepEqual(x[k], esp[k], k));
  // o ajuste manual migrado vale (Saúde máx. digitada 22, o calculado é 20)
  assert.equal(res.av.nos['recurso.saude.max'].calculado, 20);
  assert.equal(x.health_max, 22);
  assert.equal(x.stamina_max, 14);
  assert.equal(x.name, 'Lira Vento-Sul');
  // prof_*: o GRAU (0–4), não o bônus; o Ofício manda o maior dos três
  assert.equal(x.prof_attack, 1);
  assert.equal(x.prof_perception, 2);
  assert.equal(x.prof_craft, 3);
  assert.equal(x.craft_attr, 'intelligence');
  Object.keys(x).filter((k) => k.startsWith('prof_')).forEach((k) => assert.ok(Number.isInteger(x[k]) && x[k] >= 0 && x[k] <= 4, k));
  assert.equal(x.resistances, 'Cortante, Contundente, Perfurante, Frio', 'em texto, na ordem dos 14 tipos');
  assert.equal(x.immunities, 'Fogo');
  // abilities: técnicas e magias (cartas ficam só na ficha); weapons: as armas do inventário
  const nomes = x.abilities.map((a) => a.name);
  assert.ok(nomes.includes('Centelha') && nomes.includes('Alquimia Rápida') && nomes.includes('Fagulha'));
  assert.ok(!nomes.includes('Alma Resiliente'), 'carta não vira ability');
  assert.ok(x.abilities.every((a) => typeof a.description === 'string'));
  assert.ok(x.weapons.some((w) => w.name === 'Arma Arremesso'));
  assert.equal(L.nomeBestiario(res.ficha), 'Lira_Vento-Sul.bestiario.json');
  assert.equal(L.nomeBestiario({ meta: { nome: '' } }), 'personagem.bestiario.json');
});

test('garantir: o catálogo inteiro (os dados do motor e o Bazar); um arquivo que falha aborta, com a lista; já carregado, reaproveita', async () => {
  const BASE = 'http://site.test/';
  const buscas = [];
  const fetchDe = (falha) => (u) => {
    buscas.push(u);
    const rel = u.replace(BASE, '').replace(/\?.*$/, '');
    if (falha && falha(rel)) return Promise.resolve({ ok: false, status: 404 });
    const p = path.join(A.RAIZ, rel);
    if (!fs.existsSync(p)) return Promise.resolve({ ok: false, status: 404 });
    const txt = fs.readFileSync(p, 'utf8');
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt) });
  };
  let g = await L.garantir(fetchDe(), BASE, '?v=1');
  assert.equal(g.ok, true);
  assert.ok(g.dados.catalogos.length >= 14 && g.itens.length > 100);
  assert.ok(buscas.every((u) => u.endsWith('?v=1')));
  g = await L.garantir(fetchDe((r) => r === 'data/catalogo/magia.json'), BASE, '');
  assert.deepEqual(copia(g), { ok: false, erros: ['data/catalogo/magia.json'] });
  g = await L.garantir(fetchDe((r) => r === 'data/bazar.json'), BASE, '');
  assert.deepEqual(copia(g), { ok: false, erros: ['data/bazar.json'] });
  g = await L.garantir(() => { throw new Error('rede'); }, BASE, '');
  assert.equal(g.ok, false);
  assert.deepEqual(copia(g.erros), ['data/*', 'data/bazar.json']);
  // os dados do motor já carregados (sem falta) não são buscados de novo
  buscas.length = 0;
  g = await L.garantir(fetchDe(), BASE, '', { dados: DADOS });
  assert.equal(g.ok, true);
  assert.deepEqual(buscas.map((u) => u.replace(BASE, '')), ['data/bazar.json']);
  // com falta, busca de novo
  buscas.length = 0;
  g = await L.garantir(fetchDe(), BASE, '', { dados: Object.assign({}, DADOS, { erros: ['data/efeitos.json'] }) });
  assert.equal(g.ok, true);
  assert.ok(buscas.length > 10);
  assert.equal(L.avisoGarantir(['data/a.json', 'data/b.json', 'data/c.json', 'data/d.json']),
    'O catálogo não carregou inteiro (data/a.json, data/b.json, data/c.json e mais 1): o export do Bestiário foi cancelado e nada foi baixado. Confira a conexão e tente de novo.');
});

// ---------------------------------------------------------------- navegador
const ORDEM = ler('js', 'ficha', 'ORDEM').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const FONTES = ORDEM.filter((n) => n !== 'ficha-v2.js').map((n) => [n, ler('js', 'ficha', n)]);
const SRC_UI = ler('js', 'kh-ui.js');
const SRC_PAGINA = ler('js', 'ficha-pagina.js');
const BASE = 'http://site.test/';

test('ORDEM: o kh-levar.js depois do kh-editor.js e antes do drawer; no artefato, com o window.KhLevar', () => {
  const i = (n) => ORDEM.indexOf(n);
  assert.ok(i('kh-editor.js') >= 0 && i('kh-editor.js') < i('kh-levar.js') && i('kh-levar.js') < i('kh-ficha-drawer.js'));
  assert.ok(i('kh-ficha-abas.js') < i('kh-levar.js') && i('kh-seletor.js') < i('kh-levar.js'));
  const art = ler('js', 'ficha.js');
  assert.ok(art.includes('// ==== js/ficha/kh-levar.js ===='));
  assert.ok(art.includes('raiz.KhLevar = KhLevar;'));
});

// os cards como o build os gera (tools/kf_marca.py; o item, o js/bazar.js): os 7 tipos
const ctl = (nome) => '<button type="button" class="ent-add" hidden aria-keyshortcuts="A" aria-label="Levar para a ficha: ' + nome + '"></button>' +
  '<span class="ent-alca" hidden aria-hidden="true"></span>';
const card = (tag, cls, tipo, id, nome, extra) => '<' + tag + ' class="' + cls + '" data-kf-tipo="' + tipo + '" data-kf-id="' + id + '"' + (extra || '') + '>' +
  ctl(nome) + '<h4>' + nome + '</h4></' + tag + '>';
const CARDS = [
  ['tecnica', 'alquimista-alquimia-rapida', 'Alquimia Rápida', card('div', 'technique-card', 'tecnica', 'alquimista-alquimia-rapida', 'Alquimia Rápida')],
  ['magia', 'magia-centelha', 'Centelha', card('div', 'spell-card', 'magia', 'magia-centelha', 'Centelha')],
  ['carta', 'limiar-alma-resiliente', 'Alma Resiliente', card('div', 'catalog-card cat-universal', 'carta', 'limiar-alma-resiliente', 'Alma Resiliente')],
  ['item', 'item-corda-5m', 'Corda (5m)', '<article class="item-card" data-n="Corda (5m)" data-id="item-corda-5m" data-kf-tipo="item" data-kf-id="item-corda-5m" tabindex="0">' +
    ctl('Corda (5m)') + '<div class="item-head"><span class="item-name">Corda (5m)</span></div></article>'],
  ['raca', 'raca-anao', 'Anão', card('a', 'raca-card', 'raca', 'raca-anao', 'Anão', ' href="racas/anao.html"')],
  ['origem', 'origem-academico', 'Acadêmico', card('div', 'origem-card', 'origem', 'origem-academico', 'Acadêmico')],
  ['condicao', 'morrendo', 'Morrendo', card('div', 'condicao-card', 'condicao', 'morrendo', 'Morrendo')]
];
const MC = '<h1>Conteúdo</h1>' + CARDS.map((c) => c[3]).join('') +
  // a tabela do Bazar (os controles na célula do nome) e um card dentro de [data-kf-ignorar]
  '<table class="bz-tabela"><tbody><tr class="item-card" data-n="Lágrima do Tempo" data-kf-tipo="item" data-kf-id="item-lagrima-do-tempo" tabindex="0">' +
  '<td class="c-nome"><div class="c-nome-in">' + ctl('Lágrima do Tempo') + '<span class="item-name">Lágrima do Tempo</span></div></td></tr></tbody></table>' +
  '<div data-kf-ignorar>' + card('div', 'spell-card', 'magia', 'magia-fagulha', 'Fagulha') + '</div>' +
  '<input id="busca" type="search">';
// a serialização (atributos em ordem: o hidden volta ao fim, como o navegador também reordena)
function ser(n) {
  if (n.nodeType === 3) return n.texto;
  const t = n.tagName.toLowerCase();
  const at = Object.keys(n.attrs).sort().map((k) => ' ' + k + '="' + n.attrs[k] + '"').join('');
  return '<' + t + at + '>' + n.filhos.map(ser).join('') + '</' + t + '>';
}
// um dataTransfer que guarda o que o setData pôs
function dt(inicial) {
  const d = Object.assign({}, inicial || {});
  return { d, dropEffect: '', effectAllowed: '', get types() { return Object.keys(d); },
    setData(t, v) { d[t] = String(v); }, getData(t) { return t in d ? d[t] : ''; } };
}

// opc: {ls, ss (objeto ou o espião), pagina, mc (o HTML do conteúdo)}
function janela(opc) {
  opc = opc || {};
  const doc = DOM.documento({ body: opc.pagina ? { 'data-ficha-pagina': '' } : {} });
  const script = doc.createElement('script');
  script.setAttribute('src', BASE + 'js/ficha.js?v=abc123');
  doc.head.appendChild(script);
  const mc = doc.createElement('main');
  mc.className = opc.pagina ? 'main-content fp-pagina' : 'main-content';
  mc.innerHTML = opc.pagina ? '<div class="fp" id="fp" data-kf-ignorar><h1 class="fp-titulo">Ficha</h1><p class="fp-aviso" data-sem-previa>' + FP.AVISO + '</p></div>'
    : (opc.mc != null ? opc.mc : MC);
  doc.body.appendChild(mc);
  const ls = opc.ls && opc.ls.escritas ? opc.ls : A.armazenamento(opc.ls || {});
  const ss = opc.ss && opc.ss.escritas ? opc.ss : A.armazenamento(opc.ss || {});
  const blobs = [], baixados = [], timers = [], ouvWin = {}, kf = [];
  class Blob { constructor(partes, o) { this.texto = partes.join(''); this.type = o && o.type; } }
  class URLx extends URL {
    static createObjectURL(b) { blobs.push(b); return 'blob:' + (blobs.length - 1); }
    static revokeObjectURL() {}
  }
  class CustomEvent { constructor(t, o) { Object.assign(this, DOM.evento(t, { detail: o && o.detail })); } }
  const sb = {
    document: doc, URL: URLx, Blob, CustomEvent, console,
    location: { search: '', pathname: opc.pagina ? '/pages/ficha.html' : '/pages/sistema.html', hash: '',
      replace(u) { sb.foi = u; }, reload() { sb.recarregou = (sb.recarregou || 0) + 1; } },
    localStorage: ls, sessionStorage: ss,
    setTimeout: (f) => { timers.push(f); return timers.length; }, clearTimeout() {},
    requestAnimationFrame: (f) => f(),
    fetch: (u) => {
      const rel = u.replace(BASE, '').replace(/\?.*$/, '');
      if (sb.falha && sb.falha(rel)) return Promise.resolve({ ok: false, status: 503 });
      const p = path.join(A.RAIZ, rel);
      if (!u.startsWith(BASE) || !fs.existsSync(p)) return Promise.resolve({ ok: false, status: 404 });
      const txt = fs.readFileSync(p, 'utf8');
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt) });
    },
    addEventListener: (t, f) => { (ouvWin[t] = ouvWin[t] || []).push(f); }, removeEventListener() {},
    // a ficha atual (v2.1) falsa, ESPIÃ: com o Ensaio, nada chega a ela
    KF: Object.freeze({ versao: '2', adicionar: (it) => { kf.push(['adicionar', it]); return 'u1'; }, abrir: (...a) => { kf.push(['abrir', a]); } })
  };
  sb.window = sb;
  vm.createContext(sb);
  vm.runInContext(SRC_UI, sb, { filename: 'kh-ui.js' });
  FONTES.forEach(([n, src]) => vm.runInContext(src, sb, { filename: n }));
  if (opc.pagina) vm.runInContext(SRC_PAGINA, sb, { filename: 'ficha-pagina.js' });
  doc.addEventListener('click', (e) => {
    const a = e.target;
    if (a && a.tagName === 'A' && a.hasAttribute('download')) {
      baixados.push({ nome: a.getAttribute('download'), texto: blobs[Number(a.getAttribute('href').slice(5))].texto });
    }
  }, true);
  const el = (id) => doc.getElementById(id);
  const clica = (x) => { assert.ok(x, 'o que clicar existe'); return DOM.despacha(doc, x, DOM.evento('click')); };
  const tecla = (alvo, key) => { doc.activeElement = alvo; return DOM.despacha(doc, alvo, DOM.evento('keydown', { key })); };
  const win = (tipo, ev) => (ouvWin[tipo] || []).forEach((f) => f(Object.assign({ type: tipo }, ev)));
  const cardDe = (tipo, id) => doc.querySelector('main [data-kf-tipo="' + tipo + '"][data-kf-id="' + id + '"]');
  const botao = (c) => c.querySelector('.ent-add');
  const alca = (c) => c.querySelector('.ent-alca');
  // arrastar pela alça até o drawer e soltar (o mesmo dataTransfer do começo ao fim)
  function arrastaAteDrawer(origem) {
    const d = dt();
    const ini = DOM.despacha(doc, origem, DOM.evento('dragstart', { dataTransfer: d }));
    DOM.despacha(doc, el('fd-gaveta'), DOM.evento('dragenter', { dataTransfer: d }));
    const sobre = DOM.despacha(doc, el('fd-gaveta-rolagem'), DOM.evento('dragover', { dataTransfer: d }));
    DOM.despacha(doc, el('fd-gaveta-rolagem'), DOM.evento('drop', { dataTransfer: d }));
    DOM.despacha(doc, doc.body, DOM.evento('dragend', { dataTransfer: d }));
    return { d, ini, sobre };
  }
  return { sb, doc, html: doc.documentElement, mc, ls, ss, baixados, timers, ouvWin, kf, el, clica, tecla, win, cardDe, botao, alca, arrastaAteDrawer,
    faixa: () => el('ke-faixa'), toast: () => el('ke-levar-toast'), arm: () => sb.KhEnsaio.armazem(ss) };
}
const espera = () => new Promise((r) => setImmediate(r));
async function carrega(j) {
  for (let i = 0; i < 40; i++) await espera();
  const link = j.doc.querySelector('link[data-fd-gaveta]');
  if (link && !link._carregou) { link._carregou = true; DOM.despacha(j.doc, link, DOM.evento('load')); }
  return j;
}
const comPrevia = (extra) => Object.assign({ khalkaria_ficha_previa: '1', khalkaria_ficha3_dock: 'aberto' }, extra);
async function entra(j) {
  j.clica(j.doc.querySelector('.fd-gaveta-ensaiar'));
  await carrega(j);
  assert.equal(j.sb.KhEnsaio.ligado(j.sb), true);
  return j;
}
// uma ficha nova e ativa no ensaio (o seletor faria igual), e o evento
function fichaNova(j, nome) {
  const r = j.arm().criar({ nome });
  assert.equal(r.ok, true);
  j.sb.KhEnsaio.emitir(j.sb, ['lista', 'ficha']);
  return r.id;
}
const naFicha = (j) => CARDS.map(([t, id]) => j.cardDe(t, id).hasAttribute('data-ke-na-ficha'));
function confereFicha(j, id, onde) {
  const f = j.arm().ler(id);
  assert.deepEqual(copia(f.entradas.map((e) => e.tipo + ':' + e.id)), ['tecnica:alquimista-alquimia-rapida', 'magia:magia-centelha', 'carta:limiar-alma-resiliente'], onde);
  assert.deepEqual(copia(f.inventario.bugigangas.map((e) => [e.id, e.qtd])), [['item-corda-5m', 1]], onde);
  assert.equal(f.identidade.raca.id, 'raca-anao', onde);
  assert.equal(f.identidade.origem.id, 'origem-academico', onde);
  assert.deepEqual(copia(f.condicoes.map((c) => c.id)), ['morrendo'], onde);
}

test('sem a prévia, e com ela sem o Ensaio: os controles ficam como o build deixou; clique, tecla e arrasto seguem para a v2.1 (espião)', async () => {
  // sem a prévia: o KhLevar nem liga
  const s = await carrega(janela({ ls: {} }));
  assert.equal(s.sb.KhLevar.atual(), null);
  const orig = ser(s.mc);
  // com a prévia, sem o Ensaio
  const j = await carrega(janela({ ls: comPrevia() }));
  assert.ok(j.sb.KhLevar.atual(), 'ligado no drawer, à espera do Ensaio');
  assert.equal(ser(j.mc), orig, 'byte a byte (hidden, vazio, o aria-label do build)');
  assert.ok(j.doc.querySelectorAll('main .ent-add').every((b) => b.hidden && b.innerHTML === ''));
  assert.ok(j.doc.querySelectorAll('main .ent-alca').every((a) => a.hidden && !a.hasAttribute('draggable')));
  // a v2.1 decorou o card ('+ ficha' e o arrasto do card inteiro): o clique dela segue, o do botão inerte também
  const c = j.cardDe('magia', 'magia-centelha');
  const add = j.doc.createElement('span');
  add.className = 'kf-addbtn';
  c.querySelector('h4').appendChild(add);
  const viu = [];
  c.addEventListener('click', (e) => viu.push(e.target.className));
  assert.equal(j.clica(add).defaultPrevented, false);
  assert.equal(j.clica(j.botao(c)).defaultPrevented, false, 'o botão do build, inerte: o KhLevar não toma o clique');
  assert.deepEqual(viu, ['kf-addbtn', 'ent-add']);
  assert.equal(j.tecla(j.cardDe('item', 'item-corda-5m'), 'a').defaultPrevented, false, 'a tecla A não é tomada');
  const d = dt({ 'text/plain': JSON.stringify({ _campo: 'grimorio', tipo: 'magia', nome: 'Centelha' }) });
  DOM.despacha(j.doc, c, DOM.evento('dragstart', { dataTransfer: d }));
  assert.deepEqual(Object.keys(d.d), ['text/plain'], 'sem o MIME do ensaio');
  // o item do Bazar solto no drawer vai à ficha atual, como hoje (KF.adicionar)
  const it = j.cardDe('item', 'item-corda-5m');
  const di = dt({ 'text/plain': JSON.stringify({ _bazar: true, item: { id: 'item-corda-5m', nome: 'Corda (5m)' } }) });
  DOM.despacha(j.doc, it, DOM.evento('dragstart', { dataTransfer: di }));
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('dragover', { dataTransfer: di }));
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('drop', { dataTransfer: di }));
  assert.deepEqual(copia(j.kf.map((x) => x[0])), ['adicionar']);
  assert.deepEqual(Object.keys(di.d), ['text/plain']);
  await carrega(j);
  assert.equal(j.toast(), null, 'nenhum recado');
  assert.equal(ser(j.mc).replace('<span class="kf-addbtn"></span>', ''), orig);
  // só a aba aberta do drawer (KhAbas: mostra o O Bazar, como hoje) e o dock; nada do ensaio
  assert.deepEqual(copia(j.ss.escritas), [['set', 'khalkaria_ficha_aba']]);
  assert.deepEqual(j.ls.escritas.filter((w) => w[1] !== 'khalkaria_ficha3_dock'), []);
});

test('com o Ensaio, os 7 tipos pelo clique: o botão e a alça aparecem, o card marca "na ficha", o recado tem Desfazer; repetida avisa (espião)', async () => {
  const ls = A.armazenamento(comPrevia());
  const fotoLs = ls.foto();
  const j = await entra(await carrega(janela({ ls })));
  const orig = ser((await carrega(janela({ ls: {} }))).mc);
  // os controles aparecem (o ignorado não)
  CARDS.forEach(([t, id, nome]) => {
    const c = j.cardDe(t, id), b = j.botao(c), a = j.alca(c);
    assert.equal(b.hidden, false, id);
    assert.equal(b.textContent, 'Levar');
    assert.equal(b.getAttribute('aria-label'), 'Levar para a ficha: ' + nome);
    assert.match(b.innerHTML, /^<svg class="ke-ent-ic"/, 'ícone em SVG, sem emoji');
    assert.equal(a.hidden, false);
    assert.equal(a.getAttribute('draggable'), 'true');
  });
  const ign = j.doc.querySelector('[data-kf-ignorar] .ent-add');
  assert.equal(ign.hidden, true, 'dentro de [data-kf-ignorar], nada');
  assert.equal(j.botao(j.cardDe('item', 'item-lagrima-do-tempo')).hidden, false, 'a linha da tabela do Bazar também');
  const id = fichaNova(j, 'Clique');
  for (const [t, cid, nome] of CARDS) {
    const ev = j.clica(j.botao(j.cardDe(t, cid)));
    assert.equal(ev.defaultPrevented, true);
    assert.equal(ev.propagou, false, 'o card embaixo não abre nem navega');
    await carrega(j);
    assert.ok(j.cardDe(t, cid).hasAttribute('data-ke-na-ficha'), cid + ': na ficha');
    assert.match(j.toast().textContent, new RegExp(nome.replace(/[()]/g, '\\$&')), cid);
  }
  confereFicha(j, id, 'clique');
  const b = j.botao(j.cardDe('magia', 'magia-centelha'));
  assert.equal(b.textContent, 'Na ficha');
  assert.equal(b.getAttribute('aria-label'), 'Levar para a ficha: Centelha (já está na ficha do ensaio)');
  // o recado: role status, com Desfazer, que tira o último levar
  const t = j.toast();
  assert.equal(t.getAttribute('role'), 'status');
  assert.ok(t.hasAttribute('data-kf-ignorar'));
  assert.ok(t.classList.contains('ke-levar-ok'));
  assert.match(t.textContent, /^Morrendo entrou nas condições ativas da ficha do ensaio\./);
  j.clica(t.querySelector('[data-toast-desfazer]'));
  assert.deepEqual(copia(j.arm().ler(id).condicoes), []);
  assert.match(t.textContent, /^Desfeito: Levar: Morrendo \(condição\)\./);
  assert.equal(j.cardDe('condicao', 'morrendo').hasAttribute('data-ke-na-ficha'), false, 'o "na ficha" acompanha');
  j.clica(j.botao(j.cardDe('condicao', 'morrendo')));
  await carrega(j);
  // repetida: avisa e não duplica
  const antes = JSON.stringify(j.arm().ler(id));
  j.clica(j.botao(j.cardDe('magia', 'magia-centelha')));
  await carrega(j);
  assert.equal(JSON.stringify(j.arm().ler(id)), antes);
  assert.equal(t.textContent, 'Centelha já está no Grimório da ficha do ensaio: nada mudou.');
  assert.ok(t.classList.contains('ke-levar-aviso'));
  assert.equal(t.querySelector('[data-toast-desfazer]'), null, 'nada a desfazer');
  // cada levar é um passo do Desfazer da ficha
  assert.equal(j.arm().estadoLog(id).desfazer.rotulo, 'Levar: Morrendo (condição)');
  // a ficha atual nunca é chamada; nada fora do prefixo
  assert.deepEqual(j.kf, []);
  assert.equal(ls.foto(), fotoLs);
  assert.deepEqual(ls.escritas, []);
  soEnsaio(j.ss, 'clique');
  // sair do ensaio: tudo volta ao que o build deixou
  j.clica(j.faixa().querySelector('[data-ke="sair"]'));
  j.clica(j.faixa().querySelector('[data-ke="sair-ok"]'));
  assert.equal(ser(j.mc), orig, 'hidden, vazio, o aria-label do build');
  assert.deepEqual([...j.ss.m.keys()], []);
});

test('com o Ensaio, os 7 tipos pela tecla A (o botão ou o card focado; nunca num campo de texto) (espião)', async () => {
  const j = await entra(await carrega(janela({ ls: A.armazenamento(comPrevia()) })));
  const id = fichaNova(j, 'Tecla');
  assert.deepEqual(naFicha(j), CARDS.map(() => false));
  for (const [t, cid] of CARDS) {
    const c = j.cardDe(t, cid);
    // o item do Bazar é focável (tabindex): o card mesmo; os outros, pelo botão
    const ev = j.tecla(t === 'item' ? c : j.botao(c), t === 'raca' ? 'A' : 'a');
    assert.equal(ev.defaultPrevented, true, cid);
    await carrega(j);
  }
  confereFicha(j, id, 'tecla');
  assert.deepEqual(naFicha(j), CARDS.map(() => true));
  // num campo de texto, a tecla é do campo; fora de card, segue
  const n = j.ss.escritas.length;
  assert.equal(j.tecla(j.el('busca'), 'a').defaultPrevented, false);
  assert.equal(j.tecla(j.doc.querySelector('h1'), 'a').defaultPrevented, false);
  assert.equal(j.tecla(j.doc.querySelector('[data-kf-ignorar] h4'), 'a').defaultPrevented, false);
  await carrega(j);
  assert.equal(j.ss.escritas.length, n);
  assert.ok(j.sb.KhTeclas.lista().some((a) => a.tecla === 'a' && /ficha do ensaio/.test(a.descricao)));
  assert.deepEqual(j.kf, []);
  assert.deepEqual(j.ls.escritas, []);
  soEnsaio(j.ss, 'tecla');
});

test('com o Ensaio, os 7 tipos pelo arrasto: a alça põe o MIME {v:1,tipo,id} e o nome; o drawer aceita e leva; o item do Bazar e o card da v2.1 também (espião)', async () => {
  const j = await entra(await carrega(janela({ ls: A.armazenamento(comPrevia()) })));
  const id = fichaNova(j, 'Arrasto');
  for (const [t, cid, nome] of CARDS) {
    const r = j.arrastaAteDrawer(j.alca(j.cardDe(t, cid)));
    assert.deepEqual(JSON.parse(r.d.d[MIME]), { v: 1, tipo: t, id: cid }, cid);
    assert.equal(r.d.d['text/plain'], nome, 'o text/plain só com o nome');
    assert.equal(r.d.effectAllowed, 'copy');
    assert.equal(r.sobre.defaultPrevented, true, cid + ': o drawer aceita');
    assert.equal(j.el('fd-gaveta-aviso').textContent, 'Levando ' + nome + ' para a ficha do ensaio…');
    await carrega(j);
    assert.ok(j.cardDe(t, cid).hasAttribute('data-ke-na-ficha'), cid);
  }
  confereFicha(j, id, 'arrasto');
  assert.match(j.el('fd-gaveta-aviso').textContent, /^Morrendo entrou nas condições ativas da ficha do ensaio/);
  // o card inteiro (o arrasto da v2.1): a ref vai junto, o text/plain da v2.1 fica
  const id2 = fichaNova(j, 'V2');
  const c = j.cardDe('magia', 'magia-centelha');
  const v2 = JSON.stringify({ _campo: 'grimorio', tipo: 'magia', nome: 'Centelha' });
  const d = dt({ 'text/plain': v2 });
  DOM.despacha(j.doc, c.querySelector('h4'), DOM.evento('dragstart', { dataTransfer: d }));
  assert.equal(d.d['text/plain'], v2, 'não troca o text/plain da v2.1');
  assert.deepEqual(JSON.parse(d.d[MIME]), { v: 1, tipo: 'magia', id: 'magia-centelha' });
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('dragover', { dataTransfer: d }));
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('drop', { dataTransfer: d }));
  await carrega(j);
  assert.deepEqual(copia(j.arm().ler(id2).entradas.map((e) => e.id)), ['magia-centelha']);
  // um card só da v2.1 (sem a marcação do build): resolve pelo nome
  const so = j.doc.createElement('div');
  so.className = 'tier-technique kf-draggable';
  j.mc.appendChild(so);
  const d2 = dt({ 'text/plain': JSON.stringify({ _campo: 'tecnicas', tipo: 'tecnica', nome: 'Alquimia Rápida' }) });
  DOM.despacha(j.doc, so, DOM.evento('dragstart', { dataTransfer: d2 }));
  assert.equal(d2.d[MIME], undefined, 'sem card marcado, sem ref');
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('dragover', { dataTransfer: d2 }));
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('drop', { dataTransfer: d2 }));
  await carrega(j);
  assert.deepEqual(copia(j.arm().ler(id2).entradas.map((e) => e.id)), ['magia-centelha', 'alquimista-alquimia-rapida']);
  // o item do Bazar ({_bazar:true,item}) do painel de receita (sem a marcação): vai ao inventário
  const rc = j.doc.createElement('div');
  rc.id = 'bz-receita';
  rc.innerHTML = '<span data-ir="item-corda-5m">Corda</span>';
  j.mc.appendChild(rc);
  const d3 = dt({ 'text/plain': JSON.stringify({ _bazar: true, item: { id: 'item-corda-5m', nome: 'Corda (5m)' } }) });
  DOM.despacha(j.doc, rc.querySelector('[data-ir]'), DOM.evento('dragstart', { dataTransfer: d3 }));
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('dragover', { dataTransfer: d3 }));
  DOM.despacha(j.doc, j.el('fd-gaveta-rolagem'), DOM.evento('drop', { dataTransfer: d3 }));
  await carrega(j);
  assert.deepEqual(copia(j.arm().ler(id2).inventario.bugigangas.map((e) => e.id)), ['item-corda-5m']);
  // o arrasto interno do Bazar (application/x-kf-uid) não passa pelo levar
  const inv = j.doc.createElement('aside');
  inv.className = 'bz-inv';
  inv.innerHTML = '<div class="bz-slot" draggable="true">x</div>';
  j.mc.appendChild(inv);
  const d4 = dt({ 'application/x-kf-uid': 'u123' });
  DOM.despacha(j.doc, inv.querySelector('.bz-slot'), DOM.evento('dragstart', { dataTransfer: d4 }));
  assert.deepEqual(Object.keys(d4.d), ['application/x-kf-uid']);
  assert.equal(j.el('fd-gaveta').hasAttribute('data-acende'), false);
  assert.deepEqual(j.kf, [], 'nada vai à ficha atual');
  assert.deepEqual(j.ls.escritas, []);
  soEnsaio(j.ss, 'arrasto');
});

test('bfcache: a página velha que volta com o Ensaio já fora esconde os controles no pageshow, e o clique nela não grava (espião)', async () => {
  const j = await entra(await carrega(janela({ ls: A.armazenamento(comPrevia()) })));
  const orig = ser((await carrega(janela({ ls: {} }))).mc);
  assert.equal(j.botao(j.cardDe('magia', 'magia-centelha')).hidden, false);
  // outra página da aba saiu do ensaio (o storage da aba é o mesmo)
  j.sb.KhEnsaio.sair(j.ss);
  const n = j.ss.escritas.length;
  j.clica(j.botao(j.cardDe('magia', 'magia-centelha')));
  await carrega(j);
  assert.equal(j.toast().textContent, j.sb.KhLevar.FORA);
  assert.equal(j.ss.escritas.length, n, 'nada gravado');
  assert.equal(ser(j.mc), orig, 'e a página se acertou');
  // o pageshow (persisted) também acerta, sem esperar o clique
  await entra(j);
  assert.equal(j.botao(j.cardDe('magia', 'magia-centelha')).hidden, false);
  j.sb.KhEnsaio.sair(j.ss);
  j.win('pageshow', { persisted: true });
  assert.equal(ser(j.mc), orig);
  assert.deepEqual(j.ls.escritas, []);
  soEnsaio(j.ss, 'bfcache');
});

test('export do Bestiário pela interface: só com o Ensaio; a página e o drawer baixam o JSON do motor; com o fetch falhando, nada é baixado (espião)', async () => {
  const ls = A.armazenamento(comPrevia({ khalkaria_ficha: JSON.stringify(V2) }));
  const j = await carrega(janela({ pagina: true, ls }));
  assert.equal(j.el('fp-kbe'), null, 'sem o Ensaio, nenhum nó');
  assert.equal(j.doc.querySelector('[data-kl="bestiario"]'), null);
  j.clica(j.doc.querySelector('[data-ke="entrar"]'));
  await carrega(j);
  const lugar = j.el('fp-kbe');
  assert.ok(lugar);
  assert.equal(lugar.parentNode, j.el('fp'));
  const filhos = j.el('fp').filhos;
  assert.ok(filhos.indexOf(lugar) < filhos.indexOf(j.el('fp-ked')) && filhos.indexOf(j.el('fp-ked')) + 1 === filhos.indexOf(j.el('fp-topo')),
    'entre o seletor e a barra do KhEditor (que fica logo acima do topo)');
  const btn = () => lugar.querySelector('[data-kl="bestiario"]');
  assert.equal(btn().textContent, 'Exportar para o Bestiário');
  // o fetch do Bazar falha: aborta com o aviso, sem arquivo
  j.sb.falha = (rel) => rel === 'data/bazar.json';
  j.clica(btn());
  assert.equal(btn().getAttribute('aria-disabled'), 'true', 'ocupado enquanto carrega');
  await carrega(j);
  assert.deepEqual(j.baixados, []);
  assert.match(lugar.querySelector('.ke-msg').textContent, /^O catálogo não carregou inteiro \(data\/bazar\.json\): o export do Bestiário foi cancelado e nada foi baixado\./);
  assert.ok(lugar.querySelector('.ke-msg').classList.contains('ke-msg-aviso'));
  // de volta a rede: baixa o JSON do motor
  j.sb.falha = null;
  j.clica(btn());
  await carrega(j);
  assert.equal(j.baixados.length, 1);
  assert.equal(j.baixados[0].nome, 'Lira_Vento-Sul.bestiario.json');
  const x = JSON.parse(j.baixados[0].texto);
  assert.deepEqual(Object.keys(x), CHAVES_BEST);
  const res = E.calcular(j.ss, DADOS, '?v=abc123');
  const esp = esperado(res);
  Object.keys(esp).forEach((k) => assert.deepEqual(x[k], esp[k], k));
  assert.equal(x.health_max, 22, 'o ajuste manual (Saúde máx. 22) vale');
  assert.deepEqual(x, copia(L.bestiario(res, { ctx: CTX, bazar: BZ })), 'o mesmo da função pura');
  assert.match(lugar.querySelector('.ke-msg').textContent, /^Baixado: Lira_Vento-Sul\.bestiario\.json/);
  // o drawer também tem o botão (no cabeçalho), e baixa o mesmo
  const k = await carrega(janela({ ls: A.armazenamento(Object.fromEntries(ls.m)), ss: j.ss, mc: '<h1>x</h1>' }));
  const kb = k.el('fd-gaveta-kbe');
  assert.ok(kb && kb.parentNode.classList.contains('fd-gaveta-cab'));
  k.clica(kb.querySelector('[data-kl="bestiario"]'));
  await carrega(k);
  assert.equal(k.baixados.length, 1);
  assert.deepEqual(JSON.parse(k.baixados[0].texto), x);
  // sair do ensaio: o botão some
  j.clica(j.faixa().querySelector('[data-ke="sair"]'));
  j.clica(j.faixa().querySelector('[data-ke="sair-ok"]'));
  assert.equal(lugar.hidden, true);
  assert.deepEqual(j.ls.escritas, []);
  assert.deepEqual(k.ls.escritas, []);
  soEnsaio(j.ss, 'bestiário');
  // exportarBestiario fora do Ensaio: nem busca
  assert.deepEqual(copia(await j.sb.KhLevar.exportarBestiario(j.sb, {})), { ok: false, aviso: L.FORA });
});

test('CSS do levar: no css/ficha-ensaio.css (só com o Ensaio), sob o escopo; alvo de 24 px; recado e botão em AA', () => {
  const css = ler('css', 'ficha-ensaio.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const { regra, resolveCor, contraste, TOKENS } = require('./cor-apoio.js');
  const b = regra(css, 'html[data-ensaio] .ent-add[data-ke-levar], html[data-ensaio] .ent-alca[draggable]');
  assert.match(b, /min-width: 24px; min-height: 24px;/);
  const fundoB = resolveCor(/background:\s*([^;]+);/.exec(regra(css, 'html[data-ensaio] .ent-add[data-ke-levar]'))[1]);
  assert.ok(contraste(TOKENS['gold-light'], fundoB) >= 4.5, 'Levar');
  const nf = regra(css, 'html[data-ensaio] [data-ke-na-ficha] .ent-add[data-ke-levar]');
  const cNf = resolveCor(/(?:^|;)\s*color:\s*([^;]+?)\s*;/.exec(nf)[1]), fNf = resolveCor(/background:\s*([^;]+);/.exec(nf)[1]);
  assert.ok(contraste(cNf, fNf) >= 4.5, 'Na ficha: ' + contraste(cNf, fNf).toFixed(2));
  const t = regra(css, '.ke-levar-toast');
  assert.match(t, /position: fixed;/);
  assert.match(t, /z-index: var\(--z-toast\);/);
  assert.ok(contraste(TOKENS['text-primary'], TOKENS['bg-secondary']) >= 4.5);
  assert.ok(contraste(TOKENS['gold-light'], TOKENS['bg-secondary']) >= 4.5, 'o Desfazer');
  assert.match(regra(css, '.ke-levar-toast.on'), /display: block;/);
  // nenhuma página o carrega (o KhSeletor o injeta só com o Ensaio)
  fs.readdirSync(path.join(A.RAIZ, 'pages')).filter((n) => n.endsWith('.html')).forEach((n) => assert.doesNotMatch(ler('pages', n), /ficha-ensaio\.css/, n));
});
