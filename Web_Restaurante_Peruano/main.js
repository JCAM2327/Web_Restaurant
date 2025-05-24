// Carrusel de imágenes
let current = 0;
const images = document.querySelectorAll('.carousel-img');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

function showImage(idx) {
    images.forEach((img, i) => img.classList.toggle('active', i === idx));
}
prevBtn.onclick = () => {
    current = (current - 1 + images.length) % images.length;
    showImage(current);
};
nextBtn.onclick = () => {
    current = (current + 1) % images.length;
    showImage(current);
};
setInterval(() => {
    current = (current + 1) % images.length;
    showImage(current);
}, 4000);

// Formulario de contacto (simulado)
document.getElementById('contact-form').onsubmit = function(e) {
    e.preventDefault();
    alert('¡Gracias por contactarnos! Te responderemos pronto.');
    this.reset();
};

// Vale de descuento
document.getElementById('vale-descuento-btn').onclick = function() {
    alert('¡Felicidades! Usa el código PERUSABOR para 10% de descuento en tu primer pedido.');
};

// Botón de pedido rápido
document.querySelectorAll('.pedido-btn').forEach(btn => {
    btn.onclick = () => {
        window.open('https://wa.me/51999999999?text=¡Quiero%20hacer%20un%20pedido%20de%20comida%20peruana!', '_blank');
    };
});

// Botón modo nocturno (funciona correctamente y solo uno)
document.getElementById('modo-nocturno-btn').addEventListener('click', function() {
    document.body.classList.toggle('modo-nocturno');
    if (document.body.classList.contains('modo-nocturno')) {
        localStorage.setItem('modoNocturno', '1');
    } else {
        localStorage.removeItem('modoNocturno');
    }
});
if (localStorage.getItem('modoNocturno') === '1') {
    document.body.classList.add('modo-nocturno');
}
