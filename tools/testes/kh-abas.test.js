'use strict';
// js/ficha/kh-abas.js (F4.5): a lista de abas reordenável da página da ficha
// (e do drawer da F4.4). Ordem por navegador em localStorage khalkaria_ficha_abas,
// aba aberta em sessionStorage khalkaria_ficha_aba; setas trocam de aba,
// Alt+setas (KhTeclas) e o arrasto (pointer events, com limiar) movem; "Ordem
// do A4" restaura. Sobre um DOM mínimo de mentira que sabe a ordem dos filhos e
// faz o layout das abas (com quebra de linha), e o KhTeclas de verdade.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const RAIZ = path.join(__dirname, '..', '..');
const KA = require('../../js/ficha/kh-abas.js');
const UI = require('../../js/kh-ui.js');

const A4 = ['nucleo', 'tecnicas', 'cartas', 'bazar', 'grimorio'];
const ROTULOS = { nucleo: 'Núcleo', tecnicas: 'Técnicas & Marcas', cartas: 'Cartas, Lore & Outros', bazar: 'O Bazar', grimorio: 'Grimório' };
// larguras diferentes de propósito (o meio de cada aba muda quando outra passa)
const LARGURA = { nucleo: 100, tecnicas: 200, cartas: 220, bazar: 110, grimorio: 120 };
const ALTURA = 36, VAO = 4, LINHA = 40;

// ---------------------------------------------------------------- DOM mínimo
class No {
  constructor(doc, tag, attrs) {
    this.doc = doc; this.tagName = tag.toUpperCase(); this.attrs = Object.assign({}, attrs || {});
    this.filhos = []; this.pai = null; this.ouv = {}; this.style = {}; this.hidden = false;
    this.textContent = ''; this.disabled = false; this.insercoes = 0;
  }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  removeAttribute(k) { delete this.attrs[k]; }
  hasAttribute(k) { return k in this.attrs; }
  appendChild(f) { if (f.pai) f.pai.filhos.splice(f.pai.filhos.indexOf(f), 1); f.pai = this; this.filhos.push(f); return f; }
  insertBefore(f, ref) {
    if (!ref) return this.appendChild(f);
    assert.equal(ref.pai, this, 'insertBefore: a referência é filha da lista');
    this.insercoes++;
    // mover o elemento focado tira o foco dele (como no navegador)
    if (this.doc.activeElement === f) this.doc.activeElement = this.doc.body;
    f.pai.filhos.splice(f.pai.filhos.indexOf(f), 1);
    this.filhos.splice(this.filhos.indexOf(ref), 0, f);
    f.pai = this;
    return f;
  }
  querySelectorAll(sel) {
    assert.equal(sel, '[role="tab"]', 'seletor não previsto: ' + sel);
    const out = [];
    (function anda(n) { n.filhos.forEach((f) => { if (f.attrs.role === 'tab') out.push(f); anda(f); }); })(this);
    return out;
  }
  closest(sel) {
    assert.equal(sel, '[role="tab"]', 'seletor não previsto: ' + sel);
    for (let n = this; n; n = n.pai) if (n.attrs && n.attrs.role === 'tab') return n;
    return null;
  }
  addEventListener(t, f, o) { (this.ouv[t] = this.ouv[t] || []).push({ f, cap: o === true || !!(o && o.capture) }); }
  removeEventListener(t, f, o) {
    const cap = o === true || !!(o && o.capture);
    this.ouv[t] = (this.ouv[t] || []).filter((x) => x.f !== f || x.cap !== cap);
  }
  focus() { this.doc.activeElement = this; }
  // layout: as abas da lista em linha, da esquerda para a direita, quebrando
  // quando passam da largura da lista; deslocamento do style.transform somado
  getBoundingClientRect() {
    const lista = this.pai, W = lista.largura || 10000;
    let x = 0, y = 0;
    for (const t of lista.filhos) {
      const w = LARGURA[t.attrs['data-aba']] || 100;
      if (x > 0 && x + w > W) { x = 0; y += LINHA; }
      if (t === this) {
        const m = /translateX\((-?\d+)px\)/.exec(this.style.transform || '');
        const dx = m ? Number(m[1]) : 0;
        return { left: x + dx, right: x + dx + w, top: y, bottom: y + ALTURA, width: w, height: ALTURA };
      }
      x += w + VAO;
    }
    throw new Error('aba fora da lista');
  }
}

