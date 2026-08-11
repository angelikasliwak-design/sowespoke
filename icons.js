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
   seitlich/groß. Farb-Tokens statt Hardcoding, wo im SVG möglich
   (var(--accent)/var(--yellow)/var(--ink) — --ink entspricht exakt der
   geforderten Kontur-Farbe). Benannte Gruppen
   (id="shadow"/"body"/"eye-l"/"eye-r"/"spark") für spätere gezielte
   Animation einzelner Teile. */
const MASCOT_SVG = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <g id="shadow">
    <rect x="12" y="12" width="84" height="84" rx="26" fill="var(--ink)"/>
  </g>
  <g id="body">
    <rect x="8" y="8" width="84" height="84" rx="26" fill="var(--accent)" stroke="var(--ink)" stroke-width="3"/>
  </g>
  <g id="eye-l">
    <ellipse cx="35" cy="44" rx="4.5" ry="5.5" fill="var(--ink)"/>
  </g>
  <g id="eye-r">
    <ellipse cx="65" cy="44" rx="4.5" ry="5.5" fill="var(--ink)"/>
  </g>
  <g id="spark">
    <path d="M55,0 L45,9 L50,9 L44,17 L58,6 L52,6 Z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="miter"/>
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
/* Zweite Megafon-Fassung (2026-08-07, spät) — kompakter, gedrungener
   Marker-Doodle-Stil statt Verlaufs-Glanz-Megafon: dicke Outlines, flache
   Farbflächen, 45°-Kippung mit Öffnung oben links, Impact-Burst aus 13
   handgezeichneten Strahlen. Koordinaten programmatisch erzeugt (siehe
   DESIGN.md), viewBox eng um den Inhalt zugeschnitten (quadratisch statt
   der vorherigen 300×190-Breitformat-Box — .hero__illustration wurde
   entsprechend auf ein quadratisches Seitenverhältnis angepasst). */
const HERO_ILLUSTRATION = `<svg viewBox="0 0 764 770" aria-hidden="true">
  <g transform="translate(382.2,384.9) rotate(-135) translate(-392.2,8.3)">
    <g>
      <path d="M426.5,-188.3 Q418.0,-231.8 406.6,-274.6" stroke="var(--ink)" stroke-width="21.1" fill="none" stroke-linecap="round"/>
      <path d="M511.4,-186.1 Q521.0,-256.0 542.0,-323.5" stroke="var(--ink)" stroke-width="13.1" fill="none" stroke-linecap="round"/>
      <path d="M539.3,-188.0 Q552.5,-222.6 565.0,-257.6" stroke="var(--ink)" stroke-width="13.7" fill="none" stroke-linecap="round"/>
      <path d="M600.6,-147.2 Q625.7,-179.0 654.3,-207.7" stroke="var(--ink)" stroke-width="19.4" fill="none" stroke-linecap="round"/>
      <path d="M631.5,-108.7 Q679.5,-133.0 720.1,-168.3" stroke="var(--ink)" stroke-width="17.7" fill="none" stroke-linecap="round"/>
      <path d="M662.6,-58.2 Q729.3,-75.6 794.4,-97.9" stroke="var(--ink)" stroke-width="21.0" fill="none" stroke-linecap="round"/>
      <path d="M665.6,4.3 Q713.1,1.2 760.4,6.4" stroke="var(--ink)" stroke-width="21.5" fill="none" stroke-linecap="round"/>
      <path d="M657.2,43.2 Q710.6,62.6 767.0,68.5" stroke="var(--ink)" stroke-width="17.7" fill="none" stroke-linecap="round"/>
      <path d="M635.8,99.5 Q684.6,138.6 742.1,163.2" stroke="var(--ink)" stroke-width="15.3" fill="none" stroke-linecap="round"/>
      <path d="M594.6,145.4 Q641.8,198.3 686.8,252.9" stroke="var(--ink)" stroke-width="16.0" fill="none" stroke-linecap="round"/>
      <path d="M535.3,179.9 Q553.5,218.1 564.0,259.1" stroke="var(--ink)" stroke-width="21.2" fill="none" stroke-linecap="round"/>
      <path d="M487.0,189.4 Q497.4,247.7 497.5,306.9" stroke="var(--ink)" stroke-width="17.9" fill="none" stroke-linecap="round"/>
      <path d="M453.3,199.7 Q444.6,234.9 447.3,271.1" stroke="var(--ink)" stroke-width="13.7" fill="none" stroke-linecap="round"/>
    </g>
    <g transform="translate(55,25) rotate(58)">
      <rect x="0" y="-52" width="168" height="104" rx="40" fill="var(--teal)" stroke="var(--ink)" stroke-width="20" stroke-linejoin="round"/>
    </g>
    <path d="M28,-42 C60,-52 92,-50 118,-42 L118,42 C92,50 60,52 28,42 Z"
      fill="var(--accent)" stroke="var(--ink)" stroke-width="18" stroke-linejoin="round"/>
    <!-- Deutlich ausgeprägte Trichterform (Kritik-Fund 2026-08-10): der
         schmale Hals (Höhe 90) weitet sich klar sichtbar zur Öffnung
         (Höhe ~330, verschmilzt mit dem Rand-Ring) statt wie vorher fast
         parallel zu bleiben (Höhe 236→304, kaum ein Unterschied — sah wie
         ein Rechteck aus, nicht wie ein Horn). -->
    <path d="M118,-45 C220,-100 320,-145 396,-165
             L402,165
             C320,145 220,100 118,45 Z"
      fill="var(--c-surface)" stroke="var(--ink)" stroke-width="22" stroke-linejoin="round"/>
    <ellipse cx="470" cy="0" rx="82" ry="170" fill="var(--accent)" stroke="var(--ink)" stroke-width="22"/>
    <ellipse cx="476" cy="0" rx="54" ry="140" fill="var(--c-surface)" stroke="var(--ink)" stroke-width="14"/>
    <circle cx="492" cy="0" r="46" fill="var(--accent)" stroke="var(--ink)" stroke-width="12"/>
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
