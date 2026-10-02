'use strict';
// KhFichaAbas (F4.4a, js/ficha/kh-ficha-abas.js): o desenho das 5 abas da ficha
// nova, tirado do js/ficha-pagina.js para o bundle, com prefixo e densidade.
// Cobre:
//   - criar(): prefixo e densidade validados, instâncias independentes;
//   - a página usa o módulo (instância 'fp' + 'pagina'): o mesmo HTML que ele
//     gera (o ouro de antes da extração é o ficha-pagina-ouro.test.js);
//   - página x drawer: o render compacto 'fd' é o da página a menos do prefixo
//     e da marca data-densidade (o mesmo conteúdo, sem cópia);
//   - carregar o módulo não toca DOM, storage nem rede (só lê as dependências
//     e registra window.KhFichaAbas); no ORDEM depois do kh-previa.js;
//   - a página sem o js/ficha.js (falha de rede): só o recado, sem fetch;
//   - css/ficha-drawer.css: fora do shell e das páginas, sem camada, tudo sob
//     .fd-, cobre o que o desenho compacto usa, o único hex é a paleta dos tipos
//     (igual à da página) e o texto fica em AA.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const FA = require('../../js/ficha/kh-ficha-abas.js');
const FP = require('../../js/ficha-pagina.js');
const P = require('../../js/ficha/kh-previa.js');
const A = require('./estado-apoio.js');
const { TOKENS, regra, resolveCor, contraste } = require('./cor-apoio.js');

const ler = (...p) => fs.readFileSync(path.join(A.RAIZ, ...p), 'utf8');
const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const copia = (x) => JSON.parse(JSON.stringify(x));
function dados() { return Object.assign(A.dadosCatalogo(), { efeitos: EFEITOS, glifos: '', erros: [] }); }
function calcula(v2) {
  const res = P.calcular(A.soLeitura({ khalkaria_ficha: JSON.stringify(v2) }), dados(), '');
  assert.equal(res.estado, 'ok', res.erro);
  return res;
}
// a fixture e uma variante que passa pelos outros ramos (rara, magias Nv3/Nv5,
// classe sem contador, nível 5, Vhelor, idiomas, queimadas)
function variantes() {
  const esp = copia(V2);
  esp.cartasLimiar.push({ id: 'carta-carne-e-aco', tipo: 'carta', nome: 'Carne e Aço', descricao: 'SEGREDO' });
  esp.cartasLimiar.push({ id: 'carta-musculos-de-ogro', tipo: 'carta', nome: 'Músculos de Ogro', descricao: 'Força.' });
  esp.grimorio.push({ id: 'magia-lanca-de-gelo', tipo: 'magia', nome: 'Lança de Gelo', descricao: '' });
  esp.grimorio.push({ id: 'magia-fissura-da-alma', tipo: 'magia', nome: 'Fissura da Alma', descricao: '' });
  esp.meta.classe = 'Espadachim'; esp.meta.ramo = ''; esp.meta.nivel = 5;
  const r2 = calcula(esp);
  r2.ficha.vhelor = { marcas: 2, abstinente: true };
  r2.ficha.idiomas = ['Comum'];
  r2.ficha.limiar = Object.assign({}, r2.ficha.limiar, { queimadas: [{ id: 'carta-alma-resiliente', nivel: 2 }] });
  return { sintetica: calcula(copia(V2)), espadachim: r2, 'sem-ficha': P.calcular(A.soLeitura({}), dados(), '') };
}
// o HTML compacto do drawer, com o prefixo e a densidade da página
const comoPagina = (h) => h.replace(/ data-densidade="compacta"/g, '').replace(/\bfd-/g, 'fp-');

