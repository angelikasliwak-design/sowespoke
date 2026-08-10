# Design-Masterprompt (extern zugeliefert, 2026-08-10)

> **Status: Referenz/Entwurf, NICHT aktiv.** Dieses Dokument ist ein vom Nutzer
> von außerhalb dieser Session mitgebrachter, sehr umfangreicher Prompt für
> einen kompletten Neuaufbau des Portals (neues Design-System "Pop-Art/Comic",
> neues Maskottchen "SPARK" statt der etablierten Fuchs-Figur "PIX", RAG-
> Chatbot, echte Microsoft-Ads-/Zoho-/Gmail-API-Integrationen, Test-
> Infrastruktur mit Build-Tooling).
>
> **Es widerspricht an mehreren Stellen explizit bereits getroffenen,
> mit dem Nutzer abgestimmten Entscheidungen** aus dem laufenden Projekt
> (siehe `DESIGN.md`, `PRODUCT.md`, `WORKFLOW.md`) — u. a. Maskottchen-
> Identität, bewusster Verzicht auf die Gmail-API zugunsten des einfacheren
> Compose-Link-Ansatzes, bewusst build-lose Architektur (kein `npm run dev`,
> kein Vitest, kein Bundler). Bevor hieraus etwas umgesetzt wird, braucht es
> eine bewusste Entscheidung, was davon wirklich gewollt ist — siehe
> Einordnung am Ende dieser Datei.

---

## Ursprünglicher Prompt-Text (unverändert übernommen)

