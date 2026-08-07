/**
 * POST /api/auth/register — Selbstregistrierung, nur mit @sowespoke.com-
 * oder @sowespoke.de-E-Mail möglich. Erfordert D1-Binding "DB" (Tabelle
 * "users", siehe schema.sql) und Secret "SESSION_SECRET".
 */

import { isAllowedEmail, hashPassword, createSessionToken, sessionCookie, json } from "../../_lib/auth.js";

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

  if (!isAllowedEmail(email)) {
    return json({ error: "Registrierung nur mit @sowespoke.com- oder @sowespoke.de-E-Mail möglich" }, 403);
  }
  if (password.length < 8) {
    return json({ error: "Passwort muss mindestens 8 Zeichen haben" }, 400);
  }

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existing) {
    return json({ error: "Für diese E-Mail existiert bereits ein Konto" }, 409);
  }

  const { salt, hash } = await hashPassword(password);
  await env.DB.prepare(
    "INSERT INTO users (email, password_hash, salt, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(email, hash, salt, new Date().toISOString())
    .run();

  const token = await createSessionToken(email, env.SESSION_SECRET);
  return json({ ok: true }, 200, sessionCookie(token));
}
