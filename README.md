# CleanWasserRD — sitio web

Sitio de una sola página (HTML/CSS/JS puro, sin frameworks) para mostrar los productos de CleanWasserRD y capturar pedidos: el cliente ve el catálogo, presiona "Pedir ahora", llena un formulario con su WhatsApp y correo, y ese pedido te llega a ti.

## Antes de publicar — 2 cosas que debes configurar

Abre el archivo `script.js` y edita estas dos líneas al principio:

1. **`BUSINESS_WHATSAPP`** — tu número de WhatsApp real, con código de país y sin espacios ni `+`. Ejemplo para República Dominicana: `"18095551234"`. Mientras esto esté vacío, los botones de WhatsApp del sitio mostrarán una alerta en vez de abrir un chat.

2. **`WEB3FORMS_ACCESS_KEY`** — la clave que conecta el formulario a tu correo. Es gratis y toma 2 minutos:
   - Entra a [web3forms.com](https://web3forms.com)
   - Escribe tu correo (`ronnyjaviercaraballoarias@gmail.com`) y crea una "Access Key"
   - Confirma el correo de verificación que te llega
   - Copia esa clave y pégala reemplazando `"PON_AQUI_TU_ACCESS_KEY"` en `script.js`

Sin la clave, el sitio sigue funcionando pero al enviar el formulario le dirá al cliente que escriba directo por WhatsApp (no se pierde el pedido, pero no llega por correo).

## También puedes editar

- **Precios**: cada producto tiene `RD$ 100` como precio de ejemplo (así lo pediste). Búscalo en `index.html` — hay 3 líneas `<span class="price">RD$ 100</span>` y 3 atributos `data-price="RD$ 100"` en los botones "Pedir ahora".
- **Descripciones y ficha técnica**: están tomadas de las fichas técnicas que compartiste (sin incluir la fórmula activa, como pediste). Puedes ajustarlas en `index.html` dentro de cada `<article class="product-card">`.
- **Fotos de producto**: están en la carpeta `assets/`. Si tienes fotos más nuevas, reemplaza los archivos con el mismo nombre.

## Cómo probarlo en tu computadora

No necesita instalación. Solo abre `index.html` con doble clic, o para probar el formulario correctamente, sirve la carpeta con cualquier servidor local, por ejemplo:

```bash
npx serve .
```

## Cómo publicarlo en Vercel (gratis)

**Opción A — La más simple (sin usar la terminal):**
1. Crea una cuenta gratis en [vercel.com](https://vercel.com) (puedes entrar con tu correo de Google).
2. Sube esta carpeta a un repositorio de GitHub (puedes arrastrar los archivos desde [github.com/new](https://github.com/new) → "uploading an existing file").
3. En Vercel, click en "Add New… → Project", elige ese repositorio e "Import". No necesitas cambiar ninguna configuración: Vercel detecta que es un sitio estático y lo publica.
4. En unos segundos tendrás una URL como `cleanwasserrd.vercel.app`. Si compras un dominio propio (ej. `cleanwasserrd.com`), lo conectas después desde el mismo proyecto en Vercel → "Settings → Domains".

**Opción B — Con la terminal (si te sientes cómodo):**
```bash
npm i -g vercel
cd cleanwasserrd
vercel --prod
```
Sigue las instrucciones en pantalla (te pedirá iniciar sesión la primera vez).

## Dónde llegan los pedidos

Cada vez que un cliente confirma un pedido, te llega un correo a la dirección con la que creaste tu cuenta en Web3Forms, con: nombre, WhatsApp, correo, producto elegido y cualquier nota que haya dejado. Desde ahí lo contactas por WhatsApp para cerrar la venta.

## Estructura del proyecto

```
cleanwasserrd/
├── index.html      → toda la estructura y contenido del sitio
├── styles.css      → todos los estilos (colores, layout, responsive)
├── script.js       → menú móvil, modal de pedido y envío del formulario
└── assets/         → fotos de los 3 productos
```
