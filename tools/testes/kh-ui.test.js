'use strict';
// js/kh-ui.js (F2b): KhTeclas (registro único de atalhos e camadas do Esc),
// KhPrever (motor do pop-up extraído do bazar-cartao.js) e KhToast (toast com
// Desfazer extraído do bazar-inventario.js), sobre um DOM mínimo de mentira
// e relógio falso. O Bazar consome os três; estes testes guardam o motor.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const UI = require(path.join(__dirname, '..', '..', 'js', 'kh-ui.js'));

// ---------------------------------------------------------------- DOM mínimo
function casaSimples(el, sel) {
  if (!el || !el.tagName) return false;
  const re = /^([a-z]+)?|\.([\w-]+)|#([\w-]+)|\[([\w-]+)(?:="([^"]*)")?\]/gi;
  let m, ok = true;
  const partes = sel.match(/^[a-z]+|\.[\w-]+|#[\w-]+|\[[^\]]+\]/gi) || [];
  for (const p of partes) {
    re.lastIndex = 0;
    if (p[0] === '.') ok = ok && el.classList.contains(p.slice(1));
    else if (p[0] === '#') ok = ok && el.id === p.slice(1);
    else if (p[0] === '[') {
      m = /\[([\w-]+)(?:="([^"]*)")?\]/.exec(p);
      ok = ok && (m[2] === undefined ? el.hasAttribute(m[1]) : el.getAttribute(m[1]) === m[2]);
    } else ok = ok && el.tagName.toLowerCase() === p.toLowerCase();
  }
  return ok;
}
function casa(el, sel) {
  return sel.split(',').some((s) => {
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
    this.parentNode = null; this.ouvintes = {}; this.hidden = false; this.innerHTML = '';
    this.offsetHeight = 100; this.rect = { left: 100, right: 200, top: 100, bottom: 120, width: 100, height: 20 };
    this.focoVisivel = false;
    const self = this;
    this.props = {};
    this.style = { setProperty: (k, v) => { self.props[k] = v; }, removeProperty: (k) => { delete self.props[k]; } };
    this.classList = {
      contains: (c) => (self.attrs.class || '').split(/\s+/).includes(c),
      add: (...cs) => cs.forEach((c) => { if (!self.classList.contains(c)) self.attrs.class = ((self.attrs.class || '') + ' ' + c).trim(); }),
      remove: (...cs) => cs.forEach((c) => { self.attrs.class = (self.attrs.class || '').split(/\s+/).filter((x) => x && x !== c).join(' '); }),
      toggle: (c, f) => { const on = f === undefined ? !self.classList.contains(c) : f; if (on) self.classList.add(c); else self.classList.remove(c); return on; },
    };
    Object.assign(this.attrs, attrs || {});
    (filhos || []).forEach((f) => this.appendChild(f));
  }
  get id() { return this.attrs.id || ''; }
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
  matches(sel) { if (sel === ':focus-visible') return this.focoVisivel; return casa(this, sel); }
  getBoundingClientRect() { return this.rect; }
  addEventListener(t, fn, opc) {
    const cap = opc === true || !!(opc && opc.capture);
    (this.ouvintes[t] = this.ouvintes[t] || []).push({ fn, cap });
  }
  focus() { amb.doc.activeElement = this; }
}
function evento(tipo, props) {
  return Object.assign({ type: tipo, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } }, props);
}
function despacha(doc, alvo, ev) {
  ev.target = alvo;
  (doc.ouvintes[ev.type] || []).filter((o) => o.cap).forEach((o) => o.fn(ev));
  for (let e = alvo; e; e = e.parentNode) (e.ouvintes[ev.type] || []).filter((o) => !o.cap || e !== doc).forEach((o) => o.fn(ev));
  return ev;
}

// relógio falso: setTimeout/rAF entram na fila e andam com avanca(ms)
function relogio() {
  let t = 0, seq = 0;
  const fila = [];
  return {
    agora: () => t,
    setTimeout: (fn, ms) => { const id = ++seq; fila.push({ id, fn, em: t + (ms || 0) }); return id; },
    clearTimeout: (id) => { const i = fila.findIndex((x) => x.id === id); if (i >= 0) fila.splice(i, 1); },
    avanca(ms) {
      const fim = t + ms;
      for (;;) {
        fila.sort((a, b) => a.em - b.em || a.id - b.id);
        if (!fila.length || fila[0].em > fim) break;
        const x = fila.shift();
        t = x.em; x.fn();
      }
      t = fim;
    }
  };
}

let amb;
function monta() {
  const rel = relogio();
  const no = new El('div', { id: 'bz-preview', class: 'bz-cartao' }); no.hidden = true;
  const g1 = new El('span', { 'data-prever': 'item-espada' });
  const g2 = new El('span', { 'data-prever': 'e:u7' });
  const g3 = new El('span', { 'data-prever': 'magia:magia-dardo' });
  const g4 = new El('span', { 'data-prever': 'item-sem-registro' });
  const dentro = new El('b');
  g1.appendChild(dentro);
  const campo = new El('input', { type: 'text' });
  const caixa = new El('input', { type: 'checkbox' });
  const drawer = new El('div', { id: 'kf-drawer' }, [new El('button')]);
  const body = new El('body', {}, [g1, g2, g3, g4, campo, caixa, drawer, no]);
  const htmlEl = new El('html', {}, [body]);
  htmlEl.clientWidth = 1366; htmlEl.clientHeight = 900;
  const doc = new El('#document', {}, [htmlEl]);
  doc.documentElement = htmlEl; doc.body = body; doc.activeElement = body;
  doc.getElementById = (id) => doc.todos().find((e) => e.id === id) || null;
  const win = new El('window');
  Object.assign(win, {
    innerWidth: 1366, innerHeight: 900,
    performance: { now: rel.agora },
    setTimeout: rel.setTimeout, clearTimeout: rel.clearTimeout,
    requestAnimationFrame: (fn) => rel.setTimeout(fn, 16),
    matchMedia: () => ({ matches: false, addEventListener() {} })
  });
  amb = { rel, no, g1, g2, g3, g4, dentro, campo, caixa, drawer, body, doc, win };
  amb.teclas = UI.criaTeclas(doc);
  amb.prever = UI.criaPrever(win, doc);
  amb.toast = UI.criaToast(doc, win);
  return amb;
}
const tecla = (a, alvo, key, extra) => despacha(a.doc, alvo || a.doc.body, evento('keydown', Object.assign({ key }, extra)));
const ponteiro = (a, tipo, alvo, extra) => despacha(a.doc, alvo, evento(tipo, Object.assign({ pointerType: 'mouse' }, extra)));

// ================================================================ KhTeclas
test('KhTeclas: atalho de uma tecla consome; fn que devolve false deixa seguir', () => {
  const a = monta();
  let n = 0;
  a.teclas.atalho('i', () => { n++; });
  a.teclas.atalho('[', () => false);
  assert.ok(tecla(a, null, 'i').defaultPrevented);
  assert.equal(n, 1);
  assert.ok(!tecla(a, null, '[').defaultPrevented);
  assert.ok(!tecla(a, null, 'x').defaultPrevented);
});

test('KhTeclas: Ctrl/Cmd/Alt barram a tecla só; Shift passa (a caixa vem no e.key)', () => {
  const a = monta();
  let n = 0;
  a.teclas.atalho('I', () => { n++; });
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }]) {
    assert.ok(!tecla(a, null, 'I', extra).defaultPrevented, JSON.stringify(extra));
  }
  assert.ok(tecla(a, null, 'I', { shiftKey: true }).defaultPrevented);
  assert.equal(n, 1);
});