function evento(tipo, props) {
  return Object.assign({ type: tipo, defaultPrevented: false, propagou: true,
    preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.propagou = false; } }, props);
}
// despacho com captura e bolha: document (captura) -> ancestrais (captura) -> alvo -> ancestrais (bolha) -> document (bolha)
function despacha(doc, alvo, ev) {
  ev.target = alvo;
  const cadeia = [];
  for (let n = alvo; n; n = n.pai) cadeia.push(n);
  const roda = (n, cap) => { for (const o of (n.ouv[ev.type] || []).filter((x) => x.cap === cap)) { if (!ev.propagou) return; o.f(ev); } };
  roda(doc, true);
  for (let i = cadeia.length - 1; i >= 0 && ev.propagou; i--) roda(cadeia[i], true);
  for (let i = 0; i < cadeia.length && ev.propagou; i++) roda(cadeia[i], false);
  if (ev.propagou) roda(doc, false);
  return ev;
}

function loja(inicial, opc) {
  const m = new Map(Object.entries(inicial || {})), escritas = [];
  return {
    escritas,
    getItem: (k) => { if (opc && opc.bloqueada) throw new Error('bloqueado'); return m.has(k) ? m.get(k) : null; },
    setItem: (k, v) => { if (opc && (opc.bloqueada || opc.cheia)) throw new Error('QuotaExceededError'); escritas.push(k + '=' + v); m.set(k, String(v)); },
    removeItem: (k) => { if (opc && opc.bloqueada) throw new Error('bloqueado'); escritas.push('-' + k); m.delete(k); },
    valor: (k) => (m.has(k) ? m.get(k) : null)
  };
}

// a página: lista com as 5 abas (na ordem dada), os painéis, o botão de restaurar e o aviso
function monta(opc) {
  opc = opc || {};
  const doc = { ouv: {}, activeElement: null, porId: new Map(), documentElement: null };
  doc.addEventListener = No.prototype.addEventListener;
  doc.removeEventListener = No.prototype.removeEventListener;
  doc.getElementById = (id) => doc.porId.get(id) || null;
  const html = new No(doc, 'html'); doc.documentElement = html;
  if (opc.reduzido) html.setAttribute('data-movimento', 'reduzido');
  const body = new No(doc, 'body'); html.appendChild(body); doc.body = body; doc.activeElement = body;
  const lista = new No(doc, 'div', { role: 'tablist', id: 'fp-abas' });
  lista.largura = opc.largura || 10000;
  body.appendChild(lista);
  const pref = opc.prefixo || 'fp';
  const abas = {}, paineis = {};
  (opc.marcacao || A4).forEach((id) => {
    const t = new No(doc, 'button', { role: 'tab', 'data-aba': id, id: pref + '-aba-' + id, 'aria-controls': pref + '-painel-' + id });
    t.appendChild(new No(doc, 'span'));            // o número da página, dentro do botão
    t.textContent = ROTULOS[id] || id;
    if (opc.animar) { t.animacoes = []; t.animate = (q, o) => { t.animacoes.push({ q, o }); }; }
    lista.appendChild(t); abas[id] = t;
    const p = new No(doc, 'section', { role: 'tabpanel', id: pref + '-painel-' + id });
    body.appendChild(p); doc.porId.set(p.attrs.id, p); paineis[id] = p;
  });
  const restaurar = new No(doc, 'button', { id: pref + '-abas-a4' });
  const anuncio = new No(doc, 'span', { role: 'status' });
  const fora = new No(doc, 'button', { id: 'fora' });
  body.appendChild(restaurar); body.appendChild(anuncio); body.appendChild(fora);
  const ls = opc.ls || loja(opc.ordem ? { khalkaria_ficha_abas: opc.ordem } : {});
  const ss = opc.ss || loja(opc.aba ? { khalkaria_ficha_aba: opc.aba } : {});
  const ouvWin = {};
  const win = {
    addEventListener: (t, f) => { (ouvWin[t] = ouvWin[t] || []).push(f); },
    removeEventListener: (t, f) => { ouvWin[t] = (ouvWin[t] || []).filter((x) => x !== f); },
    setTimeout: () => 0
  };
  const teclas = opc.teclas || UI.criaTeclas(doc);
  const mudancas = [], selecoes = [];
  const op = Object.assign({ win, doc, ids: A4, ls, ss, teclas, rotulos: ROTULOS, restaurar, anuncio,
    textoRestaurada: 'Ordem do A4 restaurada.',
    aoMudarOrdem: (o) => mudancas.push(o), aoSelecionar: (id) => selecoes.push(id) }, opc.op || {});
  const api = KA.criar(lista, op);
  return { doc, html, body, lista, abas, paineis, restaurar, anuncio, fora, ls, ss, win, ouvWin, teclas, api, mudancas, selecoes };
}
const dom = (a) => a.lista.filhos.map((t) => t.attrs['data-aba']);
const tecla = (a, alvo, key, extra) => despacha(a.doc, alvo, evento('keydown', Object.assign({ key }, extra)));
function centro(a, id) { const r = a.abas[id].getBoundingClientRect(); return { x: (r.left + r.right) / 2, y: (r.top + r.bottom) / 2 }; }
const ptr = (a, tipo, alvo, x, y, extra) => despacha(a.doc, alvo, evento(tipo, Object.assign({ pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: tipo === 'pointerup' ? 0 : 1, clientX: x, clientY: y }, extra)));
// arrasta a aba id até o ponto (x, y), em passos; devolve o evento do pointerup
function arrasta(a, id, x, y, op) {
  op = op || {};
  const c = centro(a, id);
  ptr(a, 'pointerdown', a.abas[id], c.x, c.y);
  const passos = op.passos || 4;
  for (let i = 1; i <= passos; i++) ptr(a, 'pointermove', a.abas[id], c.x + (x - c.x) * i / passos, c.y + (y - c.y) * i / passos);
  if (op.semSoltar) return null;
  return ptr(a, 'pointerup', a.abas[id], x, y);
}
function confereSelecao(a, id) {
  A4.forEach((k) => {
    assert.equal(a.abas[k].getAttribute('aria-selected'), k === id ? 'true' : 'false', 'aria-selected ' + k);
    assert.equal(a.abas[k].getAttribute('tabindex'), k === id ? '0' : '-1', 'tabindex ' + k);
    assert.equal(a.paineis[k].hidden, k !== id, 'painel ' + k);
    assert.equal(a.abas[k].getAttribute('aria-controls'), 'fp-painel-' + k, 'aria-controls ' + k);
  });
}

