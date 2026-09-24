/* =====================================================================
   01-bloque1-ensamblaje.js · BLOQUE 1 · ENSAMBLAJE
   =====================================================================
   Datos + motor del simulador de ensamblado: la lista de componentes,
   el estado del armado, arrastrar y soltar, instalación, guía/UI,
   sonido, cámara 3D y encendido. Es el mismo código que tenías, solo
   que ahora vive en su propio archivo (uno de tres).
   ===================================================================== */

/* Cada componente tiene:
     id       identificador único
     name     nombre visible
     short    frase corta para la tarjeta
     type     "tipo" que define su dibujo (clase CSS)
     target   slot del HTML donde debe soltarse
     dependsOn pieza(s) previa(s). Texto, lista, o "group:NOMBRE".
     group    grupo de elección: basta instalar UN miembro (refrigeración).
     info     explicación larga (teoría de la pieza)
     wrong    mensaje si el usuario la suelta en el lugar equivocado */
const components = [
  { id: "standoffs", name: "Separadores (standoffs)",
    short: "Tornillos elevadores de la bandeja.", type: "standoffs", target: "standoffs",
    info: "Los separadores (standoffs) se atornillan en la bandeja del gabinete y elevan la placa madre para que no toque el metal y no haga cortocircuito. Van según el formato ATX.",
    wrong: "Los separadores se atornillan en la bandeja del gabinete, no ahí. Marca primero los agujeros del formato ATX." },

  { id: "mobo", name: "Placa madre ATX",
    short: "Se monta sobre los standoffs.", type: "mobo", target: "mobo-tray", dependsOn: "standoffs",
    info: "La placa madre se apoya sobre los separadores y se atornilla a la bandeja. Es la base donde se conectan todos los demás componentes.",
    wrong: "La placa madre va sobre la bandeja, alineada con los separadores y el I/O shield trasero." },

  { id: "screwMobo", name: "Atornillar la placa madre",
    short: "Fija la placa a los standoffs.", type: "screws", target: "mobo-tray", dependsOn: "mobo",
    info: "Con la placa apoyada sobre los separadores, atorníllala en cada agujero (sin apretar de más). Así queda fija y bien contactada a tierra.",
    wrong: "Estos tornillos fijan la placa madre ya montada sobre la bandeja." },

  { id: "cpu", name: "Procesador (CPU)",
    short: "Va en el socket central.", type: "cpu", target: "cpu-socket", dependsOn: "mobo",
    info: "El CPU es el cerebro de la PC. Levanta la palanca del socket, alinea la flecha/triángulo dorado con el de la placa y déjalo caer por su propio peso. Nunca lo fuerces.",
    wrong: "El procesador sólo entra en el socket central de la placa, alineando el triángulo dorado." },

  { id: "paste", name: "Pasta térmica",
    short: "Un punto sobre el CPU.", type: "paste", target: "cpu-paste", dependsOn: "cpu",
    info: "La pasta térmica mejora la transferencia de calor entre el CPU y el disipador. Aplica un punto del tamaño de un guisante en el centro del procesador.",
    wrong: "La pasta térmica se aplica encima del procesador ya instalado, no en otro lugar." },

  { id: "cooler", name: "Disipador de aire", group: "cooling",
    short: "Opción A · enfría el CPU por aire.", type: "cooler", target: "cooler-mount", dependsOn: "paste",
    info: "OPCIÓN A (aire): el disipador se monta encima del CPU presionando sobre la pasta térmica y se fija con sus sujetadores. Conecta su ventilador al cabezal CPU_FAN. (También puedes elegir refrigeración líquida.)",
    wrong: "El disipador de aire se monta encima del procesador, sobre la pasta térmica." },

  { id: "aio", name: "Refrigeración líquida (AIO)", group: "cooling",
    short: "Opción B · bloque + radiador + tubos.", type: "aio", target: "cooler-mount", dependsOn: "paste",
    info: "OPCIÓN B (líquida/AIO): el bloque con la bomba se monta encima del CPU (sobre la pasta) y el radiador con sus ventiladores se fija arriba o al frente del gabinete; los tubos llevan el líquido entre ambos. Elige aire O líquida, no las dos.",
    wrong: "El bloque/bomba de la refrigeración líquida va encima del CPU (mismo lugar que el cooler)." },

  { id: "cpuFan", name: "Conectar ventilador (CPU_FAN)",
    short: "Cable del disipador al pin CPU_FAN.", type: "cable-fan", target: "cpu-fan-header", dependsOn: "group:cooling",
    info: "El ventilador del disipador (o la bomba del AIO) se conecta al cabezal CPU_FAN de la placa, junto al socket. Así la placa controla las RPM y detecta la refrigeración al arrancar.",
    wrong: "El conector del ventilador va en el cabezal CPU_FAN, junto al socket del procesador." },

  { id: "ram1", name: "Memoria RAM (A2)",
    short: "Primer módulo.", type: "ram", target: "ram-slot-1", dependsOn: "mobo",
    info: "La RAM guarda datos temporales. Abre los seguros, alinea la muesca y presiona hasta oír el clic en ambos extremos.",
    wrong: "La memoria RAM sólo encaja en las ranuras largas verticales junto al CPU." },

  { id: "ram2", name: "Memoria RAM (B2)",
    short: "Segundo módulo (dual channel).", type: "ram", target: "ram-slot-2", dependsOn: "ram1",
    info: "Usar dos módulos en las ranuras A2/B2 activa el dual channel y mejora el ancho de banda.",
    wrong: "El segundo módulo va en la otra ranura larga (B2) para activar dual channel." },

  { id: "m2", name: "SSD M.2 NVMe",
    short: "Almacenamiento rápido en la placa.", type: "m2", target: "m2-slot", dependsOn: "mobo",
    info: "El SSD M.2 se inserta en ángulo en su ranura, se baja y se fija con un tornillo. Es el almacenamiento más rápido.",
    wrong: "El SSD M.2 sólo entra en su ranura horizontal pequeña sobre la placa." },

  { id: "psu", name: "Fuente de poder (PSU)",
    short: "Se coloca en el gabinete.", type: "psu", target: "psu-bay", dependsOn: "mobo",
    info: "La fuente de poder entrega energía a todo el sistema. Se coloca en su compartimento inferior del gabinete.",
    wrong: "La fuente de poder va en su compartimento inferior del gabinete (PSU shroud)." },

  { id: "screwPsu", name: "Atornillar la fuente",
    short: "Fija la PSU al chasis.", type: "screws", target: "psu-bay", dependsOn: "psu",
    info: "La fuente se atornilla por la parte trasera del gabinete con 4 tornillos para que quede firme.",
    wrong: "Estos tornillos fijan la fuente por la parte trasera del gabinete." },

  { id: "ssd", name: "SSD SATA 2.5\"",
    short: "Unidad de 2.5 pulgadas.", type: "ssd", target: "sata-bay", dependsOn: "psu",
    info: "El SSD SATA de 2.5\" se coloca en su bahía. Después se conecta con cable de datos SATA y alimentación SATA desde la fuente.",
    wrong: "El SSD de 2.5\" va en la bahía pequeña de discos del gabinete." },

  { id: "hdd", name: "Disco duro 3.5\"",
    short: "Almacenamiento mecánico.", type: "hdd", target: "hdd-bay", dependsOn: "psu",
    info: "El disco duro de 3.5\" se monta en la jaula de discos. Vibra, así que conviene atornillarlo bien. Usa cable de datos y alimentación SATA.",
    wrong: "El disco duro de 3.5\" va en la bahía/jaula grande del gabinete." },

  { id: "screwDrives", name: "Atornillar los discos",
    short: "Fija SSD y HDD en sus bahías.", type: "screws", target: "hdd-bay", dependsOn: ["ssd", "hdd"],
    info: "Atornilla cada disco en su bahía para que no vibre ni se mueva. El HDD especialmente, porque tiene partes móviles.",
    wrong: "Estos tornillos fijan los discos en sus bahías del gabinete." },

  { id: "gpu", name: "Tarjeta gráfica (GPU)",
    short: "Va en el PCIe x16.", type: "gpu", target: "pcie-slot", dependsOn: "mobo",
    info: "La GPU se inserta en la ranura PCIe x16 superior hasta oír el clic del seguro. Procesa gráficos y videojuegos.",
    wrong: "La tarjeta gráfica sólo encaja en la ranura larga PCIe x16." },

  { id: "screwGpu", name: "Atornillar la GPU",
    short: "Fija la GPU al chasis.", type: "screws", target: "pcie-slot", dependsOn: "gpu",
    info: "Una vez encajada en el PCIe, atornilla la GPU al chasis por su bracket para que no cuelgue ni se afloje.",
    wrong: "Este tornillo fija la tarjeta gráfica al chasis, sobre su bracket." },

  { id: "fanFront", name: "Ventilador frontal",
    short: "Entrada de aire (intake).", type: "fan", target: "fan-front", dependsOn: "mobo",
    info: "El ventilador frontal empuja aire fresco hacia dentro (intake). Fíjate en la flecha de dirección y conéctalo a un cabezal SYS_FAN.",
    wrong: "Este ventilador va en el frente del gabinete, como entrada de aire." },

  { id: "fanRear", name: "Ventilador trasero",
    short: "Salida de aire (exhaust).", type: "fan", target: "fan-rear", dependsOn: "mobo",
    info: "El ventilador trasero expulsa el aire caliente (exhaust). Junto con el frontal crea un flujo frontal→trasero.",
    wrong: "Este ventilador va en la parte trasera del gabinete, como salida de aire." },

  { id: "screwFans", name: "Atornillar los ventiladores",
    short: "Fija los ventiladores al gabinete.", type: "screws", target: "fan-front", dependsOn: ["fanFront", "fanRear"],
    info: "Cada ventilador se fija con 4 tornillos largos al gabinete para que no vibre.",
    wrong: "Estos tornillos fijan los ventiladores al gabinete." },

  { id: "eps", name: "Cable EPS CPU (8-pin)",
    short: "Alimenta el procesador.", type: "cable-eps", target: "eps-header", dependsOn: "psu",
    info: "El conector EPS de 8 pines alimenta al CPU. Va en el cabezal de la esquina superior izquierda de la placa, cerca del VRM.",
    wrong: "El cable EPS de 8 pines del CPU va en el cabezal superior izquierdo de la placa." },

  { id: "atx", name: "Cable ATX 24-pin",
    short: "Alimenta la placa madre.", type: "cable-atx", target: "atx-header", dependsOn: "psu",
    info: "El conector ATX de 24 pines es la alimentación principal de la placa. Va en el cabezal vertical del borde derecho.",
    wrong: "El cable ATX de 24 pines va en el conector vertical grande del borde derecho de la placa." },

  { id: "pcie", name: "Cable PCIe (GPU)",
    short: "Energía extra para la GPU.", type: "cable-pcie", target: "pcie-power", dependsOn: ["gpu", "psu"],
    info: "El cable PCIe (6+2 pines) entrega energía adicional a la tarjeta gráfica desde la fuente.",
    wrong: "El cable PCIe alimenta la GPU; va en los conectores de energía de la tarjeta gráfica." },

  { id: "sataData", name: "Cable SATA de datos",
    short: "Conecta el disco a la placa.", type: "cable-sata-data", target: "sata-data", dependsOn: "ssd",
    info: "El cable plano SATA lleva los datos del disco a un puerto SATA de la placa madre.",
    wrong: "El cable de datos SATA conecta el disco con un puerto SATA de la placa." },

  { id: "sataPower", name: "Cable SATA de poder",
    short: "Alimenta los discos.", type: "cable-sata-power", target: "sata-power", dependsOn: ["ssd", "psu"],
    info: "El conector de alimentación SATA viene de la fuente y entrega energía a los discos SATA.",
    wrong: "El cable de alimentación SATA va de la fuente hacia los discos." },

  { id: "pwrSw", name: "Power SW (F_PANEL)",
    short: "Botón de encendido del gabinete.", type: "fp-pin", target: "fp-pwr-sw", dependsOn: "mobo",
    info: "Power SW conecta el botón de encendido del gabinete al cabezal F_PANEL. Es un interruptor: no tiene polaridad, cualquier orientación funciona.",
    wrong: "El Power SW va en su par de pines del cabezal F_PANEL (esquina inferior de la placa)." },

  { id: "rstSw", name: "Reset SW (F_PANEL)",
    short: "Botón de reinicio.", type: "fp-pin", target: "fp-rst-sw", dependsOn: "mobo",
    info: "Reset SW conecta el botón de reinicio del gabinete. También es un interruptor, sin polaridad.",
    wrong: "El Reset SW va en su par de pines del cabezal F_PANEL." },

  { id: "hddLed", name: "HDD LED (F_PANEL) +/−",
    short: "LED de actividad del disco (con polaridad).", type: "fp-pin", target: "fp-hdd-led", dependsOn: "mobo",
    info: "HDD LED se enciende al leer/escribir en los discos. Es un LED: SÍ tiene polaridad; el pin + (positivo, cable de color) debe ir en su sitio o no encenderá.",
    wrong: "El HDD LED va en su par de pines del F_PANEL respetando la polaridad (+/−)." },

  { id: "pwrLed", name: "Power LED (F_PANEL) +/−",
    short: "LED de encendido (con polaridad).", type: "fp-pin", target: "fp-pwr-led", dependsOn: "mobo",
    info: "Power LED indica que la PC está encendida. También es un LED con polaridad: respeta el pin + (positivo).",
    wrong: "El Power LED va en su par de pines del F_PANEL respetando la polaridad (+/−)." },

  { id: "usbFront", name: "USB frontal",
    short: "Cabezal USB del gabinete.", type: "usbf", target: "usb-header", dependsOn: "mobo",
    info: "El cable de USB frontal del gabinete se conecta a su cabezal USB en la placa (USB 2.0, 3.0 de 19 pines o USB-C).",
    wrong: "El USB frontal va al cabezal USB de la placa, no ahí." },

  { id: "audioFront", name: "Audio frontal",
    short: "Cabezal HD Audio (AAFP).", type: "audiof", target: "audio-header", dependsOn: "mobo",
    info: "El cable de audio frontal se conecta al cabezal HD Audio (AAFP), normalmente en la esquina inferior izquierda de la placa.",
    wrong: "El audio frontal va al cabezal HD Audio (AAFP) de la placa." },

  { id: "manage", name: "Administrar cableado",
    short: "Ordena los cables por detrás.", type: "manage", target: "cable-route", dependsOn: ["atx", "eps", "sataPower"],
    info: "Pasa los cables por detrás de la bandeja y sujétalos con cinchos. Un buen cable management mejora el flujo de aire y la estética antes de cerrar.",
    wrong: "El cable management se hace por detrás de la bandeja, organizando todos los cables." },

  { id: "sidePanel", name: "Panel lateral",
    short: "Coloca el panel del gabinete.", type: "sidepanel", target: "case-close", dependsOn: "manage",
    info: "Con todo conectado y ordenado, coloca el panel lateral en su sitio.",
    wrong: "El panel lateral se coloca al final, cuando ya está todo conectado y ordenado." },

  { id: "screwPanel", name: "Atornillar el panel lateral",
    short: "Cierre final del gabinete.", type: "screws", target: "case-close", dependsOn: "sidePanel",
    info: "Atornilla el panel lateral para cerrar el gabinete. ¡La PC está lista para encender!",
    wrong: "Estos tornillos cierran y fijan el panel lateral del gabinete." },

  /* ---------- Periféricos (antes iban en un módulo aparte) ---------- */
  { id: "keyboard", name: "Teclado",
    short: "Dispositivo de entrada · USB.", type: "keyboard", target: "usb-rear", dependsOn: "screwPanel",
    info: "El teclado es un dispositivo de ENTRADA: convierte tus pulsaciones en datos que el CPU procesa. Se conecta a cualquier puerto USB del panel trasero (o frontal). No necesita controladores especiales para funcionar en el arranque.",
    wrong: "El teclado se conecta a un puerto USB del panel trasero del gabinete." },

  { id: "mouse", name: "Mouse",
    short: "Dispositivo de entrada · USB.", type: "mouse", target: "usb-rear-2", dependsOn: "keyboard",
    info: "El mouse también es un dispositivo de ENTRADA. Se conecta a otro puerto USB libre del panel trasero. Junto con el teclado permite operar el sistema desde el primer arranque.",
    wrong: "El mouse se conecta a otro puerto USB libre del panel trasero." },

  { id: "monitor", name: "Monitor",
    short: "Salida de video · ¡cuidado dónde lo conectas!", type: "monitor", target: "video-gpu", dependsOn: ["mouse", "gpu"],
    info: "El monitor es un dispositivo de SALIDA. Como este equipo tiene tarjeta gráfica dedicada, el cable debe ir a una salida de la GPU (parte baja del panel trasero). Si se conecta al puerto de video de la placa madre, el monitor no recibirá señal.",
    wrong: "El monitor va conectado a una salida de video de la tarjeta gráfica, en la parte baja del panel trasero." }
];

