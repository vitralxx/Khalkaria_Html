/* ============================================================
   O BAZAR — registro de itens de Kharavel (núcleo)
   Dados: data/bazar.json (gerado por tools/gerar_bazar.py a partir do CSV).
   Vocabulário e total: window.BZ_VOCAB, injetado no HTML pelo gerador.

   Este arquivo cria window.BZ de forma síncrona e cuida do catálogo, dos
   filtros, da Bancada, do "Fecha com o inventário", dos selos ×N e do teclado
   global. Os outros módulos (IIFE clássicos, carregados depois) recebem o BZ:
     js/bazar-cartao.js      pop-up do card
     js/bazar-receita.js     painel de receita, histórico e #item/<id>
     js/bazar-inventario.js  inventário, combobox, DnD e migração do saco
   Ordem de carga no template: ficha.js -> bazar.js -> cartao -> receita -> inventario.

   Contrato com a Ficha Interativa (js/ficha.js), NÃO quebrar:
     - cada item é .item-card com data-n="<Nome exato>" (e data-id="<id>")
     - contém .item-name (onde o botão "+ inventário" é pendurado)
     - data/bazar.json continua sendo um ARRAY com id/nome/categoria/
       raridade/efeito/valor/inv
     - o catálogo chega à ficha por KF.catalogo(ITENS), ANTES do 1º render
   O MutationObserver da ficha redecora sozinho a cada re-render.
   ============================================================ */
