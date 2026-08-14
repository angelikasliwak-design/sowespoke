/**
 * Cloudflare Pages Function — speichert die persönliche Empfänger-Liste im
 * Mail-Generator serverseitig in Cloudflare KV, gebunden an die Login-
 * E-Mail (Nutzer-Wunsch 2026-08-14: "einmal hochladen, bleibt für immer,
 * pro Person einzeln" statt nur im Browser). Erfordert eine KV-Namespace-
 * Bindung namens RECIPIENT_LISTS im Cloudflare-Dashboard (Pages-Projekt →
 * Settings → Functions → KV namespace bindings), gleiches Muster wie
 * IDEAS_BOARD bei ideas.js. Ohne Bindung antwortet die Function mit einer
 * klaren Fehlermeldung statt einem harten Absturz.
 */

import { verifySessionToken, getCookie, json } from "../_lib/auth.js";

function keyFor(email) {
  return `recipients:${email}`;
}

async function requireSession(context) {
  const { env, request } = context;
  const token = getCookie(request, "session");
  return verifySessionToken(token, env.SESSION_SECRET);
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.RECIPIENT_LISTS) {
    return json({ error: "KV-Speicher nicht konfiguriert", items: [] }, 200);
  }
  const session = await requireSession(context);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);

  const items = (await env.RECIPIENT_LISTS.get(keyFor(session.email), "json")) || [];
  return json({ items });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.RECIPIENT_LISTS) {
    return json({ error: "KV-Speicher nicht konfiguriert" }, 500);
  }
  const session = await requireSession(context);
  if (!session) return json({ error: "Nicht angemeldet" }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body" }, 400);
  }
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  // Serverseitig nochmal validieren/kürzen statt dem Client blind zu
  // vertrauen — gleiche Grundhaltung wie bei ideas.js (Längenbegrenzung).
  const items = rawItems
    .map((r) => ({
      name: String(r?.name || "").trim().slice(0, 120),
      email: String(r?.email || "").trim().slice(0, 200),
    }))
    .filter((r) => r.name || r.email)
    .slice(0, 200);

  await env.RECIPIENT_LISTS.put(keyFor(session.email), JSON.stringify(items));
  return json({ ok: true, items });
}
