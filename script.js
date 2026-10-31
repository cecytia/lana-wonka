// --- CARRUSEL PRINCIPAL DE 3 SLIDES ---
let slideIndex = 0;
let autoSlideTimer;

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot-item');

    if (slides.length === 0) return;

    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function moveSlide(step) {
    clearInterval(autoSlideTimer);
    slideIndex += step;
    showSlide(slideIndex);
    startAutoSlide();
}

function currentSlide(n) {
    clearInterval(autoSlideTimer);
    slideIndex = n;
    showSlide(slideIndex);
    startAutoSlide();
}

function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000);
}

// --- DESPLAZAMIENTO HORIZONTAL DE GALERÍAS (FLECHAS) ---
function scrollGrid(gridId, distance) {
    const grid = document.getElementById(gridId);
    if (grid) {
        grid.scrollBy({ left: distance, behavior: 'smooth' });
    }
}

// --- MOTOR DEL PROBADOR REALISTA NAIL ART DE UÑAS ---
let canvasStudio, ctxStudio;
let currentShape = 'almendra';
let currentColor = '#ffb7c5';
let currentEffect = 'solido';
let selectedGemType = 'diamante';
let placedGems = []; // Arreglo para guardar las piedras agregadas por la usuaria

function initNailStudio() {
    canvasStudio = document.getElementById('nailStudioCanvas');
    if (!canvasStudio) return;
    ctxStudio = canvasStudio.getContext('2d');

    // Escuchar clic para colocar pedrería en las coordenadas exactas de la uña
    canvasStudio.addEventListener('click', (e) => {
        const rect = canvasStudio.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Agregar la gema
        placedGems.push({ x: x, y: y, type: selectedGemType });
        drawStudioNail();
    });

    drawStudioNail();
}

