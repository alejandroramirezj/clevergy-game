// =============================================================================
// fightStage.js — COWORKING FIGHT: la azotea del CINK flotando sobre la calle
// Escenario estilo "Battlefield": una terraza principal con bordes de los que te
// agarras y tres plataformas atravesables (bancos de madera colgados). Si sales
// despedido más allá de las zonas límite, pierdes una vida.
// Al fondo, la fachada del CINK con su logo y las Cuatro Torres de la Castellana.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "../doodleRender.js";
import { GEO } from "../doodleLevel.js";
import { cinkLogo, inkText } from "../inkText.js";

export const FIGHT_Z = 0.4; // profundidad del plano de lucha
// la terraza principal (sólida: no se atraviesa desde abajo)
export const MAIN = { x0: -8, x1: 8, y: 0, depth: 2.6 };
export const STAGE_HALF = MAIN.x1;
// plataformas de un solo sentido (se atraviesan desde abajo y con ▼)
export const PLATFORMS = [
  { x0: -6.2, x1: -2.6, y: 2.5 },
  { x0: 2.6, x1: 6.2, y: 2.5 },
  { x0: -1.8, x1: 1.8, y: 4.9 }
];
// zonas límite: más allá, K.O.
export const BLAST = { x: 17, bottom: -8.5, top: 15 };
// sitio de reaparición (flotando sobre la plataforma de arriba)
export const RESPAWN = { x: 0, y: 8 };

