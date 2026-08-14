/**
 * Cloudflare Pages Middleware — läuft vor jedem Request an die Seite
 * (Seiten UND /api/*) und ersetzt die frühere Cloudflare-Access-Sperre.
 * Ohne gültige Session wird auf /login umgeleitet (bzw. bei /api/* mit
 * 401 geantwortet). Login läuft über Google OAuth (functions/api/auth/google/*),
 * erfordert die Secrets GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET und SESSION_SECRET.
 */

import { verifySessionToken, getCookie } from "./_lib/auth.js";

const PUBLIC_EXACT_PATHS = new Set([
  // Cloudflare Pages leitet /login.html -> /login um (Clean-URL-Standard-
  // verhalten) — beide Formen müssen öffentlich sein, sonst entsteht eine
  // Redirect-Schleife zwischen dieser Middleware und Pages' eigenem Redirect.
  "/login",
  "/login.html",
  "/auth.js",
  "/auth.css",
]);

function isPublicPath(pathname) {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/assets/fonts/")) return true;
  if (pathname.startsWith("/assets/brand/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  // Cron-getriggerter Versand fälliger Serienmails (Phase C, 2026-08-14) —
  // hat keine Login-Session (Aufrufer ist ein GitHub-Actions-Workflow,
  // nicht eine eingeloggte Person), schützt sich stattdessen selbst über
  // einen Bearer-Token-Header (siehe functions/api/mail-schedule/run.js).
  // Bewusst ein exakter Pfad, kein Präfix — /api/mail-schedule/jobs* bleibt
  // ganz normal session-gated.
  if (pathname === "/api/mail-schedule/run") return true;
  return false;
}

// "Zuletzt aktiv"-Tracking (2026-08-14, Nutzer-Wunsch: echte Nutzung sehen,
// nicht nur Login-Zeitpunkte). Aktualisiert denselben LOGIN_LOG-Eintrag wie
// functions/api/auth/google/callback.js, aber höchstens einmal pro Person
// und Tag — ein Cookie merkt sich, ob heute schon aktualisiert wurde, damit
// nicht jeder einzelne Seiten-/Asset-/API-Aufruf einen KV-Zugriff auslöst.
// Läuft über context.waitUntil() NACH dem Zurückgeben der Antwort, damit
// kein einzelner Request durch den KV-Zugriff langsamer wird.
const LAST_ACTIVE_COOKIE = "last_active_touch";

async function touchLastActive(email, env) {
  const key = `user:${email}`;
  const existing = await env.LOGIN_LOG.get(key, "json");
  const now = new Date().toISOString();
  await env.LOGIN_LOG.put(
    key,
    JSON.stringify({
      email,
      firstLoginAt: existing?.firstLoginAt || now,
      lastLoginAt: existing?.lastLoginAt || now,
      loginCount: existing?.loginCount || 1,
      lastActiveAt: now,
    })
  );
}

export async function onRequest(context) {
  const { request, env, next, waitUntil } = context;
  const url = new URL(request.url);

  if (isPublicPath(url.pathname)) return next();

  const token = getCookie(request, "session");
  const session = await verifySessionToken(token, env.SESSION_SECRET);

  if (!session) {
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Nicht angemeldet" }), {
        status: 401,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    const redirectUrl = new URL("/login", url.origin);
    redirectUrl.searchParams.set("next", url.pathname + url.search);
    return Response.redirect(redirectUrl.toString(), 302);
  }

  const response = await next();

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const alreadyTouchedToday = getCookie(request, LAST_ACTIVE_COOKIE) === today;
  if (!alreadyTouchedToday && env.LOGIN_LOG) {
    waitUntil(touchLastActive(session.email, env));
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `${LAST_ACTIVE_COOKIE}=${today}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${2 * 24 * 60 * 60}`
    );
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  return response;
}
