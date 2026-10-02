// =============================================================================
// fallLevels.js — Las 4 rondas de "La Integración"
// De no tener nada a un usuario completo (consumo, producción y facturas) que da
// el consentimiento para que Clevergy controle su batería en el mercado de
// flexibilidad. Todas las pistas avanzan hacia +z; la IA sigue `path`
// (segmentos fijos o bifurcaciones `alts`, alguna de ellas trampa).
// =============================================================================

import { INK } from "../doodleRender.js";
import { GEO } from "../doodleLevel.js";
import { RAINBOW, rng } from "./fallKit.js";
import * as THREE from "three";
import { mat } from "../doodleRender.js";

// waypoints en línea recta (z creciente)
function line(x0, z0, x1, z1, step = 4) {
  const n = Math.max(1, Math.round(Math.abs(z1 - z0) / step));
  const out = [];
  for (let i = 0; i <= n; i++) out.push({ x: x0 + ((x1 - x0) * i) / n, z: z0 + ((z1 - z0) * i) / n });
  return out;
}
const W = (wps) => ({ wps });
const shuffle = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ════════════════════════════════════════════════════════════════════════════
// RONDA 1 · CREA EL USUARIO Y LA CASA
// ════════════════════════════════════════════════════════════════════════════
function level1(K, seed) {
  const r = rng(seed);
  const X0 = -7, X1 = 7;
  // salida
  K.plat(X0, X1, -8, 10, 0, { ink: INK.BLUE, tone: 0.34 });
  K.sign("RONDA 1\nCREA EL USUARIO", 0, 4.4, 9.5, { size: 0.6, ink: INK.BLUE });
  K.checkpoint(-7, X0, X1, { x0: -5, x1: 5, z: -3, y: 0 });
  // NOMBRE: dos ruletas que barren el suelo
  K.plat(X0, X1, 10, 30, 0, { ink: INK.ORANGE, tone: 0.32 });
  K.bar(0, 0.55, 16, 6.6, 1.7, { ink: INK.RED, label: "NOMBRE" });
  K.bar(0, 0.55, 24.5, 6.6, -2.0, { ink: INK.PURPLE, ph: 1, label: "NOMBRE" });
  for (const x of [X0 - 0.4, X1]) K.wall(x, x + 0.4, 10, 30, 0, 0.9, INK.BLACK, { tone: 0.3 });
  K.gate(29, X0, X1, "NOMBRE ✓", 0);
  // APELLIDOS: suelo lleno de agujeros
  for (let zi = 0; zi < 7; zi++) {
    const row = [];
    for (let xi = 0; xi < 7; xi++) row.push(r() > 0.38);
    if (row.filter(Boolean).length < 3) row[Math.floor(r() * 7)] = row[3] = true;
    row.forEach((on, xi) => { if (on) K.plat(X0 + xi * 2 + 0.06, X0 + xi * 2 + 1.94, 30 + zi * 2 + 0.06, 30 + zi * 2 + 1.94, 0, { ink: RAINBOW[(xi + zi) % 5], tone: 0.3 }); });
  }
  K.sign("APELLIDOS", -9.5, 2.5, 36, { size: 0.5, rotY: Math.PI / 2 });
  K.plat(X0, X1, 44, 46, 0, { ink: INK.ORANGE });
  K.gate(45, X0, X1, "APELLIDOS ✓", 1);
  // DNI: empujadores que entran por los lados y un péndulo
  K.plat(X0, X1, 49, 63, 0, { ink: INK.GREEN, tone: 0.32 });
  K.pusher(-13, -6.8, 51.5, 53, 0, 1.8, 7.5, 1.6, 0, { label: "DNI 12345678Z" });
  K.pusher(6.8, 13, 55.5, 57, 0, 1.8, -7.5, 1.4, 1.5, { label: "DNI 1234567" });
  K.pendulum(0, 7, 60, 5.6, 1.0, 1.5, { ink: INK.PURPLE, label: "DNI?" });
  K.gate(62, X0, X1, "DNI ✓", 2);
  // NOTIFICACIONES: el botón gigante te lanza al otro lado
  K.plat(X0, X1, 63, 68, 0, { ink: INK.BLUE });
  K.plat(-3, 3, 64, 67.5, 0.25, { ink: INK.RED, tone: 0.05, flags: { bounce: 16, launch: 10 } });
  K.sign("ACTIVA LAS\nNOTIFICACIONES", 0, 3.2, 63.4, { size: 0.42, ink: INK.RED });
  K.plat(X0, X1, 76, 86, 0, { ink: INK.PURPLE, tone: 0.34 });
  K.gate(78, X0, X1, "NOTIFICACIONES ✓", 3);
  K.checkpoint(79, X0, X1, { x0: -5, x1: 5, z: 81, y: 0 });
  K.sign("AHORA, LA CASA", 0, 3.6, 85.5, { size: 0.55, ink: INK.GREEN });

  // CUPS: tres pasarelas; sólo una tiene el CUPS bien escrito (las otras se hunden)
  const lanes = [-4.6, 0, 4.6];
  const good = Math.floor(r() * 3);
  const fakes = shuffle(["CUPS\n28045", "CUPS\nES0021…", "CUPS\n12345678Z"], r);
  lanes.forEach((x, i) => {
    for (let k = 0; k < 6; k++) {
      const s = K.plat(x - 1.3, x + 1.3, 86.5 + k * 2.1, 88.4 + k * 2.1, 0, { ink: i === good ? INK.GREEN : INK.ORANGE, tone: 0.3 });
      if (i !== good) K.fallTile(s, 0.12, 2.5);
    }
    K.sign(i === good ? "CUPS ES0021\n0000123456JN" : fakes[i], x, 2.2, 86.4, { size: 0.3, ink: INK.BLACK });
  });
  K.plat(X0, X1, 99, 104, 0, { ink: INK.BLUE });
  K.gate(100.5, X0, X1, "CUPS ✓", 4);
  K.checkpoint(101.5, X0, X1, { x0: -5, x1: 5, z: 102, y: 0 });

  // DIRECCIÓN POR PARTES: piedras que se mueven, cada una con su campo
  const parts = ["CALLE", "NÚMERO", "PISO", "PUERTA", "MUNICIPIO"];
  const stones = parts.map((p, i) => {
    const z = 106 + i * 5;
    const s = K.plat(-1.6, 1.6, z, z + 3, 0, { ink: RAINBOW[i], tone: 0.25 });
    K.mover(s, K.sine(2.8, 0, 0, 0.8 + i * 0.1, i * 1.3));
    const t = K.sign(p, 0, 1.0, z + 0.1, { size: 0.32, ink: INK.BLACK, board: false });
    s.g.add(t); K.root.remove(t);
    return s;
  });
  K.plat(X0, X1, 130, 136, 0, { ink: INK.ORANGE });
  K.gate(131, X0, X1, "DIRECCIÓN ✓", 5);
  K.checkpoint(132, X0, X1, { x0: -5, x1: 5, z: 133, y: 0 });

  // CÓDIGO POSTAL: tres puertas, sólo una con el CP bien
  const cps = shuffle(["CP 2804", "CP 28O45", "CP 280450"], r);
  const goodDoor = Math.floor(r() * 3);
  [-4.67, 0, 4.67].forEach((x, i) => K.door(x - 2.2, x + 2.2, 137, 0, 3.4, i === goodDoor ? "open" : "locked", i === goodDoor ? "CP 28045" : cps[i], INK.BLUE));
  K.wall(X0, X1, 136.7, 137.3, 3.4, 4.6, INK.BLUE, { tone: 0.15 });
  for (const x of [-7, -2.42, 2.42, 7]) K.wall(x - 0.25, x + 0.25, 136.7, 137.3, 0, 3.4, INK.BLUE, { tone: 0.15 });
  K.plat(X0, X1, 136, 154, 0, { ink: INK.GREEN, tone: 0.3 });
  K.gate(140, X0, X1, "CÓDIGO POSTAL ✓", 6);
  K.sign("USUARIO + CASA ✓", 0, 3.8, 153.5, { size: 0.65, ink: INK.GREEN });

  // casita y usuario de decorado al fondo
  house(K, 0, 0, 160);

  return {
    key: "usuario", num: 1, title: "Crea el usuario y la casa", subtitle: "Nombre, apellidos, DNI, notificaciones, CUPS, dirección y CP",
    checklist: ["Nombre", "Apellidos", "DNI", "Notificaciones", "CUPS", "Dirección", "Código postal"],
    finish: { z: 146, x0: X0, x1: X1, y: 0 },
    killY: -9, time: 150, qualify: 0.75, ink: INK.BLUE,
    tip: "Elige bien el CUPS y el código postal: los falsos no te dejan pasar",
    path: [
      W(line(0, -2, 0, 29, 3)),
      W(line(0, 31, 0, 44, 2)),
      W([...line(0, 46, -3.5, 50, 2), ...line(-3.5, 52, 2.5, 58, 2), ...line(0, 60, 0, 66, 2)]),
      W(line(0, 70, 0, 84, 3)),
      { id: "cups", alts: lanes.map((x, i) => ({ segs: [W(line(x, 86.8, x, 98, 2.1))], w: 1, dead: i === good ? null : "fall", z0: 86, z1: 99 })) },
      W([{ x: 0, z: 103 }, ...stones.map((s, i) => ({ x: 0, z: 107.5 + i * 5, follow: s }))]),
      W(line(0, 130.5, 0, 134.5, 2)),
      { id: "cp", alts: [-4.67, 0, 4.67].map((x, i) => ({ segs: [W([{ x, z: 136 }, { x, z: 139 }])], w: 1, dead: i === goodDoor ? null : "locked", z0: 133, z1: 138 })) },
      W(line(0, 141, 0, 150, 3))
    ]
  };
}

