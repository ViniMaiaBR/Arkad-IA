// Configurações do Sistema ARKAD AI
const APP_CONFIG = {
    // Configurações de API
    api: {
        // INSTRUÇÕES: Substitua 'SUA_API_KEY_AQUI' pela sua chave API do Google Gemini
        // Obtenha sua API key em: https://makersuite.google.com/app/apikey
        geminiApiKey: 'AIzaSyBQSSKogML5hGRhhs72q_uj9p0eVbytaEk',
        geminiModel: 'gemini-2.5-pro'  // Modelo mais avançado com suporte a áudio, imagens, vídeo, texto e PDF
    },
    
    // Configurações de segurança
    security: {
        passwordMinLength: 8,        // Tamanho mínimo da senha
        sessionTimeout: 24           // Timeout da sessão em horas
    },
    
    // Mensagens do sistema
    messages: {
        loginSuccess: 'Login realizado com sucesso!',
        loginFailed: 'E-mail ou senha incorretos',
        registrationSuccess: 'Cadastro realizado com sucesso!',
        emailExists: 'Este e-mail já está cadastrado',
        passwordMismatch: 'As senhas não coincidem',
        invalidPassword: 'A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais',
        ageRestriction: 'Você deve ter pelo menos 13 anos para se cadastrar',
        requiredFields: 'Por favor, preencha todos os campos obrigatórios'
    }
};

// Configurações de segurança
const SECURITY_CONFIG = {
    passwordRequirements: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
    },
    sessionSettings: {
        timeout: 24 * 60 * 60 * 1000, // 24 horas em milissegundos
        refreshInterval: 5 * 60 * 1000  // 5 minutos em milissegundos
    }
};

// Mensagens do sistema
const MESSAGES = APP_CONFIG.messages;

// Log de carregamento para diagnóstico
console.log('✅ config.js carregado');
console.log('🔑 API Key configurada:', APP_CONFIG.api.geminiApiKey ? 'Sim (' + APP_CONFIG.api.geminiApiKey.substring(0, 20) + '...)' : 'Não');
console.log('📊 Modelo:', APP_CONFIG.api.geminiModel);

// Disponibilizar globalmente
window.APP_CONFIG = APP_CONFIG;
window.SECURITY_CONFIG = SECURITY_CONFIG;
window.MESSAGES = MESSAGES;

// Exportar configurações para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, SECURITY_CONFIG, MESSAGES };
} 