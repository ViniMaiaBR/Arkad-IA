// Integração do Gerador de PDF com o Sistema de Chat - ARKAD AI
// Extensão para adicionar funcionalidades de PDF ao chat existente

class ChatPDFIntegration {
    constructor() {
        this.chatHistory = [];
        this.isGeneratingPDF = false;
        this.init();
    }

    init() {
        // Aguardar carregamento do gerador de PDF
        if (typeof window.pdfGenerator === 'undefined') {
            console.warn('PDF Generator não encontrado. Carregando...');
            setTimeout(() => this.init(), 1000);
            return;
        }

        this.setupPDFButtons();
        this.setupChatMonitoring();
        console.log('Chat PDF Integration inicializada');
    }

    // Configurar botões de PDF no chat
    setupPDFButtons() {
        // Adicionar botão de PDF na interface do chat
        this.addPDFButtonToChat();
        
        // Adicionar opções de PDF nas respostas rápidas
        this.addPDFQuickReplies();
    }

    // Adicionar botão de PDF na interface
    addPDFButtonToChat() {
        const chatContainer = document.querySelector('.chat-container') || 
                            document.querySelector('#chatContainer') ||
                            document.querySelector('.messages-container');
        
        if (!chatContainer) return;

        // Criar botão de PDF
        const pdfButton = document.createElement('button');
        pdfButton.className = 'pdf-button';
        pdfButton.innerHTML = '<i class="fas fa-file-pdf"></i> Gerar PDF';
        pdfButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00B5B8, #00a8a8);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 181, 184, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        pdfButton.addEventListener('click', () => this.generateChatPDF());
        pdfButton.addEventListener('mouseenter', () => {
            pdfButton.style.transform = 'translateY(-2px)';
            pdfButton.style.boxShadow = '0 6px 20px rgba(0, 181, 184, 0.4)';
        });
        pdfButton.addEventListener('mouseleave', () => {
            pdfButton.style.transform = 'translateY(0)';
            pdfButton.style.boxShadow = '0 4px 15px rgba(0, 181, 184, 0.3)';
        });

        document.body.appendChild(pdfButton);
    }

    // Adicionar opções rápidas de PDF
    addPDFQuickReplies() {
        // Interceptar função de adicionar respostas rápidas
        const originalAddQuickReply = window.addQuickReply;
        if (typeof originalAddQuickReply === 'function') {
            window.addQuickReply = (option) => {
                originalAddQuickReply(option);
                
                // Adicionar opções de PDF após certas respostas
                if (option.includes('análise') || option.includes('relatório') || option.includes('resultado')) {
                    setTimeout(() => {
                        this.addPDFQuickReply();
                    }, 1000);
                }
            };
        }
    }

    // Adicionar resposta rápida de PDF
    addPDFQuickReply() {
        if (typeof window.addQuickReply === 'function') {
            window.addQuickReply('📄 Gerar PDF do Chat');
        }
    }

    // Monitorar conversas do chat
    setupChatMonitoring() {
        // Interceptar função de adicionar mensagens
        const originalAddMessage = window.addMessage;
        if (typeof originalAddMessage === 'function') {
            window.addMessage = (message, type) => {
                originalAddMessage(message, type);
                
                // Armazenar mensagem no histórico
                this.chatHistory.push({
                    content: message,
                    type: type,
                    timestamp: new Date().toLocaleTimeString('pt-BR'),
                    date: new Date().toLocaleDateString('pt-BR')
                });

                // Limitar histórico a 100 mensagens
                if (this.chatHistory.length > 100) {
                    this.chatHistory = this.chatHistory.slice(-100);
                }
            };
        }
    }

