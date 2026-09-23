// =============================================================================
// doodleRender.js — Render "boli sobre cuaderno" en dos pasadas con Three.js
//
// Pasada 1: cada objeto escribe DATOS en un render target (no color):
//   R = cuánta luz recibe (o -1 si es tinta sólida), G = id de tinta, BA = normal en vista.
// Pasada 2: un shader de pantalla completa convierte esos datos en dibujo:
//   contornos (profundidad + normales + cambio de tinta), rayado anclado al mundo
//   según la sombra, temblor de línea "hervido" y papel de libreta con renglones.
// =============================================================================

import * as THREE from "three";

export const INK = { BLUE: 0, RED: 1, BLACK: 2, ORANGE: 3, GREEN: 4, PURPLE: 5 };

const INK_RGB = [
  [0.12, 0.22, 0.72], // azul Bic
  [0.84, 0.14, 0.2], // rojo corrector
  [0.16, 0.17, 0.22], // negro
  [0.93, 0.5, 0.1], // naranja
  [0.1, 0.55, 0.32], // verde
  [0.52, 0.24, 0.74] // morado
];

const LIGHT_WORLD = new THREE.Vector3(0.42, 0.84, 0.34).normalize();
const lightUniform = { value: new THREE.Vector3(0, 1, 0) };

const SCENE_VERT = /* glsl */ `
varying vec3 vN;
void main() {
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const SCENE_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uLight;
uniform float uInk;
uniform float uFill;
uniform float uTone;
varying vec3 vN;
void main() {
  vec3 n = normalize(vN);
  if (!gl_FrontFacing) n = -n;
  float l = dot(n, uLight) * 0.5 + 0.5;
  float shade = clamp(l * 0.95 + uTone, 0.0, 1.0);
  if (uFill > 0.5) shade = -1.0;
  gl_FragColor = vec4(shade, uInk, n.x, n.y);
}`;

const POST_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const POST_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D tData;
uniform sampler2D tDepth;
uniform vec2 uRes;
uniform float uNear;
uniform float uFar;
uniform float uTime;
uniform float uHurt;
uniform float uLowHp;
uniform float uFlash;
uniform mat4 uInvProj;
uniform mat4 uInvView;
uniform vec3 uPaper;
uniform vec3 uInks[6];

float h21(vec2 p) { p = fract(p * vec2(233.34, 851.73)); p += dot(p, p + 23.45); return fract(p.x * p.y); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x),
             mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float lin(float z) { float n = z * 2.0 - 1.0; return 2.0 * uNear * uFar / (uFar + uNear - n * (uFar - uNear)); }
vec3 inkCol(float id) {
  int idx = int(id + 0.5);
  vec3 c = uInks[0];
  for (int k = 1; k < 6; k++) { if (k == idx) c = uInks[k]; }
  return c;
}
// rayas paralelas con antialias; w = grosor como fracción del espaciado
float strokes(vec2 p, vec2 dir, float sp, float w) {
  float t = dot(p, vec2(-dir.y, dir.x)) / sp;
  float f = abs(fract(t) - 0.5);
  float aa = min(fwidth(t), 0.25) + 1e-4;
  return 1.0 - smoothstep(w * 0.5 - aa, w * 0.5 + aa, f);
}

