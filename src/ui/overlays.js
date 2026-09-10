import { BOOT_LINES } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { WORLDS } from "../config/worlds.js";
import { GameState, respawn, fmtT, switchToChar } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { ANIM, SPR, anim, getCharacterAvatar } from "../engine/sprites.js";
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

  // Touchbar de compañeros en el teclado táctil (encima de la cruceta)
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
    const profilePlayerName = document.getElementById("profilePlayerName");
    if (profilePlayerName) profilePlayerName.textContent = c.name.toUpperCase();

    // Side dossier: Form in uppercase, Skill in cyan, and numerical stats
    if (spotlightName) spotlightName.textContent = c.form.toUpperCase();
    if (spotlightForm) spotlightForm.textContent = `FORMA: ${c.form.toUpperCase()}`;
    if (spotlightAb) spotlightAb.textContent = c.ab.toUpperCase();
    if (spotlightTip) spotlightTip.textContent = c.tip;

    const statAtkVal = document.getElementById("statAtkVal");
    const statSpdVal = document.getElementById("statSpdVal");
    const statHpVal = document.getElementById("statHpVal");
    if (statAtkVal) statAtkVal.textContent = Math.round(c.spd * 16 + (c.jump > 9 ? 15 : 8));
    if (statSpdVal) statSpdVal.textContent = Math.round((c.spd / 5.2) * 100);
    if (statHpVal) statHpVal.textContent = Math.round(70 + (c.jump * 2.5));

    if (barSpd) barSpd.style.width = Math.min(100, Math.max(20, (c.spd / 5.4) * 100)) + "%";
    if (barJump) barJump.style.width = Math.min(100, Math.max(20, (c.jump / 12) * 100)) + "%";

    // Update Mobile Controller Deck Action Labels: A -> SALTAR, B -> [HABILIDAD]
    const gbLabelB = document.getElementById("gbLabelB");
    if (gbLabelB) {
      const actionNames = {
        ana: "TREPAR",
        alejandro: "PUÑO",
        paloma: "VOLAR",
        beltran: "ESTOCADA",
        alvaroM: "CALCULAR",
        alvaroP: "PODCAST",
        ale: "DESLIZAR",
        bruno: "TÓTEM",
        gonzalo: "CLONAR",
        javi: "MARCHA",
        jesus: "SMASH",
        joseluis: "IMPRIMIR",
        josu: "REBOTE",
        juan: "CALENTAR",
        maca: "MATE",
        manu: "PISOTÓN",
        pablo: "RODAR",
        silvia: "SPEEDRUN"
      };
      gbLabelB.textContent = actionNames[c.id] || c.ab.split(" ")[0].toUpperCase();
    }
    const gbLabelA = document.getElementById("gbLabelA");
    if (gbLabelA) gbLabelA.textContent = "SALTAR";

    updateTouchBarActive(GameState.charIdx);
  }

  // =========================================================================
  // STUMBLE GUYS LOBBY HERO ANIMATOR & INTERACTIVE POSES
  // =========================================================================
  const stumbleHeroCanvas = document.getElementById("stumbleHeroCanvas");
  const stumbleHeroCtx = stumbleHeroCanvas ? stumbleHeroCanvas.getContext("2d") : null;
  const stumbleCharShadow = document.getElementById("stumbleCharShadow");
  const stumblePoseDock = document.getElementById("stumblePoseDock");
  const stumbleCharViewport = document.getElementById("stumbleCharViewport");
  const btnCharPrev = document.getElementById("btnCharPrev");
  const btnCharNext = document.getElementById("btnCharNext");
  const btnOpenCustomize = document.getElementById("btnOpenCustomize");
  const btnHeaderCompendium = document.getElementById("btnHeaderCompendium");
  const btnOpenArenaQuick = document.getElementById("btnOpenArenaQuick");
  const stumblePassCard = document.getElementById("stumblePassCard");

  let lobbyPose = "idle"; // "idle" | "run" | "attack" | "jump" | "victory"
  let lobbyPoseTime = 0;
  let lobbyLockPose = null;
  let lobbyLockT = 0;

  function setLobbyPose(pose, lockDuration = 0) {
    lobbyPose = pose;
    lobbyPoseTime = 0;
    if (lockDuration > 0) {
      lobbyLockPose = pose;
      lobbyLockT = lockDuration;
    }
    if (stumblePoseDock) {
      const pills = stumblePoseDock.querySelectorAll(".action-dock-item, .pose-chip, .stumble-pose-pill");
      pills.forEach((p) => p.classList.toggle("active", p.dataset.pose === pose));
    }
  }

  // Navigation: cycle character
  function cycleHero(dir) {
    const nextIdx = (GameState.charIdx + dir + CHARS.length) % CHARS.length;
    switchToChar(nextIdx);
    updateSpotlight();
    sfx(650, 0.05);
    setLobbyPose("idle");
  }

  if (btnCharPrev) {
    btnCharPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      cycleHero(-1);
    });
  }
  if (btnCharNext) {
    btnCharNext.addEventListener("click", (e) => {
      e.stopPropagation();
      cycleHero(1);
    });
  }



  // Pose buttons
  if (stumblePoseDock) {
    const pills = stumblePoseDock.querySelectorAll(".action-dock-item, .pose-chip, .stumble-pose-pill");
    pills.forEach((p) => {
      p.addEventListener("click", (e) => {
        e.stopPropagation();
        const pName = p.dataset.pose;
        setLobbyPose(pName, pName === "attack" || pName === "jump" ? 1.4 : 0);
        if (pName === "attack") sfx(220, 0.1, "triangle", 0.08);
        else if (pName === "jump") sfx(520, 0.08, "square", 0.06);
        else sfx(600, 0.04);
      });
    });
  }

  // Swipe left/right gesture or tap reaction anywhere on hero stage
  const stageSwipeTarget = document.querySelector(".hero-stage-container") || stumbleCharViewport;
  if (stageSwipeTarget) {
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerActive = false;

    stageSwipeTarget.addEventListener("pointerdown", (e) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerActive = true;
    });

    stageSwipeTarget.addEventListener("pointerup", (e) => {
      if (!pointerActive) return;
      pointerActive = false;
      const dx = e.clientX - pointerStartX;
      const dy = e.clientY - pointerStartY;
      if (Math.abs(dx) > 26 && Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe -> cycle character
        if (dx < 0) cycleHero(1);
        else cycleHero(-1);
      }
    });

    stageSwipeTarget.addEventListener("pointercancel", () => {
      pointerActive = false;
    });
  }

  // Stumble Pass click
  if (stumblePassCard) {
    stumblePassCard.addEventListener("click", () => {
      sfx(750, 0.1);
      alert("⭐ ¡CLEVERGY PASS!\nNivel 8 alcanzado (45/60 estrellas).\nSupera mundos y encuentra tazas de café para desbloquear compañeros.");
    });
  }

  // Customize / Equipo button -> opens Compendium directly on Personajes
  if (btnOpenCustomize) {
    btnOpenCustomize.addEventListener("click", () => {
      openCompendium();
      const charTabBtn = compendiumOv?.querySelector('.comp-tab-btn[data-tab="characters"]');
      if (charTabBtn) charTabBtn.click();
    });
  }

  // Header News / Compendium
  if (btnHeaderCompendium) {
    btnHeaderCompendium.addEventListener("click", openCompendium);
  }

  // 1v1 Arena shortcut
  if (btnOpenArenaQuick) {
    btnOpenArenaQuick.addEventListener("click", () => {
      const fightLobbyModal = document.getElementById("fightLobbyModal");
      if (fightLobbyModal) {
        fightLobbyModal.classList.remove("hidden");
        sfx(600, 0.08);
      }
    });
  }

  // Keyboard navigation for lobby (Left/Right arrows change character)
  window.addEventListener("keydown", (e) => {
    if (!menuOv.classList.contains("hidden") && (!compendiumOv || compendiumOv.classList.contains("hidden")) && (!lbOv || lbOv.classList.contains("hidden")) && (!ctrlOv || ctrlOv.classList.contains("hidden"))) {
      if (e.code === "ArrowLeft") cycleHero(-1);
      if (e.code === "ArrowRight") cycleHero(1);
    }
  });

  // Stumble Lobby Character Render Loop
  let lastLobbyFrame = performance.now();
  function renderLobbyHero(now) {
    requestAnimationFrame(renderLobbyHero);
    if (!menuOv || menuOv.classList.contains("hidden")) return;
    if (!stumbleHeroCtx || !stumbleHeroCanvas) return;

    const dt = Math.min(0.1, (now - lastLobbyFrame) / 1000);
    lastLobbyFrame = now;
    lobbyPoseTime += dt;

    // Handle locked poses
    if (lobbyLockPose) {
      lobbyLockT -= dt;
      if (lobbyLockT <= 0) {
        lobbyLockPose = null;
        setLobbyPose("idle");
      }
    }

    const c = CHARS[GameState.charIdx] || CHARS[0];
    const rec = ANIM[c.id];
    const ctx = stumbleHeroCtx;
    const W = stumbleHeroCanvas.width;
    const H = stumbleHeroCanvas.height;
    ctx.clearRect(0, 0, W, H);

    // Calculate dynamic motion based on current pose
    let offsetY = 0;
    let offsetX = 0;
    let scaleX = 1;
    let scaleY = 1;
    let rot = 0;
    let shadowScale = 1;
    let shadowOpacity = 0.85;

    if (lobbyPose === "idle") {
      offsetY = 0;
      scaleY = 1;
      scaleX = 1;
      shadowScale = 1;
    } else if (lobbyPose === "run") {
      const step = Math.sin(lobbyPoseTime * 14);
      offsetY = -Math.abs(step) * 14;
      rot = step * 0.09;
      scaleX = 1 + Math.abs(step) * 0.04;
      shadowScale = 1 - Math.abs(step) * 0.25;
      shadowOpacity = 0.55;
    } else if (lobbyPose === "attack") {
      const atkPhase = Math.sin(Math.min(Math.PI, lobbyPoseTime * 6));
      offsetX = atkPhase * 16;
      offsetY = -atkPhase * 8;
      scaleX = 1 + atkPhase * 0.12;
      scaleY = 1 - atkPhase * 0.06;
      shadowScale = 1.1;
    } else if (lobbyPose === "jump") {
      const jProg = Math.sin(Math.min(Math.PI, lobbyPoseTime * 3.5));
      offsetY = -jProg * 50;
      scaleY = 1 + (1 - jProg) * 0.15;
      shadowScale = 1 - jProg * 0.45;
      shadowOpacity = Math.max(0.2, 0.85 - jProg * 0.6);
    } else if (lobbyPose === "victory") {
      const bnc = Math.abs(Math.sin(lobbyPoseTime * 8));
      offsetY = -bnc * 20;
      rot = Math.sin(lobbyPoseTime * 6) * 0.1;
      scaleY = 1 + bnc * 0.08;
      shadowScale = 1 - bnc * 0.2;
    }

    // Update floor shadow beneath character
    if (stumbleCharShadow) {
      stumbleCharShadow.style.transform = `scale(${shadowScale.toFixed(2)})`;
      stumbleCharShadow.style.opacity = shadowOpacity.toFixed(2);
    }

    // Ground level aligned precisely with the circular podium surface
    const groundY = 352;

    ctx.save();
    ctx.translate(W / 2 + offsetX, groundY + offsetY);
    ctx.rotate(rot);
    ctx.scale(scaleX, scaleY);

    // Draw high-res pose image if available
    let drawn = false;
    if (rec && rec.ready && rec.images) {
      let imgList = null;
      if (lobbyPose === "attack") imgList = rec.images.attack || rec.images.run || rec.images.idle;
      else if (lobbyPose === "run") imgList = rec.images.run || rec.images.walk || rec.images.idle;
      else if (lobbyPose === "jump") imgList = rec.images.jump || rec.images.run || rec.images.idle;
      else if (lobbyPose === "victory") imgList = rec.images.attack || rec.images.run || rec.images.idle;
      else imgList = rec.images.idle || rec.images.walk;

      if (imgList && imgList.length > 0) {
        const frameIdx = Math.floor(lobbyPoseTime * 6) % imgList.length;
        const img = imgList[frameIdx];
        if (img && img.complete && img.naturalWidth > 0) {
          const targetH = 220;
          const ratio = targetH / img.naturalHeight;
          const targetW = img.naturalWidth * ratio;
          ctx.drawImage(img, -targetW / 2, -targetH, targetW, targetH);
          drawn = true;
        }
      }
    }

    // If no pose PNG available, draw scaled pixel art sprite
    if (!drawn) {
      const s = SPR[c.id];
      if (s && s.img) {
        const scale = 5.6;
        const sw = s.w * scale;
        const sh = s.h * scale;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(s.img, -sw / 2, -sh, sw, sh);
        drawn = true;
      }
    }

    ctx.restore();
  }
  requestAnimationFrame(renderLobbyHero);
  updateSpotlight();

  // Populate complete team selector
  if (teamGrid) {
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
  }

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
    if (!teamOv) return;
    const currentlyOpen = !teamOv.classList.contains("hidden");
    const wantOpen = forceClose ? false : !currentlyOpen;
    teamOv.classList.toggle("hidden", !wantOpen);
    GameState.teamOpen = wantOpen;
    if (wantOpen && typeof updateTeamShowcase === "function") {
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

  // =========================================================================
  // COMPENDIUM MODAL (HISTORIA, PERSONAJES, ESCENARIOS, ENEMIGOS, OBJETOS)
  // =========================================================================
  const compendiumOv = document.getElementById("compendiumOv");
  const btnOpenCompendium = document.getElementById("btnOpenCompendium");
  const btnCloseCompendium = document.getElementById("btnCloseCompendium");
  const btnBackCompendium = document.getElementById("btnBackCompendium");
  const compCharsGrid = document.getElementById("compCharsGrid");
  const compCharDossier = document.getElementById("compCharDossier");
  const compWorldsGrid = document.getElementById("compWorldsGrid");
  const compEnemiesGrid = document.getElementById("compEnemiesGrid");
  const compItemsGrid = document.getElementById("compItemsGrid");

  let compSelectedCharIdx = GameState.charIdx || 0;

  const ENEMIES_DATA = [
    {
      name: "Email Spam",
      danger: "Amenaza Básica · The Office",
      desc: "Correos urgentes y cadenas descontroladas que rebotan por los pasillos de Clevergy.",
      tip: "Salta sobre ellos o golpéalos de frente con tu ataque especial.",
      icon: "✉️",
      isBoss: false
    },
    {
      name: "Meeting '5 Minutos'",
      danger: "Interrupción Peligrosa · The Office",
      desc: "Aparece de improvisto diciendo '¿Tienes 5 minutos?' y te absorbe tiempo y energía.",
      tip: "Mantén la distancia y elimínala a tiempo antes de que empiece a hablar.",
      icon: "💬",
      isBoss: false
    },
    {
      name: "Webhook Spider",
      danger: "Trampa de Red · Integration Jungle",
      desc: "Araña cibernética que teje hilos de red y salta entre terminales de servidores.",
      tip: "Espera a que aterrice o esquívala rodando antes de asestar el golpe.",
      icon: "🕷️",
      isBoss: false
    },
    {
      name: "Scope Creep Knight",
      danger: "Acorazado Pesado · Product Kingdom",
      desc: "Caballero que añade requisitos imprevistos. Bloquea ataques frontales con su escudo.",
      tip: "Salta por detrás de su espalda o utiliza habilidades de área.",
      icon: "🛡️",
      isBoss: false
    },
    {
      name: "Meeting Ghost",
      danger: "Llamada Silenciada · Meeting Dimension",
      desc: "Pantalla de videollamada flotante en mute que desconcierta con su vuelo errático.",
      tip: "Aprovecha los momentos en los que desciende para rematarlo desde arriba.",
      icon: "🎙️",
      isBoss: false
    },
    {
      name: "Clock Demon",
      danger: "Cuenta Atrás · The Retreat",
      desc: "Reloj demoníaco cuyas manecillas giran a toda velocidad marcando el fin de plazo.",
      tip: "Calcula con precisión tus saltos para esquivar su giro cortante.",
      icon: "⏰",
      isBoss: false
    },
    // Jefes
    {
      name: "THE EMAIL CHAIN",
      danger: "JEFE MUNDO 1 · OFICINAS CLEVERGY",
      desc: "Cadena monstruosa de 200 mensajes en bucle que satura la bandeja de entrada.",
      tip: "Esquiva los correos bomba y salta sobre el servidor central para lograr Inbox Zero.",
      icon: "👾",
      isBoss: true
    },
    {
      name: "API GATEWAY BEAST",
      danger: "JEFE MUNDO 2 · SELVA DE APIS",
      desc: "Monstruo de endpoints saturados que dispara errores 500 y colapsa microservicios.",
      tip: "Súbete a las plataformas de fibra óptica para esquivar sus llamaradas de red.",
      icon: "🦎",
      isBoss: true
    },
    {
      name: "THE ROADMAP GOLEM",
      danger: "JEFE MUNDO 3 · PRODUCT KINGDOM",
      desc: "Gigante de piedra formado por bloques de prioridades inamovibles y épicas congeladas.",
      tip: "Derriba sus pilares inferiores para hacerle perder el equilibrio.",
      icon: "🗿",
      isBoss: true
    },
    {
      name: "ALL-HANDS MONSTER",
      danger: "JEFE MUNDO 4 · MEETING DIMENSION",
      desc: "El caos sonoro definitivo: 50 micrófonos con eco y pantallas compartidas a la vez.",
      tip: "Destruye los altavoces periféricos para deshabilitar su escudo acústico.",
      icon: "📺",
      isBoss: true
    },
    {
      name: "THE DEADLINE (0 DAYS)",
      danger: "JEFE FINAL DEFINITIVO · THE RETREAT",
      desc: "La cuenta atrás final que amenaza con cancelar el Retreat. ¡Salva a Clevergy!",
      tip: "Combina los poderes de todos tus compañeros para superar el sprint final.",
      icon: "🔥",
      isBoss: true
    }
  ];

  const ITEMS_DATA = [
    {
      name: "Taza de Café Clevergy",
      type: "Consumible Esencial",
      desc: "Café de especialidad recién preparado. El motor indispensable del equipo.",
      effect: "Restaura +1 Corazón de Vida y recarga la velocidad de movimiento.",
      icon: "☕"
    },
    {
      name: "Fragmentos de Código",
      type: "Coleccionable de Misión",
      desc: "Módulos de código fuente recuperados tras vencer a cada jefe del sprint.",
      effect: "Reparan el sistema y abren el camino hacia el Campamento del Retreat.",
      icon: "💎"
    },
    {
      name: "Bomba Error 404",
      type: "Proyectil Táctico",
      desc: "Operación de cálculo crítico que explota al impactar contra bugs y servidores.",
      effect: "Elimina grupos de correos y bugs en un radio considerable.",
      icon: "💣"
    },
    {
      name: "Plataforma Impresa 3D",
      type: "Herramienta de Campo",
      desc: "Estructura física generada en tiempo real por José Luis.",
      effect: "Crea hasta 3 apoyos flotantes en el aire para salvar saltos imposibles.",
      icon: "🖨️"
    },
    {
      name: "Ejército de Mini-Brócolis",
      type: "Invocación Táctica",
      desc: "Gonzalo se multiplica en pequeños aliados veloces y nutritivos.",
      effect: "Avanzan en oleada limpiando el suelo de obstáculos y enemigos.",
      icon: "🥦"
    },
    {
      name: "Multiplicador de Combo",
      type: "Mecánica de Puntuación",
      desc: "Encadenar saltos sobre enemigos consecutivos sin tocar el suelo.",
      effect: "Multiplica los puntos de x1 a x5 y llena la pantalla de fuegos artificiales.",
      icon: "⭐"
    }
  ];

  function renderCompendiumChars() {
    if (!compCharsGrid) return;
    compCharsGrid.innerHTML = "";

    CHARS.forEach((c, idx) => {
      const chip = document.createElement("div");
      const isCur = idx === compSelectedCharIdx;
      chip.className = `comp-char-chip ${isCur ? "active" : ""}`;
      chip.dataset.idx = idx;

      const av = getCharacterAvatar(c.id);
      const iconHtml = av
        ? `<img src="${av}" alt="${c.name}">`
        : `<span>${c.emoji}</span>`;

      chip.innerHTML = `
        <div class="comp-chip-avatar">${iconHtml}</div>
        <span class="comp-chip-name">${c.name.split(" ")[0]}</span>
      `;

      chip.addEventListener("click", () => {
        compSelectedCharIdx = idx;
        const allChips = compCharsGrid.querySelectorAll(".comp-char-chip");
        allChips.forEach((ch, i) => ch.classList.toggle("active", i === idx));
        renderCompendiumDossier();
        sfx(550, 0.04);
      });

      compCharsGrid.appendChild(chip);
    });
  }

  function renderCompendiumDossier() {
    if (!compCharDossier) return;
    const c = CHARS[compSelectedCharIdx] || CHARS[0];
    const isPlayingThis = compSelectedCharIdx === GameState.charIdx;

    const av = getCharacterAvatar(c.id);
    const iconHtml = av
      ? `<img src="${av}" class="dossier-avatar-img" alt="${c.name}">`
      : `<span class="dossier-avatar-emoji">${c.emoji}</span>`;

    const spdPct = Math.round(Math.min(100, Math.max(15, ((c.spd - 2) / 3.6) * 100)));
    const jumpPct = Math.round(Math.min(100, Math.max(15, ((c.jump - 8) / 3) * 100)));
    const cdPct = Math.round(Math.min(100, Math.max(15, ((2.5 - c.cd) / 2.3) * 100)));

    compCharDossier.innerHTML = `
      <div class="dossier-hero-row">
        <div class="dossier-avatar-box">${iconHtml}</div>
        <div class="dossier-meta">
          <h3 class="dossier-name">${c.emoji} ${c.name}</h3>
          <div class="dossier-form">Forma: ${c.form}</div>
          <div class="dossier-ab-pill">✦ ${c.ab}</div>
        </div>
      </div>

      <div class="dossier-stats-grid">
        <div class="dossier-stat-row">
          <span class="stat-label">VELOCIDAD</span>
          <div class="stat-track"><div class="stat-fill" style="width:${spdPct}%;background:#59d8ff;"></div></div>
          <span class="stat-val-text">${c.spd.toFixed(1)}</span>
        </div>
        <div class="dossier-stat-row">
          <span class="stat-label">SALTO</span>
          <div class="stat-track"><div class="stat-fill" style="width:${jumpPct}%;background:#ffd25e;"></div></div>
          <span class="stat-val-text">${c.jump.toFixed(1)}</span>
        </div>
        <div class="dossier-stat-row">
          <span class="stat-label">CADENCIA</span>
          <div class="stat-track"><div class="stat-fill" style="width:${cdPct}%;background:#42f584;"></div></div>
          <span class="stat-val-text">${c.cd}s</span>
        </div>
      </div>

      <div class="dossier-tip-box">
        💡 <b>Cómo usar:</b> ${c.tip}
      </div>

      <button id="btnSelectCompChar" class="btn-select-char-dossier ${isPlayingThis ? "is-selected" : ""}">
        ${isPlayingThis ? "✓ COMPAÑERO ACTUALMENTE ACTIVO" : "▶ SELECCIONAR COMO COMPAÑERO"}
      </button>
    `;

    const btnSelect = compCharDossier.querySelector("#btnSelectCompChar");
    if (btnSelect && !isPlayingThis) {
      btnSelect.addEventListener("click", () => {
        switchToChar(compSelectedCharIdx);
        updateSpotlight();
        renderCompendiumDossier();
        sfx(800, 0.1);
      });
    }
  }

  function renderCompendiumWorlds() {
    if (!compWorldsGrid) return;
    compWorldsGrid.innerHTML = "";

    WORLDS.forEach((w) => {
      const card = document.createElement("div");
      card.className = "comp-world-card";
      card.style.borderColor = `${w.accentColor}55`;

      card.innerHTML = `
        <div class="comp-world-card-top">
          <div class="comp-world-emoji" style="border: 1px solid ${w.accentColor}66;">${w.iconEmoji}</div>
          <div class="comp-world-titles">
            <div class="comp-world-name">${w.title}</div>
            <div class="comp-world-sub">${w.subtitle}</div>
          </div>
        </div>
        <p class="comp-world-desc">${w.desc}</p>
        <div class="comp-world-tags">
          <div class="comp-world-badge boss">👾 JEFE: ${w.bossName}</div>
          <div class="comp-world-badge fragment">💎 ${w.fragmentName}</div>
        </div>
      `;

      compWorldsGrid.appendChild(card);
    });
  }

  function renderCompendiumEnemies() {
    if (!compEnemiesGrid) return;
    compEnemiesGrid.innerHTML = "";

    ENEMIES_DATA.forEach((e) => {
      const card = document.createElement("div");
      card.className = `comp-enemy-card ${e.isBoss ? "is-boss" : ""}`;

      card.innerHTML = `
        <div class="comp-enemy-top">
          <div class="comp-enemy-icon">${e.icon}</div>
          <div class="comp-enemy-info">
            <div class="comp-enemy-name">${e.name}</div>
            <div class="comp-enemy-danger">${e.danger}</div>
          </div>
        </div>
        <p class="comp-enemy-desc">${e.desc}</p>
        <div class="comp-enemy-tip">💡 <b>Estrategia:</b> ${e.tip}</div>
      `;

      compEnemiesGrid.appendChild(card);
    });
  }

  function renderCompendiumItems() {
    if (!compItemsGrid) return;
    compItemsGrid.innerHTML = "";

    ITEMS_DATA.forEach((item) => {
      const card = document.createElement("div");
      card.className = "comp-item-card";

      card.innerHTML = `
        <div class="comp-item-top">
          <div class="comp-item-icon">${item.icon}</div>
          <div class="comp-item-info">
            <div class="comp-item-name">${item.name}</div>
            <div class="comp-item-type">${item.type}</div>
          </div>
        </div>
        <p class="comp-item-desc">${item.desc}</p>
        <div class="comp-item-effect">⚡ ${item.effect}</div>
      `;

      compItemsGrid.appendChild(card);
    });
  }

  function openCompendium() {
    if (!compendiumOv) return;
    compSelectedCharIdx = GameState.charIdx;
    renderCompendiumChars();
    renderCompendiumDossier();
    renderCompendiumWorlds();
    renderCompendiumEnemies();
    renderCompendiumItems();

    compendiumOv.classList.remove("hidden");
    sfx(600, 0.08);
  }

  function closeCompendium() {
    if (!compendiumOv) return;
    compendiumOv.classList.add("hidden");
    sfx(400, 0.06);
  }

  // Tabs switching
  if (compendiumOv) {
    const tabBtns = compendiumOv.querySelectorAll(".comp-tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
        const panels = compendiumOv.querySelectorAll(".comp-panel");
        panels.forEach((p) => {
          p.classList.toggle("hidden", p.id !== `compTab-${targetTab}`);
        });
        sfx(600, 0.04);
      });
    });
  }

  if (btnOpenCompendium) btnOpenCompendium.addEventListener("click", openCompendium);
  if (btnCloseCompendium) btnCloseCompendium.addEventListener("click", closeCompendium);
  if (btnBackCompendium) btnBackCompendium.addEventListener("click", closeCompendium);

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
    teamOv?.classList.add("hidden");
    compendiumOv?.classList.add("hidden");

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
      if (compendiumOv && !compendiumOv.classList.contains("hidden")) {
        closeCompendium();
        return;
      }
      if (!lbOv.classList.contains("hidden")) closeLeaderboard();
      if (!ctrlOv.classList.contains("hidden")) ctrlOv.classList.add("hidden");
      if (teamOv && !teamOv.classList.contains("hidden")) toggleTeam(true);
      if (!bootOv.classList.contains("hidden")) bootOv.classList.add("hidden");
    }
    if (e.code === "Enter" && !menuOv.classList.contains("hidden") && lbOv.classList.contains("hidden") && ctrlOv.classList.contains("hidden") && (!compendiumOv || compendiumOv.classList.contains("hidden")) && (!teamOv || teamOv.classList.contains("hidden"))) {
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
    document.body.classList.add("has-modal");
    try { sfx(700, 0.08, "triangle"); } catch (e) {}
  }

  bfBtnPlay?.addEventListener("click", () => {
    document.body.classList.remove("has-modal");
    levelBriefingModal?.classList.add("hidden");
    if (onBriefingPlayCallback) onBriefingPlayCallback();
  });
  bfBtnBack?.addEventListener("click", () => {
    document.body.classList.remove("has-modal");
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
