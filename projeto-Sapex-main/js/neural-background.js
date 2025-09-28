// Adaptado do template neural portfolio

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('neural-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let mouse = { x: 0, y: 0 };
    let animationId;

    // Configuração do canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    // Classe Node para os pontos da rede neural
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 3 + 1;
            this.originalRadius = this.radius;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Keep within bounds
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.radius = this.originalRadius + (100 - distance) / 20;
            } else {
                this.radius = this.originalRadius;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00B5B8'; // Cor primária do ARKAD AI
            ctx.fill();
            
            // Adicionar brilho
            ctx.shadowColor = '#00B5B8';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // Inicializar nós
    function init() {
        nodes = [];
        const nodeCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 10000));
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    }

    // Conectar nós próximos
    function connectNodes() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = 1 - distance / 150;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(0, 181, 184, ${opacity * 0.6})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Loop de animação
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Atualizar e desenhar nós
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Conectar nós
        connectNodes();

        animationId = requestAnimationFrame(animate);
    }

    // Inicializar e começar animação
    init();
    animate();

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Pausar animação quando a aba não está visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    // Cleanup ao sair da página
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
});
