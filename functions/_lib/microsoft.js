/**
 * Microsoft-Anmeldung (Entra ID, OpenID Connect) — gemeinsame Helfer für
 * functions/api/auth/microsoft/start.js und callback.js (2026-11-05, löst die
 * Google-Anmeldung ab). Erfordert die Secrets MICROSOFT_CLIENT_ID,
 * MICROSOFT_CLIENT_SECRET und MICROSOFT_TENANT_ID (Einrichtung siehe
 * CLOUDFLARE-ACCESS-SETUP.md).
 *
 * MICROSOFT_TENANT_ID muss die feste Verzeichnis-ID (GUID) des Sowespoke-
 * Tenants sein, nicht "common"/"organizations": nur dann ist garantiert, dass
 * die E-Mail im Token (preferred_username) zu einer im Tenant verifizierten
 * Domain gehört. Bei "common" könnte jedes fremde Verzeichnis eine beliebige
 * Adresse eintragen.
 */

import { b64url, b64urlDecode } from "./auth.js";

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const OAUTH_COOKIE = "oauth_ms";

/** Gibt eine Fehlermeldung zurück, wenn die Konfiguration unvollständig ist. */
export function configError(env, needSecret = false) {
  if (!env.MICROSOFT_CLIENT_ID) return "MICROSOFT_CLIENT_ID fehlt";
  if (!env.MICROSOFT_TENANT_ID || !GUID.test(env.MICROSOFT_TENANT_ID)) return "MICROSOFT_TENANT_ID fehlt oder ist keine Verzeichnis-ID (GUID)";
  if (needSecret && !env.MICROSOFT_CLIENT_SECRET) return "MICROSOFT_CLIENT_SECRET fehlt";
  if (!env.SESSION_SECRET) return "SESSION_SECRET fehlt";
  return null;
}

export function authorityBase(env) {
  return `https://login.microsoftonline.com/${env.MICROSOFT_TENANT_ID.toLowerCase()}`;
}

export function randomToken(bytes = 32) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

export async function pkceChallenge(verifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return b64url(digest);
}

/** state/nonce/PKCE-Verifier gemeinsam in einem kurzlebigen Cookie. */
export function encodeFlow(flow) {
  return b64url(new TextEncoder().encode(JSON.stringify(flow)));
}

export function decodeFlow(value) {
  try {
    return JSON.parse(new TextDecoder().decode(b64urlDecode(value)));
  } catch {
    return null;
  }
}

function decodePart(part) {
  return JSON.parse(new TextDecoder().decode(b64urlDecode(part)));
}

/**
 * Prüft das id_token vollständig: RS256-Signatur gegen Microsofts
 * veröffentlichte Schlüssel, Aussteller (eigener Tenant), Empfänger (unsere
 * App), Ablauf und Nonce. Gibt die Claims zurück oder wirft einen Fehler.
 */
export async function verifyIdToken(idToken, env, expectedNonce) {
  const parts = String(idToken || "").split(".");
  if (parts.length !== 3) throw new Error("id_token-Format");
  const [h, p, s] = parts;
  const header = decodePart(h);
  if (header.alg !== "RS256" || !header.kid) throw new Error("id_token-Algorithmus");

  const keysRes = await fetch(`${authorityBase(env)}/discovery/v2.0/keys`);
  if (!keysRes.ok) throw new Error("Schlüssel nicht abrufbar");
  const { keys = [] } = await keysRes.json();
  const jwk = keys.find((k) => k.kid === header.kid && k.kty === "RSA");
  if (!jwk) throw new Error("Schlüssel unbekannt");

  const key = await crypto.subtle.importKey(
    "jwk",
    { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlDecode(s),
    new TextEncoder().encode(`${h}.${p}`)
  );
  if (!valid) throw new Error("Signatur ungültig");

  const claims = decodePart(p);
  const tenant = env.MICROSOFT_TENANT_ID.toLowerCase();
  const now = Math.floor(Date.now() / 1000);
  if (claims.aud !== env.MICROSOFT_CLIENT_ID) throw new Error("aud");
  if (String(claims.tid || "").toLowerCase() !== tenant) throw new Error("tid");
  if (claims.iss !== `https://login.microsoftonline.com/${tenant}/v2.0`) throw new Error("iss");
  if (!claims.exp || claims.exp < now - 60) throw new Error("abgelaufen");
  if (claims.nbf && claims.nbf > now + 60) throw new Error("nbf");
  if (!expectedNonce || claims.nonce !== expectedNonce) throw new Error("nonce");
  return claims;
}
