---
name: Sowespoke Wissenszentrum
description: Internes Editorial-Wissenszentrum mit Sowespoke-Markenfarben (Magenta/Petrol/Gelb)
colors:
  ink: "#171717"
  ink-soft: "#63636b"
  paper: "#f7f5f1"
  paper-raised: "#ffffff"
  line: "#e7e3db"
  accent: "#e4067e"
  accent-tint: "#fde6f1"
  on-accent: "#ffffff"
  yellow: "#ffcc00"
  on-yellow: "#171717"
  teal: "#2f8f8a"
  on-teal: "#ffffff"
  cat-ai: "#5b3fb0"
  cat-bid: "#146b3a"
  cat-target: "#a5341a"
  cat-creative: "#8f5c08"
  cat-tracking: "#185f8c"
  success: "#146b3a"
  success-tint: "#dcf1e3"
typography:
  display:
    fontFamily: "Baloo 2, Segoe UI, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  xs: "4px"
  sm: "10px"
  md: "14px"
  pill: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4.5rem"
components:
  side-card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  chip:
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  badge-beta:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.on-yellow}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
---

# Design System: Sowespoke Wissenszentrum

## Overview

**Creative North Star: "The Editorial Desk"**

Ein ruhiges, listenbasiertes internes Wissenszentrum — Struktur einem klaren Editorial-/Blog-Layout entlehnt (schmale Icon-Sidebar, große Auszeichnungs-Headline, Tab-Filter, scanbare Artikel-Liste, schlanke Seitenkarte), Marke von den echten Sowespoke-Präsentationen (Magenta als einzige starke Akzentfarbe, Petrol und Gelb sparsam als Zweitfarben, weiche Schatten statt harter Konturen).

Diese Fassung ist das Ergebnis von zwei verworfenen Anläufen: Fassung 1 war ein ruhiges, aber markenfremdes ligne-claire-Navy-System (falsche Markenrecherche per Text-Fetch ohne visuellen Abgleich). Fassung 2 übertrug die echten Markenfarben, aber unverändert auf die alte Comic-Panel-Struktur — Ergebnis war ein überladenes, schwer navigierbares Raster mit zu vielen gleichzeitig aktiven Farben und Formen pro Karte. Diese dritte Fassung trennt die Fragen sauber: Struktur kommt von einem konkreten, klaren Referenz-Layout; Marke ist auf eine einzige dominante Akzentfarbe plus zwei sparsam eingesetzte Zweitfarben reduziert.

**Key Characteristics:**
- Icon-Sidebar (Home/Bibliothek) statt Top-Navigation — persistent, minimal
- Eine große, editorial gesetzte Headline (Baloo 2) mit farbig markierter Schlüsselphrase — der einzige Ort mit Display-Schrift
- Themen als schlichte Listenzeilen (Farbicon-Thumbnail, Datum, Titel, Kurztext, Pfeil), keine Karten mit eigenem Rahmen
- Tabs für Kategorie-Filterung statt bunter Chips auf jeder Karte
- Weiße Karten mit weichem Schatten, **kein sichtbarer Rahmen** — durchgängig für Seitenkarte, Info-Box, Mail-Generator
- Magenta ist die einzige Farbe mit hoher Präsenz (Buttons, aktiver Tab, Icon-Sidebar-Status, Sprechpunkt-Marker); Petrol und Gelb erscheinen nur klein (Logo, Beta-Badge)

## Colors

Restrained-Strategie mit einer dominanten Markenfarbe: Magenta trägt Interaktion und Aufmerksamkeit, Petrol und Gelb sind auf Logo bzw. Beta-Kennzeichnung begrenzt. Kategorie-Tinten bleiben ein kleines, kontrolliertes Wayfinding-System auf den Zeilen-Thumbnails.

### Primary
- **Marken-Magenta** (`#e4067e`): Buttons, aktiver Tab-Unterstrich, aktiver Sidebar-Eintrag, Aufzählungspunkte, Link-Hover. Erscheint klein und oft statt großflächig und selten — trägt Interaktion, nicht Fläche.

### Secondary
- **Signal-Gelb** (`#ffcc00`): Beta-Badge (schwarzer Text, `on-yellow`) sowie als Sparkle-Akzent in den Eck-Illustrationen (Hero, Seitenkarte, Info-Box) — immer klein, nie als eigene Fläche.
- **Marken-Petrol** (`#2f8f8a`): Logo-Mark in der Sidebar sowie als kleiner Punkt-Akzent in den Eck-Illustrationen.

