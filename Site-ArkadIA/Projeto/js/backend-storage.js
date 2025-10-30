// Sistema de Armazenamento Unificado - Backend.json
// Este arquivo gerencia TODOS os dados do sistema em um único arquivo backend.json
// Substitui localStorage fragmentado e múltiplos arquivos JSON

console.log('🔧 Carregando backend-storage.js...');

class BackendStorage {
    constructor() {
        console.log('🏗️ Inicializando BackendStorage...');
        this.storageKey = 'backend_data';
        this.data = this.createInitialStructure();
        console.log('✅ BackendStorage inicializado (modo localStorage)');
        
        // Inicializar dados automaticamente
        this.initializeData();
    }

    // Criar estrutura inicial dos dados
    createInitialStructure() {
        return {
            version: "1.0.0",
            lastSync: new Date().toISOString(),
            metadata: {
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                totalUsers: 0,
                totalSessions: 0,
                totalChats: 0
            },
            users: [],
            sessions: [],
            chats: [],
            analyses: [],
            selections: {
                plans: [],
                payments: []
            },
            settings: {
                system: {
                    sessionTimeout: 86400000, // 24 horas
                    chatHistoryLimit: 100
                }
            }
        };
    }

    // Inicializar dados - carregar do localStorage ou criar novo
    async initializeData() {
        try {
            this.loadFromLocalStorage();
            console.log('📂 Dados carregados do localStorage');
            console.log(`   - ${this.data.users.length} usuários`);
            console.log(`   - ${this.data.chats.length} chats`);
            console.log(`   - ${this.data.analyses.length} análises`);
            
            // Garantir que admin existe sempre
            if (this.createDefaultAdmin()) {
                this.saveToLocalStorage();
            }

            // Reforçar a política do admin (senha sempre "admin")
            this.enforceAdminPolicy();
            this.saveToLocalStorage();
        } catch (error) {
            console.log('📝 Nenhum dado encontrado, iniciando com estrutura vazia');
            this.data = this.createInitialStructure();
            // Tentar migrar dados existentes
            await this.migrateExistingData();
            this.saveToLocalStorage();
        }
    }

    // Criar usuário admin padrão
    createDefaultAdmin() {
        // Verificar se admin já existe
        const adminExists = this.data.users.some(u => 
            u.email === 'admin' || u.nome.toLowerCase() === 'admin'
        );
        
        if (!adminExists) {
            const adminUser = {
                id: 'user_admin_default',
                nome: 'Admin',
                email: 'admin',
                senha: this.hashPassword('admin'),
                aniversario: '1990-01-01',
                dataCadastro: new Date().toISOString(),
                ativo: true,
                planType: null,
                subscription: {
                    active: false,
                    planId: null,
                    startDate: null,
                    endDate: null
                },
                metadata: {
                    lastLogin: null,
                    loginCount: 0,
                    preferences: {}
                }
            };
            
            this.data.users.push(adminUser);
            console.log('✅ Usuário admin padrão criado (email: admin, senha: admin)');
            return true;
        }
        return false;
    }

    // Identificar usuário admin
    isAdminUser(user) {
        if (!user) return false;
        const emailIsAdmin = (user.email || '').toLowerCase() === 'admin';
        const nameIsAdmin = (user.nome || '').toLowerCase() === 'admin';
        const idIsAdmin = (user.id || '') === 'user_admin_default';
        return emailIsAdmin || nameIsAdmin || idIsAdmin;
    }

    // Garantir que a senha do admin permaneça sempre "admin"
    enforceAdminPolicy() {
        const admin = this.data.users.find(u => this.isAdminUser(u));
        if (admin) {
            const expectedHash = this.hashPassword('admin');
            if (admin.senha !== expectedHash) {
                admin.senha = expectedHash;
                console.log('🔒 Política aplicada: senha do admin redefinida para padrão.');
            }
            admin.ativo = true;
        }
    }