// ================================================================ puras
test('normaliza: lista inválida volta à ordem do A4; incompleta mantém o que conhece e põe as novas no fim', () => {
  const casos = [
    [null, A4], [undefined, A4], ['nucleo', A4], [{ a: 1 }, A4], [[], A4], [[1, 2, null, {}], A4],
    [['grimorio'], ['grimorio', 'nucleo', 'tecnicas', 'cartas', 'bazar']],
    [['bazar', 'x', 'bazar', 'grimorio', 7], ['bazar', 'grimorio', 'nucleo', 'tecnicas', 'cartas']],
    [['grimorio', 'bazar', 'cartas', 'tecnicas', 'nucleo'], ['grimorio', 'bazar', 'cartas', 'tecnicas', 'nucleo']],
    // aba que deixou de existir sai; aba nova entra no fim
    [['velha', 'cartas', 'nucleo'], ['cartas', 'nucleo', 'tecnicas', 'bazar', 'grimorio']]
  ];
  for (const [salva, esperado] of casos) assert.deepEqual(KA.normaliza(salva, A4), esperado, JSON.stringify(salva));
});

test('lerOrdem: JSON corrompido, tipo errado ou storage bloqueado não quebram (ordem do A4)', () => {
  for (const v of ['{', 'null', '"nucleo"', '[1,2]', '{"a":1}', '', 'undefined', '[]', '["nada"]']) {
    assert.deepEqual(KA.lerOrdem(loja({ khalkaria_ficha_abas: v }), A4), A4, v);
  }
  assert.deepEqual(KA.lerOrdem(loja(), A4), A4, 'sem chave');
  assert.deepEqual(KA.lerOrdem(null, A4), A4, 'sem storage');
  assert.deepEqual(KA.lerOrdem(loja({ khalkaria_ficha_abas: '["x"]' }, { bloqueada: true }), A4), A4, 'bloqueado');
  assert.deepEqual(KA.lerOrdem(loja({ khalkaria_ficha_abas: '["cartas","grimorio"]' }), A4), ['cartas', 'grimorio', 'nucleo', 'tecnicas', 'bazar']);
  // outra chave (o drawer pode ter a sua)
  assert.deepEqual(KA.lerOrdem(loja({ outra: '["bazar"]' }), A4, 'outra')[0], 'bazar');
});

test('gravarOrdem: grava a lista de ids; a ordem do A4 apaga a chave; storage cheio não quebra', () => {
  const ls = loja();
  assert.equal(KA.gravarOrdem(ls, ['bazar', 'nucleo'], A4), true);
  assert.equal(ls.valor('khalkaria_ficha_abas'), JSON.stringify(['bazar', 'nucleo', 'tecnicas', 'cartas', 'grimorio']));
  assert.equal(KA.gravarOrdem(ls, A4.slice(), A4), true);
  assert.equal(ls.valor('khalkaria_ficha_abas'), null);
  assert.deepEqual(ls.escritas, ['khalkaria_ficha_abas=["bazar","nucleo","tecnicas","cartas","grimorio"]', '-khalkaria_ficha_abas']);
  assert.equal(KA.gravarOrdem(loja({}, { cheia: true }), ['bazar'], A4), false);
  assert.equal(KA.gravarOrdem(null, ['bazar'], A4), false);
});

