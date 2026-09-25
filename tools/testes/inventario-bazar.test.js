'use strict';
// Parte pura do js/bazar-inventario.js (spec do Bazar v3, §4.2, §4.5 e §4.10):
// leitura de "11 flecha" no combobox, ordem dos resultados, agrupamento das
// colunas e o texto do lembrete de exportação. No node o arquivo exporta só
// essas funções e para antes de tocar no DOM.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const P = require(path.join(__dirname, '..', '..', 'js', 'bazar-inventario.js'));

test('combobox: quantidade antes ou depois do nome', () => {
  assert.deepEqual(P.interpretaBusca('11 flecha'), { n: 11, termo: 'flecha' });
  assert.deepEqual(P.interpretaBusca('11x flecha'), { n: 11, termo: 'flecha' });
  assert.deepEqual(P.interpretaBusca('11× flecha'), { n: 11, termo: 'flecha' });
  assert.deepEqual(P.interpretaBusca('11 x flecha'), { n: 11, termo: 'flecha' });
  assert.deepEqual(P.interpretaBusca('flecha x11'), { n: 11, termo: 'flecha' });
  assert.deepEqual(P.interpretaBusca('flecha x 11'), { n: 11, termo: 'flecha' });
  assert.deepEqual(P.interpretaBusca('  Chave do Farol '), { n: null, termo: 'Chave do Farol' });
  assert.deepEqual(P.interpretaBusca('11 xamã'), { n: 11, termo: 'xamã' });
  assert.equal(P.interpretaBusca('0 flecha').n, null);           // zero não existe
  assert.equal(P.interpretaBusca('99999 flecha').n, null);       // mais de 4 dígitos não é quantidade
});

test('combobox: começa com, depois contém, sem acento, no máximo 8', () => {
  const itens = ['Virotes/Flechas', 'Flechas Gélidas', 'Arco Longo', 'Flecha Sombria', 'Aljava de Flechas']
    .map((nome) => ({ nome }));
  const r = P.busca(itens, 'flech', 8).map((x) => x.nome);
  assert.deepEqual(r, ['Flecha Sombria', 'Flechas Gélidas', 'Aljava de Flechas', 'Virotes/Flechas']);
  assert.deepEqual(P.busca(itens, 'gelidas', 8).map((x) => x.nome), ['Flechas Gélidas']);
  assert.deepEqual(P.busca(itens, 'flechas gel', 8).map((x) => x.nome), ['Flechas Gélidas']);
  assert.deepEqual(P.busca(itens, 'sombria flecha', 8).map((x) => x.nome), ['Flecha Sombria']);
  assert.deepEqual(P.busca(itens, 'f', 8), []);                 // começa com 2 caracteres
  const muitos = Array.from({ length: 20 }, (_, i) => ({ nome: 'Poção ' + String(i).padStart(2, '0') }));
  assert.equal(P.busca(muitos, 'pocao', 8).length, 8);
});

test('colunas: grupos na ordem do pedido, nome estável dentro do grupo', () => {
  const bug = [
    { uid: 'a', nome: 'Kali', categoria: 'Material' },
    { uid: 'b', nome: 'Virotes/Flechas', categoria: 'Munição' },
    { uid: 'c', nome: 'Chave do Farol', avulso: true },
    { uid: 'd', nome: 'Estilhaços do Abismo', categoria: 'Arma, Munição' },
    { uid: 'e', nome: 'Couro de Caça', categoria: 'Material' },
    { uid: 'f', nome: 'Cota Solta', categoria: 'Armadura' },
    { uid: 'g', nome: 'Poção de Cura', categoria: 'Consumível' }
  ];
  const g = P.agrupa(bug, 'bugigangas');
  assert.deepEqual(g.map((x) => x.nome), ['Consumível', 'Munição', 'Material', 'Arma', 'Armadura', 'Sem registro']);
  assert.deepEqual(g[2].itens.map((x) => x.uid), ['e', 'a']);
  const eq = [
    { uid: 'x', nome: 'Espada Curta', categoria: 'Arma' },
    { uid: 'y', nome: 'Cota de Malha', categoria: 'Armadura', equipado: true },
    { uid: 'z', nome: 'Cota de Malha', categoria: 'Armadura' }
  ];
  const ge = P.agrupa(eq, 'equipamentos');
  assert.deepEqual(ge.map((x) => x.nome), ['Equipado', 'Carregado']);
  assert.deepEqual(ge[1].itens.map((x) => x.uid), ['z', 'x']);
  // mesma chave de nome: fica a ordem original (nada pula quando a quantidade muda)
  const iguais = [{ uid: '2', nome: 'Kali', categoria: 'Material' }, { uid: '1', nome: 'Kali', categoria: 'Material' }];
  assert.deepEqual(P.agrupa(iguais, 'bugigangas')[0].itens.map((x) => x.uid), ['2', '1']);
});

test('rodapé: lembrete de exportação fica âmbar depois de 7 dias', () => {
  const agora = Date.parse('2026-09-25T12:00:00Z');
  assert.deepEqual(P.textoExport('', agora), { txt: 'Ficha nunca exportada', velha: true });
  assert.deepEqual(P.textoExport('2026-09-25T08:00:00Z', agora), { txt: 'Ficha exportada hoje', velha: false });
  assert.deepEqual(P.textoExport('2026-09-24T08:00:00Z', agora), { txt: 'Ficha exportada há 1 dia', velha: false });
  assert.deepEqual(P.textoExport('2026-09-18T08:00:00Z', agora), { txt: 'Ficha exportada há 7 dias', velha: false });
  assert.deepEqual(P.textoExport('2026-09-13T08:00:00Z', agora), { txt: 'Ficha exportada há 12 dias', velha: true });
});
