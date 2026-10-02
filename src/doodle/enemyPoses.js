// =============================================================================
// enemyPoses.js — Fotos de las poses de cada enemigo (Historia → Enemigos)
// Los enemigos 3D (email, reloj, reunión, INBOX INFINITO, motos del pantano) se
// colocan en varias poses y se fotografían con el mismo render a boli del juego,
// una sola vez (se guardan en memoria). Datadis usa sus sprites; el compañero
// rival, los sprites de los personajes.
// =============================================================================

import * as THREE from "three";
import { createDoodleRenderer, INK, mat } from "./doodleRender.js";
import { GEO } from "./doodleLevel.js";
import { makeEmail, makeMeeting, makeClock, makeBoss } from "./doodleActors.js";
import { CHARS } from "../config/characters.js";
import { getCharacterAvatar } from "../engine/sprites.js";

const cache = new Map();
let R = null, canvas = null;
const W = 320, H = 280;

function shooter() {
  if (!R) {
    canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    R = createDoodleRenderer(canvas, { fadeScale: 12 }); // sin "niebla": la foto es de cerca
    R.setSize(W, H);
  }
  return R;
}

/** encuadra el grupo y saca la foto (se lee el lienzo justo después de pintar) */
function snap(group, { yaw = 0.5, pitch = 0.18, zoom = 1 } = {}) {
  const r = shooter();
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 200);
  scene.add(group);
  group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(group);
  const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
  const d = (Math.max(size.x * 0.9, size.y * 1.05, size.z * 0.7) / (2 * Math.tan((32 * Math.PI) / 360))) * 1.02 / zoom;
  cam.position.set(c.x + Math.sin(yaw) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * d);
  cam.lookAt(c);
  r.render(scene, cam, { time: 1, hurt: 0, lowHp: 0, flash: 0 }, null);
  return canvas.toDataURL("image/png");
}

function boat(ink) {
  const g = new THREE.Group(), body = new THREE.Group();
  g.add(body);
  const put = (geo, i, o, s, p, rot) => { const m = new THREE.Mesh(geo, mat(i, o)); m.scale.set(...s); m.position.set(...p); if (rot) m.rotation.set(...rot); body.add(m); return m; };
  put(GEO.box, ink, { tone: 0.05 }, [1.5, 0.6, 3.0], [0, 0.35, -0.2]);
  put(GEO.cone, ink, { tone: 0.05 }, [1.5, 1.3, 0.6], [0, 0.35, 1.9], [Math.PI / 2, 0, 0]);
  put(GEO.box, INK.BLACK, { tone: -0.1 }, [0.9, 0.35, 1.3], [0, 0.8, -0.5]);
  put(GEO.box, ink, { fill: true }, [1.52, 0.12, 3.02], [0, 0.45, -0.2]);
  put(GEO.box, INK.BLACK, { fill: true }, [1.1, 0.08, 0.08], [0, 1.25, 0.55]);
  put(GEO.box, INK.BLACK, {}, [0.12, 0.5, 0.12], [0, 1.0, 0.55]);
  put(GEO.box, INK.BLACK, { tone: 0.2 }, [0.8, 0.5, 0.06], [0, 1.05, 0.95], [-0.5, 0, 0]);
  return { g, body };
}
const splash = (g, n = 8, ink = INK.BLUE) => {
  for (let i = 0; i < n; i++) {
    const s = new THREE.Mesh(GEO.sph, mat(ink, { fill: true }));
    s.scale.setScalar(0.25 + (i % 3) * 0.08);
    s.position.set(Math.cos(i * 2.4) * 1.2, 0.1 + (i % 4) * 0.2, -1.6 - (i % 3) * 0.4);
    g.add(s);
  }
};
const stars = (g, y, n = 3) => {
  for (let i = 0; i < n; i++) {
    const s = new THREE.Mesh(GEO.cone, mat(INK.ORANGE, { fill: true }));
    s.scale.set(0.18, 0.3, 0.18);
    s.position.set(Math.cos((i / n) * Math.PI * 2) * 0.6, y, Math.sin((i / n) * Math.PI * 2) * 0.6);
    g.add(s);
  }
};

