---
name: Sowespoke Wissenszentrum
description: Internes Editorial-Wissenszentrum mit Sowespoke-Markenfarben (Magenta/Petrol/Gelb)
colors:
  ink: "#111111"
  ink-soft: "#636363"
  paper: "#f9f9f9"
  paper-raised: "#ffffff"
  line: "#e7e3db"
  accent: "#d4035f"
  accent-tint: "#fde6f1"
  on-accent: "#ffffff"
  yellow: "#ffc600"
  on-yellow: "#111111"
  teal: "#609274"
  on-teal: "#ffffff"
  cat-ai: "#5b3fb0"
  cat-bid: "#146b3a"
  cat-target: "#a5341a"
  cat-creative: "#8f5c08"
  cat-tracking: "#185f8c"
  success: "#146b3a"
  success-tint: "#dcf1e3"
  teal-tint: "#e2f3f2"
  accent-light: "#ff4b9e"
  accent-deep: "#9c0349"
typography:
  display:
    fontFamily: "Exo 2, Segoe UI, system-ui, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Open Sans, Segoe UI, system-ui, sans-serif"
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

**Key Characteristics (aktualisiert nach zweiter Mockup-Kurskorrektur, siehe Named Rules):**
- Beschriftete Sidebar (`236px`, nur echte Seiten) — sauberes Weiß, aktive Seite mit Tint-Hintergrund + linkem Farbbalken, unten ein Profil-Stub mit echter Session-E-Mail. Fällt auf Mobile zurück auf schmale Icon-only-Form.
- Content-Fläche ist **flaches, warmes Off-White** (kein Kork-Hintergrund mehr — explizit vom Nutzer verworfen), Inhalte sind **gerade, exakt ausgerichtete Karten im Raster** — Rotation und Reißnagel wurden nach Nutzer-Feedback wieder entfernt (wirkten "messy", Pin ohne erkennbare Bedeutung). Halbton-Punktmuster ist auf den Hero-Bereich begrenzt, nicht mehr seitenweit.
- Abschnittsüberschriften sind schlichte Überschriften mit separater Ergebnis-Pille, keine Tesafilm-Optik mehr
- Eine große, editorial gesetzte Headline (Baloo 2) mit farbig unterstrichener Schlüsselphrase (Text-Farbe + Underline, kein Pillen-Hintergrund) — der einzige Ort mit Display-Schrift
- Seitenkarte/Info-Box/Mail-Generator: weiße Karten mit `3px`-Typrahmen und farbigem Schein (siehe Bunte-Rahmen-Regel) — eigene Zone, unverändert
- Magenta ist die einzige Farbe mit hoher Präsenz (Buttons, aktiver Tab/Nav, Mark-Unterstreichung); Petrol und Gelb erscheinen nur klein (Logo, Beta-Badge)

**Megafon-Illustration ersetzt: Marker-Doodle statt Verlaufs-Glanz (2026-08-07, spät).** Nutzer hat über mehrere Runden hinweg eine neue Megafon-Illustration extern entworfen (Detail-Briefing + zwei Korrekturdurchgänge) und explizit "auf die Website einbauen" lassen — löst das bisherige, glänzende Verlaufs-Megafon in `HERO_ILLUSTRATION` (`icons.js`) ab, das seitenweit als geteilte Konstante verwendet wird (News, Präsentationen, Vorlagen, Case Studies, Microsoft Learn, Anfragen):
- **Stil-Wechsel:** dicke, sattschwarze Marker-Outlines statt dünnerer Linien; flache Farbflächen (`var(--accent)`, `var(--teal)`, `#fff`) statt der bisherigen `megaBody`/`megaGrip`-Verlaufsgradienten — die beiden `linearGradient`-Defs sind komplett entfernt.
- **Neue Ausrichtung:** 45°-Kippung, Trichteröffnung oben links, Griff unten rechts (vorher: Trichter zeigte nach rechts, leicht nach oben). Kompakter, gedrungener Korpus statt länglichem Trichter.
- **Impact-Burst statt einzelner Comic-Burst-Form:** 13 unterschiedlich lange, leicht wacklige Strahlen fächern um die Trichteröffnung — ersetzt den vorherigen türkisfarbenen Sternenwolke-Hintergrund UND das gelbe Blitz-Element UND das Halbton-Punktfeld (alle drei entfernt, der Strahlenkranz übernimmt jetzt allein die "Bewegung/Energie"-Funktion der Illustration).
- **ViewBox von Breitformat auf quadratisch:** vorher `0 0 300 190` (auf die vorherige Breitformat-Komposition zugeschnitten), jetzt `0 0 764 774` (eng um die neue, annähernd quadratische Komposition zugeschnitten). `.hero__illustration`/`.hero--compact .hero__illustration` in `styles.css` entsprechend von `340×215`/`220×139` auf `250×254`/`168×170` angepasst.
- **Koordinaten sind programmatisch erzeugt** (Node-Skript, das Strahlen-Winkel/-Länge/-Wölbung deterministisch aus einer Seed-Funktion berechnet und die tatsächliche On-Screen-Bounding-Box nach der 45°-Rotation misst, um die Illustration korrekt zu zentrieren und zu skalieren) — nicht von Hand aus Bézier-Rätselraten gesetzt, wie die übrigen Icons in dieser Datei.
- **Bekannte kleine Unstimmigkeit, bewusst nicht behoben:** Die Sprechblase in `.hero__scene` (News/Präsentationen) ist weiterhin auf die ALTE Megafon-Ausrichtung getrimmt (Sprechblasen-Spitze zeigt nach rechts, wo früher der Trichter war) — bei der neuen Ausrichtung zeigt die Trichteröffnung stattdessen nach oben links, die Sprechblase "trifft" also nicht mehr exakt die Öffnung. Rein kompositorisch, kein Funktionsfehler — wird bei Bedarf in einem späteren Durchgang nachjustiert.

**Maskottchen-Neuausrichtung: SPARK löst PIX ab (2026-08-10, Nutzer-Entscheidung nach externem Master-Prompt).** Der Nutzer hat einen extern mitgebrachten, sehr umfangreichen Design-Prompt geteilt (`DESIGN-MASTERPROMPT.md`, reines Referenzdokument, nicht blind übernommen) und daraus per Rückfrage (`AskUserQuestion`) explizit ausgewählt: Maskottchen-Ersatz gehört zu den Dingen, die wirklich umgesetzt werden sollen — trotz des vorherigen mehrrundigen Investments in die Fuchs-Figur "PIX". Die frühere PIX-Historie (Zeilen oben) bleibt als Beleg stehen, wird nicht rückwirkend umgeschrieben.
- **Form:** Squircle (abgerundetes Quadrat, `rx=16` auf `48×48`) in Marken-Magenta, `3.2px`-Ink-Kontur — bewusst dieselbe visuelle Sprache wie Karten/Buttons, kein Tier-Clipart. Harter Versatz-Schatten (`13,15`-Offset-Rect in `--ink`, kein Blur) ist eine Wiederverwendung der schon etablierten `sticker-shadow`-Sprache (bisher nur beim Beta-Badge), keine neue Schattenart.
- **Gesicht:** minimal — zwei Punktaugen mit Glanzlicht, ein schlichter Bogen als Mund. Kein Detail-Overkill, Ausdruck kommt aus der Form, nicht aus Deko.
- **Blitz-"Antenne"** oben in Gelb, Namensgeber ("SPARK") und einziges Extra-Element.
- **Bug im ersten Entwurf, per Screenshot-Selbsttest gefunden:** Blitz wurde VOR dem Körper gezeichnet und dadurch von Schatten-/Körper-Rechteck größtenteils verdeckt — nur eine kleine gelbe Spitze war sichtbar. Korrigiert durch Zeichenreihenfolge-Tausch (Blitz jetzt nach dem Körper, damit er obenauf liegt).
- **Farben laufen komplett über `var(--accent)`/`var(--ink)`/`var(--yellow)`** — keine Hex-Werte hart kodiert. Ändert sich das Farbtoken-System (siehe ggf. weiterer Eintrag zum Pop-Art-Token-Vorschlag), zieht das Maskottchen automatisch mit, ohne eigene Anpassung.
- **In allen drei bestehenden Kontexten geprüft:** schwebende Bubble (voll + eingeklappt, siehe Kollisionsvermeidung oben) und `.fact-widget` (Präsentationen-Seite) — dieselbe `MASCOT_SVG`-Konstante versorgt beide, kein separater Pflegeaufwand.
- **Bewusst nicht angefasst:** Name/Text-Referenzen — "PIX" tauchte nie in sichtbarem UI-Text auf (nur in Code-Kommentaren), daher war an Seiteninhalten selbst nichts zu ändern.

