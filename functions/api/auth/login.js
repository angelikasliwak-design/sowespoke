/**
 * POST /api/auth/login — meldet ein bestehendes Konto an. Prüft die
 * Domain zusätzlich zur Registrierung erneut (defense in depth), auch
 * wenn nur erlaubte Domains überhaupt ein Konto anlegen können.
 */

import { isAllowedEmail, verifyPassword, createSessionToken, sessionCookie, json } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.DB) return json({ error: "Datenbank nicht konfiguriert (D1-Binding DB fehlt)" }, 500);
  if (!env.SESSION_SECRET) return json({ error: "SESSION_SECRET nicht konfiguriert" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }

  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const genericError = () => json({ error: "E-Mail oder Passwort falsch" }, 401);

  if (!isAllowedEmail(email)) return genericError();

  const user = await env.DB.prepare(
    "SELECT email, password_hash, salt FROM users WHERE email = ?"
  )
    .bind(email)
    .first();
  if (!user) return genericError();

  const valid = await verifyPassword(password, user.salt, user.password_hash);
  if (!valid) return genericError();

  const token = await createSessionToken(user.email, env.SESSION_SECRET);
  return json({ ok: true }, 200, sessionCookie(token));
}
