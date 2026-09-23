// =============================================================================
// doodleNet.js — Salas P2P (WebRTC con PeerJS) para Doodle District
// Topología en estrella: quien crea la sala es el anfitrión y simula enemigos,
// oleadas y puntuación; el resto se conecta a él con un código de 5 letras.
// El servidor público de PeerJS sólo sirve para que los navegadores se encuentren;
// después los datos van directos entre jugadores (STUN, y TURN si hay NAT estricta).
// =============================================================================

import { Peer } from "peerjs";

const PREFIX = "clevergy-doodle-";
export const MAX_PLAYERS = 6;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin números: no chocan con los atajos 1-2-3

const PEER_OPTS = {
  debug: 0,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun.cloudflare.com:3478" },
      {
        urls: ["turn:openrelay.metered.ca:80", "turn:openrelay.metered.ca:443", "turn:openrelay.metered.ca:443?transport=tcp"],
        username: "openrelayproject",
        credential: "openrelayproject"
      }
    ]
  }
};

export const randomCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
export const cleanCode = (s) => String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);

export function createNet() {
  const handlers = {};
  const net = {
    peer: null,
    isHost: false,
    code: null,
    myId: null,
    hostId: null,
    conns: new Map(), // peerId → DataConnection
    get active() { return !!this.peer && (this.isHost || this.conns.size > 0); },
    on(type, fn) { handlers[type] = fn; },
    host, join, send, sendTo, broadcast, destroy
  };
  const emit = (type, msg, from) => { const h = handlers[type]; if (h) h(msg, from); };

  function wire(conn) {
    conn.on("data", (m) => { if (m && m.t) emit(m.t, m, conn.peer); });
    const gone = () => {
      if (!net.conns.has(conn.peer)) return;
      net.conns.delete(conn.peer);
      emit("_leave", {}, conn.peer);
    };
    conn.on("close", gone);
    conn.on("error", gone);
  }

  function host(code) {
    destroy();
    net.isHost = true;
    net.code = code;
    return new Promise((resolve, reject) => {
      const peer = new Peer(PREFIX + code, PEER_OPTS);
      net.peer = peer;
      let opened = false;
      const timer = setTimeout(() => { if (!opened) reject(new Error("El servidor de salas no responde")); }, 10000);
      peer.on("open", (id) => { opened = true; clearTimeout(timer); net.myId = id; net.hostId = id; resolve(id); });
      peer.on("connection", (conn) => {
        if (net.conns.size >= MAX_PLAYERS - 1) {
          conn.on("open", () => { conn.send({ t: "full" }); setTimeout(() => conn.close(), 400); });
          return;
        }
        wire(conn);
        conn.on("open", () => { net.conns.set(conn.peer, conn); emit("_join", {}, conn.peer); });
      });
      peer.on("disconnected", () => { try { peer.reconnect(); } catch (e) {} });
      peer.on("error", (err) => {
        if (!opened) {
          clearTimeout(timer);
          reject(new Error(err.type === "unavailable-id" ? "Ese código ya está en uso" : "No se pudo crear la sala"));
        }
      });
    });
  }

  function join(code) {
    destroy();
    net.isHost = false;
    net.code = code;
    net.hostId = PREFIX + code;
    return new Promise((resolve, reject) => {
      const peer = new Peer(PEER_OPTS);
      net.peer = peer;
      let done = false;
      const fail = (msg) => { if (!done) { done = true; clearTimeout(timer); reject(new Error(msg)); } };
      const timer = setTimeout(() => fail("No se pudo conectar con la sala"), 12000);
      peer.on("open", (id) => {
        net.myId = id;
        const conn = peer.connect(net.hostId, { reliable: true });
        wire(conn);
        conn.on("open", () => {
          net.conns.set(conn.peer, conn);
          if (!done) { done = true; clearTimeout(timer); resolve(id); }
        });
      });
      peer.on("error", (err) => fail(err.type === "peer-unavailable" ? "No existe ninguna sala con ese código" : "Error de conexión"));
    });
  }

  // invitado → anfitrión
  function send(msg) {
    const c = net.conns.get(net.hostId);
    if (c && c.open) c.send(msg);
  }
  function sendTo(id, msg) {
    const c = net.conns.get(id);
    if (c && c.open) c.send(msg);
  }
  // anfitrión → todos (menos `except`)
  function broadcast(msg, except) {
    net.conns.forEach((c, id) => { if (id !== except && c.open) c.send(msg); });
  }

  function destroy() {
    net.conns.forEach((c) => { try { c.close(); } catch (e) {} });
    net.conns.clear();
    if (net.peer) { try { net.peer.destroy(); } catch (e) {} }
    net.peer = null;
    net.myId = null;
  }

  return net;
}
