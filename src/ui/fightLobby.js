// =============================================================================
// fightLobby.js — Responsive HTML/DOM Fight Lobby (Code Clash Arena)
// =============================================================================

import { CHARS } from "../config/characters.js";
import { getCharacterAvatar, initSprites } from "../engine/sprites.js";
import { createRoom, joinRoom, sendReady, disconnect } from "../game/fightNet.js";

export const LState = {
  mode: "cpu", // "cpu" | "online"
  selectedIdx: 0, // default Alejandro (index 0)
  roomCode: "",
  onStart: null,
  onExit: null
};

let initialized = false;

export function showFightLobby(onStart, onExit) {
  initSprites();
  LState.onStart = onStart;
  LState.onExit = onExit;
  LState.mode = "cpu";
  LState.selectedIdx = 0; // Default to Alejandro
  LState.roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

  const modal = document.getElementById("fightLobbyModal");
  if (!modal) return;
  modal.classList.remove("hidden");

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

  btnClose?.addEventListener("click", () => {
    hideFightLobby();
    if (LState.onExit) LState.onExit();
  });

  btnBackMap?.addEventListener("click", () => {
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

  modeCpu?.addEventListener("click", () => {
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

    // Connect to room as Host
    createRoom(
      LState.roomCode,
      CHARS[LState.selectedIdx].id,
      (oppChar) => {
        const st = document.getElementById("flOnlineStatus");
        if (st) st.textContent = `¡Compañero conectado! Pulsa "¡A PELEAR!"`;
      },
      () => {
        // Disconnected
      }
    );
  });

  btnJoin?.addEventListener("click", () => {
    const code = joinInput?.value.trim().toUpperCase();
    if (!code || code.length < 4) return;
    const st = document.getElementById("flOnlineStatus");
    if (st) st.textContent = `Conectando a sala ${code}...`;

    joinRoom(
      code,
      CHARS[LState.selectedIdx].id,
      (oppChar) => {
        if (st) st.textContent = `¡Conectado con rival! Esperando inicio...`;
        sendReady();
        hideFightLobby();
        if (LState.onStart) LState.onStart(CHARS[LState.selectedIdx].id, oppChar, "online");
      },
      (err) => {
        if (st) st.textContent = `Error: no se encontró la sala ${code}`;
      }
    );
  });

  btnStart?.addEventListener("click", () => {
    hideFightLobby();
    const p1Char = CHARS[LState.selectedIdx].id;
    if (LState.mode === "cpu") {
      // Pick random opponent from coworkers other than p1
      const others = CHARS.filter((c) => c.id !== p1Char);
      const p2Char = others[Math.floor(Math.random() * others.length)].id;
      if (LState.onStart) LState.onStart(p1Char, p2Char, "cpu");
    } else {
      sendReady();
      if (LState.onStart) LState.onStart(p1Char, "ale", "online");
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
