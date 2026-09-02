// =============================================================================
// fightLobby.js — Menú sencillo y directo para World 7 (The Office Arena)
// =============================================================================

import { CHARS } from "../config/characters.js";
import { getCharacterAvatar, SPR, initSprites } from "../engine/sprites.js";
import { Net, createRoom, joinRoom, sendReady, disconnect } from "../game/fightNet.js";
import { GameState } from "../game/state.js";

const LState = {
  mode: "cpu", // "cpu" | "online"
  selectedIdx: 0, // default Alejandro (index 0)
  roomCode: "",
  joinCodeInput: "",
  statusMsg: "",
  onStart: null,
  onExit: null,
  images: {}
};

// Preload Alejandro avatar & other avatars
function getAvatarImg(charId) {
  if (LState.images[charId]) return LState.images[charId];
  const url = getCharacterAvatar(charId);
  if (url) {
    const img = new Image();
    img.src = url;
    LState.images[charId] = img;
    return img;
  }
  return null;
}

let removeListeners = null;

export function showFightLobby(onStart, onExit) {
  initSprites();
  LState.onStart = onStart;
  LState.onExit = onExit;
  LState.mode = "cpu";
  LState.selectedIdx = 0; // Alejandro
  LState.roomCode = "";
  LState.joinCodeInput = "";
  LState.statusMsg = "";

  // Pre-generate a 4-char code in case online is chosen
  LState.roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

  addListeners();
}

export function hideFightLobby() {
  if (removeListeners) {
    removeListeners();
    removeListeners = null;
  }
}

export function updateFightLobby(dt) {
  // Simple idle pulse
}

