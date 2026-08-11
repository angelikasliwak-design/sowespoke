/**
 * Authorierte Line-Art-Icons, ein Strichgewicht, konsistent zur
 * ligne-claire-Kontur der Panels. Kein Emoji, kein Icon-Font.
 */
const ICON_STROKE = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  search: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>`,

  arrowRight: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>`,

  arrowLeft: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M20 12H5"/><path d="M11 6l-6 6 6 6"/></svg>`,

  mail: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>`,

  copy: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="8.5" y="8.5" width="12" height="12" rx="1.6"/><path d="M15.5 8.5V5.6A1.6 1.6 0 0 0 13.9 4H4.6A1.6 1.6 0 0 0 3 5.6v9.3A1.6 1.6 0 0 0 4.6 16.5h2.9"/></svg>`,

  check: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4.5 12.5 9.5 17.5 20 6"/></svg>`,

  flash: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>`,

  book: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 5.5c2-1 5-1.3 8 0 3-1.3 6-1 8 0v13c-2-1-5-1.3-8 0-3-1.3-6-1-8 0z"/><path d="M12 5.5v13"/></svg>`,

  home: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5h12V10"/></svg>`,

  sparkle: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><path d="M6 6l4 4"/><path d="M14 14l4 4"/><path d="M18 6l-4 4"/><path d="M10 14l-4 4"/></svg>`,

  gauge: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 15a8 8 0 0 1 16 0"/><path d="M12 15 16 9"/><circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none"/></svg>`,

  crosshair: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="7.5"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>`,

  layoutGrid: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.4"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.4"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.4"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.4"/></svg>`,

  chartLine: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M4 4v16h16"/><path d="M6.5 15 11 10l3 3 4.5-6"/></svg>`,

  magnifyEmpty: `<svg viewBox="0 0 48 48" ${ICON_STROKE}><circle cx="21" cy="21" r="13"/><path d="M30 30 42 42"/><path d="M16 21h10"/></svg>`,

  close: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M5 5l14 14"/><path d="M19 5 5 19"/></svg>`,

  calendar: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="3.5" y="5" width="17" height="16" rx="2.2"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>`,

  fileText: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M6 2.5h8l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z"/><path d="M14 2.5V7h4"/><path d="M8 12.5h8"/><path d="M8 16.5h8"/></svg>`,

  layers: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3 21 8l-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 16l9 5 9-5"/></svg>`,

  download: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M12 3v13"/><path d="M6.5 11 12 16.5 17.5 11"/><path d="M4 20h16"/></svg>`,

  external: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M9 6H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4"/><path d="M14 4h6v6"/><path d="M20 4 10 14"/></svg>`,

  news: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="3" y="4" width="18" height="16" rx="1.6"/><path d="M7 8.5h6"/><path d="M7 12h10"/><path d="M7 15.5h10"/></svg>`,

  thumbUp: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"/><path d="M7 11l4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 1.94 2.5l-1.5 6A2 2 0 0 1 17 20H9a2 2 0 0 1-2-2"/></svg>`,

  thumbDown: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M17 13V4h3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"/><path d="M17 13l-4 7a2 2 0 0 1-2-2v-4H5.5a2 2 0 0 1-1.94-2.5l1.5-6A2 2 0 0 1 7 4h8a2 2 0 0 1 2 2"/></svg>`,

  trophy: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 14v3"/><path d="M8.5 20.5h7"/><path d="M9.5 17.5h5l1 3h-7z"/></svg>`,

  ticket: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><rect x="2.5" y="6" width="19" height="12" rx="2.2"/><path d="M12 6v2.2M12 10.8v2.4M12 15.6v2.4"/></svg>`,

  hourglass: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><path d="M6 3h12"/><path d="M6 21h12"/><path d="M7 3c0 4 3 6 5 8-2 2-5 4-5 8"/><path d="M17 3c0 4-3 6-5 8 2 2 5 4 5 8"/></svg>`,

  xCircle: `<svg viewBox="0 0 24 24" ${ICON_STROKE}><circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/></svg>`,
};

/* Maskottchen (2026-08-07, live-Feedback: "gefällt mir nicht, süßes
   Tierchen in unseren Farben"): kleiner Fuchs statt der Lupen-Kugel —
   Magenta als Fell, Petrol als Halstuch, Gelb als Stern-Akzent. Dicke
   schwarze Comic-Konturen bleiben, passt zum übrigen Pop-Art-System. */
