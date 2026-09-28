// =============================================================================
// cinkLevel.js — CINK Coworking (Infanta Mercedes, Madrid) dibujado a boli
// Escenario del shooter: el edificio de esquina redonda entre la calle de Pedro
// Villar y la del Limonero, con tres plantas visitables:
//   · Planta baja: entrada con puertas automáticas, recepción (Victoria), mesa alta,
//     comedor (mesas de madera, 4 microondas, vending), terraza con césped y salas 1–4.
//   · Primera: hot desk y, subiendo a la derecha, la oficina de Clevergy en la esquina
//     redonda (3 mesas, estantería con café y pizarra).
//   · Segunda: más oficinas.
// Todo son cajas con collider AABB {x0,x1,y0,y1,z0,z1} (las puertas llevan `open`).
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "./doodleRender.js";
import { GEO } from "./doodleLevel.js";
import { inkText, cinkLogo } from "./inkText.js";

export const ARENA = 36;
export const F1 = 4.4, F2 = 8.8, ROOF = 13.2;
export const FLOORS = [0, F1, F2];
export const floorOf = (y) => (y < 3 ? 0 : y < 7.5 ? 1 : 2);
export const START = { x: 29, y: 0, z: 17, yaw: Math.PI / 4 };
export const BOSS_AREA = { x0: -4.5, x1: 6.5, z0: -26.5, z1: -13.5 };
export const COFFEE_SPOTS = [[-14, 0, 4.2], [18.2, F1, -6], [0, F2, 2], [0, 0, -20]];
// puntos de aparición de enemigos: [x, z, suelo]
export const SPAWNS = [
  [0, 16, 0], [-14, 15, 0], [28, -6, 0], [29, -22, 0], [-14, 2, 0], [-14, -24, 0], [14, -24, 0], [0, -20, 0], [14, -6, 0], [-14, -16, 0], [14, -16, 0],
  [-18, 2, F1], [-10, -10, F1], [14, 2, F1], [-14, -20, F1], [14, -20, F1], [-4, 3, F1],
  [-16, 2, F2], [12, 2, F2], [-14, -20, F2], [14, -20, F2], [0, -10, F2]
];
// salidas de jugadores en sala (repartidas por el edificio)
export const PLAYER_SPAWNS = [[29, 17, 0], [0, 16, 0], [12, -8, 0], [-12, 2, 0], [0, -20, 0], [-14, -24, 0], [-14, 2, F1], [14, -4, F1], [-14, -20, F1], [0, 2, F2]];

const WOOD = { ink: INK.ORANGE, tone: 0.15 };
const OSB = { ink: INK.ORANGE, tone: -0.12 };
const STONE = { ink: INK.BLACK, tone: 0.32 };

