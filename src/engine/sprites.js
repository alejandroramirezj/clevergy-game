import { FLY_META } from "../config/characters.js";

export function makeSprite(rows, pal, scale = 3) {
  const w = rows[0].length, h = rows.length;
  const c = document.createElement("canvas");
  c.width = w * scale;
  c.height = h * scale;
  const g = c.getContext("2d");
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      if (ch === "." || !pal[ch]) continue;
      g.fillStyle = pal[ch];
      g.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  const f = document.createElement("canvas");
  f.width = c.width;
  f.height = c.height;
  const fg = f.getContext("2d");
  fg.translate(c.width, 0);
  fg.scale(-1, 1);
  fg.drawImage(c, 0, 0);
  return { img: c, flip: f, w: c.width, h: c.height };
}

export const SPR = {};

export function initSprites() {
  SPR.alejandro = makeSprite(
    [".ww......ww.","wwWw....wWww","wWWw....wWWw",".ww.dddd.ww.","..ddDDDDdd..",".dDyDDDDyDd.",".dDDDDDDDDd.","..ddDDDDdd..","rr..dddd..rr","RRr.d..d.rRR","RRr......rRR",".rr......rr."],
    { w: "#dbe7ff", W: "#9fb8e8", d: "#3a4152", D: "#565f75", y: "#ffd25e", r: "#e5303f", R: "#ff5b64" }
  );
  SPR.ale = makeSprite(
    ["....gg......","....GG......","....gg......","...oOOo.....","..oOOOOo....","..oYYYYo....","..oYYYYo....","..oYYYYo....","..oYyyYo....","..oYYYYo....","..oOOOOo....","...oooo....."],
    { g: "#2e8a4e", G: "#1d5c33", o: "#d9a23a", O: "#f0c46a", Y: "#ffd97a", y: "#fff0c0" }
  );
  SPR.alvaroM = makeSprite(
    ["gggggggggggg","gGGGGGGGGGGg","gSSSSSSSSSSg","gS404_ERRSSg","gGGGGGGGGGGg","gKKgKKgKKgKg","gKKgKKgKKgKg","gGGGGGGGGGGg","gKKgKKgKKgKg","gKKgKKgKKgKg","gGGGGGGGGGGg","gggggggggggg"],
    { g: "#565f75", G: "#7a84a3", S: "#b6f542", K: "#2a2f3d", "4": "#0b0e1a", "0": "#0b0e1a", "_": "#b6f542", E: "#0b0e1a", R: "#0b0e1a" }
  );
  SPR.alvaroP = makeSprite(
    ["...kKKKKk...","..kKgKgKKk..","..kKKgKKKk..","..kKgKgKKk..","..kKgKgKKk..","...kKKKKk...","....ssss....","....ssss....","....ssss....","...ssssss...","..ssssssss..","..ssssssss.."],
    { k: "#2a2f3d", K: "#3d445c", g: "#8fa3d9", s: "#565f75" }
  );
  SPR.ana = makeSprite(
    ["..mmmmmm....",".mMMMMMMm...","mMyyyyyyMm..","mMyKyyKyMm..","mMyyyyyyMm..",".mMyooyMm...","..mmmmmm....","...gggg.....","..gGGGGg.oo.","..gGGGGgggo.","...g..g.....","...k..k....."],
    { m: "#c97f2e", M: "#a8621d", y: "#ffd9a0", K: "#3b2a1a", o: "#e58a3a", g: "#4f8f4f", G: "#66b366", k: "#3b2a1a" }
  );
  SPR.beltran = makeSprite(
    ["....bbbb....","..bbBBBBbb..",".bBBBBBBBBb.",".bBoBBoBBob.","bBBBBBBBBBBb","bBoBBoBBoBBb","bBBBBBBBBBBb","bBoBBoBBoBBb","bBBKBBBBKBBb","bBBBBwwBBBBb","bbbbbbbbbbbb",".bbbbbbbbbb."],
    { b: "#1d3a8f", B: "#3457c9", o: "#59d8ff", K: "#0b0e1a", w: "#dfe8ff" }
  );
  SPR.bruno = makeSprite(
    [".tttttttttt.","tTKtKTTKtKTt","tTTTooTTTTTt","tttttttttttt","tTKtKTTKtKTt","tTTToTTTTTTt","tttttttttttt","tTKtTTKTtKTt","tTTTTooTTTTt","tttttttttttt","tTKtKTTKtKTt",".tttttttttt."],
    { t: "#6b5540", T: "#8a7055", K: "#2a1f14", o: "#d9a23a" }
  );
  SPR.gonzalo = makeSprite(
    ["..gGGgGGg...",".gGGGGGGGg..","gGGgGGGgGGg.","gGGGGGGGGGg.",".gGgGGGgGg..","..gGGGGGg...","...ssSs.....","...sSSs.....","...sSSs.....","...sSSs.....","..ssSSss....","..ssssss...."],
    { g: "#2e8a4e", G: "#3fb865", s: "#b8d98a", S: "#cdeaa0" }
  );
  SPR.javi = makeSprite(
    ["rrrrrrrrrrrr","rRRRRRRRRRRr","rRRyRRRRyRRr","rRRyyRRyyRRr","rRRRyyyyRRRr","rRRyyRyyRRRr","rRyyRRRyyRRr","rRRRRRRRRRRr","rrrrrrrrrrrr","....kk......","....kk......","....kk......"],
    { r: "#a81020", R: "#d92b3a", y: "#ffd25e", k: "#565f75" }
  );
  SPR.jesus = makeSprite(
    ["....bbbb....","....bBBb....","....bBBb....","...bbBBbb...","..bBBBBBBb..",".bBBBBBBBBb.",".bBrrrrrrBb.",".bBryyyyrBb.",".bBryKKyrBb.",".bBrrrrrrBb.",".bBBBBBBBBb.","..bbbbbbbb.."],
    { b: "#1d5c33", B: "#2e8a4e", r: "#d92b3a", y: "#ffe08a", K: "#7a1020" }
  );
  SPR.joseluis = makeSprite(
    ["pppppppppppp","pPPPPPPPPPPp","p..pXXp....p","p..pXXp....p","p...gg.....p","pPPPPPPPPPPp","pGGGGGGGGGGp","pG.oo....GGp","pGGGGGGGGGGp","pppppppppppp","..k......k..","..k......k.."],
    { p: "#59617a", P: "#7a84a3", X: "#59d8ff", g: "#b6f542", G: "#3d445c", o: "#ffc857", k: "#2a2f3d" }
  );
  SPR.josu = makeSprite(
    ["....mmmm....","..mmMMMMmm..",".mMMrMMMMm..","mMMMMMMrMMm.","mMrMMMMMMMm.","mMMMMrMMMMm.",".mmmmmmmmm..",".wWwWwWwWw..",".wWwWwWwWw..",".wWwWwWwWw..",".wwwwwwwww..","............"],
    { m: "#b8763a", M: "#d9954f", r: "#d92b3a", w: "#dfe8ff", W: "#b8c4e0" }
  );
  SPR.juan = makeSprite(
    ["pppppppppppp","pPPPPPPPPPPp","pKKKKKKKpGGp","pKwwwwwKpoGp","pKwWWWwKpGGp","pKwwwwwKpoGp","pKKKKKKKpGGp","pPPPPPPPPPPp","pppppppppppp","............","..k......k..","............"],
    { p: "#565f75", P: "#7a84a3", K: "#2a2f3d", w: "#3d445c", W: "#ffd25e", G: "#3d445c", o: "#b6f542", k: "#2a2f3d" }
  );
  SPR.maca = makeSprite(
    ["....wwww....","..wwWWWWww..",".wWWyyyyWWw.",".wWyybbyyWw.","wWWybbbbyWWw","wWybbbbbbyWw","wWybbbbbbyWw","wWWybbbbyWWw",".wWyybbyyWw.",".wWWyyyyWWw.","..wwWWWWww..","....wwww...."],
    { w: "#cdd6e8", W: "#ffffff", y: "#ffd25e", b: "#3457c9" }
  );
  SPR.manu = makeSprite(
    ["....yyyy....","...yYYYYy...","...yYKKYy...","...yYYYYy...","...ykkkky...","..rrRRRRrr..",".rrRwwwwRrr.",".kk.RRRR.kk.","....RRRR....","....R..R....","..RRr..rRR..","..RRR..RRR.."],
    { y: "#ffd9a0", Y: "#ffe6b8", K: "#3b2a1a", k: "#3b2a1a", r: "#d92b3a", R: "#ff5b64", w: "#ffffff" }
  );
  SPR.pablo = makeSprite(
    ["......gg....",".....gg.....","...ooOOoo...","..oOOOOOOo..",".oOOOOOOOOo.",".oOOoOOOOOo.","oOOOOOOOoOOo","oOOoOOOOOOOo",".oOOOOOOoOo.",".oOOOOOOOOo.","..oOOOOOOo..","...oooooo..."],
    { g: "#2e8a4e", o: "#d97020", O: "#ff8f2e" }
  );
  SPR.paloma = makeSprite(
    ["............","...ww.......","..wWWw......",".wWWWWwww...","wWWWWWWWWww.","wWWWWWWWWWWw",".wWWWWWWWw..","..wWWWWw....","...wWWw..o..","....ww..oo..",".....kk.....","............"],
    { w: "#e8ecf5", W: "#ffffff", o: "#ffc857", k: "#e58a3a" }
  );
  SPR.silvia = makeSprite(
    ["............","............","........ss..","......ssSSs.","..ssssSSSSs.",".sSSSSSSSSs.",".sSSppppSSs.",".sSSSSSSSSs.",".swwwwwwwws.",".swwwwwwwws.","..ssssssss..","..k.k..k.k.."],
    { s: "#e8ecf5", S: "#ffffff", p: "#ff4d8d", w: "#cdd6e8", k: "#2a2f3d" }
  );
  SPR.email = makeSprite(
    ["eeeeeeeeee","eE......Ee","e.E....E.e","e..EKKE..e","e.E.KK.E.e","eE......Ee","eeeeeeeeee"],
    { e: "#dfe8ff", E: "#8fa3d9", K: "#2a2f3d" }, 3
  );
  SPR.re = makeSprite(
    ["rrrrrrrr","rR....Rr","r.RKKR.r","rR.KK.Rr","rrrrrrrr"],
    { r: "#ff8f98", R: "#d92b3a", K: "#3d0810" }, 3
  );
  SPR.meeting = makeSprite(
    ["..cccccc..",".cCCCCCCc.",".cKcKcKcc.",".cCCCCCCc.",".cKcKcKcc.",".cCCCCCCc.","..cccccc..","...pppp...","..pPPPPp..","..pPKKPp..","..pPPPPp..","...p..p..."],
    { c: "#7a5cd6", C: "#9d82f0", K: "#2a1f4d", p: "#5c4aa8", P: "#8a76d9" }, 3
  );
  SPR.frag = makeSprite(
    ["...ff...","..fFFf..",".fFXXFf.","fFXXXXFf","fFXXXXFf",".fFXXFf.","..fFFf..","...ff..."],
    { f: "#2e8a4e", F: "#b6f542", X: "#eaffc0" }, 3
  );
  SPR.worker = makeSprite(
    [".rr.","rRRr",".yy.",".RR.","rRRr",".kk.",".kk."],
    { r: "#a81020", R: "#d92b3a", y: "#ffd9a0", k: "#2a2f3d" }, 3
  );
  SPR.broc = makeSprite(
    [".gGg.","gGGGg",".gGg.","..s..",".ss.."],
    { g: "#2e8a4e", G: "#3fb865", s: "#b8d98a" }, 3
  );
  SPR.bomb404 = makeSprite(
    ["gggggg","gSSSSg","gS44Sg","gKgKgg","gggggg"],
    { g: "#565f75", S: "#b6f542", "4": "#0b0e1a", K: "#2a2f3d" }, 3
  );
  SPR.coffee = makeSprite(
    ["..ww..",".c..c.","cCCCCc","cCCCCcw","cCCCCcw",".cccc."],
    { c: "#8a5a2e", C: "#5c3a1a", w: "#dfe8ff" }, 3
  );

  // Load Alejandro custom high-res pose sprites
  loadPoses("alejandro", {
    idle: "/sprites/alejandro/idle.png",
    walk: "/sprites/alejandro/walk.png",
    run: ["/sprites/alejandro/run.png", "/sprites/alejandro/sprint.png"],
    jump: "/sprites/alejandro/jump.png",
    attack: "/sprites/alejandro/attack.png",
    death: "/sprites/alejandro/death.png"
  }, {
    faceRight: true,
    anchorX: 140,
    canvW: 360,
    canvH: 260,
    targetH: 58
  });

  // Load Alex Graciano (botella de aceite) custom high-res pose sprites
  loadPoses("ale", {
    idle: "/sprites/ale/idle.png",
    walk: "/sprites/ale/walk.png",
    run: "/sprites/ale/run.png",
    jump: "/sprites/ale/jump.png",
    attack: "/sprites/ale/attack.png",
    death: "/sprites/ale/death.png"
  }, {
    faceRight: true,
    anchorX: 150,
    canvW: 380,
    canvH: 280,
    targetH: 60
  });
}

