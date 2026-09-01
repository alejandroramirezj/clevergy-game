export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ success: false, error: "Database not bound", data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const { results } = await env.DB.prepare(
      "SELECT name, score, character, char_name, time_seconds, rank, deaths, created_at FROM leaderboard ORDER BY score DESC, time_seconds ASC LIMIT 50"
    ).all();

    return new Response(JSON.stringify({ success: true, data: results || [] }), {
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
    const name = String(body.name || "ANON").trim().slice(0, 15).toUpperCase();
    const score = Math.max(0, parseInt(body.score, 10) || 0);
    const character = String(body.character || "alejandro").slice(0, 30);
    const char_name = String(body.char_name || "ALEJANDRO R.").slice(0, 40);
    const time_seconds = Math.max(0, parseFloat(body.time_seconds) || 0);
    const rank = String(body.rank || "C").slice(0, 5);
    const deaths = Math.max(0, parseInt(body.deaths, 10) || 0);

    const info = await env.DB.prepare(
      "INSERT INTO leaderboard (name, score, character, char_name, time_seconds, rank, deaths) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(name, score, character, char_name, time_seconds, rank, deaths).run();

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
