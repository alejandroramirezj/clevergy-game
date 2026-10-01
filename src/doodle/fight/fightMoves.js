// =============================================================================
// fightMoves.js — El especial de cada personaje en Coworking Fight
// (los golpes normales y el empuje estilo Smash están en doodleFight.js)
// =============================================================================

import { INK } from "../doodleRender.js";

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
  beltran: PROJ(11, "slack", "SLACK SPAM", INK.BLUE, { speed: 12, life: 1.2 }),
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
  silvia: DASH(12, 21, "SPEEDRUN", INK.PURPLE),
  yair: { kind: "slam", dmg: 14, name: "BULERÍA", ink: INK.RED, radius: 2.5 }
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
// (los especiales a distancia recargan un 35 % más lento: desde lejos dominaban a las CPUs)
export const specialCooldown = (cfg) => {
  const base = Math.max(1.6, Math.min(4, 1.4 + ((cfg && cfg.cd) || 1) * 1.1));
  return specialFor(cfg && cfg.id).kind === "proj" ? base * 1.35 : base;
};
