# Sowespoke — Projektkontext für Claude

Internes Wissenszentrum für Online-Marketing-News, Beta-Funktionen und Kunden-E-Mail-Teaser. Vollständiger Produktkontext steht in [PRODUCT.md](PRODUCT.md).

## Design-Vorgabe: kein AI-Slop

Diese Website darf **nicht** wie generischer, austauschbarer AI-generierter Standard-Look aussehen (immer gleiches Blau/Lila-Gradient, immer gleiche Card-Grids, immer gleiche generische Icons, immer gleiche Standard-Schriftpaarung). Stattdessen gilt für jede Design- und UI-Arbeit an diesem Projekt:

- **Verbindlicher Ablauf für jede Design-Arbeit und jede neue Funktion, ausnahmslos: siehe [WORKFLOW.md](WORKFLOW.md).** Kurzfassung: `impeccable`- und `ui-ux-pro-max`-Skill vor dem Bauen konsultieren → nach dem Bauen `/impeccable audit`/`critique` → Funde beheben → **mit echtem Browser-Screenshot selbst gegenprüfen** (lokaler Vorschau-Server unter `tools/local-preview-server.mjs`, Anleitung in `WORKFLOW.md`) → in `DESIGN.md` dokumentieren → committen.
- Bestehende `DESIGN.md` ist die visuelle Autorität — Farben, Typografie, Ton, Komponenten von dort übernehmen, nicht neu erfinden.
- Vor dem Abschluss einer neuen Oberfläche: `/impeccable polish` für den finalen Feinschliff.
- Der Ton der Site ist intern/funktional (Mode: **Operate**/**Read** — Mitarbeitende sollen schnell Informationen finden, nicht überzeugt oder unterhalten werden). Klarheit und Durchsuchbarkeit haben Vorrang vor Show-Effekten.

## Stack

Reines statisches HTML/CSS/JS, kein Build-Prozess. Deploy über Cloudflare Pages (Git-Integration, automatischer Deploy bei Push auf `main`). Leichtes Backend über Cloudflare Pages Functions (`functions/`): `/api/learn`, `/api/news`, `/api/rate` sowie `/api/auth/*` fürs Login. Zugriff auf die gesamte Seite ist über `functions/_middleware.js` auf `@sowespoke.com`/`@sowespoke.de`-Google-Konten beschränkt (Login via „Mit Google anmelden", siehe `CLOUDFLARE-ACCESS-SETUP.md`). Erfordert die Secrets `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` und `SESSION_SECRET`. Kein Passwort-Speicher, keine Datenbank nötig — Google übernimmt die Identitätsprüfung.

## Sprache

Antworten und Kommentare in diesem Projekt auf Deutsch.
