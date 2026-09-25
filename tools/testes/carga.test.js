'use strict';
// Testes do motor KhInv (js/ficha.js). Casos de borda da spec do Bazar v3, §6.
// Rodar: node --test tools/testes/carga.test.js   (o build.py roda sozinho)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const K = require('../../js/ficha.js');

const FIX = path.join(__dirname, 'fixtures');
const ler = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n), 'utf8'));
const CAT = ler('catalogo-mini.json');
const IDX = K.indexar(CAT);
const item = (nome) => {
  const it = IDX.porNome[nome];
  if (!it) throw new Error('fora do catálogo-mini: ' + nome);
  return JSON.parse(JSON.stringify(it));
};
const vazio = () => ({ sins: 0, bugigangas: [], equipamentos: [] });
const semUid = (x) => JSON.parse(JSON.stringify(x, (k, v) => (k === 'uid' ? undefined : v)));
const AGORA = '2026-09-25T12:00:00.000Z';

// adiciona e devolve o uid
const add = (inv, nome, qtd, coluna) => K.mesclar(inv, item(nome), { qtd, coluna }).uid;
const avulsos = (inv, n, coluna) => K.mesclar(inv, { avulso: true, nome: 'Pedra' }, { qtd: n, coluna }).uid;

test('carregar ficha.js no node não toca em window/document/localStorage', () => {
  assert.equal(typeof globalThis.window, 'undefined');
  assert.equal(typeof globalThis.document, 'undefined');
  assert.equal(typeof globalThis.localStorage, 'undefined');
  assert.equal(typeof globalThis.KF, 'undefined');
  assert.equal(typeof K.calcular, 'function');
  assert.equal(K.REGRAS.FRASE_EMPILHA, 'Empilhável: pesa 1 bugiganga a cada 10 unidades');
});

test('tokens e colunaCanonica: token exato, nunca substring', () => {
  assert.deepEqual(K.tokens('Material, Consumível'), ['Material', 'Consumível']);
  assert.deepEqual(K.tokens(''), []);
  assert.equal(K.colunaCanonica(item('Armadura de Couro')), 'equipamentos');
  assert.equal(K.colunaCanonica(item('Adaga de Kali')), 'equipamentos');
  assert.equal(K.colunaCanonica(item('Kali')), 'bugigangas');
  assert.equal(K.colunaCanonica(item('Estilhaços do Abismo')), 'bugigangas');
  // sem inv: pela categoria, e empilhável por texto vai para Bugigangas
  assert.equal(K.colunaCanonica({ categoria: 'Armadura', efeito: '' }), 'equipamentos');
  assert.equal(K.colunaCanonica({ categoria: 'Arma', efeito: 'Empilhável: pesa 1 bugiganga a cada 10 unidades.' }), 'bugigangas');
  assert.equal(K.colunaCanonica({ categoria: 'Armadilha', efeito: '' }), 'bugigangas');
  assert.equal(K.colunaCanonica({ avulso: true, nome: 'Chave do Farol' }), 'bugigangas');
  assert.equal(K.empilhavelPorTexto('Não é empilhável: pesa 1 bugiganga a cada 10 unidades'), false);
});

test('capacidade por FOR (mínimo 1 na base)', () => {
  const casos = [[10, 10, 2], [1, 5, 1], [3, 6, 1], [7, 8, 1], [14, 12, 4], [0, 5, 1], ['', 5, 1], [undefined, 5, 1], [null, 5, 1]];
  for (const [F, bug, eq] of casos) {
    const c = K.calcular(vazio(), F);
    assert.equal(c.bugigangas.max, bug, 'bug FOR ' + F);
    assert.equal(c.equipamentos.max, eq, 'eq FOR ' + F);
  }
  const c = K.calcular(vazio(), 10);
  assert.equal(c.bugigangas.usado, 0);
  assert.equal(c.equipamentos.usado, 0);
  assert.equal(c.bugigangas.estado, 'ok');
  assert.equal(c.equipamentos.estado, 'ok');
  assert.equal(c.condicao, 'nenhuma');
  assert.equal(c.pesoTotal, 0);
  assert.equal(K.modFor(7), -2);
  assert.equal(K.modFor(15), 2);
});

test('Sins nunca entram na conta', () => {
  const a = vazio(); const b = vazio(); b.sins = 99999;
  add(a, 'Kali', 3); add(b, 'Kali', 3);
  assert.deepEqual(semUid(K.calcular(a, 10)).bugigangas, semUid(K.calcular(b, 10)).bugigangas);
});

test('empilhável: Virotes/Flechas 1,10 → 1; 11,20 → 2; 21 → 3', () => {
  for (const [q, p] of [[1, 1], [10, 1], [11, 2], [20, 2], [21, 3]]) {
    const inv = vazio(); const uid = add(inv, 'Virotes/Flechas', q);
    const c = K.calcular(inv, 10);
    assert.equal(c.bugigangas.usado, p, q + ' unidades');
    assert.equal(c.pesoPorUid[uid], p);
    assert.equal(c.motivoPorUid[uid], 'pilha');
  }
});

