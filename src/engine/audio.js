let AC = null;
let musicOn = false; // música deshabilitada

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

// startMusic deshabilitado — la música de fondo fue eliminada del juego
export function startMusic(_getPlayState) { /* no-op */ }

export function stopMusic() { /* no-op */ }

export function toggleMusic() { return false; }

export function isMusicOn() {
  return musicOn;
}
