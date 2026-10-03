// =============================================================================
// fightStage.js — RETRO FIGHT: la gran sala de retrospectiva convertida en arena
//
// Escenario estilo "Battlefield" ambientado en una retrospectiva real del equipo:
// · Mesa de reunión central gigante con planos, notas, cafés, portátiles y marcadores.
// · 3 plataformas atravesables: libretas / clips de post-its ("IDEAS", "A MEJORAR", "ACTION!").
// · Enorme pizarra de fondo dividida en las 4 columnas de EasyRetro:
//   - QUÉ HA IDO BIEN (verde)
//   - A MEJORAR (rojo / rosa)
//   - PREGUNTAS (azul)
//   - ACTION ITEMS (morado)
//   repletas de post-its, votos, comentarios, marcas de rotulador y easter eggs.
// · Público al fondo: los compañeros de Clevergy animando tras la mesa.
// · Game feel: tarjetas que vuelan al golpear, votos que vibran, rebote al aterrizar
//   y celebración con "ACTION ITEM COMPLETED" al ganar.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "../doodleRender.js";
import { GEO } from "../doodleLevel.js";
import { inkText } from "../inkText.js";

export const FIGHT_Z = 0.4; // profundidad del plano de lucha
// la mesa de reunión principal (sólida: no se atraviesa desde abajo)
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

