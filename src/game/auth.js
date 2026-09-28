// =============================================================================
// auth.js — Cuenta con Google (opcional y poco intrusiva)
// · Un botón pequeño en la portada: "Entrar" → "Iniciar sesión con Google".
// · Al entrar por primera vez eliges cuál de los 18 eres (por defecto, el del
//   enlace/QR con el que llegaste) y lo confirmas.
// · Con sesión: tu nombre en el ranking es el de tu cuenta, y el progreso de los
//   mundos se guarda en D1 (y se recupera en cualquier móvil).
// En local (vite) no hay /api: el botón simplemente no aparece.
// =============================================================================

import { CHARS, POWER_INFO } from "../config/characters.js";
import { GameState } from "./state.js";
import { loadWorldProgress, mergeWorldProgress } from "../config/worlds.js";
import { getCharacterAvatar } from "../engine/sprites.js";
import { invitedCharId } from "./charRoute.js";

const auth = { user: null, clientId: null, domain: null, ready: false };
window.__cgAuth = auth;

const api = async (path, opts = {}) => {
  const res = await fetch(path, { credentials: "same-origin", headers: { "Content-Type": "application/json" }, ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `HTTP ${res.status}`), { data });
  return data;
};
const avatar = (id) => {
  const src = getCharacterAvatar(id);
  const c = CHARS.find((x) => x.id === id);
  return src ? `<img src="${src}" class="${src.startsWith("data:") ? "px" : ""}" alt="">` : `<span>${c ? c.emoji : "?"}</span>`;
};
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

let gisLoading = null;
function loadGis() {
  if (window.google && window.google.accounts) return Promise.resolve();
  if (!gisLoading) gisLoading = new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.onload = ok; s.onerror = ko;
    document.head.appendChild(s);
  });
  return gisLoading;
}