// ════════════════════════════════════════════════════════════════════════════
// RONDA 2 · CONSIGUE EL CONSUMO (Datadis · FTP · API)
// ════════════════════════════════════════════════════════════════════════════
function level2(K, seed) {
  const r = rng(seed);
  K.plat(-28, 26, -8, 12, 0, { ink: INK.BLUE, tone: 0.34 });
  K.sign("RONDA 2 · CONSIGUE EL CONSUMO\nELIGE CAMINO", 0, 5.4, 11.5, { size: 0.55, ink: INK.BLUE });
  K.checkpoint(-7, -26, 24, { x0: -10, x1: 10, z: -3, y: 0 });
  // arcos de entrada
  K.gate(12.5, -25, -11, "FTP", 0, { ink: INK.ORANGE });
  K.gate(12.5, -6, 6, "DATADIS", 0, { ink: INK.RED });
  K.gate(12.5, 11, 23, "API", 0, { ink: INK.PURPLE });
  for (const x of [-8.5, 8.5]) K.wall(x - 1.2, x + 1.2, 12, 120, 0, 3.4, INK.BLACK, { tone: 0.42 }); // tabiques entre caminos

  // ── DATADIS: recto pero todo te frena ──
  K.plat(-7.3, 7.3, 12, 120, 0, { ink: INK.RED, tone: 0.36 });
  K.sign("DATADIS", 0, 4.4, 13, { size: 0.8, ink: INK.RED });
  const slowZones = [[18, 24, "COLA DE PETICIONES"], [44, 50, "VALIDANDO DNI…"], [78, 85, "AUDITORÍA"]];
  for (const [z0, z1, label] of slowZones) {
    K.plat(-6, 6, z0, z1, 0.06, { ink: INK.PURPLE, tone: 0.18, t: 0.1, flags: { slow: 0.42 } });
    K.sign(label, 0, 2.6, z0, { size: 0.34, ink: INK.PURPLE });
  }
  K.plat(-6, 6, 27, 34, 0.06, { ink: INK.BLACK, tone: 0.25, t: 0.1, flags: { belt: { vx: 0, vz: -3.6 } } });
  K.sign("PIDE AUTORIZACIÓN\nOTRA VEZ", 0, 2.8, 27, { size: 0.32, ink: INK.BLACK });
  for (const z of [38, 41, 58, 62]) { K.wall(-6, 6, z, z + 0.6, 0, 0.7, INK.ORANGE, { tone: 0.15 }); }
  K.sign("CAPTCHA", 0, 1.6, 37.8, { size: 0.3, ink: INK.ORANGE, board: false });
  K.bar(0, 0.55, 54, 5.6, 1.5, { ink: INK.RED, label: "CAMBIO DE API" });
  K.pusher(-14, -6.2, 67, 69, 0, 2, 8.5, 1.3, 0, { label: "MANTENIMIENTO" });
  K.pusher(6.2, 14, 71, 73, 0, 2, -8.5, 1.2, 2, { label: "MANTENIMIENTO" });
  K.pendulum(0, 7.5, 90, 6, 0.95, 1.3, { ink: INK.RED, hammer: true, label: "503" });
  K.pendulum(0, 7.5, 97, 6, 0.95, 1.2, { ink: INK.PURPLE, hammer: true, label: "401", ph: 2 });
  K.plat(-6, 6, 102, 110, 0.06, { ink: INK.BLACK, tone: 0.25, t: 0.1, flags: { belt: { vx: 0, vz: -3.2 } } });
  K.sign("SUBE LA FOTO DEL DNI\nPOR LAS DOS CARAS", 0, 2.9, 102, { size: 0.3, ink: INK.BLACK });
  // al final, Datadis te bloquea el proceso: 5,5 s cerrado y 2 s abierto (no se puede saltar)
  K.blocker(-7.3, 7.3, 114, 4.4, 5.5, 2, 0, { label: "PROCESO BLOQUEADO POR DATADIS", size: 0.4 });
  K.sign("ESPERA A QUE SE DESBLOQUEE", 0, 5.4, 113.6, { size: 0.34, ink: INK.RED });
  K.checkpoint(56, -6, 6, { x0: -4, x1: 4, z: 56.5, y: 0 });
  K.checkpoint(86, -6, 6, { x0: -4, x1: 4, z: 87, y: 0 });

  // ── FTP: curvas y el suelo se cae a tus pies; bifurcación por distribuidora ──
  const ftpTiles = [];
  function ftpLane(xc, z0, z1, amp, freq, ph, ink) {
    const wps = [];
    for (let z = z0; z < z1; z += 2) {
      const x = xc + amp * Math.sin((z - z0) / freq + ph);
      const s = K.fallTile(K.plat(x - 1.5, x + 1.5, z + 0.05, z + 1.95, 0, { ink, tone: 0.3 }), 0.85, 2.5);
      ftpTiles.push(s);
      wps.push({ x, z: z + 1 });
    }
    return wps;
  }
  K.plat(-26, -11, 12, 16, 0, { ink: INK.ORANGE });
  const ftpA = ftpLane(-18, 16, 28, 3, 5, 0, INK.ORANGE);
  // bifurcación 1: i-DE · E-DISTRIBUCIÓN
  K.plat(-26, -11, 28, 31, 0, { ink: INK.ORANGE });
  K.sign("I-DE", -22, 2.3, 31, { size: 0.42, ink: INK.GREEN });
  K.sign("E-DISTRIBUCIÓN", -14.5, 2.3, 31, { size: 0.32, ink: INK.BLUE });
  const ide = ftpLane(-22, 31, 53, 1.6, 4, 0, INK.GREEN);
  const edis = ftpLane(-14.5, 31, 53, 1.6, 4, 2, INK.BLUE);
  K.plat(-26, -11, 53, 58, 0, { ink: INK.ORANGE });
  K.checkpoint(55, -26, -11, { x0: -22, x1: -15, z: 55.5, y: 0 });
  // bifurcación 2: ASEME · UFD · CIDE (CIDE tiene letrero pero no hay camino)
  K.sign("ASEME", -23.5, 2.3, 58, { size: 0.42, ink: INK.PURPLE });
  K.sign("UFD", -18.5, 2.3, 58, { size: 0.42, ink: INK.RED });
  K.sign("CIDE", -13.5, 2.3, 58, { size: 0.42, ink: INK.BLACK });
  const aseme = ftpLane(-23.5, 58, 82, 1.1, 3.5, 0, INK.PURPLE);
  const ufd = ftpLane(-18.5, 58, 82, 1.1, 3.5, 1.5, INK.RED);
  K.plat(-26, -11, 82, 87, 0, { ink: INK.ORANGE });
  K.checkpoint(84, -26, -11, { x0: -22, x1: -15, z: 85, y: 0 });
  // E-REDES: su propio tramo, con más curvas
  K.sign("E-REDES", -18.5, 2.3, 87, { size: 0.42, ink: INK.GREEN });
  const eredes = ftpLane(-18.5, 87, 113, 4.2, 4, 0, INK.GREEN);
  K.plat(-26, -11, 113, 120, 0, { ink: INK.ORANGE });

  // ── API: corto pero de precisión ──
  K.plat(11, 23, 12, 16, 0, { ink: INK.PURPLE });
  const tok = [];
  for (let i = 0; i < 5; i++) {
    const z = 17.5 + i * 4.4, x = 17 + (i % 2 ? 2 : -2);
    tok.push(K.blink(K.plat(x - 1.6, x + 1.6, z, z + 2.6, 0, { ink: INK.PURPLE, tone: 0.2 }), 2.4, 1.1, i * 0.7));
  }
  K.sign("TOKEN\nCADUCA EN 1H", 17, 2.8, 16, { size: 0.32, ink: INK.PURPLE });
  K.plat(11, 23, 40, 44, 0, { ink: INK.PURPLE });
  K.checkpoint(41, 11, 23, { x0: 14, x1: 20, z: 42, y: 0 });
  const pag = [];
  for (let i = 0; i < 4; i++) {
    const z = 46 + i * 6;
    const s = K.plat(15, 19, z, z + 3.4, 0, { ink: RAINBOW[i], tone: 0.25 });
    K.mover(s, K.sine(3, 0, 0, 1.2 + i * 0.15, i * 1.6));
    pag.push(s);
  }
  K.sign("PAGINACIÓN", 17, 2.6, 44, { size: 0.36, ink: INK.BLUE });
  K.plat(11, 23, 70, 75, 0, { ink: INK.PURPLE });
  K.disc(17, 82, 0, 5.6, 0.9, { ink: INK.ORANGE, bar: true, barW: -2.2, label: "429" });
  K.sign("429 RATE LIMIT", 17, 3.2, 75, { size: 0.36, ink: INK.RED });
  K.plat(15.6, 18.4, 75, 76.8, 0, { ink: INK.PURPLE });
  K.plat(15.6, 18.4, 87.4, 92, 0, { ink: INK.PURPLE });
  K.checkpoint(90, 11, 23, { x0: 16, x1: 18, z: 90, y: 0 });
  K.plat(13, 21, 92, 96, 0.25, { ink: INK.GREEN, tone: 0.05, flags: { bounce: 16, launch: 10 } });
  K.sign("OAUTH 2.0", 17, 2.8, 92, { size: 0.36, ink: INK.GREEN });
  K.plat(11, 23, 102, 120, 0, { ink: INK.PURPLE });

  // ── todos a la base de datos de Clevergy ──
  K.plat(-28, 26, 120, 142, 0, { ink: INK.GREEN, tone: 0.32 });
  K.gate(122, -26, 24, "CONSUMO", 1, { ink: INK.GREEN, h: 4.6 });
  K.sign("SE VUELCA EN LA BASE DE DATOS DE CLEVERGY", 0, 4.2, 141.5, { size: 0.5, ink: INK.GREEN });
  database(K, 0, 0, 152);

  const ftp = [W(ftpA), W([{ x: -18, z: 29 }]),
    { id: "f1", alts: [{ segs: [W(ide)], w: 1 }, { segs: [W(edis)], w: 1 }] },
    W([{ x: -18.5, z: 55 }]),
    { id: "f2", alts: [{ segs: [W(aseme)], w: 1 }, { segs: [W(ufd)], w: 1 }, { segs: [W(line(-13.5, 59, -13.5, 81, 3))], w: 1, dead: "fall", z0: 58, z1: 82 }] },
    W([{ x: -18.5, z: 84 }]), W(eredes), W(line(-18.5, 114, -14, 119, 3))];
  const datadis = [W(line(0, 14, 0, 119, 3).map((p, i) => ({ ...p, x: p.z > 64 && p.z < 75 ? 0 : (i % 3 - 1) * 1.6 })))];
  const api = [W([{ x: 17, z: 15 }]), W(tok.map((s) => ({ x: (s.x0 + s.x1) / 2, z: s.z0 + 1.3 }))), W([{ x: 17, z: 42 }]),
    W(pag.map((s) => ({ x: 17, z: s.bz, follow: s }))), W([{ x: 17, z: 72 }, { x: 17, z: 76 }, { x: 17, z: 80 }, { x: 17, z: 84 }, { x: 17, z: 88.5 }, { x: 17, z: 93.5 }]), W(line(17, 105, 17, 119, 3))];
  return {
    key: "consumo", num: 2, title: "Consigue el consumo", subtitle: "Datadis, FTP de la distribuidora o API: tú eliges",
    checklist: ["Fuente de datos", "Consumo"],
    finish: { z: 132, x0: -28, x1: 26, y: 0 },
    killY: -9, time: 160, qualify: 0.78, ink: INK.GREEN,
    tip: "Datadis es recto pero te frena (aunque saltes) y al final te bloquea el proceso; en el FTP el suelo se cae y CIDE no lleva a ningún sitio",
    ftpTiles,
    path: [
      W([{ x: 0, z: -2 }, { x: 0, z: 4 }]),
      { id: "src", alts: [{ segs: ftp, w: 1 }, { segs: datadis, w: 1.2 }, { segs: api, w: 1 }], pre: [[-18, 10], [0, 10], [17, 10]] },
      W(line(0, 124, 0, 138, 3))
    ]
  };
}

