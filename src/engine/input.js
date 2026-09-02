// =============================================================================
// input.js — Centralized InputManager (Keyboard, Touch & Game Boy Deck)
// =============================================================================

export const keys = {};
export const touch = {
  L: false,
  R: false,
  Up: false,
  Down: false,
  A: false,
  B: false,
  Atk: false
};

let currentMode = "platformer"; // "platformer" | "fight"

export function setInputMode(mode) {
  currentMode = mode;
  const gbLabelA = document.querySelector(".gb-action-col:has(#gbA) .gb-action-label") || document.querySelectorAll(".gb-action-label")[1];
  const gbLabelB = document.querySelector(".gb-action-col:has(#gbB) .gb-action-label") || document.querySelectorAll(".gb-action-label")[0];

  if (mode === "fight") {
    if (gbLabelA) gbLabelA.textContent = "PUÑO";
    if (gbLabelB) gbLabelB.textContent = "ESPECIAL";
    const tS = document.getElementById("tS");
    if (tS) tS.textContent = "🥊";
    const tB = document.getElementById("tB");
    if (tB) tB.textContent = "⚡";
  } else {
    if (gbLabelA) gbLabelA.textContent = "SALTAR";
    const tS = document.getElementById("tS");
    if (tS) tS.textContent = "⇄";
    const tB = document.getElementById("tB");
    if (tB) tB.textContent = "✦";
  }
}

// ── Unified Action Getters ──────────────────────────────────────────────────
export const isLeft = () => Boolean(keys["ArrowLeft"] || keys["KeyA"] || touch.L);
export const isRight = () => Boolean(keys["ArrowRight"] || keys["KeyD"] || touch.R);
export const isUp = () => Boolean(keys["ArrowUp"] || keys["KeyW"] || touch.Up);
export const isDown = () => Boolean(keys["ArrowDown"] || keys["KeyS"] || touch.Down);

export const isJump = () => {
  if (currentMode === "fight") {
    // In fight mode, UP jumps (arcade style) or pressing Jump button
    return Boolean(keys["ArrowUp"] || keys["KeyW"] || keys["Space"] || touch.Up || (touch.A && !touch.Atk));
  }
  return Boolean(keys["ArrowUp"] || keys["KeyW"] || keys["Space"] || touch.A || touch.Up);
};

export const isAttack = () => {
  if (currentMode === "fight") {
    // Z, J, or Game Boy button A / Touch Atk button
    return Boolean(keys["KeyZ"] || keys["KeyJ"] || touch.Atk || touch.A);
  }
  return Boolean(keys["KeyZ"] || keys["KeyJ"] || touch.Atk);
};

export const isSpecial = () => {
  // X, K, or Game Boy button B / Touch button B
  return Boolean(keys["KeyX"] || keys["KeyK"] || touch.B);
};

// ── Backward Compatible Platformer Aliases ───────────────────────────────────
export const left = isLeft;
export const right = isRight;
export const upK = isUp;
export const downK = isDown;
export const jumpK = isJump;
export const abilK = isSpecial;

export function initInput({ onSwitchChar, onSwitchSlot, onToggleTeam, onToggleMusic, onTryStart, onOpenMap, onPause }) {
  window.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Tab"].includes(e.code)) {
      e.preventDefault();
    }
    if (keys[e.code]) return;
    keys[e.code] = true;

    if (e.code === "Tab") {
      e.shiftKey ? onSwitchChar(-1) : onSwitchChar(1);
    }
    if (e.code === "Digit1" || e.code === "Numpad1") onSwitchSlot ? onSwitchSlot(0) : onSwitchChar(1);
    if (e.code === "Digit2" || e.code === "Numpad2") onSwitchSlot ? onSwitchSlot(1) : onSwitchChar(1);
    if (e.code === "Digit3" || e.code === "Numpad3") onSwitchSlot ? onSwitchSlot(2) : onSwitchChar(1);
    if (e.code === "Escape") onPause ? onPause() : null;
    if (e.code === "KeyT") onToggleTeam();
    if (e.code === "KeyM") onToggleMusic();
    if (e.code === "Enter") onTryStart();
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

  // Landscape HUD touch buttons
  bindT("tL", "L");
  bindT("tR", "R");
  bindT("tA", "A");
  bindT("tB", "B");
  bindT("tS", "Atk", () => {
    if (currentMode === "fight") {
      touch.Atk = true;
      setTimeout(() => { touch.Atk = false; }, 180);
    } else {
      onSwitchChar(1);
    }
  });
  bindT("tT", null, () => {
    if (currentMode === "fight") {
      if (onOpenMap) onOpenMap();
    } else {
      onToggleTeam();
    }
  });

  // Portrait Game Boy Action & System Buttons
  bindT("gbA", "A");
  bindT("gbB", "B");
  bindT("gbSelect", null, () => onToggleTeam());
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
