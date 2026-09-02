import { TILE, GRAV, LW, LH, CHECKPOINTS, ARENA_L, ARENA_R } from "./config/constants.js";
import { CHARS } from "./config/characters.js";
import { initLevelGrid, moveX, moveY, touchingWall, rectsHit, tileAt } from "./engine/physics.js";
import { sfx, startMusic, toggleMusic } from "./engine/audio.js";
import { initSprites, updateAnim, anim } from "./engine/sprites.js";
import { initInput, left, right, upK, downK, jumpK, abilK } from "./engine/input.js";
import { GameState, initCoffees, hurt, respawn, msg, msg2, switchChar, addScore } from "./game/state.js";
import { doAbility } from "./game/abilities.js";
import { draw } from "./game/renderer.js";
import { initOverlays } from "./ui/overlays.js";
import { initWorldMap } from "./ui/worldMap.js";
import { loadWorld } from "./game/levelLoader.js";
import { updateProjectiles, updateMinions, updateEnemies, updateBoss, winGame } from "./game/enemies.js";
import { startFight, updateFight, drawFight, FightState } from "./game/fighting.js";
import { showFightLobby, hideFightLobby, drawFightLobby, updateFightLobby } from "./ui/fightLobby.js";
import { disconnect as netDisconnect } from "./game/fightNet.js";

const cv = document.getElementById("cv");
const cx = cv.getContext("2d");

function fitCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const iw = window.innerWidth, ih = window.innerHeight;
  const isPortrait = ih > iw;

  // Selection Lobby: fullscreen menu mode
  if (GameState.gameMode === "fighting") {
    document.body.classList.remove("gameboy-mode");
    document.getElementById("touch")?.classList.add("hidden");
    document.getElementById("gameboyDeck")?.classList.add("hidden");

    const H = 540;
    let W = Math.round(H * (iw / ih));
    W = Math.max(960, Math.min(1600, W));

    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.position = "fixed";
    cv.style.left = "0";
    cv.style.top = "0";
    cv.style.width = iw + "px";
    cv.style.height = ih + "px";

    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.imageSmoothingEnabled = false;

    GameState.W = W;
    GameState.H = H;
    GameState.DPR = dpr;
    GameState.SAFEB = 0;
    return;
  }

  // Active Gameplay (Platformer or Fighting Active)
  if (isPortrait) {
    document.body.classList.add("gameboy-mode");
    document.getElementById("touch")?.classList.add("hidden");
    document.getElementById("gameboyDeck")?.classList.remove("hidden");

    // Game Boy screen takes ~48% of screen height
    const screenH = Math.round(ih * 0.48);
    const screenW = iw;

    const H = 340;
    const W = Math.round(H * (screenW / screenH));

    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.position = "relative";
    cv.style.left = "auto";
    cv.style.top = "auto";
    cv.style.width = screenW + "px";
    cv.style.height = screenH + "px";

    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.imageSmoothingEnabled = false;

    GameState.W = W;
    GameState.H = H;
    GameState.DPR = dpr;
    GameState.SAFEB = 0;
  } else {
    document.body.classList.remove("gameboy-mode");
    document.getElementById("gameboyDeck")?.classList.add("hidden");
    const coarse = window.matchMedia("(pointer:coarse)").matches;
    if (coarse) {
      document.getElementById("touch")?.classList.remove("hidden");
    } else {
      document.getElementById("touch")?.classList.add("hidden");
    }
    const H = 540;
    let W = Math.round(H * (iw / ih));
    W = Math.max(700, Math.min(1600, W));
    const SAFEB = coarse ? 96 : 0;

    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.position = "fixed";
    cv.style.left = "0";
    cv.style.top = "0";
    cv.style.width = iw + "px";
    cv.style.height = ih + "px";

    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.imageSmoothingEnabled = false;

    GameState.W = W;
    GameState.H = H;
    GameState.DPR = dpr;
    GameState.SAFEB = SAFEB;
  }
}

window.addEventListener("resize", fitCanvas);
window.addEventListener("orientationchange", () => setTimeout(fitCanvas, 200));