export const ANIM = {};
export const anim = { name: "idle", frame: 0, t: 0, lock: null, lockT: 0 };
export const ANIM_FPS = { idle: 5, walk: 8, run: 12, jump: 8, attack: 14, damage: 10, death: 6, victory: 6 };
export const ANIM_ONCE = { attack: 1, damage: 1, death: 1 };

export function loadPoses(id, poses, options = {}) {
  const images = {};
  const anims = {};
  let totalFrames = 0;
  let loaded = 0;

  const rec = {
    type: "poses",
    ready: false,
    images,
    anims,
    faceRight: options.faceRight !== false, // Default is facing right ▶
    anchorX: options.anchorX ?? 140,
    canvW: options.canvW ?? 360,
    canvH: options.canvH ?? 260,
    targetH: options.targetH ?? 58
  };

  const keys = Object.keys(poses);
  for (const k of keys) {
    const val = poses[k];
    const srcList = Array.isArray(val) ? val : [val];
    totalFrames += srcList.length;
    images[k] = srcList.map((src) => {
      const im = new Image();
      im.onload = () => {
        loaded++;
        if (loaded >= totalFrames) rec.ready = true;
      };
      im.src = src;
      return im;
    });
    anims[k] = { frames: srcList.length };
  }

  // Common fallbacks
  if (!anims.walk && anims.idle) { anims.walk = anims.idle; images.walk = images.idle; }
  if (!anims.run && anims.walk) { anims.run = anims.walk; images.run = images.walk; }
  if (!anims.damage && anims.jump) { anims.damage = anims.jump; images.damage = images.jump; }
  if (!anims.damage && anims.idle) { anims.damage = anims.idle; images.damage = images.idle; }

  ANIM[id] = rec;
}

