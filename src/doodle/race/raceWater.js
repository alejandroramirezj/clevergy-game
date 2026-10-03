// =============================================================================
// raceWater.js — Agua del pantano al estilo de jeantimex/threejs-water
// (port de "WebGL Water" de Evan Wallace) adaptado al render doodle.
//
// · Azulejo de rizos: simulación de alturas en GPU (ecuación de onda discreta,
//   texturas ping-pong) que se repite por todo el embalse, con gotas aleatorias.
// · Cáusticas: se proyecta la malla del azulejo con la luz refractada hasta el
//   fondo y se mide cuánto se concentra cada triángulo (área vieja / área nueva).
// · Parche de estelas: otra simulación que sigue al jugador; las motos, la lancha
//   y los aterrizajes empujan el agua y dejan olas y espuma reales.
// · Superficie: Fresnel + reflejo del cielo con el sol + refracción hasta el
//   fondo (azulejos en el canal de carrera, arena fuera) con absorción del agua.
//
// La superficie escribe en la pasada de datos de doodleRender con tinta 7:
// R,B,A = color real del agua (el post la pinta tal cual, sin rayado).
// =============================================================================

import * as THREE from "three";

export const WATER_INK = 7;

const LIGHT = new THREE.Vector3(0.42, 0.84, 0.34).normalize(); // la misma luz que doodleRender
const SIM_HZ = 60;

// ── pasadas de simulación (cuadro a pantalla completa) ───────────────────────
const QUAD_VERT = /* glsl */ `
varying vec2 coord;
void main() {
  coord = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

// gotas: perfil coseno como en WaterRipple.frag (hasta 16 por pasada)
const DROP_FRAG = /* glsl */ `
precision highp float;
const float PI = 3.141592653589793;
uniform sampler2D tInput;
uniform vec4 uDrops[16]; // xy = centro (uv), z = radio (uv), w = fuerza
uniform int uCount;
uniform float uWrap;
varying vec2 coord;
void main() {
  vec4 info = texture2D(tInput, coord);
  for (int i = 0; i < 16; i++) {
    if (i >= uCount) break;
    vec2 d = coord - uDrops[i].xy;
    if (uWrap > 0.5) d = fract(d + 0.5) - 0.5;
    float drop = max(0.0, 1.0 - length(d) / uDrops[i].z);
    drop = 0.5 - cos(drop * PI) * 0.5;
    info.r += drop * uDrops[i].w;
  }
  gl_FragColor = info;
}`;

// ecuación de onda: R = altura, G = velocidad (WaveSimulation.frag)
const UPDATE_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tInput;
uniform vec2 delta;
uniform float uK;
uniform float uDamp;
uniform float uEdge;
varying vec2 coord;
void main() {
  vec4 info = texture2D(tInput, coord);
  vec2 dx = vec2(delta.x, 0.0), dy = vec2(0.0, delta.y);
  float sum = texture2D(tInput, coord - dx).r + texture2D(tInput, coord + dx).r
            + texture2D(tInput, coord - dy).r + texture2D(tInput, coord + dy).r;
  info.g += uK * (sum - 4.0 * info.r);
  info.g *= uDamp;
  info.r += info.g;
  if (uEdge > 0.0) {
    // borde que absorbe: las olas se apagan al salir del parche en vez de rebotar
    vec2 e = min(coord, 1.0 - coord);
    info.rg *= mix(0.86, 1.0, smoothstep(0.0, uEdge, min(e.x, e.y)));
  }
  gl_FragColor = info;
}`;

// normales en BA (WaterNormal.frag), con el espaciado físico de la rejilla
const NORMAL_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tInput;
uniform vec2 delta;
uniform float uSpacing;
varying vec2 coord;
void main() {
  vec4 info = texture2D(tInput, coord);
  vec3 dx = vec3(uSpacing, texture2D(tInput, vec2(coord.x + delta.x, coord.y)).r - info.r, 0.0);
  vec3 dy = vec3(0.0, texture2D(tInput, vec2(coord.x, coord.y + delta.y)).r - info.r, uSpacing);
  info.ba = normalize(cross(dy, dx)).xz;
  gl_FragColor = info;
}`;

// desplaza el parche de estelas cuando el jugador avanza
const SCROLL_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tInput;
uniform vec2 uOff;
varying vec2 coord;
void main() {
  vec2 c = coord + uOff;
  vec4 info = texture2D(tInput, c);
  if (c.x < 0.0 || c.y < 0.0 || c.x > 1.0 || c.y > 1.0) info = vec4(0.0);
  gl_FragColor = info;
}`;

