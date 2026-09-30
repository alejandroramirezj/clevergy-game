// =============================================================================
// doodlePlatform.js — MUNDO 1 · CAMPUS MADRID (plataformas 2.5D dibujadas a boli)
// Mismo motor visual que el resto de mundos 3D: render de boli, pegatinas y el
// mando común. Mecánicas: salto variable, "coyote time", búfer de salto, salto en
// pared, pisotón, bloques ? y ladrillos, muelles, plataformas móviles, puntos de
// control, sillas plegables que se hunden, rejillas de ventilación que te suben,
// pufs que rebotan, 3 disquetes secretos, el jefe EMAIL CHAIN en el escenario del
// Demo Day y la bandera de INBOX ZERO. Cada personaje recupera su poder original
// del plataformas clásico (José Luis imprime plataformas, Paloma vuela, Ana trepa…).
// =============================================================================

import * as THREE from "three";
import { createDoodleRenderer, INK, mat } from "../doodleRender.js";
import { DoodleAudio } from "../doodleAudio.js";
import { GEO } from "../doodleLevel.js";
import { createSticker } from "../doodleSticker.js";
import { createTouchPad, ICON } from "../touchPad.js";
import { makeEmail, makeMeeting, makeClock, makeBoss } from "../doodleActors.js";
import { inkText, cinkLogo } from "../inkText.js";
import { touch as mando } from "../../engine/input.js";
import { CHARS, POWER_INFO } from "../../config/characters.js";
import { getCharacterAvatar } from "../../engine/sprites.js";
import { makeLevel, LEVEL_W, LEVEL_H } from "./platformLevel.js";
import { buzz } from "../haptics.js";
import "../doodle.css";
import "../fight/fight.css";
import "./platform.css";

