/**
 * POST /api/gmail/send — versendet GENAU eine E-Mail über die Gmail-API im
 * Namen der eingeloggten Person (Phase B, 2026-08-14). Bewusst ein Aufruf
 * pro Empfänger:in (kein Batch-/BCC-Endpunkt) — das ist der ganze
 * Mechanismus dahinter, dass bei "Mehrere Personen, einzeln personalisiert"
 * niemand sieht, dass an mehrere Adressen verschickt wurde: der Client
 * (app.js, sendAllRows) ruft diesen Endpunkt einmal pro Zeile auf, jedes
 * Mal mit genau einer Adresse im To-Header.
 *
 * Erfordert die KV-Bindung GMAIL_SEND_TOKENS (siehe functions/api/auth/
 * gmail/callback.js) sowie GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET (dieselben
 * wie beim Login).
 */

import { verifySessionToken, getCookie, json } from "../../_lib/auth.js";

const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64UrlEncode(bytes) {
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// RFC 2047: kodiert den Betreff als =?UTF-8?B?...?=, damit Umlaute (ä/ü/ö)
// nicht roh im Header stehen — als Nebeneffekt macht das Header-Injection
// über den Betreff unmöglich, ein eingeschleustes \r\n landet als Base64-
// Bytes in der kodierten Wortfolge, nie als echtes Zeilenende im Header.
function mimeEncodeHeader(str) {
  return `=?UTF-8?B?${bytesToBase64(new TextEncoder().encode(str))}?=`;
}

async function refreshAccessToken(refreshToken, env) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const session = await verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (!env.GMAIL_SEND_TOKENS || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return json({ error: "Gmail-Versand nicht konfiguriert" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }

  const to = String(body?.to || "").trim();
  const subject = String(body?.subject || "").trim();
  const text = String(body?.body || "");

  // Jede Adresse einzeln gegen ein striktes Muster prüfen, inkl. Kontroll-
  // zeichen-Verbot — der To-Header wird unten unverändert (nicht MIME-
  // kodiert) in die rohe Nachricht eingesetzt, ohne diese Prüfung wäre das
  // eine Header-Injection-Lücke (zusätzliche Bcc:/Cc:-Zeilen einschleusen).
  const addrs = to.split(",").map((a) => a.trim()).filter(Boolean);
  if (!addrs.length || !addrs.every((a) => EMAIL_RE.test(a) && !/[\r\n]/.test(a))) {
    return json({ error: "Ungültige Empfänger-Adresse" }, 400);
  }
  if (!subject) return json({ error: "Leerer Betreff" }, 400);
  if (!text) return json({ error: "Leerer Nachrichtentext" }, 400);
  if (/\{[^}]+\}/.test(subject) || /\{[^}]+\}/.test(text)) {
    return json({ error: "Noch nicht ausgefüllte Platzhalter im Text" }, 400);
  }

  const stored = await env.GMAIL_SEND_TOKENS.get(`gmail:${session.email}`, "json");
  if (!stored || !stored.refreshToken) {
    return json({ error: "not_connected" }, 409);
  }

  const accessToken = await refreshAccessToken(stored.refreshToken, env);
  if (!accessToken) {
    return json({ error: "Gmail-Verbindung ungültig oder widerrufen — bitte neu verbinden" }, 409);
  }

  const rawLines = [
    `To: ${addrs.join(", ")}`,
    `Subject: ${mimeEncodeHeader(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    bytesToBase64(new TextEncoder().encode(text)),
  ];
  const raw = base64UrlEncode(new TextEncoder().encode(rawLines.join("\r\n")));

  const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!sendRes.ok) {
    let detail = "";
    try {
      detail = (await sendRes.json())?.error?.message || "";
    } catch {
      /* keine JSON-Fehlerantwort, detail bleibt leer */
    }
    return json({ error: "Versand fehlgeschlagen", detail }, 502);
  }
  const result = await sendRes.json();
  return json({ ok: true, id: result.id });
}
