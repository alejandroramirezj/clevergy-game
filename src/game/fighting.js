// =============================================================================
// fighting.js — Modo Lucha 1v1 en "The Office" (World 1 Stage)
// =============================================================================

import { CHARS } from "../config/characters.js";
import { SPR, ANIM, initSprites, getCharacterAvatar } from "../engine/sprites.js";
import { sfx } from "../engine/audio.js";
import { GameState } from "./state.js";
import { isLeft, isRight, isJump, isAttack, isSpecial, setInputMode } from "../engine/input.js";

// Stage Platforms (The Office Layout)
const FLOOR_Y = 430;
const STAGE_LEFT = 40;
const STAGE_RIGHT = 920;

const PLATFORMS = [
  // Floor
  { x: 0, y: FLOOR_Y, w: 960, h: 110, isFloor: true },
  // Left Office Desk (with PC monitor)
  { x: 180, y: 320, w: 170, h: 14, label: "DESK 1" },
  // Right Office Desk (with Laptop & Lamp)
  { x: 610, y: 320, w: 170, h: 14, label: "DESK 2" },
  // Center Coffee Table
  { x: 420, y: 375, w: 120, h: 12, label: "COFFEE" }
];

export const FightState = {
  phase: "fight", // "fight" | "round_end" | "match_end"
  mode: "cpu", // "cpu" | "online"
  p1: null,
  p2: null,
  round: 1,
  p1Wins: 0,
  p2Wins: 0,
  timer: 60,
  projectiles: [],
  hitSparks: [],
  floaters: [],
  onExit: null,
  winner: null
};

// ── Fighter Factory ────────────────────────────────────────────────────────────
function createFighter(charId, side) {
  const charConfig = CHARS.find((c) => c.id === charId) || CHARS[0];
  return {
    id: charId,
    config: charConfig,
    side, // 0 = Left (P1), 1 = Right (P2/CPU)
    x: side === 0 ? 220 : 740,
    y: FLOOR_Y - 60,
    vx: 0,
    vy: 0,
    w: 44,
    h: 60,
    facing: side === 0 ? 1 : -1,
    hp: 100,
    maxHp: 100,
    onGround: true,
    cooldown: 0, // for special ability
    state: "idle", // "idle" | "walk" | "jump" | "attack" | "special" | "hurt" | "death"
    stateTime: 0,
    // Dedicated Animation controller for this fighter
    anim: {
      name: "idle",
      frame: 0,
      t: 0
    },
    // Visual effects
    invulnerableTime: 0,
    shieldActive: false
  };
}

export function startFight(p1CharId, p2CharId, mode, onExit) {
  initSprites();
  FightState.phase = "fight";
  FightState.mode = mode || "cpu";
  FightState.round = 1;
  FightState.p1Wins = 0;
  FightState.p2Wins = 0;
  FightState.timer = 60;
  FightState.projectiles = [];
  FightState.hitSparks = [];
  FightState.floaters = [];
  FightState.onExit = onExit;
  FightState.winner = null;

  FightState.p1 = createFighter(p1CharId, 0);
  FightState.p2 = createFighter(p2CharId, 1);
  setInputMode("fight");
}

// ── CPU AI ─────────────────────────────────────────────────────────────────────
let cpuTimer = 0;
const cpuInput = { left: false, right: false, jump: false, attack: false, special: false };

function updateCPU(dt, p2, p1) {
  cpuTimer -= dt;
  if (cpuTimer <= 0) {
    cpuTimer = 0.12 + Math.random() * 0.15;
    const dist = Math.abs(p1.x - p2.x);
    const inRange = dist < 75;

    cpuInput.left = false;
    cpuInput.right = false;
    cpuInput.jump = false;
    cpuInput.attack = false;
    cpuInput.special = false;

    // Movement towards opponent
    if (p1.x < p2.x - 45) {
      cpuInput.left = true;
    } else if (p1.x > p2.x + 45) {
      cpuInput.right = true;
    }

    // Jump if opponent is on higher platform or random evade
    if (p1.y < p2.y - 30 && Math.random() < 0.45 && p2.onGround) {
      cpuInput.jump = true;
    }

    // Attacks
    if (inRange) {
      if (p2.cooldown <= 0 && Math.random() < 0.4) {
        cpuInput.special = true;
      } else {
        cpuInput.attack = true;
      }
    }
  }
}

