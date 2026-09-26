'use strict';
// Guarda contra aba velha (F0, ficha v2.1). Com o marcador localStorage
// 'khalkaria_ficha_dono' = 'v3' (no load ou pelo evento storage) a ficha v2
// fica só-leitura: faixa com "Baixar ficha v3 (.json)" e "Voltar a usar a v2",
// e NENHUMA escrita no storage (nem pelo Bazar via KF). A mera existência de
// 'khalkaria_ficha_v3' não trava nada. importJSON recusa schemaVersion >= 3.
//
// O init() roda (readyState 'complete') sobre um DOM falso tolerante, como em
// export-import.test.js; aqui o window guarda os ouvintes para disparar
// 'storage' e 'pagehide', e os timers ficam na mão (debounce do save()).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'ficha.js'), 'utf8');
const FIX = path.join(__dirname, 'fixtures');
const ler = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n), 'utf8'));
const CAT = ler('catalogo-mini.json');
const LS = 'khalkaria_ficha';
const DONO = 'khalkaria_ficha_dono';
const V3 = 'khalkaria_ficha_v3';
const BACKUP = 'khalkaria_ficha_v1_backup';
const MSG_RO = 'Ficha migrada para a v3. Recarregue a página.';
const puro = (x) => JSON.parse(JSON.stringify(x));
const item = (nome) => puro(CAT.find((x) => x.nome === nome));

// storage que conta toda escrita (setItem/removeItem/clear)
function armazenamento(inicial) {
  const m = new Map(Object.entries(inicial || {}));
  const st = {
    m, escritas: [],
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { st.escritas.push(['set', k]); m.set(k, String(v)); },
    removeItem: (k) => { st.escritas.push(['remove', k]); m.delete(k); },
    foto: () => JSON.stringify([...m.entries()].sort())
  };
  return st;
}

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

function pagina(storage) {
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
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(puro(CAT)) }),
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

// uma ficha v2 gravada por uma aba anterior
function fichaV2(st) {
  const p = pagina(st);
  p.KF.adicionar(item('Virotes/Flechas'), { qtd: 5 });
  return JSON.parse(st.getItem(LS));
}

test('marcador v3 no load: só-leitura, faixa com os dois botões e nenhuma escrita', () => {
  const st = armazenamento();
  fichaV2(st);
  st.setItem(DONO, 'v3');
  st.setItem(V3, JSON.stringify({ schemaVersion: '3.0', meta: { nome: 'Borin Três' } }));
  const antes = st.foto();
  st.escritas.length = 0;
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(p.faixas().length, 1, 'faixa desenhada no drawer');
  assert.ok(p.temBotao('Baixar ficha v3 (.json)'));
  assert.ok(p.temBotao('Voltar a usar a v2'));
  assert.ok(p.toasts().includes(MSG_RO));
  // todos os caminhos de escrita do KF (os que o Bazar usa)
  const uid = p.KF.inventario().bugigangas[0].uid;
  assert.equal(p.KF.adicionar(item('Kali'), { qtd: 3 }), null);
  assert.deepEqual(puro(p.KF.quantidade(uid, 9)), { ok: false, erro: 'somente-leitura' });
  assert.deepEqual(puro(p.KF.alternar(uid, 'empilhavel')), { ok: false, erro: 'somente-leitura' });
  assert.deepEqual(puro(p.KF.mover(uid, 'equipamentos')), { ok: false, erro: 'somente-leitura' });
  assert.equal(p.KF.remover(uid), false);
  assert.equal(p.KF.definirSins(99), 0);
  let rodou = false;
  p.KF.lote(() => { rodou = true; return p.KF.adicionar(item('Kali')); });
  assert.equal(rodou, false, 'lote nem roda a função');
  assert.equal(p.KF.desfazer(), false);
  assert.equal(p.KF.podeDesfazer(), false);
  p.KF.catalogo(puro(CAT));      // reconciliação não grava
  p.KF.abrir('inventario');      // abrir o drawer não grava khalkaria_ficha_open
  p.win('pagehide'); p.rodaTimers();
  assert.deepEqual(st.escritas, [], 'nenhuma escrita no storage');
  assert.equal(st.foto(), antes);
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 5, 'nem a memória muda');
  // o export nativo baixa a v2 como está, sem carimbar exportadoEm
  p.botao('Exportar JSON').click();
  assert.equal(p.baixados.pop().inventario.bugigangas[0].qtd, 5);
  assert.deepEqual(st.escritas, []);
});

