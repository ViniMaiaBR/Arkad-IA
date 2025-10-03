// Sistema de Armazenamento de Usuários em JSON
// Este arquivo gerencia o armazenamento local dos dados dos usuários

class UserStorage {
    constructor() {
        this.storageKey = 'arkad_users';
        this.users = this.loadUsers();
    }

    // Carregar usuários do localStorage
    loadUsers() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            return [];
        }
    }

    // Salvar usuários no localStorage
    saveUsers() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.users));
            return true;
        } catch (error) {
            console.error('Erro ao salvar usuários:', error);
            return false;
        }
    }

    // Verificar se um email já existe
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Adicionar novo usuário
    addUser(userData) {
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

        // Validar data de aniversário
        if (!this.validarDataAniversario(userData.aniversario)) {
            throw new Error('Data de aniversário inválida');
        }

        // Criar objeto do usuário
        const newUser = {
            id: this.generateUserId(),
            nome: userData.nome.trim(),
            email: userData.email.toLowerCase().trim(),
            senha: this.hashPassword(userData.senha), // Hash simples da senha
            aniversario: userData.aniversario,
            dataCadastro: new Date().toISOString(),
            ativo: true
        };

        // Adicionar usuário
        this.users.push(newUser);
        
        // Salvar no localStorage
        if (this.saveUsers()) {
            return newUser;
        } else {
            throw new Error('Erro ao salvar dados do usuário');
        }
    }

    // Verificar login do usuário
    authenticateUser(email, senha) {
        const user = this.users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.ativo === true
        );

        if (!user) {
            return null;
        }

        // Verificar senha (hash simples)
        if (this.hashPassword(senha) === user.senha) {
            return {
                id: user.id,
                nome: user.nome,
                email: user.email,
                aniversario: user.aniversario,
                dataCadastro: user.dataCadastro
            };
        }

        return null;
    }

    // Obter todos os usuários (para administração)
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

    // Obter usuário por ID
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    // Atualizar usuário
    updateUser(id, updateData) {
        const userIndex = this.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        // Atualizar dados permitidos
        if (updateData.nome) {
            this.users[userIndex].nome = updateData.nome.trim();
        }
        
        if (updateData.aniversario) {
            if (!this.validarDataAniversario(updateData.aniversario)) {
                throw new Error('Data de aniversário inválida');
            }
            this.users[userIndex].aniversario = updateData.aniversario;
        }

        if (updateData.senha) {
            if (updateData.senha.length < 6) {
                throw new Error('A senha deve ter pelo menos 6 caracteres');
            }
            this.users[userIndex].senha = this.hashPassword(updateData.senha);
        }

        return this.saveUsers();
    }

    // Deletar usuário (desativar)
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

    // Hash simples da senha (em produção, usar bcrypt ou similar)
    hashPassword(password) {
        // Hash simples para demonstração - em produção usar biblioteca de hash segura
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    // Validar data de aniversário
    validarDataAniversario(dataStr) {
        // Aceitar formato DD/MM/YYYY ou YYYY-MM-DD
        let data;
        
        if (dataStr.includes('/')) {
            // Formato DD/MM/YYYY
            const [dia, mes, ano] = dataStr.split('/');
            data = new Date(ano, mes - 1, dia);
        } else {
            // Formato YYYY-MM-DD
            data = new Date(dataStr);
        }

        // Verificar se a data é válida
        if (isNaN(data.getTime())) {
            return false;
        }

        // Verificar se não é data futura
        const hoje = new Date();
        if (data > hoje) {
            return false;
        }

        // Verificar se não é muito antiga (mais de 120 anos)
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

    // Limpar todos os dados (para desenvolvimento)
    clearAllData() {
        this.users = [];
        localStorage.removeItem(this.storageKey);
    }

    // Exportar dados para backup
    exportData() {
        return JSON.stringify(this.users, null, 2);
    }

    // Importar dados de backup
    importData(jsonData) {
        try {
            const importedUsers = JSON.parse(jsonData);
            if (Array.isArray(importedUsers)) {
                this.users = importedUsers;
                return this.saveUsers();
            } else {
                throw new Error('Formato de dados inválido');
            }
        } catch (error) {
            throw new Error('Erro ao importar dados: ' + error.message);
        }
    }
}

// Criar instância global do sistema de armazenamento
window.userStorage = new UserStorage();

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserStorage;
}
