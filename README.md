# 🥗 AC Bowl — Landing page

Landing premium para **AC Bowl**, con un **configurador de bowl** interactivo que
arma el pedido y lo abre directo en WhatsApp. Hecha con **HTML5 + CSS3 + JavaScript
Vanilla**. Sin frameworks, sin librerías, sin CDN de terceros para la lógica.

> _"Ensaladas que te hacen bien."_

---

## 🚀 Cómo ejecutarla

Es 100% estática. Dos opciones:

1. **Doble clic** en `index.html`.
2. **Live Server** en VS Code (recomendado): clic derecho sobre `index.html` →
   _Open with Live Server_.

No necesita build ni instalación.

---

## 📁 Estructura

```text
/
├── index.html        → estructura, SEO, Open Graph, JSON-LD
├── styles.css        → sistema de diseño completo (tokens + 18 secciones)
├── script.js         → configurador, preview SVG, WhatsApp y UI
├── README.md
└── assets/
    ├── img/          → ilustraciones de bowls + og-cover.png
    ├── icons/        → íconos de línea SVG (usan currentColor)
    └── fonts/        → (ver sección "Fuentes")
```

---

## ✏️ Personalización rápida

Casi todo lo editable vive al inicio de **`script.js`**.

### 1. Número de WhatsApp y precio
```js
const CONFIG = {
  whatsapp: "56961924282",   // ← formato internacional, sin "+" ni espacios
  negocio: "AC Bowl",
  saludo: "¡Hola AC Bowl! 🌿",
  precioBowl: 5500,          // ← precio único del bowl (armado libre)
};
```
> **El bowl tiene precio único.** Armar el bowl es solo para **elegir
> ingredientes**: no se suma dinero por topping. Para cambiar el valor, editás
> `precioBowl`. Todos los favoritos usan ese mismo precio.

### 2. Menú (ingredientes)
En el objeto `MENU` cambiás nombres y el `color` que usa la vista previa (el
campo `price` quedó y **ya no se usa** para el total; podés ignorarlo). Para
**agregar un ingrediente**, sumás un objeto al array:
```js
{ id: "champinon", name: "Champiñón", color: "#8A7A66" }
```
> Los `id` de toppings que tengan una posición propia en el dibujo están en
> `TOPPING_SLOTS`. Si agregás un topping nuevo sin slot, aparece igual en el
> centro del bowl (no rompe nada).

### 3. Favoritos, galería y reseñas
Editá los arrays `FAVORITOS`, `GALERIA` y `RESENAS`. Cada favorito trae un
`order` que precarga base/proteína/toppings/salsa en el mensaje de WhatsApp.

### 4. Datos del negocio (dirección, horarios, Instagram)
Están en **`index.html`**: el bloque `JSON-LD` del `<head>`, la sección
`<footer>` y los enlaces de Instagram (`@acbowl`). Reemplazá también el dominio
`https://www.acbowl.cl/` en las etiquetas `canonical`, Open Graph y Twitter por
el dominio real cuando lo tengas.

---

## 🖼️ Reemplazar las ilustraciones por fotos reales

Las imágenes de `assets/img/` (`bowl-*.svg`, `gal-*.svg`) son **ilustraciones
provisionales** para que la web se vea completa desde el minuto cero. Para
producción final, reemplazalas por **fotografía real** manteniendo el nombre de
archivo (o actualizá la ruta en el HTML/JS):

| Archivo | Uso | Tamaño sugerido |
|---|---|---|
| `bowl-hero.svg` | Hero principal | 1000×1000 px, cuadrada |
| `bowl-*.svg` | Tarjetas de favoritos | 800×600 px (4:3) |
| `gal-1..6.svg` | Galería masonry | 800–1200 px de ancho, alto libre |
| `og-cover.png` | Vista previa al compartir | 1200×630 px (¡no cambiar medidas!) |

Consejo: exportá las fotos en **WebP** (más livianas) y actualizá la extensión
en el `src`. El `loading="lazy"` ya está puesto en todas menos el hero.

---

## 🔤 Fuentes

Por defecto se cargan **Poppins** (textos) y **Dancing Script** (manuscrita)
desde Google Fonts. Funciona apenas hay internet.

Para máximo rendimiento y funcionamiento **offline** (y sumar puntos de
Lighthouse), conviene **auto-alojarlas**:

1. Descargá los `.woff2` desde [google-webfonts-helper](https://gwfh.mranftl.com/fonts).
2. Copialos a `assets/fonts/`.
3. En `styles.css` agregá los `@font-face` y quitá el `<link>` de Google en el
   `<head>` de `index.html`.

---

## 🔍 SEO y accesibilidad ya incluidos

- Meta title/description, **Open Graph**, **Twitter Cards**.
- **JSON-LD** `Restaurant` (Schema.org) con horarios, teléfono y rating.
- Jerarquía correcta **H1 → H2 → H3** y HTML semántico.
- `alt` en todas las imágenes, `lazy loading`, `skip link`.
- **WCAG AA**: contraste cuidado, foco visible con teclado, roles ARIA en el
  configurador y `prefers-reduced-motion` respetado.

---

## 🌐 Publicar en GitHub Pages

```bash
git init
git add .
git commit -m "AC Bowl landing"
git branch -M main
git remote add origin https://github.com/USUARIO/ac-bowl.git
git push -u origin main
```
Luego: repo → **Settings → Pages → Branch: main / root**.
Subí **todos los archivos en un mismo commit** para evitar desincronización de
caché.

---

Hecho con ❤️ y mucha palta.
