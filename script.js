// Configurações globais
const CONFIG = {
    whatsappNumber: '5511966220715',
    whatsappBaseUrl: 'https://wa.me/',
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

        if (day === 0) return false; // Domingo fechado
        
        if (day === 6) { // Sábado
            return hour >= CONFIG.businessHours.saturday.start && hour < CONFIG.businessHours.saturday.end;
        }
        
        // Segunda a sexta
        return hour >= CONFIG.businessHours.start && hour < CONFIG.businessHours.end;
    },

    // Abrir WhatsApp
    openWhatsApp: (message = '') => {
        const url = `${CONFIG.whatsappBaseUrl}${CONFIG.whatsappNumber}${message ? '?text=' + Utils.formatWhatsAppMessage(message) : ''}`;
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

            // Fechar menu ao clicar em um link
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                });
            });

            // Fechar menu ao clicar fora
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
    // Contador animado para estatísticas
    animateCounters: () => {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                    const suffix = counter.textContent.replace(/[\d]/g, '');
                    let current = 0;
                    const increment = target / 100;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current) + suffix;
                        }
                    }, 20);
                    observer.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    },

    // Animação de entrada dos elementos
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
    },

    // Efeito parallax no hero (apenas em desktop)
    parallaxEffect: () => {
        if (!Utils.isMobile()) {
            window.addEventListener('scroll', Utils.debounce(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero-background');
                if (hero) {
                    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
            }, 10));
        }
    }
};

// Funcionalidades do formulário de busca
const SearchForm = {
    init: () => {
        SearchForm.setupEventListeners();
        SearchForm.loadSavedData();
    },

    setupEventListeners: () => {
        const modelSelect = document.getElementById('modelo');
        const yearSelect = document.getElementById('ano');
        const partInput = document.getElementById('peca');

        // Salvar dados no localStorage
        [modelSelect, yearSelect, partInput].forEach(element => {
            if (element) {
                element.addEventListener('change', SearchForm.saveFormData);
                element.addEventListener('input', SearchForm.saveFormData);
            }
        });

        // Auto-complete para peças
        if (partInput) {
            partInput.addEventListener('input', Utils.debounce(SearchForm.showSuggestions, 300));
        }
    },

    saveFormData: () => {
        const formData = {
            modelo: document.getElementById('modelo')?.value || '',
            ano: document.getElementById('ano')?.value || '',
            peca: document.getElementById('peca')?.value || ''
        };
        localStorage.setItem('hyundai_search_form', JSON.stringify(formData));
    },

    loadSavedData: () => {
        const savedData = localStorage.getItem('hyundai_search_form');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (document.getElementById('modelo')) document.getElementById('modelo').value = data.modelo || '';
            if (document.getElementById('ano')) document.getElementById('ano').value = data.ano || '';
            if (document.getElementById('peca')) document.getElementById('peca').value = data.peca || '';
        }
    },

    showSuggestions: (event) => {
        const input = event.target;
        const value = input.value.toLowerCase();
        
        if (value.length < 2) return;

        const suggestions = [
            'Para-choque dianteiro', 'Para-choque traseiro', 'Farol', 'Lanterna',
            'Retrovisor', 'Filtro de ar', 'Filtro de óleo', 'Vela de ignição',
            'Correia dentada', 'Pastilha de freio', 'Disco de freio', 'Amortecedor',
            'Mola', 'Bateria', 'Alternador', 'Motor de partida'
        ].filter(item => item.toLowerCase().includes(value));

        SearchForm.displaySuggestions(input, suggestions);
    },

    displaySuggestions: (input, suggestions) => {
        // Remove sugestões anteriores
        const existingSuggestions = document.querySelector('.suggestions-list');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (suggestions.length === 0) return;

        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'suggestions-list';
        suggestionsList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;

        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.textContent = suggestion;
            item.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f3f4f6;
                transition: background-color 0.2s;
                min-height: 44px;
                display: flex;
                align-items: center;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f8fafc';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'white';
            });
            item.addEventListener('click', () => {
                input.value = suggestion;
                suggestionsList.remove();
                SearchForm.saveFormData();
            });
            suggestionsList.appendChild(item);
        });

        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(suggestionsList);

        // Fechar sugestões ao clicar fora
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.remove();
            }
        }, { once: true });
    }
};

