'use strict';
// Componente "conta" (F4.1, js/ficha/kh-conta.js), isolado: o número com o
// tooltip da fórmula, montado a partir de um nó do motor (KhRegras) ou de um
// nó sintético. A prévia (kh-previa.js) usa este módulo; o snapshot de ouro do
// previa.test.js prova que o HTML dela não mudou na extração.
// Cobre: estrutura exata (focável, aria-describedby -> dica role=tooltip,
// data-caminho), ajuste manual e migrado, selos (no número e nos termos), aviso,
// dado, texto custom e unidade, escapamento de HTML, ids únicos por instância,
// prefixo de classe e o mesmo HTML que o ouro da prévia para um nó real.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const K = require('../../js/ficha/kh-conta.js');
const D = require('../../js/ficha/00-regras-dados.js');
const AJ = require('../../js/ficha/kh-ajustes.js');

function no(x) {
  return Object.assign({ rotulo: 'Campo', valor: 1, formula: { simbolica: 'a', numerica: '= 1' },
    termos: [], selos: [], avisos: [], lembretes: [] }, x);
}
const PASSIVA = no({
  rotulo: 'Evasão Passiva', valor: 13,
  formula: { simbolica: '10 + Mod.DES', numerica: '= 10 + 3 = 13' },
  termos: [
    { op: 'soma', valor: 10, rotulo: 'Base', ativo: true, status: 'canonico', fonte: { tipo: 'regra', id: 'contrato:derivados.evasao' } },
    { valor: 3, rotulo: 'Mod.DES', ativo: true, fonte: { tipo: 'no', nome: 'Mod. DES', id: 'atributo.DES.mod' } }
  ],
  lembretes: [{ op: 'reacao', msg: 'gasta a reação' }]
});

test('número simples: o HTML exato da conta (focável, aria-describedby -> dica, simbólica, numérica, termos, lembrete)', () => {
  const C = K.criar({ D, nos: { 'evasao.passiva': PASSIVA } });
  assert.equal(C.prefixo, 'kf3');
  assert.equal(K.PREFIXO, 'kf3');
  assert.equal(C.conta('evasao.passiva'),
    '<span class="kh-conta kf3-conta" tabindex="0" aria-describedby="kf3-d-1" data-caminho="evasao.passiva">' +
    '<b class="kf3-v">13</b>' +
    '<span class="kh-conta-dica kf3-dica" id="kf3-d-1" role="tooltip">' +
    '<span class="kf3-d-sim">Evasão Passiva = 10 + Mod.DES</span>' +
    '<span class="kf3-d-num">= 10 + 3 = 13</span>' +
    '<span class="kf3-d-ts">' +
    '<span class="kf3-t"><span class="kf3-t-v">+ 10</span> <span class="kf3-t-r">Base</span> <span class="kf3-t-f">· regra: contrato · derivados.evasao</span></span>' +
    '<span class="kf3-t"><span class="kf3-t-v">+ 3</span> <span class="kf3-t-r">Mod.DES</span> <span class="kf3-t-f">· campo: Mod. DES</span></span>' +
    '</span>' +
    '<span class="kf3-d-lb">Lembrete: gasta a reação</span>' +
    '</span></span>');
  assert.deepEqual(C.caminhos, ['evasao.passiva']);
});

test('número com ajuste: manual (motivo, calculado mudou) e migrado da v2, com "calc." ao lado e a unidade', () => {
  const C = K.criar({ D });
  const base = { rotulo: 'Saúde máx.', valor: 22, calculado: 20, selos: ['ajuste'],
    formula: { simbolica: 'Saúde máx. = Vitalidade × Nível', numerica: '= 22' },
    termos: [{ op: 'fixa', valor: 22, rotulo: 'Ajuste manual', ativo: true, status: 'ajuste', fonte: { tipo: 'ajuste' } }] };
  const man = C.conta('recurso.saude.max', { no: no(Object.assign({}, base, { ajuste: { origem: 'manual', motivo: 'bênção', mudou: true } })) });
  assert.match(man, /aria-describedby="kf3-d-1" data-ajustado data-caminho="recurso\.saude\.max">/);
  // a simbólica que já começa pelo rótulo não é repetida
  assert.match(man, /<span class="kf3-d-sim">Saúde máx\. = Vitalidade × Nível<\/span>/);
  assert.match(man, /<span class="kf3-d-aj">Ajuste manual: calculado 20 · ajustado 22 \(bênção\) · o calculado mudou desde o ajuste<\/span>/);
  assert.match(man, /<\/span><\/span><span class="kf3-calc">calc\. 20<\/span><span class="kf3-selo kf3-selo-ajuste" title="ajuste manual">/);
  // o termo do ajuste não repete a fonte nem o selo (ele já se nomeia)
  assert.match(man, /<span class="kf3-t"><span class="kf3-t-v">= 22<\/span> <span class="kf3-t-r">Ajuste manual<\/span><\/span>/);
  const mig = C.conta('movimento', { un: ' m', no: no(Object.assign({}, base, { rotulo: 'Movimento', ajuste: { origem: 'migracao' } })) });
  assert.match(mig, /<b class="kf3-v">22 m<\/b>/);
  assert.match(mig, /<span class="kf3-d-aj">Ajuste migrado da v2: calculado 20 · ajustado 22<\/span>/);
  assert.match(mig, /<span class="kf3-calc">calc\. 20 m<\/span>/);
  // sem ajuste: nada de data-ajustado nem calc.
  const sem = C.conta('x', { no: no() });
  assert.doesNotMatch(sem, /data-ajustado|kf3-calc|kf3-d-aj/);
});

