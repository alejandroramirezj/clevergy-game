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
  SPR.yair = makeSprite(
    ["...kkkkkk...","..kkKKKKkk..","..kyyyyyyk..","..kyKyyKyk..","..kyyyyyyk..","...kyrryk...","oooooooooooo","oOOOOOOOOkOo","oOssssssOkOo","oOssssssOOOo","oOOOOOOOOOOo","..ww....ww..","..gg....gg.."],
    { k: "#2a1a10", K: "#3b2a1a", y: "#e8b48a", r: "#c0392b", o: "#7a4a1e", O: "#b8742e", s: "#5c4a3a", w: "#ffffff", g: "#2e8a4e" }
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
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 150,
    canvW: 380,
    canvH: 280,
    targetH: 60
  });

  // Load Álvaro (micro de podcast) custom high-res pose sprites
  loadPoses("alvaroP", {
    idle: "/sprites/alvaroP/idle.png",
    walk: "/sprites/alvaroP/walk.png",
    run: "/sprites/alvaroP/run.png",
    jump: "/sprites/alvaroP/jump.png",
    attack: "/sprites/alvaroP/attack.png",
    death: "/sprites/alvaroP/death.png"
  }, {
    faceRight: true,
    relScale: true,
    anchorX: 210,
    canvW: 560,
    canvH: 340,
    targetH: 60
  });

  // Load Ana (escaladora leona) custom high-res pose sprites
  loadPoses("ana", {
    idle: "/sprites/ana/idle.png",
    walk: "/sprites/ana/walk.png",
    run: "/sprites/ana/walk.png",
    jump: "/sprites/ana/jump.png",
    climb: "/sprites/ana/climb.png",
    attack: "/sprites/ana/attack.png",
    death: "/sprites/ana/death.png"
  }, {
    faceRight: true,
    relScale: true,
    anchorX: 220,
    canvW: 560,
    canvH: 360,
    targetH: 60
  });

  // Load Álvaro Merino (calculadora) custom high-res pose sprites
  loadPoses("alvaroM", {
    idle: "/sprites/alvaroM/idle.png",
    walk: "/sprites/alvaroM/walk.png",
    run: "/sprites/alvaroM/run.png",
    jump: "/sprites/alvaroM/jump.png",
    attack: "/sprites/alvaroM/attack.png",
    death: "/sprites/alvaroM/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 210,
    canvW: 560,
    canvH: 340,
    targetH: 60
  });

  // Load Beltrán (dedal azul) custom high-res pose sprites
  loadPoses("beltran", {
    idle: "/sprites/beltran/idle.png",
    walk: "/sprites/beltran/walk.png",
    run: "/sprites/beltran/walk.png",
    jump: "/sprites/beltran/jump.png",
    attack: "/sprites/beltran/attack.png",
    death: "/sprites/beltran/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 140,
    canvW: 360,
    canvH: 280,
    targetH: 58
  });

  // Load Javi custom high-res pose sprites
  loadPoses("javi", {
    idle: "/sprites/javi/idle.png",
    walk: "/sprites/javi/walk.png",
    run: "/sprites/javi/walk.png",
    jump: "/sprites/javi/jump.png",
    attack: "/sprites/javi/attack.png",
    death: "/sprites/javi/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 180,
    canvW: 420,
    canvH: 360,
    targetH: 60
  });

  // Load Maca (pelota de voleibol) custom high-res pose sprites
  loadPoses("maca", {
    idle: "/sprites/maca/idle.png",
    walk: "/sprites/maca/walk.png",
    run: "/sprites/maca/walk.png",
    jump: "/sprites/maca/jump.png",
    attack: "/sprites/maca/attack.png",
    death: "/sprites/maca/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 190,
    canvW: 380,
    canvH: 280,
    targetH: 60
  });

  // Load Jesús (Cruzcampo bottle) custom high-res pose sprites
  loadPoses("jesus", {
    idle: "/sprites/jesus/idle.png",
    walk: "/sprites/jesus/walk.png",
    run: "/sprites/jesus/walk.png",
    jump: "/sprites/jesus/jump.png",
    attack: "/sprites/jesus/attack.png",
    death: "/sprites/jesus/death.png"
  }, {
    faceRight: true,
    anchorX: 160,
    canvW: 420,
    canvH: 280,
    targetH: 58
  });

  // Load Pablo (naranja) custom high-res pose sprites
  loadPoses("gonzalo", {
    idle: "/sprites/gonzalo/idle.png",
    walk: "/sprites/gonzalo/walk.png",
    run: "/sprites/gonzalo/walk.png",
    jump: "/sprites/gonzalo/walk.png",
    attack: "/sprites/gonzalo/attack.png",
    death: "/sprites/gonzalo/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("silvia", {
    idle: "/sprites/silvia/idle.png",
    walk: "/sprites/silvia/walk.png",
    run: "/sprites/silvia/walk.png",
    jump: "/sprites/silvia/jump.png",
    attack: "/sprites/silvia/attack.png",
    death: "/sprites/silvia/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("paloma", {
    idle: "/sprites/paloma/idle.png",
    walk: "/sprites/paloma/walk.png",
    run: "/sprites/paloma/walk.png",
    jump: "/sprites/paloma/jump.png",
    attack: "/sprites/paloma/attack.png",
    death: "/sprites/paloma/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("manu", {
    idle: "/sprites/manu/idle.png",
    walk: "/sprites/manu/walk.png",
    run: "/sprites/manu/walk.png",
    jump: "/sprites/manu/jump.png",
    attack: "/sprites/manu/attack.png",
    death: "/sprites/manu/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("bruno", {
    idle: "/sprites/bruno/idle.png",
    walk: "/sprites/bruno/walk.png",
    run: "/sprites/bruno/walk.png",
    jump: "/sprites/bruno/jump.png",
    attack: "/sprites/bruno/attack.png",
    death: "/sprites/bruno/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("josu", {
    idle: "/sprites/josu/idle.png",
    walk: "/sprites/josu/walk.png",
    run: "/sprites/josu/walk.png",
    jump: "/sprites/josu/jump.png",
    climb: "/sprites/josu/climb.png",
    attack: "/sprites/josu/attack.png",
    death: "/sprites/josu/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("yair", {
    idle: "/sprites/yair/idle.png",
    walk: "/sprites/yair/walk.png",
    run: "/sprites/yair/walk.png",
    jump: "/sprites/yair/jump.png",
    attack: "/sprites/yair/attack.png",
    death: "/sprites/yair/death.png"
  }, {
    faceRight: true,
    relScale: true, // todas las poses dibujadas a la misma escala
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  loadPoses("pablo", {
    idle: "/sprites/pablo/idle.png",
    walk: "/sprites/pablo/walk.png",
    run: "/sprites/pablo/walk.png",
    jump: "/sprites/pablo/jump.png",
    attack: "/sprites/pablo/attack.png",
    death: "/sprites/pablo/death.png"
  }, {
    faceRight: true,
    anchorX: 120,
    canvW: 320,
    canvH: 240,
    targetH: 58
  });

  // Load Juan (microondas) custom high-res pose sprites
  loadPoses("juan", {
    idle: "/sprites/juan/idle.png",
    walk: "/sprites/juan/walk.png",
    run: "/sprites/juan/walk.png",
    jump: "/sprites/juan/jump.png",
    attack: "/sprites/juan/attack.png",
    death: "/sprites/juan/death.png"
  }, {
    faceRight: true,
    anchorX: 140,
    canvW: 380,
    canvH: 260,
    targetH: 58
  });

  // Load José Luis (impresora 3D Bambu Lab) custom high-res pose sprites
  loadPoses("joseluis", {
    idle: "/sprites/joseluis/idle.png",
    walk: "/sprites/joseluis/walk.png",
    run: "/sprites/joseluis/walk.png",
    jump: "/sprites/joseluis/jump.png",
    attack: "/sprites/joseluis/attack.png",
    death: "/sprites/joseluis/death.png"
  }, {
    faceRight: true,
    anchorX: 140,
    canvW: 380,
    canvH: 360,
    targetH: 60
  });
}

export const ANIM = {};
export const ANIM_FPS = { idle: 5, walk: 8, run: 12, jump: 8, attack: 14, damage: 10, death: 6, victory: 6, shield: 6, block: 10 };
export const ANIM_ONCE = { attack: 1, damage: 1, death: 1, block: 1 };

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
    relScale: !!options.relScale,
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

export function getCharacterAvatar(charId) {
  if (charId === "alejandro") return "/sprites/alejandro/avatar.png";
  if (charId === "ale") return "/sprites/ale/avatar.png";
  if (charId === "alvaroP") return "/sprites/alvaroP/avatar.png";
  if (charId === "ana") return "/sprites/ana/avatar.png";
  if (charId === "alvaroM") return "/sprites/alvaroM/avatar.png";
  if (charId === "beltran") return "/sprites/beltran/idle.png";
  if (charId === "javi") return "/sprites/javi/avatar.png";
  if (charId === "maca") return "/sprites/maca/idle.png";
  if (charId === "jesus") return "/sprites/jesus/idle.png";
  if (charId === "pablo") return "/sprites/pablo/idle.png";
  if (charId === "juan") return "/sprites/juan/idle.png";
  if (charId === "joseluis") return "/sprites/joseluis/idle.png";
  if (charId === "yair") return "/sprites/yair/idle.png";
  if (charId === "josu") return "/sprites/josu/idle.png";
  if (charId === "bruno") return "/sprites/bruno/idle.png";
  if (charId === "manu") return "/sprites/manu/idle.png";
  if (charId === "paloma") return "/sprites/paloma/idle.png";
  if (charId === "silvia") return "/sprites/silvia/idle.png";
  if (charId === "gonzalo") return "/sprites/gonzalo/idle.png";
  const s = SPR[charId];
  if (s && s.img) {
    try {
      return s.img.toDataURL();
    } catch (e) {
      return null;
    }
  }
  return null;
}
