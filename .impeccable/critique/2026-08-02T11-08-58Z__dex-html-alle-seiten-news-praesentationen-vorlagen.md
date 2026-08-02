---
target: alle Seiten (News, Praesentationen, Vorlagen)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-02T11-08-58Z
slug: dex-html-alle-seiten-news-praesentationen-vorlagen
---
Method: dual-agent (A: design review, ein Retry nach Stall, dann sauber abgeschlossen · B: detector + browser evidence, erster Versuch erfolgreich)

## Design Health Score

| # | Heuristik | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Live-Vorschau im Mail-Generator + "Kopiert"-Bestätigung funktionieren gut |
| 2 | Match System / Real World | 2 | Roher Template-Syntax (`{KundenName}`, `{Kontonummer}`) kann unverändert in eine echte Kundenmail durchsickern |
| 3 | User Control and Freedom | 3 | Klare Zurück-Links, Hash-Routing erlaubt Browser-Back |
| 4 | Consistency and Standards | 3 | Visuell sehr konsistent; Feldlabel "Ansprechperson" vs. Token `KundenName` ist eine kleine interne Inkonsistenz |
| 5 | Error Prevention | 1 | Kontonummer-Feld ist faktisch Pflicht, aber UI markiert/warnt nicht |
| 6 | Recognition Rather Than Recall | 3 | Icon-Sidebar hat `aria-label` + `title`, Tabs/Suche immer sichtbar |
| 7 | Flexibility and Efficiency | 2 | Keine Tastenkürzel, keine Bulk-/Recent-Funktion |
| 8 | Aesthetic and Minimalist Design | 3 | Ruhig und aufgeräumt; 17-Zeilen-Präsentationsliste am Seitenende wie eine Wand |
| 9 | Error Recovery | 1 | RSS-Fehlermeldung fest auf "lokaler Testserver" verdrahtet, keine Unterscheidung zu echtem Ausfall |
| 10 | Help and Documentation | 1 | Keine Erklärung der DocType-Tags (Beta-Feature/Feature-Guide/Sonstiges), kein Onboarding |
| **Total** | | **22/40** | **Acceptable (55%)** |

## Design Specificity Verdict

**LLM-Assessment**: Authored, nicht austauschbar — mit einem Ausreißer. Restrained-Magenta statt generischem KI-Blau/Lila-Gradient, Baloo 2 exakt auf eine Headline pro Seite begrenzt, schattenbasierte Karten ohne Rahmen, handgezeichnete Icons statt Emoji/Icon-Fonts, Editorial-Listenzeilen statt generischer Card-Grids — DESIGN.md wird sichtbar eingehalten (Small-and-Often-Regel, No-Border-Regel, Halbtonpunkt nur als maskierter Eckakzent). Der Bruch: `/#/vorlagen/konto-erstellung` zeigt wörtlich "BEISPIEL-VORLAGE — bitte durch eure echte Vorlage ersetzen" — ein Reifegrad-Gefälle zwischen den drei Hauptbereichen (Präsentationen: 17 echte Decks; Vorlagen: 1 Platzhalter), das beim ersten Blick auffällt.

**Deterministic scan**: `detect.mjs` gegen `index.html`, `styles.css`, `app.js`, `icons.js`, `data.js`, `presentations-data.js` → Exit-Code 2, 3 Findings, alle in `styles.css`:
- `bounce-easing` (warning/slop): `cubic-bezier(0.34, 1.56, 0.64, 1)` beim Thumbnail-Hover — **bewusst beibehalten**: der Nutzer hat explizit mehr Comic-Verspieltheit/Bounce angefordert, "The brief wins" bindet hier den generischen Slop-Reflex.
- 2× `design-system-radius` (advisory): 12px (Mark-Highlighter) und 3px (Sparkle-Bullet) außerhalb der dokumentierten Radius-Skala → **bereits während der Critique behoben** (auf `--radius-sm`/`--radius-xs` umgestellt, DESIGN.md ergänzt).

Keine Findings in den JS-Dateien. Kein Absturz.

**Kontrast (Assessment B, selbst berechnet)**: aktiver Tab-Filter "Alle" (Magenta auf Warmpapier, 14.72px/600) lag bei 4.17:1, unter der AA-Schwelle 4.5:1 für normalen Text → **bereits behoben** (font-weight auf 700 erhöht, qualifiziert jetzt für die Large-Text-3:1-Schwelle, komfortabel erfüllt).

**Overflow/Konsole**: keine horizontale Überlauf auf 10 getesteten Kombinationen (5 Routen × 2 Breiten), keine Konsolenfehler außer den erwarteten lokalen 404s (`/api/news`, `favicon.ico`). Ein Mess-Artefakt (body.scrollWidth 8px über documentElement auf 3 Übersichtsseiten, ohne sichtbaren Effekt) wurde vorsorglich durch eine engere Hero-Dekoration auf Mobile entschärft.

## Overall Impression

Solide, markentreue Grundlage mit einem echten Geschäftsrisiko an der wichtigsten Stelle: dem Moment, in dem eine Mail an einen echten Kunden rausgeht. Das Produkt hält sein eigenes Markenversprechen visuell ein, aber zwei seiner drei tragenden Säulen (Vorlagen, verlässliche Fehlermeldungen) sind noch nicht auf dem Niveau der dritten (Präsentationen).

