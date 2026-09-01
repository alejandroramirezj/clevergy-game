import { GameState, msg } from "./state.js";
import { sfx } from "../engine/audio.js";
import { triggerAnim } from "../engine/sprites.js";

export function doAbility(C) {
  const P = GameState.P;
  if (P.cool > 0) return;
  const id = C.id;

  if (id === "alejandro") {
    P.atkT = 0.18;
    P.cool = C.cd;
    sfx(760, 0.06);
    triggerAnim("attack", "alejandro");
    GameState.hitboxes.push({
      x: P.face > 0 ? P.x + P.w : P.x - 40,
      y: P.y,
      w: 40,
      h: P.h,
      t: 0.15,
      dmg: 1
    });
  } else if (id === "ale") {
    P.slide = 0.6;
    P.cool = C.cd;
    triggerAnim("attack", "ale");
    sfx(500, 0.15, "sawtooth", 0.05);
    for (let i = 0; i < 6; i++) {
      GameState.particles.push({
        x: P.x + P.w / 2,
        y: P.y + P.h,
        vx: (Math.random() - 0.5) * 3,
        vy: -1,
        t: 0.6,
        col: "#ffd97a"
      });
    }
  } else if (id === "alvaroM") {
    P.cool = C.cd;
    sfx(880, 0.08);
    GameState.projectiles.push({
      kind: "404",
      x: P.x + P.w / 2,
      y: P.y + 6,
      vx: P.face * 6.5,
      vy: -6,
      t: 3
    });
  } else if (id === "alvaroP") {
    P.cool = C.cd;
    sfx(220, 0.25, "sawtooth", 0.06);
    sfx(440, 0.2, "square", 0.04);
    GameState.projectiles.push({
      kind: "wave",
      x: P.x + P.w / 2,
      y: P.y + P.h / 2,
      r: 14,
      dir: P.face,
      t: 0.5
    });
  } else if (id === "ana") {
    P.atkT = 0.18;
    P.cool = C.cd;
    sfx(700, 0.06);
    GameState.hitboxes.push({
      x: P.face > 0 ? P.x + P.w : P.x - 34,
      y: P.y,
      w: 34,
      h: P.h,
      t: 0.15,
      dmg: 1
    });
  } else if (id === "beltran") {
    // hold-based, handled in physics update loop
  } else if (id === "bruno") {
    P.cool = C.cd;
    const r = Math.floor(Math.random() * 4);
    if (r === 0) {
      P.hp = Math.min(5, P.hp + 1);
      msg("🗿 CARA SANADORA +1❤", 1.4);
      sfx(880, 0.2, "triangle");
    } else if (r === 1) {
      msg("🗿 CARA FURIOSA", 1.4);
      GameState.shake = 10;
      sfx(110, 0.3, "sawtooth", 0.08);
      GameState.hitboxes.push({
        x: P.x - 90,
        y: P.y - 40,
        w: P.w + 180,
        h: P.h + 80,
        t: 0.2,
        dmg: 2
      });
      for (let i = 0; i < 12; i++) {
        GameState.particles.push({
          x: P.x + P.w / 2,
          y: P.y + P.h / 2,
          vx: (Math.random() - 0.5) * 9,
          vy: (Math.random() - 0.5) * 9,
          t: 0.5,
          col: "#d9a23a"
        });
      }
    } else if (r === 2) {
      P.spdBoost = 3;
      msg("🗿 CARA VELOZ", 1.4);
      sfx(980, 0.15);
    } else {
      P.inv = 2;
      msg("🗿 CARA ZEN", 1.4);
      sfx(660, 0.2, "triangle");
    }
  } else if (id === "gonzalo") {
    P.cool = C.cd;
    sfx(600, 0.1);
    const alive = GameState.minions.filter((m) => m.kind === "broc").length;
    for (let i = 0; i < Math.min(3, 6 - alive); i++) {
      GameState.minions.push({
        kind: "broc",
        x: P.x + P.w / 2,
        y: P.y,
        vx: P.face * (1.5 + i * 0.6),
        vy: -4,
        t: 5,
        onG: false
      });
    }
    GameState.floaters.push({ x: P.x, y: P.y - 16, t: 1, txt: "BROCCOLI RAGE!", col: "#3fb865" });
  } else if (id === "javi") {
    P.cool = C.cd;
    sfx(330, 0.15, "triangle", 0.06);
    const alive = GameState.minions.filter((m) => m.kind === "worker").length;
    for (let i = 0; i < Math.min(2, 4 - alive); i++) {
      GameState.minions.push({
        kind: "worker",
        x: P.x + P.face * (20 + i * 24),
        y: P.y,
        vx: P.face * 2.2,
        vy: 0,
        t: 5,
        onG: false
      });
    }
    GameState.floaters.push({ x: P.x, y: P.y - 16, t: 1, txt: "¡WORKERS UNITED!", col: "#ffd25e" });
  } else if (id === "jesus") {
    if (!P.onGround) {
      P.slam = true;
      P.vy = Math.max(P.vy, 2);
      P.cool = C.cd;
      sfx(240, 0.15, "sawtooth", 0.07);
    } else {
      P.cool = C.cd;
      GameState.shake = 10;
      sfx(110, 0.2, "sawtooth", 0.08);
      GameState.hitboxes.push({
        x: P.x - 56,
        y: P.y - 8,
        w: P.w + 112,
        h: P.h + 24,
        t: 0.18,
        dmg: 2
      });
      for (let i = 0; i < 10; i++) {
        GameState.particles.push({
          x: P.x + P.w / 2,
          y: P.y + P.h,
          vx: (Math.random() - 0.5) * 7,
          vy: -Math.random() * 4,
          t: 0.5,
          col: "#ffc857"
        });
      }
    }
  } else if (id === "joseluis") {
    if (GameState.printed.length >= 3) {
      msg("MÁX. 3 PLATAFORMAS", 1.2);
      sfx(160, 0.1);
      return;
    }
    P.cool = C.cd;
    const px = P.x + (P.face > 0 ? P.w + 16 : -16 - 72);
    const py = P.y + P.h - 6;
    GameState.printed.push({ x: px, y: py, w: 72, h: 10, life: 9 });
    sfx(660, 0.05);
    sfx(880, 0.08);
    GameState.floaters.push({ x: px + 10, y: py - 16, t: 1, txt: "PRINT ✔", col: "#59d8ff" });
  } else if (id === "josu") {
    P.cool = C.cd;
    P.vx = P.face * 8;
    P.vy = -8;
    sfx(560, 0.1);
    for (let i = 0; i < 5; i++) {
      GameState.particles.push({
        x: P.x + P.w / 2,
        y: P.y + P.h,
        vx: (Math.random() - 0.5) * 4,
        vy: 2,
        t: 0.4,
        col: "#d9954f"
      });
    }
  } else if (id === "juan") {
    P.cool = C.cd;
    sfx(180, 0.35, "sawtooth", 0.06);
    GameState.hitboxes.push({
      x: P.x - 80,
      y: P.y - 60,
      w: P.w + 160,
      h: P.h + 120,
      t: 0.25,
      dmg: 1,
      micro: true
    });
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      GameState.particles.push({
        x: P.x + P.w / 2 + Math.cos(a) * 30,
        y: P.y + P.h / 2 + Math.sin(a) * 30,
        vx: Math.cos(a) * 3,
        vy: Math.sin(a) * 3,
        t: 0.5,
        col: "#ff8f2e"
      });
    }
    GameState.floaters.push({ x: P.x - 10, y: P.y - 16, t: 1, txt: "¡DING!", col: "#ff8f2e" });
  } else if (id === "maca") {
    P.ball = !P.ball;
    P.cool = C.cd;
    sfx(P.ball ? 740 : 400, 0.08);
    if (P.ball) P.vy = -6;
  } else if (id === "manu") {
    if (P.onGround) {
      P.cool = C.cd;
      P.vy = -16.5;
      P.megaslam = true;
      sfx(200, 0.2, "sawtooth", 0.07);
      for (let i = 0; i < 8; i++) {
        GameState.particles.push({
          x: P.x + P.w / 2,
          y: P.y + P.h,
          vx: (Math.random() - 0.5) * 6,
          vy: 2,
          t: 0.4,
          col: "#ff5b64"
        });
      }
    }
  } else if (id === "pablo") {
    P.roll = 1.0;
    P.cool = C.cd;
    sfx(440, 0.15, "triangle", 0.05);
  } else if (id === "paloma") {
    P.atkT = 0.18;
    P.cool = C.cd;
    sfx(820, 0.06, "triangle");
    GameState.hitboxes.push({
      x: P.x - 30,
      y: P.y - 10,
      w: P.w + 60,
      h: P.h + 20,
      t: 0.12,
      dmg: 1
    });
  } else if (id === "silvia") {
    P.dashT = 0.28;
    P.cool = C.cd;
    P.vx = P.face * 13;
    sfx(980, 0.12, "sawtooth", 0.05);
    for (let i = 0; i < 6; i++) {
      GameState.particles.push({
        x: P.x + P.w / 2,
        y: P.y + P.h / 2,
        vx: -P.face * (2 + Math.random() * 3),
        vy: (Math.random() - 0.5) * 2,
        t: 0.4,
        col: "#ff4d8d"
      });
    }
  }
}
