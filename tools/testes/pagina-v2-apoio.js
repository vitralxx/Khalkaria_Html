'use strict';
// Apoio dos testes (não é *.test.js): a ficha v2.1 REAL (o artefato
// js/ficha.js) num vm, com o init() rodando (readyState 'complete') sobre um
// DOM falso tolerante, como em export-import.test.js. O window guarda os
// ouvintes para disparar 'storage' e 'pagehide', e os timers ficam na mão
// (debounce do save()). Usado pela guarda (guarda-v3.test.js) e pela escrita
// dupla (estado-v3.test.js: a v2.1 lendo a projeção).
//
// pagina(storage, {catalogo}): catalogo é o que o fetch do bazar.json devolve
// (padrão: fixtures/catalogo-mini.json); null = o fetch nunca responde.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'ficha.js'), 'utf8');
const CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'catalogo-mini.json'), 'utf8'));
const puro = (x) => JSON.parse(JSON.stringify(x));

function criaDom() {
  const criados = [];
  function lista(arr) { arr.forEach = Array.prototype.forEach; arr.item = (i) => arr[i] || null; return arr; }
  function elemento(tag) {
    const attrs = {}, ouv = {};
    const e = {
      tagName: String(tag || 'div').toUpperCase(), nodeType: 1, className: '', textContent: '',
      innerHTML: '', value: '', checked: false, disabled: false, files: [],
      style: {}, children: [], parentElement: null, parentNode: null,
      classList: {
        _s: new Set(),
        add(...c) { c.forEach((x) => this._s.add(x)); },
        remove(...c) { c.forEach((x) => this._s.delete(x)); },
        toggle(c, f) { const on = f === undefined ? !this._s.has(c) : !!f; if (on) this._s.add(c); else this._s.delete(c); return on; },
        contains(c) { return this._s.has(c); }
      },
      setAttribute(k, v) { attrs[k] = String(v); },
      getAttribute(k) { return k in attrs ? attrs[k] : null; },
      hasAttribute(k) { return k in attrs; },
      removeAttribute(k) { delete attrs[k]; },
      addEventListener(t, f) { (ouv[t] = ouv[t] || []).push(f); },
      removeEventListener() {},
      dispatchEvent(ev) { (ouv[ev.type] || []).forEach((f) => f(ev)); return true; },
      appendChild(c) { if (c && typeof c === 'object') { c.parentElement = e; c.parentNode = e; e.children.push(c); } return c; },
      insertBefore(c) { return e.appendChild(c); },
      replaceChild(n) { return n; },
      remove() {},
      // devolve os descendentes que casam com uma lista simples de tags
      querySelectorAll(sel) {
        const tags = String(sel).split(',').map((s) => s.trim().toUpperCase());
        const out = [];
        (function anda(n) { n.children.forEach((c) => { if (c && c.tagName) { if (tags.includes(c.tagName)) out.push(c); anda(c); } }); })(e);
        return lista(out);
      },
      querySelector() { return null; },
      closest() { return null; },
      contains() { return false; },
      focus() {}, scrollIntoView() {},
      click() { e.dispatchEvent({ type: 'click', target: e, preventDefault() {}, stopPropagation() {} }); }
    };
    criados.push(e);
    return e;
  }
  return { elemento, criados, lista };
}

function pagina(storage, opcoes) {
  const cat = opcoes && opcoes.catalogo !== undefined ? opcoes.catalogo : CAT;
  const dom = criaDom();
  const baixados = [], ouvWin = {}, eventos = [], timers = new Map();
  let proxTimer = 1;
  const bodyEl = dom.elemento('body');
  bodyEl.hasAttribute = () => false;
  const document = {
    readyState: 'complete', currentScript: null, activeElement: null, visibilityState: 'visible',
    body: bodyEl, head: dom.elemento('head'),
    querySelector: () => null, querySelectorAll: () => dom.lista([]), getElementById: () => null,
    createElement: (t) => dom.elemento(t),
    createTextNode: (t) => ({ nodeType: 3, textContent: t }),
    addEventListener() {}, removeEventListener() {},
    dispatchEvent(ev) { eventos.push({ tipo: ev.type, detail: puro(ev.detail) }); return true; }
  };
  class Blob { constructor(partes) { this.texto = partes.join(''); } }
  class FileReader { readAsText(f) { this.result = f.texto; this.onload && this.onload(); } }
  const sandbox = {
    document, localStorage: storage, CustomEvent, console, Blob, FileReader,
    URL: { createObjectURL: (b) => { baixados.push(JSON.parse(b.texto)); return 'blob:x'; }, revokeObjectURL() {} },
    setTimeout: (f) => { const id = proxTimer++; timers.set(id, f); return id; },
    clearTimeout: (id) => { timers.delete(id); },
    requestAnimationFrame: (f) => f(),
    MutationObserver: class { observe() {} disconnect() {} },
    fetch: () => (cat === null ? new Promise(() => {}) : Promise.resolve({ ok: true, json: () => Promise.resolve(puro(cat)) })),
    confirm: () => true, alert() {},
    addEventListener(t, f) { (ouvWin[t] = ouvWin[t] || []).push(f); }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox, { filename: 'ficha.js' });
  const porTitulo = (title) => dom.criados.filter((e) => e.tagName === 'BUTTON' && e.getAttribute('title') === title);
  return {
    KF: sandbox.KF, baixados, eventos, dom,
    // o botão da renderização mais recente (renderAll recria a faixa)
    botao(title) { const l = porTitulo(title); assert.ok(l.length, 'botão "' + title + '" existe'); return l[l.length - 1]; },
    temBotao: (title) => porTitulo(title).length > 0,
    faixas: () => dom.criados.filter((e) => e.getAttribute('id') === 'kf-ro'),
    toasts: () => dom.criados.filter((e) => e.getAttribute('id') === 'kf-toast').map((e) => e.textContent),
    win: (tipo, ev) => (ouvWin[tipo] || []).forEach((f) => f(ev || {})),
    rodaTimers() { const fs2 = [...timers.values()]; timers.clear(); fs2.forEach((f) => f()); },
    importar(obj) {
      this.botao('Importar JSON').click();
      const inp = dom.criados.filter((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'file').pop();
      if (!inp) return false;
      inp.files = [{ texto: JSON.stringify(obj) }];
      inp.dispatchEvent({ type: 'change', target: inp });
      return true;
    }
  };
}

module.exports = { criaDom, pagina };
