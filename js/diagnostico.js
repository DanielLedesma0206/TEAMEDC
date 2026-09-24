/* =====================================================================
   03-bloque3-diagnostico.js · BLOQUE 3 · MÓDULO 3 · DIAGNÓSTICO DE ERRORES (POST)
   =====================================================================
   Laboratorio: se enciende un equipo con una falla, el alumno observa
   los síntomas (beeps/LED/pantalla), deduce la CAUSA y aplica el ARREGLO.
   -----------------------------------------------------------------
   Va en su propia IIFE (aparte de los otros bloques) para mantener su
   estado —lote de casos, caso actual, aciertos— bien separado.
   Flujo de un caso:  runPost → askCause → askFix → closeCase → siguiente.
   ================================================================= */
(function () {
  const host = document.getElementById("modDiag");
  if (!host) return;

  /* Cada caso: equipo, síntoma visible, señal POST, causa, arreglo y teoría. */
  const CASES = [
    { id: "ram", nombre: "Equipo A", falla: "Sin imagen y pitidos largos repetidos",
      post: { pantalla: "negra", beeps: "1 pitido largo repetido", led: "DRAM (rojo) encendido" },
      causa: "La memoria RAM está mal asentada o no es compatible.",
      opcionesCausa: ["Memoria RAM mal instalada o incompatible", "Disco duro dañado", "Falta el sistema operativo", "El monitor está apagado"],
      fix: "Reasentar la RAM en A2/B2 hasta oír el clic y verificar que sea del tipo correcto (DDR).",
      opcionesFix: ["Reasentar la RAM y verificar su tipo (DDR)", "Formatear el disco", "Reinstalar Windows", "Cambiar el cable HDMI"],
      teoria: "El POST prueba la RAM antes que nada. El LED DRAM y un pitido largo repetido son el código típico de fallo de memoria: sin RAM válida el CPU no puede continuar." },

    { id: "cpu", nombre: "Equipo B", falla: "Los ventiladores giran un instante y se apaga",
      post: { pantalla: "negra", beeps: "sin pitidos", led: "CPU (rojo) encendido" },
      causa: "Falta el cable de alimentación EPS del CPU (8 pines).",
      opcionesCausa: ["Falta el cable EPS de 8 pines del CPU", "La RAM está llena", "El teclado no responde", "Falta el driver de la GPU"],
      fix: "Conectar el EPS de 8 pines en el cabezal superior izquierdo de la placa.",
      opcionesFix: ["Conectar el cable EPS del CPU", "Actualizar el navegador", "Cambiar el mouse", "Desfragmentar el disco"],
      teoria: "El CPU se alimenta por el conector EPS, aparte del ATX de 24 pines. Sin EPS, la placa intenta arrancar y corta de inmediato (encendido de un segundo) y marca el LED de CPU." },

    { id: "psu", nombre: "Equipo C", falla: "No enciende absolutamente nada",
      post: { pantalla: "negra", beeps: "ninguno", led: "todos apagados" },
      causa: "La fuente no entrega energía: interruptor apagado o ATX de 24 pines desconectado.",
      opcionesCausa: ["Fuente apagada o ATX 24-pin desconectado", "El monitor está en otra entrada", "La RAM es lenta", "El SSD está lleno"],
      fix: "Encender el interruptor de la fuente y conectar el ATX de 24 pines a la placa.",
      opcionesFix: ["Encender la fuente y conectar el ATX 24-pin", "Bajar el brillo", "Cambiar de navegador", "Borrar archivos temporales"],
      teoria: "Sin el ATX de 24 pines (o con la fuente apagada) la placa no recibe energía principal: no hay LEDs, ni ventiladores, ni POST. Es el primer punto a revisar cuando 'no enciende nada'." },

    { id: "storage", nombre: "Equipo D", falla: "Enciende pero dice 'No bootable device'",
      post: { pantalla: "mensaje: No bootable device", beeps: "1 pitido corto (POST OK)", led: "ninguno" },
      causa: "El disco con el sistema operativo no está conectado o no se detecta.",
      opcionesCausa: ["El disco del SO no está conectado/detectado", "La GPU está floja", "La RAM es insuficiente", "El disipador está sucio"],
      fix: "Conectar los cables SATA de datos y de poder del disco (o revisar el M.2) y fijar el orden de arranque.",
      opcionesFix: ["Conectar datos+poder del disco y revisar el orden de arranque", "Cambiar la fuente", "Reasentar la GPU", "Aplicar pasta térmica"],
      teoria: "Un pitido corto indica POST correcto: el hardware básico funciona. 'No bootable device' significa que no encuentra un disco con SO; casi siempre es un cable SATA suelto o el orden de arranque." },

    { id: "cooling", nombre: "Equipo E", falla: "Arranca y se apaga a los segundos; se siente caliente",
      post: { pantalla: "a veces llega al logo y se apaga", beeps: "1 corto y luego apagado", led: "CPU (temperatura)" },
      causa: "Falta pasta térmica o el disipador está mal montado (sobrecalentamiento).",
      opcionesCausa: ["Disipador mal montado / sin pasta térmica", "Falta RAM", "El cable HDMI está flojo", "El SSD está lleno"],
      fix: "Aplicar pasta térmica y montar bien el disipador; conectar su ventilador al CPU_FAN.",
      opcionesFix: ["Aplicar pasta y asentar el disipador + CPU_FAN", "Cambiar el monitor", "Reinstalar el SO", "Añadir otro disco"],
      teoria: "Si el CPU supera su temperatura crítica, la placa lo apaga para protegerlo. Sin pasta o con el disipador flojo, la temperatura se dispara en segundos: apagones al arrancar." },

    { id: "video", nombre: "Equipo F", falla: "POST correcto pero la pantalla dice 'Sin señal'",
      post: { pantalla: "Sin señal", beeps: "1 pitido corto (POST OK)", led: "VGA (blanco) parpadea" },
      causa: "El monitor está conectado a la placa teniendo una GPU dedicada instalada.",
      opcionesCausa: ["El monitor está conectado a la placa, no a la GPU", "El teclado está desconectado", "La fuente es de pocos watts", "El disco está dañado"],
      fix: "Pasar el cable de video a una salida de la tarjeta gráfica.",
      opcionesFix: ["Conectar el monitor a la salida de la GPU", "Cambiar la RAM", "Reinstalar drivers de red", "Cambiar el gabinete"],
      teoria: "Con una GPU dedicada, las salidas de video de la placa se desactivan (salvo que se configure lo contrario). Por eso hay POST pero 'sin señal': el cable está en el puerto equivocado." },

    { id: "monitor", nombre: "Equipo G", falla: "Todo enciende pero el monitor sigue en negro",
      post: { pantalla: "negra (monitor)", beeps: "1 pitido corto (POST OK)", led: "ninguno" },
      causa: "El monitor está apagado o en una entrada (HDMI/DP) equivocada.",
      opcionesCausa: ["Monitor apagado o en la entrada equivocada", "Falta el procesador", "La RAM está incompleta", "El EPS está suelto"],
      fix: "Encender el monitor y seleccionar la entrada correcta (source: HDMI/DP).",
      opcionesFix: ["Encender el monitor y elegir la entrada correcta", "Reasentar el CPU", "Añadir más RAM", "Conectar el EPS"],
      teoria: "Un POST correcto con la torre encendida apunta al periférico: el monitor debe estar encendido y con la fuente de entrada (source) correcta seleccionada." },

    { id: "eps", nombre: "Equipo H", falla: "Enciende, LED de placa fijo, sin POST",
      post: { pantalla: "negra", beeps: "ninguno", led: "CPU (rojo) fijo" },
      causa: "Cable EPS del CPU parcialmente conectado (solo 4 de 8 pines).",
      opcionesCausa: ["El EPS del CPU está a medias (4/8 pines)", "El monitor está en negro", "Falta el disco duro", "El USB frontal está suelto"],
      fix: "Insertar por completo el conector EPS de 8 pines hasta el clic.",
      opcionesFix: ["Insertar completo el EPS de 8 pines", "Cambiar el HDMI", "Formatear el SSD", "Reinstalar el mouse"],
      teoria: "Un EPS a medias entrega energía insuficiente al VRM del CPU: la placa enciende pero no completa el POST y deja el LED de CPU fijo." },

    { id: "ok", nombre: "Equipo I", falla: "Un pitido corto y llega al sistema operativo",
      post: { pantalla: "logo y arranque del SO", beeps: "1 pitido corto", led: "ninguno" },
      causa: "No hay falla: el POST fue exitoso y el equipo arranca correctamente.",
      opcionesCausa: ["No hay falla: arranque correcto", "La RAM está mal", "Falta el video", "La fuente es insuficiente"],
      fix: "Ninguna acción: el sistema está sano y operativo.",
      opcionesFix: ["No hacer nada: el equipo está sano", "Reasentar la RAM", "Conectar el EPS", "Cambiar la fuente"],
      teoria: "Un único pitido corto es la señal de POST correcto en la mayoría de placas: todo el hardware esencial respondió y se procede a cargar el sistema operativo." }
  ];

  const N_CASOS = 6;
  let lote = [], idx = 0, aciertos = 0;
  let casoCausaOk = false;   // ¿acertó la causa del caso actual?

  function startLab() {
    lote = CASES.slice();
    for (let i = lote.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [lote[i], lote[j]] = [lote[j], lote[i]]; }
    lote = lote.slice(0, N_CASOS);
    idx = 0; aciertos = 0;
    renderCase();
  }

  function renderCase() {
    if (idx >= lote.length) return renderReport();
    casoCausaOk = false;
    const c = lote[idx];
    host.innerHTML =
      `<h2 class="mod-head">3 · Diagnóstico de errores</h2>
       <p class="mod-sub">Enciende un equipo con una posible falla, observa los síntomas del POST, deduce la <strong>causa</strong> y aplica el <strong>arreglo</strong>. Caso ${idx + 1} de ${lote.length} · Aciertos: ${aciertos}</p>
       <div class="diag-lab">
         <div class="panel post-screen" id="postScreen">
           <div class="post-top"><span class="post-name">${c.nombre}</span><button class="primary-btn" id="postBtn" style="width:auto">⏻ Encender</button></div>
           <div class="post-body" id="postBody"><p class="small-text">Pulsa “Encender” para ejecutar el POST y observar los síntomas.</p></div>
         </div>
         <div class="panel" id="diagQ"><p class="small-text">Primero enciende el equipo y observa qué ocurre.</p></div>
       </div>`;
    host.querySelector("#postBtn").addEventListener("click", () => runPost(c));
  }

  function runPost(c) {
    const body = host.querySelector("#postBody");
    const btn = host.querySelector("#postBtn");
    btn.disabled = true; btn.textContent = "Ejecutando…";
    body.innerHTML = `<div class="post-line">Iniciando POST…</div>`;
    if (typeof sfxPower === "function") try { sfxPower(); } catch (e) {}

    const lines = [
      "Comprobando fuente de poder…",
      "Detectando CPU…",
      "Contando memoria RAM…",
      "Inicializando video…",
      "Buscando dispositivo de arranque…"
    ];
    let i = 0;
    const t = setInterval(() => {
      body.insertAdjacentHTML("beforeend", `<div class="post-line">${lines[i]}</div>`);
      i++;
      if (i >= lines.length) {
        clearInterval(t);
        setTimeout(() => {
          const ok = c.id === "ok";
          if (!ok && typeof sfxError === "function") try { sfxError(); } catch (e) {}
          body.insertAdjacentHTML("beforeend",
            `<div class="post-result ${ok ? "ok" : "bad"}">
               <div class="post-blink ${ok ? "" : "red"}"></div>
               <div>
                 <strong>${c.falla}</strong>
                 <ul class="post-signals">
                   <li>🖥️ Pantalla: ${c.post.pantalla}</li>
                   <li>🔊 Pitidos: ${c.post.beeps}</li>
                   <li>💡 LED de la placa: ${c.post.led}</li>
                 </ul>
               </div>
             </div>`);
          btn.textContent = "POST ejecutado"; 
          askCause(c);
        }, 380);
      }
    }, 430);
  }

  function block(titulo, ayuda, opciones, onPick) {
    const q = host.querySelector("#diagQ");
    q.innerHTML = `<h2>${titulo}</h2><p class="small-text">${ayuda}</p><div class="diag-opts"></div><div id="diagFb"></div>`;
    const wrap = q.querySelector(".diag-opts");
    const orden = opciones.map((o, i) => ({ o, i }));
    for (let i = orden.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [orden[i], orden[j]] = [orden[j], orden[i]]; }
    orden.forEach(({ o, i }) => {
      const b = document.createElement("button");
      b.className = "diag-opt"; b.textContent = o;
      b.addEventListener("click", () => { if (!b.disabled) onPick(i, wrap, b); });
      wrap.appendChild(b);
    });
  }

  function askCause(c) {
    block("Paso 1 · ¿Cuál es la causa?",
      "Con base en los síntomas del POST, elige la explicación más probable.",
      c.opcionesCausa, (elegido, wrap, btn) =>
        wireOptions(wrap, btn, elegido, c.opcionesCausa[0], "causa", c.causa, () => askFix(c)));
  }

  function askFix(c) {
    block("Paso 2 · ¿Cómo se arregla?",
      "Ya identificaste la causa. Ahora elige la acción correcta para solucionarla.",
      c.opcionesFix, (elegido, wrap, btn) =>
        wireOptions(wrap, btn, elegido, c.opcionesFix[0], "fix", c.fix, () => closeCase(c)));
  }

  /* La opción correcta siempre es la de índice 0 del arreglo original.
     'elegido' es ese índice original del botón pulsado. */
  function wireOptions(wrap, btn, elegido, textoCorrecto, paso, explicacion, next) {
    const fb = host.querySelector("#diagFb");
    const btns = [...wrap.querySelectorAll(".diag-opt")];
    btns.forEach(b => b.disabled = true);

    const bien = (elegido === 0);
    btns.forEach(b => { if (b.textContent === textoCorrecto) b.classList.add("correct"); });
    if (!bien) btn.classList.add("wrong");

    if (paso === "causa") casoCausaOk = bien;
    else if (bien && casoCausaOk) aciertos++;   // el caso cuenta si acertó causa Y arreglo

    fb.className = "q-feedback " + (bien ? "ok" : "bad");
    fb.innerHTML = (bien ? "✅ Correcto. " : "❌ No es lo más probable. ") + explicacion;

    const cont = document.createElement("button");
    cont.className = "view-btn"; cont.style.marginTop = "12px"; cont.textContent = "Continuar ▸";
    cont.addEventListener("click", next);
    fb.appendChild(cont);
  }

  function closeCase(c) {
    // Mostrar teoría del caso antes de pasar al siguiente
    const q = host.querySelector("#diagQ");
    q.innerHTML =
      `<h2>¿Por qué ocurre?</h2>
       <div class="clave" style="--accent:#7ed7ff">${c.teoria}</div>
       <div class="q-feedback ok" style="margin-top:12px"><strong>Causa:</strong> ${c.causa}<br><strong>Solución:</strong> ${c.fix}</div>
       <button class="primary-btn" id="nextCase" style="width:auto;margin-top:14px">${idx + 1 >= lote.length ? "Ver resultados" : "Siguiente equipo ▸"}</button>`;
    q.querySelector("#nextCase").addEventListener("click", () => { idx++; renderCase(); });
  }

  function renderReport() {
    const pct = Math.round(aciertos / lote.length * 100);
    host.innerHTML =
      `<h2 class="mod-head">3 · Diagnóstico de errores</h2>
       <div class="q-card quiz-result">
         <div class="score">${aciertos} / ${lote.length}</div>
         <p style="font-size:20px;margin:6px 0 4px">${pct}% de diagnósticos correctos</p>
         <p class="small-text" style="margin-bottom:16px">${pct >= 80 ? "¡Gran técnico! Identificas fallas de POST con soltura." : pct >= 50 ? "Bien. Repasa los códigos de POST (beeps y LEDs) para afinar." : "Repasa el módulo de teoría y los síntomas del POST."}</p>
         <button id="labRetry" class="primary-btn" style="width:auto">Nuevos casos</button>
       </div>`;
    host.querySelector("#labRetry").addEventListener("click", startLab);
  }

  startLab();
})();
