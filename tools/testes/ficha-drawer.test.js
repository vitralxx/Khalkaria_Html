'use strict';
// Drawer docked da ficha nova (F4.4b, js/ficha/kh-ficha-drawer.js; especificação
// docs/ficha-digital/06-f4-drawer.md). Cobre:
//   - as puras (estado, dock, leitura do arrasto, fração, casca, barras);
//   - no navegador (vm com as fontes do ORDEM, menos a ficha-v2.js, que entra
//     como uma KF falsa com espiões; o kh-ui.js de verdade, para o Esc), sobre
//     o DOM mínimo do dom-mini.js:
//       sem a prévia NADA muda (nenhum elemento, fetch, ouvinte, escrita, marca);
//       com a prévia: a casca, o CSS pedido, o trilho, abrir e recolher (só a
//       khalkaria_ficha3_dock é gravada), a ordem das abas da página, o desenho
//       do KhFichaAbas compacto, as mini barras com a conta, arrastar (acende,
//       abre, item do Bazar -> KF.adicionar, o resto -> aviso), Esc, a página
//       da ficha sem drawer e o storage bloqueado; a nota à esquerda do mais
//       largo dos dois drawers; as tabelas largas (só com o drawer aberto, só a
//       tabela, reavaliadas no ResizeObserver e na troca da nav, nunca no Bazar);
//   - o CSS: toda regra do drawer guardada por html[data-ficha3], o Bazar e a
//     página da ficha nunca empurrados (avaliando os seletores), a aba FICHA e o
//     voltar ao topo deslocados só com a marca;
//   - o KhPrever do Bazar não abre embaixo do drawer (xPreferido com a borda).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const A = require('./estado-apoio.js');
const DOM = require('./dom-mini.js');
const FD = require('../../js/ficha/kh-ficha-drawer.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');
const KA = require('../../js/ficha/kh-abas.js');
const P = require('../../js/ficha/kh-previa.js');
const FP = require('../../js/ficha-pagina.js');
const { TOKENS, regra, resolveCor, contraste } = require('./cor-apoio.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const A4 = FA.ABAS.map((a) => a.id);
const BASE = 'http://site.test/';
function dados() { return Object.assign(A.dadosCatalogo(), { efeitos: EFEITOS, glifos: '', erros: [] }); }
function calculado(v2) { return P.calcular(A.soLeitura({ khalkaria_ficha: JSON.stringify(v2 || V2) }), dados(), ''); }

// ---------------------------------------------------------------- puras
test('puras: estado do dock, leitura do storage (bloqueado vale o trilho) e fração da barra', () => {
  assert.deepEqual(FD.ESTADOS, ['trilho', 'aberto']);
  assert.equal(FD.PADRAO, 'trilho');
  assert.equal(FD.CHAVE_DOCK, 'khalkaria_ficha3_dock');
  ['aberto'].forEach((v) => assert.equal(FD.estado(v), 'aberto'));
  [null, undefined, '', 'trilho', 'ABERTO', 'true', 1].forEach((v) => assert.equal(FD.estado(v), 'trilho', String(v)));
  const ls = (v) => ({ getItem: (k) => (k === 'khalkaria_ficha3_dock' ? v : null) });
  assert.equal(FD.lerDock(ls('aberto')), 'aberto');
  assert.equal(FD.lerDock(ls('trilho')), 'trilho');
  assert.equal(FD.lerDock(ls(null)), 'trilho');
  assert.equal(FD.lerDock({ getItem() { throw new Error('bloqueado'); } }), 'trilho');
  assert.equal(FD.lerDock(null), 'trilho');
  assert.equal(FD.fracao(18, 22), 18 / 22);
  assert.equal(FD.fracao(30, 22), 1);
  assert.equal(FD.fracao(-2, 22), 0);
  assert.equal(FD.fracao(0, 0), 0, 'sem máximo: vazia');
  assert.equal(FD.fracao(null, 10), 0);
});

test('puras: o arrasto da v2.1 e do Bazar (text/plain): item do Bazar, outra entidade ou nada', () => {
  const it = { id: 'item-corda', nome: 'Corda' };
  assert.deepEqual(FD.leArrasto(JSON.stringify({ _bazar: true, item: it })), { tipo: 'bazar', item: it });
  assert.deepEqual(FD.leArrasto(JSON.stringify({ _campo: 'grimorio', id: 'magia-x', tipo: 'magia', nome: 'X' })), { tipo: 'outro' });
  assert.deepEqual(FD.leArrasto(JSON.stringify({ _bazar: true })), { tipo: 'outro' }, 'sem item: não é do Bazar');
  assert.deepEqual(FD.leArrasto(JSON.stringify({ _bazar: true, item: {} })), { tipo: 'outro' });
  assert.equal(FD.leArrasto('não é json'), null);
  assert.equal(FD.leArrasto(''), null);
  assert.equal(FD.leArrasto('[1]'), null);
});

test('casca: trilho, cabeçalho com os 3 botões, as 5 abas na ordem dada (a da página) e um painel por aba', () => {
  const ordem = ['grimorio', 'nucleo', 'tecnicas', 'cartas', 'bazar'];
  const doc = DOM.documento();
  const raiz = doc.createElement('aside');
  raiz.innerHTML = FD.htmlCasca({ ordem, aberta: 'tecnicas', base: BASE });
  const abas = raiz.querySelectorAll('[role="tab"]');
  assert.deepEqual(abas.map((t) => t.getAttribute('data-aba')), ordem, 'a ordem guardada');
  // o nome inteiro (o da página) no aria-label; à vista, a primeira palavra dele (cabe numa linha em 380 px)
  assert.deepEqual(abas.map((t) => t.getAttribute('aria-label')), ordem.map((id) => FA.ABAS.find((a) => a.id === id).rotulo), 'os rótulos da página');
  assert.deepEqual(abas.map((t) => t.querySelector('.fd-gaveta-aba-rot').textContent), ['Grimório', 'Núcleo', 'Técnicas', 'Cartas', 'Bazar']);
  abas.forEach((t) => assert.ok(t.getAttribute('aria-label').includes(t.querySelector('.fd-gaveta-aba-rot').textContent), 'o nome acessível contém o que se vê'));
  assert.deepEqual(abas.map((t) => t.querySelector('.fd-gaveta-aba-pag').textContent), ordem.map((id) => String(FA.ABAS.find((a) => a.id === id).pag)));
  abas.forEach((t) => {
    const id = t.getAttribute('data-aba'), on = id === 'tecnicas';
    assert.equal(t.getAttribute('aria-selected'), String(on));
    assert.equal(t.getAttribute('tabindex'), on ? '0' : '-1');
    const p = raiz.querySelector('#' + t.getAttribute('aria-controls'));
    assert.ok(p, 'painel de ' + id);
    assert.equal(p.getAttribute('role'), 'tabpanel');
    assert.equal(p.getAttribute('aria-labelledby'), t.id);
    assert.equal(p.hidden, !on);
  });
  // a mesma ordem que a página desenha com a mesma preferência
  const pag = DOM.documento().createElement('div');
  pag.innerHTML = FP.htmlCasca('tecnicas', ordem);
  assert.deepEqual(pag.querySelectorAll('[role="tab"]').map((t) => t.getAttribute('data-aba')), ordem);
  // "Ordem do A4" só fora da ordem do A4
  assert.equal(raiz.querySelector('#fd-gaveta-a4').hidden, false);
  const padrao = doc.createElement('aside');
  padrao.innerHTML = FD.htmlCasca({ ordem: A4 });
  assert.equal(padrao.querySelector('#fd-gaveta-a4').hidden, true);
  assert.equal(padrao.querySelector('[aria-selected="true"]').getAttribute('data-aba'), 'nucleo', 'sem aberta: a 1ª');
  // cabeçalho: página da ficha, editar na ficha atual, recolher (Esc); e o trilho
  assert.equal(raiz.querySelector('.fd-gaveta-pagina').getAttribute('href'), BASE + 'pages/ficha.html');
  assert.equal(raiz.querySelector('.fd-gaveta-editar').getAttribute('aria-label'), 'Editar na ficha atual');
  const rec = raiz.querySelector('.fd-gaveta-recolher');
  assert.equal(rec.getAttribute('aria-keyshortcuts'), 'Escape');
  assert.equal(rec.getAttribute('aria-controls'), 'fd-gaveta-folha');
  assert.equal(raiz.querySelector('.fd-gaveta-abrir').getAttribute('aria-controls'), 'fd-gaveta-folha');
  assert.equal(raiz.querySelectorAll('.fd-gaveta-mini').length, 3);
  assert.ok(raiz.querySelector('#fd-gaveta-folha'));
  assert.ok(raiz.querySelector('#fd-gaveta-aviso[role="status"]').hidden, 'aviso escondido');
  // sem emoji como ícone: só SVG de traço
  assert.doesNotMatch(FD.htmlCasca({}), /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u);
});

test('mini barras: vazias antes dos dados; depois, atual sobre máximo nas 3 cores, com a conta do máximo', () => {
  const doc = DOM.documento();
  const vazia = doc.createElement('div');
  vazia.innerHTML = FD.htmlMinis(null);
  const ms = vazia.querySelectorAll('.fd-gaveta-mini');
  assert.deepEqual(ms.map((m) => m.getAttribute('data-recurso')), ['saude', 'stamina', 'eter']);
  ms.forEach((m) => {
    assert.ok(m.hasAttribute('data-vazia'));
    assert.equal(m.querySelector('.fd-gaveta-mini-fill').getAttribute('style'), 'height: 0%');
    assert.equal(m.querySelector('.kh-conta'), null, 'sem conta antes dos dados');
  });
  const res = calculado();
  assert.equal(res.estado, 'ok');
  const cheia = doc.createElement('div');
  cheia.innerHTML = FD.htmlMinis(res);
  ['saude', 'stamina', 'eter'].forEach((r, i) => {
    const m = cheia.querySelectorAll('.fd-gaveta-mini')[i];
    const no = res.av.nos['recurso.' + r + '.max'], atual = res.ficha.recursos[r].atual;
    const conta = m.querySelector('.kh-conta');
    assert.ok(conta, r + ' com a conta');
    assert.equal(conta.getAttribute('data-caminho'), 'recurso.' + r + '.max');
    assert.equal(conta.getAttribute('tabindex'), '0');
    const dica = m.querySelector('#' + conta.getAttribute('aria-describedby'));
    assert.ok(dica && dica.getAttribute('role') === 'tooltip', r + ': a dica da fórmula');
    assert.match(dica.textContent, /=/, 'a fórmula');
    assert.match(conta.querySelector('.fd-tr-v').textContent, new RegExp('^' + ['Saúde', 'Stamina', 'Éter'][i] + ' '));
    const pc = Math.round(FD.fracao(atual, no.valor) * 1000) / 10;
    assert.equal(m.querySelector('.fd-gaveta-mini-fill').getAttribute('style'), 'height: ' + pc + '%');
    assert.equal(m.querySelector('use').getAttribute('href'), '#g-' + r);
  });
  // ids próprios do trilho (fd-tr-d-N): nunca colidem com os das abas (fd-d-N)
  assert.ok(cheia.querySelectorAll('[aria-describedby]').every((x) => /^fd-tr-d-\d+$/.test(x.getAttribute('aria-describedby'))));
});

// ---------------------------------------------------------------- navegador
const ORDEM = ler('js', 'ficha', 'ORDEM').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const FONTES = ORDEM.filter((n) => n !== 'ficha-v2.js').map((n) => [n, ler('js', 'ficha', n)]);
const SRC_UI = ler('js', 'kh-ui.js');

// opc: {ls (objeto inicial), lsBloqueado, search, body (atributos), comFp, readyState, kfAberta,
//       kfDrawer (o #kf-drawer fechado, com offsetWidth), semKF (sem a ficha atual),
//       ensaio (a marca do Ensaio no sessionStorage: o KhEnsaio de verdade o dá por ligado com a prévia)}
function janela(opc) {
  opc = opc || {};
  const doc = DOM.documento({ body: opc.body, readyState: opc.readyState });
  const script = doc.createElement('script');
  script.setAttribute('src', BASE + 'js/ficha.js?v=abc123');
  doc.head.appendChild(script);
  if (opc.comFp) { const fp = doc.createElement('div'); fp.id = 'fp'; doc.body.appendChild(fp); }
  if (opc.kfAberta) { const kf = doc.createElement('div'); kf.id = 'kf-drawer'; kf.className = 'kf-drawer kf-open'; doc.body.appendChild(kf); }
  if (opc.kfDrawer) { const kf = doc.createElement('div'); kf.id = 'kf-drawer'; kf.offsetWidth = opc.kfDrawer; doc.body.appendChild(kf); }
  if (opc.mc != null) { const m = doc.createElement('main'); m.className = 'main-content'; m.innerHTML = opc.mc; doc.body.appendChild(m); }
  doc.criados.length = 0;
  const ls = A.armazenamento(opc.ls || {});
  const ss = A.armazenamento(Object.assign({}, opc.ss, opc.ensaio ? { khalkaria_ensaio_ligado: '1' } : {}));
  const buscas = [], timers = [], ouvWin = {}, adicionados = [], abertos = [];
  const sb = {
    document: doc, URL, console, location: { search: opc.search || '', pathname: '/pages/sistema.html', hash: opc.hash || '',
      replace(u) { sb.foi = u; }, reload() { sb.recarregou = (sb.recarregou || 0) + 1; } },
    sessionStorage: ss,
    setTimeout: (f) => { timers.push(f); return timers.length; }, clearTimeout() {},
    requestAnimationFrame: (f) => f(),
    fetch: (u) => {
      buscas.push(u);
      const rel = u.replace(BASE, '').replace(/\?.*$/, '');
      const p = path.join(A.RAIZ, rel);
      if (!u.startsWith(BASE) || !fs.existsSync(p)) return Promise.resolve({ ok: false, status: 404 });
      const txt = fs.readFileSync(p, 'utf8');
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt) });
    },
    addEventListener: (t, f) => { (ouvWin[t] = ouvWin[t] || []).push(f); },
    removeEventListener() {},
    // a ficha atual (v2.1) falsa: só o que o drawer chama (abertos: os argumentos de cada KF.abrir)
    KF: opc.semKF ? undefined : Object.freeze({ versao: '2', adicionar: (it) => { adicionados.push(it); return opc.kfFalha ? null : 'u' + adicionados.length; },
      abrir: (...a) => { abertos.push(a); } })
  };
  // observadores falsos (opc.observadores): cada um guarda {tipo, alvo, op, f}; o
  // getComputedStyle lê el.cs (o padrão: overflow visible, sem padding)
  const obs = [];
  if (opc.observadores) {
    const falso = (tipo) => function (f) { this.observe = (alvo, op) => { obs.push({ tipo, alvo, op, f }); }; this.disconnect = () => {}; };
    sb.ResizeObserver = falso('resize');
    sb.MutationObserver = falso('mutation');
    sb.getComputedStyle = (el) => Object.assign({ overflowX: 'visible', overflowY: 'visible', paddingRight: '0px' }, el.cs || {});
  }
  Object.defineProperty(sb, 'localStorage', { get() { if (opc.lsBloqueado) throw new Error('SecurityError'); return ls; } });
  sb.window = sb;
  vm.createContext(sb);
  vm.runInContext(SRC_UI, sb, { filename: 'kh-ui.js' });
  // o que já existia antes das fontes da ficha (o kh-ui liga o keydown do KhTeclas)
  const antes = { doc: Object.fromEntries(Object.entries(doc.ouv).map(([k, v]) => [k, v.length])), win: Object.keys(ouvWin).length };
  FONTES.forEach(([n, src]) => vm.runInContext(src, sb, { filename: n }));
  const html = doc.documentElement;
  const el = (id) => doc.getElementById(id);
  const gav = () => el('fd-gaveta');
  const roda = () => { while (timers.length) timers.shift()(); };
  const tecla = (alvo, key, extra) => DOM.despacha(doc, alvo || doc.body, DOM.evento('keydown', Object.assign({ key }, extra)));
  const clica = (x) => DOM.despacha(doc, x, DOM.evento('click'));
  const arrasto = (alvo, tipo, payload) => DOM.despacha(doc, alvo, DOM.evento(tipo, { dataTransfer: {
    dropEffect: '', getData: (t) => (t === 'text/plain' && payload != null ? JSON.stringify(payload) : ''), setData() {} } }));
  return { sb, doc, html, ls, ss, buscas, timers, ouvWin, antes, adicionados, abertos, el, gav, roda, tecla, clica, arrasto, obs,
    api: () => sb.KhFichaDrawer.atual() };
}
const espera = () => new Promise((r) => setImmediate(r));
async function carrega(j) {
  for (let i = 0; i < 30; i++) await espera();
  const link = j.doc.querySelector('link[data-fd-gaveta]');
  if (link) DOM.despacha(j.doc, link, DOM.evento('load'));
  return j;
}
const comFicha = (extra) => Object.assign({ khalkaria_ficha_previa: '1', khalkaria_ficha: JSON.stringify(V2) }, extra);

