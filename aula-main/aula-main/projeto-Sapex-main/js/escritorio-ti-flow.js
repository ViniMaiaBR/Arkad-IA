// Fluxo Específico para Montagem de Escritório de TI - ARKAD AI
// Sistema de perguntas sequenciais com geração de PDF

class EscritorioTIFlow {
    constructor() {
        this.currentStep = 0;
        this.userData = {};
        this.officeData = {};
        this.isProcessing = false;
        this.steps = [
            'area_selection',
            'plan_selection', 
            'plan_type_selection',
            'processing',
            'result'
        ];
    }

    // Iniciar fluxo de montagem de escritório
    startOfficeFlow() {
        this.currentStep = 0;
        this.userData = {};
        this.officeData = {};
        this.isProcessing = false;
        
        return {
            message: "🏢 **MONTAGEM DE ESCRITÓRIO DE TECNOLOGIA DA INFORMAÇÃO**\n\nPerfeito! Vou te ajudar a montar um escritório completo na área de TI. Vamos começar com algumas perguntas para personalizar sua análise.\n\n**Você já tem um plano ou assinatura conosco?**",
            options: ["✅ Sim, já tenho", "❌ Não, ainda não tenho"],
            type: 'office_flow_start'
        };
    }

    // Processar resposta sobre plano/assinatura
    processPlanResponse(hasPlan) {
        this.userData.hasPlan = hasPlan;
        
        if (hasPlan) {
            return {
                message: "Ótimo! 🎯 Com sua assinatura, você terá acesso a análises mais detalhadas e personalizadas.\n\n**Qual tipo de plano você possui?**",
                options: [
                    "🥉 Plano Básico",
                    "🥈 Plano Intermediário", 
                    "🥇 Plano Premium"
                ],
                type: 'plan_type_selection'
            };
        } else {
            return {
                message: "Sem problemas! 😊 Vou criar uma análise preliminar para você. Depois, se quiser, posso te mostrar nossos planos para análises mais detalhadas.\n\n**Qual tipo de plano você gostaria de conhecer?**",
                options: [
                    "🥉 Plano Básico",
                    "🥈 Plano Intermediário",
                    "🥇 Plano Premium"
                ],
                type: 'plan_type_selection'
            };
        }
    }

    // Processar seleção do tipo de plano
    processPlanTypeSelection(planType) {
        this.userData.planType = planType;
        
        // Dados específicos para escritório de TI
        this.officeData = this.generateOfficeData(planType);
        
        return {
            message: `Perfeito! ${planType} selecionado. 🚀\n\nAgora vou processar todas as informações e criar um relatório completo para montagem do seu escritório de TI. Isso pode levar alguns segundos...\n\n⏳ **Processando análise...**`,
            type: 'processing',
            showButtons: false,
            startTimer: true
        };
    }

