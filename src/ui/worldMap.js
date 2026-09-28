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

// ── Ilustración de cada mundo: todas a boli sobre el mismo cuaderno ─────────
const PAPER_BG = `<div class="ws-ink-paper"></div>`;
const heroImg = (hero, cls) => (hero ? `<img class="ws-hero ws-ink-hero ${cls}${px(hero)}" src="${hero}" alt="">` : "");

function artMario(hero) {
  return `${PAPER_BG}
    <svg class="ws-ink-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g class="ws-boil"><path d="M4 84 L156 84" stroke="#272a36" stroke-width="2.4"/><path d="M4 84 L4 98 M156 84 L156 98" stroke="#272a36" stroke-width="2"/>
      <g stroke="#1f38b8" stroke-width="1.2" opacity=".55">${[10, 22, 34, 46, 58, 70, 82, 94, 106, 118, 130, 142].map((x) => `<path d="M${x} 86 l8 10"/>`).join("")}</g></g>
      <g class="ws-boil2" stroke="#d6243a" stroke-width="2"><rect x="62" y="30" width="12" height="12"/><rect x="86" y="30" width="12" height="12"/><path d="M62 36 h12 M68 30 v6 M86 36 h12 M92 36 v6"/></g>
      <g class="ws-qblock2" stroke="#ec7f19" stroke-width="2.2"><rect x="74" y="30" width="12" height="12" fill="#fde8c8"/><path d="M77.5 34 q2.5 -3 5 0 q0 2 -2.5 3 v1.5 M80 40.5 v.5" stroke="#272a36"/></g>
      <g stroke="#1a8c52" stroke-width="2"><path d="M18 64 h26 v4 h-26 z"/><path d="M114 56 h28 v4 h-28 z"/></g>
      <g stroke="#ec7f19" stroke-width="1.8">${[[24, 56], [32, 52], [40, 56], [120, 48], [128, 44], [136, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}</g>
      <g stroke="#272a36" stroke-width="2"><path d="M138 84 v-38"/><path d="M138 46 l-14 5 l14 5" stroke="#d6243a" fill="#f7c9cf"/></g>
      <g stroke="#52307c" stroke-width="1.8"><rect x="96" y="70" width="11" height="12" rx="2"/><circle cx="99.5" cy="75" r="1" fill="#52307c"/><circle cx="103.5" cy="75" r="1" fill="#52307c"/></g>
      <path d="M36 80 q10 -26 22 -6" stroke="#1f38b8" stroke-width="1.4" stroke-dasharray="3 3"/>
    </svg>
    ${heroImg(hero, "ws-ink-hero-jump")}`;
}

function artArena(hero, rival) {
  return `${PAPER_BG}
    <svg class="ws-ink-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g class="ws-boil"><path d="M8 88 L152 88" stroke="#272a36" stroke-width="2.4"/>
      <g stroke="#d6243a" stroke-width="2"><rect x="10" y="10" width="54" height="7" rx="2"/><rect x="96" y="10" width="54" height="7" rx="2"/></g>
      <g stroke="#1a8c52" stroke-width="1.3" opacity=".8">${[14, 20, 26, 32, 38, 44, 50, 56].map((x) => `<path d="M${x} 11 l3 5"/>`).join("")}${[100, 106, 112, 118, 124, 130, 136].map((x) => `<path d="M${x} 11 l3 5"/>`).join("")}</g>
      <circle cx="80" cy="14" r="8" stroke="#272a36" stroke-width="2" fill="#f6f3e6"/></g>
      <text x="80" y="17.5" text-anchor="middle" font-family="Caveat, cursive" font-size="10" fill="#1f38b8">60</text>
      <path class="ws-boil2" d="M86 28 L70 56 L80 56 L72 82 L94 48 L83 48 Z" stroke="#ec7f19" stroke-width="2.2" fill="#fde8c8"/>
      <g stroke="#1f38b8" stroke-width="1.4" opacity=".6"><path d="M20 40 l18 0 M16 48 l22 0 M22 56 l14 0 M122 40 l18 0 M122 48 l22 0 M124 56 l14 0"/></g>
    </svg>
    <div class="ws-ink-vs">VS</div>
    ${heroImg(hero, "ws-ink-p1")}${heroImg(rival, "ws-ink-p2")}`;
}