/* SPARK — Maskottchen-Neuausrichtung (2026-08-10, Nutzer-Entscheidung nach
   Master-Prompt-Abschnitt 4): löst die Fuchs-Figur "PIX" ab. Abstrakt-
   geometrischer Charakter statt Tier-Clipart.
   Zweite Überarbeitung (2026-08-10, Nutzer-Feedback): die erste SPARK-
   Version (organischer Rundkörper + Mund-Kurve) wirkte wie ein Apfel/eine
   Tomate. Neu gezeichnet auf reiner Rechteck-Geometrie: exakter Squircle
   per <rect rx="26"> (kein organischer Pfad, keine Einbuchtung oben),
   harter Offset-Schatten (zweites identisches Rect, +4/+4 versetzt, ohne
   Blur/filter) statt weichem Drop-Shadow, nur zwei Punktaugen ohne Mund
   (kein Gesichtsausdruck, der als Frucht gelesen werden könnte), Blitz
   jetzt klein, mittig oben und aus der Oberkante herauswachsend statt
   seitlich/groß. */
/* MOKA — dritte Neuausrichtung (2026-08-11, Nutzer-Wunsch, Referenzbild
   "Momo" von MascotCraft/open-source-mascots, CC0): löst SPARK ab.
   Bewusst NICHT die Referenz-PNG direkt verwendet — zwei Gründe, siehe
   DESIGN.md: (1) Stilbruch (Momo ist weiches Pastell-Kawaii ohne
   Konturen, dieses Projekt ist durchgängig hartes Pop-Art/Comic mit
   dicken schwarzen Konturen), (2) technisch: ein flaches PNG lässt sich
   nicht in Ohren/Dampf-Ebenen zerlegen, um sie einzeln zu animieren.
   Stattdessen: eigene Figur mit demselben Konzept (Kaffeetasse mit
   Dampf, lange Ohren), aber im etablierten Comic-Stil gezeichnet —
   dicke Ink-Konturen, Marken-Magenta, benannte Gruppen für Animation.
   viewBox absichtlich 100×130 (höher als breit, Platz für die Ohren
   oben) statt 100×100 — skaliert innerhalb der quadratischen
   Mascot-Container automatisch passend ein (kein Clipping, per
   Screenshot-Selbsttest bestätigt), da SVGs ohne definierte Breite/Höhe
   den gesamten viewBox-Inhalt einpassen statt zu beschneiden.
   Schatten bewusst NUR am Körper (nicht an den Ohren) — ein separater,
   mitrotierender Ohren-Schatten wäre nötig, sonst bleibt beim
   CSS-Wackeln ein statischer schwarzer "Geist" an der alten Ohr-Position
   stehen (per Screenshot-Selbsttest gefunden und korrigiert, erste
   Fassung hatte genau diesen Fehler). Benannte Gruppen
   (id="shadow"/"ear-left"/"ear-right"/"body"/"face"/"coffee-cup"/
   "steam") für die Animation in styles.css (Ohren-Wackeln, Dampf-Aufstieg). */
const MASCOT_SVG = `<svg viewBox="0 0 100 130" aria-hidden="true">
  <g id="shadow" transform="translate(4,4)">
    <ellipse cx="50" cy="90" rx="36" ry="34" fill="var(--ink)"/>
  </g>
  <g id="ear-left">
    <ellipse cx="34" cy="58" rx="13" ry="34" fill="var(--accent)" stroke="var(--ink)" stroke-width="3" transform="rotate(-18 34 58)"/>
  </g>
  <g id="ear-right">
    <ellipse cx="66" cy="58" rx="13" ry="34" fill="var(--accent)" stroke="var(--ink)" stroke-width="3" transform="rotate(18 66 58)"/>
  </g>
  <g id="body">
    <ellipse cx="50" cy="90" rx="36" ry="34" fill="var(--accent)" stroke="var(--ink)" stroke-width="3"/>
  </g>
  <g id="face">
    <ellipse cx="44" cy="82" rx="16" ry="14" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="2.5"/>
    <ellipse cx="38" cy="81" rx="3.2" ry="4.4" fill="var(--ink)"/>
    <ellipse cx="50" cy="81" rx="3.2" ry="4.4" fill="var(--ink)"/>
  </g>
  <g id="coffee-cup">
    <path d="M77,101 q7,0 7,6 q0,6.5 -7,6.5" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
    <rect x="62" y="99" width="15" height="15" rx="3" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="2.5"/>
    <path d="M64,102 h11" stroke="var(--teal)" stroke-width="1.8" opacity="0.7"/>
  </g>
  <g id="steam">
    <path d="M66,95 q3,-4 0,-8 q-3,-4 0,-8" stroke="var(--ink-soft)" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M73,95 q3,-4 0,-8 q-3,-4 0,-8" stroke="var(--ink-soft)" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.7"/>
  </g>
</svg>`;

