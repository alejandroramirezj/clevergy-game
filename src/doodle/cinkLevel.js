// =============================================================================
// cinkLevel.js — CINK Coworking (Infanta Mercedes, Madrid) dibujado a boli
// Escenario del shooter: el edificio de esquina redonda entre la calle de Pedro
// Villar y la del Limonero, con tres plantas visitables:
//   · Planta baja (según el plano real): circulación central abierta, recepción curva
//     (Victoria), comedor, cocina, patio exterior, Salas 1–7 y 9, Despachos 1 y 2 y aseos.
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
export const START = { x: 25, y: 0, z: 13, yaw: Math.PI / 4 };
export const BOSS_AREA = { x0: -7.5, x1: 3, z0: -27.5, z1: -14.5 }; // el patio
export const COFFEE_SPOTS = [[13, 0, -8], [18.2, F1, -6], [0, F2, 2], [-12, 0, -19]];
// puntos de aparición de enemigos: [x, z, suelo]
export const SPAWNS = [
  [0, 16, 0], [-14, 15, 0], [28, -6, 0], [29, -22, 0], [-6, -6, 0], [-12, -24, 0], [8, -19.5, 0], [-19, -1, 0], [14, -12, 0], [-12, -16, 0], [4, -2, 0],
  [-18, 2, F1], [-10, -10, F1], [14, 2, F1], [-14, -22, F1], [13.5, -20, F1], [-4, 3, F1],
  [-16, 2, F2], [12, -1, F2], [-14, -22, F2], [13, -24, F2], [0, -10, F2]
];
// salidas de jugadores en sala (repartidas por el edificio)
export const PLAYER_SPAWNS = [[25, 13, 0], [0, 16, 0], [14, -12, 0], [-6, -6, 0], [-12, -20, 0], [-19, -1, 0], [-14, 2, F1], [14, -4, F1], [-14, -20, F1], [0, 2, F2]];

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
  // Cristal transparente como la oficina de Clevergy: apertura visual, collider y montantes negros
  const glassX = (x, z0, z1, y0, y1, gaps = [], step = 2) => {
    let cur = z0;
    for (const [a, b, top = 2.7] of gaps.slice().sort((p, q) => p[0] - q[0])) {
      if (a > cur) {
        colliders.push({ x0: x - 0.1, x1: x + 0.1, y0, y1, z0: cur, z1: a });
        B(x - 0.08, y0 + 0.02, cur, x + 0.08, y0 + 0.12, a, INK.BLACK, { fill: true, collide: false });
        B(x - 0.08, y1 - 0.1, cur, x + 0.08, y1, a, INK.BLACK, { fill: true, collide: false });
        for (let z = cur; z <= a + 0.01; z += step) B(x - 0.07, y0, z - 0.04, x + 0.07, y1, z + 0.04, INK.BLACK, { fill: true, collide: false });
      }
      if (y0 + top < y1) {
        B(x - 0.15, y0 + top, a, x + 0.15, y1, b, STONE.ink, { tone: STONE.tone });
      }
      cur = b;
    }
    if (cur < z1) {
      colliders.push({ x0: x - 0.1, x1: x + 0.1, y0, y1, z0: cur, z1 });
      B(x - 0.08, y0 + 0.02, cur, x + 0.08, y0 + 0.12, z1, INK.BLACK, { fill: true, collide: false });
      B(x - 0.08, y1 - 0.1, cur, x + 0.08, y1, z1, INK.BLACK, { fill: true, collide: false });
      for (let z = cur; z <= z1 + 0.01; z += step) B(x - 0.07, y0, z - 0.04, x + 0.07, y1, z + 0.04, INK.BLACK, { fill: true, collide: false });
    }
  };
  const glassZ = (z, x0, x1, y0, y1, gaps = [], step = 2) => {
    let cur = x0;
    for (const [a, b, top = 2.7] of gaps.slice().sort((p, q) => p[0] - q[0])) {
      if (a > cur) {
        colliders.push({ x0: cur, x1: a, y0, y1, z0: z - 0.1, z1: z + 0.1 });
        B(cur, y0 + 0.02, z - 0.08, a, y0 + 0.12, z + 0.08, INK.BLACK, { fill: true, collide: false });
        B(cur, y1 - 0.1, z - 0.08, a, y1, z + 0.08, INK.BLACK, { fill: true, collide: false });
        for (let x = cur; x <= a + 0.01; x += step) B(x - 0.04, y0, z - 0.07, x + 0.04, y1, z + 0.07, INK.BLACK, { fill: true, collide: false });
      }
      if (y0 + top < y1) {
        B(a, y0 + top, z - 0.15, b, y1, z + 0.15, STONE.ink, { tone: STONE.tone });
      }
      cur = b;
    }
    if (cur < x1) {
      colliders.push({ x0: cur, x1, y0, y1, z0: z - 0.1, z1: z + 0.1 });
      B(cur, y0 + 0.02, z - 0.08, x1, y0 + 0.12, z + 0.08, INK.BLACK, { fill: true, collide: false });
      B(cur, y1 - 0.1, z - 0.08, x1, y1, z + 0.08, INK.BLACK, { fill: true, collide: false });
      for (let x = cur; x <= x1 + 0.01; x += step) B(x - 0.04, y0, z - 0.07, x + 0.04, y1, z + 0.07, INK.BLACK, { fill: true, collide: false });
    }
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
  function arcWall(y0, y1, ink, o, gap, glass, clear) {
    const N = 9;
    for (let k = 0; k < N; k++) {
      const a0 = (k / N) * Math.PI / 2, a1 = ((k + 1) / N) * Math.PI / 2, am = (a0 + a1) / 2;
      if (gap && am > gap[0] && am < gap[1]) continue;
      const px = ARC.cx + Math.cos(am) * ARC.r, pz = ARC.cz + Math.sin(am) * ARC.r;
      const chord = 2 * ARC.r * Math.sin((a1 - a0) / 2) + 0.05;
      if (!clear) {
        const m = new THREE.Mesh(GEO.box, mat(ink, o));
        m.scale.set(0.3, y1 - y0, chord);
        m.position.set(px, (y0 + y1) / 2, pz);
        m.rotation.y = -am;
        root.add(m);
      }
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
    else if (doorSide === "west") place(sign, x0 - 0.2, 3.1, cz, -1, 0);
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
  neighbor(-60, 24, 23.5, 32, 17, INK.ORANGE, 24);
  B(24, 0, 10, 34, 0.013, 60, INK.BLACK, { tone: 0.02, collide: false }); // Limonero sigue al norte
  // enfrente de la esquina de Clevergy: edificio con una terraza llena de ropa tendida, y una
  // señora que no para de tender y recoger
  let tendedora;
  {
    const TY = F1 - 0.6, X0 = 27, Z0 = 17, LH = TY + 3.3, SC = 1.6;
    B(X0, 0, Z0, 52, TY, 40, INK.RED, { tone: 0.12 });
    B(X0 + 11, TY, Z0 + 8, 52, 15, 40, INK.RED, { tone: 0.05 });
    for (let k = 0; k < 5; k++) {
      B(X0 + 1.5 + k * 3.4, 1, Z0 - 0.05, X0 + 3.1 + k * 3.4, 2.8, Z0 + 0.05, INK.BLUE, { tone: 0.3, collide: false });
      B(X0 - 0.05, 1, Z0 + 1.5 + k * 3.4, X0 + 0.05, 2.8, Z0 + 3.1 + k * 3.4, INK.BLUE, { tone: 0.3, collide: false });
    }
    for (let y = TY + 1.6; y < 14; y += 2.8) for (let k = 0; k < 3; k++) {
      B(X0 + 12.5 + k * 3.4, y, Z0 + 7.95, X0 + 14.1 + k * 3.4, y + 1.7, Z0 + 8.05, INK.BLUE, { tone: 0.3, collide: false });
      B(X0 + 10.95, y, Z0 + 9.5 + k * 3.4, X0 + 11.05, y + 1.7, Z0 + 11.1 + k * 3.4, INK.BLUE, { tone: 0.3, collide: false });
    }
    B(X0 + 10.96, TY, Z0 + 9, X0 + 11.04, TY + 2.2, Z0 + 10.2, INK.ORANGE, { tone: 0.1, collide: false }); // puerta de la terraza
    railing(X0 + 0.1, Z0 + 0.1, 52, Z0 + 0.1, TY); railing(X0 + 0.1, Z0 + 0.1, X0 + 0.1, 40, TY);
    const CLOTHES = [INK.RED, INK.BLUE, INK.GREEN, INK.ORANGE];
    let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    // prendas: camisetas, pantalones, sábanas y calcetines, con sus pinzas
    const garments = [];
    function garment(x, z, kind) {
      const g = new THREE.Group();
      const ink = CLOTHES[(rnd() * 4) | 0], tone = 0.05 + rnd() * 0.25;
      const pc = (w, h, px, py, i = ink, t = tone) => { const m = new THREE.Mesh(GEO.box, mat(i, { tone: t })); m.scale.set(w, h, 0.05); m.position.set(px, py, 0); g.add(m); };
      let w;
      if (kind === 0) { w = 0.8; pc(0.62, 0.75, 0, -0.42); pc(0.25, 0.28, -0.4, -0.18); pc(0.25, 0.28, 0.4, -0.18); }
      else if (kind === 1) { w = 0.6; pc(0.56, 0.16, 0, -0.1); pc(0.24, 1.0, -0.15, -0.65); pc(0.24, 1.0, 0.15, -0.65); }
      else if (kind === 2) { w = 1.5; pc(1.45, 1.6, 0, -0.8, INK.BLACK, 0.55); for (let k = 0; k < 3; k++) pc(1.45, 0.06, 0, -0.3 - k * 0.5, ink, 0.1); }
      else { w = 0.25; pc(0.14, 0.4, 0, -0.22); pc(0.22, 0.12, 0.04, -0.42); }
      for (const sx of kind === 3 ? [0] : [-w * 0.35, w * 0.35]) { const p = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true })); p.scale.set(0.04, 0.12, 0.08); p.position.set(sx, -0.02, 0); g.add(p); }
      w *= SC; g.scale.setScalar(SC);
      g.position.set(x + w / 2, LH, z);
      root.add(g);
      garments.push({ g, ph: rnd() * 6, x: x + w / 2, z });
      return w;
    }
    const LINES = [Z0 + 1.8, Z0 + 3.3, Z0 + 4.8, Z0 + 6.3];
    for (const z of LINES) {
      for (const x of [X0 + 0.6, X0 + 10.4]) C(x, TY, z, 0.06, 3.4, INK.BLACK, { fill: true, collide: false });
      B(X0 + 0.6, LH - 0.03, z - 0.02, X0 + 10.4, LH + 0.03, z + 0.02, INK.BLACK, { fill: true, collide: false });
      for (let x = X0 + 0.8; x < X0 + 9.4;) { const k = rnd(); const w = garment(x, z, k < 0.35 ? 0 : k < 0.6 ? 1 : k < 0.8 ? 2 : 3); x += w + 0.15; if (x > X0 + 9.6) break; }
    }
    // la cesta de la ropa
    C(X0 + 0.9, TY, Z0 + 0.9, 0.35, 0.35, INK.ORANGE, { tone: 0.0 });
    for (let k = 0; k < 3; k++) S(X0 + 0.8 + k * 0.1, TY + 0.38, Z0 + 0.9, 0.17, CLOTHES[k], { tone: 0.2 });
    plant(X0 + 10.6, Z0 + 0.6, TY, 0.8);
    const front = garments.filter((q) => q.z === LINES[0]);
    tendedora = makeTendedora();
    tendedora.group.position.set(X0 + 1.5, TY, Z0 + 1.0);
    tendedora.group.scale.setScalar(1.35);
    root.add(tendedora.group);
    let target = front[0], phase = "walk", tt = 0, wind = 0;
    tendedora.update = (dt) => {
      wind += dt;
      for (const q of garments) q.g.rotation.x = Math.sin(wind * 1.7 + q.ph) * 0.12;
      const gp = tendedora.group.position;
      tt += dt;
      if (phase === "walk") {
        const dx = target.x - gp.x;
        gp.x += Math.sign(dx) * Math.min(Math.abs(dx), dt * 1.1);
        tendedora.pose(0, wind, true);
        tendedora.group.rotation.y = dx > 0 ? Math.PI / 2 : -Math.PI / 2;
        if (Math.abs(dx) < 0.02) { phase = "reach"; tt = 0; }
      } else {
        tendedora.group.rotation.y = 0; // de cara a la cuerda
        tendedora.pose(Math.min(1, tt * 2.5), wind, false);
        if (tt > 1.4) { target.g.visible = !target.g.visible; phase = "walk"; target = front[(rnd() * front.length) | 0]; }
      }
    };
  }
  neighbor(36, -60, 46, 10, 15, INK.ORANGE, undefined, 36);
  neighbor(-40, -28, -22.3, 8, 15, INK.RED, undefined, -22.3);
  neighbor(-40, -44, 22, -28.3, 14, INK.ORANGE, -28.3);
  B(20.3, 0, -44, 23.4, 15, -28.3, INK.RED, { tone: 0.05 });

  // ════════════════ EL EDIFICIO ════════════════
  // fachadas (granito) y bandas de forjado
  wallZ(-28, -22, 20, 0, ROOF, [], STONE.ink, { tone: STONE.tone }, 0.4);
  wallX(-22, -28, 6, 0, ROOF, [], STONE.ink, { tone: STONE.tone }, 0.4);

  // Bandas de forjado horizontales y pilares de fachada (dejan los huecos de cristal transparente)
  for (const y of [F1 - 0.4, F2 - 0.4, ROOF - 0.4]) {
    B(-22.3, y, 5.8, 14.3, y + 0.5, 6.2, STONE.ink, { tone: STONE.tone }); // banda forjado z=6
    B(19.8, y, -28.3, 20.2, y + 0.5, 0.3, STONE.ink, { tone: STONE.tone }); // banda forjado x=20
    B(-22.3, y + 0.05, 6.21, 14, y + 0.4, 6.35, INK.BLACK, { tone: 0.1, collide: false });
    B(20.21, y + 0.05, -28, 20.35, y + 0.4, 0, INK.BLACK, { tone: 0.1, collide: false });
  }
  // Antepechos bajos a nivel de suelo
  B(-22.3, 0, 5.8, 14.3, 0.4, 6.2, STONE.ink, { tone: STONE.tone });
  B(19.8, 0, -28.3, 20.2, 0.4, 0.3, STONE.ink, { tone: STONE.tone });

  // Pilares verticales en las fachadas
  for (const x of [-22, -10, 3.2, 9.8, 14]) {
    B(x - 0.25, 0, 5.75, x + 0.25, ROOF, 6.25, STONE.ink, { tone: STONE.tone });
  }
  for (const z of [-28, -20, -12, 0]) {
    B(19.75, 0, z - 0.25, 20.25, ROOF, z + 0.25, STONE.ink, { tone: STONE.tone });
  }

  // ── FACHADA Z=6 (Pedro Villar / Limonero): CRISTALERAS TRANSPARENTES ──
  // Planta Baja: ventanales transparentes (a la derecha nada más empezar en la calle se ve el comedor con las vending!)
  glassZ(6, -21.75, -10.25, 0.4, F1 - 0.4, [], 1.8);
  glassZ(6, -9.75, 2.95, 0.4, F1 - 0.4, [], 1.8); // ¡Ventanales de la sala de comer!
  glassZ(6, 10.05, 13.75, 0.4, F1 - 0.4, [], 1.8);
  // Escalera central acristalada
  const CORE_GLASS = [3.6, 9.6];
  colliders.push({ x0: CORE_GLASS[0], x1: CORE_GLASS[1], y0: 0.4, y1: ROOF - 0.4, z0: 5.9, z1: 6.1 });
  for (let x = CORE_GLASS[0]; x <= CORE_GLASS[1] + 0.01; x += 1.5) B(x - 0.05, 0.4, 5.9, x + 0.05, ROOF - 0.4, 6.1, INK.BLACK, { fill: true, collide: false });
  for (const y of [F1 - 0.4, F1 + 1.8, F2 - 0.4, F2 + 1.8]) B(CORE_GLASS[0], y, 5.92, CORE_GLASS[1], y + 0.08, 6.08, INK.BLACK, { fill: true, collide: false });
  for (const y of [F1, F2]) { // terrazas de la escalera
    B(CORE_GLASS[0] - 0.4, y - 0.25, 6.2, CORE_GLASS[1] + 0.4, y, 7.8, STONE.ink, { tone: 0.2 });
    railing(CORE_GLASS[0] - 0.4, 7.8, CORE_GLASS[1] + 0.4, 7.8, y);
    plant(CORE_GLASS[0] + 0.3, 7, y, 0.7); plant(CORE_GLASS[1] - 0.3, 7, y, 0.7);
  }
  // Plantas 1 y 2 en Z=6: ventanales transparentes
  for (const fy of [F1, F2]) {
    glassZ(6, -21.75, -10.25, fy + 0.1, fy + 3.8, [], 1.8);
    glassZ(6, -9.75, 2.95, fy + 0.1, fy + 3.8, [], 1.8);
    glassZ(6, 10.05, 13.75, fy + 0.1, fy + 3.8, [], 1.8);
  }

  // ── FACHADA X=20 (Pedro Villar): CRISTALERAS TRANSPARENTES ──
  // Planta Baja: ventanales transparentes hacia Pedro Villar
  glassX(20, -27.75, -20.25, 0.4, F1 - 0.4, [], 1.8);
  glassX(20, -19.75, -12.25, 0.4, F1 - 0.4, [], 1.8);
  glassX(20, -11.75, -0.25, 0.4, F1 - 0.4, [], 1.8);
  // Plantas 1 y 2 en X=20: ventanales transparentes de la oficina de Clevergy y Hot Desk
  for (const fy of [F1, F2]) {
    glassX(20, -27.75, -20.25, fy + 0.1, fy + 3.8, [], 1.8);
    glassX(20, -19.75, -12.25, fy + 0.1, fy + 3.8, [], 1.8);
    glassX(20, -11.75, -0.25, fy + 0.1, fy + 3.8, [], 1.8);
  }
  // esquina redonda: planta baja con la entrada, plantas altas acristaladas
  const ENTRY_GAP = [0.55, 1.02];
  arcWall(0, F1, STONE.ink, { tone: STONE.tone }, ENTRY_GAP, false);
  arcWall(F1 - 0.4, ROOF, INK.BLUE, { tone: 0.3 }, null, true, true); // cristal transparente: sólo se ven los montantes
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
  C(-3.5, 0, 8.8, 0.12, 7.5, INK.BLACK, { tone: 0.1, collide: true });
  B(-5.2, 7.3, 8.6, -3.4, 7.5, 9, INK.BLACK, { tone: 0.1, collide: false });
  B(-5.5, 7.0, 8.4, -4.7, 7.35, 9.2, INK.BLACK, { tone: 0.4, collide: false });
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

  // ════════════════ PLANTA BAJA (como se recorre de verdad) ════════════════
  // Entras por la esquina: a la derecha un sofá, enfrente la recepción (Victoria) y a la izquierda
  // la escalera al descansillo de la 1ª. Siguiendo de frente, la mesa de los espejos y las mesas
  // altas; a la izquierda el patio (con la escalera de atrás que sube al hot desk). Girando otra
  // vez a la izquierda, los aseos y la cocina con la mesa larga y las vending al fondo. Al salir de
  // la cocina, las salas de reuniones (1–4 en la fachada, 5 y 6 al fondo).
  const H = F1 - 0.4;
  const PATIO = [-8, -28, 6, -14];
  const CORNER = [ARC.cx, ARC.cz, 20, 6];
  const SHAFT_A = [7.4, -9.8, 9.4, 4.2]; // hueco de la escalera principal
  // núcleo de escalera (igual en todas las plantas): ascensor en medio y la escalera dándole la
  // vuelta; en cada planta, un descansillo con una puerta a la izquierda y otra a la derecha
  function core(y) {
    wallX(3.6, -14, 6, y, y + H, [[-13.6, -11.8]]);
    wallZ(-14, 3.6, 9.6, y, y + H, []);
    railing(SHAFT_A[0], SHAFT_A[1], SHAFT_A[0], SHAFT_A[3], y);
    railing(SHAFT_A[0], SHAFT_A[3], SHAFT_A[2], SHAFT_A[3], y);
    place(inkText("OFICINAS", { size: 0.24, ink: INK.BLUE }), 3.8, y + 3.1, -12.7, 1, 0);
  }
  B(-22, 0, -28, 20, 0.025, 6, INK.ORANGE, { tone: 0.32, collide: false });
  B(-22, 0, -28, -8, 0.03, -6, INK.BLUE, { tone: 0.24, collide: false }); // baldosa de la cocina
  B(-8, 0, -28, 6, 0.04, -14, INK.GREEN, { tone: -0.18, collide: false }); // césped del patio
  function stairsZ(zFrom, zTo, x0, x1, base, rise) {
    const n = 14, dir = Math.sign(zTo - zFrom), run = Math.abs(zTo - zFrom) / n, r = rise / n;
    for (let k = 0; k < n; k++) {
      const za = zFrom + dir * k * run, zb = zFrom + dir * (k + 1) * run;
      B(x0, base, Math.min(za, zb), x1, base + (k + 1) * r, Math.max(za, zb), INK.BLACK, { tone: 0.28 });
      B(x0, base + (k + 1) * r - 0.04, Math.min(za, zb), x1, base + (k + 1) * r + 0.01, Math.max(za, zb), INK.ORANGE, { tone: 0.1, collide: false });
    }
    for (const x of [x0, x1]) {
      const m = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      m.scale.set(0.06, 0.06, Math.hypot(zTo - zFrom, rise));
      m.position.set(x, base + rise / 2 + 1, (zFrom + zTo) / 2);
      m.rotation.x = Math.atan2(-rise, zTo - zFrom);
      root.add(m);
    }
  }

  // ── entrada: sofá a la derecha, recepción enfrente, escalera a la izquierda ──
  B(18.4, 0, -4.2, 19.6, 0.45, -0.8, INK.BLUE, { tone: 0.05 }); // sofá
  B(19.2, 0.45, -4.2, 19.7, 1.05, -0.8, INK.BLUE, { tone: -0.05, collide: false });
  for (const z of [-4.3, -0.7]) B(18.4, 0, z - 0.15, 19.7, 0.7, z + 0.15, INK.BLUE, { tone: -0.05, collide: false });
  table(17, -2.5, 0.9, 0.9, 0, 0.42, OSB); // mesita
  B(9.6, 0, -4.3, 14.4, 3.6, -3.95, INK.BLACK, { tone: 0.4 }); // pared del logo
  place(cinkLogo({ size: 1.0, ink: INK.BLACK }), 12, 2.5, -3.9, 0, 1);
  for (let k = 0; k < 7; k++) { // mostrador curvo
    const a = Math.PI * (0.15 + (k / 6) * 0.7), cx = 12 + Math.cos(a) * 2.2, cz = -2.2 + Math.sin(a) * 1.4;
    const seg = new THREE.Mesh(GEO.box, mat(OSB.ink, { tone: OSB.tone }));
    seg.scale.set(1.15, 1.1, 0.55); seg.position.set(cx, 0.55, cz); seg.rotation.y = -a + Math.PI / 2; root.add(seg);
    const top = new THREE.Mesh(GEO.box, mat(WOOD.ink, { tone: 0.2 }));
    top.scale.set(1.2, 0.08, 0.65); top.position.set(cx, 1.14, cz); top.rotation.y = -a + Math.PI / 2; root.add(top);
  }
  colliders.push({ x0: 9.6, x1: 14.4, z0: -1.8, z1: -0.5, y0: 0, y1: 1.1 });
  place(inkText("BIENVENIDO", { size: 0.2, ink: INK.BLACK }), 12, 0.75, -0.48, 0, 1);
  B(11.6, 1.18, -1.7, 12.4, 1.6, -1.6, INK.BLACK, { tone: -0.25, collide: false }); // monitor
  for (const x of [15.2, 16.2, 17.2]) { // lámparas colgantes de cobre
    B(x - 0.01, 2.6, 0.5, x + 0.01, 3.99, 0.52, INK.BLACK, { fill: true, collide: false });
    const lamp = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { tone: -0.1 }));
    lamp.scale.set(0.35, 0.55, 0.35); lamp.position.set(x, 2.35, 0.5); lamp.rotation.x = Math.PI; root.add(lamp);
  }
  plant(10, 5, 0, 0.9); plant(19, 1.6);
  // la escalera: sube a la izquierda de la entrada, por detrás del ascensor
  stairsZ(SHAFT_A[3], SHAFT_A[1], SHAFT_A[0], SHAFT_A[2], 0, F1);
  B(5.8, 0, -8, 7.2, ROOF, 2, INK.BLACK, { tone: 0.45 }); // el ascensor
  for (const y of [0, F1, F2]) {
    B(6, y, -8.06, 7, y + 2.2, -8.0, INK.BLACK, { tone: 0.2, collide: false });
    B(6.48, y, -8.08, 6.52, y + 2.2, -8.06, INK.BLACK, { fill: true, collide: false });
  }
  // de la 1ª a la 2ª: un tramo por la izquierda, rellano y otro tramo por la derecha (en caracol)
  stairsZ(SHAFT_A[1], SHAFT_A[3], 3.8, 5.6, F1, F1 / 2);
  B(3.6, F1 * 1.5 - 0.3, SHAFT_A[3], 9.6, F1 * 1.5, 6, INK.BLACK, { tone: 0.28 });
  stairsZ(SHAFT_A[3], SHAFT_A[1], SHAFT_A[0], SHAFT_A[2], F1 * 1.5, F1 / 2);

  // ── de frente: la mesa de los espejos y las mesas altas ──
  for (const z of [-12.6, -10.4, -8.2]) {
    B(19.68, 0.5, z - 1.08, 19.76, 2.9, z + 1.08, INK.BLACK, { fill: true, collide: false });
    B(19.6, 0.6, z - 1, 19.67, 2.8, z + 1, INK.BLUE, { tone: 0.46, collide: false });
  }
  table(19, -10.4, 0.9, 6.4, 0, 1.05, WOOD);
  [-12.6, -10.4, -8.2].forEach((z) => stool(18.1, z));
  for (const x of [11, 15]) { table(x, -10, 2.6, 0.9, 0, 1.05, WOOD); [x - 1, x, x + 1].forEach((sx) => { stool(sx, -10.8); stool(sx, -9.2); }); }
  place(inkText("PEOPLE MAKE CINK", { size: 0.28, ink: INK.BLACK }), 19.55, 3.3, -10.4, -1, 0);

  // ── a la izquierda: el PATIO (exterior), con la escalera de atrás al hot desk ──
  glassZ(-14, -8, 6, 0, H, [[1, 3]]);
  glassX(6, -28, -14, 0, H, []);
  glassX(-8, -28, -14, 0, H, []);
  place(inkText("PATIO", { size: 0.34, ink: INK.GREEN }), -3, 3.1, -13.8, 0, 1);
  [[-5, -17.5], [0, -17.5], [-5, -23], [0, -23]].forEach(([x, z]) => {
    table(x, z, 1.2, 1.2, 0, 0.75, WOOD);
    chair(x - 0.95, z, 0, Math.PI / 2, INK.ORANGE); chair(x + 0.95, z, 0, -Math.PI / 2, INK.ORANGE);
  });
  B(-5, 0, -27.4, -2, 0.45, -26.6, WOOD.ink, { tone: 0.05 }); // banco con jardinera
  B(-5.5, 0, -28, -1.5, 0.8, -27.4, INK.ORANGE, { tone: -0.05 });
  for (const x of [-4.8, -3.5, -2.2]) S(x, 1.15, -27.7, 0.45, INK.GREEN, { tone: -0.05 });
  plant(-7.2, -15, 0, 1.2); plant(-7.2, -27, 0, 1.3);
  stairsZ(-15.2, -26, 3.8, 5.9, 0, F1); // la escalera de atrás
  B(3.6, F1 - 0.4, -28, 6, F1, -26, INK.BLACK, { tone: 0.28 }); // rellano de arriba
  railing(3.6, -26, 3.6, -28, F1);

  // ── a la izquierda de la entrada: SALA DE COMER Y VENDING (frente a las ventanas de la calle) ──
  B(-10, 0, -4, 3.2, 0.03, 6, INK.ORANGE, { tone: 0.16, collide: false }); // tarima del comedor
  glassZ(-4, -10, 3.2, 0, H, [[-1.2, 0.8]]); // pared divisoria de cristal con puerta
  wallX(-10, -4, 6, 0, H, []); // pared izquierda del comedor
  place(inkText("SALA DE COMER", { size: 0.32, ink: INK.BLUE }), -4, 3.1, -4.1, 0, 1);
  place(inkText("VENDING & CAFÉ", { size: 0.22, ink: INK.ORANGE }), -1.0, 2.7, -4.1, 0, 1);

  // Mesa larga del comedor con sillas
  table(-4.5, 1.2, 7.5, 1.4, 0, 0.76, WOOD);
  for (let sx = -7.5; sx <= -1.5; sx += 1.4) { chair(sx, 0.2, 0, 0); chair(sx, 2.2, 0, Math.PI); }

  // Encimera de cocina con microondas y cafetera (contra la pared)
  B(-9.6, 0, -3.8, -4.8, 0.95, -3.1, INK.BLACK, { tone: 0.42 });
  B(-9.65, 0.95, -3.85, -4.75, 1.0, -3.05, WOOD.ink, { tone: 0.1, collide: false });
  for (let k = 0; k < 3; k++) B(-9.2 + k * 1.4, 1.0, -3.7, -8.1 + k * 1.4, 1.5, -3.2, INK.BLACK, { tone: -0.05, collide: false });
  B(-5.1, 1.0, -3.6, -4.5, 1.5, -3.1, INK.BLACK, { tone: -0.2, collide: false });

  const vendingPacks = [];
  // Máquinas de vending (de cara hacia las ventanas de la calle en z=6)
  {
    const FZ = -2.8;
    // Máquina de galletas (ChocoBom de Gullón)
    B(-4.2, 0, -3.8, -2.4, 2.2, FZ, INK.BLACK, { tone: 0.12 });
    B(-4.05, 0.55, FZ, -2.85, 2.05, FZ + 0.03, INK.BLUE, { tone: 0.5, collide: false }); // escaparate
    for (let r = 0; r < 4; r++) {
      const y = 0.65 + r * 0.36;
      B(-4.05, y - 0.03, FZ + 0.03, -2.85, y, FZ + 0.06, INK.BLACK, { fill: true, collide: false });
      for (let c = 0; c < 4; c++) vendingPacks.push({ x: -3.85 + c * 0.31, y: y + 0.16, z: FZ + 0.08, w: 0.26, h: 0.31 }); // bolsas ChocoBom
    }
    B(-2.8, 0.9, FZ, -2.45, 1.6, FZ + 0.04, INK.BLACK, { tone: -0.3, collide: false }); // teclado
    B(-4.0, 0.15, FZ, -2.9, 0.4, FZ + 0.04, INK.BLACK, { tone: -0.35, collide: false }); // cajetín
    place(inkText("CHOCO BOM", { size: 0.2, ink: INK.BLUE }), -3.3, 2.35, FZ + 0.05, 0, 1);

    // Máquina de café
    B(-2.0, 0, -3.8, -0.2, 2.2, FZ, INK.RED, { tone: 0.05 });
    B(-1.8, 1.1, FZ, -0.4, 2.0, FZ + 0.03, INK.ORANGE, { tone: 0.3, collide: false });
    C(-1.1, 1.25, FZ + 0.08, 0.22, 0.45, INK.BLACK, { tone: 0.55, collide: false }); // taza
    B(-0.7, 1.35, FZ + 0.04, -0.55, 1.6, FZ + 0.1, INK.BLACK, { fill: true, collide: false });
    for (let k = 0; k < 3; k++) B(-1.22 + k * 0.1, 1.75, FZ + 0.06, -1.18 + k * 0.1, 1.95, FZ + 0.08, INK.BLACK, { tone: 0.2, collide: false }); // humo
    B(-1.5, 0.35, FZ - 0.25, -0.7, 0.85, FZ + 0.02, INK.BLACK, { tone: -0.4, collide: false }); // hueco vaso
    C(-1.1, 0.38, FZ - 0.1, 0.07, 0.14, INK.BLACK, { tone: 0.6, collide: false });
    for (let k = 0; k < 4; k++) B(-0.35, 0.9 + k * 0.12, FZ, -0.25, 0.98 + k * 0.12, FZ + 0.04, INK.BLACK, { fill: true, collide: false });
    place(inkText("CAFÉ", { size: 0.24, ink: INK.RED }), -1.1, 2.35, FZ + 0.05, 0, 1);
  }

  // ── Aseos (junto al patio) ──
  wallZ(-10, -8, -3, 0, H, [[-6.5, -4.8]]);
  wallX(-3, -14, -10, 0, H, []);
  B(-7.6, 0, -13.6, -6.6, 0.9, -12.6, INK.BLACK, { tone: 0.5 });
  B(-5.2, 0, -13.6, -3.6, 0.85, -12.8, INK.BLACK, { tone: 0.5 });
  place(inkText("ASEOS", { size: 0.24, ink: INK.BLUE }), -5.6, 3.1, -9.8, 0, 1);

  // ── Salas de reuniones: distribuidas en el ala oeste y patio ──
  wallZ(-16, -22, -8, 0, H, [[-15.5, -13.5]]);
  wallX(-10, -28, -6, 0, H, [[-21, -19], [-11, -9]]);
  meetingRoom(-22, -28, -10, -16, "SALA 1", "yellow", "north");
  meetingRoom(-22, -16, -10, -4, "SALA 2", "teal", "north");
  wallZ(-14, 6, 20, 0, H, [[8.6, 10.4], [15.6, 17.4]]);
  wallX(13, -28, -14, 0, H, []);
  meetingRoom(6, -28, 13, -14, "SALA 3", "yellow", "north");
  meetingRoom(13, -28, 20, -14, "SALA 4", "teal", "north");

  // ════════════════ PRIMERA PLANTA ════════════════
  // Subiendo la escalera, un descansillo con dos puertas: la de la izquierda da a otras oficinas y
  // la de la derecha al hot desk. Dentro, a la izquierda todo hot desk y a la derecha la puerta de
  // Clevergy. Por el fondo del hot desk se baja al patio por la escalera de atrás.
  slab(F1, [-22, -28, 20, 6], [PATIO, SHAFT_A, CORNER]);
  arcSlab(F1);
  B(-22, F1, -28, -8, F1 + 0.02, 6, INK.ORANGE, { tone: 0.3, collide: false });
  B(-8, F1, -14, SHAFT_A[0], F1 + 0.02, 6, INK.ORANGE, { tone: 0.3, collide: false });
  B(SHAFT_A[0], F1, -28, 20, F1 + 0.02, SHAFT_A[1], INK.ORANGE, { tone: 0.3, collide: false });
  B(SHAFT_A[2], F1, SHAFT_A[1], 20, F1 + 0.02, 0, INK.ORANGE, { tone: 0.3, collide: false });
  core(F1);
  railing(-8, -14, 3.6, -14, F1); railing(-8, -28, -8, -14, F1);
  // el descansillo: puerta izquierda (oficinas) y derecha (hot desk)
  wallX(9.6, -14, -12, F1, F2 - 0.4, [[-13.8, -12.2]]);
  wallZ(-12, 9.6, 20, F1, F2 - 0.4, [[15.5, 17.5]]);
  place(inkText("HOT DESK", { size: 0.26, ink: INK.RED }), 9.4, F1 + 3.1, -13, -1, 0);
  // hot desk: toda la sala, con vistas al patio
  glassX(6, -28, -14, F1, F2 - 0.4, [[-27.8, -26.2]]);
  place(inkText("HOT DESK", { size: 0.4, ink: INK.RED }), 13, F1 + 3.2, -27.7, 0, 1);
  for (const x of [9, 12, 15, 18]) for (const z of [-25.5, -22, -18.5]) desk(x, z, F1, 1);
  plant(7, -16, F1); plant(19.2, -27.2, F1);
  // oficina de Clevergy: a la izquierda toda la cristalera, a la derecha del todo la balda con
  // comida y café, y en la pared derecha la pizarra y la foto de Álvaro, el jefe
  wallX(9.6, -12, 6, F1, F2 - 0.4, [], INK.BLACK, { tone: 0.32 });
  place(inkText("CLEVERGY", { size: 0.34, ink: INK.GREEN }), 16.5, F1 + 3.2, -12.2, 0, -1);
  [[14, 2.6], [16.8, 0.6], [12, 0.6]].forEach(([x, z]) => desk(x, z, F1, -1));
  desk(17.6, -7.4, F1, 1); // la mesa junto a la cristalera
  B(9.8, F1, 0.6, 10.4, F1 + 2.2, 5.6, WOOD.ink, { tone: 0.05 }); // balda con comida y café
  for (const y of [0.8, 1.5]) B(9.8, F1 + y, 0.7, 10.6, F1 + y + 0.05, 5.5, WOOD.ink, { tone: 0.2, collide: false });
  B(10, F1 + 0.85, 1, 10.55, F1 + 1.35, 1.6, INK.BLACK, { tone: -0.2, collide: false }); // cafetera
  for (let k = 0; k < 5; k++) C(10.25, F1 + 1.55, 1.9 + k * 0.6, 0.1, 0.18, k % 2 ? INK.RED : INK.BLUE, { tone: 0.1 });
  for (let k = 0; k < 4; k++) B(10, F1 + 0.85, 2.2 + k * 0.7, 10.4, F1 + 1.3, 2.7 + k * 0.7, INK.ORANGE, { tone: 0.1, collide: false });
  whiteboard(9.78, F1 + 1.8, -6.2, 1, 0, 3.4);
  place(inkText("CLEVERGY", { size: 0.5, ink: INK.GREEN }), 9.78, F1 + 3.05, -6.2, 1, 0);
  plant(18.6, -11, F1, 0.9);
  // oficinas (puerta izquierda del descansillo)
  place(inkText("OFICINAS", { size: 0.4, ink: INK.BLUE }), -12, F1 + 3.2, 5.8, 0, -1);
  for (const x of [-19, -16, -13, -10]) { desk(x, 3.6, F1, -1); desk(x, 1.2, F1, 1); }
  for (const x of [-19, -16, -13]) { desk(x, -9.5, F1, 1); desk(x, -20, F1, 1); }
  plant(-7.2, 5.2, F1); plant(-21, -1, F1);

  // ════════════════ SEGUNDA PLANTA ════════════════
  // Mismo descansillo. Por la puerta de la derecha: nada más entrar una oficina a la derecha, un
  // pasillo con una oficina a cada lado y, al fondo, la antigua oficina de Clevergy (rectangular,
  // con la cristalera al patio). Volviendo por el pasillo y girando a la izquierda: los aseos
  // (chicas y chicos, uno a cada lado) y, más adelante, otra oficina.
  const R2 = ROOF - 0.4;
  slab(F2, [-22, -28, 20, 6], [PATIO, SHAFT_A, CORNER]);
  arcSlab(F2);
  B(-22, F2, -14, SHAFT_A[0], F2 + 0.02, 6, INK.ORANGE, { tone: 0.3, collide: false });
  B(-22, F2, -28, -8, F2 + 0.02, -14, INK.ORANGE, { tone: 0.3, collide: false });
  B(SHAFT_A[2], F2, -28, 20, F2 + 0.02, 0, INK.ORANGE, { tone: 0.3, collide: false });
  core(F2);
  railing(-8, -14, 3.6, -14, F2); railing(-8, -28, -8, -14, F2);
  // otras oficinas (puerta izquierda del descansillo)
  place(inkText("OFICINAS", { size: 0.4, ink: INK.BLUE }), -12, F2 + 3.2, 5.8, 0, -1);
  [[-15, 2.5], [-8, 2.5], [-1, 2.5]].forEach(([x, z]) => { desk(x - 1, z, F2, -1); desk(x + 1.2, z, F2, -1); });
  for (const x of [-19, -16, -13]) desk(x, -20, F2, 1);
  plant(-20, -4, F2);
  // el pasillo
  wallX(9.6, -14, 6, F2, R2, [[-13.8, -12.2]]);
  wallZ(-12, 9.6, 20, F2, R2, [[10.2, 11.8], [13, 15], [16.4, 18]]);
  wallZ(-14, 9.6, 16, F2, R2, [[11.6, 13.2]]);
  wallX(16, -20, -14, F2, R2, []);
  wallZ(-20, 6, 20, F2, R2, [[17.2, 19]]);
  glassX(6, -28, -14, F2, R2, []);
  for (let z = -28; z <= -20; z += 1) B(6.1, F2, z - 0.04, 6.2, R2, z + 0.04, INK.BLACK, { fill: true, collide: false }); // la cristalera del fondo, al patio
  for (const y of [F2 + 1.1, F2 + 2.9]) B(6.1, y, -28, 6.2, y + 0.08, -20, INK.BLACK, { fill: true, collide: false });
  place(inkText("PATIO", { size: 0.3, ink: INK.GREEN }), 6.25, F2 + 3.5, -24, 1, 0);
  place(inkText("OFICINA", { size: 0.24, ink: INK.BLUE }), 11, F2 + 3.1, -12.2, 0, -1);
  place(inkText("OFICINA", { size: 0.24, ink: INK.BLUE }), 17.2, F2 + 3.1, -12.2, 0, -1);
  place(inkText("OFICINA", { size: 0.24, ink: INK.BLUE }), 12.4, F2 + 3.1, -13.8, 0, 1);
  desk(11.3, -10, F2, 1); desk(17.5, -10, F2, 1);
  desk(9, -17, F2, 1); desk(12.4, -17, F2, 1);
  // la antigua oficina de Clevergy
  place(inkText("ANTIGUA OFICINA", { size: 0.22, ink: INK.GREEN }), 18.1, F2 + 3.25, -19.8, 0, 1);
  place(inkText("DE CLEVERGY", { size: 0.22, ink: INK.GREEN }), 18.1, F2 + 2.9, -19.8, 0, 1);
  place(inkText("ANTIGUA OFICINA DE CLEVERGY", { size: 0.36, ink: INK.GREEN }), 13, F2 + 3.2, -27.7, 0, 1);
  for (const x of [9, 12, 15]) { desk(x, -25.5, F2, 1); desk(x, -22.5, F2, -1); }
  whiteboard(19.75, F2 + 1.8, -24, -1, 0, 3);
  plant(7, -21, F2); plant(19.2, -27.2, F2);
  // girando a la izquierda: aseos y otra oficina al fondo
  wallX(13, -12, -4, F2, R2, [[-7.2, -5.6]]);
  wallX(15, -12, -4, F2, R2, [[-7.2, -5.6]]);
  wallZ(-8, 9.6, 13, F2, R2, []); wallZ(-8, 15, 20, F2, R2, []);
  wallZ(-4, 9.6, 20, F2, R2, [[13, 15]]);
  place(inkText("CHICOS", { size: 0.22, ink: INK.BLUE }), 12.8, F2 + 3.1, -6.4, -1, 0);
  place(inkText("CHICAS", { size: 0.22, ink: INK.RED }), 15.2, F2 + 3.1, -6.4, 1, 0);
  B(10, F2, -7.6, 11, F2 + 0.9, -6.6, INK.BLACK, { tone: 0.5 }); B(18.6, F2, -7.6, 19.6, F2 + 0.9, -6.6, INK.BLACK, { tone: 0.5 });
  place(inkText("OFICINA", { size: 0.24, ink: INK.BLUE }), 14, F2 + 3.1, -3.8, 0, 1);
  [[11.5, 0], [14.5, 0], [12, 3]].forEach(([x, z]) => desk(x, z, F2, -1));
  plant(18, -2, F2);

  // ════════════════ AZOTEA: torre cilíndrica de pavés y chimeneas ════════════════
  slab(ROOF, [-22, -28, 20, 6], [PATIO, CORNER]);
  arcSlab(ROOF);
  C(11, ROOF, -3, 3.2, 8.5, INK.BLACK, { tone: 0.35, collide: false });
  for (let y = 1; y < 8; y += 1.1) { const r = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { fill: true })); r.scale.set(6.4, 6.4, 0.4); r.rotation.x = Math.PI / 2; r.position.set(11, ROOF + y, -3); root.add(r); }
  C(7.4, ROOF, -3, 0.35, 13, INK.BLACK, { tone: 0.2, collide: false });
  C(14.6, ROOF, -3, 0.35, 12, INK.BLACK, { tone: 0.2, collide: false });
  railing(-22, 6, 14, 6, ROOF); railing(20, -28, 20, 0, ROOF);

  // ════════════════ MARÍA EUGENIA (la vecina de enfrente, siempre tejiendo) ════════════════
  // ventana iluminada del edificio de la calle Limonero, a la izquierda de los ventanales de Clevergy
  const MEZ = -7, MEY = F1 + 0.4;
  // balcón madrileño (a lo grande para verla bien desde la oficina): puerta-ventana con luz
  // cálida, cortinas, barandilla de forja y geranios
  const BK = 1.7;
  B(35.9, MEY, MEZ - 1.4 * BK, 36.02, MEY + 2.8 * BK, MEZ + 1.4 * BK, INK.ORANGE, { tone: 0.42, collide: false });
  B(35.85, MEY + 2.8 * BK, MEZ - 1.55 * BK, 36.02, MEY + 2.95 * BK, MEZ + 1.55 * BK, INK.BLACK, { fill: true, collide: false });
  for (const sd of [-1, 1]) {
    B(35.85, MEY, MEZ + sd * 1.45 * BK - 0.08, 36.02, MEY + 2.95 * BK, MEZ + sd * 1.45 * BK + 0.08, INK.BLACK, { fill: true, collide: false });
    B(35.8, MEY + 0.3, MEZ + sd * 1.1 * BK - 0.45, 35.88, MEY + 2.75 * BK, MEZ + sd * 1.1 * BK + 0.45, INK.RED, { tone: 0.2, collide: false }); // cortinas
  }
  B(33.6, MEY - 0.22, MEZ - 2 * BK, 36, MEY, MEZ + 2 * BK, INK.BLACK, { tone: 0.2, collide: false }); // suelo del balcón
  B(33.55, MEY + 1.05 * BK, MEZ - 2 * BK, 33.68, MEY + 1.05 * BK + 0.1, MEZ + 2 * BK, INK.BLACK, { fill: true, collide: false }); // pasamanos
  for (let z = MEZ - 1.95 * BK; z <= MEZ + 1.96 * BK; z += 0.35) B(33.58, MEY, z - 0.03, 33.65, MEY + 1.05 * BK, z + 0.03, INK.BLACK, { fill: true, collide: false });
  for (const dz of [-2.8, 2.8]) { C(33.9, MEY, MEZ + dz, 0.25, 0.4, INK.RED, { tone: 0.1 }); S(33.9, MEY + 0.65, MEZ + dz, 0.4, INK.RED, { tone: -0.05 }); S(33.9, MEY + 0.45, MEZ + dz + 0.3, 0.3, INK.GREEN, { tone: -0.05 }); }
  const mariaEugenia = makeMariaEugenia();
  mariaEugenia.group.position.set(34.8, MEY, MEZ + 0.3);
  mariaEugenia.group.rotation.y = -Math.PI / 2; // mira hacia la calle (hacia la oficina)
  root.add(mariaEugenia.group);

  // ════════════════ VICTORIA (recepción) ════════════════
  const victoria = makeVictoria();
  victoria.group.position.set(12, 0, -3);
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

  // la foto de la pared de la pizarra (se pinta con sus colores reales, ver doodleWorld)
  const clevergyPhoto = { x: 9.8, y: F1 + 1.85, z: -2.9, w: 1.25, h: 1.45, ry: Math.PI / 2 };

  // la señora de las vending (se queja si te pones en medio)
  const senor = makeSenor();
  senor.group.position.set(-1.1, 0, -1.6);
  senor.group.rotation.y = Math.PI; // mira hacia la máquina de café
  root.add(senor.group);

  return { root, colliders, updateDoors, victoria, mariaEugenia, clevergyPhoto, senor, tendedora, vendingPacks };
}

