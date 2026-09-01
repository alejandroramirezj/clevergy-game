let AC = null;
let musicOn = true;

export function ac() {
  if (!AC) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      AC = new AudioCtx();
    }
  }
  return AC;
}

export function sfx(f, d, type = "square", vol = 0.05) {
  try {
    const a = ac();
    if (!a) return;
    if (a.state === "suspended") {
      a.resume();
    }
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + d);
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + d);
  } catch (e) {
    // Ignore audio context errors before user interaction
  }
}

const BASS = [110, 110, 131, 131, 98, 98, 147, 131];
const LEAD = [440, 0, 523, 440, 587, 523, 440, 392, 349, 0, 440, 349, 523, 440, 392, 330];
let mStep = 0;
let mTimer = null;

export function startMusic(getPlayState) {
  if (mTimer) return;
  mTimer = setInterval(() => {
    if (!musicOn) return;
    if (getPlayState && getPlayState() !== "play") return;
    try {
      const a = ac();
      if (!a) return;
      if (a.state === "suspended") a.resume();
      const t = a.currentTime;
      const b = a.createOscillator();
      const bg = a.createGain();
      b.type = "triangle";
      b.frequency.value = BASS[mStep % 8];
      bg.gain.value = 0.03;
      bg.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      b.connect(bg);
      bg.connect(a.destination);
      b.start(t);
      b.stop(t + 0.16);

      const n = LEAD[mStep % 16];
      if (n) {
        const l = a.createOscillator();
        const lg = a.createGain();
        l.type = "square";
        l.frequency.value = n;
        lg.gain.value = 0.018;
        lg.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        l.connect(lg);
        lg.connect(a.destination);
        l.start(t);
        l.stop(t + 0.14);
      }
      mStep++;
    } catch (e) {}
  }, 170);
}

export function stopMusic() {
  if (mTimer) {
    clearInterval(mTimer);
    mTimer = null;
  }
}

export function toggleMusic() {
  musicOn = !musicOn;
  return musicOn;
}

export function isMusicOn() {
  return musicOn;
}
