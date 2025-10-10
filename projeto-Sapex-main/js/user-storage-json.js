// Sistema de Armazenamento de Usuários - Sempre em Arquivo JSON
// Este arquivo gerencia o armazenamento dos dados dos usuários sempre em arquivo JSON

console.log('🔧 Carregando user-storage-json.js...');

class UserStorageJSON {
    constructor() {
        console.log('🏗️ Inicializando UserStorageJSON...');
        this.fileName = 'usuarios_arkad.json';
        this.users = [];
        this.isFileSystemSupported = 'showSaveFilePicker' in window;
        this.fileHandle = null; // Para manter referência do arquivo
        console.log('✅ UserStorageJSON inicializado. FileSystem suportado:', this.isFileSystemSupported);
        
        // Carregar dados automaticamente na inicialização
        this.initializeData();
    }

    // Inicializar dados - carregar do arquivo JSON ou criar novo
    async initializeData() {
        try {
            await this.loadUsersFromFile();
            console.log('📂 Dados carregados:', this.users.length, 'usuários');
        } catch (error) {
            console.log('📝 Arquivo não encontrado, iniciando com dados vazios');
            this.users = [];
            await this.saveUsersToFile();
        }
    }

    // Carregar usuários do arquivo JSON
    async loadUsersFromFile() {
        try {
            if (this.isFileSystemSupported) {
                await this.loadFromFileSystem();
            } else {
                await this.loadFromLocalStorageFallback();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar usuários do arquivo:', error);
            // Tentar carregar do localStorage como fallback
            await this.loadFromLocalStorageFallback();
        }
    }

    // Carregar usando File System Access API
    async loadFromFileSystem() {
        try {
            // Tentar abrir arquivo existente
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Arquivos JSON',
                    accept: { 'application/json': ['.json'] }
                }],
                multiple: false
            });

            this.fileHandle = fileHandle;
            const file = await fileHandle.getFile();
            const content = await file.text();
            this.users = JSON.parse(content);
            
            console.log('📂 Arquivo carregado:', file.name);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('📁 Carregamento cancelado pelo usuário');
                throw error;
            }
            // Se não conseguir carregar, tentar criar novo arquivo
            await this.createNewFile();
        }
    }

    // Criar novo arquivo
    async createNewFile() {
        try {
            this.fileHandle = await window.showSaveFilePicker({
                suggestedName: this.fileName,
                types: [{
                    description: 'Arquivos JSON',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            // Criar arquivo vazio
            const writable = await this.fileHandle.createWritable();
            await writable.write(JSON.stringify([], null, 2));
            await writable.close();

            this.users = [];
            console.log('📝 Novo arquivo criado:', this.fileName);
        } catch (error) {
            console.error('❌ Erro ao criar arquivo:', error);
            throw error;
        }
    }

    // Fallback para localStorage
    async loadFromLocalStorageFallback() {
        const stored = localStorage.getItem('arkad_users');
        if (stored) {
            this.users = JSON.parse(stored);
            console.log('📦 Dados carregados do localStorage como fallback');
        } else {
            this.users = [];
            console.log('📭 Nenhum dado encontrado, iniciando vazio');
        }
    }

    // Salvar usuários no arquivo JSON
    async saveUsersToFile() {
        try {
            if (this.isFileSystemSupported && this.fileHandle) {
                await this.saveToFileSystem();
            } else {
                await this.saveAsDownload();
            }
            
            // Também salvar no localStorage como backup
            localStorage.setItem('arkad_users', JSON.stringify(this.users));
            console.log('💾 Usuários salvos no arquivo JSON e localStorage');
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar usuários:', error);
            return false;
        }
    }

    // Salvar usando File System Access API
    async saveToFileSystem() {
        try {
            if (!this.fileHandle) {
                await this.createNewFile();
            }

            const writable = await this.fileHandle.createWritable();
            await writable.write(JSON.stringify(this.users, null, 2));
            await writable.close();

            console.log('💾 Arquivo salvo:', this.fileHandle.name);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar no sistema de arquivos:', error);
            throw error;
        }
    }

    // Salvar como download (fallback)
    async saveAsDownload() {
        const dataStr = JSON.stringify(this.users, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('📥 Arquivo baixado:', this.fileName);
        return true;
    }

    // Verificar se um email já existe
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Adicionar novo usuário
    async addUser(userData) {
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

        // Validar data de aniversário
        if (!this.validarDataAniversario(userData.aniversario)) {
            throw new Error('Data de aniversário inválida');
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
        
        // Salvar no arquivo JSON
        if (await this.saveUsersToFile()) {
            console.log('✅ Usuário adicionado e salvo com sucesso!');
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

    // Obter usuário por ID
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    // Atualizar usuário
    async updateUser(id, updateData) {
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

        return await this.saveUsersToFile();
    }

    // Deletar usuário (desativar)
    async deleteUser(id) {
        const userIndex = this.users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }

        this.users[userIndex].ativo = false;
        return await this.saveUsersToFile();
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

    // Limpar todos os dados
    async clearAllData() {
        this.users = [];
        await this.saveUsersToFile();
        localStorage.removeItem('arkad_users');
        console.log('🗑️ Todos os dados foram limpos');
    }

    // Exportar dados para backup
    exportData() {
        return JSON.stringify(this.users, null, 2);
    }

    // Importar dados de backup
    async importData(jsonData) {
        try {
            const importedUsers = JSON.parse(jsonData);
            if (Array.isArray(importedUsers)) {
                this.users = importedUsers;
                await this.saveUsersToFile();
                console.log('✅ Dados importados com sucesso');
                return true;
            } else {
                throw new Error('Formato de dados inválido');
            }
        } catch (error) {
            throw new Error('Erro ao importar dados: ' + error.message);
        }
    }

    // Sincronizar com arquivo (recarregar dados)
    async syncWithFile() {
        try {
            await this.loadUsersFromFile();
            console.log('🔄 Dados sincronizados com arquivo');
            return true;
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            throw error;
        }
    }

    // Backup automático
    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup_usuarios_${timestamp}.json`;
        
        try {
            const dataStr = JSON.stringify(this.users, null, 2);
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

// Criar instância global do sistema de armazenamento
console.log('🌍 Criando instância global userStorage...');

// Função para inicializar o sistema de armazenamento
async function initializeUserStorage() {
    try {
        window.userStorage = new UserStorageJSON();
        console.log('✅ userStorage criado e disponível globalmente');
        
        // Aguardar inicialização dos dados
        await window.userStorage.initializeData();
        console.log('✅ Sistema de armazenamento inicializado com', window.userStorage.users.length, 'usuários');
        
        return window.userStorage;
    } catch (error) {
        console.error('❌ Erro ao inicializar userStorage:', error);
        // Criar instância básica como fallback
        window.userStorage = new UserStorageJSON();
        return window.userStorage;
    }
}

// Inicializar automaticamente
initializeUserStorage();

// Verificar se foi criado corretamente
if (typeof window.userStorage !== 'undefined') {
    console.log('✅ userStorage está disponível globalmente');
} else {
    console.error('❌ userStorage não foi criado corretamente');
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserStorageJSON;
}
