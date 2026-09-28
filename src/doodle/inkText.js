// =============================================================================
// inkText.js — Letras y logos "a tinta" en 3D para el render de boli
// El shader de boli ignora texturas, así que los carteles se construyen con
// trazos (cajitas finas de tinta sólida) sobre una rejilla de 4×6 por letra.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "./doodleRender.js";
import { GEO } from "./doodleLevel.js";

const P = (s) => s.split(" ").map((seg) => seg.split(",").map(Number));
const F = {
  A: P("0,0,0,4 0,4,2,6 2,6,4,4 4,4,4,0 0,3,4,3"),
  B: P("0,0,0,6 0,6,3,6 3,6,4,5 4,5,3,3 0,3,3,3 3,3,4,2 4,2,4,1 4,1,3,0 3,0,0,0"),
  C: P("4,6,1,6 1,6,0,5 0,5,0,1 0,1,1,0 1,0,4,0"),
  D: P("0,0,0,6 0,6,2.5,6 2.5,6,4,4.5 4,4.5,4,1.5 4,1.5,2.5,0 2.5,0,0,0"),
  E: P("4,6,0,6 0,6,0,0 0,0,4,0 0,3,3,3"),
  G: P("4,5,3,6 3,6,1,6 1,6,0,5 0,5,0,1 0,1,1,0 1,0,3,0 3,0,4,1 4,1,4,3 4,3,2,3"),
  H: P("0,0,0,6 4,0,4,6 0,3,4,3"),
  I: P("2,0,2,6 1,6,3,6 1,0,3,0"),
  K: P("0,0,0,6 4,6,0,2.5 1.4,3.8,4,0"),
  L: P("0,6,0,0 0,0,4,0"),
  M: P("0,0,0,6 0,6,2,3 2,3,4,6 4,6,4,0"),
  N: P("0,0,0,6 0,6,4,0 4,0,4,6"),
  O: P("1,0,3,0 3,0,4,1 4,1,4,5 4,5,3,6 3,6,1,6 1,6,0,5 0,5,0,1 0,1,1,0"),
  P: P("0,0,0,6 0,6,3,6 3,6,4,5 4,5,4,4 4,4,3,3 3,3,0,3"),
  R: P("0,0,0,6 0,6,3,6 3,6,4,5 4,5,4,4 4,4,3,3 3,3,0,3 2,3,4,0"),
  S: P("4,5,3,6 3,6,1,6 1,6,0,5 0,5,0,4 0,4,1,3 1,3,3,3 3,3,4,2 4,2,4,1 4,1,3,0 3,0,1,0 1,0,0,1"),
  T: P("0,6,4,6 2,6,2,0"),
  U: P("0,6,0,1 0,1,1,0 1,0,3,0 3,0,4,1 4,1,4,6"),
  V: P("0,6,2,0 2,0,4,6"),
  W: P("0,6,1,0 1,0,2,3 2,3,3,0 3,0,4,6"),
  Y: P("0,6,2,3 4,6,2,3 2,3,2,0"),
  1: P("1,5,2,6 2,6,2,0 1,0,3,0"),
  2: P("0,5,1,6 1,6,3,6 3,6,4,5 4,5,4,4 4,4,0,0 0,0,4,0"),
  3: P("0,6,4,6 4,6,2,3.5 2,3.5,3,3.5 3,3.5,4,2.5 4,2.5,4,1 4,1,3,0 3,0,0,0"),
  4: P("3,0,3,6 3,6,0,2 0,2,4,2"),
  "#": P("1,0,1.8,6 2.6,0,3.4,6 0,2,4,2 0,4,4,4")
};

function strokes(g, segs, u, ox, oy, ink, thick) {
  for (const [x1, y1, x2, y2] of segs) {
    const dx = (x2 - x1) * u, dy = (y2 - y1) * u, len = Math.hypot(dx, dy);
    const m = new THREE.Mesh(GEO.box, mat(ink, { fill: true }));
    m.scale.set(len + thick, thick, 0.05);
    m.position.set(ox + x1 * u + dx / 2, oy + y1 * u + dy / 2, 0);
    m.rotation.z = Math.atan2(dy, dx);
    g.add(m);
  }
}

/** Texto a tinta en el plano XY local (mira hacia +Z), centrado. `size` = alto en metros. */
export function inkText(text, { size = 0.5, ink = INK.BLACK, weight = 0.9 } = {}) {
  const g = new THREE.Group();
  const u = size / 6, adv = 5.6 * u, thick = u * weight;
  const chars = String(text).toUpperCase().split("");
  const width = chars.length * adv - 1.6 * u;
  chars.forEach((ch, i) => { if (F[ch]) strokes(g, F[ch], u, -width / 2 + i * adv, -size / 2, ink, thick); });
  g.userData.width = width;
  return g;
}

/** El logotipo de CINK: el rombo de trazo doble que se abre como una "C", y el texto. */
export function cinkLogo({ size = 1, ink = INK.BLACK, withText = true } = {}) {
  const g = new THREE.Group();
  const u = size / 10, thick = u * 1.25;
  const mark = new THREE.Group();
  // contorno exterior (hexágono abierto a la derecha) e interior entrelazado
  strokes(mark, P("9,7.5,6,10 6,10,1,6.2 1,6.2,1,3.8 1,3.8,6,0 6,0,9,2.5"), u, 0, 0, ink, thick);
  strokes(mark, P("6,7.5,3.4,5.6 3.4,5.6,3.4,4.4 3.4,4.4,6,2.5 6,2.5,8.6,4.4 8.6,4.4,8.6,5.6 8.6,5.6,6.6,7"), u, 0, 0, ink, thick);
  strokes(mark, P("6.6,7,5.4,5.5 5.4,5.5,6.6,4.6"), u, 0, 0, ink, thick);
  mark.position.set(-size * (withText ? 1.25 : 0.5), -size / 2, 0);
  g.add(mark);
  if (withText) {
    const t = inkText("CINK", { size: size * 0.62, ink, weight: 1.15 });
    t.position.set(size * 0.65, size * 0.12, 0);
    g.add(t);
    const t2 = inkText("COWORKING", { size: size * 0.2, ink, weight: 1.1 });
    t2.position.set(size * 0.65, -size * 0.36, 0);
    g.add(t2);
  }
  return g;
}