function drawStudioNail() {
    if (!ctxStudio) return;
    ctxStudio.clearRect(0, 0, canvasStudio.width, canvasStudio.height);

    const centerX = canvasStudio.width / 2;

    // 1. DIBUJAR EL DEDO REALISTA (Piel con sombra y nudillo)
    // Sombra del dedo
    ctxStudio.fillStyle = 'rgba(215, 160, 140, 0.3)';
    ctxStudio.beginPath();
    ctxStudio.ellipse(centerX, 280, 75, 150, 0, 0, Math.PI * 2);
    ctxStudio.fill();

    // Cuerpo del dedo
    const skinGrad = ctxStudio.createLinearGradient(centerX - 60, 0, centerX + 60, 0);
    skinGrad.addColorStop(0, '#e8b89e');
    skinGrad.addColorStop(0.3, '#f5d5c0');
    skinGrad.addColorStop(0.7, '#f8ddcb');
    skinGrad.addColorStop(1, '#dfa58a');

    ctxStudio.fillStyle = skinGrad;
    ctxStudio.beginPath();
    ctxStudio.roundRect(centerX - 60, 160, 120, 260, [45, 45, 0, 0]);
    ctxStudio.fill();

    // Líneas/Arrugas del nudillo
    ctxStudio.strokeStyle = 'rgba(180, 120, 100, 0.4)';
    ctxStudio.lineWidth = 2;
    ctxStudio.beginPath();
    ctxStudio.arc(centerX, 330, 45, Math.PI * 0.8, Math.PI * 0.2, true);
    ctxStudio.stroke();

    // Cutícula (Base de la uña)
    ctxStudio.fillStyle = '#e2a389';
    ctxStudio.beginPath();
    ctxStudio.ellipse(centerX, 185, 42, 18, 0, 0, Math.PI);
    ctxStudio.fill();

    // 2. DIBUJAR LA UÑA SEGÚN LA FORMA SELECCIONADA
    ctxStudio.save();
    ctxStudio.beginPath();

    if (currentShape === 'cuadrada') {
        ctxStudio.roundRect(centerX - 38, 70, 76, 115, [4, 4, 18, 18]);
    } else if (currentShape === 'stiletto') {
        ctxStudio.moveTo(centerX - 38, 180);
        ctxStudio.quadraticCurveTo(centerX - 35, 90, centerX, 30); // Punta afilada
        ctxStudio.quadraticCurveTo(centerX + 35, 90, centerX + 38, 180);
        ctxStudio.closePath();
    } else if (currentShape === 'coffin') {
        ctxStudio.moveTo(centerX - 38, 180);
        ctxStudio.lineTo(centerX - 24, 50); // Punta recortada plana
        ctxStudio.lineTo(centerX + 24, 50);
        ctxStudio.lineTo(centerX + 38, 180);
        ctxStudio.closePath();
    } else { // Almendra (Por defecto)
        ctxStudio.moveTo(centerX - 38, 180);
        ctxStudio.quadraticCurveTo(centerX - 38, 70, centerX, 45);
        ctxStudio.quadraticCurveTo(centerX + 38, 70, centerX + 38, 180);
        ctxStudio.closePath();
    }

    // Clip para aplicar color/efectos solo dentro de la uña
    ctxStudio.clip();

    // 3. APLICAR COLOR / DEGRADADO / EFECTOS
    if (currentEffect === 'french') {
        // Base Nude/Rosa + Punta Blanca
        ctxStudio.fillStyle = '#f2c4b8';
        ctxStudio.fillRect(0, 0, canvasStudio.width, canvasStudio.height);

        ctxStudio.fillStyle = currentColor; // Punta
        ctxStudio.beginPath();
        ctxStudio.arc(centerX, 40, 48, 0, Math.PI * 2);
        ctxStudio.fill();

    } else if (currentEffect === 'ombre') {
        // Ombré Baby Boomer
        const grad = ctxStudio.createLinearGradient(0, 40, 0, 180);
        grad.addColorStop(0, currentColor);
        grad.addColorStop(0.7, '#f7d0c5');
        ctxStudio.fillStyle = grad;
        ctxStudio.fillRect(0, 0, canvasStudio.width, canvasStudio.height);

    } else if (currentEffect === 'glitter') {
        // Base sólida + Chispa de escarcha
        ctxStudio.fillStyle = currentColor;
        ctxStudio.fillRect(0, 0, canvasStudio.width, canvasStudio.height);

        // Chispas de Glitter
        ctxStudio.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 40; i++) {
            let gx = centerX - 35 + Math.random() * 70;
            let gy = 50 + Math.random() * 120;
            let size = Math.random() * 3 + 1;
            ctxStudio.beginPath();
            ctxStudio.arc(gx, gy, size, 0, Math.PI * 2);
            ctxStudio.fill();
        }
    } else {
        // Sólido
        ctxStudio.fillStyle = currentColor;
        ctxStudio.fillRect(0, 0, canvasStudio.width, canvasStudio.height);
    }

    // Brillo 3D Gelish Glossy (Reflejo curvo de luz)
    const glossGrad = ctxStudio.createLinearGradient(centerX - 30, 0, centerX + 30, 0);
    glossGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
    glossGrad.addColorStop(0.3, 'rgba(255,255,255,0.0)');
    glossGrad.addColorStop(1, 'rgba(0,0,0,0.15)');

    ctxStudio.fillStyle = glossGrad;
    ctxStudio.fillRect(0, 0, canvasStudio.width, canvasStudio.height);
    ctxStudio.restore();

    // 4. DIBUJAR TODAS LAS GEMAS / PIEDRAS COLOCADAS
    placedGems.forEach(gem => {
        drawSingleGem(gem.x, gem.y, gem.type);
    });
}