test('aba aberta: lerAberta só aceita id conhecido; gravarAberta tolera storage bloqueado', () => {
  assert.equal(KA.lerAberta(loja({ khalkaria_ficha_aba: 'bazar' }), A4), 'bazar');
  assert.equal(KA.lerAberta(loja({ khalkaria_ficha_aba: 'xpto' }), A4), null);
  assert.equal(KA.lerAberta(loja(), A4), null);
  assert.equal(KA.lerAberta(loja({}, { bloqueada: true }), A4), null);
  const ss = loja();
  assert.equal(KA.gravarAberta(ss, 'cartas'), true);
  assert.equal(ss.valor('khalkaria_ficha_aba'), 'cartas');
  assert.equal(KA.gravarAberta(loja({}, { bloqueada: true }), 'cartas'), false);
});

test('mover e moverPara: uma casa, limitado às pontas; id desconhecido não muda nada', () => {
  assert.deepEqual(KA.mover(A4, 'cartas', -1), ['nucleo', 'cartas', 'tecnicas', 'bazar', 'grimorio']);
  assert.deepEqual(KA.mover(A4, 'cartas', 1), ['nucleo', 'tecnicas', 'bazar', 'cartas', 'grimorio']);
  assert.deepEqual(KA.mover(A4, 'nucleo', -1), A4);
  assert.deepEqual(KA.mover(A4, 'grimorio', 1), A4);
  assert.deepEqual(KA.mover(A4, 'xpto', 1), A4);
  assert.deepEqual(KA.moverPara(A4, 'grimorio', 0), ['grimorio', 'nucleo', 'tecnicas', 'cartas', 'bazar']);
  assert.deepEqual(KA.moverPara(A4, 'nucleo', 99), ['tecnicas', 'cartas', 'bazar', 'grimorio', 'nucleo']);
});

test('alvoArrasto: pelo centro das outras abas, linha a linha; y preso à faixa das abas', () => {
  const r = (left, top, w) => ({ left, right: left + w, top, bottom: top + 36, width: w, height: 36 });
  const linha = [r(0, 0, 100), r(104, 0, 200), r(308, 0, 100)];
  assert.equal(KA.alvoArrasto(linha, 10, 18), 0);
  assert.equal(KA.alvoArrasto(linha, 60, 18), 1);
  assert.equal(KA.alvoArrasto(linha, 203, 18), 1);
  assert.equal(KA.alvoArrasto(linha, 205, 18), 2);
  assert.equal(KA.alvoArrasto(linha, 999, 18), 3);
  // acima ou abaixo da lista vale a linha mais próxima, não a ponta
  assert.equal(KA.alvoArrasto(linha, 205, -80), 2);
  assert.equal(KA.alvoArrasto(linha, 205, 300), 2);
  // duas linhas: à direita da 1ª linha entra antes da 1ª aba da 2ª
  const duas = [r(0, 0, 100), r(104, 0, 100), r(0, 40, 100), r(104, 40, 100)];
  assert.equal(KA.alvoArrasto(duas, 400, 18), 2);
  assert.equal(KA.alvoArrasto(duas, 10, 58), 2);
  assert.equal(KA.alvoArrasto(duas, 160, 58), 4);
  assert.equal(KA.alvoArrasto([], 1, 1), 0);
});

// ================================================================ a lista viva
test('criar: aria (selecionada, tabindex móvel, painéis), ordem do A4, "Ordem do A4" escondido; nada gravado', () => {
  const a = monta();
  assert.deepEqual(a.api.ordem(), A4);
  assert.deepEqual(dom(a), A4);
  assert.equal(a.api.aberta(), 'nucleo');
  confereSelecao(a, 'nucleo');
  assert.equal(a.restaurar.hidden, true);
  assert.deepEqual(a.ls.escritas, []);
  assert.deepEqual(a.ss.escritas, []);
  assert.equal(a.lista.insercoes, 0);
  a.api.destruir();
});

test('criar: a ordem guardada e a aba da sessão valem ao abrir (a marcação na ordem do A4 é reordenada), sem gravar', () => {
  const a = monta({ ordem: '["grimorio","bazar"]', aba: 'cartas' });
  assert.deepEqual(a.api.ordem(), ['grimorio', 'bazar', 'nucleo', 'tecnicas', 'cartas']);
  assert.deepEqual(dom(a), a.api.ordem());
  assert.equal(a.api.aberta(), 'cartas');
  confereSelecao(a, 'cartas');
  assert.equal(a.restaurar.hidden, false);
  assert.deepEqual(a.ls.escritas, []);
  assert.deepEqual(a.ss.escritas, []);
  a.api.destruir();
  // lista corrompida: ordem do A4; aba da sessão desconhecida: a 1ª da ordem
  const b = monta({ ordem: '{"nucleo":', aba: 'xpto' });
  assert.deepEqual(dom(b), A4);
  confereSelecao(b, 'nucleo');
  assert.deepEqual(b.ls.escritas, []);
  b.api.destruir();
  // 'aberta' dada por quem cria vence a da sessão
  const c = monta({ aba: 'cartas', op: { aberta: 'bazar' } });
  confereSelecao(c, 'bazar');
  c.api.destruir();
});

