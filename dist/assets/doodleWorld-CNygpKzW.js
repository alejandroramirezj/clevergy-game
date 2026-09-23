import{A as wc,c as yr,$ as So,t as oi}from"./index-CIUOA5ev.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Wa="170",Rc=0,Eo=1,Cc=2,Ul=1,Pc=2,Dn=3,Qn=0,$t=1,pn=2,Zn=0,Vi=1,yo=2,To=3,bo=4,Lc=5,gi=100,Dc=101,Ic=102,Uc=103,Nc=104,Fc=200,Oc=201,Bc=202,zc=203,ia=204,sa=205,kc=206,Hc=207,Gc=208,Vc=209,Wc=210,Xc=211,qc=212,Yc=213,$c=214,ra=0,aa=1,oa=2,qi=3,la=4,ca=5,ua=6,da=7,Nl=0,Kc=1,jc=2,Jn=0,Zc=1,Jc=2,Qc=3,eu=4,tu=5,nu=6,iu=7,Fl=300,Yi=301,$i=302,fa=303,ha=304,rr=306,pa=1e3,vi=1001,ma=1002,nn=1003,su=1004,As=1005,gn=1006,Tr=1007,xi=1008,Fn=1009,Ol=1010,Bl=1011,gs=1012,Xa=1013,ei=1014,In=1015,Ji=1016,qa=1017,Ya=1018,Ki=1020,zl=35902,kl=1021,Hl=1022,_n=1023,Gl=1024,Vl=1025,Wi=1026,ji=1027,Wl=1028,$a=1029,Xl=1030,Ka=1031,ja=1033,Ks=33776,js=33777,Zs=33778,Js=33779,ga=35840,_a=35841,va=35842,xa=35843,Ma=36196,Sa=37492,Ea=37496,ya=37808,Ta=37809,ba=37810,Aa=37811,wa=37812,Ra=37813,Ca=37814,Pa=37815,La=37816,Da=37817,Ia=37818,Ua=37819,Na=37820,Fa=37821,Qs=36492,Oa=36494,Ba=36495,ql=36283,za=36284,ka=36285,Ha=36286,ru=3200,au=3201,ou=0,lu=1,jn="",tn="srgb",Qi="srgb-linear",ar="linear",gt="srgb",Ti=7680,Ao=519,cu=512,uu=513,du=514,Yl=515,fu=516,hu=517,pu=518,mu=519,wo=35044,Ro="300 es",Un=2e3,tr=2001;class es{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],br=Math.PI/180,Ga=180/Math.PI;function _s(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]).toLowerCase()}function Yt(i,e,t){return Math.max(e,Math.min(t,i))}function gu(i,e){return(i%e+e)%e}function Ar(i,e,t){return(1-t)*i+t*e}function as(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function qt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class dt{constructor(e=0,t=0){dt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Yt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ye{constructor(e,t,n,s,r,a,o,u,d){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,u,d)}set(e,t,n,s,r,a,o,u,d){const f=this.elements;return f[0]=e,f[1]=s,f[2]=o,f[3]=t,f[4]=r,f[5]=u,f[6]=n,f[7]=a,f[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],u=n[6],d=n[1],f=n[4],m=n[7],g=n[2],_=n[5],x=n[8],E=s[0],h=s[3],c=s[6],b=s[1],R=s[4],T=s[7],F=s[2],D=s[5],I=s[8];return r[0]=a*E+o*b+u*F,r[3]=a*h+o*R+u*D,r[6]=a*c+o*T+u*I,r[1]=d*E+f*b+m*F,r[4]=d*h+f*R+m*D,r[7]=d*c+f*T+m*I,r[2]=g*E+_*b+x*F,r[5]=g*h+_*R+x*D,r[8]=g*c+_*T+x*I,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],u=e[6],d=e[7],f=e[8];return t*a*f-t*o*d-n*r*f+n*o*u+s*r*d-s*a*u}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],u=e[6],d=e[7],f=e[8],m=f*a-o*d,g=o*u-f*r,_=d*r-a*u,x=t*m+n*g+s*_;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/x;return e[0]=m*E,e[1]=(s*d-f*n)*E,e[2]=(o*n-s*a)*E,e[3]=g*E,e[4]=(f*t-s*u)*E,e[5]=(s*r-o*t)*E,e[6]=_*E,e[7]=(n*u-d*t)*E,e[8]=(a*t-n*r)*E,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const u=Math.cos(r),d=Math.sin(r);return this.set(n*u,n*d,-n*(u*a+d*o)+a+e,-s*d,s*u,-s*(-d*a+u*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(wr.makeScale(e,t)),this}rotate(e){return this.premultiply(wr.makeRotation(-e)),this}translate(e,t){return this.premultiply(wr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const wr=new Ye;function $l(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function nr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _u(){const i=nr("canvas");return i.style.display="block",i}const Co={};function ps(i){i in Co||(Co[i]=!0,console.warn(i))}function vu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function xu(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Mu(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const lt={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===gt&&(i.r=Nn(i.r),i.g=Nn(i.g),i.b=Nn(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===gt&&(i.r=Xi(i.r),i.g=Xi(i.g),i.b=Xi(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===jn?ar:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Xi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Po=[.64,.33,.3,.6,.15,.06],Lo=[.2126,.7152,.0722],Do=[.3127,.329],Io=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Uo=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);lt.define({[Qi]:{primaries:Po,whitePoint:Do,transfer:ar,toXYZ:Io,fromXYZ:Uo,luminanceCoefficients:Lo,workingColorSpaceConfig:{unpackColorSpace:tn},outputColorSpaceConfig:{drawingBufferColorSpace:tn}},[tn]:{primaries:Po,whitePoint:Do,transfer:gt,toXYZ:Io,fromXYZ:Uo,luminanceCoefficients:Lo,outputColorSpaceConfig:{drawingBufferColorSpace:tn}}});let bi;class Su{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{bi===void 0&&(bi=nr("canvas")),bi.width=e.width,bi.height=e.height;const n=bi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=bi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=nr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Nn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Nn(t[n]/255)*255):t[n]=Nn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Eu=0;class Kl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=_s(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Rr(s[a].image)):r.push(Rr(s[a]))}else r=Rr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Rr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Su.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yu=0;class Vt extends es{constructor(e=Vt.DEFAULT_IMAGE,t=Vt.DEFAULT_MAPPING,n=vi,s=vi,r=gn,a=xi,o=_n,u=Fn,d=Vt.DEFAULT_ANISOTROPY,f=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yu++}),this.uuid=_s(),this.name="",this.source=new Kl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=d,this.format=o,this.internalFormat=null,this.type=u,this.offset=new dt(0,0),this.repeat=new dt(1,1),this.center=new dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pa:e.x=e.x-Math.floor(e.x);break;case vi:e.x=e.x<0?0:1;break;case ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case pa:e.y=e.y-Math.floor(e.y);break;case vi:e.y=e.y<0?0:1;break;case ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Vt.DEFAULT_IMAGE=null;Vt.DEFAULT_MAPPING=Fl;Vt.DEFAULT_ANISOTROPY=1;class bt{constructor(e=0,t=0,n=0,s=1){bt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const u=e.elements,d=u[0],f=u[4],m=u[8],g=u[1],_=u[5],x=u[9],E=u[2],h=u[6],c=u[10];if(Math.abs(f-g)<.01&&Math.abs(m-E)<.01&&Math.abs(x-h)<.01){if(Math.abs(f+g)<.1&&Math.abs(m+E)<.1&&Math.abs(x+h)<.1&&Math.abs(d+_+c-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const R=(d+1)/2,T=(_+1)/2,F=(c+1)/2,D=(f+g)/4,I=(m+E)/4,P=(x+h)/4;return R>T&&R>F?R<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(R),s=D/n,r=I/n):T>F?T<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(T),n=D/s,r=P/s):F<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(F),n=I/r,s=P/r),this.set(n,s,r,t),this}let b=Math.sqrt((h-x)*(h-x)+(m-E)*(m-E)+(g-f)*(g-f));return Math.abs(b)<.001&&(b=1),this.x=(h-x)/b,this.y=(m-E)/b,this.z=(g-f)/b,this.w=Math.acos((d+_+c-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tu extends es{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Vt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Kl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ti extends Tu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class jl extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class bu extends Vt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=nn,this.minFilter=nn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class vs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let u=n[s+0],d=n[s+1],f=n[s+2],m=n[s+3];const g=r[a+0],_=r[a+1],x=r[a+2],E=r[a+3];if(o===0){e[t+0]=u,e[t+1]=d,e[t+2]=f,e[t+3]=m;return}if(o===1){e[t+0]=g,e[t+1]=_,e[t+2]=x,e[t+3]=E;return}if(m!==E||u!==g||d!==_||f!==x){let h=1-o;const c=u*g+d*_+f*x+m*E,b=c>=0?1:-1,R=1-c*c;if(R>Number.EPSILON){const F=Math.sqrt(R),D=Math.atan2(F,c*b);h=Math.sin(h*D)/F,o=Math.sin(o*D)/F}const T=o*b;if(u=u*h+g*T,d=d*h+_*T,f=f*h+x*T,m=m*h+E*T,h===1-o){const F=1/Math.sqrt(u*u+d*d+f*f+m*m);u*=F,d*=F,f*=F,m*=F}}e[t]=u,e[t+1]=d,e[t+2]=f,e[t+3]=m}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],u=n[s+1],d=n[s+2],f=n[s+3],m=r[a],g=r[a+1],_=r[a+2],x=r[a+3];return e[t]=o*x+f*m+u*_-d*g,e[t+1]=u*x+f*g+d*m-o*_,e[t+2]=d*x+f*_+o*g-u*m,e[t+3]=f*x-o*m-u*g-d*_,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,u=Math.sin,d=o(n/2),f=o(s/2),m=o(r/2),g=u(n/2),_=u(s/2),x=u(r/2);switch(a){case"XYZ":this._x=g*f*m+d*_*x,this._y=d*_*m-g*f*x,this._z=d*f*x+g*_*m,this._w=d*f*m-g*_*x;break;case"YXZ":this._x=g*f*m+d*_*x,this._y=d*_*m-g*f*x,this._z=d*f*x-g*_*m,this._w=d*f*m+g*_*x;break;case"ZXY":this._x=g*f*m-d*_*x,this._y=d*_*m+g*f*x,this._z=d*f*x+g*_*m,this._w=d*f*m-g*_*x;break;case"ZYX":this._x=g*f*m-d*_*x,this._y=d*_*m+g*f*x,this._z=d*f*x-g*_*m,this._w=d*f*m+g*_*x;break;case"YZX":this._x=g*f*m+d*_*x,this._y=d*_*m+g*f*x,this._z=d*f*x-g*_*m,this._w=d*f*m-g*_*x;break;case"XZY":this._x=g*f*m-d*_*x,this._y=d*_*m-g*f*x,this._z=d*f*x+g*_*m,this._w=d*f*m+g*_*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],u=t[9],d=t[2],f=t[6],m=t[10],g=n+o+m;if(g>0){const _=.5/Math.sqrt(g+1);this._w=.25/_,this._x=(f-u)*_,this._y=(r-d)*_,this._z=(a-s)*_}else if(n>o&&n>m){const _=2*Math.sqrt(1+n-o-m);this._w=(f-u)/_,this._x=.25*_,this._y=(s+a)/_,this._z=(r+d)/_}else if(o>m){const _=2*Math.sqrt(1+o-n-m);this._w=(r-d)/_,this._x=(s+a)/_,this._y=.25*_,this._z=(u+f)/_}else{const _=2*Math.sqrt(1+m-n-o);this._w=(a-s)/_,this._x=(r+d)/_,this._y=(u+f)/_,this._z=.25*_}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Yt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,u=t._y,d=t._z,f=t._w;return this._x=n*f+a*o+s*d-r*u,this._y=s*f+a*u+r*o-n*d,this._z=r*f+a*d+n*u-s*o,this._w=a*f-n*o-s*u-r*d,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const u=1-o*o;if(u<=Number.EPSILON){const _=1-t;return this._w=_*a+t*this._w,this._x=_*n+t*this._x,this._y=_*s+t*this._y,this._z=_*r+t*this._z,this.normalize(),this}const d=Math.sqrt(u),f=Math.atan2(d,o),m=Math.sin((1-t)*f)/d,g=Math.sin(t*f)/d;return this._w=a*m+this._w*g,this._x=n*m+this._x*g,this._y=s*m+this._y*g,this._z=r*m+this._z*g,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(e=0,t=0,n=0){N.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(No.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(No.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,u=e.w,d=2*(a*s-o*n),f=2*(o*t-r*s),m=2*(r*n-a*t);return this.x=t+u*d+a*m-o*f,this.y=n+u*f+o*d-r*m,this.z=s+u*m+r*f-a*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,u=t.z;return this.x=s*u-r*o,this.y=r*a-n*u,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Cr.copy(this).projectOnVector(e),this.sub(Cr)}reflect(e){return this.sub(Cr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Yt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Cr=new N,No=new vs;class xs{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(r,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ws.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ws.copy(n.boundingBox)),ws.applyMatrix4(e.matrixWorld),this.union(ws)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(os),Rs.subVectors(this.max,os),Ai.subVectors(e.a,os),wi.subVectors(e.b,os),Ri.subVectors(e.c,os),Wn.subVectors(wi,Ai),Xn.subVectors(Ri,wi),li.subVectors(Ai,Ri);let t=[0,-Wn.z,Wn.y,0,-Xn.z,Xn.y,0,-li.z,li.y,Wn.z,0,-Wn.x,Xn.z,0,-Xn.x,li.z,0,-li.x,-Wn.y,Wn.x,0,-Xn.y,Xn.x,0,-li.y,li.x,0];return!Pr(t,Ai,wi,Ri,Rs)||(t=[1,0,0,0,1,0,0,0,1],!Pr(t,Ai,wi,Ri,Rs))?!1:(Cs.crossVectors(Wn,Xn),t=[Cs.x,Cs.y,Cs.z],Pr(t,Ai,wi,Ri,Rs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const wn=[new N,new N,new N,new N,new N,new N,new N,new N],dn=new N,ws=new xs,Ai=new N,wi=new N,Ri=new N,Wn=new N,Xn=new N,li=new N,os=new N,Rs=new N,Cs=new N,ci=new N;function Pr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ci.fromArray(i,r);const o=s.x*Math.abs(ci.x)+s.y*Math.abs(ci.y)+s.z*Math.abs(ci.z),u=e.dot(ci),d=t.dot(ci),f=n.dot(ci);if(Math.max(-Math.max(u,d,f),Math.min(u,d,f))>o)return!1}return!0}const Au=new xs,ls=new N,Lr=new N;class Za{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Au.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ls.subVectors(e,this.center);const t=ls.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ls,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Lr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ls.copy(e.center).add(Lr)),this.expandByPoint(ls.copy(e.center).sub(Lr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Rn=new N,Dr=new N,Ps=new N,qn=new N,Ir=new N,Ls=new N,Ur=new N;class wu{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Rn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Rn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Rn.copy(this.origin).addScaledVector(this.direction,t),Rn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Dr.copy(e).add(t).multiplyScalar(.5),Ps.copy(t).sub(e).normalize(),qn.copy(this.origin).sub(Dr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ps),o=qn.dot(this.direction),u=-qn.dot(Ps),d=qn.lengthSq(),f=Math.abs(1-a*a);let m,g,_,x;if(f>0)if(m=a*u-o,g=a*o-u,x=r*f,m>=0)if(g>=-x)if(g<=x){const E=1/f;m*=E,g*=E,_=m*(m+a*g+2*o)+g*(a*m+g+2*u)+d}else g=r,m=Math.max(0,-(a*g+o)),_=-m*m+g*(g+2*u)+d;else g=-r,m=Math.max(0,-(a*g+o)),_=-m*m+g*(g+2*u)+d;else g<=-x?(m=Math.max(0,-(-a*r+o)),g=m>0?-r:Math.min(Math.max(-r,-u),r),_=-m*m+g*(g+2*u)+d):g<=x?(m=0,g=Math.min(Math.max(-r,-u),r),_=g*(g+2*u)+d):(m=Math.max(0,-(a*r+o)),g=m>0?r:Math.min(Math.max(-r,-u),r),_=-m*m+g*(g+2*u)+d);else g=a>0?-r:r,m=Math.max(0,-(a*g+o)),_=-m*m+g*(g+2*u)+d;return n&&n.copy(this.origin).addScaledVector(this.direction,m),s&&s.copy(Dr).addScaledVector(Ps,g),_}intersectSphere(e,t){Rn.subVectors(e.center,this.origin);const n=Rn.dot(this.direction),s=Rn.dot(Rn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,u=n+a;return u<0?null:o<0?this.at(u,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,u;const d=1/this.direction.x,f=1/this.direction.y,m=1/this.direction.z,g=this.origin;return d>=0?(n=(e.min.x-g.x)*d,s=(e.max.x-g.x)*d):(n=(e.max.x-g.x)*d,s=(e.min.x-g.x)*d),f>=0?(r=(e.min.y-g.y)*f,a=(e.max.y-g.y)*f):(r=(e.max.y-g.y)*f,a=(e.min.y-g.y)*f),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),m>=0?(o=(e.min.z-g.z)*m,u=(e.max.z-g.z)*m):(o=(e.max.z-g.z)*m,u=(e.min.z-g.z)*m),n>u||o>s)||((o>n||n!==n)&&(n=o),(u<s||s!==s)&&(s=u),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Rn)!==null}intersectTriangle(e,t,n,s,r){Ir.subVectors(t,e),Ls.subVectors(n,e),Ur.crossVectors(Ir,Ls);let a=this.direction.dot(Ur),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;qn.subVectors(this.origin,e);const u=o*this.direction.dot(Ls.crossVectors(qn,Ls));if(u<0)return null;const d=o*this.direction.dot(Ir.cross(qn));if(d<0||u+d>a)return null;const f=-o*qn.dot(Ur);return f<0?null:this.at(f/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,n,s,r,a,o,u,d,f,m,g,_,x,E,h){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,u,d,f,m,g,_,x,E,h)}set(e,t,n,s,r,a,o,u,d,f,m,g,_,x,E,h){const c=this.elements;return c[0]=e,c[4]=t,c[8]=n,c[12]=s,c[1]=r,c[5]=a,c[9]=o,c[13]=u,c[2]=d,c[6]=f,c[10]=m,c[14]=g,c[3]=_,c[7]=x,c[11]=E,c[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/Ci.setFromMatrixColumn(e,0).length(),r=1/Ci.setFromMatrixColumn(e,1).length(),a=1/Ci.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),u=Math.cos(s),d=Math.sin(s),f=Math.cos(r),m=Math.sin(r);if(e.order==="XYZ"){const g=a*f,_=a*m,x=o*f,E=o*m;t[0]=u*f,t[4]=-u*m,t[8]=d,t[1]=_+x*d,t[5]=g-E*d,t[9]=-o*u,t[2]=E-g*d,t[6]=x+_*d,t[10]=a*u}else if(e.order==="YXZ"){const g=u*f,_=u*m,x=d*f,E=d*m;t[0]=g+E*o,t[4]=x*o-_,t[8]=a*d,t[1]=a*m,t[5]=a*f,t[9]=-o,t[2]=_*o-x,t[6]=E+g*o,t[10]=a*u}else if(e.order==="ZXY"){const g=u*f,_=u*m,x=d*f,E=d*m;t[0]=g-E*o,t[4]=-a*m,t[8]=x+_*o,t[1]=_+x*o,t[5]=a*f,t[9]=E-g*o,t[2]=-a*d,t[6]=o,t[10]=a*u}else if(e.order==="ZYX"){const g=a*f,_=a*m,x=o*f,E=o*m;t[0]=u*f,t[4]=x*d-_,t[8]=g*d+E,t[1]=u*m,t[5]=E*d+g,t[9]=_*d-x,t[2]=-d,t[6]=o*u,t[10]=a*u}else if(e.order==="YZX"){const g=a*u,_=a*d,x=o*u,E=o*d;t[0]=u*f,t[4]=E-g*m,t[8]=x*m+_,t[1]=m,t[5]=a*f,t[9]=-o*f,t[2]=-d*f,t[6]=_*m+x,t[10]=g-E*m}else if(e.order==="XZY"){const g=a*u,_=a*d,x=o*u,E=o*d;t[0]=u*f,t[4]=-m,t[8]=d*f,t[1]=g*m+E,t[5]=a*f,t[9]=_*m-x,t[2]=x*m-_,t[6]=o*f,t[10]=E*m+g}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ru,e,Cu)}lookAt(e,t,n){const s=this.elements;return Qt.subVectors(e,t),Qt.lengthSq()===0&&(Qt.z=1),Qt.normalize(),Yn.crossVectors(n,Qt),Yn.lengthSq()===0&&(Math.abs(n.z)===1?Qt.x+=1e-4:Qt.z+=1e-4,Qt.normalize(),Yn.crossVectors(n,Qt)),Yn.normalize(),Ds.crossVectors(Qt,Yn),s[0]=Yn.x,s[4]=Ds.x,s[8]=Qt.x,s[1]=Yn.y,s[5]=Ds.y,s[9]=Qt.y,s[2]=Yn.z,s[6]=Ds.z,s[10]=Qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],u=n[8],d=n[12],f=n[1],m=n[5],g=n[9],_=n[13],x=n[2],E=n[6],h=n[10],c=n[14],b=n[3],R=n[7],T=n[11],F=n[15],D=s[0],I=s[4],P=s[8],p=s[12],v=s[1],A=s[5],C=s[9],H=s[13],X=s[2],j=s[6],$=s[10],ae=s[14],q=s[3],he=s[7],Me=s[11],ye=s[15];return r[0]=a*D+o*v+u*X+d*q,r[4]=a*I+o*A+u*j+d*he,r[8]=a*P+o*C+u*$+d*Me,r[12]=a*p+o*H+u*ae+d*ye,r[1]=f*D+m*v+g*X+_*q,r[5]=f*I+m*A+g*j+_*he,r[9]=f*P+m*C+g*$+_*Me,r[13]=f*p+m*H+g*ae+_*ye,r[2]=x*D+E*v+h*X+c*q,r[6]=x*I+E*A+h*j+c*he,r[10]=x*P+E*C+h*$+c*Me,r[14]=x*p+E*H+h*ae+c*ye,r[3]=b*D+R*v+T*X+F*q,r[7]=b*I+R*A+T*j+F*he,r[11]=b*P+R*C+T*$+F*Me,r[15]=b*p+R*H+T*ae+F*ye,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],u=e[9],d=e[13],f=e[2],m=e[6],g=e[10],_=e[14],x=e[3],E=e[7],h=e[11],c=e[15];return x*(+r*u*m-s*d*m-r*o*g+n*d*g+s*o*_-n*u*_)+E*(+t*u*_-t*d*g+r*a*g-s*a*_+s*d*f-r*u*f)+h*(+t*d*m-t*o*_-r*a*m+n*a*_+r*o*f-n*d*f)+c*(-s*o*f-t*u*m+t*o*g+s*a*m-n*a*g+n*u*f)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],u=e[6],d=e[7],f=e[8],m=e[9],g=e[10],_=e[11],x=e[12],E=e[13],h=e[14],c=e[15],b=m*h*d-E*g*d+E*u*_-o*h*_-m*u*c+o*g*c,R=x*g*d-f*h*d-x*u*_+a*h*_+f*u*c-a*g*c,T=f*E*d-x*m*d+x*o*_-a*E*_-f*o*c+a*m*c,F=x*m*u-f*E*u-x*o*g+a*E*g+f*o*h-a*m*h,D=t*b+n*R+s*T+r*F;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/D;return e[0]=b*I,e[1]=(E*g*r-m*h*r-E*s*_+n*h*_+m*s*c-n*g*c)*I,e[2]=(o*h*r-E*u*r+E*s*d-n*h*d-o*s*c+n*u*c)*I,e[3]=(m*u*r-o*g*r-m*s*d+n*g*d+o*s*_-n*u*_)*I,e[4]=R*I,e[5]=(f*h*r-x*g*r+x*s*_-t*h*_-f*s*c+t*g*c)*I,e[6]=(x*u*r-a*h*r-x*s*d+t*h*d+a*s*c-t*u*c)*I,e[7]=(a*g*r-f*u*r+f*s*d-t*g*d-a*s*_+t*u*_)*I,e[8]=T*I,e[9]=(x*m*r-f*E*r-x*n*_+t*E*_+f*n*c-t*m*c)*I,e[10]=(a*E*r-x*o*r+x*n*d-t*E*d-a*n*c+t*o*c)*I,e[11]=(f*o*r-a*m*r-f*n*d+t*m*d+a*n*_-t*o*_)*I,e[12]=F*I,e[13]=(f*E*s-x*m*s+x*n*g-t*E*g-f*n*h+t*m*h)*I,e[14]=(x*o*s-a*E*s-x*n*u+t*E*u+a*n*h-t*o*h)*I,e[15]=(a*m*s-f*o*s+f*n*u-t*m*u-a*n*g+t*o*g)*I,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,u=e.z,d=r*a,f=r*o;return this.set(d*a+n,d*o-s*u,d*u+s*o,0,d*o+s*u,f*o+n,f*u-s*a,0,d*u-s*o,f*u+s*a,r*u*u+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,u=t._w,d=r+r,f=a+a,m=o+o,g=r*d,_=r*f,x=r*m,E=a*f,h=a*m,c=o*m,b=u*d,R=u*f,T=u*m,F=n.x,D=n.y,I=n.z;return s[0]=(1-(E+c))*F,s[1]=(_+T)*F,s[2]=(x-R)*F,s[3]=0,s[4]=(_-T)*D,s[5]=(1-(g+c))*D,s[6]=(h+b)*D,s[7]=0,s[8]=(x+R)*I,s[9]=(h-b)*I,s[10]=(1-(g+E))*I,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=Ci.set(s[0],s[1],s[2]).length();const a=Ci.set(s[4],s[5],s[6]).length(),o=Ci.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],fn.copy(this);const d=1/r,f=1/a,m=1/o;return fn.elements[0]*=d,fn.elements[1]*=d,fn.elements[2]*=d,fn.elements[4]*=f,fn.elements[5]*=f,fn.elements[6]*=f,fn.elements[8]*=m,fn.elements[9]*=m,fn.elements[10]*=m,t.setFromRotationMatrix(fn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Un){const u=this.elements,d=2*r/(t-e),f=2*r/(n-s),m=(t+e)/(t-e),g=(n+s)/(n-s);let _,x;if(o===Un)_=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===tr)_=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return u[0]=d,u[4]=0,u[8]=m,u[12]=0,u[1]=0,u[5]=f,u[9]=g,u[13]=0,u[2]=0,u[6]=0,u[10]=_,u[14]=x,u[3]=0,u[7]=0,u[11]=-1,u[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Un){const u=this.elements,d=1/(t-e),f=1/(n-s),m=1/(a-r),g=(t+e)*d,_=(n+s)*f;let x,E;if(o===Un)x=(a+r)*m,E=-2*m;else if(o===tr)x=r*m,E=-1*m;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return u[0]=2*d,u[4]=0,u[8]=0,u[12]=-g,u[1]=0,u[5]=2*f,u[9]=0,u[13]=-_,u[2]=0,u[6]=0,u[10]=E,u[14]=-x,u[3]=0,u[7]=0,u[11]=0,u[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ci=new N,fn=new yt,Ru=new N(0,0,0),Cu=new N(1,1,1),Yn=new N,Ds=new N,Qt=new N,Fo=new yt,Oo=new vs;class On{constructor(e=0,t=0,n=0,s=On.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],u=s[1],d=s[5],f=s[9],m=s[2],g=s[6],_=s[10];switch(t){case"XYZ":this._y=Math.asin(Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-f,_),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(g,d),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(o,_),this._z=Math.atan2(u,d)):(this._y=Math.atan2(-m,r),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-m,_),this._z=Math.atan2(-a,d)):(this._y=0,this._z=Math.atan2(u,r));break;case"ZYX":this._y=Math.asin(-Yt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(g,_),this._z=Math.atan2(u,r)):(this._x=0,this._z=Math.atan2(-a,d));break;case"YZX":this._z=Math.asin(Yt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-f,d),this._y=Math.atan2(-m,r)):(this._x=0,this._y=Math.atan2(o,_));break;case"XZY":this._z=Math.asin(-Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(g,d),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-f,_),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Oo.setFromEuler(this),this.setFromQuaternion(Oo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}On.DEFAULT_ORDER="XYZ";class Zl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Pu=0;const Bo=new N,Pi=new vs,Cn=new yt,Is=new N,cs=new N,Lu=new N,Du=new vs,zo=new N(1,0,0),ko=new N(0,1,0),Ho=new N(0,0,1),Go={type:"added"},Iu={type:"removed"},Li={type:"childadded",child:null},Nr={type:"childremoved",child:null};class Ut extends es{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pu++}),this.uuid=_s(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ut.DEFAULT_UP.clone();const e=new N,t=new On,n=new vs,s=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new yt},normalMatrix:{value:new Ye}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Ut.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.premultiply(Pi),this}rotateX(e){return this.rotateOnAxis(zo,e)}rotateY(e){return this.rotateOnAxis(ko,e)}rotateZ(e){return this.rotateOnAxis(Ho,e)}translateOnAxis(e,t){return Bo.copy(e).applyQuaternion(this.quaternion),this.position.add(Bo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(zo,e)}translateY(e){return this.translateOnAxis(ko,e)}translateZ(e){return this.translateOnAxis(Ho,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Is.copy(e):Is.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(cs,Is,this.up):Cn.lookAt(Is,cs,this.up),this.quaternion.setFromRotationMatrix(Cn),s&&(Cn.extractRotation(s.matrixWorld),Pi.setFromRotationMatrix(Cn),this.quaternion.premultiply(Pi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Go),Li.child=e,this.dispatchEvent(Li),Li.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Iu),Nr.child=e,this.dispatchEvent(Nr),Nr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Cn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Cn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Go),Li.child=e,this.dispatchEvent(Li),Li.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,e,Lu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,Du,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,u){return o[u.uuid]===void 0&&(o[u.uuid]=u.toJSON(e)),u.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const u=o.shapes;if(Array.isArray(u))for(let d=0,f=u.length;d<f;d++){const m=u[d];r(e.shapes,m)}else r(e.shapes,u)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let u=0,d=this.material.length;u<d;u++)o.push(r(e.materials,this.material[u]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const u=this.animations[o];s.animations.push(r(e.animations,u))}}if(t){const o=a(e.geometries),u=a(e.materials),d=a(e.textures),f=a(e.images),m=a(e.shapes),g=a(e.skeletons),_=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),u.length>0&&(n.materials=u),d.length>0&&(n.textures=d),f.length>0&&(n.images=f),m.length>0&&(n.shapes=m),g.length>0&&(n.skeletons=g),_.length>0&&(n.animations=_),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){const u=[];for(const d in o){const f=o[d];delete f.metadata,u.push(f)}return u}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Ut.DEFAULT_UP=new N(0,1,0);Ut.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ut.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new N,Pn=new N,Fr=new N,Ln=new N,Di=new N,Ii=new N,Vo=new N,Or=new N,Br=new N,zr=new N,kr=new bt,Hr=new bt,Gr=new bt;class mn{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),hn.subVectors(e,t),s.cross(hn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){hn.subVectors(s,t),Pn.subVectors(n,t),Fr.subVectors(e,t);const a=hn.dot(hn),o=hn.dot(Pn),u=hn.dot(Fr),d=Pn.dot(Pn),f=Pn.dot(Fr),m=a*d-o*o;if(m===0)return r.set(0,0,0),null;const g=1/m,_=(d*u-o*f)*g,x=(a*f-o*u)*g;return r.set(1-_-x,x,_)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(e,t,n,s,r,a,o,u){return this.getBarycoord(e,t,n,s,Ln)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(r,Ln.x),u.addScaledVector(a,Ln.y),u.addScaledVector(o,Ln.z),u)}static getInterpolatedAttribute(e,t,n,s,r,a){return kr.setScalar(0),Hr.setScalar(0),Gr.setScalar(0),kr.fromBufferAttribute(e,t),Hr.fromBufferAttribute(e,n),Gr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(kr,r.x),a.addScaledVector(Hr,r.y),a.addScaledVector(Gr,r.z),a}static isFrontFacing(e,t,n,s){return hn.subVectors(n,t),Pn.subVectors(e,t),hn.cross(Pn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),hn.cross(Pn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return mn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Di.subVectors(s,n),Ii.subVectors(r,n),Or.subVectors(e,n);const u=Di.dot(Or),d=Ii.dot(Or);if(u<=0&&d<=0)return t.copy(n);Br.subVectors(e,s);const f=Di.dot(Br),m=Ii.dot(Br);if(f>=0&&m<=f)return t.copy(s);const g=u*m-f*d;if(g<=0&&u>=0&&f<=0)return a=u/(u-f),t.copy(n).addScaledVector(Di,a);zr.subVectors(e,r);const _=Di.dot(zr),x=Ii.dot(zr);if(x>=0&&_<=x)return t.copy(r);const E=_*d-u*x;if(E<=0&&d>=0&&x<=0)return o=d/(d-x),t.copy(n).addScaledVector(Ii,o);const h=f*x-_*m;if(h<=0&&m-f>=0&&_-x>=0)return Vo.subVectors(r,s),o=(m-f)/(m-f+(_-x)),t.copy(s).addScaledVector(Vo,o);const c=1/(h+E+g);return a=E*c,o=g*c,t.copy(n).addScaledVector(Di,a).addScaledVector(Ii,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Jl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},Us={h:0,s:0,l:0};function Vr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class _t{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=tn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,lt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=lt.workingColorSpace){return this.r=e,this.g=t,this.b=n,lt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=lt.workingColorSpace){if(e=gu(e,1),t=Yt(t,0,1),n=Yt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Vr(a,r,e+1/3),this.g=Vr(a,r,e),this.b=Vr(a,r,e-1/3)}return lt.toWorkingColorSpace(this,s),this}setStyle(e,t=tn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=tn){const n=Jl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=tn){return lt.fromWorkingColorSpace(Ot.copy(this),e),Math.round(Yt(Ot.r*255,0,255))*65536+Math.round(Yt(Ot.g*255,0,255))*256+Math.round(Yt(Ot.b*255,0,255))}getHexString(e=tn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=lt.workingColorSpace){lt.fromWorkingColorSpace(Ot.copy(this),t);const n=Ot.r,s=Ot.g,r=Ot.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let u,d;const f=(o+a)/2;if(o===a)u=0,d=0;else{const m=a-o;switch(d=f<=.5?m/(a+o):m/(2-a-o),a){case n:u=(s-r)/m+(s<r?6:0);break;case s:u=(r-n)/m+2;break;case r:u=(n-s)/m+4;break}u/=6}return e.h=u,e.s=d,e.l=f,e}getRGB(e,t=lt.workingColorSpace){return lt.fromWorkingColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=tn){lt.fromWorkingColorSpace(Ot.copy(this),e);const t=Ot.r,n=Ot.g,s=Ot.b;return e!==tn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL($n),this.setHSL($n.h+e,$n.s+t,$n.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL($n),e.getHSL(Us);const n=Ar($n.h,Us.h,t),s=Ar($n.s,Us.s,t),r=Ar($n.l,Us.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ot=new _t;_t.NAMES=Jl;let Uu=0;class or extends es{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uu++}),this.uuid=_s(),this.name="",this.blending=Vi,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ia,this.blendDst=sa,this.blendEquation=gi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ao,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ti,this.stencilZFail=Ti,this.stencilZPass=Ti,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ia&&(n.blendSrc=this.blendSrc),this.blendDst!==sa&&(n.blendDst=this.blendDst),this.blendEquation!==gi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ao&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ti&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ti&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ti&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const u=r[o];delete u.metadata,a.push(u)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ja extends or{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=Nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new N,Ns=new dt;class Tn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=wo,this.updateRanges=[],this.gpuType=In,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ns.fromBufferAttribute(this,t),Ns.applyMatrix3(e),this.setXY(t,Ns.x,Ns.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=as(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=as(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=as(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=as(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=as(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),n=qt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),n=qt(n,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),n=qt(n,this.array),s=qt(s,this.array),r=qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==wo&&(e.usage=this.usage),e}}class Ql extends Tn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ec extends Tn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ct extends Tn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Nu=0;const an=new yt,Wr=new Ut,Ui=new N,en=new xs,us=new xs,Dt=new N;class vn extends es{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nu++}),this.uuid=_s(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($l(e)?ec:Ql)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return an.makeRotationFromQuaternion(e),this.applyMatrix4(an),this}rotateX(e){return an.makeRotationX(e),this.applyMatrix4(an),this}rotateY(e){return an.makeRotationY(e),this.applyMatrix4(an),this}rotateZ(e){return an.makeRotationZ(e),this.applyMatrix4(an),this}translate(e,t,n){return an.makeTranslation(e,t,n),this.applyMatrix4(an),this}scale(e,t,n){return an.makeScale(e,t,n),this.applyMatrix4(an),this}lookAt(e){return Wr.lookAt(e),Wr.updateMatrix(),this.applyMatrix4(Wr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ui).negate(),this.translate(Ui.x,Ui.y,Ui.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ct(n,3))}else{for(let n=0,s=t.count;n<s;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];en.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Za);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){const n=this.boundingSphere.center;if(en.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];us.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(en.min,us.min),en.expandByPoint(Dt),Dt.addVectors(en.max,us.max),en.expandByPoint(Dt)):(en.expandByPoint(us.min),en.expandByPoint(us.max))}en.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Dt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Dt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],u=this.morphTargetsRelative;for(let d=0,f=o.count;d<f;d++)Dt.fromBufferAttribute(o,d),u&&(Ui.fromBufferAttribute(e,d),Dt.add(Ui)),s=Math.max(s,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],u=[];for(let P=0;P<n.count;P++)o[P]=new N,u[P]=new N;const d=new N,f=new N,m=new N,g=new dt,_=new dt,x=new dt,E=new N,h=new N;function c(P,p,v){d.fromBufferAttribute(n,P),f.fromBufferAttribute(n,p),m.fromBufferAttribute(n,v),g.fromBufferAttribute(r,P),_.fromBufferAttribute(r,p),x.fromBufferAttribute(r,v),f.sub(d),m.sub(d),_.sub(g),x.sub(g);const A=1/(_.x*x.y-x.x*_.y);isFinite(A)&&(E.copy(f).multiplyScalar(x.y).addScaledVector(m,-_.y).multiplyScalar(A),h.copy(m).multiplyScalar(_.x).addScaledVector(f,-x.x).multiplyScalar(A),o[P].add(E),o[p].add(E),o[v].add(E),u[P].add(h),u[p].add(h),u[v].add(h))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let P=0,p=b.length;P<p;++P){const v=b[P],A=v.start,C=v.count;for(let H=A,X=A+C;H<X;H+=3)c(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const R=new N,T=new N,F=new N,D=new N;function I(P){F.fromBufferAttribute(s,P),D.copy(F);const p=o[P];R.copy(p),R.sub(F.multiplyScalar(F.dot(p))).normalize(),T.crossVectors(D,p);const A=T.dot(u[P])<0?-1:1;a.setXYZW(P,R.x,R.y,R.z,A)}for(let P=0,p=b.length;P<p;++P){const v=b[P],A=v.start,C=v.count;for(let H=A,X=A+C;H<X;H+=3)I(e.getX(H+0)),I(e.getX(H+1)),I(e.getX(H+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Tn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let g=0,_=n.count;g<_;g++)n.setXYZ(g,0,0,0);const s=new N,r=new N,a=new N,o=new N,u=new N,d=new N,f=new N,m=new N;if(e)for(let g=0,_=e.count;g<_;g+=3){const x=e.getX(g+0),E=e.getX(g+1),h=e.getX(g+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,E),a.fromBufferAttribute(t,h),f.subVectors(a,r),m.subVectors(s,r),f.cross(m),o.fromBufferAttribute(n,x),u.fromBufferAttribute(n,E),d.fromBufferAttribute(n,h),o.add(f),u.add(f),d.add(f),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(E,u.x,u.y,u.z),n.setXYZ(h,d.x,d.y,d.z)}else for(let g=0,_=t.count;g<_;g+=3)s.fromBufferAttribute(t,g+0),r.fromBufferAttribute(t,g+1),a.fromBufferAttribute(t,g+2),f.subVectors(a,r),m.subVectors(s,r),f.cross(m),n.setXYZ(g+0,f.x,f.y,f.z),n.setXYZ(g+1,f.x,f.y,f.z),n.setXYZ(g+2,f.x,f.y,f.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,u){const d=o.array,f=o.itemSize,m=o.normalized,g=new d.constructor(u.length*f);let _=0,x=0;for(let E=0,h=u.length;E<h;E++){o.isInterleavedBufferAttribute?_=u[E]*o.data.stride+o.offset:_=u[E]*f;for(let c=0;c<f;c++)g[x++]=d[_++]}return new Tn(g,f,m)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vn,n=this.index.array,s=this.attributes;for(const o in s){const u=s[o],d=e(u,n);t.setAttribute(o,d)}const r=this.morphAttributes;for(const o in r){const u=[],d=r[o];for(let f=0,m=d.length;f<m;f++){const g=d[f],_=e(g,n);u.push(_)}t.morphAttributes[o]=u}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,u=a.length;o<u;o++){const d=a[o];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const u=this.parameters;for(const d in u)u[d]!==void 0&&(e[d]=u[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const u in n){const d=n[u];e.data.attributes[u]=d.toJSON(e.data)}const s={};let r=!1;for(const u in this.morphAttributes){const d=this.morphAttributes[u],f=[];for(let m=0,g=d.length;m<g;m++){const _=d[m];f.push(_.toJSON(e.data))}f.length>0&&(s[u]=f,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const d in s){const f=s[d];this.setAttribute(d,f.clone(t))}const r=e.morphAttributes;for(const d in r){const f=[],m=r[d];for(let g=0,_=m.length;g<_;g++)f.push(m[g].clone(t));this.morphAttributes[d]=f}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let d=0,f=a.length;d<f;d++){const m=a[d];this.addGroup(m.start,m.count,m.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Wo=new yt,ui=new wu,Fs=new Za,Xo=new N,Os=new N,Bs=new N,zs=new N,Xr=new N,ks=new N,qo=new N,Hs=new N;class Et extends Ut{constructor(e=new vn,t=new Ja){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ks.set(0,0,0);for(let u=0,d=r.length;u<d;u++){const f=o[u],m=r[u];f!==0&&(Xr.fromBufferAttribute(m,e),a?ks.addScaledVector(Xr,f):ks.addScaledVector(Xr.sub(t),f))}t.add(ks)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fs.copy(n.boundingSphere),Fs.applyMatrix4(r),ui.copy(e.ray).recast(e.near),!(Fs.containsPoint(ui.origin)===!1&&(ui.intersectSphere(Fs,Xo)===null||ui.origin.distanceToSquared(Xo)>(e.far-e.near)**2))&&(Wo.copy(r).invert(),ui.copy(e.ray).applyMatrix4(Wo),!(n.boundingBox!==null&&ui.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ui)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,u=r.attributes.position,d=r.attributes.uv,f=r.attributes.uv1,m=r.attributes.normal,g=r.groups,_=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,E=g.length;x<E;x++){const h=g[x],c=a[h.materialIndex],b=Math.max(h.start,_.start),R=Math.min(o.count,Math.min(h.start+h.count,_.start+_.count));for(let T=b,F=R;T<F;T+=3){const D=o.getX(T),I=o.getX(T+1),P=o.getX(T+2);s=Gs(this,c,e,n,d,f,m,D,I,P),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=h.materialIndex,t.push(s))}}else{const x=Math.max(0,_.start),E=Math.min(o.count,_.start+_.count);for(let h=x,c=E;h<c;h+=3){const b=o.getX(h),R=o.getX(h+1),T=o.getX(h+2);s=Gs(this,a,e,n,d,f,m,b,R,T),s&&(s.faceIndex=Math.floor(h/3),t.push(s))}}else if(u!==void 0)if(Array.isArray(a))for(let x=0,E=g.length;x<E;x++){const h=g[x],c=a[h.materialIndex],b=Math.max(h.start,_.start),R=Math.min(u.count,Math.min(h.start+h.count,_.start+_.count));for(let T=b,F=R;T<F;T+=3){const D=T,I=T+1,P=T+2;s=Gs(this,c,e,n,d,f,m,D,I,P),s&&(s.faceIndex=Math.floor(T/3),s.face.materialIndex=h.materialIndex,t.push(s))}}else{const x=Math.max(0,_.start),E=Math.min(u.count,_.start+_.count);for(let h=x,c=E;h<c;h+=3){const b=h,R=h+1,T=h+2;s=Gs(this,a,e,n,d,f,m,b,R,T),s&&(s.faceIndex=Math.floor(h/3),t.push(s))}}}}function Fu(i,e,t,n,s,r,a,o){let u;if(e.side===$t?u=n.intersectTriangle(a,r,s,!0,o):u=n.intersectTriangle(s,r,a,e.side===Qn,o),u===null)return null;Hs.copy(o),Hs.applyMatrix4(i.matrixWorld);const d=t.ray.origin.distanceTo(Hs);return d<t.near||d>t.far?null:{distance:d,point:Hs.clone(),object:i}}function Gs(i,e,t,n,s,r,a,o,u,d){i.getVertexPosition(o,Os),i.getVertexPosition(u,Bs),i.getVertexPosition(d,zs);const f=Fu(i,e,t,n,Os,Bs,zs,qo);if(f){const m=new N;mn.getBarycoord(qo,Os,Bs,zs,m),s&&(f.uv=mn.getInterpolatedAttribute(s,o,u,d,m,new dt)),r&&(f.uv1=mn.getInterpolatedAttribute(r,o,u,d,m,new dt)),a&&(f.normal=mn.getInterpolatedAttribute(a,o,u,d,m,new N),f.normal.dot(n.direction)>0&&f.normal.multiplyScalar(-1));const g={a:o,b:u,c:d,normal:new N,materialIndex:0};mn.getNormal(Os,Bs,zs,g.normal),f.face=g,f.barycoord=m}return f}class ts extends vn{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const u=[],d=[],f=[],m=[];let g=0,_=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(u),this.setAttribute("position",new Ct(d,3)),this.setAttribute("normal",new Ct(f,3)),this.setAttribute("uv",new Ct(m,2));function x(E,h,c,b,R,T,F,D,I,P,p){const v=T/I,A=F/P,C=T/2,H=F/2,X=D/2,j=I+1,$=P+1;let ae=0,q=0;const he=new N;for(let Me=0;Me<$;Me++){const ye=Me*A-H;for(let Ce=0;Ce<j;Ce++){const rt=Ce*v-C;he[E]=rt*b,he[h]=ye*R,he[c]=X,d.push(he.x,he.y,he.z),he[E]=0,he[h]=0,he[c]=D>0?1:-1,f.push(he.x,he.y,he.z),m.push(Ce/I),m.push(1-Me/P),ae+=1}}for(let Me=0;Me<P;Me++)for(let ye=0;ye<I;ye++){const Ce=g+ye+j*Me,rt=g+ye+j*(Me+1),Z=g+(ye+1)+j*(Me+1),ce=g+(ye+1)+j*Me;u.push(Ce,rt,ce),u.push(rt,Z,ce),q+=6}o.addGroup(_,q,p),_+=q,g+=ae}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ts(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Zi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ht(i){const e={};for(let t=0;t<i.length;t++){const n=Zi(i[t]);for(const s in n)e[s]=n[s]}return e}function Ou(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function tc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:lt.workingColorSpace}const Bu={clone:Zi,merge:Ht};var zu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ku=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bn extends or{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zu,this.fragmentShader=ku,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zi(e.uniforms),this.uniformsGroups=Ou(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class nc extends Ut{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Kn=new N,Yo=new dt,$o=new dt;class on extends nc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ga*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(br*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ga*2*Math.atan(Math.tan(br*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z)}getViewSize(e,t){return this.getViewBounds(e,Yo,$o),t.subVectors($o,Yo)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(br*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const u=a.fullWidth,d=a.fullHeight;r+=a.offsetX*s/u,t-=a.offsetY*n/d,s*=a.width/u,n*=a.height/d}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ni=-90,Fi=1;class Hu extends Ut{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new on(Ni,Fi,e,t);s.layers=this.layers,this.add(s);const r=new on(Ni,Fi,e,t);r.layers=this.layers,this.add(r);const a=new on(Ni,Fi,e,t);a.layers=this.layers,this.add(a);const o=new on(Ni,Fi,e,t);o.layers=this.layers,this.add(o);const u=new on(Ni,Fi,e,t);u.layers=this.layers,this.add(u);const d=new on(Ni,Fi,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,u]=t;for(const d of t)this.remove(d);if(e===Un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===tr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,u,d,f]=this.children,m=e.getRenderTarget(),g=e.getActiveCubeFace(),_=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const E=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,u),e.setRenderTarget(n,4,s),e.render(t,d),n.texture.generateMipmaps=E,e.setRenderTarget(n,5,s),e.render(t,f),e.setRenderTarget(m,g,_),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class ic extends Vt{constructor(e,t,n,s,r,a,o,u,d,f){e=e!==void 0?e:[],t=t!==void 0?t:Yi,super(e,t,n,s,r,a,o,u,d,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gu extends ti{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ic(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:gn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ts(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:Zi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$t,blending:Zn});r.uniforms.tEquirect.value=t;const a=new Et(s,r),o=t.minFilter;return t.minFilter===xi&&(t.minFilter=gn),new Hu(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}const qr=new N,Vu=new N,Wu=new Ye;class pi{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=qr.subVectors(n,t).cross(Vu.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(qr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Wu.getNormalMatrix(e),s=this.coplanarPoint(qr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const di=new Za,Vs=new N;class sc{constructor(e=new pi,t=new pi,n=new pi,s=new pi,r=new pi,a=new pi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Un){const n=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],u=s[3],d=s[4],f=s[5],m=s[6],g=s[7],_=s[8],x=s[9],E=s[10],h=s[11],c=s[12],b=s[13],R=s[14],T=s[15];if(n[0].setComponents(u-r,g-d,h-_,T-c).normalize(),n[1].setComponents(u+r,g+d,h+_,T+c).normalize(),n[2].setComponents(u+a,g+f,h+x,T+b).normalize(),n[3].setComponents(u-a,g-f,h-x,T-b).normalize(),n[4].setComponents(u-o,g-m,h-E,T-R).normalize(),t===Un)n[5].setComponents(u+o,g+m,h+E,T+R).normalize();else if(t===tr)n[5].setComponents(o,m,E,R).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(e){return di.center.set(0,0,0),di.radius=.7071067811865476,di.applyMatrix4(e.matrixWorld),this.intersectsSphere(di)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Vs.x=s.normal.x>0?e.max.x:e.min.x,Vs.y=s.normal.y>0?e.max.y:e.min.y,Vs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Vs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function rc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Xu(i){const e=new WeakMap;function t(o,u){const d=o.array,f=o.usage,m=d.byteLength,g=i.createBuffer();i.bindBuffer(u,g),i.bufferData(u,d,f),o.onUploadCallback();let _;if(d instanceof Float32Array)_=i.FLOAT;else if(d instanceof Uint16Array)o.isFloat16BufferAttribute?_=i.HALF_FLOAT:_=i.UNSIGNED_SHORT;else if(d instanceof Int16Array)_=i.SHORT;else if(d instanceof Uint32Array)_=i.UNSIGNED_INT;else if(d instanceof Int32Array)_=i.INT;else if(d instanceof Int8Array)_=i.BYTE;else if(d instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:_,bytesPerElement:d.BYTES_PER_ELEMENT,version:o.version,size:m}}function n(o,u,d){const f=u.array,m=u.updateRanges;if(i.bindBuffer(d,o),m.length===0)i.bufferSubData(d,0,f);else{m.sort((_,x)=>_.start-x.start);let g=0;for(let _=1;_<m.length;_++){const x=m[g],E=m[_];E.start<=x.start+x.count+1?x.count=Math.max(x.count,E.start+E.count-x.start):(++g,m[g]=E)}m.length=g+1;for(let _=0,x=m.length;_<x;_++){const E=m[_];i.bufferSubData(d,E.start*f.BYTES_PER_ELEMENT,f,E.start,E.count)}u.clearUpdateRanges()}u.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const u=e.get(o);u&&(i.deleteBuffer(u.buffer),e.delete(o))}function a(o,u){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const f=e.get(o);(!f||f.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const d=e.get(o);if(d===void 0)e.set(o,t(o,u));else if(d.version<o.version){if(d.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(d.buffer,o,u),d.version=o.version}}return{get:s,remove:r,update:a}}class Mi extends vn{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),u=Math.floor(s),d=o+1,f=u+1,m=e/o,g=t/u,_=[],x=[],E=[],h=[];for(let c=0;c<f;c++){const b=c*g-a;for(let R=0;R<d;R++){const T=R*m-r;x.push(T,-b,0),E.push(0,0,1),h.push(R/o),h.push(1-c/u)}}for(let c=0;c<u;c++)for(let b=0;b<o;b++){const R=b+d*c,T=b+d*(c+1),F=b+1+d*(c+1),D=b+1+d*c;_.push(R,T,D),_.push(T,F,D)}this.setIndex(_),this.setAttribute("position",new Ct(x,3)),this.setAttribute("normal",new Ct(E,3)),this.setAttribute("uv",new Ct(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mi(e.width,e.height,e.widthSegments,e.heightSegments)}}var qu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,$u=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ku=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ju=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ju=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ed=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,td=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,nd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,id=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,rd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ad=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,od=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,ld=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ud=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,pd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,md=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_d=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Md=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ed="gl_FragColor = linearToOutputTexel( gl_FragColor );",yd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Td=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ad=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Cd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Pd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ld=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Id=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ud=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Fd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Od=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Bd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,$d=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qd=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ef=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,tf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,af=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,of=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,cf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,df=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ff=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,gf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,_f=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,vf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,xf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Mf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ef=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Tf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Af=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Cf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Pf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Lf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Df=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,If=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Uf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ff=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Of=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,kf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Xf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const qf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Qf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,eh=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,th=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,nh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ih=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sh=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rh=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ah=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,oh=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lh=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ch=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uh=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dh=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fh=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hh=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ph=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mh=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gh=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,_h=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vh=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xh=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mh=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Sh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Eh=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yh=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Th=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bh=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ze={alphahash_fragment:qu,alphahash_pars_fragment:Yu,alphamap_fragment:$u,alphamap_pars_fragment:Ku,alphatest_fragment:ju,alphatest_pars_fragment:Zu,aomap_fragment:Ju,aomap_pars_fragment:Qu,batching_pars_vertex:ed,batching_vertex:td,begin_vertex:nd,beginnormal_vertex:id,bsdfs:sd,iridescence_fragment:rd,bumpmap_pars_fragment:ad,clipping_planes_fragment:od,clipping_planes_pars_fragment:ld,clipping_planes_pars_vertex:cd,clipping_planes_vertex:ud,color_fragment:dd,color_pars_fragment:fd,color_pars_vertex:hd,color_vertex:pd,common:md,cube_uv_reflection_fragment:gd,defaultnormal_vertex:_d,displacementmap_pars_vertex:vd,displacementmap_vertex:xd,emissivemap_fragment:Md,emissivemap_pars_fragment:Sd,colorspace_fragment:Ed,colorspace_pars_fragment:yd,envmap_fragment:Td,envmap_common_pars_fragment:bd,envmap_pars_fragment:Ad,envmap_pars_vertex:wd,envmap_physical_pars_fragment:Bd,envmap_vertex:Rd,fog_vertex:Cd,fog_pars_vertex:Pd,fog_fragment:Ld,fog_pars_fragment:Dd,gradientmap_pars_fragment:Id,lightmap_pars_fragment:Ud,lights_lambert_fragment:Nd,lights_lambert_pars_fragment:Fd,lights_pars_begin:Od,lights_toon_fragment:zd,lights_toon_pars_fragment:kd,lights_phong_fragment:Hd,lights_phong_pars_fragment:Gd,lights_physical_fragment:Vd,lights_physical_pars_fragment:Wd,lights_fragment_begin:Xd,lights_fragment_maps:qd,lights_fragment_end:Yd,logdepthbuf_fragment:$d,logdepthbuf_pars_fragment:Kd,logdepthbuf_pars_vertex:jd,logdepthbuf_vertex:Zd,map_fragment:Jd,map_pars_fragment:Qd,map_particle_fragment:ef,map_particle_pars_fragment:tf,metalnessmap_fragment:nf,metalnessmap_pars_fragment:sf,morphinstance_vertex:rf,morphcolor_vertex:af,morphnormal_vertex:of,morphtarget_pars_vertex:lf,morphtarget_vertex:cf,normal_fragment_begin:uf,normal_fragment_maps:df,normal_pars_fragment:ff,normal_pars_vertex:hf,normal_vertex:pf,normalmap_pars_fragment:mf,clearcoat_normal_fragment_begin:gf,clearcoat_normal_fragment_maps:_f,clearcoat_pars_fragment:vf,iridescence_pars_fragment:xf,opaque_fragment:Mf,packing:Sf,premultiplied_alpha_fragment:Ef,project_vertex:yf,dithering_fragment:Tf,dithering_pars_fragment:bf,roughnessmap_fragment:Af,roughnessmap_pars_fragment:wf,shadowmap_pars_fragment:Rf,shadowmap_pars_vertex:Cf,shadowmap_vertex:Pf,shadowmask_pars_fragment:Lf,skinbase_vertex:Df,skinning_pars_vertex:If,skinning_vertex:Uf,skinnormal_vertex:Nf,specularmap_fragment:Ff,specularmap_pars_fragment:Of,tonemapping_fragment:Bf,tonemapping_pars_fragment:zf,transmission_fragment:kf,transmission_pars_fragment:Hf,uv_pars_fragment:Gf,uv_pars_vertex:Vf,uv_vertex:Wf,worldpos_vertex:Xf,background_vert:qf,background_frag:Yf,backgroundCube_vert:$f,backgroundCube_frag:Kf,cube_vert:jf,cube_frag:Zf,depth_vert:Jf,depth_frag:Qf,distanceRGBA_vert:eh,distanceRGBA_frag:th,equirect_vert:nh,equirect_frag:ih,linedashed_vert:sh,linedashed_frag:rh,meshbasic_vert:ah,meshbasic_frag:oh,meshlambert_vert:lh,meshlambert_frag:ch,meshmatcap_vert:uh,meshmatcap_frag:dh,meshnormal_vert:fh,meshnormal_frag:hh,meshphong_vert:ph,meshphong_frag:mh,meshphysical_vert:gh,meshphysical_frag:_h,meshtoon_vert:vh,meshtoon_frag:xh,points_vert:Mh,points_frag:Sh,shadow_vert:Eh,shadow_frag:yh,sprite_vert:Th,sprite_frag:bh},ge={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},yn={basic:{uniforms:Ht([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:Ht([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new _t(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:Ht([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:Ht([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:Ht([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new _t(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:Ht([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:Ht([ge.points,ge.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:Ht([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:Ht([ge.common,ge.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:Ht([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:Ht([ge.sprite,ge.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:Ht([ge.common,ge.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:Ht([ge.lights,ge.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};yn.physical={uniforms:Ht([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};const Ws={r:0,b:0,g:0},fi=new On,Ah=new yt;function wh(i,e,t,n,s,r,a){const o=new _t(0);let u=r===!0?0:1,d,f,m=null,g=0,_=null;function x(b){let R=b.isScene===!0?b.background:null;return R&&R.isTexture&&(R=(b.backgroundBlurriness>0?t:e).get(R)),R}function E(b){let R=!1;const T=x(b);T===null?c(o,u):T&&T.isColor&&(c(T,1),R=!0);const F=i.xr.getEnvironmentBlendMode();F==="additive"?n.buffers.color.setClear(0,0,0,1,a):F==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||R)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function h(b,R){const T=x(R);T&&(T.isCubeTexture||T.mapping===rr)?(f===void 0&&(f=new Et(new ts(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Zi(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:$t,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(F,D,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(f)),fi.copy(R.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),f.material.uniforms.envMap.value=T,f.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=R.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(Ah.makeRotationFromEuler(fi)),f.material.toneMapped=lt.getTransfer(T.colorSpace)!==gt,(m!==T||g!==T.version||_!==i.toneMapping)&&(f.material.needsUpdate=!0,m=T,g=T.version,_=i.toneMapping),f.layers.enableAll(),b.unshift(f,f.geometry,f.material,0,0,null)):T&&T.isTexture&&(d===void 0&&(d=new Et(new Mi(2,2),new bn({name:"BackgroundMaterial",uniforms:Zi(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(d)),d.material.uniforms.t2D.value=T,d.material.uniforms.backgroundIntensity.value=R.backgroundIntensity,d.material.toneMapped=lt.getTransfer(T.colorSpace)!==gt,T.matrixAutoUpdate===!0&&T.updateMatrix(),d.material.uniforms.uvTransform.value.copy(T.matrix),(m!==T||g!==T.version||_!==i.toneMapping)&&(d.material.needsUpdate=!0,m=T,g=T.version,_=i.toneMapping),d.layers.enableAll(),b.unshift(d,d.geometry,d.material,0,0,null))}function c(b,R){b.getRGB(Ws,tc(i)),n.buffers.color.setClear(Ws.r,Ws.g,Ws.b,R,a)}return{getClearColor:function(){return o},setClearColor:function(b,R=1){o.set(b),u=R,c(o,u)},getClearAlpha:function(){return u},setClearAlpha:function(b){u=b,c(o,u)},render:E,addToRenderList:h}}function Rh(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=g(null);let r=s,a=!1;function o(v,A,C,H,X){let j=!1;const $=m(H,C,A);r!==$&&(r=$,d(r.object)),j=_(v,H,C,X),j&&x(v,H,C,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,T(v,A,C,H),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function u(){return i.createVertexArray()}function d(v){return i.bindVertexArray(v)}function f(v){return i.deleteVertexArray(v)}function m(v,A,C){const H=C.wireframe===!0;let X=n[v.id];X===void 0&&(X={},n[v.id]=X);let j=X[A.id];j===void 0&&(j={},X[A.id]=j);let $=j[H];return $===void 0&&($=g(u()),j[H]=$),$}function g(v){const A=[],C=[],H=[];for(let X=0;X<t;X++)A[X]=0,C[X]=0,H[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:C,attributeDivisors:H,object:v,attributes:{},index:null}}function _(v,A,C,H){const X=r.attributes,j=A.attributes;let $=0;const ae=C.getAttributes();for(const q in ae)if(ae[q].location>=0){const Me=X[q];let ye=j[q];if(ye===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(ye=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(ye=v.instanceColor)),Me===void 0||Me.attribute!==ye||ye&&Me.data!==ye.data)return!0;$++}return r.attributesNum!==$||r.index!==H}function x(v,A,C,H){const X={},j=A.attributes;let $=0;const ae=C.getAttributes();for(const q in ae)if(ae[q].location>=0){let Me=j[q];Me===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(Me=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(Me=v.instanceColor));const ye={};ye.attribute=Me,Me&&Me.data&&(ye.data=Me.data),X[q]=ye,$++}r.attributes=X,r.attributesNum=$,r.index=H}function E(){const v=r.newAttributes;for(let A=0,C=v.length;A<C;A++)v[A]=0}function h(v){c(v,0)}function c(v,A){const C=r.newAttributes,H=r.enabledAttributes,X=r.attributeDivisors;C[v]=1,H[v]===0&&(i.enableVertexAttribArray(v),H[v]=1),X[v]!==A&&(i.vertexAttribDivisor(v,A),X[v]=A)}function b(){const v=r.newAttributes,A=r.enabledAttributes;for(let C=0,H=A.length;C<H;C++)A[C]!==v[C]&&(i.disableVertexAttribArray(C),A[C]=0)}function R(v,A,C,H,X,j,$){$===!0?i.vertexAttribIPointer(v,A,C,X,j):i.vertexAttribPointer(v,A,C,H,X,j)}function T(v,A,C,H){E();const X=H.attributes,j=C.getAttributes(),$=A.defaultAttributeValues;for(const ae in j){const q=j[ae];if(q.location>=0){let he=X[ae];if(he===void 0&&(ae==="instanceMatrix"&&v.instanceMatrix&&(he=v.instanceMatrix),ae==="instanceColor"&&v.instanceColor&&(he=v.instanceColor)),he!==void 0){const Me=he.normalized,ye=he.itemSize,Ce=e.get(he);if(Ce===void 0)continue;const rt=Ce.buffer,Z=Ce.type,ce=Ce.bytesPerElement,Pe=Z===i.INT||Z===i.UNSIGNED_INT||he.gpuType===Xa;if(he.isInterleavedBufferAttribute){const de=he.data,ze=de.stride,Xe=he.offset;if(de.isInstancedInterleavedBuffer){for(let Ke=0;Ke<q.locationSize;Ke++)c(q.location+Ke,de.meshPerAttribute);v.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Ke=0;Ke<q.locationSize;Ke++)h(q.location+Ke);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let Ke=0;Ke<q.locationSize;Ke++)R(q.location+Ke,ye/q.locationSize,Z,Me,ze*ce,(Xe+ye/q.locationSize*Ke)*ce,Pe)}else{if(he.isInstancedBufferAttribute){for(let de=0;de<q.locationSize;de++)c(q.location+de,he.meshPerAttribute);v.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let de=0;de<q.locationSize;de++)h(q.location+de);i.bindBuffer(i.ARRAY_BUFFER,rt);for(let de=0;de<q.locationSize;de++)R(q.location+de,ye/q.locationSize,Z,Me,ye*ce,ye/q.locationSize*de*ce,Pe)}}else if($!==void 0){const Me=$[ae];if(Me!==void 0)switch(Me.length){case 2:i.vertexAttrib2fv(q.location,Me);break;case 3:i.vertexAttrib3fv(q.location,Me);break;case 4:i.vertexAttrib4fv(q.location,Me);break;default:i.vertexAttrib1fv(q.location,Me)}}}}b()}function F(){P();for(const v in n){const A=n[v];for(const C in A){const H=A[C];for(const X in H)f(H[X].object),delete H[X];delete A[C]}delete n[v]}}function D(v){if(n[v.id]===void 0)return;const A=n[v.id];for(const C in A){const H=A[C];for(const X in H)f(H[X].object),delete H[X];delete A[C]}delete n[v.id]}function I(v){for(const A in n){const C=n[A];if(C[v.id]===void 0)continue;const H=C[v.id];for(const X in H)f(H[X].object),delete H[X];delete C[v.id]}}function P(){p(),a=!0,r!==s&&(r=s,d(r.object))}function p(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:p,dispose:F,releaseStatesOfGeometry:D,releaseStatesOfProgram:I,initAttributes:E,enableAttribute:h,disableUnusedAttributes:b}}function Ch(i,e,t){let n;function s(d){n=d}function r(d,f){i.drawArrays(n,d,f),t.update(f,n,1)}function a(d,f,m){m!==0&&(i.drawArraysInstanced(n,d,f,m),t.update(f,n,m))}function o(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,d,0,f,0,m);let _=0;for(let x=0;x<m;x++)_+=f[x];t.update(_,n,1)}function u(d,f,m,g){if(m===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let x=0;x<d.length;x++)a(d[x],f[x],g[x]);else{_.multiDrawArraysInstancedWEBGL(n,d,0,f,0,g,0,m);let x=0;for(let E=0;E<m;E++)x+=f[E]*g[E];t.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=u}function Ph(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==_n&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){const P=I===Ji&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(I!==Fn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==In&&!P)}function u(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const f=u(d);f!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",f,"instead."),d=f);const m=t.logarithmicDepthBuffer===!0,g=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),_=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=i.getParameter(i.MAX_TEXTURE_SIZE),h=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),c=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),R=i.getParameter(i.MAX_VARYING_VECTORS),T=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),F=x>0,D=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:u,textureFormatReadable:a,textureTypeReadable:o,precision:d,logarithmicDepthBuffer:m,reverseDepthBuffer:g,maxTextures:_,maxVertexTextures:x,maxTextureSize:E,maxCubemapSize:h,maxAttributes:c,maxVertexUniforms:b,maxVaryings:R,maxFragmentUniforms:T,vertexTextures:F,maxSamples:D}}function Lh(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new pi,o=new Ye,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(m,g){const _=m.length!==0||g||n!==0||s;return s=g,n=m.length,_},this.beginShadows=function(){r=!0,f(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(m,g){t=f(m,g,0)},this.setState=function(m,g,_){const x=m.clippingPlanes,E=m.clipIntersection,h=m.clipShadows,c=i.get(m);if(!s||x===null||x.length===0||r&&!h)r?f(null):d();else{const b=r?0:n,R=b*4;let T=c.clippingState||null;u.value=T,T=f(x,g,R,_);for(let F=0;F!==R;++F)T[F]=t[F];c.clippingState=T,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=b}};function d(){u.value!==t&&(u.value=t,u.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function f(m,g,_,x){const E=m!==null?m.length:0;let h=null;if(E!==0){if(h=u.value,x!==!0||h===null){const c=_+E*4,b=g.matrixWorldInverse;o.getNormalMatrix(b),(h===null||h.length<c)&&(h=new Float32Array(c));for(let R=0,T=_;R!==E;++R,T+=4)a.copy(m[R]).applyMatrix4(b,o),a.normal.toArray(h,T),h[T+3]=a.constant}u.value=h,u.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,h}}function Dh(i){let e=new WeakMap;function t(a,o){return o===fa?a.mapping=Yi:o===ha&&(a.mapping=$i),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===fa||o===ha)if(e.has(a)){const u=e.get(a).texture;return t(u,a.mapping)}else{const u=a.image;if(u&&u.height>0){const d=new Gu(u.height);return d.fromEquirectangularTexture(i,a),e.set(a,d),a.addEventListener("dispose",s),t(d.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const u=e.get(o);u!==void 0&&(e.delete(o),u.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class ac extends nc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,u=s-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=d*this.view.offsetX,a=r+d*this.view.width,o-=f*this.view.offsetY,u=o-f*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,u,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Gi=4,Ko=[.125,.215,.35,.446,.526,.582],_i=20,Yr=new ac,jo=new _t;let $r=null,Kr=0,jr=0,Zr=!1;const mi=(1+Math.sqrt(5))/2,Oi=1/mi,Zo=[new N(-mi,Oi,0),new N(mi,Oi,0),new N(-Oi,0,mi),new N(Oi,0,mi),new N(0,mi,-Oi),new N(0,mi,Oi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)];class Jo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){$r=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),jr=this._renderer.getActiveMipmapLevel(),Zr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=tl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=el(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget($r,Kr,jr),this._renderer.xr.enabled=Zr,e.scissorTest=!1,Xs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Yi||e.mapping===$i?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$r=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),jr=this._renderer.getActiveMipmapLevel(),Zr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:Ji,format:_n,colorSpace:Qi,depthBuffer:!1},s=Qo(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Qo(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ih(r)),this._blurMaterial=Uh(r,e,t)}return s}_compileMaterial(e){const t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,Yr)}_sceneToCubeUV(e,t,n,s){const o=new on(90,1,t,n),u=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],f=this._renderer,m=f.autoClear,g=f.toneMapping;f.getClearColor(jo),f.toneMapping=Jn,f.autoClear=!1;const _=new Ja({name:"PMREM.Background",side:$t,depthWrite:!1,depthTest:!1}),x=new Et(new ts,_);let E=!1;const h=e.background;h?h.isColor&&(_.color.copy(h),e.background=null,E=!0):(_.color.copy(jo),E=!0);for(let c=0;c<6;c++){const b=c%3;b===0?(o.up.set(0,u[c],0),o.lookAt(d[c],0,0)):b===1?(o.up.set(0,0,u[c]),o.lookAt(0,d[c],0)):(o.up.set(0,u[c],0),o.lookAt(0,0,d[c]));const R=this._cubeSize;Xs(s,b*R,c>2?R:0,R,R),f.setRenderTarget(s),E&&f.render(x,o),f.render(e,o)}x.geometry.dispose(),x.material.dispose(),f.toneMapping=g,f.autoClear=m,e.background=h}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Yi||e.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=tl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=el());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Et(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const u=this._cubeSize;Xs(t,0,0,3*u,2*u),n.setRenderTarget(t),n.render(a,Yr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Zo[(s-r-1)%Zo.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const u=this._renderer,d=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,m=new Et(this._lodPlanes[s],d),g=d.uniforms,_=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*_):2*Math.PI/(2*_i-1),E=r/x,h=isFinite(r)?1+Math.floor(f*E):_i;h>_i&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${h} samples when the maximum is set to ${_i}`);const c=[];let b=0;for(let I=0;I<_i;++I){const P=I/E,p=Math.exp(-P*P/2);c.push(p),I===0?b+=p:I<h&&(b+=2*p)}for(let I=0;I<c.length;I++)c[I]=c[I]/b;g.envMap.value=e.texture,g.samples.value=h,g.weights.value=c,g.latitudinal.value=a==="latitudinal",o&&(g.poleAxis.value=o);const{_lodMax:R}=this;g.dTheta.value=x,g.mipInt.value=R-n;const T=this._sizeLods[s],F=3*T*(s>R-Gi?s-R+Gi:0),D=4*(this._cubeSize-T);Xs(t,F,D,3*T,2*T),u.setRenderTarget(t),u.render(m,Yr)}}function Ih(i){const e=[],t=[],n=[];let s=i;const r=i-Gi+1+Ko.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let u=1/o;a>i-Gi?u=Ko[a-i+Gi-1]:a===0&&(u=0),n.push(u);const d=1/(o-2),f=-d,m=1+d,g=[f,f,m,f,m,m,f,f,m,m,f,m],_=6,x=6,E=3,h=2,c=1,b=new Float32Array(E*x*_),R=new Float32Array(h*x*_),T=new Float32Array(c*x*_);for(let D=0;D<_;D++){const I=D%3*2/3-1,P=D>2?0:-1,p=[I,P,0,I+2/3,P,0,I+2/3,P+1,0,I,P,0,I+2/3,P+1,0,I,P+1,0];b.set(p,E*x*D),R.set(g,h*x*D);const v=[D,D,D,D,D,D];T.set(v,c*x*D)}const F=new vn;F.setAttribute("position",new Tn(b,E)),F.setAttribute("uv",new Tn(R,h)),F.setAttribute("faceIndex",new Tn(T,c)),e.push(F),s>Gi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Qo(i,e,t){const n=new ti(i,e,t);return n.texture.mapping=rr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Uh(i,e,t){const n=new Float32Array(_i),s=new N(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function el(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function tl(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Qa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Nh(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const u=o.mapping,d=u===fa||u===ha,f=u===Yi||u===$i;if(d||f){let m=e.get(o);const g=m!==void 0?m.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==g)return t===null&&(t=new Jo(i)),m=d?t.fromEquirectangular(o,m):t.fromCubemap(o,m),m.texture.pmremVersion=o.pmremVersion,e.set(o,m),m.texture;if(m!==void 0)return m.texture;{const _=o.image;return d&&_&&_.height>0||f&&_&&s(_)?(t===null&&(t=new Jo(i)),m=d?t.fromEquirectangular(o):t.fromCubemap(o),m.texture.pmremVersion=o.pmremVersion,e.set(o,m),o.addEventListener("dispose",r),m.texture):null}}}return o}function s(o){let u=0;const d=6;for(let f=0;f<d;f++)o[f]!==void 0&&u++;return u===d}function r(o){const u=o.target;u.removeEventListener("dispose",r);const d=e.get(u);d!==void 0&&(e.delete(u),d.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Fh(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&ps("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Oh(i,e,t,n){const s={},r=new WeakMap;function a(m){const g=m.target;g.index!==null&&e.remove(g.index);for(const x in g.attributes)e.remove(g.attributes[x]);for(const x in g.morphAttributes){const E=g.morphAttributes[x];for(let h=0,c=E.length;h<c;h++)e.remove(E[h])}g.removeEventListener("dispose",a),delete s[g.id];const _=r.get(g);_&&(e.remove(_),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function o(m,g){return s[g.id]===!0||(g.addEventListener("dispose",a),s[g.id]=!0,t.memory.geometries++),g}function u(m){const g=m.attributes;for(const x in g)e.update(g[x],i.ARRAY_BUFFER);const _=m.morphAttributes;for(const x in _){const E=_[x];for(let h=0,c=E.length;h<c;h++)e.update(E[h],i.ARRAY_BUFFER)}}function d(m){const g=[],_=m.index,x=m.attributes.position;let E=0;if(_!==null){const b=_.array;E=_.version;for(let R=0,T=b.length;R<T;R+=3){const F=b[R+0],D=b[R+1],I=b[R+2];g.push(F,D,D,I,I,F)}}else if(x!==void 0){const b=x.array;E=x.version;for(let R=0,T=b.length/3-1;R<T;R+=3){const F=R+0,D=R+1,I=R+2;g.push(F,D,D,I,I,F)}}else return;const h=new($l(g)?ec:Ql)(g,1);h.version=E;const c=r.get(m);c&&e.remove(c),r.set(m,h)}function f(m){const g=r.get(m);if(g){const _=m.index;_!==null&&g.version<_.version&&d(m)}else d(m);return r.get(m)}return{get:o,update:u,getWireframeAttribute:f}}function Bh(i,e,t){let n;function s(g){n=g}let r,a;function o(g){r=g.type,a=g.bytesPerElement}function u(g,_){i.drawElements(n,_,r,g*a),t.update(_,n,1)}function d(g,_,x){x!==0&&(i.drawElementsInstanced(n,_,r,g*a,x),t.update(_,n,x))}function f(g,_,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,_,0,r,g,0,x);let h=0;for(let c=0;c<x;c++)h+=_[c];t.update(h,n,1)}function m(g,_,x,E){if(x===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let c=0;c<g.length;c++)d(g[c]/a,_[c],E[c]);else{h.multiDrawElementsInstancedWEBGL(n,_,0,r,g,0,E,0,x);let c=0;for(let b=0;b<x;b++)c+=_[b]*E[b];t.update(c,n,1)}}this.setMode=s,this.setIndex=o,this.render=u,this.renderInstances=d,this.renderMultiDraw=f,this.renderMultiDrawInstances=m}function zh(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function kh(i,e,t){const n=new WeakMap,s=new bt;function r(a,o,u){const d=a.morphTargetInfluences,f=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,m=f!==void 0?f.length:0;let g=n.get(o);if(g===void 0||g.count!==m){let p=function(){I.dispose(),n.delete(o),o.removeEventListener("dispose",p)};g!==void 0&&g.texture.dispose();const _=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,E=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let R=0;_===!0&&(R=1),x===!0&&(R=2),E===!0&&(R=3);let T=o.attributes.position.count*R,F=1;T>e.maxTextureSize&&(F=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const D=new Float32Array(T*F*4*m),I=new jl(D,T,F,m);I.type=In,I.needsUpdate=!0;const P=R*4;for(let v=0;v<m;v++){const A=h[v],C=c[v],H=b[v],X=T*F*4*v;for(let j=0;j<A.count;j++){const $=j*P;_===!0&&(s.fromBufferAttribute(A,j),D[X+$+0]=s.x,D[X+$+1]=s.y,D[X+$+2]=s.z,D[X+$+3]=0),x===!0&&(s.fromBufferAttribute(C,j),D[X+$+4]=s.x,D[X+$+5]=s.y,D[X+$+6]=s.z,D[X+$+7]=0),E===!0&&(s.fromBufferAttribute(H,j),D[X+$+8]=s.x,D[X+$+9]=s.y,D[X+$+10]=s.z,D[X+$+11]=H.itemSize===4?s.w:1)}}g={count:m,texture:I,size:new dt(T,F)},n.set(o,g),o.addEventListener("dispose",p)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)u.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let _=0;for(let E=0;E<d.length;E++)_+=d[E];const x=o.morphTargetsRelative?1:1-_;u.getUniforms().setValue(i,"morphTargetBaseInfluence",x),u.getUniforms().setValue(i,"morphTargetInfluences",d)}u.getUniforms().setValue(i,"morphTargetsTexture",g.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",g.size)}return{update:r}}function Hh(i,e,t,n){let s=new WeakMap;function r(u){const d=n.render.frame,f=u.geometry,m=e.get(u,f);if(s.get(m)!==d&&(e.update(m),s.set(m,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",o)===!1&&u.addEventListener("dispose",o),s.get(u)!==d&&(t.update(u.instanceMatrix,i.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,i.ARRAY_BUFFER),s.set(u,d))),u.isSkinnedMesh){const g=u.skeleton;s.get(g)!==d&&(g.update(),s.set(g,d))}return m}function a(){s=new WeakMap}function o(u){const d=u.target;d.removeEventListener("dispose",o),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:r,dispose:a}}class eo extends Vt{constructor(e,t,n,s,r,a,o,u,d,f=Wi){if(f!==Wi&&f!==ji)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&f===Wi&&(n=ei),n===void 0&&f===ji&&(n=Ki),super(null,s,r,a,o,u,f,n,d),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:nn,this.minFilter=u!==void 0?u:nn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const oc=new Vt,nl=new eo(1,1),lc=new jl,cc=new bu,uc=new ic,il=[],sl=[],rl=new Float32Array(16),al=new Float32Array(9),ol=new Float32Array(4);function ns(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=il[s];if(r===void 0&&(r=new Float32Array(s),il[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Pt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Lt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function lr(i,e){let t=sl[e];t===void 0&&(t=new Int32Array(e),sl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Gh(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Vh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2fv(this.addr,e),Lt(t,e)}}function Wh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Pt(t,e))return;i.uniform3fv(this.addr,e),Lt(t,e)}}function Xh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4fv(this.addr,e),Lt(t,e)}}function qh(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;ol.set(n),i.uniformMatrix2fv(this.addr,!1,ol),Lt(t,n)}}function Yh(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;al.set(n),i.uniformMatrix3fv(this.addr,!1,al),Lt(t,n)}}function $h(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Pt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Lt(t,e)}else{if(Pt(t,n))return;rl.set(n),i.uniformMatrix4fv(this.addr,!1,rl),Lt(t,n)}}function Kh(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function jh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2iv(this.addr,e),Lt(t,e)}}function Zh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3iv(this.addr,e),Lt(t,e)}}function Jh(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4iv(this.addr,e),Lt(t,e)}}function Qh(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function ep(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Pt(t,e))return;i.uniform2uiv(this.addr,e),Lt(t,e)}}function tp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Pt(t,e))return;i.uniform3uiv(this.addr,e),Lt(t,e)}}function np(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Pt(t,e))return;i.uniform4uiv(this.addr,e),Lt(t,e)}}function ip(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(nl.compareFunction=Yl,r=nl):r=oc,t.setTexture2D(e||r,s)}function sp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||cc,s)}function rp(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||uc,s)}function ap(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||lc,s)}function op(i){switch(i){case 5126:return Gh;case 35664:return Vh;case 35665:return Wh;case 35666:return Xh;case 35674:return qh;case 35675:return Yh;case 35676:return $h;case 5124:case 35670:return Kh;case 35667:case 35671:return jh;case 35668:case 35672:return Zh;case 35669:case 35673:return Jh;case 5125:return Qh;case 36294:return ep;case 36295:return tp;case 36296:return np;case 35678:case 36198:case 36298:case 36306:case 35682:return ip;case 35679:case 36299:case 36307:return sp;case 35680:case 36300:case 36308:case 36293:return rp;case 36289:case 36303:case 36311:case 36292:return ap}}function lp(i,e){i.uniform1fv(this.addr,e)}function cp(i,e){const t=ns(e,this.size,2);i.uniform2fv(this.addr,t)}function up(i,e){const t=ns(e,this.size,3);i.uniform3fv(this.addr,t)}function dp(i,e){const t=ns(e,this.size,4);i.uniform4fv(this.addr,t)}function fp(i,e){const t=ns(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function hp(i,e){const t=ns(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function pp(i,e){const t=ns(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function mp(i,e){i.uniform1iv(this.addr,e)}function gp(i,e){i.uniform2iv(this.addr,e)}function _p(i,e){i.uniform3iv(this.addr,e)}function vp(i,e){i.uniform4iv(this.addr,e)}function xp(i,e){i.uniform1uiv(this.addr,e)}function Mp(i,e){i.uniform2uiv(this.addr,e)}function Sp(i,e){i.uniform3uiv(this.addr,e)}function Ep(i,e){i.uniform4uiv(this.addr,e)}function yp(i,e,t){const n=this.cache,s=e.length,r=lr(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||oc,r[a])}function Tp(i,e,t){const n=this.cache,s=e.length,r=lr(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||cc,r[a])}function bp(i,e,t){const n=this.cache,s=e.length,r=lr(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||uc,r[a])}function Ap(i,e,t){const n=this.cache,s=e.length,r=lr(t,s);Pt(n,r)||(i.uniform1iv(this.addr,r),Lt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||lc,r[a])}function wp(i){switch(i){case 5126:return lp;case 35664:return cp;case 35665:return up;case 35666:return dp;case 35674:return fp;case 35675:return hp;case 35676:return pp;case 5124:case 35670:return mp;case 35667:case 35671:return gp;case 35668:case 35672:return _p;case 35669:case 35673:return vp;case 5125:return xp;case 36294:return Mp;case 36295:return Sp;case 36296:return Ep;case 35678:case 36198:case 36298:case 36306:case 35682:return yp;case 35679:case 36299:case 36307:return Tp;case 35680:case 36300:case 36308:case 36293:return bp;case 36289:case 36303:case 36311:case 36292:return Ap}}class Rp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=op(t.type)}}class Cp{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=wp(t.type)}}class Pp{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Jr=/(\w+)(\])?(\[|\.)?/g;function ll(i,e){i.seq.push(e),i.map[e.id]=e}function Lp(i,e,t){const n=i.name,s=n.length;for(Jr.lastIndex=0;;){const r=Jr.exec(n),a=Jr.lastIndex;let o=r[1];const u=r[2]==="]",d=r[3];if(u&&(o=o|0),d===void 0||d==="["&&a+2===s){ll(t,d===void 0?new Rp(o,i,e):new Cp(o,i,e));break}else{let m=t.map[o];m===void 0&&(m=new Pp(o),ll(t,m)),t=m}}}class er{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Lp(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],u=n[o.id];u.needsUpdate!==!1&&o.setValue(e,u.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function cl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Dp=37297;let Ip=0;function Up(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const ul=new Ye;function Np(i){lt._getMatrix(ul,lt.workingColorSpace,i);const e=`mat3( ${ul.elements.map(t=>t.toFixed(4))} )`;switch(lt.getTransfer(i)){case ar:return[e,"LinearTransferOETF"];case gt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function dl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Up(i.getShaderSource(e),a)}else return s}function Fp(i,e){const t=Np(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Op(i,e){let t;switch(e){case Zc:t="Linear";break;case Jc:t="Reinhard";break;case Qc:t="Cineon";break;case eu:t="ACESFilmic";break;case nu:t="AgX";break;case iu:t="Neutral";break;case tu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qs=new N;function Bp(){lt.getLuminanceCoefficients(qs);const i=qs.x.toFixed(4),e=qs.y.toFixed(4),t=qs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ms).join(`
`)}function kp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Hp(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ms(i){return i!==""}function fl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function hl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Gp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Va(i){return i.replace(Gp,Wp)}const Vp=new Map;function Wp(i,e){let t=Ze[e];if(t===void 0){const n=Vp.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Va(t)}const Xp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function pl(i){return i.replace(Xp,qp)}function qp(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ml(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ul?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Pc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(e="SHADOWMAP_TYPE_VSM"),e}function $p(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Yi:case $i:e="ENVMAP_TYPE_CUBE";break;case rr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Kp(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case $i:e="ENVMAP_MODE_REFRACTION";break}return e}function jp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Nl:e="ENVMAP_BLENDING_MULTIPLY";break;case Kc:e="ENVMAP_BLENDING_MIX";break;case jc:e="ENVMAP_BLENDING_ADD";break}return e}function Zp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Jp(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const u=Yp(t),d=$p(t),f=Kp(t),m=jp(t),g=Zp(t),_=zp(t),x=kp(r),E=s.createProgram();let h,c,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ms).join(`
`),h.length>0&&(h+=`
`),c=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ms).join(`
`),c.length>0&&(c+=`
`)):(h=[ml(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ms).join(`
`),c=[ml(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",t.envMap?"#define "+m:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Jn?"#define TONE_MAPPING":"",t.toneMapping!==Jn?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Jn?Op("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,Fp("linearToOutputTexel",t.outputColorSpace),Bp(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ms).join(`
`)),a=Va(a),a=fl(a,t),a=hl(a,t),o=Va(o),o=fl(o,t),o=hl(o,t),a=pl(a),o=pl(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,h=[_,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+h,c=["#define varying in",t.glslVersion===Ro?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ro?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+c);const R=b+h+a,T=b+c+o,F=cl(s,s.VERTEX_SHADER,R),D=cl(s,s.FRAGMENT_SHADER,T);s.attachShader(E,F),s.attachShader(E,D),t.index0AttributeName!==void 0?s.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(E,0,"position"),s.linkProgram(E);function I(A){if(i.debug.checkShaderErrors){const C=s.getProgramInfoLog(E).trim(),H=s.getShaderInfoLog(F).trim(),X=s.getShaderInfoLog(D).trim();let j=!0,$=!0;if(s.getProgramParameter(E,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,E,F,D);else{const ae=dl(s,F,"vertex"),q=dl(s,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(E,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+C+`
`+ae+`
`+q)}else C!==""?console.warn("THREE.WebGLProgram: Program Info Log:",C):(H===""||X==="")&&($=!1);$&&(A.diagnostics={runnable:j,programLog:C,vertexShader:{log:H,prefix:h},fragmentShader:{log:X,prefix:c}})}s.deleteShader(F),s.deleteShader(D),P=new er(s,E),p=Hp(s,E)}let P;this.getUniforms=function(){return P===void 0&&I(this),P};let p;this.getAttributes=function(){return p===void 0&&I(this),p};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(E,Dp)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ip++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=F,this.fragmentShader=D,this}let Qp=0;class em{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new tm(e),t.set(e,n)),n}}class tm{constructor(e){this.id=Qp++,this.code=e,this.usedTimes=0}}function nm(i,e,t,n,s,r,a){const o=new Zl,u=new em,d=new Set,f=[],m=s.logarithmicDepthBuffer,g=s.vertexTextures;let _=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(p){return d.add(p),p===0?"uv":`uv${p}`}function h(p,v,A,C,H){const X=C.fog,j=H.geometry,$=p.isMeshStandardMaterial?C.environment:null,ae=(p.isMeshStandardMaterial?t:e).get(p.envMap||$),q=ae&&ae.mapping===rr?ae.image.height:null,he=x[p.type];p.precision!==null&&(_=s.getMaxPrecision(p.precision),_!==p.precision&&console.warn("THREE.WebGLProgram.getParameters:",p.precision,"not supported, using",_,"instead."));const Me=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ye=Me!==void 0?Me.length:0;let Ce=0;j.morphAttributes.position!==void 0&&(Ce=1),j.morphAttributes.normal!==void 0&&(Ce=2),j.morphAttributes.color!==void 0&&(Ce=3);let rt,Z,ce,Pe;if(he){const ct=yn[he];rt=ct.vertexShader,Z=ct.fragmentShader}else rt=p.vertexShader,Z=p.fragmentShader,u.update(p),ce=u.getVertexShaderID(p),Pe=u.getFragmentShaderID(p);const de=i.getRenderTarget(),ze=i.state.buffers.depth.getReversed(),Xe=H.isInstancedMesh===!0,Ke=H.isBatchedMesh===!0,xt=!!p.map,et=!!p.matcap,St=!!ae,k=!!p.aoMap,zt=!!p.lightMap,Fe=!!p.bumpMap,He=!!p.normalMap,De=!!p.displacementMap,ft=!!p.emissiveMap,Ie=!!p.metalnessMap,w=!!p.roughnessMap,S=p.anisotropy>0,G=p.clearcoat>0,ne=p.dispersion>0,ie=p.iridescence>0,Q=p.sheen>0,Te=p.transmission>0,re=S&&!!p.anisotropyMap,Se=G&&!!p.clearcoatMap,Qe=G&&!!p.clearcoatNormalMap,oe=G&&!!p.clearcoatRoughnessMap,Ee=ie&&!!p.iridescenceMap,Oe=ie&&!!p.iridescenceThicknessMap,Ue=Q&&!!p.sheenColorMap,fe=Q&&!!p.sheenRoughnessMap,$e=!!p.specularMap,Ne=!!p.specularColorMap,at=!!p.specularIntensityMap,U=Te&&!!p.transmissionMap,pe=Te&&!!p.thicknessMap,Y=!!p.gradientMap,te=!!p.alphaMap,xe=p.alphaTest>0,_e=!!p.alphaHash,Ge=!!p.extensions;let Mt=Jn;p.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(Mt=i.toneMapping);const Tt={shaderID:he,shaderType:p.type,shaderName:p.name,vertexShader:rt,fragmentShader:Z,defines:p.defines,customVertexShaderID:ce,customFragmentShaderID:Pe,isRawShaderMaterial:p.isRawShaderMaterial===!0,glslVersion:p.glslVersion,precision:_,batching:Ke,batchingColor:Ke&&H._colorsTexture!==null,instancing:Xe,instancingColor:Xe&&H.instanceColor!==null,instancingMorph:Xe&&H.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:de===null?i.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:Qi,alphaToCoverage:!!p.alphaToCoverage,map:xt,matcap:et,envMap:St,envMapMode:St&&ae.mapping,envMapCubeUVHeight:q,aoMap:k,lightMap:zt,bumpMap:Fe,normalMap:He,displacementMap:g&&De,emissiveMap:ft,normalMapObjectSpace:He&&p.normalMapType===lu,normalMapTangentSpace:He&&p.normalMapType===ou,metalnessMap:Ie,roughnessMap:w,anisotropy:S,anisotropyMap:re,clearcoat:G,clearcoatMap:Se,clearcoatNormalMap:Qe,clearcoatRoughnessMap:oe,dispersion:ne,iridescence:ie,iridescenceMap:Ee,iridescenceThicknessMap:Oe,sheen:Q,sheenColorMap:Ue,sheenRoughnessMap:fe,specularMap:$e,specularColorMap:Ne,specularIntensityMap:at,transmission:Te,transmissionMap:U,thicknessMap:pe,gradientMap:Y,opaque:p.transparent===!1&&p.blending===Vi&&p.alphaToCoverage===!1,alphaMap:te,alphaTest:xe,alphaHash:_e,combine:p.combine,mapUv:xt&&E(p.map.channel),aoMapUv:k&&E(p.aoMap.channel),lightMapUv:zt&&E(p.lightMap.channel),bumpMapUv:Fe&&E(p.bumpMap.channel),normalMapUv:He&&E(p.normalMap.channel),displacementMapUv:De&&E(p.displacementMap.channel),emissiveMapUv:ft&&E(p.emissiveMap.channel),metalnessMapUv:Ie&&E(p.metalnessMap.channel),roughnessMapUv:w&&E(p.roughnessMap.channel),anisotropyMapUv:re&&E(p.anisotropyMap.channel),clearcoatMapUv:Se&&E(p.clearcoatMap.channel),clearcoatNormalMapUv:Qe&&E(p.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&E(p.clearcoatRoughnessMap.channel),iridescenceMapUv:Ee&&E(p.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&E(p.iridescenceThicknessMap.channel),sheenColorMapUv:Ue&&E(p.sheenColorMap.channel),sheenRoughnessMapUv:fe&&E(p.sheenRoughnessMap.channel),specularMapUv:$e&&E(p.specularMap.channel),specularColorMapUv:Ne&&E(p.specularColorMap.channel),specularIntensityMapUv:at&&E(p.specularIntensityMap.channel),transmissionMapUv:U&&E(p.transmissionMap.channel),thicknessMapUv:pe&&E(p.thicknessMap.channel),alphaMapUv:te&&E(p.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(He||S),vertexColors:p.vertexColors,vertexAlphas:p.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!j.attributes.uv&&(xt||te),fog:!!X,useFog:p.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:p.flatShading===!0,sizeAttenuation:p.sizeAttenuation===!0,logarithmicDepthBuffer:m,reverseDepthBuffer:ze,skinning:H.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Ce,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:p.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:Mt,decodeVideoTexture:xt&&p.map.isVideoTexture===!0&&lt.getTransfer(p.map.colorSpace)===gt,decodeVideoTextureEmissive:ft&&p.emissiveMap.isVideoTexture===!0&&lt.getTransfer(p.emissiveMap.colorSpace)===gt,premultipliedAlpha:p.premultipliedAlpha,doubleSided:p.side===pn,flipSided:p.side===$t,useDepthPacking:p.depthPacking>=0,depthPacking:p.depthPacking||0,index0AttributeName:p.index0AttributeName,extensionClipCullDistance:Ge&&p.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ge&&p.extensions.multiDraw===!0||Ke)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:p.customProgramCacheKey()};return Tt.vertexUv1s=d.has(1),Tt.vertexUv2s=d.has(2),Tt.vertexUv3s=d.has(3),d.clear(),Tt}function c(p){const v=[];if(p.shaderID?v.push(p.shaderID):(v.push(p.customVertexShaderID),v.push(p.customFragmentShaderID)),p.defines!==void 0)for(const A in p.defines)v.push(A),v.push(p.defines[A]);return p.isRawShaderMaterial===!1&&(b(v,p),R(v,p),v.push(i.outputColorSpace)),v.push(p.customProgramCacheKey),v.join()}function b(p,v){p.push(v.precision),p.push(v.outputColorSpace),p.push(v.envMapMode),p.push(v.envMapCubeUVHeight),p.push(v.mapUv),p.push(v.alphaMapUv),p.push(v.lightMapUv),p.push(v.aoMapUv),p.push(v.bumpMapUv),p.push(v.normalMapUv),p.push(v.displacementMapUv),p.push(v.emissiveMapUv),p.push(v.metalnessMapUv),p.push(v.roughnessMapUv),p.push(v.anisotropyMapUv),p.push(v.clearcoatMapUv),p.push(v.clearcoatNormalMapUv),p.push(v.clearcoatRoughnessMapUv),p.push(v.iridescenceMapUv),p.push(v.iridescenceThicknessMapUv),p.push(v.sheenColorMapUv),p.push(v.sheenRoughnessMapUv),p.push(v.specularMapUv),p.push(v.specularColorMapUv),p.push(v.specularIntensityMapUv),p.push(v.transmissionMapUv),p.push(v.thicknessMapUv),p.push(v.combine),p.push(v.fogExp2),p.push(v.sizeAttenuation),p.push(v.morphTargetsCount),p.push(v.morphAttributeCount),p.push(v.numDirLights),p.push(v.numPointLights),p.push(v.numSpotLights),p.push(v.numSpotLightMaps),p.push(v.numHemiLights),p.push(v.numRectAreaLights),p.push(v.numDirLightShadows),p.push(v.numPointLightShadows),p.push(v.numSpotLightShadows),p.push(v.numSpotLightShadowsWithMaps),p.push(v.numLightProbes),p.push(v.shadowMapType),p.push(v.toneMapping),p.push(v.numClippingPlanes),p.push(v.numClipIntersection),p.push(v.depthPacking)}function R(p,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),p.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),p.push(o.mask)}function T(p){const v=x[p.type];let A;if(v){const C=yn[v];A=Bu.clone(C.uniforms)}else A=p.uniforms;return A}function F(p,v){let A;for(let C=0,H=f.length;C<H;C++){const X=f[C];if(X.cacheKey===v){A=X,++A.usedTimes;break}}return A===void 0&&(A=new Jp(i,v,p,r),f.push(A)),A}function D(p){if(--p.usedTimes===0){const v=f.indexOf(p);f[v]=f[f.length-1],f.pop(),p.destroy()}}function I(p){u.remove(p)}function P(){u.dispose()}return{getParameters:h,getProgramCacheKey:c,getUniforms:T,acquireProgram:F,releaseProgram:D,releaseShaderCache:I,programs:f,dispose:P}}function im(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,u){i.get(a)[o]=u}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function sm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function gl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function _l(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(m,g,_,x,E,h){let c=i[e];return c===void 0?(c={id:m.id,object:m,geometry:g,material:_,groupOrder:x,renderOrder:m.renderOrder,z:E,group:h},i[e]=c):(c.id=m.id,c.object=m,c.geometry=g,c.material=_,c.groupOrder=x,c.renderOrder=m.renderOrder,c.z=E,c.group=h),e++,c}function o(m,g,_,x,E,h){const c=a(m,g,_,x,E,h);_.transmission>0?n.push(c):_.transparent===!0?s.push(c):t.push(c)}function u(m,g,_,x,E,h){const c=a(m,g,_,x,E,h);_.transmission>0?n.unshift(c):_.transparent===!0?s.unshift(c):t.unshift(c)}function d(m,g){t.length>1&&t.sort(m||sm),n.length>1&&n.sort(g||gl),s.length>1&&s.sort(g||gl)}function f(){for(let m=e,g=i.length;m<g;m++){const _=i[m];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:u,finish:f,sort:d}}function rm(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new _l,i.set(n,[a])):s>=r.length?(a=new _l,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function am(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new _t};break;case"SpotLight":t={position:new N,direction:new N,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new _t,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":t={color:new _t,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function om(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let lm=0;function cm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function um(i){const e=new am,t=om(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)n.probe.push(new N);const s=new N,r=new yt,a=new yt;function o(d){let f=0,m=0,g=0;for(let p=0;p<9;p++)n.probe[p].set(0,0,0);let _=0,x=0,E=0,h=0,c=0,b=0,R=0,T=0,F=0,D=0,I=0;d.sort(cm);for(let p=0,v=d.length;p<v;p++){const A=d[p],C=A.color,H=A.intensity,X=A.distance,j=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)f+=C.r*H,m+=C.g*H,g+=C.b*H;else if(A.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(A.sh.coefficients[$],H);I++}else if(A.isDirectionalLight){const $=e.get(A);if($.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ae=A.shadow,q=t.get(A);q.shadowIntensity=ae.intensity,q.shadowBias=ae.bias,q.shadowNormalBias=ae.normalBias,q.shadowRadius=ae.radius,q.shadowMapSize=ae.mapSize,n.directionalShadow[_]=q,n.directionalShadowMap[_]=j,n.directionalShadowMatrix[_]=A.shadow.matrix,b++}n.directional[_]=$,_++}else if(A.isSpotLight){const $=e.get(A);$.position.setFromMatrixPosition(A.matrixWorld),$.color.copy(C).multiplyScalar(H),$.distance=X,$.coneCos=Math.cos(A.angle),$.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),$.decay=A.decay,n.spot[E]=$;const ae=A.shadow;if(A.map&&(n.spotLightMap[F]=A.map,F++,ae.updateMatrices(A),A.castShadow&&D++),n.spotLightMatrix[E]=ae.matrix,A.castShadow){const q=t.get(A);q.shadowIntensity=ae.intensity,q.shadowBias=ae.bias,q.shadowNormalBias=ae.normalBias,q.shadowRadius=ae.radius,q.shadowMapSize=ae.mapSize,n.spotShadow[E]=q,n.spotShadowMap[E]=j,T++}E++}else if(A.isRectAreaLight){const $=e.get(A);$.color.copy(C).multiplyScalar(H),$.halfWidth.set(A.width*.5,0,0),$.halfHeight.set(0,A.height*.5,0),n.rectArea[h]=$,h++}else if(A.isPointLight){const $=e.get(A);if($.color.copy(A.color).multiplyScalar(A.intensity),$.distance=A.distance,$.decay=A.decay,A.castShadow){const ae=A.shadow,q=t.get(A);q.shadowIntensity=ae.intensity,q.shadowBias=ae.bias,q.shadowNormalBias=ae.normalBias,q.shadowRadius=ae.radius,q.shadowMapSize=ae.mapSize,q.shadowCameraNear=ae.camera.near,q.shadowCameraFar=ae.camera.far,n.pointShadow[x]=q,n.pointShadowMap[x]=j,n.pointShadowMatrix[x]=A.shadow.matrix,R++}n.point[x]=$,x++}else if(A.isHemisphereLight){const $=e.get(A);$.skyColor.copy(A.color).multiplyScalar(H),$.groundColor.copy(A.groundColor).multiplyScalar(H),n.hemi[c]=$,c++}}h>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=f,n.ambient[1]=m,n.ambient[2]=g;const P=n.hash;(P.directionalLength!==_||P.pointLength!==x||P.spotLength!==E||P.rectAreaLength!==h||P.hemiLength!==c||P.numDirectionalShadows!==b||P.numPointShadows!==R||P.numSpotShadows!==T||P.numSpotMaps!==F||P.numLightProbes!==I)&&(n.directional.length=_,n.spot.length=E,n.rectArea.length=h,n.point.length=x,n.hemi.length=c,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=R,n.pointShadowMap.length=R,n.spotShadow.length=T,n.spotShadowMap.length=T,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=R,n.spotLightMatrix.length=T+F-D,n.spotLightMap.length=F,n.numSpotLightShadowsWithMaps=D,n.numLightProbes=I,P.directionalLength=_,P.pointLength=x,P.spotLength=E,P.rectAreaLength=h,P.hemiLength=c,P.numDirectionalShadows=b,P.numPointShadows=R,P.numSpotShadows=T,P.numSpotMaps=F,P.numLightProbes=I,n.version=lm++)}function u(d,f){let m=0,g=0,_=0,x=0,E=0;const h=f.matrixWorldInverse;for(let c=0,b=d.length;c<b;c++){const R=d[c];if(R.isDirectionalLight){const T=n.directional[m];T.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(h),m++}else if(R.isSpotLight){const T=n.spot[_];T.position.setFromMatrixPosition(R.matrixWorld),T.position.applyMatrix4(h),T.direction.setFromMatrixPosition(R.matrixWorld),s.setFromMatrixPosition(R.target.matrixWorld),T.direction.sub(s),T.direction.transformDirection(h),_++}else if(R.isRectAreaLight){const T=n.rectArea[x];T.position.setFromMatrixPosition(R.matrixWorld),T.position.applyMatrix4(h),a.identity(),r.copy(R.matrixWorld),r.premultiply(h),a.extractRotation(r),T.halfWidth.set(R.width*.5,0,0),T.halfHeight.set(0,R.height*.5,0),T.halfWidth.applyMatrix4(a),T.halfHeight.applyMatrix4(a),x++}else if(R.isPointLight){const T=n.point[g];T.position.setFromMatrixPosition(R.matrixWorld),T.position.applyMatrix4(h),g++}else if(R.isHemisphereLight){const T=n.hemi[E];T.direction.setFromMatrixPosition(R.matrixWorld),T.direction.transformDirection(h),E++}}}return{setup:o,setupView:u,state:n}}function vl(i){const e=new um(i),t=[],n=[];function s(f){d.camera=f,t.length=0,n.length=0}function r(f){t.push(f)}function a(f){n.push(f)}function o(){e.setup(t)}function u(f){e.setupView(t,f)}const d={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:d,setupLights:o,setupLightsView:u,pushLight:r,pushShadow:a}}function dm(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new vl(i),e.set(s,[o])):r>=a.length?(o=new vl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class fm extends or{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=ru,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class hm extends or{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const pm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function gm(i,e,t){let n=new sc;const s=new dt,r=new dt,a=new bt,o=new fm({depthPacking:au}),u=new hm,d={},f=t.maxTextureSize,m={[Qn]:$t,[$t]:Qn,[pn]:pn},g=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:pm,fragmentShader:mm}),_=g.clone();_.defines.HORIZONTAL_PASS=1;const x=new vn;x.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new Et(x,g),h=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ul;let c=this.type;this.render=function(D,I,P){if(h.enabled===!1||h.autoUpdate===!1&&h.needsUpdate===!1||D.length===0)return;const p=i.getRenderTarget(),v=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),C=i.state;C.setBlending(Zn),C.buffers.color.setClear(1,1,1,1),C.buffers.depth.setTest(!0),C.setScissorTest(!1);const H=c!==Dn&&this.type===Dn,X=c===Dn&&this.type!==Dn;for(let j=0,$=D.length;j<$;j++){const ae=D[j],q=ae.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",ae,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);const he=q.getFrameExtents();if(s.multiply(he),r.copy(q.mapSize),(s.x>f||s.y>f)&&(s.x>f&&(r.x=Math.floor(f/he.x),s.x=r.x*he.x,q.mapSize.x=r.x),s.y>f&&(r.y=Math.floor(f/he.y),s.y=r.y*he.y,q.mapSize.y=r.y)),q.map===null||H===!0||X===!0){const ye=this.type!==Dn?{minFilter:nn,magFilter:nn}:{};q.map!==null&&q.map.dispose(),q.map=new ti(s.x,s.y,ye),q.map.texture.name=ae.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();const Me=q.getViewportCount();for(let ye=0;ye<Me;ye++){const Ce=q.getViewport(ye);a.set(r.x*Ce.x,r.y*Ce.y,r.x*Ce.z,r.y*Ce.w),C.viewport(a),q.updateMatrices(ae,ye),n=q.getFrustum(),T(I,P,q.camera,ae,this.type)}q.isPointLightShadow!==!0&&this.type===Dn&&b(q,P),q.needsUpdate=!1}c=this.type,h.needsUpdate=!1,i.setRenderTarget(p,v,A)};function b(D,I){const P=e.update(E);g.defines.VSM_SAMPLES!==D.blurSamples&&(g.defines.VSM_SAMPLES=D.blurSamples,_.defines.VSM_SAMPLES=D.blurSamples,g.needsUpdate=!0,_.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new ti(s.x,s.y)),g.uniforms.shadow_pass.value=D.map.texture,g.uniforms.resolution.value=D.mapSize,g.uniforms.radius.value=D.radius,i.setRenderTarget(D.mapPass),i.clear(),i.renderBufferDirect(I,null,P,g,E,null),_.uniforms.shadow_pass.value=D.mapPass.texture,_.uniforms.resolution.value=D.mapSize,_.uniforms.radius.value=D.radius,i.setRenderTarget(D.map),i.clear(),i.renderBufferDirect(I,null,P,_,E,null)}function R(D,I,P,p){let v=null;const A=P.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(A!==void 0)v=A;else if(v=P.isPointLight===!0?u:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){const C=v.uuid,H=I.uuid;let X=d[C];X===void 0&&(X={},d[C]=X);let j=X[H];j===void 0&&(j=v.clone(),X[H]=j,I.addEventListener("dispose",F)),v=j}if(v.visible=I.visible,v.wireframe=I.wireframe,p===Dn?v.side=I.shadowSide!==null?I.shadowSide:I.side:v.side=I.shadowSide!==null?I.shadowSide:m[I.side],v.alphaMap=I.alphaMap,v.alphaTest=I.alphaTest,v.map=I.map,v.clipShadows=I.clipShadows,v.clippingPlanes=I.clippingPlanes,v.clipIntersection=I.clipIntersection,v.displacementMap=I.displacementMap,v.displacementScale=I.displacementScale,v.displacementBias=I.displacementBias,v.wireframeLinewidth=I.wireframeLinewidth,v.linewidth=I.linewidth,P.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const C=i.properties.get(v);C.light=P}return v}function T(D,I,P,p,v){if(D.visible===!1)return;if(D.layers.test(I.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&v===Dn)&&(!D.frustumCulled||n.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,D.matrixWorld);const H=e.update(D),X=D.material;if(Array.isArray(X)){const j=H.groups;for(let $=0,ae=j.length;$<ae;$++){const q=j[$],he=X[q.materialIndex];if(he&&he.visible){const Me=R(D,he,p,v);D.onBeforeShadow(i,D,I,P,H,Me,q),i.renderBufferDirect(P,null,H,Me,D,q),D.onAfterShadow(i,D,I,P,H,Me,q)}}}else if(X.visible){const j=R(D,X,p,v);D.onBeforeShadow(i,D,I,P,H,j,null),i.renderBufferDirect(P,null,H,j,D,null),D.onAfterShadow(i,D,I,P,H,j,null)}}const C=D.children;for(let H=0,X=C.length;H<X;H++)T(C[H],I,P,p,v)}function F(D){D.target.removeEventListener("dispose",F);for(const P in d){const p=d[P],v=D.target.uuid;v in p&&(p[v].dispose(),delete p[v])}}}const _m={[ra]:aa,[oa]:ua,[la]:da,[qi]:ca,[aa]:ra,[ua]:oa,[da]:la,[ca]:qi};function vm(i,e){function t(){let U=!1;const pe=new bt;let Y=null;const te=new bt(0,0,0,0);return{setMask:function(xe){Y!==xe&&!U&&(i.colorMask(xe,xe,xe,xe),Y=xe)},setLocked:function(xe){U=xe},setClear:function(xe,_e,Ge,Mt,Tt){Tt===!0&&(xe*=Mt,_e*=Mt,Ge*=Mt),pe.set(xe,_e,Ge,Mt),te.equals(pe)===!1&&(i.clearColor(xe,_e,Ge,Mt),te.copy(pe))},reset:function(){U=!1,Y=null,te.set(-1,0,0,0)}}}function n(){let U=!1,pe=!1,Y=null,te=null,xe=null;return{setReversed:function(_e){if(pe!==_e){const Ge=e.get("EXT_clip_control");pe?Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.ZERO_TO_ONE_EXT):Ge.clipControlEXT(Ge.LOWER_LEFT_EXT,Ge.NEGATIVE_ONE_TO_ONE_EXT);const Mt=xe;xe=null,this.setClear(Mt)}pe=_e},getReversed:function(){return pe},setTest:function(_e){_e?de(i.DEPTH_TEST):ze(i.DEPTH_TEST)},setMask:function(_e){Y!==_e&&!U&&(i.depthMask(_e),Y=_e)},setFunc:function(_e){if(pe&&(_e=_m[_e]),te!==_e){switch(_e){case ra:i.depthFunc(i.NEVER);break;case aa:i.depthFunc(i.ALWAYS);break;case oa:i.depthFunc(i.LESS);break;case qi:i.depthFunc(i.LEQUAL);break;case la:i.depthFunc(i.EQUAL);break;case ca:i.depthFunc(i.GEQUAL);break;case ua:i.depthFunc(i.GREATER);break;case da:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}te=_e}},setLocked:function(_e){U=_e},setClear:function(_e){xe!==_e&&(pe&&(_e=1-_e),i.clearDepth(_e),xe=_e)},reset:function(){U=!1,Y=null,te=null,xe=null,pe=!1}}}function s(){let U=!1,pe=null,Y=null,te=null,xe=null,_e=null,Ge=null,Mt=null,Tt=null;return{setTest:function(ct){U||(ct?de(i.STENCIL_TEST):ze(i.STENCIL_TEST))},setMask:function(ct){pe!==ct&&!U&&(i.stencilMask(ct),pe=ct)},setFunc:function(ct,kt,ln){(Y!==ct||te!==kt||xe!==ln)&&(i.stencilFunc(ct,kt,ln),Y=ct,te=kt,xe=ln)},setOp:function(ct,kt,ln){(_e!==ct||Ge!==kt||Mt!==ln)&&(i.stencilOp(ct,kt,ln),_e=ct,Ge=kt,Mt=ln)},setLocked:function(ct){U=ct},setClear:function(ct){Tt!==ct&&(i.clearStencil(ct),Tt=ct)},reset:function(){U=!1,pe=null,Y=null,te=null,xe=null,_e=null,Ge=null,Mt=null,Tt=null}}}const r=new t,a=new n,o=new s,u=new WeakMap,d=new WeakMap;let f={},m={},g=new WeakMap,_=[],x=null,E=!1,h=null,c=null,b=null,R=null,T=null,F=null,D=null,I=new _t(0,0,0),P=0,p=!1,v=null,A=null,C=null,H=null,X=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,ae=0;const q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(ae=parseFloat(/^WebGL (\d)/.exec(q)[1]),$=ae>=1):q.indexOf("OpenGL ES")!==-1&&(ae=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),$=ae>=2);let he=null,Me={};const ye=i.getParameter(i.SCISSOR_BOX),Ce=i.getParameter(i.VIEWPORT),rt=new bt().fromArray(ye),Z=new bt().fromArray(Ce);function ce(U,pe,Y,te){const xe=new Uint8Array(4),_e=i.createTexture();i.bindTexture(U,_e),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ge=0;Ge<Y;Ge++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(pe,0,i.RGBA,1,1,te,0,i.RGBA,i.UNSIGNED_BYTE,xe):i.texImage2D(pe+Ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,xe);return _e}const Pe={};Pe[i.TEXTURE_2D]=ce(i.TEXTURE_2D,i.TEXTURE_2D,1),Pe[i.TEXTURE_CUBE_MAP]=ce(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Pe[i.TEXTURE_2D_ARRAY]=ce(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Pe[i.TEXTURE_3D]=ce(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),de(i.DEPTH_TEST),a.setFunc(qi),Fe(!1),He(Eo),de(i.CULL_FACE),k(Zn);function de(U){f[U]!==!0&&(i.enable(U),f[U]=!0)}function ze(U){f[U]!==!1&&(i.disable(U),f[U]=!1)}function Xe(U,pe){return m[U]!==pe?(i.bindFramebuffer(U,pe),m[U]=pe,U===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=pe),U===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=pe),!0):!1}function Ke(U,pe){let Y=_,te=!1;if(U){Y=g.get(pe),Y===void 0&&(Y=[],g.set(pe,Y));const xe=U.textures;if(Y.length!==xe.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let _e=0,Ge=xe.length;_e<Ge;_e++)Y[_e]=i.COLOR_ATTACHMENT0+_e;Y.length=xe.length,te=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,te=!0);te&&i.drawBuffers(Y)}function xt(U){return x!==U?(i.useProgram(U),x=U,!0):!1}const et={[gi]:i.FUNC_ADD,[Dc]:i.FUNC_SUBTRACT,[Ic]:i.FUNC_REVERSE_SUBTRACT};et[Uc]=i.MIN,et[Nc]=i.MAX;const St={[Fc]:i.ZERO,[Oc]:i.ONE,[Bc]:i.SRC_COLOR,[ia]:i.SRC_ALPHA,[Wc]:i.SRC_ALPHA_SATURATE,[Gc]:i.DST_COLOR,[kc]:i.DST_ALPHA,[zc]:i.ONE_MINUS_SRC_COLOR,[sa]:i.ONE_MINUS_SRC_ALPHA,[Vc]:i.ONE_MINUS_DST_COLOR,[Hc]:i.ONE_MINUS_DST_ALPHA,[Xc]:i.CONSTANT_COLOR,[qc]:i.ONE_MINUS_CONSTANT_COLOR,[Yc]:i.CONSTANT_ALPHA,[$c]:i.ONE_MINUS_CONSTANT_ALPHA};function k(U,pe,Y,te,xe,_e,Ge,Mt,Tt,ct){if(U===Zn){E===!0&&(ze(i.BLEND),E=!1);return}if(E===!1&&(de(i.BLEND),E=!0),U!==Lc){if(U!==h||ct!==p){if((c!==gi||T!==gi)&&(i.blendEquation(i.FUNC_ADD),c=gi,T=gi),ct)switch(U){case Vi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yo:i.blendFunc(i.ONE,i.ONE);break;case To:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Vi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yo:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case To:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case bo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}b=null,R=null,F=null,D=null,I.set(0,0,0),P=0,h=U,p=ct}return}xe=xe||pe,_e=_e||Y,Ge=Ge||te,(pe!==c||xe!==T)&&(i.blendEquationSeparate(et[pe],et[xe]),c=pe,T=xe),(Y!==b||te!==R||_e!==F||Ge!==D)&&(i.blendFuncSeparate(St[Y],St[te],St[_e],St[Ge]),b=Y,R=te,F=_e,D=Ge),(Mt.equals(I)===!1||Tt!==P)&&(i.blendColor(Mt.r,Mt.g,Mt.b,Tt),I.copy(Mt),P=Tt),h=U,p=!1}function zt(U,pe){U.side===pn?ze(i.CULL_FACE):de(i.CULL_FACE);let Y=U.side===$t;pe&&(Y=!Y),Fe(Y),U.blending===Vi&&U.transparent===!1?k(Zn):k(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),a.setFunc(U.depthFunc),a.setTest(U.depthTest),a.setMask(U.depthWrite),r.setMask(U.colorWrite);const te=U.stencilWrite;o.setTest(te),te&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),ft(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):ze(i.SAMPLE_ALPHA_TO_COVERAGE)}function Fe(U){v!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),v=U)}function He(U){U!==Rc?(de(i.CULL_FACE),U!==A&&(U===Eo?i.cullFace(i.BACK):U===Cc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ze(i.CULL_FACE),A=U}function De(U){U!==C&&($&&i.lineWidth(U),C=U)}function ft(U,pe,Y){U?(de(i.POLYGON_OFFSET_FILL),(H!==pe||X!==Y)&&(i.polygonOffset(pe,Y),H=pe,X=Y)):ze(i.POLYGON_OFFSET_FILL)}function Ie(U){U?de(i.SCISSOR_TEST):ze(i.SCISSOR_TEST)}function w(U){U===void 0&&(U=i.TEXTURE0+j-1),he!==U&&(i.activeTexture(U),he=U)}function S(U,pe,Y){Y===void 0&&(he===null?Y=i.TEXTURE0+j-1:Y=he);let te=Me[Y];te===void 0&&(te={type:void 0,texture:void 0},Me[Y]=te),(te.type!==U||te.texture!==pe)&&(he!==Y&&(i.activeTexture(Y),he=Y),i.bindTexture(U,pe||Pe[U]),te.type=U,te.texture=pe)}function G(){const U=Me[he];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ne(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ie(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Se(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Qe(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ee(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Oe(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ue(U){rt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),rt.copy(U))}function fe(U){Z.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Z.copy(U))}function $e(U,pe){let Y=d.get(pe);Y===void 0&&(Y=new WeakMap,d.set(pe,Y));let te=Y.get(U);te===void 0&&(te=i.getUniformBlockIndex(pe,U.name),Y.set(U,te))}function Ne(U,pe){const te=d.get(pe).get(U);u.get(pe)!==te&&(i.uniformBlockBinding(pe,te,U.__bindingPointIndex),u.set(pe,te))}function at(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},he=null,Me={},m={},g=new WeakMap,_=[],x=null,E=!1,h=null,c=null,b=null,R=null,T=null,F=null,D=null,I=new _t(0,0,0),P=0,p=!1,v=null,A=null,C=null,H=null,X=null,rt.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:de,disable:ze,bindFramebuffer:Xe,drawBuffers:Ke,useProgram:xt,setBlending:k,setMaterial:zt,setFlipSided:Fe,setCullFace:He,setLineWidth:De,setPolygonOffset:ft,setScissorTest:Ie,activeTexture:w,bindTexture:S,unbindTexture:G,compressedTexImage2D:ne,compressedTexImage3D:ie,texImage2D:Ee,texImage3D:Oe,updateUBOMapping:$e,uniformBlockBinding:Ne,texStorage2D:Qe,texStorage3D:oe,texSubImage2D:Q,texSubImage3D:Te,compressedTexSubImage2D:re,compressedTexSubImage3D:Se,scissor:Ue,viewport:fe,reset:at}}function xl(i,e,t,n){const s=xm(n);switch(t){case kl:return i*e;case Gl:return i*e;case Vl:return i*e*2;case Wl:return i*e/s.components*s.byteLength;case $a:return i*e/s.components*s.byteLength;case Xl:return i*e*2/s.components*s.byteLength;case Ka:return i*e*2/s.components*s.byteLength;case Hl:return i*e*3/s.components*s.byteLength;case _n:return i*e*4/s.components*s.byteLength;case ja:return i*e*4/s.components*s.byteLength;case Ks:case js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Zs:case Js:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case _a:case xa:return Math.max(i,16)*Math.max(e,8)/4;case ga:case va:return Math.max(i,8)*Math.max(e,8)/2;case Ma:case Sa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ya:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case ba:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Aa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case wa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ra:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ca:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case La:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Da:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Na:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Fa:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Qs:case Oa:case Ba:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ql:case za:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ka:case Ha:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function xm(i){switch(i){case Fn:case Ol:return{byteLength:1,components:1};case gs:case Bl:case Ji:return{byteLength:2,components:1};case qa:case Ya:return{byteLength:2,components:4};case ei:case Xa:case In:return{byteLength:4,components:1};case zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Mm(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new dt,f=new WeakMap;let m;const g=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(w,S){return _?new OffscreenCanvas(w,S):nr("canvas")}function E(w,S,G){let ne=1;const ie=Ie(w);if((ie.width>G||ie.height>G)&&(ne=G/Math.max(ie.width,ie.height)),ne<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Q=Math.floor(ne*ie.width),Te=Math.floor(ne*ie.height);m===void 0&&(m=x(Q,Te));const re=S?x(Q,Te):m;return re.width=Q,re.height=Te,re.getContext("2d").drawImage(w,0,0,Q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+Q+"x"+Te+")."),re}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),w;return w}function h(w){return w.generateMipmaps}function c(w){i.generateMipmap(w)}function b(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function R(w,S,G,ne,ie=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Q=S;if(S===i.RED&&(G===i.FLOAT&&(Q=i.R32F),G===i.HALF_FLOAT&&(Q=i.R16F),G===i.UNSIGNED_BYTE&&(Q=i.R8)),S===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.R8UI),G===i.UNSIGNED_SHORT&&(Q=i.R16UI),G===i.UNSIGNED_INT&&(Q=i.R32UI),G===i.BYTE&&(Q=i.R8I),G===i.SHORT&&(Q=i.R16I),G===i.INT&&(Q=i.R32I)),S===i.RG&&(G===i.FLOAT&&(Q=i.RG32F),G===i.HALF_FLOAT&&(Q=i.RG16F),G===i.UNSIGNED_BYTE&&(Q=i.RG8)),S===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.RG8UI),G===i.UNSIGNED_SHORT&&(Q=i.RG16UI),G===i.UNSIGNED_INT&&(Q=i.RG32UI),G===i.BYTE&&(Q=i.RG8I),G===i.SHORT&&(Q=i.RG16I),G===i.INT&&(Q=i.RG32I)),S===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),G===i.UNSIGNED_INT&&(Q=i.RGB32UI),G===i.BYTE&&(Q=i.RGB8I),G===i.SHORT&&(Q=i.RGB16I),G===i.INT&&(Q=i.RGB32I)),S===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),G===i.UNSIGNED_INT&&(Q=i.RGBA32UI),G===i.BYTE&&(Q=i.RGBA8I),G===i.SHORT&&(Q=i.RGBA16I),G===i.INT&&(Q=i.RGBA32I)),S===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),S===i.RGBA){const Te=ie?ar:lt.getTransfer(ne);G===i.FLOAT&&(Q=i.RGBA32F),G===i.HALF_FLOAT&&(Q=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Q=Te===gt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function T(w,S){let G;return w?S===null||S===ei||S===Ki?G=i.DEPTH24_STENCIL8:S===In?G=i.DEPTH32F_STENCIL8:S===gs&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ei||S===Ki?G=i.DEPTH_COMPONENT24:S===In?G=i.DEPTH_COMPONENT32F:S===gs&&(G=i.DEPTH_COMPONENT16),G}function F(w,S){return h(w)===!0||w.isFramebufferTexture&&w.minFilter!==nn&&w.minFilter!==gn?Math.log2(Math.max(S.width,S.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?S.mipmaps.length:1}function D(w){const S=w.target;S.removeEventListener("dispose",D),P(S),S.isVideoTexture&&f.delete(S)}function I(w){const S=w.target;S.removeEventListener("dispose",I),v(S)}function P(w){const S=n.get(w);if(S.__webglInit===void 0)return;const G=w.source,ne=g.get(G);if(ne){const ie=ne[S.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&p(w),Object.keys(ne).length===0&&g.delete(G)}n.remove(w)}function p(w){const S=n.get(w);i.deleteTexture(S.__webglTexture);const G=w.source,ne=g.get(G);delete ne[S.__cacheKey],a.memory.textures--}function v(w){const S=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(S.__webglFramebuffer[ne]))for(let ie=0;ie<S.__webglFramebuffer[ne].length;ie++)i.deleteFramebuffer(S.__webglFramebuffer[ne][ie]);else i.deleteFramebuffer(S.__webglFramebuffer[ne]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[ne])}else{if(Array.isArray(S.__webglFramebuffer))for(let ne=0;ne<S.__webglFramebuffer.length;ne++)i.deleteFramebuffer(S.__webglFramebuffer[ne]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let ne=0;ne<S.__webglColorRenderbuffer.length;ne++)S.__webglColorRenderbuffer[ne]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[ne]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const G=w.textures;for(let ne=0,ie=G.length;ne<ie;ne++){const Q=n.get(G[ne]);Q.__webglTexture&&(i.deleteTexture(Q.__webglTexture),a.memory.textures--),n.remove(G[ne])}n.remove(w)}let A=0;function C(){A=0}function H(){const w=A;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),A+=1,w}function X(w){const S=[];return S.push(w.wrapS),S.push(w.wrapT),S.push(w.wrapR||0),S.push(w.magFilter),S.push(w.minFilter),S.push(w.anisotropy),S.push(w.internalFormat),S.push(w.format),S.push(w.type),S.push(w.generateMipmaps),S.push(w.premultiplyAlpha),S.push(w.flipY),S.push(w.unpackAlignment),S.push(w.colorSpace),S.join()}function j(w,S){const G=n.get(w);if(w.isVideoTexture&&De(w),w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){const ne=w.image;if(ne===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(G,w,S);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+S)}function $(w,S){const G=n.get(w);if(w.version>0&&G.__version!==w.version){Z(G,w,S);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+S)}function ae(w,S){const G=n.get(w);if(w.version>0&&G.__version!==w.version){Z(G,w,S);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+S)}function q(w,S){const G=n.get(w);if(w.version>0&&G.__version!==w.version){ce(G,w,S);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+S)}const he={[pa]:i.REPEAT,[vi]:i.CLAMP_TO_EDGE,[ma]:i.MIRRORED_REPEAT},Me={[nn]:i.NEAREST,[su]:i.NEAREST_MIPMAP_NEAREST,[As]:i.NEAREST_MIPMAP_LINEAR,[gn]:i.LINEAR,[Tr]:i.LINEAR_MIPMAP_NEAREST,[xi]:i.LINEAR_MIPMAP_LINEAR},ye={[cu]:i.NEVER,[mu]:i.ALWAYS,[uu]:i.LESS,[Yl]:i.LEQUAL,[du]:i.EQUAL,[pu]:i.GEQUAL,[fu]:i.GREATER,[hu]:i.NOTEQUAL};function Ce(w,S){if(S.type===In&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===gn||S.magFilter===Tr||S.magFilter===As||S.magFilter===xi||S.minFilter===gn||S.minFilter===Tr||S.minFilter===As||S.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,he[S.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,he[S.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,he[S.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Me[S.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Me[S.minFilter]),S.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,ye[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===nn||S.minFilter!==As&&S.minFilter!==xi||S.type===In&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,s.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function rt(w,S){let G=!1;w.__webglInit===void 0&&(w.__webglInit=!0,S.addEventListener("dispose",D));const ne=S.source;let ie=g.get(ne);ie===void 0&&(ie={},g.set(ne,ie));const Q=X(S);if(Q!==w.__cacheKey){ie[Q]===void 0&&(ie[Q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),ie[Q].usedTimes++;const Te=ie[w.__cacheKey];Te!==void 0&&(ie[w.__cacheKey].usedTimes--,Te.usedTimes===0&&p(S)),w.__cacheKey=Q,w.__webglTexture=ie[Q].texture}return G}function Z(w,S,G){let ne=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(ne=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(ne=i.TEXTURE_3D);const ie=rt(w,S),Q=S.source;t.bindTexture(ne,w.__webglTexture,i.TEXTURE0+G);const Te=n.get(Q);if(Q.version!==Te.__version||ie===!0){t.activeTexture(i.TEXTURE0+G);const re=lt.getPrimaries(lt.workingColorSpace),Se=S.colorSpace===jn?null:lt.getPrimaries(S.colorSpace),Qe=S.colorSpace===jn||re===Se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe);let oe=E(S.image,!1,s.maxTextureSize);oe=ft(S,oe);const Ee=r.convert(S.format,S.colorSpace),Oe=r.convert(S.type);let Ue=R(S.internalFormat,Ee,Oe,S.colorSpace,S.isVideoTexture);Ce(ne,S);let fe;const $e=S.mipmaps,Ne=S.isVideoTexture!==!0,at=Te.__version===void 0||ie===!0,U=Q.dataReady,pe=F(S,oe);if(S.isDepthTexture)Ue=T(S.format===ji,S.type),at&&(Ne?t.texStorage2D(i.TEXTURE_2D,1,Ue,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Ue,oe.width,oe.height,0,Ee,Oe,null));else if(S.isDataTexture)if($e.length>0){Ne&&at&&t.texStorage2D(i.TEXTURE_2D,pe,Ue,$e[0].width,$e[0].height);for(let Y=0,te=$e.length;Y<te;Y++)fe=$e[Y],Ne?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,fe.width,fe.height,Ee,Oe,fe.data):t.texImage2D(i.TEXTURE_2D,Y,Ue,fe.width,fe.height,0,Ee,Oe,fe.data);S.generateMipmaps=!1}else Ne?(at&&t.texStorage2D(i.TEXTURE_2D,pe,Ue,oe.width,oe.height),U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,oe.width,oe.height,Ee,Oe,oe.data)):t.texImage2D(i.TEXTURE_2D,0,Ue,oe.width,oe.height,0,Ee,Oe,oe.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Ne&&at&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,Ue,$e[0].width,$e[0].height,oe.depth);for(let Y=0,te=$e.length;Y<te;Y++)if(fe=$e[Y],S.format!==_n)if(Ee!==null)if(Ne){if(U)if(S.layerUpdates.size>0){const xe=xl(fe.width,fe.height,S.format,S.type);for(const _e of S.layerUpdates){const Ge=fe.data.subarray(_e*xe/fe.data.BYTES_PER_ELEMENT,(_e+1)*xe/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,_e,fe.width,fe.height,1,Ee,Ge)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,fe.width,fe.height,oe.depth,Ee,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Ue,fe.width,fe.height,oe.depth,0,fe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ne?U&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,fe.width,fe.height,oe.depth,Ee,Oe,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Y,Ue,fe.width,fe.height,oe.depth,0,Ee,Oe,fe.data)}else{Ne&&at&&t.texStorage2D(i.TEXTURE_2D,pe,Ue,$e[0].width,$e[0].height);for(let Y=0,te=$e.length;Y<te;Y++)fe=$e[Y],S.format!==_n?Ee!==null?Ne?U&&t.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,fe.width,fe.height,Ee,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,Y,Ue,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ne?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,fe.width,fe.height,Ee,Oe,fe.data):t.texImage2D(i.TEXTURE_2D,Y,Ue,fe.width,fe.height,0,Ee,Oe,fe.data)}else if(S.isDataArrayTexture)if(Ne){if(at&&t.texStorage3D(i.TEXTURE_2D_ARRAY,pe,Ue,oe.width,oe.height,oe.depth),U)if(S.layerUpdates.size>0){const Y=xl(oe.width,oe.height,S.format,S.type);for(const te of S.layerUpdates){const xe=oe.data.subarray(te*Y/oe.data.BYTES_PER_ELEMENT,(te+1)*Y/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,oe.width,oe.height,1,Ee,Oe,xe)}S.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Ee,Oe,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ue,oe.width,oe.height,oe.depth,0,Ee,Oe,oe.data);else if(S.isData3DTexture)Ne?(at&&t.texStorage3D(i.TEXTURE_3D,pe,Ue,oe.width,oe.height,oe.depth),U&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Ee,Oe,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Ue,oe.width,oe.height,oe.depth,0,Ee,Oe,oe.data);else if(S.isFramebufferTexture){if(at)if(Ne)t.texStorage2D(i.TEXTURE_2D,pe,Ue,oe.width,oe.height);else{let Y=oe.width,te=oe.height;for(let xe=0;xe<pe;xe++)t.texImage2D(i.TEXTURE_2D,xe,Ue,Y,te,0,Ee,Oe,null),Y>>=1,te>>=1}}else if($e.length>0){if(Ne&&at){const Y=Ie($e[0]);t.texStorage2D(i.TEXTURE_2D,pe,Ue,Y.width,Y.height)}for(let Y=0,te=$e.length;Y<te;Y++)fe=$e[Y],Ne?U&&t.texSubImage2D(i.TEXTURE_2D,Y,0,0,Ee,Oe,fe):t.texImage2D(i.TEXTURE_2D,Y,Ue,Ee,Oe,fe);S.generateMipmaps=!1}else if(Ne){if(at){const Y=Ie(oe);t.texStorage2D(i.TEXTURE_2D,pe,Ue,Y.width,Y.height)}U&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Ee,Oe,oe)}else t.texImage2D(i.TEXTURE_2D,0,Ue,Ee,Oe,oe);h(S)&&c(ne),Te.__version=Q.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function ce(w,S,G){if(S.image.length!==6)return;const ne=rt(w,S),ie=S.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+G);const Q=n.get(ie);if(ie.version!==Q.__version||ne===!0){t.activeTexture(i.TEXTURE0+G);const Te=lt.getPrimaries(lt.workingColorSpace),re=S.colorSpace===jn?null:lt.getPrimaries(S.colorSpace),Se=S.colorSpace===jn||Te===re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const Qe=S.isCompressedTexture||S.image[0].isCompressedTexture,oe=S.image[0]&&S.image[0].isDataTexture,Ee=[];for(let te=0;te<6;te++)!Qe&&!oe?Ee[te]=E(S.image[te],!0,s.maxCubemapSize):Ee[te]=oe?S.image[te].image:S.image[te],Ee[te]=ft(S,Ee[te]);const Oe=Ee[0],Ue=r.convert(S.format,S.colorSpace),fe=r.convert(S.type),$e=R(S.internalFormat,Ue,fe,S.colorSpace),Ne=S.isVideoTexture!==!0,at=Q.__version===void 0||ne===!0,U=ie.dataReady;let pe=F(S,Oe);Ce(i.TEXTURE_CUBE_MAP,S);let Y;if(Qe){Ne&&at&&t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,$e,Oe.width,Oe.height);for(let te=0;te<6;te++){Y=Ee[te].mipmaps;for(let xe=0;xe<Y.length;xe++){const _e=Y[xe];S.format!==_n?Ue!==null?Ne?U&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,0,0,_e.width,_e.height,Ue,_e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,$e,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ne?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,0,0,_e.width,_e.height,Ue,fe,_e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,$e,_e.width,_e.height,0,Ue,fe,_e.data)}}}else{if(Y=S.mipmaps,Ne&&at){Y.length>0&&pe++;const te=Ie(Ee[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,pe,$e,te.width,te.height)}for(let te=0;te<6;te++)if(oe){Ne?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ee[te].width,Ee[te].height,Ue,fe,Ee[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,$e,Ee[te].width,Ee[te].height,0,Ue,fe,Ee[te].data);for(let xe=0;xe<Y.length;xe++){const Ge=Y[xe].image[te].image;Ne?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,0,0,Ge.width,Ge.height,Ue,fe,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,$e,Ge.width,Ge.height,0,Ue,fe,Ge.data)}}else{Ne?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ue,fe,Ee[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,$e,Ue,fe,Ee[te]);for(let xe=0;xe<Y.length;xe++){const _e=Y[xe];Ne?U&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,0,0,Ue,fe,_e.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,$e,Ue,fe,_e.image[te])}}}h(S)&&c(i.TEXTURE_CUBE_MAP),Q.__version=ie.version,S.onUpdate&&S.onUpdate(S)}w.__version=S.version}function Pe(w,S,G,ne,ie,Q){const Te=r.convert(G.format,G.colorSpace),re=r.convert(G.type),Se=R(G.internalFormat,Te,re,G.colorSpace),Qe=n.get(S),oe=n.get(G);if(oe.__renderTarget=S,!Qe.__hasExternalTextures){const Ee=Math.max(1,S.width>>Q),Oe=Math.max(1,S.height>>Q);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,Q,Se,Ee,Oe,S.depth,0,Te,re,null):t.texImage2D(ie,Q,Se,Ee,Oe,0,Te,re,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),He(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ne,ie,oe.__webglTexture,0,Fe(S)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ne,ie,oe.__webglTexture,Q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function de(w,S,G){if(i.bindRenderbuffer(i.RENDERBUFFER,w),S.depthBuffer){const ne=S.depthTexture,ie=ne&&ne.isDepthTexture?ne.type:null,Q=T(S.stencilBuffer,ie),Te=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=Fe(S);He(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,re,Q,S.width,S.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,re,Q,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Q,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Te,i.RENDERBUFFER,w)}else{const ne=S.textures;for(let ie=0;ie<ne.length;ie++){const Q=ne[ie],Te=r.convert(Q.format,Q.colorSpace),re=r.convert(Q.type),Se=R(Q.internalFormat,Te,re,Q.colorSpace),Qe=Fe(S);G&&He(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Qe,Se,S.width,S.height):He(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Qe,Se,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,Se,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ze(w,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=n.get(S.depthTexture);ne.__renderTarget=S,(!ne.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),j(S.depthTexture,0);const ie=ne.__webglTexture,Q=Fe(S);if(S.depthTexture.format===Wi)He(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0);else if(S.depthTexture.format===ji)He(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function Xe(w){const S=n.get(w),G=w.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==w.depthTexture){const ne=w.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),ne){const ie=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,ne.removeEventListener("dispose",ie)};ne.addEventListener("dispose",ie),S.__depthDisposeCallback=ie}S.__boundDepthTexture=ne}if(w.depthTexture&&!S.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");ze(S.__webglFramebuffer,w)}else if(G){S.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[ne]),S.__webglDepthbuffer[ne]===void 0)S.__webglDepthbuffer[ne]=i.createRenderbuffer(),de(S.__webglDepthbuffer[ne],w,!1);else{const ie=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=S.__webglDepthbuffer[ne];i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),de(S.__webglDepthbuffer,w,!1);else{const ne=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,ie)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(w,S,G){const ne=n.get(w);S!==void 0&&Pe(ne.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Xe(w)}function xt(w){const S=w.texture,G=n.get(w),ne=n.get(S);w.addEventListener("dispose",I);const ie=w.textures,Q=w.isWebGLCubeRenderTarget===!0,Te=ie.length>1;if(Te||(ne.__webglTexture===void 0&&(ne.__webglTexture=i.createTexture()),ne.__version=S.version,a.memory.textures++),Q){G.__webglFramebuffer=[];for(let re=0;re<6;re++)if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer[re]=[];for(let Se=0;Se<S.mipmaps.length;Se++)G.__webglFramebuffer[re][Se]=i.createFramebuffer()}else G.__webglFramebuffer[re]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){G.__webglFramebuffer=[];for(let re=0;re<S.mipmaps.length;re++)G.__webglFramebuffer[re]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(Te)for(let re=0,Se=ie.length;re<Se;re++){const Qe=n.get(ie[re]);Qe.__webglTexture===void 0&&(Qe.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&He(w)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let re=0;re<ie.length;re++){const Se=ie[re];G.__webglColorRenderbuffer[re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[re]);const Qe=r.convert(Se.format,Se.colorSpace),oe=r.convert(Se.type),Ee=R(Se.internalFormat,Qe,oe,Se.colorSpace,w.isXRRenderTarget===!0),Oe=Fe(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,Ee,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,G.__webglColorRenderbuffer[re])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),de(G.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){t.bindTexture(i.TEXTURE_CUBE_MAP,ne.__webglTexture),Ce(i.TEXTURE_CUBE_MAP,S);for(let re=0;re<6;re++)if(S.mipmaps&&S.mipmaps.length>0)for(let Se=0;Se<S.mipmaps.length;Se++)Pe(G.__webglFramebuffer[re][Se],w,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,Se);else Pe(G.__webglFramebuffer[re],w,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);h(S)&&c(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let re=0,Se=ie.length;re<Se;re++){const Qe=ie[re],oe=n.get(Qe);t.bindTexture(i.TEXTURE_2D,oe.__webglTexture),Ce(i.TEXTURE_2D,Qe),Pe(G.__webglFramebuffer,w,Qe,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,0),h(Qe)&&c(i.TEXTURE_2D)}t.unbindTexture()}else{let re=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(re=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(re,ne.__webglTexture),Ce(re,S),S.mipmaps&&S.mipmaps.length>0)for(let Se=0;Se<S.mipmaps.length;Se++)Pe(G.__webglFramebuffer[Se],w,S,i.COLOR_ATTACHMENT0,re,Se);else Pe(G.__webglFramebuffer,w,S,i.COLOR_ATTACHMENT0,re,0);h(S)&&c(re),t.unbindTexture()}w.depthBuffer&&Xe(w)}function et(w){const S=w.textures;for(let G=0,ne=S.length;G<ne;G++){const ie=S[G];if(h(ie)){const Q=b(w),Te=n.get(ie).__webglTexture;t.bindTexture(Q,Te),c(Q),t.unbindTexture()}}}const St=[],k=[];function zt(w){if(w.samples>0){if(He(w)===!1){const S=w.textures,G=w.width,ne=w.height;let ie=i.COLOR_BUFFER_BIT;const Q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Te=n.get(w),re=S.length>1;if(re)for(let Se=0;Se<S.length;Se++)t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let Se=0;Se<S.length;Se++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Te.__webglColorRenderbuffer[Se]);const Qe=n.get(S[Se]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Qe,0)}i.blitFramebuffer(0,0,G,ne,0,0,G,ne,ie,i.NEAREST),u===!0&&(St.length=0,k.length=0,St.push(i.COLOR_ATTACHMENT0+Se),w.depthBuffer&&w.resolveDepthBuffer===!1&&(St.push(Q),k.push(Q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,St))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),re)for(let Se=0;Se<S.length;Se++){t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.RENDERBUFFER,Te.__webglColorRenderbuffer[Se]);const Qe=n.get(S[Se]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Se,i.TEXTURE_2D,Qe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&u){const S=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function Fe(w){return Math.min(s.maxSamples,w.samples)}function He(w){const S=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function De(w){const S=a.render.frame;f.get(w)!==S&&(f.set(w,S),w.update())}function ft(w,S){const G=w.colorSpace,ne=w.format,ie=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||G!==Qi&&G!==jn&&(lt.getTransfer(G)===gt?(ne!==_n||ie!==Fn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),S}function Ie(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(d.width=w.naturalWidth||w.width,d.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(d.width=w.displayWidth,d.height=w.displayHeight):(d.width=w.width,d.height=w.height),d}this.allocateTextureUnit=H,this.resetTextureUnits=C,this.setTexture2D=j,this.setTexture2DArray=$,this.setTexture3D=ae,this.setTextureCube=q,this.rebindTextures=Ke,this.setupRenderTarget=xt,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=zt,this.setupDepthRenderbuffer=Xe,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=He}function Sm(i,e){function t(n,s=jn){let r;const a=lt.getTransfer(s);if(n===Fn)return i.UNSIGNED_BYTE;if(n===qa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ya)return i.UNSIGNED_SHORT_5_5_5_1;if(n===zl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ol)return i.BYTE;if(n===Bl)return i.SHORT;if(n===gs)return i.UNSIGNED_SHORT;if(n===Xa)return i.INT;if(n===ei)return i.UNSIGNED_INT;if(n===In)return i.FLOAT;if(n===Ji)return i.HALF_FLOAT;if(n===kl)return i.ALPHA;if(n===Hl)return i.RGB;if(n===_n)return i.RGBA;if(n===Gl)return i.LUMINANCE;if(n===Vl)return i.LUMINANCE_ALPHA;if(n===Wi)return i.DEPTH_COMPONENT;if(n===ji)return i.DEPTH_STENCIL;if(n===Wl)return i.RED;if(n===$a)return i.RED_INTEGER;if(n===Xl)return i.RG;if(n===Ka)return i.RG_INTEGER;if(n===ja)return i.RGBA_INTEGER;if(n===Ks||n===js||n===Zs||n===Js)if(a===gt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ks)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Zs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Js)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ks)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===js)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Zs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Js)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ga||n===_a||n===va||n===xa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ga)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===_a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===va)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===xa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ma||n===Sa||n===Ea)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ma||n===Sa)return a===gt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ea)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ya||n===Ta||n===ba||n===Aa||n===wa||n===Ra||n===Ca||n===Pa||n===La||n===Da||n===Ia||n===Ua||n===Na||n===Fa)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ya)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ta)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ba)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Aa)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wa)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ra)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ca)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Pa)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===La)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Da)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ia)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ua)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Na)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Fa)return a===gt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Qs||n===Oa||n===Ba)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Qs)return a===gt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Oa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ba)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ql||n===za||n===ka||n===Ha)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Qs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===za)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ka)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ha)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ki?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class Em extends on{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class At extends Ut{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ym={type:"move"};class Qr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new At,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new At,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new At,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,u=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){a=!0;for(const E of e.hand.values()){const h=t.getJointPose(E,n),c=this._getHandJoint(d,E);h!==null&&(c.matrix.fromArray(h.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,c.jointRadius=h.radius),c.visible=h!==null}const f=d.joints["index-finger-tip"],m=d.joints["thumb-tip"],g=f.position.distanceTo(m.position),_=.02,x=.005;d.inputState.pinching&&g>_+x?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&g<=_-x&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(u.matrix.fromArray(r.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,r.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(r.linearVelocity)):u.hasLinearVelocity=!1,r.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(r.angularVelocity)):u.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ym)))}return o!==null&&(o.visible=s!==null),u!==null&&(u.visible=r!==null),d!==null&&(d.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new At;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Tm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Am{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new Vt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new bn({vertexShader:Tm,fragmentShader:bm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new Mi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wm extends es{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",u=1,d=null,f=null,m=null,g=null,_=null,x=null;const E=new Am,h=t.getContextAttributes();let c=null,b=null;const R=[],T=[],F=new dt;let D=null;const I=new on;I.viewport=new bt;const P=new on;P.viewport=new bt;const p=[I,P],v=new Em;let A=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ce=R[Z];return ce===void 0&&(ce=new Qr,R[Z]=ce),ce.getTargetRaySpace()},this.getControllerGrip=function(Z){let ce=R[Z];return ce===void 0&&(ce=new Qr,R[Z]=ce),ce.getGripSpace()},this.getHand=function(Z){let ce=R[Z];return ce===void 0&&(ce=new Qr,R[Z]=ce),ce.getHandSpace()};function H(Z){const ce=T.indexOf(Z.inputSource);if(ce===-1)return;const Pe=R[ce];Pe!==void 0&&(Pe.update(Z.inputSource,Z.frame,d||a),Pe.dispatchEvent({type:Z.type,data:Z.inputSource}))}function X(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",j);for(let Z=0;Z<R.length;Z++){const ce=T[Z];ce!==null&&(T[Z]=null,R[Z].disconnect(ce))}A=null,C=null,E.reset(),e.setRenderTarget(c),_=null,g=null,m=null,s=null,b=null,rt.stop(),n.isPresenting=!1,e.setPixelRatio(D),e.setSize(F.width,F.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||a},this.setReferenceSpace=function(Z){d=Z},this.getBaseLayer=function(){return g!==null?g:_},this.getBinding=function(){return m},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(c=e.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",X),s.addEventListener("inputsourceschange",j),h.xrCompatible!==!0&&await t.makeXRCompatible(),D=e.getPixelRatio(),e.getSize(F),s.renderState.layers===void 0){const ce={antialias:h.antialias,alpha:!0,depth:h.depth,stencil:h.stencil,framebufferScaleFactor:r};_=new XRWebGLLayer(s,t,ce),s.updateRenderState({baseLayer:_}),e.setPixelRatio(1),e.setSize(_.framebufferWidth,_.framebufferHeight,!1),b=new ti(_.framebufferWidth,_.framebufferHeight,{format:_n,type:Fn,colorSpace:e.outputColorSpace,stencilBuffer:h.stencil})}else{let ce=null,Pe=null,de=null;h.depth&&(de=h.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ce=h.stencil?ji:Wi,Pe=h.stencil?Ki:ei);const ze={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:r};m=new XRWebGLBinding(s,t),g=m.createProjectionLayer(ze),s.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),b=new ti(g.textureWidth,g.textureHeight,{format:_n,type:Fn,depthTexture:new eo(g.textureWidth,g.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:h.stencil,colorSpace:e.outputColorSpace,samples:h.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(u),d=null,a=await s.requestReferenceSpace(o),rt.setContext(s),rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function j(Z){for(let ce=0;ce<Z.removed.length;ce++){const Pe=Z.removed[ce],de=T.indexOf(Pe);de>=0&&(T[de]=null,R[de].disconnect(Pe))}for(let ce=0;ce<Z.added.length;ce++){const Pe=Z.added[ce];let de=T.indexOf(Pe);if(de===-1){for(let Xe=0;Xe<R.length;Xe++)if(Xe>=T.length){T.push(Pe),de=Xe;break}else if(T[Xe]===null){T[Xe]=Pe,de=Xe;break}if(de===-1)break}const ze=R[de];ze&&ze.connect(Pe)}}const $=new N,ae=new N;function q(Z,ce,Pe){$.setFromMatrixPosition(ce.matrixWorld),ae.setFromMatrixPosition(Pe.matrixWorld);const de=$.distanceTo(ae),ze=ce.projectionMatrix.elements,Xe=Pe.projectionMatrix.elements,Ke=ze[14]/(ze[10]-1),xt=ze[14]/(ze[10]+1),et=(ze[9]+1)/ze[5],St=(ze[9]-1)/ze[5],k=(ze[8]-1)/ze[0],zt=(Xe[8]+1)/Xe[0],Fe=Ke*k,He=Ke*zt,De=de/(-k+zt),ft=De*-k;if(ce.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ft),Z.translateZ(De),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),ze[10]===-1)Z.projectionMatrix.copy(ce.projectionMatrix),Z.projectionMatrixInverse.copy(ce.projectionMatrixInverse);else{const Ie=Ke+De,w=xt+De,S=Fe-ft,G=He+(de-ft),ne=et*xt/w*Ie,ie=St*xt/w*Ie;Z.projectionMatrix.makePerspective(S,G,ne,ie,Ie,w),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function he(Z,ce){ce===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ce.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let ce=Z.near,Pe=Z.far;E.texture!==null&&(E.depthNear>0&&(ce=E.depthNear),E.depthFar>0&&(Pe=E.depthFar)),v.near=P.near=I.near=ce,v.far=P.far=I.far=Pe,(A!==v.near||C!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),A=v.near,C=v.far),I.layers.mask=Z.layers.mask|2,P.layers.mask=Z.layers.mask|4,v.layers.mask=I.layers.mask|P.layers.mask;const de=Z.parent,ze=v.cameras;he(v,de);for(let Xe=0;Xe<ze.length;Xe++)he(ze[Xe],de);ze.length===2?q(v,I,P):v.projectionMatrix.copy(I.projectionMatrix),Me(Z,v,de)};function Me(Z,ce,Pe){Pe===null?Z.matrix.copy(ce.matrixWorld):(Z.matrix.copy(Pe.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ce.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ce.projectionMatrix),Z.projectionMatrixInverse.copy(ce.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ga*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(g===null&&_===null))return u},this.setFoveation=function(Z){u=Z,g!==null&&(g.fixedFoveation=Z),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=Z)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(v)};let ye=null;function Ce(Z,ce){if(f=ce.getViewerPose(d||a),x=ce,f!==null){const Pe=f.views;_!==null&&(e.setRenderTargetFramebuffer(b,_.framebuffer),e.setRenderTarget(b));let de=!1;Pe.length!==v.cameras.length&&(v.cameras.length=0,de=!0);for(let Xe=0;Xe<Pe.length;Xe++){const Ke=Pe[Xe];let xt=null;if(_!==null)xt=_.getViewport(Ke);else{const St=m.getViewSubImage(g,Ke);xt=St.viewport,Xe===0&&(e.setRenderTargetTextures(b,St.colorTexture,g.ignoreDepthValues?void 0:St.depthStencilTexture),e.setRenderTarget(b))}let et=p[Xe];et===void 0&&(et=new on,et.layers.enable(Xe),et.viewport=new bt,p[Xe]=et),et.matrix.fromArray(Ke.transform.matrix),et.matrix.decompose(et.position,et.quaternion,et.scale),et.projectionMatrix.fromArray(Ke.projectionMatrix),et.projectionMatrixInverse.copy(et.projectionMatrix).invert(),et.viewport.set(xt.x,xt.y,xt.width,xt.height),Xe===0&&(v.matrix.copy(et.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),de===!0&&v.cameras.push(et)}const ze=s.enabledFeatures;if(ze&&ze.includes("depth-sensing")){const Xe=m.getDepthInformation(Pe[0]);Xe&&Xe.isValid&&Xe.texture&&E.init(e,Xe,s.renderState)}}for(let Pe=0;Pe<R.length;Pe++){const de=T[Pe],ze=R[Pe];de!==null&&ze!==void 0&&ze.update(de,ce,d||a)}ye&&ye(Z,ce),ce.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ce}),x=null}const rt=new rc;rt.setAnimationLoop(Ce),this.setAnimationLoop=function(Z){ye=Z},this.dispose=function(){}}}const hi=new On,Rm=new yt;function Cm(i,e){function t(h,c){h.matrixAutoUpdate===!0&&h.updateMatrix(),c.value.copy(h.matrix)}function n(h,c){c.color.getRGB(h.fogColor.value,tc(i)),c.isFog?(h.fogNear.value=c.near,h.fogFar.value=c.far):c.isFogExp2&&(h.fogDensity.value=c.density)}function s(h,c,b,R,T){c.isMeshBasicMaterial||c.isMeshLambertMaterial?r(h,c):c.isMeshToonMaterial?(r(h,c),m(h,c)):c.isMeshPhongMaterial?(r(h,c),f(h,c)):c.isMeshStandardMaterial?(r(h,c),g(h,c),c.isMeshPhysicalMaterial&&_(h,c,T)):c.isMeshMatcapMaterial?(r(h,c),x(h,c)):c.isMeshDepthMaterial?r(h,c):c.isMeshDistanceMaterial?(r(h,c),E(h,c)):c.isMeshNormalMaterial?r(h,c):c.isLineBasicMaterial?(a(h,c),c.isLineDashedMaterial&&o(h,c)):c.isPointsMaterial?u(h,c,b,R):c.isSpriteMaterial?d(h,c):c.isShadowMaterial?(h.color.value.copy(c.color),h.opacity.value=c.opacity):c.isShaderMaterial&&(c.uniformsNeedUpdate=!1)}function r(h,c){h.opacity.value=c.opacity,c.color&&h.diffuse.value.copy(c.color),c.emissive&&h.emissive.value.copy(c.emissive).multiplyScalar(c.emissiveIntensity),c.map&&(h.map.value=c.map,t(c.map,h.mapTransform)),c.alphaMap&&(h.alphaMap.value=c.alphaMap,t(c.alphaMap,h.alphaMapTransform)),c.bumpMap&&(h.bumpMap.value=c.bumpMap,t(c.bumpMap,h.bumpMapTransform),h.bumpScale.value=c.bumpScale,c.side===$t&&(h.bumpScale.value*=-1)),c.normalMap&&(h.normalMap.value=c.normalMap,t(c.normalMap,h.normalMapTransform),h.normalScale.value.copy(c.normalScale),c.side===$t&&h.normalScale.value.negate()),c.displacementMap&&(h.displacementMap.value=c.displacementMap,t(c.displacementMap,h.displacementMapTransform),h.displacementScale.value=c.displacementScale,h.displacementBias.value=c.displacementBias),c.emissiveMap&&(h.emissiveMap.value=c.emissiveMap,t(c.emissiveMap,h.emissiveMapTransform)),c.specularMap&&(h.specularMap.value=c.specularMap,t(c.specularMap,h.specularMapTransform)),c.alphaTest>0&&(h.alphaTest.value=c.alphaTest);const b=e.get(c),R=b.envMap,T=b.envMapRotation;R&&(h.envMap.value=R,hi.copy(T),hi.x*=-1,hi.y*=-1,hi.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),h.envMapRotation.value.setFromMatrix4(Rm.makeRotationFromEuler(hi)),h.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.reflectivity.value=c.reflectivity,h.ior.value=c.ior,h.refractionRatio.value=c.refractionRatio),c.lightMap&&(h.lightMap.value=c.lightMap,h.lightMapIntensity.value=c.lightMapIntensity,t(c.lightMap,h.lightMapTransform)),c.aoMap&&(h.aoMap.value=c.aoMap,h.aoMapIntensity.value=c.aoMapIntensity,t(c.aoMap,h.aoMapTransform))}function a(h,c){h.diffuse.value.copy(c.color),h.opacity.value=c.opacity,c.map&&(h.map.value=c.map,t(c.map,h.mapTransform))}function o(h,c){h.dashSize.value=c.dashSize,h.totalSize.value=c.dashSize+c.gapSize,h.scale.value=c.scale}function u(h,c,b,R){h.diffuse.value.copy(c.color),h.opacity.value=c.opacity,h.size.value=c.size*b,h.scale.value=R*.5,c.map&&(h.map.value=c.map,t(c.map,h.uvTransform)),c.alphaMap&&(h.alphaMap.value=c.alphaMap,t(c.alphaMap,h.alphaMapTransform)),c.alphaTest>0&&(h.alphaTest.value=c.alphaTest)}function d(h,c){h.diffuse.value.copy(c.color),h.opacity.value=c.opacity,h.rotation.value=c.rotation,c.map&&(h.map.value=c.map,t(c.map,h.mapTransform)),c.alphaMap&&(h.alphaMap.value=c.alphaMap,t(c.alphaMap,h.alphaMapTransform)),c.alphaTest>0&&(h.alphaTest.value=c.alphaTest)}function f(h,c){h.specular.value.copy(c.specular),h.shininess.value=Math.max(c.shininess,1e-4)}function m(h,c){c.gradientMap&&(h.gradientMap.value=c.gradientMap)}function g(h,c){h.metalness.value=c.metalness,c.metalnessMap&&(h.metalnessMap.value=c.metalnessMap,t(c.metalnessMap,h.metalnessMapTransform)),h.roughness.value=c.roughness,c.roughnessMap&&(h.roughnessMap.value=c.roughnessMap,t(c.roughnessMap,h.roughnessMapTransform)),c.envMap&&(h.envMapIntensity.value=c.envMapIntensity)}function _(h,c,b){h.ior.value=c.ior,c.sheen>0&&(h.sheenColor.value.copy(c.sheenColor).multiplyScalar(c.sheen),h.sheenRoughness.value=c.sheenRoughness,c.sheenColorMap&&(h.sheenColorMap.value=c.sheenColorMap,t(c.sheenColorMap,h.sheenColorMapTransform)),c.sheenRoughnessMap&&(h.sheenRoughnessMap.value=c.sheenRoughnessMap,t(c.sheenRoughnessMap,h.sheenRoughnessMapTransform))),c.clearcoat>0&&(h.clearcoat.value=c.clearcoat,h.clearcoatRoughness.value=c.clearcoatRoughness,c.clearcoatMap&&(h.clearcoatMap.value=c.clearcoatMap,t(c.clearcoatMap,h.clearcoatMapTransform)),c.clearcoatRoughnessMap&&(h.clearcoatRoughnessMap.value=c.clearcoatRoughnessMap,t(c.clearcoatRoughnessMap,h.clearcoatRoughnessMapTransform)),c.clearcoatNormalMap&&(h.clearcoatNormalMap.value=c.clearcoatNormalMap,t(c.clearcoatNormalMap,h.clearcoatNormalMapTransform),h.clearcoatNormalScale.value.copy(c.clearcoatNormalScale),c.side===$t&&h.clearcoatNormalScale.value.negate())),c.dispersion>0&&(h.dispersion.value=c.dispersion),c.iridescence>0&&(h.iridescence.value=c.iridescence,h.iridescenceIOR.value=c.iridescenceIOR,h.iridescenceThicknessMinimum.value=c.iridescenceThicknessRange[0],h.iridescenceThicknessMaximum.value=c.iridescenceThicknessRange[1],c.iridescenceMap&&(h.iridescenceMap.value=c.iridescenceMap,t(c.iridescenceMap,h.iridescenceMapTransform)),c.iridescenceThicknessMap&&(h.iridescenceThicknessMap.value=c.iridescenceThicknessMap,t(c.iridescenceThicknessMap,h.iridescenceThicknessMapTransform))),c.transmission>0&&(h.transmission.value=c.transmission,h.transmissionSamplerMap.value=b.texture,h.transmissionSamplerSize.value.set(b.width,b.height),c.transmissionMap&&(h.transmissionMap.value=c.transmissionMap,t(c.transmissionMap,h.transmissionMapTransform)),h.thickness.value=c.thickness,c.thicknessMap&&(h.thicknessMap.value=c.thicknessMap,t(c.thicknessMap,h.thicknessMapTransform)),h.attenuationDistance.value=c.attenuationDistance,h.attenuationColor.value.copy(c.attenuationColor)),c.anisotropy>0&&(h.anisotropyVector.value.set(c.anisotropy*Math.cos(c.anisotropyRotation),c.anisotropy*Math.sin(c.anisotropyRotation)),c.anisotropyMap&&(h.anisotropyMap.value=c.anisotropyMap,t(c.anisotropyMap,h.anisotropyMapTransform))),h.specularIntensity.value=c.specularIntensity,h.specularColor.value.copy(c.specularColor),c.specularColorMap&&(h.specularColorMap.value=c.specularColorMap,t(c.specularColorMap,h.specularColorMapTransform)),c.specularIntensityMap&&(h.specularIntensityMap.value=c.specularIntensityMap,t(c.specularIntensityMap,h.specularIntensityMapTransform))}function x(h,c){c.matcap&&(h.matcap.value=c.matcap)}function E(h,c){const b=e.get(c).light;h.referencePosition.value.setFromMatrixPosition(b.matrixWorld),h.nearDistance.value=b.shadow.camera.near,h.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Pm(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function u(b,R){const T=R.program;n.uniformBlockBinding(b,T)}function d(b,R){let T=s[b.id];T===void 0&&(x(b),T=f(b),s[b.id]=T,b.addEventListener("dispose",h));const F=R.program;n.updateUBOMapping(b,F);const D=e.render.frame;r[b.id]!==D&&(g(b),r[b.id]=D)}function f(b){const R=m();b.__bindingPointIndex=R;const T=i.createBuffer(),F=b.__size,D=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,F,D),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,T),T}function m(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(b){const R=s[b.id],T=b.uniforms,F=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let D=0,I=T.length;D<I;D++){const P=Array.isArray(T[D])?T[D]:[T[D]];for(let p=0,v=P.length;p<v;p++){const A=P[p];if(_(A,D,p,F)===!0){const C=A.__offset,H=Array.isArray(A.value)?A.value:[A.value];let X=0;for(let j=0;j<H.length;j++){const $=H[j],ae=E($);typeof $=="number"||typeof $=="boolean"?(A.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,C+X,A.__data)):$.isMatrix3?(A.__data[0]=$.elements[0],A.__data[1]=$.elements[1],A.__data[2]=$.elements[2],A.__data[3]=0,A.__data[4]=$.elements[3],A.__data[5]=$.elements[4],A.__data[6]=$.elements[5],A.__data[7]=0,A.__data[8]=$.elements[6],A.__data[9]=$.elements[7],A.__data[10]=$.elements[8],A.__data[11]=0):($.toArray(A.__data,X),X+=ae.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,C,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function _(b,R,T,F){const D=b.value,I=R+"_"+T;if(F[I]===void 0)return typeof D=="number"||typeof D=="boolean"?F[I]=D:F[I]=D.clone(),!0;{const P=F[I];if(typeof D=="number"||typeof D=="boolean"){if(P!==D)return F[I]=D,!0}else if(P.equals(D)===!1)return P.copy(D),!0}return!1}function x(b){const R=b.uniforms;let T=0;const F=16;for(let I=0,P=R.length;I<P;I++){const p=Array.isArray(R[I])?R[I]:[R[I]];for(let v=0,A=p.length;v<A;v++){const C=p[v],H=Array.isArray(C.value)?C.value:[C.value];for(let X=0,j=H.length;X<j;X++){const $=H[X],ae=E($),q=T%F,he=q%ae.boundary,Me=q+he;T+=he,Me!==0&&F-Me<ae.storage&&(T+=F-Me),C.__data=new Float32Array(ae.storage/Float32Array.BYTES_PER_ELEMENT),C.__offset=T,T+=ae.storage}}}const D=T%F;return D>0&&(T+=F-D),b.__size=T,b.__cache={},this}function E(b){const R={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(R.boundary=4,R.storage=4):b.isVector2?(R.boundary=8,R.storage=8):b.isVector3||b.isColor?(R.boundary=16,R.storage=12):b.isVector4?(R.boundary=16,R.storage=16):b.isMatrix3?(R.boundary=48,R.storage=48):b.isMatrix4?(R.boundary=64,R.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),R}function h(b){const R=b.target;R.removeEventListener("dispose",h);const T=a.indexOf(R.__bindingPointIndex);a.splice(T,1),i.deleteBuffer(s[R.id]),delete s[R.id],delete r[R.id]}function c(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:u,update:d,dispose:c}}class Lm{constructor(e={}){const{canvas:t=_u(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:d=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:m=!1,reverseDepthBuffer:g=!1}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;const x=new Uint32Array(4),E=new Int32Array(4);let h=null,c=null;const b=[],R=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=tn,this.toneMapping=Jn,this.toneMappingExposure=1;const T=this;let F=!1,D=0,I=0,P=null,p=-1,v=null;const A=new bt,C=new bt;let H=null;const X=new _t(0);let j=0,$=t.width,ae=t.height,q=1,he=null,Me=null;const ye=new bt(0,0,$,ae),Ce=new bt(0,0,$,ae);let rt=!1;const Z=new sc;let ce=!1,Pe=!1;const de=new yt,ze=new yt,Xe=new N,Ke=new bt,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let et=!1;function St(){return P===null?q:1}let k=n;function zt(y,O){return t.getContext(y,O)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:u,preserveDrawingBuffer:d,powerPreference:f,failIfMajorPerformanceCaveat:m};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Wa}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",_e,!1),k===null){const O="webgl2";if(k=zt(O,y),k===null)throw zt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Fe,He,De,ft,Ie,w,S,G,ne,ie,Q,Te,re,Se,Qe,oe,Ee,Oe,Ue,fe,$e,Ne,at,U;function pe(){Fe=new Fh(k),Fe.init(),Ne=new Sm(k,Fe),He=new Ph(k,Fe,e,Ne),De=new vm(k,Fe),He.reverseDepthBuffer&&g&&De.buffers.depth.setReversed(!0),ft=new zh(k),Ie=new im,w=new Mm(k,Fe,De,Ie,He,Ne,ft),S=new Dh(T),G=new Nh(T),ne=new Xu(k),at=new Rh(k,ne),ie=new Oh(k,ne,ft,at),Q=new Hh(k,ie,ne,ft),Ue=new kh(k,He,w),oe=new Lh(Ie),Te=new nm(T,S,G,Fe,He,at,oe),re=new Cm(T,Ie),Se=new rm,Qe=new dm(Fe),Oe=new wh(T,S,G,De,Q,_,u),Ee=new gm(T,Q,He),U=new Pm(k,ft,He,De),fe=new Ch(k,Fe,ft),$e=new Bh(k,Fe,ft),ft.programs=Te.programs,T.capabilities=He,T.extensions=Fe,T.properties=Ie,T.renderLists=Se,T.shadowMap=Ee,T.state=De,T.info=ft}pe();const Y=new wm(T,k);this.xr=Y,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const y=Fe.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Fe.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(y){y!==void 0&&(q=y,this.setSize($,ae,!1))},this.getSize=function(y){return y.set($,ae)},this.setSize=function(y,O,V=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=y,ae=O,t.width=Math.floor(y*q),t.height=Math.floor(O*q),V===!0&&(t.style.width=y+"px",t.style.height=O+"px"),this.setViewport(0,0,y,O)},this.getDrawingBufferSize=function(y){return y.set($*q,ae*q).floor()},this.setDrawingBufferSize=function(y,O,V){$=y,ae=O,q=V,t.width=Math.floor(y*V),t.height=Math.floor(O*V),this.setViewport(0,0,y,O)},this.getCurrentViewport=function(y){return y.copy(A)},this.getViewport=function(y){return y.copy(ye)},this.setViewport=function(y,O,V,W){y.isVector4?ye.set(y.x,y.y,y.z,y.w):ye.set(y,O,V,W),De.viewport(A.copy(ye).multiplyScalar(q).round())},this.getScissor=function(y){return y.copy(Ce)},this.setScissor=function(y,O,V,W){y.isVector4?Ce.set(y.x,y.y,y.z,y.w):Ce.set(y,O,V,W),De.scissor(C.copy(Ce).multiplyScalar(q).round())},this.getScissorTest=function(){return rt},this.setScissorTest=function(y){De.setScissorTest(rt=y)},this.setOpaqueSort=function(y){he=y},this.setTransparentSort=function(y){Me=y},this.getClearColor=function(y){return y.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor.apply(Oe,arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha.apply(Oe,arguments)},this.clear=function(y=!0,O=!0,V=!0){let W=0;if(y){let z=!1;if(P!==null){const le=P.texture.format;z=le===ja||le===Ka||le===$a}if(z){const le=P.texture.type,ve=le===Fn||le===ei||le===gs||le===Ki||le===qa||le===Ya,be=Oe.getClearColor(),Ae=Oe.getClearAlpha(),ke=be.r,Ve=be.g,we=be.b;ve?(x[0]=ke,x[1]=Ve,x[2]=we,x[3]=Ae,k.clearBufferuiv(k.COLOR,0,x)):(E[0]=ke,E[1]=Ve,E[2]=we,E[3]=Ae,k.clearBufferiv(k.COLOR,0,E))}else W|=k.COLOR_BUFFER_BIT}O&&(W|=k.DEPTH_BUFFER_BIT),V&&(W|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),Se.dispose(),Qe.dispose(),Ie.dispose(),S.dispose(),G.dispose(),Q.dispose(),at.dispose(),U.dispose(),Te.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",xn),Y.removeEventListener("sessionend",Ms),Kt.stop()};function te(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),F=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),F=!1;const y=ft.autoReset,O=Ee.enabled,V=Ee.autoUpdate,W=Ee.needsUpdate,z=Ee.type;pe(),ft.autoReset=y,Ee.enabled=O,Ee.autoUpdate=V,Ee.needsUpdate=W,Ee.type=z}function _e(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ge(y){const O=y.target;O.removeEventListener("dispose",Ge),Mt(O)}function Mt(y){Tt(y),Ie.remove(y)}function Tt(y){const O=Ie.get(y).programs;O!==void 0&&(O.forEach(function(V){Te.releaseProgram(V)}),y.isShaderMaterial&&Te.releaseShaderCache(y))}this.renderBufferDirect=function(y,O,V,W,z,le){O===null&&(O=xt);const ve=z.isMesh&&z.matrixWorld.determinant()<0,be=sn(y,O,V,W,z);De.setMaterial(W,ve);let Ae=V.index,ke=1;if(W.wireframe===!0){if(Ae=ie.getWireframeAttribute(V),Ae===void 0)return;ke=2}const Ve=V.drawRange,we=V.attributes.position;let it=Ve.start*ke,ht=(Ve.start+Ve.count)*ke;le!==null&&(it=Math.max(it,le.start*ke),ht=Math.min(ht,(le.start+le.count)*ke)),Ae!==null?(it=Math.max(it,0),ht=Math.min(ht,Ae.count)):we!=null&&(it=Math.max(it,0),ht=Math.min(ht,we.count));const pt=ht-it;if(pt<0||pt===1/0)return;at.setup(z,W,be,V,Ae);let It,ot=fe;if(Ae!==null&&(It=ne.get(Ae),ot=$e,ot.setIndex(It)),z.isMesh)W.wireframe===!0?(De.setLineWidth(W.wireframeLinewidth*St()),ot.setMode(k.LINES)):ot.setMode(k.TRIANGLES);else if(z.isLine){let Re=W.linewidth;Re===void 0&&(Re=1),De.setLineWidth(Re*St()),z.isLineSegments?ot.setMode(k.LINES):z.isLineLoop?ot.setMode(k.LINE_LOOP):ot.setMode(k.LINE_STRIP)}else z.isPoints?ot.setMode(k.POINTS):z.isSprite&&ot.setMode(k.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)ot.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Fe.get("WEBGL_multi_draw"))ot.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Re=z._multiDrawStarts,jt=z._multiDrawCounts,ut=z._multiDrawCount,Wt=Ae?ne.get(Ae).bytesPerElement:1,An=Ie.get(W).currentProgram.getUniforms();for(let Nt=0;Nt<ut;Nt++)An.setValue(k,"_gl_DrawID",Nt),ot.render(Re[Nt]/Wt,jt[Nt])}else if(z.isInstancedMesh)ot.renderInstances(it,pt,z.count);else if(V.isInstancedBufferGeometry){const Re=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,jt=Math.min(V.instanceCount,Re);ot.renderInstances(it,pt,jt)}else ot.render(it,pt)};function ct(y,O,V){y.transparent===!0&&y.side===pn&&y.forceSinglePass===!1?(y.side=$t,y.needsUpdate=!0,kn(y,O,V),y.side=Qn,y.needsUpdate=!0,kn(y,O,V),y.side=pn):kn(y,O,V)}this.compile=function(y,O,V=null){V===null&&(V=y),c=Qe.get(V),c.init(O),R.push(c),V.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(c.pushLight(z),z.castShadow&&c.pushShadow(z))}),y!==V&&y.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(c.pushLight(z),z.castShadow&&c.pushShadow(z))}),c.setupLights();const W=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const le=z.material;if(le)if(Array.isArray(le))for(let ve=0;ve<le.length;ve++){const be=le[ve];ct(be,V,z),W.add(be)}else ct(le,V,z),W.add(le)}),R.pop(),c=null,W},this.compileAsync=function(y,O,V=null){const W=this.compile(y,O,V);return new Promise(z=>{function le(){if(W.forEach(function(ve){Ie.get(ve).currentProgram.isReady()&&W.delete(ve)}),W.size===0){z(y);return}setTimeout(le,10)}Fe.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let kt=null;function ln(y){kt&&kt(y)}function xn(){Kt.stop()}function Ms(){Kt.start()}const Kt=new rc;Kt.setAnimationLoop(ln),typeof self<"u"&&Kt.setContext(self),this.setAnimationLoop=function(y){kt=y,Y.setAnimationLoop(y),y===null?Kt.stop():Kt.start()},Y.addEventListener("sessionstart",xn),Y.addEventListener("sessionend",Ms),this.render=function(y,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(O),O=Y.getCamera()),y.isScene===!0&&y.onBeforeRender(T,y,O,P),c=Qe.get(y,R.length),c.init(O),R.push(c),ze.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Z.setFromProjectionMatrix(ze),Pe=this.localClippingEnabled,ce=oe.init(this.clippingPlanes,Pe),h=Se.get(y,b.length),h.init(),b.push(h),Y.enabled===!0&&Y.isPresenting===!0){const le=T.xr.getDepthSensingMesh();le!==null&&Bn(le,O,-1/0,T.sortObjects)}Bn(y,O,0,T.sortObjects),h.finish(),T.sortObjects===!0&&h.sort(he,Me),et=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,et&&Oe.addToRenderList(h,y),this.info.render.frame++,ce===!0&&oe.beginShadows();const V=c.state.shadowsArray;Ee.render(V,y,O),ce===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=h.opaque,z=h.transmissive;if(c.setupLights(),O.isArrayCamera){const le=O.cameras;if(z.length>0)for(let ve=0,be=le.length;ve<be;ve++){const Ae=le[ve];zn(W,z,y,Ae)}et&&Oe.render(y);for(let ve=0,be=le.length;ve<be;ve++){const Ae=le[ve];Si(h,y,Ae,Ae.viewport)}}else z.length>0&&zn(W,z,y,O),et&&Oe.render(y),Si(h,y,O);P!==null&&(w.updateMultisampleRenderTarget(P),w.updateRenderTargetMipmap(P)),y.isScene===!0&&y.onAfterRender(T,y,O),at.resetDefaultState(),p=-1,v=null,R.pop(),R.length>0?(c=R[R.length-1],ce===!0&&oe.setGlobalState(T.clippingPlanes,c.state.camera)):c=null,b.pop(),b.length>0?h=b[b.length-1]:h=null};function Bn(y,O,V,W){if(y.visible===!1)return;if(y.layers.test(O.layers)){if(y.isGroup)V=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(O);else if(y.isLight)c.pushLight(y),y.castShadow&&c.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Z.intersectsSprite(y)){W&&Ke.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ze);const ve=Q.update(y),be=y.material;be.visible&&h.push(y,ve,be,V,Ke.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Z.intersectsObject(y))){const ve=Q.update(y),be=y.material;if(W&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ke.copy(y.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Ke.copy(ve.boundingSphere.center)),Ke.applyMatrix4(y.matrixWorld).applyMatrix4(ze)),Array.isArray(be)){const Ae=ve.groups;for(let ke=0,Ve=Ae.length;ke<Ve;ke++){const we=Ae[ke],it=be[we.materialIndex];it&&it.visible&&h.push(y,ve,it,V,Ke.z,we)}}else be.visible&&h.push(y,ve,be,V,Ke.z,null)}}const le=y.children;for(let ve=0,be=le.length;ve<be;ve++)Bn(le[ve],O,V,W)}function Si(y,O,V,W){const z=y.opaque,le=y.transmissive,ve=y.transparent;c.setupLightsView(V),ce===!0&&oe.setGlobalState(T.clippingPlanes,V),W&&De.viewport(A.copy(W)),z.length>0&&cn(z,O,V),le.length>0&&cn(le,O,V),ve.length>0&&cn(ve,O,V),De.buffers.depth.setTest(!0),De.buffers.depth.setMask(!0),De.buffers.color.setMask(!0),De.setPolygonOffset(!1)}function zn(y,O,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;c.state.transmissionRenderTarget[W.id]===void 0&&(c.state.transmissionRenderTarget[W.id]=new ti(1,1,{generateMipmaps:!0,type:Fe.has("EXT_color_buffer_half_float")||Fe.has("EXT_color_buffer_float")?Ji:Fn,minFilter:xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:lt.workingColorSpace}));const le=c.state.transmissionRenderTarget[W.id],ve=W.viewport||A;le.setSize(ve.z,ve.w);const be=T.getRenderTarget();T.setRenderTarget(le),T.getClearColor(X),j=T.getClearAlpha(),j<1&&T.setClearColor(16777215,.5),T.clear(),et&&Oe.render(V);const Ae=T.toneMapping;T.toneMapping=Jn;const ke=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),c.setupLightsView(W),ce===!0&&oe.setGlobalState(T.clippingPlanes,W),cn(y,V,W),w.updateMultisampleRenderTarget(le),w.updateRenderTargetMipmap(le),Fe.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let we=0,it=O.length;we<it;we++){const ht=O[we],pt=ht.object,It=ht.geometry,ot=ht.material,Re=ht.group;if(ot.side===pn&&pt.layers.test(W.layers)){const jt=ot.side;ot.side=$t,ot.needsUpdate=!0,Ei(pt,V,W,It,ot,Re),ot.side=jt,ot.needsUpdate=!0,Ve=!0}}Ve===!0&&(w.updateMultisampleRenderTarget(le),w.updateRenderTargetMipmap(le))}T.setRenderTarget(be),T.setClearColor(X,j),ke!==void 0&&(W.viewport=ke),T.toneMapping=Ae}function cn(y,O,V){const W=O.isScene===!0?O.overrideMaterial:null;for(let z=0,le=y.length;z<le;z++){const ve=y[z],be=ve.object,Ae=ve.geometry,ke=W===null?ve.material:W,Ve=ve.group;be.layers.test(V.layers)&&Ei(be,O,V,Ae,ke,Ve)}}function Ei(y,O,V,W,z,le){y.onBeforeRender(T,O,V,W,z,le),y.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(T,O,V,W,y,le),z.transparent===!0&&z.side===pn&&z.forceSinglePass===!1?(z.side=$t,z.needsUpdate=!0,T.renderBufferDirect(V,O,W,z,y,le),z.side=Qn,z.needsUpdate=!0,T.renderBufferDirect(V,O,W,z,y,le),z.side=pn):T.renderBufferDirect(V,O,W,z,y,le),y.onAfterRender(T,O,V,W,z,le)}function kn(y,O,V){O.isScene!==!0&&(O=xt);const W=Ie.get(y),z=c.state.lights,le=c.state.shadowsArray,ve=z.state.version,be=Te.getParameters(y,z.state,le,O,V),Ae=Te.getProgramCacheKey(be);let ke=W.programs;W.environment=y.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(y.isMeshStandardMaterial?G:S).get(y.envMap||W.environment),W.envMapRotation=W.environment!==null&&y.envMap===null?O.environmentRotation:y.envMapRotation,ke===void 0&&(y.addEventListener("dispose",Ge),ke=new Map,W.programs=ke);let Ve=ke.get(Ae);if(Ve!==void 0){if(W.currentProgram===Ve&&W.lightsStateVersion===ve)return Mn(y,be),Ve}else be.uniforms=Te.getUniforms(y),y.onBeforeCompile(be,T),Ve=Te.acquireProgram(be,Ae),ke.set(Ae,Ve),W.uniforms=be.uniforms;const we=W.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(we.clippingPlanes=oe.uniform),Mn(y,be),W.needsLights=Hn(y),W.lightsStateVersion=ve,W.needsLights&&(we.ambientLightColor.value=z.state.ambient,we.lightProbe.value=z.state.probe,we.directionalLights.value=z.state.directional,we.directionalLightShadows.value=z.state.directionalShadow,we.spotLights.value=z.state.spot,we.spotLightShadows.value=z.state.spotShadow,we.rectAreaLights.value=z.state.rectArea,we.ltc_1.value=z.state.rectAreaLTC1,we.ltc_2.value=z.state.rectAreaLTC2,we.pointLights.value=z.state.point,we.pointLightShadows.value=z.state.pointShadow,we.hemisphereLights.value=z.state.hemi,we.directionalShadowMap.value=z.state.directionalShadowMap,we.directionalShadowMatrix.value=z.state.directionalShadowMatrix,we.spotShadowMap.value=z.state.spotShadowMap,we.spotLightMatrix.value=z.state.spotLightMatrix,we.spotLightMap.value=z.state.spotLightMap,we.pointShadowMap.value=z.state.pointShadowMap,we.pointShadowMatrix.value=z.state.pointShadowMatrix),W.currentProgram=Ve,W.uniformsList=null,Ve}function Ss(y){if(y.uniformsList===null){const O=y.currentProgram.getUniforms();y.uniformsList=er.seqWithValue(O.seq,y.uniforms)}return y.uniformsList}function Mn(y,O){const V=Ie.get(y);V.outputColorSpace=O.outputColorSpace,V.batching=O.batching,V.batchingColor=O.batchingColor,V.instancing=O.instancing,V.instancingColor=O.instancingColor,V.instancingMorph=O.instancingMorph,V.skinning=O.skinning,V.morphTargets=O.morphTargets,V.morphNormals=O.morphNormals,V.morphColors=O.morphColors,V.morphTargetsCount=O.morphTargetsCount,V.numClippingPlanes=O.numClippingPlanes,V.numIntersection=O.numClipIntersection,V.vertexAlphas=O.vertexAlphas,V.vertexTangents=O.vertexTangents,V.toneMapping=O.toneMapping}function sn(y,O,V,W,z){O.isScene!==!0&&(O=xt),w.resetTextureUnits();const le=O.fog,ve=W.isMeshStandardMaterial?O.environment:null,be=P===null?T.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Qi,Ae=(W.isMeshStandardMaterial?G:S).get(W.envMap||ve),ke=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Ve=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),we=!!V.morphAttributes.position,it=!!V.morphAttributes.normal,ht=!!V.morphAttributes.color;let pt=Jn;W.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(pt=T.toneMapping);const It=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ot=It!==void 0?It.length:0,Re=Ie.get(W),jt=c.state.lights;if(ce===!0&&(Pe===!0||y!==v)){const Xt=y===v&&W.id===p;oe.setState(W,y,Xt)}let ut=!1;W.version===Re.__version?(Re.needsLights&&Re.lightsStateVersion!==jt.state.version||Re.outputColorSpace!==be||z.isBatchedMesh&&Re.batching===!1||!z.isBatchedMesh&&Re.batching===!0||z.isBatchedMesh&&Re.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Re.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Re.instancing===!1||!z.isInstancedMesh&&Re.instancing===!0||z.isSkinnedMesh&&Re.skinning===!1||!z.isSkinnedMesh&&Re.skinning===!0||z.isInstancedMesh&&Re.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Re.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Re.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Re.instancingMorph===!1&&z.morphTexture!==null||Re.envMap!==Ae||W.fog===!0&&Re.fog!==le||Re.numClippingPlanes!==void 0&&(Re.numClippingPlanes!==oe.numPlanes||Re.numIntersection!==oe.numIntersection)||Re.vertexAlphas!==ke||Re.vertexTangents!==Ve||Re.morphTargets!==we||Re.morphNormals!==it||Re.morphColors!==ht||Re.toneMapping!==pt||Re.morphTargetsCount!==ot)&&(ut=!0):(ut=!0,Re.__version=W.version);let Wt=Re.currentProgram;ut===!0&&(Wt=kn(W,O,z));let An=!1,Nt=!1,ni=!1;const mt=Wt.getUniforms(),rn=Re.uniforms;if(De.useProgram(Wt.program)&&(An=!0,Nt=!0,ni=!0),W.id!==p&&(p=W.id,Nt=!0),An||v!==y){De.buffers.depth.getReversed()?(de.copy(y.projectionMatrix),xu(de),Mu(de),mt.setValue(k,"projectionMatrix",de)):mt.setValue(k,"projectionMatrix",y.projectionMatrix),mt.setValue(k,"viewMatrix",y.matrixWorldInverse);const Sn=mt.map.cameraPosition;Sn!==void 0&&Sn.setValue(k,Xe.setFromMatrixPosition(y.matrixWorld)),He.logarithmicDepthBuffer&&mt.setValue(k,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&mt.setValue(k,"isOrthographic",y.isOrthographicCamera===!0),v!==y&&(v=y,Nt=!0,ni=!0)}if(z.isSkinnedMesh){mt.setOptional(k,z,"bindMatrix"),mt.setOptional(k,z,"bindMatrixInverse");const Xt=z.skeleton;Xt&&(Xt.boneTexture===null&&Xt.computeBoneTexture(),mt.setValue(k,"boneTexture",Xt.boneTexture,w))}z.isBatchedMesh&&(mt.setOptional(k,z,"batchingTexture"),mt.setValue(k,"batchingTexture",z._matricesTexture,w),mt.setOptional(k,z,"batchingIdTexture"),mt.setValue(k,"batchingIdTexture",z._indirectTexture,w),mt.setOptional(k,z,"batchingColorTexture"),z._colorsTexture!==null&&mt.setValue(k,"batchingColorTexture",z._colorsTexture,w));const Gn=V.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&Ue.update(z,V,Wt),(Nt||Re.receiveShadow!==z.receiveShadow)&&(Re.receiveShadow=z.receiveShadow,mt.setValue(k,"receiveShadow",z.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(rn.envMap.value=Ae,rn.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(rn.envMapIntensity.value=O.environmentIntensity),Nt&&(mt.setValue(k,"toneMappingExposure",T.toneMappingExposure),Re.needsLights&&yi(rn,ni),le&&W.fog===!0&&re.refreshFogUniforms(rn,le),re.refreshMaterialUniforms(rn,W,q,ae,c.state.transmissionRenderTarget[y.id]),er.upload(k,Ss(Re),rn,w)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(er.upload(k,Ss(Re),rn,w),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&mt.setValue(k,"center",z.center),mt.setValue(k,"modelViewMatrix",z.modelViewMatrix),mt.setValue(k,"normalMatrix",z.normalMatrix),mt.setValue(k,"modelMatrix",z.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Xt=W.uniformsGroups;for(let Sn=0,En=Xt.length;Sn<En;Sn++){const ii=Xt[Sn];U.update(ii,Wt),U.bind(ii,Wt)}}return Wt}function yi(y,O){y.ambientLightColor.needsUpdate=O,y.lightProbe.needsUpdate=O,y.directionalLights.needsUpdate=O,y.directionalLightShadows.needsUpdate=O,y.pointLights.needsUpdate=O,y.pointLightShadows.needsUpdate=O,y.spotLights.needsUpdate=O,y.spotLightShadows.needsUpdate=O,y.rectAreaLights.needsUpdate=O,y.hemisphereLights.needsUpdate=O}function Hn(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(y,O,V){Ie.get(y.texture).__webglTexture=O,Ie.get(y.depthTexture).__webglTexture=V;const W=Ie.get(y);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||Fe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,O){const V=Ie.get(y);V.__webglFramebuffer=O,V.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(y,O=0,V=0){P=y,D=O,I=V;let W=!0,z=null,le=!1,ve=!1;if(y){const Ae=Ie.get(y);if(Ae.__useDefaultFramebuffer!==void 0)De.bindFramebuffer(k.FRAMEBUFFER,null),W=!1;else if(Ae.__webglFramebuffer===void 0)w.setupRenderTarget(y);else if(Ae.__hasExternalTextures)w.rebindTextures(y,Ie.get(y.texture).__webglTexture,Ie.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const we=y.depthTexture;if(Ae.__boundDepthTexture!==we){if(we!==null&&Ie.has(we)&&(y.width!==we.image.width||y.height!==we.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(y)}}const ke=y.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(ve=!0);const Ve=Ie.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ve[O])?z=Ve[O][V]:z=Ve[O],le=!0):y.samples>0&&w.useMultisampledRTT(y)===!1?z=Ie.get(y).__webglMultisampledFramebuffer:Array.isArray(Ve)?z=Ve[V]:z=Ve,A.copy(y.viewport),C.copy(y.scissor),H=y.scissorTest}else A.copy(ye).multiplyScalar(q).floor(),C.copy(Ce).multiplyScalar(q).floor(),H=rt;if(De.bindFramebuffer(k.FRAMEBUFFER,z)&&W&&De.drawBuffers(y,z),De.viewport(A),De.scissor(C),De.setScissorTest(H),le){const Ae=Ie.get(y.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ae.__webglTexture,V)}else if(ve){const Ae=Ie.get(y.texture),ke=O||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ae.__webglTexture,V||0,ke)}p=-1},this.readRenderTargetPixels=function(y,O,V,W,z,le,ve){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=Ie.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){De.bindFramebuffer(k.FRAMEBUFFER,be);try{const Ae=y.texture,ke=Ae.format,Ve=Ae.type;if(!He.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=y.width-W&&V>=0&&V<=y.height-z&&k.readPixels(O,V,W,z,Ne.convert(ke),Ne.convert(Ve),le)}finally{const Ae=P!==null?Ie.get(P).__webglFramebuffer:null;De.bindFramebuffer(k.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(y,O,V,W,z,le,ve){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=Ie.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){const Ae=y.texture,ke=Ae.format,Ve=Ae.type;if(!He.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=y.width-W&&V>=0&&V<=y.height-z){De.bindFramebuffer(k.FRAMEBUFFER,be);const we=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,we),k.bufferData(k.PIXEL_PACK_BUFFER,le.byteLength,k.STREAM_READ),k.readPixels(O,V,W,z,Ne.convert(ke),Ne.convert(Ve),0);const it=P!==null?Ie.get(P).__webglFramebuffer:null;De.bindFramebuffer(k.FRAMEBUFFER,it);const ht=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await vu(k,ht,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,we),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,le),k.deleteBuffer(we),k.deleteSync(ht),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,O=null,V=0){y.isTexture!==!0&&(ps("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,y=arguments[1]);const W=Math.pow(2,-V),z=Math.floor(y.image.width*W),le=Math.floor(y.image.height*W),ve=O!==null?O.x:0,be=O!==null?O.y:0;w.setTexture2D(y,0),k.copyTexSubImage2D(k.TEXTURE_2D,V,0,0,ve,be,z,le),De.unbindTexture()},this.copyTextureToTexture=function(y,O,V=null,W=null,z=0){y.isTexture!==!0&&(ps("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,y=arguments[1],O=arguments[2],z=arguments[3]||0,V=null);let le,ve,be,Ae,ke,Ve,we,it,ht;const pt=y.isCompressedTexture?y.mipmaps[z]:y.image;V!==null?(le=V.max.x-V.min.x,ve=V.max.y-V.min.y,be=V.isBox3?V.max.z-V.min.z:1,Ae=V.min.x,ke=V.min.y,Ve=V.isBox3?V.min.z:0):(le=pt.width,ve=pt.height,be=pt.depth||1,Ae=0,ke=0,Ve=0),W!==null?(we=W.x,it=W.y,ht=W.z):(we=0,it=0,ht=0);const It=Ne.convert(O.format),ot=Ne.convert(O.type);let Re;O.isData3DTexture?(w.setTexture3D(O,0),Re=k.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(w.setTexture2DArray(O,0),Re=k.TEXTURE_2D_ARRAY):(w.setTexture2D(O,0),Re=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,O.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,O.unpackAlignment);const jt=k.getParameter(k.UNPACK_ROW_LENGTH),ut=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Wt=k.getParameter(k.UNPACK_SKIP_PIXELS),An=k.getParameter(k.UNPACK_SKIP_ROWS),Nt=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,pt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,pt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ae),k.pixelStorei(k.UNPACK_SKIP_ROWS,ke),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Ve);const ni=y.isDataArrayTexture||y.isData3DTexture,mt=O.isDataArrayTexture||O.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const rn=Ie.get(y),Gn=Ie.get(O),Xt=Ie.get(rn.__renderTarget),Sn=Ie.get(Gn.__renderTarget);De.bindFramebuffer(k.READ_FRAMEBUFFER,Xt.__webglFramebuffer),De.bindFramebuffer(k.DRAW_FRAMEBUFFER,Sn.__webglFramebuffer);for(let En=0;En<be;En++)ni&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ie.get(y).__webglTexture,z,Ve+En),y.isDepthTexture?(mt&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ie.get(O).__webglTexture,z,ht+En),k.blitFramebuffer(Ae,ke,le,ve,we,it,le,ve,k.DEPTH_BUFFER_BIT,k.NEAREST)):mt?k.copyTexSubImage3D(Re,z,we,it,ht+En,Ae,ke,le,ve):k.copyTexSubImage2D(Re,z,we,it,ht+En,Ae,ke,le,ve);De.bindFramebuffer(k.READ_FRAMEBUFFER,null),De.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else mt?y.isDataTexture||y.isData3DTexture?k.texSubImage3D(Re,z,we,it,ht,le,ve,be,It,ot,pt.data):O.isCompressedArrayTexture?k.compressedTexSubImage3D(Re,z,we,it,ht,le,ve,be,It,pt.data):k.texSubImage3D(Re,z,we,it,ht,le,ve,be,It,ot,pt):y.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,z,we,it,le,ve,It,ot,pt.data):y.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,z,we,it,pt.width,pt.height,It,pt.data):k.texSubImage2D(k.TEXTURE_2D,z,we,it,le,ve,It,ot,pt);k.pixelStorei(k.UNPACK_ROW_LENGTH,jt),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,ut),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Wt),k.pixelStorei(k.UNPACK_SKIP_ROWS,An),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Nt),z===0&&O.generateMipmaps&&k.generateMipmap(Re),De.unbindTexture()},this.copyTextureToTexture3D=function(y,O,V=null,W=null,z=0){return y.isTexture!==!0&&(ps("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,W=arguments[1]||null,y=arguments[2],O=arguments[3],z=arguments[4]||0),ps('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,O,V,W,z)},this.initRenderTarget=function(y){Ie.get(y).__webglFramebuffer===void 0&&w.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?w.setTextureCube(y,0):y.isData3DTexture?w.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?w.setTexture2DArray(y,0):w.setTexture2D(y,0),De.unbindTexture()},this.resetState=function(){D=0,I=0,P=null,De.reset(),at.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=lt._getDrawingBufferColorSpace(e),t.unpackColorSpace=lt._getUnpackColorSpace()}}class ir extends Ut{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Dm extends Vt{constructor(e,t,n,s,r,a,o,u,d){super(e,t,n,s,r,a,o,u,d),this.isCanvasTexture=!0,this.needsUpdate=!0}}class to extends vn{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],a=[],o=[],u=[],d=new N,f=new dt;a.push(0,0,0),o.push(0,0,1),u.push(.5,.5);for(let m=0,g=3;m<=t;m++,g+=3){const _=n+m/t*s;d.x=e*Math.cos(_),d.y=e*Math.sin(_),a.push(d.x,d.y,d.z),o.push(0,0,1),f.x=(a[g]/e+1)/2,f.y=(a[g+1]/e+1)/2,u.push(f.x,f.y)}for(let m=1;m<=t;m++)r.push(m,m+1,0);this.setIndex(r),this.setAttribute("position",new Ct(a,3)),this.setAttribute("normal",new Ct(o,3)),this.setAttribute("uv",new Ct(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new to(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class cr extends vn{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,u=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:u};const d=this;s=Math.floor(s),r=Math.floor(r);const f=[],m=[],g=[],_=[];let x=0;const E=[],h=n/2;let c=0;b(),a===!1&&(e>0&&R(!0),t>0&&R(!1)),this.setIndex(f),this.setAttribute("position",new Ct(m,3)),this.setAttribute("normal",new Ct(g,3)),this.setAttribute("uv",new Ct(_,2));function b(){const T=new N,F=new N;let D=0;const I=(t-e)/n;for(let P=0;P<=r;P++){const p=[],v=P/r,A=v*(t-e)+e;for(let C=0;C<=s;C++){const H=C/s,X=H*u+o,j=Math.sin(X),$=Math.cos(X);F.x=A*j,F.y=-v*n+h,F.z=A*$,m.push(F.x,F.y,F.z),T.set(j,I,$).normalize(),g.push(T.x,T.y,T.z),_.push(H,1-v),p.push(x++)}E.push(p)}for(let P=0;P<s;P++)for(let p=0;p<r;p++){const v=E[p][P],A=E[p+1][P],C=E[p+1][P+1],H=E[p][P+1];(e>0||p!==0)&&(f.push(v,A,H),D+=3),(t>0||p!==r-1)&&(f.push(A,C,H),D+=3)}d.addGroup(c,D,0),c+=D}function R(T){const F=x,D=new dt,I=new N;let P=0;const p=T===!0?e:t,v=T===!0?1:-1;for(let C=1;C<=s;C++)m.push(0,h*v,0),g.push(0,v,0),_.push(.5,.5),x++;const A=x;for(let C=0;C<=s;C++){const X=C/s*u+o,j=Math.cos(X),$=Math.sin(X);I.x=p*$,I.y=h*v,I.z=p*j,m.push(I.x,I.y,I.z),g.push(0,v,0),D.x=j*.5+.5,D.y=$*.5*v+.5,_.push(D.x,D.y),x++}for(let C=0;C<s;C++){const H=F+C,X=A+C;T===!0?f.push(X,X+1,H):f.push(X+1,X,H),P+=3}d.addGroup(c,P,T===!0?1:2),c+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cr(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class no extends cr{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new no(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class io extends vn{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const u=Math.min(a+o,Math.PI);let d=0;const f=[],m=new N,g=new N,_=[],x=[],E=[],h=[];for(let c=0;c<=n;c++){const b=[],R=c/n;let T=0;c===0&&a===0?T=.5/t:c===n&&u===Math.PI&&(T=-.5/t);for(let F=0;F<=t;F++){const D=F/t;m.x=-e*Math.cos(s+D*r)*Math.sin(a+R*o),m.y=e*Math.cos(a+R*o),m.z=e*Math.sin(s+D*r)*Math.sin(a+R*o),x.push(m.x,m.y,m.z),g.copy(m).normalize(),E.push(g.x,g.y,g.z),h.push(D+T,1-R),b.push(d++)}f.push(b)}for(let c=0;c<n;c++)for(let b=0;b<t;b++){const R=f[c][b+1],T=f[c][b],F=f[c+1][b],D=f[c+1][b+1];(c!==0||a>0)&&_.push(R,T,D),(c!==n-1||u<Math.PI)&&_.push(T,F,D)}this.setIndex(_),this.setAttribute("position",new Ct(x,3)),this.setAttribute("normal",new Ct(E,3)),this.setAttribute("uv",new Ct(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new io(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class so extends vn{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],u=[],d=[],f=new N,m=new N,g=new N;for(let _=0;_<=n;_++)for(let x=0;x<=s;x++){const E=x/s*r,h=_/n*Math.PI*2;m.x=(e+t*Math.cos(h))*Math.cos(E),m.y=(e+t*Math.cos(h))*Math.sin(E),m.z=t*Math.sin(h),o.push(m.x,m.y,m.z),f.x=e*Math.cos(E),f.y=e*Math.sin(E),g.subVectors(m,f).normalize(),u.push(g.x,g.y,g.z),d.push(x/s),d.push(_/n)}for(let _=1;_<=n;_++)for(let x=1;x<=s;x++){const E=(s+1)*_+x-1,h=(s+1)*(_-1)+x-1,c=(s+1)*(_-1)+x,b=(s+1)*_+x;a.push(E,h,b),a.push(h,c,b)}this.setIndex(a),this.setAttribute("position",new Ct(o,3)),this.setAttribute("normal",new Ct(u,3)),this.setAttribute("uv",new Ct(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new so(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Wa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Wa);const se={BLUE:0,RED:1,BLACK:2,ORANGE:3,GREEN:4,PURPLE:5},Im=[[.12,.22,.72],[.84,.14,.2],[.16,.17,.22],[.93,.5,.1],[.1,.55,.32],[.52,.24,.74]],Um=new N(.42,.84,.34).normalize(),dc={value:new N(0,1,0)},Nm=`
varying vec3 vN;
void main() {
  vN = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Fm=`
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
}`,Om=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`,Bm=`
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
}`,sr=new Map;function Gt(i,e={}){const t=e.fill?1:0,n=e.tone||0,s=`${i}|${t}|${n}`;let r=sr.get(s);return r||(r=new bn({vertexShader:Nm,fragmentShader:Fm,side:pn,uniforms:{uLight:dc,uInk:{value:i},uFill:{value:t},uTone:{value:n}}}),r.userData={ink:i,fill:t,tone:n},sr.set(s,r)),r}function zm(i){const e=new Lm({canvas:i,antialias:!1,powerPreference:"high-performance"}),t=window.matchMedia&&window.matchMedia("(pointer: coarse)").matches,n=Math.min(window.devicePixelRatio||1,t?1.25:1.5);e.setPixelRatio(n),e.setClearColor(0,0);const s=(x,E)=>{const h=new eo(x,E);return h.type=ei,new ti(x,E,{type:Ji,minFilter:nn,magFilter:nn,depthBuffer:!0,depthTexture:h})};let r=s(2,2);const a=new bn({vertexShader:Om,fragmentShader:Bm,depthTest:!1,depthWrite:!1,uniforms:{tData:{value:r.texture},tDepth:{value:r.depthTexture},uRes:{value:new dt(2,2)},uNear:{value:.05},uFar:{value:220},uTime:{value:0},uHurt:{value:0},uLowHp:{value:0},uFlash:{value:0},uInvProj:{value:new yt},uInvView:{value:new yt},uPaper:{value:new N(.965,.952,.9)},uInks:{value:Im.map(x=>new N(...x))}}}),o=new ir,u=new ac(-1,1,1,-1,0,1),d=new Et(new Mi(2,2),a);d.frustumCulled=!1,o.add(d);function f(x,E){e.setSize(x,E,!1);const h=Math.max(2,Math.floor(x*n)),c=Math.max(2,Math.floor(E*n));r.dispose(),r=s(h,c),a.uniforms.tData.value=r.texture,a.uniforms.tDepth.value=r.depthTexture,a.uniforms.uRes.value.set(h,c)}const m=new Ye;function g(x,E,h,c){E.updateMatrixWorld(),dc.value.copy(Um).applyMatrix3(m.setFromMatrix4(E.matrixWorldInverse)).normalize(),e.setRenderTarget(r),e.clear(),e.render(x,E);const b=a.uniforms;b.uNear.value=E.near,b.uFar.value=E.far,b.uInvProj.value.copy(E.projectionMatrixInverse),b.uInvView.value.copy(E.matrixWorld),b.uTime.value=h.time,b.uHurt.value=h.hurt,b.uLowHp.value=h.lowHp,b.uFlash.value=h.flash,e.setRenderTarget(null),e.render(o,u),c&&(e.autoClear=!1,e.render(c,E),e.autoClear=!0)}function _(){r.dispose(),a.dispose(),d.geometry.dispose(),sr.forEach(x=>x.dispose()),sr.clear(),e.dispose(),e.forceContextLoss()}return{renderer:e,setSize:f,render:g,dispose:_}}const ds=i=>440*Math.pow(2,(i-69)/12),ea=(i,e)=>i+Math.random()*(e-i),Ml=[72,0,76,79,0,76,74,72,69,0,72,74,76,0,74,0,72,0,76,79,81,79,76,74,72,74,76,0,74,72,69,0],Sl=[48,48,55,55,45,45,52,52,41,41,48,48,43,43,50,43];class km{constructor(){this.ctx=null,this.master=null,this.musicGain=null,this.musicOn=!0,this._mus=null}init(){if(this.ctx)return this.resume();const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.55,this.master.connect(this.ctx.destination),this.musicGain=this.ctx.createGain(),this.musicGain.gain.value=.6,this.musicGain.connect(this.master);const t=this.ctx.sampleRate;this.noiseBuf=this.ctx.createBuffer(1,t,this.ctx.sampleRate);const n=this.noiseBuf.getChannelData(0);for(let s=0;s<t;s++)n[s]=Math.random()*2-1}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}tone({freq:e=440,to:t=null,dur:n=.15,type:s="square",gain:r=.2,delay:a=0,at:o,out:u}){if(!this.ctx)return;const d=this.ctx,f=o!==void 0?o:d.currentTime+a,m=d.createOscillator();m.type=s,m.frequency.setValueAtTime(e,f),t&&m.frequency.exponentialRampToValueAtTime(Math.max(20,t),f+n);const g=d.createGain();g.gain.setValueAtTime(1e-4,f),g.gain.linearRampToValueAtTime(r,f+.006),g.gain.exponentialRampToValueAtTime(1e-4,f+n),m.connect(g).connect(u||this.master),m.start(f),m.stop(f+n+.05)}noise({dur:e=.2,gain:t=.2,filter:n="bandpass",freq:s=1200,to:r=null,q:a=1,delay:o=0,at:u,out:d}){if(!this.ctx)return;const f=this.ctx,m=u!==void 0?u:f.currentTime+o,g=f.createBufferSource();g.buffer=this.noiseBuf;const _=f.createBiquadFilter();_.type=n,_.frequency.setValueAtTime(s,m),r&&_.frequency.exponentialRampToValueAtTime(Math.max(20,r),m+e),_.Q.value=a;const x=f.createGain();x.gain.setValueAtTime(t,m),x.gain.exponentialRampToValueAtTime(1e-4,m+e),g.connect(_).connect(x).connect(d||this.master),g.start(m,Math.random()*.5),g.stop(m+e+.05)}shoot(){this.noise({dur:.07,gain:.35,filter:"highpass",freq:2500}),this.tone({freq:ea(900,1e3),to:380,dur:.07,type:"square",gain:.08})}empty(){this.tone({freq:1400,dur:.03,type:"square",gain:.05})}reload(){this.tone({freq:700,dur:.05,type:"square",gain:.07}),this.tone({freq:1100,dur:.06,type:"square",gain:.07,delay:.5})}hit(){this.tone({freq:ea(1500,1700),dur:.04,type:"triangle",gain:.12})}wallHit(){this.noise({dur:.05,gain:.12,filter:"bandpass",freq:3e3,q:2})}kill(){this.noise({dur:.25,gain:.3,filter:"lowpass",freq:1800,to:200}),this.tone({freq:520,to:120,dur:.22,type:"sawtooth",gain:.1})}paperRip(){this.noise({dur:.3,gain:.35,filter:"bandpass",freq:2200,to:700,q:.7})}hurt(){this.tone({freq:220,to:90,dur:.2,type:"sawtooth",gain:.2}),this.noise({dur:.15,gain:.2,filter:"lowpass",freq:900})}jump(){this.tone({freq:300,to:560,dur:.1,type:"triangle",gain:.1})}dash(){this.noise({dur:.18,gain:.25,filter:"bandpass",freq:600,to:2400,q:.8})}pickup(){this.tone({freq:660,dur:.08,type:"triangle",gain:.15}),this.tone({freq:990,dur:.12,type:"triangle",gain:.15,delay:.07})}invite(){this.tone({freq:880,to:1320,dur:.09,type:"sine",gain:.1})}emailBuzz(){this.tone({freq:ea(380,460),dur:.1,type:"sawtooth",gain:.03})}ring(){for(let e=0;e<6;e++)this.tone({freq:1800+e%2*300,dur:.05,type:"square",gain:.05,delay:e*.07})}charge(){this.noise({dur:.4,gain:.3,filter:"bandpass",freq:300,to:1500,q:1})}bossRoar(){this.tone({freq:95,to:55,dur:1,type:"sawtooth",gain:.35}),this.noise({dur:.9,gain:.3,filter:"bandpass",freq:500,q:.8})}wave(){[60,64,67,72].forEach((e,t)=>this.tone({freq:ds(e+12),dur:.14,type:"triangle",gain:.12,delay:t*.09}))}victory(){[72,76,79,84,79,84].forEach((e,t)=>this.tone({freq:ds(e),dur:.22,type:"triangle",gain:.15,delay:t*.13}))}lose(){[67,63,60,55].forEach((e,t)=>this.tone({freq:ds(e),dur:.3,type:"sawtooth",gain:.1,delay:t*.2}))}startMusic(){if(!this.ctx||this._mus)return;const e=60/112/2;this._mus={next:this.ctx.currentTime+.1,i:0},this._mus.timer=setInterval(()=>{const t=this._mus;if(!t||!this.musicOn)return;const n=this.ctx.currentTime;for(t.next<n-.5&&(t.next=n+.05);t.next<n+.3;){const s=Ml[t.i%Ml.length];if(s&&this.tone({freq:ds(s),dur:e*.9,type:"triangle",gain:.05,at:t.next,out:this.musicGain}),t.i%2===0){const r=Sl[(t.i>>1)%Sl.length];this.tone({freq:ds(r),dur:e*1.7,type:"sine",gain:.1,at:t.next,out:this.musicGain})}t.i%4===2&&this.noise({dur:.04,gain:.05,filter:"highpass",freq:6e3,at:t.next,out:this.musicGain}),t.next+=e,t.i++}},80)}toggleMusic(){return this.musicOn=!this.musicOn,this.musicOn}destroy(){this._mus&&clearInterval(this._mus.timer),this._mus=null,this.ctx&&this.ctx.close().catch(()=>{}),this.ctx=null}}const Je=36,We={box:new ts(1,1,1),cyl:new cr(.5,.5,1,14),sph:new io(.5,14,10),cone:new no(.5,1,12),torus:new so(.5,.12,8,18),disc:new to(.5,14)};function Hm(i){const e=[],t=new At;i.add(t);function n(h,c,b,R,T,F,D,I={}){const P=new Et(We.box,Gt(D,I));return P.scale.set(R,T,F),P.position.set(h,c+T/2,b),t.add(P),I.collide!==!1&&e.push({x0:h-R/2,x1:h+R/2,z0:b-F/2,z1:b+F/2,y0:c,y1:c+T}),P}function s(h,c,b,R,T,F,D={}){const I=new Et(We.cyl,Gt(F,D));return I.scale.set(R*2,T,R*2),I.position.set(h,c+T/2,b),t.add(I),D.collide&&e.push({x0:h-R,x1:h+R,z0:b-R,z1:b+R,y0:c,y1:c+T}),I}function r(h,c,b,R,T,F={}){const D=new Et(We.sph,Gt(T,F));return D.scale.setScalar(R*2),D.position.set(h,c,b),t.add(D),D}const a=new Et(new Mi(Je*2,Je*2),Gt(se.BLACK,{tone:.35}));a.rotation.x=-Math.PI/2,t.add(a),n(-20,0,-18,18,.02,14,se.BLUE,{tone:.12,collide:!1}),n(20,0,18,18,.02,14,se.GREEN,{tone:.12,collide:!1}),n(0,0,4,12,.02,12,se.ORANGE,{tone:.15,collide:!1});const o=7;n(0,0,-Je-.5,Je*2+2,o,1,se.BLUE,{tone:.05}),n(0,0,Je+.5,Je*2+2,o,1,se.BLUE,{tone:.05}),n(-Je-.5,0,0,1,o,Je*2,se.BLUE,{tone:.05}),n(Je+.5,0,0,1,o,Je*2,se.BLUE,{tone:.05});for(const h of[-1,1])n(0,0,h*(Je-.05),Je*2,.3,.1,se.BLACK,{tone:-.1,collide:!1}),n(h*(Je-.05),0,0,.1,.3,Je*2,se.BLACK,{tone:-.1,collide:!1});for(let h=-3;h<=3;h++)n(h*9,2.2,Je-.02,6,3,.05,se.BLUE,{tone:.35,collide:!1}),n(h*9,2.2+1.45,Je-.06,6.2,.12,.08,se.BLACK,{collide:!1}),n(h*9,2.2-.05,Je-.06,6.2,.12,.08,se.BLACK,{collide:!1});for(const[h,c]of[[-12,-12],[12,-12],[-12,12],[12,12],[-26,0],[26,0]])n(h,0,c,1.4,o,1.4,se.BLACK,{tone:.05});function u(h,c,b){n(h,0,c,2.2,.82,1.1,se.BLACK,{tone:.2,collide:!1});const R=n(h,.78,c,2.3,.08,1.15,se.ORANGE,{tone:.1,collide:!1});e.push({x0:h-1.15,x1:h+1.15,z0:c-.58,z1:c+.58,y0:0,y1:.86}),R.userData.deskTop=!0,n(h,.86,c-b*.3,.9,.55,.06,se.BLACK,{tone:-.2,collide:!1}),n(h,.86,c-b*.34,.12,.3,.08,se.BLACK,{collide:!1}),n(h,.86,c+b*.12,.6,.03,.2,se.BLACK,{tone:.2,collide:!1}),s(h+.75,.86,c+b*.1,.07,.14,se.RED,{tone:.1})}function d(h,c){for(let b=-1;b<=1;b++)u(h+b*2.5,c-.9,1),u(h+b*2.5,c+.9,-1);n(h,0,c,7.6,1.4,.12,se.GREEN,{tone:.1})}d(-20,-18),d(20,-18),d(-20,18),d(20,18);const f=-8,m=8,g=-Je,_=-25,x=3.2;n(f,0,(g+_)/2,.3,x,_-g,se.PURPLE,{tone:.12}),n(m,0,(g+_)/2,.3,x,_-g,se.PURPLE,{tone:.12}),n((f-1.8)/2,0,_,-1.8-f,x,.3,se.PURPLE,{tone:.12}),n((m+1.8)/2,0,_,m-1.8,x,.3,se.PURPLE,{tone:.12}),n(0,x-.6,_,3.6,.6,.3,se.PURPLE,{tone:.12}),n(0,0,-30.5,8,.78,3,se.BLACK,{tone:.15});for(let h=-3;h<=3;h+=2)n(h,0,-32.6,.6,.5,.6,se.PURPLE,{tone:-.1,collide:!1}),n(h,0,-28.4,.6,.5,.6,se.PURPLE,{tone:-.1,collide:!1});n(0,1.2,-Je+.05,6,2.2,.1,se.BLACK,{tone:.4,collide:!1}),n(0,0,Je-1,14,.95,1.6,se.BLACK,{tone:.15}),n(-4,.95,Je-1.1,.8,.9,.6,se.ORANGE,{tone:-.05}),n(6.5,0,Je-1.2,1.4,2.4,1.2,se.BLUE,{tone:.2}),s(-6.8,0,Je-1.2,.35,1.5,se.BLUE,{tone:.25,collide:!0}),r(-6.8,1.75,Je-1.2,.35,se.BLUE,{tone:.3});for(let h=-3;h<=3;h++){n(Je-1.2,0,h*2,1.4,2.6,1.6,se.BLACK,{tone:-.15});for(let c=0;c<4;c++)n(Je-1.92,.5+c*.5,h*2,.02,.06,1.2,se.GREEN,{fill:!0,collide:!1})}n(-Je+1.2,0,0,1.6,.45,5,se.GREEN,{tone:.05}),n(-Je+.55,0,0,.4,1,5,se.GREEN,{tone:.05});for(const[h,c]of[[-30,-3],[-30.5,2.5]])r(h,.35,c,.55,se.RED,{tone:.1}),e.push({x0:h-.5,x1:h+.5,z0:c-.5,z1:c+.5,y0:0,y1:.7});const E=[[6,0,1],[7.3,0,1],[6.6,0,-.25],[6.6,1.2,.45],[-7,0,-5],[-7,0,-6.3],[-7,1.2,-5.6],[-2,0,12],[3,0,-10],[3,1.2,-10],[14,0,4],[-15,0,-4],[-15,1.2,-4],[0,0,-18]];for(const[h,c,b]of E)n(h,c,b,1.2,1.2,1.2,se.ORANGE,{tone:-.05});for(const[h,c]of[[-33,-33],[33,-33],[-33,33],[33,33],[-10,0],[10,8],[-4,24],[9,-24]])s(h,0,c,.35,.6,se.ORANGE,{tone:.05,collide:!0}),r(h,1,c,.6,se.GREEN,{tone:-.05}),r(h+.25,1.45,c-.1,.42,se.GREEN,{tone:-.05}),r(h-.2,1.35,c+.2,.38,se.GREEN,{tone:-.05});for(const h of[-14,14])n(-Je+.05,1.2,h,.08,1.8,4,se.BLACK,{tone:.45,collide:!1}),n(Je-.05,1.2,h+3,.08,1.8,4,se.BLACK,{tone:.45,collide:!1});return{root:t,colliders:e}}const ta=[[-30,-30],[30,-30],[-30,30],[30,30],[0,-22],[-30,-12],[30,12],[-18,0],[18,0],[0,28],[-10,-30],[22,-30]];function nt(i,e,t,n,s,r,a,o,u,d){const f=new Et(i,Gt(e,t));return f.scale.set(n,s,r),f.position.set(a,o,u),d.add(f),f}function ur(i,e,t,n,s,r=!0){if(nt(We.sph,se.BLACK,{fill:!0},s,s,s*.5,-n,e,t,i),nt(We.sph,se.BLACK,{fill:!0},s,s,s*.5,n,e,t,i),r){const a=nt(We.box,se.BLACK,{fill:!0},s*1.6,s*.28,.02,-n,e+s*.85,t,i),o=nt(We.box,se.BLACK,{fill:!0},s*1.6,s*.28,.02,n,e+s*.85,t,i);a.rotation.z=-.45,o.rotation.z=.45}}function Gm(){const i=new At,e=new At;i.add(e),nt(We.box,se.RED,{tone:.05},1,.66,.14,0,0,0,e);const t=nt(We.box,se.RED,{fill:!0},.62,.04,.02,-.25,.12,.08,e),n=nt(We.box,se.RED,{fill:!0},.62,.04,.02,.25,.12,.08,e);t.rotation.z=-.6,n.rotation.z=.6,ur(e,-.1,.08,.17,.12),nt(We.box,se.RED,{fill:!0},.12,.2,.03,.42,.35,.02,e);const s=[];for(const r of[-1,1]){const a=new At;a.position.set(r*.5,.05,0),e.add(a),nt(We.box,se.BLACK,{tone:.35},.55,.02,.32,r*.28,0,0,a),s.push({pivot:a,s:r})}return{group:i,body:e,wings:s}}function Vm(){const i=new At,e=new At;e.position.y=.55,i.add(e),nt(We.box,se.PURPLE,{tone:.1},1.2,1.2,.4,0,.6,0,e),nt(We.box,se.PURPLE,{fill:!0},1.22,.28,.42,0,1.08,0,e);for(const n of[-.3,.3]){const s=nt(We.torus,se.BLACK,{tone:-.1},.22,.22,.22,n,1.28,0,e);s.rotation.y=Math.PI/2}for(const n of[-.2,.2])nt(We.box,se.PURPLE,{fill:!0},.02,.75,.02,n,.46,.21,e);for(const n of[.3,.62])nt(We.box,se.PURPLE,{fill:!0},1,.02,.02,0,n,.21,e);ur(e,.62,.22,.26,.16);const t=[];for(const n of[-1,1]){const s=new At;s.position.set(n*.3,.55,0),i.add(s),nt(We.box,se.BLACK,{tone:0},.14,.55,.14,0,-.27,0,s),nt(We.box,se.BLACK,{fill:!0},.2,.08,.3,0,-.52,.06,s),t.push({pivot:s,s:n})}return{group:i,body:e,legs:t}}function Wm(){const i=new At,e=new At;e.position.y=1.05,i.add(e);const t=nt(We.cyl,se.ORANGE,{tone:.1},1.2,.3,1.2,0,0,0,e);t.rotation.x=Math.PI/2;const n=nt(We.torus,se.ORANGE,{tone:-.15},1.05,1.05,1.6,0,0,.02,e);n.rotation.z=0;const s=nt(We.box,se.BLACK,{fill:!0},.05,.42,.02,0,.18,.17,e),r=nt(We.box,se.BLACK,{fill:!0},.04,.3,.02,.12,.08,.17,e);r.rotation.z=-1.1;for(const a of[-1,1])nt(We.sph,se.ORANGE,{tone:-.1},.36,.36,.36,a*.42,.62,0,e),nt(We.box,se.BLACK,{tone:0},.1,.5,.1,a*.3,-.72,0,e);return ur(e,.02,.18,.22,.13),{group:i,body:e,hand1:s,hand2:r}}function Xm(){const i=new At,e=new At;i.add(e);const t=[];for(let a=0;a<6;a++){const o=3.4-a*.18,u=nt(We.box,a%2?se.BLACK:se.RED,{tone:a%2?.25:.05},o,.8,2.3-a*.1,0,.45+a*.85,0,e);u.rotation.y=a%2?.12:-.1,t.push(u)}const n=new At;n.position.y=5.4,e.add(n),nt(We.box,se.RED,{tone:0},3,1.8,.3,0,.9,0,n);const s=nt(We.box,se.RED,{fill:!0},1.9,.08,.04,-.72,1.2,.17,n),r=nt(We.box,se.RED,{fill:!0},1.9,.08,.04,.72,1.2,.17,n);s.rotation.z=-.55,r.rotation.z=.55,ur(n,.7,.18,.55,.36);for(let a=-2;a<=2;a++)nt(We.cone,se.ORANGE,{fill:!0},.35,.6,.35,a*.55,2.1,0,n);return{group:i,body:e,layers:t,top:n}}function qm(){const i=new At,e=nt(We.cyl,se.BLUE,{tone:.05},.075,.55,.075,0,0,0,i);e.rotation.x=Math.PI/2;const t=nt(We.cone,se.BLACK,{tone:.2},.075,.12,.075,0,0,-.335,i);t.rotation.x=-Math.PI/2;const n=nt(We.cyl,se.BLUE,{fill:!0},.085,.1,.085,0,0,.3,i);n.rotation.x=Math.PI/2,nt(We.box,se.BLUE,{fill:!0},.02,.02,.22,0,.05,.18,i);const s=new Ut;s.position.set(0,0,-.42),i.add(s);const r=nt(We.sph,se.ORANGE,{fill:!0},.12,.12,.18,0,0,-.46,i);return r.visible=!1,{group:i,muzzle:s,flash:r}}function Ym(){const i=new At;nt(We.cyl,se.GREEN,{tone:.05},.34,.42,.34,0,.21,0,i),nt(We.cyl,se.BLACK,{fill:!0},.3,.02,.3,0,.42,0,i);const e=nt(We.torus,se.GREEN,{tone:0},.18,.18,.18,.2,.22,0,i);e.rotation.y=0;for(let t=0;t<2;t++)nt(We.box,se.BLACK,{fill:!0},.02,.22,.02,-.06+t*.12,.62,0,i);return{group:i}}const El=256,Ys=7,yl=3,$m=i=>({w:i.naturalWidth||i.width||0,h:i.naturalHeight||i.height||0});function Tl(i,e){const t=document.createElement("canvas");t.width=i.width,t.height=i.height;const n=t.getContext("2d");return n.drawImage(i,0,0),n.globalCompositeOperation="source-in",n.fillStyle=e,n.fillRect(0,0,t.width,t.height),t}function Km(i,e){const{w:t,h:n}=$m(i);if(!t||!n)return null;const s=document.createElement("canvas");s.width=t,s.height=n;const r=s.getContext("2d");r.drawImage(i,0,0);let a=t,o=n,u=-1,d=-1;try{const D=r.getImageData(0,0,t,n).data;for(let I=0;I<n;I++)for(let P=0;P<t;P++)D[(I*t+P)*4+3]>100&&(P<a&&(a=P),P>u&&(u=P),I<o&&(o=I),I>d&&(d=I))}catch{a=0,o=0,u=t-1,d=n-1}if(u<a)return null;const f=u-a+1,m=d-o+1,g=Math.max(1,Math.round(f*El/m)),_=El,x=Ys+yl+2,E=document.createElement("canvas");E.width=g,E.height=_;const h=E.getContext("2d");h.imageSmoothingEnabled=!e,h.drawImage(i,a,o,f,m,0,0,g,_);const c=document.createElement("canvas");c.width=g+x*2,c.height=_+x*2;const b=c.getContext("2d"),R=Tl(E,"#292b38"),T=Tl(E,"#fbf8ee"),F=(D,I)=>{for(let P=0;P<24;P++){const p=P/24*Math.PI*2;b.drawImage(D,x+Math.cos(p)*I,x+Math.sin(p)*I)}};return F(R,Ys+yl),F(T,Ys),F(T,Ys*.5),b.drawImage(E,x,x),{canvas:c,charH:_/c.height,feet:x/c.height}}function jm(i,e,t){const n=()=>{const s=Km(i,e);if(!s)return;const r=new Dm(s.canvas);r.colorSpace=tn,r.minFilter=gn,r.generateMipmaps=!1,t({tex:r,aspect:s.canvas.width/s.canvas.height,charH:s.charH,feet:s.feet})};i instanceof HTMLImageElement&&!(i.complete&&i.naturalWidth)?i.addEventListener("load",n,{once:!0}):n()}function bl(i){const e=new Ja({transparent:!0,alphaTest:.5,depthTest:!1,depthWrite:!1,side:pn}),t=new At,n=new At,s=new Et(new Mi(1,1),e);s.frustumCulled=!1,n.add(s),t.add(n);const r=i||new ir;r.add(t);let a={},o=!0,u="",d=0,f=1,m=1,g=0;function _(c){Object.values(a).forEach(F=>F.tex.dispose()),a={},u="";const b=++d,R=wc[c],T=[];if(o=!0,R&&R.type==="poses"&&R.images){o=R.faceRight!==!1;for(const[F,D]of Object.entries(R.images))D&&D[0]&&T.push([F,D[0],!1])}!T.some(([F])=>F==="idle")&&yr[c]&&yr[c].img&&T.push(["idle",yr[c].img,!0]);for(const[F,D,I]of T)jm(D,I,P=>{if(b!==d)return P.tex.dispose();a[F]={...P,pixel:I},(!u||F==="idle")&&(u="",x("idle"))})}function x(c){const b=a[c]||a.idle||Object.values(a)[0];if(!b||u===c)return;u=c,e.map=b.tex,e.needsUpdate=!0;const R=(b.pixel?1.4:1.75)/b.charH;s.scale.set(R*b.aspect,R,1),s.position.y=R/2-b.feet*R}function E(c,b){g+=c;let R="idle";b.onGround?b.firing?R="attack":b.speed>7.5?R="run":b.speed>.6&&(R="walk"):R="jump",x(R),b.moveX>.2?f=1:b.moveX<-.2&&(f=-1);const T=f*(o?1:-1);m+=(T-m)*Math.min(1,c*14);const F=b.onGround?Math.min(1,b.speed/6):0,D=Math.abs(Math.sin(g*10))*.12*F,I=1+Math.sin(g*3)*.015*(1-F);t.position.set(b.pos.x,b.pos.y+D,b.pos.z),t.rotation.set(0,Math.atan2(b.camera.position.x-b.pos.x,b.camera.position.z-b.pos.z),0),n.scale.set(Math.abs(m)<.08?.08*Math.sign(m||1):m,I,1),n.rotation.z=Math.sin(g*10)*.05*F,e.color.setRGB(1,1-b.hurt*.55,1-b.hurt*.6)}function h(){r.remove(t),s.geometry.dispose(),e.dispose(),Object.values(a).forEach(c=>c.tex.dispose())}return{scene:r,pivot:t,setChar:_,update:E,dispose:h,setVisible:c=>t.visible=c}}const Al="clevergy-doodle-",fc=6,wl="ABCDEFGHJKLMNPQRSTUVWXYZ",Rl={debug:0,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun.cloudflare.com:3478"},{urls:["turn:openrelay.metered.ca:80","turn:openrelay.metered.ca:443","turn:openrelay.metered.ca:443?transport=tcp"],username:"openrelayproject",credential:"openrelayproject"}]}},Zm=()=>Array.from({length:5},()=>wl[Math.floor(Math.random()*wl.length)]).join(""),Cl=i=>String(i||"").toUpperCase().replace(/[^A-Z]/g,"").slice(0,5);function Jm(){const i={},e={peer:null,isHost:!1,code:null,myId:null,hostId:null,conns:new Map,get active(){return!!this.peer&&(this.isHost||this.conns.size>0)},on(f,m){i[f]=m},host:s,join:r,send:a,sendTo:o,broadcast:u,destroy:d},t=(f,m,g)=>{const _=i[f];_&&_(m,g)};function n(f){f.on("data",g=>{g&&g.t&&t(g.t,g,f.peer)});const m=()=>{e.conns.has(f.peer)&&(e.conns.delete(f.peer),t("_leave",{},f.peer))};f.on("close",m),f.on("error",m)}function s(f){return d(),e.isHost=!0,e.code=f,new Promise((m,g)=>{const _=new So(Al+f,Rl);e.peer=_;let x=!1;const E=setTimeout(()=>{x||g(new Error("El servidor de salas no responde"))},1e4);_.on("open",h=>{x=!0,clearTimeout(E),e.myId=h,e.hostId=h,m(h)}),_.on("connection",h=>{if(e.conns.size>=fc-1){h.on("open",()=>{h.send({t:"full"}),setTimeout(()=>h.close(),400)});return}n(h),h.on("open",()=>{e.conns.set(h.peer,h),t("_join",{},h.peer)})}),_.on("disconnected",()=>{try{_.reconnect()}catch{}}),_.on("error",h=>{x||(clearTimeout(E),g(new Error(h.type==="unavailable-id"?"Ese código ya está en uso":"No se pudo crear la sala")))})})}function r(f){return d(),e.isHost=!1,e.code=f,e.hostId=Al+f,new Promise((m,g)=>{const _=new So(Rl);e.peer=_;let x=!1;const E=c=>{x||(x=!0,clearTimeout(h),g(new Error(c)))},h=setTimeout(()=>E("No se pudo conectar con la sala"),12e3);_.on("open",c=>{e.myId=c;const b=_.connect(e.hostId,{reliable:!0});n(b),b.on("open",()=>{e.conns.set(b.peer,b),x||(x=!0,clearTimeout(h),m(c))})}),_.on("error",c=>E(c.type==="peer-unavailable"?"No existe ninguna sala con ese código":"Error de conexión"))})}function a(f){const m=e.conns.get(e.hostId);m&&m.open&&m.send(f)}function o(f,m){const g=e.conns.get(f);g&&g.open&&g.send(m)}function u(f,m){e.conns.forEach((g,_)=>{_!==m&&g.open&&g.send(f)})}function d(){if(e.conns.forEach(f=>{try{f.close()}catch{}}),e.conns.clear(),e.peer)try{e.peer.destroy()}catch{}e.peer=null,e.myId=null}return e}const Bi=1/60,Qm=24,zi=1.6,fs=.4,Pl=1.8,na=.4,Hi=30,Ll=9,Dl=14,hs=[{title:"OLEADA 1",sub:"Bandeja de entrada: 6 no leídos",list:{email:6}},{title:"OLEADA 2",sub:"Llegan las invitaciones de calendario",list:{email:8,meeting:2}},{title:"OLEADA 3",sub:"«¿Tienes 5 minutos?»",list:{email:8,meeting:3,clock:2}},{title:"OLEADA 4",sub:"Semana de planning",list:{email:10,meeting:4,clock:4}},{title:"OLEADA 5",sub:"Cierre de trimestre",list:{email:12,meeting:5,clock:6}},{title:"JEFE FINAL",sub:"INBOX INFINITO · 9.999 sin leer",list:{boss:1,email:4}}],e0={email:{hp:30,r:.55,cy:0,score:100,ink:se.RED},meeting:{hp:70,r:.75,cy:1.15,score:250,ink:se.PURPLE},clock:{hp:55,r:.7,cy:1.05,score:200,ink:se.ORANGE},boss:{hp:1800,r:2.3,cy:3.2,score:5e3,ink:se.RED}},Il=["email","meeting","clock","boss"],ki=[[0,22],[0,-20],[-29,-10],[29,10],[-28,28],[28,-28],[-15,4],[15,-6],[-6,-14]],$s=10,Bt=(i,e,t)=>i<e?e:i>t?t:i,je=(i,e)=>i+Math.random()*(e-i),t0=`
<canvas class="dd-canvas"></canvas>
<div class="dd-hud hidden">
  <div class="dd-labels"></div>
  <div class="dd-tl"><span class="dd-char"></span><span class="dd-wave"></span></div>
  <div class="dd-team"></div>
  <div class="dd-feed"></div>
  <div class="dd-score">0</div>
  <div class="dd-boss hidden"><div class="dd-boss-name">📨 INBOX INFINITO</div><div class="dd-boss-bar"><i></i></div></div>
  <div class="dd-cross"><i></i><i></i><i></i><i></i></div>
  <div class="dd-hitmark">✕</div>
  <div class="dd-msg"></div>
  <div class="dd-sub"></div>
  <div class="dd-hp"><div class="dd-hp-label">❤ <b>100</b></div><div class="dd-hp-bar"><i></i></div></div>
  <div class="dd-ammo"><b>30</b><span>/${Hi}</span><small>BOLI BIC</small></div>
  <div class="dd-dash"><i></i><small>DASH</small></div>
  <div class="dd-hudbtns">
    <button class="dd-hb dd-cambtn" aria-label="Cambiar cámara">👁<small>3ª</small></button>
    <button class="dd-hb dd-dashbtn" aria-label="Dash">»<small>DASH</small></button>
    <button class="dd-hb dd-pausebtn" aria-label="Pausa">❚❚</button>
  </div>
</div>
<div class="dd-dpad hidden">
  <button class="tbtn tbtn-dir dd-dp dd-dp-up" aria-label="Avanzar">▲</button>
  <button class="tbtn tbtn-dir dd-dp dd-dp-left" aria-label="Girar izquierda">◀</button>
  <button class="tbtn tbtn-dir dd-dp dd-dp-right" aria-label="Girar derecha">▶</button>
  <button class="tbtn tbtn-dir dd-dp dd-dp-down" aria-label="Retroceder">▼</button>
</div>
<div class="dd-ov dd-start">
  <div class="dd-card">
    <div class="dd-kicker">MUNDO 7</div>
    <h1>Doodle District</h1>
    <p class="dd-lead">El sprint se ha quedado atrapado en el cuaderno de notas de la oficina.
      Emails urgentes, reuniones sin agenda y «¿tienes 5 minutos?» salen de las páginas.
      Coge tu boli Bic y borra la bandeja de entrada.</p>
    <div class="dd-controls dd-desktop-only">
      <span><b>WASD</b> moverse</span><span><b>Ratón</b> apuntar · <b>Clic</b> disparar</span>
      <span><b>Espacio</b> saltar</span><span><b>Shift</b> dash</span><span><b>R</b> recargar</span>
      <span><b>V</b> cámara 1ª/3ª</span><span><b>Tab</b> cambiar compañero</span><span><b>M</b> música · <b>Esc</b> pausa</span>
      <span>🎮 <b>Mando</b>: sticks, RT dispara, A salta, B dash, Y cámara</span>
    </div>
    <div class="dd-controls dd-touch-only">
      <span><b>Cruceta ▲▼</b> andar · <b>◀▶</b> girar</span><span><b>B</b> disparar (autoapuntado)</span>
      <span><b>A</b> saltar</span><span><b>Arrastra en la pantalla</b> para apuntar</span>
      <span><b>▲▲</b> doble toque o <b>»</b>: dash</span><span><b>👁</b> 1ª/3ª persona</span>
    </div>
    <div class="dd-mp">
      <div class="dd-mp-head">👥 <b>Jugar en sala</b> <small>hasta ${fc} jugadores · cooperativo</small></div>
      <div class="dd-mp-row dd-mp-lobby">
        <button class="dd-btn dd-mini dd-mp-create">Crear sala</button>
        <input class="dd-mp-code" maxlength="5" placeholder="CÓDIGO" autocomplete="off" autocapitalize="characters" spellcheck="false" />
        <button class="dd-btn dd-mini dd-ghost dd-mp-join">Unirse</button>
      </div>
      <div class="dd-mp-room hidden">
        <div class="dd-mp-coderow">Sala <b class="dd-mp-codebig"></b> <button class="dd-btn dd-mini dd-ghost dd-mp-copy">Copiar</button></div>
        <div class="dd-mp-modes">
          <button class="dd-mp-mode" data-mode="pvp">⚔️ Todos contra todos</button>
          <button class="dd-mp-mode" data-mode="coop">🤝 Cooperativo</button>
        </div>
        <div class="dd-mp-list"></div>
        <button class="dd-btn dd-mini dd-ghost dd-mp-leave">Salir de la sala</button>
      </div>
      <div class="dd-mp-status"></div>
    </div>
    <div class="dd-btns">
      <button class="dd-btn dd-go">¡A dibujar!</button>
      <button class="dd-btn dd-ghost dd-exit">Volver al mapa</button>
    </div>
  </div>
</div>
<div class="dd-ov dd-pause hidden">
  <div class="dd-card dd-small">
    <h2>Pausa</h2>
    <p class="dd-pause-hint">Haz clic en «Seguir» para volver a capturar el ratón.</p>
    <p class="dd-pause-room"></p>
    <div class="dd-btns">
      <button class="dd-btn dd-resume">Seguir</button>
      <button class="dd-btn dd-ghost dd-exit">Salir al mapa</button>
    </div>
  </div>
</div>
<div class="dd-ov dd-end hidden">
  <div class="dd-card dd-small">
    <div class="dd-kicker dd-end-kicker"></div>
    <h2 class="dd-end-title"></h2>
    <div class="dd-end-stats"></div>
    <div class="dd-btns">
      <button class="dd-btn dd-retry">Otra vez</button>
      <button class="dd-btn dd-ghost dd-exit">Volver al mapa</button>
    </div>
  </div>
</div>`;function i0({char:i,getChar:e,onExit:t,onVictory:n}={}){const s=document.createElement("div");s.id="doodleRoot",s.innerHTML=t0,(document.getElementById("wrap")||document.body).appendChild(s),document.body.classList.add("doodle-mode");const r=l=>s.querySelector(l),a=window.matchMedia("(pointer: coarse)").matches;s.classList.toggle("dd-is-touch",a);const o=r(".dd-canvas"),u=zm(o),d=new km,f=new ir,m=new on(75,1,.05,220);m.rotation.order="YXZ",f.add(m);const{colliders:g}=Hm(f),_=qm();m.add(_.group),_.group.scale.setScalar(.75);const x=new N(.3,-.3,-.62);_.group.position.copy(x);const E=new ir,h=bl(E),c=new Et(We.disc,Gt(se.BLACK,{fill:!0}));c.rotation.x=-Math.PI/2,c.scale.set(.9,.55,1),f.add(c);let b=7,R=8;function T(l){i=l||i,b=6.2+Bt((i&&i.spd||3.5)-2.6,0,2)*.9,R=7.6+Bt((i&&i.jump||9.5)-9,0,1.5)*.9,r(".dd-char").textContent=`${i&&i.emoji||"✏️"} ${i&&i.name||"EQUIPO"}`,i&&i.id&&h.setChar(i.id)}T(i);let F="third";try{F=localStorage.getItem("clevergy_doodle_cam")||"third"}catch{}function D(){F=F==="third"?"first":"third";try{localStorage.setItem("clevergy_doodle_cam",F)}catch{}d.pickup(),I()}function I(){_.group.visible=F==="first",h.setVisible(F==="third"),c.visible=F==="third",r(".dd-cambtn small").textContent=F==="third"?"3ª":"1ª"}let P="start";const p={pos:new N,vel:new N,yaw:0,pitch:0,onGround:!0,coyote:0,hp:100,mag:Hi,reload:0,fireCd:0,dashCd:0,dashT:0,dashDir:new N,bob:0,shake:0,kick:0,iframes:0,down:!1,lastHurt:0,turnV:0,aPrev:!1,upPrev:!1,upTapT:-1,moveX:0,fireT:0},v={winT:0,wave:-1,queue:[],spawnT:0,interT:0,time:0,score:0,kills:0,shots:0,hits:0,hurt:0,flash:0,boss:null},A=Jm(),C={on:!1,isHost:!1,started:!1,netT:0,remotes:new Map,eid:0,cid:0,mode:"pvp",spawnIdx:-1,frags:{},lastAttacker:null,respawnT:0,cofT:6},H=()=>C.on&&!C.isHost,X=()=>C.on&&C.mode==="pvp";let j=[],$=[],ae=[];const q=[],he=[],Me=[],ye={},Ce={fire:!1,jump:!1,dash:!1};let rt=0,Z=0;function ce(l){(l.code==="Space"||l.code.startsWith("Arrow")||l.code==="Tab")&&l.preventDefault(),!ye[l.code]&&(ye[l.code]=!0,P==="play"&&(l.code==="Space"&&(Ce.jump=!0),(l.code==="ShiftLeft"||l.code==="ShiftRight")&&(Ce.dash=!0),l.code==="KeyR"&&Es(),l.code==="KeyV"&&D(),l.code==="KeyM"&&d.toggleMusic(),(l.code==="KeyP"||de&&l.code==="Escape")&&zn()))}function Pe(l){ye[l.code]=!1}let de=!1;function ze(l){P==="play"&&(document.pointerLockElement!==o&&!(de&&l.buttons)||(rt+=l.movementX||0,Z+=l.movementY||0))}function Xe(l){P==="play"&&(!a&&document.pointerLockElement!==o&&(k(),!de)||(l.button===0&&(Ce.fire=!0),l.button===2&&(Ce.dash=!0)))}function Ke(l){l.button===0&&(Ce.fire=!1)}function xt(l){l.preventDefault()}function et(){de=!0}function St(){if(!a){if(document.pointerLockElement===o){de=!1;return}!de&&P==="play"&&zn()}}function k(){try{const l=o.requestPointerLock();l&&l.catch&&l.catch(()=>{de=!0})}catch{de=!0}setTimeout(()=>{document.pointerLockElement!==o&&(de=!0)},600)}function zt(){P==="play"&&zn()}window.addEventListener("keydown",ce),window.addEventListener("keyup",Pe),document.addEventListener("mousemove",ze),o.addEventListener("mousedown",Xe),window.addEventListener("mouseup",Ke),s.addEventListener("contextmenu",xt),document.addEventListener("pointerlockchange",St),document.addEventListener("pointerlockerror",et),window.addEventListener("blur",zt);const Fe={up:!1,down:!1,left:!1,right:!1},He=r(".dd-dpad");let De=null;function ft(l,M){const L=He.getBoundingClientRect(),B=l-(L.left+L.width/2),K=M-(L.top+L.height/2),ue=14;Fe.left=B<-ue,Fe.right=B>ue,Fe.up=K<-ue,Fe.down=K>ue,He.querySelector(".dd-dp-up").classList.toggle("active",Fe.up),He.querySelector(".dd-dp-down").classList.toggle("active",Fe.down),He.querySelector(".dd-dp-left").classList.toggle("active",Fe.left),He.querySelector(".dd-dp-right").classList.toggle("active",Fe.right)}function Ie(){De=null,Fe.up=Fe.down=Fe.left=Fe.right=!1,He.querySelectorAll(".dd-dp").forEach(l=>l.classList.remove("active"))}He.addEventListener("pointerdown",l=>{l.preventDefault(),l.stopPropagation(),De=l.pointerId;try{He.setPointerCapture(l.pointerId)}catch{}ft(l.clientX,l.clientY)}),He.addEventListener("pointermove",l=>{l.pointerId===De&&ft(l.clientX,l.clientY)}),He.addEventListener("pointerup",Ie),He.addEventListener("pointercancel",Ie);const w={id:null,x:0,y:0};function S(l){if(P==="play")for(const M of l.changedTouches)M.target.closest&&M.target.closest("button, .dd-dpad")||(w.id===null&&(w.id=M.identifier,w.x=M.clientX,w.y=M.clientY),l.preventDefault())}function G(l){for(const M of l.changedTouches)M.identifier===w.id&&(rt+=(M.clientX-w.x)*2.2,Z+=(M.clientY-w.y)*2.2,w.x=M.clientX,w.y=M.clientY,l.preventDefault())}function ne(l){for(const M of l.changedTouches)M.identifier===w.id&&(w.id=null)}a&&(s.addEventListener("touchstart",S,{passive:!1}),s.addEventListener("touchmove",G,{passive:!1}),s.addEventListener("touchend",ne),s.addEventListener("touchcancel",ne));const ie=(l,M)=>{const L=r(l);L.addEventListener("pointerdown",B=>{B.preventDefault(),B.stopPropagation(),M()}),L.addEventListener("click",B=>B.preventDefault())};ie(".dd-cambtn",()=>D()),ie(".dd-dashbtn",()=>{Ce.dash=!0}),ie(".dd-pausebtn",()=>zn());const Q=[];function Te(l,M){const L=document.querySelector(l);L&&(Q.push([L,L.textContent]),L.textContent=M)}Te("#gbLabelB","DISPARAR"),Te("#gbLabelA","SALTAR"),Te("#tB .tbtn-main","✎"),Te("#tB .tbtn-sub","DISPARAR"),Te("#tA .tbtn-main","▲"),Te("#tA .tbtn-sub","SALTAR");const re={active:!1,prev:[],mx:0,my:0,lx:0,ly:0,fire:!1};function Se(){const l=navigator.getGamepads?navigator.getGamepads():[];let M=null;for(const ee of l)if(ee&&ee.connected){M=ee;break}if(!M){re.active=!1,re.fire=!1;return}const L=ee=>Math.abs(ee)<.18?0:(ee-Math.sign(ee)*.18)/.82,B=ee=>!!(M.buttons[ee]&&(M.buttons[ee].pressed||M.buttons[ee].value>.4)),K=ee=>B(ee)&&!re.prev[ee];re.mx=L(M.axes[0]||0),re.my=-L(M.axes[1]||0),re.lx=L(M.axes[2]||0),re.ly=L(M.axes[3]||0),re.fire=B(7)||B(5),(re.mx||re.my||re.lx||re.ly||M.buttons.some(ee=>ee&&ee.pressed))&&(re.active=!0),P==="play"?(K(0)&&(Ce.jump=!0),(K(1)||K(4)||K(6))&&(Ce.dash=!0),K(2)&&Es(),K(3)&&D(),K(9)&&zn()):P==="pause"&&K(9)?Si():P==="start"&&(K(0)||K(9))?r(".dd-go").click():(P==="over"||P==="win")&&K(9)&&r(".dd-retry").click();for(let ee=0;ee<M.buttons.length;ee++)re.prev[ee]=B(ee)}s.querySelectorAll(".dd-exit").forEach(l=>l.addEventListener("click",Mo));function Qe(){d.init(),d.startMusic(),bc(),Si()}function oe(){if(!H()){if(C.on){C.started=!0,C.frags={};const l=ki.map((L,B)=>B).sort(()=>Math.random()-.5),M={};[A.myId,...C.remotes.keys()].forEach((L,B)=>M[L]=l[B%l.length]),C.spawnIdx=M[A.myId],A.broadcast({t:"start",mode:C.mode,sp:M})}Qe()}}function Ee(l){const[M,L]=ki[l%ki.length];p.pos.set(M+je(-.5,.5),0,L+je(-.5,.5)),cn(p.pos,fs,.4,Pl),p.yaw=Math.atan2(p.pos.x,p.pos.z),p.pitch=0}function Oe(){let l=0,M=-1;return ki.forEach(([L,B],K)=>{let ue=1/0;C.remotes.forEach(ee=>{ee.d||(ue=Math.min(ue,Math.hypot(ee.pos.x-L,ee.pos.z-B)))}),ue+=Math.random()*3,ue>M&&(M=ue,l=K)}),l}const Ue=l=>{if(!l)return"la oficina";if(l===A.myId)return`${$e().e} ${$e().n}`;const M=C.remotes.get(l);if(M)return`${M.emoji} ${M.name}`;const L=Ne.find(B=>B.id===l);return L?`${L.e} ${L.n}`:"alguien"};r(".dd-go").addEventListener("click",oe),r(".dd-resume").addEventListener("click",Si),r(".dd-retry").addEventListener("click",oe);const fe={status:r(".dd-mp-status"),room:r(".dd-mp-room"),row:r(".dd-mp-lobby"),code:r(".dd-mp-code"),codeBig:r(".dd-mp-codebig"),list:r(".dd-mp-list"),go:r(".dd-go")},$e=()=>({n:i&&i.name||"JUGADOR",e:i&&i.emoji||"✏️",c:i&&i.id});let Ne=[];function at(){fe.room.classList.toggle("hidden",!C.on),fe.row.classList.toggle("hidden",C.on),fe.codeBig.textContent=A.code||"",fe.list.innerHTML=Ne.map(M=>`<span class="dd-mp-chip${M.id===A.myId?" me":""}">${M.e} ${M.n}${M.id===A.hostId?" ⭐":""}</span>`).join(""),s.querySelectorAll(".dd-mp-mode").forEach(M=>{M.classList.toggle("on",M.dataset.mode===C.mode),M.disabled=H()});const l=C.mode==="pvp"?"todos contra todos":"cooperativo";C.on?C.isHost?fe.go.textContent=`Empezar · ${l} (${Ne.length})`:fe.go.textContent="Esperando al anfitrión…":fe.go.textContent="¡A dibujar!",fe.go.disabled=H(),r(".dd-retry").disabled=H(),r(".dd-retry").textContent=H()?"Esperando al anfitrión…":"Otra vez",r(".dd-pause-room").textContent=C.on?`Sala ${A.code} · ${Ne.length} jugador${Ne.length===1?"":"es"} · la partida sigue mientras estás en pausa`:""}const U=(l,M)=>{fe.status.textContent=l,fe.status.classList.toggle("err",!!M)};function pe(){Ne=[{id:A.myId,...$e()}],C.remotes.forEach(l=>Ne.push({id:l.id,n:l.name,e:l.emoji})),A.broadcast({t:"roster",list:Ne,mode:C.mode}),at()}r(".dd-mp-create").addEventListener("click",async()=>{U("Creando sala…");try{await A.host(Zm()),C.on=!0,C.isHost=!0,C.started=!1,pe(),U("Comparte el código: tus compañeros pulsan «Unirse» y lo escriben.")}catch(l){U(l.message,!0)}});async function Y(){const l=Cl(fe.code.value);if(l.length!==5)return U("El código tiene 5 letras.",!0);U(`Buscando la sala ${l}…`);try{await A.join(l),C.on=!0,C.isHost=!1,C.started=!1,A.send({t:"hello",...$e()}),Ne=[{id:A.myId,...$e()}],at(),U("¡Dentro! La partida empieza cuando el anfitrión pulse «Empezar».")}catch(M){U(M.message,!0)}}r(".dd-mp-join").addEventListener("click",Y),fe.code.addEventListener("keydown",l=>{l.stopPropagation(),l.key==="Enter"&&Y()}),fe.code.addEventListener("input",()=>{fe.code.value=Cl(fe.code.value)}),r(".dd-mp-copy").addEventListener("click",()=>{try{navigator.clipboard.writeText(A.code),U("Código copiado ✔")}catch{}});function te(l){A.destroy(),[...C.remotes.keys()].forEach(Ge),C.on=!1,C.isHost=!1,C.started=!1,Ne=[],at(),l&&U(l,!0)}r(".dd-mp-leave").addEventListener("click",()=>{te(),U("")}),s.querySelectorAll(".dd-mp-mode").forEach(l=>l.addEventListener("click",()=>{C.isHost&&(C.mode=l.dataset.mode,pe())}));function xe(l,M){let L=C.remotes.get(l);return L||(L={id:l,name:M.n||"?",emoji:M.e||"",charId:null,pos:new N(M.x||0,M.y||0,M.z||0),tgt:new N(M.x||0,M.y||0,M.z||0),vx:0,vz:0,g:!0,f:!1,hp:100,d:!1,mx:0,seen:performance.now(),raw:null,sticker:bl(E),shadow:new Et(We.disc,Gt(se.BLACK,{fill:!0})),label:document.createElement("div")},L.shadow.rotation.x=-Math.PI/2,L.shadow.scale.set(.9,.55,1),f.add(L.shadow),L.label.className="dd-tag",r(".dd-labels").appendChild(L.label),C.remotes.set(l,L)),L}function _e(l,M){const L=xe(l,M);return M.x!==void 0&&L.tgt.set(M.x,M.y,M.z),L.vx=M.vx||0,L.vz=M.vz||0,L.g=!!M.g,L.f=!!M.f,L.d=!!M.d,L.mx=M.mx||0,M.hp!==void 0&&(L.hp=M.hp),M.n&&(L.name=M.n),M.e&&(L.emoji=M.e),M.c&&M.c!==L.charId&&(L.charId=M.c,L.sticker.setChar(M.c)),L.seen=performance.now(),L.raw=M,L}function Ge(l){const M=C.remotes.get(l);M&&(M.sticker.dispose(),f.remove(M.shadow),M.label.remove(),C.remotes.delete(l))}const Mt=()=>({t:"p",id:A.myId,...$e(),x:+p.pos.x.toFixed(2),y:+p.pos.y.toFixed(2),z:+p.pos.z.toFixed(2),vx:+p.vel.x.toFixed(1),vz:+p.vel.z.toFixed(1),g:p.onGround?1:0,f:p.fireT>0?1:0,hp:Math.ceil(p.hp),d:p.down?1:0,mx:Math.sign(p.moveX)}),Tt=l=>new N(l[0],l[1],l[2]);A.on("full",()=>te("La sala está llena.")),A.on("hello",(l,M)=>{const L=_e(M,l);pe(),A.sendTo(M,{t:"welcome",started:C.started&&(P==="play"||P==="pause"),mode:C.mode,f:C.frags}),C.started&&ys("",`${L.emoji} ${L.name} se une a la partida`,2)}),A.on("p",(l,M)=>{C.isHost&&_e(M,l)}),A.on("hit",l=>{if(!C.isHost)return;const M=j.find(L=>L.id===l.id&&!L.dead);M&&Ae(M,l.d,null,null)}),A.on("take",l=>{C.isHost&&(we(l.id),A.broadcast({t:"rmcof",id:l.id}))}),A.on("fx",(l,M)=>{z(Tt(l.a),Tt(l.b)),C.isHost&&A.broadcast(l,M)}),A.on("_leave",(l,M)=>{if(C.isHost){const L=C.remotes.get(M);L&&ys("",`${L.emoji} ${L.name} ha salido de la sala`,2),Ge(M),pe()}else if(M===A.hostId){const L=P==="play"||P==="pause";te("El anfitrión ha cerrado la sala."),L&&(P="over",_r(!1),r(".dd-end-title").textContent="El anfitrión ha cerrado la sala")}}),A.on("welcome",l=>{l.mode&&(C.mode=l.mode),C.frags=l.f||{},at(),l.started&&(C.spawnIdx=-1,Qe())}),A.on("roster",l=>{Ne=l.list||[],l.mode&&(C.mode=l.mode),at()}),A.on("start",l=>{C.started=!0,l.mode&&(C.mode=l.mode),C.frags={},C.spawnIdx=l.sp&&l.sp[A.myId]!==void 0?l.sp[A.myId]:-1,Qe()}),A.on("pvp",l=>{C.isHost&&(l.to===A.myId?Wt(l):A.sendTo(l.to,{...l,t:"pvphit"}))}),A.on("pvphit",l=>Wt(l)),A.on("frag",l=>An(l)),A.on("frags",l=>{C.isHost||Nt(l)}),A.on("pvpwin",l=>mt(l.id)),A.on("snap",l=>{if(!H())return;const M=new Set;for(const B of l.pl)B.id!==A.myId&&(M.add(B.id),_e(B.id,B));if([...C.remotes.keys()].forEach(B=>{M.has(B)||Ge(B)}),P!=="play"&&P!=="pause")return;const L=new Set;for(const[B,K,ue,ee,me,qe,tt]of l.en){L.add(B);let J=j.find(Be=>Be.id===B);J||(J=le(Il[K],[ue,me],{id:B,y:ee,puppet:!0})),J.tgtPos.set(ue,ee,me),J.hp=qe,J.maxHp=100,J.wind=tt}j.forEach(B=>{!L.has(B.id)&&!B.dead&&(B.dead=!0,f.remove(B.model.group))}),j=j.filter(B=>!B.dead),v.wave=l.w,v.score=l.s}),A.on("kill",l=>{const M=j.find(L=>L.id===l.id);M&&ke(M,null)}),A.on("shot",l=>It(Tt(l.p),Tt(l.v),l.d)),A.on("dmg",l=>Re(l.d,new N(l.x,0,l.z))),A.on("cof",l=>Ve(l.x,l.z,l.id)),A.on("rmcof",l=>we(l.id)),A.on("msg",l=>{un(l.a,l.b,l.d),l.w&&d.wave()}),A.on("revive",()=>co()),A.on("over",()=>{(P==="play"||P==="pause")&&vr()}),A.on("win",l=>po(l.s));function ct(l){if(!C.on||!A.active||(C.netT+=l,C.netT<1/15))return;C.netT=0;const M=performance.now();if(!C.isHost){(P==="play"||P==="pause")&&A.send(Mt());return}C.remotes.forEach((K,ue)=>{M-K.seen>8e3&&!A.conns.has(ue)&&Ge(ue)});const L=P==="play"||P==="pause",B=[Mt()];C.remotes.forEach(K=>{K.raw&&B.push({...K.raw,id:K.id})}),A.broadcast({t:"snap",pl:B,w:v.wave,s:v.score,en:L?j.filter(K=>!K.dead).map(K=>[K.id,Il.indexOf(K.type),+K.pos.x.toFixed(2),+K.pos.y.toFixed(2),+K.pos.z.toFixed(2),Math.max(0,Math.round(K.hp/K.maxHp*100)),K.mode==="windup"?1:0]):[]}),!X()&&L&&p.down&&[...C.remotes.values()].every(K=>K.d)&&vr()}let kt=0;function ln(l){if(kt-=l,kt>0)return;kt=.3;const M=r(".dd-team");if(!C.on||!C.remotes.size){M.innerHTML&&(M.innerHTML="");return}M.innerHTML=[...C.remotes.values()].map(L=>`<div class="dd-mate${L.d?" ko":""}"><span>${L.emoji} ${L.name}${X()?` · ${C.frags[L.id]||0}☠`:""}</span><i><b style="width:${Math.max(0,Math.min(100,L.hp))}%"></b></i></div>`).join("")}const xn=new N;function Ms(l){const M=s.clientWidth,L=s.clientHeight;C.remotes.forEach(B=>{B.pos.lerp(B.tgt,Math.min(1,l*12)),B.hitT=Math.max(0,(B.hitT||0)-l),B.sticker.update(l,{pos:B.pos,camera:m,moveX:B.mx,speed:Math.hypot(B.vx,B.vz),onGround:B.g,firing:B.f,hurt:B.d?.8:B.hitT>0?.9:0});let K=!0;X()&&(K=!B.d&&(Hn(m.position,xn.set(B.pos.x,B.pos.y+1,B.pos.z))||Hn(m.position,xn.set(B.pos.x,B.pos.y+1.7,B.pos.z)))),B.sticker.setVisible(K);const ue=Ei(B.pos.x,B.pos.z,fs,B.pos.y+.01);B.shadow.position.set(B.pos.x,ue+.02,B.pos.z),xn.set(B.pos.x,B.pos.y+2.05,B.pos.z).project(m);const ee=K&&xn.z>-1&&xn.z<1&&P!=="start";if(B.label.style.display=ee?"":"none",ee){B.label.style.transform=`translate(${((xn.x*.5+.5)*M).toFixed(1)}px, ${((-xn.y*.5+.5)*L).toFixed(1)}px) translate(-50%, -100%)`;const me=`${B.emoji} ${B.name}${B.d?" · K.O.":""}`;(B.label.dataset.txt!==me||B.label.dataset.hp!==String(B.hp))&&(B.label.dataset.txt=me,B.label.dataset.hp=String(B.hp),B.label.innerHTML=`<span>${me}</span><i style="width:${Math.max(0,Math.min(100,B.hp))}%"></i>`)}})}function Kt(){const l=document.body.classList.contains("gameboy-mode");He.classList.toggle("hidden",!(a&&!l&&P==="play")),r(".dd-dashbtn").classList.toggle("hidden",!a)}I(),at();function Bn(l){["start","pause","end"].forEach(M=>r(`.dd-${M}`).classList.toggle("hidden",M!==l))}function Si(){d.resume(),P="play",Bn(null),r(".dd-hud").classList.remove("hidden"),Kt(),a||k()}function zn(){P==="play"&&(P="pause",Ce.fire=!1,Bn("pause"),Kt(),document.pointerLockElement===o&&document.exitPointerLock())}function cn(l,M,L,B){let K=!1;for(const ee of g){if(ee.y1<=L||ee.y0>=B)continue;const me=Bt(l.x,ee.x0,ee.x1),qe=Bt(l.z,ee.z0,ee.z1),tt=l.x-me,J=l.z-qe,Be=tt*tt+J*J;if(!(Be>=M*M))if(K=!0,Be>1e-8){const Le=Math.sqrt(Be);l.x+=tt/Le*(M-Le),l.z+=J/Le*(M-Le)}else{const Le=l.x-ee.x0,vt=ee.x1-l.x,st=l.z-ee.z0,Jt=ee.z1-l.z,ai=Math.min(Le,vt,st,Jt);ai===Le?l.x=ee.x0-M:ai===vt?l.x=ee.x1+M:ai===st?l.z=ee.z0-M:l.z=ee.z1+M}}const ue=Je-M;return l.x=Bt(l.x,-ue,ue),l.z=Bt(l.z,-ue,ue),K}function Ei(l,M,L,B){let K=0;for(const ue of g){if(ue.y1>B+na||ue.y1<=K)continue;const ee=Bt(l,ue.x0,ue.x1),me=Bt(M,ue.z0,ue.z1);(l-ee)**2+(M-me)**2<L*L*.5&&(K=ue.y1)}return K}function kn(l,M,L){let B=L;if(M.y<-1e-6){const K=-l.y/M.y;K>0&&K<B&&(B=K)}for(const K of g){let ue=0,ee=B;const me=[K.x0,K.y0,K.z0],qe=[K.x1,K.y1,K.z1],tt=[l.x,l.y,l.z],J=[M.x,M.y,M.z];let Be=!0;for(let Le=0;Le<3;Le++)if(Math.abs(J[Le])<1e-9){if(tt[Le]<me[Le]||tt[Le]>qe[Le]){Be=!1;break}}else{let vt=(me[Le]-tt[Le])/J[Le],st=(qe[Le]-tt[Le])/J[Le];if(vt>st){const Jt=vt;vt=st,st=Jt}if(vt>ue&&(ue=vt),st<ee&&(ee=st),ue>ee){Be=!1;break}}Be&&ue<B&&(B=ue)}return B}function Ss(l){if(l.y<=0)return!0;for(const M of g)if(l.x>M.x0&&l.x<M.x1&&l.z>M.z0&&l.z<M.z1&&l.y>M.y0&&l.y<M.y1)return!0;return Math.abs(l.x)>Je||Math.abs(l.z)>Je}new N;const Mn=new N,sn=new N,yi=new N;function Hn(l,M){yi.subVectors(M,l);const L=yi.length();return yi.divideScalar(L),kn(l,yi,L)>=L-.05}const y=l=>l.set(p.pos.x,p.pos.y+zi,p.pos.z),O=(l,M)=>M.set(l.pos.x,l.pos.y+l.def.cy,l.pos.z);function V(l,M,L,B,K=6){for(let ue=0;ue<B;ue++){let ee=q.find(me=>!me.alive);if(!ee){if(q.length>220)break;ee={mesh:new Et(We.sph,Gt(L,{fill:!0})),vel:new N},f.add(ee.mesh),q.push(ee)}ee.alive=!0,ee.ink=L,ee.mesh.material=Gt(L,{fill:!0}),ee.mesh.visible=!0,ee.mesh.position.copy(l),ee.mesh.scale.setScalar(je(.05,.13)),ee.vel.set(je(-1,1),je(.2,1.3),je(-1,1)).multiplyScalar(K*je(.4,1)),M&&ee.vel.addScaledVector(M,K*.6),ee.life=je(.6,1.4)}}function W(l,M,L,B){let K;he.length>=90?K=he.shift():(K=new Et(We.disc,Gt(L,{fill:!0})),K.rotation.x=-Math.PI/2,f.add(K)),K.material=Gt(L,{fill:!0}),K.position.set(l,.012+he.length*4e-4,M),K.scale.set(B*je(.7,1.3),B*je(.7,1.3),1),K.rotation.z=je(0,Math.PI),he.push(K)}function z(l,M){let L=Me.find(K=>K.life<=0);L||(L={mesh:new Et(We.cyl,Gt(se.BLUE,{fill:!0})),life:0},f.add(L.mesh),Me.push(L)),sn.subVectors(M,l);const B=sn.length();L.mesh.position.copy(l).addScaledVector(sn,.5),L.mesh.quaternion.setFromUnitVectors(Ut.DEFAULT_UP,sn.normalize()),L.mesh.scale.set(.035,B,.035),L.mesh.visible=!0,L.life=.05}function le(l,M,L={}){const B=e0[l],K=l==="email"?Gm():l==="meeting"?Vm():l==="clock"?Wm():Xm();let ue,ee;if(M)ue=M[0],ee=M[1];else{const qe=ta.filter(([J,Be])=>Math.hypot(J-p.pos.x,Be-p.pos.z)>16),tt=(qe.length?qe:ta)[Math.floor(Math.random()*(qe.length||ta.length))];ue=tt[0]+je(-1.5,1.5),ee=tt[1]+je(-1.5,1.5)}const me={type:l,def:B,model:K,hp:B.hp*(l==="boss"?1:1+v.wave*.05),maxHp:0,pos:new N(ue,l==="email"?je(1.6,2.6):0,ee),vel:new N,t:je(0,10),cd:je(1,2.5),flash:0,mode:"move",modeT:0,detour:0,detourT:0,lastPos:new N,stuckT:0};return me.maxHp=me.hp,me.id=L.id||++C.eid,L.puppet?(me.puppet=!0,L.y!==void 0&&(me.pos.y=L.y),me.tgtPos=me.pos.clone()):(me.pos.x=Bt(me.pos.x,-Je+2,Je-2),me.pos.z=Bt(me.pos.z,-Je+2,Je-2),l!=="email"&&cn(me.pos,B.r,.4,2)),K.group.position.copy(me.pos),K.group.scale.setScalar(.01),f.add(K.group),j.push(me),V(me.pos.clone().setY(me.pos.y+.8),null,B.ink,10,4),l==="boss"&&(v.boss=me,r(".dd-boss").classList.remove("hidden"),d.bossRoar(),p.shake=1),me}function ve(l){l.flash=.07,l.model.group.traverse(M=>{M.isMesh&&(M.userData.base||(M.userData.base=M.material),M.material=Gt(M.userData.base.userData.ink,{fill:!0}))})}function be(l){l.model.group.traverse(M=>{M.isMesh&&M.userData.base&&(M.material=M.userData.base)})}function Ae(l,M,L,B){if(ve(l),L&&V(L,B,l.def.ink,l.type==="boss"?3:4,5),H()){A.send({t:"hit",id:l.id,d:M});return}l.hp-=M,l.hp<=0&&ke(l,B)}function ke(l,M){if(l.dead)return;l.dead=!0,O(l,Mn);const L=l.type==="boss";if(V(Mn,M,l.def.ink,L?60:18,L?12:7),V(Mn,M,se.BLACK,L?20:5,5),W(l.pos.x,l.pos.z,l.def.ink,L?6:je(1.4,2.4)),f.remove(l.model.group),d.kill(),d.paperRip(),H()){L&&(v.boss=null,v.flash=1,r(".dd-boss").classList.add("hidden"));return}v.kills++,fr(l.def.score),C.on&&A.broadcast({t:"kill",id:l.id}),!L&&Math.random()<.16&&Ve(l.pos.x,l.pos.z),L&&(v.boss=null,v.flash=1,r(".dd-boss").classList.add("hidden"),j.forEach(B=>{B!==l&&ke(B,null)}),v.winT=1.4)}function Ve(l,M,L){const B=L||++C.cid;C.on&&C.isHost&&!L&&A.broadcast({t:"cof",id:B,x:+l.toFixed(2),z:+M.toFixed(2)});const K=Ym();K.group.position.set(l,0,M),f.add(K.group),ae.push({id:B,model:K,pos:new N(l,0,M),t:je(0,6),life:25})}function we(l){for(const M of ae)M.id===l&&M.life>0&&(M.life=0,f.remove(M.model.group))}const it=new N,ht=new N;function pt(l,M,L=1,B=0){const K=l.tgt&&l.tgt.pos||p.pos;it.set(K.x,K.y+zi-.3,K.z);const ue=ht.subVectors(it,M).normalize();B&&ue.applyAxisAngle(Ut.DEFAULT_UP,B);const ee=ue.clone().multiplyScalar(13*L),me=l.type==="boss"?12:10;C.on&&A.broadcast({t:"shot",p:[M.x,M.y,M.z].map(qe=>+qe.toFixed(2)),v:[ee.x,ee.y,ee.z].map(qe=>+qe.toFixed(2)),d:me}),It(M,ee,me)}function It(l,M,L){const B=new At,K=new Et(We.box,Gt(se.ORANGE,{tone:.05}));K.scale.set(.42,.3,.06),B.add(K);const ue=new Et(We.box,Gt(se.ORANGE,{fill:!0}));ue.scale.set(.44,.08,.07),ue.position.y=.11,B.add(ue),B.position.copy(l),f.add(B),$.push({mesh:B,pos:l.clone(),vel:M.clone(),life:4,dmg:L}),d.invite()}const ot=new N;function Re(l,M){if(!(p.iframes>0||p.down||!(P==="play"||C.on&&P==="pause"))&&(p.hp-=l,p.iframes=.3,p.lastHurt=v.time,v.hurt=Math.min(1,v.hurt+l/28),p.shake=Math.min(1,p.shake+l/25),d.hurt(),M&&(ot.subVectors(p.pos,M).setY(0).normalize(),p.vel.addScaledVector(ot,l*.35)),p.hp<=0))if(p.hp=0,X()){p.down=!0,Ce.fire=!1,C.respawnT=3,un("¡TE HAN TACHADO!",`${Ue(C.lastAttacker)} te ha borrado · vuelves en 3 s`,3),d.lose();const L={t:"frag",k:C.lastAttacker,v:A.myId};C.isHost?An(L):A.send(L),C.lastAttacker=null}else C.on?(p.down=!0,Ce.fire=!1,un("K.O.","Tus compañeros siguen · vuelves en la próxima oleada",4),d.lose()):vr()}function jt(l,M,L){l==="me"?Re(M,L):l&&A.sendTo(l,{t:"dmg",d:M,x:+L.x.toFixed(2),z:+L.z.toFixed(2)})}function ut(l,M){const L={t:"pvp",to:l,d:M,from:A.myId,x:+p.pos.x.toFixed(2),z:+p.pos.z.toFixed(2)};C.isHost?A.sendTo(l,{...L,t:"pvphit"}):A.send(L)}function Wt(l){!X()||p.down||(C.lastAttacker=l.from,Re(l.d,new N(l.x,0,l.z)))}function An(l){if(!C.isHost)return;l.k&&l.k!==l.v&&(C.frags[l.k]=(C.frags[l.k]||0)+1);const M={t:"frags",f:C.frags,k:l.k,v:l.v};A.broadcast(M),Nt(M);const L=Object.keys(C.frags).find(B=>C.frags[B]>=$s);L&&(A.broadcast({t:"pvpwin",id:L}),mt(L))}function Nt(l){C.frags=l.f||{},ni(`${Ue(l.k)} <b>✎</b> ${Ue(l.v)}`),l.k===A.myId&&l.v!==A.myId&&(d.kill(),un("",`¡Has tachado a ${Ue(l.v)}! · ${C.frags[A.myId]||0}/${$s}`,1.8))}function ni(l){const M=document.createElement("div");M.className="dd-feed-item",M.innerHTML=l;const L=r(".dd-feed");for(L.prepend(M);L.children.length>4;)L.lastChild.remove();setTimeout(()=>M.remove(),4500)}function mt(l){if(P!=="play"&&P!=="pause")return;P="win";const M=l===A.myId;M?d.victory():d.lose();const B=[A.myId,...C.remotes.keys()].map(K=>[K,C.frags[K]||0]).sort((K,ue)=>ue[1]-K[1]);r(".dd-end-kicker").textContent="TODOS CONTRA TODOS",r(".dd-end-title").textContent=M?"¡Has ganado la sala!":`Gana ${Ue(l)}`,r(".dd-end-stats").innerHTML=B.map(([K,ue],ee)=>`<div><span>${ee+1}. ${Ue(K)}${K===A.myId?" (tú)":""}</span><b>${ue} ☠</b></div>`).join(""),Bn("end"),Ce.fire=!1,Kt(),document.pointerLockElement===o&&document.exitPointerLock()}function rn(l){if(p.down&&C.respawnT>0&&(C.respawnT-=l,C.respawnT<=0&&(Ee(Oe()),Object.assign(p,{down:!1,hp:100,iframes:2,mag:Hi,reload:0}),p.vel.set(0,0,0),un("","¡De vuelta! Tienes 2 s de invulnerabilidad",1.6))),C.isHost&&(C.cofT-=l,C.cofT<=0&&(C.cofT=14,ae.length<3))){const[M,L]=ki[Math.floor(Math.random()*ki.length)];Ve(M+je(-3,3),L+je(-3,3))}}function Gn(l){let M=null,L=1/0;return p.down||(M={id:"me",pos:p.pos},L=p.pos.distanceToSquared(l)),C.remotes.forEach(B=>{if(B.d)return;const K=B.pos.distanceToSquared(l);K<L&&(L=K,M={id:B.id,pos:B.pos})}),M||{id:null,pos:p.pos}}const Xt=new N,Sn=new N,En=new N,ii=new N;function hc(l,M){const L=l.model;l.t+=M,l.flash>0&&(l.flash-=M,l.flash<=0&&be(l));const B=L.group.scale.x;B<1&&L.group.scale.setScalar(Math.min(1,B+M*3)),l.retarget=(l.retarget||0)-M,(!l.tgt||l.retarget<=0)&&(l.tgt=Gn(l.pos),l.retarget=.5);const K=l.tgt.pos,ue=Xt.set(K.x,K.y+zi,K.z),ee=O(l,Sn),me=En.subVectors(ue,ee),qe=me.length(),tt=Math.hypot(ue.x-l.pos.x,ue.z-l.pos.z);if(l.type==="email"){const J=me.clone().normalize(),Be=new N(-J.z,0,J.x).multiplyScalar(Math.sin(l.t*3)*.6),Le=6;l.retreat>0&&(l.retreat-=M,J.negate().setY(.6).normalize());for(const st of j){if(st===l||st.type!=="email"||st.dead)continue;const Jt=l.pos.x-st.pos.x,ai=l.pos.y-st.pos.y,Er=l.pos.z-st.pos.z,rs=Jt*Jt+ai*ai+Er*Er;rs<2.5&&rs>1e-4&&(Be.x+=Jt/rs,Be.y+=ai/rs,Be.z+=Er/rs)}l.vel.lerp(J.multiplyScalar(Le).add(Be.multiplyScalar(Le)),Math.min(1,M*2.5)),l.pos.addScaledVector(l.vel,M),l.pos.y=Bt(l.pos.y,.9,4.5),cn(l.pos,l.def.r,l.pos.y-.3,l.pos.y+.3),l.cd-=M,qe<1.3&&l.cd<=0&&(jt(l.tgt.id,5,l.pos),l.cd=2.2,l.retreat=je(.9,1.5),l.vel.copy(me).normalize().multiplyScalar(-9)),Math.random()<M*.4&&qe<14&&d.emailBuzz();const vt=Math.sin(l.t*22)*.7;L.wings.forEach(st=>st.pivot.rotation.z=st.s*vt),L.body.position.y=Math.sin(l.t*5)*.08}else if(l.type==="meeting"||l.type==="clock"){let J=new N(me.x,0,me.z).normalize(),Be=l.type==="meeting"?2.8:3.8;l.type==="meeting"?(tt<8?J.negate():tt<16&&J.set(-J.z,0,J.x).multiplyScalar(Math.sin(l.t*.7)>0?1:-1),l.cd-=M,l.cd<.4&&l.cd+M>=.4&&(l.tell=.4),l.cd<=0&&(l.cd=je(1.8,2.8),Hn(ee,ue)&&pt(l,ee.clone().setY(ee.y+.2))),l.tell>0?(l.tell-=M,L.body.scale.setScalar(1+Math.sin(l.tell*40)*.06)):L.body.scale.setScalar(1)):(l.mode==="move"?(l.cd-=M,tt<10&&l.cd<=0&&Hn(ee,ue)&&(l.mode="windup",l.modeT=.65,d.ring())):l.mode==="windup"?(Be=0,l.modeT-=M,L.body.rotation.z=Math.sin(l.t*60)*.15,l.modeT<=0&&(l.mode="charge",l.modeT=.75,l.chargeDir=J.clone(),d.charge())):l.mode==="charge"&&(J.copy(l.chargeDir),Be=17,l.modeT-=M,L.body.rotation.z=0,tt<1.3&&Math.abs(ue.y-1-l.pos.y)<1.6&&(jt(l.tgt.id,18,l.pos),l.modeT=0),l.modeT<=0&&(l.mode="move",l.cd=je(1.4,2.2))),L.hand1.rotation.z=-l.t*4,L.hand2.rotation.z=-l.t*.5-1.1),l.detourT>0&&(l.detourT-=M,J.applyAxisAngle(Ut.DEFAULT_UP,l.detour)),l.vel.x+=(J.x*Be-l.vel.x)*Math.min(1,M*8),l.vel.z+=(J.z*Be-l.vel.z)*Math.min(1,M*8),l.lastPos.copy(l.pos),l.pos.addScaledVector(l.vel,M),cn(l.pos,l.def.r,.35,2.2)&&l.mode==="charge"&&(l.mode="move",l.cd=1.5,p.shake=Math.max(p.shake,.2));const vt=l.lastPos.distanceTo(l.pos);if(Be>0&&vt<Be*M*.3?(l.stuckT+=M,l.stuckT>.35&&(l.detour=(Math.random()<.5?1:-1)*je(1.1,1.7),l.detourT=je(.8,1.4),l.stuckT=0)):l.stuckT=0,L.legs){const st=Math.sin(l.t*9)*.6*Math.min(1,l.vel.length()/2);L.legs.forEach(Jt=>Jt.pivot.rotation.x=Jt.s*st),L.body.position.y=.55+Math.abs(st)*.08}else L.body.position.y=1.05+Math.abs(Math.sin(l.t*10))*.08*Math.min(1,l.vel.length()/2)}else if(l.type==="boss"){const J=l.hp<l.maxHp*.5;let Be=new N(me.x,0,me.z).normalize();if(tt<12?Be.negate():tt<20&&Be.set(-Be.z,0,Be.x),l.vel.lerp(Be.multiplyScalar(J?3.4:2.4),Math.min(1,M*2)),l.pos.addScaledVector(l.vel,M),cn(l.pos,l.def.r,.1,6),l.pos.y=Math.sin(l.t*1.3)*.25+.3,l.cd-=M,l.cd<=0){const Le=J?9:6,vt=ee.clone().setY(ee.y+1.2);for(let st=0;st<Le;st++)pt(l,vt,J?1.2:1,(st-(Le-1)/2)*.13);l.cd=J?1.8:2.6}if(l.summonT=(l.summonT||6)-M,l.summonT<=0){l.summonT=J?7:10;for(let Le=0;Le<(J?4:3);Le++)le("email",[l.pos.x+je(-3,3),l.pos.z+je(-3,3)]);d.bossRoar()}L.layers.forEach((Le,vt)=>Le.rotation.y=Math.sin(l.t*1.5+vt)*.18),L.top.rotation.z=Math.sin(l.t*2)*.06,tt<3&&l.cd>.5&&jt(l.tgt.id,20,l.pos)}L.group.position.copy(l.pos),ii.set(ue.x,l.type==="email"?ue.y:l.pos.y,ue.z),L.group.lookAt(ii)}const ro=new N;function pc(l,M){const L=l.model;l.t+=M,l.flash>0&&(l.flash-=M,l.flash<=0&&be(l));const B=L.group.scale.x;B<1&&L.group.scale.setScalar(Math.min(1,B+M*3)),ro.copy(l.pos),l.pos.lerp(l.tgtPos,Math.min(1,M*10));const K=ro.distanceTo(l.pos)/Math.max(M,1e-4);if(L.wings){const ee=Math.sin(l.t*22)*.7;L.wings.forEach(me=>me.pivot.rotation.z=me.s*ee),L.body.position.y=Math.sin(l.t*5)*.08}if(L.legs){const ee=Math.sin(l.t*9)*.6*Math.min(1,K/2);L.legs.forEach(me=>me.pivot.rotation.x=me.s*ee),L.body.position.y=.55+Math.abs(ee)*.08}L.hand1&&(L.hand1.rotation.z=-l.t*4,L.body.rotation.z=l.wind?Math.sin(l.t*60)*.15:0),L.layers&&(L.layers.forEach((ee,me)=>ee.rotation.y=Math.sin(l.t*1.5+me)*.18),L.top.rotation.z=Math.sin(l.t*2)*.06),L.group.position.copy(l.pos);const ue=Gn(l.pos).pos;ii.set(ue.x,l.type==="email"?ue.y+zi:l.pos.y,ue.z),L.group.lookAt(ii)}const Zt=new N;function mc(){p.fireCd=1/Ll,p.mag--,p.kick=1,v.shots++,d.shoot(),_.flash.visible=!0,_.flash.rotation.z=je(0,Math.PI),p.fireT=.18;const M=Math.hypot(p.vel.x,p.vel.z)>1||!p.onGround?.022:.008,L=Math.cos(p.pitch);Zt.set(-Math.sin(p.yaw)*L,Math.sin(p.pitch),-Math.cos(p.yaw)*L);const B=F==="third"?m.position.clone().addScaledVector(Zt,Math.max(0,pr-.4)):y(new N);if(ao()){const J=oo(.2,B);J&&Zt.subVectors(J,B).normalize()}Zt.x+=je(-M,M),Zt.y+=je(-M,M),Zt.z+=je(-M,M),Zt.normalize();const K=kn(B,Zt,120);let ue=null,ee=K;for(const J of j){if(J.dead)continue;O(J,Mn);const Be=J.def.r;sn.subVectors(Mn,B);const Le=sn.dot(Zt);if(Le<0)continue;const vt=sn.lengthSq()-Le*Le;if(vt>Be*Be)continue;const st=Le-Math.sqrt(Be*Be-vt);st<ee&&(ee=st,ue=J)}let me=null;X()&&C.remotes.forEach(J=>{if(!J.d)for(const[Be,Le]of[[.8,.5],[1.5,.32]]){Mn.set(J.pos.x,J.pos.y+Be,J.pos.z),sn.subVectors(Mn,B);const vt=sn.dot(Zt);if(vt<0)continue;const st=sn.lengthSq()-vt*vt;if(st>Le*Le)continue;const Jt=vt-Math.sqrt(Le*Le-st);Jt<ee&&(ee=Jt,ue=null,me=J)}});const qe=B.clone().addScaledVector(Zt,ee),tt=F==="third"?new N(Math.cos(p.yaw)*.3-Math.sin(p.yaw)*.3,1.15,-Math.sin(p.yaw)*.3-Math.cos(p.yaw)*.3).add(p.pos):_.muzzle.getWorldPosition(new N);if(z(tt,qe),C.on){const J={t:"fx",a:[tt.x,tt.y,tt.z].map(Be=>+Be.toFixed(2)),b:[qe.x,qe.y,qe.z].map(Be=>+Be.toFixed(2))};C.isHost?A.broadcast(J):A.send(J)}me?(v.hits++,V(qe,Zt,se.RED,5,5),d.hit(),lo(),me.hitT=.15,ut(me.id,Dl)):ue?(v.hits++,Ae(ue,Dl,qe,Zt),d.hit(),lo()):ee<120&&(V(qe,null,se.BLUE,3,2.5),qe.y<.05&&W(qe.x,qe.z,se.BLUE,.25),d.wallHit()),p.mag<=0&&Es()}const ao=()=>a||re.active,gc=new N,Vn=new N,_c=new N;function oo(l,M){const L=y(gc),B=M||L,K=Math.cos(p.pitch);_c.set(-Math.sin(p.yaw)*K,Math.sin(p.pitch),-Math.cos(p.yaw)*K);let ue=null,ee=l;for(const me of j){if(me.dead)continue;O(me,Vn);const qe=Vn.clone().sub(B),tt=qe.length();if(tt>45)continue;const J=Math.atan2(-qe.x,-qe.z);let Be=Math.atan2(Math.sin(J-p.yaw),Math.cos(J-p.yaw));const Le=Math.abs(Be)+Math.max(0,Math.abs(Math.asin(qe.y/tt)-p.pitch)-.5)*.5;Le<ee&&Hn(L,Vn)&&(ee=Le,ue=Vn.clone())}return X()&&C.remotes.forEach(me=>{if(me.d)return;Vn.set(me.pos.x,me.pos.y+1,me.pos.z);const qe=Vn.clone().sub(B);if(qe.length()>45)return;const J=Math.atan2(-qe.x,-qe.z),Be=Math.abs(Math.atan2(Math.sin(J-p.yaw),Math.cos(J-p.yaw)));Be<ee&&Hn(L,Vn)&&(ee=Be,ue=Vn.clone())}),ue}function Es(){p.reload>0||p.mag===Hi||(p.reload=1.1,d.reload())}let dr=0;function lo(){dr=.12}function fr(l){v.score+=l}function ys(l,M,L,B){un(l,M,L),B&&d.wave(),C.on&&C.isHost&&A.broadcast({t:"msg",a:l,b:M,d:L,w:B?1:0})}function co(){p.down&&(p.down=!1,p.hp=60,p.iframes=1.5,un("","¡De vuelta al sprint! ❤ 60",1.6))}function vc(){co(),C.on&&C.isHost&&A.broadcast({t:"revive"})}function xc(){if(v.wave++,v.wave>=hs.length)return;const l=hs[v.wave];v.queue=[];for(const[M,L]of Object.entries(l.list))for(let B=0;B<L;B++)v.queue.push(M);v.queue=v.queue.filter(M=>M==="boss").concat(v.queue.filter(M=>M!=="boss").sort(()=>Math.random()-.5)),v.spawnT=.5,ys(l.title,l.sub,3,!0),vc(),v.wave>0&&Ve(je(-4,4),Je-4)}function Mc(l){if(v.winT>0){v.winT-=l,v.winT<=0&&po();return}if(v.interT>0){v.interT-=l,v.interT<=0&&xc();return}if(v.queue.length){v.spawnT-=l;const M=j.filter(L=>!L.dead).length;v.spawnT<=0&&M<14&&(le(v.queue.shift()),v.spawnT=v.wave<2?je(1.1,1.8):je(.5,1))}else v.wave<hs.length-1&&j.every(M=>M.dead)&&(ys("¡OLEADA SUPERADA!",`+${250*(v.wave+1)} pts · respira y tómate un café`,2.4),fr(250*(v.wave+1)),v.interT=3.2)}const hr=new N,uo=new N,si=new N;function fo(l){v.time+=l;const M=P==="play"&&!p.down;M||(rt=Z=0,Ce.jump=Ce.dash=!1);const L=.0022;p.yaw-=rt*L+re.lx*3*l,p.pitch=Bt(p.pitch-Z*L-re.ly*2.2*l,-1.45,1.45),rt=Z=0;const B=M?(oi.R||Fe.right?1:0)-(oi.L||Fe.left?1:0):0;p.turnV+=(B*2.7-p.turnV)*Math.min(1,l*(B?7:14)),p.yaw-=p.turnV*l;const K=M&&!!oi.A;K&&!p.aPrev&&(Ce.jump=!0),p.aPrev=K;const ue=M&&!!(oi.Up||Fe.up);ue&&!p.upPrev&&(v.time-p.upTapT<.28&&(Ce.dash=!0),p.upTapT=v.time),p.upPrev=ue;let ee=0,me=0;if(M&&(ee=re.mx,me=re.my,ue&&(me+=1),(oi.Down||Fe.down)&&(me-=1),(ye.KeyW||ye.ArrowUp)&&(me+=1),(ye.KeyS||ye.ArrowDown)&&(me-=1),(ye.KeyD||ye.ArrowRight)&&(ee+=1),(ye.KeyA||ye.ArrowLeft)&&(ee-=1)),hr.set(-Math.sin(p.yaw),0,-Math.cos(p.yaw)),uo.set(Math.cos(p.yaw),0,-Math.sin(p.yaw)),si.set(0,0,0).addScaledVector(hr,me).addScaledVector(uo,ee),si.lengthSq()>1&&si.normalize(),p.moveX=ee||B*.5,p.dashCd-=l,Ce.dash&&p.dashCd<=0&&(p.dashT=.17,p.dashCd=1.1,p.dashDir.copy(si.lengthSq()>.01?si:hr).normalize(),p.iframes=.2,d.dash()),Ce.dash=!1,p.dashT>0)p.dashT-=l,p.vel.x=p.dashDir.x*21,p.vel.z=p.dashDir.z*21;else{const J=p.onGround?14:3.5;p.vel.x+=(si.x*b-p.vel.x)*Math.min(1,J*l),p.vel.z+=(si.z*b-p.vel.z)*Math.min(1,J*l)}p.iframes-=l,v.time-p.lastHurt>4&&p.hp<100&&(p.hp=Math.min(100,p.hp+3*l)),p.coyote=p.onGround?.1:p.coyote-l,Ce.jump&&p.coyote>0&&(p.vel.y=R,p.onGround=!1,p.coyote=0,d.jump()),Ce.jump=!1,p.vel.y-=Qm*l,p.pos.addScaledVector(p.vel,l),cn(p.pos,fs,p.pos.y+na,p.pos.y+Pl);const qe=Ei(p.pos.x,p.pos.z,fs,p.pos.y),tt=p.onGround;if(p.pos.y<=qe?(p.pos.y=qe,p.vel.y=Math.max(0,p.vel.y),p.onGround=!0):tt&&p.vel.y<=0&&p.pos.y-qe<na?(p.pos.y=qe,p.vel.y=0):p.onGround=!1,p.fireCd-=l,p.reload>0?(p.reload-=l,p.reload<=0&&(p.mag=Hi)):M&&(Ce.fire||oi.B||re.fire)&&p.fireCd<=0&&(p.mag>0?mc():Es()),M&&ao()&&(oi.B||re.fire)){const J=oo(.35);if(J){let Le=Math.atan2(-(J.x-p.pos.x),-(J.z-p.pos.z))-p.yaw;Le=Math.atan2(Math.sin(Le),Math.cos(Le)),p.yaw+=Bt(Le,-2.2*l,2.2*l)}}X()?rn(l):H()||Mc(l);for(const J of j)J.dead||(J.puppet?pc(J,l):hc(J,l));j=j.filter(J=>!J.dead);for(const J of $){J.life-=l,J.pos.addScaledVector(J.vel,l),J.mesh.position.copy(J.pos),J.mesh.rotation.y+=l*8,J.mesh.rotation.x+=l*5;const Be=Bt(J.pos.y,p.pos.y+.3,p.pos.y+zi),Le=J.pos.x-p.pos.x,vt=J.pos.z-p.pos.z,st=J.pos.y-Be;!p.down&&Le*Le+st*st+vt*vt<.5*.5?(Re(J.dmg,J.pos),J.life=0,V(J.pos,null,se.ORANGE,6,3)):Ss(J.pos)&&(J.life=0,V(J.pos,null,se.ORANGE,4,2)),J.life<=0&&f.remove(J.mesh)}$=$.filter(J=>J.life>0);for(const J of ae)J.t+=l,J.life-=l,J.model.group.position.y=.25+Math.sin(J.t*3)*.12,J.model.group.rotation.y+=l*1.8,!p.down&&J.life>0&&Math.hypot(J.pos.x-p.pos.x,J.pos.z-p.pos.z)<1.2&&Math.abs(p.pos.y-J.pos.y)<1.5&&p.hp<100&&(p.hp=Math.min(100,p.hp+25),J.life=0,C.on&&(C.isHost?A.broadcast({t:"rmcof",id:J.id}):A.send({t:"take",id:J.id})),d.pickup(),un("","☕ +25 · café de la oficina",1.2)),J.life<=0&&f.remove(J.model.group);ae=ae.filter(J=>J.life>0)}function Sc(l){for(const M of q)M.alive&&(M.life-=l,M.vel.y-=18*l,M.mesh.position.addScaledVector(M.vel,l),M.mesh.position.y<=.02&&(Math.random()<.35&&W(M.mesh.position.x,M.mesh.position.z,M.ink,M.mesh.scale.x*5),M.life=0),M.life<=0&&(M.alive=!1,M.mesh.visible=!1));for(const M of Me)M.life>0&&(M.life-=l,M.life<=0&&(M.mesh.visible=!1));_.flash.visible&&p.fireCd<1/Ll-.04&&(_.flash.visible=!1),v.hurt=Math.max(0,v.hurt-l*1.4),v.flash=Math.max(0,v.flash-l*.8),p.shake=Math.max(0,p.shake-l*2.5),p.kick=Math.max(0,p.kick-l*12)}let pr=0;const mr=new N,is=new N;function Ec(l){const M=Math.hypot(p.vel.x,p.vel.z);p.onGround&&M>.5&&(p.bob+=l*M*1.6);const L=Math.sin(p.bob*2)*.045*Math.min(1,M/6),B=p.shake*p.shake*.12;if(F==="third"){const ue=Math.cos(p.pitch),ee=-Math.sin(p.yaw)*ue,me=Math.sin(p.pitch),qe=-Math.cos(p.yaw)*ue;mr.set(p.pos.x,p.pos.y+1.55,p.pos.z),is.set(-ee*4.3+Math.cos(p.yaw)*1,-me*4.3+.45,-qe*4.3-Math.sin(p.yaw)*1);const tt=is.length();is.divideScalar(tt);const J=kn(mr,is,tt),Be=Math.max(.35,Math.min(tt,J-.25));m.position.copy(mr).addScaledVector(is,Be),m.position.x+=je(-B,B),m.position.y=Math.max(.25,m.position.y+je(-B,B)),m.position.z+=je(-B,B),pr=Be*.95}else m.position.set(p.pos.x+je(-B,B),p.pos.y+zi+L+je(-B,B),p.pos.z+je(-B,B)),pr=0;m.rotation.set(p.pitch,p.yaw,0);const K=p.reload>0?Math.sin(Math.min(1,(1.1-p.reload)/1.1)*Math.PI):0;_.group.position.set(x.x+Math.cos(p.bob)*.012*Math.min(1,M/6),x.y+L*.5-K*.25,x.z+p.kick*.07),_.group.rotation.set(p.kick*.09+K*.6,.05,K*.5)}const Rt={hpB:r(".dd-hp-label b"),hpBar:r(".dd-hp-bar i"),ammoB:r(".dd-ammo b"),ammo:r(".dd-ammo"),wave:r(".dd-wave"),score:r(".dd-score"),boss:r(".dd-boss-bar i"),dash:r(".dd-dash i"),msg:r(".dd-msg"),sub:r(".dd-sub"),hit:r(".dd-hitmark"),cross:r(".dd-cross")};let gr=0;function un(l,M,L){Rt.msg.textContent=l,Rt.sub.textContent=M,Rt.msg.classList.remove("pop"),Rt.msg.offsetWidth,Rt.msg.classList.add("pop"),gr=L}const ho={};function ss(l,M,L){ho[M]!==L&&(ho[M]=L,l.textContent=L)}function yc(l){ss(Rt.hpB,"hp",String(Math.ceil(p.hp))),Rt.hpBar.style.width=`${p.hp}%`,Rt.hpBar.classList.toggle("low",p.hp<=30),ss(Rt.ammoB,"ammo",p.reload>0?"···":String(p.mag)),Rt.ammo.classList.toggle("low",p.mag<=6&&p.reload<=0),X()?ss(Rt.wave,"wave",`· ⚔️ ${C.frags[A.myId]||0}/${$s} bajas`):ss(Rt.wave,"wave",v.wave>=0?`· ${hs[Math.min(v.wave,hs.length-1)].title} (${Math.min(v.wave+1,6)}/6)`:""),ss(Rt.score,"score",X()?`${C.frags[A.myId]||0} ☠`:v.score.toLocaleString("es-ES")),v.boss&&(Rt.boss.style.width=`${Math.max(0,v.boss.hp/v.boss.maxHp*100)}%`),Rt.dash.style.width=`${Bt(1-p.dashCd/1.1,0,1)*100}%`,gr-=l;const M=gr>0;Rt.msg.style.opacity=M?"1":"0",Rt.sub.style.opacity=M?"1":"0",dr-=l,Rt.hit.style.opacity=dr>0?"1":"0";const L=8+Math.min(10,Math.hypot(p.vel.x,p.vel.z)*1.2)+p.kick*6;Rt.cross.style.setProperty("--gap",`${L}px`)}function Tc(l){return l>=19e3?"S":l>=15e3?"A":l>=1e4?"B":"C"}function _r(l){const M=v.shots?Math.round(v.hits/v.shots*100):0,L=Math.floor(v.time/60),B=Math.floor(v.time%60);r(".dd-end-kicker").textContent=l?"INBOX ZERO":"GAME OVER",r(".dd-end-title").textContent=l?"¡Bandeja de entrada vacía!":"Te han enterrado en emails";const K=Tc(v.score);return r(".dd-end-stats").innerHTML=`
      <div><span>Puntos</span><b>${v.score.toLocaleString("es-ES")}</b></div>
      ${l?`<div><span>Rango</span><b class="dd-rank">${K}</b></div>`:`<div><span>Oleada</span><b>${v.wave+1}/6</b></div>`}
      <div><span>Eliminados</span><b>${v.kills}</b></div>
      <div><span>Precisión</span><b>${M}%</b></div>
      <div><span>Tiempo</span><b>${L}:${String(B).padStart(2,"0")}</b></div>`,Bn("end"),Ce.fire=!1,Kt(),document.pointerLockElement===o&&document.exitPointerLock(),K}function vr(){C.on&&C.isHost&&A.broadcast({t:"over"}),P="over",d.lose(),_r(!1)}function po(l){if(P==="win"||P==="over"||P==="start")return;if(P="win",H())v.score=l||v.score;else{const L=Math.round(p.hp*20+Math.max(0,3e3-v.time*8));fr(L),C.on&&A.broadcast({t:"win",s:v.score})}d.victory();const M=_r(!0);try{n&&n(v.score,M)}catch{}}function bc(){j.forEach(l=>f.remove(l.model.group)),$.forEach(l=>f.remove(l.mesh)),ae.forEach(l=>f.remove(l.model.group)),he.forEach(l=>f.remove(l)),he.length=0,q.forEach(l=>{l.alive=!1,l.mesh.visible=!1}),j=[],$=[],ae=[],Object.assign(p,{down:!1,lastHurt:0,turnV:0,fireT:0,moveX:0,yaw:0,pitch:0,onGround:!0,coyote:0,hp:100,mag:Hi,reload:0,fireCd:0,dashCd:0,dashT:0,shake:0,kick:0,iframes:0}),p.vel.set(0,0,0),C.on?Ee(C.spawnIdx>=0?C.spawnIdx:Oe()):p.pos.set(0,0,22),Object.assign(v,{winT:0,wave:-1,queue:[],spawnT:0,interT:X()?0:1.2,time:0,score:0,kills:0,shots:0,hits:0,hurt:0,flash:0,boss:null}),C.respawnT=0,C.lastAttacker=null,C.cofT=6,r(".dd-feed").innerHTML="",r(".dd-boss").classList.add("hidden"),X()?un("TODOS CONTRA TODOS",`Tacha a tus compañeros · gana el primero a ${$s} bajas`,3):un("DOODLE DISTRICT","Prepara el boli...",1.2)}function Ts(){const l=Math.max(1,s.clientWidth||window.innerWidth),M=Math.max(1,s.clientHeight||window.innerHeight);m.aspect=l/M,m.fov=l<M?90:75,m.updateProjectionMatrix(),u.setSize(l,M),Kt()}const bs=typeof ResizeObserver<"u"?new ResizeObserver(()=>Ts()):null;bs&&bs.observe(s),window.addEventListener("resize",Ts),Ts(),p.pos.set(0,0,22);let xr=0,Mr=performance.now(),ri=0,mo=0,go=performance.now();function _o(l){xr=requestAnimationFrame(_o),go=performance.now();const M=Math.min(.1,(l-Mr)/1e3);if(Mr=l,mo+=M,Se(),e){const L=e();L&&i&&L.id!==i.id&&(T(L),un("",`${L.emoji} ${L.name} entra en juego`,1.4))}if(P==="play"||C.on&&P==="pause")for(ri+=M;ri>=Bi;)fo(Bi),ri-=Bi;else ri=0,P==="start"&&(p.yaw+=M*.12);if(Sc(P==="play"||P==="win"?M:0),Ec(P==="play"?M:0),F==="third"){p.fireT-=M,h.update(P==="play"?M:0,{pos:p.pos,camera:m,moveX:p.moveX,speed:Math.hypot(p.vel.x,p.vel.z),onGround:p.onGround,firing:p.fireT>0,hurt:Math.min(1,v.hurt*1.5)});const L=Ei(p.pos.x,p.pos.z,fs,p.pos.y+.01),B=Bt(1-(p.pos.y-L)/3,.35,1);c.position.set(p.pos.x,L+.02,p.pos.z),c.scale.set(.9*B,.55*B,1)}ct(M),Ms(P==="start"?0:M),ln(M),yc(M),u.render(f,m,{time:mo,hurt:v.hurt,lowHp:P==="play"&&p.hp<=30?1:0,flash:v.flash},E)}xr=requestAnimationFrame(_o);let Sr=performance.now();const Ac=setInterval(()=>{const l=performance.now();if(!C.on||l-go<300){Sr=l;return}const M=Math.min(1,(l-Sr)/1e3);if(Sr=l,Mr=l,P==="play"||P==="pause")for(ri+=M;ri>=Bi;)fo(Bi),ri-=Bi;C.netT=1,ct(M)},50);let vo=!1;function xo(){vo||(vo=!0,cancelAnimationFrame(xr),clearInterval(Ac),window.removeEventListener("keydown",ce),window.removeEventListener("keyup",Pe),document.removeEventListener("mousemove",ze),window.removeEventListener("mouseup",Ke),document.removeEventListener("pointerlockchange",St),document.removeEventListener("pointerlockerror",et),window.removeEventListener("blur",zt),window.removeEventListener("resize",Ts),bs&&bs.disconnect(),A.destroy(),[...C.remotes.keys()].forEach(Ge),document.pointerLockElement&&document.exitPointerLock(),Q.forEach(([l,M])=>l.textContent=M),document.body.classList.remove("doodle-mode"),d.destroy(),h.dispose(),u.dispose(),s.remove(),window.__doodle&&delete window.__doodle)}function Mo(){xo(),t&&t()}return{destroy:xo,exit:Mo,setChar:T,toggleCam:D}}export{i0 as startDoodleWorld};
