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

// In-Memory-Mock fürs Ideenboard (#/ideen) — ersetzt hier NUR für den
// lokalen Vorschau-Server das echte Cloudflare-KV-Backend
// (functions/api/ideas.js), damit die neue Seite ohne echten Login/echte
// KV-Bindung visuell und funktional durchgetestet werden kann. Geht beim
// Server-Neustart verloren, ist reine Test-Hilfe.
const mockIdeas = [
  { id: "seed-1", title: "Wissensaustausch leicht gemacht", description: "Eine interne Plattform für kurze How-to-Guides und Best Practices, damit wir schneller voneinander lernen können.", benefit: "", authorLabel: "jan.m@sowespoke.com", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "seed-2", title: "Feedback-Kultur stärken", description: "Regelmäßige, kurze Feedback-Runden im Team einführen — wertschätzend und konstruktiv.", benefit: "", authorLabel: "Anonym", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

// In-Memory-Mock für die serverseitige Empfänger-Liste im Mail-Generator
// (functions/api/recipients.js) — ersetzt hier nur den echten
// RECIPIENT_LISTS-KV-Namespace, geht beim Server-Neustart verloren.
let mockRecipients = [];

// Mock für den Gmail-Direktversand (functions/api/gmail/status.js+send.js,
// Phase B) — standardmäßig "verbunden", damit sich der "Jetzt per Gmail
// senden"-Pfad lokal ohne echtes OAuth durchklicken lässt. POST tut so, als
// wäre der Versand erfolgreich, verschickt aber natürlich nichts wirklich.
let mockGmailConnected = true;

// Mock für terminierte Serienmails (functions/api/mail-schedule/*, Phase C)
// — In-Memory-Liste, geht beim Server-Neustart verloren. Es gibt hier
// keinen echten Cron-Lauf, der "gesendet" markiert — genügt für den
// visuellen/funktionalen Test von Terminieren/Anzeigen/Stornieren.
let mockScheduleJobs = [];

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
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
  if (urlPath === "/api/auth/me") {
    // ?admin=0 anhängen, um lokal die Nicht-Admin-Ansicht zu testen
    // (Standard hier: Admin, damit der Löschen-Button ohne Zusatzschritt
    // sichtbar ist — echtes Admin-Recht kommt live aus functions/_lib/auth.js).
    const isAdmin = new URLSearchParams(req.url.split("?")[1] || "").get("admin") !== "0";
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ email: "test@sowespoke.com", isAdmin }));
    return;
  }
  if (urlPath === "/api/ideas" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ items: [...mockIdeas].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) }));
    return;
  }
  if (urlPath.startsWith("/api/ideas/") && req.method === "DELETE") {
    const id = decodeURIComponent(urlPath.slice("/api/ideas/".length));
    const idx = mockIdeas.findIndex((i) => i.id === id);
    if (idx !== -1) mockIdeas.splice(idx, 1);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (urlPath === "/api/ideas" && req.method === "POST") {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ungültiger Request-Body" }));
      return;
    }
    const title = String(body?.title || "").trim();
    const description = String(body?.description || "").trim();
    if (!title || !description) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Titel und Beschreibung sind erforderlich" }));
      return;
    }
    const idea = {
      id: `local-${Date.now()}`,
      title,
      description,
      benefit: String(body?.benefit || "").trim(),
      authorLabel: body?.anonymous ? "Anonym" : "test@sowespoke.com",
      createdAt: new Date().toISOString(),
    };
    mockIdeas.push(idea);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, idea }));
    return;
  }
  if (urlPath === "/api/recipients" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ items: mockRecipients }));
    return;
  }
  if (urlPath === "/api/recipients" && req.method === "POST") {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ungültiger Request-Body" }));
      return;
    }
    mockRecipients = (Array.isArray(body?.items) ? body.items : [])
      .map((r) => ({ name: String(r?.name || "").trim(), email: String(r?.email || "").trim() }))
      .filter((r) => r.name || r.email);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, items: mockRecipients }));
    return;
  }
  if (urlPath === "/api/gmail/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ connected: mockGmailConnected }));
    return;
  }
  if (urlPath === "/api/gmail/status" && req.method === "DELETE") {
    mockGmailConnected = false;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (urlPath === "/api/gmail/send" && req.method === "POST") {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ungültiger Request-Body" }));
      return;
    }
    if (!mockGmailConnected) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "not_connected" }));
      return;
    }
    if (!body?.to || !body?.subject || !body?.body) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ungültige Anfrage" }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, id: `mock-${Date.now()}` }));
    return;
  }
  if (urlPath === "/api/mail-schedule/jobs" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ items: [...mockScheduleJobs].sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt)) }));
    return;
  }
  if (urlPath === "/api/mail-schedule/jobs" && req.method === "POST") {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Ungültiger Request-Body" }));
      return;
    }
    if (!mockGmailConnected) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "not_connected" }));
      return;
    }
    const items = (Array.isArray(body?.items) ? body.items : [])
      .filter((r) => r?.to && r?.subject && r?.body && r?.sendAt)
      .map((r) => ({
        id: `mock-${Math.random().toString(36).slice(2)}`,
        to: String(r.to),
        subject: String(r.subject),
        body: String(r.body),
        label: String(r.label || ""),
        sendAt: new Date(r.sendAt).toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
        sentAt: null,
        error: null,
      }));
    mockScheduleJobs.push(...items);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, items }));
    return;
  }
  if (urlPath.startsWith("/api/mail-schedule/jobs/") && req.method === "DELETE") {
    const id = decodeURIComponent(urlPath.slice("/api/mail-schedule/jobs/".length));
    mockScheduleJobs = mockScheduleJobs.filter((j) => j.id !== id);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
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
