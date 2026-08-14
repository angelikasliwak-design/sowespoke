/**
 * DELETE /api/mail-schedule/jobs/:id — storniert/löscht eine terminierte
 * Serienmail. Der Schlüssel wird aus der Session-E-Mail UND der id gebaut
 * (`job:<email>:<id>`) — dadurch ist die Berechtigung schon durch die
 * Schlüsselkonstruktion erzwungen, niemand kann fremde Jobs löschen, ganz
 * ohne zusätzlichen Ownership-Vergleich (gleiches Prinzip wie recipients.js).
 */

import { verifySessionToken, getCookie, json } from "../../../_lib/auth.js";

export async function onRequestDelete(context) {
  const { env, request, params } = context;
  if (!env.MAIL_SCHEDULE_JOBS) return json({ error: "KV-Speicher nicht konfiguriert" }, 500);

  const session = await verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);

  const id = params.id;
  if (!id) return json({ error: "Kein Job angegeben" }, 400);

  await env.MAIL_SCHEDULE_JOBS.delete(`job:${session.email}:${id}`);
  return json({ ok: true });
}
