// 5 Mundos oficiales de "RETREAT: THE LEGEND OF THE TEAM"

export const WORLDS = [
  {
    id: 1,
    name: "The Office",
    title: "1. The Office",
    subtitle: "Oficinas Centrales de Clevergy",
    desc: "Supera los bugs 404, tazas frías de café y alcanza el Inbox Zero derrotando a Email Chain.",
    bossName: "EMAIL CHAIN",
    fragmentName: "Fragmento 1: El Backend",
    bgClass: "world-office",
    bgGradient: ["#0b0e1a", "#141a2e"],
    platformColor: "#283454",
    accentColor: "#59d8ff",
    iconEmoji: "🏢",
    mapCoords: { x: 12, y: 64 } // % on map trail
  },
  {
    id: 2,
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
    mapCoords: { x: 28, y: 32 }
  },
  {
    id: 3,
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
    mapCoords: { x: 48, y: 58 }
  },
  {
    id: 4,
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
    mapCoords: { x: 70, y: 30 }
  },
  {
    id: 5,
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
    mapCoords: { x: 88, y: 52 }
  },
  {
    id: 6,
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
    mapCoords: { x: 50, y: 78 }
  }
];

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
  return prog;
}

export function isWorldUnlocked(worldId, progress) {
  return true; // Desbloqueados todos los mundos para explorar y probar directamente
}
