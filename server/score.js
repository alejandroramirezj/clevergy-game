// =============================================================================
// server/score.js — Validación de las puntuaciones que llegan al ranking
// El juego corre en el navegador, así que cualquiera podría mandar un número
// inventado: aquí se rechaza lo imposible (topes por mundo) y lo raro.
// =============================================================================

// puntuación máxima alcanzable en cada mundo (con margen), por id de mundo
export const SCORE_CAP = {
  1: 45000, // La Oficina: monedas, disquetes, pisotones, jefe y bonus de bandera
  7: 60000, // BoliBic Tag: 6 oleadas + jefe
  6: 9000, // Coworking Fight: victoria + KOs + vidas
  8: 10000 // Pantano de San Juan: 10000 - tiempo
};
export const RANKS = ["S", "A", "B", "C"];

/** Normaliza y valida una puntuación. Devuelve { ok, error, entry }. */
export function validateScore(body, user) {
  const world = parseInt(body && body.world, 10);
  if (!SCORE_CAP[world]) return { ok: false, error: "Mundo desconocido" };
  const score = parseInt(body.score, 10);
  if (!Number.isFinite(score) || score <= 0) return { ok: false, error: "Puntuación no válida" };
  if (score > SCORE_CAP[world]) return { ok: false, error: "Puntuación imposible para este mundo" };
  const rankIn = String(body.rank || "").toUpperCase().slice(0, 1);
  const entry = {
    world,
    score,
    name: String((user && user.nick) || body.name || "ANON").replace(/[^\p{L}\p{N} ._-]/gu, "").trim().slice(0, 15).toUpperCase() || "ANON",
    character: String(body.character || "alejandro").replace(/[^a-zA-Z]/g, "").slice(0, 30),
    char_name: String(body.char_name || "").slice(0, 40),
    time_seconds: Math.max(0, Math.min(36000, parseFloat(body.time_seconds) || 0)),
    rank: RANKS.includes(rankIn) ? rankIn : "",
    deaths: Math.max(0, Math.min(999, parseInt(body.deaths, 10) || 0)),
    user_id: user ? user.id : null
  };
  return { ok: true, entry };
}
