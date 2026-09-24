/* ============================================================
   O BAZAR — registro de itens de Kharavel
   Dados: data/bazar.json (gerado por tools/gerar_bazar.py a partir do CSV).
   Vocabulário e total: window.BZ_VOCAB, injetado no HTML pelo gerador.

   Contrato com a Ficha Interativa (js/ficha.js), NÃO quebrar:
     - cada item é .item-card com data-n="<Nome exato>"
     - contém .item-name (onde o botão "+ ficha" é pendurado)
     - data/bazar.json continua sendo um ARRAY com id/nome/categoria/
       raridade/efeito/valor (a ficha faz bazarCache.find por nome)
   O MutationObserver da ficha redecora sozinho a cada re-render.
   ============================================================ */
(function () {
  'use strict';

  var V = window.BZ_VOCAB || {};
  var LS = 'khalkaria_bazar_estado';
  var ITENS = [];
  var porNome = {};      // nome -> item
  var usadoEm = {};      // material -> [nomes de receita]
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

  // estado persistido
  var E = {
    q: '', vista: 'cards', ordem: 'nome', dir: 1,
    cat: [], rar: [], reg: [], of: [], arq: [],
    bancada: false, mochila: false,
    mods: { 'Ferraria': 0, 'Engenharia': 0, 'Alquimia': 0, 'Sobrevivência': 0 },
    saco: {}   // material -> quantidade
  };

  // ------------------------------------------------------------ utilidades
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function semAcento(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function classeRar(r) { return 'rar-' + semAcento(r || '').toLowerCase(); }
  function svg(id, cls) {
    return '<svg class="' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }
  function icoRar(r) { return svg('rar-' + semAcento(r || '').toLowerCase()); }
  function icoCat(it) { return ICO[it.cats && it.cats[0]] || 'ico-material'; }
  // Materiais têm arte própria (images/materiais/*.webp). Quem não tem cai no
  // ícone gravado. O medalhão usa o mesmo fundo em que a arte foi composta,
  // então as imagens sem recorte perfeito não mostram a emenda.
  function arte(it, cls) {
    if (!it) return '';
    if (it.arte) return '<img class="bz-arte ' + (cls || '') + '" src="../images/' + it.arte +
      '" alt="" loading="lazy" decoding="async">';
    return svg(icoCat(it), cls);
  }
  function artePorNome(nome, cls) { return arte(porNome[nome], cls); }

  function salvar() { try { localStorage.setItem(LS, JSON.stringify(E)); } catch (e) {} }
  function carregar() {
    try {
      var g = JSON.parse(localStorage.getItem(LS) || '{}');
      Object.keys(g).forEach(function (k) { if (k in E) E[k] = g[k]; });
      OFICIOS_CD.forEach(function (o) { if (typeof E.mods[o] !== 'number') E.mods[o] = 0; });
    } catch (e) {}
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
      it._rar = ORD_RAR.indexOf(it.raridade);
      it._valor = pesoValor(it.valor);
    });
    ITENS.forEach(function (it) {
      (it.ing || []).forEach(function (g) {
        (usadoEm[g.item] = usadoEm[g.item] || []).push(it.nome);
      });
      if (it.pai) (filhos[it.pai] = filhos[it.pai] || []).push(it.nome);
    });
  }
  function cadeia(it) {                    // da raiz até o item
    var c = [it], guarda = 0;
    while (c[0].pai && porNome[c[0].pai] && guarda++ < 12) c.unshift(porNome[c[0].pai]);
    return c;
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
  function mochilaFecha(it) {
    if (!it.ing || !it.ing.length) return false;
    return it.ing.every(function (g) { return (+E.saco[g.item] || 0) >= g.n; });
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
    if (E.mochila && !mochilaFecha(it)) return false;
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

  function grupo(nome, html, id) {
    return '<div class="bz-grupo"' + (id ? ' id="' + id + '"' : '') +
      '><span class="bz-grupo-nome">' + nome + '</span>' + html + '</div>';
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
  function cardHTML(it, i) {
    var al = alcance(it);
    var reg = it.regiao || (it.unico ? 'Único/Quest' : '');
    return '<article class="item-card ' + classeRar(it.raridade) +
      (al === 'dificil' ? ' dificil' : '') + (al === 'ok' ? ' alcancavel' : '') +
      '" data-n="' + esc(it.nome) + '" style="--i:' + i + '" tabindex="0">' +
      '<div class="item-head">' + arte(it, 'item-ico') +
        '<span class="item-name">' + esc(it.nome) + '</span></div>' +
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
        ? '<p class="item-aviso">⚠ CD ' + it.cd + ' — acima da sua régua confortável (' +
          (10 + (+E.mods[it.craft] || 0)) + '), ainda alcançável.</p>' : '') +
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
      return '<th data-col="' + c[0] + '"' + sort + '>' + c[1] + '</th>';
    }).join('') + '</tr></thead><tbody></tbody></table>';
  }
  function linhasHTML(lista) {
    return lista.map(function (it) {
      var reg = it.regiao || (it.unico ? 'Único/Quest' : '—');
      return '<tr class="item-card ' + classeRar(it.raridade) + '" data-n="' + esc(it.nome) + '">' +
        '<td class="c-nome">' + arte(it, 'c-ico') + '<span class="item-name">' + esc(it.nome) + '</span></td>' +
        '<td class="c-rar"><span class="tag-rar">' + icoRar(it.raridade) + esc(it.raridade) + '</span></td>' +
        '<td>' + esc(it.categoria) + '</td>' +
        '<td class="c-efeito"><span>' + esc(it.efeito) + '</span></td>' +
        '<td class="c-valor">' + esc(it.valor) + '</td>' +
        '<td>' + esc(it.obtencao) + '</td>' +
        '<td>' + esc(reg) + '</td>' +
        '<td>' + esc(it.craft) + '</td>' +
        '<td class="c-cd">' + (it.cd == null ? '—' : it.cd) + '</td></tr>';
    }).join('');
  }

  function ativos() {
    var box = $('#bz-ativos'), h = '';
    ['cat', 'rar', 'reg', 'of', 'arq'].forEach(function (k) {
      E[k].forEach(function (v) {
        h += '<button type="button" class="bz-ativo" data-f="' + k + '" data-v="' + esc(v) + '">' + esc(v) + '</button>';
      });
    });
    if (E.q) h += '<button type="button" class="bz-ativo" data-f="q" data-v="">“' + esc(E.q) + '”</button>';
    if (!h) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<span class="bz-ativos-nome">Filtros</span>' + h +
      '<button type="button" class="bz-limpar-tudo" id="bz-limpar">limpar tudo</button>';
  }

  // Renderiza em lotes. Com os 727 de uma vez o documento passava de 60.000 px
  // de altura — pesado para o compositor e ruim de navegar. O lote seguinte entra
  // quando a sentinela encosta na viewport.
  var LOTE = 60;
  var filtrados = [], mostrados = 0, sentinela = null, observador = null;

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
    alvo.className = 'bz-resultados ' + E.vista;
    alvo.innerHTML = E.vista === 'lista' ? cabecalhoHTML() : '';
    $('#bz-vazio').hidden = filtrados.length > 0;
    $('#bz-visiveis').textContent = filtrados.length;
    pinta();
    ativos();
    salvar();
  }

  // ------------------------------------------------------------ detalhe
  function ondeAchar(nome) {
    var m = porNome[nome];
    if (!m) return '';
    var r = m.regiao || (m.unico ? 'Único/Quest' : '');
    return [r, m.cr ? 'CR ' + m.cr : ''].filter(Boolean).join(' · ');
  }

  function ingHTML(it) {
    if (!it.ing || !it.ing.length) return '<p class="bz-ing-onde">Sem receita registrada.</p>';
    return '<div class="bz-usos">' + it.ing.map(function (g) {
      var mat = porNome[g.item];
      var tem = (+E.saco[g.item] || 0) >= g.n;
      var estado = E.mochila || Object.keys(E.saco).length ? (tem ? ' tem' : ' falta') : '';
      return '<button type="button" class="bz-ing' + estado + '" data-ir="' + esc(g.item) + '">' +
        arte(mat, 'bz-ing-ico') +
        '<b>' + g.n + '×</b> ' + esc(g.item) +
        (ondeAchar(g.item) ? '<span class="bz-ing-onde">' + esc(ondeAchar(g.item)) + '</span>' : '') +
        '</button>';
    }).join('') + '</div>';
  }

  function cadeiaHTML(it) {
    var c = cadeia(it);
    var frente = (filhos[it.nome] || []).map(function (n) { return porNome[n]; }).filter(Boolean);
    var todos = c.concat(frente.filter(function (f) { return c.indexOf(f) < 0; }));
    if (todos.length < 2) return '';
    return '<h3 class="bz-d-sec">Cadeia de fabricação</h3><div class="bz-cadeia">' +
      todos.map(function (p, i) {
        return '<div class="bz-passo' + (p.nome === it.nome ? ' atual' : '') + '" style="--i:' + i + '">' +
          '<div class="bz-passo-trilho"><span class="bz-passo-no"></span></div><div>' +
          '<button type="button" class="bz-passo-nome bz-uso" data-ir="' + esc(p.nome) + '">' + esc(p.nome) + '</button> ' +
          '<span class="tag-rar ' + classeRar(p.raridade) + '">' + esc(p.raridade) + '</span>' +
          '<div class="bz-passo-linha">' +
            (p.cd != null ? '<span class="bz-passo-cd">' + esc(p.craft) + ' CD ' + p.cd + '</span>' : '') +
            (p.ing || []).map(function (g) {
              return '<button type="button" class="bz-ing" data-ir="' + esc(g.item) + '">' +
                artePorNome(g.item, 'bz-ing-ico') + '<b>' + g.n + '×</b> ' + esc(g.item) + '</button>';
            }).join('') +
          '</div></div></div>';
      }).join('') + '</div>';
  }

  function usosHTML(it) {
    var us = usadoEm[it.nome] || [];
    if (!us.length) return '';
    // sem corte: são 62 no pior caso (Liga Rúnica) e o jogador quer a lista inteira
    var mostra = us.slice().sort(function (a, b) { return a.localeCompare(b, 'pt'); });
    return '<h3 class="bz-d-sec">Entra em ' + us.length + ' receita' + (us.length > 1 ? 's' : '') + '</h3>' +
      '<div class="bz-usos">' + mostra.map(function (n) {
        return '<button type="button" class="bz-uso" data-ir="' + esc(n) + '">' + esc(n) + '</button>';
      }).join('') +
      (us.length > mostra.length ? '<span class="bz-usos-mais bz-ing-onde">+' + (us.length - mostra.length) + ' outras</span>' : '') +
      '</div>';
  }

  function abrir(nome) {
    var it = porNome[nome];
    if (!it) return;
    var reg = it.regiao || (it.unico ? 'Único/Quest' : '—');
    var h = '<div class="bz-d-head">' + arte(it, 'bz-d-ico') + '<div>' +
      '<h2 class="bz-d-nome" id="bz-detalhe-nome">' + esc(it.nome) + '</h2>' +
      '<div class="item-chips">' +
        '<span class="tag-rar">' + icoRar(it.raridade) + esc(it.raridade) + '</span>' +
        '<span class="tag-cat">' + esc(it.categoria) + '</span>' +
        (it.arquetipo ? '<span class="tag-arq">' + esc(it.arquetipo) + '</span>' : '') +
        (it.tags || []).map(function (t) { return '<span class="tag-cat">' + esc(t) + '</span>'; }).join('') +
      '</div></div></div>' +
      '<p class="bz-d-efeito">' + esc(it.efeito) + '</p>' +
      (it.lore ? '<p class="bz-d-lore">' + esc(it.lore) + '</p>' : '') +
      '<dl class="bz-d-grade">' +
        '<div class="bz-d-campo"><dt>Valor</dt><dd class="mono">' + esc(it.valor) + ' Sins</dd></div>' +
        '<div class="bz-d-campo"><dt>Região</dt><dd>' + esc(reg) + '</dd></div>' +
        '<div class="bz-d-campo"><dt>Obtenção</dt><dd>' + esc(it.obtencao || '—') + '</dd></div>' +
        '<div class="bz-d-campo"><dt>Ofício</dt><dd>' + esc(it.craft || '—') + '</dd></div>' +
        (it.cd != null ? '<div class="bz-d-campo"><dt>CD de craft</dt><dd class="mono">' + it.cd + '</dd></div>' : '') +
      '</dl>' +
      (it.ing && it.ing.length ? '<h3 class="bz-d-sec">Receita</h3>' + ingHTML(it) : '') +
      cadeiaHTML(it) + usosHTML(it);
    var corpo = $('.bz-detalhe-corpo');
    corpo.className = 'bz-detalhe-corpo ' + classeRar(it.raridade);
    $('#bz-detalhe-conteudo').innerHTML = h;
    $('#bz-detalhe').hidden = false;
    corpo.scrollTop = 0;
    $('.bz-detalhe-x').focus();
  }
  function fechar() { $('#bz-detalhe').hidden = true; }

  // ------------------------------------------------------------ bancada / mochila
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
  function montarSaco() {
    $('#bz-mochila-itens').innerHTML = Object.keys(E.saco).sort(function (a, b) {
      return a.localeCompare(b, 'pt');
    }).map(function (m) {
      return '<span class="bz-mat">' + artePorNome(m, 'bz-mat-ico') +
        '<b>' + E.saco[m] + '×</b> ' + esc(m) +
        '<button type="button" data-tirar="' + esc(m) + '" aria-label="Remover ' + esc(m) + '">×</button></span>';
    }).join('');
  }
  function montarDatalist() {
    var mats = Object.keys(usadoEm).sort(function (a, b) { return a.localeCompare(b, 'pt'); });
    $('#bz-mat-lista').innerHTML = mats.map(function (m) {
      return '<option value="' + esc(m) + '">' + (usadoEm[m].length) + ' receitas</option>';
    }).join('');
  }
  function guardar() {
    var nome = $('#bz-mat-busca').value.trim();
    var qtd = Math.max(1, parseInt($('#bz-mat-qtd').value, 10) || 1);
    if (!nome) return;
    var certo = Object.keys(usadoEm).find(function (m) {
      return semAcento(m).toLowerCase() === semAcento(nome).toLowerCase();
    }) || nome;
    E.saco[certo] = (E.saco[certo] || 0) + qtd;
    $('#bz-mat-busca').value = '';
    $('#bz-mat-qtd').value = 1;
    montarSaco(); render();
    $('#bz-mat-busca').focus();
  }

  // ------------------------------------------------------------ eventos
  function alterna(lista, v) {
    var i = lista.indexOf(v);
    if (i >= 0) lista.splice(i, 1); else lista.push(v);
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
        resto.hidden = !resto.hidden;
        e.target.textContent = resto.hidden ? e.target.dataset.txt : 'menos';
        if (!e.target.dataset.txt) e.target.dataset.txt = '+' + resto.children.length + ' arquétipos';
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
        ['cat', 'rar', 'reg', 'of', 'arq'].forEach(function (k) { E[k] = []; });
        montarFiltros(); render();
      }
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

    document.querySelectorAll('.bz-tool-toggle').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.tool;
        E[k] = !E[k];
        b.setAttribute('aria-expanded', E[k]);
        $('#bz-painel-' + k).hidden = !E[k];
        render();
      });
    });

    $('#bz-mods').addEventListener('input', function (e) {
      if (!e.target.dataset.of) return;
      E.mods[e.target.dataset.of] = parseInt(e.target.value, 10) || 0;
      atualizaRegua(e.target.dataset.of);
      render();
    });

    $('#bz-mat-add').addEventListener('click', guardar);
    $('#bz-mat-busca').addEventListener('keydown', function (e) { if (e.key === 'Enter') guardar(); });
    $('#bz-mat-limpar').addEventListener('click', function () { E.saco = {}; montarSaco(); render(); });
    $('#bz-mochila-itens').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tirar]');
      if (!b) return;
      delete E.saco[b.dataset.tirar];
      montarSaco(); render();
    });

    // abrir detalhe — não roubar o clique do botão "+ ficha" da Ficha Interativa
    $('#bz-resultados').addEventListener('click', function (e) {
      if (e.target.closest('.kf-addbtn')) return;
      var th = e.target.closest('th[data-col]');
      if (th) {
        if (E.ordem === th.dataset.col) E.dir = -E.dir; else { E.ordem = th.dataset.col; E.dir = 1; }
        $('#bz-order').value = ['nome', 'raridade', 'valor', 'cd'].indexOf(E.ordem) >= 0 ? E.ordem : 'nome';
        return render();
      }
      var c = e.target.closest('.item-card');
      if (c) abrir(c.dataset.n);
    });
    $('#bz-resultados').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      var c = e.target.closest('.item-card');
      if (c) { e.preventDefault(); abrir(c.dataset.n); }
    });

    $('#bz-detalhe').addEventListener('click', function (e) {
      if (e.target.closest('[data-fechar]')) return fechar();
      var b = e.target.closest('[data-ir]');
      if (b) abrir(b.dataset.ir);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('#bz-detalhe').hidden) return fechar();
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'SELECT') {
        e.preventDefault(); $('#bz-search').focus();
      }
    });
  }

  // ------------------------------------------------------------ início
  function iniciar() {
    carregar();
    $('#bz-search').value = E.q;
    $('#bz-order').value = E.ordem;
    $('#bz-dir').classList.toggle('desc', E.dir < 0);
    document.querySelectorAll('.bz-view').forEach(function (b) {
      b.classList.toggle('active', b.dataset.view === E.vista);
    });
    ['bancada', 'mochila'].forEach(function (k) {
      var b = document.querySelector('.bz-tool-toggle[data-tool="' + k + '"]');
      b.setAttribute('aria-expanded', E[k]);
      $('#bz-painel-' + k).hidden = !E[k];
    });
    montarFiltros(); montarMods(); montarSaco(); montarDatalist();
    ligar(); render();
  }

  fetch('../data/bazar.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { ITENS = d; indexar(); iniciar(); })
    .catch(function () {
      $('#bz-resultados').innerHTML =
        '<p class="bz-vazio">Não foi possível carregar o catálogo (data/bazar.json).</p>';
    });
})();
