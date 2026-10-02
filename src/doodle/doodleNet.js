// =============================================================================
// doodleNet.js — Salas P2P (WebRTC con PeerJS) para Doodle District
// Topología en estrella: quien crea la sala es el anfitrión y simula enemigos,
// oleadas y puntuación; el resto se conecta a él con un código de 5 letras.
// El servidor público de PeerJS sólo sirve para que los navegadores se encuentren;
// después los datos van directos entre jugadores (STUN, y TURN si hay NAT estricta).
// =============================================================================

import { Peer } from "peerjs";

const PREFIX = "clevergy-doodle-";
export const MAX_PLAYERS = 20;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin números: no chocan con los atajos 1-2-3

// ─── ICE servers ────────────────────────────────────────────────────────────
// El Worker /api/turn-credentials genera credenciales TURN de corta duración
// usando Cloudflare Realtime TURN (red Anycast global).
// Si el Worker no está disponible, usamos Open Relay como fallback.

const FALLBACK_ICE = [
  { urls: "stun:stun.cloudflare.com:3478" },
  { urls: "stun:stun.l.google.com:19302" },
  {
    urls: [
      "turn:openrelay.metered.ca:80",
      "turn:openrelay.metered.ca:80?transport=tcp",
      "turn:openrelay.metered.ca:443?transport=tcp",
      "turns:openrelay.metered.ca:443"
    ],
    username: "openrelayproject",
    credential: "openrelayproject"
  }
];

let _cachedIce = null; // cache de sesión para no repetir el fetch

async function getIceServers() {
  if (_cachedIce) return _cachedIce;
  try {
    const r = await fetch("/api/turn-credentials", { signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const data = await r.json();
      if (Array.isArray(data.iceServers) && data.iceServers.length) {
        if (data._fallback) {
          // Si el worker responde con fallback (no hay llaves CF TURN configuradas), mantenemos los servidores TURN de respaldo
          _cachedIce = FALLBACK_ICE;
        } else {
          // Cloudflare Realtime TURN (red Anycast global de baja latencia) + respaldo secundario
          _cachedIce = [...data.iceServers, ...FALLBACK_ICE.slice(2)];
        }
        return _cachedIce;
      }
    }
  } catch (e) {
    console.warn("[doodleNet] No se pudo obtener TURN de CF, usando fallback:", e.message);
  }
  _cachedIce = FALLBACK_ICE;
  return _cachedIce;
}

function makePeerOpts(iceServers) {
  return {
    debug: 1,
    config: { iceServers, iceCandidatePoolSize: 10 }
  };
}

export const randomCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
export const cleanCode = (s) => String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);


// `prefix` separa los juegos (shooter / pelea) en el servidor de señalización
export function createNet({ prefix = PREFIX, maxPlayers = MAX_PLAYERS } = {}) {
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

  async function host(code) {
    destroy();
    net.isHost = true;
    net.code = code;
    const iceServers = await getIceServers();
    return new Promise((resolve, reject) => {
      let opened = false;
      const timer = setTimeout(() => {
        if (!opened) {
          destroy();
          reject(new Error("El servidor de salas no responde"));
        }
      }, 10000);

      const peer = new Peer(prefix + code, makePeerOpts(iceServers));
      net.peer = peer;

      peer.on("open", (id) => {
        opened = true;
        clearTimeout(timer);
        net.myId = id;
        net.hostId = id;
        resolve(id);
      });

      peer.on("connection", (conn) => {
        if (net.conns.size >= maxPlayers - 1) {
          conn.on("open", () => {
            conn.send({ t: "full" });
            setTimeout(() => conn.close(), 400);
          });
          return;
        }
        wire(conn);
        conn.on("open", () => {
          net.conns.set(conn.peer, conn);
          emit("_join", {}, conn.peer);
        });
      });

      peer.on("disconnected", () => {
        try { peer.reconnect(); } catch (e) {}
      });

      peer.on("error", (err) => {
        if (!opened) {
          clearTimeout(timer);
          destroy();
          reject(new Error(err.type === "unavailable-id" ? "Ese código ya está en uso" : "No se pudo crear la sala"));
        } else {
          console.warn("[doodleNet host error]", err);
          emit("_error", err);
        }
      });
    });
  }


  async function join(code) {
    destroy();
    net.isHost = false;
    net.code = code;
    net.hostId = prefix + code;
    const iceServers = await getIceServers();

    return new Promise((resolve, reject) => {
      let done = false;
      let attempts = 0;
      const MAX_ATTEMPTS = 4;      // reintenta hasta 4 veces (peer-unavailable puede ser transitorio)
      const RETRY_DELAY = 1500;    // ms entre reintentos
      const GLOBAL_TIMEOUT = 20000;

      const fail = (msg) => {
        if (!done) {
          done = true;
          clearTimeout(globalTimer);
          destroy();
          reject(new Error(msg));
        }
      };

      const globalTimer = setTimeout(
        () => fail("No se pudo conectar con la sala (tiempo de espera agotado)"),
        GLOBAL_TIMEOUT
      );

      function attempt() {
        if (done) return;
        attempts++;

        // Destruir peer anterior sin marcar done
        if (net.peer) { try { net.peer.destroy(); } catch (e) {} net.peer = null; net.myId = null; }

        const peer = new Peer(makePeerOpts(iceServers));
        net.peer = peer;

        peer.on("open", (id) => {
          net.myId = id;
          const conn = peer.connect(net.hostId, { reliable: true });
          wire(conn);

          conn.on("open", () => {
            net.conns.set(conn.peer, conn);
            if (!done) {
              done = true;
              clearTimeout(globalTimer);
              resolve(id);
            }
          });

          conn.on("error", (err) => {
            const detail = err?.type === "negotiation-failed"
              ? "Fallo al negociar la conexión P2P con el anfitrión"
              : (err?.message || "Error al conectar con la sala");
            fail(detail);
          });

          conn.on("close", () => {
            if (!done) fail("La sala se cerró antes de completar la conexión");
          });
        });

        peer.on("error", (err) => {
          if (done) return;
          if (err.type === "peer-unavailable") {
            // Puede ser transitorio si el host acaba de abrirse: reintentar
            if (attempts < MAX_ATTEMPTS) {
              try { peer.destroy(); } catch (e) {}
              setTimeout(attempt, RETRY_DELAY);
            } else {
              fail(`No se ha encontrado ninguna sala con el código ${code}. Comprueba el código e inténtalo de nuevo.`);
            }
          } else if (err.type === "network" || err.type === "server-error" || err.type === "socket-error") {
            fail("Error de conexión con el servidor de salas. Comprueba tu internet.");
          } else {
            fail(`Error de conexión: ${err.type || err.message || "desconocido"}`);
          }
        });
      }

      attempt();
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