```
# MASTER-PROMPT — SOWE SPOKE Wissensportal
### Für Claude Code in VS Code. Bitte vollständig einfügen und dann arbeiten lassen.

---

## 0. ROLLE, ARBEITSWEISE & SELBSTKONTROLLE (wichtigster Abschnitt — bitte zuerst lesen)

Du arbeitest als **Senior Product Designer + Senior Frontend Engineer** (Level: internationale Digital-Agentur, Awwwards-Standard). Dein Auftrag ist nicht „ein paar Fixes", sondern: **dieses Portal auf ein professionelles, in sich vollständig konsistentes Produkt heben.**

**Grundregeln:**

1. **Arbeite auf localhost.** Starte den Dev-Server (`npm run dev` o. ä.) und halte ihn laufen. Alles, was du baust, musst du auch tatsächlich im Browser gesehen haben, bevor du es als fertig bezeichnest.
2. **Selbstkontroll-Schleife (Pflicht).** Nach *jeder* Teilaufgabe:
   - Screenshots per Playwright bei **375, 768, 1280, 1440, 1920 und 2560 px** Breite erzeugen (`npx playwright screenshot` oder ein kleines Skript `scripts/shots.mjs`).
   - Die Screenshots mit dem Read-Tool **selbst anschauen**.
   - Dich selbst kritisieren: schreibe in `REVIEW.md` eine ehrliche Mängelliste (Abstände, Ausrichtung, Kontrast, Zeilenlängen, Waisenkinder/Witwen im Text, inkonsistente Radien/Schatten/Border-Stärken, tote Flächen, Sprünge im Grid).
   - Fixen. Erneut screenshotten. **Wiederholen, bis deine eigene Mängelliste leer ist.** Mindestens 3 Runden pro Phase, auch wenn du meinst, es passt schon.
3. **Konsistenz ist das oberste Ziel.** Es darf nirgends aussehen, als hätten zwei verschiedene Leute gebaut. Ein Design-System, ein Satz Tokens, eine Komponentenbibliothek — keine Einzellösungen in einzelnen Views.
4. **Keine Rückfragen bei Kleinigkeiten.** Triff begründete Entscheidungen, dokumentiere sie in `DECISIONS.md`. Frag nur, wenn es um Zugangsdaten/API-Keys oder um echte Geschäftslogik geht.
5. **Fortschritt dokumentieren** in `PROGRESS.md`: was fertig, was offen, was blockiert.
6. **Definition of Done pro Phase:** funktioniert im Browser · sieht auf allen 6 Breakpoints korrekt aus · keine Console-Errors · keine a11y-Violations (axe) · Lighthouse Performance & Accessibility ≥ 95 · in `PROGRESS.md` abgehakt.

---

## 1. DESIGN-DIREKTION: POP-ART / COMIC (verbindlich)

Die neuen Design-Referenzen geben die Richtung vor: **Pop-Art / Comic-Ästhetik mit Halftone-Rastern, harten schwarzen Konturen, Offset-Schatten und Starbursts** — aber diszipliniert eingesetzt, nicht als Deko-Chaos.

### 1.1 Farbtokens (in `tokens.css` als CSS-Custom-Properties, nirgends Hardcoding)

\`\`\`css
:root {
  /* Brand */
  --c-magenta:      #E6007E;   /* Primär, CTA, Akzent */
  --c-magenta-dark: #C00069;
  --c-teal:         #00A5A5;   /* Sekundär */
  --c-teal-dark:    #00807F;
  --c-yellow:       #FFCE00;   /* Highlight, Badges, Starbursts */
  --c-ink:          #0E0E0E;   /* Konturen, Text */
  --c-paper:        #FBF7EF;   /* Warmes Off-White, Seitenhintergrund */
  --c-surface:      #FFFFFF;   /* Karten */
  --c-muted:        #6B6B6B;

  /* Comic-Primitives */
  --border-comic:   2.5px solid var(--c-ink);
  --shadow-comic:   4px 4px 0 var(--c-ink);
  --shadow-comic-l: 6px 6px 0 var(--c-ink);
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 20px;
}
\`\`\`

Farbwerte bitte gegen die Referenz-Screenshots gegenchecken und ggf. exakt anpassen. **Vier Farben plus Schwarz/Papier — mehr nicht.** Keine Grauverläufe, keine weichen Blur-Schatten (außer optional 1 dezenter Ambient-Schatten für Overlays).

### 1.2 Typografie

- **Headlines:** schwere, leicht kondensierte Grotesk in **Versalien** (`Archivo Black`, `Anton` oder `Bebas Neue` — wähle die, die den Referenzen am nächsten kommt), `letter-spacing: -0.01em`, `line-height: 0.95–1.05`.
- **Body:** `Inter` oder `Source Sans 3`, 15–16 px, `line-height: 1.55`, max. **68 Zeichen** Zeilenlänge.
- Nur **3 Schriftgrade** pro View. Fluid via `clamp()`, z. B. H1: `clamp(2rem, 1.2rem + 2.4vw, 3.75rem)`.
- Keyword-Highlight wie im Design: „Online-**Marketing-Welt**" in Magenta mit handgezeichneter Wellen-Unterstreichung (SVG, kein Border).

### 1.3 Komponenten-Primitives (einmal bauen, überall verwenden)

| Komponente | Regel |
|---|---|
| `<ComicCard>` | weiße Fläche, `--border-comic`, `--shadow-comic`, Hover: `translate(-2px,-2px)` + `--shadow-comic-l`, 150 ms |
| `<ComicButton>` | Magenta-Fill, schwarze Kontur, Offset-Schatten, Active: Schatten auf 0 + `translate(2px,2px)` („Knopf gedrückt") |
| `<Badge>` | Gelb oder Teal, schwarze Kontur, Versalien, 11 px |
| `<SectionHeader>` | Versalien-Headline + Ergebnis-Badge, überall identisch |
| `<SpeechBubble>` | Comic-Sprechblase mit Tail, für Maskottchen & Hero |
| `<Halftone>` | wiederverwendbares SVG-Pattern (Punktraster) als Hintergrund-Layer |
| `<Starburst>` | SVG-Zackenstern, nur als Akzent, **max. 2 pro Viewport** |

**Verbot:** keine dünnen 1-px-Outline-Icons mehr im Comic-Kontext. Alle Icons in einem Stil (Filled/Duotone mit schwarzer Kontur). Kategorie-Icons der News-Karten wie in der Referenz: farbige Kachel + schwarze Kontur + Symbol.

### 1.4 Motion

Dezent und einheitlich: 120–200 ms, `cubic-bezier(.2,.8,.2,1)`. Karten-Hover, Button-Press, Sidebar-Aktivzustand, Maskottchen-Idle. `prefers-reduced-motion` respektieren.

---

## 2. LAYOUT & RESPONSIVENESS (aktuell größtes Problem)

**Befund:** Auf großen Bildschirmen bleibt rechts/unten ein großer toter Bereich, das Layout ist offenbar auf eine feste Breite ausgelegt. Das muss weg.

**Zu tun:**

1. **Kein `max-width` mit unbenutztem Rest.** App-Shell = `display: grid; grid-template-columns: var(--sidebar-w) minmax(0, 1fr);`, Höhe `100dvh`, der Content-Bereich scrollt intern.
2. **Fluid Content-Container:** `width: min(100% - 2*var(--gutter), 1680px); margin-inline: auto;` — ab 1920 px darf der Inhalt bis 1680 px atmen, statt bei 1100 px zu enden. Gutter fluid: `clamp(16px, 2.5vw, 48px)`.
3. **News-Grid:** `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))` → automatisch 2/3/4 Spalten auf 1280/1600/2200 px. Rechte Spalte (Termine / Zuletzt angesehen) ab ≥1440 px als sticky Sidebar, darunter unter das Grid geschoben.
4. **Breakpoints testen:** 375 / 768 / 1024 / 1280 / 1440 / 1920 / 2560. Auf 2560 px darf **kein** leerer Block > 15 % der Viewportbreite entstehen.
5. **Zoom-Test:** 200 % Browser-Zoom darf nichts abschneiden.
6. Alle festen `px`-Höhen entfernen; Karten in einer Reihe gleich hoch via Grid, nicht via JS.

---

## 3. KONKRETE BUGS & KLEIN-FIXES

1. **Sidebar-Footer (User-Chip `a.tschirschwitz@sowespoke.com`) scrollt nicht mit / wird abgeschnitten.**
   Fix: Sidebar = eigener Flex-Container mit `height: 100dvh`, Navigation `flex: 1; overflow-y: auto`, User-Chip `margin-top: auto; flex-shrink: 0` — bleibt immer sichtbar unten, unabhängig vom Scrollstand des Contents. Auf Mobile: als Bottom-Sheet/Drawer.
2. **Vorlagen → Best Practices: die „Search Experiments"-Karte ist viel zu groß.**
   Fix: Karten-Body auf **4 Zeilen** clampen (`-webkit-line-clamp: 4`), darunter „Mehr anzeigen →" das ein Detail-Panel/Modal öffnet. Karten in einer Reihe immer gleich hoch. Lange Fließtexte im Modal sauber typografiert (Absätze, nummerierte Listen, Quellen-Fußzeile).
3. **Megafon-Icon im Hero:** die aktuelle dünne Linien-Illustration passt nicht.
   Fix: ersetzen durch die **Pop-Art-Version aus den Referenzen** — Megafon mit schwarzer Kontur, Halftone-Raster, gelbem Starburst dahinter, Magenta-Fläche, plus Comic-Sprechblase „WISSEN. WEITERGEBEN. ERFOLG. VEREINFACHEN." Als **SVG** bauen (nicht als Raster-Bild), damit es auf jeder Auflösung scharf ist und mit den Tokens eingefärbt werden kann.
4. **Hero-Höhe:** aktuell zu luftig bei wenig Inhalt. Hero `min-height: clamp(220px, 26vh, 340px)`, Illustration rechts vertikal zentriert, auf < 900 px ausblenden bzw. verkleinern.
5. **„LIVE UPDATES"-Badge:** in Teal/Gelb mit Kontur, mit dezentem Puls-Punkt.

---

## 4. MASKOTTCHEN „SPARK" (entschieden — die Katze bitte ersetzen)

Die Katzen-/Fuchs-Figur aus den Referenzen entfällt. Stattdessen: eine **eigene, abstrakt-geometrische Figur** — das wirkt hochwertiger, ist markentypisch statt Clipart und lässt sich sauber animieren.

- **Name:** `SPARK`.
- **Form:** ein **abgerundetes Quadrat („Squircle") in Magenta** (`--c-magenta`), schwarze Kontur (`--border-comic`) und Offset-Schatten (`--shadow-comic`) — visuell exakt dieselbe Sprache wie die Karten und Buttons, dadurch wirkt es wie ein Teil des Systems und nicht wie ein aufgeklebter Sticker.
- **Gesicht:** minimal — zwei Augen, kein Mund oder nur eine schlichte Linie. Die gesamte Ausdruckskraft kommt aus **Augenform + Körperbewegung**, nicht aus Details. Optional als einziges Extra: ein kleiner gelber Blitz/Funke als „Antenne" oben, der bei Aktivität aufleuchtet.
- **Umsetzung:** ein einziges, sauber strukturiertes **SVG mit benannten Gruppen** (`#body`, `#eye-l`, `#eye-r`, `#spark`, `#shadow`), gesteuert über eine CSS-Klasse `.spark--<state>`. Keine Bilddateien, kein Lottie, kein Video.
- **Zustände (CSS-Keyframes, je 120–400 ms, alle mit `prefers-reduced-motion`-Fallback):**

  | State | Auslöser | Animation |
  |---|---|---|
  | `idle` | Default | leichtes Auf-/Ab-Schweben (2 px, 3 s), Blinzeln alle 5–8 s |
  | `wave` | erster Seitenaufruf pro Session | kurzes Kippen ±8° + Funke blitzt |
  | `curious` | neuer Fun Fact erscheint | Augen weiten sich, Körper neigt sich zur Sprechblase |
  | `thinking` | Chatbot generiert Antwort | Augen wandern, Funke pulsiert, „…" in der Blase |
  | `celebrate` | Anfrage erfolgreich gesendet | Hüpfer + gelber Starburst dahinter, 600 ms, einmalig |
  | `empty` | leere Suchergebnisse / Fehler | Augen schauen zur Seite, Körper leicht gekippt |

