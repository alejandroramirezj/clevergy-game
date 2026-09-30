// =============================================================================
// doodleAudio.js — Efectos y música 100% sintetizados con Web Audio API
// Cada sonido es un oscilador con envolvente o ruido blanco filtrado.
// =============================================================================

const mtof = (n) => 440 * Math.pow(2, (n - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);

const MELODY = [72, 0, 76, 79, 0, 76, 74, 72, 69, 0, 72, 74, 76, 0, 74, 0,
                72, 0, 76, 79, 81, 79, 76, 74, 72, 74, 76, 0, 74, 72, 69, 0];
const BASS = [48, 48, 55, 55, 45, 45, 52, 52, 41, 41, 48, 48, 43, 43, 50, 43];

// canciones de cada mundo (notas MIDI; 0 = silencio)
const SONGS = {
  // BoliBic Tag: la de siempre
  doodle: { bpm: 112, lead: "triangle", melody: MELODY, bass: BASS, hat: 4 },
  // La Oficina: alegre y saltarina, de plataformas
  oficina: {
    bpm: 132, lead: "square", leadGain: 0.035, hat: 2,
    melody: [76, 76, 0, 76, 0, 72, 76, 0, 79, 0, 0, 0, 67, 0, 0, 0, 72, 0, 67, 0, 64, 0, 69, 71, 70, 69, 0, 67, 76, 79, 81, 0,
             77, 79, 0, 76, 0, 72, 74, 71, 0, 0, 72, 0, 67, 0, 64, 0, 69, 0, 71, 0, 70, 69, 0, 67, 76, 0, 79, 81, 0, 77, 79, 0],
    bass: [48, 55, 48, 55, 45, 52, 45, 52, 41, 48, 41, 48, 43, 50, 43, 47]
  },
  // Coworking Fight: rápida y con garra
  pelea: {
    bpm: 150, lead: "sawtooth", leadGain: 0.028, hat: 1, kick: 4,
    melody: [69, 0, 69, 72, 0, 69, 74, 0, 72, 0, 69, 0, 67, 69, 0, 0, 69, 0, 69, 72, 0, 76, 74, 0, 72, 74, 72, 69, 67, 0, 64, 0],
    bass: [45, 45, 45, 48, 43, 43, 43, 47, 41, 41, 41, 45, 43, 43, 44, 44]
  },
  // Pantano de San Juan: veraniega, de carrera por el agua
  pantano: {
    bpm: 138, lead: "triangle", leadGain: 0.06, hat: 2, kick: 4,
    melody: [79, 0, 76, 79, 81, 0, 79, 76, 74, 0, 76, 0, 72, 0, 0, 0, 77, 0, 74, 77, 79, 0, 77, 74, 72, 0, 74, 76, 79, 0, 0, 0],
    bass: [48, 52, 55, 52, 45, 48, 52, 48, 41, 45, 48, 45, 43, 47, 50, 47]
  }
};

export class DoodleAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.musicOn = true;
    this._mus = null;
  }

  init() {
    if (this.ctx) return this.resume();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.6;
    this.musicGain.connect(this.master);
    const len = this.ctx.sampleRate;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
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

  // ── música: ukelele de cuaderno a 112 bpm ──
  startMusic(name = "doodle") {
    if (!this.ctx || this._mus) return;
    const song = SONGS[name] || SONGS.doodle;
    const step = 60 / song.bpm / 2;
    this._mus = { next: this.ctx.currentTime + 0.1, i: 0 };
    this._mus.timer = setInterval(() => {
      const m = this._mus;
      if (!m || !this.musicOn) return;
      const now = this.ctx.currentTime;
      if (m.next < now - 0.5) m.next = now + 0.05;
      while (m.next < now + 0.3) {
        const n = song.melody[m.i % song.melody.length];
        if (n) this.tone({ freq: mtof(n), dur: step * 0.9, type: song.lead, gain: song.leadGain || 0.05, at: m.next, out: this.musicGain });
        if (m.i % 2 === 0) {
          const b = song.bass[(m.i >> 1) % song.bass.length];
          this.tone({ freq: mtof(b), dur: step * 1.7, type: "sine", gain: 0.1, at: m.next, out: this.musicGain });
        }
        if (m.i % (song.hat || 4) === (song.hat === 1 ? 0 : Math.floor((song.hat || 4) / 2))) this.noise({ dur: 0.04, gain: 0.05, filter: "highpass", freq: 6000, at: m.next, out: this.musicGain });
        if (song.kick && m.i % song.kick === 0) this.tone({ freq: 110, to: 40, dur: 0.12, type: "sine", gain: 0.16, at: m.next, out: this.musicGain });
        m.next += step;
        m.i++;
      }
    }, 80);
  }

  toggleMusic() {
    this.musicOn = !this.musicOn;
    return this.musicOn;
  }

  destroy() {
    if (this._mus) clearInterval(this._mus.timer);
    this._mus = null;
    if (this.ctx) this.ctx.close().catch(() => {});
    this.ctx = null;
  }
}
