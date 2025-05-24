// JS para carrito, chat, preguntas frecuentes, cupones, notificaciones, etc.

// --- Carrito de pedidos ---
let carrito = [];
let cuponAplicado = null;
function actualizarCarrito() {
    const lista = document.getElementById('carrito-lista');
    lista.innerHTML = '';
    let total = 0;
    carrito.forEach((item, i) => {
        total += item.precio;
        const li = document.createElement('li');
        li.innerHTML = `${item.nombre} <span>$${item.precio.toLocaleString()}</span> <button onclick="carritoEliminar(${i})" style="background:none;border:none;color:#b71c1c;cursor:pointer;">✖</button>`;
        lista.appendChild(li);
    });
    let totalFinal = total;
    let cuponMsg = '';
    if (cuponAplicado === 'PERU10' && total > 0) {
        totalFinal = Math.round(total * 0.9);
        cuponMsg = 'Cupón PERU10 aplicado (-10%)';
    }
    document.getElementById('carrito-total').innerHTML = 'Total: $' + totalFinal.toLocaleString() + (cuponMsg ? `<br><span style="color:#388e3c;font-size:0.98em;">${cuponMsg}</span>` : '');
    document.getElementById('carrito-count').innerText = carrito.length;
}
function carritoEliminar(idx) {
    carrito.splice(idx, 1);
    actualizarCarrito();
}
document.querySelectorAll('.pedido-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        let card = btn.closest('.plato-card');
        let nombre = card.querySelector('h3').innerText;
        let precio = parseInt(card.querySelector('.precio').innerText.replace(/\D/g, ''));
        carrito.push({nombre, precio});
        actualizarCarrito();
        document.getElementById('carrito-modal').style.display = 'flex';
    });
});
document.getElementById('carrito-toggle-btn').onclick = function() {
    document.getElementById('carrito-modal').style.display = 'flex';
    actualizarCarrito();
};
document.getElementById('carrito-agregar').onclick = function() {
    document.getElementById('carrito-modal').style.display = 'none';
    // El usuario puede seguir navegando y agregando más platos
};
document.getElementById('carrito-vaciar').onclick = function() {
    carrito = [];
    cuponAplicado = null;
    actualizarCarrito();
    document.getElementById('cupon-input').value = '';
    document.getElementById('cupon-msg').innerText = '';
};
document.getElementById('carrito-enviar').onclick = function() {
    if (carrito.length === 0) {
        alert('Debes agregar al menos 1 plato para enviar el pedido.');
        return;
    }
    alert('¡Pedido enviado! Nos contactaremos para coordinar tu compra.');
    carrito = [];
    cuponAplicado = null;
    actualizarCarrito();
    document.getElementById('carrito-modal').style.display = 'none';
    document.getElementById('cupon-input').value = '';
    document.getElementById('cupon-msg').innerText = '';
};

// --- Notificaciones push (simulado) ---
document.getElementById('push-btn').onclick = function() {
    alert('¡Notificaciones activadas! Te avisaremos de nuevas promos.');
};

// --- Valoraciones y comentarios mejorados ---
let valoraciones = [];
document.getElementById('enviar-valoracion').onclick = function() {
    const val = document.getElementById('valoracion-select').value;
    const com = document.getElementById('comentario-input').value.trim();
    if (!val) return alert('Selecciona una calificación.');
    valoraciones.push({val, com, fecha: new Date().toLocaleDateString()});
    mostrarValoraciones();
    document.getElementById('valoracion-select').value = '';
    document.getElementById('comentario-input').value = '';
};
function mostrarValoraciones() {
    const lista = document.getElementById('valoraciones-lista');
    lista.innerHTML = '';
    if (valoraciones.length === 0) {
        lista.innerHTML = '<div style="color:#888;">Sé el primero en dejar tu comentario.</div>';
        return;
    }
    valoraciones.slice(-5).reverse().forEach(v => {
        const div = document.createElement('div');
        div.className = 'comentario';
        div.innerHTML = `<span>${'⭐'.repeat(v.val)}</span> <em style="color:#888;font-size:0.95em;">(${v.fecha})</em><br>${v.com ? v.com : '<span style="color:#bbb;">Sin comentario</span>'}`;
        lista.appendChild(div);
    });
}