- **Platzierung:** fixiert unten rechts, **verankert an der Comic-Sprechblase** (Fun Facts, Abschnitt 5). Auf < 768 px: eingeklappt zu einem runden Button, Blase öffnet auf Tap.
- **Nicht nervig:** Blase schließbar, Zustand in `localStorage` gemerkt; SPARK bleibt dann als kleiner Button bestehen.
- **Doppelnutzung (wichtig):** derselbe SPARK ist das **Avatar des Chatbots** (Abschnitt 6) und die Figur in allen **Empty-/Error-States** (Abschnitt 11). Dadurch ist die Maskottchen-Figur funktional statt dekorativ und taucht überall im Produkt in derselben Sprache auf.
- **Varianten liefern:** `spark-32`, `spark-64`, `spark-160` (Strichstärke optisch angeglichen, nicht einfach skaliert) sowie eine Favicon-Ableitung.

---

## 5. FUN FACTS — nur Online-Marketing, häufiger, nie doppelt

Aktuell erscheinen allgemeine Trivia (Giraffen, Sansibar-Krieg). **Bitte ausschließlich Online-Marketing-/Digital-Advertising-Fakten.**

**Anforderungen:**

1. Datenquelle: `data/funfacts.json` mit **mindestens 150 Einträgen**, Schema:
   \`\`\`json
   { "id": "ff-001", "text": "…", "category": "Microsoft Ads|Google|Meta|KI|SEO|CRO|Allgemein",
     "source": "…", "sourceUrl": "https://…", "addedAt": "2026-08-10" }
   \`\`\`
2. **Keine Wiederholung:** gezeigte IDs in `localStorage` merken; erst wenn der Pool durch ist, wird zurückgesetzt. Zusätzlich Gewichtung: zuletzt hinzugefügte Fakten häufiger zeigen.
3. **Automatische Aktualisierung:** Skript `scripts/generate-funfacts.mjs`, das aus den vorhandenen News-/RSS-Quellen (Microsoft Advertising Blog, Search Engine Land, Search Engine Roundtable) neue Kurz-Fakten ableitet und in die JSON schreibt, mit Quellenangabe. Als npm-Script + optional Cron/GitHub Action wöchentlich.
4. **Rotation im UI:** automatischer Wechsel alle 25 s (pausiert bei Hover), Button „NOCH EIN FAKT →" für manuellen Wechsel, kleine Quellenzeile unter dem Fakt (klickbar).
5. Fakten immer **≤ 200 Zeichen**, ohne Marketing-Floskeln, konkret und mit Zahl wenn möglich.

---

## 6. CHATBOT (RAG über eigene Dateien + offizielle Microsoft-Hilfe)

Neue Kernfunktion. Nutzer sollen fragen können: *„Wie richte ich ein Search Experiment mit AI Max ein?"* oder *„Haben wir eine Folie zu Bulk Editing?"* — und eine belegte Antwort bekommen.

**Architektur (bitte so oder begründet besser):**

- **Ingestion-Pipeline** `scripts/ingest.mjs`: liest `content/` (`.md`, `.docx`, `.pptx`, `.pdf`, `.html`) → Text + Metadaten extrahieren (`mammoth` für docx, `pptx-parser`/`python-pptx` für pptx, `pdf-parse` für pdf) → Chunking ~800 Tokens mit 15 % Overlap, Chunk behält `{source, title, page/slide, category}`.
- **Embeddings + Vektorstore:** lokal via `@xenova/transformers` (`bge-m3` / `multilingual-e5`) oder API-Embeddings; Store: **SQLite mit `sqlite-vec`** oder LanceDB. Läuft komplett lokal, keine Cloud-Pflicht.
- **Retrieval:** Hybrid (BM25 + Vektor), Reranking, Top-6 Chunks.
- **Antwort:** LLM-Call mit striktem System-Prompt: *nur aus dem Kontext antworten, Sprache = Sprache der Frage, immer Quellen als klickbare Chips („Präsentation X, Folie 12"), bei fehlender Deckung ehrlich sagen „dazu finde ich nichts" und die nächstbeste Quelle vorschlagen.*
- **Zweite Quelle: offizielle Microsoft-Doku.** Bitte den **offiziellen Microsoft-Learn-MCP-Server** (`https://learn.microsoft.com/api/mcp`) anbinden bzw. alternativ `learn.microsoft.com` + `help.ads.microsoft.com` über deren Sitemaps indexieren. Antworten kennzeichnen, ob die Info aus **internem Wissen** oder aus **offizieller MS-Doku** stammt (zwei verschiedene Quellen-Chip-Farben: Teal = intern, Magenta = Microsoft).
- **UI:** SPARK-Avatar, Comic-Sprechblasen-Design, Streaming-Antwort, vorgeschlagene Startfragen, Verlauf pro Nutzer, „In neuer Seite öffnen"-Vollansicht, Tastatur-Shortcut `⌘/Strg + K`.
- **Guardrails:** keine erfundenen Zahlen, keine Empfehlungen ohne Quelle, Token-Limit, Rate-Limit.