**Nutzer-Screenshot deckt vier reale Fehler auf, die die eigene Isolations-Prüfung nicht gefangen hat (2026-08-10).** Ehrlicher Prozess-Fehler: das Megafon wurde nur auf seiner eigenen, isolierten Leinwand geprüft (als Ersteller UND einziger Prüfer — echter blinder Fleck), nie mit frischen Augen auf der fertig zusammengebauten Seite nach dem Einbau. `/impeccable critique` prüfte danach Layout/Heuristiken, nie "sieht das wirklich wie ein Megafon aus" — das ist kein Detektor-/Heuristik-Fund, sondern reine Illustrations-Treue, die nur ein echter visueller Politur-Durchgang fängt. Behoben:
- **Megafon-Trichter deutlich ausgeprägter verjüngt:** Hals-Höhe war `236`, Öffnungs-Höhe `304` (Verhältnis nur `~1,3:1`) — sah wie ein Rechteck mit angeklebtem Ring aus, nicht wie ein Horn. Jetzt Hals `90`, Öffnung `~330` (Verhältnis `~3,7:1`) — liest sich jetzt klar als Trichter. Verbindungsstück zum Griff entsprechend schmaler nachgezogen.
- **CSS-Leck behoben:** `.search svg` (fürs Präfix-Icon LINKS im Suchfeld) hatte keinen Nachfahren-Scope und traf deshalb auch das Icon im `.search__submit`-Button (ebenfalls Nachfahre von `.search`) — der Kreis-Button zeigte dadurch ein graues, sichtbar außermittiges statt weißes, zentriertes Icon. Jetzt `.search > svg` (nur direktes Kind).
- **Hero-Schatten ergänzt:** `--surface-secondary` ist identisch mit der Seiten-Hintergrundfarbe (beide `var(--paper)`) — ohne jede weitere Abgrenzung wirkte die Halbton-Punktmuster-Kante wie ein zufälliger Abbruch statt eine Kartenkante. `box-shadow: var(--shadow)` macht die Eingrenzung als bewusste Karte lesbar.
- **Stern-Doodle animiert** (Nutzer-Vorschlag): sanftes 3,4s-Funkeln (`scale`+leichte Rotation, `star-twinkle`), pausiert unter `prefers-reduced-motion`.

**Marken-Token-Umstellung: `tokens.css` + verifizierte Live-Site-Farben/-Fonts (2026-08-10).** Ursprünglicher Auftrag zitierte zwei nicht überprüfbare Quellen ("Live-Palette von sowespoke.com", "ONFINE Styleguide Rev. 0.5") — `sowespoke.com` kam im Projekt bis dahin nirgends als eigene Website vor (nur als E-Mail-Domain), das ONFINE-Dokument tauchte an keiner Stelle auf. Auftrag zunächst gestoppt und per Rückfrage geklärt (`AskUserQuestion`); Nutzer schickte danach echte Screenshots + die tatsächliche URL `https://www.sowespoke.com/`. Werte wurden **nicht** aus den Screenshots gepipettet, sondern per `curl` direkt aus der ausgelieferten Seite gelesen (WordPress-Theme, `--wp--preset--color--*`/`--wp--preset--font-family--*`-Variablen im HTML-Head) — dabei bestätigten sich die meisten der ursprünglich genannten Hex-Werte tatsächlich als korrekt (nur eben ohne verifizierbare Quellenangabe im Auftrag selbst).
- **Neue Datei `tokens.css`** (als erstes Stylesheet vor `fonts.css`/`styles.css` in `index.html` geladen) — einziger Ort im Projekt mit Marken-Hex-Literalen. Verifiziert: `--c-pink-500 #d4035f`, `--c-yellow-500 #ffc600`, `--c-green-500 #609274`, `--c-green-200 #b1c5a4`, `--c-ink #111111`, `--c-ink-60 #636363`, `--c-ink-30 #a4a4a4`, `--c-paper #f9f9f9`, `--c-surface #ffffff` (alle mit Preset-Namen kommentiert). Abgeleitet, nicht selbst als Live-Preset bestätigt: `--c-green-700 #4d755d` (20% abgedunkelt, AA-Textkontrast — `--c-green-500` selbst erreicht auf Weiß nur ≈3,6:1) und `--c-yellow-700 #c98a00` (Halbton-Textur-Punkte auf Gelb, unverändert aus der Vorgänger-Palette). Interne, nicht-Marken-UI-Tokens (Kategorie-/Status-Farben, Tint-Flächen) wurden unverändert aus `styles.css` mit umbenannten `--c-*`-Namen reloziert, nicht neu erfunden.
- **Bewusst NICHT übernommen:** die vier "Legacy-Cyan"-Töne aus dem ursprünglichen Auftrag — kein Beleg auf der Live-Seite (nur generische, nicht markenbezogene Gutenberg-Standardfarben) und die zitierte Quelle bleibt unbestätigt. Bei Bedarf bitte die echte Quelle nachreichen.
- **`styles.css` `:root`** umgestellt: alle bisherigen Rollen-Namen (`--ink`, `--paper`, `--accent`, `--yellow`, `--teal` usw.) bleiben unverändert bestehen, zeigen aber jetzt per `var(--c-*)` auf `tokens.css` statt eigene Hex-Literale zu tragen — keine einzige Komponente im restlichen File musste angefasst werden. `--teal` trägt jetzt bewusst das verifizierte Marken-Grün statt des vorherigen Türkis (Name historisch beibehalten, Farbe geändert).
- **Fonts:** Neo Sans Pro (echte Headline-Schrift der Live-Seite, kommerzielle Monotype-Lizenz, die dieses Projekt nicht besitzt) → Fallback **Exo 2** (Google Fonts, SIL OFL, self-hosted). Open Sans (echte, frei lizenzierte Fließtext-/UI-Schrift der Live-Seite) direkt übernommen, ebenfalls self-hosted (Dateien von der Live-Seite selbst geladen, Open Sans ist Apache-2.0-lizenziert). Baloo 2/Inter samt ungenutzter `.woff2`-Dateien entfernt — siehe `## Typography` für Details.
- **Bewusste Ausnahme vom "kein Hex außerhalb `tokens.css`"-Ziel:** die exportierte E-Mail-Signatur (`app.js`, `copyRichBtn`-Handler) landet im Gmail-Compose-Fenster ohne Zugriff auf unsere CSS-Variablen und muss deshalb einen portablen Literal-Wert tragen (`#111111`, aktualisiert auf den neuen Marken-Ink-Ton) — dieselbe Kategorie Ausnahme wie die dort bereits bestehende Verdana-Schriftart.
- **Verifiziert:** projektweite Hex-Suche über `styles.css`/`app.js`/`icons.js`/`index.html` liefert nach der Umstellung nur noch den einen dokumentierten Ausnahme-Treffer; Screenshot der Startseite bei 1920px bestätigt korrekt aufgelöste Farb-/Font-Tokens (kein ungestyltes Element, kein Kontrastbruch).

## Colors

Restrained-Strategie mit einer dominanten Markenfarbe: Magenta trägt Interaktion und Aufmerksamkeit, Petrol und Gelb sind auf Logo bzw. Beta-Kennzeichnung begrenzt. Kategorie-Tinten bleiben ein kleines, kontrolliertes Wayfinding-System auf den Zeilen-Thumbnails.

### Primary
- **Marken-Pink** (`#d4035f`, Token `--c-pink-500`): Buttons, aktiver Tab-Unterstrich, aktiver Sidebar-Eintrag, Aufzählungspunkte, Link-Hover. Erscheint klein und oft statt großflächig und selten — trägt Interaktion, nicht Fläche. Verifiziert von der echten Live-Seite `sowespoke.com` (2026-08-10), siehe `tokens.css`.

### Secondary
- **Signal-Gelb** (`#ffc600`, Token `--c-yellow-500`): Beta-Badge (dunkler Text, `on-yellow` — auf Gelb ausnahmslos `--c-ink`, nie Weiß) sowie als Sparkle-/Sticker-Akzent in den Eck-Illustrationen (Hero, Seitenkarte, Info-Box) — immer klein, nie als eigene Fläche.
- **Marken-Grün** (`#609274`, Token `--c-green-500`, historischer CSS-Variablenname weiterhin `--teal`): Logo-Mark in der Sidebar sowie als kleiner Punkt-Akzent in den Eck-Illustrationen. Für Fließtext/Links gilt die abgedunkelte `--c-green-700` (`#4d755d`) — `#609274` selbst erreicht auf Weiß nur ≈3.6:1 Kontrast, unter dem AA-Minimum von 4.5:1.

