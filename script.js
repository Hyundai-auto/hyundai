// Configurações globais
const CONFIG = {
    whatsappNumber: '5511967439577',
    whatsappBaseUrl: 'https://wa.me',
    // O %0A representa a quebra de linha (Enter)
    defaultMessage: 'Olá, gostaria de solicitar um orçamento:%0A%0AAno/Modelo do Veículo:%0APeça/s:%0AChassi (Opcional):',
    businessHours: {
        start: 8,
        end: 18,
        saturday: { start: 8, end: 14 },
        sunday: false
    }
};


// Utilitários
const Utils = {
    // Formatar mensagem para WhatsApp
    formatWhatsAppMessage: (message) => {
        return encodeURIComponent(message);
    },

    // Verificar se está em horário comercial
    isBusinessHours: () => {
        const now = new Date();
        const day = now.getDay(); // 0 = domingo, 6 = sábado
        const hour = now.getHours();

        if (day === 0) return false; 
        
        if (day === 6) { 
            return hour >= CONFIG.businessHours.saturday.start && hour < CONFIG.businessHours.saturday.end;
        }
        
        return hour >= CONFIG.businessHours.start && hour < CONFIG.businessHours.end;
    },

    // ABRIR WHATSAPP (Ajustado para usar sempre a frase padrão única)
    openWhatsApp: () => {
        const message = CONFIG.defaultMessage;
        const url = `${CONFIG.whatsappBaseUrl}${CONFIG.whatsappNumber}?text=${Utils.formatWhatsAppMessage(message)}`;
        window.open(url, '_blank');
    },

    // Scroll suave
    smoothScroll: (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Debounce para otimizar performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Detectar se é dispositivo móvel
    isMobile: () => {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
};

// Gerenciamento do menu mobile
const MobileMenu = {
    init: () => {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        
        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                nav.classList.toggle('active');
            });

            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                });
            });

            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        }
    }
};

// Animações e efeitos visuais
const Animations = {
    animateCounters: () => {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetString = counter.textContent.replace(/[^\d]/g, '');
                    const target = parseInt(targetString);
                    const suffix = counter.textContent.replace(/[\d]/g, '');
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                    observer.unobserve(counter);
                }
            });
        });
        counters.forEach(counter => observer.observe(counter));
    },

    fadeInOnScroll: () => {
        const elements = document.querySelectorAll('.catalog-item, .stat-item, .benefit-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
};

// Inicialização Geral
document.addEventListener('DOMContentLoaded', () => {
    MobileMenu.init();
    Animations.animateCounters();
    Animations.fadeInOnScroll();

    // Event listener global para qualquer botão que tenha a classe 'btn-whatsapp'
    document.querySelectorAll('.btn-whatsapp, .whatsapp-float').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.openWhatsApp();
        });
    });
});
