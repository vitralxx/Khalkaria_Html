'use strict';
// Regressão do Export/Import da ficha pelos botões do drawer (Bazar v3, §5.2,
// §5.6 e §5.8). Diferente de ficha-estado.test.js, aqui o init() RODA: o
// drawer é montado sobre um DOM falso tolerante, e os testes clicam nos
// botões "Exportar JSON", "Importar JSON" e "Exportar p/ Bestiário" como o
// jogador faria. O arquivo baixado é capturado no Blob.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'ficha.js'), 'utf8');
const FIX = path.join(__dirname, 'fixtures');
const ler = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n), 'utf8'));
const LS = 'khalkaria_ficha';
const CAT = ler('catalogo-mini.json');
const esperaFetch = () => new Promise((r) => setImmediate(r));
const puro = (x) => JSON.parse(JSON.stringify(x));

// Elemento falso que aceita qualquer operação de DOM que o drawer faça.
function criaDom() {
  const criados = [];
  function lista(arr) {
    arr.forEach = Array.prototype.forEach;
    arr.item = (i) => arr[i] || null;
    return arr;
  }
  function elemento(tag) {
    const attrs = {}, ouv = {};
    const e = {
      tagName: String(tag || 'div').toUpperCase(), nodeType: 1, className: '', textContent: '',
      innerHTML: '', value: '', checked: false, disabled: false, hidden: false, files: [],
      style: { setProperty() {}, removeProperty() {} }, dataset: {}, children: [], childNodes: [],
      parentElement: null, parentNode: null, ownerDocument: null,
      classList: {
        _s: new Set(),
        add(...c) { c.forEach((x) => this._s.add(x)); },
        remove(...c) { c.forEach((x) => this._s.delete(x)); },
        toggle(c, f) { const on = f === undefined ? !this._s.has(c) : !!f; if (on) this._s.add(c); else this._s.delete(c); return on; },
        contains(c) { return this._s.has(c); }
      },
      _attrs: attrs, _ouv: ouv,
      setAttribute(k, v) { attrs[k] = String(v); },
      getAttribute(k) { return k in attrs ? attrs[k] : null; },
      hasAttribute(k) { return k in attrs; },
      removeAttribute(k) { delete attrs[k]; },
      toggleAttribute(k, f) { const on = f === undefined ? !(k in attrs) : !!f; if (on) attrs[k] = ''; else delete attrs[k]; return on; },
      addEventListener(t, f) { (ouv[t] = ouv[t] || []).push(f); },
      removeEventListener() {},
      dispatchEvent(ev) { (ouv[ev.type] || []).forEach((f) => f(ev)); return true; },
      appendChild(c) { if (c && typeof c === 'object') { c.parentElement = e; c.parentNode = e; e.children.push(c); } return c; },
      insertBefore(c) { return e.appendChild(c); },
      append(...cs) { cs.forEach((c) => e.appendChild(c)); },
      prepend(...cs) { cs.forEach((c) => e.appendChild(c)); },
      replaceChildren(...cs) { e.children = []; cs.forEach((c) => e.appendChild(c)); },
      removeChild(c) { return c; },
      remove() {},
      replaceWith() {},
      querySelector() { return null; },
      querySelectorAll() { return lista([]); },
      closest() { return null; },
      matches() { return false; },
      contains() { return false; },
      focus() {}, blur() {}, select() {}, scrollIntoView() {},
      click() { e.dispatchEvent({ type: 'click', target: e, preventDefault() {}, stopPropagation() {} }); },
      getBoundingClientRect() { return { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }; }
    };
    criados.push(e);
    return e;
  }
  return { elemento, criados, lista };
}

function pagina(storage, arquivoImport) {
  const dom = criaDom();
  const baixados = [], fetches = [];
  const bodyEl = dom.elemento('body');
  bodyEl.hasAttribute = () => false;
  const document = {
    readyState: 'complete', currentScript: null, activeElement: null, visibilityState: 'visible',
    body: bodyEl, head: dom.elemento('head'), documentElement: dom.elemento('html'),
    querySelector: () => null, querySelectorAll: () => dom.lista([]), getElementById: () => null,
    createElement: (t) => dom.elemento(t),
    createTextNode: (t) => ({ nodeType: 3, textContent: t }),
    createDocumentFragment: () => dom.elemento('fragment'),
    addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return true; }
  };
  class Blob { constructor(partes) { this.texto = partes.join(''); } }
  class FileReader {
    readAsText(f) { this.result = f.texto; this.onload && this.onload(); }
  }
  const sandbox = {
    document, localStorage: storage, CustomEvent, console, Blob, FileReader,
    URL: { createObjectURL: (b) => { baixados.push(JSON.parse(b.texto)); return 'blob:x'; }, revokeObjectURL() {} },
    setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: (f) => f(),
    MutationObserver: class { observe() {} disconnect() {} },
    fetch: (url) => { fetches.push(url); return Promise.resolve({ ok: true, json: () => Promise.resolve(puro(CAT)) }); },
    confirm: () => true, alert() {},
    addEventListener() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox, { filename: 'ficha.js' });
  const botao = (title) => {
    const b = dom.criados.find((e) => e.tagName === 'BUTTON' && e.getAttribute('title') === title);
    assert.ok(b, 'botão do drawer "' + title + '" existe');
    return b;
  };
  return {
    KF: sandbox.KF, baixados, botao, fetches,
    guardado: () => JSON.parse(storage.getItem(LS)),
    importar(obj) {
      botao('Importar JSON').click();
      // o importJSON cria o input[type=file] e clica nele: o último input criado
      const inp = dom.criados.filter((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'file').pop();
      assert.ok(inp, 'input de arquivo criado');
      inp.files = [{ texto: JSON.stringify(obj) }];
      inp.dispatchEvent({ type: 'change', target: inp });
    }
  };
}