---

## 7. CASE STUDIES — echte Analystenqualität

Neue Case-Study-Einträge mit **Beispieldaten aus einem Microsoft-Ads-Konto**, die zeigen, wie sich die Performance nach einer Implementierung (z. B. **AI Max**) verändert hat. Daten klar als **„Beispieldaten / Demo"** kennzeichnen.

**Pro Case Study:**

- Kopf: Branche, Kontogröße, Zeitraum, implementierte Maßnahme, Ziel-KPI.
- **KPI-Kacheln** (Vorher / Nachher / Δ %): Impressions, Clicks, CTR, Ø CPC, Conversions, CPA, ROAS, Conversion-Rate, Impression Share, Ausgaben.
- **Charts** (Recharts oder Chart.js, im Comic-Stil gethemt — schwarze Achsen, Farben aus den Tokens, klare Labels, kein 3D, keine Torten mit 8 Segmenten):
  1. **Zeitreihe** ROAS & CPA mit vertikaler Marker-Linie „AI Max aktiviert" + schattiertem Vorher/Nachher-Bereich
  2. **Vorher/Nachher-Balken** je KPI mit Δ-Beschriftung
  3. **Waterfall**: woher kommt der Conversion-Zuwachs (neue Suchbegriffe / bessere Assets / höhere IS)
  4. **Scatter** Kampagnen: CPA vs. Conversions, Punktgröße = Spend, Farbe = Test/Kontrolle
  5. **Uplift mit Konfidenzintervall** (Experiment-Scorecard-Logik: Kontroll- vs. Treatment-Kampagne, Signifikanz-Hinweis)
  6. **Search-Term-Zuwachs**: Anteil neuer, vorher nicht abgedeckter Queries
