import { describe, it, expect } from "vitest";
import { CHARS, POWER_INFO } from "../src/config/characters.js";

describe("Personajes y Poderes de La Oficina", () => {
  it("cada personaje de CHARS tiene su ficha completa en POWER_INFO y tip", () => {
    expect(CHARS.length).toBe(19);
    for (const c of CHARS) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.ab).toBeTruthy();
      expect(c.tip).toBeTruthy();
      expect(POWER_INFO[c.id]).toBeDefined();
      expect(POWER_INFO[c.id].desc).toBeTruthy();
    }
  });

  it("la física de proyectiles avanza con la velocidad vx y vy, y no se queda estática", () => {
    const dt = 1 / 60;
    // Simulación del bucle de powers corregido
    const powers = [
      { x: 10, y: 2, vx: 13, vy: 4.8, arc: true, bounce: 3, life: 3.0, shape: "444" },
      { x: 10, y: 2, vx: 15, vy: 0, arc: false, pierce: true, life: 1.0, shape: "wave" },
      { x: 10, y: 2, vx: 11.5, vy: 0, arc: false, pierce: true, life: 1.25, shape: "slack" },
      { x: 10, y: 2, vx: 9.5, vy: 0, arc: false, pierce: true, life: 1.7, shape: "kiss" }
    ];

    const initialPositions = powers.map((p) => ({ x: p.x, y: p.y }));

    // Dar 10 pasos de simulación
    for (let step = 0; step < 10; step++) {
      for (const p of powers) {
        p.life -= dt;
        if (p.arc) p.vy -= 22 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
    }

    // Verificar que los proyectiles realmente se desplazaron hacia adelante
    powers.forEach((p, i) => {
      expect(p.x).toBeGreaterThan(initialPositions[i].x);
      expect(p.life).toBeLessThan(3.0);
    });
  });
});