test('KhTeclas: acorde Ctrl+z vale com Ctrl ou Cmd, sem Shift/Alt, sem caixa', () => {
  const a = monta();
  let n = 0;
  a.teclas.atalho('Ctrl+z', () => { n++; });
  assert.ok(tecla(a, null, 'z', { ctrlKey: true }).defaultPrevented);
  assert.ok(tecla(a, null, 'Z', { metaKey: true }).defaultPrevented);
  assert.ok(!tecla(a, null, 'z', { ctrlKey: true, shiftKey: true }).defaultPrevented);
  assert.ok(!tecla(a, null, 'z', { ctrlKey: true, altKey: true }).defaultPrevented);
  assert.ok(!tecla(a, null, 'z').defaultPrevented);
  assert.equal(n, 2);
});

test('KhTeclas: acorde Alt+<tecla> (F4.5, Alt+setas da ficha) só com Alt, sem Ctrl/Cmd/Shift; a tecla como vem no e.key', () => {
  const a = monta();
  let n = 0;
  a.teclas.atalho('Alt+ArrowLeft', () => { n++; });
  a.teclas.atalho('ArrowLeft', () => false);   // a seta só segue livre
  assert.ok(tecla(a, null, 'ArrowLeft', { altKey: true }).defaultPrevented);
  for (const extra of [{ altKey: true, shiftKey: true }, { altKey: true, ctrlKey: true }, { altKey: true, metaKey: true }, {}]) {
    assert.ok(!tecla(a, null, 'ArrowLeft', extra).defaultPrevented, JSON.stringify(extra));
  }
  assert.ok(!tecla(a, null, 'ArrowRight', { altKey: true }).defaultPrevented, 'outra tecla');
  assert.ok(!tecla(a, a.campo, 'ArrowLeft', { altKey: true }).defaultPrevented, 'campo de texto barra');
  assert.equal(n, 1);
  assert.deepEqual(a.teclas.lista().map((x) => x.tecla), ['Alt+ArrowLeft', 'ArrowLeft']);
});

