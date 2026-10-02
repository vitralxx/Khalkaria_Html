'use strict';
// Página da ficha nova (F4.3a, js/ficha-pagina.js + templates/ficha.template.html).
// Cobre: ativação (a mesma regra do head-boot e do KhPrevia), o aviso sem a
// prévia (igual ao template, nenhum fetch), a casca com a prévia (topo, 5 abas
// do A4 por conjunto contra o 03 §4, tabpanel ligado a cada aba), o cálculo pelo
// motor no topo, o ponto de extensão RENDER (KhConta com prefixo fp), e no
// navegador (vm, artefato js/ficha.js + js/ficha-pagina.js): nenhuma escrita
// em localStorage nem sessionStorage além do que o js/ficha.js já faz sozinho.
// Mais o item "Ficha" da nav: data-so-previa, glifo nv-ficha e a regra que o esconde.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const FP = require('../../js/ficha-pagina.js');
const P = require('../../js/ficha/kh-previa.js');
const A = require('./estado-apoio.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
function dados() { return Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] }); }
function comV2() { return A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) }); }
const semTags = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

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
  const doc = ler('docs', 'ficha-digital', '03-respostas-pedro.md');
  const sec = doc.split(/^## /m).find((s) => s.startsWith('4. Ficha física A4'));
  assert.ok(sec, '03 §4');
  const paginas = [...sec.matchAll(/^(\d)\. \*\*([^*]+?):\*\*/gm)].map((m) => [Number(m[1]), m[2].trim()]);
  assert.equal(paginas.length, 5);
  assert.deepEqual(FP.ABAS.map((a) => [a.pag, a.rotulo]), paginas);
  assert.deepEqual(new Set(FP.ABAS.map((a) => a.id)), new Set(['nucleo', 'tecnicas', 'cartas', 'bazar', 'grimorio']));
});

test('casca: tablist com 5 abas, cada uma ligada ao seu tabpanel; uma selecionada, tabindex móvel', () => {
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
  // aba desconhecida volta à primeira
  assert.match(FP.htmlCasca('xpto'), /id="fp-aba-nucleo" data-aba="nucleo" aria-controls="fp-painel-nucleo" aria-selected="true"/);
  // topo: seletor desabilitado, aviso de só-leitura com o botão da ficha atual
  assert.match(h, /<select disabled[^>]*><option selected>Ficha atual<\/option><\/select>/);
  assert.ok(h.includes(FP.AVISO_RO));
  assert.match(h, /<button type="button" class="kh-btn fp-abrir-v2">Abrir a ficha atual<\/button>/);
  assert.doesNotMatch(h, /<h[23]\b[^>]*\sid=/, 'nenhum id em h2/h3 (é do build)');
});

test('render: topo com nome, raça, classe, nível e origem pelo motor; aba sem desenhista fica "em construção"', () => {
  const res = P.calcular(comV2(), dados(), '');
  assert.equal(res.estado, 'ok');
  const r = FP.render(res);
  const t = semTags(r.topo);
  assert.match(t, /Lira Vento-Sul \(ficha atual\)/);
  for (const x of ['Raça Humano', 'Classe Batedor', 'Nível 2', 'Origem Caçador']) assert.ok(t.includes(x), x + ' em: ' + t);
  assert.match(r.topo, /<h1 class="fp-nome">Lira Vento-Sul<\/h1>/);
  assert.deepEqual(Object.keys(r.paineis), FP.ABAS.map((a) => a.id));
  Object.values(r.paineis).forEach((p) => assert.match(p, /Esta aba ainda está em construção\./));
  assert.deepEqual(r.caminhos, []);
});

test('render: o desenhista da aba (F4.3b) recebe o resultado e o KhConta com prefixo fp', () => {
  const res = P.calcular(comV2(), dados(), '');
  try {
    FP.RENDER.nucleo = (rs, C) => '<p>' + C.conta('evasao.passiva') + '</p>';
    const r = FP.render(res);
    assert.match(r.paineis.nucleo, /class="kh-conta[^"]*" tabindex="0" aria-describedby="fp-d-1"/);
    assert.match(r.paineis.nucleo, /<span class="kh-conta-dica fp-dica" id="fp-d-1" role="tooltip">/);
    assert.doesNotMatch(r.paineis.nucleo, /kf3-/);
    assert.deepEqual(r.caminhos, ['evasao.passiva']);
    assert.match(r.paineis.tecnicas, /em construção/);
  } finally { delete FP.RENDER.nucleo; }
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

test('navegador com a prévia (chave ou ?ficha=v3): casca, 5 abas, topo pelo motor, e nenhuma escrita de ficha', async () => {
  for (const op of [{ ls: { khalkaria_ficha_previa: '1' } }, { search: '?ficha=v3' }]) {
    op.ls = Object.assign({ khalkaria_ficha: JSON.stringify(V2) }, op.ls);
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
      assert.match(p.innerHTML, /em construção/);
    });
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
