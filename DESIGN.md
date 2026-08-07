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
  cork: "#d9c3a0"
  cork-dark: "#5a3c14"
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
  auth-card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "36px 32px"
  google-login-button:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

# Design System: Sowespoke Wissenszentrum

## Overview

**Creative North Star: "The Case Wall"** (löst "The Editorial Desk" ab, 2026-08-07)

Die Seite ist jetzt eine Ermittlungs-Pinnwand: Inhalte (News, Präsentationen, Vorlagen, Case Studies) sind einzeln angepinnte Karteikarten auf einer Korkwand, nicht Zeilen einer flachen Liste. Herkunft: explizite Nutzerentscheidung für einen kompletten Strukturneuentwurf ("etwas ganz Neues"), gewürfelt über den Concept-Seed-Mechanismus des Impeccable-Skills gegen vier Alternativen (Sneaker-Box-Regal, Buchstaben-Sturm, U-Bahn-Netzplan, Nixie-Röhren-Zähler) — die Case-Wall gewann, weil sie den eigentlichen Produkt-Mechanismus ("Briefing rein → Kunden-Mail raus, wer zuerst weiß, handelt zuerst") direkt trägt und zur eigenen Sowespoke-Markenwelt passt (bestätigt anhand echter sowespoke.com-Screenshots: Halbton-Punkte, Comic-Sticker, Sprechblasen — die vorher nur als kleine Akzente existierten, bekommen hier ihr strukturelles Zuhause). Marke (Magenta/Petrol/Gelb, Baloo 2/Inter) bleibt unverändert — nur die räumliche Metapher ist neu.

Frühere Fassung ("The Editorial Desk", bis 2026-08-07): ein ruhiges, listenbasiertes Wissenszentrum nach Editorial-/Blog-Layout-Vorbild. Diese Struktur-Entscheidung ist damit ersetzt; die Marken-/Farb-Historie darunter bleibt als Beleg bestehen.

Diese Fassung ist das Ergebnis von zwei verworfenen Anläufen: Fassung 1 war ein ruhiges, aber markenfremdes ligne-claire-Navy-System (falsche Markenrecherche per Text-Fetch ohne visuellen Abgleich). Fassung 2 übertrug die echten Markenfarben, aber unverändert auf die alte Comic-Panel-Struktur — Ergebnis war ein überladenes, schwer navigierbares Raster mit zu vielen gleichzeitig aktiven Farben und Formen pro Karte. Diese dritte Fassung trennt die Fragen sauber: Struktur kommt von einem konkreten, klaren Referenz-Layout; Marke ist auf eine einzige dominante Akzentfarbe plus zwei sparsam eingesetzte Zweitfarben reduziert.

**Key Characteristics:**
- Icon-Sidebar (Home/Bibliothek) bleibt — sauberes Weiß, wie eine Pinnwand an der Bürowand, Navigation unverändert bewährt
- Content-Fläche ist eine Korkwand (`--cork`-Textur); Inhalte sind einzeln angepinnte Karteikarten im Raster, nicht Zeilen einer Liste
- Jede Karte trägt einen echten Reißnagel (Magenta) oben, minimal unterschiedliche Drehung pro Karte (von-Hand-angepinnte Unregelmäßigkeit)
- Abschnittsüberschriften als Tesafilm-Streifen auf der Wand statt schlichtem Text
- Eine große, editorial gesetzte Headline (Baloo 2) mit farbig markierter Schlüsselphrase — der einzige Ort mit Display-Schrift
- Seitenkarte/Info-Box/Mail-Generator bleiben wie zuvor: weiße Karten mit `3px`-Typrahmen und farbigem Schein (siehe Bunte-Rahmen-Regel) — eigene Zone, kein Pin
- Magenta ist die einzige Farbe mit hoher Präsenz (Buttons, aktiver Tab, Reißnägel, Sprechpunkt-Marker); Petrol und Gelb erscheinen nur klein (Logo, Beta-Badge)

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
- **Kork** (`#d9c3a0`, dunkler Farbton `#5a3c14` nur als Sprenkel-Textur): Untergrund der Content-Fläche (`.view`) seit der Case-Wall-Richtung — Sidebar bleibt bewusst reinweiß als Kontrast, wie eine Pinnwand an einer Bürowand.

