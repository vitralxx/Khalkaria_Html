'use strict';
// Guarda contra aba velha (F0, ficha v2.1). Com o marcador localStorage
// 'khalkaria_ficha_dono' = 'v3' (no load ou pelo evento storage) a ficha v2
// fica só-leitura: faixa com "Baixar ficha v3 (.json)" e "Voltar a usar a v2",
// e NENHUMA escrita no storage (nem pelo Bazar via KF). A mera existência das
// chaves v3 (índice 'khalkaria_fichas_v3' + 'khalkaria_ficha_v3:<id>', as de
// KhEstado.CHAVES) não trava nada. "Baixar ficha v3" baixa o pacote fichas/1
// de todas elas. importJSON recusa schemaVersion >= 3 e tudo que não é ficha
// v1/v2 (pacote fichas/1, export do Bestiário, JSON solto), sem tocar em nada.
// O marcador 'v3-dupla' (escrita dupla da F4) deixa a v2.1 editável; 'v3' (F5)
// a deixa só-leitura. "Aba v2 gravando depois do import" (F3, plano §F3):
// a ficha v3 guarda {revV2, salvoEmV2} e, com o marcador, a aba velha não grava.
//
// O init() roda (readyState 'complete') sobre um DOM falso tolerante, como em
// export-import.test.js; aqui o window guarda os ouvintes para disparar
// 'storage' e 'pagehide', e os timers ficam na mão (debounce do save()).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'ficha.js'), 'utf8');
// o KhEstado de produção (fonte) faz aqui o papel da F4: importa a v2 como ficha do índice
const KhEstado = require('../../js/ficha/kh-estado.js');
const FIX = path.join(__dirname, 'fixtures');
const ler = (n) => JSON.parse(fs.readFileSync(path.join(FIX, n), 'utf8'));
const CAT = ler('catalogo-mini.json');
const LS = 'khalkaria_ficha';
const DONO = 'khalkaria_ficha_dono';
const INDICE = 'khalkaria_fichas_v3';
const FICHA = 'khalkaria_ficha_v3:';
// o que a F4 grava: o índice fichas/1 e uma chave por ficha
function gravaV3(st, fichas) {
  st.setItem(INDICE, JSON.stringify({ schema: 'fichas/1', ultimaAtiva: fichas.length ? fichas[0].id : null, projecaoV2: null,
    fichas: fichas.map((f) => ({ id: f.id, nome: f.meta ? f.meta.nome : '', classe: '', nivel: 1, atualizadoEm: '2026-09-28T00:00:00.000Z' })) }));
  fichas.forEach((f) => st.setItem(FICHA + f.id, typeof f.cru === 'string' ? f.cru : JSON.stringify(f)));
}
const BACKUP = 'khalkaria_ficha_v1_backup';
const MSG_RO = 'Ficha migrada para a v3. Recarregue a página.';
const puro = (x) => JSON.parse(JSON.stringify(x));
const item = (nome) => puro(CAT.find((x) => x.nome === nome));

// storage que conta toda escrita (setItem/removeItem/clear)
function armazenamento(inicial) {
  const m = new Map(Object.entries(inicial || {}));
  const st = {
    m, escritas: [],
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { st.escritas.push(['set', k]); m.set(k, String(v)); },
    removeItem: (k) => { st.escritas.push(['remove', k]); m.delete(k); },
    foto: () => JSON.stringify([...m.entries()].sort())
  };
  return st;
}

