import { BOOT_LINES } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { GameState, respawn, fmtT } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { anim, getCharacterAvatar } from "../engine/sprites.js";
import { fetchGlobalLeaderboard } from "../game/leaderboard.js";

export function initOverlays({ onStartGame }) {
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

    // Update Game Boy portrait hero hub
    const gbHubAvatar = document.getElementById("gbHubAvatar");
    const gbHubName = document.getElementById("gbHubName");
    const gbHubForm = document.getElementById("gbHubForm");
    if (gbHubAvatar) {
      const av = getCharacterAvatar(c.id);
      if (av) gbHubAvatar.src = av;
    }
    if (gbHubName) gbHubName.textContent = c.name;
    if (gbHubForm) gbHubForm.textContent = c.form;
  }

  // Populate team selector (18 characters)
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

  // Game Boy Central Hero Hub Controls
  const gbPrevChar = document.getElementById("gbPrevChar");
  const gbNextChar = document.getElementById("gbNextChar");
  const gbHeroBadge = document.getElementById("gbHeroBadge");
  const gbOpenTeamBtn = document.getElementById("gbOpenTeamBtn");

  if (gbPrevChar) {
    gbPrevChar.addEventListener("click", () => {
      GameState.charIdx = (GameState.charIdx - 1 + CHARS.length) % CHARS.length;
      GameState.P.ball = false;
      GameState.P.roll = 0;
      GameState.P.slide = 0;
      anim.lock = null;
      anim.name = "idle";
      anim.frame = 0;
      anim.t = 0;
      GameState.switchBanner = 1.6;
      updateSpotlight();
      sfx(520, 0.06, "square");
    });
  }

  if (gbNextChar) {
    gbNextChar.addEventListener("click", () => {
      GameState.charIdx = (GameState.charIdx + 1) % CHARS.length;
      GameState.P.ball = false;
      GameState.P.roll = 0;
      GameState.P.slide = 0;
      anim.lock = null;
      anim.name = "idle";
      anim.frame = 0;
      anim.t = 0;
      GameState.switchBanner = 1.6;
      updateSpotlight();
      sfx(520, 0.06, "square");
    });
  }

  if (gbHeroBadge) {
    gbHeroBadge.addEventListener("click", () => toggleTeam());
  }

  if (gbOpenTeamBtn) {
    gbOpenTeamBtn.addEventListener("click", () => toggleTeam());
  }

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

  // Start game from Menu
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