/* Echte Marken-Formen nach Vorlage der Sowespoke-Präsentationsfolien:
   organischer Teal-"Blob" (torn-edge Kreisform) + gelbe Comic-Wolke mit
   Halbton-Textur. Laufen als große, weiche Hintergrundform HINTER dem
   Content — nie als hartkantiges Element, das mit Inhalt konkurriert. */
const BRAND_BLOB = `<svg viewBox="0 0 240 240" aria-hidden="true">
  <path d="M60 8 C110 -8 175 10 200 55 C222 95 210 148 172 178 C132 210 68 212 32 182
    C-2 154 -10 100 8 62 C20 36 34 16 60 8 Z" fill="var(--teal)"/>
  <path d="M55 40 C70 30 85 32 92 42" stroke="var(--c-surface)" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`;

const BRAND_BURST = `<svg viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <pattern id="burstDots" width="11" height="11" patternUnits="userSpaceOnUse">
      <circle cx="2.4" cy="2.4" r="2.4" fill="var(--c-yellow-700)"/>
    </pattern>
    <clipPath id="burstClip">
      <path d="M70 10 C95 -4 122 -2 132 20 C156 14 178 28 176 52 C196 58 202 82 184 98
        C196 116 186 140 162 142 C160 166 134 180 112 168 C96 186 66 186 54 166
        C28 172 6 154 12 130 C-8 120 -8 94 12 82 C4 60 20 36 46 38 C50 18 60 8 70 10 Z" />
    </clipPath>
  </defs>
  <path d="M70 10 C95 -4 122 -2 132 20 C156 14 178 28 176 52 C196 58 202 82 184 98
    C196 116 186 140 162 142 C160 166 134 180 112 168 C96 186 66 186 54 166
    C28 172 6 154 12 130 C-8 120 -8 94 12 82 C4 60 20 36 46 38 C50 18 60 8 70 10 Z"
    fill="var(--yellow)"/>
  <rect x="0" y="0" width="200" height="200" fill="url(#burstDots)" clip-path="url(#burstClip)" opacity="0.55"/>
</svg>`;

/* Eck-Illustration für den Hero-Bereich: EIN komponiertes Cluster (Halbton-
   Punktfeld + Comic-Blitz + Megafon), das den Leerraum neben der Überschrift
   bewusst füllt, statt eine einzelne Form isoliert in der Ecke schweben zu
   lassen. Alle Teile überlappen/berühren sich — kein verstreuter Einzel-Akzent
   (siehe DESIGN.md, Fassung "Marken-Formen zurückgenommen"). */