// ── cáusticas (Caustics.vert/.frag) sobre el azulejo, en "unidades de piscina":
// el azulejo mide 2 de ancho y el fondo está a 1 de profundidad ──────────────
const CAUSTIC_VERT = /* glsl */ `
uniform sampler2D uRip;
uniform vec3 uLight;
varying vec3 oldPos;
varying vec3 newPos;
void main() {
  vec2 uv = position.xy;
  vec4 info = texture2D(uRip, uv);
  info.ba *= 0.5;
  vec2 slope = clamp(info.ba, vec2(-0.999), vec2(0.999));
  float sl = min(dot(slope, slope), 0.999);
  vec3 normal = normalize(vec3(slope.x, sqrt(max(0.001, 1.0 - sl)), slope.y));
  vec3 rl = refract(-uLight, vec3(0.0, 1.0, 0.0), 1.0 / 1.333);
  vec3 ray = refract(-uLight, normal, 1.0 / 1.333);
  vec3 p0 = vec3(uv.x * 2.0 - 1.0, 0.0, uv.y * 2.0 - 1.0);
  oldPos = p0 + rl * ((-1.0 - p0.y) / rl.y);
  vec3 p1 = p0 + vec3(0.0, info.r, 0.0);
  newPos = p1 + ray * ((-1.0 - p1.y) / ray.y);
  // quitamos el desplazamiento constante de la luz para que el azulejo siga encajando
  vec2 q = newPos.xz + rl.xz / rl.y;
  gl_Position = vec4(q, 0.0, 1.0);
}`;

const CAUSTIC_FRAG = /* glsl */ `
precision highp float;
varying vec3 oldPos;
varying vec3 newPos;
void main() {
  float oldArea = length(dFdx(oldPos)) * length(dFdy(oldPos));
  float newArea = length(dFdx(newPos)) * length(dFdy(newPos));
  gl_FragColor = vec4(oldArea / max(newArea, 1e-7) * 0.2, 0.0, 0.0, 1.0);
}`;

