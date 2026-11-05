/**
 * GET /api/auth/microsoft/start — leitet zur Microsoft-Anmeldung (Entra ID)
 * um. state (mit Rücksprungziel), nonce und PKCE-Verifier landen in einem
 * kurzlebigen HttpOnly-Cookie und werden im Callback geprüft.
 */

import { safeNextPath } from "../../../_lib/auth.js";
import { configError, authorityBase, randomToken, pkceChallenge, encodeFlow, OAUTH_COOKIE } from "../../../_lib/microsoft.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const problem = configError(env);
  if (problem) return new Response(`Microsoft-Login nicht konfiguriert (${problem})`, { status: 500 });

  const url = new URL(request.url);
  const next = safeNextPath(url.searchParams.get("next"));
  const state = randomToken(16);
  const nonce = randomToken(16);
  const verifier = randomToken(32);

  const authUrl = new URL(`${authorityBase(env)}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set("client_id", env.MICROSOFT_CLIENT_ID);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("redirect_uri", `${url.origin}/api/auth/microsoft/callback`);
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("nonce", nonce);
  authUrl.searchParams.set("code_challenge", await pkceChallenge(verifier));
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("prompt", "select_account");

  const headers = new Headers({ Location: authUrl.toString() });
  headers.append(
    "Set-Cookie",
    `${OAUTH_COOKIE}=${encodeFlow({ state, nonce, verifier, next })}; Path=/api/auth/microsoft; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  return new Response(null, { status: 302, headers });
}