test('empilhável: desmarcar a caixa faz 11 pesarem 11', () => {
  const inv = vazio(); const uid = add(inv, 'Virotes/Flechas', 11);
  assert.deepEqual(K.alternar(inv, uid, 'empilhavel'), { ok: true, uid });
  const c = K.calcular(inv, 10);
  assert.equal(c.bugigangas.usado, 11);
  assert.equal(c.motivoPorUid[uid], 'unidade');
  assert.equal(inv.bugigangas[0].empilhavelRegistro, true, 'o registro não muda');
});

test('empilhável: 5 Virotes/Flechas + 5 Flechas Gélidas pesam 2 (cada item arredonda sozinho)', () => {
  const inv = vazio(); add(inv, 'Virotes/Flechas', 5); add(inv, 'Flechas Gélidas', 5);
  assert.equal(K.calcular(inv, 10).bugigangas.usado, 2);
});

test('empilhável: Estilhaços do Abismo qtd 11 vão para Bugigangas e pesam 2', () => {
  const inv = vazio(); const r = K.mesclar(inv, item('Estilhaços do Abismo'), { qtd: 11 });
  assert.equal(r.coluna, 'bugigangas');
  const c = K.calcular(inv, 10);
  assert.equal(c.bugigangas.usado, 2);
  assert.equal(c.equipamentos.usado, 0);
});

test('empilhável: Tocha (x2) conta pacotes; 10 pacotes pesam 1, 11 pesam 2', () => {
  const inv = vazio(); const uid = add(inv, 'Tocha (x2)', 10);
  assert.equal(K.calcular(inv, 10).bugigangas.usado, 1);
  K.quantidade(inv, uid, 11);
  assert.equal(K.calcular(inv, 10).bugigangas.usado, 2);
});

test('empilhável: pilha do mesmo id em duas entradas soma antes de arredondar', () => {
  const inv = vazio(); const a = add(inv, 'Kali', 6); const b = add(inv, 'Kali', 6, 'equipamentos');
  // colunas diferentes = grupos diferentes
  const c = K.calcular(inv, 10);
  assert.equal(c.pesoPorUid[a], 1); assert.equal(c.pesoPorUid[b], 1);
  // mesma coluna: entradas avulsas simuladas com o mesmo id (estado importado)
  const inv2 = vazio(); const e1 = K.normalizaEntrada(Object.assign(K.entradaDeItem(item('Kali')), { qtd: 6 }));
  const e2 = K.normalizaEntrada(Object.assign(K.entradaDeItem(item('Kali')), { qtd: 6 }));
  inv2.bugigangas.push(e1, e2);
  const c2 = K.calcular(inv2, 10);
  assert.equal(c2.bugigangas.usado, 2);
  assert.equal(c2.pesoPorUid[e1.uid], 2); assert.equal(c2.pesoPorUid[e2.uid], 0);
});

test('equipado: armadura equipada pesa 0; carregada pesa 1', () => {
  const inv = vazio(); const uid = add(inv, 'Armadura de Couro', 1);
  assert.equal(K.calcular(inv, 10).equipamentos.usado, 1);
  const r = K.alternar(inv, uid, 'equipado', AGORA);
  assert.equal(r.ok, true);
  const c = K.calcular(inv, 10);
  assert.equal(c.equipamentos.usado, 0);
  assert.equal(c.motivoPorUid[uid], 'equipado');
  assert.equal(inv.equipamentos[0].equipadoEm, AGORA);
});

test('equipado: equipar com qtd 3 dá duas entradas (2 carregadas, peso 2; 1 equipada, peso 0)', () => {
  const inv = vazio(); const uid = add(inv, 'Adaga de Kali', 3);
  const r = K.alternar(inv, uid, 'equipado', AGORA);
  assert.equal(r.ok, true);
  assert.notEqual(r.uid, uid);
  assert.equal(inv.equipamentos.length, 2);
  const [eq, carr] = inv.equipamentos;   // a equipada fica logo antes
  assert.equal(eq.uid, r.uid); assert.equal(eq.qtd, 1); assert.equal(eq.equipado, true);
  assert.equal(carr.uid, uid); assert.equal(carr.qtd, 2); assert.equal(carr.equipado, false);
  const c = K.calcular(inv, 10);
  assert.equal(c.pesoPorUid[eq.uid], 0); assert.equal(c.pesoPorUid[carr.uid], 2);
  assert.equal(c.equipamentos.usado, 2);
  // desequipar funde de volta
  const d = K.alternar(inv, r.uid, 'equipado', AGORA);
  assert.deepEqual(d, { ok: true, uid });
  assert.equal(inv.equipamentos.length, 1);
  assert.equal(inv.equipamentos[0].qtd, 3);
});

test('equipado: só na coluna Equipamentos', () => {
  const inv = vazio(); const uid = add(inv, 'Kali', 2);
  const antes = JSON.stringify(inv);
  assert.deepEqual(K.alternar(inv, uid, 'equipado', AGORA), { ok: false, erro: 'coluna' });
  assert.equal(JSON.stringify(inv), antes);
});

