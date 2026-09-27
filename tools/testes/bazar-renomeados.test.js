'use strict';
// Id renomeado do Bazar (data/bazar-renomeados.json): nome corrigido no CSV muda
// o id (slug do nome), e a ficha salva com o id antigo não pode ficar órfã.
// O gerador grava idsAntigos/nomesAntigos no item atual; o KhInv.indexar os
// resolve e o reconciliar troca id e nome pelos atuais, sem perder quantidade,
// equipado, sintonizado nem a seção escolhida pelo jogador.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const K = require('../../js/ficha.js');

const RAIZ = path.join(__dirname, '..', '..');
const BAZAR = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'bazar.json'), 'utf8'));
const MAPA = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'bazar-renomeados.json'), 'utf8')).renomeados;
const IDX = K.indexar(BAZAR);
const ANTIGO = 'item-elixir-da-expurgao';
const NOVO = 'item-elixir-da-expurgacao';
const AGORA = '2026-09-27T12:00:00.000Z';

test('bazar.json: todo id antigo do mapa sumiu do catálogo e está no item novo', () => {
  const ids = new Set(BAZAR.map((it) => it.id));
  Object.keys(MAPA).forEach((a) => {
    assert.equal(ids.has(a), false, a + ' ainda é id do catálogo');
    const novo = BAZAR.find((it) => (it.idsAntigos || []).includes(a));
    assert.ok(novo, a + ' sem item atual');
    assert.equal(novo.id, MAPA[a].novo);
    if (MAPA[a].nomeAntigo) assert.ok((novo.nomesAntigos || []).includes(MAPA[a].nomeAntigo));
  });
  const el = BAZAR.find((it) => it.id === NOVO);
  assert.equal(el.nome, 'Elixir da Expurgação');
  assert.deepEqual(el.idsAntigos, [ANTIGO]);
  assert.deepEqual(el.nomesAntigos, ['Elixir da Expurgão']);
});

test('indexar: id e nome antigos resolvem para o item atual; o atual vence', () => {
  assert.equal(IDX.porId[ANTIGO].id, NOVO);
  assert.equal(IDX.porNome['Elixir da Expurgão'].id, NOVO);
  assert.equal(IDX.porId[NOVO].id, NOVO);
  // um id antigo que colide com um id atual não rouba a entrada
  const cat = [{ id: 'item-a', nome: 'A' }, { id: 'item-b', nome: 'B', idsAntigos: ['item-a'], nomesAntigos: ['A'] }];
  const ix = K.indexar(cat);
  assert.equal(ix.porId['item-a'].nome, 'A');
  assert.equal(ix.porNome.A.id, 'item-a');
});

test('ficha salva com o id antigo: reconcilia para o novo sem perder qtd/equipado/sintonizado', () => {
  const usados = {};
  const velho = { id: ANTIGO, nome: 'Elixir da Expurgão', categoria: 'Consumível', raridade: 'Exótico',
    efeito: 'Remove 1 Marca da Vhelor. Não funciona acima da Marca 4.', valor: '5d12+180', inv: { slot: 'bugiganga' } };
  const inv = {
    sins: 12,
    bugigangas: [
      K.normalizaEntrada(Object.assign({}, velho, { uid: 'u-livre', qtd: 3 }), usados),
      K.normalizaEntrada(Object.assign({}, velho, { uid: 'u-sint', qtd: 1, sintonizado: true }), usados),
      // entrada livre do item já com o id novo (outra aba já no site novo): funde com a antiga
      K.normalizaEntrada(Object.assign(K.entradaDeItem(IDX.porId[NOVO]), { uid: 'u-nova', qtd: 2 }), usados),
    ],
    equipamentos: [
      K.normalizaEntrada(Object.assign({}, velho, { uid: 'u-eq', qtd: 1, equipado: true, equipadoEm: AGORA, secaoManual: true }), usados),
    ],
  };
  // antes: o id antigo contaria como item à parte
  assert.equal(K.quantidadePorId(inv)[ANTIGO], 5);

  assert.equal(K.reconciliar(inv, IDX.porId, IDX.porNome), true);

  const todas = inv.bugigangas.concat(inv.equipamentos);
  assert.ok(todas.every((e) => e.id === NOVO && e.nome === 'Elixir da Expurgação' && e.orfao === false));
  const livre = inv.bugigangas.filter((e) => !e.sintonizado);
  assert.equal(livre.length, 1, 'as duas livres viraram uma');
  assert.equal(livre[0].uid, 'u-livre', 'a primeira livre recebe a soma');
  assert.equal(livre[0].qtd, 5);
  const sint = inv.bugigangas.find((e) => e.uid === 'u-sint');
  assert.equal(sint.sintonizado, true); assert.equal(sint.qtd, 1);
  const eq = inv.equipamentos[0];
  assert.equal(eq.uid, 'u-eq'); assert.equal(eq.equipado, true); assert.equal(eq.equipadoEm, AGORA);
  assert.equal(eq.secaoManual, true); assert.equal(eq.qtd, 1);
  assert.deepEqual(K.quantidadePorId(inv), { [NOVO]: 7 });
  assert.equal(inv.sins, 12);

  // segunda passada não muda nada
  assert.equal(K.reconciliar(inv, IDX.porId, IDX.porNome), false);
});

test('ficha salva só com o nome antigo (sem id): casa pelo nome antigo', () => {
  const inv = { sins: 0, bugigangas: [K.normalizaEntrada({ nome: 'Elixir da Expurgão', qtd: 2 })], equipamentos: [] };
  assert.equal(K.reconciliar(inv, IDX.porId, IDX.porNome), true);
  assert.equal(inv.bugigangas[0].id, NOVO);
  assert.equal(inv.bugigangas[0].nome, 'Elixir da Expurgação');
  assert.equal(inv.bugigangas[0].qtd, 2);
});