function startGame(worldId = 1) {
  document.getElementById("menuOv")?.classList.add("hidden");
  document.getElementById("worldMapOv")?.classList.add("hidden");
  document.getElementById("worldCardModal")?.classList.add("hidden");
  document.getElementById("bootOv")?.classList.add("hidden");
  document.getElementById("lbOv")?.classList.add("hidden");
  document.getElementById("ctrlOv")?.classList.add("hidden");
  document.getElementById("teamOv")?.classList.add("hidden");
  document.getElementById("winOv")?.classList.add("hidden");
  document.getElementById("goOv")?.classList.add("hidden");

  GameState.status = "play";
  GameState.worldMapOpen = false;
  GameState.currentWorld = worldId;

  if (worldId === 6) {
    GameState.gameMode = "fighting";
    fitCanvas();
    showFightLobby(
      (p1Char, p2Char, mode) => {
        // Switch to combat mode and resize canvas
        GameState.gameMode = "fighting_active";
        fitCanvas();
        startFight(p1Char, p2Char, mode, () => {
          netDisconnect();
          GameState.gameMode = "platformer";
          worldMap.showWorldMap();
          fitCanvas();
        });
      },
      () => {
        // Back to map
        netDisconnect();
        GameState.gameMode = "platformer";
        worldMap.showWorldMap();
        fitCanvas();
      }
    );
  } else {
    GameState.gameMode = "platformer";
    fitCanvas();
    loadWorld(worldId);
    startMusic(() => GameState.status);
    anim.lock = null;
    anim.name = "idle";
    anim.frame = 0;
    anim.t = 0;
    sfx(880, 0.1);
    sfx(1174, 0.15);
    msg2(CHARS[GameState.charIdx].tip, 4);
  }
}