// ════════════════════════════════════════════════════════════════════════════
// RONDA 3 · CONECTA CON EL INVERSOR SOLAR
// ════════════════════════════════════════════════════════════════════════════
const BRANDS = [
  { n: "HUAWEI", ink: INK.RED, kind: "open" },
  { n: "FRONIUS", ink: INK.BLACK, kind: "open" },
  { n: "GOODWE", ink: INK.BLUE, kind: "trap" },
  { n: "SUNGROW", ink: INK.ORANGE, kind: "open" },
  { n: "SIGENERGY", ink: INK.PURPLE, kind: "locked" }
];
function level3(K, seed) {
  const r = rng(seed);
  const X0 = -11, X1 = 11;
  K.plat(X0, X1, -8, 16, 0, { ink: INK.ORANGE, tone: 0.34 });
  K.sign("RONDA 3 · CONECTA CON EL INVERSOR\nELIGE TU MARCA", 0, 6.2, 15, { size: 0.5, ink: INK.ORANGE });
  K.checkpoint(-7, X0, X1, { x0: -6, x1: 6, z: -3, y: 0 });
  // las cinco puertas (en orden distinto cada partida)
  const order = shuffle(BRANDS, r);
  const xs = [-8.4, -4.2, 0, 4.2, 8.4];
  order.forEach((b, i) => {
    K.door(xs[i] - 1.85, xs[i] + 1.85, 17, 0, 3.6, b.kind, b.n, b.ink);
    if (b.kind !== "trap") K.plat(xs[i] - 2.1, xs[i] + 2.1, 17.3, 25, 0, { ink: b.ink, tone: 0.32 });
  });
  for (const x of [-11, -6.3, -2.1, 2.1, 6.3, 11]) { K.wall(x - 0.25, x + 0.25, 16.7, 17.3, 0, 3.6, INK.BLACK, { tone: 0.3 }); K.wall(x - 0.15, x + 0.15, 17.3, 25, 0, 3.6, INK.BLACK, { tone: 0.42 }); }
  K.wall(X0, X1, 16.7, 17.3, 3.6, 5, INK.BLACK, { tone: 0.3 });
  K.plat(X0, X1, 25, 34, 0, { ink: INK.ORANGE });
  K.gate(26, X0, X1, "INVERSOR CONECTADO ✓", 0, { h: 4.6 });
  K.checkpoint(27, X0, X1, { x0: -5, x1: 5, z: 28, y: 0 });

  // 1 · LEE LA DOCUMENTACIÓN: páginas que suben y bajan
  K.sign("1 · LÉETE LA DOCUMENTACIÓN DE LA API", 0, 4.4, 33.5, { size: 0.48, ink: INK.BLUE });
  const pages = ["AUTH", "ENDPOINTS", "RATE LIMIT", "PÁG. 213", "ANEXO B"];
  const pg = pages.map((p, i) => {
    const z = 36 + i * 5, x = (i % 2 ? 1.6 : -1.6);
    const s = K.plat(x - 2.4, x + 2.4, z, z + 3.4, 0, { ink: INK.BLACK, tone: 0.55 });
    K.mover(s, K.sine(0, 0.7, 0, 1.2 + i * 0.1, i * 1.2));
    const t = K.sign(p, x, 0.45, z + 1.6, { size: 0.36, ink: INK.BLUE, board: false });
    t.rotation.set(-Math.PI / 2, 0, Math.PI); s.g.add(t); K.root.remove(t);
    return s;
  });
  book(K, -15, 0, 46);
  K.plat(X0, X1, 61, 66, 0, { ink: INK.ORANGE });
  K.gate(62, X0, X1, "DOCUMENTACIÓN ✓", 1);
  K.checkpoint(63, X0, X1, { x0: -5, x1: 5, z: 64, y: 0 });

  // 2 · PRUEBA LOS ENDPOINTS: péndulos de errores
  K.plat(X0, X1, 66, 96, 0, { ink: INK.BLUE, tone: 0.32 });
  K.sign("2 · PRUEBA LOS ENDPOINTS", 0, 4.4, 66.5, { size: 0.48, ink: INK.BLUE });
  [["GET /TOKEN", 71, "401"], ["GET /PLANTS", 77, "500"], ["GET /REALTIME", 83, "TIMEOUT"], ["GET /HISTORY", 89, "429"]].forEach(([ep, z, err], i) => {
    K.sign(ep, i % 2 ? 7.5 : -7.5, 1.4, z - 2, { size: 0.3, ink: INK.GREEN });
    K.pendulum(0, 8, z, 6.6, 1.05, 1.25 + i * 0.12, { ink: i % 2 ? INK.RED : INK.PURPLE, hammer: true, label: err, ph: i * 1.7 });
  });
  K.gate(94, X0, X1, "ENDPOINTS ✓", 2);

  // 3 · INTÉGRALO EN EL MODELO DE CLEVERGY: ruletas y rampa que registra producción
  K.sign("3 · INTÉGRALO EN EL MODELO DE CLEVERGY", 0, 4.4, 96.5, { size: 0.45, ink: INK.GREEN });
  K.checkpoint(95, X0, X1, { x0: -4, x1: 4, z: 95, y: 0 });
  K.disc(0, 101.4, 0, 5.4, 0.7, { ink: INK.GREEN, bar: true, barW: 1.25, label: "MODELO" });
  K.plat(-1.3, 1.3, 106.6, 109.2, 0, { ink: INK.GREEN });
  K.disc(0, 114.4, 0, 5.4, -0.9, { ink: INK.ORANGE, label: "KWH" });
  K.plat(-3, 3, 119.6, 123, 0, { ink: INK.GREEN });
  K.ramp(-3, 3, 123, 131, 0, 3, { ink: INK.ORANGE, flags: { belt: { vx: 0, vz: -2.4 } } });
  K.sign("REGISTRA PRODUCCIÓN", 0, 2.6, 123, { size: 0.36, ink: INK.ORANGE });
  K.plat(-6, 6, 131, 136, 3, { ink: INK.GREEN, t: 3.8 });
  K.gate(132, -6, 6, "PRODUCCIÓN ✓", 3, { y: 3 });
  K.checkpoint(133, -6, 6, { x0: -3, x1: 3, z: 134, y: 3 });

  // 4 · VINCULA LA INSTALACIÓN AL USUARIO
  K.sign("4 · VINCULA LA INSTALACIÓN AL USUARIO", 0, 10.6, 135.5, { size: 0.45, ink: INK.PURPLE });
  K.plat(-1.6, 1.6, 136, 152, 3, { ink: INK.PURPLE, tone: 0.3 });
  K.pusher(-9, -1.7, 140, 141.6, 3, 1.6, 6, 1.5, 0, { label: "VINCULAR" });
  K.pusher(1.7, 9, 145, 146.6, 3, 1.6, -6, 1.6, 1.4, { label: "VINCULAR" });
  K.plat(-8, 8, 152, 168, 3, { ink: INK.GREEN, tone: 0.32, t: 3.8 });
  K.sign("USUARIO CON CONSUMO Y PRODUCCIÓN ✓", 0, 7, 167.5, { size: 0.5, ink: INK.GREEN });
  house(K, -4, 3, 170, true);
  solarPanels(K, -8, 0, 40);

  return {
    key: "inversor", num: 3, title: "Conecta con el inversor solar", subtitle: "Huawei, Fronius, GoodWe, Sungrow o Sigenergy",
    checklist: ["Inversor", "Documentación", "Endpoints", "Producción", "Instalación vinculada"],
    finish: { z: 158, x0: -8, x1: 8, y: 3 },
    killY: -9, time: 170, qualify: 0.72, ink: INK.ORANGE,
    tip: "Sigenergy no abre y GoodWe abre… al vacío",
    path: [
      W(line(0, -2, 0, 13, 3)),
      { id: "door", alts: order.map((b, i) => ({ segs: [W([{ x: xs[i], z: 15.5 }, { x: xs[i], z: 19 }, { x: xs[i], z: 23.5 }])], w: 1, dead: b.kind === "open" ? null : b.kind === "trap" ? "fall" : "locked", z0: 14, z1: 25 })) },
      W(line(0, 27, 0, 33, 3)),
      W(pg.map((s) => ({ x: (s.x0 + s.x1) / 2, z: s.bz }))),
      W(line(0, 62, 0, 95, 2.5)),
      W([{ x: 0, z: 98 }, { x: 0, z: 101.4 }, { x: 0, z: 105 }, { x: 0, z: 107.8 }, { x: 0, z: 111 }, { x: 0, z: 114.4 }, { x: 0, z: 118 }, { x: 0, z: 121.2 }, ...line(0, 124, 0, 133, 3)]),
      W(line(0, 137, 0, 160, 2.5))
    ]
  };
}

