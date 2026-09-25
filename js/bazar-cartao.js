/* ============================================================
   O BAZAR — pop-up do card (#bz-preview, .bz-cartao)
   Spec §3. Um nó só, reaproveitado. NUNCA .item-card nem data-n: o
   MutationObserver da ficha.js penduraria "+ ficha" e draggable nele.

   Gatilho: qualquer [data-prever="<id do catálogo>"] ou [data-prever="e:<uid>"]
   (entrada do inventário, inclusive avulsa). Superfícies: ingredientes,
   degraus, mini-ingredientes, usos e migalhas do painel de receita; td.c-nome
   da Lista; linhas do inventário; opções do combobox (aria-activedescendant).
   [data-pede="n"] no gatilho acrescenta "Receita pede n · você tem x".

   Registra:
     BZ.cartao = { abrir(el, opts), agendar(el, opts), fechar(), aberto(),
                   gatilho(), cartaoHTML(id) }
     BZ.camadaEsc(10, …)   o Esc fecha o pop-up antes do combobox e do painel
   ============================================================ */
(function (BZ) {
  'use strict';
  if (!BZ) return;

  var U = BZ.util, D = BZ.dados;
  var esc = U.esc;
  var no = U.$('#bz-preview');
  if (!no) return;

  var W = 340, MARGEM = 8, VAO = 12, SETA_MIN = 12;
  var ATRASO = { mouse: 300, teclado: 500, ad: 300 };
  var QUENTE = 400;          // fechou há menos disso: abre em 0ms
  var FECHA_MOUSE = 80;      // espera depois do pointerout
  var SAIDA = 80;            // duração da saída (CSS .sai)
  var CALMO = 200;           // depois de wheel/scroll, o hover não reabre
  var ROTULO = { bugigangas: 'Bugigangas', equipamentos: 'Equipamentos' };
  var COLUNAS = ['bugigangas', 'equipamentos'];

  var cache = new Map();     // id -> HTML estático (cabeçalho, efeito, valor, peso)

  // gatilho aberto: alvo = [data-prever] (âncora), desc = quem ganha aria-describedby,
  // foco = elemento cujo focusout fecha (teclado/combobox)
  var cur = { aberto: false, alvo: null, desc: null, descAntes: null, foco: null, modo: '', chave: '' };
  var pend = { t: null, alvo: null, desc: null, foco: null, modo: '' };
  var fechaT = null, saiT = null;
  var fechouEm = -1e9, calmoAte = 0;
  var bloqueado = null;      // gatilho clicado: não reabre até o ponteiro sair dele
  var ultimaTecla = false;   // fallback de :focus-visible

  var semHover = false;
  try {
    var mq = window.matchMedia('(hover: none)');
    semHover = mq.matches;
    var aoMudarMq = function (e) { semHover = e.matches; if (semHover) fechar(true); };
    if (mq.addEventListener) mq.addEventListener('change', aoMudarMq);
    else if (mq.addListener) mq.addListener(aoMudarMq);
  } catch (e) {}

  function agora() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function limita(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function gatilhoDe(el) {
    return el && el.nodeType === 1 && el.closest ? el.closest('[data-prever]') : null;
  }
  function focoVisivel(el) {
    try { return el.matches(':focus-visible'); } catch (e) { return ultimaTecla; }
  }

  // ------------------------------------------------------------ dados
  function acharEntrada(uid) {
    var k = U.kf();
    if (!k || !uid) return null;
    var inv;
    try { inv = k.inventario(); } catch (e) { return null; }
    for (var c = 0; c < COLUNAS.length; c++) {
      var l = inv[COLUNAS[c]] || [];
      for (var i = 0; i < l.length; i++) {
        if (l[i] && l[i].uid === uid) return { entrada: l[i], coluna: COLUNAS[c] };
      }
    }
    return null;
  }
  // chave do data-prever -> { it } (catálogo) ou { entrada, coluna } (avulso/órfão)
  function resolve(chave) {
    if (!chave) return null;
    if (chave.indexOf('e:') === 0) {
      var a = acharEntrada(chave.slice(2));
      if (!a) return null;
      var e = a.entrada;
      if (!e.avulso && e.id && D.porId[e.id]) return { it: D.porId[e.id], entrada: e, coluna: a.coluna };
      return { entrada: e, coluna: a.coluna };
    }
    var it = D.porId[chave];
    return it ? { it: it } : null;
  }

  // ------------------------------------------------------------ conteúdo
  function metaTexto(it) {
    var p = [];
    if (it.valor) p.push('Valor ' + it.valor + ' Sins');      // fórmula como está, nunca convertida
    if (it.cr) p.push('CR ' + it.cr);
    if (it.cd != null && it.craft && it.craft !== 'Não-craftável') p.push(it.craft + ' CD ' + it.cd);
    return p.join(' · ');
  }
  function medalhao(it) {
    if (it.arte) return U.arte(it, 'bz-ct-ico');
    return '<span class="bz-ct-med">' + U.svg(U.icoCat(it)) + '</span>';
  }
  // parte estática, em cache por id
  function cartaoHTML(id) {
    if (cache.has(id)) return cache.get(id);
    var it = D.porId[id];
    if (!it) return '';
    var meta = metaTexto(it);
    var h = '<header class="bz-ct-cab">' + medalhao(it) +
        '<div class="bz-ct-titulo">' +
          '<p class="bz-ct-nome">' + esc(it.nome) + '</p>' +
          '<div class="item-chips">' +
            '<span class="tag-rar">' + U.icoRar(it.raridade) + esc(it.raridade) + '</span>' +
            '<span class="tag-cat">' + esc(it.categoria) + '</span>' +
            (it.arquetipo ? '<span class="tag-arq">' + esc(it.arquetipo) + '</span>' : '') +
          '</div>' +
        '</div>' +
      '</header>' +
      '<p class="bz-ct-efeito">' + esc(it.efeito) + '</p>' +
      (meta ? '<p class="bz-ct-meta">' + esc(meta) + '</p>' : '') +
      '<p class="bz-ct-peso">' + esc(U.pesoTexto(it)) + '</p>';
    cache.set(id, h);
    return h;
  }
  function avulsoHTML(e, coluna) {
    return '<header class="bz-ct-cab">' +
        '<span class="bz-ct-med avulso">' + U.svg('ico-bugiganga') + '</span>' +
        '<div class="bz-ct-titulo">' +
          '<p class="bz-ct-nome">' + esc(e.nome || '—') + '</p>' +
          '<p class="bz-ct-sem">item sem registro</p>' +
        '</div>' +
      '</header>' +
      '<p class="bz-ct-peso">' + esc(ROTULO[coluna] || '') + '</p>';
  }
  // rodapé dinâmico: recalculado a cada abertura e a cada mudança da ficha
  function rodapeHTML(it, alvo) {
    var k = U.kf();
    if (!k || !it) return '';
    var total = 0, cols = [];
    try {
      total = +k.tenho(it.id) || 0;
      var inv = k.inventario();
      COLUNAS.forEach(function (c) {
        (inv[c] || []).forEach(function (e) {
          if (e && !e.avulso && e.id === it.id && cols.indexOf(c) < 0) cols.push(c);
        });
      });
    } catch (err) { return ''; }
    var h = '<p class="bz-ct-tem">No inventário: <b>' + total + '</b>' +
      (cols.length ? ' (' + cols.map(function (c) { return ROTULO[c]; }).join(' + ') + ')' : '') + '</p>';
    var pede = alvo ? parseInt(alvo.getAttribute('data-pede'), 10) : NaN;
    if (pede > 0) {
      var cls = total >= pede ? 'ok' : total > 0 ? 'parcial' : 'zero';
      h += '<p class="bz-ct-pede ' + cls + '">Receita pede <b>' + pede + '</b> · você tem <b class="bz-ct-x">' + total + '</b></p>';
    }
    return h;
  }
  function preenche(alvo, r) {
    var corpo, pe;
    if (r.it) {
      corpo = cartaoHTML(r.it.id);
      pe = rodapeHTML(r.it, alvo);
      no.className = 'bz-cartao ' + U.classeRar(r.it.raridade);
    } else {
      corpo = avulsoHTML(r.entrada, r.coluna);
      pe = '';
      no.className = 'bz-cartao rar-ordinario bz-ct-avulso';
    }
    no.innerHTML = '<div class="bz-ct-corpo">' + corpo + '</div>' +
      (pe ? '<footer class="bz-ct-pe">' + pe + '</footer>' : '');
  }
  function atualizaRodape() {
    if (!cur.aberto || !cur.alvo) return;
    var r = resolve(cur.chave);
    if (!r) return fechar(true);
    if (!r.it) return;
    var pe = rodapeHTML(r.it, cur.alvo);
    var f = no.querySelector('.bz-ct-pe');
    if (f && pe) f.innerHTML = pe;
    else if (f) f.remove();
    else if (pe) no.insertAdjacentHTML('beforeend', '<footer class="bz-ct-pe">' + pe + '</footer>');
  }

  // ------------------------------------------------------------ posição
  function posiciona(alvo) {
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var vh = document.documentElement.clientHeight || window.innerHeight;
    var H = no.offsetHeight;
    var r = alvo.getBoundingClientRect();
    var rc = alvo.closest('#bz-receita'), inv = alvo.closest('#bz-inventario');
    var x, y, seta, pos;
    if (rc) x = rc.getBoundingClientRect().right + VAO;
    else if (inv) x = inv.getBoundingClientRect().left - VAO - W;
    else x = r.right + VAO;
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
    var corpo = no.querySelector('.bz-ct-corpo');
    if (corpo) corpo.classList.toggle('corta', corpo.scrollHeight > corpo.clientHeight + 1);
  }

  // ------------------------------------------------------------ aria-describedby
  function poeDesc(el) {
    if (!el) return;
    var antes = el.getAttribute('aria-describedby');
    cur.desc = el;
    cur.descAntes = antes;
    var ids = (antes || '').split(/\s+/).filter(Boolean);
    if (ids.indexOf('bz-preview') < 0) ids.push('bz-preview');
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
  function abrirAgora(alvo, o) {
    o = o || {};
    limpaPend();
    clearTimeout(fechaT);
    if (!alvo || !document.contains(alvo)) return false;
    var chave = alvo.getAttribute('data-prever') || '';
    var modo = o.modo || 'mouse';
    var desc = o.desc || alvo;
    if (cur.aberto && cur.alvo === alvo) {
      cur.modo = modo; cur.foco = o.foco || null;
      if (cur.desc !== desc) { tiraDesc(); poeDesc(desc); }
      return true;
    }
    var r = resolve(chave);
    if (!r) return false;
    tiraDesc();
    clearTimeout(saiT);
    var trocando = cur.aberto && !no.hidden;
    preenche(alvo, r);
    cur.aberto = true; cur.alvo = alvo; cur.chave = chave; cur.modo = modo; cur.foco = o.foco || null;
    poeDesc(desc);
    no.hidden = false;
    if (trocando) {
      // troca direta entre gatilhos (modo quente): sem fade, só reposiciona
      no.classList.add('vis');
      posiciona(alvo);
      return true;
    }
    U.raf(function () {
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
  function agendar(alvo, o) {
    o = o || {};
    if (!alvo) return;
    var modo = o.modo || 'mouse';
    if (cur.aberto && cur.alvo === alvo) {
      clearTimeout(fechaT); fechaT = null;
      abrirAgora(alvo, o);         // atualiza modo/foco/descrição, sem refazer
      return;
    }
    var ms = o.atraso != null ? o.atraso : (ATRASO[modo] || ATRASO.mouse);
    if (quente()) ms = 0;
    limpaPend();
    if (ms <= 0) { abrirAgora(alvo, o); return; }
    pend.alvo = alvo; pend.desc = o.desc || null; pend.foco = o.foco || null; pend.modo = modo;
    pend.t = setTimeout(function () {
      pend.t = null;
      abrirAgora(alvo, o);
    }, ms);
  }

  // ------------------------------------------------------------ ponteiro
  function ponteiroOk(e) {
    return !semHover && (e.pointerType === 'mouse' || e.pointerType === 'pen');
  }
  document.addEventListener('pointerover', function (e) {
    if (!ponteiroOk(e)) return;
    var g = gatilhoDe(e.target);
    if (!g || g === bloqueado) return;
    if (agora() < calmoAte) return;
    if (pend.alvo === g && pend.modo === 'mouse') return;   // movimento dentro do mesmo gatilho
    agendar(g, { modo: 'mouse' });
  });
  // "300ms parado": cada movimento dentro do gatilho reinicia a espera
  document.addEventListener('pointermove', function (e) {
    if (!pend.t || pend.modo !== 'mouse' || !ponteiroOk(e)) return;
    var alvo = pend.alvo;
    if (gatilhoDe(e.target) !== alvo) return;
    clearTimeout(pend.t);
    pend.t = setTimeout(function () { pend.t = null; abrirAgora(alvo, { modo: 'mouse' }); }, ATRASO.mouse);
  }, { passive: true });
  document.addEventListener('pointerout', function (e) {
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
  document.addEventListener('pointerdown', function (e) {
    ultimaTecla = false;
    bloqueado = gatilhoDe(e.target);
    fechar(true);
  }, true);
  document.addEventListener('wheel', function () {
    calmoAte = agora() + CALMO;
    if (pend.modo === 'mouse') limpaPend();
    fechar(true);
  }, { capture: true, passive: true });
  var rolaT = 0;
  document.addEventListener('scroll', function () {
    // o foco por teclado pode rolar o gatilho para a vista: a espera do teclado continua
    if (pend.modo === 'mouse') { limpaPend(); calmoAte = agora() + CALMO; }
    if (!cur.aberto) return;
    if (cur.modo === 'mouse') { fechar(true); return; }
    // teclado/combobox: o gatilho segue focado (o próprio focus() rola a página).
    // Acompanha enquanto ele estiver à vista; fora dela, some.
    if (rolaT) return;
    rolaT = U.raf(function () {
      rolaT = 0;
      if (!cur.aberto || cur.modo === 'mouse' || !cur.alvo) return;
      var r = cur.alvo.getBoundingClientRect();
      var vh = document.documentElement.clientHeight || window.innerHeight;
      if (!r.width || r.bottom < 0 || r.top > vh) fechar(true);
      else posiciona(cur.alvo);
    });
  }, { capture: true, passive: true });
  document.addEventListener('dragstart', function () { fechar(true); }, true);
  window.addEventListener('blur', function () { fechar(true); });

  // ------------------------------------------------------------ teclado
  document.addEventListener('keydown', function () { ultimaTecla = true; }, true);
  document.addEventListener('focusin', function (e) {
    var t = e.target;
    if (!t || t.nodeType !== 1) return;
    var g = gatilhoDe(t);
    // na Lista o foco fica na linha (tr): o gatilho é a célula Nome dela
    if (!g && t.matches && t.matches('#bz-resultados tr.item-card')) g = t.querySelector('td.c-nome[data-prever]');
    if (!g || !focoVisivel(t)) return;
    agendar(g, { modo: 'teclado', desc: t, foco: t });
  });
  document.addEventListener('focusout', function (e) {
    var t = e.target;
    if (pend.foco === t && pend.modo !== 'mouse') limpaPend();
    if (cur.aberto && cur.foco === t && cur.modo !== 'mouse') fechar(false, true);
  });

  // combobox: a opção destacada (aria-activedescendant) também abre, em 300ms
  if (window.MutationObserver) {
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        var dono = m.target;
        if (dono !== document.activeElement) return;
        var id = dono.getAttribute('aria-activedescendant');
        var op = id ? document.getElementById(id) : null;
        var g = gatilhoDe(op);
        if (!g) {
          if (pend.foco === dono && pend.modo === 'ad') limpaPend();
          if (cur.aberto && cur.modo === 'ad' && cur.foco === dono) fechar(true);
          return;
        }
        agendar(g, { modo: 'ad', desc: op, foco: dono });
      });
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['aria-activedescendant'] });
  }

  // Esc em camadas: o pop-up primeiro (10), depois o combobox (20) e o painel (30)
  BZ.camadaEsc(10, function () {
    if (cur.aberto) { fechar(true); return true; }
    if (pend.t) limpaPend();       // espera pendente não consome o Esc
    return false;
  });

  // re-render tirou o gatilho do DOM, ou o inventário mudou: fecha ou refaz o rodapé
  function confere() {
    if (!cur.aberto) return;
    if (!cur.alvo || !document.contains(cur.alvo)) { fechar(true); return; }
    atualizaRodape();
  }
  BZ.aoRender.push(confere);
  BZ.aoMudar.push(confere);

  BZ.cartao = {
    // abre já (opts: {modo:'mouse'|'teclado'|'ad', desc, foco})
    abrir: function (el, o) { return abrirAgora(gatilhoDe(el) || el, o || {}); },
    // abre com a espera do modo (opts.atraso sobrepõe), respeitando o modo quente
    agendar: function (el, o) { agendar(gatilhoDe(el) || el, o || {}); },
    fechar: function () { return fechar(true); },
    aberto: function () { return cur.aberto; },
    gatilho: function () { return cur.alvo; },
    cartaoHTML: cartaoHTML
  };
})(window.BZ);
