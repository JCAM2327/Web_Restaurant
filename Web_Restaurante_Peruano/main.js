(() => {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    const COSTO_ENVIO = 2000;

    const CLAVES = {
        tema: 'sabor-tema',
        carrito: 'sabor-carrito-v1'
    };

    const enlaceWhatsApp = $('.whatsapp-flotante');
    const numeroWhatsApp = enlaceWhatsApp?.href.match(/wa\.me\/(\d+)/)?.[1] || '542235023826';

    const formatearPrecio = (valor) => `$${Math.round(Number(valor) || 0).toLocaleString('es-AR')}`;

    const leerAlmacen = (clave, alternativo) => {
        try {
            const dato = localStorage.getItem(clave);
            return dato ? JSON.parse(dato) : alternativo;
        } catch {
            return alternativo;
        }
    };

    const guardarAlmacen = (clave, valor) => {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
        } catch {
            /* Sin almacenamiento disponible. */
        }
    };

    const normalizar = (texto) => texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const abrirWhatsApp = (texto) => {
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.target = '_blank';
        enlace.rel = 'noopener noreferrer';
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
    };

    const cerrarAlHacerClicFuera = (dialogo) => {
        dialogo.addEventListener('click', (evento) => {
            if (evento.target !== dialogo) return;
            const rect = dialogo.getBoundingClientRect();
            const fuera = evento.clientX < rect.left
                || evento.clientX > rect.right
                || evento.clientY < rect.top
                || evento.clientY > rect.bottom;
            if (fuera) dialogo.close();
        });
    };

    const iniciarTema = () => {
        const boton = $('#tema-btn');
        if (!boton) return;

        const aplicar = (tema, persistir = true) => {
            document.documentElement.dataset.theme = tema;
            boton.textContent = tema === 'oscuro' ? '☀️' : '🌙';
            boton.setAttribute('aria-pressed', String(tema === 'oscuro'));
            boton.setAttribute('aria-label', tema === 'oscuro' ? 'Activar modo claro' : 'Activar modo oscuro');

            const meta = $('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', tema === 'oscuro' ? '#211a16' : '#b71c1c');

            if (persistir) {
                try {
                    localStorage.setItem(CLAVES.tema, tema);
                } catch {
                    /* Sin almacenamiento disponible. */
                }
            }
        };

        let guardado = null;
        try {
            guardado = localStorage.getItem(CLAVES.tema);
        } catch {
            /* Sin almacenamiento disponible. */
        }

        const prefiereOscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
        aplicar(guardado === 'oscuro' || (!guardado && prefiereOscuro), false);

        boton.addEventListener('click', () => {
            const siguiente = document.documentElement.dataset.theme === 'oscuro' ? 'claro' : 'oscuro';
            aplicar(siguiente);
        });
    };

    const iniciarCarrito = () => {
        const dialogo = $('#carrito-dialog');
        const lista = $('#carrito-lista');
        const vacio = $('#carrito-vacio');
        const total = $('#carrito-total');
        const contador = $('#carrito-contador');
        const abrir = $('#carrito-abrir');
        const aviso = $('#carrito-msg');
        const formulario = $('#pedido-form');
        const campoNombre = $('#pedido-nombre');
        const campoDireccion = $('#pedido-direccion');
        const campoHorario = $('#pedido-horario');
        const campoPago = $('#pedido-pago');
        if (!dialogo || !lista || !total) return;

        let carrito = leerAlmacen(CLAVES.carrito, []);
        if (!Array.isArray(carrito)) carrito = [];
        carrito = carrito
            .filter((item) => item && typeof item.nombre === 'string' && Number.isFinite(Number(item.precio)) && Number(item.cantidad) > 0)
            .map((item) => ({
                nombre: item.nombre,
                precio: Number(item.precio),
                cantidad: Math.floor(Number(item.cantidad))
            }));

        const guardar = () => guardarAlmacen(CLAVES.carrito, carrito);

        const calcularTotales = () => {
            const subtotal = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
            const envio = carrito.length > 0 ? COSTO_ENVIO : 0;
            return { subtotal, envio, total: subtotal + envio };
        };

        const actualizarContador = () => {
            const unidades = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
            if (contador) contador.textContent = String(unidades);
            if (abrir) {
                abrir.setAttribute('aria-label', `Abrir carrito, ${unidades} ${unidades === 1 ? 'plato' : 'platos'}`);
            }
        };

        const renderizar = () => {
            lista.replaceChildren();

            carrito.forEach((item, indice) => {
                const fila = document.createElement('li');
                const nombre = document.createElement('span');
                nombre.textContent = `${item.cantidad} × ${item.nombre}`;

                const precio = document.createElement('span');
                precio.textContent = formatearPrecio(item.precio * item.cantidad);

                const quitar = document.createElement('button');
                quitar.type = 'button';
                quitar.className = 'quitar';
                quitar.dataset.indice = String(indice);
                quitar.textContent = 'Quitar';
                quitar.setAttribute('aria-label', `Quitar ${item.nombre} del carrito`);

                fila.append(nombre, precio, quitar);
                lista.appendChild(fila);
            });

            if (vacio) vacio.hidden = carrito.length > 0;

            const { subtotal, envio, total: totalFinal } = calcularTotales();
            if (carrito.length === 0) {
                total.textContent = 'Total: $0';
            } else {
                total.innerHTML = `Subtotal: ${formatearPrecio(subtotal)}<br>Envío: ${formatearPrecio(envio)}<br>Total: ${formatearPrecio(totalFinal)}`;
            }

            actualizarContador();
        };

        const avisar = (texto) => {
            if (aviso) aviso.textContent = texto;
        };

        const agregar = (nombre, precio) => {
            const existente = carrito.find((item) => item.nombre === nombre && item.precio === precio);
            if (existente) {
                existente.cantidad += 1;
            } else {
                carrito.push({ nombre, precio, cantidad: 1 });
            }
            guardar();
            renderizar();
            avisar('');
        };

        const vaciar = () => {
            carrito = [];
            guardar();
            renderizar();
            avisar('');
        };

        const abrirDialogo = () => {
            renderizar();
            if (typeof dialogo.showModal === 'function') {
                if (!dialogo.open) dialogo.showModal();
            } else {
                dialogo.setAttribute('open', '');
            }
        };

        const enviarPedido = () => {
            if (carrito.length === 0) {
                avisar('Agregá al menos un plato para armar el pedido.');
                return;
            }

            const datos = {
                nombre: campoNombre?.value.trim() || '',
                direccion: campoDireccion?.value.trim() || '',
                horario: campoHorario?.value.trim() || '',
                pago: campoPago?.value.trim() || ''
            };

            const faltante = [
                { valor: datos.nombre, campo: campoNombre, etiqueta: 'tu nombre' },
                { valor: datos.direccion, campo: campoDireccion, etiqueta: 'la zona y dirección' },
                { valor: datos.horario, campo: campoHorario, etiqueta: 'el horario' },
                { valor: datos.pago, campo: campoPago, etiqueta: 'la forma de pago' }
            ].find((dato) => !dato.valor);

            if (faltante) {
                avisar(`Completá ${faltante.etiqueta} para enviar el pedido.`);
                faltante.campo?.focus();
                return;
            }

            const { subtotal, envio, total: totalFinal } = calcularTotales();
            const lineas = [
                'Hola Sabor del Norte, quiero hacer este pedido:',
                '',
                ...carrito.map((item) => `• ${item.cantidad} × ${item.nombre} — ${formatearPrecio(item.precio * item.cantidad)}`),
                '',
                `Subtotal: ${formatearPrecio(subtotal)}`,
                `Envío: ${formatearPrecio(envio)}`,
                `Total: ${formatearPrecio(totalFinal)}`,
                '',
                `Nombre: ${datos.nombre}`,
                `Zona/dirección: ${datos.direccion}`,
                `Horario preferido: ${datos.horario}`,
                `Forma de pago: ${datos.pago}`
            ];

            abrirWhatsApp(lineas.join('\n'));
            avisar('Se abrió WhatsApp con el resumen. Enviá el mensaje para confirmar el pedido.');
        };

        document.addEventListener('click', (evento) => {
            const agregarBoton = evento.target.closest('.agregar');
            if (agregarBoton) {
                evento.preventDefault();
                const nombre = agregarBoton.dataset.nombre?.trim();
                const precio = Number(agregarBoton.dataset.precio);
                if (!nombre || !Number.isFinite(precio) || precio <= 0) return;

                agregar(nombre, precio);

                const textoOriginal = agregarBoton.textContent;
                agregarBoton.textContent = 'Agregado';
                agregarBoton.disabled = true;
                window.setTimeout(() => {
                    agregarBoton.textContent = textoOriginal;
                    agregarBoton.disabled = false;
                }, 800);
                return;
            }

            const quitarBoton = evento.target.closest('.quitar');
            if (!quitarBoton || !lista.contains(quitarBoton)) return;

            const indice = Number(quitarBoton.dataset.indice);
            if (!Number.isInteger(indice) || indice < 0 || indice >= carrito.length) return;

            carrito.splice(indice, 1);
            guardar();
            renderizar();
            avisar('');
        });

        abrir?.addEventListener('click', abrirDialogo);

        $$('[data-cerrar]', dialogo).forEach((boton) => {
            boton.addEventListener('click', () => dialogo.close());
        });
        cerrarAlHacerClicFuera(dialogo);

        $('#carrito-vaciar')?.addEventListener('click', vaciar);
        formulario?.addEventListener('submit', (evento) => {
            evento.preventDefault();
            enviarPedido();
        });

        renderizar();
    };

    const iniciarCarrusel = () => {
        const pista = $('#carrusel-pista');
        if (!pista) return;

        const diapositivas = $$('.carrusel-slide', pista);
        if (!diapositivas.length) return;

        const anterior = $('#carrusel-prev');
        const siguiente = $('#carrusel-next');
        const contador = $('#carrusel-contador');
        const puntos = $('#carrusel-puntos');
        const botonesPunto = [];
        let indiceActual = 0;
        let temporizadorDesplazamiento = 0;

        const comportamiento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

        const maximoDesplazamiento = () => Math.max(0, pista.scrollWidth - pista.clientWidth);

        const centrar = (diapositiva) => {
            const pistaRect = pista.getBoundingClientRect();
            const diapositivaRect = diapositiva.getBoundingClientRect();
            const destino = pista.scrollLeft
                + (diapositivaRect.left - pistaRect.left)
                - (pista.clientWidth - diapositivaRect.width) / 2;
            pista.scrollTo({
                left: Math.max(0, Math.min(maximoDesplazamiento(), destino)),
                behavior: comportamiento()
            });
        };

        const calcularIndice = () => {
            const maximo = maximoDesplazamiento();
            const pistaRect = pista.getBoundingClientRect();
            const centro = pista.clientWidth / 2;
            let indice = 0;
            let distanciaMinima = Infinity;

            diapositivas.forEach((diapositiva, posicion) => {
                const rect = diapositiva.getBoundingClientRect();
                const posicionContenido = rect.left - pistaRect.left + pista.scrollLeft;
                const objetivo = Math.max(0, Math.min(maximo, posicionContenido + rect.width / 2 - centro));
                const distancia = Math.abs(pista.scrollLeft - objetivo);
                if (distancia < distanciaMinima) {
                    distanciaMinima = distancia;
                    indice = posicion;
                }
            });

            return indice;
        };

        const actualizarFlechas = (indice) => {
            if (anterior) anterior.disabled = indice <= 0;
            if (siguiente) siguiente.disabled = indice >= diapositivas.length - 1;
        };

        const pintarIndice = (indice) => {
            indiceActual = indice;
            if (contador) contador.textContent = `${indiceActual + 1} / ${diapositivas.length}`;
            actualizarFlechas(indiceActual);

            botonesPunto.forEach((boton, posicion) => {
                if (posicion === indiceActual) {
                    boton.setAttribute('aria-current', 'true');
                } else {
                    boton.removeAttribute('aria-current');
                }
            });
        };

        const actualizarEstado = () => {
            pintarIndice(calcularIndice());
        };

        const desplazar = (direccion) => {
            const destino = Math.max(0, Math.min(diapositivas.length - 1, indiceActual + direccion));
            pintarIndice(destino);
            centrar(diapositivas[destino]);
        };

        const crearPuntos = () => {
            if (!puntos) return;
            puntos.replaceChildren();
            botonesPunto.length = 0;

            diapositivas.forEach((diapositiva, indice) => {
                const titulo = diapositiva.querySelector('h3')?.textContent.trim() || `Plato ${indice + 1}`;
                const boton = document.createElement('button');
                boton.type = 'button';
                boton.className = 'carrusel-punto';
                boton.setAttribute('aria-label', `Ir a ${titulo}`);
                boton.addEventListener('click', () => {
                    pintarIndice(indice);
                    centrar(diapositiva);
                });
                puntos.appendChild(boton);
                botonesPunto.push(boton);
            });
        };

        const alDesplazar = () => {
            window.clearTimeout(temporizadorDesplazamiento);
            temporizadorDesplazamiento = window.setTimeout(() => pintarIndice(calcularIndice()), 120);
        };

        anterior?.addEventListener('click', () => desplazar(-1));
        siguiente?.addEventListener('click', () => desplazar(1));

        pista.addEventListener('keydown', (evento) => {
            if (evento.key === 'ArrowLeft') {
                evento.preventDefault();
                desplazar(-1);
            }
            if (evento.key === 'ArrowRight') {
                evento.preventDefault();
                desplazar(1);
            }
        });

        pista.addEventListener('scroll', alDesplazar, { passive: true });
        window.addEventListener('resize', actualizarEstado);
        window.addEventListener('load', actualizarEstado, { once: true });

        crearPuntos();
        actualizarEstado();
    };

    const iniciarPreguntas = () => {
        const buscador = $('#faq-buscar');
        const lista = $('#faq-lista');
        const vacio = $('#faq-vacio');
        if (!buscador || !lista) return;

        const preguntas = $$('.faq-item', lista);

        const filtrar = () => {
            const consulta = normalizar(buscador.value.trim());
            let visibles = 0;
            preguntas.forEach((pregunta) => {
                const coincide = !consulta || normalizar(pregunta.textContent).includes(consulta);
                pregunta.hidden = !coincide;
                if (coincide) visibles += 1;
            });
            if (vacio) vacio.hidden = visibles > 0 || !consulta;
        };

        buscador.addEventListener('input', filtrar);
    };

    const iniciarContacto = () => {
        const formulario = $('#contact-form');
        if (!formulario) return;

        const estado = $('#form-estado');
        const nombre = $('#contacto-nombre');
        const email = $('#contacto-email');
        const mensaje = $('#contacto-mensaje');

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const nombreValor = nombre?.value.trim() || '';
            const emailValor = email?.value.trim() || '';
            const mensajeValor = mensaje?.value.trim() || '';
            const emailValido = email ? email.checkValidity() : false;

            if (!nombreValor || !emailValor || !mensajeValor || !emailValido) {
                if (estado) estado.textContent = 'Completá nombre, un correo válido y mensaje.';
                const primerInvalido = [nombre, email, mensaje].find((campo) => {
                    if (!campo) return false;
                    if (campo.type === 'email') return !campo.value.trim() || !campo.checkValidity();
                    return !campo.value.trim();
                });
                primerInvalido?.focus();
                return;
            }

            abrirWhatsApp(`Hola Sabor del Norte, soy ${nombreValor} (${emailValor}).\n\n${mensajeValor}`);
            if (estado) estado.textContent = 'Se abrió WhatsApp con tu mensaje. Enviá el mensaje para contactarnos.';
        });
    };

    const iniciarConexion = () => {
        const aviso = $('#offline-aviso');
        if (!aviso) return;

        const actualizar = () => {
            aviso.hidden = navigator.onLine;
        };

        window.addEventListener('online', actualizar);
        window.addEventListener('offline', actualizar);
        actualizar();
    };

    const iniciarAnio = () => {
        const anio = $('#anio');
        if (anio) anio.textContent = String(new Date().getFullYear());
    };

    const iniciar = () => {
        iniciarTema();
        iniciarCarrito();
        iniciarCarrusel();
        iniciarPreguntas();
        iniciarContacto();
        iniciarConexion();
        iniciarAnio();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