### Neutral
- **Tiefschwarz** (`#111111`, Token `--c-ink`): Fließtext, Icon-Sidebar-Icons.
- **Grauschiefer** (`#636363`, Token `--c-ink-60`): sekundärer Text (Meta-Zeilen, Zusammenfassungen).
- **Warmpapier→Neutralweiß** (`#f9f9f9`, Token `--c-paper`): Seitenhintergrund — seit der Marken-Token-Umstellung (2026-08-10) kühler/neutraler statt warm-beige, folgt der verifizierten Live-Seite.
- **Reinweiß** (`#ffffff`, Token `--c-surface`): Karten-Füllung.
- **Trennlinie** (`#e7e3db`): 1px-Linien zwischen Listenzeilen und Tabs — die einzige "Kontur" im System. Internes UI-Token, kein Live-Site-Marken-Preset.
- **Grün-Tint** (`#e2f3f2`): helle Fläche, Pendant zu `accent-tint` — u.a. Hero-Hintergrund. Internes UI-Token (Name historisch `--teal-tint`), unverändert aus der Vorgänger-Palette übernommen.
- **Warnung** (`#7a4a00` Text auf `#fff3d6`-Fläche): eigenständiges, a11y-sicheres Warnhinweis-Paar (`.feed__notice`, `.mailgen__warning`) — bewusst kein Signal-Gelb (`--yellow`), da dessen Kontrast auf hellem Grund für Fließtext nicht ausreicht. Aus zwei zuvor undokumentierten Literalwerten in `--warning`/`--warning-tint` überführt (2026-08-07).

**Kork entfernt (2026-08-07, spät).** Die Tokens `--cork`/`--cork-dark` und die Kork-Textur auf `.shell__main` sind vollständig entfernt — explizite Nutzeranweisung ("Bitte nicht wieder das aktuelle Korkwand-Design als Grundlage nehmen"). Die Content-Fläche ist jetzt flaches `--paper`. Das Halbton-Punktmuster lebt nur noch begrenzt im `.hero`-Hintergrund weiter, nicht mehr seitenweit.

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

**Kurskorrektur nach konkretem Mockup (2026-08-07, spät).** Nutzer lieferte einen ausführlichen 32-Punkte-Brief plus ein reales Bild-Mockup — löst die vorherige Case-Wall-Ausführung in mehreren Punkten ab, Grundidee (Kork-Atmosphäre) bleibt, Ausführung wird ruhiger/professioneller:
- **Karten sind wieder gerade** (keine Rotation), **kein Reißnagel mehr** (war rein dekorativ ohne erkennbare Bedeutung — Brief Punkt 19 verlangt explizit Entfernen oder drastisches Reduzieren bei fehlender Funktion). Karten: `1px`-Rand + `--shadow`/`--shadow-hover`, `14px`-Radius, `24px`-Innenabstand, Titel/Zusammenfassung mit `-webkit-line-clamp` für gleiche Kartenhöhe.
- **Sidebar** von Icon-only (`76px`) auf beschriftete Version (`236px`, nur echte Seiten — keine erfundenen Menüpunkte) — Logo mit mehr Luft, aktive Seite: Tint-Hintergrund + zusätzlicher linker Farbbalken (nicht nur Farbe als Unterscheidung). Fällt auf Mobile zurück auf Icon-only.
- **Hero:** Illustration kein absolut positioniertes Frei-Element mehr, sondern normales Flex-Kind, moderat groß (nicht das Layout dominierend). `<mark>` ist jetzt farbiger Text mit Unterstreichung statt Pillen-Hintergrund. Sprechblasen-Form über dem Megafon ergänzt (ohne eingebetteten Fließtext — bei ~200px Anzeigegröße nicht lesbar).
- **Suche + Filter** aus dem Hero ausgelagert in eine gemeinsame `.toolbar` darunter — vorher wirkten sie "disconnected".
- **Sektions-Header** (`feed__title`) verliert die Tesafilm-Pillen-Optik ("sah aus wie ein schwebender Button") — schlichte Überschrift, Ergebnis-Anzahl als eigene rosa Pille (`feed__title__count`).
- **Hintergrund-Punktmuster** auf `.shell__main` von 0.11-0.16 Deckkraft auf 0.035-0.05 reduziert — sollte kaum wahrnehmbares Papierkorn sein, kein auffälliges Muster über der gesamten Lesefläche.
- **Semantische Alias-Tokens** ergänzt (`--brand-primary`, `--surface`, `--text-primary` usw.), zeigen auf dieselben Werte wie die Marken-Tokens — keine zweite Palette, nur zusätzliche Namen für den Fall, dass Komponenten sie nutzen wollen.
- **Maskottchen** bekommt eine runde Brille (Richtung "PIX" aus einem Maskottchen-Moodboard: neugierig, sucht immer nach Wissen — passt zum Produkt).
- Case-Wall-Kork-Hintergrund und die drei typgebundenen Karten-Illustrationen (Seitenkarte/Info-Box/Mail-Generator) bleiben unverändert — die Kurskorrektur betrifft die Artikel-Liste/Karten-Ebene, nicht die gesamte Richtung.

**Zweite Kurskorrektur nach detailliertem 32-Punkte-Brief + drei Bild-Mockups (2026-08-07, spät).** Nutzer lieferte einen noch ausführlicheren Brief samt drei realen Bild-Mockups als explizites "Visual Target" und der ausdrücklichen Anweisung, das Kork-Design nicht mehr als Grundlage zu nehmen und nicht eigenständig auf ein generisches Minimal-Dashboard zurückzufallen. Umgesetzt:
- **Kork-Hintergrund vollständig entfernt** (siehe Colors) — `.shell__main` ist jetzt flaches `--paper`, kein Textur-/Punktmuster mehr über der gesamten Fläche.
- **Hero neu strukturiert:** Illustration ist jetzt kompakt (`340×215px`, mobil `220×139px`) und sitzt nach der Intro statt sie zu verdrängen; Halbton-Punktmuster ist auf den Hero-Hintergrund begrenzt (`.hero` selbst, `background-image` mit geringer Deckkraft), nicht mehr seitenweit. `<mark>` ist jetzt schwarze Wellenlinien-Unterstreichung (`text-decoration-style: wavy`) statt Farbfläche oder farbiger Unterstreichung — Text bleibt in Akzentfarbe. Neue `.hero__bubble`: echte Sprechblasen-Komponente mit kurzem Klartext (weißer Hintergrund, `3px`-Ink-Rahmen, Dreieck-Spitze über `::before`/`::after`) statt der vorherigen leeren Sprechblasen-Form.
- **Suche + Filter:** Suchfeld jetzt mit rundem, rosa Such-Button (`.search__submit`, 40px) rechts im Feld statt nur Icon links; Filter-Tabs von Unterstrich-Optik auf Pill-/Chip-Optik umgestellt (`.tabs__item`: weißer Hintergrund + Rand, aktiv = volle Akzentfarbe + weißer Text) — auffälliger und dem Mockup entsprechend.
- **Karten-Raster** von `minmax(15.5rem,1fr)`/`space-5`-Gap auf `minmax(19rem,1fr)`/`space-6`-Gap vergrößert — luftiger, wie im Referenzbild gefordert.
- **Selektive Comic-Badges statt Reißnagel:** neues `.card-badge`/`.card-badge--new`-System (Sticker-Optik, `-6deg`-Drehung, harter Schatten) zeigt "Neu" **nur** bei Präsentationen mit bekanntem Datum (`dateKnown === true`) und einem Alter ≤ 21 Tage (`isRecent()`-Helper in `app.js`) — nicht auf jeder Karte, und nie bei Einträgen ohne echtes Datum (die nur einen Datei-Zeitstempel als Sortier-Fallback tragen).
- **Sidebar-Profil-Stub:** neuer Block unten in der Sidebar (`.rail__profile`), lädt die echte Session-E-Mail über den neuen Endpunkt `functions/api/auth/me.js` (Google liefert keinen Namen/kein Foto, daher nur E-Mail + generischer Platzhalter "Team-Mitglied") — keine erfundenen Namen/Rollen/Fotos. Auf Mobile ausgeblendet.
- **"Wusstest du schon?"-Widget:** neue `.fact-widget`-Komponente unterhalb des Präsentationen-Rasters (eigene Sprechblasen-Optik wie das schwebende Maskottchen, aber eigene DOM-IDs zur Kollisionsvermeidung), nutzt dieselben `factOfTheDay()`/`randomFact()`-Funktionen aus `fun-facts.js`. Auf explizite Anweisung ("Diese unteren Module nicht komplett weglassen") umgesetzt — die drei weiteren im Mockup gezeigten Module (Newsletter-Anmeldung, Top-Kategorien, Feedback-Box) sind bewusst zurückgestellt ("Erstmal nur Restyling, Widgets später").
- **Bewusst zurückgestellt:** die volle Maskottchen-Familie (9 Charaktere aus dem Moodboard) über PIX hinaus, sowie die drei zusätzlichen Widgets — folgen in einem späteren Durchgang.

