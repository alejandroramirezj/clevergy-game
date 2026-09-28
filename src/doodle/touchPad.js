// =============================================================================
// touchPad.js — Mando táctil común a los mundos 3D (shooter y pelea)
// Pensado para móvil en horizontal:
//   · pulgar izquierdo: joystick flotante (aparece donde apoyas el dedo)
//   · pulgar derecho: hasta 4 botones de acción en abanico (hueco 0 = el grande)
//   · arrastrar en el resto de la pantalla (o sobre un botón con `drag`) = apuntar
// Mismo aspecto de cuaderno en los dos juegos: así el jugador no reaprende nada.
// =============================================================================

// iconos de trazo a mano
export const ICON = {
  fire: '<svg viewBox="0 0 32 32"><path d="M6 26 L9 19 L22 6 C23.5 4.6 26.4 7.4 25 9 L12 22 Z"/><path d="M9 19 L12 22"/><path d="M20 8 L23 11"/><path d="M5 28 C7 27.5 8 27.8 9.5 26.6"/></svg>',
  jump: '<svg viewBox="0 0 32 32"><path d="M16 26 L16 7"/><path d="M8.5 14 L16 6.5 L23.5 14"/><path d="M9 28 C13 26.8 19 27.2 23 28"/></svg>',
  dash: '<svg viewBox="0 0 32 32"><path d="M7 9 L15 16 L7 23"/><path d="M16 9 L24 16 L16 23"/><path d="M3 12 L5 12 M2 16 L5 16 M3 20 L5 20"/></svg>',
  reload: '<svg viewBox="0 0 32 32"><path d="M24.5 12 A9.5 9.5 0 1 0 25 19"/><path d="M25.5 5.5 L25 12.4 L18.3 11.2"/></svg>',
  swap: '<svg viewBox="0 0 32 32"><path d="M6 11 L24 11"/><path d="M19 6 L24.5 11 L19 16"/><path d="M26 21 L8 21"/><path d="M13 16 L7.5 21 L13 26"/></svg>',
  punch: '<svg viewBox="0 0 32 32"><path d="M9 12 C9 8 12 7 14 8 L22 8 C25 8 26 10 26 13 L26 18 C26 22 23 24 20 24 L13 24 C10 24 8 22 8 19 Z"/><path d="M14 8 L14 14 M18 8 L18 14 M22 8.4 L22 14"/><path d="M8 17 L13 17 L13 14"/><path d="M2 12 L5 12 M1 16 L5 16 M2 20 L5 20"/></svg>',
  special: '<svg viewBox="0 0 32 32"><path d="M16 3 L19.2 11.6 L28.3 12 L21.2 17.7 L23.6 26.6 L16 21.5 L8.4 26.6 L10.8 17.7 L3.7 12 L12.8 11.6 Z"/></svg>',
  block: '<svg viewBox="0 0 32 32"><path d="M16 4 L26 8 C26 17 22.5 24 16 28 C9.5 24 6 17 6 8 Z"/><path d="M16 9 L16 22"/><path d="M11 13.5 L21 13.5"/></svg>'
};

const JOY_R = 58;

/**
 * @param {HTMLElement} root  contenedor del juego (recibe los toques)
 * @param {{
 *   actions: Array<{id: string, label?: string, icon?: string, accent?: "red"|"blue", drag?: boolean}>,
 *   onAction?: (id: string, down: boolean) => void,
 *   onLook?: (dx: number, dy: number) => void,
 *   isActive?: () => boolean
 * }} opts
 */
