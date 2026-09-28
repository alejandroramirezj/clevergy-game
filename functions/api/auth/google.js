import { json, verifyGoogleToken, sessionCookie, publicUser } from "../../../server/auth.js";

// POST { credential } → verifica el ID token de Google, crea/actualiza el usuario y abre sesión
export async function onRequestPost({ request, env }) {
  if (!env.GOOGLE_CLIENT_ID || !env.SESSION_SECRET || !env.DB) return json({ ok: false, error: "Login no configurado" }, 503);
  try {
    const { credential } = await request.json();
    const g = await verifyGoogleToken(credential, env.GOOGLE_CLIENT_ID);
    if (env.ALLOWED_DOMAIN && !String(g.email).toLowerCase().endsWith("@" + env.ALLOWED_DOMAIN.toLowerCase())) {
      return json({ ok: false, error: `Solo cuentas @${env.ALLOWED_DOMAIN}` }, 403);
    }
    const nick = String(g.given_name || g.name || g.email.split("@")[0]).trim().slice(0, 15).toUpperCase();
    await env.DB.prepare(
      `INSERT INTO users (id, email, name, nick, picture) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, picture = excluded.picture, last_login = CURRENT_TIMESTAMP`
    ).bind(g.sub, g.email, g.name || nick, nick, g.picture || "").run();
    const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(g.sub).first();
    return json({ ok: true, user: publicUser(user) }, 200, { "Set-Cookie": await sessionCookie(env, g.sub) });
  } catch (err) {
    return json({ ok: false, error: err.message }, 401);
  }
}
