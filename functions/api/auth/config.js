import { json } from "../../../server/auth.js";

// el cliente pide aquí el ID de cliente de Google (así no hay que meterlo en el build)
export async function onRequestGet({ env }) {
  return json({ clientId: env.GOOGLE_CLIENT_ID || null, domain: env.ALLOWED_DOMAIN || null });
}
