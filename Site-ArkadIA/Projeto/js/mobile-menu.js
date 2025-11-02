/**
 * Mobile Menu Handler
 * Gerencia o menu hambúrguer para dispositivos móveis
 */

(function() {
    'use strict';

    // Criar e adicionar o botão hambúrguer e overlay ao DOM
    function initMobileMenu() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelector('.nav-links');
        
        if (!navbar || !navLinks) {
            console.warn('Mobile Menu: Navbar ou nav-links não encontrado');
            return;
        }

        // Criar botão hambúrguer
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Menu');
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        // Criar overlay
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';

        // Inserir hambúrguer após o logo
        const logo = navbar.querySelector('.logo');
        if (logo && logo.nextSibling) {
            navbar.insertBefore(hamburger, logo.nextSibling);
        } else {
            navbar.appendChild(hamburger);
        }

        // Adicionar overlay ao body
        document.body.appendChild(overlay);

        // Event Listeners
        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Fechar menu ao clicar em links
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) {
                    closeMenu();
                }
            });
        });

        // Fechar menu ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });

        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // Alternar estado do menu
    function toggleMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.nav-overlay');
        const body = document.body;

        if (!hamburger || !navLinks || !overlay) return;

        const isActive = navLinks.classList.contains('active');

        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Abrir menu
    function openMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.nav-overlay');
        const body = document.body;

        if (!hamburger || !navLinks || !overlay) return;

        hamburger.classList.add('active');
        navLinks.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevenir scroll do body
    }

    // Fechar menu
    function closeMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.nav-overlay');
        const body = document.body;

        if (!hamburger || !navLinks || !overlay) return;

        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = ''; // Restaurar scroll do body
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    // Expor funções globalmente se necessário
    window.mobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu
    };

})();

