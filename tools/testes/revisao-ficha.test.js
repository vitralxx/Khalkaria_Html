'use strict';
// Revisão da ficha nova pelo Pedro (docs/ficha-digital/03-respostas-pedro.md §10,
// 2026-10-19) e os defeitos médios e baixos da auditoria
// (docs/ficha-digital/08-auditoria-2026-10-19.md §B), as partes PURAS e o
// armazém do Ensaio com o armazenamento ESPIÃO (nada fora do prefixo):
//   - a escolha do maior atributo sem selo, com troca à mão (perícias de dois
//     atributos, CD, Stamina e Éter) e desfazer;
//   - a subespécie do Inseto no box da variante; Autômato e Corrompido sem variante;
//   - o layout do Núcleo (Capacidade embaixo das perícias), a tabela de
//     resistências sem nome por cima de R/I/V (o CSS);
//   - Marcas da Vhelor ocultas em todo modo; "Lendário" com acento;
//   - trocar raça ou classe: o aviso do que ficou e o "Remover o que era de…";
//   - a pendência do Ofício(X); __proto__ no caminho; o log apagado pela falta de
//     espaço; o passoLog do schema.
// A interface (página no vm, o clique em Desfazer depois de digitar) está no
// ensaio.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const A = require('./estado-apoio.js');
const E = require('../../js/ficha/kh-ensaio.js');
const KE = require('../../js/ficha/kh-estado.js');
const ED = require('../../js/ficha/kh-edicao.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');
const RG = require('../../js/ficha/kh-regras.js');

const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const DADOS = Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] });
const CTX = FA.contexto(DADOS, RG.dados(), '../');
const PRE = 'khalkaria_ensaio:';
const det = (s) => ({ agora: A.relogio(), aleatorio: A.semente(s || 7) });
const css = (n) => fs.readFileSync(path.join(A.RAIZ, 'css', n), 'utf8');

function soPrefixo(st, onde) {
  st.escritas.forEach((w) => assert.ok(w[0] !== 'clear' && w[1].startsWith(PRE), (onde || '') + ': escrita fora do prefixo ' + JSON.stringify(w)));
}
// o ensaio com a ficha atual (Lira, Humano Simples, Batedor 2) migrada
function ensaio() {
  const ss = A.armazenamento();
  assert.ok(E.entrar(ss, A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) }), Object.assign({ dados: DADOS }, det())).ok);
  ss.escritas = ss.escritas.filter((w) => w[1] !== 'khalkaria_ensaio_ligado');
  const arm = E.armazem(ss, det(3));
  const id = arm.ativa();
  const res = () => E.calcular(ss, DADOS, '');
  return { ss, arm, id, ficha: () => arm.ler(id), res, nos: () => res().av.nos };
}
function edita(x, caminho, bruto) {
  const r = ED.mudancas(x.ficha(), caminho, bruto, { contexto: CTX });
  assert.ok(r.ok, caminho + ': ' + r.erro);
  const g = x.arm.editar(x.id, r.mudancas, r.rotulo);
  assert.ok(g.ok && g.mudou, caminho + ': gravou');
  return Object.assign(g, { aviso: r.aviso, restos: r.restos });
}
// o Núcleo da página com o Ensaio (editar: 'pagina') ou só leitura
const nucleo = (x, editar) => FA.criar({ prefixo: 'fp' }).paineis(x.res(), { dados: DADOS, editar: editar || null }).paineis.nucleo;

