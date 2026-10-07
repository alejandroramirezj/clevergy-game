// =============================================================================
// macaLines.js — Maca lanza cromos asesinos del Mundial 2026 y siempre pregunta lo mismo
// (sin dependencias: lo usan tanto los mundos 3D como el menú)
// =============================================================================

export const MACA_LINES = [
  "¿Tienes el cromo de Messi?",
  "¿Y el de Messi? ¿Tienes el de Messi?",
  "Repe, repe, repe… ¿no tendrás a Messi?",
  "Te cambio tres repes por el de Messi.",
  "Me falta uno para el álbum: ¿tienes a Messi?",
  "Ese no, ese tampoco… ¿y Messi?",
  "¡Cromos del Mundial 2026! ¿Alguien tiene a Messi?",
  "Si me das el de Messi te doy el brillante."
];

// cada lanzamiento dice una frase distinta (sin repetir hasta agotarlas)
let deck = [];
export function nextMacaLine() {
  if (!deck.length) deck = MACA_LINES.map((_, i) => i).sort(() => Math.random() - 0.5);
  return deck.pop();
}