function criaDom() {
  const criados = [];
  function lista(arr) { arr.forEach = Array.prototype.forEach; arr.item = (i) => arr[i] || null; return arr; }
  function elemento(tag) {
    const attrs = {}, ouv = {};
    const e = {
      tagName: String(tag || 'div').toUpperCase(), nodeType: 1, className: '', textContent: '',
      innerHTML: '', value: '', checked: false, disabled: false, files: [],
      style: {}, children: [], parentElement: null, parentNode: null,
      classList: {
        _s: new Set(),
        add(...c) { c.forEach((x) => this._s.add(x)); },
        remove(...c) { c.forEach((x) => this._s.delete(x)); },
        toggle(c, f) { const on = f === undefined ? !this._s.has(c) : !!f; if (on) this._s.add(c); else this._s.delete(c); return on; },
        contains(c) { return this._s.has(c); }
      },
      setAttribute(k, v) { attrs[k] = String(v); },
      getAttribute(k) { return k in attrs ? attrs[k] : null; },
      hasAttribute(k) { return k in attrs; },
      removeAttribute(k) { delete attrs[k]; },
      addEventListener(t, f) { (ouv[t] = ouv[t] || []).push(f); },
      removeEventListener() {},
      dispatchEvent(ev) { (ouv[ev.type] || []).forEach((f) => f(ev)); return true; },
      appendChild(c) { if (c && typeof c === 'object') { c.parentElement = e; c.parentNode = e; e.children.push(c); } return c; },
      insertBefore(c) { return e.appendChild(c); },
      replaceChild(n) { return n; },
      remove() {},
      // devolve os descendentes que casam com uma lista simples de tags
      querySelectorAll(sel) {
        const tags = String(sel).split(',').map((s) => s.trim().toUpperCase());
        const out = [];
        (function anda(n) { n.children.forEach((c) => { if (c && c.tagName) { if (tags.includes(c.tagName)) out.push(c); anda(c); } }); })(e);
        return lista(out);
      },
      querySelector() { return null; },
      closest() { return null; },
      contains() { return false; },
      focus() {}, scrollIntoView() {},
      click() { e.dispatchEvent({ type: 'click', target: e, preventDefault() {}, stopPropagation() {} }); }
    };
    criados.push(e);
    return e;
  }
  return { elemento, criados, lista };
}

function pagina(storage) {
  const dom = criaDom();
  const baixados = [], ouvWin = {}, eventos = [], timers = new Map();
  let proxTimer = 1;
  const bodyEl = dom.elemento('body');
  bodyEl.hasAttribute = () => false;
  const document = {
    readyState: 'complete', currentScript: null, activeElement: null, visibilityState: 'visible',
    body: bodyEl, head: dom.elemento('head'),
    querySelector: () => null, querySelectorAll: () => dom.lista([]), getElementById: () => null,
    createElement: (t) => dom.elemento(t),
    createTextNode: (t) => ({ nodeType: 3, textContent: t }),
    addEventListener() {}, removeEventListener() {},
    dispatchEvent(ev) { eventos.push({ tipo: ev.type, detail: puro(ev.detail) }); return true; }
  };
  class Blob { constructor(partes) { this.texto = partes.join(''); } }
  class FileReader { readAsText(f) { this.result = f.texto; this.onload && this.onload(); } }
  const sandbox = {
    document, localStorage: storage, CustomEvent, console, Blob, FileReader,
    URL: { createObjectURL: (b) => { baixados.push(JSON.parse(b.texto)); return 'blob:x'; }, revokeObjectURL() {} },
    setTimeout: (f) => { const id = proxTimer++; timers.set(id, f); return id; },
    clearTimeout: (id) => { timers.delete(id); },
    requestAnimationFrame: (f) => f(),
    MutationObserver: class { observe() {} disconnect() {} },
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(puro(CAT)) }),
    confirm: () => true, alert() {},
    addEventListener(t, f) { (ouvWin[t] = ouvWin[t] || []).push(f); }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(SRC, sandbox, { filename: 'ficha.js' });
  const porTitulo = (title) => dom.criados.filter((e) => e.tagName === 'BUTTON' && e.getAttribute('title') === title);
  return {
    KF: sandbox.KF, baixados, eventos, dom,
    // o botão da renderização mais recente (renderAll recria a faixa)
    botao(title) { const l = porTitulo(title); assert.ok(l.length, 'botão "' + title + '" existe'); return l[l.length - 1]; },
    temBotao: (title) => porTitulo(title).length > 0,
    faixas: () => dom.criados.filter((e) => e.getAttribute('id') === 'kf-ro'),
    toasts: () => dom.criados.filter((e) => e.getAttribute('id') === 'kf-toast').map((e) => e.textContent),
    win: (tipo, ev) => (ouvWin[tipo] || []).forEach((f) => f(ev || {})),
    rodaTimers() { const fs2 = [...timers.values()]; timers.clear(); fs2.forEach((f) => f()); },
    importar(obj) {
      this.botao('Importar JSON').click();
      const inp = dom.criados.filter((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'file').pop();
      if (!inp) return false;
      inp.files = [{ texto: JSON.stringify(obj) }];
      inp.dispatchEvent({ type: 'change', target: inp });
      return true;
    }
  };
}