// ---------------------------------------------------------------- item 1
test('03 §10: a escolha do maior atributo não tem selo; a dica diz "usa o maior entre…"; trocar à mão e desfazer (espião)', () => {
  const x = ensaio();
  let nos = x.nos();
  ['movimento', 'convencimento', 'intimidacao', 'enganacao'].forEach((p) => {
    assert.deepEqual(nos['pericia.' + p + '.total'].selos, [], p + ' sem selo');
    assert.equal(nos['pericia.' + p + '.total'].escolha.trocado, false);
  });
  ['recurso.stamina.max', 'recurso.eter.max'].forEach((c) => assert.ok(!nos[c].selos.includes('decisaoPedro'), c));
  assert.equal(nos['pericia.movimento.total'].escolha.motivo, 'usa o maior entre Mod.FOR e Mod.DES');
  // a perícia: FOR à mão (DES 16 é o maior) e de volta ao padrão; desfazer volta
  let g = edita(x, 'periciasAttr.movimento', 'FOR');
  assert.equal(g.rotulo, 'Atributo de Movimento: FOR (escolhido)');
  assert.equal(x.ficha().periciasAttr.movimento, 'FOR');
  nos = x.nos();
  assert.deepEqual([nos['pericia.movimento.total'].escolha.usado, nos['pericia.movimento.total'].escolha.motivo], ['FOR', 'usa Mod.FOR (escolhido)']);
  g = edita(x, 'periciasAttr.movimento', '');
  assert.equal(g.rotulo, 'Atributo de Movimento: o maior');
  assert.equal(Object.prototype.hasOwnProperty.call(x.ficha().periciasAttr, 'movimento'), false, 'o padrão apaga a chave');
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(x.ficha().periciasAttr.movimento, 'FOR');
  assert.equal(ED.mudancas(x.ficha(), 'periciasAttr.movimento', 'INT').erro, 'Atributo de Movimento: escolha FOR ou DES.');
  // Stamina e Éter: identidade.escolhas inteiro (as chaves têm ponto)
  g = edita(x, 'escolha.attr.recurso.stamina', 'FOR');
  assert.deepEqual(g.partes, ['identidade.escolhas']);
  assert.equal(x.ficha().identidade.escolhas['attr.recurso.stamina'], 'FOR');
  nos = x.nos();
  assert.equal(nos['recurso.stamina.max'].escolha.trocado, true);
  assert.ok(nos['recurso.stamina.max'].termos.some((t) => t.motivo === 'usa Mod.FOR (escolhido)'));
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.deepEqual(x.ficha().identidade.escolhas, {});
  // a CD do Batedor não tem escolha: recusa; a do Espadachim tem (DES ou FOR)
  assert.equal(ED.mudancas(x.ficha(), 'escolha.attr.cd', 'DES').erro, 'Atributo da CD: não há escolha de atributo aqui.');
  edita(x, 'identidade.classe', 'classe-espadachim');
  assert.deepEqual(ED.attrsEscolha(x.ficha(), 'attr.cd'), ['DES', 'FOR']);
  edita(x, 'escolha.attr.cd', 'for');
  assert.equal(x.ficha().identidade.escolhas['attr.cd'], 'FOR', 'minúscula serve');
  assert.equal(x.nos().cd.escolha.motivo, 'usa Mod.FOR (escolhido)');
  soPrefixo(x.ss, 'escolha do atributo');
});