### Wegweiser-Tinten (Kategorie-Thumbnails)
- **Veilchen** `#5b3fb0` — KI & Automatisierung
- **Waldgrün** `#146b3a` — Gebotsstrategien
- **Rost** `#a5341a` — Targeting
- **Ocker** `#8f5c08` — Kreativ & Formate
- **Petrolblau** `#185f8c` — Tracking & Messung

### Named Rules
**The Small-and-Often Rule.** Magenta erscheint an vielen kleinen Stellen (Button, Unterstrich, Punktmarker), nie als große Fläche. Eine magentafarbene Fläche, die größer als ein Button oder Badge ist, verletzt diese Regel.

**Die Bunte-Rahmen-Regel (seit der 4. Fassung, 2026-08-02).** Ursprünglich galt hier eine No-Border-Regel (Karten nur über Schatten abgegrenzt). Auf expliziten Nutzerwunsch nach mehr Comic-/Pop-Art-Charakter gilt jetzt: Seitenkarte, Info-Box und Mail-Generator bekommen je einen `3px`-Vollrahmen in einer festen, typbezogenen Farbe (Seitenkarte: Magenta, Info-Box: Petrol, Mail-Generator: Gelb) — nicht zufällig gemischt pro Instanz, sondern konsistent pro Komponente. Listenzeilen (`row`-Muster) bleiben bewusst randlos, damit die Liste weiterhin scanbar bleibt — die Rahmen sind auf abgegrenzte Karten-Container begrenzt, kein Muster über die ganze Seite. Trennlinien (`--line`) bleiben für Listen und Tabs.

**Echte Marken-Formen — Experiment zurückgenommen (2026-08-02).** `BRAND_BLOB` (organischer Teal-Blob) und `BRAND_BURST` (gelbe Halbton-Comic-Wolke) wurden nach echten Sowespoke-Präsentationsfolien gebaut und kurzzeitig als verstreute Einzel-Akzente eingesetzt (Blob hinter der Hero-Illustration, Burst als Eck-Akzent auf Seitenkarten). Angelika-Feedback: In der Referenzfolie wirken Blob, Burst, Gradient-Panel und Foto als **eine** komponierte Illustration zusammen — als isolierte Einzelteile an unzusammenhängenden UI-Stellen (Hero-Ecke vs. Karten-Ecke) wirken sie beliebig/sinnlos, und der Hero-Blob überlappte zudem das Suchfeld (echter Layout-Bug). Beide Konstanten bleiben in `icons.js` definiert, sind aber aktuell **nicht verwendet**. `SIDECARD_ILLUSTRATION` ist zurückgesetzt auf die ursprüngliche einfache 3-Punkt-Version.

**Hero-Illustration als komponiertes Cluster (2026-08-04).** Nach dem Rücknehmen der Marken-Formen blieb neben der Überschrift sichtbarer Leerraum, während das Megafon isoliert in der Ecke schwebte — Angelika-Feedback anhand eines Comic-Landingpage-Referenzbilds: mehrere kleine Elemente (Blitz, Halbton-Punktfeld, Foto, Farbflächen) berühren/überlappen sich dort zu EINER Komposition, statt einzeln verteilt zu sein. `HERO_ILLUSTRATION` in `icons.js` ist jetzt selbst ein Cluster aus drei sich berührenden Teilen in einem gemeinsamen SVG (Halbton-Punktfeld-Patch + Comic-Blitz + Megafon), breiter statt höher (`viewBox 0 0 300 190`), füllt den Raum links vom Megafon statt ihn leer zu lassen. Bleibt eine einzelne Instanz pro Seite (Hero kommt nie doppelt vor) — keine ID-Kollisionsgefahr wie bei `SIDECARD_ILLUSTRATION`.

