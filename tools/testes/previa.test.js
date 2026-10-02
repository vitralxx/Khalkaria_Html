'use strict';
// Prévia escondida da ficha v3 (F3c, js/ficha/kh-previa.js). Modo sombra: a v2
// segue ativa; a prévia só LÊ a khalkaria_ficha, migra e calcula em memória.
// Cobre: ativação (?ficha=v3 / khalkaria_ficha_previa), lista de arquivos ==
// data/ (o que o estado-apoio lê), cálculo sobre storage só-leitura com a ficha
// v2 de exemplo, render (todo número calculado com a conta e o tooltip da
// fórmula ligado por aria-describedby, selo nos não canônicos, ajuste migrado
// marcado, sem emoji) e o boot no navegador (vm): sem ativação, nada acontece.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const P = require('../../js/ficha/kh-previa.js');
const D = require('../../js/ficha/00-regras-dados.js');
const A = require('./estado-apoio.js');

const V2 = A.lerJSON('tools', 'testes', 'fixtures', 'ficha-v2-sintetica.json');
const EFEITOS = A.lerJSON('data', 'efeitos.json');
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;

function dados() { return Object.assign(A.dadosCatalogo(), { efeitos: EFEITOS, glifos: '', erros: [] }); }
function comV2(v2) { return A.soLeitura({ khalkaria_ficha: JSON.stringify(v2 || V2) }); }
// {id: texto} de cada dica e a lista de aria-describedby
function dicas(html) {
  const ids = {};
  const re = /<span class="kh-conta-dica kf3-dica" id="([^"]+)" role="tooltip">/g;
  let m;
  while ((m = re.exec(html))) {
    // conteúdo até o </span> que fecha a dica (spans balanceados)
    let i = re.lastIndex, prof = 1;
    const tag = /<(\/?)span\b[^>]*>/g;
    tag.lastIndex = i;
    let t;
    while (prof && (t = tag.exec(html))) prof += t[1] ? -1 : 1;
    ids[m[1]] = html.slice(i, t.index);
  }
  return { ids, refs: [...html.matchAll(/aria-describedby="([^"]+)"/g)].map((x) => x[1]) };
}

test('ativação: só com ?ficha=v3 (lembra a escolha) ou com khalkaria_ficha_previa=1', () => {
  const vazio = A.armazenamento({});
  assert.deepEqual(P.ativacao('', vazio), { ativa: false, lembrar: false });
  assert.deepEqual(P.ativacao('?ficha=v2', vazio), { ativa: false, lembrar: false });
  assert.deepEqual(P.ativacao('?fichas=v3', vazio), { ativa: false, lembrar: false });
  assert.deepEqual(P.ativacao('?ficha=v3', vazio), { ativa: true, lembrar: true });
  assert.deepEqual(P.ativacao('?x=1&ficha=v3#a', vazio), { ativa: true, lembrar: true });
  const ligada = A.armazenamento({ [P.CHAVE]: '1' });
  assert.deepEqual(P.ativacao('', ligada), { ativa: true, lembrar: false });
  assert.deepEqual(P.ativacao('?ficha=v3', ligada), { ativa: true, lembrar: false });
  assert.deepEqual(P.ativacao('', null), { ativa: false, lembrar: false }, 'sem storage');
  assert.equal(P.CHAVE, 'khalkaria_ficha_previa');
});

test('arquivos da prévia == data/catalogo, data/classes e data/racas (o que o estado-apoio lê)', () => {
  const nomes = (d) => fs.readdirSync(path.join(A.RAIZ, 'data', d)).filter((n) => n.endsWith('.json')).map((n) => n.slice(0, -5)).sort();
  assert.deepEqual(P.CATALOGOS, nomes('catalogo'));
  assert.deepEqual(P.CLASSES, nomes('classes'));
  assert.deepEqual(P.RACAS, nomes('racas'));
  P.arquivos().forEach((a) => assert.ok(fs.existsSync(path.join(A.RAIZ, a.caminho)), a.caminho));
});