export function drawFightLobby(cx) {
  const W = GameState.W || 960;
  const H = GameState.H || 540;

  // Background: The Office skyline at night
  const bg = cx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#090e1f");
  bg.addColorStop(0.6, "#0f1633");
  bg.addColorStop(1, "#18244f");
  cx.fillStyle = bg;
  cx.fillRect(0, 0, W, H);

  // Office window silhouettes
  cx.fillStyle = "#141d40";
  for (let i = 0; i < 6; i++) {
    const bx = i * 170 + 40;
    cx.fillRect(bx, 100, 120, 240);
    cx.fillStyle = "#1c2859";
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if ((i + r + c) % 3 === 0) cx.fillRect(bx + 12 + c * 34, 115 + r * 50, 24, 34);
      }
    }
    cx.fillStyle = "#141d40";
  }

  // Neon Floor line
  cx.fillStyle = "#1c2547";
  cx.fillRect(0, H - 90, W, 90);
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 3;
  cx.beginPath();
  cx.moveTo(0, H - 90);
  cx.lineTo(W, H - 90);
  cx.stroke();

  // Header Title
  cx.textAlign = "center";
  cx.fillStyle = "#59d8ff";
  cx.font = "bold 32px monospace";
  cx.shadowColor = "#59d8ff";
  cx.shadowBlur = 12;
  cx.fillText("🏢 THE OFFICE: ARENA DE COMBATE", W / 2, 48);
  cx.shadowBlur = 0;

  cx.fillStyle = "#9fb4e8";
  cx.font = "12px monospace";
  cx.fillText("Combate 1v1 con los personajes de Clevergy en las Oficinas Centrales", W / 2, 70);

  // Mode Selection Buttons (CPU vs Online)
  const isCpu = LState.mode === "cpu";
  const btnCpuX = W / 2 - 180, btnOnlineX = W / 2 + 20, btnY = 92, btnW = 160, btnH = 38;

  // CPU button
  cx.fillStyle = isCpu ? "#42f584" : "#1b2542";
  roundRect(cx, btnCpuX, btnY, btnW, btnH, 8);
  cx.fill();
  cx.strokeStyle = isCpu ? "#fff" : "#59d8ff66";
  cx.lineWidth = 2;
  roundRect(cx, btnCpuX, btnY, btnW, btnH, 8);
  cx.stroke();
  cx.fillStyle = isCpu ? "#06140b" : "#fff";
  cx.font = "bold 13px monospace";
  cx.fillText("🤖 VS CPU", btnCpuX + btnW / 2, btnY + 24);

  // Online button
  cx.fillStyle = !isCpu ? "#ffc857" : "#1b2542";
  roundRect(cx, btnOnlineX, btnY, btnW, btnH, 8);
  cx.fill();
  cx.strokeStyle = !isCpu ? "#fff" : "#59d8ff66";
  cx.lineWidth = 2;
  roundRect(cx, btnOnlineX, btnY, btnW, btnH, 8);
  cx.stroke();
  cx.fillStyle = !isCpu ? "#1c1404" : "#fff";
  cx.font = "bold 13px monospace";
  cx.fillText("🌐 VS AMIGO", btnOnlineX + btnW / 2, btnY + 24);

  // CHARACTER SELECTOR CARD (Center stage)
  const char = CHARS[LState.selectedIdx];
  const cardW = 440, cardH = 210, cardX = W / 2 - cardW / 2, cardY = 145;

  cx.fillStyle = "rgba(10, 16, 36, 0.92)";
  roundRect(cx, cardX, cardY, cardW, cardH, 14);
  cx.fill();
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 2;
  roundRect(cx, cardX, cardY, cardW, cardH, 14);
  cx.stroke();

  // Left & Right Navigation Arrows
  drawArrowBtn(cx, cardX - 52, cardY + cardH / 2 - 22, 44, 44, "◀");
  drawArrowBtn(cx, cardX + cardW + 8, cardY + cardH / 2 - 22, 44, 44, "▶");

  // Character Avatar / Illustration
  const avatarX = cardX + 85, avatarY = cardY + cardH / 2 - 10;
  const avImg = getAvatarImg(char.id);

  cx.save();
  cx.fillStyle = "#1e2c56";
  cx.beginPath();
  cx.arc(avatarX, avatarY, 52, 0, Math.PI * 2);
  cx.fill();
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 2.5;
  cx.stroke();

  if (avImg && avImg.complete && avImg.naturalWidth > 0) {
    cx.drawImage(avImg, avatarX - 44, avatarY - 44, 88, 88);
  } else {
    // Fallback emoji
    cx.font = "46px sans-serif";
    cx.fillText(char.emoji, avatarX, avatarY + 16);
  }
  cx.restore();

  // Character Info
  const textX = cardX + 165;
  cx.textAlign = "left";
  cx.fillStyle = "#ffffff";
  cx.font = "bold 20px monospace";
  cx.fillText(`${char.emoji} ${char.name}`, textX, cardY + 44);

  cx.fillStyle = "#59d8ff";
  cx.font = "12px monospace";
  cx.fillText(`Forma: ${char.form}`, textX, cardY + 70);

  cx.fillStyle = "#ffd25e";
  cx.font = "bold 13px monospace";
  cx.fillText(`Habilidad: ${char.ab}`, textX, cardY + 98);

  cx.fillStyle = "#b8ccf0";
  cx.font = "11px monospace";
  wrapText(cx, char.tip, textX, cardY + 124, 250, 16);

  // Stat meters (Speed & Jump)
  cx.fillStyle = "#9fb4e8";
  cx.font = "10px monospace";
  cx.fillText(`Velocidad: ${char.spd} · Salto: ${char.jump}`, textX, cardY + 185);

  // Online Room Box (if Online mode is active)
  if (!isCpu) {
    const obW = 440, obH = 46, obX = W / 2 - obW / 2, obY = cardY + cardH + 10;
    cx.fillStyle = "rgba(22, 32, 64, 0.9)";
    roundRect(cx, obX, obY, obW, obH, 8);
    cx.fill();
    cx.strokeStyle = "#ffc857";
    cx.lineWidth = 1.5;
    roundRect(cx, obX, obY, obW, obH, 8);
    cx.stroke();

    cx.textAlign = "center";
    cx.fillStyle = "#ffc857";
    cx.font = "bold 12px monospace";
    cx.fillText(`🔑 SALA CREADA: ${LState.roomCode} (Comparte este código)`, W / 2, obY + 28);
  }

  // Bottom action buttons
  const fightBtnW = 240, fightBtnH = 50;
  const fightBtnX = W / 2 - fightBtnW / 2, fightBtnY = H - 76;

  // PLAY BUTTON
  cx.fillStyle = "#42f584";
  roundRect(cx, fightBtnX, fightBtnY, fightBtnW, fightBtnH, 10);
  cx.fill();
  cx.strokeStyle = "#ffffff";
  cx.lineWidth = 2.5;
  roundRect(cx, fightBtnX, fightBtnY, fightBtnW, fightBtnH, 10);
  cx.stroke();

  cx.textAlign = "center";
  cx.fillStyle = "#06140b";
  cx.font = "bold 18px monospace";
  cx.fillText("▶ ¡A PELEAR!", W / 2, fightBtnY + 32);

  // EXIT TO MAP BUTTON (top-left)
  cx.fillStyle = "rgba(12, 18, 38, 0.85)";
  roundRect(cx, 16, 16, 110, 36, 8);
  cx.fill();
  cx.strokeStyle = "#59d8ff66";
  cx.lineWidth = 1.5;
  roundRect(cx, 16, 16, 110, 36, 8);
  cx.stroke();

  cx.fillStyle = "#59d8ff";
  cx.font = "bold 11px monospace";
  cx.fillText("🗺️ MAPA", 71, 38);
}

