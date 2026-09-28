// =============================================================================
// doodleLevel.js — Geometrías compartidas por todos los mundos a boli
// (se reutilizan escaladas: una sola caja, cilindro, esfera… para todo el juego)
// =============================================================================

import * as THREE from "three";

export const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 14),
  sph: new THREE.SphereGeometry(0.5, 14, 10),
  cone: new THREE.ConeGeometry(0.5, 1, 12),
  torus: new THREE.TorusGeometry(0.5, 0.12, 8, 18),
  disc: new THREE.CircleGeometry(0.5, 14)
};