**Mutigere Umsetzung des bestehenden Systems (2026-08-07).** Audit-Feedback: die Marke war schon richtig angelegt, wurde aber zu zaghaft ausgeführt. Bestätigt durch echte Sowespoke-Firmenmaterialien (sowespoke.com, Präsentationsfolien) als Referenz: großflächigere Halbton-Punktfelder, Comic-Sticker-Badges mit hartem Versatz-Schatten statt weichem Blur, echte Kartenillustrationen statt drei bloßer Punkte. Nichts an Farbpalette, Fonts oder Struktur geändert — nur die Ausführung verschärft:
- Kartenschatten (Seitenkarte/Info-Box/Mail-Generator) hatten `0 0 26px` Versatz — ein Schatten ohne Offset ist ein aufgemalter Ring, keine echte Tiefe. Jetzt `0 14px 32px -14px`, Richtung wie `shadow-hover`.
- `SIDECARD_ILLUSTRATION` (drei bloße Punkte, für alle Kartentypen identisch) ersetzt durch drei eigene, typgebundene Mini-Cluster: `SIDECARD_ILLUSTRATION` (magenta, Halbton-Patch + Konfetti), `INFOBOX_ILLUSTRATION` (petrol, Mini-Blob nach `BRAND_BLOB`-Vorbild), `MAILGEN_ILLUSTRATION` (gelb, Mini-Burst nach `BRAND_BURST`-Vorbild) — `BRAND_BLOB`/`BRAND_BURST` bleiben als eigenständige Konstanten unbenutzt, ihre Formsprache lebt jetzt verkleinert in diesen drei Karten-Illustrationen weiter. Jede nutzt zusätzlich 1-2 Konfetti-Punkte in den bisher nur auf Zeilen-Thumbnails sichtbaren Wegweiser-Tinten (`--cat-*`) — mehr Farbpräsenz ohne neue, undokumentierte Werte.
- Beta-Badge (`.flash`) ist jetzt ein Comic-Sticker: `1.5px` Ink-Rand, harter `1.5px 1.5px 0`-Schlagschatten (kein Blur), `-2deg` Drehung — passend zur Sticker-/Halbton-Sprache der echten Firmenmaterialien. `.flash--muted` bleibt schattenlos und gerade (dezente Variante).
- Hero-Headline von `clamp(1.85rem, 1.3rem+2vw, 2.75rem)` auf `clamp(2.1rem, 1.3rem+2.6vw, 3.15rem)` angehoben (Breitbild-Override entsprechend auf `3.85rem`-Deckel); Hero-Illustration bekommt echten Schattenwurf (`drop-shadow`, folgt der Alphaform); Hero-Intro/Suche erhalten einen einmaligen, dezenten Eintritts-Moment (`hero-in`, 420ms, wie das bestehende Maskottchen-Timing) statt Sofort-Erscheinen.
- Halbton-Punktraster auf Zeilen-Thumbnails deutlich sichtbarer gemacht (Opazität 0.6→0.78, dichteres Raster).
- **Bewusst nicht geändert:** Listen-Zeilen bleiben ohne Eintritts-Animation — Prinzip 1 aus `PRODUCT.md` ("Schneller Zugriff schlägt Vollständigkeit") verbietet, das Scannen der Liste künstlich zu verzögern.

## Typography

**Display Font:** Baloo 2 (mit Segoe UI, system-ui als Fallback) — nur für die große Hero-/Seiten-Headline.
**Body Font:** Inter (mit Segoe UI, system-ui als Fallback) — für alles andere, inklusive fetter Titel/Buttons/Labels über `font-weight`, nicht über einen Schriftwechsel.