function drawArrowBtn(cx, x, y, w, h, arrow) {
  cx.fillStyle = "#1e2c56";
  roundRect(cx, x, y, w, h, 8);
  cx.fill();
  cx.strokeStyle = "#59d8ff";
  cx.lineWidth = 2;
  roundRect(cx, x, y, w, h, 8);
  cx.stroke();

  cx.textAlign = "center";
  cx.fillStyle = "#ffffff";
  cx.font = "bold 18px monospace";
  cx.fillText(arrow, x + w / 2, y + h / 2 + 6);
}

function wrapText(cx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = cx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      cx.fillText(line, x, curY);
      line = words[n] + " ";
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  cx.fillText(line, x, curY);
}

function roundRect(cx, x, y, w, h, r) {
  cx.beginPath();
  cx.moveTo(x + r, y);
  cx.lineTo(x + w - r, y);
  cx.quadraticCurveTo(x + w, y, x + w, y + r);
  cx.lineTo(x + w, y + h - r);
  cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  cx.lineTo(x + r, y + h);
  cx.quadraticCurveTo(x, y + h, x, y + h - r);
  cx.lineTo(x, y + r);
  cx.quadraticCurveTo(x, y, x + r, y);
  cx.closePath();
}

function addListeners() {
  const cv = document.getElementById("cv");
  const onPointerDown = (e) => {
    const rect = cv.getBoundingClientRect();
    const W = GameState.W || 960;
    const H = GameState.H || 540;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const px = (clientX - rect.left) * (W / rect.width);
    const py = (clientY - rect.top) * (H / rect.height);

    // Click MAPA
    if (px >= 16 && px <= 126 && py >= 16 && py <= 52) {
      hideFightLobby();
      if (LState.onExit) LState.onExit();
      return;
    }

    // Toggle CPU mode
    const btnCpuX = W / 2 - 180, btnOnlineX = W / 2 + 20, btnY = 92, btnW = 160, btnH = 38;
    if (px >= btnCpuX && px <= btnCpuX + btnW && py >= btnY && py <= btnY + btnH) {
      LState.mode = "cpu";
      return;
    }
    // Toggle Online mode
    if (px >= btnOnlineX && px <= btnOnlineX + btnW && py >= btnY && py <= btnY + btnH) {
      LState.mode = "online";
      return;
    }

    // Prev character arrow
    const cardW = 440, cardH = 210, cardX = W / 2 - cardW / 2, cardY = 145;
    if (px >= cardX - 52 && px <= cardX - 8 && py >= cardY + cardH / 2 - 22 && py <= cardY + cardH / 2 + 22) {
      LState.selectedIdx = (LState.selectedIdx - 1 + CHARS.length) % CHARS.length;
      return;
    }
    // Next character arrow
    if (px >= cardX + cardW + 8 && px <= cardX + cardW + 52 && py >= cardY + cardH / 2 - 22 && py <= cardY + cardH / 2 + 22) {
      LState.selectedIdx = (LState.selectedIdx + 1) % CHARS.length;
      return;
    }

    // Click ¡A PELEAR!
    const fightBtnW = 240, fightBtnH = 50;
    const fightBtnX = W / 2 - fightBtnW / 2, fightBtnY = H - 76;
    if (px >= fightBtnX && px <= fightBtnX + fightBtnW && py >= fightBtnY && py <= fightBtnY + fightBtnH) {
      hideFightLobby();
      const p1Char = CHARS[LState.selectedIdx].id;
      // If CPU, pick another random coworker (e.g. Ale Graciano)
      let p2Char = "ale";
      if (p1Char === "ale") p2Char = "alvaroM";

      if (LState.onStart) {
        LState.onStart(p1Char, p2Char, LState.mode);
      }
    }
  };

  const onKey = (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
      LState.selectedIdx = (LState.selectedIdx - 1 + CHARS.length) % CHARS.length;
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
      LState.selectedIdx = (LState.selectedIdx + 1) % CHARS.length;
    } else if (e.code === "Enter" || e.code === "Space") {
      hideFightLobby();
      const p1Char = CHARS[LState.selectedIdx].id;
      let p2Char = p1Char === "alejandro" ? "ale" : "alejandro";
      if (LState.onStart) LState.onStart(p1Char, p2Char, LState.mode);
    }
  };

  window.addEventListener("mousedown", onPointerDown);
  window.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("keydown", onKey);

  removeListeners = () => {
    window.removeEventListener("mousedown", onPointerDown);
    window.removeEventListener("touchstart", onPointerDown);
    window.removeEventListener("keydown", onKey);
  };
}

export { LState };