// ── Physics & Combat Update ────────────────────────────────────────────────────
export function updateFight(dt) {
  if (FightState.phase === "match_end") return;

  // Round timer
  if (FightState.phase === "fight") {
    FightState.timer -= dt;
    if (FightState.timer <= 0) {
      checkRoundOver();
    }
  }

  const p1 = FightState.p1;
  const p2 = FightState.p2;

  if (FightState.mode === "cpu") {
    updateCPU(dt, p2, p1);
  }

  // Read Player 1 from unified InputManager
  const p1Input = {
    left: isLeft(),
    right: isRight(),
    jump: isJump(),
    attack: isAttack(),
    special: isSpecial()
  };

  // Update both fighters
  updateFighter(p1, p1Input, p2, dt);
  updateFighter(p2, cpuInput, p1, dt);

  // Auto-face opponent when idle/walking
  if (p1.state === "idle" || p1.state === "walk") {
    p1.facing = p2.x > p1.x ? 1 : -1;
  }
  if (p2.state === "idle" || p2.state === "walk") {
    p2.facing = p1.x > p2.x ? 1 : -1;
  }

  // Update projectiles
  updateProjectiles(dt);

  // Update hit sparks & floaters
  for (let i = FightState.hitSparks.length - 1; i >= 0; i--) {
    const spk = FightState.hitSparks[i];
    spk.life -= dt;
    if (spk.life <= 0) FightState.hitSparks.splice(i, 1);
  }
  for (let i = FightState.floaters.length - 1; i >= 0; i--) {
    const f = FightState.floaters[i];
    f.y -= 0.8;
    f.t -= dt;
    if (f.t <= 0) FightState.floaters.splice(i, 1);
  }

  // Check death / round win
  if (FightState.phase === "fight") {
    if (p1.hp <= 0 || p2.hp <= 0) {
      checkRoundOver();
    }
  }
}

function updateFighter(f, input, opp, dt) {
  if (f.invulnerableTime > 0) f.invulnerableTime -= dt;
  if (f.cooldown > 0) f.cooldown -= dt;
  if (f.stateTime > 0) f.stateTime -= dt;

  const spd = f.config.spd * 0.92;
  const jumpPwr = f.config.jump * 1.32;

  // Handle movement if not in hit/attack lock
  const canMove = f.state !== "attack" && f.state !== "special" && f.state !== "hurt" && f.state !== "death";

  if (canMove) {
    if (input.left) {
      f.vx = -spd;
      f.state = f.onGround ? "walk" : "jump";
    } else if (input.right) {
      f.vx = spd;
      f.state = f.onGround ? "walk" : "jump";
    } else {
      // Solid stop when releasing keys — ZERO sliding!
      f.vx = 0;
      if (f.onGround) f.state = "idle";
    }

    if (input.jump && f.onGround) {
      f.vy = -jumpPwr;
      f.onGround = false;
      f.state = "jump";
      sfx(880, 0.08);
      // Clean jump — NO confetti spray!
    }

    // Normal Attack (Z / Punch)
    if (input.attack && f.stateTime <= 0) {
      f.state = "attack";
      f.stateTime = 0.20;
      f.vx = 0; // Feet firmly planted when punching
      performNormalAttack(f, opp);
    }

    // Special Ability (X)
    if (input.special && f.cooldown <= 0 && f.stateTime <= 0) {
      f.state = "special";
      f.stateTime = 0.30;
      f.cooldown = f.config.cd + 0.8;
      performSpecialAbility(f, opp);
    }
  } else {
    // Quick deceleration during knockback or attack recovery
    f.vx *= 0.70;
    if (Math.abs(f.vx) < 0.2) f.vx = 0;
  }

  // State transitions when timer expires
  if (f.stateTime <= 0) {
    if (f.state === "attack" || f.state === "special" || f.state === "hurt") {
      f.state = f.onGround ? "idle" : "jump";
    }
  }

  // Physics: Gravity & Velocity
  f.vy += 0.65; // gravity
  f.x += f.vx;
  f.y += f.vy;

  // Platform & Floor Collisions
  f.onGround = false;
  for (const plat of PLATFORMS) {
    // Top collision
    if (
      f.x + f.w / 2 > plat.x &&
      f.x - f.w / 2 < plat.x + plat.w &&
      f.y + f.h >= plat.y &&
      f.y + f.h <= plat.y + 18 &&
      f.vy >= 0
    ) {
      f.y = plat.y - f.h;
      f.vy = 0;
      f.onGround = true;
      break;
    }
  }

  // Stage Left / Right bounds
  if (f.x < STAGE_LEFT + f.w / 2) {
    f.x = STAGE_LEFT + f.w / 2;
    f.vx = 0;
  }
  if (f.x > STAGE_RIGHT - f.w / 2) {
    f.x = STAGE_RIGHT - f.w / 2;
    f.vx = 0;
  }

  // Advance animation frame
  updateFighterAnim(f, dt);
}