test('KhTeclas: campo de texto barra o atalho (checkbox não); emCampo e quando trocam a regra', () => {
  const a = monta();
  let n = 0;
  a.teclas.atalho('i', () => { n++; });
  assert.ok(!tecla(a, a.campo, 'i').defaultPrevented, 'input de texto');
  assert.ok(tecla(a, a.caixa, 'i').defaultPrevented, 'checkbox não é campo de texto');
  a.doc.activeElement = a.campo;
  assert.ok(!tecla(a, null, 'i').defaultPrevented, 'foco no campo (activeElement) também barra');
  a.doc.activeElement = a.body;
  // o Bazar trata todo input como campo
  a.teclas.atalho('i', () => { n++; }, { emCampo: (e) => e.target.tagName === 'INPUT' });
  assert.ok(!tecla(a, a.caixa, 'i').defaultPrevented);
  a.teclas.atalho('i', () => { n++; }, { quando: (e) => !e.target.closest('#kf-drawer') });
  assert.ok(!tecla(a, a.drawer.children[0], 'i').defaultPrevented);
  assert.ok(tecla(a, null, 'i').defaultPrevented);
  assert.equal(n, 2);
  assert.equal(a.teclas.lista().length, 1, 'registrar de novo substitui');
});

test('KhTeclas: repetir:false ignora tecla segurada', () => {
  const a = monta();
  a.teclas.atalho('\\', () => {}, { repetir: false });
  assert.ok(!tecla(a, null, '\\', { repeat: true }).defaultPrevented);
  assert.ok(tecla(a, null, '\\').defaultPrevented);
});

test('KhTeclas: Esc em camadas por prioridade; a que consome para; ninguém consome, passa', () => {
  const a = monta();
  const log = [];
  a.teclas.camadaEsc(30, () => { log.push(30); return true; });
  a.teclas.camadaEsc(10, () => { log.push(10); return false; });
  a.teclas.camadaEsc(20, () => { log.push(20); return log.length > 5; });
  assert.ok(tecla(a, null, 'Escape').defaultPrevented);
  assert.deepEqual(log, [10, 20, 30]);
  const b = monta();
  b.teclas.camadaEsc(10, () => false);
  assert.ok(!tecla(b, null, 'Escape').defaultPrevented);
});

test('KhTeclas: captura roda antes da bolha e o que ela consome não chega à bolha', () => {
  const a = monta();
  const log = [];
  a.teclas.camadaEsc(0, () => { log.push('cap'); return log.length === 1; }, { fase: 'captura' });
  a.teclas.camadaEsc(10, () => { log.push('bolha'); return true; });
  assert.ok(tecla(a, null, 'Escape').defaultPrevented);
  assert.deepEqual(log, ['cap']);
  tecla(a, null, 'Escape');
  assert.deepEqual(log, ['cap', 'cap', 'bolha']);
  // evento já tratado por outro ouvinte: ninguém mexe
  a.teclas.atalho('i', () => { log.push('i'); });
  tecla(a, null, 'i', { defaultPrevented: true });
  assert.ok(!log.includes('i'));
});

// ================================================================ KhPrever
function montaPrever(opc) {
  const a = monta();
  const chamadas = [];
  a.prever.resolvedor('item', (id, alvo, chave) => {
    chamadas.push(['item', id, chave]);
    return id === 'item-sem-registro' ? null : { classe: 'bz-cartao rar-x', html: '<p>' + id + '</p>' };
  });
  a.prever.resolvedor('e', (id, alvo, chave) => { chamadas.push(['e', id, chave]); return { classe: 'bz-cartao', html: chave }; });
  a.prever.montar(a.no, Object.assign({ tipoPadrao: 'item' }, opc || {}));
  a.chamadas = chamadas;
  return a;
}

