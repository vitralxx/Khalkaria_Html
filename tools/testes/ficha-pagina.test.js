'use strict';
// Página da ficha nova (F4.3a + F4.3b, js/ficha-pagina.js + templates/ficha.template.html).
// Cobre: ativação (a mesma regra do head-boot e do KhPrevia), o aviso sem a
// prévia (igual ao template, nenhum fetch), a casca com a prévia (topo, 5 abas
// do A4 por conjunto contra o 03 §4, tabpanel ligado a cada aba), o cálculo pelo
// motor no topo, e o desenho das 5 abas (F4.3b) com a fixture ficha-v2-sintetica:
//   - estrutura de cada aba POR CONJUNTO contra o 03 §4 (rótulos e contagens
//     tirados do próprio documento, data-campo no HTML);
//   - todo número com a conta (KhConta, prefixo fp) e o tooltip da fórmula
//     (o mesmo padrão dicas() do previa.test.js), e nenhum dígito fora de conta,
//     de número de estado (data-ficha) ou de texto do catálogo;
//   - carta rara sem efeito (nem o texto que a v2 guardou); órfã com o texto
//     salvo e a marca; Tier/Marca acima do nível (D34); recurso sem contador (D105);
// e no navegador (vm, artefato js/ficha.js + js/ficha-pagina.js): nenhuma escrita
// em localStorage nem sessionStorage além do que o js/ficha.js já faz sozinho.
// Mais o item "Ficha" da nav: data-so-previa, glifo nv-ficha e a regra que o esconde.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const FP = require('../../js/ficha-pagina.js');
const P = require('../../js/ficha/kh-previa.js');
const D = require('../../js/ficha/00-regras-dados.js');
const A = require('./estado-apoio.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
function dados() { return Object.assign(A.dadosCatalogo(), { efeitos: EFEITOS, glifos: '', erros: [] }); }
function comV2(v2) { return A.soLeitura({ khalkaria_ficha: JSON.stringify(v2 || V2) }); }
const copia = (x) => JSON.parse(JSON.stringify(x));
const semTags = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
// a fixture, com uma carta RARA (o texto guardado na v2 nunca pode aparecer),
// mais uma carta de atributo e duas magias (nível 3 e nível 5)
const SEGREDO = 'EFEITO SECRETO DA RARA';
function v2Completa() {
  const v2 = copia(V2);
  v2.cartasLimiar.push({ id: 'carta-carne-e-aco', tipo: 'carta', nome: 'Carne e Aço', descricao: SEGREDO });
  v2.cartasLimiar.push({ id: 'carta-musculos-de-ogro', tipo: 'carta', nome: 'Músculos de Ogro', descricao: 'Força.' });
  v2.grimorio.push({ id: 'magia-lanca-de-gelo', tipo: 'magia', nome: 'Lança de Gelo', descricao: '' });
  v2.grimorio.push({ id: 'magia-fissura-da-alma', tipo: 'magia', nome: 'Fissura da Alma', descricao: '' });
  return v2;
}
function desenha(v2) {
  const d = dados();
  const res = P.calcular(comV2(v2 || v2Completa()), d, '');
  assert.equal(res.estado, 'ok', res.erro);
  return { res, d, r: FP.render(res, { dados: d }) };
}

// ---------------- árvore do HTML (balanceada: </x> fora de ordem é erro) ----------------
const VAZIAS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr']);
function arvore(html) {
  const raiz = { tag: '#raiz', at: {}, filhos: [], pai: null };
  let cur = raiz, m;
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  while ((m = re.exec(html))) {
    if (m[4] != null) { cur.filhos.push({ texto: m[4] }); continue; }
    const tag = m[2].toLowerCase();
    if (m[1]) {
      if (cur.tag !== tag) throw new Error('</' + tag + '> fecha <' + cur.tag + '>');
      cur = cur.pai;
      continue;
    }
    const at = {};
    for (const a of m[3].matchAll(/([a-zA-Z_:][\w:.-]*)(?:="([^"]*)")?/g)) at[a[1]] = a[2] === undefined ? '' : a[2];
    const no = { tag, at, filhos: [], pai: cur };
    cur.filhos.push(no);
    if (!VAZIAS.has(tag) && !/\/\s*$/.test(m[3])) cur = no;
  }
  if (cur !== raiz) throw new Error('<' + cur.tag + '> nunca fechada');
  return raiz;
}
function todos(no, pred, out) {
  out = out || [];
  (no.filhos || []).forEach((f) => { if (f.tag) { if (pred(f)) out.push(f); todos(f, pred, out); } });
  return out;
}
function texto(no) { return no.texto != null ? no.texto : (no.filhos || []).map(texto).join(' ').replace(/\s+/g, ' ').trim(); }
const porCampo = (no, c) => todos(no, (x) => x.at['data-campo'] === c);
const um = (no, c) => { const l = porCampo(no, c); assert.ok(l.length >= 1, 'falta data-campo="' + c + '"'); return l[0]; };
const campos = (no) => new Set(todos(no, (x) => x.at['data-campo'] != null).map((x) => x.at['data-campo']));
const molduras = (no) => todos(no, (x) => 'data-moldura' in x.at);
const classe = (x, c) => (' ' + (x.at.class || '') + ' ').includes(' ' + c + ' ');

// ---------------- o 03 §4, página por página (texto corrido) ----------------
const SEC4 = ler('docs', 'ficha-digital', '03-respostas-pedro.md').split(/^## /m).find((s) => s.startsWith('4. Ficha física A4'));
const PAG = {};
SEC4.split(/^(?=\d\. \*\*)/m).forEach((c) => {
  const m = /^(\d)\. \*\*([^*]+?):\*\*([\s\S]*)$/.exec(c);
  if (m) PAG[m[1]] = m[3].split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
});
const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const entre = (s, a, b) => { const i = s.indexOf(a); assert.ok(i >= 0, '03 §4 sem "' + a + '"'); const j = s.indexOf(b, i + a.length); return s.slice(i + a.length, j < 0 ? undefined : j); };

test('ativação: chave khalkaria_ficha_previa = "1" ou ?ficha=v3, igual ao KhPrevia.ativacao', () => {
  const ls = (v) => ({ getItem: (k) => (k === 'khalkaria_ficha_previa' ? v : null) });
  const bloqueado = { getItem() { throw new Error('bloqueado'); } };
  const casos = [
    ['', ls(null), false], ['', ls('1'), true], ['', ls('0'), false], ['', ls('true'), false],
    ['?ficha=v3', ls(null), true], ['?x=1&ficha=v3', ls(null), true], ['?ficha=v2', ls(null), false],
    ['?ficha=v%33', ls(null), true], ['?ficha=v3x', ls(null), false], ['?nficha=v3', ls(null), false],
    ['?ficha=v3', bloqueado, true], ['', bloqueado, false], ['?ficha=%E0', ls(null), false], ['', null, false]
  ];
  for (const [search, st, esperado] of casos) {
    assert.equal(FP.ativa(search, st), esperado, JSON.stringify(search));
    if (st && st !== bloqueado && !/%E0/.test(search)) assert.equal(P.ativacao(search, st).ativa, esperado, 'KhPrevia: ' + search);
  }
});

test('sem a prévia: o aviso do js é o mesmo do template e da página gerada', () => {
  assert.equal(FP.AVISO, 'A ficha nova está em preparação. Por enquanto, use a ficha atual, no botão FICHA da lateral.');
  for (const arq of [['templates', 'ficha.template.html'], ['pages', 'ficha.html']]) {
    const h = ler(...arq);
    const m = /<p class="fp-aviso" data-sem-previa>([^<]*)<\/p>/.exec(h);
    assert.ok(m, arq.join('/') + ': aviso [data-sem-previa]');
    assert.equal(m[1], FP.AVISO, arq.join('/'));
    assert.match(h, /<div class="fp" id="fp" data-kf-ignorar>/);
  }
  assert.match(FP.htmlAviso(), /data-sem-previa>A ficha nova está em preparação\./);
});

test('página gerada: ficha.js síncrono antes do ficha-pagina.js, kh-ui.js primeiro, sem main.js, css da página', () => {
  const h = ler('pages', 'ficha.html');
  const locais = [...h.matchAll(/<script src="\.\.\/js\/([^"?]+)/g)].map((m) => m[1]);
  assert.deepEqual(locais, ['kh-ui.js', 'ficha.js', 'ficha-pagina.js', 'nav.js']);
  assert.match(h, /<link rel="stylesheet" href="\.\.\/css\/ficha-pagina\.css\?v=/);
  assert.match(h, /<body data-no-rightbar data-ficha-pagina>/);
  // o css da página é todo da camada paginas
  const css = ler('css', 'ficha-pagina.css').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  assert.match(css, /^@layer paginas \{[\s\S]*\}$/);
});

test('as 5 abas == as 5 páginas da ficha física (03 §4), na ordem do A4', () => {
  const paginas = [...SEC4.matchAll(/^(\d)\. \*\*([^*]+?):\*\*/gm)].map((m) => [Number(m[1]), m[2].trim()]);
  assert.equal(paginas.length, 5);
  assert.deepEqual(FP.ABAS.map((a) => [a.pag, a.rotulo]), paginas);
  assert.deepEqual(new Set(FP.ABAS.map((a) => a.id)), new Set(['nucleo', 'tecnicas', 'cartas', 'bazar', 'grimorio']));
});

test('casca: tablist com 5 abas, cada uma ligada ao seu tabpanel; uma selecionada, tabindex móvel; o lugar do sprite', () => {
  const h = FP.htmlCasca('cartas');
  assert.equal((h.match(/role="tablist"/g) || []).length, 1);
  const abas = [...h.matchAll(/<button type="button" class="fp-aba" role="tab" id="fp-aba-([a-z]+)" data-aba="\1" aria-controls="fp-painel-\1" aria-selected="(true|false)" tabindex="(0|-1)">/g)];
  assert.deepEqual(abas.map((m) => m[1]), FP.ABAS.map((a) => a.id));
  assert.deepEqual(abas.filter((m) => m[2] === 'true').map((m) => m[1]), ['cartas']);
  abas.forEach((m) => assert.equal(m[3], m[2] === 'true' ? '0' : '-1', m[1]));
  const paineis = [...h.matchAll(/<section class="fp-painel" role="tabpanel" id="fp-painel-([a-z]+)" data-aba="\1" aria-labelledby="fp-aba-\1" tabindex="0" aria-busy="true"( hidden)?>/g)];
  assert.deepEqual(paineis.map((m) => m[1]), FP.ABAS.map((a) => a.id));
  assert.deepEqual(paineis.filter((m) => !m[2]).map((m) => m[1]), ['cartas'], 'só o painel aberto visível');
  assert.equal((h.match(/Carregando a ficha…/g) || []).length, 6, 'topo + 5 painéis carregando');
  assert.match(h, /<div class="fp-sprite" id="fp-sprite" aria-hidden="true"><\/div>/);
  // aba desconhecida volta à primeira
  assert.match(FP.htmlCasca('xpto'), /id="fp-aba-nucleo" data-aba="nucleo" aria-controls="fp-painel-nucleo" aria-selected="true"/);
  // topo: seletor desabilitado, aviso de só-leitura com o botão da ficha atual
  assert.match(h, /<select disabled[^>]*><option selected>Ficha atual<\/option><\/select>/);
  assert.ok(h.includes(FP.AVISO_RO));
  assert.match(h, /<button type="button" class="kh-btn fp-abrir-v2">Abrir a ficha atual<\/button>/);
  assert.doesNotMatch(h, /<h[23]\b[^>]*\sid=/, 'nenhum id em h2/h3 (é do build)');
});

test('render: topo pelo motor; as 5 abas desenhadas (corpo próprio, HTML balanceado, sem emoji, sem id em h2/h3)', () => {
  const { r } = desenha();
  const t = semTags(r.topo);
  assert.match(t, /Lira Vento-Sul \(ficha atual\)/);
  for (const x of ['Raça Humano', 'Classe Batedor', 'Nível 2', 'Origem Caçador']) assert.ok(t.includes(x), x + ' em: ' + t);
  assert.match(r.topo, /<h1 class="fp-nome">Lira Vento-Sul<\/h1>/);
  assert.deepEqual(Object.keys(r.paineis), FP.ABAS.map((a) => a.id));
  for (const [id, h] of Object.entries(r.paineis)) {
    assert.ok(h.startsWith('<div class="fp-corpo fp-corpo-' + id + '">'), id);
    assert.doesNotMatch(h, /em construção|falhou ao desenhar/, id);
    arvore(h);   // lança se desbalanceado
    assert.doesNotMatch(h, EMOJI, id + ': sem emoji');
    assert.doesNotMatch(h, /<script|\son[a-z]+=/i, id);
    assert.doesNotMatch(h, /<h[12]\b|<h3\b[^>]*\sid=/, id + ': sem h1/h2 nem id em h3');
    assert.doesNotMatch(h, /kf3-/, id + ': nada da prévia');
  }
  // os ícones do A4: .webp (o shell faz o mesmo nas páginas estáticas) e existentes
  const imgs = new Set(Object.values(r.paineis).flatMap((h) => [...h.matchAll(/<img [^>]*src="\.\.\/images\/ficha\/([a-z]+)\.webp"/g)].map((m) => m[1])));
  assert.ok(imgs.size >= 10, [...imgs].join());
  imgs.forEach((n) => assert.ok(fs.existsSync(path.join(A.RAIZ, 'images', 'ficha', n + '.webp')), n));
  // base dos ícones vem da opção (no navegador, a raiz do site)
  assert.match(FP.render(desenha().res, { dados: dados(), base: 'http://x/' }).paineis.nucleo, /src="http:\/\/x\/images\/ficha\/forca\.webp"/);
});

test('render: aba sem desenhista fica "em construção"; o desenhista recebe o resultado, o KhConta (prefixo fp) e o contexto', () => {
  const { res, d } = desenha();
  const orig = FP.RENDER.nucleo;
  try {
    let ctx0 = null;
    FP.RENDER.nucleo = (rs, C, ctx) => { ctx0 = ctx; return '<p>' + C.conta('evasao.passiva') + '</p>'; };
    let r = FP.render(res, { dados: d });
    assert.match(r.paineis.nucleo, /class="kh-conta[^"]*" tabindex="0" aria-describedby="fp-d-1"/);
    assert.match(r.paineis.nucleo, /<span class="kh-conta-dica fp-dica" id="fp-d-1" role="tooltip">/);
    assert.equal(r.caminhos[0], 'evasao.passiva');
    assert.ok(ctx0.porId['tecnica:batedor-atento'] && ctx0.classes['classe-batedor'] && ctx0.ramos['batedor-ramo-do-cartografo']);
    assert.equal(ctx0.ramos['batedor-ramo-do-cartografo'].chave, 'cartografo');
    // as corrupções vêm do bloco da raça
    assert.ok(ctx0.porId['corrupcao:corrompido-sangue-morto']);
    delete FP.RENDER.nucleo;
    r = FP.render(res, { dados: d });
    assert.match(r.paineis.nucleo, /Esta aba ainda está em construção\./);
    // uma aba que lança não derruba as outras
    FP.RENDER.nucleo = () => { throw new Error('quebrou'); };
    r = FP.render(res, { dados: d });
    assert.match(r.paineis.nucleo, /Esta aba falhou ao desenhar: quebrou/);
    assert.match(r.paineis.tecnicas, /fp-corpo-tecnicas/);
  } finally { FP.RENDER.nucleo = orig; }
});

test('render: sem ficha, ficha ilegível e motor ausente viram mensagem no topo e nos painéis', () => {
  let r = FP.render(P.calcular(A.soLeitura({}), dados(), ''));
  assert.match(r.topo, /<h1 class="fp-nome">\(sem ficha\)<\/h1>/);
  assert.match(r.topo, /Não há ficha neste navegador/);
  Object.values(r.paineis).forEach((p) => assert.match(p, /Não há ficha neste navegador/));
  r = FP.render(P.calcular(A.soLeitura({ khalkaria_ficha: '{quebrado' }), dados(), ''));
  assert.match(r.topo, /não pôde ser lida/);
  r = FP.render({ estado: 'sem-motor', erros: ['data/efeitos.json'] });
  assert.match(r.topo, /<h1 class="fp-nome">Ficha<\/h1>/);
  assert.match(r.topo, /não carregou\. Recarregue/);
  assert.match(r.topo, /Não carregou: data\/efeitos\.json/);
  // sem catálogo (dados não carregados), a página ainda desenha: tudo vira órfã
  const res = P.calcular(comV2(), dados(), '');
  r = FP.render(res);
  assert.match(r.paineis.tecnicas, /data-orfa/);
});

// ======================================================================
// Estrutura por conjunto contra o 03 §4
// ======================================================================
test('aba 1 Núcleo: os campos da pág. 1 do A4 por conjunto (rótulos, atributos, 24 perícias, 14 tipos)', () => {
  const { r } = desenha();
  const no = arvore(r.paineis.nucleo);
  const p1 = PAG[1];
  // rótulo do A4 (âncora no texto do 03 §4) -> data-campo
  const ROTULOS = [['Nível', 'nivel'], ['XP', 'xp'], ['Nome do Personagem', 'nome'], ['Jogador', 'jogador'], ['Raça', 'raca'],
    ['Classe', 'classe'], ['Origem', 'origem'], ['Recurso de Classe', 'recurso-classe'], ['Saúde (coração', 'saude'],
    ['Stamina (raio', 'stamina'], ['Éter (espiral', 'eter'], ['Movimento (pé', 'movimento'], ['Sins (moeda', 'sins'],
    ['Evasão (escudo', 'evasao'], ['CD (mão', 'cd'], ['Equipamentos + Qtd', 'equipamentos'], ['Bugigangas + Qtd', 'bugigangas'],
    ['Armadura e Resistência', 'armadura']];
  ROTULOS.forEach(([rot]) => assert.ok(p1.includes(rot), '03 §4 pág. 1 sem "' + rot + '"'));
  const esperado = new Set(ROTULOS.map((x) => x[1]));
  // atributos: "ilustração (Força: …; Destreza: …)"
  const ats = [...entre(p1, 'ilustração (', ')').matchAll(/(\p{Lu}\p{Ll}+):/gu)].map((m) => m[1]);
  assert.equal(ats.length, 5);
  ats.forEach((n) => esperado.add('atributo-' + norm(n).slice(0, 3).toUpperCase()));
  // perícias: a lista do A4, com os nomes de hoje (CLAUDE.md §2) e o Ofício( ) virando os três
  const RENOMEADAS = { convencer: 'convencimento', intimidar: 'intimidacao', enganar: 'enganacao' };
  const doA4 = entre(p1, 'caixa de total: ', ' · Recurso de Classe').split(/,\s*|\s·\s/).map((s) => norm(s.replace(/\s*\(.*$/, '')));
  assert.equal(doA4.length, 22);
  const porNome = {};
  D.pericias.forEach((p) => { porNome[norm(p.nome)] = p.id; });
  const pers = new Set();
  doA4.forEach((n) => {
    if (n === 'oficio') D.pericias.filter((p) => /^oficio-/.test(p.id)).forEach((p) => pers.add(p.id));
    else { const id = porNome[RENOMEADAS[n] || n]; assert.ok(id, 'perícia do A4 sem par: ' + n); pers.add(id); }
  });
  assert.deepEqual([...pers].sort(), D.pericias.map((p) => p.id).sort(), 'as 24 perícias canônicas');
  pers.forEach((id) => esperado.add('pericia-' + id));
  // resistências: os 12 do A4, com Ordinário aberto em Cortante/Contundente/Perfurante (14, D63/D67)
  const tipos = entre(p1, 'R e I (', ')').split(/,\s*/).map(norm);
  assert.equal(tipos.length, 12);
  const t14 = tipos.flatMap((t) => (t === 'ordinario' ? D.defesa.categorias.ordinario : [t]));
  assert.equal(new Set(t14).size, 14);
  t14.forEach((t) => esperado.add('resistencia-' + t));

  const tem = campos(no);
  const soDoc = [...esperado].filter((c) => !tem.has(c));
  assert.deepEqual(soDoc, [], 'só no A4 (faltam na página)');
  // o que a página tem além do A4: o que o 05 (F4.3) e o plano (M1) pedem
  const EXTRAS = ['identidade', 'variante', 'subespecie', 'ramo', 'atributos', 'pericias', 'recursos', 'derivados', 'acoes',
    'capacidade', 'carga', 'ar', 'ae-todos', 'ae-ordinario', 'ae-elemental', 'ae-biologico', 'ae-mistico',
    'vhelor', 'outros-nucleo', 'imunidades', 'idiomas', 'avisos'];
  const soPagina = [...tem].filter((c) => !esperado.has(c) && !EXTRAS.includes(c));
  assert.deepEqual(soPagina, [], 'só na página (fora do A4 e dos extras do 05)');
  // cada atributo: Total e Mod. com a conta e a ilustração; cada perícia: 4 círculos, atributo e total
  ats.forEach((n) => {
    const a = um(no, 'atributo-' + norm(n).slice(0, 3).toUpperCase());
    assert.equal(todos(a, (x) => x.tag === 'img').length, 1);
    assert.deepEqual(todos(a, (x) => x.at['data-caminho'] != null).map((x) => x.at['data-caminho'].replace(/^atributo\.\w+\./, '')), ['total', 'mod']);
  });
  pers.forEach((id) => {
    const p = um(no, 'pericia-' + id);
    assert.equal(todos(p, (x) => classe(x, 'fp-grau')).length, 4, id);
    assert.equal(todos(p, (x) => classe(x, 'fp-grau') && classe(x, 'on')).length, V2.pericias[id] != null ? { 0: 0, 2: 1, 4: 2, 6: 3, 8: 4 }[V2.pericias[id]] : 0, id);
    assert.equal(todos(p, (x) => x.at['data-caminho'] === 'pericia.' + id + '.total').length, 1, id);
    assert.ok(texto(todos(p, (x) => classe(x, 'fp-per-at'))[0]), id + ': atributo usado');
  });
  // recursos: atual (estado) / máx. (conta), com a cor do recurso
  ['saude', 'stamina', 'eter'].forEach((k) => {
    const b = um(no, k);
    assert.equal(todos(b, (x) => x.at['data-ficha'] === 'recursos.' + k + '.atual').length, 1, k);
    assert.equal(todos(b, (x) => x.at['data-caminho'] === 'recurso.' + k + '.max').length, 1, k);
    assert.equal(todos(b, (x) => classe(x, 'fp-barra-' + k)).length, 1, k);
  });
  const css = ler('css', 'ficha-pagina.css');
  assert.match(css, /\.fp-barra-stamina \.fp-barra-fill \{ background: var\(--recurso-stamina\); \}/);
  assert.match(css, /\.fp-barra-eter \.fp-barra-fill \{ background: linear-gradient\(90deg, var\(--recurso-eter-verde\), var\(--recurso-eter-roxo\)\); \}/);
  // capacidade: régua (componente kh-regua, role=meter) nas duas colunas
  ['equipamentos', 'bugigangas'].forEach((k) => assert.equal(todos(um(no, k), (x) => x.at.role === 'meter' && classe(x, 'kh-regua')).length, 1, k));
  // Marcas da Vhelor só com 1 ou mais
  assert.ok(!tem.has('vhelor'));
  // a v2 não tem Vhelor: a marca entra na v3 migrada (a página lê f.vhelor)
  const res2 = P.calcular(comV2(v2Completa()), dados(), '');
  res2.ficha.vhelor = { marcas: 2 };
  const h2 = FP.render(res2, { dados: dados() }).paineis.nucleo;
  assert.match(h2, /data-campo="vhelor"[\s\S]*?<span class="fp-n" data-ficha="vhelor\.marcas">2<\/span>/);
});

test('aba 2 Técnicas & Marcas: os grupos da pág. 2 com as molduras do A4 (por contagem do 03 §4)', () => {
  const { r } = desenha();
  const no = arvore(r.paineis.tecnicas);
  const CAMPO = { 'Técnicas Gerais': 'tecnicas-gerais', 'Tier 1': 'tier-1', 'Tier 2': 'tier-2', 'Tier 3': 'tier-3', Marcas: 'marcas', 'Técnicas Diversas': 'tecnicas-diversas' };
  const contagens = [...PAG[2].matchAll(/(Técnicas Gerais|Tier \d|Marcas|Técnicas Diversas) \((\d+)/g)].map((m) => [CAMPO[m[1]], Number(m[2])]);
  assert.deepEqual(contagens.map((x) => x[0]).sort(), Object.values(CAMPO).sort());
  contagens.forEach(([c, n]) => assert.ok(molduras(um(no, c)).length >= n, c + ': ' + molduras(um(no, c)).length + ' < ' + n));
  // o grupo de ramo existe (05: Técnicas de Ramo), e o Tier 3 é o das Ultimates
  um(no, 'tecnicas-ramo');
  assert.match(texto(um(no, 'tier-3')), /Ultimates/);
  // card: nome, custo (custoTexto do catálogo) e texto
  const atento = todos(no, (x) => x.at['data-id'] === 'batedor-atento')[0];
  assert.ok(atento && classe(atento.pai, 'fp-tecs') && atento.pai.pai.at['data-campo'] === 'tecnicas-gerais');
  assert.equal(texto(todos(atento, (x) => x.tag === 'h4')[0]), 'Atento');
  assert.equal(texto(todos(atento, (x) => x.at['data-campo'] === 'custo')[0]), 'Passiva');
  assert.equal(texto(todos(atento, (x) => classe(x, 'fp-tec-txt'))[0]), 'Você é imune a condição Desprevenido.', 'sem o custo repetido');
  // cada entrada no grupo certo
  const grupo = (id) => { let n = todos(no, (x) => x.at['data-id'] === id)[0]; while (n && !n.at['data-campo']) n = n.pai; return n && n.at['data-campo']; };
  assert.equal(grupo('batedor-oportunista'), 'tecnicas-gerais');
  assert.equal(grupo('batedor-silencio'), 'tier-3');
  assert.equal(grupo('batedor-cicatrizes-da-jornada'), 'marcas');
  // todo glifo usado (inclusive o g-ramo-<chave> montado em runtime) tem o seu <symbol>
  const sprite = new Set([...ler('partials', 'glifos.html').matchAll(/<symbol id="(g-[^"]+)"/g)].map((x) => x[1]));
  const usados = new Set(Object.values(r.paineis).join('').match(/href="#(g-[^"]+)"/g).map((x) => x.slice(7, -1)));
  assert.ok(usados.has('g-ramo-cartografo') && usados.has('g-ramo-semnome') && usados.has('g-moldura-raizes-canto'), [...usados].join());
  usados.forEach((g) => assert.ok(sprite.has(g), 'glifo sem símbolo: ' + g));
  ['humano-simples', 'automato-visao-termica', 'humano-persistencia-humana', 'corrompido-sangue-morto'].forEach((id) => assert.equal(grupo(id), 'tecnicas-diversas', id));
});

test('aba 2: órfã com o texto salvo e a marca "órfã"; Tier e Marca acima do nível mostram o nível que destrava (D34)', () => {
  const { r } = desenha();
  const no = arvore(r.paineis.tecnicas);
  const orfas = todos(no, (x) => 'data-orfa' in x.at);
  assert.deepEqual(orfas.map((x) => texto(todos(x, (y) => y.tag === 'h4')[0])).sort(), ['Golpe Esquecido', 'Passo do Vento']);
  orfas.forEach((x) => {
    assert.ok(todos(x, (y) => classe(y, 'fp-selo-orfa') && texto(y) === 'órfã').length === 1);
    assert.ok(!x.at['data-id'], 'órfã não tem id de catálogo');
  });
  assert.match(texto(orfas.find((x) => /Passo do Vento/.test(texto(x)))), /Duas classes têm uma técnica com este nome\./);
  assert.match(texto(orfas.find((x) => /Golpe Esquecido/.test(texto(x)))), /Técnica que não existe mais no catálogo\./);
  // o motivo do ambíguo fica no título do selo (candidatos)
  assert.match(r.paineis.tecnicas, /title="Sem par no catálogo \(ambiguo: tecnica:monge-passo-do-vento, tecnica:artilheiro-passo-do-vento\)/);
  // D34 no nível 2 (os níveis vêm de data/classes/batedor.json: ramosRegra.porTier e a progressão)
  const classeB = A.lerJSON('data', 'classes', 'batedor.json').classe;
  const nv = {}; classeB.ramosRegra.porTier.forEach((t) => { nv[t.tier] = t.nivel; });
  assert.deepEqual(nv, { 1: 2, 2: 4, 3: 5 });
  const t1 = molduras(um(no, 'tier-1')), t2 = molduras(um(no, 'tier-2'));
  assert.ok(t1.every((x) => !('data-destrava' in x.at)), 'Tier 1 já destravado no nível 2');
  assert.ok(t2.length === 2 && t2.every((x) => x.at['data-destrava'] === '4'));
  assert.match(texto(todos(no, (x) => x.at['data-id'] === 'batedor-silencio')[0]), /destrava no nível 5/);
  assert.match(texto(todos(no, (x) => x.at['data-id'] === 'batedor-cicatrizes-da-jornada')[0]), /destrava no nível 3/);
  assert.deepEqual(molduras(um(no, 'marcas')).filter((x) => 'data-vazia' in x.at).map((x) => x.at['data-destrava']), ['4', '5']);
  // no nível 5 nada fica travado
  const v2 = v2Completa(); v2.meta.nivel = 5;
  const h5 = desenha(v2).r.paineis.tecnicas;
  assert.doesNotMatch(h5, /destrava no nível|data-destrava/);
});

test('aba 3 Cartas, Lore & Outros: 11 molduras (4+4+3), saldo do Limiar com a conta, História e Outros', () => {
  const { r } = desenha();
  const no = arvore(r.paineis.cartas);
  const n = Number(/(\d+) molduras de carta \((\d) \+ (\d) \+ (\d)\)/.exec(PAG[3])[1]);
  assert.equal(n, 11);
  const cartas = um(no, 'cartas');
  assert.ok(molduras(cartas).length >= n);
  assert.match(ler('css', 'ficha-pagina.css'), /\.fp-cartas \{ display: grid; grid-template-columns: repeat\(4, minmax\(0, 1fr\)\);/, '4 por linha: 4 + 4 + 3');
  assert.equal(todos(um(no, 'limiar-saldo'), (x) => x.at['data-caminho'] === 'limiar.saldo').length, 1);
  ['História', 'Outros'].forEach((t) => assert.ok(PAG[3].includes(t)));
  assert.match(texto(um(no, 'historia')), /Cresceu nas trilhas do sul\./);
  assert.match(texto(um(no, 'outros')), /Em branco/);
  // cada carta com o requisito ok ou aviso
  const alma = todos(cartas, (x) => x.at['data-id'] === 'limiar-alma-resiliente')[0];
  assert.match(texto(alma), /sem requisito/);
  assert.match(texto(alma), /Aumente 1 nível de treinamento em Fortitude, Vontade e Reflexos/);
  const ogro = todos(cartas, (x) => x.at['data-id'] === 'limiar-musculos-de-ogro')[0];
  const req = todos(ogro, (x) => x.at['data-campo'] === 'requisito')[0];
  assert.ok(classe(req, 'fp-req-aviso'), 'FOR 10 < 16');
  assert.equal(todos(req, (x) => x.at['data-caminho'] === 'atributo.FOR.total').length, 1, 'o atributo comparado, com a conta');
  // Abismo: dores e benefícios (05 + plano M1)
  assert.deepEqual(todos(um(no, 'abismo'), (x) => x.at['data-id'] != null).map((x) => x.at['data-id']).sort(), ['abismo-estabanado', 'abismo-olhos-da-noite']);
});

test('aba 3: carta rara não revelada mostra ícone, requisito e nome, NUNCA o efeito (nem o texto guardado na v2)', () => {
  const { r } = desenha();
  const tudo = r.topo + Object.values(r.paineis).join('');
  assert.ok(!tudo.includes(SEGREDO), 'o texto da v2 vazou');
  const no = arvore(r.paineis.cartas);
  const raras = todos(no, (x) => 'data-rara' in x.at);
  assert.equal(raras.length, 1);
  const rara = raras[0];
  assert.equal(rara.at['data-id'], 'limiar-carne-e-aco');
  assert.equal(texto(todos(rara, (x) => x.tag === 'h4')[0]), 'Carne e Aço');
  assert.match(texto(todos(rara, (x) => x.at['data-campo'] === 'requisito')[0]), /^FOR 18\+, CON 18\+ aviso:/);
  assert.equal(todos(rara, (x) => classe(x, 'fp-carta-ico')).length, 1);
  assert.equal(todos(rara, (x) => classe(x, 'fp-carta-txt')).length, 0, 'sem parágrafo de efeito');
  assert.match(texto(rara), /Efeito oculto até a carta ser revelada\./);
  // o catálogo não tem efeito de rara (M6): a página não teria de onde tirar
  const cat = A.lerJSON('data', 'catalogo', 'carta.json').entradas.find((e) => e.id === 'limiar-carne-e-aco');
  assert.equal(cat.categoria, 'rara');
  assert.ok(!cat.resumo);
  // sem emoji como ícone: o ⭐ da página do Limiar vira SVG
  assert.doesNotMatch(r.paineis.cartas, EMOJI);
  const ico = todos(rara, (x) => classe(x, 'fp-carta-ico'))[0];
  assert.equal(todos(ico, (x) => x.tag === 'svg').length, 1, 'ícone em SVG');
});

test('aba 4 O Bazar: o inventário da pág. 4 (Pesados 2, Leves 3, Armas e Outros 3, materiais por raridade), Sins, carga e sintonizados', () => {
  const { r } = desenha();
  const no = arvore(r.paineis.bazar);
  const p4 = PAG[4];
  const m = /Pesados \((\d)\), Leves \((\d)\), Armas e Outros \((\d)\)/.exec(p4);
  [['equip-pesados', +m[1]], ['equip-leves', +m[2]], ['equip-armas', +m[3]]].forEach(([c, n]) => assert.ok(molduras(um(no, c)).length >= n, c));
  assert.ok(p4.includes('Materiais por raridade'));
  // Bugigangas e Equipamentos: uma seção de itens cada; a carga (régua) com campo próprio
  ['bugigangas', 'equipamentos'].forEach((c) => assert.equal(porCampo(no, c).length, 1, c + ': uma seção só'));
  ['carga-equipamentos', 'carga-bugigangas'].forEach((c) => assert.equal(todos(um(no, c), (x) => x.at.role === 'meter').length, 1, c));
  // as raridades do sistema (tokens --rar-*) viram grupos em Materiais
  const rars = [...new Set([...ler('css', 'tokens.css').matchAll(/--rar-([a-z]+): #/g)].map((x) => x[1]))];
  assert.deepEqual(todos(um(no, 'materiais'), (x) => x.at['data-raridade'] != null).map((x) => x.at['data-raridade']), rars);
  // cada item com Nome/Raridade/Qtd
  todos(no, (x) => x.tag === 'li' && x.at['data-uid'] != null).forEach((li) => {
    ['nome', 'raridade', 'qtd'].forEach((c) => assert.equal(todos(li, (x) => x.at['data-campo'] === c).length, 1, li.at['data-uid'] + ' ' + c));
  });
  const ondeEsta = (uid) => { let n = todos(no, (x) => x.at['data-uid'] === uid)[0]; while (n && !n.at['data-campo']) n = n.pai; return n && n.at['data-campo']; };
  assert.equal(ondeEsta('eFixture2'), 'equip-pesados', 'Armadura de Couro: [Pesada]');
  assert.equal(ondeEsta('eFixture3'), 'equip-armas', 'Adaga de Kali');
  assert.equal(ondeEsta('eFixture4'), 'equip-armas', 'Escudo');
  assert.equal(ondeEsta('eFixture0'), 'bugigangas', 'munição');
  assert.match(texto(todos(um(no, 'materiais'), (x) => x.at['data-raridade'] === 'exotico')[0]), /Kali Qtd 2/);
  // Equipado e Sintonizado marcados; a arma equipada com Atacar, Progressão e Dano (contas)
  const adaga = todos(no, (x) => x.at['data-uid'] === 'eFixture3')[0];
  assert.equal(todos(adaga, (x) => classe(x, 'fp-selo-equipado')).length, 1);
  assert.deepEqual(todos(adaga, (x) => x.at['data-caminho'] != null).map((x) => x.at['data-caminho']),
    ['ataque.eFixture3.atacar', 'ataque.eFixture3.atacar', 'ataque.eFixture3.dano']);
  assert.match(texto(adaga), /1º \+7 · 2º \+2 · 3º −3/);
  assert.match(r.paineis.bazar, /<span class="fp-n" data-ficha="inventario\.sins">37<\/span>/);
  assert.equal(todos(um(no, 'sintonizados'), (x) => x.at['data-caminho'] === 'inventario.sintonizados').length, 1);
  assert.match(texto(um(no, 'sintonizados')), /0 \/ 3/);
  // sintonizar um item: a conta diz quem
  const v2 = v2Completa(); v2.inventario.equipamentos[1].sintonizado = true;
  assert.match(desenha(v2).r.paineis.bazar, /data-caminho="inventario\.sintonizados"><b class="fp-v">1 \/ 3<\/b>[\s\S]*?Adaga de Kali/);
  assert.equal(todos(um(no, 'carga'), (x) => x.at['data-caminho'] === 'carga').length, 1);
});

test('aba 5 Grimório: 5 níveis; cada magia com os campos da pág. 5 e o custo nas intensidades (Nv1 sem Contida, Nv5 Foco Primordial)', () => {
  const { r } = desenha();
  const no = arvore(r.paineis.grimorio);
  const rot = /com (.+?) e texto/.exec(PAG[5])[1].split(/,\s*/);
  assert.deepEqual(rot, ['Nome', 'Ação', 'Alvo', 'Resist.', 'Alcance', 'Duração']);
  assert.equal(Number(/Hoje são (\d) níveis/.exec(PAG[5])[1]), 5);
  for (let n = 1; n <= 5; n++) um(no, 'magias-nivel-' + n);
  const mags = todos(no, (x) => x.tag === 'article' && classe(x, 'fp-mg'));
  assert.deepEqual(mags.map((x) => x.at['data-id']), ['magia-fagulha', 'magia-lanca-de-gelo', 'magia-fissura-da-alma']);
  mags.forEach((mg) => {
    assert.equal(texto(todos(mg, (x) => x.at['data-campo'] === 'nome')[0]).length > 0, true);
    assert.deepEqual(todos(mg, (x) => x.tag === 'dt').map(texto), rot.slice(1));
    assert.ok(texto(todos(mg, (x) => x.at['data-campo'] === 'texto')[0]).length > 20);
  });
  const custo = (id) => todos(mags.find((x) => x.at['data-id'] === id), (x) => classe(x, 'fp-mg-int'));
  // Nível 1: sem Contida (só traço, sem conta); Normal escolhida
  const f = custo('magia-fagulha');
  assert.equal(f.length, 4);
  assert.equal(todos(f[0], (x) => x.at['data-caminho'] != null).length, 0);
  assert.deepEqual(f.slice(1).map((c) => todos(c, (x) => x.at['data-caminho'] != null)[0].at['data-caminho']),
    ['magia.magia-fagulha.custo.normal', 'magia.magia-fagulha.custo.forcada', 'magia.magia-fagulha.custo.transbordante']);
  assert.ok(classe(f[1], 'fp-escolhida'));
  // Nível 3: as 4 intensidades com a conta
  assert.equal(custo('magia-lanca-de-gelo').filter((c) => todos(c, (x) => x.at['data-caminho'] != null).length === 1).length, 4);
  // Nível 5: Foco Primordial e só a Transbordante
  const fis = mags.find((x) => x.at['data-id'] === 'magia-fissura-da-alma');
  assert.match(texto(fis), /Foco Primordial/);
  assert.equal(custo('magia-fissura-da-alma').filter((c) => todos(c, (x) => x.at['data-caminho'] != null).length === 1).length, 1);
  // o <em> do catálogo sobrevive; o resto do HTML não
  assert.match(r.paineis.grimorio, /Reflexos ou <em>Lento 1<\/em> por 1 rodada/);
  assert.equal(FP.textoRico('<em>Lento 1</em> <script>x</script> <a href="y">z</a> 2 < 3'), '<em>Lento 1</em> x z 2 &lt; 3');
});

// ======================================================================
// Todo número com a conta
// ======================================================================
// {id: texto} de cada dica e a lista de aria-describedby (o padrão do previa.test.js, prefixo fp)
function dicas(html) {
  const ids = {};
  const re = /<span class="kh-conta-dica fp-dica" id="([^"]+)" role="tooltip">/g;
  let m;
  while ((m = re.exec(html))) {
    const i = re.lastIndex;
    let prof = 1, t;
    const tag = /<(\/?)span\b[^>]*>/g;
    tag.lastIndex = i;
    while (prof && (t = tag.exec(html))) prof += t[1] ? -1 : 1;
    ids[m[1]] = html.slice(i, t.index);
  }
  return { ids, refs: [...html.matchAll(/aria-describedby="([^"]+)"/g)].map((x) => x[1]) };
}
// tira cada elemento que casa com `abre` (até o fechamento equilibrado da mesma tag)
function tira(html, abre) {
  let out = '', i = 0, m;
  const re = new RegExp(abre.source, 'g');
  while ((m = re.exec(html))) {
    out += html.slice(i, m.index);
    const tag = /^<([a-z0-9]+)/i.exec(m[0])[1];
    const t = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'g');
    t.lastIndex = m.index + m[0].length;
    let prof = /\/>$/.test(m[0]) ? 0 : 1, x = null;
    while (prof && (x = t.exec(html))) prof += x[1] ? -1 : 1;
    i = x ? x.index + x[0].length : m.index + m[0].length;
    re.lastIndex = i;
  }
  return out + html.slice(i);
}

test('todo número calculado sai com a conta: tooltip ligado por aria-describedby, fórmula simbólica e numérica', () => {
  const { res, r } = desenha();
  const html = r.topo + Object.values(r.paineis).join('');
  const caminhos = r.caminhos;
  const esperados = [];
  ['FOR', 'DES', 'CON', 'INT', 'SAB'].forEach((a) => esperados.push('atributo.' + a + '.total', 'atributo.' + a + '.mod'));
  D.pericias.forEach((p) => esperados.push('pericia.' + p.id + '.total'));
  ['saude', 'stamina', 'eter', 'classe'].forEach((x) => esperados.push('recurso.' + x + '.max'));
  esperados.push('recurso.stamina.disponivel', 'evasao.passiva', 'evasao.ativa', 'cd', 'movimento', 'acoes',
    'capacidade.equipamentos', 'capacidade.bugigangas', 'carga', 'ar', 'limiar.saldo', 'inventario.sintonizados');
  ['ordinario', 'elemental', 'biologico', 'mistico', 'todos'].forEach((c) => esperados.push('ae.' + c));
  D.defesa.categorias && Object.values(D.defesa.categorias).flat().concat(['forca', 'primordial']).forEach((t) =>
    esperados.push('resistencia.' + t, 'imunidade.' + t, 'vulnerabilidade.' + t, 'ae.' + t, 'defesa.' + t));
  res.av.ordem.filter((c) => /^ataque\./.test(c)).forEach((c) => esperados.push(c));
  esperados.push('magia.magia-fagulha.custo.normal', 'magia.magia-fagulha.custo.forcada', 'magia.magia-fagulha.custo.transbordante');
  const faltam = esperados.filter((c) => !caminhos.includes(c));
  assert.deepEqual(faltam, []);

  const { ids, refs } = dicas(html);
  assert.equal(refs.length, caminhos.length, 'uma conta por número');
  assert.equal(new Set(refs).size, refs.length, 'ids únicos');
  refs.forEach((id) => {
    assert.match(id, /^fp-d-\d+$/);
    assert.ok(ids[id] != null, 'aria-describedby sem dica: ' + id);
    const sim = /<span class="fp-d-sim">([^<]+)<\/span>/.exec(ids[id]);
    const num = /<span class="fp-d-num">([^<]+)<\/span>/.exec(ids[id]);
    assert.ok(sim && sim[1].trim(), 'fórmula simbólica: ' + id);
    assert.ok(num && num[1].startsWith('= '), 'fórmula numérica: ' + id);
  });
  assert.equal((html.match(/class="kh-conta fp-conta" tabindex="0"/g) || []).length, caminhos.length, 'focável (teclado)');
});

test('nenhum dígito fora de conta, de número de estado (data-ficha) ou de texto do catálogo', () => {
  const { res, r } = desenha();
  // o que é TEXTO (catálogo, nome, rótulo de regra fixa) e pode ter dígito, por classe ou campo
  const TEXTO = /<[a-z0-9]+ [^>]*(?:class="(?:fp-tec-txt|fp-tec-custo|fp-carta-txt|fp-req-txt|fp-item-ef|fp-item-cat|fp-mg-stats|fp-nota[^"]*|fp-sub|fp-legenda|fp-alertas|fp-trava-txt|fp-selo [^"]*|fp-tier-tit|fp-bloco-tit|fp-rar[^"]*|fp-lore)"|data-campo="(?:jogador|nome|avisos)")[^>]*>/;
  for (const [aba, h0] of Object.entries(r.paineis)) {
    let h = tira(h0, /<span class="kh-conta fp-conta"[^>]*>/);
    h = tira(h, /<span class="fp-calc">/);          // o calculado antes do ajuste (parte da conta)
    h = tira(h, /<span class="fp-n" data-ficha="[^"]+">/);
    h = tira(h, TEXTO);
    h = h.replace(/<[^>]+>/g, ' ');
    const sobra = [...h.matchAll(/\S*\d\S*/g)].map((m) => m[0]);
    assert.deepEqual(sobra, [], aba + ': número sem conta');
  }
  // número de estado: o caminho existe na ficha v3 e o valor bate
  const f = res.ficha;
  const valor = (c) => {
    const p = c.split('.');
    if (p[0] === 'inventario' && p.length === 3 && p[1] !== 'sins') {
      const it = f.inventario.bugigangas.concat(f.inventario.equipamentos).find((x) => x.uid === p[1]);
      return it ? Math.max(1, parseInt(it[p[2]], 10) || 1) : undefined;
    }
    if (p[0] === 'entradas') { const e = f.entradas.find((x) => x.uid === p[1]); return p.slice(2).reduce((o, k) => (o ? o[k] : undefined), e); }
    return p.reduce((o, k) => (o ? o[k] : undefined), f);
  };
  const est = [...Object.values(r.paineis).join('').matchAll(/<span class="fp-n" data-ficha="([^"]+)">([^<]*)<\/span>/g)];
  assert.ok(est.length >= 8);
  est.forEach(([, c, t]) => {
    const v = valor(c);
    assert.ok(v !== undefined, 'data-ficha fora da ficha: ' + c);
    assert.equal(t, v == null || v === '' ? '—' : String(v).replace('.', ','), c);
  });
});

test('recurso de classe sem contador (D105): as características no lugar do número', () => {
  const v2 = v2Completa(); v2.meta.classe = 'Espadachim'; v2.meta.ramo = '';
  const { r } = desenha(v2);
  const no = arvore(r.paineis.nucleo);
  const b = um(no, 'recurso-classe');
  assert.match(texto(b), /Recurso de Classe sem contador \(D105\)/);
  assert.match(r.paineis.nucleo, /data-caminho="recurso\.classe\.max"><b class="fp-v">Proficiência com Espadas · Marca do Duelo<\/b>/);
  assert.equal(todos(b, (x) => x.at['data-ficha'] != null).length, 0, 'sem atual');
  // o Batedor (medidor Instinto): atual / máx. com a conta
  const nb = arvore(desenha().r.paineis.nucleo);
  const bb = um(nb, 'recurso-classe');
  assert.match(texto(bb), /Instinto/);
  assert.equal(todos(bb, (x) => x.at['data-ficha'] === 'recursos.classe.atual').length, 1);
});

test('desenhar não grava nada: storage só-leitura do começo ao fim', () => {
  const ls = comV2(v2Completa());
  const res = P.calcular(ls, dados(), '');
  FP.render(res, { dados: dados() });
  assert.deepEqual(ls.escritas, []);
});

// ---------------- navegador: o artefato js/ficha.js e depois o js/ficha-pagina.js num vm ----------------
const SRC_FICHA = ler('js', 'ficha.js');
const SRC_PAGINA = ler('js', 'ficha-pagina.js');
const BASE = 'http://site.test/';

// elemento falso; innerHTML cria um elemento por id="…" com os atributos da tag
function criaDom() {
  const porId = new Map();
  function elemento(tag, attrs) {
    const a = Object.assign({}, attrs || {}), ouv = {};
    const e = {
      tagName: String(tag).toUpperCase(), hidden: 'hidden' in a, focado: false, _html: '',
      getAttribute: (k) => (k in a ? a[k] : null), setAttribute: (k, v) => { a[k] = String(v); },
      removeAttribute: (k) => { delete a[k]; }, hasAttribute: (k) => k in a,
      addEventListener: (t, f) => { (ouv[t] = ouv[t] || []).push(f); },
      dispara: (ev) => (ouv[ev.type] || []).forEach((f) => f(ev)),
      closest: (sel) => {
        if (sel === '[role="tab"]') return a.role === 'tab' ? e : null;
        if (sel === '.fp-abrir-v2') return /\bfp-abrir-v2\b/.test(a.class || '') ? e : null;
        return null;
      },
      focus: () => { e.focado = true; },
      get innerHTML() { return e._html; },
      set innerHTML(v) {
        e._html = String(v);
        for (const m of e._html.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/g)) {
          const at = {};
          for (const x of m[2].matchAll(/([a-z][\w-]*)(?:="([^"]*)")?/g)) at[x[1]] = x[2] === undefined ? '' : x[2];
          if (at.id) porId.set(at.id, elemento(m[1], at));
        }
      }
    };
    return e;
  }
  return { porId, elemento };
}

function pagina(opcoes) {
  opcoes = opcoes || {};
  const st = new Map(Object.entries(opcoes.ls || {})), escritas = [], escritasSessao = [], buscas = [], ouvDoc = {};
  const dom = criaDom();
  if (opcoes.comPagina !== false) {
    const fp = dom.elemento('div', { class: 'fp', id: 'fp', 'data-kf-ignorar': '' });
    fp.innerHTML = '<h1 class="fp-titulo">Ficha</h1><p class="fp-aviso" data-sem-previa>' + FP.AVISO + '</p>';
    dom.porId.set('fp', fp);
  }
  const script = { src: BASE + 'js/ficha.js?v=abc123' };
  const document = {
    readyState: 'loading', currentScript: null, activeElement: null, visibilityState: 'visible',
    body: { hasAttribute: () => false, appendChild() {} }, head: { appendChild() {} },
    querySelector: (sel) => (/js\/ficha\.js/.test(sel) ? script : null), querySelectorAll: () => [],
    getElementById: (id) => dom.porId.get(id) || null,
    createElement: () => ({ setAttribute() {}, appendChild() {}, addEventListener() {} }),
    addEventListener: (t, f) => { (ouvDoc[t] = ouvDoc[t] || []).push(f); },
    dispatchEvent() { return true; }
  };
  const loja = (mapa, registro) => ({
    getItem: (k) => (mapa.has(k) ? mapa.get(k) : null),
    setItem: (k, v) => { registro.push(k); mapa.set(k, String(v)); },
    removeItem: (k) => { registro.push('-' + k); mapa.delete(k); }
  });
  const sandbox = {
    document, CustomEvent, URL, console, location: { search: opcoes.search || '' },
    localStorage: loja(st, escritas), sessionStorage: loja(new Map(), escritasSessao),
    setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: (f) => f(),
    // serve os arquivos do repo (data/, partials/) como o GitHub Pages
    fetch: (u) => {
      buscas.push(u);
      const rel = u.replace(BASE, '').replace(/\?.*$/, '');
      const p = path.join(A.RAIZ, rel);
      if (!u.startsWith(BASE) || !fs.existsSync(p)) return Promise.resolve({ ok: false, status: 404 });
      const txt = fs.readFileSync(p, 'utf8');
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt) });
    },
    addEventListener() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC_FICHA, sandbox, { filename: 'ficha.js' });
  const depoisFicha = { escritas: escritas.slice(), sessao: escritasSessao.slice(), buscas: buscas.slice() };
  if (opcoes.semPagina !== true) vm.runInContext(SRC_PAGINA, sandbox, { filename: 'ficha-pagina.js' });
  return { win: sandbox, dom, escritas, escritasSessao, buscas, depoisFicha, ouvDoc };
}
const espera = () => new Promise((r) => setImmediate(r));
async function esperaCarregar(pg) { for (let i = 0; i < 20; i++) await espera(); return pg; }

test('navegador sem a prévia: aviso, nenhum fetch e nenhuma escrita além das do js/ficha.js', async () => {
  const pg = await esperaCarregar(pagina({ ls: { khalkaria_ficha: JSON.stringify(V2) } }));
  assert.equal(typeof pg.win.KhFichaPagina, 'object');
  const fp = pg.dom.porId.get('fp');
  assert.equal(fp.innerHTML, FP.htmlAviso());
  assert.equal(fp.getAttribute('data-fp'), 'aviso');
  assert.equal(pg.dom.porId.has('fp-abas'), false, 'sem casca');
  assert.deepEqual(pg.buscas, pg.depoisFicha.buscas, 'a página não pede nada');
  assert.ok(!pg.buscas.some((u) => /data\/catalogo|partials\/glifos/.test(u)), 'nenhum catálogo');
  assert.deepEqual(pg.escritas, pg.depoisFicha.escritas);
  assert.deepEqual(pg.escritasSessao, pg.depoisFicha.sessao);
});

test('navegador com a prévia (chave ou ?ficha=v3): casca, 5 abas desenhadas pelo motor, sprite, e nenhuma escrita de ficha', async () => {
  for (const op of [{ ls: { khalkaria_ficha_previa: '1' } }, { search: '?ficha=v3' }]) {
    op.ls = Object.assign({ khalkaria_ficha: JSON.stringify(v2Completa()) }, op.ls);
    const pg = pagina(op);
    const fp = pg.dom.porId.get('fp');
    assert.equal(fp.getAttribute('data-fp'), 'casca');
    assert.ok(fp.innerHTML.includes('role="tablist"'));
    FP.ABAS.forEach((a) => {
      assert.ok(pg.dom.porId.get('fp-aba-' + a.id), 'aba ' + a.id);
      assert.equal(pg.dom.porId.get('fp-painel-' + a.id).getAttribute('aria-busy'), 'true');
    });
    // busca exatamente os arquivos do motor (os da prévia), com a versão do ficha.js
    const novas = pg.buscas.filter((u) => !pg.depoisFicha.buscas.includes(u));
    assert.deepEqual(new Set(novas), new Set(P.arquivos().map((x) => BASE + x.caminho + '?v=abc123')));
    await esperaCarregar(pg);
    const topo = semTags(pg.dom.porId.get('fp-topo').innerHTML);
    assert.match(topo, /Lira Vento-Sul/);
    assert.match(topo, /Classe Batedor/);
    FP.ABAS.forEach((a) => {
      const p = pg.dom.porId.get('fp-painel-' + a.id);
      assert.equal(p.getAttribute('aria-busy'), null, a.id + ' sem aria-busy');
      assert.ok(p.innerHTML.startsWith('<div class="fp-corpo fp-corpo-' + a.id + '">'), a.id);
      assert.doesNotMatch(p.innerHTML, /em construção|falhou ao desenhar/);
    });
    // ícones pela raiz do site (a do js/ficha.js), em .webp
    assert.match(pg.dom.porId.get('fp-painel-nucleo').innerHTML, /src="http:\/\/site\.test\/images\/ficha\/forca\.webp"/);
    assert.match(pg.dom.porId.get('fp-painel-cartas').innerHTML, /data-rara/);
    assert.ok(!Object.values(FP.ABAS).some((a) => pg.dom.porId.get('fp-painel-' + a.id).innerHTML.includes(SEGREDO)));
    // o sprite g-* (moldura de raízes) entra na página
    assert.match(pg.dom.porId.get('fp-sprite').innerHTML, /<symbol id="g-moldura-raizes-canto"/);
    assert.deepEqual(pg.escritas, pg.depoisFicha.escritas, 'nenhuma escrita da página: ' + JSON.stringify(pg.escritas));
    assert.ok(!pg.escritas.some((k) => /ficha_v3|fichas_v3|dono|^khalkaria_ficha$/.test(k)), 'nenhuma chave de ficha');
    assert.deepEqual(pg.escritasSessao, pg.depoisFicha.sessao);
  }
});

test('navegador: clique e teclado trocam de aba (setas com volta, Home, End); o botão abre a ficha atual', () => {
  const pg = pagina({ ls: { khalkaria_ficha_previa: '1' } });
  const fp = pg.dom.porId.get('fp');
  const aba = (id) => pg.dom.porId.get('fp-aba-' + id);
  const painel = (id) => pg.dom.porId.get('fp-painel-' + id);
  const aberta = () => FP.ABAS.filter((a) => aba(a.id).getAttribute('aria-selected') === 'true').map((a) => a.id);
  function confere(id) {
    assert.deepEqual(aberta(), [id]);
    FP.ABAS.forEach((a) => {
      assert.equal(aba(a.id).getAttribute('tabindex'), a.id === id ? '0' : '-1');
      assert.equal(painel(a.id).hidden, a.id !== id, 'painel ' + a.id);
    });
  }
  confere('nucleo');
  fp.dispara({ type: 'click', target: aba('bazar') });
  confere('bazar');
  const tecla = (alvo, key, extra) => {
    const ev = Object.assign({ type: 'keydown', key, target: alvo, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } }, extra);
    pg.dom.porId.get('fp-abas').dispara(ev);
    return ev;
  };
  assert.ok(tecla(aba('bazar'), 'ArrowRight').defaultPrevented);
  confere('grimorio');
  assert.ok(aba('grimorio').focado, 'foco segue a aba');
  tecla(aba('grimorio'), 'ArrowRight');
  confere('nucleo');
  tecla(aba('nucleo'), 'ArrowLeft');
  confere('grimorio');
  tecla(aba('grimorio'), 'Home');
  confere('nucleo');
  tecla(aba('nucleo'), 'End');
  confere('grimorio');
  // Alt/Ctrl+seta ficam para a F4.5 (mover a aba): aqui não fazem nada
  assert.ok(!tecla(aba('grimorio'), 'ArrowLeft', { altKey: true }).defaultPrevented);
  assert.ok(!tecla(aba('grimorio'), 'a').defaultPrevented);
  confere('grimorio');

  let abriu = 0;
  pg.win.KF = { abrir: () => { abriu++; } };
  const botao = pg.dom.elemento('button', { type: 'button', class: 'kh-btn fp-abrir-v2' });
  fp.dispara({ type: 'click', target: botao });
  assert.equal(abriu, 1);
  confere('grimorio');
  assert.deepEqual(pg.escritas, pg.depoisFicha.escritas);
  assert.deepEqual(pg.escritasSessao, pg.depoisFicha.sessao);
});

test('navegador: fora da página da ficha (sem #fp) o script não faz nada', () => {
  const pg = pagina({ ls: { khalkaria_ficha_previa: '1' }, comPagina: false });
  assert.deepEqual(pg.buscas, pg.depoisFicha.buscas);
  assert.deepEqual(pg.escritas, pg.depoisFicha.escritas);
});

test('nav: item "Ficha" só na prévia (data-so-previa), glifo nv-ficha no traço do sprite, regra no componentes.css', () => {
  const nav = ler('partials', 'sidebar.html');
  const item = /<a href="pages\/ficha\.html" class="nav-link" data-so-previa><svg class="nav-ico" aria-hidden="true"><use href="#nv-ficha"><\/use><\/svg><span class="nav-rot">Ficha<\/span><\/a>/;
  assert.match(nav, item);
  // perto da Criação de Personagem
  const sec = nav.split('<div class="nav-section').find((s) => s.includes('Criação de Personagem'));
  assert.match(sec, item);
  const sym = /<symbol id="nv-ficha" viewBox="0 0 24 24">([\s\S]*?)<\/symbol>/.exec(nav);
  assert.ok(sym, 'símbolo nv-ficha');
  assert.match(sym[1], /stroke="currentColor" stroke-width="1\.3"/);
  assert.match(sym[1], /stroke-width="\.9"[^>]*opacity="\.65"/);
  assert.doesNotMatch(sym[1], /fill="(?!none)/, 'só traço');
  // só o item da ficha é marcado
  assert.equal((nav.match(/data-so-previa/g) || []).length, 1);
  const css = ler('css', 'componentes.css');
  assert.match(css, /html:not\(\[data-ficha-previa\]\) \[data-so-previa\] \{ display: none; \}/);
  // a regra fica na camada componentes (vence o .nav-link da camada layout)
  const antes = css.slice(0, css.indexOf('[data-so-previa] {'));
  assert.ok(antes.lastIndexOf('@layer componentes {') > -1);
  assert.equal(antes.lastIndexOf('@layer componentes {'), antes.indexOf('@layer componentes {'));
});
