// =============================================================================
// doodlePlatform.js — MUNDO 1 · THE OFFICE (plataformas 2.5D dibujadas a boli)
// Mismo motor visual que el resto de mundos 3D: render de boli, pegatinas y el
// mando común. Mecánicas: salto variable, "coyote time", búfer de salto, salto en
// pared, pisotón, bloques ? y ladrillos, muelles, plataformas móviles, puntos de
// control, 3 disquetes secretos, el jefe EMAIL CHAIN y la bandera de INBOX ZERO.
// Cada personaje usa su especial de la pelea como poder (embestida, proyectil,
// golpe al suelo, supersalto o escudo).
// =============================================================================

import * as THREE from "three";
import { createDoodleRenderer, INK, mat } from "../doodleRender.js";
import { DoodleAudio } from "../doodleAudio.js";
import { GEO } from "../doodleLevel.js";
import { createSticker } from "../doodleSticker.js";
import { createTouchPad, ICON } from "../touchPad.js";
import { makeEmail, makeMeeting, makeClock, makeBoss } from "../doodleActors.js";
import { specialFor, rollMulti, specialCooldown } from "../fight/fightMoves.js";
import { touch as mando } from "../../engine/input.js";
import { CHARS } from "../../config/characters.js";
import { getCharacterAvatar } from "../../engine/sprites.js";
import { makeLevel, LEVEL_W } from "./platformLevel.js";
import "../doodle.css";
import "../fight/fight.css";
import "./platform.css";

