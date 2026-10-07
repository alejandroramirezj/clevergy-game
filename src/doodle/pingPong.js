// =============================================================================
// pingPong.js — El segundo poder de Yair: saca la pala y lanza pelotas de ping-pong
// (alterna con las bulerías). Cada saque viene con una batallita de sus torneos.
// =============================================================================

import * as THREE from "three";

export { YAIR_LINES, nextYairLine } from "../config/yairLines.js";

/**
 * Pala de ping-pong con sus colores de verdad (va en la escena overlay, con las pegatinas):
 * goma roja, canto negro y mango de madera. El origen está en el mango (la mano).
 */
export function makePaddle(scale = 1) {
  const g = new THREE.Group();
  const m = (color) => new THREE.MeshBasicMaterial({ color, depthTest: false, depthWrite: false, transparent: true });
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.27, 28), m(0xd7263d));
  face.position.set(0, 0.36, 0.01);
  const rim = new THREE.Mesh(new THREE.CircleGeometry(0.3, 28), m(0x22242e));
  rim.position.set(0, 0.36, 0);
  const handle = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.3), m(0xc8955a));
  handle.position.set(0, 0.06, 0.005);
  const grip = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.08), m(0x22242e));
  grip.position.set(0, -0.06, 0.006);
  g.add(rim, face, handle, grip);
  g.traverse((o) => { if (o.isMesh) o.renderOrder = 20; }); // por delante del personaje
  g.scale.setScalar(scale);
  return g;
}
