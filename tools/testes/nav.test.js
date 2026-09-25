// Testes do js/nav.js (navegação lateral) sobre um DOM mínimo de mentira.
// Não há jsdom no repo: o stub cobre só os seletores que o nav.js usa.
// Roda com `node --test` (o build.py chama todos os tools/testes/*.test.js).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const FONTE = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'nav.js'), 'utf8');

// ---------- DOM mínimo ----------
function casaSimples(el, sel) {
  if (!el || !el.tagName) return false;
  const re = /([a-z]+)|\.([\w-]+)|#([\w-]+)|\[([\w-]+)(?:="([^"]*)")?\]/gi;
  let m, ok = true;
  while ((m = re.exec(sel))) {
    if (m[1]) ok = ok && el.tagName.toLowerCase() === m[1].toLowerCase();
    else if (m[2]) ok = ok && el.classList.contains(m[2]);
    else if (m[3]) ok = ok && el.getAttribute('id') === m[3];
    else if (m[4]) ok = ok && (m[5] === undefined ? el.hasAttribute(m[4]) : el.getAttribute(m[4]) === m[5]);
  }
  return ok;
}
function casa(el, sel) {
  return sel.split(',').some(function (s) {
    const partes = s.trim().split(/\s+/);
    if (!casaSimples(el, partes[partes.length - 1])) return false;
    let p = el.parentNode, i = partes.length - 2;
    while (i >= 0 && p) { if (casaSimples(p, partes[i])) i--; p = p.parentNode; }
    return i < 0;
  });
}
class El {
  constructor(tag, attrs, filhos) {
    this.tagName = tag.toUpperCase(); this.nodeType = 1; this.attrs = {}; this.children = [];
    this.parentNode = null; this.ouvintes = {}; this.hidden = false; this.style = {}; this.textContent = '';
    this.scrollTop = 0; this.offsetTop = 0; this.clientHeight = 600;
    const self = this;
    this.classList = {
      contains: (c) => (self.attrs.class || '').split(/\s+/).includes(c),
      add: (c) => { if (!self.classList.contains(c)) self.attrs.class = ((self.attrs.class || '') + ' ' + c).trim(); },
      remove: (c) => { self.attrs.class = (self.attrs.class || '').split(/\s+/).filter((x) => x && x !== c).join(' '); },
      toggle: (c) => { if (self.classList.contains(c)) { self.classList.remove(c); return false; } self.classList.add(c); return true; },
    };
    Object.assign(this.attrs, attrs || {});
    (filhos || []).forEach((f) => this.appendChild(f));
  }
  get id() { return this.attrs.id || ''; }
  set id(v) { this.attrs.id = v; }
  get className() { return this.attrs.class || ''; }
  set className(v) { this.attrs.class = v; }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  removeAttribute(k) { delete this.attrs[k]; }
  hasAttribute(k) { return k in this.attrs; }
  appendChild(f) { f.parentNode = this; this.children.push(f); return f; }
  contains(o) { while (o) { if (o === this) return true; o = o.parentNode; } return false; }
  todos() { return this.children.reduce((a, c) => a.concat([c], c.todos()), []); }
  querySelectorAll(sel) { return this.todos().filter((e) => casa(e, sel)); }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  closest(sel) { let e = this; while (e && e.tagName) { if (casa(e, sel)) return e; e = e.parentNode; } return null; }
  getBoundingClientRect() { return { top: 10, bottom: 40, height: 30 }; }
  addEventListener(t, fn, opc) { (this.ouvintes[t] = this.ouvintes[t] || []).push({ fn, cap: opc === true }); }
  focus() { amb.doc.activeElement = this; }
}
function evento(tipo, props) {
  return Object.assign({ type: tipo, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } }, props);
}
// despacha: capture em document, depois bolha do alvo até document
function despacha(doc, alvo, ev) {
  ev.target = alvo;
  (doc.ouvintes[ev.type] || []).filter((o) => o.cap).forEach((o) => o.fn(ev));
  for (let e = alvo; e; e = e.parentNode) (e.ouvintes[ev.type] || []).filter((o) => !o.cap || e !== doc).forEach((o) => o.fn(ev));
  return ev;
}