**Mutigere Umsetzung des bestehenden Systems (2026-08-07).** Audit-Feedback: die Marke war schon richtig angelegt, wurde aber zu zaghaft ausgeführt. Bestätigt durch echte Sowespoke-Firmenmaterialien (sowespoke.com, Präsentationsfolien) als Referenz: großflächigere Halbton-Punktfelder, Comic-Sticker-Badges mit hartem Versatz-Schatten statt weichem Blur, echte Kartenillustrationen statt drei bloßer Punkte. Nichts an Farbpalette, Fonts oder Struktur geändert — nur die Ausführung verschärft:
- Kartenschatten (Seitenkarte/Info-Box/Mail-Generator) hatten `0 0 26px` Versatz — ein Schatten ohne Offset ist ein aufgemalter Ring, keine echte Tiefe. Jetzt `0 14px 32px -14px`, Richtung wie `shadow-hover`.
- `SIDECARD_ILLUSTRATION` (drei bloße Punkte, für alle Kartentypen identisch) ersetzt durch drei eigene, typgebundene Mini-Cluster: `SIDECARD_ILLUSTRATION` (magenta, Halbton-Patch + Konfetti), `INFOBOX_ILLUSTRATION` (petrol, Mini-Blob nach `BRAND_BLOB`-Vorbild), `MAILGEN_ILLUSTRATION` (gelb, Mini-Burst nach `BRAND_BURST`-Vorbild) — `BRAND_BLOB`/`BRAND_BURST` bleiben als eigenständige Konstanten unbenutzt, ihre Formsprache lebt jetzt verkleinert in diesen drei Karten-Illustrationen weiter. Jede nutzt zusätzlich 1-2 Konfetti-Punkte in den bisher nur auf Zeilen-Thumbnails sichtbaren Wegweiser-Tinten (`--cat-*`) — mehr Farbpräsenz ohne neue, undokumentierte Werte.
- Beta-Badge (`.flash`) ist jetzt ein Comic-Sticker: `1.5px` Ink-Rand, harter `1.5px 1.5px 0`-Schlagschatten (kein Blur), `-2deg` Drehung — passend zur Sticker-/Halbton-Sprache der echten Firmenmaterialien. `.flash--muted` bleibt schattenlos und gerade (dezente Variante).
- Hero-Headline von `clamp(1.85rem, 1.3rem+2vw, 2.75rem)` auf `clamp(2.1rem, 1.3rem+2.6vw, 3.15rem)` angehoben (Breitbild-Override entsprechend auf `3.85rem`-Deckel); Hero-Illustration bekommt echten Schattenwurf (`drop-shadow`, folgt der Alphaform); Hero-Intro/Suche erhalten einen einmaligen, dezenten Eintritts-Moment (`hero-in`, 420ms, wie das bestehende Maskottchen-Timing) statt Sofort-Erscheinen.
- Halbton-Punktraster auf Zeilen-Thumbnails deutlich sichtbarer gemacht (Opazität 0.6→0.78, dichteres Raster).
- **Bewusst nicht geändert:** Listen-Zeilen bleiben ohne Eintritts-Animation — Prinzip 1 aus `PRODUCT.md` ("Schneller Zugriff schlägt Vollständigkeit") verbietet, das Scannen der Liste künstlich zu verzögern.

**Verbundene Hero-Komposition + Maskottchen-Feinschliff (2026-08-07, spät).** Konkretes Feedback anhand von zwei Screenshots (News-Hero wirkte auseinandergezogen, Fakten-Box wirkte "unten rechts geparkt"):
- News-Hero bekommt einen neuen Modifier `.hero--connected` (nur diese Seite, andere Hero-Instanzen unverändert): `.hero__bubble` + `.hero__illustration` sind jetzt in `.hero__scene` zu EINER Einheit gebündelt (Bubble überlappt die Illustration um `14px`) statt als eigenständige Flex-Geschwister über `justify-content:space-between` auf der vollen Hero-Breite verteilt zu sein — vorher wirkte die Bubble wie ein freistehendes Mittelelement, das Megafon wie an den Rand gedrängt.
- Headline erzwingt jetzt 2 Zeilen ("Neuigkeiten aus der" / "Online-<mark>Marketing-Welt</mark>."), nur noch EIN Wortteil pink+wellenunterstrichen statt zwei.
- Neues `.hero__eyebrow`-Label ("News & Insights") über der Headline, neuer `.hero__sticker` ("Live Updates") an der Illustration — beide selektiv eingesetzt, kein neues Muster für andere Seiten.
- `HERO_ILLUSTRATION` (geteilt über alle Seiten) um ein Mini-Blitz-Symbol + zwei zusätzliche Konfetti-Punkte ergänzt — "mehr Bewegung", additiv, kein Strukturbruch.
- `.tabs__item` (global, alle Filter-Leisten) jetzt mit gedämpfter Textfarbe/Gewicht im Ruhezustand — nur der aktive Filter bleibt kräftig pink, das war vorher zu gleichmäßig kräftig für alle Zustände.
- Maskottchen (`.mascot`) + Fakten-Widget (`.fact-widget`) parallel überarbeitet: größere Figur (52→74px bzw. 64→88px), negative Margin für Überlappungs-/"Halte"-Effekt mit der Sprechblase, neues Label "Wusstest du schon?" in der schwebenden Bubble (vorher nur im Inline-Widget vorhanden), weicherer/größerer Schatten, CTA "Noch ein Fakt →" jetzt als gefüllter Pillen-Button statt Text-Link, feineres Schließen-Icon (kleiner, gedämpfte Opazität), Pop-in-Animation mit Scale+Bounce (bewusste Wiederverwendung derselben, bereits geprüften Bounce-Kurve wie bei `.row__thumb`).

**Seitenübergreifender Konsistenz-Durchgang (2026-08-07, spät).** Die letzten Design-Runden konzentrierten sich auf News/Präsentationen — die übrigen vier Seiten (Vorlagen, Case Studies, Microsoft Learn, Anfragen) blieben auf älteren Mustern zurück. Ein gezielter Audit (Vergleich aller Hero-/Toolbar-/Feed-Title-Strukturen gegen den News-Stand) fand und behob:
- **Hero-Reihenfolge:** Vorlagen/Case Studies/Microsoft Learn/Anfragen hatten `.hero__illustration` VOR `.hero__intro` (Bild zuerst) — jetzt überall Text zuerst, Illustration danach, wie auf News/Präsentationen.
- **`.hero__eyebrow`** (kleines Label über der Headline) jetzt auf allen 6 Seiten vorhanden, nicht nur News: "Offizielle Quelle" (Präsentationen), "Wissensdatenbank" (Vorlagen), "Kundenergebnisse" (Case Studies), "Microsoft Learn", "Service-Anfragen" (Anfragen).
- **Präsentationen** bekommt dieselbe `.hero__scene`-Bündelung (Bubble+Illustration) wie News (vorher noch die alte 3-Geschwister-Variante) sowie das fehlende `.toolbar__label`.
- **Echte Suche/Filter ergänzt, wo bisher keine existierte:** Vorlagen (durchsucht Best Practices + eigenständige Vorlagen + verknüpfte Präsentationsvorlagen gemeinsam), Case Studies (Suche + Kanal-Tabs, Tabs nur sichtbar wenn mehr als ein Kanal tatsächlich vorkommt — vermeidet leere Tabs bei wenig Daten), Microsoft Learn (client-seitige Suche über die bereits geladenen Quellen). Alle drei nutzen den bestehenden `wireTopControls()`-Helper, keine neue Suchlogik erfunden.
- **`.feed__title__count`-Pille** jetzt auch bei "Best Practices" und "Eigenständige Vorlagen" (vorher nur bei "Vorlagen aus Präsentationen" auf derselben Seite — uneinheitlich).
- **`#learn-feed` fehlte die `.feed`-Klasse** (Layout-Bug, keine Feed-Abstände) — ergänzt.
- **Verwaiste CSS-Klasse `.side-card__link`** entfernt (keine Referenz mehr im Markup, Rest eines früheren Karten-Musters).

## Typography

**Display Font:** Exo 2 (mit Segoe UI, system-ui als Fallback) — nur für die große Hero-/Seiten-Headline. Fallback für die echte Headline-Schrift der Live-Seite `sowespoke.com`, **Neo Sans Pro** (Monotype, kommerziell) — dieses Projekt hat dafür keine eigene Webfont-Lizenz, die Live-Seite hostet ihre eigenen, für sie lizenzierten Dateien. Exo 2 (Google Fonts, SIL Open Font License, self-hosted unter `assets/fonts/`) gewählt als frei lizenzierter, geometrisch verwandter Ersatz. Sollte künftig eine Neo-Sans-Pro-Lizenz für dieses Projekt vorliegen, kann `--font-display` direkt darauf umgestellt werden.
**Body Font:** Open Sans (mit Segoe UI, system-ui als Fallback) — für alles andere, inklusive fetter Titel/Buttons/Labels über `font-weight`, nicht über einen Schriftwechsel. Echte, frei lizenzierte (Apache 2.0) Fließtext-/UI-Schrift der Live-Seite `sowespoke.com`, self-hosted unter `assets/fonts/`.

