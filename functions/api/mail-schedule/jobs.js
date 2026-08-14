/**
 * GET/POST /api/mail-schedule/jobs — Terminierte Serienmails (Phase C,
 * 2026-08-14). Speichert fertig gerenderte Betreff/Text-Paare pro
 * Empfänger:in — KEINE erneute Platzhalter-Auflösung zur Laufzeit, der
 * Text steht zum Zeitpunkt der Terminierung bereits final fest (gleiche
 * Grundhaltung wie bei /api/gmail/send: der Client komponiert, der Server
 * validiert/speichert/versendet nur noch).
 *
 * KV-Schema: ein Job = ein Key `job:<email>:<uuid>` im Namespace
 * MAIL_SCHEDULE_JOBS — der Präfix `job:<email>:` macht Auflisten und
 * Löschen automatisch auf die eigene Person beschränkt (siehe jobs/[id].js),
 * `job:` ohne E-Mail-Anteil erlaubt dem Cron-Endpunkt (run.js) trotzdem,
 * ALLE fälligen Jobs über alle Personen hinweg zu finden.
 */

import { verifySessionToken, getCookie, json } from "../../_lib/auth.js";
import { EMAIL_RE } from "../../_lib/gmail.js";

const MAX_JOBS_PER_USER = 200;

function prefixFor(email) {
  return `job:${email}:`;
}

async function requireSession(context) {
  const { env, request } = context;
  return verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
}

export async function onRequestGet(context) {
  const { env } = context;
  const session = await requireSession(context);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (!env.MAIL_SCHEDULE_JOBS) return json({ items: [] });

  const list = await env.MAIL_SCHEDULE_JOBS.list({ prefix: prefixFor(session.email) });
  const values = await Promise.all(list.keys.map((k) => env.MAIL_SCHEDULE_JOBS.get(k.name, "json")));
  const items = values.filter(Boolean).sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt));
  return json({ items });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  const session = await requireSession(context);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (!env.MAIL_SCHEDULE_JOBS) return json({ error: "KV-Speicher nicht konfiguriert" }, 500);
  if (!env.GMAIL_SEND_TOKENS) return json({ error: "Gmail-Versand nicht konfiguriert" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (!rawItems.length) return json({ error: "Keine Empfänger:innen übergeben" }, 400);

  // Nur terminieren, wenn überhaupt eine eigene Gmail-Verbindung besteht —
  // sonst würde der Job beim Fälligwerden zwangsläufig fehlschlagen, ohne
  // dass jemand rechtzeitig davon erfährt.
  const gmailStored = await env.GMAIL_SEND_TOKENS.get(`gmail:${session.email}`, "json");
  if (!gmailStored || !gmailStored.refreshToken) {
    return json({ error: "not_connected" }, 409);
  }

  const existingList = await env.MAIL_SCHEDULE_JOBS.list({ prefix: prefixFor(session.email) });
  const existingCount = existingList.keys.length;
  if (existingCount >= MAX_JOBS_PER_USER) {
    return json({ error: "Zu viele geplante Mails — erst einige stornieren" }, 400);
  }

  const now = Date.now();
  const created = [];
  const errors = [];
  for (const raw of rawItems.slice(0, MAX_JOBS_PER_USER - existingCount)) {
    const to = String(raw?.to || "").trim();
    const subject = String(raw?.subject || "").trim();
    const text = String(raw?.body || "");
    const label = String(raw?.label || "").trim().slice(0, 120);
    const sendAtMs = Date.parse(raw?.sendAt);

    if (!EMAIL_RE.test(to)) { errors.push(`Ungültige Adresse: ${to || "(leer)"}`); continue; }
    if (!subject || !text) { errors.push(`Leerer Betreff/Text für ${to}`); continue; }
    if (/\{[^}]+\}/.test(subject) || /\{[^}]+\}/.test(text)) { errors.push(`Noch nicht ausgefüllte Platzhalter für ${to}`); continue; }
    if (!Number.isFinite(sendAtMs) || sendAtMs <= now) { errors.push(`Ungültiger oder vergangener Zeitpunkt für ${to}`); continue; }

    const id = crypto.randomUUID();
    const job = {
      id,
      ownerEmail: session.email,
      to,
      subject,
      body: text,
      label,
      sendAt: new Date(sendAtMs).toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      sentAt: null,
      error: null,
    };
    await env.MAIL_SCHEDULE_JOBS.put(`job:${session.email}:${id}`, JSON.stringify(job));
    created.push(job);
  }

  if (!created.length) return json({ error: errors[0] || "Keine gültigen Empfänger:innen" }, 400);
  return json({ ok: true, items: created, errors });
}
