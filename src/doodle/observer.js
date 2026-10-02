// =============================================================================
// observer.js — Cámara libre de "observador" para recorrer los mundos
// (Historia y personajes → Mundos → Explorar). Teclado y ratón: WASD / flechas
// para moverte, arrastrar para mirar, rueda para avanzar, Q/E o Espacio/Ctrl para
// bajar y subir, Shift para ir rápido. Móvil: joystick + arrastrar + SUBIR/BAJAR.
// Convenio de ángulos: yaw 0 mira hacia -z (como el BoliBic Tag).
// =============================================================================

import { createTouchPad, ICON } from "./touchPad.js";
import { touch as mando } from "../engine/input.js";

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/**
 * @param {HTMLElement} root  contenedor (recibe ratón y toques)
 * @param {import("three").PerspectiveCamera} camera
 * @param {{ pos: {x:number,y:number,z:number}, yaw?: number, pitch?: number, speed?: number, minY?: number, flat?: boolean }} start
 */
export function createObserver(root, camera, start) {
  const st = { x: start.pos.x, y: start.pos.y, z: start.pos.z, yaw: start.yaw || 0, pitch: start.pitch || 0 };
  const speed = start.speed || 12;
  const keys = {};
  const tp = { up: false, down: false };
  let wheel = 0;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  const onKey = (e) => {
    if (e.target && e.target.tagName === "INPUT") return;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    keys[e.code] = e.type === "keydown";
  };
  const onBlur = () => { for (const k in keys) keys[k] = false; };
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  window.addEventListener("blur", onBlur);

  // arrastrar con el ratón = mirar
  let drag = null;
  const look = (dx, dy) => {
    st.yaw -= dx * 0.005;
    st.pitch = clamp(st.pitch - dy * 0.004, -1.45, 1.2);
  };
  const onDown = (e) => {
    if (e.pointerType === "touch" || e.target.closest("button, .ov-bar")) return;
    drag = { x: e.clientX, y: e.clientY };
  };
  const onMove = (e) => {
    if (!drag || e.pointerType === "touch") return;
    look(e.clientX - drag.x, e.clientY - drag.y);
    drag = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => { drag = null; };
  const onWheel = (e) => { e.preventDefault(); wheel += clamp(-e.deltaY, -200, 200) * 0.05; };
  root.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  root.addEventListener("wheel", onWheel, { passive: false });

  const pad = isTouch ? createTouchPad(root, {
    actions: [
      { id: "up", label: "SUBIR", icon: ICON.jump, accent: "blue" },
      { id: "down", label: "BAJAR", icon: '<svg viewBox="0 0 32 32"><path d="M16 6 L16 25"/><path d="M8.5 18 L16 25.5 L23.5 18"/></svg>' }
    ],
    onAction: (id, down) => { tp[id] = down; },
    onLook: look
  }) : null;
  if (pad) pad.setVisible(true);

  function update(dt) {
    const joy = pad ? pad.joy : { x: 0, y: 0 };
    let ix = joy.x, iy = joy.y;
    if (keys.KeyA || keys.ArrowLeft || mando.L) ix -= 1;
    if (keys.KeyD || keys.ArrowRight || mando.R) ix += 1;
    if (keys.KeyW || keys.ArrowUp || mando.Up) iy += 1;
    if (keys.KeyS || keys.ArrowDown || mando.Down) iy -= 1;
    let iz = 0;
    if (keys.KeyE || keys.Space || tp.up || mando.A) iz += 1;
    if (keys.KeyQ || keys.ControlLeft || keys.ControlRight || tp.down || mando.B) iz -= 1;
    const fast = keys.ShiftLeft || keys.ShiftRight ? 3 : 1;
    const v = speed * fast * dt;
    // adelante según hacia dónde miras (en plano, para no "bucear" sin querer)
    const fx = -Math.sin(st.yaw), fz = -Math.cos(st.yaw), rx = Math.cos(st.yaw), rz = -Math.sin(st.yaw);
    st.x += (fx * iy + rx * ix) * v;
    st.z += (fz * iy + rz * ix) * v;
    st.y += iz * v;
    if (wheel) { // la rueda avanza hacia donde miras (también en altura)
      const k = wheel * 0.25;
      st.x += fx * Math.cos(st.pitch) * k; st.z += fz * Math.cos(st.pitch) * k; st.y += Math.sin(st.pitch) * k;
      wheel *= 0.75;
      if (Math.abs(wheel) < 0.05) wheel = 0;
    }
    if (start.minY != null) st.y = Math.max(start.minY, st.y);
    camera.position.set(st.x, st.y, st.z);
    camera.rotation.order = "YXZ";
    camera.rotation.set(st.pitch, st.yaw, 0);
  }

  function dispose() {
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKey);
    window.removeEventListener("blur", onBlur);
    root.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    root.removeEventListener("wheel", onWheel);
    if (pad) pad.destroy();
  }

  return { update, dispose, state: st };
}

/** barra de arriba del observador: título, pestañas (opcionales) y cerrar */
export function observerBar(root, { title, sub, tabs, onTab, onClose }) {
  const bar = document.createElement("div");
  bar.className = "ov-bar";
  bar.innerHTML = `
    <button class="ov-close" aria-label="Cerrar">✕</button>
    <div class="ov-title"><small>👁 MODO OBSERVADOR</small><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</div>
    ${tabs ? `<div class="ov-tabs">${tabs.map((t, i) => `<button class="ov-tab${i === 0 ? " on" : ""}" data-i="${i}">${t}</button>`).join("")}</div>` : ""}
    <div class="ov-help">${window.matchMedia("(pointer: coarse)").matches ? "Joystick para moverte · arrastra para mirar · SUBIR / BAJAR" : "WASD moverte · arrastra para mirar · rueda avanzar · E/Q subir y bajar · Shift rápido"}</div>`;
  root.appendChild(bar);
  bar.querySelector(".ov-close").addEventListener("click", (e) => { e.stopPropagation(); onClose(); });
  bar.querySelectorAll(".ov-tab").forEach((b) => b.addEventListener("click", (e) => {
    e.stopPropagation();
    bar.querySelectorAll(".ov-tab").forEach((x) => x.classList.toggle("on", x === b));
    onTab(Number(b.dataset.i));
  }));
  return bar;
}