export function createTouchPad(root, { actions, onAction, onLook, isActive = () => true }) {
  const el = document.createElement("div");
  el.className = "dd-pad hidden";
  el.innerHTML = `
    <div class="dd-joy"><div class="dd-joy-base"><i class="dd-joy-knob"></i></div><span class="dd-joy-hint">mueve</span></div>
    <div class="dd-acts">
      ${actions.map((a, i) => `
        <button class="dd-act slot-${i}${a.accent ? ` accent-${a.accent}` : ""}" data-act="${a.id}" aria-label="${a.label || a.id}">
          ${a.icon || ""}${a.label ? `<small>${a.label}</small>` : ""}
        </button>`).join("")}
    </div>`;
  root.appendChild(el);

  const joyEl = el.querySelector(".dd-joy");
  const joyBase = el.querySelector(".dd-joy-base");
  const joyKnob = el.querySelector(".dd-joy-knob");
  const joy = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
  const look = { id: null, x: 0, y: 0 };
  const held = new Set();
  const visible = () => !el.classList.contains("hidden");
  const rootXY = (t) => { const r = root.getBoundingClientRect(); return [t.clientX - r.left, t.clientY - r.top, r]; };

  function joyStart(t) {
    const [x, y] = rootXY(t);
    joy.id = t.identifier; joy.active = true;
    joy.ox = x; joy.oy = y; joy.x = joy.y = 0;
    joyEl.classList.add("on");
    joyBase.style.left = `${x}px`;
    joyBase.style.top = `${y}px`;
    joyKnob.style.transform = "";
  }
  function joyMove(t) {
    const [x, y] = rootXY(t);
    let dx = x - joy.ox, dy = y - joy.oy;
    const len = Math.hypot(dx, dy);
    // si el dedo se aleja mucho, la base le sigue (joystick flotante de verdad)
    if (len > JOY_R * 1.6) {
      const k = (len - JOY_R * 1.6) / len;
      joy.ox += dx * k; joy.oy += dy * k;
      joyBase.style.left = `${joy.ox}px`;
      joyBase.style.top = `${joy.oy}px`;
      dx = x - joy.ox; dy = y - joy.oy;
    }
    const l2 = Math.hypot(dx, dy), cl = Math.min(l2, JOY_R);
    joyKnob.style.transform = `translate(${l2 ? (dx / l2) * cl : 0}px, ${l2 ? (dy / l2) * cl : 0}px)`;
    // zona muerta pequeña y curva suave para poder ir despacio con precisión
    const mag = Math.max(0, cl / JOY_R - 0.12) / 0.88;
    const curve = mag * mag * (3 - 2 * mag) * 0.35 + mag * 0.65;
    joy.x = l2 ? (dx / l2) * curve : 0;
    joy.y = l2 ? (-dy / l2) * curve : 0;
  }
  function joyEnd() {
    joy.id = null; joy.active = false;
    joy.x = joy.y = 0;
    joyEl.classList.remove("on");
    joyKnob.style.transform = "";
  }

  function onTouchStart(e) {
    if (!isActive()) return;
    for (const t of e.changedTouches) {
      if (t.target.closest && t.target.closest("button, input, .dd-ov")) continue;
      const [x, , r] = rootXY(t);
      if (visible() && joy.id === null && x < r.width * 0.45) joyStart(t);
      else if (look.id === null) { look.id = t.identifier; look.x = t.clientX; look.y = t.clientY; }
      e.preventDefault();
    }
  }
  function onTouchMove(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joy.id) { joyMove(t); e.preventDefault(); continue; }
      if (t.identifier !== look.id) continue;
      if (onLook) onLook(t.clientX - look.x, t.clientY - look.y);
      look.x = t.clientX; look.y = t.clientY;
      e.preventDefault();
    }
  }
  function onTouchEnd(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joy.id) joyEnd();
      if (t.identifier === look.id) look.id = null;
    }
  }
  root.addEventListener("touchstart", onTouchStart, { passive: false });
  root.addEventListener("touchmove", onTouchMove, { passive: false });
  root.addEventListener("touchend", onTouchEnd);
  root.addEventListener("touchcancel", onTouchEnd);

  // botones: pulsar/soltar; los que tienen `drag` además sirven para apuntar
  el.querySelectorAll(".dd-act").forEach((b, i) => {
    const a = actions[i];
    let pid = null, lx = 0, ly = 0;
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isActive()) return;
      pid = e.pointerId; lx = e.clientX; ly = e.clientY;
      try { b.setPointerCapture(e.pointerId); } catch (err) {}
      b.classList.add("on");
      held.add(a.id);
      try { navigator.vibrate && navigator.vibrate(10); } catch (err) {}
      if (onAction) onAction(a.id, true);
    });
    b.addEventListener("pointermove", (e) => {
      if (e.pointerId !== pid || !a.drag || !onLook) return;
      onLook(e.clientX - lx, e.clientY - ly);
      lx = e.clientX; ly = e.clientY;
    });
    const up = (e) => {
      if (e.pointerId !== pid) return;
      pid = null;
      b.classList.remove("on");
      held.delete(a.id);
      if (onAction) onAction(a.id, false);
    };
    b.addEventListener("pointerup", up);
    b.addEventListener("pointercancel", up);
    b.addEventListener("click", (e) => e.preventDefault());
  });

  // suelta todo (al pausar, ocultar o cambiar de orientación)
  function release() {
    if (joy.id !== null) joyEnd();
    look.id = null;
    el.querySelectorAll(".dd-act.on").forEach((b) => b.classList.remove("on"));
    held.forEach((id) => { if (onAction) onAction(id, false); });
    held.clear();
  }

  return {
    el,
    joy,
    isHeld: (id) => held.has(id),
    setVisible(v) { if (!v) release(); el.classList.toggle("hidden", !v); },
    release,
    destroy() {
      release();
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
      el.remove();
    }
  };
}