**Character:** Exo 2 ist bewusst auf einen einzigen Moment pro Seite begrenzt (die Headline) — das hält die Markenpersönlichkeit sichtbar, ohne die Scanbarkeit der Liste zu stören. Alles, was gelesen statt nur wahrgenommen wird, bleibt in Open Sans.

**Vorherige Schriften (bis 2026-08-10):** Baloo 2 (Display) / Inter (Body) — beide self-hosted, beide durch die Marken-Token-Umstellung ersetzt (siehe Log-Eintrag "Marken-Token-Umstellung"). Nicht mehr im Projekt vorhanden.

### Hierarchy
- **Display** (700, `clamp(2.1rem, 1.3rem + 2.6vw, 3.15rem)`, 1.12; ab `90rem` Breite `clamp(2.4rem, 1rem + 3vw, 3.85rem)`): Seiten-Headline, genau einmal pro Seite.
- **Headline** (700, `clamp(1.6rem, 1.2rem + 1.6vw, 2.25rem)`): Detail-Seitentitel — ebenfalls Baloo 2, als Fortsetzung der Headline-Rolle.
- **Title** (700, 1.05rem, Inter): Zeilentitel in der Artikel-Liste, Kartentitel.
- **Body** (400, 1rem, 1.55; Messbreite bis 68ch): Beschreibungstexte, E-Mail-Inhalt.
- **Label** (600, 0.76–0.95rem): Tabs, Meta-Zeilen, Formularlabels.

## Layout

Zwei-Spalten-Shell: `236px` breite, beschriftete Sidebar (sticky) + Hauptbereich, maximal `68rem` Content-Breite, zentriert. Die Übersicht selbst ist ein `minmax(0,1fr) 20rem`-Grid (Artikel-Liste + Seitenkarte), das unter `60rem` auf eine Spalte fällt. Tabs sind horizontal scrollbar (`overflow-x:auto`) statt umzubrechen — funktioniert bei 5+ Kategorien auch auf schmalen Screens.

**`/impeccable delight` (2026-08-10).** Für ein Operate-Tool gilt laut Skill-Leitfaden: Delight an verdienten Momenten konzentrieren (Erstnutzung, Abschluss, Erholung), nicht als generische Deko verstreuen — deckt sich mit dem Kritik-Fund "Marketing-Möbel auf einem Operate-Tool". Bewusst NICHT das schwebende Maskottchen von der Seite entfernt (das wäre eine größere Scope-Änderung ohne explizite Nutzer-Freigabe) — stattdessen zwei kleine, verdiente Momente ergänzt statt neuer Deko:
- **Bewertungs-Bestätigung** (schließt den P2-Kritik-Fund): `.row__rate-status` wird jetzt nach einem Klick mit "Danke für dein Feedback."/"Danke, notiert." befüllt, `aria-live="polite"` für Screenreader, ruhiger 200ms-Fade — bewusst kein großes Fest für eine Routine-Handlung ("routine saves should simply feel certain", nicht "zelebriert").
- **"Zuletzt aktualisiert um HH:MM Uhr"** unter der Feed-Überschrift, aus `data.generatedAt` (war bereits im API-Response vorhanden, bisher ungenutzt) — echter Systemstatus statt der bisherigen Marketing-Tagline im Hero (die bleibt vorerst bestehen, nur ergänzt, nicht ersetzt), verbessert Heuristik 1 (Systemstatus) mit einer einzigen, unaufdringlichen Zeile.

**`/impeccable critique` → Layout-Korrekturen (2026-08-10).** Erste vollständige Kritik-Runde mit echten Screenshots (siehe `WORKFLOW.md`) fand einen P0: Hero+Toolbar füllten auf 1440×900 UND 390×844 den kompletten ersten Bildschirm — kein einziger Artikel war ohne Scrollen lesbar, direkter Widerspruch zum eigenen Kernprinzip "schneller Zugriff". Behoben:
- `.hero__intro h1` Font-Größen-Deckel von `4.2rem` auf `2.75rem`, `line-height` 1.08→1.1 (Screenshot bestätigt: Headline bleibt zweizeilig mit Highlight, wirkt aber deutlich kompakter).
- `.hero--connected` Padding `space-6`→`space-5`, `margin-bottom` `space-4`→`space-3`; `.toolbar` `gap` `space-4`→`space-3`, `margin-bottom` `space-6`→`space-4`; `.hero__intro p` `margin-top` `space-4`→`space-3`, Schriftgröße `1.05rem`→`1rem`.
- Ergebnis: auf 1440×900 sind jetzt zwei vollständige Artikel-Karten inkl. Beschreibung sichtbar, auf 390×844 Überschrift + erste Karte.
- **Bewertungs-Buttons** (`.row__rate`, News-Karten) waren auf allen 8 Karten dauerhaft aktiv — 16 permanente Tap-Ziele, die mit dem eigentlichen Scan-Inhalt konkurrierten. Jetzt nur bei `li:hover`/`li:focus-within` sichtbar auf Geräten mit echtem Hover (`@media (hover:hover) and (pointer:fine)`); auf Touch bleiben sie sichtbar (dort keine Hover-Entdeckung möglich). Eine bereits abgegebene Bewertung (`.is-voted`) bleibt über `:has()` immer sichtbar — Systemstatus geht vor Aufräumen.
- **Maskottchen-Einklapp-Verhalten**: die Kritik deckte auf, dass die Bubble (`pointer-events:auto`) beim Scrollen auf Mobile echte Taps auf Artikelkarten blockierte, nicht nur optisch überlappte. Neue `.mascot--collapsed`-Klasse blendet die Bubble aus und lässt nur die kleine, weiterhin schwebende Figur stehen, sobald `getBoundingClientRect()` eine Überlappung mit `.feed` misst (`mascotOverlapsFeed()`/`updateMascotCollapse()`, geprüft bei Erscheinen, `resize` und ungedrosselt bei `scroll`) — klappt automatisch wieder auf, sobald kein Feed-Inhalt mehr darunter liegt.

**Maskottchen-Kollisionsvermeidung (2026-08-10).** Erster echter Screenshot-Selbsttest dieser Session (lokaler Static-Server + Playwright mit installiertem Edge, siehe Arbeitsanweisung `WORKFLOW.md`) deckte auf: Das fix positionierte Maskottchen unten rechts überlappte strukturell die "Anstehende Termine"-Karte im `.side-rail` (News-Seite, Desktop) sowie Suchfeld/Filter-Pills im `.toolbar` (Mobile) — unabhängig von der Feed-Länge, weil beide Elemente ihre Position unabhängig vom Feed-Inhalt haben. Reine Größenreduktion (`max-width` von `19rem` auf `15rem`/`12.5rem` mobil) reichte nicht aus. Lösung: `avoidMascotCollision()` in `app.js` prüft beim Erscheinen (und debounced bei `resize`) die tatsächliche `getBoundingClientRect()`-Überlappung mit `.side-rail`/`.toolbar` und schiebt die Blase per `bottom`-Offset nach oben. Bewusst NICHT gegen `.feed` geprüft — darüber hinwegzuscrollen ist normales, akzeptiertes Verhalten für ein schwebendes Element. Wäre der nötige Versatz unrealistisch groß (> `180px`, z. B. auf sehr kurzen Mobile-Viewports, wo die Hero-Headline allein schon den ersten Bildschirm füllt), bleibt die Blase bis zum ersten Scroll-Event unsichtbar, statt eine schlechte Position zu erzwingen.