test('sem a prévia: nada muda (nenhum elemento, CSS, fetch, ouvinte, escrita nem marca no <html>)', async () => {
  for (const op of [{}, { ls: { khalkaria_ficha3_dock: 'aberto', khalkaria_ficha: JSON.stringify(V2) } }, { search: '?ficha=v2' },
    { ls: { khalkaria_ficha_previa: '0' } }, { readyState: 'loading' }, { lsBloqueado: true },
    { ls: { khalkaria_ficha3_dock: 'aberto' }, mc: '<table id="t"></table>', observadores: true }]) {
    const j = await carrega(janela(op));
    // nenhum observador do drawer (o kh-ui tem o dele, no body, do aria-activedescendant)
    assert.deepEqual(j.obs.filter((o) => o.tipo === 'resize' || /data-nav/.test(JSON.stringify(o.op))), [], 'nenhum observador');
    if (op.mc) assert.equal(j.el('t').hasAttribute(FD.MARCA_LARGA), false, 'nenhuma marca');
    assert.equal(typeof j.sb.KhFichaDrawer, 'object');
    assert.equal(j.gav(), null, 'nenhum drawer');
    assert.deepEqual(j.doc.criados, [], 'nenhum elemento criado');
    assert.equal(j.doc.querySelector('link'), null, 'nenhum CSS pedido');
    assert.deepEqual(j.buscas, [], 'nenhum fetch');
    assert.deepEqual(j.ls.escritas, [], 'nenhuma escrita');
    assert.deepEqual(j.ss.escritas, []);
    assert.equal(j.html.getAttribute('data-ficha3'), null);
    const depois = Object.fromEntries(Object.entries(j.doc.ouv).map(([k, v]) => [k, v.length]));
    assert.deepEqual(depois, j.antes.doc, 'nenhum ouvinte novo no document');
    assert.equal(Object.keys(j.ouvWin).length, j.antes.win, 'nenhum ouvinte novo na janela');
    assert.equal(j.sb.KhFichaDrawer.borda(), null);
    assert.equal(j.sb.KhFichaDrawer.atual(), null);
  }
});