/* Numeración automática de pasos (los del mismo grupo comparten número). */
(function () {
  let n = 0; const grupos = {};
  components.forEach(c => {
    if (c.group) { if (grupos[c.group] == null) grupos[c.group] = ++n; c.step = grupos[c.group]; }
    else c.step = ++n;
  });
})();


/* ---------- Estado del ensamble ---------- */
let selectedId = null;
let placed = new Set();
/* Orden MEZCLADO de las piezas, para que el alumno piense cuál va
   y no siga la lista en orden. Se mezcla una vez al cargar. */
let partsOrder = components.slice();
for (let i = partsOrder.length - 1; i > 0; i--) {
  const j = (Math.random() * (i + 1)) | 0;
  [partsOrder[i], partsOrder[j]] = [partsOrder[j], partsOrder[i]];
}

/* ---------- Referencias del DOM ---------- */
const partsList     = document.getElementById("partsList");
const progressLabel = document.getElementById("progressLabel");
const progressBar   = document.getElementById("progressBar");
const phaseText     = document.getElementById("phaseText");
const infoBox       = document.getElementById("componentInfo");
const stepGuide     = document.getElementById("stepGuide");
const highlightBtn  = document.getElementById("highlightBtn");
const resetBtn      = document.getElementById("resetBtn");
const toast         = document.getElementById("toast");