- **Narrativ:** Ausgangslage → Hypothese → Setup (Traffic-Split 50/50, Cookie-basiert, Laufzeit 4 Wochen) → Ergebnis → Learnings → Handlungsempfehlung. Kurz, faktenbasiert, keine Werbesprache.
- **Export:** „Als PDF exportieren" und „Charts als PNG" — für Kundentermine.
- Vergleichsansicht: mehrere Case Studies nebeneinander filtern nach Branche/Maßnahme.

**Datenmodell:** `data/case-studies/*.json` mit Tages-Zeitreihe, damit Charts echt gerechnet und nicht hardcodiert sind.

### 7.1 Anbindung echter Microsoft-Ads-Konten (bitte als `docs/INTEGRATION-MSADS.md` dokumentieren + Adapter vorbereiten)

- **Offizieller Weg:** Microsoft Advertising API (Bing Ads API v13). Benötigt: App-Registrierung in **Microsoft Entra ID** (Client-ID + Secret, Redirect-URI), **Developer Token** aus dem MS-Ads-Konto, OAuth-2.0-Refresh-Token, `CustomerId` + `AccountId`.
- **Datenfluss:** nächtlicher ETL-Job → Reporting API (`CampaignPerformanceReport`, `SearchQueryPerformanceReport`) → lokale DB (SQLite/Postgres) → Frontend liest aus der DB, nie live aus der API.
- **Zwischenlösung ohne Freigabe:** Upload von CSV/XLSX-Reports aus der MS-Ads-Oberfläche; Parser mappt auf dasselbe Datenmodell wie die API. **Bitte diesen Upload-Weg jetzt schon bauen** — dann funktioniert das Feature sofort, und der API-Adapter kann später eingehängt werden.
- Architektur so bauen, dass `MSAdsDataSource` ein Interface ist mit den Implementierungen `MockSource`, `FileUploadSource`, `ApiSource`.

