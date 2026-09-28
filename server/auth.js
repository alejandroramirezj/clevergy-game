// =============================================================================
// server/auth.js — Login con Google para las Pages Functions
// El navegador obtiene un ID token con "Iniciar sesión con Google" (Google Identity
// Services); aquí se verifica su firma RS256 contra las claves públicas de Google,
// se guarda el usuario en D1 y se deja una cookie de sesión firmada (HMAC-SHA256).
// Variables de entorno: GOOGLE_CLIENT_ID, SESSION_SECRET y, opcional, ALLOWED_DOMAIN
// (p. ej. "clever.gy" para que sólo entre el equipo).
// =============================================================================

const COOKIE = "cg_session";
const SESSION_DAYS = 60;
const enc = new TextEncoder();

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });

let jwksCache = null, jwksAt = 0;
async function googleKeys() {
  if (jwksCache && Date.now() - jwksAt < 3600e3) return jwksCache;
  const res = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  jwksCache = (await res.json()).keys || [];
  jwksAt = Date.now();
  return jwksCache;
}

/** Verifica un ID token de Google y devuelve su contenido (o lanza un error). */
export async function verifyGoogleToken(token, clientId) {
  const [h, p, s] = String(token || "").split(".");
  if (!h || !p || !s) throw new Error("token mal formado");
  const header = JSON.parse(new TextDecoder().decode(fromB64url(h)));
  const payload = JSON.parse(new TextDecoder().decode(fromB64url(p)));
  const jwk = (await googleKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("clave de Google desconocida");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, fromB64url(s), enc.encode(`${h}.${p}`));
  if (!ok) throw new Error("firma no válida");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss)) throw new Error("emisor no válido");
  if (payload.aud !== clientId) throw new Error("token de otra aplicación");
  if (payload.exp * 1000 < Date.now()) throw new Error("token caducado");
  if (!payload.email_verified) throw new Error("email sin verificar");
  return payload;
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function sessionCookie(env, uid) {
  const body = b64url(enc.encode(JSON.stringify({ uid, exp: Date.now() + SESSION_DAYS * 864e5 })));
  const sig = await hmac(env.SESSION_SECRET, body);
  return `${COOKIE}=${body}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`;
}
export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** Usuario de la sesión actual (fila de D1) o null. */
export async function currentUser(request, env) {
  if (!env.SESSION_SECRET || !env.DB) return null;
  const m = (request.headers.get("Cookie") || "").match(new RegExp(`${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [body, sig] = m[1].split(".");
  if (!body || !sig || sig !== (await hmac(env.SESSION_SECRET, body))) return null;
  let data;
  try { data = JSON.parse(new TextDecoder().decode(fromB64url(body))); } catch (e) { return null; }
  if (!data.uid || data.exp < Date.now()) return null;
  return await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(data.uid).first();
}

export function publicUser(u) {
  if (!u) return null;
  let progress = null;
  try { progress = u.progress ? JSON.parse(u.progress) : null; } catch (e) {}
  return { id: u.id, name: u.name, nick: u.nick, picture: u.picture, email: u.email, character: u.character, progress };
}
