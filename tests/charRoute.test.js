import { describe, it, expect } from "vitest";
import { charFromUrl, CHAR_SLUGS } from "../src/game/charRoute.js";
import { CHARS } from "../src/config/characters.js";

const at = (path) => ({ pathname: path, search: "" });
describe("enlaces por personaje (QR)", () => {
  it("cada slug oficial abre su personaje", () => {
    for (const c of CHARS) expect(CHARS[charFromUrl(at("/" + CHAR_SLUGS[c.id]))].id).toBe(c.id);
  });
  it("acepta el nombre sin tildes, el id y ?p=", () => {
    expect(CHARS[charFromUrl(at("/José-Luis"))].id).toBe("joseluis");
    expect(CHARS[charFromUrl(at("/alvaroM"))].id).toBe("alvaroM");
    expect(CHARS[charFromUrl({ pathname: "/", search: "?p=paloma" })].id).toBe("paloma");
  });
  it("distingue a los dos Álvaros y no inventa personajes", () => {
    expect(CHARS[charFromUrl(at("/alvaro"))].id).toBe("alvaroP");
    expect(CHARS[charFromUrl(at("/alvaro-merino"))].id).toBe("alvaroM");
    expect(CHARS[charFromUrl(at("/merino"))].id).toBe("alvaroM");
    expect(charFromUrl(at("/"))).toBe(-1);
    expect(charFromUrl(at("/qr.html"))).toBe(-1);
  });
});