test('criar: prefixo e densidade validados; padrão fp/pagina; instâncias independentes', () => {
  const a = FA.criar();
  assert.equal(a.prefixo, 'fp');
  assert.equal(a.densidade, 'pagina');
  assert.deepEqual(FA.DENSIDADES, ['pagina', 'compacta']);
  assert.deepEqual(Object.keys(a.RENDER), FA.ABAS.map((x) => x.id), 'um desenhista por aba, na ordem do A4');
  assert.throws(() => FA.criar({ prefixo: 'f p' }), /prefixo inválido/);
  assert.throws(() => FA.criar({ prefixo: '1fd' }), /prefixo inválido/);
  assert.throws(() => FA.criar({ prefixo: 'fd', densidade: 'larga' }), /densidade inválida/);
  const b = FA.criar({ prefixo: 'fd', densidade: 'compacta' });
  assert.notEqual(a.RENDER, b.RENDER);
  const res = variantes().sintetica, d = dados();
  const antes = b.paineis(res, { dados: d }).paineis.nucleo;
  a.RENDER.nucleo = () => 'trocado';
  try {
    assert.match(a.paineis(res, { dados: d }).paineis.nucleo, />trocado</);
    assert.equal(b.paineis(res, { dados: d }).paineis.nucleo, antes, 'trocar o desenhista de uma instância não mexe na outra');
  } finally { delete a.RENDER.nucleo; }
});

test('página: usa a instância fp/pagina do módulo, e o render dela é o do módulo', () => {
  assert.equal(FP.desenho.prefixo, 'fp');
  assert.equal(FP.desenho.densidade, 'pagina');
  assert.equal(FP.RENDER, FP.desenho.RENDER, 'o RENDER exposto é o da instância');
  assert.deepEqual(FP.ABAS, FA.ABAS);
  assert.equal(FP.textoRico, FA.textoRico);
  const d = dados();
  for (const [nome, res] of Object.entries(variantes())) {
    const r = FP.render(res, { dados: d }), m = FA.criar({ prefixo: 'fp', densidade: 'pagina' }).paineis(res, { dados: d });
    assert.deepEqual(r.paineis, m.paineis, nome);
    assert.deepEqual(r.caminhos, m.caminhos, nome);
    Object.values(r.paineis).forEach((h) => assert.doesNotMatch(h, /data-densidade/, nome + ': a página não leva marca'));
  }
});

