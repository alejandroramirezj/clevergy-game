import { CHARS, POWER_INFO } from "../config/characters.js";
import { VISIBLE_WORLDS, worldRetos, loadWorldProgress } from "../config/worlds.js";
import { worldArt } from "./worldMap.js";
import { GameState, switchToChar } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { ANIM, SPR, getCharacterAvatar } from "../engine/sprites.js";
import { fetchGlobalLeaderboard } from "../game/leaderboard.js";
import { GOOGLE_G } from "../game/auth.js";
import { speakCharacter, stopSpeaking } from "../engine/voice.js";

export function initOverlays({ onStartGame, onOpenMap, onPlayWorld, onExploreWorld }) {
  // Elements
  const menuOv = document.getElementById("menuOv");
  const nameInput = document.getElementById("nameInput");
  const btnPlay = document.getElementById("btnPlay");
  const btnOpenLB = document.getElementById("btnOpenLB");
  const btnOpenCtrl = document.getElementById("btnOpenCtrl");

  // Character spotlight elements
  const spotlightName = document.getElementById("spotlightName");
  const spotlightForm = document.getElementById("spotlightForm");
  const spotlightAb = document.getElementById("spotlightAb");
  const spotlightTip = document.getElementById("spotlightTip");

  const lbOv = document.getElementById("lbOv");
  const lbModalContent = document.getElementById("lbModalContent");
  const btnCloseLB = document.getElementById("btnCloseLB");
  const btnRefreshLB = document.getElementById("btnRefreshLB");

  const ctrlOv = document.getElementById("ctrlOv");
  const btnCloseCtrl = document.getElementById("btnCloseCtrl");


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
        if (document.body.classList.contains("char-locked") || (GameState.gameMode === "doodle" && GameState.currentWorld !== 1)) return;
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
    if (saved) {
      nameInput.value = saved;
      GameState.playerName = (saved.trim() || "ANON").toUpperCase().slice(0, 12);
    }
  } catch (e) {}

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      GameState.playerName = (nameInput.value.trim() || "ANON").toUpperCase().slice(0, 12);
    });
  }

  // Update spotlight UI based on selected character
  function updateSpotlight() {
    const c = CHARS[GameState.charIdx];
    if (!c) return;


    // Side dossier: Subtitle (Form) on top, Name below, Skill and info
    const spotlightTag = document.getElementById("spotlightTag") || document.querySelector(".dossier-tag");
    if (spotlightTag) spotlightTag.textContent = c.form.toUpperCase();
    if (spotlightName) spotlightName.textContent = c.name.toUpperCase();
    if (spotlightForm) spotlightForm.textContent = `FORMA: ${c.form.toUpperCase()}`;
    if (spotlightAb) spotlightAb.textContent = c.ab.toUpperCase();
    const pinfo = POWER_INFO[c.id];
    if (spotlightTip) spotlightTip.textContent = pinfo ? pinfo.desc : c.tip;
    const spIcon = document.getElementById("spotlightPowerIcon");
    if (spIcon) spIcon.textContent = pinfo ? pinfo.icon : c.emoji;


    // Update Mobile Controller Deck Action Labels: A -> SALTAR/SALTO, B -> [HABILIDAD]/AGARRAR
    const gbLabelB = document.getElementById("gbLabelB");
    const gbLabelA = document.getElementById("gbLabelA");
    if (GameState.gameMode === "doodle" && GameState.currentWorld === 9) {
      if (gbLabelB) gbLabelB.textContent = "AGARRAR";
      if (gbLabelA) gbLabelA.textContent = "SALTO";
    } else if (GameState.gameMode === "doodle" && GameState.currentWorld === 8) {
      if (gbLabelB) gbLabelB.textContent = "OBJETO";
      if (gbLabelA) gbLabelA.textContent = "DERRAPE";
    } else if (GameState.gameMode === "doodle" && GameState.currentWorld === 6) {
      if (gbLabelB) gbLabelB.textContent = "ESPECIAL";
      if (gbLabelA) gbLabelA.textContent = "GOLPE";
    } else if (GameState.gameMode === "doodle" && GameState.currentWorld === 7) {
      if (gbLabelB) gbLabelB.textContent = "DISPARAR";
      if (gbLabelA) gbLabelA.textContent = "SALTAR";
    } else {
      if (gbLabelB) {
        const actionNames = {
          ana: "TREPAR",
          alejandro: "PUÑO",
          paloma: "VOLAR",
          beltran: "SLACK",
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
          silvia: "SPEEDRUN",
          yair: "BULERÍA"
        };
        gbLabelB.textContent = actionNames[c.id] || c.ab.split(" ")[0].toUpperCase();
      }
      if (gbLabelA) gbLabelA.textContent = "SALTAR";
    }

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

  let lobbyPose = "idle"; // "idle" | "run" | "attack" | "jump" | "shoot" | "victory"
  let lobbyPoseTime = 0;
  let lobbyLockPose = null;
  let lobbyLockT = 0;

  // Configuración de disparos personalizados por personaje en la lobby
  const CHAR_SHOTS = {
    alejandro: { emoji: "🥊", color: "#ef4444", trail: "#fbbf24", glow: "#f87171", speed: 950, size: 24, label: "¡POW!" },
    ale:       { emoji: "🫒", color: "#84cc16", trail: "#eab308", glow: "#a3e635", speed: 880, size: 22, label: "¡CHOF!" },
    alvaroM:   { emoji: "🧮", color: "#06b6d4", trail: "#3b82f6", glow: "#22d3ee", speed: 960, size: 22, label: "404!" },
    alvaroP:   { emoji: "🎙️", color: "#a855f7", trail: "#ec4899", glow: "#c084fc", speed: 900, size: 22, label: "¡ONDA!" },
    ana:       { emoji: "🦁", color: "#f59e0b", trail: "#ef4444", glow: "#fbbf24", speed: 940, size: 24, label: "¡ZARPA!" },
    beltran:   { emoji: "💬", color: "#0284c7", trail: "#38bdf8", glow: "#38bdf8", speed: 930, size: 22, label: "¡MSG!" },
    bruno:     { emoji: "🗿", color: "#9ca3af", trail: "#eab308", glow: "#d1d5db", speed: 850, size: 24, label: "¡TÓTEM!" },
    gonzalo:   { emoji: "🥦", color: "#22c55e", trail: "#a3e635", glow: "#4ade80", speed: 920, size: 24, label: "¡BROC!" },
    javi:      { emoji: "☭",  color: "#dc2626", trail: "#f59e0b", glow: "#ef4444", speed: 940, size: 22, label: "¡MARCHA!" },
    jesus:     { emoji: "🍺", color: "#eab308", trail: "#f97316", glow: "#facc15", speed: 900, size: 24, label: "¡CAÑA!" },
    joseluis:  { emoji: "🖨️", color: "#0ea5e9", trail: "#6366f1", glow: "#38bdf8", speed: 880, size: 22, label: "¡3D!" },
    josu:      { emoji: "🥮", color: "#d97706", trail: "#b45309", glow: "#f59e0b", speed: 910, size: 22, label: "¡PANETÓN!" },
    juan:      { emoji: "📻", color: "#f43f5e", trail: "#ec4899", glow: "#fb7185", speed: 930, size: 22, label: "¡WAVE!" },
    maca:      { emoji: "🏐", color: "#f59e0b", trail: "#06b6d4", glow: "#fbbf24", speed: 980, size: 24, label: "¡REMATE!" },
    manu:      { emoji: "💪", color: "#10b981", trail: "#34d399", glow: "#6ee7b7", speed: 950, size: 24, label: "¡SALES!" },
    pablo:     { emoji: "🍊", color: "#f97316", trail: "#fbbf24", glow: "#fb923c", speed: 960, size: 24, label: "¡NANO!" },
    paloma:    { emoji: "🕊️", color: "#e2e8f0", trail: "#60a5fa", glow: "#ffffff", speed: 940, size: 22, label: "¡VOLAR!" },
    silvia:    { emoji: "👟", color: "#06b6d4", trail: "#10b981", glow: "#22d3ee", speed: 1020, size: 22, label: "¡FACTURA!" },
    yair:      { emoji: "🪘", color: "#e11d48", trail: "#f59e0b", glow: "#fb7185", speed: 920, size: 24, label: "¡OLÉ!" }
  };

  const lobbyProjectiles = [];
  const lobbyParticles = [];
  let lobbyRecoil = 0;

  function triggerLobbyImpact(p) {
    const hitX = stumbleHeroCanvas ? stumbleHeroCanvas.width - 22 : 400;
    const hitY = p.y;
    sfx(160, 0.12, "sawtooth", 0.1);

    lobbyParticles.push({
      type: "ring",
      x: hitX,
      y: hitY,
      radius: 6,
      maxRadius: 36,
      color: p.glow || "#00ffff",
      life: 0.28,
      maxLife: 0.28
    });

    for (let j = 0; j < 14; j++) {
      const angle = Math.PI * 0.55 + Math.random() * Math.PI * 0.9;
      const spd = 90 + Math.random() * 220;
      lobbyParticles.push({
        type: "spark",
        x: hitX,
        y: hitY,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        gravity: 140,
        color: Math.random() > 0.4 ? p.color : "#ffffff",
        size: 2.5 + Math.random() * 3.5,
        life: 0.35 + Math.random() * 0.22,
        maxLife: 0.57
      });
    }

    lobbyParticles.push({
      type: "pop",
      text: p.label || "¡POW!",
      x: hitX - 16,
      y: hitY - 12,
      vy: -55,
      rot: (Math.random() - 0.5) * 0.25,
      color: p.color || "#ffea00",
      life: 0.55,
      maxLife: 0.55
    });
  }

  function spawnLobbyShot() {
    const c = CHARS[GameState.charIdx] || CHARS[0];
    const shotCfg = CHAR_SHOTS[c.id] || {
      emoji: "💥",
      color: "#00d4ff",
      trail: "#38bdf8",
      glow: "#0284c7",
      speed: 920,
      size: 22,
      label: "¡POW!"
    };

    setLobbyPose("shoot", 1.2);
    lobbyRecoil = 22;

    if (stumbleCharViewport) {
      stumbleCharViewport.classList.remove("lobby-shot-recoil");
      void stumbleCharViewport.offsetWidth;
      stumbleCharViewport.classList.add("lobby-shot-recoil");
      setTimeout(() => stumbleCharViewport.classList.remove("lobby-shot-recoil"), 160);
    }

    sfx(940, 0.05, "sawtooth", 0.12);
    setTimeout(() => sfx(620, 0.07, "square", 0.09), 30);
    setTimeout(() => sfx(340, 0.11, "triangle", 0.07), 65);

    const W = stumbleHeroCanvas ? stumbleHeroCanvas.width : 420;
    const startX = W / 2 + 56;
    const startY = 224;

    lobbyParticles.push({
      type: "spark",
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      gravity: 0,
      color: "#ffffff",
      size: 16,
      life: 0.12,
      maxLife: 0.12
    });
    lobbyParticles.push({
      type: "ring",
      x: startX,
      y: startY,
      radius: 4,
      maxRadius: 24,
      color: shotCfg.glow,
      life: 0.18,
      maxLife: 0.18
    });

    lobbyProjectiles.push({
      emoji: shotCfg.emoji,
      color: shotCfg.color,
      trail: shotCfg.trail,
      glow: shotCfg.glow,
      label: shotCfg.label,
      size: shotCfg.size,
      x: startX,
      y: startY,
      vx: shotCfg.speed,
      life: 0
    });
  }

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
        if (pName === "shoot") {
          spawnLobbyShot();
        } else {
          setLobbyPose(pName, pName === "attack" || pName === "jump" ? 1.4 : 0);
          if (pName === "attack") sfx(220, 0.1, "triangle", 0.08);
          else if (pName === "jump") sfx(520, 0.08, "square", 0.06);
          else sfx(600, 0.04);
        }
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
      } else if (Math.abs(dx) <= 10 && Math.abs(dy) <= 10 && lobbyPose === "shoot") {
        spawnLobbyShot();
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
  // El bucle se pausa cuando el menú está oculto para no quemar CPU/GPU
  // durante la partida. Se re-arranca al volver al menú.
  let lastLobbyFrame = performance.now();
  let _lobbyRafId = null;

  function renderLobbyHero(now) {
    if (!menuOv || menuOv.classList.contains("hidden")) {
      _lobbyRafId = null; // el bucle queda parado; se re-arrancará al abrir el menú
      return;
    }
    _lobbyRafId = requestAnimationFrame(renderLobbyHero);
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

    if (lobbyRecoil > 0.05) {
      offsetX -= lobbyRecoil;
      lobbyRecoil *= Math.max(0, 1 - dt * 14);
    } else {
      lobbyRecoil = 0;
    }

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
    } else if (lobbyPose === "shoot") {
      const shootPhase = Math.sin(Math.min(Math.PI, lobbyPoseTime * 8));
      offsetX = -shootPhase * 14;
      offsetY = -shootPhase * 5;
      scaleX = 1 - shootPhase * 0.06;
      scaleY = 1 + shootPhase * 0.08;
      rot = -shootPhase * 0.05;
      shadowScale = 0.95;
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
      if (lobbyPose === "shoot") imgList = rec.images.shoot || rec.images.attack || rec.images.idle;
      else if (lobbyPose === "attack") imgList = rec.images.attack || rec.images.run || rec.images.idle;
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

    // -----------------------------------------------------------------------
    // Render and update lobby projectiles and particle VFX
    // -----------------------------------------------------------------------
    if (lobbyProjectiles.length > 0 || lobbyParticles.length > 0) {
      // 1. Update and render active projectiles
      for (let i = lobbyProjectiles.length - 1; i >= 0; i--) {
        const p = lobbyProjectiles[i];
        p.x += p.vx * dt;
        p.life += dt;

        // Trail emission
        if (Math.random() < 0.65) {
          lobbyParticles.push({
            type: "spark",
            x: p.x - 14 + (Math.random() - 0.5) * 6,
            y: p.y + (Math.random() - 0.5) * 8,
            vx: -p.vx * 0.15 + (Math.random() - 0.5) * 50,
            vy: (Math.random() - 0.5) * 60,
            color: p.trail,
            size: 3 + Math.random() * 3,
            life: 0.28,
            maxLife: 0.28
          });
        }

        // Draw projectile beam / glow
        ctx.save();
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 12;

        const grad = ctx.createLinearGradient(p.x - 45, p.y, p.x, p.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.5, p.trail);
        grad.addColorStop(1, p.color);
        ctx.beginPath();
        ctx.moveTo(p.x - 45, p.y);
        ctx.lineTo(p.x, p.y);
        ctx.lineWidth = 6;
        ctx.strokeStyle = grad;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();

        // Check border impact
        if (p.x >= W - 20) {
          triggerLobbyImpact(p);
          lobbyProjectiles.splice(i, 1);
        }
      }

      // 2. Update and render particles and pop labels
      for (let i = lobbyParticles.length - 1; i >= 0; i--) {
        const pt = lobbyParticles[i];
        pt.life -= dt;
        if (pt.life <= 0) {
          lobbyParticles.splice(i, 1);
          continue;
        }

        const progress = 1 - pt.life / pt.maxLife;
        const alpha = Math.max(0, pt.life / pt.maxLife);

        if (pt.type === "spark") {
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vy += (pt.gravity || 80) * dt;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = pt.color;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * (1 - progress * 0.4), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (pt.type === "ring") {
          pt.radius += (pt.maxRadius - pt.radius) * dt * 10;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = pt.color;
          ctx.lineWidth = 3 * alpha;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else if (pt.type === "pop") {
          pt.y += pt.vy * dt;
          ctx.save();
          ctx.globalAlpha = alpha;
          const scale = 1 + Math.sin(progress * Math.PI) * 0.35;
          ctx.translate(pt.x, pt.y);
          ctx.scale(scale, scale);
          ctx.rotate(pt.rot || 0);
          ctx.font = '900 20px "Nunito", "Bangers", Arial, sans-serif';
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeStyle = "#111827";
          ctx.lineWidth = 4;
          ctx.strokeText(pt.text, 0, 0);
          ctx.fillStyle = pt.color || "#ffea00";
          ctx.fillText(pt.text, 0, 0);
          ctx.restore();
        }
      }
    }
  }

  // Arrancar el bucle (sólo si no está ya corriendo)
  function startLobbyLoop() {
    if (_lobbyRafId) return;
    lastLobbyFrame = performance.now();
    _lobbyRafId = requestAnimationFrame(renderLobbyHero);
  }
  startLobbyLoop();

  // Re-arrancar el bucle cada vez que el menú vuelva a ser visible
  // (cuando el usuario vuelve de una partida o de un modal)
  if (menuOv) {
    new MutationObserver(() => {
      if (!menuOv.classList.contains("hidden")) startLobbyLoop();
    }).observe(menuOv, { attributes: true, attributeFilter: ["class"] });
  }

  updateSpotlight();

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
      let stats = null;
      try { stats = it.stats ? (typeof it.stats === "string" ? JSON.parse(it.stats) : it.stats) : null; } catch (e) {}
      if (!p.best[world] || score > p.best[world].score) p.best[world] = { score, character: it.character || it.c, used: it.used || (stats && stats.used) || it.character || it.c, rank: it.rank || it.r || "", stats };
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
  // detalle de lo conseguido en cada mundo en badges con estilo
  const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  function statChips(worldId, st, worldsCount) {
    if (worldsCount != null) {
      return `<div class="lb2-chips"><span class="lb2-chip lb2-chip-world">🌍 ${worldsCount} ${worldsCount === 1 ? "mundo" : "mundos"}</span></div>`;
    }
    if (!st) return "";
    const b = [];
    if (st.time && worldId !== 6) b.push(`<span class="lb2-chip lb2-chip-time" title="Tiempo de partida">⏱ ${mmss(st.time)}</span>`);
    if (worldId === 1) {
      if (st.coins != null) b.push(`<span class="lb2-chip lb2-chip-coins" title="Monedas recogidas">🪙 ${st.coins}</span>`);
      if (st.frags != null) b.push(`<span class="lb2-chip lb2-chip-frags" title="Disquetes">💾 ${st.frags}/3</span>`);
      if (st.stomps) b.push(`<span class="lb2-chip" title="Pisadas">👟 ${st.stomps}</span>`);
      b.push(`<span class="lb2-chip ${st.won ? "lb2-chip-win" : ""}" title="Zona">${st.won ? "🏁 Meta" : `📍 ${st.zone || "Campus"}`}</span>`);
    } else if (worldId === 7) {
      b.push(`<span class="lb2-chip ${st.won ? "lb2-chip-win" : ""}" title="Oleadas">${st.won ? "🏆 6/6" : `🌊 ${st.wave || 1}/6`}</span>`);
      if (st.kills != null) b.push(`<span class="lb2-chip" title="Enemigos">💥 ${st.kills}</span>`);
      if (st.acc != null) b.push(`<span class="lb2-chip" title="Puntería">🎯 ${st.acc}%</span>`);
    } else if (worldId === 6) {
      b.push(`<span class="lb2-chip ${st.won ? "lb2-chip-win" : ""}" title="Puesto">${st.won ? "🏆 Ganó" : `${st.place || "?"}º de ${(st.rivals || 0) + 1}`}</span>`);
      if (st.kos != null) b.push(`<span class="lb2-chip" title="KOs">💥 ${st.kos} KO</span>`);
      if (st.falls != null) b.push(`<span class="lb2-chip" title="Caídas">💨 ${st.falls}</span>`);
    } else if (worldId === 8) {
      if (st.pos) b.push(`<span class="lb2-chip ${st.pos === 1 ? "lb2-chip-win" : ""}" title="Posición">🏁 ${st.pos}º/${st.racers || 6}</span>`);
    } else if (worldId === 9) {
      b.push(`<span class="lb2-chip ${st.won ? "lb2-chip-win" : ""}" title="Ronda">${st.won ? "🔋 Batería" : `🎪 Ronda ${st.wave || 1}/4`}</span>`);
      if (st.falls != null) b.push(`<span class="lb2-chip" title="Caídas">💨 ${st.falls}</span>`);
    }
    if (!b.length) return "";
    return `<div class="lb2-chips">${b.join("")}</div>`;
  }

  // ── pantalla de ranking: pestañas a la izquierda · podio · lista · tu fila fija abajo ──
  const lbTabsEl = document.getElementById("lbTabs");
  const lbLoginEl = document.getElementById("lbLogin");
  const podiumHtml = (top3, valueOf, me, detailFn) => [top3[1], top3[0], top3[2]].map((p, i) => {
    const place = [2, 1, 3][i];
    if (!p) return `<div class="lb2-pod lb2-pod-${place} empty"><div class="lb2-pod-av">?</div><div class="lb2-pod-name">—</div><div class="lb2-pod-block">${place}</div></div>`;
    return `<div class="lb2-pod lb2-pod-${place}${p.name === me ? " me" : ""}">
      <div class="lb2-pod-av">${avatarOf(p.character)}${place === 1 ? '<span class="lb2-crown">👑</span>' : ""}</div>
      <div class="lb2-pod-name">${esc(p.name)}</div>
      <div class="lb2-pod-pts">${fmtN(valueOf(p))}</div>
      ${detailFn ? `<div class="lb2-pod-detail">${detailFn(p) || ""}</div>` : ""}
      <div class="lb2-pod-block">${place}</div>
    </div>`;
  }).join("");
  const rowHtml = (p, pos, value, extra, me, detail) => `<li class="lb2-row${p.name === me ? " me" : ""}">
    <span class="lb2-pos">${pos}</span>
    ${avatarOf(p.character)}
    <div class="lb2-col-info">
      <span class="lb2-name">${esc(p.name)}</span>
      ${detail || ""}
    </div>
    ${extra || ""}
    <b class="lb2-pts">${fmtN(value)}</b>
  </li>`;
  function renderBoard() {
    const me = GameState.playerName;
    const general = lbTab === "general";
    const w = general ? null : VISIBLE_WORLDS.find((x) => String(x.id) === String(lbTab));
    let list, valueOf, extra;
    if (general) {
      list = lbData.all.map((p) => ({ name: p.name, character: p.top && p.top.character, total: p.total, best: p.best }));
      valueOf = (p) => p.total;
      extra = (p) => `<span class="lb2-wb">${VISIBLE_WORLDS.map((x) => `<i class="${p.best[x.id] ? "on" : ""}" style="--c:${x.color}">${x.num}</i>`).join("")}</span>`;
    } else {
      list = lbData.perWorld[w.id] || [];
      valueOf = (p) => p.score;
      extra = (p) => (p.rank ? `<span class="lb2-rank">${esc(p.rank)}</span>` : "");
    }
    const acc = general ? "#1f38b8" : w.color;
    lbModalContent.style.setProperty("--acc", acc);
    if (!list.length) {
      lbModalContent.innerHTML = `<div class="lb2-emptybox">
        <div class="lb2-empty-ico">🏁</div>
        <h3>${general ? "Nadie ha puntuado todavía" : `Nadie ha superado ${esc(w.name)}`}</h3>
        <p>Inicia sesión y juega: cuenta cualquier partida, aunque no la termines. ¡El primero se queda con la corona 👑!</p>
        ${general ? "" : `<button class="lb2-play" data-id="${w.id}">▶ Jugar ${esc(w.name)}</button>`}
      </div>`;
    } else {
      const myIdx = list.findIndex((p) => p.name === me);
      const detailOf = (p) => (general ? statChips(null, null, p.best ? Object.keys(p.best).length : p.worlds) : statChips(w.id, p.stats));
      const rest = list.slice(3, 50).map((p, i) => rowHtml(p, i + 4, valueOf(p), extra(p), me, detailOf(p))).join("");
      lbModalContent.innerHTML = `
        <div class="lb2-top">
          <div class="lb2-podium">${podiumHtml(list.slice(0, 3), valueOf, me, detailOf)}</div>
          <div class="lb2-listbox">
            <div class="lb2-listhead">${general ? "Suma del mejor récord de cada uno en cada mundo · cuenta aunque no termines" : `Mejor partida de cada uno en ${esc(w.name)} · cuenta aunque no termines`}</div>
            <ol class="lb2-list">${rest || `<li class="lb2-row lb2-row-empty">Aún no hay más jugadores… ¡entra en el top!</li>`}</ol>
          </div>
        </div>
        <div class="lb2-me">${myIdx >= 0
          ? `<span class="lb2-me-tag">TÚ</span><span class="lb2-pos">${myIdx + 1}º</span>${avatarOf(list[myIdx].character)}<div class="lb2-col-info"><span class="lb2-name">${esc(me)}</span>${detailOf(list[myIdx]) || ""}</div><b class="lb2-pts">${fmtN(valueOf(list[myIdx]))}</b>`
          : `<span class="lb2-me-tag">TÚ</span><div class="lb2-col-info"><span class="lb2-name">${esc(me)} · todavía sin récord ${general ? "" : "aquí"}</span></div>${general ? "" : `<button class="lb2-play mini" data-id="${w.id}">▶ Jugar</button>`}`}</div>`;
    }
    lbModalContent.querySelectorAll(".lb2-play").forEach((b) => b.addEventListener("click", () => { lbOv.classList.add("hidden"); if (onPlayWorld) onPlayWorld(Number(b.dataset.id)); }));
  }
  function renderTabs() {
    const tabs = [{ id: "general", num: "★", name: "General", color: "#1f38b8", sub: "puntos totales" }, ...VISIBLE_WORLDS.map((w) => ({ id: String(w.id), num: w.num, name: w.name, color: w.color, sub: (lbData && lbData.perWorld[w.id] && lbData.perWorld[w.id][0]) ? `👑 ${lbData.perWorld[w.id][0].name}` : "sin récords" }))];
    lbTabsEl.innerHTML = tabs.map((t) => `<button class="lb2-tab${String(lbTab) === t.id ? " on" : ""}" data-tab="${t.id}" style="--c:${t.color}"><i>${t.num}</i><span><b>${esc(t.name)}</b><small>${esc(t.sub)}</small></span></button>`).join("");
    lbTabsEl.querySelectorAll(".lb2-tab").forEach((b) => b.addEventListener("click", () => { lbTab = b.dataset.tab; sfx(660, 0.05); paintLB(); }));
  }
  function paintLB() {
    if (!lbModalContent || !lbData) return;
    const A = window.__cgAuth;
    if (lbLoginEl) {
      lbLoginEl.classList.toggle("hidden", !A || !!A.user);
      lbLoginEl.innerHTML = `${GOOGLE_G}<span>Entra para que cuenten</span>`;
      lbLoginEl.onclick = () => A && A.open();
    }
    renderTabs();
    renderBoard();
  }
  async function renderLeaderboardModal() {
    if (!lbModalContent) return;
    lbModalContent.innerHTML = `<div class="lb-empty">⚡ Consultando la clasificación…</div>`;
    const list = await fetchGlobalLeaderboard();
    lbData = aggregate(list || []);
    paintLB();
  }
  window.addEventListener("cg_auth", () => { if (lbOv && !lbOv.classList.contains("hidden")) paintLB(); });

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


  // =========================================================================
  // COMPENDIUM MODAL (HISTORIA, PERSONAJES, ESCENARIOS, ENEMIGOS, OBJETOS)
  // =========================================================================
  const compendiumOv = document.getElementById("compendiumOv");
  const btnOpenCompendium = document.getElementById("btnOpenCompendium");
  const btnCloseCompendium = document.getElementById("btnCloseCompendium");
  const compCharsGrid = document.getElementById("compCharsGrid");
  const compWorldsGrid = document.getElementById("compWorldsGrid");
  const compEnemiesGrid = document.getElementById("compEnemiesGrid");
  const compItemsGrid = document.getElementById("compItemsGrid");


  const ENEMIES_DATA = [
    { id: "email", icon: "✉️", name: "Email urgente", where: "La Oficina · BoliBic Tag", world: 7, desc: "Sobres con dientes que vuelan hacia ti en bandada.", attack: "Vuela en grupo hacia ti y muerde: cada mordisco te quita vida. En BoliBic Tag llegan por oleadas, de planta en planta.", tip: "Písalos o dispárales antes de que muerdan.", fun: "Nunca viene solo: siempre trae a todo el equipo en copia." },
    { id: "clock", icon: "⏰", name: "Reloj de fichar", where: "La Oficina · BoliBic Tag", world: 7, desc: "Patrulla los pasillos marcando la hora sin descanso.", attack: "Da vueltas por los pasillos y, cuando te ve, embiste a toda velocidad.", tip: "Un pisotón y se para el tiempo.", fun: "Ficha la entrada, la salida… y tu paciencia." },
    { id: "meeting", icon: "📅", name: "Reunión de 5 minutos", where: "La Oficina · BoliBic Tag", world: 7, desc: "Te lanza invitaciones de calendario desde lejos.", attack: "Se queda a distancia y te dispara invitaciones de calendario que te frenan en seco.", tip: "Acércate entre invitación e invitación.", fun: "«Sólo son 5 minutos.» Nunca son 5 minutos." },
    { id: "rival", icon: "🥊", name: "El compañero rival", where: "Retro Fight", world: 6, desc: "Otro héroe de Clevergy, de la CPU o desde otro móvil.", attack: "Golpes, agarres y su poder especial. Cuanto más porcentaje de daño llevas, más lejos te manda volando.", tip: "Bloquea, esquiva y guarda el especial para rematar.", fun: "Puede ser la CPU… o el compañero de la mesa de al lado." },
    { id: "boats", icon: "🚤", name: "Los rivales del pantano", where: "Pantano de San Juan", world: 8, desc: "Cinco motos de agua que no te dejarán ganar tan fácil.", attack: "Te lanzan emails y reuniones, dejan manchas de tinta en el agua y te cierran en las curvas.", tip: "Derrapa en las curvas para cargar turbo.", fun: "Los de atrás reciben mejores objetos: nunca te confíes yendo primero." },
    { id: "datadis", icon: "🗄️", img: "/sprites/datadis/ready.png", name: "DATADIS", where: "Jefe · La Oficina", world: 1, boss: true, desc: "El proveedor de datos de consumo y nuestro peor enemigo, un monstruo de servidores y cables.", attack: "Aparece «en mantenimiento», te lanza el DNI por las dos caras, el CUPS, auditorías, cambia el proceso de la API (x20), te quita el acceso sin avisar… y se cae cuando menos lo esperas.", tip: "Salta sus pisotones, esquiva los requisitos y písale la cabeza cuando se le caiga la plataforma.", fun: "También te frena en La Integración, en el camino de Datadis de la ronda 2." },
    { id: "inbox", icon: "📬", name: "INBOX INFINITO", where: "Jefe · BoliBic Tag", world: 7, boss: true, desc: "La bandeja de entrada hecha monstruo en la última oleada.", attack: "Una torre de sobres que salta por la terraza del CINK y suelta oleadas de emails mientras le quede vida.", tip: "Muévete sin parar y apunta al centro.", fun: "9.999+ sin leer. Y subiendo." }
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

  const compVoiceIndices = {};

  function renderCompendiumChars() {
    if (!compCharsGrid) return;
    compCharsGrid.innerHTML = CHARS.map((c) => {
      const p = POWER_INFO[c.id] || { icon: "★", desc: c.tip };
      const phrases = Array.isArray(c.voice) && c.voice.length > 0 ? c.voice : ["¡Vamos!"];
      const curIdx = compVoiceIndices[c.id] || 0;
      const currentPhrase = phrases[curIdx % phrases.length];
      const hasMultiple = phrases.length > 1;

      return `<article class="comp2-char" data-id="${c.id}">
        <div class="comp2-char-av">${avImg(c)}</div>
        <div class="comp2-char-txt">
          <h3>${c.name}</h3>
          <div class="comp2-form">${c.form}</div>
          <div class="comp2-power"><span>${p.icon}</span><b>${c.ab}</b></div>
          <p>${p.desc}</p>
          <div class="comp2-voice-row" data-char="${c.id}" role="button" title="Toca para escuchar frase y ver la siguiente">
            <span class="comp2-voice-icon">💬</span>
            <div class="comp2-voice-scroller">
              <small class="comp2-voice-txt">«${currentPhrase}»</small>
            </div>
            ${hasMultiple ? `<span class="comp2-voice-badge">${(curIdx % phrases.length) + 1}/${phrases.length}</span>` : ""}
          </div>
          <span class="comp2-go">Ver poses y ficha →</span>
        </div>
      </article>`;
    }).join("");

    compCharsGrid.querySelectorAll(".comp2-voice-row").forEach((elRow) => {
      elRow.addEventListener("click", (e) => {
        e.stopPropagation();
        const cid = elRow.getAttribute("data-char");
        const c = CHARS.find((ch) => ch.id === cid);
        if (!c) return;
        const phrases = Array.isArray(c.voice) && c.voice.length > 0 ? c.voice : ["¡Vamos!"];
        const curIdx = compVoiceIndices[cid] || 0;
        const phraseToSpeak = phrases[curIdx % phrases.length];
        const isSilly = cid === "jesus" && phraseToSpeak.toLowerCase().includes("ketchup");

        // 1. Hablar la frase que está en pantalla (con voz ridícula si es el ketchup de Jesús)
        speakCharacter(cid, { force: true, phrase: phraseToSpeak, sillyVoice: isSilly });

        // 2. Avanzar el texto en el mismo espacio al siguiente
        const nextIdx = (curIdx + 1) % phrases.length;
        compVoiceIndices[cid] = nextIdx;
        const nextPhrase = phrases[nextIdx];

        const txtEl = elRow.querySelector(".comp2-voice-txt");
        const badgeEl = elRow.querySelector(".comp2-voice-badge");
        if (txtEl) {
          txtEl.textContent = `«${nextPhrase}»`;
          const scroller = elRow.querySelector(".comp2-voice-scroller");
          if (scroller) scroller.scrollLeft = 0;
          txtEl.classList.remove("comp2-pop");
          void txtEl.offsetWidth;
          txtEl.classList.add("comp2-pop");
        }
        if (badgeEl) {
          badgeEl.textContent = `${nextIdx + 1}/${phrases.length}`;
        }
      });
    });

    compCharsGrid.querySelectorAll(".comp2-char").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".comp2-voice-row")) return;
        const cid = card.getAttribute("data-id");
        openCharDetail(cid);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.target.closest(".comp2-voice-row")) return;
          e.preventDefault();
          const cid = card.getAttribute("data-id");
          openCharDetail(cid);
        }
      });
    });
  }

  // ── ficha interactiva de personaje: pose grande, selector de todas sus poses e info completa ──
  let charDetailEl = null, chPrevScroll = 0;
  function openCharDetail(id) {
    const c = CHARS.find((x) => x.id === id);
    if (!c || !compCharsGrid) return;
    stopSpeaking();

    const charIdx = CHARS.findIndex((x) => x.id === id);
    const prevChar = CHARS[(charIdx - 1 + CHARS.length) % CHARS.length];
    const nextChar = CHARS[(charIdx + 1) % CHARS.length];

    if (!charDetailEl) {
      charDetailEl = document.createElement("div");
      charDetailEl.className = "comp2-chdetail hidden";
      compCharsGrid.after(charDetailEl);
      charDetailEl.addEventListener("click", (ev) => {
        const t = ev.target.closest("button");
        if (!t) return;
        if (t.classList.contains("ch-back")) return closeCharDetail();
        if (t.classList.contains("ch-prev") || t.classList.contains("ch-next")) {
          const nextId = t.dataset.id;
          if (nextId) openCharDetail(nextId);
          return;
        }
        if (t.classList.contains("ch-pose")) {
          const big = charDetailEl.querySelector(".ch-big img"), lab = charDetailEl.querySelector(".ch-big-lab");
          if (big && t.dataset.src) big.src = t.dataset.src;
          if (lab && t.dataset.label) lab.textContent = t.dataset.label;
          charDetailEl.querySelectorAll(".ch-pose").forEach((b) => b.classList.toggle("on", b === t));
          sfx(650, 0.04);
          return;
        }
        if (t.classList.contains("ch-voice-btn")) {
          const cid = t.dataset.char;
          const charObj = CHARS.find((ch) => ch.id === cid);
          if (!charObj) return;
          stopSpeaking();
          const phrases = Array.isArray(charObj.voice) && charObj.voice.length > 0 ? charObj.voice : ["¡Vamos!"];
          const curIdx = compVoiceIndices[cid] || 0;
          const phraseToSpeak = phrases[curIdx % phrases.length];
          const isSilly = cid === "jesus" && phraseToSpeak.toLowerCase().includes("ketchup");
          speakCharacter(cid, { force: true, phrase: phraseToSpeak, sillyVoice: isSilly });
          const nextIdx = (curIdx + 1) % phrases.length;
          compVoiceIndices[cid] = nextIdx;
          const quoteEl = charDetailEl.querySelector(".ch-quote");
          if (quoteEl) quoteEl.textContent = `«${phrases[nextIdx]}»`;
          return;
        }
      });
    }

    const p = POWER_INFO[c.id] || { icon: "★", desc: c.tip };
    const phrases = Array.isArray(c.voice) && c.voice.length > 0 ? c.voice : ["¡Vamos!"];
    const curIdx = compVoiceIndices[c.id] || 0;
    const currentPhrase = phrases[curIdx % phrases.length];

    // Build poses list: exactamente 6 movimientos en 2 filas de 3
    const poses = [
      { key: "idle", label: "Reposo", src: `/sprites/${c.id}/idle.png` },
      { key: "walk", label: "Caminar", src: `/sprites/${c.id}/walk.png` },
      { key: "jump", label: "Salto", src: c.id === "ana" ? "/sprites/ana/climb.png" : `/sprites/${c.id}/jump.png` },
      { key: "attack", label: "Ataque especial", src: `/sprites/${c.id}/attack.png` },
      { key: "shoot", label: "Disparar", src: `/sprites/${c.id}/shoot.png` },
      { key: "death", label: "Derrota", src: `/sprites/${c.id}/death.png` }
    ];

    const first = poses[0];

    charDetailEl.innerHTML = `
      <nav class="wd-crumbs">
        <button class="ch-back wd-back">← Personajes</button>
        <div class="comp-nav-arrows">
          <button class="comp-nav-arrow ch-prev" data-id="${prevChar.id}" aria-label="Personaje anterior" title="Anterior: ${prevChar.name}">‹</button>
          <span class="comp-nav-step">${charIdx + 1}/${CHARS.length}</span>
          <button class="comp-nav-arrow ch-next" data-id="${nextChar.id}" aria-label="Siguiente personaje" title="Siguiente: ${nextChar.name}">›</button>
        </div>
        <span>›</span>
        <b>${c.name}</b>
      </nav>
      <article class="ch-card">
        <div class="ch-side">
          <figure class="ch-big">
            <button class="card-side-arrow ch-prev" data-id="${prevChar.id}" aria-label="Anterior" title="Anterior: ${prevChar.name}">‹</button>
            <img src="${first.src}" alt="${c.name}">
            <button class="card-side-arrow ch-next" data-id="${nextChar.id}" aria-label="Siguiente" title="Siguiente: ${nextChar.name}">›</button>
            <figcaption class="ch-big-lab">${first.label}</figcaption>
          </figure>
          <div class="ch-poses">
            ${poses.map((pose, i) => `
              <button class="ch-pose${i === 0 ? " on" : ""}" data-src="${pose.src}" data-label="${pose.label}" title="${pose.label}">
                <img src="${pose.src}" alt="${pose.label}">
                <small>${pose.label}</small>
              </button>
            `).join("")}
          </div>
        </div>
        <div class="ch-body">
          <small class="ch-form-tag">${c.form}</small>
          <h3>${c.emoji} ${c.name}</h3>
          
          <div class="ch-power-block">
            <div class="ch-power-head">
              <span class="ch-power-ico">${p.icon}</span>
              <b class="ch-power-name">${c.ab}</b>
            </div>
            <p class="ch-power-desc">${p.desc}</p>
            ${c.tip ? `<p class="ch-power-tip">🎮 ${c.tip}</p>` : ""}
          </div>

          <h4>💬 Frase célebre</h4>
          <div class="ch-voice-box">
            <button class="ch-voice-btn" data-char="${c.id}" title="Escuchar frase y cambiar a la siguiente">🔊 Hablar</button>
            <span class="ch-quote">«${currentPhrase}»</span>
          </div>
        </div>
      </article>
    `;

    const compScrollEl = document.getElementById("compScroll");
    if (!compendiumOv.classList.contains("ch-mode")) chPrevScroll = compScrollEl ? compScrollEl.scrollTop : 0;
    compendiumOv.classList.add("ch-mode");
    charDetailEl.classList.remove("hidden");
    if (compScrollEl) compScrollEl.scrollTop = 0;
    sfx(600, 0.06);
  }

  function closeCharDetail() {
    stopSpeaking();
    if (!charDetailEl || !compendiumOv.classList.contains("ch-mode")) return;
    compendiumOv.classList.remove("ch-mode");
    charDetailEl.classList.add("hidden");
    const compScrollEl = document.getElementById("compScroll");
    if (compScrollEl) compScrollEl.scrollTop = chPrevScroll;
    sfx(450, 0.05);
  }

  // qué se hace en cada mapa, contado para la presentación
  const WORLD_LORE = {
    1: {
      place: "Google for Startups Campus Madrid, la antigua fábrica de ladrillo junto al Palacio Real.",
      steps: ["Terraza de la calle Moreno Nieto con sombrillas que hacen de plataforma", "Campus Café con barra, mesas y un altillo de sofás", "Torre de coworking de cinco plantas: ascensor, rejilla de ventilación y forjados con huecos", "Salas de cristal en lo alto, con fosos y sillas plegables que se hunden", "Gradas del auditorio hasta el escenario del Demo Day, donde espera DATADIS"],
      goal: "Llega a la bandera con el máximo de monedas y los 3 disquetes escondidos: así se saca el rango S."
    },
    6: {
      place: "La sala de reuniones de Clevergy convertida en una arena de retrospectiva.",
      steps: [
        "Gran tablero de EasyRetro al fondo con sus cuatro columnas: Qué ha ido bien, A mejorar, Preguntas y Action Items",
        "Pelea encima de la mesa de conferencias entre notas, portátiles, cafés y rotuladores",
        "5 minutos para escribir tarjetas, 5 minutos para votar... ¡y el resto pelea!",
        "Cada golpe suma porcentaje: cuanto más daño llevas, más lejos sales volando",
        "Las tarjetas y los votos reaccionan a los impactos y vuelan por la sala"
      ],
      goal: "Gana quien resista en la mesa y conserve sus vidas, resolviendo la retro a puñetazos. ¡Todos contra todos o contra la CPU!"
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
    },
    9: {
      place: "Un plató de concurso a boli, flotando sobre un mar de datos.",
      steps: ["Ronda 1: crea el usuario (nombre, apellidos, DNI y notificaciones) y la casa (CUPS, dirección por partes y código postal) entre ruletas y agujeros", "Ronda 2: el consumo por Datadis (recto pero todo frena, aunque saltes, y al final «proceso bloqueado por Datadis»), por FTP según la distribuidora (el suelo se cae y CIDE no lleva a ningún sitio) o por API", "Ronda 3: la puerta del inversor (Huawei, Fronius, GoodWe, Sungrow o Sigenergy), la documentación, los endpoints, el modelo de Clevergy y vincular la instalación", "Final: cómo funciona una batería y el mercado de flexibilidad, y la torre con una sola batería arriba"],
      goal: "Clasifícate en cada ronda y sé el primero en saltar y coger la batería."
    }
  };

  function renderCompendiumWorlds() {
    if (!compWorldsGrid) return;
    compWorldsGrid.innerHTML = VISIBLE_WORLDS.map((w, i) => `
      <article class="comp2-world comp2-acc-${i % 4} comp2-enter" data-world="${w.id}" role="button" tabindex="0" aria-label="Entrar en ${w.name}">
        <div class="comp2-world-num">${w.num}</div>
        <div class="comp2-world-body">
          <small>${w.genre || ""}</small>
          <h3>${w.name}</h3>
          <div class="comp2-world-sub">${w.subtitle || ""}</div>
          <p class="comp2-blurb">${w.blurb || ""}</p>
          <div class="comp2-tags">${(w.chips || []).map((c) => `<span>${c}</span>`).join("")}</div>
          <div class="comp2-actions"><span class="comp2-go">Entrar en el mundo →</span></div>
        </div>
      </article>`).join("");
  }
  // ── pantalla de detalles de un mundo (resumen en la tarjeta; aquí, todo) ──
  let worldDetailEl = null;
  function openWorldDetail(id) {
    const w = VISIBLE_WORLDS.find((x) => x.id === id);
    if (!w || !compWorldsGrid) return;
    if (!worldDetailEl) {
      worldDetailEl = document.createElement("div");
      worldDetailEl.className = "comp2-wdetail hidden";
      compWorldsGrid.after(worldDetailEl);
      worldDetailEl.addEventListener("click", (e) => {
        const t = e.target.closest("button");
        if (!t) return;
        if (t.classList.contains("wd-back")) return closeWorldDetail();
        if (t.classList.contains("wd-other")) return openWorldDetail(Number(t.dataset.world));
        const wid = Number(t.dataset.world);
        if (t.classList.contains("wd-explore") && onExploreWorld) { compendiumOv.classList.add("hidden"); onExploreWorld(wid, () => compendiumOv.classList.remove("hidden")); }
        if (t.classList.contains("wd-play") && onPlayWorld) { closeWorldDetail(); compendiumOv.classList.add("hidden"); onPlayWorld(wid); }
      });
    }
    const lore = WORLD_LORE[id];
    const retos = worldRetos(id, loadWorldProgress());
    const others = VISIBLE_WORLDS.filter((x) => x.id !== id);
    const curChar = CHARS[GameState.charIdx] || CHARS[0];
    worldDetailEl.innerHTML = `
      <nav class="wd-crumbs"><button class="wd-back">← Mundos</button><span>›</span><b>${w.name}</b></nav>
      <article class="wd-card" style="--acc:${w.color}">
        <div class="wd-side">
          <figure class="wd-shot">
            <img src="/ui/previews/world-${id}.webp" alt="Vista de ${w.name}" loading="lazy" onerror="this.parentNode.classList.add('noimg')">
            <div class="wd-art">${worldArt(w)}</div>
            <span class="wd-num">${w.num}</span>
            <span class="wd-shot-tag">📸 Así es el mundo</span>
            ${onExploreWorld ? `<button class="wd-explore wd-explore-big" data-world="${id}" aria-label="Ver el mundo en 3D"><i>👁</i><span>Ver el mundo en 3D</span></button>` : ""}
          </figure>
        </div>
        <div class="wd-body">
          <small class="wd-genre" style="background:${w.genreBg};color:${w.genreColor}">${w.genre}</small>
          <h3>${w.name}</h3>
          <div class="comp2-world-sub">${w.subtitle || ""}</div>
          <div class="comp2-tags">${(w.chips || []).map((c) => `<span>${c}</span>`).join("")}</div>
          <p class="wd-desc">${w.desc}</p>
          ${lore ? `<h4>📍 Dónde</h4><p>${lore.place}</p>
          <h4>🗺️ El recorrido</h4><ol class="comp2-steps">${lore.steps.map((t) => `<li>${t}</li>`).join("")}</ol>
          <h4>🏁 Objetivo</h4><p>${lore.goal}</p>` : ""}
          <h4>⭐ Retos</h4>
          <ul class="wd-retos">${retos.map((r) => `<li class="${r.done ? "done" : ""}">${r.done ? "✔" : "○"} ${r.txt}</li>`).join("")}</ul>
          <div class="wd-others"><span>Otros mundos:</span>${others.map((x) => `<button class="wd-other" data-world="${x.id}" style="--acc:${x.color}">${x.num} · ${x.name}</button>`).join("")}</div>
        </div>
      </article>`;

    if (!compendiumOv.classList.contains("wd-mode")) wdPrevScroll = compScrollEl ? compScrollEl.scrollTop : 0;
    compendiumOv.classList.add("wd-mode");
    worldDetailEl.classList.remove("hidden");
    if (compScrollEl) compScrollEl.scrollTop = 0;
  }
  let wdPrevScroll = 0;
  const compScrollEl = document.getElementById("compScroll");
  function closeWorldDetail() {
    if (!worldDetailEl || !compendiumOv.classList.contains("wd-mode")) return;
    compendiumOv.classList.remove("wd-mode");
    worldDetailEl.classList.add("hidden");
    if (compScrollEl) compScrollEl.scrollTop = wdPrevScroll;
  }

  compWorldsGrid?.addEventListener("keydown", (e) => {
    const card = e.target.closest(".comp2-enter");
    if (card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openWorldDetail(Number(card.dataset.world)); }
  });
  // modo observador: recorre el escenario con cámara libre
  compWorldsGrid?.addEventListener("click", (e) => {
    const card = e.target.closest(".comp2-enter");
    if (card) return openWorldDetail(Number(card.dataset.world));
    const b = e.target.closest(".comp2-explore");
    if (!b || !onExploreWorld) return;
    const id = Number(b.dataset.world);
    compendiumOv.classList.add("hidden");
    onExploreWorld(id, () => compendiumOv.classList.remove("hidden"));
  });
  const miniCard = (e) => `
    <article class="comp2-card${e.boss ? " boss" : ""}">
      <div class="comp2-card-icon">${e.img ? `<img src="${e.img}" alt="" style="width:100%;height:100%;object-fit:contain">` : e.icon}</div>
      <div class="comp2-card-txt">
        <small>${e.where}</small>
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        ${e.tip ? `<div class="comp2-tip">💡 ${e.tip}</div>` : ""}
      </div>
    </article>`;
  const enemyCard = (e) => `
    <article class="comp2-enemy${e.boss ? " boss" : ""}" data-enemy="${e.id}" role="button" tabindex="0" aria-label="Ver ficha de ${e.name}">
      <div class="comp2-enemy-av">${e.img ? `<img src="${e.img}" alt="">` : `<span>${e.icon}</span>`}</div>
      <div class="comp2-enemy-txt">
        <small>${e.boss ? "👑 JEFE · " : ""}${e.where}</small>
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        <span class="comp2-go">Ver ficha →</span>
      </div>
    </article>`;
  // las fotos de las poses se sacan con el render a boli la primera vez que se abre
  let posesMod = null;
  const loadPoses = async () => (posesMod ||= await import("../doodle/enemyPoses.js"));
  function renderCompendiumEnemies() {
    if (!compEnemiesGrid) return;
    compEnemiesGrid.innerHTML = ENEMIES_DATA.map(enemyCard).join("");
    loadPoses().then((m) => {
      for (const e of ENEMIES_DATA) {
        const poses = m.enemyPoses(e.id);
        const av = compEnemiesGrid.querySelector(`[data-enemy="${e.id}"] .comp2-enemy-av`);
        if (av && poses[0]) av.innerHTML = `<img src="${poses[0].src}" alt="">`;
      }
    }).catch(() => {});
  }
  compEnemiesGrid?.addEventListener("click", (e) => { const c = e.target.closest(".comp2-enemy"); if (c) openEnemyDetail(c.dataset.enemy); });
  compEnemiesGrid?.addEventListener("keydown", (e) => { const c = e.target.closest(".comp2-enemy"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openEnemyDetail(c.dataset.enemy); } });

  // ── ficha de un enemigo: pose en grande, todas sus poses y cómo vencerle ──
  let enemyDetailEl = null, enPrevScroll = 0;
  async function openEnemyDetail(id) {
    const e = ENEMIES_DATA.find((x) => x.id === id);
    if (!e || !compEnemiesGrid) return;
    const enemyIdx = ENEMIES_DATA.findIndex((x) => x.id === id);
    const prevEnemy = ENEMIES_DATA[(enemyIdx - 1 + ENEMIES_DATA.length) % ENEMIES_DATA.length];
    const nextEnemy = ENEMIES_DATA[(enemyIdx + 1) % ENEMIES_DATA.length];

    if (!enemyDetailEl) {
      enemyDetailEl = document.createElement("div");
      enemyDetailEl.className = "comp2-edetail hidden";
      compEnemiesGrid.after(enemyDetailEl);
      enemyDetailEl.addEventListener("click", (ev) => {
        const t = ev.target.closest("button");
        if (!t) return;
        if (t.classList.contains("en-back")) return closeEnemyDetail();
        if (t.classList.contains("en-prev") || t.classList.contains("en-next")) {
          const nextId = t.dataset.id;
          if (nextId) openEnemyDetail(nextId);
          return;
        }
        if (t.classList.contains("en-pose")) {
          const big = enemyDetailEl.querySelector(".en-big img"), lab = enemyDetailEl.querySelector(".en-big-lab");
          big.src = t.dataset.src; lab.textContent = t.dataset.label;
          enemyDetailEl.querySelectorAll(".en-pose").forEach((b) => b.classList.toggle("on", b === t));
          return;
        }
        if (t.classList.contains("en-world")) { closeEnemyDetail(); openWorldDetail(Number(t.dataset.world)); }
      });
    }
    let poses = [];
    try { poses = (await loadPoses()).enemyPoses(id); } catch (err) {}
    const first = poses[0] || { src: e.img || "", label: e.name };
    const w = VISIBLE_WORLDS.find((x) => x.id === e.world);
    enemyDetailEl.innerHTML = `
      <nav class="wd-crumbs">
        <button class="en-back wd-back">← Enemigos</button>
        <div class="comp-nav-arrows">
          <button class="comp-nav-arrow en-prev" data-id="${prevEnemy.id}" aria-label="Enemigo anterior" title="Anterior: ${prevEnemy.name}">‹</button>
          <span class="comp-nav-step">${enemyIdx + 1}/${ENEMIES_DATA.length}</span>
          <button class="comp-nav-arrow en-next" data-id="${nextEnemy.id}" aria-label="Siguiente enemigo" title="Siguiente: ${nextEnemy.name}">›</button>
        </div>
        <span>›</span>
        <b>${e.name}</b>
      </nav>
      <article class="en-card${e.boss ? " boss" : ""}">
        <div class="en-side">
          <figure class="en-big">
            <button class="card-side-arrow en-prev" data-id="${prevEnemy.id}" aria-label="Anterior" title="Anterior: ${prevEnemy.name}">‹</button>
            ${first.src ? `<img src="${first.src}" alt="${e.name}">` : `<span>${e.icon}</span>`}
            <button class="card-side-arrow en-next" data-id="${nextEnemy.id}" aria-label="Siguiente" title="Siguiente: ${nextEnemy.name}">›</button>
            <figcaption class="en-big-lab">${first.label}</figcaption>
          </figure>
          ${poses.length > 1 ? `<div class="en-poses">${poses.map((p, i) => `<button class="en-pose${i === 0 ? " on" : ""}" data-src="${p.src}" data-label="${p.label}" title="${p.label}"><img src="${p.src}" alt=""><small>${p.label}</small></button>`).join("")}</div>` : ""}
        </div>
        <div class="en-body">
          <small class="en-where">${e.boss ? "👑 JEFE · " : ""}${e.where}</small>
          <h3>${e.icon} ${e.name}</h3>
          <p>${e.desc}</p>
          <h4>⚔️ Cómo ataca</h4><p>${e.attack}</p>
          <h4>💡 Cómo vencerle</h4><p>${e.tip}</p>
          <h4>😄 Curiosidad</h4><p>${e.fun}</p>
          ${w ? `<button class="en-world" data-world="${w.id}" style="--acc:${w.color}">🗺️ Está en ${w.name} →</button>` : ""}
        </div>
      </article>`;
    if (!compendiumOv.classList.contains("en-mode")) enPrevScroll = compScrollEl ? compScrollEl.scrollTop : 0;
    compendiumOv.classList.add("en-mode");
    enemyDetailEl.classList.remove("hidden");
    if (compScrollEl) compScrollEl.scrollTop = 0;
  }
  function closeEnemyDetail() {
    if (!enemyDetailEl || !compendiumOv.classList.contains("en-mode")) return;
    compendiumOv.classList.remove("en-mode");
    enemyDetailEl.classList.add("hidden");
    if (compScrollEl) compScrollEl.scrollTop = enPrevScroll;
  }
  function renderCompendiumItems() { if (compItemsGrid) compItemsGrid.innerHTML = ITEMS_DATA.map(miniCard).join(""); }

  function openCompendium() {
    if (!compendiumOv) return;
    renderCompendiumChars();
    renderCompendiumWorlds();
    renderCompendiumEnemies();
    renderCompendiumItems();
    compendiumOv.classList.remove("wd-mode", "en-mode", "ch-mode");
    if (worldDetailEl) worldDetailEl.classList.add("hidden");
    if (enemyDetailEl) enemyDetailEl.classList.add("hidden");
    if (charDetailEl) charDetailEl.classList.add("hidden");
    compendiumOv.classList.remove("hidden");
    const sc = document.getElementById("compScroll");
    if (sc) sc.scrollTop = 0;
    sfx(600, 0.08);
  }

  function closeCompendium() {
    stopSpeaking();
    if (!compendiumOv) return;
    compendiumOv.classList.add("hidden");
    sfx(400, 0.06);
  }

  // índice: salta a cada capítulo y marca el que estás leyendo
  if (compendiumOv) {
    const sc = document.getElementById("compScroll");
    const tabBtns = compendiumOv.querySelectorAll(".comp-tab-btn");
    tabBtns.forEach((btn) => btn.addEventListener("click", () => {
      if (compendiumOv.classList.contains("ch-mode")) closeCharDetail();
      if (compendiumOv.classList.contains("wd-mode")) closeWorldDetail();
      if (compendiumOv.classList.contains("en-mode")) closeEnemyDetail();
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
  // ↩ dentro de la página de un personaje o mundo vuelve a la lista; fuera, cierra la historia
  if (btnCloseCompendium) btnCloseCompendium.addEventListener("click", () => (compendiumOv.classList.contains("ch-mode") ? closeCharDetail() : compendiumOv.classList.contains("en-mode") ? closeEnemyDetail() : compendiumOv.classList.contains("wd-mode") ? closeWorldDetail() : closeCompendium()));

  // Start game from Menu: Opens the 5-World Adventure Map!
  function triggerStart() {
    if (_lobbyRafId) {
      cancelAnimationFrame(_lobbyRafId);
      _lobbyRafId = null;
    }
    const rawName = (nameInput?.value.trim() || "ANON").toUpperCase().slice(0, 12);
    GameState.playerName = rawName;
    try {
      localStorage.setItem("clevergy_player_name", rawName);
    } catch (e) {}

    menuOv?.classList.add("hidden");
    lbOv?.classList.add("hidden");
    ctrlOv?.classList.add("hidden");
    compendiumOv?.classList.add("hidden");

    onStartGame();
  }

  if (btnPlay) btnPlay.addEventListener("click", triggerStart);

  // Keyboard shortcut listener for menu (Enter starts game, Esc closes modals)
  window.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      if (compendiumOv && !compendiumOv.classList.contains("hidden")) {
        closeCompendium();
        return;
      }
      if (lbOv && !lbOv.classList.contains("hidden")) closeLeaderboard();
      if (ctrlOv && !ctrlOv.classList.contains("hidden")) ctrlOv.classList.add("hidden");
    }
    if (compendiumOv && !compendiumOv.classList.contains("hidden")) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        if (compendiumOv.classList.contains("ch-mode") && charDetailEl) {
          const btn = charDetailEl.querySelector(e.key === "ArrowLeft" ? ".ch-prev" : ".ch-next");
          if (btn && btn.dataset.id) { openCharDetail(btn.dataset.id); sfx(650, 0.04); }
        } else if (compendiumOv.classList.contains("en-mode") && enemyDetailEl) {
          const btn = enemyDetailEl.querySelector(e.key === "ArrowLeft" ? ".en-prev" : ".en-next");
          if (btn && btn.dataset.id) { openEnemyDetail(btn.dataset.id); sfx(650, 0.04); }
        }
      }
    }
    if (e.code === "Enter" && menuOv && !menuOv.classList.contains("hidden") && (!lbOv || lbOv.classList.contains("hidden")) && (!ctrlOv || ctrlOv.classList.contains("hidden")) && (!compendiumOv || compendiumOv.classList.contains("hidden"))) {
      triggerStart();
    }
  });

  return { tryStart: triggerStart, updateSpotlight };
}