const pcCase        = document.getElementById("pcCase");
const motherboard   = document.getElementById("motherboard");
const boardScene    = document.getElementById("boardScene");
const powerBtn      = document.getElementById("powerBtn");
const poweredBadge  = document.getElementById("poweredBadge");
const autoBtn       = document.getElementById("autoBtn");
const layersBtn     = document.getElementById("layersBtn");
const centerBtn     = document.getElementById("centerBtn");
const soundBtn      = document.getElementById("soundBtn");
const confettiCanvas= document.getElementById("confetti");
const bootScreen    = document.getElementById("bootScreen");
const bootFill      = document.getElementById("bootFill");
const bootLog       = document.getElementById("bootLog");
const sidePanelGlass= document.getElementById("sidePanelGlass");

const errorModal = document.getElementById("errorModal");
const errorTitle = document.getElementById("errorTitle");
const errorBody  = document.getElementById("errorBody");
const errorClose = document.getElementById("errorClose");

const specModal  = document.getElementById("specModal");
const specTitle  = document.getElementById("specTitle");
const specRole   = document.getElementById("specRole");
const specBody   = document.getElementById("specBody");
const specExtra  = document.getElementById("specExtra");
const specVisual = document.getElementById("specVisual");
const specClose  = document.getElementById("specClose");

/* Elementos del panel de explicación contextual (pueden no existir) */
const learnPanel = document.getElementById("learnPanel");
const bubble     = document.getElementById("instructionBubble");
const catIndex   = document.getElementById("catIndex");


/* ---------- Etiquetas de cada slot ---------- */
const SLOT_LABELS = {
  "standoffs": "STANDOFFS", "mobo-tray": "PLACA MADRE",
  "cpu-socket": "CPU SOCKET", "cpu-paste": "PASTA", "cooler-mount": "COOLER",
  "ram-slot-1": "RAM A2", "ram-slot-2": "RAM B2", "m2-slot": "M.2 NVMe",
  "pcie-slot": "PCIe x16", "psu-bay": "FUENTE (PSU)",
  "sata-bay": "BAHÍA 2.5\"", "hdd-bay": "BAHÍA 3.5\"",
  "fan-front": "VENT. FRONTAL", "fan-rear": "VENT. TRASERO",
  "eps-header": "EPS 8-PIN", "atx-header": "24-PIN", "pcie-power": "PCIe PWR",
  "sata-data": "SATA DATOS", "sata-power": "SATA PWR", "cpu-fan-header": "CPU_FAN",
  "fp-pwr-sw": "POWER SW", "fp-rst-sw": "RESET SW",
  "fp-hdd-led": "HDD LED +/−", "fp-pwr-led": "POWER LED +/−",
  "usb-header": "USB FRONTAL", "audio-header": "AUDIO FRONTAL",
  "cable-route": "ORGANIZAR CABLES", "case-close": "PANEL LATERAL",
  "usb-rear": "USB 1", "usb-rear-2": "USB 2", "video-gpu": "VIDEO GPU", "video-mobo": "VIDEO PLACA"
};

/* Qué pieza pertenece a cada slot (para avisar cuando se equivocan de lugar) */
const TARGET_TO_NAME = {};
components.forEach(c => { if (!TARGET_TO_NAME[c.target]) TARGET_TO_NAME[c.target] = c.name; });

/* Dato extra del chipset, se muestra en la ficha de placa y CPU */
const CHIPSET = {
  name: "AMD X570",
  note: "Dato extra — Chipset AMD X570: es el 'centro de comunicaciones' de la placa. Gestiona las líneas PCIe 4.0 (para GPU y SSD M.2 de alta velocidad), los puertos SATA y USB, y permite overclocking en CPUs Ryzen con socket AM4. Un chipset superior ofrece más líneas PCIe y conectividad; uno básico (como A520/B550) recorta algunas."
};

/* ---------- Ficha técnica de cada pieza (pares [etiqueta, valor]) ---------- */
const SPECS = {
  standoffs: [["Material", "Latón niquelado"], ["Rosca", "#6-32 / M3"], ["Altura", "~6 mm"], ["Función", "Aislar y elevar la placa"]],
  mobo: [["Formato", "ATX"], ["Socket", "AM4"], ["Chipset", "X570"], ["Memoria", "4× DDR4 (dual channel)"], ["Expansión", "PCIe 4.0 x16"]],
  cpu: [["Socket", "AM4"], ["Núcleos / hilos", "8 / 16"], ["Frecuencia", "3.8–4.7 GHz"], ["Caché L3", "32 MB"], ["TDP", "105 W"]],
  paste: [["Tipo", "Pasta térmica (no conductora)"], ["Conductividad", "~8.5 W/mK"], ["Cantidad", "Tamaño de un guisante"], ["Función", "Rellenar microporos CPU–disipador"]],
  cooler: [["Tipo", "Aire (torre)"], ["Disipación", "hasta ~200 W TDP"], ["Ventilador", "120 mm PWM"], ["Conector", "CPU_FAN 4-pin"]],
  aio: [["Tipo", "Líquida AIO"], ["Radiador", "240 mm"], ["Ventiladores", "2× 120 mm"], ["Bomba", "Integrada en el bloque"], ["Conector", "CPU_FAN / AIO_PUMP"]],
  ram1: [["Tipo", "DDR4"], ["Capacidad", "8 GB"], ["Velocidad", "3200 MHz"], ["Ranura", "A2"], ["Modo", "Dual channel (con B2)"]],
  ram2: [["Tipo", "DDR4"], ["Capacidad", "8 GB"], ["Velocidad", "3200 MHz"], ["Ranura", "B2"], ["Modo", "Dual channel (con A2)"]],
  m2: [["Interfaz", "PCIe 4.0 x4 NVMe"], ["Formato", "M.2 2280"], ["Capacidad", "1 TB"], ["Lectura", "~7000 MB/s"]],
  psu: [["Potencia", "650 W"], ["Certificación", "80+ Bronze"], ["Cableado", "Semi-modular"], ["Conectores", "ATX / EPS / PCIe / SATA"]],
  ssd: [["Interfaz", "SATA III (6 Gb/s)"], ["Formato", "2.5\""], ["Capacidad", "1 TB"], ["Velocidad", "~550 MB/s"]],
  hdd: [["Interfaz", "SATA III"], ["Formato", "3.5\""], ["Capacidad", "2 TB"], ["Velocidad", "7200 RPM"]],
  gpu: [["Interfaz", "PCIe 4.0 x16"], ["VRAM", "8 GB GDDR6"], ["Alimentación", "8-pin PCIe"], ["Salidas", "HDMI 2.1 / DisplayPort"]],
  fanFront: [["Tamaño", "120 mm"], ["Conector", "4-pin PWM"], ["Flujo", "Entrada (intake)"], ["Posición", "Frontal"]],
  fanRear: [["Tamaño", "120 mm"], ["Conector", "4-pin PWM"], ["Flujo", "Salida (exhaust)"], ["Posición", "Trasera"]],
  eps: [["Conector", "EPS 8-pin (4+4)"], ["Voltaje", "12 V"], ["Alimenta", "CPU (VRM)"], ["Cabezal", "Esquina superior izquierda"]],
  atx: [["Conector", "ATX 24-pin (20+4)"], ["Voltaje", "3.3 / 5 / 12 V"], ["Alimenta", "Placa madre"], ["Cabezal", "Borde derecho"]],
  pcie: [["Conector", "PCIe 6+2 pin"], ["Voltaje", "12 V"], ["Alimenta", "Tarjeta gráfica"]],
  sataData: [["Cable", "SATA de datos"], ["Ancho de banda", "6 Gb/s"], ["Alimenta", "No (solo datos)"], ["Conecta", "Disco → placa"]],
  sataPower: [["Conector", "SATA power 15-pin"], ["Voltaje", "3.3 / 5 / 12 V"], ["Origen", "Fuente"], ["Alimenta", "Discos SATA"]],
  cpuFan: [["Conector", "3/4-pin PWM"], ["Cabezal", "CPU_FAN"], ["Función", "Controla las RPM del disipador"], ["Ubicación", "Junto al socket"]],
  pwrSw: [["Tipo", "Interruptor"], ["Cabezal", "F_PANEL"], ["Polaridad", "No aplica"], ["Función", "Encender la PC"]],
  rstSw: [["Tipo", "Interruptor"], ["Cabezal", "F_PANEL"], ["Polaridad", "No aplica"], ["Función", "Reiniciar la PC"]],
  hddLed: [["Tipo", "LED"], ["Cabezal", "F_PANEL"], ["Polaridad", "Sí (+ / −)"], ["Función", "Actividad de disco"]],
  pwrLed: [["Tipo", "LED"], ["Cabezal", "F_PANEL"], ["Polaridad", "Sí (+ / −)"], ["Función", "Indicador de encendido"]],
  usbFront: [["Cabezal", "USB frontal"], ["Estándar", "USB 3.0 (19-pin) / USB-C"], ["Origen", "Panel del gabinete"]],
  audioFront: [["Cabezal", "HD Audio (AAFP)"], ["Función", "Audio del panel frontal"], ["Posición", "Inferior izquierda"]],
  manage: [["Tarea", "Cable management"], ["Dónde", "Detrás de la bandeja"], ["Beneficio", "Mejor flujo de aire y estética"]],
  sidePanel: [["Pieza", "Panel lateral"], ["Material", "Cristal templado"], ["Cierre", "Tornillos de mano"]],
  keyboard: [["Tipo", "Dispositivo de entrada"], ["Interfaz", "USB / inalámbrico"], ["Formato", "104 teclas"], ["Función", "Introducir datos y comandos"]],
  mouse: [["Tipo", "Dispositivo de entrada"], ["Interfaz", "USB / inalámbrico"], ["Sensor", "Óptico 1600 DPI"], ["Función", "Señalar y seleccionar"]],
  monitor: [["Tipo", "Dispositivo de salida"], ["Conexión", "HDMI / DisplayPort"], ["Resolución", "1920×1080"], ["Se conecta a", "La GPU dedicada, no a la placa"]]
};

