// Sistema de Respostas Inteligentes para Chat IA - ARKAD AI
// Baseado no prompt de análise orçamentária empresarial

class ChatAIResponses {
    constructor() {
        this.responses = this.initializeResponses();
        this.currentContext = null;
        this.userData = {};
    }

    // Inicializar todas as respostas possíveis
    initializeResponses() {
        return {
            // Saudação inicial
            greeting: {
                message: "Olá! Sou a IA da ARKAD, especializada em análise orçamentária empresarial. Como posso ajudar você hoje?",
                options: [
                    "Quero um orçamento para meu negócio",
                    "Preciso de análise financeira",
                    "Como funciona o sistema de planos?",
                    "Outro assunto"
                ]
            },

            // Aviso importante obrigatório
            disclaimer: `**AVISO IMPORTANTE:** A análise a seguir é uma **estimativa aproximada** e tem como único objetivo fornecer uma orientação inicial. Os valores são baseados em médias de mercado e dados fictícios. Um orçamento preciso e profissional requer uma análise aprofundada de suas necessidades específicas. Para obter um plano financeiro detalhado e consultoria especializada, considere a assinatura de nossos planos.`,

            // Coleta de informações
            informationCollection: {
                businessPurpose: "Qual é o objetivo do seu negócio? (Ex: Abrir uma microempresa, montar um escritório, lançar um novo serviço)",
                businessSector: "Em qual setor você atua? Aqui estão alguns exemplos:\n• Tecnologia da Informação (TI)\n• Comércio Varejista\n• Consultoria Empresarial\n• Serviços de Marketing Digital\n• Indústria de Transformação",
                companySize: "Qual o porte da empresa? (Microempresa - ME, Empresa de Pequeno Porte - EPP)",
                employees: "Quantos funcionários você terá? (Incluindo os sócios que terão pró-labore)",
                monthlyRevenue: "Qual sua estimativa de faturamento mensal? (Valor fictício para simular impostos)",
                specificNeeds: "Quais itens devem ser incluídos no orçamento? (Ex: Equipamentos, legalização, marketing inicial, softwares, etc.)"
            },

            // Análise orçamentária
            budgetAnalysis: {
                initialInvestment: {
                    title: "**CUSTOS DE INVESTIMENTO INICIAL (Pagamento Único):**",
                    items: [
                        "Legalização da Empresa: R$ 1.500 - R$ 3.000",
                        "Equipamentos (computadores, mobiliário): R$ 5.000 - R$ 15.000",
                        "Software (licenças perpétuas): R$ 2.000 - R$ 5.000",
                        "Marketing inicial (site, identidade visual): R$ 3.000 - R$ 8.000"
                    ]
                },
                monthlyCosts: {
                    title: "**CUSTOS OPERACIONAIS MENSАIS (Recorrentes):**",
                    items: [
                        "Recursos Humanos: R$ 3.000 - R$ 8.000 por funcionário",
                        "Software (assinaturas): R$ 200 - R$ 500 por mês",
                        "Infraestrutura (internet, telefonia): R$ 300 - R$ 800 por mês",
                        "Marketing contínuo: R$ 500 - R$ 2.000 por mês",
                        "Serviços de terceiros (contabilidade): R$ 500 - R$ 1.500 por mês",
                        "Impostos (Simples Nacional): 4% - 15% do faturamento"
                    ]
                }
            },

            // Análise SWOT
            swotAnalysis: {
                strengths: [
                    "Estrutura de custo mensal enxuta, permitindo maior flexibilidade de caixa",
                    "Possibilidade de deduzir despesas e otimizar a carga tributária",
                    "Investimento inicial moderado comparado ao potencial de retorno"
                ],
                weaknesses: [
                    "Alto investimento inicial em equipamentos pode exigir capital de terceiros",
                    "Dependência de fornecedores para manutenção dos equipamentos",
                    "Necessidade de capital de giro para cobrir custos operacionais"
                ],
                opportunities: [
                    "Possibilidade de deduzir despesas e otimizar a carga tributária com apoio de contador",
                    "Crescimento do mercado digital oferece oportunidades de expansão",
                    "Tecnologia permite redução de custos operacionais"
                ],
                threats: [
                    "Variações na inflação podem impactar custos operacionais",
                    "Mudanças na legislação tributária podem afetar a carga fiscal",
                    "Concorrência pode pressionar margens de lucro"
                ]
            },

            // Conformidade legal
            legalCompliance: {
                businessLaws: "Os custos de legalização e impostos são estimativas. É **fundamental** a orientação de um **contador** para definir o regime tributário ideal (Simples Nacional, Lucro Presumido, etc.) e garantir a conformidade com todas as obrigações fiscais e trabalhistas.",
                lgpd: "Lembre-se de que, ao lidar com dados de clientes ou funcionários, sua empresa precisa estar em conformidade com a LGPD. Recomenda-se incluir no orçamento custos para garantir a segurança de dados, como softwares de proteção, consultoria especializada e treinamento da equipe. O não cumprimento pode resultar em multas significativas."
            },

            // Limitações
            limitations: {
                realEstate: "**Importante:** Este orçamento **não inclui** custos relacionados ao aluguel ou compra de um imóvel comercial. A escolha do local tem um impacto significativo no custo total e deve ser analisada separadamente.",
                realEstateSites: "Para pesquisar salas de escritório ou pontos comerciais, recomendamos consultar portais imobiliários confiáveis, como: Zap Imóveis, Viva Real, Imovelweb"
            },

            // Call to action
            callToAction: {
                message: "Gostou desta análise preliminar? Com a assinatura de nossos planos, você terá acesso a:",
                benefits: [
                    "Um plano de negócios e financeiro completo e personalizado",
                    "Análise de viabilidade econômica detalhada",
                    "Projeções de fluxo de caixa e ponto de equilíbrio",
                    "Consultoria direta com nossos especialistas"
                ],
                cta: "**Clique aqui para conhecer nossos planos e dar o próximo passo com segurança!**"
            },

            // Respostas para diferentes tipos de pergunta
            specificResponses: {
                budget: "Vou criar uma análise orçamentária preliminar para você. Primeiro, preciso de algumas informações:",
                financialAnalysis: "Posso ajudar com análise financeira. Vou precisar de alguns dados sobre seu negócio:",
                plans: "Nossos planos oferecem consultoria especializada e análises detalhadas. Gostaria de saber mais sobre:",
                other: "Como posso ajudar você especificamente? Posso auxiliar com análise orçamentária, planejamento financeiro ou informações sobre nossos serviços."
            }
        };
    }

