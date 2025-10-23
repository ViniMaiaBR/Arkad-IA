// Sistema de Autenticação ARKAD AI
// Baseado no exemplo de login/cadastro com localStorage

// ----- CONSTANTES -----
const STORAGE_KEY = 'arkad_ai_users';
const CURRENT_KEY = 'arkad_ai_current';

// ----- UTILITÁRIOS -----
async function sha256(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hash);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ----- GERENCIAMENTO DE USUÁRIOS -----
function loadUsers() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function saveUsers(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

// ----- GERENCIAMENTO DE SESSÃO -----
function setCurrent(email, remember) {
    const payload = { email, at: new Date().toISOString() };
    if (remember) {
        localStorage.setItem(CURRENT_KEY, JSON.stringify(payload));
    } else {
        sessionStorage.setItem(CURRENT_KEY, JSON.stringify(payload));
    }
}

function clearCurrent() {
    localStorage.removeItem(CURRENT_KEY);
    sessionStorage.removeItem(CURRENT_KEY);
}

function getCurrent() {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) || sessionStorage.getItem(CURRENT_KEY) || 'null');
}

// ----- FUNÇÕES DE AUTENTICAÇÃO -----
async function registerUser(name, email, password) {
    const users = loadUsers();
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
        throw new Error('Já existe uma conta com esse email.');
    }
    
    // Validar senha
    if (password.length < 6) {
        throw new Error('Senha precisa ter ao menos 6 caracteres.');
    }
    
    // Hash da senha
    const hashed = await sha256(password);
    
    // Criar usuário
    const user = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashed,
        created: new Date().toISOString()
    };
    
    users.push(user);
    saveUsers(users);
    
    return user;
}

async function loginUser(email, password, remember = false) {
    const users = loadUsers();
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    
    const hashed = await sha256(password);
    if (hashed !== user.password) {
        throw new Error('Senha inválida.');
    }
    
    setCurrent(email, remember);
    return user;
}

function logoutUser() {
    clearCurrent();
}

function deleteUser(email) {
    const users = loadUsers().filter(u => u.email !== email);
    saveUsers(users);
    clearCurrent();
}

function getCurrentUser() {
    const current = getCurrent();
    if (!current) return null;
    
    const users = loadUsers();
    const user = users.find(u => u.email === current.email);
    
    if (!user) {
        clearCurrent();
        return null;
    }
    
    return user;
}

// ----- FUNÇÕES DE VALIDAÇÃO -----
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateName(name) {
    return name.trim().length >= 2;
}

// ----- EXPORTAR FUNÇÕES PARA USO GLOBAL -----
window.ARKAD_AUTH = {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    getCurrentUser,
    validateEmail,
    validatePassword,
    validateName,
    getCurrent,
    clearCurrent
};
