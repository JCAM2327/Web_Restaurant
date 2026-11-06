# Sabor del Norte

Sitio de **Sabor del Norte**, marca de comida peruana por delivery en el centro y macrocentro de Mar del Plata. Los pedidos se arman en el carrito y se confirman por WhatsApp.

## Funcionalidad

- Catálogo de platos con precios y descripciones.
- Carrito persistente en el navegador, con subtotal, envío y total.
- Envío del pedido por WhatsApp con el resumen de platos.
- Información de zonas, horarios, envío y medios de pago.
- Carrusel de platos destacados con acceso directo al carrito.
- Preguntas frecuentes con buscador.
- Formulario de contacto que arma un mensaje para WhatsApp.
- Tema claro/oscuro y diseño responsive.
- Página de política de privacidad.

## Datos del servicio

- **Zona:** centro y macrocentro de Mar del Plata.
- **Horarios:** todos los días, de 12:00 a 15:30 y de 19:30 a 23:30.
- **Envío:** $2.000, sin mínimo de pedido.
- **Pagos:** efectivo, transferencia y Mercado Pago.
- **WhatsApp:** +54 223 502 3826.

## Uso local

No requiere instalación ni build. Abrí `index.html` en el navegador o serví la carpeta con un servidor local:

```bash
npx serve .
```

## Estructura

- `index.html`: página principal.
- `privacidad.html`: política de privacidad.
- `styles.css`: estilos del sitio.
- `main.js`: carrito, tema, carrusel, FAQ y contacto.
- `img/`: imágenes de platos e identidad visual.

## Edición de contenido

- Los platos, precios y textos están en `index.html`.
- La zona, horarios, envío y pagos se repiten en `index.html` y `privacidad.html` cuando corresponde.
- Los colores y tokens visuales están en `styles.css`.
- El número de WhatsApp se toma del enlace flotante y de los enlaces de pedido/contacto.

## Imágenes

Las imágenes actuales son ilustrativas. Antes de publicar, reemplazalas por fotografías propias o material con licencia para uso comercial.

## Despliegue

El sitio se publica desde la raíz de esta carpeta en Vercel:

`https://web-restaurant-kj1e.vercel.app/`

## Autor

José Carlos Alayo Mondragón.
