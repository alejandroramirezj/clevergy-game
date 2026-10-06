// =============================================================================
// main.js — Arranque del juego: portada, elección de mundo y los 4 mundos 3D
//   1 · La Oficina (plataformas)   2 · Coworking Fight (pelea estilo Smash)
//   3 · BoliBic Tag (laser tag)    4 · Pantano de San Juan (carreras)
// Cada mundo se carga bajo demanda (import dinámico) y corre su propio bucle.
// =============================================================================

import { CHARS } from "./config/characters.js";
import { stopMusic } from "./engine/audio.js";
import { initSprites } from "./engine/sprites.js";
import { initInput } from "./engine/input.js";
import { GameState, switchChar, switchToChar, setInPlay } from "./game/state.js";
import { initOverlays } from "./ui/overlays.js";
import { initWorldMap } from "./ui/worldMap.js";
import { saveWorldProgress } from "./config/worlds.js";
import { submitScore } from "./game/leaderboard.js";
import { consumeCharInvite } from "./game/charRoute.js";
import { initAuth } from "./game/auth.js";
import { initDeckNav } from "./ui/deckNav.js";
import { initAppUpdate, isChunkError, reloadForUpdate, atMenu } from "./engine/appUpdate.js";

const cv = document.getElementById("cv");
const cx = cv.getContext("2d");

function fitCanvas() {
  // Marco común de los mundos 3D: en vertical durante la partida activa, pantalla + deck Game Boy;
  // en menús, elección de mundo y lobbies: pantalla completa táctil sin mando.
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const iw = window.innerWidth, ih = window.innerHeight;
  // altura real visible: en la app instalada de iOS var(--app-h, 100dvh) sale mal al arrancar
  // (y tras volver de segundo plano) hasta que hay un resize; el CSS usa --app-h
  document.documentElement.style.setProperty("--app-h", `${ih}px`);
  const isPortrait = ih > iw;
  document.body.classList.toggle("is-portrait", isPortrait);
  const useDeck = isPortrait && GameState.inPlay;

  if (useDeck) {
    document.body.classList.add("gameboy-mode");
    document.getElementById("gameboyDeck")?.classList.remove("hidden");

    // Game Boy screen takes ~58% of screen height (more screen space!)
    const screenH = Math.round(ih * 0.58);
    const screenW = iw;

    const H = 340;
    const W = Math.round(H * (screenW / screenH));

    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.position = "relative";
    cv.style.left = "auto";
    cv.style.top = "auto";
    cv.style.width = screenW + "px";
    cv.style.height = screenH + "px";

    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.imageSmoothingEnabled = false;

    GameState.W = W;
    GameState.H = H;
    GameState.DPR = dpr;
    GameState.SAFEB = 0;
  } else {
    document.body.classList.remove("gameboy-mode");
    document.getElementById("gameboyDeck")?.classList.add("hidden");
    const isHorizontalResponsive = window.matchMedia("(pointer:coarse)").matches || 
      ('ontouchstart' in window) || 
      (navigator.maxTouchPoints > 0) || 
      (ih <= 680 && iw <= 1100);
    if (isHorizontalResponsive && !isPortrait && GameState.inPlay) {
      document.getElementById("touch")?.classList.remove("hidden");
    } else {
      document.getElementById("touch")?.classList.add("hidden");
    }
    const H = 540;
    let W = Math.round(H * (iw / ih));
    W = Math.max(700, Math.min(1600, W));

    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.position = "fixed";
    cv.style.left = "0";
    cv.style.top = "0";
    cv.style.width = iw + "px";
    cv.style.height = ih + "px";

    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.imageSmoothingEnabled = false;

    GameState.W = W;
    GameState.H = H;
    GameState.DPR = dpr;
    GameState.SAFEB = 0;
  }
}