function updateFighterAnim(f, dt) {
  // Sync animation name with fighter state
  let desiredAnim = f.state;
  if (desiredAnim === "special") desiredAnim = "attack";

  if (f.anim.name !== desiredAnim) {
    f.anim.name = desiredAnim;
    f.anim.frame = 0;
    f.anim.t = 0;
  }

  f.anim.t += dt;
  if (f.anim.t >= 0.12) {
    f.anim.t = 0;
    f.anim.frame = (f.anim.frame + 1) % 4;
  }
}

// ── Attacks & Damage ───────────────────────────────────────────────────────────
function performNormalAttack(attacker, defender) {
  sfx(760, 0.08);
  const reach = 60;
  const dx = defender.x - attacker.x;
  const isFacing = Math.sign(dx) === attacker.facing;
  const inRange = Math.abs(dx) < reach && Math.abs(defender.y - attacker.y) < 45;

  if (inRange && isFacing) {
    applyDamage(defender, attacker, 10, false);
  }
}

function performSpecialAbility(attacker, defender) {
  const id = attacker.id;

  if (id === "alejandro") {
    // FLY PUNCH: Quick, short forward strike (tight step, NOT endless sliding!)
    attacker.vx = attacker.facing * 4.5;
    sfx(950, 0.12, "sawtooth", 0.08);

    const dx = defender.x - attacker.x;
    if (Math.abs(dx) < 85 && Math.sign(dx) === attacker.facing) {
      applyDamage(defender, attacker, 22, true);
    }
  } else if (id === "ale") {
    // OIL SLIDE: Short quick slide
    attacker.vx = attacker.facing * 5.5;
    sfx(500, 0.15, "sawtooth", 0.06);

    const dx = defender.x - attacker.x;
    if (Math.abs(dx) < 80) {
      applyDamage(defender, attacker, 18, true);
    }
  } else if (id === "alvaroM") {
    // ERROR 404: Shoots an exploding calculator projectile
    FightState.projectiles.push({
      kind: "404",
      x: attacker.x + attacker.facing * 28,
      y: attacker.y + 15,
      vx: attacker.facing * 7,
      vy: -2.5,
      owner: attacker,
      t: 2
    });
    sfx(880, 0.1);
  } else if (id === "alvaroP") {
    // PODCAST WAVE: Sonic wave
    FightState.projectiles.push({
      kind: "wave",
      x: attacker.x + attacker.facing * 25,
      y: attacker.y + 20,
      vx: attacker.facing * 9,
      vy: 0,
      owner: attacker,
      t: 0.5
    });
    sfx(330, 0.18, "sawtooth", 0.06);
  } else {
    // Generic strike
    attacker.vx = attacker.facing * 3;
    sfx(880, 0.1);
    const dx = defender.x - attacker.x;
    if (Math.abs(dx) < 75 && Math.sign(dx) === attacker.facing) {
      applyDamage(defender, attacker, 20, true);
    }
  }
}

