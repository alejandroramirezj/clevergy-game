// haptics.js — vibración corta en los golpes (sólo móviles que la soporten; respeta "reducir movimiento")
const ok = typeof navigator !== "undefined" && "vibrate" in navigator &&
  !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
let last = 0;
export function buzz(ms = 18) {
  if (!ok) return;
  const now = performance.now();
  if (now - last < 60) return; // no encadenar vibraciones
  last = now;
  try { navigator.vibrate(ms); } catch (e) {}
}
