export const TILE = 36;
export const GRAV = 0.52;
export const LW = 214;
export const LH = 18;

export const ARENA_L = 112 * TILE;
export const ARENA_R = 136 * TILE;

export const CHECKPOINTS = [
  { x: 2 * TILE, y: 13 * TILE },
  { x: 48 * TILE, y: 13 * TILE },
  { x: 93 * TILE, y: 13 * TILE }
];

export const SIGNS = [
  { x: 5, y: 13, t: "←→ mover · ↑ saltar · X habilidad" },
  { x: 15, y: 13, t: "TAB / 👥 cambia de compañero" },
  { x: 41, y: 11, t: "PARED ALTA → 🦁 🥮 💪 🕊️" },
  { x: 76, y: 12, t: "HUECO GIGANTE → 🕊️ 🖨️ 🏐 💪" },
  { x: 94, y: 12, t: "ENJAMBRE → 🍺 📻 🎙️ ☭" },
  { x: 110, y: 12, t: "⚠ ZONA DE BOSS ⚠" }
];

export const RAW_COFFEE_COORDS = [
  [10, 13], [24, 13], [29, 10], [34, 8], [39, 10], [46, 6], [50, 13],
  [57, 10], [63, 8], [71, 10], [85, 9], [86, 9], [94, 13], [101, 10],
  [107, 8], [119, 10], [129, 10], [124, 13]
];

export const BOOT_LINES = [
  "RETREAT.EXE",
  "",
  "Loading team...",
  "  Beltrán ...... OK",
  "  Álvaro ....... OK",
  "  Alejandro .... OK",
  "  Paloma ....... OK",
  "  José Luis .... OK",
  "  ...and 13 more.",
  "",
  "RETREAT.exe ....... ##ERROR##",
  "",
  "##THE RETREAT HAS BEEN CORRUPTED.##",
  "##THE DEADLINE: \"NO HAY TIEMPO.\"##",
  "##El CÓDIGO FUENTE DEL RETREAT ha sido robado.##"
];
