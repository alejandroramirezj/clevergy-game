import { WORLDS, loadWorldProgress, isWorldUnlocked } from "../config/worlds.js";
import { getCharacterAvatar } from "../engine/sprites.js";
import { CHARS } from "../config/characters.js";
import { GameState } from "../game/state.js";
import { sfx } from "../engine/audio.js";

export function initWorldMap({ onSelectWorld, onOpenTeam }) {
  const mapOv = document.getElementById("worldMapOv");
  const mapNodesContainer = document.getElementById("mapNodesContainer");
  const mapProgressBadge = document.getElementById("mapProgressBadge");
  const mapHeroBadge = document.getElementById("mapHeroBadge");
  const mapHeroImg = document.getElementById("mapHeroImg");
  const mapHeroName = document.getElementById("mapHeroName");
  const btnMapTeam = document.getElementById("btnMapTeam");
  const btnCloseMap = document.getElementById("btnCloseMap");

  // World Card Modal elements
  const worldCardModal = document.getElementById("worldCardModal");
  const wcIcon = document.getElementById("wcIcon");
  const wcTitle = document.getElementById("wcTitle");
  const wcSubtitle = document.getElementById("wcSubtitle");
  const wcDesc = document.getElementById("wcDesc");
  const wcBoss = document.getElementById("wcBoss");
  const wcRecord = document.getElementById("wcRecord");
  const btnPlayWorld = document.getElementById("btnPlayWorld");
  const btnCloseWc = document.getElementById("btnCloseWc");

  let selectedWorld = null;

  function renderMap() {
    const progress = loadWorldProgress();
    const completedCount = progress.completed.length;

    if (mapProgressBadge) {
      mapProgressBadge.innerHTML = `⭐ <span>${completedCount}/5</span> MUNDOS DOMINADOS`;
    }

    // Update active hero display on map
    const curChar = CHARS[GameState.charIdx] || CHARS[0];
    if (mapHeroImg) {
      const av = getCharacterAvatar(curChar.id);
      if (av) mapHeroImg.src = av;
    }
    if (mapHeroName) {
      mapHeroName.textContent = curChar.name;
    }

    if (!mapNodesContainer) return;
    mapNodesContainer.innerHTML = "";

    WORLDS.forEach((w, idx) => {
      const unlocked = isWorldUnlocked(w.id, progress);
      const isCompleted = progress.completed.includes(w.id);
      const isCurrent = progress.currentWorldId === w.id;
      const rank = progress.ranks[w.id];

      const node = document.createElement("div");
      node.className = `map-node ${unlocked ? "unlocked" : "locked"} ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`;
      node.style.left = `${w.mapCoords.x}%`;
      node.style.top = `${w.mapCoords.y}%`;
      node.dataset.worldId = w.id;

      let badgeHtml = "";
      if (isCompleted) {
        badgeHtml = `<div class="node-status-star" title="Dominado">⭐<span class="node-rank">${rank || ""}</span></div>`;
      } else if (!unlocked) {
        badgeHtml = `<div class="node-status-lock" title="Bloqueado">🔒</div>`;
      } else {
        badgeHtml = `<div class="node-status-pulse" title="Disponible"></div>`;
      }

      // If this is where the player is resting
      let heroSpriteHtml = "";
      if (isCurrent && unlocked) {
        const av = getCharacterAvatar(curChar.id);
        if (av) {
          heroSpriteHtml = `<img src="${av}" class="map-player-pin" alt="Jugador">`;
        }
      }

      node.innerHTML = `
        <div class="node-aura"></div>
        <div class="node-circle" style="border-color:${w.accentColor}">
          <span class="node-icon">${w.iconEmoji}</span>
          ${badgeHtml}
          ${heroSpriteHtml}
        </div>
        <div class="node-label">
          <span class="node-num">MUNDO ${w.id}</span>
          <span class="node-name">${w.name}</span>
        </div>
      `;

      node.addEventListener("click", () => {
        if (!unlocked) {
          sfx(220, 0.12, "sawtooth");
          alert(`🔒 ¡Mundo bloqueado! Primero debes superar el Mundo ${w.id - 1}.`);
          return;
        }
        openWorldCard(w, progress);
      });

      mapNodesContainer.appendChild(node);
    });
  }

  function openWorldCard(w, progress) {
    selectedWorld = w;
    sfx(600, 0.08, "square");

    if (wcIcon) wcIcon.textContent = w.iconEmoji;
    if (wcTitle) {
      wcTitle.textContent = w.title;
      wcTitle.style.color = w.accentColor;
    }
    if (wcSubtitle) wcSubtitle.textContent = w.subtitle;
    if (wcDesc) wcDesc.textContent = w.desc;
    if (wcBoss) wcBoss.textContent = `👾 JEFE: ${w.bossName}`;

    const isCompleted = progress.completed.includes(w.id);
    const score = progress.highScores[w.id];
    const rank = progress.ranks[w.id];

    if (wcRecord) {
      if (isCompleted) {
        wcRecord.innerHTML = `<span class="wc-done">⭐ DOMINADO</span> — Récord: <b>${score.toLocaleString()} pts</b> (${rank ? "Rango " + rank : ""})`;
      } else {
        wcRecord.innerHTML = `<span class="wc-pending">⚪ PENDIENTE DE DOMINAR</span>`;
      }
    }

    if (worldCardModal) {
      worldCardModal.classList.remove("hidden");
    }
  }

  function closeWorldCard() {
    if (worldCardModal) worldCardModal.classList.add("hidden");
    selectedWorld = null;
  }

  if (btnCloseWc) {
    btnCloseWc.addEventListener("click", closeWorldCard);
  }

  if (btnPlayWorld) {
    btnPlayWorld.addEventListener("click", () => {
      if (!selectedWorld) return;
      const worldId = selectedWorld.id;
      closeWorldCard();
      hideWorldMap();
      sfx(880, 0.15, "triangle");
      if (onSelectWorld) {
        onSelectWorld(worldId);
      }
    });
  }

  if (btnMapTeam) {
    btnMapTeam.addEventListener("click", () => {
      if (onOpenTeam) onOpenTeam();
    });
  }

  if (btnCloseMap) {
    btnCloseMap.addEventListener("click", () => {
      hideWorldMap();
    });
  }

  function showWorldMap() {
    renderMap();
    if (mapOv) mapOv.classList.remove("hidden");
    GameState.worldMapOpen = true;
  }

  function hideWorldMap() {
    if (mapOv) mapOv.classList.add("hidden");
    closeWorldCard();
    GameState.worldMapOpen = false;
  }

  return {
    showWorldMap,
    hideWorldMap,
    renderMap
  };
}
