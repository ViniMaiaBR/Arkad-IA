// Sistema de Login ARKAD AI
console.log('🔐 Carregando sistema de login...');

// Função para validar senha
function validarSenha(senha) {
    if (senha.length < 8) return false;
    if (!/[A-Z]/.test(senha)) return false;
    if (!/[a-z]/.test(senha)) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[!@#$%^&*]/.test(senha)) return false;
    return true;
}

// Função para verificar se o usuário existe (usando backendStorage)
async function verificarUsuario(email, senha) {
    return new Promise(async (resolve, reject) => {
        try {
            // Aguardar backendStorage estar pronto
            if (!window.backendStorage) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Usar o sistema de armazenamento unificado
            const usuario = window.backendStorage ? 
                window.backendStorage.authenticateUser(email, senha) : 
                (window.userStorage ? window.userStorage.authenticateUser(email, senha) : null);
            resolve(usuario !== null);
        } catch (error) {
            console.error('Erro ao verificar usuário:', error);
            reject(error);
        }
    });
}

// Função para cadastrar novo usuário (usando backendStorage)
async function cadastrarUsuario(email, senha, nome, dataNascimento) {
    if (!validarSenha(senha)) {
        throw new Error('Senha inválida. Deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo especial.');
    }

    try {
        // Aguardar backendStorage estar pronto
        if (!window.backendStorage) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const storage = window.backendStorage || window.userStorage;
        
        // Usar o sistema de armazenamento unificado
        const dadosUsuario = {
            nome: nome,
            email: email,
            senha: senha,
            aniversario: dataNascimento
        };
        
        const novoUsuario = await storage.addUser(dadosUsuario);
        console.log(`Usuário cadastrado: ${nome} (${email}) - Data de nascimento: ${dataNascimento}`);
        return true;
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        throw error;
    }
}

// Função para lidar com o login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    try {
        // Aguardar backendStorage estar pronto
        if (!window.backendStorage) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const storage = window.backendStorage || window.userStorage;
        const usuario = storage.authenticateUser(email, senha);
        
        if (usuario) {
            successMessage.textContent = 'Login realizado com sucesso!';
            successMessage.style.display = 'block';
            
            // Armazenar informações do usuário logado (compatibilidade)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTime', Date.now());
            localStorage.setItem('userInfo', JSON.stringify(usuario));
            
            // Armazenar também a sessão se disponível
            if (usuario.session) {
                localStorage.setItem('currentSession', JSON.stringify(usuario.session));
            }
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            errorMessage.textContent = 'Usuário não encontrado ou senha incorreta';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        errorMessage.textContent = error.message || 'Erro ao realizar login. Tente novamente.';
        errorMessage.style.display = 'block';
    }
    
    return false;
}

// Verifica se o usuário já está logado
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    
    if (isLoggedIn === 'true' && loginTime) {
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(loginTime);
        
        if (timeDiff < 24 * 60 * 60 * 1000) { // 24 horas
            window.location.href = 'index.html';
        } else {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');
        }
    }
}

// Verifica o status do login quando a página carrega
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Função para obter informações do usuário logado
function getLoggedUser() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            return JSON.parse(userInfo);
        } catch (error) {
            console.error('Erro ao parsear informações do usuário:', error);
            return null;
        }
    }
    return null;
}

// Função para fazer logout
async function logout() {
    // Finalizar sessão no backendStorage se disponível
    try {
        const currentSession = localStorage.getItem('currentSession');
        if (currentSession && window.backendStorage) {
            const session = JSON.parse(currentSession);
            window.backendStorage.endSession(session.id);
        }
    } catch (error) {
        console.error('Erro ao finalizar sessão:', error);
    }
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('currentSession');
    window.location.href = 'Index/chat.html';
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    
    if (isLoggedIn === 'true' && loginTime) {
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(loginTime);
        
        // Verificar se a sessão não expirou (24 horas)
        if (timeDiff < 24 * 60 * 60 * 1000) {
            return true;
        } else {
            logout(); // Fazer logout automático se a sessão expirou
            return false;
        }
    }
    
    return false;
} 