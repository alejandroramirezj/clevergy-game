import { TILE, LH, ARENA_L, ARENA_R, GRAV } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { WORLDS, saveWorldProgress } from "../config/worlds.js";
import { GameState, addScore, kill, hurt, msg, fmtT } from "./state.js";
import { sfx } from "../engine/audio.js";
import { rectsHit, solidAt } from "../engine/physics.js";
import { abilK } from "../engine/input.js";
import { fetchGlobalLeaderboard, submitScore } from "./leaderboard.js";

export function hitFx(x, y) {
  for (let i = 0; i < 5; i++) {
    GameState.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      t: 0.3,
      col: "#ffe08a"
    });
  }
}

export function spawnEnemies(worldId = 1) {
  GameState.enemies = [];
  const addE = (type, x, y, hp = 1) =>
    GameState.enemies.push({ type, x: x * TILE, y: y * TILE, vx: 0, vy: 0, hp, t: Math.random() * 6, say: 0, ifr: 0 });

  const w = worldId || GameState.currentWorld || 1;

  if (w === 2) {
    // 2. Integration Jungle: Spiders and bugs right from the start!
    addE("spider", 12, 11, 1);
    addE("spider", 18, 9, 1);
    addE("spider", 25, 8, 2);
    addE("spider", 32, 10, 1);
    addE("spider", 40, 7, 2);
    addE("spider", 52, 11, 1);
    addE("spider", 60, 8, 2);
    addE("spider", 72, 9, 1);
    addE("spider", 85, 9, 2);
    addE("spider", 104, 10, 2);
    addE("spider", 112, 7, 2);
  } else if (w === 3) {
    // 3. Product Kingdom: Knights on ramparts
    addE("knight", 10, 12, 2);
    addE("knight", 18, 10, 2);
    addE("knight", 26, 9, 2);
    addE("knight", 35, 11, 2);
    addE("knight", 50, 11, 2);
    addE("knight", 65, 8, 3);
    addE("knight", 78, 10, 2);
    addE("knight", 95, 10, 3);
    addE("knight", 108, 9, 2);
    addE("knight", 116, 7, 3);
  } else if (w === 4) {
    // 4. Meeting Dimension: Floating call screens
    addE("ghost", 12, 10, 2);
    addE("ghost", 20, 8, 2);
    addE("ghost", 28, 11, 2);
    addE("ghost", 38, 7, 2);
    addE("ghost", 54, 9, 2);
    addE("ghost", 68, 7, 3);
    addE("ghost", 82, 8, 2);
    addE("ghost", 98, 9, 3);
    addE("ghost", 110, 8, 2);
  } else if (w === 5) {
    // 5. The Retreat: Deadline Clock Demons
    addE("clock", 10, 11, 2);
    addE("clock", 18, 9, 2);
    addE("clock", 26, 7, 2);
    addE("clock", 36, 10, 2);
    addE("clock", 50, 8, 3);
    addE("clock", 65, 6, 3);
    addE("clock", 78, 8, 3);
    addE("clock", 92, 7, 3);
    addE("clock", 105, 8, 3);
    addE("clock", 115, 6, 4);
  } else {
    // 1. The Office: Standard Email & Meeting
    addE("email", 16, 12);
    addE("email", 24, 11);
    addE("email", 30, 9);
    addE("email", 36, 8);
    addE("email", 40, 11);
    addE("email", 58, 9);
    addE("email", 65, 8);
    addE("meeting", 56, 11, 2);
    addE("meeting", 63, 9, 2);
    addE("meeting", 72, 10, 2);
    addE("email", 87, 8);
    addE("email", 96, 11);
    addE("email", 99, 10);
    addE("meeting", 101, 8, 2);
    addE("email", 114, 9);
    addE("meeting", 131, 9, 2);
  }
}

