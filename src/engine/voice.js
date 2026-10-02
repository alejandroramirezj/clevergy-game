// =============================================================================
// voice.js — Sistema de voz y frases de los personajes de Clevergy
// Cada personaje tiene su propia voz y frase icónica (o chistes en el caso de Gonzalo).
// Utiliza Web Speech API (speechSynthesis) para el audio y genera bocadillos tipo cómic.
// =============================================================================

import { CHARS } from "../config/characters.js";
import { GameState } from "../game/state.js";

// Contador para alternar frases de personajes con múltiples líneas
let joseLuisIndex = 0;
let lastSpokenTime = 0;

// Configuración de síntesis por personaje (pitch, rate) para dar personalidad
const VOICE_MODS = {
  alejandro: { pitch: 1.0, rate: 1.05 },
  ale: { pitch: 0.95, rate: 1.0 },
  alvaroM: { pitch: 0.9, rate: 0.95 },
  alvaroP: { pitch: 1.05, rate: 1.0 },
  ana: { pitch: 1.25, rate: 1.05 },
  beltran: { pitch: 1.0, rate: 1.1 },
  bruno: { pitch: 0.65, rate: 0.9 }, // voz profunda de tótem
  gonzalo: { pitch: 1.05, rate: 1.05 },
  javi: { pitch: 0.9, rate: 1.05 },
  jesus: { pitch: 0.85, rate: 0.95 },
  joseluis: { pitch: 0.95, rate: 1.0 },
  josu: { pitch: 1.0, rate: 1.0 },
  juan: { pitch: 0.95, rate: 1.05 },
  maca: { pitch: 1.3, rate: 1.15 }, // alegre y vivaz
  manu: { pitch: 0.88, rate: 1.1 },
  pablo: { pitch: 1.0, rate: 1.1 },
  paloma: { pitch: 1.2, rate: 0.95 },
  silvia: { pitch: 1.15, rate: 1.2 }, // rápida y decidida
  yair: { pitch: 1.0, rate: 1.05 }
};

/**
 * Obtiene el objeto personaje a partir de ID o índice
 */
export function getCharObj(charOrId) {
  if (!charOrId) {
    return CHARS[GameState?.charIdx ?? 0] || CHARS[0];
  }
  if (typeof charOrId === "object") {
    // Si es un objeto, comprobar si tiene .id o .charId
    const objId = charOrId.id || charOrId.charId || charOrId.c;
    if (objId && typeof objId === "string") {
      const found = CHARS.find((c) => c.id.toLowerCase() === objId.toLowerCase());
      if (found) return found;
    }
    return charOrId;
  }
  const idLower = String(charOrId).toLowerCase().trim();
  // alias comunes
  let normId = idLower;
  if (idLower === "jair") normId = "yair";
  else if (idLower === "merino" || idLower === "alvaromerino") normId = "alvarom";
  else if (idLower === "alvaro") normId = "alvarop";

  return CHARS.find((c) => c.id.toLowerCase() === normId) ||
         CHARS.find((c) => c.id.toLowerCase().includes(normId)) ||
         CHARS[0];
}

/**
 * Obtiene la siguiente frase correspondiente para el personaje dado
 */
export function getCharacterPhrase(charOrId) {
  const c = getCharObj(charOrId);
  const id = c.id;

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

  if (id === "joseluis") {
    const phrases = c.voice || [
      "Hay dos partes.",
      "No se pueden meter links en los microfrontends."
    ];
    const phrase = phrases[joseLuisIndex % phrases.length];
    joseLuisIndex++;
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
  // Forzar reflow para reiniciar la animación pop
  void bubble.offsetWidth;
  bubble.classList.add("dsb-pop");

  if (activeBubbleTimer) clearTimeout(activeBubbleTimer);
  activeBubbleTimer = setTimeout(() => {
    bubble.classList.add("dsb-fadeout");
    setTimeout(() => {
      bubble.classList.add("hidden");
    }, 400);
  }, 3800);
}

/**
 * Habla la frase del personaje (audio sintetizado + bocadillo visual)
 * @param {string|object} [charOrId] - personaje a hablar (opcional, por defecto el activo)
 * @param {object} [opts]
 * @param {boolean} [opts.silent] - si es true, sólo muestra bocadillo sin audio
 * @param {function} [opts.onBroadcast] - callback con ({ charId, phrase }) para multijugador
 */
export function speakCharacter(charOrId, opts = {}) {
  const now = Date.now();
  // Evitar flood si se machaca el botón (mínimo 600ms entre llamadas del usuario)
  if (!opts.force && now - lastSpokenTime < 600) return;
  lastSpokenTime = now;

  const { char, phrase } = getCharacterPhrase(charOrId);

  // 1. Mostrar bocadillo visual
  showSpeechBubble(char, phrase);

  // 2. Multijugador broadcast si se especifica
  if (opts.onBroadcast) {
    try {
      opts.onBroadcast({ charId: char.id, phrase });
    } catch (e) {
      console.warn("broadcast voice error", e);
    }
  }

  // 3. Síntesis de voz Web Speech API
  if (!opts.silent && typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel(); // Detener cualquier frase previa

      const u = new SpeechSynthesisUtterance(phrase);
      u.lang = "es-ES";

      // Modulaciones personalizadas de tono y velocidad
      const mod = VOICE_MODS[char.id] || { pitch: 1.0, rate: 1.0 };
      u.pitch = mod.pitch;
      u.rate = mod.rate;

      // Buscar voz nativa en español
      const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
      if (voices.length > 0) {
        const esVoice = voices.find((v) => v.lang.startsWith("es-ES")) ||
                        voices.find((v) => v.lang.startsWith("es"));
        if (esVoice) u.voice = esVoice;
      }

      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  }

  return { char, phrase };
}

/**
 * Atajo para hablar con el personaje actual del juego
 */
export function speakCurrentChar(opts = {}) {
  const c = CHARS[GameState?.charIdx ?? 0] || CHARS[0];
  return speakCharacter(c, opts);
}
