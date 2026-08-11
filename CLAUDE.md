# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Internes Wissenszentrum für Online-Marketing-News, Beta-Funktionen und Kunden-E-Mail-Teaser ("Sowespoke Wissenszentrum"). Vollständiger Produktkontext steht in [PRODUCT.md](PRODUCT.md).

## Befehle

Kein Build-Prozess, kein Bundler, kein Test-Framework — es gibt daher keine `npm run build`/`test`/`lint`-Befehle.

- **Lokal ansehen (ohne Login/echte Cloudflare Functions):** `node tools/local-preview-server.mjs [port]` (Default-Port `5511`). Serviert die statische Seite direkt aus dem Repo-Root, liefert feste Mock-Daten für `/api/news` und `/api/learn`, SPA-Fallback auf `index.html`. Kein Ersatz für `wrangler pages dev` — dient ausschließlich visuellen Selbsttests (Screenshots) vor einem Push, siehe [WORKFLOW.md](WORKFLOW.md).
- **Syntax-Check nach JS-Änderungen:** `node --check <datei>.js` (z. B. `node --check app.js`). CSS wird per Klammerbalance geprüft, siehe `WORKFLOW.md`.
- **Deploy:** automatisch über Cloudflare Pages bei Push auf `main` (Git-Integration, kein manueller Deploy-Schritt).

## Architektur

**Statisches Multi-File-Frontend ohne Module/Bundler.** `index.html` lädt alle Skripte per `<script src="…">` in fester Reihenfolge (Datendateien → `icons.js` → `app.js`); jede Datei definiert Top-Level-`const`s, die als globale Bezeichner im nächsten Skript verfügbar sind — kein `import`/`export`. Eine neue Datenquelle braucht daher immer beides: die neue `.js`-Datei UND einen `<script>`-Tag in `index.html` **vor** `app.js`.

- **`app.js`** ist eine einzelne IIFE und enthält praktisch die ganze App: Hash-Router (`render()`, am Dateiende, mappt `location.hash` auf `renderX(...)`-Funktionen), sowie für jede Seite ein `renderX(query, filter)` (baut HTML-String, schreibt in `#view`) + `wireX()` (hängt danach Event-Listener an die frisch eingefügten DOM-Knoten). Neue Seiten folgen diesem Muster und werden in `render()` verdrahtet.
- **Datendateien** (`data.js`, `presentations-data.js`, `case-studies-data.js`, `microsoft-requests-data.js`, `calendar-events.js`, `fun-facts.js`) sind reine Konstanten/Arrays, von `app.js` konsumiert. Mock-/Platzhalter-Einträge sind mit `isPlaceholder: true` markiert statt sie von echten Daten optisch ununterscheidbar zu machen.
- **`icons.js`** enthält alle Icons/Illustrationen als Template-String-SVGs (`ICONS.name`, plus größere Kompositionen wie `HERO_ILLUSTRATION`, `MASCOT_SVG`). Farben darin referenzieren CSS-Variablen (`fill="var(--accent)"`), keine hartkodierten Hex-Werte — Ausnahme siehe Tokens unten.
- **Styling-Schichten**, in dieser Ladereihenfolge: `tokens.css` (**einziger Ort mit Hex-Farb-Literalen**, primitive `--c-*`-Tokens, Herkunft/Quellen dort dokumentiert) → `assets/fonts/fonts.css` (self-hosted `@font-face`, kein externes CDN) → `styles.css` (Komponenten, referenzieren ausschließlich `var(--c-*)`/semantische Alias-Tokens aus `tokens.css`, nie eigene Hex-Werte). Einzige bewusste Ausnahme: die exportierte E-Mail-Signatur in `app.js` (`renderMailGen`) läuft im Gmail-Compose-Fenster ohne Zugriff auf dieses CSS und trägt deshalb portable Literal-Werte.
- **Backend** ist minimal — Cloudflare Pages Functions unter `functions/`: `/api/news` (aggregiert externe RSS-Feeds serverseitig wegen CORS, optionale Gemini-Übersetzung EN→DE bei gesetztem `GEMINI_API_KEY`), `/api/learn`, `/api/rate`, `/api/auth/*` (Google OAuth). `functions/_middleware.js` läuft vor jedem Request (Seiten UND `/api/*`) und erzwingt eine gültige Session (Redirect zu `/login` bzw. 401), außer für in `PUBLIC_EXACT_PATHS`/`isPublicPath()` gelistete Pfade. Zugriff ist serverseitig auf `@sowespoke.com`/`@sowespoke.de`-Google-Konten beschränkt, erfordert die Secrets `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (optional `GEMINI_API_KEY`). Kein Passwort-Speicher, keine Datenbank.

## Design-Vorgabe: kein AI-Slop

Diese Website darf **nicht** wie generischer, austauschbarer AI-generierter Standard-Look aussehen (immer gleiches Blau/Lila-Gradient, immer gleiche Card-Grids, immer gleiche generische Icons, immer gleiche Standard-Schriftpaarung). Stattdessen gilt für jede Design- und UI-Arbeit an diesem Projekt:

- **Verbindlicher Ablauf für jede Design-Arbeit und jede neue Funktion, ausnahmslos: siehe [WORKFLOW.md](WORKFLOW.md).** Kurzfassung: `impeccable`- und `ui-ux-pro-max`-Skill vor dem Bauen konsultieren → nach dem Bauen `/impeccable audit`/`critique` → Funde beheben → **mit echtem Browser-Screenshot selbst gegenprüfen** (lokaler Vorschau-Server, s. o.) → in `DESIGN.md` dokumentieren → committen.
- Bestehende `DESIGN.md` ist die visuelle Autorität — Farben, Typografie, Ton, Komponenten von dort übernehmen, nicht neu erfinden.
- Vor dem Abschluss einer neuen Oberfläche: `/impeccable polish` für den finalen Feinschliff.
- Der Ton der Site ist intern/funktional (Mode: **Operate**/**Read** — Mitarbeitende sollen schnell Informationen finden, nicht überzeugt oder unterhalten werden). Klarheit und Durchsuchbarkeit haben Vorrang vor Show-Effekten.

## Sprache

Antworten und Kommentare in diesem Projekt auf Deutsch.