window.addEventListener("resize", fitCanvas);
window.addEventListener("orientationchange", () => setTimeout(fitCanvas, 200));
window.addEventListener("in_play_change", () => setTimeout(fitCanvas, 0));
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", fitCanvas);
}
// En PWAs instaladas, el sistema operativo oculta barras o ajusta el viewport con un ligero retardo
setTimeout(fitCanvas, 100);
setTimeout(fitCanvas, 400);
setTimeout(fitCanvas, 1200);
// al volver de segundo plano (iOS restaura la app de memoria) se vuelve a medir
window.addEventListener("pageshow", () => { fitCanvas(); setTimeout(fitCanvas, 300); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") setTimeout(fitCanvas, 150); });

// ── los mundos: id → módulo y cómo se arranca ──
const WORLD_LOADERS = {
  1: { name: "La Oficina", load: () => import("./doodle/platform/doodlePlatform.js"), start: (m, o) => m.startDoodlePlatform({ ...o, charId: o.char.id, getChar: o.getChar, onSwitchChar: o.onSwitchChar }) },
  6: { name: "Retro Fight", load: () => import("./doodle/fight/doodleFight.js"), start: (m, o) => m.startDoodleFight({ ...o, charId: o.char.id }) },
  7: { name: "BoliBic Tag", load: () => import("./doodle/doodleWorld.js"), start: (m, o) => m.startDoodleWorld({ ...o, char: o.char, getChar: o.getChar, onSwitchChar: o.onSwitchChar }) },
  8: { name: "Pantano de San Juan", load: () => import("./doodle/race/doodleRace.js"), start: (m, o) => m.startDoodleRace({ ...o, charId: o.char.id }) },
  9: { name: "La Integración", load: () => import("./doodle/fall/doodleFall.js"), start: (m, o) => m.startDoodleFall({ ...o, charId: o.char.id }) }
};

let doodle = null;
let _startGameLock = false; // guard: evita doble-arranque simultáneo
function hideMenus() {
  for (const id of ["menuOv", "worldMapOv", "bootOv", "lbOv", "ctrlOv", "compendiumOv"]) document.getElementById(id)?.classList.add("hidden");
}
async function startGame(worldId) {
  const W = WORLD_LOADERS[worldId];
  if (!W) return;
  // Guard: si ya hay una carga en curso, no lanzar otra
  if (_startGameLock) { console.warn("startGame: carga en curso, ignorando"); return; }
  _startGameLock = true;

  hideMenus();
  GameState.worldMapOpen = false;
  GameState.currentWorld = worldId;
  GameState.gameMode = "doodle";
  document.body.classList.add("doodle-mode");
  stopMusic();
  fitCanvas();
  showLoading(true);
  // sólo en La Oficina se cambia de personaje dentro del mundo; en los demás vas con el tuyo
  document.body.classList.toggle("char-locked", worldId !== 1);
  document.body.classList.toggle("world-office", worldId === 1);
  const gbTB = document.getElementById("gbTouchBarContainer");
  if (gbTB) gbTB.style.display = (worldId === 1) ? "" : "none";
  setInPlay(false); // todos los mundos empiezan en su pantalla de lobby o presentación a pantalla completa táctil

  let backCalled = false; // idempotente: back() sólo actúa una vez
  const back = () => {
    if (backCalled) return;
    backCalled = true;
    _startGameLock = false;
    setInPlay(false);
    document.body.classList.remove("char-locked", "world-office");
    const tb = document.getElementById("gbTouchBarContainer");
    if (tb) tb.style.display = "";
    doodle = null;
    showLoading(false);
    document.body.classList.remove("doodle-mode");
    GameState.gameMode = "menu";
    fitCanvas();
    worldMap.showWorldMap();
    atMenu(); // si salió una versión nueva durante la partida, se actualiza ahora
  };

  let timer = 0;
  try {
    // Timeout de 20 s: si el módulo no carga (red lenta)
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Timeout cargando el mundo (20 s)")), 20000);
    });
    const mod = await Promise.race([W.load(), timeout]);
    clearTimeout(timer);
    showLoading(true, "montando el escenario…");
    _startGameLock = false; // módulo cargado: liberar el lock, el mundo tiene su propio ciclo
    doodle = W.start(mod, {
      char: CHARS[GameState.charIdx] || CHARS[0],
      getChar: () => CHARS[GameState.charIdx],
      onSwitchChar: () => { switchChar(1); updateSpotlight(); },
      onPickChar: (id) => { const i = CHARS.findIndex((c) => c.id === id); if (i >= 0) GameState.charIdx = i; },
      onVictory: (score, rank) => recordWorld(worldId, score, rank),
      onScore: (score, stats, rank) => reportScore(worldId, score, stats, rank),
      onExit: back
    });
  } catch (err) {
    clearTimeout(timer);
    console.error(`No se pudo cargar ${W.name}`, err);
    // si el mundo llegó a montar su capa antes de fallar, que no se quede debajo del mapa
    document.querySelectorAll("#doodleRoot").forEach((n) => n.remove());
    // trozo de una versión anterior que ya no existe: recargar con la nueva
    if (navigator.onLine && isChunkError(err) && reloadForUpdate()) return;
    back();
    // reintentar = recargar y abrir este mundo: el navegador recuerda el trozo que
    // falló y un segundo import() en la misma página volvería a fallar
    showLoadError(W.name, () => {
      try { sessionStorage.setItem("cg-open-world", String(worldId)); } catch (e) {}
      location.reload();
    });
  }
}