const STEP = 1 / 60;
const GRAV = 34;
const PW = 0.78, PH = 1.7;
const COYOTE = 0.1, BUFFER = 0.13;
const MAX_FALL = 22;
const HEARTS = 3;
const SAVE_KEY = "clevergy_oficina_cp";
// las oficinas por las que ha pasado Clevergy, en orden
const ZONES = [
  { x: 258, t: "WAYRA", s: "Edificio Telefónica · Gran Vía 28 · sube a la 8ª planta" },
  { x: 364, t: "CINK COWORKING", s: "Infanta Mercedes · la casa de Clevergy" }
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const charById = (id) => CHARS.find((c) => c.id === id) || CHARS[0];
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const TEMPLATE = `
<canvas class="dd-canvas"></canvas>
<div class="pf-hud hidden">
  <div class="pf-tl">
    <div class="pf-hearts"></div>
    <div class="pf-stats"><span class="pf-coins">🪙 0</span><span class="pf-frags">💾 0/3</span><span class="pf-time">0:00</span></div>
    <div class="pf-power"><span class="pf-power-name"></span><div class="pf-power-bar"><i></i></div></div>
  </div>
  <div class="pf-score">0</div>
  <div class="pf-boss hidden"><div class="pf-boss-name">📨 EMAIL CHAIN</div><div class="pf-boss-bar"><i></i></div></div>
  <div class="pf-big"></div>
  <div class="pf-msg"></div>
  <div class="dd-hudbtns">
    <button class="dd-hb pf-swapbtn" aria-label="Cambiar de compañero">${ICON.swap}<small>EQUIPO</small></button>
    <button class="dd-hb pf-pausebtn" aria-label="Pausa">❚❚</button>
  </div>
</div>

<div class="dd-ov pf-start">
  <div class="dd-card pf-card">
    <div class="pf-col">
      <div class="dd-kicker">MUNDO 1 · GOOGLE FOR STARTUPS CAMPUS</div>
      <h1 class="pf-title">La Oficina</h1>
      <p class="pf-lead">El viaje de Clevergy: de <b>Google for Startups Campus</b> a <b>Wayra</b> (Edificio Telefónica, Gran Vía) y al <b>CINK</b> de Infanta Mercedes, donde espera <b>EMAIL CHAIN</b> antes de llegar a la oficina.</p>
      <div class="pf-picker">
        <button class="cf-arrow pf-arrow" data-d="-1" aria-label="Anterior">◀</button>
        <div class="pf-preview"><img class="cf-sticker pf-sticker" alt=""><div class="cf-pname pf-pname"></div><div class="cf-pspecial pf-pspecial"></div></div>
        <button class="cf-arrow pf-arrow" data-d="1" aria-label="Siguiente">▶</button>
      </div>
    </div>
    <div class="pf-col">
      <div class="pf-howto">
        <div><b>Salta</b> más alto si mantienes el botón · <b>rebota</b> en las paredes</div>
        <div><b>Pisa</b> a los enemigos · rompe <b>ladrillos</b> y abre bloques <b>?</b> con la cabeza</div>
        <div><b>Poder</b>: el de siempre de cada uno — José Luis imprime plataformas, Paloma vuela, Ana trepa…</div>
        <div>Ojo con las <b>sillas plegables</b>; las <b>rejillas</b> te suben y los <b>pufs</b> rebotan</div>
      </div>
      <div class="pf-help dd-desktop-only">A/D mover · Espacio/W saltar · J poder · S bajar · Tab compañero · Esc pausa · 🎮 mando</div>
      <div class="dd-btns">
        <button class="dd-btn pf-go">¡A jugar!</button>
        <button class="dd-btn pf-continue hidden"></button>
        <button class="dd-btn dd-ghost pf-exit">Volver al mapa</button>
      </div>
    </div>
  </div>
</div>

<div class="dd-ov dd-pause pf-pause hidden">
  <div class="dd-card dd-small">
    <h2>Pausa</h2>
    <div class="dd-btns">
      <button class="dd-btn pf-resume">Seguir</button>
      <button class="dd-btn dd-ghost pf-restart">Reiniciar</button>
      <button class="dd-btn dd-ghost pf-quit">Salir al mapa</button>
    </div>
  </div>
</div>

<div class="dd-ov pf-end hidden">
  <div class="dd-card dd-small">
    <div class="dd-kicker pf-end-kicker"></div>
    <h2 class="pf-end-title"></h2>
    <div class="dd-end-stats pf-end-stats"></div>
    <div class="dd-btns">
      <button class="dd-btn pf-retry"></button>
      <button class="dd-btn dd-ghost pf-tomap">Volver al mapa</button>
    </div>
  </div>
</div>`;

export function startDoodlePlatform({ charId, getChar, onSwitchChar, onPickChar, onExit, onVictory } = {}) {
  const root = document.createElement("div");
  root.id = "doodleRoot";
  root.className = "pf-root";
  root.innerHTML = TEMPLATE;
  (document.getElementById("wrap") || document.body).appendChild(root);
  document.body.classList.add("doodle-mode");
  const $ = (s) => root.querySelector(s);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  root.classList.toggle("dd-is-touch", isTouch);

  const canvas = $(".dd-canvas");
  const R = createDoodleRenderer(canvas, { fadeScale: 1.8 });
  const audio = new DoodleAudio();
  const scene = new THREE.Scene();
  const overlay = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);
  scene.add(camera);

  // ── estado ──
  let screen = "start"; // start | play | pause | end
  let char = charById(charId);
  let cdMax = Math.max(0.3, char.cd || 0.6);
  let L = null; // nivel (se regenera al reiniciar)
  const levelRoot = new THREE.Group();
  scene.add(levelRoot);
  const P = {
    x: 3, y: 2, vx: 0, vy: 0, g: false, facing: 1, coyote: 0, buf: 0, wall: 0, wallT: 0, jumpHeld: false,
    hearts: HEARTS, inv: 0, dead: 0, cd: 0, dashT: 0, dashV: 0, dashFloat: false, slam: 0, shieldT: 0, riseT: 0, squash: 1, flash: 0, onMover: null,
    lockT: 0, fly: 1, energy: 1, ball: false, mega: 0, zenT: 0, buffT: 0, climb: false, prevY: 2, onPrint: null,
    coins: 0, frags: new Set(), zones: new Set(), cp: 3, score: 0, time: 0, won: false, stomps: 0, pose: "idle", poseT: 0
  };
  let enemies = [], shots = [], powers = [], pickups = [], pops = [], minions = [], prints = [], rings = [];
  let boss = null, bossDone = false, bossWalls = [];
  const sticker = createSticker(overlay, { height: 1.95 });
  const shadow = new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  function setChar(c) {
    char = c;
    cdMax = Math.max(0.3, c.cd || 0.6);
    P.cd = Math.min(P.cd, 0.5);
    P.ball = false; P.climb = false;
    sticker.setChar(c.id);
    $(".pf-power-name").textContent = `★ ${c.ab}`;
  }
  setChar(char);
  const speedMax = () => (7.6 + ((char.spd || 3.5) - 3.5) * 0.9) * (P.buffT > 0 ? 1.4 : 1) * (P.ball ? 1.35 : 1);
  const jumpV = () => 15.4 + ((char.jump || 9.5) - 9.5) * 0.45;

  // ── sonido ──
  const sfx = {
    jump: () => audio.tone({ freq: 360, to: 720, dur: 0.12, type: "square", gain: 0.08 }),
    coin: () => { audio.tone({ freq: 988, dur: 0.06, type: "square", gain: 0.07 }); audio.tone({ freq: 1319, dur: 0.14, type: "square", gain: 0.07, delay: 0.06 }); },
    bump: () => audio.tone({ freq: 180, to: 120, dur: 0.08, type: "square", gain: 0.1 }),
    brick: () => audio.noise({ dur: 0.25, gain: 0.3, filter: "lowpass", freq: 1800, to: 200 }),
    stomp: () => { audio.tone({ freq: 500, to: 150, dur: 0.12, type: "square", gain: 0.12 }); audio.noise({ dur: 0.08, gain: 0.15, filter: "lowpass", freq: 900 }); },
    hurt: () => audio.hurt(),
    power: () => audio.noise({ dur: 0.25, gain: 0.25, filter: "bandpass", freq: 500, to: 2600, q: 1 }),
    spring: () => audio.tone({ freq: 200, to: 900, dur: 0.3, type: "triangle", gain: 0.14 }),
    item: () => [0, 0.07, 0.14].forEach((d, i) => audio.tone({ freq: 660 + i * 220, dur: 0.1, type: "triangle", gain: 0.1, delay: d })),
    frag: () => [72, 76, 79, 84].forEach((n, i) => audio.tone({ freq: 440 * Math.pow(2, (n - 69) / 12), dur: 0.14, type: "triangle", gain: 0.12, delay: i * 0.08 })),
    wall: () => audio.noise({ dur: 0.05, gain: 0.08, filter: "highpass", freq: 2500 })
  };

  // ── construcción del nivel ──
  const tileMesh = new Map(); // "x,y" → mesh (ladrillos y bloques ? que cambian)
  const T = (x, y) => (L ? L.tiles.get(`${x},${y}`) : null);
  const solidT = (t) => t && !t.down && (t.t === "g" || t.t === "s" || t.t === "k" || t.t === "b" || t.t === "q" || t.t === "u" || t.t === "w" || t.t === "c");
  function box(parent, x, y, z, w, h, d, ink, o = {}) {
    const m = new THREE.Mesh(GEO.box, mat(ink, o));
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function qBlockMesh(x, y, used) {
    const g = new THREE.Group();
    g.position.set(x + 0.5, y + 0.5, 0);
    box(g, 0, 0, 0, 1, 1, 1.6, used ? INK.BLACK : INK.ORANGE, { tone: used ? -0.1 : -0.28 });
    if (!used) {
      // un "?" hecho con trazos
      box(g, 0, 0.22, 0.81, 0.36, 0.1, 0.02, INK.BLACK, { fill: true });
      box(g, 0.14, 0.1, 0.81, 0.1, 0.3, 0.02, INK.BLACK, { fill: true });
      box(g, 0.02, -0.04, 0.81, 0.1, 0.18, 0.02, INK.BLACK, { fill: true });
      box(g, 0.02, -0.28, 0.81, 0.1, 0.1, 0.02, INK.BLACK, { fill: true });
    }
    levelRoot.add(g);
    return g;
  }
  function brickMesh(x, y) {
    const g = new THREE.Group();
    g.position.set(x + 0.5, y + 0.5, 0);
    box(g, 0, 0, 0, 1, 1, 1.6, INK.RED, { tone: -0.24 });
    box(g, 0, 0, 0.81, 1.0, 0.06, 0.02, INK.RED, { fill: true });
    box(g, -0.15, 0.25, 0.81, 0.06, 0.5, 0.02, INK.RED, { fill: true });
    box(g, 0.25, -0.25, 0.81, 0.06, 0.5, 0.02, INK.RED, { fill: true });
    levelRoot.add(g);
    return g;
  }
  function chairMesh(x, y) {
    // silla plegable del coworking: asiento, respaldo y patas en tijera
    const g = new THREE.Group();
    g.position.set(x + 0.5, y, 0);
    box(g, 0, 0.9, 0, 0.96, 0.18, 1.3, INK.ORANGE, { tone: -0.12 });
    box(g, 0, 1.45, -0.62, 0.9, 0.7, 0.1, INK.ORANGE, { tone: -0.18 });
    for (const s of [-1, 1]) { const l = box(g, 0, 0.42, s * 0.45, 0.07, 0.95, 0.07, INK.BLACK, { fill: true }); l.rotation.z = s * 0.35; const l2 = box(g, 0, 0.42, s * 0.45, 0.07, 0.95, 0.07, INK.BLACK, { fill: true }); l2.rotation.z = -s * 0.35; }
    levelRoot.add(g);
    return g;
  }
  // altura del suelo más alto en la columna x (para reaparecer y colocar cosas)
  function surfaceAt(x) {
    const tx = Math.floor(x);
    for (let y = LEVEL_H + 2; y >= 0; y--) { const t = T(tx, y); if (solidT(t) || (t && t.t === "p")) return y + 1; }
    return 2;
  }
  // palabra con los colores de Google, letra a letra
  const GCOLS = [INK.BLUE, INK.RED, INK.ORANGE, INK.BLUE, INK.GREEN, INK.RED];
  function gword(text, size) {
    const g = new THREE.Group();
    const u = size / 6, adv = 5.6 * u, width = text.length * adv - 1.6 * u;
    [...text].forEach((ch, i) => {
      if (ch === " ") return;
      const t = inkText(ch, { size, ink: GCOLS[i % GCOLS.length], weight: 1.25 });
      t.position.x = -width / 2 + i * adv + 2 * u;
      g.add(t);
    });
    return g;
  }
  function disc(parent, x, y, z, r, ink, o = {}) {
    const m = new THREE.Mesh(GEO.cyl, mat(ink, o));
    m.scale.set(r * 2, 0.06, r * 2);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  function buildDecor(d) {
    const g = new THREE.Group();
    g.position.set(d.x, d.y ?? 2, -3.2);
    levelRoot.add(g);
    const t = d.type;
    if (t === "skyline") {
      // Madrid al fondo: tejados, la Almudena y el Palacio Real (se ven desde la calle y la salida)
      g.position.set(0, 0, -46);
      for (let x = -30; x < LEVEL_W + 40; x += rnd(5, 9)) {
        const h = rnd(8, 18);
        box(g, x, h / 2, rnd(-6, 0), rnd(5, 8), h, 3, INK.BLACK, { tone: 0.44 });
        box(g, x, h + 0.6, 0, rnd(4, 6), 1.2, 3.4, INK.RED, { tone: 0.32 }); // tejado
      }
      const pal = new THREE.Group(); pal.position.set(232, 0, 6); g.add(pal);
      box(pal, 0, 9, 0, 56, 18, 8, INK.BLACK, { tone: 0.5 });
      box(pal, 0, 18.6, 0, 58, 1.2, 8.6, INK.BLACK, { tone: 0.3 }); // cornisa con balaustrada
      for (let x = -27; x <= 27; x += 2.2) box(pal, x, 11, 4.1, 0.5, 11, 0.4, INK.BLACK, { tone: 0.38 }); // columnas
      for (let x = -26; x <= 26; x += 4.4) for (const y of [4, 9, 14]) box(pal, x, y, 4.05, 1.4, 2.4, 0.1, INK.BLUE, { tone: 0.2 });
      box(pal, 0, 21, 0, 12, 4, 6, INK.BLACK, { tone: 0.45 });
      const flagP = box(pal, 0, 25, 0, 0.2, 4, 0.2, INK.BLACK, { fill: true });
      box(pal, 1, 26, 0, 2, 1.2, 0.05, INK.RED, { tone: 0.1 });
      const alm = new THREE.Group(); alm.position.set(180, 0, 2); g.add(alm);
      box(alm, 0, 8, 0, 16, 16, 10, INK.BLACK, { tone: 0.48 });
      const dome = new THREE.Mesh(GEO.sph, mat(INK.BLUE, { tone: 0.12 })); dome.scale.set(8, 8, 8); dome.position.y = 19; alm.add(dome);
      box(alm, 0, 24, 0, 0.3, 2.4, 0.3, INK.BLACK, { fill: true }); box(alm, 0, 24.4, 0, 1.2, 0.3, 0.3, INK.BLACK, { fill: true });
      for (const s of [-6, 6]) { box(alm, s, 12, 5, 3, 24, 3, INK.BLACK, { tone: 0.42 }); const c = new THREE.Mesh(GEO.cone, mat(INK.BLUE, { tone: 0.15 })); c.scale.set(2.2, 3, 2.2); c.position.set(s, 25.5, 5); alm.add(c); }
      void flagP;
    } else if (t === "gsign") {
      g.position.z = -6.05;
      const w = gword("GOOGLE", 1.5); w.position.set(0, 8.9, 0); g.add(w);
      const f = inkText("FOR STARTUPS", { size: 0.62, ink: INK.BLACK, weight: 1.1 }); f.position.set(0, 7.5, 0); g.add(f);
      const c = inkText("CAMPUS MADRID", { size: 0.45, ink: INK.BLACK }); c.position.set(0, 6.6, 0); g.add(c);
    } else if (t === "umbrella") {
      box(g, 0.5, 1.4, 2.4, 0.12, 2.9, 0.12, INK.BLACK, { fill: true });
      box(g, 0.5, 0.45, 2.4, 1.2, 0.08, 1.2, INK.BLACK, { tone: 0.1 }); // mesa
      for (const s of [-0.9, 1.9]) box(g, s, 0.35, 2.4, 0.5, 0.7, 0.5, INK.GREEN, { tone: 0.05 }); // sillas
      box(g, 0.5, 2.95, 3.2, 3.4, 0.14, 2.2, INK.RED, { tone: -0.05 }); // la lona (la plataforma)
      for (let k = 0; k < 4; k++) box(g, -1.05 + k * 1.03, 2.84, 4.31, 0.5, 0.22, 0.02, INK.RED, { fill: true });
    } else if (t === "bikes") {
      for (let k = 0; k < 3; k++) {
        const b = new THREE.Group(); b.position.set(k * 1.6, 0, 0.5); g.add(b);
        for (const s of [-0.5, 0.5]) { const w = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { fill: true })); w.scale.setScalar(0.42); w.position.set(s, 0.42, 0); b.add(w); }
        const fr = box(b, 0, 0.7, 0, 1.1, 0.08, 0.08, INK.RED, { fill: true }); fr.rotation.z = 0.2;
        box(b, 0.45, 0.95, 0, 0.08, 0.5, 0.08, INK.BLACK, { fill: true });
        box(b, 0.45, 1.25, 0.12, 0.5, 0.3, 0.3, INK.RED, { tone: 0 }); // cesta BiciMAD
      }
      box(g, 1.6, 0.6, -0.4, 5, 1.2, 0.3, INK.BLACK, { tone: 0.2 }); // anclaje
    } else if (t === "door") {
      g.position.z = -6.1;
      box(g, 0, 1.6, 0, 2.6, 3.2, 0.06, INK.BLACK, { tone: 0.05 });
      disc(g, 0, 3.2, 0, 1.3, INK.BLACK, { tone: 0.05 });
      box(g, 0, 1.6, 0.06, 0.08, 3.2, 0.04, INK.BLACK, { fill: true });
      box(g, 0, -0.1, 0.1, 3.4, 0.2, 0.3, INK.RED, { tone: -0.05 });
    } else if (t === "tiles") {
      // baldosa hidráulica del café, a cuadros
      for (let k = 0; k < (d.w || 20); k += 2) box(g, k + 0.5, -0.94, 3.2, 1, 0.03, 3.6, k % 4 ? INK.BLACK : INK.ORANGE, { tone: 0.3 });
    } else if (t === "espresso") {
      g.position.z = 0;
      box(g, 0, 1.45, -0.3, 1.8, 0.9, 0.9, INK.BLACK, { tone: -0.1 });
      box(g, 0, 1.95, -0.3, 1.9, 0.12, 1, INK.ORANGE, { fill: true });
      for (const s of [-0.5, 0.5]) box(g, s, 1.12, 0.1, 0.14, 0.2, 0.14, INK.BLACK, { fill: true });
      for (let k = 0; k < 4; k++) box(g, -1.2 + k * 0.8, 1.14, 0.55, 0.22, 0.26, 0.22, INK.GREEN, { tone: 0.2 });
      const cs = inkText("CAMPUS CAFE", { size: 0.5, ink: INK.GREEN }); cs.position.set(0, 4.3, -2.8); g.add(cs);
      box(g, 0, 4.3, -2.9, 4.4, 1.1, 0.05, INK.BLACK, { tone: 0.35 });
    } else if (t === "sofa") {
      box(g, 0, 0.35, 0, 2.8, 0.7, 1.2, INK.BLUE, { tone: -0.05 });
      box(g, 0, 0.9, -0.5, 2.8, 0.9, 0.3, INK.BLUE, { tone: -0.1 });
      for (const s of [-1.4, 1.4]) box(g, s, 0.6, 0, 0.3, 0.7, 1.2, INK.BLUE, { tone: -0.15 });
      box(g, 0.6, 0.85, -0.2, 0.6, 0.5, 0.2, INK.ORANGE, { tone: 0.1 }); // cojín
    } else if (t === "lamp") {
      box(g, 0, 1.4, 0, 0.08, 2.8, 0.08, INK.BLACK, { fill: true });
      const c = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { tone: 0.1 })); c.scale.set(0.9, 0.7, 0.9); c.position.y = 2.9; g.add(c);
      box(g, 0, 0.05, 0, 0.7, 0.1, 0.7, INK.BLACK, { fill: true });
    } else if (t === "beam") {
      // viga de hierro roblonada de la fábrica, bajo el forjado
      g.position.z = 0;
      box(g, 0, -0.35, -0.2, d.w || 26, 0.3, 0.5, INK.BLACK, { tone: -0.1 });
      for (let k = -12; k <= 12; k += 3) box(g, k, -0.35, 0.06, 0.1, 0.1, 0.02, INK.BLACK, { fill: true });
    } else if (t === "vent") {
      g.position.z = 0;
      box(g, 3, 0.08, 0, 7, 0.16, 1.8, INK.BLACK, { tone: 0.05 });
      for (let k = 0; k < 7; k++) box(g, k + 0.5, 0.18, 0, 0.1, 0.06, 1.7, INK.BLACK, { fill: true });
      L.ventFans = L.ventFans || [];
      const fan = new THREE.Group(); fan.position.set(3, 0.3, -1.2); g.add(fan);
      for (let k = 0; k < 3; k++) { const b = box(fan, 0, 0, 0, 0.3, 1.4, 0.05, INK.BLUE, { tone: 0.05 }); b.rotation.z = k * Math.PI / 3; }
      L.ventFans.push(fan);
    } else if (t === "pipes") {
      g.position.z = -5.8;
      for (const [s, ink] of [[0, INK.RED], [0.9, INK.BLUE], [1.8, INK.GREEN]]) {
        const p = new THREE.Mesh(GEO.cyl, mat(ink, { tone: 0.05 })); p.scale.set(0.35, 28, 0.35); p.position.set(s, 12, 0); g.add(p);
      }
    } else if (t === "glassroom") {
      // sala de reuniones acristalada (con su nombre en el cristal)
      box(g, 0, 1.6, 0, 6, 3.2, 3, INK.BLUE, { tone: 0.38 });
      for (const s of [-3, 0, 3]) box(g, s, 1.6, 1.52, 0.1, 3.2, 0.06, INK.BLACK, { fill: true });
      box(g, 0, 3.2, 1.52, 6.1, 0.1, 0.06, INK.BLACK, { fill: true });
      box(g, 0, 0.75, 0, 3, 0.1, 1.2, INK.BLACK, { tone: 0.15 });
      const n = inkText(d.x < 160 ? "SALA SOL" : "SALA LATINA", { size: 0.32, ink: INK.BLUE }); n.position.set(0, 2.6, 1.56); g.add(n);
    } else if (t === "seats") {
      g.position.z = 0;
      box(g, 0.5, 0.3, 0.8, 1.6, 0.6, 0.7, INK.RED, { tone: -0.05 });
      box(g, 0.5, 0.75, 0.45, 1.6, 0.6, 0.12, INK.RED, { tone: -0.12 });
    } else if (t === "screen") {
      g.position.z = -6;
      box(g, 0, 7, 0, 14, 7, 0.1, INK.BLACK, { tone: 0.1 });
      box(g, 0, 7, 0.06, 13, 6.2, 0.02, INK.BLUE, { tone: 0.35 });
      const w = gword("DEMO DAY", 1.3); w.position.set(0, 8, 0.1); g.add(w);
      const s = inkText("CAMPUS MADRID", { size: 0.5, ink: INK.BLACK }); s.position.set(0, 6.3, 0.1); g.add(s);
      box(g, 0, 0.5, 5, 9, 1, 1.4, INK.BLACK, { tone: 0.05 }); // atril y tarima
    } else if (t === "spot") {
      g.position.z = -1.5;
      box(g, 0, 11, 0, 0.1, 2, 0.1, INK.BLACK, { fill: true });
      const c = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { tone: 0.3 })); c.scale.set(1.4, 9, 1.4); c.position.y = 5.5; g.add(c);
    } else if (t === "campus") {
      box(g, 0, 2.6, 0, 0.16, 5.2, 0.16, INK.BLACK, { fill: true });
      box(g, 0, 5.2, 0, 5.4, 2.2, 0.12, INK.BLACK, { tone: 0.35 });
      const w = gword("CAMPUS", 0.8); w.position.set(0, 5.6, 0.1); g.add(w);
      const m = inkText("MADRID", { size: 0.5, ink: INK.BLACK }); m.position.set(0, 4.6, 0.1); g.add(m);
    } else if (t === "arrow") {
      // señal de calle hacia el siguiente sitio
      box(g, 0, 1.6, 0.8, 0.14, 3.2, 0.14, INK.BLACK, { fill: true });
      box(g, 0.9, 3.2, 0.8, 3.6, 0.9, 0.1, INK.BLUE, { tone: -0.1 });
      box(g, 2.9, 3.2, 0.8, 0.5, 0.5, 0.1, INK.BLUE, { tone: -0.1 }).rotation.z = Math.PI / 4;
      const tx = inkText(d.label || "", { size: 0.42, ink: INK.BLACK }); tx.position.set(0.9, 3.2, 0.9); g.add(tx);
    } else if (t === "granvia") {
      // Gran Vía: fachadas con cornisas y cúpulas, y el luminoso de Schweppes en Callao
      g.position.set(d.x, 0, -14);
      for (let k = 0; k < 9; k++) {
        const bx = k * 12, h = 16 + (k % 3) * 5;
        box(g, bx, h / 2, 0, 11, h, 4, k % 2 ? INK.ORANGE : INK.BLACK, { tone: 0.42 });
        for (let r = 0; r < Math.floor(h / 3.4) - 1; r++) for (let c = -1; c <= 1; c++) box(g, bx + c * 3.2, 3 + r * 3.4, 2.02, 1.3, 1.9, 0.05, INK.BLUE, { tone: 0.3 });
        box(g, bx, h + 0.3, 0, 11.6, 0.6, 4.4, INK.BLACK, { tone: 0.2 });
        if (k % 4 === 1) { const c = new THREE.Mesh(GEO.sph, mat(INK.BLACK, { tone: 0.25 })); c.scale.set(5, 4, 4); c.position.set(bx, h + 1.5, 0); g.add(c); }
      }
      // el cartel de Schweppes sobre el edificio Carrión
      box(g, 24, 29.5, 2.2, 13, 3.2, 0.2, INK.BLACK, { fill: true });
      const sch = inkText("SCHWEPPES", { size: 1.9, ink: INK.ORANGE, weight: 1.4 }); sch.position.set(24, 29.5, 2.4); g.add(sch);
      const gv = inkText("GRAN VIA", { size: 0.9, ink: INK.RED }); gv.position.set(6, 7.2, 2.1); g.add(gv);
    } else if (t === "metro") {
      box(g, 0, 1.8, 1.2, 0.12, 3.6, 0.12, INK.RED, { fill: true });
      box(g, 0, 3.8, 1.2, 2.6, 0.9, 0.12, INK.RED, { tone: -0.05 });
      const m = inkText("METRO", { size: 0.5, ink: INK.BLUE }); m.position.set(0, 3.8, 1.3); g.add(m);
      box(g, 2.5, 0.2, 1.4, 3.2, 0.4, 2, INK.BLACK, { tone: 0.3 }); // boca del metro
    } else if (t === "telefonica") {
      // el Edificio Telefónica (Gran Vía 28), el primer rascacielos de Europa: cuerpo escalonado y torre
      g.position.set(d.x, 0, -5.5);
      box(g, 0, 12, 0, 46, 24, 4, INK.BLACK, { tone: 0.5 });
      box(g, 0, 27, -0.5, 30, 6, 3, INK.BLACK, { tone: 0.45 });
      box(g, 0, 32, -1, 14, 5, 2.4, INK.BLACK, { tone: 0.42 });
      box(g, 0, 36, -1, 5, 4, 2, INK.BLACK, { tone: 0.38 });
      box(g, 0, 39.5, -1, 0.3, 3, 0.3, INK.BLACK, { fill: true });
      for (let r = 0; r < 7; r++) for (let c = -5; c <= 5; c++) box(g, c * 4, 2.5 + r * 3, 2.02, 1.5, 2, 0.05, INK.BLUE, { tone: 0.3 });
      disc(g, 0, 33, 1.3, 1.3, INK.BLACK, { tone: 0.55 }); // el reloj
      const tl = inkText("TELEFONICA", { size: 1.2, ink: INK.BLUE, weight: 1.2 }); tl.position.set(0, 25.2, 1.1); g.add(tl);
    } else if (t === "wayra") {
      g.position.z = -1.8;
      box(g, 0, 3.4, -0.6, 32, 7, 0.2, INK.BLACK, { tone: 0.55 }); // la pared de la 8ª planta
      const w = gword("WAYRA", 1.6); w.position.set(0, 5.2, -0.4); g.add(w);
      const sub = inkText("TELEFONICA · 8 PLANTA", { size: 0.4, ink: INK.BLACK }); sub.position.set(0, 3.9, -0.4); g.add(sub);
      for (const x of [-12, 12]) { box(g, x, 1.6, -0.4, 4, 2.4, 0.06, INK.BLUE, { tone: 0.3 }); }
    } else if (t === "pingpong") {
      g.position.z = 0;
      box(g, 0.5, 1.02, 0, 3, 0.06, 1.8, INK.GREEN, { tone: -0.1 });
      box(g, 0.5, 1.3, 0, 0.05, 0.5, 1.8, INK.BLACK, { tone: 0.5 }); // la red
      const ball = new THREE.Mesh(GEO.sph, mat(INK.ORANGE, { tone: 0.3 })); ball.scale.setScalar(0.18); ball.position.set(1.2, 1.5, 0); g.add(ball);
    } else if (t === "cink") {
      // el CINK de Infanta Mercedes: esquina redonda, cristal y el logo
      g.position.set(d.x, 0, -5.8);
      box(g, 14, 9, 0, 40, 18, 3, INK.BLACK, { tone: 0.46 });
      const corner = new THREE.Mesh(GEO.cyl, mat(INK.BLUE, { tone: 0.3 })); corner.scale.set(10, 18, 10); corner.position.set(-6, 9, 0); g.add(corner);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) box(g, 2 + c * 4.4, 2.6 + r * 4.2, 1.52, 2.6, 2.6, 0.05, INK.BLUE, { tone: 0.3 });
      const logo = cinkLogo({ size: 2.4, ink: INK.BLACK }); logo.position.set(12, 15.6, 1.6); g.add(logo);
      const pm = inkText("#PEOPLEMAKECINK", { size: 0.55, ink: INK.RED }); pm.position.set(26, 1.2, 1.6); g.add(pm);
    } else if (t === "reception") {
      g.position.z = 0;
      const b = inkText("BIENVENIDO", { size: 0.35, ink: INK.BLUE }); b.position.set(0, 0.5, 0.82); g.add(b);
      // Victoria detrás del mostrador
      box(g, 0.2, 0.3, -1.2, 0.5, 0.8, 0.4, INK.RED, { tone: 0.42 });
      const h = new THREE.Mesh(GEO.sph, mat(INK.ORANGE, { tone: 0.48 })); h.scale.setScalar(0.42); h.position.set(0.2, 1.0, -1.2); g.add(h);
      const hair = new THREE.Mesh(GEO.sph, mat(INK.BLACK, { tone: -0.3 })); hair.scale.set(0.46, 0.46, 0.4); hair.position.set(0.2, 1.1, -1.3); g.add(hair);
    } else if (t === "grass") {
      g.position.z = 0;
      box(g, (d.w || 10) / 2, -0.94, 0, d.w || 10, 0.08, 3.9, INK.GREEN, { tone: -0.05 });
      for (let k = 0; k < (d.w || 10); k += 1.3) box(g, k, -0.7, 1.8, 0.06, 0.4, 0.06, INK.GREEN, { fill: true });
    } else if (t === "sala") {
      g.position.z = -6;
      box(g, 0, 5, 0, 20, 10, 0.1, INK.ORANGE, { tone: 0.3 }); // pared de acento
      box(g, 0, 5.2, 0.1, 6, 2.6, 0.06, INK.BLACK, { tone: 0.5 }); // pizarra
      const n = inkText("SALA 4 · CINK", { size: 0.7, ink: INK.BLUE }); n.position.set(0, 8.4, 0.12); g.add(n);
    } else if (t === "clevergy") {
      // la oficina de Clevergy: tres mesas, la estantería con café y la pizarra
      g.position.z = -4;
      box(g, 0, 5, -1.6, 26, 10, 0.2, INK.GREEN, { tone: 0.35 });
      const c = inkText("CLEVERGY", { size: 1.4, ink: INK.GREEN, weight: 1.3 }); c.position.set(0, 8, -1.4); g.add(c);
      for (const x of [-8, -2, 4]) {
        box(g, x, 0.8, 0, 3, 0.1, 1.4, INK.ORANGE, { tone: 0.1 });
        box(g, x, 1.35, -0.4, 1.2, 0.8, 0.06, INK.BLACK, { tone: -0.2 });
        for (const s2 of [-1.3, 1.3]) box(g, x + s2, 0.4, 0, 0.1, 0.8, 1.2, INK.BLACK, {});
      }
      box(g, 10, 1.4, -1, 2, 2.8, 0.8, INK.ORANGE, { tone: 0.05 }); // estantería del café
      for (let k = 0; k < 3; k++) box(g, 9.4 + k * 0.6, 2.95, -0.9, 0.3, 0.4, 0.3, k % 2 ? INK.RED : INK.BLUE, { tone: 0.1 });
      box(g, -3, 4.2, -1.45, 5, 2.4, 0.06, INK.BLACK, { tone: 0.5 }); // pizarra
    } else if (t === "plant") {
      box(g, 0, 0.35, 0, 0.7, 0.7, 0.7, INK.ORANGE, { tone: 0.05 });
      const s = new THREE.Mesh(GEO.sph, mat(INK.GREEN, { tone: -0.05 }));
      s.scale.setScalar(1.3); s.position.y = 1.3; g.add(s);
    }
  }
  function buildLevel() {
    // vacía el nivel anterior
    while (levelRoot.children.length) levelRoot.remove(levelRoot.children[0]);
    tileMesh.clear();
    L = makeLevel();
    // fondo: la fachada de ladrillo neomudéjar (baja en la calle, entera por dentro y
    // abierta en la salida para ver el Palacio Real), con ventanales en arco e impostas
    const IN0 = 38, IN1 = 215;
    box(levelRoot, IN0 / 2 - 15, 6, -6.4, IN0 + 30, 12, 0.4, INK.RED, { tone: 0.3 });
    box(levelRoot, (IN0 + IN1) / 2, LEVEL_H / 2, -6.4, IN1 - IN0, LEVEL_H + 4, 0.4, INK.RED, { tone: 0.14 });
    box(levelRoot, LEVEL_W / 2, 1, -4, LEVEL_W + 60, 2, 4, INK.BLACK, { tone: 0.35 });
    for (let x = -8; x < IN1; x += 7) {
      const rows = x < IN0 ? [4.4] : [4.4, 12, 19.6, 27.2];
      for (const wy of rows) {
        box(levelRoot, x, wy, -6.15, 2.2, 3.2, 0.05, INK.BLUE, { tone: 0.34 });
        disc(levelRoot, x, wy + 1.6, -6.15, 1.1, INK.BLUE, { tone: 0.34 });
        box(levelRoot, x, wy - 1.75, -6.1, 2.8, 0.22, 0.12, INK.RED, { tone: 0.02 });
        box(levelRoot, x, wy + 1.6, -6.13, 0.08, 2.2, 0.03, INK.BLACK, { fill: true });
      }
    }
    for (const y of [8.2, 15.8, 23.4, 31]) box(levelRoot, (IN0 + IN1) / 2, y, -6.12, IN1 - IN0, 0.3, 0.1, INK.RED, { tone: -0.02 });
    box(levelRoot, IN0 / 2 - 15, 11.9, -6.1, IN0 + 30, 0.4, 0.3, INK.RED, { tone: -0.05 }); // cornisa de la calle
    // casillas: agrupa tramos iguales por fila (menos objetos que dibujar)
    const done = new Set();
    L.crumbles = [];
    for (let y = 0; y < LEVEL_H; y++) {
      for (let x = -2; x < LEVEL_W + 2; x++) {
        const t = T(x, y);
        if (!t || done.has(`${x},${y}`)) continue;
        if (t.t === "b") { tileMesh.set(`${x},${y}`, brickMesh(x, y)); continue; }
        if (t.t === "c") { L.crumbles.push({ t, x, y, g: chairMesh(x, y) }); continue; }
        if (t.t === "q") { tileMesh.set(`${x},${y}`, qBlockMesh(x, y, false)); continue; }
        if (t.t === "x") {
          for (let k = 0; k < 3; k++) {
            const c = new THREE.Mesh(GEO.cone, mat(INK.BLACK, { tone: -0.15 }));
            c.scale.set(0.3, 0.7, 0.3);
            c.position.set(x + 0.2 + k * 0.3, y + 0.35, 0);
            levelRoot.add(c);
          }
          box(levelRoot, x + 0.5, y + 0.05, 0, 1, 0.1, 1.4, INK.RED, { fill: true });
          continue;
        }
        let x1 = x;
        while (T(x1 + 1, y) && T(x1 + 1, y).t === t.t && !done.has(`${x1 + 1},${y}`)) x1++;
        for (let k = x; k <= x1; k++) done.add(`${k},${y}`);
        const w = x1 - x + 1, cx = x + w / 2;
        if (t.t === "g") {
          box(levelRoot, cx, y + 0.5, 0, w, 1, 4, INK.BLACK, { tone: -0.22 });
        } else if (t.t === "s") {
          box(levelRoot, cx, y + 0.5, 0, w, 1, 2.4, INK.BLUE, { tone: -0.32 });
        } else if (t.t === "k") {
          box(levelRoot, cx, y + 0.5, 0, w, 1, 3, INK.RED, { tone: -0.2 });
          if (y % 2 === 0) box(levelRoot, cx, y + 0.02, 1.51, w, 0.05, 0.02, INK.RED, { fill: true }); // llaga del ladrillo
        } else if (t.t === "p") {
          box(levelRoot, cx, y + 0.82, 0, w, 0.36, 2, INK.GREEN, { tone: -0.25 });
        }
      }
    }
    // borde superior de los suelos y sólidos (el canto de la mesa / moqueta)
    for (let y = 0; y < LEVEL_H; y++) {
      let run = null;
      for (let x = -2; x <= LEVEL_W + 2; x++) {
        const t = T(x, y), top = t && (t.t === "g" || t.t === "s" || t.t === "k") && !solidT(T(x, y + 1));
        if (top && !run) run = { x0: x, t: t.t };
        if ((!top || (run && t && t.t !== run.t)) && run) {
          const w = x - run.x0;
          box(levelRoot, run.x0 + w / 2, y + 0.95, 0, w, 0.12, run.t === "g" ? 4.02 : run.t === "k" ? 3.02 : 2.42, run.t === "s" ? INK.GREEN : INK.ORANGE, { tone: 0.05 });
          run = top ? { x0: x, t: t.t } : null;
        }
      }
    }
    L.decor.forEach(buildDecor);
    // cafeteras de control
    L.checkpoints.forEach((c) => {
      const g = new THREE.Group();
      g.position.set(c.x, surfaceAt(c.x), -0.8);
      box(g, 0, 0.9, 0, 1.2, 1.8, 1, INK.ORANGE, { tone: -0.05 });
      box(g, 0, 1.3, 0.52, 0.7, 0.4, 0.04, INK.BLACK, { fill: true });
      box(g, 0, 0.35, 0.3, 0.3, 0.3, 0.3, INK.GREEN, { tone: 0.05 });
      levelRoot.add(g);
      c.g = g;
      c.on = false;
    });
    // pufs de colores Google (hacen de muelle)
    L.springs.forEach((s, i) => {
      const g = new THREE.Group();
      g.position.set(s.x + 0.5, s.y, 0);
      s.top = new THREE.Mesh(GEO.sph, mat(GCOLS[i % 4 === 3 ? 4 : i % 4], { tone: -0.05 }));
      s.top.scale.set(1.5, 0.8, 1.5);
      s.top.position.y = 0.4;
      g.add(s.top);
      box(g, 0, 0.78, 0.2, 0.5, 0.05, 0.5, INK.BLACK, { fill: true }); // botón del puf
      levelRoot.add(g);
      s.g = g; s.k = 0;
    });
    // corriente de las rejillas de ventilación
    L.ventLines = [];
    L.vents.forEach((v) => {
      for (let k = 0; k < 9; k++) {
        const m = box(levelRoot, rnd(v.x0 + 0.3, v.x1 + 0.7), rnd(v.y0, v.y1), rnd(-0.5, 0.6), 0.06, rnd(0.8, 1.6), 0.06, INK.BLUE, { fill: true });
        L.ventLines.push({ m, v, sp: rnd(5, 9) });
      }
    });
    // plataformas móviles
    L.movers.forEach((m) => {
      m.px = m.x; m.py = m.y; m.dir = 1; m.dx = 0; m.dy = 0;
      m.mesh = box(levelRoot, m.x + m.w / 2, m.y + 0.8, 0, m.w, 0.4, 2, INK.PURPLE, { tone: 0.05 });
    });
    // monedas
    L.coins.forEach((c) => {
      const g = new THREE.Group();
      const m = new THREE.Mesh(GEO.cyl, mat(INK.ORANGE, { fill: true }));
      m.scale.set(0.6, 0.12, 0.6);
      m.rotation.x = Math.PI / 2;
      g.add(m);
      const r = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { tone: 0.3 }));
      r.scale.set(0.1, 0.34, 0.14);
      g.add(r);
      g.position.set(c.x, c.y, 0);
      levelRoot.add(g);
      c.g = g; c.got = false;
    });
    // disquetes con el código (coleccionables secretos)
    L.fragments.forEach((f, i) => {
      const g = new THREE.Group();
      box(g, 0, 0, 0, 0.9, 0.9, 0.16, INK.BLUE, { tone: 0.05 });
      box(g, 0, 0.26, 0.09, 0.5, 0.3, 0.02, INK.BLACK, { tone: 0.4 });
      box(g, 0, -0.22, 0.09, 0.6, 0.3, 0.02, INK.BLACK, { fill: true });
      g.position.set(f.x, f.y, 0);
      levelRoot.add(g);
      f.g = g; f.got = false; f.i = i;
    });
    // bandera de meta
    {
      const g = new THREE.Group();
      g.position.set(L.flagX + 0.5, 2, 0);
      box(g, 0, 5.5, 0, 0.2, 11, 0.2, INK.BLACK, { fill: true });
      const ball = new THREE.Mesh(GEO.sph, mat(INK.ORANGE, { tone: 0 }));
      ball.scale.setScalar(0.6); ball.position.y = 11.1; g.add(ball);
      const flag = new THREE.Group();
      flag.position.y = 10;
      box(flag, -1.0, 0, 0, 2, 1.3, 0.05, INK.RED, { tone: 0.05 });
      box(flag, -1.0, 0, 0.04, 1.2, 0.12, 0.02, INK.RED, { fill: true });
      g.add(flag);
      box(g, 0, 0.25, 0, 1.2, 0.5, 1.2, INK.BLACK, { tone: 0.2 });
      levelRoot.add(g);
      L.flag = flag;
    }
    // enemigos
    enemies.forEach((e) => scene.remove(e.model.group));
    enemies = L.enemies.map(spawnEnemy);
  }

  function spawnEnemy(d) {
    const model = d.type === "walker" ? makeClock() : d.type === "meeting" ? makeMeeting() : makeEmail();
    const s = d.type === "walker" ? 0.7 : d.type === "meeting" ? 0.75 : 0.8;
    model.group.scale.setScalar(s);
    scene.add(model.group);
    return {
      type: d.type, model, x: d.x + 0.5, y: d.y, baseY: d.y + 1.5, vx: 0, vy: 0, dir: -1, t: rnd(0, 6), alive: true, shootT: rnd(1, 2.5),
      w: d.type === "walker" ? 0.9 : d.type === "meeting" ? 1.0 : 0.9, h: d.type === "walker" ? 1.1 : d.type === "meeting" ? 1.5 : 0.7
    };
  }

  // ── colisiones con casillas ──
  function solidAt(x, y) { return solidT(T(Math.floor(x), Math.floor(y))); }
  function boxHitsSolid(x0, y0, x1, y1) {
    for (let tx = Math.floor(x0); tx <= Math.floor(x1 - 1e-4); tx++)
      for (let ty = Math.floor(y0); ty <= Math.floor(y1 - 1e-4); ty++)
        if (solidT(T(tx, ty))) return { tx, ty };
    return null;
  }
  // mueve una caja (centro x, pies y) resolviendo choques; devuelve info de contacto
  function moveBody(b, w, h, dt, oneway = true) {
    const res = { ground: false, head: null, wall: 0 };
    b.x += b.vx * dt;
    let hit = boxHitsSolid(b.x - w / 2, b.y, b.x + w / 2, b.y + h);
    if (hit) {
      if (b.vx > 0) b.x = hit.tx - w / 2 - 1e-3; else if (b.vx < 0) b.x = hit.tx + 1 + w / 2 + 1e-3;
      res.wall = b.vx > 0 ? 1 : -1;
      b.vx = 0;
    }
    const prevY = b.y;
    b.y += b.vy * dt;
    if (b.vy <= 0) {
      hit = boxHitsSolid(b.x - w / 2 + 0.02, b.y, b.x + w / 2 - 0.02, prevY + 0.01);
      if (hit) { b.y = hit.ty + 1; b.vy = 0; res.ground = true; }
      else if (oneway) {
        // plataformas atravesables: sólo si venías de encima
        for (let tx = Math.floor(b.x - w / 2 + 0.02); tx <= Math.floor(b.x + w / 2 - 0.02); tx++) {
          const ty = Math.floor(b.y);
          const t = T(tx, ty);
          if (t && t.t === "p" && prevY >= ty + 1 - 0.05 && b.y < ty + 1 && !b.drop) { b.y = ty + 1; b.vy = 0; res.ground = true; break; }
        }
      }
    } else {
      hit = boxHitsSolid(b.x - w / 2 + 0.06, b.y + h - 0.01, b.x + w / 2 - 0.06, b.y + h);
      if (hit) { b.y = hit.ty - h - 1e-3; b.vy = 0; res.head = hit; }
    }
    return res;
  }
  // ¿toca pared a los lados? (para el salto en pared)
  function wallSide(b, w, h) {
    if (boxHitsSolid(b.x + w / 2, b.y + 0.3, b.x + w / 2 + 0.08, b.y + h - 0.2)) return 1;
    if (boxHitsSolid(b.x - w / 2 - 0.08, b.y + 0.3, b.x - w / 2, b.y + h - 0.2)) return -1;
    return 0;
  }

  // ── bloques ──
  function bumpTile(tx, ty, strong) {
    const t = T(tx, ty);
    if (!t) return;
    const key = `${tx},${ty}`;
    if (t.t === "q") {
      t.t = "u";
      const old = tileMesh.get(key);
      if (old) levelRoot.remove(old);
      const m = qBlockMesh(tx, ty, true);
      tileMesh.set(key, m);
      pops.push({ g: m, t: 0 });
      if (t.item === "coffee") { spawnPickup(tx + 0.5, ty + 1.5); sfx.item(); }
      else { addCoin(tx + 0.5, ty + 1.4); }
      hitEnemiesAbove(tx, ty);
    } else if (t.t === "b") {
      L.tiles.delete(key);
      const m = tileMesh.get(key);
      if (m) levelRoot.remove(m);
      tileMesh.delete(key);
      spawnInk(tx + 0.5, ty + 0.5, INK.RED, 14, 6);
      sfx.brick();
      P.score += 50;
      hitEnemiesAbove(tx, ty);
    } else if (!strong) sfx.bump();
  }
  function hitEnemiesAbove(tx, ty) {
    for (const e of enemies) if (e.alive && Math.abs(e.x - (tx + 0.5)) < 0.9 && Math.abs(e.y - (ty + 1)) < 0.3) killEnemy(e, true);
  }
  function addCoin(x, y) {
    P.coins++;
    P.score += 100;
    sfx.coin();
    const g = new THREE.Mesh(GEO.cyl, mat(INK.ORANGE, { fill: true }));
    g.scale.set(0.5, 0.1, 0.5);
    g.rotation.x = Math.PI / 2;
    g.position.set(x, y, 0);
    scene.add(g);
    pops.push({ g, t: 0, coin: true, y0: y });
  }
  function spawnPickup(x, y) {
    const g = new THREE.Group();
    box(g, 0, 0, 0, 0.55, 0.65, 0.55, INK.GREEN, { tone: 0.05 });
    box(g, 0, 0.36, 0, 0.5, 0.06, 0.5, INK.BLACK, { fill: true });
    g.position.set(x, y, 0);
    scene.add(g);
    pickups.push({ g, x, y, vx: 1.6, vy: 6, t: 0 });
  }

  // ── entrada ──
  const keys = {};
  const tp = { jump: false, power: false };
  const gp = { x: 0, jump: false, power: false, down: false, prev: [] };
  const prev = { jump: false, power: false };
  function readInput() {
    const joy = touchPad ? touchPad.joy : { x: 0, y: 0 };
    let x = gp.x + joy.x;
    if (keys.KeyA || keys.ArrowLeft || mando.L) x -= 1;
    if (keys.KeyD || keys.ArrowRight || mando.R) x += 1;
    const jumpHeld = !!(keys.Space || keys.KeyW || keys.ArrowUp || mando.A || mando.Up || gp.jump || tp.jump);
    const powerHeld = !!(keys.KeyJ || keys.KeyX || keys.KeyK || mando.B || gp.power || tp.power);
    const down = !!(keys.KeyS || keys.ArrowDown || mando.Down || gp.down || joy.y < -0.6);
    const inp = { x: clamp(x, -1, 1), jumpHeld, jump: jumpHeld && !prev.jump, power: powerHeld && !prev.power, powerHeld, down };
    prev.jump = jumpHeld; prev.power = powerHeld;
    return inp;
  }

  // ── jugador ──
  function updatePlayer(dt, inp) {
    if (P.dead > 0) {
      P.dead -= dt;
      P.vy -= GRAV * dt;
      P.y += P.vy * dt;
      if (P.dead <= 0) respawn();
      return;
    }
    P.inv = Math.max(0, P.inv - dt);
    P.cd = Math.max(0, P.cd - dt);
    P.shieldT = Math.max(0, P.shieldT - dt);
    P.buf = inp.jump ? BUFFER : Math.max(0, P.buf - dt);
    P.coyote = P.g ? COYOTE : Math.max(0, P.coyote - dt);
    P.poseT -= dt;
    P.lockT = Math.max(0, P.lockT - dt);
    P.buffT = Math.max(0, P.buffT - dt);
    P.zenT = Math.max(0, P.zenT - dt);
    if (P.g) { P.fly = Math.min(1, P.fly + dt * 0.9); P.mega = P.mega && P.vy > 0 ? P.mega : 0; }
    P.prevY = P.y;

    // escudo de Beltrán: mantén ▼ en el suelo (gasta energía)
    const shielding = char.id === "beltran" && inp.down && P.g && !inp.jumpHeld && P.energy > 0.05;
    if (shielding) { P.energy = Math.max(0, P.energy - dt * 0.55); P.shieldT = Math.max(P.shieldT, 0.08); }
    else P.energy = Math.min(1, P.energy + dt * 0.3);

    // horizontal: aceleración con inercia (más agarre en el suelo)
    if (P.dashT > 0) {
      P.dashT -= dt;
      P.vx = P.facing * P.dashV;
      if (P.dashFloat) P.vy = Math.max(P.vy, 0);
      if (P.dashT <= 0) P.vx *= 0.5;
    } else if (P.lockT > 0) {
      // bote diagonal de Josu: mantiene la inercia
    } else if (shielding) {
      P.vx *= 0.8;
      if (Math.abs(inp.x) > 0.2) P.facing = Math.sign(inp.x);
    } else {
      const max = speedMax();
      const target = inp.x * max;
      const acc = P.g ? (Math.abs(target) > Math.abs(P.vx) && Math.sign(target) === Math.sign(P.vx || target) ? 55 : 70) : 28;
      P.vx += clamp(target - P.vx, -acc * dt, acc * dt);
      if (Math.abs(inp.x) > 0.2) P.facing = Math.sign(inp.x);
    }

    // ▼ + salto sobre una plataforma atravesable: bajar de ella (en vez de saltar)
    P.dropT = Math.max(0, (P.dropT || 0) - dt);
    if (inp.down && inp.jump && P.g) {
      const t = T(Math.floor(P.x), Math.floor(P.y - 0.5));
      if (t && t.t === "p") { P.drop = true; P.dropT = 0.3; P.y -= 0.06; P.g = false; P.buf = 0; P.coyote = 0; }
    }
    if (P.dropT <= 0) P.drop = false;

    // saltos
    P.wall = P.g ? 0 : wallSide(P, PW, PH);
    if (P.buf > 0 && P.coyote > 0) {
      P.vy = jumpV(); P.g = false; P.coyote = 0; P.buf = 0; P.squash = 1.25; sfx.jump(); P.jumpHeld = true;
    } else if (P.buf > 0 && P.wall && !P.g) {
      // salto en pared: impulso hacia fuera y arriba
      const jb = char.id === "josu" ? 1.15 : 1; // Josu rebota en las paredes como nadie
      P.vy = jumpV() * 0.92 * jb; P.vx = -P.wall * 9.5 * jb; P.facing = -P.wall; P.buf = 0; P.wallT = 0.16; sfx.jump(); P.jumpHeld = true;
      spawnInk(P.x + P.wall * PW / 2, P.y + 1, INK.BLUE, 5, 3);
    }
    if (P.wallT > 0) { P.wallT -= dt; } // durante el rebote no se "pega" a la pared
    // salto variable: si sueltas pronto, subes menos
    if (!inp.jumpHeld && P.vy > 5 && P.jumpHeld && P.riseT <= 0) { P.vy *= 0.5; P.jumpHeld = false; }
    if (!inp.jumpHeld) P.jumpHeld = false;

    // poder del personaje
    if (inp.power && P.cd <= 0) usePower(inp);

    // gravedad (deslizarse por la pared cae despacio)
    P.vy -= GRAV * dt * (P.slam ? 1.6 : 1);
    if (P.wall && P.vy < -4 && P.wallT <= 0 && Math.sign(inp.x) === P.wall) P.vy = -4;
    // pasivas de movimiento: planear (Alejandro), volar (Paloma) y trepar (Ana)
    P.climb = false;
    if (!P.g && P.dead <= 0) {
      if (char.id === "alejandro" && inp.jumpHeld && P.vy < -2 && P.fly > 0) { P.vy = -2.2; P.fly = Math.max(0, P.fly - dt * 0.45); }
      if (char.id === "paloma" && inp.jumpHeld && P.vy < 4 && P.fly > 0 && P.riseT <= 0) {
        P.vy = Math.min(P.vy + 70 * dt, 6.5); P.fly = Math.max(0, P.fly - dt * 0.6);
        if (Math.random() < dt * 12) spawnInk(P.x - P.facing * 0.4, P.y + 0.9, INK.BLUE, 1, 2);
      }
      if (char.id === "ana" && P.wall && inp.powerHeld) { P.vy = inp.down ? -4 : 6.5; P.climb = true; P.facing = P.wall; }
    }
    // rejillas de ventilación: la corriente te sube
    for (const v of L.vents) if (P.x > v.x0 && P.x < v.x1 + 1 && P.y >= v.y0 - 0.5 && P.y < v.y1) { P.vy = Math.min(P.vy + 80 * dt, 10); P.g = false; }
    P.vy = Math.max(P.vy, P.slam ? -34 : -MAX_FALL);
    P.riseT = Math.max(0, P.riseT - dt);

    // arrastre de la plataforma móvil
    if (P.onMover) { P.x += P.onMover.dx; P.y += P.onMover.dy; }
    const wasG = P.g;
    const res = moveBody(P, PW, PH, dt);
    P.g = res.ground;
    P.onMover = null;
    for (const m of L.movers) {
      if (P.vy <= 0 && P.x + PW / 2 > m.x && P.x - PW / 2 < m.x + m.w && P.y <= m.y + 1 + 0.05 && P.y >= m.y + 0.6) {
        P.y = m.y + 1; P.vy = 0; P.g = true; P.onMover = m;
      }
    }
    // plataformas impresas por José Luis (atravesables desde abajo)
    for (const pr of prints) {
      if (P.vy <= 0 && P.x + PW / 2 > pr.x && P.x - PW / 2 < pr.x + pr.w && P.y <= pr.top + 0.05 && P.prevY >= pr.top - 0.05 && !P.drop) {
        P.y = pr.top; P.vy = 0; P.g = true;
      }
    }
    // sillas plegables: al pisarlas empiezan a temblar
    if (P.g) for (const c of L.crumbles) if (!c.t.down && !c.t.shake && Math.abs(P.y - (c.y + 1)) < 0.05 && P.x + PW / 2 > c.x && P.x - PW / 2 < c.x + 1) c.t.shake = 0.45;
    if (res.head) {
      // cabezazo al bloque que tienes encima (el más centrado)
      const tx = Math.floor(P.x);
      const t = T(tx, res.head.ty);
      bumpTile(solidT(t) ? tx : res.head.tx, res.head.ty, false);
    }
    if (P.g && !wasG) {
      P.squash = 0.72;
      if (P.slam) { P.slam = 0; slamImpact(); }
      if (P.mega) { P.mega = 0; slamImpact(3.8); big("¡SUPER STEP!", "", 0.8); }
      // Maca en modo pelota bota sin parar (▼ para frenar el bote)
      if (P.ball && !inp.down) { P.vy = 12; P.g = false; P.squash = 0.6; sfx.wall(); }
    }
    // la embestida y el supersalto rompen ladrillos a su paso
    if (P.dashT > 0) {
      for (const dy of [0.3, 1.2]) {
        const tx = Math.floor(P.x + P.facing * (PW / 2 + 0.1)), ty = Math.floor(P.y + dy);
        const t = T(tx, ty);
        if (t && (t.t === "b" || t.t === "q")) bumpTile(tx, ty, true);
      }
    }
    // muelles
    for (const s of L.springs) {
      if (P.vy <= 0 && Math.abs(P.x - (s.x + 0.5)) < 0.9 && P.y <= s.y + 0.85 && P.y >= s.y - 0.1) {
        P.vy = 29; P.g = false; s.k = 1; sfx.spring(); P.jumpHeld = false; P.squash = 1.4;
      }
    }
    // pinchos
    const under = T(Math.floor(P.x), Math.floor(P.y + 0.1));
    if (under && under.t === "x") { if (under.pit) die(); else hurt(P.x - P.facing); }
    // caída al vacío
    if (P.y < -5) die();
    P.x = clamp(P.x, 0.5, LEVEL_W - 0.5);
    if (boss && !bossDone) P.x = clamp(P.x, L.boss.x0 + 0.5, L.boss.x1 + 0.5);
    P.squash += (1 - P.squash) * Math.min(1, dt * 10);

    // monedas, disquetes, cafés, puntos de control, bandera
    for (const c of L.coins) {
      if (!c.got && Math.abs(c.x - P.x) < 0.8 && c.y > P.y && c.y < P.y + PH + 0.3) {
        c.got = true; c.g.visible = false; P.coins++; P.score += 100; sfx.coin(); spawnInk(c.x, c.y, INK.ORANGE, 4, 2);
      }
    }
    for (const f of L.fragments) {
      if (!f.got && Math.abs(f.x - P.x) < 0.9 && f.y > P.y - 0.3 && f.y < P.y + PH + 0.4) {
        f.got = true; f.g.visible = false; P.frags.add(f.i); P.score += 1000; sfx.frag(); big(`💾 ${P.frags.size}/3`, "Disquete con código recuperado", 1.6);
      }
    }
    for (const c of L.checkpoints) {
      if (!c.on && P.x > c.x) {
        c.on = true; P.cp = c.x; sfx.item(); msg("☕ Punto de control: café recargado", 1.8);
        try { localStorage.setItem(SAVE_KEY, String(c.x)); } catch (e) {}
        P.hearts = Math.max(P.hearts, HEARTS);
      }
    }
    // rótulos al llegar a cada oficina del viaje
    for (const z of ZONES) if (!P.zones.has(z.x) && P.x > z.x) { P.zones.add(z.x); big(z.t, z.s, 2); }
    if (!P.won && P.x > L.flagX - 0.2 && P.x < L.flagX + 1.2) finish();
  }

  // ── poderes originales de cada personaje (los del plataformas clásico) ──
  const PINK = {
    alejandro: INK.BLACK, ale: INK.GREEN, alvaroM: INK.BLUE, alvaroP: INK.PURPLE, ana: INK.ORANGE, beltran: INK.BLUE,
    bruno: INK.PURPLE, gonzalo: INK.GREEN, javi: INK.RED, jesus: INK.ORANGE, joseluis: INK.BLUE, josu: INK.ORANGE,
    juan: INK.PURPLE, maca: INK.ORANGE, manu: INK.RED, pablo: INK.ORANGE, paloma: INK.BLUE, silvia: INK.RED
  };
  const pInk = () => PINK[char.id] || INK.BLUE;
  const attacking = () => P.dashT > 0 || P.riseT > 0 || P.slam || P.ball || P.zenT > 0 || P.shieldT > 0 || P.mega;

  function usePower(inp) {
    const id = char.id;
    if (id === "ana" && P.wall && !P.g) return; // en la pared, el botón es para trepar
    P.cd = cdMax;
    sfx.power();
    P.pose = "attack"; P.poseT = 0.3;
    const f = P.facing;
    if (id === "alejandro") { melee(1.8); P.vx += f * 3; }
    else if (id === "paloma") { melee(1.5, 1.9); if (!P.g) P.vy = Math.max(P.vy, 5); }
    else if (id === "ana") melee(1.4, 1.7);
    else if (id === "ale") dash(0.65, 1.75, false, INK.GREEN);
    else if (id === "pablo") dash(0.9, 1.85, false, INK.ORANGE);
    else if (id === "silvia") { dash(0.3, 2.3, true, INK.RED); P.inv = Math.max(P.inv, 0.4); }
    else if (id === "beltran") { dash(0.16, 2.8, true, INK.BLUE); melee(1.6, 1.4); }
    else if (id === "alvaroM") shoot({ x: P.x + f * 0.6, y: P.y + 1.2, vx: f * 9, vy: 7, arc: true, bounce: 2, boom: 2.3, life: 2.2, ink: INK.BLUE, shape: "404" });
    else if (id === "alvaroP") shoot({ x: P.x + f * 0.7, y: P.y + 1, vx: f * 15, pierce: true, life: 0.95, ink: INK.PURPLE, shape: "wave", grow: true });
    else if (id === "juan") blast(P.x, P.y + 0.8, 3.3, INK.PURPLE);
    else if (id === "jesus") {
      if (P.g) blast(P.x, P.y + 0.4, 2.7, INK.ORANGE);
      else { P.slam = 1; P.vy = -30; }
    } else if (id === "manu") { P.vy = jumpV() * 1.55; P.g = false; P.mega = 1; P.riseT = 0.35; P.squash = 1.5; spawnInk(P.x, P.y, INK.RED, 10, 4); }
    else if (id === "josu") { P.vy = jumpV() * 1.05; P.vx = f * 13; P.lockT = 0.42; P.riseT = 0.42; P.g = false; spawnInk(P.x, P.y, INK.ORANGE, 8, 4); }
    else if (id === "maca") { P.ball = !P.ball; P.cd = 0.4; msg(P.ball ? "🏐 Modo pelota: ¡arrollas todo!" : "🏐 Modo normal", 1.1); if (P.ball && P.g) P.vy = 10; }
    else if (id === "gonzalo") { for (let i = 0; i < 3; i++) spawnMinion("broc", i); msg("🥦 ¡Mini-brócolis!", 1); }
    else if (id === "javi") { for (let i = 0; i < 2; i++) spawnMinion("worker", i); msg("☭ ¡Trabajadores del mundo!", 1); }
    else if (id === "joseluis") printPlatform();
    else if (id === "bruno") {
      const face = Math.floor(Math.random() * 4);
      if (face === 0) { if (P.hearts < HEARTS) P.hearts++; else P.score += 300; msg("🙂 Cara feliz: +1 ♥", 1.4); sfx.item(); }
      else if (face === 1) { blast(P.x, P.y + 0.8, 3.4, INK.RED); msg("😡 Cara furiosa", 1.2); }
      else if (face === 2) { P.buffT = 4; msg("😎 Cara veloz: +velocidad", 1.4); }
      else { P.zenT = 3; P.inv = Math.max(P.inv, 3); msg("😌 Cara zen: invencible", 1.4); }
    }
  }
  function dash(t, mult, float, ink) {
    P.dashT = t; P.dashV = speedMax() * mult; P.dashFloat = float;
    spawnInk(P.x, P.y + 0.6, ink, 8, 3);
  }
  // golpe cuerpo a cuerpo delante del personaje
  function melee(range, h = 1.6) {
    const x0 = P.facing > 0 ? P.x - 0.2 : P.x - range, x1 = P.facing > 0 ? P.x + range : P.x + 0.2;
    let hit = false;
    for (const e of enemies) if (e.alive && e.x + e.w / 2 > x0 && e.x - e.w / 2 < x1 && e.y < P.y + h && e.y + e.h > P.y - 0.3) { killEnemy(e, true); hit = true; }
    if (boss && boss.state === "tired" && boss.x + 1.6 > x0 && boss.x - 1.6 < x1 && P.y < boss.y + 3.2 && P.y + h > boss.y) { hitBoss(); hit = true; }
    for (const dy of [0.5, 1.3]) {
      const tx = Math.floor(P.x + P.facing * Math.min(range, 1.1)), ty = Math.floor(P.y + dy);
      const t = T(tx, ty);
      if (t && (t.t === "b" || t.t === "q")) bumpTile(tx, ty, true);
    }
    spawnInk(P.x + P.facing * range * 0.7, P.y + 1, pInk(), hit ? 10 : 5, 4);
    if (hit) shake(0.35);
  }
  // onda expansiva (microondas, smash de Cruzcampo, cara furiosa, bomba 404)
  function blast(x, y, r, ink) {
    for (const e of enemies) if (e.alive && Math.hypot(e.x - x, e.y + e.h / 2 - y) < r) killEnemy(e, true);
    if (boss && boss.state === "tired" && Math.abs(boss.x - x) < r + 1.2 && Math.abs(boss.y + 1.5 - y) < r + 1.5) hitBoss();
    const R = Math.ceil(r);
    for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) {
      if (dx * dx + dy * dy > r * r) continue;
      const tx = Math.floor(x + dx), ty = Math.floor(y + dy), t = T(tx, ty);
      if (t && (t.t === "b" || t.t === "q")) bumpTile(tx, ty, true);
    }
    const ring = new THREE.Mesh(GEO.torus, mat(ink, { fill: true }));
    ring.position.set(x, y, 0.4);
    scene.add(ring);
    rings.push({ m: ring, t: 0, r });
    spawnInk(x, y, ink, 18, 7);
    shake(0.6);
    sfx.brick();
  }
  function shoot(o) { powers.push({ vy: 0, bounce: 0, ...o, mesh: powerMesh(o.ink, o.shape) }); }
  function powerMesh(ink, shape) {
    const g = new THREE.Group();
    if (shape === "wave") {
      for (let k = 0; k < 3; k++) { const r = new THREE.Mesh(GEO.torus, mat(ink, { fill: true })); r.scale.setScalar(0.35 + k * 0.2); r.position.x = -k * 0.25; r.rotation.y = Math.PI / 2; g.add(r); }
    } else if (shape === "404") {
      box(g, 0, 0, 0, 0.7, 0.5, 0.2, INK.BLUE, { tone: 0.05 });
      const t = inkText("404", { size: 0.28, ink: INK.RED, weight: 1.3 }); t.position.z = 0.12; g.add(t);
    } else box(g, 0, 0, 0, 0.5, 0.5, 0.5, ink, { tone: 0.05 });
    scene.add(g);
    return g;
  }
  // minions: mini-brócolis que saltan y trabajadores que marchan
  function spawnMinion(kind, i) {
    const g = new THREE.Group();
    if (kind === "broc") {
      const h = new THREE.Mesh(GEO.sph, mat(INK.GREEN, { tone: -0.05 })); h.scale.setScalar(0.7); h.position.y = 0.75; g.add(h);
      box(g, 0, 0.25, 0, 0.26, 0.5, 0.26, INK.GREEN, { tone: 0.2 });
    } else {
      box(g, 0, 0.45, 0, 0.5, 0.6, 0.4, INK.RED, { tone: -0.05 });
      const h = new THREE.Mesh(GEO.sph, mat(INK.ORANGE, { tone: 0.15 })); h.scale.setScalar(0.4); h.position.y = 0.95; g.add(h);
      box(g, 0.28, 0.9, 0, 0.08, 0.7, 0.08, INK.BLACK, { fill: true }); // el martillo
      box(g, 0.28, 1.25, 0, 0.3, 0.14, 0.14, INK.BLACK, { fill: true });
    }
    scene.add(g);
    const sp2 = kind === "broc" ? 5.2 : 3.6;
    minions.push({ kind, x: P.x + P.facing * (0.8 + i * 0.6), y: P.y + 0.3, vx: P.facing * sp2, vy: kind === "broc" ? 5 + i * 2 : 0, dir: P.facing, speed: sp2, life: kind === "broc" ? 5 : 7, g, t: rnd(0, 3) });
  }
  function updateMinions(dt) {
    for (const m of minions) {
      m.life -= dt; m.t += dt;
      m.vx = m.dir * m.speed;
      m.vy -= GRAV * dt;
      const res = moveBody(m, 0.6, 0.9, dt);
      if (res.wall) m.dir = -m.dir;
      if (m.kind === "broc" && res.ground) m.vy = 6;
      m.g.position.set(m.x, m.y, 0.25);
      m.g.rotation.y = m.dir > 0 ? 0 : Math.PI;
      m.g.rotation.z = m.kind === "worker" ? Math.sin(m.t * 12) * 0.12 : 0;
      for (const e of enemies) if (e.alive && Math.abs(e.x - m.x) < (e.w + 0.6) / 2 && m.y < e.y + e.h && m.y + 0.9 > e.y) { killEnemy(e, true); if (m.kind === "broc") m.life = 0; }
      if (boss && boss.state === "tired" && Math.abs(boss.x - m.x) < 1.8 && m.y < boss.y + 3.2) { hitBoss(); m.life = 0; }
      if (m.y < -5) m.life = 0;
      if (m.life <= 0) { scene.remove(m.g); spawnInk(m.x, m.y + 0.5, m.kind === "broc" ? INK.GREEN : INK.RED, 6, 3); }
    }
    minions = minions.filter((m) => m.life > 0);
  }
  // José Luis: imprime plataformas en 3D (máx. 3, duran 9 s)
  function printPlatform() {
    if (prints.length >= 3) { const o = prints.shift(); levelRoot.remove(o.g); }
    const x = P.g ? P.x + P.facing * 1.8 : P.x;
    const top = P.g ? P.y + 2.2 : P.y - 0.05;
    const g = new THREE.Group();
    g.position.set(x, top, 0);
    box(g, 0, -0.2, 0, 3, 0.4, 2, INK.BLUE, { tone: 0.02 });
    for (let k = -1; k <= 1; k++) box(g, k, -0.2, 1.01, 0.05, 0.36, 0.02, INK.BLUE, { fill: true }); // capas impresas
    box(g, 0, -0.02, 1.01, 3, 0.05, 0.02, INK.BLUE, { fill: true });
    levelRoot.add(g);
    prints.push({ x: x - 1.5, w: 3, top, life: 9, g });
    spawnInk(x, top, INK.BLUE, 10, 3);
    audio.tone({ freq: 520, to: 880, dur: 0.18, type: "square", gain: 0.06 });
  }
  function updatePrints(dt) {
    for (const p of prints) {
      p.life -= dt;
      p.g.visible = p.life > 1.6 || Math.floor(p.life * 8) % 2 === 0;
      if (p.life <= 0) { levelRoot.remove(p.g); spawnInk(p.x + 1.5, p.top, INK.BLUE, 6, 2); if (P.onPrint === p) P.onPrint = null; }
    }
    prints = prints.filter((p) => p.life > 0);
  }
  function slamImpact(r = 3) {
    spawnInk(P.x, P.y + 0.2, pInk(), 18, 7);
    shake(r > 3 ? 1.1 : 0.8);
    sfx.brick();
    for (const e of enemies) if (e.alive && Math.abs(e.x - P.x) < r && Math.abs(e.y - P.y) < 1.8) killEnemy(e, true);
    if (boss && boss.state === "tired" && Math.abs(boss.x - P.x) < r) hitBoss();
    // rompe los ladrillos de debajo
    for (let dx = -1; dx <= 1; dx++) {
      const tx = Math.floor(P.x + dx * 0.5), ty = Math.floor(P.y - 0.5);
      const t = T(tx, ty);
      if (t && (t.t === "b" || t.t === "q")) bumpTile(tx, ty, true);
    }
  }

  function hurt(fromX) {
    if (P.inv <= 0 && P.dead <= 0 && !P.won) buzz(40);
    if (P.inv > 0 || P.dead > 0 || P.won) return;
    P.hearts--;
    P.inv = 1.4;
    P.flash = 0.3;
    P.vx = Math.sign(P.x - fromX || -P.facing) * 7;
    P.vy = 8;
    P.g = false;
    sfx.hurt();
    shake(0.6);
    spawnInk(P.x, P.y + 1, INK.RED, 10, 5);
    if (P.hearts <= 0) die(true);
  }
  function die(fromHurt) {
    if (P.dead > 0) return;
    if (!fromHurt) P.hearts--;
    P.dead = 1.3;
    P.vy = 12;
    P.vx = 0;
    audio.lose();
    shake(0.8);
  }
  function respawn() {
    if (P.hearts <= 0) { gameOver(); return; }
    P.x = P.cp + 0.5; P.y = surfaceAt(P.cp + 0.5) + 0.5; P.vx = 0; P.vy = 0; P.inv = 1.6; P.slam = 0; P.dashT = 0; P.mega = 0; P.ball = false; P.lockT = 0;
    if (boss && !bossDone) { resetBoss(); }
  }

  // ── enemigos ──
  function updateEnemies(dt) {
    for (const e of enemies) {
      if (!e.alive) continue;
      e.t += dt;
      if (Math.abs(e.x - P.x) > 30) { e.model.group.visible = false; continue; } // dormidos fuera de pantalla
      e.model.group.visible = true;
      if (e.type === "flyer") {
        e.x += Math.sign(P.x - e.x) * 1.2 * dt;
        e.y = e.baseY + Math.sin(e.t * 2.2) * 1.2;
        const m = e.model;
        const flap = Math.sin(e.t * 20) * 0.7;
        m.wings.forEach((w) => (w.pivot.rotation.z = w.s * flap));
      } else {
        const sp2 = e.type === "walker" ? 1.7 : 1.0;
        e.vx = e.dir * sp2;
        e.vy -= GRAV * dt;
        const res = moveBody(e, e.w, e.h, dt);
        if (res.wall) e.dir = -e.dir;
        // gira al borde de un precipicio
        if (res.ground && !solidAt(e.x + e.dir * (e.w / 2 + 0.1), e.y - 0.2) && !(T(Math.floor(e.x + e.dir * (e.w / 2 + 0.1)), Math.floor(e.y - 0.2)) || {}).t) e.dir = -e.dir;
        if (e.y < -5) e.alive = false;
        const m = e.model;
        if (m.legs) {
          const sw = Math.sin(e.t * 9) * 0.6;
          m.legs.forEach((l) => (l.pivot.rotation.x = l.s * sw));
        }
        if (m.hand1) m.hand1.rotation.z = -e.t * 4;
        if (e.type === "meeting") {
          e.shootT -= dt;
          if (e.shootT <= 0 && Math.abs(P.x - e.x) < 13 && Math.abs(P.y - e.y) < 4) {
            e.shootT = rnd(2, 3);
            const dir = Math.sign(P.x - e.x) || 1;
            e.dir = dir;
            const g = new THREE.Group();
            box(g, 0, 0, 0, 0.6, 0.45, 0.1, INK.ORANGE, { tone: 0.05 });
            box(g, 0, 0.16, 0, 0.62, 0.12, 0.11, INK.ORANGE, { fill: true });
            scene.add(g);
            shots.push({ x: e.x + dir * 0.7, y: e.y + 1.1, vx: dir * 7, life: 3, mesh: g });
            audio.invite();
          }
        }
      }
      e.model.group.position.set(e.x, e.y + (e.type === "flyer" ? 0 : 0), 0.2);
      e.model.group.rotation.y = e.type === "flyer" ? 0 : e.dir * 0.5;
      // contacto con el jugador: pisotón o daño
      if (P.dead <= 0 && Math.abs(e.x - P.x) < (e.w + PW) / 2 && P.y < e.y + e.h && P.y + PH > e.y) {
        const stomp = P.vy < 0 && P.y > e.y + e.h * 0.45;
        if (stomp || attacking()) {
          killEnemy(e, false);
          if (stomp) { P.vy = prev.jump ? 17 : 12; P.g = false; P.stomps++; sfx.stomp(); }
        } else hurt(e.x);
      }
    }
  }
  function killEnemy(e, pop) {
    e.alive = false;
    scene.remove(e.model.group);
    spawnInk(e.x, e.y + 0.6, e.type === "meeting" ? INK.PURPLE : e.type === "walker" ? INK.ORANGE : INK.RED, 16, 6);
    spawnDecal(e.x, e.type === "meeting" ? INK.PURPLE : INK.RED);
    P.score += pop ? 150 : 200;
    audio.paperRip();
  }
  function updateShots(dt) {
    for (const s of shots) {
      s.life -= dt;
      s.x += s.vx * dt;
      s.mesh.position.set(s.x, s.y, 0.2);
      s.mesh.rotation.z += dt * 8;
      if (solidAt(s.x, s.y)) s.life = 0;
      if (P.dead <= 0 && Math.abs(s.x - P.x) < 0.6 && s.y > P.y && s.y < P.y + PH) {
        s.life = 0;
        if (P.shieldT <= 0 && P.zenT <= 0) hurt(s.x);
      }
      if (s.life <= 0) { scene.remove(s.mesh); spawnInk(s.x, s.y, INK.ORANGE, 4, 2); }
    }
    shots = shots.filter((s) => s.life > 0);
    for (const p of powers) {
      p.life -= dt;
      if (p.arc) p.vy -= 20 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.arc && solidAt(p.x, p.y - 0.25) && p.vy < 0) {
        if (p.bounce-- > 0) { p.y = Math.floor(p.y - 0.25) + 1.25; p.vy = 6; } else p.life = 0;
      }
      p.mesh.position.set(p.x, p.y, 0.3);
      if (p.grow) p.mesh.scale.setScalar(1 + (0.95 - p.life) * 1.6);
      else p.mesh.rotation.z -= dt * 10 * Math.sign(p.vx);
      const tx = Math.floor(p.x), ty = Math.floor(p.y);
      const t = T(tx, ty);
      if (t && (t.t === "b" || t.t === "q")) { bumpTile(tx, ty, true); if (!p.pierce) p.life = 0; }
      else if (solidT(t)) p.life = 0;
      for (const e of enemies) if (e.alive && Math.abs(e.x - p.x) < 0.9 && p.y > e.y - 0.4 && p.y < e.y + e.h + 0.4) { killEnemy(e, true); if (!p.pierce) p.life = 0; }
      if (boss && boss.state === "tired" && Math.abs(boss.x - p.x) < 1.6 && p.y < boss.y + 3.2) { hitBoss(); p.life = 0; }
      if (p.life <= 0) { scene.remove(p.mesh); if (p.boom) blast(p.x, p.y, p.boom, p.ink); else spawnInk(p.x, p.y, p.ink, 6, 3); }
    }
    powers = powers.filter((p) => p.life > 0);
    for (const k of pickups) {
      k.t += dt;
      k.vy -= 20 * dt;
      const body = { x: k.x, y: k.y - 0.3, vx: k.vx, vy: k.vy };
      const res = moveBody(body, 0.5, 0.6, dt);
      if (res.wall) k.vx = -k.vx;
      k.x = body.x; k.y = body.y + 0.3; k.vy = body.vy;
      k.g.position.set(k.x, k.y, 0.2);
      if (Math.abs(k.x - P.x) < 0.8 && k.y > P.y && k.y < P.y + PH + 0.4) {
        k.dead = true; scene.remove(k.g);
        if (P.hearts < HEARTS) { P.hearts++; msg("☕ ¡Café! +1 corazón", 1.4); } else { P.score += 500; msg("☕ Café extra: +500", 1.4); }
        sfx.item();
      }
      if (k.y < -5) { k.dead = true; scene.remove(k.g); }
    }
    pickups = pickups.filter((k) => !k.dead);
  }

  // ── jefe: EMAIL CHAIN ──
  function startBoss() {
    boss = { x: L.boss.spawnX, y: 14, vx: 0, vy: 0, hp: 3, state: "intro", t: 0, hops: 0, model: makeBoss(), flash: 0 };
    boss.model.group.scale.setScalar(0.55);
    scene.add(boss.model.group);
    // paredes que cierran la arena
    for (const x of [L.boss.x0 - 1, L.boss.x1 + 1]) for (let y = 2; y < 16; y++) { L.tiles.set(`${x},${y}`, { t: "w" }); bossWalls.push(`${x},${y}`); }
    bossWalls.meshes = [L.boss.x0 - 1, L.boss.x1 + 1].map((x) => box(levelRoot, x + 0.5, 9, 0, 1, 14, 2, INK.RED, { tone: 0.15 }));
    $(".pf-boss").classList.remove("hidden");
    big("EMAIL CHAIN", "Pisa su cabeza cuando se canse de saltar", 2.2);
    audio.bossRoar();
  }
  function resetBoss() {
    if (!boss) return;
    boss.x = L.boss.spawnX; boss.y = 12; boss.vx = 0; boss.vy = 0; boss.state = "hop"; boss.t = 0.8; boss.hops = 0;
  }
  function hitBoss() {
    if (!boss || boss.state !== "tired") return;
    boss.hp--;
    boss.state = "hurt";
    boss.t = 0.9;
    boss.flash = 0.9;
    shake(1);
    audio.bossRoar();
    spawnInk(boss.x, boss.y + 2, INK.RED, 26, 8);
    if (boss.hp <= 0) {
      boss.state = "dead";
      bossDone = true;
      P.score += 5000;
      big("¡INBOX ZERO!", "Has vaciado la cadena de emails", 2.2);
      scene.remove(boss.model.group);
      spawnInk(boss.x, boss.y + 2, INK.RED, 60, 12);
      spawnDecal(boss.x, INK.RED);
      bossWalls.forEach((k) => L.tiles.delete(k));
      (bossWalls.meshes || []).forEach((m) => levelRoot.remove(m));
      $(".pf-boss").classList.add("hidden");
    }
  }
  function updateBoss(dt) {
    if (!boss && !bossDone && P.x > L.boss.x0 + 3 && P.x < L.boss.x1 - 2) startBoss();
    if (!boss || boss.state === "dead") return;
    const b = boss;
    b.t -= dt;
    b.flash = Math.max(0, b.flash - dt);
    b.vy -= GRAV * 0.8 * dt;
    const body = { x: b.x, y: b.y, vx: b.vx, vy: b.vy };
    const res = moveBody(body, 3, 3.2, dt, false);
    b.x = body.x; b.y = body.y; b.vx = body.vx; b.vy = body.vy;
    if (res.ground) b.vx *= 0.8;
    if (b.state === "intro" && res.ground) { b.state = "hop"; b.t = 1; b.landed = true; shake(1); }
    if (b.state === "hop" && res.ground) {
      if (!b.landed) {
        // aterrizaje: temblor, onda de choque y, cada dos saltos, emails
        b.landed = true;
        b.t = b.hp === 1 ? 0.45 : 0.75;
        shake(0.7);
        spawnInk(b.x, b.y, INK.RED, 10, 5);
        if (b.hops % 2 === 0 && enemies.filter((e) => e.alive).length < 8) {
          enemies.push(spawnEnemy({ type: "flyer", x: b.x - 2, y: b.y + 2 }));
          enemies.push(spawnEnemy({ type: "flyer", x: b.x + 1, y: b.y + 3 }));
        }
        if (P.g && Math.abs(P.x - b.x) < 5) hurt(b.x); // salta para esquivar la onda
      } else if (b.t <= 0) {
        if (b.hops >= 3) { b.state = "tired"; b.t = 2.6; b.hops = 0; msg("¡Está agotado! ¡Písale la cabeza!", 1.6); }
        else {
          b.hops++;
          const dir = Math.sign(P.x - b.x) || 1;
          b.vx = dir * rnd(4, 6.5);
          b.vy = rnd(13, 16);
          b.landed = false;
        }
      }
    }
    if (b.state === "tired" && b.t <= 0) { b.state = "hop"; b.t = 0.4; b.landed = true; }
    if (b.state === "hurt" && b.t <= 0) { b.state = "hop"; b.t = 0.3; b.landed = true; }
    // contacto
    if (P.dead <= 0 && Math.abs(b.x - P.x) < 1.9 && P.y < b.y + 3.2 && P.y + PH > b.y) {
      if (b.state === "tired" && P.vy < 0 && P.y > b.y + 1.8) { hitBoss(); P.vy = 16; sfx.stomp(); }
      else if (b.state !== "tired" && b.state !== "hurt") hurt(b.x);
    }
    const m = b.model;
    m.group.position.set(b.x, b.y, 0);
    m.layers.forEach((l, i) => (l.rotation.y = Math.sin(performance.now() / 300 + i) * (b.state === "tired" ? 0.05 : 0.2)));
    m.top.rotation.z = b.state === "tired" ? Math.sin(performance.now() / 120) * 0.15 : 0;
    m.group.scale.setScalar(0.55 * (b.state === "tired" ? 0.92 + Math.sin(performance.now() / 90) * 0.02 : 1));
    m.group.visible = !(b.flash > 0 && Math.floor(b.flash * 16) % 2);
    $(".pf-boss-bar i").style.width = `${(b.hp / 3) * 100}%`;
  }

  // ── meta ──
  function finish() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    P.won = true;
    const grab = clamp((P.y - 2) / 10, 0, 1);
    P.score += Math.round(grab * 2000) + Math.max(0, 3000 - Math.round(P.time) * 10);
    audio.victory();
    big("¡NIVEL SUPERADO!", `Bandera a ${Math.round(grab * 100)}% de altura`, 2.4);
    setTimeout(endScreen, 2600, true);
  }
  function rankFor() {
    const coinRatio = P.coins / Math.max(1, L.coins.length);
    let pts = P.frags.size + (coinRatio > 0.6 ? 1 : 0) + (P.time < 480 ? 1 : 0) + (P.hearts === HEARTS ? 1 : 0);
    return pts >= 5 ? "S" : pts >= 3 ? "A" : pts >= 2 ? "B" : "C";
  }
  function endScreen(win) {
    screen = "end";
    const rank = win ? rankFor() : "";
    $(".pf-end-kicker").textContent = win ? "MUNDO 1 · LA OFICINA" : "GAME OVER";
    $(".pf-end-title").textContent = win ? "¡Inbox Zero!" : "Te han enterrado en emails";
    $(".pf-end-stats").innerHTML = `
      <div><span>Puntos</span><b>${P.score.toLocaleString("es-ES")}</b></div>
      ${win ? `<div><span>Rango</span><b class="dd-rank">${rank}</b></div>` : ""}
      <div><span>Monedas</span><b>${P.coins}</b></div>
      <div><span>Disquetes</span><b>${P.frags.size}/3</b></div>
      <div><span>Tiempo</span><b>${fmt(P.time)}</b></div>
      <div><span>Pisotones</span><b>${P.stomps}</b></div>`;
    $(".pf-retry").textContent = win ? "Jugar otra vez" : "Reintentar";
    showOv("end");
    syncPad();
    if (win && onVictory) try { onVictory(P.score, rank); } catch (e) {}
  }
  function gameOver() { audio.lose(); endScreen(false); }

  // ── efectos ──
  const particles = [], decals = [];
  function spawnInk(x, y, ink, n, speed = 5) {
    for (let i = 0; i < n; i++) {
      let p = particles.find((q) => !q.alive);
      if (!p) {
        if (particles.length > 200) break;
        p = { mesh: new THREE.Mesh(GEO.sph, mat(ink, { fill: true })), vel: new THREE.Vector3() };
        scene.add(p.mesh);
        particles.push(p);
      }
      p.alive = true; p.ink = ink;
      p.mesh.material = mat(ink, { fill: true });
      p.mesh.visible = true;
      p.mesh.position.set(x, y, rnd(-0.3, 0.6));
      p.mesh.scale.setScalar(rnd(0.07, 0.16));
      p.vel.set(rnd(-1, 1), rnd(0.3, 1.4), rnd(-0.3, 0.3)).multiplyScalar(speed * rnd(0.5, 1));
      p.life = rnd(0.4, 1);
    }
  }
  function spawnDecal(x, ink) {
    let gy = 2;
    for (let y = Math.floor(P.y + 3); y >= 0; y--) if (solidAt(x, y)) { gy = y + 1; break; }
    const d = decals.length >= 40 ? decals.shift() : (() => { const m = new THREE.Mesh(GEO.disc, mat(ink, { fill: true })); m.rotation.x = -Math.PI / 2; scene.add(m); return m; })();
    d.material = mat(ink, { fill: true });
    d.position.set(x + rnd(-0.3, 0.3), gy + 0.02, rnd(-0.8, 0.8));
    d.scale.set(rnd(1.2, 2), rnd(0.8, 1.4), 1);
    decals.push(d);
  }
  let shakeAmt = 0;
  const shake = (a) => (shakeAmt = Math.max(shakeAmt, a));
  function updateFx(dt) {
    for (const p of particles) {
      if (!p.alive) continue;
      p.life -= dt;
      p.vel.y -= 15 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.life <= 0) { p.alive = false; p.mesh.visible = false; }
    }
    for (const p of pops) {
      p.t += dt;
      if (p.coin) { p.g.position.y = p.y0 + p.t * 5 - p.t * p.t * 8; p.g.rotation.y += dt * 12; if (p.t > 0.5) { scene.remove(p.g); p.done = true; } }
      else { p.g.position.y = Math.floor(p.g.position.y) + 0.5 + Math.max(0, Math.sin(Math.min(1, p.t / 0.18) * Math.PI) * 0.3); if (p.t > 0.2) p.done = true; }
    }
    pops = pops.filter((p) => !p.done);
    for (const r of rings) {
      r.t += dt;
      const k = Math.min(1, r.t / 0.3);
      r.m.scale.setScalar(0.5 + k * r.r * 1.6);
      if (r.t > 0.35) { scene.remove(r.m); r.done = true; }
    }
    rings = rings.filter((r) => !r.done);
  }

  // ── cámara lateral ──
  const camT = new THREE.Vector3(8, 5, 0);
  function updateCamera(dt) {
    const portrait = root.clientWidth < root.clientHeight;
    const dist = portrait ? 18 : 13.5;
    let tx = P.x + P.facing * 2.5 + P.vx * 0.2;
    let ty = clamp(P.y + 1.6, 4.2, LEVEL_H - 4);
    if (boss && !bossDone) { tx = (L.boss.x0 + L.boss.x1 + 1) / 2; ty = 6.5; }
    tx = clamp(tx, portrait ? 6 : 10, LEVEL_W - (portrait ? 6 : 10));
    camT.x += (tx - camT.x) * Math.min(1, dt * 4);
    camT.y += (ty - camT.y) * Math.min(1, dt * (P.g ? 4 : 2.2));
    const sh = shakeAmt * shakeAmt * 0.4;
    shakeAmt = Math.max(0, shakeAmt - dt * 2.6);
    camera.position.set(camT.x + rnd(-sh, sh), camT.y + 3.4 + rnd(-sh, sh), dist);
    camera.lookAt(camT.x, camT.y, 0);
  }

  // ── HUD ──
  const hud = { hearts: $(".pf-hearts"), coins: $(".pf-coins"), frags: $(".pf-frags"), time: $(".pf-time"), score: $(".pf-score"), power: $(".pf-power-bar i"), big: $(".pf-big"), msg: $(".pf-msg") };
  let bigT = 0, msgT = 0, lastHearts = -1;
  function big(txt, sub, dur) {
    hud.big.textContent = txt;
    hud.msg.textContent = sub || "";
    hud.big.className = "pf-big show";
    void hud.big.offsetWidth;
    hud.big.classList.add("pop");
    bigT = dur; msgT = dur;
  }
  function msg(txt, dur) { hud.msg.textContent = txt; msgT = dur; }
  function updateHud(dt) {
    if (P.hearts !== lastHearts) {
      lastHearts = P.hearts;
      hud.hearts.innerHTML = Array.from({ length: HEARTS }, (_, i) => `<i class="${i < P.hearts ? "on" : ""}"></i>`).join("");
    }
    hud.coins.textContent = `🪙 ${P.coins}`;
    hud.frags.textContent = `💾 ${P.frags.size}/3`;
    hud.time.textContent = fmt(P.time);
    hud.time.classList.toggle("late", P.time > 480); // el reto de tiempo es acabar en menos de 8:00
    hud.score.textContent = P.score.toLocaleString("es-ES");
    const meter = char.id === "paloma" || char.id === "alejandro" ? P.fly : char.id === "beltran" ? P.energy : null;
    const useMeter = meter !== null && meter < 0.995 && P.cd <= 0;
    hud.power.style.width = `${(useMeter ? meter : 1 - P.cd / cdMax) * 100}%`;
    hud.power.parentElement.classList.toggle("ready", P.cd <= 0 && !useMeter);
    bigT -= dt; msgT -= dt;
    if (bigT <= 0) hud.big.classList.remove("show");
    hud.msg.style.opacity = msgT > 0 ? "1" : "0";
  }

  // ── dibujo del jugador ──
  const _v = new THREE.Vector3();
  function drawPlayer(dt) {
    const air = !P.g;
    let pose = P.dead > 0 ? (sticker.hasPose("death") ? "death" : "damage")
      : P.poseT > 0 ? "attack" : P.inv > 1.1 ? "damage" : air ? "jump" : Math.abs(P.vx) > 6 ? "run" : Math.abs(P.vx) > 0.5 ? "walk" : "idle";
    P.flash = Math.max(0, P.flash - dt);
    sticker.update(dt, {
      pos: _v.set(P.x, P.y, 0.3), camera, moveX: 0, facing: P.facing, speed: Math.abs(P.vx) * (P.g ? 1 : 0), onGround: P.g,
      firing: false, pose, hurt: P.flash > 0 ? 1 : 0,
      tilt: P.dead > 0 ? P.dead * 3 : P.wall && !P.g ? -P.wall * 0.2 : P.dashT > 0 ? -P.facing * 0.25 : 0,
      squash: P.squash
    });
    sticker.pivot.rotation.y = 0;
    // parpadeo durante la invulnerabilidad; brillo azul con el escudo
    sticker.setVisible(!(P.inv > 0 && P.dead <= 0 && Math.floor(P.inv * 14) % 2 && P.shieldT <= 0));
    let gy = 0;
    for (let y = Math.floor(P.y + 0.1); y >= 0; y--) { const t = T(Math.floor(P.x), y); if (solidT(t) || (t && t.t === "p")) { gy = y + 1; break; } }
    const lift = clamp(1 - (P.y - gy) / 5, 0.3, 1);
    shadow.position.set(P.x, gy + 0.03, 0.3);
    shadow.scale.set(1.1 * lift, 0.5 * lift, 1);
    shadow.visible = P.dead <= 0 && gy > 0;
  }

  // ── simulación ──
  let playT = 0;
  function stepSim(dt) {
    if (screen !== "play") return;
    playT += dt;
    if (!P.won) P.time += dt;
    for (const m of L.movers) {
      const ox = m.x, oy = m.y;
      if (m.x1 !== m.x0) { m.x += m.dir * m.speed * dt; if (m.x > m.x1 || m.x < m.x0) { m.dir = -m.dir; m.x = clamp(m.x, m.x0, m.x1); } }
      if (m.y1 !== m.y0) { m.y += m.dir * m.speed * dt; if (m.y > m.y1 || m.y < m.y0) { m.dir = -m.dir; m.y = clamp(m.y, m.y0, m.y1); } }
      m.dx = m.x - ox; m.dy = m.y - oy;
      m.mesh.position.set(m.x + m.w / 2, m.y + 0.8, 0);
    }
    const inp = P.won ? { x: 0.6, jumpHeld: false, jump: false, power: false, down: false } : readInput();
    updatePlayer(dt, inp);
    updateEnemies(dt);
    updateShots(dt);
    updateMinions(dt);
    updatePrints(dt);
    updateBoss(dt);
    // sillas plegables: tiemblan, se caen y vuelven a su sitio
    for (const c of L.crumbles) {
      const t = c.t;
      if (t.shake > 0 && !t.down) {
        t.shake -= dt;
        c.g.position.x = c.x + 0.5 + Math.sin(playT * 60) * 0.06;
        if (t.shake <= 0) { t.down = true; t.back = 4; c.vy = 0; audio.noise({ dur: 0.12, gain: 0.12, filter: "lowpass", freq: 900 }); }
      } else if (t.down) {
        c.vy -= GRAV * dt;
        c.g.position.y += c.vy * dt;
        c.g.rotation.z += dt * 3;
        t.back -= dt;
        const inside = Math.abs(P.x - (c.x + 0.5)) < 0.9 && P.y < c.y + 1.2 && P.y + PH > c.y;
        if (t.back <= 0 && !inside) { t.down = false; t.shake = 0; c.g.position.set(c.x + 0.5, c.y, 0); c.g.rotation.z = 0; spawnInk(c.x + 0.5, c.y + 1, INK.ORANGE, 4, 2); }
      }
    }
    for (const l of L.ventLines) {
      l.m.position.y += l.sp * dt;
      if (l.m.position.y > l.v.y1 + 0.5) l.m.position.y = l.v.y0;
    }
    (L.ventFans || []).forEach((f) => (f.rotation.z += dt * 14));
    for (const c of L.coins) if (!c.got) c.g.rotation.y += dt * 3;
    for (const f of L.fragments) if (!f.got) { f.g.rotation.y += dt * 2; f.g.position.y = f.y + Math.sin(playT * 3 + f.i) * 0.15; }
    for (const s of L.springs) { s.k = Math.max(0, s.k - dt * 4); s.top.scale.set(1.5 + s.k * 0.4, 0.8 - s.k * 0.35, 1.5 + s.k * 0.4); }
    if (P.won && L.flag.position.y > 1.5) L.flag.position.y -= dt * 6;
  }

  // ── overlays y flujo ──
  function showOv(name) {
    $(".pf-start").classList.toggle("hidden", name !== "start");
    $(".pf-pause").classList.toggle("hidden", name !== "pause");
    $(".pf-end").classList.toggle("hidden", name !== "end");
    $(".pf-hud").classList.toggle("hidden", name === "start");
  }
  function resetRun(keepCheckpoint) {
    const cp = keepCheckpoint ? P.cp : 3;
    buildLevel();
    Object.assign(P, {
      x: cp + 0.5, y: 2, vx: 0, vy: 0, g: true, facing: 1, coyote: 0, buf: 0, wall: 0, wallT: 0, hearts: HEARTS, inv: 1, dead: 0,
      cd: 0, dashT: 0, slam: 0, shieldT: 0, riseT: 0, squash: 1, onMover: null, coins: 0, frags: new Set(), zones: new Set(), cp, score: 0, time: 0, won: false, stomps: 0,
      lockT: 0, fly: 1, energy: 1, ball: false, mega: 0, zenT: 0, buffT: 0
    });
    P.y = surfaceAt(P.x) + 0.02; P.prevY = P.y;
    shots.forEach((s) => scene.remove(s.mesh)); powers.forEach((p) => scene.remove(p.mesh)); pickups.forEach((k) => scene.remove(k.g));
    minions.forEach((m) => scene.remove(m.g)); rings.forEach((r) => scene.remove(r.m));
    shots = []; powers = []; pickups = []; minions = []; prints = []; rings = [];
    if (boss) scene.remove(boss.model.group);
    boss = null; bossDone = false; bossWalls = [];
    $(".pf-boss").classList.add("hidden");
    // si se retoma desde un café, los puntos de control anteriores ya están activos
    L.checkpoints.forEach((c) => { if (c.x <= cp) c.on = true; });
    camT.set(P.x, P.y + 3, 0);
  }
  function play() {
    audio.init();
    audio.startMusic();
    screen = "play";
    showOv(null);
    syncPad();
    // recordatorio del poder de tu personaje al empezar
    const pi = POWER_INFO[char.id];
    if (pi) setTimeout(() => { if (screen === "play") msg(`${pi.icon} ${char.ab}: ${pi.desc}`, 4); }, 1900);
  }
  // continuar desde el último café (el nivel es largo: se guarda en este móvil)
  const savedCp = (() => { try { return Number(localStorage.getItem(SAVE_KEY)) || 0; } catch (e) { return 0; } })();
  if (savedCp > 3) {
    const where = savedCp >= 364 ? "el CINK" : savedCp >= 257 ? "Wayra" : savedCp >= 200 ? "la salida del Campus" : "el Campus";
    const bc = $(".pf-continue");
    bc.textContent = `☕ Continuar en ${where}`;
    bc.classList.remove("hidden");
    bc.addEventListener("click", () => { P.cp = savedCp; resetRun(true); play(); big("¡SEGUIMOS!", `Desde ${where}`, 1.4); });
  }
  $(".pf-go").addEventListener("click", () => { resetRun(false); play(); big("LA OFICINA", "Campus → Wayra → CINK: ¡a por la oficina de Clevergy!", 1.8); });
  $(".pf-resume").addEventListener("click", () => play());
  $(".pf-restart").addEventListener("click", () => { resetRun(false); play(); });
  $(".pf-retry").addEventListener("click", () => { const won = P.won; resetRun(!won); play(); });
  $(".pf-quit").addEventListener("click", exit);
  $(".pf-tomap").addEventListener("click", exit);
  $(".pf-exit").addEventListener("click", exit);
  function pause() { if (screen !== "play") return; screen = "pause"; showOv("pause"); syncPad(); }
  $(".pf-pausebtn").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); pause(); });
  $(".pf-swapbtn").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); if (onSwitchChar) onSwitchChar(); });

  // elección de personaje (menú inicial)
  let pickIdx = Math.max(0, CHARS.findIndex((c) => c.id === char.id));
  function renderPick() {
    const c = CHARS[pickIdx];
    const av = getCharacterAvatar(c.id);
    const img = $(".pf-sticker");
    if (av) img.src = av;
    img.classList.toggle("px", !!(av && av.startsWith("data:")));
    $(".pf-pname").textContent = `${c.emoji} ${c.name}`;
    $(".pf-pspecial").textContent = `★ ${c.ab} · ${c.tip || ""}`;
  }
  root.querySelectorAll(".pf-arrow").forEach((b) => b.addEventListener("click", () => {
    pickIdx = (pickIdx + Number(b.dataset.d) + CHARS.length) % CHARS.length;
    audio.init();
    audio.tone({ freq: 700, dur: 0.05, type: "triangle", gain: 0.08 });
    setChar(CHARS[pickIdx]);
    if (onPickChar) try { onPickChar(CHARS[pickIdx].id); } catch (e) {}
    renderPick();
  }));
  renderPick();

  // ── entrada ──
  function onKeyDown(e) {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if ((e.code === "Escape" || e.code === "KeyP") && (screen === "play" || screen === "pause")) screen === "play" ? pause() : play();
    if (e.code === "KeyM") audio.toggleMusic();
  }
  function onKeyUp(e) { keys[e.code] = false; }
  function onBlur() { for (const k in keys) keys[k] = false; pause(); }
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  root.addEventListener("pointerdown", () => { audio.init(); audio.resume(); }, { capture: true });

  const touchPad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "jump", label: "SALTA", icon: ICON.jump, accent: "red" },
      { id: "power", label: "PODER", icon: ICON.special, accent: "blue" }
    ],
    isActive: () => screen === "play",
    onAction: (id, down) => { tp[id] = down; }
  }) : null;
  function syncPad() {
    const portrait = document.body.classList.contains("gameboy-mode");
    if (touchPad) touchPad.setVisible(isTouch && !portrait && screen === "play");
    root.classList.toggle("dd-landpad", isTouch && !portrait);
    $(".pf-swapbtn").classList.toggle("hidden", !onSwitchChar || portrait);
  }
  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let g = null;
    for (const p of pads) if (p && p.connected) { g = p; break; }
    if (!g) { Object.assign(gp, { x: 0, jump: false, power: false, down: false }); return; }
    const b = (i) => !!(g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.4));
    const ax = Math.abs(g.axes[0] || 0) > 0.2 ? g.axes[0] : 0;
    gp.x = ax + (b(15) ? 1 : 0) - (b(14) ? 1 : 0);
    gp.jump = b(0);
    gp.power = b(2) || b(1) || b(3);
    gp.down = b(13) || (g.axes[1] || 0) > 0.7;
    if (b(9) && !gp.prev[9]) screen === "play" ? pause() : screen === "pause" && play();
    gp.prev[9] = b(9);
  }
  const relabels = [];
  for (const [sel, t] of [["#gbLabelA", "SALTAR"], ["#gbLabelB", "PODER"]]) {
    const el = document.querySelector(sel);
    if (el) { relabels.push([el, el.textContent]); el.textContent = t; }
  }

  // ── tamaño y bucle ──
  function resize() {
    const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    camera.aspect = w / h;
    camera.fov = w < h ? 50 : 40;
    camera.updateProjectionMatrix();
    R.setSize(w, h);
    syncPad();
  }
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(root);
  window.addEventListener("resize", resize);
  resize();
  resetRun(false);

  let raf = 0, prevT = performance.now(), acc = 0, wall = 0, camY = 5, devChar = false;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prevT) / 1000);
    prevT = now;
    wall += dt;
    pollGamepad();
    if (getChar && !devChar) { const c = getChar(); if (c && c.id !== char.id) { setChar(c); msg(`${c.emoji} ${c.name} · ★ ${c.ab}`, 1.6); } }
    if (screen === "play") {
      acc += dt;
      while (acc >= STEP) { stepSim(STEP); acc -= STEP; }
      updateFx(dt);
    } else acc = 0;
    if (screen === "start") {
      // presentación: la cámara recorre el nivel despacio
      const x = 12 + (Math.sin(wall * 0.04) * 0.5 + 0.5) * (LEVEL_W - 30);
      const y = surfaceAt(x) + 3;
      camY += (y - camY) * 0.02;
      camera.position.set(x, camY + 2, 22);
      camera.lookAt(x, camY, 0);
    } else updateCamera(dt);
    drawPlayer(screen === "play" ? dt : 0);
    updateHud(dt);
    R.render(scene, camera, { time: wall, hurt: P.flash > 0 ? 0.4 : 0, lowHp: screen === "play" && P.hearts === 1 ? 1 : 0, flash: 0 }, overlay);
  }
  raf = requestAnimationFrame(frame);

  let destroyed = false;
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("resize", resize);
    if (ro) ro.disconnect();
    relabels.forEach(([el, t]) => (el.textContent = t));
    document.body.classList.remove("doodle-mode");
    sticker.dispose();
    if (touchPad) touchPad.destroy();
    audio.destroy();
    R.dispose();
    root.remove();
    if (window.__plat) delete window.__plat;
  }
  function exit() { destroy(); if (onExit) onExit(); }
  if (import.meta.env && import.meta.env.DEV) window.__plat = { P, step: (n = 1) => { for (let i = 0; i < n; i++) stepSim(STEP); }, setChar: (id) => { devChar = true; setChar(charById(id)); }, get prints() { return prints; }, get minions() { return minions; }, get L() { return L; }, get boss() { return boss; }, get enemies() { return enemies; }, get screen() { return screen; } };

  showOv("start");
  return { destroy, exit };
}