function applyDamage(target, source, dmg, isCritical = false) {
  target.hp = Math.max(0, target.hp - dmg);
  // Controlled, realistic recoil (short nudge, stops immediately via friction)
  target.vx = source.facing * (isCritical ? 3.2 : 2.0);
  target.vy = isCritical ? -3.0 : -1.8;
  target.state = "hurt";
  target.stateTime = 0.18;

  sfx(350, 0.10, "square", 0.08);

  // Crisp Combat Impact Star at contact point (NO confetti falling!)
  const sparkX = (target.x + source.x) / 2;
  const sparkY = target.y + target.h / 2;
  spawnHitSpark(sparkX, sparkY, isCritical);

  // Single clean damage floater
  FightState.floaters.push({
    x: target.x,
    y: target.y - 20,
    txt: `-${dmg}`,
    col: isCritical ? "#ffd25e" : "#ff4d5e",
    t: 0.8
  });
}

function updateProjectiles(dt) {
  for (let i = FightState.projectiles.length - 1; i >= 0; i--) {
    const pr = FightState.projectiles[i];
    pr.x += pr.vx;
    pr.y += pr.vy;
    pr.t -= dt;

    if (pr.kind === "404") {
      pr.vy += 0.35; // bounce gravity
      if (pr.y >= FLOOR_Y - 10) {
        pr.y = FLOOR_Y - 10;
        pr.vy *= -0.55;
      }
    }

    // Check hit against opponent
    const opp = pr.owner === FightState.p1 ? FightState.p2 : FightState.p1;
    if (Math.abs(pr.x - opp.x) < 35 && Math.abs(pr.y - (opp.y + 25)) < 35) {
      applyDamage(opp, pr.owner, 18, true);
      FightState.projectiles.splice(i, 1);
      continue;
    }

    if (pr.t <= 0 || pr.x < 0 || pr.x > 960) {
      FightState.projectiles.splice(i, 1);
    }
  }
}

function spawnHitSpark(x, y, isCritical = false) {
  FightState.hitSparks.push({
    x,
    y,
    size: isCritical ? 24 : 16,
    maxLife: 0.12,
    life: 0.12,
    isCritical
  });
}

function checkRoundOver() {
  FightState.phase = "round_end";
  const p1 = FightState.p1;
  const p2 = FightState.p2;

  let roundWinner = null;
  if (p1.hp > p2.hp) {
    FightState.p1Wins++;
    roundWinner = p1.config.name;
  } else if (p2.hp > p1.hp) {
    FightState.p2Wins++;
    roundWinner = p2.config.name;
  } else {
    roundWinner = "EMPATE";
  }

  sfx(587, 0.15);
  sfx(880, 0.25);

  setTimeout(() => {
    if (FightState.p1Wins >= 2 || FightState.p2Wins >= 2) {
      FightState.phase = "match_end";
      FightState.winner = FightState.p1Wins >= 2 ? p1.config.name : p2.config.name;
    } else {
      // Next round
      FightState.round++;
      FightState.timer = 60;
      p1.hp = 100;
      p2.hp = 100;
      p1.x = 220;
      p1.y = FLOOR_Y - 60;
      p2.x = 740;
      p2.y = FLOOR_Y - 60;
      p1.vx = p1.vy = 0;
      p2.vx = p2.vy = 0;
      p1.state = "idle";
      p2.state = "idle";
      FightState.phase = "fight";
    }
  }, 2200);
}

