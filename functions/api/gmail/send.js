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
 * wie beim Login). Der eigentliche Versand-Mechanismus (Token-Refresh, rohe
 * MIME-Nachricht) liegt in functions/_lib/gmail.js — geteilt mit dem
 * Terminierungs-Endpunkt (Phase C, functions/api/mail-schedule/run.js).
 */

import { verifySessionToken, getCookie, json } from "../../_lib/auth.js";
import { EMAIL_RE, refreshAccessToken, sendGmailMessage } from "../../_lib/gmail.js";

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

  const result = await sendGmailMessage({ accessToken, to: addrs.join(", "), subject, text });
  if (!result.ok) return json({ error: "Versand fehlgeschlagen", detail: result.error }, 502);
  return json({ ok: true, id: result.id });
}
