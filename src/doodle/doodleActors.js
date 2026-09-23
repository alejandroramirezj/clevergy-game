// =============================================================================
// doodleActors.js — Modelos de enemigos, arma y objetos (todo primitivas)
// Los grupos miran hacia +Z: basta con group.lookAt(objetivo).
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "./doodleRender.js";
import { GEO } from "./doodleLevel.js";

function part(geo, ink, o, sx, sy, sz, x, y, z, parent) {
  const m = new THREE.Mesh(geo, mat(ink, o));
  m.scale.set(sx, sy, sz);
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

function eyes(g, y, z, spread, size, angry = true) {
  part(GEO.sph, INK.BLACK, { fill: true }, size, size, size * 0.5, -spread, y, z, g);
  part(GEO.sph, INK.BLACK, { fill: true }, size, size, size * 0.5, spread, y, z, g);
  if (angry) {
    const b1 = part(GEO.box, INK.BLACK, { fill: true }, size * 1.6, size * 0.28, 0.02, -spread, y + size * 0.85, z, g);
    const b2 = part(GEO.box, INK.BLACK, { fill: true }, size * 1.6, size * 0.28, 0.02, spread, y + size * 0.85, z, g);
    b1.rotation.z = -0.45;
    b2.rotation.z = 0.45;
  }
}

// ✉️ Email urgente: sobre volador con alas de papel
export function makeEmail() {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  part(GEO.box, INK.RED, { tone: 0.05 }, 1.0, 0.66, 0.14, 0, 0, 0, body);
  const f1 = part(GEO.box, INK.RED, { fill: true }, 0.62, 0.04, 0.02, -0.25, 0.12, 0.08, body);
  const f2 = part(GEO.box, INK.RED, { fill: true }, 0.62, 0.04, 0.02, 0.25, 0.12, 0.08, body);
  f1.rotation.z = -0.6;
  f2.rotation.z = 0.6;
  eyes(body, -0.1, 0.08, 0.17, 0.12);
  part(GEO.box, INK.RED, { fill: true }, 0.12, 0.2, 0.03, 0.42, 0.35, 0.02, body); // "!"
  const wings = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.5, 0.05, 0);
    body.add(pivot);
    part(GEO.box, INK.BLACK, { tone: 0.35 }, 0.55, 0.02, 0.32, s * 0.28, 0, 0, pivot);
    wings.push({ pivot, s });
  }
  return { group: g, body, wings };
}

// 📅 Invitación de calendario: bloque andante que dispara invites
export function makeMeeting() {
  const g = new THREE.Group();
  const body = new THREE.Group();
  body.position.y = 0.55;
  g.add(body);
  part(GEO.box, INK.PURPLE, { tone: 0.1 }, 1.2, 1.2, 0.4, 0, 0.6, 0, body);
  part(GEO.box, INK.PURPLE, { fill: true }, 1.22, 0.28, 0.42, 0, 1.08, 0, body);
  for (const x of [-0.3, 0.3]) {
    const ring = part(GEO.torus, INK.BLACK, { tone: -0.1 }, 0.22, 0.22, 0.22, x, 1.28, 0, body);
    ring.rotation.y = Math.PI / 2;
  }
  for (const x of [-0.2, 0.2]) part(GEO.box, INK.PURPLE, { fill: true }, 0.02, 0.75, 0.02, x, 0.46, 0.21, body);
  for (const y of [0.3, 0.62]) part(GEO.box, INK.PURPLE, { fill: true }, 1.0, 0.02, 0.02, 0, y, 0.21, body);
  eyes(body, 0.62, 0.22, 0.26, 0.16);
  const legs = [];
  for (const s of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.3, 0.55, 0);
    g.add(pivot);
    part(GEO.box, INK.BLACK, { tone: 0 }, 0.14, 0.55, 0.14, 0, -0.27, 0, pivot);
    part(GEO.box, INK.BLACK, { fill: true }, 0.2, 0.08, 0.3, 0, -0.52, 0.06, pivot);
    legs.push({ pivot, s });
  }
  return { group: g, body, legs };
}

