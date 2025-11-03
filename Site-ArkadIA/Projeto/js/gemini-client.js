// Cliente para API do Google Gemini
// Este arquivo busca a configuração do servidor e fornece funções para interagir com a API

class GeminiClient {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.initialized = false;
    }

    // Inicializa o cliente buscando a API key do config local
    async initialize() {
        if (this.initialized) return true;
        
        try {
            // Aguardar APP_CONFIG estar disponível (mais tempo de espera)
            let attempts = 0;
            while (!window.APP_CONFIG && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }
            
            if (!window.APP_CONFIG) {
                console.error('❌ Configuração APP_CONFIG não carregada após 6 segundos');
                console.error('❌ Verifique se o arquivo config.js está sendo carregado corretamente');
                this.initialized = false;
                return false;
            }
            
            if (window.APP_CONFIG.api && window.APP_CONFIG.api.geminiApiKey) {
                this.apiKey = window.APP_CONFIG.api.geminiApiKey;
                
                console.log('🔍 API Key encontrada:', this.apiKey.substring(0, 20) + '...');
                
                // Verificar se API key foi configurada
                if (this.apiKey === 'SUA_API_KEY_AQUI' || !this.apiKey || this.apiKey.length < 20) {
                    console.warn('⚠️ API Key do Gemini não configurada ou inválida');
                    console.warn('📖 Configure em js/config.js');
                    console.warn('📖 Obtenha sua API key em: https://makersuite.google.com/app/apikey');
                    this.initialized = false;
                    return false;
                }
                
                this.initialized = true;
                console.log('✅ Gemini Client inicializado com sucesso');
                console.log('📊 Modelo:', window.APP_CONFIG.api.geminiModel || 'gemini-2.5-pro');
                return true;
            } else {
                console.error('❌ APP_CONFIG.api.geminiApiKey não encontrado');
                console.error('❌ Estrutura do APP_CONFIG:', window.APP_CONFIG);
                this.initialized = false;
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar GeminiClient:', error);
            this.initialized = false;
            return false;
        }
    }

    // Gera conteúdo usando o modelo Gemini
    async generateContent(prompt, model = 'gemini-2.5-pro') {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.apiKey) {
            throw new Error('API key não configurada');
        }

        try {
            const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
            
            // Obter configurações de geração
            const generationConfig = window.APP_CONFIG?.api?.generationConfig || {};
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            };
            
            // Adicionar maxOutputTokens se configurado
            if (generationConfig.maxOutputTokens) {
                requestBody.generationConfig = {
                    maxOutputTokens: generationConfig.maxOutputTokens
                };
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
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
    async *generateContentStream(prompt, model = 'gemini-2.5-pro') {
        if (!this.initialized) {
            await this.initialize();
        }

        if (!this.apiKey) {
            throw new Error('API key não configurada');
        }

        try {
            const url = `${this.baseUrl}/models/${model}:streamGenerateContent?key=${this.apiKey}&alt=sse`;
            
            // Obter configurações de geração
            const generationConfig = window.APP_CONFIG?.api?.generationConfig || {};
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            };
            
            // Adicionar maxOutputTokens se configurado
            if (generationConfig.maxOutputTokens) {
                requestBody.generationConfig = {
                    maxOutputTokens: generationConfig.maxOutputTokens
                };
            }
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
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
    async chat(messages, model = 'gemini-2.5-pro') {
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

            // Obter configurações de geração
            const generationConfig = window.APP_CONFIG?.api?.generationConfig || {};
            
            const requestBody = { contents };
            
            // Adicionar maxOutputTokens se configurado
            if (generationConfig.maxOutputTokens) {
                requestBody.generationConfig = {
                    maxOutputTokens: generationConfig.maxOutputTokens
                };
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
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