const rnd = (a, b) => a + Math.random() * (b - a);

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

  // ─────────────────────────────────────────────────────────────────────────
  // 1. LA MESA DE RETROSPECTIVA (ARENA PRINCIPAL y = 0)
  // ─────────────────────────────────────────────────────────────────────────
  const W = MAIN.x1 - MAIN.x0;
  const desk = new THREE.Group();
  root.add(desk);

  // Tablero de madera de la mesa de conferencias
  box(0, -MAIN.depth, FIGHT_Z - 0.4, W, MAIN.depth, 3.6, INK.BLACK, { tone: 0.15 }, desk); // estructura inferior
  box(0, -0.22, FIGHT_Z - 0.4, W + 0.35, 0.22, 3.8, INK.ORANGE, { tone: 0.12 }, desk); // superficie madera clara
  box(0, -0.45, FIGHT_Z + 1.48, W + 0.35, 0.32, 0.12, INK.ORANGE, { tone: -0.05 }, desk); // canto frontal

  // Patas robustas y viga de la mesa
  for (const s of [-1, 1]) {
    box(s * (W / 2 + 0.06), -MAIN.depth, FIGHT_Z - 0.4, 0.28, MAIN.depth + 0.02, 3.8, INK.ORANGE, { tone: -0.08 }, desk); // bordes de agarre
    box(s * 6.2, -MAIN.depth - 1.2, FIGHT_Z - 0.4, 0.7, MAIN.depth + 1.2, 2.6, INK.BLACK, { tone: 0.18 }, desk); // patas
  }
  box(0, -MAIN.depth - 0.4, FIGHT_Z - 0.4, 12, 0.24, 0.3, INK.BLACK, { tone: 0.15 }, desk); // travesaño

  // Papel de rotafolio / blueprint desplegado sobre la mesa
  box(0, -0.01, FIGHT_Z - 0.3, W - 0.8, 0.02, 3.0, INK.BLUE, { tone: 0.46 }, desk); // papel blanco
  for (let x = -7.0; x <= 7.0; x += 1.4) {
    box(x, 0.005, FIGHT_Z - 0.3, 0.03, 0.01, 2.8, INK.BLUE, { tone: 0.35 }, desk); // líneas de cuadrícula
  }
  for (let z = -1.2; z <= 1.2; z += 0.8) {
    box(0, 0.005, FIGHT_Z - 0.3 + z, W - 1.2, 0.01, 0.03, INK.BLUE, { tone: 0.35 }, desk);
  }

  // Círculo central "RETRO" dibujado en la mesa a boli azul
  const retroRing = new THREE.Mesh(GEO.torus, mat(INK.BLUE, { fill: true }));
  retroRing.scale.set(1.4, 1.4, 0.04);
  retroRing.rotation.x = Math.PI / 2;
  retroRing.position.set(0, 0.01, FIGHT_Z - 0.3);
  desk.add(retroRing);

  const retroTxt = inkText("RETRO", { size: 0.65, ink: INK.BLUE });
  retroTxt.rotation.x = -Math.PI / 2;
  retroTxt.position.set(0, 0.015, FIGHT_Z - 0.3);
  desk.add(retroTxt);

  // Post-its pegados sobre la superficie de la mesa (reaccionan sutilmente al pisar)
  const deskNotes = [];
  const deskNoteColors = [INK.GREEN, INK.RED, INK.BLUE, INK.PURPLE, INK.ORANGE];
  for (let i = 0; i < 14; i++) {
    const nx = -6.8 + i * 1.05 + rnd(-0.2, 0.2);
    const nz = FIGHT_Z - 0.3 + rnd(-0.9, 0.9);
    const col = deskNoteColors[i % deskNoteColors.length];
    const n = box(nx, 0.01, nz, 0.55, 0.02, 0.55, col, { tone: 0.15 }, desk);
    n.rotation.y = rnd(-0.4, 0.4);
    // raya simulando texto a boli
    box(0, 0.015, 0, 0.35, 0.01, 0.04, INK.BLACK, { fill: true }, n);
    deskNotes.push({ mesh: n, baseRot: n.rotation.y, baseY: 0.01, hop: 0 });
  }

  // Portátiles Clevergy en los laterales de la mesa
  for (const [lx, rz] of [[-5.2, 0.15], [5.2, -0.15]]) {
    const lap = new THREE.Group();
    lap.position.set(lx, 0.01, FIGHT_Z - 1.1);
    lap.rotation.y = rz;
    desk.add(lap);
    box(0, 0, 0, 1.25, 0.05, 0.85, INK.BLACK, { tone: 0.2 }, lap); // base teclado
    box(0, 0.05, 0.1, 1.1, 0.01, 0.55, INK.BLACK, { tone: 0.1 }, lap); // teclado
    const screenG = new THREE.Group();
    screenG.position.set(0, 0.05, -0.4);
    screenG.rotation.x = -0.35; // pantalla abierta
    lap.add(screenG);
    box(0, 0.4, 0, 1.25, 0.82, 0.04, INK.BLACK, { tone: 0.18 }, screenG);
    box(0, 0.4, 0.025, 1.15, 0.72, 0.01, INK.BLUE, { tone: 0.4 }, screenG); // pantalla encendida
    // Hoja verde Clevergy en la tapa trasera
    const leaf = new THREE.Mesh(GEO.cone, mat(INK.GREEN, { fill: true }));
    leaf.scale.set(0.2, 0.32, 0.05);
    leaf.position.set(0, 0.4, -0.025);
    leaf.rotation.z = Math.PI / 4;
    screenG.add(leaf);
  }

  // Tazas de café sobre la mesa
  // Taza izquierda: "BEST TEAM"
  const mugLeft = new THREE.Group();
  mugLeft.position.set(-6.2, 0.01, FIGHT_Z - 0.7);
  desk.add(mugLeft);
  cyl(0, 0, 0, 0.28, 0.65, INK.BLACK, { tone: 0.48 }, mugLeft);
  const handleL = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { tone: 0.3 }));
  handleL.scale.set(0.18, 0.24, 0.06);
  handleL.position.set(-0.32, 0.32, 0);
  handleL.rotation.y = Math.PI / 2;
  mugLeft.add(handleL);
  const bestTxt = inkText("BEST TEAM", { size: 0.16, ink: INK.BLACK });
  bestTxt.position.set(0, 0.34, 0.29);
  mugLeft.add(bestTxt);

  // Taza derecha: "CAFÉ = POWER"
  const mugRight = new THREE.Group();
  mugRight.position.set(6.2, 0.01, FIGHT_Z - 0.7);
  desk.add(mugRight);
  cyl(0, 0, 0, 0.28, 0.65, INK.BLACK, { tone: 0.48 }, mugRight);
  const handleR = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { tone: 0.3 }));
  handleR.scale.set(0.18, 0.24, 0.06);
  handleR.position.set(0.32, 0.32, 0);
  handleR.rotation.y = Math.PI / 2;
  mugRight.add(handleR);
  const cafeTxt = inkText("CAFE=POWER", { size: 0.14, ink: INK.ORANGE });
  cafeTxt.position.set(0, 0.34, 0.29);
  mugRight.add(cafeTxt);

  // Montones de cuadernos, tacos de post-its y rotuladores en los extremos
  // Montón izquierdo: papeles de colores
  for (let k = 0; k < 4; k++) {
    const padInk = [INK.PURPLE, INK.BLUE, INK.GREEN, INK.ORANGE][k];
    box(-7.2 + k * 0.04, k * 0.09, FIGHT_Z + 0.1, 1.1, 0.08, 1.3, padInk, { tone: 0.1 }, desk);
  }
  // Rotulador azul en la mesa
  const marker = cyl(-6.8, 0.04, FIGHT_Z + 0.9, 0.06, 0.7, INK.BLUE, { fill: true }, desk);
  marker.rotation.z = Math.PI / 2;
  marker.rotation.y = 0.4;

  // Montón derecho: taco cuadrado de notas amarillas y portalápices
  box(7.2, 0, FIGHT_Z + 0.1, 0.8, 0.45, 0.8, INK.ORANGE, { tone: 0.1 }, desk);
  cyl(7.1, 0, FIGHT_Z - 0.8, 0.22, 0.55, INK.BLACK, { tone: 0.2 }, desk); // cubilete
  for (let p = 0; p < 3; p++) {
    const pen = cyl(7.1 + (p - 1) * 0.08, 0.3, FIGHT_Z - 0.8, 0.03, 0.65, [INK.BLUE, INK.RED, INK.GREEN][p], { fill: true }, desk);
    pen.rotation.z = (p - 1) * 0.2;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. LAS TRES PLATAFORMAS FLOTANTES (ESTILO LIBRETA / CLIPBOARD DE RETRO)
  //    (Coordenadas EXACTAS de PLATFORMS para preservar colisiones)
  // ─────────────────────────────────────────────────────────────────────────
  const platformMeshes = [];
  const platData = [
    { p: PLATFORMS[0], name: "QUE HA IDO BIEN", ink: INK.GREEN, label: "IDEAS" },
    { p: PLATFORMS[1], name: "A MEJORAR", ink: INK.RED, label: "MEJORAR" },
    { p: PLATFORMS[2], name: "ACTION ITEMS", ink: INK.PURPLE, label: "ACTION!" }
  ];

  for (const { p, ink, label } of platData) {
    const w = p.x1 - p.x0, cx = (p.x0 + p.x1) / 2;
    const pg = new THREE.Group();
    pg.position.set(cx, p.y, FIGHT_Z);
    root.add(pg);

    // Base de cartón / tablero de la libreta
    box(0, -0.22, -0.2, w, 0.22, 1.8, INK.ORANGE, { tone: 0.05 }, pg);
    // Hojas de notas de color en la superficie
    box(0, -0.04, -0.15, w - 0.2, 0.08, 1.6, ink, { tone: 0.12 }, pg);

    // Pinza metálica superior (binder clip)
    box(0, 0.02, 0.65, 0.7, 0.16, 0.25, INK.BLACK, { tone: 0.25 }, pg);
    const clipRing = new THREE.Mesh(GEO.torus, mat(INK.BLACK, { fill: true }));
    clipRing.scale.set(0.24, 0.3, 0.04);
    clipRing.position.set(0, 0.18, 0.65);
    pg.add(clipRing);

    // Texto identificativo en el canto
    const tag = inkText(label, { size: 0.24, ink: INK.BLACK });
    tag.position.set(0, -0.11, 0.72);
    pg.add(tag);

    // Cintas de washi tape en las esquinas
    for (const s of [-1, 1]) {
      const tape = box(s * (w / 2 - 0.25), -0.03, 0.55, 0.35, 0.06, 0.2, INK.ORANGE, { tone: 0.25 }, pg);
      tape.rotation.y = s * 0.35;
    }

    // Cuerdas / cables de suspensión hasta el techo
    for (const s of [-1, 1]) {
      box(s * (w / 2 - 0.25), 0, -0.6, 0.03, 8.5, 0.03, INK.BLACK, { fill: true }, pg);
    }

    platformMeshes.push(pg);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. LA GRAN PIZARRA DE RETROSPECTIVA AL FONDO (4 COLUMNAS EASYRETRO)
  // ─────────────────────────────────────────────────────────────────────────
  const bg = new THREE.Group();
  bg.position.z = -5.8;
  root.add(bg);

  const BW = 22.4, BH = 9.8, BY = 1.0;

  // Fondo blanco de la pizarra (acabado blanco limpio)
  box(0, BY, 0, BW, BH, 0.16, INK.BLACK, { tone: 0.5 }, bg);

  // Marco de aluminio oscuro alrededor de la pizarra
  box(0, BY + BH, 0, BW + 0.5, 0.26, 0.24, INK.BLACK, { tone: 0.15 }, bg); // superior
  box(0, BY - 0.15, 0, BW + 0.5, 0.26, 0.24, INK.BLACK, { tone: 0.15 }, bg); // inferior
  box(-BW / 2 - 0.13, BY, 0, 0.26, BH + 0.3, 0.24, INK.BLACK, { tone: 0.15 }, bg); // izquierdo
  box(BW / 2 + 0.13, BY, 0, 0.26, BH + 0.3, 0.24, INK.BLACK, { tone: 0.15 }, bg); // derecho

  // Bandeja de rotuladores inferior
  box(0, BY - 0.18, 0.22, BW + 0.2, 0.12, 0.36, INK.BLACK, { tone: 0.2 }, bg);
  // Borrador de pizarra y rotuladores descansando en la bandeja
  box(-3.5, BY - 0.08, 0.24, 0.7, 0.15, 0.2, INK.BLACK, { tone: 0.05 }, bg); // borrador
  for (let m = 0; m < 4; m++) {
    const mInk = [INK.GREEN, INK.RED, INK.BLUE, INK.PURPLE][m];
    const mrk = cyl(2.0 + m * 0.6, BY - 0.1, 0.26, 0.05, 0.45, mInk, { fill: true }, bg);
    mrk.rotation.z = Math.PI / 2;
  }

  // 4 COLUMNAS DE LA RETROSPECTIVA
  const colW = BW / 4;
  const COL_DEFS = [
    {
      title: "QUE HA IDO BIEN",
      ink: INK.GREEN,
      icon: ":)",
      cards: [
        { t: "Sprint a tiempo", votes: 3, cmts: 1 },
        { t: "Deploy limpio", votes: 5, cmts: 2 },
        { t: "Buenos cafes", votes: 2, cmts: 0 },
        { t: "Demo Day 10/10", votes: 4, cmts: 3 },
        { t: "Onboarding ok", votes: 1, cmts: 0 },
        { t: "Buen vibe equipo", votes: 6, cmts: 4 }
      ]
    },
    {
      title: "A MEJORAR",
      ink: INK.RED,
      icon: "^",
      cards: [
        { t: "Nuevas WL sueltas", votes: 5, cmts: 2 }, // Easter egg pedido por el usuario
        { t: "Menos reuniones", votes: 7, cmts: 3 },
        { t: "Flaky tests en CI", votes: 4, cmts: 1 },
        { t: "Merge conflicts", votes: 3, cmts: 2 },
        { t: "Falta docu API", votes: 2, cmts: 0 },
        { t: "Definir bien DoD", votes: 4, cmts: 1 }
      ]
    },
    {
      title: "PREGUNTAS",
      ink: INK.BLUE,
      icon: "?",
      cards: [
        { t: "Fin migracion?", votes: 1, cmts: 3 }, // Easter egg pedido por el usuario
        { t: "Datadis API?", votes: 0, cmts: 4 },
        { t: "Quien compra cafe?", votes: 4, cmts: 2 },
        { t: "Proximo Demo Day?", votes: 2, cmts: 1 },
        { t: "Usamos IA aqui?", votes: 5, cmts: 5 },
        { t: "Roadmap Q4?", votes: 1, cmts: 0 }
      ]
    },
    {
      title: "ACTION ITEMS",
      ink: INK.PURPLE,
      icon: "!",
      cards: [
        { t: "Huddle IA trabajo", votes: 4, cmts: 1, done: true }, // Easter egg pedido por el usuario
        { t: "Refactor endpoints", votes: 2, cmts: 0, done: true },
        { t: "Mejorar docs", votes: 3, cmts: 1, done: false },
        { t: "Menos reuniones", votes: 5, cmts: 2, done: true },
        { t: "Setup Datadog", votes: 2, cmts: 0, done: false },
        { t: "Equipo feliz :)", votes: 8, cmts: 4, done: true }
      ]
    }
  ];

  const boardCards = [];

  for (let c = 0; c < 4; c++) {
    const col = COL_DEFS[c];
    const cx = -BW / 2 + colW * (c + 0.5);

    // Línea divisoria vertical entre columnas a rotulador
    if (c > 0) {
      box(-BW / 2 + colW * c, BY + 0.1, 0.08, 0.05, BH - 0.2, 0.02, INK.BLACK, { tone: 0.2 }, bg);
    }

    // Cabecera de la columna con su color distintivo
    const headY = BY + BH - 1.15;
    const headerBox = box(cx, headY, 0.1, colW - 0.45, 0.95, 0.05, col.ink, { tone: 0.12 }, bg);
    // Borde de la cabecera
    box(cx, headY, 0.13, colW - 0.43, 0.97, 0.01, col.ink, { tone: -0.1 }, bg);

    // Texto de la cabecera a tinta
    const titleTxt = inkText(col.title, { size: 0.35, ink: INK.BLACK });
    titleTxt.position.set(cx, headY + 0.48, 0.15);
    bg.add(titleTxt);

    // Tarjetas tipo post-it en la columna (2 columnas por cada sección de la pizarra)
    col.cards.forEach((card, idx) => {
      const colXOffset = (idx % 2 === 0 ? -1 : 1) * (colW * 0.24);
      const rowY = headY - 1.25 - Math.floor(idx / 2) * 1.85 + rnd(-0.1, 0.1);
      const cardX = cx + colXOffset + rnd(-0.08, 0.08);

      const cardGroup = new THREE.Group();
      cardGroup.position.set(cardX, rowY, 0.12);
      cardGroup.rotation.z = rnd(-0.04, 0.04);
      bg.add(cardGroup);

      // Cuerpo del post-it
      const cardW = colW * 0.42, cardH = 1.35;
      box(0, 0, 0, cardW, cardH, 0.04, col.ink, { tone: 0.2 }, cardGroup);

      // Borde superior o cinta de washi tape
      box(0, cardH / 2 - 0.05, 0.025, cardW * 0.7, 0.1, 0.02, col.ink, { tone: -0.05 }, cardGroup);

      // Texto de la tarjeta (título abreviado o easter egg legible)
      const tMesh = inkText(card.t, { size: 0.17, ink: INK.BLACK });
      tMesh.position.set(0, cardH / 2 - 0.38, 0.035);
      cardGroup.add(tMesh);

      // Pequeñas líneas simulando escritura a boli en el post-it
      for (let l = 0; l < 2; l++) {
        box(0, -0.08 - l * 0.18, 0.03, cardW * 0.75, 0.03, 0.01, INK.BLACK, { tone: 0.2 }, cardGroup);
      }

      // Contador de votos (pulgar hacia arriba + número)
      const badgeY = -cardH / 2 + 0.22;
      box(-cardW * 0.25, badgeY, 0.03, 0.5, 0.24, 0.02, INK.BLACK, { tone: 0.4 }, cardGroup);
      const voteTxt = inkText(`+${card.votes}`, { size: 0.13, ink: INK.BLACK });
      voteTxt.position.set(-cardW * 0.25, badgeY + 0.12, 0.045);
      cardGroup.add(voteTxt);

      // Icono de comentarios si tiene
      if (card.cmts > 0) {
        box(cardW * 0.25, badgeY, 0.03, 0.45, 0.24, 0.02, INK.BLACK, { tone: 0.35 }, cardGroup);
        const cmtTxt = inkText(`C${card.cmts}`, { size: 0.12, ink: INK.BLUE });
        cmtTxt.position.set(cardW * 0.25, badgeY + 0.12, 0.045);
        cardGroup.add(cmtTxt);
      }

      // Checkbox para action items
      if (card.done !== undefined) {
        const chk = box(cardW * 0.32, cardH / 2 - 0.25, 0.03, 0.22, 0.22, 0.02, INK.BLACK, { tone: 0.45 }, cardGroup);
        if (card.done) {
          const tick = inkText("V", { size: 0.16, ink: INK.GREEN });
          tick.position.set(0, 0.11, 0.02);
          chk.add(tick);
        }
      }

      boardCards.push({
        group: cardGroup,
        homeX: cardX,
        homeY: rowY,
        homeZ: 0.12,
        homeRotZ: cardGroup.rotation.z,
        col: c,
        vib: 0
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. LATERALES DE LA SALA: ROTAFOLIOS, POSTER CLEVERGY Y PLANTAS
  // ─────────────────────────────────────────────────────────────────────────
  // Cartel Clevergy en la pared izquierda
  const posterLeft = new THREE.Group();
  posterLeft.position.set(-14.2, 5.5, -5.2);
  root.add(posterLeft);
  box(0, 0, 0, 3.4, 4.8, 0.08, INK.BLACK, { tone: 0.48 }, posterLeft);
  // Logo Clevergy (hoja verde característica)
  const clevLeaf = new THREE.Mesh(GEO.cone, mat(INK.GREEN, { fill: true }));
  clevLeaf.scale.set(0.65, 0.95, 0.08);
  clevLeaf.position.set(-0.6, 1.4, 0.06);
  clevLeaf.rotation.z = Math.PI / 4;
  posterLeft.add(clevLeaf);
  const clevTxt = inkText("CLEVERGY", { size: 0.42, ink: INK.BLACK });
  clevTxt.position.set(0.3, 1.4, 0.06);
  posterLeft.add(clevTxt);
  const subClev1 = inkText("GOOD ENERGY", { size: 0.28, ink: INK.GREEN });
  subClev1.position.set(0, 0.6, 0.06);
  posterLeft.add(subClev1);
  const subClev2 = inkText("PEOPLE :)", { size: 0.28, ink: INK.GREEN });
  subClev2.position.set(0, 0.15, 0.06);
  posterLeft.add(subClev2);

  // Rotafolios / caballete en la esquina izquierda: "TEAM CLEVERGY / SPRINT"
  const easelLeft = new THREE.Group();
  easelLeft.position.set(-11.5, 0, -2.4);
  root.add(easelLeft);
  // Patas de trípode de madera
  for (const [px, rz] of [[-0.65, -0.15], [0.65, 0.15]]) {
    const leg = cyl(px, 0, 0, 0.05, 3.6, INK.ORANGE, { tone: -0.05 }, easelLeft);
    leg.rotation.z = rz;
  }
  const backLeg = cyl(0, 0, -0.6, 0.05, 3.6, INK.ORANGE, { tone: -0.1 }, easelLeft);
  backLeg.rotation.x = -0.22;
  // Tablero del rotafolios con lista
  box(0, 1.2, 0.05, 1.8, 2.5, 0.06, INK.BLACK, { tone: 0.48 }, easelLeft);
  const eTitleL = inkText("TEAM CLEVERGY", { size: 0.22, ink: INK.BLUE });
  eTitleL.position.set(0, 2.2, 0.1);
  easelLeft.add(eTitleL);
  ["IDEAS", "SPRINT", "RETREAT", "RESULTADOS"].forEach((item, i) => {
    const itTxt = inkText(`${i === 3 ? "V" : "O"} ${item}`, { size: 0.18, ink: i === 3 ? INK.GREEN : INK.BLACK });
    itTxt.position.set(0, 1.8 - i * 0.38, 0.1);
    easelLeft.add(itTxt);
  });

  // Rotafolios en la esquina derecha: "ACTION!"
  const easelRight = new THREE.Group();
  easelRight.position.set(11.5, 0, -2.4);
  root.add(easelRight);
  for (const [px, rz] of [[-0.65, -0.15], [0.65, 0.15]]) {
    const leg = cyl(px, 0, 0, 0.05, 3.6, INK.ORANGE, { tone: -0.05 }, easelRight);
    leg.rotation.z = rz;
  }
  const backLegR = cyl(0, 0, -0.6, 0.05, 3.6, INK.ORANGE, { tone: -0.1 }, easelRight);
  backLegR.rotation.x = -0.22;
  box(0, 1.2, 0.05, 1.8, 2.5, 0.06, INK.BLACK, { tone: 0.48 }, easelRight);
  const eTitleR = inkText("ACTION!", { size: 0.28, ink: INK.RED });
  eTitleR.position.set(0, 2.2, 0.1);
  easelRight.add(eTitleR);
  ["HUDDLE IA", "CALIDAD", "MEJORAR DOCS", "MENOS MEETINGS", "EQUIPO OK"].forEach((item, i) => {
    const itTxt = inkText(`V ${item}`, { size: 0.16, ink: INK.BLACK });
    itTxt.position.set(0, 1.8 - i * 0.34, 0.1);
    easelRight.add(itTxt);
  });
  // Post-it amarillo con "YOU CAN DO IT"
  const canDo = box(0.65, 1.0, 0.1, 0.7, 0.55, 0.02, INK.ORANGE, { tone: 0.2 }, easelRight);
  canDo.rotation.z = -0.18;
  const canDoTxt = inkText("YOU CAN DO IT", { size: 0.12, ink: INK.BLACK });
  canDoTxt.position.set(0, 0.22, 0.02);
  canDo.add(canDoTxt);

  // Plantas de oficina en macetas a los lados
  for (const px of [-10.0, 10.0]) {
    const plant = new THREE.Group();
    plant.position.set(px, 0, -1.8);
    root.add(plant);
    cyl(0, 0, 0, 0.45, 0.8, INK.ORANGE, { tone: 0.05 }, plant); // maceta
    sph(0, 1.1, 0, 0.75, INK.GREEN, { tone: -0.05 }, plant); // hojas monstera
    sph(0.3, 1.6, -0.1, 0.55, INK.GREEN, { tone: -0.05 }, plant);
    sph(-0.35, 1.5, 0.1, 0.5, INK.GREEN, { tone: -0.05 }, plant);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. TECHO INDUSTRIAL Y LÁMPARAS COLGANTES
  // ─────────────────────────────────────────────────────────────────────────
  // Vigas de acero en el techo
  box(0, 12.0, -2.5, 34, 0.35, 0.4, INK.BLACK, { tone: 0.15 });
  box(0, 12.0, -5.5, 34, 0.35, 0.4, INK.BLACK, { tone: 0.15 });

  // 4 lámparas colgantes tipo campana industrial sobre la mesa
  const lamps = [];
  const lampX = [-6.2, -2.1, 2.1, 6.2];
  for (const lx of lampX) {
    const lampG = new THREE.Group();
    lampG.position.set(lx, 10.2, -1.8);
    root.add(lampG);
    // Cable
    cyl(0, 0, 0, 0.025, 1.8, INK.BLACK, { fill: true }, lampG);
    // Campana de la lámpara
    const shade = new THREE.Mesh(GEO.cone, mat(INK.BLACK, { tone: 0.15 }));
    shade.scale.set(0.9, 0.55, 0.9);
    shade.position.set(0, 0, 0);
    lampG.add(shade);
    // Bombilla cálida interior
    const bulb = sph(0, -0.12, 0, 0.18, INK.ORANGE, { tone: 0.45 }, lampG);
    lamps.push({ g: lampG, phase: Math.random() * 6 });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. PÚBLICO: COMPAÑEROS DE CLEVERGY ANIMANDO TRAS LA MESA
  // ─────────────────────────────────────────────────────────────────────────
  const crowd = [];
  const teamInks = [INK.BLUE, INK.PURPLE, INK.GREEN, INK.RED, INK.ORANGE, INK.BLACK];
  for (let i = 0; i < 14; i++) {
    const x = -8.2 + i * 1.25 + rnd(-0.15, 0.15);
    const g = new THREE.Group();
    g.position.set(x, 0.05, -3.6 + (i % 2) * 0.3);

    const ink = teamInks[i % teamInks.length];
    // Cuerpo estilo doodle
    const body = new THREE.Mesh(GEO.cyl, mat(ink, { tone: 0.1 }));
    body.scale.set(0.65, 1.15, 0.45);
    body.position.y = 0.58;
    g.add(body);

    // Cabeza
    const head = new THREE.Mesh(GEO.sph, mat(ink, { tone: 0.25 }));
    head.scale.setScalar(0.48);
    head.position.y = 1.42;
    g.add(head);

    // Gafas o detalle en algunos compañeros
    if (i % 3 === 0) {
      box(0, 1.44, 0.22, 0.35, 0.12, 0.06, INK.BLACK, { fill: true }, g);
    }

    // Brazos articulados para animar
    const arms = [];
    for (const s of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(s * 0.36, 1.05, 0);
      const arm = new THREE.Mesh(GEO.box, mat(ink, { tone: 0 }));
      arm.scale.set(0.12, 0.58, 0.12);
      arm.position.y = 0.25;
      pivot.add(arm);
      g.add(pivot);
      arms.push({ pivot, s });
    }
    root.add(g);
    crowd.push({ g, arms, phase: Math.random() * 6 });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 7. GAME FEEL REACTIVO: POST-ITS VOLADORES Y CELEBRACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  // Tarjetas post-it voladoras (desprendidas en impactos o celebración)
  const MAX_FLYING = 30;
  const flyingCards = [];
  const cardMatColors = [INK.GREEN, INK.RED, INK.BLUE, INK.PURPLE, INK.ORANGE];

  for (let i = 0; i < MAX_FLYING; i++) {
    const col = cardMatColors[i % cardMatColors.length];
    const m = new THREE.Mesh(GEO.box, mat(col, { tone: 0.15 }));
    m.scale.set(0.38, 0.38, 0.015);
    m.visible = false;
    root.add(m);
    flyingCards.push({
      mesh: m,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      rotVel: new THREE.Vector3(),
      life: 0,
      active: false
    });
  }

  function spawnFlyingCard(x, y, z, vx, vy, vz) {
    const card = flyingCards.find((c) => !c.active);
    if (!card) return;
    card.active = true;
    card.life = rnd(0.9, 1.5);
    card.pos.set(x, y, z);
    card.vel.set(vx, vy, vz);
    card.rotVel.set(rnd(-6, 6), rnd(-6, 6), rnd(-8, 8));
    card.mesh.visible = true;
    card.mesh.position.copy(card.pos);
    card.mesh.rotation.set(rnd(0, Math.PI), rnd(0, Math.PI), rnd(0, Math.PI));
  }

  // Cartel flotante de celebración "ACTION ITEM COMPLETED!"
  const victoryBanner = new THREE.Group();
  victoryBanner.position.set(0, 6.2, FIGHT_Z + 0.2);
  victoryBanner.visible = false;
  root.add(victoryBanner);

  box(0, 0, 0, 7.5, 1.4, 0.08, INK.PURPLE, { tone: 0.15 }, victoryBanner);
  box(0, 0, 0.04, 7.7, 1.5, 0.02, INK.BLACK, { tone: 0.1 }, victoryBanner);
  const vText = inkText("ACTION ITEM COMPLETED!", { size: 0.55, ink: INK.BLACK });
  vText.position.set(0, 0.28, 0.06);
  victoryBanner.add(vText);
  const vSub = inkText("RETRO SUPERADA CON EXITO", { size: 0.32, ink: INK.GREEN });
  vSub.position.set(0, -0.32, 0.06);
  victoryBanner.add(vSub);

  let victoryT = 0;

  // Reacción al recibir un golpe
  function onHit(x, y, heavy) {
    const count = heavy ? 4 : 2;
    for (let k = 0; k < count; k++) {
      spawnFlyingCard(
        x + rnd(-0.3, 0.3),
        y + rnd(0.2, 0.7),
        FIGHT_Z + rnd(-0.2, 0.2),
        rnd(-3.5, 3.5),
        rnd(2.5, 6.0),
        rnd(-1.5, 1.5)
      );
    }

    // Vibración sutil en las tarjetas de la pizarra próximas a la coordenada X
    boardCards.forEach((c) => {
      const dist = Math.abs(c.homeX - x);
      if (dist < 4.5) {
        c.vib = Math.min(1.0, c.vib + (heavy ? 0.9 : 0.45));
      }
    });
  }

  // Reacción al aterrizar en el suelo / plataformas
  function onLand(x, y) {
    deskNotes.forEach((n) => {
      const dist = Math.abs(n.mesh.position.x - x);
      if (dist < 2.5 && y <= 0.3) {
        n.hop = 0.12 * (1 - dist / 2.5);
      }
    });
  }

  // Reacción al terminar la pelea (KO ganador)
  function onVictory(winner) {
    victoryBanner.visible = true;
    victoryT = 0;
    // Lluvia de post-its tipo confeti de retro
    for (let k = 0; k < 20; k++) {
      setTimeout(() => {
        spawnFlyingCard(
          rnd(-5.0, 5.0),
          rnd(5.0, 8.0),
          FIGHT_Z + rnd(-0.5, 0.5),
          rnd(-2.0, 2.0),
          rnd(1.0, 3.5),
          rnd(-1.0, 1.0)
        );
      }, k * 60);
    }
  }

  function onReset() {
    victoryBanner.visible = false;
    flyingCards.forEach((c) => {
      c.active = false;
      c.mesh.visible = false;
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. BUCLE DE ACTUALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  function update(dt, t, hype) {
    // Animación de los compañeros de Clevergy animando
    for (const c of crowd) {
      const h = Math.max(hype, 0.18);
      c.g.position.y = 0.05 + Math.abs(Math.sin(t * (3.5 + h * 6) + c.phase)) * 0.22 * h;
      c.arms.forEach((a) => {
        a.pivot.rotation.z = a.s * (0.35 + h * 1.7 + Math.sin(t * 9 + c.phase) * 0.35 * h);
      });
    }

    // Leve balanceo en las lámparas de techo
    lamps.forEach((l) => {
      l.g.rotation.z = Math.sin(t * 1.5 + l.phase) * 0.035;
    });

    // Vibración atenuada de las tarjetas de la pizarra
    boardCards.forEach((c) => {
      if (c.vib > 0.005) {
        c.group.position.x = c.homeX + Math.sin(t * 40) * 0.05 * c.vib;
        c.group.rotation.z = c.homeRotZ + Math.cos(t * 35) * 0.06 * c.vib;
        c.vib = Math.max(0, c.vib - dt * 4.0);
      } else if (c.vib > 0) {
        c.group.position.x = c.homeX;
        c.group.rotation.z = c.homeRotZ;
        c.vib = 0;
      }
    });

    // Rebote sutil de las notas de la mesa al pisarlas
    deskNotes.forEach((n) => {
      if (n.hop > 0.001) {
        n.mesh.position.y = n.baseY + n.hop;
        n.hop = Math.max(0, n.hop - dt * 1.2);
      } else {
        n.mesh.position.y = n.baseY;
      }
    });

    // Física de las tarjetas voladoras (efecto hoja de papel cayendo)
    flyingCards.forEach((c) => {
      if (!c.active) return;
      c.life -= dt;
      if (c.life <= 0) {
        c.active = false;
        c.mesh.visible = false;
        return;
      }
      c.vel.y -= 9.8 * dt * 0.7; // gravedad suave
      c.vel.x *= 0.96; // resistencia del aire
      c.pos.addScaledVector(c.vel, dt);
      c.mesh.position.copy(c.pos);
      c.mesh.rotation.x += c.rotVel.x * dt;
      c.mesh.rotation.y += c.rotVel.y * dt;
      c.mesh.rotation.z += c.rotVel.z * dt;
    });

    // Animación pop del cartel de victoria
    if (victoryBanner.visible) {
      victoryT += dt;
      const s = Math.min(1.0, victoryT * 2.5);
      victoryBanner.scale.setScalar(s);
      victoryBanner.position.y = 6.2 + Math.sin(t * 3) * 0.1;
    }
  }

  return { root, update, onHit, onLand, onVictory, onReset };
}
