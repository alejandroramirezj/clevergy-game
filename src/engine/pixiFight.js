import { Application, Container, Graphics, Sprite, Texture, Text, TextStyle } from "pixi.js";
import { ANIM, SPR } from "./sprites.js";

/**
 * PixiJS v8 Hardware-Accelerated Fight Engine for Clevergy Game
 * Phase 2: Complete Stage, Animated Fighters, GPU Combat FX, and Screen Shake
 */

const STAGE_W = 960;
const STAGE_H = 540;
const FLOOR_Y = 475;

let fightApp = null;
let isInit = false;
let isInitializing = false;

// Stage scene graph
let rootContainer = null;
let stageContainer = null;
let bgGraphics = null;
let desksGraphics = null;
let fightersContainer = null;
let p1Container = null;
let p2Container = null;
let fxContainer = null;
let hudGraphics = null;
let hudTextContainer = null;

// Screen Shake state
let shakeT = 0;
let shakePower = 0;

// Texture cache
const textureCache = new Map();

function getTexture(src) {
  if (!src) return null;
  let tex = textureCache.get(src);
  if (!tex) {
    try {
      tex = Texture.from(src);
      textureCache.set(src, tex);
    } catch (e) {
      return null;
    }
  }
  return tex;
}

/**
 * Trigger GPU Screen Shake on hard impacts & special moves
 */
export function triggerFightShake(power = 6, duration = 0.2) {
  shakePower = power;
  shakeT = duration;
}

/**
 * Initialize PixiJS v8 on fighting canvas
 */
export async function initFightPixi(canvas) {
  if (!canvas) return null;
  if (fightApp) return fightApp;
  if (isInitializing) return null;

  isInitializing = true;
  try {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const app = new Application();

    await app.init({
      canvas,
      width: canvas.width || STAGE_W,
      height: canvas.height || STAGE_H,
      background: 0x060914,
      antialias: true,
      resolution: dpr,
      autoDensity: true,
      preference: "webgl"
    });

    rootContainer = new Container();
    stageContainer = new Container();
    rootContainer.addChild(stageContainer);

    // 1. Background layer
    bgGraphics = new Graphics();
    stageContainer.addChild(bgGraphics);

    // 2. Desks layer
    desksGraphics = new Graphics();
    stageContainer.addChild(desksGraphics);

    // 3. Fighters layer
    fightersContainer = new Container();
    p1Container = createFighterContainer();
    p2Container = createFighterContainer();
    fightersContainer.addChild(p1Container.root);
    fightersContainer.addChild(p2Container.root);
    stageContainer.addChild(fightersContainer);

    // 4. Combat FX layer
    fxContainer = new Container();
    stageContainer.addChild(fxContainer);

    // 5. Top HUD layer
    hudGraphics = new Graphics();
    hudTextContainer = new Container();
    rootContainer.addChild(hudGraphics);
    rootContainer.addChild(hudTextContainer);

    app.stage.addChild(rootContainer);
    fightApp = app;
    isInit = true;
    isInitializing = false;
    console.log("⚔️ PixiJS v8 Fight Engine initialized with hardware acceleration!");
    return fightApp;
  } catch (err) {
    console.warn("Could not initialize PixiJS Fight Engine:", err);
    isInitializing = false;
    return null;
  }
}

function createFighterContainer() {
  const root = new Container();
  const shadow = new Graphics();
  shadow.ellipse(0, 0, 24, 7);
  shadow.fill({ color: 0x000000, alpha: 0.45 });

  const sprite = new Sprite();
  sprite.anchor.set(0.5, 1.0); // Grounded on feet

  const label = new Text({
    text: "",
    style: new TextStyle({
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "bold",
      fill: 0xffffff
    })
  });
  label.anchor.set(0.5, 1.0);
  label.position.set(0, -68);

  root.addChild(shadow);
  root.addChild(sprite);
  root.addChild(label);

  return { root, shadow, sprite, label, currentSrc: null };
}

/**
 * Render Complete Fight Scene via PixiJS v8 GPU
 */