    // Iniciar timer de processamento
    startProcessingTimer(callback) {
        let timeLeft = 10;
        const timerElement = document.createElement('div');
        timerElement.className = 'processing-timer';
        timerElement.innerHTML = `
            <div style="
                text-align: center; 
                padding: 30px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px; 
                margin: 15px 0;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                color: white;
                position: relative;
                overflow: hidden;
            ">
                <!-- Efeito de partículas animadas -->
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"white\" opacity=\"0.3\"><animate attributeName=\"opacity\" values=\"0.3;0.8;0.3\" dur=\"2s\" repeatCount=\"indefinite\"/></circle><circle cx=\"80\" cy=\"30\" r=\"1.5\" fill=\"white\" opacity=\"0.4\"><animate attributeName=\"opacity\" values=\"0.4;0.9;0.4\" dur=\"1.5s\" repeatCount=\"indefinite\"/></circle><circle cx=\"40\" cy=\"70\" r=\"1\" fill=\"white\" opacity=\"0.5\"><animate attributeName=\"opacity\" values=\"0.5;1;0.5\" dur=\"2.5s\" repeatCount=\"indefinite\"/></circle><circle cx=\"90\" cy=\"80\" r=\"2.5\" fill=\"white\" opacity=\"0.2\"><animate attributeName=\"opacity\" values=\"0.2;0.7;0.2\" dur=\"1.8s\" repeatCount=\"indefinite\"/></circle></svg>') repeat;
                    animation: float 6s ease-in-out infinite;
                "></div>
                
                <!-- Ícone animado -->
                <div style="
                    font-size: 48px; 
                    margin-bottom: 15px;
                    animation: pulse 2s ease-in-out infinite;
                    position: relative;
                    z-index: 1;
                ">🤖</div>
                
                <!-- Texto principal -->
                <div style="
                    font-size: 20px; 
                    margin-bottom: 20px; 
                    font-weight: 600;
                    position: relative;
                    z-index: 1;
                ">Processando Análise Inteligente...</div>
                
                <!-- Contador circular -->
                <div style="
                    position: relative;
                    display: inline-block;
                    margin-bottom: 20px;
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: conic-gradient(from 0deg, #ff6b6b 0deg, #4ecdc4 360deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        animation: rotate 1s linear infinite;
                    ">
                        <div style="
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            background: rgba(255,255,255,0.2);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 24px;
                            font-weight: bold;
                            color: white;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        " id="timer-countdown">${timeLeft}</div>
                    </div>
                </div>
                
                <!-- Texto do contador -->
                <div style="
                    font-size: 16px; 
                    margin-bottom: 20px;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                ">segundos restantes</div>
                
                <!-- Barra de progresso moderna -->
                <div style="
                    width: 100%; 
                    background: rgba(255,255,255,0.2); 
                    border-radius: 25px; 
                    margin-top: 15px; 
                    overflow: hidden;
                    position: relative;
                    z-index: 1;
                ">
                    <div id="timer-progress" style="
                        width: 0%; 
                        height: 12px; 
                        background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
                        border-radius: 25px;
                        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                            animation: shimmer 2s infinite;
                        "></div>
                    </div>
                </div>
                
                <!-- Texto de status -->
                <div style="
                    font-size: 14px; 
                    margin-top: 15px; 
                    opacity: 0.8;
                    position: relative;
                    z-index: 1;
                ">Analisando dados e gerando relatório personalizado...</div>
            </div>
            
            <style>
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            </style>
        `;
        
        // Adicionar timer ao container de mensagens
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.appendChild(timerElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        const countdownElement = document.getElementById('timer-countdown');
        const progressElement = document.getElementById('timer-progress');
        
        const timer = setInterval(() => {
            timeLeft--;
            countdownElement.textContent = timeLeft;
            progressElement.style.width = ((10 - timeLeft) / 10) * 100 + '%';
            
            // Efeito de piscada no final
            if (timeLeft <= 3) {
                countdownElement.style.animation = 'pulse 0.5s ease-in-out infinite';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                // Efeito de fade out
                timerElement.style.transition = 'opacity 0.5s ease-out';
                timerElement.style.opacity = '0';
                setTimeout(() => {
                    timerElement.remove();
                    callback();
                }, 500);
            }
        }, 1000);
    }

    // Gerar dados do escritório baseado no plano
    generateOfficeData(planType) {
        const baseData = {
            // Equipamentos essenciais
            equipamentos: {
                computadores: {
                    basico: { qty: 2, price: 2500, desc: "Computadores básicos para desenvolvimento" },
                    intermediario: { qty: 4, price: 3500, desc: "Computadores com configuração intermediária" },
                    premium: { qty: 6, price: 5000, desc: "Workstations de alta performance" }
                },
                servidores: {
                    basico: { qty: 1, price: 8000, desc: "Servidor básico para desenvolvimento" },
                    intermediario: { qty: 2, price: 12000, desc: "Servidores com redundância" },
                    premium: { qty: 3, price: 18000, desc: "Infraestrutura completa de servidores" }
                },
                rede: {
                    basico: { qty: 1, price: 500, desc: "Switch básico 8 portas" },
                    intermediario: { qty: 2, price: 1200, desc: "Switches gerenciáveis" },
                    premium: { qty: 3, price: 2500, desc: "Infraestrutura de rede completa" }
                },
                mobiliario: {
                    basico: { qty: 2, price: 800, desc: "Mesas e cadeiras básicas" },
                    intermediario: { qty: 4, price: 1200, desc: "Mobiliário ergonômico" },
                    premium: { qty: 6, price: 1800, desc: "Mobiliário premium e ergonômico" }
                }
            },
            
            // Software e licenças
            software: {
                basico: [
                    { name: "Sistema Operacional", price: 300, qty: 2 },
                    { name: "Office Básico", price: 200, qty: 2 },
                    { name: "Antivírus", price: 150, qty: 2 }
                ],
                intermediario: [
                    { name: "Sistema Operacional", price: 300, qty: 4 },
                    { name: "Office Completo", price: 400, qty: 4 },
                    { name: "Antivírus Corporativo", price: 300, qty: 4 },
                    { name: "Ferramentas de Desenvolvimento", price: 500, qty: 4 },
                    { name: "Sistema de Backup", price: 200, qty: 1 }
                ],
                premium: [
                    { name: "Sistema Operacional", price: 300, qty: 6 },
                    { name: "Office Premium", price: 600, qty: 6 },
                    { name: "Antivírus Corporativo", price: 300, qty: 6 },
                    { name: "Ferramentas de Desenvolvimento", price: 500, qty: 6 },
                    { name: "Sistema de Backup Avançado", price: 400, qty: 1 },
                    { name: "Ferramentas de Monitoramento", price: 300, qty: 1 },
                    { name: "Licenças de Banco de Dados", price: 800, qty: 1 }
                ]
            },

            // Infraestrutura
            infraestrutura: {
                basico: [
                    { name: "Internet Fibra 100MB", price: 150, type: "mensal" },
                    { name: "Telefonia VoIP", price: 100, type: "mensal" },
                    { name: "UPS Básico", price: 800, type: "unico" }
                ],
                intermediario: [
                    { name: "Internet Fibra 300MB", price: 250, type: "mensal" },
                    { name: "Telefonia VoIP Avançada", price: 200, type: "mensal" },
                    { name: "UPS Intermediário", price: 1500, type: "unico" },
                    { name: "Sistema de CFTV", price: 2000, type: "unico" }
                ],
                premium: [
                    { name: "Internet Fibra 1GB", price: 400, type: "mensal" },
                    { name: "Telefonia VoIP Premium", price: 300, type: "mensal" },
                    { name: "UPS Premium", price: 3000, type: "unico" },
                    { name: "Sistema de CFTV Avançado", price: 4000, type: "unico" },
                    { name: "Sistema de Ar Condicionado", price: 5000, type: "unico" }
                ]
            },

            // Custos operacionais mensais
            custosOperacionais: {
                basico: [
                    { name: "Aluguel (estimativa)", price: 2000, type: "mensal" },
                    { name: "Energia Elétrica", price: 300, type: "mensal" },
                    { name: "Limpeza", price: 200, type: "mensal" },
                    { name: "Contabilidade", price: 500, type: "mensal" }
                ],
                intermediario: [
                    { name: "Aluguel (estimativa)", price: 3500, type: "mensal" },
                    { name: "Energia Elétrica", price: 500, type: "mensal" },
                    { name: "Limpeza", price: 400, type: "mensal" },
                    { name: "Contabilidade", price: 800, type: "mensal" },
                    { name: "Suporte Técnico", price: 600, type: "mensal" }
                ],
                premium: [
                    { name: "Aluguel (estimativa)", price: 5000, type: "mensal" },
                    { name: "Energia Elétrica", price: 800, type: "mensal" },
                    { name: "Limpeza", price: 600, type: "mensal" },
                    { name: "Contabilidade", price: 1200, type: "mensal" },
                    { name: "Suporte Técnico Premium", price: 1000, type: "mensal" },
                    { name: "Segurança", price: 500, type: "mensal" }
                ]
            }
        };

        return baseData;
    }

    // Processar análise completa
    processCompleteAnalysis() {
        const planType = this.userData.planType.toLowerCase();
        const officeData = this.officeData;
        
        // Calcular custos totais
        const totalInvestment = this.calculateTotalInvestment(planType, officeData);
        const monthlyCosts = this.calculateMonthlyCosts(planType, officeData);
        
        // Gerar orçamento básico simplificado
        const basicBudget = this.generateBasicBudget(planType, totalInvestment, monthlyCosts);
        
        return {
            message: basicBudget,
            type: 'complete_analysis',
            showButtons: true,
            data: {
                planType: this.userData.planType,
                totalInvestment: totalInvestment,
                monthlyCosts: monthlyCosts,
                officeData: officeData
            }
        };
    }

    // Gerar orçamento básico simplificado
    generateBasicBudget(planType, totalInvestment, monthlyCosts) {
        const planName = this.userData.planType;
        
        return `
## 🏢 ORÇAMENTO BÁSICO - ESCRITÓRIO DE TI
**Plano Selecionado:** ${planName}

---

### 💰 **RESUMO FINANCEIRO**

| **Item** | **Valor** |
|----------|-----------|
| **Investimento Inicial** | R$ ${totalInvestment.toLocaleString('pt-BR')} |
| **Custos Mensais** | R$ ${monthlyCosts.toLocaleString('pt-BR')} |
| **Custo Anual** | R$ ${(monthlyCosts * 12).toLocaleString('pt-BR')} |
| **Total Primeiro Ano** | R$ ${(totalInvestment + (monthlyCosts * 12)).toLocaleString('pt-BR')} |

---

### 🎯 **CARACTERÍSTICAS DO PLANO ${planName}**

${this.getPlanFeatures(planType)}

---

### ⚠️ **OBSERVAÇÕES IMPORTANTES**

• **Aluguel não incluído:** Os valores de aluguel são estimativas baseadas em médias de mercado
• **Impostos:** Considere impostos sobre equipamentos e serviços (ICMS, IPI, etc.)
• **Manutenção:** Inclua custos de manutenção preventiva dos equipamentos
• **Backup:** Implemente estratégia de backup e recuperação de dados
• **Segurança:** Considere investimento em segurança física e digital

---

**📄 Relatório gerado em:** ${new Date().toLocaleString('pt-BR')}
**🤖 Sistema:** ARKAD AI - Consultoria Empresarial
        `;
    }

    // Calcular investimento total
    calculateTotalInvestment(planType, officeData) {
        let total = 0;
        
        // Equipamentos
        Object.values(officeData.equipamentos).forEach(equipment => {
            const config = equipment[planType];
            total += config.qty * config.price;
        });
        
        // Software (custo único)
        officeData.software[planType].forEach(software => {
            total += software.qty * software.price;
        });
        
        // Infraestrutura (custo único)
        officeData.infraestrutura[planType].forEach(item => {
            if (item.type === 'unico') {
                total += item.price;
            }
        });
        
        return total;
    }

    // Calcular custos mensais
    calculateMonthlyCosts(planType, officeData) {
        let total = 0;
        
        // Infraestrutura mensal
        officeData.infraestrutura[planType].forEach(item => {
            if (item.type === 'mensal') {
                total += item.price;
            }
        });
        
        // Custos operacionais
        officeData.custosOperacionais[planType].forEach(cost => {
            total += cost.price;
        });
        
        return total;
    }

    // Gerar relatório completo
    generateOfficeReport(planType, totalInvestment, monthlyCosts) {
        const planName = this.userData.planType;
        const officeData = this.officeData;
        
        return `
## 🏢 RELATÓRIO DE MONTAGEM - ESCRITÓRIO DE TI
**Plano Selecionado:** ${planName}

---

### 💰 **INVESTIMENTO INICIAL TOTAL: R$ ${totalInvestment.toLocaleString('pt-BR')}**

#### 🖥️ **EQUIPAMENTOS DE TI**
${this.formatEquipmentList(planType, officeData.equipamentos)}

#### 💿 **SOFTWARE E LICENÇAS**
${this.formatSoftwareList(planType, officeData.software)}

#### 🏗️ **INFRAESTRUTURA FÍSICA**
${this.formatInfrastructureList(planType, officeData.infraestrutura)}

---

### 📅 **CUSTOS OPERACIONAIS MENSАIS: R$ ${monthlyCosts.toLocaleString('pt-BR')}**

#### 💼 **CUSTOS FIXOS MENSАIS**
${this.formatMonthlyCostsList(planType, officeData.custosOperacionais)}

#### 🌐 **SERVIÇOS MENSАIS**
${this.formatMonthlyServicesList(planType, officeData.infraestrutura)}

---

### 📊 **RESUMO FINANCEIRO**

| **Item** | **Valor** |
|----------|-----------|
| **Investimento Inicial** | R$ ${totalInvestment.toLocaleString('pt-BR')} |
| **Custos Mensais** | R$ ${monthlyCosts.toLocaleString('pt-BR')} |
| **Custo Anual** | R$ ${(monthlyCosts * 12).toLocaleString('pt-BR')} |
| **Total Primeiro Ano** | R$ ${(totalInvestment + (monthlyCosts * 12)).toLocaleString('pt-BR')} |

---

### 🎯 **CARACTERÍSTICAS DO PLANO ${planName}**

${this.getPlanFeatures(planType)}

---

### ⚠️ **OBSERVAÇÕES IMPORTANTES**

• **Aluguel não incluído:** Os valores de aluguel são estimativas baseadas em médias de mercado
• **Impostos:** Considere impostos sobre equipamentos e serviços (ICMS, IPI, etc.)
• **Manutenção:** Inclua custos de manutenção preventiva dos equipamentos
• **Backup:** Implemente estratégia de backup e recuperação de dados
• **Segurança:** Considere investimento em segurança física e digital

---

### 🚀 **PRÓXIMOS PASSOS RECOMENDADOS**

1. **Validação do orçamento** com fornecedores locais
2. **Definição do local** e negociação do aluguel
3. **Contratação de serviços** (internet, telefonia, etc.)
4. **Aquisição de equipamentos** em lotes para melhor negociação
5. **Configuração da infraestrutura** com suporte técnico especializado

---

**📄 Relatório gerado em:** ${new Date().toLocaleString('pt-BR')}
**🤖 Sistema:** ARKAD AI - Consultoria Empresarial
        `;
    }

    // Formatar lista de equipamentos
    formatEquipmentList(planType, equipamentos) {
        let list = '';
        Object.entries(equipamentos).forEach(([key, equipment]) => {
            const config = equipment[planType];
            const total = config.qty * config.price;
            list += `• **${key.charAt(0).toUpperCase() + key.slice(1)}:** ${config.qty}x ${config.desc} - R$ ${total.toLocaleString('pt-BR')}\n`;
        });
        return list;
    }

    // Formatar lista de software
    formatSoftwareList(planType, software) {
        let list = '';
        software[planType].forEach(item => {
            const total = item.qty * item.price;
            list += `• **${item.name}:** ${item.qty}x - R$ ${total.toLocaleString('pt-BR')}\n`;
        });
        return list;
    }

    // Formatar lista de infraestrutura
    formatInfrastructureList(planType, infraestrutura) {
        let list = '';
        infraestrutura[planType].forEach(item => {
            if (item.type === 'unico') {
                list += `• **${item.name}:** R$ ${item.price.toLocaleString('pt-BR')} (custo único)\n`;
            }
        });
        return list;
    }

    // Formatar custos mensais
    formatMonthlyCostsList(planType, custosOperacionais) {
        let list = '';
        custosOperacionais[planType].forEach(cost => {
            list += `• **${cost.name}:** R$ ${cost.price.toLocaleString('pt-BR')}/mês\n`;
        });
        return list;
    }

    // Formatar serviços mensais
    formatMonthlyServicesList(planType, infraestrutura) {
        let list = '';
        infraestrutura[planType].forEach(item => {
            if (item.type === 'mensal') {
                list += `• **${item.name}:** R$ ${item.price.toLocaleString('pt-BR')}/mês\n`;
            }
        });
        return list;
    }

    // Obter características do plano
    getPlanFeatures(planType) {
        const features = {
            basico: [
                "• Configuração básica para 2-3 pessoas",
                "• Equipamentos essenciais para desenvolvimento",
                "• Infraestrutura de rede simples",
                "• Ideal para startups e pequenos projetos"
            ],
            intermediario: [
                "• Configuração para 4-6 pessoas",
                "• Equipamentos com melhor performance",
                "• Infraestrutura de rede gerenciável",
                "• Sistema de backup e monitoramento",
                "• Ideal para empresas em crescimento"
            ],
            premium: [
                "• Configuração para 6+ pessoas",
                "• Equipamentos de alta performance",
                "• Infraestrutura completa e redundante",
                "• Sistema avançado de backup e monitoramento",
                "• Segurança física e digital",
                "• Ideal para empresas estabelecidas"
            ]
        };
        
        return features[planType].join('\n');
    }

    // Formatar lista detalhada de equipamentos para PDF
    formatDetailedEquipmentList(planType, equipamentos) {
        let html = '';
        Object.entries(equipamentos).forEach(([key, equipment]) => {
            const config = equipment[planType];
            const total = config.qty * config.price;
            html += `
                <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #007bff;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                    <p style="margin: 5px 0; color: #666;">${config.desc}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span style="color: #666;">Quantidade: ${config.qty}x</span>
                        <span style="font-weight: bold; color: #28a745; font-size: 18px;">R$ ${total.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            `;
        });
        return html;
    }

    // Formatar lista detalhada de software para PDF
    formatDetailedSoftwareList(planType, software) {
        let html = '';
        software[planType].forEach(item => {
            const total = item.qty * item.price;
            html += `
                <div style="background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #28a745;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h4 style="margin: 0 0 5px 0; color: #333;">${item.name}</h4>
                            <span style="color: #666;">Quantidade: ${item.qty}x</span>
                        </div>
                        <span style="font-weight: bold; color: #28a745; font-size: 18px;">R$ ${total.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            `;
        });
        return html;
    }

    // Formatar custos operacionais detalhados para PDF
    formatDetailedMonthlyCosts(planType, custosOperacionais, infraestrutura) {
        let html = '';
        
        // Custos fixos
        html += '<h4 style="color: #333; margin: 20px 0 10px 0;">Custos Fixos Mensais</h4>';
        custosOperacionais[planType].forEach(cost => {
            html += `
                <div style="background: white; padding: 12px; margin: 8px 0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #333;">${cost.name}</span>
                    <span style="font-weight: bold; color: #dc3545;">R$ ${cost.price.toLocaleString('pt-BR')}/mês</span>
                </div>
            `;
        });
        
        // Serviços mensais
        html += '<h4 style="color: #333; margin: 20px 0 10px 0;">Serviços Mensais</h4>';
        infraestrutura[planType].forEach(item => {
            if (item.type === 'mensal') {
                html += `
                    <div style="background: white; padding: 12px; margin: 8px 0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #333;">${item.name}</span>
                        <span style="font-weight: bold; color: #dc3545;">R$ ${item.price.toLocaleString('pt-BR')}/mês</span>
                    </div>
                `;
            }
        });
        
        return html;
    }

    // Gerar PDF
    generatePDF() {
        const reportData = this.processCompleteAnalysis();
        const planType = this.userData.planType.toLowerCase();
        const officeData = this.officeData;
        
        // Calcular custos totais
        const totalInvestment = this.calculateTotalInvestment(planType, officeData);
        const monthlyCosts = this.calculateMonthlyCosts(planType, officeData);
        
        // Gerar relatório completo para PDF
        const fullReport = this.generateFullOfficeReport(planType, totalInvestment, monthlyCosts);
        
        // Criar elemento temporário para PDF
        const element = document.createElement('div');
        element.innerHTML = fullReport;
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.lineHeight = '1.6';
        element.style.color = '#333';
        
        // Configurações do PDF
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `Relatorio_Escritorio_TI_${this.userData.planType}_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };
        
        // Gerar PDF
        html2pdf().set(opt).from(element).save();
        
        return {
            message: "📄 **PDF gerado automaticamente!**\n\nO relatório completo com orçamento detalhado foi salvo no seu dispositivo. O documento inclui todos os custos, equipamentos e projeções financeiras para montagem do seu escritório de TI.",
            type: 'pdf_generated'
        };
    }

    // Gerar relatório completo para PDF
    generateFullOfficeReport(planType, totalInvestment, monthlyCosts) {
        const planName = this.userData.planType;
        const officeData = this.officeData;
        
        return `
            <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
                <!-- Cabeçalho -->
                <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
                    <h1 style="margin: 0; font-size: 28px;">🏢 RELATÓRIO DE MONTAGEM</h1>
                    <h2 style="margin: 10px 0 0 0; font-size: 20px; opacity: 0.9;">Escritório de Tecnologia da Informação</h2>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.8;">Plano Selecionado: ${planName}</p>
                </div>

                <!-- Resumo Executivo -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #007bff;">
                    <h3 style="color: #007bff; margin-top: 0;">📊 RESUMO EXECUTIVO</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div>
                            <h4 style="color: #333; margin-bottom: 10px;">Investimento Inicial</h4>
                            <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">R$ ${totalInvestment.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                            <h4 style="color: #333; margin-bottom: 10px;">Custos Mensais</h4>
                            <p style="font-size: 24px; font-weight: bold; color: #dc3545; margin: 0;">R$ ${monthlyCosts.toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px;">
                        <h4 style="color: #333; margin-bottom: 10px;">Total Primeiro Ano</h4>
                        <p style="font-size: 28px; font-weight: bold; color: #007bff; margin: 0;">R$ ${(totalInvestment + (monthlyCosts * 12)).toLocaleString('pt-BR')}</p>
                    </div>
                </div>

                <!-- Equipamentos Detalhados -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">🖥️ EQUIPAMENTOS E INFRAESTRUTURA</h3>
                    ${this.formatDetailedEquipmentList(planType, officeData.equipamentos)}
                </div>

                <!-- Software e Licenças -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">💿 SOFTWARE E LICENÇAS</h3>
                    ${this.formatDetailedSoftwareList(planType, officeData.software)}
                </div>

                <!-- Custos Operacionais -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">💰 CUSTOS OPERACIONAIS MENSАIS</h3>
                    ${this.formatDetailedMonthlyCosts(planType, officeData.custosOperacionais, officeData.infraestrutura)}
                </div>

                <!-- Projeções Financeiras -->
                <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h3 style="color: #1976d2; margin-top: 0;">📈 PROJEÇÕES FINANCEIRAS</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="text-align: center; background: white; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">Ano 1</h4>
                            <p style="font-size: 18px; font-weight: bold; color: #28a745; margin: 0;">R$ ${(totalInvestment + (monthlyCosts * 12)).toLocaleString('pt-BR')}</p>
                        </div>
                        <div style="text-align: center; background: white; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">Ano 2</h4>
                            <p style="font-size: 18px; font-weight: bold; color: #28a745; margin: 0;">R$ ${(monthlyCosts * 12).toLocaleString('pt-BR')}</p>
                        </div>
                        <div style="text-align: center; background: white; padding: 15px; border-radius: 8px;">
                            <h4 style="margin: 0 0 10px 0; color: #333;">Ano 3</h4>
                            <p style="font-size: 18px; font-weight: bold; color: #28a745; margin: 0;">R$ ${(monthlyCosts * 12).toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>

                <!-- Características do Plano -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 2px solid #6f42c1; padding-bottom: 10px;">🎯 CARACTERÍSTICAS DO PLANO ${planName}</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                        ${this.getPlanFeatures(planType).split('\n').map(feature => 
                            `<div style="margin: 8px 0; padding: 8px; background: white; border-radius: 5px; border-left: 3px solid #6f42c1;">${feature}</div>`
                        ).join('')}
                    </div>
                </div>

                <!-- Observações Importantes -->
                <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
                    <h3 style="color: #856404; margin-top: 0;">⚠️ OBSERVAÇÕES IMPORTANTES</h3>
                    <ul style="color: #856404; line-height: 1.6;">
                        <li><strong>Aluguel não incluído:</strong> Os valores de aluguel são estimativas baseadas em médias de mercado</li>
                        <li><strong>Impostos:</strong> Considere impostos sobre equipamentos e serviços (ICMS, IPI, etc.)</li>
                        <li><strong>Manutenção:</strong> Inclua custos de manutenção preventiva dos equipamentos</li>
                        <li><strong>Backup:</strong> Implemente estratégia de backup e recuperação de dados</li>
                        <li><strong>Segurança:</strong> Considere investimento em segurança física e digital</li>
                        <li><strong>Contratação:</strong> Valide preços com fornecedores locais antes da compra</li>
                    </ul>
                </div>

                <!-- Próximos Passos -->
                <div style="background: #d1ecf1; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #17a2b8;">
                    <h3 style="color: #0c5460; margin-top: 0;">🚀 PRÓXIMOS PASSOS RECOMENDADOS</h3>
                    <ol style="color: #0c5460; line-height: 1.6;">
                        <li><strong>Validação do orçamento</strong> com fornecedores locais</li>
                        <li><strong>Definição do local</strong> e negociação do aluguel</li>
                        <li><strong>Contratação de serviços</strong> (internet, telefonia, etc.)</li>
                        <li><strong>Aquisição de equipamentos</strong> em lotes para melhor negociação</li>
                        <li><strong>Configuração da infraestrutura</strong> com suporte técnico especializado</li>
                        <li><strong>Implementação de segurança</strong> física e digital</li>
                    </ol>
                </div>

                <!-- Rodapé -->
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px; color: #666;">
                    <p style="margin: 0; font-size: 14px;"><strong>Relatório gerado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Sistema:</strong> ARKAD AI - Consultoria Empresarial</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Este relatório é uma estimativa baseada em dados de mercado e deve ser validado com fornecedores locais.</p>
                </div>
            </div>
        `;
    }

    // Gerar TXT
    generateTXT() {
        const reportData = this.processCompleteAnalysis();
        const content = reportData.message;
        
        // Remover formatação HTML para TXT
        const textContent = content
            .replace(/<[^>]*>/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1');
        
        // Criar e baixar arquivo TXT
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Escritorio_TI_${this.userData.planType}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        return {
            message: "📝 **Arquivo TXT gerado com sucesso!**\n\nO relatório em formato texto foi salvo no seu dispositivo. Este formato é ideal para edição e personalização.",
            type: 'txt_generated'
        };
    }
}

// Criar instância global
window.escritorioTIFlow = new EscritorioTIFlow();