test('número com selo: selo curto ao lado (title = rótulo completo), "Selo:" na dica com os da progressão sem repetir; semSelos', () => {
  const C = K.criar({ D });
  const n = no({ selos: ['pendentePedro'], selosProgressao: ['pendentePedro', 'decisaoPedro'],
    termos: [
      { valor: 2, rotulo: 'Pendente', ativo: true, status: 'pendente' },
      { valor: 1, rotulo: 'Canônico', ativo: true, status: 'canonico' },
      { valor: 1, rotulo: 'Sem status no mapa', ativo: true, status: 'inventado' }
    ] });
  const h = C.conta('a', { no: n });
  assert.ok(h.endsWith('<span class="kf3-selo kf3-selo-pendentePedro" title="PENDENTE PEDRO">' +
    '<svg aria-hidden="true"><use href="#g-selo"/></svg>pendente Pedro</span>'), h);
  assert.match(h, /<span class="kf3-d-selos">Selo: PENDENTE PEDRO · decisão do Pedro, falta Notion<\/span>/);
  // selo por termo: pelo mapa D.selos; status fora do mapa cai no semStatus; canônico não tem selo
  assert.match(h, /Pendente<\/span> <span class="kf3-t-s">\[PENDENTE PEDRO\]<\/span>/);
  assert.match(h, /Canônico<\/span><\/span>/);
  assert.match(h, /Sem status no mapa<\/span> <span class="kf3-t-s">\[PENDENTE \(balanceamento\)\]<\/span>/);
  // semSelos: o selo some do lado do número, mas segue na dica
  const s = C.conta('b', { no: n, semSelos: true });
  assert.doesNotMatch(s, /kf3-selo/);
  assert.match(s, /kf3-d-selos/);
  // selosHTML sozinho (a prévia usa nas flags R/I/V e na progressão) e selo sem texto curto
  assert.equal(C.selosHTML(['xis']), '<span class="kf3-selo kf3-selo-xis" title="xis"><svg aria-hidden="true"><use href="#g-selo"/></svg>xis</span>');
  assert.equal(C.selosHTML(null), '');
  assert.equal(C.rotuloSelo('avisoClasse'), 'classe em rework');
  assert.equal(C.seloDoStatus('ajuste'), null);
});

test('número com aviso: linha "Aviso:" na dica e marca à vista com todos os avisos no title', () => {
  const C = K.criar({ D });
  const h = C.conta('limiar.saldo', { no: no({ avisos: [{ tipo: 'cartas', msg: '2 cartas sem posição' }, { tipo: 'sem-msg' }] }) });
  assert.match(h, /<span class="kf3-d-av">Aviso: 2 cartas sem posição<\/span><span class="kf3-d-av">Aviso: sem-msg<\/span>/);
  assert.match(h, /<\/span><\/span> <span class="kf3-aviso kf3-marca-aviso" title="2 cartas sem posição · sem-msg">aviso<\/span>$/);
  assert.doesNotMatch(C.conta('y', { no: no() }), /kf3-aviso/);
});

