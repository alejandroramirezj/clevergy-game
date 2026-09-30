import { currentUser } from "../../server/auth.js";
import { validateScore } from "../../server/score.js";

export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: "Database not bound", data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const { results } = await env.DB.prepare(
      "SELECT * FROM leaderboard ORDER BY score DESC, time_seconds ASC LIMIT 800"
    ).all();

    // sin el id de Google: sólo lo necesario para pintar el ranking
    const data = (results || []).map(({ user_id, ...row }) => ({ ...row, verified: !!user_id }));
    return new Response(JSON.stringify({ success: true, data }), {
      headers: {
        "Content-Type": "application/json",
                "Cache-Control": "public, max-age=5"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message, data: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

const J = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

// POST: sólo desde el propio juego (sin CORS abierto), con tope por mundo, límite de envíos
// y guardando sólo el mejor récord de cada jugador en cada mundo
export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) return J({ success: false, error: "Database not bound" });
    const body = await request.json().catch(() => ({}));
    const user = await currentUser(request, env).catch(() => null);
    if (env.REQUIRE_LOGIN && !user) return J({ success: false, error: "Inicia sesión para entrar en el ranking" }, 401);
    const v = validateScore(body, user);
    if (!v.ok) return J({ success: false, error: v.error }, 400);
    const e = v.entry;
    const who = e.user_id ? ["user_id = ?", e.user_id] : ["name = ? AND user_id IS NULL", e.name];

    // como mucho 4 envíos por minuto por jugador
    const recent = await env.DB.prepare(`SELECT COUNT(*) AS n FROM leaderboard WHERE ${who[0]} AND created_at > datetime('now', '-60 seconds')`).bind(who[1]).first().catch(() => ({ n: 0 }));
    if ((recent?.n || 0) >= 4) return J({ success: false, error: "Demasiados envíos, espera un momento" }, 429);

    // si ya tenía un récord mejor en ese mundo, no se guarda otro
    const prev = await env.DB.prepare(`SELECT id, score FROM leaderboard WHERE ${who[0]} AND world = ? ORDER BY score DESC LIMIT 1`).bind(who[1], e.world).first().catch(() => null);
    if (prev && prev.score >= e.score) return J({ success: true, kept: true, best: prev.score });
    if (prev) await env.DB.prepare(`DELETE FROM leaderboard WHERE ${who[0]} AND world = ?`).bind(who[1], e.world).run();

    const info = await env.DB.prepare(
      "INSERT INTO leaderboard (name, score, character, char_name, time_seconds, rank, deaths, world, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(e.name, e.score, e.character, e.char_name, e.time_seconds, e.rank, e.deaths, e.world, e.user_id).run();
    const higher = await env.DB.prepare("SELECT COUNT(*) AS n FROM leaderboard WHERE world = ? AND score > ?").bind(e.world, e.score).first();
    return J({ success: true, id: info?.meta?.last_row_id, position: (higher?.n || 0) + 1 });
  } catch (err) {
    console.error("Leaderboard POST error:", err);
    return J({ success: false, error: err.message || "Error guardando la puntuación" }, 500);
  }
}
