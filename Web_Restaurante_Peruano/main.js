// Carrusel: muestra 2 imágenes a la vez, avanza de 2 en 2 cada 5 segundos y botones funcionan
(function() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
    const images = track.querySelectorAll('img');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let current = 0;
    const visible = 2;
    function updateCarousel() {
        let offset = (current * 50); // 50% por imagen
        track.style.transform = `translateX(-${offset}%)`;
    }
    function next() {
        current = (current + visible) % images.length;
        updateCarousel();
    }
    function prev() {
        current = (current - visible + images.length) % images.length;
        updateCarousel();
    }
    if (nextBtn) nextBtn.onclick = next;
    if (prevBtn) prevBtn.onclick = prev;
    setInterval(next, 5000);
    updateCarousel();
})();

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

// Carrusel de platos en móviles: muestra 1 plato a la vez, avanza cada 15s y flechas para navegar
(function() {
    function isMobile() {
        return window.innerWidth <= 700;
    }
    const platosGrid = document.querySelector('.platos-grid');
    if (!platosGrid) return;
    let platos = Array.from(platosGrid.children);
    let current = 0;
    let intervalId = null;

    // Crea flechas si no existen
    let prevBtn = document.getElementById('plato-carrusel-prev');
    let nextBtn = document.getElementById('plato-carrusel-next');
    if (!prevBtn) {
        prevBtn = document.createElement('button');
        prevBtn.id = 'plato-carrusel-prev';
        prevBtn.innerHTML = '&#10094;';
        prevBtn.setAttribute('aria-label', 'Anterior plato');
        prevBtn.style.position = 'absolute';
        prevBtn.style.left = '8px';
        prevBtn.style.top = '50%';
        prevBtn.style.transform = 'translateY(-50%)';
        prevBtn.style.background = '#ffd600';
        prevBtn.style.color = '#b71c1c';
        prevBtn.style.border = 'none';
        prevBtn.style.borderRadius = '50%';
        prevBtn.style.width = '36px';
        prevBtn.style.height = '36px';
        prevBtn.style.fontSize = '1.7em';
        prevBtn.style.zIndex = '10';
        prevBtn.style.display = 'none';
        prevBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        platosGrid.parentNode.style.position = 'relative';
        platosGrid.parentNode.appendChild(prevBtn);
    }
    if (!nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.id = 'plato-carrusel-next';
        nextBtn.innerHTML = '&#10095;';
        nextBtn.setAttribute('aria-label', 'Siguiente plato');
        nextBtn.style.position = 'absolute';
        nextBtn.style.right = '8px';
        nextBtn.style.top = '50%';
        nextBtn.style.transform = 'translateY(-50%)';
        nextBtn.style.background = '#ffd600';
        nextBtn.style.color = '#b71c1c';
        nextBtn.style.border = 'none';
        nextBtn.style.borderRadius = '50%';
        nextBtn.style.width = '36px';
        nextBtn.style.height = '36px';
        nextBtn.style.fontSize = '1.7em';
        nextBtn.style.zIndex = '10';
        nextBtn.style.display = 'none';
        nextBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        platosGrid.parentNode.style.position = 'relative';
        platosGrid.parentNode.appendChild(nextBtn);
    }

    function showPlato(idx) {
        platos.forEach((card, i) => {
            card.style.display = (i === idx) ? '' : 'none';
        });
    }

    function startPlatoCarrusel() {
        if (intervalId) clearInterval(intervalId);
        showPlato(current);
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        intervalId = setInterval(() => {
            current = (current + 1) % platos.length;
            showPlato(current);
        }, 15000);
    }

    function stopPlatoCarrusel() {
        if (intervalId) clearInterval(intervalId);
        platos.forEach(card => card.style.display = '');
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    }

    function handleResize() {
        if (isMobile()) {
            startPlatoCarrusel();
        } else {
            stopPlatoCarrusel();
        }
    }

    prevBtn.onclick = function(e) {
        e.stopPropagation();
        current = (current - 1 + platos.length) % platos.length;
        showPlato(current);
    };
    nextBtn.onclick = function(e) {
        e.stopPropagation();
        current = (current + 1) % platos.length;
        showPlato(current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
})();

// Botón "¿Qué plato peruano eres?" funcional y con más opciones (sin vegetariano ni arroz)
(function() {
    const testBtn = document.getElementById('test-plato-btn');
    if (!testBtn) return;
    const testModal = document.getElementById('test-modal');
    const testContent = document.getElementById('test-content');
    const testResultado = document.getElementById('test-resultado');

    // Opciones ampliadas (sin vegetariano ni arroz)
    const preguntas = [
        {
            texto: "¿Prefieres algo fresco, caliente o picante?",
            opciones: [
                { label: "Fresco", plato: "Ceviche" },
                { label: "Caliente", plato: "Lomo Saltado" },
                { label: "Picante", plato: "Ají de Gallina" }
            ]
        },
        {
            texto: "¿Te gusta la papa, el pescado o el pollo?",
            opciones: [
                { label: "Papa", plato: "Papa a la Huancaína" },
                { label: "Pescado", plato: "Ceviche" },
                { label: "Pollo", plato: "Ají de Gallina" }
            ]
        }
    ];

    let preguntaActual = 0;
    let respuestas = [];

    function mostrarPregunta(idx) {
        const p = preguntas[idx];
        testResultado.innerText = '';
        testContent.innerHTML = `<p>${p.texto}</p>`;
        p.opciones.forEach(op => {
            const btn = document.createElement('button');
            btn.textContent = op.label;
            btn.style.margin = '0.5em';
            btn.onclick = function() {
                respuestas.push(op.plato);
                if (preguntaActual + 1 < preguntas.length) {
                    preguntaActual++;
                    mostrarPregunta(preguntaActual);
                } else {
                    mostrarResultado();
                }
            };
            testContent.appendChild(btn);
        });
    }

    function mostrarResultado() {
        // Elige el plato más frecuente en las respuestas
        const counts = {};
        respuestas.forEach(p => counts[p] = (counts[p] || 0) + 1);
        let plato = respuestas[0];
        let max = 0;
        for (const k in counts) {
            if (counts[k] > max) {
                max = counts[k];
                plato = k;
            }
        }
        testContent.innerHTML = '';
        testResultado.innerText = `¡Eres ${plato}! Te recomendamos pedirlo hoy.`;
    }

    testBtn.onclick = function() {
        preguntaActual = 0;
        respuestas = [];
        testModal.style.display = 'flex';
        mostrarPregunta(0);
    };
    // El botón cerrar ya existe en el HTML y funciona
})();

// Mapa interactivo funcional: muestra región y comidas típicas al pasar el cursor
(function() {
    const mapa = document.getElementById('mapa-peru-img');
    const tooltip = document.getElementById('tooltip-mapa');
    const descRegion = document.getElementById('desc-region');
    if (!mapa || !tooltip || !descRegion) return;

    const regiones = [
        {
            nombre: "Costa",
            color: "#ff9800",
            comidas: "Ceviche, arroz con mariscos, tiraditos y pescados frescos."
        },
        {
            nombre: "Sierra",
            color: "#ffd600",
            comidas: "Ají de gallina, papa a la huancaína, rocoto relleno, guisos y papas andinas."
        },
        {
            nombre: "Selva",
            color: "#d32f2f",
            comidas: "Tacacho con cecina, juane, platos con plátano y sabores exóticos de la Amazonía."
        }
    ];

    mapa.addEventListener('mousemove', function(e) {
        const rect = mapa.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        let region = regiones[0]; // Costa por defecto

        if (x > 0.68 || (x > 0.58 && y < 0.35)) {
            region = regiones[2]; // Selva
        } else if (x >= 0.45 && x <= 0.68) {
            region = regiones[1]; // Sierra
        }

        tooltip.innerHTML = `<strong style="color:${region.color}">${region.nombre}</strong><br><span style="font-size:0.97em">${region.comidas}</span>`;
        tooltip.style.display = "block";
        tooltip.style.left = (e.clientX - rect.left + 10) + "px";
        tooltip.style.top = (e.clientY - rect.top + 10) + "px";
        descRegion.innerHTML = `<strong style="color:${region.color}">${region.nombre}:</strong> ${region.comidas}`;
    });

    mapa.addEventListener('mouseleave', function() {
        tooltip.style.display = "none";
        descRegion.innerHTML = "Pasa el mouse sobre el mapa para descubrir la región de cada plato.";
    });
})();