/* Vierte Megafon-Fassung (2026-08-11, Korrekturdurchgang) — Nutzer stellte
   nach der dritten Fassung klar: nicht nur lose "Stil-Inspiration", sondern
   eng an der Komposition des Referenzbilds bleiben (Kreuzschraffur-Mund,
   Gesicht direkt auf dem Trichter-Rand, hochgestreckter Flex-Arm mit Faust),
   nur in Sowespoke-Farben statt Schwarz-Weiß. Mehrere Selbsttest-Runden
   nötig (Skript-gestützt, `assemble-v2` bis `-v7` im Scratchpad):
   - **v2:** Arm als eng gekrümmter Stroke-Pfad — las sich als "Donut"
     (Kreis-in-Kreis) statt Arm+Faust, weil Kurve zu eng um sich selbst lief.
   - **v4/v5:** Arm als zwei starre Kapsel-Segmente (Ober-/Unterarm) —
     Segmente hingen nicht zusammen (Anschlusspunkte nicht exakt verkettet),
     dann per Trigonometrie exakt verkettet (Ende Segment 1 = Start Segment 2).
   - **v6:** Verkettete Kapsel-Segmente verliefen QUER durch die Trichter-
     öffnung und verdeckten den Mund fast vollständig.
   - **v7 (final):** Arm als weiter, offener Bogen-Pfad, der UNTEN LINKS um
     den Trichter herumführt statt über sein Gesicht hinweg — Trichter bleibt
     frei lesbar, Arm+Faust ebenfalls klar erkennbar. Faust = Ellipse +
     Daumen-Kreis (gleiche Bauweise wie die rechte Greifhand am Griff).
   - Kein separater Kopf-Aufsatz mehr — Augen/Augenbrauen sitzen jetzt direkt
     auf dem Trichter-Rand (rotierte Ellipsen), wie im Referenzbild.
   - Fünf kurze Diagonalstriche im weißen Trichterinneren als Kreuzschraffur-
     Andeutung (diesmal korrekt innerhalb der weißen Ellipse platziert —
     der erste Versuch in Fassung 3 hatte sie fälschlich außerhalb sitzen).
   - **Trichteröffnung bleibt auf vertikaler Bild-Mitte** (unverändert aus
     Fassung 3 übernommen) — Sprechblasen-Pfeilspitze (`top:50%` in
     `.hero__scene`) trifft weiterhin auf Höhe der Öffnung.
   - Farben ausschließlich `var(--accent)`/`var(--teal)`/`var(--yellow)`/
     `var(--ink)`/`var(--c-surface)` — keine neuen Hex-Werte. */
const HERO_ILLUSTRATION = `<svg viewBox="-106 -36 378 296" aria-hidden="true">
  <g id="mega-rays">
    <path d="M127.0,39.2 Q114.2,33.0 100.5,29.1" stroke="var(--ink)" stroke-width="3.9" fill="none" stroke-linecap="round"/>
    <path d="M134.0,25.9 Q123.3,9.9 108.9,-2.9" stroke="var(--ink)" stroke-width="5.6" fill="none" stroke-linecap="round"/>
    <path d="M147.6,19.0 Q144.4,1.2 139.3,-16.2" stroke="var(--ink)" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M161.2,19.4 Q162.4,7.0 166.2,-4.8" stroke="var(--ink)" stroke-width="4.3" fill="none" stroke-linecap="round"/>
    <path d="M-74.8,26.9 Q-84.8,19.0 -96.0,12.9" stroke="var(--ink)" stroke-width="3.8" fill="none" stroke-linecap="round"/>
    <path d="M-69.2,16.8 Q-74.8,2.8 -84.6,-8.5" stroke="var(--ink)" stroke-width="4.4" fill="none" stroke-linecap="round"/>
    <path d="M-53.5,14.1 Q-49.9,-5.6 -51.1,-25.6" stroke="var(--ink)" stroke-width="6.2" fill="none" stroke-linecap="round"/>
  </g>

  <path d="M175,122 C130,108 80,80 40,50 C10,90 10,210 40,250 C80,220 130,192 175,178 Z"
    fill="var(--accent)" stroke="var(--ink)" stroke-width="16" stroke-linejoin="round"/>
  <ellipse cx="46" cy="150" rx="24" ry="88" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="9"/>
  <path d="M34,108 L54,124" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
  <path d="M30,135 L52,148" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
  <path d="M29,163 L52,174" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
  <path d="M32,190 L54,203" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
  <path d="M38,213 L57,224" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>

  <path d="M95,225 C40,268 -45,235 -78,140 C-95,90 -78,55 -35,48" stroke="var(--ink)" stroke-width="34" fill="none" stroke-linecap="round"/>
  <path d="M95,225 C40,268 -45,235 -78,140 C-95,90 -78,55 -35,48" stroke="var(--c-surface)" stroke-width="24" fill="none" stroke-linecap="round"/>
  <ellipse cx="-35" cy="48" rx="25" ry="23" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="11"/>
  <circle cx="-14" cy="30" r="12" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="8"/>

  <ellipse cx="118" cy="88" rx="13" ry="10" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="6.5" transform="rotate(-16 118 88)"/>
  <ellipse cx="150" cy="76" rx="13" ry="10" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="6.5" transform="rotate(-12 150 76)"/>
  <circle cx="120" cy="89" r="4" fill="var(--ink)"/>
  <circle cx="152" cy="77" r="4" fill="var(--ink)"/>
  <path d="M100,70 L124,80" stroke="var(--ink)" stroke-width="8.5" stroke-linecap="round"/>
  <path d="M132,63 L162,58" stroke="var(--ink)" stroke-width="8.5" stroke-linecap="round"/>

  <g transform="translate(183,168) rotate(28)">
    <rect x="0" y="-15" width="52" height="30" rx="14" fill="var(--teal)" stroke="var(--ink)" stroke-width="9" stroke-linejoin="round"/>
    <circle cx="16" cy="0" r="9" fill="var(--yellow)" stroke="var(--ink)" stroke-width="5"/>
    <ellipse cx="52" cy="1" rx="25" ry="23" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="10"/>
    <circle cx="40" cy="-15" r="10" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="7"/>
  </g>
</svg>`;