// ════════════════════════════════════════════════════════════════════════════
// RONDA 4 · LA BATERÍA (final): sólo uno se la lleva
// ════════════════════════════════════════════════════════════════════════════
function level4(K, seed) {
  const X0 = -9, X1 = 9;
  K.plat(X0, X1, -8, 10, 0, { ink: INK.PURPLE, tone: 0.32 });
  K.sign("FINAL · LA BATERÍA\nSÓLO UNO SE LA LLEVA", 0, 4.6, 9.5, { size: 0.55, ink: INK.PURPLE });
  K.checkpoint(-7, X0, X1, { x0: -6, x1: 6, z: -3, y: 0 });

  // ☀ de día: las placas cargan la batería (cinta a favor y energía volando)
  K.plat(X0, X1, 10, 34, 0, { ink: INK.ORANGE, tone: 0.3 });
  K.plat(-4, 4, 12, 32, 0.06, { ink: INK.ORANGE, tone: 0.1, t: 0.1, flags: { belt: { vx: 0, vz: 3.2 } } });
  K.sign("DE DÍA, TUS PLACAS\nCARGAN LA BATERÍA", 0, 4.4, 11, { size: 0.45, ink: INK.ORANGE });
  for (const x of [X0 - 0.4, X1]) K.wall(x, x + 0.4, 10, 34, 0, 0.9, INK.BLACK, { tone: 0.3 });
  K.bar(0, 0.55, 18, 8.4, 1.6, { ink: INK.RED });
  K.bar(0, 0.55, 27, 8.4, -1.8, { ink: INK.PURPLE, ph: 1 });
  sun(K, -16, 12, 22);
  bigBattery(K, 15, 0, 22);
  energyFlow(K, -16, 12, 22, 15, 4, 22, INK.ORANGE);
  K.gate(33, X0, X1, "SE CARGA ☀", 0, { ink: INK.ORANGE });

  // 🌙 de noche: te da la energía que guardó (plataformas por la noche)
  K.sign("DE NOCHE, TE DA LA\nENERGÍA QUE GUARDÓ", -12, 4, 36, { size: 0.42, ink: INK.BLUE, rotY: Math.PI * 0.85 });
  moon(K, 16, 10, 44);
  const night = [];
  for (let i = 0; i < 4; i++) {
    const z = 36 + i * 5;
    const s = K.plat(-2, 2, z, z + 3.2, 0, { ink: RAINBOW[(i + 2) % 5], tone: 0.22 });
    K.mover(s, K.sine(3, 0, 0, 0.85 + i * 0.08, i * 1.5));
    night.push(s);
  }
  K.plat(X0, X1, 56, 60, 0, { ink: INK.BLUE });
  K.gate(57, X0, X1, "TE DA ENERGÍA 🌙", 1, { ink: INK.BLUE });
  K.checkpoint(58, X0, X1, { x0: -5, x1: 5, z: 58.5, y: 0 });

  // 💶 mercado: compra barato, vende caro (columnas del precio que suben y bajan)
  K.sign("COMPRA BARATO · VENDE CARO", 0, 6, 60, { size: 0.5, ink: INK.GREEN });
  const prices = ["0,04€", "0,08€", "0,31€", "0,12€", "0,26€"];
  const cols = prices.map((p, i) => {
    const z = 61.5 + i * 3.6;
    const s = K.plat(-1.6, 1.6, z, z + 2.6, 0.3, { ink: RAINBOW[i], tone: 0.2, t: 3 });
    K.mover(s, (t) => ({ x: 0, y: 1 + 1 * Math.sin(t * 1.1 + i * 0.9), z: 0 }));
    const lab = K.sign(p, 0, -0.3, z - 0.02, { size: 0.36, ink: INK.BLACK, board: false });
    s.g.add(lab); K.root.remove(lab);
    return s;
  });
  K.plat(X0, X1, 80, 84, 0.6, { ink: INK.GREEN });
  K.gate(81, X0, X1, "ARBITRAJE 💶", 2, { ink: INK.GREEN, y: 0.6 });

  // ⚡ flexibilidad: la red te paga por ayudarla
  K.sign("FLEXIBILIDAD: LA RED TE PAGA\nPOR MOVER TU ENERGÍA", 0, 5, 84, { size: 0.42, ink: INK.PURPLE });
  K.disc(0, 90, 0.6, 5, 1.1, { ink: INK.PURPLE, bar: true, barW: -2.2 });
  K.plat(-1.4, 1.4, 94.8, 96.4, 0.6, { ink: INK.PURPLE });
  K.disc(0, 101, 0.6, 4.6, -1.2, { ink: INK.RED });
  K.plat(X0, X1, 105.4, 111, 0.6, { ink: INK.BLUE });
  K.gate(106.5, X0, X1, "FLEXIBILIDAD ⚡", 3, { ink: INK.PURPLE, y: 0.6 });
  K.checkpoint(108, X0, X1, { x0: -5, x1: 5, z: 108.5, y: 0.6 });
  K.sign("CLEVERGY AGREGA TU BATERÍA\nY LA VENDE AL MERCADO", -13, 5, 100, { size: 0.4, ink: INK.GREEN, rotY: Math.PI * 0.8 });
  coins(K, 13, 3, 98);

  // la torre: escaleras con bifurcación izquierda/derecha y obstáculos
  const step = 0.45, tread = 1.2;
  let y = 0.6, z = 111;
  const stairs = (x0, x1, z0, n, y0, inkOff = 0) => {
    for (let i = 0; i < n; i++) K.plat(x0, x1, z0 + i * tread, z0 + (i + 1) * tread, y0 + (i + 1) * step, { ink: RAINBOW[(i + inkOff) % 5], tone: 0.25, t: 0.6 + step });
    return y0 + n * step;
  };
  // tramo 1: izquierda y derecha
  const yL1 = stairs(-8, -3, z, 12, y, 0);
  stairs(3, 8, z, 12, y, 2);
  K.pendulum(-5.5, y + 6 * step + 5.5, z + 7, 4.6, 1.1, 1.4, { ink: INK.RED });
  K.pusher(-14, -8.2, z + 4, z + 5.6, y + 2, 1.6, 6, 1.6, 0, { ink: INK.ORANGE });
  K.pendulum(5.5, y + 4.5 * step + 5.5, z + 5, 4.6, 1.1, 1.3, { ink: INK.PURPLE, ph: 1.5 });
  K.pendulum(5.5, y + 8.5 * step + 5.5, z + 10, 4.6, 1.1, 1.5, { ink: INK.GREEN, ph: 0.4 });
  z += 12 * tread; y = yL1;
  K.plat(-9, 9, z, z + 4, y, { ink: INK.BLUE, tone: 0.3, t: 1.2 });
  K.bar(0, y + 0.55, z + 2, 4.5, 2, { ink: INK.RED });
  K.checkpoint(z + 1, -9, 9, { x0: -7, x1: 7, z: z + 1.5, y });
  const cp1 = z;
  z += 4;
  // tramo 2: a la izquierda falta un peldaño (hay que saltar); a la derecha, empujadores
  const n2 = 11;
  for (let i = 0; i < n2; i++) if (i !== 4 && i !== 5) K.plat(-8, -3, z + i * tread, z + (i + 1) * tread, y + (i + 1) * step, { ink: RAINBOW[i % 5], tone: 0.25, t: 0.6 + step });
  stairs(3, 8, z, n2, y, 3);
  K.pusher(8.2, 14, z + 3.6, z + 5, y + 2, 1.5, -5.4, 1.7, 0.5, { ink: INK.RED });
  K.pusher(8.2, 14, z + 8.4, z + 9.8, y + 4.2, 1.5, -5.4, 1.5, 2.2, { ink: INK.PURPLE });
  const y2 = y + n2 * step;
  z += n2 * tread; y = y2;
  K.plat(-9, 9, z, z + 4, y, { ink: INK.PURPLE, tone: 0.3, t: 1.2 });
  K.checkpoint(z + 1, -9, 9, { x0: -7, x1: 7, z: z + 1.5, y });
  K.pendulum(0, y + 6, z + 2, 4.8, 1.0, 1.6, { ink: INK.ORANGE });
  const cp2 = z;
  z += 4;
  // tramo final, en el centro
  const yT = stairs(-3, 3, z, 5, y, 1);
  z += 5 * tread;
  K.plat(-4.5, 4.5, z, z + 9, yT, { ink: INK.GREEN, tone: 0.3, t: 1.4 });
  const top = { y: yT, z: z + 6 };
  // la batería, flotando
  const bat = new THREE.Group();
  bat.userData.dyn = true;
  bat.position.set(0, yT + 2.75, top.z);
  K.root.add(bat);
  const body = K.mesh(GEO.box, INK.GREEN, { tone: 0.02 }, 1.3, 1.9, 0.8, 0, 0, 0, bat);
  K.mesh(GEO.box, INK.BLACK, { fill: true }, 0.5, 0.25, 0.5, 0, 1.05, 0, bat);
  const cells = [0, 1, 2, 3].map((k) => K.mesh(GEO.box, INK.GREEN, { fill: true }, 1.0, 0.32, 0.84, 0, -0.65 + k * 0.42, 0, bat));
  const lbl = K.sign("CLEVERGY", 0, 0, -0.43, { size: 0.2, ink: INK.BLACK, board: false });
  bat.add(lbl); K.root.remove(lbl); lbl.position.set(0, 0, -0.43);
  const halo = K.mesh(GEO.torus, INK.ORANGE, { fill: true }, 3.2, 3.2, 3.2, 0, 0, 0, bat);
  K.anims.push((t) => {
    bat.rotation.y = t * 1.2;
    bat.position.y = yT + 2.75 + Math.sin(t * 2.2) * 0.18;
    halo.rotation.x = t * 1.5;
    cells.forEach((c, k) => (c.visible = k <= Math.floor(t * 2) % 5));
    body.material = c4(t);
  });
  K.sign("¡SALTA Y COGE LA BATERÍA!", 0, yT + 5.6, top.z + 3.2, { size: 0.5, ink: INK.GREEN });
  confettiPoles(K, top.z, yT);

  const st = (x, z0, n, y0) => line(x, z0 + 0.6, x, z0 + (n - 0.5) * tread, tread);
  return {
    key: "bateria", num: 4, title: "La batería", subtitle: "Cómo funciona y cómo gana dinero en el mercado de flexibilidad",
    checklist: ["Se carga con el sol", "Te da energía de noche", "Arbitraje", "Flexibilidad", "Consentimiento ✓"],
    final: true, battery: { x: 0, y: yT + 2.75, z: top.z, r: 1.1, group: bat },
    finish: null, killY: -9, time: 200, ink: INK.PURPLE,
    tip: "Sube por la torre y salta a por la batería: sólo hay una",
    path: [
      W(line(0, -2, 0, 33, 3).map((p, i) => ({ ...p, x: (i % 2 ? 2 : -2) }))),
      W(night.map((s) => ({ x: 0, z: s.bz, follow: s }))),
      W(line(0, 57, 0, 60, 3)),
      W(cols.map((s) => ({ x: 0, z: s.bz, follow: s }))),
      W([{ x: 0, z: 82 }, { x: 0, z: 86 }, { x: 0, z: 90 }, { x: 0, z: 94 }, { x: 0, z: 95.6 }, { x: 0, z: 98 }, { x: 0, z: 101 }, { x: 0, z: 104 }, { x: 0, z: 107 }, { x: 0, z: 110 }]),
      { id: "t1", alts: [{ segs: [W(st(-5.5, 111, 12))], w: 1 }, { segs: [W(st(5.5, 111, 12))], w: 1 }] },
      W([{ x: 0, z: cp1 + 2 }]),
      { id: "t2", alts: [{ segs: [W(st(-5.5, cp1 + 4, n2))], w: 1 }, { segs: [W(st(5.5, cp1 + 4, n2))], w: 1 }] },
      W([{ x: 0, z: cp2 + 2 }]),
      W([...line(0, cp2 + 4.6, 0, cp2 + 4 + 5 * tread, tread), { x: 0, z: top.z - 1.2 }, { x: 0, z: top.z, jump: true }])
    ]
  };
}
const c4 = (t) => mat(RAINBOW[Math.floor(t * 1.5) % 5], { tone: 0.02 });