### Neutral
- **Tiefschwarz** (`#171717`): Fließtext, Icon-Sidebar-Icons.
- **Grauschiefer** (`#63636b`): sekundärer Text (Meta-Zeilen, Zusammenfassungen).
- **Warmpapier** (`#f7f5f1`): Seitenhintergrund.
- **Reinweiß** (`#ffffff`): Karten-Füllung.
- **Trennlinie** (`#e7e3db`): 1px-Linien zwischen Listenzeilen und Tabs — die einzige "Kontur" im System.

### Wegweiser-Tinten (Kategorie-Thumbnails)
- **Veilchen** `#5b3fb0` — KI & Automatisierung
- **Waldgrün** `#146b3a` — Gebotsstrategien
- **Rost** `#a5341a` — Targeting
- **Ocker** `#8f5c08` — Kreativ & Formate
- **Petrolblau** `#185f8c` — Tracking & Messung

### Named Rules
**The Small-and-Often Rule.** Magenta erscheint an vielen kleinen Stellen (Button, Unterstrich, Punktmarker), nie als große Fläche. Eine magentafarbene Fläche, die größer als ein Button oder Badge ist, verletzt diese Regel.

**The No-Border Rule.** Karten (Seitenkarte, Info-Box, Mail-Generator) grenzen sich ausschließlich über `--shadow` vom Hintergrund ab, nie über einen sichtbaren Rahmen. Trennlinien (`--line`) sind nur für Listen und Tabs erlaubt.

## Typography

**Display Font:** Baloo 2 (mit Segoe UI, system-ui als Fallback) — nur für die große Hero-/Seiten-Headline.
**Body Font:** Inter (mit Segoe UI, system-ui als Fallback) — für alles andere, inklusive fetter Titel/Buttons/Labels über `font-weight`, nicht über einen Schriftwechsel.

**Character:** Baloo 2 ist bewusst auf einen einzigen Moment pro Seite begrenzt (die Headline) — das hält die Markenpersönlichkeit sichtbar, ohne die Scanbarkeit der Liste zu stören. Alles, was gelesen statt nur wahrgenommen wird, bleibt in Inter.

### Hierarchy
- **Display** (700, `clamp(1.85rem, 1.3rem + 2vw, 2.75rem)`, 1.15): Seiten-Headline, genau einmal pro Seite.
- **Headline** (700, `clamp(1.6rem, 1.2rem + 1.6vw, 2.25rem)`): Detail-Seitentitel — ebenfalls Baloo 2, als Fortsetzung der Headline-Rolle.
- **Title** (700, 1.05rem, Inter): Zeilentitel in der Artikel-Liste, Kartentitel.
- **Body** (400, 1rem, 1.55; Messbreite bis 68ch): Beschreibungstexte, E-Mail-Inhalt.
- **Label** (600, 0.76–0.95rem): Tabs, Meta-Zeilen, Formularlabels.

## Layout

Zwei-Spalten-Shell: `76px` breite Icon-Sidebar (sticky) + Hauptbereich, maximal `68rem` Content-Breite, zentriert. Die Übersicht selbst ist ein `minmax(0,1fr) 20rem`-Grid (Artikel-Liste + Seitenkarte), das unter `60rem` auf eine Spalte fällt. Tabs sind horizontal scrollbar (`overflow-x:auto`) statt umzubrechen — funktioniert bei 5+ Kategorien auch auf schmalen Screens.

Mobil (`48rem`): Sidebar wird zur horizontalen Top-Leiste (Icons nebeneinander) statt zu verschwinden oder umzubrechen.

## Elevation & Depth

Reine Schatten-Tiefe, keine Konturen. Ein einziger Schatten-Token für den Ruhezustand aller Karten, ein zweiter für Hover — kein Konturensystem wie in den verworfenen Vorfassungen.

### Shadow Vocabulary
- **shadow** (`0 1px 2px rgba(23,23,23,.04), 0 8px 20px -10px rgba(23,23,23,.12)`): Ruhezustand aller Karten (Seitenkarte, Info-Box, Mail-Generator, Suchfeld, Leerzustand).
- **shadow-hover** (`0 4px 10px rgba(23,23,23,.06), 0 14px 28px -12px rgba(23,23,23,.16)`): Primär-Button-Hover.

## Shapes