test('v1 no storage com marcador v3: nada de backup nem de migração gravada', () => {
  const raw = JSON.stringify(ler('ficha-v1.json'));
  const st = armazenamento({ [LS]: raw, [DONO]: 'v3' });
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(st.getItem(LS), raw);
  assert.equal(st.getItem(BACKUP), null);
  assert.deepEqual(st.escritas, []);
  // mas a ficha é lida (migrada só na memória) para mostrar
  assert.equal(p.KF.inventario().sins, 37);
});

test('só a chave khalkaria_ficha_v3 (sem marcador) não trava nada', () => {
  const st = armazenamento({ [V3]: JSON.stringify({ schemaVersion: '3.0' }) });
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), false);
  assert.equal(p.faixas().length, 0);
  assert.ok(p.KF.adicionar(item('Kali'), { qtd: 2 }));
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 2);
  // marcador com outro valor também não trava
  st.setItem(DONO, 'v2');
  p.win('storage', { key: DONO, newValue: 'v2' });
  assert.equal(p.KF.somenteLeitura(), false);
});

test('marcador chega pelo evento storage: entra em só-leitura, descarta o debounce; apagar volta ao normal', () => {
  const st = armazenamento();
  const p = pagina(st);
  assert.ok(p.KF.adicionar(item('Kali'), { qtd: 2 }));
  const revAntes = JSON.parse(st.getItem(LS)).rev;
  // campo digitado no drawer fica no debounce de 200ms (Nome é o 1º input de texto)
  const nome = p.dom.criados.find((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'text');
  nome.value = 'Digitado tarde';
  nome.dispatchEvent({ type: 'input', target: nome });
  assert.equal(p.KF.nome(), 'Digitado tarde');
  // outra aba (a v3) grava o marcador
  st.setItem(DONO, 'v3');
  st.escritas.length = 0;
  p.win('storage', { key: DONO, newValue: 'v3' });
  // o próprio evento troca o modo (antes de qualquer chamada ao KF)
  assert.equal(p.faixas().length, 1);
  const ev = p.eventos.filter((e) => e.tipo === 'kf:mudou').pop();
  assert.deepEqual(ev.detail.partes, ['tudo']);
  assert.equal(ev.detail.op, 'somente-leitura');
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(p.KF.adicionar(item('Kali')), null);
  p.win('pagehide'); p.rodaTimers();
  assert.deepEqual(st.escritas, [], 'nem o debounce nem o pagehide gravam');
  assert.equal(JSON.parse(st.getItem(LS)).rev, revAntes);
  assert.equal(JSON.parse(st.getItem(LS)).meta.nome, '');
  // "Voltar a usar a v2": apaga só o marcador; a chave v3 (se houver) fica
  st.setItem(V3, '{"schemaVersion":"3.0"}');
  st.escritas.length = 0;
  p.botao('Voltar a usar a v2').click();
  assert.deepEqual(st.escritas, [['remove', DONO]]);
  assert.equal(st.getItem(V3), '{"schemaVersion":"3.0"}');
  assert.equal(p.KF.somenteLeitura(), false);
  assert.ok(p.KF.adicionar(item('Kali')), 'grava de novo');
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 3);
});

