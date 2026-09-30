// =============================================================================
// raceTrack.js — El circuito acuático del Pantano de San Juan (Madrid)
// Trazado cerrado sobre el agua marcado con boyas, y alrededor el paisaje del
// pantano: orillas de granito con pinares, la presa, la playa de la Virgen de la
// Nueva con sombrillas y chiringuito, un embarcadero, veleros e islotes.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "../doodleRender.js";
import { GEO } from "../doodleLevel.js";
import { inkText } from "../inkText.js";

export const TRACK_HALF = 13; // media anchura del canal entre boyas (m)
export const N_SAMPLES = 900;

// trazado (x, z) en metros: una vuelta por el embalse
const CTRL = [
  [0, 0], [110, -18], [205, -80], [238, -185], [178, -282], [62, -300], [-32, -250], [-52, -160],
  [-138, -118], [-232, -160], [-300, -92], [-268, 30], [-158, 74], [-62, 44]
];

// ruido determinista para colocar el paisaje siempre igual (y igual en todos los móviles)
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// altura de las olas: la usan el agua y las motos para cabecear
export function waveH(x, z, t) {
  return 0.3 * Math.sin(0.33 * x + 1.3 * t) * Math.cos(0.29 * z + 1.05 * t) + 0.12 * Math.sin(0.75 * (x + z) + 2.1 * t);
}

export function buildTrack() {
  // Catmull-Rom cerrada → polilínea densa → remuestreo a distancia constante
  const raw = [];
  const n = CTRL.length;
  for (let i = 0; i < n; i++) {
    const p0 = CTRL[(i - 1 + n) % n], p1 = CTRL[i], p2 = CTRL[(i + 1) % n], p3 = CTRL[(i + 2) % n];
    for (let k = 0; k < 40; k++) {
      const t = k / 40, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      raw.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  const cum = [0];
  for (let i = 1; i <= raw.length; i++) {
    const a = raw[i - 1], b = raw[i % raw.length];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const length = cum[cum.length - 1];
  const pts = [];
  let j = 0;
  for (let i = 0; i < N_SAMPLES; i++) {
    const d = (i / N_SAMPLES) * length;
    while (cum[j + 1] < d) j++;
    const a = raw[j], b = raw[(j + 1) % raw.length];
    const k = (d - cum[j]) / (cum[j + 1] - cum[j] || 1);
    pts.push({ x: a[0] + (b[0] - a[0]) * k, z: a[1] + (b[1] - a[1]) * k, tx: 0, tz: 0 });
  }
  for (let i = 0; i < N_SAMPLES; i++) {
    const a = pts[(i - 1 + N_SAMPLES) % N_SAMPLES], b = pts[(i + 1) % N_SAMPLES];
    const l = Math.hypot(b.x - a.x, b.z - a.z) || 1;
    pts[i].tx = (b.x - a.x) / l;
    pts[i].tz = (b.z - a.z) / l;
  }
  const at = (i) => pts[((i % N_SAMPLES) + N_SAMPLES) % N_SAMPLES];

  // punto del trazado más cercano; con `hint` sólo busca alrededor (rápido y sin saltos)
  function nearest(x, z, hint = -1, win = 70) {
    let best = 0, bd = Infinity;
    const from = hint < 0 ? 0 : hint - win, to = hint < 0 ? N_SAMPLES : hint + win;
    for (let i = from; i < to; i++) {
      const p = at(i);
      const d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < bd) { bd = d; best = ((i % N_SAMPLES) + N_SAMPLES) % N_SAMPLES; }
    }
    const p = pts[best];
    // distancia lateral con signo: + a la derecha del sentido de marcha
    const lat = (x - p.x) * -p.tz + (z - p.z) * p.tx;
    return { i: best, lat, d: Math.sqrt(bd) };
  }

  let cx = 0, cz = 0, minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of pts) { cx += p.x; cz += p.z; minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); }
  cx /= N_SAMPLES; cz /= N_SAMPLES;
  return { pts, at, nearest, length, center: { x: cx, z: cz }, bounds: { minX, maxX, minZ, maxZ } };
}