test('teclado: setas trocam de aba com volta, Home e End; foco segue; a sessão grava só quando muda', () => {
  const a = monta({ ordem: '["grimorio"]' });
  a.abas.grimorio.focus();
  confereSelecao(a, 'grimorio');
  assert.ok(tecla(a, a.abas.grimorio, 'ArrowRight').defaultPrevented);
  confereSelecao(a, 'nucleo');
  assert.equal(a.doc.activeElement, a.abas.nucleo);
  tecla(a, a.abas.nucleo, 'ArrowLeft');
  confereSelecao(a, 'grimorio');
  tecla(a, a.abas.grimorio, 'ArrowLeft');            // volta: da 1ª para a última da ORDEM
  confereSelecao(a, 'bazar');
  tecla(a, a.abas.bazar, 'Home');
  confereSelecao(a, 'grimorio');
  tecla(a, a.abas.grimorio, 'End');
  confereSelecao(a, 'bazar');
  assert.deepEqual(a.ss.escritas, ['khalkaria_ficha_aba=nucleo', 'khalkaria_ficha_aba=grimorio', 'khalkaria_ficha_aba=bazar',
    'khalkaria_ficha_aba=grimorio', 'khalkaria_ficha_aba=bazar']);
  assert.deepEqual(a.selecoes, ['nucleo', 'grimorio', 'bazar', 'grimorio', 'bazar']);
  // Shift/Ctrl+seta e outras teclas: nada
  assert.ok(!tecla(a, a.abas.bazar, 'ArrowRight', { shiftKey: true }).defaultPrevented);
  assert.ok(!tecla(a, a.abas.bazar, 'ArrowRight', { ctrlKey: true }).defaultPrevented);
  assert.ok(!tecla(a, a.abas.bazar, 'a').defaultPrevented);
  confereSelecao(a, 'bazar');
  // clique
  despacha(a.doc, a.abas.cartas.filhos[0], evento('click'));   // no número, dentro do botão
  confereSelecao(a, 'cartas');
  despacha(a.doc, a.abas.cartas, evento('click'));             // a mesma: não grava de novo
  assert.equal(a.ss.escritas.length, 6);
  assert.deepEqual(a.ls.escritas, [], 'trocar de aba não mexe na ordem');
  a.api.destruir();
});

test('Alt+← / Alt+→ (KhTeclas) movem a aba focada, gravam a ordem, avisam e mantêm o foco', () => {
  const a = monta();
  assert.ok(a.teclas.lista().some((x) => x.tecla === 'Alt+ArrowLeft'), 'atalho registrado no KhTeclas');
  assert.ok(a.teclas.lista().some((x) => x.tecla === 'Alt+ArrowRight'));
  a.abas.cartas.focus();
  despacha(a.doc, a.abas.cartas, evento('click'));
  const ev = tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true });
  assert.ok(ev.defaultPrevented);
  assert.deepEqual(dom(a), ['nucleo', 'cartas', 'tecnicas', 'bazar', 'grimorio']);
  assert.deepEqual(a.api.ordem(), dom(a));
  assert.equal(a.doc.activeElement, a.abas.cartas, 'o foco fica na aba movida');
  assert.equal(a.ls.valor('khalkaria_ficha_abas'), '["nucleo","cartas","tecnicas","bazar","grimorio"]');
  assert.equal(a.anuncio.textContent, 'Cartas, Lore & Outros: posição 2 de 5.');
  assert.equal(a.restaurar.hidden, false);
  confereSelecao(a, 'cartas');
  tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true });
  assert.deepEqual(dom(a), ['cartas', 'nucleo', 'tecnicas', 'bazar', 'grimorio']);
  // na ponta: consome (Alt+← voltaria a página) e só avisa
  const n = a.ls.escritas.length;
  assert.ok(tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true }).defaultPrevented);
  assert.deepEqual(dom(a), ['cartas', 'nucleo', 'tecnicas', 'bazar', 'grimorio']);
  assert.equal(a.ls.escritas.length, n);
  assert.equal(a.anuncio.textContent, 'Cartas, Lore & Outros já é a primeira aba.');
  for (let i = 0; i < 4; i++) tecla(a, a.abas.cartas, 'ArrowRight', { altKey: true });
  assert.deepEqual(dom(a), ['nucleo', 'tecnicas', 'bazar', 'grimorio', 'cartas']);
  assert.ok(tecla(a, a.abas.cartas, 'ArrowRight', { altKey: true }).defaultPrevented);
  assert.equal(a.anuncio.textContent, 'Cartas, Lore & Outros já é a última aba.');
  assert.equal(a.doc.activeElement, a.abas.cartas);
  assert.equal(a.mudancas.length, 6);
  // fora da lista, com Shift junto, ou com o foco em outro lugar: o Alt+seta é do navegador
  assert.ok(!tecla(a, a.fora, 'ArrowLeft', { altKey: true }).defaultPrevented);
  assert.ok(!tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true, shiftKey: true }).defaultPrevented);
  assert.deepEqual(dom(a), ['nucleo', 'tecnicas', 'bazar', 'grimorio', 'cartas']);
  a.api.destruir();
  // destruída, a lista não responde mais
  assert.ok(!tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true }).defaultPrevented);
});

