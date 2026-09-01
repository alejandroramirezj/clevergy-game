import { CHECKPOINTS, RAW_COFFEE_COORDS, TILE } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { sfx } from "../engine/audio.js";
import { anim, triggerAnim } from "../engine/sprites.js";
import { abilK } from "../engine/input.js";
import { submitScore } from "./leaderboard.js";

export const GameState = {
  status: "boot", // boot, ready, play, gameover, win
  charIdx: 0,
  switchBanner: 0,
  teamOpen: false,
  currentWorld: 1,
  worldTheme: null,
  worldMapOpen: false,

  score: 0,
  combo: 0,
  comboT: 0,
  gameTime: 0,
  deaths: 0,
  coffeeCount: 0,
  playerName: "ANON",

  shake: 0,
  msgTxt: "",
  msgT: 0,
  msg2Txt: "",
  msg2T: 0,

  camX: 0,
  camY: 0,
  W: 960,
  H: 540,
  DPR: 1,
  SAFEB: 0,
  time: 0,
  prevJump: false,
  prevAbil: false,

  P: {
    x: CHECKPOINTS[0].x,
    y: CHECKPOINTS[0].y,
    vx: 0,
    vy: 0,
    w: 26,
    h: 32,
    onGround: false,
    face: 1,
    hp: 5,
    inv: 0,
    frozen: 0,
    flyMeter: 1,
    stamina: 1,
    shieldE: 1,
    cool: 0,
    dashT: 0,
    roll: 0,
    slide: 0,
    ball: false,
    slam: false,
    megaslam: false,
    atkT: 0,
    checkpoint: 0,
    spdBoost: 0
  },

  printed: [],
  hitboxes: [],
  projectiles: [],
  minions: [],
  particles: [],
  floaters: [],
  enemies: [],
  coffees: [],
  boss: {
    active: false,
    dead: false,
    x: 126 * TILE,
    y: 8 * TILE,
    vx: 0,
    vy: 0,
    hp: 14,
    maxhp: 14,
    state: "hover",
    t: 0,
    hitFlash: 0,
    intro: 0,
    ifr: 0
  },
  fragment: null
};

export function initCoffees() {
  GameState.coffees = RAW_COFFEE_COORDS.map(([x, y]) => ({
    x: x * TILE + 8,
    y: y * TILE + 6,
    got: false,
    t: Math.random() * 6
  }));
}

export function addScore(n, x, y, label) {
  const mult = Math.min(5, Math.max(1, GameState.combo));
  const pts = n * mult;
  GameState.score += pts;
  if (x !== undefined) {
    GameState.floaters.push({
      x,
      y,
      t: 1,
      txt: "+" + pts + (mult > 1 ? " x" + mult : ""),
      col: mult > 1 ? "#ffc857" : "#b6f542"
    });
  }
  if (label) {
    GameState.floaters.push({ x, y: y - 14, t: 1, txt: label, col: "#dfe8ff" });
  }
}

export function kill() {
  GameState.combo++;
  GameState.comboT = 2;
}

export function msg(t, d) {
  GameState.msgTxt = t;
  GameState.msgT = d;
}

export function msg2(t, d) {
  GameState.msg2Txt = t;
  GameState.msg2T = d;
}

export function fmtT(s) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return m + ":" + String(ss).padStart(2, "0");
}

export function hurt(n) {
  const P = GameState.P;
  if (P.inv > 0 || P.dashT > 0 || P.roll > 0 || P.slide > 0) return;
  if (CHARS[GameState.charIdx].id === "beltran" && abilK() && P.shieldE > 0) return;

  P.hp -= n;
  P.inv = 1.4;
  GameState.shake = 8;
  GameState.combo = 0;
  sfx(140, 0.15, "sawtooth");

  const curCharId = CHARS[GameState.charIdx].id;
  triggerAnim(P.hp <= 0 ? "death" : "damage", curCharId);

  GameState.floaters.push({ x: P.x, y: P.y - 20, t: 1, txt: "-" + n, col: "#ff4d5e" });

  if (P.hp <= 0) {
    GameState.deaths++;
    GameState.status = "gameover";
    const curC = CHARS[GameState.charIdx];
    const goStats = document.getElementById("goStats");
    if (goStats) {
      goStats.innerHTML = `SCORE: <b style="color:#b6f542">${GameState.score}</b> · TIEMPO: <b>${fmtT(GameState.gameTime)}</b> · MUERTES: <b>${GameState.deaths}</b>`;
    }
    if (GameState.score > 0) {
      submitScore({
        name: GameState.playerName,
        score: GameState.score,
        character: curC.id,
        char_name: curC.name,
        time_seconds: Math.round(GameState.gameTime),
        rank: "GAME OVER",
        deaths: GameState.deaths
      });
    }
    const goOv = document.getElementById("goOv");
    if (goOv) goOv.classList.remove("hidden");
  }
}

export function respawn() {
  const P = GameState.P;
  const c = CHECKPOINTS[P.checkpoint];
  P.x = c.x;
  P.y = c.y;
  P.vx = 0;
  P.vy = 0;
  P.frozen = 0;
  P.ball = false;
}

export function switchChar(dir) {
  if (GameState.status !== "play") return;
  GameState.charIdx = (GameState.charIdx + dir + CHARS.length) % CHARS.length;
  GameState.P.ball = false;
  GameState.P.roll = 0;
  GameState.P.slide = 0;
  anim.lock = null;
  anim.name = "idle";
  anim.frame = 0;
  anim.t = 0;
  GameState.switchBanner = 1.6;
  sfx(520, 0.06, "square");
}