// María Eugenia: señora mayor con moño gris y gafas, en su sillón, tejiendo una bufanda
function makeMariaEugenia() {
  const g = new THREE.Group();
  const part = (geo, ink, o, s, p, parent = g) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...s); m.position.set(...p); parent.add(m); return m; };
  const k = 2.1; // bastante más grande que en la vida real: está al otro lado de la calle
  // sillón orejero
  part(GEO.box, INK.GREEN, { tone: -0.05 }, [0.9 * k, 0.45 * k, 0.8 * k], [0, 0.35 * k, -0.05 * k]);
  part(GEO.box, INK.GREEN, { tone: -0.12 }, [0.9 * k, 1.1 * k, 0.18 * k], [0, 0.95 * k, -0.42 * k]);
  for (const s of [-1, 1]) part(GEO.box, INK.GREEN, { tone: -0.1 }, [0.16 * k, 0.4 * k, 0.75 * k], [s * 0.42 * k, 0.7 * k, 0]);
  // cuerpo: rebeca morada, falda y zapatillas
  part(GEO.cyl, INK.PURPLE, { tone: 0.15 }, [0.5 * k, 0.6 * k, 0.4 * k], [0, 0.92 * k, -0.1 * k]);
  part(GEO.box, INK.BLUE, { tone: 0.2 }, [0.5 * k, 0.16 * k, 0.5 * k], [0, 0.62 * k, 0.15 * k]);
  const head = part(GEO.sph, INK.ORANGE, { tone: 0.5 }, [0.36 * k, 0.4 * k, 0.36 * k], [0, 1.42 * k, -0.08 * k]);
  part(GEO.sph, INK.BLACK, { tone: 0.62 }, [0.38 * k, 0.3 * k, 0.36 * k], [0, 1.52 * k, -0.14 * k]); // pelo canoso
  part(GEO.sph, INK.BLACK, { tone: 0.62 }, [0.2 * k, 0.2 * k, 0.2 * k], [0, 1.66 * k, -0.24 * k]); // el moño
  for (const s of [-1, 1]) part(GEO.torus, INK.BLACK, { fill: true }, [0.09 * k, 0.09 * k, 0.09 * k], [s * 0.07 * k, 1.44 * k, 0.1 * k]); // gafas
  part(GEO.box, INK.RED, { fill: true }, [0.1 * k, 0.02 * k, 0.02 * k], [0, 1.33 * k, 0.1 * k]); // sonrisa
  // brazos con las agujas y la bufanda a medias
  const arms = new THREE.Group(); arms.position.set(0, 0.95 * k, 0.15 * k); g.add(arms);
  const armL = part(GEO.box, INK.PURPLE, { tone: 0.15 }, [0.1 * k, 0.1 * k, 0.4 * k], [-0.16 * k, 0, 0.1 * k], arms);
  const armR = part(GEO.box, INK.PURPLE, { tone: 0.15 }, [0.1 * k, 0.1 * k, 0.4 * k], [0.16 * k, 0, 0.1 * k], arms);
  const needleL = part(GEO.cyl, INK.BLACK, { fill: true }, [0.02 * k, 0.45 * k, 0.02 * k], [-0.08 * k, 0.08 * k, 0.32 * k], arms);
  const needleR = part(GEO.cyl, INK.BLACK, { fill: true }, [0.02 * k, 0.45 * k, 0.02 * k], [0.08 * k, 0.08 * k, 0.32 * k], arms);
  needleL.rotation.z = 0.6; needleR.rotation.z = -0.6;
  part(GEO.box, INK.RED, { tone: 0.1 }, [0.26 * k, 0.4 * k, 0.05 * k], [0, -0.18 * k, 0.32 * k], arms); // la bufanda
  const yarn = part(GEO.sph, INK.RED, { tone: 0.05 }, [0.2 * k, 0.2 * k, 0.2 * k], [0.32 * k, 0.62 * k, 0.35 * k]); // el ovillo
  // brazo para saludar (escondido mientras teje)
  const wave = new THREE.Group(); wave.position.set(0.28 * k, 1.12 * k, 0); g.add(wave);
  part(GEO.box, INK.PURPLE, { tone: 0.15 }, [0.1 * k, 0.5 * k, 0.1 * k], [0, 0.24 * k, 0], wave);
  part(GEO.sph, INK.ORANGE, { tone: 0.5 }, [0.12 * k, 0.12 * k, 0.12 * k], [0, 0.52 * k, 0], wave);
  wave.visible = false;
  let t = 0, waveT = 0;
  function update(dt) {
    t += dt;
    waveT = Math.max(0, waveT - dt);
    const waving = waveT > 0;
    wave.visible = waving;
    armR.visible = !waving;
    needleR.visible = !waving;
    if (waving) wave.rotation.z = -0.3 + Math.sin(t * 10) * 0.45;
    else {
      // punto del derecho, punto del revés
      needleL.rotation.x = Math.sin(t * 7) * 0.35;
      needleR.rotation.x = -Math.sin(t * 7) * 0.35;
      armL.position.y = Math.sin(t * 7) * 0.02;
      armR.position.y = -Math.sin(t * 7) * 0.02;
    }
    head.rotation.x = waving ? -0.15 : 0.25 + Math.sin(t * 0.7) * 0.04; // mira la labor… o a ti
    yarn.rotation.y += dt * 0.6;
  }
  return { group: g, update, greet: () => (waveT = 3.2), name: "María Eugenia" };
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

