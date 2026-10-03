// =============================================================================
// worldMap.js — Selector de Mundos Gamificado (Inspirado en maqueta doodle)
//   Mundo 1: La Oficina (Plataformas)
//   Mundo 2: Coworking Fight (Pelea hasta 4)
//   Mundo 3: BoliBic Tag (Laser Tag)
//   Mundo 4: Pantano de San Juan (Carreras)
// =============================================================================

import { VISIBLE_WORLDS, loadWorldProgress, getWorldChallenges, isWorldLocked, worldRetos } from "../config/worlds.js";
import { getCharacterAvatar } from "../engine/sprites.js";
import { CHARS } from "../config/characters.js";
import { GameState } from "../game/state.js";
import { sfx } from "../engine/audio.js";

const px = (src) => (src && src.startsWith("data:") ? " px" : "");

// Die-cut sticker avatar con contorno blanco y sombra de tinta
const heroImg = (hero, cls) =>
  hero ? `<img class="ws-hero ws-sticker-hero ${cls}${px(hero)}" src="${hero}" alt="Personaje">` : "";

// ── Ilustraciones ricas y coloridas para cada mundo ─────────────────────────

function artMario(hero) {
  return `
    <div class="ws-scene-wrap">
      <svg class="ws-scene-svg" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" fill="none">
        <!-- Cielo azul brillante -->
        <rect width="200" height="96" fill="#62b5fc"/>
        <!-- Nubes blancas estilo doodle -->
        <path d="M 20 28 Q 28 18 40 22 Q 52 14 64 24 Q 72 26 70 34 Q 45 38 20 34 Z" fill="#ffffff" opacity="0.95"/>
        <path d="M 130 20 Q 140 10 152 14 Q 164 8 174 18 Q 182 22 178 28 Q 155 32 130 28 Z" fill="#ffffff" opacity="0.95"/>
        
        <!-- Bloques de ladrillo y bloque interrogación [ ? ] -->
        <g id="mario-blocks">
          <!-- Bloque ladrillo izq -->
          <rect x="76" y="28" width="16" height="16" fill="#e85d26" stroke="#232738" stroke-width="1.8"/>
          <line x1="76" y1="36" x2="92" y2="36" stroke="#232738" stroke-width="1.2"/>
          <line x1="84" y1="28" x2="84" y2="36" stroke="#232738" stroke-width="1.2"/>
          <!-- Bloque con interrogación central -->
          <rect x="92" y="28" width="16" height="16" fill="#fcb316" stroke="#232738" stroke-width="1.8"/>
          <circle cx="94" cy="30" r="1" fill="#232738"/>
          <circle cx="106" cy="30" r="1" fill="#232738"/>
          <circle cx="94" cy="42" r="1" fill="#232738"/>
          <circle cx="106" cy="42" r="1" fill="#232738"/>
          <text x="100" y="41" font-family="'Caveat', cursive, sans-serif" font-weight="900" font-size="14" fill="#232738" text-anchor="middle">?</text>
          <!-- Bloque ladrillo der -->
          <rect x="108" y="28" width="16" height="16" fill="#e85d26" stroke="#232738" stroke-width="1.8"/>
          <line x1="108" y1="36" x2="124" y2="36" stroke="#232738" stroke-width="1.2"/>
          <line x1="116" y1="36" x2="116" y2="44" stroke="#232738" stroke-width="1.2"/>
        </g>

        <!-- Fondo de oficina: escritorios con monitor y planta -->
        <g stroke="#232738" stroke-width="1.6" stroke-linejoin="round">
          <!-- Mesa izq -->
          <rect x="6" y="52" width="28" height="2" fill="#d8e3ed"/>
          <line x1="10" y1="54" x2="10" y2="96"/>
          <line x1="30" y1="54" x2="30" y2="96"/>
          <!-- Monitor izq -->
          <rect x="12" y="38" width="16" height="12" rx="1.5" fill="#232738"/>
          <rect x="14" y="40" width="12" height="8" fill="#7be1ec"/>
          <path d="M 18 50 L 22 50 M 20 50 L 20 52"/>
          <!-- Planta -->
          <path d="M 28 46 Q 26 40 30 36 Q 34 40 32 46" fill="#4caf50"/>
          
          <!-- Mesa y monitor der -->
          <rect x="166" y="52" width="28" height="2" fill="#d8e3ed"/>
          <line x1="170" y1="54" x2="170" y2="96"/>
          <line x1="190" y1="54" x2="190" y2="96"/>
          <rect x="172" y="38" width="16" height="12" rx="1.5" fill="#232738"/>
          <rect x="174" y="40" width="12" height="8" fill="#7be1ec"/>
          <path d="M 178 50 L 182 50 M 180 50 L 180 52"/>
        </g>

        <!-- Suelo de hierba verde y tierra -->
        <rect x="0" y="94" width="200" height="36" fill="#58b332" stroke="#232738" stroke-width="2"/>
        <line x1="0" y1="94" x2="200" y2="94" stroke="#232738" stroke-width="2"/>
        <path d="M 0 94 Q 10 99 20 94 Q 30 99 40 94 Q 50 99 60 94 Q 70 99 80 94 Q 90 99 100 94 Q 110 99 120 94 Q 130 99 140 94 Q 150 99 160 94 Q 170 99 180 94 Q 190 99 200 94" fill="#479e27"/>
      </svg>
      ${heroImg(hero, "ws-hero-mario")}
    </div>
  `;
}

