// =============================================================================
// voice.js — Sistema de voz y frases de los personajes de Clevergy
// Cada personaje tiene su propia voz, tono, velocidad y frases icónicas.
// Utiliza Web Speech API (speechSynthesis) con efectos de audio retro y bocadillos cómic.
// =============================================================================

import { CHARS } from "../config/characters.js";
import { GameState } from "../game/state.js";

// Índices de rotación para personajes con múltiples frases
const phraseIndices = {};
let lastSpokenTime = 0;
let proximityChecker = null;

// Permite a cualquier minijuego registrar un callback de proximidad
export function setProximityChecker(fn) {
  proximityChecker = fn;
}

// Configuración de perfiles de voz (pitch & rate) inspirados en arquetipos:
// Narrador: pitch 1.0, rate 0.9
// Loco / Cómico: pitch 1.7, rate 1.3
// Boss / Forzudo: pitch 0.5, rate 0.75
// Robot: pitch 0.8, rate 1.1
export const VOICE_PROFILES = {
  // Arquetipos generales
  narrator: { pitch: 1.0, rate: 0.9, emoji: "📜", name: "NARRADOR" },
  boss: { pitch: 0.5, rate: 0.75, emoji: "👹", name: "BOSS" },
  hero: { pitch: 1.05, rate: 1.0, emoji: "⭐", name: "HÉROE" },
  robot: { pitch: 0.8, rate: 1.1, emoji: "🤖", name: "ROBOT" },
  loco: { pitch: 1.7, rate: 1.3, emoji: "🤪", name: "PERSONAJE LOCO" },

  // Personajes del juego Clevergy
  alejandro: { pitch: 1.05, rate: 1.05, preferGender: "male" },
  ale: { pitch: 0.95, rate: 0.98, preferGender: "male" },
  alvaroM: { pitch: 0.82, rate: 1.05, preferGender: "male" }, // calculadora / robot
  alvaroP: { pitch: 1.02, rate: 0.96, preferGender: "male" }, // podcaster
  ana: { pitch: 1.25, rate: 1.08, preferGender: "female" },
  beltran: { pitch: 1.1, rate: 1.2, preferGender: "male" }, // rápido y comercial
  bruno: { pitch: 0.52, rate: 0.78, preferGender: "male" }, // tótem / boss
  gonzalo: { pitch: 1.65, rate: 1.25, preferGender: "male" }, // loco / chistes
  javi: { pitch: 0.92, rate: 1.06, preferGender: "male" }, // aprendizaje vectorizado
  jesus: { pitch: 0.82, rate: 0.92, preferGender: "male" }, // cruzcampo / kétchup
  joseluis: { pitch: 0.88, rate: 1.02, preferGender: "male" }, // impresora 3D
  josu: { pitch: 1.05, rate: 1.02, preferGender: "male" },
  juan: { pitch: 0.94, rate: 1.04, preferGender: "male" }, // cloud & charca
  maca: { pitch: 1.35, rate: 1.22, preferGender: "female" }, // vivaz voleibol
  manu: { pitch: 0.72, rate: 1.0, preferGender: "male" }, // forzudo
  pablo: { pitch: 1.22, rate: 1.26, preferGender: "male" }, // nano nano rápido
  paloma: { pitch: 1.18, rate: 0.9, preferGender: "female" }, // batería social
  silvia: { pitch: 1.22, rate: 1.24, preferGender: "female" }, // speedrun decidida
  yair: { pitch: 0.98, rate: 1.05, preferGender: "male" }
};

// Generador de audio retro (bip cómic / sfx antes de hablar)
let audioCtx = null;
function playSpeechSfx(pitch = 1) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";

    const baseFreq = 300 * Math.max(0.5, Math.min(2.2, pitch));
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    // Si el navegador no permite audio aún, no pasa nada
  }
}

/**
 * Obtiene el objeto personaje a partir de ID o índice
 */
export function getCharObj(charOrId) {
  if (!charOrId) {
    return CHARS[GameState?.charIdx ?? 0] || CHARS[0];
  }
  if (typeof charOrId === "object") {
    const objId = charOrId.id || charOrId.charId || charOrId.c;
    if (objId && typeof objId === "string") {
      const found = CHARS.find((c) => c.id.toLowerCase() === objId.toLowerCase());
      if (found) return found;
    }
    return charOrId;
  }
  const idLower = String(charOrId).toLowerCase().trim();
  let normId = idLower;
  if (idLower === "jair") normId = "yair";
  else if (idLower === "merino" || idLower === "alvaromerino") normId = "alvarom";
  else if (idLower === "alvaro" || idLower === "alvarop") normId = "alvarop";

  return CHARS.find((c) => c.id.toLowerCase() === normId) ||
         CHARS.find((c) => c.id.toLowerCase().includes(normId)) ||
         CHARS[0];
}

