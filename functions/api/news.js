/**
 * Cloudflare Pages Function — aggregiert externe RSS/Atom-Feeds serverseitig
 * (Browser kann fremde Feeds wegen CORS meist nicht direkt laden).
 *
 * Übersetzung: englische Quellen (`lang: "en"`) werden, sofern das Secret
 * `GEMINI_API_KEY` gesetzt ist, per Google-Gemini-API (kostenloses
 * Kontingent, keine Zahlungsmethode nötig) ins Deutsche übersetzt (siehe
 * `translateItems`). Ohne gesetzten Key bleibt das bisherige Verhalten
 * unverändert: Original-Text + "EN"-Sprach-Badge im Frontend, kein Fehler.
 *
 * Persistentes Archiv (2026-09-04, Nutzer-Beobachtung: "gestern gab es
 * andere News, z. B. Google Trends, heute sehe ich sie nicht mehr"):
 * RSS-Feeds der Quellen selbst sind KEIN Archiv, sondern zeigen nur ein
 * rollierendes Fenster der letzten ~10–20 Beiträge — sobald eine Quelle
 * etwas Neues veröffentlicht, fällt bei ihr der älteste Eintrag raus, und
 * damit auch aus jedem reinen Live-Abruf wie bisher. `mergeArchive` legt
 * deshalb jeden je gesehenen Artikel dauerhaft in Cloudflare KV ab
 * (Namespace `NEWS_ARCHIVE`) und mischt ihn bei jedem Abruf wieder mit den
 * frischen Live-Daten. Erfordert eine KV-Namespace-Bindung `NEWS_ARCHIVE`
 * im Cloudflare-Dashboard (Pages-Projekt → Settings → Functions → KV
 * namespace bindings), gleiches Muster wie NEWS_RATINGS/IDEAS_BOARD. Ohne
 * Bindung verhält sich der Feed unverändert wie vorher: rein live, kein
 * Fehler.
 *
 * Bewusst EIN Blob-Key (`archive:pool`) statt eines Keys pro Artikel wie
 * sonst in diesem Projekt üblich (siehe ideas.js/rate.js): ein aggregierter
 * News-Feed wächst unbegrenzt und automatisch (nicht durch Nutzer-Aktionen
 * begrenzt wie Ideen/Bewertungen) — ein Key pro Artikel hätte bedeutet,
 * dass jeder der ca. 96 Origin-Aufrufe/Tag (15-Minuten-Cache) mit
 * wachsendem Archiv linear mehr KV-Lese-Operationen braucht und das
 * kostenlose Tageskontingent irgendwann sprengt. Ein einzelner Blob
 * bedeutet immer genau 1 KV-Read + höchstens 1 KV-Write pro Origin-Aufruf,
 * unabhängig von der Archivgröße.
 */

const SOURCES = [
  { name: "Microsoft Advertising Blog", url: "https://about.ads.microsoft.com/en-us/blog/rss", channel: "Microsoft", lang: "en" },
  { name: "Search Engine Land", url: "https://searchengineland.com/feed", channel: "Allgemein", lang: "en" },
  { name: "adseed SEA-News", url: "https://www.adseed.de/blog/sea-news/feed/", channel: "Google", lang: "de" },
  { name: "OMR", url: "https://omr.com/de/feed/", channel: "Allgemein", lang: "de" },
  // t3n bewusst entfernt: kein eigener Marketing-Feed verfügbar (nur
  // Gesamt-Tech-Feed inkl. Astronomie/Hardware/Wissenschaft, fachfremd
  // für dieses Tool) — siehe Nutzer-Feedback vom 2026-08-02.
  // Neue DACH-Quelle (2026-09-07, Nutzer-Wunsch: "mehr wichtige Infos aus
  // Deutschland"). Vor der Aufnahme per curl geprüft: stündlich
  // aktualisiert, deutschsprachig, deckt (anders als adseed/OMR) auch
  // Plattform-News zu Google/Meta/TikTok/KI ab — deshalb "Allgemein" wie
  // Search Engine Land/OMR statt eines der Plattform-Kanäle.
  { name: "OnlineMarketing.de", url: "https://onlinemarketing.de/feed", channel: "Allgemein", lang: "de" },
];