export function buildFightStage(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const box = (x, y0, z, w, h, d, ink, o = {}, parent = root) => {
    const m = new THREE.Mesh(GEO.box, mat(ink, o));
    m.scale.set(w, h, d);
    m.position.set(x, y0 + h / 2, z);
    parent.add(m);
    return m;
  };
  const cyl = (x, y0, z, r, h, ink, o = {}, parent = root) => {
    const m = new THREE.Mesh(GEO.cyl, mat(ink, o));
    m.scale.set(r * 2, h, r * 2);
    m.position.set(x, y0 + h / 2, z);
    parent.add(m);
    return m;
  };
  const sph = (x, y, z, r, ink, o = {}, parent = root) => {
    const m = new THREE.Mesh(GEO.sph, mat(ink, o));
    m.scale.setScalar(r * 2);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  // ── la terraza principal: suelo de césped, canto de madera y el forjado debajo ──
  const W = MAIN.x1 - MAIN.x0;
  box(0, -MAIN.depth, FIGHT_Z - 0.4, W, MAIN.depth, 3.6, INK.BLACK, { tone: 0.12 }); // forjado
  box(0, -0.14, FIGHT_Z - 0.4, W + 0.3, 0.14, 3.8, INK.GREEN, { tone: -0.1 }); // césped
  for (let x = MAIN.x0 + 0.5; x < MAIN.x1; x += 1.1) box(x, 0, FIGHT_Z + 1.3, 0.05, 0.18, 0.05, INK.GREEN, { fill: true }); // briznas
  box(0, -0.5, FIGHT_Z + 1.46, W + 0.3, 0.36, 0.1, INK.ORANGE, { tone: 0.05 }); // canto de madera
  for (const s of [-1, 1]) {
    box(s * (W / 2 + 0.05), -MAIN.depth, FIGHT_Z - 0.4, 0.3, MAIN.depth + 0.02, 3.8, INK.ORANGE, { tone: -0.05 }); // bordes (de ahí te cuelgas)
    box(s * (W / 2 - 1.2), -MAIN.depth - 0.8, FIGHT_Z - 0.4, 0.5, 0.8, 0.5, INK.BLACK, { tone: 0.2 }); // ménsulas
  }
  // tumbonas y macetas de la terraza (decoración, al fondo del plano de lucha)
  for (const x of [-5.6, 5.6]) {
    cyl(x, 0, -1.3, 0.45, 0.7, INK.ORANGE, { tone: 0.05 });
    sph(x, 1.2, -1.3, 0.7, INK.GREEN, { tone: -0.05 });
    sph(x + 0.35, 1.7, -1.4, 0.45, INK.GREEN, { tone: -0.05 });
  }
  box(-2.4, 0, -1.4, 2.2, 0.35, 0.9, INK.BLUE, { tone: 0.1 });
  box(-3.3, 0.35, -1.4, 0.35, 0.55, 0.9, INK.BLUE, { tone: 0.05 });
  box(2.6, 0, -1.4, 1.2, 0.8, 1.2, INK.ORANGE, { tone: 0.2 }); // mesa de chiringuito
  cyl(2.6, 0.8, -1.4, 0.06, 1.6, INK.BLACK, { fill: true });
  const umb = new THREE.Mesh(GEO.cone, mat(INK.RED, { tone: 0.05 })); umb.scale.set(2.2, 0.7, 2.2); umb.position.set(2.6, 2.6, -1.4); root.add(umb);

  // ── plataformas: bancos de madera colgados de cuerdas ──
  for (const p of PLATFORMS) {
    const w = p.x1 - p.x0, cx = (p.x0 + p.x1) / 2;
    box(cx, p.y - 0.28, FIGHT_Z - 0.2, w, 0.28, 1.8, INK.ORANGE, { tone: 0.02 });
    for (let k = 0; k < Math.floor(w / 0.9); k++) box(p.x0 + 0.45 + k * 0.9, p.y - 0.28, FIGHT_Z + 0.71, 0.05, 0.28, 0.02, INK.ORANGE, { fill: true });
    for (const s of [-1, 1]) box(cx + s * (w / 2 - 0.2), p.y, FIGHT_Z - 0.9, 0.04, 6, 0.04, INK.BLACK, { fill: true }); // cuerdas
  }

  // ── fondo: la fachada del CINK con su esquina redonda y el logo ──
  const bg = new THREE.Group();
  bg.position.z = -9;
  root.add(bg);
  box(-8, -14, 0, 22, 26, 1, INK.BLACK, { tone: 0.42 }, bg); // fachada
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) box(-17 + c * 3.4, -12 + r * 4.6, 0.52, 2.2, 2.8, 0.05, INK.BLUE, { tone: 0.3 }, bg);
  cyl(3.6, -14, 0, 4.2, 25, INK.BLACK, { tone: 0.38 }, bg); // la esquina redonda
  for (let r = 0; r < 5; r++) box(3.6, -12 + r * 4.6, 4.1, 5.4, 2.8, 0.05, INK.BLUE, { tone: 0.3 }, bg);
  const logo = cinkLogo({ size: 2.2, ink: INK.BLACK });
  logo.position.set(-8, 8.6, 0.6);
  bg.add(logo);
  const sub = inkText("INFANTA MERCEDES", { size: 0.55, ink: INK.BLACK });
  sub.position.set(-6.4, 7, 0.6);
  bg.add(sub);

  // ── más lejos: las Cuatro Torres, tejados y el cielo de Madrid ──
  const far = new THREE.Group();
  far.position.z = -40;
  root.add(far);
  const towers = [[18, 44, 6], [26, 50, 6.5], [34, 46, 6], [42, 40, 7]];
  for (const [x, h, w] of towers) {
    box(x, -10, 0, w, h, w, INK.BLUE, { tone: 0.34 }, far);
    for (let y = -6; y < h - 12; y += 3) box(x, y, w / 2 + 0.02, w, 0.12, 0.05, INK.BLUE, { fill: true }, far);
  }
  box(26, 40, 0, 1.2, 4, 1.2, INK.BLACK, { tone: 0.3 }, far); // antena
  for (let x = -60; x < 12; x += 5.5 + (Math.abs(x) % 3)) {
    const h = 8 + (Math.abs(x * 7) % 11);
    box(x, -10, 0, 5, h, 4, INK.BLACK, { tone: 0.45 }, far);
    box(x, -10 + h, 0, 5.4, 1, 4.4, INK.RED, { tone: 0.35 }, far);
  }
  // nubes
  const clouds = [];
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Group();
    g.position.set(-50 + i * 20, 20 + (i % 3) * 5, -30);
    for (let k = 0; k < 3; k++) sph(k * 2.2 - 2.2, (k % 2) * 0.8, 0, 1.6 + (k % 2), INK.BLUE, { tone: 0.5 }, g);
    root.add(g);
    clouds.push(g);
  }

  // ── la calle, muy abajo: si caes, caes aquí ──
  box(0, -15, -4, 70, 0.4, 20, INK.BLACK, { tone: 0.35 });
  for (let x = -30; x < 30; x += 4) box(x, -14.58, 2, 2, 0.02, 0.3, INK.BLACK, { fill: true });
  const cars = [];
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    g.position.set(-20 + i * 16, -14.6, 1 - i * 2);
    box(0, 0.3, 0, 3, 0.9, 1.5, [INK.RED, INK.BLUE, INK.ORANGE][i], { tone: 0.05 }, g);
    box(-0.2, 1.2, 0, 1.6, 0.6, 1.4, INK.BLUE, { tone: 0.3 }, g);
    root.add(g);
    cars.push({ g, v: 3 + i * 1.5 });
  }

  // ── público: compañeros animando en la terraza de al lado ──
  const crowd = [];
  const inks = [INK.BLUE, INK.PURPLE, INK.GREEN, INK.RED, INK.ORANGE, INK.BLACK];
  for (let i = 0; i < 12; i++) {
    const x = -13 + i * 2.3;
    const g = new THREE.Group();
    g.position.set(x, -0.4, -4.6 + (i % 2) * 0.5);
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
    crowd.push({ g, arms, phase: Math.random() * 6 });
  }
  box(0, -0.6, -4.2, 32, 0.25, 2.4, INK.BLACK, { tone: 0.3 }); // la terraza vecina
  for (let x = -15; x <= 15; x += 1.5) box(x, -0.35, -3.1, 0.06, 1.1, 0.06, INK.BLACK, { fill: true }); // barandilla
  box(0, 0.7, -3.1, 32, 0.07, 0.07, INK.BLACK, { fill: true });

  function update(dt, t, hype) {
    clouds.forEach((c, i) => { c.position.x += dt * (0.4 + i * 0.1); if (c.position.x > 70) c.position.x = -70; });
    cars.forEach((c) => { c.g.position.x += c.v * dt; if (c.g.position.x > 36) c.g.position.x = -36; });
    for (const c of crowd) {
      const h = Math.max(hype, 0.15);
      c.g.position.y = -0.4 + Math.abs(Math.sin(t * (4 + h * 6) + c.phase)) * 0.25 * h;
      c.arms.forEach((a) => (a.pivot.rotation.z = a.s * (0.4 + h * 1.8 + Math.sin(t * 10 + c.phase) * 0.4 * h)));
    }
  }

  return { root, update };
}
