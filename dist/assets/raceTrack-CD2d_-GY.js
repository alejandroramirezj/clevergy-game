import{G as K,W as eo,R as jt,L as Rt,H as vo,d as yo,f as so,A as Lo,g as po,h as ko,S as go,M as w,i as wo,V as it,D as Bo,j as Io,k as Mo,l as fo,n as zo,o as To,p as Go,q as bo,F as Po,r as No,s as et,m,I as s,t as So,u as Oo,v as Fo,E as Wo,Q as Uo}from"./doodleRender-Z2Gf63ZX.js";import{G as c}from"./doodleLevel-Cz2qwljQ.js";import{i as st}from"./inkText-P6wmSIvE.js";import{c as Ko}from"./doodleSticker-CRt2ECfu.js";import{s as _o}from"./index-t8OHPUxM.js";const jo=7,ho=new it(.42,.84,.34).normalize(),xo=60,qo=`
varying vec2 coord;
void main() {
  coord = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Zo=`
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
}`,Xo=`
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
}`,Ho=`
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
}`,Vo=`
precision highp float;
uniform sampler2D tInput;
uniform vec2 uOff;
varying vec2 coord;
void main() {
  vec2 c = coord + uOff;
  vec4 info = texture2D(tInput, c);
  if (c.x < 0.0 || c.y < 0.0 || c.x > 1.0 || c.y > 1.0) info = vec4(0.0);
  gl_FragColor = info;
}`,Yo=`
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
}`,Qo=`
precision highp float;
varying vec3 oldPos;
varying vec3 newPos;
void main() {
  float oldArea = length(dFdx(oldPos)) * length(dFdy(oldPos));
  float newArea = length(dFdx(newPos)) * length(dFdy(newPos));
  gl_FragColor = vec4(oldArea / max(newArea, 1e-7) * 0.2, 0.0, 0.0, 1.0);
}`,Jo=`
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
}`,$o=`
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
  gl_FragColor = vec4(col.r, ${((jo+.5)/10).toFixed(4)}, col.g, col.b);
}`;function mo(z,d,C){const N={type:vo,format:Mo,minFilter:Rt,magFilter:Rt,wrapS:C,wrapT:C,depthBuffer:!1,stencilBuffer:!1};let g=new eo(d,d,N),L=new eo(d,d,N);const p=new go,v=new wo(-1,1,1,-1,0,1),M=new w(new yo(2,2));M.frustumCulled=!1,p.add(M);const R=new fo(1/d,1/d),D=(h,y)=>new so({vertexShader:qo,fragmentShader:h,depthTest:!1,depthWrite:!1,uniforms:{tInput:{value:null},...y}}),B={drop:D(Zo,{uDrops:{value:Array.from({length:16},()=>new zo)},uCount:{value:0},uWrap:{value:C===jt?1:0}}),update:D(Xo,{delta:{value:R},uK:{value:.5},uDamp:{value:.995},uEdge:{value:0}}),normal:D(Ho,{delta:{value:R},uSpacing:{value:2/d}}),scroll:D(Vo,{uOff:{value:new fo}})};function k(h){h.uniforms.tInput.value=g.texture,M.material=h,z.setRenderTarget(L),z.render(p,v);const y=g;g=L,L=y}function Y(){for(const h of[g,L])z.setRenderTarget(h),z.clear(!0,!1,!1)}function u(h){for(let y=0;y<h.length;y+=16){const b=Math.min(16,h.length-y);for(let A=0;A<b;A++){const I=h[y+A];B.drop.uniforms.uDrops.value[A].set(I.u,I.v,I.r,I.s)}B.drop.uniforms.uCount.value=b,k(B.drop)}}return{mats:B,pass:k,clear:Y,drops:u,get texture(){return g.texture},dispose(){g.dispose(),L.dispose(),M.geometry.dispose(),Object.values(B).forEach(h=>h.dispose())}}}function te(z,d,C){const N=[0,0,0];for(let p=1;p<=z;p++){const v=C*Math.pow(p/z,2.4);for(let M=0;M<d;M++){const R=M/d*Math.PI*2;N.push(Math.cos(R)*v,0,Math.sin(R)*v)}}const g=[];for(let p=0;p<d;p++)g.push(0,1+(p+1)%d,1+p);for(let p=1;p<z;p++){const v=1+(p-1)*d,M=1+p*d;for(let R=0;R<d;R++){const D=(R+1)%d;g.push(v+R,v+D,M+R,v+D,M+D,M+R)}}const L=new bo;return L.setAttribute("position",new Po(N,3)),L.setIndex(g),L}function oe(z,d){const C=d+9,N=C+20,{minX:g,maxX:L,minZ:p,maxZ:v}=z.bounds,M=g-N,R=p-N,D=L-g+N*2,B=v-p+N*2,k=512,Y=D/k,u=B/k,h=new Float32Array(k*k).fill(C);for(const A of z.pts){const I=(A.x-M)/Y,_=(A.z-R)/u,H=Math.ceil(C/Y),U=Math.ceil(C/u);for(let V=Math.max(0,Math.floor(_-U));V<=Math.min(k-1,Math.ceil(_+U));V++){const q=R+(V+.5)*u;for(let P=Math.max(0,Math.floor(I-H));P<=Math.min(k-1,Math.ceil(I+H));P++){const J=M+(P+.5)*Y,$=Math.hypot(J-A.x,q-A.z),Q=V*k+P;$<h[Q]&&(h[Q]=$)}}}const y=new Uint8Array(k*k*4);for(let A=0;A<k*k;A++){const I=Math.round(Math.min(1,h[A]/C)*255);y[A*4]=I,y[A*4+1]=I,y[A*4+2]=I,y[A*4+3]=255}const b=new Go(y,k,k,Mo);return b.minFilter=Rt,b.magFilter=Rt,b.needsUpdate=!0,{tex:b,rect:new zo(M,R,1/D,1/B),range:C}}function ee(z,d,C){const N=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=3,g=new K,L=N?96:128,p=7,v=mo(z,L,jt);v.mats.update.uniforms.uK.value=.5,v.mats.update.uniforms.uDamp.value=.995,v.mats.normal.uniforms.uSpacing.value=2/L;const M=new eo(256,256,{type:vo,minFilter:Rt,magFilter:Rt,wrapS:jt,wrapT:jt,depthBuffer:!1,stencilBuffer:!1}),R=new yo(1.5,1.5,L+32,L+32);R.translate(.5,.5,0);const D=new so({vertexShader:Yo,fragmentShader:Qo,uniforms:{uRip:{value:null},uLight:{value:ho}},depthTest:!1,depthWrite:!1,transparent:!0,extensions:{derivatives:!0},blending:ko,blendSrc:po,blendDst:po,blendEquation:Lo}),B=new go,k=new w(R,D);k.frustumCulled=!1,B.add(k);const Y=new wo(-1,1,1,-1,0,1),u=N?192:256,h=N?104:128,y=h/u,b=mo(z,u,To);b.mats.update.uniforms.uK.value=.1,b.mats.update.uniforms.uDamp.value=.993,b.mats.update.uniforms.uEdge.value=.08,b.mats.normal.uniforms.uSpacing.value=y;const A=new it(-h/2,-h/2,h);let I=null,_=null;const H=oe(d,C),U=new so({vertexShader:Jo,fragmentShader:$o,side:Bo,uniforms:{uTime:{value:0},uLight:{value:ho},uRip:{value:null},uCaus:{value:M.texture},uWake:{value:null},uMask:{value:H.tex},uWakeRect:{value:A},uMaskRect:{value:H.rect},uMaskRange:{value:H.range},uTrackHalf:{value:C},uTile:{value:p},uPaper:{value:new it(.965,.952,.9)}}}),V=te(N?90:120,N?128:192,3200),q=new w(V,U);q.frustumCulled=!1,g.add(q);const P=[];let J=0,$=!1;const Q=Math.random;function gt(ht,ct,Ct,Dt){P.length<64&&P.push({x:ht,z:ct,radius:Ct,strength:Dt})}const wt=new Io;function At(ht,ct,Ct,Dt,Wt,xt){U.uniforms.uTime.value=ht,q.position.set(Math.round(Ct),0,Math.round(Dt));const Z=z.getRenderTarget(),Lt=z.getClearAlpha();if(z.getClearColor(wt),z.setClearColor(0,0),!$){$=!0,v.clear(),b.clear();const ot=[];for(let j=0;j<20;j++)ot.push({u:Q(),v:Q(),r:.03,s:j&1?.01:-.01});v.drops(ot)}const tt=Math.round(Wt/y),nt=Math.round(xt/y);I===null||Math.abs(tt-I)>u/2||Math.abs(nt-_)>u/2?b.clear():(tt!==I||nt!==_)&&(b.mats.scroll.uniforms.uOff.value.set((tt-I)/u,(nt-_)/u),b.pass(b.mats.scroll)),I=tt,_=nt,A.set(tt*y-h/2,nt*y-h/2,h);const rt=ct>0?Math.min(3,Math.floor((J+=ct)*xo)):0;if(J-=rt/xo,rt>0){const ot=[];for(let j=0;j<2;j++)ot.push({u:Q(),v:Q(),r:.02+Q()*.015,s:(Q()<.5?-1:1)*(.004+Q()*.005)});if(v.drops(ot),P.length){const j=[];for(const lt of P){const mt=(lt.x-A.x)/h,vt=(lt.z-A.y)/h;mt<-.05||vt<-.05||mt>1.05||vt>1.05||j.push({u:mt,v:vt,r:lt.radius/h,s:lt.strength*rt})}j.length&&b.drops(j)}for(let j=0;j<rt;j++)v.pass(v.mats.update),b.pass(b.mats.update);v.pass(v.mats.normal),b.pass(b.mats.normal),D.uniforms.uRip.value=v.texture,z.setRenderTarget(M),z.clear(!0,!1,!1),z.render(B,Y),P.length=0}U.uniforms.uRip.value=v.texture,U.uniforms.uWake.value=b.texture,z.setClearColor(wt,Lt),z.setRenderTarget(Z)}function Mt(){v.dispose(),b.dispose(),M.dispose(),R.dispose(),D.dispose(),V.dispose(),U.dispose(),H.tex.dispose()}return{group:g,update:At,disturb:gt,dispose:Mt}}const S=13,W=900,Ft=[[0,0],[110,-18],[205,-80],[238,-185],[178,-282],[62,-300],[-32,-250],[-52,-160],[-138,-118],[-232,-160],[-300,-92],[-268,30],[-158,74],[-62,44]];function se(z){let d=z>>>0;return()=>(d=d*1664525+1013904223>>>0,d/4294967296)}function yt(z,d,C){return .3*Math.sin(.33*z+1.3*C)*Math.cos(.29*d+1.05*C)+.12*Math.sin(.75*(z+d)+2.1*C)}function le(){const z=[],d=Ft.length;for(let u=0;u<d;u++){const h=Ft[(u-1+d)%d],y=Ft[u],b=Ft[(u+1)%d],A=Ft[(u+2)%d];for(let I=0;I<40;I++){const _=I/40,H=_*_,U=H*_,V=(q,P,J,$)=>.5*(2*P+(-q+J)*_+(2*q-5*P+4*J-$)*H+(-q+3*P-3*J+$)*U);z.push([V(h[0],y[0],b[0],A[0]),V(h[1],y[1],b[1],A[1])])}}const C=[0];for(let u=1;u<=z.length;u++){const h=z[u-1],y=z[u%z.length];C.push(C[u-1]+Math.hypot(y[0]-h[0],y[1]-h[1]))}const N=C[C.length-1],g=[];let L=0;for(let u=0;u<W;u++){const h=u/W*N;for(;C[L+1]<h;)L++;const y=z[L],b=z[(L+1)%z.length],A=(h-C[L])/(C[L+1]-C[L]||1);g.push({x:y[0]+(b[0]-y[0])*A,z:y[1]+(b[1]-y[1])*A,tx:0,tz:0})}for(let u=0;u<W;u++){const h=g[(u-1+W)%W],y=g[(u+1)%W],b=Math.hypot(y.x-h.x,y.z-h.z)||1;g[u].tx=(y.x-h.x)/b,g[u].tz=(y.z-h.z)/b}const p=u=>g[(u%W+W)%W];function v(u,h,y=-1,b=70){let A=0,I=1/0;const _=y<0?0:y-b,H=y<0?W:y+b;for(let q=_;q<H;q++){const P=p(q),J=(P.x-u)**2+(P.z-h)**2;J<I&&(I=J,A=(q%W+W)%W)}const U=g[A],V=(u-U.x)*-U.tz+(h-U.z)*U.tx;return{i:A,lat:V,d:Math.sqrt(I)}}let M=0,R=0,D=1/0,B=-1/0,k=1/0,Y=-1/0;for(const u of g)M+=u.x,R+=u.z,D=Math.min(D,u.x),B=Math.max(B,u.x),k=Math.min(k,u.z),Y=Math.max(Y,u.z);return M/=W,R/=W,{pts:g,at:p,nearest:v,length:N,center:{x:M,z:R},bounds:{minX:D,maxX:B,minZ:k,maxZ:Y}}}function ue(z,d,C=null,N=null){const g=new K;z.add(g);const L=se(20260928),p=(t,n)=>t+L()*(n-t),v=new No,M=new Uo,R=new it,D=new it,B=new Wo;function k(t,n,e,i){const a=new et(t,m(n,e),i.length);return i.forEach((l,o)=>{B.set(l.rx||0,l.ry||0,l.rz||0),M.setFromEuler(B),v.compose(D.set(l.x,l.y,l.z),M,R.set(l.sx,l.sy,l.sz)),a.setMatrixAt(o,v)}),a.instanceMatrix.needsUpdate=!0,a.frustumCulled=!1,g.add(a),a}const Y=(t,n)=>d.nearest(t,n).d,{center:u}=d,h=N?ee(N,d,S):null;h&&g.add(h.group);const y=[],b=3;for(let t=0;t<W;t+=b){const n=d.at(t),e=Math.atan2(n.tx,n.tz);y.push({x:n.x+n.tz*S,z:n.z-n.tx*S,yaw:e,side:-1,color:t/b%2===0?"orange":"black"}),y.push({x:n.x-n.tz*S,z:n.z+n.tx*S,yaw:e,side:1,color:t/b%2===0?"red":"black"})}const A=y.filter(t=>t.color==="orange"),I=y.filter(t=>t.color==="red"),_=y.filter(t=>t.color==="black"),H=new et(c.cyl,m(s.ORANGE,{fill:!0}),A.length),U=new et(c.cyl,m(s.RED,{fill:!0}),I.length),V=new et(c.cyl,m(s.BLACK,{fill:!0}),_.length);[H,U,V].forEach(t=>{t.frustumCulled=!1,g.add(t)});function q(t){const n=(e,i)=>{i.forEach((a,l)=>{const o=yt(a.x,a.z,t)+.18;B.set(0,a.yaw+Math.PI/2,0),M.setFromEuler(B),v.compose(D.set(a.x,o,a.z),M,R.set(.42,1.25,.42)),e.setMatrixAt(l,v)}),e.instanceMatrix.needsUpdate=!0};n(H,A),n(U,I),n(V,_)}const P=[],J=24;for(let t=0;t<W;t+=J){const n=d.at(t);P.push({x:n.x+n.tz*(S+.8),z:n.z-n.tx*(S+.8),ph:L()*6,side:"left"}),P.push({x:n.x-n.tz*(S+.8),z:n.z+n.tx*(S+.8),ph:L()*6,side:"right"})}const $=P.filter(t=>t.side==="left"),Q=P.filter(t=>t.side==="right"),gt=new et(c.cyl,m(s.BLACK,{tone:.1}),P.length),wt=new et(c.cone,m(s.RED,{fill:!0}),Q.length),At=new et(c.cone,m(s.BLUE,{fill:!0}),$.length),Mt=new et(c.cyl,m(s.BLACK,{fill:!0}),P.length),ht=new et(c.cone,m(s.RED,{tone:.2}),Q.length),ct=new et(c.cone,m(s.ORANGE,{tone:.2}),$.length);[gt,wt,At,Mt,ht,ct].forEach(t=>{t.frustumCulled=!1,g.add(t)});function Ct(t){let n=0;$.forEach((e,i)=>{const a=yt(e.x,e.z,t)+.35,l=Math.sin(t*1.6+e.ph)*.14,o=Math.cos(t*1.4+e.ph)*.14;B.set(l,0,o),M.setFromEuler(B),v.compose(D.set(e.x,a,e.z),M,R.set(2.4,.7,2.4)),gt.setMatrixAt(n,v),v.compose(D.set(e.x,a+2,e.z),M,R.set(.18,3.4,.18)),Mt.setMatrixAt(n,v),n++,v.compose(D.set(e.x,a+1.1,e.z),M,R.set(1.6,1.8,1.6)),At.setMatrixAt(i,v),B.set(l,Math.sin(t*2+e.ph)*.2+Math.PI/2,o),M.setFromEuler(B),v.compose(D.set(e.x+.6,a+3.2,e.z),M,R.set(.1,1.2,.6)),ct.setMatrixAt(i,v)}),Q.forEach((e,i)=>{const a=yt(e.x,e.z,t)+.35,l=Math.sin(t*1.6+e.ph)*.14,o=Math.cos(t*1.4+e.ph)*.14;B.set(l,0,o),M.setFromEuler(B),v.compose(D.set(e.x,a,e.z),M,R.set(2.4,.7,2.4)),gt.setMatrixAt(n,v),v.compose(D.set(e.x,a+2,e.z),M,R.set(.18,3.4,.18)),Mt.setMatrixAt(n,v),n++,v.compose(D.set(e.x,a+1.1,e.z),M,R.set(1.6,1.8,1.6)),wt.setMatrixAt(i,v),B.set(l,Math.sin(t*2+e.ph)*.2+Math.PI/2,o),M.setFromEuler(B),v.compose(D.set(e.x+.6,a+3.2,e.z),M,R.set(.1,1.2,.6)),ht.setMatrixAt(i,v)}),gt.instanceMatrix.needsUpdate=!0,wt.instanceMatrix.needsUpdate=!0,At.instanceMatrix.needsUpdate=!0,Mt.instanceMatrix.needsUpdate=!0,ht.instanceMatrix.needsUpdate=!0,ct.instanceMatrix.needsUpdate=!0}const Dt=[{i:85,dir:">>>",signSide:-1},{i:205,dir:">>>",signSide:-1},{i:335,dir:">>>",signSide:-1},{i:470,dir:"<<<",signSide:1},{i:590,dir:">>>",signSide:-1},{i:715,dir:">>>",signSide:-1},{i:825,dir:"<<<",signSide:1}],Wt=[];Dt.forEach(t=>{const n=d.at(t.i),e=Math.atan2(n.tx,n.tz),i=(S+4.5)*t.signSide,a=n.x-n.tz*i,l=n.z+n.tx*i,o=new K;o.position.set(a,0,l),o.rotation.y=e+(t.signSide>0?.35:-.35);for(const E of[-2.6,2.6]){const G=new w(c.cyl,m(s.ORANGE,{fill:!0}));G.scale.set(1.4,.7,1.4),G.position.set(E,.35,0),o.add(G);const F=new w(c.cyl,m(s.BLACK,{fill:!0}));F.scale.set(.18,3.2,.18),F.position.set(E,2,0),o.add(F)}const r=new w(c.box,m(s.BLACK,{tone:.65}));r.scale.set(6.8,2.2,.25),r.position.set(0,3.2,0),o.add(r);const f=st(t.dir,{size:1.6,ink:s.RED,weight:1.8});f.position.set(0,3.2,.16),o.add(f),g.add(o),Wt.push({g:o,x:a,z:l,arrows:f})});const xt=new K;g.add(xt);const Z=new K;xt.add(Z);const Lt=new w(c.box,m(s.BLACK,{tone:.12}));Lt.scale.set(3.2,1.1,7.4),Lt.position.y=.55,Z.add(Lt);const tt=new w(c.cone,m(s.BLUE,{tone:.18}));tt.scale.set(3.1,2.9,1.1),tt.position.set(0,.65,3.9),tt.rotation.x=Math.PI/2,Z.add(tt);const nt=new w(c.box,m(s.RED,{fill:!0}));nt.scale.set(3.28,.22,7),nt.position.set(0,.72,.1),Z.add(nt);const rt=new w(c.box,m(s.BLACK,{tone:.52}));rt.scale.set(2.8,.25,4.4),rt.position.set(0,1.15,-.4),Z.add(rt);const ot=new w(c.box,m(s.BLUE,{tone:.42}));ot.scale.set(2.6,.8,.12),ot.position.set(0,1.55,1.3),ot.rotation.x=-.38,Z.add(ot);const j=new w(c.sph,m(s.ORANGE,{tone:.4}));j.scale.set(.65,.65,.65),j.position.set(-.55,1.85,.2),Z.add(j);const lt=new w(c.cone,m(s.RED,{fill:!0}));lt.scale.set(.7,.35,.7),lt.position.set(-.55,2.2,.2),Z.add(lt);const mt=new w(c.cyl,m(s.BLACK,{fill:!0}));mt.scale.set(.18,2.5,.18),mt.position.set(0,2.1,-1.2),Z.add(mt);const vt=new w(c.box,m(s.BLUE,{tone:.45}));vt.scale.set(6.2,.05,14),vt.position.set(0,.06,-7.5),Z.add(vt);const Eo=[new it,new it],Ro=new bo().setFromPoints(Eo),qt=new So(Ro,new Oo({color:15499033,linewidth:3}));qt.frustumCulled=!1,xt.add(qt);const ut=new K;xt.add(ut);const Zt=new w(c.box,m(s.BLUE,{tone:.22}));Zt.scale.set(1.2,.16,2.8),Zt.position.y=.08,ut.add(Zt);const Ut=new w(c.cone,m(s.ORANGE,{tone:.1}));Ut.scale.set(1.2,.9,.16),Ut.position.set(0,.14,1.45),Ut.rotation.x=Math.PI/2,ut.add(Ut);const Xt=new w(c.box,m(s.RED,{fill:!0}));Xt.scale.set(.24,.18,2.7),Xt.position.set(0,.1,0),ut.add(Xt);for(const t of[-.35,0,.35]){const n=new w(c.box,m(s.BLACK,{fill:!0}));n.scale.set(.06,.3,.5),n.position.set(t,-.15,-1),ut.add(n)}const no=Ko(C||z,{height:1.65});no.setChar("beltran");const pt=new K,ao=new w(c.box,m(s.BLACK,{tone:.65}));ao.scale.set(12.5,2.6,.2),pt.add(ao);const io=st("¡A TOPE! ¡ESO LO VENDEMOS YA!",{size:.9,ink:s.BLUE,weight:1.4});io.position.set(0,.1,.16),pt.add(io),pt.visible=!1,xt.add(pt);const O={x:0,y:0,z:0,boatX:0,boatZ:0,carveAngle:0,saluting:!1,saluteT:0,lastVoiceT:0,wakeBoostCooldown:0,speechTimer:0},Ht=[],Kt=[],_t=[],Vt=[];let zt=.05,kt=Math.PI+.1;const Bt=1.95,It=(t,n)=>Math.abs(Math.atan2(Math.sin(t-n),Math.cos(t-n)));function bt(t){let n=0;for(let e=0;e<W;e+=6){const i=d.at(e),a=Math.atan2(i.z-u.z,i.x-u.x);It(a,t)<.2&&(n=Math.max(n,Math.hypot(i.x-u.x,i.z-u.z)))}return n||200}const Tt=[];for(let t=0;t<Math.PI*2;t+=.085){if(It(t,zt)<.22)continue;const n=bt(t)+p(50,80),e=u.x+Math.cos(t)*n,i=u.z+Math.sin(t)*n,a=p(45,80),l=p(14,34),o=p(45,80),r=It(t,kt)<.16,f=It(t,Bt)<.15;if(Ht.push({x:e,y:-l*.45,z:i,sx:a,sy:r||f?l*.35:l,sz:o,ry:p(0,3),beach:r}),!r&&!f){for(let E=0;E<15;E++){const G=p(0,Math.PI*2),F=p(.1,.8),T=e+Math.cos(G)*F*a*.5,Pt=i+Math.sin(G)*F*o*.5,Nt=-l*.45+l*.5*Math.sqrt(Math.max(0,1-F*F)),at=p(6,11);Kt.push({x:T,y:Nt+at*.55,z:Pt,sx:at*.42,sy:at,sz:at*.42}),_t.push({x:T,y:Nt+at*.05,z:Pt,sx:.6,sy:at*.3,sz:.6})}for(let E=0;E<3;E++){const G=p(3,8),F=n-a*.42;Vt.push({x:u.x+Math.cos(t+p(-.04,.04))*F,y:G*.1,z:u.z+Math.sin(t+p(-.04,.04))*F,sx:G*p(1,1.6),sy:G*p(.5,.9),sz:G,ry:p(0,3)})}}}for(let t=0;t<Math.PI*2;t+=.022){if(It(t,zt)<.2)continue;const n=bt(t);for(let e=0;e<3;e++){const i=n+p(70,140),a=t+p(-.01,.01),l=u.x+Math.cos(a)*i,o=u.z+Math.sin(a)*i,r=p(9,16);Kt.push({x:l,y:r*.55-2,z:o,sx:r*.4,sy:r,sz:r*.4}),_t.push({x:l,y:r*.05-2,z:o,sx:.7,sy:r*.3,sz:.7})}}{const t=new w(new Fo(1,2,64),m(s.GREEN,{tone:.3}));t.rotation.x=-Math.PI/2;const n=Math.max(d.bounds.maxX-d.bounds.minX,d.bounds.maxZ-d.bounds.minZ);t.scale.setScalar(n*.62),t.position.set(u.x,-1.6,u.z),g.add(t)}k(c.sph,s.GREEN,{tone:.2},Ht.filter(t=>!t.beach)),k(c.sph,s.ORANGE,{tone:.32},Ht.filter(t=>t.beach));for(let t=0;t<240&&Tt.length<9;t++){const n=p(d.bounds.minX-20,d.bounds.maxX+20),e=p(d.bounds.minZ-20,d.bounds.maxZ+20),i=p(5,11);if(!(Y(n,e)<S+i+10)&&!(Math.hypot(n-u.x,e-u.z)>bt(Math.atan2(e-u.z,n-u.x))+10)&&!Tt.some(a=>Math.hypot(a.x-n,a.z-e)<a.r+i+12)){Tt.push({x:n,z:e,r:i}),Vt.push({x:n,y:0,z:e,sx:i*2,sy:i*p(.5,.9),sz:i*1.8,ry:p(0,3)});for(let a=0;a<Math.round(i/4);a++){const l=p(5,8),o=n+p(-i,i)*.4,r=e+p(-i,i)*.4;Kt.push({x:o,y:i*.35+l*.5,z:r,sx:l*.4,sy:l,sz:l*.4}),_t.push({x:o,y:i*.3,z:r,sx:.5,sy:l*.3,sz:.5})}}}k(c.sph,s.BLACK,{tone:.22},Vt),k(c.cone,s.GREEN,{tone:-.08},Kt),k(c.cyl,s.ORANGE,{tone:-.2},_t);{const t=bt(zt)+70,n=new K;n.position.set(u.x+Math.cos(zt)*t,0,u.z+Math.sin(zt)*t),n.rotation.y=-zt,g.add(n);for(let i=-5;i<=5;i++){const a=new w(c.box,m(s.BLACK,{tone:.32})),l=i*.07;if(a.scale.set(9,30,16),a.position.set(Math.cos(l)*14-14,13,Math.sin(l)*200*.66),a.rotation.y=-l,n.add(a),Math.abs(i)<=2){const o=new w(c.box,m(s.BLACK,{fill:!0}));o.scale.set(.5,7,6),o.position.set(Math.cos(l)*14-18.6,20,Math.sin(l)*132),o.rotation.y=-l,n.add(o)}}const e=new w(c.box,m(s.BLACK,{tone:.1}));e.scale.set(11,1.2,150),e.position.set(-1,28.6,0),n.add(e);for(const i of[-1,1]){const a=new w(c.box,m(s.BLACK,{tone:.05}));a.scale.set(12,38,12),a.position.set(-1,19,i*76),n.add(a)}}{const t=bt(kt)+34,n=u.x+Math.cos(kt)*t,e=u.z+Math.sin(kt)*t,i=new K;i.position.set(n,0,e),i.rotation.y=-kt+Math.PI/2,g.add(i);const a=(o,r,f,E,G)=>{const F=new w(o,m(r,f));return F.scale.set(...E),F.position.set(...G),i.add(F),F};a(c.box,s.ORANGE,{tone:.38},[90,1.2,26],[0,.1,-6]);for(let o=0;o<9;o++){const r=-36+o*9+p(-1.5,1.5),f=-4+p(-3,3);a(c.cyl,s.BLACK,{fill:!0},[.15,3.2,.15],[r,2.3,f]),a(c.cone,o%2?s.RED:s.BLUE,{tone:.1},[3.4,.9,3.4],[r,4.1,f]),a(c.box,o%3?s.PURPLE:s.GREEN,{tone:.1},[1.1,.06,2.1],[r+1.4,.75,f+.6])}a(c.box,s.ORANGE,{tone:-.05},[9,3.6,5],[30,2.5,-14]),a(c.box,s.RED,{tone:.05},[10.5,.6,6.5],[30,4.6,-14]),a(c.box,s.BLACK,{fill:!0},[6,1.2,.1],[30,3.2,-11.45]);for(const o of[-1,1])for(const r of[-1,1])a(c.box,s.BLACK,{},[.2,4,.2],[-30+o*.8,2.7,-12+r*.8]);a(c.box,s.RED,{tone:.05},[2.4,1.4,2.4],[-30,5.4,-12]),a(c.cyl,s.BLACK,{fill:!0},[.2,9,.2],[-22,4.6,-10]),a(c.box,s.BLUE,{tone:-.05},[2.6,1.6,.08],[-20.6,8.2,-10]),a(c.box,s.ORANGE,{tone:-.12},[3,.25,24],[8,.75,-4]);for(let o=0;o<8;o++)a(c.box,s.ORANGE,{fill:!0},[3.1,.05,.12],[8,.9,-15+o*3]);for(let o=0;o<4;o++){const r=-14+o*5;a(c.box,o%2?s.ORANGE:s.BLUE,{tone:.05},[2.2,.7,3.6],[r,.2,9]),a(c.cone,s.GREEN,{tone:.2},[1.2,1.6,.2],[r,1.5,8.2])}a(c.box,s.ORANGE,{tone:.1},[.3,5,.3],[0,2.5,-18]);const l=st("VIRGEN DE LA NUEVA",{size:1.1,ink:s.BLUE});l.position.set(0,5.8,-17.8),i.add(l),a(c.box,s.BLACK,{tone:.55},[l.userData.width+1.4,1.8,.2],[0,5.8,-18.05]);for(let o=0;o<12;o++){const r=-44+o*8+p(-2,2),f=p(9,13);a(c.cone,s.GREEN,{tone:-.08},[f*.42,f,f*.42],[r,f*.6+1,-26+p(-3,3)]),a(c.cyl,s.ORANGE,{tone:-.2},[.6,f*.3,.6],[r,1.2,-26])}}const co=[];{const t=bt(Bt)+36,n=new K;n.position.set(u.x+Math.cos(Bt)*t,0,u.z+Math.sin(Bt)*t),n.rotation.y=-Bt+Math.PI/2,g.add(n);const e=(o,r,f,E,G,F)=>{const T=new w(o,m(r,f));return T.scale.set(...E),T.position.set(...G),n.add(T),T};e(c.box,s.GREEN,{tone:.12},[110,1.4,40],[0,.2,-8]),e(c.box,s.ORANGE,{tone:.3},[110,.6,6],[0,.4,13]);const i=s.ORANGE;for(let o=0;o<8;o++){const r=-42+o%4*13+p(-1,1),f=o<4?-2:-14;e(c.box,i,{tone:-.1},[4,.25,1.6],[r,1.9,f]);for(const E of[-1,1])e(c.box,i,{tone:-.15},[4,.2,.5],[r,1.3,f+E*1.3]),e(c.box,s.BLACK,{fill:!0},[.15,1.2,1.8],[r+E*1.6,1.3,f]);if(e(c.box,o%2?s.RED:s.BLUE,{tone:.35},[2.2,.05,1.2],[r,2.05,f]),o%2===0)for(const E of[-1,1]){const G=[s.RED,s.BLUE,s.PURPLE,s.GREEN][(o+(E>0?1:0))%4];e(c.cyl,G,{tone:.1},[.8,1.3,.6],[r+p(-1,1),2.1,f+E*1.35]),e(c.sph,s.ORANGE,{tone:.45},[.6,.6,.6],[r+p(-1,1),3.05,f+E*1.35])}}for(const o of[-50,6]){e(c.box,s.RED,{tone:.1},[2.2,1.6,1.4],[o,1.6,-22]),e(c.box,s.BLACK,{fill:!0},[2,.1,1.2],[o,2.45,-22]),e(c.box,s.RED,{tone:.05},[.6,3,.6],[o+.7,3.5,-22.5]);for(let r=0;r<5;r++){const f=e(c.sph,s.BLACK,{tone:.55},[1,1,1],[o+.7,5+r,-22.5]);co.push({m:f,g:n,ph:r/5,x:o+.7,z:-22.5})}}e(c.box,s.ORANGE,{tone:.2},[22,7,10],[36,4,-20]),e(c.box,s.RED,{tone:0},[24,.8,12],[36,7.9,-20]);for(let o=0;o<4;o++)e(c.box,s.BLUE,{tone:.3},[3.2,2.6,.1],[28+o*5.4,4.2,-14.95]);e(c.box,s.ORANGE,{tone:-.1},[26,.4,12],[36,1.1,-6]);for(let o=0;o<4;o++){const r=27+o*6;e(c.cyl,s.BLACK,{fill:!0},[.15,3.5,.15],[r,3,-6]),e(c.cone,o%2?s.GREEN:s.RED,{tone:.15},[4,1,4],[r,5,-6]),e(c.cyl,s.BLACK,{tone:.5},[1.6,.15,1.6],[r,2.1,-6])}const a=st("RESTAURANTE",{size:1.2,ink:s.BLACK});a.position.set(36,9.8,-14.8),n.add(a);const l=st("MERENDERO",{size:1.1,ink:s.GREEN});e(c.box,s.ORANGE,{tone:.1},[.3,4.5,.3],[-20,2.4,6]),e(c.box,s.BLACK,{tone:.55},[l.userData.width+1.2,1.7,.2],[-20,5.3,6]),l.position.set(-20,5.3,6.15),n.add(l);for(let o=0;o<6;o++){const r=-46+o*6.5,f=[s.RED,s.BLUE,s.BLACK,s.ORANGE,s.GREEN,s.PURPLE][o];e(c.box,f,{tone:.1},[2.2,1.2,4.2],[r,1.5,-32]),e(c.box,s.BLUE,{tone:.35},[2,.9,2.2],[r,2.5,-32.4])}for(let o=0;o<14;o++){const r=-52+o*8+p(-2,2),f=-36+p(-4,4),E=p(10,15);e(c.cone,s.GREEN,{tone:-.08},[E*.42,E,E*.42],[r,E*.6+1,f]),e(c.cyl,s.ORANGE,{tone:-.2},[.6,E*.3,.6],[r,1.2,f])}}{const t=d.at(W-40),n=-t.tz,e=t.tx,i=new K,a=S+16;i.position.set(t.x+n*a,0,t.z+e*a),i.rotation.y=Math.atan2(t.tx,t.tz),g.add(i);const l=(o,r,f,E,G,F)=>{const T=new w(o,m(r,f));return T.scale.set(...E),T.position.set(...G),i.add(T),T};l(c.box,s.ORANGE,{tone:-.08},[40,.5,4],[0,.9,0]);for(let o=-4;o<=4;o++)l(c.cyl,s.BLACK,{},[.5,2.6,.5],[o*5,-.2,2.2]);for(let o=-2;o<=2;o++)l(c.box,o%2?s.BLUE:s.RED,{tone:.1},[5,.9,2],[o*8,.3,-2.8])}{const t=d.at(30),n=S+24,e=new K;e.position.set(t.x+t.tz*n,0,t.z-t.tx*n),e.rotation.y=Math.atan2(t.tx,t.tz)-Math.PI/2,g.add(e);const i=st("PANTANO DE",{size:2.2,ink:s.BLUE,weight:1.2}),a=st("SAN JUAN",{size:3.2,ink:s.RED,weight:1.2});i.position.set(0,12,.3),a.position.set(0,8.4,.3),e.add(i,a);const l=st("PANTANO DE",{size:2.2,ink:s.BLUE,weight:1.2}),o=st("SAN JUAN",{size:3.2,ink:s.RED,weight:1.2});l.position.set(0,12,-.3),o.position.set(0,8.4,-.3),l.rotation.y=o.rotation.y=Math.PI,e.add(l,o);const r=Math.max(i.userData.width,a.userData.width)+3,f=new w(c.box,m(s.BLACK,{tone:.58}));f.scale.set(r,7.4,.4),f.position.set(0,10.2,0),e.add(f);for(const E of[-1,1]){const G=new w(c.box,m(s.ORANGE,{tone:-.1}));G.scale.set(.6,7,.6),G.position.set(E*(r/2-1),3.5,-.2),e.add(G)}}const Gt=[];for(let t=0;t<200&&Gt.length<7;t++){const n=p(d.bounds.minX-10,d.bounds.maxX+10),e=p(d.bounds.minZ-10,d.bounds.maxZ+10);if(Y(n,e)<S+16||Tt.some(l=>Math.hypot(l.x-n,l.z-e)<l.r+10))continue;const i=new K;i.position.set(n,0,e);const a=Gt.length%3===2;if(a){const l=new w(c.box,m(s.ORANGE,{tone:.05}));l.scale.set(.8,.35,4),i.add(l);const o=new w(c.sph,m(s.BLUE,{tone:.1}));o.scale.set(.6,1,.6),o.position.y=.7,i.add(o);const r=new w(c.box,m(s.BLACK,{fill:!0}));r.scale.set(3.4,.08,.2),r.position.y=.9,i.add(r),i.userData.paddle=r}else{const l=new w(c.box,m(s.BLACK,{tone:.35}));l.scale.set(2.2,1,7),l.position.y=.3,i.add(l);const o=new w(c.cyl,m(s.BLACK,{fill:!0}));o.scale.set(.18,10,.18),o.position.y=5.5,i.add(o);const r=new w(c.cone,m(Gt.length%2?s.RED:s.BLUE,{tone:.3}));r.scale.set(.2,8.5,4.6),r.position.set(0,5.2,1.6),i.add(r)}i.rotation.y=p(0,Math.PI*2),g.add(i),Gt.push({g:i,ph:p(0,6),kayak:a,speed:a?1.2:2.2,x0:n,z0:e})}{const t=d.at(0),n=new K;n.position.set(t.x,0,t.z),n.rotation.y=Math.atan2(t.tx,t.tz),g.add(n);for(const i of[-1,1]){const a=new w(c.cyl,m(s.RED,{tone:.08}));a.scale.set(2.2,11,2.2),a.position.set(i*(S+1.5),5.5,0),n.add(a)}const e=new w(c.box,m(s.RED,{tone:.08}));e.scale.set(S*2+5,2.4,1.8),e.position.y=11,n.add(e);for(let i=0;i<16;i++)for(let a=0;a<2;a++){const l=new w(c.box,m(s.BLACK,(i+a)%2?{fill:!0}:{tone:.55}));l.scale.set(S*2/16,.9,.1),l.position.set(-S+(i+.5)*(S*2/16),10.55+a*.9,.95),n.add(l)}for(let i=0;i<13;i++){const a=new w(c.box,m(s.BLACK,i%2?{fill:!0}:{tone:.55}));a.scale.set(S*2/13,.1,1.2),a.position.set(-S+(i+.5)*(S*2/13),.25,0),n.add(a)}}const Yt=[],ro=[],Qt=(t,n)=>{const e=d.at(t);return{x:e.x-e.tz*n,z:e.z+e.tx*n,yaw:Math.atan2(e.tx,e.tz),i:t}};for(const[t,n]of[[80,-5],[260,4],[470,0],[640,-6],[800,5]]){const e=Qt(t,n),i=new K;i.position.set(e.x,.3,e.z),i.rotation.y=e.yaw;const a=[],l=new w(c.box,m(s.ORANGE,{tone:.35}));l.scale.set(4.6,.08,8),i.add(l);for(let o=0;o<3;o++){const r=new K;r.position.z=-2.4+o*2.4,i.add(r),a.push(r);for(const f of[-1,1]){const E=new w(c.box,m(o===1?s.RED:s.ORANGE,{fill:!0}));E.scale.set(.7,.14,2.6),E.position.set(f*.95,.06,0),E.rotation.y=-f*.75,r.add(E)}}g.add(i),Yt.push({...e,g:i,chev:a})}for(const[t,n]of[[350,3],[720,-3]]){const e=Qt(t,n),i=new K;i.position.set(e.x,0,e.z),i.rotation.y=e.yaw;const a=new w(c.box,m(s.ORANGE,{tone:.05}));a.scale.set(8,.5,9),a.position.y=1.1,a.rotation.x=-.26,i.add(a);for(let l=0;l<3;l++){const o=new w(c.box,m(s.BLACK,{fill:!0}));o.scale.set(8.1,.52,.6),o.position.set(0,1.12+(l-1)*.6*Math.sin(.26),(l-1)*2.8),o.rotation.x=-.26,i.add(o)}g.add(i),ro.push({...e,g:i})}const Jt=[];for(const t of[150,420,610,860])for(let n=-2;n<=2;n++){const e=Qt(t,n*4.4),i=new K,a=[s.BLUE,s.PURPLE,s.ORANGE,s.GREEN,s.RED][n+2],l=new w(c.box,m(a,{tone:.3}));l.scale.setScalar(2.1),i.add(l);for(let o=0;o<4;o++){const r=st("?",{size:1.3,ink:s.BLACK,weight:1.6}),f=o*Math.PI/2;r.position.set(Math.sin(f)*1.07,0,Math.cos(f)*1.07),r.rotation.y=f,i.add(r)}i.position.set(e.x,1.6,e.z),g.add(i),Jt.push({...e,g:i,cool:0,ph:L()*6})}function Ao(t,n,e,i,a=null){q(t),Ct(t);for(const x of Wt){const X=yt(x.x,x.z,t);x.g.position.y=X+.15,x.g.rotation.z=Math.sin(t*1.5+x.x)*.04,x.arrows.scale.setScalar(1+Math.sin(t*5+x.z)*.08)}const o=t*.14,r=u.x+Math.sin(o)*135+Math.sin(o*2)*32,f=u.z+Math.cos(o)*115+Math.cos(o*2)*28,E=o+.01,G=u.x+Math.sin(E)*135+Math.sin(E*2)*32,F=u.z+Math.cos(E)*115+Math.cos(E*2)*28,T=Math.atan2(G-r,F-f),Pt=yt(r,f,t)+.35;Z.position.set(r,Pt,f),Z.rotation.y=T,Z.rotation.x=-.06,Z.rotation.z=Math.sin(t*2)*.03;const Nt=16.5,at=2.2,$t=Math.sin(t*at)*5.4,dt=r-Math.sin(T)*Nt-Math.cos(T)*$t,ft=f-Math.cos(T)*Nt+Math.sin(T)*$t,St=yt(dt,ft,t)+.16,lo=-Math.cos(t*at)*.42;ut.position.set(dt,St,ft),ut.rotation.y=T+($t>0?.28:-.28),ut.rotation.z=lo;const to=qt.geometry.attributes.position;to.setXYZ(0,r,Pt+2.1,f),to.setXYZ(1,dt,St+1.1,ft),to.needsUpdate=!0,O.x=dt,O.y=St,O.z=ft,O.boatX=r,O.boatZ=f,h&&i>0&&(h.disturb(r-Math.sin(T)*2.5,f-Math.cos(T)*2.5,2.2,-.035),h.disturb(dt,ft,1.1,-.02));let oo=999,uo=!1;if(a&&typeof a.x=="number"){const x=a.x-dt,X=a.z-ft;oo=Math.hypot(x,X);const Et=x*Math.cos(T)-X*Math.sin(T),Ot=x*Math.sin(T)+X*Math.cos(T);Ot<-.8&&Ot>-7.5&&Math.abs(Et)<3.2&&oo<8&&t-O.wakeBoostCooldown>2.5&&(O.wakeBoostCooldown=t,uo=!0)}if(oo<36&&(O.saluting=!0,O.saluteT=1.8,t-O.lastVoiceT>10)){O.lastVoiceT=t;const x=["¡A tope! ¡Eso lo vendemos ya!","¡Qué estilazo en el pantano!","¡Pilla mi rebufo y dale turbo!","¡Vamos fiera, a por el podio!"],X=x[Math.floor(Math.random()*x.length)];try{_o("beltran",{phrase:X,force:!0,showBubble:!1})}catch{}O.speechTimer=3.5,pt.visible=!0}O.speechTimer>0&&(O.speechTimer-=i,pt.position.set(dt,St+3.2,ft),pt.rotation.y=T,O.speechTimer<=0&&(pt.visible=!1));const Co=new it(dt,St+.95,ft),Do=O.saluteT>0?"jump":"idle";no.update(i,{pos:Co,camera:{position:new it(n,20,e)},moveX:0,facing:1,speed:0,onGround:!0,firing:!1,pose:Do,hurt:0,tilt:lo*.7,squash:1+Math.sin(t*4)*.04}),O.saluteT=Math.max(0,O.saluteT-i);for(const x of Gt)x.g.position.x=x.x0+Math.sin(t*.05*x.speed+x.ph)*18,x.g.position.z=x.z0+Math.cos(t*.04*x.speed+x.ph)*14,x.g.position.y=yt(x.g.position.x,x.g.position.z,t)*.8,x.g.rotation.z=Math.sin(t*1.1+x.ph)*.06,x.g.userData.paddle&&(x.g.userData.paddle.rotation.z=Math.sin(t*3+x.ph)*.5);for(const x of Yt)x.chev.forEach((X,Et)=>{const Ot=1+.25*Math.max(0,Math.sin(t*8-Et*1.2));X.scale.set(Ot,1,Ot)});for(const x of co){const X=(t*.25+x.ph)%1;x.m.position.set(x.x+Math.sin(t+x.ph*6)*.6*X,4.6+X*7,x.z),x.m.scale.setScalar(.6+X*2),x.m.visible=X<.92}for(const x of Jt)x.cool>0&&(x.cool-=i,x.g.visible=x.cool<=0),x.g.rotation.y+=i*1.6,x.g.rotation.x=Math.sin(t*1.3+x.ph)*.3,x.g.position.y=1.6+Math.sin(t*2+x.ph)*.35;if(h){const x=a&&typeof a.x=="number",X=x?a.x+Math.sin(a.yaw||0)*28:r,Et=x?a.z+Math.cos(a.yaw||0)*28:f;h.update(t,i,n,e,X,Et)}return{inWakeDraft:uo,beltran:O}}return{root:g,update:Ao,colliders:Tt,boostPads:Yt,ramps:ro,itemBoxes:Jt,beltran:O,water:h,dispose:()=>h&&h.dispose()}}export{W as N_SAMPLES,S as TRACK_HALF,ue as buildRaceWorld,le as buildTrack,yt as waveH};