test('com a prévia: a casca entra no trilho, pede o CSS e os arquivos do motor, e desenha as abas compactas sem gravar nada', async () => {
  const j = janela({ ls: comFicha() });
  const g = j.gav();
  assert.ok(g, 'drawer montado');
  assert.equal(g.parentNode, j.doc.body);
  assert.ok(g.hasAttribute('data-kf-ignorar'), 'a v2.1 não decora o que está dentro');
  assert.equal(g.hidden, true, 'escondido até o CSS chegar (a reserva do style.css segura o lugar)');
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho');
  const link = j.doc.querySelector('link[data-fd-gaveta]');
  assert.equal(link.getAttribute('href'), BASE + 'css/ficha-drawer.css?v=abc123');
  assert.equal(link.parentNode, j.doc.head);
  assert.deepEqual(new Set(j.buscas), new Set(P.arquivos().map((x) => BASE + x.caminho + '?v=abc123')), 'os arquivos da página, uma vez');
  assert.equal(j.buscas.length, P.arquivos().length);
  await carrega(j);
  assert.equal(g.hidden, false);
  // as 5 abas desenhadas pelo KhFichaAbas, prefixo fd, densidade compacta: o MESMO desenho da página
  const res = j.api().resultado();
  assert.equal(res.estado, 'ok');
  const esperado = FA.criar({ prefixo: 'fd', densidade: 'compacta' }).paineis(res, { dados: dados(), base: BASE }).paineis;
  A4.forEach((id) => {
    const p = j.el('fd-gaveta-p-' + id);
    assert.equal(p.getAttribute('aria-busy'), null);
    assert.equal(p._fdHtml, esperado[id], id);
    assert.ok(p._fdHtml.startsWith('<div class="fd-corpo fd-corpo-' + id + '" data-densidade="compacta">'), id);
  });
  assert.match(j.el('fd-gaveta-id').textContent, /Lira Vento-Sul/);
  assert.match(j.el('fd-gaveta-id').textContent, /Nível 2 · Humano · Batedor/);
  assert.equal(j.el('fd-gaveta-minis').querySelectorAll('.kh-conta').length, 3);
  assert.match(j.el('fd-gaveta-sprite').innerHTML, /<symbol id="g-saude"/, 'o sprite g-*');
  assert.deepEqual(j.ls.escritas, [], 'nenhuma escrita: ' + JSON.stringify(j.ls.escritas));
  assert.deepEqual(j.ss.escritas, []);
  assert.equal(j.sb.KhFichaDrawer.atual(), j.api());
});

test('com ?ficha=v3: lembra a prévia (a única escrita) e monta igual; no DOMContentLoaded quando a página ainda carrega', async () => {
  const j = janela({ search: '?ficha=v3', ls: { khalkaria_ficha: JSON.stringify(V2) } });
  assert.ok(j.gav());
  assert.deepEqual(j.ls.escritas, [['set', 'khalkaria_ficha_previa']]);
  const c = janela({ ls: comFicha(), readyState: 'loading' });
  assert.equal(c.gav(), null, 'ainda não');
  assert.equal(c.doc.ouv.DOMContentLoaded.length, 1);
  c.doc.ouv.DOMContentLoaded[0].f();
  assert.ok(c.gav(), 'montou no DOMContentLoaded');
});

test('trilho, abrir e recolher: só a khalkaria_ficha3_dock é gravada; o foco vai ao drawer e volta ao trilho', async () => {
  const j = await carrega(janela({ ls: comFicha() }));
  const abrir = j.gav().querySelector('.fd-gaveta-abrir'), recolher = j.gav().querySelector('.fd-gaveta-recolher');
  assert.equal(abrir.getAttribute('aria-expanded'), 'false');
  j.clica(abrir.querySelector('svg'));
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto');
  assert.equal(abrir.getAttribute('aria-expanded'), 'true');
  assert.equal(recolher.getAttribute('aria-expanded'), 'true');
  assert.deepEqual(j.ls.escritas, [['set', 'khalkaria_ficha3_dock']]);
  assert.equal(j.ls.getItem('khalkaria_ficha3_dock'), 'aberto');
  assert.equal(j.doc.activeElement, j.el('fd-gaveta-a-nucleo'), 'o foco na aba aberta');
  j.clica(recolher);
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho');
  assert.equal(j.ls.getItem('khalkaria_ficha3_dock'), 'trilho');
  assert.equal(j.doc.activeElement, abrir, 'o foco volta ao botão do trilho');
  assert.deepEqual(j.ls.escritas.map((x) => x[1]), ['khalkaria_ficha3_dock', 'khalkaria_ficha3_dock']);
  assert.deepEqual(j.ss.escritas, []);
  assert.equal(j.api().estado(), 'trilho');
  // o estado guardado vale na próxima página; "Editar na ficha atual" abre a v2.1
  const k = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }) }));
  assert.equal(k.html.getAttribute('data-ficha3'), 'aberto');
  assert.equal(k.gav().querySelector('.fd-gaveta-abrir').getAttribute('aria-expanded'), 'true');
  k.clica(k.gav().querySelector('.fd-gaveta-editar'));
  assert.equal(k.abertos.length, 1, 'KF.abrir()');
  assert.deepEqual(k.ls.escritas, []);
  // "Sair da prévia": apaga a chave e recarrega (sem ficha na URL: reload)
  k.clica(k.gav().querySelector('.fd-gaveta-sair'));
  assert.deepEqual(k.ls.escritas, [['remove', 'khalkaria_ficha_previa']]);
  assert.equal(k.sb.recarregou, 1);
  assert.equal(k.sb.foi, undefined);
});

test('saidaPrevia: tira só o parâmetro ficha; sem ele na URL, recarrega (um replace para a mesma URL com # não recarregaria)', () => {
  const s = (search, hash) => FD.saidaPrevia({ pathname: '/pages/condicoes.html', search, hash });
  assert.deepEqual(s('', '#caido'), { recarregar: true, url: '' }, 'o caso da revisão: #fragmento sem query');
  assert.deepEqual(s('', ''), { recarregar: true, url: '' });
  assert.deepEqual(s('?x=1', '#a'), { recarregar: true, url: '' }, 'os outros parâmetros ficam (reload)');
  assert.deepEqual(s('?ficha=v3', '#caido'), { recarregar: false, url: '/pages/condicoes.html#caido' });
  assert.deepEqual(s('?ficha=v3', ''), { recarregar: false, url: '/pages/condicoes.html' });
  assert.deepEqual(s('?x=1&ficha=v3&y=a%20b', '#t'), { recarregar: false, url: '/pages/condicoes.html?x=1&y=a%20b#t' }, 'sem reescrever o resto');
  assert.deepEqual(s('?ficha=v3&ficha=v2', ''), { recarregar: false, url: '/pages/condicoes.html' });
  assert.deepEqual(s('?fichas=1', ''), { recarregar: true, url: '' }, 'só o parâmetro ficha');
  assert.deepEqual(FD.saidaPrevia(null), { recarregar: true, url: '' });
});

test('"Sair da prévia" no navegador: com #fragmento recarrega de fato; com ?ficha=v3 troca a URL sem ele', async () => {
  const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }), hash: '#caido' }));
  j.clica(j.gav().querySelector('.fd-gaveta-sair'));
  assert.equal(j.ls.getItem('khalkaria_ficha_previa'), null);
  assert.equal(j.sb.recarregou, 1, 'reload: o replace para a mesma URL só rolaria até #caido');
  assert.equal(j.sb.foi, undefined);
  const k = await carrega(janela({ ls: { khalkaria_ficha: JSON.stringify(V2) }, search: '?x=1&ficha=v3', hash: '#caido' }));
  k.clica(k.gav().querySelector('.fd-gaveta-sair'));
  assert.deepEqual(k.ls.escritas, [['set', 'khalkaria_ficha_previa'], ['remove', 'khalkaria_ficha_previa']]);
  assert.equal(k.sb.foi, '/pages/sistema.html?x=1#caido');
  assert.equal(k.sb.recarregou, undefined);
});

test('abas: a ordem é a da página (khalkaria_ficha_abas), nos dois sentidos', async () => {
  const ordem = ['grimorio', 'nucleo', 'tecnicas', 'cartas', 'bazar'];
  const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha_abas: JSON.stringify(ordem) }), ss: { khalkaria_ficha_aba: 'cartas' } }));
  const lista = () => j.el('fd-gaveta-abas').querySelectorAll('[role="tab"]').map((t) => t.getAttribute('data-aba'));
  assert.deepEqual(lista(), ordem);
  assert.equal(j.el('fd-gaveta-a-cartas').getAttribute('aria-selected'), 'true', 'a aba aberta na sessão');
  assert.equal(j.el('fd-gaveta-p-cartas').hidden, false);
  assert.equal(j.el('fd-gaveta-a4').hidden, false);
  // move no drawer: grava a mesma chave, que a página lê
  j.api().abas.mover('nucleo', -1);
  const nova = ['nucleo', 'grimorio', 'tecnicas', 'cartas', 'bazar'];
  assert.deepEqual(lista(), nova);
  assert.deepEqual(JSON.parse(j.ls.getItem('khalkaria_ficha_abas')), nova);
  assert.deepEqual(FP.ordemAbas(j.ls).map((a) => a.id), nova, 'a página abre na ordem nova');
  assert.deepEqual(KA.lerOrdem(j.ls, A4), nova);
  // a ordem do A4 apaga a preferência (vale para os dois)
  j.api().abas.restaurar();
  assert.deepEqual(lista(), A4);
  assert.equal(j.ls.getItem('khalkaria_ficha_abas'), null);
  assert.ok(j.ls.escritas.every((x) => x[1] === 'khalkaria_ficha_abas'), JSON.stringify(j.ls.escritas));
});

