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

const cv = document.getElementById("cv");
const cx = cv.getContext("2d");

function fitCanvas() {
  // Marco común de los mundos 3D: en vertical durante la partida activa, pantalla + deck Game Boy;
  // en menús, elección de mundo y lobbies: pantalla completa táctil sin mando.
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const iw = window.innerWidth, ih = window.innerHeight;
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

// ── los mundos: id → módulo y cómo se arranca ──
const WORLD_LOADERS = {
  1: { name: "La Oficina", load: () => import("./doodle/platform/doodlePlatform.js"), start: (m, o) => m.startDoodlePlatform({ ...o, charId: o.char.id, getChar: o.getChar, onSwitchChar: o.onSwitchChar }) },
  6: { name: "Coworking Fight", load: () => import("./doodle/fight/doodleFight.js"), start: (m, o) => m.startDoodleFight({ ...o, charId: o.char.id }) },
  7: { name: "BoliBic Tag", load: () => import("./doodle/doodleWorld.js"), start: (m, o) => m.startDoodleWorld({ ...o, char: o.char, getChar: o.getChar, onSwitchChar: o.onSwitchChar }) },
  8: { name: "Pantano de San Juan", load: () => import("./doodle/race/doodleRace.js"), start: (m, o) => m.startDoodleRace({ ...o, charId: o.char.id }) },
  9: { name: "La Integración", load: () => import("./doodle/fall/doodleFall.js"), start: (m, o) => m.startDoodleFall({ ...o, charId: o.char.id }) }
};

let doodle = null;
function hideMenus() {
  for (const id of ["menuOv", "worldMapOv", "bootOv", "lbOv", "ctrlOv", "compendiumOv"]) document.getElementById(id)?.classList.add("hidden");
}
async function startGame(worldId) {
  const W = WORLD_LOADERS[worldId];
  if (!W) return;
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
  const back = () => {
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
  };
  try {
    const mod = await W.load();
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
    console.error(`No se pudo cargar ${W.name}`, err);
    back();
  }
}

function showLoading(on) {
  let el = document.getElementById("worldLoading");
  if (on && !el) {
    el = document.createElement("div");
    el.id = "worldLoading";
    el.className = "world-loading";
    el.innerHTML = `<div class="wl-card"><div class="wl-pen">✏️</div><b>Cargando mundo…</b><small>afilando el boli</small></div>`;
    (document.getElementById("wrap") || document.body).appendChild(el);
  }
  if (!on && el) el.remove();
}
// cuando el mundo 3D ya ha montado su pantalla, se quita la de carga
new MutationObserver(() => { if (document.getElementById("doodleRoot")) showLoading(false); }).observe(document.getElementById("wrap") || document.body, { childList: true });

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
