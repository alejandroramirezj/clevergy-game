import Matter from "matter-js";
import { saveWorldProgress } from "../config/worlds.js";
import { sfx } from "../engine/audio.js";
import { GameState } from "./state.js";

const { Engine, World, Bodies, Body, Composite, Events } = Matter;

// ==========================================================================
// ANGRY CLEVERGY — MATTER.JS PHYSICS ENGINE
// ==========================================================================

// ---- Canvas refs (set by initAngryBirds) ----
let cv = null;
let ctx = null;
let exitCb = null;

// ---- Physics ----
let engine = null;
let mWorld = null;

// ---- The one preloaded bird image (Alejandro Mosca) ----
const birdImg = new Image();
birdImg.src = "/sprites/alejandro_bird.png";

// ---- Slingshot ----
const SL = {
  x: 0, y: 0,       // anchor (computed on startLevel)
  px: 0, py: 0,     // pull point
  dragging: false,
  maxPull: 85,
  bird: null         // active Matter body
};

// ---- Game state ----
export const ABState = {
  phase: "aiming",   // aiming | flying | settling | done
  score: 0,
  settle: 0,
  abilityUsed: false,
  queue: [],         // hero descriptors waiting
  blocks: [],        // Matter bodies with .meta
  pigs: [],          // Matter bodies with .meta
  particles: [],
  floaters: [],
  stars: 0,
  pigsLeft: 0,
  pigsTotal: 0
};

// ---- Cleanup ----
let removeListeners = null;

// ==========================================================================
// PUBLIC API
// ==========================================================================

export function initAngryBirds(canvas, context, onExit) {
  cv = canvas;
  ctx = context;
  exitCb = onExit;
  startLevel();
  addListeners();
}

export function startLevel() {
  // Reset Matter world
  if (engine) { World.clear(mWorld); Engine.clear(engine); }
  engine = Engine.create({ gravity: { x: 0, y: 2.5 } });
  mWorld = engine.world;
  Events.on(engine, "collisionStart", onCollision);

  // Reset state
  ABState.phase = "aiming";
  ABState.score = 0;
  ABState.settle = 0;
  ABState.abilityUsed = false;
  ABState.particles = [];
  ABState.floaters = [];
  ABState.blocks = [];
  ABState.pigs = [];

  // Hero queue — one bird per character, 4 total
  ABState.queue = [
    { id: "alejandro", name: "Alejandro R.", ability: "speed", color: "#ff4d5e" },
    { id: "ale",       name: "Ale Gracía",   ability: "bomb",  color: "#ffc857" },
    { id: "paloma",    name: "Paloma",        ability: "split", color: "#59d8ff" },
    { id: "beltran",   name: "Beltrán",       ability: "heavy", color: "#42f584" }
  ];

  // Slingshot anchor (left third of screen)
  const W = GameState.W || 960;
  const H = GameState.H || 540;
  const gy = groundY();

  SL.x = W * 0.14;
  SL.y = gy - 55;
  SL.px = SL.x;
  SL.py = SL.y;
  SL.dragging = false;
  SL.bird = null;

  // Ground static body
  const ground = Bodies.rectangle(W / 2, gy + 25, W * 4, 50, {
    isStatic: true, friction: 0.9, restitution: 0.0,
    label: "ground"
  });
  World.add(mWorld, ground);

  buildFortress(W, gy);
  loadNextBird();
}

// ==========================================================================
// FORTRESS BUILDER
// ==========================================================================