(function () {
  'use strict';

  var V = window.BZ_VOCAB || {};
  var LS = 'khalkaria_bazar_estado';
  // Os objetos abaixo nunca são reatribuídos: o BZ.dados aponta para eles.
  var ITENS = [];
  var porNome = {};      // nome -> item
  var porId = {};        // id -> item
  var usadoEm = {};      // nome do ingrediente -> [nomes de receita]
  var filhos = {};       // nome -> [nomes que evoluem dele]

  var ICO = {
    'Arma': 'ico-arma', 'Armadura': 'ico-armadura', 'Escudo': 'ico-escudo',
    'Consumível': 'ico-consumivel', 'Munição': 'ico-municao', 'Bugiganga': 'ico-bugiganga',
    'Item Mágico': 'ico-magico', 'Material': 'ico-material', 'Lixo': 'ico-lixo'
  };
  var ORD_RAR = ['Lixo', 'Ordinário', 'Incomum', 'Exótico', 'Luxária'];
  // ofício do CSV -> perícia que o jogador rola
  var PERICIA = {
    'Ferraria': 'Ofício (Ferraria)', 'Engenharia': 'Ofício (Engenharia)',
    'Alquimia': 'Ofício (Alquimia)', 'Sobrevivência': 'Sobrevivência'
  };
  var OFICIOS_CD = ['Ferraria', 'Engenharia', 'Alquimia', 'Sobrevivência'];
  var FILTROS = ['cat', 'rar', 'reg', 'of', 'arq'];

  // estado persistido (spec §7). O objeto E nunca é reatribuído (BZ.E aponta para ele).
  var E = {
    v: 2, q: '', vista: 'cards', ordem: 'nome', dir: 1,
    cat: [], rar: [], reg: [], of: [], arq: [],
    bancada: false,
    mods: { 'Ferraria': 0, 'Engenharia': 0, 'Alquimia': 0, 'Sobrevivência': 0 },
    fecho: false, filtrosAbertos: false,
    inv: 'painel', colRecolhida: { bugigangas: false, equipamentos: false },
    sacoMigrado: false, avisoMigracaoVisto: false
  };
  // A Mochila antiga (E.saco) saiu da página, mas o conteúdo dela só é apagado
  // por escolha explícita do jogador (faixa de migração do inventário, §7).
  // Até lá, cada salvar() regrava a chave `saco` como estava.
  var sacoAntigo = null;

  // ------------------------------------------------------------ utilidades
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function semAcento(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function classeRar(r) { return 'rar-' + semAcento(r || '').toLowerCase(); }
  function svg(id, cls) {
    return '<svg class="' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }
  function icoRar(r) { return svg('rar-' + semAcento(r || '').toLowerCase()); }
  function icoCat(it) { return ICO[it && it.cats && it.cats[0]] || 'ico-material'; }
  // Materiais têm arte própria (images/materiais/*.webp). Quem não tem cai no
  // ícone gravado. O medalhão usa o mesmo fundo em que a arte foi composta,
  // então as imagens sem recorte perfeito não mostram a emenda.
  function arte(it, cls) {
    if (!it) return '';
    if (it.arte) return '<img class="bz-arte ' + (cls || '') + '" src="../images/' + esc(it.arte) +
      '" alt="" loading="lazy" decoding="async">';
    return svg(icoCat(it), cls);
  }
  function emCampo(el) {
    el = el || document.activeElement;
    if (!el || el === document.body) return false;
    var t = el.tagName;
    return t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA' || !!el.isContentEditable;
  }
  function raf(fn) {
    return window.requestAnimationFrame ? window.requestAnimationFrame(fn) : setTimeout(fn, 16);
  }
  // A KF da ficha v2. Com um ficha.js antigo em cache, o catálogo segue
  // funcionando e tudo que depende do inventário fica desligado.
  function kf() { var k = window.KF; return k && k.versao === '2' ? k : null; }

  function ondeAchar(nome) {
    var m = porNome[nome];
    if (!m) return '';
    var r = m.regiao || (m.unico ? 'Único/Quest' : '');
    return [r, m.cr ? 'CR ' + m.cr : ''].filter(Boolean).join(' · ');
  }
  // Linha de peso derivada de it.inv (nunca pré-calculada no JSON).
  function pesoTexto(it) {
    var inv = it && it.inv;
    if (!inv) return '—';
    var pilha = (window.KhInv && window.KhInv.REGRAS && window.KhInv.REGRAS.PILHA) || 10;
    var p = [];
    if (inv.ocupa === false) p.push('Não ocupa espaço');
    else p.push(inv.slot === 'equipamento' ? 'Equipamento' : 'Bugiganga');
    if (inv.armadura) p.push('Armadura [' + inv.armadura + ']');
    if (inv.empilhavel) p.push('empilhável ' + pilha + ':1');
    var cap = inv.capacidade || {};
    if (cap.bug) p.push('+' + cap.bug + (cap.bug === 1 ? ' bugiganga' : ' bugigangas'));
    if (cap.equip) p.push('+' + cap.equip + (cap.equip === 1 ? ' equipamento' : ' equipamentos'));
    if (inv.recipiente) p.push('recipiente ainda não modelado');
    return p.join(' · ');
  }

  // ------------------------------------------------------------ estado
  function salvar() {
    try {
      var out = Object.assign({}, E);
      if (sacoAntigo && !E.sacoMigrado) out.saco = sacoAntigo;
      localStorage.setItem(LS, JSON.stringify(out));
    } catch (e) {}
  }
  function carregar() {
    var g = null;
    try { g = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { g = null; }
    if (!g || typeof g !== 'object' || Array.isArray(g)) g = {};
    try {
      if (!g.sacoMigrado && g.saco && typeof g.saco === 'object' && !Array.isArray(g.saco) &&
          Object.keys(g.saco).length) sacoAntigo = g.saco;
      Object.keys(g).forEach(function (k) { if (k in E && k !== 'v') E[k] = g[k]; });
    } catch (e) {}
    FILTROS.forEach(function (k) { if (!Array.isArray(E[k])) E[k] = []; });
    if (!E.mods || typeof E.mods !== 'object') E.mods = {};
    OFICIOS_CD.forEach(function (o) { if (typeof E.mods[o] !== 'number') E.mods[o] = 0; });
    if (E.vista !== 'lista') E.vista = 'cards';
    if (['nome', 'raridade', 'valor', 'cd', 'categoria', 'efeito', 'obtencao', 'regiao', 'craft'].indexOf(E.ordem) < 0) E.ordem = 'nome';
    E.dir = E.dir === -1 ? -1 : 1;
    E.q = typeof E.q === 'string' ? E.q : '';
    E.bancada = !!E.bancada; E.fecho = !!E.fecho;
    E.sacoMigrado = !!E.sacoMigrado; E.avisoMigracaoVisto = !!E.avisoMigracaoVisto;
    // 1ª visita: filtros abertos só se a janela é alta; inventário em trilho abaixo de 1280px
    if (!('filtrosAbertos' in g)) E.filtrosAbertos = window.innerHeight >= 900;
    E.filtrosAbertos = !!E.filtrosAbertos;
    if (!('inv' in g)) E.inv = window.innerWidth < 1280 ? 'trilho' : 'painel';
    if (['painel', 'trilho', 'amplo'].indexOf(E.inv) < 0) E.inv = 'painel';
    if (!E.colRecolhida || typeof E.colRecolhida !== 'object') E.colRecolhida = {};
    E.colRecolhida = { bugigangas: !!E.colRecolhida.bugigangas, equipamentos: !!E.colRecolhida.equipamentos };
    E.v = 2;
  }

  // valor "5d12+180" -> número aproximado só para ORDENAR (nunca é exibido)
  function pesoValor(v) {
    var m = /^(\d+)d(\d+)(?:\+(\d+))?/.exec(v || '');
    if (!m) return 0;
    return (+m[1]) * ((+m[2]) + 1) / 2 + (+(m[3] || 0));
  }

  // ------------------------------------------------------------ índices
  function indexar() {
    ITENS.forEach(function (it) {
      porNome[it.nome] = it;
      if (it.id) porId[it.id] = it;
      it._rar = ORD_RAR.indexOf(it.raridade);
      it._valor = pesoValor(it.valor);
    });
    ITENS.forEach(function (it) {
      (it.ing || []).forEach(function (g) {
        var l = usadoEm[g.item] = usadoEm[g.item] || [];
        if (l.indexOf(it.nome) < 0) l.push(it.nome);
      });
      if (it.pai) (filhos[it.pai] = filhos[it.pai] || []).push(it.nome);
    });
  }
  function cadeia(it) {                    // da raiz até o item
    var c = [it], guarda = 0;
    while (c[0].pai && porNome[c[0].pai] && guarda++ < 12) c.unshift(porNome[c[0].pai]);
    return c;
  }

  // ------------------------------------------------------------ inventário (leitura)
  var qtdPorId = {};
  function releQtd() {
    var k = kf();
    try { qtdPorId = k ? k.quantidadePorId() : {}; } catch (e) { qtdPorId = {}; }
  }
  // soma as duas colunas, equipados inclusive (KF.tenho), lida do cache da última mudança
  function tenho(id) { return +qtdPorId[id] || 0; }
  function fecha(it) {
    if (!it || !it.ing || !it.ing.length) return false;
    return it.ing.every(function (g) {
      var m = porNome[g.item];
      return !!m && tenho(m.id) >= g.n;
    });
  }
  var fechaChave = '';
  function recalcFecho() {
    var ids = [];
    if (kf()) ITENS.forEach(function (it) { if (fecha(it)) ids.push(it.id); });
    var n = $('#bz-fecho-n');
    if (n) n.textContent = ids.length;
    var antes = fechaChave;
    fechaChave = ids.join('|');
    return antes !== fechaChave;
  }

  // ------------------------------------------------------------ bancada
  // 10+Mod = régua confortável · 20+Mod = limite do alcançável
  function alcance(it) {
    if (!E.bancada) return 'neutro';
    if (it.cd == null || !PERICIA[it.craft]) return 'fora';
    var mod = +E.mods[it.craft] || 0;
    if (it.cd <= 10 + mod) return 'ok';
    if (it.cd <= 20 + mod) return 'dificil';
    return 'fora';
  }

  // ------------------------------------------------------------ filtro
  function passa(it) {
    if (E.q) {
      var termos = E.q.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < termos.length; i++) {
        if (it.busca.indexOf(termos[i]) < 0 &&
            semAcento(it.busca).indexOf(semAcento(termos[i])) < 0) return false;
      }
    }
    if (E.cat.length && !it.cats.some(function (c) { return E.cat.indexOf(c) >= 0; })) return false;
    if (E.rar.length && E.rar.indexOf(it.raridade) < 0) return false;
    if (E.reg.length) {
      var alvo = it.regiao || (it.unico ? 'Único/Quest' : '');
      if (E.reg.indexOf(alvo) < 0) return false;
    }
    if (E.of.length && E.of.indexOf(it.craft) < 0) return false;
    if (E.arq.length && E.arq.indexOf(it.arquetipo) < 0) return false;
    if (E.bancada && alcance(it) === 'fora') return false;
    if (E.fecho && kf() && !fecha(it)) return false;
    return true;
  }

  function ordenar(lista) {
    var k = E.ordem;
    return lista.sort(function (a, b) {
      var r;
      if (k === 'raridade') r = a._rar - b._rar || a.nome.localeCompare(b.nome, 'pt');
      else if (k === 'valor') r = a._valor - b._valor || a.nome.localeCompare(b.nome, 'pt');
      else if (k === 'cd') {
        var ca = a.cd == null ? 1e9 : a.cd, cb = b.cd == null ? 1e9 : b.cd;
        r = ca - cb || a.nome.localeCompare(b.nome, 'pt');
      } else r = a.nome.localeCompare(b.nome, 'pt');
      return r * E.dir;
    });
  }

  // ------------------------------------------------------------ chips
  function contar(chave, valor) {
    var n = 0;
    for (var i = 0; i < ITENS.length; i++) {
      var it = ITENS[i];
      if (chave === 'cat') { if (it.cats.indexOf(valor) >= 0) n++; }
      else if (chave === 'rar') { if (it.raridade === valor) n++; }
      else if (chave === 'reg') { if ((it.regiao || (it.unico ? 'Único/Quest' : '')) === valor) n++; }
      else if (chave === 'of') { if (it.craft === valor) n++; }
      else if (chave === 'arq') { if (it.arquetipo === valor) n++; }
    }
    return n;
  }

  function chip(chave, valor, extra, ico) {
    var on = E[chave].indexOf(valor) >= 0;
    return '<button type="button" class="chip ' + (extra || '') + (on ? ' on' : '') +
      '" data-f="' + chave + '" data-v="' + esc(valor) + '" aria-pressed="' + on + '">' +
      (ico ? svg(ico) : '') + esc(valor) +
      '<span class="chip-n">' + contar(chave, valor) + '</span></button>';
  }

  function grupo(nome, html) {
    return '<div class="bz-grupo"><span class="bz-grupo-nome">' + nome + '</span>' + html + '</div>';
  }

  function montarFiltros() {
    var h = '';
    h += grupo('Categoria', (V.categorias || []).map(function (c) {
      return chip('cat', c, '', ICO[c]);
    }).join(''));

    h += grupo('Raridade', (V.raridades || []).map(function (r) {
      return '<button type="button" class="chip chip-rar ' + classeRar(r) +
        (E.rar.indexOf(r) >= 0 ? ' on' : '') + '" data-f="rar" data-v="' + esc(r) +
        '" aria-pressed="' + (E.rar.indexOf(r) >= 0) + '">' + icoRar(r) + esc(r) +
        '<span class="chip-n">' + contar('rar', r) + '</span></button>';
    }).join(''));

    h += grupo('Região', (V.regioes || []).map(function (r, i) {
      var on = E.reg.indexOf(r) >= 0;
      return '<button type="button" class="chip chip-reg' + (on ? ' on' : '') +
        '" style="--r:' + i + '" data-f="reg" data-v="' + esc(r) + '" aria-pressed="' + on +
        '"><span class="bz-reg-n">' + (i + 1) + '.</span> ' + esc(r) +
        '<span class="chip-n">' + contar('reg', r) + '</span></button>';
    }).join('') + chip('reg', 'Único/Quest'));

    h += grupo('Ofício', (V.oficios || []).map(function (o) { return chip('of', o); }).join(''));

    var arqs = [].concat(V.chassis || [], V.focos || [], V.slots || [], V.municoes || [])
      .filter(function (a, i, arr) { return a && arr.indexOf(a) === i; });
    var visiveis = arqs.slice(0, 8), resto = arqs.slice(8);
    h += grupo('Arquétipo',
      visiveis.map(function (a) { return chip('arq', a); }).join('') +
      (resto.length
        ? '<span class="bz-arq-resto" hidden>' + resto.map(function (a) { return chip('arq', a); }).join('') + '</span>' +
          '<button type="button" class="bz-mais" id="bz-arq-mais">+' + resto.length + ' arquétipos</button>'
        : ''));

    $('#bz-filtros').innerHTML = h;
  }

  // ------------------------------------------------------------ render
  function seloHTML(id) {
    var n = tenho(id);
    return n ? '<span class="bz-selo-n" title="No inventário: ' + n + '">×' + n + '</span>' : '';
  }
  function cardHTML(it, i) {
    var al = alcance(it);
    var reg = it.regiao || (it.unico ? 'Único/Quest' : '');
    return '<article class="item-card ' + classeRar(it.raridade) +
      (al === 'dificil' ? ' dificil' : '') + (al === 'ok' ? ' alcancavel' : '') +
      (it.id === BZ.selecionado ? ' selecionado' : '') +
      '" data-n="' + esc(it.nome) + '" data-id="' + esc(it.id) + '" style="--i:' + i + '" tabindex="0">' +
      '<div class="item-head">' + arte(it, 'item-ico') +
        '<span class="item-name">' + esc(it.nome) + '</span>' + seloHTML(it.id) + '</div>' +
      '<div class="item-chips">' +
        '<span class="tag-rar">' + icoRar(it.raridade) + esc(it.raridade) + '</span>' +
        '<span class="tag-cat">' + esc(it.categoria) + '</span>' +
        (it.arquetipo ? '<span class="tag-arq">' + esc(it.arquetipo) + '</span>' : '') +
        (reg ? '<span class="tag-reg">' + esc(reg) + '</span>' : '') +
        (it.craft && it.craft !== 'Não-craftável'
          ? '<span class="tag-of">' + esc(it.craft) + (it.cd != null ? ' CD ' + it.cd : '') + '</span>' : '') +
      '</div>' +
      '<p class="item-efeito">' + esc(it.efeito) + '</p>' +
      (al === 'dificil'
        ? '<p class="item-aviso">' + svg('ico-aviso', 'bz-ico-aviso') + 'CD ' + it.cd +
          ' — acima da sua régua confortável (' + (10 + (+E.mods[it.craft] || 0)) + '), ainda alcançável.</p>' : '') +
      '<div class="item-meta">' +
        '<span><b>Valor</b> <span class="item-valor">' + esc(it.valor) + '</span></span>' +
        (it.cr ? '<span><b>CR</b> ' + esc(it.cr) + '</span>' : '') +
        (it.cd != null ? '<span><b>CD</b> <span class="item-cd">' + it.cd + '</span></span>' : '') +
      '</div></article>';
  }

  var COLS = [
    ['nome', 'Nome'], ['raridade', 'Raridade'], ['categoria', 'Categoria'],
    ['efeito', 'Efeito'], ['valor', 'Valor'], ['obtencao', 'Obtenção'],
    ['regiao', 'Região'], ['craft', 'Ofício'], ['cd', 'CD']
  ];
  function cabecalhoHTML() {
    return '<table class="bz-tabela"><thead><tr>' + COLS.map(function (c) {
      var sort = E.ordem === c[0] ? ' aria-sort="' + (E.dir > 0 ? 'ascending' : 'descending') + '"' : '';
      return '<th class="c-' + c[0] + '" data-col="' + c[0] + '"' + sort + '>' + c[1] + '</th>';
    }).join('') + '</tr></thead><tbody></tbody></table>';
  }
  function linhasHTML(lista) {
    return lista.map(function (it) {
      var reg = it.regiao || (it.unico ? 'Único/Quest' : '—');
      return '<tr class="item-card ' + classeRar(it.raridade) + (it.id === BZ.selecionado ? ' selecionado' : '') +
        '" data-n="' + esc(it.nome) + '" data-id="' + esc(it.id) + '" tabindex="0">' +
        '<td class="c-nome" data-prever="' + esc(it.id) + '">' + arte(it, 'c-ico') +
          '<span class="item-name">' + esc(it.nome) + '</span>' + seloHTML(it.id) + '</td>' +
        '<td class="c-raridade"><span class="tag-rar">' + icoRar(it.raridade) + esc(it.raridade) + '</span></td>' +
        '<td class="c-categoria">' + esc(it.categoria) + '</td>' +
        '<td class="c-efeito"><span>' + esc(it.efeito) + '</span></td>' +
        '<td class="c-valor">' + esc(it.valor) + '</td>' +
        '<td class="c-obtencao">' + esc(it.obtencao) + '</td>' +
        '<td class="c-regiao">' + esc(reg) + '</td>' +
        '<td class="c-craft">' + esc(it.craft) + '</td>' +
        '<td class="c-cd">' + (it.cd == null ? '—' : it.cd) + '</td></tr>';
    }).join('');
  }

  function nFiltros() {
    return FILTROS.reduce(function (s, k) { return s + E[k].length; }, 0);
  }
  function atualizaFiltrosBtn() {
    var n = nFiltros();
    $('#bz-filtros-n').textContent = n ? '(' + n + ')' : '';
    var b = $('#bz-filtros-btn');
    b.setAttribute('aria-expanded', String(!!E.filtrosAbertos));
    b.classList.toggle('tem', n > 0);
  }
  function ativos() {
    var box = $('#bz-ativos'), h = '';
    FILTROS.forEach(function (k) {
      E[k].forEach(function (v) {
        h += '<button type="button" class="bz-ativo" data-f="' + k + '" data-v="' + esc(v) + '" aria-label="Remover filtro ' + esc(v) + '">' + esc(v) + '</button>';
      });
    });
    if (E.q) h += '<button type="button" class="bz-ativo" data-f="q" data-v="" aria-label="Limpar busca">“' + esc(E.q) + '”</button>';
    atualizaFiltrosBtn();
    if (!h) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = '<span class="bz-ativos-nome">Filtros</span>' + h +
      '<button type="button" class="bz-limpar-tudo" id="bz-limpar">limpar tudo</button>';
  }

  // Renderiza em lotes. Com os 727 de uma vez o documento passava de 60.000 px
  // de altura — pesado para o compositor e ruim de navegar. O lote seguinte entra
  // quando a sentinela encosta na viewport (root = viewport, rootMargin 600px).
  var LOTE = 60;
  var filtrados = [], mostrados = 0, sentinela = null, observador = null;
  var primeiroRender = true;

  function pinta() {
    var alvo = $('#bz-resultados');
    var fatia = filtrados.slice(mostrados, mostrados + LOTE);
    if (!fatia.length) return;
    if (E.vista === 'lista') {
      var tb = alvo.querySelector('tbody');
      tb.insertAdjacentHTML('beforeend', linhasHTML(fatia));
    } else {
      alvo.insertAdjacentHTML('beforeend', fatia.map(function (it, i) {
        return cardHTML(it, i);
      }).join(''));
    }
    mostrados += fatia.length;
    $('#bz-visiveis').textContent = mostrados < filtrados.length
      ? mostrados + ' de ' + filtrados.length : filtrados.length;
    posicionaSentinela();
  }

  function posicionaSentinela() {
    if (!sentinela) {
      sentinela = document.createElement('div');
      sentinela.className = 'bz-sentinela';
      sentinela.setAttribute('aria-hidden', 'true');
      observador = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) pinta();
      }, { rootMargin: '600px' });
      observador.observe(sentinela);
    }
    if (mostrados >= filtrados.length) { sentinela.remove(); return; }
    $('#bz-resultados').after(sentinela);
  }

  function render() {
    filtrados = ordenar(ITENS.filter(passa));
    mostrados = 0;
    var alvo = $('#bz-resultados');
    // bz-surge só no primeiro lote da página, nunca a cada filtro
    alvo.className = 'bz-resultados ' + E.vista + (primeiroRender ? ' bz-primeira' : '');
    if (primeiroRender) {
      primeiroRender = false;
      setTimeout(function () { alvo.classList.remove('bz-primeira'); }, 1400);
    }
    alvo.innerHTML = E.vista === 'lista' ? cabecalhoHTML() : '';
    $('#bz-vazio').hidden = filtrados.length > 0;
    $('#bz-visiveis').textContent = filtrados.length;
    pinta();
    ativos();
    salvar();
    BZ.aoRender.forEach(function (fn) {
      try { fn(); } catch (err) { if (window.console) console.error(err); }
    });
  }

  // ------------------------------------------------------------ selos ×N e seleção
  function cardsDe(id) {
    return document.querySelectorAll('#bz-resultados .item-card[data-id="' + CSS.escape(id) + '"]');
  }
  function atualizaSelo(id) {
    var n = tenho(id);
    cardsDe(id).forEach(function (c) {
      var s = c.querySelector('.bz-selo-n');
      if (!n) { if (s) s.remove(); return; }
      if (!s) {
        s = document.createElement('span');
        s.className = 'bz-selo-n';
        var alvo = c.querySelector('.item-head') || c.querySelector('td.c-nome') || c;
        alvo.appendChild(s);
      }
      s.textContent = '×' + n;
      s.title = 'No inventário: ' + n;
    });
  }
  function marcaSelecionado(id) {
    document.querySelectorAll('#bz-resultados .item-card.selecionado').forEach(function (c) {
      c.classList.remove('selecionado');
    });
    BZ.selecionado = id || '';
    if (id) cardsDe(id).forEach(function (c) { c.classList.add('selecionado'); });
  }

  // ------------------------------------------------------------ anúncios
  var vivoT;
  function anunciar(msg) {
    var v = $('#bz-vivo');
    if (!v) return;
    v.textContent = '';
    clearTimeout(vivoT);
    vivoT = setTimeout(function () { v.textContent = msg; }, 40);
  }

  // ------------------------------------------------------------ bancada
  function montarMods() {
    $('#bz-mods').innerHTML = OFICIOS_CD.map(function (o) {
      var m = +E.mods[o] || 0;
      return '<div class="bz-mod"><label for="mod-' + semAcento(o) + '">' + esc(PERICIA[o]) + '</label>' +
        '<input type="number" id="mod-' + semAcento(o) + '" data-of="' + esc(o) + '" value="' + m + '" step="1">' +
        '<span class="bz-mod-regua" data-regua="' + esc(o) + '">CD ≤ ' + (10 + m) + ' · limite ' + (20 + m) + '</span></div>';
    }).join('');
  }
  function atualizaRegua(o) {
    var m = +E.mods[o] || 0;
    var el = document.querySelector('[data-regua="' + CSS.escape(o) + '"]');
    if (el) el.textContent = 'CD ≤ ' + (10 + m) + ' · limite ' + (20 + m);
  }

  // ------------------------------------------------------------ filtros (disclosure)
  function abreFiltros(abrir, rolar) {
    E.filtrosAbertos = !!abrir;
    var caixa = $('#bz-filtros-caixa');
    caixa.hidden = !abrir;
    atualizaFiltrosBtn();
    salvar();
    if (abrir && rolar) caixa.scrollIntoView({ block: 'nearest' });
  }
  function aplicaFerramentas() {
    var b = document.querySelector('.bz-tool-toggle[data-tool="bancada"]');
    b.setAttribute('aria-expanded', String(E.bancada));
    $('#bz-painel-bancada').hidden = !E.bancada;
    var f = document.querySelector('.bz-tool-toggle[data-tool="fecho"]');
    f.setAttribute('aria-pressed', String(!!(E.fecho && kf())));
    if (!kf()) {
      f.disabled = true;
      f.title = 'Recarregue a página (Ctrl+F5) para atualizar a ficha';
    }
  }

  // estado do inventário na mesa: painel | trilho | amplo (o inventário é quem alterna)
  function defineInv(estado) {
    if (['painel', 'trilho', 'amplo'].indexOf(estado) < 0) return;
    E.inv = estado;
    $('#bz-mesa').setAttribute('data-inv', estado);
    salvar();
  }

  // ------------------------------------------------------------ teclado global
  var camadasEsc = [];      // {p, fn}: fn(e) devolve true se consumiu o Esc
  var atalhos = {};         // tecla -> fn(e); devolver false deixa o evento seguir
  function camadaEsc(p, fn) {
    camadasEsc.push({ p: p, fn: fn });
    camadasEsc.sort(function (a, b) { return a.p - b.p; });
  }
  function atalho(tecla, fn) { atalhos[tecla] = fn; }

  // ------------------------------------------------------------ eventos
  function alterna(lista, v) {
    var i = lista.indexOf(v);
    if (i >= 0) lista.splice(i, 1); else lista.push(v);
  }
  function abreItem(id, opts) {
    if (BZ.receita && typeof BZ.receita.abrir === 'function') BZ.receita.abrir(id, opts || {});
  }

  function ligar() {
    var t;
    $('#bz-search').addEventListener('input', function () {
      clearTimeout(t);
      var v = this.value;
      t = setTimeout(function () { E.q = v.trim(); render(); }, 130);
    });

    $('#bz-filtros').addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (b) {
        alterna(E[b.dataset.f], b.dataset.v);
        b.classList.toggle('on');
        b.setAttribute('aria-pressed', b.classList.contains('on'));
        return render();
      }
      if (e.target.id === 'bz-arq-mais') {
        var resto = $('.bz-arq-resto');
        if (!e.target.dataset.txt) e.target.dataset.txt = e.target.textContent;
        resto.hidden = !resto.hidden;
        e.target.textContent = resto.hidden ? e.target.dataset.txt : 'menos';
      }
    });

    $('#bz-ativos').addEventListener('click', function (e) {
      var b = e.target.closest('.bz-ativo');
      if (b) {
        if (b.dataset.f === 'q') { E.q = ''; $('#bz-search').value = ''; }
        else alterna(E[b.dataset.f], b.dataset.v);
        montarFiltros(); return render();
      }
      if (e.target.id === 'bz-limpar') {
        E.q = ''; $('#bz-search').value = '';
        FILTROS.forEach(function (k) { E[k] = []; });
        montarFiltros(); render();
      }
    });

    $('#bz-filtros-btn').addEventListener('click', function () {
      abreFiltros(!E.filtrosAbertos, true);
    });

    $('#bz-order').addEventListener('change', function () { E.ordem = this.value; render(); });
    $('#bz-dir').addEventListener('click', function () {
      E.dir = -E.dir;
      this.classList.toggle('desc', E.dir < 0);
      render();
    });
    document.querySelectorAll('.bz-view').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.bz-view').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        E.vista = b.dataset.view;
        render();
      });
    });

    document.querySelector('.bz-tool-toggle[data-tool="bancada"]').addEventListener('click', function () {
      E.bancada = !E.bancada;
      aplicaFerramentas();
      if (E.bancada && !E.filtrosAbertos) abreFiltros(true, true);
      render();
    });
    document.querySelector('.bz-tool-toggle[data-tool="fecho"]').addEventListener('click', function () {
      if (!kf()) return;
      E.fecho = !E.fecho;
      aplicaFerramentas();
      render();
    });

    $('#bz-mods').addEventListener('input', function (e) {
      if (!e.target.dataset.of) return;
      E.mods[e.target.dataset.of] = parseInt(e.target.value, 10) || 0;
      atualizaRegua(e.target.dataset.of);
      render();
    });

    // abrir a receita — não roubar o clique do botão "+ inventário" da Ficha
    $('#bz-resultados').addEventListener('click', function (e) {
      if (e.target.closest('.kf-addbtn')) return;
      var th = e.target.closest('th[data-col]');
      if (th) {
        if (E.ordem === th.dataset.col) E.dir = -E.dir; else { E.ordem = th.dataset.col; E.dir = 1; }
        $('#bz-order').value = ['nome', 'raridade', 'valor', 'cd'].indexOf(E.ordem) >= 0 ? E.ordem : 'nome';
        return render();
      }
      var c = e.target.closest('.item-card[data-id]');
      if (c) abreItem(c.dataset.id, { via: 'catalogo', teclado: e.detail === 0, clique: e.detail > 0 });
    });
    $('#bz-resultados').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var c = e.target.closest('.item-card[data-id]');
      if (c && e.target === c) { e.preventDefault(); abreItem(c.dataset.id, { via: 'catalogo', teclado: true }); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented) return;
      var alvo = e.target;
      if (e.key === 'Escape') {
        // o drawer da Ficha e a busca com texto cuidam do próprio Esc
        if (alvo && alvo.closest && alvo.closest('#kf-drawer')) return;
        if (alvo && alvo.id === 'bz-search' && alvo.value) return;
        for (var i = 0; i < camadasEsc.length; i++) {
          if (camadasEsc[i].fn(e)) { e.preventDefault(); return; }
        }
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (emCampo(alvo)) return;
      if (e.key === '/') { e.preventDefault(); $('#bz-search').focus(); return; }
      var f = atalhos[e.key];
      if (f && f(e) !== false) e.preventDefault();
    });

    // a barra fixa pode ganhar a 2ª linha (filtros ativos): o thead da Lista gruda logo abaixo dela
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        $('#bz-registro').style.setProperty('--bz-bar-h', $('#bz-bar').offsetHeight + 'px');
      }).observe($('#bz-bar'));
    }
  }

  // ------------------------------------------------------------ mudanças da ficha
  // KF emite kf:mudou a cada gravação; aqui os eventos são juntados num rAF.
  // O catálogo só re-renderiza se o "Fecha" estiver ligado e o conjunto mudar.
  var mudouPend = null;
  function aoKfMudou(e) {
    if (!BZ.pronto) return;
    var d = (e && e.detail) || {};
    if (!mudouPend) {
      mudouPend = { partes: {}, origens: {}, eventos: [] };
      raf(aplicaMudou);
    }
    (d.partes || []).forEach(function (p) { mudouPend.partes[p] = true; });
    if (d.origem) mudouPend.origens[d.origem] = true;
    mudouPend.eventos.push(d);
  }
  function aplicaMudou() {
    var m = mudouPend;
    mudouPend = null;
    if (!m) return;
    var antes = qtdPorId;
    releQtd();
    var mudou = {};
    Object.keys(antes).concat(Object.keys(qtdPorId)).forEach(function (id) {
      if ((antes[id] || 0) !== (qtdPorId[id] || 0)) mudou[id] = true;
    });
    Object.keys(mudou).forEach(atualizaSelo);
    if (recalcFecho() && E.fecho && kf()) render();
    BZ.aoMudar.forEach(function (fn) {
      try { fn(m, mudou); } catch (err) { if (window.console) console.error(err); }
    });
  }

  // ------------------------------------------------------------ início
  function iniciar() {
    carregar();
    $('#bz-search').value = E.q;
    $('#bz-order').value = ['nome', 'raridade', 'valor', 'cd'].indexOf(E.ordem) >= 0 ? E.ordem : 'nome';
    $('#bz-dir').classList.toggle('desc', E.dir < 0);
    document.querySelectorAll('.bz-view').forEach(function (b) {
      b.classList.toggle('active', b.dataset.view === E.vista);
    });
    $('#bz-mesa').setAttribute('data-inv', E.inv);
    $('#bz-filtros-caixa').hidden = !E.filtrosAbertos;
    aplicaFerramentas();
    montarFiltros(); montarMods();
    ligar();
    // o catálogo chega à ficha ANTES do 1º render: ela decora os cards e reconcilia sem 2º fetch
    var k = kf();
    if (k && typeof k.catalogo === 'function') { try { k.catalogo(ITENS); } catch (e) {} }
    releQtd(); recalcFecho();
    document.addEventListener('kf:mudou', aoKfMudou);
    render();
    BZ.pronto = true;
    BZ.aoIniciar.splice(0).forEach(function (fn) {
      try { fn(BZ); } catch (err) { if (window.console) console.error(err); }
    });
  }

  // ------------------------------------------------------------ window.BZ (síncrono)
  var BZ = window.BZ = {
    dados: { ITENS: ITENS, porNome: porNome, porId: porId, usadoEm: usadoEm, filhos: filhos },
    util: {
      esc: esc, semAcento: semAcento, svg: svg, arte: arte, classeRar: classeRar,
      icoCat: icoCat, icoRar: icoRar, ondeAchar: ondeAchar, pesoTexto: pesoTexto,
      cadeia: cadeia, emCampo: emCampo, kf: kf, raf: raf, $: $, PERICIA: PERICIA
    },
    E: E,
    salvar: salvar,
    render: render,
    anunciar: anunciar,
    aoIniciar: [],
    aoMudar: [],          // fn(mudanca, idsComQtdAlterada) depois de juntar os kf:mudou num rAF
    aoRender: [],         // fn() depois de cada render do catálogo (filtro, Bancada, ordem)
    pronto: false,
    selecionado: '',
    // registro de módulos
    quandoIniciar: function (fn) { if (BZ.pronto) fn(BZ); else BZ.aoIniciar.push(fn); },
    camadaEsc: camadaEsc,
    atalho: atalho,
    // catálogo × inventário
    alcance: alcance,
    tenho: tenho,
    fecha: fecha,
    marcaSelecionado: marcaSelecionado,
    abrirItem: abreItem,
    defineInv: defineInv,
    // Mochila antiga (§7): cópia do que estava guardado, até a escolha explícita
    sacoAntigo: function () { return sacoAntigo ? JSON.parse(JSON.stringify(sacoAntigo)) : null; },
    descartaSaco: function () { sacoAntigo = null; E.sacoMigrado = true; salvar(); },
    receita: null,        // js/bazar-receita.js
    cartao: null,         // js/bazar-cartao.js
    inventario: null      // js/bazar-inventario.js
  };

  fetch('../data/bazar.json')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (d) {
      if (!Array.isArray(d)) throw new Error('bazar.json não é array');
      Array.prototype.push.apply(ITENS, d);
      indexar();
      iniciar();
    })
    .catch(function (err) {
      if (window.console) console.error(err);
      $('#bz-resultados').innerHTML =
        '<p class="bz-vazio">Não foi possível carregar o catálogo (data/bazar.json).</p>';
    });
})();
