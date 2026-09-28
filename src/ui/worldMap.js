// =============================================================================
// worldMap.js — Elección de mundo: 3 columnas, cada una ambientada en su mundo
//   1 · Plataformas (pixel art clásico) · 2 · Arena 1v1 (videojuego de lucha)
//   3 · Doodle District (cuaderno dibujado a boli)
// En horizontal se ven las tres a la vez; en vertical son un carrusel deslizable.
// =============================================================================

import { VISIBLE_WORLDS, loadWorldProgress } from "../config/worlds.js";
import { getCharacterAvatar } from "../engine/sprites.js";
import { CHARS } from "../config/characters.js";
import { GameState } from "../game/state.js";
import { sfx } from "../engine/audio.js";

// los sprites pixel art llegan como data: URL y se escalan sin suavizar
const px = (src) => (src && src.startsWith("data:") ? " px" : "");

// ── Ilustración de cada mundo ────────────────────────────────────────────────
function artMario(hero) {
  return `
    <div class="ws-mario-sky">
      <svg class="ws-mario-scene" viewBox="0 0 160 100" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges">
        <g fill="#fff"><rect x="14" y="14" width="20" height="6"/><rect x="18" y="10" width="12" height="4"/><rect x="104" y="22" width="24" height="6"/><rect x="110" y="18" width="12" height="4"/></g>
        <g fill="#2f9e44"><rect x="0" y="66" width="44" height="14"/><rect x="8" y="58" width="28" height="8"/><rect x="16" y="52" width="12" height="6"/></g>
        <g fill="#00a800"><rect x="124" y="56" width="24" height="24"/><rect x="120" y="50" width="32" height="8"/></g>
        <g fill="#005c00"><rect x="126" y="58" width="4" height="22"/><rect x="122" y="52" width="4" height="6"/></g>
        <g class="ws-qblock"><rect x="70" y="30" width="14" height="14" fill="#fca044"/><rect x="70" y="30" width="14" height="2" fill="#fff3b0"/><rect x="75" y="33" width="4" height="2" fill="#7a3a00"/><rect x="78" y="35" width="2" height="3" fill="#7a3a00"/><rect x="76" y="38" width="2" height="2" fill="#7a3a00"/><rect x="76" y="41" width="2" height="1" fill="#7a3a00"/></g>
        <g fill="#c84c0c"><rect x="56" y="30" width="14" height="14"/><rect x="84" y="30" width="14" height="14"/></g>
        <g fill="#7a2a00"><rect x="56" y="36" width="14" height="1"/><rect x="62" y="30" width="1" height="6"/><rect x="84" y="36" width="14" height="1"/><rect x="91" y="37" width="1" height="7"/></g>
        <g class="ws-coins" fill="#ffd23f"><rect x="102" y="40" width="4" height="7"/><rect x="112" y="36" width="4" height="7"/></g>
      </svg>
      <div class="ws-mario-ground"></div>
      ${hero ? `<img class="ws-hero ws-hero-mario${px(hero)}" src="${hero}" alt="">` : ""}
    </div>`;
}

function artArena(hero, rival) {
  return `
    <div class="ws-arena-bg">
      <div class="ws-arena-side ws-arena-l"></div>
      <div class="ws-arena-side ws-arena-r"></div>
      <div class="ws-arena-lines"></div>
      ${hero ? `<img class="ws-hero ws-hero-p1${px(hero)}" src="${hero}" alt="">` : ""}
      ${rival ? `<img class="ws-hero ws-hero-p2${px(rival)}" src="${rival}" alt="">` : ""}
      <svg class="ws-bolt" viewBox="0 0 40 80"><path d="M24 0 L6 44 L18 44 L12 80 L34 30 L21 30 Z"/></svg>
      <div class="ws-vs">VS</div>
      <div class="ws-arena-bars"><i></i><i></i></div>
    </div>`;
}

function artDoodle(hero) {
  return `
    <div class="ws-doodle-paper">
      <svg class="ws-doodle-ink" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g stroke="#d6243a" stroke-width="2.2">
          <path d="M104 18 L140 20 L138 44 L102 42 Z"/><path d="M104 19 L121 33 L139 21"/>
          <path d="M112 30 l3 -2 M128 29 l-3 -2"/><circle cx="114" cy="32" r="1.2" fill="#d6243a"/><circle cx="127" cy="32" r="1.2" fill="#d6243a"/>
        </g>
        <g stroke="#1f38b8" stroke-width="2"><path d="M96 16 l-6 -4 M146 14 l6 -5 M100 48 l-5 4"/></g>
        <g stroke="#52307c" stroke-width="2"><path d="M18 20 L44 20 L44 44 L18 44 Z"/><path d="M18 27 L44 27"/><path d="M24 16 L24 23 M38 16 L38 23"/><path d="M24 34 h4 M32 34 h4 M24 39 h4"/></g>
        <g stroke="#ec7f19" stroke-width="2"><circle cx="146" cy="78" r="9"/><path d="M146 72 L146 78 L150 80"/></g>
        <g stroke="#1f38b8" stroke-width="1.8"><path d="M10 84 c10 -6 18 6 28 0 s18 6 28 0"/></g>
        <text x="100" y="58" font-family="Caveat, cursive" font-size="11" fill="#d6243a" stroke="none">9.999 sin leer</text>
      </svg>
      ${hero ? `<img class="ws-hero ws-hero-doodle${px(hero)}" src="${hero}" alt="">` : ""}
      <svg class="ws-pen" viewBox="0 0 120 20"><path d="M4 10 L92 4 L112 10 L92 16 Z" fill="#1f38b8" stroke="#272a36" stroke-width="2"/><path d="M92 4 L92 16" stroke="#272a36" stroke-width="2"/><path d="M104 8 L112 10 L104 12 Z" fill="#272a36"/><rect x="14" y="6.6" width="22" height="2.4" fill="#fff" opacity=".6"/></svg>
    </div>`;
}