function buildFortress(W, gy) {
  const mk = (x, y, w, h, type) => {
    const cfg = {
      wood:  { hp: 32,  col: "#b07e44", stroke: "#664118", label: "JIRA",  score: 500,  fr: 0.7, rest: 0.15 },
      glass: { hp: 12,  col: "#9ee6ff", stroke: "#59d8ff", label: "404",   score: 750,  fr: 0.4, rest: 0.25 },
      stone: { hp: 80,  col: "#38415c", stroke: "#1f2436", label: "RACK",  score: 1000, fr: 0.9, rest: 0.05 },
      tnt:   { hp: 6,   col: "#ff1744", stroke: "#fff",    label: "MERGE", score: 2500, fr: 0.6, rest: 0.3,  tnt: true }
    }[type];

    const b = Bodies.rectangle(x, y, w, h, {
      friction: cfg.fr, restitution: cfg.rest, density: 0.002,
      label: type
    });
    b.meta = { type, w, h, hp: cfg.hp, maxHp: cfg.hp, col: cfg.col, stroke: cfg.stroke, label: cfg.label, score: cfg.score, tnt: !!cfg.tnt };
    World.add(mWorld, b);
    ABState.blocks.push(b);
  };

  const pig = (x, y, r, kind) => {
    const boss = kind === "boss";
    const hp = boss ? 60 : kind === "micro" ? 28 : 15;
    const score = boss ? 15000 : kind === "micro" ? 7500 : 5000;
    const b = Bodies.circle(x, y, r, {
      friction: 0.8, restitution: 0.3, density: 0.003,
      label: "pig"
    });
    b.meta = { kind, r, hp, maxHp: hp, score, isPig: true };
    World.add(mWorld, b);
    ABState.pigs.push(b);
  };

  // Scale towers to canvas width
  const sx = W / 960; // scale factor

  // ── Tower 1: FIREWALL (wood + glass) ───────────────────────
  const t1 = 520 * sx;
  mk(t1 - 24 * sx, gy - 40, 14 * sx, 80, "wood");
  mk(t1 + 24 * sx, gy - 40, 14 * sx, 80, "wood");
  mk(t1,           gy - 85, 70 * sx, 12, "wood");
  pig(t1, gy - 18, 14 * sx, "basic");

  mk(t1 - 17 * sx, gy - 120, 12 * sx, 56, "glass");
  mk(t1 + 17 * sx, gy - 120, 12 * sx, 56, "glass");
  mk(t1,           gy - 152, 52 * sx, 12, "glass");
  pig(t1, gy - 100, 13 * sx, "basic");

  // ── Tower 2: SERVER CORE (stone + TNT "MERGE A PROD") ──────
  const t2 = 670 * sx;
  mk(t2 - 36 * sx, gy - 50, 18 * sx, 100, "stone");
  mk(t2 + 36 * sx, gy - 50, 18 * sx, 100, "stone");
  mk(t2,           gy - 27, 28 * sx, 28,  "tnt");     // 💥 MERGE A PROD!
  mk(t2,           gy - 107, 98 * sx, 16, "stone");
  pig(t2, gy - 130, 17 * sx, "micro");

  mk(t2 - 25 * sx, gy - 165, 14 * sx, 70, "wood");
  mk(t2 + 25 * sx, gy - 165, 14 * sx, 70, "wood");
  mk(t2,           gy - 205, 76 * sx, 14, "wood");

  // ── Tower 3: LEGACY MONOLITH (boss peak) ───────────────────
  const t3 = 820 * sx;
  mk(t3 - 25 * sx, gy - 60,  16 * sx, 120, "stone");
  mk(t3 + 25 * sx, gy - 60,  16 * sx, 120, "stone");
  mk(t3,           gy - 128, 76 * sx, 16,  "stone");
  mk(t3 - 17 * sx, gy - 178, 14 * sx, 88,  "glass");
  mk(t3 + 17 * sx, gy - 178, 14 * sx, 88,  "glass");
  mk(t3,           gy - 228, 60 * sx, 14,  "stone");
  pig(t3, gy - 254, 22 * sx, "boss");

  ABState.pigsTotal = ABState.pigs.length;
  ABState.pigsLeft  = ABState.pigsTotal;
}

// ==========================================================================
// BIRD LOADING
// ==========================================================================

function loadNextBird() {
  if (ABState.queue.length === 0) {
    if (ABState.pigsLeft > 0) ABState.phase = "done";
    return;
  }

  const hero = ABState.queue.shift();
  const r = hero.id === "alejandro" ? 22 : 18;
  const b = Bodies.circle(SL.x, SL.y, r, {
    isStatic: true,           // held in slingshot
    restitution: 0.3,
    friction: 0.5,
    density: 0.004,
    label: "bird"
  });
  b.hero = hero;
  b.r = r;
  b.trail = [];
  World.add(mWorld, b);

  SL.bird = b;
  SL.px = SL.x;
  SL.py = SL.y;
  ABState.abilityUsed = false;
  ABState.phase = "aiming";
}

// ==========================================================================
// INPUT
// ==========================================================================

function toVirtual(clientX, clientY) {
  const rect = cv.getBoundingClientRect();
  const vW = GameState.W || 960;
  const vH = GameState.H || 540;
  return {
    x: (clientX - rect.left) * (vW / rect.width),
    y: (clientY - rect.top)  * (vH / rect.height)
  };
}

