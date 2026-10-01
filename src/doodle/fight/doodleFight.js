// =============================================================================
// doodleFight.js — MUNDO 3 · COWORKING FIGHT (pelea estilo Smash, dibujada a boli)
//
// · Hasta 4 luchadores en la azotea del CINK: tú + CPUs, u online con compañeros
//   (y CPUs para rellenar huecos).
// · Estilo Smash: no hay barra de vida, hay PORCENTAJE. Cuanto más llevas, más
//   lejos sales volando; si cruzas la zona límite pierdes una vida (3 por cabeza).
//   Doble salto, súper salto (▲ + especial) para volver, bordes de los que colgarte,
//   escudo, esquiva y golpes fuertes/arriba/abajo según hacia dónde apuntes.
// · Objetos que caen del cielo: grapadora y bomba de post-its (se lanzan), Boli Bic
//   gigante (golpes más fuertes), café (-25 %) y modo focus (invencible).
// · Red P2P en estrella (PeerJS): cada móvil simula SU luchador y lo manda 30 veces
//   por segundo; el anfitrión simula las CPUs, reparte los objetos, reenvía los
//   mensajes y hace de árbitro. Quien golpea lo detecta y la víctima aplica el golpe.
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
import { buildFightStage, PLATFORMS, MAIN, BLAST, RESPAWN, FIGHT_Z } from "./fightStage.js";
import { specialFor, rollMulti, specialCooldown } from "./fightMoves.js";
import { buzz } from "../haptics.js";
import "../doodle.css";
import "./fight.css";

const STEP = 1 / 60;
const GRAV = 30;
const FW = 0.9, FH = 1.95;
const MAX_F = 4;
const STOCKS = 3;
const MATCH_TIME = 180;
const STICKER_H = 2.3;
const SEND_HZ = 30;
const INTERP_MS = 90;
const SLOT_INK = [INK.RED, INK.BLUE, INK.GREEN, INK.ORANGE];
const SLOT_NAME = ["P1", "P2", "P3", "P4"];

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);
const charById = (id) => CHARS.find((c) => c.id === id) || CHARS[0];
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

// ── golpes normales · box = [delante, abajo, ancho, alto] desde los pies ──
// base/grow: empuje base y cuánto crece con el porcentaje; ang: ángulo de salida
const M_ = (name, o) => ({ name, start: 0.05, active: 0.09, rec: 0.14, heavy: false, ...o });
const MOVES = {
  jab: [
    M_("jab", { dmg: 3, box: [0.2, 0.8, 1.0, 0.7], base: 2.5, grow: 8, ang: 25 }),
    M_("jab2", { dmg: 3, box: [0.2, 0.8, 1.1, 0.8], base: 2.5, grow: 8, ang: 25 }),
    M_("jab3", { dmg: 6, start: 0.07, rec: 0.24, box: [0.15, 0.7, 1.25, 1.0], base: 5, grow: 55, ang: 40, heavy: true })
  ],
  fsmash: M_("fsmash", { dmg: 15, start: 0.18, active: 0.1, rec: 0.32, box: [0.2, 0.5, 1.55, 1.2], base: 6, grow: 105, ang: 38, heavy: true }),
  utilt: M_("utilt", { dmg: 10, start: 0.08, active: 0.12, rec: 0.24, box: [-0.6, 1.3, 1.4, 1.4], base: 6, grow: 80, ang: 88, heavy: true }),
  dtilt: M_("dtilt", { dmg: 8, start: 0.06, active: 0.1, rec: 0.2, box: [-1.0, 0, 2.6, 0.6], base: 4, grow: 60, ang: 22 }),
  nair: M_("nair", { dmg: 8, active: 0.2, rec: 0.15, box: [-0.7, 0.2, 2.2, 1.5], base: 4, grow: 55, ang: 45 }),
  fair: M_("fair", { dmg: 11, start: 0.1, active: 0.1, rec: 0.2, box: [0.2, 0.5, 1.35, 1.1], base: 5, grow: 80, ang: 40, heavy: true }),
  uair: M_("uair", { dmg: 9, start: 0.06, active: 0.12, rec: 0.18, box: [-0.6, 1.4, 1.5, 1.2], base: 5, grow: 70, ang: 85 }),
  dair: M_("dair", { dmg: 12, start: 0.12, active: 0.12, rec: 0.25, box: [-0.4, -0.4, 1.1, 1.0], base: 4, grow: 70, ang: -80, heavy: true })
};
// empuje de los especiales según su tipo
const SPK = { dash: { base: 6, grow: 70, ang: 30 }, proj: { base: 3.5, grow: 45, ang: 35 }, rise: { base: 6, grow: 60, ang: 80 }, slam: { base: 7, grow: 75, ang: 55 } };
const UPB = { kind: "rise", dmg: 7, name: "SÚPER SALTO", ink: INK.BLUE, vy: 14, vx: 2.5 };

// ── objetos ──
const ITEMS = {
  grapadora: { name: "Grapadora", icon: "📎", type: "throw", shape: "stapler", ink: INK.BLACK, dmg: 10, base: 5, grow: 60, ang: 35, speed: 16, vy: 2.5 },
  bomba: { name: "Bomba de post-its", icon: "💣", type: "throw", shape: "bomb", ink: INK.ORANGE, dmg: 16, base: 8, grow: 80, ang: 60, speed: 11, vy: 5, boom: 2.6 },
  boli: { name: "Boli Bic gigante", icon: "🖊️", type: "weapon", ink: INK.BLUE },
  cafe: { name: "Café", icon: "☕", type: "use", ink: INK.ORANGE },
  focus: { name: "Modo focus", icon: "⭐", type: "use", ink: INK.ORANGE }
};
const ITEM_POOL = ["grapadora", "grapadora", "bomba", "boli", "cafe", "cafe", "focus"];

const TEMPLATE = `
<canvas class="dd-canvas"></canvas>
<div class="cf-hud hidden">
  <div class="sb-timer"><span>3:00</span></div>
  <div class="sb-cards"></div>
  <div class="cf-ping"></div>
  <div class="cf-big"></div>
  <div class="cf-small"></div>
  <div class="cf-floats"></div>
  <div class="dd-hudbtns"><button class="dd-hb cf-pausebtn" aria-label="Pausa">❚❚</button></div>
</div>

<div class="dd-ov cf-lobby">
  <div class="dd-card cf-card">
    <div class="cf-col cf-pickcol">
      <div class="dd-kicker">MUNDO 3 · TODOS CONTRA TODOS</div>
      <h1 class="cf-title">Coworking Fight</h1>
      <div class="cf-picker">
        <button class="cf-arrow" data-d="-1" aria-label="Anterior">◀</button>
        <div class="cf-preview"><img class="cf-sticker" alt=""><div class="cf-pname"></div><div class="cf-pspecial"></div></div>
        <button class="cf-arrow" data-d="1" aria-label="Siguiente">▶</button>
      </div>
    </div>
    <div class="cf-col cf-modecol">
      <div class="sb-cpubox">
        <div class="sb-cpurow"><span>🤖 Rivales CPU</span>
          <div class="sb-seg" role="group"><button data-n="1">1</button><button data-n="2">2</button><button data-n="3" class="on">3</button></div>
        </div>
        <div class="sb-cpurow"><span>🎚️ Dificultad</span>
          <div class="sb-seg sb-diff" role="group"><button data-d="0">Fácil</button><button data-d="1" class="on">Normal</button><button data-d="2">Difícil</button></div>
        </div>
        <button class="dd-btn cf-cpu">¡A pelear!</button>
      </div>
      <div class="dd-mp cf-online">
        <div class="dd-mp-head">📱 <b>Online</b> <small>hasta 4 compañeros</small></div>
        <div class="dd-mp-row cf-lobbyrow">
          <button class="dd-btn dd-mini cf-create">Crear sala</button>
          <input class="dd-mp-code cf-code" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" spellcheck="false" />
          <button class="dd-btn dd-mini dd-ghost cf-join">Unirse</button>
        </div>
        <div class="cf-room hidden">
          <div class="dd-mp-coderow">Sala <b class="dd-mp-codebig cf-codebig"></b> <button class="dd-btn dd-mini dd-ghost cf-copy">Copiar</button> <span class="cf-lping"></span></div>
          <div class="sb-roster"></div>
          <div class="dd-btns cf-roombtns">
            <button class="dd-btn dd-mini cf-go" disabled>¡A pelear!</button>
            <button class="dd-btn dd-mini dd-ghost sb-addcpu">+ CPU</button>
            <button class="dd-btn dd-mini dd-ghost cf-leave">Salir</button>
          </div>
        </div>
        <div class="dd-mp-status cf-status"></div>
      </div>
      <div class="cf-help dd-desktop-only">A/D mover · Espacio saltar · W/S apuntar · J golpe · K especial (W+K súper salto) · L escudo · Esc pausa</div>
      <div class="cf-help dd-touch-only">Joystick: mover y apuntar (▲ golpe arriba, ▼ abajo, a tope: golpe fuerte) · ▲ + especial: súper salto</div>
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
  <div class="dd-card dd-small sb-endcard">
    <div class="dd-kicker cf-end-kicker"></div>
    <h2 class="cf-end-title"></h2>
    <ol class="sb-results"></ol>
    <div class="dd-btns">
      <button class="dd-btn cf-again">Revancha</button>
      <button class="dd-btn dd-ghost cf-tolobby">Cambiar luchador</button>
    </div>
  </div>
</div>`;

/**
 * @param {{charId?: string, onPickChar?: (id:string)=>void, onExit?: Function, onVictory?: (score:number, rank:string)=>void}} opts
 */
