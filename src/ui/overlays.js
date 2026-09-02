import { BOOT_LINES } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { GameState, respawn, fmtT, switchChar } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { anim, getCharacterAvatar } from "../engine/sprites.js";
import { fetchGlobalLeaderboard } from "../game/leaderboard.js";

export function initOverlays({ onStartGame, onOpenMap, onNextWorld }) {
  // Elements
  const menuOv = document.getElementById("menuOv");
  const nameInput = document.getElementById("nameInput");
  const btnPlay = document.getElementById("btnPlay");
  const btnOpenLB = document.getElementById("btnOpenLB");
  const btnOpenCtrl = document.getElementById("btnOpenCtrl");
  const btnOpenStory = document.getElementById("btnOpenStory");
  const btnChangeChar = document.getElementById("btnChangeChar");

  // Character spotlight elements
  const spotlightAvatar = document.getElementById("spotlightAvatar");
  const spotlightName = document.getElementById("spotlightName");
  const spotlightForm = document.getElementById("spotlightForm");
  const spotlightAb = document.getElementById("spotlightAb");
  const spotlightTip = document.getElementById("spotlightTip");
  const barSpd = document.getElementById("barSpd");
  const barJump = document.getElementById("barJump");

  // Modals
  const lbOv = document.getElementById("lbOv");
  const lbModalContent = document.getElementById("lbModalContent");
  const btnRefreshLB = document.getElementById("btnRefreshLB");
  const btnCloseLB = document.getElementById("btnCloseLB");

  const ctrlOv = document.getElementById("ctrlOv");
  const btnCloseCtrl = document.getElementById("btnCloseCtrl");

  const bootOv = document.getElementById("bootOv");
  const bootTxt = document.getElementById("bootTxt");
  const pressSkipStory = document.getElementById("pressSkipStory");

  const teamOv = document.getElementById("teamOv");
  const teamGrid = document.getElementById("teamGrid");
  const teamClose = document.getElementById("teamClose");

  const retryBtn = document.getElementById("retryBtn");
  const restartBtn = document.getElementById("restartBtn");
  const winToMenuBtn = document.getElementById("winToMenuBtn");
  const goBackMenuBtn = document.getElementById("goBackMenuBtn");

  // Load saved name
  try {
    const saved = localStorage.getItem("clevergy_player_name");
    if (saved) nameInput.value = saved;
  } catch (e) {}

  // Update spotlight UI based on selected character
  function updateSpotlight() {
    const c = CHARS[GameState.charIdx];
    if (!c) return;
    if (spotlightAvatar) {
      const av = getCharacterAvatar(c.id);
      if (av) {
        spotlightAvatar.innerHTML = `<img src="${av}" class="spotlight-avatar-img" alt="${c.name}">`;
      } else {
        spotlightAvatar.textContent = c.emoji;
      }
    }
    if (spotlightName) spotlightName.textContent = c.name;
    if (spotlightForm) spotlightForm.textContent = c.form;
    if (spotlightAb) spotlightAb.textContent = `✦ HABILIDAD: ${c.ab}`;
    if (spotlightTip) spotlightTip.textContent = c.tip;

    // Normalizing stats: spd 2.4 - 5.4, jump 8.5 - 16.5
    if (barSpd) {
      const spdPct = Math.round(((c.spd - 2.0) / (5.6 - 2.0)) * 100);
      barSpd.style.width = Math.max(15, Math.min(100, spdPct)) + "%";
    }
    if (barJump) {
      const jmpPct = Math.round(((c.jump - 8.0) / (16.5 - 8.0)) * 100);
      barJump.style.width = Math.max(15, Math.min(100, jmpPct)) + "%";
    }

    if (teamGrid) {
      [...teamGrid.children].forEach((el, i) => {
        el.classList.toggle("sel", i === GameState.charIdx);
      });
    }

    // Update Campfire Stage selection
    const campfireTokens = document.querySelectorAll(".campfire-char-node");
    campfireTokens.forEach((el, i) => {
      const isSel = i === GameState.charIdx;
      el.classList.toggle("active-hero", isSel);
      const p1 = el.querySelector(".campfire-p1-tag");
      if (p1) p1.classList.toggle("hidden", !isSel);
    });
  }

  // Exact coordinates for characters encircling the campfire on the illuminated ground (630x300 canvas)
  const CAMPFIRE_SPOTS = [
    { x: 120, y: 155, z: 6, scale: 1.0 },   // 0: alejandro (boxer fly left flank)
    { x: 175, y: 125, z: 4, scale: 0.95 },  // 1: ale (oil bottle left-mid)
    { x: 230, y: 102, z: 3, scale: 0.9 },   // 2: alvaroM (calculator back-left)
    { x: 285, y: 90,  z: 2, scale: 0.88 },  // 3: alvaroP (mic back-center-left)
    { x: 345, y: 90,  z: 2, scale: 0.88 },  // 4: ana (lion climber back-center-right)
    { x: 400, y: 102, z: 3, scale: 0.9 },   // 5: beltran (thimble back-right)
    { x: 455, y: 125, z: 4, scale: 0.95 },  // 6: bruno (totem right-mid)
    { x: 505, y: 155, z: 6, scale: 1.0 },   // 7: gonzalo (broccoli right flank)
    { x: 535, y: 195, z: 7, scale: 1.05 },  // 8: javi (communist flag right foreground)
    { x: 475, y: 225, z: 8, scale: 1.05 },  // 9: jesus (cruzcampo right foreground)
    { x: 415, y: 240, z: 9, scale: 1.08 },  // 10: pablo (orange front-right)
    { x: 350, y: 245, z: 10, scale: 1.1 },  // 11: manu (muscle front-center-right)
    { x: 285, y: 245, z: 10, scale: 1.1 },  // 12: maca (volleyball front-center-left)
    { x: 220, y: 240, z: 9, scale: 1.08 },  // 13: juan (microwave front-left)
    { x: 160, y: 225, z: 8, scale: 1.05 },  // 14: josu (paneton left foreground)
    { x: 95,  y: 195, z: 7, scale: 1.05 },  // 15: joseluis (3d printer left foreground)
    { x: 250, y: 55,  z: 1, scale: 0.82 },  // 16: paloma (dove, perched near timber behind)
    { x: 380, y: 55,  z: 1, scale: 0.82 },  // 17: silvia (shoe, near cabin)
  ];

  // Populate Campfire Stage (Characters placed directly on the soil encircling the fire!)
  const campfireArc = document.getElementById("campfireCharactersArc");
  function renderCampfireCharacters() {
    if (!campfireArc) return;
    campfireArc.innerHTML = "";
    CHARS.forEach((c, i) => {
      const spot = CAMPFIRE_SPOTS[i] || { x: 300, y: 150, z: 5, scale: 1.0 };
      const d = document.createElement("div");
      const isSel = i === GameState.charIdx;
      d.className = `campfire-char-node ${isSel ? "active-hero" : ""}`;
      d.dataset.idx = i;
      d.title = `${c.name} (${c.form})`;

      // Position character on the campsite ground
      d.style.left = `${spot.x}px`;
      d.style.top = `${spot.y}px`;
      d.style.zIndex = spot.z;
      d.style.setProperty("--base-scale", spot.scale);

      const av = getCharacterAvatar(c.id);
      const spriteHtml = av
        ? `<img src="${av}" class="campfire-sprite-img" alt="${c.name}">`
        : `<span class="campfire-sprite-emoji">${c.emoji}</span>`;

      d.innerHTML = `
        <div class="campfire-p1-tag ${isSel ? "" : "hidden"}">▼ P1</div>
        ${spriteHtml}
        <div class="campfire-ground-shadow"></div>
      `;

      d.addEventListener("click", (e) => {
        e.stopPropagation();
        GameState.charIdx = i;
        GameState.P.ball = false;
        GameState.P.roll = 0;
        GameState.P.slide = 0;
        anim.lock = null;
        anim.name = "idle";
        anim.frame = 0;
        anim.t = 0;
        GameState.switchBanner = 1.6;
        updateSpotlight();
        try { sfx(700, 0.08, "square"); } catch (err) {}
      });

      campfireArc.appendChild(d);
    });

    // Populate rising fire embers
    const embersContainer = document.getElementById("bonfireEmbers");
    if (embersContainer && embersContainer.children.length === 0) {
      for (let e = 0; e < 12; e++) {
        const spark = document.createElement("div");
        spark.className = "fire-spark";
        spark.style.left = `${Math.random() * 80 - 40}px`;
        spark.style.animationDelay = `${(Math.random() * 2.5).toFixed(2)}s`;
        spark.style.animationDuration = `${(1.8 + Math.random() * 1.5).toFixed(2)}s`;
        embersContainer.appendChild(spark);
      }
    }
  }
  renderCampfireCharacters();

  // Populate team selector (18 characters in modal)
  CHARS.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "tcell";
    d.dataset.i = i;
    const av = getCharacterAvatar(c.id);
    const avHtml = av
      ? `<div class="em"><img src="${av}" class="team-avatar-img" alt="${c.name}"></div>`
      : `<div class="em">${c.emoji}</div>`;
    d.innerHTML = `
      ${avHtml}
      <div class="nm">${c.name}</div>
      <div class="fm">${c.form}</div>
    `;
    d.addEventListener("click", () => {
      GameState.charIdx = i;
      GameState.P.ball = false;
      GameState.P.roll = 0;
      GameState.P.slide = 0;
      anim.lock = null;
      anim.name = "idle";
      anim.frame = 0;
      anim.t = 0;
      GameState.switchBanner = 1.6;
      updateSpotlight();
      toggleTeam(true);
      sfx(700, 0.08);
    });
    teamGrid.appendChild(d);
  });

  updateSpotlight();

  function toggleTeam(forceClose) {
    const currentlyOpen = !teamOv.classList.contains("hidden");
    const wantOpen = forceClose ? false : !currentlyOpen;
    teamOv.classList.toggle("hidden", !wantOpen);
    GameState.teamOpen = wantOpen;
    if (wantOpen) {
      updateSpotlight();
    }
  }

  if (teamClose) teamClose.addEventListener("click", () => toggleTeam(true));
  if (btnChangeChar) btnChangeChar.addEventListener("click", () => toggleTeam(false));

  const btnOpenMapMenu = document.getElementById("btnOpenMapMenu");
  if (btnOpenMapMenu) {
    btnOpenMapMenu.addEventListener("click", () => {
      menuOv.classList.add("hidden");
      if (onOpenMap) onOpenMap();
    });
  }

  const btnHeroPrev = document.getElementById("btnHeroPrev");
  const btnHeroNext = document.getElementById("btnHeroNext");
  btnHeroPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    switchChar(-1);
    updateSpotlight();
    try { sfx(880, 0.08); } catch (err) {}
  });
  btnHeroNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    switchChar(1);
    updateSpotlight();
    try { sfx(880, 0.08); } catch (err) {}
  });

  // Leaderboard Modal logic (Cloudflare D1)
  async function renderLeaderboardModal() {
    if (!lbModalContent) return;
    lbModalContent.innerHTML = `<div style="color:var(--cyan);padding:24px;font-size:13px;">⚡ Consultando base de datos Cloudflare D1...</div>`;
    const list = await fetchGlobalLeaderboard();

    if (!list || list.length === 0) {
      lbModalContent.innerHTML = `
        <div style="color:var(--text-muted);padding:30px;line-height:1.6;">
          🏆 ¡Sé el primero en la clasificación!<br>
          Completa la misión o derrota al Boss para registrar tu récord mundial.
        </div>
      `;
      return;
    }

    let html = `
      <table class="lb">
        <thead>
          <tr>
            <th>#</th>
            <th>JUGADOR</th>
            <th>PERSONAJE</th>
            <th>PUNTOS</th>
            <th>TIEMPO</th>
            <th>RANGO</th>
          </tr>
        </thead>
        <tbody>
    `;

    list.slice(0, 50).forEach((item, idx) => {
      const isMe = (item.name || item.n) === GameState.playerName;
      const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : (idx + 1);
      const charObj = CHARS.find(c => c.id === (item.character || item.c));
      const charDisplay = charObj ? `${charObj.emoji} ${charObj.name}` : (item.char_name || item.character || "🪰");

      html += `
        <tr class="${isMe ? "me" : ""}">
          <td style="font-weight:bold;">${medal}</td>
          <td style="color:#fff;font-weight:bold;">${item.name || item.n}</td>
          <td>${charDisplay}</td>
          <td style="color:var(--lime);font-weight:bold;">${Number(item.score || item.s).toLocaleString()}</td>
          <td>${fmtT(item.time_seconds || item.t || 0)}</td>
          <td style="color:var(--amber);font-weight:bold;">${item.rank || item.r || "C"}</td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    lbModalContent.innerHTML = html;
  }

  function openLeaderboard() {
    lbOv.classList.remove("hidden");
    renderLeaderboardModal();
    sfx(600, 0.08);
  }

  function closeLeaderboard() {
    lbOv.classList.add("hidden");
    sfx(400, 0.06);
  }

  if (btnOpenLB) btnOpenLB.addEventListener("click", openLeaderboard);
  if (btnCloseLB) btnCloseLB.addEventListener("click", closeLeaderboard);
  if (btnRefreshLB) btnRefreshLB.addEventListener("click", () => {
    sfx(700, 0.06);
    renderLeaderboardModal();
  });

  // Controls Modal
  if (btnOpenCtrl) btnOpenCtrl.addEventListener("click", () => {
    ctrlOv.classList.remove("hidden");
    sfx(600, 0.08);
  });
  if (btnCloseCtrl) btnCloseCtrl.addEventListener("click", () => {
    ctrlOv.classList.add("hidden");
    sfx(400, 0.06);
  });

  // Start game from Menu: Opens the 5-World Adventure Map!
  function triggerStart() {
    const rawName = (nameInput.value.trim() || "ANON").toUpperCase().slice(0, 12);
    GameState.playerName = rawName;
    try {
      localStorage.setItem("clevergy_player_name", rawName);
    } catch (e) {}

    menuOv.classList.add("hidden");
    bootOv.classList.add("hidden");
    lbOv.classList.add("hidden");
    ctrlOv.classList.add("hidden");
    teamOv.classList.add("hidden");

    onStartGame();
  }

  if (btnPlay) btnPlay.addEventListener("click", triggerStart);

  // Terminal boot story replay
  let bootI = 0;
  function bootStep() {
    if (bootOv.classList.contains("hidden")) return;
    if (bootI < BOOT_LINES.length) {
      const raw = BOOT_LINES[bootI++];
      bootTxt.innerHTML += raw.replace(/##(.*?)##/g, '<span class="err">$1</span>') + "\n";
      sfx(raw.includes("##") ? 180 : 700, 0.04, "square", 0.03);
      setTimeout(bootStep, raw === "" ? 150 : raw.includes("##") ? 480 : 170);
    }
  }

  if (btnOpenStory) {
    btnOpenStory.addEventListener("click", () => {
      bootOv.classList.remove("hidden");
      bootI = 0;
      bootTxt.innerHTML = "";
      bootStep();
    });
  }

  if (pressSkipStory) {
    pressSkipStory.addEventListener("click", () => {
      bootOv.classList.add("hidden");
    });
  }

  // Keyboard shortcut listener for menu (Enter starts game, Esc closes modals)
  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      if (!lbOv.classList.contains("hidden")) closeLeaderboard();
      if (!ctrlOv.classList.contains("hidden")) ctrlOv.classList.add("hidden");
      if (!teamOv.classList.contains("hidden")) toggleTeam(true);
      if (!bootOv.classList.contains("hidden")) bootOv.classList.add("hidden");
    }
    if (e.code === "Enter" && !menuOv.classList.contains("hidden") && lbOv.classList.contains("hidden") && ctrlOv.classList.contains("hidden") && teamOv.classList.contains("hidden")) {
      triggerStart();
    }
  });

  // Game over and win handlers
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      document.getElementById("goOv").classList.add("hidden");
      GameState.P.hp = 5;
      GameState.score = Math.max(0, GameState.score - 300);
      respawn();
      GameState.P.inv = 2;
      GameState.status = "play";
      anim.lock = null;
      anim.name = "idle";
      anim.frame = 0;
      anim.t = 0;
    });
  }

  const btnWinMap = document.getElementById("btnWinMap");
  const btnWinNextWorld = document.getElementById("btnWinNextWorld");
  const btnGoMap = document.getElementById("btnGoMap");

  if (btnWinMap) {
    btnWinMap.addEventListener("click", () => {
      document.getElementById("winOv").classList.add("hidden");
      if (onOpenMap) onOpenMap();
    });
  }

  if (btnWinNextWorld) {
    btnWinNextWorld.addEventListener("click", () => {
      document.getElementById("winOv").classList.add("hidden");
      if (onNextWorld) onNextWorld();
    });
  }

  if (btnGoMap) {
    btnGoMap.addEventListener("click", () => {
      document.getElementById("goOv").classList.add("hidden");
      if (onOpenMap) onOpenMap();
    });
  }

  const btnGbMap = document.getElementById("btnGbMap");
  if (btnGbMap) {
    btnGbMap.addEventListener("click", () => {
      if (onOpenMap) onOpenMap();
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  if (winToMenuBtn) {
    winToMenuBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  if (goBackMenuBtn) {
    goBackMenuBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  return { toggleTeam, tryStart: triggerStart, updateSpotlight };
}
