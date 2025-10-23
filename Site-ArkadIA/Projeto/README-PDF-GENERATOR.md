# Sistema de Geração de PDF - ARKAD AI

## Visão Geral

O sistema de geração de PDF da ARKAD AI permite criar relatórios profissionais com os resultados das análises de IA, históricos de chat e documentos personalizados.

## Arquivos do Sistema

### 1. `js/pdf-generator.js`
Classe principal para geração de PDFs com funcionalidades:
- Geração de relatórios de análise de IA
- Exportação de histórico de chat
- Criação de documentos personalizados
- Configurações avançadas de PDF

### 2. `js/chat-pdf-integration.js`
Integração com o sistema de chat existente:
- Botão flutuante para gerar PDF
- Monitoramento automático de conversas
- Respostas rápidas para PDF
- Estatísticas do chat

### 3. `Index/gerar-pdf.html`
Interface web para geração de PDF:
- Formulário interativo
- Pré-visualização em tempo real
- Exemplos predefinidos
- Configurações personalizadas

## Como Usar

### Geração Básica de PDF

```javascript
// Carregar o gerador
<script src="js/pdf-generator.js"></script>

// Gerar PDF de análise
const analysisData = {
    summary: "Análise completa dos dados de vendas",
    results: [
        {
            title: "Crescimento",
            description: "Aumento nas vendas",
            value: "+15%"
        }
    ],
    recommendations: [
        "Aumentar investimento em marketing",
        "Expandir linha de produtos"
    ]
};

window.generateAIPDF(analysisData, {
    filename: "Relatorio_Vendas.pdf"
});
```

### Geração de PDF do Chat

```javascript
// Carregar integração
<script src="js/chat-pdf-integration.js"></script>

// O sistema monitora automaticamente as conversas
// Use o botão flutuante ou a função:
window.chatPDFIntegration.generateChatPDF();
```

### PDF Personalizado

```javascript
const customHTML = `
    <h1>Meu Relatório</h1>
    <p>Conteúdo personalizado aqui</p>
`;

window.generateCustomPDF(customHTML, {
    filename: "Relatorio_Personalizado.pdf"
});
```

## Tipos de PDF Suportados

### 1. Relatórios de Análise
- Resumo executivo
- Resultados detalhados
- Recomendações da IA
- Dados estruturados
- Visualizações (texto)

### 2. Histórico de Chat
- Mensagens do usuário e IA
- Timestamps
- Resumo da conversa
- Estatísticas da sessão
- Tópicos discutidos

### 3. Documentos Personalizados
- HTML customizado
- Cabeçalhos e rodapés
- Estilos personalizados
- Conteúdo dinâmico

## Configurações Avançadas

### Opções de PDF

```javascript
const options = {
    margin: [0.5, 0.5, 0.5, 0.5],        // Margens (top, right, bottom, left)
    filename: "meu_relatorio.pdf",        // Nome do arquivo
    image: { 
        type: 'jpeg', 
        quality: 0.98 
    },
    html2canvas: { 
        scale: 2,                         // Qualidade da renderização
        useCORS: true,
        letterRendering: true
    },
    jsPDF: { 
        unit: 'in',                       // Unidade (in, mm, cm)
        format: 'a4',                     // Tamanho (a4, letter, etc)
        orientation: 'portrait',          // Orientação
        compress: true                    // Compressão
    }
};
```

### Estilos Personalizados

```javascript
// Adicionar cabeçalho padrão
const content = window.pdfGenerator.addDefaultHeader(
    "<h1>Meu Conteúdo</h1>", 
    "Título do Relatório"
);

window.generateCustomPDF(content);
```

## Integração com Chat

### Botão Flutuante
- Aparece automaticamente no chat
- Posicionado no canto inferior direito
- Estilo consistente com o design

### Respostas Rápidas
- Opção "📄 Gerar PDF do Chat" aparece automaticamente
- Integração com sistema de quick replies existente
- Mensagens de confirmação

### Monitoramento Automático
- Captura todas as mensagens do chat
- Armazena histórico localmente
- Gera estatísticas automáticas

