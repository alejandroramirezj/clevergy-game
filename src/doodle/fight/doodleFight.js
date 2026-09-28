// =============================================================================
// doodleFight.js — MUNDO 2 · CODE CLASH ARENA (lucha 1v1 dibujada a boli, Three.js)
//
// · Vista lateral 2.5D: la oficina en 3D con el render de boli de Doodle District y
//   los luchadores como pegatinas grandes. Cámara que encuadra a los dos.
// · Combate: combo de 3 golpes, golpe aéreo, doble salto, bloqueo, especial por
//   personaje, pausa de impacto, K.O. a cámara lenta, 3 rondas (gana quien haga 2).
// · Contra la CPU o online P2P (PeerJS):
//     - Cada jugador simula SU luchador (sin retardo en tus controles) y envía su
//       estado 30 veces por segundo; el rival se pinta interpolado 90 ms por detrás.
//     - Quien golpea detecta el impacto y avisa; la víctima aplica el daño (así
//       nadie resta vida dos veces y el bloqueo lo decide quien bloquea).
//     - El anfitrión es el árbitro: sincroniza el reloj, arranca rondas a una hora
//       común y decide K.O., tiempo y ganador.
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
import { buildFightStage, PLATFORMS, STAGE_HALF, FIGHT_Z } from "./fightStage.js";
import { JABS, AIR, specialFor, rollMulti, specialCooldown } from "./fightMoves.js";
import "../doodle.css";
import "./fight.css";

const STEP = 1 / 60;
const GRAV = 30;
const FW = 0.9; // ancho de la caja de golpeo del luchador
const FH = 1.95; // alto
const ROUND_TIME = 60;
const WINS_NEEDED = 2;
const STICKER_H = 2.3;
const SEND_HZ = 30;
const INTERP_MS = 90;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const charById = (id) => CHARS.find((c) => c.id === id) || CHARS[0];

const TEMPLATE = `
<canvas class="dd-canvas"></canvas>
<div class="cf-hud hidden">
  <div class="cf-top">
    <div class="cf-bar cf-p1">
      <div class="cf-who"><img alt=""><span></span></div>
      <div class="cf-hp"><i class="cf-hp-lag"></i><i class="cf-hp-fill"></i></div>
      <div class="cf-sub"><div class="cf-sp"><i></i></div><div class="cf-wins"><b></b><b></b></div></div>
    </div>
    <div class="cf-timer"><span>60</span><small>RONDA 1</small></div>
    <div class="cf-bar cf-p2">
      <div class="cf-who"><img alt=""><span></span></div>
      <div class="cf-hp"><i class="cf-hp-lag"></i><i class="cf-hp-fill"></i></div>
      <div class="cf-sub"><div class="cf-sp"><i></i></div><div class="cf-wins"><b></b><b></b></div></div>
    </div>
  </div>
  <div class="cf-ping"></div>
  <div class="cf-big"></div>
  <div class="cf-small"></div>
  <div class="cf-floats"></div>
  <div class="dd-hudbtns"><button class="dd-hb cf-pausebtn" aria-label="Pausa">❚❚</button></div>
</div>

<div class="dd-ov cf-lobby">
  <div class="dd-card cf-card">
    <div class="cf-col cf-pickcol">
      <div class="dd-kicker">MUNDO 2 · LUCHA 1v1</div>
      <h1 class="cf-title">Code Clash Arena</h1>
      <div class="cf-picker">
        <button class="cf-arrow" data-d="-1" aria-label="Anterior">◀</button>
        <div class="cf-preview"><img class="cf-sticker" alt=""><div class="cf-pname"></div><div class="cf-pspecial"></div></div>
        <button class="cf-arrow" data-d="1" aria-label="Siguiente">▶</button>
      </div>
    </div>
    <div class="cf-col cf-modecol">
      <button class="dd-btn cf-cpu">🤖 Contra la CPU</button>
      <div class="dd-mp cf-online">
        <div class="dd-mp-head">📱 <b>Online</b> <small>1 contra 1 con un compañero</small></div>
        <div class="dd-mp-row cf-lobbyrow">
          <button class="dd-btn dd-mini cf-create">Crear sala</button>
          <input class="dd-mp-code cf-code" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" spellcheck="false" />
          <button class="dd-btn dd-mini dd-ghost cf-join">Unirse</button>
        </div>
        <div class="cf-room hidden">
          <div class="dd-mp-coderow">Sala <b class="dd-mp-codebig cf-codebig"></b> <button class="dd-btn dd-mini dd-ghost cf-copy">Copiar</button> <span class="cf-lping"></span></div>
          <div class="cf-versus"><span class="cf-vs-me"></span><b>VS</b><span class="cf-vs-op">esperando rival…</span></div>
          <div class="dd-btns cf-roombtns">
            <button class="dd-btn dd-mini cf-go" disabled>¡A pelear!</button>
            <button class="dd-btn dd-mini dd-ghost cf-leave">Salir de la sala</button>
          </div>
        </div>
        <div class="dd-mp-status cf-status"></div>
      </div>
      <div class="cf-help dd-desktop-only">A/D mover · W saltar (doble salto) · S bloquear · J golpe · K especial · Esc pausa · 🎮 mando</div>
      <div class="cf-help dd-touch-only">Joystick: mover · arriba salta · abajo bloquea · botones: golpe, salto, especial, bloqueo</div>
      <button class="dd-btn dd-ghost dd-mini cf-exit">Volver al mapa</button>
    </div>
  </div>
</div>

<div class="dd-ov dd-pause cf-pause hidden">
  <div class="dd-card dd-small">
    <h2>Pausa</h2>
    <p class="cf-pause-note"></p>
    <div class="dd-btns">
      <button class="dd-btn cf-resume">Seguir</button>
      <button class="dd-btn dd-ghost cf-quit">Salir al menú</button>
    </div>
  </div>
</div>

<div class="dd-ov cf-end hidden">
  <div class="dd-card dd-small">
    <div class="dd-kicker cf-end-kicker"></div>
    <h2 class="cf-end-title"></h2>
    <div class="cf-end-score"></div>
    <div class="dd-btns">
      <button class="dd-btn cf-again">Revancha</button>
      <button class="dd-btn dd-ghost cf-tolobby">Cambiar luchador</button>
    </div>
  </div>
</div>`;

/**
 * @param {{charId?: string, onPickChar?: (id:string)=>void, onExit?: Function, onVictory?: (score:number, rank:string)=>void}} opts
 */