export function initAuth({ onCharChosen } = {}) {
  // ── piezas de interfaz ──
  const chip = document.createElement("button");
  chip.className = "cg-auth-chip hidden";
  chip.type = "button";
  (document.querySelector("#menuOv .lobby-header-right") || document.body).prepend(chip);

  const panel = document.createElement("div");
  panel.className = "cg-auth-ov hidden";
  panel.innerHTML = `<div class="cg-auth-card" role="dialog" aria-modal="true"></div>`;
  document.body.appendChild(panel);
  const card = panel.firstElementChild;
  panel.addEventListener("click", (e) => { if (e.target === panel && !panel.dataset.lock) close(); });

  const close = () => { panel.classList.add("hidden"); delete panel.dataset.lock; };
  const open = () => { panel.classList.remove("hidden"); };
  auth.open = () => { if (auth.user) showAccount(); else showLogin(); };

  function paintChip() {
    chip.classList.toggle("hidden", !auth.clientId && !auth.user);
    if (auth.user) {
      const c = CHARS.find((x) => x.id === auth.user.character);
      chip.innerHTML = `${auth.user.picture ? `<img class="cg-auth-pic" src="${esc(auth.user.picture)}" alt="" referrerpolicy="no-referrer">` : ""}<span>${esc(auth.user.nick)}</span>${c ? `<i>${c.emoji}</i>` : ""}`;
      chip.title = "Tu cuenta";
    } else {
      chip.innerHTML = `<b class="cg-g">G</b><span>Entrar</span>`;
      chip.title = "Entrar con Google para guardar tu progreso";
    }
  }
  chip.addEventListener("click", () => auth.open());

  async function showLogin(invite) {
    const inv = invite && CHARS.find((c) => c.id === invite);
    card.innerHTML = `
      <button class="cg-auth-x" aria-label="Cerrar">✕</button>
      ${inv ? `<div class="cg-auth-hero">${avatar(inv.id)}</div><h2>¡Hola, ${esc(inv.name.split(" ")[0].toLowerCase().replace(/^./, (m) => m.toUpperCase()))}!</h2>`
            : `<h2>Tu cuenta del Retreat</h2>`}
      <ul class="cg-auth-perks">
        <li>🏆 Tus récords cuentan en el <b>ranking global</b></li>
        <li>💾 Tu progreso se guarda en cualquier móvil</li>
        <li>🪰 Eliges qué personaje eres tú</li>
      </ul>
      <div class="cg-gbtn"><span class="cg-auth-wait">Cargando Google…</span></div>
      ${auth.domain ? `<div class="cg-auth-note">Con tu cuenta @${esc(auth.domain)}</div>` : ""}
      <div class="cg-auth-err hidden"></div>
      <button class="cg-auth-skip">Jugar sin cuenta</button>`;
    card.querySelector(".cg-auth-x").onclick = close;
    card.querySelector(".cg-auth-skip").onclick = close;
    open();
    try {
      await loadGis();
      window.google.accounts.id.initialize({ client_id: auth.clientId, callback: onCredential, ux_mode: "popup", context: "signin", itp_support: true });
      const holder = card.querySelector(".cg-gbtn");
      holder.innerHTML = "";
      window.google.accounts.id.renderButton(holder, { theme: "outline", size: "large", shape: "pill", text: "signin_with", locale: "es", width: 250 });
    } catch (e) {
      card.querySelector(".cg-gbtn").innerHTML = `<span class="cg-auth-wait">No se pudo cargar Google. Revisa la conexión.</span>`;
    }
  }

  async function onCredential(resp) {
    const err = card.querySelector(".cg-auth-err");
    try {
      const { user } = await api("/api/auth/google", { method: "POST", body: JSON.stringify({ credential: resp.credential }) });
      await afterLogin(user);
    } catch (e) {
      if (err) { err.textContent = e.message; err.classList.remove("hidden"); }
    }
  }

  async function afterLogin(user) {
    auth.user = user;
    applyUser();
    window.dispatchEvent(new CustomEvent("cg_auth"));
    // progreso: une el de la cuenta con el de este móvil y guarda el resultado
    mergeWorldProgress(user.progress);
    pushProgress();
    const invite = invitedCharId();
    if (!user.character) showClaim(invite || (CHARS[GameState.charIdx] || CHARS[0]).id, true);
    else { choose(user.character, false); close(); }
  }

  function applyUser() {
    const u = auth.user;
    const nameInput = document.getElementById("nameInput");
    if (u) {
      GameState.playerName = u.nick;
      if (nameInput) { nameInput.value = u.nick; nameInput.readOnly = true; }
      try { localStorage.setItem("clevergy_player_name", u.nick); } catch (e) {}
    } else if (nameInput) nameInput.readOnly = false;
    paintChip();
  }

  function choose(id, save = true) {
    const idx = CHARS.findIndex((c) => c.id === id);
    if (idx < 0) return;
    if (onCharChosen) onCharChosen(idx);
    if (save && auth.user) {
      api("/api/me", { method: "POST", body: JSON.stringify({ character: id }) }).then((r) => { auth.user = r.user; paintChip(); }).catch(() => {});
      auth.user.character = id;
    }
    paintChip();
  }

  // "¿Cuál eres tú?": 18 caras, con la del QR ya marcada; se confirma con un botón
  function showClaim(preId, first) {
    let sel = preId;
    const paintSel = () => {
      const c = CHARS.find((x) => x.id === sel) || CHARS[0];
      card.querySelectorAll(".cg-claim-grid button").forEach((b) => b.classList.toggle("on", b.dataset.id === sel));
      const p = POWER_INFO[c.id] || {};
      card.querySelector(".cg-claim-pick").innerHTML = `<div class="cg-claim-av">${avatar(c.id)}</div><div><b>${esc(c.name)}</b><small>${esc(c.form)}</small><span>${p.icon || "★"} ${esc(c.ab)}</span></div>`;
      card.querySelector(".cg-claim-ok").textContent = `✓ Sí, soy ${c.name.split(" ")[0].toLowerCase().replace(/^./, (m) => m.toUpperCase())}`;
    };
    card.innerHTML = `
      ${first ? "" : `<button class="cg-auth-x" aria-label="Cerrar">✕</button>`}
      <h2>${first ? "¿Cuál de todos eres tú?" : "Cambia tu personaje"}</h2>
      <p class="cg-auth-sub">Será tu personaje por defecto y el que te representa en el ranking.</p>
      <div class="cg-claim">
        <div class="cg-claim-pick"></div>
        <div class="cg-claim-grid">${CHARS.map((c) => `<button type="button" data-id="${c.id}" title="${esc(c.name)}">${avatar(c.id)}</button>`).join("")}</div>
      </div>
      <button class="cg-claim-ok"></button>`;
    card.querySelector(".cg-auth-x")?.addEventListener("click", close);
    card.querySelectorAll(".cg-claim-grid button").forEach((b) => b.addEventListener("click", () => { sel = b.dataset.id; paintSel(); }));
    card.querySelector(".cg-claim-ok").addEventListener("click", () => { choose(sel, true); close(); });
    if (first) panel.dataset.lock = "1";
    paintSel();
    open();
  }

  function showAccount() {
    const u = auth.user;
    const c = CHARS.find((x) => x.id === u.character) || CHARS[GameState.charIdx];
    const prog = loadWorldProgress();
    card.innerHTML = `
      <button class="cg-auth-x" aria-label="Cerrar">✕</button>
      <div class="cg-acc-head">${u.picture ? `<img class="cg-auth-pic big" src="${esc(u.picture)}" alt="" referrerpolicy="no-referrer">` : ""}<div><h2>${esc(u.nick)}</h2><small>${esc(u.email)}</small></div></div>
      <div class="cg-acc-char"><div class="cg-claim-av">${avatar(c.id)}</div><div><small>Tu personaje</small><b>${esc(c.name)}</b></div><button class="cg-acc-change">Cambiar</button></div>
      <div class="cg-acc-stats"><div><b>${prog.completed.length}</b><small>mundos superados</small></div><div><b>${Object.values(prog.highScores).reduce((a, b) => a + (Number(b) || 0), 0).toLocaleString("es-ES")}</b><small>puntos (mejores récords)</small></div></div>
      <button class="cg-auth-skip cg-logout">Cerrar sesión</button>`;
    card.querySelector(".cg-auth-x").onclick = close;
    card.querySelector(".cg-acc-change").onclick = () => showClaim(c.id, false);
    card.querySelector(".cg-logout").onclick = async () => {
      try { await api("/api/auth/logout", { method: "POST" }); } catch (e) {}
      try { window.google?.accounts.id.disableAutoSelect(); } catch (e) {}
      auth.user = null; applyUser(); close(); window.dispatchEvent(new CustomEvent("cg_auth"));
    };
    open();
  }

  let pushT = 0;
  function pushProgress() {
    if (!auth.user) return;
    clearTimeout(pushT);
    pushT = setTimeout(() => {
      const p = loadWorldProgress();
      api("/api/me", { method: "POST", body: JSON.stringify({ progress: { completed: p.completed, highScores: p.highScores, ranks: p.ranks } }) }).catch(() => {});
    }, 400);
  }
  window.addEventListener("cg_progress", pushProgress);

  // ── arranque: ¿hay login configurado? ¿hay sesión? ──
  (async () => {
    try {
      const cfg = await api("/api/auth/config");
      auth.clientId = cfg.clientId; auth.domain = cfg.domain;
    } catch (e) { auth.clientId = null; }
    try {
      const { user } = await api("/api/me");
      if (user) {
        auth.user = user;
        applyUser();
        mergeWorldProgress(user.progress);
        if (user.character) choose(user.character, false);
        else showClaim(invitedCharId() || user.character || (CHARS[GameState.charIdx] || CHARS[0]).id, true);
      }
    } catch (e) {}
    auth.ready = true;
    paintChip();
    // llegó por el QR de un personaje y no tiene sesión: bienvenida con su cara
    const invite = invitedCharId();
    if (!auth.user && auth.clientId && invite) {
      let shown = false;
      try { shown = sessionStorage.getItem("cg_invite_shown") === invite; sessionStorage.setItem("cg_invite_shown", invite); } catch (e) {}
      if (!shown) setTimeout(() => showLogin(invite), 600);
    }
    window.dispatchEvent(new CustomEvent("cg_auth"));
  })();
}