export function updateProjectiles(dt) {
  const boss = GameState.boss;
  for (const p of GameState.projectiles) {
    p.t -= dt;
    if (p.kind === "404") {
      p.vy += GRAV;
      p.x += p.vx;
      p.y += p.vy;
      let boom = solidAt(p.x, p.y + 6) || p.t <= 0;
      for (const e of GameState.enemies) {
        if (rectsHit(p.x - 6, p.y - 6, 12, 12, e.x, e.y, 28, 24)) {
          boom = true;
          break;
        }
      }
      if (!boom && boss.active && !boss.dead && rectsHit(p.x - 6, p.y - 6, 12, 12, boss.x, boss.y, 84, 58)) {
        boom = true;
      }
      if (boom) {
        p.t = 0;
        GameState.shake = Math.max(GameState.shake, 6);
        sfx(150, 0.2, "sawtooth", 0.07);
        GameState.hitboxes.push({ x: p.x - 45, y: p.y - 45, w: 90, h: 90, t: 0.15, dmg: 2 });
        GameState.floaters.push({ x: p.x - 16, y: p.y - 16, t: 1, txt: "ERROR 404", col: "#b6f542" });
        for (let i = 0; i < 10; i++) {
          GameState.particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.5) * 7,
            t: 0.5,
            col: "#b6f542"
          });
        }
      }
    } else if (p.kind === "wave") {
      p.r += 7;
      p.x += p.dir * 5;
      GameState.hitboxes.push({ x: p.x - p.r / 2, y: p.y - p.r / 2, w: p.r, h: p.r, t: 0.03, dmg: 1 });
      if (Math.random() < 0.5) {
        GameState.particles.push({
          x: p.x + (p.dir * p.r) / 2,
          y: p.y + (Math.random() - 0.5) * p.r,
          vx: p.dir * 2,
          vy: 0,
          t: 0.25,
          col: "#8fa3d9"
        });
      }
    }
  }
  GameState.projectiles = GameState.projectiles.filter((p) => p.t > 0);
}

export function updateMinions(dt) {
  const boss = GameState.boss;
  for (const m of GameState.minions) {
    m.t -= dt;
    m.vy = (m.vy || 0) + GRAV;
    m.vy = Math.min(m.vy, 10);

    if (m.kind === "broc") {
      let best = null;
      let bd = 280;
      for (const e of GameState.enemies) {
        const d = Math.hypot(e.x - m.x, e.y - m.y);
        if (d < bd) {
          bd = d;
          best = e;
        }
      }
      if (best) m.vx += best.x > m.x ? 0.15 : -0.15;
      m.vx = Math.max(-3.5, Math.min(3.5, m.vx));
      if (m.onG) {
        m.vy = -4.5;
        m.onG = false;
      }
    }
    m.x += m.vx;
    m.y += m.vy;

    if (m.vy > 0 && solidAt(m.x, m.y + 18)) {
      m.y = Math.floor((m.y + 18) / TILE) * TILE - 18;
      m.vy = 0;
      m.onG = true;
    }
    if (solidAt(m.x + Math.sign(m.vx) * 8, m.y + 8)) m.vx *= -1;

    for (const e of GameState.enemies) {
      if (e.ifr <= 0 && rectsHit(m.x - 8, m.y - 8, 20, 24, e.x, e.y, 28, 24)) {
        e.hp -= 1;
        e.ifr = 0.4;
        hitFx(e.x + 14, e.y + 10);
        if (m.kind === "worker") m.t = Math.min(m.t, 0.4);
      }
    }
    if (boss.active && !boss.dead && boss.ifr <= 0 && rectsHit(m.x - 8, m.y - 8, 20, 24, boss.x, boss.y, 84, 58)) {
      bossHit(1);
      m.t = 0;
    }
    if (m.y > LH * TILE + 60) m.t = 0;
  }
  GameState.minions = GameState.minions.filter((m) => m.t > 0);
}