function update(dt) {
  if (GameState.teamOpen) return;
  const P = GameState.P;
  GameState.time += dt;
  GameState.gameTime += dt;

  const C = CHARS[GameState.charIdx];
  updateAnim(dt, C.id, P);

  if (GameState.msgT > 0) GameState.msgT -= dt;
  if (GameState.msg2T > 0) GameState.msg2T -= dt;
  if (GameState.switchBanner > 0) GameState.switchBanner -= dt;
  if (GameState.shake > 0) GameState.shake *= 0.85;
  if (GameState.comboT > 0) {
    GameState.comboT -= dt;
    if (GameState.comboT <= 0) GameState.combo = 0;
  }
  if (P.cool > 0) P.cool -= dt;
  if (P.spdBoost > 0) P.spdBoost -= dt;

  const frozen = P.frozen > 0;
  if (frozen) P.frozen -= dt;
  if (P.inv > 0) P.inv -= dt;
  if (P.atkT > 0) P.atkT -= dt;

  // Beltrán shield energy
  const shieldOn = C.id === "beltran" && abilK() && P.shieldE > 0 && !frozen;
  if (shieldOn) P.shieldE -= dt * 0.4;
  else P.shieldE = Math.min(1, P.shieldE + dt * 0.35);

  /* Horizontal movement */
  let sp = C.spd * (P.spdBoost > 0 ? 1.8 : 1);
  if (P.ball) sp *= 1.4;
  let ax = 0;
  const rushing = P.dashT > 0 || P.roll > 0 || P.slide > 0;
  if (!frozen && !rushing && !shieldOn) {
    if (left()) ax = -sp;
    if (right()) ax = sp;
  }
  if (ax !== 0) P.face = Math.sign(ax);

  if (P.dashT > 0) {
    P.dashT -= dt;
  } else if (P.roll > 0) {
    P.roll -= dt;
    P.vx = P.face * 9;
  } else if (P.slide > 0) {
    P.slide -= dt;
    P.vx = P.face * 10;
  } else {
    P.vx = ax;
  }

  moveX(P, P.vx, true, { active: GameState.boss.active, dead: GameState.boss.dead, L: ARENA_L, R: ARENA_R });

  /* Vertical movement & physics */
  const jp = jumpK();
  const ab = abilK();
  const wall = touchingWall(P);
  let climbing = false;

  if (C.id === "ana" && wall !== 0 && !P.onGround && !frozen) {
    if ((wall < 0 && left()) || (wall > 0 && right())) {
      climbing = true;
      P.vy = upK() ? -2.6 : downK() ? 2.6 : 0.5;
    }
  }

  if (!climbing) {
    P.vy += GRAV;
    if (C.id === "alejandro" && jp && !P.onGround && P.vy > 0 && P.flyMeter > 0 && !frozen) {
      P.vy = Math.min(P.vy, 0.9);
      P.flyMeter -= dt * 0.8;
      if (Math.random() < 0.3) {
        GameState.particles.push({
          x: P.x + P.w / 2,
          y: P.y + P.h,
          vx: Math.random() - 0.5,
          vy: 1,
          t: 0.4,
          col: "#9fb8e8"
        });
      }
    }
    if (C.id === "paloma" && jp && !P.onGround && P.stamina > 0 && !frozen) {
      P.vy = Math.max(P.vy - 1.1, -3.6);
      P.stamina -= dt * 0.55;
      if (Math.random() < 0.4) {
        GameState.particles.push({
          x: P.x + P.w / 2,
          y: P.y + P.h,
          vx: (Math.random() - 0.5) * 2,
          vy: 1.5,
          t: 0.4,
          col: "#ffffff"
        });
      }
    }
    if ((P.slam || P.megaslam) && P.vy > 0) P.vy = Math.max(P.vy, 13);
    P.vy = Math.min(P.vy, 14);
  }

  P.onGround = false;
  const wasFalling = P.vy > 0;
  if (moveY(P, P.vy, P.vy >= 0, GameState.printed) && wasFalling && P.vy === 0 && !climbing) {
    P.onGround = true;
    P.flyMeter = Math.min(1, P.flyMeter + dt * 3);
    P.stamina = Math.min(1, P.stamina + dt * 2);

    if (P.slam || P.megaslam) {
      const mega = P.megaslam;
      P.slam = false;
      P.megaslam = false;
      GameState.shake = mega ? 16 : 14;
      sfx(90, 0.25, "sawtooth", 0.09);
      GameState.hitboxes.push({
        x: P.x - (mega ? 90 : 70),
        y: P.y - 14,
        w: P.w + (mega ? 180 : 140),
        h: P.h + 34,
        t: 0.2,
        dmg: 2
      });
      for (let i = 0; i < 14; i++) {
        GameState.particles.push({
          x: P.x + P.w / 2,
          y: P.y + P.h,
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 5,
          t: 0.6,
          col: "#ffc857"
        });
      }
    }

    if (P.ball) {
      P.vy = -9;
      P.onGround = false;
      sfx(660, 0.05, "triangle", 0.03);
    }
  }

  if (P.onGround) {
    P.flyMeter = Math.min(1, P.flyMeter + dt * 2);
    P.stamina = Math.min(1, P.stamina + dt * 2);
  }

  // Jumping
  if (jp && !GameState.prevJump && !frozen && !shieldOn) {
    if (P.onGround) {
      P.vy = -C.jump;
      sfx(500, 0.08);
    } else if (climbing) {
      P.vy = -C.jump * 0.95;
      P.vx = -wall * 4;
      sfx(560, 0.08);
    } else if (C.id === "josu" && wall !== 0) {
      P.vy = -C.jump;
      P.vx = -wall * 6;
      P.face = -wall;
      sfx(600, 0.08);
      for (let i = 0; i < 5; i++) {
        GameState.particles.push({
          x: P.x + (wall > 0 ? P.w : 0),
          y: P.y + P.h / 2,
          vx: -wall * 2,
          vy: (Math.random() - 0.5) * 3,
          t: 0.4,
          col: "#d9954f"
        });
      }
    }
  }
  GameState.prevJump = jp;

  // Ability activation
  if (ab && !GameState.prevAbil && !frozen) {
    doAbility(C);
  }
  GameState.prevAbil = ab;

  // Hazards & falling into pits
  const feet = tileAt(P.x + P.w / 2, P.y + P.h - 2);
  if (feet === "^" && P.inv <= 0) {
    hurt(1);
    P.vy = -7;
  }
  if (P.y > LH * TILE + 60) {
    hurt(1);
    respawn();
  }

  // Checkpoints
  CHECKPOINTS.forEach((c, i) => {
    if (i > P.checkpoint && P.x > c.x) {
      P.checkpoint = i;
      msg("CHECKPOINT ✔", 1.4);
      sfx(900, 0.1);
    }
  });

  // Coffee collectibles
  for (const c of GameState.coffees) {
    if (!c.got && rectsHit(P.x, P.y, P.w, P.h, c.x, c.y, 18, 18)) {
      c.got = true;
      GameState.coffeeCount++;
      addScore(50, c.x, c.y, "☕");
      sfx(1046, 0.08, "triangle", 0.04);
      for (let i = 0; i < 5; i++) {
        GameState.particles.push({
          x: c.x + 9,
          y: c.y + 9,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 3,
          t: 0.4,
          col: "#ffc857"
        });
      }
    } else {
      c.t += dt;
    }
  }

  // Decay printed platforms & hitboxes
  GameState.printed.forEach((p) => (p.life -= dt));
  GameState.printed = GameState.printed.filter((p) => p.life > 0);
  GameState.hitboxes.forEach((h) => (h.t -= dt));
  GameState.hitboxes = GameState.hitboxes.filter((h) => h.t > 0);

  updateProjectiles(dt);
  updateMinions(dt);
  updateEnemies(dt);
  updateBoss(dt);

  if (GameState.fragment) {
    GameState.fragment.t += dt;
    if (rectsHit(P.x, P.y, P.w, P.h, GameState.fragment.x - 14, GameState.fragment.y - 14, 28, 28)) {
      winGame();
    }
  }

  GameState.particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.t -= dt;
  });
  GameState.particles = GameState.particles.filter((p) => p.t > 0);

  GameState.floaters.forEach((f) => {
    f.y -= 0.5;
    f.t -= dt;
  });
  GameState.floaters = GameState.floaters.filter((f) => f.t > 0);

  // Smooth camera following
  const targetX = P.x + P.w / 2 - GameState.W / 2;
  GameState.camX += (targetX - GameState.camX) * 0.14;
  GameState.camX = Math.max(0, Math.min(GameState.camX, LW * TILE - GameState.W));
  if (GameState.boss.active && !GameState.boss.dead) {
    GameState.camX = Math.max(0, Math.min(ARENA_L - 48, LW * TILE - GameState.W));
  }

  const worldBottom = LH * TILE;
  if (GameState.H < 500) {
    // In portrait/handheld mode, dynamically follow player vertically!
    const targetY = P.y + P.h / 2 - GameState.H * 0.55;
    GameState.camY += (targetY - GameState.camY) * 0.12;
    GameState.camY = Math.max(0, Math.min(GameState.camY, worldBottom - GameState.H));
  } else {
    GameState.camY = worldBottom - (GameState.H - GameState.SAFEB);
    GameState.camY = Math.max(0, GameState.camY);
  }
}