// uma ficha v2 gravada por uma aba anterior
function fichaV2(st) {
  const p = pagina(st);
  p.KF.adicionar(item('Virotes/Flechas'), { qtd: 5 });
  return JSON.parse(st.getItem(LS));
}

test('marcador v3 no load: só-leitura, faixa com os dois botões e nenhuma escrita', () => {
  const st = armazenamento();
  fichaV2(st);
  st.setItem(DONO, 'v3');
  gravaV3(st, [{ schemaVersion: '3.0', id: 'fborin3', meta: { nome: 'Borin Três', nivel: 1 } }]);
  const antes = st.foto();
  st.escritas.length = 0;
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(p.faixas().length, 1, 'faixa desenhada no drawer');
  assert.ok(p.temBotao('Baixar ficha v3 (.json)'));
  assert.ok(p.temBotao('Voltar a usar a v2'));
  assert.ok(p.toasts().includes(MSG_RO));
  // todos os caminhos de escrita do KF (os que o Bazar usa)
  const uid = p.KF.inventario().bugigangas[0].uid;
  assert.equal(p.KF.adicionar(item('Kali'), { qtd: 3 }), null);
  assert.deepEqual(puro(p.KF.quantidade(uid, 9)), { ok: false, erro: 'somente-leitura' });
  assert.deepEqual(puro(p.KF.alternar(uid, 'empilhavel')), { ok: false, erro: 'somente-leitura' });
  assert.deepEqual(puro(p.KF.mover(uid, 'equipamentos')), { ok: false, erro: 'somente-leitura' });
  assert.equal(p.KF.remover(uid), false);
  assert.equal(p.KF.definirSins(99), 0);
  let rodou = false;
  p.KF.lote(() => { rodou = true; return p.KF.adicionar(item('Kali')); });
  assert.equal(rodou, false, 'lote nem roda a função');
  assert.equal(p.KF.desfazer(), false);
  assert.equal(p.KF.podeDesfazer(), false);
  p.KF.catalogo(puro(CAT));      // reconciliação não grava
  p.KF.abrir('inventario');      // abrir o drawer não grava khalkaria_ficha_open
  p.win('pagehide'); p.rodaTimers();
  assert.deepEqual(st.escritas, [], 'nenhuma escrita no storage');
  assert.equal(st.foto(), antes);
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 5, 'nem a memória muda');
  // o export nativo baixa a v2 como está, sem carimbar exportadoEm
  p.botao('Exportar JSON').click();
  assert.equal(p.baixados.pop().inventario.bugigangas[0].qtd, 5);
  assert.deepEqual(st.escritas, []);
});

test('v1 no storage com marcador v3: nada de backup nem de migração gravada', () => {
  const raw = JSON.stringify(ler('ficha-v1.json'));
  const st = armazenamento({ [LS]: raw, [DONO]: 'v3' });
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(st.getItem(LS), raw);
  assert.equal(st.getItem(BACKUP), null);
  assert.deepEqual(st.escritas, []);
  // mas a ficha é lida (migrada só na memória) para mostrar
  assert.equal(p.KF.inventario().sins, 37);
});

