import { currentUser } from "../../server/auth.js";

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
        "Access-Control-Allow-Origin": "*",
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

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: "Database not bound" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const body = await request.json();
    // con sesión de Google, la puntuación va a su nombre (no se puede suplantar a otro)
    const user = await currentUser(request, env).catch(() => null);
    if (env.REQUIRE_LOGIN && !user) {
      return new Response(JSON.stringify({ success: false, error: "Inicia sesión para entrar en el ranking" }), {
        status: 401, headers: { "Content-Type": "application/json" }
      });
    }
    const name = String((user && user.nick) || body.name || "ANON").trim().slice(0, 15).toUpperCase();
    const score = Math.max(0, parseInt(body.score, 10) || 0);
    const character = String(body.character || "alejandro").slice(0, 30);
    const char_name = String(body.char_name || "ALEJANDRO R.").slice(0, 40);
    const time_seconds = Math.max(0, parseFloat(body.time_seconds) || 0);
    const rank = String(body.rank || "C").slice(0, 5);
    const deaths = Math.max(0, parseInt(body.deaths, 10) || 0);

    const world = Math.max(0, parseInt(body.world, 10) || 0);
    let info;
    try {
      info = await env.DB.prepare(
        "INSERT INTO leaderboard (name, score, character, char_name, time_seconds, rank, deaths, world, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(name, score, character, char_name, time_seconds, rank, deaths, world, user ? user.id : null).run();
    } catch (e) {
      // base de datos sin la columna "world" todavía (migrations/0002_add_world.sql)
      info = await env.DB.prepare(
        "INSERT INTO leaderboard (name, score, character, char_name, time_seconds, rank, deaths) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(name, score, character, char_name, time_seconds, rank, deaths).run();
    }

    const countResult = await env.DB.prepare(
      "SELECT COUNT(*) as higher_count FROM leaderboard WHERE score > ?"
    ).bind(score).first();

    const position = (countResult?.higher_count || 0) + 1;

    return new Response(JSON.stringify({
      success: true,
      id: info?.meta?.last_row_id,
      position
    }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
