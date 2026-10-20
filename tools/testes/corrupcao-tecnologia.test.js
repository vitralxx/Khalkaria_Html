'use strict';
// F4.6f (docs/ficha-digital/07-f4-6-ensaio.md, "Corrupção e tecnologias"):
//   - a marcação: as linhas da tabela de corrupção (pages/racas/corrompido.html)
//     são entidade `corrupcao` com o id do bloco da raça (conjunto == bloco,
//     sem repetir), os controles hidden abrindo a 1ª célula, e só ali;
//   - o catálogo: data/catalogo/corrupcao.json == o bloco; tecnologia com o Tier;
//   - a v2.1 (decorarCorrupcao do js/ficha.js) ainda decora a tabela, com o
//     mesmo nome, custo, tipo e id de antes (os controles não entram no nome);
//   - a ficha nova: o bloco "Corrupção" só para o Corrompido e "Tecnologias
//     acopladas" (com o Tier) só para o Autômato; nas outras raças, nada muda.
// O levar no Ensaio (clique, tecla A, repetida, Desfazer, armazenamento espião)
// fica no levar.test.js, que tem o harness do navegador.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const A = require('./estado-apoio.js');
const DOM = require('./dom-mini.js');
const FA = require('../../js/ficha/kh-ficha-abas.js');
const P = require('../../js/ficha/kh-previa.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const copia = (x) => JSON.parse(JSON.stringify(x));
const BLOCO = A.lerJSON('data', 'racas', 'corrompido.json').raca.corrupcao;
const ITENS = ['poderes', 'adversidades'].flatMap((g) => BLOCO[g].itens.map((x) => Object.assign({ grupo: g }, x)));
const PAG = ler('pages', 'racas', 'corrompido.html');
const LINHA = /<tr data-kf-tipo="corrupcao" data-kf-id="([^"]+)" data-prever="corrupcao:\1"><td><button type="button" class="ent-add" hidden aria-keyshortcuts="A" aria-label="Levar para a ficha: ([^"]*)"><\/button><span class="ent-alca" hidden aria-hidden="true"><\/span>([^<]*)<\/td>/g;

test('marcação: toda linha da tabela de corrupção é corrupcao com o id do bloco (conjunto == bloco, na ordem, sem repetir)', () => {
  const ms = [...PAG.matchAll(LINHA)];
  assert.equal(ITENS.length, 30);
  assert.deepEqual(ms.map((m) => m[1]), ITENS.map((x) => x.id), 'ids na ordem do bloco (poderes, depois adversidades)');
  assert.equal(new Set(ms.map((m) => m[1])).size, ms.length, 'sem repetir');
  ms.forEach((m, i) => {
    assert.equal(m[2], ITENS[i].nome, 'rótulo do botão = nome');
    assert.equal(m[3], ITENS[i].nome, 'a célula do nome segue com o nome verbatim');
  });
  // nenhuma linha de corrupção sem marca; nenhum data-kf de corrupção fora dessas linhas
  assert.equal((PAG.match(/<table class="corr-table">[\s\S]*?<\/table>/g) || []).join('').match(/<tr><td>/g), null);
  assert.equal((PAG.match(/data-kf-tipo="corrupcao"/g) || []).length, 30);
  // a tabela do máximo por nível não é entidade
  assert.doesNotMatch(PAG.match(/<table class="corr-max">[\s\S]*?<\/table>/)[0], /data-kf-/);
  // só a página do Corrompido tem o tipo
  for (const r of ['humano', 'anao', 'dryad', 'gruto', 'automato', 'inseto']) {
    assert.doesNotMatch(ler('pages', 'racas', r + '.html'), /data-kf-tipo="corrupcao"/, r);
  }
});

test('catálogo: corrupcao.json == o bloco (grupo, custo inteiro e o texto); tecnologia com o Tier do bloco do Autômato', () => {
  const cat = A.lerJSON('data', 'catalogo', 'corrupcao.json');
  assert.equal(cat.total, 30);
  assert.deepEqual(cat.entradas.map((e) => e.id), ITENS.map((x) => x.id));
  cat.entradas.forEach((e, i) => {
    const x = ITENS[i];
    assert.equal(e.tipo, 'corrupcao');
    assert.equal(e.raca, 'corrompido');
    assert.equal(e.nome, x.nome);
    assert.equal(e.grupo, x.grupo === 'poderes' ? 'poder' : 'adversidade');
    assert.equal(e.custoTexto, x.custo);
    assert.equal(e.custo, Number(x.custo));
    assert.ok(e.grupo === 'poder' ? e.custo < 0 : e.custo > 0, e.id);
  });
  assert.equal(cat.entradas.find((e) => e.id === 'corrompido-pele-fraca').resumo, '-1 Constituição.');
  const tiers = A.lerJSON('data', 'racas', 'automato.json').raca.tecnologias.tiers;
  const tec = A.lerJSON('data', 'catalogo', 'tecnologia.json').entradas;
  assert.equal(tec.length, 16);
  tec.forEach((e) => {
    const i = tiers.findIndex((t) => t.ids.includes(e.id));
    assert.ok(i >= 0, e.id);
    assert.equal(e.tier, i + 1, e.id);
    assert.match(e.tierTexto, new RegExp('^Tier ' + (i + 1) + ' — '), e.id);
  });
  // a prévia baixa o catálogo novo
  assert.ok(P.CATALOGOS.includes('corrupcao'));
});

// ---------------------------------------------------------------- v2.1
// textoLimpo, slug, el e decorarCorrupcao isolados do artefato (são internos da v2.1)
function v21(doc, levados) {
  const SRC = ler('js', 'ficha.js');
  const pega = (nome) => {
    const m = SRC.match(new RegExp('\\n  function ' + nome + '\\([^)]*\\) \\{[\\s\\S]*?\\r?\\n  \\}\\r?\\n'));
    assert.ok(m, nome + ' não encontrado no js/ficha.js');
    return m[0];
  };
  const sb = { document: doc, addEntidade: (campo, ent) => levados.push([campo, ent]) };
  vm.createContext(sb);
  vm.runInContext(['textoLimpo', 'slug', 'el', 'decorarCorrupcao'].map(pega).join('\n') + '\nthis.decorarCorrupcao = decorarCorrupcao;', sb);
  return sb.decorarCorrupcao;
}
test('v2.1: decorarCorrupcao ainda decora as 30 linhas, com o nome, o custo, o tipo e o id de antes (os controles fora do nome)', () => {
  if (!DOM.Elemento.prototype.cloneNode) {
    DOM.Elemento.prototype.cloneNode = function () {
      const c = new DOM.Elemento(this.doc, this.tagName.toLowerCase(), this.attrs);
      c.innerHTML = this.innerHTML;
      return c;
    };
  }
  const doc = DOM.documento();
  doc.createTextNode = (t) => new DOM.Texto(t);
  const main = doc.createElement('main');
  main.innerHTML = PAG.match(/<div class="corr-block poder">[\s\S]*?<\/table>\s*<\/div>\s*<div class="corr-block adv">[\s\S]*?<\/table>\s*<\/div>/)[0];
  doc.body.appendChild(main);
  const levados = [];
  v21(doc, levados)();
  const trs = doc.querySelectorAll('.corr-table tr[data-kf]');
  assert.equal(trs.length, 30);
  trs.forEach((tr, i) => {
    const x = ITENS[i];
    assert.equal(tr.getAttribute('draggable'), 'true');
    assert.ok(tr.classList.contains('kf-draggable'));
    // o '+ ficha' da v2.1 entra na 1ª célula, depois do botão e da alça do build
    const td = tr.querySelectorAll('td')[0];
    assert.deepEqual(td.children.map((c) => c.className), ['ent-add', 'ent-alca', 'kf-addbtn']);
    DOM.despacha(doc, td.querySelector('.kf-addbtn'), DOM.evento('click'));
    const tipo = x.grupo === 'adversidades' ? 'adversidade' : 'corrupção';
    const slug = x.nome.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    assert.deepEqual(copia(levados[i]), ['tecnicas', { id: tipo + '-' + slug, tipo, nome: x.nome + ' (' + x.custo + ')', descricao: levados[i][1].descricao }]);
    assert.ok(levados[i][1].descricao.length > 0, x.id);
  });
  // rodar de novo não decora duas vezes
  v21(doc, levados)();
  assert.equal(doc.querySelectorAll('.kf-addbtn').length, 30);
});

// ---------------------------------------------------------------- ficha nova
const DADOS = Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] });
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
function comRaca(id, nome) {
  const res = P.calcular(A.soLeitura({ khalkaria_ficha: JSON.stringify(V2) }), DADOS, '');
  assert.equal(res.estado, 'ok', res.erro);
  const base = copia(res);
  if (id) base.ficha.identidade.raca = { id, nome };
  base.ficha.entradas.push({ uid: 'pf', tipo: 'corrupcao', id: 'corrompido-pele-fraca', estado: {}, cache: { nome: 'Pele Fraca' }, mods: [] });
  base.ficha.entradas.push({ uid: 'fc', tipo: 'tecnologia', id: 'automato-fibra-de-carbono', estado: {}, cache: { nome: 'Fibra de Carbono' }, mods: [] });
  return base;
}
const tecnicas = (res, pre) => FA.criar(pre === 'fd' ? { prefixo: 'fd', densidade: 'compacta' } : {}).paineis(res, { dados: DADOS }).paineis.tecnicas;
// a seção (data-campo) de um id: a <section> mais próxima que contém o card
function secaoDe(h, id) {
  const i = h.indexOf('data-id="' + id + '"');
  if (i < 0) return null;
  const antes = h.slice(0, i);
  const m = [...antes.matchAll(/<section class="fp-bloco[^"]*" data-campo="([^"]+)"/g)];
  return m.length ? m[m.length - 1][1] : null;
}
const bloco = (h, campo) => (h.match(new RegExp('<section class="fp-bloco[^"]*" data-campo="' + campo + '"[\\s\\S]*?</section>')) || [])[0] || '';

test('ficha nova, Corrompido: bloco "Corrupção" com poderes e adversidades (custo e texto), a soma e o máximo do nível; a tecnologia segue em Diversas', () => {
  const res = comRaca('raca-corrompido', 'Corrompido');
  const h = tecnicas(res);
  const b = bloco(h, 'corrupcao');
  assert.ok(b, 'o bloco existe');
  assert.match(b, /<span class="fp-bloco-nome">Corrupção<\/span>/);
  assert.equal(secaoDe(h, 'corrompido-sangue-morto'), 'corrupcao');
  assert.equal(secaoDe(h, 'corrompido-pele-fraca'), 'corrupcao');
  assert.equal(secaoDe(h, 'automato-visao-termica'), 'tecnicas-diversas');
  assert.equal(secaoDe(h, 'automato-fibra-de-carbono'), 'tecnicas-diversas');
  assert.doesNotMatch(h, /data-campo="tecnologias"/);
  // custo e texto (o "-1" do efeito da Pele Fraca fica: nada é cortado)
  assert.match(b, /data-id="corrompido-sangue-morto">[\s\S]*?<span class="fp-tec-custo" data-campo="custo">Custo -1<\/span>[\s\S]*?<span class="fp-tec-tipo">Poder<\/span>[\s\S]*?<p class="fp-tec-txt">\+5 Éter Máximo\. \+5 Stamina Máxima\.<\/p>/);
  assert.match(b, /data-id="corrompido-pele-fraca">[\s\S]*?Custo \+1<\/span>[\s\S]*?<span class="fp-tec-tipo">Adversidade<\/span>[\s\S]*?<p class="fp-tec-txt">-1 Constituição\.<\/p>/);
  // a soma dos custos (-1 + 1 = 0) e o máximo do nível da ficha, verbatim da tabela
  const nivel = String(res.ficha.meta.nivel);
  const max = BLOCO.maximoPorNivel.find((x) => x.nivel === nivel).maximo;
  assert.match(b, /data-campo="corrupcao-soma"><span class="fp-rot">Soma dos custos<\/span><span class="fp-n">0<\/span>/);
  assert.match(b, new RegExp('data-campo="corrupcao-maximo"><span class="fp-rot">Máximo no nível ' + nivel + '</span><span class="fp-n">' + max + '</span>'));
  // o drawer: o mesmo, a menos do prefixo e da densidade
  assert.equal(tecnicas(res, 'fd').replace(/ data-densidade="compacta"/g, '').replace(/\bfd-/g, 'fp-'), h);
  // sem corrupção na ficha: o bloco com uma moldura vazia e a soma "—"
  res.ficha.entradas = res.ficha.entradas.filter((e) => e.tipo !== 'corrupcao');
  const v = bloco(tecnicas(res), 'corrupcao');
  assert.match(v, /data-vazia/);
  assert.match(v, /Soma dos custos<\/span><span class="fp-n">—<\/span>/);
});

test('ficha nova, Autômato: bloco "Tecnologias acopladas" com o Tier de cada uma, na ordem dos tiers; a corrupção segue em Diversas', () => {
  const h = tecnicas(comRaca('raca-automato', 'Autômato'));
  const b = bloco(h, 'tecnologias');
  assert.match(b, /<span class="fp-bloco-nome">Tecnologias acopladas<\/span>/);
  assert.match(b, /Limite de tecnologias equipadas: 2 \+ mod\. Constituição\./);
  assert.equal(secaoDe(h, 'automato-visao-termica'), 'tecnologias');
  assert.equal(secaoDe(h, 'automato-fibra-de-carbono'), 'tecnologias');
  assert.equal(secaoDe(h, 'corrompido-sangue-morto'), 'tecnicas-diversas');
  assert.doesNotMatch(h, /data-campo="corrupcao"/);
  const tiers = [...b.matchAll(/data-id="([^"]+)"[\s\S]*?<span class="fp-tec-tier" data-campo="tier">([^<]+)<\/span>/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(tiers, [['automato-visao-termica', 'Tier 1 — Inicial'], ['automato-fibra-de-carbono', 'Tier 2 — Item Incomum']]);
});

test('ficha nova, outras raças (e sem raça): nem bloco de corrupção nem de tecnologias; tudo em Diversas, sem Tier', () => {
  for (const [id, nome] of [['raca-humano', 'Humano'], ['raca-anao', 'Anão'], ['raca-inseto', 'Inseto'], [null, null]]) {
    const res = comRaca(id, nome);
    if (!id) res.ficha.identidade.raca = null;
    const h = tecnicas(res);
    assert.doesNotMatch(h, /data-campo="(corrupcao|tecnologias)"/, String(id));
    assert.doesNotMatch(h, /fp-tec-tier/, String(id));
    ['automato-visao-termica', 'automato-fibra-de-carbono', 'corrompido-sangue-morto', 'corrompido-pele-fraca']
      .forEach((x) => assert.equal(secaoDe(h, x), 'tecnicas-diversas', id + ': ' + x));
  }
});
