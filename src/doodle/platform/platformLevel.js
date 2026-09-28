// =============================================================================
// platformLevel.js — MUNDO 1 · GOOGLE FOR STARTUPS CAMPUS MADRID (plataformas 2.5D)
// La antigua fábrica neomudéjar de ladrillo de la calle Moreno Nieto (junto al
// Manzanares, con el Palacio Real y la Almudena al fondo): calle con terraza, el
// Campus Café en dos niveles, la torre de cinco plantas de coworking que se sube en
// vertical, las salas de cristal de arriba, el auditorio del Demo Day (jefe) y la
// salida con vistas al Palacio.
// Unidades: 1 casilla = 1 m; y = 0 es el fondo. Tipos de casilla:
//   g suelo · s sólido · b ladrillo (se rompe) · q bloque ? · p atravesable
//   x pinchos · c silla plegable (se hunde al pisarla y vuelve a aparecer)
//   k muro de ladrillo visto (sólido, la fábrica neomudéjar)
// =============================================================================

export const LEVEL_W = 252;
export const LEVEL_H = 34;

export function makeLevel() {
  const tiles = new Map();
  const L = {
    tiles, coins: [], enemies: [], movers: [], springs: [], checkpoints: [], fragments: [], decor: [], vents: [],
    start: { x: 3, y: 2 }, boss: { x0: 194, x1: 213, spawnX: 208 }, flagX: 238, width: LEVEL_W
  };
  const set = (x, y, t, extra) => tiles.set(`${x},${y}`, { t, ...extra });
  const clear = (x0, x1, y0, y1) => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) tiles.delete(`${x},${y}`); };
  const ground = (x0, x1, h = 2) => { for (let x = x0; x <= x1; x++) for (let y = 0; y < h; y++) set(x, y, "g"); };
  const solid = (x0, x1, y0, y1, t = "s") => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) set(x, y, t); };
  const plat = (x0, w, y) => { for (let x = x0; x < x0 + w; x++) set(x, y, "p"); };
  const chairs = (x0, w, y) => { for (let x = x0; x < x0 + w; x++) set(x, y, "c"); };
  const q = (x, y, item = "coin") => set(x, y, "q", { item });
  const brick = (x0, x1, y) => { for (let x = x0; x <= x1; x++) set(x, y, "b"); };
  const spikes = (x0, x1, y = 2, pit = false) => { for (let x = x0; x <= x1; x++) set(x, y, "x", pit ? { pit: true } : {}); };
  const coins = (x0, y, n, dx = 1, dy = 0) => { for (let i = 0; i < n; i++) L.coins.push({ x: x0 + i * dx + 0.5, y: y + i * dy + 0.5 }); };
  const arc = (x0, y, n, h) => { for (let i = 0; i < n; i++) { const k = i / (n - 1); L.coins.push({ x: x0 + i + 0.5, y: y + Math.sin(k * Math.PI) * h + 0.5 }); } };
  const enemy = (type, x, y) => L.enemies.push({ type, x, y });
  const decor = (type, x, y = 2, extra = {}) => L.decor.push({ type, x, y, ...extra });
  const puf = (x, y) => L.springs.push({ x, y });

  // telón de fondo de todo el nivel
  decor("skyline", 0);

  // ── 1 · Calle Moreno Nieto (0–38): terraza con sombrillas y la fachada neomudéjar ──
  ground(0, 38);
  decor("gsign", 20, 2);
  decor("umbrella", 8); decor("umbrella", 13);
  plat(7, 3, 4); plat(12, 3, 4); // las sombrillas hacen de plataforma
  arc(6, 5, 9, 2.5);
  q(17, 6); q(18, 6, "coffee"); q(19, 6);
  enemy("walker", 15, 2);
  puf(24, 2);
  coins(24, 9, 1); coins(24, 11, 1); coins(24, 13, 1);
  q(27, 13, "coffee");
  enemy("walker", 30, 2);
  decor("bikes", 33); decor("door", 37);

  // ── 2 · Campus Café (40–90): barra, mesas y el altillo con sofás ──
  ground(39, 90);
  decor("tiles", 40, 2, { w: 50 });
  solid(45, 48, 2, 2); decor("espresso", 46.5); // la barra
  coins(45, 4, 4);
  for (let k = 0; k < 5; k++) solid(56 + k, 56 + k, 2, 2 + k); // escalera al altillo
  plat(61, 25, 7); // el altillo (atravesable)
  decor("sofa", 66, 8); decor("sofa", 74, 8); decor("lamp", 70, 8);
  solid(63, 64, 2, 2); solid(70, 71, 2, 2); solid(77, 78, 2, 2); // mesas de abajo
  coins(62, 9, 10, 2);
  q(68, 12); q(69, 12, "coffee");
  enemy("walker", 66, 2); enemy("walker", 80, 2); enemy("meeting", 79, 8); enemy("flyer", 71, 12);
  puf(84, 8);
  L.fragments.push({ x: 84.5, y: 18.5 });
  coins(84, 12, 3, 0, 2);
  L.checkpoints.push({ x: 88 });

  // ── 3 · La torre de cinco plantas (90–128): se sube en vertical ──
  ground(89, 128);
  solid(91, 92, 5, 31, "k"); // pared izquierda (con la puerta de entrada abajo)
  decor("door", 91.5, 2);
  // plantas cada 3 m: atravesables (p) y forjados sólidos con un hueco (hay que rodearlos)
  plat(93, 35, 4);
  solid(93, 119, 7, 7); decor("beam", 106, 7.2);
  plat(93, 35, 10);
  solid(100, 128, 13, 13); decor("beam", 114, 13.2);
  plat(93, 35, 16);
  solid(93, 119, 19, 19); decor("beam", 106, 19.2);
  plat(93, 35, 22);
  plat(93, 3, 25); L.fragments.push({ x: 94.5, y: 27.5 });
  chairs(104, 3, 10); chairs(112, 3, 16); chairs(118, 2, 22);
  clear(95, 97, 7, 7); clear(95, 97, 19, 19); // hueco del ascensor
  L.movers.push({ x: 95, y: 2, w: 3, x0: 95, x1: 95, y0: 2, y1: 22, speed: 2.6 }); // ascensor
  L.vents.push({ x0: 121, x1: 127, y0: 2, y1: 12 }); // la ventilación te sube
  decor("vent", 124, 2);
  puf(110, 2);
  coins(110, 6, 4, 0, 1); coins(120, 9, 4, 1, 0); coins(96, 15, 4, 1, 0); coins(122, 18, 3, 1, 0); coins(100, 24, 5, 2, 0);
  enemy("walker", 106, 5); enemy("walker", 112, 11); enemy("walker", 104, 17); enemy("flyer", 110, 14); enemy("flyer", 118, 21);
  decor("pipes", 100, 2); decor("pipes", 116, 11);

  // ── 4 · El coworking de arriba (129–176): salas de cristal, fosos y sillas plegables ──
  solid(129, 176, 0, 24, "k"); // el edificio (se camina por encima, a 25 m)
  L.checkpoints.push({ x: 132 });
  clear(141, 146, 17, 24); spikes(141, 146, 17, true);
  chairs(142, 1, 24); chairs(145, 1, 24);
  coins(141, 27, 6);
  decor("glassroom", 152, 25); enemy("meeting", 152, 25);
  solid(154, 154, 25, 26); // un archivador para subir
  brick(155, 158, 28); L.fragments.push({ x: 156.5, y: 30.5 });
  q(160, 28, "coffee");
  enemy("walker", 158, 25); enemy("flyer", 147, 29);
  clear(164, 169, 18, 24); spikes(164, 169, 18, true);
  L.movers.push({ x: 164, y: 24, w: 2, x0: 164, x1: 168, y0: 24, y1: 24, speed: 2.4 });
  decor("glassroom", 172, 25); enemy("meeting", 173, 25);
  coins(163, 27, 7);

  // ── 5 · El auditorio (177–214): se baja por las gradas hasta el escenario del Demo Day ──
  for (let k = 0; k < 8; k++) { solid(177 + k * 2, 178 + k * 2, 0, 21 - k * 3); decor("seats", 177.5 + k * 2, 22 - k * 3); }
  ground(193, 214);
  decor("screen", 203, 2); decor("spot", 196, 2); decor("spot", 210, 2);

  // ── 6 · Salida: la bandera con el Palacio Real al fondo ──
  ground(215, LEVEL_W - 1);
  for (let i = 0; i < 5; i++) solid(226 + i, 226 + i, 2, 2 + i);
  coins(226, 9, 5);
  decor("campus", 246, 2);

  return L;
}