test('redesenho: kf:mudou (com debounce) troca só o que mudou e mantém a rolagem', async () => {
  const j = await carrega(janela({ ls: comFicha() }));
  const rol = j.el('fd-gaveta-rolagem');
  rol.scrollTop = 240;
  const antes = j.el('fd-gaveta-p-bazar')._fdHtml;
  const v2 = JSON.parse(JSON.stringify(V2));
  v2.inventario.bugigangas.push({ uid: 'uNovo', id: null, nome: 'Corda de Teste', categoria: 'Bugiganga', raridade: 'Ordinário', efeito: '', qtd: 1,
    empilhavel: false, equipado: false, sintonizado: false, avulso: true, orfao: false });
  j.ls.m.set('khalkaria_ficha', JSON.stringify(v2));
  j.doc.ouv['kf:mudou'].forEach((o) => o.f({ type: 'kf:mudou' }));
  assert.equal(j.el('fd-gaveta-p-bazar')._fdHtml, antes, 'ainda não: debounce');
  j.roda();
  assert.notEqual(j.el('fd-gaveta-p-bazar')._fdHtml, antes);
  assert.match(j.el('fd-gaveta-p-bazar')._fdHtml, /Corda de Teste/);
  assert.equal(rol.scrollTop, 240, 'a rolagem fica');
  // o storage de outra aba também redesenha (só o da ficha)
  const n = j.timers.length;
  j.ouvWin.storage.forEach((f) => f({ key: 'khalkaria_recent' }));
  assert.equal(j.timers.length, n);
  j.ouvWin.storage.forEach((f) => f({ key: 'khalkaria_ficha' }));
  assert.equal(j.timers.length, n + 1);
  assert.deepEqual(j.ls.escritas, []);
});

test('arrastar: o card acende o trilho, o dragenter abre (sem gravar), o item do Bazar vai ao KF.adicionar', async () => {
  const j = await carrega(janela({ ls: comFicha() }));
  const card = j.doc.createElement('div');
  card.className = 'item-card';
  card.setAttribute('data-kf-tipo', 'item');
  j.doc.body.appendChild(card);
  const it = { id: 'item-corda', nome: 'Corda' };
  j.arrasto(card, 'dragstart', { _bazar: true, item: it });
  assert.ok(j.gav().hasAttribute('data-acende'), 'acende');
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho', 'acender não abre');
  j.arrasto(j.gav().querySelector('.fd-gaveta-minis'), 'dragenter', null);
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto', 'abre ao entrar');
  assert.deepEqual(j.ls.escritas, [], 'abrir pelo arrasto não grava a preferência');
  const sobre = j.arrasto(j.el('fd-gaveta-rolagem'), 'dragover', null);
  assert.equal(sobre.defaultPrevented, true, 'aceita o item do Bazar');
  assert.equal(sobre.dataTransfer.dropEffect, 'copy');
  assert.ok(j.gav().hasAttribute('data-alvo'));
  const solta = j.arrasto(j.el('fd-gaveta-rolagem'), 'drop', { _bazar: true, item: it });
  assert.equal(solta.defaultPrevented, true);
  assert.deepEqual(JSON.parse(JSON.stringify(j.adicionados)), [it], 'KF.adicionar(item): o inventário da ficha atual');
  assert.equal(j.gav().hasAttribute('data-acende'), false);
  assert.equal(j.gav().hasAttribute('data-alvo'), false);
  const aviso = j.el('fd-gaveta-aviso');
  assert.equal(aviso.hidden, false);
  assert.equal(aviso.textContent, '+ Corda no inventário da ficha atual.');
  assert.equal(j.el('fd-gaveta-a-bazar').getAttribute('aria-selected'), 'true', 'mostra a aba O Bazar');
  // a falha do KF (ficha atual só leitura) é dita
  const f = await carrega(janela({ ls: comFicha(), kfFalha: true }));
  f.doc.body.appendChild(card);
  f.arrasto(card, 'dragstart', { _bazar: true, item: it });
  f.arrasto(f.gav(), 'drop', { _bazar: true, item: it });
  assert.equal(f.el('fd-gaveta-aviso').textContent, 'Não deu para guardar Corda na ficha atual.');
});

// os cards das páginas de regras, como o build e a v2.1 os deixam
function cardDe(doc, tag, classe, attrs) {
  const c = doc.createElement(tag);
  c.className = classe;
  Object.entries(attrs || {}).forEach(([k, v]) => c.setAttribute(k, v));
  doc.body.appendChild(c);
  const filho = doc.createElement('h4');   // o arrasto começa num filho do card
  c.appendChild(filho);
  return { card: c, filho };
}

test('puras (07 §0, item 1): leCarta descobre o tipo pelo card de origem e a seção da ficha atual', () => {
  const doc = DOM.documento();
  const de = (tag, classe, attrs) => cardDe(doc, tag, classe, attrs).filho;
  const it = { id: 'item-corda', nome: 'Corda' };
  // item do Bazar: pela classe, mesmo sem o text/plain legível
  assert.deepEqual(FD.leCarta(de('div', 'item-card kf-draggable', { 'data-kf-tipo': 'item' }), ''), { tipo: 'bazar', item: null });
  assert.deepEqual(FD.leCarta(de('div', 'item-card', {}), JSON.stringify({ _bazar: true, item: it })), { tipo: 'bazar', item: it });
  assert.equal(FD.leCarta(de('li', 'bz-linha', { 'data-kf-tipo': 'item' }), '').tipo, 'bazar');
  const rec = doc.createElement('aside');
  rec.id = 'bz-receita';
  rec.innerHTML = '<div><span data-ir="item-x">x</span></div>';
  doc.body.appendChild(rec);
  assert.equal(FD.leCarta(rec.querySelector('[data-ir]'), '').tipo, 'bazar', 'o painel de receita');
  // outra entidade: o _campo da v2.1 manda; sem ele, o tipo do build; sem os dois, técnicas (o resto do MAPA)
  const sec = (el, txt) => FD.leCarta(el, txt == null ? '' : JSON.stringify(txt));
  assert.deepEqual(sec(de('div', 'spell-card kf-draggable', { 'data-kf-tipo': 'magia' }), { _campo: 'grimorio', tipo: 'magia', nome: 'X' }),
    { tipo: 'outro', secao: 'grimorio', kfTipo: 'magia' });
  assert.equal(sec(de('div', 'spell-card kf-draggable', { 'data-kf-tipo': 'magia' })).secao, 'grimorio', 'sem o text/plain: pelo card');
  assert.equal(sec(de('div', 'catalog-card kf-draggable', { 'data-kf-tipo': 'carta' }), { _campo: 'cartasLimiar' }).secao, 'cartas');
  assert.equal(sec(de('div', 'dor-card kf-draggable', { 'data-kf-tipo': 'dor' })).secao, 'cartas');
  assert.equal(sec(de('div', 'beneficio-abismo-card kf-draggable', { 'data-kf-tipo': 'beneficio' })).secao, 'cartas');
  assert.equal(sec(de('div', 'origem-card kf-draggable', { 'data-kf-tipo': 'origem' })).secao, 'tecnicas', 'a v2.1 leva a origem às técnicas');
  assert.equal(sec(de('div', 'tier-technique kf-draggable', {}), { _campo: 'tecnicas', tipo: 'tecnica' }).secao, 'tecnicas');
  assert.equal(sec(de('tr', 'kf-draggable', {})).secao, 'tecnicas', 'corrupção (linha da tabela)');
  // sem zona de soltar na ficha atual
  assert.deepEqual(sec(de('a', 'raca-card', { 'data-kf-tipo': 'raca' })), { tipo: 'outro', secao: null, kfTipo: 'raca' });
  assert.equal(sec(de('div', 'condicao-card', { 'data-kf-tipo': 'condicao' })).secao, null);
  // os textos
  assert.equal(FD.avisoAbriu('tecnicas'), 'A ficha atual abriu: solte a técnica nela.', 'o texto da especificação');
  assert.equal(FD.avisoAbriu('grimorio'), 'A ficha atual abriu: solte a magia nela.');
  assert.equal(FD.avisoAbriu('cartas'), 'A ficha atual abriu: solte a carta nela.');
  assert.equal(FD.avisoRecusa({ secao: null, kfTipo: 'raca' }, true), 'A ficha atual não recebe a raça por arrasto: preencha à mão, na ficha atual (FICHA).');
  assert.equal(FD.avisoRecusa({ secao: 'grimorio' }, false), 'A ficha atual não carregou nesta página: recarregue para levar a magia.');
  // o KF.abrir falhou: abrir pelo botão e arrastar de novo (o botão não aceita soltar)
  assert.equal(FD.avisoRecusa({ secao: 'tecnicas' }, true), 'A ficha atual não abriu: abra pelo botão FICHA e arraste a técnica de novo.');
  // com o Ensaio ligado (F4.6c): soltar leva para a ficha do ensaio (aceita); nunca à ficha atual
  assert.equal(FD.avisoEnsaio({ tipo: 'outro', secao: 'tecnicas' }, true), 'Solte para levar a técnica à ficha do ensaio (a sua ficha não muda).');
  assert.equal(FD.avisoEnsaio({ tipo: 'outro', secao: 'tecnicas' }),
    'Ensaio: a técnica não vai para a ficha do ensaio por arrasto. Nada foi guardado, nem na sua ficha.');
  assert.match(FD.avisoEnsaio({ tipo: 'outro', secao: 'grimorio' }, true), /^Solte para levar a magia /);
  assert.match(FD.avisoEnsaio({ tipo: 'outro', secao: null, kfTipo: 'raca' }, true), /^Solte para levar a raça /);
  assert.match(FD.avisoEnsaio({ tipo: 'outro', secao: null, kfTipo: 'condicao', ref: { tipo: 'condicao', id: 'morrendo', nome: 'Morrendo \u{1F480}' } }, true),
    /^Solte para levar Morrendo à ficha do ensaio/, 'o nome do card marcado, sem emoji');
  assert.match(FD.avisoEnsaio({ tipo: 'outro', secao: null }), /^Ensaio: este card não vai /);
  assert.match(FD.avisoEnsaio({ tipo: 'bazar', item: { nome: 'Corda \u{1F525}' } }, true), /^Solte para levar Corda à ficha do ensaio/, 'o nome do item, sem emoji');
  assert.match(FD.avisoEnsaio({ tipo: 'bazar', item: null }, true), /^Solte para levar o item /, 'o item lido só no soltar');
  assert.match(FD.avisoEnsaio(null), /^Ensaio: este card não vai /);
  const todos = [FD.avisoAbriu('x'), FD.avisoRecusa({}, true), FD.avisoRecusa({ secao: 'cartas' }, true), FD.avisoEnsaio({ tipo: 'outro', secao: 'tecnicas' }),
    FD.avisoEnsaio({ tipo: 'outro', secao: 'tecnicas' }, true)];
  todos.forEach((t) => {
    assert.doesNotMatch(t, /solte na ficha atual \(botão FICHA\)|botão FICHA\) para levar/, 'nunca manda soltar no botão FICHA');
    assert.doesNotMatch(t, /só leitura/, 'nem chama de só leitura');
  });
  assert.equal(FD.AVISO_SO_LEITURA, undefined, 'a frase da 06, corrigida na 07 §0, saiu');
});

