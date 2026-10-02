/* Khalkaria — Ficha · KhRedesenho: redesenhar sem perder o lugar, e a dica da conta dentro da caixa (F4.4b).
 * Saiu do js/ficha-pagina.js (F4.3) para o bundle porque tem dois donos: a
 * página da ficha (pages/ficha.html, prefixo 'fp') e o drawer da ficha nova
 * (js/ficha/kh-ficha-drawer.js, todas as páginas, prefixo 'fd'). Os dois
 * redesenham o mesmo HTML do KhFichaAbas a cada mudança da ficha e prendem a
 * dica da conta à própria caixa. Carregar este arquivo não muda nada: não toca
 * DOM, storage nem rede; só age quando alguém chama.
 *
 *   var R = KhRedesenho.criar({ prefixo: 'fp' });
 *   R.trocaHTML(doc, cont, html, reserva, caixa, win)  // troca o HTML de cont sem perder foco, <details> e dica
 *   R.encaixa(conta, caixa, win)                      // empurra a dica aberta para dentro da caixa
 *   R.encaixeDica(retangulo, {min, max})              // o deslocamento (puro)
 *
 * O prefixo dá os nomes das marcas: a variável do deslocamento da dica
 * (--<p>-dx), as marcas do elemento novo depois da troca (data-<p>-foco: o
 * contorno do foco de teclado; data-<p>-dica: a dica sob o mouse, aberta até o
 * mouse mexer), a memória do HTML no contêiner (_<p>Html) e o aviso para quem
 * montou soltar a dica no próximo movimento (caixa._<p>Dica). Com 'fp', são os
 * nomes de antes da extração (os testes da página não mudam).
 *
 * No node exporta por module.exports (carregado sozinho); no artefato js/ficha.js
 * o export já é o KhInv e este módulo só registra window.KhRedesenho no navegador.
 * Fonte: js/ficha/kh-redesenho.js (o js/ficha.js é o ARTEFATO concatenado).
 */