test('só as chaves v3 (sem marcador) não travam nada', () => {
  const st = armazenamento();
  gravaV3(st, [{ schemaVersion: '3.0', id: 'fabc123', meta: { nome: 'X', nivel: 1 } }]);
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), false);
  assert.equal(p.faixas().length, 0);
  assert.ok(p.KF.adicionar(item('Kali'), { qtd: 2 }));
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 2);
  // marcador com outro valor também não trava
  st.setItem(DONO, 'v2');
  p.win('storage', { key: DONO, newValue: 'v2' });
  assert.equal(p.KF.somenteLeitura(), false);
});

test('marcador chega pelo evento storage: entra em só-leitura, descarta o debounce; apagar volta ao normal', () => {
  const st = armazenamento();
  const p = pagina(st);
  assert.ok(p.KF.adicionar(item('Kali'), { qtd: 2 }));
  const revAntes = JSON.parse(st.getItem(LS)).rev;
  // campo digitado no drawer fica no debounce de 200ms (Nome é o 1º input de texto)
  const nome = p.dom.criados.find((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'text');
  nome.value = 'Digitado tarde';
  nome.dispatchEvent({ type: 'input', target: nome });
  assert.equal(p.KF.nome(), 'Digitado tarde');
  // outra aba (a v3) grava o marcador
  st.setItem(DONO, 'v3');
  st.escritas.length = 0;
  p.win('storage', { key: DONO, newValue: 'v3' });
  // o próprio evento troca o modo (antes de qualquer chamada ao KF)
  assert.equal(p.faixas().length, 1);
  const ev = p.eventos.filter((e) => e.tipo === 'kf:mudou').pop();
  assert.deepEqual(ev.detail.partes, ['tudo']);
  assert.equal(ev.detail.op, 'somente-leitura');
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(p.KF.adicionar(item('Kali')), null);
  p.win('pagehide'); p.rodaTimers();
  assert.deepEqual(st.escritas, [], 'nem o debounce nem o pagehide gravam');
  assert.equal(JSON.parse(st.getItem(LS)).rev, revAntes);
  assert.equal(JSON.parse(st.getItem(LS)).meta.nome, '');
  // "Voltar a usar a v2": apaga só o marcador; a chave v3 (se houver) fica
  gravaV3(st, [{ schemaVersion: '3.0', id: 'fabc123', meta: { nome: 'X', nivel: 1 } }]);
  const v3antes = [st.getItem(INDICE), st.getItem(FICHA + 'fabc123')];
  st.escritas.length = 0;
  p.botao('Voltar a usar a v2').click();
  assert.deepEqual(st.escritas, [['remove', DONO]]);
  assert.deepEqual([st.getItem(INDICE), st.getItem(FICHA + 'fabc123')], v3antes);
  assert.equal(p.KF.somenteLeitura(), false);
  assert.ok(p.KF.adicionar(item('Kali')), 'grava de novo');
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 3);
});

test('marcador apagado por outra aba (evento storage): esta volta ao normal e relê a v2', () => {
  const st = armazenamento();
  fichaV2(st);
  st.setItem(DONO, 'v3');
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), true);
  st.removeItem(DONO);
  p.win('storage', { key: DONO, oldValue: 'v3', newValue: null });
  assert.equal(p.eventos.filter((e) => e.tipo === 'kf:mudou').pop().detail.op, 'leitura-escrita');
  assert.equal(p.KF.somenteLeitura(), false);
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 5);
  assert.ok(p.KF.adicionar(item('Virotes/Flechas')));
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 6);
});

test('marcador gravado sem evento (aba em segundo plano): a próxima escrita confere e não grava', () => {
  const st = armazenamento();
  const p = pagina(st);
  st.setItem(DONO, 'v3');
  st.escritas.length = 0;
  assert.equal(p.KF.adicionar(item('Kali')), null);
  assert.deepEqual(st.escritas, []);
  assert.equal(p.KF.somenteLeitura(), true);
});