test('arrastar técnica, magia ou carta (07 §0, item 1): o dragenter abre a FICHA ATUAL na seção, com a nota; o drawer novo não abre nem aceita', async () => {
  const casos = [
    ['div', 'spell-card kf-draggable', { 'data-kf-tipo': 'magia' }, { _campo: 'grimorio', id: 'magia-x', tipo: 'magia', nome: 'X' }, 'grimorio', 'a magia'],
    ['div', 'tier-technique kf-draggable', {}, { _campo: 'tecnicas', id: 'tecnica-y', tipo: 'tecnica', nome: 'Y' }, 'tecnicas', 'a técnica'],
    ['div', 'catalog-card kf-draggable', { 'data-kf-tipo': 'carta' }, { _campo: 'cartasLimiar', id: 'carta-z', tipo: 'carta', nome: 'Z' }, 'cartas', 'a carta'],
    // o card decide já no dragstart, mesmo sem o text/plain legível
    ['div', 'spell-card kf-draggable', { 'data-kf-tipo': 'magia' }, null, 'grimorio', 'a magia']
  ];
  for (const [tag, classe, attrs, payload, secao, nome] of casos) {
    for (const dock of ['trilho', 'aberto']) {
      const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: dock }), kfDrawer: 420 }));
      const { card, filho } = cardDe(j.doc, tag, classe, attrs);
      j.arrasto(filho, 'dragstart', payload);
      assert.ok(j.gav().hasAttribute('data-acende'), 'acende');
      j.arrasto(j.gav().querySelector('.fd-gaveta-minis'), 'dragenter', null);
      j.arrasto(j.gav(), 'dragenter', null);
      assert.deepEqual(j.abertos, [[secao]], classe + ': KF.abrir(' + secao + ') uma vez só');
      assert.equal(j.html.getAttribute('data-ficha3'), dock, 'o drawer novo fica como estava');
      const nota = j.el('fd-gaveta-nota');
      assert.equal(nota.hidden, false);
      assert.equal(nota.textContent, 'A ficha atual abriu: solte ' + nome + ' nela.');
      assert.equal(nota.style.getPropertyValue('--fd-nota-dir'), (420 + FD.VAO_NOTA) + 'px', 'à esquerda do drawer v2.1');
      assert.equal(j.el('fd-gaveta-aviso').hidden, true, 'o aviso de dentro da folha (coberta) não é usado');
      // sobre a faixa do drawer novo que sobrar à vista: não aceita, e não troca a nota
      const sobre = j.arrasto(j.el('fd-gaveta-rolagem'), 'dragover', null);
      assert.equal(sobre.defaultPrevented, false, 'não aceita: a carta vai para a ficha atual');
      assert.equal(j.el('fd-gaveta-aviso').hidden, true);
      const solta = j.arrasto(j.el('fd-gaveta-rolagem'), 'drop', payload);
      assert.equal(solta.defaultPrevented, false);
      assert.deepEqual(j.adicionados, []);
      // o fim do arrasto apaga o acender; a nota fica um tempo e some
      DOM.despacha(j.doc, card, DOM.evento('dragend'));
      assert.equal(j.gav().hasAttribute('data-acende'), false);
      assert.equal(nota.hidden, false);
      j.roda();
      assert.equal(nota.hidden, true, 'some depois');
      assert.deepEqual(j.ls.escritas, [], 'o drawer não grava nada (nem o dock)');
      assert.deepEqual(j.ss.escritas, []);
    }
  }
});

test('a nota fica à esquerda do MAIS LARGO dos dois drawers (revisão do §0: a 1800 px, 460 px deste contra 420 do v2.1)', async () => {
  assert.equal(FD.direitaNota([420, 460]), 460 + FD.VAO_NOTA, 'este mais largo: a faixa dele não fica sob a nota');
  assert.equal(FD.direitaNota([420, 380]), 420 + FD.VAO_NOTA);
  assert.equal(FD.direitaNota([420, 48]), 420 + FD.VAO_NOTA, 'no trilho');
  assert.equal(FD.direitaNota([419.6, 0]), 420 + FD.VAO_NOTA, 'arredonda');
  assert.equal(FD.direitaNota([353, 0]), 353 + FD.VAO_NOTA, 'o v2.1 estreito (max-width 92vw): a largura real');
  [[], [0, 0], [NaN, undefined, null], null].forEach((x) => assert.equal(FD.direitaNota(x), 0, 'sem largura: fica a do CSS'));
  for (const [larguraNova, esperado] of [[460, 472], [380, 432], [undefined, 432]]) {
    const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }), kfDrawer: 420 }));
    if (larguraNova) j.gav().offsetWidth = larguraNova;
    const { filho } = cardDe(j.doc, 'div', 'spell-card kf-draggable', { 'data-kf-tipo': 'magia' });
    j.arrasto(filho, 'dragstart', { _campo: 'grimorio', id: 'magia-x', tipo: 'magia', nome: 'X' });
    j.arrasto(j.gav(), 'dragenter', null);
    assert.equal(j.el('fd-gaveta-nota').style.getPropertyValue('--fd-nota-dir'), esperado + 'px', 'drawer novo com ' + larguraNova);
  }
});

// ---------------------------------------------------------------- tabelas largas (07 §0, item 3)
test('puras (07 §0, item 3): tabelaLarga — sem a marca, passa do limite; com ela, ainda rola ou ainda passa', () => {
  const L = FD.tabelaLarga;
  assert.equal(L({ marcada: false, direita: 720, limite: 650 }), true, 'passa da caixa');
  assert.equal(L({ marcada: false, direita: 650.8, limite: 650 }), false, 'subpixel não conta');
  assert.equal(L({ marcada: false, direita: 650, limite: 650 }), false, 'cabe (largura cheia)');
  assert.equal(L({ marcada: true, direita: 650, limite: 650, scrollWidth: 700, clientWidth: 600 }), true, 'marcada e ainda rola');
  assert.equal(L({ marcada: true, direita: 650, limite: 650, scrollWidth: 600, clientWidth: 600 }), false, 'voltou a caber (janela maior)');
  assert.equal(L({ marcada: true, direita: 720, limite: 650, scrollWidth: 600, clientWidth: 600 }), true, 'ainda passa: não pisca');
  assert.equal(L({ marcada: false, direita: 900, limite: 650 }), true, 'a do wrapper do Sistema também: rola ela mesma, a barra no pé dela');
  [null, undefined, 'x', []].forEach((x) => assert.equal(L(x), false));
});

// o conteúdo: um cartão com uma tabela larga e uma que cabe, um <li> com tabela,
// o wrapper que já rola (o do Sistema: a tabela dele rola ela mesma) e uma tabela oculta
const MC = '<div class="card" id="card"><h2>X</h2><table id="t-larga"></table><table id="t-cabe"></table>' +
  '<ul><li id="li"><table id="t-li"></table></li></ul></div>' +
  '<div id="wrap" style="overflow-x: auto;"><table id="t-wrap"></table></div><div id="oculto" hidden><table id="t-oculta"></table></div>';
// a geometria (px): o .main-content com 700 de cliente e 50 de padding à direita
// (a caixa de conteúdo acaba em 650), o resto acaba em 650 também
function geometria(j) {
  const g = (id, x) => Object.assign(j.el(id), x);
  const caixa = (left, cw) => ({ rect: { left, right: left + cw, top: 0, bottom: 10, width: cw, height: 10 }, clientWidth: cw, clientLeft: 0 });
  const tab = (dir, extra) => Object.assign({ rect: { left: 50, right: dir, top: 0, bottom: 10, width: dir - 50, height: 10 },
    getClientRects: () => [1], scrollWidth: dir - 50, clientWidth: dir - 50 }, extra);
  Object.assign(j.doc.querySelector('.main-content'), caixa(0, 700), { cs: { paddingRight: '50px' } });
  g('card', caixa(50, 600)); g('li', caixa(80, 570)); g('wrap', Object.assign(caixa(50, 600), { cs: { overflowX: 'auto' } }));
  g('t-larga', tab(720)); g('t-cabe', tab(650)); g('t-li', tab(700)); g('t-wrap', tab(900));
  g('t-oculta', { getClientRects: () => [], rect: null });
}
const marcadas = (j) => j.doc.querySelectorAll('[' + FD.MARCA_LARGA + ']').map((t) => t.id);

