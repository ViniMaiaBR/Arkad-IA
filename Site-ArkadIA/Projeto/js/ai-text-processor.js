// Processador de Texto da IA para Geração de PDF - ARKAD AI
// Sistema que processa resultados de IA e gera PDFs baseados no template ExemploRelatorio

class AITextProcessor {
    constructor() {
        this.template = {
            header: {
                title: "Relatório Estratégico Arkad AI",
                subtitle: "",
                client: "",
                company: "",
                date: "",
                consultant: "Arkad AI – Unidade Estratégica de Negócios"
            },
            sections: []
        };
    }

    // Processar texto da IA e extrair informações estruturadas
    processAIText(aiText, context = {}) {
        try {
            const processedData = {
                header: this.extractHeader(aiText, context),
                objective: this.extractObjective(aiText),
                diagnosis: this.extractDiagnosis(aiText),
                strategy: this.extractStrategy(aiText),
                phases: this.extractPhases(aiText),
                technology: this.extractTechnology(aiText),
                risks: this.extractRisks(aiText),
                financial: this.extractFinancial(aiText),
                conclusion: this.extractConclusion(aiText)
            };

            return processedData;
        } catch (error) {
            console.error('Erro ao processar texto da IA:', error);
            return this.createDefaultStructure(aiText, context);
        }
    }

