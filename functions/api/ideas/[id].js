/**
 * DELETE /api/ideas/:id — löscht eine Idee aus dem Ideenboard-KV-Speicher
 * (IDEAS_BOARD, siehe functions/api/ideas.js für GET/POST). Eigene Datei
 * unter ideas/[id].js (Cloudflare-Pages-Konvention für dynamische Routen),
 * damit /api/ideas selbst (Liste/Neuanlage) unangetastet bleibt.
 * Nur für Admins (2026-08-13, Nutzer-Wunsch) — feste Liste in
 * functions/_lib/auth.js, kein allgemeines Rollensystem.
 */

import { verifySessionToken, getCookie, json, isAdminEmail } from "../../_lib/auth.js";

export async function onRequestDelete(context) {
  const { env, request, params } = context;
  if (!env.IDEAS_BOARD) {
    return json({ error: "KV-Speicher nicht konfiguriert" }, 500);
  }

  const token = getCookie(request, "session");
  const session = await verifySessionToken(token, env.SESSION_SECRET);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (!isAdminEmail(session.email)) return json({ error: "Keine Berechtigung" }, 403);

  const id = params.id;
  if (!id) return json({ error: "Keine Idee angegeben" }, 400);

  await env.IDEAS_BOARD.delete(`idea:${id}`);
  return json({ ok: true });
}
