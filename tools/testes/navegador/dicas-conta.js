/* Khalkaria — prova da correção 2 do drawer da ficha nova
 * (docs/ficha-digital/07-f4-6-ensaio.md §0, item 2).
 *
 * O QUE PROVA
 *   A dica de fórmula de TODA conta (.kh-conta) das 5 abas, no drawer da ficha
 *   nova (pages/sistema.html, drawer aberto) e na página da ficha
 *   (pages/ficha.html), a 1366x768 e a 1920x1080, nunca fica cortada:
 *     - pela janela (sai da área visível);
 *     - pela caixa que rola (um ancestral com overflow diferente de visible que
 *       a recorta: no drawer, a .fd-gaveta-rolagem);
 *     - por altura máxima (o texto não cabe e fica escondido dentro da dica).
 *   Cada conta é posta em 3 lugares da área visível da caixa (no topo, no meio
 *   e embaixo; o que a rolagem alcança) e a dica é aberta como pelo teclado: a
 *   marca de foco do redesenho (data-fd-foco / data-fp-foco, que o CSS mostra)
 *   e um focusin, que é o que o drawer e a página escutam para encaixar a dica.
 *   Informativo: quantas ficaram fora da caixa (sem corte) e quantas foram
 *   postas fora do fluxo (position: fixed).
 *
 * COMO RODAR (site servido localmente: python -m http.server 8899 --bind
 * 127.0.0.1, ou a configuração 'site-local' do .claude/launch.json)
 *   0. precisa de uma ficha atual (v2) no navegador, em localStorage.khalkaria_ficha
 *      (p.ex. a fixture tools/testes/fixtures/ficha-v2-sintetica.json). O script
 *      NÃO grava chave de ficha: sem ficha, ele para e avisa.
 *   1. abra qualquer página do site (p.ex. http://127.0.0.1:8899/index.html);
 *   2. no console do navegador (F12), cole este arquivo inteiro, OU carregue-o:
 *        var s = document.createElement('script');
 *        s.src = '/tools/testes/navegador/dicas-conta.js?' + Date.now();
 *        document.head.appendChild(s);
 *   3. espere window.__provaDicas.fim === true (o progresso sai no console). O
 *      resumo fica em window.__provaDicas.resumo (e num console.table); as dicas
 *      cortadas, em window.__provaDicas.itens[i].cortadas.
 *   Opcional, ANTES de carregar: window.__provaDicasOpcoes = {
 *     telas: [[1366, 768], [1920, 1080]], onde: ['drawer', 'pagina'], abas: ['nucleo', ...] }
 *
 * Cada caso abre num <iframe> do tamanho pedido (o viewport é o do iframe, não
 * o da janela: o painel pode estar de qualquer tamanho, até oculto). Durante a
 * prova o script põe no localStorage a prévia ligada (khalkaria_ficha_previa=1),
 * o drawer aberto (khalkaria_ficha3_dock=aberto) e o splash visto; no fim
 * devolve essas chaves, e a aba aberta da sessão (sessionStorage
 * khalkaria_ficha_aba), exatamente como estavam. Não depende de
 * requestAnimationFrame (o painel oculto o segura).
 */