export function updateEnemies(dt) {
  const P = GameState.P;
  const rushing = P.dashT > 0 || P.roll > 0 || P.slide > 0 || P.ball;

  for (const e of GameState.enemies) {
    e.t += dt;
    if (e.ifr > 0) e.ifr -= dt;
    const dx = P.x + P.w / 2 - (e.x + 15);
    const dy = P.y + P.h / 2 - (e.y + 12);
    const dist = Math.hypot(dx, dy);

    if (e.type === "email") {
      if (dist < 340) {
        e.vx += dx > 0 ? 0.08 : -0.08;
        e.vy += dy > 0 ? 0.05 : -0.05;
      }
      e.vx *= 0.97;
      e.vy *= 0.97;
      e.x += e.vx + Math.sin(e.t * 4) * 0.4;
      e.y += e.vy;
    } else if (e.type === "meeting") {
      e.x += Math.sin(e.t * 1.2) * 0.8;
      e.y += Math.cos(e.t * 1.6) * 0.5;
      if (dist < 260 && e.say <= 0) e.say = 3;
      if (e.say > 0) e.say -= dt;
      if (dist < 300) e.x += dx > 0 ? 0.5 : -0.5;
    } else if (e.type === "re") {
      e.vx += dx > 0 ? 0.12 : -0.12;
      e.vy += dy > 0 ? 0.09 : -0.09;
      e.vx = Math.max(-3, Math.min(3, e.vx));
      e.vy = Math.max(-3, Math.min(3, e.vy));
      e.x += e.vx;
      e.y += e.vy;
    }

    if (P.inv <= 0 && !rushing && rectsHit(P.x, P.y, P.w, P.h, e.x, e.y, 28, e.type === "meeting" ? 34 : 20)) {
      if (e.type === "meeting" && P.frozen <= 0) {
        if (!(CHARS[GameState.charIdx].id === "beltran" && abilK() && P.shieldE > 0)) {
          P.frozen = 1.5;
          msg("MEETING STARTED", 1.5);
          sfx(200, 0.3, "triangle", 0.07);
          GameState.floaters.push({ x: e.x, y: e.y - 24, t: 2, txt: "\"¿Tienes 5 minutos?\"", col: "#c9b6ff" });
          hurt(1);
        }
      } else {
        hurt(1);
      }
    }

    if (e.ifr <= 0) {
      for (const h of GameState.hitboxes) {
        if (rectsHit(h.x, h.y, h.w, h.h, e.x, e.y, 28, 24)) {
          e.hp -= h.dmg;
          e.ifr = 0.3;
          hitFx(e.x + 14, e.y + 10);
          if (h.micro) {
            GameState.floaters.push({ x: e.x, y: e.y - 12, t: 0.6, txt: "🔥", col: "#ff8f2e" });
          }
          break;
        }
      }
    }

    if (rushing && e.ifr <= 0 && rectsHit(P.x, P.y, P.w, P.h, e.x, e.y, 28, 24)) {
      e.hp -= 1;
      e.ifr = 0.35;
      hitFx(e.x + 14, e.y + 10);
    }
  }

  GameState.enemies = GameState.enemies.filter((e) => {
    if (e.hp <= 0) {
      kill();
      const pts = e.type === "meeting" ? 150 : e.type === "re" ? 50 : 100;
      addScore(pts, e.x, e.y, e.type === "meeting" ? "MEETING CANCELLED" : "DELETED");
      for (let i = 0; i < 8; i++) {
        GameState.particles.push({
          x: e.x + 14,
          y: e.y + 10,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          t: 0.5,
          col: "#dfe8ff"
        });
      }
      sfx(300, 0.1, "square", 0.05);
      return false;
    }
    return e.y < LH * TILE + 120;
  });
}

export function bossHit(dmg) {
  const boss = GameState.boss;
  boss.hp -= dmg;
  boss.ifr = 0.25;
  boss.hitFlash = 0.15;
  hitFx(boss.x + 40, boss.y + 28);
  addScore(80, boss.x + 30, boss.y - 10);
  sfx(220, 0.1, "square", 0.06);

  const alive = GameState.enemies.filter((e) => e.type === "re").length;
  const n = Math.min(2, 5 - alive);
  for (let i = 0; i < n; i++) {
    GameState.enemies.push({
      type: "re",
      x: boss.x + 30 + i * 20,
      y: boss.y + 20,
      vx: (Math.random() - 0.5) * 4,
      vy: -2,
      hp: 1,
      t: 0,
      ifr: 0
    });
    GameState.floaters.push({
      x: boss.x + 20 + i * 30,
      y: boss.y - 8,
      t: 1.2,
      txt: "RE: ".repeat(1 + Math.floor(Math.random() * 3)),
      col: "#ff8f98"
    });
  }
}

