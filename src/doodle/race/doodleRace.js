// =============================================================================
// doodleRace.js — MUNDO 4 · PANTANO KART (carreras de motos de agua, Three.js)
// Carreras estilo kart por el Pantano de San Juan dibujado a boli.
// · 3 vueltas, 6 pilotos (tú + CPU), u online hasta 20 personas (con CPUs si sois menos de 6).
// · Derrape con miniturbo, rampas, flechas de turbo y cajas de objetos de oficina.
// · Online P2P (PeerJS): cada móvil simula su moto y envía su estado; el anfitrión
//   simula las motos de la CPU, sincroniza el reloj, da la salida y cierra la carrera.
//   Quien lanza un objeto decide si impacta y avisa a la víctima (el anfitrión reenvía).
// =============================================================================

import * as THREE from "three";
import { createDoodleRenderer, INK, mat } from "../doodleRender.js";
import { DoodleAudio } from "../doodleAudio.js";
import { GEO } from "../doodleLevel.js";
import { createSticker } from "../doodleSticker.js";
import { createTouchPad, ICON } from "../touchPad.js";
import { createNet, randomCode, cleanCode } from "../doodleNet.js";
import { touch as mando } from "../../engine/input.js";
import { CHARS } from "../../config/characters.js";
import { getCharacterAvatar } from "../../engine/sprites.js";
import { buildTrack, buildRaceWorld, waveH, TRACK_HALF, N_SAMPLES } from "./raceTrack.js";
import "../doodle.css";
import "../fight/fight.css"; // selector de piloto y botones compartidos con la pelea
import "./race.css";

const STEP = 1 / 60;
const LAPS = 3;
const RACERS = 6; // parrilla mínima (se rellena con CPUs)
const MAX_ONLINE = 20; // personas por sala online
const BOAT_R = 1.7;
const SEND_HZ = 20;
const INTERP_MS = 110;
const INKS = [INK.RED, INK.BLUE, INK.GREEN, INK.ORANGE, INK.PURPLE, INK.BLACK];

const ITEMS = {
  cafe: { icon: "☕", name: "Café turbo" },
  email: { icon: "✉️", name: "Email" },
  reunion: { icon: "📅", name: "Reunión" },
  tinta: { icon: "💧", name: "Mancha de tinta" },
  focus: { icon: "⭐", name: "Modo focus" }
};
// probabilidades según tu posición (los de atrás reciben mejores objetos)
const ODDS = [
  { tinta: 40, email: 40, cafe: 20 },
  { email: 32, cafe: 30, reunion: 20, tinta: 18 },
  { email: 25, cafe: 30, reunion: 30, tinta: 10, focus: 5 },
  { cafe: 32, reunion: 38, focus: 20, email: 10 }
];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const charById = (id) => CHARS.find((c) => c.id === id) || CHARS[0];
const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`;

const TEMPLATE = `
<canvas class="dd-canvas"></canvas>
<div class="rk-hud hidden">
  <div class="rk-pos"><b>1º</b><small>/6</small></div>
  <div class="rk-lap">VUELTA <b>1</b>/${LAPS}</div>
  <div class="rk-time">0:00.00</div>
  <div class="rk-item"><span></span></div>
  <canvas class="rk-map" width="240" height="240"></canvas>
  <div class="rk-speed"><b>0</b> km/h</div>
  <div class="rk-speedlines"></div>
  <div class="rk-big"></div>
  <div class="rk-msg"></div>
  <div class="rk-ping"></div>
  <div class="dd-hudbtns"><button class="dd-hb rk-pausebtn" aria-label="Pausa">❚❚</button></div>
</div>

<div class="dd-ov rk-lobby">
  <div class="dd-card rk-card">
    <div class="rk-col">
      <div class="dd-kicker">MUNDO 4 · CARRERAS</div>
      <h1 class="rk-title">Pantano de San Juan</h1>
      <div class="rk-place">📍 Pantano de San Juan · Madrid</div>
      <div class="rk-picker">
        <button class="cf-arrow rk-arrow" data-d="-1" aria-label="Anterior">◀</button>
        <div class="rk-preview"><img class="cf-sticker rk-sticker" alt=""><div class="cf-pname rk-pname"></div></div>
        <button class="cf-arrow rk-arrow" data-d="1" aria-label="Siguiente">▶</button>
      </div>
    </div>
    <div class="rk-col">
      <button class="dd-btn rk-solo">🏁 Carrera contra la CPU</button>
      <div class="dd-mp rk-online">
        <div class="dd-mp-head">📱 <b>Online</b> <small>hasta 20 · CPUs si sois menos de 6</small></div>
        <div class="dd-mp-row rk-lobbyrow">
          <button class="dd-btn dd-mini rk-create">Crear sala</button>
          <input class="dd-mp-code rk-code" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" spellcheck="false" />
          <button class="dd-btn dd-mini dd-ghost rk-join">Unirse</button>
        </div>
        <div class="rk-room hidden">
          <div class="dd-mp-coderow">Sala <b class="dd-mp-codebig rk-codebig"></b> <button class="dd-btn dd-mini dd-ghost rk-copy">Copiar</button></div>
          <div class="dd-mp-list rk-list"></div>
          <div class="dd-btns rk-roombtns">
            <button class="dd-btn dd-mini rk-go">¡Salida!</button>
            <button class="dd-btn dd-mini dd-ghost rk-leave">Salir</button>
          </div>
        </div>
        <div class="dd-mp-status rk-status"></div>
      </div>
      <div class="rk-help dd-desktop-only">A/D girar · Espacio derrapar (mantén y suelta = turbo) · E objeto · S frenar · 🎮 mando</div>
      <div class="rk-help dd-touch-only">Acelera sola · joystick: girar · DERRAPE: mantén en curva y suelta = turbo · OBJETO · FRENO</div>
      <button class="dd-btn dd-ghost dd-mini rk-exit">Volver al mapa</button>
    </div>
  </div>
</div>

<div class="dd-ov dd-pause rk-pause hidden">
  <div class="dd-card dd-small">
    <h2>Pausa</h2>
    <p class="rk-pause-note"></p>
    <div class="dd-btns">
      <button class="dd-btn rk-resume">Seguir</button>
      <button class="dd-btn dd-ghost rk-quit">Salir al menú</button>
    </div>
  </div>
</div>

<div class="dd-ov rk-end hidden">
  <div class="dd-card dd-small">
    <div class="dd-kicker">PANTANO DE SAN JUAN · ${LAPS} VUELTAS</div>
    <h2 class="rk-end-title"></h2>
    <div class="rk-results"></div>
    <div class="dd-btns">
      <button class="dd-btn rk-again">Otra carrera</button>
      <button class="dd-btn dd-ghost rk-tolobby">Menú</button>
    </div>
  </div>
