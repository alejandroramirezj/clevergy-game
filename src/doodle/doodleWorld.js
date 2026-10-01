// =============================================================================
// doodleWorld.js — MUNDO 2 · BOLIBIC TAG (laser tag a boli en el CINK Coworking)
// Shooter en primera persona dibujado a boli. Sobrevive a 5 oleadas de emails,
// reuniones y "¿tienes 5 minutos?" y tumba al jefe INBOX INFINITO.
// Se autogestiona: crea su propio canvas/HUD, su bucle y lo destruye todo al salir.
// =============================================================================

import * as THREE from "three";
import { createDoodleRenderer, INK, mat } from "./doodleRender.js";
import { DoodleAudio } from "./doodleAudio.js";
import { GEO } from "./doodleLevel.js";
import { buildLevel, ARENA, SPAWNS, START, PLAYER_SPAWNS, BOSS_AREA, COFFEE_SPOTS, floorOf, F1 as F1_Y } from "./cinkLevel.js";
import { makeEmail, makeMeeting, makeClock, makeBoss, makeGun, makeCoffee } from "./doodleActors.js";
import { createSticker } from "./doodleSticker.js";
import { createTouchPad, ICON } from "./touchPad.js";
import { touch as mando } from "../engine/input.js";
import { createNet, randomCode, cleanCode, MAX_PLAYERS } from "./doodleNet.js";
import { buzz } from "./haptics.js";
import "./doodle.css";

// ── constantes de juego ──
const STEP = 1 / 60;
const GRAVITY = 24;
const EYE = 1.6;
const P_RADIUS = 0.4;
const P_HEIGHT = 1.8;
const STEP_UP = 0.4;
const MAG = 30;
const FIRE_RATE = 9;
const DMG = 14;

const WAVES = [
  { title: "OLEADA 1", sub: "Bandeja de entrada: 6 no leídos", list: { email: 6 } },
  { title: "OLEADA 2", sub: "Llegan las invitaciones de calendario", list: { email: 8, meeting: 2 } },
  { title: "OLEADA 3", sub: "«¿Tienes 5 minutos?»", list: { email: 8, meeting: 3, clock: 2 } },
  { title: "OLEADA 4", sub: "Semana de planning", list: { email: 10, meeting: 4, clock: 4 } },
  { title: "OLEADA 5", sub: "Cierre de trimestre", list: { email: 12, meeting: 5, clock: 6 } },
  { title: "JEFE FINAL", sub: "INBOX INFINITO ha aterrizado en la terraza", list: { boss: 1, email: 4 } }
];

const ENEMY_DEF = {
  email: { hp: 30, r: 0.55, cy: 0, score: 100, ink: INK.RED },
  meeting: { hp: 70, r: 0.75, cy: 1.15, score: 250, ink: INK.PURPLE },
  clock: { hp: 55, r: 0.7, cy: 1.05, score: 200, ink: INK.ORANGE },
  boss: { hp: 1800, r: 2.3, cy: 3.2, score: 5000, ink: INK.RED }
};

const TYPES = ["email", "meeting", "clock", "boss"];
// puntos de salida de jugadores repartidos por toda la planta (en sala nadie empieza junto a otro)
const PVP_GOAL = 10; // bajas para ganar en "todos contra todos"

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);

const TEMPLATE = `
<canvas class="dd-canvas"></canvas>
<div class="dd-hud hidden">
  <div class="dd-labels"></div>
  <div class="dd-tl"><span class="dd-char"></span><span class="dd-wave"></span></div>
  <div class="dd-team"></div>
  <div class="dd-feed"></div>
  <div class="dd-score">0</div>
  <div class="dd-boss hidden"><div class="dd-boss-name">📨 INBOX INFINITO</div><div class="dd-boss-bar"><i></i></div></div>
  <div class="dd-cross"><i></i><i></i><i></i><i></i></div>
  <div class="dd-hitmark">✕</div>
  <div class="dd-msg"></div>
  <div class="dd-sub"></div>
  <div class="dd-hp"><div class="dd-hp-label">❤ <b>100</b></div><div class="dd-hp-bar"><i></i></div></div>
  <div class="dd-ammo"><b>30</b><span>/${MAG}</span><small>BOLI BIC</small></div>
  <div class="dd-dash"><i></i><small>DASH</small></div>
  <div class="dd-hudbtns">
    <button class="dd-hb dd-cambtn" aria-label="Cambiar cámara">👁<small>3ª</small></button>
    <button class="dd-hb dd-dashbtn" aria-label="Dash">»<small>DASH</small></button>
    <button class="dd-hb dd-pausebtn" aria-label="Pausa">❚❚</button>
  </div>
</div>
<div class="dd-ov dd-start">
  <div class="dd-card dd-startcard">
    <div class="ds-col ds-info">
      <div class="dd-kicker">MUNDO 2 · LASER TAG</div>
      <h1>BoliBic Tag</h1>
      <p class="dd-lead">El CINK de Infanta Mercedes se ha llenado de emails, reuniones y «¿tienes 5 minutos?». Limpia las tres plantas hasta la oficina de Clevergy con tu boli Bic.</p>
      <details class="ds-help">
        <summary>🕹️ Controles</summary>
        <div class="dd-controls dd-desktop-only">
          <span><b>WASD</b> moverse</span><span><b>Ratón</b> apuntar · <b>Clic</b> disparar</span>
          <span><b>Espacio</b> saltar</span><span><b>Shift</b> dash</span><span><b>R</b> recargar</span>
          <span><b>V</b> cámara 1ª/3ª</span><span><b>Tab</b> compañero</span><span><b>M</b> música · <b>Esc</b> pausa</span>
          <span>🎮 sticks, RT dispara, A salta, B dash, Y cámara</span>
        </div>
        <div class="dd-controls dd-touch-only">
          <span><b>Joystick</b> moverse</span><span><b>Arrastra a la derecha</b> para apuntar</span>
          <span><b>✎</b> disparar</span><span><b>Salta · Dash · Recarga</b></span><span><b>👁</b> 1ª/3ª persona</span>
          <span>En vertical: cruceta andar/girar, <b>B</b> dispara, <b>A</b> salta</span>
        </div>
      </details>
      <button class="dd-btn dd-ghost dd-mini dd-exit ds-back">↩ Volver al mapa</button>
    </div>
    <div class="ds-col ds-play">
      <div class="ds-tabs" role="tablist">
        <button class="ds-tab on" data-tab="solo" role="tab">🎯 Solo</button>
        <button class="ds-tab" data-tab="mp" role="tab">👥 Con compañeros</button>
      </div>
      <div class="ds-panel ds-solo">
        <div class="ds-solo-info"><b>6 oleadas</b> y el jefe <b>INBOX INFINITO</b>. Tu compañero aporta su velocidad y su salto.</div>
      </div>
      <div class="ds-panel ds-mpanel hidden">
        <div class="dd-mp">
          <div class="dd-mp-row dd-mp-lobby">
            <button class="dd-btn dd-mini dd-mp-create">Crear sala</button>
            <span class="ds-or">o</span>
            <input class="dd-mp-code" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" spellcheck="false" />
            <button class="dd-btn dd-mini dd-ghost dd-mp-join">Unirse</button>
          </div>
          <div class="dd-mp-room hidden">
            <div class="dd-mp-coderow">Sala <b class="dd-mp-codebig"></b> <button class="dd-btn dd-mini dd-ghost dd-mp-copy">Copiar</button> <button class="dd-btn dd-mini dd-ghost dd-mp-leave">Salir</button></div>
            <div class="dd-mp-modes">
              <button class="dd-mp-mode" data-mode="pvp">⚔️ Todos contra todos</button>
              <button class="dd-mp-mode" data-mode="coop">🤝 Cooperativo</button>
            </div>
            <div class="dd-mp-list"></div>
          </div>
          <div class="dd-mp-status">Hasta ${MAX_PLAYERS} jugadores: crea una sala y pasa el código.</div>
        </div>
      </div>
      <button class="dd-btn dd-go">¡A dibujar!</button>
    </div>
  </div>
</div>
<div class="dd-ov dd-pause hidden">
  <div class="dd-card dd-small">
    <h2>Pausa</h2>
    <p class="dd-pause-hint">Haz clic en «Seguir» para volver a capturar el ratón.</p>
    <p class="dd-pause-room"></p>
    <div class="dd-btns">
      <button class="dd-btn dd-resume">Seguir</button>
      <button class="dd-btn dd-ghost dd-exit">Salir al mapa</button>
    </div>
  </div>
</div>
<div class="dd-ov dd-end hidden">
  <div class="dd-card dd-small">
    <div class="dd-kicker dd-end-kicker"></div>
    <h2 class="dd-end-title"></h2>
    <div class="dd-end-stats"></div>
    <div class="dd-btns">
      <button class="dd-btn dd-retry">Otra vez</button>
      <button class="dd-btn dd-ghost dd-exit">Volver al mapa</button>
    </div>
  </div>
</div>`;

/**
 * Arranca el mundo 7.
 * @param {{char?: {id:string, name:string, emoji:string, spd:number, jump:number}, getChar?: () => object, onExit?: Function, onVictory?: (score:number, rank:string)=>void}} opts
 */