// ── superficie del agua ──────────────────────────────────────────────────────
const SURFACE_VERT = /* glsl */ `
uniform float uTime;
uniform sampler2D uWake;
uniform vec3 uWakeRect; // x0, z0, tamaño (m)
varying vec3 vW;
varying float vWakeH;

float waveH(vec2 p, float t) {
  return 0.3 * sin(0.33 * p.x + 1.3 * t) * cos(0.29 * p.y + 1.05 * t) + 0.12 * sin(0.75 * (p.x + p.y) + 2.1 * t);
}

void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vec2 wuv = (w.xz - uWakeRect.xy) / uWakeRect.z;
  float inside = step(0.0, wuv.x) * step(0.0, wuv.y) * step(wuv.x, 1.0) * step(wuv.y, 1.0);
  float wh = texture2D(uWake, clamp(wuv, 0.0, 1.0)).r * inside;
  float amp = 1.0 - smoothstep(180.0, 320.0, length(w.xz - cameraPosition.xz));
  w.y += (waveH(w.xz, uTime) + wh) * amp;
  vW = w.xyz;
  vWakeH = wh;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const SURFACE_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec3 uLight;
uniform sampler2D uRip;
uniform sampler2D uCaus;
uniform sampler2D uWake;
uniform sampler2D uMask;
uniform vec3 uWakeRect;
uniform vec4 uMaskRect;   // minX, minZ, 1/anchoX, 1/anchoZ
uniform float uMaskRange; // metros que codifica el 1.0 de la máscara
uniform float uTrackHalf;
uniform float uTile;      // metros que mide el azulejo de rizos
uniform vec3 uPaper;
varying vec3 vW;
varying float vWakeH;

const float IOR_AIR = 1.0;
const float IOR_WATER = 1.333;

vec2 waveGrad(vec2 p, float t) {
  float a = 0.33 * p.x + 1.3 * t, b = 0.29 * p.y + 1.05 * t, c = 0.75 * (p.x + p.y) + 2.1 * t;
  float gc = 0.09 * cos(c);
  return vec2(0.099 * cos(a) * cos(b) + gc, -0.087 * sin(a) * sin(b) + gc);
}
float hash(vec2 p) { p = fract(p * vec2(233.34, 851.73)); p += dot(p, p + 23.45); return fract(p.x * p.y); }

// cielo de la libreta: horizonte color papel, cénit azul y el sol del repo
vec3 skyColor(vec3 r) {
  float up = clamp(r.y, 0.0, 1.0);
  vec3 col = mix(uPaper * 1.02, vec3(0.36, 0.62, 0.92), pow(up, 0.55));
  float s = max(0.0, dot(uLight, r));
  col += pow(s, 5000.0) * vec3(10.0, 8.0, 6.0);
  col += pow(s, 160.0) * vec3(0.9, 0.8, 0.55) * 0.5;
  return col;
}

void main() {
  vec3 I = vW - cameraPosition;
  float dist = length(I);
  I /= dist;

  // ¿estamos dentro del canal de carrera?
  vec2 muv = (vW.xz - uMaskRect.xy) * uMaskRect.zw;
  float md = texture2D(uMask, muv).r * uMaskRange;
  float chan = 1.0 - smoothstep(uTrackHalf - 1.5, uTrackHalf + 2.5, md);
  float depth = mix(7.5, 1.7, chan);

  // normal = olas largas (las mismas que mueven las motos) + rizos simulados + estelas
  vec2 g = waveGrad(vW.xz, uTime);
  float nearF = 1.0 - smoothstep(25.0, 170.0, dist);
  vec2 r1 = texture2D(uRip, vW.xz / uTile).ba;
  vec2 r2 = texture2D(uRip, mat2(0.8, -0.6, 0.6, 0.8) * vW.xz / (uTile * 2.7) + 0.37).ba;
  vec2 rip = (r1 + r2 * 0.6) * mix(0.2, 1.0, nearF);
  vec2 wuv = (vW.xz - uWakeRect.xy) / uWakeRect.z;
  float inW = step(0.0, wuv.x) * step(0.0, wuv.y) * step(wuv.x, 1.0) * step(wuv.y, 1.0);
  vec4 wk = texture2D(uWake, clamp(wuv, 0.0, 1.0));
  vec2 wn = wk.ba * inW * 1.6;
  vec3 normal = normalize(vec3(-g.x + rip.x + wn.x, 1.0, -g.y + rip.y + wn.y));
  // a lo lejos la superficie se calma (sin parpadeos ni aliasing)
  normal = normalize(mix(normal, vec3(0.0, 1.0, 0.0), smoothstep(90.0, 500.0, dist) * 0.75));

  // reflexión y refracción (Snell) + Fresnel de Schlick con los parámetros del repo
  vec3 reflectedRay = reflect(I, normal);
  reflectedRay.y = abs(reflectedRay.y);
  vec3 refractedRay = refract(I, normal, IOR_AIR / IOR_WATER);
  float fresnel = mix(0.25, 1.0, pow(1.0 - clamp(dot(normal, -I), 0.0, 1.0), 3.0));
  vec3 reflectedColor = skyColor(reflectedRay);

  // el rayo refractado viaja hasta el fondo del embalse
  float t = (-depth - vW.y) / min(refractedRay.y, -0.05);
  vec3 fp = vW + refractedRay * t;
  vec3 rl = refract(-uLight, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
  vec2 cuv = (fp.xz - fp.y * rl.xz / rl.y) / uTile;
  float caustic = texture2D(uCaus, cuv).r + texture2D(uCaus, cuv * 0.61 + 0.23).r * 0.5;

  // fondo: azulejos de piscina en el canal, arena y roca en el resto del pantano
  vec2 tp = fp.xz / 1.25;
  vec2 tf = abs(fract(tp) - 0.5);
  float grout = smoothstep(0.455, 0.485, max(tf.x, tf.y));
  vec3 tiles = mix(vec3(0.86, 0.95, 0.97), vec3(0.66, 0.88, 0.93), hash(floor(tp))) * (1.0 - grout * 0.4);
  vec3 sand = mix(vec3(0.56, 0.5, 0.37), vec3(0.4, 0.38, 0.31), hash(floor(fp.xz * 0.6)));
  vec3 floorCol = mix(sand, tiles, chan);
  floorCol *= 0.38 + caustic * 2.6 * max(0.0, -rl.y);

  // absorción (Beer-Lambert): cuanto más camino bajo el agua, más azul
  vec3 trans = exp(-t * vec3(0.36, 0.1, 0.07));
  vec3 deep = mix(vec3(0.02, 0.15, 0.25), vec3(0.05, 0.4, 0.5), chan);
  vec3 refractedColor = (floorCol * trans + deep * (1.0 - trans)) * vec3(0.82, 1.0, 1.08);

  vec3 col = mix(refractedColor, reflectedColor, fresnel);

  // espuma donde las estelas levantan el agua
  float foam = smoothstep(0.045, 0.2, abs(vWakeH)) * inW;
  foam *= 0.55 + 0.45 * smoothstep(-0.15, 0.25, r1.x + r1.y + hash(floor(vW.xz * 3.0)) * 0.3);
  col = mix(col, vec3(0.97, 0.98, 1.0), clamp(foam, 0.0, 0.92));

  // a lo lejos el agua se funde con el papel de la libreta
  col = mix(col, uPaper, smoothstep(220.0, 1100.0, dist) * 0.8);
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col.r, ${WATER_INK.toFixed(1)}, col.g, col.b);
}`;