test('drawer x página: o render compacto (fd) é o da página a menos do prefixo e da densidade', () => {
  const d = dados();
  const pag = FA.criar({ prefixo: 'fp', densidade: 'pagina' }), dr = FA.criar({ prefixo: 'fd', densidade: 'compacta' });
  for (const [nome, res] of Object.entries(variantes())) {
    const p = pag.paineis(res, { dados: d }), c = dr.paineis(res, { dados: d });
    assert.deepEqual(c.caminhos, p.caminhos, nome + ': as mesmas contas, na mesma ordem');
    for (const a of FA.ABAS) {
      const h = c.paineis[a.id];
      assert.doesNotMatch(h, /\bfp-/, nome + '/' + a.id + ': nada do prefixo da página');
      if (res.estado === 'ok') assert.ok(h.startsWith('<div class="fd-corpo fd-corpo-' + a.id + '" data-densidade="compacta">'), nome + '/' + a.id);
      assert.equal(comoPagina(h), p.paineis[a.id], nome + '/' + a.id);
    }
  }
  // as contas do drawer têm ids próprios (fd-d-N) e a cor do ramo no prefixo dele
  const h = dr.paineis(variantes().sintetica, { dados: d }).paineis;
  assert.match(h.nucleo, /aria-describedby="fd-d-1"/);
  assert.match(h.tecnicas, /style="--fd-ramo: var\(--ramo-batedor-/);
});

test('carregar o módulo no navegador: só lê as dependências e registra window.KhFichaAbas', () => {
  const lidos = [], gravados = [];
  const base = { KhPrevia: {}, KhRegras: {}, KhConta: {}, KhEstado: {}, KhInv: {} };
  const win = new Proxy(base, {
    get: (o, k) => { if (typeof k === 'string') lidos.push(k); return o[k]; },
    set: (o, k, v) => { gravados.push(String(k)); o[k] = v; return true; },
    has: () => false
  });
  const sb = vm.createContext({ window: win });
  vm.runInContext(ler('js', 'ficha', 'kh-ficha-abas.js'), sb, { filename: 'kh-ficha-abas.js' });
  assert.deepEqual(lidos.sort(), ['KhConta', 'KhEstado', 'KhInv', 'KhPrevia', 'KhRegras']);
  assert.deepEqual(gravados, ['KhFichaAbas']);
  assert.equal(typeof base.KhFichaAbas.criar, 'function');
});

test('bundle: kh-ficha-abas.js no ORDEM depois do kh-conta, do kh-abas e do kh-previa; o artefato o traz', () => {
  const ordem = ler('js', 'ficha', 'ORDEM').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const i = ordem.indexOf('kh-ficha-abas.js');
  assert.ok(i >= 0, 'no ORDEM');
  ['kh-conta.js', 'kh-abas.js', 'kh-previa.js', 'kh-regras.js', 'kh-estado.js', 'kh-inv.js'].forEach((n) => assert.ok(ordem.indexOf(n) < i, n + ' antes'));
  const art = ler('js', 'ficha.js');
  assert.ok(art.indexOf('// ==== js/ficha/kh-previa.js ====') < art.indexOf('// ==== js/ficha/kh-ficha-abas.js ===='));
});

// a página no navegador SEM o js/ficha.js (só o js/ficha-pagina.js)
function paginaSemBundle(ls) {
  const buscas = [], escritas = [];
  const fp = { at: {}, innerHTML: '',
    getAttribute(k) { return k in this.at ? this.at[k] : null; }, setAttribute(k, v) { this.at[k] = String(v); },
    addEventListener() {} };
  const document = { readyState: 'complete', getElementById: (id) => (id === 'fp' ? fp : null),
    querySelector: () => null, addEventListener() {} };
  const st = new Map(Object.entries(ls || {}));
  const sandbox = { document, location: { search: '' }, console,
    localStorage: { getItem: (k) => (st.has(k) ? st.get(k) : null), setItem: (k) => escritas.push(k), removeItem: (k) => escritas.push('-' + k) },
    sessionStorage: { getItem: () => null, setItem: (k) => escritas.push(k), removeItem: (k) => escritas.push('-' + k) },
    fetch: (u) => { buscas.push(u); return Promise.reject(new Error('rede')); }, addEventListener() {} };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(ler('js', 'ficha-pagina.js'), sandbox, { filename: 'ficha-pagina.js' });
  return { fp, buscas, escritas, win: sandbox };
}

test('página sem o js/ficha.js: com a prévia, só o recado (sem abas, sem fetch, sem escrita); sem ela, o aviso', () => {
  let pg = paginaSemBundle({ khalkaria_ficha_previa: '1' });
  assert.equal(typeof pg.win.KhFichaPagina, 'object');
  assert.equal(pg.fp.getAttribute('data-fp'), 'sem-motor');
  assert.equal(pg.fp.innerHTML, pg.win.KhFichaPagina.htmlSemMotor());
  assert.match(pg.fp.innerHTML, /O motor da ficha \(js\/ficha\.js\) não carregou\. Recarregue a página\./);
  assert.doesNotMatch(pg.fp.innerHTML, /role="tab"/);
  assert.deepEqual(pg.buscas, []);
  assert.deepEqual(pg.escritas, []);
  // o mesmo texto do KhFichaAbas.mensagemEstado (que, sem o bundle, não existe)
  assert.ok(pg.fp.innerHTML.includes(FA.mensagemEstado({ estado: 'sem-motor' })));
  pg = paginaSemBundle({});
  assert.equal(pg.fp.getAttribute('data-fp'), 'aviso');
  assert.equal(pg.fp.innerHTML, FP.htmlAviso());
});

// ---------------------------------------------------------- css/ficha-drawer.css
const CSS_DR = ler('css', 'ficha-drawer.css').replace(/\/\*[\s\S]*?\*\//g, '');
const CSS_PAG = ler('css', 'ficha-pagina.css').replace(/\/\*[\s\S]*?\*\//g, '');
const TIPOS = ['cortante', 'contundente', 'perfurante', 'fogo', 'frio', 'eletrico', 'veneno', 'acido', 'psiquico',
  'radiante', 'trovejante', 'necrotico', 'forca', 'primordial'];

test('ficha-drawer.css: nem o shell nem página nenhuma o carregam (o drawer o injeta, só com a prévia)', () => {
  const arqs = [path.join(A.RAIZ, 'index.html'), path.join(A.RAIZ, 'tools', 'shell.py')];
  const anda = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) anda(p); else if (/\.html$/.test(e.name)) arqs.push(p);
  });
  ['pages', 'templates', 'partials'].forEach((d) => anda(path.join(A.RAIZ, d)));
  assert.ok(arqs.length > 30);
  arqs.forEach((p) => assert.ok(!fs.readFileSync(p, 'utf8').includes('ficha-drawer.css'), path.relative(A.RAIZ, p)));
});

