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
    if (gbLabelA) gbLabelA.textContent = "SALTO";
    if (gbLabelB) gbLabelB.textContent = "HABILIDAD";
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

export function initInput({ onSwitchChar, onToggleTeam, onToggleMusic, onTryStart, onOpenMap }) {
  window.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space", "Tab"].includes(e.code)) {
      e.preventDefault();
    }
    if (keys[e.code]) return;
    keys[e.code] = true;

    if (e.code === "Tab") {
      e.shiftKey ? onSwitchChar(-1) : onSwitchChar(1);
    }
    if (e.code === "KeyT") onToggleTeam();
    if (e.code === "KeyM") onToggleMusic();
    if (e.code === "Enter") onTryStart();
  });

  window.addEventListener("keyup", (e) => {
    keys[e.code] = false;
  });

  function bindT(id, prop, tap) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      tap ? tap() : (touch[prop] = true);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) =>
      el.addEventListener(ev, (e) => {
        e.preventDefault();
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

  // Portrait Game Boy controls
  bindT("gbLeft", "L");
  bindT("gbRight", "R");
  bindT("gbUp", "Up");
  bindT("gbDown", "Down");
  bindT("gbA", "A");
  bindT("gbB", "B");
  bindT("gbSelect", null, () => onToggleTeam());
  bindT("gbStart", null, () => onSwitchChar(1));
  bindT("btnGbMap", null, () => {
    if (onOpenMap) onOpenMap();
  });
}
