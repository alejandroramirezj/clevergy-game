// =============================================================================
// fallSim.js — Física e IA de los concursantes de "La Integración"
// Sin DOM ni render: se puede ejecutar en Node para probar que las rondas se
// pueden terminar. `E` es el entorno de la partida (kit, nivel, concursantes,
// tú, reloj de la ronda y los efectos de sonido/HUD).
// =============================================================================

// física de los concursantes (todos iguales)
export const R = 0.42, H = 1.6, G = 26, JUMP = 9.6, SPEED = 7.4, ACC = 46, AIR_ACC = 17;
export const DIVE_H = 11.5, DIVE_V = 5, STEP_UP = 0.48;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rnd = (a, b) => a + Math.random() * (b - a);

/** cerebro nuevo de CPU */
export const newBot = () => ({ picks: {}, bad: new Set(), path: null, skill: rnd(0.84, 1), lane: rnd(-0.6, 0.6), stuckT: 0, lastBest: -99, jumpCd: 0, grabT: 0, wiggle: rnd(0, 6), react: rnd(0.05, 0.25) });

export function createSim(E) {
  // ── IA ──
  function flatten(c) {
    const b = c.bot, out = [];
    const walk = (segs) => {
      for (const seg of segs) {
        if (seg.wps) { for (const w of seg.wps) out.push(w); continue; }
        let idx = b.picks[seg.id];
        const ok = seg.alts.map((a, i) => !b.bad.has(`${seg.id}:${i}`));
        if (idx == null || !ok[idx]) {
          const cand = seg.alts.map((a, i) => (ok[i] || !ok.some(Boolean) ? a.w || 1 : 0));
          let tot = cand.reduce((a, v) => a + v, 0), x = Math.random() * tot;
          idx = 0;
          for (let i = 0; i < cand.length; i++) { x -= cand[i]; if (x <= 0 && cand[i] > 0) { idx = i; break; } }
          b.picks[seg.id] = idx;
        }
        walk(seg.alts[idx].segs);
      }
    };
    walk(E.L.path);
    b.path = out;
  }
  // ¿en qué bifurcación (elegida) estaba al caerse o atascarse?
  function blameAlt(c, z, kind) {
    const b = c.bot;
    let changed = false;
    const scan = (segs) => {
      for (const seg of segs) {
        if (!seg.alts) continue;
        const idx = b.picks[seg.id];
        if (idx == null) continue;
        const a = seg.alts[idx];
        if (a.z0 != null && z >= a.z0 - 2 && z <= a.z1 + 2) {
          if (a.dead === kind || (kind === "fall" && Math.random() < 0.2)) { if (a.dead === kind) b.bad.add(`${seg.id}:${idx}`); delete b.picks[seg.id]; changed = true; }
        }
        scan(a.segs);
      }
    };
    scan(E.L.path);
    if (changed) flatten(c);
  }
  function wpX(w) {
    if (!w.follow) return w.x;
    const s = w.follow;
    return (s.x0 + s.x1) / 2;
  }
  function aiInput(c, dt) {
    const b = c.bot;
    if (!b.path) flatten(c);
    const inp = { mx: 0, mz: 0, jump: false, grab: false };
    if (c.finished) return inp;
    // siguiente punto de la ruta
    let w = null;
    for (const p of b.path) if (p.z > c.z + 0.6) { w = p; break; }
    if (!w) w = { x: 0, z: c.z + 5 };
    let tx = wpX(w) + b.lane * (w.follow ? 0.3 : 0.9), tz = w.z;
    // plataformas que se mueven / que desaparecen: espera a que lleguen
    let waiting = false;
    // waypoint directo sobre plataforma blink (ej: tokens del camino API)
    if (w.blink && !w.follow) {
      const s = w.blink;
      const near = s.z0 - c.z < 5;
      if (near && s.blink) {
        const bl = s.blink, per = bl.on + bl.off, k = (((E.t + 0.5 + bl.ph) % per) + per) % per;
        if (!s.active || k > bl.on - 0.4) { tz = c.z; tx = wpX(w); waiting = true; }
      }
    }
    if (w.follow && c.ground && c.ground !== w.follow) {
      const s = w.follow;
      // dónde estará la plataforma cuando aterrice (~0,6 s)
      const fut = s.move ? s.bx + s.move(E.t + 0.6).x : (s.x0 + s.x1) / 2;
      const aligned = Math.abs(fut - c.x) < 0.9 && Math.abs((s.x0 + s.x1) / 2 - c.x) < 1.6;
      const near = s.z0 - c.z < 3.6;
      if (near && !aligned && E.K.groundAt(c.x, c.z + 1.2, c.y + 0.5) < c.y - 0.5) { tz = c.z; tx = c.x + clamp(fut - c.x, -0.6, 0.6); waiting = true; }
      // columnas que suben y bajan: espera a que estén a tiro de salto
      if (near && s.move && s.by + s.move(E.t + 0.5).y > c.y + 1.3) { tz = c.z; tx = c.x; waiting = true; }
      if (near && s.blink) {
        const bl = s.blink, per = bl.on + bl.off, k = (((E.t + 0.5 + bl.ph) % per) + per) % per;
        if (!s.active || k > bl.on - 0.3) { tz = c.z; tx = c.x; waiting = true; }
      }
    }
    // barreras que se abren y cierran: espera delante mientras estén cerradas (o a punto de cerrarse)
    for (const s of E.K.blocks) {
      const ahead = s.z0 - c.z;
      if (ahead < -0.3 || ahead > 2.4 || c.x < s.x0 - 0.5 || c.x > s.x1 + 0.5) continue;
      const bl = s.blink, per = bl.on + bl.off, k = (((E.t + bl.ph) % per) + per) % per;
      if (k < bl.on || k > per - 0.4) { tz = c.z; tx = c.x; waiting = true; b.stuckT = 0; b.lastBest = c.z; }
    }
    let dx = tx - c.x, dz = tz - c.z;
    const l = Math.hypot(dx, dz) || 1;
    dx /= l; dz /= l;
    const sp = b.skill * (Math.abs(tz - c.z) < 0.01 ? 0.55 : 1);
    inp.mx = dx * sp + Math.sin(E.t * 1.3 + b.wiggle) * 0.08;
    inp.mz = dz * sp;
    // saltos: hueco delante, escalón alto, obstáculo bajo o punto marcado
    b.jumpCd -= dt;
    if (c.ground && b.jumpCd <= 0 && c.stun <= 0 && !waiting) {
      const a1 = E.K.groundAt(c.x + dx * 1.1, c.z + dz * 1.1, c.y + 0.5);
      const hi = E.K.groundAt(c.x + dx * 0.9, c.z + dz * 0.9, c.y + 2.2);
      let j = a1 < c.y - 1.2 || hi > c.y + STEP_UP + 0.02 || (w.jump && Math.hypot(tx - c.x, tz - c.z) < 2);
      for (const h of E.K.hazards) if (h.type === "bar" && Math.abs(c.y - (h.cy - 0.55)) < 0.6 && Math.hypot(c.x - h.cx, c.z - h.cz) < h.len + 1.2) {
        // ¿viene la barra hacia mí? salta justo antes
        const a = h.a, px = c.x - h.cx, pz = c.z - h.cz, ang = Math.atan2(pz, px);
        let d = ((ang - a) % Math.PI + Math.PI * 2) % Math.PI; // distancia angular a la barra (cualquier brazo)
        if (h.w < 0) d = Math.PI - d;
        if (d > Math.PI - 0.55 && Math.random() < 0.85) j = true;
      }
      if (j) { inp.jump = true; b.jumpCd = 0.35 + b.react; }
    } else if (!c.ground && c.jumps === 1 && c.vy < 1.5 && !c.dive) {
      const below = E.K.groundAt(c.x + dx * 1.6, c.z + dz * 1.6, c.y + 0.3);
      const far = E.K.groundAt(c.x + dx * 4.5, c.z + dz * 4.5, c.y + 0.6);
      if (below < c.y - 3 && far > -50) inp.jump = true;
    }
    // atascado (puerta cerrada, empujón…): busca otra puerta / se mueve de lado
    if (c.z > b.lastBest + 0.3) { b.lastBest = c.z; b.stuckT = 0; }
    else if (c.ground) {
      b.stuckT += dt;
      if (b.stuckT > 1.4) { b.stuckT = 0; b.lastBest = c.z; blameAlt(c, c.z, "locked"); b.lane = rnd(-1, 1); if (Math.random() < 0.5) inp.jump = true; }
    }
    // agarrar a quien vaya justo delante (a veces)
    b.grabT -= dt;
    if (b.grabT > 0) inp.grab = true;
    else if (Math.random() < 0.004) {
      const t = E.cs.find((o) => o !== c && !o.finished && Math.hypot(o.x - c.x, o.z - c.z) < 1.3 && o.z > c.z && Math.abs(o.y - c.y) < 1);
      if (t) b.grabT = rnd(0.6, 1.4);
    }
    return inp;
  }
  
  // ── física de un concursante ──
  const overlapXZ = (c, s, m) => c.x > s.x0 - m && c.x < s.x1 + m && c.z > s.z0 - m && c.z < s.z1 + m;
  function knock(c, vx, vz, vy = 6) {
    if (c.stun > 0.25 || c.finished) return;
    c.vx = vx; c.vz = vz; c.vy = Math.max(c.vy, vy);
    c.stun = 0.7; c.dive = false; c.ground = null;
    release(c);
    if (c === E.me) { E.sfx.bonk(); E.shake(0.6); E.buzz(40); }
  }
  function release(c) {
    if (c.grabbing) { if (E.onGrab) E.onGrab(c, c.grabbing, false); c.grabbing.grabbedBy = null; c.grabbing = null; c.grabCd = 0.9; }
  }
  function breakDoor(s, c) {
    if (s.broken || s.gone) return;
    s.active = false;
    s.broken = 0.001;
    if (c === E.me || Math.hypot(c.x - (E.me ? E.me.x : 0), c.z - (E.me ? E.me.z : 0)) < 16) E.sfx.door();
    E.burst(c.x, c.y + 1.2, c.z + 0.5, s.ink, 14);
  }
  function stepChar(c, inp, dt) {
    if (c.respawnT > 0) { c.respawnT -= dt; if (c.respawnT <= 0) respawn(c); return; }
    c.stun = Math.max(0, c.stun - dt);
    c.recover = Math.max(0, c.recover - dt);
    c.grabCd = Math.max(0, c.grabCd - dt);
    c.coyote = c.ground ? 0.1 : c.coyote - dt;
    const ml = Math.hypot(inp.mx, inp.mz);
    const ctrl = c.stun <= 0 && c.recover <= 0 && !c.finished;
    // agarrar
    c.grabHeld = inp.grab && ctrl;
    if (c.grabbing) {
      const o = c.grabbing;
      c.grabT -= dt;
      if (!inp.grab || c.grabT <= 0 || o.respawnT > 0 || Math.hypot(o.x - c.x, o.z - c.z) > 2.1 || Math.abs(o.y - c.y) > 1.5 || c.stun > 0) release(c);
      else { // tira de él hacia ti
        o.vx += (c.x - o.x) * 2 * dt; o.vz += (c.z - o.z) * 2 * dt;
      }
    } else if (c.grabHeld && c.grabCd <= 0) {
      const fx = Math.sin(c.yaw), fz = Math.cos(c.yaw);
      for (const o of E.cs) {
        if (o === c || o.respawnT > 0 || o.grabbedBy || o.finished) continue;
        const ox = o.x - c.x, oz = o.z - c.z, d = Math.hypot(ox, oz);
        if (d < 1.4 && Math.abs(o.y - c.y) < 1.2 && (ox * fx + oz * fz) / (d || 1) > 0.15) {
          c.grabbing = o; o.grabbedBy = c; c.grabT = 2.2;
          if (E.onGrab) E.onGrab(c, o, true);
          if (c === E.me || o === E.me) E.sfx.grab();
          if (o === E.me) E.flash("", `¡${c.name} te ha agarrado!`, 1);
          break;
        }
      }
    }
    // velocidad
    const maxV = SPEED * c.slowF * (c.grabbedBy ? 0.35 : 1) * (c.grabbing ? 0.55 : 1);
    if (ctrl && !c.dive) {
      const a = (c.ground ? ACC : AIR_ACC) * dt;
      c.vx += clamp(inp.mx * maxV - c.vx, -a, a);
      c.vz += clamp(inp.mz * maxV - c.vz, -a, a);
      if (ml > 0.2) c.yaw = Math.atan2(inp.mx, inp.mz);
    } else if (c.ground) {
      const f = Math.pow(c.dive || c.recover > 0 ? 0.08 : 0.02, dt);
      c.vx *= f; c.vz *= f;
    }
    // salto y doble salto (te lanzas hacia delante)
    if (ctrl && inp.jump) {
      if (c.ground || c.coyote > 0) {
        c.vy = JUMP * (c.grabbedBy ? 0.75 : 1); c.ground = null; c.coyote = 0; c.jumps = 1;
        if (c === E.me) E.sfx.jump();
      } else if (c.jumps < 2 && !c.dive) {
        const dx = ml > 0.2 ? inp.mx / ml : Math.sin(c.yaw), dz = ml > 0.2 ? inp.mz / ml : Math.cos(c.yaw);
        c.vx = dx * DIVE_H; c.vz = dz * DIVE_H; c.vy = DIVE_V;
        c.dive = true; c.jumps = 2; c.yaw = Math.atan2(dx, dz);
        release(c);
        if (c === E.me) E.sfx.dive();
      }
    }
    // lo que te mueve el suelo (plataformas, ruletas, cintas)
    const gnd = c.ground;
    if (gnd) {
      if (gnd.kind === "disc") {
        const a = -gnd.d.w * dt, px = c.x - gnd.d.cx, pz = c.z - gnd.d.cz;
        const ca = Math.cos(a), sa = Math.sin(a);
        c.x = gnd.d.cx + px * ca - pz * sa; c.z = gnd.d.cz + px * sa + pz * ca;
      } else {
        if (gnd.move) { c.x += gnd.dx; c.y += gnd.dy; c.z += gnd.dz; }
        if (gnd.belt) { c.x += gnd.belt.vx * dt; c.z += gnd.belt.vz * dt; }
      }
    }
    c.vy = Math.max(-30, c.vy - G * dt);
    // vertical
    const py = c.y;
    c.y += c.vy * dt;
    const wasGround = !!c.ground;
    c.ground = null;
    let top = -Infinity, hit = null;
    if (c.vy <= 0) {
      for (const s of E.K.solids) {
        if (!s.active || !overlapXZ(c, s, R * 0.7)) continue;
        if (py >= s.y1 - 0.06 && c.y <= s.y1 && s.y1 > top) { top = s.y1; hit = s; }
      }
      for (const r of E.K.ramps) {
        if (c.x < r.x0 || c.x > r.x1 || c.z < r.z0 - 0.2 || c.z > r.z1 + 0.2) continue;
        const h = r.h(c.z);
        if (py >= h - 0.35 && c.y <= h + 0.02 && h > top) { top = h; hit = r; }
      }
      for (const d of E.K.discs) {
        if (Math.hypot(c.x - d.cx, c.z - d.cz) > d.r) continue;
        if (py >= d.y - 0.06 && c.y <= d.y && d.y > top) { top = d.y; hit = { kind: "disc", d }; }
      }
    } else {
      for (const s of E.K.solids) {
        if (!s.active || !overlapXZ(c, s, R * 0.6)) continue;
        if (py + H <= s.y0 + 0.05 && c.y + H > s.y0) { c.y = s.y0 - H; c.vy = 0; }
      }
    }
    if (hit) {
      c.y = top; c.vy = 0; c.ground = hit; c.jumps = 0;
      if (!wasGround && c === E.me && py - top > 0.4) E.sfx.land();
      if (c.dive) { c.dive = false; c.recover = 0.32; }
    }
    // horizontal
    c.x += c.vx * dt;
    c.z += c.vz * dt;
    c.wall = null;
    for (const s of E.K.solids) {
      if (!s.active) continue;
      if (c.y >= s.y1 - 0.02 || c.y + H <= s.y0 + 0.02) continue;
      const ex0 = s.x0 - R, ex1 = s.x1 + R, ez0 = s.z0 - R, ez1 = s.z1 + R;
      if (c.x <= ex0 || c.x >= ex1 || c.z <= ez0 || c.z >= ez1) continue;
      if (s.door && s.door !== "locked") { breakDoor(s, c); continue; }
      if (s.y1 - c.y <= STEP_UP && !s.door && !s.push && (c.ground || c.vy <= 0)) { c.y = s.y1; c.ground = s; c.vy = 0; c.jumps = 0; continue; }
      const pl = c.x - ex0, pr = ex1 - c.x, pb = c.z - ez0, pf = ez1 - c.z;
      const m = Math.min(pl, pr, pb, pf);
      if (m === pl) { c.x = ex0; if (c.vx > 0) c.vx = 0; }
      else if (m === pr) { c.x = ex1; if (c.vx < 0) c.vx = 0; }
      else if (m === pb) { c.z = ez0; if (c.vz > 0) c.vz = 0; }
      else { c.z = ez1; if (c.vz < 0) c.vz = 0; }
      c.wall = s;
      if (s.push && Math.abs(s.dx) > 0.002) knock(c, Math.sign(s.dx) * 8, rnd(-1, 1), 5);
      if (s.door === "locked" && c === E.me && Math.random() < 0.05) { E.sfx.locked(); E.flash("🔒", "Esta puerta no se abre", 0.9); }
    }
    for (const d of E.K.discs) { // canto de las ruletas
      if (c.y >= d.y - 0.02 || c.y + H <= d.y - 0.8) continue;
      const px = c.x - d.cx, pz = c.z - d.cz, dist = Math.hypot(px, pz);
      if (dist < d.r + R && dist > 0.01) {
        if (d.y - c.y <= STEP_UP && (c.ground || c.vy <= 0)) { c.y = d.y; c.ground = { kind: "disc", d }; continue; }
        c.x = d.cx + (px / dist) * (d.r + R); c.z = d.cz + (pz / dist) * (d.r + R);
      }
    }
    // efectos del suelo
    c.slowF = 1;
    const g = c.ground;
    if (g && g.kind !== "disc") {
      if (g.bounce) {
        c.vy = g.bounce; c.vz = Math.max(c.vz, g.launch || 0); c.ground = null; c.jumps = 1; c.dive = false;
        if (c === E.me) { E.sfx.boing(); E.flash("🔔", "¡Notificación!", 0.6); }
      }
      if (g.fall && g.fall.state === 0) { g.fall.state = 1; g.fall.t = 0; }
      if (g.slow) c.slowF = g.slow;
    } else if (!g) {
      // saltar por encima de la cola no te la salta: también frena en el aire
      for (const s of E.K.slows) if (c.x > s.x0 && c.x < s.x1 && c.z > s.z0 && c.z < s.z1 && c.y < s.y1 + 3.2) { c.slowF = s.slow; break; }
    }
    if (c.ground) { c.lastSafeZ = c.z; c.lastGroundY = c.y; }
    // obstáculos
    for (const h of E.K.hazards) {
      if (h.type === "bar") {
        if (c.y > h.cy + 0.25 || c.y + H < h.cy - 0.25) continue;
        const ca = Math.cos(h.a), sa = Math.sin(h.a), px = c.x - h.cx, pz = c.z - h.cz;
        const t = clamp(px * ca + pz * sa, -h.len, h.len);
        const qx = h.cx + ca * t, qz = h.cz + sa * t;
        const d = Math.hypot(c.x - qx, c.z - qz);
        if (d < R + h.r) {
          const tvx = -sa * h.w * t, tvz = ca * h.w * t, tl = Math.hypot(tvx, tvz) || 1;
          const k = clamp(tl * 0.7, 5, 7.5);
          knock(c, (tvx / tl) * k, (tvz / tl) * k, 5.5);
          const nx = (c.x - qx) / (d || 1), nz = (c.z - qz) / (d || 1);
          c.x = qx + nx * (R + h.r + 0.02); c.z = qz + nz * (R + h.r + 0.02);
        }
      } else {
        const cy = clamp(h.by, c.y + R, c.y + H - R);
        const d = Math.hypot(c.x - h.bx, cy - h.by, c.z - h.bz);
        if (d < h.r + R) knock(c, Math.sign(h.vx || (c.x - h.bx)) * 8, rnd(-1.5, 0.5), 5.5);
      }
    }
    // checkpoint, arcos y meta
    for (let i = 0; i < E.K.checkpoints.length; i++) {
      const cp = E.K.checkpoints[i];
      if (c.ground && c.z >= cp.z && c.x >= cp.x0 && c.x <= cp.x1 && cp.z > E.K.checkpoints[c.cp].z) c.cp = i;
    }
    if (c === E.me) for (const gt of E.K.gates) {
      if (!gt.passed && c.z > gt.z && c.x > gt.x0 - 1 && c.x < gt.x1 + 1 && c.y > gt.y - 1) {
        gt.passed = true;
        E.tick(gt.idx);
      }
    }
    if (E.L.finish && !c.finished && c.z >= E.L.finish.z && c.x >= E.L.finish.x0 && c.x <= E.L.finish.x1 && c.y > E.L.finish.y - 0.6) E.finishC(c);
    if (E.L.battery && !E.winner) {
      const b = E.L.battery;
      const cy = clamp(b.y, c.y, c.y + H);
      if (Math.hypot(c.x - b.x, cy - b.y, c.z - b.z) < b.r + R) E.winBattery(c);
    }
    c.bestZ = Math.max(c.bestZ, c.z);
    // caída
    if (c.y < E.L.killY) {
      c.falls++;
      if (c === E.me) { E.myFall(); E.sfx.fall(); E.flash("¡UY!", "Vuelves al último punto de control", 1.1); E.buzz(60); }
      c.respawnT = 0.9;
      c.grabbedBy = null; release(c);
      if (c.bot) blameAlt(c, c.lastSafeZ, "fall");
    }
  }
  function respawn(c) {
    const cp = E.K.checkpoints[c.cp] || E.K.checkpoints[0];
    const sp = cp.spawn;
    c.x = rnd(sp.x0, sp.x1); c.z = sp.z + rnd(-0.6, 0.6); c.y = sp.y + 0.4;
    c.vx = c.vy = c.vz = 0; c.stun = 0; c.dive = false; c.ground = null; c.jumps = 0; c.yaw = 0;
    if (c.bot) { c.bot.lastBest = c.z; c.bot.stuckT = 0; }
  }
  function collideContestants() {
    for (let i = 0; i < E.cs.length; i++) for (let j = i + 1; j < E.cs.length; j++) {
      const a = E.cs[i], b = E.cs[j];
      if (a.respawnT > 0 || b.respawnT > 0) continue;
      if (Math.abs(a.y - b.y) > H * 0.9) continue;
      const dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz);
      if (d >= R * 2 || d < 1e-4) continue;
      const p = (R * 2 - d) / 2, nx = dx / d, nz = dz / d;
      a.x -= nx * p; a.z -= nz * p; b.x += nx * p; b.z += nz * p;
      // quien va lanzado en plancha tira al otro
      if (a.dive && !b.dive) hit(b, nx * 7, nz * 7, 4);
      if (b.dive && !a.dive) hit(a, -nx * 7, -nz * 7, 4);
    }
  }

  /** golpe a otro concursante: si lo mueve otro móvil, se le avisa a su dueño */
  function hit(c, vx, vz, vy) {
    if (!E.owned || E.owned(c)) knock(c, vx, vz, vy);
    else if (E.onHit && c.stun <= 0) { c.stun = 0.7; E.onHit(c, vx, vz, vy); }
  }

  /** un concursante de otro móvil también rompe puertas y hunde baldosas en esta pantalla */
  function remoteContact(c) {
    if (c.respawnT > 0) return;
    for (const s of E.K.solids) {
      if (!s.active) continue;
      if (s.door && s.door !== "locked") {
        if (c.y < s.y1 && c.y + H > s.y0 && c.x > s.x0 - R && c.x < s.x1 + R && c.z > s.z0 - R && c.z < s.z1 + R) breakDoor(s, c);
      } else if (s.fall && s.fall.state === 0 && Math.abs(c.y - s.y1) < 0.3 && overlapXZ(c, s, 0)) { s.fall.state = 1; s.fall.t = 0; }
    }
  }

  return { aiInput, stepChar, collideContestants, respawn, flatten, knock, remoteContact };
}