// la señora de la terraza de enfrente: bata de flores, moño gris y pinzas en la mano
function makeTendedora() {
  const g = new THREE.Group();
  const part = (geo, ink, o, sc, p, parent = g) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...sc); m.position.set(...p); parent.add(m); return m; };
  part(GEO.cyl, INK.BLUE, { tone: 0.15 }, [0.5, 1.0, 0.42], [0, 0.6, 0]); // bata
  for (let k = 0; k < 6; k++) part(GEO.sph, INK.RED, { fill: true }, [0.07, 0.07, 0.04], [Math.cos(k) * 0.2, 0.4 + (k % 3) * 0.3, 0.2]); // flores
  part(GEO.box, INK.BLACK, { tone: 0.55 }, [0.42, 0.55, 0.05], [0, 0.65, 0.22]); // delantal
  part(GEO.cyl, INK.BLUE, { tone: 0.15 }, [0.44, 0.45, 0.38], [0, 1.3, 0]);
  part(GEO.sph, INK.ORANGE, { tone: 0.45 }, [0.34, 0.38, 0.34], [0, 1.72, 0]);
  part(GEO.sph, INK.BLACK, { tone: 0.42 }, [0.36, 0.25, 0.34], [0, 1.85, -0.04]); // pelo gris
  part(GEO.sph, INK.BLACK, { tone: 0.42 }, [0.18, 0.18, 0.18], [0, 1.95, -0.18]); // moño
  for (const sx of [-0.07, 0.07]) part(GEO.sph, INK.BLACK, { fill: true }, [0.04, 0.04, 0.03], [sx, 1.75, 0.16]);
  const arms = [-1, 1].map((sd) => {
    const a = new THREE.Group(); a.position.set(sd * 0.26, 1.48, 0); g.add(a);
    part(GEO.box, INK.BLUE, { tone: 0.15 }, [0.1, 0.55, 0.1], [0, -0.25, 0], a);
    part(GEO.sph, INK.ORANGE, { tone: 0.45 }, [0.09, 0.09, 0.09], [0, -0.55, 0], a);
    return a;
  });
  function pose(up, t, walking) {
    for (const [i, a] of arms.entries()) {
      a.rotation.x = walking ? Math.sin(t * 6 + i * Math.PI) * 0.4 : -up * 2.7 + Math.sin(t * 8 + i) * 0.15 * up;
      a.rotation.z = (i ? -1 : 1) * 0.08;
    }
    g.position.y = g.position.y; // (la altura la fija la terraza)
  }
  return { group: g, pose, update() {} };
}

