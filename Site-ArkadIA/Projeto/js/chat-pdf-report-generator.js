// Gerador de PDF para Relatórios de Análise - Baseado em Documentacao/prompts_txt/ExemploRelatorio.txt
// Gera relatórios profissionais em PDF a partir das conversas do chat

class ChatPDFReportGenerator {
    constructor() {
        this.defaultTemplate = this.loadDefaultTemplate();
    }

    // Template baseado em Documentacao/prompts_txt/ExemploRelatorio.txt
    loadDefaultTemplate() {
        return {
            title: 'Relatório Estratégico Arkad AI',
            subtitle: 'Análise Empresarial Completa',
            sections: [
                'objetivo',
                'diagnostico',
                'estrategia',
                'plano',
                'stack',
                'riscos',
                'projecao',
                'conclusao'
            ]
        };
    }

    // Gerar relatório em PDF
    async generatePDFReport(conversationData, userData) {
        try {
            console.log('📄 Gerando relatório PDF...');

            // Extrair informações da conversa
            const reportData = this.extractReportData(conversationData, userData);

            // Criar estrutura HTML do relatório
            const reportHTML = this.createReportHTML(reportData);

            // Configurações do PDF
            const opt = {
                margin: [15, 15, 15, 15],
                filename: `Relatorio_Arkad_${this.getFormattedDate()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            // Gerar PDF usando html2pdf
            if (typeof html2pdf !== 'undefined') {
                await html2pdf().set(opt).from(reportHTML).save();
                console.log('✅ PDF gerado com sucesso');
                return {
                    success: true,
                    filename: opt.filename,
                    message: '📄 Relatório PDF gerado e baixado com sucesso!'
                };
            } else {
                throw new Error('Biblioteca html2pdf não carregada');
            }

        } catch (error) {
            console.error('❌ Erro ao gerar PDF:', error);
            return {
                success: false,
                error: error.message,
                message: '❌ Erro ao gerar PDF. Por favor, tente novamente.'
            };
        }
    }

    // Extrair dados relevantes da conversa
    extractReportData(conversationData, userData) {
        const userInfo = userData || JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        // Extrair informações da conversa
        let businessGoal = 'Análise empresarial estratégica';
        let sector = 'Consultoria Empresarial';
        let analysisText = '';
        let recommendations = [];
        let budget = { initial: 'A definir', monthly: 'A definir', projected: 'A definir' };

        // Processar histórico da conversa
        if (conversationData && conversationData.fullConversation) {
            analysisText = conversationData.summary || this.extractMainAnalysis(conversationData.fullConversation);
            
            // Tentar extrair informações específicas
            conversationData.fullConversation.forEach(msg => {
                if (msg.role === 'user') {
                    const content = msg.content.toLowerCase();
                    if (content.includes('tecnologia') || content.includes('ti')) {
                        sector = 'Tecnologia da Informação (TI)';
                    } else if (content.includes('varejo') || content.includes('comércio')) {
                        sector = 'Comércio Varejista';
                    } else if (content.includes('marketing')) {
                        sector = 'Serviços de Marketing Digital';
                    } else if (content.includes('indústria')) {
                        sector = 'Indústria de Transformação';
                    }
                }
            });
        }

        return {
            client: userInfo.nome || 'Cliente Arkad',
            company: 'Arkad AI Consultoria',
            date: this.getFormattedDate(),
            consultant: 'Arkad AI – Unidade Estratégica de Negócios',
            businessGoal: businessGoal,
            sector: sector,
            analysisText: analysisText,
            recommendations: recommendations,
            budget: budget,
            conversationData: conversationData
        };
    }

    // Extrair análise principal
    extractMainAnalysis(conversation) {
        let analysis = '';
        
        conversation.forEach(msg => {
            if (msg.role === 'model' && msg.content.length > 200) {
                // Provavelmente é uma análise detalhada
                analysis += msg.content + '\n\n';
            }
        });

        return analysis || 'Análise detalhada disponível na conversa completa.';
    }

    // Criar HTML do relatório
    createReportHTML(data) {
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Relatório Arkad AI</title>
    <style>
        @page {
            margin: 20mm;
        }
        
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #00b5b8;
        }
        
        .header h1 {
            color: #00b5b8;
            font-size: 28px;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        
        .header h2 {
            color: #666;
            font-size: 18px;
            margin: 0;
            font-weight: normal;
        }
        
        .meta-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #00b5b8;
        }
        
        .meta-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        
        .meta-info strong {
            color: #00b5b8;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section h3 {
            color: #00b5b8;
            font-size: 20px;
            margin: 20px 0 10px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
        }
        
        .section h4 {
            color: #495057;
            font-size: 16px;
            margin: 15px 0 8px 0;
        }
        
        .content-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
        }
        
        ul, ol {
            margin: 10px 0;
            padding-left: 25px;
        }
        
        li {
            margin: 8px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 14px;
        }
        
        table th {
            background: #00b5b8;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        
        table td {
            padding: 10px 12px;
            border: 1px solid #dee2e6;
        }
        
        table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .highlight {
            background: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .success {
            background: #d4edda;
            padding: 15px;
            border-left: 4px solid #28a745;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .info {
            background: #d1ecf1;
            padding: 15px;
            border-left: 4px solid #00b5b8;
            margin: 15px 0;
            border-radius: 4px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        strong {
            color: #212529;
        }
        
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <!-- CABEÇALHO -->
    <div class="header">
        <h1>Relatório Estratégico Arkad AI</h1>
        <h2>${data.businessGoal}</h2>
    </div>

    <!-- INFORMAÇÕES META -->
    <div class="meta-info">
        <p><strong>Cliente:</strong> ${data.client}</p>
        <p><strong>Empresa:</strong> ${data.company}</p>
        <p><strong>Data:</strong> ${data.date}</p>
        <p><strong>Consultora de IA:</strong> ${data.consultant}</p>
        <p><strong>Setor:</strong> ${data.sector}</p>
    </div>

    <!-- OBJETIVO DO PROJETO -->
    <div class="section">
        <h3>📋 Objetivo do Projeto</h3>
        <p>
            O cliente solicitou à Arkad AI a elaboração de um plano estratégico e financeiro com base em análise de viabilidade, 
            estimativa de custos, previsão de ROI e diretrizes operacionais.
        </p>
        <div class="content-box">
            <p><strong>Meta principal:</strong> ${data.businessGoal}</p>
        </div>
    </div>

    <!-- ANÁLISE PRINCIPAL -->
    <div class="section">
        <h3>📊 Análise e Recomendações</h3>
        <div class="content-box">
            ${this.formatAnalysisText(data.analysisText)}
        </div>
    </div>

    <!-- FRAMEWORK APLICADO -->
    <div class="section">
        <h3>🎯 Framework P.R.O.M.P.T. Aplicado</h3>
        <table>
            <tr>
                <th>Elemento</th>
                <th>Aplicação Prática</th>
            </tr>
            <tr>
                <td><strong>Persona</strong></td>
                <td>Consultora de Estratégia Empresarial com foco em Expansão e Viabilidade Financeira</td>
            </tr>
            <tr>
                <td><strong>Relevância (Contexto)</strong></td>
                <td>${data.sector} - Análise adaptada ao setor específico</td>
            </tr>
            <tr>
                <td><strong>Objetivo (Tarefa)</strong></td>
                <td>Desenvolver plano completo de análise e viabilidade empresarial</td>
            </tr>
            <tr>
                <td><strong>Modalidade (Formato)</strong></td>
                <td>Relatório executivo com projeção financeira e recomendações</td>
            </tr>
            <tr>
                <td><strong>Parâmetros (Restrições)</strong></td>
                <td>Baseado em estimativas de mercado e dados preliminares</td>
            </tr>
            <tr>
                <td><strong>Testes (Refinamento)</strong></td>
                <td>Avaliação contínua e ajustes conforme feedback</td>
            </tr>
        </table>
    </div>

    <!-- ANÁLISE DE RISCOS -->
    <div class="section">
        <h3>⚠️ Análise de Riscos e Mitigações</h3>
        <table>
            <tr>
                <th>Risco</th>
                <th>Impacto</th>
                <th>Mitigação</th>
            </tr>
            <tr>
                <td>Volatilidade do mercado</td>
                <td>Médio</td>
                <td>Diversificação de serviços e clientes</td>
            </tr>
            <tr>
                <td>Falta de capital de giro</td>
                <td>Alto</td>
                <td>Planejamento financeiro rigoroso e reserva de emergência</td>
            </tr>
            <tr>
                <td>Concorrência acirrada</td>
                <td>Médio</td>
                <td>Diferenciação por qualidade e atendimento personalizado</td>
            </tr>
            <tr>
                <td>Mudanças regulatórias</td>
                <td>Baixo</td>
                <td>Acompanhamento constante da legislação com contador</td>
            </tr>
        </table>
    </div>

    <!-- STACK OPERACIONAL -->
    <div class="section">
        <h3>🛠️ Stack Operacional Recomendado</h3>
        <table>
            <tr>
                <th>Categoria</th>
                <th>Tecnologia / Ferramenta</th>
                <th>Finalidade</th>
            </tr>
            <tr>
                <td>CRM</td>
                <td>HubSpot / Bitrix24</td>
                <td>Gestão de clientes e funil de vendas</td>
            </tr>
            <tr>
                <td>Contabilidade</td>
                <td>Conta Azul / Omie</td>
                <td>Gestão financeira e fiscal</td>
            </tr>
            <tr>
                <td>Comunicação</td>
                <td>Google Workspace + Zoom</td>
                <td>Operação híbrida e colaboração</td>
            </tr>
            <tr>
                <td>IA Interna</td>
                <td>Arkad AI + ChatGPT API</td>
                <td>Geração de relatórios e análises</td>
            </tr>
            <tr>
                <td>Infraestrutura</td>
                <td>AWS / Google Cloud</td>
                <td>Hospedagem e backups automáticos</td>
            </tr>
        </table>
    </div>

    <!-- PROJEÇÃO FINANCEIRA -->
    <div class="section">
        <h3>💰 Projeção Financeira Estimada</h3>
        <div class="highlight">
            <p><strong>⚠️ AVISO:</strong> As estimativas abaixo são aproximadas e baseadas em médias de mercado. 
            Para valores precisos, consulte um contador e especialista financeiro.</p>
        </div>
        
        <h4>Investimento Inicial Estimado</h4>
        <ul>
            <li><strong>Legalização:</strong> R$ 1.500 - R$ 3.000</li>
            <li><strong>Equipamentos:</strong> R$ 5.000 - R$ 15.000</li>
            <li><strong>Software:</strong> R$ 2.000 - R$ 5.000</li>
            <li><strong>Marketing Inicial:</strong> R$ 3.000 - R$ 8.000</li>
            <li><strong>Capital de Giro:</strong> R$ 10.000 - R$ 20.000</li>
        </ul>
        
        <h4>Custos Mensais Estimados</h4>
        <ul>
            <li><strong>Pessoal:</strong> R$ 3.000 - R$ 8.000 por funcionário</li>
            <li><strong>Infraestrutura:</strong> R$ 500 - R$ 1.500</li>
            <li><strong>Marketing:</strong> R$ 500 - R$ 2.000</li>
            <li><strong>Serviços:</strong> R$ 500 - R$ 1.500</li>
            <li><strong>Impostos:</strong> 4% - 15% do faturamento</li>
        </ul>
    </div>

    <!-- CONCLUSÃO -->
    <div class="section">
        <h3>✅ Conclusão</h3>
        <div class="success">
            <p>
                A análise conduzida pela Arkad AI indica viabilidade para o projeto proposto, considerando 
                as condições atuais de mercado e as informações fornecidas.
            </p>
            <p>
                <strong>Recomendação final:</strong> Prosseguir com planejamento detalhado, priorizando a 
                validação de mercado e mantendo controle rigoroso do fluxo de caixa inicial.
            </p>
        </div>
        
        <div class="info">
            <h4>📈 Próximos Passos Sugeridos:</h4>
            <ol>
                <li>Consultar contador para definição do regime tributário ideal</li>
                <li>Elaborar plano de negócios detalhado</li>
                <li>Realizar pesquisa de mercado aprofundada</li>
                <li>Estruturar plano financeiro com projeções de 12-24 meses</li>
                <li>Considerar planos avançados da Arkad AI para consultoria contínua</li>
            </ol>
        </div>
    </div>

    <!-- CONFORMIDADE LEGAL -->
    <div class="section">
        <h3>⚖️ Avisos Legais e Conformidade</h3>
        <div class="highlight">
            <h4>📋 Leis Empresariais</h4>
            <p>
                Os custos de legalização e impostos são estimativas. É <strong>fundamental</strong> a orientação 
                de um <strong>contador registrado</strong> para definir o regime tributário ideal (Simples Nacional, 
                Lucro Presumido, etc.) e garantir a conformidade com todas as obrigações fiscais e trabalhistas.
            </p>
            
            <h4>🔒 LGPD (Lei Geral de Proteção de Dados)</h4>
            <p>
                Ao lidar com dados de clientes ou funcionários, sua empresa precisa estar em conformidade com a LGPD. 
                Recomenda-se incluir no orçamento custos para garantir a segurança de dados, como softwares de proteção, 
                consultoria especializada e treinamento da equipe. O não cumprimento pode resultar em multas significativas.
            </p>
            
            <h4>🏢 Custos Imobiliários</h4>
            <p>
                <strong>Importante:</strong> Este relatório <strong>NÃO inclui</strong> custos relacionados ao aluguel 
                ou compra de um imóvel comercial. A escolha do local tem impacto significativo no custo total e deve ser 
                analisada separadamente. Para pesquisa de imóveis, consulte: Zap Imóveis, Viva Real, Imovelweb.
            </p>
        </div>
    </div>

    <!-- RODAPÉ -->
    <div class="footer">
        <p><strong>Contato Arkad AI</strong></p>
        <p>E-mail: contato@arkadia.com | Website: www.arkadia.com</p>
        <p>São Paulo, SP | © ${new Date().getFullYear()} Arkad AI</p>
        <p style="margin-top: 15px;">
            <em>Versão do Relatório: 1.0 (Gerado automaticamente por IA em ${data.date})</em>
        </p>
    </div>
</body>
</html>
        `;
    }

    // Formatar texto da análise
    formatAnalysisText(text) {
        if (!text) return '<p>Análise em andamento...</p>';

        // Converter markdown básico para HTML
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^## (.*$)/gim, '<h3>$1</h3>')
            .replace(/^# (.*$)/gim, '<h2>$1</h2>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/^• (.*$)/gim, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        return `<p>${formatted}</p>`;
    }

    // Obter data formatada
    getFormattedDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Gerar relatório simplificado (TXT)
    generateTextReport(conversationData, userData) {
        const reportData = this.extractReportData(conversationData, userData);
        
        let textReport = `
========================================
RELATÓRIO ESTRATÉGICO ARKAD AI
========================================

Cliente: ${reportData.client}
Empresa: ${reportData.company}
Data: ${reportData.date}
Consultora: ${reportData.consultant}
Setor: ${reportData.sector}

========================================
ANÁLISE E RECOMENDAÇÕES
========================================

${reportData.analysisText}

========================================
AVISOS LEGAIS
========================================

⚠️ AVISO IMPORTANTE: Esta análise é uma estimativa aproximada baseada 
em médias de mercado. Um orçamento preciso requer análise aprofundada 
com profissionais especializados.

📋 Custos imobiliários NÃO estão incluídos nesta análise.

⚖️ Consulte um contador para definição do regime tributário e 
conformidade com LGPD e demais legislações.

========================================
CONTATO ARKAD AI
========================================
E-mail: contato@arkadia.com
Website: www.arkadia.com
Versão: 1.0 (Gerado em ${reportData.date})
========================================
        `;

        // Criar e baixar arquivo TXT
        const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Relatorio_Arkad_${this.getFormattedDate().replace(/\//g, '-')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return {
            success: true,
            message: '📝 Relatório TXT gerado e baixado com sucesso!'
        };
    }
}

// Criar instância global
console.log('📄 Carregando PDF Report Generator...');
window.chatPDFReportGenerator = new ChatPDFReportGenerator();
console.log('✅ PDF Report Generator pronto');

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatPDFReportGenerator;
}