export function renderFightPixi({
  pixiCanvas,
  mainCanvas,
  FightState,
  GameState,
  platforms,
  dt = 0.016
}) {
  if (!pixiCanvas) return false;
  if (!isInit || !fightApp) {
    initFightPixi(pixiCanvas);
    return false;
  }

  // Ensure canvas is visible
  if (pixiCanvas.style.display === "none") {
    pixiCanvas.style.display = "block";
    if (mainCanvas) mainCanvas.style.display = "none";
  }

  const W = GameState.W || 960;
  const H = GameState.H || 540;

  // Resize Pixi renderer to canvas if dimensions changed
  if (fightApp.renderer.width !== pixiCanvas.width || fightApp.renderer.height !== pixiCanvas.height) {
    fightApp.renderer.resize(pixiCanvas.width, pixiCanvas.height);
  }

  // Stage scaling
  const scale = Math.min(W / STAGE_W, H / STAGE_H);
  const ox = Math.round((W - STAGE_W * scale) / 2);
  const oy = Math.round((H - STAGE_H * scale) / 2);

  // Update Screen Shake
  let shakeX = 0;
  let shakeY = 0;
  if (shakeT > 0) {
    shakeT -= dt;
    shakeX = (Math.random() - 0.5) * shakePower;
    shakeY = (Math.random() - 0.5) * shakePower;
  }

  stageContainer.position.set(ox + shakeX, oy + shakeY);
  stageContainer.scale.set(scale, scale);

  // 1. Draw Office Backdrop
  drawOfficeStagePixi(bgGraphics, STAGE_W, STAGE_H, GameState.time || 0);

  // 2. Draw Office Platforms & Desks
  drawOfficeDesksPixi(desksGraphics, platforms);

  // 3. Update Fighters
  if (FightState.p1) updateFighterPixi(p1Container, FightState.p1, 0);
  if (FightState.p2) updateFighterPixi(p2Container, FightState.p2, 1);

  // 4. Update Combat FX (Sparks, Projectiles, Damage Floaters)
  updateCombatFxPixi(fxContainer, FightState);

  // 5. Update Top HUD
  drawTopHudPixi(hudGraphics, hudTextContainer, FightState, W, H, scale, ox, oy);

  // Render GPU frame
  fightApp.render();
  return true;
}

function drawOfficeStagePixi(g, W, H, time) {
  g.clear();

  // Night office background gradient simulation
  g.rect(0, 0, W, FLOOR_Y);
  g.fill({ color: 0x0c1328 });

  // Skyline windows
  for (let i = 0; i < 7; i++) {
    const bx = i * 145 + 20;
    g.rect(bx, 60, 110, FLOOR_Y - 60);
    g.fill({ color: 0x121938 });

    // Cubicle lights
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if ((i * 3 + row + col) % 4 === 0) {
          g.rect(bx + 14 + col * 30, 85 + row * 45, 20, 24);
          g.fill({ color: 0x59d8ff, alpha: 0.35 });
        }
      }
    }
  }

  // IT Server Racks with glowing LEDs
  g.rect(60, FLOOR_Y - 140, 70, 140);
  g.fill({ color: 0x192244 });
  g.rect(830, FLOOR_Y - 140, 70, 140);
  g.fill({ color: 0x192244 });

  for (let r = 0; r < 5; r++) {
    const isGreen = r % 2 === 0;
    g.rect(115, FLOOR_Y - 125 + r * 22, 6, 6);
    g.fill({ color: isGreen ? 0x42f584 : 0xff4d5e });
    g.rect(845, FLOOR_Y - 125 + r * 22, 6, 6);
    g.fill({ color: isGreen ? 0x42f584 : 0xff4d5e });
  }

  // Office Floor
  g.rect(0, FLOOR_Y, W, H - FLOOR_Y);
  g.fill({ color: 0x161e38 });

  for (let x = 0; x < W; x += 40) {
    g.rect(x, FLOOR_Y + 10, 20, H - FLOOR_Y - 10);
    g.fill({ color: 0x1b2545 });
  }

  // Neon Floor Line
  g.moveTo(0, FLOOR_Y);
  g.lineTo(W, FLOOR_Y);
  g.stroke({ color: 0x59d8ff, width: 3 });
}

