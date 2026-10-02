// =============================================================================
// input.js — Teclado global y mando Game Boy del modo vertical
// `touch` refleja lo que se pulsa en el deck (cruceta, A, B); los mundos 3D lo
// leen como "mando" y deckNav.js lo usa para moverse por los menús.
// =============================================================================

import { speakCurrentChar } from "./voice.js";

export const keys = {};
export const touch = {
  L: false,
  R: false,
  Up: false,
  Down: false,
  A: false,
  B: false
};

export function initInput({ onSwitchChar, onSwitchSlot, onOpenMap }) {
  window.addEventListener("keydown", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Tab"].includes(e.code)) e.preventDefault();
    if (keys[e.code]) return;
    keys[e.code] = true;
    // Tecla V: hablar frase / voz del personaje
    if (e.code === "KeyV") speakCurrentChar();
    // Tab / 1-2-3: cambiar de compañero (los mundos lo leen a través de getChar)
    if (e.code === "Tab") onSwitchChar(e.shiftKey ? -1 : 1);
    const slot = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[e.code];
    if (slot !== undefined && onSwitchSlot) onSwitchSlot(slot);
  });

  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  function triggerHaptic(duration = 12) {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(duration);
      }
    } catch (e) {}
  }

  function bindT(id, prop, tap) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      triggerHaptic(14);
      el.classList.add("active");
      tap ? tap() : (touch[prop] = true);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) =>
      el.addEventListener(ev, (e) => {
        e.preventDefault();
        el.classList.remove("active");
        if (!tap) touch[prop] = false;
      })
    );
  }

  // Portrait Game Boy Action & System Buttons
  bindT("gbVoice", null, () => speakCurrentChar());
  bindT("gbA", "A");
  bindT("gbB", "B");
  bindT("gbStart", null, () => onSwitchChar(1));
  bindT("btnGbMap", null, () => {
    if (onOpenMap) onOpenMap();
  });

  // Continuous Thumb-Glide D-Pad (Cognitive Motor Smoothness)
  const dpad = document.querySelector(".gb-dpad");
  if (dpad) {
    let dpadActive = false;
    let activePointerId = null;

    const btnL = document.getElementById("gbLeft");
    const btnR = document.getElementById("gbRight");
    const btnU = document.getElementById("gbUp");
    const btnD = document.getElementById("gbDown");

    const updateDpadFromPoint = (clientX, clientY) => {
      const rect = dpad.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const deadzone = 12;

      const newL = dx < -deadzone;
      const newR = dx > deadzone;
      const newU = dy < -deadzone;
      const newD = dy > deadzone;

      if (newL !== touch.L || newR !== touch.R || newU !== touch.Up || newD !== touch.Down) {
        triggerHaptic(8);
      }

      touch.L = newL;
      touch.R = newR;
      touch.Up = newU;
      touch.Down = newD;

      btnL?.classList.toggle("active", touch.L);
      btnR?.classList.toggle("active", touch.R);
      btnU?.classList.toggle("active", touch.Up);
      btnD?.classList.toggle("active", touch.Down);
    };

    dpad.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dpadActive = true;
      activePointerId = e.pointerId;
      try { dpad.setPointerCapture(e.pointerId); } catch (err) {}
      triggerHaptic(12);
      updateDpadFromPoint(e.clientX, e.clientY);
    });

    dpad.addEventListener("pointermove", (e) => {
      if (!dpadActive || e.pointerId !== activePointerId) return;
      e.preventDefault();
      updateDpadFromPoint(e.clientX, e.clientY);
    });

    const stopDpad = (e) => {
      if (!dpadActive || (activePointerId !== null && e.pointerId !== activePointerId)) return;
      e.preventDefault();
      dpadActive = false;
      activePointerId = null;
      touch.L = false;
      touch.R = false;
      touch.Up = false;
      touch.Down = false;
      btnL?.classList.remove("active");
      btnR?.classList.remove("active");
      btnU?.classList.remove("active");
      btnD?.classList.remove("active");
    };

    dpad.addEventListener("pointerup", stopDpad);
    dpad.addEventListener("pointercancel", stopDpad);
  }
}