function artArena(hero, rival) {
  return `
    <div class="ws-scene-wrap">
      <svg class="ws-scene-svg" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" fill="none">
        <!-- Fondo de sala de retro -->
        <rect width="200" height="130" fill="#f4efe6"/>
        
        <!-- Pizarra de retrospectiva con 4 columnas -->
        <g stroke="#232738" stroke-width="1.6">
          <rect x="10" y="8" width="180" height="88" rx="3" fill="#ffffff"/>
          <!-- Columnas divisoras -->
          <line x1="55" y1="8" x2="55" y2="96" stroke-dasharray="3 2"/>
          <line x1="100" y1="8" x2="100" y2="96" stroke-dasharray="3 2"/>
          <line x1="145" y1="8" x2="145" y2="96" stroke-dasharray="3 2"/>

          <!-- Cabeceras de columnas -->
          <!-- Col 1: Qué ha ido bien (verde) -->
          <rect x="12" y="10" width="41" height="12" rx="2" fill="#d2f2d4"/>
          <!-- Col 2: A mejorar (rojo/rosa) -->
          <rect x="57" y="10" width="41" height="12" rx="2" fill="#ffd4db"/>
          <!-- Col 3: Preguntas (azul) -->
          <rect x="102" y="10" width="41" height="12" rx="2" fill="#d4e6ff"/>
          <!-- Col 4: Action Items (morado) -->
          <rect x="147" y="10" width="41" height="12" rx="2" fill="#edd8ff"/>
        </g>

        <!-- Post-its en la pizarra -->
        <!-- Post-its verdes -->
        <rect x="16" y="26" width="16" height="14" rx="1" fill="#78d98d" stroke="#232738" stroke-width="1.2" transform="rotate(-3 24 33)"/>
        <rect x="34" y="30" width="15" height="14" rx="1" fill="#a4edb2" stroke="#232738" stroke-width="1.2" transform="rotate(2 41 37)"/>
        <!-- Post-its rojos -->
        <rect x="61" y="28" width="16" height="14" rx="1" fill="#ff7a8e" stroke="#232738" stroke-width="1.2" transform="rotate(3 69 35)"/>
        <rect x="79" y="32" width="15" height="14" rx="1" fill="#ffa8b7" stroke="#232738" stroke-width="1.2" transform="rotate(-2 86 39)"/>
        <!-- Post-its azules -->
        <rect x="106" y="27" width="16" height="14" rx="1" fill="#75b5ff" stroke="#232738" stroke-width="1.2" transform="rotate(-2 114 34)"/>
        <rect x="124" y="31" width="15" height="14" rx="1" fill="#a5d0ff" stroke="#232738" stroke-width="1.2" transform="rotate(3 131 38)"/>
        <!-- Post-its morados -->
        <rect x="151" y="26" width="16" height="14" rx="1" fill="#ba8fff" stroke="#232738" stroke-width="1.2" transform="rotate(2 159 33)"/>
        <rect x="169" y="32" width="15" height="14" rx="1" fill="#d9bfff" stroke="#232738" stroke-width="1.2" transform="rotate(-3 176 39)"/>

        <!-- Banner RETRO FIGHT en la parte superior -->
        <g stroke="#232738" stroke-width="1.5">
          <rect x="62" y="2" width="76" height="14" rx="3" fill="#ffffff"/>
        </g>
        <text x="100" y="12" font-family="'Caveat', cursive, sans-serif" font-weight="900" font-size="10" fill="#1b68e3" text-anchor="middle">RETRO <tspan fill="#e5283b">FIGHT</tspan></text>

        <!-- Mesa de madera de la reunión (plataforma de combate) -->
        <rect x="6" y="100" width="188" height="30" rx="3" fill="#e8984a" stroke="#232738" stroke-width="2.2"/>
        <line x1="6" y1="104" x2="194" y2="104" stroke="#ffffff" stroke-width="1.6" opacity="0.6"/>
        <!-- Papel central "RETRO" -->
        <ellipse cx="100" cy="106" rx="20" ry="4" fill="#ffffff" stroke="#1b68e3" stroke-width="1.2"/>
      </svg>
      <div class="ws-vs-badge">VS</div>
      ${heroImg(hero, "ws-hero-arena-p1")}
      ${heroImg(rival, "ws-hero-arena-p2")}
    </div>
  `;
}

