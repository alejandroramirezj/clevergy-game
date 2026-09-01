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

  // Base floors & starter sections per world
  if (w.id === 1) {
    // 1. The Office: Standard office floor and desk cubicles
    rct(0, 15, 44, 3, "#");
    rct(47, 15, 33, 3, "#");
    rct(92, 15, 122, 3, "#");

    rct(8, 12, 3, 1, "=");
    rct(16, 10, 3, 1, "=");
    rct(24, 12, 3, 1, "=");
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
  } else if (w.id === 2) {
    // 2. Integration Jungle: Swamp gaps, high branches & tree trunks
    rct(0, 15, 14, 3, "#"); // Start island
    rct(19, 15, 25, 3, "#"); // Root floor (gap at 14-19)
    rct(47, 15, 33, 3, "#");
    rct(92, 15, 122, 3, "#");

    rct(6, 12, 3, 1, "=");
    rct(14, 10, 4, 1, "="); // High vine bridge over swamp
    rct(22, 8, 3, 1, "=");
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
    rct(55, 14, 3, 1, "^");
    rct(95, 14, 3, 1, "^");
  } else if (w.id === 3) {
    // 3. Product Kingdom: Castle ramparts, moat at 13-17, stone battlements
    rct(0, 15, 13, 3, "#"); // Castle entrance
    rct(18, 15, 26, 3, "#"); // Castle courtyard (moat at 13-18)
    rct(47, 15, 33, 3, "#");
    rct(92, 15, 122, 3, "#");

    rct(7, 11, 4, 1, "=");
    rct(13, 8, 5, 1, "="); // Moat drawbridge
    rct(22, 11, 4, 1, "=");
    rct(28, 8, 4, 1, "=");
    rct(36, 11, 4, 1, "=");
    rct(44, 6, 4, 12, "#"); // Fortress Gate Tower
    rct(54, 11, 4, 1, "=");
    rct(62, 8, 3, 1, "=");
    rct(71, 10, 4, 1, "=");
    rct(82, 9, 3, 1, "=");
    rct(100, 10, 4, 1, "=");
    rct(108, 7, 4, 1, "=");
    rct(52, 14, 2, 1, "^");
    rct(98, 14, 2, 1, "^");
  } else if (w.id === 4) {
    // 4. Meeting Dimension: Cyber islands over the void, vertical jump pads
    rct(0, 15, 12, 3, "#"); // Spawn platform
    rct(16, 14, 10, 3, "#"); // Floating cyber slab
    rct(30, 15, 14, 3, "#");
    rct(47, 15, 33, 3, "#");
    rct(92, 15, 122, 3, "#");

    rct(8, 11, 3, 1, "=");
    rct(13, 8, 3, 1, "=");
    rct(22, 6, 3, 1, "=");
    rct(28, 10, 3, 1, "=");
    rct(37, 7, 3, 1, "=");
    rct(44, 5, 3, 13, "#"); // Monolithic Calendar Wall
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
    // 5. The Retreat: Stepped alpine mountain climb from low to high
    rct(0, 16, 12, 3, "#"); // Low trailhead
    rct(14, 15, 12, 3, "#"); // First ridge
    rct(28, 14, 16, 3, "#"); // High snow plateau
    rct(47, 15, 33, 3, "#");
    rct(92, 15, 122, 3, "#");

    rct(6, 13, 3, 1, "=");
    rct(12, 10, 3, 1, "=");
    rct(19, 8, 3, 1, "=");
    rct(27, 6, 4, 1, "=");
    rct(36, 5, 3, 1, "=");
    rct(44, 4, 4, 14, "#"); // The Alpine Cliff of Deadline
    rct(54, 10, 4, 1, "=");
    rct(63, 7, 3, 1, "=");
    rct(73, 9, 4, 1, "=");
    rct(83, 6, 4, 1, "=");
    rct(102, 8, 4, 1, "=");
    rct(112, 6, 4, 1, "=");
    rct(52, 14, 3, 1, "^");
    rct(95, 14, 3, 1, "^");
  }

  // Reset player
  GameState.P.checkpoint = 0;
  GameState.P.hp = 5;
  respawn();
  initCoffees();
  spawnEnemies(w.id);

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
