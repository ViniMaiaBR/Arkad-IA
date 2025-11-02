// Gerador de PDF para Resultados da IA - ARKAD AI
// Sistema genérico para gerar PDFs com resultados de análises de IA

class PDFGenerator {
    constructor() {
        this.defaultConfig = {
            margin: [0.2, 0.3, 0.2, 0.3],
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
    }

    // Gerar PDF com dados de análise de IA
    generateAIAnalysisPDF(analysisData, options = {}) {
        try {
            const config = { ...this.defaultConfig, ...options };
            const filename = options.filename || `Analise_IA_${new Date().toISOString().split('T')[0]}.pdf`;
            config.filename = filename;

            // Criar elemento HTML para o PDF
            const element = this.createAnalysisElement(analysisData);
            
            // Gerar PDF
            return html2pdf().set(config).from(element).save().then(() => {
                return {
                    success: true,
                    message: `PDF gerado com sucesso: ${filename}`,
                    filename: filename
                };
            }).catch((error) => {
                console.error('Erro ao gerar PDF:', error);
                return {
                    success: false,
                    message: 'Erro ao gerar PDF',
                    error: error
                };
            });

        } catch (error) {
            console.error('Erro na geração do PDF:', error);
            return Promise.resolve({
                success: false,
                message: 'Erro interno na geração do PDF',
                error: error
            });
        }
    }

    // Criar elemento HTML para análise
    createAnalysisElement(analysisData) {
        const element = document.createElement('div');
        element.style.cssText = `
            padding: 20px;
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        `;

        element.innerHTML = this.generateAnalysisHTML(analysisData);
        return element;
    }

    // Gerar HTML da análise
    generateAnalysisHTML(data) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const currentTime = new Date().toLocaleTimeString('pt-BR');

        return `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #00B5B8; padding-bottom: 20px;">
                <h1 style="color: #00B5B8; font-size: 28px; margin-bottom: 10px;">ARKAD AI</h1>
                <h2 style="color: #333; font-size: 22px; margin-bottom: 5px;">Relatório de Análise de IA</h2>
                <p style="color: #666; font-size: 14px;">Gerado em ${currentDate} às ${currentTime}</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                    Resumo da Análise
                </h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 0; font-size: 16px; line-height: 1.5;">${data.summary || 'Análise realizada com sucesso pela IA.'}</p>
                </div>
            </div>

            ${data.results ? this.generateResultsSection(data.results) : ''}
            ${data.recommendations ? this.generateRecommendationsSection(data.recommendations) : ''}
            ${data.data ? this.generateDataSection(data.data) : ''}
            ${data.charts ? this.generateChartsSection(data.charts) : ''}

            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                <div style="text-align: center; color: #666; font-size: 12px;">
                    <p>Relatório gerado automaticamente pelo sistema ARKAD AI</p>
                    <p>Para mais informações, acesse: <strong>arkad.ai</strong></p>
                </div>
            </div>
        `;
    }

