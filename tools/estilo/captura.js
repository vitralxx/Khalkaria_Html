/* tools/estilo/captura.js — captura do estilo computado de uma página.
 *
 * Duas formas de uso:
 *  1. Roteiro inteiro: tools/estilo/rodar.html carrega este arquivo e aplica
 *     KhEstilo.capturar() a cada página dentro de um <iframe> do tamanho pedido.
 *  2. À mão: colar o arquivo no console (ou no javascript_tool) da página e rodar
 *       await KhEstilo.capturar(window, {rotulo: 'antes', nome: 'magias.teste'})
 *
 * O que faz: espera a página assentar (load, fontes, seletor, DOM quieto,
 * imagens lazy forçadas a carregar), termina as transições e para as animações
 * infinitas no quadro 0, percorre <html>, <body> e todos os descendentes do
 * body (visíveis e ocultos; script/style/template ficam de fora) e grava uma
 * lista fixa de propriedades computadas, mais ::before/::after quando têm
 * content. POST para /__captura do tools/estilo/servidor.py.
 *
 * Formato "kh-estilo/1" (comprimido; o tools/estilo/diff.py expande):
 *   valores  lista de strings únicas
 *   props    nomes das propriedades de uma "linha" (sem width/height)
 *   linhas   [[índice em valores, …na ordem de props]]   (linhas repetidas viram 1)
 *   pprops   propriedades dos pseudo-elementos
 *   plinhas  idem para ::before/::after
 *   els      [[pai, segmento, linha, width, height, ::before, ::after]]
 *            pai = índice em els (-1 na raiz); width/height = índice em valores;
 *            ::before/::after = índice em plinhas ou -1
 *   segmento = tag#id.classe…:n  (n = posição entre irmãos da mesma tag, 1-base)
 */
