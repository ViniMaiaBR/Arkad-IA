// Baixar documento legal em PDF (carrega TXT e converte para PDF)
async function downloadLegalPDF(filename, title) {
    try {
        console.group(`🔍 DEBUG: Carregando documento "${title}"`);
        console.log(`📄 Arquivo: "${filename}"`);
        console.log(`🌐 Protocolo: ${window.location.protocol}`);
        console.log(`📍 URL atual: ${window.location.href}`);
        console.log(`📁 Caminho atual: ${window.location.pathname}`);

        // Verificar se está rodando em file:// (não funciona com fetch)
        if (window.location.protocol === 'file:') {
            console.error('❌ ERRO: Arquivo aberto via file:// protocol');
            
            // Criar mensagem de ajuda detalhada
            const helpMessage = `
⚠️ SERVIDOR HTTP NECESSÁRIO

Este site precisa ser servido por um servidor HTTP local.
O protocolo file:// não permite carregar arquivos via fetch().

📋 SOLUÇÕES RÁPIDAS:

1️⃣ WINDOWS (Mais fácil):
   - Clique duas vezes em: start-server.bat
   - Ou execute no PowerShell:
     cd "${window.location.pathname.split('/').slice(0, -2).join('/')}"
     python -m http.server 8000

2️⃣ LINUX/MAC:
   - Execute: ./start-server.sh
   - Ou no terminal:
     cd "${window.location.pathname.split('/').slice(0, -2).join('/')}"
     python3 -m http.server 8000

3️⃣ VS CODE:
   - Instale extensão "Live Server"
   - Clique com botão direito no HTML > "Open with Live Server"

4️⃣ NODE.JS:
   - npx http-server -p 8000

🌐 Depois acesse: http://localhost:8000/Index/documentos.html

📝 Arquivos de servidor criados em:
   - start-server.bat (Windows)
   - start-server.sh (Linux/Mac)
            `.trim();

            alert(helpMessage);
            console.groupEnd();
            return;
        }

        // Calcular caminho relativo baseado na estrutura
        const currentPath = window.location.pathname;
        const isInIndexFolder = currentPath.includes('/Index/') || currentPath.endsWith('/Index');
        
        // Caminhos base para tentar (baseado na estrutura real)
        const basePaths = isInIndexFolder 
            ? [
                '../documentos-legais/',
                './documentos-legais/',
                '../Projeto/documentos-legais/',
                'documentos-legais/'
            ]
            : [
                './documentos-legais/',
                'documentos-legais/',
                '../documentos-legais/'
            ];

        // Variações de encoding do nome do arquivo
        const filenameVariations = [
            filename,                                          // Original
            encodeURIComponent(filename),                      // Full encoding
            filename.replace(/ /g, '%20'),                     // Espaços
            filename.replace(/\(/g, '%28').replace(/\)/g, '%29'), // Parênteses
            encodeURI(filename),                               // URI encoding
            filename.replace(/ /g, '+')                         // Espaços como +
        ];

        console.log(`📂 Caminhos base a tentar:`, basePaths);
        console.log(`🔤 Variações de encoding:`, filenameVariations);

        let content = null;
        let successPath = null;
        let lastError = null;
        let attemptCount = 0;

        // Tentar todas as combinações de path + encoding
        outerLoop: for (const basePath of basePaths) {
            for (const fileVariation of filenameVariations) {
                const path = `${basePath}${fileVariation}`;
                attemptCount++;
                
                try {
                    console.log(`  [${attemptCount}] Tentando: ${path}`);
                    const response = await fetch(path, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/plain, text/*, */*'
                        },
                        cache: 'no-cache'
                    });
                    
                    console.log(`    Status: ${response.status} ${response.statusText}`);
                    
                    if (response.ok) {
                        const text = await response.text();
                        if (text && text.trim().length > 0) {
                            content = text;
                            successPath = path;
                            console.log(`  ✅ SUCESSO em: ${path}`);
                            console.log(`  📊 Conteúdo: ${content.length} caracteres`);
                            break outerLoop;
                        } else {
                            console.warn(`    ⚠️ Resposta OK mas conteúdo vazio`);
                        }
                    } else {
                        console.warn(`    ❌ Status ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    lastError = error;
                    console.warn(`    ❌ Erro: ${error.message}`);
                }
            }
        }

        if (!content) {
            console.error(`❌ FALHA: Arquivo não encontrado após ${attemptCount} tentativas`);
            console.error(`📄 Arquivo procurado: "${filename}"`);
            console.error(`📋 Último erro:`, lastError);
            console.groupEnd();
            
            alert(`❌ Erro: Não foi possível carregar o documento "${title}".\n\n` +
                  `Arquivo: ${filename}\n\n` +
                  `Tentativas: ${attemptCount}\n\n` +
                  `Verifique:\n` +
                  `1. Se o arquivo existe em documentos-legais/\n` +
                  `2. Se está usando um servidor HTTP (não file://)\n` +
                  `3. Abra o console (F12) para mais detalhes`);
            return;
        }

        console.log(`✅ Arquivo carregado com sucesso!`);
        console.log(`📍 Caminho usado: ${successPath}`);
        console.log(`📊 Tamanho: ${content.length} caracteres`);
        console.groupEnd();

        const pdfFilename = title.replace(/\s+/g, '_').replace(/[()]/g, '') + ".pdf";

        // ✅ Usa o gerador global definido no pdf-generator.js
        if (window.pdfGenerator) {
            console.log(`📦 Gerando PDF via pdfGenerator...`);
            const result = await window.pdfGenerator.generateLegalDocumentPDF(title, content, pdfFilename);
            if (result && result.success) {
                console.log(`✅ PDF gerado com sucesso: ${pdfFilename}`);
            } else {
                console.error(`❌ Erro ao gerar PDF:`, result);
                throw new Error(result?.message || 'Erro desconhecido ao gerar PDF');
            }
        } else {
            // Fallback de segurança
            console.warn('⚠️ pdfGenerator não encontrado, usando fallback jsPDF');
            if (!window.jspdf) {
                throw new Error('jsPDF não está disponível');
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text(title, 10, 10);
            doc.text(content.substring(0, 1000), 10, 20);
            doc.save(pdfFilename);
        }
    } catch (error) {
        console.error("❌ Erro ao gerar PDF:", error);
        console.error("Stack trace:", error.stack);
        alert(`❌ Erro ao gerar PDF:\n\n${error.message}\n\nVerifique o console (F12) para mais detalhes.`);
    }
}

// Função de teste para diagnosticar problemas
async function testDocumentAccess() {
    console.group('🧪 TESTE: Diagnóstico de Acesso a Documentos');
    console.log('🌐 Protocolo:', window.location.protocol);
    console.log('📍 URL:', window.location.href);
    console.log('📁 Pathname:', window.location.pathname);
    
    const testFile = 'AvisoLegal.txt';
    const testPaths = [
        '../documentos-legais/' + testFile,
        './documentos-legais/' + testFile,
        'documentos-legais/' + testFile,
        '/documentos-legais/' + testFile
    ];
    
    console.log('📋 Testando arquivo:', testFile);
    
    for (const path of testPaths) {
        try {
            const response = await fetch(path);
            console.log(`  ${path}: ${response.status} ${response.statusText}`);
            if (response.ok) {
                const text = await response.text();
                console.log(`    ✅ Sucesso! Tamanho: ${text.length} caracteres`);
            }
        } catch (error) {
            console.log(`  ${path}: ❌ ${error.message}`);
        }
    }
    
    console.groupEnd();
}

// Expor função de teste globalmente para uso no console
window.testDocumentAccess = testDocumentAccess;

// Baixar todos os documentos em PDF
async function downloadAllPDFs(docsList) {
    const docs = docsList || legalDocuments;
    
    if (!docs || docs.length === 0) {
        alert('Nenhum documento disponível para download.');
        return;
    }

    const confirmMsg = `Deseja baixar todos os ${docs.length} documentos em PDF?\n\nOs downloads serão iniciados sequencialmente.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    try {
        let loadedCount = 0;
        let failedCount = 0;

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            
            if (doc.filename) {
                // Aguardar um pouco entre downloads para não sobrecarregar
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                try {
                    await downloadLegalPDF(doc.filename, doc.title);
                    loadedCount++;
                } catch (error) {
                    console.warn(`Não foi possível baixar: ${doc.filename}`);
                    failedCount++;
                }
            } else {
                console.warn(`Documento sem arquivo: ${doc.title}`);
                failedCount++;
            }
        }

        // Mostrar resultado
        if (loadedCount > 0) {
            alert(`Download concluído!\n\n${loadedCount} documento(s) baixado(s) com sucesso.${failedCount > 0 ? `\n${failedCount} documento(s) não puderam ser baixados.` : ''}`);
        } else {
            alert('Nenhum documento pôde ser baixado. Por favor, verifique os arquivos.');
        }
    } catch (error) {
        console.error('Erro ao baixar todos os PDFs:', error);
        alert('Erro ao baixar os documentos. Por favor, tente novamente.');
    }
}

