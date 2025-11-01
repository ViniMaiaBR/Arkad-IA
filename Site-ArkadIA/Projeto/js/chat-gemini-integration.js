// Integração do Chat com API Gemini - Sistema PRO
// Usa o prompt do Documentacao/prompts_txt/PromptFrameworkI.txt como contexto base

class ChatGeminiIntegration {
    constructor() {
        this.geminiClient = null;
        this.systemPrompt = '';
        this.conversationHistory = [];
        this.isProUser = false;
        this.initialized = false;
        this.currentChatId = null;
        this.userId = null;
    }

    // Inicializar sistema
    async initialize() {
        if (this.initialized) return true;

        try {
            // Inicializar cliente Gemini
            this.geminiClient = window.geminiClient || new GeminiClient();
            await this.geminiClient.initialize();

            // Carregar prompt do sistema
            await this.loadSystemPrompt();

            // Verificar plano do usuário
            this.checkUserPlan();

            this.initialized = true;
            console.log('✅ Chat Gemini Integration inicializado');
            console.log(`📊 Modo: ${this.isProUser ? 'PRO' : 'GRATUITO'}`);
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar Chat Gemini:', error);
            return false;
        }
    }

    // Carregar prompt do sistema (Framework)
    async loadSystemPrompt() {
        // Prompt base do Documentacao/prompts_txt/PromptFrameworkI.txt
        this.systemPrompt = `
# INSTRUÇÕES GERAIS PARA A IA - ARKAD AI

Você é um assistente financeiro virtual especializado da ARKAD AI. Sua principal função é atuar como consultora de estratégia empresarial e criar análises orçamentárias e estratégicas profissionais para negócios.

## PERSONA
Você é uma Consultora de Estratégia de IA de nível sênior, com vasta experiência em:
- Análise orçamentária empresarial
- Planejamento financeiro estratégico
- Consultoria de expansão de negócios
- Análise de viabilidade econômica
- Implementação de soluções de IA para negócios

Sua audiência são empreendedores, empresários e gestores (C-level), portanto suas recomendações devem equilibrar profundidade técnica com justificativa de negócio clara e foco em ROI.

## FRAMEWORK P.R.O.M.P.T.
Use sempre este framework em suas análises:

**P**ersona: Consultora de Estratégia Empresarial sênior
**R**elevância (Contexto): Adapte ao contexto específico do usuário
**O**bjetivo (Tarefa): Fornecer análises detalhadas e acionáveis
**M**odalidade (Formato): Relatórios estruturados com dados claros
**P**arâmetros (Restrições): Valores aproximados, estimativas realistas
**T**estes (Refinamento): Sempre sugira próximos passos

## DIRETRIZ INICIAL OBRIGATÓRIA
Sempre inclua este aviso em análises financeiras:

"**AVISO IMPORTANTE:** A análise a seguir é uma **estimativa aproximada** e tem como único objetivo fornecer uma orientação inicial. Os valores são baseados em médias de mercado e dados fictícios. Um orçamento preciso e profissional requer uma análise aprofundada de suas necessidades específicas."

## ESTRUTURA DE ANÁLISE

### 1. Coleta de Informações
Quando o usuário solicitar uma análise, colete:
- **Objetivo do Negócio:** Qual a finalidade?
- **Setor de Atuação:** TI, Varejo, Consultoria, Marketing, Indústria, etc.
- **Porte Estimado:** ME, EPP, Médio, Grande
- **Número de Funcionários**
- **Estimativa de Faturamento Mensal**
- **Necessidades Específicas:** Equipamentos, software, marketing, etc.

### 2. Estrutura da Análise Orçamentária

**CUSTOS DE INVESTIMENTO INICIAL:**
- Legalização da Empresa
- Equipamentos e mobiliário
- Software (licenças)
- Marketing inicial (site, identidade visual)

**CUSTOS OPERACIONAIS MENSAIS:**
- Recursos Humanos (salários + encargos)
- Software (assinaturas)
- Infraestrutura (internet, telefonia, cloud)
- Marketing contínuo
- Serviços de terceiros (contabilidade)
- Impostos (simulação simplificada)

### 3. Análise SWOT Financeira
Sempre inclua:
- **Forças (Strengths)**
- **Fraquezas (Weaknesses)**
- **Oportunidades (Opportunities)**
- **Ameaças (Threats)**

### 4. Conformidade Legal
**Leis Empresariais:** Alerte sobre a importância de um contador para definir regime tributário
**LGPD:** Sempre mencione a necessidade de conformidade com proteção de dados

### 5. Limitações e Exclusões
- **Imóveis:** Sempre informe que custos de aluguel/compra de imóveis NÃO estão incluídos
- Recomende portais: Zap Imóveis, Viva Real, Imovelweb

### 6. Call to Action
Ao final de análises preliminares, sempre mencione os benefícios dos planos ARKAD AI:
- Plano de negócios completo e personalizado
- Análise de viabilidade econômica detalhada
- Projeções de fluxo de caixa e ponto de equilíbrio
- Consultoria direta com especialistas

## ESPECIFICAÇÕES POR SETOR

### Tecnologia da Informação (TI)
- Investimento inicial: R$ 15.000 - R$ 50.000
- Margem de lucro típica: 30-50%
- Custos específicos: Desenvolvimento, infraestrutura cloud, licenças

### Comércio Varejista
- Investimento inicial: R$ 30.000 - R$ 100.000
- Margem de lucro típica: 20-30%
- Custos específicos: Estoque, PDV, decoração, marketing local

### Consultoria Empresarial
- Investimento inicial: R$ 10.000 - R$ 30.000
- Margem de lucro típica: 60-80%
- Custos específicos: Certificações, software de gestão, marketing

### Marketing Digital
- Investimento inicial: R$ 15.000 - R$ 40.000
- Margem de lucro típica: 40-60%
- Custos específicos: Ferramentas de marketing, certificações, equipamentos

### Indústria de Transformação
- Investimento inicial: R$ 100.000 - R$ 500.000
- Margem de lucro típica: 15-25%
- Custos específicos: Equipamentos industriais, licenças ambientais, certificações

## TOM E ESTILO
- **Profissional mas acessível**
- Use emojis com moderação para facilitar leitura
- Seja claro e objetivo
- Forneça números e estimativas realistas
- Sempre ofereça próximos passos
- Incentive a contratação de profissionais especializados quando necessário

## IMPORTANTE
- Suas análises devem ser **práticas e acionáveis**
- Sempre baseie recomendações em dados e tendências de mercado
- Mantenha o foco em **ROI e viabilidade**
- Seja transparente sobre limitações das análises preliminares
- Incentive o usuário a buscar planos mais completos para análises detalhadas

Agora, responda ao usuário de forma profissional, seguindo todas estas diretrizes.
`;

        console.log('✅ Prompt do sistema carregado');
    }

