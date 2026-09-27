'use strict';
// Contrato da API window.KF v2 (plano §3.1): o Bazar (js/bazar*.js) depende dela
// e ela não muda enquanto a ficha é reorganizada (F2 em diante). São 23 funções
// + `versao` ('2'); a assinatura (nome, tipo e aridade) fica congelada aqui.
// Também guarda o que a modularização da F2a promete: js/ficha.js é um arquivo
// só (artefato da concatenação de js/ficha/*.js), no node devolve o KhInv e não
// toca em window/document, e no navegador expõe window.KhInv e window.KF.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const RAIZ = path.join(__dirname, '..', '..');
const SRC = fs.readFileSync(path.join(RAIZ, 'js', 'ficha.js'), 'utf8');

// [nome, aridade] das funções; `versao` à parte. Ordem = ordem de Object.keys.
const CONTRATO = [
  ['inventario', 0], ['carga', 0], ['projetar', 2], ['quantidadePorId', 0], ['tenho', 1],
  ['atributo', 1], ['migradoEm', 0], ['exportadoEm', 0], ['nome', 0],
  ['adicionar', 2], ['quantidade', 2], ['alternar', 2], ['trocar', 3], ['mover', 2],
  ['remover', 1], ['definirSins', 1], ['lote', 1], ['desfazer', 0], ['podeDesfazer', 0],
  ['somenteLeitura', 0], ['catalogo', 1], ['abrir', 1], ['exportar', 0]
];

function pagina() {
  const st = new Map(), eventos = [];
  const document = {
    readyState: 'loading', currentScript: null, activeElement: null, visibilityState: 'visible',
    body: { hasAttribute: () => false, appendChild() {} }, head: { appendChild() {} },
    querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
    createElement: () => ({ setAttribute() {}, appendChild() {} }),
    addEventListener() {},
    dispatchEvent(ev) { eventos.push({ tipo: ev.type, detail: JSON.parse(JSON.stringify(ev.detail)) }); return true; }
  };
  const sandbox = {
    document, CustomEvent, URL, console,
    localStorage: { getItem: (k) => (st.has(k) ? st.get(k) : null), setItem: (k, v) => st.set(k, String(v)), removeItem: (k) => st.delete(k) },
    setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: (f) => f(),
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
    addEventListener() {}
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox, { filename: 'ficha.js' });
  return { win: sandbox, eventos };
}

test('KF v2: exatamente versao + as 23 funções do contrato, congelada', () => {
  const { win } = pagina();
  const KF = win.KF;
  assert.ok(KF, 'window.KF existe');
  assert.ok(Object.isFrozen(KF), 'KF congelada');
  assert.equal(KF.versao, '2');
  assert.deepEqual(Object.keys(KF), ['versao'].concat(CONTRATO.map((c) => c[0])));
  CONTRATO.forEach(([nome, n]) => {
    assert.equal(typeof KF[nome], 'function', nome + ' é função');
    assert.equal(KF[nome].length, n, nome + ' tem aridade ' + n);
  });
});

test('KF existe antes do init e kf:pronta sai uma vez com {versao:"2"}', () => {
  const { eventos } = pagina();
  const prontas = eventos.filter((e) => e.tipo === 'kf:pronta');
  assert.equal(prontas.length, 1);
  assert.deepEqual(prontas[0].detail, { versao: '2' });
});

test('o Bazar reconhece a KF (bazar.js aceita só versao "2")', () => {
  const bz = fs.readFileSync(path.join(RAIZ, 'js', 'bazar.js'), 'utf8');
  assert.match(bz, /function kf\(\) \{ var k = window\.KF; return k && k\.versao === '2' \? k : null; \}/);
  const { win } = pagina();
  ['adicionar', 'carga', 'catalogo', 'inventario', 'tenho'].forEach((m) => {
    assert.equal(typeof win.KF[m], 'function', 'KF.' + m + ' que o Bazar chama');
  });
});

test('navegador: window.KhInv é o mesmo motor que o node carrega', () => {
  const { win } = pagina();
  const noNode = require(path.join(RAIZ, 'js', 'ficha', 'kh-inv.js'));
  assert.ok(win.KhInv, 'window.KhInv existe');
  assert.deepEqual(Object.keys(win.KhInv).sort(), Object.keys(noNode).sort());
});

test('node: js/ficha.js (artefato) devolve o KhInv da fonte e não cria window/KF', () => {
  const art = require(path.join(RAIZ, 'js', 'ficha.js'));
  const fonte = require(path.join(RAIZ, 'js', 'ficha', 'kh-inv.js'));
  assert.deepEqual(Object.keys(art).sort(), Object.keys(fonte).sort());
  assert.equal(art.REGRAS.FRASE_EMPILHA, fonte.REGRAS.FRASE_EMPILHA);
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.KF, 'undefined');
});

test('artefato: js/ficha.js começa pelo cabeçalho de gerado e traz as fontes do ORDEM', () => {
  assert.match(SRC, /^\/\* js\/ficha\.js — ARTEFATO gerado — não editar\./);
  const ordem = fs.readFileSync(path.join(RAIZ, 'js', 'ficha', 'ORDEM'), 'utf8')
    .split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  assert.ok(ordem.length >= 2);
  let pos = -1;
  ordem.forEach((n) => {
    const i = SRC.indexOf('// ==== js/ficha/' + n + ' ====');
    assert.ok(i > pos, n + ' no artefato, na ordem do ORDEM');
    pos = i;
  });
});
