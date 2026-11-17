'use strict';
// Portão dos itens do Bazar na ficha (diagnóstico de 2026-11-16, 03 §16): cada um dos
// 727 itens vai para uma ficha de teste pelo gatilho da tabela do balanceamento, e o
// KhRegras é conferido. Se um item que hoje chega ao número deixar de chegar, o build cai.
// A conferência é a mesma do relatório (tools/diagnostico/itens-na-ficha.js).
const test = require('node:test');
const assert = require('node:assert/strict');
const { diagnosticar } = require('../diagnostico/itens-na-ficha.js');

const linhas = diagnosticar();

test('os 727 itens da tabela avaliam sem erro', () => {
  assert.equal(linhas.length, 727);
  assert.deepEqual(linhas.filter((x) => x.erro).map((x) => x.nome + ': ' + x.erro), []);
});

test('toda arma que não é Foco gera a linha de ataque', () => {
  const T = require('../../data/balanceamento/ficha-efeitos-itens.json').tabela;
  const sem = linhas.filter((x) => x.temArma && !T[x.id].gatilhos.equipar.foco && !(x.verificado && x.verificado.arma));
  assert.deepEqual(sem.map((x) => x.nome), []);
});

test('todo Mod passivo de número chega ativo à ficha (sem condicional e sem escolha)', () => {
  const faltam = linhas.filter((x) => x.faltam > 0).map((x) => `${x.nome}: ${x.esperados.join(', ')}`);
  assert.deepEqual(faltam, []);
});