// Initialize components
initLevelGrid();
initSprites();
fitCanvas();

let toggleTeamFn = () => {};

const worldMap = initWorldMap({
  onSelectWorld: (worldId) => {
    startGame(worldId);
  },
  onOpenTeam: () => toggleTeamFn()
});

const { toggleTeam, tryStart, updateSpotlight } = initOverlays({
  onStartGame: () => startGame(1),
  onOpenMap: () => worldMap.showWorldMap(),
  onNextWorld: () => {
    const nextId = Math.min(5, (GameState.currentWorld || 1) + 1);
    startGame(nextId);
  }
});
toggleTeamFn = toggleTeam;

initInput({
  onSwitchChar: (dir) => {
    switchChar(dir);
    updateSpotlight();
    worldMap.renderMap();
  },
  onToggleTeam: () => toggleTeam(),
  onToggleMusic: () => {
    const on = toggleMusic();
    msg(on ? "MÚSICA: ON" : "MÚSICA: OFF", 1.2);
  },
  onTryStart: () => tryStart(),
  onOpenMap: () => worldMap.showWorldMap()
});

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  if (GameState.gameMode === "fighting") {
    updateFightLobby(dt);
    drawFightLobby(cx);
  } else if (GameState.gameMode === "fighting_active") {
    updateFight(dt);
    drawFight(cx);
  } else {
    if (GameState.status === "play") update(dt);
    if (GameState.status === "play" || GameState.status === "gameover") draw(cx);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