(function (raiz) {
  'use strict';

  var emNode = typeof module === 'object' && module && module.exports;
  if (emNode && Object.keys(module.exports).length) return;   // artefato no node: só o KhInv

  var KhRedesenho = (function () {
    var RE_PREFIXO = /^[a-z][a-z0-9-]*$/i;   // o mesmo do KhConta
    var MARGEM_DICA = 8;
    var FOCAVEIS = 'a[href], button, summary, select, input, textarea, [tabindex]';

    function str(x) { return x == null ? '' : String(x); }
    function arr(x) { return Array.prototype.slice.call(x || []); }
    function qsa(cont, sel) { return cont && cont.querySelectorAll ? arr(cont.querySelectorAll(sel)) : []; }
    function casa(el, sel) { try { return !!el.matches(sel); } catch (e) { return false; } }
    function foca(el) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }

    // ---------------- a dica da conta dentro da caixa ----------------
    // A dica nasce centrada sob o número (css: translateX(-50%) mais --<p>-dx).
    // Ao abrir (hover ou foco), quem montou a mede e a empurra para dentro da
    // caixa (a página, à direita da nav fixa; o drawer, na largura dele): nunca
    // passa da janela (sem rolagem horizontal) nem sai da caixa. Sem espaço
    // embaixo e com espaço em cima, abre para cima.
    // Puro: r = retângulo da dica sem deslocamento; lim = {min, max} em x.
    function encaixeDica(r, lim) {
      var dx = 0;
      if (r.right > lim.max) dx = lim.max - r.right;
      if (r.left + dx < lim.min) dx = lim.min - r.left;
      return Math.round(dx);
    }

    // a fábrica: as marcas com o prefixo de quem desenha
    function criar(op) {
      op = op || {};
      var P = str(op.prefixo);
      if (!RE_PREFIXO.test(P)) throw new Error('KhRedesenho: prefixo inválido "' + P + '" (letras, dígitos e hífen)');
      var VAR_DX = '--' + P + '-dx';
      var MARCA_FOCO = 'data-' + P + '-foco', MARCA_DICA = 'data-' + P + '-dica';
      var MEMO_HTML = '_' + P + 'Html', MEMO_DICA = '_' + P + 'Dica';

      // a dica de uma conta (.kh-conta) aberta agora; false se ainda está fechada
      function encaixa(conta, caixa, win) {
        var d = conta && conta.querySelector ? conta.querySelector('.kh-conta-dica') : null;
        if (!d || !d.getBoundingClientRect || !caixa) return false;
        d.style.removeProperty(VAR_DX);
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
        if (dx) d.style.setProperty(VAR_DX, dx + 'px');
        var alto = win && win.innerHeight, rc = conta.getBoundingClientRect();
        if (alto && r.bottom > alto - MARGEM_DICA && rc.top - 6 - r.height >= MARGEM_DICA) conta.setAttribute('data-dica-acima', '');
        return true;
      }

      // ---------------- redesenho sem perder o lugar ----------------
      // Antes de trocar o HTML de um contêiner, guarda o que o jogador tinha nele:
      // o elemento com o foco (pela chave: o data-caminho da conta, ou o
      // data-campo, ou a tag e a classe, mais a ordem entre os de mesma chave),
      // os <details> abertos e a conta sob o mouse. Depois de trocar, devolve o
      // foco ao equivalente (sem rolar; se ele sumiu, à reserva), reabre os
      // <details> e deixa a dica aberta até o mouse se mexer. Contêiner cujo
      // HTML não mudou não é tocado.
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
      // troca o HTML de cont preservando foco, <details> abertos e a dica sob o
      // mouse; reserva = quem recebe o foco se o elemento focado sumiu. true se trocou.
      function trocaHTML(doc, cont, html, reserva, caixa, win) {
        if (!cont || cont[MEMO_HTML] === html) return false;
        var ativo = doc.activeElement;
        var dentro = !!ativo && ativo !== cont && !!cont.contains && cont.contains(ativo);
        var foco = dentro ? marcaUI(qsa(cont, FOCAVEIS), ativo) : null;
        var visivel = dentro && (casa(ativo, ':focus-visible') || ativo.hasAttribute(MARCA_FOCO));
        var dets = qsa(cont, 'details');
        var abertos = dets.filter(function (d) { return d.open; }).map(function (d) { return marcaUI(dets, d); });
        var contas = qsa(cont, '.kh-conta');
        var sob = null;
        contas.some(function (c) { if (casa(c, ':hover') || c.hasAttribute(MARCA_DICA)) { sob = marcaUI(contas, c); } return !!sob; });

        cont.innerHTML = html;
        cont[MEMO_HTML] = html;

        dets = qsa(cont, 'details');
        abertos.forEach(function (m) { var d = achaUI(dets, m); if (d) d.open = true; });
        if (sob) {
          var s = achaUI(qsa(cont, '.kh-conta'), sob);
          if (s) {
            s.setAttribute(MARCA_DICA, '');
            if (caixa) caixa[MEMO_DICA] = true;   // o próximo movimento do mouse a solta (quem montou)
            encaixa(s, caixa, win);
          }
        }
        if (dentro) {
          var el = foco ? achaUI(qsa(cont, FOCAVEIS), foco) : null;
          if (!el) el = reserva || (cont.hasAttribute('tabindex') ? cont : null);
          if (el && el.focus) {
            foca(el);
            // o foco por teclado segue visível (contorno e dica) no elemento novo
            if (visivel && !casa(el, ':focus-visible')) el.setAttribute(MARCA_FOCO, '');
            if (el.getAttribute('data-caminho') != null) encaixa(el, caixa, win);
          }
        }
        return true;
      }

      // as marcas do redesenho valem até o jogador agir: o foco sai (focusout
      // tira a do foco), o mouse mexe (solta as dicas presas). Quem montou chama.
      function soltaFoco(el) { if (el && el.removeAttribute) el.removeAttribute(MARCA_FOCO); }
      function soltaDicas(caixa) {
        if (!caixa || !caixa[MEMO_DICA]) return false;
        caixa[MEMO_DICA] = false;
        qsa(caixa, '[' + MARCA_DICA + ']').forEach(function (x) { x.removeAttribute(MARCA_DICA); });
        return true;
      }

      return { prefixo: P, VAR_DX: VAR_DX, MARCA_FOCO: MARCA_FOCO, MARCA_DICA: MARCA_DICA,
        encaixa: encaixa, trocaHTML: trocaHTML, soltaFoco: soltaFoco, soltaDicas: soltaDicas };
    }

    return { MARGEM_DICA: MARGEM_DICA, FOCAVEIS: FOCAVEIS, encaixeDica: encaixeDica, criar: criar };
  })();

  if (emNode) { module.exports = KhRedesenho; return; }
  raiz.KhRedesenho = KhRedesenho;
})(typeof window !== 'undefined' ? window : this);
