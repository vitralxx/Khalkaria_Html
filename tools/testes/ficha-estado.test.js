'use strict';
// Testes do estado v2 da ficha (js/ficha.js, parte do navegador): migração com
// backup, gravação imediata com rev, desfazer/lote, sincronia entre abas,
// reconciliação e fetch preguiçoso do catálogo. Spec do Bazar v3, §5.2 a §5.9.
//
// O ficha.js roda num contexto vm com window/document/localStorage mínimos e
// document.readyState = 'loading': o init() (drawer, DOM de verdade) nunca
// roda. É justamente o cenário "KF antes do init()", que precisa funcionar.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'ficha.js'), 'utf8');
const FIX = path.join(__dirname, 'fixtures');
const ler = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n), 'utf8'));
const CAT = ler('catalogo-mini.json');
const item = (nome) => JSON.parse(JSON.stringify(CAT.find((x) => x.nome === nome)));
const LS = 'khalkaria_ficha';
const BACKUP = 'khalkaria_ficha_v1_backup';
// objetos do contexto vm têm outro Array.prototype: normaliza antes de comparar
const puro = (x) => JSON.parse(JSON.stringify(x));

function armazenamento(inicial) {
  const m = new Map(Object.entries(inicial || {}));
  return {
    m, cheio: false,
    getItem(k) { return m.has(k) ? m.get(k) : null; },
    setItem(k, v) {
      if (this.cheio) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; }
      m.set(k, String(v));
    },
    removeItem(k) { m.delete(k); }
  };
}

function elFalso(tag) {
  return { tagName: String(tag).toUpperCase(), className: '', textContent: '', style: {},
    setAttribute() {}, addEventListener() {}, appendChild() {}, remove() {} };
}

// abre uma "página" com o ficha.js carregado sobre o storage dado
function pagina(storage, opcoes) {
  opcoes = opcoes || {};
  const ouvDoc = {}, ouvWin = {}, eventos = [], fetches = [], criados = [];
  const document = {
    readyState: 'loading', currentScript: null, activeElement: null, visibilityState: 'visible',
    body: { hasAttribute: (a) => a === 'data-bazar' && !!opcoes.bazar, appendChild() {} },
    head: { appendChild() {} },
    querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
    createElement: (t) => { const e = elFalso(t); criados.push(e); return e; },
    createTextNode: (t) => ({ textContent: t }),
    addEventListener(t, f) { (ouvDoc[t] = ouvDoc[t] || []).push(f); },
    dispatchEvent(ev) {
      eventos.push({ tipo: ev.type, detail: puro(ev.detail) });
      (ouvDoc[ev.type] || []).forEach((f) => f(ev));
      return true;
    }
  };
  const timers = new Map(); let proxTimer = 1;
  const sandbox = {
    document, localStorage: storage, CustomEvent, URL, console,
    setTimeout: (f) => { const id = proxTimer++; timers.set(id, f); return id; },
    clearTimeout: (id) => { timers.delete(id); },
    requestAnimationFrame: (f) => f(),
    fetch: (url) => {
      fetches.push(url);
      return opcoes.fetch ? opcoes.fetch(url) : Promise.resolve({ ok: true, json: () => Promise.resolve(puro(CAT)) });
    },
    addEventListener(t, f) { (ouvWin[t] = ouvWin[t] || []).push(f); }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox, { filename: 'ficha.js' });
  return {
    KF: sandbox.KF, KhInv: sandbox.KhInv, eventos, fetches, criados, timers,
    mudou: () => eventos.filter((e) => e.tipo === 'kf:mudou'),
    win: (tipo, ev) => (ouvWin[tipo] || []).forEach((f) => f(ev || {})),
    doc: (tipo, ev) => (ouvDoc[tipo] || []).forEach((f) => f(ev || {})),
    guardado: () => JSON.parse(storage.getItem(LS))
  };
}
const esperaFetch = () => new Promise((r) => setImmediate(r));