export function startDoodleFight({ charId, onPickChar, onExit, onVictory } = {}) {
  const root = document.createElement("div");
  root.id = "doodleRoot";
  root.className = "cf-root";
  root.innerHTML = TEMPLATE;
  (document.getElementById("wrap") || document.body).appendChild(root);
  document.body.classList.add("doodle-mode");
  const $ = (s) => root.querySelector(s);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  root.classList.toggle("dd-is-touch", isTouch);

  const canvas = $(".dd-canvas");
  const R = createDoodleRenderer(canvas);
  const audio = new DoodleAudio();
  const scene = new THREE.Scene();
  const overlay = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  scene.add(camera);
  const stage = buildFightStage(scene);

  // ── estado general ──
  let screen = "lobby"; // lobby | match | end
  let phase = "idle"; // intro | fight | ko | over
  let paused = false;
  let mode = "cpu"; // cpu | online
  let myChar = charId || CHARS[0].id;
  let meSide = 0;
  const F = [null, null]; // luchadores [izquierda, derecha]
  const M = { round: 1, wins: [0, 0], fightAt: 0, introAt: 0, koAt: 0, slow: 1, freeze: 0, hype: 0.2, events: [] };
  let projectiles = [];
  let atkSeq = 0;

  // ── reloj común (anfitrión) ──
  const clock = { offset: 0, samples: [], rtt: 0 };
  const hostNow = () => performance.now() + clock.offset;
  const schedule = (at, fn) => M.events.push({ at, fn });

  // ── red ──
  const net = createNet({ prefix: "clevergy-clash3d-", maxPlayers: 2 });
  const online = { on: false, opp: null, lastRx: 0, pingT: 0, sendT: 0 };
  const isAuthority = () => mode === "cpu" || net.isHost;
  // 1v1: el anfitrión envía a su único invitado; el invitado, al anfitrión
  const tx = (msg) => (net.isHost ? net.broadcast(msg) : net.send(msg));

  // ── sonido: golpes sintetizados ──
  const sfx = {
    whoosh: () => audio.noise({ dur: 0.09, gain: 0.18, filter: "bandpass", freq: 900, to: 2600, q: 0.8 }),
    hit: (heavy) => {
      audio.noise({ dur: heavy ? 0.22 : 0.12, gain: heavy ? 0.45 : 0.3, filter: "lowpass", freq: heavy ? 900 : 1600, to: 120 });
      audio.tone({ freq: heavy ? 110 : 170, to: 50, dur: heavy ? 0.25 : 0.14, type: "square", gain: heavy ? 0.22 : 0.14 });
    },
    block: () => { audio.tone({ freq: 1250, to: 900, dur: 0.08, type: "square", gain: 0.1 }); audio.noise({ dur: 0.06, gain: 0.15, filter: "highpass", freq: 3000 }); },
    parry: () => [0, 0.06].forEach((d, i) => audio.tone({ freq: 1500 + i * 500, dur: 0.1, type: "triangle", gain: 0.16, delay: d })),
    jump: () => audio.tone({ freq: 320, to: 620, dur: 0.1, type: "triangle", gain: 0.1 }),
    special: () => audio.noise({ dur: 0.3, gain: 0.3, filter: "bandpass", freq: 400, to: 2200, q: 1 }),
    beep: (hi) => audio.tone({ freq: hi ? 1320 : 660, dur: hi ? 0.35 : 0.12, type: "square", gain: 0.12 }),
    ko: () => { audio.bossRoar(); audio.noise({ dur: 0.6, gain: 0.4, filter: "lowpass", freq: 600, to: 60 }); },
    land: () => audio.noise({ dur: 0.05, gain: 0.08, filter: "lowpass", freq: 500 })
  };

  // ── luchadores ──
  function mkFighter(side, cid, ctrl) {
    const cfg = charById(cid);
    const f = {
      side, cid, cfg, ctrl, sp: specialFor(cid),
      x: side === 0 ? -3.4 : 3.4, y: 0, vx: 0, vy: 0, facing: side === 0 ? 1 : -1, g: true, prevY: 0,
      hp: 100, lagHp: 100, state: "idle", move: null, combo: 0, comboT: 0, airJ: 1, cd: 0, cdMax: specialCooldown(cfg),
      inv: 0, stun: 0, dropT: 0, flash: 0, squash: 1, pose: "idle", buf: [], prevIn: {},
      speed: 4.2 + (cfg.spd || 3.5) * 0.55, jumpV: 9.5 + ((cfg.jump || 9.5) - 9) * 0.9,
      sticker: createSticker(overlay, { height: STICKER_H }),
      shadow: new THREE.Mesh(GEO.disc, mat(INK.BLACK, { fill: true }))
    };
    f.sticker.setChar(cid);
    f.shadow.rotation.x = -Math.PI / 2;
    scene.add(f.shadow);
    return f;
  }
  function disposeFighter(f) {
    if (!f) return;
    f.sticker.dispose();
    scene.remove(f.shadow);
  }
  function resetFighter(f) {
    Object.assign(f, {
      x: f.side === 0 ? -3.4 : 3.4, y: 0, vx: 0, vy: 0, facing: f.side === 0 ? 1 : -1, g: true, hp: 100, lagHp: 100,
      state: "idle", move: null, combo: 0, comboT: 0, airJ: 1, cd: 0.8, inv: 0, stun: 0, dropT: 0, flash: 0, buf: []
    });
  }

  // caja de golpeo del movimiento → rectángulo en el mundo
  function hitRect(f, box) {
    const [fw, bottom, w, h] = box;
    const x0 = f.facing > 0 ? f.x + fw : f.x - fw - w;
    return { x0, x1: x0 + w, y0: f.y + bottom, y1: f.y + bottom + h };
  }
  const overlaps = (r, o) => r.x1 > o.x - FW / 2 && r.x0 < o.x + FW / 2 && r.y1 > o.y && r.y0 < o.y + FH;

  function startMove(f, def, special) {
    f.move = { def, special, t: 0, hit: false, id: ++atkSeq, phase: 0 };
    f.state = special ? "special" : "attack";
    if (special) {
      f.cd = f.cdMax;
      sfx.special();
      if (def.kind === "slam" && f.g) { f.vy = 11; f.g = false; }
      if (def.kind === "rise") { f.vy = def.vy; f.vx = f.facing * def.vx; f.g = false; }
    } else sfx.whoosh();
    if (f.ctrl !== "remote" && online.on) tx({ t: "mv", k: special ? def.kind : def.name });
  }

  // ── entrada local: teclado + mando físico + mando táctil / deck ──
  const keys = {};
  const tp = { punch: false, jump: false, special: false, block: false };
  const gp = { x: 0, jump: false, punch: false, special: false, block: false, active: false, prev: [] };
  const prevHeld = { jump: false, punch: false, special: false };
  function readLocal() {
    const joy = touchPad ? touchPad.joy : { x: 0, y: 0 };
    let x = gp.x + joy.x;
    if (keys.KeyA || keys.ArrowLeft || mando.L) x -= 1;
    if (keys.KeyD || keys.ArrowRight || mando.R) x += 1;
    const jumpHeld = !!(keys.KeyW || keys.ArrowUp || keys.Space || mando.Up || gp.jump || tp.jump || joy.y > 0.62);
    const block = !!(keys.KeyS || keys.ArrowDown || mando.Down || gp.block || tp.block || joy.y < -0.62);
    const punchHeld = !!(keys.KeyJ || keys.KeyZ || mando.A || gp.punch || tp.punch);
    const specHeld = !!(keys.KeyK || keys.KeyX || mando.B || gp.special || tp.special);
    const inp = {
      x: clamp(x, -1, 1), block,
      jump: jumpHeld && !prevHeld.jump, punch: punchHeld && !prevHeld.punch, special: specHeld && !prevHeld.special
    };
    prevHeld.jump = jumpHeld; prevHeld.punch = punchHeld; prevHeld.special = specHeld;
    return inp;
  }

  // ── IA de la CPU ──
  const ai = { t: 0, x: 0, block: 0, punch: false, special: false, jump: false };
  function cpuInput(f, o, dt) {
    ai.t -= dt;
    ai.block = Math.max(0, ai.block - dt);
    const inp = { x: ai.x, block: ai.block > 0, jump: false, punch: false, special: false };
    const dx = o.x - f.x, dist = Math.abs(dx), dy = o.y - f.y;
    // reacciona a los ataques del jugador bloqueando a veces
    if (o.move && !o.move.special && dist < 2.2 && ai.block <= 0 && Math.random() < 0.035) ai.block = rnd(0.25, 0.5);
    if (o.move && o.move.special && dist < 4 && ai.block <= 0 && Math.random() < 0.05) ai.block = 0.45;
    if (ai.t > 0) return inp;
    ai.t = rnd(0.09, 0.2);
    ai.x = 0;
    const sp = f.sp;
    const wantSpecial = f.cd <= 0 && Math.random() < 0.35 &&
      ((sp.kind === "proj" && dist > 3 && dist < 10) || (sp.kind !== "proj" && dist < 3.2));
    if (f.hp < 30 && dist < 1.8 && Math.random() < 0.3) ai.x = -Math.sign(dx); // retrocede con poca vida
    else if (dist > 1.25) ai.x = Math.sign(dx) * (dist > 5 ? 1 : 0.8);
    if (wantSpecial) inp.special = true;
    else if (dist < 1.5 && Math.abs(dy) < 1.2) inp.punch = Math.random() < 0.8;
    if ((dy > 1.2 && f.g && Math.random() < 0.5) || Math.random() < 0.03) inp.jump = true;
    return inp;
  }

  // ── simulación de un luchador controlado aquí (tú o la CPU) ──
  function updateFighter(f, inp, o, dt) {
    f.cd = Math.max(0, f.cd - dt);
    f.inv = Math.max(0, f.inv - dt);
    f.comboT -= dt;
    f.dropT -= dt;
    f.prevY = f.y;

    if (f.state === "ko" || phase !== "fight" || f.state === "win") {
      if (f.state !== "ko" && f.state !== "win") { f.state = "idle"; f.move = null; }
      f.vx *= f.g ? 0.8 : 0.99;
    } else if (f.stun > 0) {
      f.stun -= dt;
      f.state = "hurt";
      if (f.g) f.vx *= 0.86;
      if (f.stun <= 0) f.state = "idle";
    } else if (f.move) {
      updateMove(f, o, dt);
    } else {
      // de cara al rival siempre que no esté atacando
      f.facing = o.x >= f.x ? 1 : -1;
      if (inp.block && f.g) {
        f.state = "block";
        f.vx *= 0.7;
        if (inp.jump && f.y > 0.05) { f.dropT = 0.3; f.g = false; f.y -= 0.06; } // ▼ + salto: bajar de la mesa
      } else {
        const target = inp.x * f.speed;
        f.vx += (target - f.vx) * Math.min(1, dt * (f.g ? 16 : 6));
        f.state = !f.g ? "jump" : Math.abs(f.vx) > 0.4 ? "walk" : "idle";
        if (inp.jump) {
          if (f.g) { f.vy = f.jumpV; f.g = false; sfx.jump(); }
          else if (f.airJ > 0) { f.airJ--; f.vy = f.jumpV * 0.85; sfx.jump(); f.squash = 0.8; }
        }
        if (inp.punch) {
          if (f.g) {
            f.combo = f.comboT > 0 ? (f.combo + 1) % JABS.length : 0;
            startMove(f, JABS[f.combo], false);
          } else startMove(f, AIR, false);
        } else if (inp.special && f.cd <= 0) {
          startMove(f, f.sp.kind === "multi" ? rollMulti() : f.sp, true);
        }
      }
    }
    physics(f, dt);
  }

  function updateMove(f, o, dt) {
    const mv = f.move, d = mv.def;
    mv.t += dt;
    if (!mv.special) {
      if (f.g) f.vx *= 0.7;
      const start = d.start, end = d.start + d.active;
      if (!mv.hit && mv.t >= start && mv.t <= end && overlaps(hitRect(f, d.box), o)) {
        mv.hit = true;
        dealHit(f, o, { dmg: d.dmg, kx: f.facing * d.kb[0], ky: d.kb[1], stun: d.stun, heavy: d.heavy });
      }
      if (mv.t >= end + d.rec) { f.move = null; f.state = "idle"; f.comboT = 0.35; }
      return;
    }
    // especiales
    switch (d.kind) {
      case "dash": {
        if (mv.t > 0.06 && mv.t < 0.06 + d.time) {
          f.vx = f.facing * d.speed;
          if (f.g === false) f.vy = Math.max(f.vy, -2);
          const box = d.low ? [-0.3, 0, 1.3, 0.8] : [-0.2, 0.3, 1.2, 1.4];
          if (!mv.hit && overlaps(hitRect(f, box), o)) {
            mv.hit = true;
            dealHit(f, o, { dmg: d.dmg, kx: f.facing * 8, ky: d.low ? 7 : 4, stun: 0.55, heavy: true });
          }
          if (Math.random() < 0.5) spawnInk(f.x - f.facing * 0.5, f.y + rnd(0.2, 1.4), d.ink, 1, 1.5);
        } else f.vx *= 0.8;
        if (mv.t > 0.06 + d.time + 0.22) endMove(f);
        break;
      }
      case "proj": {
        if (mv.t >= 0.1 && !mv.fired) { mv.fired = true; fireProjectile(f, d); }
        if (f.g) f.vx *= 0.7;
        if (mv.t > 0.36) endMove(f);
        break;
      }
      case "rise": {
        if (!mv.hit && mv.t < 0.45 && overlaps(hitRect(f, [-0.3, 0.2, 1.2, 2.2]), o)) {
          mv.hit = true;
          dealHit(f, o, { dmg: d.dmg, kx: f.facing * 3.5, ky: 12, stun: 0.6, heavy: true });
        }
        if ((mv.t > 0.25 && f.g) || mv.t > 1.2) endMove(f);
        break;
      }
      case "slam": {
        if (mv.phase === 0 && (f.vy < 2 || mv.t > 0.35)) { mv.phase = 1; f.vy = -24; f.vx = f.facing * 2; }
        if (mv.phase === 1 && f.g) {
          mv.phase = 2;
          shockwave(f.x, f.y, d.ink);
          const dist = Math.abs(o.x - f.x);
          if (dist < d.radius && o.y < f.y + 1.2) dealHit(f, o, { dmg: d.dmg, kx: Math.sign(o.x - f.x || f.facing) * 7, ky: 8, stun: 0.6, heavy: true });
          M.shake = Math.max(M.shake || 0, 0.9);
        }
        if (mv.phase === 2) { f.vx *= 0.7; mv.after = (mv.after || 0) + dt; if (mv.after > 0.25) endMove(f); }
        if (mv.t > 2) endMove(f);
        break;
      }
      case "shield": {
        f.vx *= 0.6;
        f.state = "shield";
        if (mv.t > d.time + 0.15) endMove(f);
        break;
      }
      default: endMove(f);
    }
  }
  function endMove(f) { f.move = null; f.state = f.g ? "idle" : "jump"; }

  function physics(f, dt) {
    f.vy -= GRAV * dt;
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    const wasG = f.g;
    f.g = false;
    if (f.y <= 0) { f.y = 0; f.vy = 0; f.g = true; }
    else if (f.vy <= 0 && f.dropT <= 0) {
      for (const p of PLATFORMS) {
        if (f.x > p.x0 - 0.25 && f.x < p.x1 + 0.25 && f.prevY >= p.y - 0.02 && f.y <= p.y) { f.y = p.y; f.vy = 0; f.g = true; break; }
      }
    }
    if (f.g) {
      f.airJ = 1;
      if (!wasG) { f.squash = 0.78; sfx.land(); }
    }
    f.x = clamp(f.x, -STAGE_HALF, STAGE_HALF);
    f.squash += (1 - f.squash) * Math.min(1, dt * 10);
  }

  // los dos luchadores no se atraviesan
  function separate(a, b) {
    const dx = b.x - a.x;
    if (Math.abs(dx) < 0.75 && Math.abs(a.y - b.y) < 1.4) {
      const push = (0.75 - Math.abs(dx)) / 2 * (dx >= 0 ? 1 : -1);
      if (a.ctrl !== "remote") a.x -= push;
      if (b.ctrl !== "remote") b.x += push;
    }
  }

  // ── golpes ──
  // quien golpea lo detecta; si la víctima está en otro móvil se le avisa y ella decide
  function dealHit(att, vic, h) {
    const px = (att.x + vic.x) / 2, py = vic.y + FH * 0.6;
    if (vic.ctrl === "remote") {
      tx({ t: "hit", id: att.move ? att.move.id : ++atkSeq, d: h.dmg, kx: +h.kx.toFixed(2), ky: +h.ky.toFixed(2), s: h.stun, hv: h.heavy ? 1 : 0, fx: +att.x.toFixed(2) });
      // efecto inmediato en quien golpea (la vida la confirma el rival en su estado)
      impactFx(px, py, att.sp.ink, h.heavy, h.dmg, vic);
      return;
    }
    const res = receiveHit(vic, h, att.x);
    if (res === "parry") counterHit(vic, att);
  }

  function receiveHit(v, h, fromX) {
    if (v.inv > 0 || v.state === "ko" || phase !== "fight") return "miss";
    const px = (fromX + v.x) / 2, py = v.y + FH * 0.6;
    const facingAtt = Math.sign(fromX - v.x || v.facing) === v.facing;
    if (v.move && v.move.special && v.move.def.kind === "shield" && v.move.t < v.move.def.time) {
      sfx.parry();
      burst(px, py, INK.BLUE, 12);
      floatText(v, "¡PARADA!", "blue");
      M.freeze = 0.12;
      return "parry";
    }
    if (v.state === "block" && facingAtt) {
      const chip = Math.max(1, Math.round(h.dmg * 0.18));
      v.hp = Math.max(1, v.hp - chip);
      v.vx = -v.facing * 3;
      sfx.block();
      burst(px, py, INK.BLUE, 5);
      floatText(v, `-${chip}`, "blue");
      M.freeze = 0.04;
      return "block";
    }
    v.hp = Math.max(0, v.hp - h.dmg);
    v.move = null;
    v.stun = h.stun;
    v.vx = h.kx;
    if (h.ky > 0) { v.vy = h.ky; v.g = false; }
    v.state = "hurt";
    v.flash = 0.18;
    impactFx(px, py, INK.RED, h.heavy, h.dmg, v);
    if (v.hp <= 0) {
      v.state = "ko";
      v.stun = 0;
      v.vx = Math.sign(h.kx || -v.facing) * 7;
      v.vy = 9;
      v.g = false;
      v.inv = 99;
    }
    return "hit";
  }

  // contraataque del escudo (Beltrán)
  function counterHit(def, att) {
    const h = { dmg: def.sp.dmg || 12, kx: def.facing * 7, ky: 6, stun: 0.6, heavy: true };
    if (att.ctrl === "remote") tx({ t: "hit", id: ++atkSeq, d: h.dmg, kx: h.kx, ky: h.ky, s: h.stun, hv: 1, fx: def.x });
    else receiveHit(att, h, def.x);
  }

  // ── proyectiles ──
  function projMesh(shape, ink) {
    const g = new THREE.Group();
    const add = (geo, o, s, p) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...s); if (p) m.position.set(...p); g.add(m); return m; };
    if (shape === "calc") { add(GEO.box, { tone: 0.05 }, [0.45, 0.6, 0.12]); add(GEO.box, { fill: true }, [0.36, 0.14, 0.13], [0, 0.18, 0]); }
    else if (shape === "wave" || shape === "micro") { const r = add(GEO.torus, { fill: true }, [0.7, 0.7, 0.7]); r.rotation.y = Math.PI / 2; add(GEO.torus, { tone: 0.1 }, [0.45, 0.45, 0.45]).rotation.y = Math.PI / 2; }
    else if (shape === "broccoli") { add(GEO.sph, { tone: -0.05 }, [0.5, 0.5, 0.5], [0, 0.15, 0]); add(GEO.cyl, { tone: 0.2 }, [0.18, 0.35, 0.18], [0, -0.15, 0]); }
    else if (shape === "worker") { add(GEO.box, { tone: 0 }, [0.35, 0.55, 0.3], [0, 0.35, 0]); add(GEO.sph, { tone: 0.2 }, [0.3, 0.3, 0.3], [0, 0.8, 0]); add(GEO.box, { fill: true }, [0.05, 0.55, 0.05], [0.2, 0.9, 0]); }
    else add(GEO.box, { tone: 0.05 }, [0.5, 0.5, 0.5]);
    scene.add(g);
    return g;
  }
  function fireProjectile(f, d, net_) {
    const p = net_ || {
      id: `${f.side}-${++atkSeq}`, owner: f.side, shape: d.shape, ink: d.ink, dmg: d.dmg, arc: !!d.arc, ground: !!d.ground,
      x: f.x + f.facing * 0.7, y: d.ground ? 0 : f.y + 1.1, vx: f.facing * d.speed, vy: d.arc ? d.vy : 0, life: d.life
    };
    p.mesh = projMesh(p.shape, p.ink);
    p.t = 0;
    projectiles.push(p);
    if (!net_ && online.on) tx({ t: "proj", p: { id: p.id, owner: p.owner, shape: p.shape, ink: p.ink, dmg: p.dmg, arc: p.arc, ground: p.ground, x: p.x, y: p.y, vx: p.vx, vy: p.vy, life: p.life } });
  }
  function updateProjectiles(dt) {
    for (const p of projectiles) {
      p.t += dt;
      p.life -= dt;
      if (p.arc) {
        p.vy -= 18 * dt;
        if (p.y <= 0.25 && p.vy < 0) { p.y = 0.25; p.vy = -p.vy * 0.62; spawnInk(p.x, 0.1, p.ink, 2, 2); }
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.mesh.position.set(p.x, p.y + (p.ground ? Math.abs(Math.sin(p.t * 14)) * 0.12 : 0), FIGHT_Z);
      p.mesh.rotation.z += dt * (p.arc ? -8 * Math.sign(p.vx) : 0);
      if (p.shape === "wave" || p.shape === "micro") p.mesh.scale.setScalar(1 + p.t * 1.6);
      if (p.shape === "worker") p.mesh.scale.x = Math.sign(p.vx) || 1;
      // sólo quien lo lanzó decide si impacta
      const owner = F[p.owner], vic = F[1 - p.owner];
      if (owner && vic && owner.ctrl !== "remote" && p.life > 0) {
        const r = { x0: p.x - 0.35, x1: p.x + 0.35, y0: p.y - 0.3, y1: p.y + 0.5 };
        if (overlaps(r, vic)) {
          p.life = 0;
          const h = { dmg: p.dmg, kx: Math.sign(p.vx) * 5.5, ky: 3.5, stun: 0.45, heavy: true };
          if (vic.ctrl === "remote") {
            tx({ t: "hit", id: ++atkSeq, d: h.dmg, kx: h.kx, ky: h.ky, s: h.stun, hv: 1, fx: p.x - Math.sign(p.vx) });
            impactFx(p.x, p.y, p.ink, true, h.dmg, vic);
          } else {
            const res = receiveHit(vic, h, p.x - Math.sign(p.vx));
            if (res === "parry") p.vx = -p.vx, p.owner = 1 - p.owner, p.life = 1; // el escudo la devuelve
          }
          if (online.on && p.life <= 0) tx({ t: "pgone", id: p.id });
        }
      }
      if (Math.abs(p.x) > STAGE_HALF + 2) p.life = 0;
      if (p.life <= 0) { scene.remove(p.mesh); burst(p.x, p.y, p.ink, 6); }
    }
    projectiles = projectiles.filter((p) => p.life > 0);
  }

  // ── efectos: tinta, chispas, onda, textos flotantes ──
  const particles = [];
  const decals = [];
  function spawnInk(x, y, ink, n, speed = 5) {
    for (let i = 0; i < n; i++) {
      let p = particles.find((q) => !q.alive);
      if (!p) {
        if (particles.length > 180) break;
        p = { mesh: new THREE.Mesh(GEO.sph, mat(ink, { fill: true })), vel: new THREE.Vector3() };
        scene.add(p.mesh);
        particles.push(p);
      }
      p.alive = true; p.ink = ink;
      p.mesh.material = mat(ink, { fill: true });
      p.mesh.visible = true;
      p.mesh.position.set(x, y, FIGHT_Z + rnd(-0.3, 0.3));
      p.mesh.scale.setScalar(rnd(0.06, 0.15));
      p.vel.set(rnd(-1, 1), rnd(0.3, 1.4), rnd(-0.4, 0.4)).multiplyScalar(speed * rnd(0.5, 1));
      p.life = rnd(0.5, 1.2);
    }
  }
  function spawnDecal(x, ink, size) {
    const d = decals.length >= 40 ? decals.shift() : (() => { const m = new THREE.Mesh(GEO.disc, mat(ink, { fill: true })); m.rotation.x = -Math.PI / 2; scene.add(m); return m; })();
    d.material = mat(ink, { fill: true });
    d.position.set(x, 0.025 + decals.length * 0.0005, FIGHT_Z + rnd(-0.8, 0.8));
    d.scale.set(size * rnd(0.7, 1.3), size * rnd(0.6, 1.1), 1);
    d.rotation.z = rnd(0, Math.PI);
    decals.push(d);
  }
  // estrella de impacto: rayos de tinta que se abren
  const sparks = [];
  function spark(x, y, ink, big) {
    const g = new THREE.Group();
    const n = big ? 9 : 6;
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(GEO.box, mat(i % 2 ? INK.ORANGE : ink, { fill: true }));
      m.scale.set(0.07, big ? 0.9 : 0.6, 0.02);
      m.position.y = big ? 0.55 : 0.4;
      const piv = new THREE.Group();
      piv.rotation.z = (i / n) * Math.PI * 2 + rnd(-0.2, 0.2);
      piv.add(m);
      g.add(piv);
    }
    g.position.set(x, y, FIGHT_Z + 0.6);
    scene.add(g);
    sparks.push({ g, t: 0, life: big ? 0.22 : 0.15 });
  }
  function burst(x, y, ink, n) { spawnInk(x, y, ink, n, 5); spark(x, y, ink, false); }
  function shockwave(x, y, ink) {
    const ring = new THREE.Mesh(GEO.torus, mat(ink, { fill: true }));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(x, y + 0.05, FIGHT_Z);
    scene.add(ring);
    sparks.push({ g: ring, t: 0, life: 0.35, ring: true });
    spawnInk(x, y + 0.2, ink, 16, 7);
    spawnDecal(x, ink, 2.2);
  }
  function impactFx(x, y, ink, heavy, dmg, vic) {
    sfx.hit(heavy);
    spark(x, y, ink, heavy);
    spawnInk(x, y, ink, heavy ? 14 : 7, heavy ? 7 : 4.5);
    if (heavy) spawnDecal(x, ink, 1.2);
    M.freeze = Math.max(M.freeze, heavy ? 0.1 : 0.055);
    M.shake = Math.max(M.shake || 0, heavy ? 0.7 : 0.3);
    M.hype = Math.min(1, M.hype + (heavy ? 0.3 : 0.12));
    if (vic) floatText(vic, `-${dmg}`, heavy ? "red" : "ink");
  }
  const floatsEl = $(".cf-floats");
  const floats = [];
  function floatText(f, txt, color) {
    const el = document.createElement("div");
    el.className = `cf-float ${color || ""}`;
    el.textContent = txt;
    floatsEl.appendChild(el);
    floats.push({ el, x: f.x + rnd(-0.3, 0.3), y: f.y + FH + 0.2, t: 0 });
  }
  function updateFx(dt) {
    for (const p of particles) {
      if (!p.alive) continue;
      p.life -= dt;
      p.vel.y -= 16 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.mesh.position.y <= 0.02) {
        if (Math.random() < 0.3) spawnDecal(p.mesh.position.x, p.ink, p.mesh.scale.x * 5);
        p.life = 0;
      }
      if (p.life <= 0) { p.alive = false; p.mesh.visible = false; }
    }
    for (const s of sparks) {
      s.t += dt;
      const k = s.t / s.life;
      if (s.ring) s.g.scale.setScalar(0.5 + k * 6);
      else s.g.scale.setScalar(0.4 + k * 1.2);
      if (s.t >= s.life) scene.remove(s.g);
    }
    for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].t >= sparks[i].life) sparks.splice(i, 1);
    const W = root.clientWidth, H = root.clientHeight;
    for (const fl of floats) {
      fl.t += dt;
      fl.y += dt * 1.4;
      _v.set(fl.x, fl.y, FIGHT_Z).project(camera);
      fl.el.style.transform = `translate(${((_v.x * 0.5 + 0.5) * W).toFixed(1)}px, ${((-_v.y * 0.5 + 0.5) * H).toFixed(1)}px) translate(-50%, -50%) scale(${1 + Math.max(0, 0.25 - fl.t) * 2})`;
      fl.el.style.opacity = String(Math.max(0, 1 - Math.max(0, fl.t - 0.5) / 0.4));
      if (fl.t > 0.9) fl.el.remove();
    }
    for (let i = floats.length - 1; i >= 0; i--) if (floats[i].t > 0.9) floats.splice(i, 1);
  }
  const _v = new THREE.Vector3();

  // ── rival online: interpolado a partir de sus estados ──
  function updateRemote(f) {
    const buf = f.buf;
    if (!buf.length) return;
    const rt = hostNow() - INTERP_MS;
    while (buf.length > 2 && buf[1].ts <= rt) buf.shift();
    let s;
    if (buf.length >= 2 && buf[0].ts <= rt && buf[1].ts >= rt) {
      const a = buf[0], b = buf[1], k = (rt - a.ts) / Math.max(1, b.ts - a.ts);
      s = { ...b, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    } else {
      const last = buf[buf.length - 1];
      const ahead = clamp((rt - last.ts) / 1000, 0, 0.15); // extrapola un poco si llega tarde
      s = { ...last, x: last.x + last.vx * ahead, y: Math.max(0, last.y + last.vy * ahead) };
    }
    f.prevY = f.y;
    f.x = s.x; f.y = s.y; f.vx = s.vx; f.vy = s.vy; f.facing = s.f; f.g = !!s.g;
    if (s.hp < f.hp) f.flash = 0.15;
    f.hp = s.hp; f.cd = s.cd * f.cdMax; f.state = s.s; f.pose = s.p;
  }

  // ── pose de pegatina según el estado ──
  function poseFor(f) {
    const s = f.sticker;
    if (f.state === "ko") return s.hasPose("death") ? "death" : "damage";
    if (f.state === "hurt") return "damage";
    if (f.state === "block" || f.state === "shield") return s.hasPose("block") ? "block" : s.hasPose("shield") ? "shield" : "idle";
    if (f.state === "attack" || f.state === "special") return "attack";
    if (f.state === "win") return s.hasPose("victory") ? "victory" : "attack";
    if (!f.g) return "jump";
    if (Math.abs(f.vx) > 5.5) return "run";
    if (Math.abs(f.vx) > 0.4) return "walk";
    return "idle";
  }
  function drawFighter(f, dt) {
    const pose = f.ctrl === "remote" ? f.pose || "idle" : poseFor(f);
    f.pose = pose;
    f.flash -= dt;
    const tilt = f.state === "ko" ? -f.facing * Math.min(1.3, (performance.now() - M.koAt) / 400) : f.state === "hurt" ? -f.facing * 0.15 : f.state === "block" ? f.facing * -0.05 : 0;
    const squash = f.state === "block" ? 0.93 : f.squash;
    f.sticker.update(dt, {
      pos: _p.set(f.x, f.y, FIGHT_Z), camera, moveX: 0, facing: f.facing, speed: Math.abs(f.vx) * (f.g ? 1 : 0), onGround: f.g,
      firing: false, pose, hurt: f.flash > 0 ? 1 : 0, tilt, squash
    });
    // la pegatina mira siempre al frente (vista lateral)
    f.sticker.pivot.rotation.y = 0;
    const lift = clamp(1 - f.y / 4, 0.3, 1);
    let gy = 0;
    for (const p of PLATFORMS) if (f.x > p.x0 && f.x < p.x1 && f.y >= p.y - 0.01) gy = Math.max(gy, p.y);
    f.shadow.position.set(f.x, gy + 0.03, FIGHT_Z);
    f.shadow.scale.set(1.2 * lift, 0.5 * lift, 1);
  }
  const _p = new THREE.Vector3();

  // ── cámara: encuadra a los dos luchadores ──
  const camPos = new THREE.Vector3(0, 3, 14), camLook = new THREE.Vector3(0, 1.4, 0);
  function updateCamera(dt) {
    let midX = 0, sep = 6, topY = 0;
    if (F[0] && F[1]) {
      midX = (F[0].x + F[1].x) / 2;
      sep = Math.abs(F[0].x - F[1].x);
      topY = Math.max(F[0].y, F[1].y);
    }
    const vf = THREE.MathUtils.degToRad(camera.fov);
    const hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    const needHalf = sep / 2 + 2.4;
    let dist = needHalf / Math.tan(hf / 2);
    dist = Math.max(dist, (topY + 3.4) / Math.tan(vf / 2) * 0.62);
    dist = clamp(dist, 10.5, 30);
    if (phase === "ko") dist *= 0.82;
    const lx = clamp(midX, -5.5, 5.5), ly = 1.75 + topY * 0.5;
    camLook.lerp(_p.set(lx, ly, FIGHT_Z), Math.min(1, dt * 5));
    camPos.lerp(_p.set(lx * 0.9, ly + 1.4 + dist * 0.09, FIGHT_Z + dist), Math.min(1, dt * 4));
    const sh = (M.shake || 0) ** 2 * 0.35;
    M.shake = Math.max(0, (M.shake || 0) - dt * 2.8);
    camera.position.set(camPos.x + rnd(-sh, sh), camPos.y + rnd(-sh, sh), camPos.z);
    camera.lookAt(camLook);
  }

  // ── HUD ──
  const hud = [0, 1].map((i) => {
    const b = $(`.cf-p${i + 1}`);
    return { img: b.querySelector(".cf-who img"), name: b.querySelector(".cf-who span"), fill: b.querySelector(".cf-hp-fill"), lag: b.querySelector(".cf-hp-lag"), sp: b.querySelector(".cf-sp i"), wins: b.querySelectorAll(".cf-wins b"), bar: b };
  });
  const bigEl = $(".cf-big"), smallEl = $(".cf-small"), timerEl = $(".cf-timer span"), roundEl = $(".cf-timer small"), pingEl = $(".cf-ping");
  let bigT = 0;
  function big(txt, sub, dur, cls) {
    bigEl.textContent = txt;
    smallEl.textContent = sub || "";
    bigEl.className = `cf-big show ${cls || ""}`;
    void bigEl.offsetWidth;
    bigEl.classList.add("pop");
    bigT = dur;
  }
  function setupHud() {
    for (let i = 0; i < 2; i++) {
      const f = F[i];
      const av = getCharacterAvatar(f.cid);
      if (av) hud[i].img.src = av;
      const tag = mode === "online" ? (i === meSide ? " (tú)" : "") : i === 1 ? " (CPU)" : " (tú)";
      hud[i].name.textContent = `${f.cfg.name}${tag}`;
      hud[i].bar.classList.toggle("me", i === meSide);
    }
  }
  function updateHud(dt) {
    for (let i = 0; i < 2; i++) {
      const f = F[i];
      if (!f) continue;
      f.lagHp += (f.hp - f.lagHp) * Math.min(1, dt * (f.lagHp > f.hp ? 2.2 : 10));
      hud[i].fill.style.width = `${f.hp}%`;
      hud[i].lag.style.width = `${f.lagHp}%`;
      hud[i].fill.classList.toggle("low", f.hp <= 30);
      hud[i].sp.style.width = `${(1 - f.cd / f.cdMax) * 100}%`;
      hud[i].sp.parentElement.classList.toggle("ready", f.cd <= 0);
      hud[i].wins.forEach((w, k) => w.classList.toggle("on", M.wins[i] > k));
    }
    let tleft = ROUND_TIME;
    if (phase === "fight") tleft = Math.max(0, ROUND_TIME - (hostNow() - M.fightAt) / 1000);
    else if (phase === "ko" || phase === "over") tleft = M.frozenTime ?? ROUND_TIME;
    timerEl.textContent = String(Math.ceil(tleft));
    timerEl.parentElement.classList.toggle("low", phase === "fight" && tleft < 10);
    roundEl.textContent = `RONDA ${M.round}`;
    pingEl.textContent = online.on && screen === "match" ? `📶 ${Math.round(clock.rtt)} ms` : "";
    bigT -= dt;
    if (bigT <= 0) bigEl.classList.remove("show");
    smallEl.style.opacity = bigT > 0 ? "1" : "0";
  }

  // ── rondas (el árbitro es la CPU local o el anfitrión) ──
  function beginMatch(p1, p2, at) {
    [0, 1].forEach((i) => disposeFighter(F[i]));
    projectiles.forEach((p) => scene.remove(p.mesh));
    projectiles = [];
    const ctrl = (side) => (mode === "cpu" ? (side === 0 ? "local" : "cpu") : side === meSide ? "local" : "remote");
    F[0] = mkFighter(0, p1, ctrl(0));
    F[1] = mkFighter(1, p2, ctrl(1));
    M.wins = [0, 0];
    M.events = [];
    screen = "match";
    paused = false;
    showOv(null);
    $(".cf-hud").classList.remove("hidden");
    setupHud();
    audio.init();
    audio.startMusic();
    beginRound(1, at);
    syncPad();
  }
  function beginRound(n, at) {
    M.round = n;
    M.introAt = at;
    M.fightAt = at + 1900;
    M.frozenTime = null;
    M.slow = 1;
    phase = "intro";
    F.forEach(resetFighter);
    projectiles.forEach((p) => scene.remove(p.mesh));
    projectiles = [];
    schedule(at, () => { big(`RONDA ${n}`, n === 3 ? "¡Ronda decisiva!" : "", 1.2); sfx.beep(false); });
    schedule(at + 1200, () => { big("¡A PELEAR!", "", 0.8, "go"); sfx.beep(true); });
    schedule(at + 1900, () => { phase = "fight"; });
  }
  // el árbitro comprueba K.O. y tiempo
  function referee() {
    if (!isAuthority() || phase !== "fight" || !F[0] || !F[1]) return;
    const t = (hostNow() - M.fightAt) / 1000;
    const ko0 = F[0].hp <= 0, ko1 = F[1].hp <= 0;
    if (!ko0 && !ko1 && t < ROUND_TIME) return;
    let w = -1;
    if (ko0 && !ko1) w = 1;
    else if (ko1 && !ko0) w = 0;
    else if (!ko0 && !ko1) w = F[0].hp > F[1].hp ? 0 : F[1].hp > F[0].hp ? 1 : -1;
    const wins = M.wins.slice();
    if (w >= 0) wins[w]++;
    const byTime = !ko0 && !ko1;
    const matchOver = wins[0] >= WINS_NEEDED || wins[1] >= WINS_NEEDED;
    const next = hostNow() + 3000;
    const msg = { t: "rend", w, wins, byTime: byTime ? 1 : 0, over: matchOver ? 1 : 0, next };
    if (online.on) tx(msg);
    roundEnded(msg);
  }
  function roundEnded(m) {
    if (phase === "ko" || phase === "over") return;
    M.frozenTime = Math.max(0, ROUND_TIME - (hostNow() - M.fightAt) / 1000);
    phase = "ko";
    M.wins = m.wins;
    M.koAt = performance.now();
    M.slow = 0.35;
    M.hype = 1;
    if (m.byTime) big("¡TIEMPO!", m.w < 0 ? "Empate" : `Gana la ronda ${F[m.w].cfg.name}`, 2.4);
    else { big("K.O.", m.w >= 0 ? `Gana la ronda ${F[m.w].cfg.name}` : "Doble K.O.", 2.4, "ko"); sfx.ko(); }
    if (m.w >= 0 && F[m.w].ctrl !== "remote") { F[m.w].state = "win"; F[m.w].move = null; }
    setTimeout(() => (M.slow = 1), 1100);
    if (m.over) schedule(m.next - 600, () => matchEnded(m.wins[0] > m.wins[1] ? 0 : 1));
    else if (isAuthority()) {
      schedule(m.next, () => {
        const at = hostNow() + 150;
        if (online.on) tx({ t: "round", n: M.round + 1, at });
        beginRound(M.round + 1, at);
      });
    }
  }
  function matchEnded(w) {
    phase = "over";
    screen = "end";
    const iWon = w === meSide;
    iWon ? audio.victory() : audio.lose();
    $(".cf-end-kicker").textContent = mode === "cpu" ? "CONTRA LA CPU" : "ONLINE";
    $(".cf-end-title").textContent = iWon ? "¡Has ganado el Sprint!" : `Gana ${F[w].cfg.name}`;
    $(".cf-end-score").innerHTML = `
      <div class="cf-final"><span>${F[0].cfg.emoji} ${F[0].cfg.name}</span><b>${M.wins[0]} – ${M.wins[1]}</b><span>${F[1].cfg.name} ${F[1].cfg.emoji}</span></div>`;
    const again = $(".cf-again");
    again.disabled = mode === "online" && !net.isHost;
    again.textContent = again.disabled ? "Esperando al anfitrión…" : "Revancha";
    showOv("end");
    syncPad();
    if (mode === "cpu" && iWon && onVictory) {
      const lost = M.wins[1];
      try { onVictory(lost === 0 ? 3000 : 2000, lost === 0 ? "S" : "A"); } catch (e) {}
    }
  }

  // ── bucle de simulación ──
  function stepSim(dt) {
    // eventos programados a hora del anfitrión (rondas sincronizadas)
    const now = hostNow();
    if (M.events.length) {
      const due = M.events.filter((e) => e.at <= now);
      if (due.length) { M.events = M.events.filter((e) => e.at > now); due.forEach((e) => e.fn()); }
    }
    if (screen !== "match" && screen !== "end") return;
    if (M.freeze > 0) { M.freeze -= dt; return; } // pausa de impacto
    const sdt = dt * M.slow;
    const [a, b] = F;
    if (!a || !b) return;
    const local = paused && mode === "cpu" ? null : readLocalGated();
    for (const f of F) {
      const o = F[1 - f.side];
      if (f.ctrl === "local") updateFighter(f, local || NO_INPUT, o, sdt);
      else if (f.ctrl === "cpu") updateFighter(f, cpuInput(f, o, sdt), o, sdt);
      else updateRemote(f);
    }
    separate(a, b);
    updateProjectiles(sdt);
    referee();
    M.hype = Math.max(0.2, M.hype - dt * 0.25);
  }
  const NO_INPUT = { x: 0, block: false, jump: false, punch: false, special: false };
  const readLocalGated = () => {
    const inp = readLocal();
    return paused ? NO_INPUT : inp;
  };

  function netTick(dt) {
    if (!online.on) return;
    const now = performance.now();
    online.pingT -= dt;
    if (online.pingT <= 0) { online.pingT = 0.7; tx({ t: "ping", c: now }); }
    if (screen !== "match" && screen !== "end") return;
    online.sendT -= dt;
    const me = F[meSide];
    if (me && online.sendT <= 0) {
      online.sendT = 1 / SEND_HZ;
      tx({
        t: "st", ts: Math.round(hostNow()), x: +me.x.toFixed(3), y: +me.y.toFixed(3), vx: +me.vx.toFixed(2), vy: +me.vy.toFixed(2),
        f: me.facing, g: me.g ? 1 : 0, hp: me.hp, cd: +(me.cd / me.cdMax).toFixed(2), s: me.state, p: me.pose
      });
    }
    // sin noticias del rival en 6 s → desconectado
    if (screen === "match" && online.lastRx && now - online.lastRx > 6000) opponentLeft("Se ha perdido la conexión con tu rival.");
  }

  // ── mensajes de red ──
  const lobby = {
    status: $(".cf-status"), room: $(".cf-room"), row: $(".cf-lobbyrow"), code: $(".cf-code"), codeBig: $(".cf-codebig"),
    me: $(".cf-vs-me"), op: $(".cf-vs-op"), go: $(".cf-go"), lping: $(".cf-lping")
  };
  const setStatus = (t, err) => { lobby.status.textContent = t; lobby.status.classList.toggle("err", !!err); };
  function renderRoom() {
    lobby.room.classList.toggle("hidden", !online.on);
    lobby.row.classList.toggle("hidden", online.on);
    $(".cf-cpu").disabled = online.on;
    lobby.codeBig.textContent = net.code || "";
    const mc = charById(myChar);
    lobby.me.textContent = `${mc.emoji} ${mc.name}`;
    lobby.op.textContent = online.opp ? `${charById(online.opp.c).emoji} ${charById(online.opp.c).name}` : "esperando rival…";
    lobby.go.disabled = !(online.on && net.isHost && online.opp);
    lobby.go.textContent = net.isHost ? "¡A pelear!" : "Esperando al anfitrión…";
    lobby.lping.textContent = online.on && online.opp ? `📶 ${Math.round(clock.rtt)} ms` : "";
  }
  net.on("ping", (m, from) => { online.lastRx = performance.now(); tx({ t: "pong", c: m.c, h: performance.now() }); });
  net.on("pong", (m) => {
    online.lastRx = performance.now();
    const now = performance.now();
    const rtt = now - m.c;
    clock.rtt = clock.rtt ? clock.rtt * 0.7 + rtt * 0.3 : rtt;
    if (!net.isHost) {
      // sincronización de reloj: nos quedamos con la muestra de menor latencia
      clock.samples.push({ rtt, off: m.h + rtt / 2 - now });
      if (clock.samples.length > 10) clock.samples.shift();
      const best = clock.samples.reduce((a, b) => (b.rtt < a.rtt ? b : a));
      clock.offset = best.off;
    }
    if (screen === "lobby") renderRoom();
  });
  net.on("hello", (m) => {
    online.lastRx = performance.now();
    const first = !online.opp;
    online.opp = { c: m.c };
    if (net.isHost && first) tx({ t: "hello", c: myChar });
    if (first) { audio.init(); audio.pickup(); setStatus(net.isHost ? "¡Rival conectado! Pulsa «¡A pelear!»" : "¡Conectado! Espera a que el anfitrión empiece."); }
    renderRoom();
  });
  net.on("pick", (m) => { if (online.opp) online.opp.c = m.c; renderRoom(); });
  net.on("match", (m) => { if (!net.isHost) beginMatch(m.p1, m.p2, m.at); });
  net.on("round", (m) => { if (!net.isHost) beginRound(m.n, m.at); });
  net.on("rend", (m) => { if (!net.isHost) roundEnded(m); });
  net.on("st", (m) => {
    online.lastRx = performance.now();
    const f = F[1 - meSide];
    if (!f || f.ctrl !== "remote") return;
    f.buf.push(m);
    if (f.buf.length > 30) f.buf.shift();
  });
  net.on("mv", () => { const f = F[1 - meSide]; if (f && f.ctrl === "remote") sfx.whoosh(); });
  net.on("hit", (m) => {
    const me = F[meSide];
    if (!me || screen !== "match") return;
    const res = receiveHit(me, { dmg: m.d, kx: m.kx, ky: m.ky, stun: m.s, heavy: !!m.hv }, m.fx);
    if (res === "parry") counterHit(me, F[1 - meSide]);
  });
  net.on("proj", (m) => { const p = m.p; if (screen === "match") fireProjectile(F[p.owner], null, { ...p }); });
  net.on("pgone", (m) => { for (const p of projectiles) if (p.id === m.id) p.life = 0; });
  net.on("_leave", () => opponentLeft("Tu rival se ha desconectado."));

  function opponentLeft(msg) {
    online.opp = null;
    const inMatch = screen === "match" || screen === "end";
    leaveRoom();
    if (inMatch) {
      endToLobby();
    }
    setStatus(msg, true);
  }

  // ── sala online ──
  $(".cf-create").addEventListener("click", async () => {
    setStatus("Creando sala…");
    try {
      await net.host(randomCode());
      online.on = true; online.opp = null; clock.offset = 0;
      mode = "online"; meSide = 0;
      renderRoom();
      setStatus("Comparte el código: tu rival pulsa «Unirse» y lo escribe.");
    } catch (err) { setStatus(err.message, true); }
  });
  async function joinRoom() {
    const code = cleanCode(lobby.code.value);
    if (code.length !== 5) return setStatus("El código tiene 5 letras.", true);
    setStatus(`Buscando la sala ${code}…`);
    try {
      await net.join(code);
      online.on = true; online.opp = null; clock.samples = [];
      mode = "online"; meSide = 1;
      online.lastRx = performance.now();
      tx({ t: "hello", c: myChar });
      tx({ t: "ping", c: performance.now() });
      renderRoom();
      setStatus("Conectando con el anfitrión…");
    } catch (err) { setStatus(err.message, true); }
  }
  $(".cf-join").addEventListener("click", joinRoom);
  lobby.code.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") joinRoom(); });
  lobby.code.addEventListener("input", () => { lobby.code.value = cleanCode(lobby.code.value); });
  $(".cf-copy").addEventListener("click", () => { try { navigator.clipboard.writeText(net.code); setStatus("Código copiado ✔"); } catch (e) {} });
  function leaveRoom() {
    net.destroy();
    online.on = false; online.opp = null; online.lastRx = 0;
    clock.offset = 0; clock.samples = []; clock.rtt = 0;
    mode = "cpu"; meSide = 0;
    renderRoom();
  }
  $(".cf-leave").addEventListener("click", () => { leaveRoom(); setStatus(""); });
  function hostStartMatch() {
    if (!online.on || !net.isHost || !online.opp) return;
    const at = hostNow() + 350;
    tx({ t: "match", p1: myChar, p2: online.opp.c, at });
    beginMatch(myChar, online.opp.c, at);
  }
  lobby.go.addEventListener("click", hostStartMatch);

  // ── elección de luchador ──
  let pickIdx = Math.max(0, CHARS.findIndex((c) => c.id === myChar));
  function renderPick() {
    const c = CHARS[pickIdx];
    myChar = c.id;
    const av = getCharacterAvatar(c.id);
    const img = $(".cf-sticker");
    if (av) img.src = av;
    img.classList.toggle("px", !!(av && av.startsWith("data:")));
    $(".cf-pname").textContent = `${c.emoji} ${c.name}`;
    $(".cf-pspecial").textContent = `★ ${specialFor(c.id).name}`;
    renderRoom();
  }
  root.querySelectorAll(".cf-arrow").forEach((b) => b.addEventListener("click", () => {
    pickIdx = (pickIdx + Number(b.dataset.d) + CHARS.length) % CHARS.length;
    renderPick();
    audio.init();
    audio.tone({ freq: 700, dur: 0.05, type: "triangle", gain: 0.08 });
    if (onPickChar) try { onPickChar(myChar); } catch (e) {}
    if (online.on) tx({ t: "pick", c: myChar });
  }));
  renderPick();

  $(".cf-cpu").addEventListener("click", () => {
    if (online.on) return;
    mode = "cpu"; meSide = 0;
    let rival = CHARS[Math.floor(Math.random() * CHARS.length)].id;
    if (rival === myChar) rival = CHARS[(pickIdx + 5) % CHARS.length].id;
    beginMatch(myChar, rival, hostNow() + 200);
  });

  // ── overlays ──
  function showOv(name) {
    $(".cf-lobby").classList.toggle("hidden", name !== "lobby");
    $(".cf-pause").classList.toggle("hidden", name !== "pause");
    $(".cf-end").classList.toggle("hidden", name !== "end");
  }
  let pausedAt = 0;
  function pause() {
    if (screen !== "match" || paused) return;
    paused = true;
    pausedAt = hostNow();
    $(".cf-pause-note").textContent = mode === "online" ? "La pelea sigue: tu rival no se pausa." : "";
    showOv("pause");
    syncPad();
  }
  function resume() {
    if (!paused) return;
    paused = false;
    // contra la CPU la pausa congela el reloj: desplazamos la ronda y los eventos pendientes
    if (mode === "cpu") {
      const d = hostNow() - pausedAt;
      M.fightAt += d; M.introAt += d;
      M.events.forEach((e) => (e.at += d));
    }
    showOv(null);
    syncPad();
  }
  function endToLobby() {
    [0, 1].forEach((i) => { disposeFighter(F[i]); F[i] = null; });
    projectiles.forEach((p) => scene.remove(p.mesh));
    projectiles = [];
    screen = "lobby"; phase = "idle"; paused = false;
    M.events = [];
    $(".cf-hud").classList.add("hidden");
    showOv("lobby");
    renderRoom();
    syncPad();
  }
  $(".cf-resume").addEventListener("click", resume);
  $(".cf-quit").addEventListener("click", () => { if (online.on) leaveRoom(); endToLobby(); });
  $(".cf-again").addEventListener("click", () => {
    if (mode === "cpu") beginMatch(F[0].cid, F[1].cid, hostNow() + 200);
    else hostStartMatch();
  });
  $(".cf-tolobby").addEventListener("click", () => endToLobby());
  $(".cf-exit").addEventListener("click", exit);
  $(".cf-pausebtn").addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); pause(); });

  // ── entrada ──
  function onKeyDown(e) {
    if (e.target && e.target.tagName === "INPUT") return;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.code)) e.preventDefault();
    keys[e.code] = true;
    if ((e.code === "Escape" || e.code === "KeyP") && screen === "match") paused ? resume() : pause();
    if (e.code === "KeyM") audio.toggleMusic();
  }
  function onKeyUp(e) { keys[e.code] = false; }
  function onBlur() { for (const k in keys) keys[k] = false; if (screen === "match" && mode === "cpu") pause(); }
  window.addEventListener("keydown", onKeyDown);
  // el audio sólo puede arrancar tras un gesto: lo despertamos con el primer toque/clic
  root.addEventListener("pointerdown", () => { audio.init(); audio.resume(); }, { capture: true });
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  // mando táctil común (horizontal) — mismo componente que Doodle District
  const touchPad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "punch", label: "GOLPE", icon: ICON.punch, accent: "red" },
      { id: "jump", label: "SALTA", icon: ICON.jump },
      { id: "special", label: "ESPECIAL", icon: ICON.special, accent: "blue" },
      { id: "block", label: "BLOQ.", icon: ICON.block }
    ],
    isActive: () => screen === "match" && !paused,
    onAction: (id, down) => { tp[id] = down; }
  }) : null;
  function syncPad() {
    const portrait = document.body.classList.contains("gameboy-mode");
    if (touchPad) touchPad.setVisible(isTouch && !portrait && screen === "match" && !paused);
    root.classList.toggle("dd-landpad", isTouch && !portrait);
  }

  // mando físico
  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let g = null;
    for (const p of pads) if (p && p.connected) { g = p; break; }
    if (!g) { Object.assign(gp, { x: 0, jump: false, punch: false, special: false, block: false }); return; }
    const b = (i) => !!(g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.4));
    const ax = Math.abs(g.axes[0] || 0) > 0.25 ? g.axes[0] : 0;
    gp.x = ax + (b(15) ? 1 : 0) - (b(14) ? 1 : 0);
    gp.jump = b(0) || b(12) || (g.axes[1] || 0) < -0.7;
    gp.punch = b(2);
    gp.special = b(3) || b(1);
    gp.block = b(4) || b(5) || b(6) || b(13) || (g.axes[1] || 0) > 0.7;
    if (b(9) && !gp.prev[9] && screen === "match") paused ? resume() : pause();
    gp.prev[9] = b(9);
  }

  // etiquetas del deck Game Boy en vertical (se restauran al salir)
  const relabels = [];
  for (const [sel, txt] of [["#gbLabelA", "GOLPE"], ["#gbLabelB", "ESPECIAL"]]) {
    const el = document.querySelector(sel);
    if (el) { relabels.push([el, el.textContent]); el.textContent = txt; }
  }

  // ── tamaño ──
  function resize() {
    const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    camera.aspect = w / h;
    camera.fov = w < h ? 50 : 38;
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
    if (!(paused && mode === "cpu")) {
      acc += dt;
      while (acc >= STEP) { stepSim(STEP); acc -= STEP; }
    } else acc = 0;
    netTick(dt);
    updateFx(paused && mode === "cpu" ? 0 : dt * M.slow);
    for (const f of F) if (f) drawFighter(f, dt);
    if (screen === "lobby") {
      // vista de presentación: la cámara recorre el escenario
      camPos.lerp(_p.set(Math.sin(wall * 0.25) * 4, 3.4, FIGHT_Z + 12), 0.03);
      camLook.lerp(_p.set(Math.sin(wall * 0.25) * 2, 1.6, 0), 0.05);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
    } else updateCamera(dt);
    stage.update(dt, wall, M.hype);
    updateHud(dt);
    R.render(scene, camera, { time: wall, hurt: F[meSide] && F[meSide].flash > 0 ? 0.35 : 0, lowHp: 0, flash: phase === "ko" ? Math.max(0, 0.5 - (performance.now() - M.koAt) / 600) : 0 }, overlay);
  }
  raf = requestAnimationFrame(frame);

  // en segundo plano el navegador para requestAnimationFrame: en online seguimos simulando
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
    [0, 1].forEach((i) => disposeFighter(F[i]));
    if (touchPad) touchPad.destroy();
    audio.destroy();
    R.dispose();
    root.remove();
    if (window.__fight) delete window.__fight;
  }
  function exit() { destroy(); if (onExit) onExit(); }

  if (import.meta.env && import.meta.env.DEV) window.__fight = { F, M, net, online, clock, get screen() { return screen; }, get phase() { return phase; } };

  showOv("lobby");
  return { destroy, exit };
}