function addListeners() {
  if (removeListeners) removeListeners();

  const onDown = (cx, cy) => {
    const p = toVirtual(cx, cy);
    const W = GameState.W || 960;

    // Mapa button (top center)
    if (p.x > W / 2 - 60 && p.x < W / 2 + 60 && p.y > 8 && p.y < 50) {
      if (exitCb) exitCb();
      return;
    }
    // Restart on done screen
    if (ABState.phase === "done") { startLevel(); return; }
    // Mid-air ability tap
    if (ABState.phase === "flying" && !ABState.abilityUsed && SL.bird) {
      fireAbility(SL.bird);
      return;
    }
    // Start drag
    if (ABState.phase !== "aiming" || !SL.bird) return;
    const dx = p.x - SL.x, dy = p.y - SL.y;
    if (Math.hypot(dx, dy) < 80) {
      SL.dragging = true;
      movePull(p.x, p.y);
    }
  };

  const onMove = (cx, cy) => {
    if (!SL.dragging || ABState.phase !== "aiming") return;
    movePull(...Object.values(toVirtual(cx, cy)));
  };

  const onUp = () => {
    if (!SL.dragging || ABState.phase !== "aiming" || !SL.bird) return;
    SL.dragging = false;
    const dist = Math.hypot(SL.x - SL.px, SL.y - SL.py);
    if (dist < 14) { resetPull(); return; }
    launch();
  };

  const md = e => onDown(e.clientX, e.clientY);
  const mm = e => onMove(e.clientX, e.clientY);
  const mu = () => onUp();
  const td = e => { if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY); };
  const tm = e => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); };
  const tu = () => onUp();

  window.addEventListener("mousedown",  md);
  window.addEventListener("mousemove",  mm);
  window.addEventListener("mouseup",    mu);
  window.addEventListener("touchstart", td, { passive: true });
  window.addEventListener("touchmove",  tm, { passive: true });
  window.addEventListener("touchend",   tu);

  removeListeners = () => {
    window.removeEventListener("mousedown",  md);
    window.removeEventListener("mousemove",  mm);
    window.removeEventListener("mouseup",    mu);
    window.removeEventListener("touchstart", td);
    window.removeEventListener("touchmove",  tm);
    window.removeEventListener("touchend",   tu);
  };
}

function movePull(px, py) {
  let dx = px - SL.x, dy = py - SL.y;
  const d = Math.hypot(dx, dy);
  if (d > SL.maxPull) { dx = dx / d * SL.maxPull; dy = dy / d * SL.maxPull; }
  if (dx > 12) dx = 12;  // no pulling forward
  SL.px = SL.x + dx;
  SL.py = SL.y + dy;
  Body.setPosition(SL.bird, { x: SL.px, y: SL.py });
}

function resetPull() {
  SL.px = SL.x; SL.py = SL.y;
  if (SL.bird) Body.setPosition(SL.bird, { x: SL.x, y: SL.y });
}

function launch() {
  const b = SL.bird;
  Body.setStatic(b, false);
  const power = 0.2;
  Body.setVelocity(b, {
    x: (SL.x - SL.px) * power,
    y: (SL.y - SL.py) * power
  });
  Body.setAngularVelocity(b, (SL.x - SL.px) * 0.01);
  b.launched = true;
  ABState.phase = "flying";

  sfx(680, 0.1, "triangle", 0.07);
  ABState.floaters.push({
    x: SL.x + 20, y: SL.y - 40,
    txt: `${b.hero.name} LAUNCH!`, col: "#59d8ff", t: 1.4, vy: -0.6
  });
}

// ==========================================================================
// HERO ABILITIES
// ==========================================================================

function fireAbility(b) {
  ABState.abilityUsed = true;
  const a = b.hero.ability;

  if (a === "speed") {
    Body.setVelocity(b, { x: b.velocity.x * 2.5, y: b.velocity.y * 0.3 });
    Body.setAngularVelocity(b, 0.3);
    boom(b.position.x, b.position.y, 50, "#ff4d5e", false);
    ABState.floaters.push({ x: b.position.x, y: b.position.y - 30, txt: "🥊 SUPER MOSCA PUNCH!", col: "#ff4d5e", t: 1.5, vy: -0.7 });
    sfx(1100, 0.2, "sawtooth", 0.08);

  } else if (a === "bomb") {
    boom(b.position.x, b.position.y, 140, "#ff4d5e", true);
    World.remove(mWorld, b);
    SL.bird = null;
    ABState.phase = "settling";
    ABState.settle = 1.8;
    ABState.floaters.push({ x: b.position.x, y: b.position.y - 30, txt: "💥 FLUSH CACHE!", col: "#ffc857", t: 1.5, vy: -0.7 });
    sfx(90, 0.5, "square", 0.12);

  } else if (a === "split") {
    ["#59d8ff", "#ffffff", "#99f0ff"].forEach((col, i) => {
      const sb = Bodies.circle(b.position.x, b.position.y, 13, {
        restitution: 0.3, friction: 0.5, density: 0.003, label: "bird"
      });
      sb.hero = { ...b.hero, id: `split_${i}` };
      sb.r = 13;
      sb.trail = [];
      Body.setVelocity(sb, {
        x: b.velocity.x * 1.05,
        y: b.velocity.y + (i - 1) * 4.5
      });
      World.add(mWorld, sb);
      extraBirds.push(sb);
    });
    boom(b.position.x, b.position.y, 35, "#59d8ff", false);
    ABState.floaters.push({ x: b.position.x, y: b.position.y - 30, txt: "☕ MULTI-THREAD x3!", col: "#59d8ff", t: 1.5, vy: -0.7 });
    sfx(1000, 0.15, "square", 0.06);

  } else if (a === "heavy") {
    Body.setVelocity(b, { x: 0, y: 18 });
    boom(b.position.x, b.position.y, 50, "#ffd700", false);
    ABState.floaters.push({ x: b.position.x, y: b.position.y - 30, txt: "🛡️ ZERO-DOWNTIME SLAM!", col: "#ffd700", t: 1.5, vy: -0.7 });
    sfx(180, 0.3, "sawtooth", 0.1);
  }
}