test('ficha nova: KF v2 existe antes do init, kf:pronta uma vez, nada gravado', () => {
  const st = armazenamento();
  const p = pagina(st);
  assert.equal(p.KF.versao, '2');
  assert.deepEqual(p.eventos.map((e) => e.tipo), ['kf:pronta']);
  assert.deepEqual(p.eventos[0].detail, { versao: '2' });
  assert.equal(st.getItem(LS), null);
  assert.deepEqual(puro(p.KF.inventario()), { sins: 0, bugigangas: [], equipamentos: [] });
  assert.equal(p.KF.migradoEm(), '');
  assert.equal(p.KF.exportadoEm(), '');
  assert.equal(p.KF.atributo('FOR'), 10);
  assert.equal(p.KF.podeDesfazer(), false);
  const c = p.KF.carga();
  assert.equal(c.bugigangas.max, 10); assert.equal(c.equipamentos.max, 2);
});

test('v1 no storage: backup cru, v2 gravada na hora sem armas/materiais; recarregar é idempotente', () => {
  const raw = JSON.stringify(ler('ficha-v1.json'));
  const st = armazenamento({ [LS]: raw });
  const p = pagina(st);
  assert.equal(st.getItem(BACKUP), raw, 'backup do JSON cru');
  const g = p.guardado();
  assert.equal(g.schemaVersion, '2.0');
  assert.equal(g.rev, 1);
  assert.ok(g.migradoEm && g.salvoEm);
  assert.equal('armas' in g.inventario, false);
  assert.equal('materiais' in g.inventario, false);
  assert.deepEqual(Object.keys(g.inventario).sort(), ['bugigangas', 'equipamentos', 'sins']);
  assert.equal(p.KF.migradoEm(), g.migradoEm);
  const inv = puro(p.KF.inventario());
  assert.deepEqual(inv.equipamentos.map((e) => e.nome).sort(), ['Adaga de Kali', 'Armadura de Couro', 'Escudo de Madeira']);
  assert.equal(inv.bugigangas.find((e) => e.id === 'item-kali').qtd, 2);
  assert.equal(inv.sins, 37);
  assert.equal(g.meta.nome, 'Borin Teste', 'o resto da ficha passa intacto');
  assert.equal(p.mudou().length, 0, 'carregar não emite kf:mudou');
  // segunda página: nada é regravado, o backup fica como estava
  const gravado = st.getItem(LS);
  const p2 = pagina(st);
  assert.equal(st.getItem(LS), gravado);
  assert.equal(st.getItem(BACKUP), raw);
  assert.deepEqual(puro(p2.KF.inventario()), inv);
});

test('backup existente nunca é sobrescrito', () => {
  const st = armazenamento({ [LS]: JSON.stringify(ler('ficha-v1.json')), [BACKUP]: 'o primeiro' });
  pagina(st);
  assert.equal(st.getItem(BACKUP), 'o primeiro');
});

test('2.0 com listas velhas recriadas por ficha.js antigo: dobradas, apagadas, sem backup', () => {
  const st = armazenamento({ [LS]: JSON.stringify(ler('ficha-v1.json')) });
  const p0 = pagina(st);
  st.removeItem(BACKUP);
  const g = p0.guardado();
  const velho = puro(g);   // o que um ficha.js v1 em cache grava: mesmo rev, listas recriadas
  velho.inventario.armas = [];
  velho.inventario.materiais = [{ id: 'item-kali', nome: 'Kali', categoria: 'Material', efeito: item('Kali').efeito, qtd: 1, slotPeso: 1 }];
  st.setItem(LS, JSON.stringify(velho));
  const p = pagina(st);
  const g2 = p.guardado();
  assert.equal(st.getItem(BACKUP), null, 'uma 2.0 não gera backup');
  assert.equal('armas' in g2.inventario, false);
  assert.equal('materiais' in g2.inventario, false);
  assert.equal(g2.rev, g.rev + 1);
  assert.equal(g2.inventario.bugigangas.filter((e) => e.id === 'item-kali')[0].qtd, 3);
  assert.equal(g2.migradoEm, g.migradoEm);
});

