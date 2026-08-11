#!/usr/bin/env node
/**
 * Lokaler Vorschau-Server für visuelle Selbsttests (siehe WORKFLOW.md).
 *
 * Dient NICHT als Ersatz für `wrangler pages dev` — es gibt hier keine
 * echten Cloudflare Pages Functions, kein Login, keine echten RSS-Daten.
 * Zweck ist ausschließlich: die statische Seite so servieren, dass ein
 * Browser (z. B. via Playwright) sie ohne Google-Login öffnen kann, um
 * Layout/Abstände/Farben/Größen mit echten Screenshots zu prüfen, BEVOR
 * eine Änderung gepusht wird.
 *
 * Nutzung:
 *   node tools/local-preview-server.mjs [port]
 *   (Default-Port: 5511)
 *
 * /api/news und /api/learn liefern feste Mock-Daten (keine echten Cloudflare
 * Pages Functions verfügbar) — Layout/Karten sehen dadurch realistisch aus,
 * Inhalte sind aber keine echten News. Alle anderen Pfade werden direkt aus
 * dem Repo-Root serviert, unbekannte Pfade fallen auf index.html zurück
 * (SPA-Routing).
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2]) || 5511;

const MIME = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".ico": "image/x-icon",
  // PDF.js-Viewer (assets/pdfjs/): ohne diese drei bleibt der lokale Test
  // wirkungslos, weil Browser .mjs sonst als application/octet-stream
  // bekommen und das <script type="module"> ablehnen (siehe auch _headers).
  ".mjs": "text/javascript", ".wasm": "application/wasm", ".pdf": "application/pdf",
};

function mockNews() {
  const now = Date.now();
  const day = 86400000;
  const items = [
    { title: "Microsoft Advertising führt neue Performance-Max-Reports ein", link: "https://example.com/1", pubDate: new Date(now - 0.3 * day).toISOString(), description: "Neue Berichtsfunktionen erlauben eine detailliertere Aufschlüsselung von Performance-Max-Kampagnen nach Placement und Asset-Gruppe.", source: "Microsoft Advertising Blog", channel: "Microsoft", lang: "de" },
    { title: "Google rollt neues Keyword-Matching-Verhalten aus", link: "https://example.com/2", pubDate: new Date(now - 0.8 * day).toISOString(), description: "Broad Match wird laut Google in den kommenden Wochen überarbeitet — Werbetreibende sollten Budgets und Ausschlüsse vorab prüfen.", source: "Search Engine Land", channel: "Google", lang: "de" },
    { title: "Meta erweitert Advantage+ um automatische Creative-Varianten", link: "https://example.com/3", pubDate: new Date(now - 1.5 * day).toISOString(), description: "Advantage+-Kampagnen generieren künftig automatisch zusätzliche Creative-Varianten je Zielgruppensegment.", source: "Meta Business Blog", channel: "Meta", lang: "de" },
    { title: "TikTok Shop Ads jetzt auch für DACH-Region verfügbar", link: "https://example.com/4", pubDate: new Date(now - 2.1 * day).toISOString(), description: "Der Shopping-Anzeigenformat-Rollout umfasst Deutschland, Österreich und die Schweiz, inklusive nativer Checkout-Integration.", source: "adseed SEA-News", channel: "TikTok", lang: "de" },
    { title: "Rechtliches: Neue EU-Vorgaben zur Werbekennzeichnung ab Q4", link: "https://example.com/5", pubDate: new Date(now - 3 * day).toISOString(), description: "Die überarbeiteten Transparenzpflichten betreffen personalisierte Werbung branchenübergreifend.", source: "OMR", channel: "Rechtliches", lang: "de" },
    { title: "KI-gestützte Bid-Strategien: neue Studie zu Autobidding-Genauigkeit", link: "https://example.com/6", pubDate: new Date(now - 4 * day).toISOString(), description: "Eine aktuelle Auswertung vergleicht die Zielgenauigkeit verschiedener automatisierter Gebotsstrategien.", source: "OMR", channel: "KI", lang: "de" },
    { title: "CRO-Trend: Micro-Conversions gewinnen an Bedeutung fürs Reporting", link: "https://example.com/7", pubDate: new Date(now - 5 * day).toISOString(), description: "Immer mehr Teams ergänzen klassische Conversion-Ziele um kleinteiligere Signale.", source: "adseed SEA-News", channel: "CRO", lang: "de" },
    { title: "Snapchat kündigt neue AR-Anzeigenformate für Q4 an", link: "https://example.com/8", pubDate: new Date(now - 6 * day).toISOString(), description: "Die neuen Augmented-Reality-Formate richten sich insbesondere an Handel und Konsumgüterbranche.", source: "Search Engine Land", channel: "Snapchat", lang: "en" },
  ];
  return { generatedAt: new Date().toISOString(), count: items.length, failedSources: [], items };
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0].split("#")[0];

  if (urlPath === "/api/news") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(mockNews()));
    return;
  }
  if (urlPath === "/api/learn") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ items: [] }));
    return;
  }

  let filePath = urlPath;
  if (filePath === "/" || filePath.startsWith("/api/") || !path.extname(filePath)) {
    filePath = "/index.html"; // SPA-Fallback
  }
  fs.readFile(path.join(ROOT, decodeURIComponent(filePath)), (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("not found: " + urlPath);
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Lokaler Vorschau-Server: http://localhost:${PORT}/`));
