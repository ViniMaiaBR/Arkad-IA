// Configurações do Sistema ARKAD AI
const DB_CONFIG = {
    // Configurações do Oracle Database
    oracle: {
        host: 'localhost',           // Host do servidor Oracle
        port: 1521,                  // Porta padrão do Oracle
        serviceName: 'XE',           // Nome do serviço Oracle
        user: 'arkadai_user',        // Usuário do banco
        password: 'sua_senha_aqui',  // Senha do usuário
        connectionString: 'localhost:1521/XE', // String de conexão
        poolMin: 10,                 // Mínimo de conexões no pool
        poolMax: 50,                 // Máximo de conexões no pool
        poolIncrement: 5             // Incremento do pool
    },
    
    // Configurações de segurança
    security: {
        maxLoginAttempts: 5,         // Máximo de tentativas de login
        lockoutDuration: 30,         // Duração do bloqueio em minutos
        passwordMinLength: 8,        // Tamanho mínimo da senha
        sessionTimeout: 24           // Timeout da sessão em horas
    },
    
    // Mensagens do sistema
    messages: {
        loginSuccess: 'Login realizado com sucesso!',
        loginFailed: 'E-mail ou senha incorretos',
        accountLocked: 'Conta bloqueada por excesso de tentativas. Tente novamente mais tarde.',
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
const MESSAGES = DB_CONFIG.messages;

// Exportar configurações para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DB_CONFIG, SECURITY_CONFIG, MESSAGES };
} 