// ── simulación ping-pong genérica ────────────────────────────────────────────
function createSim(renderer, size, wrap) {
  const opts = {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: wrap,
    wrapT: wrap,
    depthBuffer: false,
    stencilBuffer: false
  };
  let a = new THREE.WebGLRenderTarget(size, size, opts);
  let b = new THREE.WebGLRenderTarget(size, size, opts);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  quad.frustumCulled = false;
  scene.add(quad);
  const delta = new THREE.Vector2(1 / size, 1 / size);
  const make = (frag, uniforms) =>
    new THREE.ShaderMaterial({ vertexShader: QUAD_VERT, fragmentShader: frag, depthTest: false, depthWrite: false, uniforms: { tInput: { value: null }, ...uniforms } });
  const mats = {
    drop: make(DROP_FRAG, { uDrops: { value: Array.from({ length: 16 }, () => new THREE.Vector4()) }, uCount: { value: 0 }, uWrap: { value: wrap === THREE.RepeatWrapping ? 1 : 0 } }),
    update: make(UPDATE_FRAG, { delta: { value: delta }, uK: { value: 0.5 }, uDamp: { value: 0.995 }, uEdge: { value: 0 } }),
    normal: make(NORMAL_FRAG, { delta: { value: delta }, uSpacing: { value: 2 / size } }),
    scroll: make(SCROLL_FRAG, { uOff: { value: new THREE.Vector2() } })
  };
  function pass(m) {
    m.uniforms.tInput.value = a.texture;
    quad.material = m;
    renderer.setRenderTarget(b);
    renderer.render(scene, cam);
    const tmp = a; a = b; b = tmp;
  }
  function clear() {
    for (const rt of [a, b]) { renderer.setRenderTarget(rt); renderer.clear(true, false, false); }
  }
  // drops: [{u, v, r, s}] en coordenadas uv
  function drops(list) {
    for (let k = 0; k < list.length; k += 16) {
      const n = Math.min(16, list.length - k);
      for (let i = 0; i < n; i++) { const d = list[k + i]; mats.drop.uniforms.uDrops.value[i].set(d.u, d.v, d.r, d.s); }
      mats.drop.uniforms.uCount.value = n;
      pass(mats.drop);
    }
  }
  return {
    mats, pass, clear, drops,
    get texture() { return a.texture; },
    dispose() { a.dispose(); b.dispose(); quad.geometry.dispose(); Object.values(mats).forEach((m) => m.dispose()); }
  };
}