**Hero-Box aufgelöst → seitenweiter, ausblendender Hintergrund (2026-08-10).** Der Hero war bisher eine abgegrenzte Karte (`background-color`, Punktraster als Element-Hintergrund, `box-shadow`, plus zwei `::before`/`::after`-Farbwolken bei `.hero--connected`) mit sichtbarer Kante zum Rest der Seite. Ersetzt durch `.page-bg`, ein rein dekoratives `<div>` (erstes Kind von `.shell__main`, `aria-hidden`), das seitenweit (randlos bis Sidebar/Fensterrand) hinter dem Content liegt, mit dem Content mitscrollt (kein `position:fixed`) und über ein gemeinsames `mask-image` (linear-gradient, 0–30 % voll deckend, 30–65 % linear auf 50 %, 65–100 % auf 0 %) gleichmäßig nach unten ausblendet — Höhe `clamp(420px, 55vh, 760px)`, mobil `clamp(280px, 40vh, 420px)`. Inhalt: Halbton-Punktraster (`var(--c-ink)` bei 8 %) plus zwei sehr dezente Farbwolken (`var(--c-pink-100)`/`var(--c-yellow-100)`, je max. 40 % Deckkraft, mobil 25 %) als radiale Gradients — alle drei Ebenen liegen auf demselben Element, damit die Maske sie gemeinsam statt einzeln/uneinheitlich ausblendet. `prefers-reduced-transparency: reduce` zeigt nur die flache `--c-paper`-Fläche ohne Muster/Wolken. `.hero` selbst verlor dadurch `background`, `background-image`, `border-radius` und `box-shadow`; die alten `.hero--connected::before/::after`-Glow-Kreise entfielen ersatzlos (Funktion jetzt bei `.page-bg`).
  - **Reproduzierbarer Bug beim Bau (Screenshot-Selbsttest):** `.page-bg` war mit `position:relative` am Elternteil `.shell__main` zunächst komplett unsichtbar — selbst ein Testweise auf 100 % Deckkraft/Rot-Blau gesetzter Hintergrund zeigte sich nicht. Ursache: `position:relative` allein erzeugt noch keinen eigenen Stacking-Context (CSS2.1 Anhang E); das `z-index:-1` von `.page-bg` "entwich" dadurch in einen weiter oben liegenden Kontext und landete hinter fremden Geschwistern (u. a. der `position:sticky`-Sidebar). Fix: `.shell__main` bekam zusätzlich `z-index: 0`, wodurch es einen eigenen, lokalen Stacking-Context erzwingt — danach sofort sichtbar, per Screenshot bestätigt.
  - Neue Tint-Tokens `--c-pink-100`/`--c-yellow-100` in `tokens.css`: auf der Live-Seite nicht als eigener Preset vorhanden, daher rechnerisch per `color-mix()` aus dem verifizierten 500er-Wert abgeleitet (Mix mit Weiß) und als solche kommentiert — kein erfundener, aber auch kein bestätigter Live-Wert.

**Fluide Content-Breite statt Sprungfixum (2026-08-10, Master-Prompt Abschnitt 2 — "aktuell größtes Problem").** `.view` hatte einen festen `max-width`-Sprung (`68rem` bis `90rem` Viewport, danach fix `88rem`) — per Screenshot-Selbsttest gemessen: bei 2560px blieben dadurch 916px/35,8 % der Viewport-Breite ungenutzt rechts leer (bei 1920px bereits 14,4 %, an der eigenen 15-%-Grenze aus dem Master-Prompt). Ersetzt durch einen einzigen `clamp(68rem, 44rem + 48vw, 130rem)` — wächst stetig mit der Viewport-Breite statt bei fester Marke zu springen, Deckel bei `130rem` (2080px, greift rechnerisch erst ab ca. 2870px/4K) verhindert unangenehm lange Zeilen. Gemessen nach dem Fix: 1920px → 3,0 % Leerraum, 2560px → 15,3 % (Zielwert erreicht). 375/768/1024/1280/1440px unverändert, kein horizontaler Overflow bei irgendeiner getesteten Breite (375–2560px, per `scrollWidth`-Check bestätigt). Die Spalten-Anzahl im Artikel-Grid wächst dadurch automatisch mit (3 Spalten bei 1920px → 4 bei 2560px), da `repeat(auto-fill, minmax(17rem,1fr))` bereits fluid war — keine Anpassung dort nötig.

**"LIVE UPDATES"-Puls-Punkt (2026-08-10, Master-Prompt Abschnitt 3.5).** Kleiner `.hero__sticker-dot` (6px, `var(--accent)`) vor dem Text, pulsiert dezent (`sticker-pulse`, 1.8s, Opacity+Scale), pausiert unter `prefers-reduced-motion`. Die übrigen Abschnitt-3-Punkte waren bereits vor diesem Durchgang erledigt: Sidebar-Footer scrollt korrekt mit (`.rail` selbst `overflow-y:auto`, `.rail__profile { margin-top:auto }`), Best-Practices-Karten sind geklammert (siehe Eintrag oben), das Megafon ist bereits die Pop-Art-Comic-Version mit dicker Kontur/Halbton/Magenta-Fläche.

**`ui-ux-pro-max`-Audit der Startseite (2026-08-11).** Erster tatsächlicher Durchlauf dieser Skill in dieser Session — vorher stand sie zwar als Pflichtschritt in `WORKFLOW.md`, konnte aber nie wirklich laufen, weil Python auf dem Rechner fehlte (seit diesem Tag nachinstalliert). `--design-system` lieferte für ein internes B2B-Tool eine unpassende generische Empfehlung (Rot/Gold-"Team"-Farbschema) — bewusst NICHT übernommen, da im Widerspruch zur verifizierten echten Marken-Palette (siehe Eintrag "Marken-Token-Umstellung"). `--domain ux`/`--domain product` lieferten dagegen brauchbare, plattformunabhängige Prüfpunkte, gegenkontrolliert per echtem Playwright-Screenshot/DOM-Messung (nicht nur Code-Lesen):
- **Skip-Link:** erster Messversuch zeigte scheinbar `top:-900px` trotz Fokus — Fehlalarm, reines Timing-Artefakt (Messung 0ms nach dem Tab-Druck, vor Abschluss der 150ms-CSS-Transition). Nach Wartezeit bestätigt: funktioniert korrekt (`top:16px`, sichtbar).
- **Touch-Targets zu klein (echter Fund):** `.search__submit` (40×40px) und `.tabs__item` (Filter-Pills, ~40px Höhe) lagen unter dem 44×44px-Minimum. Behoben: `.search__submit` auf `44×44px`, `.tabs__item` bekommt `min-height:44px` (statt nur Padding, damit die Höhe unabhängig von Font-Metriken garantiert 44px erreicht) — per Screenshot bestätigt, keine optische Regression.
- **Kontinuierliche Deko-Animationen** (`mascot-float`, `sticker-pulse`) widersprechen der generischen Regel "infinite animation nur für Ladeindikatoren" — bewusst NICHT entfernt, da beides explizit angefragte, bereits mehrfach geprüfte Comic-Personality-Details sind; beide respektieren `prefers-reduced-motion` (globale `* { animation-duration: 0.01ms !important }`-Regel), damit ist die eigentliche Zugänglichkeits-Anforderung erfüllt.
- Fokus-Ringe (`:focus-visible`, 3px Akzent-Outline), Heading-Hierarchie (h1→h2, kein Sprung) und Skip-Link-Vorhandensein bereits vor diesem Audit korrekt.

Mobil (`48rem`): Sidebar fällt auf Icon-only (`44px`-Quadrate, Labels ausgeblendet) zurück, wird zur horizontalen Top-Leiste statt zu verschwinden oder umzubrechen.

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

### Karte (`article-list li` + `row`)
- **Aufbau:** Weiße Karte, `1px`-Rand (`--border`), `14px`-Radius, `--shadow`, `24px`-Innenabstand über `.row`. `52px` farbiges Icon-Thumbnail (Kategorie-Tinte, sichtbares Halbton-Punktraster) oben, Meta-Zeile (Datum, Kategorie, Beta-Badge), Titel (Inter 700, max. 2 Zeilen), Zusammenfassung (max. 3 Zeilen), Pfeil-Icon unten rechts (absolut positioniert). Alle Karten in einer Grid-Zeile gleich hoch (`align-items:stretch` + Line-Clamp).
- **Kein Reißnagel mehr** (Kurskorrektur 2026-08-07): war rein dekorativ ohne erkennbare Bedeutung, wirkte laut Nutzer-Feedback wie ein bedeutungsloses Element auf jeder Karte.
- **Keine Rotation mehr** (Kurskorrektur 2026-08-07): erste Case-Wall-Fassung drehte Karten bis zu `±3.2deg` für den "handgepinnt"-Effekt — Nutzer-Feedback: wirkt "messy", nicht "kreativ". Karten sind jetzt exakt am Raster ausgerichtet.
- **Trennung:** Rasterabstand (`24px`) statt Trennlinie — jede Karte ist eine eigenständige Fläche mit Rand + Schatten.
- **Hover:** Titel und Pfeil wechseln zu Magenta, Pfeil verschiebt sich `3px` nach rechts, Karte hebt sich leicht an (`translateY(-3px)`), Rand wird magenta, Schatten wird `shadow-hover`.
- **Ausnahme:** `feed__divider` (z. B. "Ohne bekanntes Datum") bekommt keine Karten-Optik — bleibt schlichtes, `grid-column: 1/-1` spannendes Textlabel innerhalb desselben Rasters.