export function updateBoss(dt) {
  const boss = GameState.boss;
  const P = GameState.P;
  if (boss.dead) return;
  if (boss.ifr > 0) boss.ifr -= dt;

  if (!boss.active) {
    if (P.x > ARENA_L + 80) {
      boss.active = true;
      boss.intro = 2.2;
      GameState.shake = 8;
      msg(`⚠ JEFE: ${boss.name || "THE BOSS"} ⚠`, 2.5);
      sfx(120, 0.5, "sawtooth", 0.08);
    }
    return;
  }

  if (boss.intro > 0) {
    boss.intro -= dt;
    return;
  }

  boss.t += dt;
  if (boss.hitFlash > 0) boss.hitFlash -= dt;

  const cxq = P.x + P.w / 2;
  const spd = boss.hp <= 7 ? 1.5 : 1;

  if (boss.state === "hover") {
    boss.x += Math.sin(boss.t * 1.4) * 2.2 * spd;
    boss.y = 8 * TILE + Math.sin(boss.t * 2.2) * 30;
    if (boss.t > 2.6 / spd) {
      boss.state = "telegraph";
      boss.t = 0;
      sfx(180, 0.2);
    }
  } else if (boss.state === "telegraph") {
    boss.y -= 1.2;
    if (boss.t > 0.6) {
      boss.state = "dive";
      boss.t = 0;
      const a = Math.atan2(P.y - boss.y, cxq - (boss.x + 40));
      boss.vx = Math.cos(a) * 9 * spd;
      boss.vy = Math.sin(a) * 9 * spd;
      sfx(90, 0.3, "sawtooth", 0.08);
    }
  } else if (boss.state === "dive") {
    boss.x += boss.vx;
    boss.y += boss.vy;
    if (boss.y > 13 * TILE) {
      boss.y = 13 * TILE;
      boss.state = "recover";
      boss.t = 0;
      GameState.shake = 10;
      for (let i = 0; i < 10; i++) {
        GameState.particles.push({
          x: boss.x + 40,
          y: boss.y + 50,
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 5,
          t: 0.6,
          col: "#dfe8ff"
        });
      }
    }
    boss.x = Math.max(ARENA_L, Math.min(boss.x, ARENA_R - 90));
  } else if (boss.state === "recover") {
    if (boss.t > 0.9 / spd) {
      boss.state = "hover";
      boss.t = 0;
    }
  }

  const rushing = P.dashT > 0 || P.roll > 0 || P.slide > 0 || P.ball;
  if (P.inv <= 0 && !rushing && rectsHit(P.x, P.y, P.w, P.h, boss.x, boss.y, 84, 58)) {
    hurt(1);
  }

  if (boss.ifr <= 0) {
    for (const h of GameState.hitboxes) {
      if (rectsHit(h.x, h.y, h.w, h.h, boss.x, boss.y, 84, 58)) {
        bossHit(h.dmg);
        break;
      }
    }
    if (boss.ifr <= 0 && rushing && rectsHit(P.x, P.y, P.w, P.h, boss.x, boss.y, 84, 58)) {
      bossHit(1);
    }
  }

  if (boss.hp <= 0) {
    boss.dead = true;
    GameState.shake = 18;
    sfx(60, 0.8, "sawtooth", 0.1);
    kill();
    addScore(1000, boss.x + 20, boss.y, "INBOX ZERO ✔");
    for (let i = 0; i < 40; i++) {
      GameState.particles.push({
        x: boss.x + 42,
        y: boss.y + 28,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        t: 1,
        col: ["#dfe8ff", "#ff8f98", "#ffc857"][i % 3]
      });
    }
    GameState.enemies = GameState.enemies.filter((e) => e.type !== "re");
    GameState.fragment = { x: 126 * TILE, y: 13.4 * TILE, t: 0 };
    msg("EMAIL CHAIN DERROTADO", 3);
  }
}

