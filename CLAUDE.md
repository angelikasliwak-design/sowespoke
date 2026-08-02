# Sowespoke — Projektkontext für Claude

Internes Wissenszentrum für Online-Marketing-News, Beta-Funktionen und Kunden-E-Mail-Teaser. Vollständiger Produktkontext steht in [PRODUCT.md](PRODUCT.md).

## Design-Vorgabe: kein AI-Slop

Diese Website darf **nicht** wie generischer, austauschbarer AI-generierter Standard-Look aussehen (immer gleiches Blau/Lila-Gradient, immer gleiche Card-Grids, immer gleiche generische Icons, immer gleiche Standard-Schriftpaarung). Stattdessen gilt für jede Design- und UI-Arbeit an diesem Projekt:

- **Immer den `impeccable`-Skill nutzen**, bevor UI gebaut oder verändert wird (`/impeccable init` wurde bereits ausgeführt → `PRODUCT.md` existiert). Vor neuen Oberflächen `new-work`/`shape` durchlaufen, um eine bewusste visuelle Welt (`DESIGN.md`) statt eines generischen Defaults zu etablieren.
- Bestehende `DESIGN.md` (sobald vorhanden) ist die visuelle Autorität — Farben, Typografie, Ton, Komponenten von dort übernehmen, nicht neu erfinden.
- Nach jeder sichtbaren UI-Änderung: `/impeccable audit` bzw. `/impeccable critique` zur Qualitätskontrolle nutzen (Hooks sind installiert und laufen automatisch nach UI-Datei-Edits).
- Vor dem Abschluss einer neuen Oberfläche: `/impeccable polish` für den finalen Feinschliff.
- Der Ton der Site ist intern/funktional (Mode: **Operate**/**Read** — Mitarbeitende sollen schnell Informationen finden, nicht überzeugt oder unterhalten werden). Klarheit und Durchsuchbarkeit haben Vorrang vor Show-Effekten.

## Stack

Reines statisches HTML/CSS/JS, kein Build-Prozess, kein Backend. Deploy über Cloudflare Pages (Git-Integration, automatischer Deploy bei Push auf `main`).

## Sprache

Antworten und Kommentare in diesem Projekt auf Deutsch.