test('dado: valor em texto ("13 + 1d6") e termos de dado; cada op do termo com o seu texto', () => {
  const C = K.criar({ D });
  const h = C.conta('evasao.ativa', { no: no({ valor: '13 + 1d6',
    termos: [{ op: 'dado', valor: '1d6', rotulo: 'Dado de Defender', ativo: true, motivo: 'o dado não soma atributo' }] }) });
  assert.match(h, /<b class="kf3-v">13 \+ 1d6<\/b>/);
  assert.match(h, /<span class="kf3-t-v">\+ 1d6<\/span> <span class="kf3-t-r">Dado de Defender<\/span> <span class="kf3-t-m">\(o dado não soma atributo\)<\/span>/);
  const vt = (t) => C.valorTermo(t);
  assert.equal(vt({ op: 'dado', valor: { dados: ['2d8'] } }), '+ 2d8', 'dado em objeto passa pelo fmt');
  assert.equal(vt({ op: 'fixa', valor: 5 }), '= 5');
  assert.equal(vt({ op: 'multiplica', valor: 1.5 }), '× 1,5');
  assert.equal(vt({ op: 'minimo', valor: 1 }), 'mín. 1');
  assert.equal(vt({ op: 'formula', valor: '3/12' }), '3/12');
  assert.equal(vt({ valor: -2 }), '− 2');
  assert.equal(vt({ valor: 4 }), '+ 4');
  assert.equal(vt({ valor: true }), 'sim');
  assert.equal(vt({ valor: null }), '?');
  // termo fora da conta: "(não entra: motivo)", exceto o que é só de exibição
  assert.match(C.termoHTML({ valor: 1, rotulo: 'X', ativo: false, motivo: 'sem sintonia' }),
    /^<span class="kf3-t kf3-t-off">.*<span class="kf3-t-m">\(não entra: sem sintonia\)<\/span><\/span>$/);
  assert.match(C.termoHTML({ valor: 1, rotulo: 'X', ativo: false }), /\(não entra\)/);
  assert.match(C.termoHTML({ valor: 1, rotulo: 'X', ativo: false, motivo: 'display: só mostra' }), /<span class="kf3-t-m">\(display: só mostra\)<\/span>/);
  // fmt padrão = KhAjustes.fmt (o mesmo do KhRegras)
  assert.equal(K.criar({ D }).valorNo({ valor: -2.5 }), AJ.fmt(-2.5));
});

test('texto custom e unidade: o.texto troca o valor mostrado (inclusive vazio); valor booleano e ausente', () => {
  const C = K.criar({ D });
  assert.match(C.conta('atributo.FOR.mod', { no: no({ valor: 3 }), texto: '+3' }), /<b class="kf3-v">\+3<\/b>/);
  assert.match(C.conta('a', { no: no({ valor: 3 }), texto: '' }), /<b class="kf3-v"><\/b>/);
  assert.match(C.conta('b', { no: no({ valor: 6 }), un: ' m' }), /<b class="kf3-v">6 m<\/b>/);
  assert.match(C.conta('c', { no: no({ valor: 6 }), un: ' m', texto: null }), /<b class="kf3-v">6 m<\/b>/, 'texto null = valor');
  assert.match(C.conta('d', { no: no({ valor: false }) }), /<b class="kf3-v">não<\/b>/);
  assert.match(C.conta('e', { no: no({ valor: null }) }), /<b class="kf3-v">—<\/b>/);
  assert.equal(C.valorNo(null), '—');
});