test('tabelas largas no navegador: com o drawer aberto só a mais larga que a caixa ganha a marca (o pai, o <li> e as que cabem ficam); recolher tira', async () => {
  const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }), mc: MC, observadores: true }));
  const mc = j.doc.querySelector('.main-content');
  // observa o .main-content (tamanho) e a nav (html[data-nav]); nada mais
  const meus = j.obs.filter((o) => o.alvo === mc || o.alvo === j.html);
  assert.deepEqual(meus.map((o) => o.tipo), ['resize', 'mutation']);
  assert.equal(JSON.stringify(meus[1].op), JSON.stringify({ attributes: true, attributeFilter: ['data-nav'] }));
  assert.deepEqual(marcadas(j), [], 'sem geometria (antes do layout): nada');
  geometria(j);
  // o ResizeObserver avisa: espera ESPERA_LARGAS e reavalia
  meus[0].f([]);
  assert.deepEqual(marcadas(j), [], 'ainda esperando');
  j.roda();
  assert.deepEqual(marcadas(j), ['t-larga', 't-li', 't-wrap']);
  ['card', 'li', 'wrap', 'oculto'].forEach((id) => assert.equal(j.el(id).hasAttribute(FD.MARCA_LARGA), false, id + ': o pai não muda'));
  assert.equal(j.api().largas(), 3);
  // marcada, a tabela vira caixa que rola (o CSS): cabe na caixa e ainda tem o que rolar
  Object.assign(j.el('t-larga'), { rect: { left: 50, right: 650, top: 0, bottom: 10, width: 600, height: 10 }, scrollWidth: 670, clientWidth: 600 });
  assert.equal(j.api().largas(), 3, 'continua marcada');
  // a janela cresce: voltou a caber
  Object.assign(j.el('t-larga'), { scrollWidth: 600 });
  meus[1].f([]);   // a nav trocou
  j.roda();
  assert.deepEqual(marcadas(j), ['t-li', 't-wrap']);
  // recolher tira na hora; abrir põe na hora (sem esperar o observador)
  j.clica(j.gav().querySelector('.fd-gaveta-recolher'));
  assert.deepEqual(marcadas(j), [], 'recolhido: nenhuma marca');
  meus[0].f([]); j.roda();
  assert.deepEqual(marcadas(j), [], 'no trilho o observador não marca');
  j.clica(j.gav().querySelector('.fd-gaveta-abrir'));
  assert.deepEqual(marcadas(j), ['t-li', 't-wrap']);
  // a oculta fica como está até aparecer
  Object.assign(j.el('t-oculta'), { getClientRects: () => [1], rect: { left: 50, right: 800, top: 0, bottom: 10, width: 750, height: 10 } });
  j.el('oculto').hidden = false;
  assert.deepEqual(marcadas(j), ['t-li', 't-wrap']);
  meus[0].f([]); j.roda();   // o .main-content cresceu: o observador reavalia
  assert.deepEqual(marcadas(j), ['t-li', 't-wrap', 't-oculta']);
  assert.deepEqual(j.ls.escritas.map((x) => x[1]), ['khalkaria_ficha3_dock', 'khalkaria_ficha3_dock'], 'só o dock (botões)');
});

test('tabelas largas: no trilho nada é marcado; no Bazar (o drawer fica por cima) nem há observador', async () => {
  const t = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'trilho' }), mc: MC, observadores: true }));
  geometria(t);
  t.obs.filter((o) => o.tipo === 'resize').forEach((o) => o.f([]));
  t.roda();
  assert.deepEqual(marcadas(t), []);
  t.clica(t.gav().querySelector('.fd-gaveta-abrir'));
  assert.deepEqual(marcadas(t), ['t-larga', 't-li', 't-wrap'], 'abrir marca na hora');
  const b = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }), mc: MC, observadores: true, body: { 'data-bazar': '' } }));
  geometria(b);
  assert.deepEqual(b.obs.filter((o) => o.tipo === 'resize' || /data-nav/.test(JSON.stringify(o.op))), []);
  assert.equal(b.api().largas(), 0);
  b.clica(b.gav().querySelector('.fd-gaveta-recolher'));
  b.clica(b.gav().querySelector('.fd-gaveta-abrir'));
  assert.deepEqual(marcadas(b), [], 'Bazar: nunca');
  // sem ResizeObserver nem getComputedStyle (navegador velho): abrir e recolher bastam, sem lançar
  const v = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'trilho' }), mc: MC }));
  geometria(v);
  v.clica(v.gav().querySelector('.fd-gaveta-abrir'));
  assert.deepEqual(marcadas(v), ['t-larga', 't-li', 't-wrap'], 'sem estilo computado (padding 0), as mesmas');
});

test('arrastar sem seção (raça) ou sem a ficha atual: o drawer abre, não aceita e explica; com o Ensaio, aceita (para a ficha do ensaio)', async () => {
  // raça: a ficha atual não tem zona de soltar para ela
  const r = await carrega(janela({ ls: comFicha() }));
  const raca = cardDe(r.doc, 'a', 'raca-card', { 'data-kf-tipo': 'raca' });
  r.arrasto(raca.filho, 'dragstart', null);
  r.arrasto(r.gav(), 'dragenter', null);
  assert.deepEqual(r.abertos, [], 'nada a abrir na ficha atual');
  assert.equal(r.html.getAttribute('data-ficha3'), 'aberto');
  assert.equal(r.arrasto(r.el('fd-gaveta-rolagem'), 'dragover', null).defaultPrevented, false);
  assert.ok(r.gav().hasAttribute('data-recusa'));
  assert.equal(r.el('fd-gaveta-aviso').textContent, 'A ficha atual não recebe a raça por arrasto: preencha à mão, na ficha atual (FICHA).');
  assert.equal(r.el('fd-gaveta-nota').hidden, true);
  // sair do drawer tira a marca de recusa
  DOM.despacha(r.doc, r.gav(), DOM.evento('dragleave', { relatedTarget: r.doc.body }));
  assert.equal(r.gav().hasAttribute('data-recusa'), false);
  // sem a ficha atual (a v2.1 não carregou)
  const s = await carrega(janela({ ls: comFicha(), semKF: true }));
  const mg = cardDe(s.doc, 'div', 'spell-card kf-draggable', { 'data-kf-tipo': 'magia' });
  s.arrasto(mg.filho, 'dragstart', { _campo: 'grimorio', id: 'magia-x' });
  s.arrasto(s.gav(), 'dragenter', null);
  assert.equal(s.html.getAttribute('data-ficha3'), 'aberto');
  s.arrasto(s.el('fd-gaveta-rolagem'), 'dragover', null);
  assert.equal(s.el('fd-gaveta-aviso').textContent, 'A ficha atual não carregou nesta página: recarregue para levar a magia.');
  // Ensaio ligado: sem o desvio (a entidade é da ficha do ensaio: o drawer aceita, F4.6c)
  const e = await carrega(janela({ ls: comFicha(), ensaio: true }));
  const tc = cardDe(e.doc, 'div', 'tier-technique kf-draggable', {});
  e.arrasto(tc.filho, 'dragstart', { _campo: 'tecnicas', id: 'tecnica-y' });
  e.arrasto(e.gav(), 'dragenter', null);
  assert.deepEqual(e.abertos, [], 'nenhum KF.abrir');
  assert.equal(e.html.getAttribute('data-ficha3'), 'aberto');
  assert.equal(e.arrasto(e.el('fd-gaveta-rolagem'), 'dragover', null).defaultPrevented, true, 'aceita: vai para a ficha do ensaio');
  assert.ok(e.gav().hasAttribute('data-alvo'));
  assert.equal(e.gav().hasAttribute('data-recusa'), false);
  assert.equal(e.el('fd-gaveta-aviso').textContent, FD.avisoEnsaio({ tipo: 'outro', secao: 'tecnicas' }, true), 'o que acontece, sem mandar ao botão FICHA');
  DOM.despacha(e.doc, e.doc.body, DOM.evento('dragend'));
  // Ensaio ligado e item do Bazar: aceita; nada vai à ficha atual (o levar é do KhLevar, levar.test.js)
  const it = { id: 'item-corda', nome: 'Corda' };
  const bz = cardDe(e.doc, 'div', 'item-card', { 'data-kf-tipo': 'item' });
  e.arrasto(bz.filho, 'dragstart', { _bazar: true, item: it });
  e.arrasto(e.gav(), 'dragenter', null);
  assert.deepEqual(e.abertos, []);
  const sobre = e.arrasto(e.el('fd-gaveta-rolagem'), 'dragover', null);
  assert.equal(sobre.defaultPrevented, true, 'aceita');
  assert.ok(e.gav().hasAttribute('data-alvo'));
  assert.equal(e.el('fd-gaveta-aviso').textContent, 'Solte para levar Corda à ficha do ensaio (a sua ficha não muda).');
  // o soltar não chama o KF.adicionar: o ensaio desta aba não tem ficha, e o aviso diz isso
  e.arrasto(e.el('fd-gaveta-rolagem'), 'drop', { _bazar: true, item: it });
  assert.deepEqual(e.adicionados, [], 'nenhum KF.adicionar');
  assert.equal(e.el('fd-gaveta-a-bazar').getAttribute('aria-selected'), 'false', 'nem vai à aba O Bazar');
  assert.match(e.el('fd-gaveta-aviso').textContent, /^Levando Corda para a ficha do ensaio/);
  assert.equal(e.gav().hasAttribute('data-acende'), false);
  await carrega(e);
  assert.equal(e.el('fd-gaveta-aviso').textContent, e.sb.KhLevar.SEM_FICHA);
  assert.deepEqual(e.ss.escritas, [], 'nada gravado, nem no ensaio');
  [r, s, e].forEach((j) => assert.deepEqual(j.ls.escritas, []));
  // o arrasto do próprio inventário do Bazar (mover um slot) não acende
  const j = await carrega(janela({ ls: comFicha() }));
  const inv = j.doc.createElement('aside');
  inv.id = 'bz-inventario';
  inv.innerHTML = '<li class="bz-slot" draggable="true" data-uid="u1">x</li>';
  j.doc.body.appendChild(inv);
  j.arrasto(inv.querySelector('li'), 'dragstart', null);
  assert.equal(j.gav().hasAttribute('data-acende'), false);
  assert.deepEqual(j.ls.escritas, []);
});

test('item do Bazar sem o text/plain no dragstart: o card decide (abre o drawer novo), e o soltar lê o item', async () => {
  const j = await carrega(janela({ ls: comFicha() }));
  const { filho } = cardDe(j.doc, 'div', 'item-card kf-draggable', { 'data-kf-tipo': 'item' });
  const it = { id: 'item-corda', nome: 'Corda' };
  j.arrasto(filho, 'dragstart', null);
  j.arrasto(j.gav(), 'dragenter', null);
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto', 'o item do Bazar abre o drawer novo');
  assert.deepEqual(j.abertos, [], 'e não a ficha atual');
  assert.equal(j.arrasto(j.el('fd-gaveta-rolagem'), 'dragover', null).defaultPrevented, true, 'aceita');
  j.arrasto(j.el('fd-gaveta-rolagem'), 'drop', { _bazar: true, item: it });
  assert.deepEqual(JSON.parse(JSON.stringify(j.adicionados)), [it]);
  // ilegível também no soltar: não chama o KF.adicionar com nada
  const k = await carrega(janela({ ls: comFicha() }));
  const c2 = cardDe(k.doc, 'div', 'item-card', {});
  k.arrasto(c2.filho, 'dragstart', null);
  k.arrasto(k.gav(), 'drop', null);
  assert.deepEqual(k.adicionados, []);
  assert.equal(k.el('fd-gaveta-aviso').textContent, 'Não deu para ler o item arrastado.');
});