// disco radial: denso junto a la cámara y cada vez más ancho hasta el horizonte
function radialGrid(rings, segs, radius) {
  const pos = [0, 0, 0];
  for (let i = 1; i <= rings; i++) {
    const r = radius * Math.pow(i / rings, 2.4);
    for (let j = 0; j < segs; j++) {
      const a = (j / segs) * Math.PI * 2;
      pos.push(Math.cos(a) * r, 0, Math.sin(a) * r);
    }
  }
  const idx = [];
  for (let j = 0; j < segs; j++) idx.push(0, 1 + ((j + 1) % segs), 1 + j);
  for (let i = 1; i < rings; i++) {
    const a0 = 1 + (i - 1) * segs, a1 = 1 + i * segs;
    for (let j = 0; j < segs; j++) {
      const j1 = (j + 1) % segs;
      idx.push(a0 + j, a0 + j1, a1 + j, a0 + j1, a1 + j1, a1 + j);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  return geo;
}

// máscara del canal: distancia al trazado (rasterizada sellando discos en cada muestra)
function buildTrackMask(track, half) {
  const range = half + 9;
  const margin = range + 20;
  const { minX, maxX, minZ, maxZ } = track.bounds;
  const x0 = minX - margin, z0 = minZ - margin, w = maxX - minX + margin * 2, h = maxZ - minZ + margin * 2;
  const N = 512;
  const sx = w / N, sz = h / N;
  const dist = new Float32Array(N * N).fill(range);
  for (const p of track.pts) {
    const ci = (p.x - x0) / sx, cj = (p.z - z0) / sz;
    const ri = Math.ceil(range / sx), rj = Math.ceil(range / sz);
    for (let j = Math.max(0, Math.floor(cj - rj)); j <= Math.min(N - 1, Math.ceil(cj + rj)); j++) {
      const wz = z0 + (j + 0.5) * sz;
      for (let i = Math.max(0, Math.floor(ci - ri)); i <= Math.min(N - 1, Math.ceil(ci + ri)); i++) {
        const wx = x0 + (i + 0.5) * sx;
        const d = Math.hypot(wx - p.x, wz - p.z);
        const k = j * N + i;
        if (d < dist[k]) dist[k] = d;
      }
    }
  }
  const data = new Uint8Array(N * N * 4);
  for (let k = 0; k < N * N; k++) {
    const v = Math.round(Math.min(1, dist[k] / range) * 255);
    data[k * 4] = v; data[k * 4 + 1] = v; data[k * 4 + 2] = v; data[k * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, N, N, THREE.RGBAFormat);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return { tex, rect: new THREE.Vector4(x0, z0, 1 / w, 1 / h), range };
}

/**
 * Crea el agua del pantano.
 * @param {THREE.WebGLRenderer} renderer
 * @param {object} track    trazado de buildTrack()
 * @param {number} trackHalf media anchura del canal
 */
export function createRaceWater(renderer, track, trackHalf) {
  const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3;
  const group = new THREE.Group();

  // 1 · azulejo de rizos (se repite por todo el pantano)
  const RIP_SIZE = lowEnd ? 96 : 128;
  const RIP_TILE = 7; // metros
  const rip = createSim(renderer, RIP_SIZE, THREE.RepeatWrapping);
  rip.mats.update.uniforms.uK.value = 0.5;
  rip.mats.update.uniforms.uDamp.value = 0.995;
  rip.mats.normal.uniforms.uSpacing.value = 2 / RIP_SIZE;

  // 2 · cáusticas del azulejo
  const causRT = new THREE.WebGLRenderTarget(256, 256, {
    type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
    wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, depthBuffer: false, stencilBuffer: false
  });
  const causGeo = new THREE.PlaneGeometry(1.5, 1.5, RIP_SIZE + 32, RIP_SIZE + 32);
  causGeo.translate(0.5, 0.5, 0); // uv de -0.25 a 1.25: lo que se sale por un borde entra por el otro
  const causMat = new THREE.ShaderMaterial({
    vertexShader: CAUSTIC_VERT, fragmentShader: CAUSTIC_FRAG,
    uniforms: { uRip: { value: null }, uLight: { value: LIGHT } },
    depthTest: false, depthWrite: false, transparent: true,
    extensions: { derivatives: true },
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation
  });
  const causScene = new THREE.Scene();
  const causMesh = new THREE.Mesh(causGeo, causMat);
  causMesh.frustumCulled = false;
  causScene.add(causMesh);
  const causCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  // 3 · parche de estelas que sigue al jugador
  const WAKE_SIZE = lowEnd ? 192 : 256;
  const WAKE_EXT = lowEnd ? 104 : 128; // metros
  const texel = WAKE_EXT / WAKE_SIZE;
  const wake = createSim(renderer, WAKE_SIZE, THREE.ClampToEdgeWrapping);
  // velocidad de onda ≈ 30·√k·texel m/s: más lenta que las motos para que salga la estela en V
  wake.mats.update.uniforms.uK.value = 0.1;
  wake.mats.update.uniforms.uDamp.value = 0.993;
  wake.mats.update.uniforms.uEdge.value = 0.08;
  wake.mats.normal.uniforms.uSpacing.value = texel;
  const wakeRect = new THREE.Vector3(-WAKE_EXT / 2, -WAKE_EXT / 2, WAKE_EXT);
  let wakeI = null, wakeJ = null;

  // 4 · superficie
  const mask = buildTrackMask(track, trackHalf);
  const surfMat = new THREE.ShaderMaterial({
    vertexShader: SURFACE_VERT,
    fragmentShader: SURFACE_FRAG,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uLight: { value: LIGHT },
      uRip: { value: null },
      uCaus: { value: causRT.texture },
      uWake: { value: null },
      uMask: { value: mask.tex },
      uWakeRect: { value: wakeRect },
      uMaskRect: { value: mask.rect },
      uMaskRange: { value: mask.range },
      uTrackHalf: { value: trackHalf },
      uTile: { value: RIP_TILE },
      uPaper: { value: new THREE.Vector3(0.965, 0.952, 0.9) }
    }
  });
  const surfGeo = radialGrid(lowEnd ? 90 : 120, lowEnd ? 128 : 192, 3200);
  const surface = new THREE.Mesh(surfGeo, surfMat);
  surface.frustumCulled = false;
  group.add(surface);

  // estado
  const pending = [];
  let acc = 0;
  let seeded = false;
  const R = Math.random;

  // gota en el mundo: radio (m) y fuerza (m de altura, negativa = hunde el agua)
  function disturb(x, z, radius, strength) {
    if (pending.length < 64) pending.push({ x, z, radius, strength });
  }

  const saveColor = new THREE.Color();
  function update(t, dt, camX, camZ, focusX, focusZ) {
    surfMat.uniforms.uTime.value = t;
    surface.position.set(Math.round(camX), 0, Math.round(camZ));

    const prevTarget = renderer.getRenderTarget();
    const prevAlpha = renderer.getClearAlpha();
    renderer.getClearColor(saveColor);
    renderer.setClearColor(0x000000, 0);

    if (!seeded) {
      seeded = true;
      rip.clear();
      wake.clear();
      // como en el repo: arranca con un puñado de gotas
      const list = [];
      for (let i = 0; i < 20; i++) list.push({ u: R(), v: R(), r: 0.03, s: i & 1 ? 0.01 : -0.01 });
      rip.drops(list);
    }

    // el parche sigue al foco (por delante del jugador), desplazado a saltos de texel
    const ci = Math.round(focusX / texel), cj = Math.round(focusZ / texel);
    if (wakeI === null || Math.abs(ci - wakeI) > WAKE_SIZE / 2 || Math.abs(cj - wakeJ) > WAKE_SIZE / 2) {
      wake.clear();
    } else if (ci !== wakeI || cj !== wakeJ) {
      wake.mats.scroll.uniforms.uOff.value.set((ci - wakeI) / WAKE_SIZE, (cj - wakeJ) / WAKE_SIZE);
      wake.pass(wake.mats.scroll);
    }
    wakeI = ci; wakeJ = cj;
    wakeRect.set(ci * texel - WAKE_EXT / 2, cj * texel - WAKE_EXT / 2, WAKE_EXT);

    const steps = dt > 0 ? Math.min(3, Math.floor((acc += dt) * SIM_HZ)) : 0;
    acc -= steps / SIM_HZ;

    if (steps > 0) {
      // lluvia de gotitas aleatorias en el azulejo: el agua nunca está quieta
      const list = [];
      for (let i = 0; i < 2; i++) list.push({ u: R(), v: R(), r: 0.02 + R() * 0.015, s: (R() < 0.5 ? -1 : 1) * (0.004 + R() * 0.005) });
      rip.drops(list);
      // estelas: convertimos las gotas del mundo a uv del parche
      if (pending.length) {
        const wl = [];
        for (const d of pending) {
          const u = (d.x - wakeRect.x) / WAKE_EXT, v = (d.z - wakeRect.y) / WAKE_EXT;
          if (u < -0.05 || v < -0.05 || u > 1.05 || v > 1.05) continue;
          wl.push({ u, v, r: d.radius / WAKE_EXT, s: d.strength * steps });
        }
        if (wl.length) wake.drops(wl);
      }
      for (let s = 0; s < steps; s++) {
        rip.pass(rip.mats.update);
        wake.pass(wake.mats.update);
      }
      rip.pass(rip.mats.normal);
      wake.pass(wake.mats.normal);

      // cáusticas a partir de los rizos recién simulados
      causMat.uniforms.uRip.value = rip.texture;
      renderer.setRenderTarget(causRT);
      renderer.clear(true, false, false);
      renderer.render(causScene, causCam);
      pending.length = 0;
    }

    surfMat.uniforms.uRip.value = rip.texture;
    surfMat.uniforms.uWake.value = wake.texture;

    renderer.setClearColor(saveColor, prevAlpha);
    renderer.setRenderTarget(prevTarget);
  }

  function dispose() {
    rip.dispose();
    wake.dispose();
    causRT.dispose();
    causGeo.dispose();
    causMat.dispose();
    surfGeo.dispose();
    surfMat.dispose();
    mask.tex.dispose();
  }

  return { group, update, disturb, dispose };
}
