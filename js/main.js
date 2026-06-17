// Khalkaria RPG - Main JavaScript

// Splash Screen
document.addEventListener('DOMContentLoaded', function() {
    const splash = document.querySelector('.splash-screen');
    if (splash) {
        // One-time: se já viu a entrada, esconde imediatamente sem animar
        if (localStorage.getItem('khalkaria_splash_seen')) {
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
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
    
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
