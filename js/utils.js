// Khalkaria - Right Sidebar de Utilidades (Índice + Mini-Bazar + Páginas Recentes)
// Auto-injeta em todas as páginas que tenham .main-content, exceto o Bazar.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var main = document.querySelector('.main-content');
    if (!main) return;
    // Não renderiza no Bazar (que tem tela cheia própria)
    if (document.body.hasAttribute('data-no-rightbar')) return;

    // Caminho relativo até a raiz (para links). Conta /pages/ na URL.
    var path = location.pathname;
    var depth = (path.split('/pages/')[1] || '').split('/').length - 1;
    var toRoot = depth <= 0 ? '' : '../'.repeat(depth);
    var toPages = toRoot + (path.indexOf('/pages/') >= 0 ? '' : 'pages/');
    // Dentro de /pages/ os irmãos são diretos; em subpastas, sobe.
    var pagesPrefix = (path.indexOf('/pages/') >= 0) ? ('../'.repeat(depth)) : 'pages/';

    // ---------- 1) Registrar página recente (localStorage) ----------
    try {
      var title = (document.querySelector('.main-content h1') || {}).textContent || document.title;
      title = title.replace(/[◆✦✧]/g, '').trim();
      var key = 'khalkaria_recent';
      var list = JSON.parse(localStorage.getItem(key) || '[]');
      var here = location.pathname.split('/').slice(-2).join('/');
      list = list.filter(function (x) { return x.u !== here; });
      list.unshift({ t: title, u: here, p: location.pathname });
      list = list.slice(0, 6);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}

    // ---------- 2) Construir índice "Nesta página" ----------
    var heads = main.querySelectorAll('h2, h3');
    var indexItems = [];
    heads.forEach(function (h, i) {
      if (!h.id) h.id = 'sec-' + i;
      indexItems.push({ id: h.id, txt: h.textContent.replace(/[◆✦✧]/g, '').trim(), lvl: h.tagName === 'H2' ? 2 : 3 });
    });

    // ---------- 3) Montar a sidebar direita ----------
    var aside = document.createElement('aside');
    aside.className = 'right-bar';

    var html = '';
    // Mini-bazar (busca global)
    html += '<div class="rb-block">';
    html += '<div class="rb-title">🔍 Busca rápida</div>';
    html += '<input type="text" class="rb-search" placeholder="Buscar no Bazar..." />';
    html += '<div class="rb-hint">Enter abre o Bazar</div>';
    html += '</div>';

    // Índice da página
    if (indexItems.length > 1) {
      html += '<div class="rb-block"><div class="rb-title">📑 Nesta página</div><nav class="rb-index">';
      indexItems.forEach(function (it) {
        html += '<a href="#' + it.id + '" class="rb-link lvl' + it.lvl + '">' + it.txt + '</a>';
      });
      html += '</nav></div>';
    }

    // Páginas recentes
    html += '<div class="rb-block"><div class="rb-title">🕘 Recentes</div><nav class="rb-recent"></nav></div>';

    // Topo
    html += '<button class="rb-top" title="Voltar ao topo">↑ Topo</button>';

    aside.innerHTML = html;
    document.querySelector('.app-container').appendChild(aside);

    // Preencher recentes
    try {
      var rec = JSON.parse(localStorage.getItem('khalkaria_recent') || '[]');
      var recNav = aside.querySelector('.rb-recent');
      var cur = location.pathname.split('/').slice(-2).join('/');
      var shown = rec.filter(function (x) { return x.u !== cur; }).slice(0, 5);
      if (shown.length === 0) { recNav.innerHTML = '<span class="rb-empty">Navegue para ver o histórico</span>'; }
      shown.forEach(function (x) {
        var a = document.createElement('a');
        a.className = 'rb-link';
        a.textContent = x.t;
        a.href = toRoot + x.p.replace(/^.*\/Khalkaria_Html-main\//, '').replace(/^\//, '');
        // fallback simples: usa caminho salvo relativo à raiz do site
        a.href = (x.p.indexOf('/pages/') >= 0 ? toRoot + 'pages/' + x.u.split('/').pop() : toRoot + x.u.split('/').pop());
        recNav.appendChild(a);
      });
    } catch (e) {}

    // Smooth scroll no índice
    aside.querySelectorAll('.rb-index a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(this.getAttribute('href').slice(1));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });

    // Scroll spy (destaca seção atual)
    var spy = aside.querySelectorAll('.rb-index a');
    if (spy.length) {
      window.addEventListener('scroll', function () {
        var pos = window.scrollY + 120, cur = null;
        heads.forEach(function (h) { if (h.offsetTop <= pos) cur = h.id; });
        spy.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
      }, { passive: true });
    }

    // Botão topo
    aside.querySelector('.rb-top').addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mini-bazar: Enter abre bazar.html?q=
    var search = aside.querySelector('.rb-search');
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        var q = encodeURIComponent(this.value.trim());
        location.href = pagesPrefix + 'bazar.html?q=' + q;
      }
    });
  });
})();
