const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'Site-ArkadIA', 'Projeto')));
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

// Middleware para tratar rotas HTML sem extensão
app.use((req, res, next) => {
    if (!req.path.includes('.') && req.path !== '/') {
        const htmlPath = path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', req.path + '.html');
        res.sendFile(htmlPath, (err) => {
            if (err) {
                next();
            }
        });
    } else {
        next();
    }
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

