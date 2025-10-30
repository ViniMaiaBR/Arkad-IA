/**
 * Script para tornar o header transparente quando o usuário rola a página
 */

(function() {
    'use strict';

    // Aguarda o DOM estar completamente carregado
    document.addEventListener('DOMContentLoaded', function() {
        const header = document.querySelector('header');
        
        if (!header) {
            return; // Se não houver header, não faz nada
        }

        // Função para verificar o scroll e aplicar/remover a classe
        function handleScroll() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            // Se o usuário rolar mais de 50px, adiciona a classe para tornar transparente
            if (scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        }

        // Adiciona o listener de scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Chama uma vez ao carregar a página para verificar o estado inicial
        handleScroll();
    });
})();

