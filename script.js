// Configurações globais
const CONFIG = {
    whatsappNumber: '5511967439577',
    // Usando a API oficial que é mais estável para mensagens longas
    whatsappBaseUrl: 'https://api.whatsapp.com',
    // Mensagem com as quebras de linha (Enter) configuradas
    defaultMessage: 'Olá, gostaria de solicitar um orçamento:\n\nAno/Modelo do Veículo:\nPeça/s:\nChassi (Opcional):',
    businessHours: {
        start: 8,
        end: 18,
        saturday: { start: 8, end: 14 },
        sunday: false
    }
};

// Utilitários
const Utils = {
    // Formatar mensagem tratando quebras de linha e caracteres especiais
    formatWhatsAppMessage: (message) => {
        return encodeURIComponent(message);
    },

    // Limpar o número (remover espaços, parênteses e traços)
    cleanPhoneNumber: (number) => {
        return number.replace(/\D/g, '');
    },

    // ABRIR WHATSAPP - Versão Corrigida
    openWhatsApp: () => {
        const phone = Utils.cleanPhoneNumber(CONFIG.whatsappNumber);
        const message = Utils.formatWhatsAppMessage(CONFIG.defaultMessage);
        
        // Montagem da URL usando a API oficial
        const url = `${CONFIG.whatsappBaseUrl}?phone=${phone}&text=${message}`;
        
        window.open(url, '_blank');
    },

    isBusinessHours: () => {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        if (day === 0) return false;
        if (day === 6) return hour >= CONFIG.businessHours.saturday.start && hour < CONFIG.businessHours.saturday.end;
        return hour >= CONFIG.businessHours.start && hour < CONFIG.businessHours.end;
    }
};

// Inicialização e Eventos
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões que devem abrir o WhatsApp
    // Certifique-se de que seus botões no HTML tenham a classe 'btn-whatsapp' ou o ID 'whatsapp-button'
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp, #whatsapp-button, .whatsapp-float');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.openWhatsApp();
        });
    });
});
