import { BOOT_LINES } from "../config/constants.js";
import { CHARS, POWER_INFO } from "../config/characters.js";
import { VISIBLE_WORLDS } from "../config/worlds.js";
import { GameState, respawn, fmtT, switchToChar } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { ANIM, SPR, anim, getCharacterAvatar } from "../engine/sprites.js";
import { fetchGlobalLeaderboard } from "../game/leaderboard.js";
import { GOOGLE_G } from "../game/auth.js";

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
    const pinfo = POWER_INFO[c.id];
    if (spotlightTip) spotlightTip.textContent = pinfo ? pinfo.desc : c.tip;
    const spIcon = document.getElementById("spotlightPowerIcon");
    if (spIcon) spIcon.textContent = pinfo ? pinfo.icon : c.emoji;

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
          const targetH = 250;
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
        const scale = 6.2;
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

  // Ranking (Cloudflare D1): general por puntos totales y el mejor de cada mundo
  let lbTab = "general";
  let lbData = null;
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const fmtN = (n) => Number(n || 0).toLocaleString("es-ES");
  const avatarOf = (id) => {
    const src = getCharacterAvatar(id);
    const c = CHARS.find((x) => x.id === id);
    return src ? `<img class="lb-av${src.startsWith("data:") ? " px" : ""}" src="${src}" alt="">` : `<span class="lb-av lb-av-emoji">${c ? c.emoji : "🪰"}</span>`;
  };
  function aggregate(list) {
    // mejor puntuación de cada jugador en cada mundo (las antiguas sin mundo son del Mundo 1)
    const players = new Map();
    for (const it of list) {
      const name = String(it.name || it.n || "ANON").toUpperCase();
      const score = Number(it.score ?? it.s) || 0;
      const world = Number(it.world) || 1;
      const p = players.get(name) || { name, best: {}, top: null };
      if (!p.best[world] || score > p.best[world].score) p.best[world] = { score, character: it.character || it.c, rank: it.rank || it.r || "" };
      if (!p.top || score > p.top.score) p.top = { score, character: it.character || it.c };
      players.set(name, p);
    }
    const all = [...players.values()].map((p) => ({ ...p, total: Object.values(p.best).reduce((a, b) => a + b.score, 0), worlds: Object.keys(p.best).length }));
    all.sort((a, b) => b.total - a.total);
    const perWorld = {};
    for (const w of VISIBLE_WORLDS) {
      perWorld[w.id] = all.filter((p) => p.best[w.id]).map((p) => ({ name: p.name, ...p.best[w.id] })).sort((a, b) => b.score - a.score);
    }
    return { all, perWorld };
  }
  function renderGeneral({ all }) {
    if (!all.length) return `<div class="lb-empty">🏆 ¡Aún no hay nadie! Supera cualquier mundo y estrena el ranking.</div>`;
    const me = GameState.playerName;
    const podium = [all[1], all[0], all[2]].map((p, i) => {
      if (!p) return `<div class="lb-pod lb-pod-empty"></div>`;
      const place = [2, 1, 3][i];
      return `<div class="lb-pod lb-pod-${place}${p.name === me ? " me" : ""}">
        <div class="lb-pod-av">${avatarOf(p.top && p.top.character)}<span class="lb-medal">${["🥇", "🥈", "🥉"][place - 1]}</span></div>
        <div class="lb-pod-name">${esc(p.name)}</div>
        <div class="lb-pod-pts">${fmtN(p.total)}</div>
        <div class="lb-pod-block">${place}</div>
      </div>`;
    }).join("");
    const rows = all.slice(3, 60).map((p, i) => `
      <li class="lb-row${p.name === me ? " me" : ""}">
        <span class="lb-pos">${i + 4}</span>
        ${avatarOf(p.top && p.top.character)}
        <span class="lb-name">${esc(p.name)}</span>
        <span class="lb-wbadges">${VISIBLE_WORLDS.map((w) => `<i class="lb-wb${p.best[w.id] ? " on" : ""}" title="${esc(w.name)}">${w.num}</i>`).join("")}</span>
        <b class="lb-pts">${fmtN(p.total)}</b>
      </li>`).join("");
    return `<div class="lb-general">
      <div class="lb-podium">${podium}</div>
      <div class="lb-list-wrap">
        <div class="lb-note">Suma del mejor récord de cada jugador en cada mundo</div>
        <ol class="lb-list">${rows || `<li class="lb-row lb-row-empty">Solo hay podio… ¡entra tú en la lista!</li>`}</ol>
      </div>
    </div>`;
  }
  function renderWorlds({ perWorld }) {
    return `<div class="lb-worlds">${VISIBLE_WORLDS.map((w, i) => {
      const list = perWorld[w.id] || [];
      const champ = list[0];
      return `<section class="lb-wcard lb-wc-${i % 4}">
        <div class="lb-wc-head"><span class="lb-wc-num">${w.num}</span><div><small>${esc(w.genre || "")}</small><h3>${esc(w.name)}</h3></div></div>
        ${champ ? `<div class="lb-champ">${avatarOf(champ.character)}<div><small>👑 El mejor</small><b>${esc(champ.name)}</b><span>${fmtN(champ.score)} pts${champ.rank ? ` · rango ${esc(champ.rank)}` : ""}</span></div></div>` : `<div class="lb-champ lb-champ-empty">Nadie lo ha dominado aún</div>`}
        <ol class="lb-wlist">${list.slice(1, 6).map((p, k) => `<li class="${p.name === GameState.playerName ? "me" : ""}"><span>${k + 2}</span>${esc(p.name)}<b>${fmtN(p.score)}</b></li>`).join("")}</ol>
      </section>`;
    }).join("")}</div>`;
  }
  function paintLB() {
    if (!lbModalContent || !lbData) return;
    const A = window.__cgAuth;
    const banner = A && !A.user
      ? `<div class="lb-login"><span>🔒 Entra para que tus récords cuenten y se guarde tu progreso</span><button class="lb-login-btn">${GOOGLE_G}<span>Entrar con Google</span></button></div>` : "";
    lbModalContent.innerHTML = banner + (lbTab === "general" ? renderGeneral(lbData) : renderWorlds(lbData));
    lbModalContent.querySelector(".lb-login-btn")?.addEventListener("click", () => A.open());
    lbOv.querySelectorAll(".lb-tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === lbTab));
  }
  async function renderLeaderboardModal() {
    if (!lbModalContent) return;
    lbModalContent.innerHTML = `<div class="lb-empty">⚡ Consultando la clasificación…</div>`;
    const list = await fetchGlobalLeaderboard();
    lbData = aggregate(list || []);
    paintLB();
  }
  window.addEventListener("cg_auth", () => { if (lbOv && !lbOv.classList.contains("hidden")) paintLB(); });
  lbOv?.querySelectorAll(".lb-tab").forEach((b) => b.addEventListener("click", () => { lbTab = b.dataset.tab; sfx(660, 0.05); paintLB(); }));

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
    { icon: "✉️", name: "Email urgente", where: "La Oficina · BoliBic Tag", desc: "Sobres con dientes que vuelan hacia ti en bandada.", tip: "Písalos o dispárales antes de que muerdan." },
    { icon: "⏰", name: "Reloj de fichar", where: "La Oficina · BoliBic Tag", desc: "Patrulla los pasillos marcando la hora sin descanso.", tip: "Un pisotón y se para el tiempo." },
    { icon: "📅", name: "Reunión de 5 minutos", where: "La Oficina · BoliBic Tag", desc: "Te lanza invitaciones de calendario desde lejos.", tip: "Acércate entre invitación e invitación." },
    { icon: "🥊", name: "El compañero rival", where: "Coworking Fight", desc: "Otro héroe de Clevergy, de la CPU o desde otro móvil.", tip: "Bloquea, esquiva y guarda el especial para rematar." },
    { icon: "🚤", name: "Los rivales del pantano", where: "Pantano de San Juan", desc: "Cinco motos de agua que no te dejarán ganar tan fácil.", tip: "Derrapa en las curvas para cargar turbo." },
    { icon: "📨", name: "EMAIL CHAIN", where: "Jefe · La Oficina", boss: true, desc: "Una torre de correos que salta en el escenario del Demo Day.", tip: "Salta sus ondas y písale la cabeza cuando se canse." },
    { icon: "📬", name: "INBOX INFINITO", where: "Jefe · BoliBic Tag", boss: true, desc: "La bandeja de entrada hecha monstruo en la última oleada.", tip: "Muévete sin parar y apunta al centro." }
  ];
  const ITEMS_DATA = [
    { icon: "☕", name: "Café", where: "Todos los mundos", desc: "Recupera un corazón (o da puntos extra si vas a tope)." },
    { icon: "🪙", name: "Monedas", where: "La Oficina", desc: "Suman puntos; cógelas casi todas para mejorar el rango." },
    { icon: "💾", name: "Disquetes", where: "La Oficina", desc: "Tres escondidos por el nivel. Son la clave del rango S." },
    { icon: "❓", name: "Bloque ?", where: "La Oficina", desc: "Dale con la cabeza: moneda o café." },
    { icon: "🛋️", name: "Pufs de colores", where: "La Oficina", desc: "Rebotan y te lanzan muy alto." },
    { icon: "🪑", name: "Sillas plegables", where: "La Oficina", desc: "Se hunden al poco de pisarlas y vuelven a aparecer." },
    { icon: "🌀", name: "Rejillas de ventilación", where: "La Oficina", desc: "La corriente te sube por la torre de coworking." },
    { icon: "✏️", name: "Boli Bic", where: "BoliBic Tag", desc: "Tu arma en el shooter: dispara tinta azul." },
    { icon: "⚡", name: "Café turbo", where: "Pantano de San Juan", desc: "Acelerón instantáneo en la moto de agua." },
    { icon: "💧", name: "Mancha de tinta", where: "Pantano de San Juan", desc: "Déjala detrás y el rival que la pise patina." },
    { icon: "📅", name: "Reunión", where: "Pantano de San Juan", desc: "Frena en seco a quien va primero." },
    { icon: "⭐", name: "Modo focus", where: "Pantano de San Juan", desc: "Invencible y más rápido durante unos segundos." }
  ];
  const avImg = (c) => {
    const av = getCharacterAvatar(c.id);
    return av ? `<img src="${av}" class="${av.startsWith("data:") ? "px" : ""}" alt="">` : `<span>${c.emoji}</span>`;
  };

  function renderCompendiumChars() {
    if (!compCharsGrid) return;
    compCharsGrid.innerHTML = CHARS.map((c) => {
      const p = POWER_INFO[c.id] || { icon: "★", desc: c.tip };
      return `<article class="comp2-char">
        <div class="comp2-char-av">${avImg(c)}</div>
        <div class="comp2-char-txt">
          <h3>${c.name}</h3>
          <div class="comp2-form">${c.form}</div>
          <div class="comp2-power"><span>${p.icon}</span><b>${c.ab}</b></div>
          <p>${p.desc}</p>
        </div>
      </article>`;
    }).join("");
  }
  function renderCompendiumDossier() {}

  // qué se hace en cada mapa, contado para la presentación
  const WORLD_LORE = {
    1: {
      place: "Google for Startups Campus Madrid, la antigua fábrica de ladrillo junto al Palacio Real.",
      steps: ["Terraza de la calle Moreno Nieto con sombrillas que hacen de plataforma", "Campus Café con barra, mesas y un altillo de sofás", "Torre de coworking de cinco plantas: ascensor, rejilla de ventilación y forjados con huecos", "Salas de cristal en lo alto, con fosos y sillas plegables que se hunden", "Gradas del auditorio hasta el escenario del Demo Day, donde espera EMAIL CHAIN"],
      goal: "Llega a la bandera con el máximo de monedas y los 3 disquetes escondidos: así se saca el rango S."
    },
    6: {
      place: "La terraza y las salas del CINK convertidas en ring.",
      steps: ["Hasta 4 compañeros a la vez, contra la CPU o online", "Cada golpe suma porcentaje: cuanto más llevas, más lejos sales volando", "Echa a los demás fuera del escenario para quitarles una vida", "Del cielo caen grapadoras, cafés, bombas de post-its y más objetos"],
      goal: "Gana quien se quede con vidas al final. ¡Todos contra todos!"
    },
    7: {
      place: "Las tres plantas del CINK Coworking de Infanta Mercedes, a boli.",
      steps: ["Entras por la recepción, donde te saluda Victoria", "Comedor con microondas y vending, terraza con césped y las salas 1, 2, 3 y 4", "Sube por las escaleras al hot desk y a la oficina de Clevergy, en la esquina redonda", "Oleadas de emails, reuniones y relojes que te siguen de planta en planta"],
      goal: "Sobrevive a las oleadas y borra a INBOX INFINITO, en cooperativo o en laser tag todos contra todos."
    },
    8: {
      place: "El Pantano de San Juan, en Madrid: la presa, los pinos y la playa de la Virgen de la Nueva.",
      steps: ["Seis motos de agua, tres vueltas", "Derrapa en las curvas para cargar turbo y usa rampas y pads de impulso", "Cajas de objetos: café turbo, emails, reuniones, manchas de tinta y modo focus"],
      goal: "Cruza la meta primero, contra la CPU o contra tus compañeros online."
    }
  };

  function renderCompendiumWorlds() {
    if (!compWorldsGrid) return;
    compWorldsGrid.innerHTML = VISIBLE_WORLDS.map((w, i) => `
      <article class="comp2-world comp2-acc-${i % 4}">
        <div class="comp2-world-num">${w.num}</div>
        <div class="comp2-world-body">
          <small>${w.genre || ""}</small>
          <h3>${w.name}</h3>
          <div class="comp2-world-sub">${w.subtitle || ""}</div>
          ${WORLD_LORE[w.id] ? `<p class="comp2-place">📍 ${WORLD_LORE[w.id].place}</p>
          <ol class="comp2-steps">${WORLD_LORE[w.id].steps.map((t) => `<li>${t}</li>`).join("")}</ol>
          <p class="comp2-goal">🏁 ${WORLD_LORE[w.id].goal}</p>` : `<p>${w.desc}</p>`}
          <div class="comp2-tags">${(w.chips || []).map((c) => `<span>${c}</span>`).join("")}</div>
        </div>
      </article>`).join("");
  }
  const miniCard = (e) => `
    <article class="comp2-card${e.boss ? " boss" : ""}">
      <div class="comp2-card-icon">${e.icon}</div>
      <div class="comp2-card-txt">
        <small>${e.where}</small>
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        ${e.tip ? `<div class="comp2-tip">💡 ${e.tip}</div>` : ""}
      </div>
    </article>`;
  function renderCompendiumEnemies() { if (compEnemiesGrid) compEnemiesGrid.innerHTML = ENEMIES_DATA.map(miniCard).join(""); }
  function renderCompendiumItems() { if (compItemsGrid) compItemsGrid.innerHTML = ITEMS_DATA.map(miniCard).join(""); }

  function openCompendium() {
    if (!compendiumOv) return;
    compSelectedCharIdx = GameState.charIdx;
    renderCompendiumChars();
    renderCompendiumWorlds();
    renderCompendiumEnemies();
    renderCompendiumItems();
    compendiumOv.classList.remove("hidden");
    const sc = document.getElementById("compScroll");
    if (sc) sc.scrollTop = 0;
    sfx(600, 0.08);
  }

  function closeCompendium() {
    if (!compendiumOv) return;
    compendiumOv.classList.add("hidden");
    sfx(400, 0.06);
  }

  // índice: salta a cada capítulo y marca el que estás leyendo
  if (compendiumOv) {
    const sc = document.getElementById("compScroll");
    const tabBtns = compendiumOv.querySelectorAll(".comp-tab-btn");
    tabBtns.forEach((btn) => btn.addEventListener("click", () => {
      const sec = document.getElementById(`compTab-${btn.dataset.tab}`);
      if (sec && sc) sc.scrollTo({ top: sec.offsetTop - 6, behavior: "smooth" });
      sfx(600, 0.04);
    }));
    sc?.addEventListener("scroll", () => {
      let cur = "characters";
      for (const id of ["characters", "worlds", "enemies", "items"]) {
        const sec = document.getElementById(`compTab-${id}`);
        if (sec && sec.offsetTop - 40 <= sc.scrollTop) cur = id;
      }
      if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4) cur = "items";
      tabBtns.forEach((b) => b.classList.toggle("on", b.dataset.tab === cur));
    }, { passive: true });
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
    updateWinScreenMVP
  };
}