// ── Renderer: The Office Stage & Fighters ───────────────────────────────────────
export function drawFight(cx) {
  const W = GameState.W || 960;
  const H = GameState.H || 540;

  drawOfficeStage(cx, W, H);

  // Draw Platforms (Office Desks)
  drawOfficeDesks(cx);

  // Draw Fighters
  if (FightState.p1) drawFighter(cx, FightState.p1);
  if (FightState.p2) drawFighter(cx, FightState.p2);

  // Draw Projectiles & Particles
  drawCombatFX(cx);

  // Draw Top HUD (Street Fighter style HP bars)
  drawTopHUD(cx, W, H);

  // Match End Modal
  if (FightState.phase === "match_end") {
    drawMatchEndModal(cx, W, H);
  }
}

function drawOfficeStage(cx, W, H) {
  // Office Night Skyline Gradient
  const bg = cx.createLinearGradient(0, 0, 0, FLOOR_Y);
  bg.addColorStop(0, "#080d1e");
  bg.addColorStop(0.7, "#0e1633");
  bg.addColorStop(1, "#17234a");
  cx.fillStyle = bg;
  cx.fillRect(0, 0, W, H);

  // Office Skyline Windows
  for (let i = 0; i < 7; i++) {
    const bx = i * 145 + 20;
    cx.fillStyle = "#121938";
    cx.fillRect(bx, 60, 110, FLOOR_Y - 60);

    // Glowing Office cubicle lights
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if ((i * 3 + row + col) % 4 === 0) {
          cx.fillStyle = "rgba(89, 216, 255, 0.35)";
          cx.fillRect(bx + 14 + col * 30, 85 + row * 45, 20, 24);
        }
      }
    }
  }

  // Background IT Server Rack
  cx.fillStyle = "#192244";
  cx.fillRect(60, FLOOR_Y - 140, 70, 140);
  cx.fillRect(830, FLOOR_Y - 140, 70, 140);
  // Blinking green/red LEDs on server
  for (let r = 0; r < 5; r++) {
    cx.fillStyle = r % 2 === 0 ? "#42f584" : "#ff4d5e";
    cx.fillRect(115, FLOOR_Y - 125 + r * 22, 6, 6);
    cx.fillRect(845, FLOOR_Y - 125 + r * 22, 6, 6);
  }

  // Office Floor (Carpet with neon border)
  cx.fillStyle = "#161e38";
  cx.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
  cx.fillStyle = "#1b2545";
  for (let x = 0; x < W; x += 40) {
    cx.fillRect(x, FLOOR_Y + 10, 20, H - FLOOR_Y - 10);
  }

  // Neon Floor Line
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 3;
  cx.beginPath();
  cx.moveTo(0, FLOOR_Y);
  cx.lineTo(W, FLOOR_Y);
  cx.stroke();
}

function drawOfficeDesks(cx) {
  for (const plat of PLATFORMS) {
    if (plat.isFloor) continue;

    // Desk surface (wooden/dark navy tech desk)
    cx.fillStyle = "#25345c";
    cx.fillRect(plat.x, plat.y, plat.w, plat.h);
    cx.fillStyle = "#59d8ff";
    cx.fillRect(plat.x, plat.y, plat.w, 3); // Desk top rim

    // Desk legs
    cx.fillStyle = "#16203a";
    cx.fillRect(plat.x + 8, plat.y + plat.h, 8, FLOOR_Y - (plat.y + plat.h));
    cx.fillRect(plat.x + plat.w - 16, plat.y + plat.h, 8, FLOOR_Y - (plat.y + plat.h));

    // Desk Props
    if (plat.label === "DESK 1") {
      // Computer monitor
      cx.fillStyle = "#0c1326";
      cx.fillRect(plat.x + 40, plat.y - 34, 46, 30);
      cx.strokeStyle = "#59d8ff";
      cx.lineWidth = 1.5;
      cx.strokeRect(plat.x + 40, plat.y - 34, 46, 30);
      // Code on screen
      cx.fillStyle = "#42f584";
      cx.fillRect(plat.x + 44, plat.y - 28, 22, 2);
      cx.fillRect(plat.x + 44, plat.y - 22, 32, 2);
      cx.fillRect(plat.x + 44, plat.y - 16, 18, 2);
      // Monitor stand
      cx.fillStyle = "#1a2544";
      cx.fillRect(plat.x + 58, plat.y - 4, 10, 4);
    } else if (plat.label === "DESK 2") {
      // Laptop
      cx.fillStyle = "#dfe8ff";
      cx.fillRect(plat.x + 85, plat.y - 18, 28, 18);
      cx.fillStyle = "#59d8ff";
      cx.fillRect(plat.x + 87, plat.y - 16, 24, 12);
      // Coffee mug
      cx.fillStyle = "#ff4d5e";
      cx.fillRect(plat.x + 45, plat.y - 14, 12, 14);
      cx.fillStyle = "#fff";
      cx.fillRect(plat.x + 47, plat.y - 12, 8, 3);
    } else if (plat.label === "COFFEE") {
      // Coffee machine
      cx.fillStyle = "#d92b3a";
      cx.fillRect(plat.x + 45, plat.y - 26, 30, 26);
      cx.fillStyle = "#fff";
      cx.font = "bold 8px monospace";
      cx.fillText("☕", plat.x + 52, plat.y - 10);
    }
  }
}