// Wiederkehrende Rubriken ohne eigentlichen Nachrichtenwert für dieses
// Tool (2026-09-07, Nutzer-Fund: "die Job-Angebote sind irrelevant") —
// Search Engine Land veröffentlicht z. B. wöchentlich eine Stellenangebote-
// Sammlung unter demselben Titel. Titel-Muster statt Quellen-Sperre, damit
// eine einzelne wiederkehrende Rubrik gefiltert wird, ohne die ganze Quelle
// auszuschließen.
const EXCLUDED_TITLE_PATTERNS = [/^the latest jobs in /i];
function isExcludedTitle(title) {
  return EXCLUDED_TITLE_PATTERNS.some((p) => p.test(title));
}

// Kanal-Zuordnung nach Inhalt statt nur nach Quelle (2026-09-07, Nutzer-
// Fund per Screenshot: ein sichtbarer TikTok-Artikel, aber der TikTok-Chip
// zeigte "0") — `channel` kam bisher ausschließlich fix pro Quelle
// (SOURCES[].channel), nie aus dem Artikeltext selbst. Für Sammelquellen
// wie Search Engine Land/OMR/OnlineMarketing.de (alle "Allgemein") landete
// dadurch JEDER Artikel unter "Allgemein", selbst wenn der Titel eindeutig
// eine bestimmte Plattform nennt — die Plattform-Chips (Meta/TikTok/
// Snapchat/…) blieben dadurch faktisch tot, obwohl passende Artikel längst
// im Feed sichtbar waren (siehe [[sowespoke-news-channel-tabs-dead]]-
// Notiz, jetzt überholt). Dieselbe Wortgrenzen-Regel-Struktur wie
// NEWS_BRAND_TEXT_RULES in app.js, hier server-seitig dupliziert (kein
// gemeinsames Modul zwischen Function und Frontend in diesem Projekt) —
// greift bewusst NUR bei Quellen/Items, deren Kanal aktuell "Allgemein"
// ist (die drei Sammelquellen Search Engine Land/OMR/OnlineMarketing.de).
// Ein bereits verlässlich zugeordneter Kanal (Microsoft Advertising Blog →
// "Microsoft", adseed SEA-News → "Google") wird NICHT überschrieben, auch
// wenn der Titel zufällig eine andere Marke nennt (z. B. ein Microsoft-
// Advertising-Artikel, der Google vergleichend erwähnt, bleibt "Microsoft"
// — die Quelle weiß es hier besser als eine Titel-Heuristik).
const CHANNEL_TEXT_RULES = [
  { channel: "Google", pattern: /\b(google|adx|adsense|adwords|youtube)\b/i },
  { channel: "Meta", pattern: /\b(meta|facebook|instagram|whatsapp)\b/i },
  { channel: "Microsoft", pattern: /\b(microsoft|bing|copilot)\b/i },
  { channel: "TikTok", pattern: /\btiktok\b/i },
  { channel: "Snapchat", pattern: /\bsnapchat\b/i },
  { channel: "KI", pattern: /\b(ki|ai|chatgpt|openai|llm|künstliche intelligenz|artificial intelligence)\b/i },
  { channel: "Rechtliches", pattern: /\b(datenschutz|dsgvo|gdpr|kartellrecht|klage|lawsuit|antitrust|regulation|compliance)\b/i },
  { channel: "CRO", pattern: /\b(cro|conversion.?rate|micro-?conversions?)\b/i },
];
function classifyChannel(title, currentChannel) {
  if (currentChannel !== "Allgemein") return currentChannel;
  const rule = CHANNEL_TEXT_RULES.find((r) => r.pattern.test(title || ""));
  return rule ? rule.channel : currentChannel;
}

// Einzelne, von Hand kuratierte Artikel ohne RSS-Feed (z. B. der
// "Discover"-Ressourcenbereich von Microsoft Advertising hat keinen Feed) —
// werden per Titel + Meta-Description ins News-Format gebracht.
// curatedAt = fester Fallback, falls die Seite selbst kein Datum liefert
// (siehe fetchArticle) — beide Artikel unten haben tatsächlich KEIN
// article:published_time-Meta-Tag (per curl nachgeprüft), das Datum
// entsprach vorher also bei jedem Abruf "jetzt" statt einem festen Wert.
// Bug-Fund (2026-08-19, Nutzer-Beobachtung): dadurch sprang der Artikel bei
// jedem 15-Minuten-Cache-Refresh mit neuem Datum wieder ganz nach oben, als
// wäre er gerade neu erschienen. curatedAt bleibt jetzt stabil auf dem Tag,
// an dem der Artikel in dieses Repo aufgenommen wurde (Initial commit).
const ARTICLES = [
  { name: "Microsoft Advertising", url: "https://about.ads.microsoft.com/en/resources/discover/insights/search-first-audience-campaign", channel: "Microsoft", lang: "en", curatedAt: "2026-08-02" },
  { name: "Microsoft Advertising", url: "https://about.ads.microsoft.com/en/resources/discover/case-studies/lenovo-customer-success-story", channel: "Microsoft", lang: "en", curatedAt: "2026-08-02" },
];

function extractTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>\s*$/, "").trim();
}

// Bug-Fund (SoWeSpike-Spezifikation B1.1, 2026-09-07): numerische
// HTML-Entities (z. B. &#124; für "|", von adseed SEA-News als manuelles
// Trennzeichen im Teaser verwendet) wurden bisher gar nicht dekodiert —
// liefen als Roh-Text durch stripHtml() durch, wurden dann beim Rendern in
// app.js per escapeHtml() ERNEUT escaped (das & wird zu &amp;) und
// erschienen dadurch sichtbar als Text "&#124;" statt als "|". Generischer
// Decoder statt nur des einen Falls, damit jede numerische Entity
// funktioniert, nicht nur &#124;.
function decodeNumericEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function stripHtml(str) {
  return decodeNumericEntities(str.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#8217;/g, "'")).replace(/\s+/g, " ").trim();
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
  return decodeNumericEntities(str.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " "));
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
    // Fallback bei fehlender Datumsangabe auf der Seite selbst: fester
    // curatedAt-Wert (siehe ARTICLES oben) statt new Date() — new Date()
    // ändert sich bei jedem Abruf, das ließ den Artikel bei jedem
    // 15-Minuten-Cache-Refresh wieder als "gerade neu erschienen" nach oben
    // rutschen (Bug-Fund 2026-08-19). curatedAt bleibt stabil.
    const curatedParsed = Date.parse(article.curatedAt);
    const fallback = Number.isNaN(curatedParsed) ? new Date().toISOString() : new Date(curatedParsed).toISOString();
    return {
      error: false,
      items: [{
        title,
        link: article.url,
        pubDate: Number.isNaN(parsed) ? fallback : new Date(parsed).toISOString(),
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
    const items = parseItems(xml, isAtom).filter((i) => i.title && i.link && !isExcludedTitle(i.title));
    return {
      error: false,
      items: items.slice(0, 12).map((i) => ({ ...i, source: source.name, channel: source.channel, lang: source.lang })),
    };
  } catch (err) {
    return { error: true, source: source.name, message: String((err && err.message) || err) };
  }
}

// Nur Items übersetzen, die es noch nicht sind (2026-09-04, im Zuge des
// Archivs ergänzt) — ein aus dem Archiv wiederverwendetes Item trägt nach
// einer früheren Übersetzung bereits `translated: true` UND deutschen
// Text in title/description bei weiterhin `lang: "en"` (lang beschreibt
// die Sprache der QUELLE, nicht des aktuell angezeigten Texts). Ohne diese
// Prüfung würde bei jedem Cache-Refresh derselbe schon-übersetzte Text
// erneut als "zu übersetzendes Englisch" an Gemini geschickt — unnötige
// API-Aufrufe UND das Risiko, bereits-deutschen Text kaputtzuübersetzen.
function needsTranslation(item) {
  return item.lang === "en" && !item.translated && (item.title || item.description);
}

// Übersetzt die englischsprachigen Items in einem einzigen Batch-Request
// (statt einem Request pro Artikel) — hält Kosten/Latenz niedrig, das
// Ergebnis landet ohnehin im 15-Minuten-Response-Cache. Bei fehlendem Key,
// Netzwerkfehler oder unerwarteter Antwort werden die Original-Items
// unverändert zurückgegeben — Übersetzung ist ein optionales Add-on, kein
// harter Abhängigkeitspunkt für den News-Feed.
async function translateItems(items, apiKey, model) {
  const toTranslate = items.filter(needsTranslation);
  if (!toTranslate.length || !apiKey) return items;

  const payload = toTranslate.map((i, idx) => ({ id: idx, title: i.title, description: i.description }));
  const promptInstructions =
    'Du übersetzt kurze Online-Marketing-News-Teaser aus dem Englischen ins Deutsche für ein internes Wissenszentrum einer Marketing-Agentur. Behalte Produktnamen und Fachbegriffe bei (z. B. Microsoft Advertising, ROAS, CPC, Performance Max), übersetze natürlich, knapp und sachlich, keine Erklärungen oder Zusätze. Antworte ausschließlich mit einem JSON-Objekt der Form {"items":[{"id":number,"title":string,"description":string}]} in derselben Reihenfolge wie die Eingabe, ein Eintrag pro Eingabe-Item.';

  try {
    const modelId = model || "gemini-2.0-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${promptInstructions}\n\n${JSON.stringify({ items: payload })}` }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      }
    );
    if (!res.ok) return items;
    const data = await res.json();
    const raw = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
      && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (!raw) return items;
    const parsed = JSON.parse(raw);
    const byId = new Map((parsed.items || []).map((t) => [t.id, t]));

    let cursor = 0;
    return items.map((item) => {
      if (!needsTranslation(item)) return item;
      const t = byId.get(cursor++);
      if (!t) return item;
      return { ...item, title: t.title || item.title, description: t.description || item.description, translated: true };
    });
  } catch (err) {
    return items;
  }
}

const NEWS_ARCHIVE_KEY = "archive:pool";
const MAX_ARCHIVE_ITEMS = 200;
const MAX_VISIBLE_ITEMS = 60;

// Führt frisch abgerufene Live-Items mit dem bestehenden Archiv zusammen,
// dedupliziert über den Link (eindeutige Artikel-ID, gleiche Annahme wie
// bei rate.js). Ein bereits übersetzter archivierter Eintrag bleibt in
// title/description unangetastet (nur pubDate wird aufgefrischt, falls die
// Quelle inzwischen ein genaueres Datum liefert) — ein noch nicht
// übersetzter oder ganz neuer Eintrag wird durch die frische Live-Version
// ersetzt, damit dort weiterhin der aktuelle Originaltext ankommt.
function mergeArchive(archived, live) {
  const byLink = new Map(archived.map((item) => [item.link, item]));
  for (const item of live) {
    const prior = byLink.get(item.link);
    byLink.set(item.link, prior && prior.translated ? { ...prior, pubDate: item.pubDate || prior.pubDate } : item);
  }
  return Array.from(byLink.values()).sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const { env } = context;
  const archiveEnabled = !!env.NEWS_ARCHIVE;

  const [results, archived] = await Promise.all([
    Promise.all([...SOURCES.map(fetchSource), ...ARTICLES.map(fetchArticle)]),
    archiveEnabled ? env.NEWS_ARCHIVE.get(NEWS_ARCHIVE_KEY, "json") : Promise.resolve(null),
  ]);
  const liveItems = results.filter((r) => !r.error).flatMap((r) => r.items);
  const failedSources = results.filter((r) => r.error).map((r) => ({ source: r.source, status: r.status, message: r.message }));

  // Ohne KV-Bindung exakt das vorherige Verhalten: rein live, auf die
  // sichtbaren 60 gedeckelt. Mit Bindung: Live+Archiv gemischt, auf
  // MAX_ARCHIVE_ITEMS gedeckelt für die Ablage (siehe Datei-Kommentar oben
  // zur Begründung des Caps), Übersetzung läuft über die volle Ablage
  // (einmalig pro Artikel, nicht nur über die sichtbaren 60), erst danach
  // auf die sichtbaren 60 zugeschnitten.
  let items = archiveEnabled ? mergeArchive(archived || [], liveItems) : liveItems.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
  // Läuft über ALLE Items (frisch UND bereits archiviert) statt nur beim
  // Einlesen einer Quelle — dadurch heilen sich auch schon im Archiv
  // liegende, unter "Allgemein" einsortierte Alt-Einträge bei jedem Abruf
  // selbst aus, ohne das Archiv einmalig manuell neu einlesen zu müssen.
  items = items.map((item) => ({ ...item, channel: classifyChannel(item.title, item.channel) }));
  items = items.slice(0, archiveEnabled ? MAX_ARCHIVE_ITEMS : MAX_VISIBLE_ITEMS);
  items = await translateItems(items, env.GEMINI_API_KEY, env.GEMINI_MODEL);

  if (archiveEnabled) {
    context.waitUntil(env.NEWS_ARCHIVE.put(NEWS_ARCHIVE_KEY, JSON.stringify(items)));
  }
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);

  const body = JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: visibleItems.length,
    items: visibleItems,
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
