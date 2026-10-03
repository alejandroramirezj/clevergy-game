// =============================================================================
// worlds.js — Los 5 mundos del Retreat y el progreso guardado en este móvil
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
    blurb: "El viaje de Clevergy por sus oficinas: Google for Startups Campus, Wayra en el Edificio Telefónica de Gran Vía y el CINK Coworking de Infanta Mercedes.",
    chips: ["👤 1 jugador", "🦸 19 poderes", "👾 Datadis"],
    name: "La Oficina",
    subtitle: "Google for Startups · Campus Madrid",
    desc: "Empieza en Google for Startups Campus (café, torre de coworking y Demo Day), cruza Gran Vía y trepa por el Edificio Telefónica hasta Wayra en la 8ª planta, y termina en el CINK de Infanta Mercedes: derrota a Datadis en la sala y llega a la oficina de Clevergy."
  },
  {
    id: 6,
    num: 3,
    theme: "arena",
    color: "#6b2bd4",
    tapeColor: "#c8b7f8",
    kickerBg: "#f0ebfb",
    genreBg: "#ede4fb",
    genreColor: "#6b2bd4",
    genre: "PELEA · HASTA 4",
    blurb: "Una retro que se ha convertido en una pelea: 5 min para escribir tarjetas, 5 min para votar, y el resto... ¡PELEA!",
    chips: ["🥊 Retro Fight", "📋 Post-its", "📱 Online"],
    name: "Retro Fight",
    subtitle: "5 minutos para escribir tarjetas. 5 minutos para votar. Y el resto... PELEA.",
    desc: "Una retrospectiva del equipo convertida en pelea: lucha sobre la mesa de la sala frente al gran tablero con sus cuatro columnas (Qué ha ido bien, A mejorar, Preguntas y Action Items), esquiva post-its y resuelve la retro a puñetazos contra la CPU o con tus compañeros online."
  },
  {
    id: 7,
    num: 2,
    theme: "doodle",
    color: "#166ae6",
    tapeColor: "#9ed4fb",
    kickerBg: "#e7f1fe",
    genreBg: "#def0ff",
    genreColor: "#166ae6",
    genre: "LASER TAG",
    blurb: "Laser tag a boli por el CINK Coworking: oleadas de emails en cooperativo o todos contra todos con tus compañeros.",
    chips: ["👥 Hasta 20", "⚔️ PvP", "🤝 Coop"],
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
    blurb: "Carreras de motos de agua por el Pantano de San Juan: derrapes, rampas, turbos y objetos de oficina contra 5 rivales u online.",
    chips: ["🚤 Hasta 20", "🎁 Objetos", "📱 Online"],
    name: "Pantano S.Juan",
    subtitle: "Motos de agua · Madrid",
    desc: "Carreras de motos de agua estilo kart por el Pantano de San Juan: la presa, la playa de la Virgen de la Nueva, rampas, turbos y objetos de oficina contra 5 rivales o tus compañeros online."
  },
  {
    id: 9,
    num: 5,
    theme: "fall",
    color: "#e0399a",
    tapeColor: "#f9b8db",
    kickerBg: "#fde7f3",
    genreBg: "#fde0f0",
    genreColor: "#c4207a",
    genre: "SHOW DE OBSTÁCULOS",
    blurb: "Show eliminatorio estilo Fall Guys: de no tener nada a un usuario completo que da el consentimiento para controlar su batería en el mercado de flexibilidad.",
    chips: ["👥 12 concursantes", "🏃 4 rondas", "🔋 1 batería"],
    name: "La Integración",
    subtitle: "Usuario · consumo · inversor · batería",
    desc: "Cuatro rondas eliminatorias contra tus compañeros: crea el usuario y la casa (nombre, DNI, CUPS, dirección y CP), consigue el consumo por Datadis, FTP o API, conecta el inversor solar eligiendo bien la puerta de la marca, y en la final sube la torre de la batería: sólo se la lleva el primero que salte y la coja."
  }
];

// en pantalla, por su número
export const VISIBLE_WORLDS = WORLDS.slice().sort((a, b) => a.num - b.num);

// los 3 retos de cada mundo: superarlo, rango A y rango S (el rango lo da cada mundo al ganar)
export const WORLD_RETOS = {
  // La Oficina: 1 punto por disquete (hay 3), +1 con más del 60 % de las monedas, +1 en menos de 8:00 y +1 sin perder corazones
  1: ["Llega a la bandera del final", "Suma 3 puntos (cada disquete 💾 vale 1; +1 con más del 60 % de monedas; +1 en menos de 8:00; +1 sin perder corazones)", "Suma 5 de esos 6 puntos"],
  6: ["Gana una pelea contra la CPU", "Gana perdiendo solo 1 de tus 3 vidas", "Gana sin perder ninguna vida"],
  7: ["Supera las 6 oleadas y derrota a INBOX INFINITO", "Termina con 15.000 puntos o más", "Termina con 19.000 puntos o más"],
  8: ["Gana una carrera (llega el 1º)", "Gana en menos de 2:50", "Gana en menos de 2:20"],
  9: ["Llévate la batería en la final", "Gana quedando entre los 3 primeros en todas las rondas", "Gana entre los 3 primeros de cada ronda y cayéndote 3 veces como mucho"]
};
const RANK_ORDER = { S: 3, A: 2, B: 1, C: 0 };
/** Estado de los 3 retos de un mundo: [{ txt, done }] */
export function worldRetos(worldId, progress) {
  const won = !!(progress && progress.completed && progress.completed.includes(worldId));
  const r = RANK_ORDER[String((progress && progress.ranks && progress.ranks[worldId]) || "").toUpperCase()] ?? -1;
  const done = [won, won && r >= 2, won && r >= 3];
  return (WORLD_RETOS[worldId] || ["Supera el mundo", "Consigue el rango A", "Consigue el rango S"]).map((txt, i) => ({ txt, done: done[i] }));
}
export function getWorldChallenges(worldId, progress) {
  return worldRetos(worldId, progress).filter((x) => x.done).length;
}

// todos los mundos están abiertos desde el principio
export function isWorldLocked() {
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