**Character:** Baloo 2 ist bewusst auf einen einzigen Moment pro Seite begrenzt (die Headline) — das hält die Markenpersönlichkeit sichtbar, ohne die Scanbarkeit der Liste zu stören. Alles, was gelesen statt nur wahrgenommen wird, bleibt in Inter.

### Hierarchy
- **Display** (700, `clamp(2.1rem, 1.3rem + 2.6vw, 3.15rem)`, 1.12; ab `90rem` Breite `clamp(2.4rem, 1rem + 3vw, 3.85rem)`): Seiten-Headline, genau einmal pro Seite.
- **Headline** (700, `clamp(1.6rem, 1.2rem + 1.6vw, 2.25rem)`): Detail-Seitentitel — ebenfalls Baloo 2, als Fortsetzung der Headline-Rolle.
- **Title** (700, 1.05rem, Inter): Zeilentitel in der Artikel-Liste, Kartentitel.
- **Body** (400, 1rem, 1.55; Messbreite bis 68ch): Beschreibungstexte, E-Mail-Inhalt.
- **Label** (600, 0.76–0.95rem): Tabs, Meta-Zeilen, Formularlabels.

## Layout

Zwei-Spalten-Shell: `76px` breite Icon-Sidebar (sticky) + Hauptbereich, maximal `68rem` Content-Breite, zentriert. Die Übersicht selbst ist ein `minmax(0,1fr) 20rem`-Grid (Artikel-Liste + Seitenkarte), das unter `60rem` auf eine Spalte fällt. Tabs sind horizontal scrollbar (`overflow-x:auto`) statt umzubrechen — funktioniert bei 5+ Kategorien auch auf schmalen Screens.

Mobil (`48rem`): Sidebar wird zur horizontalen Top-Leiste (Icons nebeneinander) statt zu verschwinden oder umzubrechen.

**Case-Wall-Raster (2026-08-07).** Die Artikel-Liste (`article-list`) ist kein vertikal gestapelter, randgetrennter Zeilenstapel mehr, sondern ein CSS-Grid (`repeat(auto-fill, minmax(17rem,1fr))`) aus einzelnen Karten — auf breiten Screens mehrspaltig, auf schmalen automatisch einspaltig, ohne eigene Media Query. Trennlinien (`--line`) entfallen für diese Karten; Abstand zwischen Karten trägt jetzt die Trennung, plus Schatten/Rotation für die Wand-Haptik.

## Elevation & Depth

Reine Schatten-Tiefe, keine Konturen. Ein einziger Schatten-Token für den Ruhezustand aller Karten, ein zweiter für Hover — kein Konturensystem wie in den verworfenen Vorfassungen.

### Shadow Vocabulary
- **shadow** (`0 1px 2px rgba(23,23,23,.04), 0 8px 20px -10px rgba(23,23,23,.12)`): Ruhezustand aller Karten (Seitenkarte, Info-Box, Mail-Generator, Suchfeld, Leerzustand).
- **shadow-hover** (`0 4px 10px rgba(23,23,23,.06), 0 14px 28px -12px rgba(23,23,23,.16)`): Primär-Button-Hover.
- **shadow-glow** (`shadow` + `0 14px 32px -14px <typfarbe @ 50-60%>`): zusätzlicher farbiger Schein je Kartentyp (magenta/petrol/gelb), immer mit Versatz — ein Schein ohne Offset (`0 0 …`) ist Dekoration, keine Tiefe.
- **sticker-shadow** (`1.5px 1.5px 0 var(--ink)`, kein Blur): einziger Ort mit hartem, unverwischtem Schatten — nur für das Beta-Badge (Comic-Sticker-Charakter), nicht für Karten oder Buttons.

## Shapes

Zwei Radiusstufen tragen fast alles: `10px` (Icon-Buttons, Formularfelder) und `14px` (Karten). Pillenform (`999px`) für Buttons, Tabs-Chips, Badges. Ein kleiner `4px`-Radius existiert nur für die Inline-Textmarkierung (`<mark>`) und den Fokus-Ring — bewusst kleiner als die übrige Skala, weil beide Inline-Elemente sind, keine Flächen.

