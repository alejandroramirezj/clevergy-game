// Mundos oficiales de "RETREAT: THE LEGEND OF THE TEAM"

export const WORLDS = [
  {
    id: 1,
    num: 1,
    theme: "mario",
    genre: "PLATAFORMAS 2D",
    blurb: "La vieja fábrica de ladrillo de Google for Startups junto al Palacio Real: café, torre de coworking y el escenario del Demo Day.",
    chips: ["👤 1 jugador", "🦸 18 poderes", "👾 Email Chain"],
    name: "Campus Madrid",
    title: "1. Campus Madrid",
    subtitle: "Google for Startups · Moreno Nieto",
    desc: "Cruza el Campus Café, sube la torre de coworking, salta entre las salas de cristal y derrota a Email Chain en el Demo Day.",
    bossName: "EMAIL CHAIN",
    fragmentName: "Fragmento 1: El Backend",
    bgClass: "world-office",
    bgGradient: ["#191919", "#242424"],
    platformColor: "#2a2a2a",
    accentColor: "#59d8ff",
    iconEmoji: "📝",
    mapCoords: { x: 12, y: 64 }, // landscape %
    mapCoordsPortrait: { x: 26, y: 84 } // portrait %
  },
  {
    id: 2,
    hidden: true, // oculto: sólo se muestran plataformas, arena y doodle
    name: "Integration Jungle",
    title: "2. Integration Jungle",
    subtitle: "Selva de Cables y Conectores",
    desc: "Navega entre lianas de fibra óptica y terminales API ocultos para vencer al monstruo de los endpoints.",
    bossName: "API GATEWAY BEAST",
    fragmentName: "Fragmento 2: La Base de Datos",
    bgClass: "world-jungle",
    bgGradient: ["#06140b", "#0f2e1a"],
    platformColor: "#1d4428",
    accentColor: "#42f584",
    iconEmoji: "🌴",
    mapCoords: { x: 28, y: 32 },
    mapCoordsPortrait: { x: 74, y: 70 }
  },
  {
    id: 3,
    hidden: true, // oculto: sólo se muestran plataformas, arena y doodle
    name: "Product Kingdom",
    title: "3. Product Kingdom",
    subtitle: "La Fortaleza del Roadmap",
    desc: "Asalta las murallas de cajas de release y supera el foso de backlog para derribar al Golem del Roadmap.",
    bossName: "ROADMAP GOLEM",
    fragmentName: "Fragmento 3: Lógica de Negocio",
    bgClass: "world-castle",
    bgGradient: ["#101226", "#1c1d3b"],
    platformColor: "#343761",
    accentColor: "#ffc857",
    iconEmoji: "🏰",
    mapCoords: { x: 48, y: 58 },
    mapCoordsPortrait: { x: 26, y: 54 }
  },
  {
    id: 4,
    hidden: true, // oculto: sólo se muestran plataformas, arena y doodle
    name: "Meeting Dimension",
    title: "4. Meeting Dimension",
    subtitle: "Dimensión de Reuniones Infinitas",
    desc: "Sobrevive a las llamadas simultáneas, calendarios infinitos y silencia al terrorífico All-Hands Monster.",
    bossName: "ALL-HANDS MONSTER",
    fragmentName: "Fragmento 4: Frontend & UI",
    bgClass: "world-meeting",
    bgGradient: ["#170824", "#2e1247"],
    platformColor: "#53267d",
    accentColor: "#d859ff",
    iconEmoji: "📺",
    mapCoords: { x: 70, y: 30 },
    mapCoordsPortrait: { x: 74, y: 38 }
  },
  {
    id: 5,
    hidden: true, // oculto: sólo se muestran plataformas, arena y doodle
    name: "The Retreat",
    title: "5. The Retreat",
    subtitle: "Campamento Final en la Montaña",
    desc: "El destino final junto a la hoguera. Derrota a THE DEADLINE (0 Days Remaining) y salva al equipo.",
    bossName: "THE DEADLINE (0 DAYS)",
    fragmentName: "CÓDIGO FUENTE RECUPERADO 🏆",
    bgClass: "world-retreat",
    bgGradient: ["#050814", "#0e1830"],
    platformColor: "#223554",
    accentColor: "#ff4d6a",
    iconEmoji: "🔥",
    mapCoords: { x: 88, y: 52 },
    mapCoordsPortrait: { x: 28, y: 22 }
  },
  {
    id: 6,
    num: 2,
    theme: "arena",
    genre: "LUCHA 1v1",
    blurb: "Combate en The Office contra la CPU o reta a un compañero desde otro móvil en tiempo real.",
    chips: ["🥊 1 contra 1", "🤖 CPU", "📱 Online"],
    name: "Code Clash Arena",
    title: "6. Code Clash Arena",
    subtitle: "La Batalla del Sprint (1v1)",
    desc: "¡Combate 1v1 en The Office! Pelea contra la CPU o reta a un compañero en otro móvil en tiempo real con los personajes de Clevergy.",
    bossName: "EL COMPAÑERO RIVAL",
    fragmentName: "Trofeo de Oro: Sprint Champion 🥊",
    bgClass: "world-fight",
    bgGradient: ["#090e1f", "#17234a"],
    platformColor: "#25345c",
    accentColor: "#ff4d5e",
    iconEmoji: "🥊",
    mapCoords: { x: 50, y: 78 },
    mapCoordsPortrait: { x: 65, y: 9 }
  },
  {
    id: 7,
    num: 3,
    theme: "doodle",
    genre: "SHOOTER 3D",
    blurb: "La oficina dibujada a boli: oleadas de emails en cooperativo o todos contra todos en sala con tus compañeros.",
    chips: ["👥 Hasta 6", "⚔️ PvP", "🤝 Coop"],
    name: "Doodle District",
    title: "7. Doodle District",
    subtitle: "El Cuaderno del Sprint (3D)",
    desc: "La oficina se ha convertido en un cuaderno dibujado a boli. Shooter en primera persona: sobrevive a 5 oleadas de emails, reuniones y «¿tienes 5 minutos?» y borra a INBOX INFINITO.",
    bossName: "INBOX INFINITO",
    fragmentName: "Trofeo: Inbox Zero ✏️",
    bgClass: "world-doodle",
    bgGradient: ["#f6f3e6", "#dfe6f7"],
    platformColor: "#1f38b8",
    accentColor: "#6f8cff",
    iconEmoji: "✏️",
    mapCoords: { x: 27, y: 79 },
    mapCoordsPortrait: { x: 28, y: 8 }
  }
,
  {
    id: 8,
    num: 4,
    theme: "kart",
    genre: "CARRERAS",
    blurb: "Carreras de motos de agua por el Pantano de San Juan: derrapes, rampas, turbos y objetos de oficina contra 5 rivales u online.",
    chips: ["🚤 6 pilotos", "🎁 Objetos", "📱 Online"],
    name: "Pantano Kart",
    title: "4. Pantano Kart",
    subtitle: "Pantano de San Juan · Madrid",
    desc: "Carreras acuáticas estilo kart por el Pantano de San Juan, dibujadas a boli.",
    bossName: "EL CRONO",
    fragmentName: "Trofeo: Copa del Pantano 🏆",
    bgClass: "world-kart",
    bgGradient: ["#dff1ff", "#9fd3ff"],
    platformColor: "#1f38b8",
    accentColor: "#35b6ff",
    iconEmoji: "🚤",
    mapCoords: { x: 50, y: 50 },
    mapCoordsPortrait: { x: 50, y: 50 }
  }
];

// Mundos visibles en la pantalla de elección (en este orden)
export const VISIBLE_WORLDS = WORLDS.filter((w) => !w.hidden).sort((a, b) => a.num - b.num);

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
    ranks: {}, // { 1: "S" }
    currentWorldId: 1
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
  prog.currentWorldId = Math.min(5, Math.max(prog.currentWorldId, worldId + 1));
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

export function isWorldUnlocked(worldId, progress) {
  return true; // Desbloqueados todos los mundos para explorar y probar directamente
}
