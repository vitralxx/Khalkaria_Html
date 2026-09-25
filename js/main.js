// Khalkaria RPG - Main JavaScript

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
                    behavior: 'smooth',
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