## Components

### Buttons
- **Shape:** Pillenform (`999px`).
- **Primary:** Magenta-Füllung, weißer Text, `shadow` im Ruhezustand, `shadow-hover` + `translateY(-1px)` bei Hover.
- **Secondary:** Weiße Füllung, `1px` Linienrand (`--line`), kein Schatten.

### Chips & Badges
- **Kategorie-Chip:** Vollfarbige Tinte, weißer Text, Pille.
- **Beta-Badge:** Gelbe Füllung, schwarzer Text/Icon, Pille, kleiner als der Kategorie-Chip. Comic-Sticker-Ausführung: `1.5px` Ink-Rand, `sticker-shadow`, `-2deg` Drehung. `.flash--muted` (dezente Variante) bleibt ohne Schatten/Drehung.

### Angepinnte Karte (`article-list li` + `row`)
- **Aufbau:** Weiße Karte mit `52px` farbigem Icon-Thumbnail (Kategorie-Tinte, sichtbares Halbton-Punktraster) oben, Meta-Zeile (Datum, Kategorie, Beta-Badge), Titel (Inter 700), Zusammenfassung, Pfeil-Icon unten rechts (absolut positioniert).
- **Reißnagel:** `13px` Kreis in Marken-Magenta mit Ink-Rand, mittig oben, `-7px` über die Kartenkante hinausragend — immer Magenta, unabhängig von der Kategorie-Tinte des Thumbnails (ein Pin ist ein physisches Objekt, kein zweites Wayfinding-System).
- **Drehung:** leichte, per `nth-child` alternierende Rotation (`-0.7deg`/`0.6deg`/`-0.2deg`/`0.9deg`) für die von-Hand-angepinnte Unregelmäßigkeit; beim Hover/Fokus richtet sich die Karte auf (`rotate(0)`) und hebt sich leicht an.
- **Trennung:** Rasterabstand statt Trennlinie — jede Karte ist eine eigenständige Fläche mit echtem, versetztem Schatten.
- **Hover:** Titel und Pfeil wechseln zu Magenta, Pfeil verschiebt sich `3px` nach rechts, Karte hebt sich an und richtet sich gerade.
- **Ausnahme:** `feed__divider` (z. B. "Ohne bekanntes Datum") bekommt keine Karten-Optik — bleibt schlichtes, `grid-column: 1/-1` spannendes Textlabel innerhalb desselben Rasters.

### Seitenkarte / Info-Box / Mail-Generator
- **Style:** Weiß, `14px` Radius, `shadow-glow` (typfarbig, siehe Elevation), `3px`-Typrahmen (Seitenkarte magenta, Info-Box petrol, Mail-Generator gelb), `1.5rem` Innenabstand.
- **Eck-Illustration:** je eine eigene, typgebundene Mini-Cluster-Illustration oben rechts (`SIDECARD_ILLUSTRATION`/`INFOBOX_ILLUSTRATION`/`MAILGEN_ILLUSTRATION` in `icons.js`) — Halbton-Patch bzw. Mini-Blob/-Burst in der Typfarbe plus 1-2 Konfetti-Punkten in den Wegweiser-Tinten, nicht drei beliebige Einzelpunkte.
- **Interne Trennung:** `1px`-Linien zwischen Listeneinträgen innerhalb der Karte (z. B. Best-Practices-Liste).

### Auth-Karte (`login.html`)
- **Style:** Weiß, `14px` Radius, schlichter `1px`-Linienrand (`--line`), `shadow` (kein Typ-Rahmen/`shadow-glow`) — eigenständiger Seitentyp außerhalb der Bunte-Rahmen-Regel, da die Login-Seite bewusst öffentlich (ohne Session) ausgeliefert wird und nicht Teil der App-Kartenfamilie ist.
- **Aufbau:** Logo, `h1` (Baloo 2), Hinweistext, Fehlermeldung (`role="alert"`), Google-Login-Button.

