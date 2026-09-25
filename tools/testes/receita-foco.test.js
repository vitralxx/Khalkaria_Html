'use strict';
// Parte pura do js/bazar-receita.js: para onde o foco volta quando o painel de
// receita fecha. O DOM entra injetado (vivo, linhaInv, card, reservas, focavel).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const P = require(path.join(__dirname, '..', '..', 'js', 'bazar-receita.js'));

// nó falso: { nome, vivo, focavel }
const no = (nome, vivo = true, focavel = true) => ({ nome, vivo, focavel });
function consulta({ linhas = {}, cards = {}, reservas = [] } = {}) {
  return {
    vivo: (el) => el.vivo,
    linhaInv: (uid) => linhas[uid] || null,
    card: (id) => cards[id] || null,
    reservas,
    focavel: (el) => el.vivo && el.focavel
  };
}

test('foco de volta: o nó de origem, se ainda está no documento', () => {
  const li = no('li-original');
  const q = consulta({ linhas: { u1: no('li-nova') }, cards: { kali: no('card') } });
  assert.equal(P.alvoRetorno({ id: 'kali', el: li, uid: 'u1' }, q), li);
});

test('foco de volta: linha do inventário redesenhada (mesmo uid) antes do card do catálogo', () => {
  const velha = no('li-velha', false);                   // saiu do DOM no kf:mudou
  const nova = no('li-nova');
  const q = consulta({ linhas: { u1: nova }, cards: { kali: no('card') }, reservas: [no('busca')] });
  assert.equal(P.alvoRetorno({ id: 'kali', el: velha, uid: 'u1' }, q).nome, 'li-nova');
});

test('foco de volta: sem a linha (item saiu do inventário), vai ao card; sem card, à busca', () => {
  const velha = no('li-velha', false);
  const busca = no('busca');
  assert.equal(P.alvoRetorno({ id: 'kali', el: velha, uid: 'u1' },
    consulta({ cards: { kali: no('card') }, reservas: [busca] })).nome, 'card');
  assert.equal(P.alvoRetorno({ id: 'kali', el: velha, uid: 'u1' },
    consulta({ reservas: [busca] })), busca);
});

test('foco de volta: pula candidato invisível (registro em display:none no estado amplo)', () => {
  const card = no('card', true, false);                  // .bz-registro escondido
  const busca = no('busca', true, false);                // idem
  const cb = no('combobox');
  const q = consulta({ cards: { kali: card }, reservas: [busca, null, cb, no('amplo')] });
  assert.equal(P.alvoRetorno({ id: 'kali', el: null, uid: '' }, q), cb);
});

test('foco de volta: linha do inventário escondida (trilho) cai nas reservas visíveis', () => {
  const q = consulta({
    linhas: { u1: no('li', true, false) },
    reservas: [no('busca')]
  });
  assert.equal(P.alvoRetorno({ id: 'x', el: null, uid: 'u1' }, q).nome, 'busca');
});

test('foco de volta: nada focável devolve null', () => {
  assert.equal(P.alvoRetorno({ id: 'x' }, consulta({ reservas: [no('a', true, false)] })), null);
  assert.equal(P.alvoRetorno(null, consulta()), null);
});