/* Karten-Eck-Illustrationen: je EIN komponiertes Mini-Cluster pro Karten-
   typ (nicht drei verstreute Einzelpunkte wie zuvor), Farbe folgt der
   Bunte-Rahmen-Regel (Seitenkarte magenta, Info-Box petrol, Mail-Generator
   gelb). Konfetti-Punkte nutzen die bisher kaum sichtbaren Wegweiser-Tinten
   (--cat-*) — mehr Farbe, ohne die Palette zu verlassen. */
const SIDECARD_ILLUSTRATION = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <pattern id="sc-dots" width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="2.2" cy="2.2" r="2" fill="var(--accent)"/>
    </pattern>
  </defs>
  <rect x="36" y="4" width="48" height="48" rx="11" fill="url(#sc-dots)" opacity="0.65" transform="rotate(8 60 28)"/>
  <circle cx="28" cy="48" r="7.5" fill="var(--cat-ai)" opacity="0.88"/>
  <circle cx="18" cy="20" r="4.5" fill="var(--cat-creative)" opacity="0.9"/>
  <circle cx="88" cy="20" r="3" fill="var(--accent)"/>
</svg>`;

const INFOBOX_ILLUSTRATION = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <path d="M46 6 C67 0 87 11 91 32 C95 53 82 71 61 77 C40 83 19 72 13 53 C7 34 16 13 37 7 C40 6 43 6 46 6 Z"
    fill="var(--teal)" opacity="0.92"/>
  <path d="M32 30 C41 23 50 25 55 32" stroke="var(--c-surface)" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.5"/>
  <circle cx="83" cy="66" r="5.5" fill="var(--cat-tracking)"/>
  <circle cx="18" cy="70" r="3.5" fill="var(--cat-bid)" opacity="0.88"/>
</svg>`;

const MAILGEN_ILLUSTRATION = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <pattern id="mg-dots" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="1.6" cy="1.6" r="1.6" fill="var(--c-yellow-700)"/>
    </pattern>
    <clipPath id="mg-clip">
      <path d="M40 5 C57 -3 73 4 77 16 C91 13 101 24 96 38 C105 46 101 63 86 67 C86 81 69 89 57 81 C47 93 29 91 23 78 C9 81 -1 68 5 54 C-5 46 -1 30 13 26 C15 13 25 5 40 5 Z"/>
    </clipPath>
  </defs>
  <path d="M40 5 C57 -3 73 4 77 16 C91 13 101 24 96 38 C105 46 101 63 86 67 C86 81 69 89 57 81 C47 93 29 91 23 78 C9 81 -1 68 5 54 C-5 46 -1 30 13 26 C15 13 25 5 40 5 Z"
    fill="var(--yellow)"/>
  <rect x="0" y="0" width="100" height="100" fill="url(#mg-dots)" clip-path="url(#mg-clip)" opacity="0.5"/>
  <circle cx="14" cy="84" r="4.5" fill="var(--cat-target)"/>
  <circle cx="86" cy="12" r="3" fill="var(--cat-creative)" opacity="0.88"/>
</svg>`;

const CATEGORY_ICON = {
  "KI & Automatisierung": "sparkle",
  "Gebotsstrategien": "gauge",
  "Targeting": "crosshair",
  "Kreativ & Formate": "layoutGrid",
  "Tracking & Messung": "chartLine",
};