test('marcador apagado por outra aba (evento storage): esta volta ao normal e relê a v2', () => {
  const st = armazenamento();
  fichaV2(st);
  st.setItem(DONO, 'v3');
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), true);
  st.removeItem(DONO);
  p.win('storage', { key: DONO, oldValue: 'v3', newValue: null });
  assert.equal(p.eventos.filter((e) => e.tipo === 'kf:mudou').pop().detail.op, 'leitura-escrita');
  assert.equal(p.KF.somenteLeitura(), false);
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 5);
  assert.ok(p.KF.adicionar(item('Virotes/Flechas')));
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 6);
});

test('marcador gravado sem evento (aba em segundo plano): a próxima escrita confere e não grava', () => {
  const st = armazenamento();
  const p = pagina(st);
  st.setItem(DONO, 'v3');
  st.escritas.length = 0;
  assert.equal(p.KF.adicionar(item('Kali')), null);
  assert.deepEqual(st.escritas, []);
  assert.equal(p.KF.somenteLeitura(), true);
});

test('"Baixar ficha v3 (.json)" baixa o conteúdo de khalkaria_ficha_v3', () => {
  const v3 = { schemaVersion: '3.0', meta: { nome: 'Borin Três' }, qualquer: [1, 2] };
  const st = armazenamento({ [DONO]: 'v3', [V3]: JSON.stringify(v3) });
  const p = pagina(st);
  p.botao('Baixar ficha v3 (.json)').click();
  assert.deepEqual(p.baixados.pop(), v3);
  const nome = p.dom.criados.filter((e) => e.tagName === 'A').pop().getAttribute('download');
  assert.equal(nome, 'Borin_Três.v3.khalkaria.json');
  assert.deepEqual(st.escritas, []);
  // sem a chave v3: avisa e não baixa nada
  st.m.delete(V3);
  p.botao('Baixar ficha v3 (.json)').click();
  assert.equal(p.baixados.length, 0);
  assert.equal(p.toasts().pop(), 'Não há ficha v3 salva neste navegador');
});

test('importJSON recusa schemaVersion >= 3 com toast e não toca em nada', () => {
  const st = armazenamento();
  const p = pagina(st);
  p.KF.adicionar(item('Kali'), { qtd: 2 });
  const antes = st.foto();
  ['3.0', 3, '3.1', '10.0'].forEach((sv) => {
    p.importar({ schemaVersion: sv, meta: { nome: 'Da v3' }, inventario: { sins: 5, bugigangas: [], equipamentos: [] } });
    assert.match(p.toasts().pop(), /é da v3 \(schemaVersion /);
    assert.equal(st.foto(), antes, 'schemaVersion ' + sv);
  });
  assert.equal(p.KF.nome(), '');
  // 2.0 e 1.0 continuam entrando
  p.importar({ schemaVersion: '2.0', meta: { nome: 'Da v2' }, inventario: { sins: 5, bugigangas: [], equipamentos: [] } });
  assert.equal(p.KF.nome(), 'Da v2');
});

test('em só-leitura o botão Importar nem abre o seletor de arquivo', () => {
  const st = armazenamento({ [DONO]: 'v3' });
  const p = pagina(st);
  assert.equal(p.importar({ schemaVersion: '2.0', meta: { nome: 'X' } }), false);
  assert.equal(p.toasts().pop(), MSG_RO);
  assert.deepEqual(st.escritas, []);
});

test('em só-leitura os controles do drawer ficam desabilitados, menos os da faixa', () => {
  const st = armazenamento({ [DONO]: 'v3' });
  const p = pagina(st);
  const ctl = p.dom.criados.filter((e) => ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.tagName) &&
    !e.hasAttribute('data-kf-ro') && e.parentElement && e.getAttribute('type') !== 'file');
  const noCorpo = ctl.filter((e) => { let n = e; while (n.parentElement) { if (n.getAttribute('id') === 'kf-body') return true; n = n.parentElement; } return false; });
  assert.ok(noCorpo.length > 20, 'há controles no corpo do drawer');
  assert.deepEqual(noCorpo.filter((e) => !e.disabled).map((e) => e.tagName), []);
  assert.equal(p.botao('Voltar a usar a v2').disabled, false);
});
