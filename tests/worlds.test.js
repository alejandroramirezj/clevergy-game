import { describe, it, expect } from "vitest";
import { worldRetos, getWorldChallenges, isWorldLocked, VISIBLE_WORLDS, WORLD_RETOS } from "../src/config/worlds.js";

describe("mundos y retos", () => {
  it("hay 4 mundos visibles, ordenados y con sus 3 retos", () => {
    expect(VISIBLE_WORLDS.map((w) => w.num)).toEqual([1, 2, 3, 4]);
    for (const w of VISIBLE_WORLDS) expect(WORLD_RETOS[w.id]).toHaveLength(3);
  });
  it("sin progreso no hay retos conseguidos ni mundos bloqueados", () => {
    const p = { completed: [], highScores: {}, ranks: {} };
    for (const w of VISIBLE_WORLDS) {
      expect(getWorldChallenges(w.id, p)).toBe(0);
      expect(isWorldLocked(w, p)).toBe(false);
    }
  });
  it("los retos se cuentan según superado y rango", () => {
    expect(getWorldChallenges(1, { completed: [1], ranks: { 1: "B" } })).toBe(1);
    expect(getWorldChallenges(1, { completed: [1], ranks: { 1: "A" } })).toBe(2);
    expect(getWorldChallenges(1, { completed: [1], ranks: { 1: "S" } })).toBe(3);
    expect(worldRetos(8, { completed: [], ranks: { 8: "S" } }).every((r) => !r.done)).toBe(true); // sin ganar no cuenta el rango
  });
});

import { dailyChallenge } from "../src/config/worlds.js";
describe("reto del día", () => {
  it("es el mismo durante todo el día y cambia entre días", () => {
    const a = dailyChallenge(new Date(2026, 9, 1, 8)), b = dailyChallenge(new Date(2026, 9, 1, 22));
    expect(a.world.id).toBe(b.world.id);
    expect(a.idx).toBe(b.idx);
    const days = new Set(Array.from({ length: 14 }, (_, i) => { const d = dailyChallenge(new Date(2026, 9, 1 + i)); return `${d.world.id}-${d.idx}`; }));
    expect(days.size).toBeGreaterThan(2);
  });
});