// el móvil ha tirado el contexto gráfico de un mundo (sin memoria, mucho rato en segundo
// plano…): three.js no lo recupera solo, así que se ofrece recargar y volver a ese mundo
window.addEventListener("doodle:contextlost", (e) => {
  const c = e.detail && e.detail.canvas;
  if (!c || !c.isConnected || !c.closest("#doodleRoot, .ov-root") || document.getElementById("worldError")) return;
  const id = GameState.gameMode === "doodle" ? GameState.currentWorld : null;
  const el = document.createElement("div");
  el.id = "worldError";
  el.className = "world-loading world-error";
  el.innerHTML = `<div class="wl-card"><div class="wl-pen">🖍️</div><b>Se ha borrado el dibujo</b>
    <small>El móvil ha liberado la memoria gráfica. Recarga para seguir.</small>
    <div class="wl-btns"><button class="dd-btn wl-retry">Recargar</button></div></div>`;
  document.body.appendChild(el);
  el.querySelector(".wl-retry").addEventListener("click", () => {
    try { if (id) sessionStorage.setItem("cg-open-world", String(id)); } catch (err) {}
    location.reload();
  });
});

// aviso visible cuando un mundo no abre (en vez de volver al mapa sin decir nada)
function showLoadError(name, retry) {
  document.getElementById("worldError")?.remove();
  const el = document.createElement("div");
  el.id = "worldError";
  el.className = "world-loading world-error";
  el.innerHTML = `<div class="wl-card"><div class="wl-pen">😵</div><b>No se ha podido abrir ${name}</b>
    <small>${navigator.onLine ? "Puede que la conexión vaya lenta." : "Parece que no hay conexión."}</small>
    <div class="wl-btns"><button class="dd-btn wl-retry">Reintentar</button><button class="dd-btn dd-ghost wl-close">Volver</button></div></div>`;
  document.body.appendChild(el);
  el.querySelector(".wl-retry").addEventListener("click", () => { el.remove(); retry(); });
  el.querySelector(".wl-close").addEventListener("click", () => el.remove());
}

let slowTimer = 0;
// pantalla de carga: dice en qué paso va y avisa si la red va lenta (para que no parezca colgado)
function showLoading(on, step) {
  let el = document.getElementById("worldLoading");
  if (on && !el) {
    el = document.createElement("div");
    el.id = "worldLoading";
    el.className = "world-loading";
    el.innerHTML = `<div class="wl-card"><div class="wl-pen">✏️</div><b>Cargando mundo…</b><small>afilando el boli</small><div class="wl-bar"><i></i></div></div>`;
    (document.getElementById("wrap") || document.body).appendChild(el);
    clearTimeout(slowTimer);
    slowTimer = setTimeout(() => {
      const s = document.querySelector("#worldLoading small");
      if (s && !step) s.textContent = navigator.onLine ? "la conexión va lenta, ya casi…" : "parece que no hay conexión…";
    }, 6000);
  }
  if (on && el && step) {
    el.querySelector("small").textContent = step;
    el.classList.add("wl-step2");
  }
  if (!on) {
    clearTimeout(slowTimer);
    if (el) el.remove();
  }
}
// cuando el mundo 3D ya ha montado su pantalla, se quita la de carga.
// Usamos un observer que se desconecta en cuanto cumple su misión para no
// seguir ejecutándose durante toda la partida con cada mutación de DOM.
const _loadingObserver = new MutationObserver(() => {
  if (document.getElementById("doodleRoot")) {
    showLoading(false);
    _loadingObserver.disconnect();
    // Re-arm para la próxima carga de mundo
    _armLoadingObserver();
  }
});
function _armLoadingObserver() {
  const target = document.getElementById("wrap") || document.body;
  _loadingObserver.observe(target, { childList: true });
}
_armLoadingObserver();

