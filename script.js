/* =================================================================
   AC BOWL · script.js  (JavaScript Vanilla, sin dependencias)
   ------------------------------------------------------------------
   Secciones:
     A) Configuración editable (WhatsApp, negocio)
     B) Datos del menú (bases, proteínas, toppings, salsas)
     C) Datos de contenido (favoritos, galería, reseñas)
     D) Estado del bowl
     E) Utilidades (formato de precio, etc.)
     F) Render de opciones del configurador
     G) Lógica de selección
     H) Resumen, total y vista previa (SVG)
     I) Mensaje y apertura de WhatsApp
     J) Render de favoritos / galería / reseñas
     K) UI: header, menú móvil, scroll reveal, mini-barra, toast
     L) Init
================================================================= */
(function () {
  "use strict";

  /* ============ A) CONFIGURACIÓN EDITABLE ============ */
  const CONFIG = {
    // Número de WhatsApp en formato internacional SIN "+" ni espacios.
    whatsapp: "56961924282",           // +56 9 6192 4282
    negocio: "AC Bowl",
    saludo: "¡Hola AC Bowl! 🌿",
    precioBowl: 5500,                  // ← precio único del bowl (arma libre, sin sumar por ingrediente)
  };

  /* ============ B) DATOS DEL MENÚ ============ */
  // color = color usado en la vista previa SVG.  price en CLP.
  const MENU = {
    base: [
      { id: "arroz-blanco",   name: "Arroz blanco",   price: 2400, color: "#F1E9D0" },
      { id: "arroz-integral", name: "Arroz integral", price: 2600, color: "#D8C39A" },
      { id: "quinoa",         name: "Quinoa",         price: 2900, color: "#E7D5A4" },
      { id: "mix-verde",      name: "Mix verde",      price: 2700, color: "#CFE3B2" },
    ],
    protein: [
      { id: "pollo-crispy", name: "Pollo crispy", price: 3200, color: "#E0A96D" },
      { id: "carne",        name: "Carne",        price: 3600, color: "#A85B43" },
      { id: "cerdo",        name: "Cerdo",        price: 3400, color: "#D69A78" },
      { id: "camaron",      name: "Camarón",      price: 3900, color: "#F2A98C" },
      { id: "tofu",         name: "Tofu",         price: 3000, color: "#EFE3B8" },
    ],
    toppings: [
      { id: "palta",         name: "Palta",         price: 900, color: "#7FB069" },
      { id: "mango",         name: "Mango",         price: 800, color: "#F4B740" },
      { id: "pepino",        name: "Pepino",        price: 500, color: "#BFE3A8" },
      { id: "tomate",        name: "Tomate cherry", price: 500, color: "#E4572E" },
      { id: "wakame",        name: "Wakame",        price: 700, color: "#2E6B4F" },
      { id: "cebolla",       name: "Cebolla crispy",price: 600, color: "#C88A3E" },
      { id: "queso-crema",   name: "Queso crema",   price: 700, color: "#F7F1DE" },
      { id: "zanahoria",     name: "Zanahoria",     price: 500, color: "#F08A24" },
      { id: "maiz",          name: "Maíz",          price: 500, color: "#F4C430" },
      { id: "semillas",      name: "Semillas",      price: 600, color: "#4A3B26" },
      { id: "cebollin",      name: "Cebollín",      price: 400, color: "#6FBF4B" },
    ],
    sauce: [
      { id: "cesar",        name: "César",         price: 0,   color: "#EFE7C9" },
      { id: "tahini",       name: "Tahini",        price: 400, color: "#E4D3A0" },
      { id: "sriracha",     name: "Sriracha",      price: 0,   color: "#E4572E" },
      { id: "teriyaki",     name: "Teriyaki",      price: 400, color: "#7A4A24" },
      { id: "pesto",        name: "Pesto",         price: 500, color: "#4E8C4A" },
      { id: "yogur-limon",  name: "Yogur y limón", price: 0,   color: "#F1EEDE" },
      { id: "casera",       name: "Salsa de la casa", price: 300, color: "#C46A2E" },
    ],
  };

  /* ============ C) DATOS DE CONTENIDO ============ */
  const FAVORITOS = [
    { name: "El Clásico",        tag: "Más pedido",       price: 5500, img: "assets/img/bowl-mediterraneo.svg",
      desc: "Arroz, pollo crispy, palta, tomate cherry y salsa césar.",
      order: { base: "arroz-blanco", protein: "pollo-crispy", toppings: ["palta", "tomate"], sauce: "cesar" } },
    { name: "Verde que te quiero",tag: "Veggie",          price: 5500, img: "assets/img/bowl-verde.svg",
      desc: "Mix verde, tofu, palta, pepino y salsa de yogur y limón.",
      order: { base: "mix-verde", protein: "tofu", toppings: ["palta", "pepino"], sauce: "yogur-limon" } },
    { name: "Tropiquén",          tag: "Fresco",          price: 5500, img: "assets/img/bowl-tropical.svg",
      desc: "Quinoa, camarón, mango, palta y salsa de la casa.",
      order: { base: "quinoa", protein: "camaron", toppings: ["mango", "palta"], sauce: "casera" } },
    { name: "Power Bowl",         tag: "Alto en proteína", price: 5500, img: "assets/img/bowl-power.svg",
      desc: "Arroz integral, carne, maíz, semillas y salsa teriyaki.",
      order: { base: "arroz-integral", protein: "carne", toppings: ["maiz", "semillas"], sauce: "teriyaki" } },
  ];

  const GALERIA = [
    { img: "assets/img/gal-1.svg", alt: "Bowl con pollo, tomate cherry y hojas verdes" },
    { img: "assets/img/gal-2.svg", alt: "Bowl verde con palta, pepino y mix de hojas" },
    { img: "assets/img/gal-3.svg", alt: "Bowl tropical con mango, camarón y palta" },
    { img: "assets/img/gal-4.svg", alt: "Power bowl con carne, maíz y semillas" },
    { img: "assets/img/gal-5.svg", alt: "Bowl clásico con arroz, palta y vegetales frescos" },
    { img: "assets/img/gal-6.svg", alt: "Bowl mediterráneo con quinoa y tomates cherry" },
  ];

  const RESENAS = [
    { name: "Camila Fuentes", meta: "Chillán", color: "#2F6B45",
      text: "Se nota que usan ingredientes frescos. El de camarón con mango es una locura, lo pido cada semana." },
    { name: "Matías Rojas", meta: "Chillán Viejo", color: "#E39AA3",
      text: "Armar tu propio bowl es lo mejor. Elegís todo y llega tal cual lo pediste. Rápido y riquísimo." },
    { name: "Valentina Soto", meta: "Las Termas", color: "#C88A3E",
      text: "Al fin comida saludable que da ganas de comer. La palta siempre en su punto. 10 de 10." },
    { name: "Ignacio Pérez", meta: "Centro", color: "#4E8C4A",
      text: "Pedí por WhatsApp en dos toques, con el pedido listo. Atención top y porciones generosas." },
  ];

  /* ============ D) ESTADO ============ */
  const state = { base: null, protein: null, toppings: new Set(), sauce: null };
  const prevToppings = new Set();  // para animar solo lo nuevo en el preview

  /* ============ E) UTILIDADES ============ */
  const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  const money = (n) => clp.format(n);
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const findItem = (group, id) => MENU[group].find((x) => x.id === id) || null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ F) RENDER DE OPCIONES ============ */
  function renderOptions() {
    $$(".options").forEach((wrap) => {
      const group = wrap.dataset.group;
      const multi = wrap.classList.contains("options--multi");
      const inputType = multi ? "checkbox" : "radio";

      wrap.innerHTML = MENU[group].map((item) => {
        return `
          <label class="option" data-id="${item.id}" role="${multi ? "checkbox" : "radio"}" aria-checked="false">
            <input type="${inputType}" name="${group}" value="${item.id}" />
            <span class="option__dot" style="background:${item.color}"></span>
            <span class="option__body">
              <span class="option__name">${item.name}</span>
            </span>
            <span class="option__check"><img src="assets/icons/check.svg" alt="" /></span>
          </label>`;
      }).join("");
    });
  }

  /* ============ G) SELECCIÓN ============ */
  function bindSelection() {
    $$(".options").forEach((wrap) => {
      const group = wrap.dataset.group;
      const multi = wrap.classList.contains("options--multi");

      wrap.addEventListener("change", (e) => {
        const input = e.target;
        if (!input.matches("input")) return;
        const id = input.value;
        const label = input.closest(".option");

        if (multi) {
          if (input.checked) state.toppings.add(id); else state.toppings.delete(id);
          toggleClass(label, "is-selected", input.checked);
          label.setAttribute("aria-checked", String(input.checked));
        } else {
          state[group] = id;
          $$(".option", wrap).forEach((l) => {
            const on = l === label;
            toggleClass(l, "is-selected", on);
            l.setAttribute("aria-checked", String(on));
          });
        }

        // Feedback táctil de "pop" en la opción recién elegida
        if (!prefersReducedMotion && (multi ? input.checked : true)) {
          label.classList.remove("just-picked");
          void label.offsetWidth;         // reinicia la animación
          label.classList.add("just-picked");
        }

        update();
      });
    });
  }

  function toggleClass(el, cls, on) { el.classList[on ? "add" : "remove"](cls); }

  /* ============ H) RESUMEN, TOTAL Y PREVIEW ============ */
  function computeTotal() {
    // Precio único: el bowl vale lo mismo sin importar los ingredientes.
    return CONFIG.precioBowl;
  }

  function update() {
    // ----- Resumen textual -----
    setSummary("base", state.base ? findItem("base", state.base).name : "");
    setSummary("protein", state.protein ? findItem("protein", state.protein).name : "");
    setSummary("sauce", state.sauce ? findItem("sauce", state.sauce).name : "");
    const tops = [...state.toppings].map((id) => findItem("toppings", id).name);
    setSummary("toppings", tops.join(", "));

    // ----- Total (con bump) -----
    const total = computeTotal();
    const totalEl = $("#totalPrice");
    totalEl.textContent = money(total);
    $("#miniPrice").textContent = money(total);
    if (!prefersReducedMotion) {
      totalEl.classList.remove("bump"); void totalEl.offsetWidth; totalEl.classList.add("bump");
    }

    // ----- Vista previa -----
    renderPreview();
  }

  function setSummary(key, value) {
    const dd = $(`[data-sum="${key}"]`);
    if (!dd) return;
    const empty = !value;
    dd.textContent = empty ? "—" : value;
    toggleClass(dd, "is-empty", empty);
  }

  /* ---- Vista previa del bowl en SVG (se arma según la selección) ---- */
  const SVGNS = "http://www.w3.org/2000/svg";
  const CX = 150, CY = 150;
  const R_BASE = 116;              // radio de la comida dentro del bowl
  // Posiciones fijas para cada topping alrededor del bowl
  const TOPPING_SLOTS = {
    palta:      { x: 106, y: 98 },
    mango:      { x: 150, y: 86 },
    pepino:     { x: 196, y: 104 },
    tomate:     { x: 210, y: 150 },
    wakame:     { x: 198, y: 196 },
    cebolla:    { x: 150, y: 214 },
    "queso-crema": { x: 104, y: 198 },
    zanahoria:  { x: 90,  y: 150 },
    maiz:       { x: 126, y: 120 },
    semillas:   { x: 174, y: 124 },
    cebollin:   { x: 150, y: 152 },
  };
  // Proteína: racimo de trozos arriba-derecha del bowl
  const PROT_SPOTS = [[158, 122], [186, 134], [168, 156], [150, 130], [194, 160]];

  function el(name, attrs) {
    const node = document.createElementNS(SVGNS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function add(parent, name, attrs) { const n = el(name, attrs); parent.appendChild(n); return n; }

  // Aclara (pct>0) u oscurece (pct<0) un color hex
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const t = pct < 0 ? 0 : 255, p = Math.abs(pct) / 100;
    r = Math.round((t - r) * p) + r;
    g = Math.round((t - g) * p) + g;
    b = Math.round((t - b) * p) + b;
    return "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  // PRNG con semilla → textura estable entre renders
  function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  // <defs>: gradientes, brillos y sombras suaves reutilizables
  function buildDefs() {
    const defs = el("defs", {});
    defs.innerHTML = `
      <linearGradient id="pv-rim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FCFBF7"/><stop offset="1" stop-color="#D7CFBE"/>
      </linearGradient>
      <radialGradient id="pv-inner" cx="0.5" cy="0.4" r="0.62">
        <stop offset="0" stop-color="#FCF7EC"/><stop offset="0.7" stop-color="#EFE6D4"/><stop offset="1" stop-color="#D6C8B0"/>
      </radialGradient>
      <radialGradient id="pv-shade" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.52" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1c1205" stop-opacity="0.24"/>
      </radialGradient>
      <radialGradient id="pv-hi" cx="0.36" cy="0.28" r="0.5">
        <stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="pv-gloss" cx="0.35" cy="0.3" r="0.55">
        <stop offset="0" stop-color="#fff" stop-opacity="0.92"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="pv-clip"><circle cx="${CX}" cy="${CY}" r="${R_BASE}"/></clipPath>
      <filter id="pv-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0.4" dy="1.5" stdDeviation="1.5" flood-color="#3a2a18" flood-opacity="0.32"/>
      </filter>
      <filter id="pv-bowlsh" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6"/>
      </filter>`;
    return defs;
  }

  function renderPreview() {
    const svg = $("#bowlPreview");
    svg.innerHTML = "";
    svg.appendChild(buildDefs());

    // ---- Estado vacío ----
    if (!state.base) {
      add(svg, "ellipse", { cx: CX, cy: 258, rx: 96, ry: 15, fill: "#3a2a18", opacity: .12, filter: "url(#pv-bowlsh)" });
      add(svg, "circle", { cx: CX, cy: CY, r: 132, fill: "url(#pv-rim)" });
      add(svg, "circle", { cx: CX, cy: CY, r: 120, fill: "url(#pv-inner)" });
      add(svg, "circle", { cx: CX, cy: CY, r: 96, fill: "none", stroke: "#C4CDBB", "stroke-width": 2, "stroke-dasharray": "5 9" });
      const t = add(svg, "text", { x: CX, y: CY + 6, "text-anchor": "middle",
        "font-family": "Poppins, sans-serif", "font-size": 15, "font-weight": 600, fill: "#93A08F" });
      t.textContent = "Elegí tu base 🌱";
      prevToppings.clear();
      return;
    }

    const base = findItem("base", state.base);

    // ---- Cuenco con profundidad ----
    add(svg, "ellipse", { cx: CX, cy: 260, rx: 104, ry: 16, fill: "#3a2a18", opacity: .18, filter: "url(#pv-bowlsh)" });
    add(svg, "circle", { cx: CX, cy: CY, r: 132, fill: "url(#pv-rim)" });      // borde exterior
    add(svg, "circle", { cx: CX, cy: CY, r: 125, fill: "#F1EAD9" }); // labio interno
    add(svg, "circle", { cx: CX, cy: CY, r: 120, fill: "url(#pv-inner)" });    // pared cóncava

    // ---- Base con textura de granos/hojas ----
    add(svg, "circle", { cx: CX, cy: CY, r: R_BASE, fill: base.color });
    drawBaseTexture(svg, base);
    add(svg, "circle", { cx: CX, cy: CY, r: R_BASE, fill: "url(#pv-shade)" });  // vignette (hunde la comida)
    add(svg, "circle", { cx: CX, cy: CY, r: R_BASE, fill: "url(#pv-hi)" });     // brillo arriba-izq

    // ---- Proteína ----
    if (state.protein) drawProtein(svg, findItem("protein", state.protein));

    // ---- Toppings ----
    state.toppings.forEach((id) => {
      const item = findItem("toppings", id);
      const slot = TOPPING_SLOTS[id] || { x: CX, y: CY };
      const grp = el("g", { "data-top": id, filter: "url(#pv-soft)" });
      drawTopping(grp, id, slot, item.color);
      if (!prefersReducedMotion && !prevToppings.has(id)) {
        grp.style.transformOrigin = `${slot.x}px ${slot.y}px`;
        grp.style.animation = "ingIn .34s cubic-bezier(.22,.61,.36,1)";
      }
      svg.appendChild(grp);
    });

    // ---- Salsa (drizzle brillante) ----
    if (state.sauce) drawSauce(svg, findItem("sauce", state.sauce));

    prevToppings.clear();
    state.toppings.forEach((id) => prevToppings.add(id));
  }

  // Textura de la base: granitos (arroz/quinoa) u hojas (mix verde)
  function drawBaseTexture(svg, base) {
    const g = el("g", { "clip-path": "url(#pv-clip)" });
    const rnd = rng(base.id.length * 97 + 13);
    const green = base.id === "mix-verde";
    const light = shade(base.color, green ? 20 : 15);
    const dark = shade(base.color, -16);
    const n = green ? 42 : 64;
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * (R_BASE - 6);
      const gx = CX + Math.cos(a) * rr, gy = CY + Math.sin(a) * rr;
      const tint = i % 3 === 0 ? dark : (i % 3 === 1 ? light : base.color);
      const rot = rnd() * 180;
      if (green) add(g, "ellipse", { cx: gx, cy: gy, rx: 5.5, ry: 3, fill: tint, transform: `rotate(${rot} ${gx} ${gy})` });
      else add(g, "ellipse", { cx: gx, cy: gy, rx: 3.4, ry: 1.7, fill: tint, transform: `rotate(${rot} ${gx} ${gy})` });
    }
    svg.appendChild(g);
  }

  // Proteína con forma y sombreado según el tipo
  function drawProtein(svg, p) {
    PROT_SPOTS.forEach(([x, y], i) => {
      const g = el("g", { filter: "url(#pv-soft)", transform: `rotate(${(i * 41) % 70 - 35} ${x} ${y})` });
      const dark = shade(p.color, -22), light = shade(p.color, 24);
      switch (p.id) {
        case "camaron": {           // langostino curvado
          add(g, "path", { d: `M${x - 9} ${y + 6} q 1 -15 14 -13 q 11 2 7 12`, fill: "none",
            stroke: p.color, "stroke-width": 9, "stroke-linecap": "round" });
          add(g, "path", { d: `M${x - 9} ${y + 6} q 1 -15 14 -13 q 11 2 7 12`, fill: "none",
            stroke: dark, "stroke-width": 9, "stroke-linecap": "round", "stroke-dasharray": "1.5 5", opacity: .5 });
          add(g, "path", { d: `M${x - 8} ${y + 4} q 1 -12 12 -11`, fill: "none",
            stroke: light, "stroke-width": 2.5, "stroke-linecap": "round", opacity: .8 });
          break;
        }
        case "tofu": {              // cubo isométrico
          add(g, "polygon", { points: `${x-9},${y-4} ${x},${y-9} ${x+9},${y-4} ${x},${y+1}`, fill: light });
          add(g, "polygon", { points: `${x-9},${y-4} ${x},${y+1} ${x},${y+11} ${x-9},${y+6}`, fill: p.color });
          add(g, "polygon", { points: `${x},${y+1} ${x+9},${y-4} ${x+9},${y+6} ${x},${y+11}`, fill: dark });
          break;
        }
        case "carne": case "cerdo": {   // trozo grillado con marcas
          add(g, "rect", { x: x - 15, y: y - 10, width: 30, height: 20, rx: 6, fill: p.color });
          add(g, "rect", { x: x - 13, y: y - 9, width: 26, height: 6, rx: 3, fill: light, opacity: .6 });
          [-4, 4].forEach((o) => add(g, "line", { x1: x - 12, y1: y + o, x2: x + 12, y2: y + o, stroke: dark, "stroke-width": 2, "stroke-linecap": "round", opacity: .7 }));
          break;
        }
        default: {                  // pollo crispy / genérico
          add(g, "rect", { x: x - 15, y: y - 10, width: 30, height: 20, rx: 8, fill: p.color, stroke: shade(p.color, -14), "stroke-width": 1 });
          add(g, "rect", { x: x - 12, y: y - 8, width: 24, height: 7, rx: 3.5, fill: light, opacity: .75 });
          const rnd = rng(i * 7 + 3);
          for (let k = 0; k < 5; k++) add(g, "circle", { cx: x - 10 + rnd() * 20, cy: y - 6 + rnd() * 12, r: 1, fill: dark, opacity: .5 });
        }
      }
      svg.appendChild(g);
    });
  }

  // Salsa: hilos con brillo encima
  function drawSauce(svg, s) {
    const g = el("g", { filter: "url(#pv-soft)" });
    const paths = ["M84 156 q 20 -24 42 -6 t 42 -4 t 40 2", "M96 128 q 24 22 46 4 t 40 6"];
    paths.forEach((d, i) => {
      add(g, "path", { d, fill: "none", stroke: s.color, "stroke-width": i ? 4.5 : 5.5, "stroke-linecap": "round", opacity: .92 });
      add(g, "path", { d, fill: "none", stroke: shade(s.color, 45), "stroke-width": 1.6, "stroke-linecap": "round", opacity: .7 });
    });
    svg.appendChild(g);
  }

  // Topping con volumen: rim, relleno y brillo según el ingrediente
  function drawTopping(g, id, s, color) {
    const { x, y } = s;
    const dark = shade(color, -24), light = shade(color, 26), extra = shade(color, 45);
    const gloss = (cx, cy, r) => add(g, "circle", { cx: cx - r * 0.32, cy: cy - r * 0.34, r: r * 0.42, fill: "url(#pv-gloss)" });

    switch (id) {
      case "palta": {               // abanico de láminas de palta
        [-26, 0, 26].forEach((rot, i) => {
          const sub = el("g", { transform: `translate(${x + (i - 1) * 6} ${y}) rotate(${rot})` });
          add(sub, "path", { d: "M0,-12 C6,-9 6,-1 3,10 C1.5,13 -1.5,13 -3,10 C-6,-1 -6,-9 0,-12 Z", fill: light, stroke: dark, "stroke-width": 1.6, "stroke-linejoin": "round" });
          add(sub, "path", { d: "M0,-9 C3.5,-6 3.5,0 1.6,8 C0.7,10 -0.7,10 -1.6,8 C-3.5,0 -3.5,-6 0,-9 Z", fill: extra, opacity: .7 });
          g.appendChild(sub);
        });
        break;
      }
      case "tomate": {              // cherris brillantes con cabito
        [[-6, 1], [7, -2], [1, 9]].forEach(([dx, dy]) => {
          add(g, "circle", { cx: x + dx, cy: y + dy, r: 7.5, fill: color });
          add(g, "circle", { cx: x + dx, cy: y + dy, r: 7.5, fill: "none", stroke: dark, "stroke-width": 1, opacity: .5 });
          gloss(x + dx, y + dy, 7.5);
          add(g, "path", { d: `M${x + dx} ${y + dy - 7} l-2 -2 m2 2 l2 -2 m-2 2 l0 -3`, stroke: "#4E8C4A", "stroke-width": 1.4, "stroke-linecap": "round", fill: "none" });
        });
        break;
      }
      case "pepino": {              // rodajas translúcidas con semillas
        [[-5, -2], [6, 3]].forEach(([dx, dy]) => {
          add(g, "circle", { cx: x + dx, cy: y + dy, r: 8.5, fill: light });
          add(g, "circle", { cx: x + dx, cy: y + dy, r: 8.5, fill: "none", stroke: shade(color, -30), "stroke-width": 2.2 });
          add(g, "circle", { cx: x + dx, cy: y + dy, r: 4.5, fill: extra, opacity: .8 });
          [[0, -2], [2, 1], [-2, 1]].forEach(([sx, sy]) => add(g, "ellipse", { cx: x + dx + sx, cy: y + dy + sy, rx: 0.9, ry: 1.4, fill: shade(color, -20) }));
        });
        break;
      }
      case "mango": {               // cubitos jugosos
        [[-6, -3], [4, -5], [0, 5], [8, 3]].forEach(([dx, dy], i) => {
          add(g, "rect", { x: x + dx - 4, y: y + dy - 4, width: 8, height: 8, rx: 2, fill: color, transform: `rotate(${i * 20 - 20} ${x + dx} ${y + dy})` });
          add(g, "rect", { x: x + dx - 3, y: y + dy - 3.5, width: 6, height: 3, rx: 1.5, fill: extra, opacity: .8, transform: `rotate(${i * 20 - 20} ${x + dx} ${y + dy})` });
        });
        break;
      }
      case "maiz": {                // granos de choclo
        [[-6, -3], [0, -5], [6, -3], [-3, 3], [3, 3], [-8, 1]].forEach(([dx, dy]) => {
          add(g, "ellipse", { cx: x + dx, cy: y + dy, rx: 3, ry: 3.4, fill: color });
          add(g, "ellipse", { cx: x + dx - 0.8, cy: y + dy - 1, rx: 1.3, ry: 1.6, fill: extra, opacity: .85 });
        });
        break;
      }
      case "semillas": {            // mix de sésamo y chía
        const rnd = rng(555);
        for (let k = 0; k < 12; k++) {
          const dx = -9 + rnd() * 18, dy = -8 + rnd() * 16;
          if (k % 2) add(g, "ellipse", { cx: x + dx, cy: y + dy, rx: 2, ry: 1.2, fill: "#EFE3B8", transform: `rotate(${rnd() * 180} ${x + dx} ${y + dy})` });
          else add(g, "circle", { cx: x + dx, cy: y + dy, r: 1.4, fill: "#3B2E1C" });
        }
        break;
      }
      case "wakame": {              // algas brillantes
        [[-6, 0], [4, -3], [1, 5]].forEach(([dx, dy], i) => {
          add(g, "path", { d: `M${x + dx} ${y + dy} q 7 -9 13 -1 q -6 9 -13 1 z`, fill: color, transform: `rotate(${i * 40 - 40} ${x + dx} ${y + dy})` });
          add(g, "path", { d: `M${x + dx + 1} ${y + dy - 1} q 5 -5 9 -1`, fill: "none", stroke: extra, "stroke-width": 1.2, opacity: .7, transform: `rotate(${i * 40 - 40} ${x + dx} ${y + dy})` });
        });
        break;
      }
      case "cebolla": {             // cebolla crispy (hilos dorados)
        const rnd = rng(88);
        for (let k = 0; k < 6; k++) {
          const dx = -9 + rnd() * 18, dy = -6 + rnd() * 12;
          add(g, "path", { d: `M${x + dx} ${y + dy} q 4 -5 9 -1`, fill: "none", stroke: k % 2 ? color : dark, "stroke-width": 2.4, "stroke-linecap": "round", transform: `rotate(${rnd() * 120 - 60} ${x + dx} ${y + dy})` });
        }
        break;
      }
      case "queso-crema": {         // quenelles de queso crema
        [[-4, -1], [5, 3]].forEach(([dx, dy]) => {
          add(g, "ellipse", { cx: x + dx, cy: y + dy, rx: 7, ry: 5.5, fill: color });
          add(g, "ellipse", { cx: x + dx - 1.5, cy: y + dy - 1.8, rx: 3, ry: 2, fill: "#fff", opacity: .7 });
        });
        break;
      }
      case "zanahoria": {           // bastones en juliana
        [-20, 6, 32, -8].forEach((rot, i) => {
          const dx = (i - 1.5) * 4;
          add(g, "rect", { x: x + dx - 2, y: y - 9, width: 4, height: 18, rx: 2, fill: color, transform: `rotate(${rot} ${x + dx} ${y})` });
          add(g, "rect", { x: x + dx - 0.8, y: y - 8, width: 1.4, height: 15, rx: 0.7, fill: extra, opacity: .7, transform: `rotate(${rot} ${x + dx} ${y})` });
        });
        break;
      }
      case "cebollin": {            // aros de cebollín picado
        const rnd = rng(42);
        for (let k = 0; k < 7; k++) {
          const dx = -8 + rnd() * 16, dy = -7 + rnd() * 14;
          add(g, "circle", { cx: x + dx, cy: y + dy, r: 2.4, fill: "none", stroke: color, "stroke-width": 1.8 });
        }
        break;
      }
      default: {                    // genérico con volumen
        add(g, "circle", { cx: x - 3, cy: y, r: 8, fill: color });
        add(g, "circle", { cx: x + 6, cy: y + 2, r: 6, fill: color });
        gloss(x - 3, y, 8);
      }
    }
  }

  /* ============ I) WHATSAPP ============ */
  function buildOrderMessage(order) {
    // order opcional: si no se pasa, usa el estado actual del configurador
    const src = order || {
      base: state.base, protein: state.protein,
      toppings: [...state.toppings], sauce: state.sauce,
    };
    const nombre = (g, id) => (id ? findItem(g, id).name : "—");
    const extras = (src.toppings && src.toppings.length)
      ? src.toppings.map((id) => findItem("toppings", id).name).join(", ")
      : "—";

    return [
      CONFIG.saludo,
      "",
      "Quiero pedir este bowl:",
      `• Base: ${nombre("base", src.base)}`,
      `• Proteína: ${nombre("protein", src.protein)}`,
      `• Extras: ${extras}`,
      `• Salsa: ${nombre("sauce", src.sauce)}`,
      `• Precio: ${money(CONFIG.precioBowl)}`,
      "",
      "¡Muchas gracias!",
    ].join("\n");
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  }

  function handleOrderClick() {
    if (!state.base || !state.protein) {
      toast("Elegí al menos una base y una proteína 🥑");
      $("#constructor").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      return;
    }
    openWhatsApp(buildOrderMessage());
  }

  /* ============ J) FAVORITOS / GALERÍA / RESEÑAS ============ */
  function renderFavoritos() {
    const grid = $("#favGrid");
    grid.innerHTML = FAVORITOS.map((f, i) => `
      <article class="fav-card reveal" style="transition-delay:${i * 70}ms">
        <div class="fav-card__media">
          <span class="fav-card__tag">${f.tag}</span>
          <img src="${f.img}" alt="Bowl ${f.name}" loading="lazy" width="300" height="225" />
        </div>
        <div class="fav-card__body">
          <h3 class="fav-card__name">${f.name}</h3>
          <p class="fav-card__desc">${f.desc}</p>
          <div class="fav-card__foot">
            <span class="fav-card__price">${money(f.price)}</span>
            <button class="btn btn--wa fav-card__btn" data-fav="${i}" type="button">
              <img src="assets/icons/whatsapp.svg" alt="" width="16" height="16" aria-hidden="true" /> Pedir
            </button>
          </div>
        </div>
      </article>`).join("");

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-fav]");
      if (!btn) return;
      const fav = FAVORITOS[Number(btn.dataset.fav)];
      openWhatsApp(buildOrderMessage(fav.order));
    });
  }

  function renderGaleria() {
    $("#masonry").innerHTML = GALERIA.map((g) => `
      <figure class="masonry__item reveal">
        <img src="${g.img}" alt="${g.alt}" loading="lazy" width="520" height="520" />
      </figure>`).join("");
  }

  function renderResenas() {
    const stars = '<img src="assets/icons/estrella.svg" alt="" aria-hidden="true" />'.repeat(5);
    $("#reviewGrid").innerHTML = RESENAS.map((r, i) => `
      <article class="review reveal" style="transition-delay:${i * 70}ms">
        <div class="review__stars" aria-label="5 de 5 estrellas">${stars}</div>
        <p class="review__text">“${r.text}”</p>
        <div class="review__author">
          <span class="review__avatar" style="background:${r.color}" aria-hidden="true">${r.name.charAt(0)}</span>
          <span>
            <span class="review__name">${r.name}</span><br />
            <span class="review__meta">${r.meta}</span>
          </span>
        </div>
      </article>`).join("");
  }

  /* ============ K) UI GLOBAL ============ */
  function initHeaderScroll() {
    const header = $("#siteHeader");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const menu = $("#mobileMenu");
    const toggle = $("#navToggle");
    const close = $("#menuClose");
    const open = () => {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add("is-open"));
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const shut = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(() => { menu.hidden = true; }, 400);
    };
    toggle.addEventListener("click", open);
    close.addEventListener("click", shut);
    $$("a", menu).forEach((a) => a.addEventListener("click", shut));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) shut(); });
  }

  function initReveal() {
    const items = $$(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
  }

  // Vuelve a observar elementos generados dinámicamente (favoritos, galería, reseñas)
  function revealDynamic() {
    const items = $$(".fav-card.reveal, .masonry__item.reveal, .review.reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    items.forEach((el) => io.observe(el));
  }

  function initMiniBar() {
    const bar = $("#miniBar");
    const builder = $("#constructor");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Mostramos la mini-barra solo mientras el configurador está en pantalla
        bar.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, { threshold: 0.08 });
    io.observe(builder);
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
  }

  function initSmoothParallax() {
    if (prefersReducedMotion) return;
    const bowl = $(".hero__bowl");
    if (!bowl) return;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) bowl.style.setProperty("--pl", `${y * 0.04}px`);
    }, { passive: true });
  }

  /* ============ L) INIT ============ */
  function init() {
    // Configurador
    renderOptions();
    bindSelection();
    renderPreview();
    update();

    // Botones de pedido
    $("#orderBtn").addEventListener("click", handleOrderClick);
    $("#miniOrderBtn").addEventListener("click", handleOrderClick);

    // Enlaces "Pedir" genéricos (header, footer, menú)
    $$("[data-wa-plain]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      openWhatsApp(`${CONFIG.saludo}\n\nQuisiera hacer un pedido 🥗`);
    }));

    // Contenido
    renderFavoritos();
    renderGaleria();
    renderResenas();

    // UI
    initHeaderScroll();
    initMobileMenu();
    initReveal();
    revealDynamic();
    initMiniBar();
    initSmoothParallax();

    // Año del footer
    $("#year").textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
