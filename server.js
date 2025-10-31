const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos (CSS, JS, imagens)
app.use('/css', express.static(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'css')));
app.use('/js', express.static(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'js')));
app.use('/images', express.static(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'images')));
app.use('/Prompts', express.static(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Prompts')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz - redireciona para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', 'index.html'));
});

// Rota para API - disponibiliza a chave de API (CUIDADO: use apenas em ambiente controlado)
app.get('/api/config', (req, res) => {
    res.json({
        geminiApiKey: process.env.GEMINI_API_KEY
    });
});

// Middleware para servir arquivos HTML da pasta Index
app.use((req, res, next) => {
    // Se a requisição é para um arquivo .html
    if (req.path.endsWith('.html')) {
        const htmlPath = path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', path.basename(req.path));
        
        // Verifica se o arquivo existe
        if (fs.existsSync(htmlPath)) {
            return res.sendFile(htmlPath);
        }
    }
    
    // Se a requisição não tem extensão, tenta adicionar .html
    if (!req.path.includes('.') && req.path !== '/') {
        const htmlPath = path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', req.path + '.html');
        
        // Verifica se o arquivo existe
        if (fs.existsSync(htmlPath)) {
            return res.sendFile(htmlPath);
        }
    }
    
    next();
});

// Tratamento de erro 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Servindo arquivos de: Site-ArkadIA/Projeto`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