function artDoodle(hero) {
  return `${PAPER_BG}
    <svg class="ws-ink-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g class="ws-boil" stroke="#d6243a" stroke-width="2.2">
        <path d="M104 18 L140 20 L138 44 L102 42 Z"/><path d="M104 19 L121 33 L139 21"/>
        <path d="M112 30 l3 -2 M128 29 l-3 -2"/><circle cx="114" cy="32" r="1.2" fill="#d6243a"/><circle cx="127" cy="32" r="1.2" fill="#d6243a"/>
      </g>
      <g class="ws-boil2" stroke="#52307c" stroke-width="2"><path d="M18 20 L44 20 L44 44 L18 44 Z"/><path d="M18 27 L44 27"/><path d="M24 16 L24 23 M38 16 L38 23"/><path d="M24 34 h4 M32 34 h4 M24 39 h4"/></g>
      <g stroke="#ec7f19" stroke-width="2"><circle cx="146" cy="78" r="9"/><path d="M146 72 L146 78 L150 80"/></g>
      <g stroke="#1f38b8" stroke-width="1.8"><path d="M10 88 c10 -6 18 6 28 0 s18 6 28 0 s18 6 28 0"/></g>
      <g stroke="#1f38b8" stroke-width="2.2"><path d="M60 70 L118 64"/><path d="M118 64 l8 -1"/><circle cx="122" cy="63.5" r="2.6" fill="#ec7f19"/></g>
      <text x="100" y="58" font-family="Caveat, cursive" font-size="11" fill="#d6243a">9.999 sin leer</text>
    </svg>
    ${heroImg(hero, "ws-ink-hero-doodle")}`;
}

function artKart(hero) {
  return `${PAPER_BG}
    <svg class="ws-ink-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g class="ws-boil" stroke="#1a8c52" stroke-width="2"><path d="M0 50 L20 34 L36 44 L56 30 L78 44 L96 32 L112 42"/>
        ${[10, 24, 44, 62, 84, 100].map((x, i) => `<path d="M${x} ${46 - (i % 2) * 5} l4 -10 l4 10 z"/>`).join("")}</g>
      <g class="ws-boil2" stroke="#272a36" stroke-width="2"><path d="M118 52 L118 32 L156 32 L156 52"/><path d="M122 36 v10 M130 36 v10 M138 36 v10 M146 36 v10"/></g>
      <g stroke="#1f38b8" stroke-width="1.8" class="ws-waves2"><path d="M4 60 q6 -3 12 0 t12 0 t12 0"/><path d="M60 68 q6 -3 12 0 t12 0"/><path d="M110 62 q6 -3 12 0 t12 0 t12 0"/><path d="M26 82 q6 -3 12 0 t12 0"/><path d="M96 88 q6 -3 12 0 t12 0"/></g>
      <g stroke="#272a36" stroke-width="1.4">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${10 + i * 24}" cy="${56 + (i % 2) * 2}" r="2.6" fill="${i % 2 ? "#fbd3a8" : "#f7c9cf"}"/>`).join("")}</g>
      <g class="ws-bob2"><path d="M52 84 L96 84 L104 78 L60 78 Z" stroke="#d6243a" stroke-width="2.2" fill="#f7c9cf"/><path d="M60 78 L74 78 L72 74 L64 74 Z" stroke="#272a36" stroke-width="1.8"/>
      <path d="M46 86 q-8 -2 -16 2 M48 82 q-10 -1 -18 -6" stroke="#1f38b8" stroke-width="1.8"/></g>
      <g stroke="#272a36" stroke-width="1.6"><path d="M8 8 h144"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${8 + i * 12}" y="8" width="6" height="5" fill="#272a36"/>`).join("")}</g>
    </svg>
    ${heroImg(hero, "ws-ink-hero-kart")}`;
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
      const art = w.theme === "mario" ? artMario(hero) : w.theme === "arena" ? artArena(hero, rival) : w.theme === "kart" ? artKart(hero) : artDoodle(hero);
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