### Seitenkarte / Info-Box / Mail-Generator
- **Style:** Weiß, `14px` Radius, `shadow-glow` (typfarbig, siehe Elevation), `3px`-Typrahmen (Seitenkarte magenta, Info-Box petrol, Mail-Generator gelb), `1.5rem` Innenabstand.
- **Eck-Illustration:** je eine eigene, typgebundene Mini-Cluster-Illustration oben rechts (`SIDECARD_ILLUSTRATION`/`INFOBOX_ILLUSTRATION`/`MAILGEN_ILLUSTRATION` in `icons.js`) — Halbton-Patch bzw. Mini-Blob/-Burst in der Typfarbe plus 1-2 Konfetti-Punkten in den Wegweiser-Tinten, nicht drei beliebige Einzelpunkte.
- **Interne Trennung:** `1px`-Linien zwischen Listeneinträgen innerhalb der Karte (z. B. Best-Practices-Liste).
- **Best-Practices-Karten geklammert (2026-08-10, Nutzer-Screenshot):** `.side-card__body` ohne Höhenbegrenzung lief bei langen Texten beliebig weit runter und sprengte das gleichmäßige `.card-grid`-Raster. Jetzt `-webkit-line-clamp: 12`, "Vollständig anzeigen →"-Button erscheint NUR, wenn `scrollHeight > clientHeight` tatsächlich zutrifft (`wireBestPracticeCards()`) — keine geratene Zeichen-Grenze, die bei kürzeren künftigen Einträgen einen nutzlosen Button zeigen würde. Zusätzlich: Profil-E-Mail in der Sidebar bekommt ein `title`-Attribut (nativer Tooltip) für den Fall, dass sie in der `236px`-Sidebar abgeschnitten wird.
- **Standard-Empfänger:in auf "Eine Person (du)" umgestellt (2026-08-10, Nutzer-Feedback):** war vorher "Mehrere Personen (ihr)" — im echten Alltag gibt es laut Nutzer meist nur einen Ansprechpartner/eine Ansprechpartnerin, beide Optionen bleiben wählbar, nur der Default hat sich geändert (`checked` aufs `single`-Radio verschoben, Fallback in `fill()` entsprechend angepasst).
- **Direktversand (2026-08-10, noch am selben Tag auf Gmail umgestellt):** neues Feld "E-Mail-Adresse(n) der Kundschaft" direkt unter der Empfänger:in-Auswahl. Aktionsreihe jetzt zweigeteilt: "In Gmail öffnen" (`.btn--primary`, `<a href="https://mail.google.com/mail/?view=cm&...">`, öffnet Gmail-Compose mit Empfänger/Betreff/Text) und "In Zwischenablage kopieren" (`.btn--secondary`, bisheriges Verhalten, als Fallback bei sehr langem Text/URL-Längenlimits). Erste Fassung nutzte `mailto:` — Nutzer-Feedback noch am selben Tag: das öffnet unter Windows den registrierten Standard-Handler (Outlook), nicht zwingend den tatsächlich genutzten Mail-Dienst. Da der Login über Google Workspace läuft, ist Gmail der richtige, verlässliche Zielort für alle Nutzer:innen dieses Tools. Deaktivierter Link-Zustand über `.btn.is-disabled` (`opacity:.5`, `pointer-events:none`, `aria-disabled`) statt nativem `disabled` — `<a>`-Elemente kennen das Attribut nicht.
- **Betreff-Platzhalter-Bug behoben (2026-08-10, Nutzer-Fund):** `subjectBase` lief bisher nie durch dieselbe `{key}`-Ersetzung wie der Mail-Text — ein Platzhalter im Betreff (z. B. `{Quartal}` bei "Erinnerung: Konten ohne Änderungen") blieb dauerhaft wörtlich stehen. Jetzt läuft `subjectFilled` durch dieselbe `extraFields.forEach`-Schleife, reagiert live auf jedes Feld-Input wie der Text auch.
- **Echte Microsoft-Kontonummer-Formate (2026-08-10, Nutzer-Korrektur):** die bisherigen Platzhalter (`123-456-789`) waren erfunden, nicht das echte Format. Korrigiert: MCC/Verwaltungskonto alphanumerisch (`K120005U88`), Account Number/Adaccount 8-stellig alphanumerisch (`F1104JH6`, `X7598960`) — Account ID (rein numerisch, z. B. `141773388`) kommt in den aktuellen Vorlagen nicht vor, daher kein Feld dafür.
- **Signatur (2026-08-10, Nutzer-Fund: Gmail übernimmt eigene Signatur beim Öffnen über einen vorausgefüllten Compose-Link nicht zuverlässig):** neuer `<details class="mailgen__signature">`-Block, eingeklappt per Default. Text-Signatur in `localStorage` (`sowespoke:signature`, EIN geteilter Wert für alle Vorlagen in diesem Browser) wird automatisch mit `\n\n--\n`-Trenner an `body` angehängt — wirkt sich auf Gmail-Link UND Kopieren gleichermaßen aus, da beide von derselben `bodyEl.value` lesen.
  - **Logo + Verdana bewusst NICHT im automatischen Pfad:** Gmails Compose-URL akzeptiert im `body`-Parameter nur reinen Text — keine Bilder, keine Schriftart, harte Grenze der URL-Methode, kein Programmierfehler. Stattdessen zweiter Button "Signatur mit Logo kopieren" (`data-copy-rich-signature`): baut echtes HTML (`<img>` mit absoluter Logo-URL `assets/brand/logo-sowespoke-logo horizontal kleiner.png`, `font-family:Verdana,Geneva,sans-serif`) und schreibt es über `navigator.clipboard.write()` mit `ClipboardItem` (`text/html` + `text/plain`-Fallback) in die Zwischenablage — Gmails Compose-Fenster ist ein Rich-Text-Editor und übernimmt eingefügtes HTML beim manuellen Strg+V korrekt, nur der automatisierte Link kann das nicht. `Verdana` ist bewusst außerhalb von DESIGN.md-Typografie (Baloo 2/Inter) — per `/impeccable hooks ignore-value` als Nutzer-bestätigte Ausnahme dokumentiert, da die Signatur exportierter Inhalt ist (verlässt die Seite, ist nicht Teil des eigenen UI-Renderings), nicht die Website-Typografie selbst.

### Tickets-Seite (`#/tickets`, 2026-08-11, neuer Menüpunkt)
- **Anlass:** Nutzer-Referenzbild eines generischen Ticket-System-Dashboards (Kartenliste + 2×2-Stat-Kacheln + Kategorien + Promo-Karte), mit der expliziten Vorgabe: Struktur/Layout übernehmen, aber "unsere Popart-Designfarben" bleiben — keine 1:1-Kopie der Referenzfarben (Orange/Lime/Dunkelpetrol/Grau) oder deren generischer Card-Grid-Optik.
- **Bewusste Abweichung vom Referenzbild:** die Referenz zeigt jede Ticket-Zeile als eigene weiße Karte mit viel Weißraum — genau das Muster, das `CLAUDE.md` als AI-Slop-Warnsignal nennt ("immer gleiche Card-Grids"). Stattdessen: dichte, durch `1px`-Linien getrennte Listenzeilen (`.ticket-row`, angelehnt an `.side-card__list`/`.event-row`), passend zum **Operate**-Ton der Seite (schnelles Scannen vor Show-Effekt) und zur bestehenden Informationsdichte des Tools.
- **Stat-Kacheln (`.ticket-stat`):** 2×2-Raster, `--stat-color`-Custom-Property pro Kachel steuert Rahmen/Schatten/Icon-Hintergrund einheitlich — Alle Tickets = Magenta (`--accent`), In Bearbeitung = Gelb (`--yellow`), Erledigt = Grün (`--teal`, verifizierter Marken-Ton), Storniert = gedämpftes Grau (`--ink-soft`). Zahlen/Kategorien werden aus `TICKETS_DATA` berechnet (`reduce`), nicht separat gepflegt — keine Drift zwischen Liste und Kachel-Summen möglich.
- **Avatare:** Initialen-Kreise statt erfundener Fotos (`avatarColorVar()`, systematische Zuweisung per Zeichen-Summe wie `CHANNEL_VAR` — dieselben Initialen bekommen immer dieselbe Farbe, kein Zufall).
- **Zeilen bewusst nicht klickbar:** kein `.row`-Link-Pattern, da es keine echte Detailseite dahinter gibt — ein Link ins Leere wäre eine vorgetäuschte Funktion.
- **Beispieldaten klar markiert:** `.flash.flash--muted`-Badge "Beispieldaten" direkt am Feed-Titel plus erklärender Hero-Subtext. Datenquelle `tickets-data.js`, alle Einträge `isPlaceholder: true`. Feldnamen bewusst nah an einer echten Zoho-Desk-Antwort (`subject`, `status`, `priority`, `dueDate`, `contactName`) — siehe `DESIGN-MASTERPROMPT.md` Abschnitt 8 "Einordnung": echte Zoho-API bewusst nicht angebunden (fehlende Org-ID/OAuth-Client), spätere Umstellung soll nur die Datendatei ersetzen müssen, nicht das UI.
- **Promo-Karte ("Eigene Anfrage stellen"):** verlinkt ehrlich auf die bestehende, echte `#/anfragen`-Seite statt eines funktionslosen "Ticket erstellen"-Buttons ohne Backend.
- Neue Icons `ticket`/`hourglass`/`xCircle` in `icons.js`, gleiches Strichgewicht/Stil wie das bestehende Icon-Set (`ICON_STROKE`).