export function startDoodleWorld({ char, getChar, onSwitchChar, onExit, onVictory, onScore } = {}) {
  const root = document.createElement("div");
  root.id = "doodleRoot";
  root.innerHTML = TEMPLATE;
  (document.getElementById("wrap") || document.body).appendChild(root);
  document.body.classList.add("doodle-mode");
  const $ = (sel) => root.querySelector(sel);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  root.classList.toggle("dd-is-touch", isTouch);

  const canvas = $(".dd-canvas");
  const R = createDoodleRenderer(canvas);
  const audio = new DoodleAudio();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.05, 220);
  camera.rotation.order = "YXZ";
  scene.add(camera);

  const { colliders, updateDoors, victoria, mariaEugenia, clevergyPhoto, senor, tendedora, vendingPacks } = buildLevel(scene);
  let lastSenor = -99;

  const gun = makeGun();
  camera.add(gun.group);
  gun.group.scale.setScalar(0.75);
  const GUN_REST = new THREE.Vector3(0.3, -0.3, -0.62);
  gun.group.position.copy(GUN_REST);

  // personaje en tercera persona (pegatina) + sombra de tinta en el suelo
  const overlay = new THREE.Scene(); // pegatinas (tú y tus compañeros), pintadas encima del dibujo
  const sticker = createSticker(overlay);

  // la foto de la pared de la pizarra de Clevergy: una polaroid con sus colores reales
  // (el render de boli no pinta texturas, así que va en la capa de encima y se oculta si una pared la tapa)
  const photo = (() => {
    const cv = document.createElement("canvas");
    cv.width = 440; cv.height = 512;
    const ctx = cv.getContext("2d");
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
      const pw = 400, ph = Math.round(pw * img.height / img.width), iy = 20;
      ctx.drawImage(img, 20, iy, pw, Math.min(ph, 420));
      ctx.strokeStyle = "#272a36"; ctx.lineWidth = 6; ctx.strokeRect(3, 3, cv.width - 6, cv.height - 6);
      ctx.fillStyle = "rgba(255, 226, 150, 0.85)"; ctx.save(); ctx.translate(cv.width / 2, 12); ctx.rotate(-0.05); ctx.fillRect(-70, -14, 140, 30); ctx.restore(); // cinta
      ctx.fillStyle = "#1f38b8"; ctx.font = "34px Caveat, cursive"; ctx.textAlign = "center"; ctx.fillText("Álvaro, el jefe", cv.width / 2, cv.height - 24);
      tex.needsUpdate = true;
    };
    img.src = "/ui/clevergy-pizarra.webp";
    const m = new THREE.Mesh(new THREE.PlaneGeometry(clevergyPhoto.w, clevergyPhoto.w * cv.height / cv.width),
      new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true }));
    m.position.set(clevergyPhoto.x, clevergyPhoto.y, clevergyPhoto.z);
    m.rotation.set(0, clevergyPhoto.ry || 0, 0.04);
    overlay.add(m);
    return m;
  })();
  // las bolsas de ChocoBom de la máquina de vending (foto real; mismo truco que la foto de Álvaro)
  const packs = (() => {
    const g = new THREE.Group();
    const tex = new THREE.TextureLoader().load("/ui/chocobom.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    const mt = new THREE.MeshBasicMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true });
    const geo = new THREE.PlaneGeometry(1, 1);
    for (const q of vendingPacks) { const m = new THREE.Mesh(geo, mt); m.scale.set(q.w, q.h, 1); m.position.set(q.x, q.y, q.z); g.add(m); }
    overlay.add(g);
    return g;
  })();
  const _packP = new THREE.Vector3(vendingPacks[0].x + 0.5, vendingPacks[0].y + 0.5, vendingPacks[0].z + 0.15);
  const _photoP = new THREE.Vector3(clevergyPhoto.x + Math.sin(clevergyPhoto.ry || 0) * 0.15, clevergyPhoto.y, clevergyPhoto.z + Math.cos(clevergyPhoto.ry || 0) * 0.15);
  let lastMaria = -99;
  const shadow = new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(0.9, 0.55, 1);
  scene.add(shadow);

  // stats del personaje elegido: velocidad y salto del plataformas → FPS
  let heroSpeed = 7, heroJump = 8;
  function setChar(c) {
    char = c || char;
    heroSpeed = 6.2 + clamp(((char && char.spd) || 3.5) - 2.6, 0, 2) * 0.9;
    heroJump = 7.6 + clamp(((char && char.jump) || 9.5) - 9, 0, 1.5) * 0.9;
    $(".dd-char").textContent = `${(char && char.emoji) || "✏️"} ${(char && char.name) || "EQUIPO"}`;
    if (char && char.id) sticker.setChar(char.id);
  }
  setChar(char);

  // cámara: 1ª persona (boli en mano) o 3ª persona (ves a tu personaje)
  let camMode = "third";
  try { camMode = localStorage.getItem("clevergy_doodle_cam") || "third"; } catch (e) {}
  function toggleCam() {
    camMode = camMode === "third" ? "first" : "third";
    try { localStorage.setItem("clevergy_doodle_cam", camMode); } catch (e) {}
    audio.pickup();
    syncCamUi();
  }
  function syncCamUi() {
    gun.group.visible = camMode === "first";
    sticker.setVisible(camMode === "third");
    shadow.visible = camMode === "third";
    $(".dd-cambtn small").textContent = camMode === "third" ? "3ª" : "1ª";
  }

  // ── estado ──
  let state = "start"; // start | play | pause | over | win
  const P = {
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    yaw: 0, pitch: 0,
    onGround: true, coyote: 0,
    hp: 100, mag: MAG, reload: 0, fireCd: 0,
    dashCd: 0, dashT: 0, dashDir: new THREE.Vector3(),
    bob: 0, shake: 0, kick: 0, iframes: 0,
    down: false, lastHurt: 0, turnV: 0, aPrev: false, upPrev: false, upTapT: -1, moveX: 0, fireT: 0
  };
  const G = {
    winT: 0, wave: -1, queue: [], spawnT: 0, interT: 0, time: 0, score: 0, kills: 0,
    shots: 0, hits: 0, hurt: 0, flash: 0, boss: null
  };
  const net = createNet();
  // multijugador: el anfitrión simula enemigos/oleadas; los invitados ven "marionetas" de los enemigos
  const mp = {
    on: false, isHost: false, started: false, netT: 0, remotes: new Map(), eid: 0, cid: 0,
    mode: "pvp", spawnIdx: -1, frags: {}, lastAttacker: null, respawnT: 0, cofT: 6
  };
  const isGuest = () => mp.on && !mp.isHost;
  const pvp = () => mp.on && mp.mode === "pvp";
  let enemies = [];
  let shots = []; // proyectiles enemigos
  let pickups = [];
  const particles = [];
  const decals = [];
  const tracers = [];

  // ── input ──
  const keys = {};
  const input = { mx: 0, my: 0, fire: false, jump: false, dash: false };
  let lookX = 0, lookY = 0;

  function onKeyDown(e) {
    if (e.code === "Space" || e.code.startsWith("Arrow") || e.code === "Tab") e.preventDefault();
    if (keys[e.code]) return;
    keys[e.code] = true;
    if (state !== "play") return;
    if (e.code === "Space") input.jump = true;
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") input.dash = true;
    if (e.code === "KeyR") startReload();
    if (e.code === "KeyV") toggleCam();
    if (e.code === "KeyM") audio.toggleMusic();
    if (e.code === "KeyP" || (noLock && e.code === "Escape")) pause();
  }
  function onKeyUp(e) { keys[e.code] = false; }
  let noLock = false; // si el navegador no deja capturar el ratón: apuntar arrastrando
  function onMouseMove(e) {
    if (state !== "play") return;
    if (document.pointerLockElement !== canvas && !(noLock && e.buttons)) return;
    lookX += e.movementX || 0;
    lookY += e.movementY || 0;
  }
  function onMouseDown(e) {
    if (state !== "play") return;
    if (!isTouch && document.pointerLockElement !== canvas) {
      lockPointer();
      if (!noLock) return;
    }
    if (e.button === 0) input.fire = true;
    if (e.button === 2) input.dash = true;
  }
  function onMouseUp(e) { if (e.button === 0) input.fire = false; }
  function onContext(e) { e.preventDefault(); }
  function onLockError() { noLock = true; }
  function onLockChange() {
    if (isTouch) return;
    if (document.pointerLockElement === canvas) { noLock = false; return; }
    if (!noLock && state === "play") pause();
  }
  function lockPointer() {
    try {
      const p = canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => { noLock = true; });
    } catch (e) { noLock = true; }
    // algunos navegadores/iframes ni conceden ni fallan: pasamos a apuntar arrastrando
    setTimeout(() => { if (document.pointerLockElement !== canvas) noLock = true; }, 600);
  }
  function onBlur() { if (state === "play") pause(); }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  document.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
  root.addEventListener("contextmenu", onContext);
  document.addEventListener("pointerlockchange", onLockChange);
  document.addEventListener("pointerlockerror", onLockError);
  window.addEventListener("blur", onBlur);

  // ── mando en pantalla ──
  // Vertical: la cruceta y los botones A/B del deck Game Boy (objeto `touch` compartido).
  // Horizontal: el mando táctil común (joystick flotante + botones de cuaderno), ver touchPad.js.
  const touchFire = { on: false };
  const touchPad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "fire", label: "DISPARA", icon: ICON.fire, accent: "red", drag: true },
      { id: "jump", label: "SALTA", icon: ICON.jump },
      { id: "dash", label: "DASH", icon: ICON.dash },
      { id: "reload", icon: ICON.reload }
    ],
    isActive: () => state === "play",
    onLook: (dx, dy) => { lookX += dx * 2.2; lookY += dy * 2.2; },
    onAction: (id, down) => {
      if (id === "fire") touchFire.on = down;
      if (!down) return;
      if (id === "jump") input.jump = true;
      if (id === "dash") input.dash = true;
      if (id === "reload") startReload();
    }
  }) : null;
  const joy = touchPad ? touchPad.joy : { x: 0, y: 0 };

  const tapBtn = (sel, fn) => {
    const el = $(sel);
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
    el.addEventListener("click", (e) => e.preventDefault());
  };
  tapBtn(".dd-cambtn", () => toggleCam());
  tapBtn(".dd-dashbtn", () => { input.dash = true; });
  tapBtn(".dd-pausebtn", () => pause());

  // etiquetas del mando mientras estás en este mundo (se restauran al salir)
  const relabels = [];
  function relabel(sel, text) {
    const el = document.querySelector(sel);
    if (!el) return;
    relabels.push([el, el.textContent]);
    el.textContent = text;
  }
  relabel("#gbLabelB", "DISPARAR");
  relabel("#gbLabelA", "SALTAR");

  // ── mando físico (Gamepad API, mapeo estándar) ──
  const gp = { active: false, prev: [], mx: 0, my: 0, lx: 0, ly: 0, fire: false };
  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let g = null;
    for (const p of pads) if (p && p.connected) { g = p; break; }
    if (!g) { gp.active = false; gp.fire = false; return; }
    const dz = (v) => (Math.abs(v) < 0.18 ? 0 : (v - Math.sign(v) * 0.18) / 0.82);
    const b = (i) => !!(g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.4));
    const pressed = (i) => b(i) && !gp.prev[i];
    gp.mx = dz(g.axes[0] || 0);
    gp.my = -dz(g.axes[1] || 0);
    gp.lx = dz(g.axes[2] || 0);
    gp.ly = dz(g.axes[3] || 0);
    gp.fire = b(7) || b(5);
    const any = gp.mx || gp.my || gp.lx || gp.ly || g.buttons.some((x) => x && x.pressed);
    if (any) gp.active = true;
    if (state === "play") {
      if (pressed(0)) input.jump = true;
      if (pressed(1) || pressed(4) || pressed(6)) input.dash = true;
      if (pressed(2)) startReload();
      if (pressed(3)) toggleCam();
      if (pressed(9)) pause();
    } else if (state === "pause" && pressed(9)) play();
    else if (state === "start" && (pressed(0) || pressed(9))) $(".dd-go").click();
    else if ((state === "over" || state === "win") && pressed(9)) $(".dd-retry").click();
    for (let i = 0; i < g.buttons.length; i++) gp.prev[i] = b(i);
  }

  // ── botones de overlays ──
  root.querySelectorAll(".dd-exit").forEach((b) => b.addEventListener("click", exit));
  function startMatch() {
    audio.init();
    audio.startMusic();
    resetGame();
    play();
  }
  // en sala sólo el anfitrión arranca la partida (para todos a la vez)
  function hostStart() {
    if (isGuest()) return;
    if (mp.on) {
      mp.started = true;
      mp.frags = {};
      // cada jugador sale de un punto distinto, al azar
      const idx = PLAYER_SPAWNS.map((_, i) => i).sort(() => Math.random() - 0.5);
      const sp = {};
      [net.myId, ...mp.remotes.keys()].forEach((id, i) => (sp[id] = idx[i % idx.length]));
      mp.spawnIdx = sp[net.myId];
      net.broadcast({ t: "start", mode: mp.mode, sp });
    }
    startMatch();
  }
  // posiciona al jugador en un punto de salida mirando hacia el centro
  function spawnAt(i) {
    const [x, z, y = 0] = PLAYER_SPAWNS[i % PLAYER_SPAWNS.length];
    P.pos.set(x + rnd(-0.5, 0.5), y, z + rnd(-0.5, 0.5));
    pushOut(P.pos, P_RADIUS, y + 0.4, y + P_HEIGHT);
    P.yaw = Math.atan2(P.pos.x, P.pos.z);
    P.pitch = 0;
  }
  // el punto de salida más alejado de los demás jugadores (para reaparecer)
  function farthestSpawn() {
    let best = 0, bestD = -1;
    PLAYER_SPAWNS.forEach(([x, z], i) => {
      let d = Infinity;
      mp.remotes.forEach((r) => { if (!r.d) d = Math.min(d, Math.hypot(r.pos.x - x, r.pos.z - z)); });
      d += Math.random() * 3;
      if (d > bestD) { bestD = d; best = i; }
    });
    return best;
  }
  const nameOf = (id) => {
    if (!id) return "la oficina";
    if (id === net.myId) return `${myInfo().e} ${myInfo().n}`;
    const r = mp.remotes.get(id);
    if (r) return `${r.emoji} ${r.name}`;
    const p = roster.find((q) => q.id === id);
    return p ? `${p.e} ${p.n}` : "alguien";
  };
  $(".dd-go").addEventListener("click", hostStart);
  // pestañas Solo / Con compañeros de la pantalla de inicio
  function startTab(tab) {
    root.querySelectorAll(".ds-tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    $(".ds-solo").classList.toggle("hidden", tab !== "solo");
    $(".ds-mpanel").classList.toggle("hidden", tab !== "mp");
  }
  root.querySelectorAll(".ds-tab").forEach((b) => b.addEventListener("click", () => startTab(b.dataset.tab)));
  $(".dd-resume").addEventListener("click", play);
  $(".dd-retry").addEventListener("click", hostStart);

  // ── sala multijugador ──
  const lobby = {
    status: $(".dd-mp-status"), room: $(".dd-mp-room"), row: $(".dd-mp-lobby"),
    code: $(".dd-mp-code"), codeBig: $(".dd-mp-codebig"), list: $(".dd-mp-list"), go: $(".dd-go")
  };
  const myInfo = () => ({ n: (char && char.name) || "JUGADOR", e: (char && char.emoji) || "✏️", c: char && char.id });
  let roster = []; // [{id, n, e}] tal y como lo reparte el anfitrión
  function renderLobby() {
    lobby.room.classList.toggle("hidden", !mp.on);
    lobby.row.classList.toggle("hidden", mp.on);
    lobby.codeBig.textContent = net.code || "";
    lobby.list.innerHTML = roster.map((p) => `<span class="dd-mp-chip${p.id === net.myId ? " me" : ""}">${p.e} ${p.n}${p.id === net.hostId ? " ⭐" : ""}</span>`).join("");
    root.querySelectorAll(".dd-mp-mode").forEach((b) => {
      b.classList.toggle("on", b.dataset.mode === mp.mode);
      b.disabled = isGuest();
    });
    const modeName = mp.mode === "pvp" ? "todos contra todos" : "cooperativo";
    if (!mp.on) lobby.go.textContent = "¡A dibujar!";
    else if (mp.isHost) lobby.go.textContent = `Empezar · ${modeName} (${roster.length})`;
    else lobby.go.textContent = "Esperando al anfitrión…";
    lobby.go.disabled = isGuest();
    $(".dd-retry").disabled = isGuest();
    $(".dd-retry").textContent = isGuest() ? "Esperando al anfitrión…" : "Otra vez";
    $(".dd-pause-room").textContent = mp.on ? `Sala ${net.code} · ${roster.length} jugador${roster.length === 1 ? "" : "es"} · la partida sigue mientras estás en pausa` : "";
  }
  const setStatus = (t, err) => { lobby.status.textContent = t; lobby.status.classList.toggle("err", !!err); };
  function hostRoster() {
    roster = [{ id: net.myId, ...myInfo() }];
    mp.remotes.forEach((r) => roster.push({ id: r.id, n: r.name, e: r.emoji }));
    net.broadcast({ t: "roster", list: roster, mode: mp.mode });
    renderLobby();
  }
  $(".dd-mp-create").addEventListener("click", async () => {
    setStatus("Creando sala…");
    try {
      await net.host(randomCode());
      mp.on = true; mp.isHost = true; mp.started = false;
      hostRoster();
      setStatus("Comparte el código: tus compañeros pulsan «Unirse» y lo escriben.");
    } catch (err) {
      setStatus(err.message, true);
    }
  });
  async function joinRoom() {
    const code = cleanCode(lobby.code.value);
    if (code.length !== 5) return setStatus("El código tiene 5 letras.", true);
    setStatus(`Buscando la sala ${code}…`);
    try {
      await net.join(code);
      mp.on = true; mp.isHost = false; mp.started = false;
      net.send({ t: "hello", ...myInfo() });
      roster = [{ id: net.myId, ...myInfo() }];
      renderLobby();
      setStatus("¡Dentro! La partida empieza cuando el anfitrión pulse «Empezar».");
    } catch (err) {
      setStatus(err.message, true);
    }
  }
  $(".dd-mp-join").addEventListener("click", joinRoom);
  lobby.code.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") joinRoom(); });
  lobby.code.addEventListener("input", () => { lobby.code.value = cleanCode(lobby.code.value); });
  $(".dd-mp-copy").addEventListener("click", () => {
    try { navigator.clipboard.writeText(net.code); setStatus("Código copiado ✔"); } catch (e) {}
  });
  function leaveRoom(reason) {
    net.destroy();
    [...mp.remotes.keys()].forEach(removeRemote);
    mp.on = false; mp.isHost = false; mp.started = false;
    roster = [];
    renderLobby();
    if (reason) setStatus(reason, true);
  }
  $(".dd-mp-leave").addEventListener("click", () => { leaveRoom(); setStatus(""); });
  root.querySelectorAll(".dd-mp-mode").forEach((b) => b.addEventListener("click", () => {
    if (!mp.isHost) return;
    mp.mode = b.dataset.mode;
    hostRoster();
  }));

  // ── compañeros: pegatina + sombra + etiqueta con nombre ──
  function ensureRemote(id, st) {
    let r = mp.remotes.get(id);
    if (!r) {
      r = {
        id, name: st.n || "?", emoji: st.e || "", charId: null,
        pos: new THREE.Vector3(st.x || 0, st.y || 0, st.z || 0), tgt: new THREE.Vector3(st.x || 0, st.y || 0, st.z || 0),
        vx: 0, vz: 0, g: true, f: false, hp: 100, d: false, mx: 0, seen: performance.now(), raw: null,
        sticker: createSticker(overlay), shadow: new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true })), label: document.createElement("div")
      };
      r.shadow.rotation.x = -Math.PI / 2;
      r.shadow.scale.set(0.9, 0.55, 1);
      scene.add(r.shadow);
      r.label.className = "dd-tag";
      $(".dd-labels").appendChild(r.label);
      mp.remotes.set(id, r);
    }
    return r;
  }
  function applyRemote(id, st) {
    const r = ensureRemote(id, st);
    if (st.x !== undefined) r.tgt.set(st.x, st.y, st.z);
    r.vx = st.vx || 0; r.vz = st.vz || 0; r.g = !!st.g; r.f = !!st.f; r.d = !!st.d; r.mx = st.mx || 0;
    if (st.hp !== undefined) r.hp = st.hp;
    if (st.n) r.name = st.n;
    if (st.e) r.emoji = st.e;
    if (st.c && st.c !== r.charId) { r.charId = st.c; r.sticker.setChar(st.c); }
    r.seen = performance.now();
    r.raw = st;
    return r;
  }
  function removeRemote(id) {
    const r = mp.remotes.get(id);
    if (!r) return;
    r.sticker.dispose();
    scene.remove(r.shadow);
    r.label.remove();
    mp.remotes.delete(id);
  }
  const myState = () => ({
    t: "p", id: net.myId, ...myInfo(),
    x: +P.pos.x.toFixed(2), y: +P.pos.y.toFixed(2), z: +P.pos.z.toFixed(2),
    vx: +P.vel.x.toFixed(1), vz: +P.vel.z.toFixed(1), g: P.onGround ? 1 : 0, f: P.fireT > 0 ? 1 : 0,
    hp: Math.ceil(P.hp), d: P.down ? 1 : 0, mx: Math.sign(P.moveX)
  });

  // ── mensajes de red ──
  const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  net.on("full", () => leaveRoom("La sala está llena."));
  // anfitrión
  net.on("hello", (m, from) => {
    const r = applyRemote(from, m);
    hostRoster();
    net.sendTo(from, { t: "welcome", started: mp.started && (state === "play" || state === "pause"), mode: mp.mode, f: mp.frags });
    if (mp.started) announce("", `${r.emoji} ${r.name} se une a la partida`, 2);
  });
  net.on("p", (m, from) => { if (mp.isHost) applyRemote(from, m); });
  net.on("hit", (m) => {
    if (!mp.isHost) return;
    const e = enemies.find((q) => q.id === m.id && !q.dead);
    if (e) damageEnemy(e, m.d, null, null);
  });
  net.on("take", (m) => { if (mp.isHost) { removeCoffee(m.id); net.broadcast({ t: "rmcof", id: m.id }); } });
  net.on("fx", (m, from) => {
    spawnTracer(V(m.a), V(m.b));
    if (mp.isHost) net.broadcast(m, from);
  });
  net.on("_leave", (m, id) => {
    if (mp.isHost) {
      const r = mp.remotes.get(id);
      if (r) announce("", `${r.emoji} ${r.name} ha salido de la sala`, 2);
      removeRemote(id);
      hostRoster();
    } else if (id === net.hostId) {
      const inGame = state === "play" || state === "pause";
      leaveRoom("El anfitrión ha cerrado la sala.");
      if (inGame) { state = "over"; endScreen(false); $(".dd-end-title").textContent = "El anfitrión ha cerrado la sala"; }
    }
  });
  // invitados
  net.on("welcome", (m) => {
    if (m.mode) mp.mode = m.mode;
    mp.frags = m.f || {};
    renderLobby();
    if (m.started) { mp.spawnIdx = -1; startMatch(); }
  });
  net.on("roster", (m) => { roster = m.list || []; if (m.mode) mp.mode = m.mode; renderLobby(); });
  net.on("start", (m) => {
    mp.started = true;
    if (m.mode) mp.mode = m.mode;
    mp.frags = {};
    mp.spawnIdx = m.sp && m.sp[net.myId] !== undefined ? m.sp[net.myId] : -1;
    startMatch();
  });
  net.on("pvp", (m) => {
    if (!mp.isHost) return;
    if (m.to === net.myId) pvpHurt(m);
    else net.sendTo(m.to, { ...m, t: "pvphit" });
  });
  net.on("pvphit", (m) => pvpHurt(m));
  net.on("frag", (m) => handleFrag(m));
  net.on("frags", (m) => { if (!mp.isHost) applyFrags(m); });
  net.on("pvpwin", (m) => pvpEnd(m.id));
  net.on("snap", (m) => {
    if (!isGuest()) return;
    const present = new Set();
    for (const st of m.pl) {
      if (st.id === net.myId) continue;
      present.add(st.id);
      applyRemote(st.id, st);
    }
    [...mp.remotes.keys()].forEach((id) => { if (!present.has(id)) removeRemote(id); });
    if (state !== "play" && state !== "pause") return;
    const seen = new Set();
    for (const [id, ti, x, y, z, hpc, wind] of m.en) {
      seen.add(id);
      let e = enemies.find((q) => q.id === id);
      if (!e) e = spawnEnemy(TYPES[ti], [x, z], { id, y, puppet: true });
      e.tgtPos.set(x, y, z);
      e.hp = hpc;
      e.maxHp = 100;
      e.wind = wind;
    }
    enemies.forEach((e) => { if (!seen.has(e.id) && !e.dead) { e.dead = true; scene.remove(e.model.group); } });
    enemies = enemies.filter((e) => !e.dead);
    G.wave = m.w;
    G.score = m.s;
  });
  net.on("kill", (m) => { const e = enemies.find((q) => q.id === m.id); if (e) killEnemy(e, null); });
  net.on("shot", (m) => addShot(V(m.p), V(m.v), m.d));
  net.on("dmg", (m) => hurtPlayer(m.d, new THREE.Vector3(m.x, 0, m.z)));
  net.on("cof", (m) => spawnCoffee(m.x, m.z, m.id, m.y || 0));
  net.on("rmcof", (m) => removeCoffee(m.id));
  net.on("msg", (m) => { showMsg(m.a, m.b, m.d); if (m.w) audio.wave(); });
  net.on("revive", () => reviveSelf());
  net.on("over", () => { if (state === "play" || state === "pause") gameOver(); });
  net.on("win", (m) => victory(m.s));

  // envío periódico (15 Hz): invitados mandan su estado; el anfitrión reparte la foto completa
  function netTick(dt) {
    if (!mp.on || !net.active) return;
    mp.netT += dt;
    if (mp.netT < 1 / 15) return;
    mp.netT = 0;
    const now = performance.now();
    if (!mp.isHost) { if (state === "play" || state === "pause") net.send(myState()); return; }
    mp.remotes.forEach((r, id) => { if (now - r.seen > 8000 && !net.conns.has(id)) removeRemote(id); });
    const inGame = state === "play" || state === "pause";
    const pl = [myState()];
    mp.remotes.forEach((r) => { if (r.raw) pl.push({ ...r.raw, id: r.id }); });
    net.broadcast({
      t: "snap", pl, w: G.wave, s: G.score,
      en: inGame ? enemies.filter((e) => !e.dead).map((e) => [e.id, TYPES.indexOf(e.type), +e.pos.x.toFixed(2), +e.pos.y.toFixed(2), +e.pos.z.toFixed(2), Math.max(0, Math.round((e.hp / e.maxHp) * 100)), e.mode === "windup" ? 1 : 0]) : []
    });
    // todos K.O. → fin de partida para la sala
    if (!pvp() && inGame && P.down && [...mp.remotes.values()].every((r) => r.d)) gameOver();
  }

  // lista de compañeros con su vida (arriba a la izquierda)
  let teamT = 0;
  function updateTeam(dt) {
    teamT -= dt;
    if (teamT > 0) return;
    teamT = 0.3;
    const el = $(".dd-team");
    if (!mp.on || !mp.remotes.size) { if (el.innerHTML) el.innerHTML = ""; return; }
    el.innerHTML = [...mp.remotes.values()].map((r) =>
      `<div class="dd-mate${r.d ? " ko" : ""}"><span>${r.emoji} ${r.name}${pvp() ? ` · ${mp.frags[r.id] || 0}☠` : ""}</span><i><b style="width:${Math.max(0, Math.min(100, r.hp))}%"></b></i></div>`).join("");
  }

  // pegatinas y etiquetas de los compañeros
  const _lp = new THREE.Vector3();
  function updateRemotes(dt) {
    const W = root.clientWidth, H = root.clientHeight;
    mp.remotes.forEach((r) => {
      r.pos.lerp(r.tgt, Math.min(1, dt * 12));
      r.hitT = Math.max(0, (r.hitT || 0) - dt);
      r.sticker.update(dt, { pos: r.pos, camera, moveX: r.mx, speed: Math.hypot(r.vx, r.vz), onGround: r.g, firing: r.f, hurt: r.d ? 0.8 : r.hitT > 0 ? 0.9 : 0 });
      // en PvP las pegatinas no se ven a través de las paredes (serían un chivato)
      let seen = true;
      if (pvp()) {
        seen = !r.d && (hasLOS(camera.position, _lp.set(r.pos.x, r.pos.y + 1.0, r.pos.z)) || hasLOS(camera.position, _lp.set(r.pos.x, r.pos.y + 1.7, r.pos.z)));
      }
      r.sticker.setVisible(seen);
      const gy = groundAt(r.pos.x, r.pos.z, P_RADIUS, r.pos.y + 0.01);
      r.shadow.position.set(r.pos.x, gy + 0.02, r.pos.z);
      _lp.set(r.pos.x, r.pos.y + 2.05, r.pos.z).project(camera);
      const vis = seen && _lp.z > -1 && _lp.z < 1 && state !== "start";
      r.label.style.display = vis ? "" : "none";
      if (vis) {
        r.label.style.transform = `translate(${((_lp.x * 0.5 + 0.5) * W).toFixed(1)}px, ${((-_lp.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%, -100%)`;
        const txt = `${r.emoji} ${r.name}${r.d ? " · K.O." : ""}`;
        if (r.label.dataset.txt !== txt || r.label.dataset.hp !== String(r.hp)) {
          r.label.dataset.txt = txt;
          r.label.dataset.hp = String(r.hp);
          r.label.innerHTML = `<span>${txt}</span><i style="width:${Math.max(0, Math.min(100, r.hp))}%"></i>`;
        }
      }
    });
  }

  function syncMandoUi() {
    const portrait = document.body.classList.contains("gameboy-mode");
    const show = isTouch && !portrait && state === "play";
    if (touchPad) touchPad.setVisible(show);
    root.classList.toggle("dd-landpad", isTouch && !portrait);
    // en horizontal el dash ya está junto al pulgar; en vertical va en la barra de arriba
    $(".dd-dashbtn").classList.toggle("hidden", !isTouch || !portrait);
    // en vertical el deck ya trae la barra de compañeros
  }
  syncCamUi();
  renderLobby();

  function showOv(name) {
    ["start", "pause", "end"].forEach((n) => $(`.dd-${n}`).classList.toggle("hidden", n !== name));
  }
  function play() {
    audio.resume();
    state = "play";
    showOv(null);
    $(".dd-hud").classList.remove("hidden");
    syncMandoUi();
    if (!isTouch) lockPointer();
  }
  function pause() {
    if (state !== "play") return;
    state = "pause";
    input.fire = false;
    showOv("pause");
    syncMandoUi();
    if (document.pointerLockElement === canvas) document.exitPointerLock();
  }

  // ── colisiones ──
  function pushOut(pos, r, yLo, yHi) {
    let hit = false;
    for (const c of colliders) {
      if (c.open || c.y1 <= yLo || c.y0 >= yHi) continue;
      const nx = clamp(pos.x, c.x0, c.x1), nz = clamp(pos.z, c.z0, c.z1);
      const dx = pos.x - nx, dz = pos.z - nz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      hit = true;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        pos.x += (dx / d) * (r - d);
        pos.z += (dz / d) * (r - d);
      } else {
        const a = pos.x - c.x0, b = c.x1 - pos.x, e = pos.z - c.z0, f = c.z1 - pos.z;
        const m = Math.min(a, b, e, f);
        if (m === a) pos.x = c.x0 - r; else if (m === b) pos.x = c.x1 + r;
        else if (m === e) pos.z = c.z0 - r; else pos.z = c.z1 + r;
      }
    }
    const lim = ARENA - r;
    pos.x = clamp(pos.x, -lim, lim);
    pos.z = clamp(pos.z, -lim, lim);
    return hit;
  }
  function ceilingAt(x, z, r, head) {
    let c0 = Infinity;
    for (const c of colliders) {
      if (c.open || c.y0 < head || c.y0 >= c0) continue;
      const nx = clamp(x, c.x0, c.x1), nz = clamp(z, c.z0, c.z1);
      if ((x - nx) ** 2 + (z - nz) ** 2 < r * r * 0.5) c0 = c.y0;
    }
    return c0;
  }
  function groundAt(x, z, r, feet) {
    let g = 0;
    for (const c of colliders) {
      if (c.y1 > feet + STEP_UP || c.y1 <= g) continue;
      const nx = clamp(x, c.x0, c.x1), nz = clamp(z, c.z0, c.z1);
      if ((x - nx) ** 2 + (z - nz) ** 2 < r * r * 0.5) g = c.y1;
    }
    return g;
  }
  // rayo contra la geometría del nivel (suelo + cajas); devuelve la distancia al impacto
  function rayWorld(o, d, maxT) {
    let best = maxT;
    if (d.y < -1e-6) { const t = -o.y / d.y; if (t > 0 && t < best) best = t; }
    for (const c of colliders) {
      if (c.open) continue;
      let t0 = 0, t1 = best;
      const lo = [c.x0, c.y0, c.z0], hi = [c.x1, c.y1, c.z1];
      const oo = [o.x, o.y, o.z], dd = [d.x, d.y, d.z];
      let ok = true;
      for (let i = 0; i < 3; i++) {
        if (Math.abs(dd[i]) < 1e-9) {
          if (oo[i] < lo[i] || oo[i] > hi[i]) { ok = false; break; }
        } else {
          let a = (lo[i] - oo[i]) / dd[i], b = (hi[i] - oo[i]) / dd[i];
          if (a > b) { const tmp = a; a = b; b = tmp; }
          if (a > t0) t0 = a;
          if (b < t1) t1 = b;
          if (t0 > t1) { ok = false; break; }
        }
      }
      if (ok && t0 < best) best = t0;
    }
    return best;
  }
  function insideSolid(p) {
    if (p.y <= 0) return true;
    for (const c of colliders) {
      if (!c.open && p.x > c.x0 && p.x < c.x1 && p.z > c.z0 && p.z < c.z1 && p.y > c.y0 && p.y < c.y1) return true;
    }
    return Math.abs(p.x) > ARENA || Math.abs(p.z) > ARENA;
  }
  const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3();
  const _los = new THREE.Vector3();
  function hasLOS(a, b) {
    _los.subVectors(b, a);
    const len = _los.length();
    _los.divideScalar(len);
    return rayWorld(a, _los, len) >= len - 0.05;
  }
  const eyePos = (out) => out.set(P.pos.x, P.pos.y + EYE, P.pos.z);
  const enemyCenter = (e, out) => out.set(e.pos.x, e.pos.y + e.def.cy, e.pos.z);

  // ── efectos: partículas de tinta, manchas y trazadoras ──
  function spawnInk(pos, dir, ink, n, speed = 6) {
    for (let i = 0; i < n; i++) {
      let p = particles.find((q) => !q.alive);
      if (!p) {
        if (particles.length > 220) break;
        p = { mesh: new THREE.Mesh(GEO.sph, mat(ink, { fill: true })), vel: new THREE.Vector3() };
        scene.add(p.mesh);
        particles.push(p);
      }
      p.alive = true;
      p.ink = ink;
      p.mesh.material = mat(ink, { fill: true });
      p.mesh.visible = true;
      p.mesh.position.copy(pos);
      p.mesh.scale.setScalar(rnd(0.05, 0.13));
      p.vel.set(rnd(-1, 1), rnd(0.2, 1.3), rnd(-1, 1)).multiplyScalar(speed * rnd(0.4, 1));
      if (dir) p.vel.addScaledVector(dir, speed * 0.6);
      p.life = rnd(0.6, 1.4);
    }
  }
  function spawnDecal(x, z, ink, size) {
    let d;
    if (decals.length >= 90) d = decals.shift();
    else {
      d = new THREE.Mesh(GEO.disc, mat(ink, { fill: true }));
      d.rotation.x = -Math.PI / 2;
      scene.add(d);
    }
    d.material = mat(ink, { fill: true });
    d.position.set(x, 0.012 + decals.length * 0.0004, z);
    d.scale.set(size * rnd(0.7, 1.3), size * rnd(0.7, 1.3), 1);
    d.rotation.z = rnd(0, Math.PI);
    decals.push(d);
  }
  function spawnTracer(from, to) {
    let t = tracers.find((q) => q.life <= 0);
    if (!t) {
      t = { mesh: new THREE.Mesh(GEO.cyl, mat(INK.BLUE, { fill: true })), life: 0 };
      scene.add(t.mesh);
      tracers.push(t);
    }
    _v3.subVectors(to, from);
    const len = _v3.length();
    t.mesh.position.copy(from).addScaledVector(_v3, 0.5);
    t.mesh.quaternion.setFromUnitVectors(THREE.Object3D.DEFAULT_UP, _v3.normalize());
    t.mesh.scale.set(0.035, len, 0.035);
    t.mesh.visible = true;
    t.life = 0.05;
  }

  // ── enemigos ──
  function spawnEnemy(type, at, opts = {}) {
    const def = ENEMY_DEF[type];
    const model = type === "email" ? makeEmail() : type === "meeting" ? makeMeeting() : type === "clock" ? makeClock() : makeBoss();
    let sx, sz;
    if (at) { sx = at[0]; sz = at[1]; if (at[2] !== undefined && opts.y === undefined) opts.y = at[2]; }
    else {
      // aparecen en la planta en la que estás (lejos de ti)
      const fl = floorOf(P.pos.y);
      const same = SPAWNS.filter((sp) => floorOf(sp[2]) === fl);
      const far = same.filter(([x, z]) => Math.hypot(x - P.pos.x, z - P.pos.z) > 12);
      const pool = far.length ? far : same.length ? same : SPAWNS;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      at = null;
      opts.y = opts.y ?? pick[2];
      sx = pick[0] + rnd(-1.5, 1.5);
      sz = pick[1] + rnd(-1.5, 1.5);
    }
    const e = {
      type, def, model, hp: def.hp * (type === "boss" ? 1 : 1 + G.wave * 0.05), maxHp: 0,
      pos: new THREE.Vector3(sx, (opts.puppet ? 0 : opts.y || 0) + (type === "email" && !opts.puppet ? rnd(1.6, 2.6) : 0), sz),
      vel: new THREE.Vector3(), t: rnd(0, 10), cd: rnd(1, 2.5), flash: 0,
      mode: "move", modeT: 0, detour: 0, detourT: 0, lastPos: new THREE.Vector3(), stuckT: 0
    };
    e.maxHp = e.hp;
    e.id = opts.id || ++mp.eid;
    if (opts.puppet) {
      // copia de un enemigo del anfitrión: sólo se mueve hacia donde él diga
      e.puppet = true;
      if (opts.y !== undefined) e.pos.y = opts.y;
      e.tgtPos = e.pos.clone();
    } else {
      e.pos.x = clamp(e.pos.x, -ARENA + 2, ARENA - 2);
      e.pos.z = clamp(e.pos.z, -ARENA + 2, ARENA - 2);
      if (type !== "email") pushOut(e.pos, def.r, e.pos.y + 0.4, e.pos.y + 2);
    }
    model.group.position.copy(e.pos);
    model.group.scale.setScalar(0.01);
    scene.add(model.group);
    enemies.push(e);
    spawnInk(e.pos.clone().setY(e.pos.y + 0.8), null, def.ink, 10, 4);
    if (type === "boss") {
      G.boss = e;
      $(".dd-boss").classList.remove("hidden");
      audio.bossRoar();
      P.shake = 1;
    }
    return e;
  }

  function flashEnemy(e) {
    e.flash = 0.07;
    e.model.group.traverse((o) => {
      if (o.isMesh) {
        if (!o.userData.base) o.userData.base = o.material;
        o.material = mat(o.userData.base.userData.ink, { fill: true });
      }
    });
  }
  function unflashEnemy(e) {
    e.model.group.traverse((o) => { if (o.isMesh && o.userData.base) o.material = o.userData.base; });
  }

  function damageEnemy(e, dmg, hitPoint, dir) {
    flashEnemy(e);
    if (hitPoint) spawnInk(hitPoint, dir, e.def.ink, e.type === "boss" ? 3 : 4, 5);
    if (isGuest()) { net.send({ t: "hit", id: e.id, d: dmg }); return; }
    e.hp -= dmg;
    if (e.hp <= 0) killEnemy(e, dir);
  }

  function killEnemy(e, dir) {
    if (e.dead) return;
    e.dead = true;
    enemyCenter(e, _v2);
    const big = e.type === "boss";
    spawnInk(_v2, dir, e.def.ink, big ? 60 : 18, big ? 12 : 7);
    spawnInk(_v2, dir, INK.BLACK, big ? 20 : 5, 5);
    spawnDecal(e.pos.x, e.pos.z, e.def.ink, big ? 6 : rnd(1.4, 2.4));
    scene.remove(e.model.group);
    audio.kill();
    audio.paperRip();
    if (isGuest()) {
      // en el invitado sólo son efectos: puntos, cafés y victoria los decide el anfitrión
      if (big) { G.boss = null; G.flash = 1; $(".dd-boss").classList.add("hidden"); }
      return;
    }
    G.kills++;
    addScore(e.def.score);
    if (mp.on) net.broadcast({ t: "kill", id: e.id });
    if (!big && Math.random() < 0.16) spawnCoffee(e.pos.x, e.pos.z, null, groundAt(e.pos.x, e.pos.z, 0.3, e.pos.y));
    if (big) {
      G.boss = null;
      G.flash = 1;
      $(".dd-boss").classList.add("hidden");
      enemies.forEach((o) => { if (o !== e) killEnemy(o, null); });
      G.winT = 1.4;
    }
  }

  function spawnCoffee(x, z, id, y = 0) {
    const cid = id || ++mp.cid;
    if (mp.on && mp.isHost && !id) net.broadcast({ t: "cof", id: cid, x: +x.toFixed(2), z: +z.toFixed(2), y });
    const c = makeCoffee();
    c.group.position.set(x, y, z);
    scene.add(c.group);
    pickups.push({ id: cid, model: c, pos: new THREE.Vector3(x, y, z), t: rnd(0, 6), life: 25 });
  }
  function removeCoffee(id) {
    for (const c of pickups) if (c.id === id && c.life > 0) { c.life = 0; scene.remove(c.model.group); }
  }

  const _shA = new THREE.Vector3(), _shD = new THREE.Vector3();
  function enemyShoot(e, from, speedMul = 1, spread = 0) {
    const tp = (e.tgt && e.tgt.pos) || P.pos;
    _shA.set(tp.x, tp.y + EYE - 0.3, tp.z);
    const dir = _shD.subVectors(_shA, from).normalize();
    if (spread) {
      dir.applyAxisAngle(THREE.Object3D.DEFAULT_UP, spread);
    }
    const vel = dir.clone().multiplyScalar(13 * speedMul);
    const dmg = e.type === "boss" ? 12 : 10;
    if (mp.on) net.broadcast({ t: "shot", p: [from.x, from.y, from.z].map((n) => +n.toFixed(2)), v: [vel.x, vel.y, vel.z].map((n) => +n.toFixed(2)), d: dmg });
    addShot(from, vel, dmg);
  }
  // cada jugador calcula si una invitación le da a él (lo que ves es lo que te golpea)
  function addShot(from, vel, dmg) {
    const mesh = new THREE.Group();
    const body = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { tone: 0.05 }));
    body.scale.set(0.42, 0.3, 0.06);
    mesh.add(body);
    const band = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { fill: true }));
    band.scale.set(0.44, 0.08, 0.07);
    band.position.y = 0.11;
    mesh.add(band);
    mesh.position.copy(from);
    scene.add(mesh);
    shots.push({ mesh, pos: from.clone(), vel: vel.clone(), life: 4, dmg });
    audio.invite();
  }

  const _kb = new THREE.Vector3();
  function hurtPlayer(dmg, fromPos) {
    buzz(dmg > 12 ? 45 : 22);
    if (P.iframes > 0 || P.down || !(state === "play" || (mp.on && state === "pause"))) return;
    P.hp -= dmg;
    P.iframes = 0.3;
    P.lastHurt = G.time;
    G.hurt = Math.min(1, G.hurt + dmg / 28);
    P.shake = Math.min(1, P.shake + dmg / 25);
    audio.hurt();
    if (fromPos) {
      _kb.subVectors(P.pos, fromPos).setY(0).normalize();
      P.vel.addScaledVector(_kb, dmg * 0.35);
    }
    if (P.hp <= 0) {
      P.hp = 0;
      if (pvp()) {
        P.down = true;
        input.fire = false;
        mp.respawnT = 3;
        showMsg("¡TE HAN TACHADO!", `${nameOf(mp.lastAttacker)} te ha borrado · vuelves en 3 s`, 3);
        audio.lose();
        const f = { t: "frag", k: mp.lastAttacker, v: net.myId };
        if (mp.isHost) handleFrag(f); else net.send(f);
        mp.lastAttacker = null;
      } else if (mp.on) {
        P.down = true;
        input.fire = false;
        showMsg("K.O.", "Tus compañeros siguen · vuelves en la próxima oleada", 4);
        audio.lose();
      } else gameOver();
    }
  }
  // daño cuerpo a cuerpo decidido por el anfitrión
  function hurtTarget(id, dmg, fromPos) {
    if (id === "me") hurtPlayer(dmg, fromPos);
    else if (id) net.sendTo(id, { t: "dmg", d: dmg, x: +fromPos.x.toFixed(2), z: +fromPos.z.toFixed(2) });
  }
  // ── todos contra todos ──
  // quien dispara detecta el impacto; la víctima aplica el daño (el anfitrión hace de repetidor)
  function sendPvpHit(to, d) {
    const m = { t: "pvp", to, d, from: net.myId, x: +P.pos.x.toFixed(2), z: +P.pos.z.toFixed(2) };
    if (mp.isHost) net.sendTo(to, { ...m, t: "pvphit" });
    else net.send(m);
  }
  function pvpHurt(m) {
    if (!pvp() || P.down) return;
    mp.lastAttacker = m.from;
    hurtPlayer(m.d, new THREE.Vector3(m.x, 0, m.z));
  }
  // el anfitrión lleva el marcador de bajas
  function handleFrag(m) {
    if (!mp.isHost) return;
    if (m.k && m.k !== m.v) mp.frags[m.k] = (mp.frags[m.k] || 0) + 1;
    const out = { t: "frags", f: mp.frags, k: m.k, v: m.v };
    net.broadcast(out);
    applyFrags(out);
    const winner = Object.keys(mp.frags).find((id) => mp.frags[id] >= PVP_GOAL);
    if (winner) { net.broadcast({ t: "pvpwin", id: winner }); pvpEnd(winner); }
  }
  function applyFrags(m) {
    mp.frags = m.f || {};
    feed(`${nameOf(m.k)} <b>✎</b> ${nameOf(m.v)}`);
    if (m.k === net.myId && m.v !== net.myId) {
      audio.kill();
      showMsg("", `¡Has tachado a ${nameOf(m.v)}! · ${mp.frags[net.myId] || 0}/${PVP_GOAL}`, 1.8);
    }
  }
  function feed(html) {
    const el = document.createElement("div");
    el.className = "dd-feed-item";
    el.innerHTML = html;
    const box = $(".dd-feed");
    box.prepend(el);
    while (box.children.length > 4) box.lastChild.remove();
    setTimeout(() => el.remove(), 4500);
  }
  function pvpEnd(winnerId) {
    if (state !== "play" && state !== "pause") return;
    state = "win";
    const me = winnerId === net.myId;
    me ? audio.victory() : audio.lose();
    const ids = [net.myId, ...mp.remotes.keys()];
    const rows = ids.map((id) => [id, mp.frags[id] || 0]).sort((a, b) => b[1] - a[1]);
    $(".dd-end-kicker").textContent = "TODOS CONTRA TODOS";
    $(".dd-end-title").textContent = me ? "¡Has ganado la sala!" : `Gana ${nameOf(winnerId)}`;
    $(".dd-end-stats").innerHTML = rows.map(([id, n], i) =>
      `<div><span>${i + 1}. ${nameOf(id)}${id === net.myId ? " (tú)" : ""}</span><b>${n} ☠</b></div>`).join("");
    showOv("end");
    input.fire = false;
    syncMandoUi();
    if (document.pointerLockElement === canvas) document.exitPointerLock();
  }
  function updatePvp(dt) {
    if (P.down && mp.respawnT > 0) {
      mp.respawnT -= dt;
      if (mp.respawnT <= 0) {
        spawnAt(farthestSpawn());
        Object.assign(P, { down: false, hp: 100, iframes: 2, mag: MAG, reload: 0 });
        P.vel.set(0, 0, 0);
        showMsg("", "¡De vuelta! Tienes 2 s de invulnerabilidad", 1.6);
      }
    }
    // el anfitrión va dejando cafés por el mapa
    if (mp.isHost) {
      mp.cofT -= dt;
      if (mp.cofT <= 0) {
        mp.cofT = 14;
        if (pickups.length < 3) {
          const [x, z] = PLAYER_SPAWNS[Math.floor(Math.random() * PLAYER_SPAWNS.length)];
          spawnCoffee(x + rnd(-3, 3), z + rnd(-3, 3));
        }
      }
    }
  }

  // el enemigo persigue al jugador vivo más cercano (tú o un compañero)
  function pickTarget(from) {
    let best = null, bd = Infinity;
    if (!P.down) { best = { id: "me", pos: P.pos }; bd = P.pos.distanceToSquared(from); }
    mp.remotes.forEach((r) => {
      if (r.d) return;
      const d = r.pos.distanceToSquared(from);
      if (d < bd) { bd = d; best = { id: r.id, pos: r.pos }; }
    });
    return best || { id: null, pos: P.pos };
  }

  const _eEye = new THREE.Vector3(), _eCtr = new THREE.Vector3(), _eTo = new THREE.Vector3(), _eLook = new THREE.Vector3();
  // si el objetivo cambia de planta, al rato los enemigos "suben" tras él (aparecen en su planta)
  function followFloors(e, dt) {
    if (e.type === "boss" || !e.tgt) return;
    const tf = floorOf(e.tgt.pos.y), ef = floorOf(e.pos.y - (e.type === "email" ? 1.5 : 0));
    if (tf === ef) { e.offT = 0; return; }
    e.offT = (e.offT || 0) + dt;
    if (e.offT < 6) return;
    e.offT = 0;
    const opts = SPAWNS.filter((sp) => floorOf(sp[2]) === tf).sort((a, b) => Math.hypot(a[0] - e.tgt.pos.x, a[1] - e.tgt.pos.z) - Math.hypot(b[0] - e.tgt.pos.x, b[1] - e.tgt.pos.z));
    const sp = opts[Math.min(opts.length - 1, 1)] || opts[0];
    if (!sp) return;
    spawnInk(e.pos.clone().setY(e.pos.y + 0.8), null, e.def.ink, 8, 3);
    e.pos.set(sp[0], sp[2] + (e.type === "email" ? 2 : 0), sp[1]);
    spawnInk(e.pos.clone().setY(e.pos.y + 0.8), null, e.def.ink, 8, 3);
  }
  function updateEnemy(e, dt) {
    followFloors(e, dt);
    const m = e.model;
    e.t += dt;
    if (e.flash > 0) { e.flash -= dt; if (e.flash <= 0) unflashEnemy(e); }
    const s = m.group.scale.x;
    if (s < 1) m.group.scale.setScalar(Math.min(1, s + dt * 3));
    e.retarget = (e.retarget || 0) - dt;
    if (!e.tgt || e.retarget <= 0) { e.tgt = pickTarget(e.pos); e.retarget = 0.5; }
    const tp = e.tgt.pos;
    const eye = _eEye.set(tp.x, tp.y + EYE, tp.z);
    const ctr = enemyCenter(e, _eCtr);
    const toP = _eTo.subVectors(eye, ctr);
    const dist = toP.length();
    const flatDist = Math.hypot(eye.x - e.pos.x, eye.z - e.pos.z);

    if (e.type === "email") {
      // vuela directo hacia ti haciendo eses y muerde al llegar
      const dir = toP.clone().normalize();
      const side = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(Math.sin(e.t * 3) * 0.6);
      const speed = 6;
      if (e.retreat > 0) {
        // tras morder se aleja y sube antes de volver a entrar
        e.retreat -= dt;
        dir.negate().setY(0.6).normalize();
      }
      // no se amontonan todos a la vez
      for (const o of enemies) {
        if (o === e || o.type !== "email" || o.dead) continue;
        const dx = e.pos.x - o.pos.x, dy = e.pos.y - o.pos.y, dz = e.pos.z - o.pos.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 2.5 && d2 > 1e-4) side.x += dx / d2, side.y += dy / d2, side.z += dz / d2;
      }
      e.vel.lerp(dir.multiplyScalar(speed).add(side.multiplyScalar(speed)), Math.min(1, dt * 2.5));
      e.pos.addScaledVector(e.vel, dt);
      const floorY = groundAt(e.pos.x, e.pos.z, 0.3, e.pos.y - 0.5);
      e.pos.y = clamp(e.pos.y, floorY + 0.9, floorY + 3.1);
      pushOut(e.pos, e.def.r, e.pos.y - 0.3, e.pos.y + 0.3);
      e.cd -= dt;
      if (dist < 1.3 && e.cd <= 0) {
        hurtTarget(e.tgt.id, 5, e.pos);
        e.cd = 2.2;
        e.retreat = rnd(0.9, 1.5);
        e.vel.copy(toP).normalize().multiplyScalar(-9);
      }
      if (Math.random() < dt * 0.4 && dist < 14) audio.emailBuzz();
      const flap = Math.sin(e.t * 22) * 0.7;
      m.wings.forEach((w) => (w.pivot.rotation.z = w.s * flap));
      m.body.position.y = Math.sin(e.t * 5) * 0.08;
    } else if (e.type === "meeting" || e.type === "clock") {
      let wish = new THREE.Vector3(toP.x, 0, toP.z).normalize();
      let speed = e.type === "meeting" ? 2.8 : 3.8;
      if (e.type === "meeting") {
        // mantiene la distancia y te manda invitaciones
        if (flatDist < 8) wish.negate();
        else if (flatDist < 16) wish.set(-wish.z, 0, wish.x).multiplyScalar(Math.sin(e.t * 0.7) > 0 ? 1 : -1);
        e.cd -= dt;
        if (e.cd < 0.4 && e.cd + dt >= 0.4) e.tell = 0.4;
        if (e.cd <= 0) {
          e.cd = rnd(1.8, 2.8);
          if (hasLOS(ctr, eye)) enemyShoot(e, ctr.clone().setY(ctr.y + 0.2));
        }
        if (e.tell > 0) { e.tell -= dt; m.body.scale.setScalar(1 + Math.sin(e.tell * 40) * 0.06); } else m.body.scale.setScalar(1);
      } else {
        // despertador: se acerca, suena y embiste en línea recta
        if (e.mode === "move") {
          e.cd -= dt;
          if (flatDist < 10 && e.cd <= 0 && hasLOS(ctr, eye)) {
            e.mode = "windup"; e.modeT = 0.65; audio.ring();
          }
        } else if (e.mode === "windup") {
          speed = 0;
          e.modeT -= dt;
          m.body.rotation.z = Math.sin(e.t * 60) * 0.15;
          if (e.modeT <= 0) {
            e.mode = "charge"; e.modeT = 0.75;
            e.chargeDir = wish.clone();
            audio.charge();
          }
        } else if (e.mode === "charge") {
          wish.copy(e.chargeDir);
          speed = 17;
          e.modeT -= dt;
          m.body.rotation.z = 0;
          if (flatDist < 1.3 && Math.abs(eye.y - 1 - e.pos.y) < 1.6) {
            hurtTarget(e.tgt.id, 18, e.pos);
            e.modeT = 0;
          }
          if (e.modeT <= 0) { e.mode = "move"; e.cd = rnd(1.4, 2.2); }
        }
        m.hand1.rotation.z = -e.t * 4;
        m.hand2.rotation.z = -e.t * 0.5 - 1.1;
      }
      // desvío si se ha atascado contra una mesa
      if (e.detourT > 0) { e.detourT -= dt; wish.applyAxisAngle(THREE.Object3D.DEFAULT_UP, e.detour); }
      e.vel.x += (wish.x * speed - e.vel.x) * Math.min(1, dt * 8);
      e.vel.z += (wish.z * speed - e.vel.z) * Math.min(1, dt * 8);
      e.lastPos.copy(e.pos);
      e.pos.addScaledVector(e.vel, dt);
      const bumped = pushOut(e.pos, e.def.r, e.pos.y + 0.35, e.pos.y + 2.2);
      e.pos.y = groundAt(e.pos.x, e.pos.z, e.def.r * 0.8, e.pos.y);
      if (bumped && e.mode === "charge") { e.mode = "move"; e.cd = 1.5; P.shake = Math.max(P.shake, 0.2); }
      const moved = e.lastPos.distanceTo(e.pos);
      if (speed > 0 && moved < speed * dt * 0.3) {
        e.stuckT += dt;
        if (e.stuckT > 0.35) { e.detour = (Math.random() < 0.5 ? 1 : -1) * rnd(1.1, 1.7); e.detourT = rnd(0.8, 1.4); e.stuckT = 0; }
      } else e.stuckT = 0;
      if (m.legs) {
        const sw = Math.sin(e.t * 9) * 0.6 * Math.min(1, e.vel.length() / 2);
        m.legs.forEach((l) => (l.pivot.rotation.x = l.s * sw));
        m.body.position.y = 0.55 + Math.abs(sw) * 0.08;
      } else {
        m.body.position.y = 1.05 + Math.abs(Math.sin(e.t * 10)) * 0.08 * Math.min(1, e.vel.length() / 2);
      }
    } else if (e.type === "boss") {
      const rage = e.hp < e.maxHp * 0.5;
      let wish = new THREE.Vector3(toP.x, 0, toP.z).normalize();
      if (flatDist < 12) wish.negate();
      else if (flatDist < 20) wish.set(-wish.z, 0, wish.x);
      e.vel.lerp(wish.multiplyScalar(rage ? 3.4 : 2.4), Math.min(1, dt * 2));
      e.pos.addScaledVector(e.vel, dt);
      pushOut(e.pos, e.def.r, 0.1, 6);
      e.pos.x = clamp(e.pos.x, BOSS_AREA.x0, BOSS_AREA.x1);
      e.pos.z = clamp(e.pos.z, BOSS_AREA.z0, BOSS_AREA.z1);
      e.pos.y = Math.sin(e.t * 1.3) * 0.25 + 0.3;
      e.cd -= dt;
      if (e.cd <= 0) {
        // abanico de invitaciones
        const n = rage ? 9 : 6;
        const from = ctr.clone().setY(ctr.y + 1.2);
        for (let i = 0; i < n; i++) enemyShoot(e, from, rage ? 1.2 : 1, (i - (n - 1) / 2) * 0.13);
        e.cd = rage ? 1.8 : 2.6;
      }
      e.summonT = (e.summonT || 6) - dt;
      if (e.summonT <= 0) {
        e.summonT = rage ? 7 : 10;
        for (let i = 0; i < (rage ? 4 : 3); i++) spawnEnemy("email", [e.pos.x + rnd(-3, 3), e.pos.z + rnd(-3, 3)]);
        audio.bossRoar();
      }
      m.layers.forEach((l, i) => (l.rotation.y = Math.sin(e.t * 1.5 + i) * 0.18));
      m.top.rotation.z = Math.sin(e.t * 2) * 0.06;
      if (flatDist < 3 && e.cd > 0.5) hurtTarget(e.tgt.id, 20, e.pos);
    }

    m.group.position.copy(e.pos);
    _eLook.set(eye.x, e.type === "email" ? eye.y : e.pos.y, eye.z);
    m.group.lookAt(_eLook);
  }

  // enemigo "marioneta" en los invitados: interpola hacia la posición que manda el anfitrión
  const _pPrev = new THREE.Vector3();
  function updatePuppet(e, dt) {
    const m = e.model;
    e.t += dt;
    if (e.flash > 0) { e.flash -= dt; if (e.flash <= 0) unflashEnemy(e); }
    const s = m.group.scale.x;
    if (s < 1) m.group.scale.setScalar(Math.min(1, s + dt * 3));
    _pPrev.copy(e.pos);
    e.pos.lerp(e.tgtPos, Math.min(1, dt * 10));
    const spd = _pPrev.distanceTo(e.pos) / Math.max(dt, 1e-4);
    if (m.wings) {
      const flap = Math.sin(e.t * 22) * 0.7;
      m.wings.forEach((w) => (w.pivot.rotation.z = w.s * flap));
      m.body.position.y = Math.sin(e.t * 5) * 0.08;
    }
    if (m.legs) {
      const sw = Math.sin(e.t * 9) * 0.6 * Math.min(1, spd / 2);
      m.legs.forEach((l) => (l.pivot.rotation.x = l.s * sw));
      m.body.position.y = 0.55 + Math.abs(sw) * 0.08;
    }
    if (m.hand1) {
      m.hand1.rotation.z = -e.t * 4;
      m.body.rotation.z = e.wind ? Math.sin(e.t * 60) * 0.15 : 0;
    }
    if (m.layers) {
      m.layers.forEach((l, i) => (l.rotation.y = Math.sin(e.t * 1.5 + i) * 0.18));
      m.top.rotation.z = Math.sin(e.t * 2) * 0.06;
    }
    m.group.position.copy(e.pos);
    const tp = pickTarget(e.pos).pos;
    _eLook.set(tp.x, e.type === "email" ? tp.y + EYE : e.pos.y, tp.z);
    m.group.lookAt(_eLook);
  }

  // ── disparo del jugador (hitscan) ──
  const _dir = new THREE.Vector3();
  function fire() {
    P.fireCd = 1 / FIRE_RATE;
    P.mag--;
    P.kick = 1;
    G.shots++;
    audio.shoot();
    gun.flash.visible = true;
    gun.flash.rotation.z = rnd(0, Math.PI);
    P.fireT = 0.18;
    const moving = Math.hypot(P.vel.x, P.vel.z) > 1 || !P.onGround;
    const spread = moving ? 0.022 : 0.008;
    const cp = Math.cos(P.pitch);
    _dir.set(-Math.sin(P.yaw) * cp, Math.sin(P.pitch), -Math.cos(P.yaw) * cp);
    // en 3ª persona el rayo sale de la cámara (así la mira es exacta) pero empieza a la altura del personaje
    const o = camMode === "third" ? camera.position.clone().addScaledVector(_dir, Math.max(0, camBack - 0.4)) : eyePos(new THREE.Vector3());
    // autoapuntado con el mando: si hay un enemigo cerca de la mira, apunta a su centro
    if (assistOn()) {
      const tgt = assistTarget(0.2, o);
      if (tgt) _dir.subVectors(tgt, o).normalize();
    }
    _dir.x += rnd(-spread, spread);
    _dir.y += rnd(-spread, spread);
    _dir.z += rnd(-spread, spread);
    _dir.normalize();
    const wallT = rayWorld(o, _dir, 120);
    let best = null, bestT = wallT, vicHit = false;
    {
      // Victoria no es un enemigo: si le das, se queja (y no pasa nada más)
      _v3.set(victoria.group.position.x, 1.4, victoria.group.position.z).sub(o);
      const tc = _v3.dot(_dir), d2 = _v3.lengthSq() - tc * tc;
      if (tc > 0 && d2 < 0.5 * 0.5) { const t = tc - Math.sqrt(0.25 - d2); if (t < bestT) { bestT = t; vicHit = true; } }
    }
    for (const e of enemies) {
      if (e.dead) continue;
      enemyCenter(e, _v2);
      const r = e.def.r;
      _v3.subVectors(_v2, o);
      const tc = _v3.dot(_dir);
      if (tc < 0) continue;
      const d2 = _v3.lengthSq() - tc * tc;
      if (d2 > r * r) continue;
      const t = tc - Math.sqrt(r * r - d2);
      if (t < bestT) { bestT = t; best = e; }
    }
    // en "todos contra todos" también cuentan tus compañeros (cuerpo + cabeza)
    let bestR = null;
    if (pvp()) {
      mp.remotes.forEach((r) => {
        if (r.d) return;
        for (const [cy, rad] of [[0.8, 0.5], [1.5, 0.32]]) {
          _v2.set(r.pos.x, r.pos.y + cy, r.pos.z);
          _v3.subVectors(_v2, o);
          const tc = _v3.dot(_dir);
          if (tc < 0) continue;
          const d2 = _v3.lengthSq() - tc * tc;
          if (d2 > rad * rad) continue;
          const t = tc - Math.sqrt(rad * rad - d2);
          if (t < bestT) { bestT = t; best = null; bestR = r; }
        }
      });
    }
    const hitP = o.clone().addScaledVector(_dir, bestT);
    const from = camMode === "third"
      ? new THREE.Vector3(Math.cos(P.yaw) * 0.3 - Math.sin(P.yaw) * 0.3, 1.15, -Math.sin(P.yaw) * 0.3 - Math.cos(P.yaw) * 0.3).add(P.pos)
      : gun.muzzle.getWorldPosition(new THREE.Vector3());
    spawnTracer(from, hitP);
    if (mp.on) {
      const fx = { t: "fx", a: [from.x, from.y, from.z].map((n) => +n.toFixed(2)), b: [hitP.x, hitP.y, hitP.z].map((n) => +n.toFixed(2)) };
      if (mp.isHost) net.broadcast(fx); else net.send(fx);
    }
    if (bestR) {
      G.hits++;
      spawnInk(hitP, _dir, INK.RED, 5, 5);
      audio.hit();
      hitmark();
      bestR.hitT = 0.15;
      sendPvpHit(bestR.id, DMG);
    } else if (best) {
      G.hits++;
      damageEnemy(best, DMG, hitP, _dir);
      audio.hit();
      hitmark();
    } else if (vicHit) {
      spawnInk(hitP, null, INK.BLUE, 5, 2.5);
      audio.wallHit();
      showMsg("", "Victoria: ¡Eh! ¡Que yo sólo te doy la tarjeta de acceso! 😅", 2);
    } else if (bestT < 120) {
      spawnInk(hitP, null, INK.BLUE, 3, 2.5);
      if (hitP.y < 0.05) spawnDecal(hitP.x, hitP.z, INK.BLUE, 0.25);
      audio.wallHit();
    }
    if (P.mag <= 0) startReload();
  }
  const assistOn = () => isTouch || gp.active;
  // enemigo más cercano a la mira dentro de un cono (radianes), con línea de visión
  const _aimE = new THREE.Vector3(), _aimC = new THREE.Vector3(), _aimD = new THREE.Vector3();
  function assistTarget(cone, origin) {
    const eye = eyePos(_aimE);
    const o = origin || eye;
    const cp = Math.cos(P.pitch);
    _aimD.set(-Math.sin(P.yaw) * cp, Math.sin(P.pitch), -Math.cos(P.yaw) * cp);
    let best = null, bestA = cone;
    for (const e of enemies) {
      if (e.dead) continue;
      enemyCenter(e, _aimC);
      const to = _aimC.clone().sub(o);
      const dist = to.length();
      if (dist > 45) continue;
      // cono horizontal estrecho, vertical generoso (la cruceta no sube ni baja la mira)
      const yawTo = Math.atan2(-to.x, -to.z);
      let dy = Math.atan2(Math.sin(yawTo - P.yaw), Math.cos(yawTo - P.yaw));
      const a = Math.abs(dy) + Math.max(0, Math.abs(Math.asin(to.y / dist) - P.pitch) - 0.5) * 0.5;
      if (a < bestA && hasLOS(eye, _aimC)) { bestA = a; best = _aimC.clone(); }
    }
    if (pvp()) {
      mp.remotes.forEach((r) => {
        if (r.d) return;
        _aimC.set(r.pos.x, r.pos.y + 1.0, r.pos.z);
        const to = _aimC.clone().sub(o);
        const dist = to.length();
        if (dist > 45) return;
        const yawTo = Math.atan2(-to.x, -to.z);
        const a = Math.abs(Math.atan2(Math.sin(yawTo - P.yaw), Math.cos(yawTo - P.yaw)));
        if (a < bestA && hasLOS(eye, _aimC)) { bestA = a; best = _aimC.clone(); }
      });
    }
    return best;
  }

  function startReload() {
    if (P.reload > 0 || P.mag === MAG) return;
    P.reload = 1.1;
    audio.reload();
  }
  let hitT = 0;
  function hitmark() { hitT = 0.12; }

  function addScore(n) { G.score += n; }

  // mensaje grande para todos los jugadores de la sala
  function announce(title, sub, dur, wave) {
    showMsg(title, sub, dur);
    if (wave) audio.wave();
    if (mp.on && mp.isHost) net.broadcast({ t: "msg", a: title, b: sub, d: dur, w: wave ? 1 : 0 });
  }
  function reviveSelf() {
    if (!P.down) return;
    P.down = false;
    P.hp = 60;
    P.iframes = 1.5;
    showMsg("", "¡De vuelta al sprint! ❤ 60", 1.6);
  }
  function reviveAll() {
    reviveSelf();
    if (mp.on && mp.isHost) net.broadcast({ t: "revive" });
  }

  // ── oleadas ──
  function nextWave() {
    G.wave++;
    if (G.wave >= WAVES.length) return;
    const w = WAVES[G.wave];
    G.queue = [];
    for (const [type, n] of Object.entries(w.list)) for (let i = 0; i < n; i++) G.queue.push(type);
    // el jefe sale primero; el resto, barajado
    G.queue = G.queue.filter((t) => t === "boss").concat(G.queue.filter((t) => t !== "boss").sort(() => Math.random() - 0.5));
    G.spawnT = 0.5;
    announce(w.title, w.sub, 3, true);
    reviveAll();
    if (G.wave > 0) { const [cx, cy, cz] = COFFEE_SPOTS[G.wave % COFFEE_SPOTS.length]; spawnCoffee(cx, cz, null, cy); }
  }

  function updateWaves(dt) {
    if (G.winT > 0) {
      G.winT -= dt;
      if (G.winT <= 0) victory();
      return;
    }
    if (G.interT > 0) {
      G.interT -= dt;
      if (G.interT <= 0) nextWave();
      return;
    }
    if (G.queue.length) {
      G.spawnT -= dt;
      const alive = enemies.filter((e) => !e.dead).length;
      if (G.spawnT <= 0 && alive < 14) {
        const type = G.queue.shift();
        spawnEnemy(type, type === "boss" ? [1, -20, 0] : null);
        G.spawnT = G.wave < 2 ? rnd(1.1, 1.8) : rnd(0.5, 1.0);
      }
    } else if (G.wave < WAVES.length - 1 && enemies.every((e) => e.dead)) {
      announce("¡OLEADA SUPERADA!", `+${250 * (G.wave + 1)} pts · respira y tómate un café`, 2.4);
      addScore(250 * (G.wave + 1));
      G.interT = 3.2;
    }
  }

  // ── simulación ──
  const _fwd = new THREE.Vector3(), _right = new THREE.Vector3(), _wish = new THREE.Vector3();
  function step(dt) {
    G.time += dt;
    // en sala la partida sigue aunque abras la pausa; sólo se ignoran tus controles
    const ctrl = state === "play" && !P.down;
    if (!ctrl) { lookX = lookY = 0; input.jump = input.dash = false; }
    // mirar: ratón / arrastre táctil + stick derecho del mando
    const sens = 0.0022;
    P.yaw -= lookX * sens + gp.lx * 3.0 * dt;
    P.pitch = clamp(P.pitch - lookY * sens - gp.ly * 2.2 * dt, -1.45, 1.45);
    lookX = lookY = 0;
    // cruceta ◀▶: girar (con un poco de inercia para apuntar fino)
    const turn = ctrl ? (mando.R ? 1 : 0) - (mando.L ? 1 : 0) : 0;
    P.turnV += (turn * 2.7 - P.turnV) * Math.min(1, dt * (turn ? 7 : 14));
    P.yaw -= P.turnV * dt;
    // A: saltar · doble toque en ▲: dash
    const aNow = ctrl && !!mando.A;
    if (aNow && !P.aPrev) input.jump = true;
    P.aPrev = aNow;
    const upNow = ctrl && !!mando.Up;
    if (upNow && !P.upPrev) {
      if (G.time - P.upTapT < 0.28) input.dash = true;
      P.upTapT = G.time;
    }
    P.upPrev = upNow;

    // moverse
    let ix = 0, iy = 0;
    if (ctrl) {
      ix = gp.mx + joy.x; iy = gp.my + joy.y;
      if (upNow) iy += 1;
      if (mando.Down) iy -= 1;
      if (keys.KeyW || keys.ArrowUp) iy += 1;
      if (keys.KeyS || keys.ArrowDown) iy -= 1;
      if (keys.KeyD || keys.ArrowRight) ix += 1;
      if (keys.KeyA || keys.ArrowLeft) ix -= 1;
    }
    _fwd.set(-Math.sin(P.yaw), 0, -Math.cos(P.yaw));
    _right.set(Math.cos(P.yaw), 0, -Math.sin(P.yaw));
    _wish.set(0, 0, 0).addScaledVector(_fwd, iy).addScaledVector(_right, ix);
    if (_wish.lengthSq() > 1) _wish.normalize();
    P.moveX = ix || turn * 0.5;

    P.dashCd -= dt;
    if (input.dash && P.dashCd <= 0) {
      P.dashT = 0.17;
      P.dashCd = 1.1;
      P.dashDir.copy(_wish.lengthSq() > 0.01 ? _wish : _fwd).normalize();
      P.iframes = 0.2;
      audio.dash();
    }
    input.dash = false;
    if (P.dashT > 0) {
      P.dashT -= dt;
      P.vel.x = P.dashDir.x * 21;
      P.vel.z = P.dashDir.z * 21;
    } else {
      const accel = P.onGround ? 14 : 3.5;
      P.vel.x += (_wish.x * heroSpeed - P.vel.x) * Math.min(1, accel * dt);
      P.vel.z += (_wish.z * heroSpeed - P.vel.z) * Math.min(1, accel * dt);
    }
    P.iframes -= dt;
    // si llevas un rato sin recibir daño, recuperas vida poco a poco
    if (G.time - P.lastHurt > 4 && P.hp < 100) P.hp = Math.min(100, P.hp + 3 * dt);

    P.coyote = P.onGround ? 0.1 : P.coyote - dt;
    if (input.jump && P.coyote > 0) {
      P.vel.y = heroJump;
      P.onGround = false;
      P.coyote = 0;
      audio.jump();
    }
    input.jump = false;
    P.vel.y -= GRAVITY * dt;
    const headPrev = P.pos.y + P_HEIGHT;
    P.pos.addScaledVector(P.vel, dt);
    // techos: al saltar bajo una losa te das con la cabeza
    if (P.vel.y > 0) {
      const ceil = ceilingAt(P.pos.x, P.pos.z, P_RADIUS, headPrev - 0.05);
      if (P.pos.y + P_HEIGHT > ceil) { P.pos.y = ceil - P_HEIGHT; P.vel.y = 0; }
    }
    pushOut(P.pos, P_RADIUS, P.pos.y + STEP_UP, P.pos.y + P_HEIGHT);
    const g = groundAt(P.pos.x, P.pos.z, P_RADIUS, P.pos.y);
    const wasGround = P.onGround;
    if (P.pos.y <= g) {
      P.pos.y = g;
      P.vel.y = Math.max(0, P.vel.y);
      P.onGround = true;
    } else if (wasGround && P.vel.y <= 0 && P.pos.y - g < STEP_UP) {
      P.pos.y = g; // bajar escalones sin despegar
      P.vel.y = 0;
    } else {
      P.onGround = false;
    }

    // disparar / recargar
    P.fireCd -= dt;
    if (P.reload > 0) {
      P.reload -= dt;
      if (P.reload <= 0) P.mag = MAG;
    } else if (ctrl && (input.fire || mando.B || gp.fire || touchFire.on) && P.fireCd <= 0) {
      if (P.mag > 0) fire();
      else startReload();
    }

    if (ctrl && assistOn() && (mando.B || gp.fire || touchFire.on)) {
      const tgt = assistTarget(0.35);
      if (tgt) {
        const want = Math.atan2(-(tgt.x - P.pos.x), -(tgt.z - P.pos.z));
        let dy = want - P.yaw;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        P.yaw += clamp(dy, -2.2 * dt, 2.2 * dt);
      }
    }

    if (pvp()) updatePvp(dt);
    else if (!isGuest()) updateWaves(dt);
    for (const e of enemies) if (!e.dead) (e.puppet ? updatePuppet(e, dt) : updateEnemy(e, dt));
    enemies = enemies.filter((e) => !e.dead);

    // invitaciones enemigas
    for (const s of shots) {
      s.life -= dt;
      s.pos.addScaledVector(s.vel, dt);
      s.mesh.position.copy(s.pos);
      s.mesh.rotation.y += dt * 8;
      s.mesh.rotation.x += dt * 5;
      // distancia al cuerpo del jugador (segmento pies-ojos)
      const cy = clamp(s.pos.y, P.pos.y + 0.3, P.pos.y + EYE);
      const dx = s.pos.x - P.pos.x, dz = s.pos.z - P.pos.z, dy = s.pos.y - cy;
      if (!P.down && dx * dx + dy * dy + dz * dz < 0.5 * 0.5) {
        hurtPlayer(s.dmg, s.pos);
        s.life = 0;
        spawnInk(s.pos, null, INK.ORANGE, 6, 3);
      } else if (insideSolid(s.pos)) {
        s.life = 0;
        spawnInk(s.pos, null, INK.ORANGE, 4, 2);
      }
      if (s.life <= 0) scene.remove(s.mesh);
    }
    shots = shots.filter((s) => s.life > 0);

    // cafés
    for (const c of pickups) {
      c.t += dt;
      c.life -= dt;
      c.model.group.position.y = c.pos.y + 0.25 + Math.sin(c.t * 3) * 0.12;
      c.model.group.rotation.y += dt * 1.8;
      if (!P.down && c.life > 0 && Math.hypot(c.pos.x - P.pos.x, c.pos.z - P.pos.z) < 1.2 && Math.abs(P.pos.y - c.pos.y) < 1.5 && P.hp < 100) {
        P.hp = Math.min(100, P.hp + 25);
        c.life = 0;
        if (mp.on) { if (mp.isHost) net.broadcast({ t: "rmcof", id: c.id }); else net.send({ t: "take", id: c.id }); }
        audio.pickup();
        showMsg("", "☕ +25 · café de la oficina", 1.2);
      }
      if (c.life <= 0) scene.remove(c.model.group);
    }
    pickups = pickups.filter((c) => c.life > 0);
  }

  // efectos que corren también en pausa suave
  function updateFx(dt) {
    for (const p of particles) {
      if (!p.alive) continue;
      p.life -= dt;
      p.vel.y -= 18 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.mesh.position.y <= 0.02) {
        if (Math.random() < 0.35) spawnDecal(p.mesh.position.x, p.mesh.position.z, p.ink, p.mesh.scale.x * 5);
        p.life = 0;
      }
      if (p.life <= 0) { p.alive = false; p.mesh.visible = false; }
    }
    for (const t of tracers) {
      if (t.life > 0) { t.life -= dt; if (t.life <= 0) t.mesh.visible = false; }
    }
    if (gun.flash.visible && P.fireCd < 1 / FIRE_RATE - 0.04) gun.flash.visible = false;
    G.hurt = Math.max(0, G.hurt - dt * 1.4);
    G.flash = Math.max(0, G.flash - dt * 0.8);
    P.shake = Math.max(0, P.shake - dt * 2.5);
    P.kick = Math.max(0, P.kick - dt * 12);
  }

  let camBack = 0;
  const _cPiv = new THREE.Vector3(), _cDir = new THREE.Vector3();
  function updateCamera(dt) {
    const speed = Math.hypot(P.vel.x, P.vel.z);
    if (P.onGround && speed > 0.5) P.bob += dt * speed * 1.6;
    const bobY = Math.sin(P.bob * 2) * 0.045 * Math.min(1, speed / 6);
    const sh = P.shake * P.shake * 0.12;
    if (camMode === "third") {
      // cámara al hombro: detrás, algo arriba y a la derecha; se acerca si una pared se mete en medio
      const cp = Math.cos(P.pitch);
      const fx = -Math.sin(P.yaw) * cp, fy = Math.sin(P.pitch), fz = -Math.cos(P.yaw) * cp;
      _cPiv.set(P.pos.x, P.pos.y + 1.55, P.pos.z);
      _cDir.set(-fx * 4.3 + Math.cos(P.yaw) * 1.0, -fy * 4.3 + 0.45, -fz * 4.3 - Math.sin(P.yaw) * 1.0);
      const len = _cDir.length();
      _cDir.divideScalar(len);
      const hit = rayWorld(_cPiv, _cDir, len);
      const dist = Math.max(0.35, Math.min(len, hit - 0.25));
      camera.position.copy(_cPiv).addScaledVector(_cDir, dist);
      camera.position.x += rnd(-sh, sh);
      camera.position.y = Math.max(0.25, camera.position.y + rnd(-sh, sh));
      camera.position.z += rnd(-sh, sh);
      camBack = dist * 0.95;
    } else {
      camera.position.set(P.pos.x + rnd(-sh, sh), P.pos.y + EYE + bobY + rnd(-sh, sh), P.pos.z + rnd(-sh, sh));
      camBack = 0;
    }
    camera.rotation.set(P.pitch, P.yaw, 0);
    // arma: balanceo al andar, retroceso y bajada al recargar
    const rl = P.reload > 0 ? Math.sin(Math.min(1, (1.1 - P.reload) / 1.1) * Math.PI) : 0;
    gun.group.position.set(
      GUN_REST.x + Math.cos(P.bob) * 0.012 * Math.min(1, speed / 6),
      GUN_REST.y + bobY * 0.5 - rl * 0.25,
      GUN_REST.z + P.kick * 0.07
    );
    gun.group.rotation.set(P.kick * 0.09 + rl * 0.6, 0.05, rl * 0.5);
  }

  // ── HUD ──
  const hud = {
    hpB: $(".dd-hp-label b"), hpBar: $(".dd-hp-bar i"), ammoB: $(".dd-ammo b"), ammo: $(".dd-ammo"),
    wave: $(".dd-wave"), score: $(".dd-score"), boss: $(".dd-boss-bar i"), dash: $(".dd-dash i"),
    msg: $(".dd-msg"), sub: $(".dd-sub"), hit: $(".dd-hitmark"), cross: $(".dd-cross")
  };
  let msgT = 0;
  function showMsg(title, sub, dur) {
    hud.msg.textContent = title;
    hud.sub.textContent = sub;
    hud.msg.classList.remove("pop");
    void hud.msg.offsetWidth;
    hud.msg.classList.add("pop");
    msgT = dur;
  }
  const last = {};
  function setText(el, key, v) { if (last[key] !== v) { last[key] = v; el.textContent = v; } }
  function updateHud(dt) {
    setText(hud.hpB, "hp", String(Math.ceil(P.hp)));
    hud.hpBar.style.width = `${P.hp}%`;
    hud.hpBar.classList.toggle("low", P.hp <= 30);
    setText(hud.ammoB, "ammo", P.reload > 0 ? "···" : String(P.mag));
    hud.ammo.classList.toggle("low", P.mag <= 6 && P.reload <= 0);
    if (pvp()) setText(hud.wave, "wave", `· ⚔️ ${mp.frags[net.myId] || 0}/${PVP_GOAL} bajas`);
    else setText(hud.wave, "wave", G.wave >= 0 ? `· ${WAVES[Math.min(G.wave, WAVES.length - 1)].title} (${Math.min(G.wave + 1, 6)}/6)` : "");
    setText(hud.score, "score", pvp() ? `${mp.frags[net.myId] || 0} ☠` : G.score.toLocaleString("es-ES"));
    if (G.boss) hud.boss.style.width = `${Math.max(0, (G.boss.hp / G.boss.maxHp) * 100)}%`;
    hud.dash.style.width = `${clamp(1 - P.dashCd / 1.1, 0, 1) * 100}%`;
    msgT -= dt;
    const vis = msgT > 0;
    hud.msg.style.opacity = vis ? "1" : "0";
    hud.sub.style.opacity = vis ? "1" : "0";
    hitT -= dt;
    hud.hit.style.opacity = hitT > 0 ? "1" : "0";
    const spreadPx = 8 + Math.min(10, Math.hypot(P.vel.x, P.vel.z) * 1.2) + P.kick * 6;
    hud.cross.style.setProperty("--gap", `${spreadPx}px`);
  }

  // ── fin de partida ──
  function rankFor(score) {
    return score >= 19000 ? "S" : score >= 15000 ? "A" : score >= 10000 ? "B" : "C";
  }
  function endScreen(win) {
    const acc = G.shots ? Math.round((G.hits / G.shots) * 100) : 0;
    const mins = Math.floor(G.time / 60), secs = Math.floor(G.time % 60);
    $(".dd-end-kicker").textContent = win ? "INBOX ZERO" : "GAME OVER";
    $(".dd-end-title").textContent = win ? "¡Bandeja de entrada vacía!" : "Te han enterrado en emails";
    const rank = rankFor(G.score);
    $(".dd-end-stats").innerHTML = `
      <div><span>Puntos</span><b>${G.score.toLocaleString("es-ES")}</b></div>
      ${win ? `<div><span>Rango</span><b class="dd-rank">${rank}</b></div>` : `<div><span>Oleada</span><b>${G.wave + 1}/6</b></div>`}
      <div><span>Eliminados</span><b>${G.kills}</b></div>
      <div><span>Precisión</span><b>${acc}%</b></div>
      <div><span>Tiempo</span><b>${mins}:${String(secs).padStart(2, "0")}</b></div>`;
    showOv("end");
    input.fire = false;
    syncMandoUi();
    if (document.pointerLockElement === canvas) document.exitPointerLock();
    reportScore(win, win ? rank : "");
    return rank;
  }
  function reportScore(won, rank) {
    if (!onScore || G.score <= 0 || pvp()) return;
    const acc = G.shots ? Math.round((G.hits / G.shots) * 100) : 0;
    try { onScore(G.score, { wave: Math.max(1, G.wave + 1), kills: G.kills, acc, time: Math.round(G.time), won: !!won }, rank); } catch (e) {}
  }
  function gameOver() {
    if (mp.on && mp.isHost) net.broadcast({ t: "over" });
    state = "over";
    audio.lose();
    endScreen(false);
  }
  function victory(hostScore) {
    if (state === "win" || state === "over" || state === "start") return;
    state = "win";
    if (isGuest()) G.score = hostScore || G.score;
    else {
      const bonus = Math.round(P.hp * 20 + Math.max(0, 3000 - G.time * 8));
      addScore(bonus);
      if (mp.on) net.broadcast({ t: "win", s: G.score });
    }
    audio.victory();
    const rank = endScreen(true);
    try { if (onVictory) onVictory(G.score, rank); } catch (e) {}
  }

  function resetGame() {
    enemies.forEach((e) => scene.remove(e.model.group));
    shots.forEach((s) => scene.remove(s.mesh));
    pickups.forEach((c) => scene.remove(c.model.group));
    decals.forEach((d) => scene.remove(d));
    decals.length = 0;
    particles.forEach((p) => { p.alive = false; p.mesh.visible = false; });
    enemies = []; shots = []; pickups = [];
    Object.assign(P, { down: false, lastHurt: 0, turnV: 0, fireT: 0, moveX: 0, yaw: 0, pitch: 0, onGround: true, coyote: 0, hp: 100, mag: MAG, reload: 0, fireCd: 0, dashCd: 0, dashT: 0, shake: 0, kick: 0, iframes: 0 });
    P.vel.set(0, 0, 0);
    if (mp.on) spawnAt(mp.spawnIdx >= 0 ? mp.spawnIdx : farthestSpawn());
    else { P.pos.set(START.x, START.y, START.z); P.yaw = START.yaw; }
    Object.assign(G, { winT: 0, wave: -1, queue: [], spawnT: 0, interT: pvp() ? 0 : 1.2, time: 0, score: 0, kills: 0, shots: 0, hits: 0, hurt: 0, flash: 0, boss: null });
    mp.respawnT = 0;
    mp.lastAttacker = null;
    mp.cofT = 6;
    $(".dd-feed").innerHTML = "";
    $(".dd-boss").classList.add("hidden");
    if (pvp()) showMsg("TODOS CONTRA TODOS", `Tacha a tus compañeros · gana el primero a ${PVP_GOAL} bajas`, 3);
    else showMsg("CINK COWORKING", "Infanta Mercedes · entra por la puerta de la esquina", 2.4);
  }

  // ── bucle ──
  function resize() {
    const w = Math.max(1, root.clientWidth || window.innerWidth), h = Math.max(1, root.clientHeight || window.innerHeight);
    camera.aspect = w / h;
    // en vertical abrimos el campo de visión para no ver sólo un pasillo
    camera.fov = w < h ? 90 : 75;
    camera.updateProjectionMatrix();
    R.setSize(w, h);
    syncMandoUi();
  }
  // el contenedor cambia de tamaño con la orientación (pantalla completa ↔ pantalla del deck Game Boy)
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
  if (ro) ro.observe(root);
  window.addEventListener("resize", resize);
  resize();

  P.pos.set(START.x, START.y, START.z);
  P.yaw = START.yaw;
  if (import.meta.env && import.meta.env.DEV) window.__doodle = { P, G, mp, net, input, scene, camera, shadow, sticker, get enemies() { return enemies; }, get state() { return state; }, get noLock() { return noLock; } };
  let raf = 0, prev = performance.now(), acc = 0, wall = 0;
  let lastRaf = performance.now();
  let lastHello = -99;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    lastRaf = performance.now();
    const dt = Math.min(0.1, (now - prev) / 1000);
    prev = now;
    wall += dt;
    pollGamepad();
    if (getChar) {
      const c = getChar();
      if (c && char && c.id !== char.id) { setChar(c); showMsg("", `${c.emoji} ${c.name} entra en juego`, 1.4); }
    }
    if (state === "play" || (mp.on && state === "pause")) {
      acc += dt;
      while (acc >= STEP) { step(STEP); acc -= STEP; }
    } else {
      acc = 0;
      if (state === "start") { P.yaw += dt * 0.12; } // vuelta lenta de presentación
    }
    updateFx(state === "play" || state === "win" ? dt : 0);
    updateCamera(state === "play" ? dt : 0);
    if (camMode === "third") {
      P.fireT -= dt;
      sticker.update(state === "play" ? dt : 0, {
        pos: P.pos, camera, moveX: P.moveX, speed: Math.hypot(P.vel.x, P.vel.z),
        onGround: P.onGround, firing: P.fireT > 0, hurt: Math.min(1, G.hurt * 1.5)
      });
      const gy = groundAt(P.pos.x, P.pos.z, P_RADIUS, P.pos.y + 0.01);
      const lift = clamp(1 - (P.pos.y - gy) / 3, 0.35, 1);
      shadow.position.set(P.pos.x, gy + 0.02, P.pos.z);
      shadow.scale.set(0.9 * lift, 0.55 * lift, 1);
    }
    // puertas automáticas: se abren si hay alguien cerca (tú, compañeros o enemigos)
    const near = [P.pos];
    for (const e of enemies) if (!e.dead) near.push(e.pos);
    mp.remotes.forEach((r) => near.push(r.pos));
    updateDoors(dt, near);
    // Victoria saluda desde recepción
    const vd = Math.hypot(P.pos.x - victoria.group.position.x, P.pos.z - victoria.group.position.z);
    victoria.update(dt, vd < 14 && P.pos.y < 2 ? P.pos : null, vd < 6 && P.pos.y < 2);
    if (state === "play" && vd < 4.5 && P.pos.y < 2 && wall - lastHello > 25) {
      lastHello = wall;
      showMsg("", "Victoria: ¡Hola! Bienvenido a CINK 👋 La escalera, a la izquierda; la cocina y el patio, al fondo; Clevergy, en la 1ª, por la puerta de la derecha.", 4.5);
    }
    // María Eugenia teje en su balcón; si la miras desde la oficina de Clevergy, te saluda
    mariaEugenia.update(dt);
    tendedora.update(dt);
    // el señor de las vending protesta si te pones en medio
    const sd = Math.hypot(P.pos.x - senor.group.position.x, P.pos.z - senor.group.position.z);
    senor.update(dt, sd < 6 && P.pos.y < 2 ? P.pos : null, sd < 2.4 && P.pos.y < 2);
    if (state === "play" && sd < 2.4 && P.pos.y < 2 && wall - lastSenor > 7) {
      lastSenor = wall;
      const quejas = ["¡Oiga, que está usted en medio!", "¿Pero no ve que estoy sacando el café?", "¡Hay que ver la juventud, siempre con prisas!", "¡Que me tapa las ChocoBom, hombre!"];
      showMsg("", "Señor: " + quejas[(Math.random() * quejas.length) | 0], 3);
    }
    const inClevergy = P.pos.x > 9.6 && P.pos.x < 20 && P.pos.z > -12 && P.pos.z < 6 && P.pos.y > F1_Y - 0.5 && P.pos.y < F1_Y + 2;
    if (state === "play" && inClevergy && wall - lastMaria > 18) {
      _v3.set(mariaEugenia.group.position.x - camera.position.x, mariaEugenia.group.position.y + 1.6 - camera.position.y, mariaEugenia.group.position.z - camera.position.z).normalize();
      camera.getWorldDirection(_v2);
      if (_v2.dot(_v3) > 0.975) {
        lastMaria = wall;
        mariaEugenia.greet();
        showMsg("", "María Eugenia: ¡Hola, hijos! ¿Ya habéis comido? Que trabajáis mucho 🧶👋", 4);
      }
    }
    // la foto sólo se ve si no hay una pared por medio (desde dentro de la oficina o por los cristales)
    packs.visible = camera.position.y < 3 && camera.position.z > _packP.z && camera.position.distanceTo(_packP) < 16 && hasLOS(camera.position, _packP);
    photo.visible = Math.abs(camera.position.y - clevergyPhoto.y) < 3.5 && camera.position.distanceTo(_photoP) < 22 && hasLOS(camera.position, _photoP);
    netTick(dt);
    updateRemotes(state === "start" ? 0 : dt);
    updateTeam(dt);
    updateHud(dt);
    R.render(scene, camera, {
      time: wall,
      hurt: G.hurt,
      lowHp: state === "play" && P.hp <= 30 ? 1 : 0,
      flash: G.flash
    }, overlay);
  }
  raf = requestAnimationFrame(frame);

  // con la pestaña en segundo plano el navegador congela requestAnimationFrame (y frena los
  // temporizadores a ~1 por segundo); en sala seguimos simulando para no parar la partida de todos.
  // Sólo actúa si el bucle principal lleva un rato parado, para no simular dos veces.
  let lastBg = performance.now();
  const bgTimer = setInterval(() => {
    const now = performance.now();
    if (!mp.on || now - lastRaf < 300) { lastBg = now; return; }
    const dt = Math.min(1, (now - lastBg) / 1000);
    lastBg = now;
    prev = now;
    if (state === "play" || state === "pause") {
      acc += dt;
      while (acc >= STEP) { step(STEP); acc -= STEP; }
    }
    mp.netT = 1;
    netTick(dt);
  }, 50);

  // ── salida y limpieza ──
  let destroyed = false;
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    clearInterval(bgTimer);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("pointerlockchange", onLockChange);
    document.removeEventListener("pointerlockerror", onLockError);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("resize", resize);
    if (ro) ro.disconnect();
    net.destroy();
    [...mp.remotes.keys()].forEach(removeRemote);
    if (document.pointerLockElement) document.exitPointerLock();
    relabels.forEach(([el, text]) => (el.textContent = text));
    document.body.classList.remove("doodle-mode");
    audio.destroy();
    sticker.dispose();
    if (touchPad) touchPad.destroy();
    R.dispose();
    root.remove();
    if (window.__doodle) delete window.__doodle;
  }
  function exit() {
    if (state === "play" || state === "pause") reportScore(false, "");
    destroy();
    if (onExit) onExit();
  }

  return { destroy, exit, setChar, toggleCam };
}