// Dibujar diferentes tipos de Cristales y Decoraciones en 2D/3D
function drawSingleGem(x, y, type) {
    ctxStudio.save();
    ctxStudio.translate(x, y);

    if (type === 'corazon') {
        ctxStudio.fillStyle = '#ff6b8b';
        ctxStudio.beginPath();
        ctxStudio.arc(-4, -2, 5, Math.PI, 0, false);
        ctxStudio.arc(4, -2, 5, Math.PI, 0, false);
        ctxStudio.lineTo(0, 8);
        ctxStudio.closePath();
        ctxStudio.fill();

    } else if (type === 'perla') {
        const pGrad = ctxStudio.createRadialGradient(-2, -2, 1, 0, 0, 7);
        pGrad.addColorStop(0, '#ffffff');
        pGrad.addColorStop(0.8, '#f0e6e8');
        pGrad.addColorStop(1, '#d5c3c8');

        ctxStudio.fillStyle = pGrad;
        ctxStudio.beginPath();
        ctxStudio.arc(0, 0, 7, 0, Math.PI * 2);
        ctxStudio.fill();

    } else if (type === 'estrella') {
        ctxStudio.fillStyle = '#ffd700';
        ctxStudio.beginPath();
        for (let i = 0; i < 5; i++) {
            ctxStudio.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * 8, -Math.sin((18 + i * 72) * Math.PI / 180) * 8);
            ctxStudio.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * 4, -Math.sin((54 + i * 72) * Math.PI / 180) * 4);
        }
        ctxStudio.closePath();
        ctxStudio.fill();

    } else if (type === 'aro') {
        ctxStudio.strokeStyle = '#ffd700';
        ctxStudio.lineWidth = 3;
        ctxStudio.beginPath();
        ctxStudio.arc(0, 0, 9, 0, Math.PI * 2);
        ctxStudio.stroke();

    } else { // Diamante Cristal
        const dGrad = ctxStudio.createRadialGradient(-2, -2, 1, 0, 0, 6);
        dGrad.addColorStop(0, '#ffffff');
        dGrad.addColorStop(0.5, '#e0f7fa');
        dGrad.addColorStop(1, '#80deea');

        ctxStudio.fillStyle = dGrad;
        ctxStudio.beginPath();
        ctxStudio.moveTo(0, -7);
        ctxStudio.lineTo(7, 0);
        ctxStudio.lineTo(0, 7);
        ctxStudio.lineTo(-7, 0);
        ctxStudio.closePath();
        ctxStudio.fill();
        ctxStudio.strokeStyle = 'white';
        ctxStudio.stroke();
    }

    ctxStudio.restore();
}

// --- CONTROLES INTERACTIVOS DEL ESTUDIO ---
function setStudioShape(shape, evt) {
    currentShape = shape;
    updateActiveBtn(evt);
    drawStudioNail();
}

function setStudioColor(color, evt) {
    currentColor = color;
    if (evt) {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        evt.target.classList.add('active');
    }
    drawStudioNail();
}

function setStudioEffect(effect, evt) {
    currentEffect = effect;
    updateActiveBtn(evt);
    drawStudioNail();
}

function selectGemType(type, evt) {
    selectedGemType = type;
    if (evt) {
        document.querySelectorAll('.gem-select-btn').forEach(b => b.classList.remove('active'));
        evt.currentTarget.classList.add('active');
    }
}

function clearGems() {
    placedGems = [];
    drawStudioNail();
}

function updateActiveBtn(evt) {
    if (!evt) return;
    const parent = evt.target.parentElement;
    parent.querySelectorAll('.btn-st').forEach(b => b.classList.remove('active'));
    evt.target.classList.add('active');
}

// --- ENVÍO DIRECTO A WHATSAPP ---
function sendWhatsApp() {
    const nombre = document.getElementById('nombre').value;
    const servicio = document.getElementById('servicio').value;
    const notas = document.getElementById('notas').value;

    if (!nombre) {
        alert('Por favor coloca tu nombre.');
        return;
    }

    const mensaje = `¡Hola Frida! Mi nombre es ${nombre}. Me gustaría agendar una cita para *${servicio}*. Notas: ${notas}`;
    const url = `https://api.whatsapp.com/send?phone=525630926271&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// --- DETECTOR SCROLL HEADER ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (header) {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Inicialización general
document.addEventListener('DOMContentLoaded', () => {
    showSlide(slideIndex);
    startAutoSlide();
    initNailStudio();
});
// --- ANIMACIÓN AL HACER SCROLL (EFECTO DE BAJADA REVEAL) ---
function setupScrollReveal() {
    // Seleccionar automáticamente todas las secciones y tarjetas principales
    const elementsToAnimate = document.querySelectorAll('.section, .galeria-card, .card-service-box, .plan-card, .review-card');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.12 // Se activa cuando el 12% del elemento es visible en pantalla
    });

    elementsToAnimate.forEach(el => observer.observe(el));
}

// Inicializar la animación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveal();
});