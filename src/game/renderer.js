import { TILE, LW, LH, SIGNS } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { GameState, fmtT } from "./state.js";
import { grid } from "../engine/physics.js";
import { SPR, ANIM, anim, drawAnimatedPlayer } from "../engine/sprites.js";
import { abilK } from "../engine/input.js";

export function draw(cx) {
  const { W, H, camX, camY, shake } = GameState;
  cx.save();
  cx.clearRect(0, 0, W, H);
  const sx = (Math.random() - 0.5) * shake;
  const sy = (Math.random() - 0.5) * shake;
  cx.translate(-Math.floor(camX) + sx, -Math.floor(camY) + sy);

  drawBackground(cx);
  drawTiles(cx);
  drawSigns(cx);
  drawCoffees(cx);
  drawPrinted(cx);
  drawMinions(cx);
  drawProjectiles(cx);
  drawEnemies(cx);
  drawBoss(cx);
  if (GameState.fragment) drawFragment(cx);
  drawPlayer(cx);
  drawParticles(cx);
  drawLighting(cx);

  cx.restore();
  drawHUD(cx);
}

function drawBackground(cx) {
  const { W, H, camX, camY, time, currentWorld } = GameState;
  const topY = camY - 4;
  const wId = currentWorld || 1;

  if (wId === 2) {
    // 2. Integration Jungle
    cx.fillStyle = "#06130b";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);
    for (let i = Math.floor(camX / 220); i < (camX + W) / 220 + 1; i++) {
      cx.fillStyle = "#0c2616";
      cx.fillRect(i * 220 + 20, camY + 20, 48, H);
      cx.fillStyle = "#1b4d2e";
      cx.fillRect(i * 220 + 75, camY, 4, 180 + Math.sin(time * 2 + i) * 15);
      cx.fillStyle = "rgba(66,245,132,0.25)";
      cx.fillRect(i * 220 + 73, camY + 160, 8, 12);
    }
  } else if (wId === 3) {
    // 3. Product Kingdom
    cx.fillStyle = "#0d0f22";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);
    for (let i = Math.floor(camX / 280); i < (camX + W) / 280 + 1; i++) {
      cx.fillStyle = "#181b3b";
      cx.fillRect(i * 280 + 30, camY + 30, 110, 200);
      cx.fillRect(i * 280 + 25, camY + 20, 20, 15);
      cx.fillRect(i * 280 + 55, camY + 20, 20, 15);
      cx.fillRect(i * 280 + 85, camY + 20, 20, 15);
      cx.fillRect(i * 280 + 115, camY + 20, 20, 15);
      cx.fillStyle = "#ffc857";
      cx.fillRect(i * 280 + 70, camY + 65, 30, 45);
    }
  } else if (wId === 4) {
    // 4. Meeting Dimension
    cx.fillStyle = "#13061f";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);
    cx.strokeStyle = "rgba(216,89,255,0.15)";
    cx.lineWidth = 1;
    for (let y = 0; y < H; y += 45) {
      cx.beginPath();
      cx.moveTo(camX, camY + y);
      cx.lineTo(camX + W, camY + y);
      cx.stroke();
    }
    for (let i = Math.floor(camX / 240); i < (camX + W) / 240 + 1; i++) {
      cx.fillStyle = "rgba(46,18,71,0.6)";
      cx.fillRect(i * 240 + 40, camY + 50, 120, 80);
      cx.strokeStyle = "rgba(216,89,255,0.4)";
      cx.strokeRect(i * 240 + 40, camY + 50, 120, 80);
      cx.fillStyle = "#d859ff";
      cx.font = "8px monospace";
      cx.fillText("MEETING IN PROGRESS", i * 240 + 46, camY + 68);
    }
  } else if (wId === 5) {
    // 5. The Retreat: Starry Night Alpine Peaks
    cx.fillStyle = "#060914";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);
    cx.fillStyle = "#ffffff";
    for (let s = 0; s < 35; s++) {
      const sx = (s * 137) % (LW * TILE);
      const sy = camY + ((s * 31) % Math.max(80, H - 220));
      cx.fillRect(sx, sy, 2, 2);
    }
    for (let i = Math.floor(camX / 300); i < (camX + W) / 300 + 2; i++) {
      const mx = i * 300;
      cx.fillStyle = "#101930";
      cx.beginPath();
      cx.moveTo(mx - 80, camY + H);
      cx.lineTo(mx + 70, camY + 50);
      cx.lineTo(mx + 220, camY + H);
      cx.fill();
      cx.fillStyle = "#3b4f7a";
      cx.beginPath();
      cx.moveTo(mx + 40, camY + 80);
      cx.lineTo(mx + 70, camY + 50);
      cx.lineTo(mx + 100, camY + 80);
      cx.fill();
    }
  } else {
    // 1. The Office: default
    cx.fillStyle = "#0d1226";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);
    for (let i = Math.floor(camX / 260); i < (camX + W) / 260 + 1; i++) {
      cx.fillStyle = "#141b3d";
      cx.fillRect(i * 260 + 30, camY + 40, 140, 150);
      cx.fillStyle = "#1d2a5c";
      cx.fillRect(i * 260 + 38, camY + 48, 124, 134);
    }
    cx.fillStyle = "#0f1530";
    const deskY = camY + H;
    for (let i = Math.floor((camX * 0.5) / 200); i < (camX * 0.5 + W) / 200 + 2; i++) {
      const bx = i * 200 - camX * 0.5 + camX;
      cx.fillRect(bx, deskY - 120, 120, 10);
      cx.fillRect(bx + 10, deskY - 110, 8, 60);
      cx.fillRect(bx + 100, deskY - 110, 8, 60);
      cx.fillRect(bx + 30, deskY - 152, 46, 32);
    }
  }

  cx.fillStyle = "rgba(120,140,200,0.12)";
  for (let i = 0; i < 10; i++) {
    const ex = (i * 397 + time * 12) % (LW * TILE);
    cx.fillRect(ex, camY + 60 + ((i * 97) % Math.max(120, H - 200)) + Math.sin(time + i) * 10, 22, 14);
  }
}

