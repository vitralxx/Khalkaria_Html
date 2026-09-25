'use strict';
// Parte pura do js/bazar.js: ordem do catálogo por coluna da Lista.
// Defeito coberto: Categoria, Efeito, Obtenção, Região e Ofício eram clicáveis
// e ganhavam aria-sort, mas ordenar() caía no else e ordenava por nome.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ARQ = path.join(__dirname, '..', '..', 'js', 'bazar.js');
const B = require(ARQ);

const itens = [
  { nome: 'Cota de Malha', categoria: 'Armadura', efeito: 'Armadura 3', obtencao: 'Loja', regiao: 'Terras Livres', craft: 'Ferraria', cd: 14, _rar: 1, _valor: 50 },
  { nome: 'Poção de Cura', categoria: 'Consumível', efeito: 'Cura 2d4', obtencao: 'Drop CR 1', regiao: '', unico: false, craft: 'Alquimia', cd: 10, _rar: 1, _valor: 10 },
  { nome: 'Adaga', categoria: 'Arma', efeito: '', obtencao: 'Loja', regiao: 'Abismo', craft: 'Ferraria', cd: null, _rar: 0, _valor: 5 },
  { nome: 'Chave do Farol', categoria: 'Bugiganga', efeito: 'Abre o farol', obtencao: 'Quest', regiao: '', unico: true, craft: 'Não-craftável', cd: null, _rar: 2, _valor: 0 }
];
const nomes = (k, dir, regs) => itens.slice().sort(B.comparador(k, dir, regs)).map((x) => x.nome);

test('toda coluna clicável da Lista tem ordem própria', () => {
  const src = fs.readFileSync(ARQ, 'utf8');
  const bloco = src.match(/var COLS = \[([\s\S]*?)\];/);
  assert.ok(bloco, 'COLS não encontrado em js/bazar.js');
  const chaves = [...bloco[1].matchAll(/\['([a-z]+)'/g)].map((m) => m[1]);
  const tratadas = ['nome', 'raridade', 'valor', 'cd'].concat(B.COLS_TEXTO);
  assert.deepEqual(chaves.filter((k) => !tratadas.includes(k)), []);
});

test('colunas de texto ordenam pelo texto, vazio no fim, nome desempata', () => {
  assert.deepEqual(nomes('categoria', 1), ['Adaga', 'Cota de Malha', 'Chave do Farol', 'Poção de Cura']);
  assert.deepEqual(nomes('categoria', -1), ['Poção de Cura', 'Chave do Farol', 'Cota de Malha', 'Adaga']);
  assert.deepEqual(nomes('efeito', 1), ['Chave do Farol', 'Cota de Malha', 'Poção de Cura', 'Adaga']);
  assert.deepEqual(nomes('obtencao', 1), ['Poção de Cura', 'Adaga', 'Cota de Malha', 'Chave do Farol']);
  assert.deepEqual(nomes('craft', 1), ['Poção de Cura', 'Adaga', 'Cota de Malha', 'Chave do Farol']);
});

test('região: ordem do vocabulário, Único/Quest, depois sem região', () => {
  const regs = ['Terras Livres', 'Abismo'];
  assert.deepEqual(nomes('regiao', 1, regs), ['Cota de Malha', 'Adaga', 'Chave do Farol', 'Poção de Cura']);
  assert.deepEqual(nomes('regiao', -1, regs), ['Poção de Cura', 'Chave do Farol', 'Adaga', 'Cota de Malha']);
});

test('chaves antigas continuam iguais', () => {
  assert.deepEqual(nomes('nome', 1), ['Adaga', 'Chave do Farol', 'Cota de Malha', 'Poção de Cura']);
  assert.deepEqual(nomes('raridade', 1), ['Adaga', 'Cota de Malha', 'Poção de Cura', 'Chave do Farol']);
  assert.deepEqual(nomes('valor', 1), ['Chave do Farol', 'Adaga', 'Poção de Cura', 'Cota de Malha']);
  assert.deepEqual(nomes('cd', 1), ['Poção de Cura', 'Cota de Malha', 'Adaga', 'Chave do Farol']);
  assert.deepEqual(nomes('desconhecida', 1), nomes('nome', 1));
});
