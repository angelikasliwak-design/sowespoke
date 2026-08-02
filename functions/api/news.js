/**
 * Cloudflare Pages Function — aggregiert externe RSS/Atom-Feeds serverseitig
 * (Browser kann fremde Feeds wegen CORS meist nicht direkt laden).
 *
 * WICHTIG: Automatische Übersetzung ins Deutsche ist NICHT implementiert —
 * das würde einen LLM-API-Key voraussetzen (gleiche Entscheidung wie der
 * geplante Chatbot). Bis dahin liefern wir Titel/Text in der Originalsprache
 * und markieren sie mit `lang`; das Frontend zeigt ein Sprach-Badge.
 */

const SOURCES = [
  { name: "Microsoft Advertising Blog", url: "https://about.ads.microsoft.com/en-us/blog/rss", channel: "Microsoft", lang: "en" },
  { name: "Search Engine Land", url: "https://searchengineland.com/feed", channel: "Allgemein", lang: "en" },
  { name: "adseed SEA-News", url: "https://www.adseed.de/blog/sea-news/feed/", channel: "Google", lang: "de" },
  { name: "OMR", url: "https://omr.com/de/feed/", channel: "Allgemein", lang: "de" },
  // t3n bewusst entfernt: kein eigener Marketing-Feed verfügbar (nur
  // Gesamt-Tech-Feed inkl. Astronomie/Hardware/Wissenschaft, fachfremd
  // für dieses Tool) — siehe Nutzer-Feedback vom 2026-08-02.
];

// Einzelne, von Hand kuratierte Artikel ohne RSS-Feed (z. B. der
// "Discover"-Ressourcenbereich von Microsoft Advertising hat keinen Feed) —
// werden per Titel + Meta-Description ins News-Format gebracht.
const ARTICLES = [
  { name: "Microsoft Advertising", url: "https://about.ads.microsoft.com/en/resources/discover/insights/search-first-audience-campaign", channel: "Microsoft", lang: "en" },
  { name: "Microsoft Advertising", url: "https://about.ads.microsoft.com/en/resources/discover/case-studies/lenovo-customer-success-story", channel: "Microsoft", lang: "en" },
];

function extractTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/\s+/g, " ").trim();
}

function parseItems(xml, isAtom) {
  const blockTag = isAtom ? "entry" : "item";
  const blocks = xml.match(new RegExp(`<${blockTag}[\\s\\S]*?<\\/${blockTag}>`, "gi")) || [];
  return blocks.map((block) => {
    const title = stripHtml(extractTag(block, "title"));
    let link = extractTag(block, "link");
    if (isAtom || !link) {
      const hrefMatch = block.match(/<link[^>]*href="([^"]+)"/i);
      if (hrefMatch) link = hrefMatch[1];
    }
    const pubDateRaw =
      extractTag(block, "pubDate") || extractTag(block, "updated") || extractTag(block, "published") || extractTag(block, "dc:date");
    // Manche Feeds liefern zusätzlich zur kurzen Zusammenfassung den vollen
    // Artikeltext über content:encoded — davon nehmen wir mehr für einen
    // aussagekräftigeren Teaser, statt nur den knappen Summary-Satz.
    const rawSummary = extractTag(block, isAtom ? "summary" : "description");
    const rawContent = extractTag(block, "content:encoded") || extractTag(block, "content");
    const rawBest = rawContent.length > rawSummary.length ? rawContent : rawSummary;
    const description = stripHtml(rawBest).slice(0, 420);
    const parsed = Date.parse(pubDateRaw);
    return {
      title,
      link: (link || "").trim(),
      pubDate: Number.isNaN(parsed) ? null : new Date(parsed).toISOString(),
      description,
    };
  });
}

function decodeHtmlEntities(str) {
  return str.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}

async function fetchArticle(article) {
  try {
    const res = await fetch(article.url, {
      headers: { "User-Agent": "SowespokeWissenszentrum/1.0 (+internes Tool)" },
      cf: { cacheTtl: 21600, cacheEverything: true },
    });
    if (!res.ok) return { error: true, source: article.name, status: res.status };
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);
    const dateMatch = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']*)["']/i);
    const title = titleMatch ? decodeHtmlEntities(titleMatch[1]).replace(/\s+/g, " ").trim().replace(/\s*\|\s*Microsoft Advertising$/i, "") : "";
    const description = descMatch ? decodeHtmlEntities(descMatch[1]).trim() : "";
    if (!title) return { error: true, source: article.name, message: "Kein Titel gefunden" };
    const parsed = dateMatch ? Date.parse(dateMatch[1]) : NaN;
    // Keine Datumsangabe im Artikel selbst gefunden -> Abrufdatum als
    // Fallback, damit kuratierte Artikel nicht unsichtbar ganz unten landen.
    return {
      error: false,
      items: [{
        title,
        link: article.url,
        pubDate: Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString(),
        description,
        source: article.name,
        channel: article.channel,
        lang: article.lang,
      }],
    };
  } catch (err) {
    return { error: true, source: article.name, message: String((err && err.message) || err) };
  }
}

async function fetchSource(source) {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "SowespokeWissenszentrum/1.0 (+internes Tool)" },
      cf: { cacheTtl: 900, cacheEverything: true },
    });
    if (!res.ok) return { error: true, source: source.name, status: res.status };
    const xml = await res.text();
    const isAtom = /<feed[\s>]/i.test(xml) && !/<rss[\s>]/i.test(xml);
    const items = parseItems(xml, isAtom).filter((i) => i.title && i.link);
    return {
      error: false,
      items: items.slice(0, 12).map((i) => ({ ...i, source: source.name, channel: source.channel, lang: source.lang })),
    };
  } catch (err) {
    return { error: true, source: source.name, message: String((err && err.message) || err) };
  }
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const results = await Promise.all([...SOURCES.map(fetchSource), ...ARTICLES.map(fetchArticle)]);
  const items = results.filter((r) => !r.error).flatMap((r) => r.items);
  const failedSources = results.filter((r) => r.error).map((r) => ({ source: r.source, status: r.status, message: r.message }));

  items.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  const body = JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: items.length,
    items: items.slice(0, 60),
    failedSources,
  });

  const response = new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=900",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
