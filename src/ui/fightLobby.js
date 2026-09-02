// =============================================================================
// fightLobby.js — Responsive HTML/DOM Fight Lobby with Real WebRTC Multiplayer
// =============================================================================

import { CHARS } from "../config/characters.js";
import { getCharacterAvatar, initSprites } from "../engine/sprites.js";
import { Net, initHost, initGuest, broadcastStartMatch, disconnect } from "../game/fightNet.js";

export const LState = {
  mode: "cpu", // "cpu" | "online"
  selectedIdx: 0, // default Alejandro (index 0)
  roomCode: "",
  opponentChar: null,
  onStart: null,
  onExit: null
};

let initialized = false;

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function showFightLobby(onStart, onExit) {
  initSprites();
  LState.onStart = onStart;
  LState.onExit = onExit;
  LState.mode = "cpu";
  LState.selectedIdx = 0; // Default to Alejandro
  LState.roomCode = generateCode();
  LState.opponentChar = null;

  const modal = document.getElementById("fightLobbyModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  // Reset to CPU mode on open
  const modeCpu = document.getElementById("flModeCpu");
  const modeOnline = document.getElementById("flModeOnline");
  modeCpu?.classList.add("active");
  modeOnline?.classList.remove("active");
  document.getElementById("flOnlineBox")?.classList.add("hidden");

  setupDOM();
  updateUI();
}

export function hideFightLobby() {
  const modal = document.getElementById("fightLobbyModal");
  if (modal) modal.classList.add("hidden");
}

export function updateFightLobby(dt) {}
export function drawFightLobby(cx) {}

function setupDOM() {
  if (initialized) return;
  initialized = true;

  const btnClose = document.getElementById("btnFlClose");
  const btnBackMap = document.getElementById("btnFlBackMap");
  const btnStart = document.getElementById("btnFlStart");
  const btnPrev = document.getElementById("btnFlPrev");
  const btnNext = document.getElementById("btnFlNext");
  const modeCpu = document.getElementById("flModeCpu");
  const modeOnline = document.getElementById("flModeOnline");
  const btnJoin = document.getElementById("btnFlJoin");
  const joinInput = document.getElementById("flJoinInput");
  const btnCopy = document.getElementById("btnFlCopyCode");

  btnClose?.addEventListener("click", () => {
    disconnect();
    hideFightLobby();
    if (LState.onExit) LState.onExit();
  });

  btnBackMap?.addEventListener("click", () => {
    disconnect();
    hideFightLobby();
    if (LState.onExit) LState.onExit();
  });

  btnPrev?.addEventListener("click", () => {
    LState.selectedIdx = (LState.selectedIdx - 1 + CHARS.length) % CHARS.length;
    updateUI();
  });

  btnNext?.addEventListener("click", () => {
    LState.selectedIdx = (LState.selectedIdx + 1) % CHARS.length;
    updateUI();
  });

  btnCopy?.addEventListener("click", () => {
    if (navigator.clipboard && LState.roomCode) {
      navigator.clipboard.writeText(LState.roomCode).then(() => {
        btnCopy.textContent = "✔ COPIADO";
        setTimeout(() => { btnCopy.textContent = "📋 COPIAR"; }, 2000);
      });
    }
  });

  modeCpu?.addEventListener("click", () => {
    disconnect();
    LState.mode = "cpu";
    modeCpu.classList.add("active");
    modeOnline?.classList.remove("active");
    document.getElementById("flOnlineBox")?.classList.add("hidden");
  });

  modeOnline?.addEventListener("click", () => {
    LState.mode = "online";
    modeOnline.classList.add("active");
    modeCpu?.classList.remove("active");
    document.getElementById("flOnlineBox")?.classList.remove("hidden");

    const codeSpan = document.getElementById("flRoomCode");
    if (codeSpan) codeSpan.textContent = LState.roomCode;
    const st = document.getElementById("flOnlineStatus");
    if (st) st.textContent = "Esperando a que tu compañero introduzca el código...";

    // Connect as Host via PeerJS
    initHost(LState.roomCode, CHARS[LState.selectedIdx].id, {
      onOpponentJoin: (oppChar) => {
        LState.opponentChar = oppChar;
        const oppName = CHARS.find((c) => c.id === oppChar)?.name || "Compañero";
        if (st) st.innerHTML = `✅ <strong>${oppName}</strong> conectado. ¡Pulsa "¡A PELEAR!"!`;
        const startBtn = document.getElementById("btnFlStart");
        if (startBtn) startBtn.style.boxShadow = "0 0 25px #42f584";
      },
      onMatchStart: (p1Char, p2Char) => {
        hideFightLobby();
        if (LState.onStart) LState.onStart(p1Char, p2Char, "online");
      },
      onError: (msg) => {
        if (st) st.textContent = `Aviso: ${msg}`;
      }
    });
  });

  btnJoin?.addEventListener("click", () => {
    const code = joinInput?.value.trim().toUpperCase();
    if (!code || code.length < 4) return;
    const st = document.getElementById("flOnlineStatus");
    if (st) st.textContent = `Conectando a la sala ${code}...`;

    initGuest(code, CHARS[LState.selectedIdx].id, {
      onOpponentJoin: (hostChar) => {
        LState.opponentChar = hostChar;
        const hostName = CHARS.find((c) => c.id === hostChar)?.name || "Host";
        if (st) st.innerHTML = `✅ Conectado con <strong>${hostName}</strong>. Esperando inicio del host...`;
      },
      onMatchStart: (p1Char, p2Char) => {
        hideFightLobby();
        if (LState.onStart) LState.onStart(p1Char, p2Char, "online");
      },
      onError: (msg) => {
        if (st) st.textContent = `Error: ${msg}`;
      }
    });
  });

  btnStart?.addEventListener("click", () => {
    const p1Char = CHARS[LState.selectedIdx].id;
    if (LState.mode === "cpu") {
      hideFightLobby();
      // Pick random opponent from coworkers other than p1
      const others = CHARS.filter((c) => c.id !== p1Char);
      const p2Char = others[Math.floor(Math.random() * others.length)].id;
      if (LState.onStart) LState.onStart(p1Char, p2Char, "cpu");
    } else {
      // Online mode: Host broadcasts start to guest
      const p2Char = LState.opponentChar || "ale";
      broadcastStartMatch(p1Char, p2Char);
      hideFightLobby();
      if (LState.onStart) LState.onStart(p1Char, p2Char, "online");
    }
  });

  // Populate mini team strip for quick thumb tap on mobile
  const strip = document.getElementById("flTeamStrip");
  if (strip) {
    strip.innerHTML = "";
    CHARS.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.className = `fl-thumb-btn ${idx === LState.selectedIdx ? "selected" : ""}`;
      btn.title = c.name;
      const av = getCharacterAvatar(c.id);
      btn.innerHTML = `<img src="${av}" alt="${c.name}">`;
      btn.addEventListener("click", () => {
        LState.selectedIdx = idx;
        updateUI();
      });
      strip.appendChild(btn);
    });
  }
}

function updateUI() {
  const c = CHARS[LState.selectedIdx] || CHARS[0];
  const imgEl = document.getElementById("flHeroImg");
  const nameEl = document.getElementById("flHeroName");
  const roleEl = document.getElementById("flHeroRole");
  const abEl = document.getElementById("flHeroAb");
  const tipEl = document.getElementById("flHeroTip");

  if (imgEl) imgEl.src = getCharacterAvatar(c.id);
  if (nameEl) nameEl.textContent = `${c.emoji} ${c.name}`;
  if (roleEl) roleEl.textContent = `Forma: ${c.form}`;
  if (abEl) abEl.textContent = `⚡ ${c.ab}`;
  if (tipEl) tipEl.textContent = c.tip;

  // Update thumb strip selected state
  const thumbs = document.querySelectorAll(".fl-thumb-btn");
  thumbs.forEach((t, i) => {
    if (i === LState.selectedIdx) {
      t.classList.add("selected");
      t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else {
      t.classList.remove("selected");
    }
  });
}
