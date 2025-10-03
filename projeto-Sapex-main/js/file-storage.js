// Sistema de Armazenamento em Arquivo JSON Físico
// Este arquivo gerencia o armazenamento dos dados dos usuários em arquivo JSON

class FileStorage {
    constructor() {
        this.fileName = 'usuarios_arkad.json';
        this.users = [];
        this.isFileSystemSupported = 'showSaveFilePicker' in window;
        console.log('📁 FileStorage inicializado. FileSystem suportado:', this.isFileSystemSupported);
    }

    // Carregar dados do arquivo JSON
    async loadFromFile() {
        try {
            if (this.isFileSystemSupported) {
                return await this.loadFromFileSystem();
            } else {
                return await this.loadFromLocalStorage();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar arquivo:', error);
            return [];
        }
    }

    // Carregar usando File System Access API
    async loadFromFileSystem() {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'Arquivos JSON',
                    accept: { 'application/json': ['.json'] }
                }],
                multiple: false
            });

            const file = await fileHandle.getFile();
            const content = await file.text();
            const data = JSON.parse(content);
            
            console.log('📂 Arquivo carregado:', file.name);
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('📁 Carregamento cancelado pelo usuário');
                return [];
            }
            throw error;
        }
    }

    // Carregar do localStorage como fallback
    async loadFromLocalStorage() {
        const stored = localStorage.getItem('arkad_users');
        if (stored) {
            console.log('📦 Dados carregados do localStorage');
            return JSON.parse(stored);
        }
        return [];
    }

    // Salvar dados no arquivo JSON
    async saveToFile(users) {
        try {
            if (this.isFileSystemSupported) {
                return await this.saveToFileSystem(users);
            } else {
                return await this.saveAsDownload(users);
            }
        } catch (error) {
            console.error('❌ Erro ao salvar arquivo:', error);
            throw error;
        }
    }

    // Salvar usando File System Access API
    async saveToFileSystem(users) {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: this.fileName,
                types: [{
                    description: 'Arquivos JSON',
                    accept: { 'application/json': ['.json'] }
                }]
            });

            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(users, null, 2));
            await writable.close();

            console.log('💾 Arquivo salvo:', fileHandle.name);
            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('💾 Salvamento cancelado pelo usuário');
                return false;
            }
            throw error;
        }
    }

    // Salvar como download (fallback)
    async saveAsDownload(users) {
        const dataStr = JSON.stringify(users, null, 2);
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

    // Carregar arquivo via input
    async loadFromInput(inputElement) {
        return new Promise((resolve, reject) => {
            const file = inputElement.files[0];
            if (!file) {
                reject(new Error('Nenhum arquivo selecionado'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    console.log('📂 Arquivo carregado via input:', file.name);
                    resolve(data);
                } catch (error) {
                    reject(new Error('Erro ao parsear arquivo JSON: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }

    // Validar estrutura dos dados
    validateUserData(data) {
        if (!Array.isArray(data)) {
            throw new Error('Dados devem ser um array');
        }

        for (const user of data) {
            if (!user.id || !user.nome || !user.email || !user.aniversario) {
                throw new Error('Estrutura de dados inválida: campos obrigatórios ausentes');
            }
        }

        return true;
    }

    // Exportar dados atuais
    exportCurrentData() {
        const currentData = localStorage.getItem('arkad_users');
        if (currentData) {
            return JSON.parse(currentData);
        }
        return [];
    }

    // Importar dados para localStorage
    importToLocalStorage(data) {
        try {
            this.validateUserData(data);
            localStorage.setItem('arkad_users', JSON.stringify(data));
            console.log('✅ Dados importados para localStorage');
            return true;
        } catch (error) {
            console.error('❌ Erro ao importar dados:', error);
            throw error;
        }
    }

    // Sincronizar com localStorage
    async syncWithLocalStorage() {
        try {
            const localData = this.exportCurrentData();
            if (localData.length > 0) {
                await this.saveToFile(localData);
                console.log('🔄 Dados sincronizados com arquivo');
                return true;
            } else {
                console.log('📭 Nenhum dado local para sincronizar');
                return false;
            }
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
            const data = this.exportCurrentData();
            if (data.length > 0) {
                const dataStr = JSON.stringify(data, null, 2);
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
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao criar backup:', error);
            throw error;
        }
    }
}

// Criar instância global
window.fileStorage = new FileStorage();

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileStorage;
}
