// Cliente para API do Google Gemini
// Este arquivo busca a configuração do servidor e fornece funções para interagir com a API

class GeminiClient {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.initialized = false;
    }

    // Inicializa o cliente buscando a API key do servidor
    async initialize() {
        if (this.initialized) return true;
        
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            this.apiKey = config.geminiApiKey;
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Erro ao inicializar GeminiClient:', error);
            return false;
        }
    }

    // Gera conteúdo usando o modelo Gemini
    async generateContent(prompt, model = 'gemini-1.5-flash') {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.apiKey) {
            throw new Error('API key não configurada');
        }

        try {
            const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro na API: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return this.parseResponse(data);
        } catch (error) {
            console.error('Erro ao gerar conteúdo:', error);
            throw error;
        }
    }

    // Gera conteúdo com streaming (para respostas longas)
    async *generateContentStream(prompt, model = 'gemini-1.5-flash') {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.apiKey) {
            throw new Error('API key não configurada');
        }

        try {
            const url = `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
                
                for (const line of lines) {
                    const jsonStr = line.slice(6); // Remove 'data: '
                    if (jsonStr.trim()) {
                        try {
                            const data = JSON.parse(jsonStr);
                            const text = this.parseResponse(data);
                            if (text) yield text;
                        } catch (e) {
                            console.warn('Erro ao parsear chunk:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao gerar conteúdo (stream):', error);
            throw error;
        }
    }

    // Parseia a resposta da API
    parseResponse(data) {
        try {
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    return candidate.content.parts[0].text;
                }
            }
            return null;
        } catch (error) {
            console.error('Erro ao parsear resposta:', error);
            return null;
        }
    }

    // Chat com histórico de conversas
    async chat(messages, model = 'gemini-1.5-flash') {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.apiKey) {
            throw new Error('API key não configurada');
        }

        try {
            const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
            
            const contents = messages.map(msg => ({
                role: msg.role || 'user',
                parts: [{
                    text: msg.content || msg.text || msg.message
                }]
            }));

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contents })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erro na API: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return this.parseResponse(data);
        } catch (error) {
            console.error('Erro no chat:', error);
            throw error;
        }
    }

    // Lista modelos disponíveis
    async listModels() {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.apiKey) {
            throw new Error('API key não configurada');
        }

        try {
            const url = `${this.baseUrl}/models?key=${this.apiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Erro ao listar modelos:', error);
            throw error;
        }
    }
}

// Exporta instância única (singleton)
const geminiClient = new GeminiClient();

// Também exporta a classe para casos de uso avançados
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GeminiClient, geminiClient };
}

