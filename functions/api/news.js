/**
 * Cloudflare Pages Function — aggregiert externe RSS/Atom-Feeds serverseitig
 * (Browser kann fremde Feeds wegen CORS meist nicht direkt laden).
 *
 * Übersetzung: englische Quellen (`lang: "en"`) werden, sofern das Secret
 * `OPENAI_API_KEY` gesetzt ist, per OpenAI-Chat-Completions ins Deutsche
 * übersetzt (siehe `translateItems`). Ohne gesetzten Key bleibt das
 * bisherige Verhalten unverändert: Original-Text + "EN"-Sprach-Badge im
 * Frontend, kein Fehler.
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

// Übersetzt die englischsprachigen Items in einem einzigen Batch-Request
// (statt einem Request pro Artikel) — hält Kosten/Latenz niedrig, das
// Ergebnis landet ohnehin im 15-Minuten-Response-Cache. Bei fehlendem Key,
// Netzwerkfehler oder unerwarteter Antwort werden die Original-Items
// unverändert zurückgegeben — Übersetzung ist ein optionales Add-on, kein
// harter Abhängigkeitspunkt für den News-Feed.
async function translateItems(items, apiKey, model) {
  const toTranslate = items.filter((i) => i.lang === "en" && (i.title || i.description));
  if (!toTranslate.length || !apiKey) return items;

  const payload = toTranslate.map((i, idx) => ({ id: idx, title: i.title, description: i.description }));

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model || "gpt-4.1-mini",
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              'Du übersetzt kurze Online-Marketing-News-Teaser aus dem Englischen ins Deutsche für ein internes Wissenszentrum einer Marketing-Agentur. Behalte Produktnamen und Fachbegriffe bei (z. B. Microsoft Advertising, ROAS, CPC, Performance Max), übersetze natürlich, knapp und sachlich, keine Erklärungen oder Zusätze. Antworte ausschließlich mit einem JSON-Objekt der Form {"items":[{"id":number,"title":string,"description":string}]} in derselben Reihenfolge wie die Eingabe, ein Eintrag pro Eingabe-Item.',
          },
          { role: "user", content: JSON.stringify({ items: payload }) },
        ],
      }),
    });
    if (!res.ok) return items;
    const data = await res.json();
    const raw = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!raw) return items;
    const parsed = JSON.parse(raw);
    const byId = new Map((parsed.items || []).map((t) => [t.id, t]));

    let cursor = 0;
    return items.map((item) => {
      if (item.lang !== "en" || !(item.title || item.description)) return item;
      const t = byId.get(cursor++);
      if (!t) return item;
      return { ...item, title: t.title || item.title, description: t.description || item.description, translated: true };
    });
  } catch (err) {
    return items;
  }
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const results = await Promise.all([...SOURCES.map(fetchSource), ...ARTICLES.map(fetchArticle)]);
  let items = results.filter((r) => !r.error).flatMap((r) => r.items);
  const failedSources = results.filter((r) => r.error).map((r) => ({ source: r.source, status: r.status, message: r.message }));

  items.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
  items = items.slice(0, 60);
  items = await translateItems(items, context.env.OPENAI_API_KEY, context.env.OPENAI_MODEL);

  const body = JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
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