/**
 * Obtiene la siguiente frase correspondiente para el personaje dado,
 * teniendo en cuenta proximidad a Álvaro P. (para Jesús), alternancias y chistes.
 */
export function getCharacterPhrase(charOrId, opts = {}) {
  const c = getCharObj(charOrId);
  const id = c.id;

  // 1. Caso especial Jesús: si se acerca Álvaro P.
  if (id === "jesus") {
    const nearAlvaro = opts.nearAlvaro ?? (proximityChecker ? proximityChecker("jesus", "alvaroP") : false);
    if (nearAlvaro) {
      return {
        char: c,
        phrase: "¿Quiere un poquito de kétchup, Álvaro?"
      };
    }
    return {
      char: c,
      phrase: "¿Nos echamos una Cruzcampo?"
    };
  }

  // 2. Caso especial Gonzalo (chistes aleatorios cortos)
  if (id === "gonzalo") {
    const jokes = c.voice || [
      "¿Por qué los pájaros vuelan hacia el sur? Porque es demasiado lejos para ir andando.",
      "¿Qué le dice un semáforo a otro? No me mires, que me estoy cambiando.",
      "¿Cómo se llama el campeón de buceo de España? Ahogaíto.",
      "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
      "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.",
      "¿Qué le dice un jardinero a otro? Me pasa la vida arreglando entuertos.",
      "¿Cuál es el colmo de un electricista? Que su hijo sea una luz y su mujer una lámpara.",
      "¿Por qué los esqueletos no se pelean? Porque no tienen agallas."
    ];
    return {
      char: c,
      phrase: jokes[Math.floor(Math.random() * jokes.length)]
    };
  }

  // 3. Personajes con rotación de frases (Beltrán, Juan, Javi, José Luis, etc.)
  if (Array.isArray(c.voice) && c.voice.length > 1) {
    const currentIdx = phraseIndices[id] || 0;
    const phrase = c.voice[currentIdx % c.voice.length];
    phraseIndices[id] = currentIdx + 1;
    return { char: c, phrase };
  }

  if (c.voice && c.voice.length > 0) {
    return { char: c, phrase: c.voice[0] };
  }

  return { char: c, phrase: "¡Vamos!" };
}

// Contenedor visual del bocadillo
let activeBubbleTimer = null;

export function showSpeechBubble(char, phrase) {
  if (typeof window === "undefined") return;

  const iw = window.innerWidth, ih = window.innerHeight;
  const isLandscape = iw > ih;

  // Opción 2: si en móvil horizontal la pantalla es muy pequeña y no cabe holgado,
  // no mostramos el texto y dejamos que sólo se escuche el audio para no tapar el juego.
  if (isLandscape && (ih <= 330 || iw <= 560)) {
    return;
  }

  let bubble = document.getElementById("doodleSpeechBubble");
  if (!bubble) {
    bubble = document.createElement("div");
    bubble.id = "doodleSpeechBubble";
    bubble.className = "doodle-speech-bubble";
    document.body.appendChild(bubble);
  }

  const emoji = char.emoji || "💬";
  const name = char.name || "PERSONAJE";

  bubble.innerHTML = `
    <div class="dsb-header">
      <span class="dsb-emoji">${emoji}</span>
      <span class="dsb-name">${name}</span>
    </div>
    <div class="dsb-text">«${phrase}»</div>
    <div class="dsb-tip"></div>
  `;

  bubble.classList.remove("hidden", "dsb-fadeout");
  void bubble.offsetWidth; // Forzar reflow para reiniciar animación pop
  bubble.classList.add("dsb-pop");

  if (activeBubbleTimer) clearTimeout(activeBubbleTimer);
  // En horizontal desaparece más ágilmente (2.6s) para despejar la vista
  const duration = isLandscape ? 2600 : 3800;
  activeBubbleTimer = setTimeout(() => {
    bubble.classList.add("dsb-fadeout");
    setTimeout(() => {
      bubble.classList.add("hidden");
    }, 350);
  }, duration);
}

/**
 * Selecciona la mejor voz disponible del sistema
 */