/* ---------- Cámara / vista 3D ---------- */
const PRESETS = {
  iso: [57, -33, 0.62], top: [0, 0, 0.68], left: [55, -62, 0.60],
  right: [55, -10, 0.60], rear: [55, 150, 0.60], internal: [22, -33, 0.78]
};
let rotX = 57, rotZ = -33, zoom = 0.62, panX = -200, panY = 0;
let autoOn = false, exploded = false, draggingBoard = false, panningBoard = false;
if (window.innerWidth <= 1220) zoom = 0.5;
if (window.innerWidth <= 720) zoom = 0.42;

/* =================================================================
   INICIO / REINICIO
   ================================================================= */
function initBuild() {
  selectedId = null;
  placed = new Set();

  pcCase.classList.remove("cpu-ready", "powered", "exploded", "xray", "liquid-cooling",
    "igniting", "lit-fans", "lit-ram", "lit-gpu");
  boardScene.classList.remove("power-dim");
  exploded = false;
  if (layersBtn) layersBtn.classList.remove("active");
  if (powerBtn) powerBtn.hidden = true;
  if (poweredBadge) poweredBadge.hidden = true;

  motherboard.classList.add("not-mounted");
  motherboard.classList.remove("screwing");
  const rad = document.getElementById("aioRadiator");
  if (rad) rad.remove();
  if (sidePanelGlass) { sidePanelGlass.hidden = true; sidePanelGlass.classList.remove("show"); }

  document.querySelectorAll(".slot").forEach(slot => {
    const t = slot.dataset.target;
    slot.innerHTML = `<span>${SLOT_LABELS[t] || t}</span>`;
    delete slot.dataset.installedId;
    slot.classList.remove("correct-flash", "wrong-flash", "next-step",
      "drop-ready", "drop-wrong", "occupied", "installing", "screwed", "inspecting");
  });

  renderParts();
  renderGuide();
  updateUI();
  showDefaultInfo();
  showToast("Banco de trabajo listo. Empieza colocando los separadores (standoffs).");
}

/* =================================================================
   PIEZAS DISPONIBLES (columna de tarjetas)
   ================================================================= */
function renderParts() {
  partsList.innerHTML = "";
  const currentId = getCurrentComponentId();

  partsOrder.forEach(component => {
    const done = placed.has(component.id);
    const skipped = !done && component.group && groupSatisfied(component.group);
    const available = depsMet(component);

    const card = document.createElement("div");
    card.className = "part-card";
    card.dataset.id = component.id;

    if (done) card.classList.add("is-done");
    else if (skipped) card.classList.add("skipped");
    else if (!available) card.classList.add("locked");
    //if (!done && !skipped && component.id === currentId) card.classList.add("current-part");

    const stepN = document.createElement("span");
    stepN.className = "step-n";
    stepN.textContent = "Paso " + component.step;

    const visualWrap = document.createElement("div");
    visualWrap.className = "part-visual";
    visualWrap.appendChild(createVisual(component.type));

    const text = document.createElement("div");
    text.innerHTML = `<h3>${component.name}</h3><p>${component.short}</p>`;

    card.appendChild(stepN);
    card.appendChild(visualWrap);
    card.appendChild(text);

    card.addEventListener("click", () => selectComponent(component.id));
    card.addEventListener("pointerdown", event => startDrag(event, component.id, card));

    partsList.appendChild(card);
  });
}

/* Devuelve el "dibujo" de cada tipo de pieza (una clase CSS). */
function createVisual(type) {
  const clases = {
    standoffs: "standoffs-visual", mobo: "mobo-visual", cpu: "cpu-visual",
    paste: "paste-visual", cooler: "cooler-visual", aio: "aio-visual",
    ram: "ram-visual", m2: "m2-visual", psu: "psu-visual",
    ssd: "ssd-visual", hdd: "hdd-visual", gpu: "gpu-visual", fan: "fan-visual",
    screws: "screws-visual",
    "cable-eps": "cable-eps-visual", "cable-atx": "cable-atx-visual",
    "cable-pcie": "cable-pcie-visual", "cable-sata-data": "cable-sata-data-visual",
    "cable-sata-power": "cable-sata-power-visual", manage: "cable-sata-power-visual",
    "fp-pin": "fp-pin-visual", "cable-fan": "cable-fan-visual",
    usbf: "usbf-visual", audiof: "audiof-visual", sidepanel: "sidepanel-visual",
    monitor: "monitor-visual", keyboard: "keyboard-visual", mouse: "mouse-visual"
  };
  const el = document.createElement("div");
  el.className = clases[type] || "ssd-visual";
  return el;
}

/* =================================================================
   ARRASTRAR Y SOLTAR
   ================================================================= */
function startDrag(event, componentId, card) {
  const component = getComponent(componentId);

  if (placed.has(componentId)) { selectComponent(componentId); return; }
  if (component.group && groupSatisfied(component.group)) {
    selectComponent(componentId);
    showToast("Ya elegiste la otra opción de refrigeración. Reinicia el montaje si quieres cambiarla.");
    return;
  }
  if (!depsMet(component)) {
    selectComponent(componentId);
    showToast("Aún no toca esta pieza. " + nextPendingDepText(component));
    return;
  }
  if (event.button !== undefined && event.button !== 0) return;

  event.preventDefault();
  selectComponent(componentId);
  card.classList.add("dragging-card");

  const ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.appendChild(createVisual(component.type));
  document.body.appendChild(ghost);

  moveGhost(ghost, event.clientX, event.clientY);
  updateDropPreview(component, event.clientX, event.clientY);

  function onMove(e) {
    moveGhost(ghost, e.clientX, e.clientY);
    updateDropPreview(component, e.clientX, e.clientY);
  }
  function onUp(e) {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", onUp);
    ghost.remove();
    card.classList.remove("dragging-card");
    clearDropPreview();
    checkDrop(component, e.clientX, e.clientY);
  }
  document.addEventListener("pointermove", onMove);
  document.addEventListener("pointerup", onUp);
}

function moveGhost(ghost, x, y) { ghost.style.left = x + "px"; ghost.style.top = y + "px"; }

