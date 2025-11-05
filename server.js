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

// Endpoint para servir documentos legais
app.get('/api/documentos-legais/:filename', (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'documentos-legais', filename);
        
        // Verificar se o arquivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                error: 'Arquivo não encontrado',
                filename: filename 
            });
        }
        
        // Verificar se é um arquivo .txt
        if (!filename.endsWith('.txt')) {
            return res.status(400).json({ 
                error: 'Tipo de arquivo não permitido',
                filename: filename 
            });
        }
        
        // Ler e enviar o arquivo
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        res.send(fileContent);
    } catch (error) {
        console.error('Erro ao servir documento legal:', error);
        res.status(500).json({ 
            error: 'Erro ao ler o arquivo',
            message: error.message 
        });
    }
});

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

// Rotas para páginas de termos e políticas
app.get('/termos-de-uso', (req, res) => {
    res.sendFile(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', 'termos-de-uso.html'));
});

app.get('/politica-cookies', (req, res) => {
    res.sendFile(path.join(__dirname, 'Site-ArkadIA', 'Projeto', 'Index', 'politica-cookies.html'));
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