test('escapamento de HTML: rótulo, fórmula, termo, motivo, aviso, caminho e texto custom', () => {
  const C = K.criar({ D });
  const mal = '<img src=x onerror="alert(1)">&\'';
  const h = C.conta('a"b<c', { texto: mal, no: no({ rotulo: mal, formula: { simbolica: mal, numerica: mal },
    termos: [{ valor: mal, rotulo: mal, ativo: false, motivo: mal, fonte: { tipo: 'item', nome: mal } }],
    avisos: [{ msg: mal }], lembretes: [{ msg: mal }], selos: [mal], ajuste: { motivo: mal } }) });
  assert.doesNotMatch(h, /<img|<script|onerror="/);
  assert.match(h, /data-caminho="a&quot;b&lt;c"/);
  assert.match(h, /<b class="kf3-v">&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;&amp;&#39;<\/b>/);
  assert.match(h, /title="&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;&amp;&#39;">aviso<\/span>/);
  // só as tags do próprio componente sobram
  const tags = new Set([...h.matchAll(/<([a-z]+)\b/g)].map((m) => m[1]));
  assert.deepEqual([...tags].sort(), ['b', 'span', 'svg', 'use']);
  // emoji sai do rótulo e da fonte (como na prévia)
  const e = C.conta('f', { no: no({ rotulo: '🔥 Fogo', formula: { simbolica: 'x', numerica: '= 1' },
    termos: [{ valor: 1, rotulo: '⚔️ Lâmina', ativo: true, fonte: { tipo: 'item', nome: '🗡️ Adaga' } }] }) });
  assert.match(e, /<span class="kf3-d-sim">Fogo = x<\/span>/);
  assert.match(e, /<span class="kf3-t-r">Lâmina<\/span> <span class="kf3-t-f">· item: Adaga<\/span>/);
});

test('ids únicos por instância, caminhos na ordem, nó ausente não conta; prefixo de classe configurável', () => {
  const nos = { a: no(), b: no(), c: no() };
  const C = K.criar({ D, nos });
  const hs = ['a', 'zz', 'b', 'c'].map((c) => C.conta(c));
  assert.equal(hs[1], '<span class="kf3-nulo">—</span>', 'nó ausente: traço, sem id nem caminho');
  const ids = hs.join('').match(/aria-describedby="([^"]+)"/g).map((x) => x.slice(18, -1));
  assert.deepEqual(ids, ['kf3-d-1', 'kf3-d-2', 'kf3-d-3']);
  assert.deepEqual(C.caminhos, ['a', 'b', 'c']);
  // cada dica com o id que o número aponta
  ids.forEach((id) => assert.match(hs.join(''), new RegExp('<span class="kh-conta-dica kf3-dica" id="' + id + '" role="tooltip">')));
  // o nó passado em o.no vence o do grafo
  assert.match(C.conta('a', { no: no({ valor: 99 }) }), /<b class="kf3-v">99<\/b>/);
  // outra instância recomeça (uma por render), sem mexer na primeira
  const C2 = K.criar({ D, nos });
  assert.match(C2.conta('a'), /aria-describedby="kf3-d-1"/);
  assert.deepEqual(C2.caminhos, ['a']);
  assert.equal(C.caminhos.length, 4);
  // prefixo: classes e ids com o da página; as classes do componente (kh-conta*) ficam
  const F = K.criar({ D, nos: { s: no({ selos: ['ajuste'], ajuste: { origem: 'manual' }, avisos: [{ msg: 'x' }],
    termos: [{ valor: 1, rotulo: 'T', ativo: false }] }) }, prefixo: 'kf' });
  const hf = F.conta('s');
  assert.match(hf, /^<span class="kh-conta kf-conta" tabindex="0" aria-describedby="kf-d-1"/);
  assert.match(hf, /<span class="kh-conta-dica kf-dica" id="kf-d-1" role="tooltip">/);
  assert.match(hf, /kf-t kf-t-off/);
  assert.match(hf, /kf-calc/);
  assert.match(hf, /kf-aviso kf-marca-aviso/);
  assert.match(hf, /kf-selo kf-selo-ajuste/);
  assert.doesNotMatch(hf, /kf3/);
  assert.equal(F.conta('nada'), '<span class="kf-nulo">—</span>');
  ['', '3x', 'a b', 'x"y', '<s>'].forEach((p) => assert.throws(() => K.criar({ D, prefixo: p }), /prefixo inválido/, JSON.stringify(p)));
});

test('nó real do motor: o mesmo HTML que o ouro da prévia (ids normalizados)', () => {
  const P = require('../../js/ficha/kh-previa.js');
  const A = require('./estado-apoio.js');
  const v2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
  const dados = Object.assign(A.dadosCatalogo(), { efeitos: A.lerJSON('data', 'efeitos.json'), glifos: '', erros: [] });
  const r = P.calcular(A.soLeitura({ khalkaria_ficha: JSON.stringify(v2) }), dados);
  assert.equal(r.estado, 'ok', r.erro);
  const ouro = fs.readFileSync(path.join(__dirname, 'fixtures', 'previa-render.golden.html'), 'utf8').replace(/kf3-d-\d+"/g, 'kf3-d-N"');
  const C = K.criar({ D, nos: r.av.nos, fmt: require('../../js/ficha/kh-regras.js').fmt });
  const norm = (h) => h.replace(/kf3-d-\d+"/g, 'kf3-d-N"');
  // ajuste migrado (Saúde), dado (Evasão Ativa), aviso (Limiar), lembrete, selo
  ['evasao.ativa', 'recurso.saude.max', 'cd', 'acoes', 'limiar.saldo'].forEach((c) => assert.ok(ouro.includes(norm(C.conta(c))), c + ' fora do ouro'));
  assert.ok(ouro.includes(norm(C.conta('movimento', { un: ' m' }))), 'movimento com unidade');
  // perícia: a prévia mostra o valor com sinal (texto custom); Movimento tem selo de decisão (D7)
  const mov = r.av.nos['pericia.movimento.total'];
  assert.ok(mov.selos.length, 'perícia Movimento com selo');
  const txt = (mov.valor < 0 ? '−' : '+') + Math.abs(mov.valor);
  assert.ok(ouro.includes(norm(C.conta('pericia.movimento.total', { texto: txt }))), 'perícia Movimento fora do ouro');
});