function artDoodle(hero) {
  return `
    <div class="ws-scene-wrap">
      <svg class="ws-scene-svg" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" fill="none">
        <!-- Fondo de oficina CINK Coworking -->
        <rect width="200" height="130" fill="#edf3f9"/>
        
        <!-- Tabique / Ventanal al fondo con luz cálida -->
        <rect x="110" y="12" width="80" height="74" fill="#ffeebb" opacity="0.7" stroke="#232738" stroke-width="1.6"/>
        <line x1="150" y1="12" x2="150" y2="86" stroke="#232738" stroke-width="1.6"/>
        <line x1="110" y1="48" x2="190" y2="48" stroke="#232738" stroke-width="1.6"/>

        <!-- Placa oficial "CINK COWORKING" en la pared -->
        <g stroke="#232738" stroke-width="1.8">
          <rect x="8" y="12" width="70" height="32" rx="3" fill="#ffffff"/>
          <!-- Logo geométrico CINK -->
          <g transform="translate(12, 16) scale(0.65)" fill="none" stroke="#232738" stroke-width="2.5">
            <path d="M 12 2 L 2 9 L 2 21 L 12 28 L 22 21 L 22 9 Z"/>
            <path d="M 12 8 L 7 12 L 7 18 L 12 22 L 17 18 L 17 12 Z"/>
          </g>
          <text x="36" y="27" font-family="'Caveat', cursive, sans-serif" font-weight="900" font-size="14" fill="#232738">CINK</text>
          <text x="36" y="38" font-family="'Patrick Hand', cursive, sans-serif" font-weight="700" font-size="6.5" letter-spacing="1" fill="#232738">COWORKING</text>
        </g>

        <!-- Notificación correo electrónico con sobre en pared -->
        <g transform="translate(150, 18)" stroke="#e5283b" stroke-width="1.8" fill="#ffffff">
          <rect width="24" height="16" rx="2"/>
          <path d="M 0 0 L 12 9 L 24 0"/>
        </g>

        <!-- Rayos láser rojos cruzando toda la habitación -->
        <g stroke="#ff203c" stroke-width="2.4" stroke-linecap="round" opacity="0.95">
          <line x1="0" y1="64" x2="200" y2="84"/>
          <line x1="0" y1="92" x2="200" y2="60"/>
          <line x1="60" y1="12" x2="160" y2="120" stroke-dasharray="8 4"/>
        </g>

        <!-- Archivador azul en la esquina derecha -->
        <g stroke="#232738" stroke-width="1.8">
          <rect x="146" y="66" width="46" height="54" rx="2" fill="#1b68e3"/>
          <line x1="146" y1="84" x2="192" y2="84"/>
          <line x1="146" y1="102" x2="192" y2="102"/>
          <rect x="164" y="72" width="10" height="4" rx="1" fill="#ffffff"/>
          <rect x="164" y="90" width="10" height="4" rx="1" fill="#ffffff"/>
          <rect x="164" y="108" width="10" height="4" rx="1" fill="#ffffff"/>
        </g>

        <!-- Suelo con perspectiva -->
        <line x1="0" y1="110" x2="200" y2="110" stroke="#232738" stroke-width="2"/>
      </svg>
      ${heroImg(hero, "ws-hero-doodle")}
    </div>
  `;
}