test('"Baixar ficha v3 (.json)" baixa o pacote fichas/1 com todas as fichas do índice v3', () => {
  const st = armazenamento({ [DONO]: 'v3' });
  gravaV3(st, [
    { schemaVersion: '3.0', id: 'fborin3', meta: { nome: 'Borin Três', nivel: 2 } },
    { schemaVersion: '3.0', id: 'flira03', meta: { nome: 'Lira', nivel: 1 } },
    { id: 'ffutura', cru: '{"schemaVersion":"4.0","id":"ffutura"}' }
  ]);
  st.setItem('khalkaria_ficha_v3_sessao:flira03', JSON.stringify({ modo: 'mesa', turno: 2, log: [] }));
  st.escritas.length = 0;
  const p = pagina(st);
  p.botao('Baixar ficha v3 (.json)').click();
  const pac = p.baixados.pop();
  assert.equal(pac.schema, 'fichas/1');
  assert.deepEqual(pac.fichas.map((f) => [f.id, f.meta.nome]), [['fborin3', 'Borin Três'], ['flira03', 'Lira']]);
  assert.equal(pac.fichas[1].estadoSessao.turno, 2, 'a sessão da Mesa vai junto');
  assert.deepEqual(pac.ilegiveis, [{ id: 'ffutura', nome: '', motivo: 'versao-futura', texto: '{"schemaVersion":"4.0","id":"ffutura"}' }],
    'a de versão futura vai crua, não some');
  const nome = p.dom.criados.filter((e) => e.tagName === 'A').pop().getAttribute('download');
  assert.equal(nome, 'khalkaria-fichas.json');
  assert.deepEqual(st.escritas, [], 'só lê');
  // sem o índice v3: avisa e não baixa nada
  st.m.delete(INDICE);
  p.botao('Baixar ficha v3 (.json)').click();
  assert.equal(p.baixados.length, 0);
  assert.equal(p.toasts().pop(), 'Não há ficha v3 salva neste navegador');
});

test('importJSON recusa schemaVersion >= 3 com toast e não toca em nada', () => {
  const st = armazenamento();
  const p = pagina(st);
  p.KF.adicionar(item('Kali'), { qtd: 2 });
  const antes = st.foto();
  ['3.0', 3, '3.1', '10.0'].forEach((sv) => {
    p.importar({ schemaVersion: sv, meta: { nome: 'Da v3' }, inventario: { sins: 5, bugigangas: [], equipamentos: [] } });
    assert.match(p.toasts().pop(), /é da v3 \(schemaVersion /);
    assert.equal(st.foto(), antes, 'schemaVersion ' + sv);
  });
  assert.equal(p.KF.nome(), '');
  // 2.0 e 1.0 continuam entrando
  p.importar({ schemaVersion: '2.0', meta: { nome: 'Da v2' }, inventario: { sins: 5, bugigangas: [], equipamentos: [] } });
  assert.equal(p.KF.nome(), 'Da v2');
});

const MSG_PACOTE = 'Este arquivo é um pacote de várias fichas da ficha nova e não entra aqui.';
const MSG_BESTIARIO = 'Este arquivo é um export para o Bestiário, não uma ficha.';
const MSG_NAO_FICHA = 'Este arquivo não é uma ficha do Khalkaria.';

test('importJSON recusa pacote fichas/1, export do Bestiário e JSON que não é ficha, sem tocar em nada', () => {
  const st = armazenamento();
  const p = pagina(st);
  p.KF.adicionar(item('Kali'), { qtd: 2 });
  // os dois arquivos REAIS: o pacote do "exportar todas" da v3 e o export Bestiário desta página
  const pacote = KhEstado.pacoteTodas([KhEstado.novaFicha({ nome: 'Borin Três' }), KhEstado.novaFicha({ nome: 'Lira' })]).dados;
  p.botao('Exportar p/ Bestiário').click();
  const bestiario = p.baixados.pop();
  assert.equal(bestiario.type, 'npc');
  const antes = st.foto();
  const casos = [
    [pacote, MSG_PACOTE],
    [{ schema: 'fichas/1', fichas: [] }, MSG_PACOTE],
    [{ fichas: [{ schemaVersion: '2.0', meta: { nome: 'X' } }] }, MSG_PACOTE],   // sem o schema, a lista basta
    [bestiario, MSG_BESTIARIO],
    [{ type: 'monster', name: 'Lobo Cinzento', strength: 14, prof_attack: 2, weapons: [], abilities: [] }, MSG_BESTIARIO],
    [{ foo: 1 }, MSG_NAO_FICHA],
    [{}, MSG_NAO_FICHA],
    [{ meta: 'Borin', atributos: [14, 12] }, MSG_NAO_FICHA],              // meta/atributos que não são objeto
    [{ schemaVersion: 'abc', meta: { nome: 'X' } }, MSG_NAO_FICHA],
    [{ schemaVersion: '0.9', meta: { nome: 'X' } }, MSG_NAO_FICHA]
  ];
  casos.forEach(([obj, msg]) => {
    p.importar(obj);
    assert.equal(p.toasts().pop(), msg, JSON.stringify(obj).slice(0, 80));
    assert.equal(st.foto(), antes, 'storage intacto: ' + JSON.stringify(obj).slice(0, 80));
  });
  assert.equal(p.KF.nome(), '');
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 2, 'nem a memória muda');
});