test('KhPrever: inerte até montar (nenhum ouvinte no document)', () => {
  const a = monta();
  assert.equal(a.prever.montado(), false);
  assert.equal(Object.keys(a.doc.ouvintes).filter((t) => t !== 'keydown').length, 0);
  assert.equal(a.prever.agendar(a.g1), undefined);
  assert.equal(a.prever.abrir(a.g1), false);
});

test('KhPrever: mouse parado 300ms abre, com classe, conteúdo, seta e aria-describedby', () => {
  const a = montaPrever();
  ponteiro(a, 'pointerover', a.g1);
  a.rel.avanca(299);
  assert.equal(a.prever.aberto(), false);
  a.rel.avanca(1);
  assert.equal(a.prever.aberto(), true);
  assert.equal(a.no.hidden, false);
  assert.equal(a.no.className, 'bz-cartao rar-x');
  assert.equal(a.no.innerHTML, '<p>item-espada</p>');
  assert.equal(a.g1.getAttribute('aria-describedby'), 'bz-preview');
  assert.deepEqual(a.chamadas[0], ['item', 'item-espada', 'item-espada'], 'id puro -> tipoPadrao');
  a.rel.avanca(16);   // rAF: posiciona e mostra
  assert.ok(a.no.classList.contains('vis'));
  assert.equal(a.no.getAttribute('data-seta'), 'esq');
  assert.equal(a.no.style.left, 212 + 'px', 'à direita do gatilho: right + 12');
});

test('KhPrever: movimento dentro do gatilho reinicia a espera; toque nunca abre', () => {
  const a = montaPrever();
  ponteiro(a, 'pointerover', a.g1);
  a.rel.avanca(200);
  ponteiro(a, 'pointermove', a.dentro);
  a.rel.avanca(200);
  assert.equal(a.prever.aberto(), false);
  a.rel.avanca(100);
  assert.equal(a.prever.aberto(), true);
  const b = montaPrever();
  ponteiro(b, 'pointerover', b.g1, { pointerType: 'touch' });
  b.rel.avanca(1000);
  assert.equal(b.prever.aberto(), false);
});

test('KhPrever: saída do ponteiro fecha com fade e arma o modo quente (reabre em 0)', () => {
  const a = montaPrever();
  ponteiro(a, 'pointerover', a.g1);
  a.rel.avanca(316);
  ponteiro(a, 'pointerout', a.g1, { relatedTarget: a.body });
  a.rel.avanca(80);
  assert.equal(a.prever.aberto(), false);
  assert.ok(a.no.classList.contains('sai'));
  assert.equal(a.g1.getAttribute('aria-describedby'), null, 'descrição sai com o pop-up');
  a.rel.avanca(80);
  assert.equal(a.no.hidden, true);
  ponteiro(a, 'pointerover', a.g2);
  assert.equal(a.prever.aberto(), true, 'fechou há < 400ms: abre na hora');
  assert.equal(a.no.innerHTML, 'e:u7');
  assert.deepEqual(a.chamadas.at(-1), ['e', 'u7', 'e:u7'], '"tipo:id" vai ao resolvedor do tipo');
});

test('KhPrever: resolvedor que devolve null, ou tipo sem resolvedor, não abre', () => {
  const a = montaPrever();
  ponteiro(a, 'pointerover', a.g4);
  a.rel.avanca(400);
  assert.equal(a.prever.aberto(), false);
  ponteiro(a, 'pointerover', a.g3);
  a.rel.avanca(400);
  assert.equal(a.prever.aberto(), false);
  assert.equal(a.no.hidden, true);
});

test('KhPrever: clique fecha na hora e bloqueia o gatilho até o ponteiro sair', () => {
  const a = montaPrever();
  ponteiro(a, 'pointerover', a.g1);
  a.rel.avanca(316);
  ponteiro(a, 'pointerdown', a.g1);
  assert.equal(a.prever.aberto(), false);
  assert.equal(a.no.hidden, true);
  ponteiro(a, 'pointerover', a.g1);
  a.rel.avanca(1000);
  assert.equal(a.prever.aberto(), false, 'bloqueado');
  ponteiro(a, 'pointerout', a.g1, { relatedTarget: a.body });
  ponteiro(a, 'pointerover', a.g1);
  a.rel.avanca(300);
  assert.equal(a.prever.aberto(), true);
});

