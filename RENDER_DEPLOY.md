# 🚀 Guia de Deploy no Render

## Arquivos Criados

1. **`.env`** - Variáveis de ambiente (NÃO fazer commit deste arquivo)
2. **`.env.example`** - Template das variáveis de ambiente
3. **`server.js`** - Servidor Express para servir a aplicação
4. **`package.json`** - Configurações e dependências do Node.js
5. **`render.yaml`** - Configuração automática do Render
6. **`.gitignore`** - Arquivos a serem ignorados pelo Git

## 📋 Passos para Deploy no Render

### 1. Preparar o Repositório

```bash
# Instalar as dependências localmente (opcional, para testar)
npm install

# Adicionar os novos arquivos ao Git
git add .
git commit -m "Configuração para deploy no Render"
git push origin main
```

### 2. Configurar no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório do GitHub: `ViniMaiaBR/Arkad-IA`
4. Configure:
   - **Name**: arkad-ia (ou o nome que preferir)
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: deixe vazio (raiz do projeto)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 3. Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

```
GEMINI_API_KEY = AIzaSyAOw6QNV464bl666GzoY3-M27cpLFpjlHU
NODE_ENV = production
PORT = 10000
SESSION_SECRET = [clique em "Generate" para criar um valor seguro]
```

⚠️ **IMPORTANTE**: Nunca compartilhe sua `GEMINI_API_KEY` publicamente!

### 4. Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (leva alguns minutos)
3. Seu site estará disponível em: `https://arkad-ia.onrender.com`

## 🧪 Testar Localmente

Antes de fazer o deploy, você pode testar localmente:

```bash
# Instalar dependências
npm install

# Rodar o servidor
npm start

# Ou em modo desenvolvimento (com auto-reload)
npm run dev
```

Acesse: `http://localhost:3000`

## 📝 Notas Importantes

### Arquivos Importantes

- **NÃO** faça commit do arquivo `.env` (já está no .gitignore)
- **FAÇA** commit do `.env.example` (é um template)
- O `server.js` serve todos os arquivos da pasta `Site-ArkadIA/Projeto`

### Estrutura de Rotas

- `/` → Página inicial (`Site-ArkadIA/Projeto/Index/index.html`)
- `/login` → Página de login
- `/sobre` → Página sobre
- Todas as páginas HTML em `Site-ArkadIA/Projeto/Index/` ficam acessíveis

### API de Configuração

O servidor expõe um endpoint para obter as configurações:
- `GET /api/config` → Retorna a chave de API (use com cuidado!)

### Problemas Comuns

1. **"Couldn't find package.json"**: 
   - Certifique-se de que o Root Directory está vazio no Render
   - O package.json deve estar na raiz do repositório

2. **Erro ao carregar CSS/JS**:
   - Verifique os caminhos nos arquivos HTML
   - O servidor serve tudo a partir de `Site-ArkadIA/Projeto`

3. **API Key não funciona**:
   - Verifique se adicionou a variável `GEMINI_API_KEY` no Render
   - Verifique o console do navegador para erros

## 🔒 Segurança

⚠️ **ATENÇÃO**: A API Key está exposta em `render_server.txt`. Considere:

1. Remover este arquivo:
   ```bash
   git rm Site-ArkadIA/Projeto/js/render_server.txt
   git commit -m "Remove arquivo com API key exposta"
   git push
   ```

2. Gerar uma nova API Key no [Google AI Studio](https://makersuite.google.com/app/apikey)

3. Atualizar a variável de ambiente no Render

## 📞 Suporte

Se tiver problemas, verifique os logs no Render:
- Dashboard → Seu serviço → Aba "Logs"

---

✅ **Deploy configurado com sucesso!** 🎉

