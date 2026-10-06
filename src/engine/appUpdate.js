// =============================================================================
// appUpdate.js — Que una versión nueva nunca deje la app "pillada"
// Cada mundo es un trozo de código con hash en el nombre. Si publicamos mientras
// la app instalada sigue abierta en segundo plano (iOS la guarda en memoria), al
// tocar un mundo pediría el trozo de la versión anterior, que ya no existe.
// Aquí: detectar ese fallo y recargar (una sola vez), y al volver a la app
// comprobar si hay versión nueva para recargar antes de que pase.
// =============================================================================

const KEY = "cg-update-reload";
let pending = false;

/** ¿El error es de un trozo de código que no se ha podido descargar? */
export function isChunkError(err) {
  const m = String((err && (err.message || err)) || "");
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported|module script|Failed to fetch|MIME type/i.test(m);
}

function notice(text) {
  let el = document.getElementById("updateNotice");
  if (!el) {
    el = document.createElement("div");
    el.id = "updateNotice";
    el.className = "world-loading";
    document.body.appendChild(el);
  }
  el.innerHTML = `<div class="wl-card"><div class="wl-pen">✏️</div><b>${text}</b><small>un segundo…</small></div>`;
}

/** Recarga la app por versión nueva. Devuelve false si ya se recargó hace poco (evita bucles). */
export function reloadForUpdate() {
  let last = 0;
  try { last = Number(sessionStorage.getItem(KEY)) || 0; } catch (e) {}
  if (Date.now() - last < 30000) return false;
  try { sessionStorage.setItem(KEY, String(Date.now())); } catch (e) {}
  notice("Hay una versión nueva, actualizando…");
  setTimeout(() => location.reload(), 600);
  return true;
}

// el script principal publicado (en desarrollo no hay: no se comprueba nada)
const currentEntry = () => {
  const s = document.querySelector('script[type="module"][src*="/assets/index-"]');
  return s ? new URL(s.src, location.href).pathname : null;
};

async function hasNewVersion() {
  const mine = currentEntry();
  if (!mine || !navigator.onLine) return false;
  try {
    const res = await fetch("/", { cache: "no-store" });
    if (!res.ok) return false;
    const m = (await res.text()).match(/\/assets\/index-[\w-]+\.js/);
    return !!m && m[0] !== mine;
  } catch (e) {
    return false;
  }
}

/**
 * `inMenu()` dice si se puede recargar sin cortar una partida. Si hay versión
 * nueva en mitad de una partida, se recarga al volver al menú (`atMenu()`).
 */
export function initAppUpdate({ inMenu }) {
  window.addEventListener("vite:preloadError", (e) => {
    if (reloadForUpdate()) e.preventDefault();
  });
  let checking = false;
  const check = async () => {
    if (checking) return;
    checking = true;
    try {
      if (await hasNewVersion()) {
        if (inMenu()) reloadForUpdate();
        else pending = true;
      }
    } finally {
      checking = false;
    }
  };
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") check(); });
  window.addEventListener("pageshow", (e) => { if (e.persisted) check(); });
  window.addEventListener("focus", check);
  // la app instalada puede pasar horas abierta: también de vez en cuando
  setInterval(() => { if (document.visibilityState === "visible") check(); }, 10 * 60 * 1000);
  // ya hemos arrancado bien: se puede volver a recargar si hiciera falta más adelante
  setTimeout(() => { try { sessionStorage.removeItem(KEY); } catch (e) {} }, 60000);
}

/** Llamar al volver al menú: si quedó una versión nueva pendiente, se recarga ahora. */
export function atMenu() {
  if (pending) { pending = false; reloadForUpdate(); }
}
