import { json, currentUser, publicUser } from "../../server/auth.js";
import { CHAR_IDS } from "../../server/chars.js";

// GET → el usuario con sesión (o null) · POST { character?, nick?, progress? } → guarda su perfil
export async function onRequestGet({ request, env }) {
  return json({ user: publicUser(await currentUser(request, env)) });
}

export async function onRequestPost({ request, env }) {
  const u = await currentUser(request, env);
  if (!u) return json({ ok: false, error: "Sin sesión" }, 401);
  const body = await request.json().catch(() => ({}));
  const character = CHAR_IDS.includes(body.character) ? body.character : u.character;
  const nick = body.nick ? String(body.nick).trim().slice(0, 15).toUpperCase() || u.nick : u.nick;
  let progress = u.progress;
  if (body.progress && typeof body.progress === "object") {
    // se fusiona con lo guardado: mundos completados sumados y el mejor récord de cada uno
    let prev = {};
    try { prev = JSON.parse(u.progress || "{}"); } catch (e) {}
    const next = body.progress;
    const merged = { completed: [...new Set([...(prev.completed || []), ...(next.completed || [])])].filter(Number.isFinite), highScores: { ...(prev.highScores || {}) }, ranks: { ...(prev.ranks || {}) } };
    for (const [w, sc] of Object.entries(next.highScores || {})) {
      if ((Number(sc) || 0) > (Number(merged.highScores[w]) || 0)) { merged.highScores[w] = Number(sc) || 0; merged.ranks[w] = String((next.ranks || {})[w] || "").slice(0, 3); }
    }
    progress = JSON.stringify(merged).slice(0, 4000);
  }
  await env.DB.prepare("UPDATE users SET character = ?, nick = ?, progress = ? WHERE id = ?").bind(character || null, nick, progress, u.id).run();
  return json({ ok: true, user: publicUser(await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(u.id).first()) });
}
