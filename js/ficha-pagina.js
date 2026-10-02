/* Khalkaria — página da ficha nova (F4.3, pages/ficha.html), SOMENTE LEITURA.
 *
 * Espelha a ficha física A4 em 5 abas (docs/ficha-digital/05-f4-pagina.md,
 * 03 §4). Lê a ficha v2 (khalkaria_ficha) pelo KhEstado.sombra e calcula pelo
 * motor v3, pelo mesmo caminho da prévia: KhPrevia.carregar (catálogo, classes,
 * raças, efeitos, glifos) e KhPrevia.calcular (sombra -> avaliar). Cada número
 * sai com a conta (KhConta, prefixo 'fp', para não colidir com os ids kf3- da
 * prévia, que pode estar aberta na mesma página).
 *
 * Escondida até a virada (03 §9): sem a prévia (localStorage
 * khalkaria_ficha_previa === '1' ou ?ficha=v3, a mesma regra do
 * partials/head-boot.html), mostra só o AVISO e não pede catálogo nenhum.
 * Não grava NENHUMA chave de ficha: as únicas escritas previstas para esta
 * página são as preferências de aba da F4.5 (khalkaria_ficha_abas e, em
 * sessionStorage, khalkaria_ficha_aba), que ainda não existem.
 *
 * F4.3a (este arquivo hoje): a infraestrutura. Topo (seletor de ficha
 * desabilitado, nome, raça, classe, nível, origem e o aviso de só-leitura com
 * o botão que abre a ficha atual pela KF.abrir()), a lista das 5 abas
 * (role=tablist, tabindex móvel, clique, setas, Home e End) e os 5 painéis.
 * Pontos para as fatias seguintes:
 *   - F4.3b: RENDER[id da aba] = function (res, C) { return html; } desenha o
 *     painel (res = KhPrevia.calcular, estado 'ok'; C = KhConta desta passada).
 *     Aba sem RENDER mostra EM_CONSTRUCAO.
 *   - F4.5: ordem (ABAS por id) e aba aberta: ordemAbas() e seleciona().
 *
 * No node (tools/testes/ficha-pagina.test.js) exporta por module.exports e
 * carrega os módulos de js/ficha/ direto; no navegador usa os do js/ficha.js,
 * carregado antes, síncrono (templates/ficha.template.html).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  var KhPrevia = emNode ? require('./ficha/kh-previa.js') : raiz.KhPrevia;
  var KhRegras = emNode ? require('./ficha/kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./ficha/kh-conta.js') : raiz.KhConta;

  var FichaPagina = (function () {
    var CHAVE_PREVIA = 'khalkaria_ficha_previa';
    var CHAVE_V2 = 'khalkaria_ficha';
    var PREFIXO = 'fp';
    // o mesmo texto do templates/ficha.template.html (o teste confere)
    var AVISO = 'A ficha nova está em preparação. Por enquanto, use a ficha atual, no botão FICHA da lateral.';
    var AVISO_RO = 'Ficha nova em prévia: só leitura. Para editar, use a ficha atual (FICHA).';
    var CARREGANDO = 'Carregando a ficha…';
    var EM_CONSTRUCAO = 'Esta aba ainda está em construção.';
    // As 5 abas, na ordem da ficha física (pág. 1 a 5 do A4). O id é estável:
    // a F4.5 guarda a ordem por id (khalkaria_ficha_abas), e o drawer da F4.4 usa os mesmos.
    var ABAS = [
      { id: 'nucleo', pag: 1, rotulo: 'Núcleo' },
      { id: 'tecnicas', pag: 2, rotulo: 'Técnicas & Marcas' },
      { id: 'cartas', pag: 3, rotulo: 'Cartas, Lore & Outros' },
      { id: 'bazar', pag: 4, rotulo: 'O Bazar' },
      { id: 'grimorio', pag: 5, rotulo: 'Grimório' }
    ];
    // F4.3b: um desenhista por aba (ver o cabeçalho)
    var RENDER = {};

    function obj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
    function lista(x) { return Array.isArray(x) ? x : []; }
    function str(x) { return x == null ? '' : String(x); }
    function esc(s) {
      return str(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function semEmoji(s) { return KhConta ? KhConta.semEmoji(s) : str(s); }

    // ---------------- ativação (a mesma regra do partials/head-boot.html) ----------------
    function ativa(search, ls) {
      try { if (ls && ls.getItem(CHAVE_PREVIA) === '1') return true; } catch (e) { /* storage bloqueado: vale a URL */ }
      try {
        var m = /[?&]ficha=([^&#]*)/.exec(str(search));
        return !!m && decodeURIComponent(m[1]) === 'v3';
      } catch (e) { return false; }
    }

    // ordem das abas: hoje a do A4; a F4.5 lê aqui a preferência do navegador
    function ordemAbas() { return ABAS.slice(); }

    // ---------------- html (puro: string) ----------------
    function htmlAviso() {
      return '<h1 class="fp-titulo">Ficha</h1><p class="fp-aviso" data-sem-previa>' + esc(AVISO) + '</p>';
    }

    // a casca: topo (preenchido por htmlTopo), lista de abas e painéis
    function htmlCasca(aberta) {
      var abas = ordemAbas();
      aberta = abas.some(function (a) { return a.id === aberta; }) ? aberta : abas[0].id;
      return '<header class="fp-topo" id="fp-topo">' + htmlTopo(null) + '</header>' +
        '<div class="fp-abas" id="fp-abas" role="tablist" aria-label="Partes da ficha">' +
        abas.map(function (a) {
          var on = a.id === aberta;
          return '<button type="button" class="fp-aba" role="tab" id="fp-aba-' + a.id + '" data-aba="' + a.id + '"' +
            ' aria-controls="fp-painel-' + a.id + '" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '">' +
            '<span class="fp-aba-pag" aria-hidden="true">' + a.pag + '</span>' + esc(a.rotulo) + '</button>';
        }).join('') + '</div>' +
        abas.map(function (a) {
          return '<section class="fp-painel" role="tabpanel" id="fp-painel-' + a.id + '" data-aba="' + a.id + '"' +
            ' aria-labelledby="fp-aba-' + a.id + '" tabindex="0" aria-busy="true"' + (a.id === aberta ? '' : ' hidden') + '>' +
            '<p class="fp-nota">' + esc(CARREGANDO) + '</p></section>';
        }).join('');
    }

    function mensagemEstado(res) {
      if (!res) return '';
      if (res.estado === 'sem-ficha') return 'Não há ficha neste navegador. Crie ou importe uma na ficha atual (FICHA) e ela aparece aqui.';
      if (res.estado === 'erro') return 'A ficha deste navegador não pôde ser lida (' + str(res.erro) + (res.versao ? ' ' + str(res.versao) : '') + ').';
      if (res.estado === 'falha') return 'O motor falhou ao calcular: ' + str(res.erro);
      if (res.estado === 'sem-motor') return 'O motor da ficha (js/ficha.js) não carregou. Recarregue a página.';
      return '';
    }

    // topo; res null = carregando
    function htmlTopo(res) {
      var ok = !!res && res.estado === 'ok';
      var f = ok ? res.ficha : null;
      var meta = f && obj(f.meta) ? f.meta : {};
      var idt = f && obj(f.identidade) ? f.identidade : {};
      var nome = ok ? (semEmoji(meta.nome) || '(sem nome)') : !res ? CARREGANDO : res.estado === 'sem-ficha' ? '(sem ficha)' : 'Ficha';
      function ref(r) { return obj(r) && (r.id || r.nome) ? semEmoji(r.nome) || str(r.id) : ''; }
      function campo(rot, val) {
        return '<div class="fp-campo"><dt>' + esc(rot) + '</dt><dd>' + (val ? esc(val) : '<span class="fp-vazio">—</span>') + '</dd></div>';
      }
      var h = '<div class="fp-topo-linha">' +
        // seletor de ficha (D36): desabilitado até a virada, só com a ficha atual
        '<label class="fp-seletor"><span class="fp-rot">Ficha</span>' +
        '<select disabled title="Trocar de ficha chega com a virada da ficha nova">' +
        '<option selected>' + esc(ok ? nome + ' (ficha atual)' : 'Ficha atual') + '</option></select></label>' +
        '<p class="fp-ro" role="note"><span>' + esc(AVISO_RO) + '</span> ' +
        '<button type="button" class="kh-btn fp-abrir-v2">Abrir a ficha atual</button></p></div>' +
        '<h1 class="fp-nome">' + esc(nome) + '</h1>';
      if (ok) {
        h += '<dl class="fp-ident">' +
          campo('Raça', ref(idt.raca)) + campo('Classe', ref(idt.classe)) +
          campo('Nível', meta.nivel == null ? '' : str(meta.nivel)) + campo('Origem', ref(idt.origem)) + '</dl>';
      }
      var msg = mensagemEstado(res);
      if (msg) h += '<p class="fp-estado" role="status">' + esc(msg) + '</p>';
      var erros = res ? lista(res.erros) : [];
      if (erros.length) h += '<p class="fp-estado fp-estado-aviso">Não carregou: ' + erros.map(esc).join(', ') + '</p>';
      return h;
    }

    // a passada inteira: topo + um html por painel, com UMA instância do KhConta
    // (ids fp-d-1, fp-d-2… únicos na página toda)
    function render(res, D) {
      var ok = !!res && res.estado === 'ok';
      var C = ok && KhConta ? KhConta.criar({ D: D || (KhRegras ? KhRegras.dados() : {}), nos: res.av ? res.av.nos : null,
        prefixo: PREFIXO, esc: esc, fmt: KhRegras ? KhRegras.fmt : undefined, semEmoji: semEmoji }) : null;
      var paineis = {};
      ABAS.forEach(function (a) {
        var corpo;
        if (!ok) corpo = '<p class="fp-nota">' + esc(mensagemEstado(res) || CARREGANDO) + '</p>';
        else if (typeof RENDER[a.id] === 'function') corpo = RENDER[a.id](res, C);
        else corpo = '<p class="fp-nota">' + esc(EM_CONSTRUCAO) + '</p>';
        paineis[a.id] = corpo;
      });
      return { topo: htmlTopo(res), paineis: paineis, caminhos: C ? C.caminhos : [] };
    }

    // ---------------- página (navegador) ----------------
    function iniciar(win) {
      if (!win || !win.document) return false;
      var doc = win.document;
      // o script vem no fim do <body>: o #fp já existe e a casca entra antes do
      // primeiro desenho; sem ele (carregado fora de ordem), espera o DOM
      if (doc.getElementById('fp')) return montar(win);
      if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', function () { montar(win); });
        return true;
      }
      return false;
    }

    function montar(win) {
      var doc = win.document;
      var raizEl = doc.getElementById('fp');
      if (!raizEl || raizEl.getAttribute('data-fp') != null) return false;
      var ls = null, search = '';
      try { ls = win.localStorage; } catch (e) { ls = null; }
      try { search = win.location ? win.location.search : ''; } catch (e) { search = ''; }
      if (!ativa(search, ls)) {
        raizEl.setAttribute('data-fp', 'aviso');
        raizEl.innerHTML = htmlAviso();
        return false;
      }
      raizEl.setAttribute('data-fp', 'casca');
      var aberta = ordemAbas()[0].id;
      raizEl.innerHTML = htmlCasca(aberta);

      function el(id) { return doc.getElementById(id); }
      function seleciona(id, foco) {
        if (!ABAS.some(function (a) { return a.id === id; })) return;
        aberta = id;
        ABAS.forEach(function (a) {
          var on = a.id === id, t = el('fp-aba-' + a.id), p = el('fp-painel-' + a.id);
          if (t) { t.setAttribute('aria-selected', on ? 'true' : 'false'); t.setAttribute('tabindex', on ? '0' : '-1'); }
          if (p) p.hidden = !on;
          if (on && foco && t && t.focus) t.focus();
        });
      }
      function abaDe(alvo) {
        var t = alvo && alvo.closest ? alvo.closest('[role="tab"]') : null;
        return t && t.getAttribute('data-aba');
      }

      raizEl.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.closest && t.closest('.fp-abrir-v2')) {
          if (win.KF && typeof win.KF.abrir === 'function') win.KF.abrir();
          return;
        }
        var id = abaDe(t);
        if (id) seleciona(id, false);
      });
      // teclado da lista de abas (padrão ARIA de abas, no próprio widget, como as
      // linhas de filtro do Bazar): setas, Home e End, com ativação automática.
      // Alt+setas para mover a aba (F4.5) vão pelo KhTeclas, que hoje recusa
      // Alt (chaveDe devolve '') e terá de ganhar esse acorde na F4.5.
      var tablist = el('fp-abas');
      if (tablist) tablist.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        var k = e.key;
        if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End') return;
        var id = abaDe(e.target);
        if (!id) return;
        var abas = ordemAbas(), i = -1;
        abas.forEach(function (a, j) { if (a.id === id) i = j; });
        var j = k === 'Home' ? 0 : k === 'End' ? abas.length - 1
          : (i + (k === 'ArrowRight' ? 1 : -1) + abas.length) % abas.length;
        e.preventDefault();
        seleciona(abas[j].id, true);
      });

      if (!KhPrevia || !KhRegras || !KhConta || typeof win.fetch !== 'function') {
        pinta({ estado: 'sem-motor', erros: [] });
        return true;
      }
      var s = doc.querySelector('script[src*="js/ficha.js"]');
      var src = s ? s.src : '';
      var base = '', versao = '';
      try { base = src ? new URL('../', src).href : ''; versao = src ? new URL(src).search : ''; } catch (e) { /* relativo à página */ }

      var dados = null, t = null;
      function pinta(r0) {
        var r = render(r0);
        var topo = el('fp-topo');
        if (topo) topo.innerHTML = r.topo;
        ABAS.forEach(function (a) {
          var p = el('fp-painel-' + a.id);
          if (!p) return;
          p.innerHTML = r.paineis[a.id];
          p.removeAttribute('aria-busy');
        });
      }
      function desenha() { if (dados) pinta(KhPrevia.calcular(ls, dados, versao)); }
      // a ficha atual (v2) é editada no drawer desta mesma página ou em outra aba:
      // redesenha 350 ms depois (o drawer grava com debounce de 200 ms)
      function agenda() { clearTimeout(t); t = setTimeout(desenha, 350); }
      doc.addEventListener('kf:mudou', agenda);
      doc.addEventListener('input', function (e) { if (e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }, true);
      doc.addEventListener('change', function (e) { if (e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }, true);
      win.addEventListener('storage', function (e) { if (e && e.key === CHAVE_V2) agenda(); });

      KhPrevia.carregar(win.fetch.bind(win), base, versao).then(function (d) {
        dados = d;
        desenha();
      }, function (e) {
        pinta({ estado: 'falha', erro: str(e && e.message), erros: [] });
      });
      return true;
    }

    return { CHAVE_PREVIA: CHAVE_PREVIA, AVISO: AVISO, AVISO_RO: AVISO_RO, PREFIXO: PREFIXO,
      ABAS: ABAS.map(function (a) { return { id: a.id, pag: a.pag, rotulo: a.rotulo }; }), RENDER: RENDER,
      ativa: ativa, ordemAbas: ordemAbas, htmlAviso: htmlAviso, htmlCasca: htmlCasca, htmlTopo: htmlTopo,
      render: render, iniciar: iniciar };
  })();

  if (emNode) { module.exports = FichaPagina; return; }
  raiz.KhFichaPagina = FichaPagina;
  try { FichaPagina.iniciar(raiz); } catch (e) { /* a página nunca derruba o resto (nav, ficha atual) */ }
})(typeof window !== 'undefined' ? window : this);