test('arrasto: abaixo do limiar é clique; passando, as abas trocam ao vivo e a ordem grava ao soltar', () => {
  const a = monta();
  // tremida de 3px: clique comum, troca de aba e não mexe na ordem
  const c = centro(a, 'bazar');
  ptr(a, 'pointerdown', a.abas.bazar, c.x, c.y);
  ptr(a, 'pointermove', a.abas.bazar, c.x + 3, c.y + 2);
  assert.equal(a.lista.hasAttribute('data-arrastando'), false);
  ptr(a, 'pointerup', a.abas.bazar, c.x + 3, c.y + 2);
  despacha(a.doc, a.abas.bazar, evento('click'));
  confereSelecao(a, 'bazar');
  assert.deepEqual(dom(a), A4);
  assert.deepEqual(a.ls.escritas, []);

  // arrasta o Grimório para antes de Técnicas, sem soltar
  const t = centro(a, 'tecnicas');
  arrasta(a, 'grimorio', t.x - 30, t.y, { semSoltar: true });
  assert.ok(a.api.arrastando());
  assert.ok(a.lista.hasAttribute('data-arrastando'));
  assert.ok(a.abas.grimorio.hasAttribute('data-arrastada'));
  assert.deepEqual(dom(a), ['nucleo', 'grimorio', 'tecnicas', 'cartas', 'bazar'], 'troca ao vivo');
  assert.deepEqual(a.ls.escritas, [], 'nada gravado antes de soltar');
  assert.equal(a.restaurar.hidden, true, 'o "Ordem do A4" não aparece no meio do arrasto (refluiria a lista)');
  // a aba segue o ponteiro (translateX) por cima do seu lugar
  assert.match(a.abas.grimorio.style.transform, /^translateX\(-?\d+px\)$/);
  const r = a.abas.grimorio.getBoundingClientRect();
  assert.ok(Math.abs((r.left + r.right) / 2 - (t.x - 30)) <= 1, 'o centro da aba fica sob o ponteiro');
  // solta: grava, limpa as marcas, avisa
  ptr(a, 'pointerup', a.abas.grimorio, t.x - 30, t.y);
  assert.equal(a.api.arrastando(), false);
  assert.equal(a.lista.hasAttribute('data-arrastando'), false);
  assert.equal(a.abas.grimorio.hasAttribute('data-arrastada'), false);
  assert.equal(a.abas.grimorio.style.transform, '');
  assert.equal(a.ls.valor('khalkaria_ficha_abas'), '["nucleo","grimorio","tecnicas","cartas","bazar"]');
  assert.equal(a.ls.escritas.length, 1, 'uma escrita por arrasto, não por troca');
  assert.equal(a.restaurar.hidden, false, 'ao soltar, o "Ordem do A4" aparece');
  assert.equal(a.anuncio.textContent, 'Grimório: posição 2 de 5.');
  assert.equal(a.mudancas.length, 1);
  // o clique que fecha o arrasto não troca de aba; o seguinte troca
  const ev = despacha(a.doc, a.abas.grimorio, evento('click'));
  assert.equal(ev.propagou, false);
  confereSelecao(a, 'bazar');
  despacha(a.doc, a.abas.grimorio, evento('click'));
  confereSelecao(a, 'grimorio');
  // arrastar e voltar ao mesmo lugar não grava
  const n = a.ls.escritas.length;
  const g = centro(a, 'grimorio');
  arrasta(a, 'grimorio', g.x + 400, g.y, { semSoltar: true });
  ptr(a, 'pointermove', a.abas.grimorio, g.x, g.y);
  ptr(a, 'pointerup', a.abas.grimorio, g.x, g.y);
  assert.deepEqual(dom(a), ['nucleo', 'grimorio', 'tecnicas', 'cartas', 'bazar']);
  assert.equal(a.ls.escritas.length, n);
  // o listener do document sai ao soltar
  assert.equal((a.doc.ouv.pointermove || []).length, 0);
  a.api.destruir();
});

