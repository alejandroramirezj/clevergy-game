// =============================================================================
// doodleFall.js — MUNDO 5 · LA INTEGRACIÓN (show de obstáculos estilo Fall Guys)
// De no tener nada a un usuario completo que da el consentimiento para que
// Clevergy controle su batería en el mercado de flexibilidad. Cuatro rondas
// eliminatorias contra compañeros de Clevergy (CPU):
//   1 · Crea el usuario y la casa   2 · Consigue el consumo
//   3 · Conecta con el inversor     4 · La batería (sólo uno se la lleva)
// Controles iguales para todos: moverse, saltar, doble salto (te lanzas hacia
// delante) y agarrar (frena a quien tengas delante).
// =============================================================================

import { motionScale } from "../../engine/motion.js";
import * as THREE from "three";
import { createDoodleRenderer, INK, mat } from "../doodleRender.js";
import { DoodleAudio } from "../doodleAudio.js";
import { GEO } from "../doodleLevel.js";
import { createSticker, clearStickerCache, prewarmStickers } from "../doodleSticker.js";
import { createTouchPad, ICON } from "../touchPad.js";
import { touch as mando } from "../../engine/input.js";
import { CHARS } from "../../config/characters.js";
import { getCharacterAvatar } from "../../engine/sprites.js";
import { buzz } from "../haptics.js";
import { createNet, randomCode, cleanCode } from "../doodleNet.js";
import { speakCharacter } from "../../engine/voice.js";
import { setInPlay } from "../../game/state.js";
import { createKit } from "./fallKit.js";
import { createSim, newBot, H } from "./fallSim.js";
import { LEVELS, LEVEL_INFO } from "./fallLevels.js";
import "../doodle.css";
import "../fight/fight.css";
import "../race/race.css";
import "./fall.css";

const STEP = 1 / 60;
const PLAYERS = 20; // concursantes mínimos (se rellena con CPU)
const MAX_ONLINE = 20;
const INTRO_MS = 5200; // presentación de la ronda: la cámara vuela de la meta a la salida
const SEND_HZ = 20;
const INTERP_MS = 110;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const charById = (id) => CHARS.find((c) => c.id === id) || CHARS[0];
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const TEMPLATE = `
<canvas class="dd-canvas"></canvas>
<div class="fg-hud hidden">
  <div class="fg-round"><small class="fg-rnum">RONDA 1/4</small><b class="fg-rname"></b></div>
  <div class="fg-qual"><b>0</b><small>/9</small><span>CLASIFICADOS</span></div>
  <div class="fg-time">2:30</div>
  <ul class="fg-check"></ul>
  <div class="fg-big"></div>
  <div class="fg-msg"></div>
  <div class="fg-follow hidden"><button class="fg-fprev" aria-label="Anterior">◀</button><span class="fg-fname"></span><button class="fg-fnext" aria-label="Siguiente">▶</button></div>
  <div class="fg-hint dd-desktop-only">WASD mover · ESPACIO saltar (otra vez en el aire = lanzarte) · SHIFT agarrar</div>
  <div class="dd-hudbtns"><button class="dd-hb fg-pausebtn" aria-label="Pausa">❚❚</button></div>
</div>

<div class="dd-ov fg-lobby">
  <div class="dd-card rk-card fg-card">
    <div class="rk-col">
      <div class="dd-kicker">MUNDO 5 · SHOW DE OBSTÁCULOS</div>
      <h1 class="rk-title">La Integración</h1>
      <div class="rk-place">De cero a un usuario listo para el mercado de flexibilidad</div>
      <ol class="fg-rounds">${LEVEL_INFO.map((l, i) => `<li><b>${i + 1}</b><span>${l.icon}</span> ${l.title}</li>`).join("")}</ol>
      <p class="fg-lead">En cada ronda sólo pasan los primeros. En la final hay <b>una sola batería</b>: se la lleva el primero que llegue arriba, salte y la coja.</p>
      <button class="dd-btn dd-ghost dd-mini rk-exit">Volver al mapa</button>
    </div>
    <div class="rk-col">
      <div class="rk-picker fg-picker">
        <button class="cf-arrow rk-arrow" data-d="-1" aria-label="Anterior">◀</button>
        <div class="rk-preview"><img class="cf-sticker rk-sticker" alt=""><div class="cf-pname rk-pname"></div></div>
        <button class="cf-arrow rk-arrow" data-d="1" aria-label="Siguiente">▶</button>
      </div>
      <button class="dd-btn rk-solo fg-solo">🎪 Show contra la CPU</button>
      <div class="dd-mp rk-online">
        <div class="dd-mp-head">📱 <b>Online</b> <small>hasta 20 jugadores · CPUs si sois menos</small></div>
        <div class="dd-mp-row fg-lobbyrow">
          <button class="dd-btn dd-mini fg-create">Crear sala</button>
          <input class="dd-mp-code fg-code" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" spellcheck="false" />
          <button class="dd-btn dd-mini dd-ghost fg-join">Unirse</button>
        </div>
        <div class="fg-room hidden">
          <div class="dd-mp-coderow">Sala <b class="dd-mp-codebig fg-codebig"></b> <button class="dd-btn dd-mini dd-ghost fg-copy">Copiar</button></div>
          <div class="dd-mp-list fg-list"></div>
          <div class="dd-btns rk-roombtns">
            <button class="dd-btn dd-mini fg-go">¡Empieza el show!</button>
            <button class="dd-btn dd-mini dd-ghost fg-leave">Salir</button>
          </div>
        </div>
        <div class="dd-mp-status fg-status"></div>
      </div>
      <div class="rk-help dd-desktop-only">WASD / flechas mover · ESPACIO saltar · ESPACIO en el aire = plancha · SHIFT agarrar · V hablar/frase · 🎮 mando</div>
      <div class="rk-help dd-touch-only">Joystick mover · SALTO (otra vez en el aire: plancha) · AGARRAR · VOZ para hablar</div>
    </div>
  </div>
</div>

<div class="dd-ov fg-intro hidden">
  <div class="dd-card dd-small fg-introcard">
    <div class="dd-kicker fg-i-kick"></div>
    <h2 class="fg-i-title"></h2>
    <p class="fg-i-sub"></p>
    <div class="fg-i-tip"></div>
    <div class="fg-i-qual"></div>
  </div>
</div>

<div class="dd-ov fg-roundend hidden">
  <div class="dd-card dd-small">
    <h2 class="fg-re-title"></h2>
    <p class="fg-re-sub"></p>
    <div class="fg-chips"></div>
  </div>
</div>

<div class="dd-ov dd-pause fg-pause hidden">
  <div class="dd-card dd-small">
    <h2>Pausa</h2>
    <p class="fg-pause-note"></p>
    <div class="dd-btns">
      <button class="dd-btn fg-resume">Seguir</button>
      <button class="dd-btn dd-ghost fg-quit">Salir al menú</button>
    </div>
  </div>
</div>

<div class="dd-ov fg-end hidden">
  <div class="dd-card dd-small">
    <div class="dd-kicker">LA INTEGRACIÓN</div>
    <h2 class="fg-end-title"></h2>
    <p class="fg-end-sub"></p>
    <div class="rk-results fg-end-list"></div>
    <div class="dd-btns">
      <button class="dd-btn fg-again">Otra vez</button>
      <button class="dd-btn dd-ghost fg-tolobby">Menú</button>
    </div>
  </div>
</div>`;

