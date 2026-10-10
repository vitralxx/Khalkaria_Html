/* Khalkaria — prova da correção 3 do drawer da ficha nova
 * (docs/ficha-digital/07-f4-6-ensaio.md §0, item 3).
 *
 * O QUE PROVA
 *   Com a navegação aberta e o drawer da ficha nova aberto, nas 24 páginas do
 *   roteiro do [estilo] (tools/estilo/roteiro.json), a 1366 e a 1440 px de
 *   largura:
 *   1. nenhum elemento do .main-content passa da borda direita dele: o que é
 *      largo rola na horizontal dentro da própria caixa. Um elemento recortado
 *      por um ancestral que rola (overflow-x diferente de visible) e que fica
 *      dentro da borda não conta: é o caso certo;
 *   2. quem rola é a PRÓPRIA tabela (marcada [data-fd-larga] pelo drawer), com
 *      a barra no pé dela, ou um wrapper que só tem a tabela (os do Sistema);
 *      nunca um cartão com título e parágrafos. Toda tabela marcada rola de
 *      fato, e as que cabem continuam display: table (largura cheia);
 *   3. nenhum <li> com marcador por fora perde o bullet (overflow dele visible);
 *   4. a altura do .main-content é a mesma com o drawer aberto e recolhido, a
 *      menos da largura: o .main-content fica com a mesma largura (presa), o
 *      drawer recolhe (as marcas saem) e a diferença tem de ser só a das barras
 *      horizontais (nenhuma margem deixa de colapsar);
 *   5. nenhuma caixa que rola esconde conteúdo na vertical.
 *
 * COMO RODAR (site servido localmente: python -m http.server 8899 --bind
 * 127.0.0.1, ou a configuração 'site-local' do .claude/launch.json)
 *   1. abra qualquer página do site (p.ex. http://127.0.0.1:8899/index.html);
 *   2. no console do navegador (F12), cole este arquivo inteiro, OU carregue-o:
 *        var s = document.createElement('script');
 *        s.src = '/tools/testes/navegador/transborda-drawer.js?' + Date.now();
 *        document.head.appendChild(s);
 *   3. espere window.__provaTransborda.fim === true (o progresso sai no console).
 *      O resumo fica em window.__provaTransborda.resumo (e num console.table);
 *      os detalhes de cada medição, em window.__provaTransborda.itens[i]
 *      (topo: os que passam; tabelas: quem rola cada tabela larga; bullets;
 *      altura).
 *   Opcional, ANTES de carregar: window.__provaTransbordaOpcoes = {
 *     larguras: [1366, 1440], altura: 900, so: 'sistema' }  (so filtra páginas)
 *
 * Cada página abre num <iframe> do tamanho pedido (o viewport é o do iframe,
 * não o da janela: o painel pode estar de qualquer tamanho, até oculto).
 * Durante a prova o script põe no localStorage a prévia ligada
 * (khalkaria_ficha_previa=1), o drawer aberto (khalkaria_ficha3_dock=aberto), a
 * nav aberta (khalkaria_nav) e o splash visto (khalkaria_splash_seen); no fim
 * devolve essas 4 chaves exatamente como estavam. Não lê nem grava chave de
 * ficha. Não depende de requestAnimationFrame (o painel oculto o segura).
 */
