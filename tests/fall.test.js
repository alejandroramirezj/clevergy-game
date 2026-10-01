// La Integración: cada ronda se puede terminar (12 CPU con azar fijo)
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as THREE from "three";
import { createKit, rng } from "../src/doodle/fall/fallKit.js";
import { LEVELS } from "../src/doodle/fall/fallLevels.js";
import { createSim, newBot } from "../src/doodle/fall/fallSim.js";

const realRandom = Math.random;
beforeAll(() => { Math.random = rng(4242); });
afterAll(() => { Math.random = realRandom; });

function play(li, n = 12) {
  const K = createKit(new THREE.Scene());
  const L = LEVELS[li](K, 1000 + li);
  const sp = K.checkpoints[0].spawn;
  const cs = [];
  for (let i = 0; i < n; i++) cs.push({ id: `b${i}`, cpu: true, x: sp.x0 + (((i % 4) + 0.5) / 4) * (sp.x1 - sp.x0), y: sp.y + 0.05, z: sp.z - Math.floor(i / 4) * 1.8, vx: 0, vy: 0, vz: 0, yaw: 0, ground: null, coyote: 0, jumps: 0, dive: false, recover: 0, stun: 0, slowF: 1, grabbing: null, grabbedBy: null, grabT: 0, grabCd: 0, cp: 0, respawnT: 0, finished: false, falls: 0, lastSafeZ: 0, bestZ: -99, bot: newBot() });
  let t = 0, winner = null;
  const fin = [];
  const E = { K, L, cs, me: null, get t() { return t; }, get winner() { return winner; }, sfx: new Proxy({}, { get: () => () => {} }), flash() {}, shake() {}, buzz() {}, burst() {}, tick() {}, myFall() {},
    finishC(c) { c.finished = true; fin.push(c); }, winBattery(c) { winner = c; c.finished = true; } };
  const sim = createSim(E);
  const STEP = 1 / 60;
  for (let k = 0; k < L.time / STEP && !winner; k++) {
    t += STEP;
    K.update(t, STEP);
    for (const c of cs) sim.stepChar(c, c.finished ? { mx: 0, mz: 0, jump: false, grab: false } : sim.aiInput(c, STEP), STEP);
    sim.collideContestants();
  }
  return { L, fin: fin.length, winner, n };
}

describe("La Integración", () => {
  for (const li of [0, 1, 2]) {
    it(`ronda ${li + 1}: llegan al menos los que se clasifican`, () => {
      const r = play(li);
      expect(r.fin).toBeGreaterThanOrEqual(Math.round(r.n * r.L.qualify) - 1);
    }, 60000);
  }
  it("final: alguien se lleva la batería", () => {
    expect(play(3, 5).winner).toBeTruthy();
  }, 60000);
});
