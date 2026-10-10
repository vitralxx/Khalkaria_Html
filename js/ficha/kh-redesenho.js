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
 *   R.encaixa(conta, caixa, win)                      // põe a dica aberta dentro da caixa e da janela
 *   R.reencaixa(caixa, win)                           // depois de rolar: as dicas fora do fluxo seguem a conta
 *   KhRedesenho.encaixeDica(retangulo, {min, max})    // o deslocamento na horizontal (puro)
 *   KhRedesenho.planoDica(conta, dica, limites, vao)  // o lado, a altura máxima e o lugar fora do fluxo (puro)
 *   KhRedesenho.limites(caixa, win)                   // a área útil da caixa na janela
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
    // Ao abrir (hover ou foco), quem montou a mede e a põe dentro da caixa (a
    // página, #fp, à direita da nav fixa; o drawer, a .fd-gaveta-rolagem) e da
    // janela, as duas ao mesmo tempo:
    //   - na horizontal, empurrada (--<p>-dx) e, se mais larga, com a largura da caixa;
    //   - na vertical, o lado é escolhido pelos limites da CAIXA (a parte dela à
    //     vista na janela), e não só pela janela: embaixo se cabe; senão em cima
    //     se cabe; senão no lado com mais espaço, com altura máxima;
    //   - se a caixa (ou um ancestral até ela) recorta pelo overflow, como a
    //     rolagem do drawer, a dica sai do fluxo (position: fixed, calculada do
    //     retângulo da conta) e nada a corta; marcada data-dica-fixa. Fora do
    //     fluxo, se não couber na caixa em nenhum lado, tenta a altura da janela
    //     (inteira, por cima do cabeçalho do drawer) antes da altura máxima.
    // Puro: r = retângulo da dica sem deslocamento; lim = {min, max} em x.
    function encaixeDica(r, lim) {
      var dx = 0;
      if (r.right > lim.max) dx = lim.max - r.right;
      if (r.left + dx < lim.min) dx = lim.min - r.left;
      return Math.round(dx);
    }
    // Puro: rc = retângulo da conta; rd = o da dica aberta embaixo, sem
    // deslocamento (com a largura já limitada); lim = {min, max, topo, base} (a
    // área útil, limites()); vao = a distância da dica à conta (a do CSS).
    // janela = {topo, base}, só para a dica fora do fluxo: se ela não cabe na
    // caixa em nenhum lado, tenta a altura da janela (passa por cima do que
    // está em volta da caixa, sem corte) antes da altura máxima.
    // -> {dx, acima, maxAltura (null = a natural), x, y (o canto de cima à
    // esquerda, para a dica fora do fluxo), janela (true: usou a da janela)}
    function planoDica(rc, rd, lim, vao, janela) {
      vao = typeof vao === 'number' && isFinite(vao) && vao >= 0 ? vao : 6;
      var p = plano(rc, rd, lim, vao);
      if (p.maxAltura == null || !janela) return p;
      var q = plano(rc, rd, { min: lim.min, max: lim.max, topo: Math.min(lim.topo, janela.topo), base: Math.max(lim.base, janela.base) }, vao);
      q.janela = true;
      return q;
    }
    function plano(rc, rd, lim, vao) {
      var h = rd.height;
      var abaixo = lim.base - (rc.bottom + vao), acima = (rc.top - vao) - lim.topo;
      var sobe = h > abaixo && (h <= acima || acima > abaixo);
      var espaco = sobe ? acima : abaixo;
      var maxAltura = h > espaco ? Math.max(0, Math.floor(espaco)) : null;
      var alto = maxAltura == null ? h : maxAltura;
      var dx = encaixeDica(rd, lim);
      // fora do fluxo: o lugar exato (sem o arredondamento do dx, que passaria meio px da borda)
      var x = Math.min(Math.max(rd.left, lim.min), Math.max(lim.min, lim.max - rd.width));
      var y = sobe ? rc.top - vao - alto : rc.bottom + vao;
      // a conta saiu da área à vista (rolou com a dica aberta): a dica fica nela
      y = Math.min(Math.max(y, lim.topo), Math.max(lim.topo, lim.base - alto));
      return { dx: dx, acima: sobe, maxAltura: maxAltura, x: x, y: y, janela: false };
    }
    // a área útil da caixa na janela, com a margem: a caixa de padding (sem a
    // barra de rolagem nem a borda) cortada pela janela (sem a barra da página)
    function limites(caixa, win) {
      var c = caixa.getBoundingClientRect();
      var x0 = c.left + (caixa.clientLeft || 0), y0 = c.top + (caixa.clientTop || 0);
      var x1 = caixa.clientWidth ? x0 + caixa.clientWidth : c.right;
      var y1 = caixa.clientHeight ? y0 + caixa.clientHeight : c.bottom;
      var j = janelaWH(win);
      return { min: Math.max(x0, 0) + MARGEM_DICA, max: Math.min(x1, j.W) - MARGEM_DICA,
        topo: Math.max(y0, 0) + MARGEM_DICA, base: Math.min(y1, j.H) - MARGEM_DICA };
    }
    // a janela sem as barras de rolagem da página (Infinity se não se sabe)
    function janelaWH(win) {
      var de = win && win.document ? win.document.documentElement : null;
      return { W: (de && de.clientWidth) || (win && win.innerWidth) || Infinity,
        H: (de && de.clientHeight) || (win && win.innerHeight) || Infinity };
    }
    // a caixa, ou a conta ou um ancestral dela até a caixa, recorta pelo overflow?
    function recorta(conta, caixa, win) {
      if (!win || typeof win.getComputedStyle !== 'function') return false;
      for (var x = conta; x; x = x.parentElement) {
        var s = win.getComputedStyle(x);
        if (s && ((s.overflowX && s.overflowX !== 'visible') || (s.overflowY && s.overflowY !== 'visible'))) return true;
        if (x === caixa) break;
      }
      return false;
    }
    // o que uma abertura grava na dica (o estilo) e na conta (as marcas)
    var ESTILO_DICA = ['max-width', 'max-height', 'overflow-y', 'position', 'left', 'top', 'right', 'bottom', 'width', 'transform'];

    // a fábrica: as marcas com o prefixo de quem desenha
    function criar(op) {
      op = op || {};
      var P = str(op.prefixo);
      if (!RE_PREFIXO.test(P)) throw new Error('KhRedesenho: prefixo inválido "' + P + '" (letras, dígitos e hífen)');
      var VAR_DX = '--' + P + '-dx';
      var MARCA_FOCO = 'data-' + P + '-foco', MARCA_DICA = 'data-' + P + '-dica';
      var MARCA_FIXA = 'data-dica-fixa';   // a dica desta conta está fora do fluxo (position: fixed)
      var MEMO_HTML = '_' + P + 'Html', MEMO_DICA = '_' + P + 'Dica';

      // volta a dica ao desenho do CSS (centrada embaixo, no fluxo)
      function solta(conta, d) {
        d.style.removeProperty(VAR_DX);
        ESTILO_DICA.forEach(function (k) { d.style.removeProperty(k); });
        conta.removeAttribute('data-dica-acima');
        conta.removeAttribute(MARCA_FIXA);
      }
      // a dica de uma conta (.kh-conta) aberta agora; false se ainda está fechada
      function encaixa(conta, caixa, win) {
        var d = conta && conta.querySelector ? conta.querySelector('.kh-conta-dica') : null;
        if (!d || !d.getBoundingClientRect || !caixa) return false;
        solta(conta, d);
        var r = d.getBoundingClientRect();
        if (!r.width) return false;
        var lim = limites(caixa, win);
        if (r.width > lim.max - lim.min) {
          d.style.setProperty('max-width', Math.max(0, Math.floor(lim.max - lim.min)) + 'px');
          r = d.getBoundingClientRect();
        }
        var rc = conta.getBoundingClientRect();
        var fixa = recorta(conta, caixa, win), H = janelaWH(win).H;
        // fora do fluxo, sem lugar na caixa: a altura da janela antes da altura máxima
        var p = planoDica(rc, r, lim, r.top - rc.bottom, fixa && isFinite(H) ? { topo: MARGEM_DICA, base: H - MARGEM_DICA } : null);
        if (p.acima) conta.setAttribute('data-dica-acima', '');
        if (p.maxAltura != null) {
          d.style.setProperty('max-height', p.maxAltura + 'px');
          d.style.setProperty('overflow-y', 'hidden');
        }
        if (fixa) {
          // fora do fluxo: a caixa que rola não a corta (nada entre ela e a janela transforma)
          conta.setAttribute(MARCA_FIXA, '');
          d.style.setProperty('position', 'fixed');
          d.style.setProperty('left', p.x + 'px');
          d.style.setProperty('top', p.y + 'px');
          d.style.setProperty('right', 'auto');
          d.style.setProperty('bottom', 'auto');
          d.style.setProperty('width', r.width + 'px');
          d.style.setProperty('transform', 'none');
        } else if (p.dx) d.style.setProperty(VAR_DX, p.dx + 'px');
        return true;
      }
      // depois de a caixa (ou a página) rolar: a dica fora do fluxo não anda com
      // a conta; as abertas seguem, as fechadas voltam ao CSS. Quantas seguiram.
      function reencaixa(caixa, win) {
        var n = 0;
        qsa(caixa, '[' + MARCA_FIXA + ']').forEach(function (c) {
          var d = c.querySelector('.kh-conta-dica');
          if (!d) return;
          var r = d.getBoundingClientRect();
          if (r && r.width && encaixa(c, caixa, win)) n++;
          else solta(c, d);
        });
        return n;
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

      return { prefixo: P, VAR_DX: VAR_DX, MARCA_FOCO: MARCA_FOCO, MARCA_DICA: MARCA_DICA, MARCA_FIXA: MARCA_FIXA,
        encaixa: encaixa, reencaixa: reencaixa, trocaHTML: trocaHTML, soltaFoco: soltaFoco, soltaDicas: soltaDicas };
    }

    return { MARGEM_DICA: MARGEM_DICA, FOCAVEIS: FOCAVEIS, encaixeDica: encaixeDica, planoDica: planoDica,
      limites: limites, recorta: recorta, criar: criar };
  })();

  if (emNode) { module.exports = KhRedesenho; return; }
  raiz.KhRedesenho = KhRedesenho;
})(typeof window !== 'undefined' ? window : this);
