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

export async function onRequest(context) {
  const { request, env, next } = context;
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

  return next();
}
