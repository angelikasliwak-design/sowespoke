/**
 * GET /api/auth/gmail/callback — nimmt Googles OAuth-Redirect für den
 * gmail.send-Zustimmungs-Flow entgegen (siehe start.js). Läuft im Popup,
 * tauscht den Code gegen ein refresh_token, speichert es KV-seitig
 * (RECIPIENT_LISTS-Schwester-Namespace GMAIL_SEND_TOKENS, an die
 * Login-E-Mail gebunden) und schließt sich danach selbst — kein Redirect
 * auf eine Seite, weil das den Hash-Pfad der SPA verlieren würde.
 */

import { verifySessionToken, getCookie } from "../../../_lib/auth.js";

const CLEAR_STATE_COOKIE = "gmail_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";

function popupResult(success, message) {
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Gmail-Verbindung</title></head>
<body style="font-family:sans-serif;padding:24px;color:#111;">
<p>${success ? "Verbindung erfolgreich — Fenster schließt sich …" : `Verbindung fehlgeschlagen: ${message}`}</p>
<script>
  if (window.opener) {
    window.opener.postMessage({ source: "sowespoke-gmail-connect", ok: ${success ? "true" : "false"} }, window.location.origin);
  }
  ${success ? "window.close();" : ""}
</script>
</body></html>`;
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
  headers.append("Set-Cookie", CLEAR_STATE_COOKIE);
  return new Response(html, { status: 200, headers });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const session = await verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
  if (!session) return popupResult(false, "Nicht angemeldet");

  if (url.searchParams.get("error")) return popupResult(false, "Zugriff abgelehnt");

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = getCookie(request, "gmail_oauth_state");
  if (!code || !state || !cookieState || state !== cookieState) {
    return popupResult(false, "Sicherheitsprüfung fehlgeschlagen — bitte erneut versuchen");
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GMAIL_SEND_TOKENS) {
    return popupResult(false, "Server nicht vollständig konfiguriert (GMAIL_SEND_TOKENS-Bindung fehlt?)");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/gmail/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return popupResult(false, "Google-Antwort ungültig");
  const tokenData = await tokenRes.json();
  if (!tokenData.refresh_token || !String(tokenData.scope || "").includes("gmail.send")) {
    return popupResult(false, "Kein Refresh-Token erhalten — bitte erneut versuchen");
  }

  await env.GMAIL_SEND_TOKENS.put(
    `gmail:${session.email}`,
    JSON.stringify({ refreshToken: tokenData.refresh_token, connectedAt: new Date().toISOString() })
  );

  return popupResult(true, "");
}
