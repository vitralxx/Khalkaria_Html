'use strict';
// F1a: marcação entidade -> ficha e catálogo por tipo.
//  - textoLimpo (js/ficha.js) ignora o botão .ent-add e a alça .ent-alca: o
//    nome que a ficha v2.1 leva de um card novo é o mesmo de antes;
//  - data/catalogo/*.json: nenhum nome com emoji (o emoji vai para `icone`,
//    D29), ids únicos, raras só com id/tipo/nome/categoria/req (D11/D33);
//  - as páginas geradas trazem o mesmo nome que o catálogo em cada card.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..', '..');
const SRC = fs.readFileSync(path.join(RAIZ, 'js', 'ficha.js'), 'utf8');
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2300}-\u{23FF}\u{FE0F}]/u;

// textoLimpo isolado do ficha.js (não é exportado: é interno do drawer)
function carregaTextoLimpo() {
  const m = SRC.match(/function textoLimpo\(node\) \{[\s\S]*?\r?\n  \}\r?\n/);
  assert.ok(m, 'textoLimpo não encontrado em js/ficha.js');
  return new Function(m[0] + '; return textoLimpo;')();
}

// DOM mínimo: o que textoLimpo usa (cloneNode, querySelectorAll por classe/tag, remove, textContent)
function no(tag, classe, filhos) {
  const n = { tag, classe: classe || '', filhos: [], pai: null };
  (filhos || []).forEach((f) => { if (typeof f === 'object') f.pai = n; n.filhos.push(f); });
  n.cloneNode = () => clona(n, null);
  n.remove = () => { if (n.pai) n.pai.filhos = n.pai.filhos.filter((x) => x !== n); };
  n.querySelectorAll = (sel) => {
    const alvos = sel.split(',').map((s) => s.trim());
    const out = [];
    (function anda(x) {
      x.filhos.forEach((f) => {
        if (typeof f !== 'object') return;
        if (alvos.some((s) => (s[0] === '.' ? f.classe.split(' ').includes(s.slice(1)) : f.tag === s))) out.push(f);
        anda(f);
      });
    })(n);
    return out;
  };
  Object.defineProperty(n, 'textContent', {
    get() { return n.filhos.map((f) => (typeof f === 'object' ? f.textContent : f)).join(''); }
  });
  return n;
}
function clona(n, pai) {
  const c = no(n.tag, n.classe, []);
  c.pai = pai;
  c.filhos = n.filhos.map((f) => (typeof f === 'object' ? clona(f, c) : f));
  return c;
}

test('textoLimpo: .ent-add e .ent-alca não entram no nome', () => {
  const textoLimpo = carregaTextoLimpo();
  const antes = no('h4', '', ['🔹 Dardo Arcano']);
  // pior caso: botão e alça DENTRO do nó de nome, com texto
  const depois = no('h4', '', [no('button', 'ent-add', ['Levar para a ficha']), no('span', 'ent-alca', ['⋮⋮']),
    '🔹 Dardo Arcano']);
  assert.equal(textoLimpo(antes), 'Dardo Arcano');
  assert.equal(textoLimpo(depois), textoLimpo(antes));
  // o card original não é mexido (textoLimpo trabalha num clone)
  assert.equal(depois.filhos.length, 3);
});

function catalogo() {
  const dir = path.join(RAIZ, 'data', 'catalogo');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

test('catálogo: nome sem emoji, ícone separado, ids únicos', () => {
  const docs = catalogo();
  assert.ok(docs.length >= 14, 'catálogo incompleto: rode python tools/build.py');
  const vistos = new Map();
  for (const d of docs) {
    assert.equal(d.schema, 'catalogo/1');
    assert.equal(d.total, d.entradas.length);
    for (const e of d.entradas) {
      assert.equal(e.tipo, d.tipo, `${e.id}: tipo ${e.tipo} no arquivo ${d.tipo}`);
      assert.ok(!EMOJI.test(e.nome), `${d.tipo}:${e.id} com emoji no nome: ${e.nome}`);
      assert.ok(e.nome && e.nome === e.nome.trim(), `${e.id}: nome vazio ou com espaço`);
      assert.ok(!vistos.has(e.id), `id repetido: ${e.id} (${vistos.get(e.id)} e ${d.tipo})`);
      vistos.set(e.id, d.tipo);
    }
  }
  const origem = docs.find((d) => d.tipo === 'origem').entradas.find((e) => e.id === 'origem-academico');
  assert.deepEqual([origem.nome, origem.icone], ['Acadêmico', '📚']);
  // o JSON de conteúdo continua verbatim, com o emoji
  const origens = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'origens.json'), 'utf8'));
  assert.equal(origens.cards.find((c) => c.id === 'origem-academico').nome, '📚 Acadêmico');
});

test('catálogo: carta rara só com id, tipo, nome, categoria e requisito', () => {
  const cartas = catalogo().find((d) => d.tipo === 'carta').entradas;
  const raras = cartas.filter((e) => e.categoria === 'rara');
  assert.equal(raras.length, 59);
  for (const r of raras) assert.deepEqual(Object.keys(r).sort(), ['categoria', 'id', 'nome', 'req', 'tipo']);
  const limiar = fs.readFileSync(path.join(RAIZ, 'pages', 'limiar.html'), 'utf8');
  // na página, o card raro segue sem o bloco de efeito
  const cardsRaros = limiar.match(/<div class="catalog-card cat-rara"[\s\S]*?\n {8}<\/div>/g) || [];
  assert.equal(cardsRaros.length, 59);
  for (const c of cardsRaros) assert.ok(!c.includes('catalog-card-effect'), 'rara com efeito na página');
});

test('páginas: o nome do card (sem emoji) é o nome do catálogo', () => {
  const porId = new Map();
  catalogo().forEach((d) => d.entradas.forEach((e) => porId.set(`${e.tipo}:${e.id}`, e)));
  const rotulo = /data-kf-tipo="([^"]+)" data-kf-id="([^"]+)"[^>]*>(?:<button type="button" class="ent-add" hidden aria-keyshortcuts="A" aria-label="Levar para a ficha: ([^"]*)"><\/button><span class="ent-alca" hidden aria-hidden="true"><\/span>)?/g;
  let n = 0;
  const paginas = [];
  (function anda(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((f) => {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) anda(p); else if (f.name.endsWith('.html')) paginas.push(p);
    });
  })(path.join(RAIZ, 'pages'));
  const desesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  for (const p of paginas) {
    const h = fs.readFileSync(p, 'utf8');
    for (const m of h.matchAll(rotulo)) {
      const e = porId.get(`${m[1]}:${m[2]}`);
      assert.ok(e, `${path.basename(p)}: ${m[1]}:${m[2]} fora do catálogo`);
      if (m[3] !== undefined) assert.equal(desesc(m[3]), e.nome, `${m[2]}: rótulo do botão`);
      n++;
    }
  }
  assert.ok(n > 600, `só ${n} cards marcados`);
});