test('KhPrever: foco visível abre em 500ms com a descrição no focado; focusout fecha', () => {
  const a = montaPrever();
  a.g1.focoVisivel = true;
  despacha(a.doc, a.g1, evento('focusin', {}));
  a.rel.avanca(499);
  assert.equal(a.prever.aberto(), false);
  a.rel.avanca(1);
  assert.equal(a.prever.aberto(), true);
  despacha(a.doc, a.g1, evento('focusout', {}));
  assert.equal(a.prever.aberto(), false);
  // foco de mouse (sem :focus-visible) não abre
  const b = montaPrever();
  despacha(b.doc, b.g1, evento('focusin', {}));
  b.rel.avanca(1000);
  assert.equal(b.prever.aberto(), false);
});

test('KhPrever: gatilhoFoco liga um foco que não é gatilho (linha da Lista -> célula Nome)', () => {
  const a = montaPrever({ gatilhoFoco: (t) => (t === a.campo ? a.g2 : null) });
  a.campo.focoVisivel = true;
  despacha(a.doc, a.campo, evento('focusin', {}));
  a.rel.avanca(500);
  assert.equal(a.prever.gatilho(), a.g2);
  assert.equal(a.campo.getAttribute('aria-describedby'), 'bz-preview', 'descrição no elemento focado');
  assert.equal(a.g2.getAttribute('aria-describedby'), null);
});

test('KhPrever: xPreferido e aoPosicionar são das regiões de quem monta', () => {
  let visto = null;
  const a = montaPrever({ xPreferido: () => 500, aoPosicionar: (n) => { visto = n; } });
  a.prever.abrir(a.g1);
  a.rel.avanca(16);
  assert.equal(a.no.style.left, '500px');
  assert.equal(visto, a.no);
  // sem espaço à direita nem à esquerda: centraliza abaixo, seta para cima
  const b = montaPrever({ xPreferido: () => 2000 });
  b.g1.rect = { left: 10, right: 20, top: 100, bottom: 120, width: 10, height: 20 };
  b.prever.abrir(b.g1);
  b.rel.avanca(16);
  assert.equal(b.no.getAttribute('data-seta'), 'cima');
  assert.equal(b.no.style.top, '132px');
});

test('KhPrever: o motor não consome o Esc (é de quem monta); fechar() some na hora', () => {
  const a = montaPrever();
  a.prever.abrir(a.g1);
  assert.ok(!tecla(a, null, 'Escape').defaultPrevented);
  assert.equal(a.prever.aberto(), true);
  assert.equal(a.prever.fechar(), true);
  assert.equal(a.no.hidden, true);
  assert.equal(a.prever.fechar(), false, 'já fechado');
});

test('KhPrever: aria-describedby anterior do gatilho é preservado e devolvido', () => {
  const a = montaPrever();
  a.g1.setAttribute('aria-describedby', 'outra');
  a.prever.abrir(a.g1);
  assert.equal(a.g1.getAttribute('aria-describedby'), 'outra bz-preview');
  a.prever.fechar();
  assert.equal(a.g1.getAttribute('aria-describedby'), 'outra');
});

// ================================================================ KhToast
test('KhToast: mostra com Desfazer, escapa o texto, some sozinho e devolve o foco', () => {
  const a = monta();
  const el = new El('div', { id: 'bz-toast', class: 'bz-toast' });
  a.body.appendChild(el);
  let devolveu = 0;
  const t = a.toast.criar(el, { ms: 6000, classeBotao: 'bz-toast-btn', aoPerderFoco: () => { devolveu++; } });
  t.mostrar('Removido: <Lança>', { desfazer: true });
  assert.ok(el.classList.contains('on'));
  assert.equal(el.innerHTML, '<span>Removido: &lt;Lança&gt;</span> · <button type="button" class="bz-toast-btn" ' +
    'data-toast-desfazer title="Desfazer (Ctrl+Z)" aria-keyshortcuts="Control+Z">Desfazer</button>');
  a.rel.avanca(5999);
  assert.ok(el.classList.contains('on'));
  const btn = new El('button'); el.appendChild(btn); a.doc.activeElement = btn;
  a.rel.avanca(1);
  assert.ok(!el.classList.contains('on'));
  assert.equal(el.innerHTML, '');
  assert.equal(devolveu, 1, 'foco estava no toast');
  a.doc.activeElement = a.body;
  t.mostrar('Desfeito', { ms: 2000 });
  assert.equal(el.innerHTML, '<span>Desfeito</span>');
  t.mostrar('Movido', { desfazer: true });   // o novo reinicia o prazo
  a.rel.avanca(2000);
  assert.ok(el.classList.contains('on'));
  a.rel.avanca(4000);
  assert.ok(!el.classList.contains('on'));
  assert.equal(devolveu, 1, 'foco fora do toast: não mexe');
});
