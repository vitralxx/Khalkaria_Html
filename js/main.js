// Khalkaria RPG - Main JavaScript

// Comportamento de rolagem por script: salto seco com o movimento reduzido
// (opção da nav, html[data-movimento]); o scroll-behavior do CSS não vale para
// scrollTo/scrollIntoView com behavior explícito. Usado também pelos scripts
// inline de sistema, condições e limiar.
window.KH_rolagem = function () {
    return document.documentElement.getAttribute('data-movimento') === 'reduzido' ? 'auto' : 'smooth';
};

// Carrega a Ficha Interativa (js/ficha.js), resolvida relativa a este script.
// Assim a ficha aparece em todas as páginas sem editar cada HTML.
(function () {
  try {
    var here = (document.currentScript && document.currentScript.src) ||
      (function () { var ss = document.querySelectorAll('script[src*="js/main.js"]'); return ss.length ? ss[ss.length - 1].src : ''; })();
    if (!here) return;
    window.KF_ROOT = new URL('../', here).href;
    var f = document.createElement('script');
    // repassa o ?v= do próprio main.js (o build versiona todos os assets locais):
    // sem ele o navegador servia um ficha.js antigo do cache depois do deploy
    f.src = new URL('ficha.js' + new URL(here).search, here).href;
    document.head.appendChild(f);
  } catch (e) {}
})();

// Splash Screen
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.querySelector('.splash-screen');
    if (splash) {
        // One-time: se já viu a entrada, esconde imediatamente sem animar
        var visto = false;
        try { visto = !!localStorage.getItem('khalkaria_splash_seen'); } catch (e) {}
        if (visto) {
            splash.classList.add('hidden');
            splash.style.display = 'none';
        } else {
            const dismiss = function() {
                splash.classList.add('hidden');
                try { localStorage.setItem('khalkaria_splash_seen', '1'); } catch (e) {}
            };
            splash.addEventListener('click', dismiss);
            setTimeout(dismiss, 5000);
        }
    }
    
    // O menu mobile (.menu-toggle) mora em js/nav.js, que o build injeta em
    // todas as páginas — inclusive o Bazar, que não carrega este arquivo.

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: window.KH_rolagem(),
                    block: 'start'
                });
            }
        });
    });
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card, .race-card, .origin-card, .branch-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => observer.observe(card));
});

/* Tabela mais larga que a coluna rola ela mesma (celular, janela estreita):
   marca [data-larga] (css/style.css) e tira quando volta a caber. Remede ao
   redimensionar e depois de um clique (aba que mostra tabela escondida). O
   Bazar e a página da ficha têm layout próprio e ficam de fora. */
(function () {
  var pedido = 0;
  function mede() {
    pedido = 0;
    var b = document.body;
    if (!b || b.hasAttribute('data-bazar') || b.hasAttribute('data-ficha-pagina')) return;
    var ts = document.querySelectorAll('.main-content table');
    for (var i = 0; i < ts.length; i++) {
      var t = ts[i], pai = t.parentElement;
      if (!pai || !t.offsetWidth) continue;
      var larga = t.hasAttribute('data-larga') ? t.scrollWidth > t.clientWidth + 1 : t.offsetWidth > pai.clientWidth + 1;
      if (larga) t.setAttribute('data-larga', '');
      else t.removeAttribute('data-larga');
    }
  }
  // setTimeout, não requestAnimationFrame: o rAF não roda em aba que não desenha
  function agenda() { if (!pedido) pedido = setTimeout(mede, 60); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', agenda);
  else agenda();
  window.addEventListener('load', agenda);
  window.addEventListener('resize', agenda);
  document.addEventListener('click', agenda);
})();