function pickSystemVoice(profile = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
  if (!voices || voices.length === 0) return null;

  const esVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  const pool = esVoices.length > 0 ? esVoices : voices;

  if (profile.preferGender === "female") {
    const female = pool.find((v) => /monica|paulina|helena|laura|victoria|lucia|paloma|carmen|conchita|maria/i.test(v.name));
    if (female) return female;
  } else if (profile.preferGender === "male") {
    const male = pool.find((v) => /jorge|diego|enrique|carlos|miguel|pablo|alvaro|juan|manuel/i.test(v.name));
    if (male) return male;
  }

  // Voz en español predeterminada o la primera disponible
  const esDefault = pool.find((v) => v.default && v.lang.startsWith("es")) || pool[0];
  return esDefault || null;
}

/**
 * Habla una frase mediante SpeechSynthesis del sistema con modulación
 */
function speakTextSystem(phrase, profile = {}) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(phrase);
    u.lang = "es-ES";
    u.pitch = typeof profile.pitch === "number" ? profile.pitch : 1.0;
    u.rate = typeof profile.rate === "number" ? profile.rate : 1.0;

    const matchedVoice = pickSystemVoice(profile);
    if (matchedVoice) u.voice = matchedVoice;

    playSpeechSfx(u.pitch);
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn("SpeechSynthesis error:", e);
  }
}

/**
 * Habla la frase del personaje (audio sintetizado + bocadillo visual)
 * @param {string|object} [charOrId] - personaje a hablar
 * @param {object} [opts]
 * @param {boolean} [opts.silent] - si es true, sólo muestra bocadillo sin audio
 * @param {string} [opts.phrase] - sobreescribe la frase directamente
 * @param {boolean} [opts.nearAlvaro] - true si Álvaro P. está cerca
 * @param {function} [opts.onBroadcast] - callback con ({ charId, phrase }) para multijugador
 */
export function speakCharacter(charOrId, opts = {}) {
  const now = Date.now();
  if (!opts.force && now - lastSpokenTime < 500) return;
  lastSpokenTime = now;

  let charObj, phrase;
  if (opts.phrase) {
    charObj = getCharObj(charOrId);
    phrase = opts.phrase;
  } else {
    const res = getCharacterPhrase(charOrId, opts);
    charObj = res.char;
    phrase = res.phrase;
  }

  // 1. Bocadillo visual: por defecto apagado para no tapar la visión del juego (sólo audio)
  if (opts.showBubble) {
    showSpeechBubble(charObj, phrase);
  }

  // 2. Multijugador broadcast si se especifica
  if (opts.onBroadcast) {
    try {
      opts.onBroadcast({ charId: charObj.id, phrase });
    } catch (e) {
      console.warn("broadcast voice error", e);
    }
  }

  // 3. Audio mediante SpeechSynthesis y perfiles de tono/velocidad
  if (!opts.silent) {
    const profile = VOICE_PROFILES[charObj.id] || VOICE_PROFILES.hero;
    speakTextSystem(phrase, profile);
  }

  return { char: charObj, phrase };
}

/**
 * Atajo para hablar con el personaje activo actual
 */
export function speakCurrentChar(opts = {}) {
  const c = CHARS[GameState?.charIdx ?? 0] || CHARS[0];
  return speakCharacter(c, opts);
}

/**
 * Mini capa sencilla solicitada:
 * say("narrator", "Bienvenido al mundo de Clevergy.");
 * say("boss", "¡JAJAJA! ¿Creías que sería tan fácil?");
 * say("hero", "Voy a derrotarte.");
 */
export function say(roleOrChar, text, opts = {}) {
  const key = String(roleOrChar).toLowerCase().trim();
  const profile = VOICE_PROFILES[key] || VOICE_PROFILES.hero;

  const charInfo = {
    id: key,
    name: profile.name || (getCharObj(key)?.name ?? key.toUpperCase()),
    emoji: profile.emoji || (getCharObj(key)?.emoji ?? "💬")
  };

  showSpeechBubble(charInfo, text);

  if (!opts.silent) {
    speakTextSystem(text, profile);
  }

  return { char: charInfo, phrase: text };
}

/**
 * Reproductor de guiones:
 * playScript(`
 *   [NARRATOR]
 *   Has llegado al último nivel...
 *   [BOSS]
 *   ¡JAJAJA! ¡No podrás vencerme!
 *   [HERO]
 *   Eso está por ver.
 * `);
 */
export async function playScript(scriptText, { delayBetween = 2400 } = {}) {
  const lines = scriptText.split("\n");
  const dialogue = [];
  let currentSpeaker = "narrator";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const speakerMatch = line.match(/^\[([A-Z0-9_\-]+)\]$/i);
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1].toLowerCase();
    } else {
      dialogue.push({ speaker: currentSpeaker, text: line });
    }
  }

  for (const item of dialogue) {
    say(item.speaker, item.text);
    await new Promise((res) => setTimeout(res, delayBetween));
  }
}