function armazenamento(inicial) {
  const m = new Map(Object.entries(inicial || {}));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}

test('export nativo sai em schemaVersion 2.0, com exportadoEm e inventário em duas colunas', () => {
  const p = pagina(armazenamento());
  p.KF.adicionar({ avulso: true, nome: 'Corda velha' }, { qtd: 2 });
  p.botao('Exportar JSON').click();
  assert.equal(p.baixados.length, 1);
  const f = p.baixados[0];
  assert.equal(f.schemaVersion, '2.0');
  assert.ok(f.exportadoEm, 'exportadoEm preenchido');
  assert.deepEqual(Object.keys(f.inventario).sort(), ['bugigangas', 'equipamentos', 'sins']);
  assert.equal(f.inventario.armas, undefined);
  assert.equal(f.inventario.materiais, undefined);
  assert.equal(f.inventario.bugigangas[0].nome, 'Corda velha');
  assert.equal(f.inventario.bugigangas[0].qtd, 2);
  // KF.exportar() (rodapé do inventário) é o mesmo caminho
  p.KF.exportar();
  assert.equal(p.baixados[1].schemaVersion, '2.0');
});

test('import de ficha v1 migra para 2.0: listas velhas dobradas nas duas colunas', () => {
  const v1 = ler('ficha-v1.json');
  const esperada = ler('ficha-v2-esperada.json');
  const p = pagina(armazenamento());
  p.importar(v1);
  const g = p.guardado();
  assert.equal(g.schemaVersion, '2.0');
  assert.ok(g.migradoEm, 'migradoEm preenchido');
  assert.equal(g.inventario.armas, undefined);
  assert.equal(g.inventario.materiais, undefined);
  const nomes = (l) => l.map((e) => e.nome + ' x' + e.qtd).sort();
  assert.deepEqual(nomes(g.inventario.bugigangas), nomes(esperada.inventario.bugigangas));
  assert.deepEqual(nomes(g.inventario.equipamentos), nomes(esperada.inventario.equipamentos));
  assert.equal(g.inventario.sins, esperada.inventario.sins);
  // o export seguinte já sai 2.0
  p.botao('Exportar JSON').click();
  assert.equal(p.baixados.pop().schemaVersion, '2.0');
});

test('export Bestiário: type npc, prof_* e weapons só com a arma (sem armadura)', async () => {
  const v1 = ler('ficha-v1.json');
  const p = pagina(armazenamento());
  p.importar(v1);
  // import fora do Bazar com entradas sem inv pede o catálogo na hora (uma vez)
  assert.equal(p.fetches.length, 1);
  await esperaFetch();
  p.botao('Exportar p/ Bestiário').click();
  const b = p.baixados.pop();
  assert.equal(b.type, 'npc');
  const PROF = ['attack', 'defend', 'movement', 'fortitude', 'will', 'reflexes', 'perception', 'survival',
    'stealth', 'crime', 'initiative', 'knowledge', 'medicine', 'investigation', 'religion', 'mystic',
    'persuasion', 'intimidation', 'insight', 'deception', 'motivate', 'craft'].map((s) => 'prof_' + s);
  PROF.forEach((k) => assert.ok(k in b, 'chave ' + k));
  assert.ok('craft_attr' in b);
  ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom',
    'health_max', 'stamina_max', 'ether_max', 'evasion', 'movement', 'armor',
    'resistances', 'immunities', 'abilities'].forEach((k) => assert.ok(k in b, 'chave ' + k));
  assert.deepEqual(puro(b.weapons), ler('bestiario-armas-esperado.json'));
  // nada do inventário não-arma nem Sins vaza para o export
  assert.equal(b.inventario, undefined);
  assert.equal(b.sins, undefined);
});