// al ganar: guarda el progreso local (retos)
function recordWorld(worldId, score, rank) {
  saveWorldProgress(worldId, score, rank);
}
// ranking: cuenta en cualquier momento (al acabar, al perder, en los puntos de control),
// sólo con sesión de Google y sólo si mejora lo que ya se ha enviado en esta visita
const sentBest = {};
function reportScore(worldId, score, stats, rank) {
  if (!window.__cgAuth || !window.__cgAuth.user || score <= (sentBest[worldId] || 0)) return;
  sentBest[worldId] = score;
  // en el ranking sale siempre TU personaje (el de la cuenta); con el que jugaste va en el detalle
  const played = CHARS[GameState.charIdx] || CHARS[0];
  const mine = CHARS.find((x) => x.id === window.__cgAuth.user.character) || played;
  submitScore({ name: GameState.playerName, score: Math.round(score), character: mine.id, char_name: mine.name, time_seconds: (stats && stats.time) || 0, rank: rank || "", deaths: 0, world: worldId, stats: { ...(stats || {}), used: played.id } });
}

// ¿Viene de un enlace/QR de personaje (/jose-luis)? Empieza con ese personaje
{
  const invited = consumeCharInvite();
  if (invited >= 0) GameState.charIdx = invited;
}

initSprites();
fitCanvas();
initAppUpdate({ inMenu: () => GameState.gameMode !== "doodle" });
// tras "Reintentar" (recarga), se abre directamente el mundo que se quería
{
  let id = null;
  try { id = sessionStorage.getItem("cg-open-world"); sessionStorage.removeItem("cg-open-world"); } catch (e) {}
  if (id && WORLD_LOADERS[id]) setTimeout(() => startGame(Number(id)), 0);
}

const worldMap = initWorldMap({ onSelectWorld: (worldId) => startGame(worldId) });
const { updateSpotlight } = initOverlays({
  onStartGame: () => worldMap.showWorldMap(), onOpenMap: () => worldMap.showWorldMap(),
  onPlayWorld: (id) => { document.getElementById("menuOv")?.classList.add("hidden"); startGame(id); },
  // Historia y personajes → Mundos → Explorar: el escenario con cámara libre
  onExploreWorld: async (id, back) => {
    stopMusic();
    const menu = document.getElementById("menuOv");
    const menuWasOpen = menu && !menu.classList.contains("hidden");
    if (menu) menu.classList.add("hidden");
    const done = () => { fitCanvas(); if (menuWasOpen) menu.classList.remove("hidden"); back(); };
    try {
      const { openWorldViewer } = await import("./doodle/worldViewer.js");
      await openWorldViewer(id, { onClose: done });
    } catch (err) { console.error("No se pudo abrir el observador", err); done(); }
  }
});
// en vertical, el mando Game Boy también maneja los menús (A pulsa, B vuelve)
initDeckNav();
// cuenta de Google (opcional): guarda progreso y ranking y fija "tu" personaje
initAuth({ onCharChosen: (idx) => { switchToChar(idx); updateSpotlight(); worldMap.renderMap(); } });

const charLocked = () => document.body.classList.contains("char-locked");
initInput({
  onSwitchChar: (dir) => { if (charLocked()) return; switchChar(dir); updateSpotlight(); worldMap.renderMap(); },
  onSwitchSlot: (slotIdx) => { if (charLocked()) return; switchToChar(slotIdx); updateSpotlight(); worldMap.renderMap(); },
  onOpenMap: () => {
    if (doodle) return doodle.exit();
    worldMap.showWorldMap();
  }
});
