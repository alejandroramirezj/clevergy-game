import { CHARS, POWER_INFO } from "../config/characters.js";
import { VISIBLE_WORLDS, worldRetos, loadWorldProgress } from "../config/worlds.js";
import { worldArt } from "./worldMap.js";
import { GameState, switchToChar } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { ANIM, SPR, getCharacterAvatar } from "../engine/sprites.js";
import { fetchGlobalLeaderboard } from "../game/leaderboard.js";
import { GOOGLE_G } from "../game/auth.js";
import { speakCharacter } from "../engine/voice.js";

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


    // Side dossier: Form in uppercase, Skill in cyan, and numerical stats
    if (spotlightName) spotlightName.textContent = c.form.toUpperCase();
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
  // detalle de lo conseguido en cada mundo, en una línea corta
  const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  function statLine(worldId, st) {
    if (!st) return "";
    const b = [];
    if (worldId === 1) { if (st.frags != null) b.push(`💾 ${st.frags}/3`); if (st.coins != null) b.push(`🪙 ${st.coins}`); if (st.stomps) b.push(`👟 ${st.stomps}`); b.push(st.won ? "🏁 Meta" : `📍 ${st.zone || "Campus"}`); }
    else if (worldId === 7) { b.push(st.won ? "🏆 6/6" : `🌊 ${st.wave || 1}/6`); if (st.kills != null) b.push(`💥 ${st.kills}`); if (st.acc != null) b.push(`🎯 ${st.acc}%`); }
    else if (worldId === 6) { b.push(st.won ? "🏆 Ganó" : `${st.place || "?"}º de ${(st.rivals || 0) + 1}`); if (st.kos != null) b.push(`💥 ${st.kos} KO`); if (st.falls != null) b.push(`💨 ${st.falls}`); }
    else if (worldId === 8) { if (st.pos) b.push(`🏁 ${st.pos}º/${st.racers || 6}`); }
    else if (worldId === 9) { b.push(st.won ? "🔋 Batería" : `🎪 Ronda ${st.wave || 1}/4`); if (st.falls != null) b.push(`💨 ${st.falls}`); }
    if (st.time && worldId !== 6) b.push(`⏱ ${mmss(st.time)}`);
    return b.join(" · ");
  }

  // dato curioso: con qué personaje (que no es el suyo) juega más la gente
  function funFact(worldId) {
    const recs = worldId ? (lbData.perWorld[worldId] || []) : lbData.all.flatMap((p) => Object.values(p.best));
    const other = new Map(), all = new Map();
    for (const r of recs) {
      if (!r.used) continue;
      all.set(r.used, (all.get(r.used) || 0) + 1);
      if (r.used !== r.character) other.set(r.used, (other.get(r.used) || 0) + 1);
    }
    const top = (m) => [...m.entries()].sort((a, b) => b[1] - a[1])[0];
    const where = worldId ? `en ${VISIBLE_WORLDS.find((x) => x.id === worldId).name}` : "en el Retreat";
    const o = top(other);
    if (o) { const c = CHARS.find((x) => x.id === o[0]); return `🎭 Dato curioso: ${where}, el personaje que más usan los que no son él es <b>${c ? `${c.emoji} ${c.name}` : o[0]}</b> (${o[1]} ${o[1] === 1 ? "récord" : "récords"})`; }
    const a = top(all);
    if (a && recs.length > 1) { const c = CHARS.find((x) => x.id === a[0]); return `🎭 Dato curioso: ${where}, el personaje más jugado es <b>${c ? `${c.emoji} ${c.name}` : a[0]}</b>, y todos juegan con el suyo`; }
    return "";
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
      ${detailFn ? `<div class="lb2-pod-detail">${esc(detailFn(p))}</div>` : ""}
      <div class="lb2-pod-block">${place}</div>
    </div>`;
  }).join("");
  const rowHtml = (p, pos, value, extra, me, detail) => `<li class="lb2-row${p.name === me ? " me" : ""}"><span class="lb2-pos">${pos}</span>${avatarOf(p.character)}<span class="lb2-name">${esc(p.name)}${detail ? `<small class="lb2-detail">${esc(detail)}</small>` : ""}</span>${extra || ""}<b class="lb2-pts">${fmtN(value)}</b></li>`;
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
      const detailOf = (p) => (general ? "" : statLine(w.id, p.stats));
      const rest = list.slice(3, 50).map((p, i) => rowHtml(p, i + 4, valueOf(p), extra(p), me, detailOf(p))).join("");
      lbModalContent.innerHTML = `
        <div class="lb2-top">
          <div class="lb2-podium">${podiumHtml(list.slice(0, 3), valueOf, me, general ? null : detailOf)}</div>
          <div class="lb2-listbox">
            <div class="lb2-listhead">${general ? "Suma del mejor récord de cada uno en cada mundo · cuenta aunque no termines" : `Mejor partida de cada uno en ${esc(w.name)} · cuenta aunque no termines`}</div>
            ${(() => { const f = funFact(general ? null : w.id); return f ? `<div class="lb2-fun">${f}</div>` : ""; })()}
            <ol class="lb2-list">${rest || `<li class="lb2-row lb2-row-empty">Aún no hay más jugadores… ¡entra en el top!</li>`}</ol>
          </div>
        </div>
        <div class="lb2-me">${myIdx >= 0
          ? `<span class="lb2-me-tag">TÚ</span><span class="lb2-pos">${myIdx + 1}º</span>${avatarOf(list[myIdx].character)}<span class="lb2-name">${esc(me)}${detailOf(list[myIdx]) ? `<small class="lb2-detail">${esc(detailOf(list[myIdx]))}</small>` : ""}</span><b class="lb2-pts">${fmtN(valueOf(list[myIdx]))}</b>`
          : `<span class="lb2-me-tag">TÚ</span><span class="lb2-name">${esc(me)} · todavía sin récord ${general ? "" : "aquí"}</span>${general ? "" : `<button class="lb2-play mini" data-id="${w.id}">▶ Jugar</button>`}`}</div>`;
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
        const idx = CHARS.findIndex((c) => c.id === cid);
        if (idx >= 0) {
          GameState.charIdx = idx;
          updateSpotlight?.();
          compCharsGrid.querySelectorAll(".comp2-char").forEach((c, i) => c.classList.toggle("cur", i === idx));
        }
      });
    });
  }

  // qué se hace en cada mapa, contado para la presentación
  const WORLD_LORE = {
    1: {
      place: "Google for Startups Campus Madrid, la antigua fábrica de ladrillo junto al Palacio Real.",
      steps: ["Terraza de la calle Moreno Nieto con sombrillas que hacen de plataforma", "Campus Café con barra, mesas y un altillo de sofás", "Torre de coworking de cinco plantas: ascensor, rejilla de ventilación y forjados con huecos", "Salas de cristal en lo alto, con fosos y sillas plegables que se hunden", "Gradas del auditorio hasta el escenario del Demo Day, donde espera DATADIS"],
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
    if (!enemyDetailEl) {
      enemyDetailEl = document.createElement("div");
      enemyDetailEl.className = "comp2-edetail hidden";
      compEnemiesGrid.after(enemyDetailEl);
      enemyDetailEl.addEventListener("click", (ev) => {
        const t = ev.target.closest("button");
        if (!t) return;
        if (t.classList.contains("en-back")) return closeEnemyDetail();
        if (t.classList.contains("en-pose")) {
          const big = enemyDetailEl.querySelector(".en-big img"), lab = enemyDetailEl.querySelector(".en-big-lab");
          big.src = t.dataset.src; lab.textContent = t.dataset.label;
          enemyDetailEl.querySelectorAll(".en-pose").forEach((b) => b.classList.toggle("on", b === t));
          return;
        }
        if (t.classList.contains("en-other")) return openEnemyDetail(t.dataset.enemy);
        if (t.classList.contains("en-world")) { closeEnemyDetail(); openWorldDetail(Number(t.dataset.world)); }
      });
    }
    let poses = [];
    try { poses = (await loadPoses()).enemyPoses(id); } catch (err) {}
    const first = poses[0] || { src: e.img || "", label: e.name };
    const w = VISIBLE_WORLDS.find((x) => x.id === e.world);
    enemyDetailEl.innerHTML = `
      <nav class="wd-crumbs"><button class="en-back wd-back">← Enemigos</button><span>›</span><b>${e.name}</b></nav>
      <article class="en-card${e.boss ? " boss" : ""}">
        <div class="en-side">
          <figure class="en-big">${first.src ? `<img src="${first.src}" alt="${e.name}">` : `<span>${e.icon}</span>`}<figcaption class="en-big-lab">${first.label}</figcaption></figure>
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
          <div class="wd-others"><span>Otros enemigos:</span>${ENEMIES_DATA.filter((x) => x.id !== id).map((x) => `<button class="en-other wd-other" data-enemy="${x.id}">${x.icon} ${x.name}</button>`).join("")}</div>
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
    compendiumOv.classList.remove("wd-mode", "en-mode");
    if (worldDetailEl) worldDetailEl.classList.add("hidden");
    if (enemyDetailEl) enemyDetailEl.classList.add("hidden");
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
  // ↩ dentro de la página de un mundo vuelve a la lista; fuera, cierra la historia
  if (btnCloseCompendium) btnCloseCompendium.addEventListener("click", () => (compendiumOv.classList.contains("en-mode") ? closeEnemyDetail() : compendiumOv.classList.contains("wd-mode") ? closeWorldDetail() : closeCompendium()));

  // Start game from Menu: Opens the 5-World Adventure Map!
  function triggerStart() {
    const rawName = (nameInput.value.trim() || "ANON").toUpperCase().slice(0, 12);
    GameState.playerName = rawName;
    try {
      localStorage.setItem("clevergy_player_name", rawName);
    } catch (e) {}

    menuOv.classList.add("hidden");
    lbOv.classList.add("hidden");
    ctrlOv.classList.add("hidden");
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
      if (!lbOv.classList.contains("hidden")) closeLeaderboard();
      if (!ctrlOv.classList.contains("hidden")) ctrlOv.classList.add("hidden");
    }
    if (e.code === "Enter" && !menuOv.classList.contains("hidden") && lbOv.classList.contains("hidden") && ctrlOv.classList.contains("hidden") && (!compendiumOv || compendiumOv.classList.contains("hidden"))) {
      triggerStart();
    }
  });

  return { tryStart: triggerStart, updateSpotlight };
}
