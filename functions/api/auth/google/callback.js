/**
 * GET /api/auth/google/callback — nimmt Googles OAuth-Redirect entgegen,
 * tauscht den Code gegen ein id_token, prüft es und setzt bei Erfolg die
 * eigene Session-Cookie. Nur @sowespoke.com/@sowespoke.de-Konten werden
 * akzeptiert (siehe isAllowedEmail).
 */

import { isAllowedEmail, createSessionToken, sessionCookie, getCookie, safeNextPath } from "../../../_lib/auth.js";

const CLEAR_STATE_COOKIE = "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";

function toLogin(origin, error) {
  const target = new URL("/login", origin);
  if (error) target.searchParams.set("error", error);
  const headers = new Headers({ Location: target.toString() });
  headers.append("Set-Cookie", CLEAR_STATE_COOKIE);
  return new Response(null, { status: 302, headers });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin;

  if (url.searchParams.get("error")) return toLogin(origin, "google");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = getCookie(request, "oauth_state");
  if (!code || !state || !cookieState || state !== cookieState) {
    return toLogin(origin, "state");
  }
  const next = safeNextPath(decodeURIComponent(state.split(":").slice(1).join(":") || "/"));

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return new Response("Google-Login nicht konfiguriert", { status: 500 });
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${origin}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return toLogin(origin, "oauth");
  const tokenData = await tokenRes.json();
  if (!tokenData.id_token) return toLogin(origin, "oauth");

  // tokeninfo statt manueller JWT-Signaturprüfung — Google validiert die
  // Signatur serverseitig; wir müssen nur noch aud/email_verified/Domain prüfen.
  const infoRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokenData.id_token)}`
  );
  if (!infoRes.ok) return toLogin(origin, "oauth");
  const info = await infoRes.json();

  if (info.aud !== env.GOOGLE_CLIENT_ID) return toLogin(origin, "oauth");
  if (info.email_verified !== "true" && info.email_verified !== true) return toLogin(origin, "oauth");

  const email = String(info.email || "").toLowerCase();
  if (!isAllowedEmail(email)) return toLogin(origin, "domain");

  // Login-Log (2026-08-14, Nutzer-Wunsch: sehen, wer die Seite nutzt) — ein
  // Eintrag PRO PERSON statt eines endlos wachsenden Rohlogs, siehe
  // functions/api/admin/login-log.js. Läuft nur beim tatsächlichen
  // OAuth-Roundtrip (Erst-Login bzw. nach Ablauf der 14-Tage-Session), nicht
  // bei jedem Seitenaufruf — "zuletzt eingeloggt" heißt also "zuletzt neu
  // authentifiziert", nicht "zuletzt aktiv geklickt". Graceful: ohne
  // LOGIN_LOG-Bindung läuft der Login normal weiter, nur ohne Protokoll.
  if (env.LOGIN_LOG) {
    const key = `user:${email}`;
    const existing = await env.LOGIN_LOG.get(key, "json");
    const now = new Date().toISOString();
    await env.LOGIN_LOG.put(
      key,
      JSON.stringify({
        email,
        firstLoginAt: existing?.firstLoginAt || now,
        lastLoginAt: now,
        loginCount: (existing?.loginCount || 0) + 1,
      })
    );
  }

  const token = await createSessionToken(email, env.SESSION_SECRET);
  const headers = new Headers({ Location: new URL(next, origin).toString() });
  headers.append("Set-Cookie", sessionCookie(token));
  headers.append("Set-Cookie", CLEAR_STATE_COOKIE);
  return new Response(null, { status: 302, headers });
}