function artFall(hero) {
  const plats = [[8, 104, 54, "#e0399a"], [70, 92, 46, "#1f8cff"], [124, 80, 40, "#ffb020"], [158, 66, 34, "#3bb54a"]];
  return `
    <div class="ws-scene-wrap">
      <svg class="ws-scene-svg" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" fill="none">
        <!-- cielo de plató con focos -->
        <rect width="200" height="130" fill="#ffd6ec"/>
        <g opacity="0.55">
          <polygon points="20,0 34,0 70,130 30,130" fill="#fff6c8"/>
          <polygon points="166,0 180,0 170,130 130,130" fill="#fff6c8"/>
        </g>
        <!-- mar de datos -->
        <rect x="0" y="112" width="200" height="18" fill="#6bb8ff"/>
        <g fill="#1f38b8" font-family="monospace" font-size="7" opacity="0.6"><text x="10" y="124">0101</text><text x="70" y="126">1001</text><text x="140" y="123">0110</text></g>
        <!-- plataformas de colores en escalera hasta la batería -->
        ${plats.map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="8" rx="2" fill="${c}" stroke="#232738" stroke-width="1.8"/>`).join("")}
        <!-- ruleta -->
        <g transform="translate(97, 86)"><rect x="-22" y="-2" width="44" height="4" fill="#e5283b" stroke="#232738" stroke-width="1.4" transform="rotate(-14)"/><circle r="3" fill="#232738"/></g>
        <!-- la batería arriba, con brillo -->
        <g transform="translate(175, 40)">
          <circle r="15" fill="#fff6c8" opacity="0.8"/>
          <rect x="-7" y="-11" width="14" height="22" rx="2" fill="#3bb54a" stroke="#232738" stroke-width="2"/>
          <rect x="-3" y="-14" width="6" height="3" fill="#232738"/>
          <path d="M 1 -7 L -3 1 L 1 1 L -1 8 L 4 -1 L 0 -1 Z" fill="#fff"/>
        </g>
        <!-- confeti -->
        <g stroke-width="2" stroke-linecap="round">
          <line x1="40" y1="20" x2="44" y2="24" stroke="#e0399a"/><line x1="90" y1="14" x2="88" y2="20" stroke="#1f8cff"/>
          <line x1="120" y1="28" x2="126" y2="27" stroke="#ffb020"/><line x1="60" y1="40" x2="62" y2="46" stroke="#3bb54a"/>
          <line x1="150" y1="12" x2="154" y2="17" stroke="#e5283b"/>
        </g>
      </svg>
      ${heroImg(hero, "ws-hero-kart")}
    </div>
  `;
}

function artKart(hero) {
  return `
    <div class="ws-scene-wrap">
      <svg class="ws-scene-svg" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice" fill="none">
        <!-- Cielo soleado del pantano -->
        <rect width="200" height="66" fill="#71c7fb"/>
        
        <!-- Sol radiante con rayos -->
        <g transform="translate(170, 20)">
          <circle cx="0" cy="0" r="10" fill="#ffd426" stroke="#232738" stroke-width="1.8"/>
          ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = (a * Math.PI) / 180;
            const x1 = Math.cos(rad) * 13;
            const y1 = Math.sin(rad) * 13;
            const x2 = Math.cos(rad) * 17;
            const y2 = Math.sin(rad) * 17;
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffd426" stroke-width="2" stroke-linecap="round"/>`;
          }).join("")}
        </g>

        <!-- Orilla verde con pinos / árboles al fondo -->
        <path d="M 0 56 Q 30 46 60 52 Q 100 44 140 50 Q 170 46 200 54 L 200 66 L 0 66 Z" fill="#3b9643" stroke="#232738" stroke-width="1.8"/>
        <!-- Pinos en la orilla -->
        <g fill="#256b2c">
          <polygon points="12,50 8,56 16,56"/>
          <polygon points="28,46 22,54 34,54"/>
          <polygon points="46,48 40,56 52,56"/>
          <polygon points="80,44 74,52 86,52"/>
          <polygon points="98,46 92,54 104,54"/>
        </g>

        <!-- Pantalán de madera a la derecha -->
        <g stroke="#232738" stroke-width="1.8" fill="#4a5568">
          <rect x="145" y="44" width="50" height="8" rx="1" fill="#718096"/>
          <line x1="152" y1="52" x2="152" y2="70"/>
          <line x1="172" y1="52" x2="172" y2="70"/>
          <line x1="190" y1="52" x2="190" y2="70"/>
        </g>

        <!-- Agua azul del pantano -->
        <rect x="0" y="64" width="200" height="66" fill="#248ed8"/>
        <!-- Ondas de agua en azul más claro y blanco -->
        <g stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85">
          <path d="M 10 74 Q 20 70 30 74 M 70 78 Q 80 74 90 78 M 120 72 Q 130 68 140 72"/>
          <path d="M 30 90 Q 40 86 50 90 M 90 98 Q 100 94 110 98 M 150 94 Q 160 90 170 94"/>
          <path d="M 15 112 Q 25 108 35 112 M 75 118 Q 85 114 95 118 M 135 114 Q 145 110 155 114"/>
        </g>

        <!-- Boya con bandera de cuadros 🏁 -->
        <g transform="translate(180, 84)">
          <path d="M 0 6 C -6 6 -8 14 0 16 C 8 14 6 6 0 6 Z" fill="#e5283b" stroke="#232738" stroke-width="1.8"/>
          <line x1="0" y1="6" x2="0" y2="-12" stroke="#232738" stroke-width="1.8"/>
          <!-- Bandera ajedrezada -->
          <rect x="0" y="-12" width="12" height="8" fill="#ffffff" stroke="#232738" stroke-width="1.2"/>
          <rect x="0" y="-12" width="6" height="4" fill="#232738"/>
          <rect x="6" y="-8" width="6" height="4" fill="#232738"/>
        </g>

        <!-- Lancha motora roja con estela de agua -->
        <g transform="translate(70, 78)">
          <!-- Estela de espuma blanca -->
          <path d="M -24 16 Q -12 6 0 12 Q -12 24 -24 16 Z" fill="#ffffff" opacity="0.95"/>
          <path d="M -36 18 Q -20 10 -10 16 Q -22 26 -36 18 Z" fill="#ffffff" opacity="0.7"/>
          <!-- Casco de la barca -->
          <path d="M -10 12 L 40 12 L 52 4 L 16 4 Z" fill="#e5283b" stroke="#232738" stroke-width="2"/>
          <path d="M -6 12 L 34 12 L 30 16 L -2 16 Z" fill="#ffffff" stroke="#232738" stroke-width="1.6"/>
          <!-- Parabrisas -->
          <polygon points="12,4 22,-4 32,4" fill="#a0d8ef" stroke="#232738" stroke-width="1.6"/>
        </g>
      </svg>
      ${heroImg(hero, "ws-hero-kart")}
    </div>
  `;
}

// ── Inicializador y controlador del selector de mundos ─────────────────────

/** dibujo del mundo (el de su carta del mapa), con tu personaje */
export function worldArt(w) {
  const hero = getCharacterAvatar((CHARS[GameState.charIdx] || CHARS[0]).id);
  const rival = getCharacterAvatar(CHARS[(GameState.charIdx + 5) % CHARS.length].id);
  return w.theme === "mario" ? artMario(hero) : w.theme === "arena" ? artArena(hero, rival) : w.theme === "kart" ? artKart(hero) : w.theme === "fall" ? artFall(hero) : artDoodle(hero);
}

export function initWorldMap({ onSelectWorld }) {
  const mapOv = document.getElementById("worldMapOv");
  const grid = document.getElementById("wsGrid");
  const dots = document.getElementById("wsDots");
  const trailTrack = document.getElementById("wsTrailTrack");
  const btnCloseMap = document.getElementById("btnCloseMap");

  let selectedId = 1;

  function play(id) {
    const progress = loadWorldProgress();
    const w = VISIBLE_WORLDS.find((x) => x.id === id);
    if (w && isWorldLocked(w, progress)) {
      try { sfx(200, 0.15, "sawtooth"); } catch (e) {}
      const card = grid?.querySelector(`.ws-card[data-id="${id}"]`);
      if (card) {
        card.classList.remove("ws-shake");
        void card.offsetWidth;
        card.classList.add("ws-shake");
      }
      return;
    }
    hideWorldMap();
    try { sfx(880, 0.12, "triangle"); } catch (e) {}
    if (onSelectWorld) onSelectWorld(id);
  }

  function select(id, scroll) {
    selectedId = id;
    if (grid) {
      grid.querySelectorAll(".ws-card").forEach((c) => {
        const isSel = Number(c.dataset.id) === id;
        c.classList.toggle("selected", isSel);
      });
    }
    if (trailTrack) {
      trailTrack.querySelectorAll(".ws-node").forEach((n) => {
        n.classList.toggle("active", Number(n.dataset.id) === id);
      });
    }
    if (dots) {
      dots.querySelectorAll("i").forEach((d) => d.classList.toggle("on", Number(d.dataset.id) === id));
    }
    if (scroll && grid) {
      const card = grid.querySelector(`.ws-card[data-id="${id}"]`);
      if (card && grid.scrollWidth > grid.clientWidth + 4) {
        grid.scrollTo({ left: card.offsetLeft - (grid.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
      }
    }
  }

  function renderMap() {
    if (!grid) return;
    const progress = loadWorldProgress();
    const conquered = VISIBLE_WORLDS.filter((w) => getWorldChallenges(w.id, progress) >= 3 || progress.completed.includes(w.id)).length;
    const progTxt = document.getElementById("mapProgressTxt");
    if (progTxt) progTxt.textContent = `${conquered}/${VISIBLE_WORLDS.length} MUNDOS`;

    const curChar = CHARS[GameState.charIdx] || CHARS[0];
    const hero = getCharacterAvatar(curChar.id);
    const rivalChar = CHARS[(GameState.charIdx + 5) % CHARS.length];
    const rival = getCharacterAvatar(rivalChar.id);
    const heroImgEl = document.getElementById("mapHeroImg");
    const heroName = document.getElementById("mapHeroName");
    if (heroImgEl && hero) heroImgEl.src = hero;
    if (heroName) heroName.textContent = curChar.name;

    // Render Cards
    grid.innerHTML = VISIBLE_WORLDS.map((w) => {
      const retos = getWorldChallenges(w.id, progress);
      const locked = isWorldLocked(w, progress);
      const isSel = (selectedId === w.id);
      const art = w.theme === "mario" ? artMario(hero) : w.theme === "arena" ? artArena(hero, rival) : w.theme === "kart" ? artKart(hero) : w.theme === "fall" ? artFall(hero) : artDoodle(hero);

      return `
        <article class="ws-card ws-${w.theme} ${isSel ? "selected" : ""} ${locked ? "locked" : ""}" data-id="${w.id}" data-num="${w.num}" tabindex="0" style="--card-acc: ${w.color};">
          <!-- Marco de rotulador rojo exterior (solo cuando está seleccionado) con trazos de énfasis -->
          <div class="ws-sketch-frame" aria-hidden="true">
            <span class="ws-corner-tick ws-tick-tl"></span>
            <span class="ws-corner-tick ws-tick-tr"></span>
            <span class="ws-corner-tick ws-tick-bl"></span>
            <span class="ws-corner-tick ws-tick-br"></span>
            <span class="ws-side-tick ws-tick-l1"></span>
            <span class="ws-side-tick ws-tick-l2"></span>
            <span class="ws-side-tick ws-tick-r1"></span>
            <span class="ws-side-tick ws-tick-r2"></span>
          </div>

          <!-- Hoja blanca unificada con esquinas redondeadas -->
          <div class="ws-card-sheet">
            <!-- Washi tape pegada arriba en el centro -->
            <div class="ws-washi-tape" style="background: ${w.tapeColor};"></div>

            <!-- Círculo con número de mundo arriba a la izquierda -->
            <div class="ws-num-badge" style="background: ${w.color};">
              <span class="ws-num-val">${w.num}</span>
              ${isSel ? `
                <div class="ws-num-burst" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
              ` : ""}
            </div>

            <!-- Ventana de ilustración con marco -->
            <div class="ws-art-window">
              ${art}
            </div>

            <!-- Cuerpo de información -->
            <div class="ws-card-body">
              <div class="ws-kicker" style="background: ${w.kickerBg}; color: ${w.color};">MUNDO ${w.num}</div>
              <h2 class="ws-title" style="color: ${w.color};">${w.name}</h2>
              <div class="ws-genre-pill" style="background: ${w.genreBg}; color: ${w.genreColor};">${w.genre}</div>

              <!-- Fila de retos con 3 estrellas y contador -->
              <div class="ws-retos-row" role="button" tabindex="0" data-id="${w.id}" title="Ver qué te falta">
                <div class="ws-stars">
                  ${[1, 2, 3].map(i => `
                    <svg class="ws-star ${i <= retos ? "filled" : "empty"}" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill="${i <= retos ? "#ffc233" : "#d8dfeb"}"
                        stroke="${i <= retos ? "#232738" : "#98a5bb"}"
                        stroke-width="1.8"
                        stroke-linejoin="round"/>
                    </svg>
                  `).join("")}
                </div>
                <span class="ws-retos-txt">${retos}/3 RETOS <i class="ws-retos-info">ⓘ</i></span>
              </div>

              <!-- Botón JUGAR o Caja bloqueada -->

                <button class="ws-play ${isSel ? "is-selected" : ""}" data-id="${w.id}">
                  <span class="ws-play-icon">▶</span>
                  <span>JUGAR</span>
                </button>

            </div>
          </div>
        </article>`;
    }).join("");

    // Render Adventure Trail Bar
    if (trailTrack) {
      trailTrack.innerHTML = `
        <div class="ws-trail-line-bg">
          <svg viewBox="0 0 800 20" preserveAspectRatio="none">
            <line x1="20" y1="10" x2="780" y2="10" stroke="#166ae6" stroke-width="2.6" stroke-dasharray="8 6" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="ws-trail-nodes">
          ${VISIBLE_WORLDS.map((w) => {
            const isSel = (selectedId === w.id);
            return `
              <button class="ws-node ${isSel ? "active" : ""}" data-id="${w.id}" title="${w.name}">
                <span class="ws-node-circle" style="background: ${w.color};">
                  <span class="ws-node-num">${w.num}</span>
                  ${isSel ? '<span class="ws-node-ring"></span>' : ""}
                </span>
                <span class="ws-node-title">${w.name}</span>
              </button>
            `;
          }).join("")}
        </div>
      `;

      trailTrack.querySelectorAll(".ws-node").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = Number(btn.dataset.id);
          select(id, true);
          try { sfx(660, 0.06, "sine"); } catch (err) {}
        });
      });
    }

    if (dots) {
      dots.innerHTML = VISIBLE_WORLDS.map((w) => `<i data-id="${w.id}"></i>`).join("");
      dots.querySelectorAll("i").forEach((d) => d.addEventListener("click", () => select(Number(d.dataset.id), true)));
    }

    // Interacciones en tarjetas
    grid.querySelectorAll(".ws-card").forEach((card) => {
      const id = Number(card.dataset.id);
      card.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse" && selectedId !== id) {
          select(id);
          try { sfx(660, 0.05, "sine"); } catch (err) {}
        }
      });
      card.addEventListener("click", (e) => {
        if (e.target.closest(".ws-play")) return;
        if (selectedId === id) play(id);
        else {
          select(id, true);
          try { sfx(660, 0.06, "sine"); } catch (err) {}
        }
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.stopPropagation();
          play(id);
        }
      });
    });

    grid.querySelectorAll(".ws-play").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        play(Number(b.dataset.id));
      })
    );

    // al tocar los retos: qué hay que hacer y qué te falta
    grid.querySelectorAll(".ws-retos-row").forEach((row) => row.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(row.dataset.id);
      const open = grid.querySelector(".ws-retos-pop");
      if (open) { const same = open.dataset.id === String(id); open.remove(); if (same) return; }
      const list = worldRetos(id, loadWorldProgress());
      const left = list.filter((x) => !x.done).length;
      const pop = document.createElement("div");
      pop.className = "ws-retos-pop";
      pop.dataset.id = id;
      pop.innerHTML = `<div class="ws-retos-pop-h">${left ? `Te falta${left > 1 ? "n" : ""} ${left}` : "¡Todos conseguidos! 🏆"}<button aria-label="Cerrar">✕</button></div>
        <ol>${list.map((x, i) => `<li class="${x.done ? "done" : ""}"><span>${x.done ? "★" : "☆"}</span><div><b>Reto ${i + 1}</b> ${x.txt}</div></li>`).join("")}</ol>`;
      pop.addEventListener("click", (ev) => { ev.stopPropagation(); if (ev.target.closest("button")) pop.remove(); });
      row.closest(".ws-card").appendChild(pop);
      try { sfx(700, 0.05, "triangle"); } catch (err) {}
    }));


    const def = VISIBLE_WORLDS.find((w) => w.id === (selectedId || GameState.currentWorld)) || VISIBLE_WORLDS[0];
    select(def.id, false);
  }

  // Desplazamiento en carrusel móvil
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
