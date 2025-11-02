# 🧪 Pasta de Testes - ARKAD AI

Esta pasta contém ferramentas de teste e diagnóstico para o sistema ARKAD AI.

## 📁 Arquivos

### 1. **teste-simples.html**
**Descrição:** Teste rápido e standalone da API do Google Gemini

**Características:**
- ✅ Não depende de arquivos externos
- ✅ API key embutida no código
- ✅ Interface simples e direta
- ✅ Ideal para verificar se a API está funcionando

**Como usar:**
1. Abra o arquivo no navegador
2. Digite uma pergunta
3. Clique em "Testar Agora"
4. Veja a resposta da IA

**Quando usar:**
- Para testar rapidamente se a API key está válida
- Para verificar conectividade com o Google Gemini
- Para confirmar que o modelo está respondendo

---

### 2. **teste-api-gemini.html**
**Descrição:** Teste completo do sistema com carregamento de módulos

**Características:**
- ✅ Carrega config.js e gemini-client.js
- ✅ Testa todo o fluxo de inicialização
- ✅ Mostra informações detalhadas do sistema
- ✅ Interface visual com status

**Como usar:**
1. Abra o arquivo no navegador
2. Verifique o status da configuração
3. Digite uma pergunta no campo de teste
4. Clique em "Enviar Teste"
5. Veja os detalhes da resposta

**Quando usar:**
- Para testar o sistema completo
- Para verificar se os módulos estão carregando corretamente
- Para ver informações técnicas (modelo, limites, capacidades)

---

### 3. **diagnostico.html**
**Descrição:** Ferramenta completa de diagnóstico do sistema

**Características:**
- ✅ Verificação automática de todos os componentes
- ✅ Mostra logs em tempo real
- ✅ Identifica problemas específicos
- ✅ Interface estilo terminal/console
- ✅ Botões de ação (teste, recarregar, abrir chat)

**Como usar:**
1. Abra o arquivo no navegador
2. O diagnóstico roda automaticamente
3. Verifique as seções:
   - 📋 Informações do Navegador
   - 📦 Verificação de Arquivos
   - ⚙️ Configuração
   - 🔌 API Gemini
4. Clique em "Executar Teste" para teste em tempo real
5. Use "Abrir Chat" para ir direto ao chat

**Quando usar:**
- Para identificar problemas de configuração
- Para ver todos os logs do sistema
- Para verificar se tudo está carregado corretamente
- Para diagnosticar erros específicos

**Indicadores:**
- ✅ Verde = Funcionando
- ❌ Vermelho = Erro
- ⚠️ Amarelo = Aviso (geralmente OK)

---

## 🎯 Fluxo de Teste Recomendado

### Se tudo estiver funcionando:
1. ✅ Execute `teste-simples.html` primeiro
2. ✅ Se funcionar, vá direto para o chat
3. ✅ Use o diagnóstico apenas se houver problemas

### Se houver problemas:
1. 🔍 Execute `diagnostico.html` primeiro
2. 🔍 Identifique a seção com erro (vermelho)
3. 🔍 Siga as instruções de solução
4. 🔍 Teste novamente

---

## 📊 Estrutura de Diretórios

```
Site-ArkadIA/Projeto/
├── Testes/                    (Você está aqui)
│   ├── README.md             (Este arquivo)
│   ├── teste-simples.html    (Teste standalone)
│   ├── teste-api-gemini.html (Teste completo)
│   └── diagnostico.html      (Ferramenta de diagnóstico)
├── js/
│   ├── config.js             (Configuração da API)
│   ├── gemini-client.js      (Cliente da API)
│   └── ...
├── Index/
│   ├── chat.html             (Chat principal)
│   └── ...
└── ...
```

---

## 🔧 Configuração Necessária

Todos os arquivos de teste dependem da configuração em:
**`../js/config.js`**

Certifique-se de que a API key está configurada:
```javascript
geminiApiKey: 'AIzaSy...' // Sua API key do Google Gemini
```

---

## 💡 Dicas

### Teste Rápido (5 segundos)
```
teste-simples.html → Digite "OK" → Enter
```

### Diagnóstico Completo (30 segundos)
```
diagnostico.html → Aguarde → Clique "Executar Teste"
```

### Antes de Usar o Chat
```
diagnostico.html → Verifique tudo verde → "Abrir Chat"
```

---

## ⚠️ Solução de Problemas Comuns

### Erro: "config.js não carregado"
**Solução:** Verifique se o arquivo `../js/config.js` existe

### Erro: "API Key não configurada"
**Solução:** Edite `../js/config.js` e adicione sua API key

### Erro: "Limite de requisições"
**Solução:** Aguarde 1 minuto (limite: 15 req/min)

### Erro: "Arquivo não encontrado"
**Solução:** Abra os arquivos a partir da raiz do projeto

---

## 📝 Notas

- Estes arquivos são **apenas para teste**
- **Não** devem ir para produção
- Podem ser excluídos após verificar que tudo funciona
- A API key está **visível** no código para facilitar testes

---

## 🆘 Suporte

Se os testes falharem:
1. Verifique o console do navegador (F12)
2. Execute o `diagnostico.html`
3. Copie as mensagens de erro
4. Verifique se a API key está correta
5. Teste a conexão com a internet

---

**Última atualização:** Novembro 2025
**Versão:** 1.0
**Status:** ✅ Pronto para uso