    // Seção de resultados
    generateResultsSection(results) {
        if (!results || results.length === 0) return '';

        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                    Resultados Detalhados
                </h3>
                <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                    ${results.map((result, index) => `
                        <div style="padding: 15px; border-bottom: 1px solid #e9ecef; ${index === results.length - 1 ? 'border-bottom: none;' : ''}">
                            <h4 style="color: #333; font-size: 16px; margin-bottom: 8px;">${result.title || `Resultado ${index + 1}`}</h4>
                            <p style="color: #666; margin: 0; font-size: 14px;">${result.description || result.content}</p>
                            ${result.value ? `<p style="color: #00B5B8; font-weight: bold; margin: 8px 0 0 0;">Valor: ${result.value}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Seção de recomendações
    generateRecommendationsSection(recommendations) {
        if (!recommendations || recommendations.length === 0) return '';

        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                    Recomendações da IA
                </h3>
                <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; border-radius: 0 8px 8px 0;">
                    ${recommendations.map((rec, index) => `
                        <div style="margin-bottom: 10px;">
                            <span style="background: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 10px;">
                                ${index + 1}
                            </span>
                            <span style="color: #333; font-size: 14px;">${rec}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Seção de dados
    generateDataSection(data) {
        if (!data) return '';

        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                    Dados Analisados
                </h3>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 12px; color: #333; white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        `;
    }

    // Seção de gráficos (se houver)
    generateChartsSection(charts) {
        if (!charts || charts.length === 0) return '';

        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                    Visualizações
                </h3>
                <div style="text-align: center; color: #666; font-style: italic;">
                    <p>Gráficos e visualizações serão incluídos na versão web do relatório.</p>
                </div>
            </div>
        `;
    }

    // Gerar PDF para chat/conversa
    generateChatPDF(chatData, options = {}) {
        try {
            const config = { ...this.defaultConfig, ...options };
            const filename = options.filename || `Chat_IA_${new Date().toISOString().split('T')[0]}.pdf`;
            config.filename = filename;

            const element = this.createChatElement(chatData);
            
            return html2pdf().set(config).from(element).save().then(() => {
                return {
                    success: true,
                    message: `PDF do chat gerado: ${filename}`,
                    filename: filename
                };
            });

        } catch (error) {
            console.error('Erro ao gerar PDF do chat:', error);
            return Promise.resolve({
                success: false,
                message: 'Erro ao gerar PDF do chat',
                error: error
            });
        }
    }

    // Criar elemento HTML para chat
    createChatElement(chatData) {
        const element = document.createElement('div');
        element.style.cssText = `
            padding: 20px;
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        `;

        element.innerHTML = this.generateChatHTML(chatData);
        return element;
    }

    // Gerar HTML do chat
    generateChatHTML(data) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const currentTime = new Date().toLocaleTimeString('pt-BR');

        return `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #00B5B8; padding-bottom: 20px;">
                <h1 style="color: #00B5B8; font-size: 28px; margin-bottom: 10px;">ARKAD AI</h1>
                <h2 style="color: #333; font-size: 22px; margin-bottom: 5px;">Histórico de Conversa</h2>
                <p style="color: #666; font-size: 14px;">Gerado em ${currentDate} às ${currentTime}</p>
            </div>

            <div style="margin-bottom: 25px;">
                <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                    Conversa com a IA
                </h3>
                <div style="background: #fff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
                    ${data.messages ? data.messages.map((message, index) => `
                        <div style="padding: 15px; border-bottom: 1px solid #e9ecef; ${index === data.messages.length - 1 ? 'border-bottom: none;' : ''}">
                            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                                <span style="background: ${message.type === 'user' ? '#00B5B8' : '#6c757d'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 10px;">
                                    ${message.type === 'user' ? 'USUÁRIO' : 'IA'}
                                </span>
                                <span style="color: #666; font-size: 12px;">${message.timestamp || 'Agora'}</span>
                            </div>
                            <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5;">${message.content}</p>
                        </div>
                    `).join('') : '<p style="text-align: center; color: #666; font-style: italic;">Nenhuma mensagem encontrada</p>'}
                </div>
            </div>

            ${data.summary ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #00B5B8; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #00B5B8; padding-left: 10px;">
                        Resumo da Conversa
                    </h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.5;">${data.summary}</p>
                    </div>
                </div>
            ` : ''}

            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                <div style="text-align: center; color: #666; font-size: 12px;">
                    <p>Conversa exportada pelo sistema ARKAD AI</p>
                    <p>Para mais informações, acesse: <strong>arkad.ai</strong></p>
                </div>
            </div>
        `;
    }

    // Gerar PDF genérico com HTML customizado
    generateCustomPDF(htmlContent, options = {}) {
        try {
            const config = { ...this.defaultConfig, ...options };
            const filename = options.filename || `Documento_ARKAD_${new Date().toISOString().split('T')[0]}.pdf`;
            config.filename = filename;

            const element = document.createElement('div');
            element.style.cssText = `
                padding: 20px;
                font-family: 'Inter', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
            `;
            element.innerHTML = htmlContent;
            
            return html2pdf().set(config).from(element).save().then(() => {
                return {
                    success: true,
                    message: `PDF customizado gerado: ${filename}`,
                    filename: filename
                };
            });

        } catch (error) {
            console.error('Erro ao gerar PDF customizado:', error);
            return Promise.resolve({
                success: false,
                message: 'Erro ao gerar PDF customizado',
                error: error
            });
        }
    }

    // Método utilitário para adicionar cabeçalho padrão
    addDefaultHeader(content, title = 'Relatório ARKAD AI') {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const currentTime = new Date().toLocaleTimeString('pt-BR');

        return `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #00B5B8; padding-bottom: 20px;">
                <h1 style="color: #00B5B8; font-size: 28px; margin-bottom: 10px;">ARKAD AI</h1>
                <h2 style="color: #333; font-size: 22px; margin-bottom: 5px;">${title}</h2>
                <p style="color: #666; font-size: 14px;">Gerado em ${currentDate} às ${currentTime}</p>
            </div>
            ${content}
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e9ecef;">
                <div style="text-align: center; color: #666; font-size: 12px;">
                    <p>Documento gerado pelo sistema ARKAD AI</p>
                    <p>Para mais informações, acesse: <strong>arkad.ai</strong></p>
                </div>
            </div>
        `;
    }

    // Gerar PDF de documento legal (Política de Privacidade, Aviso Legal, etc)
    async generateLegalDocumentPDF(title, content, filename) {
        try {
            const config = { ...this.defaultConfig };
            config.filename = filename;

            const element = document.createElement('div');
            element.style.cssText = `
                padding: 15px 20px;
                font-family: 'Inter', Arial, sans-serif;
                line-height: 1.7;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
            `;

            const currentDate = new Date().toLocaleDateString('pt-BR');
            
            element.innerHTML = `
                <div style="text-align: center; margin-bottom: 25px; border-bottom: 3px solid #00B5B8; padding-bottom: 15px;">
                    <h1 style="color: #00B5B8; font-size: 26px; margin: 0 0 8px 0; font-weight: 700;">ARKAD AI</h1>
                    <h2 style="color: #333; font-size: 20px; margin: 0 0 8px 0; font-weight: 600;">${title}</h2>
                    <p style="color: #666; font-size: 12px; margin: 0;">Documento gerado em ${currentDate}</p>
                </div>

                <div style="text-align: justify; font-size: 13px; line-height: 1.6;">
                    ${this.formatLegalContent(content)}
                </div>

                <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #e9ecef; text-align: center;">
                    <p style="color: #666; font-size: 11px; margin: 5px 0;">Arkad.ia Inteligência Artificial</p>
                    <p style="color: #666; font-size: 11px; margin: 5px 0;">contato@arkad.ai | Santo André – SP</p>
                </div>
            `;

            return await html2pdf().set(config).from(element).save().then(() => {
                return {
                    success: true,
                    message: `PDF gerado: ${filename}`,
                    filename: filename
                };
            });

        } catch (error) {
            console.error('Erro ao gerar PDF legal:', error);
            return {
                success: false,
                message: 'Erro ao gerar documento legal',
                error: error
            };
        }
    }

    // Formatar conteúdo legal para HTML
    formatLegalContent(content) {
        // Converter quebras de linha em parágrafos
        const lines = content.split('\n');
        let html = '';
        let inList = false;

        for (let line of lines) {
            line = line.trim();
            
            if (!line) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                continue;
            }

            // Identificar títulos (linhas que começam com números seguidos de ponto)
            if (/^\d+\.\s/.test(line)) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<h3 style="color: #00B5B8; font-size: 15px; margin: 18px 0 10px 0; font-weight: 600;">${line}</h3>`;
            }
            // Identificar sub-items (a), b), c), etc)
            else if (/^[a-z]\)\s/.test(line)) {
                if (!inList) {
                    html += '<ul style="margin: 8px 0; padding-left: 25px;">';
                    inList = true;
                }
                html += `<li style="margin: 5px 0;">${line.substring(3)}</li>`;
            }
            // Identificar sub-numeração (1.1, 1.2, etc)
            else if (/^\d+\.\d+\.?\s/.test(line)) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<h4 style="color: #333; font-size: 14px; margin: 12px 0 8px 0; font-weight: 600;">${line}</h4>`;
            }
            // Linha normal
            else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<p style="margin: 8px 0; text-align: justify;">${line}</p>`;
            }
        }

        if (inList) {
            html += '</ul>';
        }

        return html;
    }

    // Carregar e gerar PDF de arquivo de texto
    async loadAndGenerateLegalPDF(filepath, title, filename) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`Não foi possível carregar ${filepath}`);
            }
            const content = await response.text();
            return await this.generateLegalDocumentPDF(title, content, filename);
        } catch (error) {
            console.error(`Erro ao carregar documento ${filepath}:`, error);
            return {
                success: false,
                message: `Erro ao carregar documento: ${title}`,
                error: error
            };
        }
    }
}

// Instância global do gerador de PDF
window.pdfGenerator = new PDFGenerator();

// Funções de conveniência para uso direto
window.generateAIPDF = (data, options) => window.pdfGenerator.generateAIAnalysisPDF(data, options);
window.generateChatPDF = (data, options) => window.pdfGenerator.generateChatPDF(data, options);
window.generateCustomPDF = (html, options) => window.pdfGenerator.generateCustomPDF(html, options);

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}