// ⏰ "¿Tienes 5 minutos?": despertador que embiste
export function makeClock() {
  const g = new THREE.Group();
  const body = new THREE.Group();
  body.position.y = 1.05;
  g.add(body);
  const face = part(GEO.cyl, INK.ORANGE, { tone: 0.1 }, 1.2, 0.3, 1.2, 0, 0, 0, body);
  face.rotation.x = Math.PI / 2;
  const rim = part(GEO.torus, INK.ORANGE, { tone: -0.15 }, 1.05, 1.05, 1.6, 0, 0, 0.02, body);
  rim.rotation.z = 0;
  const hand1 = part(GEO.box, INK.BLACK, { fill: true }, 0.05, 0.42, 0.02, 0, 0.18, 0.17, body);
  const hand2 = part(GEO.box, INK.BLACK, { fill: true }, 0.04, 0.3, 0.02, 0.12, 0.08, 0.17, body);
  hand2.rotation.z = -1.1;
  for (const s of [-1, 1]) {
    part(GEO.sph, INK.ORANGE, { tone: -0.1 }, 0.36, 0.36, 0.36, s * 0.42, 0.62, 0, body);
    part(GEO.box, INK.BLACK, { tone: 0 }, 0.1, 0.5, 0.1, s * 0.3, -0.72, 0, body);
  }
  eyes(body, 0.02, 0.18, 0.22, 0.13);
  return { group: g, body, hand1, hand2 };
}

// 📨 JEFE: INBOX INFINITO — torre de sobres
export function makeBoss() {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  const layers = [];
  for (let i = 0; i < 6; i++) {
    const w = 3.4 - i * 0.18;
    const l = part(GEO.box, i % 2 ? INK.BLACK : INK.RED, { tone: i % 2 ? 0.25 : 0.05 }, w, 0.8, 2.3 - i * 0.1, 0, 0.45 + i * 0.85, 0, body);
    l.rotation.y = (i % 2 ? 0.12 : -0.1);
    layers.push(l);
  }
  const top = new THREE.Group();
  top.position.y = 5.4;
  body.add(top);
  part(GEO.box, INK.RED, { tone: 0 }, 3.0, 1.8, 0.3, 0, 0.9, 0, top);
  const f1 = part(GEO.box, INK.RED, { fill: true }, 1.9, 0.08, 0.04, -0.72, 1.2, 0.17, top);
  const f2 = part(GEO.box, INK.RED, { fill: true }, 1.9, 0.08, 0.04, 0.72, 1.2, 0.17, top);
  f1.rotation.z = -0.55;
  f2.rotation.z = 0.55;
  eyes(top, 0.7, 0.18, 0.55, 0.36);
  // corona de "9999+"
  for (let i = -2; i <= 2; i++) part(GEO.cone, INK.ORANGE, { fill: true }, 0.35, 0.6, 0.35, i * 0.55, 2.1, 0, top);
  return { group: g, body, layers, top };
}

// ✏️ El arma: un boli Bic gigante que va con la cámara
export function makeGun() {
  const g = new THREE.Group();
  const barrel = part(GEO.cyl, INK.BLUE, { tone: 0.05 }, 0.075, 0.55, 0.075, 0, 0, 0, g);
  barrel.rotation.x = Math.PI / 2;
  const tip = part(GEO.cone, INK.BLACK, { tone: 0.2 }, 0.075, 0.12, 0.075, 0, 0, -0.335, g);
  tip.rotation.x = -Math.PI / 2;
  const cap = part(GEO.cyl, INK.BLUE, { fill: true }, 0.085, 0.1, 0.085, 0, 0, 0.3, g);
  cap.rotation.x = Math.PI / 2;
  part(GEO.box, INK.BLUE, { fill: true }, 0.02, 0.02, 0.22, 0, 0.05, 0.18, g); // clip
  const muzzle = new THREE.Object3D();
  muzzle.position.set(0, 0, -0.42);
  g.add(muzzle);
  const flash = part(GEO.sph, INK.ORANGE, { fill: true }, 0.12, 0.12, 0.18, 0, 0, -0.46, g);
  flash.visible = false;
  return { group: g, muzzle, flash };
}

// ☕ Café: recupera vida
export function makeCoffee() {
  const g = new THREE.Group();
  part(GEO.cyl, INK.GREEN, { tone: 0.05 }, 0.34, 0.42, 0.34, 0, 0.21, 0, g);
  part(GEO.cyl, INK.BLACK, { fill: true }, 0.3, 0.02, 0.3, 0, 0.42, 0, g);
  const handle = part(GEO.torus, INK.GREEN, { tone: 0 }, 0.18, 0.18, 0.18, 0.2, 0.22, 0, g);
  handle.rotation.y = 0;
  for (let i = 0; i < 2; i++) part(GEO.box, INK.BLACK, { fill: true }, 0.02, 0.22, 0.02, -0.06 + i * 0.12, 0.62, 0, g);
  return { group: g };
}