    // Extrair cabeçalho do relatório
    extractHeader(aiText, context) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        
        return {
            title: context.title || "Relatório Estratégico Arkad AI",
            subtitle: context.subtitle || this.extractSubtitle(aiText),
            client: context.client || this.extractClient(aiText),
            company: context.company || this.extractCompany(aiText),
            date: context.date || currentDate,
            consultant: "Arkad AI – Unidade Estratégica de Negócios"
        };
    }

    // Extrair subtítulo do texto
    extractSubtitle(aiText) {
        const subtitlePatterns = [
            /proposta de (.+)/i,
            /plano de (.+)/i,
            /análise de (.+)/i,
            /estratégia de (.+)/i
        ];

        for (const pattern of subtitlePatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return `Proposta de ${match[1].charAt(0).toUpperCase() + match[1].slice(1)}`;
            }
        }

        return "Análise Estratégica e Recomendações";
    }

    // Extrair cliente do texto
    extractClient(aiText) {
        const clientPatterns = [
            /cliente: (.+)/i,
            /para (.+)/i,
            /solicitado por (.+)/i
        ];

        for (const pattern of clientPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return "Cliente";
    }

    // Extrair empresa do texto
    extractCompany(aiText) {
        const companyPatterns = [
            /empresa: (.+)/i,
            /da empresa (.+)/i,
            /organização (.+)/i
        ];

        for (const pattern of companyPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }

        return "Empresa";
    }

    // Extrair objetivo do projeto
    extractObjective(aiText) {
        const objectivePatterns = [
            /objetivo[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /meta[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /finalidade[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is
        ];

        for (const pattern of objectivePatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "O cliente solicitou à Arkad AI a elaboração de um plano estratégico e financeiro, com base em análise de viabilidade, estimativa de custos, previsão de ROI e diretrizes operacionais.";
    }

    // Extrair diagnóstico e contexto
    extractDiagnosis(aiText) {
        const diagnosisPatterns = [
            /situação atual[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /contexto[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /diagnóstico[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is
        ];

        for (const pattern of diagnosisPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "Análise da situação atual e identificação de oportunidades de melhoria.";
    }

    // Extrair estratégia
    extractStrategy(aiText) {
        const strategyPatterns = [
            /estratégia[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /plano[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /abordagem[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is
        ];

        for (const pattern of strategyPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "Desenvolvimento de estratégia personalizada baseada nas necessidades identificadas.";
    }

    // Extrair fases de execução
    extractPhases(aiText) {
        const phases = [];
        const phasePatterns = [
            /fase\s*(\d+)[:\s]*(.+?)(?=\n\n|fase\s*\d+|$)/gis,
            /etapa\s*(\d+)[:\s]*(.+?)(?=\n\n|etapa\s*\d+|$)/gis,
            /período\s*(\d+)[:\s]*(.+?)(?=\n\n|período\s*\d+|$)/gis
        ];

        for (const pattern of phasePatterns) {
            let match;
            while ((match = pattern.exec(aiText)) !== null) {
                phases.push({
                    number: match[1],
                    title: `Fase ${match[1]}`,
                    content: this.cleanText(match[2])
                });
            }
        }

        if (phases.length === 0) {
            phases.push({
                number: "1",
                title: "Fase 1: Planejamento",
                content: "Planejamento inicial e definição de objetivos."
            });
        }

        return phases;
    }

    // Extrair informações sobre tecnologia
    extractTechnology(aiText) {
        const techPatterns = [
            /tecnologia[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /ferramentas[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /sistemas[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is
        ];

        for (const pattern of techPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "Recomendações de tecnologia e ferramentas para otimização dos processos.";
    }

    // Extrair análise de riscos
    extractRisks(aiText) {
        const riskPatterns = [
            /riscos?[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /desafios?[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /problemas?[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is
        ];

        for (const pattern of riskPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "Identificação de riscos potenciais e estratégias de mitigação.";
    }

    // Extrair informações financeiras
    extractFinancial(aiText) {
        const financialPatterns = [
            /financeiro[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /orçamento[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /custo[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is,
            /investimento[:\s]*(.+?)(?=\n\n|\n[0-9]|$)/is
        ];

        for (const pattern of financialPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "Análise financeira e projeções de custos e retorno.";
    }

    // Extrair conclusão
    extractConclusion(aiText) {
        const conclusionPatterns = [
            /conclusão[:\s]*(.+?)(?=\n\n|contato|$)/is,
            /recomendação[:\s]*(.+?)(?=\n\n|contato|$)/is,
            /resumo[:\s]*(.+?)(?=\n\n|contato|$)/is
        ];

        for (const pattern of conclusionPatterns) {
            const match = aiText.match(pattern);
            if (match) {
                return this.cleanText(match[1]);
            }
        }

        return "A análise conduzida pela Arkad AI indica viabilidade e alinhamento estratégico com os objetivos propostos.";
    }

    // Criar estrutura padrão quando não conseguir extrair informações
    createDefaultStructure(aiText, context) {
        return {
            header: {
                title: "Relatório Estratégico Arkad AI",
                subtitle: context.subtitle || "Análise e Recomendações",
                client: context.client || "Cliente",
                company: context.company || "Empresa",
                date: new Date().toLocaleDateString('pt-BR'),
                consultant: "Arkad AI – Unidade Estratégica de Negócios"
            },
            objective: "Análise estratégica baseada nos dados fornecidos pela IA.",
            diagnosis: aiText.substring(0, 500) + "...",
            strategy: "Desenvolvimento de estratégia personalizada.",
            phases: [
                {
                    number: "1",
                    title: "Fase 1: Análise",
                    content: "Análise inicial dos dados e identificação de oportunidades."
                }
            ],
            technology: "Recomendações de tecnologia e ferramentas.",
            risks: "Identificação de riscos e estratégias de mitigação.",
            financial: "Análise financeira e projeções.",
            conclusion: "Conclusões e recomendações finais baseadas na análise da IA."
        };
    }

    // Limpar texto extraído
    cleanText(text) {
        return text
            .replace(/\n\s*\n/g, '\n')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Gerar PDF baseado no template ExemploRelatorio
    async generateReportPDF(aiText, context = {}) {
        try {
            const processedData = this.processAIText(aiText, context);
            const htmlContent = this.generateReportHTML(processedData);
            
            const result = await window.generateCustomPDF(htmlContent, {
                filename: `Relatorio_Arkad_AI_${new Date().toISOString().split('T')[0]}.pdf`
            });

            return result;
        } catch (error) {
            console.error('Erro ao gerar relatório PDF:', error);
            throw error;
        }
    }

    // Gerar HTML do relatório baseado no template
    generateReportHTML(data) {
        return `
            <div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
                
                <!-- Cabeçalho -->
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #00B5B8; padding-bottom: 20px;">
                    <h1 style="color: #00B5B8; font-size: 28px; margin-bottom: 10px; font-weight: 700;">${data.header.title}</h1>
                    <h2 style="color: #333; font-size: 20px; margin-bottom: 20px; font-weight: 600;">${data.header.subtitle}</h2>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
                        <div><strong>Cliente:</strong> ${data.header.client}</div>
                        <div><strong>Data:</strong> ${data.header.date}</div>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                        <div><strong>Empresa:</strong> ${data.header.company}</div>
                        <div><strong>Consultora:</strong> ${data.header.consultant}</div>
                    </div>
                </div>

                <!-- Objetivo do Projeto -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        Objetivo do Projeto
                    </h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #00B5B8;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">${data.objective}</p>
                    </div>
                </div>

                <!-- Diagnóstico -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        1. Diagnóstico e Contexto Atual
                    </h3>
                    <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.diagnosis}</p>
                    </div>
                </div>

                <!-- Estratégia -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        2. Estratégia de Implementação
                    </h3>
                    <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.strategy}</p>
                    </div>
                </div>

                <!-- Fases de Execução -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        3. Plano Estratégico – Fases de Execução
                    </h3>
                    ${data.phases.map((phase, index) => `
                        <div style="margin-bottom: 20px; background: #f8f9fa; border-radius: 8px; padding: 15px; border-left: 4px solid #00B5B8;">
                            <h4 style="color: #333; font-size: 16px; margin-bottom: 10px; font-weight: 600;">${phase.title}</h4>
                            <p style="margin: 0; font-size: 14px; line-height: 1.6;">${phase.content}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Tecnologia -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        4. Stack Operacional Recomendado
                    </h3>
                    <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.technology}</p>
                    </div>
                </div>

                <!-- Riscos -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        5. Análise de Riscos e Mitigações
                    </h3>
                    <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.risks}</p>
                    </div>
                </div>

                <!-- Financeiro -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        6. Projeção Financeira
                    </h3>
                    <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6;">${data.financial}</p>
                    </div>
                </div>

                <!-- Conclusão -->
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 600;">
                        Conclusão
                    </h3>
                    <div style="background: #e8f5e8; border-left: 4px solid #28a745; border-radius: 0 8px 8px 0; padding: 20px;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; font-weight: 500;">${data.conclusion}</p>
                    </div>
                </div>

                <!-- Contato -->
                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef; text-align: center;">
                    <div style="color: #666; font-size: 12px;">
                        <p style="margin: 5px 0;"><strong>Contato Arkad AI</strong></p>
                        <p style="margin: 5px 0;">E-mail: contato@arkad.ai</p>
                        <p style="margin: 5px 0;">Local: Santo André – SP</p>
                        <p style="margin: 5px 0;">Versão do Relatório: 1.0 (Gerado automaticamente por IA)</p>
                    </div>
                </div>

            </div>
        `;
    }
}

// Instância global do processador
window.aiTextProcessor = new AITextProcessor();

// Função de conveniência para gerar relatório
window.generateAIReportPDF = (aiText, context) => window.aiTextProcessor.generateReportPDF(aiText, context);

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AITextProcessor;
}