### Tickets-Seite: Kritik-Runde (2026-08-11, `/impeccable critique`, dual-agent)
Erste vollständige Zwei-Agenten-Kritik dieser Session (Design-Review + unabhängige Detector-/Browser-Evidenz, isoliert voneinander). Health Score 25/36. Behoben:
- **P0 — Gelb als Fließtext praktisch unlesbar:** `var(--yellow)` direkt als Textfarbe für "In Bearbeitung"/"Mittel" maß nur **~1,5:1** Kontrast. Neuer Token `--c-yellow-800` (`#856700`, ~5,3:1 auf Weiß) in `tokens.css`, semantischer Alias `--yellow-text` in `styles.css` — exakt nach dem bereits bestehenden `--teal-text`-Muster, das für Türkis schon gelöst war, hier aber nicht wiederverwendet wurde. `--teal` als Status-/Prioritäts-Text (~3,6:1) ebenfalls auf `--teal-text` umgestellt, dasselbe für den Avatar-Farbzyklus (Türkis-Kreis mit weißer Schrift maß nur 3,58:1).
- **P0 — Suche ignorierte das Zuständig-Feld:** `assigneeName` fehlte im Such-Join, "Kessler" lieferte trotz sichtbarer Zeile 0 Treffer und der Leerzustand suggerierte fälschlich einen falschen Suchbegriff.
- **P1 — Maskottchen verdeckte Ticket-Text auf Mobile:** die für `.feed` akzeptierte Kollaps-auf-Icon-Lösung (News: Bild-/Leerraum, geringe Kosten) reichte hier nicht — selbst das verkleinerte Icon saß auf echtem Lesetext. `.ticket-list` zur `avoidEls`-Liste in `mascotNeededLift()` ergänzt (wie `.side-rail`/`.toolbar`: wegschieben statt nur verkleinern; wird der Versatz unrealistisch groß, bleibt die Blase bis zum nächsten Scroll unsichtbar — bestehendes Verhalten, nicht neu erfunden).
- **Zähler-Badges an den Status-Tabs** (Nutzer-Anstoß anhand eines React/shadcn-Tabs-Referenzbeispiels mit Badge-über-Label): Konzept auf die bestehende horizontale Pop-Art-Pille übertragen — Badge inline neben dem Label statt gestapelt, damit die `44px`-Pillenform auf allen anderen Tab-Leisten (News/Case Studies/Vorlagen) unangetastet bleibt. Aktiv-Zustand invertiert (weißes Badge auf Magenta-Pille) für Kontrast.
- **Bewusst zurückgestellt für den `layout`-Durchgang:** kein Sortieren nach Fälligkeit/Priorität, keine Zuständigkeits-Filterung (P1, strukturelle Lücke, kein reiner Bugfix) — Stat-Kachel-Schatten/Farbkollision (P2) und doppelte "Beispieldaten"-Markierung (P3) bewusst unverändert gelassen, siehe Kritik-Snapshot `.impeccable/critique/2026-08-11T06-35-50Z__tickets.md`.

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
- **Style (Desktop):** Beschriftet, `236px` breit, `44px` Touch-Ziel pro Zeile, `10px` Radius. Aktiver Eintrag: `accent-tint`-Hintergrund, Magenta-Icon+Text, zusätzlich `3px` breiter Magenta-Balken links (Farbe allein reicht laut Brief nicht als einziger Indikator). Inaktiv: grauer Icon+Text, Hover mit Warmpapier-Hintergrund.
- **Style (Mobile, `≤48rem`):** Fällt zurück auf Icon-only (`44px`-Quadrate, Labels ausgeblendet), horizontale Leiste, aktiver Indikator wird zum unteren Balken statt linkem.
- **Nur echte Seiten:** keine Menüpunkte für nicht existierende Bereiche anlegen, auch wenn Referenz-Mockups mehr zeigen.

### Tabs
- **Style (seit 2026-08-07, spät):** Pill-/Chip-Optik statt Unterstrich — weißer Hintergrund + `1px`-Rand im Ruhezustand. Aktiv: volle Akzentfarbe-Füllung, weißer Text. Inaktiv: Grauschiefer-Text, Hover auf Schwarz.

### Sidebar-Profil-Stub
- **Style:** Unten in `.rail` (`.rail__profile`), Kreis-Avatar mit erstem Buchstaben der E-Mail, E-Mail-Text + generischer Platzhalter "Team-Mitglied", Chevron-Icon. Lädt echte Session-Daten über `GET /api/auth/me` (nur E-Mail verfügbar — Google liefert kein Namensfeld ohne zusätzlichen People-API-Scope). Scheitert die Anfrage, bleibt der Block leer (kein Platzhalter-Foto/-Name erfinden). Auf Mobile ausgeblendet (kein Platz in der Icon-only-Leiste).

### Fakten-Widget ("Wusstest du schon?")
- **Style:** Inline-Komponente unterhalb des Präsentationen-Rasters, gleiche Sprechblasen-Sprache wie das schwebende Maskottchen (`3px`-Ink-Rahmen, Dreieck-Spitze), aber eigene DOM-IDs (`fact-widget-*`) und eigenständiges Markup — keine Kollision mit dem schwebenden `#mascot-root`. Zeigt `factOfTheDay()` beim ersten Rendern, "Noch ein Fakt →"-Button ruft `randomFact()` mit sanftem Opacity-Fade auf.

## Do's and Don'ts

### Do:
- **Do** Magenta klein und häufig einsetzen (Button, Unterstrich, Punktmarker) statt großflächig und selten.
- **Do** Karten (Seitenkarte/Info-Box/Mail-Generator) mit dem festen `3px`-Typ-Rahmen versehen (siehe Bunte-Rahmen-Regel) plus Schatten — Farbe ist an den Komponenten-Typ gebunden, nicht frei wählbar.
- **Do** neue Listeninhalte als Zeile (`row`-Muster) anlegen, randlos — das Listenmuster ist die primäre Content-Form dieser App und bleibt bewusst ohne Rahmen, damit es scanbar bleibt.
- **Do** Exo 2 auf die eine Headline pro Seite begrenzen; alles andere bleibt Open Sans, auch wenn es fett gesetzt ist.
- **Do** bei Unsicherheit über Markendetails ein echtes Bild/Screenshot anfordern statt aus Text-Fetch zu raten.
- **Do** Schatten immer mit Versatz versehen (`shadow`, `shadow-hover`, `shadow-glow`) — ein Schein ohne Offset ist Dekoration, keine Tiefe.
- **Do** den harten, unverwischten `sticker-shadow` ausschließlich für das Beta-Badge verwenden — er ist die eine bewusste Ausnahme vom sonst durchgängig weichen Schattensystem, kein Ersatzmuster für Karten.
- **Do** neue Listen-/Rasterinhalte als `article-list li` + `row`-Karte anlegen (gerade, kein Pin, kein Rotation) — das ist jetzt die primäre Content-Form, nicht mehr die randlose Zeile.
- **Do** Comic-Badges (`.card-badge`) selektiv einsetzen (z. B. "Neu" nur bei echtem, aktuellem Datum) — nicht auf jeder Karte, sonst verliert das Signal seine Bedeutung.

### Don't:
- **Don't** Rahmenfarben pro Karten-Instanz frei mischen (z. B. eine Seitenkarte mal magenta, mal gelb) — die Farbe hängt am Komponenten-Typ, nicht am Zufall, sonst entsteht wieder das "zu viele Farben gleichzeitig"-Problem der verworfenen Fassung 2.
- **Don't** die Illustrationen als flächendeckendes Muster einsetzen — `HERO_ILLUSTRATION` und die drei Karten-Illustrationen (`SIDECARD_ILLUSTRATION`/`INFOBOX_ILLUSTRATION`/`MAILGEN_ILLUSTRATION`) bleiben einzelne, freistehende Cluster an definierten Stellen (Hero-Ecke, Karten-Ecke), kein Muster über eine ganze Fläche. `BRAND_BLOB`/`BRAND_BURST` bleiben eigenständig unbenutzt; ihre Formsprache lebt verkleinert in den drei Karten-Illustrationen weiter — nicht zusätzlich als separate Einzelakzente reaktivieren.
- **Don't** mehr als eine Farbe gleichzeitig großflächig einsetzen (z. B. ein farbiges Kartenband plus eine zweite Akzentfarbe im selben Element).
- **Don't** Emoji oder Icon-Fonts anstelle der gezeichneten Line-Art-Icons (`icons.js`) verwenden.
- **Don't** neue Strukturmuster erfinden, ohne sie gegen das Editorial-Referenzlayout zu prüfen — Struktur ist bewusst von einem konkreten Vorbild abgeleitet, nicht frei gestaltet.