test('importJSON: ficha v1 sem schemaVersion (meta e atributos) e ficha 2.0 continuam entrando', () => {
  // v1 antiga sem schemaVersion: entra e migra (4 listas -> 2 colunas)
  const v1 = ler('ficha-v1.json');
  delete v1.schemaVersion;
  const st = armazenamento();
  const p = pagina(st);
  p.importar(v1);
  assert.match(p.toasts().pop(), /^Ficha importada\. Inventário convertido/);
  assert.equal(p.KF.nome(), 'Borin Teste');
  assert.equal(p.KF.inventario().sins, 37);
  const gravada = JSON.parse(st.getItem(LS));
  assert.equal(gravada.schemaVersion, '2.0');
  assert.equal(gravada.atributos.for, 14);
  assert.ok(!('armas' in gravada.inventario) && !('materiais' in gravada.inventario));
  // só um dos dois blocos já basta
  p.importar({ atributos: { for: 16, des: 12, con: 14, int: 10, sab: 10 } });
  assert.equal(p.toasts().pop(), 'Ficha importada');
  assert.equal(JSON.parse(st.getItem(LS)).atributos.for, 16);
  p.importar({ meta: { nome: 'Só meta' } });
  assert.equal(p.KF.nome(), 'Só meta');
  // o export nativo de uma ficha 2.0 entra em outro navegador como saiu
  const origem = pagina(armazenamento());
  origem.KF.adicionar(item('Virotes/Flechas'), { qtd: 7 });
  origem.botao('Exportar JSON').click();
  const exportada = origem.baixados.pop();
  assert.equal(exportada.schemaVersion, '2.0');
  p.importar(exportada);
  assert.equal(p.toasts().pop(), 'Ficha importada');
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 7);
  assert.deepEqual(JSON.parse(st.getItem(LS)).inventario, exportada.inventario);
  // e schemaVersion numérica ou '1.0' também
  p.importar({ schemaVersion: 2, meta: { nome: 'Numérica' } });
  assert.equal(p.KF.nome(), 'Numérica');
  p.importar({ schemaVersion: '1.0', meta: { nome: 'Um ponto zero' } });
  assert.equal(p.KF.nome(), 'Um ponto zero');
});

