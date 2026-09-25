'use strict';
// Parte pura do js/bazar.js: a linha Arquétipo dos filtros agrupa os valores do
// vocabulário por família. Todo arquétipo do vocabulário tem de aparecer uma
// vez só (nada escondido atrás de "+N", nada caindo em "Outros"), e o rótulo
// curto do segmento tem de ser um pedaço do valor completo (data-v).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..', '..');
const B = require(path.join(RAIZ, 'js', 'bazar.js'));

function vocab() {
  const html = fs.readFileSync(path.join(RAIZ, 'pages', 'bazar.html'), 'utf8');
  const m = html.match(/window\.BZ_VOCAB = (\{[\s\S]*?\});<\/script>/);
  assert.ok(m, 'BZ_VOCAB não encontrado em pages/bazar.html');
  return JSON.parse(m[1]);
}

const V = vocab();
const fams = B.familiasArq(V);
const valores = fams.flatMap((f) => f.itens.map((x) => x.v));

test('as famílias cobrem exatamente os arquétipos do vocabulário', () => {
  const esperado = new Set([].concat(V.chassis || [], V.focos || [], V.slots || [], V.municoes || []).filter(Boolean));
  const obtido = new Set(valores);
  assert.deepEqual([...esperado].filter((v) => !obtido.has(v)), [], 'só no vocabulário');
  assert.deepEqual([...obtido].filter((v) => !esperado.has(v)), [], 'só nas famílias');
});

test('nenhum arquétipo aparece em duas famílias', () => {
  const cont = {};
  valores.forEach((v) => { cont[v] = (cont[v] || 0) + 1; });
  assert.deepEqual(Object.keys(cont).filter((v) => cont[v] > 1), []);
});

test('nada cai na família "outros"', () => {
  const outros = fams.find((f) => f.id === 'outros');
  assert.equal(outros, undefined, outros ? 'em outros: ' + outros.itens.map((x) => x.v).join(', ') : '');
});

test('todo rótulo curto está contido no valor completo', () => {
  fams.forEach((f) => f.itens.forEach((x) => {
    assert.ok(x.rot && x.v.includes(x.rot), `rot "${x.rot}" fora de "${x.v}"`);
  }));
});

test('ordem das famílias é fixa e famílias vazias saem', () => {
  const ordem = ['leve', 'pesada', 'distancia', 'marcial', 'foco', 'armadura', 'outros'];
  const ids = fams.map((f) => f.id);
  assert.deepEqual(ids, ordem.filter((id) => ids.includes(id)));
  assert.ok(fams.every((f) => f.itens.length > 0));
  assert.deepEqual(B.familiasArq({}), []);
});