(function () {
  'use strict';
  var OP = window.__provaTransbordaOpcoes || {};
  var LARGURAS = OP.larguras || [1366, 1440];
  var ALTURA = OP.altura || 900;
  var SO = OP.so || '';
  // a lista do roteiro do [estilo] (o script tenta ler o roteiro.json; esta é a reserva)
  var PAGINAS_RESERVA = ['index.html', 'pages/bazar.html', 'pages/classes.html', 'pages/condicoes.html',
    'pages/criacao.html', 'pages/limiar.html', 'pages/magias.html', 'pages/origens.html', 'pages/racas.html',
    'pages/sistema.html', 'pages/classes/alquimista.html', 'pages/classes/artilheiro.html',
    'pages/classes/batedor.html', 'pages/classes/brutalista.html', 'pages/classes/espadachim.html',
    'pages/classes/monge.html', 'pages/classes/teurgo.html', 'pages/racas/anao.html',
    'pages/racas/automato.html', 'pages/racas/corrompido.html', 'pages/racas/dryad.html',
    'pages/racas/gruto.html', 'pages/racas/humano.html', 'pages/racas/inseto.html'];
  var CHAVES = {
    khalkaria_ficha_previa: '1',
    khalkaria_ficha3_dock: 'aberto',
    khalkaria_nav: '{"v":1,"trilho":false,"fechados":[]}',
    khalkaria_splash_seen: '1'
  };
  var TOL = 0.5;   // px: arredondamento de subpixel
  var MARCA = 'data-fd-larga';   // a da tabela larga (KhFichaDrawer.MARCA_LARGA)
  function r1(x) { return Math.round(x * 10) / 10; }

  var P = window.__provaTransborda = { fim: false, feito: 0, total: 0, itens: [], erros: [], resumo: null };

  function raizSite() {
    var s = document.querySelector('script[src*="js/ficha.js"]') || document.querySelector('script[src*="js/main.js"]');
    try { if (s) return new URL('../', s.src).href; } catch (e) { /* segue */ }
    return location.origin + '/';
  }
  var RAIZ = raizSite();
  function dorme(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function espera(cond, teto) {
    var t0 = Date.now();
    return new Promise(function (res) {
      (function passo() {
        var ok = false;
        try { ok = !!cond(); } catch (e) { ok = false; }
        if (ok) return res(true);
        if (Date.now() - t0 >= teto) return res(false);
        setTimeout(passo, 60);
      })();
    });
  }
  // até `quieto` ms sem mutação no DOM (teto `teto` ms)
  function quietude(w, quieto, teto) {
    return new Promise(function (res) {
      var t0 = Date.now(), ultimo = Date.now();
      var obs = new w.MutationObserver(function () { ultimo = Date.now(); });
      obs.observe(w.document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
      (function passo() {
        var agora = Date.now();
        if (agora - ultimo >= quieto || agora - t0 >= teto) { obs.disconnect(); res(); }
        else setTimeout(passo, 60);
      })();
    });
  }
  function imagens(w, teto) {
    var imgs = Array.prototype.slice.call(w.document.images);
    imgs.forEach(function (im) { if (im.loading === 'lazy') im.loading = 'eager'; });
    return espera(function () { return imgs.every(function (im) { return im.complete; }); }, teto);
  }
  function assenta(doc) {
    if (!doc.getAnimations) return;
    doc.getAnimations().forEach(function (a) {
      try {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
        if (t.iterations === Infinity || t.endTime === Infinity) { a.pause(); a.currentTime = 0; } else a.finish();
      } catch (e) { /* segue */ }
    });
  }
  // o caminho curto de um elemento (para o relatório)
  function caminho(el, ate) {
    var p = [];
    for (var x = el; x && x !== ate && p.length < 4; x = x.parentElement) {
      var s = x.tagName.toLowerCase();
      if (x.id) s += '#' + x.id;
      else if (x.classList.length) s += '.' + Array.prototype.slice.call(x.classList, 0, 2).join('.');
      p.unshift(s);
    }
    return p.join(' > ');
  }

  // a medida numa página carregada
  function mede(w) {
    var doc = w.document;
    var mc = doc.querySelector('.main-content');
    if (!mc) return { erro: 'sem .main-content' };
    var gav = doc.getElementById('fd-gaveta');
    var borda = mc.getBoundingClientRect().right;
    var esq = gav && !gav.hidden ? gav.getBoundingClientRect().left : null;
    var passam = [], rolam = 0, rolamSemBarra = 0, verticais = [];
    var cs = function (x) { return w.getComputedStyle(x); };
    // o limite à direita de quem recorta x (um ancestral até o .main-content que rola na horizontal)
    function recorte(x) {
      var lim = Infinity;
      for (var a = x.parentElement; a && a !== doc.body; a = a.parentElement) {
        var s = cs(a);
        if (s.position === 'fixed') return -Infinity;    // fora do fluxo do conteúdo
        if (s.overflowX !== 'visible') {
          var r = a.getBoundingClientRect();
          lim = Math.min(lim, r.left + a.clientLeft + a.clientWidth);
        }
        if (a === mc) break;
      }
      return lim;
    }
    var todos = mc.querySelectorAll('*');
    for (var i = 0; i < todos.length; i++) {
      var el = todos[i];
      if (!el.getClientRects().length) continue;
      var s = cs(el);
      if (s.position === 'fixed' || s.visibility === 'hidden') continue;
      var r = el.getBoundingClientRect();
      if (r.width <= 1 && r.height <= 1) continue;     // leitor de tela (clip) e vazios
      if (s.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1) {
        rolam++;
        if (s.scrollbarWidth === 'none') rolamSemBarra++;
      }
      // efeito colateral da caixa que rola: a vertical recortada (conteúdo escondido) ou com barra
      var temTabela = el.hasAttribute(MARCA) || (el.tagName !== 'TABLE' && el.querySelector(':scope > table'));
      if (s.overflowY !== 'visible' && temTabela && el.scrollHeight > el.clientHeight + 1) {
        verticais.push(caminho(el, mc) + ' (' + el.scrollHeight + ' > ' + el.clientHeight + ', ' + s.overflowY + ')');
      }
      if (r.right <= borda + TOL) continue;
      var lim = recorte(el);
      if (lim === -Infinity) continue;
      var dir = Math.min(r.right, lim);
      if (dir <= borda + TOL) continue;
      passam.push({ el: el, caminho: caminho(el, mc), excesso: Math.round((dir - borda) * 10) / 10 });
    }
    // só os de fora (o filho de quem já passa não conta de novo no relatório)
    var topo = passam.filter(function (p) {
      return !passam.some(function (q) { return q !== p && q.el.contains(p.el); });
    });
    // 2. quem rola cada tabela larga: ela mesma (a barra no pé dela) ou um wrapper só dela
    var tabelas = { marcadas: 0, marcadaSemRolar: [], cabeMudou: [], rolaOCartao: [], barraLonge: [], rolam: [] };
    Array.prototype.forEach.call(mc.querySelectorAll('table'), function (t) {
      if (!t.getClientRects().length) return;
      var st = cs(t), marcada = t.hasAttribute(MARCA);
      if (marcada) {
        tabelas.marcadas++;
        if (!(t.scrollWidth > t.clientWidth + 1)) tabelas.marcadaSemRolar.push(caminho(t, mc));
      } else if (st.display !== 'table') tabelas.cabeMudou.push(caminho(t, mc) + ' (' + st.display + ')');
      var rola = null;
      for (var a = t; a && a !== mc; a = a.parentElement) {
        var sa = cs(a);
        if ((sa.overflowX === 'auto' || sa.overflowX === 'scroll') && a.scrollWidth > a.clientWidth + 1) { rola = a; break; }
      }
      if (!rola) return;
      if (rola !== t && !(rola.children.length === 1 && rola.children[0] === t)) {
        tabelas.rolaOCartao.push(caminho(t, mc) + ' rola com ' + caminho(rola, mc) + ' (' + rola.children.length + ' filhos)');
        return;
      }
      // a barra: o topo dela (o pé da caixa que rola, menos a borda e a barra) contra o pé da última linha da tabela
      var sr = cs(rola), bb = parseFloat(sr.borderBottomWidth) || 0;
      var barra = rola.offsetHeight - rola.clientHeight - (parseFloat(sr.borderTopWidth) || 0) - bb;
      var topoBarra = rola.getBoundingClientRect().bottom - bb - barra;
      var ultima = t.rows && t.rows.length ? t.rows[t.rows.length - 1] : t;
      var vao = topoBarra - ultima.getBoundingClientRect().bottom;
      // na própria tabela, colada; no wrapper, só a margem de baixo da tabela entre as duas
      var permitido = (rola === t ? 0 : parseFloat(st.marginBottom) || 0) + 1;
      var item = caminho(t, mc) + ': ' + (rola === t ? 'a tabela' : 'wrapper') + ', barra ' + r1(barra) + ' px, vão ' + r1(vao) + ' px';
      tabelas.rolam.push(item);
      if (vao > permitido) tabelas.barraLonge.push(item);
    });
    // 3. o bullet de um <li> (marcador por fora) some se o li recorta (overflow diferente de visible)
    var bullets = { liComTabela: 0, recortados: [] };
    Array.prototype.forEach.call(mc.querySelectorAll('li'), function (li) {
      if (!li.getClientRects().length) return;
      var sl = cs(li);
      if (sl.display !== 'list-item' || sl.listStyleType === 'none' || sl.listStylePosition !== 'outside') return;
      if (li.querySelector('table')) bullets.liComTabela++;
      if (sl.overflowX !== 'visible' || sl.overflowY !== 'visible') bullets.recortados.push(caminho(li, mc) + ' (' + sl.overflowX + ')');
    });
    var de = doc.documentElement;
    return {
      tabelas: tabelas, bullets: bullets,
      ficha3: de.getAttribute('data-ficha3'), nav: de.getAttribute('data-nav') || 'aberta',
      borda: Math.round(borda), drawer: esq == null ? null : Math.round(esq),
      passam: passam.length, topo: topo.map(function (p) { return p.caminho + ' (+' + p.excesso + ' px)'; }),
      maxExcesso: passam.reduce(function (m, p) { return Math.max(m, p.excesso); }, 0),
      rolam: rolam, rolamSemBarra: rolamSemBarra, verticais: verticais,
      // o Bazar não é empurrado até a F4b: o drawer aberto fica por cima do conteúdo (de propósito)
      drawerPorCima: esq != null && borda > esq + TOL,
      rolagemDaPagina: de.scrollWidth > de.clientWidth + 1
    };
  }

  // 4. a altura do .main-content, aberto x recolhido, na MESMA largura (presa):
  // a diferença tem de ser só a das barras horizontais (as das tabelas marcadas,
  // aberto; as dos wrappers do Sistema, recolhido)
  function barrasH(w, mc) {
    var soma = 0;
    Array.prototype.forEach.call(mc.querySelectorAll('*'), function (x) {
      var c = w.getComputedStyle(x);
      if (c.overflowX !== 'auto' && c.overflowX !== 'scroll') return;
      soma += x.offsetHeight - x.clientHeight - (parseFloat(c.borderTopWidth) || 0) - (parseFloat(c.borderBottomWidth) || 0);
    });
    return soma;
  }
  function altura(w) {
    var doc = w.document, mc = doc.querySelector('.main-content');
    var api = w.KhFichaDrawer && w.KhFichaDrawer.atual ? w.KhFichaDrawer.atual() : null;
    if (!mc || !api) return { erro: 'sem .main-content ou sem drawer' };
    var barras = barrasH(w, mc);
    var a = mc.getBoundingClientRect();
    var estilo = mc.getAttribute('style');
    mc.style.flex = '0 0 ' + a.width + 'px';
    mc.style.width = a.width + 'px';
    mc.style.maxWidth = 'none';
    api.recolher({ gravar: false });
    var r = mc.getBoundingClientRect(), barrasR = barrasH(w, mc);
    var res = { aberto: r1(a.height), recolhido: r1(r.height), barras: r1(barras), barrasRecolhido: r1(barrasR),
      larguraAberto: r1(a.width), larguraRecolhido: r1(r.width),
      marcasRecolhido: mc.querySelectorAll('[' + MARCA + ']').length,
      diferenca: r1((a.height - barras) - (r.height - barrasR)) };
    api.abrir({ gravar: false });
    if (estilo == null) mc.removeAttribute('style'); else mc.setAttribute('style', estilo);
    res.ok = Math.abs(res.diferenca) <= 1 && Math.abs(a.width - r.width) <= TOL && !res.marcasRecolhido;
    return res;
  }

  function uma(pagina, largura) {
    var f = document.createElement('iframe');
    f.width = largura; f.height = ALTURA;
    f.setAttribute('style', 'position:fixed;left:0;top:0;border:0;z-index:2147483646;background:#fff;' +
      'width:' + largura + 'px;height:' + ALTURA + 'px');
    var carregou = new Promise(function (r) { f.onload = r; });
    // ?prova=: a página nunca vem do cache (o HTML não leva ?v=; depois de um build, viria a versão velha)
    f.src = RAIZ + pagina + '?prova=' + Date.now();
    document.body.appendChild(f);
    var w, montou = false;
    return carregou.then(function () {
      w = f.contentWindow;
      return espera(function () {
        var g = w.document.getElementById('fd-gaveta');
        return g && !g.hidden;
      }, 15000);
    }).then(function (ok) {
      montou = ok;
      // o Bazar desenha a grade depois (com o painel oculto o rAF não roda e ela
      // pode não vir: o Bazar não é empurrado, o drawer fica por cima, até a F4b)
      if (!/bazar\.html$/.test(pagina)) return true;
      return espera(function () { return w.document.querySelector('#bz-resultados > *'); }, 5000);
    }).then(function (pronto) {
      return (w.document.fonts ? w.document.fonts.ready : Promise.resolve()).then(function () {
        return imagens(w, 5000);
      }).then(function () {
        return dorme(/bazar\.html$/.test(pagina) ? 1500 : 300);
      }).then(function () {
        return quietude(w, 500, 6000);
      }).then(function () {
        assenta(w.document);
        var m = mede(w);
        m.altura = altura(w);
        m.drawerMontado = montou;
        if (!pronto) m.aviso = 'a grade do Bazar não desenhou (painel oculto?)';
        return m;
      });
    }).then(function (m) { f.remove(); return m; }, function (e) { f.remove(); throw e; });
  }

  function paginas() {
    return fetch(RAIZ + 'tools/estilo/roteiro.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (R) { return R && Array.isArray(R.paginas) && R.paginas.length ? R.paginas : PAGINAS_RESERVA; },
        function () { return PAGINAS_RESERVA; });
  }

  var antes = {};
  Object.keys(CHAVES).forEach(function (k) {
    try { antes[k] = localStorage.getItem(k); } catch (e) { antes[k] = null; }
  });
  function devolve() {
    Object.keys(antes).forEach(function (k) {
      try { if (antes[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, antes[k]); } catch (e) { /* segue */ }
    });
  }

  var t0 = Date.now();
  P.promessa = paginas().then(function (lista) {
    lista = lista.filter(function (p) { return !SO || p.indexOf(SO) >= 0; });
    var tarefas = [];
    LARGURAS.forEach(function (lg) { lista.forEach(function (pg) { tarefas.push([pg, lg]); }); });
    P.total = tarefas.length;
    Object.keys(CHAVES).forEach(function (k) { localStorage.setItem(k, CHAVES[k]); });
    console.log('[transborda] ' + tarefas.length + ' medições (' + lista.length + ' páginas x ' + LARGURAS.join(', ') + ' px)');
    return tarefas.reduce(function (p, t) {
      return p.then(function () {
        return uma(t[0], t[1]).then(function (m) {
          P.feito++;
          m.pagina = t[0]; m.largura = t[1];
          P.itens.push(m);
          console.log('[transborda] ' + P.feito + '/' + P.total + ' ' + t[0] + ' @' + t[1] + ': ' +
            (m.erro ? 'ERRO ' + m.erro : m.passam + ' passam' + (m.passam ? ' (máx. +' + m.maxExcesso + ' px)' : '') + ', ' + m.rolam + ' rolam, ' +
              m.tabelas.marcadas + ' marcadas, ' + m.bullets.recortados.length + ' bullets recortados, altura ' +
              (m.altura.erro ? 'ERRO ' + m.altura.erro : (m.altura.ok ? 'igual' : 'DIFERENTE') + ' (' + m.altura.diferenca + ' px além das barras)')));
        }, function (e) {
          P.feito++; P.erros.push(t[0] + ' @' + t[1] + ': ' + e);
        });
      });
    }, Promise.resolve());
  }).then(function () {
    devolve();
    var ruins = P.itens.filter(function (m) {
      return m.erro || m.passam || (m.verticais && m.verticais.length) || !m.drawerMontado || m.ficha3 !== 'aberto' || m.nav !== 'aberta' ||
        ruimTabela(m) || m.bullets.recortados.length || !m.altura || !m.altura.ok;
    });
    function ruimTabela(m) {
      var t = m.tabelas || {};
      return ['marcadaSemRolar', 'cabeMudou', 'rolaOCartao', 'barraLonge'].some(function (k) { return (t[k] || []).length; });
    }
    function soma(f) { return P.itens.reduce(function (s, m) { return s + (m.erro ? 0 : f(m)); }, 0); }
    P.resumo = {
      medicoes: P.itens.length, erros: P.erros.length,
      comElementoPassando: P.itens.filter(function (m) { return m.passam; }).length,
      elementosPassando: P.itens.reduce(function (s, m) { return s + (m.passam || 0); }, 0),
      maxExcesso: P.itens.reduce(function (s, m) { return Math.max(s, m.maxExcesso || 0); }, 0),
      caixasQueRolam: P.itens.reduce(function (s, m) { return s + (m.rolam || 0); }, 0),
      rolamSemBarra: P.itens.reduce(function (s, m) { return s + (m.rolamSemBarra || 0); }, 0),
      caixasRecortadasNaVertical: P.itens.reduce(function (s, m) { return s + ((m.verticais || []).length); }, 0),
      drawerPorCima: P.itens.filter(function (m) { return m.drawerPorCima; }).map(function (m) { return m.pagina + ' @' + m.largura; }),
      paginaComRolagemHorizontal: P.itens.filter(function (m) { return m.rolagemDaPagina; }).length,
      estadoErrado: P.itens.filter(function (m) { return !m.drawerMontado || m.ficha3 !== 'aberto' || m.nav !== 'aberta'; }).length,
      tabelasMarcadas: soma(function (m) { return m.tabelas.marcadas; }),
      tabelasQueRolam: soma(function (m) { return m.tabelas.rolam.length; }),
      marcadaSemRolar: soma(function (m) { return m.tabelas.marcadaSemRolar.length; }),
      tabelaQueCabeMudou: soma(function (m) { return m.tabelas.cabeMudou.length; }),
      cartaoRolando: soma(function (m) { return m.tabelas.rolaOCartao.length; }),
      barraLongeDaTabela: soma(function (m) { return m.tabelas.barraLonge.length; }),
      liComTabela: soma(function (m) { return m.bullets.liComTabela; }),
      bulletsRecortados: soma(function (m) { return m.bullets.recortados.length; }),
      alturaDiferente: P.itens.filter(function (m) { return !m.altura || !m.altura.ok; }).map(function (m) {
        return m.pagina + ' @' + m.largura + ': ' + (m.altura && m.altura.erro ? m.altura.erro : JSON.stringify(m.altura));
      }),
      maxDiferencaAltura: P.itens.reduce(function (s, m) { return Math.max(s, m.altura && !m.altura.erro ? Math.abs(m.altura.diferenca) : 0); }, 0),
      ok: !ruins.length && !P.erros.length,
      segundos: Math.round((Date.now() - t0) / 1000)
    };
    try {
      console.table(P.itens.map(function (m) {
        return { pagina: m.pagina, largura: m.largura, passam: m.passam, maxExcesso: m.maxExcesso, rolam: m.rolam,
          marcadas: m.tabelas && m.tabelas.marcadas, bullets: m.bullets && m.bullets.recortados.length,
          altura: m.altura && (m.altura.erro || m.altura.diferenca), barras: m.altura && m.altura.barras,
          borda: m.borda, drawer: m.drawer, ficha3: m.ficha3, nav: m.nav };
      }));
    } catch (e) { /* sem console.table */ }
    console.log('[transborda] resumo', P.resumo);
    P.fim = true;
    return P.resumo;
  }, function (e) {
    devolve();
    P.erros.push(String(e));
    P.fim = true;
    throw e;
  });
})();