function drawTiles(cx) {
  const { W, camX, time, currentWorld } = GameState;
  const i0 = Math.max(0, Math.floor(camX / TILE) - 1);
  const i1 = Math.min(LW, i0 + Math.ceil(W / TILE) + 3);
  const wId = currentWorld || 1;

  // Thematic colors per world
  let colSolid = "#2a3566", colTop = "#38468a", colBot = "#1c2450";
  let colPlat = "#7a84a3", colPlatTop = "#a8b2cf";

  if (wId === 2) {
    // Jungle: mossy bark
    colSolid = "#1b4428"; colTop = "#2a663d"; colBot = "#112b1a";
    colPlat = "#3d6e4b"; colPlatTop = "#62ab76";
  } else if (wId === 3) {
    // Castle: medieval stone
    colSolid = "#303459"; colTop = "#464c80"; colBot = "#21243d";
    colPlat = "#807b60"; colPlatTop = "#ffc857";
  } else if (wId === 4) {
    // Meeting dimension: cyber purple
    colSolid = "#471e6e"; colTop = "#6b2fa6"; colBot = "#2c1245";
    colPlat = "#7c3fa3"; colPlatTop = "#d859ff";
  } else if (wId === 5) {
    // Mountain retreat: alpine snow
    colSolid = "#1d2d47"; colTop = "#3d5a8a"; colBot = "#111c2e";
    colPlat = "#5a7094"; colPlatTop = "#e8f0fe";
  }

  for (let j = 0; j < LH; j++) {
    for (let i = i0; i < i1; i++) {
      const ch = grid[j][i];
      if (ch === ".") continue;
      const x = i * TILE, y = j * TILE;
      if (ch === "#") {
        cx.fillStyle = colSolid;
        cx.fillRect(x, y, TILE, TILE);
        cx.fillStyle = colTop;
        cx.fillRect(x, y, TILE, 5);
        cx.fillStyle = colBot;
        cx.fillRect(x, y + TILE - 4, TILE, 4);
        cx.fillStyle = colTop;
        cx.fillRect(x + 4, y + 10, 6, 6);
        cx.fillRect(x + 20, y + 20, 8, 5);
      } else if (ch === "=") {
        cx.fillStyle = colPlat;
        cx.fillRect(x, y, TILE, 8);
        cx.fillStyle = colPlatTop;
        cx.fillRect(x, y, TILE, 3);
        cx.fillStyle = colBot;
        cx.fillRect(x + 3, y + 8, 4, 4);
        cx.fillRect(x + TILE - 7, y + 8, 4, 4);
      } else if (ch === "^") {
        cx.fillStyle = "#6b4423";
        cx.fillRect(x, y + 22, TILE, 14);
        cx.fillStyle = "#8a5a2e";
        cx.fillRect(x + 4, y + 18 + Math.sin(time * 5 + i) * 2, 8, 6);
        cx.fillRect(x + 20, y + 16 + Math.cos(time * 4 + i) * 2, 8, 6);
        cx.fillStyle = "#ffffff22";
        cx.fillRect(x + 6, y + 10 - Math.abs(Math.sin(time * 3 + i)) * 6, 3, 6);
      }
    }
  }
}

