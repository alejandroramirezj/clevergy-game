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
import { createSticker } from "../doodleSticker.js";
import { speakCharacter } from "../../engine/voice.js";

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
export function buildRaceWorld(scene, track, overlay = null) {
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

  // ── AGUA DEL EMBALSE Y CANAL DE CARRERAS CLARAMENTE DIFERENCIADO ──
  // 1. Agua profunda exterior (azul marino oscuro con rayado denso)
  const farWater = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), mat(INK.BLUE, { tone: -0.42 }));
  farWater.rotation.x = -Math.PI / 2;
  farWater.position.y = -0.28;
  root.add(farWater);
  const WG = 2, WS = 400; // celdas y tamaño del parche de olas
  const wGeo = new THREE.PlaneGeometry(WS, WS, WG, WG);
  wGeo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(wGeo, mat(INK.BLUE, { tone: -0.38 }));
  water.frustumCulled = false;
  root.add(water);
  const cell = WS / WG;
  function updateWater(camX, camZ) {
    water.position.set(Math.round(camX / cell) * cell, 0, Math.round(camZ / cell) * cell);
  }

  // 2. Cinta de agua navegable del circuito (aguas claras y cristalinas, tono luminoso)
  // Permite distinguir perfectamente el canal de la carrera frente al resto del embalse.
  const ribbonGeo = new THREE.BufferGeometry();
  const ribbonPos = new Float32Array(N_SAMPLES * 2 * 3);
  const ribbonIndices = [];
  const ribbonUVs = new Float32Array(N_SAMPLES * 2 * 2);
  for (let i = 0; i < N_SAMPLES; i++) {
    const p = track.at(i);
    const nx = -p.tz, nz = p.tx;
    // Vértice izquierdo
    ribbonPos[i * 6 + 0] = p.x - nx * TRACK_HALF;
    ribbonPos[i * 6 + 1] = 0.05;
    ribbonPos[i * 6 + 2] = p.z - nz * TRACK_HALF;
    ribbonUVs[i * 4 + 0] = 0;
    ribbonUVs[i * 4 + 1] = i / 10;
    // Vértice derecho
    ribbonPos[i * 6 + 3] = p.x + nx * TRACK_HALF;
    ribbonPos[i * 6 + 4] = 0.05;
    ribbonPos[i * 6 + 5] = p.z + nz * TRACK_HALF;
    ribbonUVs[i * 4 + 2] = 1;
    ribbonUVs[i * 4 + 3] = i / 10;
    // Triángulos entre i y (i+1)
    const next = (i + 1) % N_SAMPLES;
    const i0 = i * 2, i1 = i * 2 + 1, i2 = next * 2, i3 = next * 2 + 1;
    ribbonIndices.push(i0, i2, i1);
    ribbonIndices.push(i1, i2, i3);
  }
  ribbonGeo.setAttribute("position", new THREE.BufferAttribute(ribbonPos, 3));
  ribbonGeo.setAttribute("uv", new THREE.BufferAttribute(ribbonUVs, 2));
  ribbonGeo.setIndex(ribbonIndices);
  ribbonGeo.computeVertexNormals();

  const trackWater = new THREE.Mesh(ribbonGeo, mat(INK.BLUE, { tone: 0.36 }));
  trackWater.frustumCulled = false;
  root.add(trackWater);

  // 3. Estelas de corriente y cáusticas que fluyen a lo largo del circuito
  const caustics = [];
  for (let i = 0; i < N_SAMPLES; i += 2) {
    const p = track.at(i);
    for (let k = 0; k < 2; k++) {
      const lat = (R() - 0.5) * (TRACK_HALF * 1.8);
      caustics.push({
        x: p.x - p.tz * lat,
        z: p.z + p.tx * lat,
        tx: p.tx,
        tz: p.tz,
        ph: R() * 6,
        s: 1.4 + R() * 1.8,
        speed: 1.8 + R() * 1.2
      });
    }
  }
  const causticsIM = new THREE.InstancedMesh(GEO.box, mat(INK.BLUE, { tone: 0.48 }), caustics.length);
  causticsIM.frustumCulled = false;
  root.add(causticsIM);
  function updateCaustics(t) {
    caustics.forEach((c, k) => {
      const y = waveH(c.x, c.z, t) + 0.09;
      const pulse = 0.8 + 0.3 * Math.sin(t * 3.5 + c.ph);
      const flow = (t * c.speed + c.ph * 2) % 6 - 3;
      const px = c.x + c.tx * flow, pz = c.z + c.tz * flow;
      const ry = Math.atan2(c.tx, c.tz) + Math.PI / 2;
      tmpE.set(0, ry, 0);
      tmpQ.setFromEuler(tmpE);
      tmpM.compose(tmpP.set(px, y, pz), tmpQ, tmpS.set(c.s * pulse * 2.2, 0.05, 0.22));
      causticsIM.setMatrixAt(k, tmpM);
    });
    causticsIM.instanceMatrix.needsUpdate = true;
  }

  // 4. Corcheras náuticas continuas (línea de boyarines enlazados en ambos bordes del canal)
  // Hace que el límite de pista sea continuo y visible en todo momento.
  const laneFloats = [];
  const FLOAT_STEP = 3; // cada 3 muestras (~3 metros)
  for (let i = 0; i < N_SAMPLES; i += FLOAT_STEP) {
    const p = track.at(i);
    const yaw = Math.atan2(p.tx, p.tz);
    // Borde izquierdo (-TRACK_HALF): naranja / negro
    laneFloats.push({
      x: p.x + p.tz * TRACK_HALF,
      z: p.z - p.tx * TRACK_HALF,
      yaw,
      side: -1,
      color: (i / FLOAT_STEP) % 2 === 0 ? "orange" : "black"
    });
    // Borde derecho (+TRACK_HALF): rojo / blanco
    laneFloats.push({
      x: p.x - p.tz * TRACK_HALF,
      z: p.z + p.tx * TRACK_HALF,
      yaw,
      side: 1,
      color: (i / FLOAT_STEP) % 2 === 0 ? "red" : "black"
    });
  }
  const floatsOrange = laneFloats.filter(f => f.color === "orange");
  const floatsRed = laneFloats.filter(f => f.color === "red");
  const floatsBlack = laneFloats.filter(f => f.color === "black");

  const orangeFloatsIM = new THREE.InstancedMesh(GEO.cyl, mat(INK.ORANGE, { fill: true }), floatsOrange.length);
  const redFloatsIM = new THREE.InstancedMesh(GEO.cyl, mat(INK.RED, { fill: true }), floatsRed.length);
  const blackFloatsIM = new THREE.InstancedMesh(GEO.cyl, mat(INK.BLACK, { fill: true }), floatsBlack.length);
  [orangeFloatsIM, redFloatsIM, blackFloatsIM].forEach(im => { im.frustumCulled = false; root.add(im); });

  function updateLaneFloats(t) {
    const applyFloats = (im, list) => {
      list.forEach((f, k) => {
        const y = waveH(f.x, f.z, t) + 0.18;
        tmpE.set(0, f.yaw + Math.PI / 2, 0);
        tmpQ.setFromEuler(tmpE);
        tmpM.compose(tmpP.set(f.x, y, f.z), tmpQ, tmpS.set(0.42, 1.25, 0.42));
        im.setMatrixAt(k, tmpM);
      });
      im.instanceMatrix.needsUpdate = true;
    };
    applyFloats(orangeFloatsIM, floatsOrange);
    applyFloats(redFloatsIM, floatsRed);
    applyFloats(blackFloatsIM, floatsBlack);
  }

  // 5. Grandes boyas marítimas de regata con banderas y mástiles altos (visibles desde lejos)
  const tallBuoys = [];
  const BUOY_STEP = 24; // cada 24 muestras (~24 metros)
  for (let i = 0; i < N_SAMPLES; i += BUOY_STEP) {
    const p = track.at(i);
    // Babor (izquierda): boyas azules/verdes con bandera
    tallBuoys.push({
      x: p.x + p.tz * (TRACK_HALF + 0.8),
      z: p.z - p.tx * (TRACK_HALF + 0.8),
      ph: R() * 6,
      side: "left"
    });
    // Estribor (derecha): boyas rojas con bandera
    tallBuoys.push({
      x: p.x - p.tz * (TRACK_HALF + 0.8),
      z: p.z + p.tx * (TRACK_HALF + 0.8),
      ph: R() * 6,
      side: "right"
    });
  }
  const leftBuoys = tallBuoys.filter(b => b.side === "left");
  const rightBuoys = tallBuoys.filter(b => b.side === "right");

  // Bases cilíndricas flotantes
  const buoyBaseIM = new THREE.InstancedMesh(GEO.cyl, mat(INK.BLACK, { tone: 0.1 }), tallBuoys.length);
  // Conos altos de señalización (rojo a la derecha, azul/verde a la izquierda)
  const buoyConeRightIM = new THREE.InstancedMesh(GEO.cone, mat(INK.RED, { fill: true }), rightBuoys.length);
  const buoyConeLeftIM = new THREE.InstancedMesh(GEO.cone, mat(INK.BLUE, { fill: true }), leftBuoys.length);
  // Mástiles con banderín triangular
  const buoyMastIM = new THREE.InstancedMesh(GEO.cyl, mat(INK.BLACK, { fill: true }), tallBuoys.length);
  const buoyFlagRightIM = new THREE.InstancedMesh(GEO.cone, mat(INK.RED, { tone: 0.2 }), rightBuoys.length);
  const buoyFlagLeftIM = new THREE.InstancedMesh(GEO.cone, mat(INK.ORANGE, { tone: 0.2 }), leftBuoys.length);

  [buoyBaseIM, buoyConeRightIM, buoyConeLeftIM, buoyMastIM, buoyFlagRightIM, buoyFlagLeftIM].forEach(im => {
    im.frustumCulled = false;
    root.add(im);
  });

  function updateTallBuoys(t) {
    let allIdx = 0;
    // Babor (izquierda)
    leftBuoys.forEach((b, k) => {
      const y = waveH(b.x, b.z, t) + 0.35;
      const roll = Math.sin(t * 1.6 + b.ph) * 0.14, pitch = Math.cos(t * 1.4 + b.ph) * 0.14;
      tmpE.set(roll, 0, pitch);
      tmpQ.setFromEuler(tmpE);

      // Base
      tmpM.compose(tmpP.set(b.x, y, b.z), tmpQ, tmpS.set(2.4, 0.7, 2.4));
      buoyBaseIM.setMatrixAt(allIdx, tmpM);
      // Mástil
      tmpM.compose(tmpP.set(b.x, y + 2.0, b.z), tmpQ, tmpS.set(0.18, 3.4, 0.18));
      buoyMastIM.setMatrixAt(allIdx, tmpM);
      allIdx++;

      // Cono
      tmpM.compose(tmpP.set(b.x, y + 1.1, b.z), tmpQ, tmpS.set(1.6, 1.8, 1.6));
      buoyConeLeftIM.setMatrixAt(k, tmpM);

      // Banderín
      tmpE.set(roll, Math.sin(t * 2 + b.ph) * 0.2 + Math.PI / 2, pitch);
      tmpQ.setFromEuler(tmpE);
      tmpM.compose(tmpP.set(b.x + 0.6, y + 3.2, b.z), tmpQ, tmpS.set(0.1, 1.2, 0.6));
      buoyFlagLeftIM.setMatrixAt(k, tmpM);
    });

    // Estribor (derecha)
    rightBuoys.forEach((b, k) => {
      const y = waveH(b.x, b.z, t) + 0.35;
      const roll = Math.sin(t * 1.6 + b.ph) * 0.14, pitch = Math.cos(t * 1.4 + b.ph) * 0.14;
      tmpE.set(roll, 0, pitch);
      tmpQ.setFromEuler(tmpE);

      // Base
      tmpM.compose(tmpP.set(b.x, y, b.z), tmpQ, tmpS.set(2.4, 0.7, 2.4));
      buoyBaseIM.setMatrixAt(allIdx, tmpM);
      // Mástil
      tmpM.compose(tmpP.set(b.x, y + 2.0, b.z), tmpQ, tmpS.set(0.18, 3.4, 0.18));
      buoyMastIM.setMatrixAt(allIdx, tmpM);
      allIdx++;

      // Cono
      tmpM.compose(tmpP.set(b.x, y + 1.1, b.z), tmpQ, tmpS.set(1.6, 1.8, 1.6));
      buoyConeRightIM.setMatrixAt(k, tmpM);

      // Banderín
      tmpE.set(roll, Math.sin(t * 2 + b.ph) * 0.2 + Math.PI / 2, pitch);
      tmpQ.setFromEuler(tmpE);
      tmpM.compose(tmpP.set(b.x + 0.6, y + 3.2, b.z), tmpQ, tmpS.set(0.1, 1.2, 0.6));
      buoyFlagRightIM.setMatrixAt(k, tmpM);
    });

    buoyBaseIM.instanceMatrix.needsUpdate = true;
    buoyConeRightIM.instanceMatrix.needsUpdate = true;
    buoyConeLeftIM.instanceMatrix.needsUpdate = true;
    buoyMastIM.instanceMatrix.needsUpdate = true;
    buoyFlagRightIM.instanceMatrix.needsUpdate = true;
    buoyFlagLeftIM.instanceMatrix.needsUpdate = true;
  }

  // 6. Paneles flotantes de curvas cerradas (Chevrons estilo Mario Kart >>> / <<<)
  // Ubicados en las 7 curvas principales para avisar al piloto y evitar salidas de pista
  const CHEVRON_TURNS = [
    { i: 85, dir: ">>>", signSide: -1 }, // Curva hacia la presa
    { i: 205, dir: ">>>", signSide: -1 }, // Horquilla de rocas
    { i: 335, dir: ">>>", signSide: -1 }, // Curva abierta sur
    { i: 470, dir: "<<<", signSide: 1 }, // Entrada a chicane
    { i: 590, dir: ">>>", signSide: -1 }, // Rodeo del islote
    { i: 715, dir: ">>>", signSide: -1 }, // Curva hacia la playa
    { i: 825, dir: "<<<", signSide: 1 }  // S final antes de meta
  ];
  const chevronSigns = [];
  CHEVRON_TURNS.forEach(ch => {
    const p = track.at(ch.i);
    const yaw = Math.atan2(p.tx, p.tz);
    const sideDist = (TRACK_HALF + 4.5) * ch.signSide;
    const sx = p.x - p.tz * sideDist, sz = p.z + p.tx * sideDist;
    const g = new THREE.Group();
    g.position.set(sx, 0, sz);
    g.rotation.y = yaw + (ch.signSide > 0 ? 0.35 : -0.35);

    // Flotadores dobles de anclaje
    for (const fx of [-2.6, 2.6]) {
      const buoy = new THREE.Mesh(GEO.cyl, mat(INK.ORANGE, { fill: true }));
      buoy.scale.set(1.4, 0.7, 1.4);
      buoy.position.set(fx, 0.35, 0);
      g.add(buoy);
      const post = new THREE.Mesh(GEO.cyl, mat(INK.BLACK, { fill: true }));
      post.scale.set(0.18, 3.2, 0.18);
      post.position.set(fx, 2.0, 0);
      g.add(post);
    }
    // Panel de madera / cartel reflectante
    const board = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.65 }));
    board.scale.set(6.8, 2.2, 0.25);
    board.position.set(0, 3.2, 0);
    g.add(board);

    // Flechas de dirección en tinta naranja/roja llamativa
    const arrows = inkText(ch.dir, { size: 1.6, ink: INK.RED, weight: 1.8 });
    arrows.position.set(0, 3.2, 0.16);
    g.add(arrows);

    root.add(g);
    chevronSigns.push({ g, x: sx, z: sz, arrows });
  });

  // ── LANCHA DE BELTRÁN Y ESQUÍ ACUÁTICO CON TABLA DE SURF (ELEMENTO INTERACTIVO) ──
  const beltranGroup = new THREE.Group();
  root.add(beltranGroup);

  // 1. La lancha motora rápida (estilo competición / lancha de wakeboard)
  const boatG = new THREE.Group();
  beltranGroup.add(boatG);
  // Casco deportivo en V
  const hullMain = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.12 }));
  hullMain.scale.set(3.2, 1.1, 7.4);
  hullMain.position.y = 0.55;
  boatG.add(hullMain);

  const hullBow = new THREE.Mesh(GEO.cone, mat(INK.BLUE, { tone: 0.18 }));
  hullBow.scale.set(3.1, 2.9, 1.1);
  hullBow.position.set(0, 0.65, 3.9);
  hullBow.rotation.x = Math.PI / 2;
  boatG.add(hullBow);

  // Banda decorativa lateral en rojo brillante
  const boatStripe = new THREE.Mesh(GEO.box, mat(INK.RED, { fill: true }));
  boatStripe.scale.set(3.28, 0.22, 7.0);
  boatStripe.position.set(0, 0.72, 0.1);
  boatG.add(boatStripe);

  // Cubierta y parabrisas deportivo
  const boatDeck = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.52 }));
  boatDeck.scale.set(2.8, 0.25, 4.4);
  boatDeck.position.set(0, 1.15, -0.4);
  boatG.add(boatDeck);

  const boatWindshield = new THREE.Mesh(GEO.box, mat(INK.BLUE, { tone: 0.42 }));
  boatWindshield.scale.set(2.6, 0.8, 0.12);
  boatWindshield.position.set(0, 1.55, 1.3);
  boatWindshield.rotation.x = -0.38;
  boatG.add(boatWindshield);

  // Piloto con gorra al volante
  const pilotHead = new THREE.Mesh(GEO.sph, mat(INK.ORANGE, { tone: 0.4 }));
  pilotHead.scale.set(0.65, 0.65, 0.65);
  pilotHead.position.set(-0.55, 1.85, 0.2);
  boatG.add(pilotHead);

  const pilotCap = new THREE.Mesh(GEO.cone, mat(INK.RED, { fill: true }));
  pilotCap.scale.set(0.7, 0.35, 0.7);
  pilotCap.position.set(-0.55, 2.2, 0.2);
  boatG.add(pilotCap);

  // Torre central de arrastre de esquí náutico (pylon)
  const towPylon = new THREE.Mesh(GEO.cyl, mat(INK.BLACK, { fill: true }));
  towPylon.scale.set(0.18, 2.5, 0.18);
  towPylon.position.set(0, 2.1, -1.2);
  boatG.add(towPylon);

  // Manta de estela espumosa detrás de la lancha
  const boatWakePlane = new THREE.Mesh(GEO.box, mat(INK.BLUE, { tone: 0.45 }));
  boatWakePlane.scale.set(6.2, 0.05, 14);
  boatWakePlane.position.set(0, 0.06, -7.5);
  boatG.add(boatWakePlane);

  // 2. Cuerda de esquí náutico (línea amarilla/naranja flotante)
  const ropePoints = [new THREE.Vector3(), new THREE.Vector3()];
  const ropeGeo = new THREE.BufferGeometry().setFromPoints(ropePoints);
  const ropeLine = new THREE.Line(ropeGeo, new THREE.LineBasicMaterial({ color: 0xec7f19, linewidth: 3 }));
  ropeLine.frustumCulled = false;
  beltranGroup.add(ropeLine);

  // 3. Tabla de surf de Beltrán
  const surfG = new THREE.Group();
  beltranGroup.add(surfG);

  const surfBoard = new THREE.Mesh(GEO.box, mat(INK.BLUE, { tone: 0.22 }));
  surfBoard.scale.set(1.2, 0.16, 2.8);
  surfBoard.position.y = 0.08;
  surfG.add(surfBoard);

  const surfNose = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { tone: 0.1 }));
  surfNose.scale.set(1.2, 0.9, 0.16);
  surfNose.position.set(0, 0.14, 1.45);
  surfNose.rotation.x = Math.PI / 2;
  surfG.add(surfNose);

  const surfStripe = new THREE.Mesh(GEO.box, mat(INK.RED, { fill: true }));
  surfStripe.scale.set(0.24, 0.18, 2.7);
  surfStripe.position.set(0, 0.1, 0);
  surfG.add(surfStripe);

  // Quillas estabilizadoras bajo la tabla
  for (const qx of [-0.35, 0, 0.35]) {
    const fin = new THREE.Mesh(GEO.box, mat(INK.BLACK, { fill: true }));
    fin.scale.set(0.06, 0.3, 0.5);
    fin.position.set(qx, -0.15, -1.0);
    surfG.add(fin);
  }

  // 4. Sticker de Beltrán haciendo surf
  const beltranSticker = createSticker(overlay || scene, { height: 1.65 });
  beltranSticker.setChar("beltran");

  // Bocadillo visual cómic en 3D
  const bubbleG = new THREE.Group();
  const bubbleBg = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.65 }));
  bubbleBg.scale.set(12.5, 2.6, 0.2);
  bubbleG.add(bubbleBg);
  const bubbleTxt = inkText("¡A TOPE! ¡ESO LO VENDEMOS YA!", { size: 0.9, ink: INK.BLUE, weight: 1.4 });
  bubbleTxt.position.set(0, 0.1, 0.16);
  bubbleG.add(bubbleTxt);
  bubbleG.visible = false;
  beltranGroup.add(bubbleG);

  // Estado del esquí náutico de Beltrán
  const beltranState = {
    x: 0, y: 0, z: 0,
    boatX: 0, boatZ: 0,
    carveAngle: 0,
    saluting: false,
    saluteT: 0,
    lastVoiceT: 0,
    wakeBoostCooldown: 0,
    speechTimer: 0
  };

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
  function update(t, camX, camZ, dt, player = null) {
    updateWater(camX, camZ);
    updateCaustics(t);
    updateLaneFloats(t);
    updateTallBuoys(t);

    // Paneles de chevrons estilo Mario Kart
    for (const ch of chevronSigns) {
      const wy = waveH(ch.x, ch.z, t);
      ch.g.position.y = wy + 0.15;
      ch.g.rotation.z = Math.sin(t * 1.5 + ch.x) * 0.04;
      ch.arrows.scale.setScalar(1 + Math.sin(t * 5 + ch.z) * 0.08);
    }

    // ── NAVEGACIÓN Y CARVING DE BELTRÁN EN ESQUÍ ACUÁTICO ──
    const boatSpeed = 0.14;
    const bAngle = t * boatSpeed;
    const bx = center.x + Math.sin(bAngle) * 135 + Math.sin(bAngle * 2) * 32;
    const bz = center.z + Math.cos(bAngle) * 115 + Math.cos(bAngle * 2) * 28;
    const nextBAngle = bAngle + 0.01;
    const nextBx = center.x + Math.sin(nextBAngle) * 135 + Math.sin(nextBAngle * 2) * 32;
    const nextBz = center.z + Math.cos(nextBAngle) * 115 + Math.cos(nextBAngle * 2) * 28;
    const boatYaw = Math.atan2(nextBx - bx, nextBz - bz);
    const by = waveH(bx, bz, t) + 0.35;

    boatG.position.set(bx, by, bz);
    boatG.rotation.y = boatYaw;
    boatG.rotation.x = -0.06; // lancha planeando a toda velocidad
    boatG.rotation.z = Math.sin(t * 2) * 0.03;

    // Beltrán haciendo carving fluido con su tabla de surf a través de la estela
    const ROPE_LEN = 16.5;
    const carveFreq = 2.2;
    const carveDist = Math.sin(t * carveFreq) * 5.4;
    const surfX = bx - Math.sin(boatYaw) * ROPE_LEN - Math.cos(boatYaw) * carveDist;
    const surfZ = bz - Math.cos(boatYaw) * ROPE_LEN + Math.sin(boatYaw) * carveDist;
    const surfY = waveH(surfX, surfZ, t) + 0.16;
    const surfTilt = -Math.cos(t * carveFreq) * 0.42;

    surfG.position.set(surfX, surfY, surfZ);
    surfG.rotation.y = boatYaw + (carveDist > 0 ? 0.28 : -0.28);
    surfG.rotation.z = surfTilt;

    // Cuerda de arrastre tensada entre el pylon y las manos de Beltrán
    const posAttr = ropeLine.geometry.attributes.position;
    posAttr.setXYZ(0, bx, by + 2.1, bz);
    posAttr.setXYZ(1, surfX, surfY + 1.1, surfZ);
    posAttr.needsUpdate = true;

    beltranState.x = surfX;
    beltranState.y = surfY;
    beltranState.z = surfZ;
    beltranState.boatX = bx;
    beltranState.boatZ = bz;

    // Interacción y saludo con el piloto del jugador
    let playerDist = 999;
    let wakeDraftGranted = false;
    if (player && typeof player.x === "number") {
      const dx = player.x - surfX, dz = player.z - surfZ;
      playerDist = Math.hypot(dx, dz);

      // Rebufo interactivo: estar en la estela directa de la tabla de Beltrán (detrás a 1-7 metros)
      const relX = dx * Math.cos(boatYaw) - dz * Math.sin(boatYaw);
      const relZ = dx * Math.sin(boatYaw) + dz * Math.cos(boatYaw);
      if (relZ < -0.8 && relZ > -7.5 && Math.abs(relX) < 3.2 && playerDist < 8.0) {
        if (t - beltranState.wakeBoostCooldown > 2.5) {
          beltranState.wakeBoostCooldown = t;
          wakeDraftGranted = true;
        }
      }
    }

    // Saludo de Beltrán cuando el jugador pasa a menos de 36 metros
    if (playerDist < 36) {
      beltranState.saluting = true;
      beltranState.saluteT = 1.8;
      if (t - beltranState.lastVoiceT > 10) {
        beltranState.lastVoiceT = t;
        const phrases = [
          "¡A tope! ¡Eso lo vendemos ya!",
          "¡Qué estilazo en el pantano!",
          "¡Pilla mi rebufo y dale turbo!",
          "¡Vamos fiera, a por el podio!"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        try {
          speakCharacter("beltran", { phrase, force: true, showBubble: false });
        } catch (e) {}
        beltranState.speechTimer = 3.5;
        bubbleG.visible = true;
      }
    }

    if (beltranState.speechTimer > 0) {
      beltranState.speechTimer -= dt;
      bubbleG.position.set(surfX, surfY + 3.2, surfZ);
      bubbleG.rotation.y = boatYaw;
      if (beltranState.speechTimer <= 0) bubbleG.visible = false;
    }

    // Actualización del sticker de Beltrán
    const beltranPos = new THREE.Vector3(surfX, surfY + 0.95, surfZ);
    const beltranPose = beltranState.saluteT > 0 ? "jump" : "idle";
    beltranSticker.update(dt, {
      pos: beltranPos,
      camera: { position: new THREE.Vector3(camX, 20, camZ) },
      moveX: 0,
      facing: 1,
      speed: 0,
      onGround: true,
      firing: false,
      pose: beltranPose,
      hurt: 0,
      tilt: surfTilt * 0.7,
      squash: 1 + Math.sin(t * 4) * 0.04
    });
    beltranState.saluteT = Math.max(0, beltranState.saluteT - dt);

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

    return { inWakeDraft: wakeDraftGranted, beltran: beltranState };
  }

  return { root, update, colliders, boostPads, ramps, itemBoxes, beltran: beltranState };
}
