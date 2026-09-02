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

  function updateStageBanner(w) {
    const badge = document.getElementById("stageBannerBadge");
    const title = document.getElementById("stageBannerTitle");
    const sub = document.getElementById("stageBannerSub");
    if (badge) badge.textContent = `MUNDO ${w.id}`;
    if (title) {
      title.textContent = w.name.toUpperCase();
      title.style.color = w.accentColor || "#ffc857";
    }
    if (sub) sub.textContent = `${(w.subtitle || "").toUpperCase()} · JEFE: ${w.bossName || ""}`;
  }

  function renderMap() {
    const progress = loadWorldProgress();
    const completedCount = progress.completed.length;

    const mapProgressTxt = document.getElementById("mapProgressTxt");
    if (mapProgressTxt) {
      mapProgressTxt.textContent = `${completedCount}/${WORLDS.length} MUNDOS`;
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

    const isPortrait = window.innerHeight > window.innerWidth;
    
    // Set default selected world if none selected yet
    if (!selectedWorld) {
      const defaultId = progress.currentWorldId || 1;
      selectedWorld = WORLDS.find(w => w.id === defaultId) || WORLDS[0];
    }
    updateStageBanner(selectedWorld);

    WORLDS.forEach((w, idx) => {
      const unlocked = isWorldUnlocked(w.id, progress);
      const isCompleted = Boolean(progress && progress.completed && progress.completed.includes(w.id));
      const isSelected = selectedWorld && selectedWorld.id === w.id;
      const rank = (progress && progress.ranks && progress.ranks[w.id]) || "";

      const coords = (isPortrait && w.mapCoordsPortrait) ? w.mapCoordsPortrait : w.mapCoords;

      const node = document.createElement("div");
      node.className = `map-node ${unlocked ? "unlocked" : "locked"} ${isCompleted ? "completed" : ""} ${isSelected ? "selected" : ""}`;
      node.style.left = `${coords.x}%`;
      node.style.top = `${coords.y}%`;
      node.dataset.worldId = w.id;

      let badgeHtml = "";
      if (isCompleted) {
        badgeHtml = `<div class="node-status-star" title="Dominado">⭐<span class="node-rank">${rank || ""}</span></div>`;
      } else if (!unlocked) {
        badgeHtml = `<div class="node-status-lock" title="Bloqueado">🔒</div>`;
      } else {
        badgeHtml = `<div class="node-status-pulse" title="Disponible"></div>`;
      }

      // If this is the currently selected world, render the hero standing on the node!
      let heroSpriteHtml = "";
      if (isSelected && unlocked) {
        const av = getCharacterAvatar(curChar.id);
        if (av) {
          heroSpriteHtml = `
            <div class="map-hero-token">
              <div class="map-hero-disc"></div>
              <img src="${av}" class="map-player-pin" alt="${curChar.name}">
            </div>
          `;
        }
      }

      node.innerHTML = `
        <div class="node-aura"></div>
        <div class="node-circle" style="border-color:${w.accentColor}">
          <span class="node-icon">${w.iconEmoji}</span>
          <span class="node-stage-num">${w.id}</span>
          ${badgeHtml}
          ${heroSpriteHtml}
        </div>
        <div class="node-label">
          <span class="node-name">${w.name}</span>
        </div>
      `;

      node.addEventListener("click", () => {
        if (!unlocked) {
          try { sfx(220, 0.12, "sawtooth"); } catch (e) {}
          alert(`🔒 ¡Mundo bloqueado! Primero debes superar el Mundo ${w.id - 1}.`);
          return;
        }

        // If clicking already selected node, play directly!
        if (selectedWorld && selectedWorld.id === w.id) {
          hideWorldMap();
          try { sfx.coin(); } catch (e) {}
          if (onSelectWorld) onSelectWorld(w.id);
          return;
        }

        selectedWorld = w;
        try { sfx(660, 0.08, "sine"); } catch (e) {}
        renderMap();
      });

      mapNodesContainer.appendChild(node);
    });
  }

  function openWorldCard(w, progress) {
    selectedWorld = w;
    try { sfx(600, 0.08, "square"); } catch (e) {}
    updateStageBanner(w);

    if (wcIcon) wcIcon.textContent = w.iconEmoji || "🎯";
    if (wcTitle) {
      wcTitle.textContent = w.title || w.name;
      wcTitle.style.color = w.accentColor || "#59d8ff";
    }
    if (wcSubtitle) wcSubtitle.textContent = w.subtitle || "";
    if (wcDesc) wcDesc.textContent = w.desc || "";
    if (wcBoss) wcBoss.textContent = `👾 JEFE: ${w.bossName || "BOSS"}`;

    const isCompleted = Boolean(progress && progress.completed && progress.completed.includes(w.id));
    const score = (progress && progress.highScores && progress.highScores[w.id]) || 0;
    const rank = (progress && progress.ranks && progress.ranks[w.id]) || "";

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
  }

  if (btnCloseWc) {
    btnCloseWc.addEventListener("click", closeWorldCard);
  }

  const btnPlayMapDirect = document.getElementById("btnPlayMapDirect");
  if (btnPlayMapDirect) {
    btnPlayMapDirect.addEventListener("click", () => {
      const worldId = selectedWorld ? selectedWorld.id : 1;
      hideWorldMap();
      try { sfx.coin(); } catch (e) {}
      if (onSelectWorld) {
        onSelectWorld(worldId);
      }
    });
  }

  if (btnPlayWorld) {
    btnPlayWorld.addEventListener("click", () => {
      if (!selectedWorld) return;
      const worldId = selectedWorld.id;
      closeWorldCard();
      hideWorldMap();
      try { sfx(880, 0.15, "triangle"); } catch (e) {}
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

  window.addEventListener("resize", () => {
    if (GameState.worldMapOpen) {
      renderMap();
    }
  });

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