### Google-Login-Button
- **Bewusste Ausnahme** von Pillenform + Magenta-Primary: folgt Googles offiziellen "Sign in with Google"-Branding-Vorgaben (neutrale weiße Füllung, `1px`-Linienrand, Googles eigenes vierfarbiges "G"-Logo unverändert). Radius `10px` statt Pillenform — Google erlaubt beides, hier bewusst dezenter gehalten.
- **Nicht** bei künftigen Design-Durchgängen auf Magenta/Pillenform "korrigieren" — würde Googles Branding-Vorgaben verletzen.

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
- **Do** Karten (Seitenkarte/Info-Box/Mail-Generator) mit dem festen `3px`-Typ-Rahmen versehen (siehe Bunte-Rahmen-Regel) plus Schatten — Farbe ist an den Komponenten-Typ gebunden, nicht frei wählbar.
- **Do** neue Listeninhalte als Zeile (`row`-Muster) anlegen, randlos — das Listenmuster ist die primäre Content-Form dieser App und bleibt bewusst ohne Rahmen, damit es scanbar bleibt.
- **Do** Baloo 2 auf die eine Headline pro Seite begrenzen; alles andere bleibt Inter, auch wenn es fett gesetzt ist.
- **Do** bei Unsicherheit über Markendetails ein echtes Bild/Screenshot anfordern statt aus Text-Fetch zu raten.
- **Do** Schatten immer mit Versatz versehen (`shadow`, `shadow-hover`, `shadow-glow`) — ein Schein ohne Offset ist Dekoration, keine Tiefe.
- **Do** den harten, unverwischten `sticker-shadow` ausschließlich für das Beta-Badge verwenden — er ist die eine bewusste Ausnahme vom sonst durchgängig weichen Schattensystem, kein Ersatzmuster für Karten.
- **Do** neue Listen-/Rasterinhalte als `article-list li` + `row`-Karte anlegen (Pin, Rotation, echte Kartenfläche) — das ist jetzt die primäre Content-Form, nicht mehr die randlose Zeile.
- **Do** den Reißnagel immer in Magenta halten, unabhängig von Kategorie-Tinte — Konsistenz des physischen Objekts vor Wayfinding-Redundanz.

### Don't:
- **Don't** Rahmenfarben pro Karten-Instanz frei mischen (z. B. eine Seitenkarte mal magenta, mal gelb) — die Farbe hängt am Komponenten-Typ, nicht am Zufall, sonst entsteht wieder das "zu viele Farben gleichzeitig"-Problem der verworfenen Fassung 2.
- **Don't** die Illustrationen als flächendeckendes Muster einsetzen — `HERO_ILLUSTRATION` und die drei Karten-Illustrationen (`SIDECARD_ILLUSTRATION`/`INFOBOX_ILLUSTRATION`/`MAILGEN_ILLUSTRATION`) bleiben einzelne, freistehende Cluster an definierten Stellen (Hero-Ecke, Karten-Ecke), kein Muster über eine ganze Fläche. `BRAND_BLOB`/`BRAND_BURST` bleiben eigenständig unbenutzt; ihre Formsprache lebt verkleinert in den drei Karten-Illustrationen weiter — nicht zusätzlich als separate Einzelakzente reaktivieren.
- **Don't** mehr als eine Farbe gleichzeitig großflächig einsetzen (z. B. ein farbiges Kartenband plus eine zweite Akzentfarbe im selben Element).
- **Don't** Emoji oder Icon-Fonts anstelle der gezeichneten Line-Art-Icons (`icons.js`) verwenden.
- **Don't** neue Strukturmuster erfinden, ohne sie gegen das Editorial-Referenzlayout zu prüfen — Struktur ist bewusst von einem konkreten Vorbild abgeleitet, nicht frei gestaltet.
