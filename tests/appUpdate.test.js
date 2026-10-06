// Versión nueva publicada: detectar el trozo de código que ya no existe y recargar una sola vez
import { describe, it, expect, vi, beforeEach } from "vitest";

const store = new Map();
globalThis.sessionStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
const reload = vi.fn();
globalThis.location = { reload, href: "https://x.test/" };
const nodes = new Map();
globalThis.document = {
  getElementById: (id) => nodes.get(id) || null,
  createElement: () => ({ set id(v) { nodes.set(v, this); }, className: "", innerHTML: "" }),
  body: { appendChild: () => {} }
};

const { isChunkError, reloadForUpdate } = await import("../src/engine/appUpdate.js");

beforeEach(() => { store.clear(); nodes.clear(); reload.mockClear(); vi.useFakeTimers(); });

describe("versión nueva", () => {
  it("reconoce los fallos de carga de un trozo de código (Chrome, Safari, Firefox)", () => {
    expect(isChunkError(new TypeError("Failed to fetch dynamically imported module: https://x/assets/a.js"))).toBe(true);
    expect(isChunkError(new TypeError("Importing a module script failed."))).toBe(true);
    expect(isChunkError(new TypeError("error loading dynamically imported module"))).toBe(true);
    expect(isChunkError(new Error("Timeout cargando el mundo (20 s)"))).toBe(false);
    expect(isChunkError(new TypeError("Cannot read properties of undefined"))).toBe(false);
  });
  it("recarga una vez y no entra en bucle si vuelve a fallar enseguida", () => {
    expect(reloadForUpdate()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(nodes.get("updateNotice").innerHTML).toMatch(/versión nueva/);
    expect(reloadForUpdate()).toBe(false); // 2º fallo justo después de recargar: no se recarga otra vez
    vi.advanceTimersByTime(1000);
    expect(reload).toHaveBeenCalledTimes(1);
  });
  it("pasado un rato sí puede volver a recargar", () => {
    expect(reloadForUpdate()).toBe(true);
    vi.setSystemTime(Date.now() + 31000);
    expect(reloadForUpdate()).toBe(true);
  });
});
