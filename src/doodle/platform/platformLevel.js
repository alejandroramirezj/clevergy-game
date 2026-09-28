// =============================================================================
// platformLevel.js — Nivel del MUNDO 1 · THE OFFICE (plataformas 2.5D)
// El nivel se "dibuja" con funciones en vez de ASCII: más fácil de leer y retocar.
// Unidades: 1 casilla = 1 m. y = 0 es el fondo; el suelo normal tiene 2 casillas.
// Tipos de casilla: g suelo · s sólido (mesas, servidores) · b ladrillo (se rompe)
//                   q bloque ? · u bloque ? usado · p plataforma atravesable · x pinchos
// =============================================================================

export const LEVEL_W = 226;
export const LEVEL_H = 18;

export function makeLevel() {
  const tiles = new Map(); // "x,y" → { t, item? }
  const L = {
    tiles, coins: [], enemies: [], movers: [], springs: [], checkpoints: [], fragments: [], decor: [],
    start: { x: 3, y: 2 }, boss: { x0: 184, x1: 204, spawnX: 198 }, flagX: 217, width: LEVEL_W
  };
  const set = (x, y, t, extra) => tiles.set(`${x},${y}`, { t, ...extra });
  const ground = (x0, x1, h = 2) => { for (let x = x0; x <= x1; x++) for (let y = 0; y < h; y++) set(x, y, "g"); };
  const solid = (x0, x1, y0, y1, t = "s") => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) set(x, y, t); };
  const plat = (x0, w, y) => { for (let x = x0; x < x0 + w; x++) set(x, y, "p"); };
  const q = (x, y, item = "coin") => set(x, y, "q", { item });
  const brick = (x0, x1, y) => { for (let x = x0; x <= x1; x++) set(x, y, "b"); };
  const spikes = (x0, x1, y = 2) => { for (let x = x0; x <= x1; x++) set(x, y, "x"); };
  const coins = (x0, y, n, dx = 1, dy = 0) => { for (let i = 0; i < n; i++) L.coins.push({ x: x0 + i * dx + 0.5, y: y + i * dy + 0.5 }); };
  const arc = (x0, y, n, h) => { for (let i = 0; i < n; i++) { const k = i / (n - 1); L.coins.push({ x: x0 + i + 0.5, y: y + Math.sin(k * Math.PI) * h + 0.5 }); } };
  const enemy = (type, x, y, extra = {}) => L.enemies.push({ type, x, y, ...extra });
  const decor = (type, x, extra = {}) => L.decor.push({ type, x, ...extra });

  // ── 1 · La oficina (0–40): correr, saltar, bloques ? y los primeros emails ──
  ground(0, 40);
  decor("desk", 6); decor("plant", 1); decor("window", 10); decor("board", 26);
  arc(6, 3, 5, 2);
  q(10, 6); brick(11, 11, 6); q(12, 6, "coffee"); brick(13, 13, 6); q(14, 6);
  q(12, 10, "coin");
  enemy("walker", 18, 2);
  solid(22, 24, 2, 2); // una mesa
  coins(22, 4, 3);
  enemy("walker", 27, 2);
  solid(30, 31, 2, 4); // un servidor
  coins(30, 6, 2);
  enemy("walker", 35, 2);

  // ── 2 · El café derramado (40–70): foso, plataforma móvil y muelle ──
  ground(41, 43);
  plat(44, 2, 4);
  L.movers.push({ x: 47, y: 4, w: 3, x0: 47, x1: 53, y0: 4, y1: 4, speed: 2.6 });
  coins(48, 7, 5);
  ground(56, 70);
  L.springs.push({ x: 57, y: 2 });
  coins(56, 9, 1); coins(57, 11, 1); coins(58, 13, 1);
  L.fragments.push({ x: 60.5, y: 14.5 });
  plat(59, 3, 13);
  enemy("meeting", 63, 2);
  decor("desk", 61); decor("window", 58);
  L.checkpoints.push({ x: 67 });

  // ── 3 · El hueco del ascensor (70–100): salto en pared ──
  ground(71, 100);
  solid(80, 80, 5, 13); // pared colgante: se pasa por debajo
  solid(84, 85, 2, 13); // muro alto: hay que subir rebotando
  coins(82, 5, 7, 0, 1);
  plat(86, 6, 12);
  coins(87, 13, 4);
  enemy("walker", 92, 2); enemy("walker", 96, 2);
  q(94, 6, "coffee");
  decor("plant", 74); decor("board", 72);

  // ── 4 · La sala de reuniones (100–140): gradas, ladrillos y reuniones ──
  ground(101, 140);
  plat(104, 4, 4); plat(110, 4, 6); plat(116, 4, 8);
  coins(105, 6, 3); coins(111, 8, 3); coins(117, 10, 3);
  brick(119, 125, 7);
  set(122, 7, "q", { item: "coffee" });
  L.fragments.push({ x: 122.5, y: 9.5 }); // encima de los ladrillos: rómpelos desde abajo o sube
  enemy("meeting", 113, 2); enemy("meeting", 128, 2);
  enemy("flyer", 124, 5);
  solid(134, 136, 2, 3);
  coins(134, 5, 3);
  decor("meeting", 107); decor("window", 118); decor("window", 130);

  // ── 5 · El pasillo de servidores (140–180): pinchos, emails voladores y ascensor ──
  ground(141, 180);
  spikes(148, 151); plat(148, 4, 4); coins(148, 6, 4);
  enemy("flyer", 154, 6);
  spikes(158, 162); plat(157, 2, 4); plat(161, 2, 6);
  enemy("flyer", 164, 8);
  solid(166, 167, 2, 4); coins(166, 6, 2);
  L.movers.push({ x: 170, y: 3, w: 3, x0: 170, x1: 170, y0: 3, y1: 11, speed: 2.2 });
  plat(173, 4, 11);
  L.fragments.push({ x: 175.5, y: 13 });
  enemy("walker", 176, 2);
  decor("rack", 144); decor("rack", 152); decor("rack", 168);
  L.checkpoints.push({ x: 179 });

  // ── 6 · La arena del jefe (181–205): EMAIL CHAIN ──
  ground(181, 205);
  decor("board", 192);

  // ── 7 · Meta: escalera, bandera de INBOX ZERO y la oficina de Clevergy ──
  ground(206, LEVEL_W - 1);
  for (let i = 0; i < 6; i++) solid(207 + i, 207 + i, 2, 2 + i);
  coins(207, 9, 6, 1, 0);
  decor("hq", 222);

  return L;
}
