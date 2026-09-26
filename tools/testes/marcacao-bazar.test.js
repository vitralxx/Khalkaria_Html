'use strict';
// F1a no Bazar: o card (<article>) e a linha da Lista (<tr>) nascem no
// js/bazar.js, fora do alcance do [ids] do validar (que lê pages/*.html).
// Aqui o render roda de verdade sobre todo item do data/bazar.json:
//  - <article> e <tr> com data-kf-tipo="item" data-kf-id="<id do item>";
//  - exatamente um .ent-add e um .ent-alca por card/linha, ambos hidden até a F4;
//  - no <article> o par são os primeiros filhos; na <tr>, os primeiros do .c-nome-in.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..', '..');
const SRC = fs.readFileSync(path.join(RAIZ, 'js', 'bazar.js'), 'utf8');
const ITENS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'bazar.json'), 'utf8'));

// O bloco de render (seloHTML .. linhasHTML) é interno da IIFE: isolado do
// fonte, com stubs só para o que não é marcação.
function carregaRender() {
  const m = SRC.match(/\n {2}function seloHTML\(id\) \{[\s\S]*?\n(?= {2}function nFiltros\(\) \{)/);
  assert.ok(m, 'bloco seloHTML..linhasHTML não encontrado em js/bazar.js');
  const stubs = [
    'var BZ = { selecionado: null }, E = { mods: {}, ordem: "nome", dir: 1 };',
    'function tenho() { return 0; }',
    'function alcance() { return ""; }',
    'function arte() { return ""; }',
    'function svg() { return ""; }',
    'function icoRar() { return ""; }',
    'function classeRar(r) { return "rar-x"; }',
    'function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")' +
      '.replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }'
  ].join('\n');
  return new Function(stubs + m[0] + '; return { cardHTML: cardHTML, linhasHTML: linhasHTML };')();
}

const PAR = /^<button type="button" class="ent-add" hidden aria-keyshortcuts="A" aria-label="[^"]*"><\/button><span class="ent-alca" hidden aria-hidden="true"><\/span>/;
const conta = (h, re) => (h.match(re) || []).length;

function confereMarcacao(h, tagCard, it, onde) {
  const abre = h.match(new RegExp('^<' + tagCard + ' [^>]*>'));
  assert.ok(abre, `${it.id}: ${onde} não começa com <${tagCard}>`);
  assert.ok(abre[0].includes(' data-kf-tipo="item" data-kf-id="' + it.id + '"'), `${it.id}: ${onde} sem data-kf-*`);
  assert.equal(conta(h, /data-kf-id="/g), 1, `${it.id}: ${onde} com data-kf-id repetido`);
  assert.equal(conta(h, /class="ent-add"/g), 1, `${it.id}: ${onde} sem exatamente um .ent-add`);
  assert.equal(conta(h, /class="ent-alca"/g), 1, `${it.id}: ${onde} sem exatamente uma .ent-alca`);
  return abre[0];
}

test('Bazar: card e linha da Lista marcados, com botão e alça hidden', () => {
  const R = carregaRender();
  assert.ok(ITENS.length > 600, `data/bazar.json com só ${ITENS.length} itens`);
  for (const [i, it] of ITENS.entries()) {
    assert.match(it.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `id inválido: ${it.id}`);

    const card = R.cardHTML(it, i);
    const abre = confereMarcacao(card, 'article', it, 'card');
    assert.match(card.slice(abre.length), PAR, `${it.id}: botão + alça não são os primeiros filhos do card`);

    const linha = R.linhasHTML([it]);
    confereMarcacao(linha, 'tr', it, 'linha');
    const nome = linha.indexOf('<div class="c-nome-in">');
    assert.ok(nome > 0, `${it.id}: linha sem .c-nome-in`);
    assert.match(linha.slice(nome + '<div class="c-nome-in">'.length), PAR,
      `${it.id}: botão + alça não são os primeiros filhos do .c-nome-in`);
  }
});