export function startDoodleFight({ charId, onPickChar, onExit, onVictory, onScore } = {}) {
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
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
  scene.add(camera);
  const stage = buildFightStage(scene);

  // ── estado general ──
  let screen = "lobby"; // lobby | match | end
  let phase = "idle"; // intro | fight | over
  let paused = false;
  let mode = "cpu"; // cpu | online
  let myChar = charId || CHARS[0].id;
  let meSlot = 0;
  let cpuCount = 3;
  // dificultad de la CPU: tiempo de reacción, ganas de bloquear y de atacar
  const DIFFS = [{ react: 1.9, block: 0.3, hit: 0.55, spec: 0.5 }, { react: 1, block: 1, hit: 1, spec: 1 }, { react: 0.55, block: 1.9, hit: 1.1, spec: 1.6 }];
  let diff = DIFFS[1];
  let F = []; // luchadores por hueco
  const M = { fightAt: 0, slow: 1, freeze: 0, hype: 0.2, shake: 0, events: [], out: [], itemT: 6, frozenTime: null };
  let projectiles = [];
  let items = [];
  let atkSeq = 0, itemSeq = 0;

  const clock = { offset: 0, samples: [], rtt: 0 };
  const hostNow = () => performance.now() + clock.offset;
  const schedule = (at, fn) => M.events.push({ at, fn });

  // ── red ──
  const net = createNet({ prefix: "clevergy-brawl-", maxPlayers: MAX_F });
  const online = { on: false, slots: [], lastRx: new Map(), pingT: 0, sendT: 0 };
  const isAuthority = () => mode === "cpu" || net.isHost;
  const tx = (msg) => (net.isHost ? net.broadcast(msg) : net.send(msg));
  const RELAY = new Set(["st", "mv", "proj", "pgone", "ko", "throw"]);

  // ── sonido ──
  const sfx = {
    whoosh: () => audio.noise({ dur: 0.09, gain: 0.18, filter: "bandpass", freq: 900, to: 2600, q: 0.8 }),
    charge: () => audio.tone({ freq: 220, to: 520, dur: 0.18, type: "sawtooth", gain: 0.06 }),
    hit: (heavy) => {
      audio.noise({ dur: heavy ? 0.22 : 0.12, gain: heavy ? 0.45 : 0.3, filter: "lowpass", freq: heavy ? 900 : 1600, to: 120 });
      audio.tone({ freq: heavy ? 110 : 170, to: 50, dur: heavy ? 0.25 : 0.14, type: "square", gain: heavy ? 0.22 : 0.14 });
    },
    block: () => { audio.tone({ freq: 1250, to: 900, dur: 0.08, type: "square", gain: 0.1 }); audio.noise({ dur: 0.06, gain: 0.15, filter: "highpass", freq: 3000 }); },
    parry: () => [0, 0.06].forEach((d, i) => audio.tone({ freq: 1500 + i * 500, dur: 0.1, type: "triangle", gain: 0.16, delay: d })),
    jump: () => audio.tone({ freq: 320, to: 620, dur: 0.1, type: "triangle", gain: 0.1 }),
    special: () => audio.noise({ dur: 0.3, gain: 0.3, filter: "bandpass", freq: 400, to: 2200, q: 1 }),
    beep: (hi) => audio.tone({ freq: hi ? 1320 : 660, dur: hi ? 0.35 : 0.12, type: "square", gain: 0.12 }),
    ko: () => { audio.bossRoar(); audio.noise({ dur: 0.7, gain: 0.45, filter: "lowpass", freq: 700, to: 60 }); },
    land: () => audio.noise({ dur: 0.05, gain: 0.08, filter: "lowpass", freq: 500 }),
    item: () => [0, 0.06].forEach((d, i) => audio.tone({ freq: 880 + i * 330, dur: 0.08, type: "triangle", gain: 0.1, delay: d })),
    boom: () => { audio.noise({ dur: 0.5, gain: 0.5, filter: "lowpass", freq: 900, to: 50 }); audio.tone({ freq: 90, to: 40, dur: 0.4, type: "square", gain: 0.2 }); }
  };

  // ── luchadores ──
  function spawnPos(slot, n) {
    const xs = n <= 2 ? [-4, 4] : n === 3 ? [-4.5, 0, 4.5] : [-6, -2, 2, 6];
    return xs[slot % xs.length] ?? 0;
  }
  function mkFighter(slot, cid, ctrl, owner, n) {
    const cfg = charById(cid);
    const f = {
      slot, cid, cfg, ctrl, owner, sp: specialFor(cid),
      x: spawnPos(slot, n), y: 0, vx: 0, vy: 0, facing: slot % 2 ? -1 : 1, g: true, prevY: 0,
      pct: 0, stocks: STOCKS, kos: 0, falls: 0, state: "idle", move: null, combo: 0, comboT: 0, airJ: 2, upB: false, airDodge: false,
      cd: 0, cdMax: specialCooldown(cfg), inv: 0, stun: 0, dropT: 0, flash: 0, squash: 1, pose: "idle", buf: [],
      item: null, boliT: 0, starT: 0, shieldHp: 100, ledge: 0, ledgeT: 0, ledgeUsed: false, deadT: 0, lastHit: -1, lastHitT: 0, gone: false,
      speed: 4.4 + (cfg.spd || 3.5) * 0.6, jumpV: 11 + ((cfg.jump || 9.5) - 9) * 0.8,
      sticker: createSticker(overlay, { height: STICKER_H }),
      shadow: new THREE.Mesh(GEO.disc, mat(SLOT_INK[slot], { fill: true })),
      bubble: new THREE.Mesh(GEO.sph, mat(SLOT_INK[slot], { tone: 0.35 })),
      held: null
    };
    f.sticker.setChar(cid);
    f.shadow.rotation.x = -Math.PI / 2;
    f.bubble.visible = false;
    scene.add(f.shadow, f.bubble);
    return f;
  }
  function disposeFighter(f) {
    if (!f) return;
    f.sticker.dispose();
    scene.remove(f.shadow, f.bubble);
    if (f.held) scene.remove(f.held);
    if (f.tag) f.tag.remove();
  }

  // caja de golpeo → rectángulo en el mundo
  function hitRect(f, box, reach = 0) {
    const [fw, bottom, w, h] = box;
    const ww = w + reach;
    const x0 = f.facing > 0 ? f.x + fw : f.x - fw - ww;
    return { x0, x1: x0 + ww, y0: f.y + bottom, y1: f.y + bottom + h };
  }
  const overlaps = (r, o) => r.x1 > o.x - FW / 2 && r.x0 < o.x + FW / 2 && r.y1 > o.y && r.y0 < o.y + FH;
  const alive = (f) => f && !f.gone && f.stocks > 0 && f.state !== "dead";
  const foes = (f) => F.filter((o) => o && o !== f && alive(o));

  function startMove(f, def, special) {
    f.move = { def, special, t: 0, hits: new Set(), id: ++atkSeq, phase: 0 };
    f.state = special ? "special" : "attack";
    if (special) {
      f.cd = def === UPB ? f.cd : f.cdMax;
      sfx.special();
      if (def.kind === "slam" && f.g) { f.vy = 11; f.g = false; }
      if (def.kind === "rise") { f.vy = def.vy; f.vx = f.facing * def.vx; f.g = false; f.upB = true; }
    } else if (def.name === "fsmash") sfx.charge();
    else sfx.whoosh();
    if (online.on) tx({ t: "mv", s: f.slot });
  }

  // ── entrada local ──
  const keys = {};
  const tp = { punch: false, jump: false, special: false, block: false };
  const gp = { x: 0, y: 0, jump: false, punch: false, special: false, block: false, prev: [] };
  const prevHeld = { jump: false, punch: false, special: false, block: false };
  function readLocal() {
    const joy = touchPad ? touchPad.joy : { x: 0, y: 0 };
    let x = gp.x + joy.x, y = gp.y + joy.y;
    if (keys.KeyA || keys.ArrowLeft || mando.L) x -= 1;
    if (keys.KeyD || keys.ArrowRight || mando.R) x += 1;
    if (keys.KeyW || keys.ArrowUp || mando.Up) y += 1;
    if (keys.KeyS || keys.ArrowDown || mando.Down) y -= 1;
    const jumpHeld = !!(keys.Space || mando.Up || gp.jump || tp.jump);
    const punchHeld = !!(keys.KeyJ || keys.KeyZ || mando.A || gp.punch || tp.punch);
    const specHeld = !!(keys.KeyK || keys.KeyX || mando.B || gp.special || tp.special);
    const blockHeld = !!(keys.KeyL || keys.ShiftLeft || keys.ShiftRight || gp.block || tp.block || (mando.Down && !mando.A && !mando.B));
    const inp = {
      x: clamp(x, -1, 1), y: clamp(y, -1, 1), jumpHeld, block: blockHeld,
      jump: jumpHeld && !prevHeld.jump, punch: punchHeld && !prevHeld.punch, special: specHeld && !prevHeld.special, blockPress: blockHeld && !prevHeld.block
    };
    prevHeld.jump = jumpHeld; prevHeld.punch = punchHeld; prevHeld.special = specHeld; prevHeld.block = blockHeld;
    return inp;
  }
  const NO_INPUT = { x: 0, y: 0, jumpHeld: false, block: false, jump: false, punch: false, special: false, blockPress: false };

  // ── IA de las CPUs ──
  function cpuInput(f, dt) {
    const ai = f.ai || (f.ai = { t: 0, x: 0, y: 0, target: null, retarget: 0, block: 0, jumpHeld: false });
    ai.t -= dt; ai.retarget -= dt; ai.block = Math.max(0, ai.block - dt);
    const inp = { ...NO_INPUT, x: ai.x, y: ai.y, block: ai.block > 0, jumpHeld: ai.jumpHeld };
    // 1 · volver al escenario si está fuera (prioridad absoluta)
    const offX = f.x < MAIN.x0 + 0.2 || f.x > MAIN.x1 - 0.2;
    if (f.ledge) { if (ai.t <= 0) { ai.t = rnd(0.15, 0.5); inp.jump = Math.random() < 0.5; if (!inp.jump) inp.y = 1; } return inp; }
    if (!f.g && (offX || f.y < -0.3)) {
      inp.x = f.x > 0 ? -1 : 1;
      if (f.vy < 1 && f.airJ > 0 && ai.t <= 0) { inp.jump = true; ai.t = 0.25; }
      else if (f.airJ === 0 && !f.upB && f.vy < 0 && f.y < 1.5) { inp.y = 1; inp.special = true; }
      return inp;
    }
    if (ai.t > 0) return inp;
    ai.t = rnd(0.08, 0.18) * diff.react;
    ai.x = 0; ai.y = 0; ai.jumpHeld = false;
    // 2 · objetivo: el rival más cercano (a veces cambia)
    const list = foes(f);
    if (!ai.target || !alive(ai.target) || ai.retarget <= 0) {
      ai.retarget = rnd(3, 6);
      ai.target = list.sort((a, b) => Math.abs(a.x - f.x) - Math.abs(b.x - f.x))[Math.random() < 0.75 ? 0 : list.length - 1] || null;
    }
    // 3 · objetos: si hay uno cerca y nadie encima, a por él
    const near = items.find((it) => !it.taken && it.g && Math.abs(it.x - f.x) < 5 && Math.abs(it.y - f.y) < 2);
    if (near && !f.item && (!ai.target || Math.abs(ai.target.x - f.x) > 3)) {
      ai.x = Math.sign(near.x - f.x) || 0;
      if (Math.abs(near.x - f.x) < 0.7) inp.punch = true;
      return inp;
    }
    const o = ai.target;
    if (!o) return inp;
    const dx = o.x - f.x, dist = Math.abs(dx), dy = o.y - f.y;
    // se protege a veces cuando le atacan de cerca
    if (o.move && dist < 2.2 && f.g && Math.random() < 0.08 * diff.block) { ai.block = rnd(0.2, 0.45); return inp; }
    // lanza lo que tenga en la mano si el rival está a tiro
    if (f.item && ITEMS[f.item].type === "throw" && dist < 9 && Math.abs(dy) < 1.5) { f.facing = Math.sign(dx) || f.facing; ai.x = Math.sign(dx) * 0.3; inp.punch = true; return inp; }
    // no te tires al vacío persiguiendo
    const edgeSafe = (x) => x > MAIN.x0 + 0.8 && x < MAIN.x1 - 0.8;
    if (dist > 1.3) ai.x = Math.sign(dx) * (dist > 4 ? 1 : 0.7);
    if (!edgeSafe(f.x + ai.x * 0.8) && f.g && !PLATFORMS.some((p) => f.y >= p.y - 0.1 && f.x > p.x0 && f.x < p.x1)) ai.x = 0;
    const sp = f.sp;
    if (f.cd <= 0 && Math.random() < 0.18 * diff.spec && ((sp.kind === "proj" && dist > 3 && dist < 10 && Math.abs(dy) < 1.5) || (sp.kind !== "proj" && dist < 3))) inp.special = true;
    else if (dist < 1.7 && Math.abs(dy) < 1.4) {
      inp.punch = Math.random() < 0.85 * diff.hit;
      if (o.pct > 70 && f.g && Math.random() < 0.5) ai.x = Math.sign(dx); // golpe fuerte para rematar
      else if (Math.random() < 0.25) ai.x = 0;
    } else if (dy > 1.3 && Math.abs(dx) < 1.4) { ai.y = 1; inp.punch = Math.random() < 0.6; }
    if ((dy > 1.4 && f.g && Math.random() < 0.55) || (Math.random() < 0.02)) { inp.jump = true; ai.jumpHeld = true; }
    if (!f.g && o.y < f.y - 1 && Math.abs(dx) < 1 && Math.random() < 0.4) { ai.y = -1; inp.punch = true; }
    return inp;
  }

  // ── simulación de un luchador controlado aquí (tú o una CPU) ──
  function updateFighter(f, inp, dt) {
    if (f.gone) return;
    f.cd = Math.max(0, f.cd - dt);
    f.inv = Math.max(0, f.inv - dt);
    f.boliT = Math.max(0, f.boliT - dt);
    f.starT = Math.max(0, f.starT - dt);
    f.lastHitT -= dt;
    f.comboT -= dt;
    f.dropT -= dt;
    f.prevY = f.y;
    if (f.state !== "shield") f.shieldHp = Math.min(100, f.shieldHp + dt * 14);
    if (f.boliT <= 0 && f.item === "boli") setItem(f, null);

    if (f.state === "dead") {
      f.deadT -= dt;
      if (f.deadT <= 0 && f.stocks > 0) respawn(f);
      return;
    }
    if (phase !== "fight" || f.state === "win") {
      if (f.state !== "win") { f.state = f.g ? "idle" : "jump"; f.move = null; }
      f.vx *= f.g ? 0.8 : 0.99;
      physics(f, dt, inp);
      return;
    }
    if (f.ledge) { updateLedge(f, inp, dt); return; }

    if (f.stun > 0) {
      f.stun -= dt;
      if (f.state !== "tumble" && f.state !== "broken") f.state = "hurt";
      if (f.g) f.vx *= 0.86;
      else if (f.state === "tumble") f.vx += inp.x * 6 * dt; // un poco de influencia en el aire
      if (f.stun <= 0) f.state = f.g ? "idle" : "jump";
    } else if (f.move) {
      updateMove(f, dt);
    } else if (f.state === "roll") {
      f.rollT -= dt;
      f.vx = f.rollDir * 9;
      if (f.rollT <= 0) { f.state = "idle"; f.vx *= 0.3; }
    } else {
      const grounded = f.g;
      // escudo en el suelo (con izquierda/derecha: esquiva rodando)
      if (inp.block && grounded) {
        if (f.state !== "shield" && Math.abs(inp.x) > 0.6 && inp.blockPress) { roll(f, Math.sign(inp.x)); }
        else if (f.state === "shield" && Math.abs(inp.x) > 0.7 && f.shieldT > 0.06) { roll(f, Math.sign(inp.x)); }
        else {
          if (f.state !== "shield") f.shieldT = 0;
          f.state = "shield";
          f.shieldT += dt;
          f.shieldHp -= dt * 22;
          f.vx *= 0.7;
          if (f.shieldHp <= 0) breakShield(f);
          if (inp.jump) { f.state = "idle"; jump(f); }
        }
      } else {
        if (f.state === "shield") f.state = "idle";
        // esquiva en el aire
        if (inp.blockPress && !grounded && !f.airDodge) { f.airDodge = true; f.inv = Math.max(f.inv, 0.32); f.vx = inp.x * 7; f.vy = Math.max(f.vy * 0.3, inp.y * 7); spawnInk(f.x, f.y + 1, INK.BLUE, 4, 2); }
        const sp = f.starT > 0 ? 1.25 : 1;
        const target = inp.x * f.speed * sp;
        f.vx += (target - f.vx) * Math.min(1, dt * (grounded ? 16 : 5));
        if (Math.abs(inp.x) > 0.25) f.facing = Math.sign(inp.x);
        f.state = !grounded ? "jump" : Math.abs(f.vx) > 0.4 ? "walk" : "idle";
        // ▼ + salto en una plataforma: bajar
        if (inp.jump && grounded && inp.y < -0.6 && f.y > 0.05) { f.dropT = 0.3; f.g = false; f.y -= 0.06; }
        else if (inp.jump) jump(f);
        // caída rápida
        if (!grounded && inp.y < -0.7 && f.vy < 2) f.vy = Math.min(f.vy, -14);
        if (inp.punch) attack(f, inp);
        else if (inp.special) {
          if (inp.y > 0.6 && !f.upB) startMove(f, f.sp.kind === "rise" ? f.sp : UPB, true);
          else if (f.cd <= 0) startMove(f, f.sp.kind === "multi" ? rollMulti() : f.sp, true);
        }
      }
    }
    physics(f, dt, inp);
  }
  function jump(f) {
    if (f.g) { f.vy = f.jumpV; f.g = false; sfx.jump(); }
    else if (f.airJ > 0) { f.airJ--; f.vy = f.jumpV * 0.9; sfx.jump(); f.squash = 0.8; spawnInk(f.x, f.y, SLOT_INK[f.slot], 3, 2); }
  }
  function roll(f, dir) {
    f.state = "roll"; f.rollT = 0.32; f.rollDir = dir; f.facing = -dir; f.inv = Math.max(f.inv, 0.3);
    audio.noise({ dur: 0.1, gain: 0.1, filter: "lowpass", freq: 800 });
  }
  function breakShield(f) {
    f.state = "broken"; f.stun = 2.2; f.shieldHp = 40; f.vy = 9; f.g = false;
    sfx.parry(); floatText(f, "¡ESCUDO ROTO!", "red"); burst(f.x, f.y + 1, INK.BLUE, 18);
  }

  // golpe: coger objeto > lanzar lo que llevas > golpe según hacia dónde apuntas
  function attack(f, inp) {
    if (!f.item) {
      const it = items.find((i) => !i.taken && Math.abs(i.x - f.x) < 0.9 && i.y > f.y - 0.6 && i.y < f.y + FH);
      if (it) { requestItem(f, it); return; }
    }
    if (f.item && ITEMS[f.item].type === "throw") { throwItem(f, inp); return; }
    const up = inp.y > 0.55, down = inp.y < -0.55, side = Math.abs(inp.x) > 0.6;
    if (f.g) {
      if (up) startMove(f, MOVES.utilt, false);
      else if (down) startMove(f, MOVES.dtilt, false);
      else if (side) { f.facing = Math.sign(inp.x); startMove(f, MOVES.fsmash, false); }
      else { f.combo = f.comboT > 0 ? (f.combo + 1) % MOVES.jab.length : 0; startMove(f, MOVES.jab[f.combo], false); }
    } else {
      if (up) startMove(f, MOVES.uair, false);
      else if (down) startMove(f, MOVES.dair, false);
      else if (side && Math.sign(inp.x) === f.facing) startMove(f, MOVES.fair, false);
      else startMove(f, MOVES.nair, false);
    }
  }

  // golpes con los rivales que toque el movimiento (cada uno una sola vez)
  function hitAll(f, rect, h) {
    for (const o of foes(f)) {
      if (f.move.hits.has(o.slot)) continue;
      if (overlaps(rect, o)) { f.move.hits.add(o.slot); dealHit(f, o, h); }
    }
  }
  function normalHit(f, d) {
    const boli = f.boliT > 0;
    return { dmg: Math.round(d.dmg * (boli ? 1.4 : 1)), base: d.base, grow: d.grow * (boli ? 1.3 : 1), ang: d.ang, heavy: d.heavy || boli, spike: d.ang < 0, ink: boli ? INK.BLUE : SLOT_INK[f.slot] };
  }
  function updateMove(f, dt) {
    const mv = f.move, d = mv.def;
    mv.t += dt;
    if (!mv.special) {
      if (f.g) f.vx *= d.name === "fsmash" ? 0.6 : 0.75;
      const start = d.start, end = d.start + d.active;
      if (mv.t >= start && mv.t <= end) hitAll(f, hitRect(f, d.box, f.boliT > 0 ? 0.6 : 0), normalHit(f, d));
      if (d.name === "fsmash" && mv.t < start) f.squash = 0.9;
      if (mv.t >= end + d.rec) { f.move = null; f.state = f.g ? "idle" : "jump"; f.comboT = 0.35; }
      if (!f.g && f.state === "attack" && mv.t > end && f.vy < 0) {} // sigue cayendo
      return;
    }
    const k = SPK[d.kind] || SPK.dash;
    switch (d.kind) {
      case "dash": {
        if (mv.t > 0.06 && mv.t < 0.06 + d.time) {
          f.vx = f.facing * d.speed;
          if (!f.g) f.vy = Math.max(f.vy, -2);
          const box = d.low ? [-0.3, 0, 1.3, 0.8] : [-0.2, 0.3, 1.2, 1.4];
          hitAll(f, hitRect(f, box), { dmg: d.dmg, ...k, heavy: true, ink: d.ink });
          if (Math.random() < 0.5) spawnInk(f.x - f.facing * 0.5, f.y + rnd(0.2, 1.4), d.ink, 1, 1.5);
        } else f.vx *= 0.8;
        if (mv.t > 0.06 + d.time + 0.22) endMove(f);
        break;
      }
      case "proj": {
        if (mv.t >= 0.1 && !mv.fired) { mv.fired = true; fireProjectile(f, { ...d, ...k }); }
        if (f.g) f.vx *= 0.7;
        if (mv.t > 0.36) endMove(f);
        break;
      }
      case "rise": {
        if (mv.t < 0.45) hitAll(f, hitRect(f, [-0.3, 0.2, 1.2, 2.2]), { dmg: d.dmg, ...SPK.rise, heavy: true, ink: d.ink || SLOT_INK[f.slot] });
        if (Math.random() < 0.6) spawnInk(f.x, f.y + 0.2, d.ink || INK.BLUE, 1, 1.5);
        if ((mv.t > 0.25 && f.g) || mv.t > 0.9) endMove(f);
        break;
      }
      case "slam": {
        if (mv.phase === 0 && (f.vy < 2 || mv.t > 0.35)) { mv.phase = 1; f.vy = -24; f.vx = f.facing * 2; }
        if (mv.phase === 1 && f.g) {
          mv.phase = 2;
          shockwave(f.x, f.y, d.ink);
          for (const o of foes(f)) {
            if (Math.abs(o.x - f.x) < d.radius && Math.abs(o.y - f.y) < 1.4) dealHit(f, o, { dmg: d.dmg, ...k, heavy: true, ink: d.ink, fromX: f.x - Math.sign(o.x - f.x || f.facing) });
          }
          M.shake = Math.max(M.shake, 0.9);
        }
        if (mv.phase === 2) { f.vx *= 0.7; mv.after = (mv.after || 0) + dt; if (mv.after > 0.25) endMove(f); }
        if (mv.t > 2) endMove(f);
        break;
      }
      case "shield": {
        f.vx *= 0.6;
        f.state = "counter";
        if (mv.t > d.time + 0.15) endMove(f);
        break;
      }
      default: endMove(f);
    }
  }
  function endMove(f) { f.move = null; f.state = f.g ? "idle" : "jump"; }

  // ── física: terraza sólida, plataformas atravesables, bordes y zonas límite ──
  function physics(f, dt, inp) {
    f.vy -= GRAV * dt;
    f.vy = Math.max(f.vy, -22);
    if (f.state === "tumble") f.vx *= 1 - dt * 0.6;
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    const wasG = f.g;
    f.g = false;
    const onMainX = f.x > MAIN.x0 - 0.2 && f.x < MAIN.x1 + 0.2;
    if (onMainX && f.prevY >= MAIN.y - 0.02 && f.y <= MAIN.y && f.vy <= 0) { f.y = MAIN.y; f.vy = 0; f.g = true; }
    else if (f.vy <= 0 && f.dropT <= 0) {
      for (const p of PLATFORMS) {
        if (f.x > p.x0 - 0.25 && f.x < p.x1 + 0.25 && f.prevY >= p.y - 0.02 && f.y <= p.y) { f.y = p.y; f.vy = 0; f.g = true; break; }
      }
    }
    // los laterales de la terraza son pared (no se atraviesa desde debajo)
    if (f.y < MAIN.y - 0.05 && f.y > MAIN.y - MAIN.depth - FH && f.x > MAIN.x0 - FW / 2 && f.x < MAIN.x1 + FW / 2) {
      if (f.prevY < MAIN.y - 0.05 && f.y + FH > MAIN.y - MAIN.depth) {
        if (f.x < 0) f.x = MAIN.x0 - FW / 2; else f.x = MAIN.x1 + FW / 2;
        f.vx = 0;
      }
    }
    if (f.y + FH > MAIN.y - MAIN.depth && f.y < MAIN.y - 0.05 && f.vy > 0 && f.x > MAIN.x0 && f.x < MAIN.x1) { f.y = Math.min(f.y, MAIN.y - MAIN.depth - FH); f.vy = 0; }
    if (f.g) {
      f.airJ = 2; f.upB = false; f.airDodge = false; f.ledgeUsed = false;
      if (!wasG) { f.squash = 0.78; sfx.land(); if (f.state === "tumble") { f.state = "hurt"; f.stun = Math.min(f.stun, 0.25); } }
    }
    // agarrarse al borde
    if (!f.g && f.vy < 0 && !f.ledgeUsed && f.state !== "tumble" && f.state !== "dead" && !f.move && inp && inp.y > -0.5) {
      for (const s of [-1, 1]) {
        const ex = s < 0 ? MAIN.x0 : MAIN.x1;
        const out = (f.x - ex) * s;
        if (out > -0.1 && out < 0.9 && f.y < MAIN.y - 0.3 && f.y > MAIN.y - 2.2 && !F.some((o) => o !== f && o.ledge === s)) {
          f.ledge = s; f.ledgeT = 0; f.ledgeUsed = true; f.x = ex + s * 0.35; f.y = MAIN.y - 1.5; f.vx = 0; f.vy = 0;
          f.facing = -s; f.inv = Math.max(f.inv, 0.8); f.airJ = 2; f.upB = false; f.state = "ledge"; f.move = null;
          break;
        }
      }
    }
    f.squash += (1 - f.squash) * Math.min(1, dt * 10);
    if (f.ctrl !== "remote" && (Math.abs(f.x) > BLAST.x || f.y < BLAST.bottom || f.y > BLAST.top)) knockOut(f);
  }
  function updateLedge(f, inp, dt) {
    f.ledgeT += dt;
    f.vx = 0; f.vy = 0;
    const s = f.ledge;
    const away = inp.x * s > 0.6;
    if (inp.jump) { f.ledge = 0; f.state = "jump"; f.vy = f.jumpV; f.vx = -s * 2; sfx.jump(); }
    else if (inp.y > 0.6 || inp.x * s < -0.6 || inp.punch) { f.ledge = 0; f.state = "idle"; f.x = (s < 0 ? MAIN.x0 : MAIN.x1) - s * 0.7; f.y = MAIN.y; f.prevY = MAIN.y; f.g = true; f.inv = Math.max(f.inv, 0.2); }
    else if (inp.y < -0.6 || away || f.ledgeT > 3) { f.ledge = 0; f.state = "jump"; f.dropT = 0.2; f.x += s * 0.3; }
  }

  function knockOut(f) {
    if (f.ctrl === "local") buzz(120);
    if (f.state === "dead") return;
    const by = f.lastHitT > 0 ? f.lastHit : -1;
    f.stocks--;
    f.falls++;
    f.state = "dead"; f.deadT = 1.6; f.move = null; f.ledge = 0;
    setItem(f, null);
    koFx(f);
    if (by >= 0 && F[by]) F[by].kos++;
    if (f.stocks <= 0) M.out.push(f.slot);
    if (online.on) tx({ t: "ko", s: f.slot, by, stk: f.stocks, x: +f.x.toFixed(1), y: +f.y.toFixed(1) });
  }
  function respawn(f) {
    f.x = RESPAWN.x + (f.slot - 1.5) * 1.2; f.y = RESPAWN.y; f.prevY = f.y; f.vx = 0; f.vy = 0;
    f.pct = 0; f.state = "jump"; f.inv = 2.4; f.stun = 0; f.airJ = 2; f.upB = false; f.shieldHp = 100;
    spawnInk(f.x, f.y + 1, SLOT_INK[f.slot], 14, 4);
  }

  // ── golpes: quien golpea lo detecta; la víctima (en su móvil) lo aplica ──
  function dealHit(att, vic, h) {
    const hh = { ...h, fromX: h.fromX ?? att.x, from: att.slot };
    const px = (att.x + vic.x) / 2, py = vic.y + FH * 0.6;
    if (vic.ctrl === "remote") {
      routeHit(vic.slot, hh);
      impactFx(px, py, h.ink || INK.RED, h.heavy);
      return;
    }
    const res = receiveHit(vic, hh);
    if (res === "parry") counterHit(vic, att);
  }
  function routeHit(to, h) {
    const msg = { t: "hit", to, d: h.dmg, b: h.base, gr: +h.grow.toFixed(1), a: h.ang, hv: h.heavy ? 1 : 0, fx: +h.fromX.toFixed(2), fr: h.from };
    if (net.isHost) { const f = F[to]; if (f && f.owner) net.sendTo(f.owner, msg); }
    else net.send(msg);
  }
  function receiveHit(v, h) {
    if (v.ctrl === "local" && v.inv <= 0 && v.starT <= 0) buzz(h.heavy ? 45 : 20);
    if (v.inv > 0 || v.starT > 0 || v.state === "dead" || phase !== "fight" || v.gone) return "miss";
    const px = (h.fromX + v.x) / 2, py = v.y + FH * 0.6;
    if (v.move && v.move.special && v.move.def.kind === "shield" && v.move.t < v.move.def.time) {
      sfx.parry(); burst(px, py, INK.BLUE, 12); floatText(v, "¡PARADA!", "blue"); M.freeze = 0.12;
      return "parry";
    }
    if (v.state === "shield") {
      v.shieldHp -= h.dmg * 1.5;
      v.vx = Math.sign(v.x - h.fromX || 1) * 3;
      sfx.block(); burst(px, py, INK.BLUE, 5); M.freeze = 0.04;
      if (v.shieldHp <= 0) breakShield(v);
      return "block";
    }
    v.pct = Math.min(999, v.pct + h.dmg);
    const kb = h.base + v.pct * h.grow / 100 * 0.13;
    const dir = Math.sign(v.x - h.fromX) || (h.from != null && F[h.from] ? F[h.from].facing : 1);
    const a = (h.ang * Math.PI) / 180;
    v.vx = Math.cos(a) * kb * dir;
    v.vy = Math.sin(a) * kb;
    if (h.spike && v.g) v.vy = kb * 0.35;
    if (v.vy > 0) v.g = false;
    v.move = null;
    v.ledge = 0;
    v.stun = 0.1 + kb * 0.035;
    v.state = kb > 9 ? "tumble" : "hurt";
    v.flash = 0.18;
    v.lastHit = h.from ?? -1; v.lastHitT = 4;
    v.upB = false;
    v.airJ = Math.max(v.airJ, 1);
    M.freeze = Math.max(M.freeze, Math.min(0.16, 0.03 + h.dmg * 0.006));
    impactFx(px, py, h.ink || INK.RED, h.heavy || kb > 12);
    floatText(v, `${Math.round(v.pct)}%`, kb > 12 ? "red" : "ink");
    if (kb > 16) { M.shake = Math.max(M.shake, 1); M.slow = 0.45; setTimeout(() => (M.slow = 1), 220); }
    return "hit";
  }
  function counterHit(def, att) {
    const h = { dmg: def.sp.dmg || 12, base: 7, grow: 80, ang: 40, heavy: true, fromX: def.x, from: def.slot, ink: INK.BLUE };
    if (att.ctrl === "remote") routeHit(att.slot, h);
    else receiveHit(att, h);
  }

  // ── proyectiles (especiales y objetos lanzados) ──
  function projMesh(shape, ink) {
    const g = new THREE.Group();
    const add = (geo, o, s, p) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...s); if (p) m.position.set(...p); g.add(m); return m; };
    if (shape === "calc") { add(GEO.box, { tone: 0.05 }, [0.45, 0.6, 0.12]); add(GEO.box, { fill: true }, [0.36, 0.14, 0.13], [0, 0.18, 0]); }
    else if (shape === "wave" || shape === "micro") { const r = add(GEO.torus, { fill: true }, [0.7, 0.7, 0.7]); r.rotation.y = Math.PI / 2; add(GEO.torus, { tone: 0.1 }, [0.45, 0.45, 0.45]).rotation.y = Math.PI / 2; }
    else if (shape === "broccoli") { add(GEO.sph, { tone: -0.05 }, [0.5, 0.5, 0.5], [0, 0.15, 0]); add(GEO.cyl, { tone: 0.2 }, [0.18, 0.35, 0.18], [0, -0.15, 0]); }
    else if (shape === "worker") { add(GEO.box, { tone: 0 }, [0.35, 0.55, 0.3], [0, 0.35, 0]); add(GEO.sph, { tone: 0.2 }, [0.3, 0.3, 0.3], [0, 0.8, 0]); add(GEO.box, { fill: true }, [0.05, 0.55, 0.05], [0.2, 0.9, 0]); }
    else if (shape === "stapler" || shape === "bomb") { scene.add(g); g.add(itemModel(shape === "stapler" ? "grapadora" : "bomba")); return g; }
    else if (shape === "slack") { // mensaje de Slack dibujado: bocadillo, logo de colores y líneas
      const pc = (ink2, o, s, p) => { const m = new THREE.Mesh(GEO.box, mat(ink2, o)); m.scale.set(...s); m.position.set(...p); g.add(m); };
      pc(INK.BLACK, { tone: 0.62 }, [0.9, 0.55, 0.08], [0, 0, 0]); pc(INK.BLACK, { tone: 0.62 }, [0.14, 0.12, 0.08], [-0.33, -0.3, 0]);
      const C4 = [INK.BLUE, INK.GREEN, INK.RED, INK.ORANGE];
      for (let k = 0; k < 4; k++) { const v = k % 2 === 0; pc(C4[k], { fill: true }, [v ? 0.05 : 0.2, v ? 0.2 : 0.05, 0.02], [-0.26 + (v ? (k ? 0.06 : -0.06) : 0), v ? 0 : (k === 1 ? 0.06 : -0.06), 0.05]); }
      pc(INK.BLACK, { tone: 0.2 }, [0.4, 0.06, 0.02], [0.12, 0.09, 0.05]); pc(INK.BLACK, { tone: 0.35 }, [0.28, 0.06, 0.02], [0.06, -0.07, 0.05]);
    }
    else add(GEO.box, { tone: 0.05 }, [0.5, 0.5, 0.5]);
    scene.add(g);
    return g;
  }
  function fireProjectile(f, d, net_) {
    const p = net_ || {
      id: `${f.slot}-${++atkSeq}`, owner: f.slot, shape: d.shape, ink: d.ink, dmg: d.dmg, base: d.base, grow: d.grow, ang: d.ang, boom: d.boom || 0,
      arc: !!d.arc, ground: !!d.ground, x: f.x + f.facing * 0.7, y: d.ground ? 0 : f.y + 1.1, vx: f.facing * d.speed, vy: d.arc ? d.vy : d.vy || 0, life: d.life || 2.5
    };
    p.mesh = projMesh(p.shape, p.ink);
    p.t = 0;
    projectiles.push(p);
    if (!net_ && online.on) { const { mesh, ...data } = p; tx({ t: "proj", p: data }); }
  }
  function explode(p) {
    sfx.boom();
    shockwave(p.x, p.y - 0.4, INK.ORANGE);
    M.shake = Math.max(M.shake, 1);
    const owner = F[p.owner];
    if (!owner || owner.ctrl === "remote") return;
    for (const o of F) {
      if (!alive(o) || o === owner) continue;
      if (Math.hypot(o.x - p.x, o.y + 1 - p.y) < p.boom) dealHit(owner, o, { dmg: p.dmg, base: p.base, grow: p.grow, ang: p.ang, heavy: true, ink: INK.ORANGE, fromX: p.x - Math.sign(o.x - p.x || 1) * 0.1 });
    }
  }
  function updateProjectiles(dt) {
    for (const p of projectiles) {
      p.t += dt;
      p.life -= dt;
      if (p.arc || p.shape === "stapler" || p.shape === "bomb") {
        p.vy -= (p.arc ? 18 : 14) * dt;
        const onMain = p.x > MAIN.x0 && p.x < MAIN.x1;
        if (onMain && p.y <= 0.25 && p.y > -0.5 && p.vy < 0) {
          if (p.boom) p.life = 0;
          else { p.y = 0.25; p.vy = -p.vy * 0.55; p.vx *= 0.8; spawnInk(p.x, 0.1, p.ink, 2, 2); }
        }
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.mesh.position.set(p.x, p.y + (p.ground ? Math.abs(Math.sin(p.t * 14)) * 0.12 : 0), FIGHT_Z);
      p.mesh.rotation.z += dt * ((p.arc || p.shape === "stapler" || p.shape === "bomb") ? -8 * Math.sign(p.vx) : 0);
      if (p.shape === "wave" || p.shape === "micro") p.mesh.scale.setScalar(1 + p.t * 1.6);
      if (p.shape === "worker") p.mesh.scale.x = Math.sign(p.vx) || 1;
      // sólo quien lo lanzó decide si impacta
      const owner = F[p.owner];
      if (owner && owner.ctrl !== "remote" && p.life > 0) {
        const r = { x0: p.x - 0.4, x1: p.x + 0.4, y0: p.y - 0.35, y1: p.y + 0.5 };
        for (const vic of F) {
          if (!alive(vic) || vic === owner || !overlaps(r, vic)) continue;
          p.life = 0;
          if (!p.boom) {
            const h = { dmg: p.dmg, base: p.base ?? 3.5, grow: p.grow ?? 45, ang: p.ang ?? 35, heavy: true, ink: p.ink, fromX: p.x - Math.sign(p.vx || 1) };
            if (vic.ctrl === "remote") dealHit(owner, vic, h);
            else {
              const res = receiveHit(vic, { ...h, from: owner.slot });
              if (res === "parry") { p.vx = -p.vx; p.owner = vic.slot; p.life = 1; }
            }
          }
          break;
        }
        if (online.on && p.life <= 0) tx({ t: "pgone", id: p.id });
      }
      if (Math.abs(p.x) > BLAST.x || p.y < BLAST.bottom) p.life = 0;
      if (p.life <= 0 && !p.dead) {
        p.dead = true;
        scene.remove(p.mesh);
        if (p.boom) explode(p); else burst(p.x, p.y, p.ink, 6);
      }
    }
    projectiles = projectiles.filter((p) => !p.dead);
  }

  // ── objetos que caen del cielo ──
  function itemModel(kind) {
    const g = new THREE.Group();
    const b = (w, h, d, x, y, z, ink, o = {}) => { const m = new THREE.Mesh(GEO.box, mat(ink, o)); m.scale.set(w, h, d); m.position.set(x, y, z); g.add(m); return m; };
    if (kind === "grapadora") { b(0.7, 0.18, 0.28, 0, 0, 0, INK.BLACK, { tone: 0.05 }); const top = b(0.72, 0.14, 0.3, 0.02, 0.2, 0, INK.RED, { tone: 0.05 }); top.rotation.z = 0.18; }
    else if (kind === "bomba") { for (let i = 0; i < 4; i++) { const m = b(0.5, 0.1, 0.5, 0, i * 0.11, 0, i % 2 ? INK.ORANGE : INK.RED, { tone: 0.1 }); m.rotation.y = i * 0.3; } b(0.04, 0.3, 0.04, 0, 0.55, 0, INK.BLACK, { fill: true }); }
    else if (kind === "boli") { const c = new THREE.Mesh(GEO.cyl, mat(INK.BLUE, { tone: 0.2 })); c.scale.set(0.2, 1.3, 0.2); c.rotation.z = 0.5; g.add(c); b(0.22, 0.3, 0.22, -0.3, 0.5, 0, INK.BLUE, { fill: true }).rotation.z = 0.5; }
    else if (kind === "cafe") { const c = new THREE.Mesh(GEO.cyl, mat(INK.ORANGE, { tone: 0.1 })); c.scale.set(0.45, 0.5, 0.45); g.add(c); const h = new THREE.Mesh(GEO.torus, mat(INK.ORANGE, { fill: true })); h.scale.setScalar(0.22); h.position.x = 0.3; g.add(h); b(0.42, 0.04, 0.42, 0, 0.26, 0, INK.BLACK, { fill: true }); }
    else if (kind === "focus") { const s = new THREE.Mesh(GEO.sph, mat(INK.ORANGE, { tone: -0.1 })); s.scale.setScalar(0.45); g.add(s); for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { fill: true })); c.scale.set(0.16, 0.34, 0.16); const a = (i / 5) * Math.PI * 2; c.position.set(Math.sin(a) * 0.32, Math.cos(a) * 0.32, 0); c.rotation.z = -a; g.add(c); } }
    return g;
  }
  function spawnItem(d) {
    const it = { id: d.id, kind: d.kind, x: d.x, y: d.y, vy: 0, g: false, t: 0, taken: false, life: 16 };
    it.mesh = itemModel(it.kind);
    it.mesh.scale.setScalar(1.3);
    scene.add(it.mesh);
    items.push(it);
    return it;
  }
  function removeItem(id) {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    it.taken = true;
    scene.remove(it.mesh);
    items = items.filter((i) => i !== it);
  }
  function updateItems(dt) {
    if (isAuthority() && phase === "fight") {
      M.itemT -= dt;
      if (M.itemT <= 0 && items.length < 3) {
        M.itemT = rnd(6, 10);
        const d = { id: ++itemSeq + (net.isHost ? 1000 : 0), kind: ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)], x: +rnd(MAIN.x0 + 1, MAIN.x1 - 1).toFixed(2), y: 11 };
        spawnItem(d);
        if (online.on) tx({ t: "item", ...d });
      }
    }
    for (const it of items) {
      it.t += dt;
      it.life -= dt;
      if (!it.g) {
        it.vy = Math.max(it.vy - 14 * dt, -9);
        const py = it.y;
        it.y += it.vy * dt;
        if (it.x > MAIN.x0 && it.x < MAIN.x1 && py >= 0.3 && it.y <= 0.3) { it.y = 0.3; it.g = true; }
        for (const p of PLATFORMS) if (it.x > p.x0 && it.x < p.x1 && py >= p.y + 0.3 && it.y <= p.y + 0.3) { it.y = p.y + 0.3; it.g = true; }
      }
      it.mesh.position.set(it.x, it.y + (it.g ? Math.sin(it.t * 3) * 0.08 : 0), FIGHT_Z);
      it.mesh.rotation.y += dt * 1.6;
      it.mesh.visible = it.life > 3 || Math.floor(it.life * 6) % 2 === 0;
      if (isAuthority() && (it.life <= 0 || it.y < BLAST.bottom)) { removeItem(it.id); if (online.on) tx({ t: "igone", id: it.id }); }
      // los de usar se cogen al pasar por encima
      if (!it.taken && ITEMS[it.kind].type === "use") {
        for (const f of F) if (alive(f) && f.ctrl !== "remote" && Math.abs(it.x - f.x) < 0.8 && it.y > f.y - 0.4 && it.y < f.y + FH) { requestItem(f, it); break; }
      }
    }
  }
  function requestItem(f, it) {
    if (it.taken || it.req) return;
    if (isAuthority()) grantItem(it.id, f.slot);
    else { it.req = true; setTimeout(() => (it.req = false), 600); net.send({ t: "take", id: it.id, s: f.slot }); }
  }
  function grantItem(id, slot) {
    const it = items.find((i) => i.id === id);
    if (!it || it.taken) return;
    const kind = it.kind;
    removeItem(id);
    if (online.on && net.isHost) tx({ t: "itake", id, s: slot, k: kind });
    const f = F[slot];
    if (f && f.ctrl !== "remote") applyItem(f, kind);
  }
  function applyItem(f, kind) {
    sfx.item();
    const d = ITEMS[kind];
    if (kind === "cafe") { f.pct = Math.max(0, f.pct - 25); floatText(f, "☕ -25%", "blue"); }
    else if (kind === "focus") { f.starT = 6; floatText(f, "⭐ ¡MODO FOCUS!", "blue"); }
    else if (kind === "boli") { f.boliT = 10; setItem(f, "boli"); floatText(f, "🖊️ ¡BOLI GIGANTE!", "blue"); }
    else setItem(f, kind);
    if (d.type === "throw") floatText(f, `${d.icon} ${d.name}`, "ink");
  }
  function setItem(f, kind) {
    f.item = kind;
    if (f.held) { scene.remove(f.held); f.held = null; }
    if (kind) { f.held = itemModel(kind); scene.add(f.held); }
  }
  function throwItem(f, inp) {
    const d = ITEMS[f.item];
    const up = inp.y > 0.55, down = inp.y < -0.55;
    if (Math.abs(inp.x) > 0.3) f.facing = Math.sign(inp.x);
    fireProjectile(f, { ...d, arc: false, speed: up ? 2 : down ? 4 : d.speed, vy: up ? 15 : down ? -6 : d.vy, life: 3 });
    setItem(f, null);
    f.state = "attack";
    f.move = { def: { name: "throw", start: 0, active: 0, rec: 0.18, box: [0, 0, 0, 0] }, special: false, t: 0, hits: new Set(), id: ++atkSeq };
    sfx.whoosh();
  }

  // ── efectos ──
  const particles = [];
  const decals = [];
  function spawnInk(x, y, ink, n, speed = 5) {
    for (let i = 0; i < n; i++) {
      let p = particles.find((q) => !q.alive);
      if (!p) {
        if (particles.length > 220) break;
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
    if (x < MAIN.x0 || x > MAIN.x1) return;
    const d = decals.length >= 40 ? decals.shift() : (() => { const m = new THREE.Mesh(GEO.disc, mat(ink, { fill: true })); m.rotation.x = -Math.PI / 2; scene.add(m); return m; })();
    d.material = mat(ink, { fill: true });
    d.position.set(x, 0.025 + decals.length * 0.0005, FIGHT_Z + rnd(-0.8, 0.8));
    d.scale.set(size * rnd(0.7, 1.3), size * rnd(0.6, 1.1), 1);
    d.rotation.z = rnd(0, Math.PI);
    decals.push(d);
  }
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
  function impactFx(x, y, ink, heavy) {
    sfx.hit(heavy);
    spark(x, y, ink, heavy);
    spawnInk(x, y, ink, heavy ? 14 : 7, heavy ? 7 : 4.5);
    if (heavy) spawnDecal(x, ink, 1.2);
    M.shake = Math.max(M.shake, heavy ? 0.6 : 0.25);
    M.hype = Math.min(1, M.hype + (heavy ? 0.3 : 0.12));
  }
  // K.O.: estallido de tinta en el borde por donde ha salido
  function koFx(f) {
    sfx.ko();
    const x = clamp(f.x, -BLAST.x + 3, BLAST.x - 3), y = clamp(f.y, BLAST.bottom + 3, BLAST.top - 3);
    for (let i = 0; i < 3; i++) spark(x, y, SLOT_INK[f.slot], true);
    spawnInk(x, y, SLOT_INK[f.slot], 40, 12);
    M.shake = Math.max(M.shake, 1.2);
    M.hype = 1;
    big(f.stocks > 0 ? "¡FUERA!" : "¡ELIMINADO!", `${f.cfg.name} ${f.stocks > 0 ? `· le quedan ${f.stocks}` : ""}`, 1.1, "ko");
  }
  const floatsEl = $(".cf-floats");
  const floats = [];
  function floatText(f, txt, color) {
    const el = document.createElement("div");
    el.className = `cf-float ${color || ""}`;
    el.textContent = txt;
    floatsEl.appendChild(el);
    floats.push({ el, x: f.x + rnd(-0.3, 0.3), y: f.y + FH + 0.3, t: 0 });
  }
  const _v = new THREE.Vector3();
  function toScreen(x, y) {
    _v.set(x, y, FIGHT_Z).project(camera);
    return [(_v.x * 0.5 + 0.5) * root.clientWidth, (-_v.y * 0.5 + 0.5) * root.clientHeight];
  }
  function updateFx(dt) {
    for (const p of particles) {
      if (!p.alive) continue;
      p.life -= dt;
      p.vel.y -= 16 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      if (p.mesh.position.y <= 0.02 && p.mesh.position.y > -0.3) {
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
    for (const fl of floats) {
      fl.t += dt;
      fl.y += dt * 1.4;
      const [sx, sy] = toScreen(fl.x, fl.y);
      fl.el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -50%) scale(${1 + Math.max(0, 0.25 - fl.t) * 2})`;
      fl.el.style.opacity = String(Math.max(0, 1 - Math.max(0, fl.t - 0.5) / 0.4));
      if (fl.t > 0.9) fl.el.remove();
    }
    for (let i = floats.length - 1; i >= 0; i--) if (floats[i].t > 0.9) floats.splice(i, 1);
  }

  // ── rivales online: interpolados a partir de sus estados ──
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
      const ahead = clamp((rt - last.ts) / 1000, 0, 0.15);
      s = { ...last, x: last.x + last.vx * ahead, y: last.y + last.vy * ahead };
    }
    f.prevY = f.y;
    f.x = s.x; f.y = s.y; f.vx = s.vx; f.vy = s.vy; f.facing = s.f; f.g = !!s.g;
    if (s.pct > f.pct) f.flash = 0.15;
    f.pct = s.pct; f.stocks = s.stk; f.state = s.st; f.pose = s.p; f.starT = s.star ? 1 : 0; f.boliT = s.it === "boli" ? 1 : 0;
    f.shieldHp = s.sh ?? 100;
    if ((s.it || null) !== f.item) setItem(f, s.it || null);
  }

  // ── pegatina, burbuja del escudo, objeto en la mano y etiqueta P1..P4 ──
  function poseFor(f) {
    const s = f.sticker;
    if (f.state === "dead") return "idle";
    if (f.state === "hurt" || f.state === "tumble" || f.state === "broken") return "damage";
    if (f.state === "shield" || f.state === "counter") return s.hasPose("block") ? "block" : s.hasPose("shield") ? "shield" : "idle";
    if (f.state === "attack" || f.state === "special") return "attack";
    if (f.state === "win") return s.hasPose("victory") ? "victory" : "attack";
    if (f.state === "ledge") return s.hasPose("block") ? "block" : "jump";
    if (!f.g) return "jump";
    if (Math.abs(f.vx) > 5.5) return "run";
    if (Math.abs(f.vx) > 0.4) return "walk";
    return "idle";
  }
  const _p = new THREE.Vector3();
  function drawFighter(f, dt) {
    const dead = f.state === "dead" || f.gone;
    f.sticker.setVisible(!dead && !(f.inv > 0.4 && f.state !== "ledge" && Math.floor(f.inv * 14) % 2));
    f.shadow.visible = !dead;
    const pose = f.ctrl === "remote" ? f.pose || "idle" : poseFor(f);
    f.pose = pose;
    f.flash -= dt;
    const tilt = f.state === "tumble" ? (performance.now() / 90) % (Math.PI * 2) : f.state === "hurt" ? -f.facing * 0.15 : f.state === "roll" ? f.rollDir * 0.5 : 0;
    const squash = f.state === "shield" ? 0.93 : f.squash;
    f.sticker.update(dt, {
      pos: _p.set(f.x, f.y, FIGHT_Z), camera, moveX: 0, facing: f.facing, speed: Math.abs(f.vx) * (f.g ? 1 : 0), onGround: f.g,
      firing: false, pose, hurt: f.flash > 0 || f.starT > 0 ? 1 : 0, tilt, squash
    });
    f.sticker.pivot.rotation.y = 0;
    // burbuja del escudo (encoge con la vida del escudo)
    f.bubble.visible = !dead && (f.state === "shield" || f.state === "counter");
    if (f.bubble.visible) { f.bubble.position.set(f.x, f.y + 1, FIGHT_Z); f.bubble.scale.setScalar(0.9 + 1.4 * (f.shieldHp / 100)); }
    // objeto en la mano
    if (f.held) {
      f.held.visible = !dead;
      f.held.position.set(f.x + f.facing * 0.55, f.y + 1.1, FIGHT_Z + 0.3);
      f.held.rotation.z = f.item === "boli" ? -f.facing * (f.state === "attack" ? 1.6 : 0.6) : 0;
      f.held.scale.setScalar(f.item === "boli" ? 1.7 : 1.1);
    }
    let gy = f.x > MAIN.x0 && f.x < MAIN.x1 ? 0 : -99;
    for (const p of PLATFORMS) if (f.x > p.x0 && f.x < p.x1 && f.y >= p.y - 0.01) gy = Math.max(gy, p.y);
    const lift = clamp(1 - (f.y - gy) / 4, 0.3, 1);
    f.shadow.visible = !dead && gy > -99;
    f.shadow.position.set(f.x, gy + 0.03, FIGHT_Z);
    f.shadow.scale.set(1.3 * lift, 0.55 * lift, 1);
    // etiqueta encima de la cabeza
    if (!f.tag) {
      f.tag = document.createElement("div");
      f.tag.className = `sb-tag s${f.slot}`;
      f.tag.textContent = f.slot === meSlot && f.ctrl === "local" ? "TÚ" : f.ctrl === "cpu" || (f.ctrl === "remote" && f.isCpu) ? `CPU` : SLOT_NAME[f.slot];
      floatsEl.appendChild(f.tag);
    }
    const [sx, sy] = toScreen(clamp(f.x, -BLAST.x + 1, BLAST.x - 1), clamp(f.y + FH + 0.55, BLAST.bottom + 1, BLAST.top - 1));
    f.tag.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -100%)`;
    f.tag.style.opacity = dead ? "0" : "1";
  }

  // ── cámara: encuadra a todos los que siguen vivos ──
  const camPos = new THREE.Vector3(0, 4, 18), camLook = new THREE.Vector3(0, 1.4, 0);
  function updateCamera(dt) {
    const list = F.filter((f) => f && !f.gone && f.state !== "dead");
    let x0 = -4, x1 = 4, y0 = 0, y1 = 3;
    if (list.length) {
      x0 = Math.min(...list.map((f) => f.x)); x1 = Math.max(...list.map((f) => f.x));
      y0 = Math.min(0, ...list.map((f) => f.y)); y1 = Math.max(...list.map((f) => f.y + FH));
    }
    x0 = Math.max(x0, -BLAST.x + 2); x1 = Math.min(x1, BLAST.x - 2);
    y0 = Math.max(y0, BLAST.bottom + 2); y1 = Math.min(y1, BLAST.top - 1);
    const midX = (x0 + x1) / 2, midY = (y0 + y1) / 2;
    const vf = THREE.MathUtils.degToRad(camera.fov);
    const hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    let dist = Math.max(((x1 - x0) / 2 + 3) / Math.tan(hf / 2), ((y1 - y0) / 2 + 2.6) / Math.tan(vf / 2));
    dist = clamp(dist, 12, 30);
    const lx = clamp(midX, -7, 7), ly = clamp(midY + 0.6, 1.2, 8);
    camLook.lerp(_p.set(lx, ly, FIGHT_Z), Math.min(1, dt * 4));
    camPos.lerp(_p.set(lx * 0.9, ly + 1.2 + dist * 0.08, FIGHT_Z + dist), Math.min(1, dt * 3));
    const sh = M.shake ** 2 * 0.35;
    M.shake = Math.max(0, M.shake - dt * 2.8);
    camera.position.set(camPos.x + rnd(-sh, sh), camPos.y + rnd(-sh, sh), camPos.z);
    camera.lookAt(camLook);
  }

  // ── HUD estilo Smash: tarjeta con porcentaje y vidas de cada luchador ──
  const cardsEl = $(".sb-cards"), bigEl = $(".cf-big"), smallEl = $(".cf-small"), timerEl = $(".sb-timer span"), pingEl = $(".cf-ping");
  let bigT = 0, cards = [];
  function big(txt, sub, dur, cls) {
    bigEl.textContent = txt;
    smallEl.textContent = sub || "";
    bigEl.className = `cf-big show ${cls || ""}`;
    void bigEl.offsetWidth;
    bigEl.classList.add("pop");
    bigT = dur;
  }
  function setupHud() {
    cardsEl.innerHTML = F.map((f) => {
      const av = getCharacterAvatar(f.cid);
      const who = f.ctrl === "local" ? "TÚ" : f.ctrl === "cpu" || f.isCpu ? "CPU" : SLOT_NAME[f.slot];
      return `<div class="sb-card s${f.slot}${f.ctrl === "local" ? " me" : ""}">
        <div class="sb-av">${av ? `<img src="${av}" class="${av.startsWith("data:") ? "px" : ""}" alt="">` : f.cfg.emoji}</div>
        <div class="sb-info"><div class="sb-pct">0<small>%</small></div><div class="sb-name">${esc(f.cfg.name.split(" ")[0])} · ${who}</div><div class="sb-stocks">${"<i></i>".repeat(STOCKS)}</div></div>
        <div class="sb-item"></div>
      </div>`;
    }).join("");
    cards = [...cardsEl.children].map((el) => ({ el, pct: el.querySelector(".sb-pct"), stocks: el.querySelectorAll(".sb-stocks i"), item: el.querySelector(".sb-item"), last: -1 }));
  }
  function pctColor(p) {
    const k = clamp(p / 150, 0, 1);
    return `hsl(${Math.round(48 - k * 48)}, ${Math.round(20 + k * 70)}%, ${Math.round(30 + (1 - Math.abs(k - 0.4)) * 10)}%)`;
  }
  function updateHud(dt) {
    F.forEach((f, i) => {
      const c = cards[i];
      if (!f || !c) return;
      const p = Math.round(f.pct);
      if (p !== c.last) {
        c.pct.innerHTML = `${p}<small>%</small>`;
        c.pct.style.color = pctColor(p);
        if (p > c.last && c.last >= 0) { c.pct.classList.remove("bump"); void c.pct.offsetWidth; c.pct.classList.add("bump"); }
        c.last = p;
      }
      c.stocks.forEach((s, k) => s.classList.toggle("on", f.stocks > k));
      c.el.classList.toggle("out", f.stocks <= 0 || f.gone);
      c.item.textContent = f.starT > 0 ? "⭐" : f.item ? ITEMS[f.item].icon : "";
    });
    let tleft = MATCH_TIME;
    if (phase === "fight") tleft = Math.max(0, MATCH_TIME - (hostNow() - M.fightAt) / 1000);
    else if (phase === "over") tleft = M.frozenTime ?? MATCH_TIME;
    timerEl.textContent = `${Math.floor(tleft / 60)}:${String(Math.floor(tleft % 60)).padStart(2, "0")}`;
    timerEl.parentElement.classList.toggle("low", phase === "fight" && tleft < 15);
    pingEl.textContent = online.on && screen === "match" ? `📶 ${Math.round(clock.rtt)} ms` : "";
    bigT -= dt;
    if (bigT <= 0) bigEl.classList.remove("show");
    smallEl.style.opacity = bigT > 0 ? "1" : "0";
  }

  // ── partida ──
  // slots: [{ c: personaje, id: peerId | null, cpu: bool }]
  function beginMatch(slots, at) {
    F.forEach(disposeFighter);
    projectiles.forEach((p) => scene.remove(p.mesh));
    items.forEach((i) => scene.remove(i.mesh));
    projectiles = []; items = [];
    const n = slots.length;
    F = slots.map((s, i) => {
      let ctrl, owner = s.id;
      if (mode === "cpu") ctrl = i === 0 ? "local" : "cpu";
      else if (s.cpu) { ctrl = net.isHost ? "cpu" : "remote"; owner = net.hostId; }
      else ctrl = s.id === net.myId ? "local" : "remote";
      const f = mkFighter(i, s.c, ctrl, owner, n);
      f.isCpu = !!s.cpu || (mode === "cpu" && i > 0);
      return f;
    });
    meSlot = Math.max(0, F.findIndex((f) => f.ctrl === "local"));
    M.events = []; M.out = []; M.itemT = 7; M.frozenTime = null; M.slow = 1;
    screen = "match";
    paused = false;
    showOv(null);
    $(".cf-hud").classList.remove("hidden");
    setupHud();
    audio.init();
    audio.startMusic("pelea");
    phase = "intro";
    M.fightAt = at + 2400;
    schedule(at, () => { big("3", "", 0.7); sfx.beep(false); });
    schedule(at + 800, () => { big("2", "", 0.7); sfx.beep(false); });
    schedule(at + 1600, () => { big("1", "", 0.7); sfx.beep(false); });
    schedule(at + 2400, () => { phase = "fight"; big("¡A PELEAR!", "", 0.9, "go"); sfx.beep(true); });
    syncPad();
  }
  // el árbitro (CPU local o anfitrión) decide cuándo termina
  function referee() {
    if (!isAuthority() || phase !== "fight" || F.length < 2) return;
    const left = F.filter((f) => !f.gone && f.stocks > 0);
    const t = (hostNow() - M.fightAt) / 1000;
    if (left.length > 1 && t < MATCH_TIME) return;
    let order;
    if (left.length <= 1) order = [...left.map((f) => f.slot), ...M.out.slice().reverse(), ...F.filter((f) => f.gone && !M.out.includes(f.slot)).map((f) => f.slot)];
    else order = F.slice().sort((a, b) => (b.stocks - a.stocks) || (a.pct - b.pct)).map((f) => f.slot);
    const stats = F.map((f) => [f.kos, f.falls]);
    const msg = { t: "end", order, stats };
    if (online.on) tx(msg);
    matchEnded(msg);
  }
  function matchEnded(m) {
    if (phase === "over") return;
    phase = "over";
    M.frozenTime = Math.max(0, MATCH_TIME - (hostNow() - M.fightAt) / 1000);
    const w = F[m.order[0]];
    if (w && w.ctrl !== "remote") { w.state = "win"; w.move = null; }
    big("¡SE ACABÓ!", w ? `Gana ${w.cfg.name}` : "", 2, "ko");
    sfx.ko();
    M.slow = 0.4;
    setTimeout(() => (M.slow = 1), 900);
    setTimeout(() => showResults(m), 2200);
  }
  function showResults(m) {
    screen = "end";
    const iWon = m.order[0] === meSlot;
    iWon ? audio.victory() : audio.lose();
    $(".cf-end-kicker").textContent = mode === "cpu" ? `CONTRA ${F.length - 1} CPU` : "ONLINE";
    $(".cf-end-title").textContent = iWon ? "¡Has ganado la pelea!" : `Gana ${F[m.order[0]]?.cfg.name || "—"}`;
    $(".sb-results").innerHTML = m.order.map((slot, pos) => {
      const f = F[slot];
      if (!f) return "";
      const [kos, falls] = m.stats[slot] || [f.kos, f.falls];
      const av = getCharacterAvatar(f.cid);
      return `<li class="s${slot}${f.ctrl === "local" ? " me" : ""}"><b class="sb-pos">${pos + 1}º</b>${av ? `<img src="${av}" class="${av.startsWith("data:") ? "px" : ""}" alt="">` : f.cfg.emoji}<span>${esc(f.cfg.name)}${f.ctrl === "local" ? " (tú)" : f.isCpu ? " (CPU)" : ""}</span><small>💥 ${kos} · 💨 ${falls}</small></li>`;
    }).join("");
    const again = $(".cf-again");
    again.disabled = mode === "online" && !net.isHost;
    again.textContent = again.disabled ? "Esperando al anfitrión…" : "Revancha";
    showOv("end");
    syncPad();
    {
      // puntos aunque no ganes: KOs, vidas que te quedan y puesto
      const me = F[meSlot], place = m.order.indexOf(meSlot) + 1, rivals = F.length - 1;
      const pts = (iWon ? 1500 + rivals * 800 : Math.max(0, (F.length - place) * 300)) + me.kos * 300 + me.stocks * 400;
      if (onScore && pts > 0) try { onScore(Math.min(9000, pts), { won: iWon, kos: me.kos, falls: me.falls, rivals, place }, iWon ? (me.stocks >= 3 ? "S" : me.stocks === 2 ? "A" : "B") : ""); } catch (e) {}
    }
    if (mode === "cpu" && iWon && onVictory) {
      const me = F[meSlot];
      const score = 1500 + (F.length - 1) * 800 + me.kos * 300 + me.stocks * 400;
      try { onVictory(score, me.stocks >= 3 ? "S" : me.stocks === 2 ? "A" : "B"); } catch (e) {}
    }
  }

  // ── bucle de simulación ──
  function stepSim(dt) {
    const now = hostNow();
    if (M.events.length) {
      const due = M.events.filter((e) => e.at <= now);
      if (due.length) { M.events = M.events.filter((e) => e.at > now); due.forEach((e) => e.fn()); }
    }
    if (screen !== "match" && screen !== "end") return;
    if (M.freeze > 0) { M.freeze -= dt; return; }
    const sdt = dt * M.slow;
    const local = paused ? NO_INPUT : readLocal();
    for (const f of F) {
      if (f.ctrl === "local") updateFighter(f, local, sdt);
      else if (f.ctrl === "cpu") updateFighter(f, cpuInput(f, sdt), sdt);
      else updateRemote(f);
    }
    // no se atraviesan (empujón suave)
    for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++) {
      const a = F[i], b = F[j];
      if (!alive(a) || !alive(b)) continue;
      const dx = b.x - a.x;
      if (Math.abs(dx) < 0.7 && Math.abs(a.y - b.y) < 1.2 && a.g && b.g) {
        const push = (0.7 - Math.abs(dx)) / 2 * (dx >= 0 ? 1 : -1);
        if (a.ctrl !== "remote") a.x -= push * 0.5;
        if (b.ctrl !== "remote") b.x += push * 0.5;
      }
    }
    updateProjectiles(sdt);
    updateItems(sdt);
    referee();
    M.hype = Math.max(0.2, M.hype - dt * 0.25);
  }

  function netTick(dt) {
    if (!online.on) return;
    const now = performance.now();
    online.pingT -= dt;
    if (online.pingT <= 0) { online.pingT = 0.7; tx({ t: "ping", c: now }); }
    if (screen !== "match" && screen !== "end") return;
    online.sendT -= dt;
    if (online.sendT <= 0) {
      online.sendT = 1 / SEND_HZ;
      for (const f of F) {
        if (f.ctrl === "remote") continue;
        tx({
          t: "st", s: f.slot, ts: Math.round(hostNow()), x: +f.x.toFixed(3), y: +f.y.toFixed(3), vx: +f.vx.toFixed(2), vy: +f.vy.toFixed(2),
          f: f.facing, g: f.g ? 1 : 0, pct: Math.round(f.pct), stk: f.stocks, st: f.state, p: f.pose, it: f.item || 0, star: f.starT > 0 ? 1 : 0, sh: Math.round(f.shieldHp)
        });
      }
    }
    // sin noticias de alguien en 6 s → fuera
    if (screen === "match") {
      for (const [id, t] of online.lastRx) {
        if (now - t < 6000) continue;
        if (net.isHost) dropPeer(id);
        else if (id === net.hostId) peerGone("Se ha perdido la conexión con el anfitrión.");
      }
    }
  }

  // ── mensajes de red ──
  const lobby = { status: $(".cf-status"), room: $(".cf-room"), row: $(".cf-lobbyrow"), code: $(".cf-code"), codeBig: $(".cf-codebig"), roster: $(".sb-roster"), go: $(".cf-go"), lping: $(".cf-lping"), addCpu: $(".sb-addcpu") };
  const setStatus = (t, err) => { lobby.status.textContent = t; lobby.status.classList.toggle("err", !!err); };
  function renderRoom() {
    lobby.room.classList.toggle("hidden", !online.on);
    lobby.row.classList.toggle("hidden", online.on);
    $(".cf-cpu").disabled = online.on;
    lobby.codeBig.textContent = net.code || "";
    lobby.roster.innerHTML = Array.from({ length: MAX_F }, (_, i) => {
      const s = online.slots[i];
      if (!s) return `<span class="sb-slot empty s${i}">${SLOT_NAME[i]} · libre</span>`;
      const c = charById(s.c);
      const me = s.id === net.myId && !s.cpu;
      return `<span class="sb-slot s${i}${me ? " me" : ""}" data-i="${i}">${SLOT_NAME[i]} ${c.emoji} ${esc(c.name.split(" ")[0])}${s.cpu ? " 🤖" : me ? " (tú)" : ""}${s.id === net.hostId && !s.cpu ? " ⭐" : ""}${s.cpu && net.isHost ? ' <b class="sb-x">✕</b>' : ""}</span>`;
    }).join("");
    lobby.roster.querySelectorAll(".sb-x").forEach((x) => x.addEventListener("click", (e) => { const i = Number(e.target.closest(".sb-slot").dataset.i); online.slots.splice(i, 1); pushRoom(); }));
    lobby.go.disabled = !(online.on && net.isHost && online.slots.length >= 2);
    lobby.go.textContent = net.isHost ? "¡A pelear!" : "Esperando al anfitrión…";
    lobby.addCpu.classList.toggle("hidden", !net.isHost || online.slots.length >= MAX_F);
    lobby.lping.textContent = online.on && online.slots.length > 1 ? `📶 ${Math.round(clock.rtt)} ms` : "";
  }
  function pushRoom() { if (net.isHost) net.broadcast({ t: "room", slots: online.slots }); renderRoom(); }
  lobby.addCpu.addEventListener("click", () => {
    if (!net.isHost || online.slots.length >= MAX_F) return;
    const used = new Set(online.slots.map((s) => s.c));
    const pool = CHARS.filter((c) => !used.has(c.id));
    online.slots.push({ c: (pool[Math.floor(Math.random() * pool.length)] || CHARS[0]).id, id: null, cpu: true });
    pushRoom();
  });

  net.on("ping", (m, from) => { online.lastRx.set(from, performance.now()); (net.isHost ? net.sendTo(from, { t: "pong", c: m.c, h: performance.now() }) : net.send({ t: "pong", c: m.c, h: performance.now() })); });
  net.on("pong", (m, from) => {
    online.lastRx.set(from, performance.now());
    const now = performance.now();
    const rtt = now - m.c;
    clock.rtt = clock.rtt ? clock.rtt * 0.7 + rtt * 0.3 : rtt;
    if (!net.isHost) {
      clock.samples.push({ rtt, off: m.h + rtt / 2 - now });
      if (clock.samples.length > 10) clock.samples.shift();
      clock.offset = clock.samples.reduce((a, b) => (b.rtt < a.rtt ? b : a)).off;
    }
    if (screen === "lobby") renderRoom();
  });
  // anfitrión: alguien entra o cambia de personaje
  net.on("hello", (m, from) => {
    online.lastRx.set(from, performance.now());
    if (!net.isHost) return;
    if (screen !== "lobby") { net.sendTo(from, { t: "busy" }); return; }
    const s = online.slots.find((x) => x.id === from);
    if (s) s.c = m.c;
    else {
      const cpuAt = online.slots.findIndex((x) => x.cpu);
      if (online.slots.length >= MAX_F && cpuAt >= 0) online.slots.splice(cpuAt, 1); // una persona sustituye a una CPU
      if (online.slots.length >= MAX_F) { net.sendTo(from, { t: "full" }); return; }
      online.slots.push({ c: m.c, id: from, cpu: false });
      audio.init(); audio.pickup();
      setStatus("¡Se ha unido un compañero!");
    }
    pushRoom();
  });
  net.on("room", (m) => { if (net.isHost) return; online.slots = m.slots; setStatus("En la sala. Espera a que el anfitrión empiece."); renderRoom(); });
  net.on("busy", () => { setStatus("La sala está en plena pelea. Prueba en un momento.", true); leaveRoom(); });
  net.on("full", () => { setStatus("La sala está llena (4 luchadores).", true); leaveRoom(); });
  net.on("match", (m) => { if (!net.isHost) beginMatch(m.slots, m.at); });
  net.on("end", (m) => { if (!net.isHost) matchEnded(m); });
  net.on("tolobby", () => { if (!net.isHost) endToLobby(); });

  // relevo: el anfitrión reenvía a los demás lo que le llega de un invitado
  const relay = (m, from) => { if (net.isHost && RELAY.has(m.t)) net.broadcast(m, from); };
  net.on("st", (m, from) => {
    online.lastRx.set(from, performance.now());
    relay(m, from);
    const f = F[m.s];
    if (!f || f.ctrl !== "remote") return;
    f.buf.push(m);
    if (f.buf.length > 30) f.buf.shift();
  });
  net.on("mv", (m, from) => { relay(m, from); sfx.whoosh(); });
  net.on("hit", (m) => {
    const f = F[m.to];
    if (!f || screen !== "match") return;
    if (f.ctrl === "remote") { if (net.isHost && f.owner) net.sendTo(f.owner, m); return; } // el anfitrión lo pasa a su dueño
    const res = receiveHit(f, { dmg: m.d, base: m.b, grow: m.gr, ang: m.a, heavy: !!m.hv, spike: m.a < 0, fromX: m.fx, from: m.fr });
    if (res === "parry" && F[m.fr]) counterHit(f, F[m.fr]);
  });
  net.on("proj", (m, from) => { relay(m, from); if (screen === "match") fireProjectile(F[m.p.owner], null, { ...m.p }); });
  net.on("pgone", (m, from) => { relay(m, from); for (const p of projectiles) if (p.id === m.id) p.life = 0; });
  net.on("ko", (m, from) => {
    relay(m, from);
    const f = F[m.s];
    if (!f || f.ctrl !== "remote") return;
    f.stocks = m.stk; f.falls++;
    f.x = m.x; f.y = m.y;
    if (m.by >= 0 && F[m.by]) F[m.by].kos++;
    if (f.stocks <= 0) M.out.push(f.slot);
    koFx(f);
  });
  net.on("item", (m) => { if (!net.isHost && screen === "match") spawnItem(m); });
  net.on("igone", (m) => { if (!net.isHost) removeItem(m.id); });
  net.on("take", (m) => { if (net.isHost) grantItem(m.id, m.s); });
  net.on("itake", (m) => {
    if (net.isHost) return;
    removeItem(m.id);
    const f = F[m.s];
    if (f && f.ctrl !== "remote") applyItem(f, m.k);
  });
  net.on("gone", (m) => { const f = F[m.s]; if (f) { f.gone = true; f.stocks = 0; } });
  net.on("_leave", (m, from) => {
    if (net.isHost) dropPeer(from);
    else peerGone("El anfitrión ha cerrado la sala.");
  });

  function dropPeer(id) {
    online.lastRx.delete(id);
    if (screen === "lobby") { online.slots = online.slots.filter((s) => s.id !== id || s.cpu); pushRoom(); setStatus("Un compañero ha salido de la sala."); return; }
    const f = F.find((x) => x.owner === id && !x.isCpu);
    if (f && !f.gone) { f.gone = true; f.stocks = 0; M.out.push(f.slot); net.broadcast({ t: "gone", s: f.slot }); big("¡Se ha ido!", `${f.cfg.name} se ha desconectado`, 1.4); }
    online.slots = online.slots.filter((s) => s.id !== id || s.cpu);
  }
  function peerGone(msg) {
    const inMatch = screen === "match" || screen === "end";
    leaveRoom();
    if (inMatch) endToLobby();
    setStatus(msg, true);
  }

  // ── sala online ──
  $(".cf-create").addEventListener("click", async () => {
    setStatus("Creando sala…");
    try {
      await net.host(randomCode());
      online.on = true; clock.offset = 0; online.lastRx.clear();
      mode = "online";
      online.slots = [{ c: myChar, id: net.myId, cpu: false }];
      renderRoom();
      setStatus("Comparte el código. Añade CPUs si sois pocos.");
    } catch (err) { setStatus(err.message, true); }
  });
  async function joinRoom() {
    const code = cleanCode(lobby.code.value);
    if (code.length !== 5) return setStatus("El código tiene 5 letras.", true);
    setStatus(`Buscando la sala ${code}…`);
    try {
      await net.join(code);
      online.on = true; clock.samples = []; online.lastRx.clear();
      mode = "online";
      online.slots = [];
      online.lastRx.set(net.hostId, performance.now());
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
    online.on = false; online.slots = []; online.lastRx.clear();
    clock.offset = 0; clock.samples = []; clock.rtt = 0;
    mode = "cpu";
    renderRoom();
  }
  $(".cf-leave").addEventListener("click", () => { leaveRoom(); setStatus(""); });
  function hostStartMatch() {
    if (!online.on || !net.isHost || online.slots.length < 2) return;
    const at = hostNow() + 400;
    const slots = online.slots.map((s) => ({ ...s }));
    net.broadcast({ t: "match", slots, at });
    beginMatch(slots, at);
  }
  lobby.go.addEventListener("click", hostStartMatch);

  // ── elección de luchador y número de CPUs ──
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
    if (online.on) {
      const s = online.slots.find((x) => x.id === net.myId && !x.cpu);
      if (s) s.c = myChar;
      if (net.isHost) pushRoom(); else tx({ t: "hello", c: myChar });
    }
    renderRoom();
  }
  root.querySelectorAll(".cf-arrow").forEach((b) => b.addEventListener("click", () => {
    pickIdx = (pickIdx + Number(b.dataset.d) + CHARS.length) % CHARS.length;
    renderPick();
    audio.init();
    audio.tone({ freq: 700, dur: 0.05, type: "triangle", gain: 0.08 });
    if (onPickChar) try { onPickChar(myChar); } catch (e) {}
  }));
  renderPick();
  root.querySelectorAll(".sb-diff button").forEach((b) => b.addEventListener("click", () => {
    diff = DIFFS[Number(b.dataset.d)];
    root.querySelectorAll(".sb-diff button").forEach((x) => x.classList.toggle("on", x === b));
    audio.init(); audio.tone({ freq: 500 + Number(b.dataset.d) * 200, dur: 0.05, type: "triangle", gain: 0.08 });
  }));
  root.querySelectorAll(".sb-seg:not(.sb-diff) button").forEach((b) => b.addEventListener("click", () => {
    cpuCount = Number(b.dataset.n);
    root.querySelectorAll(".sb-seg:not(.sb-diff) button").forEach((x) => x.classList.toggle("on", x === b));
    audio.init();
    audio.tone({ freq: 600 + cpuCount * 120, dur: 0.05, type: "triangle", gain: 0.08 });
  }));
  function cpuSlots() {
    const used = new Set([myChar]);
    const slots = [{ c: myChar, id: null, cpu: false }];
    for (let i = 0; i < cpuCount; i++) {
      const pool = CHARS.filter((c) => !used.has(c.id));
      const c = pool[Math.floor(Math.random() * pool.length)] || CHARS[i];
      used.add(c.id);
      slots.push({ c: c.id, id: null, cpu: true });
    }
    return slots;
  }
  $(".cf-cpu").addEventListener("click", () => {
    if (online.on) return;
    mode = "cpu";
    beginMatch(cpuSlots(), hostNow() + 200);
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
    $(".cf-pause-note").textContent = mode === "online" ? "La pelea sigue: los demás no se pausan." : "";
    showOv("pause");
    syncPad();
  }
  function resume() {
    if (!paused) return;
    paused = false;
    if (mode === "cpu") {
      const d = hostNow() - pausedAt;
      M.fightAt += d;
      M.events.forEach((e) => (e.at += d));
    }
    showOv(null);
    syncPad();
  }
  function endToLobby() {
    F.forEach(disposeFighter);
    F = [];
    projectiles.forEach((p) => scene.remove(p.mesh));
    items.forEach((i) => scene.remove(i.mesh));
    projectiles = []; items = [];
    screen = "lobby"; phase = "idle"; paused = false;
    M.events = [];
    cardsEl.innerHTML = "";
    $(".cf-hud").classList.add("hidden");
    showOv("lobby");
    renderRoom();
    syncPad();
  }
  $(".cf-resume").addEventListener("click", resume);
  $(".cf-quit").addEventListener("click", () => { if (online.on) leaveRoom(); endToLobby(); });
  $(".cf-again").addEventListener("click", () => {
    if (mode === "cpu") beginMatch(F.map((f) => ({ c: f.cid, id: null, cpu: f.isCpu })), hostNow() + 200);
    else hostStartMatch();
  });
  $(".cf-tolobby").addEventListener("click", () => { if (online.on && net.isHost) net.broadcast({ t: "tolobby" }); endToLobby(); });
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
  root.addEventListener("pointerdown", () => { audio.init(); audio.resume(); }, { capture: true });
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  const touchPad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "punch", label: "GOLPE", icon: ICON.punch, accent: "red" },
      { id: "jump", label: "SALTA", icon: ICON.jump },
      { id: "special", label: "ESPECIAL", icon: ICON.special, accent: "blue" },
      { id: "block", label: "ESCUDO", icon: ICON.block }
    ],
    isActive: () => screen === "match" && !paused,
    onAction: (id, down) => { tp[id] = down; }
  }) : null;
  function syncPad() {
    const portrait = document.body.classList.contains("gameboy-mode");
    if (touchPad) touchPad.setVisible(isTouch && !portrait && screen === "match" && !paused);
    root.classList.toggle("dd-landpad", isTouch && !portrait);
  }

  function pollGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    let g = null;
    for (const p of pads) if (p && p.connected) { g = p; break; }
    if (!g) { Object.assign(gp, { x: 0, y: 0, jump: false, punch: false, special: false, block: false }); return; }
    const b = (i) => !!(g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.4));
    const ax = Math.abs(g.axes[0] || 0) > 0.25 ? g.axes[0] : 0;
    const ay = Math.abs(g.axes[1] || 0) > 0.25 ? -g.axes[1] : 0;
    gp.x = ax + (b(15) ? 1 : 0) - (b(14) ? 1 : 0);
    gp.y = ay + (b(12) ? 1 : 0) - (b(13) ? 1 : 0);
    gp.jump = b(0);
    gp.punch = b(2);
    gp.special = b(3) || b(1);
    gp.block = b(4) || b(5) || b(6) || b(7);
    if (b(9) && !gp.prev[9] && screen === "match") paused ? resume() : pause();
    gp.prev[9] = b(9);
  }

  const relabels = [];
  for (const [sel, txt] of [["#gbLabelA", "GOLPE"], ["#gbLabelB", "ESPECIAL"]]) {
    const el = document.querySelector(sel);
    if (el) { relabels.push([el, el.textContent]); el.textContent = txt; }
  }

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
      camPos.lerp(_p.set(Math.sin(wall * 0.25) * 5, 4.4, FIGHT_Z + 17), 0.03);
      camLook.lerp(_p.set(Math.sin(wall * 0.25) * 2, 1.8, 0), 0.05);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
    } else updateCamera(dt);
    stage.update(dt, wall, M.hype);
    updateHud(dt);
    const me = F[meSlot];
    R.render(scene, camera, { time: wall, hurt: me && me.flash > 0 ? 0.35 : 0, lowHp: me && me.pct > 120 && phase === "fight" ? 0.6 : 0, flash: 0 }, overlay);
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
    F.forEach(disposeFighter);
    if (touchPad) touchPad.destroy();
    audio.destroy();
    R.dispose();
    root.remove();
    if (window.__fight) delete window.__fight;
  }
  function exit() { destroy(); if (onExit) onExit(); }

  if (import.meta.env && import.meta.env.DEV) window.__fight = { get F() { return F; }, M, net, online, get items() { return items; }, get screen() { return screen; }, get phase() { return phase; } };

  showOv("lobby");
  return { destroy, exit };
}
