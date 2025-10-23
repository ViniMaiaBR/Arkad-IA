// Configurações do Sistema ARKAD AI
const APP_CONFIG = {
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

// Exportar configurações para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, SECURITY_CONFIG, MESSAGES };
} 