test('Esc recolhe o drawer aberto (KhTeclas, depois das camadas do Bazar); com a ficha atual aberta por cima, não', async () => {
  const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }) }));
  const t = j.el('fd-gaveta-a-nucleo');
  t.focus();
  const ev = j.tecla(t, 'Escape');
  assert.equal(ev.defaultPrevented, true);
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho');
  assert.equal(j.ls.getItem('khalkaria_ficha3_dock'), 'trilho');
  assert.equal(j.doc.activeElement, j.gav().querySelector('.fd-gaveta-abrir'), 'o foco estava no drawer: vai ao trilho');
  assert.equal(j.tecla(null, 'Escape').defaultPrevented, false, 'no trilho, o Esc passa');
  const k = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }), kfAberta: true }));
  assert.equal(k.tecla(null, 'Escape').defaultPrevented, false);
  assert.equal(k.html.getAttribute('data-ficha3'), 'aberto');
  assert.deepEqual(k.ls.escritas, []);
});

test('Esc com o foco num campo de texto fora do drawer (a busca do Bazar): o Esc é do campo, o drawer não recolhe nem grava', async () => {
  const j = await carrega(janela({ ls: comFicha({ khalkaria_ficha3_dock: 'aberto' }), body: { 'data-bazar': '' } }));
  const busca = j.doc.createElement('input');
  busca.id = 'bz-search';
  busca.setAttribute('type', 'search');
  busca.value = 'espada';
  j.doc.body.appendChild(busca);
  busca.focus();
  const ev = j.tecla(busca, 'Escape');
  assert.equal(ev.defaultPrevented, false, 'sem preventDefault: o navegador limpa a busca');
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto', 'o drawer fica aberto');
  assert.deepEqual(j.ls.escritas, [], 'e o dock não é gravado');
  // vazia também (campo de texto: a tecla é dele), textarea e o foco em campo com o alvo no body
  busca.value = '';
  assert.equal(j.tecla(busca, 'Escape').defaultPrevented, false);
  const ta = j.doc.createElement('textarea');
  j.doc.body.appendChild(ta);
  ta.focus();
  assert.equal(j.tecla(null, 'Escape').defaultPrevented, false);
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto');
  assert.deepEqual(j.ls.escritas, []);
  // um checkbox não é campo de texto: o Esc recolhe
  const cb = j.doc.createElement('input');
  cb.setAttribute('type', 'checkbox');
  j.doc.body.appendChild(cb);
  cb.focus();
  assert.equal(j.tecla(cb, 'Escape').defaultPrevented, true);
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho');
  assert.deepEqual(j.ls.escritas, [['set', 'khalkaria_ficha3_dock']]);
});

test('página da ficha (#fp ou body[data-ficha-pagina]): nenhum drawer por cima, nada buscado', async () => {
  for (const op of [{ comFp: true }, { body: { 'data-ficha-pagina': '', 'data-no-rightbar': '' } }]) {
    const j = await carrega(janela(Object.assign({ ls: comFicha() }, op)));
    assert.equal(j.gav(), null);
    assert.equal(j.doc.querySelector('link'), null);
    assert.deepEqual(j.buscas, []);
    assert.deepEqual(j.ls.escritas, []);
    assert.equal(j.sb.KhFichaDrawer.borda(), null);
  }
});

test('storage bloqueado: com ?ficha=v3 monta no trilho e abre e recolhe sem lançar', async () => {
  const j = await carrega(janela({ search: '?ficha=v3', lsBloqueado: true }));
  assert.ok(j.gav());
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho');
  j.clica(j.gav().querySelector('.fd-gaveta-abrir'));
  assert.equal(j.html.getAttribute('data-ficha3'), 'aberto');
  j.clica(j.gav().querySelector('.fd-gaveta-recolher'));
  assert.equal(j.html.getAttribute('data-ficha3'), 'trilho');
  assert.match(j.el('fd-gaveta-id').textContent, /sem ficha/, 'sem storage não há ficha: o recado');
});

test('borda: a esquerda do drawer na janela (para o pop-up do Bazar), e o KhPrever do Bazar a respeita', async () => {
  const j = await carrega(janela({ ls: comFicha() }));
  j.gav().rect = { left: 1308, right: 1356, top: 0, bottom: 768, width: 48, height: 768 };
  assert.equal(j.sb.KhFichaDrawer.borda(), 1308);
  j.gav().hidden = true;
  assert.equal(j.sb.KhFichaDrawer.borda(), null, 'escondido: sem borda');
  // o xPreferido do bazar-cartao.js: sem espaço até a borda, o pop-up sai à esquerda do card
  const src = ler('js', 'bazar-cartao.js');
  const m = /xPreferido: (function \(alvo, W, VAO\) \{[\s\S]*?\n    \}),\n/.exec(src);
  assert.ok(m, 'o xPreferido do KhPrever no Bazar');
  const fn = (borda) => vm.runInNewContext('(' + m[1] + ')', { window: { KhFichaDrawer: { borda: () => borda } } });
  const card = (l, r) => ({ closest: () => null, getBoundingClientRect: () => ({ left: l, right: r }) });
  assert.equal(fn(null)(card(900, 1100), 340, 12), null, 'sem drawer: o lado de sempre');
  assert.equal(fn(1308)(card(500, 700), 340, 12), null, 'cabe à direita antes da borda');
  assert.equal(fn(1308)(card(900, 1100), 340, 12), 900 - 12 - 340, 'não cabe: à esquerda do card');
  assert.equal(fn(976)(card(500, 700), 340, 12), 500 - 12 - 340, 'drawer aberto por cima');
});