const extraBirds = [];

// ==========================================================================
// EXPLOSION / BOOM
// ==========================================================================

function boom(x, y, radius, col, applyForce) {
  // Shockwave particle
  ABState.particles.push({ x, y, r: 5, maxR: radius, col, shockwave: true, t: 0.4 });

  // Debris
  for (let i = 0; i < 22; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 3 + Math.random() * 7;
    ABState.particles.push({
      x, y,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      col: i % 2 === 0 ? col : "#fff8",
      size: 3 + Math.random() * 4, t: 0.5 + Math.random() * 0.4
    });
  }

  if (!applyForce) return;

  for (const b of Composite.allBodies(mWorld)) {
    if (b.isStatic) continue;
    const dx = b.position.x - x, dy = b.position.y - y;
    const d = Math.hypot(dx, dy);
    if (d < radius && d > 1) {
      const f = (1 - d / radius) * 0.08;
      Body.applyForce(b, b.position, {
        x: (dx / d) * f,
        y: (dy / d) * f - 0.015
      });
      if (b.meta) b.meta.hp -= 60 * (1 - d / radius);
    }
  }

  sfx(100, 0.4, "square", 0.1);
}

// ==========================================================================
// COLLISIONS
// ==========================================================================

function onCollision(evt) {
  for (const { bodyA, bodyB } of evt.pairs) {
    const rv = Math.hypot(
      bodyA.velocity.x - bodyB.velocity.x,
      bodyA.velocity.y - bodyB.velocity.y
    );
    if (rv < 2) continue;
    const dmg = rv * 6;
    if (bodyA.meta) bodyA.meta.hp -= dmg;
    if (bodyB.meta) bodyB.meta.hp -= dmg;

    // Chain-detonate TNT
    for (const bdy of [bodyA, bodyB]) {
      if (bdy.meta?.tnt && !bdy.meta.detonated && bdy.meta.hp <= bdy.meta.maxHp * 0.5) {
        bdy.meta.detonated = true;
        setTimeout(() => boom(bdy.position.x, bdy.position.y, 130, "#ff4d5e", true), 80);
      }
    }

    if (rv > 5) sfx(200, 0.06, "square", 0.05);
  }
}

// ==========================================================================
// UPDATE LOOP
// ==========================================================================