## Estrutura de Dados

### Dados de Análise
```javascript
{
    summary: "Resumo da análise",
    results: [
        {
            title: "Título do resultado",
            description: "Descrição detalhada",
            value: "Valor ou métrica"
        }
    ],
    recommendations: [
        "Recomendação 1",
        "Recomendação 2"
    ],
    data: { /* dados brutos */ },
    charts: [ /* informações de gráficos */ ]
}
```

### Dados de Chat
```javascript
{
    messages: [
        {
            type: "user" | "ai",
            content: "Conteúdo da mensagem",
            timestamp: "14:30",
            date: "15/01/2024"
        }
    ],
    summary: "Resumo da conversa",
    metadata: {
        totalMessages: 10,
        userMessages: 5,
        aiMessages: 5,
        sessionDate: "15/01/2024",
        sessionTime: "14:30"
    }
}
```

## Funcionalidades Avançadas

### Análise de Tópicos
- Extração automática de tópicos da conversa
- Categorização por palavras-chave
- Identificação de insights principais

### Estatísticas do Chat
- Contagem de mensagens
- Duração da sessão
- Tópicos mais discutidos
- Padrões de conversa

### Resumos Inteligentes
- Geração automática de resumos
- Identificação de insights principais
- Extração de recomendações

## Troubleshooting

### Problemas Comuns

**PDF não é gerado**
- Verifique se a biblioteca html2pdf.js está carregada
- Confirme se o navegador suporta File System Access API
- Verifique o console para erros JavaScript

**Conteúdo não aparece no PDF**
- Verifique se os dados estão no formato correto
- Confirme se o HTML é válido
- Teste com dados de exemplo

**Erro de permissão**
- Use HTTPS ou localhost
- Verifique configurações do navegador
- Tente em modo incógnito

### Debug

```javascript
// Habilitar logs detalhados
window.pdfGenerator.debug = true;

// Verificar status
console.log(window.chatPDFIntegration.getChatStats());

// Limpar histórico
window.chatPDFIntegration.clearChatHistory();
```

## Exemplos de Uso

### 1. Relatório de Vendas
```javascript
const salesData = {
    summary: "Análise de vendas do último trimestre",
    results: [
        { title: "Crescimento", description: "Aumento nas vendas", value: "+15%" },
        { title: "Produto Top", description: "Produto mais vendido", value: "Produto A" }
    ],
    recommendations: [
        "Aumentar investimento em marketing",
        "Expandir linha de produtos"
    ]
};

window.generateAIPDF(salesData, { filename: "Relatorio_Vendas.pdf" });
```

### 2. Exportar Chat
```javascript
// Automático - use o botão flutuante
// Ou programaticamente:
window.chatPDFIntegration.generateChatPDF();
```

### 3. Documento Personalizado
```javascript
const customContent = `
    <h1>Relatório Executivo</h1>
    <h2>Resumo</h2>
    <p>Análise completa realizada pela IA...</p>
    <h2>Recomendações</h2>
    <ul>
        <li>Implementar automação</li>
        <li>Otimizar processos</li>
    </ul>
`;

window.generateCustomPDF(customContent, { filename: "Relatorio_Executivo.pdf" });
```

## Compatibilidade

### Navegadores Suportados
- ✅ Chrome 86+
- ✅ Firefox 82+
- ✅ Safari 14+
- ✅ Edge 86+

### Dependências
- html2pdf.js 0.10.1+
- Font Awesome 6.0+
- Google Fonts (Inter)

## Próximas Funcionalidades

- [ ] Templates de PDF personalizáveis
- [ ] Integração com gráficos e charts
- [ ] Assinatura digital
- [ ] Compressão avançada
- [ ] Múltiplos formatos (DOCX, TXT)
- [ ] Agendamento de relatórios
- [ ] Envio por email automático

## Suporte

Para dúvidas ou problemas:
- Verifique a documentação principal
- Consulte os exemplos fornecidos
- Teste com dados de exemplo
- Verifique o console do navegador

---

**Sistema de PDF ARKAD AI** - Transformando resultados de IA em documentos profissionais
