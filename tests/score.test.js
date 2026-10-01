import { describe, it, expect } from "vitest";
import { validateScore, SCORE_CAP } from "../server/score.js";

describe("validateScore (ranking)", () => {
  it("acepta una puntuación normal y limpia el nombre", () => {
    const r = validateScore({ world: 1, score: 5200, name: "  josé<script>", rank: "s", character: "joseluis" });
    expect(r.ok).toBe(true);
    expect(r.entry.name).toBe("JOSÉSCRIPT");
    expect(r.entry.rank).toBe("S");
  });
  it("rechaza mundos desconocidos, cero y negativos", () => {
    expect(validateScore({ world: 3, score: 100 }).ok).toBe(false);
    expect(validateScore({ world: 1, score: 0 }).ok).toBe(false);
    expect(validateScore({ world: 1, score: -5 }).ok).toBe(false);
  });
  it("rechaza puntuaciones imposibles", () => {
    for (const [w, cap] of Object.entries(SCORE_CAP)) {
      expect(validateScore({ world: w, score: cap }).ok).toBe(true);
      expect(validateScore({ world: w, score: cap + 1 }).ok).toBe(false);
    }
  });
  it("con sesión usa el nombre de la cuenta", () => {
    const r = validateScore({ world: 8, score: 900, name: "OTRO" }, { id: "g1", nick: "PALOMA" });
    expect(r.entry.name).toBe("PALOMA");
    expect(r.entry.user_id).toBe("g1");
  });
});

import { cleanStats } from "../server/score.js";
describe("cleanStats (detalle del récord)", () => {
  it("se queda sólo con claves conocidas y valores limpios", () => {
    const s = cleanStats({ coins: 120, frags: 3, zone: "Wayra<b>", won: true, hack: "x", time: 1e9 });
    expect(s).toMatchObject({ coins: 120, frags: 3, won: 1, time: 99999 });
    expect(s.zone).toBe("Wayrab");
    expect(s.hack).toBeUndefined();
    expect(cleanStats(null)).toBeNull();
  });
});
