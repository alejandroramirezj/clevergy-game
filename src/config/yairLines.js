// =============================================================================
// yairLines.js — Las batallitas de Yair cuando saca la pala de ping-pong
// (sin dependencias: lo usan tanto los mundos 3D como el menú)
// =============================================================================

export const YAIR_LINES = [
  "Así gané el torneo de Minnesota en el 73.",
  "Con este saque tumbé al campeón de Wisconsin en el 71.",
  "Este efecto me lo enseñó un monje de Shanghái en el 68.",
  "En Albacete todavía hablan de este revés.",
  "Así le gané la final a Forrest Gump en el 74.",
  "Este liftado lo patenté en Ohio en el 75.",
  "Con esta pala me retiré invicto en el 79.",
  "Subcampeón de Minnesota, campeón de la vida.",
  "Así cerré el open de Cuenca en el 82: sin despeinarme.",
  "Esto en el circuito de Kansas lo llamaban «el abanico»."
];

// cada lanzamiento dice una frase distinta (sin repetir hasta agotarlas)
let deck = [];
export function nextYairLine() {
  if (!deck.length) deck = YAIR_LINES.map((_, i) => i).sort(() => Math.random() - 0.5);
  return deck.pop();
}
