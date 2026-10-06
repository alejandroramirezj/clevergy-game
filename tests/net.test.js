// Salas online: lo que quede de una sala anterior no puede tirar la nueva, y el pulso de
// vida detecta conexiones muertas (PeerJS simulado, sin red)
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const peers = [];
class FakeEmitter {
  constructor() { this.h = {}; }
  on(ev, fn) { (this.h[ev] ||= []).push(fn); return this; }
  emit(ev, ...a) { (this.h[ev] || []).forEach((fn) => fn(...a)); }
}
class FakeConn extends FakeEmitter {
  constructor(peer) { super(); this.peer = peer; this.open = false; this.sent = []; }
  send(m) { this.sent.push(m); }
  close() { if (!this.open) return; this.open = false; this.emit("close"); }
  doOpen() { this.open = true; this.emit("open"); }
}
class FakePeer extends FakeEmitter {
  constructor(id) {
    super();
    this.id = typeof id === "string" ? id : `guest-${peers.length}`;
    this.destroyed = false;
    this.disconnected = false;
    this.conns = [];
    peers.push(this);
  }
  connect(id) { const c = new FakeConn(id); this.conns.push(c); return c; }
  destroy() { this.destroyed = true; }
  reconnect() { this.disconnected = false; this.emit("open", this.id); }
}
vi.mock("peerjs", () => ({ Peer: FakePeer }));

const { createNet } = await import("../src/doodle/doodleNet.js");
const flush = () => new Promise((r) => setImmediate(r));

beforeEach(() => {
  peers.length = 0;
  // sin servidor de credenciales TURN: se usan las de respaldo
  globalThis.fetch = vi.fn(() => Promise.reject(new Error("sin red")));
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "performance"] });
});
afterEach(() => vi.useRealTimers());

describe("salas online", () => {
  it("un reintento de un código malo no destruye la sala que creas después", async () => {
    const net = createNet();
    net.join("ZZZZZ").catch(() => {});
    await vi.advanceTimersByTimeAsync(0);
    await flush();
    peers[0].emit("error", { type: "peer-unavailable" }); // queda un reintento pendiente a 1,5 s
    const hosting = net.host("ABCDE");
    await flush();
    const hostPeer = peers.at(-1);
    hostPeer.emit("open", hostPeer.id);
    await hosting;
    await vi.advanceTimersByTimeAsync(25000); // reintentos y tiempo de espera global de la sala anterior
    expect(hostPeer.destroyed).toBe(false);
    expect(net.peer).toBe(hostPeer);
    expect(peers.filter((p) => p !== hostPeer && !p.destroyed)).toHaveLength(0);
  });

  it("salir mientras se piden las credenciales cancela la sala sin crear un peer huérfano", async () => {
    let release;
    globalThis.fetch = vi.fn(() => new Promise((_, rej) => { release = () => rej(new Error("lenta")); }));
    const net = createNet({ prefix: "test-cancel-" });
    const p = net.host("QWERT");
    net.destroy();
    release?.(); // (si las credenciales ya estaban en caché no hay petición pendiente)
    await expect(p).rejects.toMatchObject({ cancelled: true });
    expect(peers).toHaveLength(0);
  });

  it("el pulso de vida da por ido a quien lleva 20 s callado, pero no a quien sigue hablando", async () => {
    const net = createNet();
    const left = [];
    net.on("_leave", (m, id) => left.push(id));
    const hosting = net.host("PULSO");
    await flush();
    const hp = peers.at(-1);
    hp.emit("open", hp.id);
    await hosting;
    const quiet = new FakeConn("callado"), chatty = new FakeConn("charlatan");
    for (const c of [quiet, chatty]) { hp.emit("connection", c); c.doOpen(); }
    for (let t = 0; t < 24000; t += 1000) {
      chatty.emit("data", { t: "st" });
      await vi.advanceTimersByTimeAsync(1000);
    }
    expect(left).toEqual(["callado"]);
    expect(net.conns.has("charlatan")).toBe(true);
    expect(chatty.sent.some((m) => m.t === "_hb")).toBe(true);
  });

  it("el pulso de vida no se muestra a los mundos (no llega como mensaje)", async () => {
    const net = createNet();
    const got = [];
    net.on("_hb", () => got.push(1));
    const hosting = net.host("NOHB");
    await flush();
    const hp = peers.at(-1);
    hp.emit("open", hp.id);
    await hosting;
    const c = new FakeConn("x");
    hp.emit("connection", c);
    c.doOpen();
    c.emit("data", { t: "_hb" });
    expect(got).toHaveLength(0);
  });

  it("al reconectar con el servidor de salas, el invitado no abre una segunda conexión", async () => {
    const net = createNet();
    const joining = net.join("HOSTX");
    await vi.advanceTimersByTimeAsync(0);
    await flush();
    const gp = peers[0];
    gp.emit("open", gp.id);
    gp.conns[0].doOpen();
    await joining;
    gp.disconnected = true;
    gp.emit("disconnected");
    await vi.advanceTimersByTimeAsync(5000);
    expect(gp.conns).toHaveLength(1);
    expect(net.conns.size).toBe(1);
  });
});