// ── escenario ────────────────────────────────────────────────────────────────
export function buildRaceWorld(scene, track) {
  const root = new THREE.Group();
  scene.add(root);
  const R = rng(20260928);
  const r = (a, b) => a + R() * (b - a);
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3(), tmpE = new THREE.Euler();
  const add = (geo, ink, o, s, p, rot) => {
    const m = new THREE.Mesh(geo, mat(ink, o));
    m.scale.set(...s);
    m.position.set(...p);
    if (rot) m.rotation.set(...rot);
    root.add(m);
    return m;
  };
  // lote de instancias (una llamada de dibujo para muchos objetos iguales)
  function batch(geo, ink, o, list) {
    const im = new THREE.InstancedMesh(geo, mat(ink, o), list.length);
    list.forEach((it, k) => {
      tmpE.set(it.rx || 0, it.ry || 0, it.rz || 0);
      tmpQ.setFromEuler(tmpE);
      tmpM.compose(tmpP.set(it.x, it.y, it.z), tmpQ, tmpS.set(it.sx, it.sy, it.sz));
      im.setMatrixAt(k, tmpM);
    });
    im.instanceMatrix.needsUpdate = true;
    im.frustumCulled = false;
    root.add(im);
    return im;
  }
  const trackDist = (x, z) => track.nearest(x, z).d;
  const { center } = track;

  // agua lejana (plana) y agua cercana con olas que sigue a la cámara
  const farWater = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), mat(INK.BLUE, { tone: -0.3 }));
  farWater.rotation.x = -Math.PI / 2;
  farWater.position.y = -0.25;
  root.add(farWater);
  const WG = 2, WS = 400; // celdas y tamaño del parche de olas
  const wGeo = new THREE.PlaneGeometry(WS, WS, WG, WG);
  wGeo.rotateX(-Math.PI / 2);
  const wPos = wGeo.attributes.position; // normales planas: rayado uniforme (sin muaré) aunque haya olas
  const base = Float32Array.from(wPos.array);
  const water = new THREE.Mesh(wGeo, mat(INK.BLUE, { tone: -0.3 }));
  water.frustumCulled = false;
  root.add(water);
  const cell = WS / WG;
  // el agua se pinta plana (el render calcula la luz por triángulo y las olas darían un rayado a
  // cuadros): las olas se notan en motos, boyas y en los trazos "~"; y así no hay que recalcular vértices
  function updateWater(camX, camZ) {
    water.position.set(Math.round(camX / cell) * cell, 0, Math.round(camZ / cell) * cell);
  }

  // olas dibujadas a boli: trazos cortos que cabecean sobre el agua
  const strokes = [];
  for (let i = 0; i < N_SAMPLES; i += 3) {
    const p = track.at(i);
    for (let k = 0; k < 2; k++) {
      const lat = (R() - 0.5) * (TRACK_HALF * 2 + 60);
      strokes.push({ x: p.x - p.tz * lat + (R() - 0.5) * 4, z: p.z + p.tx * lat + (R() - 0.5) * 4, ph: R() * 6, ry: R() * 0.6 - 0.3 + Math.atan2(p.tx, p.tz) + Math.PI / 2, s: 1.2 + R() * 1.6 });
    }
  }
  const strokeIM = new THREE.InstancedMesh(GEO.box, mat(INK.BLUE, { fill: true }), strokes.length);
  strokeIM.frustumCulled = false;
  root.add(strokeIM);
  function updateStrokes(t) {
    strokes.forEach((w, k) => {
      const y = waveH(w.x, w.z, t) + 0.08, sc = w.s * (0.7 + 0.3 * Math.sin(t * 1.5 + w.ph));
      tmpE.set(0, w.ry, 0);
      tmpQ.setFromEuler(tmpE);
      tmpM.compose(tmpP.set(w.x, y, w.z), tmpQ, tmpS.set(sc * 1.6, 0.06, 0.14));
      strokeIM.setMatrixAt(k, tmpM);
    });
    strokeIM.instanceMatrix.needsUpdate = true;
  }

  // boyas a ambos lados del canal (rojas y naranjas alternas), con cabeceo
  const buoys = [];
  for (let i = 0; i < N_SAMPLES; i += 11) {
    const p = track.at(i);
    for (const s of [-1, 1]) {
      buoys.push({ x: p.x - p.tz * TRACK_HALF * s, z: p.z + p.tx * TRACK_HALF * s, ph: R() * 6, red: (i / 11) % 2 === 0 });
    }
  }
  const reds = buoys.filter((b) => b.red), oranges = buoys.filter((b) => !b.red);
  const redIM = new THREE.InstancedMesh(GEO.sph, mat(INK.RED, { tone: 0.05 }), reds.length);
  const orIM = new THREE.InstancedMesh(GEO.sph, mat(INK.ORANGE, { tone: 0.05 }), oranges.length);
  [redIM, orIM].forEach((im) => { im.frustumCulled = false; root.add(im); });
  function updateBuoys(t) {
    const put = (im, list) => {
      list.forEach((b, k) => {
        const y = waveH(b.x, b.z, t) + 0.25;
        tmpE.set(Math.sin(t * 1.7 + b.ph) * 0.2, 0, Math.cos(t * 1.4 + b.ph) * 0.2);
        tmpQ.setFromEuler(tmpE);
        tmpM.compose(tmpP.set(b.x, y, b.z), tmpQ, tmpS.set(1.3, 1.1, 1.3));
        im.setMatrixAt(k, tmpM);
      });
      im.instanceMatrix.needsUpdate = true;
    };
    put(redIM, reds);
    put(orIM, oranges);
  }

  // orillas: lomas de tierra y granito alrededor del embalse, con pinares
  const hills = [], pines = [], trunks = [], rocks = [];
  let damAngle = 0.05; // la presa, hacia el este
  let beachAngle = Math.PI + 0.1; // la playa, hacia el oeste
  const picnicAngle = 1.95; // el merendero y el restaurante, en la orilla norte
  const angDist = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
  function radiusAt(a) {
    // distancia desde el centro hasta el punto del trazado más lejano en esa dirección
    let best = 0;
    for (let i = 0; i < N_SAMPLES; i += 6) {
      const p = track.at(i);
      const ang = Math.atan2(p.z - center.z, p.x - center.x);
      if (angDist(ang, a) < 0.2) best = Math.max(best, Math.hypot(p.x - center.x, p.z - center.z));
    }
    return best || 200;
  }
  const colliders = [];
  for (let a = 0; a < Math.PI * 2; a += 0.085) {
    if (angDist(a, damAngle) < 0.22) continue; // hueco para la presa
    const rr = radiusAt(a) + r(50, 80);
    const x = center.x + Math.cos(a) * rr, z = center.z + Math.sin(a) * rr;
    const sx = r(45, 80), sy = r(14, 34), sz = r(45, 80);
    const beach = angDist(a, beachAngle) < 0.16;
    const picnic = angDist(a, picnicAngle) < 0.15;
    hills.push({ x, y: -sy * 0.45, z, sx, sy: beach || picnic ? sy * 0.35 : sy, sz, ry: r(0, 3), beach });
    if (!beach && !picnic) {
      for (let k = 0; k < 15; k++) {
        const ang = r(0, Math.PI * 2), d = r(0.1, 0.8);
        const px = x + Math.cos(ang) * d * sx * 0.5, pz = z + Math.sin(ang) * d * sz * 0.5;
        const hy = -sy * 0.45 + sy * 0.5 * Math.sqrt(Math.max(0, 1 - d * d));
        const h = r(6, 11);
        pines.push({ x: px, y: hy + h * 0.55, z: pz, sx: h * 0.42, sy: h, sz: h * 0.42 });
        trunks.push({ x: px, y: hy + h * 0.05, z: pz, sx: 0.6, sy: h * 0.3, sz: 0.6 });
      }
      // canchales de granito en la orilla
      for (let k = 0; k < 3; k++) {
        const s = r(3, 8);
        const back = rr - sx * 0.42;
        rocks.push({ x: center.x + Math.cos(a + r(-0.04, 0.04)) * back, y: s * 0.1, z: center.z + Math.sin(a + r(-0.04, 0.04)) * back, sx: s * r(1, 1.6), sy: s * r(0.5, 0.9), sz: s, ry: r(0, 3) });
      }
    }
  }
  // el bosque de pinos que rodea el embalse: un segundo anillo, más espeso, tierra adentro
  for (let a = 0; a < Math.PI * 2; a += 0.022) {
    if (angDist(a, damAngle) < 0.2) continue;
    const base = radiusAt(a);
    for (let k = 0; k < 3; k++) {
      const d = base + r(70, 140), aa = a + r(-0.01, 0.01);
      const px = center.x + Math.cos(aa) * d, pz = center.z + Math.sin(aa) * d, h = r(9, 16);
      pines.push({ x: px, y: h * 0.55 - 2, z: pz, sx: h * 0.4, sy: h, sz: h * 0.4 });
      trunks.push({ x: px, y: h * 0.05 - 2, z: pz, sx: 0.7, sy: h * 0.3, sz: 0.7 });
    }
  }
  // suelo del pinar (para que el bosque no flote sobre el agua lejana)
  {
    const ring = new THREE.Mesh(new THREE.RingGeometry(1, 2, 64), mat(INK.GREEN, { tone: 0.3 }));
    ring.rotation.x = -Math.PI / 2;
    const rMax = Math.max(track.bounds.maxX - track.bounds.minX, track.bounds.maxZ - track.bounds.minZ);
    ring.scale.setScalar(rMax * 0.62);
    ring.position.set(center.x, -1.6, center.z);
    root.add(ring);
  }
  batch(GEO.sph, INK.GREEN, { tone: 0.2 }, hills.filter((h) => !h.beach));
  batch(GEO.sph, INK.ORANGE, { tone: 0.32 }, hills.filter((h) => h.beach));

  // islotes de granito dentro del embalse (con colisión)
  for (let tries = 0; tries < 240 && colliders.length < 9; tries++) {
    const x = r(track.bounds.minX - 20, track.bounds.maxX + 20), z = r(track.bounds.minZ - 20, track.bounds.maxZ + 20);
    const rad = r(5, 11);
    if (trackDist(x, z) < TRACK_HALF + rad + 10) continue;
    if (Math.hypot(x - center.x, z - center.z) > radiusAt(Math.atan2(z - center.z, x - center.x)) + 10) continue;
    if (colliders.some((c) => Math.hypot(c.x - x, c.z - z) < c.r + rad + 12)) continue;
    colliders.push({ x, z, r: rad });
    rocks.push({ x, y: 0, z, sx: rad * 2, sy: rad * r(0.5, 0.9), sz: rad * 1.8, ry: r(0, 3) });
    for (let k = 0; k < Math.round(rad / 4); k++) {
      const h = r(5, 8), px = x + r(-rad, rad) * 0.4, pz = z + r(-rad, rad) * 0.4;
      pines.push({ x: px, y: rad * 0.35 + h * 0.5, z: pz, sx: h * 0.4, sy: h, sz: h * 0.4 });
      trunks.push({ x: px, y: rad * 0.3, z: pz, sx: 0.5, sy: h * 0.3, sz: 0.5 });
    }
  }
  batch(GEO.sph, INK.BLACK, { tone: 0.22 }, rocks);
  batch(GEO.cone, INK.GREEN, { tone: -0.08 }, pines);
  batch(GEO.cyl, INK.ORANGE, { tone: -0.2 }, trunks);

  // la presa de San Juan: muro curvo de hormigón con compuertas y torres
  {
    const rr = radiusAt(damAngle) + 70;
    const g = new THREE.Group();
    g.position.set(center.x + Math.cos(damAngle) * rr, 0, center.z + Math.sin(damAngle) * rr);
    g.rotation.y = -damAngle;
    root.add(g);
    for (let k = -5; k <= 5; k++) {
      const seg = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.32 }));
      const a = k * 0.07;
      seg.scale.set(9, 30, 16);
      seg.position.set(Math.cos(a) * 14 - 14, 13, Math.sin(a) * 200 * 0.66);
      seg.rotation.y = -a;
      g.add(seg);
      if (Math.abs(k) <= 2) {
        const gate = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
        gate.scale.set(0.5, 7, 6);
        gate.position.set(Math.cos(a) * 14 - 18.6, 20, Math.sin(a) * 132);
        gate.rotation.y = -a;
        g.add(gate);
      }
    }
    const top = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.1 }));
    top.scale.set(11, 1.2, 150);
    top.position.set(-1, 28.6, 0);
    g.add(top);
    for (const s of [-1, 1]) {
      const tower = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.05 }));
      tower.scale.set(12, 38, 12);
      tower.position.set(-1, 19, s * 76);
      g.add(tower);
    }
  }

  // playa de la Virgen de la Nueva: arena, sombrillas, toallas, chiringuito y socorrista
  {
    const rr = radiusAt(beachAngle) + 34;
    const bx = center.x + Math.cos(beachAngle) * rr, bz = center.z + Math.sin(beachAngle) * rr;
    const g = new THREE.Group();
    g.position.set(bx, 0, bz);
    g.rotation.y = -beachAngle + Math.PI / 2;
    root.add(g);
    const put = (geo, ink, o, s, p) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...s); m.position.set(...p); g.add(m); return m; };
    put(GEO.box, INK.ORANGE, { tone: 0.38 }, [90, 1.2, 26], [0, 0.1, -6]);
    for (let k = 0; k < 9; k++) {
      const x = -36 + k * 9 + r(-1.5, 1.5), z = -4 + r(-3, 3);
      put(GEO.cyl, INK.BLACK, { fill: true }, [0.15, 3.2, 0.15], [x, 2.3, z]);
      put(GEO.cone, k % 2 ? INK.RED : INK.BLUE, { tone: 0.1 }, [3.4, 0.9, 3.4], [x, 4.1, z]);
      put(GEO.box, k % 3 ? INK.PURPLE : INK.GREEN, { tone: 0.1 }, [1.1, 0.06, 2.1], [x + 1.4, 0.75, z + 0.6]);
    }
    // chiringuito
    put(GEO.box, INK.ORANGE, { tone: -0.05 }, [9, 3.6, 5], [30, 2.5, -14]);
    put(GEO.box, INK.RED, { tone: 0.05 }, [10.5, 0.6, 6.5], [30, 4.6, -14]);
    put(GEO.box, INK.BLACK, { fill: true }, [6, 1.2, 0.1], [30, 3.2, -11.45]);
    // torre del socorrista
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(GEO.box, INK.BLACK, {}, [0.2, 4, 0.2], [-30 + sx * 0.8, 2.7, -12 + sz * 0.8]);
    put(GEO.box, INK.RED, { tone: 0.05 }, [2.4, 1.4, 2.4], [-30, 5.4, -12]);
    // bandera azul (la única playa de Madrid que la tiene)
    put(GEO.cyl, INK.BLACK, { fill: true }, [0.2, 9, 0.2], [-22, 4.6, -10]);
    put(GEO.box, INK.BLUE, { tone: -0.05 }, [2.6, 1.6, 0.08], [-20.6, 8.2, -10]);
    // pasarela de madera hasta el agua
    put(GEO.box, INK.ORANGE, { tone: -0.12 }, [3, 0.25, 24], [8, 0.75, -4]);
    for (let k = 0; k < 8; k++) put(GEO.box, INK.ORANGE, { fill: true }, [3.1, 0.05, 0.12], [8, 0.9, -15 + k * 3]);
    // hidropedales amarrados en la orilla
    for (let k = 0; k < 4; k++) {
      const hx = -14 + k * 5;
      put(GEO.box, k % 2 ? INK.ORANGE : INK.BLUE, { tone: 0.05 }, [2.2, 0.7, 3.6], [hx, 0.2, 9]);
      put(GEO.cone, INK.GREEN, { tone: 0.2 }, [1.2, 1.6, 0.2], [hx, 1.5, 8.2]);
    }
    // cartel de la playa
    put(GEO.box, INK.ORANGE, { tone: 0.1 }, [0.3, 5, 0.3], [0, 2.5, -18]);
    const sign = inkText("VIRGEN DE LA NUEVA", { size: 1.1, ink: INK.BLUE });
    sign.position.set(0, 5.8, -17.8);
    g.add(sign);
    put(GEO.box, INK.BLACK, { tone: 0.55 }, [sign.userData.width + 1.4, 1.8, 0.2], [0, 5.8, -18.05]);
    // pinos dando sombra detrás de la arena
    for (let k = 0; k < 12; k++) {
      const px = -44 + k * 8 + r(-2, 2), h = r(9, 13);
      put(GEO.cone, INK.GREEN, { tone: -0.08 }, [h * 0.42, h, h * 0.42], [px, h * 0.6 + 1, -26 + r(-3, 3)]);
      put(GEO.cyl, INK.ORANGE, { tone: -0.2 }, [0.6, h * 0.3, 0.6], [px, 1.2, -26]);
    }
  }

  // merendero del pantano: mesas de madera, barbacoas con humo, familias y un restaurante con terraza
  const smoke = [];
  {
    const rr = radiusAt(picnicAngle) + 36;
    const g = new THREE.Group();
    g.position.set(center.x + Math.cos(picnicAngle) * rr, 0, center.z + Math.sin(picnicAngle) * rr);
    g.rotation.y = -picnicAngle + Math.PI / 2;
    root.add(g);
    const put = (geo, ink, o, sc, p, ry) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...sc); m.position.set(...p); if (ry) m.rotation.y = ry; g.add(m); return m; };
    put(GEO.box, INK.GREEN, { tone: 0.12 }, [110, 1.4, 40], [0, 0.2, -8]); // la pradera
    put(GEO.box, INK.ORANGE, { tone: 0.3 }, [110, 0.6, 6], [0, 0.4, 13]); // orilla de arena
    const WOOD = INK.ORANGE;
    for (let k = 0; k < 8; k++) {
      const tx = -42 + (k % 4) * 13 + r(-1, 1), tz = k < 4 ? -2 : -14;
      put(GEO.box, WOOD, { tone: -0.1 }, [4, 0.25, 1.6], [tx, 1.9, tz]);
      for (const s of [-1, 1]) {
        put(GEO.box, WOOD, { tone: -0.15 }, [4, 0.2, 0.5], [tx, 1.3, tz + s * 1.3]);
        put(GEO.box, INK.BLACK, { fill: true }, [0.15, 1.2, 1.8], [tx + s * 1.6, 1.3, tz]);
      }
      // mantel de cuadros y familias
      put(GEO.box, k % 2 ? INK.RED : INK.BLUE, { tone: 0.35 }, [2.2, 0.05, 1.2], [tx, 2.05, tz]);
      if (k % 2 === 0) for (const s of [-1, 1]) {
        const ink = [INK.RED, INK.BLUE, INK.PURPLE, INK.GREEN][(k + (s > 0 ? 1 : 0)) % 4];
        put(GEO.cyl, ink, { tone: 0.1 }, [0.8, 1.3, 0.6], [tx + r(-1, 1), 2.1, tz + s * 1.35]);
        put(GEO.sph, INK.ORANGE, { tone: 0.45 }, [0.6, 0.6, 0.6], [tx + r(-1, 1), 3.05, tz + s * 1.35]);
      }
    }
    // barbacoas de ladrillo con su humo
    for (const bx of [-50, 6]) {
      put(GEO.box, INK.RED, { tone: 0.1 }, [2.2, 1.6, 1.4], [bx, 1.6, -22]);
      put(GEO.box, INK.BLACK, { fill: true }, [2, 0.1, 1.2], [bx, 2.45, -22]);
      put(GEO.box, INK.RED, { tone: 0.05 }, [0.6, 3, 0.6], [bx + 0.7, 3.5, -22.5]);
      for (let k = 0; k < 5; k++) {
        const puff = put(GEO.sph, INK.BLACK, { tone: 0.55 }, [1, 1, 1], [bx + 0.7, 5 + k, -22.5]);
        smoke.push({ m: puff, g, ph: k / 5, x: bx + 0.7, z: -22.5 });
      }
    }
    // el restaurante con terraza y sombrillas
    put(GEO.box, INK.ORANGE, { tone: 0.2 }, [22, 7, 10], [36, 4, -20]);
    put(GEO.box, INK.RED, { tone: 0 }, [24, 0.8, 12], [36, 7.9, -20]);
    for (let k = 0; k < 4; k++) put(GEO.box, INK.BLUE, { tone: 0.3 }, [3.2, 2.6, 0.1], [28 + k * 5.4, 4.2, -14.95]);
    put(GEO.box, INK.ORANGE, { tone: -0.1 }, [26, 0.4, 12], [36, 1.1, -6]); // tarima de la terraza
    for (let k = 0; k < 4; k++) {
      const ux = 27 + k * 6;
      put(GEO.cyl, INK.BLACK, { fill: true }, [0.15, 3.5, 0.15], [ux, 3, -6]);
      put(GEO.cone, k % 2 ? INK.GREEN : INK.RED, { tone: 0.15 }, [4, 1, 4], [ux, 5, -6]);
      put(GEO.cyl, INK.BLACK, { tone: 0.5 }, [1.6, 0.15, 1.6], [ux, 2.1, -6]);
    }
    const rest = inkText("RESTAURANTE", { size: 1.2, ink: INK.BLACK });
    rest.position.set(36, 9.8, -14.8);
    g.add(rest);
    const mer = inkText("MERENDERO", { size: 1.1, ink: INK.GREEN });
    put(GEO.box, INK.ORANGE, { tone: 0.1 }, [0.3, 4.5, 0.3], [-20, 2.4, 6]);
    put(GEO.box, INK.BLACK, { tone: 0.55 }, [mer.userData.width + 1.2, 1.7, 0.2], [-20, 5.3, 6]);
    mer.position.set(-20, 5.3, 6.15);
    g.add(mer);
    // coches aparcados bajo los pinos
    for (let k = 0; k < 6; k++) {
      const cx = -46 + k * 6.5, ink = [INK.RED, INK.BLUE, INK.BLACK, INK.ORANGE, INK.GREEN, INK.PURPLE][k];
      put(GEO.box, ink, { tone: 0.1 }, [2.2, 1.2, 4.2], [cx, 1.5, -32]);
      put(GEO.box, INK.BLUE, { tone: 0.35 }, [2, 0.9, 2.2], [cx, 2.5, -32.4]);
    }
    for (let k = 0; k < 14; k++) {
      const px = -52 + k * 8 + r(-2, 2), pz = -36 + r(-4, 4), h = r(10, 15);
      put(GEO.cone, INK.GREEN, { tone: -0.08 }, [h * 0.42, h, h * 0.42], [px, h * 0.6 + 1, pz]);
      put(GEO.cyl, INK.ORANGE, { tone: -0.2 }, [0.6, h * 0.3, 0.6], [px, 1.2, pz]);
    }
  }

  // embarcadero junto a la salida, con barcas amarradas
  {
    const p = track.at(N_SAMPLES - 40);
    const nx = -p.tz, nz = p.tx; // lateral
    const g = new THREE.Group();
    const side = TRACK_HALF + 16;
    g.position.set(p.x + nx * side, 0, p.z + nz * side);
    g.rotation.y = Math.atan2(p.tx, p.tz);
    root.add(g);
    const put = (geo, ink, o, s, pp, ry) => { const m = new THREE.Mesh(geo, mat(ink, o)); m.scale.set(...s); m.position.set(...pp); if (ry) m.rotation.y = ry; g.add(m); return m; };
    put(GEO.box, INK.ORANGE, { tone: -0.08 }, [40, 0.5, 4], [0, 0.9, 0]);
    for (let k = -4; k <= 4; k++) put(GEO.cyl, INK.BLACK, {}, [0.5, 2.6, 0.5], [k * 5, -0.2, 2.2]);
    for (let k = -2; k <= 2; k++) {
      put(GEO.box, k % 2 ? INK.BLUE : INK.RED, { tone: 0.1 }, [5, 0.9, 2], [k * 8, 0.3, -2.8]);
    }
  }

  // gran cartel "PANTANO DE SAN JUAN" en la orilla, a la vista desde la salida
  {
    const p = track.at(30);
    const side = TRACK_HALF + 24;
    const g = new THREE.Group();
    g.position.set(p.x + p.tz * side, 0, p.z - p.tx * side);
    g.rotation.y = Math.atan2(p.tx, p.tz) - Math.PI / 2;
    root.add(g);
    const t1 = inkText("PANTANO DE", { size: 2.2, ink: INK.BLUE, weight: 1.2 });
    const t2 = inkText("SAN JUAN", { size: 3.2, ink: INK.RED, weight: 1.2 });
    t1.position.set(0, 12, 0.3); t2.position.set(0, 8.4, 0.3);
    g.add(t1, t2);
    // y por detrás (se lee desde los dos sentidos de la carrera)
    const b1 = inkText("PANTANO DE", { size: 2.2, ink: INK.BLUE, weight: 1.2 }), b2 = inkText("SAN JUAN", { size: 3.2, ink: INK.RED, weight: 1.2 });
    b1.position.set(0, 12, -0.3); b2.position.set(0, 8.4, -0.3); b1.rotation.y = b2.rotation.y = Math.PI;
    g.add(b1, b2);
    const w = Math.max(t1.userData.width, t2.userData.width) + 3;
    const board = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.58 }));
    board.scale.set(w, 7.4, 0.4); board.position.set(0, 10.2, 0); g.add(board);
    for (const s of [-1, 1]) { const post = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { tone: -0.1 })); post.scale.set(0.6, 7, 0.6); post.position.set(s * (w / 2 - 1), 3.5, -0.2); g.add(post); }
  }

  // veleros y piraguas navegando fuera del circuito
  const sailers = [];
  for (let tries = 0; tries < 200 && sailers.length < 7; tries++) {
    const x = r(track.bounds.minX - 10, track.bounds.maxX + 10), z = r(track.bounds.minZ - 10, track.bounds.maxZ + 10);
    if (trackDist(x, z) < TRACK_HALF + 16) continue;
    if (colliders.some((c) => Math.hypot(c.x - x, c.z - z) < c.r + 10)) continue;
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const kayak = sailers.length % 3 === 2;
    if (kayak) {
      const hull = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { tone: 0.05 }));
      hull.scale.set(0.8, 0.35, 4);
      g.add(hull);
      const guy = new THREE.Mesh(GEO.sph, mat(INK.BLUE, { tone: 0.1 }));
      guy.scale.set(0.6, 1, 0.6);
      guy.position.y = 0.7;
      g.add(guy);
      const paddle = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      paddle.scale.set(3.4, 0.08, 0.2);
      paddle.position.y = 0.9;
      g.add(paddle);
      g.userData.paddle = paddle;
    } else {
      const hull = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.35 }));
      hull.scale.set(2.2, 1, 7);
      hull.position.y = 0.3;
      g.add(hull);
      const mast = new THREE.Mesh(GEO.cyl, mat(INK.BLACK, { fill: true }));
      mast.scale.set(0.18, 10, 0.18);
      mast.position.y = 5.5;
      g.add(mast);
      const sail = new THREE.Mesh(GEO.cone, mat(sailers.length % 2 ? INK.RED : INK.BLUE, { tone: 0.3 }));
      sail.scale.set(0.2, 8.5, 4.6);
      sail.position.set(0, 5.2, 1.6);
      g.add(sail);
    }
    g.rotation.y = r(0, Math.PI * 2);
    root.add(g);
    sailers.push({ g, ph: r(0, 6), kayak, speed: kayak ? 1.2 : 2.2, x0: x, z0: z });
  }

  // arco de salida hinchable con banda de cuadros
  {
    const p = track.at(0);
    const g = new THREE.Group();
    g.position.set(p.x, 0, p.z);
    g.rotation.y = Math.atan2(p.tx, p.tz);
    root.add(g);
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(GEO.cyl, mat(INK.RED, { tone: 0.08 }));
      post.scale.set(2.2, 11, 2.2);
      post.position.set(s * (TRACK_HALF + 1.5), 5.5, 0);
      g.add(post);
    }
    const beam = new THREE.Mesh(GEO.box, mat(INK.RED, { tone: 0.08 }));
    beam.scale.set(TRACK_HALF * 2 + 5, 2.4, 1.8);
    beam.position.y = 11;
    g.add(beam);
    for (let k = 0; k < 16; k++) for (let row = 0; row < 2; row++) {
      const sq = new THREE.Mesh(GEO.box, mat(INK.BLACK, (k + row) % 2 ? { fill: true } : { tone: 0.55 }));
      sq.scale.set((TRACK_HALF * 2) / 16, 0.9, 0.1);
      sq.position.set(-TRACK_HALF + (k + 0.5) * ((TRACK_HALF * 2) / 16), 10.55 + row * 0.9, 0.95);
      g.add(sq);
    }
    // línea de meta en el agua
    for (let k = 0; k < 13; k++) {
      const b = new THREE.Mesh(GEO.box, mat(INK.BLACK, k % 2 ? { fill: true } : { tone: 0.55 }));
      b.scale.set((TRACK_HALF * 2) / 13, 0.1, 1.2);
      b.position.set(-TRACK_HALF + (k + 0.5) * ((TRACK_HALF * 2) / 13), 0.25, 0);
      g.add(b);
    }
  }

  // flechas de turbo y rampas (posiciones en el trazado: índice + desplazamiento lateral)
  const boostPads = [], ramps = [];
  const placeOnTrack = (i, lat) => { const p = track.at(i); return { x: p.x - p.tz * lat, z: p.z + p.tx * lat, yaw: Math.atan2(p.tx, p.tz), i }; };
  for (const [i, lat] of [[80, -5], [260, 4], [470, 0], [640, -6], [800, 5]]) {
    const b = placeOnTrack(i, lat);
    const g = new THREE.Group();
    g.position.set(b.x, 0.3, b.z);
    g.rotation.y = b.yaw;
    const chev = [];
    const pad = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { tone: 0.35 }));
    pad.scale.set(4.6, 0.08, 8); g.add(pad);
    for (let k = 0; k < 3; k++) {
      const row = new THREE.Group(); row.position.z = -2.4 + k * 2.4; g.add(row); chev.push(row);
      for (const s of [-1, 1]) {
        const m = new THREE.Mesh(GEO.box, mat(k === 1 ? INK.RED : INK.ORANGE, { fill: true }));
        m.scale.set(0.7, 0.14, 2.6);
        m.position.set(s * 0.95, 0.06, 0);
        m.rotation.y = -s * 0.75;
        row.add(m);
      }
    }
    root.add(g);
    boostPads.push({ ...b, g, chev });
  }
  for (const [i, lat] of [[350, 3], [720, -3]]) {
    const b = placeOnTrack(i, lat);
    const g = new THREE.Group();
    g.position.set(b.x, 0, b.z);
    g.rotation.y = b.yaw;
    const ramp = new THREE.Mesh(GEO.box, mat(INK.ORANGE, { tone: 0.05 }));
    ramp.scale.set(8, 0.5, 9);
    ramp.position.y = 1.1;
    ramp.rotation.x = -0.26;
    g.add(ramp);
    for (let k = 0; k < 3; k++) {
      const st = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
      st.scale.set(8.1, 0.52, 0.6);
      st.position.set(0, 1.12 + (k - 1) * 0.6 * Math.sin(0.26), (k - 1) * 2.8);
      st.rotation.x = -0.26;
      g.add(st);
    }
    root.add(g);
    ramps.push({ ...b, g });
  }

  // cajas de objetos: filas que cruzan el canal
  const itemBoxes = [];
  for (const i of [150, 420, 610, 860]) {
    for (let k = -2; k <= 2; k++) {
      const b = placeOnTrack(i, k * 4.4);
      // caja "?" estilo kart: cada una de un color, con la interrogación en sus 4 caras
      const g = new THREE.Group();
      const ink = [INK.BLUE, INK.PURPLE, INK.ORANGE, INK.GREEN, INK.RED][k + 2];
      const cube = new THREE.Mesh(GEO.box, mat(ink, { tone: 0.3 }));
      cube.scale.setScalar(2.1);
      g.add(cube);
      for (let f = 0; f < 4; f++) {
        const q = inkText("?", { size: 1.3, ink: INK.BLACK, weight: 1.6 });
        const a = (f * Math.PI) / 2;
        q.position.set(Math.sin(a) * 1.07, 0, Math.cos(a) * 1.07);
        q.rotation.y = a;
        g.add(q);
      }
      g.position.set(b.x, 1.6, b.z);
      root.add(g);
      itemBoxes.push({ ...b, g, cool: 0, ph: R() * 6 });
    }
  }

  let frameN = 0;
  function update(t, camX, camZ, dt) {
    updateWater(camX, camZ);
    updateBuoys(t);
    if ((frameN = (frameN + 1) % 2) === 0) updateStrokes(t);
    for (const s of sailers) {
      s.g.position.x = s.x0 + Math.sin(t * 0.05 * s.speed + s.ph) * 18;
      s.g.position.z = s.z0 + Math.cos(t * 0.04 * s.speed + s.ph) * 14;
      s.g.position.y = waveH(s.g.position.x, s.g.position.z, t) * 0.8;
      s.g.rotation.z = Math.sin(t * 1.1 + s.ph) * 0.06;
      if (s.g.userData.paddle) s.g.userData.paddle.rotation.z = Math.sin(t * 3 + s.ph) * 0.5;
    }
    for (const b of boostPads) b.chev.forEach((row, k) => { const s = 1 + 0.25 * Math.max(0, Math.sin(t * 8 - k * 1.2)); row.scale.set(s, 1, s); });
    for (const p of smoke) {
      const k = (t * 0.25 + p.ph) % 1;
      p.m.position.set(p.x + Math.sin(t + p.ph * 6) * 0.6 * k, 4.6 + k * 7, p.z);
      p.m.scale.setScalar(0.6 + k * 2);
      p.m.visible = k < 0.92;
    }
    for (const b of itemBoxes) {
      if (b.cool > 0) { b.cool -= dt; b.g.visible = b.cool <= 0; }
      b.g.rotation.y += dt * 1.6;
      b.g.rotation.x = Math.sin(t * 1.3 + b.ph) * 0.3;
      b.g.position.y = 1.6 + Math.sin(t * 2 + b.ph) * 0.35;
    }
  }

  return { root, update, colliders, boostPads, ramps, itemBoxes };
}