test('adicionar antes do init: grava na hora com rev++, funde e emite kf:mudou', () => {
  const st = armazenamento();
  const p = pagina(st);
  const u1 = p.KF.adicionar(item('Virotes/Flechas'), { qtd: 11 });
  assert.match(u1, /^e[0-9a-z]+$/);
  assert.equal(p.timers.size, 0, 'mutação de inventário não usa debounce');
  assert.equal(p.guardado().rev, 1);
  const u2 = p.KF.adicionar(item('Virotes/Flechas'));
  assert.equal(u2, u1, 'funde na entrada de mesmo id');
  assert.equal(p.guardado().rev, 2);
  assert.equal(p.KF.tenho('item-virotes-flechas'), 12);
  const ev = p.mudou();
  assert.equal(ev.length, 2);
  assert.deepEqual(ev[0].detail, { partes: ['inventario'], origem: 'local', op: 'adicionar', uid: u1 });
  // coluna canônica pelo registro (nunca substring "arma"): a armadura vai para Equipamentos
  const ua = p.KF.adicionar(item('Armadura de Couro'));
  assert.equal(puro(p.KF.inventario()).equipamentos[0].uid, ua);
  // avulso e entradas inválidas
  assert.ok(p.KF.adicionar({ avulso: true, nome: 'Chave do Farol' }));
  assert.equal(p.KF.adicionar({ avulso: true, nome: '  ' }), null);
  assert.equal(p.KF.adicionar(null), null);
  // leitura é cópia
  p.KF.inventario().bugigangas.length = 0;
  assert.equal(p.KF.inventario().bugigangas.length, 2);
  // projetar não muda nada
  const pr = p.KF.projetar(item('Cota de Malha'), { qtd: 1 });
  assert.equal(pr.coluna, 'equipamentos');
  assert.equal(pr.depois.usado, pr.antes.usado + 1);
  assert.equal(p.KF.inventario().equipamentos.length, 1);
});

test('alternar com conflito não grava nem emite; trocar é um passo; desfazer volta', () => {
  const p = pagina(armazenamento());
  const a = p.KF.adicionar(item('Armadura de Couro'));
  const c = p.KF.adicionar(item('Cota de Malha'));
  assert.equal(p.KF.alternar(a, 'equipado').ok, true);
  const rev = p.guardado().rev, n = p.mudou().length;
  const r = p.KF.alternar(c, 'equipado');
  assert.equal(r.ok, false);
  assert.deepEqual(puro(r.conflito), { tipo: 'pesada', uids: [a] });
  assert.equal(p.guardado().rev, rev, 'conflito não grava');
  assert.equal(p.mudou().length, n, 'conflito não emite');
  const antes = puro(p.KF.inventario());
  assert.equal(p.KF.trocar(c, 'equipado', [a]).ok, true);
  assert.equal(p.mudou().length, n + 1, 'trocar emite uma vez');
  const eq = puro(p.KF.inventario()).equipamentos;
  assert.equal(eq.find((e) => e.uid === a).equipado, false);
  assert.equal(eq.find((e) => e.uid === c).equipado, true);
  assert.equal(p.KF.desfazer(), true);
  assert.deepEqual(puro(p.KF.inventario()), antes, 'um desfazer desfaz a troca inteira');
  assert.equal(p.mudou().at(-1).detail.origem, 'desfazer');
});

test('lote: um snapshot, uma gravação e um evento; exceção desfaz o lote', () => {
  const p = pagina(armazenamento());
  const rev = 0;
  p.KF.lote(() => {
    p.KF.adicionar(item('Kali'), { qtd: 3 });
    p.KF.adicionar(item('Adaga de Kali'));
    p.KF.definirSins(12);
  });
  assert.equal(p.guardado().rev, rev + 1);
  assert.equal(p.mudou().length, 1);
  assert.deepEqual(p.mudou()[0].detail.partes, ['inventario', 'sins']);
  assert.equal(p.mudou()[0].detail.op, 'lote');
  assert.equal(p.KF.desfazer(), true);
  assert.deepEqual(puro(p.KF.inventario()), { sins: 0, bugigangas: [], equipamentos: [] });
  assert.equal(p.KF.podeDesfazer(), false);
  assert.throws(() => p.KF.lote(() => { p.KF.adicionar(item('Kali')); throw new Error('x'); }), /x/);
  assert.equal(p.KF.inventario().bugigangas.length, 0);
});

