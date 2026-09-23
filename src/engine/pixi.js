import { Application, Assets, Container, Sprite, Texture } from "pixi.js";

/**
 * PixiJS Engine Core for Clevergy Arcade Game
 * Phase 1: Hardware-Accelerated Hero Showcase & Texture Pipeline
 */

let heroApp = null;
let heroContainer = null;
let heroSprite = null;
let isInitialized = false;
let currentTextureUrl = null;

const textureCache = new Map();

/**
 * Loads a texture into memory and VRAM via PixiJS Assets / Texture
 */
export async function loadPixiTexture(src) {
  if (!src) return null;
  if (textureCache.has(src)) return textureCache.get(src);

  try {
    const tex = await Assets.load(src);
    textureCache.set(src, tex);
    return tex;
  } catch (err) {
    // Fallback: load directly via Texture.from
    try {
      const tex = Texture.from(src);
      textureCache.set(src, tex);
      return tex;
    } catch (e) {
      console.warn("Could not load Pixi texture:", src, e);
      return null;
    }
  }
}

/**
 * Initialize PixiJS v8 Application on the Hero Podium Canvas
 */
export async function initHeroPodiumPixi(canvas) {
  if (!canvas) return null;
  if (heroApp) return heroApp;

  try {
    const app = new Application();
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    await app.init({
      canvas,
      width: canvas.width,
      height: canvas.height,
      backgroundAlpha: 0,
      antialias: true,
      resolution: dpr,
      autoDensity: true,
      preference: "webgl"
    });

    heroContainer = new Container();
    heroApp = app;

    heroSprite = new Sprite();
    heroSprite.anchor.set(0.5, 1.0); // Grounded on pedestal feet
    heroContainer.addChild(heroSprite);

    app.stage.addChild(heroContainer);
    isInitialized = true;
    console.log("🎮 PixiJS v8 Hero Podium successfully initialized with hardware acceleration!");
    return heroApp;
  } catch (err) {
    console.warn("PixiJS v8 initialization fell back:", err);
    return null;
  }
}

/**
 * Update Hero Podium Pose & Transform in PixiJS v8
 */
export function updateHeroPodiumPixi({
  imgSrc,
  fallbackImg,
  x,
  y,
  offsetX = 0,
  offsetY = 0,
  rotation = 0,
  scaleX = 1,
  scaleY = 1,
  targetH = 250
}) {
  if (!isInitialized || !heroSprite || !heroContainer || !heroApp) return false;

  const src = imgSrc || (fallbackImg ? (fallbackImg.src || fallbackImg) : null);
  if (!src) return false;

  if (currentTextureUrl !== src) {
    currentTextureUrl = src;
    let tex = textureCache.get(src);
    if (!tex) {
      tex = Texture.from(src);
      textureCache.set(src, tex);
    }
    heroSprite.texture = tex;
  }

  const tex = heroSprite.texture;
  if (!tex) return false;

  const naturalH = tex.height || (fallbackImg ? fallbackImg.naturalHeight : 250);
  const naturalW = tex.width || (fallbackImg ? fallbackImg.naturalWidth : 250);

  const ratio = targetH / (naturalH || 250);
  const baseW = naturalW * ratio;
  const baseH = targetH;

  heroSprite.width = baseW;
  heroSprite.height = baseH;

  heroContainer.position.set(x + offsetX, y + offsetY);
  heroContainer.rotation = rotation;
  heroContainer.scale.set(scaleX, scaleY);

  heroApp.render();
  return true;
}

export function isPixiHeroReady() {
  return isInitialized && heroApp !== null;
}
