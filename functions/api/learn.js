/**
 * Cloudflare Pages Function — holt serverseitig Titel + offizielle Kurzbeschreibung
 * (Meta-Description) von kuratierten Microsoft-Learn-/Advertising-Help-Seiten.
 *
 * Bewusst KEINE Volltext-Extraktion: Learn-Seiten haben komplexe HTML-Struktur
 * (Navigation, Sidebars, Codebeispiele) — automatisches Herausschneiden würde
 * leicht falschen/verstümmelten Text liefern, was gegen die Regel "nur echte
 * Inhalte aus der Quelle" verstößt. Stattdessen: Titel + die von Microsoft
 * selbst verfasste Meta-Description, plus Link zur Originalseite für Details.
 *
 * SOURCES ist bewusst leer, bis Angelika konkrete Learn-URLs nennt — Claude
 * darf laut Vorgabe keine URLs raten/erfinden.
 */

const SOURCES = [
  // { title: "Kurzlabel für die Karte", url: "https://learn.microsoft.com/..." },
];

function extractMeta(html, name) {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decodeHtml(m[1]).trim();
  }
  return "";
}

function decodeHtml(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeHtml(m[1]).replace(/\s+/g, " ").trim() : "";
}

async function fetchSource(source) {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "SowespokeWissenszentrum/1.0 (+internes Tool)" },
      cf: { cacheTtl: 21600, cacheEverything: true },
    });
    if (!res.ok) return { error: true, title: source.title, url: source.url, status: res.status };
    const html = await res.text();
    const pageTitle = extractTitle(html);
    const description = extractMeta(html, "description") || extractMeta(html, "og:description");
    if (!pageTitle && !description) {
      return { error: true, title: source.title, url: source.url, message: "Keine Inhalte gefunden" };
    }
    return {
      error: false,
      item: { label: source.title, title: pageTitle, description, url: source.url },
    };
  } catch (err) {
    return { error: true, title: source.title, url: source.url, message: String((err && err.message) || err) };
  }
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const results = await Promise.all(SOURCES.map(fetchSource));
  const items = results.filter((r) => !r.error).map((r) => r.item);
  const failedSources = results.filter((r) => r.error).map((r) => ({ title: r.title, url: r.url, status: r.status, message: r.message }));

  const body = JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
    failedSources,
  });

  const response = new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=21600",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