// Gerenciamento de cookies
const CookieManager = {
    init: () => {
        if (!CookieManager.hasConsent()) {
            CookieManager.showNotice();
        }
    },

    hasConsent: () => {
        return localStorage.getItem('cookie_consent') === 'accepted';
    },

    showNotice: () => {
        const notice = document.getElementById('cookieNotice');
        if (notice) {
            notice.style.display = 'block';
        }
    },

    hideNotice: () => {
        const notice = document.getElementById('cookieNotice');
        if (notice) {
            notice.style.display = 'none';
        }
    },

    accept: () => {
        localStorage.setItem('cookie_consent', 'accepted');
        CookieManager.hideNotice();
        
        // Inicializar analytics ou outros scripts que dependem de cookies
        CookieManager.initAnalytics();
    },

    initAnalytics: () => {
        // Aqui você pode adicionar Google Analytics, Facebook Pixel, etc.
        console.log('Analytics inicializado');
    }
};

// Funcionalidades principais do site
const SiteFeatures = {
    init: () => {
        SiteFeatures.setupWhatsAppNotification();
        SiteFeatures.setupSmoothScrolling();
        SiteFeatures.setupFormValidation();
        SiteFeatures.setupTouchOptimizations();
    },

    setupWhatsAppNotification: () => {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            // Simular notificações
            setInterval(() => {
                const currentCount = parseInt(badge.textContent);
                if (Math.random() > 0.7) { // 30% chance de nova mensagem
                    badge.textContent = currentCount + 1;
                    badge.style.animation = 'pulse 0.5s ease-in-out';
                    setTimeout(() => {
                        badge.style.animation = '';
                    }, 500);
                }
            }, 30000); // A cada 30 segundos
        }
    },

    setupSmoothScrolling: () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    setupFormValidation: () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                SiteFeatures.validateAndSubmitForm(form);
            });
        });
    },

    setupTouchOptimizations: () => {
        if (Utils.isMobile()) {
            // Adicionar classe para otimizações de toque
            document.body.classList.add('touch-device');
            
            // Melhorar a experiência de toque em botões
            const buttons = document.querySelectorAll('.btn, .model-btn, .btn-catalog');
            buttons.forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.95)';
                });
                
                button.addEventListener('touchend', function() {
                    this.style.transform = '';
                });
            });
        }
    },

    validateAndSubmitForm: (form) => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validação básica
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        });

        if (isValid) {
            // Enviar para WhatsApp
            const message = SiteFeatures.formatFormMessage(data);
            Utils.openWhatsApp(message);
        }
    },

    formatFormMessage: (data) => {
        let message = 'Olá, solicito o setor de peças por gentileza...';
        
        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                const label = SiteFeatures.getFieldLabel(key);
                message += `*${label}:* ${value}\n`;
            }
        });
        
        message += '\n📱 Enviado pelo site casadohyundai.com';
        return message;
    },

    getFieldLabel: (fieldName) => {
        const labels = {
            nome: 'Nome',
            email: 'E-mail',
            telefone: 'Telefone',
            modelo: 'Modelo',
            ano: 'Ano',
            peca: 'Peça',
            mensagem: 'Mensagem'
        };
        return labels[fieldName] || fieldName;
    }
};

// Otimizações de performance
const Performance = {
    init: () => {
        Performance.lazyLoadImages();
        Performance.optimizeScrolling();
    },

    lazyLoadImages: () => {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    optimizeScrolling: () => {
        let ticking = false;
        
        function updateScrollPosition() {
            // Aqui você pode adicionar lógica para otimizar elementos durante o scroll
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        });
    }
};