test('bolsas: Bolsa de Couro pesa 0 e dá +2 bug; com qtd 2 continua +2 e ganha aviso de cópia', () => {
  const inv = vazio(); const uid = add(inv, 'Bolsa de Couro', 1);
  let c = K.calcular(inv, 10);
  assert.equal(c.pesoPorUid[uid], 0);
  assert.equal(c.motivoPorUid[uid], 'nao-ocupa');
  assert.equal(c.bugigangas.max, 12);
  assert.deepEqual(c.bugigangas.bonus, [{ id: 'item-bolsa-de-couro', nome: 'Bolsa de Couro', n: 2, ignoradas: 0 }]);
  assert.equal(c.avisos.filter((a) => a.tipo === 'copia').length, 0);
  K.quantidade(inv, uid, 2);
  c = K.calcular(inv, 10);
  assert.equal(c.bugigangas.max, 12);
  assert.equal(c.bugigangas.usado, 0);
  assert.deepEqual(c.bugigangas.bonus[0].ignoradas, 1);
  const cp = c.avisos.filter((a) => a.tipo === 'copia');
  assert.equal(cp.length, 1);
  assert.deepEqual(cp[0].uids, [uid]);
});

test('bolsas: Mochila Reforçada pesa 1, +3 bug e +1 eq', () => {
  const inv = vazio(); const uid = add(inv, 'Mochila Reforçada', 1);
  const c = K.calcular(inv, 10);
  assert.equal(c.pesoPorUid[uid], 1);
  assert.equal(c.bugigangas.usado, 1);
  assert.equal(c.bugigangas.max, 13);
  assert.equal(c.equipamentos.max, 3);
  assert.equal(c.bugigangas.base, 10);
  assert.equal(c.equipamentos.base, 2);
});

test('bolsas: Bolsa de Couro + Mochila Reforçada = +5 bug e +1 eq', () => {
  const inv = vazio(); add(inv, 'Bolsa de Couro', 1); add(inv, 'Mochila Reforçada', 1);
  const c = K.calcular(inv, 10);
  assert.equal(c.bugigangas.max, 15);
  assert.equal(c.equipamentos.max, 3);
});

test('bônus conta em qualquer coluna e o mínimo 1 não vale depois do bônus', () => {
  const inv = vazio(); add(inv, 'Mochila Reforçada', 1, 'equipamentos');
  const c = K.calcular(inv, 1);   // base 5 / 1
  assert.equal(c.bugigangas.max, 8);
  assert.equal(c.equipamentos.max, 2);
});

test('limiares de estado: u=m ok, m+1 leve, 2m−1 leve, 2m extremo', () => {
  for (const [u, est] of [[10, 'ok'], [11, 'leve'], [19, 'leve'], [20, 'extremo'], [25, 'extremo']]) {
    const inv = vazio(); avulsos(inv, u);
    const c = K.calcular(inv, 10);
    assert.equal(c.bugigangas.usado, u);
    assert.equal(c.bugigangas.estado, est, 'u=' + u);
    assert.equal(c.condicao, est === 'ok' ? 'nenhuma' : est);
  }
  assert.equal(K.estado(2, 2), 'ok'); assert.equal(K.estado(3, 2), 'leve'); assert.equal(K.estado(4, 2), 'extremo');
});

test('limiares usam o max com bônus', () => {
  // Mochila Reforçada: max bug 13 (e ela mesma pesa 1)
  for (const [n, est] of [[12, 'ok'], [13, 'leve'], [24, 'leve'], [25, 'extremo']]) {
    const inv = vazio(); add(inv, 'Mochila Reforçada', 1); avulsos(inv, n);
    const c = K.calcular(inv, 10);
    assert.equal(c.bugigangas.max, 13);
    assert.equal(c.bugigangas.usado, n + 1);
    assert.equal(c.bugigangas.estado, est, 'usado=' + (n + 1));
  }
});

test('condição é a pior das duas colunas', () => {
  const inv = vazio(); avulsos(inv, 11);                  // bug leve
  add(inv, 'Adaga de Kali', 4);                            // eq 4/2 = extremo
  const c = K.calcular(inv, 10);
  assert.equal(c.bugigangas.estado, 'leve');
  assert.equal(c.equipamentos.estado, 'extremo');
  assert.equal(c.condicao, 'extremo');
  assert.equal(c.pesoTotal, 15);
});

test('limite: 2ª Armadura Pesada dá conflito "pesada" sem mudar o estado', () => {
  const inv = vazio();
  const a = add(inv, 'Armadura de Couro', 1); const b = add(inv, 'Cota de Malha', 1);
  assert.equal(K.alternar(inv, a, 'equipado', AGORA).ok, true);
  const antes = JSON.stringify(inv);
  const r = K.alternar(inv, b, 'equipado', AGORA);
  assert.deepEqual(r, { ok: false, conflito: { tipo: 'pesada', uids: [a] } });
  assert.equal(JSON.stringify(inv), antes);
});

test('limite: 3ª Armadura Leve dá conflito "leve"; Pesada e Leve são independentes', () => {
  const inv = vazio();
  const p = add(inv, 'Armadura de Couro', 1);
  const l1 = add(inv, 'Braçadeiras de Couro', 1); const l2 = add(inv, 'Capacete de Ferro', 1); const l3 = add(inv, 'Amuleto Antitóxico', 1);
  for (const u of [p, l1, l2]) assert.equal(K.alternar(inv, u, 'equipado', AGORA).ok, true);
  const antes = JSON.stringify(inv);
  const r = K.alternar(inv, l3, 'equipado', AGORA);
  assert.equal(r.ok, false);
  assert.equal(r.conflito.tipo, 'leve');
  assert.deepEqual(r.conflito.uids, [l1, l2]);
  assert.equal(JSON.stringify(inv), antes);
});