test('quantidade, mover, remover, Sins e a pilha de 20 desfazer', () => {
  const p = pagina(armazenamento());
  const u = p.KF.adicionar(item('Kali'), { qtd: 3 });
  p.KF.quantidade(u, 99999);
  assert.equal(p.KF.tenho('item-kali'), 9999);
  p.KF.mover(u, 'equipamentos');
  const e = puro(p.KF.inventario()).equipamentos[0];
  assert.equal(e.secaoManual, true);
  p.KF.quantidade(u, 0);
  assert.equal(p.KF.tenho('item-kali'), 0, 'n < 1 remove');
  assert.equal(p.KF.remover('nao-existe'), false);
  assert.equal(p.KF.definirSins(-4), 0);
  assert.equal(p.KF.definirSins('17.9'), 17);
  assert.equal(p.mudou().at(-1).detail.partes[0], 'sins');
  for (let i = 0; i < 25; i++) p.KF.definirSins(i + 100);
  let n = 0; while (p.KF.desfazer()) n++;
  assert.equal(n, 20);
});

test('outra aba: evento storage adota rev maior, emite outra-aba e zera o desfazer', () => {
  const st = armazenamento();
  const A = pagina(st), B = pagina(st);
  B.KF.adicionar(item('Kali'));
  assert.equal(B.KF.podeDesfazer(), true);
  A.KF.adicionar(item('Adaga de Kali'));          // A relê o storage antes de mutar
  assert.equal(A.KF.tenho('item-kali'), 1, 'A adotou a escrita de B antes de mutar');
  assert.equal(A.mudou()[0].detail.origem, 'outra-aba');
  B.win('storage', { key: LS });
  assert.equal(B.KF.tenho('item-adaga-de-kali'), 1);
  assert.deepEqual(B.mudou().at(-1).detail, { partes: ['tudo'], origem: 'outra-aba', op: 'sincroniza', uid: '' });
  assert.equal(B.KF.podeDesfazer(), false, 'adotar outra aba zera o desfazer');
  // eco da própria escrita e chave alheia são ignorados
  const n = B.mudou().length;
  B.win('storage', { key: LS }); B.win('storage', { key: 'outra' }); B.win('pageshow');
  B.doc('visibilitychange');
  assert.equal(B.mudou().length, n);
  // bfcache: pageshow também adota
  A.KF.definirSins(9);
  B.win('pageshow');
  assert.equal(B.KF.inventario().sins, 9);
});

test('catalogo: reconcilia e só emite quando algo muda', () => {
  const st = armazenamento({ [LS]: JSON.stringify(ler('ficha-v1.json')) });
  const p = pagina(st, { bazar: true });
  const inv0 = puro(p.KF.inventario());
  assert.ok(inv0.equipamentos.every((e) => e.inv === null), 'migradas ficam com inv null');
  p.KF.catalogo(puro(CAT));
  const ev = p.mudou();
  assert.equal(ev.length, 1);
  assert.equal(ev[0].detail.origem, 'reconciliacao');
  const inv = puro(p.KF.inventario());
  assert.deepEqual(inv.equipamentos.find((e) => e.id === 'item-armadura-de-couro').inv, { slot: 'equipamento', armadura: 'Pesada' });
  assert.equal(p.KF.podeDesfazer(), false, 'reconciliação não entra no desfazer');
  p.KF.catalogo(puro(CAT));
  assert.equal(p.mudou().length, 1, 'segunda passada não muda nada');
  // com catálogo, um item-esqueleto (card sem registro) vira o item do registro
  const u = p.KF.adicionar({ id: 'item-cota-de-malha', nome: 'Cota de Malha', categoria: '' });
  const e = puro(p.KF.inventario()).equipamentos.find((x) => x.uid === u);
  assert.deepEqual(e.inv, { slot: 'equipamento', armadura: 'Pesada' });
  assert.equal(p.fetches.length, 0, 'no Bazar o catálogo vem do bazar.js, sem fetch');
});