function drawOfficeDesksPixi(g, platforms) {
  g.clear();
  if (!platforms) return;

  for (const plat of platforms) {
    if (plat.isFloor) continue;

    // Desk surface
    g.rect(plat.x, plat.y, plat.w, plat.h);
    g.fill({ color: 0x25345c });

    // Desk rim
    g.rect(plat.x, plat.y, plat.w, 3);
    g.fill({ color: 0x59d8ff });

    // Desk legs
    g.rect(plat.x + 8, plat.y + plat.h, 8, FLOOR_Y - (plat.y + plat.h));
    g.fill({ color: 0x16203a });
    g.rect(plat.x + plat.w - 16, plat.y + plat.h, 8, FLOOR_Y - (plat.y + plat.h));
    g.fill({ color: 0x16203a });

    // Desk Props
    if (plat.label === "DESK 1") {
      // Monitor
      g.rect(plat.x + 40, plat.y - 34, 46, 30);
      g.fill({ color: 0x0c1326 });
      g.rect(plat.x + 40, plat.y - 34, 46, 30);
      g.stroke({ color: 0x59d8ff, width: 1.5 });

      // Code lines
      g.rect(plat.x + 44, plat.y - 28, 22, 2);
      g.fill({ color: 0x42f584 });
      g.rect(plat.x + 44, plat.y - 22, 32, 2);
      g.fill({ color: 0x42f584 });
    } else if (plat.label === "DESK 2") {
      // Laptop
      g.rect(plat.x + 85, plat.y - 18, 28, 18);
      g.fill({ color: 0xdfe8ff });
      g.rect(plat.x + 87, plat.y - 16, 24, 12);
      g.fill({ color: 0x59d8ff });
    }
  }
}

function updateFighterPixi(fContainer, f, side) {
  const { root, sprite, label } = fContainer;

  root.position.set(f.x, f.y + f.h);
  root.scale.x = f.facing < 0 ? -1 : 1;

  // Hurt reaction: instant GPU red tint + blink
  if (f.state === "hurt") {
    sprite.tint = 0xff3b4d;
  } else {
    sprite.tint = 0xffffff;
  }

  // Update name label
  label.text = `${f.config.emoji} ${f.config.name}`;
  label.style.fill = side === 0 ? 0x59d8ff : 0xffd25e;
  label.scale.x = f.facing < 0 ? -1 : 1; // Un-flip text

  // Resolve texture from ANIM
  const animRec = ANIM[f.id];
  let currentSrc = null;

  if (animRec && animRec.ready && animRec.type === "poses") {
    const poseKey = f.anim.name;
    const imgList = animRec.images[poseKey] || animRec.images.idle || Object.values(animRec.images)[0];
    if (imgList && imgList.length > 0) {
      const fr = Math.min(f.anim.frame, imgList.length - 1);
      const img = imgList[fr];
      if (img && img.src) currentSrc = img.src;
    }
  }

  if (!currentSrc) {
    const spr = SPR[f.id];
    if (spr && spr.img && spr.img.src) currentSrc = spr.img.src;
  }

  if (currentSrc) {
    if (fContainer.currentSrc !== currentSrc) {
      fContainer.currentSrc = currentSrc;
      sprite.texture = getTexture(currentSrc);
    }

    const tex = sprite.texture;
    if (tex) {
      const targetH = animRec ? (animRec.targetH || 60) : 58;
      const canvH = animRec ? (animRec.canvH || 280) : 280;
      const canvW = animRec ? (animRec.canvW || 380) : 380;
      const scaleF = targetH / canvH;

      sprite.width = canvW * scaleF;
      sprite.height = canvH * scaleF;
    }
  }
}

