// =============================================================================
// doodleSticker.js — Tu personaje en tercera persona, como pegatina recortada
// Usa los mismos sprites del plataformas (poses HD o pixel art). Cada pose se
// convierte una sola vez en una "pegatina" en un canvas: recortada a su silueta,
// con borde blanco y contorno de tinta. En 3D es un plano que mira a la cámara y
// que se da la vuelta como un recortable de papel al cambiar de sentido.
// =============================================================================

import * as THREE from "three";
import { ANIM, SPR } from "../engine/sprites.js";

const TARGET_H = 256; // alto de la silueta en la pegatina (px)
const WHITE = 7; // grosor del borde blanco
const INK = 3; // grosor del contorno de tinta

const sizeOf = (img) => ({ w: img.naturalWidth || img.width || 0, h: img.naturalHeight || img.height || 0 });

function tinted(src, color) {
  const c = document.createElement("canvas");
  c.width = src.width;
  c.height = src.height;
  const g = c.getContext("2d");
  g.drawImage(src, 0, 0);
  g.globalCompositeOperation = "source-in";
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  return c;
}

// imagen → canvas recortado a la silueta y con borde de pegatina
function bakeSticker(img, pixelArt) {
  const { w, h } = sizeOf(img);
  if (!w || !h) return null;
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tg = tmp.getContext("2d");
  tg.drawImage(img, 0, 0);
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  try {
    const data = tg.getImageData(0, 0, w, h).data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (data[(y * w + x) * 4 + 3] > 100) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
  } catch (e) {
    x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1;
  }
  if (x1 < x0) return null;
  const bw = x1 - x0 + 1, bh = y1 - y0 + 1;
  const sw = Math.max(1, Math.round((bw * TARGET_H) / bh)), sh = TARGET_H;
  const pad = WHITE + INK + 2;

  const body = document.createElement("canvas");
  body.width = sw;
  body.height = sh;
  const bg = body.getContext("2d");
  bg.imageSmoothingEnabled = !pixelArt;
  bg.drawImage(img, x0, y0, bw, bh, 0, 0, sw, sh);

  const out = document.createElement("canvas");
  out.width = sw + pad * 2;
  out.height = sh + pad * 2;
  const og = out.getContext("2d");
  const ink = tinted(body, "#292b38");
  const white = tinted(body, "#fbf8ee");
  const ring = (src, r) => {
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      og.drawImage(src, pad + Math.cos(a) * r, pad + Math.sin(a) * r);
    }
  };
  ring(ink, WHITE + INK);
  ring(white, WHITE);
  ring(white, WHITE * 0.5);
  og.drawImage(body, pad, pad);
  return { canvas: out, charH: sh / out.height, feet: pad / out.height };
}

function stickerTexture(img, pixelArt, onReady) {
  const make = () => {
    const baked = bakeSticker(img, pixelArt);
    if (!baked) return;
    const tex = new THREE.CanvasTexture(baked.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    onReady({ tex, aspect: baked.canvas.width / baked.canvas.height, charH: baked.charH, feet: baked.feet });
  };
  if (img instanceof HTMLImageElement && !(img.complete && img.naturalWidth)) img.addEventListener("load", make, { once: true });
  else make();
}

// `targetScene`: escena overlay compartida (tu personaje y los de tus compañeros)
export function createSticker(targetScene) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    alphaTest: 0.5,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const pivot = new THREE.Group(); // en los pies del jugador, gira hacia la cámara
  const flipper = new THREE.Group(); // escala X para darse la vuelta
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  plane.frustumCulled = false;
  flipper.add(plane);
  pivot.add(flipper);
  const scene = targetScene || new THREE.Scene();
  scene.add(pivot);

  let poses = {};
  let faceRight = true;
  let pose = "";
  let charKey = 0;
  let facing = 1; // 1 = derecha, -1 = izquierda
  let flip = 1;
  let t = 0;

  function setChar(charId) {
    Object.values(poses).forEach((p) => p.tex.dispose());
    poses = {};
    pose = "";
    const key = ++charKey;
    const rec = ANIM[charId];
    const sources = [];
    faceRight = true;
    if (rec && rec.type === "poses" && rec.images) {
      faceRight = rec.faceRight !== false;
      for (const [k, list] of Object.entries(rec.images)) if (list && list[0]) sources.push([k, list[0], false]);
    }
    if (!sources.some(([k]) => k === "idle") && SPR[charId] && SPR[charId].img) sources.push(["idle", SPR[charId].img, true]);
    for (const [k, img, pixel] of sources) {
      stickerTexture(img, pixel, (p) => {
        if (key !== charKey) return p.tex.dispose(); // se cambió de personaje mientras cargaba
        poses[k] = { ...p, pixel };
        if (!pose || k === "idle") { pose = ""; setPose("idle"); }
      });
    }
  }

  function setPose(name) {
    const p = poses[name] || poses.idle || Object.values(poses)[0];
    if (!p || pose === name) return;
    pose = name;
    material.map = p.tex;
    material.needsUpdate = true;
    // el personaje mide ~1.75 m (1.4 m los pixel art)
    const H = (p.pixel ? 1.4 : 1.75) / p.charH;
    plane.scale.set(H * p.aspect, H, 1);
    plane.position.y = H / 2 - p.feet * H;
  }

  /**
   * @param {number} dt
   * @param {{pos: THREE.Vector3, camera: THREE.Camera, moveX: number, speed: number, onGround: boolean, firing: boolean, hurt: number}} s
   */
  function update(dt, s) {
    t += dt;
    let want = "idle";
    if (!s.onGround) want = "jump";
    else if (s.firing) want = "attack";
    else if (s.speed > 7.5) want = "run";
    else if (s.speed > 0.6) want = "walk";
    setPose(want);
    if (s.moveX > 0.2) facing = 1;
    else if (s.moveX < -0.2) facing = -1;
    const target = facing * (faceRight ? 1 : -1);
    flip += (target - flip) * Math.min(1, dt * 14);
    // andar de recortable: pequeños botes e inclinación
    const walkAmt = s.onGround ? Math.min(1, s.speed / 6) : 0;
    const hop = Math.abs(Math.sin(t * 10)) * 0.12 * walkAmt;
    const breathe = 1 + Math.sin(t * 3) * 0.015 * (1 - walkAmt);
    pivot.position.set(s.pos.x, s.pos.y + hop, s.pos.z);
    pivot.rotation.set(0, Math.atan2(s.camera.position.x - s.pos.x, s.camera.position.z - s.pos.z), 0);
    flipper.scale.set(Math.abs(flip) < 0.08 ? 0.08 * Math.sign(flip || 1) : flip, breathe, 1);
    flipper.rotation.z = Math.sin(t * 10) * 0.05 * walkAmt;
    // tinte rojo al recibir daño
    material.color.setRGB(1, 1 - s.hurt * 0.55, 1 - s.hurt * 0.6);
  }

  function dispose() {
    scene.remove(pivot);
    plane.geometry.dispose();
    material.dispose();
    Object.values(poses).forEach((p) => p.tex.dispose());
  }

  return { scene, pivot, setChar, update, dispose, setVisible: (v) => (pivot.visible = v) };
}
