# Sistema de Armazenamento JSON - ARKAD AI

## Visão Geral

O sistema foi modificado para **sempre usar arquivo JSON como padrão** para armazenar os dados dos usuários. Agora todos os cadastros são salvos e consultados diretamente no arquivo `usuarios_arkad.json`.

## Como Funciona

### 1. Armazenamento Automático
- **Todas as operações** (cadastro, login, edição, exclusão) são automaticamente salvas no arquivo JSON
- O sistema carrega os dados do arquivo na inicialização
- localStorage é usado apenas como backup/cache

### 2. Arquivo Principal
- **Arquivo padrão**: `usuarios_arkad.json`
- **Localização**: Raiz do projeto
- **Formato**: JSON array com objetos de usuário

### 3. Estrutura dos Dados
```json
[
  {
    "id": "user_1705312200000_abc123",
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "senha": "hash_da_senha",
    "aniversario": "1990-05-15",
    "dataCadastro": "2024-01-15T10:30:00.000Z",
    "ativo": true
  }
]
```

## Funcionalidades

### ✅ Cadastro de Usuários
- Sempre salva no arquivo JSON
- Validação completa de dados
- Verificação de email duplicado

### ✅ Login
- Consulta dados do arquivo JSON
- Autenticação segura
- Sessão persistente

### ✅ Gerenciamento
- Exportar para arquivo físico
- Importar de arquivo JSON
- Backup automático
- Sincronização com arquivo

### ✅ Operações CRUD
- **C**reate: Adicionar usuário
- **R**ead: Consultar usuários
- **U**pdate: Editar usuário
- **D**elete: Desativar usuário

## Arquivos Modificados

### 1. `js/user-storage-json.js` (NOVO)
- Sistema principal de armazenamento
- Sempre usa arquivo JSON
- Operações assíncronas
- Backup automático

### 2. `Index/cadastro.html`
- Usa novo sistema de armazenamento
- Salvamento automático em JSON

### 3. `Index/login.html`
- Autenticação via arquivo JSON
- Sistema de sessão mantido

### 4. `Index/cadastro-usuarios.html`
- Interface de gerenciamento
- Operações CRUD completas

### 5. `Index/gerenciar-arquivos.html`
- Exportar/Importar dados
- Backup e sincronização
- Estatísticas em tempo real

## Como Usar

### Para Desenvolvedores
1. **Inicialização**: O sistema carrega automaticamente o arquivo JSON
2. **Operações**: Todas as operações são assíncronas
3. **Fallback**: localStorage como backup se arquivo não disponível

### Para Usuários
1. **Cadastro**: Dados salvos automaticamente em JSON
2. **Login**: Consulta dados do arquivo JSON
3. **Gerenciamento**: Use a página "Gerenciar Arquivos" para backup/restore

## Compatibilidade

### Navegadores Suportados
- ✅ Chrome 86+
- ✅ Firefox 82+
- ✅ Safari 14+
- ✅ Edge 86+

### File System Access API
- **Suportado**: Salva diretamente no arquivo
- **Não suportado**: Faz download do arquivo

## Backup e Restore

### Backup Automático
```javascript
await userStorage.createBackup();
```

### Restore de Dados
```javascript
await userStorage.importData(jsonData);
```

### Sincronização
```javascript
await userStorage.syncWithFile();
```

## Exemplo de Uso

```javascript
// Aguardar inicialização
await userStorage.initializeData();

// Cadastrar usuário
const novoUsuario = await userStorage.addUser({
    nome: "João Silva",
    email: "joao@email.com",
    senha: "123456",
    aniversario: "1990-05-15"
});

// Autenticar usuário
const usuario = userStorage.authenticateUser("joao@email.com", "123456");

// Obter todos os usuários
const usuarios = userStorage.getAllUsers();
```

## Vantagens

1. **Persistência**: Dados sempre salvos em arquivo físico
2. **Portabilidade**: Fácil backup e transferência
3. **Transparência**: Dados visíveis e editáveis
4. **Confiabilidade**: Sistema robusto com fallbacks
5. **Flexibilidade**: Suporte a export/import

## Troubleshooting

### Problema: Arquivo não é criado
**Solução**: Verifique permissões do navegador para acesso a arquivos

### Problema: Dados não persistem
**Solução**: Use localStorage como fallback (automático)

### Problema: Erro de importação
**Solução**: Verifique formato JSON válido

## Logs e Debug

O sistema possui logs detalhados no console:
- 🔧 Inicialização
- 📂 Carregamento de dados
- 💾 Salvamento
- ✅ Operações bem-sucedidas
- ❌ Erros e problemas

## Conclusão

O sistema agora garante que **todos os dados dos usuários sejam sempre armazenados e consultados em arquivo JSON**, proporcionando maior confiabilidade e transparência no armazenamento de dados.