// Funções globais chamadas pelos botões
function consultarWhatsApp(modelo, ano, peca) {
    const message = 'Olá, solicito o setor de peças por gentileza...';
    
    Utils.openWhatsApp(message);
}

function consultarCategoria(categoria) {
    const categorias = {
        'carroceria': 'Carroceria (Para-choques, Retrovisores, Lanternas, Faróis)',
        'motor': 'Motor (Filtros, Correias, Velas, Óleo)',
        'freios': 'Freios (Pastilhas, Discos, Tambores)',
        'eletrica': 'Elétrica (Bateria, Alternador, Motor de Partida)',
        'ar-condicionado': 'Ar Condicionado (Compressor, Condensador, Filtros)',
        'suspensao': 'Suspensão (Amortecedores, Molas, Buchas)'
    };
    
    const message = 'Olá, solicito o setor de peças por gentileza...';
    
    Utils.openWhatsApp(message);
}

function solicitarOrcamento() {
    const message = 'Olá, solicito o setor de peças por gentileza...';
    Utils.openWhatsApp(message);
}

function falarEspecialista() {
    const message = 'Olá, solicito o setor de peças por gentileza...';
    Utils.openWhatsApp(message);
}

function selecionarModelo(modelo) {
    const modelos = {
        'hb20': 'HB20',
        'hb20s': 'HB20S',
        'creta': 'Creta',
        'tucson': 'Tucson',
        'ix35': 'ix35',
        'elantra': 'Elantra'
    };
    
    // Atualizar o select do formulário
    const modelSelect = document.getElementById('modelo');
    if (modelSelect) {
        modelSelect.value = modelo;
        SearchForm.saveFormData();
    }
    
    const message = 'Olá, solicito o setor de peças por gentileza...';
    Utils.openWhatsApp(message);
}

function abrirWhatsApp() {
    const message = 'Olá, solicito o setor de peças por gentileza...';
    Utils.openWhatsApp(message);
}

function aceitarCookies() {
    CookieManager.accept();
}

function opcoesCookies() {
    alert('Funcionalidade de opções de cookies em desenvolvimento. Por enquanto, você pode aceitar ou recusar todos os cookies.');
}

function saibaMais() {
    alert('Usamos cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar nosso tráfego. Ao continuar navegando, você concorda com nossa política de cookies.');
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos os módulos
    MobileMenu.init();
    SearchForm.init();
    CookieManager.init();
    SiteFeatures.init();
    Performance.init();
    
    // Inicializar animações
    Animations.animateCounters();
    Animations.fadeInOnScroll();
    Animations.parallaxEffect();
    
    // Adicionar estilos dinâmicos para sugestões
    const style = document.createElement('style');
    style.textContent = `
        .suggestions-list::-webkit-scrollbar {
            width: 6px;
        }
        
        .suggestions-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .suggestions-list::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .suggestions-list::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .touch-device .btn:active,
        .touch-device .model-btn:active,
        .touch-device .btn-catalog:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚗 Casa do Hyundai - Site carregado com sucesso!');
});

// Adicionar listener para mudanças de visibilidade da página
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Página ficou visível - pode atualizar dados
        console.log('Página ativa');
    } else {
        // Página ficou oculta - pode pausar animações
        console.log('Página inativa');
    }
});

// Tratamento de erros globais
window.addEventListener('error', (event) => {
    console.error('Erro capturado:', event.error);
    // Aqui você pode enviar erros para um serviço de monitoramento
});

// Otimização para orientação da tela em dispositivos móveis
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Recalcular layouts após mudança de orientação
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// Exportar para uso global se necessário
window.HyundaiSite = {
    Utils,
    MobileMenu,
    Animations,
    SearchForm,
    CookieManager,
    SiteFeatures,
    Performance
};
