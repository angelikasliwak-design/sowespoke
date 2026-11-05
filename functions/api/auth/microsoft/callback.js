/**
 * GET /api/auth/microsoft/callback — nimmt den Rücksprung der Microsoft-
 * Anmeldung entgegen, tauscht den Code (mit PKCE) gegen ein id_token, prüft es
 * vollständig (functions/_lib/microsoft.js) und setzt bei Erfolg die eigene
 * Session-Cookie. Nur Konten aus dem Sowespoke-Tenant mit @sowespoke.com/
 * @sowespoke.de-Adresse werden akzeptiert.
 */

import { isAllowedEmail, createSessionToken, sessionCookie, getCookie, safeNextPath } from "../../../_lib/auth.js";
import { configError, authorityBase, decodeFlow, verifyIdToken, OAUTH_COOKIE } from "../../../_lib/microsoft.js";

const CLEAR_FLOW_COOKIE = `${OAUTH_COOKIE}=; Path=/api/auth/microsoft; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

function toLogin(origin, error) {
  const target = new URL("/login", origin);
  if (error) target.searchParams.set("error", error);
  const headers = new Headers({ Location: target.toString() });
  headers.append("Set-Cookie", CLEAR_FLOW_COOKIE);
  return new Response(null, { status: 302, headers });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin;

  if (url.searchParams.get("error")) return toLogin(origin, "microsoft");

  const problem = configError(env, true);
  if (problem) return new Response(`Microsoft-Login nicht konfiguriert (${problem})`, { status: 500 });

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const flow = decodeFlow(getCookie(request, OAUTH_COOKIE) || "");
  if (!code || !state || !flow || flow.state !== state) return toLogin(origin, "state");
  const next = safeNextPath(flow.next);

  const tokenRes = await fetch(`${authorityBase(env)}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.MICROSOFT_CLIENT_ID,
      client_secret: env.MICROSOFT_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/auth/microsoft/callback`,
      grant_type: "authorization_code",
      code_verifier: flow.verifier,
      scope: "openid email profile",
    }),
  });
  if (!tokenRes.ok) return toLogin(origin, "oauth");
  const tokenData = await tokenRes.json();

  let claims;
  try {
    claims = await verifyIdToken(tokenData.id_token, env, flow.nonce);
  } catch {
    return toLogin(origin, "oauth");
  }

  // Entra liefert die Adresse je nach Konto in "email" oder nur als
  // Anmeldename (preferred_username, i. d. R. die Firmen-Adresse). Beide sind
  // durch die feste Tenant-Prüfung auf verifizierte Domains des Tenants begrenzt.
  const email = String(claims.email || claims.preferred_username || "").trim().toLowerCase();
  if (!isAllowedEmail(email)) return toLogin(origin, "domain");

  // Login-Log wie zuvor bei der Google-Anmeldung: ein Eintrag pro Person
  // (siehe functions/api/admin/login-log.js); ohne LOGIN_LOG-Bindung läuft
  // der Login normal weiter, nur ohne Protokoll.
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
        lastActiveAt: existing?.lastActiveAt,
      })
    );
  }

  const token = await createSessionToken(email, env.SESSION_SECRET);
  const headers = new Headers({ Location: new URL(next, origin).toString() });
  headers.append("Set-Cookie", sessionCookie(token));
  headers.append("Set-Cookie", CLEAR_FLOW_COOKIE);
  return new Response(null, { status: 302, headers });
}