---

## 8. NEUE UNTERKATEGORIE: TICKETS (Zoho)

Neuer Menüpunkt in der Sidebar, gleiche Design-Sprache.

**Funktionsumfang:**

- **„Meine Tickets"** als Default-Ansicht — gefiltert nach dem eingeloggten Nutzer (Mapping über die E-Mail-Adresse auf die Zoho-Agent-ID).
- Tabs: **Neu / In Bearbeitung / Wartet auf Kunde / Erledigt** + Zeitraumfilter.
- Ticket-Karte: ID, Betreff, Kunde/Konto, Priorität, Kategorie, Status, Fälligkeit, Alter, letzter Kommentar, Direktlink nach Zoho.
- **Dashboard oben:** offene Tickets gesamt, neu heute/diese Woche, Ø Erstreaktionszeit, Ø Lösungszeit, SLA-Verletzungen, Verteilung nach Kategorie, Verlauf der letzten 30 Tage, Team-Vergleich (fair und sachlich, kein Ranking-Pranger).
- Benachrichtigung: Badge in der Sidebar mit Anzahl neuer, noch nicht angesehener Tickets.

**Zoho-Anbindung (in `docs/INTEGRATION-ZOHO.md` dokumentieren):**

- **Zoho Desk REST API v1.** OAuth 2.0 über **Self-Client** in der Zoho API Console: `client_id`, `client_secret`, Refresh-Token, `orgId` im Header (`orgId: <ID>`).
- Scopes: `Desk.tickets.READ`, `Desk.basic.READ`, `Desk.search.READ` (Schreibrechte nur, falls später Statusänderungen aus dem Portal möglich sein sollen).
- Endpunkte: `GET /api/v1/tickets` (Filter `assigneeId`, `status`, `departmentId`, Sortierung, Pagination), `GET /api/v1/tickets/{id}/conversations`, `GET /api/v1/agents`.
- Region beachten: `desk.zoho.eu` vs `desk.zoho.com`.
- **Live-Updates:** Zoho-Webhooks auf einen App-Endpunkt (`/api/zoho/webhook`) für neue/aktualisierte Tickets; Fallback: Polling alle 5 Minuten mit Caching.
- **Jetzt bauen:** vollständige Mock-Daten (`data/tickets.mock.json`, ~120 realistische Tickets über 3 Monate, 6 Agents) hinter demselben `TicketSource`-Interface, sodass ein Umschalten auf die echte API nur eine Konfigurationszeile ist.

---

## 9. WISSENSDATENBANK — Artikel einbinden

Die vorhandenen Artikel sollen als eigener, durchsuchbarer Bereich rein **und** den Chatbot füttern.

**Bitte lege den Ordner `content/wissensdatenbank/` an und schreibe eine `content/README.md`, die erklärt, wie Artikel geliefert werden müssen:**