    // Migrar dados existentes de sistemas antigos
    async migrateExistingData() {
        console.log('🔄 Migrando dados existentes...');
        
        // 0. Criar usuário admin padrão primeiro
        this.createDefaultAdmin();
        
        // 1. Migrar usuários
        try {
            // Tentar carregar de usuarios_arkad.json
            const oldUsers = localStorage.getItem('arkad_users');
            if (oldUsers) {
                const users = JSON.parse(oldUsers);
                if (Array.isArray(users) && users.length > 0) {
                    for (const oldUser of users) {
                        // Verificar se já existe (ignorar se for admin)
                        if (oldUser.email === 'admin' || oldUser.nome.toLowerCase() === 'admin') {
                            continue;
                        }
                        const exists = this.data.users.some(u => u.email === oldUser.email);
                        if (!exists) {
                            this.data.users.push({
                                id: oldUser.id || this.generateId('user'),
                                nome: oldUser.nome,
                                email: oldUser.email.toLowerCase(),
                                senha: oldUser.senha,
                                aniversario: oldUser.aniversario,
                                dataCadastro: oldUser.dataCadastro || new Date().toISOString(),
                                ativo: oldUser.ativo !== false,
                                planType: null,
                                subscription: {
                                    active: false,
                                    planId: null,
                                    startDate: null,
                                    endDate: null
                                },
                                metadata: {
                                    lastLogin: null,
                                    loginCount: 0,
                                    preferences: {}
                                }
                            });
                        }
                    }
                    console.log(`✅ ${users.length} usuários migrados`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Erro ao migrar usuários:', error);
        }

        // 2. Migrar sessões ativas do localStorage
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const userInfo = localStorage.getItem('userInfo');
            const loginTime = localStorage.getItem('loginTime');
            
            if (isLoggedIn === 'true' && userInfo && loginTime) {
                const user = JSON.parse(userInfo);
                const session = {
                    id: this.generateId('session'),
                    userId: user.id,
                    email: user.email,
                    createdAt: new Date(parseInt(loginTime)).toISOString(),
                    expiresAt: new Date(parseInt(loginTime) + 86400000).toISOString(),
                    remember: true,
                    active: true,
                    lastActivity: new Date().toISOString()
                };
                this.data.sessions.push(session);
                console.log('✅ Sessão ativa migrada');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao migrar sessão:', error);
        }

        // 3. Migrar seleções de planos e pagamentos
        try {
            const selectedPlan = localStorage.getItem('arkad_selected_plan');
            if (selectedPlan) {
                const plan = JSON.parse(selectedPlan);
                this.data.selections.plans.push({
                    id: this.generateId('selection'),
                    userId: null, // Será atualizado quando usuário fizer login
                    sessionId: null,
                    type: plan.type,
                    name: plan.name,
                    price: plan.price,
                    selectedAt: plan.selectedAt || new Date().toISOString(),
                    completed: false
                });
                console.log('✅ Seleção de plano migrada');
            }

            const selectedPayment = localStorage.getItem('arkad_selected_payment');
            if (selectedPayment) {
                const payment = JSON.parse(selectedPayment);
                this.data.selections.payments.push({
                    id: this.generateId('payment'),
                    userId: null,
                    sessionId: null,
                    planSelectionId: null,
                    type: payment.type,
                    name: payment.name,
                    selectedAt: payment.selectedAt || new Date().toISOString(),
                    completed: false
                });
                console.log('✅ Seleção de pagamento migrada');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao migrar seleções:', error);
        }

        // Atualizar metadata
        this.updateMetadata();
        console.log('✅ Migração de dados concluída');
    }

    // Carregar do localStorage
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.data = JSON.parse(stored);
                
                // Validar estrutura
                if (!this.data.users || !this.data.chats) {
                    throw new Error('Estrutura de dados inválida');
                }
                
                console.log('📦 Dados carregados do localStorage');
            } else {
                this.data = this.createInitialStructure();
                console.log('📭 Nenhum dado encontrado, iniciando vazio');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
            // Se erro ao parsear, começar do zero
            this.data = this.createInitialStructure();
            this.saveToLocalStorage();
        }
    }

    // Salvar no localStorage
    saveToLocalStorage() {
        try {
            // Atualizar metadata antes de salvar
            this.updateMetadata();
            
            // Salvar no localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            
            console.log('💾 Dados salvos no localStorage');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
            return false;
        }
    }

    // Método compatível (mantido para compatibilidade com código existente)
    async saveToFile() {
        return this.saveToLocalStorage();
    }

    // Atualizar metadata
    updateMetadata() {
        this.data.lastSync = new Date().toISOString();
        this.data.metadata.lastModified = new Date().toISOString();
        this.data.metadata.totalUsers = this.data.users.length;
        this.data.metadata.totalSessions = this.data.sessions.filter(s => s.active).length;
        this.data.metadata.totalChats = this.data.chats.filter(c => c.active).length;
    }

    // ========== GERENCIAMENTO DE USUÁRIOS ==========

    // Verificar se email já existe
    emailExists(email) {
        return this.data.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Adicionar novo usuário
    async addUser(userData) {
        if (!userData.nome || !userData.email || !userData.senha || !userData.aniversario) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Normalizar email
        const email = userData.email.toLowerCase().trim();
        
        // Validar email (permitir "admin" como exceção)
        if (email !== 'admin') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Email inválido');
            }
        }

        if (this.emailExists(email)) {
            throw new Error('Este email já está cadastrado');
        }

        if (userData.senha.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }

        if (!this.validarDataAniversario(userData.aniversario)) {
            throw new Error('Data de aniversário inválida');
        }

        const newUser = {
            id: this.generateId('user'),
            nome: userData.nome.trim(),
            email: email,
            senha: this.hashPassword(userData.senha),
            aniversario: userData.aniversario,
            dataCadastro: new Date().toISOString(),
            ativo: true,
            planType: null,
            subscription: {
                active: false,
                planId: null,
                startDate: null,
                endDate: null
            },
            metadata: {
                lastLogin: null,
                loginCount: 0,
                preferences: {}
            }
        };

        this.data.users.push(newUser);
        this.saveToLocalStorage();
        
        console.log('✅ Usuário adicionado:', newUser.email);
        return newUser;
    }

    // Autenticar usuário
    authenticateUser(emailOuUsuario, senha) {
        // Normalizar entrada (pode ser email ou nome de usuário)
        const busca = emailOuUsuario.toLowerCase().trim();
        
        // Buscar por email ou nome (especialmente para "admin")
        const user = this.data.users.find(u => {
            const emailMatch = u.email.toLowerCase() === busca;
            const nomeMatch = u.nome.toLowerCase() === busca;
            return (emailMatch || nomeMatch) && u.ativo === true;
        });

        if (!user) {
            return null;
        }

        if (this.hashPassword(senha) === user.senha) {
            // Criar sessão
            const session = this.createSession(user.id, user.email, true);
            
            // Atualizar usuário
            user.metadata.lastLogin = new Date().toISOString();
            user.metadata.loginCount++;
            
            this.saveToLocalStorage();
            
            return {
                id: user.id,
                nome: user.nome,
                email: user.email,
                aniversario: user.aniversario,
                dataCadastro: user.dataCadastro,
                session: session
            };
        }

        return null;
    }

    // Obter todos os usuários
    getAllUsers() {
        return this.data.users.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            aniversario: user.aniversario,
            dataCadastro: user.dataCadastro,
            ativo: user.ativo
        }));
    }

    // Obter usuário por ID
    getUserById(id) {
        return this.data.users.find(user => user.id === id);
    }

    // Atualizar usuário
    async updateUser(id, updateData) {
        const userIndex = this.data.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        if (updateData.nome) {
            this.data.users[userIndex].nome = updateData.nome.trim();
        }
        
        if (updateData.aniversario) {
            if (!this.validarDataAniversario(updateData.aniversario)) {
                throw new Error('Data de aniversário inválida');
            }
            this.data.users[userIndex].aniversario = updateData.aniversario;
        }

        if (updateData.senha) {
            // Verificar se é o usuário admin - não permitir alterar senha
            const user = this.data.users[userIndex];
            if (user.email === 'admin' || user.id === 'user_admin_default' || user.nome.toLowerCase() === 'admin') {
                throw new Error('A senha do administrador não pode ser alterada');
            }
            
            if (updateData.senha.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres');
            }
            this.data.users[userIndex].senha = this.hashPassword(updateData.senha);
        }

        this.saveToLocalStorage();
        return true;
    }

    // Deletar usuário (desativar)
    async deleteUser(id) {
        const userIndex = this.data.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        this.data.users[userIndex].ativo = false;
        
        // Finalizar todas as sessões do usuário
        this.data.sessions.forEach(session => {
            if (session.userId === id && session.active) {
                session.active = false;
            }
        });
        
        this.saveToLocalStorage();
        return true;
    }

    // ========== GERENCIAMENTO DE SESSÕES ==========

    // Criar sessão
    createSession(userId, email, remember = false) {
        const session = {
            id: this.generateId('session'),
            userId: userId,
            email: email,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + this.data.settings.system.sessionTimeout).toISOString(),
            remember: remember,
            active: true,
            lastActivity: new Date().toISOString()
        };

        this.data.sessions.push(session);
        this.saveToLocalStorage();
        
        return session;
    }

    // Obter sessão ativa
    getActiveSession(userId) {
        const now = new Date();
        return this.data.sessions.find(session => 
            session.userId === userId && 
            session.active && 
            new Date(session.expiresAt) > now
        );
    }

    // Finalizar sessão
    endSession(sessionId) {
        const session = this.data.sessions.find(s => s.id === sessionId);
        if (session) {
            session.active = false;
            this.saveToLocalStorage();
        }
    }

    // Limpar sessões expiradas
    cleanupExpiredSessions() {
        const now = new Date();
        let cleaned = 0;
        
        this.data.sessions.forEach(session => {
            if (new Date(session.expiresAt) < now) {
                session.active = false;
                cleaned++;
            }
        });
        
        if (cleaned > 0) {
            this.saveToLocalStorage();
            console.log(`🧹 ${cleaned} sessões expiradas foram limpas`);
        }
    }

    // ========== GERENCIAMENTO DE CHATS ==========

    // Criar novo chat
    createChat(userId, sessionId, title = 'Nova Conversa') {
        const chat = {
            id: this.generateId('chat'),
            userId: userId,
            sessionId: sessionId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            title: title,
            messages: [],
            metadata: {
                totalMessages: 0,
                userMessages: 0,
                aiMessages: 0,
                topics: [],
                analysisCompleted: false
            },
            active: true
        };

        this.data.chats.push(chat);
        this.saveToLocalStorage();
        
        console.log('✅ Chat criado:', chat.id);
        return chat;
    }

    // Adicionar mensagem ao chat
    addMessageToChat(chatId, type, content) {
        const chat = this.data.chats.find(c => c.id === chatId && c.active);
        
        if (!chat) {
            throw new Error('Chat não encontrado');
        }

        const message = {
            id: this.generateId('msg'),
            type: type,
            content: content,
            timestamp: new Date().toISOString()
        };

        chat.messages.push(message);
        chat.updatedAt = new Date().toISOString();
        chat.metadata.totalMessages++;
        
        if (type === 'user') {
            chat.metadata.userMessages++;
        } else {
            chat.metadata.aiMessages++;
        }

        this.saveToLocalStorage();
        return message;
    }

    // Obter chat por ID
    getChatById(chatId) {
        return this.data.chats.find(chat => chat.id === chatId && chat.active);
    }

    // Obter chats do usuário
    getUserChats(userId) {
        return this.data.chats.filter(chat => 
            chat.userId === userId && chat.active
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // ========== GERENCIAMENTO DE ANÁLISES ==========

    // Criar análise
    createAnalysis(data) {
        const analysis = {
            id: this.generateId('analysis'),
            chatId: data.chatId || null,
            userId: data.userId,
            type: data.type || 'generic',
            createdAt: new Date().toISOString(),
            status: 'completed',
            planType: data.planType || null,
            data: data.data || {},
            reportData: data.reportData || null
        };

        this.data.analyses.push(analysis);
        
        // Atualizar chat se houver
        if (data.chatId) {
            const chat = this.data.chats.find(c => c.id === data.chatId);
            if (chat) {
                chat.metadata.analysisCompleted = true;
            }
        }
        
        this.saveToLocalStorage();
        
        console.log('✅ Análise criada:', analysis.id);
        return analysis;
    }

    // Obter análise por chatId
    getAnalysisByChatId(chatId) {
        return this.data.analyses.find(analysis => analysis.chatId === chatId);
    }

    // ========== GERENCIAMENTO DE SELEÇÕES ==========

    // Salvar seleção de plano
    savePlanSelection(userId, sessionId, planData) {
        const selection = {
            id: this.generateId('selection'),
            userId: userId,
            sessionId: sessionId,
            type: planData.type,
            name: planData.name,
            price: planData.price,
            selectedAt: new Date().toISOString(),
            completed: false
        };

        this.data.selections.plans.push(selection);
        this.saveToLocalStorage();
        
        console.log('✅ Seleção de plano salva:', selection.type);
        return selection;
    }

    // Salvar seleção de pagamento
    savePaymentSelection(userId, sessionId, planSelectionId, paymentData) {
        const selection = {
            id: this.generateId('payment'),
            userId: userId,
            sessionId: sessionId,
            planSelectionId: planSelectionId,
            type: paymentData.type,
            name: paymentData.name,
            selectedAt: new Date().toISOString(),
            completed: false
        };

        this.data.selections.payments.push(selection);
        this.saveToLocalStorage();
        
        console.log('✅ Seleção de pagamento salva:', selection.type);
        return selection;
    }

    // ========== UTILITÁRIOS ==========

    // Gerar ID único
    generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Hash simples da senha
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // Validar data de aniversário
    validarDataAniversario(dataStr) {
        let data;
        
        if (dataStr.includes('/')) {
            const [dia, mes, ano] = dataStr.split('/');
            data = new Date(ano, mes - 1, dia);
        } else {
            data = new Date(dataStr);
        }

        if (isNaN(data.getTime())) {
            return false;
        }

        const hoje = new Date();
        if (data > hoje) {
            return false;
        }

        const centoEVinteAnosAtras = new Date();
        centoEVinteAnosAtras.setFullYear(hoje.getFullYear() - 120);
        if (data < centoEVinteAnosAtras) {
            return false;
        }

        return true;
    }

    // Formatar data para exibição
    formatarDataParaExibicao(dataISO) {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR');
    }

    // Limpar todos os dados
    clearAllData() {
        this.data = this.createInitialStructure();
        this.saveToLocalStorage();
        console.log('🗑️ Todos os dados foram limpos');
    }

    // Exportar dados para backup
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    // Importar dados de backup
    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            if (imported.users && imported.chats) {
                this.data = imported;
                this.saveToLocalStorage();
                console.log('✅ Dados importados com sucesso');
                return true;
            } else {
                throw new Error('Formato de dados inválido');
            }
        } catch (error) {
            throw new Error('Erro ao importar dados: ' + error.message);
        }
    }

    // Sincronizar dados (recarregar do localStorage)
    syncWithFile() {
        try {
            this.loadFromLocalStorage();
            console.log('🔄 Dados sincronizados');
            return true;
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            throw error;
        }
    }

    // Criar backup
    createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup_backend_${timestamp}.json`;
        
        try {
            const dataStr = JSON.stringify(this.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = backupFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('💾 Backup criado:', backupFileName);
            return true;
        } catch (error) {
            console.error('❌ Erro ao criar backup:', error);
            throw error;
        }
    }
}

// Criar instância global
console.log('🌍 Criando instância global backendStorage...');

// Função para inicializar o sistema
async function initializeBackendStorage() {
    try {
        window.backendStorage = new BackendStorage();
        console.log('✅ backendStorage criado e disponível globalmente');
        
        // Aguardar inicialização dos dados
        await window.backendStorage.initializeData();
        console.log('✅ Sistema de armazenamento inicializado');
        
        // Limpar sessões expiradas periodicamente
        setInterval(() => {
            if (window.backendStorage) {
                window.backendStorage.cleanupExpiredSessions();
            }
        }, 3600000); // A cada hora
        
        return window.backendStorage;
    } catch (error) {
        console.error('❌ Erro ao inicializar backendStorage:', error);
        window.backendStorage = new BackendStorage();
        return window.backendStorage;
    }
}

// Inicializar automaticamente
initializeBackendStorage();

// Compatibilidade: manter userStorage apontando para backendStorage
if (typeof window.userStorage === 'undefined') {
    Object.defineProperty(window, 'userStorage', {
        get: function() {
            return window.backendStorage;
        },
        configurable: true
    });
    console.log('✅ Compatibilidade: userStorage aponta para backendStorage');
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackendStorage;
}