export function buildLevel(scene) {
  const colliders = [];
  const doors = [];
  const root = new THREE.Group();
  scene.add(root);

  // caja por esquinas (más cómodo para arquitectura)
  function B(x0, y0, z0, x1, y1, z1, ink, o = {}) {
    const m = new THREE.Mesh(GEO.box, mat(ink, o));
    m.scale.set(x1 - x0, y1 - y0, z1 - z0);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    root.add(m);
    if (o.collide !== false) colliders.push({ x0, x1, y0, y1, z0, z1 });
    return m;
  }
  const C = (x, y0, z, r, h, ink, o = {}) => {
    const m = new THREE.Mesh(GEO.cyl, mat(ink, o));
    m.scale.set(r * 2, h, r * 2);
    m.position.set(x, y0 + h / 2, z);
    root.add(m);
    if (o.collide) colliders.push({ x0: x - r, x1: x + r, z0: z - r, z1: z + r, y0, y1: y0 + h });
    return m;
  };
  const S = (x, y, z, r, ink, o = {}) => {
    const m = new THREE.Mesh(GEO.sph, mat(ink, o));
    m.scale.setScalar(r * 2);
    m.position.set(x, y, z);
    root.add(m);
    return m;
  };
  // coloca un grupo (texto, logo…) mirando hacia la normal (nx, nz)
  function place(g, x, y, z, nx, nz) {
    g.position.set(x, y, z);
    g.rotation.y = Math.atan2(nx, nz);
    root.add(g);
    return g;
  }
  // pared a lo largo de z (en x fija) con huecos [[zA, zB, altoHueco]]
  function wallX(x, z0, z1, y0, y1, gaps = [], ink = INK.BLACK, o = { tone: 0.3 }, t = 0.3) {
    let cur = z0;
    for (const [a, b, top = 2.7] of gaps.slice().sort((p, q) => p[0] - q[0])) {
      if (a > cur) B(x - t / 2, y0, cur, x + t / 2, y1, a, ink, o);
      if (y0 + top < y1) B(x - t / 2, y0 + top, a, x + t / 2, y1, b, ink, o);
      cur = b;
    }
    if (cur < z1) B(x - t / 2, y0, cur, x + t / 2, y1, z1, ink, o);
  }
  function wallZ(z, x0, x1, y0, y1, gaps = [], ink = INK.BLACK, o = { tone: 0.3 }, t = 0.3) {
    let cur = x0;
    for (const [a, b, top = 2.7] of gaps.slice().sort((p, q) => p[0] - q[0])) {
      if (a > cur) B(cur, y0, z - t / 2, a, y1, z + t / 2, ink, o);
      if (y0 + top < y1) B(a, y0 + top, z - t / 2, b, y1, z + t / 2, ink, o);
      cur = b;
    }
    if (cur < x1) B(cur, y0, z - t / 2, x1, y1, z + t / 2, ink, o);
  }
  const glassX = (x, z0, z1, y0, y1, gaps) => {
    wallX(x, z0, z1, y0, y1, gaps, INK.BLUE, { tone: 0.34 }, 0.12);
    B(x - 0.08, y0 + 0.02, z0, x + 0.08, y0 + 0.12, z1, INK.BLACK, { fill: true, collide: false });
    for (let z = z0; z <= z1; z += 2) B(x - 0.07, y0, z - 0.04, x + 0.07, y1, z + 0.04, INK.BLACK, { fill: true, collide: false });
  };
  const glassZ = (z, x0, x1, y0, y1, gaps) => {
    wallZ(z, x0, x1, y0, y1, gaps, INK.BLUE, { tone: 0.34 }, 0.12);
    B(x0, y0 + 0.02, z - 0.08, x1, y0 + 0.12, z + 0.08, INK.BLACK, { fill: true, collide: false });
    for (let x = x0; x <= x1; x += 2) B(x - 0.04, y0, z - 0.07, x + 0.04, y1, z + 0.07, INK.BLACK, { fill: true, collide: false });
  };
  // losa con huecos: se trocea en rectángulos
  function slab(y, rect, holes, ink = INK.BLACK, o = { tone: 0.62 }) {
    const [X0, Z0, X1, Z1] = rect;
    const xs = [...new Set([X0, X1, ...holes.flatMap((h) => [h[0], h[2]])])].filter((v) => v >= X0 && v <= X1).sort((a, b) => a - b);
    const zs = [...new Set([Z0, Z1, ...holes.flatMap((h) => [h[1], h[3]])])].filter((v) => v >= Z0 && v <= Z1).sort((a, b) => a - b);
    const inHole = (x, z) => holes.some((h) => x > h[0] && x < h[2] && z > h[1] && z < h[3]);
    for (let j = 0; j < zs.length - 1; j++) {
      let run = null;
      for (let i = 0; i < xs.length - 1; i++) {
        const cx = (xs[i] + xs[i + 1]) / 2, cz = (zs[j] + zs[j + 1]) / 2;
        const solid = !inHole(cx, cz);
        if (solid && !run) run = xs[i];
        if ((!solid || i === xs.length - 2) && run !== null) {
          const end = solid ? xs[i + 1] : xs[i];
          if (end > run) B(run, y - 0.4, zs[j], end, y, zs[j + 1], ink, o);
          run = null;
        }
      }
    }
  }
  // cuarto de círculo de la esquina (losas y techos): celdas de 1 m dentro del radio
  const ARC = { cx: 14, cz: 0, r: 6 };
  function arcSlab(y, ink = INK.BLACK, o = { tone: 0.62 }) {
    for (let z = 0; z < ARC.r; z++) {
      let w = 0;
      while (w < ARC.r && Math.hypot(w + 0.5, z + 0.5) < ARC.r) w++;
      if (w > 0) B(ARC.cx, y - 0.4, ARC.cz + z, ARC.cx + w, y, ARC.cz + z + 1, ink, o);
    }
  }
  // pared curva de la esquina en segmentos; `gap` = [a0, a1] en radianes
  function arcWall(y0, y1, ink, o, gap, glass) {
    const N = 9;
    for (let k = 0; k < N; k++) {
      const a0 = (k / N) * Math.PI / 2, a1 = ((k + 1) / N) * Math.PI / 2, am = (a0 + a1) / 2;
      if (gap && am > gap[0] && am < gap[1]) continue;
      const px = ARC.cx + Math.cos(am) * ARC.r, pz = ARC.cz + Math.sin(am) * ARC.r;
      const chord = 2 * ARC.r * Math.sin((a1 - a0) / 2) + 0.05;
      const m = new THREE.Mesh(GEO.box, mat(ink, o));
      m.scale.set(0.3, y1 - y0, chord);
      m.position.set(px, (y0 + y1) / 2, pz);
      m.rotation.y = -am;
      root.add(m);
      if (glass) {
        const mull = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
        mull.scale.set(0.12, y1 - y0, 0.1);
        mull.position.set(ARC.cx + Math.cos(a0) * ARC.r, (y0 + y1) / 2, ARC.cz + Math.sin(a0) * ARC.r);
        root.add(mull);
      }
      const e0 = [ARC.cx + Math.cos(a0) * ARC.r, ARC.cz + Math.sin(a0) * ARC.r], e1 = [ARC.cx + Math.cos(a1) * ARC.r, ARC.cz + Math.sin(a1) * ARC.r];
      colliders.push({ x0: Math.min(e0[0], e1[0]) - 0.15, x1: Math.max(e0[0], e1[0]) + 0.15, z0: Math.min(e0[1], e1[1]) - 0.15, z1: Math.max(e0[1], e1[1]) + 0.15, y0, y1 });
    }
  }
  function stairs(xFrom, xTo, z0, z1, base, rise) {
    const n = 14, dir = Math.sign(xTo - xFrom), run = Math.abs(xTo - xFrom) / n, r = rise / n;
    for (let k = 0; k < n; k++) {
      const xa = xFrom + dir * k * run, xb = xFrom + dir * (k + 1) * run;
      B(Math.min(xa, xb), base, z0, Math.max(xa, xb), base + (k + 1) * r, z1, INK.BLACK, { tone: 0.28 });
      B(Math.min(xa, xb), base + (k + 1) * r - 0.04, z0, Math.max(xa, xb), base + (k + 1) * r + 0.01, z1, INK.ORANGE, { tone: 0.1, collide: false });
    }
    // pasamanos
    for (const z of [z0, z1]) {
      const m = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      const len = Math.hypot(xTo - xFrom, rise);
      m.scale.set(len, 0.06, 0.06);
      m.position.set((xFrom + xTo) / 2, base + rise / 2 + 1, z);
      m.rotation.z = Math.atan2(rise, xTo - xFrom);
      root.add(m);
    }
  }
  function railing(x0, z0, x1, z1, y) {
    B(Math.min(x0, x1) - 0.05, y, Math.min(z0, z1) - 0.05, Math.max(x0, x1) + 0.05, y + 1.1, Math.max(z0, z1) + 0.05, INK.BLACK, { tone: 0.4 });
    const len = Math.hypot(x1 - x0, z1 - z0);
    for (let k = 0; k <= len; k += 1) {
      const t = len ? k / len : 0;
      B(x0 + (x1 - x0) * t - 0.03, y, z0 + (z1 - z0) * t - 0.03, x0 + (x1 - x0) * t + 0.03, y + 1.1, z0 + (z1 - z0) * t + 0.03, INK.BLACK, { fill: true, collide: false });
    }
  }

  // ── mobiliario ──
  function table(x, z, w, d, y = 0, h = 0.76, top = WOOD) {
    B(x - w / 2, y + h - 0.06, z - d / 2, x + w / 2, y + h, z + d / 2, top.ink, { tone: top.tone, collide: false });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) B(x + sx * (w / 2 - 0.1) - 0.04, y, z + sz * (d / 2 - 0.1) - 0.04, x + sx * (w / 2 - 0.1) + 0.04, y + h, z + sz * (d / 2 - 0.1) + 0.04, INK.BLACK, { fill: true, collide: false });
    colliders.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, y0: y, y1: y + h });
  }
  function chair(x, z, y = 0, face = 0, ink = INK.BLACK) {
    const g = new THREE.Group();
    const seat = new THREE.Mesh(GEO.box, mat(ink, { tone: -0.1 })); seat.scale.set(0.5, 0.08, 0.5); seat.position.y = 0.45; g.add(seat);
    const back = new THREE.Mesh(GEO.box, mat(ink, { tone: -0.1 })); back.scale.set(0.5, 0.5, 0.07); back.position.set(0, 0.75, -0.22); g.add(back);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true })); l.scale.set(0.04, 0.45, 0.04); l.position.set(sx * 0.2, 0.22, sz * 0.2); g.add(l); }
    g.position.set(x, y, z);
    g.rotation.y = face;
    root.add(g);
  }
  function stool(x, z, y = 0) {
    C(x, y + 0.85, z, 0.22, 0.08, INK.BLACK, { tone: -0.1 });
    for (const a of [0, 2.1, 4.2]) B(x + Math.cos(a) * 0.15 - 0.03, y, z + Math.sin(a) * 0.15 - 0.03, x + Math.cos(a) * 0.15 + 0.03, y + 0.85, z + Math.sin(a) * 0.15 + 0.03, INK.BLACK, { fill: true, collide: false });
  }
  function plant(x, z, y = 0, big = 1) {
    C(x, y, z, 0.28 * big, 0.5 * big, INK.RED, { tone: 0.05, collide: true });
    S(x, y + 0.95 * big, z, 0.5 * big, INK.GREEN, { tone: -0.08 });
    S(x + 0.2, y + 1.35 * big, z - 0.1, 0.35 * big, INK.GREEN, { tone: -0.08 });
  }
  function whiteboard(x, y, z, nx, nz, w = 3) {
    const g = new THREE.Group();
    const b = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.5 })); b.scale.set(w, 1.3, 0.05); g.add(b);
    const f = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true })); f.scale.set(w + 0.1, 0.06, 0.07); f.position.y = -0.68; g.add(f);
    for (let k = 0; k < 3; k++) { const s = new THREE.Mesh(GEO.box, mat(k % 2 ? INK.RED : INK.BLUE, { fill: true })); s.scale.set(w * (0.3 + Math.random() * 0.4), 0.05, 0.03); s.position.set((Math.random() - 0.5) * w * 0.3, 0.35 - k * 0.3, 0.04); s.rotation.z = (Math.random() - 0.5) * 0.3; g.add(s); }
    place(g, x, y, z, nx, nz);
  }
  function desk(x, z, y, face = 1) {
    table(x, z, 1.6, 0.8, y, 0.75, WOOD);
    B(x - 0.35, y + 0.75, z - face * 0.25 - 0.03, x + 0.35, y + 1.2, z - face * 0.25 + 0.03, INK.BLACK, { tone: -0.25, collide: false });
    chair(x, z + face * 0.75, y, face > 0 ? Math.PI : 0);
  }
  function meetingRoom(x0, z0, x1, z1, name, accent, doorSide) {
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    table(cx, cz, Math.min(6, (x1 - x0) - 3), 1.8, 0, 0.76, { ink: INK.ORANGE, tone: 0.25 });
    for (let k = -2; k <= 2; k++) { chair(cx + k * 1.1, cz - 1.3, 0, 0); chair(cx + k * 1.1, cz + 1.3, 0, Math.PI); }
    // pared de acento (amarilla o turquesa, como en las fotos) y pizarra
    B(x0 + 0.2, 0, z0 + 0.16, x1 - 0.2, 3.9, z0 + 0.22, accent === "yellow" ? INK.ORANGE : INK.GREEN, { tone: 0.02, collide: false });
    whiteboard(cx, 1.8, z0 + 0.28, 0, 1, 3.2);
    B(x1 - 0.6, 0, z0 + 0.3, x1 - 0.2, 2.6, z0 + 0.7, OSB.ink, { tone: OSB.tone }); // pilar de OSB
    const sign = inkText(name, { size: 0.32, ink: INK.BLUE });
    if (doorSide === "north") place(sign, cx, 3.1, z1 + 0.2, 0, 1);
    else place(sign, x1 + 0.1, 3.1, cz, 1, 0);
  }

  // ════════════════ EXTERIOR ════════════════
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat(INK.BLACK, { tone: 0.4 }));
  ground.rotation.x = -Math.PI / 2;
  root.add(ground);
  // calles: Pedro Villar (norte) y Limonero (este), con pasos de cebra
  B(-60, 0, 10, 60, 0.012, 22, INK.BLACK, { tone: 0.02, collide: false });
  B(24, 0, -60, 34, 0.013, 10, INK.BLACK, { tone: 0.02, collide: false });
  for (let k = 0; k < 6; k++) B(22.2 + k * 0.1 + k * 1.2, 0.02, 10.6, 23.2 + k * 0.1 + k * 1.2, 0.03, 21.4, INK.BLACK, { tone: 0.55, collide: false });
  for (let k = 0; k < 5; k++) B(24.4, 0.02, 3 - k * 1.8, 33.6, 0.03, 3.9 - k * 1.8, INK.BLACK, { tone: 0.55, collide: false });
  // edificios vecinos (cierran la zona de juego)
  function neighbor(x0, z0, x1, z1, h, ink, faceN, faceX) {
    B(x0, 0, z0, x1, h, z1, ink, { tone: 0.05 });
    for (let y = 2.5; y < h - 1; y += 3) {
      const len = faceN !== undefined ? x1 - x0 : z1 - z0;
      for (let k = 1.5; k < len - 1; k += 3.4) {
        if (faceN !== undefined) B(x0 + k, y, faceN - 0.05, x0 + k + 1.6, y + 1.7, faceN + 0.05, INK.BLUE, { tone: 0.3, collide: false });
        else B(faceX - 0.05, y, z0 + k, faceX + 0.05, y + 1.7, z0 + k + 1.6, INK.BLUE, { tone: 0.3, collide: false });
      }
    }
  }
  neighbor(-60, 24, 60, 32, 17, INK.ORANGE, 24);
  neighbor(36, -60, 46, 10, 15, INK.ORANGE, undefined, 36);
  neighbor(-40, -28, -22.3, 8, 15, INK.RED, undefined, -22.3);
  neighbor(-40, -44, 22, -28.3, 14, INK.ORANGE, -28.3);
  B(20.3, 0, -44, 23.4, 15, -28.3, INK.RED, { tone: 0.05 });

  // ════════════════ EL EDIFICIO ════════════════
  // fachadas (granito) y bandas de forjado
  wallZ(-28, -22, 20, 0, ROOF, [], STONE.ink, { tone: STONE.tone }, 0.4);
  wallX(-22, -28, 6, 0, ROOF, [], STONE.ink, { tone: STONE.tone }, 0.4);
  wallX(20, -28, 0, 0, ROOF, [], STONE.ink, { tone: STONE.tone }, 0.4);
  wallZ(6, -22, 14, 0, ROOF, [], STONE.ink, { tone: STONE.tone }, 0.4);
  // ventanales: planta baja grandes, plantas altas en banda (como la foto)
  for (let x = -20; x < 12; x += 3.2) {
    B(x, 0.9, 6.21, x + 2.6, 3.4, 6.26, INK.BLUE, { tone: 0.32, collide: false });
    B(x, 5.1, 6.21, x + 2.6, 7.6, 6.26, INK.BLUE, { tone: 0.32, collide: false });
    B(x, 9.5, 6.21, x + 2.6, 12, 6.26, INK.BLUE, { tone: 0.32, collide: false });
  }
  for (let z = -26; z < -1; z += 3.2) {
    B(20.21, 0.9, z, 20.26, 3.4, z + 2.6, INK.BLUE, { tone: 0.32, collide: false });
    B(20.21, 5.1, z, 20.26, 7.6, z + 2.6, INK.BLUE, { tone: 0.32, collide: false });
    B(20.21, 9.5, z, 20.26, 12, z + 2.6, INK.BLUE, { tone: 0.32, collide: false });
  }
  for (const y of [F1, F2, ROOF]) {
    B(-22.3, y - 0.45, 6.2, 14, y - 0.1, 6.5, INK.BLACK, { tone: 0.1, collide: false });
    B(20.2, y - 0.45, -28, 20.5, y - 0.1, 0, INK.BLACK, { tone: 0.1, collide: false });
  }
  // esquina redonda: planta baja con la entrada, plantas altas acristaladas
  const ENTRY_GAP = [0.55, 1.02];
  arcWall(0, F1, STONE.ink, { tone: STONE.tone }, ENTRY_GAP, false);
  arcWall(F1 - 0.4, ROOF, INK.BLUE, { tone: 0.3 }, null, true);
  for (const y of [F1, F2]) { // barandilla curva del balcón de la esquina
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI / 2;
      const m = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      m.scale.set(0.05, 1, 0.05);
      m.position.set(ARC.cx + Math.cos(a) * (ARC.r + 0.5), y + 0.5, ARC.cz + Math.sin(a) * (ARC.r + 0.5));
      root.add(m);
    }
  }
  // marquesina curva sobre la entrada y el cartel de CINK
  for (let k = 0; k < 8; k++) {
    const a = 0.3 + (k / 8) * 1.0;
    const m = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.2 }));
    m.scale.set(2.2, 0.35, 1.2);
    m.position.set(ARC.cx + Math.cos(a) * (ARC.r + 0.9), 3.4, ARC.cz + Math.sin(a) * (ARC.r + 0.9));
    m.rotation.y = -a;
    root.add(m);
  }
  {
    const a = 0.785, nx = Math.cos(a), nz = Math.sin(a);
    const board = new THREE.Group();
    const panel = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.52 }));
    panel.scale.set(3.2, 1.3, 0.1);
    board.add(panel);
    const frame = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
    frame.scale.set(3.3, 1.4, 0.06); frame.position.z = -0.03; board.add(frame);
    const logo = cinkLogo({ size: 0.72 });
    logo.position.z = 0.07;
    board.add(logo);
    place(board, ARC.cx + nx * (ARC.r + 0.35), 4.2, ARC.cz + nz * (ARC.r + 0.35), nx, nz);
  }
  // puertas automáticas de cristal (se abren al acercarte)
  {
    const a0 = ENTRY_GAP[0], a1 = ENTRY_GAP[1];
    const e0 = [ARC.cx + Math.cos(a0) * ARC.r, ARC.cz + Math.sin(a0) * ARC.r], e1 = [ARC.cx + Math.cos(a1) * ARC.r, ARC.cz + Math.sin(a1) * ARC.r];
    const mid = [(e0[0] + e1[0]) / 2, (e0[1] + e1[1]) / 2];
    const tx = (e1[0] - e0[0]) / 2, tz = (e1[1] - e0[1]) / 2;
    const col = { x0: Math.min(e0[0], e1[0]), x1: Math.max(e0[0], e1[0]), z0: Math.min(e0[1], e1[1]), z1: Math.max(e0[1], e1[1]), y0: 0, y1: 2.8, open: false };
    colliders.push(col);
    const panels = [-1, 1].map((s) => {
      const p = new THREE.Mesh(GEO.box, mat(INK.BLUE, { tone: 0.36 }));
      p.scale.set(0.08, 2.7, Math.hypot(tx, tz) * 1.02);
      p.rotation.y = -Math.atan2(tz, tx) + Math.PI / 2;
      root.add(p);
      const frame = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      frame.scale.set(0.1, 0.08, Math.hypot(tx, tz));
      frame.position.y = 1.3;
      p.add(frame);
      return { p, s };
    });
    B(e1[0] - 0.2, 2.8, e1[1] - 0.2, e0[0] + 0.2, 3.1, e0[1] + 0.2, INK.BLACK, { tone: 0.1, collide: false });
    doors.push({ x: mid[0], z: mid[1], y: 0, col, t: 0, set(t) { panels.forEach(({ p, s }) => p.position.set(mid[0] + (tx * s) * (0.5 + t * 0.95), 1.35, mid[1] + (tz * s) * (0.5 + t * 0.95))); } });
  }
  // valla negra alrededor de la entrada (con hueco)
  {
    const r = ARC.r + 2.4;
    for (let k = 0; k <= 60; k++) {
      const a = 0.12 + (k / 60) * 1.35;
      if (a > 0.62 && a < 0.98) continue; // hueco de la puerta de la valla
      const x = ARC.cx + Math.cos(a) * r, z = ARC.cz + Math.sin(a) * r;
      B(x - 0.03, 0, z - 0.03, x + 0.03, 1.15, z + 0.03, INK.BLACK, { fill: true, collide: false });
      if (k % 3 === 0) colliders.push({ x0: x - 0.28, x1: x + 0.28, z0: z - 0.28, z1: z + 0.28, y0: 0, y1: 1.15 });
    }
    for (let k = 0; k < 12; k++) { // pasamanos curvo
      const a0 = 0.12 + (k / 12) * 1.35, a1 = 0.12 + ((k + 1) / 12) * 1.35, am = (a0 + a1) / 2;
      if (am > 0.62 && am < 0.98) continue;
      const m = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      m.scale.set(0.07, 0.07, 2 * r * Math.sin((a1 - a0) / 2) + 0.05);
      m.position.set(ARC.cx + Math.cos(am) * r, 1.15, ARC.cz + Math.sin(am) * r);
      m.rotation.y = -am;
      root.add(m);
    }
  }
  // farola, señal de parking, motos y coches
  C(22.5, 0, 8.8, 0.12, 7.5, INK.BLACK, { tone: 0.1, collide: true });
  B(20.8, 7.3, 8.6, 22.6, 7.5, 9, INK.BLACK, { tone: 0.1, collide: false });
  B(20.5, 7.0, 8.4, 21.3, 7.35, 9.2, INK.BLACK, { tone: 0.4, collide: false });
  C(21, 0, 7.2, 0.06, 2.6, INK.BLACK, { fill: true, collide: true });
  B(20.6, 2.2, 7.15, 21.4, 2.9, 7.25, INK.BLUE, { tone: 0.1, collide: false });
  place(inkText("P", { size: 0.5, ink: INK.BLACK }), 21, 2.55, 7.3, 0, 1);
  function moto(x, z, ink) {
    B(x - 0.25, 0.3, z - 0.9, x + 0.25, 0.85, z + 0.9, ink, { tone: 0.02 });
    B(x - 0.2, 0.85, z - 0.5, x + 0.2, 1.0, z + 0.3, INK.BLACK, { tone: -0.2, collide: false });
    for (const s of [-1, 1]) { const w = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { fill: true })); w.scale.setScalar(0.62); w.rotation.y = Math.PI / 2; w.position.set(x, 0.32, z + s * 0.75); root.add(w); }
  }
  [INK.BLUE, INK.BLACK, INK.BLACK, INK.GREEN, INK.BLACK, INK.RED].forEach((ink, k) => moto(21.4, -3 - k * 1.4, ink));
  function car(x, z, alongX, ink) {
    const w = alongX ? 4.2 : 1.8, d = alongX ? 1.8 : 4.2;
    B(x - w / 2, 0.3, z - d / 2, x + w / 2, 1.1, z + d / 2, ink, { tone: 0.05 });
    B(x - (alongX ? 1.1 : 0.85), 1.1, z - (alongX ? 0.85 : 1.1), x + (alongX ? 1.1 : 0.85), 1.7, z + (alongX ? 0.85 : 1.1), INK.BLUE, { tone: 0.3 });
  }
  car(-16, 11.2, true, INK.BLACK); car(-10, 11.2, true, INK.RED); car(-4, 11.2, true, INK.BLUE); car(4, 11.2, true, INK.BLACK);
  car(24.8, -14, false, INK.GREEN); car(24.8, -20, false, INK.BLACK); car(24.8, -26, false, INK.ORANGE);

  // ════════════════ PLANTA BAJA ════════════════
  // suelos: madera en recepción/pasillo, baldosa hidráulica en el comedor, césped en la terraza
  B(2, 0, -12, 20, 0.025, 6, INK.ORANGE, { tone: 0.32, collide: false });
  B(-22, 0, -12, 2, 0.025, -2, INK.ORANGE, { tone: 0.32, collide: false });
  B(-22, 0, -2, 2, 0.03, 6, INK.BLUE, { tone: 0.24, collide: false });
  B(-6, 0, -28, 8, 0.04, -12, INK.GREEN, { tone: -0.18, collide: false });
  // comedor (a la izquierda al entrar): paredes con puerta a recepción y al pasillo
  wallZ(-2, -22, 2, 0, F1 - 0.4, [[-4.5, -2]]);
  wallX(2, -2, 6, 0, F1 - 0.4, [[1, 3.6]]);
  place(inkText("COMEDOR", { size: 0.3, ink: INK.BLUE }), 2.2, 3.2, 2.3, 1, 0);
  for (const x of [-15, -9, -3]) {
    table(x, 1.6, 3.6, 0.9, 0, 0.76, WOOD);
    B(x - 1.8, 0, 0.55, x + 1.8, 0.45, 0.85, INK.ORANGE, { tone: 0.2 }); // bancos
    B(x - 1.8, 0, 2.35, x + 1.8, 0.45, 2.65, INK.ORANGE, { tone: 0.2 });
  }
  B(-20.5, 0, 4.9, -6, 0.95, 5.9, INK.BLACK, { tone: 0.42 }); // encimera
  B(-20.5, 0.95, 4.9, -6, 1.0, 5.9, WOOD.ink, { tone: 0.1, collide: false });
  B(-20.5, 2.2, 5.3, -6, 2.28, 5.9, WOOD.ink, { tone: 0.1, collide: false }); // balda
  for (let k = 0; k < 4; k++) { // los 4 microondas
    B(-18 + k * 1.6, 2.28, 5.3, -17 + k * 1.6, 2.85, 5.9, INK.BLACK, { tone: -0.05, collide: false });
    B(-17.9 + k * 1.6, 2.35, 5.27, -17.3 + k * 1.6, 2.78, 5.3, INK.BLACK, { fill: true, collide: false });
  }
  B(-11, 1.0, 5.2, -10.4, 1.5, 5.8, INK.BLACK, { tone: -0.2, collide: false }); // cafetera
  B(-21.7, 0, -1.6, -20.6, 2.1, 0.2, INK.BLACK, { tone: -0.2 }); // vending
  B(-20.62, 0.5, -1.4, -20.58, 1.9, 0, INK.BLUE, { tone: 0.2, collide: false });
  B(-21.7, 0, 0.5, -20.6, 2.1, 2.3, INK.BLACK, { tone: -0.2 });
  B(-20.62, 0.4, 0.7, -20.58, 1.9, 2.1, INK.RED, { tone: 0.15, collide: false });
  for (let k = 0; k < 4; k++) B(-20.6, 0.6 + k * 0.35, 0.8, -20.56, 0.66 + k * 0.35, 2.0, INK.ORANGE, { fill: true, collide: false });
  plant(-6.8, 4.9);
  // recepción: mostrador de OSB, Victoria y el logo iluminado detrás
  B(8, 0, -2.6, 12.6, 1.1, -1.4, OSB.ink, { tone: OSB.tone });
  B(7.9, 1.1, -2.7, 12.7, 1.18, -1.3, WOOD.ink, { tone: 0.2, collide: false });
  B(9, 0.2, -1.38, 12.2, 1.0, -1.34, INK.BLACK, { fill: true, collide: false });
  const welcome = inkText("BIENVENIDO", { size: 0.2, ink: INK.BLACK });
  place(welcome, 10.6, 0.75, -1.32, 0, 1);
  // el panel negro no deja ver la tinta negra: el texto va sobre una franja clara
  B(9.2, 0.62, -1.335, 12, 0.9, -1.33, INK.BLACK, { tone: 0.55, collide: false });
  place(inkText("#PEOPLEMAKECINK", { size: 0.1, ink: INK.RED }), 10.6, 0.45, -1.32, 0, 1);
  B(10.6, 1.18, -2.4, 11.4, 1.6, -2.3, INK.BLACK, { tone: -0.25, collide: false }); // monitor
  B(6.8, 0, -5.4, 13.8, 3.6, -5.0, INK.BLACK, { tone: 0.4 }); // pared del logo
  place(cinkLogo({ size: 1.1, ink: INK.BLACK }), 10.3, 2.5, -4.95, 0, 1);
  for (const x of [13.2, 14.2, 15.2]) { // lámparas colgantes de cobre
    B(x - 0.01, 2.6, -1.9, x + 0.01, 3.99, -1.88, INK.BLACK, { fill: true, collide: false });
    const lamp = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { tone: -0.1 }));
    lamp.scale.set(0.35, 0.55, 0.35); lamp.position.set(x, 2.35, -1.9); lamp.rotation.x = Math.PI; root.add(lamp);
  }
  plant(8.3, -1.9, 1.18, 0.55);
  plant(19, 1.6);
  // la mesa alta con taburetes (más adelante) y la pared de OSB con ventana de espejo
  table(13, -8.6, 2.6, 0.9, 0, 1.05, WOOD);
  [12, 13, 14].forEach((x) => { stool(x, -7.8); stool(x, -9.4); });
  B(19.6, 0, -11.5, 19.9, 3.2, -4.5, OSB.ink, { tone: OSB.tone });
  place(inkText("PEOPLE MAKE CINK", { size: 0.28, ink: INK.BLACK }), 19.55, 2.4, -8, -1, 0);
  // terraza abierta con césped, mesas y sillas de mimbre
  glassZ(-12, -6, 8, 0, F1 - 0.4, [[-1.5, 3]]);
  [[-3, -16], [2, -16], [-3, -22], [2, -22], [5.5, -25.5], [-4, -26]].forEach(([x, z]) => {
    table(x, z, 1.2, 1.2, 0, 0.75, WOOD);
    chair(x - 0.95, z, 0, Math.PI / 2, INK.ORANGE); chair(x + 0.95, z, 0, -Math.PI / 2, INK.ORANGE);
  });
  plant(-5.3, -13, 0, 1.2); plant(7.3, -13, 0, 1.2); plant(7.2, -27.2, 0, 1.3); plant(-5.2, -27.2, 0, 1.3);
  // salas de reuniones 1–4 alrededor de la terraza
  wallZ(-12, -22, -6, 0, F1 - 0.4, [[-17, -15]]);
  wallZ(-20, -22, -6, 0, F1 - 0.4, []);
  glassX(-6, -28, -12, 0, F1 - 0.4, [[-25, -23]]);
  wallZ(-12, 8, 20, 0, F1 - 0.4, [[12, 14]]);
  wallZ(-20, 8, 20, 0, F1 - 0.4, []);
  glassX(8, -28, -12, 0, F1 - 0.4, [[-25, -23]]);
  meetingRoom(-22, -28, -6, -20, "SALA 1", "yellow", "east");
  meetingRoom(-22, -20, -6, -12, "SALA 2", "teal", "north");
  meetingRoom(8, -28, 20, -20, "SALA 3", "teal", "east");
  meetingRoom(8, -20, 20, -12, "SALA 4", "yellow", "north");
  // escalera a la primera planta
  stairs(-4, 6, -5.5, -3, 0, F1);

  // ════════════════ PRIMERA PLANTA ════════════════
  const PATIO = [-6, -28, 8, -12];
  const CORNER = [ARC.cx, ARC.cz, 20, 6];
  slab(F1, [-22, -28, 20, 6], [PATIO, [-4.5, -5.6, 6.2, -2.9], CORNER]);
  arcSlab(F1);
  B(-22, F1, -12, 20, F1 + 0.02, 6, INK.ORANGE, { tone: 0.3, collide: false });
  railing(-4.5, -2.9, 6.2, -2.9, F1);
  railing(-4.5, -5.7, 6.2, -5.7, F1);
  railing(-4.5, -5.7, -4.5, -2.9, F1);
  // hot desk
  place(inkText("HOT DESK", { size: 0.4, ink: INK.RED }), -12, F1 + 3.2, 5.8, 0, -1);
  for (const x of [-19, -16, -13, -10]) { desk(x, 3.6, F1, -1); desk(x, 1.2, F1, 1); }
  for (const x of [-19, -16, -13]) desk(x, -9.5, F1, 1);
  plant(-7.2, 5.2, F1); plant(-21, -1, F1);
  // oficina de Clevergy: esquina redonda, 3 mesas, estantería con café y pizarra
  wallX(8, -12, 6, F1, F2 - 0.4, [[-6.4, -4.2]], INK.BLACK, { tone: 0.32 });
  const officeDoor = { x0: 7.85, x1: 8.15, z0: -6.4, z1: -4.2, y0: F1, y1: F1 + 2.7, open: false };
  colliders.push(officeDoor);
  const doorPanel = B(7.9, F1, -6.4, 8.1, F1 + 2.7, -4.2, INK.BLUE, { tone: 0.2, collide: false });
  doors.push({ x: 8, z: -5.3, y: F1, col: officeDoor, t: 0, set(t) { doorPanel.position.z = -5.3 + t * 2.1; } });
  place(inkText("CLEVERGY", { size: 0.34, ink: INK.GREEN }), 7.8, F1 + 3.2, -5.3, -1, 0);
  place(inkText("CLEVERGY", { size: 0.5, ink: INK.GREEN }), 14, F1 + 2.9, -11.8, 0, 1);
  [[14, 2.6], [16.8, 0.6], [11.2, 0.6]].forEach(([x, z]) => desk(x, z, F1, -1));
  B(19.2, F1, -9.5, 19.8, F1 + 2.2, -3.5, WOOD.ink, { tone: 0.05 }); // estantería
  for (const y of [0.8, 1.5]) B(19.0, F1 + y, -9.4, 19.8, F1 + y + 0.05, -3.6, WOOD.ink, { tone: 0.2, collide: false });
  B(19.05, F1 + 0.85, -8.8, 19.6, F1 + 1.35, -8.2, INK.BLACK, { tone: -0.2, collide: false }); // cafetera
  for (let k = 0; k < 5; k++) C(19.35, F1 + 1.55, -7.6 + k * 0.6, 0.1, 0.18, k % 2 ? INK.RED : INK.BLUE, { tone: 0.1 });
  for (let k = 0; k < 4; k++) B(19.2, F1 + 0.85, -6.8 + k * 0.7, 19.6, F1 + 1.3, -6.3 + k * 0.7, INK.ORANGE, { tone: 0.1, collide: false }); // cajas de café
  whiteboard(14, F1 + 1.8, -11.8, 0, 1, 3.4);
  plant(18.6, -11, F1, 0.9);
  // oficinas junto a la terraza
  glassX(-6, -28, -12, F1, F2 - 0.4, []);
  wallZ(-12, -22, -6, F1, F2 - 0.4, [[-15, -13]]);
  glassX(8, -28, -12, F1, F2 - 0.4, []);
  wallZ(-12, 8, 20, F1, F2 - 0.4, [[15.5, 17.5]]);
  table(-14, -20, 5, 1.6, F1); table(14, -20, 4, 1.6, F1);
  place(inkText("OFICINA 101", { size: 0.26, ink: INK.BLUE }), -14, F1 + 3.1, -11.8, 0, 1);
  railing(-6, -12, 8, -12, F1);
  // segundo tramo de escalera
  stairs(6, -4, -8.3, -5.8, F1, F2 - F1);

  // ════════════════ SEGUNDA PLANTA ════════════════
  slab(F2, [-22, -28, 20, 6], [PATIO, [-4.5, -8.4, 6.5, -5.7], CORNER]);
  arcSlab(F2);
  B(-22, F2, -12, 20, F2 + 0.02, 6, INK.ORANGE, { tone: 0.3, collide: false });
  railing(-4.5, -5.7, 6.5, -5.7, F2); railing(-4.5, -8.4, -4.5, -5.7, F2);
  railing(-6, -12, 8, -12, F2);
  wallZ(-2, -22, 20, F2, ROOF - 0.4, [[-16, -14], [-2, 0], [10, 12]]);
  wallX(-8, -2, 6, F2, ROOF - 0.4, []);
  wallX(6, -2, 6, F2, ROOF - 0.4, []);
  [["OFICINA 201", -15], ["OFICINA 202", -1], ["OFICINA 203", 11]].forEach(([n, x]) => place(inkText(n, { size: 0.26, ink: INK.BLUE }), x, F2 + 3.1, -2.2, 0, -1));
  [[-15, 2.5], [-1, 2.5], [11, 2.5]].forEach(([x, z]) => { desk(x - 1, z, F2, -1); desk(x + 1.2, z, F2, -1); });
  glassX(-6, -28, -12, F2, ROOF - 0.4, []);
  wallZ(-12, -22, -6, F2, ROOF - 0.4, [[-15, -13]]);
  glassX(8, -28, -12, F2, ROOF - 0.4, []);
  wallZ(-12, 8, 20, F2, ROOF - 0.4, [[12, 14]]);
  plant(-20, -4, F2); plant(18, -4, F2);

  // ════════════════ AZOTEA: torre cilíndrica de pavés y chimeneas ════════════════
  slab(ROOF, [-22, -28, 20, 6], [PATIO, CORNER]);
  arcSlab(ROOF);
  C(11, ROOF, -3, 3.2, 8.5, INK.BLACK, { tone: 0.35, collide: false });
  for (let y = 1; y < 8; y += 1.1) { const r = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { fill: true })); r.scale.set(6.4, 6.4, 0.4); r.rotation.x = Math.PI / 2; r.position.set(11, ROOF + y, -3); root.add(r); }
  C(7.4, ROOF, -3, 0.35, 13, INK.BLACK, { tone: 0.2, collide: false });
  C(14.6, ROOF, -3, 0.35, 12, INK.BLACK, { tone: 0.2, collide: false });
  railing(-22, 6, 14, 6, ROOF); railing(20, -28, 20, 0, ROOF);

  // ════════════════ VICTORIA (recepción) ════════════════
  const victoria = makeVictoria();
  victoria.group.position.set(10.3, 0, -3.5);
  root.add(victoria.group);

  // puertas: se abren si hay alguien cerca
  function updateDoors(dt, points) {
    for (const d of doors) {
      const near = points.some((p) => Math.hypot(p.x - d.x, p.z - d.z) < 3.4 && Math.abs(p.y - d.y) < 2.5);
      d.t += ((near ? 1 : 0) - d.t) * Math.min(1, dt * 6);
      d.col.open = d.t > 0.55;
      d.set(d.t);
    }
  }
  updateDoors(1, []);

  return { root, colliders, updateDoors, victoria };
}