- **Bevorzugt:** eine Markdown-Datei pro Artikel mit Frontmatter:
  \`\`\`yaml
  ---
  title: "Bulk Editing in Microsoft Advertising"
  category: "Microsoft Ads"
  tags: [bulk, kampagnen, editor]
  audience: "intern"
  updated: 2026-08-10
  author: "…"
  ---
  \`\`\`
- **Ebenfalls akzeptiert:** `.docx`, `.pdf`, `.html`, oder ein CSV-Export (`title,category,tags,updated,body_html`) aus dem bestehenden System — die Ingestion-Pipeline (Abschnitt 6) konvertiert automatisch nach Markdown und legt Bilder in `content/assets/` ab.
- Baue einen **Import-Befehl** `npm run import:kb -- ./pfad/zum/export`, der Duplikate erkennt, Frontmatter ergänzt (Kategorie raten + zur Bestätigung ausgeben) und ein Import-Protokoll schreibt.
- UI: Artikel-Übersicht mit Kategoriefilter + Volltextsuche, Artikelansicht mit Inhaltsverzeichnis, „Zuletzt aktualisiert", verwandte Artikel, „Diese Antwort im Chat vertiefen"-Button.

---

## 10. ANFRAGEN — neu strukturieren + E-Mail-Versand

**Problem:** aktuell unübersichtlich.

**Neu:**

1. **Drei Unterkategorien** als klar sichtbare Auswahl (Karten oder Segmented Control, nicht als versteckter Dropdown):
   - **Betas**
   - **Bulk Team**
   - **SAP ID**
2. Jede Kategorie hat ein **eigenes, kurzes Formular** mit nur den wirklich nötigen Feldern, inline validiert, mit Beispiel-Platzhaltern und Hilfetexten. Pflichtfelder markiert, Fehler in Klartext.
3. **Zwischenspeichern** im `localStorage` (Formular geht bei Reload nicht verloren) + „Anfrage-Verlauf" (welche Anfragen habe ich wann gestellt).
4. **E-Mail-Versand über Gmail**, Empfänger **fest hinterlegt** (eine Konstante in `config/recipients.ts`, pro Kategorie konfigurierbar):
   - **Empfohlen:** Gmail API mit OAuth 2.0 (`https://www.googleapis.com/auth/gmail.send`), Versand im Namen des eingeloggten Nutzers, Betreffzeilen-Schema `[SPOKE][Betas] <Kurzbeschreibung> – <Kunde/Konto>`, HTML-Body aus einem Template pro Kategorie, Kopie an den Absender.
   - **Sofort-Fallback ohne OAuth:** `mailto:`-Link mit vorbefülltem Betreff/Body — funktioniert am Tag 1, wird später ersetzt.
   - Nach Versand: Bestätigung mit SPARK im `celebrate`-Zustand + Kopie im Anfrage-Verlauf.
5. Kein Formular länger als ein Bildschirm ohne Scrollen auf 1280 px.

---

## 11. TESTEN — alle bestehenden Funktionen prüfen

Bitte **jede** vorhandene Funktion einmal manuell durchklicken (Playwright) und dokumentieren, was kaputt ist, bevor du Neues baust:

- Alle Sidebar-Punkte: News, Präsentationen, Vorlagen, Case Studies, Microsoft Learn, Anfragen (+ neu: Tickets, Wissensdatenbank, Chat)
- Suche: leer, 1 Zeichen, Umlaute, Sonderzeichen, keine Treffer, sehr viele Treffer
- Alle Kategorie-Filter einzeln + Kombinationen, Filter-Reset
- Kachel- vs. Listenansicht, „Weitere Beiträge laden", Scroll-Position nach dem Laden
- Externe Links (öffnen in neuem Tab, `rel="noopener"`), tote Links
- „Zuletzt angesehen" / Verlauf, „Alle Termine ansehen"
- Tastaturbedienung komplett (Tab-Reihenfolge, Fokus-Ringe sichtbar, Esc schließt Modals), Screenreader-Labels
- Fehlerzustände: kein Netz, leere Datenquelle, langsame Antwort → jeweils ein gestalteter Empty-/Error-State im Comic-Stil (SPARK mit passendem Ausdruck), niemals eine leere weiße Fläche

**Automatisierte Tests anlegen:** Vitest für Utils/Parser, Playwright-E2E für die 8 wichtigsten User-Flows, `axe-core` für a11y, Lighthouse-CI. `npm test` muss grün sein.

---

## 12. SKILLS / TOOLS, DIE DU AKTIVIEREN SOLLTEST