// ── decorados ──
function house(K, x, y, z, solar = false) {
  K.boxMesh(x - 3, y, z, x + 3, y + 4, z + 5, INK.ORANGE, { tone: 0.3 });
  const roof = K.mesh(GEO.cone, INK.RED, { tone: 0.05 }, 9, 2.6, 7, x, y + 5.3, z + 2.5);
  roof.rotation.y = Math.PI / 4;
  K.boxMesh(x - 0.7, y, z - 0.05, x + 0.7, y + 2.2, z + 0.05, INK.BLACK, { tone: 0.1 });
  for (const sx of [-1.9, 1.9]) K.boxMesh(x + sx - 0.6, y + 2, z - 0.05, x + sx + 0.6, y + 3, z + 0.05, INK.BLUE, { tone: 0.3 });
  if (solar) for (const sx of [-1.6, 1.6]) { const p = K.mesh(GEO.box, INK.BLUE, { tone: -0.05 }, 2.4, 0.1, 1.8, x + sx, y + 5.5, z + 1.2); p.rotation.x = -0.55; }
  // el usuario
  K.mesh(GEO.sph, INK.ORANGE, { tone: 0.3 }, 1.2, 1.2, 1.2, x + 5, y + 2.5, z + 1);
  K.mesh(GEO.cyl, INK.BLUE, { tone: 0.1 }, 1.4, 1.8, 1.4, x + 5, y + 0.9, z + 1);
}
function database(K, x, y, z) {
  for (let k = 0; k < 3; k++) {
    K.mesh(GEO.cyl, INK.GREEN, { tone: 0.12 + k * 0.08 }, 8, 2.4, 8, x, y + 1.2 + k * 2.7, z);
    K.mesh(GEO.torus, INK.BLACK, { fill: true }, 8.1, 8.1, 4, x, y + 2.45 + k * 2.7, z).rotation.x = Math.PI / 2;
  }
  K.sign("CLEVERGY DB", x, y + 4, z - 4.1, { size: 0.8, ink: INK.GREEN });
  // datos cayendo dentro
  const bits = [];
  for (let i = 0; i < 26; i++) {
    const m = K.mesh(GEO.box, RAINBOW[i % 5], { fill: true }, 0.35, 0.35, 0.35, x, y + 12, z);
    bits.push({ m, ph: i / 26, sx: (Math.random() - 0.5) * 30, sz: -20 - Math.random() * 10 });
  }
  K.anims.push((t) => {
    for (const b of bits) {
      const k = (t * 0.35 + b.ph) % 1;
      b.m.position.set(x + b.sx * (1 - k), y + 9 + Math.sin(k * Math.PI) * 8, z + b.sz * (1 - k));
      b.m.rotation.set(t * 3, t * 2, 0);
    }
  });
}
function book(K, x, y, z) {
  for (const s of [-1, 1]) { const p = K.mesh(GEO.box, INK.BLACK, { tone: 0.58 }, 4.2, 0.2, 6, x + s * 2.1, y + 2 + 0.3, z); p.rotation.z = s * 0.18; }
  K.mesh(GEO.box, INK.BLUE, { tone: 0.1 }, 8.8, 0.3, 6.4, x, y + 1.9, z);
  K.sign("API DOCS\nV3.7.2", x, y + 4.4, z, { size: 0.5, ink: INK.BLUE });
}
function solarPanels(K, x, y, z) {
  for (let i = 0; i < 6; i++) {
    const p = K.mesh(GEO.box, INK.BLUE, { tone: -0.05 }, 3.4, 0.12, 2.2, x - 10 - (i % 2) * 4, y + 1.2, z + 20 + Math.floor(i / 2) * 3.2);
    p.rotation.x = -0.5;
  }
}
function sun(K, x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  K.root.add(g);
  K.mesh(GEO.sph, INK.ORANGE, { tone: -0.05 }, 5, 5, 5, 0, 0, 0, g);
  for (let k = 0; k < 10; k++) { const a = (k / 10) * Math.PI * 2; const m = K.mesh(GEO.box, INK.ORANGE, { fill: true }, 0.3, 2.2, 0.3, Math.cos(a) * 3.9, Math.sin(a) * 3.9, 0, g); m.rotation.z = a - Math.PI / 2; }
  K.anims.push((t) => { g.rotation.z = t * 0.6; });
}
function moon(K, x, y, z) {
  K.mesh(GEO.sph, INK.BLUE, { tone: 0.3 }, 4.4, 4.4, 4.4, x, y, z);
  K.mesh(GEO.sph, INK.BLACK, { tone: 0.62 }, 3.8, 3.8, 3.8, x - 1.4, y + 0.6, z - 0.8);
  for (let i = 0; i < 8; i++) K.mesh(GEO.sph, INK.ORANGE, { fill: true }, 0.3, 0.3, 0.3, x - 8 + i * 2.4, y + 3 + (i % 3) * 1.5, z + 6);
}
function bigBattery(K, x, y, z) {
  K.boxMesh(x - 2, y, z - 1.5, x + 2, y + 7, z + 1.5, INK.GREEN, { tone: 0.15 });
  K.boxMesh(x - 0.8, y + 7, z - 0.8, x + 0.8, y + 7.6, z + 0.8, INK.BLACK, { fill: true });
  const cells = [0, 1, 2, 3, 4].map((k) => K.boxMesh(x - 2.05, y + 0.6 + k * 1.25, z - 1.2, x - 1.95, y + 1.5 + k * 1.25, z + 1.2, RAINBOW[k], { fill: true }));
  K.anims.push((t) => cells.forEach((c, k) => (c.visible = k <= Math.floor(t * 1.4) % 6 - 1)));
}
function energyFlow(K, x0, y0, z0, x1, y1, z1, ink) {
  const dots = [];
  for (let i = 0; i < 14; i++) dots.push(K.mesh(GEO.sph, i % 2 ? ink : INK.GREEN, { fill: true }, 0.6, 0.6, 0.6, x0, y0, z0));
  K.anims.push((t) => dots.forEach((d, i) => {
    const k = (t * 0.4 + i / dots.length) % 1;
    d.position.set(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * 6, z0 + (z1 - z0) * k);
  }));
}
function coins(K, x, y, z) {
  const cs = [];
  for (let i = 0; i < 6; i++) { const m = K.mesh(GEO.cyl, INK.ORANGE, { tone: -0.05 }, 1.4, 0.25, 1.4, x, y + i * 1.6, z); m.rotation.x = Math.PI / 2; cs.push(m); }
  K.sign("€", x, y + 10.5, z, { size: 1.6, ink: INK.GREEN, board: false });
  K.anims.push((t) => cs.forEach((c, i) => { c.rotation.z = t * 2 + i; c.position.y = y + i * 1.6 + Math.sin(t * 2 + i) * 0.3; }));
}
function confettiPoles(K, z, y) {
  for (const sx of [-6, 6]) {
    K.boxMesh(sx - 0.2, y - 1, z - 0.2, sx + 0.2, y + 8, z + 0.2, INK.BLACK, { tone: 0.3 });
    const g = new THREE.Group(); g.position.set(sx, y + 8, z); K.root.add(g);
    RAINBOW.forEach((ink, k) => K.mesh(GEO.box, ink, { fill: true }, 0.25, 1.6, 0.25, Math.cos(k * 1.26) * 0.9, 0, Math.sin(k * 1.26) * 0.9, g));
    K.anims.push((t) => { g.rotation.y = t * 2; });
  }
}

export const LEVELS = [level1, level2, level3, level4];
export const LEVEL_INFO = [
  { title: "Crea el usuario y la casa", icon: "🏠" },
  { title: "Consigue el consumo", icon: "📊" },
  { title: "Conecta con el inversor", icon: "☀️" },
  { title: "La batería", icon: "🔋" }
];
