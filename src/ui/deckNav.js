// =============================================================================
// deckNav.js — El mando Game Boy (vertical) también maneja los menús
// Con una pantalla de menú abierta, la cruceta mueve el foco entre botones,
// ◀ ▶ cambian de personaje o de mundo, A pulsa el botón marcado y B vuelve atrás.
// Durante la partida no hace nada: el mando sigue siendo el control del juego.
// =============================================================================

import { touch } from "../engine/input.js";

const visible = (el) => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== "hidden";

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
  const prev = { A: false, B: false, L: false, R: false, Up: false, Down: false };
  let focusEl = null, lastScr = null;
  const setFocus = (el) => {
    if (focusEl) focusEl.classList.remove("deck-focus");
    focusEl = el;
    if (el) { el.classList.add("deck-focus"); el.scrollIntoView?.({ block: "nearest", inline: "nearest" }); }
  };
  function step() {
    requestAnimationFrame(step);
    const on = document.body.classList.contains("gameboy-mode");
    const scr = on ? activeScreen() : null;
    const press = {};
    for (const k in prev) { press[k] = !!touch[k] && !prev[k]; prev[k] = !!touch[k]; }
    if (!scr) { if (focusEl) setFocus(null); lastScr = null; return; }
    if (scr !== lastScr || (focusEl && !scr.contains(focusEl))) { lastScr = scr; setFocus(primaryOf(scr)); }
    if (press.L || press.R) {
      const d = press.L ? -1 : 1;
      // selector de personaje del mundo, portada o tarjetas de mundo
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
    if (press.Up || press.Down) moveFocus(scr, press.Up ? -1 : 1);
    if (press.A && focusEl) focusEl.click();
    if (press.B) backOf(scr)?.click();
  }
  function moveFocus(scr, d) {
    const list = focusables(scr);
    if (!list.length) return;
    const i = list.indexOf(focusEl);
    setFocus(list[(i + d + list.length) % list.length]);
  }
  requestAnimationFrame(step);
}
