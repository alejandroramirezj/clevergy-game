// =============================================================================
// charRoute.js — Enlaces por personaje: https://…/jose-luis abre el juego con José
// Luis ya elegido (para los QR de cada compañero). Acepta el slug oficial, el id
// del código o el nombre (sin tildes ni mayúsculas): /joseluis, /José-Luis…
// =============================================================================

import { CHARS } from "../config/characters.js";

// slug oficial de cada personaje (el que va en el QR)
export const CHAR_SLUGS = {
  alejandro: "alejandro", ale: "ale", alvaroM: "alvaro-merino", alvaroP: "alvaro", ana: "ana", beltran: "beltran",
  bruno: "bruno", gonzalo: "gonzalo", javi: "javi", jesus: "jesus", joseluis: "jose-luis", josu: "josu",
  juan: "juan", maca: "maca", manu: "manu", pablo: "pablo", paloma: "paloma", silvia: "silvia", yair: "yair"
};
const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const charUrl = (c, origin = location.origin) => `${origin}/${CHAR_SLUGS[c.id] || c.id.toLowerCase()}`;

/** Índice del personaje de la URL actual (o -1). */
export function charFromUrl(loc = location) {
  const seg = decodeURIComponent(loc.pathname.split("/").filter(Boolean)[0] || "");
  const q = new URLSearchParams(loc.search).get("p") || "";
  const key = norm(seg || q);
  if (!key) return -1;
  const tests = [
    (c) => norm(CHAR_SLUGS[c.id]) === key,
    (c) => norm(c.id) === key,
    (c) => norm(c.name) === key,
    (c) => norm(c.name.split(" ")[0]) === key
  ];
  for (const t of tests) { const i = CHARS.findIndex(t); if (i >= 0) return i; }
  return -1;
}

const KEY = "cg_invite_char";
/** Lee el personaje de la URL, lo recuerda para esta visita y deja la URL limpia. */
export function consumeCharInvite() {
  const i = charFromUrl();
  if (i >= 0) {
    try { sessionStorage.setItem(KEY, CHARS[i].id); } catch (e) {}
    try { history.replaceState(null, "", "/" + location.hash); } catch (e) {}
  }
  return i;
}
export function invitedCharId() {
  try { return sessionStorage.getItem(KEY); } catch (e) { return null; }
}
