// =============================================================================
// motion.js — Respeta "reducir movimiento" del sistema (accesibilidad)
// Con la opción activada, los temblores de cámara se quedan en una cuarta parte.
// =============================================================================

const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

/** multiplicador para temblores de cámara y sacudidas (1 = normal) */
export const motionScale = () => (reduce && reduce.matches ? 0.25 : 1);
