'use strict';
// Empilhável é dado do build (F0): o KhInv decide por inv.empilhavel do item de
// data/bazar.json e não lê o texto do Efeito quando há inv. A regex do KhInv
// fica só como legado da entrada sem inv (v1 migrada, card sem catálogo).
// O resultado sobre o catálogo real não muda: 85 empilháveis (ESPERADO do
// tools/gerar_bazar.py), o mesmo conjunto que a frase do Efeito dava.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const K = require('../../js/ficha.js');

const BAZAR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'bazar.json'), 'utf8'));
const FRASE = 'Empilhável: pesa 1 bugiganga a cada 10 unidades.';
const ids = (l) => new Set(l.map((x) => x.id));
const diff = (a, b) => [...a].filter((x) => !b.has(x)).sort();

test('catálogo real: todo item tem inv (o build sempre emite)', () => {
  assert.ok(BAZAR.length > 0);
  const sem = BAZAR.filter((it) => !it.inv || typeof it.inv !== 'object').map((it) => it.nome);
  assert.deepEqual(sem, []);
});

test('catálogo real: 85 empilháveis, mesmo conjunto de inv.empilhavel e da frase (por conjunto, sem duplicata)', () => {
  const porInv = BAZAR.filter((it) => it.inv.empilhavel === true);
  const porKhInv = BAZAR.filter((it) => K.normalizaEntrada(K.entradaDeItem(it)).empilhavelRegistro === true);
  const porTexto = BAZAR.filter((it) => K.empilhavelPorTexto(it.efeito));
  assert.equal(porInv.length, 85);
  assert.equal(porKhInv.length, 85);
  assert.equal(ids(porKhInv).size, 85, 'ids distintos');
  const a = ids(porKhInv), b = ids(porInv), c = ids(porTexto);
  assert.deepEqual({ so_khinv: diff(a, b), so_inv: diff(b, a) }, { so_khinv: [], so_inv: [] });
  assert.deepEqual({ so_khinv: diff(a, c), so_texto: diff(c, a) }, { so_khinv: [], so_texto: [] });
  // a entrada nasce com a caixa igual ao registro
  BAZAR.forEach((it) => {
    const e = K.normalizaEntrada(K.entradaDeItem(it));
    assert.equal(e.empilhavel, it.inv.empilhavel === true, it.nome);
  });
});

test('catálogo real: carga de 11 unidades bate com o registro (2 se empilhável, 11 se não)', () => {
  BAZAR.forEach((it) => {
    const inv = { sins: 0, bugigangas: [], equipamentos: [] };
    const r = K.mesclar(inv, it, { qtd: 11 });
    const peso = K.calcular(inv, 10).pesoPorUid[r.uid];
    const esperado = it.inv.ocupa === false ? 0 : (it.inv.empilhavel ? 2 : 11);
    assert.equal(peso, esperado, it.nome);
  });
});

test('com inv, o texto não decide: inv.empilhavel vence a frase nos dois sentidos', () => {
  const comFraseSemFlag = { id: 'x-a', nome: 'A', categoria: 'Material', efeito: FRASE, inv: { slot: 'bugiganga' } };
  const semFraseComFlag = { id: 'x-b', nome: 'B', categoria: 'Material', efeito: 'Nada aqui.', inv: { slot: 'bugiganga', empilhavel: true } };
  assert.equal(K.empilhavelDe(comFraseSemFlag), false);
  assert.equal(K.empilhavelDe(semFraseComFlag), true);
  assert.equal(K.normalizaEntrada(K.entradaDeItem(comFraseSemFlag)).empilhavelRegistro, false);
  assert.equal(K.normalizaEntrada(K.entradaDeItem(semFraseComFlag)).empilhavelRegistro, true);
  // coluna: com inv, é o slot (uma Arma com a frase e slot equipamento fica em Equipamentos)
  assert.equal(K.colunaCanonica({ categoria: 'Arma', efeito: FRASE, inv: { slot: 'equipamento' } }), 'equipamentos');
});

test('reconciliação: o registro novo vem de inv.empilhavel, não do texto do snapshot', () => {
  const inv = { sins: 0, bugigangas: [], equipamentos: [] };
  // snapshot antigo sem inv, com a frase: pelo legado, empilhável
  inv.bugigangas.push(K.normalizaEntrada({ id: 'x-c', nome: 'C', categoria: 'Material', efeito: FRASE, qtd: 11 }));
  assert.equal(inv.bugigangas[0].empilhavelRegistro, true);
  // o catálogo diz que não é (mesmo com a frase no Efeito)
  const cat = K.indexar([{ id: 'x-c', nome: 'C', categoria: 'Material', efeito: FRASE, inv: { slot: 'bugiganga' } }]);
  assert.equal(K.reconciliar(inv, cat.porId, cat.porNome), true);
  assert.equal(inv.bugigangas[0].empilhavelRegistro, false);
  assert.equal(inv.bugigangas[0].empilhavel, false, 'o jogador não tinha divergido: acompanha o registro');
  assert.equal(K.calcular(inv, 10).bugigangas.usado, 11);
});

test('legado sem inv: a frase ainda decide até a reconciliação (v1 migrada)', () => {
  assert.equal(K.empilhavelDe({ efeito: FRASE }), true);
  assert.equal(K.empilhavelDe({ efeito: 'Não é empilhável: pesa 1 bugiganga a cada 10 unidades' }), false);
  assert.equal(K.empilhavelDe({ efeito: FRASE, inv: null }), true);
});