function drawSigns(cx) {
  cx.font = "11px monospace";
  for (const s of SIGNS) {
    const x = s.x * TILE, y = s.y * TILE;
    cx.fillStyle = "#0e132b";
    cx.fillRect(x - 4, y - 14, s.t.length * 6.4 + 10, 20);
    cx.strokeStyle = "#2a3566";
    cx.strokeRect(x - 4, y - 14, s.t.length * 6.4 + 10, 20);
    cx.fillStyle = "#9fb4e8";
    cx.fillText(s.t, x, y);
    cx.fillStyle = "#2a3566";
    cx.fillRect(x + 10, y + 6, 4, TILE);
  }
}

function drawCoffees(cx) {
  for (const c of GameState.coffees) {
    if (c.got) continue;
    cx.drawImage(SPR.coffee.img, c.x, c.y + Math.sin(c.t * 3) * 3);
  }
}

function drawPrinted(cx) {
  const { time } = GameState;
  for (const p of GameState.printed) {
    const a = p.life < 2 ? (Math.sin(time * 12) > 0 ? 1 : 0.35) : 1;
    cx.globalAlpha = a;
    cx.fillStyle = "#59d8ff";
    cx.fillRect(p.x, p.y, p.w, p.h);
    cx.fillStyle = "#b0ecff";
    cx.fillRect(p.x, p.y, p.w, 3);
    cx.fillStyle = "#2a7d99";
    for (let i = 6; i < p.w; i += 14) cx.fillRect(p.x + i, p.y + 4, 8, 3);
    cx.globalAlpha = 1;
  }
}

function drawMinions(cx) {
  for (const m of GameState.minions) {
    const s = m.kind === "worker" ? SPR.worker : SPR.broc;
    cx.drawImage(m.vx < 0 ? s.flip : s.img, m.x - s.w / 2, m.y - s.h + 8);
  }
}

function drawProjectiles(cx) {
  for (const p of GameState.projectiles) {
    if (p.kind === "404") {
      cx.drawImage(SPR.bomb404.img, p.x - 9, p.y - 8);
    } else if (p.kind === "wave") {
      cx.strokeStyle = "rgba(143,163,217,0.8)";
      cx.lineWidth = 3;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r / 2, -1.1 + (p.dir < 0 ? Math.PI : 0), 1.1 + (p.dir < 0 ? Math.PI : 0));
      cx.stroke();
      cx.strokeStyle = "rgba(89,216,255,0.5)";
      cx.beginPath();
      cx.arc(p.x, p.y, p.r / 2 - 8, -0.9 + (p.dir < 0 ? Math.PI : 0), 0.9 + (p.dir < 0 ? Math.PI : 0));
      cx.stroke();
    }
  }
}

