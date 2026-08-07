/**
 * Gemeinsame Auth-Hilfsfunktionen für alle Pages Functions unter
 * functions/api/auth/* und functions/_middleware.js.
 * Dateien/Ordner mit führendem "_" werden von Cloudflare Pages nicht als
 * Route behandelt — dieses Modul ist also nicht öffentlich erreichbar.
 */

export const ALLOWED_DOMAINS = ["sowespoke.com", "sowespoke.de"];
const SESSION_DAYS = 14;
export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

export function isAllowedEmail(email) {
  const match = /^[^\s@]+@([^\s@]+)$/.exec(String(email || "").trim().toLowerCase());
  if (!match) return false;
  return ALLOWED_DOMAINS.includes(match[1]);
}

function b64url(bytes) {
  const str = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmac(message, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64url(sig);
}

export async function createSessionToken(email, secret) {
  const exp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const payloadB64 = b64url(new TextEncoder().encode(JSON.stringify({ email, exp })));
  const sig = await hmac(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(token, secret) {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = await hmac(payloadB64, secret);
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (!isAllowedEmail(payload.email)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookie(token) {
  return `session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

export function clearSessionCookie() {
  return "session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
}

export function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function json(data, status = 200, cookie) {
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  if (cookie) headers["Set-Cookie"] = cookie;
  return new Response(JSON.stringify(data), { status, headers });
}

/** Nur Pfade der eigenen Seite als Redirect-Ziel zulassen (kein Open Redirect). */
export function safeNextPath(next) {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/";
}
