/**
 * GET /api/auth/google/start — leitet zu Googles OAuth-Consent-Screen um.
 * Erfordert die Secrets GOOGLE_CLIENT_ID und GOOGLE_CLIENT_SECRET (siehe
 * CLOUDFLARE-ACCESS-SETUP.md für die Einrichtung in der Google Cloud Console).
 */

import { safeNextPath } from "../../../_lib/auth.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.GOOGLE_CLIENT_ID) {
    return new Response("Google-Login nicht konfiguriert (GOOGLE_CLIENT_ID fehlt)", { status: 500 });
  }

  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"));
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const state = `${nonce}:${encodeURIComponent(next)}`;

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("redirect_uri", `${url.origin}/api/auth/google/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const headers = new Headers({ Location: authUrl.toString() });
  headers.append(
    "Set-Cookie",
    `oauth_state=${encodeURIComponent(state)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  return new Response(null, { status: 302, headers });
}