(function (global) {
  'use strict';

  var PROPS = [
    'display', 'position', 'top', 'left', 'right', 'bottom',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'box-sizing', 'color', 'background-color', 'background-image',
    'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
    'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
    'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
    'border-top-left-radius', 'border-top-right-radius',
    'border-bottom-right-radius', 'border-bottom-left-radius',
    'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
    'letter-spacing', 'text-transform', 'text-decoration-line',
    'opacity', 'visibility', 'z-index', 'overflow-x', 'overflow-y', 'transform',
    'box-shadow', 'row-gap', 'column-gap', 'grid-template-columns',
    'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
    'justify-content', 'align-items', 'align-self', 'align-content',
    'cursor', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
    'transition-duration', 'animation-name'
  ];
  var GEO = ['width', 'height'];
  var PPROPS = ['content', 'display', 'color', 'background-color', 'background-image',
    'width', 'height'];
  var PULA = { SCRIPT: 1, STYLE: 1, LINK: 1, META: 1, TEMPLATE: 1, NOSCRIPT: 1, TITLE: 1, BASE: 1 };

  function dorme(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // espera N quadros, sem travar se o navegador segura o rAF (painel oculto)
  function quadros(win, n) {
    return new Promise(function (res) {
      var feito = false, k = 0;
      function fim() { if (!feito) { feito = true; res(k); } }
      function f() { if (++k >= n) fim(); else win.requestAnimationFrame(f); }
      win.requestAnimationFrame(f);
      setTimeout(fim, 1500 * n);
    });
  }

  // até `quieto` ms sem mutação no DOM (teto `teto` ms)
  function quietude(win, quieto, teto, volateis) {
    return new Promise(function (res) {
      var doc = win.document, t0 = Date.now(), ultimo = Date.now(), n = 0;
      var obs = new win.MutationObserver(function (ms) {
        ms = ms.filter(function (m) { return !(m.type === 'attributes' && volatil(m.target, volateis)); });
        if (!ms.length) return;
        n += ms.length; ultimo = Date.now();
      });
      obs.observe(doc.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
      (function passo() {
        var agora = Date.now();
        if (agora - ultimo >= quieto || agora - t0 >= teto) {
          obs.disconnect();
          res({ mutacoes: n, esgotou: agora - t0 >= teto });
        } else setTimeout(passo, 50);
      })();
    });
  }

  function esperaSeletor(win, sel, teto) {
    var t0 = Date.now();
    return new Promise(function (res) {
      (function passo() {
        var ok = false;
        try { ok = !!win.document.querySelector(sel); } catch (e) { ok = false; }
        if (ok) return res(true);
        if (Date.now() - t0 >= teto) return res(false);
        setTimeout(passo, 50);
      })();
    });
  }

  // imagens lazy entram já: a altura delas mexe no layout, e quando o navegador
  // decide carregá-las depende do quadro — seria diferença entre duas capturas iguais
  function imagens(win, teto) {
    var doc = win.document;
    var imgs = Array.prototype.slice.call(doc.images);
    imgs.forEach(function (im) { if (im.loading === 'lazy') im.loading = 'eager'; });
    var t0 = Date.now();
    return new Promise(function (res) {
      (function passo() {
        var falta = imgs.filter(function (im) { return !im.complete; }).length;
        if (!falta || Date.now() - t0 >= teto) return res({ total: imgs.length, pendentes: falta });
        setTimeout(passo, 50);
      })();
    });
  }

  // transições terminam no estado final; animações finitas também; as infinitas
  // param no quadro 0 (a do Limiar, o brilho do Bazar, o pulso do logo); SMIL idem
  function assentaAnimacoes(doc) {
    var n = 0;
    // SMIL (<animate> dentro de <svg>, a árvore do Limiar) não aparece em
    // getAnimations: cada <svg> raiz para e volta ao tempo 0
    Array.prototype.forEach.call(doc.querySelectorAll('svg'), function (s) {
      if (s.ownerSVGElement || typeof s.pauseAnimations !== 'function') return;
      if (!s.querySelector('animate, animateTransform, animateMotion, set')) return;
      try { s.pauseAnimations(); s.setCurrentTime(0); n++; } catch (e) {}
    });
    if (!doc.getAnimations) return n;
    doc.getAnimations().forEach(function (a) {
      n++;
      try {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
        if (t.iterations === Infinity || t.endTime === Infinity) { a.pause(); a.currentTime = 0; }
        else a.finish();
      } catch (e) { try { a.cancel(); } catch (e2) {} }
    });
    return n;
  }

  // volateis: [{seletor, props}] = propriedades que um script da página anima
  // quadro a quadro (a árvore do Limiar). Saem como "(volátil)" nas capturas e
  // as mutações de atributo nesses elementos não contam para a quietude.
  function volatil(el, volateis) {
    if (!volateis || !volateis.length || !el.matches) return null;
    var props = null;
    volateis.forEach(function (x) {
      if (el.matches(x.seletor)) props = (props || []).concat(x.props);
    });
    return props;
  }

  function segmento(el) {
    var tag = el.tagName.toLowerCase();
    var s = tag;
    if (el.id) s += '#' + el.id;
    var cls = el.getAttribute('class');
    if (cls) {
      cls = cls.trim().split(/\s+/).filter(Boolean);
      if (cls.length) s += '.' + cls.join('.');
    }
    var n = 1, irm = el.previousElementSibling;
    while (irm) { if (irm.tagName === el.tagName) n++; irm = irm.previousElementSibling; }
    return s + ':' + n;
  }

  function coleta(win, volateis) {
    var doc = win.document;
    var valores = [], idxValor = Object.create(null);
    function v(s) {
      var i = idxValor[s];
      if (i === undefined) { i = idxValor[s] = valores.length; valores.push(s); }
      return i;
    }
    var linhas = [], idxLinha = Object.create(null);
    var plinhas = [], idxPlinha = Object.create(null);
    function linha(arr, lista, idx) {
      var k = arr.join(',');
      var i = idx[k];
      if (i === undefined) { i = idx[k] = lista.length; lista.push(arr); }
      return i;
    }
    function pseudo(el, qual) {
      var cs = win.getComputedStyle(el, qual);
      var c = cs.getPropertyValue('content');
      if (!c || c === 'none' || c === 'normal') return -1;
      return linha(PPROPS.map(function (p) { return v(cs.getPropertyValue(p)); }), plinhas, idxPlinha);
    }
    var els = [];
    function visita(el, pai) {
      if (PULA[el.tagName]) return;
      var cs = win.getComputedStyle(el);
      var vol = volatil(el, volateis);
      var l = linha(PROPS.map(function (p) {
        return v(vol && vol.indexOf(p) >= 0 ? '(volátil)' : cs.getPropertyValue(p));
      }), linhas, idxLinha);
      var i = els.length;
      els.push([pai, segmento(el), l, v(cs.getPropertyValue('width')), v(cs.getPropertyValue('height')),
        pseudo(el, '::before'), pseudo(el, '::after')]);
      var body = el === doc.documentElement ? doc.body : null;
      if (body) { visita(body, i); return; }       // de <html> só o <body>; o <head> fica fora
      for (var c = el.firstElementChild; c; c = c.nextElementSibling) visita(c, i);
    }
    visita(doc.documentElement, -1);
    return {
      formato: 'kh-estilo/1',
      viewport: [win.innerWidth, win.innerHeight],
      html: {
        attrs: Array.prototype.map.call(doc.documentElement.attributes, function (a) { return a.name + '=' + a.value; }).sort(),
        body: doc.body.getAttribute('class') || ''
      },
      props: PROPS, geo: GEO, pprops: PPROPS,
      valores: valores, linhas: linhas, plinhas: plinhas, els: els
    };
  }

  /* opts: rotulo, nome (POST só com os dois), esperar (seletor), minimo (ms depois
     do load, padrão 600), quieto (ms sem mutação, padrão 800), teto (ms, padrão 15000),
     url (servidor; padrão a origem da página), volateis ([{seletor, props}]) */
  function capturar(win, opts) {
    opts = opts || {};
    var doc = win.document;
    var avisos = [];
    var carregou = doc.readyState === 'complete' ? Promise.resolve()
      : new Promise(function (r) { win.addEventListener('load', r, { once: true }); });
    var meta = {};
    return carregou
      .then(function () { return dorme(opts.minimo == null ? 600 : opts.minimo); })
      .then(function () {
        if (!opts.esperar) return true;
        return esperaSeletor(win, opts.esperar, opts.teto || 15000);
      })
      .then(function (ok) { if (!ok) avisos.push('seletor não apareceu: ' + opts.esperar); })
      .then(function () { return doc.fonts ? doc.fonts.ready : null; })
      .then(function () { return imagens(win, 8000); })
      .then(function (im) { meta.imagens = im; if (im.pendentes) avisos.push(im.pendentes + ' imagem(ns) sem carregar'); })
      .then(function () { return quadros(win, 3); })
      .then(function () { return quietude(win, opts.quieto || 800, opts.teto || 15000, opts.volateis); })
      .then(function (q) { meta.mutacoes = q.mutacoes; if (q.esgotou) avisos.push('DOM não aquietou'); })
      .then(function () { return doc.fonts ? doc.fonts.ready : null; })
      .then(function () {
        meta.animacoes = assentaAnimacoes(doc);
        var r = coleta(win, opts.volateis);
        r.pagina = win.location.pathname.replace(/^\//, '') + win.location.hash;
        r.nome = opts.nome || '';
        r.meta = meta;
        r.avisos = avisos;
        if (!opts.rotulo || !opts.nome) return { captura: r };
        var base = opts.url || win.location.origin;
        var q = '?rotulo=' + encodeURIComponent(opts.rotulo) + '&nome=' + encodeURIComponent(opts.nome);
        return fetch(base + '/__captura' + q, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r)
        }).then(function (resp) { return resp.json(); })
          .then(function (j) {
            return { arquivo: j.arquivo, bytes: j.bytes, erro: j.erro, elementos: r.els.length,
              linhas: r.linhas.length, avisos: avisos };
          });
      });
  }

  global.KhEstilo = { capturar: capturar, coleta: coleta, PROPS: PROPS, PPROPS: PPROPS };
})(typeof window !== 'undefined' ? window : this);