export function startDoodleFall({ charId, onPickChar, onExit, onVictory, onScore } = {}) {
  const root = document.createElement("div");
  root.id = "doodleRoot";
  root.className = "rk-root fg-root";
  root.innerHTML = TEMPLATE;
  (document.getElementById("wrap") || document.body).appendChild(root);
  document.body.classList.add("doodle-mode");
  const $ = (s) => root.querySelector(s);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  root.classList.toggle("dd-is-touch", isTouch);

  const canvas = $(".dd-canvas");
  const R3 = createDoodleRenderer(canvas, { fadeScale: 2.6 });
  const audio = new DoodleAudio();
  const scene = new THREE.Scene();
  const overlay = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(64, 1, 0.3, 900);
  scene.add(camera);

  // mar de datos de fondo (lo que hay debajo si te caes)
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(INK.BLUE, { tone: 0.42 }));
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -14;
  scene.add(sea);
  const bits = [];
  for (let i = 0; i < 70; i++) {
    const m = new THREE.Mesh(GEO.box, mat([INK.BLUE, INK.GREEN, INK.PURPLE][i % 3], { fill: true }));
    m.scale.setScalar(rnd(0.3, 0.9));
    m.position.set(rnd(-90, 90), -13.5, rnd(-40, 220));
    scene.add(m);
    bits.push({ m, ph: Math.random() * 6 });
  }

  // ── estado ──
  let screen = "lobby"; // lobby | intro | play | roundend | end
  let paused = false;
  let mode = "solo"; // solo | online
  let myChar = charId || CHARS[0].id;
  let K = null, L = null; // kit y datos de la ronda
  let roundIdx = 0, roundT = 0, kitT = 0, seedBase = 1;
  let cs = []; // concursantes de la ronda
  let me = null;
  let alive = []; // quién sigue en el show: { id, cid, cpu }
  let finishIds = [], qualifyN = 9, winner = null, roundOver = false;
  let history = []; // por ronda: { round, pos, qualified }
  let totalFalls = 0;
  let checks = [];
  let phase = "idle"; // countdown | race | done
  const RC = { at: 0, goAt: 0, events: [] };
  const schedule = (at, fn) => RC.events.push({ at, fn });

  // ── red (como el Pantano: estrella P2P, el anfitrión manda) ──
  const net = createNet({ prefix: "clevergy-fall-", maxPlayers: MAX_ONLINE });
  const online = { on: false, roster: [], sendT: 0, pingT: 0 };
  const clock = { offset: 0, samples: [], rtt: 0 };
  const hostNow = () => performance.now() + clock.offset;
  const tx = (m) => { if (online.on) (net.isHost ? net.broadcast(m) : net.send(m)); };
  const isAuthority = () => mode === "solo" || net.isHost;
  const owned = (c) => c.ctrl === "local" || (c.ctrl === "cpu" && isAuthority());
  const myId = () => (mode === "online" ? net.myId : "me");

  // ── sonido ──
  const sfx = {
    jump: () => audio.tone({ freq: 360, to: 620, dur: 0.1, type: "triangle", gain: 0.1 }),
    dive: () => audio.noise({ dur: 0.2, gain: 0.22, filter: "bandpass", freq: 700, to: 2000, q: 0.8 }),
    land: () => audio.tone({ freq: 140, to: 90, dur: 0.06, type: "triangle", gain: 0.07 }),
    boing: () => audio.tone({ freq: 220, to: 900, dur: 0.3, type: "sine", gain: 0.16 }),
    bonk: () => { audio.tone({ freq: 160, to: 70, dur: 0.18, type: "square", gain: 0.12 }); audio.noise({ dur: 0.12, gain: 0.18, filter: "lowpass", freq: 800 }); },
    grab: () => audio.tone({ freq: 520, to: 380, dur: 0.12, type: "square", gain: 0.06 }),
    fall: () => audio.tone({ freq: 700, to: 120, dur: 0.6, type: "sawtooth", gain: 0.08 }),
    check: () => [76, 83].forEach((n, i) => audio.tone({ freq: 440 * Math.pow(2, (n - 69) / 12), dur: 0.12, type: "triangle", gain: 0.12, delay: i * 0.08 })),
    door: () => audio.noise({ dur: 0.35, gain: 0.3, filter: "lowpass", freq: 1200, to: 300 }),
    locked: () => audio.tone({ freq: 180, dur: 0.18, type: "square", gain: 0.1 }),
    beep: (hi) => audio.tone({ freq: hi ? 1320 : 660, dur: hi ? 0.45 : 0.14, type: "square", gain: 0.12 }),
    qual: () => [72, 76, 79, 84].forEach((n, i) => audio.tone({ freq: 440 * Math.pow(2, (n - 69) / 12), dur: 0.16, type: "triangle", gain: 0.13, delay: i * 0.09 }))
  };

  // ── concursantes ──
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xd6243a, depthTest: false, depthWrite: false });
  const cm = new THREE.MeshBasicMaterial({ color: 0xf2b020, depthTest: false, depthWrite: false }); // corona
  function mkContestant(opt, i, ctrl) {
    const cfg = charById(opt.cid);
    const c = {
      id: opt.id, cid: opt.cid, cfg, name: cfg.name, emoji: cfg.emoji, cpu: !!opt.cpu, human: !opt.cpu, ctrl, slot: i,
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, yaw: 0, ground: null, coyote: 0, jumps: 0, dive: false, recover: 0, stun: 0,
      slowF: 1, grabbing: null, grabbedBy: null, grabT: 0, grabCd: 0, grabHeld: false, grabSafe: 0, cp: 0, respawnT: 0, finished: false, finishT: 0,
      falls: 0, lastSafeZ: 0, bestZ: -99, lastGroundY: 0, buf: [],
      sticker: createSticker(overlay, { height: 1.6 }), shadow: null,
      bot: ctrl === "cpu" ? newBot() : null
    };
    c.sticker.setChar(opt.cid);
    const sh = new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true, tone: 0.3 }));
    sh.rotation.x = -Math.PI / 2;
    sh.scale.set(0.95, 0.95, 1);
    scene.add(sh);
    c.shadow = sh;
    if (ctrl === "local") {
      const mk = new THREE.Mesh(GEO.cone, markerMat);
      mk.rotation.x = Math.PI;
      mk.scale.set(0.42, 0.5, 0.42);
      overlay.add(mk);
      c.marker = mk;
    }
    return c;
  }
  function disposeContestants() {
    for (const c of cs) { c.sticker.dispose(); scene.remove(c.shadow); if (c.marker) overlay.remove(c.marker); if (c.crown) overlay.remove(c.crown); }
    cs = [];
    me = null;
  }
  const byId = (id) => cs.find((c) => c.id === id);

  // ── ronda ──
  function spawnPoint(c, idx) {
    const sp = K.checkpoints[0].spawn;
    const cols = cs.length > 15 || idx >= 15 ? 6 : 4, row = Math.floor(idx / cols), col = idx % cols;
    const w = sp.x1 - sp.x0;
    c.x = sp.x0 + ((col + 0.5) / cols) * w + (((idx * 37) % 7) - 3) * 0.08;
    c.z = sp.z - row * (cols > 4 ? 1.35 : 1.8);
    c.y = sp.y + 0.05;
    c.yaw = 0;
  }
  /** monta la ronda i para todos con la misma semilla y el mismo reloj (at = hora del anfitrión) */
  function loadRound(i, grid, at) {
    if (K) { K.dispose(); K = null; }
    disposeContestants();
    roundIdx = i;
    K = createKit(scene);
    L = LEVELS[i](K, seedBase + i * 977);
    K.bake();
    roundT = 0; kitT = 0; phase = "countdown"; winner = null; finishIds = []; roundOver = false; paused = false;
    alive = grid.map((g) => ({ ...g }));
    cs = grid.map((g, k) => {
      const ctrl = g.id === myId() ? "local" : g.cpu ? (isAuthority() ? "cpu" : "remote") : "remote";
      const c = mkContestant(g, k, ctrl);
      spawnPoint(c, k);
      return c;
    });
    me = cs.find((c) => c.ctrl === "local") || null;
    qualifyN = L.final ? 1 : Math.max(1, Math.min(cs.length - 1, Math.round(cs.length * L.qualify)));
    checks = L.checklist.map((label) => ({ label, done: false }));
    renderChecks();
    $(".fg-rnum").textContent = L.final ? "FINAL · RONDA 4/4" : `RONDA ${i + 1}/4`;
    $(".fg-rname").textContent = L.title;
    spec = null;
    sea.material = mat(L.ink, { tone: 0.42 });
    camInit = false;
    // la intro, la cuenta atrás y la salida van con el reloj del anfitrión
    RC.at = at; RC.goAt = at + INTRO_MS + 3300; RC.events = [];
    showIntro();
    schedule(at + INTRO_MS, () => { if (screen === "intro") { showOv(paused ? "pause" : null); screen = "play"; syncPad(); } });
    [3, 2, 1].forEach((n) => schedule(RC.goAt - n * 1000, () => { flash(String(n), "", 0.8); sfx.beep(false); }));
    schedule(RC.goAt, () => { phase = "race"; flash("¡YA!", "", 0.8); sfx.beep(true); });
  }
  function showIntro() {
    screen = "intro";
    $(".fg-hud").classList.remove("hidden");
    $(".fg-i-kick").textContent = L.final ? "FINAL" : `RONDA ${roundIdx + 1} DE 4`;
    $(".fg-i-title").textContent = L.title;
    $(".fg-i-sub").textContent = L.subtitle;
    $(".fg-i-tip").textContent = me ? `💡 ${L.tip}` : "👀 Estás eliminado: sigues el show como espectador";
    $(".fg-i-qual").textContent = L.final ? `${cs.length} finalistas · una sola batería` : `Se clasifican ${qualifyN} de ${cs.length}`;
    showOv("intro");
    syncPad();
  }
  function cpuFill(humans) {
    const used = new Set(humans.map((h) => h.cid));
    const pool = CHARS.map((c) => c.id).filter((id) => !used.has(id)).sort(() => Math.random() - 0.5);
    const grid = humans.slice();
    for (let k = 0; grid.length < PLAYERS; k++) grid.push({ id: `cpu${k}`, cid: pool[k % pool.length], cpu: true });
    return grid;
  }
  function resetShow() {
    history = [];
    totalFalls = 0;
    audio.init(); // sin música de fondo: sólo los efectos
  }
  /** el anfitrión (o tú, en solitario) lanza una ronda para todos */
  function beginRound(i, grid) {
    const order = grid.slice().sort(() => Math.random() - 0.5);
    const at = hostNow() + (online.on ? 700 : 200);
    tx({ t: "round", i, at, seed: seedBase, grid: order });
    loadRound(i, order, at);
  }
  function startShow() {
    if (online.on) return hostStartShow();
    mode = "solo";
    seedBase = (Math.random() * 1e9) | 0;
    resetShow();
    beginRound(0, cpuFill([{ id: "me", cid: myChar, cpu: false }]));
  }
  function hostStartShow() {
    if (!online.on || !net.isHost) return;
    seedBase = (Math.random() * 1e9) | 0;
    resetShow();
    beginRound(0, cpuFill(online.roster.map((p) => ({ id: p.id, cid: p.c, cpu: false }))));
  }

  // ── entrada ──
  const keys = {};
  const tp = { jump: false, grab: false };
  const gp = { x: 0, y: 0, jump: false, grab: false, prev: [] };
  let prevJump = false;
  function readLocal() {
    const joy = touchPad ? touchPad.joy : { x: 0, y: 0 };
    let ix = gp.x + joy.x, iy = gp.y + joy.y;
    if (keys.KeyA || keys.ArrowLeft || mando.L) ix -= 1;
    if (keys.KeyD || keys.ArrowRight || mando.R) ix += 1;
    if (keys.KeyW || keys.ArrowUp || mando.Up) iy += 1;
    if (keys.KeyS || keys.ArrowDown || mando.Down) iy -= 1;
    const l = Math.hypot(ix, iy);
    if (l > 1) { ix /= l; iy /= l; }
    const jumpHeld = !!(keys.Space || keys.KeyK || mando.A || gp.jump || tp.jump);
    const jump = jumpHeld && !prevJump;
    prevJump = jumpHeld;
    const grab = !!(keys.ShiftLeft || keys.ShiftRight || keys.KeyE || keys.KeyJ || mando.B || gp.grab || tp.grab);
    // la cámara mira hacia +z: arriba = +z, derecha de la pantalla = -x
    return { mx: -ix, mz: iy, jump, grab };
  }

  const sim = createSim({
    get K() { return K; }, get L() { return L; }, get cs() { return cs; }, get me() { return me; }, get t() { return kitT; }, get winner() { return winner; },
    sfx, flash: (...a) => flash(...a), shake: (a) => shake(a), buzz, burst: (...a) => burst(...a),
    finishC: (c) => localFinish(c), winBattery: (c) => localBattery(c), tick: (i) => tick(i), myFall: () => totalFalls++,
    // agarrar a alguien de otro móvil: se le avisa (el anfitrión reenvía)
    onGrab: (c, o, on) => { if (!owned(o)) tx({ t: "grab", from: c.id, to: o.id, on }); },
    owned: (c) => owned(c),
    onHit: (c, vx, vz, vy) => tx({ t: "hit", to: c.id, vx, vz, vy })
  });
  const { aiInput, stepChar, collideContestants, remoteContact } = sim;

  // ── progreso de la ronda (manda el anfitrión) ──
  function localFinish(c) {
    if (c.finished || phase !== "race") return;
    c.finished = true;
    c.finishT = roundT;
    if (isAuthority()) registerFinish(c.id);
    else tx({ t: "fin", r: roundIdx, id: c.id });
  }
  function registerFinish(id) {
    if (roundOver || finishIds.includes(id) || L.final) return;
    finishIds.push(id);
    tx({ t: "fins", r: roundIdx, ids: finishIds });
    applyFins(finishIds);
    if (finishIds.length >= qualifyN) { roundOver = true; schedule(hostNow() + 1200, hostEndRound); }
  }
  function applyFins(ids) {
    const had = me && finishIds.includes(me.id) && me.qualShown;
    finishIds = ids.slice();
    for (const id of ids) { const c = byId(id); if (c) c.finished = true; }
    if (me && finishIds.includes(me.id) && !had && !me.qualShown) {
      me.qualShown = true;
      sfx.qual();
      flash("¡CLASIFICADO!", `${finishIds.indexOf(me.id) + 1}º de ${qualifyN}`, 2.2);
      checks.forEach((k) => (k.done = true));
      renderChecks();
    }
  }
  function localBattery(c) {
    if (winner || c.batSent || phase !== "race") return;
    c.batSent = true;
    if (isAuthority()) declareWin(c.id);
    else tx({ t: "bat", r: roundIdx, id: c.id });
  }
  function declareWin(id) {
    if (winner || roundOver) return;
    roundOver = true;
    tx({ t: "win", r: roundIdx, id });
    applyWin(id);
    schedule(hostNow() + 2800, () => { tx({ t: "rend", r: roundIdx, ids: [id] }); onRoundEnd([id]); });
  }
  function applyWin(id) {
    const c = byId(id);
    if (!L || !c || winner) return;
    winner = c;
    c.finished = true;
    finishIds = [id];
    burst(L.battery.x, L.battery.y, L.battery.z, INK.GREEN, 40);
    L.battery.group.visible = false;
    const crown = new THREE.Group();
    for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(GEO.cone, cm); m.scale.set(0.18, 0.4, 0.18); m.position.set(Math.cos(k * 1.26) * 0.3, 0.15, Math.sin(k * 1.26) * 0.3); crown.add(m); }
    const ring = new THREE.Mesh(GEO.cyl, cm); ring.scale.set(0.7, 0.18, 0.7); crown.add(ring);
    overlay.add(crown);
    c.crown = crown;
    if (c === me) { checks.forEach((k) => (k.done = true)); renderChecks(); audio.victory(); flash("🔋 ¡ES TUYA!", "Consentimiento firmado: tu batería entra en el mercado de flexibilidad", 3); }
    else flash("🔋", `${c.emoji} ${c.name} se ha llevado la batería`, 2.6);
  }
  function hostEndRound() {
    if (!isAuthority() || screen === "roundend" || screen === "end" || !L) return;
    roundOver = true;
    if (L.final) {
      // se acaba el tiempo: gana quien esté más arriba
      const best = cs.slice().sort((a, b) => b.y + b.z * 0.1 - (a.y + a.z * 0.1))[0];
      roundOver = false;
      if (best) declareWin(best.id);
      return;
    }
    const ids = finishIds.slice();
    tx({ t: "rend", r: roundIdx, ids });
    onRoundEnd(ids);
  }
  function onRoundEnd(ids) {
    if (!L || destroyed || screen === "lobby" || screen === "roundend" || screen === "end") return;
    paused = false;
    screen = "roundend";
    phase = "done";
    const wasIn = !!me;
    const myPos = me ? ids.indexOf(me.id) + 1 : 0;
    if (wasIn) history.push({ round: roundIdx, pos: myPos, qualified: myPos > 0, of: cs.length });
    const next = ids.map((id) => alive.find((a) => a.id === id)).filter(Boolean);
    alive = next;
    if (L.final) return endShow();
    const ok = myPos > 0;
    $(".fg-re-title").textContent = !wasIn ? "Fin de la ronda" : ok ? "¡Clasificado!" : "Eliminado";
    $(".fg-re-sub").textContent = !wasIn ? "Siguen en el show:" : ok ? `Pasas a la siguiente ronda (${myPos}º)` : mode === "online" ? "Puedes seguir el show como espectador" : "Esta vez no ha podido ser…";
    $(".fg-chips").innerHTML = ids.map((id, i) => { const c = byId(id); return c ? `<span class="dd-mp-chip${c === me ? " me" : ""}">${i + 1}º ${c.emoji} ${c.name}</span>` : ""; }).join("");
    showOv("roundend");
    syncPad();
    if (wasIn) { ok ? sfx.qual() : audio.lose(); reportScore(false); }
    if (isAuthority()) schedule(hostNow() + 3600, () => {
      if (screen !== "roundend") return;
      if (mode === "solo" && !ok) return endShow();
      if (!next.length) { tx({ t: "end" }); return endShow(); }
      beginRound(roundIdx + 1, next);
    });
  }
  function points() {
    let pts = 0;
    for (const h of history) if (h.qualified) pts += 1000 + Math.max(0, 9 - h.pos) * 150;
    if (winner && winner === me) pts += 5000;
    return pts;
  }
  function rankOf() {
    if (!(winner && winner === me)) return "";
    const top3 = history.every((h) => h.qualified && h.pos <= 3);
    return top3 && totalFalls <= 3 ? "S" : top3 ? "A" : "B";
  }
  function reportScore(final) {
    const pts = points();
    if (onScore && pts > 0) try { onScore(pts, { wave: history.length, won: !!(winner && winner === me), falls: totalFalls, place: history.length ? history[history.length - 1].pos : 0, racers: mode === "online" ? online.roster.length : 1 }, rankOf()); } catch (e) {}
    if (final && winner && winner === me && onVictory) try { onVictory(pts, rankOf()); } catch (e) {}
  }
  function endShow() {
    if (destroyed || screen === "lobby") return;
    paused = false;
    screen = "end";
    const won = winner && winner === me;
    const last = history[history.length - 1];
    $(".fg-end-title").textContent = won ? "🔋👑 ¡Te has llevado la batería!" : last && !last.qualified ? `Eliminado en la ronda ${last.round + 1}` : `${winner ? `${winner.emoji} ${winner.name}` : "Otro"} se llevó la batería`;
    $(".fg-end-sub").textContent = won ? "Usuario completo: consumo, producción y facturas, y consentimiento para controlar su batería en el mercado de flexibilidad." : "El usuario casi está listo para la flexibilidad. ¡Otra ronda!";
    $(".fg-end-list").innerHTML = history.map((h) => `<div class="rk-row${h.qualified ? " me" : ""}"><span>${h.round + 1}</span><span>${LEVEL_INFO[h.round].icon} ${LEVEL_INFO[h.round].title}</span><b>${h.qualified ? (h.round === 3 ? "🔋 1º" : `${h.pos}º ✓`) : "✗"}</b></div>`).join("")
      + `<div class="rk-row"><span>💨</span><span>Caídas</span><b>${totalFalls}</b></div><div class="rk-row"><span>⭐</span><span>Puntos</span><b>${points()}</b></div>`;
    const again = $(".fg-again");
    again.disabled = mode === "online" && !net.isHost;
    again.textContent = again.disabled ? "Esperando al anfitrión…" : "Otra vez";
    showOv("end");
    won ? audio.victory() : audio.lose();
    if (history.length) reportScore(true);
    syncPad();
  }

  // ── rivales de otros móviles (interpolados) ──
  const REMOTE_GROUND = { kind: "remote" };
  function updateRemote(c) {
    const buf = c.buf;
    if (!buf.length) return;
    const rt = hostNow() - INTERP_MS;
    while (buf.length > 2 && buf[1].ts <= rt) buf.shift();
    let s;
    if (buf.length >= 2 && buf[0].ts <= rt && buf[1].ts >= rt) {
      const a = buf[0], b = buf[1], k = (rt - a.ts) / Math.max(1, b.ts - a.ts);
      s = { ...b, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k };
    } else {
      const l = buf[buf.length - 1], ahead = clamp((rt - l.ts) / 1000, 0, 0.15);
      s = { ...l, x: l.x + l.vx * ahead, z: l.z + l.vz * ahead };
    }
    c.x = s.x; c.y = s.y; c.z = s.z; c.vx = s.vx; c.vz = s.vz; c.vy = 0; c.yaw = s.yaw;
    c.ground = s.g ? REMOTE_GROUND : null;
    c.dive = !!s.dv; c.stun = s.st ? 0.3 : 0; c.respawnT = s.rs ? 0.3 : 0; c.grabHeld = !!s.gh;
    c.grabbing = s.gb ? byId(s.gb) || null : null;
    if (s.f) c.finished = true;
    remoteContact(c);
  }
  const r2 = (v) => Math.round(v * 100) / 100;
  const stateOf = (c) => ({
    id: c.id, ts: Math.round(hostNow()), x: r2(c.x), y: r2(c.y), z: r2(c.z), vx: r2(c.vx), vz: r2(c.vz), yaw: r2(c.yaw),
    g: c.ground ? 1 : 0, dv: c.dive ? 1 : 0, st: c.stun > 0 ? 1 : 0, rs: c.respawnT > 0 ? 1 : 0, gh: c.grabHeld ? 1 : 0, gb: c.grabbing ? c.grabbing.id : 0, f: c.finished ? 1 : 0
  });
  function netTick(dt) {
    if (!online.on) return;
    online.pingT -= dt;
    if (online.pingT <= 0) { online.pingT = 0.8; tx({ t: "ping", c: performance.now() }); }
    if (screen !== "play" && screen !== "intro" && screen !== "roundend") return;
    online.sendT -= dt;
    if (online.sendT > 0) return;
    online.sendT = 1 / SEND_HZ;
    if (me) tx({ t: "st", s: stateOf(me) });
    if (net.isHost) {
      const cpus = cs.filter((c) => c.ctrl === "cpu");
      if (cpus.length) net.broadcast({ t: "cpu", list: cpus.map(stateOf) });
    }
  }

  // ── simulación ──
  function stepSim(dt, now = hostNow()) {
    if (RC.events.length) {
      const due = RC.events.filter((e) => e.at <= now);
      if (due.length) { RC.events = RC.events.filter((e) => e.at > now); due.forEach((e) => e.fn()); }
    }
    if (!K || (screen !== "play" && screen !== "intro" && screen !== "roundend")) return;
    kitT = Math.max(0, (now - RC.at) / 1000);
    roundT = Math.max(0, (now - RC.goAt) / 1000);
    K.update(kitT, dt);
    if (phase !== "race" && phase !== "done") return;
    const local = paused ? { mx: 0, mz: 0, jump: false, grab: false } : readLocal();
    const idle = { mx: 0, mz: 0, jump: false, grab: false };
    for (const c of cs) {
      if (c.ctrl === "remote") { updateRemote(c); continue; }
      if (c.ctrl === "cpu" && !isAuthority()) continue;
      const inp = c.ctrl === "cpu" ? aiInput(c, dt) : DBG.autopilot ? aiInput(Object.assign(c, { bot: c.bot || newBot() }), dt) : local;
      // un agarre sólo dura mientras el otro te siga agarrando
      if (c.grabbedBy) {
        const g = c.grabbedBy;
        if (owned(g)) { if (g.grabbing !== c || !cs.includes(g)) c.grabbedBy = null; }
        else { c.grabSafe -= dt; if (c.grabSafe <= 0) c.grabbedBy = null; }
      }
      stepChar(c, c.finished || phase === "done" ? idle : inp, dt);
    }
    collideContestants();
    if (isAuthority() && screen === "play" && !roundOver && roundT > L.time) hostEndRound();
    for (const b of bits) b.m.position.y = -13.6 + Math.sin(kitT * 1.5 + b.ph) * 0.3;
  }
  const DBG = { autopilot: false };

  // ── mensajes ──
  const lobby = { status: $(".fg-status"), room: $(".fg-room"), row: $(".fg-lobbyrow"), code: $(".fg-code"), codeBig: $(".fg-codebig"), list: $(".fg-list"), go: $(".fg-go") };
  const setStatus = (t, err) => { lobby.status.textContent = t; lobby.status.classList.toggle("err", !!err); };
  function renderRoom() {
    lobby.room.classList.toggle("hidden", !online.on);
    lobby.row.classList.toggle("hidden", online.on);
    $(".fg-solo").disabled = online.on;
    lobby.codeBig.textContent = net.code || "";
    lobby.list.innerHTML = online.roster.map((p) => `<span class="dd-mp-chip${p.id === net.myId ? " me" : ""}">${charById(p.c).emoji} ${charById(p.c).name}${p.id === net.hostId ? " ⭐" : ""}</span>`).join("")
      + (online.on ? `<span class="dd-mp-chip rk-cpuchip">🤖 ×${Math.max(0, PLAYERS - online.roster.length)}</span>` : "");
    lobby.go.disabled = !(online.on && net.isHost);
    lobby.go.textContent = net.isHost ? `¡Empieza el show! (${online.roster.length})` : "Esperando al anfitrión…";
  }
  function hostRoster() {
    const list = [{ id: net.myId, c: myChar }];
    online.roster.forEach((p) => { if (p.id !== net.myId) list.push(p); });
    online.roster = list;
    net.broadcast({ t: "roster", list });
    renderRoom();
  }
  net.on("ping", (m, from) => {
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
  net.on("round", (m) => {
    if (net.isHost) return;
    if (m.i === 0 || screen === "lobby") resetShow(); // quien entra con el show empezado, empieza de cero
    seedBase = m.seed;
    loadRound(m.i, m.grid, m.at);
  });
  const pushState = (s) => {
    const c = byId(s.id);
    if (!c || c.ctrl !== "remote") return;
    c.buf.push(s);
    if (c.buf.length > 30) c.buf.shift();
  };
  net.on("st", (m, from) => { pushState(m.s); if (net.isHost) net.broadcast(m, from); });
  net.on("cpu", (m) => { if (!net.isHost) m.list.forEach(pushState); });
  // los mensajes de la ronda sólo valen para la ronda que se está jugando
  const inShow = () => !!L && screen !== "lobby";
  const sameRound = (m) => inShow() && m.r === roundIdx;
  net.on("fin", (m) => { if (net.isHost && sameRound(m)) registerFinish(m.id); });
  net.on("fins", (m) => { if (!net.isHost && sameRound(m)) applyFins(m.ids); });
  net.on("bat", (m) => { if (net.isHost && sameRound(m)) declareWin(m.id); });
  net.on("win", (m) => { if (!net.isHost && sameRound(m)) applyWin(m.id); });
  net.on("rend", (m) => { if (!net.isHost && sameRound(m)) onRoundEnd(m.ids); });
  net.on("end", () => { if (!net.isHost && inShow()) endShow(); });
  // empujones en plancha a jugadores de otros móviles: los aplica su dueño
  net.on("hit", (m) => {
    const t = byId(m.to);
    if (t && owned(t)) sim.knock(t, m.vx, m.vz, m.vy);
    else if (net.isHost && t) net.sendTo(m.to, m);
  });
  net.on("grab", (m) => {
    const t = byId(m.to);
    if (t && owned(t)) { t.grabbedBy = m.on ? byId(m.from) || null : null; t.grabSafe = 2.6; if (m.on && t === me) { sfx.grab(); flash("", `¡${(byId(m.from) || { name: "Alguien" }).name} te ha agarrado!`, 1); } }
    else if (net.isHost && t) net.sendTo(m.to, m);
  });
  net.on("voice", (m, from) => {
    const c = byId(m.id);
    const charId = c ? (c.c || c.char) : m.charId;
    speakCharacter(charId, { force: true, phrase: m.phrase, sillyVoice: m.sillyVoice });
    if (net.isHost) net.broadcast(m, from);
  });
  net.on("_leave", (m, id) => {
    if (net.isHost) {
      online.roster = online.roster.filter((p) => p.id !== id);
      hostRoster();
      // su concursante pasa a la CPU para que el show siga
      const c = byId(id);
      if (c) {
        c.ctrl = "cpu"; c.cpu = true; c.bot = newBot(); c.buf = [];
        if (c.grabbing) { c.grabbing.grabbedBy = null; c.grabbing = null; }
        c.cp = 0; // último punto de control por el que ha pasado
        K.checkpoints.forEach((cp, k) => { if (c.z >= cp.z && c.x >= cp.x0 && c.x <= cp.x1 && cp.z > K.checkpoints[c.cp].z) c.cp = k; });
      }
      const a = alive.find((q) => q.id === id);
      if (a) a.cpu = true;
      if (screen === "play") flash("", `${c ? c.name : "Un jugador"} ha salido: le sustituye la CPU`, 2);
    } else if (id === net.hostId) {
      const inShow = screen !== "lobby";
      leaveRoom();
      if (inShow) toLobby();
      setStatus("El anfitrión ha cerrado la sala.", true);
    }
  });
  $(".fg-create").addEventListener("click", async () => {
    setStatus("Creando sala…");
    try {
      await net.host(randomCode());
      online.on = true; mode = "online"; clock.offset = 0;
      online.roster = [{ id: net.myId, c: myChar }];
      hostRoster();
      setStatus("Comparte el código. Los huecos libres los ocupa la CPU.");
    } catch (err) { if (!err.cancelled) setStatus(err.message, true); }
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
      setStatus("¡Dentro! El show lo empieza el anfitrión.");
    } catch (err) { if (!err.cancelled) setStatus(err.message, true); }
  }
  $(".fg-join").addEventListener("click", joinRoom);
  lobby.code.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") joinRoom(); });
  lobby.code.addEventListener("input", () => { lobby.code.value = cleanCode(lobby.code.value); });
  $(".fg-copy").addEventListener("click", () => { try { navigator.clipboard.writeText(net.code); setStatus("Código copiado ✔"); } catch (e) {} });
  function leaveRoom() {
    net.destroy();
    online.on = false; online.roster = [];
    mode = "solo"; clock.offset = 0; clock.samples = []; clock.rtt = 0;
    renderRoom();
  }
  $(".fg-leave").addEventListener("click", () => { leaveRoom(); setStatus(""); });
  lobby.go.addEventListener("click", hostStartShow);

  // ── efectos ──
  const particles = [];
  function burst(x, y, z, ink, n) {
    for (let i = 0; i < n; i++) {
      let p = particles.find((q) => !q.alive);
      if (!p) {
        if (particles.length > 200) return;
        p = { mesh: new THREE.Mesh(GEO.sph, mat(ink, { fill: true })), vel: new THREE.Vector3() };
        scene.add(p.mesh);
        particles.push(p);
      }
      p.alive = true;
      p.mesh.material = mat(ink, { fill: true });
      p.mesh.visible = true;
      p.mesh.position.set(x, y, z);
      p.mesh.scale.setScalar(rnd(0.12, 0.3));
      p.vel.set(rnd(-4, 4), rnd(2, 7), rnd(-4, 4));
      p.life = rnd(0.4, 0.9);
    }
  }
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
  const shake = (a) => (shakeAmt = Math.max(shakeAmt, a * motionScale()));

  // ── dibujo ──
  const _v = new THREE.Vector3();
  function drawContestants(dt) {
    for (const c of cs) {
      const hidden = c.respawnT > 0;
      c.sticker.setVisible(!hidden);
      c.shadow.visible = !hidden;
      if (c.marker) c.marker.visible = !hidden;
      if (hidden) continue;
      _v.set(c.x, c.y, c.z);
      const sp = Math.hypot(c.vx, c.vz);
      // pose de agarrar tanto al sujetar a alguien como mientras se mantiene el botón de agarrar
      const pose = c.stun > 0 ? "damage" : (c.grabbing || c.grabHeld) ? "attack" : !c.ground || c.dive ? "jump" : undefined;
      c.sticker.update(dt, {
        pos: _v, camera, moveX: Math.abs(c.vx) > 0.6 ? -c.vx : 0, speed: c.ground ? sp : 0, onGround: !!c.ground, firing: false, pose,
        hurt: c.stun > 0 ? 0.5 : c.grabbedBy ? 0.3 : 0,
        tilt: c.dive ? (c.vx > 0 ? 0.5 : -0.5) : c.stun > 0 ? Math.sin(roundT * 25) * 0.3 : 0,
        squash: c.recover > 0 ? 0.8 : 1
      });
      const gy = K.groundAt(c.x, c.z, c.y + 0.1);
      if (gy > -50) {
        c.shadow.position.set(c.x, gy + 0.04, c.z);
        const k = clamp(1 - (c.y - gy) / 6, 0.35, 1);
        c.shadow.scale.set(0.95 * k, 0.95 * k, 1);
        c.shadow.visible = true;
      } else c.shadow.visible = false;
      if (c.marker) c.marker.position.set(c.x, c.y + H + 0.75 + Math.sin(roundT * 4) * 0.08, c.z);
      if (c.crown) { c.crown.position.set(c.x, c.y + H + 0.45, c.z); c.crown.rotation.y += dt * 2; }
    }
  }
  // ── espectador (como en Fall Guys): al llegar a la meta o quedar eliminado sigues a otro ──
  let spec = null;
  const followEl = $(".fg-follow"), followName = $(".fg-fname");
  const runners = () => cs.filter((c) => c !== me && !c.finished);
  const byProgress = (list) => list.slice().sort((a, b) => b.z + b.y * 2 - (a.z + a.y * 2));
  let specFinAt = 0;
  function specTarget() {
    if (!spec || !cs.includes(spec)) { spec = byProgress(runners())[0] || byProgress(cs.filter((c) => c !== me))[0] || null; specFinAt = 0; }
    // si al que sigues ya ha llegado, a los 2,5 s pasas al que va primero de los que siguen corriendo
    if (spec && spec.finished && runners().length) {
      const now = performance.now();
      if (!specFinAt) specFinAt = now;
      else if (now - specFinAt > 2500) { spec = byProgress(runners())[0]; specFinAt = 0; camInit = false; }
    } else specFinAt = 0;
    return spec;
  }
  function switchSpec(d) {
    const list = byProgress(runners().length ? runners() : cs.filter((c) => c !== me));
    if (!list.length) return;
    const i = list.indexOf(spec);
    spec = list[(i + d + list.length) % list.length];
    specFinAt = 0;
    camInit = false;
    audio.tone({ freq: 700, dur: 0.05, type: "triangle", gain: 0.07 });
  }
  function updateFollow() {
    const on = !!K && (screen === "play" || screen === "intro") && (!me || me.finished);
    followEl.classList.toggle("hidden", !on);
    if (on) { const t = specTarget(); const txt = t ? `👀 ${t.emoji} ${t.name}${t.human ? "" : " 🤖"}${t.finished ? " ✓" : ""}` : ""; if (followName.textContent !== txt) followName.textContent = txt; }
  }
  $(".fg-fprev").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); switchSpec(-1); });
  $(".fg-fnext").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); switchSpec(1); });
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), _look = new THREE.Vector3();
  let camInit = false;
  // vuelo de presentación (como en Fall Guys): de la meta hacia la salida, mirando al recorrido
  function flyover() {
    const k = clamp((hostNow() - RC.at) / INTRO_MS, 0, 1);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // suave al salir y al llegar
    const endZ = L.finish ? L.finish.z + 4 : L.battery ? L.battery.z + 2 : 120;
    const sp = K.checkpoints[0].spawn;
    const startZ = (me ? me.z : sp.z) - 9.2, startX = (me ? me.x : 0) * 0.9;
    const z = endZ + (startZ - endZ) * e;
    const ground = Math.max(sp.y, K.groundAt(0, z + 8, 60));
    const h = 15 + (5.4 - 15) * e;
    camPos.set(startX * e, Math.max(ground, (me ? me.y : sp.y) * e) + h, z);
    camLook.set(startX * e, ground + 1.2 * e, z + 22 - 16 * e);
    camInit = true;
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    const fov = root.clientWidth < root.clientHeight ? 78 : 62;
    if (Math.abs(camera.fov - fov) > 0.1) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }
  function updateCamera(dt) {
    if (screen === "intro" && K && L) return flyover();
    const watching = !me || me.finished ? specTarget() : null;
    const f = watching || (me && me.respawnT <= 0 ? me : null);
    // espectador: sigue al que va primero
    const t = f || me || cs.filter((c) => c.respawnT <= 0).sort((a, b) => b.z + b.y - (a.z + a.y))[0] || cs[0];
    if (!t) return;
    const portrait = root.clientWidth < root.clientHeight;
    const want = _v.set(t.x * 0.9, t.y + (portrait ? 6.4 : 5.4), t.z - (portrait ? 10.5 : 9.2));
    if (!camInit) { camPos.copy(want); camLook.set(t.x, t.y + 1.2, t.z + 6); camInit = true; }
    camPos.lerp(want, Math.min(1, dt * (f ? 5 : 2)));
    camLook.lerp(_look.set(t.x, t.y + 1.3, t.z + 6), Math.min(1, dt * 7));
    const sh = shakeAmt * shakeAmt * 0.5;
    shakeAmt = Math.max(0, shakeAmt - dt * 2.5);
    camera.position.set(camPos.x + rnd(-sh, sh), camPos.y + rnd(-sh, sh), camPos.z);
    camera.lookAt(camLook);
    const fov = portrait ? 78 : 62;
    if (Math.abs(camera.fov - fov) > 0.1) { camera.fov = fov; camera.updateProjectionMatrix(); }
  }

  // ── HUD ──
  const hud = { big: $(".fg-big"), msg: $(".fg-msg"), qual: $(".fg-qual b"), qualOf: $(".fg-qual small"), time: $(".fg-time"), check: $(".fg-check"), qualLbl: $(".fg-qual span") };
  let bigT = 0;
  const setText = (el, v) => { if (el.textContent !== v) el.textContent = v; }; // sólo toca el DOM si cambia
  function flash(txt, sub = "", dur = 1.3) {
    hud.big.textContent = txt;
    hud.msg.textContent = sub;
    hud.big.className = "fg-big show";
    void hud.big.offsetWidth;
    hud.big.classList.add("pop");
    bigT = dur;
  }
  function renderChecks() {
    hud.check.innerHTML = checks.map((k) => `<li class="${k.done ? "done" : ""}">${k.done ? "✔" : "○"} ${k.label}</li>`).join("");
  }
  function tick(idx) {
    const k = checks[idx];
    if (!k || k.done) return;
    for (let i = 0; i <= idx; i++) checks[i].done = true; // al pasar un arco, lo de antes ya está
    renderChecks();
    sfx.check();
    flash("", `✔ ${k.label}`, 1);
  }
  function updateHud(dt) {
    if (L) {
      setText(hud.qual, L.final ? (winner ? "1" : "0") : String(finishIds.length));
      setText(hud.qualOf, `/${qualifyN}`);
      setText(hud.qualLbl, L.final ? "BATERÍA" : "CLASIFICADOS");
      const left = Math.max(0, L.time - roundT);
      setText(hud.time, fmt(left));
      hud.time.classList.toggle("low", left < 20 && phase === "race");
    }
    bigT -= dt;
    if (bigT <= 0) hud.big.classList.remove("show");
    hud.msg.style.opacity = bigT > 0 ? "1" : "0";
  }

  // ── selector de personaje ──
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
  }));
  renderPick();

  // ── overlays ──
  function showOv(name) {
    $(".fg-lobby").classList.toggle("hidden", name !== "lobby");
    $(".fg-intro").classList.toggle("hidden", name !== "intro");
    $(".fg-roundend").classList.toggle("hidden", name !== "roundend");
    $(".fg-pause").classList.toggle("hidden", name !== "pause");
    $(".fg-end").classList.toggle("hidden", name !== "end");
  }
  let pausedAt = 0;
  function pause() {
    if (screen !== "play" || paused) return;
    paused = true;
    pausedAt = hostNow();
    $(".fg-pause-note").textContent = mode === "online" ? "El show sigue: tu concursante se queda quieto." : "";
    showOv("pause");
    syncPad();
  }
  function resume() {
    if (!paused) return;
    paused = false;
    if (mode === "solo") { // en solitario el reloj se para de verdad
      const d = hostNow() - pausedAt;
      RC.at += d; RC.goAt += d;
      RC.events.forEach((e) => (e.at += d));
    }
    showOv(null);
    syncPad();
  }
  function toLobby() {
    if (K) { K.dispose(); K = null; }
    disposeContestants();
    L = null;
    RC.events = [];
    screen = "lobby"; paused = false; phase = "idle";
    renderRoom();
    $(".fg-hud").classList.add("hidden");
    showOv("lobby");
    syncPad();
  }
  $(".fg-solo").addEventListener("click", startShow);
  $(".fg-resume").addEventListener("click", resume);
  $(".fg-quit").addEventListener("click", () => { if (online.on) leaveRoom(); toLobby(); });
  $(".fg-again").addEventListener("click", startShow);
  $(".fg-tolobby").addEventListener("click", toLobby);
  $(".rk-exit").addEventListener("click", exit);
  $(".fg-pausebtn").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); pause(); });

  // ── entrada ──
  function onKeyDown(e) {
    if (e.target && e.target.tagName === "INPUT") return;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if (e.code === "KeyV" && !e.repeat) triggerVoice();
    if ((e.code === "Escape" || e.code === "KeyP") && screen === "play") paused ? resume() : pause();
    if ((!me || me.finished) && screen === "play" && !e.repeat) {
      if (e.code === "ArrowLeft" || e.code === "KeyA" || e.code === "KeyQ") switchSpec(-1);
      if (e.code === "ArrowRight" || e.code === "KeyD" || e.code === "KeyE") switchSpec(1);
    }
    if (e.code === "KeyM") audio.toggleMusic();
  }
  function isAlvaroNear() {
    if (!me || !cs || !cs.length) return false;
    return cs.some(other => other !== me && (other.c === "alvaroP" || other.c === "alvaro") && Math.hypot(other.x - me.x, other.z - me.z) < 10);
  }
  function triggerVoice() {
    const cId = (me && me.c) ? me.c : myChar;
    const nearAlvaro = isAlvaroNear();
    speakCharacter(cId, {
      nearAlvaro,
      onBroadcast: ({ phrase, sillyVoice }) => {
        tx({ t: "voice", id: myId(), charId: cId, phrase, sillyVoice });
      }
    });
  }
  function onKeyUp(e) { keys[e.code] = false; }
  function onBlur() { for (const k in keys) keys[k] = false; if (screen === "play" && mode === "solo") pause(); }
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  root.addEventListener("pointerdown", () => { audio.init(); audio.resume(); }, { capture: true });
  const touchPad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "jump", label: "SALTO", icon: ICON.jump, accent: "red" },
      { id: "grab", label: "AGARRAR", icon: ICON.punch, accent: "blue" },
      { id: "voice", label: "VOZ", icon: ICON.speech, accent: "blue" }
    ],
    isActive: () => screen === "play" && !paused,
    onAction: (id, down) => {
      if (id === "voice") {
        if (down) triggerVoice();
        return;
      }
      tp[id] = down;
    }
  }) : null;
  function syncPad() {
    setInPlay(screen === "play" && !paused);
    const portrait = document.body.classList.contains("gameboy-mode");
    if (touchPad) touchPad.setVisible(isTouch && !portrait && screen === "play" && !paused);
    root.classList.toggle("dd-landpad", isTouch && !portrait);
  }
  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let g = null;
    for (const p of pads) if (p && p.connected) { g = p; break; }
    if (!g) { Object.assign(gp, { x: 0, y: 0, jump: false, grab: false }); return; }
    const b = (i) => !!(g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.4));
    gp.x = (Math.abs(g.axes[0] || 0) > 0.15 ? g.axes[0] : 0) + (b(15) ? 1 : 0) - (b(14) ? 1 : 0);
    gp.y = -(Math.abs(g.axes[1] || 0) > 0.15 ? g.axes[1] : 0) + (b(12) ? 1 : 0) - (b(13) ? 1 : 0);
    gp.jump = b(0);
    gp.grab = b(2) || b(1) || b(5) || b(7);
    if (b(9) && !gp.prev[9] && screen === "play") paused ? resume() : pause();
    gp.prev[9] = b(9);
  }
  const relabels = [];
  for (const [sel, t] of [["#gbLabelA", "SALTO"], ["#gbLabelB", "AGARRAR"]]) {
    const el = document.querySelector(sel);
    if (el) { relabels.push([el, el.textContent]); el.textContent = t; }
  }

  // ── tamaño ──
  function resize() {
    const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    R3.setSize(w, h);
    syncPad();
  }
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(root);
  window.addEventListener("resize", resize);
  resize();

  // ── bucle ──
  // varios pasos seguidos (fotograma lento o pestaña de fondo): cada uno con su instante
  function runSteps() {
    const n = Math.floor(acc / STEP);
    if (!n) return;
    const now = hostNow();
    for (let i = 0; i < n; i++) stepSim(STEP, now - (n - 1 - i) * STEP * 1000);
    acc -= n * STEP;
  }
  let raf = 0, prev = performance.now(), acc = 0, wall = 0, lastRaf = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prev) / 1000);
    prev = now;
    wall += dt;
    pollGamepad();
    lastRaf = performance.now();
    const frozen = paused && mode === "solo";
    if (!frozen) {
      acc += dt;
      runSteps();
      updateParticles(dt);
    } else acc = 0;
    netTick(dt);
    if (screen === "lobby" || !K) {
      const a = wall * 0.08;
      camera.position.set(Math.cos(a) * 30, 16, 40 + Math.sin(a) * 30);
      camera.lookAt(0, -10, 60);
      if (camera.fov !== 60) { camera.fov = 60; camera.updateProjectionMatrix(); }
    } else {
      drawContestants(frozen ? 0 : dt);
      updateCamera(dt);
    }
    updateHud(dt);
    updateFollow();
    R3.render(scene, camera, { time: wall, hurt: me && me.stun > 0 ? 0.25 : 0, lowHp: 0, flash: 0 }, overlay);
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
    runSteps();
    online.sendT = 0;
    netTick(dt);
  }, 50);

  // ── salida ──
  let destroyed = false;
  function destroy() {
    clearStickerCache();
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    clearInterval(bgTimer);
    RC.events = [];
    net.destroy();
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("resize", resize);
    if (ro) ro.disconnect();
    setInPlay(false);
    relabels.forEach(([el, t]) => (el.textContent = t));
    document.body.classList.remove("doodle-mode");
    disposeContestants();
    if (K) K.dispose();
    if (touchPad) touchPad.destroy();
    audio.destroy();
    R3.dispose();
    root.remove();
    if (window.__fall) delete window.__fall;
  }
  function exit() { destroy(); if (onExit) onExit(); }
  if (import.meta.env && import.meta.env.DEV) window.__fall = {
    DBG, step: (n = 1) => { for (let i = 0; i < n; i++) stepSim(STEP); }, load: (i) => { if (!alive.length) startShow(); beginRound(i, alive.length ? alive : cpuFill([{ id: "me", cid: myChar, cpu: false }])); }, net, online, clock, endRound: () => hostEndRound(), get spec() { return spec; }, switchSpec, get history() { return history; },
    get cs() { return cs; }, get me() { return me; }, get K() { return K; }, get L() { return L; }, get screen() { return screen; }, set screen(v) { screen = v; }, get phase() { return phase; }, set phase(v) { phase = v; }, get roundT() { return roundT; }, startShow
  };
  setInPlay(false);
  showOv("lobby");
  renderRoom();
  // las pegatinas de todos se preparan mientras estás en el menú: así la ronda empieza sin tirón
  prewarmStickers(CHARS.map((c) => c.id));
  return { destroy, exit };
}
