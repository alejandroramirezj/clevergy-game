import { TILE, LW, LH, SIGNS } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { WORLDS } from "../config/worlds.js";
import { GameState, fmtT } from "./state.js";
import { grid } from "../engine/physics.js";
import { SPR, ANIM, anim, drawAnimatedPlayer } from "../engine/sprites.js";
import { abilK } from "../engine/input.js";

const WORLD_SIGNS = {
  1: [
    { x: 3, y: 14, t: "🏢 THE OFFICE — OFICINAS CENTRALES" },
    { x: 18, y: 14, t: "← mover · ↑ saltar" },
    { x: 44, y: 7, t: "FIREWALL DE RED: ¡CUIDADO!" },
    { x: 60, y: 14, t: "SUBE POR LOS ESCRITORIOS" },
    { x: 104, y: 14, t: "JEFE: THE EMAIL CHAIN (INBOX ZERO)" }
  ],
  2: [
    { x: 3, y: 14, t: "🌴 INTEGRATION JUNGLE — SELVA DE APIS" },
    { x: 18, y: 14, t: "LIANAS DE FIBRA ÓPTICA Y SERVIDORES" },
    { x: 44, y: 6, t: "TRONCO RAÍZ: SERVIDOR MAESTRO" },
    { x: 60, y: 14, t: "CUIDADO CON LOS WEBHOOKS CORRUPTOS" },
    { x: 104, y: 14, t: "JEFE: API GATEWAY BEAST (500 ERROR)" }
  ],
  3: [
    { x: 3, y: 14, t: "🏰 PRODUCT KINGDOM — FORTALEZA DEL ROADMAP" },
    { x: 18, y: 14, t: "ALMENAS DE SPRINT PLANNING" },
    { x: 44, y: 5, t: "TORREÓN DE CARTÓN: RELEASE V1.0" },
    { x: 60, y: 14, t: "FOSO DEL BACKLOG: ¡NO CAIGAS!" },
    { x: 104, y: 14, t: "JEFE: THE ROADMAP GOLEM" }
  ],
  4: [
    { x: 3, y: 14, t: "📺 MEETING DIMENSION — LLAMADAS INFINITAS" },
    { x: 18, y: 14, t: "MEETING EN CURSO: ¡SILENCIA TU MICRO!" },
    { x: 44, y: 4, t: "MONOLITO DE CALENDARIOS SIMULTÁNEOS" },
    { x: 60, y: 14, t: "SALTO DE ALTA VELOCIDAD Y CERO LATENCIA" },
    { x: 104, y: 14, t: "JEFE: ALL-HANDS MONSTER" }
  ],
  5: [
    { x: 3, y: 14, t: "🔥 THE RETREAT — EL CAMPAMENTO FINAL" },
    { x: 18, y: 14, t: "CUMBRE NEVADA: 0 DÍAS RESTANTES" },
    { x: 44, y: 3, t: "EL ACANTILADO DEL RETREAT" },
    { x: 60, y: 14, t: "LA HOGUERA DEL EQUIPO CLEVERGY" },
    { x: 104, y: 14, t: "BOSS FINAL DEFINITIVO: THE DEADLINE" }
  ]
};

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
    // 2. Integration Jungle: Deep green jungle with matrix code rain & swinging vines
    cx.fillStyle = "#041409";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);

    // Giant tree trunks
    for (let i = Math.floor(camX / 200); i < (camX + W) / 200 + 1; i++) {
      const tx = i * 200 + 20;
      cx.fillStyle = "#0a2614";
      cx.fillRect(tx, topY, 52, H + 8);
      // Bark texture
      cx.fillStyle = "#11381e";
      cx.fillRect(tx + 8, topY, 6, H + 8);
      cx.fillRect(tx + 30, topY, 8, H + 8);

      // Hanging fiber-optic vines with pulse
      const vineSwing = Math.sin(time * 2 + i) * 16;
      cx.strokeStyle = "#1b592f";
      cx.lineWidth = 4;
      cx.beginPath();
      cx.moveTo(tx + 26, topY);
      cx.quadraticCurveTo(tx + 26 + vineSwing, topY + 120, tx + 14 + vineSwing * 1.4, topY + 220);
      cx.stroke();
      // Glowing green terminal node at end of vine
      cx.fillStyle = "#42f584";
      cx.fillRect(tx + 11 + vineSwing * 1.4, topY + 220, 8, 12);
    }

    // Matrix digital rain particles
    cx.fillStyle = "rgba(66, 245, 132, 0.35)";
    cx.font = "bold 10px monospace";
    for (let d = 0; d < 18; d++) {
      const mx = ((d * 89 + 30) % (W + 200)) + camX - 100;
      const my = topY + ((d * 53 + time * 140) % (H + 50));
      cx.fillText(d % 2 === 0 ? "01" : "API", mx, my);
    }
  } else if (wId === 3) {
    // 3. Product Kingdom: Medieval Castle Towers, Torches, and Roadmap Banners
    cx.fillStyle = "#0c0e1e";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);

    // Castle towers with battlements
    for (let i = Math.floor(camX / 260); i < (camX + W) / 260 + 1; i++) {
      const tx = i * 260 + 20;
      cx.fillStyle = "#171a36";
      cx.fillRect(tx, topY + 40, 130, H);
      // Crenellations
      cx.fillRect(tx - 4, topY + 24, 24, 20);
      cx.fillRect(tx + 34, topY + 24, 24, 20);
      cx.fillRect(tx + 72, topY + 24, 24, 20);
      cx.fillRect(tx + 110, topY + 24, 24, 20);

      // Gold Roadmap Banner
      cx.fillStyle = "#ffc857";
      cx.fillRect(tx + 45, topY + 80, 40, 60);
      cx.fillStyle = "#171a36";
      cx.font = "bold 9px monospace";
      cx.fillText("Q4", tx + 57, topY + 105);
      cx.fillText("MAP", tx + 53, topY + 120);

      // Flickering Wall Torches with flame particles
      const torchX = tx + 20;
      const torchY = topY + 75;
      cx.fillStyle = "#4a3520";
      cx.fillRect(torchX, torchY, 4, 14);
      // Flame
      cx.fillStyle = Math.sin(time * 15 + i) > 0 ? "#ff4d5e" : "#ffc857";
      cx.beginPath();
      cx.arc(torchX + 2, torchY - 3 + Math.sin(time * 10 + i) * 2, 5, 0, Math.PI * 2);
      cx.fill();
    }
  } else if (wId === 4) {
    // 4. Meeting Dimension: Neon synthwave cyber abyss with floating video call monitors
    cx.fillStyle = "#120320";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);

    // Neon purple perspective grid
    cx.strokeStyle = "rgba(216,89,255,0.18)";
    cx.lineWidth = 1;
    for (let y = 0; y < H; y += 38) {
      cx.beginPath();
      cx.moveTo(camX, camY + y);
      cx.lineTo(camX + W, camY + y);
      cx.stroke();
    }

    // Floating video conference frames
    for (let i = Math.floor(camX / 220); i < (camX + W) / 220 + 1; i++) {
      const fx = i * 220 + 30;
      const fy = camY + 40 + Math.sin(time * 2 + i) * 12;
      cx.fillStyle = "rgba(35, 12, 56, 0.75)";
      cx.fillRect(fx, fy, 130, 85);
      cx.strokeStyle = "#d859ff";
      cx.strokeRect(fx, fy, 130, 85);

      // Red recording dot
      cx.fillStyle = "#ff4d5e";
      cx.beginPath();
      cx.arc(fx + 14, fy + 14, 4, 0, Math.PI * 2);
      cx.fill();

      // Video label
      cx.fillStyle = "#d859ff";
      cx.font = "bold 9px monospace";
      cx.fillText("● ALL-HANDS CALL", fx + 24, fy + 17);
      cx.fillStyle = "#fff";
      cx.fillText(i % 2 === 0 ? "🎙️ [MUTED]" : "🎥 [CAM ON]", fx + 16, fy + 65);
    }
  } else if (wId === 5) {
    // 5. The Retreat: Giant Full Moon, Snowy Mountains, Falling Snow & Campfire
    cx.fillStyle = "#050814";
    cx.fillRect(camX - 4, topY, W + 8, H + 8);

    // GIANT LUMINOUS FULL MOON in the sky
    const moonX = camX + W - 140;
    const moonY = camY + 60;
    cx.fillStyle = "rgba(240, 245, 255, 0.95)";
    cx.beginPath();
    cx.arc(moonX, moonY, 36, 0, Math.PI * 2);
    cx.fill();
    cx.fillStyle = "rgba(200, 220, 255, 0.2)";
    cx.beginPath();
    cx.arc(moonX, moonY, 52, 0, Math.PI * 2);
    cx.fill();

    // Snowy mountain peaks
    for (let i = Math.floor(camX / 280); i < (camX + W) / 280 + 2; i++) {
      const mx = i * 280;
      // Dark mountain rock
      cx.fillStyle = "#0f1629";
      cx.beginPath();
      cx.moveTo(mx - 90, camY + H);
      cx.lineTo(mx + 60, camY + 45);
      cx.lineTo(mx + 210, camY + H);
      cx.fill();
      // Pure white snow cap
      cx.fillStyle = "#e6f0ff";
      cx.beginPath();
      cx.moveTo(mx + 30, camY + 80);
      cx.lineTo(mx + 60, camY + 45);
      cx.lineTo(mx + 90, camY + 80);
      cx.fill();
    }

    // Drifting Snowflakes falling continuously across the screen
    cx.fillStyle = "rgba(255, 255, 255, 0.85)";
    for (let s = 0; s < 45; s++) {
      const sx = ((s * 113 + time * 35) % (W + 100)) + camX - 50;
      const sy = camY + ((s * 47 + time * 55) % H);
      const sSize = (s % 3) + 1.5;
      cx.fillRect(sx, sy, sSize, sSize);
    }
  } else {
    // 1. The Office: default office cubicles & skyscraper skyline
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

  // Floating ambient dust / glow motes
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
  const signs = WORLD_SIGNS[GameState.currentWorld || 1] || WORLD_SIGNS[1];
  cx.font = "bold 11px monospace";
  for (const s of signs) {
    const x = s.x * TILE, y = s.y * TILE;
    cx.fillStyle = "#090d1f";
    cx.fillRect(x - 6, y - 16, s.t.length * 6.8 + 14, 22);
    cx.strokeStyle = "#59d8ff";
    cx.lineWidth = 1;
    cx.strokeRect(x - 6, y - 16, s.t.length * 6.8 + 14, 22);
    cx.fillStyle = "#ffffff";
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

// ---------------- Themed Enemies per World ----------------
function drawJungleSpider(cx, x, y, t) {
  // Webhook cyber spider
  cx.fillStyle = "#1e7e34";
  cx.beginPath();
  cx.arc(x + 12, y + 10, 10, 0, Math.PI * 2);
  cx.fill();
  cx.strokeStyle = "#42f584";
  cx.lineWidth = 2;
  // 8 legs
  for (let i = 0; i < 4; i++) {
    const legW = Math.sin(t * 8 + i) * 4;
    cx.beginPath();
    cx.moveTo(x + 6, y + 8 + i * 3);
    cx.lineTo(x - 8, y + legW + i * 4);
    cx.stroke();
    cx.beginPath();
    cx.moveTo(x + 18, y + 8 + i * 3);
    cx.lineTo(x + 32, y + legW + i * 4);
    cx.stroke();
  }
  cx.fillStyle = "#42f584";
  cx.fillRect(x + 8, y + 8, 3, 3);
  cx.fillRect(x + 14, y + 8, 3, 3);
}

function drawKnightEnemy(cx, x, y, t) {
  // Scope Creep Knight
  cx.fillStyle = "#4a5568";
  cx.fillRect(x + 4, y, 16, 20); // Helmet
  cx.fillStyle = "#ff4d5e";
  cx.fillRect(x + 6, y + 7, 12, 3); // Red visor
  cx.fillStyle = "#c53030";
  cx.fillRect(x + 9, y - 5, 6, 6); // Plume
  // Shield
  cx.fillStyle = "#d69e2e";
  cx.fillRect(x + 18, y + 5, 8, 14);
  cx.fillStyle = "#2d3748";
  cx.fillRect(x + 20, y + 7, 4, 10);
}

function drawMeetingGhost(cx, x, y, t) {
  // Floating Mute Window
  cx.fillStyle = "#2d124d";
  cx.fillRect(x, y, 26, 22);
  cx.strokeStyle = "#d859ff";
  cx.strokeRect(x, y, 26, 22);
  // Red mic crossed
  cx.fillStyle = "#ff4d5e";
  cx.fillRect(x + 10, y + 6, 6, 8);
  cx.fillRect(x + 7, y + 15, 12, 2);
  cx.strokeStyle = "#fff";
  cx.beginPath();
  cx.moveTo(x + 6, y + 4);
  cx.lineTo(x + 20, y + 18);
  cx.stroke();
}

function drawClockDemon(cx, x, y, t) {
  // Deadline Clock Demon
  cx.fillStyle = "#1a0505";
  cx.beginPath();
  cx.arc(x + 12, y + 12, 11, 0, Math.PI * 2);
  cx.fill();
  cx.strokeStyle = "#ff4d5e";
  cx.lineWidth = 2;
  cx.stroke();
  // Clock hands spinning fast
  const hAngle = t * 6;
  cx.beginPath();
  cx.moveTo(x + 12, y + 12);
  cx.lineTo(x + 12 + Math.cos(hAngle) * 7, y + 12 + Math.sin(hAngle) * 7);
  cx.stroke();
  // Glowing horns
  cx.fillStyle = "#ff4d5e";
  cx.fillRect(x + 3, y - 3, 4, 5);
  cx.fillRect(x + 17, y - 3, 4, 5);
}

function drawEnemies(cx) {
  const wId = GameState.currentWorld || 1;
  for (const e of GameState.enemies) {
    const bob = Math.sin(e.t * 4) * 3;
    if (e.ifr > 0.15) cx.globalAlpha = 0.5;

    if (wId === 2) {
      drawJungleSpider(cx, e.x, e.y + bob, e.t);
    } else if (wId === 3) {
      drawKnightEnemy(cx, e.x, e.y + bob, e.t);
    } else if (wId === 4) {
      drawMeetingGhost(cx, e.x, e.y + bob, e.t);
    } else if (wId === 5) {
      drawClockDemon(cx, e.x, e.y + bob, e.t);
    } else {
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
    }
    cx.globalAlpha = 1;
  }
}

// ---------------- 5 Distinct World Bosses ----------------
function drawBoss(cx) {
  const boss = GameState.boss;
  const time = GameState.time;
  const wId = GameState.currentWorld || 1;
  if (boss.dead) return;
  if (!boss.active) {
    cx.globalAlpha = 0.35;
    drawSpecificBoss(cx, wId, boss.x, boss.y + Math.sin(time) * 6, boss);
    cx.globalAlpha = 1;
    return;
  }
  if (boss.hitFlash > 0) cx.globalAlpha = 0.5;
  drawSpecificBoss(cx, wId, boss.x, boss.y, boss);
  cx.globalAlpha = 1;

  // Boss HP Bar
  cx.fillStyle = "#0e132b";
  cx.fillRect(boss.x - 8, boss.y - 24, 116, 12);
  cx.fillStyle = "#ff4d5e";
  const hpRatio = Math.max(0, boss.hp / (boss.maxHp || 80));
  cx.fillRect(boss.x - 6, boss.y - 22, 112 * hpRatio, 8);
  cx.fillStyle = "#fff";
  cx.font = "bold 9px monospace";
  cx.fillText(boss.name || "BOSS", boss.x - 4, boss.y - 28);
  if (boss.intro > 0) {
    cx.fillStyle = "#ff4d5e";
    cx.font = "bold 14px monospace";
    const roarText = {
      1: "«RE: RE: RE: URGENTE»",
      2: "«HTTP 500: GATEWAY TIMEOUT»",
      3: "«SCOPE CREEP INEVITABLE»",
      4: "«CAN EVERYONE SEE MY SCREEN?»",
      5: "«0 DAYS REMAINING — DEADLINE!»"
    }[wId] || "«WARNING»";
    cx.fillText(roarText, boss.x - 36, boss.y - 42);
  }
}

function drawSpecificBoss(cx, wId, x, y, boss) {
  if (wId === 2) {
    drawJungleBoss(cx, x, y, boss);
  } else if (wId === 3) {
    drawCastleBoss(cx, x, y, boss);
  } else if (wId === 4) {
    drawMeetingBoss(cx, x, y, boss);
  } else if (wId === 5) {
    drawDeadlineBoss(cx, x, y, boss);
  } else {
    drawEnvelope(cx, x, y);
  }
}

// 1. World 1: Email Chain
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

// 2. World 2: API Gateway Beast
function drawJungleBoss(cx, x, y, boss) {
  // Green Cyber Server Rack Beast
  cx.fillStyle = "#0c2616";
  cx.fillRect(x, y, 92, 68);
  cx.strokeStyle = "#42f584";
  cx.lineWidth = 3;
  cx.strokeRect(x, y, 92, 68);

  // Antenna horns with electric sparks
  cx.fillStyle = "#42f584";
  cx.fillRect(x + 12, y - 18, 5, 18);
  cx.fillRect(x + 75, y - 18, 5, 18);
  cx.fillStyle = "#affcc7";
  cx.beginPath();
  cx.arc(x + 14, y - 20, 6, 0, Math.PI * 2);
  cx.arc(x + 77, y - 20, 6, 0, Math.PI * 2);
  cx.fill();

  // Screen: 500 GATEWAY ERROR
  cx.fillStyle = "#05130b";
  cx.fillRect(x + 12, y + 12, 68, 26);
  cx.fillStyle = "#ff4d5e";
  cx.font = "bold 11px monospace";
  cx.fillText("ERR 500: API", x + 15, y + 29);

  // Blinking server LEDs
  for (let i = 0; i < 4; i++) {
    cx.fillStyle = (i % 2 === 0) ? "#42f584" : "#ffc857";
    cx.fillRect(x + 14 + i * 16, y + 48, 8, 8);
  }
}

// 3. World 3: The Roadmap Golem
function drawCastleBoss(cx, x, y, boss) {
  // Stone & Cardboard Fortress Golem
  cx.fillStyle = "#2d325a";
  cx.fillRect(x, y, 88, 70); // Stone body
  cx.strokeStyle = "#464c80";
  cx.lineWidth = 3;
  cx.strokeRect(x, y, 88, 70);

  // Golden Medieval Royal Crown
  cx.fillStyle = "#ffc857";
  cx.beginPath();
  cx.moveTo(x + 16, y);
  cx.lineTo(x + 16, y - 16);
  cx.lineTo(x + 30, y - 8);
  cx.lineTo(x + 44, y - 20);
  cx.lineTo(x + 58, y - 8);
  cx.lineTo(x + 72, y - 16);
  cx.lineTo(x + 72, y);
  cx.fill();

  // Cardboard chest plaque "ROADMAP"
  cx.fillStyle = "#a88242";
  cx.fillRect(x + 14, y + 20, 60, 24);
  cx.fillStyle = "#fff";
  cx.font = "bold 10px monospace";
  cx.fillText("Q4 ROADMAP", x + 18, y + 36);

  // Angry yellow glowing eyes
  cx.fillStyle = "#ffc857";
  cx.fillRect(x + 22, y + 6, 12, 6);
  cx.fillRect(x + 54, y + 6, 12, 6);
}

// 4. World 4: All-Hands Monster
function drawMeetingBoss(cx, x, y, boss) {
  // Cyber Purple Conference Monitor
  cx.fillStyle = "#250a3d";
  cx.fillRect(x, y, 94, 68);
  cx.strokeStyle = "#d859ff";
  cx.lineWidth = 3;
  cx.strokeRect(x, y, 94, 68);

  // Top Webcam Red Record Dot
  cx.fillStyle = "#ff4d5e";
  cx.beginPath();
  cx.arc(x + 47, y - 6, 5, 0, Math.PI * 2);
  cx.fill();

  // Giant Eye: Crossed Red Microphone
  cx.fillStyle = "#ff4d5e";
  cx.fillRect(x + 38, y + 16, 18, 22);
  cx.fillRect(x + 32, y + 42, 30, 4);
  cx.strokeStyle = "#fff";
  cx.lineWidth = 3;
  cx.beginPath();
  cx.moveTo(x + 26, y + 12);
  cx.lineTo(x + 68, y + 50);
  cx.stroke();

  // Subtitle
  cx.fillStyle = "#d859ff";
  cx.font = "9px monospace";
  cx.fillText("ALL-HANDS (MUTED)", x + 8, y + 60);
}

// 5. World 5: THE DEADLINE (0 DAYS REMAINING) — Final Boss from poster!
function drawDeadlineBoss(cx, x, y, boss) {
  const time = GameState.time;
  // Giant dark metallic mechanical beast
  cx.fillStyle = "#0c0d17";
  cx.fillRect(x - 6, y - 6, 106, 80);
  cx.strokeStyle = "#ff4d5e";
  cx.lineWidth = 4;
  cx.strokeRect(x - 6, y - 6, 106, 80);

  // Twin Smoke Stacks
  cx.fillStyle = "#202436";
  cx.fillRect(x + 6, y - 22, 14, 18);
  cx.fillRect(x + 74, y - 22, 14, 18);
  // Smoke puff
  cx.fillStyle = "rgba(255, 77, 94, 0.4)";
  cx.beginPath();
  cx.arc(x + 13, y - 26 + Math.sin(time * 6) * 3, 8, 0, Math.PI * 2);
  cx.arc(x + 81, y - 26 + Math.cos(time * 6) * 3, 8, 0, Math.PI * 2);
  cx.fill();

  // HUGE BRIGHT RED DIGITAL LED SCREEN: 0 DAYS REMAINING
  cx.fillStyle = "#1a0307";
  cx.fillRect(x + 4, y + 12, 86, 32);
  cx.strokeStyle = "#ff1744";
  cx.lineWidth = 1;
  cx.strokeRect(x + 4, y + 12, 86, 32);

  cx.fillStyle = "#ff1744";
  cx.font = "bold 13px monospace";
  cx.fillText("0 DAYS", x + 18, y + 27);
  cx.font = "bold 8px monospace";
  cx.fillText("REMAINING", x + 20, y + 38);

  // Sharp glowing angry robotic eyes
  cx.fillStyle = "#ff1744";
  cx.beginPath();
  cx.moveTo(x + 14, y + 2);
  cx.lineTo(x + 34, y + 6);
  cx.lineTo(x + 20, y + 9);
  cx.fill();
  cx.beginPath();
  cx.moveTo(x + 80, y + 2);
  cx.lineTo(x + 60, y + 6);
  cx.lineTo(x + 74, y + 9);
  cx.fill();

  // Razor metal teeth
  cx.fillStyle = "#fff";
  for (let i = 0; i < 5; i++) {
    cx.beginPath();
    cx.moveTo(x + 16 + i * 13, y + 54);
    cx.lineTo(x + 22 + i * 13, y + 64);
    cx.lineTo(x + 28 + i * 13, y + 54);
    cx.fill();
  }
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

  // World Badge
  const curW = WORLDS.find(w => w.id === (GameState.currentWorld || 1)) || WORLDS[0];
  const badgeTop = isSmall ? 28 : 38;
  const badgeH = isSmall ? 15 : 18;
  const badgeW = isSmall ? 170 : 280;
  cx.fillStyle = "rgba(10, 14, 30, 0.9)";
  cx.fillRect(isSmall ? 10 : 16, badgeTop, badgeW, badgeH);
  cx.strokeStyle = curW.accentColor || "#59d8ff";
  cx.lineWidth = 1;
  cx.strokeRect(isSmall ? 10 : 16, badgeTop, badgeW, badgeH);
  cx.fillStyle = curW.accentColor || "#59d8ff";
  cx.font = isSmall ? "bold 9px monospace" : "bold 11px monospace";
  cx.fillText(`${curW.iconEmoji} MUNDO ${curW.id}: ${curW.name.toUpperCase()}`, (isSmall ? 10 : 16) + 6, badgeTop + (isSmall ? 11 : 13));

  // Char plate
  if (isSmall) {
    const plateY = 46;
    cx.fillStyle = "rgba(14,19,43,0.85)";
    cx.fillRect(10, plateY, 160, 32);
    cx.strokeStyle = "#2a3566";
    cx.strokeRect(10, plateY, 160, 32);
    cx.font = "bold 11px monospace";
    cx.fillStyle = "#fff";
    cx.fillText(C.emoji + " " + C.name, 16, plateY + 14);
    if (C.cd > 0) {
      cx.fillStyle = "#1c2450";
      cx.fillRect(16, plateY + 20, 90, 4);
      cx.fillStyle = P.cool > 0 ? "#565f75" : "#b6f542";
      cx.fillRect(16, plateY + 20, 90 * (1 - Math.max(0, P.cool) / C.cd), 4);
    }

    // Compact meters in portrait
    if (C.id === "alejandro") meter(cx, 10, plateY + 36, "VUELO", P.flyMeter, "#9fb8e8");
    if (C.id === "paloma") meter(cx, 10, plateY + 36, "VUELO", P.stamina, "#ffffff");
    if (C.id === "beltran") meter(cx, 10, plateY + 36, "ESCUDO", P.shieldE, "#59d8ff");
    if (C.id === "joseluis") {
      cx.fillStyle = "#59d8ff";
      cx.font = "9px monospace";
      cx.fillText("IMPRESIONES: " + (3 - GameState.printed.length) + "/3", 10, plateY + 44);
    }
  } else {
    const plateY = 60;
    cx.fillStyle = "rgba(14,19,43,0.9)";
    cx.fillRect(16, plateY, 280, 50);
    cx.strokeStyle = "#2a3566";
    cx.strokeRect(16, plateY, 280, 50);
    cx.font = "15px monospace";
    cx.fillStyle = "#fff";
    cx.fillText(C.emoji + " " + C.name, 26, plateY + 20);
    cx.font = "10px monospace";
    cx.fillStyle = "#9fb4e8";
    cx.fillText(C.form + " · " + C.ab, 26, plateY + 34);

    // Cooldown bar
    if (C.cd > 0) {
      cx.fillStyle = "#1c2450";
      cx.fillRect(26, plateY + 40, 120, 5);
      cx.fillStyle = P.cool > 0 ? "#565f75" : "#b6f542";
      cx.fillRect(26, plateY + 40, 120 * (1 - Math.max(0, P.cool) / C.cd), 5);
    }

    // Meters
    if (C.id === "alejandro") meter(cx, 310, plateY + 10, "VUELO", P.flyMeter, "#9fb8e8");
    if (C.id === "paloma") meter(cx, 310, plateY + 10, "VUELO", P.stamina, "#ffffff");
    if (C.id === "beltran") meter(cx, 310, plateY + 10, "ESCUDO", P.shieldE, "#59d8ff");
    if (C.id === "joseluis") {
      cx.fillStyle = "#59d8ff";
      cx.font = "11px monospace";
      cx.fillText("IMPRESIONES: " + (3 - GameState.printed.length) + "/3", 310, plateY + 22);
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