function checkDrop(component, x, y) {
  // Trampa didáctica del monitor: si lo sueltan en el video de la PLACA (teniendo GPU)
  if (component.id === "monitor" && depsMet(component)) {
    const trampa = document.querySelector('.slot[data-target="video-mobo"]');
    if (trampa && isPointInsideSlot(x, y, trampa, 34)) {
      flashWrong(trampa);
      showError("Ese puerto no dará imagen",
        "Conectaste el monitor al puerto de video de la placa madre. Como el equipo tiene una tarjeta gráfica dedicada, la placa desactiva su salida y toda la imagen pasa por la GPU: el monitor se quedaría en negro con el aviso «sin señal». Los puertos de video de la placa solo funcionan cuando el procesador tiene gráficos integrados. Conecta el cable a una salida de la tarjeta gráfica, en la parte baja del panel trasero.");
      return;
    }
  }

  const targetSlot = getTargetSlot(component);

  if (!depsMet(component)) { showError("Falta un paso previo", nextPendingDepText(component)); return; }

  if (targetSlot && isPointInsideSlot(x, y, targetSlot, getTolerance(component))) {
    installComponent(component, targetSlot);
    return;
  }

  const nearest = getNearestSlot(x, y);
  if (nearest) {
    flashWrong(nearest);
    const nt = nearest.dataset.target;
    const belongsTo = TARGET_TO_NAME[nt];
    let extra = "";
    if (belongsTo && belongsTo !== component.name) extra = ` Ese lugar (${SLOT_LABELS[nt] || nt}) es para: ${belongsTo}.`;
    showError("Esa pieza no va ahí", component.wrong + extra);
  } else {
    showError("Fuera de lugar", component.wrong + " Acerca el centro de la pieza al slot correcto resaltado.");
  }
}

function getTargetSlot(component) {
  return document.querySelector(`.slot[data-target="${component.target}"]`);
}

/* Margen de acierto al soltar (los periféricos son finos porque los puertos están juntos) */
function getTolerance(component) {
  const tol = {
    standoffs: 90, mobo: 90, cpu: 55, paste: 50, cooler: 75, aio: 75,
    ram: 75, m2: 60, gpu: 75, psu: 75, ssd: 65, hdd: 70, fan: 75, screws: 70,
    "cable-eps": 60, "cable-atx": 60, "cable-pcie": 60,
    "cable-sata-data": 60, "cable-sata-power": 60,
    "fp-pin": 46, "cable-fan": 50, usbf: 55, audiof: 55, manage: 80, sidepanel: 100,
    monitor: 30, keyboard: 30, mouse: 30
  };
  return tol[component.type] || 65;
}

/* ¿El punto (x,y) donde solté cae dentro (o cerca) del slot?
   Tomamos el rectángulo del slot en pantalla y le sumamos un margen
   ('tolerance') para que no haya que apuntar con precisión perfecta. */
function isPointInsideSlot(x, y, slot, tolerance) {
  const r = slot.getBoundingClientRect();
  return x >= r.left - tolerance && x <= r.right + tolerance &&
         y >= r.top - tolerance && y <= r.bottom + tolerance;
}

/* Devuelve el slot MÁS CERCANO al punto donde se soltó (para poder
   avisar "esa pieza no va en ese hueco"). Calcula la distancia al centro
   de cada slot y se queda con la menor, si está a menos de 200px. */