test('carregar: busca cada arquivo com a versão; o que falha vai para erros e o resto segue', async () => {
  const pedidos = [];
  const fetchFn = (url) => {
    pedidos.push(url);
    if (url.includes('catalogo/dor.json')) return Promise.resolve({ ok: false, status: 404 });
    const rel = url.replace('http://x/', '').replace(/\?.*$/, '');
    const txt = fs.readFileSync(path.join(A.RAIZ, rel), 'utf8');
    return Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(txt)), text: () => Promise.resolve(txt) });
  };
  const d = await P.carregar(fetchFn, 'http://x/', '?v=abc');
  assert.equal(pedidos.length, P.arquivos().length);
  assert.ok(pedidos.every((u) => u.endsWith('?v=abc')));
  assert.deepEqual(d.erros, ['data/catalogo/dor.json']);
  assert.equal(d.catalogos.length, P.CATALOGOS.length - 1);
  assert.equal(d.classes.length, 7);
  assert.equal(d.racas.length, 7);
  assert.ok(d.efeitos && d.efeitos.porId);
  assert.match(d.glifos, /<symbol id="g-selo"/);
});

test('calcular: a v2 de exemplo migra e calcula sobre storage SÓ-LEITURA (nada é gravado)', () => {
  const ls = comV2();
  const r = P.calcular(ls, dados(), '?v=t');
  assert.equal(r.estado, 'ok', r.erro);
  assert.deepEqual(ls.escritas, []);
  assert.equal(r.de, '2.0');
  assert.equal(r.ficha.identidade.classe.id, 'classe-batedor');
  assert.equal(r.ficha.identidade.ramo.id, 'batedor-ramo-do-cartografo');
  // o ajuste migrado já foi comparado com o motor (sem poda pendente)
  assert.ok(!r.ficha.migracao.ajustesPendentesDePoda);
  assert.equal(r.ficha.ajustes['recurso.saude.max'].valor, 22);
  assert.equal(typeof r.ficha.ajustes['recurso.saude.max'].calculadoEm, 'number');
  assert.equal(r.av.nos['recurso.saude.max'].valor, 22);
});

test('calcular: sem ficha, ficha ilegível, catálogo e efeitos indisponíveis', () => {
  assert.equal(P.calcular(A.soLeitura({}), dados()).estado, 'sem-ficha');
  assert.equal(P.calcular(A.soLeitura({ khalkaria_ficha: '{x' }), dados()).estado, 'erro');
  assert.equal(P.calcular(comV2({ schemaVersion: '9.0', meta: {} }), dados()).estado, 'erro');
  const r = P.calcular(comV2(), { catalogos: [], classes: [], racas: [], efeitos: null, erros: ['data/efeitos.json'] });
  assert.equal(r.estado, 'ok');
  assert.equal(r.semCatalogo, true);
  assert.equal(r.semEfeitos, true);
  assert.equal(r.ficha.identidade.classe.id, null, 'sem catálogo a classe fica só pelo nome');
  const h = P.render(r).html;
  assert.match(h, /Catálogo indisponível/);
  assert.match(h, /Não carregou: data\/efeitos\.json/);
  assert.match(P.render(P.calcular(A.soLeitura({}), dados())).html, /Não há ficha v2 neste navegador/);
});

test('render: todo número pedido aparece com a conta e o tooltip da fórmula (simbólica e numérica)', () => {
  const r = P.calcular(comV2(), dados());
  const { html, caminhos } = P.render(r);
  const esperados = [];
  ['FOR', 'DES', 'CON', 'INT', 'SAB'].forEach((a) => esperados.push('atributo.' + a + '.total', 'atributo.' + a + '.mod'));
  D.pericias.forEach((p) => esperados.push('pericia.' + p.id + '.total'));
  ['saude', 'stamina', 'eter', 'classe'].forEach((x) => esperados.push('recurso.' + x + '.max'));
  esperados.push('evasao.passiva', 'evasao.ativa', 'cd', 'movimento', 'acoes', 'capacidade.equipamentos',
    'capacidade.bugigangas', 'carga', 'ar', 'limiar.saldo');
  ['ordinario', 'elemental', 'biologico', 'mistico', 'todos'].forEach((c) => esperados.push('ae.' + c));
  const TIPOS = ['cortante', 'contundente', 'perfurante', 'fogo', 'frio', 'eletrico', 'veneno', 'acido', 'psiquico',
    'radiante', 'trovejante', 'necrotico', 'forca', 'primordial'];
  TIPOS.forEach((t) => esperados.push('resistencia.' + t, 'imunidade.' + t, 'vulnerabilidade.' + t, 'ae.' + t, 'defesa.' + t));
  // magia do exemplo: as 3 intensidades do Nível 1 (sem Contida)
  esperados.push('magia.magia-fagulha.custo.normal', 'magia.magia-fagulha.custo.forcada', 'magia.magia-fagulha.custo.transbordante');
  const atq = r.av.ordem.filter((c) => /^ataque\./.test(c));
  assert.ok(atq.length >= 2, 'arma equipada no exemplo');
  esperados.push(...atq);
  const faltam = esperados.filter((c) => !caminhos.includes(c));
  assert.deepEqual(faltam, []);
  assert.equal(new Set(caminhos).size, caminhos.length, 'cada número uma vez');
  assert.equal(D.pericias.length, 24);

  const { ids, refs } = dicas(html);
  assert.equal(refs.length, caminhos.length, 'uma conta por número');
  assert.equal(new Set(refs).size, refs.length, 'ids únicos');
  refs.forEach((id) => {
    assert.ok(ids[id] != null, 'aria-describedby sem dica: ' + id);
    const sim = /<span class="kf3-d-sim">([^<]+)<\/span>/.exec(ids[id]);
    const num = /<span class="kf3-d-num">([^<]+)<\/span>/.exec(ids[id]);
    assert.ok(sim && sim[1].trim(), 'fórmula simbólica: ' + id);
    assert.ok(num && num[1].startsWith('= '), 'fórmula numérica: ' + id);
  });
  // a conta é focável (teclado) e usa o componente do css/componentes.css
  assert.equal((html.match(/class="kh-conta kf3-conta" tabindex="0"/g) || []).length, caminhos.length);
  assert.doesNotMatch(html, EMOJI, 'sem emoji');
  assert.doesNotMatch(html, /<script|on[a-z]+=/i);
});

