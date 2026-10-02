/* Khalkaria — Ficha · KhAbas: lista de abas reordenável (F4.5).
 * Especificação: docs/ficha-digital/05-f4-pagina.md, seção F4.5; 03 §9 (ordem
 * por navegador, no drawer e na página).
 *
 * Mora no bundle (js/ficha.js), e não no js/ficha-pagina.js, porque tem dois
 * donos: a página da ficha (só pages/ficha.html carrega o ficha-pagina.js) e o
 * drawer da F4.4, que roda em todas as páginas pelo js/ficha.js. Carregar este
 * arquivo não muda nada: nada escuta nem lê storage até alguém chamar criar().
 *
 *   var abas = KhAbas.criar(tablist, {
 *     ids: ['nucleo', 'tecnicas', …],   // a ordem padrão (a do A4)
 *     rotulos: { nucleo: 'Núcleo', … }, // para os avisos ao leitor de tela
 *     aberta: 'nucleo',                 // a aba aberta ao criar (senão: a da sessão, ou a 1ª)
 *     restaurar: botão "Ordem do A4" (escondido na ordem padrão), anuncio: região aria-live,
 *     aoSelecionar(id), aoMudarOrdem(ordem)
 *   });
 *
 * Marcação esperada: tablist[role=tablist] com os botões [role=tab][data-aba]
 * como filhos diretos, cada um com aria-controls apontando o seu tabpanel.
 * O KhAbas cuida de aria-selected, do tabindex móvel e do hidden dos painéis.
 *
 * Teclado (padrão ARIA de abas, ativação automática): setas trocam de aba (com
 * volta), Home e End vão às pontas; isso é a navegação do próprio widget, num
 * keydown da lista, como as linhas de filtro do Bazar. Alt+← e Alt+→ MOVEM a
 * aba focada: atalho do site, registrado no KhTeclas (js/kh-ui.js), um só para
 * todas as listas (vale a que tem a aba focada). Só com o foco de TECLADO na
 * aba (:focus-visible): o clique também foca o botão (Chrome, Edge e Firefox no
 * Windows), e aí o Alt+← tem de seguir sendo o Voltar do navegador, mesmo com
 * a aba fora da tela. O Chrome não liga o :focus-visible por tecla com Alt, então
 * depois de um clique só uma tecla comum (seta, Tab) o liga. Com o foco de
 * teclado, na ponta o Alt+seta é consumido e só avisa: quem apertou estava
 * movendo a aba e não quer sair da página. Para o :focus-visible sobreviver de
 * um Alt+seta ao seguinte, a aba focada nunca sai do DOM ao reordenar (as
 * outras se arrumam em volta dela; ver aplicaDom).
 * Esc durante o arrasto desfaz o arrasto (camada do Esc do KhTeclas).
 *
 * Arrasto (pointer events): só vira arrasto depois de LIMIAR px; abaixo disso
 * é clique. A aba segue o ponteiro na horizontal e as outras abrem espaço; ao
 * soltar, grava. pointercancel, Esc ou perder a janela desfazem.
 *
 * Ordem: localStorage khalkaria_ficha_abas, lista de ids. É do navegador: vale
 * para todas as fichas, não vai no export, e o drawer e a página leem a mesma
 * (mudou numa, a outra acompanha: mesma janela pelo registro daqui, outra janela
 * pelo evento storage). Lista inválida volta à ordem padrão; incompleta mantém
 * o que é conhecido e acrescenta as abas novas no fim; id desconhecido ou
 * repetido sai. A ordem padrão apaga a chave (sem preferência, vale o padrão).
 * Aba aberta: sessionStorage khalkaria_ficha_aba (só lida ao criar; gravada
 * quando o jogador troca). São as ÚNICAS escritas deste módulo.
 *
 * Movimento reduzido (html[data-movimento=reduzido], a opção da nav): sem a
 * animação das abas que trocam de lugar.
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhAbas no navegador.
 * Fonte: js/ficha/kh-abas.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv

  var KhAbas = (function () {
    var CHAVE_ORDEM = 'khalkaria_ficha_abas';
    var CHAVE_ABERTA = 'khalkaria_ficha_aba';
    var LIMIAR = 6;        // px até o aperto virar arrasto (menos que isso é clique)
    var DURACAO = 160;     // ms da animação das abas que trocam de lugar
    var instancias = [];   // as listas vivas (drawer e página): Alt+seta, Esc e a sincronia
    var teclasLigadas = [];

    function lista(x) { return Array.isArray(x) ? x : []; }
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function igual(a, b) {
      return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
    }

    // ---------------- puras ----------------
    // ordem guardada -> ordem válida: os ids conhecidos, sem repetir, na ordem
    // guardada; os que faltam (aba nova; ou tudo, se a lista não presta) no fim,
    // na ordem padrão
    function normaliza(salva, ids) {
      ids = lista(ids);
      var out = [];
      lista(salva).forEach(function (x) {
        if (typeof x === 'string' && ids.indexOf(x) >= 0 && out.indexOf(x) < 0) out.push(x);
      });
      ids.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); });
      return out;
    }
    function lerOrdem(ls, ids, chave) {
      var v = null, salva = null;
      try { v = ls ? ls.getItem(chave || CHAVE_ORDEM) : null; } catch (e) { v = null; }
      if (typeof v === 'string') { try { salva = JSON.parse(v); } catch (e) { salva = null; } }
      return normaliza(Array.isArray(salva) ? salva : [], ids);
    }
    // a ordem padrão apaga a chave; storage cheio ou bloqueado: a ordem vale só
    // nesta página (false)
    function gravarOrdem(ls, ordem, ids, chave) {
      var o = normaliza(ordem, ids);
      try {
        if (!ls) return false;
        if (igual(o, lista(ids))) ls.removeItem(chave || CHAVE_ORDEM);
        else ls.setItem(chave || CHAVE_ORDEM, JSON.stringify(o));
        return true;
      } catch (e) { return false; }
    }
    function lerAberta(ss, ids, chave) {
      var v = null;
      try { v = ss ? ss.getItem(chave || CHAVE_ABERTA) : null; } catch (e) { v = null; }
      return typeof v === 'string' && lista(ids).indexOf(v) >= 0 ? v : null;
    }
    function gravarAberta(ss, id, chave) {
      try { if (ss) { ss.setItem(chave || CHAVE_ABERTA, id); return true; } } catch (e) { /* bloqueado */ }
      return false;
    }
    // o id na posição i (limitada às pontas)
    function moverPara(ordem, id, i) {
      var o = lista(ordem).slice(), de = o.indexOf(id);
      if (de < 0) return o;
      i = Math.max(0, Math.min(o.length - 1, i));
      o.splice(de, 1);
      o.splice(i, 0, id);
      return o;
    }
    function mover(ordem, id, delta) {
      var de = lista(ordem).indexOf(id);
      return de < 0 ? lista(ordem).slice() : moverPara(ordem, id, de + delta);
    }
    // onde a aba arrastada entra, entre as OUTRAS (rects na ordem). A lista
    // pode quebrar em linhas: a primeira aba que está numa linha abaixo do
    // ponteiro, ou na mesma linha com o centro à direita dele, recebe a
    // arrastada antes de si. O y fica preso à faixa das abas (arrastar um pouco
    // para cima ou para baixo da lista não joga a aba para uma ponta).
    function alvoArrasto(rects, x, y) {
      rects = lista(rects);
      if (!rects.length) return 0;
      var topo = Infinity, base = -Infinity;
      rects.forEach(function (r) { topo = Math.min(topo, r.top); base = Math.max(base, r.bottom); });
      y = Math.max(topo, Math.min(base, y));
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (y < r.top) return i;
        if (y <= r.bottom && x < r.left + r.width / 2) return i;
      }
      return rects.length;
    }

    // ---------------- teclado do site (KhTeclas): um registro para todas as listas ----------------
    function instanciaDo(alvo) {
      for (var i = 0; i < instancias.length; i++) if (instancias[i].abaDo(alvo)) return instancias[i];
      return null;
    }
    // o foco veio do teclado? Sem suporte a :focus-visible, não: na dúvida, o
    // Alt+← é do navegador (Voltar)
    function focoDeTeclado(el) {
      try { return !!(el && typeof el.matches === 'function' && el.matches(':focus-visible')); } catch (e) { return false; }
    }
    // a lista cuja aba tem o foco de teclado (alvo do keydown = o elemento focado)
    function instanciaDoTeclado(alvo) {
      var inst = instanciaDo(alvo);
      return inst && focoDeTeclado(alvo) ? inst : null;
    }
    function ligaTeclas(T) {
      if (!T || typeof T.atalho !== 'function' || teclasLigadas.indexOf(T) >= 0) return;
      teclasLigadas.push(T);
      [['Alt+ArrowLeft', -1, 'esquerda'], ['Alt+ArrowRight', 1, 'direita']].forEach(function (t) {
        T.atalho(t[0], function (e) {
          var inst = instanciaDoTeclado(e.target);
          if (!inst) return false;
          inst.mover(inst.abaDo(e.target), t[1]);   // na ponta não move, mas consome (o foco de teclado estava movendo a aba)
        }, { descricao: 'Mover a aba da ficha para a ' + t[2] + ' (com a aba focada pelo teclado)',
          quando: function (e) { return !!instanciaDoTeclado(e.target); } });
      });
      if (typeof T.camadaEsc === 'function') {
        T.camadaEsc(5, function () {
          for (var i = 0; i < instancias.length; i++) if (instancias[i].cancelarArrasto()) return true;
          return false;
        }, { fase: 'captura' });
      }
    }

    function storage(win, nome) {
      try { return win ? win[nome] : null; } catch (e) { return null; }
    }

    // ---------------- a lista viva ----------------
    function criar(tablist, op) {
      op = op || {};
      if (!tablist || typeof tablist.querySelectorAll !== 'function') return null;
      var win = op.win || raiz, doc = op.doc || (win && win.document) || null;
      var chaveOrdem = op.chaveOrdem || CHAVE_ORDEM, chaveAberta = op.chaveAberta || CHAVE_ABERTA;
      var ls = 'ls' in op ? op.ls : storage(win, 'localStorage');
      var ss = 'ss' in op ? op.ss : storage(win, 'sessionStorage');
      var T = 'teclas' in op ? op.teclas : win && win.KhTeclas;
      var rotulos = op.rotulos || {};

      var abas = {};
      function domIds() {
        return arr(tablist.querySelectorAll('[role="tab"]')).map(function (t) { return t.getAttribute('data-aba'); })
          .filter(function (id) { return !!id; });
      }
      arr(tablist.querySelectorAll('[role="tab"]')).forEach(function (t) {
        var id = t.getAttribute('data-aba');
        if (id && !abas[id]) abas[id] = t;
      });
      // a ordem padrão: a dada (só as que existem), mais as da marcação que faltarem
      var ids = normaliza(lista(op.ids).filter(function (id) { return !!abas[id]; }), domIds());
      if (!ids.length) return null;
      var ordem = lerOrdem(ls, ids, chaveOrdem);
      var aberta = abas[op.aberta] ? op.aberta : lerAberta(ss, ids, chaveAberta) || ordem[0];
      var arrasto = null, engolir = false, morta = false;

      function rotulo(id) {
        if (rotulos[id]) return rotulos[id];
        var t = abas[id] && abas[id].textContent;
        return t ? String(t).replace(/\s+/g, ' ').trim() : id;
      }
      function anuncia(msg) { if (op.anuncio) op.anuncio.textContent = msg; }
      function painelDe(id) {
        var c = abas[id] && abas[id].getAttribute('aria-controls');
        return c && doc && doc.getElementById ? doc.getElementById(c) : null;
      }
      function foca(el) {
        if (!el || typeof el.focus !== 'function') return;
        try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
      }
      // o id da aba do alvo (o próprio botão ou algo dentro dele), se for desta lista
      function abaDo(alvo) {
        var t = alvo && alvo.closest ? alvo.closest('[role="tab"]') : null;
        var id = t && t.getAttribute('data-aba');
        return id && abas[id] === t ? id : null;
      }
      function calmo() {
        var h = doc && doc.documentElement;
        return !!h && !!h.getAttribute && h.getAttribute('data-movimento') === 'reduzido';
      }

      // ---- seleção: aria-selected, tabindex móvel, painel
      function marca() {
        ids.forEach(function (id) {
          var on = id === aberta, t = abas[id], p = painelDe(id);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.setAttribute('tabindex', on ? '0' : '-1');
          if (p) p.hidden = !on;
        });
      }
      function seleciona(id, foco) {
        if (!abas[id]) return false;
        var mudou = id !== aberta;
        aberta = id;
        marca();
        if (mudou) gravarAberta(ss, id, chaveAberta);
        if (foco) foca(abas[id]);
        if (mudou && op.aoSelecionar) op.aoSelecionar(id);
        return true;
      }

      // ---- ordem no DOM: poucos insertBefore (a aba que não sai do lugar não é
      // tocada), e a aba FOCADA nunca é movida: tirar o botão do DOM tira o foco
      // dele, e o foco devolvido por script pode voltar sem o :focus-visible (aí
      // o Alt+seta seguinte viraria o Voltar). Quando a vez é dela, as abas entre
      // a posição e ela passam para logo depois dela, na mesma ordem.
      function aplicaDom() {
        var dom = domIds();
        var ativo = doc ? doc.activeElement : null;
        var fixa = ativo ? abaDo(ativo) : null;
        for (var i = 0; i < ordem.length; i++) {
          if (dom[i] === ordem[i]) continue;
          if (ordem[i] === fixa) {
            var p = dom.indexOf(fixa), depois = abas[dom[p + 1]] || null, saem = dom.slice(i, p);
            saem.forEach(function (id) { tablist.insertBefore(abas[id], depois); });
            dom.splice(i, p - i);
            Array.prototype.splice.apply(dom, [i + 1, 0].concat(saem));
            continue;
          }
          tablist.insertBefore(abas[ordem[i]], abas[dom[i]] || null);
          dom.splice(dom.indexOf(ordem[i]), 1);
          dom.splice(i, 0, ordem[i]);
        }
      }
      // Retângulo de LAYOUT da aba, na janela: sem transform (nem a animação
      // abaixo, nem o deslocamento do arrasto). É o que o arrasto compara: o
      // getBoundingClientRect de uma aba no meio da animação mente a posição.
      // Pelo offset* relativo à lista (mesmo offsetParent, ou a própria lista);
      // fora disso (ou num DOM sem offset*), o getBoundingClientRect.
      function caixa(t) {
        var L = tablist.getBoundingClientRect ? tablist.getBoundingClientRect() : null;
        if (!L || typeof t.offsetLeft !== 'number' || typeof t.offsetWidth !== 'number') return t.getBoundingClientRect();
        var x, y;
        if (t.offsetParent && t.offsetParent === tablist) {
          x = L.left + (tablist.clientLeft || 0) + t.offsetLeft;
          y = L.top + (tablist.clientTop || 0) + t.offsetTop;
        } else if (t.offsetParent && t.offsetParent === tablist.offsetParent) {
          x = L.left + t.offsetLeft - tablist.offsetLeft;
          y = L.top + t.offsetTop - tablist.offsetTop;
        } else return t.getBoundingClientRect();
        return { left: x, top: y, right: x + t.offsetWidth, bottom: y + t.offsetHeight, width: t.offsetWidth, height: t.offsetHeight };
      }
      // FLIP: as abas que trocaram de lugar deslizam de onde estavam (na tela,
      // com a animação anterior no meio) até o lugar novo (sem isso no
      // movimento reduzido ou sem Element.animate)
      function mede() {
        if (calmo()) return null;
        var m = {};
        ids.forEach(function (id) {
          var t = abas[id];
          if (t.getBoundingClientRect && typeof t.animate === 'function') m[id] = t.getBoundingClientRect();
        });
        return m;
      }
      function para(t) {
        if (t._khAbasAnim) { try { t._khAbasAnim.cancel(); } catch (e) { /* já acabou */ } t._khAbasAnim = null; }
      }
      function anima(antes, exceto) {
        if (!antes) return;
        ids.forEach(function (id) {
          var t = abas[id], a = antes[id];
          if (!a || id === exceto) return;
          var d = caixa(t), dx = Math.round(a.left - d.left), dy = Math.round(a.top - d.top);
          para(t);
          if (!dx && !dy) return;
          try {
            t._khAbasAnim = t.animate([{ transform: 'translate(' + dx + 'px, ' + dy + 'px)' }, { transform: 'none' }],
              { duration: DURACAO, easing: 'ease-out' }) || null;
          } catch (e) { /* sem animação */ }
        });
      }
      // o botão de restaurar só aparece com a ordem fora da padrão (na padrão
      // não há o que restaurar, e ele não toma largura da lista). Durante o
      // arrasto não muda: aparecer no meio dele reflui a lista sob o ponteiro.
      function atualizaRestaurar() {
        if (op.restaurar && !(arrasto && arrasto.ativo)) op.restaurar.hidden = igual(ordem, ids);
      }
      // troca a ordem na tela (sem gravar). O aplicaDom não move a aba focada;
      // se o foco ainda assim saiu dela, volta
      function poeOrdem(nova, exceto) {
        nova = normaliza(nova, ids);
        if (igual(nova, ordem)) return false;
        var ativo = doc ? doc.activeElement : null;
        var focada = ativo ? abaDo(ativo) : null;
        var antes = mede();
        ordem = nova;
        aplicaDom();
        if (focada && doc.activeElement !== abas[focada]) foca(abas[focada]);
        anima(antes, exceto);
        atualizaRestaurar();
        return true;
      }
      // grava e avisa: as outras listas desta janela (a outra janela vem pelo storage)
      function confirma() {
        gravarOrdem(ls, ordem, ids, chaveOrdem);
        instancias.forEach(function (o) { if (o !== api && o.chaveOrdem === chaveOrdem) o.sincronizar(); });
        if (op.aoMudarOrdem) op.aoMudarOrdem(ordem.slice());
      }
      function posicao(id) { return rotulo(id) + ': posição ' + (ordem.indexOf(id) + 1) + ' de ' + ordem.length + '.'; }
      function moverAba(id, delta) {
        if (!abas[id] || !delta || (arrasto && arrasto.ativo)) return false;
        var j = ordem.indexOf(id) + delta;
        if (j < 0 || j >= ordem.length) {
          anuncia(rotulo(id) + (j < 0 ? ' já é a primeira aba.' : ' já é a última aba.'));
          return false;
        }
        poeOrdem(mover(ordem, id, delta));
        confirma();
        anuncia(posicao(id));
        return true;
      }
      function moverAbaPara(id, i) {
        if (!abas[id] || !poeOrdem(moverPara(ordem, id, i))) return false;
        confirma();
        anuncia(posicao(id));
        return true;
      }
      function restaurar() {
        if (!poeOrdem(ids.slice())) return false;
        confirma();
        anuncia(op.textoRestaurada || 'Ordem padrão das abas restaurada.');
        return true;
      }
      // a ordem guardada mudou fora daqui (a outra lista, outra janela)
      function sincronizar() {
        if (arrasto && arrasto.ativo) cancelarArrasto();
        return poeOrdem(lerOrdem(ls, ids, chaveOrdem));
      }

      // ---- teclado do widget: setas, Home, End (o Alt+seta é do KhTeclas)
      function aoTecla(e) {
        if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        var k = e.key;
        if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End') return;
        var id = abaDo(e.target);
        if (!id) return;
        var i = ordem.indexOf(id), n = ordem.length;
        var j = k === 'Home' ? 0 : k === 'End' ? n - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + n) % n;
        e.preventDefault();
        seleciona(ordem[j], true);
      }
      function aoClique(e) {
        if (engolir) {   // o clique que fecha um arrasto não troca de aba
          engolir = false;
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          return;
        }
        var id = abaDo(e.target);
        if (id) seleciona(id, false);
      }

      // ---- arrasto (pointer events, com limiar)
      function segue(x) {
        var t = abas[arrasto.id];
        if (!t.style) return;
        t.style.transform = '';
        var r = caixa(t);
        t.style.transform = 'translateX(' + Math.round(x - arrasto.pega - r.left) + 'px)';
      }
      function aoApertar(e) {
        if (morta) return;
        engolir = false;
        if (arrasto) {
          if (arrasto.ativo) return;   // outro dedo/botão no meio do arrasto
          termina();                   // aperto antigo que nunca soltou aqui
        }
        if ((e.button != null && e.button !== 0) || e.isPrimary === false) return;
        var id = abaDo(e.target);
        if (!id || !doc) return;
        arrasto = { id: id, pid: e.pointerId, x0: e.clientX, y0: e.clientY, ativo: false, ordem0: ordem.slice(), pega: 0 };
        doc.addEventListener('pointermove', aoMover, true);
        doc.addEventListener('pointerup', aoSoltar, true);
        doc.addEventListener('pointercancel', aoCancelar, true);
      }
      function comeca() {
        var t = abas[arrasto.id];
        para(t);   // a aba pega pelo ponteiro sai de qualquer animação
        var r = caixa(t);
        arrasto.ativo = true;
        arrasto.pega = arrasto.x0 - r.left;
        tablist.setAttribute('data-arrastando', '');
        t.setAttribute('data-arrastada', '');
        // a captura vai na LISTA, que nunca sai do DOM (a aba sai e volta a cada troca)
        try { if (tablist.setPointerCapture && arrasto.pid != null) tablist.setPointerCapture(arrasto.pid); } catch (e) { /* sem captura */ }
      }
      function aoMover(e) {
        if (!arrasto || e.pointerId !== arrasto.pid) return;
        // botão solto fora da janela: o pointerup não chegou
        if (arrasto.ativo && typeof e.buttons === 'number' && e.buttons === 0 && e.pointerType === 'mouse') { aoSoltar(e); return; }
        if (!arrasto.ativo) {
          var dx = e.clientX - arrasto.x0, dy = e.clientY - arrasto.y0;
          if (Math.sqrt(dx * dx + dy * dy) < LIMIAR) return;
          comeca();
        }
        if (e.preventDefault) e.preventDefault();
        var id = arrasto.id;
        var outras = ordem.filter(function (x) { return x !== id; });
        var i = alvoArrasto(outras.map(function (x) { return caixa(abas[x]); }), e.clientX, e.clientY);
        outras.splice(i, 0, id);
        poeOrdem(outras, id);
        segue(e.clientX);
      }
      function termina() {
        var a = arrasto;
        arrasto = null;
        if (doc) {
          doc.removeEventListener('pointermove', aoMover, true);
          doc.removeEventListener('pointerup', aoSoltar, true);
          doc.removeEventListener('pointercancel', aoCancelar, true);
        }
        if (!a || !a.ativo) return a;
        var t = abas[a.id];
        tablist.removeAttribute('data-arrastando');
        t.removeAttribute('data-arrastada');
        try { if (tablist.releasePointerCapture && a.pid != null) tablist.releasePointerCapture(a.pid); } catch (e) { /* já solta */ }
        // a aba sai do deslocamento do ponteiro para o seu lugar
        var antes = t.style && t.style.transform && !calmo() && typeof t.animate === 'function' ? t.getBoundingClientRect() : null;
        if (t.style) t.style.transform = '';
        if (antes) anima(objeto(a.id, antes));
        return a;
      }
      function objeto(k, v) { var o = {}; o[k] = v; return o; }
      function aoSoltar(e) {
        if (!arrasto || (e && e.pointerId !== arrasto.pid)) return;
        var a = termina();
        if (!a || !a.ativo) return;   // não passou do limiar: é clique, o click segue
        atualizaRestaurar();
        engolir = true;
        if (win && win.setTimeout) win.setTimeout(function () { engolir = false; }, 0);
        if (!igual(ordem, a.ordem0)) { confirma(); anuncia(posicao(a.id)); }
      }
      function aoCancelar(e) {
        if (!arrasto || (e && e.pointerId !== arrasto.pid)) return;
        cancelarArrasto();
      }
      // desfaz o arrasto em curso (Esc, pointercancel, janela perdida); true se havia um
      function cancelarArrasto() {
        if (!arrasto) return false;
        var a = termina();
        if (!a.ativo) return false;
        poeOrdem(a.ordem0);
        atualizaRestaurar();
        anuncia('Arrasto desfeito.');
        return true;
      }
      function aoSairDaJanela() { cancelarArrasto(); }
      function aoStorage(e) { if (e && e.key === chaveOrdem) sincronizar(); }

      tablist.addEventListener('keydown', aoTecla);
      tablist.addEventListener('click', aoClique, true);
      tablist.addEventListener('pointerdown', aoApertar);
      if (op.restaurar) op.restaurar.addEventListener('click', aoRestaurar);
      function aoRestaurar() {
        if (!restaurar()) return;
        foca(abas[aberta]);   // o botão some: o foco volta à aba aberta
      }
      if (win && win.addEventListener) {
        win.addEventListener('storage', aoStorage);
        win.addEventListener('blur', aoSairDaJanela);
      }

      function destruir() {
        if (morta) return;
        cancelarArrasto();
        morta = true;
        tablist.removeEventListener('keydown', aoTecla);
        tablist.removeEventListener('click', aoClique, true);
        tablist.removeEventListener('pointerdown', aoApertar);
        if (op.restaurar) op.restaurar.removeEventListener('click', aoRestaurar);
        if (win && win.removeEventListener) {
          win.removeEventListener('storage', aoStorage);
          win.removeEventListener('blur', aoSairDaJanela);
        }
        var i = instancias.indexOf(api);
        if (i >= 0) instancias.splice(i, 1);
      }

      var api = {
        chaveOrdem: chaveOrdem,
        ids: ids.slice(),
        ordem: function () { return ordem.slice(); },
        aberta: function () { return aberta; },
        seleciona: seleciona,
        mover: moverAba,
        moverPara: moverAbaPara,
        restaurar: restaurar,
        sincronizar: sincronizar,
        arrastando: function () { return !!(arrasto && arrasto.ativo); },
        cancelarArrasto: cancelarArrasto,
        abaDo: abaDo,
        destruir: destruir
      };

      // estado inicial: a ordem guardada na tela (a marcação pode ter vindo na
      // padrão), a aba aberta, o botão de restaurar. Nada é gravado aqui.
      aplicaDom();
      marca();
      atualizaRestaurar();
      instancias.push(api);
      ligaTeclas(T);
      return api;
    }

    return { CHAVE_ORDEM: CHAVE_ORDEM, CHAVE_ABERTA: CHAVE_ABERTA, LIMIAR: LIMIAR, DURACAO: DURACAO,
      normaliza: normaliza, lerOrdem: lerOrdem, gravarOrdem: gravarOrdem, lerAberta: lerAberta, gravarAberta: gravarAberta,
      mover: mover, moverPara: moverPara, alvoArrasto: alvoArrasto, criar: criar };
  })();

  if (emNode) { module.exports = KhAbas; return; }
  raiz.KhAbas = KhAbas;
})(typeof window !== 'undefined' ? window : this);
