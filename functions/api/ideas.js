/**
 * Cloudflare Pages Function — speichert Ideen fürs interne Ideenboard
 * (#/ideen) in Cloudflare KV, damit sie wirklich für das ganze Team sichtbar
 * sind, nicht nur im eigenen Browser (Nutzer-Entscheidung 2026-08-13: echtes
 * Backend statt Demo-Daten, damit "ist jetzt für das Team sichtbar" stimmt).
 * Erfordert eine KV-Namespace-Bindung namens IDEAS_BOARD im Cloudflare-
 * Dashboard (Pages-Projekt → Settings → Functions → KV namespace bindings),
 * gleiches Muster wie NEWS_RATINGS bei rate.js. Ohne Bindung antwortet die
 * Function mit einer klaren Fehlermeldung statt einem harten Absturz.
 */

import { verifySessionToken, getCookie, json } from "../_lib/auth.js";

function keyFor(id) {
  return `idea:${id}`;
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.IDEAS_BOARD) {
    return json({ error: "KV-Speicher nicht konfiguriert", items: [] }, 200);
  }
  const list = await env.IDEAS_BOARD.list({ prefix: "idea:" });
  const values = await Promise.all(list.keys.map((k) => env.IDEAS_BOARD.get(k.name, "json")));
  const items = values.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return json({ items });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.IDEAS_BOARD) {
    return json({ error: "KV-Speicher nicht konfiguriert" }, 500);
  }

  // Autor:in kommt aus der Session, nicht aus einem Freitextfeld — der
  // Login ist ohnehin auf @sowespoke.com/.de beschränkt, ein frei
  // eintippbarer Name könnte sich sonst als jemand anderes ausgeben
  // (Nutzer-Entscheidung: Login-Name als Standard, Anonym bewusst wählbar).
  const token = getCookie(request, "session");
  const session = await verifySessionToken(token, env.SESSION_SECRET);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }
  const title = String(body?.title || "").trim();
  const description = String(body?.description || "").trim();
  const benefit = String(body?.benefit || "").trim();
  const anonymous = body?.anonymous === true;
  if (!title || !description) {
    return json({ error: "Titel und Beschreibung sind erforderlich" }, 400);
  }
  if (title.length > 120 || description.length > 1000 || benefit.length > 500) {
    return json({ error: "Text zu lang" }, 400);
  }

  const id = crypto.randomUUID();
  const idea = {
    id,
    title,
    description,
    benefit,
    authorLabel: anonymous ? "Anonym" : session.email,
    createdAt: new Date().toISOString(),
  };
  await env.IDEAS_BOARD.put(keyFor(id), JSON.stringify(idea));

  return json({ ok: true, idea });
}