test('render: selo em todo número não canônico, fonte de cada termo, ajuste migrado marcado', () => {
  const r = P.calcular(comV2(), dados());
  const { html } = P.render(r);
  const { ids } = dicas(html);
  const porCaminho = {};
  for (const m of html.matchAll(/aria-describedby="([^"]+)"(?: data-ajustado)? data-caminho="([^"]+)"/g)) porCaminho[m[2]] = m[1];
  let comSelo = 0;
  Object.entries(porCaminho).forEach(([c, id]) => {
    const no = r.av.nos[c] || (() => {
      const m = /^(magia\..+\.custo)\.(\w+)$/.exec(c);
      return r.av.nos[m[1]].porIntensidade.find((x) => x.intensidade === m[2]).no;
    })();
    no.selos.forEach((s) => {
      comSelo++;
      assert.ok(ids[id].includes(D.rotulosSelo[s]), c + ': o tooltip diz o selo ' + s);
    });
    // todo termo com fonte aparece com ela (menos o próprio ajuste, que já se nomeia)
    no.termos.filter((t) => t.fonte && t.fonte.tipo !== 'ajuste').forEach((t) => {
      assert.ok(/kf3-t-f/.test(ids[id]), c + ': termo com fonte');
    });
  });
  assert.ok(comSelo > 0, 'o exemplo tem números com selo');
  // Movimento (perícia) é "maior" trocável (D7, decisão): selo visível ao lado do número
  assert.match(html, /data-caminho="pericia\.movimento\.total">.*?<\/span><\/span><span class="kf3-selo kf3-selo-decisaoPedro"/);
  // ajuste migrado: marcado no número, com o calculado ao lado e na lista de ajustes
  assert.match(html, /data-ajustado data-caminho="recurso\.saude\.max"/);
  assert.match(html, /<span class="kf3-calc">calc\. 20<\/span>/);
  assert.match(html, /Saúde máx\.<\/b>: valor fixo 22 · calculado 20 · <span class="kf3-selo kf3-selo-ajuste">migrado da v2<\/span>/);
  assert.match(ids[porCaminho['recurso.saude.max']], /Ajuste migrado da v2: calculado 20 · ajustado 22/);
  // o recurso de classe do Espadachim (D105) é canônico e não é contador: as características, sem selo
  const v2 = JSON.parse(JSON.stringify(V2));
  v2.meta.classe = 'Espadachim'; v2.meta.ramo = '';
  const re = P.calcular(comV2(v2), dados());
  const no = re.av.nos['recurso.classe.max'];
  assert.ok(!no.selos.includes('pendentePedro'), JSON.stringify(no.selos));
  assert.equal(no.status, 'canonico');
  assert.match(P.render(re).html, /Recurso de classe <span class="kf3-sub">\(sem contador\)<\/span>.*?data-caminho="recurso\.classe\.max"><b class="kf3-v">Proficiência com Espadas · Marca do Duelo<\/b>/);
});

