'use strict';
// Apoio dos testes (não é *.test.js): um DOM mínimo de mentira, um pouco mais
// fiel que os stubs dos outros testes, para o drawer da ficha nova
// (ficha-drawer.test.js), que monta a si mesmo por innerHTML e se acha por
// seletor. Não há jsdom no repo.
//   - innerHTML vira árvore de verdade (tags, atributos, texto; entidades
//     básicas); o getter devolve a última string posta (o que o redesenho
//     compara) ou, se nada foi posto, a serialização;
//   - seletores: listas por vírgula, descendente (espaço), tag, #id, .classe,
//     [a], [a="v"], [a*="v"], :not(<simples>), :focus-visible e :hover (pelas
//     marcas doc.modo === 'teclado' e el.sob);
//   - eventos com captura e bolha (document -> ancestrais -> alvo -> ancestrais
//     -> document), preventDefault e stopPropagation;
//   - foco (doc.activeElement), hidden, classList, style com setProperty.
const VAZIAS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'use', 'path', 'circle']);

function decod(s) {
  return String(s).replace(/&(amp|lt|gt|quot|#39);/g, (m, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[e]));
}
function cod(s, attr) {
  return String(s).replace(attr ? /[&<>"]/g : /[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// ---------------------------------------------------------------- seletores
// um seletor simples composto: tag, #id, .classe, [a], [a="v"], [a*="v"], :not(x), :pseudo
function compila(simples) {
  const testes = [];
  const re = /^([a-zA-Z][a-zA-Z0-9-]*|\*)|#([\w-]+)|\.([\w-]+)|\[([\w-]+)(?:(\*?=)"([^"]*)")?\]|:not\(([^()]*)\)|:([\w-]+)/g;
  let m, fim = 0;
  while ((m = re.exec(simples))) {
    if (m.index !== fim) throw new Error('seletor fora do DOM mínimo: ' + simples);
    fim = re.lastIndex;
    if (m[1]) { const t = m[1].toUpperCase(); if (t !== '*') testes.push((e) => e.tagName === t); }
    else if (m[2]) { const id = m[2]; testes.push((e) => e.getAttribute('id') === id); }
    else if (m[3]) { const c = m[3]; testes.push((e) => e.classList.contains(c)); }
    else if (m[4]) {
      const a = m[4], op = m[5], v = m[6];
      testes.push((e) => {
        const x = e.getAttribute(a);
        if (x == null) return false;
        if (!op) return true;
        return op === '=' ? x === v : x.indexOf(v) >= 0;
      });
    } else if (m[7] != null) { const f = compila(m[7].trim()); testes.push((e) => !f(e)); }
    else if (m[8]) {
      const p = m[8];
      if (p === 'focus-visible') testes.push((e) => e.doc.activeElement === e && e.doc.modo === 'teclado');
      else if (p === 'hover') testes.push((e) => !!e.sob);
      else if (p === 'focus') testes.push((e) => e.doc.activeElement === e);
      else throw new Error('pseudo fora do DOM mínimo: :' + p);
    }
    if (re.lastIndex === m.index) re.lastIndex++;
  }
  if (fim !== simples.length) throw new Error('seletor fora do DOM mínimo: ' + simples);
  return (e) => testes.every((t) => t(e));
}
function partes(sel) {
  // vírgulas de fora dos parênteses
  const out = [];
  let nivel = 0, atual = '';
  for (const ch of sel) {
    if (ch === ',' && !nivel) { out.push(atual); atual = ''; continue; }
    if (ch === '(') nivel++;
    if (ch === ')') nivel--;
    atual += ch;
  }
  return out.concat(atual).map((s) => s.trim()).filter(Boolean);
}
const cache = new Map();
function seletor(sel) {
  if (cache.has(sel)) return cache.get(sel);
  const alts = partes(sel).map((s) => s.split(/\s+/).map(compila));
  const f = (e) => alts.some((cadeia) => {
    if (!cadeia[cadeia.length - 1](e)) return false;
    let i = cadeia.length - 2, p = e.pai;
    while (i >= 0 && p && p.nodeType === 1) { if (cadeia[i](p)) i--; p = p.pai; }
    return i < 0;
  });
  cache.set(sel, f);
  return f;
}

// ---------------------------------------------------------------- nós
class Texto {
  constructor(t) { this.nodeType = 3; this.texto = String(t); this.pai = null; }
  get textContent() { return this.texto; }
}
class Elemento {
  constructor(doc, tag, attrs) {
    this.doc = doc; this.nodeType = 1; this.tagName = String(tag).toUpperCase();
    this.attrs = Object.assign({}, attrs || {}); this.filhos = []; this.pai = null; this.ouv = {};
    this.scrollTop = 0; this.sob = false; this.rect = null; this._html = null;
    const props = {};
    this.style = {
      setProperty: (k, v) => { props[k] = String(v); }, removeProperty: (k) => { delete props[k]; },
      getPropertyValue: (k) => (k in props ? props[k] : '')
    };
    const self = this;
    this.classList = {
      contains: (c) => (' ' + (self.attrs.class || '') + ' ').indexOf(' ' + c + ' ') >= 0,
      add: (...cs) => cs.forEach((c) => { if (!self.classList.contains(c)) self.attrs.class = ((self.attrs.class || '') + ' ' + c).trim(); }),
      remove: (...cs) => cs.forEach((c) => { self.attrs.class = (self.attrs.class || '').split(/\s+/).filter((x) => x && x !== c).join(' '); }),
      toggle: (c, f) => { const on = f === undefined ? !self.classList.contains(c) : !!f; if (on) self.classList.add(c); else self.classList.remove(c); return on; }
    };
  }
  get id() { return this.attrs.id || ''; }
  set id(v) { this.attrs.id = String(v); }
  get className() { return this.attrs.class || ''; }
  set className(v) { this.attrs.class = String(v); }
  get hidden() { return 'hidden' in this.attrs; }
  set hidden(v) { if (v) this.attrs.hidden = ''; else delete this.attrs.hidden; }
  get open() { return 'open' in this.attrs; }
  set open(v) { if (v) this.attrs.open = ''; else delete this.attrs.open; }
  get rel() { return this.attrs.rel || ''; }
  set rel(v) { this.attrs.rel = String(v); }
  get href() { return this.attrs.href || ''; }
  set href(v) { this.attrs.href = String(v); }
  get src() { return this.attrs.src || ''; }
  get parentNode() { return this.pai; }
  get parentElement() { return this.pai && this.pai.nodeType === 1 ? this.pai : null; }
  get children() { return this.filhos.filter((f) => f.nodeType === 1); }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  removeAttribute(k) { delete this.attrs[k]; }
  hasAttribute(k) { return k in this.attrs; }
  get textContent() { return this.filhos.map((f) => f.textContent).join(''); }
  set textContent(t) { this.filhos.forEach((f) => { f.pai = null; }); this.filhos = []; this._html = null; if (String(t)) this.appendChild(new Texto(t)); }
  get innerHTML() { return this._html != null ? this._html : this.filhos.map(serializa).join(''); }
  set innerHTML(h) {
    const foco = this.doc.activeElement;
    if (foco && foco !== this && this.contains(foco)) this.doc.activeElement = this.doc.body;   // o focado some com o HTML velho
    this.filhos.forEach((f) => { f.pai = null; });
    this.filhos = [];
    parse(this.doc, String(h)).forEach((f) => this.appendChild(f));
    this._html = String(h);
  }
  appendChild(f) {
    if (f.pai) f.pai.filhos.splice(f.pai.filhos.indexOf(f), 1);
    f.pai = this; this.filhos.push(f); this._html = null; return f;
  }
  insertBefore(f, ref) {
    if (!ref) return this.appendChild(f);
    if (this.doc.activeElement === f) this.doc.activeElement = this.doc.body;
    if (f.pai) f.pai.filhos.splice(f.pai.filhos.indexOf(f), 1);
    this.filhos.splice(this.filhos.indexOf(ref), 0, f);
    f.pai = this; this._html = null; return f;
  }
  remove() { if (this.pai) { this.pai.filhos.splice(this.pai.filhos.indexOf(this), 1); this.pai = null; } }
  contains(n) { for (let x = n; x; x = x.pai) if (x === this) return true; return false; }
  matches(sel) { return seletor(sel)(this); }
  closest(sel) { const f = seletor(sel); for (let x = this; x && x.nodeType === 1; x = x.pai) if (f(x)) return x; return null; }
  querySelectorAll(sel) {
    const f = seletor(sel), out = [];
    (function anda(n) { n.filhos.forEach((c) => { if (c.nodeType === 1) { if (f(c)) out.push(c); anda(c); } }); })(this);
    return out;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
  addEventListener(t, f, o) { (this.ouv[t] = this.ouv[t] || []).push({ f, cap: o === true || !!(o && o.capture) }); }
  removeEventListener(t, f, o) {
    const cap = o === true || !!(o && o.capture);
    this.ouv[t] = (this.ouv[t] || []).filter((x) => x.f !== f || x.cap !== cap);
  }
  dispatchEvent(ev) { return despacha(this.doc, this, ev); }
  focus() { this.doc.activeElement = this; }
  getBoundingClientRect() { return this.rect || { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }; }
  click() { return despacha(this.doc, this, evento('click')); }
}
function serializa(n) {
  if (n.nodeType === 3) return cod(n.texto);
  const t = n.tagName.toLowerCase();
  const at = Object.keys(n.attrs).map((k) => (n.attrs[k] === '' ? ' ' + k : ' ' + k + '="' + cod(n.attrs[k], true) + '"')).join('');
  return '<' + t + at + '>' + (VAZIAS.has(t) ? '' : n.filhos.map(serializa).join('') + '</' + t + '>');
}
function parse(doc, html) {
  const raiz = { filhos: [] };
  const pilha = [raiz];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const cur = pilha[pilha.length - 1];
    if (m[0].startsWith('<!--')) continue;
    if (m[4] != null) { const t = new Texto(decod(m[4])); t.pai = cur === raiz ? null : cur; cur.filhos.push(t); continue; }
    const tag = m[2].toLowerCase();
    if (m[1]) {
      // fecha até a tag (tolerante)
      for (let i = pilha.length - 1; i > 0; i--) if (pilha[i].tagName === tag.toUpperCase()) { pilha.length = i; break; }
      continue;
    }
    const at = {};
    for (const a of m[3].matchAll(/([a-zA-Z_:][\w:.-]*)(?:="([^"]*)"|='([^']*)')?/g)) at[a[1]] = a[2] != null ? decod(a[2]) : a[3] != null ? decod(a[3]) : '';
    const el = new Elemento(doc, tag, at);
    el.pai = cur === raiz ? null : cur;
    cur.filhos.push(el);
    if (!VAZIAS.has(tag) && !/\/\s*$/.test(m[3])) pilha.push(el);
  }
  const fora = raiz.filhos;
  fora.forEach((f) => { f.pai = null; });
  return fora;
}

// ---------------------------------------------------------------- eventos
function evento(tipo, props) {
  return Object.assign({ type: tipo, defaultPrevented: false, propagou: true,
    preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.propagou = false; } }, props);
}
function despacha(doc, alvo, ev) {
  ev.target = alvo;
  const cadeia = [];
  for (let n = alvo; n && n.nodeType === 1; n = n.pai) cadeia.push(n);
  const roda = (n, cap) => {
    for (const o of (n.ouv[ev.type] || []).filter((x) => x.cap === cap)) { if (!ev.propagou) return; o.f.call(n, ev); }
  };
  roda(doc, true);
  for (let i = cadeia.length - 1; i >= 0 && ev.propagou; i--) roda(cadeia[i], true);
  for (let i = 0; i < cadeia.length && ev.propagou; i++) roda(cadeia[i], false);
  if (ev.propagou) roda(doc, false);
  return ev;
}

// ---------------------------------------------------------------- documento
function documento(opc) {
  opc = opc || {};
  const doc = { nodeType: 9, ouv: {}, modo: null, readyState: opc.readyState || 'complete', criados: [] };
  doc.addEventListener = Elemento.prototype.addEventListener;
  doc.removeEventListener = Elemento.prototype.removeEventListener;
  const html = new Elemento(doc, 'html');
  const head = new Elemento(doc, 'head');
  const body = new Elemento(doc, 'body', opc.body || {});
  html.appendChild(head); html.appendChild(body);
  Object.assign(doc, { documentElement: html, head, body, activeElement: body });
  doc.createElement = (t) => { const e = new Elemento(doc, t); doc.criados.push(e.tagName.toLowerCase()); return e; };
  doc.getElementById = (id) => html.querySelector('#' + id);
  doc.querySelector = (sel) => html.querySelector(sel);
  doc.querySelectorAll = (sel) => html.querySelectorAll(sel);
  doc.contains = (n) => html.contains(n);
  doc.dispatchEvent = (ev) => despacha(doc, html, ev);
  return doc;
}

module.exports = { Elemento, Texto, documento, evento, despacha, parse, seletor };
