export const keys = {};
export const touch = { L: false, R: false, A: false, B: false };

export const left = () => keys["ArrowLeft"] || keys["KeyA"] || touch.L;
export const right = () => keys["ArrowRight"] || keys["KeyD"] || touch.R;
export const upK = () => keys["ArrowUp"] || keys["KeyW"] || touch.A;
export const downK = () => keys["ArrowDown"] || keys["KeyS"];
export const jumpK = () => keys["ArrowUp"] || keys["KeyW"] || keys["Space"] || touch.A;
export const abilK = () => keys["KeyX"] || keys["KeyJ"] || touch.B;

export function initInput({ onSwitchChar, onToggleTeam, onToggleMusic, onTryStart }) {
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

  bindT("tL", "L");
  bindT("tR", "R");
  bindT("tA", "A");
  bindT("tB", "B");
  bindT("tS", null, () => onSwitchChar(1));
  bindT("tT", null, () => onToggleTeam());
}
