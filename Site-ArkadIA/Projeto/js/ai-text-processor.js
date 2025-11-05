// Processador de Texto da IA para Geração de PDF - ARKAD AI
// Sistema que processa resultados de IA e gera PDFs baseados no template Documentacao/prompts_txt/ExemploRelatorio.txt

class AITextProcessor {
    constructor() {
        this.template = {
            header: {
                title: "Relatório Arkad IA",
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
            console.log('🔍 Processando texto da IA...');
            console.log('📄 Texto original (primeiros 300 chars):', aiText.substring(0, 300));
            
            // Nova abordagem: detectar seções automaticamente
            const sections = this.detectSections(aiText);
            console.log('✅ Seções detectadas:', sections.length);
            
            const processedData = {
                header: this.extractHeader(aiText, context),
                sections: sections
            };

            return processedData;
        } catch (error) {
            console.error('Erro ao processar texto da IA:', error);
            return this.createDefaultStructure(aiText, context);
        }
    }

    // Nova função para detectar seções automaticamente
    detectSections(aiText) {
        const sections = [];
        
        // Limpar texto
        const cleanedText = aiText
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .trim();
        
        console.log('📝 Texto limpo para análise (primeiros 300 chars):', cleanedText.substring(0, 300));
        
        // Palavras-chave que indicam informações do cabeçalho (devem ser ignoradas)
        const headerKeywords = [
            'cliente', 'client', 'nome do cliente',
            'empresa', 'company', 'nome da empresa', 'organização',
            'data', 'date', 'data de', 'data do',
            'título', 'titulo', 'title', 'título do relatório', 'titulo do relatorio',
            'relatório', 'relatorio', 'report',
            'consultoria', 'consultor', 'consultant', 'consultora',
            'consultor de ia', 'consultora de ia'
        ];
        
        // Função para verificar se uma seção é do cabeçalho
        const isHeaderSection = (title, position, totalSections) => {
            const titleLower = title.toLowerCase().trim();
            
            // Verificar se o título contém palavras-chave do cabeçalho
            const isHeaderKeyword = headerKeywords.some(keyword => 
                titleLower.includes(keyword.toLowerCase())
            );
            
            // Se for uma das primeiras 3 seções E contiver palavras-chave do cabeçalho, ignorar
            if (position < 3 && isHeaderKeyword) {
                console.log(`⏭️ Seção ignorada (cabeçalho): "${title}" (posição ${position})`);
                return true;
            }
            
            // Verificar padrões específicos de cabeçalho
            const headerPatterns = [
                /^cliente/i,
                /^empresa/i,
                /^data/i,
                /^título/i,
                /^titulo/i,
                /^relatório/i,
                /^relatorio/i,
                /^consultor/i
            ];
            
            const matchesPattern = headerPatterns.some(pattern => pattern.test(titleLower));
            
            if (position < 4 && matchesPattern) {
                console.log(`⏭️ Seção ignorada (padrão cabeçalho): "${title}" (posição ${position})`);
                return true;
            }
            
            return false;
        };
        
        // Padrão para detectar títulos: texto que termina com ":" ou ":" seguido de texto
        // Aceita formatos como:
        // - "Objetivo projeto: texto"
        // - "1. Diagnóstico: texto"
        // - "Diagnóstico e Contexto Atual: texto"
        const sectionPattern = /([A-ZÁÉÍÓÚÂÊÔÃÕÇ][^:\n]{3,80}):\s*([^\n]+(?:\n(?![A-ZÁÉÍÓÚÂÊÔÃÕÇ][^:\n]{3,80}:)[^\n]+)*)/gi;
        
        let match;
        let foundSections = 0;
        let position = 0;
        const allMatches = [];
        
        // Primeiro, coletar todas as seções encontradas
        while ((match = sectionPattern.exec(cleanedText)) !== null) {
            const title = match[1].trim()
                .replace(/^\d+\.\s*/, '') // Remove numeração se já existir
                .replace(/^[-•*]\s*/, ''); // Remove bullets
            const content = match[2].trim();
            
            allMatches.push({
                title: title,
                content: content,
                position: position++,
                matchIndex: match.index
            });
        }
        
        console.log(`📊 Total de seções encontradas (antes do filtro): ${allMatches.length}`);
        
        // Filtrar seções do cabeçalho e adicionar as válidas
        allMatches.forEach((match, index) => {
            if (!isHeaderSection(match.title, match.position, allMatches.length)) {
                console.log(`✅ Seção adicionada: "${match.title}" (${match.content.length} chars)`);
                sections.push({
                    title: match.title,
                    content: match.content
                });
                foundSections++;
            }
        });
        
        console.log(`✅ Total de seções válidas (após filtro): ${foundSections}`);
        
        // Se não encontrou nenhuma seção, tentar separar por pontos finais seguidos de letra maiúscula
        if (sections.length === 0) {
            console.log('⚠️ Nenhuma seção detectada, tentando abordagem alternativa...');
            
            // Separar por frases que começam com letra maiúscula após ponto final
            const sentences = cleanedText.split(/\.\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ])/);
            
            const tempSections = [];
            
            sentences.forEach((sentence, index) => {
                const trimmed = sentence.trim();
                if (trimmed.length > 20) {
                    let sectionTitle = '';
                    let sectionContent = '';
                    
                    // Primeiro encontrado pode ser objetivo ou informação do cabeçalho
                    if (index === 0) {
                        // Verificar se contém informações do cabeçalho
                        const firstPart = trimmed.substring(0, 100).toLowerCase();
                        const hasHeaderInfo = headerKeywords.some(keyword => firstPart.includes(keyword));
                        
                        if (!hasHeaderInfo) {
                            sectionTitle = 'Objetivo do Projeto';
                            sectionContent = trimmed;
                        } else {
                            console.log(`⏭️ Primeira frase ignorada (cabeçalho): "${trimmed.substring(0, 50)}..."`);
                            return; // Pular esta frase
                        }
                    } else {
                        // Tentar extrair título da primeira parte da frase
                        const firstPart = trimmed.substring(0, 80);
                        const colonIndex = firstPart.indexOf(':');
                        
                        if (colonIndex > 0) {
                            sectionTitle = trimmed.substring(0, colonIndex).trim();
                            sectionContent = trimmed.substring(colonIndex + 1).trim();
                            
                            // Verificar se o título é do cabeçalho
                            if (isHeaderSection(sectionTitle, index, sentences.length)) {
                                console.log(`⏭️ Seção ignorada (cabeçalho): "${sectionTitle}"`);
                                return; // Pular esta seção
                            }
                        } else {
                            // Usar primeiras palavras como título
                            const words = trimmed.split(' ');
                            sectionTitle = words.slice(0, Math.min(5, words.length)).join(' ');
                            sectionContent = trimmed;
                            
                            // Verificar se o título é do cabeçalho
                            if (isHeaderSection(sectionTitle, index, sentences.length)) {
                                console.log(`⏭️ Seção ignorada (cabeçalho): "${sectionTitle}"`);
                                return; // Pular esta seção
                            }
                        }
                    }
                    
                    if (sectionTitle && sectionContent) {
                        tempSections.push({
                            title: sectionTitle,
                            content: sectionContent,
                            position: index
                        });
                    }
                }
            });
            
            // Adicionar apenas seções válidas
            tempSections.forEach(section => {
                sections.push({
                    title: section.title,
                    content: section.content
                });
            });
            
            console.log(`✅ Seções criadas pela abordagem alternativa: ${sections.length}`);
        }
        