// ── Draw Fighter (Supports Alejandro Animated Pose & Coworker Sprites) ────────
function drawFighter(cx, f) {
  cx.save();
  const time = GameState.time || 0;

  // Hurt blink
  if (f.state === "hurt" && Math.sin(time * 35) > 0) {
    cx.restore();
    return;
  }

  // Shadow on ground or platform
  cx.fillStyle = "rgba(0, 0, 0, 0.4)";
  cx.beginPath();
  cx.ellipse(f.x, f.y + f.h, 22, 6, 0, 0, Math.PI * 2);
  cx.fill();

  // Flip horizontally if facing left
  const flip = f.facing < 0;
  cx.translate(f.x, f.y + f.h);
  if (flip) cx.scale(-1, 1);

  let drawn = false;

  // 1. Alejandro R. (High-res Animated Mosca Boxeadora with wings & boxing gloves)
  const animRec = ANIM[f.id];
  if (animRec && animRec.ready && animRec.type === "poses") {
    const poseKey = f.anim.name;
    const imgList = animRec.images[poseKey] || animRec.images.idle || Object.values(animRec.images)[0];
    if (imgList && imgList.length > 0) {
      const fr = Math.min(f.anim.frame, imgList.length - 1);
      const img = imgList[fr];
      if (img && img.complete && img.naturalWidth > 0) {
        const scale = 58 / animRec.canvH;
        const dw = animRec.canvW * scale;
        const dh = animRec.canvH * scale;
        const anchorX = (animRec.anchorX || 140) * scale;
        cx.drawImage(img, -anchorX, -dh, dw, dh);
        drawn = true;
      }
    }
  }

  // 2. Fallback to pixel-art sprite SPR[id] from World 1
  if (!drawn) {
    const spr = SPR[f.id];
    if (spr && spr.img) {
      const dw = spr.w * 1.5;
      const dh = spr.h * 1.5;
      cx.drawImage(spr.img, -dw / 2, -dh, dw, dh);
      drawn = true;
    }
  }

  // 3. Fallback emoji if sprites loading
  if (!drawn) {
    cx.font = "42px sans-serif";
    cx.textAlign = "center";
    cx.fillText(f.config.emoji, 0, -12);
  }

  cx.restore();

  // Small character name and mini health indicator above fighter
  cx.save();
  cx.fillStyle = f.side === 0 ? "#59d8ff" : "#ffd25e";
  cx.font = "bold 10px monospace";
  cx.textAlign = "center";
  cx.fillText(`${f.config.emoji} ${f.config.name}`, f.x, f.y - 12);
  cx.restore();
}