test('arrasto: Esc, pointercancel e perder a janela desfazem; outro ponteiro e botão direito não contam', () => {
  const a = monta();
  const fim = centro(a, 'grimorio');
  arrasta(a, 'nucleo', fim.x + 80, fim.y, { semSoltar: true });
  assert.deepEqual(dom(a), ['tecnicas', 'cartas', 'bazar', 'grimorio', 'nucleo']);
  // Esc: a camada do KhTeclas desfaz o arrasto e consome
  const esc = tecla(a, a.abas.nucleo, 'Escape');
  assert.ok(esc.defaultPrevented);
  assert.deepEqual(dom(a), A4);
  assert.equal(a.api.arrastando(), false);
  assert.equal(a.anuncio.textContent, 'Arrasto desfeito.');
  assert.equal(a.restaurar.hidden, true);
  // o pointerup depois do Esc não faz nada
  ptr(a, 'pointerup', a.abas.nucleo, fim.x + 80, fim.y);
  assert.deepEqual(dom(a), A4);
  // Esc sem arrasto passa adiante
  assert.ok(!tecla(a, a.abas.nucleo, 'Escape').defaultPrevented);
  // pointercancel
  arrasta(a, 'nucleo', fim.x + 80, fim.y, { semSoltar: true });
  ptr(a, 'pointercancel', a.abas.nucleo, fim.x + 80, fim.y);
  assert.deepEqual(dom(a), A4);
  // a janela perde o foco no meio do arrasto
  arrasta(a, 'nucleo', fim.x + 80, fim.y, { semSoltar: true });
  a.ouvWin.blur.forEach((f) => f({ type: 'blur' }));
  assert.deepEqual(dom(a), A4);
  // outro pointerId não move nem solta
  arrasta(a, 'nucleo', fim.x + 80, fim.y, { semSoltar: true });
  ptr(a, 'pointerup', a.abas.nucleo, 0, 0, { pointerId: 2 });
  assert.ok(a.api.arrastando());
  ptr(a, 'pointercancel', a.abas.nucleo, 0, 0);
  // botão direito não começa arrasto
  const c = centro(a, 'nucleo');
  ptr(a, 'pointerdown', a.abas.nucleo, c.x, c.y, { button: 2 });
  ptr(a, 'pointermove', a.abas.nucleo, c.x + 300, c.y);
  assert.equal(a.api.arrastando(), false);
  assert.deepEqual(dom(a), A4);
  assert.deepEqual(a.ls.escritas, [], 'nada gravado');
  a.api.destruir();
});

test('arrasto com a lista quebrada em linhas: entra pela linha do ponteiro', () => {
  // largura 450: [nucleo 100, tecnicas 200] / [cartas 220, bazar 110] / [grimorio 120]
  const a = monta({ largura: 450 });
  assert.equal(a.abas.cartas.getBoundingClientRect().top, 40);
  assert.equal(a.abas.grimorio.getBoundingClientRect().top, 80);
  // o Grimório (3ª linha) para o começo da 2ª: entra antes de Cartas
  const c = a.abas.cartas.getBoundingClientRect();
  arrasta(a, 'grimorio', c.left + 10, c.top + 18);
  assert.deepEqual(dom(a), ['nucleo', 'tecnicas', 'grimorio', 'cartas', 'bazar']);
  assert.equal(a.ls.valor('khalkaria_ficha_abas'), '["nucleo","tecnicas","grimorio","cartas","bazar"]');
  // o Núcleo para baixo e para a direita da última linha: vai para o fim
  arrasta(a, 'nucleo', 440, 200);
  assert.deepEqual(dom(a), ['tecnicas', 'grimorio', 'cartas', 'bazar', 'nucleo']);
  a.api.destruir();
});

test('"Ordem do A4" restaura, apaga a preferência, some e devolve o foco à aba aberta', () => {
  const a = monta({ ordem: '["grimorio","cartas"]', aba: 'cartas' });
  assert.equal(a.restaurar.hidden, false);
  a.restaurar.focus();
  despacha(a.doc, a.restaurar, evento('click'));
  assert.deepEqual(dom(a), A4);
  assert.deepEqual(a.api.ordem(), A4);
  assert.equal(a.ls.valor('khalkaria_ficha_abas'), null);
  assert.deepEqual(a.ls.escritas, ['-khalkaria_ficha_abas']);
  assert.equal(a.restaurar.hidden, true);
  assert.equal(a.doc.activeElement, a.abas.cartas);
  confereSelecao(a, 'cartas');
  assert.equal(a.anuncio.textContent, 'Ordem do A4 restaurada.');
  // de novo, já na ordem do A4: nada
  despacha(a.doc, a.restaurar, evento('click'));
  assert.deepEqual(a.ls.escritas, ['-khalkaria_ficha_abas']);
  // mover de volta à ordem do A4 pelo teclado também apaga a chave
  a.abas.cartas.focus();
  tecla(a, a.abas.cartas, 'ArrowRight', { altKey: true });
  tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true });
  assert.deepEqual(a.ls.escritas.slice(-2), ['khalkaria_ficha_abas=["nucleo","tecnicas","bazar","cartas","grimorio"]', '-khalkaria_ficha_abas']);
  assert.equal(a.restaurar.hidden, true);
  a.api.destruir();
});