test('revisão F3c: bônus de item sobre o total migrado vai para Avisos (sem decidir), sem desligar', () => {
  const v2 = JSON.parse(JSON.stringify(V2));
  v2.meta.classe = 'Brutalista'; v2.meta.ramo = '';
  v2.atributos.for = 18;
  v2.inventario.bugigangas.push({ id: 'item-cinturao-do-colosso', nome: 'Cinturão do Colosso', qtd: 1, sintonizado: true, uid: 'eCint' });
  const r = P.calcular(comV2(v2), dados());
  const no = r.av.nos['atributo.FOR.total'];
  // a conta segue a mesma (o item vale, como valia na v2): a pergunta vai ao Pedro
  assert.equal(no.valor, 20);
  const t = no.termos.find((x) => /Cinturão/.test(x.rotulo));
  assert.ok(t && t.ativo, 'o item continua na conta');
  assert.match(t.motivo, /total digitado na v2.*pendente Pedro/);
  const av = r.av.avisos.filter((a) => a.tipo === 'migracao-item-atributo');
  assert.deepEqual(av.map((a) => [a.item, a.atributos]), [['Cinturão do Colosso', ['FOR']]]);
  const h = P.render(r).html;
  assert.match(h, /Motor: Cinturão do Colosso soma em FOR por cima do total digitado na v2/);
  assert.match(h, /Item com bônus de atributo ainda soma por cima/);
  // sem sintonia, nada de aviso
  v2.inventario.bugigangas[v2.inventario.bugigangas.length - 1].sintonizado = false;
  assert.ok(!P.calcular(comV2(v2), dados()).av.avisos.some((a) => a.tipo === 'migracao-item-atributo'));
});

test('revisão F3c: cartas sem posição, Ae(Ordinário) e Éter 0/0 aparecem em Avisos; aviso de cada número também', () => {
  const r = P.calcular(comV2(), dados());
  const h = P.render(r).html;
  const bloco = /<h3 class="kf3-h" id="kf3-h-avisos">[\s\S]*$/.exec(h)[0];
  const cartas = r.ficha.entradas.filter((e) => e.tipo === 'carta').length;
  assert.ok(cartas > 0);
  // pendências da migração
  assert.match(bloco, new RegExp('Pendência: ' + cartas + ' carta'));
  assert.match(bloco, /Pendência: A v2 tinha Ae\(Ordinário\) 1/);
  assert.match(bloco, /Pendência: A v2 tinha Éter 0\/0/);
  // o alerta de Oco fica marcado como possível efeito da migração (não é escondido)
  assert.match(bloco, /Alerta: Oco: [^<]*\(pode ser efeito da migração: a v2 tinha 0\/0\)/);
  // os avisos por número (no.avisos) entram na lista com o rótulo do número
  assert.match(bloco, /Ae\(Ordinário\): Ae\(Ordinário\) não existe \(D67\)/);
  assert.match(bloco, /Pontos do Limiar: \d+ cartas? sem posição na mão/);
  const n = Object.values(r.av.nos).reduce((s, no) => s + no.avisos.length, 0);
  assert.ok(n >= 2);
  // marca à vista no número do Limiar
  assert.match(h, /data-caminho="limiar\.saldo">[\s\S]*?<\/span><\/span> <span class="kf3-aviso kf3-marca-aviso"/);
});