export function loadAnim(id, src, meta) {
  const im = new Image();
  const rec = { type: "sheet", sheet: im, fw: meta.fw, fh: meta.fh, anims: meta.anims, ready: false };
  im.onload = () => { rec.ready = true; };
  im.src = src;
  ANIM[id] = rec;
}

export function pickAnim(P) {
  if (anim.lock) return anim.lock;
  if (P.hp <= 0) return "death";
  if (P.slide > 0) return "attack";
  if (!P.onGround) return "jump";
  const spd = Math.abs(P.vx);
  if (spd > 4.6) return "run";
  if (spd > 0.4) return "walk";
  return "idle";
}

export function triggerAnim(name, charId) {
  const rec = ANIM[charId];
  if (!rec) return;
  const a = rec.anims && (rec.anims[name] || rec.anims.idle);
  const frames = a ? a.frames : 1;
  anim.lock = name;
  anim.frame = 0;
  anim.t = 0;
  anim.lockT = Math.max(0.24, frames / (ANIM_FPS[name] || 10));
}

export function updateAnim(dt, charId, P) {
  const rec = ANIM[charId];
  if (!rec || !rec.ready) return;
  if (anim.lock) {
    anim.lockT -= dt;
    if (anim.lockT <= 0 && anim.lock !== "death") {
      anim.lock = null;
    }
  }
  const want = anim.lock || pickAnim(P);
  if (want !== anim.name) {
    anim.name = want;
    anim.frame = 0;
    anim.t = 0;
  }
  const a = rec.anims[anim.name] || rec.anims.idle;
  if (!a) return;
  const fps = ANIM_FPS[anim.name] || 10;
  anim.t += dt;
  if (anim.t >= 1 / fps) {
    anim.t -= 1 / fps;
    if (ANIM_ONCE[anim.name] || anim.lock) {
      if (anim.frame < a.frames - 1) anim.frame++;
    } else {
      anim.frame = (anim.frame + 1) % a.frames;
    }
  }
}

