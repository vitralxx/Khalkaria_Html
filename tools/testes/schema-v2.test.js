'use strict';
// Schema v2 mínimo (F0): data/ficha.schema.json concorda com o js/ficha.js e
// com as regras confirmadas. Ae nas resistências; Religião em SAB; Empilhável
// 10:1 com munição incluída (o texto vencido de 20:1 saiu); prof_* do Bestiário
// como grau 0-4 (KhInv.grauPericia); atributo de arma pode ser ''.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const K = require('../../js/ficha.js');
const RAIZ = path.join(__dirname, '..', '..');
const SCHEMA = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'ficha.schema.json'), 'utf8'));
const SRC = fs.readFileSync(path.join(RAIZ, 'js', 'ficha.js'), 'utf8');

// linhas ['slug','Rótulo','prof_x','attr'] da tabela PERICIAS do ficha.js
function periciasDoJs() {
  const m = /var PERICIAS = \[([\s\S]*?)\n  \];/.exec(SRC);
  assert.ok(m, 'tabela PERICIAS no ficha.js');
  const out = {};
  const re = /\['([a-z]+)','[^']+','(prof_[a-z]+)','([^']*)'\]/g;
  let r;
  while ((r = re.exec(m[1]))) out[r[1]] = { prof: r[2], attr: r[3] };
  return out;
}

test('resistências: 12 tipos, cada um com R, I e ae (Armadura Específica)', () => {
  const res = SCHEMA.properties.resistencias;
  assert.equal(res.propertyNames.enum.length, 12);
  const linha = res.patternProperties['^.*$'].properties;
  assert.deepEqual(Object.keys(linha).sort(), ['I', 'R', 'ae']);
  assert.equal(linha.ae.type, 'integer');
  assert.equal(linha.ae.default, 0);
  assert.match(SRC, /f\.resistencias\[r\[0\]\] = \{ R:false, I:false, ae:0 \}/, 'novaFicha grava ae');
});

test('perícias: schema e ficha.js iguais (x-prof e atributo); Religião é SAB', () => {
  const js = periciasDoJs();
  const sch = SCHEMA.properties.pericias.properties;
  assert.deepEqual(Object.keys(js).sort(), Object.keys(sch).sort());
  Object.keys(sch).forEach((k) => {
    assert.equal(js[k].prof, sch[k]['x-prof'], k);
    const xa = sch[k]['x-attr'];
    if (/^(for|des|con|int|sab)$/.test(xa || '')) assert.equal(js[k].attr, xa, k);
  });
  assert.equal(sch.religiao['x-attr'], 'sab');
  assert.equal(js.religiao.attr, 'sab');
});

test('inventário: Empilhável 10:1 com munição incluída; nada de 20:1', () => {
  const txt = JSON.stringify(SCHEMA);
  assert.doesNotMatch(txt, /20:1/);
  assert.match(SCHEMA.properties.inventario.description, /munição incluída/);
  assert.match(SCHEMA.properties.inventario.description, /10:1/);
  assert.equal(K.REGRAS.PILHA, 10);
});

test('Bestiário: prof_* é grau = floor(bônus / 2) entre 0 e 4', () => {
  const casos = [[0, 0], [2, 1], [4, 2], [6, 3], [8, 4], [3, 1], [9, 4], [10, 4], [-2, 0], [undefined, 0], [null, 0], ['6', 3], ['x', 0]];
  casos.forEach(([bonus, grau]) => assert.equal(K.grauPericia(bonus), grau, String(bonus)));
  assert.match(SCHEMA['x-bestiary']['pericias.*'], /GRAU 0-4/);
});

test('arma: atributo aceita vazio (sem fonte) e o export não fixa Força', () => {
  assert.deepEqual(SCHEMA.$defs.arma.properties.atributo.enum, ['', 'Força', 'Destreza']);
  const inv = { sins: 0, bugigangas: [], equipamentos: [] };
  K.mesclar(inv, { id: 'x-arma', nome: 'Lança', categoria: 'Arma', arquetipo: 'Pesada Perfurante', efeito: '', inv: { slot: 'equipamento' } });
  assert.equal(K.armasBestiario(inv)[0].atributo, '');
});
