// =============================================================================
// FIGHT ROOM — Cloudflare Durable Object
// WebSocket relay for 1v1 real-time fighting game
// =============================================================================

export class FightRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.sessions = []; // max 2 WebSocket sessions
    this.roomCode = null;
    this.players = {}; // { sessionId: { charId, name, ready } }
    this.lastActivity = Date.now();
    this.timeout = null;
  }

  // Handle HTTP upgrade → WebSocket
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // GET /status — check room availability
    if (request.method === "GET" && path.endsWith("/status")) {
      const count = this.sessions.length;
      return Response.json({
        players: count,
        full: count >= 2,
        code: this.roomCode
      });
    }

    // WebSocket upgrade
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    if (this.sessions.length >= 2) {
      return new Response("Room full", { status: 409 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    this.state.acceptWebSocket(server);

    const sessionId = crypto.randomUUID();
    const playerIdx = this.sessions.length; // 0 = P1, 1 = P2

    this.sessions.push({ ws: server, id: sessionId, playerIdx });
    this.players[sessionId] = { charId: null, name: null, ready: false };
    this.lastActivity = Date.now();

    this.broadcast({ type: "join", playerIdx, total: this.sessions.length }, sessionId);

    // Send welcome with assigned player index
    server.send(JSON.stringify({
      type: "welcome",
      playerIdx,
      code: this.roomCode
    }));

    // Both players connected → notify start
    if (this.sessions.length === 2) {
      this.broadcast({ type: "both_connected" });
    }

    return new Response(null, { status: 101, webSocket: client });
  }

  // Handle incoming WebSocket messages
  async webSocketMessage(ws, raw) {
    this.lastActivity = Date.now();
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    const session = this.sessions.find(s => s.ws === ws);
    if (!session) return;

    switch (msg.type) {
      // Player picked a character
      case "select_char":
        this.players[session.id].charId = msg.charId;
        this.players[session.id].name = msg.name;
        this.broadcastExcept(ws, { type: "opponent_char", charId: msg.charId, name: msg.name });
        break;

      // Player ready
      case "ready":
        this.players[session.id].ready = true;
        const allReady = Object.values(this.players).every(p => p.ready);
        if (allReady) this.broadcast({ type: "fight_start" });
        break;

      // Game input — relay to opponent immediately
      case "input":
        this.broadcastExcept(ws, {
          type: "opponent_input",
          keys: msg.keys,
          x: msg.x,
          y: msg.y,
          vx: msg.vx,
          vy: msg.vy,
          hp: msg.hp,
          anim: msg.anim,
          frame: msg.frame
        });
        break;

      // Fight event (hit, death, round end)
      case "event":
        this.broadcastExcept(ws, { type: "opponent_event", event: msg.event, data: msg.data });
        break;

      // Ping/pong for latency
      case "ping":
        ws.send(JSON.stringify({ type: "pong", t: msg.t }));
        break;
    }
  }

  async webSocketClose(ws) {
    this.sessions = this.sessions.filter(s => s.ws !== ws);
    this.broadcast({ type: "opponent_disconnected" });
  }

  async webSocketError(ws) {
    await this.webSocketClose(ws);
  }

  broadcast(msg, excludeId = null) {
    const str = JSON.stringify(msg);
    for (const s of this.sessions) {
      if (s.id !== excludeId) {
        try { s.ws.send(str); } catch {}
      }
    }
  }

  broadcastExcept(ws, msg) {
    const str = JSON.stringify(msg);
    for (const s of this.sessions) {
      if (s.ws !== ws) {
        try { s.ws.send(str); } catch {}
      }
    }
  }
}

// =============================================================================
// HTTP Worker — Routes for room creation and lookup
// =============================================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Upgrade, Connection"
        }
      });
    }

    const corsHeaders = { "Access-Control-Allow-Origin": "*" };

    // POST /api/fight/create — create a new room
    if (path === "/api/fight/create" && request.method === "POST") {
      const code = generateCode();
      const id = env.FIGHT_ROOM.idFromName(code);
      const stub = env.FIGHT_ROOM.get(id);

      // Initialise the room's code
      const initResp = await stub.fetch(new Request(`https://internal/init`, {
        method: "POST",
        body: JSON.stringify({ code })
      }));

      return Response.json({ code }, { headers: corsHeaders });
    }

    // GET /api/fight/status/:code — check room status
    if (path.startsWith("/api/fight/status/") && request.method === "GET") {
      const code = path.split("/").pop().toUpperCase();
      const id = env.FIGHT_ROOM.idFromName(code);
      const stub = env.FIGHT_ROOM.get(id);
      const resp = await stub.fetch(new Request(`https://internal/status`));
      const data = await resp.json();
      return Response.json(data, { headers: corsHeaders });
    }

    // WebSocket /api/fight/join/:code — connect to room
    if (path.startsWith("/api/fight/join/") && request.method === "GET") {
      const code = path.split("/").pop().toUpperCase();
      const id = env.FIGHT_ROOM.idFromName(code);
      const stub = env.FIGHT_ROOM.get(id);
      return stub.fetch(request);
    }

    return new Response("Not found", { status: 404, headers: corsHeaders });
  }
};

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
