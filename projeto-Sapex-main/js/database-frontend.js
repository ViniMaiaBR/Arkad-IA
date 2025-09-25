/**
 * Database Frontend Manager
 * Gerencia operações do banco de dados no frontend
 * Por enquanto usa localStorage como simulação
 */

class DatabaseFrontendManager {
    constructor() {
        this.storageKey = 'usuarios';
        this.init();
    }
    
    init() {
        // Inicializa o localStorage se não existir
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }
    
    // CRUD Operations
    
    /**
     * Cadastra um novo usuário
     * @param {Object} usuario - Dados do usuário
     * @returns {Object} Resultado da operação
     */
    cadastrarUsuario(usuario) {
        try {
            // Validações básicas
            if (!this.validarUsuario(usuario)) {
                return { success: false, message: 'Dados inválidos!' };
            }
            
            // Verificar se email já existe
            if (this.buscarPorEmail(usuario.email)) {
                return { success: false, message: 'Email já cadastrado!' };
            }
            
            // Gerar ID único
            usuario.id = Date.now() + Math.random();
            usuario.dataCriacao = new Date().toISOString();
            
            // Hash da senha (simulação)
            usuario.senhaHash = this.hashSenha(usuario.senha);
            delete usuario.senha; // Remove senha em texto plano
            
            // Salvar no localStorage
            const usuarios = this.obterTodos();
            usuarios.push(usuario);
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            
            return { 
                success: true, 
                message: 'Usuário cadastrado com sucesso!',
                usuario: { ...usuario, senha: undefined }
            };
            
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            return { success: false, message: 'Erro interno ao cadastrar usuário!' };
        }
    }
    
    /**
     * Busca usuário por email
     * @param {string} email - Email do usuário
     * @returns {Object|null} Usuário encontrado ou null
     */
    buscarPorEmail(email) {
        try {
            const usuarios = this.obterTodos();
            return usuarios.find(u => u.email === email) || null;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }
    
    /**
     * Verifica credenciais de login
     * @param {string} email - Email do usuário
     * @param {string} senha - Senha do usuário
     * @returns {Object} Resultado da verificação
     */
    verificarLogin(email, senha) {
        try {
            const usuario = this.buscarPorEmail(email);
            
            if (!usuario) {
                return { success: false, message: 'Usuário não encontrado!' };
            }
            
            if (this.hashSenha(senha) === usuario.senhaHash) {
                return {
                    success: true,
                    message: 'Login realizado com sucesso!',
                    usuario: { ...usuario, senhaHash: undefined }
                };
            } else {
                return { success: false, message: 'Senha incorreta!' };
            }
            
        } catch (error) {
            console.error('Erro ao verificar login:', error);
            return { success: false, message: 'Erro interno ao verificar login!' };
        }
    }
    
    /**
     * Atualiza dados de um usuário
     * @param {string} email - Email do usuário
     * @param {Object} novosDados - Novos dados para atualizar
     * @returns {Object} Resultado da operação
     */
    atualizarUsuario(email, novosDados) {
        try {
            const usuarios = this.obterTodos();
            const index = usuarios.findIndex(u => u.email === email);
            
            if (index === -1) {
                return { success: false, message: 'Usuário não encontrado!' };
            }
            
            // Atualizar apenas campos permitidos
            const camposPermitidos = ['nome', 'aniversario'];
            camposPermitidos.forEach(campo => {
                if (novosDados[campo] !== undefined) {
                    usuarios[index][campo] = novosDados[campo];
                }
            });
            
            // Atualizar senha se fornecida
            if (novosDados.novaSenha) {
                usuarios[index].senhaHash = this.hashSenha(novosDados.novaSenha);
            }
            
            // Atualizar data de modificação
            usuarios[index].dataModificacao = new Date().toISOString();
            
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            
            return { 
                success: true, 
                message: 'Usuário atualizado com sucesso!',
                usuario: { ...usuarios[index], senhaHash: undefined }
            };
            
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return { success: false, message: 'Erro interno ao atualizar usuário!' };
        }
    }
    
    /**
     * Remove um usuário
     * @param {string} email - Email do usuário
     * @returns {Object} Resultado da operação
     */
    deletarUsuario(email) {
        try {
            const usuarios = this.obterTodos();
            const usuariosFiltrados = usuarios.filter(u => u.email !== email);
            
            if (usuariosFiltrados.length === usuarios.length) {
                return { success: false, message: 'Usuário não encontrado!' };
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(usuariosFiltrados));
            
            return { success: true, message: 'Usuário removido com sucesso!' };
            
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return { success: false, message: 'Erro interno ao deletar usuário!' };
        }
    }
    
    /**
     * Lista todos os usuários
     * @returns {Array} Lista de usuários
     */
    obterTodos() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (error) {
            console.error('Erro ao obter usuários:', error);
            return [];
        }
    }
    