    // Gerar PDF do chat
    async generateChatPDF() {
        if (this.isGeneratingPDF) return;

        this.isGeneratingPDF = true;
        
        try {
            // Mostrar indicador de carregamento
            this.showLoadingIndicator();

            // Preparar dados do chat
            const chatData = {
                messages: this.chatHistory,
                summary: this.generateChatSummary(),
                metadata: {
                    totalMessages: this.chatHistory.length,
                    userMessages: this.chatHistory.filter(m => m.type === 'user').length,
                    aiMessages: this.chatHistory.filter(m => m.type === 'ai').length,
                    sessionDate: new Date().toLocaleDateString('pt-BR'),
                    sessionTime: new Date().toLocaleTimeString('pt-BR')
                }
            };

            // Gerar PDF
            const result = await window.generateChatPDF(chatData, {
                filename: `Chat_ARKAD_AI_${new Date().toISOString().split('T')[0]}.pdf`
            });

            if (result.success) {
                this.showSuccessMessage('PDF do chat gerado com sucesso!');
                
                // Adicionar mensagem no chat
                if (typeof window.addMessage === 'function') {
                    window.addMessage('📄 **PDF do chat gerado!**\n\nO histórico completo da nossa conversa foi salvo em PDF e baixado para seu dispositivo.', 'ai');
                }
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('Erro ao gerar PDF do chat:', error);
            this.showErrorMessage('Erro ao gerar PDF: ' + error.message);
            
            if (typeof window.addMessage === 'function') {
                window.addMessage('❌ **Erro ao gerar PDF**\n\nDesculpe, ocorreu um problema. Tente novamente em alguns instantes.', 'ai');
            }
        } finally {
            this.isGeneratingPDF = false;
            this.hideLoadingIndicator();
        }
    }

    // Gerar resumo do chat
    generateChatSummary() {
        const userMessages = this.chatHistory.filter(m => m.type === 'user');
        const aiMessages = this.chatHistory.filter(m => m.type === 'ai');
        
        if (userMessages.length === 0) {
            return 'Chat iniciado, aguardando interação do usuário.';
        }

        const topics = this.extractTopics();
        const keyInsights = this.extractKeyInsights();
        
        return `Conversa com ${userMessages.length} perguntas e ${aiMessages.length} respostas. ` +
               `Tópicos discutidos: ${topics.join(', ')}. ` +
               `Principais insights: ${keyInsights.join('; ')}.`;
    }

    // Extrair tópicos da conversa
    extractTopics() {
        const topics = new Set();
        const keywords = {
            'dados': ['análise', 'dados', 'métricas', 'estatísticas'],
            'automação': ['automação', 'processo', 'workflow', 'otimização'],
            'IA': ['inteligência artificial', 'machine learning', 'algoritmo', 'modelo'],
            'negócio': ['empresa', 'negócio', 'estratégia', 'crescimento'],
            'técnico': ['sistema', 'tecnologia', 'implementação', 'desenvolvimento']
        };

        this.chatHistory.forEach(message => {
            const content = message.content.toLowerCase();
            Object.entries(keywords).forEach(([topic, words]) => {
                if (words.some(word => content.includes(word))) {
                    topics.add(topic);
                }
            });
        });

        return Array.from(topics);
    }

    // Extrair insights principais
    extractKeyInsights() {
        const insights = [];
        const aiMessages = this.chatHistory.filter(m => m.type === 'ai');
        
        aiMessages.forEach(message => {
            const content = message.content;
            // Procurar por padrões que indicam insights
            if (content.includes('recomendo') || content.includes('sugiro') || 
                content.includes('importante') || content.includes('chave')) {
                insights.push(content.substring(0, 100) + '...');
            }
        });

        return insights.slice(0, 3); // Máximo 3 insights
    }

    // Mostrar indicador de carregamento
    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'pdf-loading-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
        document.body.appendChild(indicator);
    }

    // Ocultar indicador de carregamento
    hideLoadingIndicator() {
        const indicator = document.getElementById('pdf-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Mostrar mensagem de sucesso
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    // Mostrar mensagem de erro
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    // Mostrar mensagem genérica
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            messageDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else {
            messageDiv.style.background = 'linear-gradient(135deg, #dc3545, #e74c3c)';
        }
        
        messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        document.body.appendChild(messageDiv);

        // Remover após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Gerar PDF de análise específica
    async generateAnalysisPDF(analysisData, title = 'Análise de IA') {
        try {
            this.showLoadingIndicator();

            const result = await window.generateAIPDF(analysisData, {
                filename: `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
            });

            if (result.success) {
                this.showSuccessMessage('PDF de análise gerado com sucesso!');
                return result;
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('Erro ao gerar PDF de análise:', error);
            this.showErrorMessage('Erro ao gerar PDF: ' + error.message);
            throw error;
        } finally {
            this.hideLoadingIndicator();
        }
    }

    // Limpar histórico do chat
    clearChatHistory() {
        this.chatHistory = [];
        console.log('Histórico do chat limpo');
    }

    // Obter estatísticas do chat
    getChatStats() {
        return {
            totalMessages: this.chatHistory.length,
            userMessages: this.chatHistory.filter(m => m.type === 'user').length,
            aiMessages: this.chatHistory.filter(m => m.type === 'ai').length,
            sessionDuration: this.calculateSessionDuration(),
            topics: this.extractTopics()
        };
    }

    // Calcular duração da sessão
    calculateSessionDuration() {
        if (this.chatHistory.length === 0) return '0 minutos';
        
        const firstMessage = this.chatHistory[0];
        const lastMessage = this.chatHistory[this.chatHistory.length - 1];
        
        const start = new Date(`${firstMessage.date} ${firstMessage.timestamp}`);
        const end = new Date(`${lastMessage.date} ${lastMessage.timestamp}`);
        
        const diffMs = end - start;
        const diffMinutes = Math.floor(diffMs / 60000);
        
        return `${diffMinutes} minutos`;
    }
}

// Inicializar integração quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        window.chatPDFIntegration = new ChatPDFIntegration();
    }, 1000);
});

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatPDFIntegration;
}
