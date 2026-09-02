// =============================================================================
// fightNet.js — Cloudflare WebSocket client for online 1v1
// =============================================================================

const BASE =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? `${location.protocol}//${location.hostname}:${location.port}`
    : "";

export const Net = {
  ws: null,
  playerIdx: null,    // 0 = P1, 1 = P2
  code: null,
  state: "idle",      // idle | connecting | waiting | ready | fighting | error
  ping: 0,
  _pingT: null,
  onMessage: null     // callback set by fightLobby
};

export async function createRoom() {
  const resp = await fetch(`${BASE}/api/fight/create`, { method: "POST" });
  if (!resp.ok) throw new Error("No se pudo crear la sala");
  const { code } = await resp.json();
  Net.code = code;
  await connectToRoom(code);
  return code;
}

export async function joinRoom(code) {
  Net.code = code.toUpperCase().trim();
  await connectToRoom(Net.code);
}

async function connectToRoom(code) {
  Net.state = "connecting";

  return new Promise((resolve, reject) => {
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const host =
      location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? `${location.hostname}:${location.port}`
        : location.host;

    const url = `${proto}//${host}/api/fight/join/${code}`;
    Net.ws = new WebSocket(url);

    Net.ws.addEventListener("open", () => {
      Net.state = "waiting";
      startPing();
      resolve();
    });

    Net.ws.addEventListener("message", e => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }

      if (msg.type === "welcome") {
        Net.playerIdx = msg.playerIdx;
      } else if (msg.type === "pong") {
        Net.ping = Math.round(performance.now() - msg.t);
      } else if (Net.onMessage) {
        Net.onMessage(msg);
      }
    });

    Net.ws.addEventListener("close", () => {
      Net.state = "idle";
      stopPing();
      if (Net.onMessage) Net.onMessage({ type: "opponent_disconnected" });
    });

    Net.ws.addEventListener("error", () => {
      Net.state = "error";
      reject(new Error("WebSocket error"));
    });
  });
}

// Send local player inputs every frame
export function sendInput(p) {
  if (!Net.ws || Net.ws.readyState !== WebSocket.OPEN) return;
  Net.ws.send(JSON.stringify({
    type: "input",
    keys: {
      left: p.lastKeys?.left,
      right: p.lastKeys?.right,
      jump: p.lastKeys?.jump,
      attack: p.lastKeys?.attack,
      special: p.lastKeys?.special
    },
    x: p.x, y: p.y,
    vx: p.vx, vy: p.vy,
    hp: p.hp,
    anim: p.state
  }));
}

export function sendEvent(event, data = {}) {
  if (!Net.ws || Net.ws.readyState !== WebSocket.OPEN) return;
  Net.ws.send(JSON.stringify({ type: "event", event, data }));
}

export function sendReady(charId, name) {
  if (!Net.ws || Net.ws.readyState !== WebSocket.OPEN) return;
  Net.ws.send(JSON.stringify({ type: "select_char", charId, name }));
  Net.ws.send(JSON.stringify({ type: "ready" }));
}

export function disconnect() {
  stopPing();
  if (Net.ws) { try { Net.ws.close(); } catch {} Net.ws = null; }
  Net.state = "idle";
  Net.code = null;
  Net.playerIdx = null;
}

function startPing() {
  Net._pingT = setInterval(() => {
    if (Net.ws?.readyState === WebSocket.OPEN) {
      Net.ws.send(JSON.stringify({ type: "ping", t: performance.now() }));
    }
  }, 2000);
}

function stopPing() {
  if (Net._pingT) { clearInterval(Net._pingT); Net._pingT = null; }
}