test('revisão F3c: categoria "outros" com nome; contador digitado na v2 num recurso que não é contador (D105) vira aviso, nunca some', () => {
  const r = P.calcular(comV2(), dados());
  const h = P.render(r).html;
  assert.match(h, /Força <span class="kf3-sub">Outros<\/span>/);
  assert.match(h, /Primordial <span class="kf3-sub">Outros<\/span>/);
  assert.doesNotMatch(h, /kf3-sub">outros</);
  // Batedor tem medidor no contrato: fica o nome do contrato
  assert.doesNotMatch(h, /nome digitado na v2/);
  const v2 = JSON.parse(JSON.stringify(V2));
  v2.meta.classe = 'Espadachim'; v2.meta.ramo = '';
  v2.recursos.recursoClasse = { nome: 'Foco', atual: 1, max: 4 };
  const re = P.calcular(comV2(v2), dados());
  const he = P.render(re).html;
  assert.match(he, /Recurso de classe <span class="kf3-sub">\(sem contador\)<\/span>/);
  assert.doesNotMatch(he, /nome digitado na v2/);
  // o contador "Foco 1/4" da v2 não é descartado: aviso no número e na lista de Avisos
  const nc = re.av.nos['recurso.classe.max'];
  assert.ok(nc.avisos.some((a) => a.tipo === 'recurso-sem-contador' && /"Foco" \(atual 1\)/.test(a.msg)), JSON.stringify(nc.avisos));
  assert.match(he, /<li>[^<]*&quot;Foco&quot; \(atual 1\); pelo contrato \(D105\) o recurso de classe de Espadachim não é contador/);
  // o número do contador antigo não aparece como recurso: as características ocupam o lugar
  assert.match(he, /data-caminho="recurso\.classe\.max"><b class="kf3-v">Proficiência com Espadas · Marca do Duelo<\/b>/);
});

test('navegador (vm, artefato js/ficha.js): sem ativação a prévia não toca em nada; com ?ficha=v3 só grava a própria chave', () => {
  const SRC = fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha.js'), 'utf8');
  function pagina(search, inicial) {
    const st = new Map(Object.entries(inicial || {})), escritas = [], criados = [], ouvintes = [], buscas = [];
    const document = {
      readyState: 'loading', currentScript: null, activeElement: null, visibilityState: 'visible',
      body: { hasAttribute: () => false, appendChild() {} }, head: { appendChild() {} },
      querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
      createElement: (t) => { criados.push(t); return { setAttribute() {}, appendChild() {}, addEventListener() {} }; },
      addEventListener: (t) => ouvintes.push(t),
      dispatchEvent() { return true; }
    };
    const sandbox = {
      document, CustomEvent, URL, console, location: { search },
      localStorage: { getItem: (k) => (st.has(k) ? st.get(k) : null), setItem: (k, v) => { escritas.push(k); st.set(k, String(v)); },
        removeItem: (k) => { escritas.push('-' + k); st.delete(k); } },
      setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: (f) => f(),
      fetch: (u) => { buscas.push(u); return Promise.resolve({ ok: true, json: () => Promise.resolve([]) }); },
      addEventListener() {}
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(SRC, sandbox, { filename: 'ficha.js' });
    return { win: sandbox, escritas, criados, ouvintes, buscas };
  }
  // a v2 sozinha, como referência (o que ela faz no boot não é da prévia)
  const base = pagina('');
  assert.equal(typeof base.win.KhPrevia, 'object');
  assert.equal(typeof base.win.KF, 'object', 'a v2 segue montando a KF');
  const v2 = { escritas: base.escritas.slice(), ouvintes: base.ouvintes.filter((t) => t === 'DOMContentLoaded').length };

  const liga = pagina('?ficha=v3');
  assert.deepEqual(liga.escritas.filter((k) => !v2.escritas.includes(k)), ['khalkaria_ficha_previa']);
  assert.equal(liga.ouvintes.filter((t) => t === 'DOMContentLoaded').length, v2.ouvintes + 1, 'monta no DOMContentLoaded');
  assert.ok(!liga.escritas.some((k) => /v3|dono/.test(k)), 'nenhuma chave v3 nem o marcador');

  const lembrada = pagina('', { khalkaria_ficha_previa: '1' });
  assert.deepEqual(lembrada.escritas, v2.escritas, 'já lembrada: não regrava');
  assert.equal(lembrada.ouvintes.filter((t) => t === 'DOMContentLoaded').length, v2.ouvintes + 1);

  const nada = pagina('?ficha=v2');
  assert.deepEqual(nada.escritas, v2.escritas);
  assert.equal(nada.ouvintes.filter((t) => t === 'DOMContentLoaded').length, v2.ouvintes);
  assert.deepEqual(nada.buscas, base.buscas);
});

test('css/ficha-previa.css: só a prévia o pede (o shell não o injeta) e tudo nele fica sob .kf3', () => {
  const css = fs.readFileSync(path.join(A.RAIZ, 'css', 'ficha-previa.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const seletores = [...css.matchAll(/([^{}]+)\{[^{}]*\}/g)].map((m) => m[1].trim());
  assert.ok(seletores.length > 20);
  seletores.forEach((s) => s.split(',').forEach((x) => assert.match(x.trim(), /^\.kf3/, 'seletor fora da prévia: ' + x)));
  const paginas = fs.readdirSync(path.join(A.RAIZ, 'pages')).filter((n) => n.endsWith('.html')).map((n) => path.join('pages', n)).concat(['index.html']);
  paginas.forEach((p) => assert.doesNotMatch(fs.readFileSync(path.join(A.RAIZ, p), 'utf8'), /ficha-previa\.css/, p));
  assert.match(fs.readFileSync(path.join(A.RAIZ, 'js', 'ficha', 'kh-previa.js'), 'utf8'), /css\/ficha-previa\.css/);
});