void main() {
  vec2 px = 1.0 / uRes;
  float sc = uRes.y / 900.0;
  float aspect = uRes.x / uRes.y;

  // las líneas "hierven": el temblor cambia a saltos, como animación dibujada a mano
  float boil = floor(uTime * 6.0) * 7.31;
  vec2 q = vUv * vec2(aspect, 1.0) * 6.0;
  vec2 wob = vec2(vnoise(q + boil), vnoise(q + 19.7 + boil)) - 0.5;
  vec2 uv = vUv + wob * 2.4 * sc * px;

  vec4 s = texture2D(tData, uv);
  float z = texture2D(tDepth, uv).x;
  bool sky = z >= 0.99999;
  float d = lin(z);

  // ── contornos ──
  float o = 1.2 * sc;
  vec2 ox = vec2(o, 0.0) * px, oy = vec2(0.0, o) * px;
  float zl = texture2D(tDepth, uv - ox).x, zr = texture2D(tDepth, uv + ox).x;
  float zu = texture2D(tDepth, uv + oy).x, zd = texture2D(tDepth, uv - oy).x;
  vec4 sl = texture2D(tData, uv - ox), sr = texture2D(tData, uv + ox);
  vec4 su = texture2D(tData, uv + oy), sd = texture2D(tData, uv - oy);
  // la inversa de la profundidad es lineal sobre cualquier plano, así que su segunda
  // derivada sólo se dispara en siluetas reales (el suelo en rasante no pinta rayas falsas)
  float iw = 1.0 / d;
  float lap = abs(1.0 / lin(zl) + 1.0 / lin(zr) - 2.0 * iw) + abs(1.0 / lin(zu) + 1.0 / lin(zd) - 2.0 * iw);
  float edge = smoothstep(0.06, 0.26, lap / (iw + 1e-7));
  float nEdge = length(sl.ba - sr.ba) + length(su.ba - sd.ba);
  edge = max(edge, smoothstep(0.45, 0.9, nEdge));
  float iEdge = abs(sl.g - sr.g) + abs(su.g - sd.g);
  edge = max(edge, step(0.5, iEdge) * 0.9);

  // la tinta del contorno es la del objeto que está delante
  float zmin = z; float inkId = s.g;
  if (zl < zmin) { zmin = zl; inkId = sl.g; }
  if (zr < zmin) { zmin = zr; inkId = sr.g; }
  if (zu < zmin) { zmin = zu; inkId = su.g; }
  if (zd < zmin) { zmin = zd; inkId = sd.g; }
  float dFront = lin(zmin);

  // ── rayado ──
  float shade = s.r;
  float hatch = 0.0;
  if (!sky) {
    if (shade < 0.0) {
      hatch = 1.0;
    } else {
      vec2 hp; float sp;
      if (d < 1.4) {
        // el arma va pegada a la cámara: para ella la pantalla es el marco estable
        hp = gl_FragCoord.xy + wob * 4.0 * sc;
        sp = 7.5 * sc;
      } else {
        // reconstruimos la posición en el mundo y rayamos sobre el plano al que mira la superficie,
        // así el trazo se queda quieto en la pared mientras te mueves
        vec4 clip = vec4(uv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0);
        vec4 vp = uInvProj * clip; vp /= vp.w;
        vec3 wp = (uInvView * vec4(vp.xyz, 1.0)).xyz;
        vec3 nv = vec3(s.b, s.a, sqrt(max(0.0, 1.0 - dot(s.ba, s.ba))));
        vec3 wn = abs(normalize(mat3(uInvView) * nv));
        hp = wn.y > max(wn.x, wn.z) ? wp.xz : (wn.x > wn.z ? wp.zy : wp.xy);
        // espaciado en potencias de dos según la distancia: densidad en pantalla casi constante, sin moiré
        float target = d * 0.0125 / max(sc, 0.5);
        sp = 0.16 * exp2(floor(log2(max(1e-4, target / 0.16))));
        hp += (vnoise(hp * (2.2 / sp)) - 0.5) * sp * 0.35;
      }
      float h1 = strokes(hp, vec2(0.7071, 0.7071), sp, 0.2);
      float h2 = strokes(hp, vec2(-0.7071, 0.7071), sp * 1.12, 0.18);
      float h3 = strokes(hp, vec2(0.2588, 0.9659), sp * 0.74, 0.17);
      hatch = h1 * smoothstep(0.66, 0.52, shade);
      hatch = max(hatch, h2 * smoothstep(0.44, 0.32, shade));
      hatch = max(hatch, h3 * smoothstep(0.26, 0.15, shade));
      hatch = max(hatch, smoothstep(0.1, 0.0, shade) * 0.85);
    }
  }
  float fade = mix(1.0, 0.3, smoothstep(16.0, 90.0, d));
  float fadeE = mix(1.0, 0.5, smoothstep(30.0, 160.0, dFront));

  // ── papel de libreta ──
  vec2 pp = gl_FragCoord.xy;
  float grain = vnoise(pp * 0.8) * 0.6 + vnoise(pp * 0.15) * 0.4;
  vec3 col = uPaper * (0.95 + 0.06 * grain);
  float ls = 34.0 * sc;
  float ly = mod(pp.y, ls);
  float rule = 1.0 - smoothstep(0.5 * sc, 1.6 * sc, abs(ly - ls * 0.5));
  col = mix(col, vec3(0.6, 0.72, 0.93), rule * 0.45);
  float margin = 1.0 - smoothstep(0.9 * sc, 2.2 * sc, abs(pp.x - uRes.x * 0.075));
  col = mix(col, vec3(0.92, 0.5, 0.56), margin * 0.5);

  col = mix(col, inkCol(s.g), hatch * 0.74 * fade);
  float ew = 0.75 + 0.35 * vnoise(pp * 0.33 + boil);
  col = mix(col, inkCol(inkId) * 0.9, clamp(edge * ew, 0.0, 1.0) * fadeE);

  // ── daño: viñeta de garabatos rojos; vida baja: pulso ──
  vec2 vc = (vUv - 0.5) * vec2(aspect, 1.0);
  float vig = smoothstep(0.3, 0.9, length(vc));
  float scr = 0.5 + 0.5 * strokes(pp + wob * 9.0, normalize(vec2(1.0, 0.75)), 7.0 * sc, 0.32);
  float hurt = clamp(uHurt + uLowHp * (0.3 + 0.25 * sin(uTime * 6.0)), 0.0, 1.0);
  col = mix(col, uInks[1] * 0.9, hurt * vig * scr);
  col = mix(col, uPaper, uFlash);
  gl_FragColor = vec4(col, 1.0);
}`;

// ── Materiales de escena (cacheados por tinta/relleno/tono) ─────────────────────
const matCache = new Map();

/**
 * Material "de datos" para la pasada 1.
 * @param {number} ink  id de INK
 * @param {{fill?: boolean, tone?: number}} opts  fill = tinta sólida; tone = más claro (+) u oscuro (-)
 */
export function mat(ink, opts = {}) {
  const fill = opts.fill ? 1 : 0;
  const tone = opts.tone || 0;
  const key = `${ink}|${fill}|${tone}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.ShaderMaterial({
      vertexShader: SCENE_VERT,
      fragmentShader: SCENE_FRAG,
      side: THREE.DoubleSide,
      uniforms: {
        uLight: lightUniform,
        uInk: { value: ink },
        uFill: { value: fill },
        uTone: { value: tone }
      }
    });
    m.userData = { ink, fill, tone };
    matCache.set(key, m);
  }
  return m;
}