export function drawAnimatedPlayer(cx, P, charId, bob) {
  const rec = ANIM[charId];
  if (!rec || !rec.ready) return false;

  // Mode 1: Individual Pose Images
  if (rec.type === "poses") {
    const poseKey = anim.name;
    const imgList = rec.images[poseKey] || rec.images.idle || Object.values(rec.images)[0];
    if (!imgList || !imgList.length) return false;
    const fr = Math.min(anim.frame, imgList.length - 1);
    const img = imgList[fr];
    if (!img || !img.complete) return false;

    const scale = rec.targetH / rec.canvH;
    const dw = rec.canvW * scale;
    const dh = rec.canvH * scale;
    const anchorX = rec.anchorX * scale;

    const dx = P.x + P.w / 2 - anchorX;
    const dy = P.y + P.h - dh - bob;

    const flip = rec.faceRight ? (P.face < 0) : (P.face > 0);

    cx.save();
    cx.imageSmoothingEnabled = false;
    if (flip) {
      const px = P.x + P.w / 2;
      cx.translate(px, 0);
      cx.scale(-1, 1);
      cx.drawImage(img, -anchorX, dy, dw, dh);
    } else {
      cx.drawImage(img, dx, dy, dw, dh);
    }
    cx.restore();
    return true;
  }

  // Mode 2: Legacy Spritesheet
  const a = rec.anims[anim.name] || rec.anims.idle;
  const fr = Math.min(anim.frame, a.frames - 1);
  const sx = fr * rec.fw;
  const sy = a.row * rec.fh;
  const scale = 0.62;
  const dw = rec.fw * scale;
  const dh = rec.fh * scale;
  const dx = P.x + P.w / 2 - dw / 2;
  const dy = P.y + P.h - dh + 2 - bob;

  const nativeLeft = rec.faceLeft !== false;
  const flip = nativeLeft ? (P.face > 0) : (P.face < 0);
  cx.save();
  cx.imageSmoothingEnabled = false;
  if (flip) {
    cx.translate(dx + dw, dy);
    cx.scale(-1, 1);
    cx.drawImage(rec.sheet, sx, sy, rec.fw, rec.fh, 0, 0, dw, dh);
  } else {
    cx.drawImage(rec.sheet, sx, sy, rec.fw, rec.fh, dx, dy, dw, dh);
  }
  cx.restore();
  return true;
}
