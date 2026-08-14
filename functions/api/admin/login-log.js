/**
 * GET /api/admin/login-log — Übersicht, wer sich einloggt und wie oft
 * (2026-08-14, Nutzer-Wunsch: Sichtbarkeit über die Nutzung). Nur für
 * Admins (gleiche feste Liste wie beim Ideenboard-Löschen, functions/
 * _lib/auth.js) — bewusst kein allgemeines Rollensystem, nur dieser eine
 * Anwendungsfall. Die Einträge selbst werden in functions/api/auth/google/
 * callback.js geschrieben (ein Eintrag pro Person, aktualisiert bei jedem
 * Login), diese Datei liest sie nur.
 */

import { verifySessionToken, getCookie, json, isAdminEmail } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const { env, request } = context;
  const session = await verifySessionToken(getCookie(request, "session"), env.SESSION_SECRET);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);
  if (!isAdminEmail(session.email)) return json({ error: "Keine Berechtigung" }, 403);
  if (!env.LOGIN_LOG) return json({ error: "KV-Speicher nicht konfiguriert", items: [] }, 200);

  const list = await env.LOGIN_LOG.list({ prefix: "user:" });
  const values = await Promise.all(list.keys.map((k) => env.LOGIN_LOG.get(k.name, "json")));
  // lastActiveAt (functions/_middleware.js) ist neuer als lastLoginAt und
  // aussagekräftiger — vor der Einführung dieses Felds bzw. direkt nach
  // einem frischen Login (bevor die Middleware das erste Mal "berührt" hat)
  // fällt der Sortier-/Anzeigewert auf lastLoginAt zurück.
  const items = values
    .filter(Boolean)
    .sort((a, b) => new Date(b.lastActiveAt || b.lastLoginAt) - new Date(a.lastActiveAt || a.lastLoginAt));
  return json({ items });
}