export function createDoodleRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const pr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
  renderer.setPixelRatio(pr);
  renderer.setClearColor(0x000000, 0);

  const makeTarget = (w, h) => {
    const depthTexture = new THREE.DepthTexture(w, h);
    depthTexture.type = THREE.UnsignedIntType;
    return new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      depthBuffer: true,
      depthTexture
    });
  };
  let target = makeTarget(2, 2);

  const post = new THREE.ShaderMaterial({
    vertexShader: POST_VERT,
    fragmentShader: POST_FRAG,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      tData: { value: target.texture },
      tDepth: { value: target.depthTexture },
      uRes: { value: new THREE.Vector2(2, 2) },
      uNear: { value: 0.05 },
      uFar: { value: 220 },
      uTime: { value: 0 },
      uHurt: { value: 0 },
      uLowHp: { value: 0 },
      uFlash: { value: 0 },
      uInvProj: { value: new THREE.Matrix4() },
      uInvView: { value: new THREE.Matrix4() },
      uPaper: { value: new THREE.Vector3(0.965, 0.952, 0.9) },
      uInks: { value: INK_RGB.map((c) => new THREE.Vector3(...c)) }
    }
  });
  const postScene = new THREE.Scene();
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), post);
  quad.frustumCulled = false;
  postScene.add(quad);

  function setSize(w, h) {
    renderer.setSize(w, h, false);
    const bw = Math.max(2, Math.floor(w * pr));
    const bh = Math.max(2, Math.floor(h * pr));
    target.dispose();
    target = makeTarget(bw, bh);
    post.uniforms.tData.value = target.texture;
    post.uniforms.tDepth.value = target.depthTexture;
    post.uniforms.uRes.value.set(bw, bh);
  }

  const tmpM3 = new THREE.Matrix3();
  // overlay: escena que se pinta encima del dibujo con sus colores reales (la pegatina del personaje)
  function render(scene, camera, fx, overlay) {
    camera.updateMatrixWorld();
    lightUniform.value.copy(LIGHT_WORLD).applyMatrix3(tmpM3.setFromMatrix4(camera.matrixWorldInverse)).normalize();

    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);

    const u = post.uniforms;
    u.uNear.value = camera.near;
    u.uFar.value = camera.far;
    u.uInvProj.value.copy(camera.projectionMatrixInverse);
    u.uInvView.value.copy(camera.matrixWorld);
    u.uTime.value = fx.time;
    u.uHurt.value = fx.hurt;
    u.uLowHp.value = fx.lowHp;
    u.uFlash.value = fx.flash;
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCam);
    if (overlay) {
      renderer.autoClear = false;
      renderer.render(overlay, camera);
      renderer.autoClear = true;
    }
  }

  function dispose() {
    target.dispose();
    post.dispose();
    quad.geometry.dispose();
    matCache.forEach((m) => m.dispose());
    matCache.clear();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return { renderer, setSize, render, dispose };
}
