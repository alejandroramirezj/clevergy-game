// =============================================================================
// state.js — Estado compartido entre menús y mundos 3D
// (personaje elegido, mundo actual, nombre del jugador y medidas del marco)
// =============================================================================

import { CHARS } from "../config/characters.js";
import { sfx } from "../engine/audio.js";

export const GameState = {
  status: "boot",
  charIdx: 0,
  currentWorld: 1,
  worldMapOpen: false,
  gameMode: "menu", // "menu" | "doodle" (un mundo 3D en marcha)
  inPlay: false, // true sólo cuando se está jugando la partida activa (no en menús/lobbies)
  playerName: "ANON",
  W: 960,
  H: 540,
  DPR: 1,
  SAFEB: 0
};

export function setInPlay(v) {
  const next = !!v;
  if (GameState.inPlay === next) return;
  GameState.inPlay = next;
  window.dispatchEvent(new CustomEvent("in_play_change", { detail: { inPlay: next } }));
}

export function fmtT(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/** Cambia el compañero activo (los mundos lo leen con getChar) y avisa a la interfaz. */
export function switchToChar(targetCharIdx) {
  if (targetCharIdx < 0 || targetCharIdx >= CHARS.length) return;
  GameState.charIdx = targetCharIdx;
  try {
    sfx(640, 0.08, "triangle");
    sfx(880, 0.06, "sine");
  } catch (e) {}
  window.dispatchEvent(new CustomEvent("char_switched", { detail: { charIdx: GameState.charIdx } }));
}

export function switchChar(dir) {
  switchToChar((GameState.charIdx + dir + CHARS.length) % CHARS.length);
}
