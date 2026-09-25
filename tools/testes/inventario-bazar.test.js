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

// Achado de revisão: raridade e inv.recipiente de uma entrada importada (ou de
// um drop text/plain de fora) chegavam crus ao innerHTML das linhas.
test('segurança: raridade e recipiente importados não quebram o HTML da linha', () => {
  const K = require(path.join(__dirname, '..', '..', 'js', 'ficha.js'));
  const mal = 'x"><img src=x onerror=alert(document.domain)>';
  const e = K.normalizaEntrada({ uid: 'u1', id: 'nao-existe', nome: 'Isca', raridade: mal,
    inv: { recipiente: '3"><img src=x onerror=alert(2)>' } }, {});
  assert.equal(e.raridade, mal);                        // a ficha preserva o dado (import tolerante)
  const cls = P.classeRar(e.raridade);
  assert.match(cls, /^rar-[a-z0-9-]+$/);
  assert.equal(P.seloRecipienteHTML(e.inv), '');        // recipiente não numérico: sem selo
  // as raridades reais seguem casando com as classes do css/bazar.css
  assert.equal(P.classeRar('Ordinário'), 'rar-ordinario');
  assert.equal(P.classeRar('Exótico'), 'rar-exotico');
  assert.equal(P.classeRar('Luxária'), 'rar-luxaria');
  assert.equal(P.classeRar(''), 'rar-ordinario');
  assert.match(P.seloRecipienteHTML({ recipiente: 50 }), /Armazena até 50 Bugigangas/);
  assert.match(P.seloRecipienteHTML({ recipiente: '12' }), /Armazena até 12 Bugigangas/);
  assert.equal(P.seloRecipienteHTML({ recipiente: 0 }), '');
  assert.equal(P.seloRecipienteHTML(null), '');
  assert.equal(P.escHTML('"<a>&\''), '&quot;&lt;a&gt;&amp;&#39;');
});

test('atalho: com Caps Lock, "I" sem Shift foca o combobox; Shift+I alterna o trilho', () => {
  assert.equal(P.acaoTeclaI({ key: 'i', shiftKey: false }), 'combobox');
  assert.equal(P.acaoTeclaI({ key: 'I', shiftKey: false }), 'combobox');   // Caps Lock
  assert.equal(P.acaoTeclaI({ key: 'I', shiftKey: true }), 'trilho');
});
