/* ============================================================
   kh-ui.js — biblioteca comum de interface do site (F2b, plano §3.1)

   O shell (tools/shell.py) injeta este arquivo de forma SÍNCRONA em todas as
   páginas, antes do primeiro <script src> local, com ?v=. Fica fora do bundle
   da ficha (js/ficha.js). Sem ESM: uma IIFE que registra, no window,

     KhTeclas  registro único de atalhos e das camadas do Esc (um ouvinte de
               keydown por fase no document: captura e bolha)
     KhPrever  motor do pop-up de hover/foco: gatilho [data-prever="tipo:id"],
               resolvedor por tipo, atrasos, modo quente, aria-describedby,
               posição com seta. Inerte até alguém chamar KhPrever.montar(nó)
     KhToast   toast com "Desfazer" sobre um elemento da página

   Carregar este arquivo não muda nada na página: sem registro, os ouvintes do
   KhTeclas não fazem nada e o KhPrever não escuta ninguém.

   No node (tools/testes/*.test.js) exporta as fábricas por module.exports:
     criaTeclas(doc), criaPrever(win, doc), criaToast(doc, win)
   ============================================================ */
(function (raiz) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ============================================================ KhTeclas
  // Atalho = tecla só ('i', 'I', '/', '\\', '[') ou acorde 'Ctrl+<tecla>' (Ctrl
  // ou Cmd, sem Shift nem Alt; a tecla sem caixa). Tecla só não aceita Ctrl, Cmd
  // nem Alt; Shift vale (o e.key já traz a caixa: 'I', '+').
  // Um atalho por tecla e por fase: registrar de novo substitui.
  //   fn(e) devolve false -> o evento segue (sem preventDefault); qualquer outro
  //   valor consome.
  //   opcoes: fase 'bolha' (padrão) | 'captura'; repetir (padrão true: aceita
  //   e.repeat); quando(e) -> bool (guarda extra); emCampo(e) -> bool (troca a
  //   regra padrão de "foco em campo de texto", em que o atalho não dispara).
  // Esc: camadas por prioridade (menor primeiro) e por fase; fn(e) devolve true
  // se consumiu (preventDefault e para), senão passa para a próxima.
  // As duas fases saem se e.defaultPrevented (alguém já tratou).
  function criaTeclas(doc) {
    var fases = {
      captura: { esc: [], atalhos: {}, ordem: [] },
      bolha: { esc: [], atalhos: {}, ordem: [] }
    };
    var TIPOS_NAO_TEXTO = ['button', 'checkbox', 'radio', 'submit', 'reset', 'range', 'color', 'file', 'image'];

    // campo de TEXTO (onde a tecla escreve): input de texto/número, textarea,
    // select, contenteditable. Checkbox e botão não contam.
    function ehCampo(t) {
      if (!t || t.nodeType !== 1) return false;
      if (t.isContentEditable) return true;
      var tag = t.tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (tag !== 'INPUT') return false;
      var ty = (t.getAttribute('type') || 'text').toLowerCase();
      return TIPOS_NAO_TEXTO.indexOf(ty) < 0;
    }
    function emCampoPadrao(e) {
      return ehCampo(e.target) || ehCampo(doc.activeElement);
    }

    function normaliza(tecla) {
      var m = /^Ctrl\+(.+)$/.exec(tecla);
      return m ? { chave: 'Ctrl+' + m[1].toLowerCase(), ctrl: true } : { chave: tecla, ctrl: false };
    }
    function chaveDe(e) {
      var mod = e.ctrlKey || e.metaKey;
      if (mod) return (e.shiftKey || e.altKey) ? '' : 'Ctrl+' + String(e.key || '').toLowerCase();
      if (e.altKey) return '';
      return e.key;
    }

    function despacha(fase, e) {
      if (e.defaultPrevented) return;
      var F = fases[fase];
      if (e.key === 'Escape') {
        for (var i = 0; i < F.esc.length; i++) {
          if (F.esc[i].fn(e)) { e.preventDefault(); return; }
        }
        return;
      }
      var k = chaveDe(e);
      var a = k && F.atalhos[k];
      if (!a) return;
      if (e.repeat && !a.repetir) return;
      if (a.emCampo ? a.emCampo(e) : emCampoPadrao(e)) return;
      if (a.quando && !a.quando(e)) return;
      if (a.fn(e) !== false) e.preventDefault();
    }
    if (doc && doc.addEventListener) {
      doc.addEventListener('keydown', function (e) { despacha('captura', e); }, true);
      doc.addEventListener('keydown', function (e) { despacha('bolha', e); }, false);
    }

    function faseDe(o) { return o && o.fase === 'captura' ? 'captura' : 'bolha'; }

    return {
      atalho: function (tecla, fn, o) {
        o = o || {};
        var n = normaliza(tecla), F = fases[faseDe(o)];
        if (!F.atalhos[n.chave]) F.ordem.push(n.chave);
        F.atalhos[n.chave] = {
          tecla: tecla, fn: fn, repetir: o.repetir !== false,
          quando: o.quando || null, emCampo: o.emCampo || null, descricao: o.descricao || ''
        };
      },
      camadaEsc: function (p, fn, o) {
        var l = fases[faseDe(o)].esc;
        l.push({ p: p, fn: fn });
        l.sort(function (a, b) { return a.p - b.p; });   // estável: mesma prioridade, ordem de registro
      },
      // o que está registrado (para ajuda de atalhos e testes)
      lista: function () {
        var out = [];
        ['captura', 'bolha'].forEach(function (f) {
          fases[f].ordem.forEach(function (k) {
            var a = fases[f].atalhos[k];
            out.push({ tecla: a.tecla, fase: f, descricao: a.descricao });
          });
        });
        return out;
      },
      emCampo: ehCampo
    };
  }

  // ============================================================ KhPrever
  // Um nó só, reaproveitado (fixo, sem ponteiro). Gatilho: qualquer
  // [data-prever="tipo:id"]; chave sem "tipo:" usa o tipoPadrao da montagem.
  // O resolvedor do tipo recebe (id, alvo, chave) e devolve {classe, html} ou
  // null (null = não abre). Quem monta cuida do Esc (KhTeclas.camadaEsc) e de
  // refazer o conteúdo quando os dados mudam.
  //
  // Abre: ponteiro parado 300ms (mouse/caneta, nunca toque), foco visível por
  // teclado 500ms, opção destacada de combobox (aria-activedescendant) 300ms.
  // Fechou há menos de 400ms: abre em 0 (modo quente) e troca sem fade.
  // Some na hora: clique, roda, rolagem (com mouse), arrasto, blur da janela.
  function criaPrever(win, doc) {
    var resolvedores = {};
    var no = null, o = {};
    var W = 340, MARGEM = 8, VAO = 12, SETA_MIN = 12;
    var ATRASO = { mouse: 300, teclado: 500, ad: 300 };
    var QUENTE = 400, FECHA_MOUSE = 80, SAIDA = 80, CALMO = 200;

    var cur = { aberto: false, alvo: null, desc: null, descAntes: null, foco: null, modo: '', chave: '' };
    var pend = { t: null, alvo: null, desc: null, foco: null, modo: '' };
    var fechaT = null, saiT = null;
    var fechouEm = -1e9, calmoAte = 0;
    var bloqueado = null;      // gatilho clicado: não reabre até o ponteiro sair dele
    var ultimaTecla = false;   // fallback de :focus-visible
    var semHover = false;

    function setTimeout(fn, ms) { return win.setTimeout(fn, ms); }
    function clearTimeout(t) { return win.clearTimeout(t); }
    function agora() { return (win.performance && win.performance.now) ? win.performance.now() : Date.now(); }
    function raf(fn) {
      return win.requestAnimationFrame ? win.requestAnimationFrame(fn) : win.setTimeout(fn, 16);
    }
    function limita(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function gatilhoDe(el) {
      return el && el.nodeType === 1 && el.closest ? el.closest('[data-prever]') : null;
    }
    function focoVisivel(el) {
      try { return el.matches(':focus-visible'); } catch (e) { return ultimaTecla; }
    }
    function parse(chave) {
      var m = /^([a-z]+):(.+)$/.exec(chave || '');
      return m ? { tipo: m[1], id: m[2] } : { tipo: o.tipoPadrao || '', id: chave || '' };
    }
    function resolve(chave, alvo) {
      if (!chave) return null;
      var p = parse(chave), fn = resolvedores[p.tipo];
      if (!fn || !p.id) return null;
      return fn(p.id, alvo, chave) || null;
    }

    // ------------------------------------------------------------ posição
    function posiciona(alvo) {
      var de = doc.documentElement;
      var vw = de.clientWidth || win.innerWidth;
      var vh = de.clientHeight || win.innerHeight;
      var H = no.offsetHeight;
      var r = alvo.getBoundingClientRect();
      var x, y, seta, pos;
      var xp = o.xPreferido ? o.xPreferido(alvo, W, VAO) : null;
      x = xp != null ? xp : r.right + VAO;
      if (x + W > vw - MARGEM) x = r.left - VAO - W;
      if (x < MARGEM) {
        // nem à direita nem à esquerda: centralizado, abaixo (ou acima) do gatilho
        x = limita(r.left + r.width / 2 - W / 2, MARGEM, vw - W - MARGEM);
        y = r.bottom + VAO; seta = 'cima';
        if (y + H > vh - MARGEM) { y = r.top - VAO - H; seta = 'baixo'; }
        y = limita(y, MARGEM, vh - H - MARGEM);
        pos = limita(r.left + r.width / 2 - x, SETA_MIN, W - SETA_MIN);
        no.style.setProperty('--seta-x', Math.round(pos) + 'px');
        no.style.removeProperty('--seta-y');
      } else {
        y = limita(r.top + r.height / 2 - H / 2, MARGEM, vh - H - MARGEM);
        seta = x >= r.left + r.width / 2 ? 'esq' : 'dir';
        pos = limita(r.top + r.height / 2 - y, SETA_MIN, H - SETA_MIN);
        no.style.setProperty('--seta-y', Math.round(pos) + 'px');
        no.style.removeProperty('--seta-x');
      }
      no.style.left = Math.round(x) + 'px';
      no.style.top = Math.round(y) + 'px';
      no.setAttribute('data-seta', seta);
      if (o.aoPosicionar) o.aoPosicionar(no, alvo);
    }

    // ------------------------------------------------------------ aria-describedby
    function poeDesc(el) {
      if (!el) return;
      var antes = el.getAttribute('aria-describedby');
      cur.desc = el;
      cur.descAntes = antes;
      var ids = (antes || '').split(/\s+/).filter(Boolean);
      if (ids.indexOf(no.id) < 0) ids.push(no.id);
      el.setAttribute('aria-describedby', ids.join(' '));
    }
    function tiraDesc() {
      var el = cur.desc;
      if (!el) return;
      if (cur.descAntes) el.setAttribute('aria-describedby', cur.descAntes);
      else el.removeAttribute('aria-describedby');
      cur.desc = null; cur.descAntes = null;
    }

    // ------------------------------------------------------------ abrir / fechar
    function limpaPend() {
      clearTimeout(pend.t);
      pend.t = null; pend.alvo = null; pend.desc = null; pend.foco = null; pend.modo = '';
    }
    function preenche(r) {
      no.className = r.classe || '';
      no.innerHTML = r.html || '';
    }
    function abrirAgora(alvo, op) {
      op = op || {};
      if (!no) return false;
      limpaPend();
      clearTimeout(fechaT);
      if (!alvo || !doc.contains(alvo)) return false;
      var chave = alvo.getAttribute('data-prever') || '';
      var modo = op.modo || 'mouse';
      var desc = op.desc || alvo;
      if (cur.aberto && cur.alvo === alvo) {
        cur.modo = modo; cur.foco = op.foco || null;
        if (cur.desc !== desc) { tiraDesc(); poeDesc(desc); }
        return true;
      }
      var r = resolve(chave, alvo);
      if (!r) return false;
      tiraDesc();
      clearTimeout(saiT);
      var trocando = cur.aberto && !no.hidden;
      preenche(r);
      cur.aberto = true; cur.alvo = alvo; cur.chave = chave; cur.modo = modo; cur.foco = op.foco || null;
      poeDesc(desc);
      no.hidden = false;
      if (trocando) {
        // troca direta entre gatilhos (modo quente): sem fade, só reposiciona
        no.classList.add('vis');
        posiciona(alvo);
        return true;
      }
      raf(function () {
        if (!cur.aberto || cur.alvo !== alvo) return;
        posiciona(alvo);             // lê offsetHeight: o estado inicial (opacidade 0) já foi computado
        no.classList.add('vis');
      });
      return true;
    }
    // imediato: some na hora (scroll, wheel, clique, arrasto, Esc, blur).
    // natural: saída do ponteiro ou do foco; só esta arma o modo quente.
    function fechar(imediato, natural) {
      limpaPend();
      clearTimeout(fechaT); fechaT = null;
      if (!cur.aberto) return false;
      tiraDesc();
      cur.aberto = false; cur.alvo = null; cur.foco = null; cur.modo = ''; cur.chave = '';
      if (natural) fechouEm = agora();
      clearTimeout(saiT);
      if (imediato) {
        no.classList.remove('vis', 'sai');
        no.hidden = true;
      } else {
        no.classList.remove('vis');
        no.classList.add('sai');
        saiT = setTimeout(function () {
          if (cur.aberto) return;
          no.hidden = true;
          no.classList.remove('sai');
        }, SAIDA);
      }
      return true;
    }
    function quente() { return cur.aberto || agora() - fechouEm < QUENTE; }
    function agendar(alvo, op) {
      op = op || {};
      if (!alvo || !no) return;
      var modo = op.modo || 'mouse';
      if (cur.aberto && cur.alvo === alvo) {
        clearTimeout(fechaT); fechaT = null;
        abrirAgora(alvo, op);        // atualiza modo/foco/descrição, sem refazer
        return;
      }
      var ms = op.atraso != null ? op.atraso : (ATRASO[modo] || ATRASO.mouse);
      if (quente()) ms = 0;
      limpaPend();
      if (ms <= 0) { abrirAgora(alvo, op); return; }
      pend.alvo = alvo; pend.desc = op.desc || null; pend.foco = op.foco || null; pend.modo = modo;
      pend.t = setTimeout(function () {
        pend.t = null;
        abrirAgora(alvo, op);
      }, ms);
    }

    // ------------------------------------------------------------ ouvintes (montar)
    function ponteiroOk(e) {
      return !semHover && (e.pointerType === 'mouse' || e.pointerType === 'pen');
    }
    function ligar() {
      try {
        var mq = win.matchMedia('(hover: none)');
        semHover = mq.matches;
        var aoMudarMq = function (e) { semHover = e.matches; if (semHover) fechar(true); };
        if (mq.addEventListener) mq.addEventListener('change', aoMudarMq);
        else if (mq.addListener) mq.addListener(aoMudarMq);
      } catch (e) {}

      doc.addEventListener('pointerover', function (e) {
        if (!ponteiroOk(e)) return;
        var g = gatilhoDe(e.target);
        if (!g || g === bloqueado) return;
        if (agora() < calmoAte) return;
        if (pend.alvo === g && pend.modo === 'mouse') return;   // movimento dentro do mesmo gatilho
        agendar(g, { modo: 'mouse' });
      });
      // "300ms parado": cada movimento dentro do gatilho reinicia a espera
      doc.addEventListener('pointermove', function (e) {
        if (!pend.t || pend.modo !== 'mouse' || !ponteiroOk(e)) return;
        var alvo = pend.alvo;
        if (gatilhoDe(e.target) !== alvo) return;
        clearTimeout(pend.t);
        pend.t = setTimeout(function () { pend.t = null; abrirAgora(alvo, { modo: 'mouse' }); }, ATRASO.mouse);
      }, { passive: true });
      doc.addEventListener('pointerout', function (e) {
        var g = gatilhoDe(e.target);
        if (!g) return;
        if (e.relatedTarget && g.contains(e.relatedTarget)) return;
        if (bloqueado === g) bloqueado = null;
        if (pend.alvo === g && pend.modo === 'mouse') limpaPend();
        if (cur.aberto && cur.alvo === g && cur.modo === 'mouse') {
          clearTimeout(fechaT);
          fechaT = setTimeout(function () { fechar(false, true); }, FECHA_MOUSE);
        }
      });

      // some na hora: clique, rolagem (qualquer rolador), roda, arrasto, blur
      doc.addEventListener('pointerdown', function (e) {
        ultimaTecla = false;
        bloqueado = gatilhoDe(e.target);
        fechar(true);
      }, true);
      doc.addEventListener('wheel', function () {
        calmoAte = agora() + CALMO;
        if (pend.modo === 'mouse') limpaPend();
        fechar(true);
      }, { capture: true, passive: true });
      var rolaT = 0;
      doc.addEventListener('scroll', function () {
        // o foco por teclado pode rolar o gatilho para a vista: a espera do teclado continua
        if (pend.modo === 'mouse') { limpaPend(); calmoAte = agora() + CALMO; }
        if (!cur.aberto) return;
        if (cur.modo === 'mouse') { fechar(true); return; }
        // teclado/combobox: o gatilho segue focado (o próprio focus() rola a página).
        // Acompanha enquanto ele estiver à vista; fora dela, some.
        if (rolaT) return;
        rolaT = raf(function () {
          rolaT = 0;
          if (!cur.aberto || cur.modo === 'mouse' || !cur.alvo) return;
          var r = cur.alvo.getBoundingClientRect();
          var vh = doc.documentElement.clientHeight || win.innerHeight;
          if (!r.width || r.bottom < 0 || r.top > vh) fechar(true);
          else posiciona(cur.alvo);
        });
      }, { capture: true, passive: true });
      doc.addEventListener('dragstart', function () { fechar(true); }, true);
      win.addEventListener('blur', function () { fechar(true); });

      // teclado
      doc.addEventListener('keydown', function () { ultimaTecla = true; }, true);
      doc.addEventListener('focusin', function (e) {
        var t = e.target;
        if (!t || t.nodeType !== 1) return;
        var g = gatilhoDe(t);
        if (!g && o.gatilhoFoco) g = o.gatilhoFoco(t);
        if (!g || !focoVisivel(t)) return;
        agendar(g, { modo: 'teclado', desc: t, foco: t });
      });
      doc.addEventListener('focusout', function (e) {
        var t = e.target;
        if (pend.foco === t && pend.modo !== 'mouse') limpaPend();
        if (cur.aberto && cur.foco === t && cur.modo !== 'mouse') fechar(false, true);
      });

      // combobox: a opção destacada (aria-activedescendant) também abre, em 300ms
      if (win.MutationObserver && doc.body) {
        new win.MutationObserver(function (ms) {
          ms.forEach(function (m) {
            var dono = m.target;
            if (dono !== doc.activeElement) return;
            var id = dono.getAttribute('aria-activedescendant');
            var op = id ? doc.getElementById(id) : null;
            var g = gatilhoDe(op);
            if (!g) {
              if (pend.foco === dono && pend.modo === 'ad') limpaPend();
              if (cur.aberto && cur.modo === 'ad' && cur.foco === dono) fechar(true);
              return;
            }
            agendar(g, { modo: 'ad', desc: op, foco: dono });
          });
        }).observe(doc.body, { subtree: true, attributes: true, attributeFilter: ['aria-activedescendant'] });
      }
    }

    return {
      // nó: o elemento do pop-up (com id: vai no aria-describedby). opcoes:
      //   tipoPadrao    tipo das chaves sem "tipo:" (o Bazar usa 'item')
      //   largura       px (340)
      //   xPreferido(alvo, largura, vao) -> x | null   lado preferido por região
      //   gatilhoFoco(t) -> gatilho | null   foco num elemento que não é gatilho
      //   aoPosicionar(no, alvo)             depois de cada posicionamento
      montar: function (n, opcoes) {
        if (no || !n) return !!no;
        no = n; o = opcoes || {};
        if (o.largura) W = o.largura;
        ligar();
        return true;
      },
      montado: function () { return !!no; },
      resolvedor: function (tipo, fn) { resolvedores[tipo] = fn; },
      resolver: resolve,
      // abre já (opcoes: {modo:'mouse'|'teclado'|'ad', desc, foco})
      abrir: function (el, op) { return abrirAgora(gatilhoDe(el) || el, op || {}); },
      // abre com a espera do modo (opcoes.atraso sobrepõe), respeitando o modo quente
      agendar: function (el, op) { agendar(gatilhoDe(el) || el, op || {}); },
      // fechar() some na hora; fechar(false, true) = saída natural (fade, arma o modo quente)
      fechar: function (imediato, natural) { return fechar(imediato === undefined ? true : imediato, natural); },
      cancelarEspera: limpaPend,
      esperando: function () { return !!pend.t; },
      aberto: function () { return cur.aberto; },
      gatilho: function () { return cur.alvo; },
      chave: function () { return cur.chave; },
      no: function () { return no; }
    };
  }

  // ============================================================ KhToast
  // KhToast.criar(el, opcoes) -> { mostrar(msg, {desfazer, ms}), fechar(), el }
  //   opcoes: ms (6000), classeVisivel ('on'), classeBotao ('kh-toast-btn'),
  //   aoPerderFoco()  chamado ao fechar se o foco estava dentro do toast
  //                   (o botão Desfazer some: quem montou devolve o foco)
  // O botão sai com data-toast-desfazer: quem montou escuta o clique nele.
  function criaToast(doc, win) {
    win = win || (typeof window !== 'undefined' ? window : null);
    function setTimeout(fn, ms) { return win.setTimeout(fn, ms); }
    function clearTimeout(t) { return win.clearTimeout(t); }
    return {
      criar: function (el, op) {
        op = op || {};
        var MS = op.ms || 6000;
        var VIS = op.classeVisivel || 'on';
        var BTN = op.classeBotao || 'kh-toast-btn';
        var t = null;
        function fechar() {
          clearTimeout(t);
          el.classList.remove(VIS);
          if (el.contains(doc.activeElement) && op.aoPerderFoco) op.aoPerderFoco();
          el.innerHTML = '';
        }
        function mostrar(msg, o) {
          o = o || {};
          clearTimeout(t);
          el.innerHTML = '<span>' + esc(msg) + '</span>' +
            (o.desfazer ? ' · <button type="button" class="' + BTN + '" data-toast-desfazer title="Desfazer (Ctrl+Z)" aria-keyshortcuts="Control+Z">Desfazer</button>' : '');
          el.classList.add(VIS);
          t = setTimeout(fechar, o.ms || MS);
        }
        return { mostrar: mostrar, fechar: fechar, el: el };
      }
    };
  }

  var fabricas = { criaTeclas: criaTeclas, criaPrever: criaPrever, criaToast: criaToast, esc: esc };
  if (typeof module === 'object' && module && module.exports) { module.exports = fabricas; return; }
  var doc = typeof document !== 'undefined' ? document : null;
  if (!raiz || !doc) return;
  raiz.KhTeclas = criaTeclas(doc);
  raiz.KhPrever = criaPrever(raiz, doc);
  raiz.KhToast = criaToast(doc, raiz);
})(typeof window !== 'undefined' ? window : this);
