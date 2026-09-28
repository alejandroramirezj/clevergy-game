// =============================================================================
// deckNav.js — El mando Game Boy (vertical) también maneja los menús
// Con una pantalla de menú abierta, la cruceta mueve el foco entre botones,
// ◀ ▶ cambian de personaje o de mundo, A pulsa el botón marcado y B vuelve atrás.
// Durante la partida no hace nada: el mando sigue siendo el control del juego.
// =============================================================================

import { touch } from "../engine/input.js";

// (offsetParent no vale: es null en los elementos position: fixed)
const visible = (el) => {
  if (!el || !el.getClientRects().length) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.05;
};

// la pantalla de menú que está delante (o null si se está jugando)
function activeScreen() {
  const auth = document.querySelector(".cg-auth-ov:not(.hidden)");
  if (auth) return auth;
  const dd = [...document.querySelectorAll("#doodleRoot .dd-ov:not(.hidden)")].find(visible);
  if (dd) return dd;
  for (const id of ["compendiumOv", "lbOv", "ctrlOv", "worldMapOv", "menuOv"]) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("hidden") && visible(el)) return el;
  }
  return null;
}
const focusables = (scr) => [...scr.querySelectorAll("button:not([disabled]), input, .ws-card")].filter((b) => visible(b) && !b.closest(".hidden") && !b.classList.contains("cf-arrow") && !b.classList.contains("pf-arrow"));
const primaryOf = (scr) =>
  scr.querySelector(".ws-card.selected .ws-play") || scr.querySelector("#btnPlay") ||
  [...scr.querySelectorAll(".dd-btn:not(.dd-ghost):not([disabled]), .cg-claim-ok")].find(visible) || focusables(scr)[0];
const backOf = (scr) =>
  [...scr.querySelectorAll(".nb-back, #btnCloseMap, .cg-auth-x, .cg-auth-skip, .pf-exit, .cf-exit, .dd-ghost")].find(visible);

export function initDeckNav({ onMenuChar } = {}) {
  const prev = { L: false, R: false, Up: false, Down: false };
  let focusEl = null, lastScr = null;
  const setFocus = (el) => {
    if (focusEl) focusEl.classList.remove("deck-focus");
    focusEl = el;
    if (el) { el.classList.add("deck-focus"); el.scrollIntoView?.({ block: "nearest", inline: "nearest" }); }
  };
  // la pantalla de menú activa (o null en partida); recoloca el foco si ha cambiado
  function current() {
    if (!document.body.classList.contains("gameboy-mode")) return null;
    const scr = activeScreen();
    if (!scr) { if (focusEl) setFocus(null); lastScr = null; return null; }
    if (scr !== lastScr || !focusEl || !scr.contains(focusEl) || !visible(focusEl)) { lastScr = scr; setFocus(primaryOf(scr)); }
    return scr;
  }
  function moveFocus(scr, d) {
    const list = focusables(scr);
    if (!list.length) return;
    const i = list.indexOf(focusEl);
    setFocus(list[(i + d + list.length) % list.length]);
  }
  function side(scr, d) {
    const arrow = [...scr.querySelectorAll(`.cf-arrow[data-d="${d}"], .pf-arrow[data-d="${d}"]`)].find(visible);
    if (arrow) arrow.click();
    else if (scr.id === "menuOv") document.getElementById(d < 0 ? "btnCharPrev" : "btnCharNext")?.click();
    else if (scr.id === "worldMapOv") {
      const cards = [...scr.querySelectorAll(".ws-card")];
      const i = cards.findIndex((c) => c.classList.contains("selected"));
      const next = cards[(i + d + cards.length) % cards.length];
      if (next) { next.click(); setFocus(next.querySelector(".ws-play")); }
    } else moveFocus(scr, d);
    if (onMenuChar) onMenuChar();
  }
  // A y B: al instante, en el propio toque (no se pierde aunque el móvil vaya lento)
  const onBtn = (which) => (e) => {
    const scr = current();
    if (!scr) return;
    e.preventDefault();
    if (which === "A") { if (focusEl) focusEl.click(); }
    else backOf(scr)?.click();
  };
  document.getElementById("gbA")?.addEventListener("pointerdown", onBtn("A"));
  document.getElementById("gbB")?.addEventListener("pointerdown", onBtn("B"));
  // cruceta: input.js actualiza `touch` en el mismo evento; aquí miramos qué dirección es nueva
  const onPad = () => setTimeout(() => {
    const scr = current();
    const now = { L: !!touch.L, R: !!touch.R, Up: !!touch.Up, Down: !!touch.Down };
    if (scr) {
      if (now.L && !prev.L) side(scr, -1);
      else if (now.R && !prev.R) side(scr, 1);
      else if (now.Up && !prev.Up) moveFocus(scr, -1);
      else if (now.Down && !prev.Down) moveFocus(scr, 1);
    }
    Object.assign(prev, now);
  }, 0);
  const pad = document.querySelector(".gb-dpad");
  ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach((ev) => pad?.addEventListener(ev, onPad));
  // al abrir/cerrar pantallas, el foco va al botón principal
  new MutationObserver(() => current()).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"], childList: true });
}
