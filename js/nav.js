// Khalkaria — navegação lateral.
// Injetado pelo build (tools/shell.py) antes de </body> em TODAS as páginas,
// inclusive o Bazar (que não carrega main.js). Autocontido: não depende de
// main.js nem de utils.js. O markup é partials/sidebar.html.
//
// Estado em localStorage 'khalkaria_nav' = {v:1, trilho:bool, fechados:[…]},
// lido e gravado sempre em try/catch: sem storage a nav abre no padrão e
// funciona. O partials/head-boot.html aplica o mesmo estado no <html> antes do
// primeiro paint; aqui só se sincroniza a aria e se ligam os eventos.
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

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    if (nav.classList.contains('open')) {
      fechaMobile();
      if (toggle) toggle.focus();
      e.preventDefault();
    }
  }, true);

  // ---------- Página atual à vista ----------
  var ativo = nav.querySelector('.nav-link.active');
  if (ativo) {
    var ra = ativo.getBoundingClientRect(), rn = nav.getBoundingClientRect();
    if (ra.top < rn.top || ra.bottom > rn.bottom) nav.scrollTop = ativo.offsetTop - nav.clientHeight / 2;
  }

  // ---------- Outras abas ----------
  window.addEventListener('storage', function (e) {
    if (e.key !== CHAVE && e.key !== null) return;
    estado = ler();
    aplicaGrupos();
  });

  aplicaGrupos();
})();
