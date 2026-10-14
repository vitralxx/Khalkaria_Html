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
 * Os dois são do KhRedesenho (js/ficha/kh-redesenho.js, no bundle desde a
 * F4.4b, porque o drawer da ficha nova faz o mesmo), com o prefixo 'fp'.
 * Com a prévia, o drawer da ficha nova (KhFichaDrawer) NÃO monta nesta página.
 * Os avisos são os da prévia (KhPrevia.listaAvisos, fonte única).
 * F4.6a (07 §1 e §2): o modo Ensaio. O topo ganha "Ensaiar edição"
 * (data-ke="entrar"); ligado (KhEnsaio.ligado), a página lê e calcula a ficha
 * ativa do ensaio (KhEnsaio.calcular, sessionStorage com o prefixo
 * khalkaria_ensaio:), o topo perde o seletor desabilitado e o seletor de
 * fichas do ensaio (KhSeletor, #fp-ke) aparece acima dele; a faixa fixa é do
 * KhSeletor.ligarFaixa. Redesenha no evento kh:ensaio. Sem o Ensaio, tudo como
 * antes (o render sem o.ensaio é o do ouro). "Sair da prévia" apaga também o
 * que sobrou do Ensaio desta aba; com ele ligado (só numa página velha do
 * bfcache o botão aparece), não apaga: KhSeletor.bloqueiaSaidaPrevia acerta a
 * página e abre a confirmação da faixa. O Ensaio nunca grava chave de ficha:
 * só o prefixo dele.
 * F4.6b (07 §3): com o Ensaio ligado, as abas saem com os campos de estado
 * editáveis (KhFichaAbas, {editar:'pagina'}) e o KhEditor (#fp-ked, acima do
 * topo, criado na 1ª vez que o Ensaio liga) grava cada mudança no armazém do
 * ensaio, com Desfazer e Refazer (Ctrl+Z e Ctrl+Y), o pop-over "Ajustar" e a
 * tela "Ajustes". Sem o Ensaio, só leitura, como antes (o ouro).
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
  var KhEnsaio = emNode ? require('./ficha/kh-ensaio.js') : raiz.KhEnsaio;
  var KhSeletor = emNode ? require('./ficha/kh-seletor.js') : raiz.KhSeletor;
  var KhEditor = emNode ? require('./ficha/kh-editor.js') : raiz.KhEditor;

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
    // o modo Ensaio (F4.6a, 07 §1): o botão de entrar, no aviso de só-leitura do topo
    var ENSAIAR = 'Ensaiar edição';
    var DICA_ENSAIAR = 'Liga o modo Ensaio nesta aba: as fichas do ensaio ficam só nela e a sua ficha não muda';
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

    // a casca: o lugar do seletor de fichas do Ensaio (#fp-ke, escondido fora
    // dele: KhSeletor), topo (preenchido por htmlTopo; opTopo é o dele), lista
    // de abas (na ordem dada, uma lista de ids; sem ela, a do A4) com o "Ordem
    // do A4", painéis e o sprite g-*
    function htmlCasca(aberta, ordem, opTopo) {
      var ids = idsAbas();
      var o = KhAbas ? KhAbas.normaliza(ordem, ids) : ids;
      var abas = o.map(abaPorId);
      var padrao = o.join(' ') === ids.join(' ');
      aberta = abas.some(function (a) { return a.id === aberta; }) ? aberta : abas[0].id;
      return '<div class="fp-ke" id="fp-ke" hidden></div>' +
        '<header class="fp-topo" id="fp-topo">' + htmlTopo(null, opTopo) + '</header>' +
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

    // topo; res null = carregando. o.ensaio (F4.6a): sem ele, o topo de antes
    // (o ouro); false = com a prévia e o Ensaio desligado (o de antes mais o botão
    // "Ensaiar edição"); true = Ensaio ligado (sem o seletor desabilitado nem o
    // aviso de só-leitura: o seletor de fichas do ensaio fica no #fp-ke)
    function htmlTopo(res, o) {
      var ensaio = obj(o) && typeof o.ensaio === 'boolean' ? o.ensaio : null;
      var ok = !!res && res.estado === 'ok';
      var f = ok ? res.ficha : null;
      var meta = f && obj(f.meta) ? f.meta : {};
      var idt = f && obj(f.identidade) ? f.identidade : {};
      var nome = ok ? (semEmoji(meta.nome) || '(sem nome)') : !res ? CARREGANDO : res.estado === 'sem-ficha' ? '(sem ficha)' : 'Ficha';
      function campo(rot, val) {
        return '<div class="fp-campo"><dt>' + esc(rot) + '</dt><dd>' + (val ? esc(val) : '<span class="fp-vazio">—</span>') + '</dd></div>';
      }
      var h = ensaio === true ? '' : '<div class="fp-topo-linha">' +
        // seletor de ficha (D36): desabilitado até a virada, só com a ficha atual
        '<label class="fp-seletor"><span class="fp-rot">Ficha</span>' +
        '<select disabled title="Trocar de ficha chega com a virada da ficha nova">' +
        '<option selected>' + esc(ok ? nome + ' (ficha atual)' : 'Ficha atual') + '</option></select></label>' +
        '<p class="fp-ro" role="note"><span>' + esc(AVISO_RO) + '</span> ' +
        '<button type="button" class="kh-btn fp-abrir-v2">Abrir a ficha atual</button> ' +
        '<button type="button" class="kh-btn fp-sair-previa">Sair da prévia</button>' +
        (ensaio === false ? ' <button type="button" class="kh-btn fp-ensaiar" data-ke="entrar" title="' + esc(DICA_ENSAIAR) + '">' + esc(ENSAIAR) + '</button>' : '') +
        '</p></div>';
      h += '<h1 class="fp-nome">' + esc(nome) + '</h1>';
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
    // op: {dados (o do KhPrevia.carregar), D (KhRegras.dados()), base (raiz do site, para images/),
    //      ensaio (F4.6a: o do htmlTopo; sem ele, o topo de antes)}
    function render(res, op) {
      var r = DESENHO.paineis(res, op);
      var ensaio = obj(op) && typeof op.ensaio === 'boolean' ? { ensaio: op.ensaio } : undefined;
      return { topo: htmlTopo(res, ensaio), paineis: r.paineis, caminhos: r.caminhos };
    }


    // ---------------- a dica da conta e o redesenho: do KhRedesenho ----------------
    // A dica nasce centrada sob o número e, ao abrir (hover ou foco), é posta
    // dentro da caixa da página (#fp, à direita da nav fixa e à esquerda da
    // calha da aba FICHA) e da janela: o lado (embaixo ou em cima) sai dos
    // limites da caixa à vista (07 §0, item 2). O redesenho (kf:mudou, drawer, storage) troca só o
    // contêiner que mudou e devolve foco, <details> aberto e dica sob o mouse ao
    // equivalente novo. Os dois moram no bundle (js/ficha/kh-redesenho.js), porque
    // o drawer da ficha nova (F4.4) faz o mesmo; aqui, com o prefixo da página
    // (--fp-dx, data-fp-foco, data-fp-dica).
    var KhRedesenho = emNode ? require('./ficha/kh-redesenho.js') : raiz.KhRedesenho;
    var REDESENHO = KhRedesenho ? KhRedesenho.criar({ prefixo: PREFIXO }) : null;
    var FOCAVEIS = KhRedesenho ? KhRedesenho.FOCAVEIS : '';
    function encaixeDica(r, lim) { return KhRedesenho.encaixeDica(r, lim); }
    function encaixa(conta, caixa, win) { return REDESENHO ? REDESENHO.encaixa(conta, caixa, win) : false; }
    function trocaHTML(doc, cont, html, reserva, caixa, win) {
      return REDESENHO ? REDESENHO.trocaHTML(doc, cont, html, reserva, caixa, win) : false;
    }
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function qsa(cont, sel) { return cont && cont.querySelectorAll ? arr(cont.querySelectorAll(sel)) : []; }

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
      // o modo Ensaio (F4.6a, KhEnsaio): ligado, a página lê e calcula a ficha
      // ativa do ensaio; desligado, a sombra da ficha atual, como antes
      var comEnsaio = !!(KhEnsaio && KhSeletor);
      function ensaio() { return comEnsaio && KhEnsaio.ligado(win); }
      function opTopo() { return comEnsaio ? { ensaio: ensaio() } : undefined; }
      raizEl.innerHTML = htmlCasca(aberta, ordem, opTopo());

      function el(id) { return doc.getElementById(id); }

      // os dados do motor (KhPrevia.carregar), para o desenho e para o Ensaio
      // (migrar a ficha atual e resolver o import pelo catálogo)
      var pronto = null;
      var seletor = comEnsaio ? KhSeletor.criar({ win: win, doc: doc, cont: el('fp-ke'), prefixo: PREFIXO, densidade: 'pagina',
        dados: function () { return pronto; } }) : null;
      if (comEnsaio) KhSeletor.ligarFaixa(win);
      // a edição (F4.6b): só age com o Ensaio ligado; a barra entra acima do topo na 1ª vez
      var editor = comEnsaio && KhEditor ? KhEditor.criar({ win: win, doc: doc, raiz: raizEl, modo: 'pagina', prefixo: PREFIXO,
        lugar: function () {
          var x = el('fp-ked');
          if (x) return x;
          x = doc.createElement('div');
          x.id = 'fp-ked';
          x.className = 'ke-ed-lugar';
          var topo = el('fp-topo');
          if (topo && topo.parentNode === raizEl) raizEl.insertBefore(x, topo); else raizEl.appendChild(x);
          return x;
        },
        contexto: function () { return dados && M ? M.contexto(dados, KhRegras ? KhRegras.dados() : null, base || '../') : null; } }) : null;

      raizEl.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.closest && t.closest('.fp-abrir-v2')) {
          if (win.KF && typeof win.KF.abrir === 'function') win.KF.abrir();
        }
        // o painel da prévia não abre aqui, então a saída fica na própria página:
        // apaga a chave da prévia (e o Ensaio desta aba) e recarrega sem ?ficha=v3 (volta ao aviso)
        if (t && t.closest && t.closest('.fp-sair-previa')) {
          // com o Ensaio ligado (a página veio do bfcache com o botão à vista):
          // não apaga; a página se acerta e a faixa pede a confirmação dela
          if (ensaio()) {
            if (!KhSeletor.bloqueiaSaidaPrevia(win)) desenha();
            return;
          }
          try { if (ls) ls.removeItem('khalkaria_ficha_previa'); } catch (err) { /* storage bloqueado */ }
          try { if (ss) ss.removeItem('khalkaria_ficha_previa_recolhida'); } catch (err) { /* idem */ }
          if (comEnsaio) KhEnsaio.sair(ss);
          if (win.location && typeof win.location.replace === 'function') win.location.replace(win.location.pathname);
        }
        if (t && t.closest && t.closest('[data-ke="entrar"]') && seletor) seletor.entrar();
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
      // dica fora do fluxo (um ancestral dela recorta pelo overflow: position
      // fixed, KhRedesenho): segue a conta quando a página rola
      if (REDESENHO && win.addEventListener) {
        win.addEventListener('scroll', function () { REDESENHO.reencaixa(raizEl, win); }, { passive: true });
      }
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
        var op = { dados: dados, base: base || '../' };
        if (comEnsaio) op.ensaio = ensaio();
        // com o Ensaio, os campos de estado editáveis e o "Ajustar" (F4.6b)
        if (op.ensaio && editor) op.editar = 'pagina';
        var r = render(r0, op);
        trocaHTML(doc, el('fp-topo'), r.topo, el('fp-aba-' + aberta), raizEl, win);
        ABAS.forEach(function (a) {
          var p = el('fp-painel-' + a.id);
          if (!p) return;
          trocaHTML(doc, p, r.paineis[a.id], p, raizEl, win);
          p.removeAttribute('aria-busy');
        });
        if (editor) editor.desenha(r0);
      }
      // com o Ensaio, a ficha ativa dele (KhEnsaio.calcular); sem ele, a sombra da ficha atual
      function calcula() { return ensaio() ? KhEnsaio.calcular(ss, dados, versao) : KhPrevia.calcular(ls, dados, versao); }
      function desenha() { if (dados) pinta(calcula()); }
      // a ficha atual (v2) é editada no drawer desta mesma página ou em outra aba:
      // redesenha 350 ms depois (o drawer grava com debounce de 200 ms)
      function agenda() { clearTimeout(t); t = setTimeout(desenha, 350); }
      doc.addEventListener('kf:mudou', agenda);
      doc.addEventListener('input', function (e) { if (e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }, true);
      doc.addEventListener('change', function (e) { if (e.target && e.target.closest && e.target.closest('#kf-drawer')) agenda(); }, true);
      win.addEventListener('storage', function (e) { if (e && e.key === CHAVE_V2) agenda(); });
      // o Ensaio ligou, saiu, trocou de ficha ou mudou a lista: redesenha na hora
      if (comEnsaio) doc.addEventListener(KhEnsaio.EVENTO, function () { desenha(); });

      pronto = KhPrevia.carregar(win.fetch.bind(win), base, versao).then(function (d) {
        dados = d;
        // o sprite g-* (moldura de raízes, ramos, selo) entra uma vez, antes do desenho
        var sp = el('fp-sprite');
        if (sp && d && d.glifos) sp.innerHTML = d.glifos;
        desenha();
        return { dados: d, versao: versao };
      }, function (e) {
        pinta({ estado: 'falha', erro: str(e && e.message), erros: [] });
        return { dados: null, versao: versao };
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