test('persistência: a ordem gravada volta ao abrir de novo; storage cheio só não guarda', () => {
  const ls = loja(), ss = loja();
  const a = monta({ ls, ss });
  a.abas.bazar.focus();
  despacha(a.doc, a.abas.bazar, evento('click'));
  tecla(a, a.abas.bazar, 'ArrowLeft', { altKey: true });
  tecla(a, a.abas.bazar, 'ArrowLeft', { altKey: true });
  a.api.destruir();
  const b = monta({ ls, ss });   // "recarregar a página"
  assert.deepEqual(dom(b), ['nucleo', 'bazar', 'tecnicas', 'cartas', 'grimorio']);
  confereSelecao(b, 'bazar');
  b.api.destruir();
  const c = monta({ ls: loja({}, { cheia: true }) });
  c.abas.bazar.focus();
  tecla(c, c.abas.bazar, 'ArrowLeft', { altKey: true });
  assert.deepEqual(dom(c), ['nucleo', 'tecnicas', 'bazar', 'cartas', 'grimorio'], 'a ordem vale na página');
  c.api.destruir();
});

test('sincronia: o drawer e a página (mesma chave) andam juntos; outra janela pelo evento storage', () => {
  const ls = loja();
  const pagina = monta({ ls });
  const drawer = monta({ ls, prefixo: 'dr', teclas: pagina.teclas });
  // as duas no mesmo document de mentira não são o caso real; aqui basta a chave comum
  pagina.abas.grimorio.focus();
  tecla(pagina, pagina.abas.grimorio, 'ArrowLeft', { altKey: true });
  assert.deepEqual(dom(drawer), ['nucleo', 'tecnicas', 'cartas', 'grimorio', 'bazar'], 'o drawer acompanha');
  assert.equal(ls.escritas.length, 1, 'quem acompanha não grava');
  // outra janela gravou: o evento storage traz a ordem nova
  ls.setItem('khalkaria_ficha_abas', '["cartas"]');
  pagina.ouvWin.storage.forEach((f) => f({ key: 'khalkaria_ficha_abas' }));
  assert.deepEqual(dom(pagina), ['cartas', 'nucleo', 'tecnicas', 'bazar', 'grimorio']);
  pagina.ouvWin.storage.forEach((f) => f({ key: 'khalkaria_ficha' }));   // outra chave: nada
  assert.deepEqual(dom(pagina), ['cartas', 'nucleo', 'tecnicas', 'bazar', 'grimorio']);
  pagina.api.destruir();
  drawer.api.destruir();
});

test('movimento reduzido: sem a animação das abas que trocam de lugar', () => {
  const a = monta({ animar: true });
  a.abas.cartas.focus();
  tecla(a, a.abas.cartas, 'ArrowLeft', { altKey: true });
  assert.equal(a.abas.tecnicas.animacoes.length, 1, 'a vizinha desliza');
  assert.match(a.abas.tecnicas.animacoes[0].q[0].transform, /^translate\(-\d+px, 0px\)$/);
  assert.equal(a.abas.tecnicas.animacoes[0].o.duration, KA.DURACAO);
  a.api.destruir();
  const b = monta({ animar: true, reduzido: true });
  b.abas.cartas.focus();
  tecla(b, b.abas.cartas, 'ArrowLeft', { altKey: true });
  b.restaurar.focus();
  despacha(b.doc, b.restaurar, evento('click'));
  arrasta(b, 'nucleo', 900, 18);
  assert.ok(A4.every((id) => b.abas[id].animacoes.length === 0), 'nenhuma animação');
  b.api.destruir();
});

test('navegador (vm): o módulo registra window.KhAbas sem tocar em storage nem no document', () => {
  const toque = [];
  const proibido = new Proxy({}, { get: (_, k) => { toque.push(String(k)); throw new Error('tocado'); } });
  const win = { localStorage: proibido, sessionStorage: proibido, document: proibido };
  const sb = vm.createContext({ window: win });
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'ficha', 'kh-abas.js'), 'utf8'), sb, { filename: 'kh-abas.js' });
  assert.equal(typeof win.KhAbas.criar, 'function');
  assert.deepEqual(Object.keys(win.KhAbas).sort(), Object.keys(KA).sort());
  assert.deepEqual(toque, []);
  // no bundle, antes do drawer (ficha-v2.js) e do ficha-pagina.js, que o usam
  const ordem = fs.readFileSync(path.join(RAIZ, 'js', 'ficha', 'ORDEM'), 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  assert.ok(ordem.indexOf('kh-abas.js') >= 0 && ordem.indexOf('kh-abas.js') < ordem.indexOf('ficha-v2.js'));
  assert.ok(fs.readFileSync(path.join(RAIZ, 'js', 'ficha.js'), 'utf8').includes('// ==== js/ficha/kh-abas.js ===='));
});