export function updateAngryBirds(dt) {
  if (!engine) return;

  Engine.update(engine, 1000 / 60);

  const W = GameState.W || 960;
  const gy = groundY();

  // Track launched bird
  const bird = SL.bird;
  if (bird && bird.launched) {
    if (Math.random() < 0.4) {
      bird.trail.push({ x: bird.position.x, y: bird.position.y });
      if (bird.trail.length > 30) bird.trail.shift();
    }
    const spd = Math.hypot(bird.velocity.x, bird.velocity.y);
    const oob = bird.position.x > W + 80 || bird.position.x < -80 || bird.position.y > gy + 100;
    if ((spd < 0.5 && bird.position.y > gy - 40) || oob) {
      if (ABState.phase === "flying") {
        ABState.phase = "settling";
        ABState.settle = 1.8;
      }
    }
  }

  // Extra (split) birds
  for (let i = extraBirds.length - 1; i >= 0; i--) {
    const eb = extraBirds[i];
    if (Math.random() < 0.3) {
      eb.trail = eb.trail || [];
      eb.trail.push({ x: eb.position.x, y: eb.position.y });
      if (eb.trail.length > 20) eb.trail.shift();
    }
    const oob = eb.position.x > W + 80 || eb.position.y > gy + 100;
    if (oob) { World.remove(mWorld, eb); extraBirds.splice(i, 1); }
  }

  // Destroy dead blocks / pigs
  for (let i = ABState.blocks.length - 1; i >= 0; i--) {
    const b = ABState.blocks[i];
    if (b.meta?.hp <= 0) { killBody(b); ABState.blocks.splice(i, 1); }
  }
  for (let i = ABState.pigs.length - 1; i >= 0; i--) {
    const p = ABState.pigs[i];
    if (p.meta?.hp <= 0) { killBody(p); ABState.pigs.splice(i, 1); }
  }

  ABState.pigsLeft = ABState.pigs.length;

  // Particles / floaters
  for (let i = ABState.particles.length - 1; i >= 0; i--) {
    const p = ABState.particles[i];
    p.t -= dt;
    if (p.shockwave) p.r += 6;
    else { p.x += p.vx || 0; p.y += p.vy || 0; }
    if (p.t <= 0) ABState.particles.splice(i, 1);
  }
  for (let i = ABState.floaters.length - 1; i >= 0; i--) {
    const f = ABState.floaters[i];
    f.t -= dt; f.y += f.vy || -0.6;
    if (f.t <= 0) ABState.floaters.splice(i, 1);
  }

  // Settling → next bird or end
  if (ABState.phase === "settling") {
    ABState.settle -= dt;
    if (ABState.settle <= 0) {
      if (ABState.pigsLeft === 0) {
        endGame(true);
      } else if (ABState.queue.length > 0) {
        loadNextBird();
      } else {
        endGame(false);
      }
    }
  }
}

function killBody(b) {
  const m = b.meta;
  ABState.score += m.score;
  ABState.floaters.push({
    x: b.position.x, y: b.position.y - 15,
    txt: `+${m.score.toLocaleString()}`,
    col: m.isPig ? "#42f584" : "#ffc857",
    t: 1.2, vy: -0.5
  });
  sfx(m.isPig ? 500 : 180, 0.1, "triangle", 0.06);
  for (let k = 0; k < (m.isPig ? 12 : 7); k++) {
    ABState.particles.push({
      x: b.position.x, y: b.position.y,
      vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 5 - 1,
      col: m.col || "#b07e44", size: 2 + Math.random() * 4, t: 0.5 + Math.random() * 0.4
    });
  }
  World.remove(mWorld, b);
}

function endGame(won) {
  if (ABState.phase === "done") return;
  ABState.phase = "done";
  if (won) {
    ABState.score += ABState.queue.length * 10000;
    ABState.stars = ABState.score >= 50000 ? 3 : ABState.score >= 25000 ? 2 : 1;
    saveWorldProgress(6, ABState.score, ABState.stars === 3 ? "S" : ABState.stars === 2 ? "A" : "B");
    sfx(587, 0.12); sfx(784, 0.12); sfx(988, 0.25);
  }
}

// ==========================================================================
// RENDERER
// ==========================================================================

