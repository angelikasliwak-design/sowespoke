/**
 * GET /api/auth/me — liefert die E-Mail der eingeloggten Session, für den
 * kleinen Profil-Bereich unten in der Sidebar. Kein Name/Foto/Rolle
 * verfügbar (Google liefert nur die verifizierte E-Mail), daher zeigt die
 * UI nur die E-Mail plus einen generischen Platzhalter.
 * `isAdmin` (2026-08-13) kommt aus derselben festen Liste wie beim
 * Ideenboard-Löschen (`functions/_lib/auth.js`) — einzige Stelle, die
 * Rollen kennt, damit das Frontend den Löschen-Button gezielt nur für
 * echte Admins zeigen kann statt ihn allen zu zeigen und dann serverseitig
 * abzulehnen.
 */

import { verifySessionToken, getCookie, json, isAdminEmail } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const token = getCookie(request, "session");
  const session = await verifySessionToken(token, env.SESSION_SECRET);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  return json({ email: session.email, isAdmin: isAdminEmail(session.email) });
}