## What's Working

1. **Konsequente Markenausführung statt AI-Slop-Default** — DESIGN.md wird in allen vier geprüften Screens sichtbar eingehalten, nicht nur behauptet.
2. **Live-Mail-Generator mit sauberem Clipboard-Fallback** — aktualisiert live bei jedem Tastendruck, fängt fehlende Clipboard-API ab statt stillschweigend zu scheitern.
3. **Ehrlicher, gut geschriebener Leerzustand** — die RSS-Fehlermeldung erklärt in einfachem Deutsch warum nichts da ist, statt eines generischen Fehlers.

## Priority Issues

**[P0] Template-Platzhalter können unverändert an echte Kunden gehen**
- **Warum es zählt**: Bleibt das Namens- oder Kontonummer-Feld leer, kopiert der Button trotzdem den rohen Text (`Hallo {KundenName},`) ohne Warnung — bei einem Agentur-Tool für Kundenkommunikation ein realer Reputationsschaden, kein kosmetischer Fehler.
- **Fix**: Pflichtfelder markieren, Copy-Button deaktivieren oder sichtbar warnen, solange ein `{Token}` im generierten Text steht.
- **Suggested command**: `/impeccable harden`

**[P1] Fehlermeldung ist hart auf eine einzige (lokale) Diagnose verdrahtet**
- **Warum es zählt**: Zeigt bei jedem `data.error` denselben Text, egal ob lokaler Testserver oder echter Produktionsausfall — Mitarbeitende bekämen bei einem echten RSS-Ausfall eine irreführende Erklärung, verletzt Heuristik 9.
- **Fix**: Fehlerursache differenzieren, Retry-Button ergänzen.
- **Suggested command**: `/impeccable harden`

**[P1] Vorlagen-Bibliothek besteht nur aus einer Platzhaltervorlage**
- **Warum es zählt**: PRODUCT.md nennt Vorlagen als Kernsäule; aktuell ist sie die einzige der drei Sektionen ohne echten Inhalt, was das Gesamtprodukt unfertig wirken lässt.
- **Fix**: Echte Vorlagen einpflegen oder Platzhalter deutlich als "Coming Soon" statt normale Listenkarte kennzeichnen.
- **Suggested command**: `/impeccable clarify`

**[P2] "Nach Datum sortiert" hält nicht, was die Unterzeile verspricht**
- **Warum es zählt**: 9 von 17 Präsentationen zeigen "Datum unbekannt" — über die Hälfte der Liste widerspricht dem Sortier-Claim im Untertitel.
- **Fix**: Untertitel präzisieren oder sichtbaren Abschnittstrenner "Ohne Datum" einführen.
- **Suggested command**: `/impeccable clarify`

**[P3] Kein Beschleunigungspfad für Vielnutzer:innen**
- **Warum es zählt**: Product Principle #1 ("Sekunden-schnell finden") wird bei täglicher Nutzung durch fehlende Shortcuts/Recent-Liste nicht eingelöst.
- **Fix**: `/`-Shortcut für Suche, zuletzt angesehene Einträge anheften.
- **Suggested command**: `/impeccable optimize`

## Persona Red Flags

**Jordan (Erstnutzer:in)**: Landet auf Vorlagen und sieht zuerst "BEISPIEL-VORLAGE — bitte ersetzen" — wirkt wie eine Baustelle. DocType-Tags ("Beta-Feature" vs. "Feature-Guide" vs. "Sonstiges") sind unerklärt, Jordan muss raten.

**Riley (Stress-Tester)**: Lässt Namens-/Kontonummer-Feld absichtlich leer, kopiert trotzdem anstandslos den rohen Platzhalter — klassischer "sieht aus, als würde es funktionieren"-Fall.

**Alex (Power User)**: Nutzt das Tool vermutlich täglich; kein Tastaturkürzel, keine Bulk-/Recent-Funktion, jede Session beginnt bei null.

## Minor Observations

- Betreff-Feld schneidet lange Zeilen ohne visuellen Hinweis ab.
- Textarea ohne sichtbaren Scroll-Hinweis bei längerem Mailtext.
- Label "Name der Ansprechperson" vs. Token `{KundenName}` — kleine Begriffs-Inkonsistenz.
- Kalender-Widget gibt allen drei Terminen gleiches visuelles Gewicht, unabhängig von Dringlichkeit.

## Questions to Consider

- Verdient der wichtigste Moment des Produkts (Kundenkommunikation) eine echte technische Schutzschicht statt sich auf manuelles Copy-Paste-Verhalten zu verlassen?
- Ist "Vorlagen & Wissensdatenbank" mit aktuell einem Platzhalter schon eine tragende Säule, oder ehrlicher als "in Aufbau" zu kennzeichnen, bis echter Inhalt da ist?
- Würde eine nach Kategorie vorsortierte Präsentationsliste (statt einer 17-Zeilen-Wand unter "Alle") dem "schnell finden"-Versprechen näherkommen?
