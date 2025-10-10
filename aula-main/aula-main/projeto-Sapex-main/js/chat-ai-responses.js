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
                message: "Olá! 👋 Sou a IA da ARKAD, sua especialista em análise orçamentária empresarial. Estou aqui para transformar suas ideias de negócio em planos financeiros sólidos e viáveis. Como posso ajudar você a dar o próximo passo rumo ao sucesso?",
                options: [
                    "💰 Quero um orçamento completo para meu negócio",
                    "📊 Preciso de análise financeira detalhada",
                    "🎯 Como funciona o sistema de planos?",
                    "💡 Tenho dúvidas sobre viabilidade",
                    "🚀 Quero começar um novo projeto",
                    "❓ Outro assunto"
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
                budget: "Perfeito! 🎯 Vou criar uma análise orçamentária completa e personalizada para seu negócio. Esta análise vai incluir custos iniciais, operacionais mensais, projeções financeiras e até mesmo uma análise SWOT. Vamos começar coletando algumas informações essenciais:",
                financialAnalysis: "Excelente escolha! 📈 Vou realizar uma análise financeira detalhada que incluirá indicadores de viabilidade, projeções de crescimento, análise de rentabilidade e identificação de riscos. Para isso, preciso de alguns dados específicos sobre seu negócio:",
                plans: "Ótima pergunta! 🎯 Nossos planos foram desenvolvidos para atender diferentes necessidades e orçamentos. Cada plano oferece consultoria especializada e ferramentas exclusivas. Gostaria de saber mais sobre:",
                viability: "Entendo suas preocupações! 💡 A viabilidade de um negócio depende de vários fatores: mercado, concorrência, recursos disponíveis e planejamento financeiro. Vou te ajudar a avaliar se sua ideia tem potencial de sucesso. Vamos analisar:",
                newProject: "Que emocionante! 🚀 Começar um novo projeto é sempre uma aventura incrível. Vou te ajudar a estruturar tudo desde o início: desde a concepção da ideia até o plano financeiro completo. Vamos começar entendendo melhor seu projeto:",
                other: "Claro! Estou aqui para ajudar com qualquer dúvida relacionada a planejamento empresarial. Posso auxiliar com análise orçamentária, planejamento financeiro, viabilidade de negócios, ou informações sobre nossos serviços especializados. O que você gostaria de saber?"
            },

            // Respostas específicas por setor
            sectorResponses: {
                "Tecnologia da Informação (TI)": {
                    message: "Excelente! 💻 O setor de TI é um dos mais promissores atualmente. Empresas de tecnologia têm grande potencial de crescimento e margens atrativas. Vou personalizar sua análise considerando as particularidades deste setor:",
                    specificCosts: [
                        "Desenvolvimento de software: R$ 8.000 - R$ 25.000",
                        "Infraestrutura de servidores: R$ 2.000 - R$ 8.000",
                        "Licenças de software: R$ 1.500 - R$ 5.000",
                        "Certificações e treinamentos: R$ 3.000 - R$ 10.000"
                    ],
                    opportunities: [
                        "Mercado em expansão com alta demanda",
                        "Possibilidade de escalabilidade global",
                        "Margens de lucro atrativas (30-50%)",
                        "Diversas fontes de receita (desenvolvimento, suporte, consultoria)"
                    ]
                },
                "Comércio Varejista": {
                    message: "Perfeito! 🛒 O comércio varejista é a base da economia. Vou criar uma análise considerando estoque, localização, sazonalidade e estratégias de vendas específicas para este setor:",
                    specificCosts: [
                        "Estoque inicial: R$ 10.000 - R$ 50.000",
                        "Sistema de PDV: R$ 2.000 - R$ 8.000",
                        "Decoração e vitrines: R$ 5.000 - R$ 15.000",
                        "Marketing local: R$ 2.000 - R$ 8.000"
                    ],
                    opportunities: [
                        "Contato direto com o cliente final",
                        "Possibilidade de vendas online e física",
                        "Diversificação de produtos",
                        "Programas de fidelidade e relacionamento"
                    ]
                },
                "Consultoria Empresarial": {
                    message: "Fantástico! 💼 A consultoria empresarial é um setor com baixo investimento inicial e alto potencial de retorno. Vou focar na análise de estrutura de custos, precificação de serviços e estratégias de captação de clientes:",
                    specificCosts: [
                        "Certificações profissionais: R$ 3.000 - R$ 12.000",
                        "Software de gestão: R$ 1.500 - R$ 4.000",
                        "Marketing e networking: R$ 2.000 - R$ 6.000",
                        "Material de trabalho: R$ 1.000 - R$ 3.000"
                    ],
                    opportunities: [
                        "Baixo investimento inicial",
                        "Alta margem de lucro (60-80%)",
                        "Escalabilidade através de equipe",
                        "Diversas especializações possíveis"
                    ]
                },
                "Serviços de Marketing Digital": {
                    message: "Ótima escolha! 📱 O marketing digital está em constante crescimento. Vou analisar custos de ferramentas, certificações, equipe e estratégias de precificação para este setor dinâmico:",
                    specificCosts: [
                        "Ferramentas de marketing: R$ 2.000 - R$ 8.000/mês",
                        "Certificações (Google, Facebook): R$ 1.000 - R$ 3.000",
                        "Equipamentos de produção: R$ 5.000 - R$ 15.000",
                        "Software de design: R$ 1.200 - R$ 3.600/ano"
                    ],
                    opportunities: [
                        "Mercado em expansão constante",
                        "Trabalho remoto possível",
                        "Diversos nichos de atuação",
                        "Alto potencial de crescimento"
                    ]
                },
                "Indústria de Transformação": {
                    message: "Impressionante! 🏭 A indústria de transformação requer um planejamento mais robusto devido aos investimentos em equipamentos e infraestrutura. Vou criar uma análise detalhada considerando todos os aspectos industriais:",
                    specificCosts: [
                        "Equipamentos industriais: R$ 50.000 - R$ 500.000",
                        "Infraestrutura e instalações: R$ 20.000 - R$ 100.000",
                        "Licenças ambientais: R$ 5.000 - R$ 25.000",
                        "Certificações de qualidade: R$ 10.000 - R$ 50.000"
                    ],
                    opportunities: [
                        "Alto valor agregado dos produtos",
                        "Possibilidade de exportação",
                        "Diversificação de produtos",
                        "Parcerias estratégicas"
                    ]
                }
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
        } else if (this.isViabilityRequest(message)) {
            return this.handleViabilityRequest();
        } else if (this.isNewProjectRequest(message)) {
            return this.handleNewProjectRequest();
        } else if (this.isGreeting(message)) {
            return this.handleGreeting();
        } else {
            return this.handleGeneralRequest(message);
        }
    }

    // Verificar se é solicitação de orçamento
    isBudgetRequest(message) {
        const budgetKeywords = ['orçamento', 'orçamento', 'custo', 'gasto', 'investimento', 'montar', 'abrir', 'negócio', 'completo'];
        return budgetKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é solicitação de análise financeira
    isFinancialAnalysisRequest(message) {
        const financialKeywords = ['análise', 'financeiro', 'detalhada', 'rentabilidade', 'lucro', 'receita'];
        return financialKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é pergunta sobre planos
    isPlansRequest(message) {
        const plansKeywords = ['plano', 'planos', 'assinatura', 'serviço', 'consultoria', 'especialista', 'funciona'];
        return plansKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é pergunta sobre viabilidade
    isViabilityRequest(message) {
        const viabilityKeywords = ['viabilidade', 'dúvidas', 'funciona', 'vale a pena', 'possível', 'realizável'];
        return viabilityKeywords.some(keyword => message.includes(keyword));
    }

    // Verificar se é sobre novo projeto
    isNewProjectRequest(message) {
        const projectKeywords = ['novo projeto', 'começar', 'iniciar', 'projeto', 'ideia'];
        return projectKeywords.some(keyword => message.includes(keyword));
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
                "🥉 Plano Básico - Análise orçamentária simples",
                "🥈 Plano Intermediário - Consultoria financeira",
                "🥇 Plano Premium - Consultoria completa + acompanhamento",
                "💬 Falar com especialista",
                "💰 Ver preços e benefícios",
                "❓ Comparar planos"
            ],
            type: 'plans_info'
        };
    }

    // Lidar com pergunta sobre viabilidade
    handleViabilityRequest() {
        this.currentContext = 'viability';
        return {
            message: `${this.responses.disclaimer}\n\n${this.responses.specificResponses.viability}`,
            questions: [
                "Qual é a sua ideia de negócio? Descreva brevemente o que você pretende fazer.",
                "Qual o público-alvo que você pretende atender?",
                "Você já tem experiência na área ou será um novo mercado para você?",
                "Qual o investimento inicial que você tem disponível?",
                "Existe concorrência na sua região? Conhece os principais concorrentes?"
            ],
            type: 'viability_collection'
        };
    }

    // Lidar com solicitação de novo projeto
    handleNewProjectRequest() {
        this.currentContext = 'new_project';
        return {
            message: `${this.responses.specificResponses.newProject}`,
            questions: [
                "Conte-me sobre sua ideia de projeto. O que você tem em mente?",
                "Qual é o seu objetivo principal com este projeto?",
                "Você já tem algum conhecimento ou experiência na área?",
                "Qual o prazo que você tem em mente para colocar o projeto em prática?",
                "Você tem algum orçamento inicial definido ou precisa de orientação sobre isso?"
            ],
            type: 'project_collection'
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
                "💰 Análise orçamentária completa",
                "📊 Consultoria financeira detalhada",
                "🎯 Informações sobre planos",
                "💡 Avaliar viabilidade do negócio",
                "🚀 Começar novo projeto",
                "❓ Outro assunto"
            ],
            type: 'general'
        };
    }

    // Gerar análise orçamentária completa
    generateBudgetAnalysis(userData) {
        // Detectar setor se disponível
        const sector = this.detectSectorFromData(userData);
        const sectorInfo = sector ? this.responses.sectorResponses[sector] : null;
        
        let analysis = `
${this.responses.disclaimer}

## 📊 ANÁLISE ORÇAMENTÁRIA ESTIMADA
`;

        // Adicionar informações específicas do setor se disponível
        if (sectorInfo) {
            analysis += `
### 🎯 ANÁLISE ESPECÍFICA DO SETOR: ${sector}
${sectorInfo.message}

**Custos Específicos do Setor:**
${sectorInfo.specificCosts.map(item => `• ${item}`).join('\n')}

**Oportunidades do Setor:**
${sectorInfo.opportunities.map(item => `• ${item}`).join('\n')}

---
`;
        }

        analysis += `
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

    // Detectar setor a partir dos dados do usuário
    detectSectorFromData(userData) {
        for (const [key, value] of Object.entries(userData)) {
            if (typeof value === 'string') {
                for (const sector of Object.keys(this.responses.sectorResponses)) {
                    if (value.toLowerCase().includes(sector.toLowerCase()) || 
                        value.toLowerCase().includes(sector.split(' ')[0].toLowerCase())) {
                        return sector;
                    }
                }
            }
        }
        return null;
    }

    // Gerar resposta baseada no contexto
    generateContextualResponse(context, userData) {
        switch (context) {
            case 'budget':
            case 'budget_collection':
                return this.generateBudgetAnalysis(userData);
            case 'financial_analysis':
            case 'financial_collection':
                return this.generateFinancialAnalysis(userData);
            case 'viability':
            case 'viability_collection':
                return this.generateViabilityAnalysis(userData);
            case 'new_project':
            case 'project_collection':
                return this.generateProjectAnalysis(userData);
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

    // Gerar análise de viabilidade
    generateViabilityAnalysis(userData) {
        return `
${this.responses.disclaimer}

## 💡 ANÁLISE DE VIABILIDADE DO NEGÓCIO

### ✅ FATORES POSITIVOS IDENTIFICADOS
• **Mercado em crescimento:** Oportunidades de expansão
• **Baixa barreira de entrada:** Investimento inicial moderado
• **Demanda constante:** Necessidade real do mercado
• **Escalabilidade:** Potencial de crescimento

### ⚠️ PONTOS DE ATENÇÃO
• **Concorrência:** Necessidade de diferenciação
• **Capital inicial:** Requer planejamento financeiro cuidadoso
• **Conhecimento técnico:** Importância de capacitação
• **Marketing:** Estratégia de divulgação essencial

### 🎯 RECOMENDAÇÕES ESTRATÉGICAS
• **Fase 1:** Validação da ideia com público-alvo
• **Fase 2:** Desenvolvimento de MVP (produto mínimo viável)
• **Fase 3:** Teste de mercado com investimento controlado
• **Fase 4:** Expansão baseada em resultados

### 📊 INDICADORES DE SUCESSO
• **Validação de mercado:** 70%+ de aprovação em testes
• **Ponto de equilíbrio:** Alcançado em 12-18 meses
• **Retenção de clientes:** 80%+ de satisfação
• **Crescimento:** 20%+ ao mês nos primeiros 6 meses

### 🚀 PRÓXIMOS PASSOS RECOMENDADOS
1. **Pesquisa de mercado detalhada**
2. **Desenvolvimento de plano de negócios**
3. **Análise financeira aprofundada**
4. **Estruturação legal e tributária**

${this.responses.callToAction.message}
${this.responses.callToAction.benefits.map(benefit => `• ${benefit}`).join('\n')}

${this.responses.callToAction.cta}
        `;
    }

    // Gerar análise de projeto
    generateProjectAnalysis(userData) {
        return `
${this.responses.disclaimer}

## 🚀 ANÁLISE DE PROJETO EMPRESARIAL

### 🎯 ESTRUTURAÇÃO DO PROJETO
• **Definição clara de objetivos:** Metas mensuráveis e prazos
• **Análise de mercado:** Oportunidades e ameaças identificadas
• **Planejamento financeiro:** Projeções realistas de investimento
• **Estratégia de execução:** Cronograma detalhado de implementação

### 💼 COMPONENTES ESSENCIAIS
• **Plano de negócios:** Documento estratégico completo
• **Análise de viabilidade:** Estudo de mercado e financeiro
• **Estrutura legal:** Definição do tipo societário
• **Plano de marketing:** Estratégias de divulgação e vendas

### 📋 CRONOGRAMA SUGERIDO
• **Mês 1-2:** Pesquisa e planejamento
• **Mês 3-4:** Estruturação legal e financeira
• **Mês 5-6:** Desenvolvimento do produto/serviço
• **Mês 7-8:** Testes e ajustes
• **Mês 9-12:** Lançamento e consolidação

### 🎯 METAS DE CURTO PRAZO (6 meses)
• Validação da ideia no mercado
• Desenvolvimento do produto mínimo viável
• Captação dos primeiros clientes
• Estabelecimento de processos operacionais

### 🎯 METAS DE MÉDIO PRAZO (12 meses)
• Consolidação no mercado
• Expansão da base de clientes
• Otimização de processos
• Preparação para crescimento

### 💡 DICAS IMPORTANTES
• **Comece pequeno:** Valide antes de investir muito
• **Foque no cliente:** Entenda as necessidades reais
• **Seja flexível:** Ajuste conforme feedback do mercado
• **Documente tudo:** Mantenha registros organizados

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
