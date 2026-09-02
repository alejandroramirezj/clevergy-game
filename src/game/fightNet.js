// =============================================================================
// fightNet.js — Peer-to-Peer WebRTC Multiplayer for 2 Mobiles / Browsers
// Powered by PeerJS DataChannels (zero-config, ultra-low latency)
// =============================================================================

import { Peer } from "peerjs";

export const Net = {
  peer: null,
  conn: null,
  isHost: false,
  roomCode: null,
  localCharId: "alejandro",
  remoteCharId: null,
  onOpponentJoin: null,
  onMatchStart: null,
  onRemoteState: null,
  onRemoteDamage: null,
  onRemoteProjectile: null,
  onDisconnect: null,
  status: "idle" // idle | host_waiting | guest_connecting | connected
};

const PEER_PREFIX = "clevergy-clash-";

export function initHost(code, localCharId, callbacks = {}) {
  disconnect();

  Net.isHost = true;
  Net.roomCode = code.toUpperCase().trim();
  Net.localCharId = localCharId;
  Net.onOpponentJoin = callbacks.onOpponentJoin;
  Net.onMatchStart = callbacks.onMatchStart;
  Net.onRemoteState = callbacks.onRemoteState;
  Net.onDisconnect = callbacks.onDisconnect;
  Net.status = "host_waiting";

  const peerId = `${PEER_PREFIX}${Net.roomCode}`;
  
  try {
    Net.peer = new Peer(peerId, {
      debug: 1
    });
  } catch (err) {
    console.error("Peer creation error:", err);
    return;
  }

  Net.peer.on("open", (id) => {
    console.log("Host peer ready with ID:", id);
  });

  Net.peer.on("connection", (conn) => {
    console.log("Guest connected to host!");
    Net.conn = conn;
    setupConnection(conn);

    conn.on("open", () => {
      Net.status = "connected";
      // Send host info to guest
      conn.send({
        type: "host_welcome",
        charId: Net.localCharId
      });
    });
  });

  Net.peer.on("error", (err) => {
    console.warn("Peer error:", err.type, err);
    if (err.type === "unavailable-id") {
      // Code already in use, regenerate code
      if (callbacks.onError) callbacks.onError("Código en uso. Prueba con otro código.");
    }
  });
}

export function initGuest(code, localCharId, callbacks = {}) {
  disconnect();

  Net.isHost = false;
  Net.roomCode = code.toUpperCase().trim();
  Net.localCharId = localCharId;
  Net.onOpponentJoin = callbacks.onOpponentJoin;
  Net.onMatchStart = callbacks.onMatchStart;
  Net.onRemoteState = callbacks.onRemoteState;
  Net.onDisconnect = callbacks.onDisconnect;
  Net.status = "guest_connecting";

  // Guest gets a random peer ID
  Net.peer = new Peer({
    debug: 1
  });

  Net.peer.on("open", () => {
    const hostPeerId = `${PEER_PREFIX}${Net.roomCode}`;
    console.log("Connecting to host peer:", hostPeerId);
    const conn = Net.peer.connect(hostPeerId, {
      reliable: true
    });
    Net.conn = conn;
    setupConnection(conn);

    conn.on("open", () => {
      Net.status = "connected";
      // Send guest info to host
      conn.send({
        type: "guest_hello",
        charId: Net.localCharId
      });
    });
  });

  Net.peer.on("error", (err) => {
    console.warn("Guest peer error:", err);
    if (callbacks.onError) callbacks.onError("No se pudo encontrar la sala. Comprueba el código.");
  });
}

function setupConnection(conn) {
  conn.on("data", (data) => {
    if (!data || !data.type) return;

    if (data.type === "guest_hello") {
      Net.remoteCharId = data.charId;
      if (Net.onOpponentJoin) Net.onOpponentJoin(data.charId);
    } else if (data.type === "host_welcome") {
      Net.remoteCharId = data.charId;
      if (Net.onOpponentJoin) Net.onOpponentJoin(data.charId);
    } else if (data.type === "start_match") {
      if (Net.onMatchStart) Net.onMatchStart(data.p1Char, data.p2Char);
    } else if (data.type === "fighter_state") {
      if (Net.onRemoteState) Net.onRemoteState(data);
    } else if (data.type === "combat_damage") {
      if (Net.onRemoteDamage) Net.onRemoteDamage(data);
    } else if (data.type === "spawn_projectile") {
      if (Net.onRemoteProjectile) Net.onRemoteProjectile(data);
    }
  });

  conn.on("close", () => {
    console.log("Peer connection closed");
    Net.status = "idle";
    if (Net.onDisconnect) Net.onDisconnect();
  });
}

export function broadcastStartMatch(p1Char, p2Char) {
  if (Net.conn && Net.conn.open) {
    Net.conn.send({
      type: "start_match",
      p1Char,
      p2Char
    });
  }
}

let lastSendTime = 0;
export function sendFighterState(f) {
  if (!Net.conn || !Net.conn.open) return;
  const now = performance.now();
  if (now - lastSendTime < 30) return; // throttle to ~33fps
  lastSendTime = now;

  Net.conn.send({
    type: "fighter_state",
    x: Math.round(f.x),
    y: Math.round(f.y),
    vx: Math.round(f.vx * 10) / 10,
    vy: Math.round(f.vy * 10) / 10,
    hp: f.hp,
    facing: f.facing,
    state: f.state,
    stateTime: f.stateTime,
    shieldActive: f.shieldActive
  });
}

export function disconnect() {
  if (Net.conn) {
    try { Net.conn.close(); } catch {}
    Net.conn = null;
  }
  if (Net.peer) {
    try { Net.peer.destroy(); } catch {}
    Net.peer = null;
  }
  Net.status = "idle";
  Net.remoteCharId = null;
}

export function sendCombatDamage(targetSide, damage, isCritical, sourceFacing) {
  if (!Net.conn || !Net.conn.open) return;
  Net.conn.send({
    type: "combat_damage",
    targetSide,
    damage,
    isCritical,
    sourceFacing
  });
}

export function sendSpawnProjectile(projectileData) {
  if (!Net.conn || !Net.conn.open) return;
  Net.conn.send({
    type: "spawn_projectile",
    ...projectileData
  });
}
