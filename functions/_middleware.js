/**
 * Cloudflare Pages Middleware — läuft vor jedem Request an die Seite
 * (Seiten UND /api/*) und ersetzt die frühere Cloudflare-Access-Sperre.
 * Ohne gültige Session wird auf /login.html umgeleitet (bzw. bei /api/*
 * mit 401 geantwortet). Erfordert die Bindings DB (D1) und SESSION_SECRET
 * (Secret) im Cloudflare-Pages-Projekt.
 */

import { verifySessionToken } from "./_lib/auth.js";

const PUBLIC_EXACT_PATHS = new Set([
  // Cloudflare Pages leitet /login.html -> /login um (Clean-URL-Standard-
  // verhalten) — beide Formen müssen öffentlich sein, sonst entsteht eine
  // Redirect-Schleife zwischen dieser Middleware und Pages' eigenem Redirect.
  "/login",
  "/login.html",
  "/register",
  "/register.html",
  "/auth.js",
  "/auth.css",
]);

function isPublicPath(pathname) {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/assets/fonts/")) return true;
  if (pathname.startsWith("/assets/brand/")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  return false;
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
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
