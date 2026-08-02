/**
 * Cloudflare Pages Function — speichert Daumen-hoch/-runter-Bewertungen zu
 * News-Artikeln in Cloudflare KV (kostenlos, kein LLM-API-Key nötig).
 * Erfordert eine KV-Namespace-Bindung namens NEWS_RATINGS im Cloudflare-
 * Dashboard (Pages-Projekt → Settings → Functions → KV namespace bindings).
 * Ohne Bindung antwortet die Function mit einer klaren Fehlermeldung statt
 * einem harten Absturz.
 */

function keyFor(link) {
  return `rating:${link}`;
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.NEWS_RATINGS) {
    return new Response(JSON.stringify({ error: "KV-Speicher nicht konfiguriert" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültiger Request-Body" }), { status: 400 });
  }
  const { link, title, rating } = body || {};
  if (!link || (rating !== "up" && rating !== "down")) {
    return new Response(JSON.stringify({ error: "link und rating (up/down) erforderlich" }), { status: 400 });
  }

  const key = keyFor(link);
  const existing = (await env.NEWS_RATINGS.get(key, "json")) || { link, title: "", up: 0, down: 0 };
  existing[rating] += 1;
  if (title) existing.title = title;
  existing.updatedAt = new Date().toISOString();
  await env.NEWS_RATINGS.put(key, JSON.stringify(existing));

  return new Response(JSON.stringify({ ok: true, up: existing.up, down: existing.down }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.NEWS_RATINGS) {
    return new Response(JSON.stringify({ error: "KV-Speicher nicht konfiguriert", items: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  const list = await env.NEWS_RATINGS.list({ prefix: "rating:" });
  const values = await Promise.all(list.keys.map((k) => env.NEWS_RATINGS.get(k.name, "json")));
  const items = values.filter(Boolean).sort((a, b) => (b.down - b.up) - (a.down - a.up));
  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