// la señora canosa que espera su café en las vending y protesta si le estorbas
function makeSenor() {
  const g = new THREE.Group();
  const part = (geo, ink, o, sc, p, parent = g) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...sc); m.position.set(...p); parent.add(m); return m; };
  part(GEO.cyl, INK.BLUE, { tone: 0.1 }, [0.48, 0.85, 0.42], [0, 0.42, 0]); // falda
  part(GEO.cyl, INK.BLACK, { tone: 0.35 }, [0.56, 0.75, 0.46], [0, 1.2, 0]); // rebeca gris
  part(GEO.sph, INK.BLACK, { tone: 0.35 }, [0.5, 0.5, 0.44], [0, 1.05, 0.06]);
  part(GEO.sph, INK.ORANGE, { tone: 0.4 }, [0.36, 0.4, 0.36], [0, 1.85, 0]);
  part(GEO.sph, INK.BLACK, { tone: 0.6 }, [0.42, 0.36, 0.4], [0, 1.98, -0.04]); // pelo canoso, cardado
  part(GEO.sph, INK.BLACK, { tone: 0.6 }, [0.44, 0.3, 0.3], [0, 1.82, -0.12]);
  part(GEO.box, INK.RED, { fill: true }, [0.1, 0.025, 0.02], [0, 1.76, 0.18]); // boca
  part(GEO.box, INK.BLACK, { fill: true }, [0.26, 0.02, 0.02], [0, 1.9, 0.19]); // gafas
  for (const sx of [-0.07, 0.07]) part(GEO.sph, INK.BLACK, { fill: true }, [0.04, 0.04, 0.03], [sx, 1.9, 0.17]);
  const brows = [-1, 1].map((sd) => part(GEO.box, INK.BLACK, { fill: true }, [0.1, 0.025, 0.02], [sd * 0.08, 1.98, 0.17]));
  part(GEO.box, INK.BLACK, { tone: 0.35 }, [0.1, 0.5, 0.1], [-0.33, 1.25, 0.05]);
  const cup = new THREE.Group(); cup.position.set(-0.33, 0.98, 0.15); g.add(cup);
  part(GEO.cyl, INK.BLACK, { tone: 0.6 }, [0.08, 0.14, 0.08], [0, 0, 0], cup); // su vaso de café
  const arm = new THREE.Group(); arm.position.set(0.3, 1.5, 0); g.add(arm);
  part(GEO.box, INK.BLACK, { tone: 0.35 }, [0.1, 0.55, 0.1], [0, -0.25, 0], arm);
  let t = 0, angry = 0;
  function update(dt, target, grumpy) {
    t += dt;
    angry += ((grumpy ? 1 : 0) - angry) * Math.min(1, dt * 5);
    if (target) g.rotation.y += (Math.atan2(target.x - g.position.x, target.z - g.position.z) - g.rotation.y) * Math.min(1, dt * 4);
    arm.rotation.x = -angry * (1.6 + Math.sin(t * 12) * 0.4); // agita el brazo
    brows[0].rotation.z = -angry * 0.5; brows[1].rotation.z = angry * 0.5;
    cup.position.y = 0.98 + Math.sin(t * 1.3) * 0.02;
  }
  return { group: g, update, name: "Señora" };
}
