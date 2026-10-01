import { CHARS, POWER_INFO } from "../config/characters.js";
import { VISIBLE_WORLDS } from "../config/worlds.js";
import { GameState, switchToChar } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { ANIM, SPR, getCharacterAvatar } from "../engine/sprites.js";
import { fetchGlobalLeaderboard } from "../game/leaderboard.js";
import { GOOGLE_G } from "../game/auth.js";

export function initOverlays({ onStartGame, onOpenMap, onPlayWorld }) {
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
        silvia: "SPEEDRUN",
        yair: "BULERÍA"
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
      if (!p.best[world] || score > p.best[world].score) p.best[world] = { score, character: it.character || it.c, rank: it.rank || it.r || "", stats };
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
    if (st.time && worldId !== 6) b.push(`⏱ ${mmss(st.time)}`);
    return b.join(" · ");
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
