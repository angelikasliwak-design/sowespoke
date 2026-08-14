/**
 * POST /api/mail-schedule/run — verschickt fällige terminierte Serienmails
 * (Phase C, 2026-08-14). Wird NICHT von eingeloggten Personen aufgerufen,
 * sondern von einem geplanten GitHub-Actions-Workflow
 * (.github/workflows/mail-schedule-run.yml, alle 15 Minuten). Cloudflare
 * Pages Cron Triggers gibt es nur für klassische Workers, nicht für
 * Git-integrierte Pages-Projekte wie dieses (siehe DESIGN.md/Plan-Notiz
 * vom 2026-08-14) — deshalb dieser Umweg über einen extern getriggerten,
 * secret-geschützten Endpunkt statt einer echten Cron-Bindung.
 *
 * Öffentlich erreichbar (siehe functions/_middleware.js, exakter Pfad in
 * der Allowlist), aber durch einen Bearer-Token-Header geschützt statt
 * durch eine Login-Session, da der Aufrufer keine eingeloggte Person ist.
 * Erfordert das Secret MAIL_SCHEDULE_SECRET (Cloudflare Pages UND als
 * GitHub-Actions-Repository-Secret, identischer Wert).
 */

import { json } from "../../_lib/auth.js";
import { refreshAccessToken, sendGmailMessage } from "../../_lib/gmail.js";

// Bounded pro Aufruf statt alle fälligen Jobs auf einmal — Cloudflare Pages
// Functions haben ein CPU-Zeit-Limit, bei sehr vielen fälligen Jobs würde
// ein unbegrenzter Lauf sonst mitten in der Bearbeitung abbrechen. Der
// nächste Cron-Lauf (spätestens 15 Min. später) holt den Rest nach.
const MAX_PER_RUN = 25;

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.MAIL_SCHEDULE_SECRET) {
    return json({ error: "MAIL_SCHEDULE_SECRET nicht konfiguriert" }, 500);
  }
  const auth = request.headers.get("Authorization") || "";
  const provided = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!provided || !timingSafeEqual(provided, env.MAIL_SCHEDULE_SECRET)) {
    return json({ error: "Nicht autorisiert" }, 401);
  }
  if (!env.MAIL_SCHEDULE_JOBS || !env.GMAIL_SEND_TOKENS || !env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return json({ error: "Nicht vollständig konfiguriert" }, 500);
  }

  const now = Date.now();
  const due = [];
  let cursor;
  // .list() paginiert (max. 1000 Keys pro Aufruf) — bei diesem erwarteten
  // Volumen (eine Handvoll Kampagnen gleichzeitig) reicht in der Praxis
  // fast immer eine Seite, die Cursor-Schleife ist trotzdem korrekt für
  // den Fall, dass mal deutlich mehr Jobs offen sind.
  do {
    const list = await env.MAIL_SCHEDULE_JOBS.list({ prefix: "job:", cursor });
    for (const key of list.keys) {
      if (due.length >= MAX_PER_RUN * 4) break; // grobe Obergrenze fürs Sammeln, bevor überhaupt gefiltert wird
      const job = await env.MAIL_SCHEDULE_JOBS.get(key.name, "json");
      if (job && job.status === "pending" && Date.parse(job.sendAt) <= now) {
        due.push({ key: key.name, job });
      }
    }
    cursor = list.list_complete ? undefined : list.cursor;
  } while (cursor && due.length < MAX_PER_RUN * 4);

  due.sort((a, b) => new Date(a.job.sendAt) - new Date(b.job.sendAt));
  const batch = due.slice(0, MAX_PER_RUN);

  const tokenCache = new Map(); // ownerEmail -> accessToken|null, spart Refresh-Aufrufe innerhalb desselben Laufs
  let sent = 0;
  let failed = 0;

  for (const { key, job } of batch) {
    let accessToken = tokenCache.get(job.ownerEmail);
    if (accessToken === undefined) {
      const stored = await env.GMAIL_SEND_TOKENS.get(`gmail:${job.ownerEmail}`, "json");
      accessToken = stored?.refreshToken ? await refreshAccessToken(stored.refreshToken, env) : null;
      tokenCache.set(job.ownerEmail, accessToken);
    }

    let update;
    if (!accessToken) {
      update = { ...job, status: "failed", error: "Gmail-Verbindung fehlt oder ist abgelaufen" };
      failed++;
    } else {
      const result = await sendGmailMessage({ accessToken, to: job.to, subject: job.subject, text: job.body });
      if (result.ok) {
        update = { ...job, status: "sent", sentAt: new Date().toISOString(), error: null };
        sent++;
      } else {
        update = { ...job, status: "failed", error: result.error || "Versand fehlgeschlagen" };
        failed++;
      }
    }
    await env.MAIL_SCHEDULE_JOBS.put(key, JSON.stringify(update));
  }

  return json({ processed: batch.length, sent, failed, remaining: due.length - batch.length });
}