export function drawAngryBirds(context) {
  const W = GameState.W || 960;
  const H = GameState.H || 540;
  const gy = groundY();

  // ── Sky gradient ──────────────────────────────────────────────────
  const sky = context.createLinearGradient(0, 0, 0, gy);
  sky.addColorStop(0,   "#07101e");
  sky.addColorStop(0.7, "#112039");
  sky.addColorStop(1,   "#1a3558");
  context.fillStyle = sky;
  context.fillRect(0, 0, W, H);

  // Server building silhouettes
  context.fillStyle = "rgba(8, 20, 38, 0.6)";
  for (let i = 0; i < 8; i++) {
    const bx = i * 180 + 30;
    context.fillRect(bx,      gy - 160, 100, 160);
    context.fillRect(bx - 20, gy - 110, 140, 110);
  }

  // ── Ground ───────────────────────────────────────────────────────
  context.fillStyle = "#0a1525";
  context.fillRect(0, gy, W, H - gy);
  context.strokeStyle = "#59d8ff";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(0, gy); context.lineTo(W, gy);
  context.stroke();

  // Circuit traces
  context.strokeStyle = "rgba(89,216,255,0.18)";
  context.lineWidth = 1.5;
  for (let i = 0; i < W; i += 55) {
    context.beginPath();
    context.moveTo(i, gy);
    context.lineTo(i + 18, gy + 35);
    context.lineTo(i + 48, gy + 35);
    context.stroke();
  }

  // ── Trajectory ───────────────────────────────────────────────────
  if (SL.dragging && SL.bird) {
    const pw = 0.2;
    let tx = SL.x, ty = SL.y;
    let tvx = (SL.x - SL.px) * pw;
    let tvy = (SL.y - SL.py) * pw;
    context.fillStyle = "rgba(89,216,255,0.7)";
    for (let i = 0; i < 24; i++) {
      tx += tvx; ty += tvy;
      tvy += engine.gravity.y * 0.04;
      if (i % 2 === 0) {
        context.beginPath();
        context.arc(tx, ty, 3, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  // ── Slingshot ─────────────────────────────────────────────────────
  drawSlingshot(context);

  // ── Waiting birds ─────────────────────────────────────────────────
  for (let i = 0; i < ABState.queue.length; i++) {
    const h = ABState.queue[i];
    const qx = SL.x - 55 - i * 36;
    const qy = gy - 18;
    context.save();
    context.translate(qx, qy);
    drawHero(context, h, 13);
    context.restore();
  }

  // ── Active bird trail ─────────────────────────────────────────────
  if (SL.bird?.trail) {
    context.fillStyle = "rgba(89,216,255,0.3)";
    for (const pt of SL.bird.trail) {
      context.beginPath();
      context.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      context.fill();
    }
  }
  for (const eb of extraBirds) {
    if (eb.trail) {
      context.fillStyle = "rgba(89,216,255,0.2)";
      for (const pt of eb.trail) {
        context.beginPath();
        context.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  // ── Slingshot front ───────────────────────────────────────────────
  drawSlingshotFront(context);

  // ── Blocks ───────────────────────────────────────────────────────
  for (const b of ABState.blocks) drawBlock(context, b);
  for (const p of ABState.pigs)   drawPig(context, p);

  // ── Active bird ──────────────────────────────────────────────────
  if (SL.bird) drawBird(context, SL.bird);
  for (const eb of extraBirds) drawBird(context, eb);

  // ── Particles & floaters ─────────────────────────────────────────
  for (const p of ABState.particles) {
    if (p.shockwave) {
      context.strokeStyle = p.col;
      context.lineWidth = 4 * (p.t / 0.4);
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.stroke();
    } else {
      context.fillStyle = p.col;
      context.fillRect(p.x, p.y, p.size || 4, p.size || 4);
    }
  }
  for (const f of ABState.floaters) {
    context.fillStyle = f.col;
    context.font = "bold 13px monospace";
    context.textAlign = "center";
    context.fillText(f.txt, f.x, f.y);
  }

  // ── HUD ──────────────────────────────────────────────────────────
  drawHUD(context, W, H);
}

// ==========================================================================
// DRAW HELPERS
// ==========================================================================

function groundY() {
  return (GameState.H || 540) - 72;
}

function drawSlingshot(context) {
  const ax = SL.x, ay = SL.y;
  const lp = { x: ax - 15, y: ay - 44 };
  const rp = { x: ax + 15, y: ay - 44 };
  const px = SL.px, py = SL.py;

  // Back band (renders behind bird)
  context.strokeStyle = "#00cfff";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(rp.x, rp.y);
  context.lineTo(px + 7, py);
  context.stroke();
}

function drawSlingshotFront(context) {
  const ax = SL.x, ay = SL.y;
  const lp = { x: ax - 15, y: ay - 44 };
  const rp = { x: ax + 15, y: ay - 44 };
  const px = SL.px, py = SL.py;

  // Frame
  context.fillStyle = "#1a2e54";
  context.fillRect(ax - 5, ay - 26, 10, 30);
  context.fillStyle = "#263d72";
  context.fillRect(lp.x - 4, lp.y, 8, 28);
  context.fillRect(rp.x - 4, rp.y, 8, 28);

  // Front band
  context.strokeStyle = "#00cfff";
  context.lineWidth = 5;
  context.beginPath();
  context.moveTo(lp.x, lp.y);
  context.lineTo(px - 7, py);
  context.stroke();

  // Pouch
  context.fillStyle = "#0e1c38";
  context.beginPath();
  context.arc(px, py, 12, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#00cfff";
  context.lineWidth = 2;
  context.stroke();
}

function drawHero(context, hero, radius) {
  // Only Alejandro has a custom sprite
  if (hero.id === "alejandro" && birdImg.complete && birdImg.naturalWidth > 0) {
    const s = radius * 2.5;
    context.drawImage(birdImg, -s / 2, -s / 2, s, s);
    return;
  }

  // Cartoon bird for others
  context.fillStyle = hero.color || "#ff4d5e";
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.6)";
  context.lineWidth = 1.5;
  context.stroke();

  // Beak
  context.fillStyle = "#ff9800";
  context.beginPath();
  context.moveTo(radius * 0.25, -radius * 0.18);
  context.lineTo(radius * 0.92, 0);
  context.lineTo(radius * 0.25, radius * 0.18);
  context.fill();

  // Eye
  context.fillStyle = "#fff";
  context.beginPath();
  context.arc(radius * 0.12, -radius * 0.28, radius * 0.3, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#111";
  context.beginPath();
  context.arc(radius * 0.2, -radius * 0.28, radius * 0.13, 0, Math.PI * 2);
  context.fill();
}

function drawBird(context, body) {
  context.save();
  context.translate(body.position.x, body.position.y);
  context.rotate(body.angle);
  drawHero(context, body.hero, body.r);

  // Glow when ability ready
  if (ABState.phase === "flying" && !ABState.abilityUsed) {
    context.strokeStyle = body.hero?.color || "#59d8ff";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(0, 0, body.r + 5, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
}

function drawBlock(context, body) {
  const m = body.meta;
  if (!m) return;
  context.save();
  context.translate(body.position.x, body.position.y);
  context.rotate(body.angle);

  context.fillStyle = m.col;
  context.fillRect(-m.w / 2, -m.h / 2, m.w, m.h);
  context.strokeStyle = m.stroke;
  context.lineWidth = 2;
  context.strokeRect(-m.w / 2, -m.h / 2, m.w, m.h);

  // Label
  if (m.w > 22 && m.h > 14) {
    context.fillStyle = "#fff";
    context.font = "bold 9px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(m.label, 0, 0);
  }

  // Damage cracks
  if (m.hp < m.maxHp * 0.6) {
    context.strokeStyle = "rgba(0,0,0,0.5)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(-m.w * 0.3, -m.h * 0.3);
    context.lineTo(0, 0);
    context.lineTo(m.w * 0.3, m.h * 0.3);
    context.stroke();
  }

  context.restore();
}

function drawPig(context, body) {
  const m = body.meta;
  if (!m) return;
  context.save();
  context.translate(body.position.x, body.position.y);
  context.rotate(body.angle);

  const r = m.r;

  // Body
  context.fillStyle = m.kind === "boss" ? "#22c55e" : m.kind === "micro" ? "#16a34a" : "#22c55e";
  context.beginPath();
  context.arc(0, 0, r, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#15803d";
  context.lineWidth = 2;
  context.stroke();

  // Boss crown
  if (m.kind === "boss") {
    context.fillStyle = "#ffd700";
    context.beginPath();
    context.moveTo(-r * 0.65, -r * 0.65);
    context.lineTo(-r * 0.65, -r * 1.25);
    context.lineTo(-r * 0.15, -r * 0.9);
    context.lineTo(0, -r * 1.35);
    context.lineTo(r * 0.15, -r * 0.9);
    context.lineTo(r * 0.65, -r * 1.25);
    context.lineTo(r * 0.65, -r * 0.65);
    context.fill();
  }

  // Micromanager tie
  if (m.kind === "micro") {
    context.fillStyle = "#ff4d5e";
    context.beginPath();
    context.moveTo(-4, r * 0.6);
    context.lineTo(4, r * 0.6);
    context.lineTo(2.5, r + 11);
    context.lineTo(0, r + 15);
    context.lineTo(-2.5, r + 11);
    context.fill();
  }

  // Snout
  context.fillStyle = "#4ade80";
  context.beginPath();
  context.ellipse(0, r * 0.25, r * 0.42, r * 0.3, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#166534";
  context.fillRect(-r * 0.22, r * 0.18, r * 0.14, r * 0.18);
  context.fillRect(r * 0.08,  r * 0.18, r * 0.14, r * 0.18);

  // Eyes
  context.fillStyle = "#fff";
  context.beginPath();
  context.arc(-r * 0.28, -r * 0.18, r * 0.24, 0, Math.PI * 2);
  context.arc( r * 0.28, -r * 0.18, r * 0.24, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#000";
  context.beginPath();
  context.arc(-r * 0.24, -r * 0.18, r * 0.1, 0, Math.PI * 2);
  context.arc( r * 0.24, -r * 0.18, r * 0.1, 0, Math.PI * 2);
  context.fill();

  // Damage tint
  if (m.hp < m.maxHp * 0.5) {
    context.fillStyle = "rgba(255,0,0,0.25)";
    context.beginPath();
    context.arc(0, 0, r, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawHUD(context, W, H) {
  // Left: mode info
  context.fillStyle = "rgba(5,12,28,0.88)";
  roundRect(context, 12, 12, 260, 48, 8);
  context.fill();
  context.strokeStyle = "#59d8ff";
  context.lineWidth = 1;
  roundRect(context, 12, 12, 260, 48, 8);
  context.stroke();

  context.fillStyle = "#59d8ff";
  context.font = "bold 13px monospace";
  context.textAlign = "left";
  context.fillText("🎯 HOTFIX CATAPULT", 24, 32);
  context.fillStyle = "#ffc857";
  context.font = "10px monospace";
  context.fillText(`BUGS: ${ABState.pigsLeft}/${ABState.pigsTotal}`, 24, 50);

  // Right: score
  context.fillStyle = "rgba(5,12,28,0.88)";
  roundRect(context, W - 170, 12, 158, 48, 8);
  context.fill();
  context.strokeStyle = "#59d8ff";
  context.lineWidth = 1;
  roundRect(context, W - 170, 12, 158, 48, 8);
  context.stroke();

  context.fillStyle = "#b6f542";
  context.font = "bold 16px monospace";
  context.textAlign = "right";
  context.fillText(`${ABState.score.toLocaleString()}`, W - 20, 34);
  context.fillStyle = "#9fb4e8";
  context.font = "9px monospace";
  context.fillText("PUNTUACIÓN", W - 20, 50);

  // Center: MAPA button
  context.fillStyle = "rgba(12,25,60,0.92)";
  roundRect(context, W / 2 - 54, 12, 108, 34, 8);
  context.fill();
  context.strokeStyle = "#59d8ff";
  context.lineWidth = 1;
  roundRect(context, W / 2 - 54, 12, 108, 34, 8);
  context.stroke();
  context.fillStyle = "#fff";
  context.font = "bold 12px monospace";
  context.textAlign = "center";
  context.fillText("🗺️ MAPA", W / 2, 33);

  // Mid-air ability prompt
  if (ABState.phase === "flying" && !ABState.abilityUsed && SL.bird) {
    context.fillStyle = "rgba(5,12,28,0.80)";
    roundRect(context, W / 2 - 165, H - 60, 330, 36, 8);
    context.fill();
    const a = { speed: "🥊 SUPER MOSCA PUNCH", bomb: "💥 FLUSH CACHE (BOMBA)", split: "☕ MULTI-THREAD x3", heavy: "🛡️ ZERO-DOWNTIME SLAM" }[SL.bird.hero.ability];
    context.fillStyle = SL.bird.hero.color || "#fff";
    context.font = "bold 13px monospace";
    context.textAlign = "center";
    context.fillText(`¡TOCA PARA ACTIVAR! ${a}`, W / 2, H - 38);
  }

  // End screen overlays
  if (ABState.phase === "done") {
    const won = ABState.pigsLeft === 0;
    drawEndModal(context, W, H, won);
  }
}

function drawEndModal(context, W, H, won) {
  context.fillStyle = "rgba(4,9,22,0.88)";
  context.fillRect(0, 0, W, H);

  const mW = 360, mH = 250;
  const mx = (W - mW) / 2, my = (H - mH) / 2;

  context.fillStyle = won ? "#0d1f42" : "#1a0809";
  roundRect(context, mx, my, mW, mH, 14);
  context.fill();
  context.strokeStyle = won ? "#59d8ff" : "#ff4d5e";
  context.lineWidth = 3;
  roundRect(context, mx, my, mW, mH, 14);
  context.stroke();

  context.textAlign = "center";
  const cx2 = W / 2;

  if (won) {
    context.fillStyle = "#ffd700";
    context.font = "bold 22px monospace";
    context.fillText("🎉 ¡BACKLOG PURGADO!", cx2, my + 55);

    context.font = "bold 28px monospace";
    context.fillStyle = "#fff";
    context.fillText("⭐".repeat(ABState.stars) + "☆".repeat(3 - ABState.stars), cx2, my + 98);

    context.fillStyle = "#59d8ff";
    context.font = "bold 14px monospace";
    context.fillText(`${ABState.score.toLocaleString()} PTS`, cx2, my + 135);
  } else {
    context.fillStyle = "#ff4d5e";
    context.font = "bold 22px monospace";
    context.fillText("💥 SPRINT FALLIDO", cx2, my + 58);
    context.fillStyle = "#ddd";
    context.font = "12px monospace";
    context.fillText("Quedan bugs sin eliminar.", cx2, my + 95);
    context.fillText("Los Hotfixes se agotaron.", cx2, my + 115);
  }

  context.fillStyle = "#b6f542";
  context.font = "bold 12px monospace";
  context.fillText("TOCA AQUÍ PARA REINTENTAR", cx2, my + 175);
  context.fillStyle = "#9fb4e8";
  context.font = "11px monospace";
  context.fillText("o usa el botón '🗺️ MAPA' para salir", cx2, my + 200);
}

function roundRect(context, x, y, w, h, r) {
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + w - r, y);
  context.quadraticCurveTo(x + w, y, x + w, y + r);
  context.lineTo(x + w, y + h - r);
  context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  context.lineTo(x + r, y + h);
  context.quadraticCurveTo(x, y + h, x, y + h - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}