test('marcador "v3-dupla" (escrita dupla da F4): a v2.1 abre editável e grava; a F5 troca para "v3" e ela fica só-leitura', () => {
  const st = armazenamento();
  fichaV2(st);                 // a projeção v2 da ficha (5 Virotes/Flechas)
  st.setItem(DONO, 'v3-dupla');
  gravaV3(st, [{ schemaVersion: '3.0', id: 'fborin3', meta: { nome: 'Borin Três', nivel: 1 } }]);
  const v3antes = [st.getItem(INDICE), st.getItem(FICHA + 'fborin3')];
  st.escritas.length = 0;
  const p = pagina(st);
  assert.equal(p.KF.somenteLeitura(), false);
  assert.equal(p.faixas().length, 0, 'sem faixa de só-leitura');
  assert.ok(!p.toasts().includes(MSG_RO));
  const ctl = p.dom.criados.filter((e) => ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.tagName) && e.getAttribute('type') !== 'file');
  assert.ok(ctl.length > 20 && ctl.every((e) => !e.disabled), 'controles do drawer habilitados');
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 5, 'abre a ficha projetada');
  assert.ok(p.KF.adicionar(item('Virotes/Flechas')), 'um mutador grava');
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 6);
  assert.ok(st.escritas.length > 0);
  assert.deepEqual(st.escritas.filter((e) => e[1] !== LS), [], 'só a chave v2');
  assert.deepEqual([st.getItem(INDICE), st.getItem(FICHA + 'fborin3'), st.getItem(DONO)], v3antes.concat('v3-dupla'));
  // o mesmo valor chegando pelo evento storage não troca o modo
  const nEventos = p.eventos.length;
  p.win('storage', { key: DONO, oldValue: null, newValue: 'v3-dupla' });
  assert.equal(p.eventos.length, nEventos, 'nenhum kf:mudou de dono');
  assert.ok(p.KF.adicionar(item('Virotes/Flechas')));
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 7);
  // F5: o marcador passa a 'v3'
  st.setItem(DONO, 'v3');
  p.win('storage', { key: DONO, oldValue: 'v3-dupla', newValue: 'v3' });
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(p.faixas().length, 1);
  st.escritas.length = 0;
  assert.equal(p.KF.adicionar(item('Virotes/Flechas')), null);
  p.win('pagehide'); p.rodaTimers();
  assert.deepEqual(st.escritas, []);
  assert.equal(JSON.parse(st.getItem(LS)).inventario.bugigangas[0].qtd, 7);
});

