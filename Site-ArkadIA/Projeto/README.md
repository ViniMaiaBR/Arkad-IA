# ARKAD AI - Plataforma de Inteligência Artificial

## Sobre o Projeto

A **ARKAD AI** é uma plataforma completa de inteligência artificial desenvolvida pela equipe da Fundação Santo André. O projeto oferece soluções inovadoras em IA, incluindo chat inteligente, automação de processos, análise de dados e consultoria personalizada.

## Equipe de Desenvolvimento

- **Vinicius Maia**
- **Eduardo Romero** 
- **Gustavo Spaggiari**
- **Kelvin Herculim**

## Funcionalidades Principais

### Chat com IA
- Interface de conversação inteligente
- Respostas contextuais e personalizadas
- Integração com múltiplos modelos de IA

### Análise de Dados
- Processamento e visualização de dados
- Relatórios automáticos
- Insights inteligentes

### Automação
- Automação de processos de negócio
- Workflows inteligentes
- Integração com sistemas existentes

### Gestão de Usuários
- Sistema completo de cadastro e autenticação
- Armazenamento seguro em JSON
- Gerenciamento de permissões

### Geração de Documentos
- Criação automática de PDFs
- Relatórios personalizados
- Templates inteligentes

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Armazenamento**: JSON + localStorage
- **APIs**: File System Access API
- **Design**: CSS Grid, Flexbox, Animações CSS
- **Fontes**: Google Fonts (Inter)
- **Ícones**: Font Awesome

## Estrutura do Projeto

```
Site-ArkadIA/Projeto/
├── Index/                    # Páginas principais
│   ├── index.html           # Página inicial
│   ├── login.html           # Sistema de login
│   ├── cadastro.html        # Cadastro de usuários
│   ├── chat.html            # Interface de chat
│   ├── analise-dados.html   # Análise de dados
│   ├── automacao.html       # Automação
│   └── ...
├── css/                     # Estilos
│   ├── styles.css          # Estilos principais
│   └── temp.css            # Estilos temporários
├── js/                      # Scripts JavaScript
│   ├── auth.js             # Autenticação
│   ├── chat-ai-responses.js # Respostas do chat
│   ├── user-storage.js     # Armazenamento de usuários
│   ├── pdf-generator.js    # Gerador de PDF para resultados da IA
│   ├── chat-pdf-integration.js # Integração PDF com chat
│   ├── ai-text-processor.js # Processador de texto da IA para PDF
│   └── ...
├── images/                  # Recursos visuais
│   ├── logo.svg            # Logo da empresa
│   └── ...
└── usuarios_arkad.json     # Base de dados dos usuários
```

## Como Executar

### Pré-requisitos
- Navegador moderno (Chrome 86+, Firefox 82+, Safari 14+, Edge 86+)
- Servidor web local (opcional, mas recomendado)

### Instalação
1. Clone o repositório
2. Navegue até a pasta `Site-ArkadIA/Projeto/`
3. Abra o arquivo `Index/index.html` em seu navegador
4. Para desenvolvimento, use um servidor local:
   ```bash
   # Usando Python
   python -m http.server 8000
   
   # Usando Node.js
   npx http-server
   ```

## Sistema de Autenticação

### Cadastro de Usuários
- Validação completa de dados
- Verificação de email duplicado
- Armazenamento seguro em JSON
- Hash de senhas

### Login
- Autenticação via arquivo JSON
- Sessão persistente
- Sistema de logout seguro

## Armazenamento de Dados

O sistema utiliza **armazenamento híbrido**:
- **Primário**: Arquivo JSON (`usuarios_arkad.json`)
- **Backup**: localStorage do navegador
- **Sincronização**: Automática entre os sistemas

### Estrutura dos Dados
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

## Design e Interface

### Paleta de Cores
- **Primária**: #00B5B8 (Azul ciano)
- **Fundo**: #0A2647 (Azul escuro)
- **Texto**: #FFFFFF (Branco)
- **Secundária**: #144272 (Azul médio)

### Características Visuais
- Design responsivo e moderno
- Animações suaves e interativas
- Background neural animado
- Interface intuitiva e acessível

## Páginas Disponíveis

- **Inicial** (`index.html`) - Landing page principal
- **Sobre** (`sobre.html`) - Informações da empresa
- **Serviços** (`servicos.html`) - Catálogo de serviços
- **Planos** (`planos.html`) - Planos e preços
- **Contato** (`contato.html`) - Formulário de contato
- **Login** (`login.html`) - Autenticação
- **Cadastro** (`cadastro.html`) - Registro de usuários
- **Chat** (`chat.html`) - Interface de conversação
- **Análise de Dados** (`analise-dados.html`) - Dashboard de dados
- **Automação** (`automacao.html`) - Ferramentas de automação
- **Gerar PDF** (`gerar-pdf.html`) - Gerador de PDF para resultados da IA
- **Processar IA PDF** (`processar-ia-pdf.html`) - Processar texto da IA e gerar PDF baseado no template

## Funcionalidades Técnicas

### Sistema de Arquivos
- **Exportação**: Download de dados em JSON
- **Importação**: Carregamento de dados de arquivo
- **Backup**: Criação automática de backups
- **Sincronização**: Atualização em tempo real

### Geração de PDF
- **Relatórios de IA**: PDFs com resultados de análises
- **Histórico de Chat**: Exportação de conversas em PDF
- **Relatórios Personalizados**: Criação de documentos customizados
- **Integração Automática**: Geração automática após análises
- **Processamento de Texto IA**: Conversão de texto da IA em PDF estruturado
- **Template Profissional**: Baseado no ExemploRelatorio com formatação corporativa

### APIs Utilizadas
- **File System Access API**: Para manipulação de arquivos
- **localStorage API**: Para armazenamento local
- **Canvas API**: Para animações de background

## Troubleshooting

### Problemas Comuns

**Arquivo não é criado**
- Verifique permissões do navegador para acesso a arquivos
- Use HTTPS ou localhost para File System Access API

**Dados não persistem**
- O sistema usa localStorage como fallback automático
- Verifique se o JavaScript está habilitado

**Erro de importação**
- Verifique se o arquivo JSON está no formato correto
- Confirme que não há caracteres especiais no nome do arquivo

## Próximos Passos

- [ ] Integração com APIs de IA externas
- [ ] Sistema de notificações em tempo real
- [ ] Dashboard administrativo avançado
- [ ] Mobile app (React Native/Flutter)
- [ ] Integração com bancos de dados
- [ ] Sistema de pagamentos

## Documentação Adicional

- [Sistema de Armazenamento JSON](README-ARMAZENAMENTO-JSON.md)
- [Documentação Legal](../Documentacao/)
- [Exemplos de Uso](../TestePath/)

## Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Contato

- **Email**: contato@arkad.ai
- **Website**: [arkad.ai](https://arkad.ai)
- **Fundação Santo André**: [fsa.br](https://fsa.br)

## Licença

Este projeto foi desenvolvido como parte do programa acadêmico da Fundação Santo André. Todos os direitos reservados.

---

**ARKAD AI** - Transformando o futuro com Inteligência Artificial