function getNearestSlot(x, y) {
  const slots = [...document.querySelectorAll(".slot")].filter(s => {
    const r = s.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  let nearest = null, best = Infinity;
  slots.forEach(slot => {
    const r = slot.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const d = Math.hypot(x - cx, y - cy);
    if (d < best) { best = d; nearest = slot; }
  });
  return best < 200 ? nearest : null;
}

function updateDropPreview(component, x, y) {
  clearDropPreview();
  const targetSlot = getTargetSlot(component);
  if (targetSlot && isPointInsideSlot(x, y, targetSlot, getTolerance(component))) {
    targetSlot.classList.add("drop-ready");
    return;
  }
  const nearest = getNearestSlot(x, y);
  if (nearest) nearest.classList.add("drop-wrong");
}

function clearDropPreview() {
  document.querySelectorAll(".slot").forEach(s => s.classList.remove("drop-ready", "drop-wrong"));
}

/* =================================================================
   INSTALACIÓN (con su animación de encaje)
   ================================================================= */
function installComponent(component, slot) {
  if (placed.has(component.id)) return;

  if (component.type === "screws") {
    const tool = document.createElement("div");
    tool.className = "tool-screwdriver";
    tool.innerHTML = "<span class='sd-handle'></span><span class='sd-shaft'></span><span class='sd-tip'></span>";
    slot.appendChild(tool);
    setTimeout(() => tool.remove(), 900);

    if (component.id === "screwMobo") {
      motherboard.classList.add("screwing");
      setTimeout(() => motherboard.classList.remove("screwing"), 850);
    } else {
      const marks = document.createElement("div");
      marks.className = "screw-marks tightening";
      marks.innerHTML = "<i></i><i></i><i></i><i></i>";
      slot.appendChild(marks);
      setTimeout(() => marks.classList.remove("tightening"), 850);
    }
    slot.classList.add("screwed");

  } else if (component.target === "mobo-tray") {
    motherboard.classList.remove("not-mounted");
    slot.dataset.installedId = component.id;
    slot.classList.add("occupied", "correct-flash");
    setTimeout(() => slot.classList.remove("correct-flash"), 700);

  } else if (component.target === "case-close") {
    slot.dataset.installedId = component.id;
    slot.classList.add("occupied", "correct-flash");
    setTimeout(() => slot.classList.remove("correct-flash"), 700);
    if (sidePanelGlass) { sidePanelGlass.hidden = false; sidePanelGlass.classList.add("show"); }

  } else {
    const installed = document.createElement("div");
    installed.className = "installed-component";
    installed.appendChild(createVisual(component.type));
    slot.innerHTML = "";
    slot.appendChild(installed);
    slot.dataset.installedId = component.id;
    slot.classList.add("occupied", "correct-flash", "installing");
    setTimeout(() => slot.classList.remove("installing"), 650);
    setTimeout(() => slot.classList.remove("correct-flash"), 700);

    if (component.id === "aio") {
      pcCase.classList.add("liquid-cooling");
      if (!document.getElementById("aioRadiator")) {
        const r = document.createElement("div");
        r.id = "aioRadiator";
        r.className = "aio-radiator";
        r.innerHTML = "<div class='aio-fan'></div><div class='aio-fan'></div><div class='aio-fan'></div>" +
          "<span class='aio-tube tube-a'></span><span class='aio-tube tube-b'></span>";
        pcCase.appendChild(r);
      }
    }
  }

  placed.add(component.id);
  if (component.id === "cpu") pcCase.classList.add("cpu-ready");

  renderParts();
  renderGuide();
  updateUI();
  selectComponent(component.id);
  playInstallSound(component);


  showToast(component.type === "screws" ? `🔩 ${component.name} listo.` : `✅ ${component.name} instalado correctamente.`);

  if (effectivePlaced() === effectiveTotal()) finishBuild();
}

function flashWrong(slot) {
  slot.classList.add("wrong-flash");
  setTimeout(() => slot.classList.remove("wrong-flash"), 650);
}

function finishBuild() {
  if (powerBtn) powerBtn.hidden = false;
  phaseText.textContent = "¡Ensamblaje completo!";
  showToast("🎉 ¡PC ensamblada! Pulsa “Encender PC” para hacer el POST.");
}

/* =================================================================
   GUÍA · INFO · UI
   ================================================================= */
function renderGuide() {
    if (!stepGuide) { refrescarContexto(); return; }
  const currentId = getCurrentComponentId();
  stepGuide.innerHTML = "";
  components.forEach(c => {
    const done = placed.has(c.id);
    const skipped = !done && c.group && groupSatisfied(c.group);
    if (skipped) return;

    const item = document.createElement("div");
    item.className = "guide-item";
    if (done) item.className += " done";
    else if (c.id === currentId) item.className += " current";
    item.innerHTML = `<span class="gi-n"><span class="gi-text-n">${c.step}</span></span><span>${c.name}</span>`;
    item.addEventListener("click", () => selectComponent(c.id));
    stepGuide.appendChild(item);
  });
  refrescarContexto();   // actualiza panel de aprendizaje + índice + destino
}

/* Pequeña ayuda: arma la tabla de la ficha técnica */
function tablaSpecs(specs) {
  if (!specs) return "";
  return `<table class="spec-table"><tbody>` +
    specs.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("") + `</tbody></table>`;
}

function selectComponent(componentId) {
  selectedId = componentId;
  document.querySelectorAll(".part-card").forEach(card =>
    card.classList.toggle("selected", card.dataset.id === componentId));

  const c = getComponent(componentId);
  let status;
  if (placed.has(c.id)) status = "Instalado ✓";
  else if (c.group && groupSatisfied(c.group)) status = "Alternativa no usada (elegiste la otra refrigeración)";
  else if (depsMet(c)) status = "Listo para instalar";
  else status = "Bloqueado — " + nextPendingDepText(c);

  const specsHtml = SPECS[c.id]
    ? `<div class="spec-sheet"><h4>Ficha técnica</h4>${tablaSpecs(SPECS[c.id])}</div>` : "";

  if (infoBox) infoBox.innerHTML = `
    <h3>${c.name}</h3>
    <p>${c.info}</p>
    ${specsHtml}
    <p><strong>Va en:</strong> ${SLOT_LABELS[c.target] || c.target}</p>
    <p><strong>Estado:</strong> ${status}</p>`;

  mostrarLearnDePieza(c);   // panel contextual de la pieza seleccionada
}

function showDefaultInfo() {
  if (infoBox) infoBox.innerHTML = `
    <p>Selecciona o arrastra un componente para ver su descripción y dónde se instala.</p>
    <p>Sigue el orden de la guía. En el paso 6 eliges refrigeración por <strong>aire</strong> o <strong>líquida</strong>.</p>
    <p>🔍 <strong>Tip:</strong> haz clic en una pieza ya instalada dentro del gabinete para ver su <strong>ficha técnica</strong>.</p>`;
}

function updateUI() {
  const n = effectivePlaced(), total = effectiveTotal();
  progressLabel.textContent = `Ensamblaje: ${n} / ${total} pasos`;
  progressBar.style.width = (n / total * 100) + "%";
  const cur = getCurrentComponent();
  if (cur) phaseText.textContent = `${cur.step}. ${cur.name}`;
  else if (n === total) phaseText.textContent = "¡Ensamblaje completo!";
}

function highlightNextStep() {
  const cur = getCurrentComponent();
  if (!cur) { showToast("No quedan pasos pendientes."); return; }
  selectComponent(cur.id);
  const slot = getTargetSlot(cur);
  if (slot) { slot.classList.add("next-step"); setTimeout(() => slot.classList.remove("next-step"), 3200); }
  showToast(`Siguiente paso: ${cur.name} → ${SLOT_LABELS[cur.target] || cur.target}.`);
}

/* =================================================================
   EXPLICACIÓN CONTEXTUAL  (teoría ANTES de instalar)
   Panel de aprendizaje del paso actual, burbuja de instrucción,
   índice de categorías y resaltado permanente del destino.
   ================================================================= */
const CATEGORIAS = [
  { n: "Preparación del chasis", ids: ["standoffs", "mobo", "screwMobo"] },
  { n: "Procesador y refrigeración", ids: ["cpu", "paste", "cooler", "aio", "cpuFan"] },
  { n: "Memoria y almacenamiento", ids: ["ram1", "ram2", "m2", "ssd", "hdd", "screwDrives"] },
  { n: "Energía", ids: ["psu", "screwPsu", "eps", "atx", "pcie", "sataPower"] },
  { n: "Expansión y ventilación", ids: ["gpu", "screwGpu", "fanFront", "fanRear", "screwFans"] },
  { n: "Conexiones del panel frontal", ids: ["sataData", "pwrSw", "rstSw", "hddLed", "pwrLed", "usbFront", "audioFront"] },
  { n: "Cierre del equipo", ids: ["manage", "sidePanel", "screwPanel"] },
  { n: "Periféricos", ids: ["keyboard", "mouse", "monitor"] }
];

const INSTRUCCIONES = {
  standoffs: "Atornilla los separadores en la bandeja siguiendo el patrón ATX.",
  mobo: "Apoya la placa sobre los separadores, alineando el I/O shield con la parte trasera.",
  screwMobo: "Atornilla la placa en cada separador sin apretar de más.",
  cpu: "Levanta la palanca del socket y alinea el triángulo dorado del CPU con el de la placa.",
  paste: "Aplica un punto de pasta del tamaño de un guisante en el centro del procesador.",
  cooler: "Asienta el disipador sobre la pasta y fíjalo con sus sujetadores.",
  aio: "Coloca el bloque de la bomba sobre el CPU; el radiador se fija arriba del gabinete.",
  cpuFan: "Conecta el cable del ventilador al cabezal CPU_FAN, junto al socket.",
  ram1: "Abre los seguros, alinea la muesca y presiona hasta oír el clic.",
  ram2: "Coloca el segundo módulo en B2 para activar el doble canal.",
  m2: "Inserta el SSD en ángulo, bájalo y fíjalo con su tornillo.",
  psu: "Coloca la fuente en su compartimento inferior, con el ventilador hacia abajo.",
  screwPsu: "Fija la fuente con sus cuatro tornillos por la parte trasera.",
  ssd: "Coloca el SSD de 2.5\" en su bahía.",
  hdd: "Monta el disco de 3.5\" en la jaula de discos.",
  screwDrives: "Atornilla ambos discos para que no vibren.",
  gpu: "Inserta la GPU en el PCIe x16 hasta oír el clic del seguro.",
  screwGpu: "Atornilla el bracket de la GPU al chasis.",
  fanFront: "Monta el ventilador frontal con la flecha apuntando hacia dentro.",
  fanRear: "Monta el ventilador trasero con la flecha apuntando hacia fuera.",
  screwFans: "Fija cada ventilador con sus cuatro tornillos largos.",
  eps: "Conecta el EPS de 8 pines en la esquina superior izquierda de la placa.",
  atx: "Conecta el ATX de 24 pines en el borde derecho hasta que haga clic.",
  pcie: "Conecta el cable PCIe a los conectores de energía de la GPU.",
  sataData: "Lleva el cable plano SATA del disco a un puerto SATA de la placa.",
  sataPower: "Conecta la alimentación SATA de la fuente a los discos.",
  pwrSw: "Coloca el Power SW en su par de pines del F_PANEL. No tiene polaridad.",
  rstSw: "Coloca el Reset SW en su par de pines. Tampoco tiene polaridad.",
  hddLed: "Es un LED: respeta la polaridad, el positivo va en su pin marcado.",
  pwrLed: "También es un LED: coloca el positivo en el pin correcto o no encenderá.",
  usbFront: "Conecta el cable USB del gabinete a su cabezal en la placa.",
  audioFront: "Conecta el audio frontal al cabezal HD Audio (AAFP).",
  manage: "Pasa los cables por detrás de la bandeja y sujétalos con cinchos.",
  sidePanel: "Coloca el panel lateral en su sitio.",
  screwPanel: "Atornilla el panel y cierra el gabinete.",
  keyboard: "Conecta el teclado a un puerto USB del panel trasero.",
  mouse: "Conecta el mouse a otro puerto USB libre.",
  monitor: "Conecta el monitor a una salida de la tarjeta gráfica, no a la placa."
};

/* Panel del PASO ACTUAL */
function pintarLearn() {
  if (!learnPanel) return;
  const c = getCurrentComponent();

  if (!c) {
    learnPanel.innerHTML =
      `<div class="learn-head">ENSAMBLAJE COMPLETO</div>
       <div class="learn-body"><p>Todos los pasos están cubiertos. Pulsa <strong>Encender PC</strong> para ejecutar el POST y verificar el equipo.</p></div>`;
    if (bubble) bubble.innerHTML = `<span class="instr-ico">✅</span><span>Ensamblaje terminado. Ya puedes encender el equipo.</span>`;
    return;
  }

  learnPanel.innerHTML =
    `<div class="learn-head">ANTES DE INSTALAR · PASO ${c.step}</div>
     <h3>${c.name}</h3>
     <div class="learn-body">
       <p>${c.info}</p>
       <p class="learn-where">📍 Va en: <strong>${SLOT_LABELS[c.target] || c.target}</strong></p>
       ${tablaSpecs(SPECS[c.id])}
     </div>`;

  if (bubble) bubble.innerHTML =
    `<span class="instr-ico">🛠️</span><span>${INSTRUCCIONES[c.id] || ("Coloca " + c.name + " en " + (SLOT_LABELS[c.target] || c.target) + ".")}</span>`;
}

/* Panel de una pieza SELECCIONADA (consulta o "aún no toca") */
function mostrarLearnDePieza(c) {
  if (!learnPanel) return;
  const actual = getCurrentComponentId();
  if (!c || c.id === actual || placed.has(c.id)) { pintarLearn(); return; }

  const listo = depsMet(c);
  learnPanel.innerHTML =
    `<div class="learn-head">${listo ? "CONSULTA · PASO " + c.step : "AÚN NO TOCA · PASO " + c.step}</div>
     <h3>${c.name}</h3>
     <div class="learn-body">
       <p>${c.info}</p>
       <p class="learn-where">📍 Va en: <strong>${SLOT_LABELS[c.target] || c.target}</strong></p>
       ${listo ? "" : `<p class="learn-where">🔒 ${nextPendingDepText(c)}</p>`}
       ${tablaSpecs(SPECS[c.id])}
     </div>`;
}

/* Índice de categorías con avance por grupo */
function pintarIndice() {
  if (!catIndex) return;
  const actual = getCurrentComponentId();
  catIndex.innerHTML = "";
  CATEGORIAS.forEach(cat => {
    const piezas = cat.ids.map(getComponent)
      .filter(c => c && !(c.group && groupSatisfied(c.group) && !placed.has(c.id)));
    if (!piezas.length) return;

    const hechas = piezas.filter(c => placed.has(c.id)).length;
    const completa = hechas === piezas.length;
    const activa = piezas.some(c => c.id === actual);

    const el = document.createElement("div");
    el.className = "cat-item" + (completa ? " done" : "") + (activa ? " active" : "");
    el.innerHTML = `<span class="ci-dot">${completa ? "✓" : "•"}</span><span>${cat.n}</span><span style="margin-left:auto">${hechas}/${piezas.length}</span>`;
    catIndex.appendChild(el);
  });
}

/* NOTA: el resaltado automático del slot destino se retiró a propósito.
   Antes se marcaba siempre el hueco correcto (clase 'target-now'), lo que
   volvía inútil el botón "Resaltar siguiente paso" y hacía que el usuario
   solo soltara donde brillaba. Ahora debe SABER dónde va cada pieza; el
   botón sigue disponible como pista puntual y el panel explica CÓMO ponerla. */
function refrescarContexto() { pintarLearn(); pintarIndice(); }

/* =================================================================
   HELPERS de dependencias / conteo
   -----------------------------------------------------------------
   Estas funciones cortas son el "cerebro" de las reglas del armado:
   deciden qué pieza sigue, cuáles están bloqueadas y cuánto llevas.
   ================================================================= */
function getComponent(id) { return components.find(c => c.id === id); }

/* Lista de dependencias de una pieza, siempre como arreglo. */
function depsList(component) {
  if (!component.dependsOn) return [];
  return Array.isArray(component.dependsOn) ? component.dependsOn : [component.dependsOn];
}
function isGroupToken(d) { return typeof d === "string" && d.indexOf("group:") === 0; }
function groupSatisfied(g) { return g ? components.some(c => c.group === g && placed.has(c.id)) : false; }
function depMet(d) { return isGroupToken(d) ? groupSatisfied(d.slice(6)) : placed.has(d); }
function depsMet(component) { return depsList(component).every(depMet); }

function nextPendingDepText(component) {
  const pending = depsList(component).filter(d => !depMet(d))
    .map(d => isGroupToken(d) ? "la refrigeración" : getComponent(d).name);
  if (!pending.length) return "Ya puedes instalarla.";
  return "Primero instala: " + pending.join(", ") + ".";
}

function getCurrentComponent() {
  return components.find(c => !placed.has(c.id) && !(c.group && groupSatisfied(c.group))) || null;
}
function getCurrentComponentId() { const c = getCurrentComponent(); return c ? c.id : null; }

/* Total y colocadas contando el grupo de refrigeración como UN paso
   (aire y líquida son la misma etapa, aunque haya dos piezas posibles). */
function effectiveTotal() {
  const seen = new Set(); let t = 0;
  components.forEach(c => {
    if (c.group) { if (!seen.has(c.group)) { seen.add(c.group); t++; } } else t++;
  });
  return t;
}
function effectivePlaced() {
  const seen = new Set(); let n = 0;
  components.forEach(c => {
    if (!placed.has(c.id)) return;
    if (c.group) { if (!seen.has(c.group)) { seen.add(c.group); n++; } } else n++;
  });
  return n;
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2800);
}

function showError(title, body) {
  sfxError();
  errorTitle.textContent = title;
  errorBody.textContent = body;
  errorModal.hidden = false;
}

/* Ficha técnica centrada al colocar una pieza */
function showSpecModal(component) {
  const isScrew = component.type === "screws";
  specTitle.textContent = component.name;
  specRole.textContent = component.info || "";

  if (SPECS[component.id]) {
    specBody.innerHTML = `<div class="spec-sheet"><h4>Ficha técnica</h4>${tablaSpecs(SPECS[component.id])}</div>`;
  } else {
    specBody.innerHTML = `<div class="spec-sheet"><h4>Función</h4><p class="spec-func">${component.short || component.info || ""}</p></div>`;
  }

  if (component.id === "mobo" || component.id === "cpu") {
    specExtra.textContent = CHIPSET.note; specExtra.hidden = false;
  } else { specExtra.hidden = true; specExtra.textContent = ""; }

  specVisual.innerHTML = "";
  specVisual.appendChild(createVisual(component.type));
  specVisual.classList.toggle("is-screw", isScrew);
  specModal.hidden = false;
}

/* =================================================================
   SONIDOS (Web Audio, sin archivos externos)
   -----------------------------------------------------------------
   No cargamos archivos .mp3: generamos los sonidos por programación.
   · _noise() crea "ruido" (como un clic o un chasquido) filtrándolo.
   · _blip() crea un tono puro (un pitido) con un oscilador.
   Los demás (sfxClick, sfxPlug, ...) combinan esos dos para lograr
   el sonido de cada acción. Es opcional: si el navegador no deja, no pasa nada.
   ================================================================= */
let _actx = null, soundOn = true;
function actx() {
  if (!_actx) { const A = window.AudioContext || window.webkitAudioContext; if (A) _actx = new A(); }
  return _actx;
}
["pointerdown", "keydown", "touchstart"].forEach(ev =>
  window.addEventListener(ev, () => { const a = actx(); if (a && a.state === "suspended") a.resume(); }, { passive: true }));

function _noise(dur, type, freq, gain) {
  const a = actx(); if (!a || !soundOn) return;
  const n = Math.max(1, (a.sampleRate * dur) | 0);
  const b = a.createBuffer(1, n, a.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  const s = a.createBufferSource(); s.buffer = b;
  const f = a.createBiquadFilter(); f.type = type; f.frequency.value = freq;
  const g = a.createGain();
  g.gain.setValueAtTime(gain, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0008, a.currentTime + dur);
  s.connect(f); f.connect(g); g.connect(a.destination); s.start();
}
function _blip(freq, dur, type, gain) {
  const a = actx(); if (!a || !soundOn) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || "square"; o.frequency.value = freq;
  g.gain.setValueAtTime(gain || 0.12, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0008, a.currentTime + dur);
  o.connect(g); g.connect(a.destination);
  o.start(); o.stop(a.currentTime + dur + 0.02);
}
function sfxClick() { _noise(0.05, "highpass", 2600, 0.22); _blip(1900, 0.04, "square", 0.05); }
function sfxPlug()  { _noise(0.10, "lowpass", 650, 0.26); _blip(150, 0.09, "sine", 0.12); }
function sfxScrew() { for (let i = 0; i < 5; i++) setTimeout(() => _noise(0.03, "bandpass", 1500, 0.18), i * 70); }
function sfxError() { _blip(220, 0.18, "sawtooth", 0.14); }
function sfxPower() {
  _blip(320, 0.12, "sawtooth", 0.10);
  setTimeout(() => _blip(520, 0.12, "sawtooth", 0.10), 90);
  setTimeout(() => _blip(780, 0.18, "triangle", 0.12), 180);
  setTimeout(() => _blip(1040, 0.55, "sine", 0.10), 300);
  setTimeout(() => _noise(1.2, "lowpass", 1000, 0.09), 120);
}
function playInstallSound(component) {
  if (component.type === "screws") sfxScrew();
  else if (component.type === "fp-pin" || component.type === "manage" || String(component.type).indexOf("cable") === 0) sfxPlug();
  else sfxClick();
}
function toggleSound() {
  soundOn = !soundOn;
  if (soundBtn) { soundBtn.classList.toggle("active", soundOn); soundBtn.textContent = soundOn ? "🔊 Sonido" : "🔇 Sonido"; }
  showToast(soundOn ? "Sonido activado." : "Sonido silenciado.");
}

/* =================================================================
   CÁMARA 360°, ZOOM, AUTO-GIRO, CAPAS
   -----------------------------------------------------------------
   No hay 3D "real": es un truco de CSS. La escena tiene transform con
   rotateX/rotateZ/scale y aquí solo cambiamos esos números:
   · applyTransform() aplica la rotación/zoom/desplazamiento actuales.
   · setupOrbit() escucha el mouse: arrastrar = girar, rueda = zoom,
     clic derecho/shift = desplazar (pan).
   · tickAuto() gira solo, poquito en cada cuadro, si el modo auto está activo.
   ================================================================= */
function applyTransform() {
  pcCase.style.transform = `translate(${panX}px, ${panY}px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${zoom})`;
}
function changeView(view) {
  const p = PRESETS[view]; if (!p) return;
  rotX = p[0]; rotZ = p[1]; zoom = p[2]; panX = -200; panY = 0;
  applyTransform();
  document.querySelectorAll(".view-btn[data-view]").forEach(b => b.classList.toggle("active", b.dataset.view === view));
}
function setupOrbit() {
  boardScene.addEventListener("contextmenu", e => e.preventDefault());
  boardScene.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    boardScene._lx = e.clientX; boardScene._ly = e.clientY;
    if (e.button === 2 || e.button === 1 || e.shiftKey || e.ctrlKey) { panningBoard = true; boardScene.classList.add("panning"); }
    else { draggingBoard = true; boardScene.classList.add("grabbing"); }
    pcCase.classList.add("no-trans");
  });
  window.addEventListener("pointermove", e => {
    if (panningBoard) {
      panX += (e.clientX - boardScene._lx); panY += (e.clientY - boardScene._ly);
      boardScene._lx = e.clientX; boardScene._ly = e.clientY; applyTransform(); return;
    }
    if (!draggingBoard) return;
    rotZ += (e.clientX - boardScene._lx) * 0.45;
    rotX -= (e.clientY - boardScene._ly) * 0.40;
    rotX = Math.max(-85, Math.min(89, rotX));
    boardScene._lx = e.clientX; boardScene._ly = e.clientY; applyTransform();
  });
  window.addEventListener("pointerup", () => {
    if (!draggingBoard && !panningBoard) return;
    draggingBoard = false; panningBoard = false;
    boardScene.classList.remove("grabbing", "panning"); pcCase.classList.remove("no-trans");
  });
  boardScene.addEventListener("wheel", e => {
    e.preventDefault();
    const rect = boardScene.getBoundingClientRect();
    const ex = e.clientX - (rect.left + rect.width / 2);
    const ey = e.clientY - (rect.top + rect.height / 2);
    const oldZoom = zoom;
    let newZoom = Math.max(0.32, Math.min(2.2, zoom + (e.deltaY < 0 ? 0.08 : -0.08)));
    const f = newZoom / oldZoom;
    panX = ex - f * (ex - panX); panY = ey - f * (ey - panY);
    zoom = newZoom; applyTransform();
  }, { passive: false });
}
function tickAuto() { if (autoOn && !draggingBoard) { rotZ += 0.16; applyTransform(); } requestAnimationFrame(tickAuto); }
function toggleAuto() { autoOn = !autoOn; autoBtn.classList.toggle("active", autoOn); }
function toggleLayers() {
  exploded = !exploded;
  pcCase.classList.toggle("exploded", exploded);
  layersBtn.classList.toggle("active", exploded);
  showToast(exploded ? "Vista en capas: arrastra para verla en 3D." : "Vista normal.");
}

