// =============================================================================
// doodleAudio.js — Efectos y música 100% sintetizados con Web Audio API
// Cada sonido es un oscilador con envolvente o ruido blanco filtrado.
// =============================================================================

const mtof = (n) => 440 * Math.pow(2, (n - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);

// La música de fondo fue eliminada — sólo se usan efectos de sonido (tone, noise)

// iOS deja el audio "interrupted" (no "suspended") al volver de segundo plano o tras una
// llamada, y sólo se recupera dentro de un gesto: en cada toque/tecla se reanuda lo que
// esté parado, y al ocultarse la app se suspende (no gasta batería ni suena de fondo)
const contexts = new Set();
function wake(ctx) {
  if (ctx.state === "interrupted") ctx.suspend().then(() => ctx.resume()).catch(() => {});
  else if (ctx.state === "suspended") ctx.resume().catch(() => {});
}
function forEachCtx(fn) {
  for (const c of contexts) {
    if (c.state === "closed") contexts.delete(c);
    else fn(c);
  }
}
if (typeof window !== "undefined") {
  for (const ev of ["pointerdown", "touchend", "keydown"]) window.addEventListener(ev, () => forEachCtx(wake), { capture: true, passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") forEachCtx((c) => { if (c.state === "running") c.suspend().catch(() => {}); });
    else forEachCtx(wake);
  });
}

export class DoodleAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
  }

  init() {
    if (this.ctx) return this.resume();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    contexts.add(this.ctx);
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);

    const len = this.ctx.sampleRate;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  resume() {
    if (this.ctx) wake(this.ctx);
  }

  tone({ freq = 440, to = null, dur = 0.15, type = "square", gain = 0.2, delay = 0, at, out }) {
    if (!this.ctx) return;
    const c = this.ctx;
    const t = at !== undefined ? at : c.currentTime + delay;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out || this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  noise({ dur = 0.2, gain = 0.2, filter = "bandpass", freq = 1200, to = null, q = 1, delay = 0, at, out }) {
    if (!this.ctx) return;
    const c = this.ctx;
    const t = at !== undefined ? at : c.currentTime + delay;
    const src = c.createBufferSource();
    src.buffer = this.noiseBuf;
    const f = c.createBiquadFilter();
    f.type = filter;
    f.frequency.setValueAtTime(freq, t);
    if (to) f.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
    f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(out || this.master);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  }

  // ── efectos ──
  shoot() {
    this.noise({ dur: 0.07, gain: 0.35, filter: "highpass", freq: 2500 });
    this.tone({ freq: rnd(900, 1000), to: 380, dur: 0.07, type: "square", gain: 0.08 });
  }
  empty() { this.tone({ freq: 1400, dur: 0.03, type: "square", gain: 0.05 }); }
  reload() {
    this.tone({ freq: 700, dur: 0.05, type: "square", gain: 0.07 });
    this.tone({ freq: 1100, dur: 0.06, type: "square", gain: 0.07, delay: 0.5 });
  }
  hit() { this.tone({ freq: rnd(1500, 1700), dur: 0.04, type: "triangle", gain: 0.12 }); }
  wallHit() { this.noise({ dur: 0.05, gain: 0.12, filter: "bandpass", freq: 3000, q: 2 }); }
  kill() {
    this.noise({ dur: 0.25, gain: 0.3, filter: "lowpass", freq: 1800, to: 200 });
    this.tone({ freq: 520, to: 120, dur: 0.22, type: "sawtooth", gain: 0.1 });
  }
  paperRip() { this.noise({ dur: 0.3, gain: 0.35, filter: "bandpass", freq: 2200, to: 700, q: 0.7 }); }
  hurt() {
    this.tone({ freq: 220, to: 90, dur: 0.2, type: "sawtooth", gain: 0.2 });
    this.noise({ dur: 0.15, gain: 0.2, filter: "lowpass", freq: 900 });
  }
  jump() { this.tone({ freq: 300, to: 560, dur: 0.1, type: "triangle", gain: 0.1 }); }
  dash() { this.noise({ dur: 0.18, gain: 0.25, filter: "bandpass", freq: 600, to: 2400, q: 0.8 }); }
  pickup() {
    this.tone({ freq: 660, dur: 0.08, type: "triangle", gain: 0.15 });
    this.tone({ freq: 990, dur: 0.12, type: "triangle", gain: 0.15, delay: 0.07 });
  }
  invite() { this.tone({ freq: 880, to: 1320, dur: 0.09, type: "sine", gain: 0.1 }); }
  emailBuzz() { this.tone({ freq: rnd(380, 460), dur: 0.1, type: "sawtooth", gain: 0.03 }); }
  ring() {
    for (let i = 0; i < 6; i++) this.tone({ freq: 1800 + (i % 2) * 300, dur: 0.05, type: "square", gain: 0.05, delay: i * 0.07 });
  }
  charge() { this.noise({ dur: 0.4, gain: 0.3, filter: "bandpass", freq: 300, to: 1500, q: 1 }); }
  bossRoar() {
    this.tone({ freq: 95, to: 55, dur: 1.0, type: "sawtooth", gain: 0.35 });
    this.noise({ dur: 0.9, gain: 0.3, filter: "bandpass", freq: 500, q: 0.8 });
  }
  wave() {
    [60, 64, 67, 72].forEach((n, i) => this.tone({ freq: mtof(n + 12), dur: 0.14, type: "triangle", gain: 0.12, delay: i * 0.09 }));
  }
  victory() {
    [72, 76, 79, 84, 79, 84].forEach((n, i) => this.tone({ freq: mtof(n), dur: 0.22, type: "triangle", gain: 0.15, delay: i * 0.13 }));
  }
  lose() {
    [67, 63, 60, 55].forEach((n, i) => this.tone({ freq: mtof(n), dur: 0.3, type: "sawtooth", gain: 0.1, delay: i * 0.2 }));
  }

  // Música de fondo deshabilitada— sólo se conservan los efectos de sonido
  startMusic(_name) { /* no-op */ }

  toggleMusic() { return false; }

  destroy() {
    if (this._mus) clearInterval(this._mus.timer);
    this._mus = null;
    if (this.ctx) this.ctx.close().catch(() => {});
    this.ctx = null;
  }
}