function drawEnemies(cx) {
  for (const e of GameState.enemies) {
    const bob = Math.sin(e.t * 4) * 3;
    if (e.ifr > 0.15) cx.globalAlpha = 0.5;
    if (e.type === "email") cx.drawImage(SPR.email.img, e.x, e.y + bob);
    else if (e.type === "re") cx.drawImage(SPR.re.img, e.x, e.y + bob);
    else if (e.type === "meeting") {
      cx.drawImage(SPR.meeting.img, e.x, e.y + bob);
      if (e.say > 1.5) {
        cx.globalAlpha = 1;
        cx.fillStyle = "#0e132b";
        cx.fillRect(e.x - 42, e.y - 26, 120, 18);
        cx.strokeStyle = "#7a5cd6";
        cx.strokeRect(e.x - 42, e.y - 26, 120, 18);
        cx.fillStyle = "#c9b6ff";
        cx.font = "10px monospace";
        cx.fillText("¿Tienes 5 minutos?", e.x - 36, e.y - 13);
      }
    }
    cx.globalAlpha = 1;
  }
}

function drawBoss(cx) {
  const boss = GameState.boss;
  const time = GameState.time;
  if (boss.dead) return;
  if (!boss.active) {
    cx.globalAlpha = 0.35;
    drawEnvelope(cx, boss.x, boss.y + Math.sin(time) * 6);
    cx.globalAlpha = 1;
    return;
  }
  if (boss.hitFlash > 0) cx.globalAlpha = 0.5;
  drawEnvelope(cx, boss.x, boss.y);
  cx.globalAlpha = 1;
  cx.fillStyle = "#0e132b";
  cx.fillRect(boss.x - 8, boss.y - 22, 100, 10);
  cx.fillStyle = "#ff4d5e";
  cx.fillRect(boss.x - 6, boss.y - 20, 96 * (boss.hp / boss.maxhp), 6);
  cx.fillStyle = "#fff";
  cx.font = "9px monospace";
  cx.fillText("THE EMAIL CHAIN", boss.x - 4, boss.y - 26);
  if (boss.intro > 0) {
    cx.fillStyle = "#ff4d5e";
    cx.font = "bold 14px monospace";
    cx.fillText("«RE: RE: RE: URGENTE»", boss.x - 30, boss.y - 40);
  }
}

function drawEnvelope(cx, x, y) {
  cx.fillStyle = "#dfe8ff";
  cx.fillRect(x, y, 84, 58);
  cx.strokeStyle = "#8fa3d9";
  cx.lineWidth = 3;
  cx.strokeRect(x + 1, y + 1, 82, 56);
  cx.beginPath();
  cx.moveTo(x, y);
  cx.lineTo(x + 42, y + 32);
  cx.lineTo(x + 84, y);
  cx.stroke();
  cx.fillStyle = "#d92b3a";
  cx.fillRect(x + 20, y + 34, 12, 8);
  cx.fillRect(x + 52, y + 34, 12, 8);
  cx.fillStyle = "#2a2f3d";
  cx.fillRect(x + 24, y + 36, 5, 5);
  cx.fillRect(x + 56, y + 36, 5, 5);
  cx.fillStyle = "#ff8f98";
  cx.fillRect(x + 64, y + 6, 14, 12);
}

function drawFragment(cx) {
  const f = GameState.fragment;
  const fy = f.y + Math.sin(f.t * 3) * 6;
  cx.save();
  cx.shadowColor = "#b6f542";
  cx.shadowBlur = 18;
  cx.drawImage(SPR.frag.img, f.x - 12, fy - 12);
  cx.restore();
  cx.fillStyle = "#b6f542";
  cx.font = "10px monospace";
  cx.fillText("CÓDIGO FUENTE (1/5)", f.x - 42, fy - 22);
}

