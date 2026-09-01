import { WORLDS } from "../config/worlds.js";
import { TILE, LH, LW, ARENA_L, ARENA_R } from "../config/constants.js";
import { grid, rct } from "../engine/physics.js";
import { GameState, respawn, initCoffees, msg } from "./state.js";
import { spawnEnemies } from "./enemies.js";

export function loadWorld(worldId) {
  const w = WORLDS.find((x) => x.id === worldId) || WORLDS[0];
  GameState.currentWorld = w.id;
  GameState.worldTheme = w;

  // Clear level grid
  for (let j = 0; j < LH; j++) {
    for (let i = 0; i < LW; i++) {
      grid[j][i] = ".";
    }
  }

  // Base floor
  rct(0, 15, 44, 3, "#");
  rct(47, 15, 33, 3, "#");
  rct(92, 15, 122, 3, "#");

  // World-specific platform layouts
  if (w.id === 1) {
    // 1. The Office: Desks, cubicle walls, coffee breaks
    rct(28, 12, 3, 1, "=");
    rct(33, 10, 3, 1, "=");
    rct(38, 12, 3, 1, "=");
    rct(44, 8, 3, 10, "#"); // The Office Firewall
    rct(56, 12, 3, 1, "=");
    rct(62, 10, 3, 1, "=");
    rct(70, 12, 4, 1, "=");
    rct(85, 11, 2, 1, "=");
    rct(100, 12, 3, 1, "=");
    rct(106, 10, 3, 1, "=");
    rct(52, 14, 2, 1, "^");
    rct(96, 14, 2, 1, "^");
    rct(118, 12, 3, 1, "=");
    rct(128, 12, 3, 1, "=");
  } else if (w.id === 2) {
    // 2. Integration Jungle: High branches, fiber optic vines, floating server racks
    rct(15, 12, 4, 1, "=");
    rct(22, 9, 3, 1, "=");
    rct(29, 11, 4, 1, "=");
    rct(36, 8, 3, 1, "=");
    rct(44, 7, 3, 11, "#"); // Giant Jungle Server Trunk
    rct(50, 12, 3, 1, "=");
    rct(58, 9, 4, 1, "=");
    rct(66, 7, 3, 1, "=");
    rct(74, 10, 4, 1, "=");
    rct(84, 10, 3, 1, "=");
    rct(102, 11, 4, 1, "=");
    rct(110, 8, 3, 1, "=");
    rct(118, 11, 3, 1, "=");
    rct(55, 14, 3, 1, "^");
    rct(95, 14, 3, 1, "^");
  } else if (w.id === 3) {
    // 3. Product Kingdom: Castle ramparts, roadmap towers, release bridges
    rct(18, 11, 5, 1, "=");
    rct(26, 8, 4, 1, "=");
    rct(34, 11, 4, 1, "=");
    rct(44, 6, 4, 12, "#"); // Fortress Gate Tower
    rct(54, 11, 4, 1, "=");
    rct(62, 8, 3, 1, "=");
    rct(71, 10, 4, 1, "=");
    rct(82, 9, 3, 1, "=");
    rct(100, 10, 4, 1, "=");
    rct(108, 7, 4, 1, "=");
    rct(118, 11, 4, 1, "=");
    rct(52, 14, 2, 1, "^");
    rct(98, 14, 2, 1, "^");
  } else if (w.id === 4) {
    // 4. Meeting Dimension: Cyber platforms, floating calendar grids, high vertigo gaps
    rct(16, 11, 3, 1, "=");
    rct(23, 8, 3, 1, "=");
    rct(31, 11, 3, 1, "=");
    rct(39, 7, 3, 1, "=");
    rct(44, 5, 3, 13, "#"); // The Monolithic Calendar Wall
    rct(53, 10, 4, 1, "=");
    rct(62, 7, 3, 1, "=");
    rct(70, 9, 3, 1, "=");
    rct(79, 6, 3, 1, "=");
    rct(88, 9, 3, 1, "=");
    rct(101, 9, 4, 1, "=");
    rct(112, 7, 3, 1, "=");
    rct(50, 14, 3, 1, "^");
    rct(94, 14, 3, 1, "^");
  } else {
    // 5. The Retreat: Snow-capped mountain climb up to the summit campfire
    rct(14, 12, 3, 1, "=");
    rct(21, 10, 3, 1, "=");
    rct(28, 8, 4, 1, "=");
    rct(36, 6, 3, 1, "=");
    rct(44, 4, 4, 14, "#"); // The Alpine Cliff of Deadline
    rct(54, 10, 4, 1, "=");
    rct(63, 7, 3, 1, "=");
    rct(73, 9, 4, 1, "=");
    rct(83, 6, 4, 1, "=");
    rct(102, 8, 4, 1, "=");
    rct(112, 6, 4, 1, "=");
    rct(120, 10, 3, 1, "=");
    rct(52, 14, 3, 1, "^");
    rct(95, 14, 3, 1, "^");
  }

  // Reset player
  GameState.P.checkpoint = 0;
  GameState.P.hp = 5;
  respawn();
  initCoffees();
  spawnEnemies();

  // Configure Boss for this World
  const bossHpByWorld = { 1: 80, 2: 95, 3: 110, 4: 130, 5: 160 };
  GameState.boss = {
    active: false,
    hp: bossHpByWorld[w.id] || 80,
    maxHp: bossHpByWorld[w.id] || 80,
    x: 112 * TILE,
    y: 11 * TILE,
    vx: 0,
    vy: 0,
    dead: false,
    t: 0,
    ifr: 0,
    name: w.bossName,
    phase: 1
  };

  GameState.fragment = null;
  GameState.score = 0;
  GameState.gameTime = 0;
  GameState.deaths = 0;
  GameState.projectiles = [];
  GameState.particles = [];
  GameState.floaters = [];
  GameState.hitboxes = [];
  GameState.status = "play";
  GameState.worldMapOpen = false;

  msg(`MUNDO ${w.id}: ${w.name.toUpperCase()}`, 3);
}
