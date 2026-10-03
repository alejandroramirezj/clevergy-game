// =============================================================================
// worldViewer.js — Explorar los mundos con cámara libre (Historia y personajes)
// Monta el escenario de cada mundo sin partida, sin enemigos y sin prisas, y te
// deja recorrerlo como observador. La Oficina (plataformas) usa su propio motor
// en modo observador porque su nivel se construye por dentro del juego.
// =============================================================================

import * as THREE from "three";
import { createDoodleRenderer } from "./doodleRender.js";
import { createObserver, observerBar } from "./observer.js";
import "./doodle.css";
import "./observer.css";

const NAMES = { 1: "La Oficina", 6: "Retro Fight", 7: "BoliBic Tag", 8: "Pantano de San Juan", 9: "La Integración" };

/** abre el visor del mundo `worldId`; `onClose` al cerrarlo */
export async function openWorldViewer(worldId, { onClose } = {}) {
  if (worldId === 1) {
    const { startDoodlePlatform } = await import("./platform/doodlePlatform.js");
    return startDoodlePlatform({ observer: true, onExit: onClose });
  }
  const root = document.createElement("div");
  root.className = "ov-root";
  root.innerHTML = '<canvas class="dd-canvas"></canvas>';
  document.body.appendChild(root); // por encima de los menús
  const canvas = root.querySelector("canvas");
  const R = createDoodleRenderer(canvas, { fadeScale: worldId === 8 ? 3.2 : 2.6 });
  const scene = new THREE.Scene();
  const overlay = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(64, 1, 0.2, 1400);
  scene.add(camera);

  let world = null; // { update(t, dt), start }
  let obs = null;
  async function build(sub = 0) {
    // vacía la escena (menos la cámara)
    for (const o of scene.children.slice()) if (o !== camera) scene.remove(o);
    if (world && world.dispose) world.dispose();
    world = await BUILDERS[worldId](scene, sub);
    if (obs) obs.dispose();
    obs = createObserver(root, camera, world.start);
  }

  const tabs = worldId === 9 ? ["1 · Usuario", "2 · Consumo", "3 · Inversor", "4 · Batería"] : null;
  observerBar(root, { title: NAMES[worldId] || "Mundo", tabs, onTab: (i) => build(i), onClose: close });
  await build(0);

  function resize() {
    const w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    camera.aspect = w / h;
    camera.fov = w < h ? 78 : 64;
    camera.updateProjectionMatrix();
    R.setSize(w, h);
  }
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(root);
  window.addEventListener("resize", resize);
  resize();

  let raf = 0, prev = performance.now(), t = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - prev) / 1000);
    prev = now;
    t += dt;
    if (obs) obs.update(dt);
    if (world) world.update(t, dt, camera);
    R.render(scene, camera, { time: t, hurt: 0, lowHp: 0, flash: 0 }, overlay);
  }
  raf = requestAnimationFrame(frame);

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    if (ro) ro.disconnect();
    if (obs) obs.dispose();
    if (world && world.dispose) world.dispose();
    R.dispose();
    root.remove();
    if (onClose) onClose();
  }
  return { close };
}

// ── escenarios ──
const BUILDERS = {
  // BoliBic Tag: las tres plantas del CINK (las puertas se abren al acercarte)
  7: async (scene) => {
    const { buildLevel, START } = await import("./cinkLevel.js");
    const lv = buildLevel(scene);
    return {
      start: { pos: { x: START.x, y: 1.7, z: START.z }, yaw: START.yaw, pitch: -0.05, speed: 8 },
      update: (t, dt, cam) => {
        lv.updateDoors(dt, [cam.position.clone().setY(cam.position.y - 1.6)]);
        if (lv.victoria) lv.victoria.update(dt, null, false);
        if (lv.mariaEugenia) lv.mariaEugenia.update(dt);
      }
    };
  },
  // Coworking Fight: la terraza del CINK
  6: async (scene) => {
    const { buildFightStage } = await import("./fight/fightStage.js");
    const st = buildFightStage(scene);
    return { start: { pos: { x: 0, y: 5, z: 20 }, yaw: 0, pitch: -0.12, speed: 9 }, update: (t, dt) => st.update(dt, t, 0.3) };
  },
  // Pantano de San Juan: el circuito entero, con el agua moviéndose
  8: async (scene) => {
    const { buildTrack, buildRaceWorld } = await import("./race/raceTrack.js");
    const track = buildTrack();
    const w = buildRaceWorld(scene, track);
    const c = track.center, p = { x: c.x, y: 70, z: c.z + 160 };
    return {
      start: { pos: p, yaw: Math.atan2(-(c.x - p.x), -(c.z - p.z)), pitch: -0.38, speed: 40, minY: 1.5 },
      update: (t, dt, cam) => w.update(t, cam.position.x, cam.position.z, dt)
    };
  },
  // La Integración: las cuatro rondas del show (con los obstáculos en marcha)
  9: async (scene, sub) => {
    const [{ createKit }, { LEVELS }] = await Promise.all([import("./fall/fallKit.js"), import("./fall/fallLevels.js")]);
    const K = createKit(scene);
    LEVELS[sub](K, 20251);
    K.bake();
    const sp = K.checkpoints[0].spawn;
    return {
      start: { pos: { x: 0, y: sp.y + 7, z: sp.z - 14 }, yaw: Math.PI, pitch: -0.3, speed: 14 },
      update: (t, dt) => K.update(t, dt),
      dispose: () => K.dispose()
    };
  }
};