Zwei Radiusstufen tragen fast alles: `10px` (Icon-Buttons, Formularfelder) und `14px` (Karten). Pillenform (`999px`) für Buttons, Tabs-Chips, Badges. Ein kleiner `4px`-Radius existiert nur für die Inline-Textmarkierung (`<mark>`) und den Fokus-Ring — bewusst kleiner als die übrige Skala, weil beide Inline-Elemente sind, keine Flächen.

## Components

### Buttons
- **Shape:** Pillenform (`999px`).
- **Primary:** Magenta-Füllung, weißer Text, `shadow` im Ruhezustand, `shadow-hover` + `translateY(-1px)` bei Hover.
- **Secondary:** Weiße Füllung, `1px` Linienrand (`--line`), kein Schatten.

### Chips & Badges
- **Kategorie-Chip:** Vollfarbige Tinte, weißer Text, Pille.
- **Beta-Badge:** Gelbe Füllung, schwarzer Text/Icon, Pille, kleiner als der Kategorie-Chip.

### Artikel-Zeile (`row`)
- **Aufbau:** `52px` farbiges Icon-Thumbnail (Kategorie-Tinte) + Meta-Zeile (Datum, Kategorie, Beta-Badge) + Titel (Inter 700) + Zusammenfassung + Pfeil-Icon rechts.
- **Trennung:** `1px`-Linie zwischen Zeilen, keine eigene Kartenfläche pro Zeile.
- **Hover:** Titel und Pfeil wechseln zu Magenta, Pfeil verschiebt sich `3px` nach rechts.

### Seitenkarte / Info-Box / Mail-Generator
- **Style:** Weiß, `14px` Radius, `shadow`, kein Rahmen, `1.5rem` Innenabstand.
- **Interne Trennung:** `1px`-Linien zwischen Listeneinträgen innerhalb der Karte (z. B. Best-Practices-Liste).

### Inputs / Fields
- **Style:** `1px`-Linienrand (`--line`), `10px` Radius, Warmpapier-Füllung.
- **Focus:** `3px` Magenta-Outline (`:focus-visible`), `2px` Offset.

### Sidebar-Navigation
- **Style:** Icon-only, `44px` Touch-Ziel, `10px` Radius. Aktiver Eintrag: `accent-tint`-Hintergrund, Magenta-Icon. Inaktiv: grauer Icon, Hover mit Warmpapier-Hintergrund.

### Tabs
- **Style:** Textbutton mit `2px` Unterstrich. Aktiv: Magenta-Text und -Unterstrich. Inaktiv: Grauschiefer, Hover auf Schwarz.

## Do's and Don'ts

### Do:
- **Do** Magenta klein und häufig einsetzen (Button, Unterstrich, Punktmarker) statt großflächig und selten.
- **Do** Karten ausschließlich über Schatten von der Fläche abheben, nie über einen sichtbaren Rahmen.
- **Do** neue Listeninhalte als Zeile (`row`-Muster) anlegen, nicht als eigenständige Karte mit Rahmen — das Listenmuster ist die primäre Content-Form dieser App.
- **Do** Baloo 2 auf die eine Headline pro Seite begrenzen; alles andere bleibt Inter, auch wenn es fett gesetzt ist.
- **Do** bei Unsicherheit über Markendetails ein echtes Bild/Screenshot anfordern statt aus Text-Fetch zu raten.

### Don't:
- **Don't** dicke schwarze oder farbige Konturen um Panels/Karten einführen — diese App nutzt ausschließlich Schatten und `1px`-Trennlinien.
- **Don't** die Eck-Illustrationen (`HERO_ILLUSTRATION`/`SIDECARD_ILLUSTRATION` aus `icons.js`) flächendeckend oder mit dicken Konturen einsetzen — sie bleiben kleine, freistehende Line-Art-Motive in der Ecke, kein Muster über eine ganze Fläche wie in der verworfenen Fassung 2.
- **Don't** mehr als eine Farbe gleichzeitig großflächig einsetzen (z. B. ein farbiges Kartenband plus eine zweite Akzentfarbe im selben Element).
- **Don't** Emoji oder Icon-Fonts anstelle der gezeichneten Line-Art-Icons (`icons.js`) verwenden.
- **Don't** neue Strukturmuster erfinden, ohne sie gegen das Editorial-Referenzlayout zu prüfen — Struktur ist bewusst von einem konkreten Vorbild abgeleitet, nicht frei gestaltet.