- **Playwright** für Screenshots, E2E und die visuelle Selbstkontrolle (Kern deiner Schleife).
- **Chrome DevTools / Browser-MCP** für Console-, Network- und Performance-Prüfung.
- **Microsoft Learn MCP** (`https://learn.microsoft.com/api/mcp`) als offizielle Doku-Quelle für den Chatbot.
- **axe-core / Lighthouse CI** für Accessibility und Performance.
- Lege ein **`CLAUDE.md`** im Repo an (Projektstruktur, Design-Tokens, Namenskonventionen, Befehle) — damit bleibt jede weitere Session konsistent.
- Lege eine eigene **Skill/Checkliste `design-review`** an, die du nach jeder Phase gegen die Screenshots durchgehst (Grid-Ausrichtung, Abstände aus der 8-px-Skala, Kontrast ≥ 4.5:1, einheitliche Radien/Schatten/Konturstärken, Zeilenlänge, Zustände hover/focus/active/disabled/loading/empty/error vollständig).

---

## 13. REIHENFOLGE

1. Bestandsaufnahme + Bug-Liste (Abschnitt 11) → `REVIEW.md`
2. Design-System & Tokens (1) — alles andere baut darauf auf
3. Layout & Responsiveness (2) + Bugfixes (3)
4. Maskottchen SPARK (4) + Fun Facts (5) — die bisherige Katzen-Figur dabei vollständig entfernen
5. Anfragen-Umbau + Gmail (10)
6. Vorlagen/Best-Practices-Karten (3.2) und Wissensdatenbank-Struktur (9)
7. Case Studies inkl. Charts (7)
8. Tickets mit Mock-Daten (8)
9. Chatbot/RAG (6)
10. Volle Testrunde + Lighthouse + finale Screenshot-Review-Schleife

Nach jeder Nummer: Screenshots, Selbstkritik in `REVIEW.md`, nachbessern, erst dann weiter. **Am Ende: ein kurzer Bericht, was gebaut wurde, was noch Zugangsdaten braucht (MS Ads, Zoho, Gmail, LLM-Key) und welche drei Dinge du als Nächstes verbessern würdest.**
```

---

## Einordnung: Was davon passt zum bestehenden Projekt, was nicht

**Passt / ist ohnehin schon in Arbeit:**
- Abschnitt 2 (Layout/Responsiveness) und 3.1/3.2 (Sidebar-Footer-Bug, überlange Best-Practices-Karte) — echte, konkrete Bugs, teils bereits behoben (siehe `DESIGN.md`-Einträge vom 2026-08-10).
- Grundidee "konsistentes Design-System, nicht pro Seite neu erfinden" — deckt sich mit dem, was `DESIGN.md` die ganze Session über bereits war.

**Widerspricht bereits getroffenen, mit dir abgestimmten Entscheidungen:**
- **Maskottchen "SPARK"** ersetzt die Fuchs-Figur "PIX", die über mehrere Runden dieser Session bewusst mit dir entwickelt wurde (Brille, Marken-Farben, mehrfach verfeinert).
- **Gmail-API mit `gmail.send`-Scope** für Anfragen — genau der Ansatz (erweiterter OAuth-Scope, serverseitig gespeicherte Tokens), den du beim Mail-Generator explizit **abgelehnt** hast zugunsten des einfacheren Compose-Link-Wegs.
- **Build-Tooling** (`npm run dev`, Vitest, Bundler) — das Projekt ist bewusst build-los (siehe `CLAUDE.md`: "Reines statisches HTML/CSS/JS, kein Build-Prozess").
- **Neues Farbsystem** — eigene Werte statt der bereits abgestimmten `DESIGN.md`-Palette.

**Braucht Zugangsdaten/Ressourcen, die aktuell nicht vorhanden sind:**
- Microsoft Advertising API (Entra-ID-App, Developer Token) für Abschnitt 7.1.
- Zoho Desk API (Self-Client, Org-ID) für Abschnitt 8.
- Ein funktionierender, bezahlter LLM-API-Key für den RAG-Chatbot (Abschnitt 6) — aktuell pausiert, siehe `PRODUCT.md` zur Gemini-Übersetzung.

Nichts davon ist "falsch" — es ist ein ambitionierter, in sich schlüssiger Entwurf für einen deutlich größeren Umbau. Aber bevor daraus etwas umgesetzt wird, braucht es eine bewusste Entscheidung, welche Teile davon wirklich gewollt sind.