test('03 §10: no Ensaio, o seletor do atributo (padrão "maior (X)") nas 4 perícias, na Stamina, no Éter e na CD com escolha; fora dele, a sigla', () => {
  const x = ensaio();
  let h = nucleo(x, 'pagina');
  assert.match(h, /<select class="ke-ed ke-ed-sel ke-ed-attr" data-ed="periciasAttr\.movimento"[^>]*aria-label="Atributo de Movimento"[^>]*><option value="" selected>maior \(DES\)<\/option><option value="FOR">FOR<\/option><option value="DES">DES<\/option><\/select>/);
  ['convencimento', 'intimidacao', 'enganacao'].forEach((p) => assert.match(h, new RegExp('data-ed="periciasAttr\\.' + p + '"')));
  assert.equal((h.match(/data-ed="periciasAttr\./g) || []).length, 4, 'só as de dois atributos');
  assert.match(h, /data-ed="escolha\.attr\.recurso\.stamina"[^>]*>.*?maior \(DES\)/);
  assert.match(h, /data-ed="escolha\.attr\.recurso\.eter"[^>]*>.*?maior \(SAB\)/);
  assert.doesNotMatch(h, /data-ed="escolha\.attr\.cd"/, 'a CD do Batedor não tem escolha');
  // a dica do atributo da perícia
  assert.match(h, /class="fp-per-at" title="usa o maior entre Mod\.FOR e Mod\.DES"/);
  // trocado: o guardado selecionado, e o padrão ainda diz qual é o maior
  edita(x, 'periciasAttr.movimento', 'FOR');
  edita(x, 'identidade.classe', 'classe-espadachim');
  h = nucleo(x, 'pagina');
  assert.match(h, /data-ed="periciasAttr\.movimento"[^>]*><option value="">maior \(DES\)<\/option><option value="FOR" selected>FOR<\/option>/);
  assert.match(h, /class="fp-per-at" title="usa Mod\.FOR \(escolhido\)"/);
  assert.match(h, /data-ed="escolha\.attr\.cd"[^>]*aria-label="Atributo da CD"/);
  // só leitura: nenhum seletor, a sigla; e nenhum selo de decisão nas perícias de dois atributos
  const so = nucleo(x);
  assert.doesNotMatch(so, /ke-ed-attr|data-ed=/);
  assert.match(so, /<span class="fp-per-at" title="usa Mod\.FOR \(escolhido\)">FOR<\/span>/);
  ['movimento', 'convencimento', 'intimidacao', 'enganacao'].forEach((p) => {
    const seg = so.slice(so.indexOf('data-campo="pericia-' + p + '"'));
    assert.doesNotMatch(seg.slice(0, seg.indexOf('data-campo="pericia-', 10)), /fp-selo-decisaoPedro/, p);
  });
});

// ---------------------------------------------------------------- item 2
test('03 §10: Inseto mostra as 3 subespécies no box (seletor, com desfazer); o motor usa a escolhida e o aviso some; Autômato e Corrompido dizem que não têm variante', () => {
  const x = ensaio();
  edita(x, 'identidade.raca', 'raca-inseto');
  const aviso = () => x.res().av.avisos.filter((a) => a.tipo === 'raca-sem-subespecie');
  assert.equal(aviso().length, 1);
  assert.equal(aviso()[0].msg, 'Inseto: os atributos variam por subespécie, e a ficha não tem uma');
  assert.deepEqual(ED.opcoesRef(CTX, x.ficha(), 'subespecie').map((o) => o.nome), ['Besouro', 'Louva-a-Deus', 'Barata']);
  assert.deepEqual(ED.opcoesRef(CTX, x.ficha(), 'variante'), []);
  let h = nucleo(x, 'pagina');
  assert.match(h, /data-campo="variante"><dt>Subespécie<\/dt><dd><select class="ke-ed ke-ed-sel" data-ed="identidade\.subespecie"/);
  assert.match(h, /<option value="inseto-besouro">Besouro<\/option><option value="inseto-louva-a-deus">Louva-a-Deus<\/option><option value="inseto-barata">Barata<\/option>/);
  assert.doesNotMatch(h, /data-ed="identidade\.variante"/);
  const g = edita(x, 'identidade.subespecie', 'inseto-besouro');
  assert.equal(g.rotulo, 'Subespécie: Besouro');
  assert.deepEqual(x.ficha().identidade.subespecie, { id: 'inseto-besouro', nome: 'Besouro' });
  assert.equal(aviso().length, 0, 'com a subespécie, o aviso some');
  const nos = x.nos();
  assert.equal(nos.movimento.valor, 7.5, 'o Movimento do Besouro');
  assert.ok(nos['atributo.CON.total'].termos.some((t) => t.fonte && t.fonte.tipo === 'subespecie' && t.fonte.id === 'inseto-besouro'), 'os atributos da subespécie');
  h = nucleo(x, 'pagina');
  assert.match(h, /<option value="inseto-besouro" selected>Besouro<\/option>/);
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(aviso().length, 1, 'desfeito: o aviso volta');
  // trocar a raça tira a subespécie (de outra raça)
  edita(x, 'identidade.subespecie', 'inseto-barata');
  const r = edita(x, 'identidade.raca', 'raca-automato');
  assert.match(r.aviso, /^A subespécie Barata saiu: é de outra raça\./);
  // Autômato e Corrompido: o box diz, sem seletor
  h = nucleo(x, 'pagina');
  assert.match(h, /data-campo="variante"><dt>Variante<\/dt><dd><span class="fp-sub">Autômato não tem variante<\/span><\/dd>/);
  assert.doesNotMatch(h, /data-ed="identidade\.(variante|subespecie)"/);
  edita(x, 'identidade.raca', 'raca-corrompido');
  assert.match(nucleo(x, 'pagina'), /Corrompido não tem variante/);
  // raça com variantes: o seletor de sempre
  edita(x, 'identidade.raca', 'raca-anao');
  assert.match(nucleo(x, 'pagina'), /data-campo="variante"><dt>Variante<\/dt><dd><select class="ke-ed ke-ed-sel" data-ed="identidade\.variante"/);
  soPrefixo(x.ss, 'subespécie');
});

// ---------------------------------------------------------------- itens 3, 4, 5 e 6
test('03 §10: Núcleo em duas colunas, a Capacidade embaixo das Perícias (à esquerda de Evasão, CD e Movimento); o drawer na ordem de antes', () => {
  const x = ensaio();
  const h = nucleo(x);
  const i = (s) => h.indexOf(s);
  const colA = i('<div class="fp-col fp-col-pers">'), colB = i('<div class="fp-col fp-col-rec">');
  assert.ok(colA > 0 && colB > colA);
  assert.ok(i('data-campo="pericias"') > colA && i('data-campo="pericias"') < colB);
  assert.ok(i('data-campo="capacidade"') > i('data-campo="pericias"') && i('data-campo="capacidade"') < colB, 'a Capacidade na coluna das perícias, embaixo');
  assert.ok(i('data-campo="recursos"') > colB && i('data-campo="derivados"') > i('data-campo="recursos"'), 'Recursos e, embaixo, Evasão, CD e Movimento');
  assert.ok(i('data-campo="armadura"') > i('data-campo="derivados"'));
  // o CSS: a página em duas colunas (numa só, a ordem de antes); o drawer empilha Recursos, Derivados, Capacidade, Perícias
  const pg = css('ficha-pagina.css'), dw = css('ficha-drawer.css');
  assert.match(pg, /\.fp-duas \{ display: grid; grid-template-columns: minmax\(0, 1\.15fr\) minmax\(0, 1fr\);/);
  assert.match(pg, /\.fp-duas > \.fp-col \{ display: contents; \}/);
  assert.match(dw, /\.fd-duas > \.fd-col \{ display: contents; \}/);
  const ordem = (txt, pre) => ['recursos', 'derivados', 'capacidade', 'pericias']
    .map((c) => Number(new RegExp('\\.' + pre + '-duas > \\.' + pre + '-col > \\[data-campo="' + c + '"\\] \\{ order: (\\d); \\}').exec(txt)[1]));
  assert.deepEqual(ordem(dw, 'fd'), [1, 2, 3, 4], 'drawer: Recursos, Evasão…, Capacidade, Perícias (como antes)');
  assert.deepEqual(ordem(pg, 'fp'), [2, 3, 4, 1], 'página numa coluna: Perícias, Recursos, Evasão…, Capacidade (como antes)');
});

test('03 §10: Armadura e Resistência: a 1ª coluna nunca é menor que o nome do tipo; a categoria cabe o nome mais as 5 colunas; "calc." e a marca de aviso não invadem a vizinha', () => {
  const pg = css('ficha-pagina.css'), dw = css('ficha-drawer.css');
  assert.match(pg, /\.fp-res-tab \{ display: grid; grid-template-columns: minmax\(max-content, 1fr\) repeat\(3, 1\.7rem\) 2\.3rem 2\.5rem;/);
  assert.match(dw, /\.fd-res-tab \{ display: grid; grid-template-columns: minmax\(max-content, 1fr\) repeat\(3, 1\.5rem\) 2\.1rem 2\.3rem;/);
  const min = Number(/\.fp-res-cats \{[^}]*minmax\(min\(100%, ([\d.]+)rem\), 1fr\)/.exec(pg)[1]);
  // 5 colunas fixas + 5 vãos de .15rem + padding .8rem + o nome mais longo (Contundente, ~7rem em Cinzel .8rem)
  assert.ok(min >= 1.7 * 3 + 2.3 + 2.5 + 5 * 0.15 + 0.8 + 7, 'a categoria cabe nome e números: ' + min);
  assert.match(pg, /\.fp-res-lin \.fp-calc, \.fp-res-lin \.fp-marca-aviso \{ display: none; \}/);
  assert.match(dw, /\.fd-res-lin \.fd-calc, \.fd-res-lin \.fd-marca-aviso \{ display: none; \}/);
});

test('03 §10: Marcas da Vhelor ocultas em todo modo (também no Ensaio); com 1 ou mais, o bloco aparece (no Ensaio, com − e +)', () => {
  const x = ensaio();
  assert.equal(Number(x.ficha().vhelor.marcas) || 0, 0);
  assert.doesNotMatch(nucleo(x), /data-campo="vhelor"/);
  assert.doesNotMatch(nucleo(x, 'pagina'), /data-campo="vhelor"|vhelor\.marcas/, 'no Ensaio também: oculta');
  assert.ok(x.arm.editar(x.id, [{ caminho: 'vhelor.marcas', valor: 1 }], 'Marcas da Vhelor: 1').ok);
  assert.match(nucleo(x), /data-campo="vhelor".*?data-ficha="vhelor\.marcas">1</);
  const h = nucleo(x, 'pagina');
  assert.match(h, /data-campo="vhelor"/);
  assert.match(h, /data-ed-alvo="vhelor\.marcas" data-ed-delta|data-ed-delta="-1" data-ed-alvo="vhelor\.marcas"/);
  assert.doesNotMatch(h, /Fora da edição, este bloco/);
  soPrefixo(x.ss, 'vhelor');
});

test('03 §10: "Lendário" com acento na legenda das perícias e no title/aria dos círculos (o contrato escreve sem)', () => {
  assert.equal(RG.dados().graus.rotulos[4], 'Lendário');
  const x = ensaio();
  [nucleo(x), nucleo(x, 'pagina')].forEach((h) => {
    assert.doesNotMatch(h, /Lendario/);
    assert.match(h, /\+8 Lendário/);
  });
  assert.match(nucleo(x, 'pagina'), /aria-label="Atacar: grau 4, Lendário \(\+8\)" title="\+8 Lendário · clique para marcar"/);
  assert.match(nucleo(x), /<span class="fp-grau" title="\+8 Lendário"><\/span>/);
});

// ---------------------------------------------------------------- auditoria B
test('auditoria B: trocar a classe avisa o que ficou (técnicas, marca, ultimate, Recurso de Classe) e NÃO tira; "Remover o que era de Batedor" tira num passo, desfazível (espião)', () => {
  const x = ensaio();
  const antes = x.ficha();
  const daBatedor = (f) => f.entradas.filter((e) => /^batedor-/.test(e.id || '')).map((e) => e.id);
  assert.deepEqual(daBatedor(antes), ['batedor-oportunista', 'batedor-atento', 'batedor-cicatrizes-da-jornada', 'batedor-silencio']);
  const g = edita(x, 'identidade.classe', 'classe-monge');
  assert.deepEqual(g.restos, { campo: 'classe', anterior: { id: 'classe-batedor', nome: 'Batedor' } });
  assert.match(g.aviso, /Ficaram da classe anterior \(Batedor\): Oportunista \(técnica\), Atento \(técnica\), Cicatrizes da Jornada \(marca\), Silêncio \(ultimate\), o Recurso de Classe \(atual 2, Instinto\)\.$/);
  assert.equal(daBatedor(x.ficha()).length, 4, 'nunca remove calado');
  assert.deepEqual(x.ficha().recursos.classe, antes.recursos.classe);
  // o que ficou, de novo pela ficha de agora; remover num passo só
  const rr = ED.restos(x.ficha(), CTX, 'classe', g.restos.anterior);
  assert.equal(rr.total, 5);
  const m = ED.mudancaRestos(x.ficha(), CTX, 'classe', g.restos.anterior);
  assert.equal(m.rotulo, 'Remover o que era de Batedor (5)');
  assert.deepEqual(m.mudancas.map((y) => y.caminho), ['entradas', 'recursos.classe']);
  const n = x.ficha().entradas.length;
  const gr = x.arm.editar(x.id, m.mudancas, m.rotulo);
  assert.ok(gr.ok && gr.mudou);
  assert.deepEqual(daBatedor(x.ficha()), []);
  assert.equal(x.ficha().entradas.length, n - 4, 'só as 4 do Batedor (as órfãs e as de outros ficam)');
  assert.deepEqual(x.ficha().recursos.classe, { id: null, nome: '', atual: 0 });
  assert.equal(x.arm.estadoLog(x.id).desfazer.rotulo, 'Remover o que era de Batedor (5)');
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(daBatedor(x.ficha()).length, 4, 'desfeito: voltam');
  assert.deepEqual(x.ficha().recursos.classe, antes.recursos.classe);
  // de volta ao Batedor: o que era dele não é resto
  edita(x, 'identidade.classe', 'classe-batedor');
  assert.equal(ED.mudancaRestos(x.ficha(), CTX, 'classe', g.restos.anterior).erro, 'Nada a remover: não ficou nada da classe anterior (Batedor).');
  // a raça: o traço e a escolha de atributo da raça
  assert.ok(x.arm.editar(x.id, [{ caminho: 'identidade.escolhas', valor: { 'raca.atributos.0': ['FOR', 'DES'], 'attr.cd': 'DES' } }], 'x').ok);
  const rg = edita(x, 'identidade.raca', 'raca-anao');
  assert.match(rg.aviso, /Ficaram da raça anterior \(Humano\): Persistência Humana \(traço\), a escolha de atributo da raça\.$/);
  const mr = ED.mudancaRestos(x.ficha(), CTX, 'raca', rg.restos.anterior);
  assert.ok(x.arm.editar(x.id, mr.mudancas, mr.rotulo).ok);
  assert.deepEqual(x.ficha().identidade.escolhas, { 'attr.cd': 'DES' }, 'só a escolha da raça sai');
  assert.equal(x.ficha().entradas.some((e) => e.id === 'humano-persistencia-humana'), false);
  soPrefixo(x.ss, 'restos');
});

test('auditoria B: variante e ramo SEM id saem na troca quando o nome é de outra raça/classe; texto livre fora do catálogo fica', () => {
  const x = ensaio();
  const f = x.ficha();
  f.identidade.raca = { id: 'raca-anao', nome: 'Anão' };
  f.identidade.variante = { id: null, nome: 'Krichama' };
  f.identidade.ramo = { id: null, nome: '🗺️ Ramo do Cartógrafo' };
  let r = ED.mudancas(f, 'identidade.raca', 'raca-humano', { contexto: CTX });
  assert.deepEqual(r.mudancas[1], { caminho: 'identidade.variante', valor: { id: null, nome: '' } });
  assert.match(r.aviso, /^A variante Krichama saiu: é de outra raça\./);
  // a mesma raça da variante: fica
  assert.equal(ED.mudancas(Object.assign({}, f, { identidade: Object.assign({}, f.identidade, { raca: { id: 'raca-humano', nome: 'Humano' } }) }),
    'identidade.raca', 'raca-anao', { contexto: CTX }).mudancas.length, 1);
  // texto livre que não é de catálogo nenhum: fica
  f.identidade.variante = { id: null, nome: 'Variante inventada' };
  assert.equal(ED.mudancas(f, 'identidade.raca', 'raca-humano', { contexto: CTX }).mudancas.length, 1);
  // o ramo pelo nome (com emoji no nome guardado)
  r = ED.mudancas(f, 'identidade.classe', 'classe-monge', { contexto: CTX });
  assert.deepEqual(r.mudancas[1], { caminho: 'identidade.ramo', valor: { id: null, nome: '' } });
  assert.match(r.aviso, /^O ramo Ramo do Cartógrafo saiu: é de outra classe\./);
  assert.equal(ED.mudancas(f, 'identidade.classe', 'classe-batedor', { contexto: CTX }).mudancas.length, 1, 'a classe dele: fica');
});

test('auditoria B: a pendência do Ofício(X) da v2: "O grau vai para Ofício(X)" aplica o grau e fecha a pendência, num passo desfazível (espião)', () => {
  const x = ensaio();
  assert.deepEqual(ED.pendenciaOficio(x.ficha()), { i: 0, grau: 1 });
  let h = nucleo(x, 'pagina');
  assert.match(h, /<label class="ke-ed-of">O grau vai para <select class="ke-ed ke-ed-sel ke-ed-of-sel" data-ed="migracao\.oficio"[^>]*><option value="" selected>\(escolher\)<\/option><option value="oficio-engenharia">Ofício\(Engenharia\)<\/option><option value="oficio-ferraria">Ofício\(Ferraria\)<\/option><option value="oficio-alquimia">Ofício\(Alquimia\)<\/option><\/select><\/label>/);
  assert.doesNotMatch(nucleo(x), /ke-ed-of/, 'fora do Ensaio, só a nota');
  const n = x.ficha().migracao.pendencias.length;
  const g = edita(x, 'migracao.oficio', 'oficio-ferraria');
  assert.equal(g.rotulo, 'O grau vai para Ofício(Ferraria): Treinado');
  assert.deepEqual(g.partes, ['pericias.oficio-ferraria', 'migracao.pendencias']);
  assert.equal(x.ficha().pericias['oficio-ferraria'], 1);
  assert.equal(x.ficha().migracao.pendencias.length, n - 1);
  assert.equal(ED.pendenciaOficio(x.ficha()), null);
  h = nucleo(x, 'pagina');
  assert.doesNotMatch(h, /Pendência da migração: a ficha atual tinha um Ofício|ke-ed-of|grau a escolher/, 'a pendência fechou');
  assert.equal(ED.mudancas(x.ficha(), 'migracao.oficio', 'oficio-alquimia', { contexto: CTX }).erro, 'Não há pendência do Ofício(X) nesta ficha.');
  assert.ok(x.arm.desfazer(x.id).ok);
  assert.equal(x.ficha().pericias['oficio-ferraria'], 0);
  assert.deepEqual(ED.pendenciaOficio(x.ficha()), { i: 0, grau: 1 }, 'desfeito: a pendência volta');
  assert.equal(ED.mudancas(x.ficha(), 'migracao.oficio', 'atacar', { contexto: CTX }).erro, 'Ofício(X) da ficha atual: escolha um dos três Ofícios.');
  // por cima de um grau diferente: avisa
  assert.ok(x.arm.editar(x.id, [{ caminho: 'pericias.oficio-alquimia', valor: 3 }], 'x').ok);
  assert.equal(ED.mudancas(x.ficha(), 'migracao.oficio', 'oficio-alquimia', { contexto: CTX }).aviso, 'Ofício(Alquimia) tinha Mestre: agora Treinado.');
  soPrefixo(x.ss, 'ofício');
});

test('auditoria B: "__proto__", "prototype" e "constructor" recusados em qualquer segmento do caminho (editar e o log do desfazer)', () => {
  const x = ensaio();
  ['meta.__proto__.x', 'meta.constructor', 'lore.prototype.y', 'pericias.constructor', 'constructor', 'ajustes.__proto__']
    .forEach((c) => {
      assert.equal(KE.caminhoEditavel(c), false, c);
      assert.equal(x.arm.editar(x.id, [{ caminho: c, valor: { polui: 1 } }], 'x').erro, 'caminho-invalido', c);
    });
  assert.equal(KE.caminhoEditavel('meta.nome'), true);
  assert.deepEqual(KE.SEGMENTOS_PROIBIDOS, ['__proto__', 'prototype', 'constructor']);
  // poeCaminho também não escreve (defesa em profundidade)
  const o = {};
  KE.poeCaminho(o, 'a.__proto__.polui', 1);
  KE.poeCaminho(o, 'constructor.prototype.polui', 1);
  assert.equal({}.polui, undefined);
  assert.deepEqual(o, {});
  // um log forjado com o caminho: o passo é descartado (o desfazer não anda nele)
  const log = { passos: [{ rotulo: 'mau', partes: ['meta.constructor'], antes: {}, depois: { 'meta.constructor': 1 }, revPorParte: { 'meta.constructor': 'x' } }] };
  assert.deepEqual(KE.normalizaLog(log).passos, []);
  assert.ok(x.arm.gravarLog(x.id, log).ok);
  assert.equal(x.arm.desfazer(x.id).erro, 'vazio');
  assert.equal({}.polui, undefined);
  soPrefixo(x.ss, 'proto');
});

test('auditoria B: a limpeza por falta de espaço que apaga o log da ficha ATIVA vem marcada (logLimpo) no editar e no desfazer', () => {
  const x = ensaio();
  edita(x, 'meta.nome', 'Um');
  edita(x, 'meta.nome', 'Dois');
  assert.equal(x.arm.estadoLog(x.id).passos, 2);
  // o storage cheio: a próxima gravação da ficha só passa limpando o log dela
  let tot = 0;
  x.ss.m.forEach((v, k) => { tot += k.length + v.length; });
  x.ss.limite = tot + 40;
  const g = x.arm.editar(x.id, [{ caminho: 'meta.nome', valor: 'Tres'.repeat(20) }], 'Nome longo');
  assert.ok(g.ok, JSON.stringify(g));
  assert.equal(g.logLimpo, true);
  assert.ok(g.limpou.includes('khalkaria_ficha_v3_log:' + x.id));
  // sem a limpeza da ativa: falso
  x.ss.limite = Infinity;
  assert.equal(x.arm.editar(x.id, [{ caminho: 'meta.nome', valor: 'Quatro' }], 'x').logLimpo, false);
  // o desfazer que faz a ficha crescer (volta o nome longo) com o storage cheio
  edita(x, 'lore.historia', 'L'.repeat(200));
  edita(x, 'lore.historia', 'c');
  tot = 0;
  x.ss.m.forEach((v, k) => { tot += k.length + v.length; });
  x.ss.limite = tot + 40;
  const d = x.arm.desfazer(x.id);
  assert.ok(d.ok, JSON.stringify(d));
  assert.equal(d.logLimpo, true);
  assert.equal(x.ficha().lore.historia, 'L'.repeat(200));
  const lg = x.arm.estadoLog(x.id);
  assert.deepEqual([lg.passos, lg.refazerN], [0, 1], 'o log recomeça: só o passo que andou (no refazer)');
  x.ss.limite = Infinity;
  soPrefixo(x.ss, 'quota');
});

test('auditoria B: o schema exige "depois" no passoLog (o editar sempre grava antes e depois)', () => {
  const sc = A.lerJSON('data', 'ficha.schema.json');
  assert.deepEqual(sc.$defs.passoLog.required, ['revPorParte', 'partes', 'antes', 'depois', 'rotulo']);
  const x = ensaio();
  edita(x, 'meta.nome', 'Com depois');
  const l = JSON.parse(x.ss.getItem(PRE + 'khalkaria_ficha_v3_log:' + x.id));
  l.passos.forEach((p) => sc.$defs.passoLog.required.forEach((k) => assert.ok(k in p, k)));
});