const STEP = 1 / 60;
const GRAV = 34;
const PW = 0.78, PH = 1.7;
const COYOTE = 0.1, BUFFER = 0.13;
const MAX_FALL = 22;
const HEARTS = 3;

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
      <div class="dd-kicker">MUNDO 1 · PLATAFORMAS</div>
      <h1 class="pf-title">The Office</h1>
      <p class="pf-lead">Cruza la oficina de Clevergy, recoge monedas y los 3 disquetes con el código, y tumba a <b>EMAIL CHAIN</b> para llegar a <b>INBOX ZERO</b>.</p>
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
        <div><b>Poder</b>: el especial de tu personaje (cámbialo en cualquier momento con EQUIPO)</div>
      </div>
      <div class="pf-help dd-desktop-only">A/D mover · Espacio/W saltar · J poder · S bajar · Tab compañero · Esc pausa · 🎮 mando</div>
      <div class="dd-btns">
        <button class="dd-btn pf-go">¡A jugar!</button>
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
  let sp = specialFor(char.id);
  let cdMax = specialCooldown(char) * 0.8;
  let L = null; // nivel (se regenera al reiniciar)
  const levelRoot = new THREE.Group();
  scene.add(levelRoot);
  const P = {
    x: 3, y: 2, vx: 0, vy: 0, g: false, facing: 1, coyote: 0, buf: 0, wall: 0, wallT: 0, jumpHeld: false,
    hearts: HEARTS, inv: 0, dead: 0, cd: 0, dashT: 0, slam: 0, shieldT: 0, riseT: 0, squash: 1, flash: 0, onMover: null,
    coins: 0, frags: new Set(), cp: 3, score: 0, time: 0, won: false, stomps: 0, pose: "idle", poseT: 0
  };
  let enemies = [], shots = [], powers = [], pickups = [], pops = [];
  let boss = null, bossDone = false, bossWalls = [];
  const sticker = createSticker(overlay, { height: 1.95 });
  const shadow = new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true }));
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  function setChar(c) {
    char = c;
    sp = specialFor(c.id);
    cdMax = specialCooldown(c) * 0.8;
    P.cd = Math.min(P.cd, 0.5);
    sticker.setChar(c.id);
    $(".pf-power-name").textContent = `★ ${sp.name}`;
  }
  setChar(char);
  const speedMax = () => 7.6 + ((char.spd || 3.5) - 3.5) * 0.9;
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
  const solidT = (t) => t && (t.t === "g" || t.t === "s" || t.t === "b" || t.t === "q" || t.t === "u" || t.t === "w");
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
  function buildDecor(d) {
    const g = new THREE.Group();
    g.position.set(d.x, 2, -3.2);
    levelRoot.add(g);
    if (d.type === "desk") {
      box(g, 0, 0.8, 0, 3, 0.1, 1.4, INK.ORANGE, { tone: 0.1 });
      box(g, -1.3, 0.4, 0, 0.1, 0.8, 1.2, INK.BLACK, {});
      box(g, 1.3, 0.4, 0, 0.1, 0.8, 1.2, INK.BLACK, {});
      box(g, 0, 1.35, -0.4, 1.2, 0.8, 0.06, INK.BLACK, { tone: -0.2 });
      box(g, 0.9, 0.95, 0, 0.15, 0.2, 0.15, INK.RED, { tone: 0.1 });
    } else if (d.type === "plant") {
      box(g, 0, 0.35, 0, 0.7, 0.7, 0.7, INK.ORANGE, { tone: 0.05 });
      const s = new THREE.Mesh(GEO.sph, mat(INK.GREEN, { tone: -0.05 }));
      s.scale.setScalar(1.3); s.position.y = 1.3; g.add(s);
    } else if (d.type === "window") {
      g.position.z = -5.6;
      box(g, 0, 4.2, 0, 5, 3.6, 0.05, INK.BLUE, { tone: 0.3 });
      box(g, 0, 4.2, 0.05, 5.2, 0.14, 0.1, INK.BLACK, {});
      box(g, 0, 2.4, 0.05, 5.2, 0.14, 0.1, INK.BLACK, {});
      box(g, 0, 4.2, 0.05, 0.14, 3.6, 0.1, INK.BLACK, {});
    } else if (d.type === "board") {
      g.position.z = -5.6;
      box(g, 0, 3.6, 0, 4, 2.4, 0.08, INK.BLACK, { tone: 0.45 });
      for (let k = 0; k < 4; k++) { const m = box(g, rnd(-1.2, 1.2), 3.2 + k * 0.4, 0.06, rnd(0.8, 1.8), 0.08, 0.02, k % 2 ? INK.RED : INK.BLUE, { fill: true }); m.rotation.z = rnd(-0.3, 0.3); }
    } else if (d.type === "meeting") {
      box(g, 0, 0.75, 0, 5, 0.1, 2, INK.BLACK, { tone: 0.15 });
      for (let k = -2; k <= 2; k += 2) box(g, k, 0.4, 1.3, 0.6, 0.8, 0.6, INK.PURPLE, { tone: -0.1 });
    } else if (d.type === "rack") {
      box(g, 0, 1.6, 0, 1.6, 3.2, 1.2, INK.BLACK, { tone: -0.15 });
      for (let k = 0; k < 5; k++) box(g, 0, 0.5 + k * 0.55, 0.62, 1.2, 0.06, 0.02, INK.GREEN, { fill: true });
    } else if (d.type === "hq") {
      g.position.set(d.x, 2, -2.5);
      box(g, 0, 4, 0, 7, 8, 3, INK.BLUE, { tone: 0.12 });
      for (let r = 0; r < 3; r++) for (let c = -1; c <= 1; c++) box(g, c * 2, 2 + r * 2.2, 1.52, 1.2, 1.2, 0.05, INK.BLUE, { tone: 0.35 });
      box(g, 0, 8.4, 0, 7.6, 0.8, 3.4, INK.GREEN, { tone: 0 });
      box(g, 0, 0.9, 1.52, 1.4, 1.8, 0.06, INK.BLACK, { fill: true }); // puerta
    }
  }
  function buildLevel() {
    // vacía el nivel anterior
    while (levelRoot.children.length) levelRoot.remove(levelRoot.children[0]);
    tileMesh.clear();
    L = makeLevel();
    // fondo: pared, suelo trasero y ciudad a lo lejos
    box(levelRoot, LEVEL_W / 2, 8, -6.2, LEVEL_W + 60, 16, 0.4, INK.BLUE, { tone: 0.12 });
    box(levelRoot, LEVEL_W / 2, 1, -4, LEVEL_W + 60, 2, 4, INK.BLACK, { tone: 0.35 });
    for (let x = -20; x < LEVEL_W + 30; x += rnd(6, 11)) {
      const h = rnd(10, 30);
      box(levelRoot, x, h / 2 - 2, -40, rnd(5, 9), h, 3, INK.BLACK, { tone: 0.42 });
    }
    // casillas: agrupa tramos iguales por fila (menos objetos que dibujar)
    const done = new Set();
    for (let y = 0; y < 20; y++) {
      for (let x = -2; x < LEVEL_W + 2; x++) {
        const t = T(x, y);
        if (!t || done.has(`${x},${y}`)) continue;
        if (t.t === "b") { tileMesh.set(`${x},${y}`, brickMesh(x, y)); continue; }
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
        } else if (t.t === "p") {
          box(levelRoot, cx, y + 0.82, 0, w, 0.36, 2, INK.GREEN, { tone: -0.25 });
        }
      }
    }
    // borde superior de los suelos y sólidos (el canto de la mesa / moqueta)
    for (let y = 0; y < 20; y++) {
      let run = null;
      for (let x = -2; x <= LEVEL_W + 2; x++) {
        const t = T(x, y), top = t && (t.t === "g" || t.t === "s") && !solidT(T(x, y + 1));
        if (top && !run) run = { x0: x, t: t.t };
        if ((!top || (run && t && t.t !== run.t)) && run) {
          const w = x - run.x0;
          box(levelRoot, run.x0 + w / 2, y + 0.95, 0, w, 0.12, run.t === "g" ? 4.02 : 2.42, run.t === "g" ? INK.ORANGE : INK.GREEN, { tone: 0.05 });
          run = top ? { x0: x, t: t.t } : null;
        }
      }
    }
    L.decor.forEach(buildDecor);
    // cafeteras de control
    L.checkpoints.forEach((c) => {
      const g = new THREE.Group();
      g.position.set(c.x, 2, -0.8);
      box(g, 0, 0.9, 0, 1.2, 1.8, 1, INK.ORANGE, { tone: -0.05 });
      box(g, 0, 1.3, 0.52, 0.7, 0.4, 0.04, INK.BLACK, { fill: true });
      box(g, 0, 0.35, 0.3, 0.3, 0.3, 0.3, INK.GREEN, { tone: 0.05 });
      levelRoot.add(g);
      c.g = g;
      c.on = false;
    });
    // muelles
    L.springs.forEach((s) => {
      const g = new THREE.Group();
      g.position.set(s.x + 0.5, s.y, 0);
      box(g, 0, 0.1, 0, 1, 0.2, 1, INK.BLACK, {});
      const coil = new THREE.Mesh(GEO.torus, mat(INK.RED, { fill: true }));
      coil.scale.set(0.8, 0.8, 1.6);
      coil.rotation.x = Math.PI / 2;
      coil.position.y = 0.35;
      g.add(coil);
      s.top = box(g, 0, 0.6, 0, 1.1, 0.16, 1.1, INK.RED, { tone: 0.05 });
      levelRoot.add(g);
      s.g = g; s.k = 0;
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
    const inp = { x: clamp(x, -1, 1), jumpHeld, jump: jumpHeld && !prev.jump, power: powerHeld && !prev.power, down };
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

    // horizontal: aceleración con inercia (más agarre en el suelo)
    if (P.dashT > 0) {
      P.dashT -= dt;
      P.vx = P.facing * sp.speed * 1.15;
      P.vy = Math.max(P.vy, 0);
      if (P.dashT <= 0) P.vx *= 0.5;
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
      P.vy = jumpV() * 0.92; P.vx = -P.wall * 9.5; P.facing = -P.wall; P.buf = 0; P.wallT = 0.16; sfx.jump(); P.jumpHeld = true;
      spawnInk(P.x + P.wall * PW / 2, P.y + 1, INK.BLUE, 5, 3);
    }
    if (P.wallT > 0) { P.wallT -= dt; } // durante el rebote no se "pega" a la pared
    // salto variable: si sueltas pronto, subes menos
    if (!inp.jumpHeld && P.vy > 5 && P.jumpHeld && P.riseT <= 0) { P.vy *= 0.5; P.jumpHeld = false; }
    if (!inp.jumpHeld) P.jumpHeld = false;

    // poder del personaje
    if (inp.power && P.cd <= 0) usePower();

    // gravedad (deslizarse por la pared cae despacio)
    P.vy -= GRAV * dt * (P.slam ? 1.6 : 1);
    if (P.wall && P.vy < -4 && P.wallT <= 0 && Math.sign(inp.x) === P.wall) P.vy = -4;
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
    if (res.head) {
      // cabezazo al bloque que tienes encima (el más centrado)
      const tx = Math.floor(P.x);
      const t = T(tx, res.head.ty);
      bumpTile(solidT(t) ? tx : res.head.tx, res.head.ty, false);
    }
    if (P.g && !wasG) {
      P.squash = 0.72;
      if (P.slam) { P.slam = 0; slamImpact(); }
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
      if (P.vy <= 0 && Math.abs(P.x - (s.x + 0.5)) < 0.8 && P.y <= s.y + 0.75 && P.y >= s.y - 0.1) {
        P.vy = 29; P.g = false; s.k = 1; sfx.spring(); P.jumpHeld = false; P.squash = 1.4;
      }
    }
    // pinchos
    const under = T(Math.floor(P.x), Math.floor(P.y + 0.1));
    if (under && under.t === "x") hurt(P.x - P.facing);
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
        P.hearts = Math.max(P.hearts, HEARTS);
      }
    }
    if (!P.won && P.x > L.flagX - 0.2 && P.x < L.flagX + 1.2) finish();
  }

  function usePower() {
    const d = sp.kind === "multi" ? rollMulti() : sp;
    P.cd = cdMax;
    sfx.power();
    P.pose = "attack"; P.poseT = 0.35;
    if (d.kind === "dash") { P.dashT = 0.24; spawnInk(P.x, P.y + 0.8, d.ink, 6, 3); }
    else if (d.kind === "proj") {
      powers.push({
        x: P.x + P.facing * 0.6, y: P.y + (d.ground ? 0.3 : 1.0), vx: P.facing * (d.speed + 3), vy: d.arc ? (d.vy || 6) : 0,
        arc: !!d.arc, ground: !!d.ground, life: 2.2, ink: d.ink, mesh: powerMesh(d.ink, d.shape)
      });
    } else if (d.kind === "slam") {
      if (P.g) { P.vy = 10; P.g = false; }
      P.slam = 1;
      setTimeout(() => { if (P.slam) P.vy = -30; }, 160);
    } else if (d.kind === "rise") {
      P.vy = jumpV() * 1.35; P.g = false; P.riseT = 0.5; P.vx = P.facing * 3; spawnInk(P.x, P.y, d.ink, 10, 4);
    } else if (d.kind === "shield") {
      P.shieldT = 1.6; P.inv = Math.max(P.inv, 1.6);
    }
  }
  function powerMesh(ink, shape) {
    const g = new THREE.Group();
    if (shape === "wave" || shape === "micro") { const r = new THREE.Mesh(GEO.torus, mat(ink, { fill: true })); r.scale.setScalar(0.6); r.rotation.y = Math.PI / 2; g.add(r); }
    else box(g, 0, 0, 0, 0.5, 0.5, 0.5, ink, { tone: 0.05 });
    scene.add(g);
    return g;
  }
  function slamImpact() {
    spawnInk(P.x, P.y + 0.2, sp.ink, 18, 7);
    shake(0.8);
    sfx.brick();
    for (const e of enemies) if (e.alive && Math.abs(e.x - P.x) < 3 && Math.abs(e.y - P.y) < 1.6) killEnemy(e, true);
    if (boss && boss.state === "tired" && Math.abs(boss.x - P.x) < 3) hitBoss();
    // rompe los ladrillos de debajo
    for (let dx = -1; dx <= 1; dx++) {
      const tx = Math.floor(P.x + dx * 0.5), ty = Math.floor(P.y - 0.5);
      const t = T(tx, ty);
      if (t && (t.t === "b" || t.t === "q")) bumpTile(tx, ty, true);
    }
  }

  function hurt(fromX) {
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
    P.x = P.cp + 0.5; P.y = 6; P.vx = 0; P.vy = 0; P.inv = 1.6; P.slam = 0; P.dashT = 0;
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
        if (stomp || P.shieldT > 0 || P.dashT > 0 || P.riseT > 0 || P.slam) {
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
        if (P.shieldT <= 0) hurt(s.x);
      }
      if (s.life <= 0) { scene.remove(s.mesh); spawnInk(s.x, s.y, INK.ORANGE, 4, 2); }
    }
    shots = shots.filter((s) => s.life > 0);
    for (const p of powers) {
      p.life -= dt;
      if (p.arc) p.vy -= 20 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.arc && solidAt(p.x, p.y - 0.25) && p.vy < 0) { p.y = Math.floor(p.y - 0.25) + 1.25; p.vy = 7; }
      if (p.ground) { p.y = Math.max(p.y, 0); if (!solidAt(p.x, p.y - 0.4)) p.vy -= 20 * dt; else { p.vy = 0; p.y = Math.floor(p.y - 0.4) + 1.3; } }
      p.mesh.position.set(p.x, p.y, 0.3);
      p.mesh.rotation.z -= dt * 10 * Math.sign(p.vx);
      const tx = Math.floor(p.x), ty = Math.floor(p.y);
      const t = T(tx, ty);
      if (t && (t.t === "b" || t.t === "q")) { bumpTile(tx, ty, true); p.life = 0; }
      else if (solidT(t)) p.life = 0;
      for (const e of enemies) if (e.alive && Math.abs(e.x - p.x) < 0.8 && p.y > e.y - 0.2 && p.y < e.y + e.h + 0.2) { killEnemy(e, true); p.life = 0; }
      if (boss && boss.state === "tired" && Math.abs(boss.x - p.x) < 1.6 && p.y < boss.y + 3.2) { hitBoss(); p.life = 0; }
      if (p.life <= 0) { scene.remove(p.mesh); spawnInk(p.x, p.y, p.ink, 6, 3); }
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
    P.won = true;
    const grab = clamp((P.y - 2) / 10, 0, 1);
    P.score += Math.round(grab * 2000) + Math.max(0, 3000 - Math.round(P.time) * 10);
    audio.victory();
    big("¡NIVEL SUPERADO!", `Bandera a ${Math.round(grab * 100)}% de altura`, 2.4);
    setTimeout(endScreen, 2600, true);
  }
  function rankFor() {
    const coinRatio = P.coins / Math.max(1, L.coins.length);
    let pts = P.frags.size + (coinRatio > 0.6 ? 1 : 0) + (P.time < 240 ? 1 : 0) + (P.hearts === HEARTS ? 1 : 0);
    return pts >= 5 ? "S" : pts >= 3 ? "A" : pts >= 2 ? "B" : "C";
  }
  function endScreen(win) {
    screen = "end";
    const rank = win ? rankFor() : "";
    $(".pf-end-kicker").textContent = win ? "MUNDO 1 · THE OFFICE" : "GAME OVER";
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
    for (let y = 12; y >= 0; y--) if (solidAt(x, y)) { gy = y + 1; break; }
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
  }

  // ── cámara lateral ──
  const camT = new THREE.Vector3(8, 5, 0);
  function updateCamera(dt) {
    const portrait = root.clientWidth < root.clientHeight;
    const dist = portrait ? 18 : 13.5;
    let tx = P.x + P.facing * 2.5 + P.vx * 0.2;
    let ty = clamp(P.y + 1.6, 4.2, 13);
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
    hud.score.textContent = P.score.toLocaleString("es-ES");
    hud.power.style.width = `${(1 - P.cd / cdMax) * 100}%`;
    hud.power.parentElement.classList.toggle("ready", P.cd <= 0);
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
    updateBoss(dt);
    for (const c of L.coins) if (!c.got) c.g.rotation.y += dt * 3;
    for (const f of L.fragments) if (!f.got) { f.g.rotation.y += dt * 2; f.g.position.y = f.y + Math.sin(playT * 3 + f.i) * 0.15; }
    for (const s of L.springs) { s.k = Math.max(0, s.k - dt * 4); s.top.position.y = 0.6 + s.k * 0.5; }
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
      cd: 0, dashT: 0, slam: 0, shieldT: 0, riseT: 0, squash: 1, onMover: null, coins: 0, frags: new Set(), cp, score: 0, time: 0, won: false, stomps: 0
    });
    shots.forEach((s) => scene.remove(s.mesh)); powers.forEach((p) => scene.remove(p.mesh)); pickups.forEach((k) => scene.remove(k.g));
    shots = []; powers = []; pickups = [];
    if (boss) scene.remove(boss.model.group);
    boss = null; bossDone = false; bossWalls = [];
    $(".pf-boss").classList.add("hidden");
    // si se retoma desde un café, los puntos de control anteriores ya están activos
    L.checkpoints.forEach((c) => { if (c.x <= cp) c.on = true; });
    camT.set(P.x, 5, 0);
  }
  function play() {
    audio.init();
    audio.startMusic();
    screen = "play";
    showOv(null);
    syncPad();
  }
  $(".pf-go").addEventListener("click", () => { resetRun(false); play(); big("THE OFFICE", "¡A por el Inbox Zero!", 1.6); });
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
    $(".pf-pspecial").textContent = `★ Poder: ${specialFor(c.id).name}`;
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

  let raf = 0, prevT = performance.now(), acc = 0, wall = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prevT) / 1000);
    prevT = now;
    wall += dt;
    pollGamepad();
    if (getChar) { const c = getChar(); if (c && c.id !== char.id) { setChar(c); msg(`${c.emoji} ${c.name} · ★ ${sp.name}`, 1.6); } }
    if (screen === "play") {
      acc += dt;
      while (acc >= STEP) { stepSim(STEP); acc -= STEP; }
      updateFx(dt);
    } else acc = 0;
    if (screen === "start") {
      // presentación: la cámara recorre el nivel despacio
      const x = 12 + (Math.sin(wall * 0.08) * 0.5 + 0.5) * 150;
      camera.position.set(x, 7, 22);
      camera.lookAt(x, 5, 0);
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
  if (import.meta.env && import.meta.env.DEV) window.__plat = { P, get L() { return L; }, get boss() { return boss; }, get enemies() { return enemies; }, get screen() { return screen; } };

  showOv("start");
  return { destroy, exit };
}