(function () {
  'use strict';
  var OP = window.__provaDicasOpcoes || {};
  var TELAS = OP.telas || [[1366, 768], [1920, 1080]];
  var ONDE = OP.onde || ['drawer', 'pagina'];
  var ABAS = OP.abas || ['nucleo', 'tecnicas', 'cartas', 'bazar', 'grimorio'];
  var CHAVES = { khalkaria_ficha_previa: '1', khalkaria_ficha3_dock: 'aberto', khalkaria_splash_seen: '1' };
  var CHAVE_ABA = 'khalkaria_ficha_aba';
  var TOL = 0.5;   // px: arredondamento de subpixel
  // onde: a página, a caixa (que rola, no drawer; a página inteira, na página
  // da ficha), a aba e o painel de cada id, e a marca de foco do redesenho
  var CASOS = {
    drawer: { pagina: 'pages/sistema.html', caixa: '#fd-gaveta-rolagem', aba: '#fd-gaveta-a-', painel: '#fd-gaveta-p-', foco: 'data-fd-foco' },
    pagina: { pagina: 'pages/ficha.html', caixa: '#fp', aba: '#fp-aba-', painel: '#fp-painel-', foco: 'data-fp-foco' }
  };

  var P = window.__provaDicas = { fim: false, feito: 0, total: 0, itens: [], erros: [], resumo: null };

  function raizSite() {
    var s = document.querySelector('script[src*="js/ficha.js"]') || document.querySelector('script[src*="js/main.js"]');
    try { if (s) return new URL('../', s.src).href; } catch (e) { /* segue */ }
    return location.origin + '/';
  }
  var RAIZ = raizSite();
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
  function assenta(doc) {
    if (!doc.getAnimations) return;
    doc.getAnimations().forEach(function (a) {
      try {
        var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
        if (t.iterations === Infinity || t.endTime === Infinity) { a.pause(); a.currentTime = 0; } else a.finish();
      } catch (e) { /* segue */ }
    });
  }
  function r1(n) { return Math.round(n * 10) / 10; }

  // a medida de uma dica aberta: o que a corta (janela, ancestral que recorta, altura)
  function medeDica(w, conta, caixa) {
    var d = conta.querySelector('.kh-conta-dica');
    var doc = w.document, de = doc.documentElement;
    if (!d) return { erro: 'sem .kh-conta-dica' };
    var rd = d.getBoundingClientRect();
    if (!rd.width) return { fechada: true };
    var W = de.clientWidth, H = de.clientHeight;
    var cortes = [];
    if (rd.left < -TOL || rd.top < -TOL || rd.right > W + TOL || rd.bottom > H + TOL) {
      cortes.push('janela (' + [r1(rd.left), r1(rd.top), r1(rd.right), r1(rd.bottom)].join(', ') + ' em ' + W + 'x' + H + ')');
    }
    var cs = w.getComputedStyle(d);
    if (cs.position !== 'fixed') {
      // cada ancestral que recorta (overflow diferente de visible): a dica dentro da caixa de padding dele
      for (var a = d.parentElement; a && a !== de; a = a.parentElement) {
        var s = w.getComputedStyle(a);
        if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
        var ra = a.getBoundingClientRect();
        var x0 = ra.left + a.clientLeft, y0 = ra.top + a.clientTop;
        var x1 = x0 + a.clientWidth, y1 = y0 + a.clientHeight;
        if (rd.left < x0 - TOL || rd.right > x1 + TOL || rd.top < y0 - TOL || rd.bottom > y1 + TOL) {
          var lados = [['em cima', y0 - rd.top], ['embaixo', rd.bottom - y1], ['à esquerda', x0 - rd.left], ['à direita', rd.right - x1]]
            .filter(function (l) { return l[1] > TOL; }).map(function (l) { return r1(l[1]) + ' px ' + l[0]; });
          cortes.push('recortada por ' + a.tagName.toLowerCase() + (a.id ? '#' + a.id : a.classList.length ? '.' + a.classList[0] : '') +
            ' (' + lados.join(', ') + ')');
        }
      }
    }
    if (d.scrollHeight > d.clientHeight + 1) cortes.push('altura máxima (' + d.scrollHeight + ' > ' + d.clientHeight + ')');
    // informativo: dentro da área visível da caixa?
    var rc = caixa.getBoundingClientRect();
    var vis = { l: Math.max(rc.left, 0), t: Math.max(rc.top, 0), r: Math.min(rc.right, W), b: Math.min(rc.bottom, H) };
    var foraDaCaixa = rd.left < vis.l - TOL || rd.right > vis.r + TOL || rd.top < vis.t - TOL || rd.bottom > vis.b + TOL;
    return { cortes: cortes, fixa: cs.position === 'fixed', foraDaCaixa: foraDaCaixa,
      acima: rd.bottom <= conta.getBoundingClientRect().top + TOL, altura: r1(rd.height) };
  }

  // a área visível da caixa, na janela
  function visivel(w, caixa) {
    var de = w.document.documentElement, rc = caixa.getBoundingClientRect();
    return { t: Math.max(rc.top, 0), b: Math.min(rc.bottom, de.clientHeight) };
  }
  // rola até a conta ficar no topo, no meio ou embaixo da área visível
  function poe(w, onde, caixa, conta, lugar) {
    var v = visivel(w, caixa), rc = conta.getBoundingClientRect();
    var alvo = lugar === 'topo' ? v.t + 4 : lugar === 'meio' ? (v.t + v.b) / 2 - rc.height / 2 : v.b - rc.height - 4;
    var delta = rc.top - alvo;
    if (onde === 'drawer') caixa.scrollTo({ top: caixa.scrollTop + delta, behavior: 'instant' });
    else w.scrollTo({ top: w.scrollY + delta, behavior: 'instant' });
  }

  function umaAba(w, caso, onde, id) {
    var doc = w.document;
    var bt = doc.querySelector(caso.aba + id);
    if (!bt) return { aba: id, erro: 'sem a aba' };
    bt.click();
    var painel = doc.querySelector(caso.painel + id), caixa = doc.querySelector(caso.caixa);
    if (!painel || painel.hidden) return { aba: id, erro: 'o painel não abriu' };
    // os <details> fechados também têm contas: abre durante a prova e fecha depois
    var fechados = Array.prototype.filter.call(painel.querySelectorAll('details'), function (x) { return !x.open; });
    fechados.forEach(function (x) { x.open = true; });
    var contas = Array.prototype.filter.call(painel.querySelectorAll('.kh-conta'), function (c) { return c.getClientRects().length > 0; });
    var r = { aba: id, contas: contas.length, aberturas: 0, cortadas: [], foraDaCaixa: 0, fixas: 0, acima: 0, fechadas: 0 };
    contas.forEach(function (c, i) {
      var vistos = [];
      ['topo', 'meio', 'base'].forEach(function (lugar) {
        poe(w, onde, caixa, c, lugar);
        var rc = c.getBoundingClientRect(), v = visivel(w, caixa);
        // fora da área visível a conta não é alcançável pelo mouse; o mesmo lugar não conta duas vezes
        if (rc.top + rc.height / 2 < v.t || rc.top + rc.height / 2 > v.b) return;
        if (vistos.some(function (y) { return Math.abs(y - rc.top) < 3; })) return;
        vistos.push(rc.top);
        c.setAttribute(caso.foco, '');
        c.dispatchEvent(new w.FocusEvent('focusin', { bubbles: true }));
        var m = medeDica(w, c, caixa);
        c.removeAttribute(caso.foco);
        r.aberturas++;
        if (m.fechada) { r.fechadas++; return; }
        if (m.erro) { r.cortadas.push({ conta: i, lugar: lugar, motivo: m.erro }); return; }
        if (m.fixa) r.fixas++;
        if (m.acima) r.acima++;
        if (m.foraDaCaixa) r.foraDaCaixa++;
        if (m.cortes.length) {
          r.cortadas.push({ conta: i, caminho: c.getAttribute('data-caminho'), lugar: lugar, altura: m.altura,
            topoDaConta: r1(rc.top), motivo: m.cortes.join('; ') });
        }
      });
    });
    fechados.forEach(function (x) { x.open = false; });
    return r;
  }

  function umCaso(onde, tela) {
    var caso = CASOS[onde];
    var f = document.createElement('iframe');
    f.width = tela[0]; f.height = tela[1];
    f.setAttribute('style', 'position:fixed;left:0;top:0;border:0;z-index:2147483646;background:#fff;' +
      'width:' + tela[0] + 'px;height:' + tela[1] + 'px');
    var carregou = new Promise(function (r) { f.onload = r; });
    // ?prova=: a página nunca vem do cache (o HTML não leva ?v=; depois de um build, viria a versão velha)
    f.src = RAIZ + caso.pagina + '?prova=' + Date.now();
    document.body.appendChild(f);
    var w;
    return carregou.then(function () {
      w = f.contentWindow;
      // pronto: a caixa existe e os 5 painéis já foram desenhados com a ficha
      return espera(function () {
        var d = w.document, cx = d.querySelector(caso.caixa);
        if (!cx) return false;
        if (onde === 'drawer') { var g = d.getElementById('fd-gaveta'); if (!g || g.hidden) return false; }
        return ABAS.every(function (id) { var p = d.querySelector(caso.painel + id); return p && !p.hasAttribute('aria-busy'); }) &&
          !!d.querySelector(caso.caixa + ' .kh-conta');
      }, 20000);
    }).then(function (pronto) {
      if (!pronto) throw new Error('a ficha não desenhou em 20 s (' + caso.pagina + ')');
      return (w.document.fonts ? w.document.fonts.ready : Promise.resolve()).then(function () { return quietude(w, 400, 5000); });
    }).then(function () {
      assenta(w.document);
      var abas = ABAS.map(function (id) { return umaAba(w, caso, onde, id); });
      return abas;
    }).then(function (abas) { f.remove(); return abas; }, function (e) { f.remove(); throw e; });
  }

  // as chaves que a prova mexe, como estavam
  var antes = {}, abaAntes = null;
  Object.keys(CHAVES).forEach(function (k) { try { antes[k] = localStorage.getItem(k); } catch (e) { antes[k] = null; } });
  try { abaAntes = sessionStorage.getItem(CHAVE_ABA); } catch (e) { abaAntes = null; }
  function devolve() {
    Object.keys(antes).forEach(function (k) {
      try { if (antes[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, antes[k]); } catch (e) { /* segue */ }
    });
    try { if (abaAntes == null) sessionStorage.removeItem(CHAVE_ABA); else sessionStorage.setItem(CHAVE_ABA, abaAntes); } catch (e) { /* segue */ }
  }

  var t0 = Date.now();
  var temFicha = false;
  try { temFicha = !!localStorage.getItem('khalkaria_ficha'); } catch (e) { temFicha = false; }
  if (!temFicha) {
    P.erros.push('sem ficha atual (localStorage.khalkaria_ficha): ponha uma (p.ex. a fixture ficha-v2-sintetica.json) e rode de novo');
    console.warn('[dicas] ' + P.erros[0]);
    P.fim = true;
    return;
  }
  var tarefas = [];
  ONDE.forEach(function (o) { TELAS.forEach(function (t) { tarefas.push([o, t]); }); });
  P.total = tarefas.length;
  Object.keys(CHAVES).forEach(function (k) { localStorage.setItem(k, CHAVES[k]); });
  P.promessa = tarefas.reduce(function (p, t) {
    return p.then(function () {
      return umCaso(t[0], t[1]).then(function (abas) {
        P.feito++;
        var item = { onde: t[0], tela: t[1].join('x'), abas: abas,
          contas: abas.reduce(function (s, a) { return s + (a.contas || 0); }, 0),
          aberturas: abas.reduce(function (s, a) { return s + (a.aberturas || 0); }, 0),
          cortadas: [].concat.apply([], abas.map(function (a) { return (a.cortadas || []).map(function (c) { return Object.assign({ aba: a.aba }, c); }); })),
          foraDaCaixa: abas.reduce(function (s, a) { return s + (a.foraDaCaixa || 0); }, 0),
          fixas: abas.reduce(function (s, a) { return s + (a.fixas || 0); }, 0),
          acima: abas.reduce(function (s, a) { return s + (a.acima || 0); }, 0),
          fechadas: abas.reduce(function (s, a) { return s + (a.fechadas || 0); }, 0),
          erros: abas.filter(function (a) { return a.erro; }).map(function (a) { return a.aba + ': ' + a.erro; }) };
        P.itens.push(item);
        console.log('[dicas] ' + P.feito + '/' + P.total + ' ' + item.onde + ' ' + item.tela + ': ' + item.contas + ' contas, ' +
          item.aberturas + ' aberturas, ' + item.cortadas.length + ' cortadas');
      }, function (e) { P.feito++; P.erros.push(t[0] + ' ' + t[1].join('x') + ': ' + e); });
    });
  }, Promise.resolve()).then(function () {
    devolve();
    P.resumo = {
      casos: P.itens.length, erros: P.erros.length + P.itens.reduce(function (s, i) { return s + i.erros.length; }, 0),
      contas: P.itens.reduce(function (s, i) { return s + i.contas; }, 0),
      aberturas: P.itens.reduce(function (s, i) { return s + i.aberturas; }, 0),
      cortadas: P.itens.reduce(function (s, i) { return s + i.cortadas.length; }, 0),
      fechadas: P.itens.reduce(function (s, i) { return s + i.fechadas; }, 0),
      foraDaCaixa: P.itens.reduce(function (s, i) { return s + i.foraDaCaixa; }, 0),
      fixas: P.itens.reduce(function (s, i) { return s + i.fixas; }, 0),
      segundos: Math.round((Date.now() - t0) / 1000)
    };
    P.resumo.ok = !P.resumo.cortadas && !P.resumo.erros && !P.resumo.fechadas;
    try {
      console.table(P.itens.map(function (i) {
        return { onde: i.onde, tela: i.tela, contas: i.contas, aberturas: i.aberturas, cortadas: i.cortadas.length,
          foraDaCaixa: i.foraDaCaixa, fixas: i.fixas, acima: i.acima };
      }));
    } catch (e) { /* sem console.table */ }
    console.log('[dicas] resumo', P.resumo);
    P.fim = true;
    return P.resumo;
  }, function (e) { devolve(); P.erros.push(String(e)); P.fim = true; });
})();