test('aba v2 gravando depois do import (F3): vínculo {revV2, salvoEmV2}; com o marcador a aba velha não grava', () => {
  // A F4 ("Migrar") importa a v2 como UMA ficha do índice e só então grava o
  // marcador. A aba v2 que estava aberta não recebe o evento storage (segundo
  // plano): cada caminho de escrita dela confere o marcador antes de gravar.
  const migrar = (st) => {
    const arm = KhEstado.armazem(st, null, { calculado: () => ({}) });
    const r = arm.importar(st.getItem(LS));
    assert.equal(r.ok, true, r.erro);
    assert.equal(arm.listar().length, 1, 'a v2 vira uma ficha do índice');
    return { arm, id: r.ids[0] };
  };
  const st = armazenamento();
  const aba = pagina(st);
  aba.KF.adicionar(item('Kali'), { qtd: 2 });
  // campo digitado que ainda está no debounce quando a v3 importa
  const nome = aba.dom.criados.find((e) => e.tagName === 'INPUT' && e.getAttribute('type') === 'text');
  nome.value = 'Digitado tarde';
  nome.dispatchEvent({ type: 'input', target: nome });
  const v2 = JSON.parse(st.getItem(LS));
  const { arm, id } = migrar(st);
  assert.deepEqual(arm.ler(id).vinculoV2, { revV2: v2.rev, salvoEmV2: v2.salvoEm });
  st.setItem(DONO, 'v3');
  const antes = st.foto();
  st.escritas.length = 0;
  aba.rodaTimers();                                     // o debounce vence
  assert.equal(aba.KF.adicionar(item('Kali')), null);
  aba.win('pagehide'); aba.rodaTimers();
  assert.deepEqual(st.escritas, [], 'nem o debounce, nem o mutador, nem o pagehide');
  assert.equal(st.foto(), antes);
  assert.equal(aba.KF.somenteLeitura(), true);
  assert.equal(JSON.parse(st.getItem(LS)).rev, arm.ler(id).vinculoV2.revV2, 'a v2 não andou: nada a reimportar');

  // Na janela entre o import e o marcador a aba ainda grava: a escrita fica só
  // na chave v2 e aparece no rev acima do revV2 do vínculo (é o que a F4 usa
  // para oferecer "reimportar alterações da v2", com download antes).
  const st2 = armazenamento();
  const aba2 = pagina(st2);
  aba2.KF.adicionar(item('Kali'), { qtd: 2 });
  const m2 = migrar(st2);
  const v3antes = [st2.getItem(INDICE), st2.getItem(FICHA + m2.id)];
  assert.ok(aba2.KF.adicionar(item('Kali')), 'sem marcador ainda: grava');
  st2.setItem(DONO, 'v3');
  const vinc = m2.arm.ler(m2.id).vinculoV2;
  assert.ok(JSON.parse(st2.getItem(LS)).rev > vinc.revV2, 'rev da v2 acima do vínculo');
  assert.equal(JSON.parse(st2.getItem(LS)).inventario.bugigangas[0].qtd, 3);
  assert.deepEqual([st2.getItem(INDICE), st2.getItem(FICHA + m2.id)], v3antes, 'a v2 nunca escreve nas chaves v3');
  assert.equal(m2.arm.ler(m2.id).inventario.bugigangas[0].qtd, 2, 'a ficha v3 segue com o que foi importado');
  st2.escritas.length = 0;
  assert.equal(aba2.KF.adicionar(item('Kali')), null, 'depois do marcador, nem essa aba grava');
  assert.deepEqual(st2.escritas, []);
});

test('em só-leitura o botão Importar nem abre o seletor de arquivo', () => {
  const st = armazenamento({ [DONO]: 'v3' });
  const p = pagina(st);
  assert.equal(p.importar({ schemaVersion: '2.0', meta: { nome: 'X' } }), false);
  assert.equal(p.toasts().pop(), MSG_RO);
  assert.deepEqual(st.escritas, []);
});

test('em só-leitura os controles do drawer ficam desabilitados, menos os da faixa', () => {
  const st = armazenamento({ [DONO]: 'v3' });
  const p = pagina(st);
  const ctl = p.dom.criados.filter((e) => ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.tagName) &&
    !e.hasAttribute('data-kf-ro') && e.parentElement && e.getAttribute('type') !== 'file');
  const noCorpo = ctl.filter((e) => { let n = e; while (n.parentElement) { if (n.getAttribute('id') === 'kf-body') return true; n = n.parentElement; } return false; });
  assert.ok(noCorpo.length > 20, 'há controles no corpo do drawer');
  assert.deepEqual(noCorpo.filter((e) => !e.disabled).map((e) => e.tagName), []);
  assert.equal(p.botao('Voltar a usar a v2').disabled, false);
});

test('stepper do drawer com marcador gravado sem evento: aviso de só-leitura, sem toast vazio', () => {
  const st = armazenamento();
  fichaV2(st);                 // 5 Virotes/Flechas, desenhados no drawer desta página
  const p = pagina(st);
  st.setItem(DONO, 'v3');
  st.escritas.length = 0;
  const mais = p.dom.criados.filter((e) => e.tagName === 'BUTTON' && e.getAttribute('data-ctl') === 'mais').pop();
  assert.ok(mais, 'stepper + existe');
  mais.click();
  assert.equal(p.KF.somenteLeitura(), true);
  assert.equal(p.toasts().pop(), MSG_RO, 'o último toast é o de só-leitura');
  assert.ok(!p.toasts().includes(''), 'nenhum toast vazio');
  assert.equal(p.KF.inventario().bugigangas[0].qtd, 5);
  assert.deepEqual(st.escritas, []);
});