function drawCombatFX(cx) {
  // Projectiles
  for (const pr of FightState.projectiles) {
    if (pr.kind === "404") {
      cx.fillStyle = "#ff4d5e";
      cx.font = "bold 14px monospace";
      cx.fillText("⚠️ 404", pr.x - 14, pr.y);
    } else if (pr.kind === "wave") {
      cx.strokeStyle = "#59d8ff";
      cx.lineWidth = 3;
      cx.beginPath();
      cx.arc(pr.x, pr.y, 16, -Math.PI * 0.4, Math.PI * 0.4);
      cx.stroke();
    }
  }

  // Clean Combat Hit Sparks (Retro Impact Star - ZERO falling confetti!)
  for (const spk of FightState.hitSparks) {
    const alpha = Math.max(0, spk.life / spk.maxLife);
    cx.save();
    cx.translate(spk.x, spk.y);
    cx.globalAlpha = alpha;

    // Golden impact star
    const rOut = spk.size * (1.1 - alpha * 0.2);
    const rIn = 4;
    cx.fillStyle = spk.isCritical ? "#ffd25e" : "#ffffff";
    cx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? rOut : rIn;
      const sx = Math.cos(angle) * r;
      const sy = Math.sin(angle) * r;
      if (i === 0) cx.moveTo(sx, sy);
      else cx.lineTo(sx, sy);
    }
    cx.closePath();
    cx.fill();

    // White core spark
    cx.fillStyle = "#ffffff";
    cx.beginPath();
    cx.arc(0, 0, 4, 0, Math.PI * 2);
    cx.fill();

    cx.restore();
  }

  // Clean Damage Floaters
  for (const f of FightState.floaters) {
    cx.save();
    cx.globalAlpha = Math.min(1, f.t * 2);
    cx.fillStyle = f.col || "#ff4d5e";
    cx.font = "bold 15px monospace";
    cx.textAlign = "center";
    cx.fillText(f.txt, f.x, f.y);
    cx.restore();
  }
}

// ── Top HUD: Health Bars, Rounds & Timer ───────────────────────────────────────
function drawTopHUD(cx, W, H) {
  const p1 = FightState.p1;
  const p2 = FightState.p2;
  if (!p1 || !p2) return;

  const barW = 320, barH = 20, barY = 22;

  // P1 Health Bar (Left)
  cx.fillStyle = "#0c1426";
  roundRect(cx, 40, barY, barW, barH, 6);
  cx.fill();
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 2;
  roundRect(cx, 40, barY, barW, barH, 6);
  cx.stroke();

  const p1Pct = Math.max(0, p1.hp / p1.maxHp);
  const p1FillW = (barW - 4) * p1Pct;
  cx.fillStyle = p1Pct > 0.4 ? "#42f584" : "#ff4d5e";
  cx.fillRect(42, barY + 2, p1FillW, barH - 4);

  // P1 Label & Special CD
  cx.fillStyle = "#ffffff";
  cx.font = "bold 12px monospace";
  cx.textAlign = "left";
  cx.fillText(`${p1.config.emoji} ${p1.config.name} (P1)`, 42, barY - 6);
  if (p1.cooldown <= 0) {
    cx.fillStyle = "#ffd25e";
    cx.fillText("⚡ ESPECIAL LISTO (X)", 42, barY + barH + 15);
  }

  // P2 Health Bar (Right)
  const p2BarX = W - 40 - barW;
  cx.fillStyle = "#0c1426";
  roundRect(cx, p2BarX, barY, barW, barH, 6);
  cx.fill();
  cx.strokeStyle = "#ffc857";
  cx.lineWidth = 2;
  roundRect(cx, p2BarX, barY, barW, barH, 6);
  cx.stroke();

  const p2Pct = Math.max(0, p2.hp / p2.maxHp);
  const p2FillW = (barW - 4) * p2Pct;
  cx.fillStyle = p2Pct > 0.4 ? "#42f584" : "#ff4d5e";
  cx.fillRect(p2BarX + (barW - 4 - p2FillW), barY + 2, p2FillW, barH - 4);

  // P2 Label
  cx.fillStyle = "#ffffff";
  cx.font = "bold 12px monospace";
  cx.textAlign = "right";
  const p2Label = FightState.mode === "cpu" ? " (CPU)" : " (P2)";
  cx.fillText(`${p2.config.name}${p2Label} ${p2.config.emoji}`, W - 42, barY - 6);

  // Center Timer & Round Count
  cx.textAlign = "center";
  cx.fillStyle = "#ff4d5e";
  cx.font = "bold 26px monospace";
  cx.fillText(Math.ceil(FightState.timer).toString().padStart(2, "0"), W / 2, barY + 18);

  cx.fillStyle = "#59d8ff";
  cx.font = "bold 11px monospace";
  cx.fillText(`ROUND ${FightState.round} · ${FightState.p1Wins}-${FightState.p2Wins}`, W / 2, barY + 36);

  // Top Map Exit button
  cx.fillStyle = "rgba(10, 16, 36, 0.85)";
  roundRect(cx, W / 2 - 45, 2, 90, 20, 4);
  cx.fill();
  cx.strokeStyle = "#59d8ff66";
  cx.lineWidth = 1;
  roundRect(cx, W / 2 - 45, 2, 90, 20, 4);
  cx.stroke();
  cx.fillStyle = "#9fb4e8";
  cx.font = "9px monospace";
  cx.fillText("🗺️ MAPA", W / 2, 14);
}