// cada pose: qué hace el modelo antes de la foto
const POSES = {
  email: [
    ["Volando", () => { const m = makeEmail(); m.wings.forEach((w) => (w.pivot.rotation.z = w.s * 0.6)); return m.group; }],
    ["¡Al ataque!", () => { const m = makeEmail(); m.body.rotation.x = 0.5; m.wings.forEach((w) => (w.pivot.rotation.z = -w.s * 0.5)); return m.group; }, { pitch: 0.05 }],
    ["Aturdido", () => { const m = makeEmail(); m.body.rotation.z = 0.9; m.wings.forEach((w) => (w.pivot.rotation.z = w.s * 0.1)); stars(m.group, 0.6); return m.group; }],
    ["Borrado", () => { const m = makeEmail(); m.body.rotation.x = -Math.PI / 2; m.body.scale.set(1, 1, 0.4); m.wings.forEach((w) => (w.pivot.rotation.z = 0)); return m.group; }, { pitch: 0.5 }]
  ],
  clock: [
    ["Tic-tac", () => makeClock().group],
    ["Embistiendo", () => { const m = makeClock(); m.body.rotation.x = 0.45; m.hand1.rotation.z = 1.2; return m.group; }],
    ["¡Riiing!", () => { const m = makeClock(); m.body.rotation.z = 0.35; m.hand2.rotation.z = 2.4; stars(m.body, 0.95, 4); return m.group; }],
    ["Parado", () => { const m = makeClock(); m.body.rotation.z = 1.4; m.body.position.y = 0.6; return m.group; }]
  ],
  meeting: [
    ["Andando", () => { const m = makeMeeting(); m.legs.forEach((l) => (l.pivot.rotation.x = l.s * 0.5)); return m.group; }],
    ["Lanza invitaciones", () => {
      const m = makeMeeting(); m.body.rotation.x = -0.25;
      const inv = new THREE.Mesh(GEO.box, mat(INK.PURPLE, { tone: 0.15 })); inv.scale.set(0.5, 0.36, 0.06); inv.position.set(0.9, 1.8, 0.5); inv.rotation.z = 0.4; m.group.add(inv);
      return m.group;
    }],
    ["Pospuesta", () => { const m = makeMeeting(); m.body.rotation.z = 0.5; stars(m.group, 2.2); return m.group; }],
    ["Cancelada", () => { const m = makeMeeting(); m.body.rotation.x = -Math.PI / 2; m.body.position.set(0, 0.25, -0.6); m.legs.forEach((l) => (l.pivot.rotation.x = 1.4)); return m.group; }, { pitch: 0.5 }]
  ],
  inbox: [
    ["Esperando", () => makeBoss().group],
    ["Saltando", () => { const m = makeBoss(); m.body.scale.set(0.92, 1.12, 0.92); m.layers.forEach((l, i) => (l.rotation.y = Math.sin(i) * 0.3)); return m.group; }],
    ["Agotado", () => { const m = makeBoss(); m.body.scale.set(1.05, 0.88, 1.05); m.top.rotation.z = 0.25; stars(m.top, 2.6, 4); return m.group; }],
    ["Inbox zero", () => { const m = makeBoss(); m.body.rotation.z = Math.PI / 2.2; m.body.position.set(3, 0, 0); return m.group; }, { pitch: 0.4 }]
  ],
  boats: [
    ["En la salida", () => boat(INK.RED).g],
    ["Derrapando", () => { const b = boat(INK.BLUE); b.body.rotation.z = -0.35; b.g.rotation.y = 0.5; splash(b.g, 10); return b.g; }],
    ["¡Turbo!", () => { const b = boat(INK.GREEN); b.body.rotation.x = -0.2; splash(b.g, 14, INK.ORANGE); return b.g; }],
    ["Por los aires", () => { const b = boat(INK.PURPLE); b.body.rotation.x = -0.45; b.g.position.y = 1; return b.g; }]
  ]
};

const DATADIS = [["Entrada completa", "ready"], ["En mantenimiento", "maint"], ["Cargando…", "loading"], ["Activando módulos", "modules"], ["Prepara el salto", "prep"], ["En el aire", "air"],
  ["Aterriza", "land"], ["Pisotón", "stomp"], ["Lanza documentos", "throw"], ["Rayo del CUPS", "beam"], ["Cambia el proceso", "process"], ["Auditoría", "audit"],
  ["Quita el acceso", "access"], ["Plataforma caída", "down"], ["Recibe un pisotón", "hit"], ["Frito", "dead"]];

/** poses de un enemigo: [{ label, src }] (la primera es su foto de portada) */
export function enemyPoses(id) {
  if (cache.has(id)) return cache.get(id);
  let list;
  if (id === "datadis") list = DATADIS.map(([label, f]) => ({ label, src: `/sprites/datadis/${f}.png` }));
  else if (id === "rival") list = CHARS.slice(0, 8).map((c) => ({ label: c.name, src: getCharacterAvatar(c.id) })).filter((p) => p.src);
  else if (POSES[id]) list = POSES[id].map(([label, build, view]) => ({ label, src: snap(build(), view) }));
  else list = [];
  cache.set(id, list);
  return list;
}