test('limite: armas e escudos não têm limite', () => {
  const inv = vazio(); const a = add(inv, 'Adaga de Kali', 1); const b = add(inv, 'Foco de Abjuração +1', 1); const e = add(inv, 'Escudo de Madeira', 1);
  for (const u of [a, b, e]) assert.equal(K.alternar(inv, u, 'equipado', AGORA).ok, true);
  assert.equal(K.calcular(inv, 10).equipamentos.usado, 0);
});

test('limite: 4º sintonizado dá conflito "sintonia"; Sintonizado não muda o peso', () => {
  const inv = vazio();
  const us = ['Anel da Carapaça', 'Anel das Brasas', 'Amuleto de Visão Noturna', 'Amuleto do Vínculo'].map((n) => add(inv, n, 1));
  const peso0 = K.calcular(inv, 10).bugigangas.usado;
  for (const u of us.slice(0, 3)) assert.equal(K.alternar(inv, u, 'sintonizado').ok, true);
  assert.equal(K.calcular(inv, 10).bugigangas.usado, peso0);
  const antes = JSON.stringify(inv);
  const r = K.alternar(inv, us[3], 'sintonizado');
  assert.deepEqual(r, { ok: false, conflito: { tipo: 'sintonia', uids: us.slice(0, 3) } });
  assert.equal(JSON.stringify(inv), antes);
  // dessintonizar nunca dá conflito
  assert.equal(K.alternar(inv, us[0], 'sintonizado').ok, true);
  assert.equal(K.alternar(inv, us[3], 'sintonizado').ok, true);
});

test('trocar: "Trocar por esta" desequipa a anterior e equipa esta', () => {
  const inv = vazio();
  const a = add(inv, 'Armadura de Couro', 1); const b = add(inv, 'Cota de Malha', 1);
  K.alternar(inv, a, 'equipado', AGORA);
  const cf = K.alternar(inv, b, 'equipado', AGORA).conflito;
  const r = K.trocar(inv, b, 'equipado', cf.uids, AGORA);
  assert.equal(r.ok, true);
  assert.equal(K.acha(inv, a).entrada.equipado, false);
  assert.equal(K.acha(inv, b).entrada.equipado, true);
  assert.equal(K.calcular(inv, 10).equipamentos.usado, 1);
});

test('estado importado acima do limite vira aviso, sem bloquear', () => {
  const inv = vazio();
  for (const n of ['Armadura de Couro', 'Cota de Malha']) {
    const e = K.normalizaEntrada(Object.assign(K.entradaDeItem(item(n)), { qtd: 1, equipado: true, equipadoEm: AGORA }));
    inv.equipamentos.push(e);
  }
  const c = K.calcular(inv, 10);
  const av = c.avisos.filter((a) => a.tipo === 'pesada');
  assert.equal(av.length, 1);
  assert.equal(av[0].uids.length, 2);
  assert.equal(c.equipamentos.usado, 0);
});

test('mesclar: soma na entrada existente; coluna manual marca secaoManual e "fora-da-regra"', () => {
  const inv = vazio();
  const u1 = add(inv, 'Virotes/Flechas', 11);
  const r = K.mesclar(inv, item('Virotes/Flechas'), { qtd: 4 });
  assert.equal(r.uid, u1); assert.equal(r.fundiu, true);
  assert.equal(inv.bugigangas.length, 1); assert.equal(inv.bugigangas[0].qtd, 15);
  const r2 = K.mesclar(inv, item('Kali'), { qtd: 1, coluna: 'equipamentos' });
  assert.equal(r2.coluna, 'equipamentos');
  const e = K.acha(inv, r2.uid).entrada;
  assert.equal(e.secaoManual, true);
  const fr = K.calcular(inv, 10).avisos.filter((a) => a.tipo === 'fora-da-regra');
  assert.deepEqual(fr.map((a) => a.uids[0]), [r2.uid]);
  // teto 9999
  K.mesclar(inv, item('Virotes/Flechas'), { qtd: 20000 });
  assert.equal(inv.bugigangas[0].qtd, 9999);
});

test('mesclar: não funde em entrada equipada', () => {
  const inv = vazio(); const a = add(inv, 'Adaga de Kali', 1);
  K.alternar(inv, a, 'equipado', AGORA);
  const r = K.mesclar(inv, item('Adaga de Kali'), { qtd: 1 });
  assert.equal(r.fundiu, false);
  assert.equal(inv.equipamentos.length, 2);
});

test('mesclar: avulso vai para Bugigangas, sem registro e sem aviso de regra', () => {
  const inv = vazio();
  const r = K.mesclar(inv, { avulso: true, nome: '  Chave do Farol ' }, { qtd: 1 });
  assert.equal(r.coluna, 'bugigangas');
  const e = K.acha(inv, r.uid).entrada;
  assert.equal(e.avulso, true); assert.equal(e.id, ''); assert.equal(e.nome, 'Chave do Farol');
  assert.equal(e.empilhavel, false); assert.equal(e.empilhavelRegistro, null); assert.equal(e.inv, null);
  assert.equal(K.mesclar(inv, { avulso: true, nome: 'chave do farol' }, {}).uid, r.uid, 'funde por nome sem acento/caixa');
  K.mesclar(inv, { avulso: true, nome: 'Chave do Farol' }, { coluna: 'equipamentos' });
  assert.equal(K.calcular(inv, 10).avisos.length, 0);
});