let amb;
function monta(opc) {
  opc = opc || {};
  const link = (href, rot, ativo) => new El('a', { href, class: 'nav-link' + (ativo ? ' active' : '') }, [new El('span', { class: 'nav-rot' })]);
  const cab = (g) => new El('button', { class: 'nav-grupo-cab', 'aria-expanded': 'true', 'data-dica': g }, []);
  const use = new El('use', { href: '#nv-recolher' });
  const btn = new El('button', { class: 'nav-recolher', 'aria-expanded': 'true' }, [new El('svg', {}, [use])]);
  const nav = new El('nav', { class: 'sidebar', id: 'nav-principal' }, [
    new El('div', { class: 'sidebar-header' }, [btn]),
    new El('div', { class: 'nav-section' }, [link('index.html', 'Início', false)]),
    new El('div', { class: 'nav-section nav-grupo', 'data-grupo': 'racas' }, [cab('Raças (7)'), new El('div', { class: 'nav-grupo-lista' }, [link('humano.html', 'Humano', !!opc.ativoRaca)])]),
    new El('div', { class: 'nav-section nav-grupo', 'data-grupo': 'classes' }, [cab('Classes (7)'), new El('div', { class: 'nav-grupo-lista' }, [link('monge.html', 'Monge', false)])]),
  ]);
  const busca = new El('input', { type: 'search' });
  const drawer = new El('div', { id: 'kf-drawer' }, [new El('button', {})]);
  const toggle = new El('button', { class: 'menu-toggle' });
  const body = new El('body', {}, [toggle, nav, busca, drawer]);
  const htmlEl = new El('html', opc.htmlAttrs || {}, [body]);
  const doc = new El('#document', {}, [htmlEl]);
  doc.documentElement = htmlEl; doc.body = body; doc.activeElement = body;
  doc.createElement = (t) => new El(t);
  const loja = {}; if (opc.salvo !== undefined) loja.khalkaria_nav = opc.salvo;
  const localStorage = opc.semStorage
    ? { getItem() { throw new Error('bloqueado'); }, setItem() { throw new Error('bloqueado'); } }
    : { getItem: (k) => (k in loja ? loja[k] : null), setItem: (k, v) => { loja[k] = String(v); } };
  const win = new El('window');
  const mq = (q) => ({ matches: q.includes('min-width') ? opc.largura !== 'mobile' : !!opc.calmo, addEventListener() {} });
  const timers = [];
  amb = { doc, nav, btn, use, busca, drawer, toggle, htmlEl, loja, win, timers };
  const ctx = {
    document: doc, window: Object.assign(win, { matchMedia: mq }), localStorage, JSON,
    setTimeout: (fn) => { timers.push(fn); return timers.length; }, clearTimeout() {},
  };
  vm.runInNewContext(FONTE, ctx);
  return amb;
}
const tecla = (a, alvo, key, extra) => despacha(a.doc, alvo || a.doc.body, evento('keydown', Object.assign({ key }, extra)));
const clica = (a, alvo) => despacha(a.doc, alvo, evento('click', {}));

test('sem estado salvo: nav aberta, grupos abertos, botão "Recolher"', () => {
  const a = monta();
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), null);
  assert.strictEqual(a.btn.getAttribute('aria-expanded'), 'true');
  assert.strictEqual(a.btn.getAttribute('aria-label'), 'Recolher navegação');
  assert.ok(a.nav.querySelectorAll('.nav-grupo-cab').every((c) => c.getAttribute('aria-expanded') === 'true'));
});

test('"\\" alterna o trilho, grava e troca glifo e rótulo do botão', () => {
  const a = monta();
  const ev = tecla(a, null, '\\');
  assert.ok(ev.defaultPrevented);
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), 'trilho');
  assert.strictEqual(a.btn.getAttribute('aria-expanded'), 'false');
  assert.strictEqual(a.btn.getAttribute('aria-label'), 'Expandir navegação');
  assert.strictEqual(a.use.getAttribute('href'), '#nv-expandir');
  assert.deepStrictEqual(JSON.parse(a.loja.khalkaria_nav), { v: 1, trilho: true, fechados: [] });
  clica(a, a.btn);
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), null);
  assert.ok(a.htmlEl.classList.contains('nav-anima'), 'expandir anima os rótulos');
});

