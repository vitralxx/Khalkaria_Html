// Khalkaria — navegação lateral.
// Injetado pelo build (tools/shell.py) antes de </body> em TODAS as páginas,
// inclusive o Bazar (que não carrega main.js). Não depende de main.js nem de
// utils.js; o teclado passa pelo KhTeclas do js/kh-ui.js (que o shell injeta
// antes). O markup é partials/sidebar.html.
//
// Estado em localStorage 'khalkaria_nav' = {v:1, trilho:bool, fechados:[…]},
// lido e gravado sempre em try/catch: sem storage a nav abre no padrão e
// funciona. O partials/head-boot.html aplica o mesmo estado no <html> antes do
// primeiro paint; aqui só se sincroniza a aria e se ligam os eventos.
// Movimento reduzido: 'khalkaria_movimento' = 'reduzido' | 'normal' (sem chave:
// segue o prefers-reduced-motion do sistema). Vira html[data-movimento], que o
// CSS do site todo lê; o botão "Reduzir movimento" fica no rodapé da nav.
(function () {
  'use strict';
  var CHAVE = 'khalkaria_nav';
  var html = document.documentElement;
  var nav = document.querySelector('.sidebar');
  if (!nav) return;

  var grupos = [].slice.call(nav.querySelectorAll('.nav-grupo[data-grupo]'));
  var idsGrupo = grupos.map(function (g) { return g.getAttribute('data-grupo'); });

  function ler() {
    var e = { v: 1, trilho: false, fechados: [] };
    try {
      var s = JSON.parse(localStorage.getItem(CHAVE) || '{}');
      if (s && typeof s === 'object') {
        e.trilho = !!s.trilho;
        if (Array.isArray(s.fechados)) {
          e.fechados = s.fechados.filter(function (x) { return idsGrupo.indexOf(x) >= 0; });
        }
      }
    } catch (err) {}
    return e;
  }
  function gravar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (err) {}
  }
  var estado = ler();

  // ---------- Grupos recolhíveis (Raças, Classes) ----------
  // Abertos por padrão. O CSS esconde a lista pelo atributo do <html>; o grupo
  // da página atual nunca fecha (:not(:has(.active)) no CSS, aria-disabled aqui).
  function aplicaGrupos() {
    if (estado.fechados.length) html.setAttribute('data-nav-fechados', estado.fechados.join(' '));
    else html.removeAttribute('data-nav-fechados');
    grupos.forEach(function (g) {
      var cab = g.querySelector('.nav-grupo-cab');
      if (!cab) return;
      var atual = !!g.querySelector('.nav-link.active');
      var aberto = atual || estado.fechados.indexOf(g.getAttribute('data-grupo')) < 0;
      cab.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      if (atual) cab.setAttribute('aria-disabled', 'true');
      else cab.removeAttribute('aria-disabled');
    });
  }
  grupos.forEach(function (g) {
    var cab = g.querySelector('.nav-grupo-cab');
    if (!cab) return;
    cab.addEventListener('click', function () {
      if (cab.getAttribute('aria-disabled') === 'true') return;
      var id = g.getAttribute('data-grupo');
      var i = estado.fechados.indexOf(id);
      if (i < 0) estado.fechados.push(id);
      else estado.fechados.splice(i, 1);
      aplicaGrupos();
      gravar();
    });
  });

  // ---------- Menu mobile (≤900px), vindo do main.js ----------
  // Agora em todas as páginas: o Bazar, que não carrega main.js, ganha o menu.
  var toggle = document.querySelector('.menu-toggle');
  function fechaMobile() {
    nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) {
    if (nav.id) toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      toggle.setAttribute('aria-expanded', nav.classList.toggle('open') ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) fechaMobile();
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a[href]')) fechaMobile();
    });
  }

  // ---------- Trilho de 64px (só desktop, ≥901px) ----------
  // Única variável que o layout lê: --nav-w, trocada pelo CSS via
  // html[data-nav="trilho"]. O layout troca num frame; ao EXPANDIR, os rótulos
  // entram com 140ms de opacidade (html.nav-anima). Recolher é seco.
  var btn = nav.querySelector('.nav-recolher');
  var mqDesk = window.matchMedia('(min-width: 901px)');
  var mqCalma = window.matchMedia('(prefers-reduced-motion: reduce)');
  var tAnima = 0;
  function calmo() { return html.getAttribute('data-movimento') === 'reduzido'; }

  function emTrilho() { return html.getAttribute('data-nav') === 'trilho'; }

  function aplica(trilho, animar) {
    var era = emTrilho();
    if (trilho) html.setAttribute('data-nav', 'trilho');
    else html.removeAttribute('data-nav');
    if (btn) {
      var rot = trilho ? 'Expandir navegação' : 'Recolher navegação';
      btn.setAttribute('aria-expanded', trilho ? 'false' : 'true');
      btn.setAttribute('aria-label', rot);
      btn.setAttribute('title', rot + ' (\\)');
      var u = btn.querySelector('use');
      if (u) u.setAttribute('href', trilho ? '#nv-expandir' : '#nv-recolher');
    }
    if (animar && era && !trilho && !calmo()) {
      html.classList.add('nav-anima');
      clearTimeout(tAnima);
      tAnima = setTimeout(function () { html.classList.remove('nav-anima'); }, 200);
    }
    escondeDica(true);
  }
  function alterna() {
    estado.trilho = !emTrilho();
    aplica(estado.trilho, true);
    gravar();
  }
  if (btn) btn.addEventListener('click', alterna);

  // ---------- Movimento reduzido (opção do visitante) ----------
  var CHAVE_MOV = 'khalkaria_movimento';
  var btnMov = nav.querySelector('.nav-mov');
  function movSalvo() {
    try {
      var m = localStorage.getItem(CHAVE_MOV);
      return m === 'reduzido' || m === 'normal' ? m : '';
    } catch (err) { return ''; }
  }
  function aplicaMov() {
    var m = movSalvo();
    var red = m ? m === 'reduzido' : mqCalma.matches;
    html.setAttribute('data-movimento', red ? 'reduzido' : 'normal');
    if (btnMov) btnMov.setAttribute('aria-pressed', red ? 'true' : 'false');
  }
  if (btnMov) {
    btnMov.addEventListener('click', function () {
      try { localStorage.setItem(CHAVE_MOV, calmo() ? 'normal' : 'reduzido'); } catch (err) {}
      // sem storage a escolha vale só nesta página
      if (!movSalvo()) html.setAttribute('data-movimento', calmo() ? 'normal' : 'reduzido');
      else aplicaMov();
      if (btnMov) btnMov.setAttribute('aria-pressed', calmo() ? 'true' : 'false');
    });
  }
  // sem escolha salva, acompanha o sistema
  var aoMudarCalma = function () { if (!movSalvo()) aplicaMov(); };
  if (mqCalma.addEventListener) mqCalma.addEventListener('change', aoMudarCalma);
  else if (mqCalma.addListener) mqCalma.addListener(aoMudarCalma);

  // ---------- Dica do trilho ----------
  // Um único elemento no <body> (fora da nav: nada de fixed dentro dela).
  // aria-hidden: o nome acessível já está no link (rótulo recortado).
  // WCAG 1.4.13: dá para passar o ponteiro por cima, some com Esc.
  var dica = document.createElement('div');
  dica.id = 'nav-dica';
  dica.className = 'nav-dica';
  dica.setAttribute('aria-hidden', 'true');
  dica.hidden = true;
  document.body.appendChild(dica);
  var tMostra = 0, tEsconde = 0, alvoDica = null;

  function podeDica() { return emTrilho() && mqDesk.matches; }
  function textoDe(el) {
    var r = el.querySelector('.nav-rot');
    var t = r ? r.textContent : (el.getAttribute('data-dica') || el.getAttribute('aria-label') || '');
    return t.replace(/\s+/g, ' ').trim();
  }
  function mostra(el) {
    clearTimeout(tMostra);
    clearTimeout(tEsconde);
    if (!podeDica()) return;
    var t = textoDe(el);
    if (!t) return;
    dica.textContent = t;
    var r = el.getBoundingClientRect();
    dica.style.top = (r.top + r.height / 2) + 'px';
    dica.hidden = false;
    alvoDica = el;
  }
  function escondeDica(ja) {
    clearTimeout(tMostra);
    clearTimeout(tEsconde);
    var some = function () { dica.hidden = true; alvoDica = null; };
    if (ja) some();
    else tEsconde = setTimeout(some, 120);
  }
  function alvoDe(t) {
    return t && t.closest ? t.closest('.sidebar a, .sidebar button') : null;
  }
  nav.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    var el = alvoDe(e.target);
    if (!el) return;
    if (el === alvoDica && !dica.hidden) { clearTimeout(tEsconde); return; }
    clearTimeout(tMostra);
    tMostra = setTimeout(function () { mostra(el); }, 120);
  });
  nav.addEventListener('pointerout', function (e) {
    var el = alvoDe(e.target);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    clearTimeout(tMostra);
    if (!dica.hidden) escondeDica(false);
  });
  dica.addEventListener('pointerenter', function () { clearTimeout(tEsconde); });
  dica.addEventListener('pointerleave', function () { escondeDica(false); });
  nav.addEventListener('focusin', function (e) {
    var el = alvoDe(e.target);
    if (el) mostra(el);
  });
  nav.addEventListener('focusout', function () { escondeDica(true); });
  nav.addEventListener('scroll', function () { if (!dica.hidden) escondeDica(true); }, { passive: true });
  window.addEventListener('resize', function () { if (!dica.hidden) escondeDica(true); });
  var aoMudarDesk = function () { escondeDica(true); };
  if (mqDesk.addEventListener) mqDesk.addEventListener('change', aoMudarDesk);
  else if (mqDesk.addListener) mqDesk.addListener(aoMudarDesk);

  // ---------- Teclado ----------
  // Pelo registro único do site (KhTeclas, js/kh-ui.js), na fase de CAPTURA:
  // roda antes do Bazar, que sai quando e.defaultPrevented.
  // "\" alterna o trilho (tecla própria no ABNT2). Não colide com os atalhos
  // do Bazar (/ i Shift+I [ ] Esc Ctrl+Z) nem do navegador. Ignorado em campo
  // de texto, repetido, no drawer da Ficha e no mobile.
  // Esc só é consumido se houver o que fechar aqui (dica visível ou menu
  // mobile aberto); do contrário passa intacto para o Bazar e a Ficha.
  var T = window.KhTeclas;
  if (T) {
    T.camadaEsc(0, function () {
      if (!dica.hidden) { escondeDica(true); return true; }
      if (nav.classList.contains('open')) {
        fechaMobile();
        if (toggle) toggle.focus();
        return true;
      }
      return false;
    }, { fase: 'captura' });
    T.atalho('\\', function () { alterna(); }, {
      fase: 'captura', repetir: false, descricao: 'Recolher/expandir a navegação',
      quando: function (e) {
        if (e.target && e.target.closest && e.target.closest('#kf-drawer')) return false;
        return mqDesk.matches;
      }
    });
  }

  // ---------- Página atual à vista ----------
  var ativo = nav.querySelector('.nav-link.active');
  if (ativo) {
    var ra = ativo.getBoundingClientRect(), rn = nav.getBoundingClientRect();
    if (ra.top < rn.top || ra.bottom > rn.bottom) nav.scrollTop = ativo.offsetTop - nav.clientHeight / 2;
  }

  // ---------- Outras abas ----------
  window.addEventListener('storage', function (e) {
    if (e.key === CHAVE_MOV || e.key === null) aplicaMov();
    if (e.key !== CHAVE && e.key !== null) return;
    estado = ler();
    aplica(estado.trilho, false);
    aplicaGrupos();
  });

  aplica(estado.trilho, false);
  aplicaGrupos();
  aplicaMov();
})();