test('projetar: antes/depois da coluna sem mudar o inventário', () => {
  const inv = vazio(); avulsos(inv, 11);    // FOR 14: max bug 12
  const antes = JSON.stringify(inv);
  const p = K.projetar(inv, 14, item('Anel da Carapaça'), { qtd: 1 });
  assert.equal(JSON.stringify(inv), antes);
  assert.equal(p.coluna, 'bugigangas');
  assert.deepEqual(p.antes, { usado: 11, max: 12, estado: 'ok', condicao: 'nenhuma' });
  assert.deepEqual(p.depois, { usado: 12, max: 12, estado: 'ok', condicao: 'nenhuma' });
  const p2 = K.projetar(inv, 14, item('Anel da Carapaça'), { qtd: 2 });
  assert.deepEqual(p2.depois, { usado: 13, max: 12, estado: 'leve', condicao: 'leve' });
  const p3 = K.projetar(inv, 14, item('Mochila Reforçada'), {});
  assert.deepEqual(p3.depois, { usado: 12, max: 15, estado: 'ok', condicao: 'nenhuma' });
  const p4 = K.projetar(inv, 14, item('Kali'), { coluna: 'equipamentos' });
  assert.equal(p4.coluna, 'equipamentos');
  assert.deepEqual(p4.depois, { usado: 1, max: 4, estado: 'ok', condicao: 'nenhuma' });
});

test('quantidade, remover e mover', () => {
  const inv = vazio(); const u = add(inv, 'Adaga de Kali', 2);
  assert.deepEqual(K.quantidade(inv, u, 12000), { ok: true, removido: false });
  assert.equal(K.acha(inv, u).entrada.qtd, 9999);
  K.quantidade(inv, u, 2);
  K.alternar(inv, u, 'equipado', AGORA);                 // separa 1 equipada
  const eqUid = inv.equipamentos[0].uid;
  const m = K.mover(inv, eqUid, 'bugigangas');
  assert.equal(m.ok, true);
  const movida = K.acha(inv, eqUid).entrada;
  assert.equal(movida.equipado, false); assert.equal(movida.equipadoEm, null); assert.equal(movida.secaoManual, true);
  // voltar para a canônica funde na não equipada e limpa secaoManual
  const volta = K.mover(inv, eqUid, 'equipamentos');
  assert.equal(volta.uid, u);
  assert.equal(inv.equipamentos.length, 1); assert.equal(inv.equipamentos[0].qtd, 2);
  assert.deepEqual(K.quantidade(inv, u, 0), { ok: true, removido: true });
  assert.equal(inv.equipamentos.length, 0);
  const k = add(inv, 'Kali', 3);
  assert.equal(K.remover(inv, k).nome, 'Kali');
  assert.equal(K.remover(inv, k), null);
});

test('quantidadePorId soma as duas colunas, equipados inclusive', () => {
  const inv = vazio(); const u = add(inv, 'Adaga de Kali', 3); K.alternar(inv, u, 'equipado', AGORA);
  add(inv, 'Kali', 4); add(inv, 'Kali', 2, 'equipamentos'); K.mesclar(inv, { avulso: true, nome: 'X' }, {});
  assert.deepEqual(K.quantidadePorId(inv), { 'item-adaga-de-kali': 3, 'item-kali': 6 });
});

test('migração v1 → v2 bate com a fixture (sem uid)', () => {
  const v1 = ler('ficha-v1.json');
  const copia = JSON.stringify(v1);
  const v2 = K.migrarV1(v1, AGORA);
  assert.equal(JSON.stringify(v1), copia, 'não muta a entrada');
  assert.deepEqual(semUid(v2), ler('ficha-v2-esperada.json'));
  // pontos da spec
  assert.equal(v2.schemaVersion, '2.0');
  assert.equal('armas' in v2.inventario, false);
  assert.equal('materiais' in v2.inventario, false);
  assert.equal(v2.inventario.equipamentos[0].nome, 'Armadura de Couro');
  const kali = v2.inventario.bugigangas.filter((e) => e.id === 'item-kali');
  assert.equal(kali.length, 1); assert.equal(kali[0].qtd, 2);
  const vir = v2.inventario.bugigangas.find((e) => e.id === 'item-virotes-flechas');
  assert.equal('slotPeso' in vir, false); assert.equal('tipo' in vir, false);
  const uids = [...v2.inventario.bugigangas, ...v2.inventario.equipamentos].map((e) => e.uid);
  assert.ok(uids.every((u) => /^e[0-9a-z]+$/.test(u)));
  assert.equal(new Set(uids).size, uids.length);
});

test('migração é idempotente', () => {
  const v2 = K.migrarV1(ler('ficha-v1.json'), AGORA);
  const v2b = K.migrarV1(v2, '2030-01-01T00:00:00.000Z');
  assert.deepEqual(v2b, v2);
});