function drawPlayer(cx) {
  const P = GameState.P;
  const C = CHARS[GameState.charIdx];
  const time = GameState.time;
  const s = P.ball ? SPR.maca : SPR[C.id];

  if (P.inv > 0 && Math.sin(time * 30) > 0) return;
  const bob = P.onGround && Math.abs(P.vx) > 0.5 ? Math.abs(Math.sin(time * 12)) * 2 : 0;
  const animated = !P.ball && P.roll <= 0 && ANIM[C.id] && ANIM[C.id].ready;

  if (animated) {
    drawAnimatedPlayer(cx, P, C.id, bob);
  } else if (s) {
    const img = P.face < 0 ? s.flip : s.img;
    cx.save();
    if (P.ball || P.roll > 0) {
      cx.translate(P.x + P.w / 2, P.y + P.h - s.h / 2);
      cx.rotate(time * 12 * P.face);
      cx.drawImage(img, -s.w / 2, -s.h / 2);
    } else {
      cx.drawImage(img, Math.floor(P.x + P.w / 2 - s.w / 2), Math.floor(P.y + P.h - s.h - bob));
    }
    cx.restore();
  }

  const shieldOn = C.id === "beltran" && abilK() && P.shieldE > 0;
  if (shieldOn) {
    cx.strokeStyle = "rgba(89,216,255,0.9)";
    cx.lineWidth = 3;
    cx.beginPath();
    cx.arc(P.x + P.w / 2, P.y + P.h / 2, 30 + Math.sin(time * 8) * 2, 0, Math.PI * 2);
    cx.stroke();
  }

  if (P.frozen > 0) {
    cx.fillStyle = "rgba(122,92,214,0.35)";
    cx.fillRect(P.x - 6, P.y - 8, P.w + 12, P.h + 12);
    cx.fillStyle = "#c9b6ff";
    cx.font = "bold 11px monospace";
    cx.fillText("MEETING STARTED", P.x - 34, P.y - 14);
  }

  if (P.atkT > 0 && !animated) {
    cx.fillStyle = "rgba(255,224,138,0.7)";
    cx.fillRect(P.face > 0 ? P.x + P.w : P.x - 36, P.y + 6, 36, P.h - 12);
  }

  if (P.dashT > 0 || P.slide > 0) {
    cx.fillStyle = "rgba(255,77,141,0.4)";
    cx.fillRect(P.x - P.face * 20, P.y, P.w, P.h);
  }
}

function drawParticles(cx) {
  for (const p of GameState.particles) {
    cx.globalAlpha = Math.max(0, p.t * 2);
    cx.fillStyle = p.col;
    cx.fillRect(p.x, p.y, 4, 4);
  }
  cx.globalAlpha = 1;
  cx.font = "bold 11px monospace";
  for (const f of GameState.floaters) {
    cx.globalAlpha = Math.min(1, f.t);
    cx.fillStyle = f.col;
    cx.fillText(f.txt, f.x, f.y);
  }
  cx.globalAlpha = 1;
}