// --- Filtro de platos ---
document.getElementById('filtro-region').onchange =
document.getElementById('filtro-tipo').onchange =
document.getElementById('filtro-busqueda').oninput = function() {
    const region = document.getElementById('filtro-region').value.toLowerCase();
    const tipo = document.getElementById('filtro-tipo').value.toLowerCase();
    const busq = document.getElementById('filtro-busqueda').value.toLowerCase();
    document.querySelectorAll('.plato-card').forEach(card => {
        let nombre = card.querySelector('h3').innerText.toLowerCase();
        let show = true;
        if (region && !card.innerHTML.toLowerCase().includes(region)) show = false;
        if (tipo && !card.innerHTML.toLowerCase().includes(tipo)) show = false;
        if (busq && !nombre.includes(busq)) show = false;
        card.style.display = show ? '' : 'none';
    });
};

// --- Preguntas frecuentes: filtros rápidos y buscador ---
const faqPreguntas = Array.from(document.querySelectorAll('#faq-modal .faq-item'));
const faqFiltros = [
    { label: "Pedidos", keywords: ["pedido", "pedidos", "haz tu pedido"] },
    { label: "Envíos", keywords: ["envío", "delivery", "domicilio"] },
    { label: "Pagos", keywords: ["pago", "pagos", "mercado pago", "efectivo", "transferencia"] },
    { label: "Fidelidad", keywords: ["fidelidad", "sello", "vianda gratis"] },
    { label: "Alergias", keywords: ["alergia", "alergias", "ingredientes"] }
];
const filtroFaqContainer = document.createElement('div');
filtroFaqContainer.style.display = 'flex';
filtroFaqContainer.style.flexWrap = 'wrap';
filtroFaqContainer.style.gap = '0.5em';
filtroFaqContainer.style.justifyContent = 'center';
faqFiltros.forEach(f => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = f.label;
    btn.style.background = '#ffd600';
    btn.style.color = '#b71c1c';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.padding = '0.4em 1em';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {
        document.getElementById('faq-search').value = f.keywords[0];
        faqPreguntas.forEach(item => {
            item.style.display = f.keywords.some(k => item.innerText.toLowerCase().includes(k)) ? '' : 'none';
        });
    };
    filtroFaqContainer.appendChild(btn);
});
document.getElementById('faq-search').parentNode.insertBefore(filtroFaqContainer, document.getElementById('faq-search').nextSibling);

document.getElementById('faq-search').oninput = function() {
    const val = this.value.toLowerCase();
    faqPreguntas.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(val) ? '' : 'none';
    });
};

// --- Soporte para cupones ---
document.getElementById('cupon-aplicar').onclick = function() {
    const cupon = document.getElementById('cupon-input').value.trim().toUpperCase();
    let msg = '';
    if (cupon === 'PERU10' && carrito.length > 0) {
        cuponAplicado = 'PERU10';
        msg = '¡Cupón aplicado! 10% de descuento en tu pedido.';
    } else if (cupon) {
        cuponAplicado = null;
        msg = 'Cupón no válido.';
    }
    document.getElementById('cupon-msg').innerText = msg;
    actualizarCarrito();
};

// --- Chat de soporte (simulado) ---
document.getElementById('chat-toggle-btn').onclick = function() {
    document.getElementById('chat-soporte').style.display = 'flex';
};
document.getElementById('chat-enviar').onclick = function() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    const chat = document.getElementById('chat-mensajes');
    const div = document.createElement('div');
    div.innerHTML = `<b>Tú:</b> ${msg}`;
    chat.appendChild(div);
    input.value = '';
    setTimeout(() => {
        const bot = document.createElement('div');
        bot.innerHTML = `<b>Soporte:</b> ¡Gracias por tu mensaje! Te responderemos pronto.`;
        chat.appendChild(bot);
        chat.scrollTop = chat.scrollHeight;
    }, 800);
};

// --- Modo offline (aviso) ---
window.addEventListener('offline', () => {
    document.getElementById('offline-aviso').style.display = 'block';
});
window.addEventListener('online', () => {
    document.getElementById('offline-aviso').style.display = 'none';
});

// --- Mejora visual: ubica carrito y campanita arriba a la derecha ---
function reubicarFabBtns() {
    const carritoBtn = document.getElementById('carrito-toggle-btn');
    const pushBtn = document.getElementById('push-btn');
    carritoBtn.style.top = '18px';
    carritoBtn.style.right = '80px';
    carritoBtn.style.bottom = '';
    carritoBtn.style.left = '';
    carritoBtn.style.position = 'fixed';
    pushBtn.style.top = '18px';
    pushBtn.style.right = '20px';
    pushBtn.style.bottom = '';
    pushBtn.style.left = '';
    pushBtn.style.position = 'fixed';
}
window.addEventListener('DOMContentLoaded', reubicarFabBtns);
window.addEventListener('resize', reubicarFabBtns);