test('migração: numa 2.0, listas velhas recriadas por ficha.js antigo são absorvidas', () => {
  const v2 = K.migrarV1(ler('ficha-v1.json'), AGORA);
  const kaliUid = v2.inventario.bugigangas.find((e) => e.id === 'item-kali').uid;
  // um ficha.js v1 em cache recria armas/materiais e empurra entradas sem uid
  v2.inventario.armas = [{ id: 'item-cota-de-malha', nome: 'Cota de Malha', tipo: 'Armadura', categoria: 'Armadura', raridade: 'Ordinário',
    efeito: '[Pesada] Ar 2. -1,5 m Movimento. -1 Furtividade.', valor: '2d10+10', qtd: 1, slotPeso: 1 }];
  v2.inventario.materiais = [{ id: 'item-kali', nome: 'Kali', tipo: 'Material', categoria: 'Material', raridade: 'Exótico',
    efeito: item('Kali').efeito, valor: '4d10+45', qtd: 1, slotPeso: 1 }];
  const m = K.migrarV1(v2, '2030-01-01T00:00:00.000Z');
  assert.equal('armas' in m.inventario, false);
  assert.equal('materiais' in m.inventario, false);
  assert.equal(m.migradoEm, AGORA, 'uma 2.0 não reescreve migradoEm');
  const kali = m.inventario.bugigangas.filter((e) => e.id === 'item-kali');
  assert.equal(kali.length, 1); assert.equal(kali[0].qtd, 3); assert.equal(kali[0].uid, kaliUid);
  assert.ok(m.inventario.equipamentos.some((e) => e.id === 'item-cota-de-malha'));
  // listas velhas vazias também somem
  const limpa = K.migrarV1(ler('ficha-v1.json'), AGORA);
  const suja = JSON.parse(JSON.stringify(limpa)); suja.inventario.armas = []; suja.inventario.materiais = [];
  assert.deepEqual(K.migrarV1(suja, '2030-01-01T00:00:00.000Z'), limpa);
});

test('migração preserva a colocação v2 (secaoManual, equipado)', () => {
  const inv = vazio(); const u = add(inv, 'Kali', 2, 'equipamentos'); const a = add(inv, 'Armadura de Couro', 1);
  K.alternar(inv, a, 'equipado', AGORA);
  const f = { schemaVersion: '2.0', migradoEm: '', inventario: JSON.parse(JSON.stringify(inv)) };
  const m = K.migrarV1(f, AGORA);
  assert.deepEqual(m.inventario, inv);
  assert.equal(K.acha(m.inventario, u).coluna, 'equipamentos');
});

test('reconciliação: preenche o snapshot, preserva escolhas e marca órfão', () => {
  const v2 = K.migrarV1(ler('ficha-v1.json'), AGORA);
  const inv = v2.inventario;
  // jogador divergiu do registro na Kali; e equipou a armadura
  const kali = inv.bugigangas.find((e) => e.id === 'item-kali'); kali.empilhavel = false;
  const arm = inv.equipamentos.find((e) => e.id === 'item-armadura-de-couro');
  K.alternar(inv, arm.uid, 'equipado', AGORA);
  // um órfão, um que casa só por nome e um avulso
  inv.bugigangas.push(K.normalizaEntrada({ id: 'item-sumiu', nome: 'Item que Sumiu', categoria: 'Bugiganga', efeito: 'x', qtd: 3 }));
  inv.bugigangas.push(K.normalizaEntrada({ id: 'item-flechas-geladas-velho', nome: 'Flechas Gélidas', categoria: 'Munição', efeito: '', qtd: 12 }));
  inv.bugigangas.push(K.normalizaEntrada({ avulso: true, nome: 'Chave do Farol', qtd: 1 }));
  const avulsoAntes = JSON.stringify(inv.bugigangas[inv.bugigangas.length - 1]);

  assert.equal(K.reconciliar(inv, IDX.porId, IDX.porNome), true);
  const adaga = inv.equipamentos.find((e) => e.id === 'item-adaga-de-kali');
  assert.equal(adaga.arquetipo, 'Leve Cortante');
  assert.deepEqual(adaga.inv, { slot: 'equipamento' });
  assert.deepEqual(arm.inv, { slot: 'equipamento', armadura: 'Pesada' });
  assert.equal(arm.equipado, true, 'nunca toca em equipado');
  assert.equal(kali.empilhavel, false, 'a escolha do jogador fica');
  assert.equal(kali.empilhavelRegistro, true);
  assert.equal(kali.qtd, 2);
  const vir = inv.bugigangas.find((e) => e.id === 'item-virotes-flechas');
  assert.equal(vir.empilhavel, true); assert.deepEqual(vir.inv, { slot: 'bugiganga', empilhavel: true });
  const orf = inv.bugigangas.find((e) => e.id === 'item-sumiu');
  assert.equal(orf.orfao, true); assert.equal(orf.qtd, 3);
  const gel = inv.bugigangas.find((e) => e.nome === 'Flechas Gélidas');
  assert.equal(gel.id, 'item-flechas-gelidas', 'casou por nome');
  assert.equal(gel.empilhavel, true, 'seguia o registro, então acompanha');
  assert.equal(gel.orfao, false);
  assert.equal(JSON.stringify(inv.bugigangas[inv.bugigangas.length - 1]), avulsoAntes);
  // o órfão pesa pelo snapshot e gera aviso
  const c = K.calcular(inv, 14);
  assert.equal(c.pesoPorUid[orf.uid], 3);
  assert.deepEqual(c.avisos.filter((a) => a.tipo === 'orfao').map((a) => a.uids[0]), [orf.uid]);
  // Virotes 1 + Kali 2 (sem pilha: 2) + órfão 3 + Gélidas 12 (pilha: 2) + avulso 1
  assert.equal(c.bugigangas.usado, 9);
  assert.equal(c.equipamentos.usado, 2);
  // segunda passada não muda nada
  assert.equal(K.reconciliar(inv, IDX.porId, IDX.porNome), false);
  // aceita Map também
  assert.equal(K.reconciliar(inv, new Map(Object.entries(IDX.porId)), new Map(Object.entries(IDX.porNome))), false);
});