/* =================================================================
   ENCENDIDO (RGB + efecto de luz)
   ================================================================= */
function powerOn() {
  if (powerBtn) powerBtn.hidden = true;
  sfxPower();
  boardScene.classList.add("power-dim");
  pcCase.classList.add("igniting");
  zoom = Math.min(2.2, zoom * 1.06); applyTransform();

  setTimeout(() => pcCase.classList.add("lit-fans"), 150);
  setTimeout(() => pcCase.classList.add("lit-ram"), 470);
  setTimeout(() => pcCase.classList.add("lit-gpu"), 780);
  setTimeout(() => {
    pcCase.classList.add("powered");
    boardScene.classList.remove("power-dim");
    if (poweredBadge) poweredBadge.hidden = false;
    powerFX();
    showToast("⚡ Sistema encendido. Iluminación RGB y ventiladores en marcha.");
  }, 1050);
  setTimeout(() => pcCase.classList.remove("igniting"), 1750);
}

/* Efecto visual del encendido dibujado en un <canvas>: un destello,
   unos anillos que se expanden y partículas ("motas") que suben.
   Cada cuadro se borra y se vuelve a dibujar con requestAnimationFrame,
   hasta que todo se desvanece. Es puramente decorativo. */
function powerFX() {
  const c = confettiCanvas, x = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const cx = innerWidth / 2, cy = innerHeight / 2.25;
  const cols = ["#52ffb8", "#6bbdff", "#b98cff", "#8affd6", "#7ed7ff"];
  const motes = Array.from({ length: 48 }, () => ({
    x: cx + (Math.random() - .5) * 170, y: cy + (Math.random() - .5) * 130,
    vx: (Math.random() - .5) * 0.8, vy: -(Math.random() * 1.7 + 0.6),
    r: Math.random() * 3 + 1.2, c: cols[(Math.random() * cols.length) | 0], life: 1, sway: Math.random() * 6.28
  }));
  const rings = [{ r: 12, a: 0.65, col: "#6bbdff" }, { r: 12, a: 0.55, col: "#b98cff" }, { r: 12, a: 0.45, col: "#52ffb8" }];
  let flash = 0.9;
  (function run() {
    x.clearRect(0, 0, c.width, c.height);
    if (flash > 0.02) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, 460);
      g.addColorStop(0, `rgba(255,255,255,${flash * 0.5})`); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.fillRect(0, 0, c.width, c.height); flash *= 0.9;
    }
    rings.forEach((ri, i) => {
      ri.r += 6 + i * 1.6; ri.a *= 0.966;
      x.beginPath(); x.arc(cx, cy, ri.r, 0, Math.PI * 2);
      x.strokeStyle = ri.col; x.globalAlpha = Math.max(ri.a, 0);
      x.lineWidth = 3; x.shadowBlur = 18; x.shadowColor = ri.col; x.stroke();
      x.globalAlpha = 1; x.shadowBlur = 0;
    });
    let alive = false;
    motes.forEach(p => {
      p.sway += 0.05; p.x += p.vx + Math.sin(p.sway) * 0.3; p.y += p.vy; p.vy *= 0.995; p.life -= 0.006;
      if (p.life > 0) {
        alive = true; x.globalAlpha = Math.max(p.life, 0);
        x.fillStyle = p.c; x.shadowBlur = 12; x.shadowColor = p.c;
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, Math.PI * 2); x.fill();
        x.globalAlpha = 1; x.shadowBlur = 0;
      }
    });
    if (alive || rings.some(r => r.a > 0.02) || flash > 0.02) requestAnimationFrame(run);
    else x.clearRect(0, 0, c.width, c.height);
  })();
}