// ---------------------------------------------------------------- CSS
// as regras de um CSS com o contexto das at-rules (@layer, @media) por fora
function regras(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [], pilha = [];
  let ini = 0;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === '{') { pilha.push({ prelude: css.slice(ini, i).trim(), ini: i + 1, filhos: false }); ini = i + 1; }
    else if (c === '}') {
      const b = pilha.pop();
      if (pilha.length) pilha[pilha.length - 1].filhos = true;
      if (!b.prelude.startsWith('@') && !b.filhos) out.push({ sel: b.prelude, corpo: css.slice(b.ini, i).trim(), ctx: pilha.map((x) => x.prelude) });
      ini = i + 1;
    } else if (c === ';' && !pilha.length) ini = i + 1;
  }
  return out;
}
const itens = (sel) => sel.split(',').map((s) => s.trim());
// um seletor de 3 partes (html, body, alvo) avaliado contra os atributos do <html> e do <body>
function casaCadeia(sel, html, body, alvo) {
  const p = sel.split(/\s+/);
  if (p.length !== 3 || p[2] !== alvo) return false;
  const casaParte = (parte, tag, at) => {
    const m = /^([a-z]+)((?:\[[\w-]+(?:="[^"]*")?\]|:not\(\[[\w-]+\]\))*)$/.exec(parte);
    if (!m) throw new Error('parte fora do avaliador: ' + parte);
    if (m[1] !== tag) return false;
    return [...m[2].matchAll(/(:not\()?\[([\w-]+)(?:="([^"]*)")?\]\)?/g)].every((x) => {
      const tem = x[2] in at && (x[3] === undefined || at[x[2]] === x[3]);
      return x[1] ? !tem : tem;
    });
  };
  return casaParte(p[0], 'html', html) && casaParte(p[1], 'body', body);
}

test('CSS: toda regra do drawer (style, ficha, bazar) é guardada por html[data-ficha3]; sem a marca nada casa', () => {
  const arqs = { style: ler('css', 'style.css'), ficha: ler('css', 'ficha.css'), bazar: ler('css', 'bazar.css') };
  let n = 0;
  Object.entries(arqs).forEach(([nome, css]) => regras(css).forEach((r) => {
    if (!/ficha3/.test(r.sel + r.corpo)) return;
    n++;
    itens(r.sel).forEach((s) => assert.match(s, /^html\[data-ficha3(="(?:trilho|aberto)")?\] /, nome + ': regra sem a guarda: ' + s));
  }));
  assert.ok(n >= 8, 'as regras do drawer: ' + n);
  // os tokens (380/460 e 48) e o z-index; o --dir-w (right-bar) não é reaproveitado
  const tok = ler('css', 'tokens.css');
  assert.match(tok, /--ficha3-w: 380px;/);
  assert.match(tok, /@media \(min-width: 1800px\) \{\s*:root \{[^}]*--ficha3-w: 460px;/);
  assert.match(tok, /--ficha3-trilho: 48px;/);
  assert.match(tok, /--z-ficha3: \d+;/);
  Object.values(arqs).forEach((css) => assert.doesNotMatch(css.replace(/\/\*[\s\S]*?\*\//g, ''), /ficha3[^;]*--dir-w|--dir-w[^;]*ficha3/));
  // o CSS da casca do drawer não entra por página nenhuma (o drawer o pede): o teste do kh-ficha-abas cobre
});

test('CSS: empurrar só nas páginas de conteúdo; o Bazar e a página da ficha nunca são empurrados; a right-bar some', () => {
  const rs = regras(ler('css', 'style.css')).filter((r) => r.ctx.includes('@layer layout'));
  // as regras de margem do .main-content que dependem da marca
  const margem = rs.filter((r) => /margin-right:\s*var\(--ficha3/.test(r.corpo));
  assert.ok(margem.length >= 2);
  const larg = (r) => /var\((--ficha3-[a-z]+)\)/.exec(r.corpo)[1];
  // o que casa com o .main-content numa página, num estado, numa largura
  function empurra(htmlAt, bodyAt, largo) {
    const casam = margem.filter((r) => (largo || !r.ctx.some((c) => /min-width: 1100px/.test(c))) &&
      itens(r.sel).some((s) => casaCadeia(s, htmlAt, bodyAt, '.main-content')));
    // a última que casa vence (mesma especificidade da cadeia, ordem no arquivo)
    return casam.length ? larg(casam[casam.length - 1]) : null;
  }
  const PAG = { sistema: {}, bazar: { 'data-no-rightbar': '', 'data-bazar': '' }, ficha: { 'data-no-rightbar': '', 'data-ficha-pagina': '' } };
  const EST = { sem: {}, trilho: { 'data-ficha3': 'trilho', 'data-ficha-previa': '' }, aberto: { 'data-ficha3': 'aberto', 'data-ficha-previa': '' } };
  for (const largo of [true, false]) {
    assert.equal(empurra(EST.sem, PAG.sistema, largo), null, 'sem a prévia nada');
    assert.equal(empurra(EST.trilho, PAG.sistema, largo), '--ficha3-trilho');
    assert.equal(empurra(EST.aberto, PAG.sistema, largo), largo ? '--ficha3-w' : '--ficha3-trilho', 'abaixo de 1100 px o aberto fica por cima');
    ['sem', 'trilho', 'aberto'].forEach((e) => {
      assert.equal(empurra(EST[e], PAG.bazar, largo), null, 'Bazar não empurra (' + e + ')');
      assert.equal(empurra(EST[e], PAG.ficha, largo), null, 'página da ficha não empurra (' + e + ')');
    });
  }
  // a right-bar some com o drawer; a reserva fica fora da página da ficha
  assert.ok(rs.some((r) => r.sel === 'html[data-ficha3] .right-bar' && /display:\s*none/.test(r.corpo)));
  const reserva = rs.filter((r) => /::after$/.test(r.sel));
  assert.ok(reserva.length >= 2);
  reserva.forEach((r) => assert.match(r.sel, /body:not\(\[data-ficha-pagina\]\)::after$/));
  assert.match(reserva[0].corpo, /z-index:\s*calc\(var\(--z-ficha3\) - 1\)/, 'abaixo do drawer, que monta por cima');
  // no Bazar só a calha cresce o trilho (nunca a largura do drawer aberto)
  const bz = regras(ler('css', 'bazar.css')).filter((r) => /ficha3/.test(r.corpo));
  assert.deepEqual(bz.map((r) => [r.sel, r.corpo]), [['html[data-ficha3] .bazar-page', 'padding-right: calc(40px + var(--ficha3-trilho));']]);
  // a aba FICHA e o voltar ao topo vão para a esquerda do trilho ou do drawer, fora da página da ficha
  const fc = regras(ler('css', 'ficha.css')).filter((r) => /ficha3/.test(r.sel));
  assert.deepEqual(fc.map((r) => r.sel), ['html[data-ficha3] body:not([data-ficha-pagina]) #kf-toggle', 'html[data-ficha3="aberto"] body:not([data-ficha-pagina]) #kf-toggle']);
  assert.deepEqual(fc.map((r) => r.corpo), ['right:var(--ficha3-trilho)', 'right:var(--ficha3-w)']);
  const topo = regras(ler('css', 'style.css')).filter((r) => /back-to-top/.test(r.sel) && /ficha3/.test(r.sel));
  assert.deepEqual(topo.map((r) => r.corpo), ['right: calc(30px + var(--ficha3-trilho));', 'right: calc(30px + var(--ficha3-w));']);
});

test('CSS da casca: o estado pelo <html>, z-index do token, texto em AA, foco visível', () => {
  const css = ler('css', 'ficha-drawer.css').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(regra(css, '.fd-gaveta'), /z-index: var\(--z-ficha3\);/);
  assert.match(regra(css, '.fd-gaveta'), /width: var\(--ficha3-trilho\);/);
  assert.match(regra(css, ':root[data-ficha3="aberto"] .fd-gaveta'), /width: var\(--ficha3-w\);/);
  assert.match(css, /:root\[data-ficha3="aberto"\] \.fd-gaveta-trilho,\s*:root:not\(\[data-ficha3="aberto"\]\) \.fd-gaveta-folha \{ display: none; \}/);
  assert.match(regra(css, '.fd-gaveta :focus-visible'), /outline: 2px solid var\(--amber\)/);
  // o z-index fica abaixo dos pop-ups e da ficha atual, acima da nav e do painel de receita
  const z = (k) => Number(new RegExp('--z-' + k + ': (\\d+);').exec(ler('css', 'tokens.css'))[1]);
  assert.ok(z('ficha3') > z('nav') && z('ficha3') > z('painel-esq') && z('ficha3') < z('popover') && z('ficha3') < z('ficha'));
  // texto da casca contra o fundo do drawer (o --painel) e o das peças
  const painel = /--painel:\s*linear-gradient\(180deg,\s*(#[0-9a-f]{6})/i.exec(ler('css', 'tokens.css'))[1].toLowerCase();
  const cor = (sel) => resolveCor(/(?:^|;)\s*color:\s*([^;]+?)\s*(?:;|$)/.exec(regra(css, sel).trim())[1]);
  [['.fd-gaveta .fd-gaveta-ro', painel], ['.fd-gaveta .fd-gaveta-sub', painel], ['.fd-gaveta-aba', painel], ['.fd-gaveta-nome', painel],
    ['.fd-gaveta-abrir', TOKENS['bg-card']], ['.fd-gaveta-sair', painel], ['.fd-gaveta-mini-cab', '#0c0b10']].forEach(([sel, fundo]) => {
    const c = contraste(cor(sel), fundo);
    assert.ok(c >= 4.5, sel + ': ' + c.toFixed(2) + ':1');
  });
  // no trilho, o "calc. X" e a marca de aviso da conta não cabem (a dica diz os dois)
  assert.match(regra(css, '.fd-gaveta-mini .fd-tr-calc, .fd-gaveta-mini .fd-tr-marca-aviso'), /display: none;/);
  // as 3 dicas do trilho à esquerda da aba FICHA (a coluna de cada barra somada)
  assert.match(regra(css, '.fd-gaveta-mini .fd-tr-dica'), /right: calc\(100% \+ 42px \+ var\(--fd-gaveta-i\) \* 15px\);/);
  const aviso = regra(css, '.fd-gaveta .fd-gaveta-aviso');
  const fundoAviso = resolveCor(/background:\s*([^;]+);/.exec(aviso)[1]);
  assert.ok(contraste(cor('.fd-gaveta .fd-gaveta-aviso'), fundoAviso) >= 4.5, 'o aviso');
  // a nota de quando a ficha atual abre por cima (07 §0, item 1): fora da folha, à
  // esquerda do drawer v2.1, sem pegar o ponteiro (o arrasto segue por baixo), em AA
  const nota = regra(css, '.fd-gaveta .fd-gaveta-nota');
  assert.match(nota, /position: fixed;/);
  // a reserva (sem o script) também fica fora dos dois drawers: o v2.1 (420px) e este aberto (--ficha3-w, 460px a 1800px)
  assert.match(nota, /right: var\(--fd-nota-dir, calc\(max\(420px, var\(--ficha3-w\)\) \+ 12px\)\);/);
  assert.equal(FD.VAO_NOTA, 12, 'o mesmo vão do script');
  assert.match(nota, /pointer-events: none;/);
  assert.ok(contraste(cor('.fd-gaveta .fd-gaveta-nota'), resolveCor(/background:\s*([^;]+);/.exec(nota)[1])) >= 4.5, 'a nota');
  assert.match(regra(css, '.fd-gaveta-nota[hidden]'), /display: none;/);
});

test('CSS (07 §0, item 3): com o drawer aberto, só a tabela marcada larga rola, ela mesma; o pai, as que cabem e a nav não mudam', () => {
  const css = ler('css', 'style.css');
  const rs = regras(css).filter((r) => /ficha3/.test(r.sel) && /overflow/.test(r.corpo));
  assert.equal(rs.length, 1, JSON.stringify(rs));
  const r = rs[0];
  assert.ok(r.ctx.includes('@layer layout'), 'na camada layout');
  assert.equal(r.ctx.filter((c) => c.startsWith('@media')).length, 0, 'em toda largura com o drawer aberto');
  assert.equal(r.sel, 'html[data-ficha3="aberto"] body:not([data-bazar]):not([data-ficha-pagina]) .main-content table[' + FD.MARCA_LARGA + ']');
  assert.match(r.corpo, /display: block;/);
  assert.match(r.corpo, /max-width: 100%;/);
  // o !important vence o overflow: hidden sem camada da .progression-table do Espadachim
  assert.match(r.corpo, /overflow-x: auto !important;/);
  assert.match(r.corpo, /overflow-y: hidden;/);
  regras(css).filter((x) => /ficha3/.test(x.sel)).forEach((x) => {
    // nenhum pai de tabela ganha overflow (o bullet do <li> some, as margens deixam de colapsar)
    assert.doesNotMatch(x.sel, /:has\(/, 'nenhuma regra do drawer pelo pai: ' + x.sel);
    // a tabela sem a marca (a que cabe) não muda
    if (/(?:^|[\s>])table\b/.test(x.sel)) assert.match(x.sel, /table\[data-fd-larga\]$/, 'só a marcada: ' + x.sel);
    assert.doesNotMatch(x.sel + x.corpo, /data-nav|\.sidebar|--nav-w/, 'a nav é do jogador: ' + x.sel);
  });
  // a regra solta da tabela-base que o !important precisa vencer (se sumir, o !important pode sair)
  assert.match(ler('pages', 'classes', 'espadachim.html'), /\.progression-table \{[^}]*overflow: hidden;/);
});
