# CleanWasserRD — sitio web

Sitio de una sola página (HTML/CSS/JS puro, sin frameworks) para mostrar los productos de CleanWasserRD y capturar pedidos: el cliente ve el catálogo, presiona "Pedir ahora", llena un formulario con su WhatsApp y correo, y ese pedido te llega a ti.

## Antes de publicar — 1 cosa que falta configurar

El número de WhatsApp (`849-203-8524`) y el correo de contacto (`Cleanwasserrd@gmail.com`) ya están configurados en el sitio. Solo falta:

**`WEB3FORMS_ACCESS_KEY`** (en `script.js`) — la clave que conecta el formulario a tu correo. Es gratis y toma 2 minutos:
   - Entra a [web3forms.com](https://web3forms.com)
   - Escribe **`Cleanwasserrd@gmail.com`** (así los pedidos llegan a ese correo) y crea una "Access Key"
   - Confirma el correo de verificación que te llega
   - Copia esa clave y pégala reemplazando `"PON_AQUI_TU_ACCESS_KEY"` en `script.js`

Sin esa clave, el sitio funciona igual, pero al enviar el formulario le dirá al cliente que escriba directo por WhatsApp (no se pierde el pedido, solo no llega por correo).

## También puedes editar

- **Precios**: cada producto tiene `RD$ 100` como precio de ejemplo (así lo pediste). Búscalo en `index.html` — hay 4 líneas `<span class="price">RD$ 100</span>` y 4 atributos `data-price="RD$ 100"` en los botones "Pedir ahora" (uno por cada producto, incluyendo Doble Acción Premium Cisternas).
- **Descripciones y ficha técnica**: están tomadas de las fichas técnicas que compartiste (sin incluir la fórmula activa, como pediste) y las capacidades están en galones. Puedes ajustarlas en `index.html` dentro de cada `<article class="product-card">`.
- **Fotos de producto**: la carpeta `assets/` guarda los originales como respaldo, pero el sitio **ya no las carga desde ahí** (ver nota abajo). El producto "Doble Acción Premium Cisternas" reutiliza la misma foto que "Doble Acción Premium" (no se recibió una foto distinta para esa variante).
- **Nota sobre las fotos**: el texto que aparece dentro de las imágenes (nombre del producto, meses de uso, capacidad, etc.) es parte del diseño gráfico y está en litros — no se puede editar como texto normal. Si quieres esas imágenes también en galones, lo ideal es pedir el diseño original (editable) a quien las creó.

## Por qué las fotos ya no dependen de la carpeta `assets/`

Después de que las imágenes se vieran "rotas" al subir el sitio a GitHub (probablemente porque la carpeta `assets/` no se subió completa o con la estructura correcta), todas las fotos —logo, portada y productos— se incrustaron directamente dentro de `index.html` como código (esto se llama "base64"). Esto significa:

- El sitio ya **no puede fallar** por una carpeta mal subida: todo vive en un solo archivo.
- `index.html` ahora pesa más (~950 KB en vez de ~20 KB) porque contiene las fotos codificadas como texto. Es normal y no afecta la velocidad de carga de forma perceptible.
- **Para cambiar una foto en el futuro**, ya no basta con reemplazar el archivo en `assets/` — hay que volver a pedir que se incruste la nueva imagen en el HTML (puedes pedírmelo aquí mismo, o usar un conversor de "imagen a base64" y reemplazar el bloque `src="data:image/..."` correspondiente).

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
└── assets/         → fotos de los productos (una se reutiliza para la variante Cisternas)
```
