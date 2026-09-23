// =============================================================================
// doodleLevel.js — La planta de oficina dibujada, hecha sólo con primitivas
// Cada caja sólida registra además un collider AABB {x0,x1,y0,y1,z0,z1}.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "./doodleRender.js";

export const ARENA = 36; // media anchura de la planta (metros)

export const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 14),
  sph: new THREE.SphereGeometry(0.5, 14, 10),
  cone: new THREE.ConeGeometry(0.5, 1, 12),
  torus: new THREE.TorusGeometry(0.5, 0.12, 8, 18),
  disc: new THREE.CircleGeometry(0.5, 14)
};

export function buildLevel(scene) {
  const colliders = [];
  const root = new THREE.Group();
  scene.add(root);

  function box(x, y0, z, w, h, d, ink, o = {}) {
    const m = new THREE.Mesh(GEO.box, mat(ink, o));
    m.scale.set(w, h, d);
    m.position.set(x, y0 + h / 2, z);
    root.add(m);
    if (o.collide !== false) colliders.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2, y0, y1: y0 + h });
    return m;
  }
  function cyl(x, y0, z, r, h, ink, o = {}) {
    const m = new THREE.Mesh(GEO.cyl, mat(ink, o));
    m.scale.set(r * 2, h, r * 2);
    m.position.set(x, y0 + h / 2, z);
    root.add(m);
    if (o.collide) colliders.push({ x0: x - r, x1: x + r, z0: z - r, z1: z + r, y0, y1: y0 + h });
    return m;
  }
  function sph(x, y, z, r, ink, o = {}) {
    const m = new THREE.Mesh(GEO.sph, mat(ink, o));
    m.scale.setScalar(r * 2);
    m.position.set(x, y, z);
    root.add(m);
    return m;
  }

  // ── suelo, moquetas y paredes ──
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ARENA * 2, ARENA * 2), mat(INK.BLACK, { tone: 0.35 }));
  floor.rotation.x = -Math.PI / 2;
  root.add(floor);
  box(-20, 0, -18, 18, 0.02, 14, INK.BLUE, { tone: 0.12, collide: false });
  box(20, 0, 18, 18, 0.02, 14, INK.GREEN, { tone: 0.12, collide: false });
  box(0, 0, 4, 12, 0.02, 12, INK.ORANGE, { tone: 0.15, collide: false });

  const WH = 7;
  box(0, 0, -ARENA - 0.5, ARENA * 2 + 2, WH, 1, INK.BLUE, { tone: 0.05 });
  box(0, 0, ARENA + 0.5, ARENA * 2 + 2, WH, 1, INK.BLUE, { tone: 0.05 });
  box(-ARENA - 0.5, 0, 0, 1, WH, ARENA * 2, INK.BLUE, { tone: 0.05 });
  box(ARENA + 0.5, 0, 0, 1, WH, ARENA * 2, INK.BLUE, { tone: 0.05 });
  // zócalo y ventanales
  for (const s of [-1, 1]) {
    box(0, 0, s * (ARENA - 0.05), ARENA * 2, 0.3, 0.1, INK.BLACK, { tone: -0.1, collide: false });
    box(s * (ARENA - 0.05), 0, 0, 0.1, 0.3, ARENA * 2, INK.BLACK, { tone: -0.1, collide: false });
  }
  for (let i = -3; i <= 3; i++) {
    // ventanas en la pared sur (tinta sólida = cristal oscuro enmarcado)
    box(i * 9, 2.2, ARENA - 0.02, 6, 3, 0.05, INK.BLUE, { tone: 0.35, collide: false });
    box(i * 9, 2.2 + 1.45, ARENA - 0.06, 6.2, 0.12, 0.08, INK.BLACK, { collide: false });
    box(i * 9, 2.2 - 0.05, ARENA - 0.06, 6.2, 0.12, 0.08, INK.BLACK, { collide: false });
  }

  // ── pilares ──
  for (const [x, z] of [[-12, -12], [12, -12], [-12, 12], [12, 12], [-26, 0], [26, 0]]) {
    box(x, 0, z, 1.4, WH, 1.4, INK.BLACK, { tone: 0.05 });
  }

  // ── mesas de trabajo con monitor ──
  function desk(x, z, facing) {
    // facing: +1 / -1 → el monitor mira hacia +z o -z
    box(x, 0, z, 2.2, 0.82, 1.1, INK.BLACK, { tone: 0.2, collide: false }); // cajonera
    const top = box(x, 0.78, z, 2.3, 0.08, 1.15, INK.ORANGE, { tone: 0.1, collide: false });
    colliders.push({ x0: x - 1.15, x1: x + 1.15, z0: z - 0.58, z1: z + 0.58, y0: 0, y1: 0.86 });
    top.userData.deskTop = true;
    box(x, 0.86, z - facing * 0.3, 0.9, 0.55, 0.06, INK.BLACK, { tone: -0.2, collide: false }); // pantalla
    box(x, 0.86, z - facing * 0.34, 0.12, 0.3, 0.08, INK.BLACK, { collide: false }); // pie
    box(x, 0.86, z + facing * 0.12, 0.6, 0.03, 0.2, INK.BLACK, { tone: 0.2, collide: false }); // teclado
    cyl(x + 0.75, 0.86, z + facing * 0.1, 0.07, 0.14, INK.RED, { tone: 0.1 }); // taza
  }
  function cluster(cx, cz) {
    for (let i = -1; i <= 1; i++) {
      desk(cx + i * 2.5, cz - 0.9, 1);
      desk(cx + i * 2.5, cz + 0.9, -1);
    }
    box(cx, 0, cz, 7.6, 1.4, 0.12, INK.GREEN, { tone: 0.1 }); // mampara
  }
  cluster(-20, -18);
  cluster(20, -18);
  cluster(-20, 18);
  cluster(20, 18);

  // ── sala de reuniones "ZOOM" (norte), con puerta ──
  const MX0 = -8, MX1 = 8, MZ0 = -ARENA, MZ1 = -25;
  const mh = 3.2;
  box(MX0, 0, (MZ0 + MZ1) / 2, 0.3, mh, MZ1 - MZ0, INK.PURPLE, { tone: 0.12 });
  box(MX1, 0, (MZ0 + MZ1) / 2, 0.3, mh, MZ1 - MZ0, INK.PURPLE, { tone: 0.12 });
  box((MX0 - 1.8) / 2, 0, MZ1, -1.8 - MX0, mh, 0.3, INK.PURPLE, { tone: 0.12 });
  box((MX1 + 1.8) / 2, 0, MZ1, MX1 - 1.8, mh, 0.3, INK.PURPLE, { tone: 0.12 });
  box(0, mh - 0.6, MZ1, 3.6, 0.6, 0.3, INK.PURPLE, { tone: 0.12 }); // dintel
  box(0, 0, -30.5, 8, 0.78, 3, INK.BLACK, { tone: 0.15 }); // mesa grande
  for (let i = -3; i <= 3; i += 2) {
    box(i, 0, -32.6, 0.6, 0.5, 0.6, INK.PURPLE, { tone: -0.1, collide: false });
    box(i, 0, -28.4, 0.6, 0.5, 0.6, INK.PURPLE, { tone: -0.1, collide: false });
  }
  box(0, 1.2, -ARENA + 0.05, 6, 2.2, 0.1, INK.BLACK, { tone: 0.4, collide: false }); // pantalla/pizarra

  // ── cocina con cafetera (sur) ──
  box(0, 0, ARENA - 1, 14, 0.95, 1.6, INK.BLACK, { tone: 0.15 });
  box(-4, 0.95, ARENA - 1.1, 0.8, 0.9, 0.6, INK.ORANGE, { tone: -0.05 }); // cafetera
  box(6.5, 0, ARENA - 1.2, 1.4, 2.4, 1.2, INK.BLUE, { tone: 0.2 }); // nevera
  cyl(-6.8, 0, ARENA - 1.2, 0.35, 1.5, INK.BLUE, { tone: 0.25, collide: true }); // fuente de agua
  sph(-6.8, 1.75, ARENA - 1.2, 0.35, INK.BLUE, { tone: 0.3 });

  // ── servidores (este) ──
  for (let i = -3; i <= 3; i++) {
    box(ARENA - 1.2, 0, i * 2, 1.4, 2.6, 1.6, INK.BLACK, { tone: -0.15 });
    for (let k = 0; k < 4; k++) box(ARENA - 1.92, 0.5 + k * 0.5, i * 2, 0.02, 0.06, 1.2, INK.GREEN, { fill: true, collide: false });
  }

  // ── zona chill (oeste): sofá y pufs ──
  box(-ARENA + 1.2, 0, 0, 1.6, 0.45, 5, INK.GREEN, { tone: 0.05 });
  box(-ARENA + 0.55, 0, 0, 0.4, 1.0, 5, INK.GREEN, { tone: 0.05 });
  for (const [x, z] of [[-30, -3], [-30.5, 2.5]]) {
    sph(x, 0.35, z, 0.55, INK.RED, { tone: 0.1 });
    colliders.push({ x0: x - 0.5, x1: x + 0.5, z0: z - 0.5, z1: z + 0.5, y0: 0, y1: 0.7 });
  }

  // ── cajas de "releases" para cubrirse y subir ──
  const crates = [[6, 0, 1], [7.3, 0, 1], [6.6, 0, -0.25], [6.6, 1.2, 0.45], [-7, 0, -5], [-7, 0, -6.3], [-7, 1.2, -5.6],
                  [-2, 0, 12], [3, 0, -10], [3, 1.2, -10], [14, 0, 4], [-15, 0, -4], [-15, 1.2, -4], [0, 0, -18]];
  for (const [x, y, z] of crates) box(x, y, z, 1.2, 1.2, 1.2, INK.ORANGE, { tone: -0.05 });

  // ── plantas ──
  for (const [x, z] of [[-33, -33], [33, -33], [-33, 33], [33, 33], [-10, 0], [10, 8], [-4, 24], [9, -24]]) {
    cyl(x, 0, z, 0.35, 0.6, INK.ORANGE, { tone: 0.05, collide: true });
    sph(x, 1.0, z, 0.6, INK.GREEN, { tone: -0.05 });
    sph(x + 0.25, 1.45, z - 0.1, 0.42, INK.GREEN, { tone: -0.05 });
    sph(x - 0.2, 1.35, z + 0.2, 0.38, INK.GREEN, { tone: -0.05 });
  }

  // ── pizarras en las paredes laterales ──
  for (const z of [-14, 14]) {
    box(-ARENA + 0.05, 1.2, z, 0.08, 1.8, 4, INK.BLACK, { tone: 0.45, collide: false });
    box(ARENA - 0.05, 1.2, z + 3, 0.08, 1.8, 4, INK.BLACK, { tone: 0.45, collide: false });
  }

  return { root, colliders };
}

// Puntos de aparición repartidos por la planta
export const SPAWNS = [
  [-30, -30], [30, -30], [-30, 30], [30, 30], [0, -22], [-30, -12], [30, 12], [-18, 0], [18, 0], [0, 28], [-10, -30], [22, -30]
];
