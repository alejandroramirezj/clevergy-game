// =============================================================================
// worlds.js — Los 4 mundos del Retreat y el progreso guardado en este móvil
// (el id es el histórico de cada mundo; `num` es el orden en el que se muestran)
// =============================================================================

export const WORLDS = [
  {
    id: 1,
    num: 1,
    theme: "mario",
    color: "#e5283b",
    tapeColor: "#fae88a",
    kickerBg: "#fde8ea",
    genreBg: "#fedfe8",
    genreColor: "#d6204c",
    genre: "PLATAFORMAS",
    defaultRetos: 2,
    blurb: "La vieja fábrica de ladrillo de Google for Startups junto al Palacio Real: café, torre de coworking y el escenario del Demo Day.",
    chips: ["👤 1 jugador", "🦸 18 poderes", "👾 Email Chain"],
    name: "La Oficina",
    subtitle: "Google for Startups · Campus Madrid",
    desc: "Cruza el Campus Café, sube la torre de coworking, salta entre las salas de cristal y derrota a Email Chain en el Demo Day."
  },
  {
    id: 6,
    num: 2,
    theme: "arena",
    color: "#6b2bd4",
    tapeColor: "#c8b7f8",
    kickerBg: "#f0ebfb",
    genreBg: "#ede4fb",
    genreColor: "#6b2bd4",
    genre: "PELEA · HASTA 4",
    defaultRetos: 1,
    blurb: "Pelea estilo Smash en la terraza del CINK: hasta 4 a la vez, porcentaje de daño, vidas y objetos que coger del suelo.",
    chips: ["🥊 Hasta 4", "🎁 Objetos", "📱 Online"],
    name: "Coworking Fight",
    subtitle: "Todos contra todos en el CINK",
    desc: "Pelea tipo Super Smash Bros en el coworking: cuanto más porcentaje de daño llevas, más lejos sales volando. Echa a los demás del escenario, coge grapadoras, cafés y bombas de post-its, y juega contra la CPU o con tus compañeros online."
  },
  {
    id: 7,
    num: 3,
    theme: "doodle",
    color: "#166ae6",
    tapeColor: "#9ed4fb",
    kickerBg: "#e7f1fe",
    genreBg: "#def0ff",
    genreColor: "#166ae6",
    genre: "LASER TAG",
    defaultRetos: 0,
    blurb: "Laser tag a boli por el CINK Coworking: oleadas de emails en cooperativo o todos contra todos con tus compañeros.",
    chips: ["👥 Hasta 6", "⚔️ PvP", "🤝 Coop"],
    name: "BoliBic Tag",
    subtitle: "Laser tag en el CINK · Infanta Mercedes",
    desc: "Laser tag en primera persona con el boli Bic como pistola, por las tres plantas del CINK Coworking (recepción, comedor, terraza, salas y la oficina de Clevergy): sobrevive a las oleadas de emails, reuniones y relojes y borra a INBOX INFINITO, o juega todos contra todos con tus compañeros."
  },
  {
    id: 8,
    num: 4,
    theme: "kart",
    color: "#f08518",
    tapeColor: "#fbd89a",
    kickerBg: "#fff2e4",
    genreBg: "#fdf1d1",
    genreColor: "#996808",
    genre: "CARRERAS",
    defaultRetos: 0,
    blurb: "Carreras de motos de agua por el Pantano de San Juan: derrapes, rampas, turbos y objetos de oficina contra 5 rivales u online.",
    chips: ["🚤 6 pilotos", "🎁 Objetos", "📱 Online"],
    name: "Pantano de San Juan",
    subtitle: "Motos de agua · Madrid",
    desc: "Carreras de motos de agua estilo kart por el Pantano de San Juan: la presa, la playa de la Virgen de la Nueva, rampas, turbos y objetos de oficina contra 5 rivales o tus compañeros online."
  }
];

// en pantalla, por su número
export const VISIBLE_WORLDS = WORLDS.slice().sort((a, b) => a.num - b.num);

export function getWorldChallenges(worldId, progress) {
  if (progress && progress.challenges && progress.challenges[worldId] !== undefined) {
    return Math.min(3, Math.max(0, Number(progress.challenges[worldId])));
  }
  if (progress && progress.completed && progress.completed.includes(worldId)) {
    return 3;
  }
  const w = WORLDS.find((x) => x.id === worldId);
  return w ? (w.defaultRetos ?? 0) : 0;
}

export function isWorldLocked(world, progress) {
  if (world.num === 4 || world.id === 8) {
    if (progress && progress.completed && progress.completed.includes(7)) {
      return false;
    }
    return true;
  }
  return false;
}


const STORAGE_KEY = "clevergy_worlds_progress_v1";

export function loadWorldProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.completed)) {
        return data;
      }
    }
  } catch (e) {}

  return {
    completed: [], // IDs de mundos dominados, ej: [1, 2]
    highScores: {}, // { 1: 5200 }
    ranks: {} // { 1: "S" }
  };
}

export function saveWorldProgress(worldId, score, rank) {
  const prog = loadWorldProgress();
  if (!prog.completed.includes(worldId)) {
    prog.completed.push(worldId);
  }
  const prevScore = prog.highScores[worldId] || 0;
  if (score > prevScore) {
    prog.highScores[worldId] = score;
    prog.ranks[worldId] = rank;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));
  } catch (e) {}
  try { window.dispatchEvent(new CustomEvent("cg_progress", { detail: prog })); } catch (e) {}
  return prog;
}

/** Fusiona el progreso guardado en la cuenta con el de este dispositivo. */
export function mergeWorldProgress(remote) {
  const prog = loadWorldProgress();
  if (!remote) return prog;
  for (const id of remote.completed || []) if (!prog.completed.includes(Number(id))) prog.completed.push(Number(id));
  for (const [w, sc] of Object.entries(remote.highScores || {})) {
    if ((Number(sc) || 0) > (prog.highScores[w] || 0)) { prog.highScores[w] = Number(sc) || 0; prog.ranks[w] = (remote.ranks || {})[w] || ""; }
  }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prog)); } catch (e) {}
  return prog;
}