    // Processar mensagem do usuário e retornar resposta apropriada
    processMessage(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Detectar tipo de solicitação
        if (this.isBudgetRequest(message)) {
            return this.handleBudgetRequest();
        } else if (this.isFinancialAnalysisRequest(message)) {
            return this.handleFinancialAnalysisRequest();
        } else if (this.isPlansRequest(message)) {
            return this.handlePlansRequest();
        } else if (this.isGreeting(message)) {
            return this.handleGreeting();
        } else {
            return this.handleGeneralRequest(message);
        }
    }

    // Verificar se é solicitação de orçamento
    isBudgetRequest(message) {
        const budgetKeywords = ['orçamento', 'orçamento', 'custo', 'gasto', 'investimento', 'montar', 'abrir', 'negócio'];
        return budgetKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é solicitação de análise financeira
    isFinancialAnalysisRequest(message) {
        const financialKeywords = ['análise', 'financeiro', 'viabilidade', 'rentabilidade', 'lucro', 'receita'];
        return financialKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é pergunta sobre planos
    isPlansRequest(message) {
        const plansKeywords = ['plano', 'assinatura', 'serviço', 'consultoria', 'especialista'];
        return plansKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é saudação
    isGreeting(message) {
        const greetingKeywords = ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'];
        return greetingKeywords.some(keyword => message.includes(keyword));
    }

    // Lidar com solicitação de orçamento
    handleBudgetRequest() {
        this.currentContext = 'budget';
        return {
            message: `${this.responses.disclaimer}\n\n${this.responses.specificResponses.budget}`,
            questions: [
                this.responses.informationCollection.businessPurpose,
                this.responses.informationCollection.businessSector,
                this.responses.informationCollection.companySize,
                this.responses.informationCollection.employees,
                this.responses.informationCollection.monthlyRevenue,
                this.responses.informationCollection.specificNeeds
            ],
            type: 'budget_collection',
            sectorOptions: [
                "Tecnologia da Informação (TI)",
                "Comércio Varejista", 
                "Consultoria Empresarial",
                "Serviços de Marketing Digital",
                "Indústria de Transformação",
                "Outro setor"
            ]
        };
    }

    // Lidar com solicitação de análise financeira
    handleFinancialAnalysisRequest() {
        this.currentContext = 'financial_analysis';
        return {
            message: `${this.responses.disclaimer}\n\n${this.responses.specificResponses.financialAnalysis}`,
            questions: [
                "Qual o setor de atuação da empresa?",
                "Qual o faturamento mensal estimado?",
                "Quantos funcionários a empresa possui?",
                "Quais são os principais custos operacionais?"
            ],
            type: 'financial_collection'
        };
    }

    // Lidar com pergunta sobre planos
    handlePlansRequest() {
        return {
            message: `${this.responses.specificResponses.plans}`,
            options: [
                "Plano Básico - Análise orçamentária simples",
                "Plano Intermediário - Consultoria financeira",
                "Plano Premium - Consultoria completa + acompanhamento",
                "Falar com especialista"
            ],
            type: 'plans_info'
        };
    }

    // Lidar com saudação
    handleGreeting() {
        return {
            message: this.responses.greeting.message,
            options: this.responses.greeting.options,
            type: 'greeting'
        };
    }

    // Lidar com solicitação geral
    handleGeneralRequest(message) {
        return {
            message: this.responses.specificResponses.other,
            options: [
                "Análise orçamentária",
                "Consultoria financeira",
                "Informações sobre planos",
                "Outro assunto"
            ],
            type: 'general'
        };
    }

    // Gerar análise orçamentária completa
    generateBudgetAnalysis(userData) {
        const analysis = `
${this.responses.disclaimer}

## 📊 ANÁLISE ORÇAMENTÁRIA ESTIMADA

### 💰 CUSTOS DE INVESTIMENTO INICIAL
${this.responses.budgetAnalysis.initialInvestment.items.map(item => `• ${item}`).join('\n')}

### 📅 CUSTOS OPERACIONAIS MENSАIS
${this.responses.budgetAnalysis.monthlyCosts.items.map(item => `• ${item}`).join('\n')}

### 🔍 ANÁLISE SWOT FINANCEIRA

**Forças:**
${this.responses.swotAnalysis.strengths.map(item => `• ${item}`).join('\n')}

**Fraquezas:**
${this.responses.swotAnalysis.weaknesses.map(item => `• ${item}`).join('\n')}

**Oportunidades:**
${this.responses.swotAnalysis.opportunities.map(item => `• ${item}`).join('\n')}

**Ameaças:**
${this.responses.swotAnalysis.threats.map(item => `• ${item}`).join('\n')}

### ⚖️ CONFORMIDADE LEGAL
${this.responses.legalCompliance.businessLaws}

${this.responses.legalCompliance.lgpd}

### ⚠️ LIMITAÇÕES
${this.responses.limitations.realEstate}

${this.responses.limitations.realEstateSites}

### 🚀 PRÓXIMOS PASSOS
${this.responses.callToAction.message}
${this.responses.callToAction.benefits.map(benefit => `• ${benefit}`).join('\n')}

${this.responses.callToAction.cta}
        `;

        return analysis;
    }

    // Gerar resposta baseada no contexto
    generateContextualResponse(context, userData) {
        switch (context) {
            case 'budget':
                return this.generateBudgetAnalysis(userData);
            case 'financial_analysis':
                return this.generateFinancialAnalysis(userData);
            case 'plans':
                return this.generatePlansInfo();
            default:
                return this.responses.specificResponses.other;
        }
    }

    // Gerar informações sobre planos
    generatePlansInfo() {
        return `
## 📋 NOSSOS PLANOS

### 🥉 Plano Básico
• Análise orçamentária preliminar
• Estimativa de custos iniciais
• Projeção de custos mensais
• Relatório em PDF

### 🥈 Plano Intermediário
• Tudo do Plano Básico +
• Análise de viabilidade econômica
• Projeções de fluxo de caixa
• Consultoria por 30 dias

### 🥇 Plano Premium
• Tudo dos planos anteriores +
• Plano de negócios completo
• Acompanhamento mensal
• Consultoria ilimitada
• Suporte prioritário

${this.responses.callToAction.cta}
        `;
    }

    // Gerar análise financeira
    generateFinancialAnalysis(userData) {
        return `
${this.responses.disclaimer}

## 📈 ANÁLISE FINANCEIRA PRELIMINAR

### 💡 INDICADORES FINANCEIROS ESTIMADOS
• **Ponto de Equilíbrio:** R$ 15.000 - R$ 25.000/mês
• **Margem de Lucro:** 15% - 25%
• **ROI Estimado:** 12% - 18% ao ano
• **Payback:** 18 - 24 meses

### 📊 PROJEÇÕES (Baseadas em dados fictícios)
• **Ano 1:** Faturamento R$ 180.000 - R$ 300.000
• **Ano 2:** Faturamento R$ 250.000 - R$ 450.000
• **Ano 3:** Faturamento R$ 350.000 - R$ 600.000

### ⚠️ RISCOS IDENTIFICADOS
• Sazonalidade do mercado
• Concorrência acirrada
• Mudanças regulatórias
• Dependência de fornecedores

${this.responses.callToAction.message}
${this.responses.callToAction.benefits.map(benefit => `• ${benefit}`).join('\n')}

${this.responses.callToAction.cta}
        `;
    }
}

// Criar instância global
window.chatAI = new ChatAIResponses();

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatAIResponses;
}
