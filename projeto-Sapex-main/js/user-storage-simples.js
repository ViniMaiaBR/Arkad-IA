// Sistema de Armazenamento de Usuários em JSON - Versão Simples
console.log('🔧 Carregando user-storage-simples.js...');

// Verificar se localStorage está disponível
if (typeof localStorage === 'undefined') {
    console.error('❌ localStorage não está disponível!');
    throw new Error('localStorage não está disponível neste ambiente');
}

// Classe simplificada para armazenamento de usuários
class UserStorage {
    constructor() {
        console.log('🏗️ Inicializando UserStorage...');
        this.storageKey = 'arkad_users';
        this.users = this.loadUsers();
        console.log('✅ UserStorage inicializado com', this.users.length, 'usuários');
    }

    // Carregar usuários do localStorage
    loadUsers() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            const users = stored ? JSON.parse(stored) : [];
            console.log('📂 Usuários carregados:', users.length);
            return users;
        } catch (error) {
            console.error('❌ Erro ao carregar usuários:', error);
            return [];
        }
    }

    // Salvar usuários no localStorage
    saveUsers() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.users));
            console.log('💾 Usuários salvos:', this.users.length);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar usuários:', error);
            return false;
        }
    }

    // Verificar se um email já existe
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Adicionar novo usuário
    addUser(userData) {
        console.log('👤 Tentando adicionar usuário:', userData);
        
        // Validar dados obrigatórios
        if (!userData.nome || !userData.email || !userData.senha || !userData.aniversario) {
            throw new Error('Todos os campos são obrigatórios');
        }

        // Verificar se email já existe
        if (this.emailExists(userData.email)) {
            throw new Error('Este email já está cadastrado');
        }

        // Validar senha
        if (userData.senha.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres');
        }

        // Criar objeto do usuário
        const newUser = {
            id: this.generateUserId(),
            nome: userData.nome.trim(),
            email: userData.email.toLowerCase().trim(),
            senha: this.hashPassword(userData.senha),
            aniversario: userData.aniversario,
            dataCadastro: new Date().toISOString(),
            ativo: true
        };

        console.log('👤 Novo usuário criado:', newUser);

        // Adicionar usuário
        this.users.push(newUser);
        
        // Salvar no localStorage
        if (this.saveUsers()) {
            console.log('✅ Usuário adicionado com sucesso!');
            return newUser;
        } else {
            throw new Error('Erro ao salvar dados do usuário');
        }
    }

    // Verificar login do usuário
    authenticateUser(email, senha) {
        console.log('🔐 Tentando autenticar:', email);
        
        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.ativo === true
        );

        if (!user) {
            console.log('❌ Usuário não encontrado');
            return null;
        }

        // Verificar senha
        if (this.hashPassword(senha) === user.senha) {
            console.log('✅ Usuário autenticado com sucesso');
            return {
                id: user.id,
                nome: user.nome,
                email: user.email,
                aniversario: user.aniversario,
                dataCadastro: user.dataCadastro
            };
        }

        console.log('❌ Senha incorreta');
        return null;
    }

    // Obter todos os usuários
    getAllUsers() {
        return this.users.map(user => ({
            id: user.id,
            nome: user.nome,
            email: user.email,
            aniversario: user.aniversario,
            dataCadastro: user.dataCadastro,
            ativo: user.ativo
        }));
    }

    // Deletar usuário
    deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        this.users[userIndex].ativo = false;
        return this.saveUsers();
    }

    // Gerar ID único para o usuário
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
            // Formato DD/MM/YYYY
            const [dia, mes, ano] = dataStr.split('/');
            data = new Date(ano, mes - 1, dia);
        } else {
            // Formato YYYY-MM-DD
            data = new Date(dataStr);
        }

        if (isNaN(data.getTime())) {
            return false;
        }

        const hoje = new Date();
        if (data > hoje) {
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
        this.users = [];
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ Todos os dados foram limpos');
    }
}

// Criar instância global do sistema de armazenamento
console.log('🌍 Criando instância global userStorage...');
window.userStorage = new UserStorage();
console.log('✅ userStorage criado e disponível globalmente');

// Verificar se foi criado corretamente
if (typeof window.userStorage !== 'undefined') {
    console.log('✅ userStorage está disponível globalmente');
} else {
    console.error('❌ userStorage não foi criado corretamente');
}