test('bestiário: weapons só com a arma (a armadura sai), pela fixture', () => {
  const v2 = K.migrarV1(ler('ficha-v1.json'), AGORA);
  K.reconciliar(v2.inventario, IDX.porId, IDX.porNome);
  assert.deepEqual(K.armasBestiario(v2.inventario), ler('bestiario-armas-esperado.json'));
});

test('bestiário: equipadas primeiro, nível pelo sufixo +N, Foco Místico vira mystic, token exato', () => {
  const inv = vazio();
  add(inv, 'Adaga de Kali', 1);
  const foco = add(inv, 'Foco de Abjuração +1', 1);
  add(inv, 'Estilhaços do Abismo', 11);     // Arma em Bugigangas também sai
  add(inv, 'Armadura de Couro', 1);
  inv.bugigangas.push(K.normalizaEntrada({ id: 'x-armadilha', nome: 'Armadilha de Urso', categoria: 'Armadilha, Bugiganga', efeito: '' }));
  K.alternar(inv, foco, 'equipado', AGORA);
  const w = K.armasBestiario(inv);
  assert.deepEqual(w.map((x) => x.name), ['Foco de Abjuração +1', 'Adaga de Kali', 'Estilhaços do Abismo']);
  assert.equal(w[0].level, '1'); assert.equal(w[0].mystic, true); assert.equal(w[0].category, 'Foco Místico (Abjuração)');
  assert.equal(w[1].level, '0'); assert.equal('mystic' in w[1], false);
  assert.equal(w[1].atributo, 'Força'); assert.equal(w[1].dado, ''); assert.equal(w[1].dano, '');
});

test('normalizaEntrada: qtd, defaults e chaves da v1', () => {
  const e = K.normalizaEntrada({ id: 'item-kali', nome: 'Kali', categoria: 'Material', efeito: item('Kali').efeito, qtd: '0', tipo: 'Material', slotPeso: 1 });
  assert.equal(e.qtd, 1); assert.equal(e.empilhavel, true); assert.equal(e.empilhavelRegistro, true);
  assert.equal(e.equipado, false); assert.equal(e.equipadoEm, null); assert.equal(e.sintonizado, false);
  assert.equal('tipo' in e, false); assert.equal('slotPeso' in e, false);
  assert.equal(K.normalizaEntrada({ nome: 'a', qtd: 'abc' }).qtd, 1);
  assert.equal(K.normalizaEntrada({ nome: 'a', qtd: 3.7 }).qtd, 3);
  assert.equal(K.normalizaEntrada({ nome: 'a', qtd: 1e6 }).qtd, 9999);
  // chaves desconhecidas ficam
  assert.equal(K.normalizaEntrada({ nome: 'a', nota: 'minha' }).nota, 'minha');
  // idempotente
  const n1 = K.normalizaEntrada({ id: 'item-kali', nome: 'Kali', qtd: 2 });
  assert.deepEqual(K.normalizaEntrada(n1), n1);
});

// ---- Equipado/Sintonizado valem por unidade (entrada marcada tem qtd 1) ----
const MAGICOS = ['Anel da Carapaça', 'Anel das Brasas', 'Amuleto de Visão Noturna', 'Amuleto do Vínculo'];

test('quantidade: entrada equipada ou sintonizada não passa de 1; abaixo de 1 ainda remove', () => {
  const inv = vazio();
  const c = add(inv, 'Cota de Malha', 1);
  K.alternar(inv, c, 'equipado', AGORA);
  const antes = JSON.stringify(inv);
  assert.deepEqual(K.quantidade(inv, c, 5), { ok: false, erro: 'equipado' });
  assert.equal(JSON.stringify(inv), antes, 'nada muda');
  assert.equal(K.calcular(inv, 10).avisos.filter((a) => a.tipo === 'pesada').length, 0);
  const s = add(inv, 'Anel da Carapaça', 1);
  K.alternar(inv, s, 'sintonizado');
  assert.deepEqual(K.quantidade(inv, s, 2), { ok: false, erro: 'sintonizado' });
  assert.equal(K.quantidade(inv, s, 1).ok, true);
  assert.equal(K.quantidade(inv, c, 0).removido, true);
});

