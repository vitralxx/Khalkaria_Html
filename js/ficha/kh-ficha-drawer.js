/* Khalkaria — Ficha · KhFichaDrawer: o drawer docked da ficha nova à direita (F4.4b), SÓ COM A PRÉVIA.
 * Especificação: docs/ficha-digital/06-f4-drawer.md (base: 03 §9, plano 02 §F4).
 *
 * Com a prévia ligada (localStorage khalkaria_ficha_previa === '1' ou ?ficha=v3,
 * a regra do KhPrevia.ativacao e do partials/head-boot.html), mostra a ficha
 * nova, SÓ LEITURA, em todas as páginas menos a da ficha (pages/ficha.html, #fp,
 * que já é a ficha nova inteira: um drawer por cima repetiria o mesmo conteúdo
 * e carregaria e calcularia tudo duas vezes). Substitui o painel flutuante da
 * prévia (#kf3-previa, que saiu do KhPrevia). Sem a prévia, NADA acontece:
 * nenhum nó, nenhum CSS, nenhum fetch, nenhum ouvinte, nenhuma escrita.
 *
 * Dois estados, no <html>: data-ficha3="trilho" (48 px, as mini barras de
 * Saúde, Stamina e Éter) ou "aberto" (380 px; 460 px a partir de 1800 px). O
 * head-boot marca o estado guardado (localStorage khalkaria_ficha3_dock) antes
 * do primeiro desenho, e o css/style.css (@layer layout) empurra o conteúdo e
 * desenha um fundo de reserva até este script montar: nada salta. No Bazar o
 * drawer aberto fica por cima (não empurra até a F4b), e abaixo de 1100 px
 * também. O CSS do drawer (css/ficha-drawer.css: a casca e o conteúdo) só é
 * pedido aqui.
 *
 * Conteúdo: o MESMO da página (KhFichaAbas, prefixo 'fd', densidade
 * 'compacta'), calculado pelo mesmo caminho (KhPrevia.carregar e calcular), nas
 * mesmas 5 abas e na mesma ordem guardada (KhAbas, khalkaria_ficha_abas). Cada
 * número com a conta (KhConta); as mini barras do trilho têm a sua (prefixo
 * 'fd-tr', ids próprios). Redesenha em kf:mudou, ao digitar no #kf-drawer e no
 * storage da khalkaria_ficha (debounce de 350 ms), pelo KhRedesenho (foco,
 * <details>, dica e rolagem ficam).
 *
 * Arrastar: o dragstart de um card (.kf-draggable, [data-kf-tipo], item do
 * Bazar) acende o trilho; o dragenter abre o drawer (sem gravar a preferência);
 * soltar um item do Bazar ({_bazar:true,item}) guarda na ficha atual por
 * KF.adicionar (o inventário é o mesmo); qualquer outra entidade não é aceita
 * e o drawer avisa, sem perder o arrasto (dá para seguir até a ficha atual).
 * Teclado: Esc recolhe (KhTeclas.camadaEsc, depois das camadas do Bazar; não
 * com o foco num campo de texto fora do drawer, cujo Esc é dele); abrir
 * pelo botão leva o foco à aba aberta, recolher o devolve ao botão do trilho.
 * "Sair da prévia" apaga a chave e recarrega sem o ?ficha (saidaPrevia).
 * O drawer leva [data-kf-ignorar] (o MutationObserver da v2.1 não o decora).
 *
 * Escritas: localStorage khalkaria_ficha3_dock (só quando o jogador abre ou
 * recolhe pelo botão ou pelo Esc), as preferências de aba do KhAbas (ordem e
 * aba aberta, as mesmas da página), o "lembrar" da prévia (KhPrevia.iniciar,
 * com ?ficha=v3) e, ao soltar um item do Bazar, o KF.adicionar da ficha atual.
 * Nenhuma chave de ficha v3.
 *
 * Partes puras (testadas no node, tools/testes/ficha-drawer.test.js): estado,
 * lerDock, leArrasto, fracao, saidaPrevia, htmlCasca, htmlId e htmlMinis. No node exporta
 * por module.exports (carregado sozinho); no artefato js/ficha.js o export já é
 * o KhInv e este módulo só registra window.KhFichaDrawer e o liga no navegador.
 * Vem no ORDEM depois do kh-ficha-abas.js (usa o KhFichaAbas, o KhAbas, o
 * KhRedesenho, o KhConta e o KhPrevia).
 * Fonte: js/ficha/kh-ficha-drawer.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv
  var KhPrevia = emNode ? require('./kh-previa.js') : raiz.KhPrevia;
  var KhRegras = emNode ? require('./kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./kh-conta.js') : raiz.KhConta;
  var KhAbas = emNode ? require('./kh-abas.js') : raiz.KhAbas;
  var KhFichaAbas = emNode ? require('./kh-ficha-abas.js') : raiz.KhFichaAbas;
  var KhRedesenho = emNode ? require('./kh-redesenho.js') : raiz.KhRedesenho;

  var KhFichaDrawer = (function () {
    var CHAVE_DOCK = 'khalkaria_ficha3_dock';
    var CHAVE_PREVIA = 'khalkaria_ficha_previa';
    var CHAVE_V2 = 'khalkaria_ficha';
    var ESTADOS = ['trilho', 'aberto'];
    var PADRAO = 'trilho';
    var ATRIBUTO = 'data-ficha3';    // no <html>: o head-boot marca, o drawer troca; o css/style.css lê
    var PREFIXO = 'fd';              // o do conteúdo (KhFichaAbas e o KhConta das abas: fd-d-N)
    var PREFIXO_TRILHO = 'fd-tr';    // o KhConta das mini barras (fd-tr-d-N: sem colidir com as abas)
    var ID = 'fd-gaveta';
    var ESPERA = 350;                // ms: depois do debounce de 200 ms com que o drawer v2 grava
    var MOSTRA_AVISO = 6000;         // ms do aviso depois que o arrasto acaba
    // o texto da especificação (06 §Arrastar)
    var AVISO_SO_LEITURA = 'A ficha nova ainda é só leitura: solte na ficha atual (botão FICHA) para levar técnicas e magias';
    var RO = 'Prévia só leitura. Para editar, use a ficha atual (FICHA).';
    var DICA_ORDEM = 'Arraste para mudar a ordem das abas. Pelo teclado: Tab até a aba e Alt+← ou Alt+→';
    var TITULO_A4 = 'Ordem do A4: volta as abas à ordem da ficha física';
    var RESTAURADA = 'Ordem do A4 restaurada.';
    var CARREGANDO = KhFichaAbas ? KhFichaAbas.CARREGANDO : 'Carregando a ficha…';
    // as abas são as da página (KhFichaAbas.ABAS: id, página do A4 e rótulo); em
    // 380 px, numa linha só, o rótulo à vista é a primeira palavra dele, e o
    // nome inteiro fica no aria-label (que começa pelo que se vê)
    function rotuloCurto(a) { return str(a.rotulo).replace(/^O\s+/, '').split(/[\s,&]+/)[0] || str(a.rotulo); }
    // as mini barras do trilho (03 §9): Saúde, Stamina e Éter, nas cores de recurso (D28)
    var RECURSOS = [['saude', 'Saúde'], ['stamina', 'Stamina'], ['eter', 'Éter']];
    // o que acende o trilho ao começar a arrastar: os cards das páginas de regras
    // (decorados pela v2.1: .kf-draggable; marcados no build: [data-kf-tipo]) e
    // os itens do Bazar (o registro tem [data-kf-tipo="item"]; o painel de receita, [data-ir])
    var ORIGENS_ARRASTO = '.kf-draggable, [data-kf-tipo], #bz-receita [data-ir]';

    // ícones (traço em currentColor, sem emoji)
    function svg(d) {
      return '<svg class="fd-gaveta-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="' + d +
        '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    var SVG_ABRIR = svg('M11.5 6 5.5 12l6 6M18.5 6l-6 6 6 6');
    var SVG_RECOLHER = svg('M5.5 6l6 6-6 6M12.5 6l6 6-6 6');
    var SVG_PAGINA = svg('M14 4h6v6M20 4l-8.5 8.5M18 14v4.6a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 18.6V7.4A1.4 1.4 0 0 1 5.4 6H10');
    var SVG_EDITAR = svg('M4.5 19.5h3.6L18.6 9a2.5 2.5 0 0 0-3.6-3.6L4.5 15.9Zm9-12.6 3.6 3.6');
    var SVG_A4 = svg('M5.6 9.2A7.4 7.4 0 1 1 4.6 13.6M4.4 4.6v4.8h4.8');

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) { return KhConta ? KhConta.esc(s) : str(s); }
    function semEmoji(s) { return KhConta ? KhConta.semEmoji(s) : str(s); }
    function fmt(n) { return KhRegras && KhRegras.fmt ? KhRegras.fmt(n) : str(n); }
    function storage(win, nome) { try { return win ? win[nome] : null; } catch (e) { return null; } }
    function arr(x) { return Array.prototype.slice.call(x || []); }

    // ---------------- puras ----------------
    function estado(v) { return v === 'aberto' ? 'aberto' : PADRAO; }
    function lerDock(ls) {
      var v = null;
      try { v = ls ? ls.getItem(CHAVE_DOCK) : null; } catch (e) { v = null; }
      return estado(v);
    }
    function gravarDock(ls, e) {
      try { if (ls) { ls.setItem(CHAVE_DOCK, estado(e)); return true; } } catch (x) { /* bloqueado: vale nesta página */ }
      return false;
    }
    // o text/plain de um arrasto (o formato da v2.1 e do Bazar):
    // {tipo:'bazar', item} | {tipo:'outro'} | null (não é entidade)
    function leArrasto(txt) {
      var p = null;
      try { p = JSON.parse(str(txt)); } catch (e) { return null; }
      if (!obj(p)) return null;
      if (p._bazar && obj(p.item) && (p.item.id || p.item.nome)) return { tipo: 'bazar', item: p.item };
      return { tipo: 'outro' };
    }
    // atual sobre máximo, de 0 a 1 (máximo 0 ou ausente: vazia)
    function fracao(atual, max) {
      var a = Number(atual), m = Number(max);
      if (!isFinite(a) || !isFinite(m) || m <= 0) return 0;
      return Math.max(0, Math.min(1, a / m));
    }
    // "Sair da prévia": a URL sem o parâmetro ficha (o ?ficha=v3 religaria a
    // prévia), com os outros parâmetros e o #fragmento. Sem ficha na query, a URL
    // nova seria a atual, e um replace para ela com # só rola até o fragmento,
    // sem recarregar: aí {recarregar:true}. loc: {pathname, search, hash}
    function saidaPrevia(loc) {
      loc = loc || {};
      var search = str(loc.search);
      var resto = search.replace(/^\?/, '').split('&').filter(function (p) { return p && !/^ficha(=|$)/.test(p); });
      var q = resto.length ? '?' + resto.join('&') : '';
      if (q === search) return { recarregar: true, url: '' };
      return { recarregar: false, url: str(loc.pathname) + q + str(loc.hash) };
    }
    function refNome(r) { return KhFichaAbas ? KhFichaAbas.refNome(r) : ''; }
    function idsAbas() { return KhFichaAbas ? KhFichaAbas.ABAS.map(function (a) { return a.id; }) : []; }
    function abaPorId(id) { return KhFichaAbas ? KhFichaAbas.ABAS.filter(function (a) { return a.id === id; })[0] : null; }

    // nome, nível, raça e classe; res null = carregando
    function htmlId(res) {
      var ok = !!res && res.estado === 'ok';
      var f = ok ? res.ficha : null;
      var meta = f && obj(f.meta) ? f.meta : {}, idt = f && obj(f.identidade) ? f.identidade : {};
      var nome = ok ? (semEmoji(meta.nome) || '(sem nome)') : !res ? CARREGANDO : res.estado === 'sem-ficha' ? '(sem ficha)' : 'Ficha';
      var sub = ok ? [meta.nivel == null ? '' : 'Nível ' + str(meta.nivel), refNome(idt.raca), refNome(idt.classe)].filter(Boolean).join(' · ')
        : (KhFichaAbas && res ? KhFichaAbas.mensagemEstado(res) : '');
      return '<p class="fd-gaveta-nome">' + esc(nome) + '</p>' + (sub ? '<p class="fd-gaveta-sub">' + esc(sub) + '</p>' : '');
    }

    // as mini barras: atual sobre máximo, com a conta do máximo no foco e no
    // hover. res fora de 'ok' (carregando, sem ficha): vazias, sem conta.
    // C = KhConta com o PREFIXO_TRILHO (criado aqui se não vier)
    function htmlMinis(res, C) {
      var ok = !!res && res.estado === 'ok' && !!res.av;
      if (ok && !C && KhConta) C = KhConta.criar({ D: KhRegras ? KhRegras.dados() : {}, nos: res.av.nos, prefixo: PREFIXO_TRILHO, fmt: fmt });
      var rc = ok && res.ficha && obj(res.ficha.recursos) ? res.ficha.recursos : {};
      return RECURSOS.map(function (r) {
        var id = r[0], nome = r[1], caminho = 'recurso.' + id + '.max';
        var no = ok ? res.av.nos[caminho] : null;
        var max = no && typeof no.valor === 'number' ? no.valor : null;
        var x = rc[id], atual = obj(x) && typeof x.atual === 'number' ? x.atual : null;
        var pc = max == null || atual == null ? 0 : Math.round(fracao(atual, max) * 1000) / 10;
        var txt = nome + ' ' + (max == null ? (ok ? 'sem máximo' : '(carregando)') : (atual == null ? '?' : fmt(atual)) + ' / ' + fmt(max));
        var conta = no && C ? C.conta(caminho, { texto: txt, semSelos: true })
          // a linha de cima da dica (só para quem vê: o leitor de tela já leu o valor no <b>)
          .replace('role="tooltip">', 'role="tooltip"><span class="fd-gaveta-mini-cab" aria-hidden="true">' + esc(txt) + '</span>')
          : '<span class="fd-gaveta-sr">' + esc(txt) + '</span>';
        return '<div class="fd-gaveta-mini fd-gaveta-mini-' + id + '" data-recurso="' + id + '"' + (max == null ? ' data-vazia' : '') + '>' +
          '<span class="fd-gaveta-mini-barra" aria-hidden="true"><span class="fd-gaveta-mini-fill" style="height: ' + pc + '%"></span></span>' +
          '<svg class="fd-gaveta-mini-g" aria-hidden="true" focusable="false"><use href="#g-' + id + '"/></svg>' +
          conta + '</div>';
      }).join('');
    }

    // a casca inteira (o miolo do <aside>): trilho, e a folha com cabeçalho,
    // abas na ordem dada (ids; sem ela, a do A4), aviso, painéis e o sprite.
    // op: {ordem, aberta, base (raiz do site, para o link da página da ficha)}
    function htmlCasca(op) {
      op = obj(op) ? op : {};
      var ids = idsAbas();
      var ordem = KhAbas ? KhAbas.normaliza(op.ordem, ids) : ids;
      var aberta = ordem.indexOf(op.aberta) >= 0 ? op.aberta : ordem[0];
      var padrao = ordem.join(' ') === ids.join(' ');
      var base = op.base == null ? '../' : str(op.base);
      return '<div class="fd-gaveta-trilho">' +
          '<button type="button" class="fd-gaveta-abrir" aria-expanded="false" aria-controls="fd-gaveta-folha" title="Abrir a ficha nova">' +
            SVG_ABRIR + '<span class="fd-gaveta-trilho-rot">Ficha nova</span></button>' +
          '<div class="fd-gaveta-minis" id="fd-gaveta-minis" role="group" aria-label="Saúde, Stamina e Éter">' + htmlMinis(null) + '</div>' +
        '</div>' +
        '<div class="fd-gaveta-folha" id="fd-gaveta-folha" role="region" aria-label="Ficha nova" tabindex="-1">' +
          '<header class="fd-gaveta-cab">' +
            '<div class="fd-gaveta-id" id="fd-gaveta-id">' + htmlId(null) + '</div>' +
            '<div class="fd-gaveta-acoes">' +
              '<a class="kh-btn fd-gaveta-btn fd-gaveta-pagina" href="' + esc(base + 'pages/ficha.html') + '" aria-label="Abrir a página da ficha" title="Abrir a página da ficha">' + SVG_PAGINA + '</a>' +
              '<button type="button" class="kh-btn fd-gaveta-btn fd-gaveta-editar" aria-label="Editar na ficha atual" title="Editar na ficha atual (FICHA)">' + SVG_EDITAR + '</button>' +
              '<button type="button" class="kh-btn fd-gaveta-btn fd-gaveta-recolher" aria-expanded="true" aria-controls="fd-gaveta-folha" aria-keyshortcuts="Escape"' +
                ' aria-label="Recolher ao trilho" title="Recolher ao trilho (Esc)">' + SVG_RECOLHER + '</button>' +
            '</div>' +
            '<p class="fd-gaveta-ro" role="note">' + esc(RO) + ' <button type="button" class="fd-gaveta-sair">Sair da prévia</button></p>' +
          '</header>' +
          '<div class="fd-gaveta-abas-barra">' +
            '<div class="fd-gaveta-abas" id="fd-gaveta-abas" role="tablist" aria-label="Partes da ficha">' +
            ordem.map(function (id) {
              var a = abaPorId(id), on = id === aberta;
              return '<button type="button" class="fd-gaveta-aba" role="tab" id="fd-gaveta-a-' + id + '" data-aba="' + id + '"' +
                ' aria-controls="fd-gaveta-p-' + id + '" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '"' +
                ' aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight" aria-label="' + esc(a.rotulo) + '" title="' + esc(a.rotulo + '. ' + DICA_ORDEM) + '">' +
                '<span class="fd-gaveta-aba-pag" aria-hidden="true">' + a.pag + '</span>' +
                '<span class="fd-gaveta-aba-rot">' + esc(rotuloCurto(a)) + '</span></button>';
            }).join('') + '</div>' +
            '<button type="button" class="kh-btn fd-gaveta-a4" id="fd-gaveta-a4"' + (padrao ? ' hidden' : '') +
              ' aria-label="Ordem do A4" title="' + esc(TITULO_A4) + '">' + SVG_A4 + '</button>' +
            '<span class="fd-gaveta-sr" id="fd-gaveta-anuncio" role="status" aria-live="polite"></span>' +
          '</div>' +
          '<p class="fd-gaveta-aviso" id="fd-gaveta-aviso" role="status" aria-live="polite" hidden></p>' +
          '<div class="fd-gaveta-rolagem" id="fd-gaveta-rolagem">' +
            ordem.map(function (id) {
              return '<section class="fd-gaveta-painel" role="tabpanel" id="fd-gaveta-p-' + id + '" data-aba="' + id + '"' +
                ' aria-labelledby="fd-gaveta-a-' + id + '" tabindex="0" aria-busy="true"' + (id === aberta ? '' : ' hidden') + '>' +
                '<p class="fd-nota">' + esc(CARREGANDO) + '</p></section>';
            }).join('') +
          '</div>' +
          // o sprite partials/glifos.html (moldura de raízes, ramos, selo, recursos), posto ao carregar
          '<div class="fd-gaveta-sprite" id="fd-gaveta-sprite" aria-hidden="true"></div>' +
        '</div>';
    }

    // ---------------- navegador ----------------
    var atual = null;   // o drawer montado nesta página (ou null)

    // a borda esquerda do drawer na janela (px), para quem posiciona pop-ups
    // (KhPrever no Bazar: xPreferido); null sem drawer (sem a prévia, na página
    // da ficha, antes de montar)
    function borda() { return atual ? atual.borda() : null; }

    function iniciar(win) {
      if (!win || !win.document || !win.location) return false;
      // ativação e "lembrar" (?ficha=v3 grava a chave da prévia): os do KhPrevia
      if (!KhPrevia || !KhPrevia.iniciar(win)) return false;
      var doc = win.document;
      var vai = function () {
        try { atual = montar(win) || atual; } catch (e) { /* o drawer nunca derruba a página */ }
      };
      if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', vai);
      else vai();
      return true;
    }

    function montar(win) {
      var doc = win.document, html = doc.documentElement;
      if (!doc.body || !html || doc.getElementById(ID)) return null;
      // a página da ficha já é a ficha nova inteira: nada por cima dela
      if (doc.getElementById('fp') || (doc.body.hasAttribute && doc.body.hasAttribute('data-ficha-pagina'))) return null;
      if (!KhFichaAbas || !KhAbas || !KhRedesenho || !KhConta || !KhRegras || !KhPrevia) return null;
      var ls = storage(win, 'localStorage'), ss = storage(win, 'sessionStorage');
      var s = doc.querySelector('script[src*="js/ficha.js"]');
      var src = s ? s.src : '';
      var base = '', versao = '';
      try { base = src ? new URL('../', src).href : ''; versao = src ? new URL(src).search : ''; } catch (e) { /* relativo à página */ }
      var ids = idsAbas();
      var ordem = KhAbas.lerOrdem(ls, ids);
      var aberta = KhAbas.lerAberta(ss, ids) || ordem[0];
      var est = lerDock(ls);
      // o head-boot já marcou (página gerada antes da F4.4b não: marca agora)
      if (html.getAttribute(ATRIBUTO) !== est) html.setAttribute(ATRIBUTO, est);

      var link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = base + 'css/ficha-drawer.css' + versao;
      link.setAttribute('data-fd-gaveta', '');
      var gav = doc.createElement('aside');
      gav.id = ID;
      gav.className = 'fd-gaveta';
      gav.hidden = true;   // até o CSS chegar (a reserva do style.css segura o lugar)
      gav.setAttribute('aria-label', 'Ficha nova (prévia, só leitura)');
      // o MutationObserver da v2.1 (decoração dos cards) ignora o que redesenha aqui
      gav.setAttribute('data-kf-ignorar', '');
      gav.innerHTML = htmlCasca({ ordem: ordem, aberta: aberta, base: base || '../' });
      var mostrar = function () { gav.hidden = false; };
      link.addEventListener('load', mostrar);
      link.addEventListener('error', mostrar);
      doc.head.appendChild(link);
      doc.body.appendChild(gav);

      function el(id) { return doc.getElementById(id); }
      function q(sel) { return gav.querySelector(sel); }
      var btAbrir = q('.fd-gaveta-abrir'), btRecolher = q('.fd-gaveta-recolher');
      var minis = el('fd-gaveta-minis'), idEl = el('fd-gaveta-id'), rolagem = el('fd-gaveta-rolagem');
      var aviso = el('fd-gaveta-aviso');
      var vivo = true;

      // ---- estado: trilho | aberto
      function foca(x) { if (!x || !x.focus) return; try { x.focus({ preventScroll: true }); } catch (e) { x.focus(); } }
      function poeEstado(novo, o) {
        o = o || {};
        est = estado(novo);
        html.setAttribute(ATRIBUTO, est);
        btAbrir.setAttribute('aria-expanded', est === 'aberto' ? 'true' : 'false');
        btRecolher.setAttribute('aria-expanded', est === 'aberto' ? 'true' : 'false');
        if (o.gravar) gravarDock(ls, est);
        if (o.foco) foca(est === 'aberto' ? (el('fd-gaveta-a-' + aberta) || el('fd-gaveta-folha')) : btAbrir);
      }
      function abrir(o) { o = o || {}; poeEstado('aberto', { gravar: o.gravar !== false, foco: !!o.foco }); }
      function recolher(o) { o = o || {}; poeEstado('trilho', { gravar: o.gravar !== false, foco: !!o.foco }); }
      poeEstado(est);

      // ---- abas: as da página (KhAbas, khalkaria_ficha_abas), Alt+setas, arrasto, "Ordem do A4"
      var rotulos = {};
      KhFichaAbas.ABAS.forEach(function (a) { rotulos[a.id] = a.rotulo; });
      var abas = KhAbas.criar(el('fd-gaveta-abas'), { win: win, doc: doc, ids: ids, ls: ls, ss: ss, aberta: aberta, rotulos: rotulos,
        restaurar: el('fd-gaveta-a4'), anuncio: el('fd-gaveta-anuncio'), textoRestaurada: RESTAURADA,
        aoSelecionar: function (id) { aberta = id; } });

      // ---- aviso (arrastar e soltar)
      var avisoT = null;
      function mostraAviso(msg, ms) {
        clearTimeout(avisoT);
        if (aviso.textContent !== msg) aviso.textContent = msg;
        aviso.hidden = false;
        if (ms) avisoT = setTimeout(function () { aviso.hidden = true; aviso.textContent = ''; }, ms);
      }

      // ---- cliques (delegados: o redesenho não perde ouvinte)
      gav.addEventListener('click', function (e) {
        var t = e.target && e.target.closest ? e.target : null;
        if (!t) return;
        if (t.closest('.fd-gaveta-abrir')) abrir({ foco: true });
        else if (t.closest('.fd-gaveta-recolher')) recolher({ foco: true });
        else if (t.closest('.fd-gaveta-editar')) { if (win.KF && typeof win.KF.abrir === 'function') win.KF.abrir(); }
        else if (t.closest('.fd-gaveta-sair')) {
          // apaga a chave e recarrega DE FATO, sem ?ficha=v3 (saidaPrevia)
          try { if (ls) ls.removeItem(CHAVE_PREVIA); } catch (x) { /* storage bloqueado */ }
          var L = win.location, s = saidaPrevia(L);
          if (!L) return;
          if (s.recarregar) { if (typeof L.reload === 'function') L.reload(); }
          else if (typeof L.replace === 'function') L.replace(s.url);
        }
      });

      // ---- a dica da conta dentro do drawer (as das abas; as do trilho abrem à esquerda pelo CSS)
      var R = KhRedesenho.criar({ prefixo: PREFIXO }), RT = KhRedesenho.criar({ prefixo: PREFIXO_TRILHO });
      function aoAbrirDica(e) {
        var c = e.target && e.target.closest ? e.target.closest('.kh-conta') : null;
        if (!c || !rolagem.contains(c)) return;
        if (e.type === 'mouseover' && e.relatedTarget && c.contains && c.contains(e.relatedTarget)) return;
        if (!R.encaixa(c, rolagem, win) && win.requestAnimationFrame) win.requestAnimationFrame(function () { R.encaixa(c, rolagem, win); });
      }
      gav.addEventListener('mouseover', aoAbrirDica);
      gav.addEventListener('focusin', aoAbrirDica);
      gav.addEventListener('focusout', function (e) { R.soltaFoco(e.target); RT.soltaFoco(e.target); });
      // a dica de uma mini barra que o redesenho deixou aberta (sem caixa: ela abre à esquerda do trilho)
      var dicaTrilho = false;
      function aoMexer() {
        R.soltaDicas(rolagem);
        if (!dicaTrilho) return;
        dicaTrilho = false;
        arr(minis.querySelectorAll('[' + RT.MARCA_DICA + ']')).forEach(function (x) { x.removeAttribute(RT.MARCA_DICA); });
      }
      doc.addEventListener('mousemove', aoMexer, { passive: true });

      // ---- desenho: o mesmo da página (KhFichaAbas), compacto
      var DESENHO = KhFichaAbas.criar({ prefixo: PREFIXO, densidade: 'compacta' });
      var dados = null, t = null, res = null;
      function pinta(r0) {
        res = r0;
        var r = DESENHO.paineis(r0, { dados: dados, base: base || '../' });
        var topo = rolagem.scrollTop;
        R.trocaHTML(doc, idEl, htmlId(r0), null, null, win);
        if (RT.trocaHTML(doc, minis, htmlMinis(r0), btAbrir, null, win)) dicaTrilho = !!minis.querySelector('[' + RT.MARCA_DICA + ']');
        ids.forEach(function (id) {
          var p = el('fd-gaveta-p-' + id);
          if (!p) return;
          R.trocaHTML(doc, p, r.paineis[id], p, rolagem, win);
          p.removeAttribute('aria-busy');
        });
        rolagem.scrollTop = topo;
      }
      function desenha() { if (dados && vivo) pinta(KhPrevia.calcular(ls, dados, versao)); }
      function agenda() { clearTimeout(t); t = setTimeout(desenha, ESPERA); }
      function aoStorage(e) { if (e && e.key === CHAVE_V2) agenda(); }
      // campos digitados do drawer v2: vários só gravam (save), sem kf:mudou
      function aoCampo(e) { if (e && e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }
      doc.addEventListener('kf:mudou', agenda);
      doc.addEventListener('input', aoCampo, true);
      doc.addEventListener('change', aoCampo, true);
      win.addEventListener('storage', aoStorage);

      // ---- arrastar: acende, abre, guarda o item do Bazar, avisa o resto
      var arrasto = null;
      function limpaAlvo() { gav.removeAttribute('data-alvo'); gav.removeAttribute('data-recusa'); }
      function aoComecar(e) {
        var x = e.target && e.target.closest ? e.target : null;
        if (!x || x.closest('#' + ID) || !x.closest(ORIGENS_ARRASTO)) return;
        var lido = null;
        // no dragstart o dataTransfer ainda se lê (o card já pôs o text/plain: ouvinte dele, antes deste)
        try { lido = leArrasto(e.dataTransfer ? e.dataTransfer.getData('text/plain') : ''); } catch (y) { lido = null; }
        arrasto = { tipo: lido ? lido.tipo : 'outro', item: lido ? lido.item : null };
        gav.setAttribute('data-acende', '');
      }
      function aoEntrar() {
        if (!arrasto) return;
        // abre sem gravar: é um passeio do arrasto, não a escolha do jogador
        if (est !== 'aberto') poeEstado('aberto');
      }
      function nomeItem(it) { return semEmoji(it && it.nome) || 'o item'; }
      function aoSobre(e) {
        if (!arrasto) return;
        if (arrasto.tipo === 'bazar') {
          e.preventDefault();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          gav.setAttribute('data-alvo', '');
          mostraAviso('Solte para guardar ' + nomeItem(arrasto.item) + ' no inventário da ficha atual.');
        } else {
          // não aceita (sem preventDefault): o arrasto segue, e dá para soltar na ficha atual
          gav.setAttribute('data-recusa', '');
          mostraAviso(AVISO_SO_LEITURA);
        }
      }
      function aoSairArrasto(e) {
        if (e.relatedTarget && gav.contains(e.relatedTarget)) return;
        limpaAlvo();
      }
      function fimArrasto() {
        if (!arrasto) return;
        arrasto = null;
        gav.removeAttribute('data-acende');
        limpaAlvo();
        if (!aviso.hidden) mostraAviso(aviso.textContent, MOSTRA_AVISO);
      }
      function aoSoltar(e) {
        if (!arrasto || arrasto.tipo !== 'bazar') return;
        e.preventDefault();
        var lido = null;
        try { lido = leArrasto(e.dataTransfer ? e.dataTransfer.getData('text/plain') : ''); } catch (y) { lido = null; }
        var it = lido && lido.tipo === 'bazar' ? lido.item : arrasto.item;
        var KF = win.KF;
        var uid = KF && typeof KF.adicionar === 'function' ? KF.adicionar(it) : null;
        arrasto = null;
        gav.removeAttribute('data-acende');
        limpaAlvo();
        if (uid) {
          // mostra onde foi parar: a aba O Bazar (o redesenho vem pelo kf:mudou)
          if (abas) abas.seleciona('bazar');
          mostraAviso('+ ' + nomeItem(it) + ' no inventário da ficha atual.', MOSTRA_AVISO);
        } else mostraAviso('Não deu para guardar ' + nomeItem(it) + ' na ficha atual.', MOSTRA_AVISO);
      }
      doc.addEventListener('dragstart', aoComecar);
      doc.addEventListener('dragend', fimArrasto, true);
      gav.addEventListener('dragenter', aoEntrar);
      gav.addEventListener('dragover', aoSobre);
      gav.addEventListener('dragleave', aoSairArrasto);
      gav.addEventListener('drop', aoSoltar);

      // ---- teclado: Esc recolhe (depois das camadas do Bazar: pop-up 10, lista 20, painel 30)
      var T = win.KhTeclas;
      // foco num campo de texto da página, fora do drawer: o Esc é do campo (a
      // busca do Bazar, type=search, limpa o texto; o escLivre do bazar.js já
      // solta as camadas dele ali). Consumir cancelaria isso e gravaria o dock.
      function campoFora(e) {
        if (!T || typeof T.emCampo !== 'function') return false;
        return [e && e.target, doc.activeElement].some(function (x) { return !!x && T.emCampo(x) && !gav.contains(x); });
      }
      if (T && typeof T.camadaEsc === 'function') {
        T.camadaEsc(40, function (e) {
          if (!vivo || est !== 'aberto') return false;
          // a ficha atual (v2.1) aberta fica por cima: o Esc não mexe no que está embaixo dela
          var v2 = el('kf-drawer');
          if (v2 && v2.classList && v2.classList.contains('kf-open')) return false;
          if (campoFora(e)) return false;
          var dentro = gav.contains(doc.activeElement);
          recolher({ foco: dentro });
          return true;
        });
      }

      // ---- dados: os do motor (os da página), uma vez
      KhPrevia.carregar(win.fetch.bind(win), base, versao).then(function (d) {
        dados = d;
        var sp = el('fd-gaveta-sprite');
        if (sp && d && d.glifos) sp.innerHTML = d.glifos;
        desenha();
      }, function (e) {
        pinta({ estado: 'falha', erro: str(e && e.message), erros: [] });
      });

      return {
        gaveta: gav, abas: abas,
        estado: function () { return est; },
        abrir: abrir, recolher: recolher,
        alternar: function (o) { if (est === 'aberto') recolher(o); else abrir(o); },
        borda: function () {
          if (!vivo || gav.hidden || !gav.getBoundingClientRect) return null;
          var r = gav.getBoundingClientRect();
          return r && r.width ? r.left : null;
        },
        desenha: desenha, pinta: pinta, resultado: function () { return res; }
      };
    }

    return { CHAVE_DOCK: CHAVE_DOCK, ESTADOS: ESTADOS.slice(), PADRAO: PADRAO, ATRIBUTO: ATRIBUTO, ID: ID,
      PREFIXO: PREFIXO, PREFIXO_TRILHO: PREFIXO_TRILHO, AVISO_SO_LEITURA: AVISO_SO_LEITURA, ORIGENS_ARRASTO: ORIGENS_ARRASTO,
      estado: estado, lerDock: lerDock, leArrasto: leArrasto, fracao: fracao, saidaPrevia: saidaPrevia,
      htmlId: htmlId, htmlMinis: htmlMinis, htmlCasca: htmlCasca,
      iniciar: iniciar, borda: borda, atual: function () { return atual; } };
  })();

  if (emNode) { module.exports = KhFichaDrawer; return; }
  raiz.KhFichaDrawer = KhFichaDrawer;
  try { KhFichaDrawer.iniciar(raiz); } catch (e) { /* o drawer nunca derruba a página */ }
})(typeof window !== 'undefined' ? window : this);
