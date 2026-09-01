import { BOOT_LINES } from "../config/constants.js";
import { CHARS } from "../config/characters.js";
import { GameState, respawn } from "../game/state.js";
import { sfx } from "../engine/audio.js";
import { anim } from "../engine/sprites.js";

export function initOverlays({ onStartGame }) {
  const bootTxt = document.getElementById("bootTxt");
  const bootTitle = document.getElementById("bootTitle");
  const nameInput = document.getElementById("nameInput");
  const teamGrid = document.getElementById("teamGrid");
  const teamOv = document.getElementById("teamOv");
  const teamClose = document.getElementById("teamClose");
  const retryBtn = document.getElementById("retryBtn");
  const restartBtn = document.getElementById("restartBtn");

  // Populate team selector
  CHARS.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "tcell";
    d.dataset.i = i;
    d.innerHTML = `<div class="em">${c.emoji}</div><div class="nm">${c.name}</div><div class="fm">${c.form}<br>${c.ab}</div>`;
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
      toggleTeam(true);
      sfx(700, 0.08);
    });
    teamGrid.appendChild(d);
  });

  function toggleTeam(forceClose) {
    if (GameState.status !== "play" && !GameState.teamOpen) return;
    GameState.teamOpen = forceClose ? false : !GameState.teamOpen;
    teamOv.classList.toggle("hidden", !GameState.teamOpen);
    if (GameState.teamOpen) {
      [...teamGrid.children].forEach((el, i) => el.classList.toggle("sel", i === GameState.charIdx));
    }
  }

  if (teamClose) {
    teamClose.addEventListener("click", () => toggleTeam(true));
  }

  // Boot typewriter animation
  let bootI = 0;
  function bootStep() {
    if (GameState.status !== "boot") return;
    if (bootI < BOOT_LINES.length) {
      const raw = BOOT_LINES[bootI++];
      bootTxt.innerHTML += raw.replace(/##(.*?)##/g, '<span class="err">$1</span>') + "\n";
      sfx(raw.includes("##") ? 180 : 700, 0.04, "square", 0.03);
      setTimeout(bootStep, raw === "" ? 150 : raw.includes("##") ? 480 : 170);
    } else {
      bootTitle.classList.remove("hidden");
      GameState.status = "ready";
      nameInput.focus();
    }
  }

  function tryStart() {
    if (GameState.status === "ready") {
      GameState.playerName = (nameInput.value.trim() || "ANON").toUpperCase().slice(0, 10);
      document.getElementById("bootOv").classList.add("hidden");
      onStartGame();
    } else if (GameState.status === "boot") {
      bootI = BOOT_LINES.length;
      bootTxt.innerHTML = BOOT_LINES.map((l) => l.replace(/##(.*?)##/g, '<span class="err">$1</span>')).join("\n");
      bootTitle.classList.remove("hidden");
      GameState.status = "ready";
    }
  }

  document.getElementById("pressStart")?.addEventListener("pointerdown", tryStart);
  bootTxt?.addEventListener("pointerdown", tryStart);

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

  setTimeout(bootStep, 400);

  return { toggleTeam, tryStart };
}
