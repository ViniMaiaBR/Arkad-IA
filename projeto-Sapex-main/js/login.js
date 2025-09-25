// Importar configurações
let DB_CONFIG, SECURITY_CONFIG, MESSAGES;

// Carregar configurações
fetch('../js/config.js')
    .then(response => response.text())
    .then(text => {
        // Executar o código do config.js
        eval(text);
        // Inicializar configurações após carregar
        initConfig();
    })
    .catch(error => console.error('Erro ao carregar configurações:', error));

// Função para inicializar configurações
function initConfig() {
    console.log('Configurações carregadas para Oracle Database');
}

// Função para validar senha
function validarSenha(senha) {
    if (senha.length < 8) return false;
    if (!/[A-Z]/.test(senha)) return false;
    if (!/[a-z]/.test(senha)) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[!@#$%^&*]/.test(senha)) return false;
    return true;
}

// Função para verificar tentativas de login (será implementada com Oracle)
function verificarTentativasLogin(email) {
    return new Promise((resolve, reject) => {
        // TODO: Implementar verificação de tentativas de login com Oracle
        // Por enquanto, retorna 0 tentativas
        resolve(0);
    });
}

// Função para registrar tentativa de login (será implementada com Oracle)
function registrarTentativaLogin(email, status) {
    // TODO: Implementar registro de tentativas de login com Oracle
    console.log(`Tentativa de login registrada: ${email} - ${status}`);
}

// Função para verificar se o usuário existe (será implementada com Oracle)
async function verificarUsuario(email, senha) {
    const tentativas = await verificarTentativasLogin(email);
    
    if (tentativas >= 5) {
        throw new Error(MESSAGES.accountLocked);
    }

    // TODO: Implementar verificação de usuário com Oracle
    // Por enquanto, retorna false para simular usuário não encontrado
    return new Promise((resolve, reject) => {
        // Simular verificação com Oracle
        setTimeout(() => {
            // Aqui será feita a consulta real ao Oracle
            // SELECT * FROM usuarios WHERE email = ? AND senha = ?
            resolve(false);
        }, 100);
    });
}

// Função para cadastrar novo usuário (será implementada com Oracle)
async function cadastrarUsuario(email, senha, nome, dataNascimento) {
    if (!validarSenha(senha)) {
        throw new Error(MESSAGES.invalidPassword);
    }

    return new Promise((resolve, reject) => {
        // TODO: Implementar cadastro de usuário com Oracle
        // Por enquanto, simula sucesso
        setTimeout(() => {
            // Aqui será feita a inserção real no Oracle
            // INSERT INTO usuarios (email, senha, nome, data_nascimento) VALUES (?, ?, ?, ?)
            console.log(`Usuário cadastrado: ${nome} (${email}) - Data de nascimento: ${dataNascimento}`);
            resolve(true);
        }, 500);
    });
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
        const usuarioExiste = await verificarUsuario(email, senha);
        
        if (usuarioExiste) {
            successMessage.textContent = MESSAGES.loginSuccess;
            successMessage.style.display = 'block';
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTime', Date.now());
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            errorMessage.textContent = MESSAGES.loginFailed;
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