test('migração: equipada/sintonizada com qtd > 1 separa 1 unidade; Equipado fora de Equipamentos é limpo', () => {
  const f = { schemaVersion: '2.0', inventario: { sins: 0,
    equipamentos: [
      Object.assign(K.entradaDeItem(item('Cota de Malha')), { uid: 'u1', qtd: 5, equipado: true, equipadoEm: AGORA }),
      Object.assign(K.entradaDeItem(item('Adaga de Kali')), { uid: 'u2', qtd: 2 }),
      Object.assign(K.entradaDeItem(item('Adaga de Kali')), { uid: 'u3', qtd: 3, equipado: true, equipadoEm: AGORA })
    ],
    bugigangas: [
      Object.assign(K.entradaDeItem(item('Anel da Carapaça')), { uid: 'u4', qtd: 3, sintonizado: true }),
      Object.assign(K.entradaDeItem(item('Kali')), { uid: 'u5', qtd: 2, equipado: true, equipadoEm: AGORA })
    ] } };
  const v2 = K.migrarV1(f, AGORA), inv = v2.inventario;
  const resumo = (l) => l.map((e) => [e.nome, e.qtd, e.equipado, e.sintonizado]);
  assert.deepEqual(resumo(inv.equipamentos), [
    ['Cota de Malha', 1, true, false], ['Cota de Malha', 4, false, false],
    ['Adaga de Kali', 4, false, false],   // a sobra da equipada funde na livre
    ['Adaga de Kali', 1, true, false]]);
  assert.deepEqual(resumo(inv.bugigangas), [
    ['Anel da Carapaça', 1, false, true], ['Anel da Carapaça', 2, false, false], ['Kali', 2, false, false]]);
  assert.equal(inv.bugigangas[2].equipadoEm, null);
  const uids = inv.equipamentos.concat(inv.bugigangas).map((e) => e.uid);
  assert.equal(new Set(uids).size, uids.length, 'uids únicos');
  assert.equal(K.calcular(inv, 10).equipamentos.usado, 8, '4 Cotas + 4 Adagas livres; as equipadas não pesam');
  // idempotente
  assert.deepEqual(K.migrarV1(v2, AGORA).inventario, inv);
});

test('sintonia: cópia comprada não herda a sintonia; dessintonizar funde de volta', () => {
  const inv = vazio();
  const us = MAGICOS.slice(0, 3).map((n) => add(inv, n, 1));
  for (const u of us) assert.equal(K.alternar(inv, u, 'sintonizado').ok, true);
  const r = K.mesclar(inv, item(MAGICOS[0]), { qtd: 1 });
  assert.equal(r.fundiu, false);
  assert.equal(K.acha(inv, us[0]).entrada.qtd, 1);
  assert.equal(K.acha(inv, r.uid).entrada.sintonizado, false);
  assert.equal(K.calcular(inv, 10).avisos.filter((a) => a.tipo === 'sintonia').length, 0);
  // dessintonizar: a unidade volta para a pilha livre
  const d = K.alternar(inv, us[0], 'sintonizado');
  assert.deepEqual(d, { ok: true, uid: r.uid });
  assert.equal(K.acha(inv, us[0]), null);
  assert.equal(K.acha(inv, r.uid).entrada.qtd, 2);
});

test('sintonia: sintonizar uma pilha separa 1 unidade e o limite conta essa 1', () => {
  const inv = vazio();
  const a = add(inv, MAGICOS[0], 1), b = add(inv, MAGICOS[1], 1), c = add(inv, MAGICOS[2], 2);
  K.alternar(inv, a, 'sintonizado'); K.alternar(inv, b, 'sintonizado');
  const r = K.alternar(inv, c, 'sintonizado');
  assert.equal(r.ok, true);
  assert.notEqual(r.uid, c);
  const nova = K.acha(inv, r.uid).entrada, pilha = K.acha(inv, c).entrada;
  assert.deepEqual([nova.qtd, nova.sintonizado], [1, true]);
  assert.deepEqual([pilha.qtd, pilha.sintonizado], [1, false]);
  assert.ok(inv.bugigangas.indexOf(nova) < inv.bugigangas.indexOf(pilha), 'posta logo antes');
  // 4ª unidade: conflito com os 3 que ocupam o limite
  const r4 = K.alternar(inv, c, 'sintonizado');
  assert.deepEqual(r4, { ok: false, conflito: { tipo: 'sintonia', uids: [a, b, r.uid] } });
});

test('sintonia: pilha de 4 sem nada sintonizado sintoniza sem conflito', () => {
  const inv = vazio();
  const c = add(inv, MAGICOS[2], 4);
  const r = K.alternar(inv, c, 'sintonizado');
  assert.equal(r.ok, true);
  assert.equal(K.conflito(inv, c, 'sintonizado'), null);
  assert.equal(K.calcular(inv, 10).avisos.filter((a) => a.tipo === 'sintonia').length, 0);
});

test('sintonia: mover, desequipar e fundir não misturam entrada sintonizada com livre', () => {
  const inv = vazio();
  const s = add(inv, MAGICOS[0], 1);
  K.alternar(inv, s, 'sintonizado');
  const l = add(inv, MAGICOS[0], 2, 'equipamentos');
  // mover a sintonizada para junto da livre: não funde
  assert.deepEqual(K.mover(inv, s, 'equipamentos'), { ok: true, uid: s });
  assert.equal(K.acha(inv, s).entrada.sintonizado, true);
  assert.equal(K.acha(inv, l).entrada.qtd, 2);
  // equipada + sintonizada: desequipar mantém a unidade separada
  assert.equal(K.alternar(inv, s, 'equipado', AGORA).ok, true);
  assert.deepEqual(K.alternar(inv, s, 'equipado', AGORA), { ok: true, uid: s });
  assert.equal(K.acha(inv, s).entrada.sintonizado, true);
  assert.equal(K.acha(inv, l).entrada.qtd, 2);
  assert.equal(K.fundir(inv.equipamentos).length, 2);
});
