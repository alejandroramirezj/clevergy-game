// =============================================================================
// fightStage.js — El ring: la oficina de Clevergy dibujada a boli, vista de lado
// Las mesas y la mesa de café son plataformas atravesables desde abajo.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "../doodleRender.js";
import { GEO } from "../doodleLevel.js";

export const STAGE_HALF = 9.6; // los luchadores se mueven en x ∈ [-STAGE_HALF, STAGE_HALF]
export const FIGHT_Z = 0.4; // profundidad del plano de lucha

// plataformas de un solo sentido (se atraviesan desde abajo y con ▼)
export const PLATFORMS = [
  { x0: -7.1, x1: -3.9, y: 1.7 },
  { x0: 3.9, x1: 7.1, y: 1.7 },
  { x0: -1.3, x1: 1.3, y: 1.05 }
];

export function buildFightStage(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const box = (x, y0, z, w, h, d, ink, o = {}) => {
    const m = new THREE.Mesh(GEO.box, mat(ink, o));
    m.scale.set(w, h, d);
    m.position.set(x, y0 + h / 2, z);
    root.add(m);
    return m;
  };
  const cyl = (x, y0, z, r, h, ink, o = {}) => {
    const m = new THREE.Mesh(GEO.cyl, mat(ink, o));
    m.scale.set(r * 2, h, r * 2);
    m.position.set(x, y0 + h / 2, z);
    root.add(m);
    return m;
  };
  const sph = (x, y, z, r, ink, o = {}) => {
    const m = new THREE.Mesh(GEO.sph, mat(ink, o));
    m.scale.setScalar(r * 2);
    m.position.set(x, y, z);
    root.add(m);
    return m;
  };

  // suelo y "ring" marcado con cinta
  box(0, -0.6, -2, 34, 0.6, 12, INK.BLACK, { tone: 0.35 });
  box(0, 0, FIGHT_Z, STAGE_HALF * 2 + 0.6, 0.02, 3.4, INK.RED, { tone: 0.18 });
  for (const s of [-1, 1]) box(s * (STAGE_HALF + 0.3), 0, FIGHT_Z, 0.12, 0.03, 3.4, INK.RED, { fill: true });
  box(0, 0, FIGHT_Z + 1.7, STAGE_HALF * 2 + 0.6, 0.03, 0.12, INK.RED, { fill: true });
  box(0, 0, FIGHT_Z - 1.7, STAGE_HALF * 2 + 0.6, 0.03, 0.12, INK.RED, { fill: true });

  // pared del fondo con ventanales y pizarra
  box(0, 0, -6, 36, 9, 0.6, INK.BLUE, { tone: 0.08 });
  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    box(i * 6.4, 2.6, -5.68, 4.6, 3.4, 0.05, INK.BLUE, { tone: 0.32 });
    box(i * 6.4, 2.55, -5.62, 4.8, 0.14, 0.1, INK.BLACK, {});
    box(i * 6.4, 6.0, -5.62, 4.8, 0.14, 0.1, INK.BLACK, {});
    box(i * 6.4, 2.6, -5.62, 0.12, 3.4, 0.1, INK.BLACK, {});
  }
  box(0, 2.4, -5.66, 5.2, 2.9, 0.08, INK.BLACK, { tone: 0.45 }); // pizarra
  box(0, 2.3, -5.6, 5.4, 0.14, 0.16, INK.BLACK, {});
  // garabatos en la pizarra: un "VS" y flechas de sprint
  const scrib = [[-1.4, 4.2, 1.2, 0.1, 0.5], [-0.3, 4.4, 1.0, 0.1, -0.6], [1.1, 4.0, 1.6, 0.1, 0.2], [-1.6, 3.2, 3.2, 0.08, 0], [0.8, 3.4, 0.9, 0.08, 0.8]];
  for (const [x, y, w, h, r] of scrib) { const m = box(x, y, -5.6, w, h, 0.02, INK.RED, { fill: true }); m.rotation.z = r; }

  // pilares que enmarcan el ring
  for (const s of [-1, 1]) {
    box(s * 11.2, 0, -1.5, 1.2, 9, 1.2, INK.BLACK, { tone: 0.05 });
    box(s * 11.2, 0, -1.5, 1.5, 0.35, 1.5, INK.BLACK, { tone: -0.1 });
  }

  // mesas de trabajo (plataformas) con monitor, teclado y taza
  function desk(cx, w) {
    box(cx, 1.62, 0, w, 0.08, 2.2, INK.ORANGE, { tone: 0.1 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(cx + sx * (w / 2 - 0.15), 0, sz * 0.9, 0.12, 1.62, 0.12, INK.BLACK, {});
    box(cx - w * 0.25, 0.4, 0, w * 0.35, 1.0, 1.6, INK.BLACK, { tone: 0.2 }); // cajonera
    box(cx, 1.7, -0.75, 1.3, 0.8, 0.07, INK.BLACK, { tone: -0.25 }); // pantalla
    box(cx, 1.7, -0.8, 0.14, 0.35, 0.1, INK.BLACK, {});
    box(cx + 0.9, 1.7, -0.3, 0.14, 0.2, 0.14, INK.RED, { tone: 0.1 }); // taza
  }
  desk(-5.5, 3.2);
  desk(5.5, 3.2);
  // mesa de café central
  box(0, 0.97, 0, 2.6, 0.08, 1.6, INK.GREEN, { tone: 0.05 });
  cyl(0, 0, 0, 0.18, 0.97, INK.BLACK, {});
  box(0, 0, 0, 1.2, 0.06, 1.0, INK.BLACK, { tone: 0.1 });
  cyl(-0.6, 1.05, -0.2, 0.12, 0.2, INK.ORANGE, { tone: 0.05 });

  // plantas
  for (const s of [-1, 1]) {
    cyl(s * 9, 0, -3.6, 0.45, 0.8, INK.ORANGE, { tone: 0.05 });
    sph(s * 9, 1.4, -3.6, 0.8, INK.GREEN, { tone: -0.05 });
    sph(s * 9 + 0.35, 2.0, -3.7, 0.55, INK.GREEN, { tone: -0.05 });
    sph(s * 9 - 0.3, 1.9, -3.4, 0.5, INK.GREEN, { tone: -0.05 });
  }

  // lámparas colgantes
  const lamps = [];
  for (const x of [-6, 0, 6]) {
    const g = new THREE.Group();
    g.position.set(x, 8.6, -1.2);
    const cord = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
    cord.scale.set(0.03, 1.4, 0.03);
    cord.position.y = -0.7;
    g.add(cord);
    const shade = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { tone: 0.1 }));
    shade.scale.set(1.0, 0.6, 1.0);
    shade.position.y = -1.6;
    g.add(shade);
    root.add(g);
    lamps.push(g);
  }

  // público: compañeros de oficina animando desde el fondo
  const crowd = [];
  const inks = [INK.BLUE, INK.PURPLE, INK.GREEN, INK.RED, INK.ORANGE, INK.BLACK];
  for (let i = 0; i < 14; i++) {
    const x = -10 + i * 1.55 + (i % 2) * 0.3;
    if (Math.abs(x) < 3.2) continue; // deja ver la pizarra
    const g = new THREE.Group();
    g.position.set(x, 0, -4.4 + (i % 2) * 0.5);
    const ink = inks[i % inks.length];
    const body = new THREE.Mesh(GEO.cyl, mat(ink, { tone: 0.05 }));
    body.scale.set(0.8, 1.3, 0.6);
    body.position.y = 0.65;
    g.add(body);
    const head = new THREE.Mesh(GEO.sph, mat(ink, { tone: 0.2 }));
    head.scale.setScalar(0.62);
    head.position.y = 1.62;
    g.add(head);
    const arms = [];
    for (const s of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(s * 0.42, 1.2, 0);
      const arm = new THREE.Mesh(GEO.box, mat(ink, { tone: 0 }));
      arm.scale.set(0.14, 0.7, 0.14);
      arm.position.y = 0.3;
      pivot.add(arm);
      g.add(pivot);
      arms.push({ pivot, s });
    }
    root.add(g);
    crowd.push({ g, arms, phase: Math.random() * 6, hype: 0 });
  }

  function update(dt, t, hype) {
    lamps.forEach((l, i) => (l.rotation.z = Math.sin(t * 0.8 + i) * 0.04 + hype * Math.sin(t * 9 + i) * 0.05));
    for (const c of crowd) {
      const h = Math.max(hype, 0.15);
      c.g.position.y = Math.abs(Math.sin(t * (4 + h * 6) + c.phase)) * 0.25 * h;
      c.arms.forEach((a) => (a.pivot.rotation.z = a.s * (0.4 + h * 1.8 + Math.sin(t * 10 + c.phase) * 0.4 * h)));
    }
  }

  return { root, update };
}