function drawHUD(cx) {
  const { W, H, SAFEB, score, combo, gameTime, coffeeCount, playerName, msgTxt, msgT, msg2Txt, msg2T, switchBanner } = GameState;
  const P = GameState.P;
  const C = CHARS[GameState.charIdx];

  const isSmall = W < 540;

  // Hearts
  const heartSpacing = isSmall ? 18 : 26;
  const heartTop = isSmall ? 10 : 14;
  for (let i = 0; i < 5; i++) {
    cx.fillStyle = i < P.hp ? "#ff4d5e" : "#2a3566";
    const hx = (isSmall ? 10 : 16) + i * heartSpacing;
    if (isSmall) {
      cx.fillRect(hx, heartTop, 7, 7);
      cx.fillRect(hx + 8, heartTop, 7, 7);
      cx.fillRect(hx, heartTop + 5, 15, 6);
      cx.fillRect(hx + 3, heartTop + 11, 9, 4);
      cx.fillRect(hx + 6, heartTop + 15, 3, 2);
    } else {
      cx.fillRect(hx, heartTop, 9, 9);
      cx.fillRect(hx + 11, heartTop, 9, 9);
      cx.fillRect(hx, heartTop + 6, 20, 8);
      cx.fillRect(hx + 4, heartTop + 14, 12, 5);
      cx.fillRect(hx + 8, heartTop + 19, 4, 3);
    }
  }

  // Char plate
  if (isSmall) {
    cx.fillStyle = "rgba(14,19,43,0.85)";
    cx.fillRect(10, 32, 160, 32);
    cx.strokeStyle = "#2a3566";
    cx.strokeRect(10, 32, 160, 32);
    cx.font = "bold 11px monospace";
    cx.fillStyle = "#fff";
    cx.fillText(C.emoji + " " + C.name, 16, 46);
    if (C.cd > 0) {
      cx.fillStyle = "#1c2450";
      cx.fillRect(16, 52, 90, 4);
      cx.fillStyle = P.cool > 0 ? "#565f75" : "#b6f542";
      cx.fillRect(16, 52, 90 * (1 - Math.max(0, P.cool) / C.cd), 4);
    }

    // Compact meters in portrait
    if (C.id === "alejandro") meter(cx, 10, 68, "VUELO", P.flyMeter, "#9fb8e8");
    if (C.id === "paloma") meter(cx, 10, 68, "VUELO", P.stamina, "#ffffff");
    if (C.id === "beltran") meter(cx, 10, 68, "ESCUDO", P.shieldE, "#59d8ff");
    if (C.id === "joseluis") {
      cx.fillStyle = "#59d8ff";
      cx.font = "9px monospace";
      cx.fillText("IMPRESIONES: " + (3 - GameState.printed.length) + "/3", 10, 78);
    }
  } else {
    cx.fillStyle = "rgba(14,19,43,0.9)";
    cx.fillRect(16, 48, 280, 50);
    cx.strokeStyle = "#2a3566";
    cx.strokeRect(16, 48, 280, 50);
    cx.font = "15px monospace";
    cx.fillStyle = "#fff";
    cx.fillText(C.emoji + " " + C.name, 26, 68);
    cx.font = "10px monospace";
    cx.fillStyle = "#9fb4e8";
    cx.fillText(C.form + " · " + C.ab, 26, 82);

    // Cooldown bar
    if (C.cd > 0) {
      cx.fillStyle = "#1c2450";
      cx.fillRect(26, 88, 120, 5);
      cx.fillStyle = P.cool > 0 ? "#565f75" : "#b6f542";
      cx.fillRect(26, 88, 120 * (1 - Math.max(0, P.cool) / C.cd), 5);
    }

    // Meters
    if (C.id === "alejandro") meter(cx, 310, 58, "VUELO", P.flyMeter, "#9fb8e8");
    if (C.id === "paloma") meter(cx, 310, 58, "VUELO", P.stamina, "#ffffff");
    if (C.id === "beltran") meter(cx, 310, 58, "ESCUDO", P.shieldE, "#59d8ff");
    if (C.id === "joseluis") {
      cx.fillStyle = "#59d8ff";
      cx.font = "11px monospace";
      cx.fillText("IMPRESIONES: " + (3 - GameState.printed.length) + "/3", 310, 70);
    }
  }

  // Score & Time (top right)
  cx.textAlign = "right";
  cx.font = isSmall ? "bold 15px monospace" : "bold 18px monospace";
  cx.fillStyle = "#b6f542";
  cx.fillText(String(score).padStart(6, "0"), W - (isSmall ? 10 : 16), isSmall ? 22 : 30);
  cx.font = isSmall ? "10px monospace" : "12px monospace";
  cx.fillStyle = "#9fb4e8";
  cx.fillText("⏱ " + fmtT(gameTime) + " · ☕ " + coffeeCount, W - (isSmall ? 10 : 16), isSmall ? 36 : 48);

  if (combo > 1) {
    cx.font = isSmall ? "bold 13px monospace" : "bold 16px monospace";
    cx.fillStyle = "#ffc857";
    cx.fillText("COMBO x" + Math.min(5, combo), W - (isSmall ? 10 : 16), isSmall ? 52 : 70);
  }
  cx.textAlign = "left";

  if (msgT > 0) {
    cx.font = "bold 20px monospace";
    cx.textAlign = "center";
    cx.fillStyle = "#0b0e1a";
    cx.fillText(msgTxt, W / 2 + 2, 122);
    cx.fillStyle = "#ffc857";
    cx.fillText(msgTxt, W / 2, 120);
    cx.textAlign = "left";
  }

  if (msg2T > 0) {
    cx.font = "12px monospace";
    cx.textAlign = "center";
    cx.fillStyle = "#9fb4e8";
    cx.fillText(msg2Txt, W / 2, 148);
    cx.textAlign = "left";
  }

  if (switchBanner > 0) {
    const by = H - SAFEB - 34;
    cx.font = "bold 14px monospace";
    cx.textAlign = "center";
    cx.fillStyle = "#b6f542";
    cx.fillText("→ " + C.emoji + " " + C.name + " — " + C.ab, W / 2, by);
    cx.font = "11px monospace";
    cx.fillStyle = "#9fb4e8";
    cx.fillText(C.tip, W / 2, by + 16);
    cx.textAlign = "left";
  }

  // CRT Scanlines
  cx.fillStyle = "rgba(0,0,0,0.08)";
  for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 1);
}