    /**
     * Busca usuários por critérios
     * @param {Object} criterios - Critérios de busca
     * @returns {Array} Usuários que atendem aos critérios
     */
    buscarUsuarios(criterios = {}) {
        try {
            let usuarios = this.obterTodos();
            
            // Filtrar por nome
            if (criterios.nome) {
                usuarios = usuarios.filter(u => 
                    u.nome.toLowerCase().includes(criterios.nome.toLowerCase())
                );
            }
            
            // Filtrar por email
            if (criterios.email) {
                usuarios = usuarios.filter(u => 
                    u.email.toLowerCase().includes(criterios.email.toLowerCase())
                );
            }
            
            // Filtrar por aniversário (mês)
            if (criterios.mesAniversario) {
                usuarios = usuarios.filter(u => {
                    const mes = new Date(u.aniversario).getMonth() + 1;
                    return mes === criterios.mesAniversario;
                });
            }
            
            return usuarios.map(u => ({ ...u, senhaHash: undefined }));
            
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    }
    
    /**
     * Estatísticas básicas
     * @returns {Object} Estatísticas dos usuários
     */
    obterEstatisticas() {
        try {
            const usuarios = this.obterTodos();
            
            const hoje = new Date();
            const mesAtual = hoje.getMonth() + 1;
            
            const aniversariantesMes = usuarios.filter(u => {
                const mes = new Date(u.aniversario).getMonth() + 1;
                return mes === mesAtual;
            }).length;
            
            return {
                totalUsuarios: usuarios.length,
                aniversariantesMes: aniversariantesMes,
                usuariosRecentes: usuarios.filter(u => {
                    const dataCriacao = new Date(u.dataCriacao);
                    const diasAtras = (hoje - dataCriacao) / (1000 * 60 * 60 * 24);
                    return diasAtras <= 30;
                }).length
            };
            
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return { totalUsuarios: 0, aniversariantesMes: 0, usuariosRecentes: 0 };
        }
    }
    
    // Métodos auxiliares
    
    /**
     * Valida dados do usuário
     * @param {Object} usuario - Dados do usuário
     * @returns {boolean} True se válido
     */
    validarUsuario(usuario) {
        return usuario.nome && 
               usuario.nome.trim().length >= 2 &&
               usuario.email && 
               this.validarEmail(usuario.email) &&
               usuario.aniversario &&
               usuario.senha &&
               usuario.senha.length >= 6;
    }
    
    /**
     * Valida formato de email
     * @param {string} email - Email para validar
     * @returns {boolean} True se válido
     */
    validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    /**
     * Gera hash simples da senha (em produção usar bcrypt)
     * @param {string} senha - Senha em texto plano
     * @returns {string} Hash da senha
     */
    hashSenha(senha) {
        // Hash simples para demonstração
        // Em produção, usar bcrypt ou similar
        return btoa(senha + 'salt_secreto');
    }
    
    /**
     * Limpa todos os dados (apenas para desenvolvimento)
     */
    limparDados() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita!')) {
            localStorage.removeItem(this.storageKey);
            this.init();
            alert('Dados limpos com sucesso!');
        }
    }
    
    /**
     * Exporta dados para JSON
     */
    exportarDados() {
        try {
            const usuarios = this.obterTodos();
            const dados = usuarios.map(u => ({ ...u, senhaHash: undefined }));
            
            const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `usuarios_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            alert('Erro ao exportar dados!');
        }
    }
}

// Instância global
const dbManager = new DatabaseFrontendManager();

// Funções globais para compatibilidade
function cadastrarUsuario(dados) {
    return dbManager.cadastrarUsuario(dados);
}

function verificarLogin(email, senha) {
    return dbManager.verificarLogin(email, senha);
}

function buscarUsuario(email) {
    return dbManager.buscarPorEmail(email);
}

function listarUsuarios() {
    return dbManager.obterTodos();
}

function deletarUsuario(email) {
    return dbManager.deletarUsuario(email);
}

function atualizarUsuario(email, novosDados) {
    return dbManager.atualizarUsuario(email, novosDados);
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatabaseFrontendManager;
}
