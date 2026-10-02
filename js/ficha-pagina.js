/* Khalkaria — página da ficha nova (F4.3, pages/ficha.html), SOMENTE LEITURA.
 *
 * Espelha a ficha física A4 em 5 abas (docs/ficha-digital/05-f4-pagina.md,
 * 03 §4). Lê a ficha v2 (khalkaria_ficha) pelo KhEstado.sombra e calcula pelo
 * motor v3, pelo mesmo caminho da prévia: KhPrevia.carregar (catálogo, classes,
 * raças, efeitos, glifos) e KhPrevia.calcular (sombra -> avaliar). Cada número
 * calculado sai com a conta (KhConta, prefixo 'fp', para não colidir com os ids
 * kf3- da prévia, que pode estar aberta na mesma página). Número que é ESTADO
 * da ficha (atual de recurso, Sins, XP, quantidade…) não é conta: vai num
 * span.fp-n[data-ficha="<caminho na ficha v3>"].
 *
 * Escondida até a virada (03 §9): sem a prévia (localStorage
 * khalkaria_ficha_previa === '1' ou ?ficha=v3, a mesma regra do
 * partials/head-boot.html), mostra só o AVISO e não pede catálogo nenhum.
 * Não grava NENHUMA chave de ficha: as únicas escritas desta página são as
 * preferências de aba da F4.5, pelo KhAbas: a ordem (localStorage
 * khalkaria_ficha_abas, só quando o jogador move uma aba) e a aba aberta
 * (sessionStorage khalkaria_ficha_aba, só quando ele troca de aba).
 *
 * F4.3a: topo (seletor de ficha desabilitado, nome, raça, classe, nível,
 * origem e o aviso de só-leitura com o botão que abre a ficha atual pela
 * KF.abrir()), a lista das 5 abas (role=tablist) e os 5 painéis.
 * F4.5: a lista é do KhAbas (js/ficha/kh-abas.js, no bundle, porque o drawer
 * da F4.4 usa o mesmo): clique, setas, Home e End trocam de aba (tabindex
 * móvel); Alt+← e Alt+→ (KhTeclas, só com a aba focada pelo teclado) e o
 * arrasto movem a aba; o botão "Ordem do
 * A4" restaura. A casca já sai na ordem guardada e com a aba da sessão aberta.
 * F4.3b + F4.4a: o desenho das 5 abas é do KhFichaAbas (js/ficha/kh-ficha-abas.js,
 * no bundle, porque o drawer da F4.4 desenha o mesmo, sem cópia), numa
 * instância com o prefixo 'fp' e a densidade 'pagina'. RENDER[id da aba](res,
 * C, ctx) é o desenhista dessa instância (exposto aqui para os testes).
 *   1 Núcleo · 2 Técnicas & Marcas · 3 Cartas, Lore & Outros · 4 O Bazar · 5 Grimório
 * Redesenho (kf:mudou, drawer, storage) por trocaHTML: só troca o contêiner que
 * mudou e devolve foco, <details> aberto e dica sob o mouse ao equivalente novo.
 * A dica da conta é presa à caixa da página por encaixa() ao abrir (hover/foco).
 * Os avisos são os da prévia (KhPrevia.listaAvisos, fonte única).
 *
 * No node (tools/testes/ficha-pagina.test.js) exporta por module.exports e
 * carrega os módulos de js/ficha/ direto; no navegador usa os do js/ficha.js,
 * carregado antes, síncrono (templates/ficha.template.html). Sem o js/ficha.js
 * (falha de rede), não há abas nem motor: a página só dá o recado.
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  var KhPrevia = emNode ? require('./ficha/kh-previa.js') : raiz.KhPrevia;
  var KhRegras = emNode ? require('./ficha/kh-regras.js') : raiz.KhRegras;
  var KhConta = emNode ? require('./ficha/kh-conta.js') : raiz.KhConta;
  var KhAbas = emNode ? require('./ficha/kh-abas.js') : raiz.KhAbas;
  var KhFichaAbas = emNode ? require('./ficha/kh-ficha-abas.js') : raiz.KhFichaAbas;

  var FichaPagina = (function () {
    var CHAVE_PREVIA = 'khalkaria_ficha_previa';
    var CHAVE_V2 = 'khalkaria_ficha';
    var PREFIXO = 'fp';
    // o mesmo texto do templates/ficha.template.html (o teste confere)
    var AVISO = 'A ficha nova está em preparação. Por enquanto, use a ficha atual, no botão FICHA da lateral.';
    var AVISO_RO = 'Ficha nova em prévia: só leitura. Para editar, use a ficha atual (FICHA).';
    // só sem o js/ficha.js (o mesmo texto do KhFichaAbas.mensagemEstado, que aí não existe)
    var SEM_MOTOR = 'O motor da ficha (js/ficha.js) não carregou. Recarregue a página.';
    var RESTAURADA = 'Ordem do A4 restaurada.';
    // como mudar a ordem: dica no botão de cada aba (title vira a descrição acessível)
    // o Alt+seta só move com a aba focada pelo teclado (depois de um clique, o
    // Alt+← é o Voltar do navegador): a dica diz como chegar lá
    var DICA_ORDEM = 'Arraste para mudar a ordem das abas. Pelo teclado: Tab até a aba e Alt+← ou Alt+→';
    var TITULO_A4 = 'Ordem do A4: volta as abas à ordem da ficha física';
    // seta de voltar (traço em currentColor, sem emoji)
    var SVG_A4 = '<svg class="fp-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M5.6 9.2A7.4 7.4 0 1 1 4.6 13.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '<path d="M4.4 4.6v4.8h4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // o desenho das abas: uma instância do KhFichaAbas com o prefixo da página.
    // As 5 abas (KhFichaAbas.ABAS) vêm na ordem da ficha física (pág. 1 a 5 do
    // A4); o id é estável: a F4.5 guarda a ordem por id (khalkaria_ficha_abas),
    // e o drawer da F4.4 usa os mesmos.
    var M = KhFichaAbas || null;
    var DESENHO = M ? M.criar({ prefixo: PREFIXO, densidade: 'pagina' }) : null;
    var ABAS = M ? M.ABAS : [];
    var RENDER = DESENHO ? DESENHO.RENDER : {};
    var CARREGANDO = M ? M.CARREGANDO : '';
    // a mensagem de cada estado do cálculo e o nome de uma referência (raça,
    // classe, origem): as mesmas do desenho das abas
    var mensagemEstado = M ? M.mensagemEstado : function () { return SEM_MOTOR; };
    var refNome = M ? M.refNome : function () { return ''; };

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

    // ---------------- ordem das abas (F4.5): a do navegador, pelo KhAbas ----------------
    function idsAbas() { return ABAS.map(function (a) { return a.id; }); }
    function abaPorId(id) { return ABAS.filter(function (a) { return a.id === id; })[0]; }
    // as ABAS na ordem guardada neste navegador (ls = localStorage); sem storage
    // ou sem preferência, a do A4
    function ordemAbas(ls) {
      var ids = idsAbas();
      return (KhAbas && ls ? KhAbas.lerOrdem(ls, ids) : ids).map(abaPorId);
    }

    // ---------------- html (puro: string) ----------------
    function htmlAviso() {
      return '<h1 class="fp-titulo">Ficha</h1><p class="fp-aviso" data-sem-previa>' + esc(AVISO) + '</p>';
    }
    // sem o js/ficha.js: nem abas nem motor, só o recado
    function htmlSemMotor() {
      return '<h1 class="fp-titulo">Ficha</h1><p class="fp-estado" role="status">' + esc(SEM_MOTOR) + '</p>';
    }

    // a casca: topo (preenchido por htmlTopo), lista de abas (na ordem dada, uma
    // lista de ids; sem ela, a do A4) com o "Ordem do A4", painéis e o sprite g-*
    function htmlCasca(aberta, ordem) {
      var ids = idsAbas();
      var o = KhAbas ? KhAbas.normaliza(ordem, ids) : ids;
      var abas = o.map(abaPorId);
      var padrao = o.join(' ') === ids.join(' ');
      aberta = abas.some(function (a) { return a.id === aberta; }) ? aberta : abas[0].id;
      return '<header class="fp-topo" id="fp-topo">' + htmlTopo(null) + '</header>' +
        '<div class="fp-abas-barra">' +
        '<div class="fp-abas" id="fp-abas" role="tablist" aria-label="Partes da ficha">' +
        abas.map(function (a) {
          var on = a.id === aberta;
          return '<button type="button" class="fp-aba" role="tab" id="fp-aba-' + a.id + '" data-aba="' + a.id + '"' +
            ' aria-controls="fp-painel-' + a.id + '" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '"' +
            ' aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight" title="' + esc(DICA_ORDEM) + '">' +
            '<span class="fp-aba-pag" aria-hidden="true">' + a.pag + '</span>' + esc(a.rotulo) + '</button>';
        }).join('') + '</div>' +
        // "Ordem do A4": só com a ordem fora da do A4 (o KhAbas mostra e esconde).
        // Botão de ícone, com o nome no aria-label e no title: com texto, ele
        // tomava a largura da lista e, a 1280px, a última aba descia de linha.
        '<button type="button" class="kh-btn fp-abas-a4" id="fp-abas-a4"' + (padrao ? ' hidden' : '') +
        ' aria-label="Ordem do A4" title="' + esc(TITULO_A4) + '">' + SVG_A4 + '</button>' +
        // o que mudou de lugar, para o leitor de tela
        '<span class="fp-sr" id="fp-abas-anuncio" role="status" aria-live="polite"></span>' +
        '</div>' +
        abas.map(function (a) {
          return '<section class="fp-painel" role="tabpanel" id="fp-painel-' + a.id + '" data-aba="' + a.id + '"' +
            ' aria-labelledby="fp-aba-' + a.id + '" tabindex="0" aria-busy="true"' + (a.id === aberta ? '' : ' hidden') + '>' +
            '<p class="fp-nota">' + esc(CARREGANDO) + '</p></section>';
        }).join('') +
        // o sprite partials/glifos.html (moldura de raízes, ramos, selo), posto ao carregar
        '<div class="fp-sprite" id="fp-sprite" aria-hidden="true"></div>';
    }

    // topo; res null = carregando
    function htmlTopo(res) {
      var ok = !!res && res.estado === 'ok';
      var f = ok ? res.ficha : null;
      var meta = f && obj(f.meta) ? f.meta : {};
      var idt = f && obj(f.identidade) ? f.identidade : {};
      var nome = ok ? (semEmoji(meta.nome) || '(sem nome)') : !res ? CARREGANDO : res.estado === 'sem-ficha' ? '(sem ficha)' : 'Ficha';
      function campo(rot, val) {
        return '<div class="fp-campo"><dt>' + esc(rot) + '</dt><dd>' + (val ? esc(val) : '<span class="fp-vazio">—</span>') + '</dd></div>';
      }
      var h = '<div class="fp-topo-linha">' +
        // seletor de ficha (D36): desabilitado até a virada, só com a ficha atual
        '<label class="fp-seletor"><span class="fp-rot">Ficha</span>' +
        '<select disabled title="Trocar de ficha chega com a virada da ficha nova">' +
        '<option selected>' + esc(ok ? nome + ' (ficha atual)' : 'Ficha atual') + '</option></select></label>' +
        '<p class="fp-ro" role="note"><span>' + esc(AVISO_RO) + '</span> ' +
        '<button type="button" class="kh-btn fp-abrir-v2">Abrir a ficha atual</button> ' +
        '<button type="button" class="kh-btn fp-sair-previa">Sair da prévia</button></p></div>' +
        '<h1 class="fp-nome">' + esc(nome) + '</h1>';
      if (ok) {
        h += '<dl class="fp-ident">' +
          campo('Raça', refNome(idt.raca)) + campo('Classe', refNome(idt.classe)) +
          campo('Nível', meta.nivel == null ? '' : str(meta.nivel)) + campo('Origem', refNome(idt.origem)) + '</dl>';
      }
      var msg = mensagemEstado(res);
      if (msg) h += '<p class="fp-estado" role="status">' + esc(msg) + '</p>';
      var erros = res ? lista(res.erros) : [];
      if (erros.length) h += '<p class="fp-estado fp-estado-aviso">Não carregou: ' + erros.map(esc).join(', ') + '</p>';
      return h;
    }

    // a passada inteira: topo + um html por painel. Os painéis são do
    // KhFichaAbas (uma instância do KhConta por passada: ids fp-d-1, fp-d-2…
    // únicos na página toda).
    // op: {dados (o do KhPrevia.carregar), D (KhRegras.dados()), base (raiz do site, para images/)}
    function render(res, op) {
      var r = DESENHO.paineis(res, op);
      return { topo: htmlTopo(res), paineis: r.paineis, caminhos: r.caminhos };
    }


    // ---------------- a dica da conta dentro da página ----------------
    // A dica nasce centrada sob o número (css: translateX(-50%) mais --fp-dx).
    // Ao abrir (hover ou foco), o JS a mede e a empurra para dentro da caixa da
    // página (#fp, que fica à direita da nav fixa e à esquerda da calha da aba
    // FICHA): nunca passa da janela (sem rolagem horizontal) nem fica embaixo da
    // nav. Sem espaço embaixo e com espaço em cima, abre para cima.
    // Puro: r = retângulo da dica sem deslocamento; lim = {min, max} em x.
    var MARGEM_DICA = 8;
    function encaixeDica(r, lim) {
      var dx = 0;
      if (r.right > lim.max) dx = lim.max - r.right;
      if (r.left + dx < lim.min) dx = lim.min - r.left;
      return Math.round(dx);
    }
    // a dica de uma conta (.kh-conta) aberta agora; false se ainda está fechada
    function encaixa(conta, caixa, win) {
      var d = conta && conta.querySelector ? conta.querySelector('.kh-conta-dica') : null;
      if (!d || !d.getBoundingClientRect || !caixa) return false;
      d.style.removeProperty('--fp-dx');
      d.style.removeProperty('max-width');
      conta.removeAttribute('data-dica-acima');
      var r = d.getBoundingClientRect();
      if (!r.width) return false;
      var c = caixa.getBoundingClientRect();
      var lim = { min: c.left + MARGEM_DICA, max: c.right - MARGEM_DICA };
      if (r.width > lim.max - lim.min) {
        d.style.maxWidth = Math.max(0, Math.floor(lim.max - lim.min)) + 'px';
        r = d.getBoundingClientRect();
      }
      var dx = encaixeDica(r, lim);
      if (dx) d.style.setProperty('--fp-dx', dx + 'px');
      var alto = win && win.innerHeight, rc = conta.getBoundingClientRect();
      if (alto && r.bottom > alto - MARGEM_DICA && rc.top - 6 - r.height >= MARGEM_DICA) conta.setAttribute('data-dica-acima', '');
      return true;
    }

    // ---------------- redesenho sem perder o lugar ----------------
    // A página redesenha o topo e os painéis a cada mudança da ficha (kf:mudou,
    // campo do drawer, storage de outra aba). Antes de trocar o HTML de um
    // contêiner, guarda o que o jogador tinha nele: o elemento com o foco (pela
    // chave: o data-caminho da conta, ou o data-campo, ou a tag e a classe, mais
    // a ordem entre os de mesma chave), os <details> abertos e a conta sob o
    // mouse. Depois de trocar, devolve o foco ao equivalente (sem rolar; se ele
    // sumiu, à reserva), reabre os <details> e deixa a dica aberta até o mouse
    // se mexer. Contêiner cujo HTML não mudou não é tocado.
    var FOCAVEIS = 'a[href], button, summary, select, input, textarea, [tabindex]';
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function qsa(cont, sel) { return cont && cont.querySelectorAll ? arr(cont.querySelectorAll(sel)) : []; }
    function chaveUI(el) {
      var c = el.getAttribute('data-caminho');
      if (c != null) return 'c:' + c;
      c = el.getAttribute('data-campo');
      if (c != null) return el.tagName + ':' + c;
      return el.tagName + '.' + str(el.getAttribute('class'));
    }
    // {chave, ordem} de el entre os elementos de mesma chave da lista
    function marcaUI(l, el) {
      if (!el) return null;
      var k = chaveUI(el), n = 0;
      for (var i = 0; i < l.length; i++) {
        if (l[i] === el) return { chave: k, ordem: n };
        if (chaveUI(l[i]) === k) n++;
      }
      return null;
    }
    // o equivalente na lista nova (se agora há menos dessa chave, o último)
    function achaUI(l, m) {
      if (!m) return null;
      var ult = null, n = 0;
      for (var i = 0; i < l.length; i++) {
        if (chaveUI(l[i]) !== m.chave) continue;
        if (n++ === m.ordem) return l[i];
        ult = l[i];
      }
      return ult;
    }
    function casa(el, sel) { try { return !!el.matches(sel); } catch (e) { return false; } }
    function foca(el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
    // troca o HTML de cont preservando foco, <details> abertos e a dica sob o
    // mouse; reserva = quem recebe o foco se o elemento focado sumiu. true se trocou.
    function trocaHTML(doc, cont, html, reserva, caixa, win) {
      if (!cont || cont._fpHtml === html) return false;
      var ativo = doc.activeElement;
      var dentro = !!ativo && ativo !== cont && !!cont.contains && cont.contains(ativo);
      var foco = dentro ? marcaUI(qsa(cont, FOCAVEIS), ativo) : null;
      var visivel = dentro && (casa(ativo, ':focus-visible') || ativo.hasAttribute('data-fp-foco'));
      var dets = qsa(cont, 'details');
      var abertos = dets.filter(function (d) { return d.open; }).map(function (d) { return marcaUI(dets, d); });
      var contas = qsa(cont, '.kh-conta');
      var sob = null;
      contas.some(function (c) { if (casa(c, ':hover') || c.hasAttribute('data-fp-dica')) { sob = marcaUI(contas, c); } return !!sob; });

      cont.innerHTML = html;
      cont._fpHtml = html;

      dets = qsa(cont, 'details');
      abertos.forEach(function (m) { var d = achaUI(dets, m); if (d) d.open = true; });
      if (sob) {
        var s = achaUI(qsa(cont, '.kh-conta'), sob);
        if (s) {
          s.setAttribute('data-fp-dica', '');
          if (caixa) caixa._fpDica = true;   // o próximo movimento do mouse a solta (montar)
          encaixa(s, caixa, win);
        }
      }
      if (dentro) {
        var el = foco ? achaUI(qsa(cont, FOCAVEIS), foco) : null;
        if (!el) el = reserva || (cont.hasAttribute('tabindex') ? cont : null);
        if (el && el.focus) {
          foca(el);
          // o foco por teclado segue visível (contorno e dica) no elemento novo
          if (visivel && !casa(el, ':focus-visible')) el.setAttribute('data-fp-foco', '');
          if (el.getAttribute('data-caminho') != null) encaixa(el, caixa, win);
        }
      }
      return true;
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
      if (!DESENHO) {
        // sem o js/ficha.js (falha de rede): nem abas nem motor, só o recado
        raizEl.setAttribute('data-fp', 'sem-motor');
        raizEl.innerHTML = htmlSemMotor();
        return false;
      }
      raizEl.setAttribute('data-fp', 'casca');
      var ss = null;
      try { ss = win.sessionStorage; } catch (e) { ss = null; }
      // a ordem do navegador e a aba aberta nesta sessão (a 1ª da ordem, sem ela)
      var ids = idsAbas();
      var ordem = KhAbas ? KhAbas.lerOrdem(ls, ids) : ids;
      var aberta = (KhAbas && KhAbas.lerAberta(ss, ids)) || ordem[0];
      raizEl.innerHTML = htmlCasca(aberta, ordem);

      function el(id) { return doc.getElementById(id); }

      raizEl.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.closest && t.closest('.fp-abrir-v2')) {
          if (win.KF && typeof win.KF.abrir === 'function') win.KF.abrir();
        }
        // o painel da prévia não abre aqui, então a saída fica na própria página:
        // apaga a chave da prévia e recarrega sem ?ficha=v3 (volta ao aviso)
        if (t && t.closest && t.closest('.fp-sair-previa')) {
          try { if (ls) ls.removeItem('khalkaria_ficha_previa'); } catch (err) { /* storage bloqueado */ }
          try { if (ss) ss.removeItem('khalkaria_ficha_previa_recolhida'); } catch (err) { /* idem */ }
          if (win.location && typeof win.location.replace === 'function') win.location.replace(win.location.pathname);
        }
      });
      // a lista de abas é do KhAbas (F4.5): clique, setas, Home, End, Alt+setas
      // (KhTeclas), arrasto, "Ordem do A4", e as duas preferências no storage
      var rotulos = {};
      ABAS.forEach(function (a) { rotulos[a.id] = a.rotulo; });
      if (KhAbas) {
        KhAbas.criar(el('fp-abas'), { win: win, doc: doc, ids: ids, ls: ls, ss: ss, aberta: aberta, rotulos: rotulos,
          restaurar: el('fp-abas-a4'), anuncio: el('fp-abas-anuncio'), textoRestaurada: RESTAURADA,
          aoSelecionar: function (id) { aberta = id; } });
      }

      // a dica da conta, ao abrir (hover ou foco), fica dentro da caixa da página
      function aoAbrirDica(e) {
        var c = e.target && e.target.closest ? e.target.closest('.kh-conta') : null;
        if (!c) return;
        if (e.type === 'mouseover' && e.relatedTarget && c.contains && c.contains(e.relatedTarget)) return;
        // fechada ainda (o :hover/:focus-visible entra no quadro seguinte): mede de novo
        if (!encaixa(c, raizEl, win) && win.requestAnimationFrame) win.requestAnimationFrame(function () { encaixa(c, raizEl, win); });
      }
      raizEl.addEventListener('mouseover', aoAbrirDica);
      raizEl.addEventListener('focusin', aoAbrirDica);
      // as marcas do redesenho (trocaHTML) valem até o jogador agir: o foco sai, o mouse mexe
      raizEl.addEventListener('focusout', function (e) {
        if (e.target && e.target.removeAttribute) e.target.removeAttribute('data-fp-foco');
      });
      doc.addEventListener('mousemove', function () {
        if (!raizEl._fpDica) return;
        raizEl._fpDica = false;
        qsa(raizEl, '[data-fp-dica]').forEach(function (x) { x.removeAttribute('data-fp-dica'); });
      }, { passive: true });

      if (!KhPrevia || !KhRegras || !KhConta || typeof win.fetch !== 'function') {
        pinta({ estado: 'sem-motor', erros: [] });
        return true;
      }
      var s = doc.querySelector('script[src*="js/ficha.js"]');
      var src = s ? s.src : '';
      var base = '', versao = '';
      try { base = src ? new URL('../', src).href : ''; versao = src ? new URL(src).search : ''; } catch (e) { /* relativo à página */ }

      var dados = null, t = null;
      // redesenha sem perder o lugar do jogador (trocaHTML): foco, <details>, dica
      function pinta(r0) {
        var r = render(r0, { dados: dados, base: base || '../' });
        trocaHTML(doc, el('fp-topo'), r.topo, el('fp-aba-' + aberta), raizEl, win);
        ABAS.forEach(function (a) {
          var p = el('fp-painel-' + a.id);
          if (!p) return;
          trocaHTML(doc, p, r.paineis[a.id], p, raizEl, win);
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
        // o sprite g-* (moldura de raízes, ramos, selo) entra uma vez, antes do desenho
        var sp = el('fp-sprite');
        if (sp && d && d.glifos) sp.innerHTML = d.glifos;
        desenha();
      }, function (e) {
        pinta({ estado: 'falha', erro: str(e && e.message), erros: [] });
      });
      return true;
    }

    return { CHAVE_PREVIA: CHAVE_PREVIA, AVISO: AVISO, AVISO_RO: AVISO_RO, PREFIXO: PREFIXO,
      ABAS: ABAS.map(function (a) { return { id: a.id, pag: a.pag, rotulo: a.rotulo }; }), RENDER: RENDER,
      ativa: ativa, ordemAbas: ordemAbas, htmlAviso: htmlAviso, htmlSemMotor: htmlSemMotor, htmlCasca: htmlCasca, htmlTopo: htmlTopo,
      // o desenho das abas (KhFichaAbas): a instância da página e as puras do módulo
      desenho: DESENHO, MOLDURAS: M ? M.MOLDURAS : {}, contexto: M ? M.contexto : null, resolver: M ? M.resolver : null,
      textoRico: M ? M.textoRico : null, render: render,
      encaixeDica: encaixeDica, encaixa: encaixa, trocaHTML: trocaHTML, FOCAVEIS: FOCAVEIS, iniciar: iniciar };
  })();

  if (emNode) { module.exports = FichaPagina; return; }
  raiz.KhFichaPagina = FichaPagina;
  try { FichaPagina.iniciar(raiz); } catch (e) { /* a página nunca derruba o resto (nav, ficha atual) */ }
})(typeof window !== 'undefined' ? window : this);
