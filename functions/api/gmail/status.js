/**
 * GET /api/gmail/status — meldet, ob die eingeloggte Person bereits eine
 * eigene Gmail-Versand-Verbindung hat (functions/api/auth/gmail/*).
 * DELETE /api/gmail/status — trennt die eigene Verbindung wieder (löscht
 * nur das eigene refresh_token, nicht die Google-Kontoberechtigung selbst —
 * die kann jede Person zusätzlich unter myaccount.google.com/permissions
 * widerrufen).
 */

import { verifySessionToken, getCookie, json } from "../../_lib/auth.js";

function keyFor(email) {
  return `gmail:${email}`;
}

async function requireSession(context) {
  const { env, request } = context;
  return verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
}

export async function onRequestGet(context) {
  const { env } = context;
  const session = await requireSession(context);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (!env.GMAIL_SEND_TOKENS) return json({ connected: false });

  const stored = await env.GMAIL_SEND_TOKENS.get(keyFor(session.email), "json");
  return json({ connected: !!(stored && stored.refreshToken) });
}

export async function onRequestDelete(context) {
  const { env } = context;
  const session = await requireSession(context);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (env.GMAIL_SEND_TOKENS) await env.GMAIL_SEND_TOKENS.delete(keyFor(session.email));
  return json({ ok: true });
}