        // Se ainda não tem seções, criar uma seção padrão
        if (sections.length === 0) {
            console.log('⚠️ Criando seção padrão...');
            sections.push({
                title: 'Análise Completa',
                content: cleanedText
            });
        }
        
        return sections;
    }

    // Extrair cabeçalho do relatório
    extractHeader(aiText, context) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        
        return {
            title: context.title || "Relatório Arkad IA",
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

        return "Este relatório apresenta um plano estratégico e financeiro, com base em análise de viabilidade, estimativa de custos, previsão de ROI e diretrizes operacionais.";
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
                title: "Relatório Arkad IA",
                subtitle: context.subtitle || "Análise e Recomendações",
                client: context.client || "Cliente",
                company: context.company || "Empresa",
                date: new Date().toLocaleDateString('pt-BR'),
                consultant: "Arkad AI – Unidade Estratégica de Negócios"
            },
            sections: [
                {
                    title: "Análise Completa",
                    content: aiText || "Conteúdo não disponível."
                }
            ]
        };
    }

    // Limpar texto extraído - preservando estrutura
    cleanText(text) {
        return text
            .trim()
            .replace(/\n{3,}/g, '\n\n') // Máximo 2 quebras de linha seguidas
            .replace(/[ \t]+/g, ' ') // Remover espaços múltiplos, mas manter quebras de linha
            .replace(/\n /g, '\n') // Remover espaços no início de linhas
            .replace(/ \n/g, '\n'); // Remover espaços no final de linhas
    }

    // Gerar PDF baseado no template Documentacao/prompts_txt/ExemploRelatorio.txt
    async generateReportPDF(aiText, context = {}, progressCallback = null) {
        try {
            const processedData = this.processAIText(aiText, context);
            const htmlContent = this.generateReportHTML(processedData);
            
            const dateStr = new Date().toISOString().split('T')[0];
            
            // Gerar apenas o relatório principal
            if (progressCallback) progressCallback('Gerando Relatório...');
            
            const result = await window.generateCustomPDF(htmlContent, {
                filename: `Relatorio_Arkad_AI_${dateStr}.pdf`
            });

            if (!result.success) {
                throw new Error('Erro ao gerar relatório');
            }

            console.log('✓ Relatório gerado');

            if (progressCallback) progressCallback('Finalizando...');

            // Retornar resultado
            return {
                success: true,
                message: 'Relatório gerado com sucesso!',
                details: {
                    report: result
                }
            };

        } catch (error) {
            console.error('Erro ao gerar relatório PDF:', error);
            throw error;
        }
    }

    // Função auxiliar para delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Formatar texto para HTML preservando estrutura
    formatTextToHTML(text) {
        if (!text) return '';
        
        // Converter quebras de linha em <br>
        let formatted = text.replace(/\n/g, '<br>');
        
        // Detectar e formatar listas (linhas começando com -, •, *, ou números)
        formatted = formatted.replace(/(?:^|<br>)([-•*]\s+)(.+?)(?=<br>|$)/g, (match, bullet, content) => {
            return `<li style="margin: 5px 0; margin-left: 20px;">${content}</li>`;
        });
        
        // Detectar listas numeradas
        formatted = formatted.replace(/(?:^|<br>)(\d+[\.)]\s+)(.+?)(?=<br>|$)/g, (match, number, content) => {
            return `<li style="margin: 5px 0; margin-left: 20px;">${content}</li>`;
        });
        
        // Envolver listas em <ul>
        if (formatted.includes('<li')) {
            formatted = formatted.replace(/(<li[^>]*>.*?<\/li>)+/g, (match) => {
                return `<ul style="margin: 10px 0; padding-left: 20px;">${match}</ul>`;
            });
        }
        
        return formatted;
    }

    // Gerar HTML do relatório baseado no template
    generateReportHTML(data) {
        // Ícones para as seções
        const icons = ['🎯', '🔍', '💡', '📊', '⚙️', '📈', '💼', '🚀', '🎓', '🔬', '💻', '📋'];
        
        return `
            <div style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 0;">
                
                <!-- Cabeçalho -->
                <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #00B5B8; padding: 20px; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 8px;">
                    <h1 style="color: #00B5B8; font-size: 26px; margin: 0 0 15px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">RELATÓRIO ARKAD IA</h1>
                    
                    <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 15px;">
                        <h2 style="color: #00B5B8; font-size: 16px; margin: 0 0 12px 0; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #00B5B8; padding-bottom: 8px;">${data.header.subtitle || 'Análise Estratégica e Recomendações'}</h2>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; font-size: 13px; margin-top: 12px;">
                            <div style="padding: 6px;">
                                <strong style="color: #00B5B8; display: block; margin-bottom: 4px;">Cliente:</strong>
                                <span style="color: #333;">${data.header.client}</span>
                            </div>
                            <div style="padding: 6px;">
                                <strong style="color: #00B5B8; display: block; margin-bottom: 4px;">Empresa:</strong>
                                <span style="color: #333;">${data.header.company}</span>
                            </div>
                            <div style="padding: 6px;">
                                <strong style="color: #00B5B8; display: block; margin-bottom: 4px;">Data:</strong>
                                <span style="color: #333;">${data.header.date}</span>
                            </div>
                            <div style="padding: 6px;">
                                <strong style="color: #00B5B8; display: block; margin-bottom: 4px;">Consultoria:</strong>
                                <span style="color: #333; font-size: 11px;">${data.header.consultant}</span>
                            </div>
                        </div>
                    </div>
                </div>

                ${data.sections && data.sections.length > 0 ? data.sections.map((section, index) => {
                    const isFirst = index === 0;
                    const icon = icons[index % icons.length];
                    
                    // Primeira seção tem destaque especial (Objetivo do Projeto)
                    if (isFirst) {
                        return `
                        <!-- Objetivo do Projeto (Primeira Seção) -->
                        <div style="margin-bottom: 25px; page-break-inside: avoid;">
                            <h3 style="color: #00B5B8; font-size: 17px; margin-bottom: 10px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 700; background: #f8f9fa; padding: 10px; border-radius: 4px;">
                                ${icon} ${this.capitalizeFirst(section.title)}
                            </h3>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #00B5B8; box-shadow: 0 1px 3px rgba(0,181,184,0.1);">
                                <div style="font-size: 14px; line-height: 1.6; color: #444;">${this.formatTextToHTML(section.content)}</div>
                            </div>
                        </div>
                        `;
                    }
                    
                    // Demais seções numeradas
                    return `
                    <div style="margin-bottom: 25px; page-break-inside: avoid;">
                        <h3 style="color: #00B5B8; font-size: 17px; margin-bottom: 10px; border-left: 4px solid #00B5B8; padding-left: 10px; font-weight: 700; background: #f8f9fa; padding: 10px; border-radius: 4px;">
                            ${index}. ${icon} ${this.capitalizeFirst(section.title)}
                        </h3>
                        <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 6px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <div style="font-size: 13px; line-height: 1.6; color: #555;">${this.formatTextToHTML(section.content)}</div>
                        </div>
                    </div>
                    `;
                }).join('') : ''}

                <!-- Contato -->
                <div style="margin-top: 50px; padding-top: 25px; border-top: 3px solid #e9ecef; text-align: center; background: #f8f9fa; padding: 25px; border-radius: 8px;">
                    <div style="color: #666; font-size: 13px;">
                        <p style="margin: 8px 0; font-weight: 700; color: #00B5B8; font-size: 15px;">Contato Arkad AI</p>
                        <p style="margin: 6px 0;">📧 E-mail: contato@arkad.ai</p>
                        <p style="margin: 6px 0;">📍 Local: Santo André – SP</p>
                        <p style="margin: 6px 0; font-style: italic; color: #888;">Versão do Relatório: 1.0 (Gerado automaticamente por IA)</p>
                    </div>
                </div>

            </div>
        `;
    }
    
    // Capitalizar primeira letra
    capitalizeFirst(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
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