function meter(cx, x, y, label, v, col) {
  cx.fillStyle = "#9fb4e8";
  cx.font = "9px monospace";
  cx.fillText(label, x, y + 2);
  cx.fillStyle = "#1c2450";
  cx.fillRect(x, y + 6, 90, 8);
  cx.fillStyle = col;
  cx.fillRect(x + 1, y + 7, 88 * Math.max(0, v), 6);
}

function drawLighting(cx) {
  cx.save();
  cx.globalCompositeOperation = "lighter";

  const time = GameState.time;
  const P = GameState.P;
  const C = CHARS[GameState.charIdx];

  // 1. Player ability / punch light
  if (P.atkT > 0 || anim.name === "attack") {
    const px = P.x + (P.face > 0 ? P.w + 16 : -16);
    const py = P.y + P.h / 2;
    const grad = cx.createRadialGradient(px, py, 4, px, py, 72);
    grad.addColorStop(0, "rgba(255, 190, 60, 0.4)");
    grad.addColorStop(0.4, "rgba(255, 70, 40, 0.18)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    cx.fillStyle = grad;
    cx.beginPath();
    cx.arc(px, py, 72, 0, Math.PI * 2);
    cx.fill();
  }

  // 2. Beltrán energy shield glow
  if (C.id === "beltran" && abilK() && P.shieldE > 0) {
    const px = P.x + P.w / 2;
    const py = P.y + P.h / 2;
    const grad = cx.createRadialGradient(px, py, 12, px, py, 52);
    grad.addColorStop(0, "rgba(89, 216, 255, 0.35)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    cx.fillStyle = grad;
    cx.beginPath();
    cx.arc(px, py, 52, 0, Math.PI * 2);
    cx.fill();
  }

  // 3. Coffees pulsing amber glow
  for (const cf of GameState.coffees) {
    if (cf.got) continue;
    const pulse = Math.sin(time * 3 + cf.t) * 4;
    const grad = cx.createRadialGradient(cf.x + 8, cf.y + 8, 2, cf.x + 8, cf.y + 8, 24 + pulse);
    grad.addColorStop(0, "rgba(255, 205, 80, 0.3)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    cx.fillStyle = grad;
    cx.beginPath();
    cx.arc(cf.x + 8, cf.y + 8, 24 + pulse, 0, Math.PI * 2);
    cx.fill();
  }

  // 4. Boss glow (The Email Chain)
  const boss = GameState.boss;
  if (boss.active && !boss.dead) {
    const bx = boss.x + 42;
    const by = boss.y + 28;
    const pulse = Math.sin(time * 4) * 8;
    const grad = cx.createRadialGradient(bx, by, 10, bx, by, 84 + pulse);
    grad.addColorStop(0, boss.hitFlash > 0 ? "rgba(255, 255, 255, 0.5)" : "rgba(230, 50, 80, 0.25)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    cx.fillStyle = grad;
    cx.beginPath();
    cx.arc(bx, by, 84 + pulse, 0, Math.PI * 2);
    cx.fill();
  }

  // 5. Projectiles glow
  for (const p of GameState.projectiles) {
    const col = p.kind === "404" ? "rgba(182, 245, 66, 0.35)" : "rgba(143, 163, 217, 0.35)";
    const grad = cx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 28);
    grad.addColorStop(0, col);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    cx.fillStyle = grad;
    cx.beginPath();
    cx.arc(p.x, p.y, 28, 0, Math.PI * 2);
    cx.fill();
  }

  cx.restore();
}