test('"\\" é ignorado em campo, com modificador, repetido, já tratado, na Ficha e no mobile', () => {
  let a = monta();
  a.doc.activeElement = a.busca;
  assert.ok(!tecla(a, a.busca, '\\').defaultPrevented);
  a.doc.activeElement = a.doc.body;
  for (const extra of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }, { repeat: true }]) {
    assert.ok(!tecla(a, null, '\\', extra).defaultPrevented, JSON.stringify(extra));
  }
  assert.ok(!tecla(a, a.drawer.children[0], '\\').defaultPrevented);
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), null);
  a = monta({ largura: 'mobile' });
  assert.ok(!tecla(a, null, '\\').defaultPrevented);
});

test('Esc só é consumido com dica visível ou menu mobile aberto', () => {
  const a = monta({ salvo: '{"v":1,"trilho":true,"fechados":[]}' });
  assert.ok(!tecla(a, null, 'Escape').defaultPrevented, 'Esc livre passa para o Bazar/Ficha');
  despacha(a.doc, a.btn, evento('focusin', {}));
  const dica = a.doc.body.querySelector('#nav-dica');
  assert.ok(dica && !dica.hidden, 'foco no trilho mostra a dica');
  assert.strictEqual(dica.textContent, 'Expandir navegação');
  assert.ok(tecla(a, null, 'Escape').defaultPrevented);
  assert.ok(dica.hidden);
  clica(a, a.toggle);
  assert.ok(a.nav.classList.contains('open'));
  assert.ok(tecla(a, null, 'Escape').defaultPrevented);
  assert.ok(!a.nav.classList.contains('open'));
});

test('dica não aparece com a nav aberta', () => {
  const a = monta();
  despacha(a.doc, a.nav.querySelector('a'), evento('focusin', {}));
  assert.ok(a.doc.body.querySelector('#nav-dica').hidden);
});

test('grupos: clique fecha e grava; o grupo da página atual não fecha', () => {
  const a = monta({ ativoRaca: true });
  const [racas, classes] = a.nav.querySelectorAll('.nav-grupo-cab');
  assert.strictEqual(racas.getAttribute('aria-disabled'), 'true');
  clica(a, racas);
  assert.strictEqual(racas.getAttribute('aria-expanded'), 'true');
  clica(a, classes);
  assert.strictEqual(classes.getAttribute('aria-expanded'), 'false');
  assert.strictEqual(a.htmlEl.getAttribute('data-nav-fechados'), 'classes');
  assert.deepStrictEqual(JSON.parse(a.loja.khalkaria_nav).fechados, ['classes']);
  clica(a, classes);
  assert.strictEqual(a.htmlEl.getAttribute('data-nav-fechados'), null);
});

test('estado salvo é respeitado e lixo no storage é filtrado', () => {
  const a = monta({ salvo: '{"v":1,"trilho":true,"fechados":["racas","xpto"]}' });
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), 'trilho');
  assert.strictEqual(a.htmlEl.getAttribute('data-nav-fechados'), 'racas');
  const b = monta({ salvo: '{quebrado' });
  assert.strictEqual(b.htmlEl.getAttribute('data-nav'), null);
});

test('sem storage (janela privada/bloqueado): funciona no padrão, sem lançar', () => {
  const a = monta({ semStorage: true });
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), null);
  tecla(a, null, '\\');
  assert.strictEqual(a.htmlEl.getAttribute('data-nav'), 'trilho');
});

test('menu mobile: clique em link fecha', () => {
  const a = monta({ largura: 'mobile' });
  clica(a, a.toggle);
  assert.strictEqual(a.toggle.getAttribute('aria-expanded'), 'true');
  clica(a, a.nav.querySelector('a'));
  assert.ok(!a.nav.classList.contains('open'));
});

test('boot do <head> casa com o formato gravado pelo nav.js', () => {
  const boot = fs.readFileSync(path.join(__dirname, '..', '..', 'partials', 'head-boot.html'), 'utf8');
  const js = boot.replace(/^<script[^>]*>|<\/script>\s*$/g, '');
  const htmlEl = new El('html');
  vm.runInNewContext(js, { document: { documentElement: htmlEl }, JSON,
    localStorage: { getItem: () => '{"v":1,"trilho":true,"fechados":["racas","classes"]}' } });
  assert.strictEqual(htmlEl.getAttribute('data-nav'), 'trilho');
  assert.strictEqual(htmlEl.getAttribute('data-nav-fechados'), 'racas classes');
});
