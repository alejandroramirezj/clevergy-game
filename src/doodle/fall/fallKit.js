// =============================================================================
// fallKit.js — Piezas del show de obstáculos "La Integración" (estilo Fall Guys)
// Todo es data-driven: cada nivel coloca plataformas (cajas con collider AABB),
// rampas, ruletas, péndulos, empujadores, baldosas que se caen, puertas, camas
// elásticas, cintas transportadoras… y la física de los concursantes las lee.
// Los obstáculos móviles dependen sólo del reloj de la ronda (t), así que se
// pueden sincronizar entre móviles con un único reloj.
// =============================================================================

import * as THREE from "three";
import { INK, mat } from "../doodleRender.js";
import { GEO } from "../doodleLevel.js";
import { inkText } from "../inkText.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export const RAINBOW = [INK.RED, INK.ORANGE, INK.GREEN, INK.BLUE, INK.PURPLE];

/** Generador pseudoaleatorio con semilla (misma partida = mismas trampas). */
export function rng(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createKit(scene) {
  const root = new THREE.Group();
  scene.add(root);
  const solids = [], hazards = [], discs = [], ramps = [], gates = [], checkpoints = [], anims = [];

  // ── mallas ──
  function mesh(geo, ink, o, sx, sy, sz, x, y, z, parent = root) {
    const m = new THREE.Mesh(geo, mat(ink, o));
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  }
  const boxMesh = (x0, y0, z0, x1, y1, z1, ink, o = {}, parent = root) =>
    mesh(GEO.box, ink, o, x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, parent);

  /** cartel: tablero blanco con texto a tinta, mirando hacia -z (hacia la cámara) */
  function sign(text, x, y, z, { size = 0.5, ink = INK.BLUE, board = true, face = -1, rotY = null, pad = 0.35 } = {}) {
    const g = new THREE.Group();
    const lines = String(text).split("\n");
    let w = 0;
    lines.forEach((ln, i) => {
      const t = inkText(ln, { size, ink, weight: 1.1 });
      t.position.y = ((lines.length - 1) / 2 - i) * size * 1.45;
      t.position.z = 0.07;
      g.add(t);
      w = Math.max(w, t.userData.width || 1);
    });
    if (board) {
      const h = lines.length * size * 1.45 + pad;
      const b = new THREE.Mesh(GEO.box, mat(INK.BLACK, { tone: 0.62 }));
      b.userData.bake = true;
      b.scale.set(w + pad * 2, h, 0.1);
      g.add(b);
      const f = new THREE.Mesh(GEO.box, mat(ink, { fill: true }));
      f.userData.bake = true;
      f.scale.set(w + pad * 2 + 0.12, h + 0.12, 0.06);
      f.position.z = -0.04;
      g.add(f);
    }
    // los carteles altos van por encima de la cámara (que va ~5,4 m sobre el jugador)
    if (y > 3.3 && y < 7.2) y = 7.6 + (lines.length - 1) * size * 0.7;
    g.position.set(x, y, z);
    g.rotation.y = rotY != null ? rotY : face < 0 ? Math.PI : 0;
    root.add(g);
    return g;
  }

  // ── plataformas (AABB) ──
  /** plataforma con la cara de arriba en `y`. Opciones: ink, tone, t (grosor), stripe, y flags de física. */
  function plat(x0, x1, z0, z1, y = 0, o = {}) {
    const t = o.t ?? 0.8;
    const ink = o.ink ?? INK.BLUE;
    const g = new THREE.Group();
    root.add(g);
    const body = boxMesh(x0, y - t, z0, x1, y, z1, ink, { tone: (o.tone ?? 0.3) - 0.16 }, g);
    if (o.stripe !== false) boxMesh(x0, y - 0.04, z0, x1, y + 0.01, z0 + 0.12, ink, { fill: true }, g); // canto de tinta
    const s = {
      x0, x1, z0, z1, y0: y - t, y1: y, g, body, ink, active: true,
      bx: (x0 + x1) / 2, by: y, bz: (z0 + z1) / 2, hw: (x1 - x0) / 2, hd: (z1 - z0) / 2, ht: t,
      dx: 0, dy: 0, dz: 0, ...(o.flags || {})
    };
    g.position.set(0, 0, 0);
    s.ox = 0; s.oy = 0; s.oz = 0;
    solids.push(s);
    return s;
  }
  /** caja sólida cualquiera (muros, vallas, obstáculos bajos) */
  const wall = (x0, x1, z0, z1, y0, y1, ink = INK.BLACK, o = {}) => plat(x0, x1, z0, z1, y1, { t: y1 - y0, ink, tone: o.tone ?? 0.32, stripe: false, ...o });

  /** plataforma que se mueve: fn(t) → {x,y,z} desplazamiento desde su sitio */
  function mover(s, fn) {
    s.move = fn;
    return s;
  }
  const sine = (ax, ay, az, w, ph = 0) => (t) => {
    const k = Math.sin(t * w + ph);
    return { x: ax * k, y: ay * k, z: az * k };
  };

  /** baldosa que se cae al pisarla (delay) y vuelve (respawn s, 0 = no vuelve) */
  function fallTile(s, delay = 0.5, respawn = 5) {
    s.fall = { delay, respawn, state: 0, t: 0 };
    return s;
  }
  /** plataforma que aparece y desaparece */
  function blink(s, on, off, ph = 0) {
    s.blink = { on, off, ph };
    return s;
  }

  // ── rampa (sube a lo largo de z) ──
  function ramp(x0, x1, z0, z1, ya, yb, o = {}) {
    const ink = o.ink ?? INK.BLUE;
    const len = Math.hypot(z1 - z0, yb - ya);
    const m = mesh(GEO.box, ink, { tone: o.tone ?? 0.3 }, x1 - x0, 0.6, len, (x0 + x1) / 2, (ya + yb) / 2 - 0.3, (z0 + z1) / 2);
    m.rotation.x = -Math.atan2(yb - ya, z1 - z0);
    const r = { x0, x1, z0, z1, ya, yb, mesh: m, ...(o.flags || {}) };
    r.h = (z) => ya + (yb - ya) * Math.min(1, Math.max(0, (z - z0) / (z1 - z0)));
    ramps.push(r);
    return r;
  }

  // ── ruleta: disco giratorio que te lleva (y, opcional, una barra que barre por encima) ──
  function disc(cx, cz, y, r, w, o = {}) {
    const g = new THREE.Group();
    g.position.set(cx, y, cz);
    root.add(g);
    const ink = o.ink ?? INK.ORANGE;
    mesh(GEO.cyl, ink, { tone: o.tone ?? 0.28 }, r * 2, 0.8, r * 2, 0, -0.4, 0, g);
    for (let k = 0; k < 6; k++) { // gajos para que se vea girar
      const a = (k / 6) * Math.PI * 2;
      const m = mesh(GEO.box, k % 2 ? ink : INK.BLACK, { fill: k % 2 === 0, tone: 0.1 }, r * 0.95, 0.03, 0.12, Math.cos(a) * r * 0.48, 0.02, Math.sin(a) * r * 0.48, g);
      m.rotation.y = -a;
    }
    const d = { cx, cz, y, r, w, g, ph: o.ph || 0 };
    discs.push(d);
    if (o.bar) bar(cx, y + 0.55, cz, r * 0.95, o.barW ?? -w * 1.6, { ink: o.barInk ?? INK.RED, ph: o.barPh || 0, label: o.label });
    return d;
  }

  // ── barra giratoria (hay que saltarla) ──
  function bar(cx, cy, cz, len, w, o = {}) {
    const g = new THREE.Group();
    g.position.set(cx, cy, cz);
    root.add(g);
    const ink = o.ink ?? INK.RED;
    mesh(GEO.box, ink, { tone: 0.05 }, len * 2, 0.45, 0.45, 0, 0, 0, g);
    for (let k = -3; k <= 3; k++) mesh(GEO.box, INK.BLACK, { fill: true }, 0.08, 0.47, 0.47, (k / 3.5) * len, 0, 0, g); // rayas
    mesh(GEO.cyl, INK.BLACK, { tone: 0.15 }, 0.7, Math.max(0.6, cy - (o.base ?? cy - 0.6) + 0.3), 0.7, 0, -0.15, 0, g);
    if (o.label) { const t = inkText(o.label, { size: 0.28, ink: INK.BLACK }); t.position.set(len * 0.5, 0.42, 0); t.rotation.x = -Math.PI / 2; g.add(t); }
    const h = { type: "bar", cx, cy, cz, len, w, ph: o.ph || 0, g, r: 0.32, a: 0 };
    hazards.push(h);
    return h;
  }

  // ── péndulo (bola o martillo que barre la pista de lado a lado) ──
  function pendulum(px, py, pz, len, amp, w, o = {}) {
    const g = new THREE.Group();
    g.position.set(px, py, pz);
    root.add(g);
    const arm = new THREE.Group();
    arm.userData.dyn = true;
    g.add(arm);
    mesh(GEO.box, INK.BLACK, { fill: true }, 0.12, len, 0.12, 0, -len / 2, 0, arm);
    const r = o.r ?? 1.1;
    const ink = o.ink ?? INK.PURPLE;
    if (o.hammer) mesh(GEO.box, ink, { tone: 0.05 }, r * 1.4, r * 1.6, r * 2.4, 0, -len, 0, arm);
    else mesh(GEO.sph, ink, { tone: 0.05 }, r * 2, r * 2, r * 2, 0, -len, 0, arm);
    if (o.label) { const t = inkText(o.label, { size: 0.42, ink: INK.BLACK, weight: 1.3 }); t.position.set(0, -len, -(o.hammer ? r * 1.25 : r) - 0.05); t.rotation.y = Math.PI; arm.add(t); }
    mesh(GEO.box, INK.BLACK, { tone: 0.2 }, 2.4, 0.3, 0.3, 0, 0.1, 0, g); // soporte
    const h = { type: "ball", px, py, pz, len, amp, w, ph: o.ph || 0, g, arm, r: o.hammer ? r * 1.15 : r, bx: 0, by: 0, bz: 0, vx: 0 };
    hazards.push(h);
    return h;
  }

  /** empujador: bloque que entra y sale de lado y te tira (es un sólido que empuja) */
  function pusher(x0, x1, z0, z1, y, h, ax, w, ph = 0, o = {}) {
    const s = wall(x0, x1, z0, z1, y, y + h, o.ink ?? INK.RED, { tone: 0.1 });
    s.push = true;
    mover(s, (t) => ({ x: ax * (0.5 + 0.5 * Math.sin(t * w + ph)), y: 0, z: 0 }));
    if (o.label) {
      const t = inkText(o.label, { size: 0.3, ink: INK.BLACK, weight: 1.2 });
      t.position.set((x0 + x1) / 2, y + h / 2, z0 - 0.06);
      t.rotation.y = Math.PI;
      s.g.add(t);
    }
    return s;
  }

  /** puerta: open = se rompe al empujarla · locked = no se abre · trap = se abre y detrás no hay suelo */
  function door(x0, x1, z, y, h, kind, label, ink = INK.BLUE) {
    const s = wall(x0, x1, z - 0.3, z + 0.3, y, y + h, ink, { tone: 0.12 });
    s.door = kind;
    const t = inkText(label, { size: Math.min(0.42, ((x1 - x0) * 0.85) / Math.max(4, label.length) / 0.93), ink: INK.BLACK, weight: 1.3 });
    t.position.set((x0 + x1) / 2, y + h * 0.62, z - 0.32);
    t.rotation.y = Math.PI;
    s.g.add(t);
    const knob = mesh(GEO.sph, INK.BLACK, { fill: true }, 0.22, 0.22, 0.22, x1 - 0.45, y + h * 0.42, z - 0.34, s.g);
    s.knob = knob;
    return s;
  }

  // ── arcos de datos (marcan cada campo completado) y puntos de control ──
  function gate(z, x0, x1, label, idx, o = {}) {
    const y = o.y ?? 0, h = o.h ?? 4.2, ink = o.ink ?? INK.GREEN;
    for (const m of [boxMesh(x0, y, z - 0.25, x0 + 0.5, y + h, z + 0.25, ink, { tone: 0.05 }), boxMesh(x1 - 0.5, y, z - 0.25, x1, y + h, z + 0.25, ink, { tone: 0.05 }), boxMesh(x0, y + h, z - 0.3, x1, y + h + 0.9, z + 0.3, ink, { tone: 0.15 })]) m.userData.bake = true;
    const t = inkText(label, { size: 0.5, ink: INK.BLACK, weight: 1.3 });
    t.position.set((x0 + x1) / 2, y + h + 0.45, z - 0.32);
    t.rotation.y = Math.PI;
    root.add(t);
    gates.push({ z, x0, x1, y, label, idx });
  }
  function checkpoint(z, x0, x1, spawn) {
    checkpoints.push({ z, x0, x1, spawn });
    // banderín
    const x = x1 - 0.6, y = spawn.y;
    boxMesh(x - 0.06, y, z - 0.06, x + 0.06, y + 2.6, z + 0.06, INK.BLACK, { fill: true }).userData.bake = true;
    boxMesh(x - 0.9, y + 1.9, z - 0.04, x, y + 2.55, z + 0.04, INK.GREEN, { tone: 0.05 }).userData.bake = true;
  }

  // ── bucle de animación: mueve todo según el reloj de la ronda ──
  const _p = new THREE.Vector3();
  function update(t, dt) {
    for (const s of solids) {
      if (s.move) {
        const o = s.move(t);
        s.dx = o.x - s.ox; s.dy = o.y - s.oy; s.dz = o.z - s.oz;
        s.ox = o.x; s.oy = o.y; s.oz = o.z;
        s.x0 = s.bx - s.hw + o.x; s.x1 = s.bx + s.hw + o.x;
        s.z0 = s.bz - s.hd + o.z; s.z1 = s.bz + s.hd + o.z;
        s.y1 = s.by + o.y; s.y0 = s.y1 - s.ht;
        s.g.position.set(o.x, o.y + (s.fallY || 0), o.z);
      }
      if (s.fall) {
        const f = s.fall;
        if (f.state === 1) { // tiembla
          f.t += dt;
          s.g.position.x = (s.ox || 0) + Math.sin(f.t * 70) * 0.06;
          if (f.t >= f.delay) { f.state = 2; f.t = 0; s.active = false; }
        } else if (f.state === 2) { // cae
          f.t += dt;
          s.fallY = -9 * f.t * f.t;
          s.g.position.y = (s.oy || 0) + s.fallY;
          s.g.visible = f.t < 1.6;
          if (f.respawn && f.t > f.respawn) { f.state = 0; f.t = 0; s.active = true; s.fallY = 0; s.g.position.set(s.ox || 0, s.oy || 0, s.oz || 0); s.g.visible = true; }
        }
      }
      if (s.blink) {
        const b = s.blink, per = b.on + b.off, k = (((t + b.ph) % per) + per) % per;
        const on = k < b.on;
        s.active = on;
        s.g.visible = on && !(k > b.on - 0.7 && Math.floor(k * 10) % 2 === 0);
      }
      if (s.broken) {
        s.broken += dt;
        s.g.position.y = -s.broken * s.broken * 6;
        s.g.rotation.x = -s.broken * 2;
        if (s.broken > 1.5) { s.g.visible = false; s.broken = 0; s.gone = true; }
      }
    }
    for (const d of discs) d.g.rotation.y = -(t * d.w + d.ph);
    for (const h of hazards) {
      if (h.type === "bar") { h.a = t * h.w + h.ph; h.g.rotation.y = -h.a; }
      else {
        const a = h.amp * Math.sin(t * h.w + h.ph);
        h.arm.rotation.z = a;
        h.bx = h.px + Math.sin(a) * h.len;
        h.by = h.py - Math.cos(a) * h.len;
        h.bz = h.pz;
        h.vx = h.amp * h.w * Math.cos(t * h.w + h.ph) * h.len * Math.cos(a);
      }
    }
    for (const a of anims) a(t, dt);
  }

  // ── consultas para la física ──
  /** altura del suelo bajo (x,z) que esté por debajo de yMax (para la IA: ¿hay hueco?) */
  function groundAt(x, z, yMax) {
    let best = -Infinity;
    for (const s of solids) {
      if (!s.active || s.y1 > yMax) continue;
      if (x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1 && s.y1 > best) best = s.y1;
    }
    for (const r of ramps) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) { const h = r.h(z); if (h <= yMax && h > best) best = h; }
    for (const d of discs) if (d.y <= yMax && Math.hypot(x - d.cx, z - d.cz) < d.r && d.y > best) best = d.y;
    return best;
  }

  /** junta en pocas mallas lo que no se mueve por separado: letras de los carteles (también las
   *  de puertas, empujadores y plataformas móviles, en el espacio de su pieza), plataformas fijas,
   *  tableros, arcos y banderines. Miles de cajitas → unas pocas mallas por tinta. */
  function bake() {
    const staticG = new Set();
    for (const s of solids) if (s.move || s.fall || s.blink || s.door || s.push) s.g.userData.dyn = true; else staticG.add(s.g);
    for (const h of hazards) h.g.userData.dyn = true;
    for (const d of discs) d.g.userData.dyn = true;
    root.updateMatrixWorld(true);
    const holderOf = (o) => { let p = o.parent; while (p && p !== root && !p.userData.dyn) p = p.parent; return p || root; };
    const groups = new Map(), victims = [], inv = new THREE.Matrix4(), m4 = new THREE.Matrix4();
    root.traverse((o) => {
      if (!o.isMesh || !o.parent) return;
      const isText = o.parent.userData.width != null;
      if (!isText && !o.userData.bake && !staticG.has(o.parent)) return;
      const holder = holderOf(o);
      if (!isText && holder !== root) return;
      const k = `${holder.uuid}|${o.material.uuid}`;
      if (!groups.has(k)) groups.set(k, { holder, mat: o.material, geos: [] });
      inv.copy(holder.matrixWorld).invert();
      groups.get(k).geos.push(o.geometry.clone().applyMatrix4(m4.multiplyMatrices(inv, o.matrixWorld)));
      victims.push(o);
    });
    for (const o of victims) o.parent.remove(o);
    for (const { holder, mat: m, geos } of groups.values()) {
      const g = mergeGeometries(geos, false);
      geos.forEach((x) => x.dispose());
      if (g) { holder.add(new THREE.Mesh(g, m)); baked.push(g); }
    }
    return victims.length;
  }
  const baked = [];

  function dispose() {
    scene.remove(root);
    baked.forEach((g) => g.dispose());
  }

  return {
    root, solids, hazards, discs, ramps, gates, checkpoints, anims,
    boxMesh, mesh, sign, plat, wall, mover, sine, fallTile, blink, ramp, disc, bar, pendulum, pusher, door, gate, checkpoint,
    update, groundAt, dispose, bake, _p
  };
}