export function initWorldMap({ onSelectWorld }) {
  const mapOv = document.getElementById("worldMapOv");
  const grid = document.getElementById("wsGrid");
  const dots = document.getElementById("wsDots");
  const btnCloseMap = document.getElementById("btnCloseMap");

  let selectedId = null;

  function play(id) {
    hideWorldMap();
    try { sfx(880, 0.12, "triangle"); } catch (e) {}
    if (onSelectWorld) onSelectWorld(id);
  }

  function select(id, scroll) {
    selectedId = id;
    grid.querySelectorAll(".ws-card").forEach((c) => c.classList.toggle("selected", Number(c.dataset.id) === id));
    dots.querySelectorAll("i").forEach((d) => d.classList.toggle("on", Number(d.dataset.id) === id));
    if (scroll) {
      const card = grid.querySelector(`.ws-card[data-id="${id}"]`);
      if (card && grid.scrollWidth > grid.clientWidth + 4) {
        grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
      }
    }
  }

  function renderMap() {
    if (!grid) return;
    const progress = loadWorldProgress();
    const done = VISIBLE_WORLDS.filter((w) => progress.completed.includes(w.id)).length;
    const progTxt = document.getElementById("mapProgressTxt");
    if (progTxt) progTxt.textContent = `${done}/${VISIBLE_WORLDS.length} MUNDOS`;

    const curChar = CHARS[GameState.charIdx] || CHARS[0];
    const hero = getCharacterAvatar(curChar.id);
    const rivalChar = CHARS[(GameState.charIdx + 5) % CHARS.length];
    const rival = getCharacterAvatar(rivalChar.id);
    const heroImg = document.getElementById("mapHeroImg");
    const heroName = document.getElementById("mapHeroName");
    if (heroImg && hero) heroImg.src = hero;
    if (heroName) heroName.textContent = curChar.name;

    grid.innerHTML = VISIBLE_WORLDS.map((w) => {
      const completed = progress.completed.includes(w.id);
      const score = (progress.highScores && progress.highScores[w.id]) || 0;
      const rank = (progress.ranks && progress.ranks[w.id]) || "";
      const art = w.theme === "mario" ? artMario(hero) : w.theme === "arena" ? artArena(hero, rival) : artDoodle(hero);
      const record = completed
        ? `<span class="ws-done">★ Dominado</span>${score ? ` · Récord <b>${score.toLocaleString("es-ES")}</b>` : ""}${rank ? ` · Rango <b>${rank}</b>` : ""}`
        : `<span class="ws-pending">○ Por dominar</span>`;
      return `
        <article class="ws-card ws-${w.theme}" data-id="${w.id}" tabindex="0">
          <div class="ws-art">${art}<div class="ws-num">${w.num}</div></div>
          <div class="ws-body">
            <div class="ws-kicker">MUNDO ${w.num} · ${w.genre}</div>
            <h2 class="ws-title">${w.name}</h2>
            <p class="ws-desc">${w.blurb || w.desc}</p>
            <div class="ws-chips">${(w.chips || []).map((c) => `<span>${c}</span>`).join("")}</div>
            <div class="ws-record">${record}</div>
            <button class="ws-play" data-id="${w.id}">▶ JUGAR</button>
          </div>
        </article>`;
    }).join("");

    dots.innerHTML = VISIBLE_WORLDS.map((w) => `<i data-id="${w.id}"></i>`).join("");

    grid.querySelectorAll(".ws-card").forEach((card) => {
      const id = Number(card.dataset.id);
      card.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse" && selectedId !== id) { select(id); try { sfx(660, 0.05, "sine"); } catch (err) {} } });
      card.addEventListener("click", (e) => {
        if (e.target.closest(".ws-play")) return;
        if (selectedId === id) play(id);
        else { select(id, true); try { sfx(660, 0.06, "sine"); } catch (err) {} }
      });
      card.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.stopPropagation(); play(id); } });
    });
    grid.querySelectorAll(".ws-play").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); play(Number(b.dataset.id)); }));
    dots.querySelectorAll("i").forEach((d) => d.addEventListener("click", () => select(Number(d.dataset.id), true)));

    const def = VISIBLE_WORLDS.find((w) => w.id === (selectedId || GameState.currentWorld)) || VISIBLE_WORLDS[0];
    select(def.id, false);
  }

  // en el carrusel vertical, la tarjeta centrada queda seleccionada
  let scrollT = 0;
  grid?.addEventListener("scroll", () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(() => {
      if (grid.scrollWidth <= grid.clientWidth + 4) return;
      const mid = grid.scrollLeft + grid.clientWidth / 2;
      let best = null, bd = Infinity;
      grid.querySelectorAll(".ws-card").forEach((c) => {
        const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
        if (d < bd) { bd = d; best = c; }
      });
      if (best) select(Number(best.dataset.id), false);
    }, 90);
  });

  btnCloseMap?.addEventListener("click", () => {
    hideWorldMap();
    document.getElementById("menuOv")?.classList.remove("hidden");
  });

  window.addEventListener("resize", () => { if (GameState.worldMapOpen) renderMap(); });

  function showWorldMap() {
    renderMap();
    mapOv?.classList.remove("hidden");
    GameState.worldMapOpen = true;
    requestAnimationFrame(() => select(selectedId, true));
  }

  function hideWorldMap() {
    mapOv?.classList.add("hidden");
    GameState.worldMapOpen = false;
  }

  return { showWorldMap, hideWorldMap, renderMap };
}
