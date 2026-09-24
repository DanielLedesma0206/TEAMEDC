/* =====================================================================
   02-bloque2-modulos-didacticos.js · BLOQUE 2 · MÓDULOS DIDÁCTICOS
   =====================================================================
   1 Teoría · 2 Catálogo · 4 Compatibilidad+Diagnóstico
   5 Autoevaluación · 6 Glosario  +  Menú principal
   -----------------------------------------------------------------
   Todo esto va DENTRO de una función que se ejecuta sola: (function(){ ... })();
   Eso se llama IIFE y sirve para que las variables de los módulos
   (CATALOG, POOL, etc.) NO se mezclen con las del ensamblaje de arriba.
   Cada módulo tiene su propia función renderX() que "pinta" su pantalla.
   ===================================================================== */
(function () {

  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------------- Navegación entre módulos ---------------- */
  /* ---------------- Navegación entre módulos ---------------- */
function setupModuleNav() {
  const btns = document.querySelectorAll(".modnav-btn");
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.classList.toggle("is-active", x === b));
    document.querySelectorAll(".module").forEach(m => m.classList.toggle("is-active", m.id === b.dataset.mod));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
}

  /* =================================================================
     MÓDULO 1 · TEORÍA  (3 apartados: Arquitectura · Memoria · Componentes)
     ================================================================= */
  const VN = [
  { t: "Entrada", d: "Dispositivos que introducen datos al sistema (teclado, mouse, sensores). Convierten la acción del usuario o del entorno en datos que el CPU puede procesar." },
  { t: "CPU (UC + ALU + Registros)", d: "La Unidad Central de Proceso ejecuta las instrucciones. Integra la Unidad de Control (coordina), la ALU (opera) y los Registros (memoria ultrarrápida interna)." },
  { t: "Salida", d: "Dispositivos que entregan resultados (monitor, impresora, bocinas). Transforman los datos procesados en información para el usuario." },
  { t: "Memoria principal (RAM)", d: "Guarda datos e instrucciones del programa en ejecución. El CPU la lee y escribe constantemente; es volátil (se borra al apagar)." },
  { t: "Buses del sistema", d: "Canales que comunican CPU, memoria y E/S. Se dividen en bus de datos, bus de direcciones y bus de control." }
];
const SUBCPU = [
  { t: "Unidad de Control (UC)", d: "Interpreta cada instrucción y coordina a las demás unidades mediante señales de control; decide qué se hace y cuándo." },
  { t: "ALU (Unidad Aritmético-Lógica)", d: "Realiza operaciones aritméticas (suma, resta) y lógicas (AND, OR, comparaciones)." },
  { t: "Registros", d: "Memoria ultrarrápida dentro del CPU para datos inmediatos: contador de programa (PC), registro de instrucción (IR), acumulador, etc." }
];
const BUSES = [
  { t: "Bus de datos", d: "Transporta la información (los valores). Su ancho en bits define cuántos datos se mueven a la vez (8, 16, 32, 64 bits)." },
  { t: "Bus de direcciones", d: "Indica la posición de memoria a leer o escribir. Su ancho define cuánta memoria se puede direccionar (p. ej. 32 bits ≈ 4 GB)." },
  { t: "Bus de control", d: "Lleva señales de coordinación: lectura/escritura, reloj, interrupciones y estado." }
];
const CYCLE = [
  { t: "1 · Búsqueda (Fetch)", d: "La Unidad de Control lee de la memoria la siguiente instrucción, usando el contador de programa (PC)." },
  { t: "2 · Decodificación (Decode)", d: "La UC interpreta qué operación es y qué operandos necesita." },
  { t: "3 · Ejecución (Execute)", d: "La ALU u otra unidad realiza la operación indicada." },
  { t: "4 · Escritura (Write-back)", d: "El resultado se guarda en un registro o en memoria y el PC avanza a la siguiente instrucción." }
];
const MEM = [
  { t: "Registros", v: "≈ <1 ns", s: "bytes", r: "Dentro del CPU; lo más rápido y lo más caro." },
  { t: "Caché L1 / L2 / L3", v: "≈ 1–10 ns", s: "KB – MB", r: "Guarda datos frecuentes cerca del CPU para no ir siempre a la RAM." },
  { t: "Memoria RAM", v: "≈ 50–100 ns", s: "GB", r: "Memoria de trabajo del programa en ejecución; volátil." },
  { t: "SSD NVMe", v: "≈ 10–100 µs", s: "cientos de GB – TB", r: "Almacenamiento permanente muy rápido (bus PCIe)." },
  { t: "Disco duro (HDD)", v: "≈ 5–10 ms", s: "TB", r: "Almacenamiento masivo, permanente y económico." }
];
const THEORY = [
  { ico: "🔲", col: "#6bbdff", t: "Tarjeta madre", tag: "El punto de encuentro de todo",
    def: "Plataforma que interconecta todos los componentes y define gran parte de la compatibilidad.",
    points: ["Socket", "Chipset", "Ranuras RAM", "PCIe/SATA", "BIOS/UEFI"],
    clave: "Si el socket o el tipo de RAM no coinciden con la placa, el componente no funciona.",
    chk: { q: "¿Qué elemento de la placa determina qué CPU es compatible?", a: "El socket (y el chipset)." } },
  { ico: "⚙️", col: "#ffb86b", t: "Procesador (CPU)", tag: "Ejecuta las instrucciones",
    def: "Ejecuta el ciclo de instrucción y coordina las operaciones del sistema.",
    points: ["Núcleos/hilos", "Frecuencia", "Caché", "TDP", "Socket"],
    clave: "Más núcleos y frecuencia = más rendimiento, pero más calor (TDP) que disipar.",
    chk: { q: "¿Qué unidad del CPU realiza las operaciones aritméticas y lógicas?", a: "La ALU." } },
  { ico: "🧬", col: "#8affd6", t: "Memoria RAM", tag: "Mesa de trabajo temporal",
    def: "Memoria volátil que guarda datos e instrucciones en uso; se borra al apagar.",
    points: ["Volátil", "Capacidad", "Velocidad", "DDR4/DDR5", "Dual channel"],
    clave: "Dos módulos en A2/B2 activan el dual channel y mejoran el ancho de banda.",
    chk: { q: "¿La RAM conserva los datos al apagar la PC?", a: "No: es volátil." } },
  { ico: "💾", col: "#b98cff", t: "Almacenamiento", tag: "Memoria permanente",
    def: "Conserva la información aunque se apague. Es memoria secundaria, distinta de la RAM.",
    points: ["HDD", "SSD SATA", "SSD NVMe", "Capacidad", "Velocidad"],
    clave: "Un SSD NVMe puede ser mucho más rápido que un HDD al arrancar y cargar.",
    chk: { q: "¿Qué es más rápido: HDD o SSD NVMe?", a: "El SSD NVMe, por mucho." } },
  { ico: "🎮", col: "#ff7ad1", t: "GPU", tag: "Motor gráfico",
    def: "Procesa gráficos, video y cálculos en paralelo. Integrada (en CPU) o dedicada.",
    points: ["VRAM", "Consumo", "PCIe x16", "Salidas de video"],
    clave: "Sin GPU dedicada ni gráficos integrados, no hay imagen en pantalla.",
    chk: { q: "¿Qué memoria usa una GPU dedicada?", a: "Su VRAM propia." } },
  { ico: "🔌", col: "#ffe66b", t: "Fuente de poder", tag: "Energía del sistema",
    def: "Transforma la corriente y distribuye energía estable a todos los componentes.",
    points: ["Potencia (W)", "80+", "Modular", "ATX/EPS/PCIe/SATA"],
    clave: "Si los watts no alcanzan para CPU + GPU, el equipo se apaga o no enciende.",
    chk: { q: "¿Qué conector alimenta el CPU?", a: "El EPS de 8 pines." } },
  { ico: "🖥️", col: "#7ed7ff", t: "Gabinete", tag: "Estructura y flujo de aire",
    def: "Aloja y protege; su factor de forma define qué placa cabe y cómo circula el aire.",
    points: ["ATX/mATX/ITX", "Espacio GPU", "Radiadores", "Ventilación"],
    clave: "Una placa ATX no entra en un gabinete que sólo admite ITX.",
    chk: { q: "¿Qué determina el factor de forma del gabinete?", a: "El tamaño de placa (y GPU) que admite." } },
  { ico: "❄️", col: "#52ffb8", t: "Enfriamiento", tag: "Control de temperatura",
    def: "Disipadores/ventiladores (aire) o refrigeración líquida que extraen el calor.",
    points: ["Aire vs AIO", "Disipación (W)", "CPU_FAN", "Flujo de aire"],
    clave: "Si el disipador no cubre el TDP del CPU, hay throttling o daño.",
    chk: { q: "¿A qué cabezal se conecta el ventilador del disipador?", a: "Al CPU_FAN." } },
  { ico: "⌨️", col: "#a0b0d6", t: "Periféricos", tag: "Interacción con el usuario",
    def: "Dispositivos de entrada, salida o mixtos que comunican al usuario con la PC.",
    points: ["Entrada", "Salida", "USB/HDMI/DP", "Audio"],
    clave: "Con GPU dedicada, el monitor se conecta a la salida de la GPU, no a la placa.",
    chk: { q: "¿El teclado es dispositivo de entrada o salida?", a: "De entrada." } },
  { ico: "⚡", col: "#ff9b9b", t: "Arranque (POST/BIOS)", tag: "De apagado a escritorio",
    def: "El firmware ejecuta el POST, inicializa el hardware vía BIOS/UEFI y carga el SO.",
    points: ["POST", "BIOS/UEFI", "Detección HW", "Carga del SO"],
    clave: "Un fallo de POST (RAM, CPU, video) impide el arranque; suele avisarse con beeps/LEDs.",
    chk: { q: "¿Qué hace el POST?", a: "Un autodiagnóstico del hardware al encender." } }
];

let teoTab = "arq";

/* Inyecta una sola vez los estilos de este apartado (diagrama simple con
   animación suave). Se hace desde el JS para que se vea bien sin importar
   en qué archivo CSS estén el resto de los estilos. */
function injectTeoStyles() {
  if (document.getElementById("teoStyles")) return;
  const css = `
  .t3-wrap{display:grid;gap:18px;max-width:920px;margin:0 auto}
  .t3-card{background:var(--bg-panel,#161821);border:1px solid var(--border,#2a2e3d);border-radius:16px;padding:20px 22px}
  .t3-h{margin:0 0 4px;font-size:20px;color:#fff}
  .t3-subh{margin:0 0 4px;font-size:17px;color:#fff}
  .t3-desc{margin:0 0 14px;color:var(--text-dim,#9aa3bd);font-size:14px;line-height:1.55}
  .t3-desc strong{color:#cdd7f5;font-weight:600}

  /* Diagrama SVG de von Neumann */
  .t3-svg{display:block;width:100%;max-width:600px;height:auto;margin:6px auto 2px}
  .t3-wire{stroke:#4a90b8;stroke-width:3;stroke-linecap:round;stroke-dasharray:5 9;animation:t3flow 1.1s linear infinite}
  @keyframes t3flow{to{stroke-dashoffset:-14}}
  .t3-svg .t3-bus-rect{fill:rgba(126,215,255,.12);stroke:#7ed7ff;stroke-width:1.5}
  .t3-node{cursor:pointer}
  .t3-node rect{fill:#191c27;stroke:var(--border,#2a2e3d);stroke-width:1.5;transition:stroke .2s,fill .2s}
  .t3-node:hover rect{stroke:#7ed7ff}
  .t3-node.sel rect{stroke:var(--nc,#7ed7ff);stroke-width:2.5}
  .t3-ico{font-size:26px}
  .t3-name{fill:#eaf0ff;font-size:14px;font-weight:700}
  .t3-label{fill:#04121e;font-size:12px;font-weight:800;letter-spacing:1px}
  .t3-cpu-glow{fill:#ffb86b;opacity:0;animation:t3pulse 2.6s ease-in-out infinite}
  @keyframes t3pulse{0%,100%{opacity:0}50%{opacity:.16}}

  /* Recuadro de detalle */
  .t3-detail{margin-top:8px;border:1px solid var(--border,#2a2e3d);border-left:3px solid #7ed7ff;border-radius:12px;
    background:rgba(126,215,255,.06);padding:13px 15px;min-height:66px}
  .t3-dtitle{display:flex;align-items:center;gap:8px;color:#fff;font-weight:700;font-size:15px}
  .t3-dot{width:11px;height:11px;border-radius:50%;flex:0 0 auto}
  .t3-detail p{margin:6px 0 0;color:#cdd7f5;font-size:14px;line-height:1.55}

  /* Ciclo de instrucción */
  .t3-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
  .t3-step{display:flex;gap:12px;align-items:flex-start;padding:13px 14px;border-radius:12px;background:#191c27;
    border:1px solid var(--border,#2a2e3d);animation:t3in .5s ease both}
  .t3-step-n{width:28px;height:28px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;
    font-weight:800;font-size:13px;color:#04121e;background:#7ed7ff}
  .t3-step h4{margin:0 0 3px;font-size:13.5px;color:#fff}
  .t3-step p{margin:0;color:#c7d2f5;font-size:12.5px;line-height:1.4}
  @keyframes t3in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

  /* Jerarquía de memoria */
  .t3-mem{display:grid;gap:10px}
  .t3-lvl{border:1px solid var(--border,#2a2e3d);border-left:4px solid var(--c);border-radius:12px;background:#191c27;
    padding:13px 15px;animation:t3in .5s ease both}
  .t3-lvl-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
  .t3-lvl-top strong{color:#fff;font-size:14.5px}
  .t3-lvl-v{color:var(--c);font-weight:700;font-size:13px;white-space:nowrap}
  .t3-lvl p{margin:5px 0 4px;color:#c7d2f5;font-size:13px;line-height:1.45}
  .t3-lvl-cap{color:var(--text-dim,#9aa3bd);font-size:12px}

  /* Componentes */
  .t3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
  .t3-comp{padding:16px;border-radius:14px;background:#191c27;border:1px solid var(--border,#2a2e3d);
    border-top:3px solid var(--c);animation:t3in .5s ease both}
  .t3-comp-ico{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-size:22px;margin-bottom:10px;
    background:color-mix(in srgb,var(--c) 16%,transparent)}
  .t3-comp h4{margin:0 0 2px;font-size:15px;color:#fff}
  .t3-comp-tag{display:block;margin-bottom:8px;font-size:12px;color:var(--c)}
  .t3-comp p{margin:0;color:#c7d2f5;font-size:13px;line-height:1.5}

  @media(prefers-reduced-motion:reduce){
    .t3-wire,.t3-cpu-glow,.t3-step,.t3-lvl,.t3-comp{animation:none}
  }
  `;
  const st = document.createElement("style");
  st.id = "teoStyles";
  st.textContent = css;
  document.head.appendChild(st);
}

function renderTheory() {
  injectTeoStyles();
  const host = document.getElementById("modTeoria");
  host.innerHTML =
    `<h2 class="mod-head">1 · Introducción teórica</h2>
     <p class="mod-sub">Una introducción visual a cómo funciona una computadora. Elige un apartado.</p>
     <div class="subtabs">
       <button class="subtab is-active" data-t="arq">🧠 Arquitectura</button>
       <button class="subtab" data-t="mem">🗂️ Jerarquía de memoria</button>
       <button class="subtab" data-t="comp">🧩 Componentes</button>
     </div>
     <div id="teoContent"></div>`;
  host.querySelectorAll(".subtab").forEach(b => b.addEventListener("click", () => { teoTab = b.dataset.t; paintTeo(); }));
  paintTeo();
}
function paintTeo() {
  document.querySelectorAll("#modTeoria .subtab").forEach(b => b.classList.toggle("is-active", b.dataset.t === teoTab));
  const c = document.getElementById("teoContent");
  if (teoTab === "arq") renderArq(c);
  else if (teoTab === "mem") renderMem(c);
  else renderComp(c);
}

/* Recuadro de detalle: título con punto de color + descripción. */
function setDetail(el, title, desc, color) {
  el.innerHTML = `<span class="t3-dtitle"><span class="t3-dot" style="background:${color}"></span>${title}</span><p>${desc}</p>`;
}

/* ---------- Arquitectura: diagrama SVG animado + ciclo ---------- */
function renderArq(c) {
  c.innerHTML =
    `<div class="t3-wrap">
       <div class="t3-card">
         <h2 class="t3-h">¿Cómo funciona una computadora?</h2>
         <p class="t3-desc">Sigue el modelo de <strong>von Neumann</strong>: los datos entran, el <strong>CPU</strong> los procesa con ayuda de la <strong>memoria</strong>, y salen los resultados. Fíjate cómo fluye la información por los cables, y toca un bloque para leer qué hace.</p>
         <svg class="t3-svg" viewBox="0 0 640 372" role="img" aria-label="Diagrama de von Neumann">
           <rect class="t3-cpu-glow" x="239" y="24" width="162" height="122" rx="16"></rect>
           <line class="t3-wire" x1="170" y1="85" x2="245" y2="85"></line>
           <line class="t3-wire" x1="395" y1="85" x2="470" y2="85"></line>
           <line class="t3-wire" x1="320" y1="140" x2="320" y2="185"></line>
           <line class="t3-wire" x1="320" y1="229" x2="320" y2="275"></line>
           <g class="t3-node" data-k="bus"><rect class="t3-bus-rect" x="20" y="185" width="600" height="44" rx="12"></rect><text class="t3-label" x="320" y="212" text-anchor="middle">BUS DEL SISTEMA</text></g>
           <g class="t3-node" data-k="in"><rect x="20" y="40" width="150" height="90" rx="12"></rect><text class="t3-ico" x="95" y="84" text-anchor="middle">⌨️</text><text class="t3-name" x="95" y="114" text-anchor="middle">Entrada</text></g>
           <g class="t3-node" data-k="cpu"><rect x="245" y="30" width="150" height="110" rx="14"></rect><text class="t3-ico" x="320" y="82" text-anchor="middle">⚙️</text><text class="t3-name" x="320" y="114" text-anchor="middle">CPU</text></g>
           <g class="t3-node" data-k="out"><rect x="470" y="40" width="150" height="90" rx="12"></rect><text class="t3-ico" x="545" y="84" text-anchor="middle">🖥️</text><text class="t3-name" x="545" y="114" text-anchor="middle">Salida</text></g>
           <g class="t3-node" data-k="mem"><rect x="245" y="275" width="150" height="80" rx="12"></rect><text class="t3-ico" x="320" y="314" text-anchor="middle">🧬</text><text class="t3-name" x="320" y="342" text-anchor="middle">Memoria (RAM)</text></g>
         </svg>
         <div class="t3-detail" id="t3det"></div>
       </div>

       <div class="t3-card">
         <h3 class="t3-subh">El ciclo de instrucción</h3>
         <p class="t3-desc" style="margin-bottom:12px">El CPU repite estos cuatro pasos, muy rápido y en orden:</p>
         <div class="t3-steps" id="t3steps"></div>
       </div>
     </div>`;

  const det = c.querySelector("#t3det");
  const map = { in: { i: 0, c: "#6bbdff" }, cpu: { i: 1, c: "#ffb86b" }, out: { i: 2, c: "#6bbdff" }, mem: { i: 3, c: "#8affd6" }, bus: { i: 4, c: "#7ed7ff" } };

  setDetail(det, "El modelo de von Neumann", "Una sola memoria guarda los datos y las instrucciones; el CPU las lee y ejecuta una por una. Toca cualquier bloque del diagrama para ver su función.", "#7ed7ff");

  c.querySelectorAll(".t3-node").forEach(n => n.addEventListener("click", () => {
    const m = map[n.dataset.k];
    c.querySelectorAll(".t3-node").forEach(x => x.classList.remove("sel"));
    n.classList.add("sel"); n.style.setProperty("--nc", m.c);
    setDetail(det, VN[m.i].t, VN[m.i].d, m.c);
  }));

  const steps = c.querySelector("#t3steps");
  CYCLE.forEach((s, i) => {
    const d = document.createElement("div");
    d.className = "t3-step"; d.style.animationDelay = (i * 90) + "ms";
    d.innerHTML = `<span class="t3-step-n">${i + 1}</span><div><h4>${s.t.replace(/^\d+\s*·\s*/, "")}</h4><p>${s.d}</p></div>`;
    steps.appendChild(d);
  });
}

/* ---------- Jerarquía de memoria ---------- */
function renderMem(c) {
  const colors = ["#52ffb8", "#7ed7ff", "#6bbdff", "#b98cff", "#ff9b9b"];
  const rows = MEM.map((m, i) =>
    `<div class="t3-lvl" style="--c:${colors[i % colors.length]};animation-delay:${i * 70}ms">
       <div class="t3-lvl-top"><strong>${m.t}</strong><span class="t3-lvl-v">${m.v}</span></div>
       <p>${m.r}</p>
       <span class="t3-lvl-cap">Capacidad típica: ${m.s}</span>
     </div>`).join("");
  c.innerHTML =
    `<div class="t3-wrap"><div class="t3-card">
       <h2 class="t3-h">Jerarquía de memoria</h2>
       <p class="t3-desc">No toda la memoria es igual. Cuanto más arriba en la lista, más <strong>rápida</strong> (y más cara y pequeña). De la más veloz a la más grande:</p>
       <div class="t3-mem">${rows}</div>
     </div></div>`;
}

/* ---------- Componentes ---------- */
function renderComp(c) {
  const cards = THEORY.map((it, i) =>
    `<div class="t3-comp" style="--c:${it.col};animation-delay:${i * 50}ms">
       <div class="t3-comp-ico">${it.ico}</div>
       <h4>${it.t}</h4><span class="t3-comp-tag">${it.tag}</span>
       <p>${it.def}</p>
     </div>`).join("");
  c.innerHTML =
    `<div class="t3-wrap"><div class="t3-card">
       <h2 class="t3-h">Los componentes</h2>
       <p class="t3-desc">Estas son las piezas principales de una computadora y para qué sirve cada una.</p>
       <div class="t3-grid">${cards}</div>
     </div></div>`;
}

  /* =================================================================
     MÓDULO 2 · CATÁLOGO
     ================================================================= */
  const CATALOG = [
  { name: "Gabinete", vis: "case", emoji: "🖥️", resumen: "Estructura, protección y factor de forma.",
    qa: { quees: "El chasis que aloja y protege todos los componentes.", funcion: "Soporte físico, organización del espacio y flujo de aire.", comunicacion: "Aloja la placa y sujeta fuente, discos y ventiladores.", carac: "Factor de forma, espacio para GPU/radiadores, bahías.", errores: "Elegir un gabinete que no admite el tamaño de la placa o GPU.", incompat: "Placa ATX en gabinete sólo-ITX: no entra.", rend: "Buen flujo de aire = temperaturas bajas y sin throttling." },
    tabla: { cols: ["Formato", "Admite placas", "Notas"], rows: [["Full/Mid Tower", "ATX y menores", "Mejor flujo y espacio"], ["MicroATX", "microATX e ITX", "Compacto"], ["Mini-ITX", "solo ITX", "Muy compacto"]] },
    elegir: ["Que admita tu tarjeta madre", "Espacio suficiente para la GPU y el disipador", "Buen flujo de aire y filtros de polvo"] },
  { name: "Fuente de poder", vis: "psu", emoji: "🔌", resumen: "Convierte y distribuye la energía.",
    qa: { quees: "Transforma la corriente en voltajes para la PC.", funcion: "Entrega energía estable a placa, CPU, GPU y discos.", comunicacion: "Cables ATX 24, EPS 8 (CPU), PCIe (GPU) y SATA (discos).", carac: "Potencia (W), certificación 80+, modular, conectores.", errores: "Fuente de baja potencia o de mala calidad.", incompat: "Watts insuficientes: se apaga o no enciende.", rend: "Holgada = estable; justa = apagones bajo carga." },
    tabla: { cols: ["Certificación 80+", "Eficiencia aprox.", "Nivel"], rows: [["Bronze", "82–85%", "Básica"], ["Gold", "87–90%", "Recomendada"], ["Platinum", "90–92%", "Premium"]] },
    elegir: ["Potencia con ~30% de margen sobre el consumo", "Que traiga los conectores de CPU y GPU necesarios", "Modular para mejor cableado y flujo de aire"] },
  { name: "Tarjeta madre", vis: "mobo", emoji: "🔲", resumen: "Plataforma de interconexión.",
    qa: { quees: "La placa que conecta todos los componentes.", funcion: "Comunica CPU, RAM, almacenamiento y expansión.", comunicacion: "Define socket, ranuras RAM, PCIe, SATA y cabezales.", carac: "Socket, chipset, tipo de RAM, factor de forma, BIOS/UEFI.", errores: "Socket distinto al del CPU.", incompat: "AM4 no entra en LGA1700; DDR5 no entra en placa DDR4.", rend: "El chipset define líneas PCIe, velocidad de RAM y overclock." },
    tabla: { cols: ["Formato", "Tamaño", "Ranuras (aprox.)"], rows: [["ATX", "Grande", "4 RAM, varias PCIe"], ["microATX", "Mediano", "2–4 RAM"], ["Mini-ITX", "Pequeño", "2 RAM, 1 PCIe"]] },
    elegir: ["Socket y chipset acordes al CPU", "Formato acorde al gabinete", "Puertos, PCIe y M.2 que necesites"] },
  { name: "Procesador (CPU)", vis: "cpu", emoji: "⚙️", resumen: "Ejecuta las instrucciones.",
    qa: { quees: "El 'cerebro' que ejecuta las instrucciones.", funcion: "Procesa datos y coordina las operaciones.", comunicacion: "Habla con la RAM y el resto vía buses de la placa.", carac: "Núcleos/hilos, frecuencia, caché, TDP y socket.", errores: "No poner pasta térmica o socket incompatible.", incompat: "Si el socket no coincide, no encaja.", rend: "Más núcleos/frecuencia = más rendimiento; el TDP exige enfriamiento." },
    tabla: { cols: ["Socket", "Marca", "Ejemplo", "RAM"], rows: [["AM4", "AMD", "Ryzen 5000", "DDR4"], ["AM5", "AMD", "Ryzen 7000", "DDR5"], ["LGA1700", "Intel", "12–14ª gen", "DDR4/DDR5"]] },
    elegir: ["El socket debe coincidir con la placa", "Núcleos/hilos según la carga (juego, edición, cálculo)", "Vigilar el TDP y el enfriamiento requerido"] },
  { name: "Memoria RAM", vis: "ram", emoji: "🧬", resumen: "Memoria temporal de trabajo.",
    qa: { quees: "Memoria volátil de acceso rápido.", funcion: "Guarda temporalmente lo que el CPU usa.", comunicacion: "Se comunica con el CPU por el bus de memoria.", carac: "Capacidad, velocidad, tecnología DDR y canales.", errores: "Una sola ranura (sin dual channel) o módulos incompatibles.", incompat: "DDR4 no entra en placa DDR5 (muesca distinta).", rend: "Más RAM y dual channel mejoran multitarea." },
    tabla: { cols: ["Tecnología", "Voltaje", "Velocidades típicas"], rows: [["DDR3", "1.5 V", "1333–1866 MHz"], ["DDR4", "1.2 V", "2400–3600 MHz"], ["DDR5", "1.1 V", "4800–6400+ MHz"]] },
    elegir: ["Debe coincidir con la placa (DDR4 ≠ DDR5)", "Dos módulos para activar dual channel", "16 GB como mínimo recomendado hoy"] },
  { name: "Almacenamiento", vis: "ssd", emoji: "💾", resumen: "Guarda la información permanentemente.",
    qa: { quees: "Donde se conserva el SO, programas y archivos.", funcion: "Almacena datos de forma permanente.", comunicacion: "M.2/NVMe (PCIe) o SATA (datos + poder).", carac: "Tipo (HDD/SATA/NVMe), capacidad, velocidad.", errores: "No conectar el cable de datos o de poder.", incompat: "Sin almacenamiento no hay dónde instalar el SO.", rend: "Un NVMe acelera enormemente el arranque y la carga." },
    tabla: { cols: ["Tipo", "Interfaz", "Velocidad aprox."], rows: [["HDD", "SATA", "~150 MB/s"], ["SSD SATA", "SATA III", "~550 MB/s"], ["SSD NVMe", "PCIe", "2000–7000 MB/s"]] },
    elegir: ["NVMe para el sistema operativo y programas", "HDD para almacenamiento masivo económico", "Capacidad según tu necesidad real"] },
  { name: "GPU", vis: "gpu", emoji: "🎮", resumen: "Procesa gráficos e imágenes.",
    qa: { quees: "Unidad de procesamiento gráfico, integrada o dedicada.", funcion: "Genera y acelera imágenes, video y cálculo paralelo.", comunicacion: "Ranura PCIe x16 y cable PCIe de poder.", carac: "VRAM, consumo (W), interfaz PCIe, salidas de video.", errores: "No conectar el PCIe de poder o fuente insuficiente.", incompat: "Sin GPU ni iGPU, no hay imagen.", rend: "Clave en juegos, edición, 3D e IA; a más VRAM/potencia, más capacidad." },
    tabla: { cols: ["Tipo", "VRAM", "Consumo", "Uso"], rows: [["Integrada", "comparte RAM", "baja", "Oficina/multimedia"], ["Gama media", "8 GB", "~115 W", "Juegos 1080p"], ["Gama alta", "16–24 GB", "~300–450 W", "4K, IA, 3D"]] },
    elegir: ["VRAM según resolución y uso", "Verificar consumo vs potencia de la fuente", "Tamaño físico vs espacio del gabinete"] },
  { name: "Sistema de enfriamiento", vis: "cooler", emoji: "❄️", resumen: "Controla la temperatura.",
    qa: { quees: "Disipadores/ventiladores (aire) o líquida (AIO).", funcion: "Extrae el calor del CPU y del gabinete.", comunicacion: "Ventilador/bomba al cabezal CPU_FAN.", carac: "Disipación (W), tamaño, tipo (aire/líquida).", errores: "Disipador insuficiente para el TDP o mal montado.", incompat: "Si no disipa el TDP del CPU, se sobrecalienta.", rend: "Buen enfriamiento evita throttling." },
    tabla: { cols: ["Tipo", "Disipación", "Notas"], rows: [["Stock", "~65 W", "Incluido con el CPU"], ["Torre de aire", "~150–220 W", "Silencioso y económico"], ["Líquida AIO", "~250 W+", "Mejor en CPUs potentes"]] },
    elegir: ["Debe superar el TDP del CPU", "Altura del disipador vs gabinete", "Espacio para el radiador si es AIO"] },
  { name: "Periféricos", vis: null, emoji: "⌨️", resumen: "Entrada y salida del usuario.",
    qa: { quees: "Dispositivos externos: monitor, teclado, mouse.", funcion: "Permiten la interacción usuario–computadora.", comunicacion: "USB, video (HDMI/DP) y audio.", carac: "Tipo (entrada/salida/mixto) e interfaz.", errores: "Conectar el monitor a la placa teniendo GPU dedicada.", incompat: "Sin monitor no se ve la salida.", rend: "No afectan el cómputo, sí la experiencia." },
    tabla: { cols: ["Tipo", "Ejemplos"], rows: [["Entrada", "Teclado, mouse, escáner"], ["Salida", "Monitor, impresora, bocinas"], ["Mixto", "Pantalla táctil, diadema con micrófono"]] },
    elegir: ["Interfaz compatible (USB, HDMI/DP)", "Según la tarea: oficina, diseño o juego"] }
];

function renderCatalog() {
  const host = document.getElementById("modCatalogo");
  host.innerHTML =
    `<h2 class="mod-head">2 · Catálogo de componentes</h2>
     <p class="mod-sub">Ficha de cada componente con sus <strong>subtipos</strong>, una <strong>tabla comparativa</strong> y <strong>criterios de selección</strong>. Toca una tarjeta para abrir su ficha.</p>
     <div class="card-grid" id="catGrid"></div>`;
  const grid = host.querySelector("#catGrid");
  CATALOG.forEach(c => {
    const card = document.createElement("div");
    card.className = "cat-card";
    card.innerHTML = (c.vis ? `<div class="cat-visual"></div>` : `<div class="cat-visual" style="font-size:46px">${c.emoji}</div>`) +
      `<h3>${c.emoji} ${c.name}</h3><p>${c.resumen}</p>`;
    if (c.vis) card.querySelector(".cat-visual").appendChild(createVisual(c.vis));
    card.addEventListener("click", () => openCatalogDetail(c));
    grid.appendChild(card);
  });
}

function openCatalogDetail(c) {
  const m = id => document.getElementById(id);
  m("specTitle").textContent = c.name;
  m("specRole").textContent = c.resumen;
  const sv = m("specVisual"); sv.innerHTML = "";
  if (c.vis) sv.appendChild(createVisual(c.vis)); else sv.innerHTML = `<div style="font-size:52px">${c.emoji}</div>`;
  const q = c.qa;
  let html =
    `<div class="qa-block">
      <div class="qa"><span class="q">¿Qué es?</span><span class="a">${q.quees}</span></div>
      <div class="qa"><span class="q">¿Qué función cumple?</span><span class="a">${q.funcion}</span></div>
      <div class="qa"><span class="q">¿Cómo se comunica?</span><span class="a">${q.comunicacion}</span></div>
      <div class="qa"><span class="q">¿Qué características revisar?</span><span class="a">${q.carac}</span></div>
      <div class="qa"><span class="q">Errores comunes</span><span class="a">${q.errores}</span></div>
      <div class="qa"><span class="q">¿Qué pasa si no es compatible?</span><span class="a">${q.incompat}</span></div>
      <div class="qa"><span class="q">Impacto en el rendimiento</span><span class="a">${q.rend}</span></div>
    </div>`;
  if (c.tabla) {
    html += `<div class="spec-sheet"><h4>Tipos y comparativa</h4><table class="cmp-table"><thead><tr>` +
      c.tabla.cols.map(x => `<th>${x}</th>`).join("") + `</tr></thead><tbody>` +
      c.tabla.rows.map(r => `<tr>` + r.map(x => `<td>${x}</td>`).join("") + `</tr>`).join("") + `</tbody></table></div>`;
  }
  if (c.elegir) {
    html += `<div class="spec-sheet"><h4>¿Cómo elegirlo?</h4><ul class="pick-list">` +
      c.elegir.map(x => `<li>${x}</li>`).join("") + `</ul></div>`;
  }
  m("specBody").innerHTML = html;
  m("specExtra").hidden = true;
  m("specModal").hidden = false;
}

  /* =================================================================
     MÓDULO 4 · COMPATIBILIDAD (rigurosa) + DIAGNÓSTICO
     ================================================================= */
  const PARTS = [
  { key: "case", label: "Gabinete", opts: [
    { n: "Full/Mid Tower ATX", supports: ["ATX", "mATX", "ITX"], maxGpu: 360, maxCooler: 170 },
    { n: "MicroATX", supports: ["mATX", "ITX"], maxGpu: 300, maxCooler: 155 },
    { n: "Mini-ITX", supports: ["ITX"], maxGpu: 250, maxCooler: 120 } ] },
  { key: "chipset", label: "Chipset", opts: [
    { n: "AMD A520 · AM4 · DDR4", socket: "AM4", ram: "DDR4", ramMax: 128, oc: false, pcie: "3.0", gama: "Básico" },
    { n: "AMD B550 · AM4 · DDR4", socket: "AM4", ram: "DDR4", ramMax: 128, oc: true, pcie: "4.0", gama: "Medio" },
    { n: "AMD X570 · AM4 · DDR4", socket: "AM4", ram: "DDR4", ramMax: 128, oc: true, pcie: "4.0", gama: "Alto" },
    { n: "AMD X670 · AM5 · DDR5", socket: "AM5", ram: "DDR5", ramMax: 128, oc: true, pcie: "5.0", gama: "Alto" },
    { n: "Intel B660 · LGA1700 · DDR5", socket: "LGA1700", ram: "DDR5", ramMax: 128, oc: false, pcie: "4.0", gama: "Medio" },
    { n: "Intel Z790 · LGA1700 · DDR5", socket: "LGA1700", ram: "DDR5", ramMax: 192, oc: true, pcie: "5.0", gama: "Alto" } ] },
  { key: "mobo", label: "Formato de placa", opts: [
    { n: "ATX (4 ranuras RAM)", ff: "ATX", ramMax: 192, slots: 4 },
    { n: "microATX (4 ranuras RAM)", ff: "mATX", ramMax: 128, slots: 4 },
    { n: "Mini-ITX (2 ranuras RAM)", ff: "ITX", ramMax: 64, slots: 2 } ] },
  { key: "cpu", label: "Procesador", opts: [
    { n: "Ryzen 5 5600 · AM4 (65W)", socket: "AM4", tdp: 65, igpu: false, tier: 2, oc: false },
    { n: "Ryzen 7 5700G · AM4 · iGPU (65W)", socket: "AM4", tdp: 65, igpu: true, tier: 2, oc: false },
    { n: "Ryzen 7 7700 · AM5 · iGPU (65W)", socket: "AM5", tdp: 65, igpu: true, tier: 3, oc: false },
    { n: "Intel i5-13400 · LGA1700 · iGPU (65W)", socket: "LGA1700", tdp: 65, igpu: true, tier: 2, oc: false },
    { n: "Intel i7-13700K · LGA1700 (125W)", socket: "LGA1700", tdp: 125, igpu: true, tier: 4, oc: true } ] },
  { key: "ram", label: "Memoria RAM", opts: [
    { n: "16GB DDR4 3200", type: "DDR4", gb: 16 },
    { n: "32GB DDR4 3600", type: "DDR4", gb: 32 },
    { n: "16GB DDR5 5600", type: "DDR5", gb: 16 },
    { n: "64GB DDR5 6000", type: "DDR5", gb: 64 } ] },
  { key: "cooler", label: "Enfriamiento", opts: [
    { n: "(sin disipador)", tdp: 0, h: 0 },
    { n: "Disipador stock (65W · 45mm)", tdp: 65, h: 45 },
    { n: "Torre de aire (220W · 160mm)", tdp: 220, h: 160 },
    { n: "Líquida AIO 240 (250W · radiador)", tdp: 250, h: 50 } ] },
  { key: "gpu", label: "Tarjeta gráfica", opts: [
    { n: "(usar gráficos integrados)", present: false, tdp: 0, len: 0, conn: 0, tier: 1 },
    { n: "GTX 1650 (75W · 200mm · 0×8pin)", present: true, tdp: 75, len: 200, conn: 0, tier: 2 },
    { n: "RTX 4070 (200W · 300mm · 1×8pin)", present: true, tdp: 200, len: 300, conn: 1, tier: 3 },
    { n: "RTX 4090 (450W · 340mm · 3×8pin)", present: true, tdp: 450, len: 340, conn: 3, tier: 5 } ] },
  { key: "storage", label: "Almacenamiento", opts: [
    { n: "SSD NVMe 1TB", present: true, nvme: true },
    { n: "SSD SATA 512GB", present: true, nvme: false },
    { n: "HDD 2TB", present: true, nvme: false },
    { n: "(ninguno)", present: false, nvme: false } ] },
  { key: "psu", label: "Fuente de poder", opts: [
    { n: "450W · 1×PCIe 8pin", w: 450, pcie: 1 },
    { n: "650W · 2×PCIe 8pin", w: 650, pcie: 2 },
    { n: "850W · 3×PCIe 8pin", w: 850, pcie: 3 },
    { n: "1000W · 4×PCIe 8pin", w: 1000, pcie: 4 } ] }
];
const sel = {};

function specText(key, o) {
  switch (key) {
    case "case": return `Placas ${o.supports.join("/")} · GPU ≤ ${o.maxGpu}mm · disipador ≤ ${o.maxCooler}mm`;
    case "chipset": return `Socket ${o.socket} · ${o.ram} · PCIe ${o.pcie} · ${o.oc ? "permite" : "sin"} overclock · gama ${o.gama}`;
    case "mobo": return `Formato ${o.ff} · ${o.slots} ranuras · RAM máx ${o.ramMax}GB`;
    case "cpu": return `${o.socket} · TDP ${o.tdp}W · ${o.igpu ? "con iGPU" : "SIN iGPU"}${o.oc ? " · desbloqueado" : ""} · nivel ${o.tier}`;
    case "ram": return `${o.type} · ${o.gb}GB`;
    case "cooler": return o.tdp === 0 ? "Sin sistema de enfriamiento" : `Disipa ${o.tdp}W · alto ${o.h}mm`;
    case "gpu": return o.present ? `Dedicada · ${o.tdp}W · ${o.len}mm · ${o.conn}×8pin · nivel ${o.tier}` : "Integrada (usa el iGPU del CPU)";
    case "storage": return o.present ? (o.nvme ? "SSD NVMe (bus PCIe)" : "Unidad SATA") : "Sin unidad";
    case "psu": return `${o.w}W · ${o.pcie}×PCIe 8pin`;
  }
  return "";
}

function renderConfig() {
  const host = document.getElementById("modCompat");
  host.innerHTML =
    `<h2 class="mod-head">4 · Reglas de compatibilidad</h2>
     <p class="mod-sub">Arma tu equipo eligiendo un modelo por componente. Al <strong>Probar encendido</strong> se validan la compatibilidad <em>física</em> (socket, RAM, factor de forma, longitud de GPU, altura del disipador), la <em>eléctrica/térmica</em> (potencia y conectores de la fuente, enfriamiento) y los <em>requisitos de funcionamiento</em>, con la explicación de cada regla y una nota de <strong>cuello de botella</strong>.</p>
     <div class="config-wrap">
       <div class="panel"><h2>Configuración</h2><div id="configRows"></div>
         <button id="testBtn" class="primary-btn">⏻ Probar encendido</button>
         <div class="summary" id="cfgSummary"></div>
       </div>
       <div class="panel diag-panel"><h2>Diagnóstico</h2><div id="diagOut"><p class="small-text">Elige tus componentes y pulsa “Probar encendido”. Verás por qué es (o no) compatible.</p></div></div>
     </div>`;
  const rows = host.querySelector("#configRows");
  PARTS.forEach(p => {
    sel[p.key] = 0;
    const row = document.createElement("div");
    row.className = "config-row2";
    row.innerHTML = `<label>${p.label}</label><select data-key="${p.key}">${p.opts.map((o, i) => `<option value="${i}">${o.n}</option>`).join("")}</select>
      <span class="spec-chip" data-chip="${p.key}">${specText(p.key, p.opts[0])}</span>`;
    row.querySelector("select").addEventListener("change", e => {
      sel[p.key] = +e.target.value;
      row.querySelector(".spec-chip").textContent = specText(p.key, p.opts[sel[p.key]]);
      updateSummary();
    });
    rows.appendChild(row);
  });
  host.querySelector("#testBtn").addEventListener("click", runDiagnosis);
  updateSummary();
}

function opt(key) { const p = PARTS.find(x => x.key === key); return p.opts[sel[key]]; }
function needWatts() { const c = opt("cpu"), g = opt("gpu"); return 120 + c.tdp + g.tdp; }

function updateSummary() {
  const cpu = opt("cpu"), gpu = opt("gpu");
  const need = needWatts();
  const rec = Math.ceil((need * 1.3) / 50) * 50;
  document.getElementById("cfgSummary").innerHTML =
    `<h3>Resumen técnico</h3>
     <table class="spec-table"><tbody>${PARTS.map(p => `<tr><td>${p.label}</td><td>${specText(p.key, opt(p.key))}</td></tr>`).join("")}</tbody></table>
     <h3 style="margin-top:12px">Consumo estimado</h3>
     <table class="spec-table"><tbody>
       <tr><td>Base (placa, discos, ventiladores)</td><td>120 W</td></tr>
       <tr><td>CPU</td><td>${cpu.tdp} W</td></tr>
       <tr><td>GPU</td><td>${gpu.tdp} W</td></tr>
       <tr><td><strong>Total estimado</strong></td><td><strong>~${need} W</strong></td></tr>
       <tr><td>Fuente recomendada</td><td>≥ ${rec} W (≈30% de margen)</td></tr>
     </tbody></table>`;
}

function runDiagnosis() {
  const out = document.getElementById("modCompat").querySelector("#diagOut");
  const cpu = opt("cpu"), mobo = opt("mobo"), ram = opt("ram"), cooler = opt("cooler"),
        gpu = opt("gpu"), storage = opt("storage"), psu = opt("psu"), casev = opt("case"), chip = opt("chipset");
  const ramMax = Math.min(chip.ramMax, mobo.ramMax);
  const groups = [];

  const fis = [];
  fis.push(cpu.socket === chip.socket
    ? { s: "ok", t: `Socket compatible (${cpu.socket}).`, w: "El chipset determina el socket de la placa, y el CPU debe coincidir con él." }
    : { s: "bad", t: `CPU incompatible: socket ${cpu.socket} ≠ ${chip.socket} del chipset ${chip.n.split(" ·")[0]}.`, w: "Cada chipset se fabrica para un socket concreto: un Ryzen AM4 no entra en una placa Intel LGA1700." });
  fis.push(ram.type === chip.ram
    ? { s: "ok", t: `RAM ${ram.type} compatible con el chipset.`, w: "El controlador de memoria del chipset define si la placa acepta DDR4 o DDR5." }
    : { s: "bad", t: `RAM no detectada: el chipset admite ${chip.ram} y elegiste ${ram.type}.`, w: "DDR4 y DDR5 tienen la muesca en distinta posición: no son intercambiables." });
  fis.push(ram.gb <= ramMax
    ? { s: "ok", t: `Capacidad de RAM dentro del límite (${ram.gb} ≤ ${ramMax} GB).`, w: "El límite real es el menor entre lo que admite el chipset y las ranuras del formato." }
    : { s: "bad", t: `Demasiada RAM: ${ram.gb} GB supera el máximo de esta combinación (${ramMax} GB).`, w: `El chipset admite hasta ${chip.ramMax} GB y el formato ${mobo.ff} llega a ${mobo.ramMax} GB con sus ${mobo.slots} ranuras.` });
  fis.push(!cpu.oc || chip.oc
    ? { s: "ok", t: cpu.oc ? `El chipset ${chip.gama.toLowerCase()} permite overclock del CPU desbloqueado.` : "Configuración de frecuencias correcta.", w: "Solo los chipsets de gama alta (Z, X) permiten subir la frecuencia del procesador." }
    : { s: "info", t: `Overclock no disponible: el CPU está desbloqueado pero el chipset no lo permite.`, w: "El equipo funciona, pero pagaste por un CPU desbloqueado que no podrás aprovechar. Sería mejor un chipset Z790 o X." });
  fis.push(casev.supports.indexOf(mobo.ff) !== -1
    ? { s: "ok", t: `Factor de forma correcto: placa ${mobo.ff} entra en el gabinete.`, w: "El gabinete debe soportar el tamaño de la placa (ATX > microATX > ITX)." }
    : { s: "bad", t: `La placa (${mobo.ff}) no cabe en el gabinete.`, w: "Un gabinete pequeño no admite placas más grandes." });
  if (gpu.present) fis.push(gpu.len <= casev.maxGpu
    ? { s: "ok", t: `La GPU (${gpu.len}mm) cabe en el gabinete (≤ ${casev.maxGpu}mm).`, w: "Las tarjetas largas requieren gabinetes con suficiente espacio." }
    : { s: "bad", t: `La GPU (${gpu.len}mm) es más larga que el máximo del gabinete (${casev.maxGpu}mm).`, w: "Si la GPU no cabe, no se puede instalar." });
  fis.push(cooler.h <= casev.maxCooler
    ? { s: "ok", t: `El disipador (${cooler.h}mm) cabe (≤ ${casev.maxCooler}mm).`, w: "La altura del disipador de aire está limitada por el ancho del gabinete." }
    : { s: "bad", t: `El disipador (${cooler.h}mm) es más alto que el máximo del gabinete (${casev.maxCooler}mm).`, w: "Un disipador muy alto choca con el panel lateral." });
  groups.push({ title: "Compatibilidad física", checks: fis });

  const ele = [];
  const need = needWatts();
  if (psu.w < need) ele.push({ s: "bad", t: `Fuente insuficiente: pide ~${need} W y la fuente da ${psu.w} W.`, w: "La suma de consumos no debe superar la potencia de la fuente." });
  else if (psu.w < need * 1.25) ele.push({ s: "info", t: `Fuente justa: ${psu.w} W para ~${need} W.`, w: "Funciona, pero se recomienda ~30% de margen para picos y eficiencia." });
  else ele.push({ s: "ok", t: `Fuente adecuada: ${psu.w} W para ~${need} W.`, w: "Con margen suficiente el sistema es estable bajo carga." });
  if (gpu.present) ele.push(psu.pcie >= gpu.conn
    ? { s: "ok", t: `Conectores PCIe suficientes (${psu.pcie} ≥ ${gpu.conn} que pide la GPU).`, w: "La GPU necesita cables PCIe de 8 pines desde la fuente." }
    : { s: "bad", t: `Faltan conectores: la GPU pide ${gpu.conn}×8pin y la fuente tiene ${psu.pcie}.`, w: "Sin los conectores PCIe correctos la GPU no recibe energía." });
  if (cooler.tdp === 0)
    ele.push({ s: "bad", t: `Sin enfriamiento: el procesador no tiene disipador y genera ${cpu.tdp} W de calor.`, w: "Sin disipador el CPU alcanza su temperatura crítica en segundos y la placa corta la energía para protegerlo." });
  else
    ele.push(cooler.tdp >= cpu.tdp
    ? { s: "ok", t: `Enfriamiento suficiente para ${cpu.tdp} W.`, w: "El disipador debe poder disipar al menos el TDP del CPU." }
    : { s: "bad", t: `Enfriamiento insuficiente: disipa ${cooler.tdp} W y el CPU genera ${cpu.tdp} W.`, w: "Un disipador corto provoca throttling o sobrecalentamiento." });
  groups.push({ title: "Compatibilidad eléctrica y térmica", checks: ele });

  const req = [];
  req.push(storage.present
    ? { s: "ok", t: "Almacenamiento presente.", w: "Se necesita al menos una unidad para instalar el sistema operativo." }
    : { s: "bad", t: "Sin almacenamiento: no hay dónde instalar el SO.", w: "Sin disco, el equipo no puede arrancar un sistema operativo." });
  req.push((gpu.present || cpu.igpu)
    ? { s: "ok", t: gpu.present ? "Video por GPU dedicada." : "Video por gráficos integrados del CPU.", w: "Se necesita una salida de video: GPU dedicada o iGPU del CPU." }
    : { s: "bad", t: "Sin video: el CPU no tiene iGPU y no hay GPU.", w: "Sin fuente de video no hay imagen en pantalla." });
  groups.push({ title: "Requisitos de funcionamiento", checks: req });

  const notes = [];
  if (gpu.present) {
    const diff = gpu.tier - cpu.tier;
    if (diff >= 2) notes.push({ s: "info", t: "Posible cuello de botella: el CPU podría quedarse corto frente a una GPU tan potente.", w: "Un CPU muy inferior limita el rendimiento que la GPU puede entregar." });
    else if (diff <= -2) notes.push({ s: "info", t: "El CPU supera con holgura a la GPU: la gráfica será el límite.", w: "Equilibra el presupuesto: podrías subir de GPU." });
    else notes.push({ s: "ok", t: "CPU y GPU están razonablemente equilibrados.", w: "Un buen balance evita cuellos de botella." });
  }
  if (notes.length) groups.push({ title: "Balance de rendimiento", checks: notes });

  const fail = groups.flatMap(g => g.checks).some(c => c.s === "bad");
  let html = `<div class="diag-verdict ${fail ? "bad" : "ok"}">${fail ? "❌ LA PC NO ARRANCA — corrige los errores marcados" : "✅ SISTEMA FUNCIONAL — POST correcto"}</div>`;
  groups.forEach(g => {
    html += `<h3 class="diag-group">${g.title}</h3>`;
    html += g.checks.map(c => {
      const ic = c.s === "ok" ? "✓" : (c.s === "bad" ? "✕" : "!");
      return `<div class="diag-line ${c.s}"><strong>${ic}</strong><span>${c.t}<br><em class="why">${c.w}</em></span></div>`;
    }).join("");
  });
  out.innerHTML = html;
}

  /* =================================================================
     MÓDULO 5 · AUTOEVALUACIÓN
     ================================================================= */
const POOL = [
  { type: "mc", q: "¿Qué componente ejecuta las instrucciones del sistema?", opts: ["El procesador (CPU)", "La memoria RAM", "La fuente de poder", "El gabinete"], correct: 0, fb: "El CPU es el 'cerebro': ejecuta el ciclo de instrucción." },
  { type: "mc", q: "¿Qué debe coincidir entre el CPU y la tarjeta madre?", opts: ["El socket", "El color", "La marca de la RAM", "El tamaño del gabinete"], correct: 0, fb: "El socket del CPU debe coincidir con el de la placa o no encaja." },
  { type: "mc", q: "Si la fuente no tiene suficiente potencia, lo más probable es que…", opts: ["El sistema no encienda o se apague bajo carga", "La RAM aumente", "Mejore el rendimiento", "No pase nada"], correct: 0, fb: "Una fuente insuficiente provoca apagones o que no encienda." },
  { type: "mc", q: "¿Cuál es el almacenamiento más rápido?", opts: ["SSD NVMe", "HDD 5400 RPM", "Disquete", "Cinta magnética"], correct: 0, fb: "El SSD NVMe (PCIe) es mucho más rápido que SATA y que un HDD." },
  { type: "mc", q: "Aparece “RAM no detectada”. ¿Qué revisas primero?", opts: ["Que la RAM sea del tipo correcto (DDR) y esté bien encajada", "La tarjeta gráfica", "El gabinete", "El mouse"], correct: 0, fb: "El mensaje apunta a la memoria: tipo DDR correcto y bien asentada." },
  { type: "mc", q: "¿Qué componente define el socket, el chipset y el tipo de RAM soportado?", opts: ["La tarjeta madre", "La GPU", "La fuente", "El disipador"], correct: 0, fb: "La tarjeta madre es la plataforma que define la compatibilidad." },
  { type: "mc", q: "¿En qué ranura se instala una GPU dedicada?", opts: ["PCIe x16", "Ranura de RAM", "Puerto SATA", "Socket del CPU"], correct: 0, fb: "La GPU va en la ranura PCIe x16." },
  { type: "mc", q: "¿Qué conector alimenta específicamente al CPU?", opts: ["EPS de 8 pines", "ATX de 24 pines", "SATA", "USB"], correct: 0, fb: "El EPS 8-pin alimenta el CPU; el ATX 24-pin alimenta la placa." },
  { type: "mc", q: "¿Cómo se activa el dual channel en la RAM?", opts: ["Con 2 módulos en las ranuras A2/B2", "Con un solo módulo grande", "Overclocking del CPU", "Instalando más discos"], correct: 0, fb: "Dos módulos en A2/B2 activan el dual channel." },
  { type: "mc", q: "¿Qué indica el TDP de un procesador?", opts: ["El calor/potencia que debe disipar el enfriamiento", "Los terabytes de disco", "La velocidad de internet", "El número de puertos USB"], correct: 0, fb: "El TDP orienta cuánta disipación necesita el CPU." },
  { type: "mc", q: "¿Qué hace el POST al encender la PC?", opts: ["Un autodiagnóstico del hardware", "Instala programas", "Formatea el disco", "Sube archivos a la nube"], correct: 0, fb: "El POST verifica el hardware básico antes de arrancar el SO." },
  { type: "mc", q: "Si no aplicas pasta térmica al CPU, ¿qué ocurre?", opts: ["Mala transferencia de calor y sobrecalentamiento", "Más FPS", "Más RAM", "Nada"], correct: 0, fb: "La pasta mejora la transferencia de calor CPU→disipador." },
  { type: "mc", q: "¿Cuál es el factor de forma de placa más grande?", opts: ["ATX", "microATX", "Mini-ITX", "Nano-ITX"], correct: 0, fb: "ATX > microATX > Mini-ITX en tamaño." },
  { type: "mc", q: "Tu CPU no tiene gráficos integrados y no hay imagen. ¿Qué haces?", opts: ["Instalar una GPU dedicada", "Cambiar el mouse", "Quitar un disco", "Subir el brillo del monitor"], correct: 0, fb: "Sin iGPU necesitas una GPU dedicada para tener video." },
  { type: "mc", q: "La VRAM pertenece a…", opts: ["La GPU", "El CPU", "La fuente", "El gabinete"], correct: 0, fb: "La VRAM es la memoria dedicada de la tarjeta gráfica." },
  { type: "mc", q: "¿Qué cable lleva los DATOS de un SSD SATA a la placa?", opts: ["Cable SATA de datos", "Cable PCIe", "Cable EPS", "Cable HDMI"], correct: 0, fb: "El SATA de datos conecta el disco con un puerto SATA de la placa." },
  { type: "tf", q: "La memoria RAM conserva los datos aunque se apague la computadora.", correct: false, fb: "Falso: la RAM es volátil; se borra al apagar." },
  { type: "tf", q: "Un CPU sin gráficos integrados necesita una GPU para dar video.", correct: true, fb: "Verdadero: sin iGPU ni GPU no hay imagen." },
  { type: "tf", q: "El SSD NVMe se instala en una ranura M.2 y usa el bus PCIe.", correct: true, fb: "Verdadero: NVMe aprovecha PCIe por la ranura M.2." },
  { type: "tf", q: "Una fuente de más watts siempre da más rendimiento.", correct: false, fb: "Falso: da margen y estabilidad, no más rendimiento por sí sola." },
  { type: "tf", q: "microATX es un formato de placa más grande que ATX.", correct: false, fb: "Falso: ATX es más grande que microATX." },
  { type: "tf", q: "El ventilador del disipador se conecta al cabezal CPU_FAN.", correct: true, fb: "Verdadero: así la placa controla sus RPM." },
  { type: "order", q: "Ordena los pasos del ensamble:", items: ["Colocar separadores (standoffs)", "Montar la tarjeta madre", "Instalar el CPU", "Colocar la RAM", "Cerrar el gabinete"], correct: [0, 1, 2, 3, 4], fb: "Primero la base y la placa, luego CPU/RAM, y al final se cierra." },
  { type: "order", q: "Ordena la secuencia de arranque:", items: ["Presionar el botón de encendido", "POST (autodiagnóstico)", "BIOS/UEFI inicializa el hardware", "Carga del sistema operativo", "Escritorio listo"], correct: [0, 1, 2, 3, 4], fb: "Power → POST → BIOS/UEFI → SO → escritorio." },
  { type: "order", q: "Ordena la ruta de los datos al abrir un programa:", items: ["Almacenamiento (SSD/HDD)", "Memoria RAM", "Procesador (CPU)", "Salida en pantalla"], correct: [0, 1, 2, 3], fb: "Del disco a la RAM, la procesa el CPU y se muestra en pantalla." },
  { type: "match", q: "Relaciona cada componente con su función:", terms: ["CPU", "RAM", "SSD", "GPU"], answers: ["Ejecuta instrucciones", "Memoria temporal de trabajo", "Almacenamiento permanente", "Procesa gráficos"], fb: "CPU→ejecuta, RAM→temporal, SSD→permanente, GPU→gráficos." },
  { type: "match", q: "Relaciona cada conector con lo que alimenta/conecta:", terms: ["EPS 8-pin", "ATX 24-pin", "PCIe", "SATA"], answers: ["Alimenta el CPU", "Alimenta la placa madre", "Alimenta la GPU", "Datos/energía de discos"], fb: "EPS→CPU, ATX→placa, PCIe→GPU, SATA→discos." },
  { type: "match", q: "Relaciona el concepto con su ejemplo:", terms: ["Memoria volátil", "Memoria permanente", "Dispositivo de entrada", "Dispositivo de salida"], answers: ["RAM", "SSD", "Teclado", "Monitor"], fb: "Volátil→RAM, permanente→SSD, entrada→teclado, salida→monitor." },
  { type: "match", q: "Relaciona cada característica con su componente:", terms: ["Socket", "VRAM", "Watts (W)", "DDR4/DDR5"], answers: ["CPU / placa", "GPU", "Fuente de poder", "Memoria RAM"], fb: "Socket→CPU/placa, VRAM→GPU, Watts→fuente, DDR→RAM." }
];

const N_QUIZ = 12;
let QUIZ = [], qi = 0, score = 0, answered = false;

function renderQuizHome() {
  const host = document.getElementById("modQuiz");
  host.innerHTML =
    `<h2 class="mod-head">5 · Autoevaluación</h2>
     <p class="mod-sub">${N_QUIZ} preguntas aleatorias de un banco de ${POOL.length}, de varios tipos (opción múltiple, verdadero/falso, ordenamiento y relación de columnas) con retroalimentación inmediata. Cada intento es distinto.</p>
     <div class="quiz-wrap" id="quizWrap"></div>`;
  QUIZ = shuffle(POOL.slice()).slice(0, N_QUIZ);
  qi = 0; score = 0;
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const wrap = document.getElementById("quizWrap");
  if (qi >= QUIZ.length) return renderQuizResult();
  const item = QUIZ[qi];
  const typeName = { mc: "Opción múltiple", tf: "Verdadero / Falso", order: "Ordenamiento", match: "Relación de columnas" }[item.type];
  let body = "";

  if (item.type === "mc") {
    const order = shuffle(item.opts.map((_, i) => i));
    body = `<div class="q-options">` + order.map(i => `<button class="q-opt" data-i="${i}">${item.opts[i]}</button>`).join("") + `</div>`;
  } else if (item.type === "tf") {
    body = `<div class="q-options"><button class="q-opt" data-i="true">Verdadero</button><button class="q-opt" data-i="false">Falso</button></div>`;
  } else if (item.type === "order") {
    const idxs = shuffle(item.items.map((_, i) => i));
    if (idxs.every((v, k) => v === item.correct[k])) { const t = idxs[0]; idxs[0] = idxs[1]; idxs[1] = t; }
    body = `<p class="small-text" style="margin:0 0 10px">Usa ▲▼ para acomodar en el orden correcto.</p><div id="orderList">` +
      idxs.map(i => `<div class="q-order-item" data-i="${i}"><span>${item.items[i]}</span><span class="ord-btns"><button data-d="-1">▲</button><button data-d="1">▼</button></span></div>`).join("") + `</div>`;
  } else if (item.type === "match") {
    const optOrder = shuffle(item.answers.map((_, j) => j));
    const optsHtml = optOrder.map(j => `<option value="${j}">${item.answers[j]}</option>`).join("");
    body = item.terms.map((t, i) => `<div class="q-match-row"><span class="m-term">${t}</span><select data-i="${i}"><option value="-1">— elige —</option>${optsHtml}</select></div>`).join("");
  }

  wrap.innerHTML =
    `<div class="quiz-progress">Pregunta ${qi + 1} de ${QUIZ.length} · Aciertos: ${score}</div>
     <div class="q-card">
       <span class="q-type">${typeName}</span>
       <p class="q-text">${item.q}</p>
       ${body}
       <div id="qFeedback"></div>
       <div class="q-actions">
         <button id="qCheck" class="primary-btn" style="width:auto">Comprobar</button>
         <button id="qNext" class="view-btn" style="display:none">Siguiente ▸</button>
       </div>
     </div>`;

  if (item.type === "mc" || item.type === "tf") {
    wrap.querySelectorAll(".q-opt").forEach(b => b.addEventListener("click", () => {
      if (answered) return;
      wrap.querySelectorAll(".q-opt").forEach(x => { x.removeAttribute("data-picked"); x.style.outline = ""; });
      b.dataset.picked = "1"; b.style.outline = "2px solid #7ed7ff";
    }));
  }
  if (item.type === "order") {
    wrap.querySelectorAll(".ord-btns button").forEach(b => b.addEventListener("click", () => {
      if (answered) return;
      const list = wrap.querySelector("#orderList"), row = b.closest(".q-order-item"), d = +b.dataset.d;
      if (d === -1 && row.previousElementSibling) list.insertBefore(row, row.previousElementSibling);
      if (d === 1 && row.nextElementSibling) list.insertBefore(row.nextElementSibling, row);
    }));
  }
  wrap.querySelector("#qCheck").addEventListener("click", () => checkAnswer(item, wrap));
  wrap.querySelector("#qNext").addEventListener("click", () => { qi++; renderQuestion(); });
}

function feedback(wrap, ok, text) {
  const fb = wrap.querySelector("#qFeedback");
  fb.className = "q-feedback " + (ok ? "ok" : "bad");
  fb.innerHTML = (ok ? "✅ ¡Correcto! " : "❌ Revisa: ") + text;
  wrap.querySelector("#qCheck").style.display = "none";
  wrap.querySelector("#qNext").style.display = "inline-block";
  answered = true;
  if (ok) score++;
}

function checkAnswer(item, wrap) {
  if (answered) return;
  if (item.type === "mc" || item.type === "tf") {
    const picked = wrap.querySelector('.q-opt[data-picked="1"]');
    if (!picked) return showToast("Elige una opción.");
    wrap.querySelectorAll(".q-opt").forEach(b => b.classList.add("disabled"));
    if (item.type === "mc") {
      const i = +picked.dataset.i;
      wrap.querySelectorAll(".q-opt").forEach(b => { if (+b.dataset.i === item.correct) b.classList.add("correct"); });
      if (i !== item.correct) picked.classList.add("wrong");
      feedback(wrap, i === item.correct, item.fb);
    } else {
      const val = picked.dataset.i === "true";
      wrap.querySelectorAll(".q-opt").forEach(b => { if ((b.dataset.i === "true") === item.correct) b.classList.add("correct"); });
      if (val !== item.correct) picked.classList.add("wrong");
      feedback(wrap, val === item.correct, item.fb);
    }
  } else if (item.type === "order") {
    const order = [...wrap.querySelectorAll(".q-order-item")].map(r => +r.dataset.i);
    feedback(wrap, order.every((v, idx) => v === item.correct[idx]), item.fb);
  } else if (item.type === "match") {
    const rows = [...wrap.querySelectorAll(".q-match-row select")];
    if (rows.some(s => s.value === "-1")) return showToast("Relaciona todas las filas.");
    rows.forEach((s, i) => { s.style.borderColor = (+s.value === i) ? "#52ffb8" : "#ff6262"; });
    feedback(wrap, rows.every((s, i) => +s.value === i), item.fb);
  }
}

function renderQuizResult() {
  const wrap = document.getElementById("quizWrap");
  const pct = Math.round(score / QUIZ.length * 100);
  const msg = pct >= 80 ? "¡Excelente! Dominas la arquitectura de la PC." :
              pct >= 50 ? "Bien, pero repasa la teoría y el catálogo." :
                          "Conviene repasar los módulos 1 y 2 y volver a intentar.";
  wrap.innerHTML =
    `<div class="q-card quiz-result">
       <div class="score">${score} / ${QUIZ.length}</div>
       <p style="font-size:20px;margin:6px 0 4px">${pct}% de aciertos</p>
       <p class="small-text" style="margin-bottom:16px">${msg}</p>
       <button id="qRetry" class="primary-btn" style="width:auto">Reintentar (nuevas preguntas)</button>
     </div>`;
  wrap.querySelector("#qRetry").addEventListener("click", renderQuizHome);
}

  /* =================================================================
     MÓDULO 6 · GLOSARIO (buscable)
     ================================================================= */
  const GLOSSARY = [

];

function renderGlossary() {
  const host = document.getElementById("modGloss");
  host.innerHTML =
    `<h2 class="mod-head">Biblioteca</h2>
     <p class="mod-sub">Términos clave de arquitectura y ensamble. Usa el buscador para encontrar un concepto.</p>
     <input id="glossSearch" class="gloss-search" type="text" placeholder="Buscar término… (ej. TDP, PCIe, dual channel)">
     <div class="gloss-list" id="glossList"></div>`;
  const list = host.querySelector("#glossList");
  function paint(q) {
    q = (q || "").toLowerCase().trim();
    const items = GLOSSARY.filter(g => !q || g[0].toLowerCase().includes(q) || g[1].toLowerCase().includes(q));
    list.innerHTML = items.length
      ? items.map(g => `<div class="gloss-item"><span class="g-term">${g[0]}</span><span class="g-def">${g[1]}</span></div>`).join("")
      : `<p class="small-text">Sin resultados para “${q}”.</p>`;
  }
  host.querySelector("#glossSearch").addEventListener("input", e => paint(e.target.value));
  paint("");
}

  /* ---------------- Arranque de módulos ---------------- */
setupModuleNav();
renderTheory();
renderCatalog();
renderConfig();
renderQuizHome();
renderGlossary();

  /* =================================================================
     MENÚ PRINCIPAL (inicio con tarjetas)
     ================================================================= */
  if (!document.querySelector('link[data-pb-home]')) {
  const link = document.createElement("link");
  link.rel = "stylesheet"; link.href = "./home.css"; link.setAttribute("data-pb-home", "1");
  document.head.appendChild(link);
}

const MODES = [
  { mod: "modEnsamble", icon: "🖥️", color: "#3aa0ff", title: "Ensamblaje", desc: "Arma tu PC paso a paso arrastrando cada componente a su lugar." },
  { mod: "modTeoria",   icon: "🎓", color: "#3ddc84", title: "Modo estudio", desc: "Aprende la arquitectura de la computadora de forma interactiva." },
  { mod: "modCatalogo", icon: "🧩", color: "#b98cff", title: "Catálogo", desc: "Explora cada componente: tipos, comparativas y cómo elegirlo." },
  { mod: "modDiag",     icon: "🩺", color: "#ff8c42", title: "Diagnóstico de errores", desc: "Enciende equipos con fallas, lee los síntomas del POST y repáralos." },
  { mod: "modCompat",   icon: "⚙️", color: "#ffb340", title: "Compatibilidad", desc: "Configura un equipo y comprueba si enciende, con el porqué de cada regla." },
  { mod: "modQuiz",     icon: "📝", color: "#ff5d6c", title: "Autoevaluación", desc: "Pon a prueba lo aprendido con un cuestionario que cambia cada intento." },
  { mod: "modGloss",    icon: "📚", color: "#33c9ff", title: "Biblioteca", desc: "Consulta el glosario con los términos clave del hardware." }
];

function buildHome() {
  const app = document.querySelector(".app");
  if (!app || document.getElementById("homeRoot")) return;

  const cardsHTML = MODES.map(m => `
    <button class="pb-card" style="--c:${m.color}" data-goto="${m.mod}" type="button">
      <span class="pb-card-ico">${m.icon}</span>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
      <span class="pb-card-go" aria-hidden="true">→</span>
    </button>`).join("");

  const root = document.createElement("div");
  root.id = "homeRoot";
  root.innerHTML = `
    <aside class="pb-side">
      <div class="pb-avatar">👤</div>
      <div class="pb-user"><h2>Estudiante</h2><span>Nivel 1</span></div>
      <div class="pb-progress">
        <div class="pb-progress-top"><span>Progreso del montaje</span><strong id="pbProgPct">0%</strong></div>
        <div class="pb-bar"><span id="pbProgFill"></span></div>
      </div>
    </aside>
    <main class="pb-main">
      <div class="pb-hero"><div class="pb-logo-chip">🔧</div><h1>PC<b>Builder</b></h1></div>
      <div class="pb-divider">Elige un modo para comenzar</div>
      <div class="pb-cards">${cardsHTML}</div>
    </main>`;
  app.prepend(root);

  root.querySelectorAll("[data-goto]").forEach(el => el.addEventListener("click", () => openMode(el.dataset.goto)));

  // Botón 🏠 Inicio dentro de la barra de módulos + ocultar los demás botones
  const nav = document.getElementById("modNav");
  if (nav) {
    if (!document.getElementById("pbHomeBtn")) {
      const b = document.createElement("button");
      b.id = "pbHomeBtn"; b.className = "modnav-btn"; b.type = "button";
      b.innerHTML = "🏠 Inicio";
      b.addEventListener("click", goHome);
      nav.prepend(b);
    }
    // Deja SOLO el botón de Inicio visible en la barra de arriba
    nav.querySelectorAll(".modnav-btn").forEach(b => { if (b.id !== "pbHomeBtn") b.style.display = "none"; });
  }

  goHome();
}

function openMode(modId) {
  document.body.classList.remove("pb-home-active");
  document.querySelectorAll(".modnav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.mod === modId));
  document.querySelectorAll(".module").forEach(m => m.classList.toggle("is-active", m.id === modId));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  document.body.classList.add("pb-home-active");
  updateProgress();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProgress() {
  let pct = 0;
  try {
    if (typeof effectivePlaced === "function" && typeof effectiveTotal === "function") {
      const total = effectiveTotal();
      if (total > 0) pct = Math.round((effectivePlaced() / total) * 100);
    }
  } catch (e) {}
  const fill = document.getElementById("pbProgFill");
  const lbl = document.getElementById("pbProgPct");
  if (fill) fill.style.width = pct + "%";
  if (lbl) lbl.textContent = pct + "%";
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildHome);
else buildHome();

})();