/* =================================================================
   PANTALLA DE ARRANQUE
   ================================================================= */
function runBoot() {
  const msgs = ["Cargando módulos...", "Detectando hardware...", "Preparando piezas...", "Listo ✓"];
  let p = 0, mi = 0;
  const t = setInterval(() => {
    p += Math.random() * 18 + 8; if (p >= 100) p = 100;
    bootFill.style.width = p + "%";
    const i = Math.min(msgs.length - 1, Math.floor(p / 26));
    if (i !== mi) { mi = i; bootLog.textContent = msgs[i]; }
    if (p >= 100) { clearInterval(t); setTimeout(() => bootScreen.classList.add("hide"), 350); }
  }, 200);
}

/* =================================================================
   EVENTOS
   ================================================================= */
highlightBtn.addEventListener("click", highlightNextStep);
resetBtn.addEventListener("click", initBuild);
document.querySelectorAll(".view-btn[data-view]").forEach(b => b.addEventListener("click", () => changeView(b.dataset.view)));
autoBtn.addEventListener("click", toggleAuto);
layersBtn.addEventListener("click", toggleLayers);
centerBtn.addEventListener("click", () => changeView("iso"));
if (soundBtn) soundBtn.addEventListener("click", toggleSound);
powerBtn.addEventListener("click", powerOn);
document.getElementById("xrayBtn").addEventListener("click", function () {
  pcCase.classList.toggle("xray"); this.classList.toggle("active");
});
errorClose.addEventListener("click", () => { errorModal.hidden = true; });
errorModal.addEventListener("click", e => { if (e.target === errorModal) errorModal.hidden = true; });
specClose.addEventListener("click", () => { specModal.hidden = true; });
specModal.addEventListener("click", e => { if (e.target === specModal) specModal.hidden = true; });

/* Clic en una pieza YA instalada -> muestra su ficha técnica */
boardScene.addEventListener("click", e => {
  const slot = e.target.closest(".slot");
  if (!slot) return;
  const id = slot.dataset.installedId;
  if (!id) return;
  if (!(slot.classList.contains("occupied") || slot.classList.contains("screwed"))) return;
  selectComponent(id);
  slot.classList.add("inspecting");
  setTimeout(() => slot.classList.remove("inspecting"), 900);
  if (infoBox && infoBox.scrollIntoView) infoBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

setupOrbit();
applyTransform();
requestAnimationFrame(tickAuto);
runBoot();
initBuild();