test('ficha-drawer.css: sem camada, todo seletor sob .fd-, sem opacidade, sem --text-muted, sem line-clamp', () => {
  assert.doesNotMatch(CSS_DR, /@layer|@import|@media/);
  const seletores = [...CSS_DR.matchAll(/(?:^|\})\s*([^{}]+?)\s*\{/g)].map((m) => m[1]);
  assert.ok(seletores.length > 100);
  // a lista de seletores, cortada só nas vírgulas de fora de parênteses (:where(h3, h4))
  const itens = (s) => {
    const out = [];
    let nivel = 0, atual = '';
    for (const ch of s) {
      if (ch === ',' && !nivel) { out.push(atual); atual = ''; continue; }
      if (ch === '(') nivel++;
      if (ch === ')') nivel--;
      atual += ch;
    }
    return out.concat(atual);
  };
  seletores.forEach((s) => itens(s).forEach((x) => assert.match(x, /\.fd-/, 'fora do prefixo: ' + x.trim())));
  assert.doesNotMatch(CSS_DR, /\bopacity\s*:/);
  assert.doesNotMatch(CSS_DR, /var\(--text-muted\)/);
  assert.doesNotMatch(CSS_DR, /line-clamp/);
});

test('ficha-drawer.css: o único hex é a paleta dos tipos de dano, a mesma da página', () => {
  const pal = (css, p) => Object.fromEntries(TIPOS.map((t) => {
    const m = new RegExp('--' + p + '-' + t + ':\\s*(#[0-9a-fA-F]{6});').exec(css);
    assert.ok(m, p + ': --' + p + '-' + t);
    return [t, m[1].toLowerCase()];
  }));
  assert.deepEqual(pal(CSS_DR, 'fd'), pal(CSS_PAG, 'fp'));
  const resto = CSS_DR.replace(new RegExp('--fd-(?:' + TIPOS.join('|') + '):\\s*#[0-9a-fA-F]{6};', 'g'), '');
  assert.deepEqual(resto.match(/#[0-9a-fA-F]{3,8}\b/g) || [], [], 'hex fora da paleta: use os tokens');
  // e a paleta é toda usada (um rótulo por tipo)
  TIPOS.forEach((t) => assert.ok(CSS_DR.includes('.fd-tipo-' + t + ' { color: var(--fd-' + t + '); }'), t));
});

test('ficha-drawer.css: cobre toda peça do desenho compacto que a página estiliza', () => {
  const d = dados(), dr = FA.criar({ prefixo: 'fd', densidade: 'compacta' });
  const usadas = new Set();
  Object.values(variantes()).forEach((res) => Object.values(dr.paineis(res, { dados: d }).paineis).forEach((h) => {
    for (const m of h.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).filter((c) => c.startsWith('fd-')).forEach((c) => usadas.add(c.slice(3)));
  }));
  const naPagina = new Set([...CSS_PAG.matchAll(/\.fp-([a-zA-Z0-9-]+)/g)].map((m) => m[1]));
  const noDrawer = new Set([...CSS_DR.matchAll(/\.fd-([a-zA-Z0-9-]+)/g)].map((m) => m[1]));
  // de propósito fora: o .fp-aviso da página é o aviso sem a prévia (não a marca
  // de aviso do KhConta, que é .fd-marca-aviso); o .fp-tier põe a Ultimate na
  // linha toda, e no drawer toda técnica já ocupa a linha
  const fora = new Set(['aviso', 'tier']);
  const falta = [...usadas].filter((c) => naPagina.has(c) && !noDrawer.has(c) && !fora.has(c)).sort();
  assert.deepEqual(falta, []);
  assert.ok(usadas.size > 150, 'o desenho usa ' + usadas.size + ' classes');
  // a densidade mora na marca do corpo
  assert.match(CSS_DR, /\.fd-corpo\[data-densidade="compacta"\] \{/);
});

test('ficha-drawer.css: texto em AA (4,5:1) contra o fundo da peça; selos contra o próprio fundo', () => {
  const corDe = (txt) => /(?:^|;)\s*color:\s*([^;]+?)\s*(?:;|$)/.exec(txt.trim());
  const VARS = { 'fd-fundo-peca': 'var(--bg-card)' };
  const cor = (sel, vars) => resolveCor(corDe(regra(CSS_DR, sel))[1], Object.assign({}, VARS, vars));
  const painel = /--painel:\s*linear-gradient\(180deg,\s*(#[0-9a-f]{6})/i.exec(ler('css', 'tokens.css'))[1].toLowerCase();
  const comp = ler('css', 'componentes.css');
  const PAPEL = { bloco: painel, peca: TOKENS['bg-card'], sec: TOKENS['bg-secondary'],
    dica: /#[0-9a-f]{6}\b/i.exec(/background:\s*([^;]+)/.exec(regra(comp, '.kh-conta-dica, .bz-col-conta'))[1])[0].toLowerCase() };
  const PARES = [
    ['.fd-vazia-txt', 'bloco'], ['.fd-trava-txt', 'bloco'], ['.fd-nota', 'bloco'], ['.fd-sub', 'bloco'],
    ['.fd-legenda', 'bloco'], ['.fd-calc', 'bloco'], ['.fd-per-at', 'bloco'], ['.fd-rec-eter .fd-rec-nome', 'bloco'],
    ['.fd-flag .fd-v', 'sec'], ['.fd-res-h', 'sec'], ['.fd-id dt', 'bloco'],
    ['.fd-nulo', 'peca'], ['.fd-rot', 'peca'], ['.fd-carta-cat', 'peca'], ['.fd-tec-tipo', 'peca'],
    ['.fd-item-cat', 'peca'], ['.fd-mg-escola', 'peca'], ['.fd-mg-stats dt', 'peca'],
    ['.fd-t-m', 'dica'], ['.fd-t-f', 'dica'], ['.fd-t-off .fd-t-v, .fd-t-off .fd-t-r', 'dica']
  ];
  PARES.forEach(([sel, p]) => {
    const c = contraste(cor(sel), PAPEL[p]);
    assert.ok(c >= 4.5, sel + ' (' + cor(sel) + ' sobre ' + PAPEL[p] + '): ' + c.toFixed(2) + ':1');
  });
  // selos, chips e custo: a cor contra o fundo da própria regra
  ['.fd-selo', '.fd-selo-decisaoPedro', '.fd-selo-pendentePedro, .fd-selo-pendenteBalanceamento, .fd-selo-aviso, .fd-selo-ajuste, .fd-selo-trava',
    '.fd-selo-avisoClasse, .fd-selo-sintonizado', '.fd-selo-orfa', '.fd-selo-equipado', '.fd-tec-custo',
    '.fd-rar-lixo', '.fd-rar-ordinario', '.fd-rar-incomum', '.fd-rar-exotico', '.fd-rar-luxaria'].forEach((sel) => {
    const r = regra(CSS_DR, sel);
    const fundo = resolveCor(/(?:^|;)\s*background:\s*([^;]+?)\s*(?:;|$)/.exec(r.trim())[1]);
    const c = contraste(cor(sel), fundo);
    assert.ok(c >= 4.5, sel + ': ' + c.toFixed(2) + ':1');
  });
  // o nome do ramo em todas as cores de ramo
  const ramos = Object.keys(TOKENS).filter((k) => /^ramo-[a-z]+-[a-z]+$/.test(k));
  assert.ok(ramos.length >= 21);
  ramos.forEach((k) => {
    const c = contraste(cor('.fd-tec-ramo', { 'fd-ramo': 'var(--' + k + ')' }), PAPEL.peca);
    assert.ok(c >= 4.5, k + ': ' + c.toFixed(2) + ':1');
  });
});