export function winGame() {
  GameState.status = "win";
  const P = GameState.P;
  const timeBonus = Math.max(0, Math.round((300 - GameState.gameTime) * 10));
  const heartBonus = P.hp * 200;
  const deathPenalty = GameState.deaths * 250;
  const finalScore = Math.max(0, GameState.score + timeBonus + heartBonus - deathPenalty);

  let rank = "C";
  if (finalScore >= 6500 && GameState.deaths === 0) rank = "S";
  else if (finalScore >= 5000) rank = "A";
  else if (finalScore >= 3200) rank = "B";

  const rk = document.getElementById("rankTitle");
  if (rk) {
    rk.textContent = "RANK " + rank;
    rk.style.color = { S: "#ffc857", A: "#b6f542", B: "#59d8ff", C: "#9fb4e8" }[rank];
  }

  const curWorld = WORLDS.find((w) => w.id === GameState.currentWorld) || WORLDS[0];
  saveWorldProgress(curWorld.id, finalScore, rank);

  const winTxt = document.getElementById("winTxt");
  if (winTxt) {
    winTxt.innerHTML = `⭐ ¡MUNDO ${curWorld.id}: ${curWorld.name.toUpperCase()} DOMINADO!
${curWorld.fragmentName}
────────────────────────────
JUGADOR ............ ${GameState.playerName}
SCORE .............. ${String(GameState.score).padStart(6, " ")}
BONUS TIEMPO ....... +${timeBonus}  (${fmtT(GameState.gameTime)})
BONUS VIDAS ........ +${heartBonus}
MUERTES ............ -${deathPenalty}
CAFÉS .............. ${GameState.coffeeCount}/${GameState.coffees.length} ☕
────────────────────────────
TOTAL .............. <span style="color:#b6f542">${finalScore}</span>
`;
  }

  const curChar = CHARS[GameState.charIdx];
  const lbWin = document.getElementById("lbWin");
  if (lbWin) lbWin.innerHTML = `<div style="color:var(--cyan);margin:12px 0;font-size:13px;">⚡ Sincronizando con Cloudflare D1...</div>`;

  window.dispatchEvent(new CustomEvent("level_completed"));

  const winOv = document.getElementById("winOv");
  if (winOv) winOv.classList.remove("hidden");

  sfx(523, 0.15);
  setTimeout(() => sfx(659, 0.15), 150);
  setTimeout(() => sfx(784, 0.3), 300);

  submitScore({
    name: GameState.playerName,
    score: finalScore,
    character: curChar.id,
    char_name: curChar.name,
    time_seconds: Math.round(GameState.gameTime),
    rank: rank,
    deaths: GameState.deaths
  }).then(async () => {
    const list = await fetchGlobalLeaderboard();
    let html = `<div style="font-size:12px;color:var(--lime);margin:8px 0;">☁️ CLASIFICACIÓN GLOBAL (CLOUDFLARE D1)</div>`;
    html += `<table class="lb"><tr><th>#</th><th>NOMBRE</th><th>HÉROE</th><th>SCORE</th><th>TIEMPO</th><th>RANK</th></tr>`;
    (list || []).slice(0, 8).forEach((e, i) => {
      const isMe = (e.name || e.n) === GameState.playerName && (e.score || e.s) === finalScore;
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1);
      html += `<tr class="${isMe ? "me" : ""}">
        <td>${medal}</td>
        <td>${e.name || e.n}</td>
        <td>${CHARS.find(c => c.id === (e.character || e.c))?.emoji || "🪰"} ${e.char_name || e.name || ""}</td>
        <td style="color:var(--lime);font-weight:bold;">${e.score || e.s}</td>
        <td>${fmtT(e.time_seconds || e.t || 0)}</td>
        <td>${e.rank || e.r || "C"}</td>
      </tr>`;
    });
    html += "</table>";
    if (lbWin) lbWin.innerHTML = html;
  });
}
