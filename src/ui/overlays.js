import { BOOT_LINES } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { GameState, respawn, fmtT, switchToChar } from "../game/state.js";
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
  const teamOv = document.getElementById("teamOv");
  const teamGrid = document.getElementById("teamGrid");
  const teamClose = document.getElementById("teamClose");
  const bootOv = document.getElementById("bootOv");
  const bootTxt = document.getElementById("bootTxt");
  const pressSkipStory = document.getElementById("pressSkipStory");

  const lbOv = document.getElementById("lbOv");
  const lbModalContent = document.getElementById("lbModalContent");
  const btnCloseLB = document.getElementById("btnCloseLB");
  const btnRefreshLB = document.getElementById("btnRefreshLB");

  const ctrlOv = document.getElementById("ctrlOv");
  const btnCloseCtrl = document.getElementById("btnCloseCtrl");

  const retryBtn = document.getElementById("retryBtn");
  const restartBtn = document.getElementById("restartBtn");
  const winToMenuBtn = document.getElementById("winToMenuBtn");
  const goBackMenuBtn = document.getElementById("goBackMenuBtn");

  // Mobile Quick Touch Bar of 18 Heroes (Right above the D-Pad)
  const gbTouchBarTrack = document.getElementById("gbTouchBarTrack");
  const touchbarActiveName = document.getElementById("touchbarActiveName");

  function renderTouchBar() {
    if (!gbTouchBarTrack) return;
    gbTouchBarTrack.innerHTML = "";

    CHARS.forEach((c, i) => {
      const chip = document.createElement("div");
      const isCur = i === GameState.charIdx;
      chip.className = `gb-touch-chip ${isCur ? "active" : ""}`;
      chip.dataset.idx = i;
      chip.title = `${c.name} (${c.ab})`;

      const av = getCharacterAvatar(c.id);
      const iconHtml = av
        ? `<img src="${av}" class="touch-chip-img" alt="${c.name}">`
        : `<span class="touch-chip-emoji">${c.emoji}</span>`;

      chip.innerHTML = `
        <div class="touch-chip-avatar">${iconHtml}</div>
        <span class="touch-chip-name">${c.name.split(" ")[0]}</span>
      `;

      // Pointerdown for ultra-fast instant tactile switch without 300ms click delay
      chip.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchToChar(i);
        updateSpotlight();
      });

      gbTouchBarTrack.appendChild(chip);
    });
  }
  renderTouchBar();

  function updateTouchBarActive(charIdx) {
    if (!gbTouchBarTrack) return;
    const chips = gbTouchBarTrack.querySelectorAll(".gb-touch-chip");
    chips.forEach((ch, idx) => {
      const isAct = idx === charIdx;
      ch.classList.toggle("active", isAct);
      if (isAct) {
        ch.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
    const c = CHARS[charIdx];
    if (touchbarActiveName && c) {
      touchbarActiveName.textContent = `${c.name.toUpperCase()} · ✦ ${c.ab}`;
    }
  }

  window.addEventListener("char_switched", (e) => {
    const charIdx = e.detail?.charIdx ?? GameState.charIdx;
    updateTouchBarActive(charIdx);
    updateSpotlight();
  });

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
    if (spotlightForm) spotlightForm.textContent = `FORMA: ${c.form.toUpperCase()}`;
    if (spotlightAb) spotlightAb.textContent = `✦ HABILIDAD: ${c.ab.toUpperCase()}`;
    if (spotlightTip) spotlightTip.textContent = c.tip;

    if (barSpd) barSpd.style.width = Math.min(100, Math.max(20, (c.spd / 5.4) * 100)) + "%";
    if (barJump) barJump.style.width = Math.min(100, Math.max(20, (c.jump / 12) * 100)) + "%";

    const campfireArc = document.getElementById("campfireCharactersArc");
    if (campfireArc) {
      [...campfireArc.children].forEach((el, i) => {
        const isSel = i === GameState.charIdx;
        el.classList.toggle("active-hero", isSel);
        const tag = el.querySelector(".campfire-p1-tag");
        if (tag) tag.classList.toggle("hidden", !isSel);
      });
    }

    const activeCardName = document.getElementById("campfireActiveName");
    const activeCardAb = document.getElementById("campfireActiveAb");
    if (activeCardName) activeCardName.textContent = c.name.toUpperCase();
    if (activeCardAb) activeCardAb.textContent = `✦ ${c.ab.toUpperCase()}`;

    updateTouchBarActive(GameState.charIdx);
  }

  // Exact coordinates for characters encircling the campfire on the illuminated ground (630x300 canvas)
  const CAMPFIRE_SPOTS = [
    { x: 195, y: 125, z: 4, scale: 0.95 },  // 0: alejandro (fly left-mid)
    { x: 420, y: 130, z: 4, scale: 0.95 },  // 1: ale (oil right-mid)
    { x: 260, y: 102, z: 3, scale: 0.9 },   // 2: alvaroM (calculator back-left)
    { x: 375, y: 100, z: 3, scale: 0.9 },   // 3: alvaroP (mic back-right)
    { x: 318, y: 88,  z: 2, scale: 0.88 },  // 4: ana (lioness back-center)
    { x: 215, y: 80,  z: 2, scale: 0.86 },  // 5: beltran (bell back-left-high)
    { x: 480, y: 155, z: 5, scale: 0.98 },  // 6: bruno (mask right flank)
    { x: 140, y: 150, z: 5, scale: 0.98 },  // 7: gonzalo (totem left flank)
    { x: 490, y: 210, z: 7, scale: 1.05 },  // 8: javi (broccoli right foreground)
    { x: 450, y: 235, z: 8, scale: 1.08 },  // 9: jesus (hammer front-right)
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
        switchToChar(i);
        updateSpotlight();
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

  // Populate complete team selector
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
      switchToChar(i);
      updateTeamShowcase(i);
      updateSpotlight();
      sfx(700, 0.08);
    });
    teamGrid.appendChild(d);
  });

  // Team Showcase Carousel elements
  let showcaseCharIdx = 0;
  const teamHeroAvatar = document.getElementById("teamHeroAvatar");
  const teamHeroName = document.getElementById("teamHeroName");
  const teamHeroForm = document.getElementById("teamHeroForm");
  const teamHeroAb = document.getElementById("teamHeroAb");
  const teamHeroTip = document.getElementById("teamHeroTip");
  const teamBarPwr = document.getElementById("teamBarPwr");
  const teamBarSpd = document.getElementById("teamBarSpd");
  const teamBarFly = document.getElementById("teamBarFly");
  const teamBarChaos = document.getElementById("teamBarChaos");
  const teamActiveImg = document.getElementById("teamActiveImg");
  const teamActiveName = document.getElementById("teamActiveName");
  const teamActiveAb = document.getElementById("teamActiveAb");

  function updateTeamShowcase(cIdx) {
    showcaseCharIdx = (cIdx + CHARS.length) % CHARS.length;
    const c = CHARS[showcaseCharIdx];
    if (!c) return;

    if (teamHeroAvatar) {
      const av = getCharacterAvatar(c.id);
      teamHeroAvatar.innerHTML = av ? `<img src="${av}" class="team-showcase-img" alt="${c.name}">` : c.emoji;
    }
    if (teamHeroName) teamHeroName.textContent = `${showcaseCharIdx + 1}. ${c.name}`;
    if (teamHeroForm) teamHeroForm.textContent = c.form;
    if (teamHeroAb) teamHeroAb.textContent = c.ab;
    if (teamHeroTip) teamHeroTip.textContent = c.tip;

    if (teamActiveImg) teamActiveImg.src = getCharacterAvatar(c.id) || "";
    if (teamActiveName) teamActiveName.textContent = c.name.toUpperCase();
    if (teamActiveAb) teamActiveAb.textContent = `✦ ${c.ab.toUpperCase()} (${c.form})`;

    // Segmented stats
    if (teamBarSpd) teamBarSpd.style.width = Math.min(100, Math.max(20, (c.spd / 5.4) * 100)) + "%";
    if (teamBarFly) teamBarFly.style.width = Math.min(100, Math.max(20, (c.jump / 12) * 100)) + "%";
    if (teamBarPwr) teamBarPwr.style.width = ((c.id === "alejandro" || c.id === "manu" || c.id === "jesus") ? 95 : 65) + "%";
    if (teamBarChaos) teamBarChaos.style.width = ((c.id === "bruno" || c.id === "maca" || c.id === "pablo") ? 95 : 55) + "%";

    if (teamGrid) {
      [...teamGrid.children].forEach((el, i) => {
        el.classList.toggle("sel", i === showcaseCharIdx);
      });
    }
  }

  const teamHeroPrev = document.getElementById("teamHeroPrev");
  const teamHeroNext = document.getElementById("teamHeroNext");
  teamHeroPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    updateTeamShowcase(showcaseCharIdx - 1);
    switchToChar(showcaseCharIdx);
    updateSpotlight();
    try { sfx(660, 0.06); } catch (e) {}
  });
  teamHeroNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    updateTeamShowcase(showcaseCharIdx + 1);
    switchToChar(showcaseCharIdx);
    updateSpotlight();
    try { sfx(660, 0.06); } catch (e) {}
  });

  updateTeamShowcase(0);

  function toggleTeam(forceClose) {
    const currentlyOpen = !teamOv.classList.contains("hidden");
    const wantOpen = forceClose ? false : !currentlyOpen;
    teamOv.classList.toggle("hidden", !wantOpen);
    GameState.teamOpen = wantOpen;
    if (wantOpen) {
      updateTeamShowcase(GameState.charIdx);
    }
  }

  if (teamClose) {
    teamClose.addEventListener("click", () => {
      toggleTeam(true);
      try { sfx(880, 0.1, "triangle"); } catch (e) {}
    });
  }
  if (btnChangeChar) btnChangeChar.addEventListener("click", () => toggleTeam(false));

  const btnOpenMapMenu = document.getElementById("btnOpenMapMenu");
  if (btnOpenMapMenu) {
    btnOpenMapMenu.addEventListener("click", () => {
      menuOv.classList.add("hidden");
      if (onOpenMap) onOpenMap();
    });
  }

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

  // 08. PAUSE OVERLAY HANDLERS
  const pauseOv = document.getElementById("pauseOv");
  const btnResumeGame = document.getElementById("btnResumeGame");
  const btnRestartLevel = document.getElementById("btnRestartLevel");
  const btnPauseTeam = document.getElementById("btnPauseTeam");
  const btnPauseCtrl = document.getElementById("btnPauseCtrl");
  const btnPauseExit = document.getElementById("btnPauseExit");

  function togglePause(forceOpen) {
    if (!pauseOv) return;
    const isCurrentlyPaused = !pauseOv.classList.contains("hidden");
    const wantPause = forceOpen !== undefined ? forceOpen : !isCurrentlyPaused;
    pauseOv.classList.toggle("hidden", !wantPause);

    if (wantPause) {
      GameState.prevStatusBeforePause = GameState.status;
      GameState.status = "pause";
      try { sfx(440, 0.08, "square"); } catch (e) {}
    } else {
      GameState.status = GameState.prevStatusBeforePause || "play";
      try { sfx(660, 0.08, "triangle"); } catch (e) {}
    }
  }

  btnResumeGame?.addEventListener("click", () => togglePause(false));
  btnRestartLevel?.addEventListener("click", () => {
    togglePause(false);
    respawn();
    GameState.P.hp = 5;
    GameState.status = "play";
  });
  btnPauseTeam?.addEventListener("click", () => {
    toggleTeam(false);
  });
  btnPauseCtrl?.addEventListener("click", () => {
    if (ctrlOv) ctrlOv.classList.remove("hidden");
  });
  btnPauseExit?.addEventListener("click", () => {
    togglePause(false);
    window.location.reload();
  });

  // 05. LEVEL BRIEFING CARD HANDLERS
  const levelBriefingModal = document.getElementById("levelBriefingModal");
  const bfWorldTag = document.getElementById("bfWorldTag");
  const bfLevelTitle = document.getElementById("bfLevelTitle");
  const bfReqIcon = document.getElementById("bfReqIcon");
  const bfReqTxt = document.getElementById("bfReqTxt");
  const bfReqDesc = document.getElementById("bfReqDesc");
  const bfBtnPlay = document.getElementById("bfBtnPlay");
  const bfBtnBack = document.getElementById("bfBtnBack");

  let onBriefingPlayCallback = null;
  function showLevelBriefing(w, onPlay) {
    if (!levelBriefingModal) {
      if (onPlay) onPlay();
      return;
    }
    onBriefingPlayCallback = onPlay;

    const reqs = {
      1: { icon: "🧗", txt: "ESCALAR PAREDES (ANA / JOSU)", desc: "Supera los bugs 404, escala las paredes de contención y alcanza el servidor central." },
      2: { icon: "🥊", txt: "ROMPER OBSTÁCULOS (ALEJANDRO / JESÚS)", desc: "Abrete paso entre la jungla de APIs y corta las conexiones bloqueadas." },
      3: { icon: "🏃", txt: "VELOCIDAD Y VUELO (SILVIA / PALOMA)", desc: "Circuito contra reloj para entregar el sprint antes del cierre de Q4." },
      4: { icon: "⚡", txt: "ESCUDO Y REFLEJOS (BELTRÁN / JUAN)", desc: "Resiste los ataques de la All-Hands eterna y esquiva los micrófonos abiertos." },
      5: { icon: "✦", txt: "TRABAJO EN EQUIPO (TODO EL EQUIPO)", desc: "El gran reto final en la nieve. Utiliza las 3 habilidades para vencer a The Deadline." },
      6: { icon: "🥊", txt: "COMBATE 1v1 (TU MEJOR COMPAÑERO)", desc: "Pelea de código en el cuadrilátero contra la CPU o un compañero online." }
    };
    const req = reqs[w.id] || reqs[1];

    if (bfWorldTag) bfWorldTag.textContent = `MUNDO ${w.id} - ${w.name.toUpperCase()}`;
    if (bfLevelTitle) bfLevelTitle.textContent = `NIVEL 01: ${w.subtitle ? w.subtitle.toUpperCase() : "EXPEDICIÓN"}`;
    if (bfReqIcon) bfReqIcon.textContent = req.icon;
    if (bfReqTxt) bfReqTxt.textContent = req.txt;
    if (bfReqDesc) bfReqDesc.textContent = req.desc;

    levelBriefingModal.classList.remove("hidden");
    try { sfx(700, 0.08, "triangle"); } catch (e) {}
  }

  bfBtnPlay?.addEventListener("click", () => {
    levelBriefingModal?.classList.add("hidden");
    if (onBriefingPlayCallback) onBriefingPlayCallback();
  });
  bfBtnBack?.addEventListener("click", () => {
    levelBriefingModal?.classList.add("hidden");
  });

  // 09. LEVEL COMPLETED & MVP CALCULATION
  window.addEventListener("level_completed", () => {
    updateWinScreenMVP();
  });
  function updateWinScreenMVP() {
    const winTimeTxt = document.getElementById("winTimeTxt");
    const winRetosTxt = document.getElementById("winRetosTxt");
    const winCharsTxt = document.getElementById("winCharsTxt");
    const winSwitchesTxt = document.getElementById("winSwitchesTxt");
    const winMvpImg = document.getElementById("winMvpImg");
    const winMvpName = document.getElementById("winMvpName");
    const winMvpStat = document.getElementById("winMvpStat");

    if (winTimeTxt) winTimeTxt.textContent = `⏱️ ${(GameState.gameTime || 0).toFixed(2)}s`;
    if (winRetosTxt) winRetosTxt.textContent = `3 / 3 ⭐`;
    if (winCharsTxt) winCharsTxt.textContent = `3 / 3`;
    if (winSwitchesTxt) winSwitchesTxt.textContent = String(GameState.levelSwitches || 8);

    // Calculate MVP based on GameState.charUsage
    let maxUsage = 0;
    let mvpCharId = "alejandro";
    Object.entries(GameState.charUsage || {}).forEach(([id, count]) => {
      if (count > maxUsage) {
        maxUsage = count;
        mvpCharId = id;
      }
    });

    const mvpChar = CHARS.find(c => c.id === mvpCharId) || CHARS[GameState.charIdx] || CHARS[0];
    if (winMvpImg) winMvpImg.src = getCharacterAvatar(mvpChar.id) || "";
    if (winMvpName) winMvpName.textContent = mvpChar.name;
    if (winMvpStat) winMvpStat.textContent = `Usado/a ${Math.max(1, maxUsage)} veces en momentos clave`;
  }

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

  return {
    toggleTeam,
    tryStart: triggerStart,
    updateSpotlight,
    togglePause,
    showLevelBriefing,
    updateWinScreenMVP
  };
}