</div>`;

export function startDoodleRace({ charId, onPickChar, onExit, onVictory } = {}) {
  const root = document.createElement("div");
  root.id = "doodleRoot";
  root.className = "rk-root";
  root.innerHTML = TEMPLATE;
  (document.getElementById("wrap") || document.body).appendChild(root);
  document.body.classList.add("doodle-mode");
  const $ = (s) => root.querySelector(s);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  root.classList.toggle("dd-is-touch", isTouch);

  const canvas = $(".dd-canvas");
  const R = createDoodleRenderer(canvas, { fadeScale: 3.2 });
  const audio = new DoodleAudio();
  const scene = new THREE.Scene();
  const overlay = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(68, 1, 0.3, 1400);
  scene.add(camera);
  const track = buildTrack();
  const world = buildRaceWorld(scene, track);

  // ── estado ──
  let screen = "lobby"; // lobby | race | end
  let phase = "idle"; // countdown | race | done
  let paused = false;
  let mode = "solo"; // solo | online
  let myChar = charId || CHARS[0].id;
  let racers = [];
  let me = null;
  const RC = { startAt: 0, goAt: 0, firstFinishAt: 0, events: [], results: null, t: 0 };
  let projectiles = [];
  let puddles = [];
  let objSeq = 0;
  const DBG = { autopilot: false }; // sólo para pruebas en desarrollo
  const clock = { offset: 0, samples: [], rtt: 0 };
  const hostNow = () => performance.now() + clock.offset;
  const schedule = (at, fn) => RC.events.push({ at, fn });

  // ── red ──
  const net = createNet({ prefix: "clevergy-race-", maxPlayers: MAX_ONLINE });
  const online = { on: false, roster: [], lastRx: new Map(), pingT: 0, sendT: 0 };
  const tx = (m) => (net.isHost ? net.broadcast(m) : net.send(m));
  const isAuthority = () => mode === "solo" || net.isHost;

  // ── sonido: motor continuo + efectos ──
  let engine = null;
  function startEngine() {
    if (engine || !audio.ctx) return;
    const c = audio.ctx;
    const o1 = c.createOscillator(), o2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
    o1.type = "sawtooth"; o2.type = "square";
    f.type = "lowpass"; f.frequency.value = 600;
    g.gain.value = 0;
    o1.connect(f); o2.connect(f); f.connect(g).connect(audio.master);
    o1.start(); o2.start();
    engine = { o1, o2, f, g };
  }
  function updateEngine(v, boost) {
    if (!engine) return;
    const t = audio.ctx.currentTime, k = clamp(v / 34, 0, 1.3);
    engine.o1.frequency.setTargetAtTime(55 + k * 85 + (boost ? 25 : 0), t, 0.08);
    engine.o2.frequency.setTargetAtTime(27 + k * 42, t, 0.08);
    engine.f.frequency.setTargetAtTime(380 + k * 900, t, 0.1);
    engine.g.gain.setTargetAtTime(screen === "race" && !paused ? 0.035 + k * 0.03 : 0, t, 0.1);
  }
  const sfx = {
    beep: (hi) => audio.tone({ freq: hi ? 1320 : 660, dur: hi ? 0.45 : 0.14, type: "square", gain: 0.12 }),
    boost: () => audio.noise({ dur: 0.45, gain: 0.3, filter: "bandpass", freq: 500, to: 3200, q: 0.8 }),
    splash: () => audio.noise({ dur: 0.35, gain: 0.3, filter: "lowpass", freq: 1400, to: 200 }),
    bump: () => { audio.tone({ freq: 120, to: 60, dur: 0.15, type: "square", gain: 0.12 }); audio.noise({ dur: 0.1, gain: 0.15, filter: "lowpass", freq: 700 }); },
    box: () => audio.tone({ freq: 880, to: 1320, dur: 0.12, type: "triangle", gain: 0.12 }),
    roll: () => audio.tone({ freq: rnd(900, 1400), dur: 0.03, type: "square", gain: 0.04 }),
    spin: () => { audio.tone({ freq: 700, to: 140, dur: 0.6, type: "sawtooth", gain: 0.12 }); audio.noise({ dur: 0.4, gain: 0.25, filter: "bandpass", freq: 1200, q: 1 }); },
    throw: () => audio.noise({ dur: 0.15, gain: 0.2, filter: "highpass", freq: 1800 }),
    lap: () => [72, 76, 79].forEach((n, i) => audio.tone({ freq: 440 * Math.pow(2, (n - 69) / 12), dur: 0.18, type: "triangle", gain: 0.13, delay: i * 0.1 })),
    drift: (lvl) => audio.tone({ freq: lvl === 2 ? 1500 : 1000, dur: 0.07, type: "triangle", gain: 0.06 })
  };

  // ── motos ──
  function makeBoat(ink) {
    const g = new THREE.Group();
    const body = new THREE.Group();
    g.add(body);
    const put = (geo, i, o, s, p, rot) => { const m = new THREE.Mesh(geo, mat(i, o)); m.scale.set(...s); m.position.set(...p); if (rot) m.rotation.set(...rot); body.add(m); return m; };
    put(GEO.box, ink, { tone: 0.05 }, [1.5, 0.6, 3.0], [0, 0.35, -0.2]);
    put(GEO.cone, ink, { tone: 0.05 }, [1.5, 1.3, 0.6], [0, 0.35, 1.9], [Math.PI / 2, 0, 0]);
    put(GEO.box, INK.BLACK, { tone: -0.1 }, [0.9, 0.35, 1.3], [0, 0.8, -0.5]);
    put(GEO.box, ink, { fill: true }, [1.52, 0.12, 3.02], [0, 0.45, -0.2]);
    put(GEO.box, INK.BLACK, { fill: true }, [1.1, 0.08, 0.08], [0, 1.25, 0.55]);
    put(GEO.box, INK.BLACK, {}, [0.12, 0.5, 0.12], [0, 1.0, 0.55]);
    put(GEO.box, INK.BLACK, { tone: 0.2 }, [0.8, 0.5, 0.06], [0, 1.05, 0.95], [-0.5, 0, 0]);
    scene.add(g);
    return { g, body };
  }
  function mkRacer(opt, slot) {
    const cfg = charById(opt.cid);
    const p = track.at(N_SAMPLES - 6 - Math.floor(slot / 2) * 6);
    const lat = (slot % 2 ? 1 : -1) * 4.5;
    const r = {
      id: opt.id, name: opt.n || cfg.name, emoji: opt.e || cfg.emoji, cid: opt.cid, cfg, ctrl: opt.ctrl, slot,
      ink: INKS[slot % INKS.length],
      x: p.x - p.tz * lat, z: p.z + p.tx * lat, y: 0, vy: 0, yaw: Math.atan2(p.tx, p.tz), v: 0, lat: 0, air: false,
      steer: 0, drift: 0, driftT: 0, driftLvl: 0, boostT: 0, spinT: 0, starT: 0, item: null, roll: 0, rollItem: null,
      idx: N_SAMPLES - 6 - Math.floor(slot / 2) * 6, lap: 0, half: true, prog: 0, finished: false, finishT: 0, rank: slot + 1,
      maxV: 31 + ((cfg.spd || 3.5) - 3.5) * 1.6, handling: 1.55 + ((cfg.jump || 9.5) - 9.5) * 0.08,
      lane: rnd(-6, 6), laneT: 0, skill: rnd(0.9, 0.98), aiT: 0, aiItemT: rnd(1, 3), buf: [], tilt: 0, wakeT: 0,
      boat: makeBoat(INKS[slot % INKS.length]), sticker: createSticker(overlay, { height: 1.55 })
    };
    r.sticker.setChar(opt.cid);
    return r;
  }
  function disposeRacers() {
    for (const r of racers) { scene.remove(r.boat.g); r.sticker.dispose(); }
    racers = [];
    me = null;
    projectiles.forEach((p) => scene.remove(p.mesh));
    puddles.forEach((p) => scene.remove(p.mesh));
    projectiles = [];
    puddles = [];
  }

  // ── entrada ──
  const keys = {};
  const tp = { drift: false, item: false, brake: false };
  const gp = { x: 0, drift: false, item: false, brake: false, prev: [] };
  const prevHeld = { item: false };
  function readLocal() {
    const joy = touchPad ? touchPad.joy : { x: 0, y: 0 };
    let steer = gp.x + joy.x;
    if (keys.KeyA || keys.ArrowLeft || mando.L) steer -= 1;
    if (keys.KeyD || keys.ArrowRight || mando.R) steer += 1;
    const brake = !!(keys.KeyS || keys.ArrowDown || mando.Down || gp.brake || tp.brake || joy.y < -0.65);
    const drift = !!(keys.Space || keys.ShiftLeft || keys.ShiftRight || keys.KeyK || mando.A || gp.drift || tp.drift);
    const itemHeld = !!(keys.KeyE || keys.KeyJ || keys.Enter || mando.B || gp.item || tp.item);
    const item = itemHeld && !prevHeld.item;
    prevHeld.item = itemHeld;
    return { steer: clamp(steer, -1, 1), brake, drift, item };
  }

  // ── IA ──
  function aiInput(r, dt) {
    r.laneT -= dt;
    if (r.laneT <= 0) { r.laneT = rnd(2, 5); r.lane = clamp(r.lane + rnd(-5, 5), -8, 8); }
    const look = 10 + Math.round(r.v * 0.28);
    const p = track.at(r.idx + look);
    const tx = p.x - p.tz * r.lane, tz = p.z + p.tx * r.lane;
    const want = Math.atan2(tx - r.x, tz - r.z);
    const diff = wrapA(want - r.yaw);
    const steer = clamp(-diff * 2.4, -1, 1);
    // curvatura del tramo que viene → derrapa en las curvas cerradas
    const pa = track.at(r.idx + 8), pb = track.at(r.idx + 40);
    const bend = Math.abs(wrapA(Math.atan2(pb.tx, pb.tz) - Math.atan2(pa.tx, pa.tz)));
    const inp = { steer, brake: false, drift: bend > 0.55 && r.v > 20 && Math.abs(diff) > 0.12, item: false };
    r.aiItemT -= dt;
    if (r.item && r.aiItemT <= 0) {
      r.aiItemT = rnd(0.6, 2);
      const ahead = racerAhead(r);
      const behind = racers.find((o) => o !== r && o.prog < r.prog && r.prog - o.prog < 0.02);
      if (r.item === "cafe" || r.item === "focus" || r.item === "reunion") inp.item = true;
      else if (r.item === "email" && ahead && Math.hypot(ahead.x - r.x, ahead.z - r.z) < 70) inp.item = true;
      else if (r.item === "tinta" && behind) inp.item = true;
      else if (Math.random() < 0.15) inp.item = true;
    }
    return inp;
  }
  // "rubber band": la CPU se acerca si va muy atrás y afloja si va muy delante
  function aiSpeedMul(r) {
    const humans = racers.filter((o) => o.ctrl !== "cpu");
    if (!humans.length) return r.skill;
    const best = Math.max(...humans.map((o) => o.prog));
    const gap = r.prog - best;
    return r.skill * clamp(1 - gap * 2.2, 0.9, 1.1);
  }

  // ── física de una moto controlada en este móvil ──
  function updateRacer(r, inp, dt) {
    r.boostT = Math.max(0, r.boostT - dt);
    r.starT = Math.max(0, r.starT - dt);
    const nr = track.nearest(r.x, r.z, r.idx);
    // vueltas: cruzar la meta hacia delante (con la mitad del circuito ya recorrida)
    const prevIdx = r.idx;
    r.idx = nr.i;
    if (prevIdx > N_SAMPLES * 0.85 && r.idx < N_SAMPLES * 0.15 && r.half) { r.lap++; r.half = false; onLap(r); }
    else if (prevIdx < N_SAMPLES * 0.15 && r.idx > N_SAMPLES * 0.85) { r.lap = Math.max(0, r.lap - 1); r.half = true; }
    if (r.idx > N_SAMPLES * 0.45 && r.idx < N_SAMPLES * 0.6) r.half = true;
    r.prog = r.lap + r.idx / N_SAMPLES;

    const racing = phase === "race" && !r.finished;
    if (r.spinT > 0) {
      r.spinT -= dt;
      r.v *= Math.pow(0.35, dt);
      r.yaw += 11 * dt;
      r.drift = 0; r.driftT = 0;
    } else {
      // velocidad objetivo (acelera sola)
      let target = racing ? r.maxV : r.finished ? r.maxV * 0.45 : 0;
      if (r.ctrl === "cpu") target *= aiSpeedMul(r);
      if (r.boostT > 0) target *= 1.38;
      if (r.starT > 0) target *= 1.18;
      if (inp.brake) target = Math.min(target, 8);
      const off = Math.abs(nr.lat) > TRACK_HALF;
      if (off && r.starT <= 0) target *= 0.72;
      const acc = r.v < target ? (r.boostT > 0 ? 45 : 16) : 22;
      r.v += clamp(target - r.v, -acc * dt, acc * dt);

      // giro y derrape
      const sp = clamp(r.v / r.maxV, 0, 1.3);
      if (inp.drift && !r.drift && Math.abs(inp.steer) > 0.25 && r.v > 14 && !r.air) {
        r.drift = Math.sign(inp.steer); r.driftT = 0; r.driftLvl = 0;
      }
      if (r.drift && (!inp.drift || r.v < 10)) {
        // soltar el derrape: miniturbo según el tiempo derrapando
        if (r.driftLvl > 0) { r.boostT = Math.max(r.boostT, r.driftLvl === 2 ? 1.2 : 0.65); if (r === me) sfx.boost(); }
        r.drift = 0; r.driftT = 0; r.driftLvl = 0;
      }
      let turn;
      if (r.drift) {
        r.driftT += dt;
        const lvl = r.driftT > 1.5 ? 2 : r.driftT > 0.7 ? 1 : 0;
        if (lvl > r.driftLvl) { r.driftLvl = lvl; if (r === me) sfx.drift(lvl); }
        turn = (r.drift * 1.0 + inp.steer * 0.55) * r.handling * 1.05;
        r.lat += r.drift * -8 * dt; // la moto "patina" hacia fuera
      } else turn = inp.steer * r.handling * (1.25 - sp * 0.45);
      if (!r.air) r.yaw -= turn * dt * Math.min(1, r.v / 6 + 0.2);
      r.steer += (inp.steer - r.steer) * Math.min(1, dt * 8);
    }
    r.lat *= Math.pow(0.08, dt);
    // mover
    const fx = Math.sin(r.yaw), fz = Math.cos(r.yaw), rx = -Math.cos(r.yaw), rz = Math.sin(r.yaw);
    r.x += (fx * r.v + rx * r.lat) * dt;
    r.z += (fz * r.v + rz * r.lat) * dt;

    // altura: olas, rampas y vuelo
    const wy = waveH(r.x, r.z, RC.t);
    if (r.air) {
      r.vy -= 22 * dt;
      r.y += r.vy * dt;
      if (r.y <= wy) { r.y = wy; r.air = false; r.vy = 0; splashFx(r); if (r === me) sfx.splash(); }
    } else r.y += (wy - r.y) * Math.min(1, dt * 10);

    // elementos del circuito
    for (const rp of world.ramps) {
      const dx = r.x - rp.x, dz = r.z - rp.z;
      const along = dx * Math.sin(rp.yaw) + dz * Math.cos(rp.yaw), across = dx * Math.cos(rp.yaw) - dz * Math.sin(rp.yaw);
      if (!r.air && Math.abs(across) < 4.2 && along > 2.5 && along < 5 && r.v > 12) { r.air = true; r.vy = 7 + r.v * 0.12; r.y = Math.max(r.y, 1.6); if (r === me) sfx.boost(); }
    }
    for (const bp of world.boostPads) {
      if (Math.hypot(r.x - bp.x, r.z - bp.z) < 3.4 && r.boostT < 0.9) { r.boostT = 1.1; if (r === me) { sfx.boost(); flash("¡TURBO!"); } }
    }
    for (const b of world.itemBoxes) {
      if (b.cool <= 0 && Math.hypot(r.x - b.x, r.z - b.z) < 2.8) {
        b.cool = 3;
        b.g.visible = false;
        burst(b.x, 1.6, b.z, INK.PURPLE, 10);
        if (!r.item && !r.roll) { r.roll = 1.1; if (r === me) sfx.box(); }
      }
    }
    if (r.roll > 0) {
      r.roll -= dt;
      if (r === me && Math.random() < 0.35) sfx.roll();
      if (r.roll <= 0) { r.roll = 0; r.item = rollItem(r); }
    }
    if (inp.item && r.item && !r.air) useItem(r);

    // límites: boyas del canal y orilla
    if (Math.abs(nr.lat) > TRACK_HALF + 5) {
      const p = track.at(nr.i), s = Math.sign(nr.lat);
      const push = Math.abs(nr.lat) - (TRACK_HALF + 5);
      r.x -= -p.tz * s * push; r.z -= p.tx * s * push;
      r.v *= 0.94;
      if (r === me && Math.random() < 0.2) { sfx.bump(); shake(0.3); }
    }
    for (const c of world.colliders) {
      const dx = r.x - c.x, dz = r.z - c.z, d = Math.hypot(dx, dz);
      if (d < c.r + BOAT_R) {
        r.x = c.x + (dx / d) * (c.r + BOAT_R); r.z = c.z + (dz / d) * (c.r + BOAT_R);
        r.v *= 0.55;
        if (r === me) { sfx.bump(); shake(0.6); }
      }
    }
    // chispas del derrape (azules y, cargado del todo, naranjas) saliendo de la popa
    if (r.drift && r.driftLvl > 0 && !r.air && Math.random() < 0.7) {
      const ink = r.driftLvl === 2 ? INK.ORANGE : INK.BLUE;
      for (const s of [-1, 1]) spray(r.x - fx * 1.8 + fz * s * 0.9, r.y + 0.35, r.z - fz * 1.8 - fx * s * 0.9, ink, 1, r.driftLvl === 2 ? 1.4 : 1);
    }
    // estela
    r.wakeT -= dt;
    if (r.v > 8 && !r.air && r.wakeT <= 0) {
      r.wakeT = 0.05;
      spray(r.x - fx * 2 + rnd(-0.4, 0.4), r.y + 0.2, r.z - fz * 2, r.drift ? (r.driftLvl === 2 ? INK.ORANGE : r.driftLvl === 1 ? INK.BLUE : INK.BLUE) : INK.BLUE, r.drift ? 2 : 1);
    }
  }

  function racerAhead(r) {
    let best = null, bd = Infinity;
    for (const o of racers) if (o !== r && o.prog > r.prog && o.prog - r.prog < bd) { bd = o.prog - r.prog; best = o; }
    return best;
  }
  function rollItem(r) {
    const tier = r.rank <= 1 ? 0 : r.rank <= 3 ? 1 : r.rank <= 4 ? 2 : 3;
    const table = ODDS[tier];
    let tot = 0;
    for (const k in table) tot += table[k];
    let x = Math.random() * tot;
    for (const k in table) { x -= table[k]; if (x <= 0) return k; }
    return "cafe";
  }
  function onLap(r) {
    if (r.lap > LAPS && !r.finished) {
      r.finished = true;
      r.finishT = (hostNow() - RC.goAt) / 1000;
      if (r === me) { flash("¡META!", fmtTime(r.finishT)); audio.victory(); }
      if (online.on) tx({ t: "fin", id: r.id, time: r.finishT });
      if (isAuthority() && !RC.firstFinishAt) RC.firstFinishAt = hostNow();
      return;
    }
    if (r === me && r.lap >= 1) {
      if (r.lap === LAPS) flash("¡VUELTA FINAL!", "", 2);
      else if (r.lap > 1) flash(`VUELTA ${r.lap}/${LAPS}`, "", 1.4);
      if (r.lap > 1) sfx.lap();
    }
  }

  // ── objetos ──
  function useItem(r) {
    const it = r.item;
    r.item = null;
    if (r === me) sfx.throw();
    const fx = Math.sin(r.yaw), fz = Math.cos(r.yaw);
    if (it === "cafe") { r.boostT = 1.5; if (r === me) { sfx.boost(); flash("☕ ¡CAFÉ TURBO!"); } }
    else if (it === "focus") { r.starT = 6; if (r === me) flash("⭐ ¡MODO FOCUS!", "Nadie te interrumpe durante 6 s"); }
    else if (it === "tinta") spawnPuddle({ id: `${r.id}-${++objSeq}`, x: r.x - fx * 4, z: r.z - fz * 4 }, true);
    else if (it === "email" || it === "reunion") {
      const target = it === "reunion" ? racerAhead(r) : null;
      spawnProj({ id: `${r.id}-${++objSeq}`, k: it, o: r.id, x: r.x + fx * 3, z: r.z + fz * 3, yaw: r.yaw, v: Math.max(r.v + 22, 42), tgt: target ? target.id : null }, true);
    }
  }
  function projMesh(k) {
    const g = new THREE.Group();
    if (k === "email") {
      const b = new THREE.Mesh(GEO.box, mat(INK.RED, { tone: 0.05 }));
      b.scale.set(1.6, 1.0, 0.2); g.add(b);
      const f = new THREE.Mesh(GEO.box, mat(INK.RED, { fill: true }));
      f.scale.set(1.0, 0.08, 0.22); f.position.y = 0.2; f.rotation.z = 0.5; g.add(f);
    } else {
      const b = new THREE.Mesh(GEO.box, mat(INK.PURPLE, { tone: 0.08 }));
      b.scale.set(1.4, 1.4, 0.5); g.add(b);
      const h = new THREE.Mesh(GEO.box, mat(INK.PURPLE, { fill: true }));
      h.scale.set(1.45, 0.35, 0.55); h.position.y = 0.55; g.add(h);
    }
    scene.add(g);
    return g;
  }
  function spawnProj(p, mine) {
    p.mesh = projMesh(p.k);
    p.life = p.k === "reunion" ? 7 : 5;
    p.mine = mine;
    projectiles.push(p);
    if (mine && online.on) tx({ t: "item", p: { id: p.id, k: p.k, o: p.o, x: p.x, z: p.z, yaw: p.yaw, v: p.v, tgt: p.tgt } });
  }
  function spawnPuddle(p, mine) {
    const m = new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true }));
    m.rotation.x = -Math.PI / 2;
    m.scale.set(5.5, 4.5, 1);
    m.position.set(p.x, 0.35, p.z);
    scene.add(m);
    puddles.push({ ...p, mesh: m, life: 45 });
    if (mine && online.on) tx({ t: "puddle", p: { id: p.id, x: p.x, z: p.z } });
  }
  function removeObj(id) {
    for (const p of projectiles) if (p.id === id) p.life = 0;
    for (const p of puddles) if (p.id === id) p.life = 0;
  }
  const owned = (r) => r.ctrl === "local" || (r.ctrl === "cpu" && isAuthority());
  // golpe de objeto: si la víctima es de otro móvil se le avisa (el anfitrión enruta)
  function hitRacer(r, kind) {
    if (owned(r)) spinOut(r, kind);
    else tx({ t: "hit", to: r.id, k: kind });
  }
  function spinOut(r, kind) {
    if (r.starT > 0 || r.spinT > 0 || r.finished) return;
    r.spinT = 1.15;
    r.drift = 0;
    burst(r.x, r.y + 1, r.z, kind === "tinta" ? INK.BLACK : kind === "reunion" ? INK.PURPLE : INK.RED, 18);
    if (r === me) {
      sfx.spin();
      shake(0.7);
      flash(kind === "reunion" ? "📅 ¡REUNIÓN SORPRESA!" : kind === "tinta" ? "💧 ¡MANCHA DE TINTA!" : kind === "focus" ? "⭐ ¡ARROLLADO!" : "✉️ ¡EMAIL URGENTE!", "", 1.4);
    }
  }
  function updateObjects(dt) {
    for (const p of projectiles) {
      p.life -= dt;
      if (p.k === "reunion" && p.tgt) {
        const t = racers.find((o) => o.id === p.tgt);
        if (t) {
          const want = Math.atan2(t.x - p.x, t.z - p.z);
          p.yaw += clamp(wrapA(want - p.yaw), -3 * dt, 3 * dt);
        }
      } else {
        // el email sigue el canal (como un caparazón que rebota por el circuito)
        const nr = track.nearest(p.x, p.z, p.hint ?? -1, 40);
        p.hint = nr.i;
        const q = track.at(nr.i + 12);
        const want = Math.atan2(q.x - p.x, q.z - p.z);
        if (Math.abs(nr.lat) > TRACK_HALF - 2) p.yaw += clamp(wrapA(want - p.yaw), -2.5 * dt, 2.5 * dt);
      }
      p.x += Math.sin(p.yaw) * p.v * dt;
      p.z += Math.cos(p.yaw) * p.v * dt;
      const y = waveH(p.x, p.z, RC.t) + 1.1;
      p.mesh.position.set(p.x, y, p.z);
      p.mesh.rotation.y = p.yaw;
      p.mesh.rotation.z = Math.sin(RC.t * 12) * 0.2;
      if (Math.random() < 0.4) spray(p.x, y - 0.8, p.z, p.k === "email" ? INK.RED : INK.PURPLE, 1);
      for (const c of world.colliders) if (Math.hypot(p.x - c.x, p.z - c.z) < c.r + 1) p.life = 0;
      // sólo quien lanzó el objeto decide el impacto
      if (p.mine && p.life > 0) {
        for (const r of racers) {
          if (r.id === p.o && p.life > (p.k === "reunion" ? 6.6 : 4.6)) continue; // no te das a ti mismo al lanzarlo
          if (Math.hypot(r.x - p.x, r.z - p.z) < 2.6 && Math.abs(r.y - (y - 1.1)) < 3) {
            hitRacer(r, p.k);
            p.life = 0;
            if (online.on) tx({ t: "gone", id: p.id });
            break;
          }
        }
      }
      if (p.life <= 0) { scene.remove(p.mesh); burst(p.x, y, p.z, p.k === "email" ? INK.RED : INK.PURPLE, 8); }
    }
    projectiles = projectiles.filter((p) => p.life > 0);
    for (const p of puddles) {
      p.life -= dt;
      p.mesh.position.y = waveH(p.x, p.z, RC.t) + 0.32;
      p.mesh.rotation.z += dt * 0.3;
      // cada móvil comprueba sus propias motos
      for (const r of racers) {
        if (!owned(r) || r.air || p.life <= 0) continue;
        if (Math.hypot(r.x - p.x, r.z - p.z) < 3.2) {
          spinOut(r, "tinta");
          p.life = 0;
          if (online.on) tx({ t: "gone", id: p.id });
        }
      }
      if (p.life <= 0) scene.remove(p.mesh);
    }
    puddles = puddles.filter((p) => p.life > 0);
  }
  // choques entre motos (y el modo focus arrolla)
  function collideRacers() {
    for (let i = 0; i < racers.length; i++) for (let j = i + 1; j < racers.length; j++) {
      const a = racers[i], b = racers[j];
      const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz);
      if (d > BOAT_R * 2 || d < 1e-4 || Math.abs(a.y - b.y) > 2.5) continue;
      const push = (BOAT_R * 2 - d) / 2, nx = dx / d, nz = dz / d;
      if (owned(a)) { a.x -= nx * push; a.z -= nz * push; }
      if (owned(b)) { b.x += nx * push; b.z += nz * push; }
      if (a.starT > 0 && b.starT <= 0 && owned(a)) hitRacer(b, "focus");
      if (b.starT > 0 && a.starT <= 0 && owned(b)) hitRacer(a, "focus");
      if ((a === me || b === me) && Math.random() < 0.3) sfx.bump();
    }
  }

  // ── efectos ──
  const particles = [];
  function spray(x, y, z, ink, n, sp = 1) {
    for (let i = 0; i < n; i++) {
      let p = particles.find((q) => !q.alive);
      if (!p) {
        if (particles.length > 260) return;
        p = { mesh: new THREE.Mesh(GEO.sph, mat(ink, { fill: true })), vel: new THREE.Vector3() };
        scene.add(p.mesh);
        particles.push(p);
      }
      p.alive = true;
      p.mesh.material = mat(ink, { fill: true });
      p.mesh.visible = true;
      p.mesh.position.set(x, y, z);
      p.mesh.scale.setScalar(rnd(0.12, 0.3));
      p.vel.set(rnd(-2, 2), rnd(1.5, 4.5), rnd(-2, 2)).multiplyScalar(sp);
      p.life = rnd(0.3, 0.7);
    }
  }
  const burst = (x, y, z, ink, n) => spray(x, y, z, ink, n, 2.2);
  function splashFx(r) { for (let i = 0; i < 14; i++) spray(r.x + rnd(-1.5, 1.5), r.y, r.z + rnd(-1.5, 1.5), INK.BLUE, 1); }
  function updateParticles(dt) {
    for (const p of particles) {
      if (!p.alive) continue;
      p.life -= dt;
      p.vel.y -= 14 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.life <= 0) { p.alive = false; p.mesh.visible = false; }
    }
  }
  let shakeAmt = 0;
  const shake = (a) => (shakeAmt = Math.max(shakeAmt, a));

  // ── rival remoto (interpolado) ──
  function updateRemote(r) {
    const buf = r.buf;
    if (!buf.length) return;
    const rt = hostNow() - INTERP_MS;
    while (buf.length > 2 && buf[1].ts <= rt) buf.shift();
    let s;
    if (buf.length >= 2 && buf[0].ts <= rt && buf[1].ts >= rt) {
      const a = buf[0], b = buf[1], k = (rt - a.ts) / Math.max(1, b.ts - a.ts);
      s = { ...b, x: a.x + (b.x - a.x) * k, z: a.z + (b.z - a.z) * k, y: a.y + (b.y - a.y) * k, yaw: a.yaw + wrapA(b.yaw - a.yaw) * k };
    } else {
      const l = buf[buf.length - 1], ahead = clamp((rt - l.ts) / 1000, 0, 0.2);
      s = { ...l, x: l.x + Math.sin(l.yaw) * l.v * ahead, z: l.z + Math.cos(l.yaw) * l.v * ahead };
    }
    Object.assign(r, { x: s.x, z: s.z, y: s.y, yaw: s.yaw, v: s.v, drift: s.d, spinT: s.s ? 0.5 : 0, air: !!s.a, lap: s.l, idx: s.i, finished: !!s.f, starT: s.st ? 1 : 0, boostT: s.b ? 0.5 : 0 });
    r.prog = r.lap + r.idx / N_SAMPLES;
  }
  const stateOf = (r) => ({
    id: r.id, ts: Math.round(hostNow()), x: +r.x.toFixed(2), z: +r.z.toFixed(2), y: +r.y.toFixed(2), yaw: +r.yaw.toFixed(3), v: +r.v.toFixed(1),
    d: r.drift, s: r.spinT > 0 ? 1 : 0, a: r.air ? 1 : 0, l: r.lap, i: r.idx, f: r.finished ? 1 : 0, st: r.starT > 0 ? 1 : 0, b: r.boostT > 0 ? 1 : 0
  });

  // ── dibujo de motos y pilotos ──
  const _v = new THREE.Vector3();
  function drawRacer(r, dt) {
    const g = r.boat.g;
    g.position.set(r.x, r.y, r.z);
    g.rotation.y = r.yaw;
    const lean = -r.steer * 0.35 - (r.drift ? r.drift * 0.25 : 0);
    r.tilt += (lean - r.tilt) * Math.min(1, dt * 8);
    r.boat.body.rotation.z = -r.tilt;
    r.boat.body.rotation.x = r.air ? -0.25 : -Math.min(0.12, r.v / 300) + Math.sin(RC.t * 3 + r.slot) * 0.03;
    // piloto: pegatina sobre la moto (se oculta si queda tapado por un islote)
    _v.set(r.x, r.y + 0.9, r.z);
    let vis = r === me || camera.position.distanceTo(_v) < 260;
    if (vis && r !== me) {
      for (const c of world.colliders) {
        const ax = camera.position.x, az = camera.position.z, bx = r.x - ax, bz = r.z - az;
        const l2 = bx * bx + bz * bz, t = clamp(((c.x - ax) * bx + (c.z - az) * bz) / l2, 0, 1);
        if (Math.hypot(ax + bx * t - c.x, az + bz * t - c.z) < c.r * 0.8) { vis = false; break; }
      }
    }
    r.sticker.setVisible(vis);
    const pose = r.spinT > 0 ? "damage" : r.air ? "jump" : r.boostT > 0 || r.starT > 0 ? "attack" : "idle";
    r.sticker.update(dt, {
      pos: _v, camera, moveX: 0, facing: 1, speed: 0, onGround: !r.air, firing: false, pose,
      hurt: r.spinT > 0 ? 0.8 : 0, tilt: r.tilt * 0.8 + (r.spinT > 0 ? Math.sin(RC.t * 30) * 0.3 : 0),
      squash: r.starT > 0 ? 1 + Math.sin(RC.t * 20) * 0.06 : 1
    });
  }

  // ── cámara de persecución ──
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  let camInit = false;
  function updateCamera(dt) {
    const r = me;
    if (!r) return;
    const fx = Math.sin(r.yaw), fz = Math.cos(r.yaw);
    const back = 9.5 + r.v * 0.06, up = 4.2 + (r.air ? 1.5 : 0);
    const wantPos = _v.set(r.x - fx * back, r.y + up, r.z - fz * back);
    if (!camInit) { camPos.copy(wantPos); camInit = true; }
    camPos.lerp(wantPos, Math.min(1, dt * 6));
    camLook.lerp(new THREE.Vector3(r.x + fx * 7, r.y + 1.6, r.z + fz * 7), Math.min(1, dt * 10));
    const sh = shakeAmt * shakeAmt * 0.6;
    shakeAmt = Math.max(0, shakeAmt - dt * 2.5);
    camera.position.set(camPos.x + rnd(-sh, sh), Math.max(1.5, camPos.y + rnd(-sh, sh)), camPos.z + rnd(-sh, sh));
    camera.lookAt(camLook);
    const fov = (root.clientWidth < root.clientHeight ? 80 : 68) + (r.boostT > 0 ? 10 : 0) + clamp(r.v - 25, 0, 12) * 0.25;
    camera.fov += (fov - camera.fov) * Math.min(1, dt * 4);
    camera.updateProjectionMatrix();
  }

  // ── HUD ──
  const hud = {
    pos: $(".rk-pos b"), posOf: $(".rk-pos small"), lap: $(".rk-lap b"), time: $(".rk-time"), item: $(".rk-item span"), itemBox: $(".rk-item"),
    speed: $(".rk-speed b"), big: $(".rk-big"), msg: $(".rk-msg"), ping: $(".rk-ping"), map: $(".rk-map")
  };
  const mapCtx = hud.map.getContext("2d");
  const mb = track.bounds, mscale = 200 / Math.max(mb.maxX - mb.minX, mb.maxZ - mb.minZ);
  const mapXY = (x, z) => [120 + (x - (mb.minX + mb.maxX) / 2) * mscale, 120 + (z - (mb.minZ + mb.maxZ) / 2) * mscale];
  const INK_CSS = ["#d6243a", "#1f38b8", "#1a8c52", "#ec7f19", "#52307c", "#272a36"];
  function drawMap() {
    const c = mapCtx;
    c.clearRect(0, 0, 240, 240);
    c.lineJoin = c.lineCap = "round";
    c.beginPath();
    for (let i = 0; i <= N_SAMPLES; i += 6) { const p = track.at(i); const [x, y] = mapXY(p.x, p.z); i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.strokeStyle = "rgba(31,56,184,0.25)"; c.lineWidth = 16; c.stroke();
    c.strokeStyle = "#272a36"; c.lineWidth = 3; c.stroke();
    const s = mapXY(track.at(0).x, track.at(0).z);
    c.fillStyle = "#d6243a"; c.fillRect(s[0] - 5, s[1] - 5, 10, 10);
    for (const r of racers) {
      const [x, y] = mapXY(r.x, r.z);
      c.beginPath();
      c.arc(x, y, r === me ? 9 : 6, 0, Math.PI * 2);
      c.fillStyle = INK_CSS[r.slot % 6];
      c.fill();
      c.lineWidth = 2.5; c.strokeStyle = "#fbf8ee"; c.stroke();
    }
  }
  let bigT = 0;
  function flash(txt, sub = "", dur = 1.3) {
    hud.big.textContent = txt;
    hud.msg.textContent = sub;
    hud.big.className = "rk-big show";
    void hud.big.offsetWidth;
    hud.big.classList.add("pop");
    bigT = dur;
  }
  let lastItem = "", mapT = 0;
  const speedLinesEl = $(".rk-speedlines");
  function updateHud(dt) {
    if (!me) return;
    speedLinesEl.classList.toggle("on", me.boostT > 0 || me.starT > 0);
    const ranked = racers.slice().sort((a, b) => (b.finished && a.finished ? a.finishT - b.finishT : b.finished ? 1 : a.finished ? -1 : b.prog - a.prog));
    ranked.forEach((r, i) => (r.rank = i + 1));
    hud.pos.textContent = `${me.rank}º`;
    hud.posOf.textContent = `/${racers.length}`;
    hud.lap.textContent = String(clamp(me.lap, 1, LAPS));
    const t = phase === "race" || phase === "done" ? (me.finished ? me.finishT : Math.max(0, (hostNow() - RC.goAt) / 1000)) : 0;
    hud.time.textContent = fmtTime(t);
    hud.speed.textContent = String(Math.round(me.v * 3.6));
    const it = me.roll > 0 ? Object.values(ITEMS)[Math.floor(performance.now() / 70) % 5].icon : me.item ? ITEMS[me.item].icon : "";
    if (it !== lastItem) { hud.item.textContent = it; lastItem = it; }
    hud.itemBox.classList.toggle("ready", !!me.item);
    hud.ping.textContent = online.on ? `📶 ${Math.round(clock.rtt)} ms` : "";
    bigT -= dt;
    if (bigT <= 0) hud.big.classList.remove("show");
    hud.msg.style.opacity = bigT > 0 ? "1" : "0";
    mapT -= dt;
    if (mapT <= 0) { mapT = 0.1; drawMap(); }
  }

  // ── carrera ──
  function beginRace(grid, at) {
    disposeRacers();
    racers = grid.map((g, i) => mkRacer(g, i));
    me = racers.find((r) => r.ctrl === "local") || racers[0];
    RC.startAt = at; RC.goAt = at + 3200; RC.firstFinishAt = 0; RC.results = null; RC.events = [];
    world.itemBoxes.forEach((b) => { b.cool = 0; b.g.visible = true; });
    screen = "race"; phase = "countdown"; paused = false; camInit = false;
    showOv(null);
    $(".rk-hud").classList.remove("hidden");
    audio.init();
    audio.startMusic();
    startEngine();
    ["3", "2", "1"].forEach((n, i) => schedule(at + 200 + i * 1000, () => { flash(n, i === 0 ? "Pantano de San Juan" : "", 0.9); sfx.beep(false); }));
    schedule(RC.goAt, () => { phase = "race"; flash("¡YA!", "", 0.9); sfx.beep(true); });
    syncPad();
  }
  // el árbitro cierra la carrera: todos los humanos en meta o 25 s después del primero
  function referee() {
    if (!isAuthority() || phase !== "race") return;
    const humans = racers.filter((r) => r.ctrl !== "cpu");
    const allDone = humans.length > 0 && humans.every((r) => r.finished);
    if (!allDone && !(RC.firstFinishAt && hostNow() - RC.firstFinishAt > 25000)) return;
    const list = racers.slice().sort((a, b) => (a.finished && b.finished ? a.finishT - b.finishT : a.finished ? -1 : b.finished ? 1 : b.prog - a.prog))
      .map((r) => ({ id: r.id, n: r.name, e: r.emoji, t: r.finished ? r.finishT : null, cpu: r.ctrl === "cpu" && !online.roster.some((q) => q.id === r.id) }));
    if (online.on) tx({ t: "results", list });
    showResults(list);
  }
  function showResults(list) {
    phase = "done";
    RC.results = list;
    setTimeout(() => {
      if (screen !== "race") return;
      screen = "end";
      const pos = list.findIndex((q) => me && q.id === me.id) + 1;
      $(".rk-end-title").textContent = pos === 1 ? "¡Has ganado la regata!" : `Has llegado ${pos}º`;
      $(".rk-results").innerHTML = list.map((q, i) =>
        `<div class="rk-row${me && q.id === me.id ? " me" : ""}"><span>${i + 1}º</span><span>${q.e} ${q.n}${q.cpu ? " <small>CPU</small>" : ""}</span><b>${q.t != null ? fmtTime(q.t) : "—"}</b></div>`).join("");
      const again = $(".rk-again");
      again.disabled = mode === "online" && !net.isHost;
      again.textContent = again.disabled ? "Esperando al anfitrión…" : "Otra carrera";
      showOv("end");
      syncPad();
      pos === 1 ? audio.victory() : audio.lose();
      if (mode === "solo" && pos === 1 && onVictory) {
        const tme = list[0].t || 0;
        try { onVictory(Math.max(1000, Math.round(10000 - tme * 40)), tme < 140 ? "S" : tme < 170 ? "A" : "B"); } catch (e) {}
      }
    }, 1600);
  }

  function stepSim(dt) {
    const now = hostNow();
    if (RC.events.length) {
      const due = RC.events.filter((e) => e.at <= now);
      if (due.length) { RC.events = RC.events.filter((e) => e.at > now); due.forEach((e) => e.fn()); }
    }
    if (screen !== "race" && screen !== "end") return;
    RC.t += dt;
    const local = paused ? { steer: 0, brake: false, drift: false, item: false } : readLocal();
    for (const r of racers) {
      if (r.ctrl === "local") updateRacer(r, DBG.autopilot ? aiInput(r, dt) : local, dt);
      else if (r.ctrl === "cpu" && isAuthority()) updateRacer(r, aiInput(r, dt), dt);
      else updateRemote(r);
    }
    collideRacers();
    updateObjects(dt);
    referee();
  }

  function netTick(dt) {
    if (!online.on) return;
    online.pingT -= dt;
    if (online.pingT <= 0) { online.pingT = 0.8; tx({ t: "ping", c: performance.now() }); }
    if (screen !== "race" && screen !== "end") return;
    online.sendT -= dt;
    if (online.sendT > 0) return;
    online.sendT = 1 / SEND_HZ;
    if (me) tx({ t: "st", s: stateOf(me) });
    if (net.isHost) {
      const cpus = racers.filter((r) => r.ctrl === "cpu");
      if (cpus.length) net.broadcast({ t: "cpu", list: cpus.map(stateOf) });
    }
  }

  // ── mensajes ──
  const lobby = { status: $(".rk-status"), room: $(".rk-room"), row: $(".rk-lobbyrow"), code: $(".rk-code"), codeBig: $(".rk-codebig"), list: $(".rk-list"), go: $(".rk-go") };
  const setStatus = (t, err) => { lobby.status.textContent = t; lobby.status.classList.toggle("err", !!err); };
  function renderRoom() {
    lobby.room.classList.toggle("hidden", !online.on);
    lobby.row.classList.toggle("hidden", online.on);
    $(".rk-solo").disabled = online.on;
    lobby.codeBig.textContent = net.code || "";
    lobby.list.innerHTML = online.roster.map((p) => `<span class="dd-mp-chip${p.id === net.myId ? " me" : ""}">${charById(p.c).emoji} ${charById(p.c).name}${p.id === net.hostId ? " ⭐" : ""}</span>`).join("")
      + (online.on ? `<span class="dd-mp-chip rk-cpuchip">🤖 ×${Math.max(0, RACERS - online.roster.length)}</span>` : "");
    lobby.go.disabled = !(online.on && net.isHost);
    lobby.go.textContent = net.isHost ? `¡Salida! (${online.roster.length})` : "Esperando al anfitrión…";
  }
  function hostRoster() {
    const list = [{ id: net.myId, c: myChar }];
    online.roster.forEach((p) => { if (p.id !== net.myId) list.push(p); });
    online.roster = list;
    net.broadcast({ t: "roster", list });
    renderRoom();
  }
  net.on("ping", (m, from) => {
    online.lastRx.set(from, performance.now());
    if (net.isHost) net.sendTo(from, { t: "pong", c: m.c, h: performance.now() });
    else net.send({ t: "pong", c: m.c, h: performance.now() });
  });
  net.on("pong", (m) => {
    const now = performance.now(), rtt = now - m.c;
    clock.rtt = clock.rtt ? clock.rtt * 0.7 + rtt * 0.3 : rtt;
    if (!net.isHost) {
      clock.samples.push({ rtt, off: m.h + rtt / 2 - now });
      if (clock.samples.length > 10) clock.samples.shift();
      clock.offset = clock.samples.reduce((a, b) => (b.rtt < a.rtt ? b : a)).off;
    }
  });
  net.on("hello", (m, from) => {
    if (!net.isHost) return;
    const ex = online.roster.find((p) => p.id === from);
    if (ex) ex.c = m.c; else online.roster.push({ id: from, c: m.c });
    hostRoster();
    setStatus(`${charById(m.c).name} se ha unido.`);
  });
  net.on("roster", (m) => { online.roster = m.list || []; renderRoom(); });
  net.on("start", (m) => {
    if (net.isHost) return;
    const grid = m.grid.map((g) => ({ ...g, ctrl: g.id === net.myId ? "local" : g.cpu ? "cpu" : "remote" }));
    beginRace(grid, m.at);
    // en los invitados las CPU son "remotas": las mueve el anfitrión
    racers.forEach((r) => { if (r.ctrl === "cpu") r.ctrl = "remote"; });
  });
  const applyState = (s) => {
    const r = racers.find((q) => q.id === s.id);
    if (!r || r.ctrl !== "remote") return;
    r.buf.push(s);
    if (r.buf.length > 30) r.buf.shift();
  };
  net.on("st", (m, from) => {
    online.lastRx.set(from, performance.now());
    applyState(m.s);
    if (net.isHost) net.broadcast(m, from);
  });
  net.on("cpu", (m) => { if (!net.isHost) m.list.forEach(applyState); });
  net.on("item", (m, from) => {
    if (screen === "race") spawnProj({ ...m.p }, false);
    if (net.isHost) net.broadcast(m, from);
  });
  net.on("puddle", (m, from) => {
    if (screen === "race") spawnPuddle({ ...m.p }, false);
    if (net.isHost) net.broadcast(m, from);
  });
  net.on("gone", (m, from) => { removeObj(m.id); if (net.isHost) net.broadcast(m, from); });
  net.on("hit", (m, from) => {
    const r = racers.find((q) => q.id === m.to);
    if (r && owned(r)) spinOut(r, m.k);
    else if (net.isHost && r) net.sendTo(m.to, m);
  });
  net.on("fin", (m, from) => {
    const r = racers.find((q) => q.id === m.id);
    if (r) { r.finished = true; r.finishT = m.time; }
    if (net.isHost) { if (!RC.firstFinishAt) RC.firstFinishAt = hostNow(); net.broadcast(m, from); }
  });
  net.on("results", (m) => { if (!net.isHost) showResults(m.list); });
  net.on("_leave", (m, id) => {
    if (net.isHost) {
      online.roster = online.roster.filter((p) => p.id !== id);
      hostRoster();
      // su moto pasa a la CPU para que la carrera siga
      const r = racers.find((q) => q.id === id);
      if (r) { r.ctrl = "cpu"; r.buf = []; }
      if (screen === "race") flash("", `${r ? r.name : "Un jugador"} ha salido: le sustituye la CPU`, 2);
    } else if (id === net.hostId) {
      const inRace = screen === "race" || screen === "end";
      leaveRoom();
      if (inRace) toLobby();
      setStatus("El anfitrión ha cerrado la sala.", true);
    }
  });

  $(".rk-create").addEventListener("click", async () => {
    setStatus("Creando sala…");
    try {
      await net.host(randomCode());
      online.on = true; mode = "online"; clock.offset = 0;
      online.roster = [{ id: net.myId, c: myChar }];
      hostRoster();
      setStatus("Comparte el código. Los huecos libres los ocupa la CPU.");
    } catch (err) { setStatus(err.message, true); }
  });
  async function joinRoom() {
    const code = cleanCode(lobby.code.value);
    if (code.length !== 5) return setStatus("El código tiene 5 letras.", true);
    setStatus(`Buscando la sala ${code}…`);
    try {
      await net.join(code);
      online.on = true; mode = "online"; clock.samples = [];
      net.send({ t: "hello", c: myChar });
      net.send({ t: "ping", c: performance.now() });
      renderRoom();
      setStatus("¡Dentro! La salida la da el anfitrión.");
    } catch (err) { setStatus(err.message, true); }
  }
  $(".rk-join").addEventListener("click", joinRoom);
  lobby.code.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") joinRoom(); });
  lobby.code.addEventListener("input", () => { lobby.code.value = cleanCode(lobby.code.value); });
  $(".rk-copy").addEventListener("click", () => { try { navigator.clipboard.writeText(net.code); setStatus("Código copiado ✔"); } catch (e) {} });
  function leaveRoom() {
    net.destroy();
    online.on = false; online.roster = [];
    mode = "solo"; clock.offset = 0; clock.samples = []; clock.rtt = 0;
    renderRoom();
  }
  $(".rk-leave").addEventListener("click", () => { leaveRoom(); setStatus(""); });

  function cpuFill(humans) {
    const used = new Set(humans.map((h) => h.cid));
    const pool = CHARS.map((c) => c.id).filter((id) => !used.has(id)).sort(() => Math.random() - 0.5);
    const grid = humans.slice();
    let k = 0;
    while (grid.length < RACERS) grid.push({ id: `cpu${k}`, cid: pool[k++ % pool.length], cpu: true });
    return grid;
  }
  function startSolo() {
    mode = "solo";
    const grid = cpuFill([{ id: "me", cid: myChar }]);
    // tú sales el último de la parrilla: a remontar
    const meG = grid.shift();
    grid.push(meG);
    beginRace(grid.map((g) => ({ ...g, ctrl: g.id === "me" ? "local" : "cpu" })), hostNow() + 300);
  }
  function hostStart() {
    if (!online.on || !net.isHost) return;
    const humans = online.roster.map((p) => ({ id: p.id, cid: p.c })).sort(() => Math.random() - 0.5);
    const grid = cpuFill(humans);
    const at = hostNow() + 600;
    net.broadcast({ t: "start", at, grid });
    beginRace(grid.map((g) => ({ ...g, ctrl: g.id === net.myId ? "local" : g.cpu ? "cpu" : "remote" })), at);
  }
  $(".rk-solo").addEventListener("click", startSolo);
  lobby.go.addEventListener("click", hostStart);

  // elección de piloto
  let pickIdx = Math.max(0, CHARS.findIndex((c) => c.id === myChar));
  function renderPick() {
    const c = CHARS[pickIdx];
    myChar = c.id;
    const av = getCharacterAvatar(c.id);
    const img = $(".rk-sticker");
    if (av) img.src = av;
    img.classList.toggle("px", !!(av && av.startsWith("data:")));
    $(".rk-pname").textContent = `${c.emoji} ${c.name}`;
  }
  root.querySelectorAll(".rk-arrow").forEach((b) => b.addEventListener("click", () => {
    pickIdx = (pickIdx + Number(b.dataset.d) + CHARS.length) % CHARS.length;
    renderPick();
    audio.init();
    audio.tone({ freq: 700, dur: 0.05, type: "triangle", gain: 0.08 });
    if (onPickChar) try { onPickChar(myChar); } catch (e) {}
    if (online.on) { if (net.isHost) hostRoster(); else net.send({ t: "hello", c: myChar }); }
  }));
  renderPick();

  // ── overlays ──
  function showOv(name) {
    $(".rk-lobby").classList.toggle("hidden", name !== "lobby");
    $(".rk-pause").classList.toggle("hidden", name !== "pause");
    $(".rk-end").classList.toggle("hidden", name !== "end");
  }
  let pausedAt = 0;
  function pause() {
    if (screen !== "race" || paused) return;
    paused = true;
    pausedAt = hostNow();
    $(".rk-pause-note").textContent = mode === "online" ? "La carrera sigue: tu moto se queda parada." : "";
    showOv("pause");
    syncPad();
  }
  function resume() {
    if (!paused) return;
    paused = false;
    if (mode === "solo") {
      const d = hostNow() - pausedAt;
      RC.goAt += d; RC.startAt += d;
      RC.events.forEach((e) => (e.at += d));
      if (RC.firstFinishAt) RC.firstFinishAt += d;
      for (const r of racers) if (r.finished) r.finishT = r.finishT; // los tiempos ya cerrados no cambian
    }
    showOv(null);
    syncPad();
  }
  function toLobby() {
    disposeRacers();
    screen = "lobby"; phase = "idle"; paused = false;
    RC.events = [];
    $(".rk-hud").classList.add("hidden");
    showOv("lobby");
    renderRoom();
    syncPad();
  }
  $(".rk-resume").addEventListener("click", resume);
  $(".rk-quit").addEventListener("click", () => { if (online.on) leaveRoom(); toLobby(); });
  $(".rk-again").addEventListener("click", () => (mode === "solo" ? startSolo() : hostStart()));
  $(".rk-tolobby").addEventListener("click", toLobby);
  $(".rk-exit").addEventListener("click", exit);
  $(".rk-pausebtn").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); pause(); });
  $(".rk-item").addEventListener("pointerdown", (e) => { e.preventDefault(); tp.item = true; setTimeout(() => (tp.item = false), 120); });

  // ── entrada ──
  function onKeyDown(e) {
    if (e.target && e.target.tagName === "INPUT") return;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if ((e.code === "Escape" || e.code === "KeyP") && screen === "race") paused ? resume() : pause();
    if (e.code === "KeyM") audio.toggleMusic();
  }
  function onKeyUp(e) { keys[e.code] = false; }
  function onBlur() { for (const k in keys) keys[k] = false; if (screen === "race" && mode === "solo") pause(); }
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  root.addEventListener("pointerdown", () => { audio.init(); audio.resume(); startEngine(); }, { capture: true });

  // mando táctil común (horizontal): acelera sola; joystick gira
  const touchPad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "drift", label: "DERRAPE", icon: ICON.dash, accent: "red" },
      { id: "item", label: "OBJETO", icon: ICON.special, accent: "blue" },
      { id: "brake", label: "FRENO", icon: ICON.block }
    ],
    isActive: () => screen === "race" && !paused,
    onAction: (id, down) => { tp[id] = down; }
  }) : null;
  function syncPad() {
    const portrait = document.body.classList.contains("gameboy-mode");
    if (touchPad) touchPad.setVisible(isTouch && !portrait && screen === "race" && !paused);
    root.classList.toggle("dd-landpad", isTouch && !portrait);
  }
  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let g = null;
    for (const p of pads) if (p && p.connected) { g = p; break; }
    if (!g) { Object.assign(gp, { x: 0, drift: false, item: false, brake: false }); return; }
    const b = (i) => !!(g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.4));
    const ax = Math.abs(g.axes[0] || 0) > 0.15 ? g.axes[0] : 0;
    gp.x = ax + (b(15) ? 1 : 0) - (b(14) ? 1 : 0);
    gp.drift = b(5) || b(4) || b(0) || b(7);
    gp.item = b(2) || b(3);
    gp.brake = b(1) || b(6);
    if (b(9) && !gp.prev[9] && screen === "race") paused ? resume() : pause();
    gp.prev[9] = b(9);
  }
  const relabels = [];
  for (const [sel, t] of [["#gbLabelA", "DERRAPE"], ["#gbLabelB", "OBJETO"]]) {
    const el = document.querySelector(sel);
    if (el) { relabels.push([el, el.textContent]); el.textContent = t; }
  }

  // ── tamaño ──
  function resize() {
    const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    R.setSize(w, h);
    syncPad();
  }
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(root);
  window.addEventListener("resize", resize);
  resize();

  // ── bucle ──
  let raf = 0, prev = performance.now(), acc = 0, wall = 0, lastRaf = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    lastRaf = performance.now();
    const dt = Math.min(0.1, (now - prev) / 1000);
    prev = now;
    wall += dt;
    pollGamepad();
    const frozen = paused && mode === "solo";
    if (!frozen) {
      acc += dt;
      while (acc >= STEP) { stepSim(STEP); acc -= STEP; }
    } else acc = 0;
    netTick(dt);
    if (!frozen) updateParticles(dt);
    for (const r of racers) drawRacer(r, frozen ? 0 : dt);
    if (screen === "lobby") {
      // presentación: vuelo lento sobre el pantano
      const a = wall * 0.05;
      camera.position.set(track.center.x + Math.cos(a) * 180, 55, track.center.z + Math.sin(a) * 180);
      camera.lookAt(track.center.x, 0, track.center.z);
      camera.fov = 60;
      camera.updateProjectionMatrix();
    } else updateCamera(dt);
    world.update(frozen ? RC.t : RC.t || wall, camera.position.x, camera.position.z, frozen ? 0 : dt);
    if (screen === "lobby") RC.t = wall;
    updateHud(dt);
    updateEngine(me ? me.v : 0, me && me.boostT > 0);
    R.render(scene, camera, { time: wall, hurt: me && me.spinT > 0 ? 0.3 : 0, lowHp: 0, flash: 0 }, overlay);
  }
  raf = requestAnimationFrame(frame);

  // pestaña en segundo plano: en online seguimos simulando y enviando
  let lastBg = performance.now();
  const bgTimer = setInterval(() => {
    const now = performance.now();
    if (!online.on || now - lastRaf < 300) { lastBg = now; return; }
    const dt = Math.min(1, (now - lastBg) / 1000);
    lastBg = now;
    prev = now;
    acc += dt;
    while (acc >= STEP) { stepSim(STEP); acc -= STEP; }
    online.sendT = 0;
    netTick(dt);
  }, 50);

  // ── salida ──
  let destroyed = false;
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    clearInterval(bgTimer);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("resize", resize);
    if (ro) ro.disconnect();
    net.destroy();
    relabels.forEach(([el, t]) => (el.textContent = t));
    document.body.classList.remove("doodle-mode");
    disposeRacers();
    if (touchPad) touchPad.destroy();
    if (engine) { try { engine.o1.stop(); engine.o2.stop(); } catch (e) {} }
    audio.destroy();
    R.dispose();
    root.remove();
    if (window.__race) delete window.__race;
  }
  function exit() { destroy(); if (onExit) onExit(); }
  if (import.meta.env && import.meta.env.DEV) window.__race = { DBG, get racers() { return racers; }, get me() { return me; }, RC, track, world, online, clock, net, get screen() { return screen; }, get phase() { return phase; } };

  showOv("lobby");
  renderRoom();
  return { destroy, exit };
}