// Victoria: morena, delgada, con camisa clara; saluda al verte llegar
function makeVictoria() {
  const g = new THREE.Group();
  const part = (geo, ink, o, s, p) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...s); m.position.set(...p); g.add(m); return m; };
  part(GEO.cyl, INK.BLACK, { tone: -0.1 }, [0.34, 0.9, 0.3], [0, 0.45, 0]);
  part(GEO.cyl, INK.RED, { tone: 0.42 }, [0.44, 0.75, 0.34], [0, 1.25, 0]);
  part(GEO.cyl, INK.BLACK, { tone: 0.5 }, [0.12, 0.16, 0.12], [0, 1.68, 0]);
  const head = part(GEO.sph, INK.ORANGE, { tone: 0.48 }, [0.36, 0.42, 0.36], [0, 1.92, 0]);
  part(GEO.sph, INK.BLACK, { tone: -0.3 }, [0.42, 0.42, 0.34], [0, 2.0, -0.07]); // pelo
  part(GEO.box, INK.BLACK, { tone: -0.3 }, [0.4, 0.55, 0.12], [0, 1.72, -0.16]); // melena
  part(GEO.sph, INK.BLACK, { fill: true }, [0.05, 0.05, 0.03], [-0.07, 1.95, 0.17]);
  part(GEO.sph, INK.BLACK, { fill: true }, [0.05, 0.05, 0.03], [0.07, 1.95, 0.17]);
  part(GEO.box, INK.RED, { fill: true }, [0.1, 0.025, 0.02], [0, 1.84, 0.18]); // sonrisa
  const arm = new THREE.Group();
  arm.position.set(0.25, 1.55, 0);
  const a = new THREE.Mesh(GEO.box, mat(INK.RED, { tone: 0.42 }));
  a.scale.set(0.1, 0.55, 0.1);
  a.position.y = 0.25;
  arm.add(a);
  g.add(arm);
  part(GEO.box, INK.RED, { tone: 0.42 }, [0.1, 0.5, 0.1], [-0.25, 1.3, 0]);
  let t = 0;
  function update(dt, target, waving) {
    t += dt;
    if (target) g.rotation.y += (Math.atan2(target.x - g.position.x, target.z - g.position.z) - g.rotation.y) * Math.min(1, dt * 3);
    arm.rotation.z = waving ? 2.6 + Math.sin(t * 9) * 0.35 : 0.2;
    head.rotation.z = Math.sin(t * 1.5) * 0.08;
  }
  return { group: g, update, name: "Victoria" };
}
