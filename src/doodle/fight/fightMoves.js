// =============================================================================
// fightMoves.js — Golpes y especiales de Code Clash Arena
// Unidades: metros y segundos. `box` = [delante, abajo, ancho, alto] relativo a
// los pies del luchador, mirando a la derecha.
// =============================================================================

import { INK } from "../doodleRender.js";

// combo de 3 golpes en el suelo (el 3º lanza por los aires)
export const JABS = [
  { name: "jab", dmg: 5, start: 0.05, active: 0.09, rec: 0.12, box: [0.2, 0.9, 1.05, 0.7], kb: [1.8, 0], stun: 0.24, heavy: false },
  { name: "jab2", dmg: 6, start: 0.05, active: 0.09, rec: 0.13, box: [0.2, 0.8, 1.15, 0.8], kb: [2.2, 0], stun: 0.26, heavy: false },
  { name: "finisher", dmg: 10, start: 0.09, active: 0.1, rec: 0.26, box: [0.15, 0.7, 1.35, 1.0], kb: [6.5, 6.5], stun: 0.5, heavy: true }
];
export const AIR = { name: "air", dmg: 8, start: 0.05, active: 0.14, rec: 0.16, box: [0.1, 0.1, 1.2, 1.3], kb: [4, -3], stun: 0.35, heavy: false };

// tipos de especial:
//  dash   — embestida horizontal golpeando todo el trayecto
//  proj   — lanza un proyectil (arc: con gravedad y bote; ground: rueda por el suelo)
//  slam   — salta y cae en picado con onda expansiva
//  rise   — gancho ascendente (sube golpeando)
//  shield — escudo: si te golpean durante él, contraatacas
const DASH = (dmg, speed, name, ink) => ({ kind: "dash", dmg, speed, name, ink, time: 0.24 });
const PROJ = (dmg, shape, name, ink, o = {}) => ({ kind: "proj", dmg, shape, name, ink, speed: 11, arc: false, ground: false, life: 1.4, ...o });

export const SPECIALS = {
  alejandro: DASH(14, 15, "FLY PUNCH", INK.BLACK),
  ale: { ...DASH(13, 17, "OIL SLIDE", INK.GREEN), low: true },
  alvaroM: PROJ(13, "calc", "ERROR 404", INK.BLACK, { arc: true, speed: 8, vy: 7, life: 2.2 }),
  alvaroP: PROJ(11, "wave", "PODCAST ATTACK", INK.PURPLE, { speed: 13, life: 0.9 }),
  ana: { kind: "rise", dmg: 13, name: "TREPAR", ink: INK.ORANGE, vy: 12, vx: 3 },
  beltran: { kind: "shield", dmg: 12, name: "ESCUDO DEDAL", ink: INK.BLUE, time: 0.7 },
  bruno: { kind: "multi", dmg: 0, name: "MULTIFACE", ink: INK.ORANGE },
  gonzalo: PROJ(12, "broccoli", "BROCCOLI RAGE", INK.GREEN, { arc: true, speed: 9, vy: 5, life: 2 }),
  javi: PROJ(12, "worker", "WORKERS UNITED", INK.RED, { ground: true, speed: 6.5, life: 2.4 }),
  jesus: { kind: "slam", dmg: 16, name: "CRUZCAMPO SMASH", ink: INK.GREEN, radius: 2.4 },
  joseluis: PROJ(12, "block", "PRINT", INK.ORANGE, { arc: true, speed: 7, vy: 8, life: 2.2 }),
  josu: { kind: "rise", dmg: 12, name: "PANETÓN CLIMB", ink: INK.ORANGE, vy: 13, vx: 5 },
  juan: PROJ(11, "micro", "MICROWAVE", INK.ORANGE, { speed: 10, life: 1 }),
  maca: DASH(15, 16, "SPIKE", INK.BLUE),
  manu: { kind: "slam", dmg: 17, name: "SUPER STEP", ink: INK.RED, radius: 2.6 },
  pablo: DASH(13, 18, "ORANGE ROLL", INK.ORANGE),
  paloma: { kind: "rise", dmg: 11, name: "FLY AWAY", ink: INK.BLUE, vy: 14, vx: 2 },
  silvia: DASH(12, 21, "SPEEDRUN", INK.PURPLE)
};

export function specialFor(charId) {
  return SPECIALS[charId] || DASH(13, 15, "ESPECIAL", INK.BLUE);
}

// Bruno (tótem multicara) saca una cara al azar
const MULTI_POOL = ["alejandro", "alvaroM", "jesus", "ana", "juan"];
export function rollMulti() {
  return SPECIALS[MULTI_POOL[Math.floor(Math.random() * MULTI_POOL.length)]];
}

// enfriamiento del especial según el personaje (los rápidos recargan antes)
export const specialCooldown = (cfg) => Math.max(1.6, Math.min(4, 1.4 + ((cfg && cfg.cd) || 1) * 1.1));
