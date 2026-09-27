/* cascata.js — vencedor DECLARADO da cascata por elemento x propriedade.
 * Complementa captura.js: cobre :hover/:focus/:focus-visible/:focus-within/:active
 * (tratados como verdadeiros ao mesmo tempo), media de largura em várias janelas e
 * prefers-reduced-motion (passada extra com ele ligado). Modela @layer, !important,
 * especificidade, ordem e atributo style.
 * Saída: {els: {caminho: {prop: [valor, origem]}}} por passada. */
(function (global) {
  'use strict';
  var DIN = /:(hover|focus-visible|focus-within|focus|active)(?![\w-])/g;

  function splitTop(s, sep) {
    var out = [], d = 0, cur = '', q = null;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (q) { cur += ch; if (ch === '\\') { cur += s[++i] || ''; } else if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
      if (ch === '(' || ch === '[') d++;
      if (ch === ')' || ch === ']') d--;
      if (ch === sep && d === 0) { out.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  // especificidade [a,b,c] de UM seletor complexo
  function spec(sel) {
    var a = 0, b = 0, c = 0, i = 0, n = sel.length;
    function add(s) { a += s[0]; b += s[1]; c += s[2]; }
    function maxOf(list) {
      var m = [0, 0, 0];
      splitTop(list, ',').forEach(function (x) { var s = spec(x); if (cmp(s, m) > 0) m = s; });
      return m;
    }
    function paren(j) { // j aponta para '('; devolve [conteúdo, índice após ')']
      var d = 0, k = j;
      for (; k < n; k++) { if (sel[k] === '(') d++; else if (sel[k] === ')') { d--; if (!d) break; } }
      return [sel.slice(j + 1, k), k + 1];
    }
    while (i < n) {
      var ch = sel[i];
      if (ch === '#') { a++; i++; while (i < n && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '.') { b++; i++; while (i < n && /[\w-]/.test(sel[i])) i++; }
      else if (ch === '[') { b++; var d = 0; for (; i < n; i++) { if (sel[i] === '[') d++; else if (sel[i] === ']') { d--; if (!d) { i++; break; } } } }
      else if (ch === ':') {
        var pe = sel[i + 1] === ':'; i += pe ? 2 : 1;
        var st = i; while (i < n && /[\w-]/.test(sel[i])) i++;
        var nome = sel.slice(st, i).toLowerCase();
        var arg = null;
        if (sel[i] === '(') { var r = paren(i); arg = r[0]; i = r[1]; }
        if (pe || /^(before|after|first-line|first-letter)$/.test(nome)) c++;
        else if (nome === 'where') {}
        else if (nome === 'is' || nome === 'not' || nome === 'has' || nome === 'matches') add(maxOf(arg || ''));
        else if ((nome === 'nth-child' || nome === 'nth-last-child') && arg && / of /.test(arg)) { b++; add(maxOf(arg.split(/ of /)[1])); }
        else b++;
      }
      else if (/[a-zA-Z_-]/.test(ch) || ch.charCodeAt(0) > 127) { c++; while (i < n && /[\w-]/.test(sel[i])) i++; }
      else i++;
    }
    return [a, b, c];
  }
  function cmp(x, y) { return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]; }

  // separa o pseudo-elemento final
  function pseudoDe(sel) {
    var m = sel.match(/(::?(before|after|marker|placeholder|selection|backdrop|first-line|first-letter|-webkit-[\w-]+|-moz-[\w-]+))\s*$/);
    if (!m) return ['', sel];
    var nome = m[2];
    var base = sel.slice(0, m.index).trim();
    if (!base || /[\s>+~]$/.test(base)) base += '*';
    return ['::' + nome, base];
  }

  function segmento(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    var cls = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean);
    if (cls.length) s += '.' + cls.join('.');
    var n = 1, p = el.previousElementSibling;
    while (p) { if (p.tagName === el.tagName) n++; p = p.previousElementSibling; }
    return s + ':' + n;
  }
  function caminho(el, cache) {
    if (cache.has(el)) return cache.get(el);
    var pai = el.parentElement;
    var c = (pai ? caminho(pai, cache) + '>' : '') + segmento(el);
    cache.set(el, c);
    return c;
  }

  function coletar(win, reduzido) {
    var doc = win.document;
    var regras = [], ordemCamada = [], ordem = 0;
    function camada(nome) { if (ordemCamada.indexOf(nome) < 0) ordemCamada.push(nome); return nome; }
    function condOk(txt) {
      if (reduzido) txt = txt.replace(/\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/g, 'all');
      else txt = txt.replace(/\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/g, 'not all');
      try { return win.matchMedia(txt).matches; } catch (e) { return false; }
    }
    function andar(lista, cam, origem) {
      for (var i = 0; i < lista.length; i++) {
        var r = lista[i], t = r.constructor.name;
        if (t === 'CSSImportRule') {
          var sub = cam; if (r.layerName != null) sub = camada((cam ? cam + '.' : '') + (r.layerName || '(anon' + (ordem++) + ')'));
          if (r.media && r.media.mediaText && !condOk(r.media.mediaText)) continue;
          try { if (r.styleSheet) andar(r.styleSheet.cssRules, sub, origem + '@import'); } catch (e) {}
        } else if (t === 'CSSLayerStatementRule') {
          r.nameList.forEach(function (nm) { camada((cam ? cam + '.' : '') + nm); });
        } else if (t === 'CSSLayerBlockRule') {
          andar(r.cssRules, camada((cam ? cam + '.' : '') + (r.name || '(anon' + (ordem++) + ')')), origem);
        } else if (t === 'CSSMediaRule') {
          if (condOk(r.conditionText || r.media.mediaText)) andar(r.cssRules, cam, origem);
        } else if (t === 'CSSSupportsRule') {
          if (win.CSS.supports(r.conditionText)) andar(r.cssRules, cam, origem);
        } else if (t === 'CSSContainerRule') {
          andar(r.cssRules, cam, origem + '@container');   // tratado como verdadeiro
        } else if (t === 'CSSStyleRule') {
          regras.push({ sel: r.selectorText, style: r.style, cam: cam, ordem: ordem++, origem: origem, css: r.style.cssText });
        }
      }
    }
    Array.prototype.forEach.call(doc.styleSheets, function (ss) {
      var o = ss.href ? ss.href.replace(/^.*\//, '').replace(/\?.*$/, '') : ('<style' + (ss.ownerNode && ss.ownerNode.id ? '#' + ss.ownerNode.id : '') + '>');
      if (ss.media && ss.media.mediaText && !condOk(ss.media.mediaText)) return;
      try { andar(ss.cssRules, '', o); } catch (e) {}
    });
    return { regras: regras, camadas: ordemCamada };
  }

  function analisar(win, reduzido) {
    var doc = win.document;
    var C = coletar(win, reduzido);
    var rank = {}; C.camadas.forEach(function (c, i) { rank[c] = i; });
    var UNL = C.camadas.length;
    var decl = new Map(); // "el|pseudo" -> {prop: [cands]}
    var alvo = new Map();
    function push(el, pseudo, prop, cand) {
      var m = alvo.get(el); if (!m) { m = {}; alvo.set(el, m); }
      var k = pseudo || '';
      var mp = m[k] || (m[k] = {});
      (mp[prop] || (mp[prop] = [])).push(cand);
    }
    var erros = [];
    C.regras.forEach(function (r) {
      var lr = r.cam === '' ? UNL : rank[r.cam];
      var props = [];
      for (var i = 0; i < r.style.length; i++) {
        var p = r.style[i];
        var v = r.style.getPropertyValue(p);
        props.push([p, v === '' ? '{pendente:' + r.css + '}' : v, r.style.getPropertyPriority(p) === 'important']);
      }
      if (!props.length) return;
      splitTop(r.sel, ',').forEach(function (s) {
        var ps = pseudoDe(s), pseudo = ps[0], base = ps[1];
        var mod = base.replace(DIN, '').replace(/:not\(\s*\)/g, '');
        if (!mod.trim() || /[\s>+~(]$/.test(mod.trim())) mod += '*';
        var els;
        try { els = doc.querySelectorAll(mod); }
        catch (e) { try { els = doc.querySelectorAll(base); } catch (e2) { erros.push(s); return; } }
        if (!els.length) return;
        var sp = spec(s);
        els.forEach(function (el) {
          props.forEach(function (pv) {
            push(el, pseudo, pv[0], { v: pv[1], imp: pv[2], lr: lr, sp: sp, o: r.ordem, src: r.origem + ' ' + s });
          });
        });
      });
    });
    // atributo style
    doc.querySelectorAll('[style]').forEach(function (el) {
      for (var i = 0; i < el.style.length; i++) {
        var p = el.style[i];
        push(el, '', p, { v: el.style.getPropertyValue(p) || '{pendente:' + el.style.cssText + '}', imp: el.style.getPropertyPriority(p) === 'important', lr: UNL + 1, sp: [9, 9, 9], o: 1e9, src: 'style=' });
      }
    });
    function melhor(a, b) { // true se a vence b
      if (a.imp !== b.imp) return a.imp;
      if (a.lr !== b.lr) return a.imp ? a.lr < b.lr : a.lr > b.lr;
      var c = cmp(a.sp, b.sp); if (c) return c > 0;
      return a.o > b.o;
    }
    var cache = new Map(), out = {};
    alvo.forEach(function (m, el) {
      if (!doc.documentElement.contains(el)) return;
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'META' || tag === 'TITLE') return;
      var cam = caminho(el, cache);
      Object.keys(m).forEach(function (pseudo) {
        var mp = m[pseudo], res = {};
        Object.keys(mp).forEach(function (p) {
          var best = null;
          mp[p].forEach(function (c) { if (!best || melhor(c, best)) best = c; });
          res[p] = [best.v + (best.imp ? ' !important' : ''), best.src];
        });
        out[cam + (pseudo ? '|' + pseudo : '')] = res;
      });
    });
    return { camadas: C.camadas, regras: C.regras.length, erros: erros, els: out };
  }

  global.KhCascata = { analisar: analisar, spec: spec, splitTop: splitTop };
})(typeof window !== 'undefined' ? window : this);
