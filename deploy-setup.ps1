# Script de Configuração para Deploy no Render
# Execute este script antes do primeiro deploy

Write-Host "🚀 Configurando projeto para deploy no Render..." -ForegroundColor Cyan
Write-Host ""

# 1. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Testar servidor localmente
Write-Host "🧪 Deseja testar o servidor localmente antes do deploy? (S/N)" -ForegroundColor Yellow
$teste = Read-Host

if ($teste -eq "S" -or $teste -eq "s") {
    Write-Host "🌐 Iniciando servidor local em http://localhost:3000" -ForegroundColor Cyan
    Write-Host "⚠️  Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
    Write-Host ""
    npm start
}

Write-Host ""

# 3. Preparar para commit
Write-Host "📝 Preparando arquivos para commit no Git..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Arquivos que serão commitados:" -ForegroundColor Cyan
Write-Host "  ✓ server.js (servidor Express)" -ForegroundColor White
Write-Host "  ✓ package.json (dependências)" -ForegroundColor White
Write-Host "  ✓ .gitignore (ignora .env)" -ForegroundColor White
Write-Host "  ✓ .env.example (template)" -ForegroundColor White
Write-Host "  ✓ render.yaml (config do Render)" -ForegroundColor White
Write-Host "  ✓ RENDER_DEPLOY.md (documentação)" -ForegroundColor White
Write-Host ""

Write-Host "Arquivos que NÃO serão commitados:" -ForegroundColor Yellow
Write-Host "  ✗ .env (variáveis secretas)" -ForegroundColor Red
Write-Host "  ✗ node_modules/ (dependências)" -ForegroundColor Red
Write-Host "  ✗ render_server.txt (REMOVIDO - tinha API key exposta)" -ForegroundColor Red
Write-Host ""

# 4. Git commands
Write-Host "🔍 Deseja fazer commit e push agora? (S/N)" -ForegroundColor Yellow
$commit = Read-Host

if ($commit -eq "S" -or $commit -eq "s") {
    Write-Host "📝 Adicionando arquivos..." -ForegroundColor Cyan
    git add .
    
    Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
    git commit -m "Configuração para deploy no Render - Server Express + variáveis de ambiente"
    
    Write-Host "☁️ Enviando para GitHub..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Código enviado para GitHub com sucesso!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️ Erro ao enviar para GitHub. Verifique suas credenciais." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Acesse: https://render.com" -ForegroundColor White
Write-Host "   2. Clique em 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "   3. Conecte o repositório: ViniMaiaBR/Arkad-IA" -ForegroundColor White
Write-Host "   4. Configure:" -ForegroundColor White
Write-Host "      - Build Command: npm install" -ForegroundColor Gray
Write-Host "      - Start Command: npm start" -ForegroundColor Gray
Write-Host "      - Add Environment Variable:" -ForegroundColor Gray
Write-Host "        GEMINI_API_KEY = AIzaSyAOw6QNV464bl666GzoY3-M27cpLFpjlHU" -ForegroundColor Gray
Write-Host "   5. Clique em 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "📖 Consulte RENDER_DEPLOY.md para instruções detalhadas" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