test('fetch preguiçoso do bazar.json: fora do Bazar, só com entrada pendente, uma vez', async () => {
  // sem pendentes: nada de fetch
  const p0 = pagina(armazenamento());
  p0.KF.adicionar(item('Kali'));
  p0.KF.adicionar({ avulso: true, nome: 'Pedra' });
  assert.equal(p0.fetches.length, 0);
  // item sem inv (card sem catálogo) é pendente
  p0.KF.adicionar({ id: 'item-cota-de-malha', nome: 'Cota de Malha', categoria: 'Armadura' });
  assert.equal(p0.fetches.length, 1);
  assert.match(p0.fetches[0], /data\/bazar\.json$/);
  await esperaFetch();
  const cota = puro(p0.KF.inventario()).equipamentos[0];
  assert.deepEqual(cota.inv, { slot: 'equipamento', armadura: 'Pesada' });
  assert.equal(p0.mudou().at(-1).detail.origem, 'reconciliacao');
  p0.KF.adicionar({ id: 'item-x', nome: 'X' });
  assert.equal(p0.fetches.length, 1, 'uma vez por página');
  // ficha migrada (inv null) fora do Bazar: o próximo commit dispara o fetch
  const st = armazenamento({ [LS]: JSON.stringify(ler('ficha-v1.json')) });
  const p1 = pagina(st);
  p1.KF.definirSins(1);
  assert.equal(p1.fetches.length, 1);
  // no Bazar, nunca
  const p2 = pagina(armazenamento({ [LS]: JSON.stringify(ler('ficha-v1.json')) }), { bazar: true });
  p2.KF.definirSins(1);
  assert.equal(p2.fetches.length, 0);
  // fetch que falha não quebra nem repete
  const p3 = pagina(armazenamento({ [LS]: JSON.stringify(ler('ficha-v1.json')) }),
    { fetch: () => Promise.reject(new Error('offline')) });
  p3.KF.definirSins(1); await esperaFetch(); p3.KF.definirSins(2);
  assert.equal(p3.fetches.length, 1);
});

test('storage cheio: avisa e não lança', () => {
  const st = armazenamento();
  const p = pagina(st);
  st.cheio = true;
  assert.doesNotThrow(() => p.KF.adicionar(item('Kali')));
  assert.equal(p.KF.tenho('item-kali'), 1, 'o estado em memória segue');
  assert.ok(p.criados.some((e) => e.textContent === 'Não foi possível salvar — exporte a ficha'));
});

test('pagehide e visibilitychange→hidden sem nada pendente não gravam', () => {
  const st = armazenamento();
  const p = pagina(st);
  p.win('pagehide');
  p.doc('visibilitychange');
  assert.equal(st.getItem(LS), null);
});

test('duas abas com bazar.json diferentes: adotar não reconcilia, sem ping-pong de gravação', () => {
  const st = armazenamento();
  const catVelho = puro(CAT);
  const catNovo = puro(CAT).map((x) => (x.nome === 'Adaga de Kali' ? Object.assign(x, { efeito: x.efeito + ' (errata)' }) : x));
  const A = pagina(st, { bazar: true });           // Bazar aberto antes do deploy
  A.KF.catalogo(catVelho);
  A.KF.adicionar(item('Adaga de Kali'));
  const B = pagina(st, { bazar: true });           // aba nova, com o bazar.json publicado
  B.KF.catalogo(catNovo);
  const rev = A.guardado().rev;
  assert.equal(B.mudou().at(-1).detail.origem, 'reconciliacao', 'B reconcilia uma vez com o catálogo dele');
  assert.match(A.guardado().inventario.equipamentos[0].efeito, /\(errata\)$/);
  // entrega os eventos storage de lá para cá várias vezes: ninguém regrava
  for (let i = 0; i < 10; i++) { A.win('storage', { key: LS }); B.win('storage', { key: LS }); }
  assert.equal(A.guardado().rev, rev, 'adotar não grava');
  assert.equal(A.mudou().filter((e) => e.detail.origem === 'reconciliacao').length, 0, 'A nunca reconcilia uma adoção');
  assert.match(A.KF.inventario().equipamentos[0].efeito, /\(errata\)$/, 'A adotou o snapshot de B');
  // o que A digita depois segue valendo, sem voltar ao catálogo velho
  A.KF.definirSins(5);
  B.win('storage', { key: LS });
  assert.equal(B.KF.inventario().sins, 5);
  assert.equal(A.guardado().rev, rev + 1);
});

test('KF.quantidade em entrada equipada: recusa, não grava nem emite', () => {
  const p = pagina(armazenamento());
  const u = p.KF.adicionar(item('Cota de Malha'));
  p.KF.alternar(u, 'equipado');
  const rev = p.guardado().rev, n = p.mudou().length;
  const r = p.KF.quantidade(u, 5);
  assert.equal(r.ok, false); assert.equal(r.erro, 'equipado');
  assert.equal(p.guardado().rev, rev);
  assert.equal(p.mudou().length, n);
  assert.equal(p.KF.inventario().equipamentos[0].qtd, 1);
});