function updateCombatFxPixi(container, FightState) {
  // Clear existing children for fresh frame
  container.removeChildren();

  // 1. Projectiles
  for (const pr of FightState.projectiles) {
    if (pr.kind === "404") {
      const pText = new Text({
        text: "⚠️ 404",
        style: new TextStyle({ fontFamily: "monospace", fontSize: 14, fontWeight: "bold", fill: 0xff4d5e })
      });
      pText.position.set(pr.x - 14, pr.y - 7);
      container.addChild(pText);
    } else if (pr.kind === "wave") {
      const g = new Graphics();
      g.arc(pr.x, pr.y, 16, -Math.PI * 0.4, Math.PI * 0.4);
      g.stroke({ color: 0x59d8ff, width: 3 });
      container.addChild(g);
    }
  }

  // 2. Hit Sparks
  for (const spk of FightState.hitSparks) {
    const alpha = Math.max(0, spk.life / spk.maxLife);
    const g = new Graphics();
    const rOut = spk.size * (1.1 - alpha * 0.2);
    const rIn = 4;

    // Star
    const starPts = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? rOut : rIn;
      starPts.push(spk.x + Math.cos(angle) * r, spk.y + Math.sin(angle) * r);
    }
    g.poly(starPts);
    g.fill({ color: spk.isCritical ? 0xffd25e : 0xffffff, alpha });

    // Inner core
    g.circle(spk.x, spk.y, 4);
    g.fill({ color: 0xffffff, alpha });

    container.addChild(g);
  }

  // 3. Floating Damage Numbers
  for (const f of FightState.floaters) {
    const alpha = Math.min(1, f.t * 2);
    const dText = new Text({
      text: f.txt,
      style: new TextStyle({
        fontFamily: "monospace",
        fontSize: 15,
        fontWeight: "bold",
        fill: f.col === "#ffd25e" ? 0xffd25e : 0xff4d5e
      })
    });
    dText.anchor.set(0.5, 0.5);
    dText.position.set(f.x, f.y);
    dText.alpha = alpha;
    container.addChild(dText);
  }
}

function drawTopHudPixi(g, textContainer, FightState, W, H, scale, ox, oy) {
  g.clear();
  textContainer.removeChildren();

  const p1 = FightState.p1;
  const p2 = FightState.p2;
  if (!p1 || !p2) return;

  const barW = Math.min(340 * scale, (W / 2) - 60);
  const barH = 22 * scale;
  const barY = 16 * scale + oy;

  // P1 Health Bar
  const p1Ratio = Math.max(0, p1.hp / p1.maxHp);
  g.rect(ox + 40 * scale, barY, barW, barH);
  g.fill({ color: 0x11162b });
  g.rect(ox + 40 * scale, barY, barW * p1Ratio, barH);
  g.fill({ color: p1Ratio > 0.3 ? 0x42f584 : 0xff4d5e });
  g.rect(ox + 40 * scale, barY, barW, barH);
  g.stroke({ color: 0x59d8ff, width: 2 });

  // P2 Health Bar
  const p2Ratio = Math.max(0, p2.hp / p2.maxHp);
  const p2BarX = W - ox - 40 * scale - barW;
  g.rect(p2BarX, barY, barW, barH);
  g.fill({ color: 0x11162b });
  g.rect(p2BarX + barW * (1 - p2Ratio), barY, barW * p2Ratio, barH);
  g.fill({ color: p2Ratio > 0.3 ? 0x42f584 : 0xff4d5e });
  g.rect(p2BarX, barY, barW, barH);
  g.stroke({ color: 0xff8f2e, width: 2 });

  // Timer in Center
  const timerVal = Math.max(0, Math.ceil(FightState.matchTime || 0));
  const tText = new Text({
    text: String(timerVal),
    style: new TextStyle({
      fontFamily: "monospace",
      fontSize: Math.round(26 * scale),
      fontWeight: "900",
      fill: 0xffd25e
    })
  });
  tText.anchor.set(0.5, 0.5);
  tText.position.set(W / 2, barY + barH / 2);
  textContainer.addChild(tText);
}

/**
 * Hide Pixi fighting canvas when exiting fight mode
 */
export function hideFightPixi(pixiCanvas, mainCanvas) {
  if (pixiCanvas) pixiCanvas.style.display = "none";
  if (mainCanvas) mainCanvas.style.display = "block";
}
