// functions/api/turn-credentials.js
// Cloudflare Pages Function — genera credenciales TURN de corta duración
// para el juego usando Cloudflare Realtime TURN.
//
// Variables de entorno necesarias (en CF Pages > Settings > Environment variables):
//   TURN_KEY_ID      → ID de la TURN Key (se crea en dash.cloudflare.com > Calls > TURN Keys)
//   TURN_KEY_TOKEN   → API Token asociado a esa TURN Key
//
// El cliente llama a GET /api/turn-credentials y recibe los iceServers listos para PeerJS.

export async function onRequestGet(ctx) {
  const { env } = ctx;

  // CORS para que el juego pueda llamar desde cualquier origen
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  // Preflight
  if (ctx.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  const keyId = env.TURN_KEY_ID;
  const token = env.TURN_KEY_TOKEN;

  // Si no están configuradas las variables, devuelve sólo STUN (seguirá funcionando en WiFi)
  if (!keyId || !token) {
    return new Response(JSON.stringify({
      iceServers: [
        { urls: "stun:stun.cloudflare.com:3478" },
        { urls: "stun:stun.l.google.com:19302" }
      ],
      _fallback: true
    }), { status: 200, headers: cors });
  }

  try {
    const res = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate-ice-servers`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ttl: 86400 }) // credenciales válidas 24h
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[turn-credentials] CF TURN API error:", res.status, err);
      // Fallback a STUN si CF falla
      return new Response(JSON.stringify({
        iceServers: [
          { urls: "stun:stun.cloudflare.com:3478" },
          { urls: "stun:stun.l.google.com:19302" }
        ],
        _fallback: true
      }), { status: 200, headers: cors });
    }

    const data = await res.json();

    // data.iceServers ya tiene el formato exacto que PeerJS espera
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...cors,
        // Cacheable 23h — las credenciales duran 24h
        "Cache-Control": "private, max-age=82800"
      }
    });

  } catch (e) {
    console.error("[turn-credentials] Error:", e);
    return new Response(JSON.stringify({
      iceServers: [
        { urls: "stun:stun.cloudflare.com:3478" },
        { urls: "stun:stun.l.google.com:19302" }
      ],
      _fallback: true
    }), { status: 200, headers: cors });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    }
  });
}