function drawMatchEndModal(cx, W, H) {
  cx.fillStyle = "rgba(4, 9, 22, 0.88)";
  cx.fillRect(0, 0, W, H);

  const mW = 380, mH = 220, mx = W / 2 - mW / 2, my = H / 2 - mH / 2;
  cx.fillStyle = "#0c152e";
  roundRect(cx, mx, my, mW, mH, 12);
  cx.fill();
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 3;
  roundRect(cx, mx, my, mW, mH, 12);
  cx.stroke();

  cx.textAlign = "center";
  cx.fillStyle = "#ffd25e";
  cx.font = "bold 24px monospace";
  cx.fillText("🏆 ¡COMBATE FINALIZADO!", W / 2, my + 50);

  cx.fillStyle = "#ffffff";
  cx.font = "bold 18px monospace";
  cx.fillText(`GANADOR: ${FightState.winner}`, W / 2, my + 95);

  cx.fillStyle = "#9fb4e8";
  cx.font = "12px monospace";
  cx.fillText(`Resultado: ${FightState.p1Wins} — ${FightState.p2Wins}`, W / 2, my + 130);

  // Restart / Map buttons
  cx.fillStyle = "#42f584";
  roundRect(cx, W / 2 - 120, my + 155, 240, 38, 8);
  cx.fill();
  cx.fillStyle = "#06140b";
  cx.font = "bold 13px monospace";
  cx.fillText("🗺️ VOLVER AL MAPA", W / 2, my + 179);
}

function roundRect(cx, x, y, w, h, r) {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.lineTo(x + w - r, y);
  cx.quadraticCurveTo(x + w, y, x + w, y + r);
  cx.lineTo(x + w, y + h - r);
  cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  cx.lineTo(x + r, y + h);
  cx.quadraticCurveTo(x, y + h, x, y + h - r);
  cx.lineTo(x, y + r);
  cx.quadraticCurveTo(x, y, x + r, y);
  cx.closePath();
}

// Exit click listener for fight mode
window.addEventListener("mousedown", (e) => {
  if (GameState.gameMode !== "fighting_active") return;
  const cv = document.getElementById("cv");
  const rect = cv.getBoundingClientRect();
  const W = GameState.W || 960;
  const H = GameState.H || 540;
  const px = (e.clientX - rect.left) * (W / rect.width);
  const py = (e.clientY - rect.top) * (H / rect.height);

  // Top Map button
  if (px >= W / 2 - 50 && px <= W / 2 + 50 && py >= 0 && py <= 30) {
    if (FightState.onExit) FightState.onExit();
    return;
  }

  // If match is over, click anywhere to exit
  if (FightState.phase === "match_end") {
    if (FightState.onExit) FightState.onExit();
  }
});
