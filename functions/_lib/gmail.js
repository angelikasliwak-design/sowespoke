/**
 * Gemeinsame Gmail-API-Hilfsfunktionen (2026-08-14, Phase C) — aus
 * functions/api/gmail/send.js herausgezogen, weil der neue Terminierungs-
 * Endpunkt (functions/api/mail-schedule/run.js) exakt denselben
 * Versand-Mechanismus braucht (Access-Token aus Refresh-Token erneuern,
 * rohe MIME-Nachricht bauen, ein Gmail-API-Aufruf pro Empfänger:in).
 * Dateien/Ordner mit führendem "_" werden von Cloudflare Pages nicht als
 * Route behandelt — dieses Modul ist nicht öffentlich erreichbar.
 */

export const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

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

export async function refreshAccessToken(refreshToken, env) {
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

/**
 * Versendet GENAU eine E-Mail. Aufrufer:in ist verantwortlich für die
 * Validierung von to/subject/body (siehe gmail/send.js) — diese Funktion
 * baut nur noch die rohe Nachricht und ruft die Gmail-API auf.
 */
export async function sendGmailMessage({ accessToken, to, subject, text }) {
  const rawLines = [
    `To: ${to}`,
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
    return { ok: false, error: detail || `Gmail-API-Fehler (${sendRes.status})` };
  }
  const result = await sendRes.json();
  return { ok: true, id: result.id };
}