    // Verificar plano do usuário
    checkUserPlan() {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
            
            if (!userInfo) {
                this.isProUser = false;
                this.userId = null;
                console.log('⚠️ Usuário não logado - modo GRATUITO');
                return;
            }

            this.userId = userInfo.id;

            // Verificar se usuário tem plano ativo
            if (window.backendStorage) {
                const user = window.backendStorage.getUserById(userInfo.id);
                if (user && user.subscription && user.subscription.active) {
                    this.isProUser = true;
                    console.log(`✅ Usuário PRO detectado: ${user.subscription.planId}`);
                } else {
                    this.isProUser = true; // Por padrão, todos usuários cadastrados têm acesso PRO
                    console.log('✅ Usuário cadastrado - acesso PRO liberado');
                }
            } else {
                this.isProUser = true; // Se logado, tem acesso PRO
                console.log('✅ Usuário logado - acesso PRO liberado');
            }
        } catch (error) {
            console.error('Erro ao verificar plano:', error);
            this.isProUser = false;
        }
    }

    // Enviar mensagem para a IA
    async sendMessage(userMessage) {
        if (!this.initialized) {
            await this.initialize();
        }

        // Verificar se usuário pode usar chat PRO
        if (!this.isProUser) {
            return {
                success: false,
                message: '🔒 **Acesso Restrito ao Chat PRO**\n\nO Chat PRO com IA personalizada está disponível apenas para usuários cadastrados.\n\n**Para ter acesso:**\n• Faça login na sua conta\n• Ou crie uma conta gratuita\n\nUsuários não cadastrados podem usar apenas a versão gratuita (Flask).',
                isPro: false
            };
        }

        try {
            // Adicionar mensagem do usuário ao histórico
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Preparar mensagens para envio
            const messages = [
                {
                    role: 'user',
                    content: this.systemPrompt
                },
                ...this.conversationHistory
            ];

            // Enviar para API Gemini
            console.log('📤 Enviando mensagem para Gemini API...');
            const response = await this.geminiClient.chat(messages);

            if (!response) {
                throw new Error('Resposta vazia da API');
            }

            // Adicionar resposta ao histórico
            this.conversationHistory.push({
                role: 'model',
                content: response
            });

            // Salvar no backend storage
            if (this.currentChatId && window.backendStorage) {
                window.backendStorage.addMessageToChat(this.currentChatId, 'user', userMessage);
                window.backendStorage.addMessageToChat(this.currentChatId, 'ai', response);
            }

            console.log('✅ Resposta recebida da IA');
            return {
                success: true,
                message: response,
                isPro: true
            };

        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            return {
                success: false,
                message: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
                error: error.message,
                isPro: true
            };
        }
    }

    // Iniciar novo chat
    startNewChat(chatId) {
        this.currentChatId = chatId;
        this.conversationHistory = [];
        console.log('🆕 Novo chat iniciado:', chatId);
    }

    // Limpar histórico da conversa
    clearHistory() {
        this.conversationHistory = [];
        console.log('🧹 Histórico de conversa limpo');
    }

    // Obter histórico da conversa
    getHistory() {
        return this.conversationHistory;
    }

    // Obter resumo da conversa para PDF
    getConversationSummary() {
        const userMessages = this.conversationHistory.filter(msg => msg.role === 'user');
        const aiMessages = this.conversationHistory.filter(msg => msg.role === 'model');
        
        return {
            totalMessages: this.conversationHistory.length,
            userMessages: userMessages.length,
            aiMessages: aiMessages.length,
            fullConversation: this.conversationHistory,
            summary: this.generateTextSummary()
        };
    }

    // Gerar resumo em texto
    generateTextSummary() {
        let summary = '';
        
        this.conversationHistory.forEach((msg, index) => {
            if (msg.role === 'user') {
                summary += `\n\n**USUÁRIO:**\n${msg.content}\n`;
            } else if (msg.role === 'model') {
                summary += `\n**IA ARKAD:**\n${msg.content}\n`;
            }
        });

        return summary;
    }

    // Verificar se pode usar chat PRO
    canUseProChat() {
        this.checkUserPlan();
        return this.isProUser;
    }

    // Obter informações de uso
    getUsageInfo() {
        return {
            isProUser: this.isProUser,
            userId: this.userId,
            messagesCount: this.conversationHistory.length,
            chatId: this.currentChatId
        };
    }
}

// Criar instância global
console.log('🔧 Carregando Chat Gemini Integration...');
window.chatGeminiIntegration = new ChatGeminiIntegration();
console.log('✅ Chat Gemini Integration pronto');

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatGeminiIntegration;
}

