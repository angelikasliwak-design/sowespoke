# Arbeitsanweisung: Design- und Feature-Workflow

Diese Datei ist bindend für **jede** sichtbare UI-Änderung und **jede** neue Funktion in diesem Projekt — unabhängig davon, ob sie klein oder groß erscheint. Sie ergänzt `CLAUDE.md` (dort steht der Verweis hierher) und `DESIGN.md` (die visuelle Autorität für Farben/Typografie/Komponenten).

## Der Pflicht-Loop

Für **jede** Design-Arbeit oder neue Funktion, in dieser Reihenfolge:

1. **Vor dem Bauen:** `impeccable`-Skill konsultieren (`/impeccable shape` bei neuen Oberflächen, `/impeccable new-work` bei einer neuen visuellen Welt) und bei Unsicherheit über Stil/Muster den `ui-ux-pro-max`-Skill zurate ziehen (Farbpaletten, Schriftpaarungen, Komponenten-Patterns — 67 Stile/161 Paletten/57 Schriftpaarungen als durchsuchbare Referenz, verhindert generische Standardlösungen).
2. **Nach dem Bauen:** `/impeccable audit` bzw. bei größeren Änderungen `/impeccable critique` — nicht nur der mechanische Detector (`detect.mjs`), sondern eine echte Bewertung nach Nielsen-Heuristiken, Kognitiv-Last-Checkliste und Persona-Durchlauf (siehe unten für den Screenshot-Selbsttest, der das erst aussagekräftig macht).
3. **Gefundene Probleme beheben** über die passenden Unterbefehle (`/impeccable layout`, `/impeccable delight`, `/impeccable clarify`, `/impeccable adapt` usw. — siehe Tabelle in der Skill-Beschreibung).
4. **Vor Abschluss:** `/impeccable polish` als finaler Feinschliff-Durchgang.
5. **Jede** dieser Runden **selbst per Screenshot verifizieren** (siehe unten) — nicht blind auf den Code vertrauen. Wenn ein Fund behoben wurde, erneut screenshotten und bestätigen, dass er wirklich weg ist, bevor der nächste Punkt angegangen wird.
6. **Dokumentieren:** jede sichtbare, bewusste Design-Entscheidung (nicht jede Zeile CSS) bekommt einen datierten Eintrag in `DESIGN.md` — Vorbild ist die "Kurskorrektur"/"Kritik-Fund"-Eintragsform, die dort bereits durchgängig verwendet wird: was war das Problem, was wurde geändert, warum.
7. **Committen und pushen** mit einer Commit-Message, die auf den zugrundeliegenden Befund/die Entscheidung verweist, nicht nur "Styling angepasst".

**Nicht überspringen, auch wenn die Änderung klein wirkt.** Genau der Maskottchen-Kollisionsbug (2026-08-10) — ein fixes Element, das strukturell eine Sidebar-Karte überlappte, unabhängig vom Seiteninhalt — wäre bei reiner Code-Betrachtung ohne echten Screenshot nicht aufgefallen.

## Screenshot-Selbsttest (verbindlich vor jedem Abschluss)

Diese Session hat entdeckt, dass ein echter Browser-Screenshot-Workflow in dieser Umgebung möglich ist — vorher wurde blind aus dem Code heraus designt. **Das ist jetzt Standard, kein Sonderfall mehr.**

### Warum nicht einfach den Live-Server nutzen

Die echte Seite hängt hinter Google-OAuth-Login (`functions/_middleware.js`), den ein automatisierter Browser nicht ohne Weiteres durchläuft. Deshalb: ein lokaler statischer Vorschau-Server, der die Cloudflare-Functions-Auth umgeht (er führt gar keine Functions aus, nur die statischen Dateien).

### Setup (einmal pro Session, ca. 1 Minute)

```bash
# 1. Lokalen Vorschau-Server starten (im Hintergrund)
cd sowespoke-repo
node tools/local-preview-server.mjs &     # Port 5511, siehe Datei für Details

# 2. Playwright-core installieren (KEIN eigener Browser-Download — das
#    scheiterte in dieser Umgebung an einem Timeout). Stattdessen einen
#    bereits installierten Browser referenzieren (auf Windows meist Edge).
mkdir -p /tmp/pw-shot && cd /tmp/pw-shot
npm init -y >/dev/null 2>&1
npm install playwright-core --no-audit --no-fund
```

### Screenshot-Skript (Beispiel, anpassen je nach Ziel-Route/Viewport)

```js
// shoot.js
const { chromium } = require("playwright-core");
async function main() {
  const browser = await chromium.launch({ channel: "msedge" }); // oder "chrome"
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:5511/#/praesentationen", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000); // Pop-in-Animationen abwarten
  await page.screenshot({ path: "screenshot.png" }); // ohne fullPage: echter Viewport-Ausschnitt
  await browser.close();
}
main();
```

```bash
node shoot.js
```

Danach den PNG-Pfad mit dem **Read-Tool** öffnen — das unterstützt Bilder direkt.

### Wichtige Lektionen aus dieser Session

- **Mindestens 3 Breakpoints prüfen:** Desktop (~1440×900, ohne Scroll — "above the fold"), sehr breiter Desktop (~1920×1000, wegen der `min-width:90rem`-Regeln im CSS), Mobile (~390×844). Ein Fund kann bei einer Breite verschwinden und bei einer anderen neu auftauchen.
- **`fullPage: true` vs. Viewport-Screenshot sind nicht dasselbe** — bei `position:fixed`-Elementen (z. B. dem Maskottchen) kann ein `fullPage`-Screenshot Artefakte zeigen, die ein echter Nutzer so nie sieht. Bei Verdacht auf ein fixes Element: **immer zusätzlich einen normalen Viewport-Screenshot ohne `fullPage`** machen, um zu bestätigen, dass ein Fund echt ist und kein Stitching-Artefakt.
- **Scroll-Zustände separat prüfen**, nicht nur den initialen Ladezustand — `page.mouse.wheel(0, 500)` vor dem Screenshot.
- **Mit echten Daten testen, nicht mit dem lokalen Fehlerzustand.** `tools/local-preview-server.mjs` liefert deshalb Mock-Daten für `/api/news`/`/api/learn` statt einfach zu 404en — eine Seite mit dem "lokal nicht verfügbar"-Hinweis ist künstlich kurz und verschleiert reale Überlappungs-/Höhenprobleme.
- **Interaktionen simulieren, nicht nur Ist-Zustände fotografieren** — `.hover()`, `.click()` vor dem Screenshot, um Hover-only-Elemente, Bestätigungs-Zustände usw. zu prüfen (siehe `row__rate`-Hover-Fix, 2026-08-10).
- Server am Ende der Session beenden (`taskkill //F //PID <pid>` auf Windows) oder laufen lassen, wenn direkt weitergearbeitet wird — er bindet nur Port 5511 lokal, kein Sicherheitsrisiko, aber sauberer aufzuräumen.

## Kritik-Historie

Jede `/impeccable critique`-Runde wird unter `.impeccable/critique/` persistiert (automatisch durch den Skill). Vor einer neuen Kritik-Runde auf derselben Oberfläche lohnt sich ein Blick dorthin, um zu sehen, was beim letzten Mal gefunden und behoben wurde.
