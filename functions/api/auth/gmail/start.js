/**
 * GET /api/auth/gmail/start — separater, erst bei Bedarf ausgelöster
 * Zustimmungs-Flow für den gmail.send-Scope (Phase B, 2026-08-14). Bewusst
 * NICHT Teil des normalen Logins (functions/api/auth/google/*) — der
 * erweiterte Versand-Scope wird nur angefragt, wenn jemand im Mail-
 * Generator aktiv auf "Mit Gmail verbinden" klickt, nicht bei jedem Login.
 *
 * Läuft als Popup statt als Redirect (siehe app.js, wireMailGen): die App
 * ist eine Hash-Router-SPA, ein voller Redirect zurück würde den aktuellen
 * Hash-Pfad verlieren, da der Browser das Fragment bei einer neuen
 * Navigation nicht an den Server sendet und die Middleware/next-Logik
 * (siehe functions/api/auth/google/start.js) hier ins Leere liefe.
 */

import { verifySessionToken, getCookie } from "../../../_lib/auth.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.GOOGLE_CLIENT_ID) {
    return new Response("Gmail-Verbindung nicht konfiguriert (GOOGLE_CLIENT_ID fehlt)", { status: 500 });
  }

  const session = await verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
  if (!session) {
    return new Response("Nicht angemeldet", { status: 401 });
  }

  const url = new URL(request.url);
  const state = crypto.randomUUID().replace(/-/g, "");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", `${url.origin}/api/auth/gmail/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/gmail.send");
  // access_type=offline + prompt=consent: erzwingt bei JEDER Verbindung ein
  // refresh_token (ohne prompt=consent liefert Google das nur beim allerersten
  // Mal) — nötig, weil wir künftig ohne erneuten Nutzer-Klick versenden wollen.
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("login_hint", session.email);
  authUrl.searchParams.set("state", state);

  const headers = new Headers({ Location: authUrl.toString() });
  headers.append(
    "Set-Cookie",
    `gmail_oauth_state=${encodeURIComponent(state)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  return new Response(null, { status: 302, headers });
}
