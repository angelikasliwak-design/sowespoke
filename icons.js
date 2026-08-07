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
};

/* Maskottchen (2026-08-07, live-Feedback: "gefällt mir nicht, süßes
   Tierchen in unseren Farben"): kleiner Fuchs statt der Lupen-Kugel —
   Magenta als Fell, Petrol als Halstuch, Gelb als Stern-Akzent. Dicke
   schwarze Comic-Konturen bleiben, passt zum übrigen Pop-Art-System. */
const MASCOT_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <path d="M11 22 L5 4 L24 15 Z" fill="var(--accent)" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M53 22 L59 4 L40 15 Z" fill="var(--accent)" stroke="var(--ink)" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M13.5 18 L10 8 L20.5 15 Z" fill="var(--accent-tint)"/>
  <path d="M50.5 18 L54 8 L43.5 15 Z" fill="var(--accent-tint)"/>
  <path d="M32 12c14 0 22 10 22 22 0 12-9 20-22 20S10 46 10 34c0-12 8-22 22-22z" fill="var(--accent)" stroke="var(--ink)" stroke-width="3"/>
  <path d="M32 29c8 0 13 5.5 13 11.5S39.5 51 32 51s-13-5-13-10.5S24 29 32 29z" fill="#fff"/>
  <circle cx="17.5" cy="37" r="3.2" fill="var(--accent-tint)"/>
  <circle cx="46.5" cy="37" r="3.2" fill="var(--accent-tint)"/>
  <circle cx="24" cy="30" r="3.3" fill="var(--ink)"/>
  <circle cx="40" cy="30" r="3.3" fill="var(--ink)"/>
  <circle cx="25.1" cy="28.8" r="1.1" fill="#fff"/>
  <circle cx="41.1" cy="28.8" r="1.1" fill="#fff"/>
  <!-- Runde Brille (PIX-Richtung aus dem Maskottchen-Moodboard, 2026-08-07):
       neugierig-schlauer Charakter, passt zum "sucht immer nach Wissen"-Ton. -->
  <circle cx="24" cy="30" r="6.2" fill="none" stroke="var(--ink)" stroke-width="2.4"/>
  <circle cx="40" cy="30" r="6.2" fill="none" stroke="var(--ink)" stroke-width="2.4"/>
  <path d="M30.2 30 L33.8 30" stroke="var(--ink)" stroke-width="2.4"/>
  <path d="M17.8 29 L13.5 27" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M46.2 29 L50.5 27" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M32 38.5 l-3.4 3 3.4 2.2 3.4-2.2z" fill="var(--ink)"/>
  <path d="M17 48 Q32 58 47 48 L47 54 Q32 63 17 54 Z" fill="var(--teal)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M52 6 l2.2 5.3 5.3 2.2 -5.3 2.2 -2.2 5.3 -2.2 -5.3 -5.3 -2.2 5.3 -2.2z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"/>
</svg>`;

/* Echte Marken-Formen nach Vorlage der Sowespoke-Präsentationsfolien:
   organischer Teal-"Blob" (torn-edge Kreisform) + gelbe Comic-Wolke mit
   Halbton-Textur. Laufen als große, weiche Hintergrundform HINTER dem
   Content — nie als hartkantiges Element, das mit Inhalt konkurriert. */
const BRAND_BLOB = `<svg viewBox="0 0 240 240" aria-hidden="true">
  <path d="M60 8 C110 -8 175 10 200 55 C222 95 210 148 172 178 C132 210 68 212 32 182
    C-2 154 -10 100 8 62 C20 36 34 16 60 8 Z" fill="var(--teal)"/>
  <path d="M55 40 C70 30 85 32 92 42" stroke="#ffffff" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`;

const BRAND_BURST = `<svg viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <pattern id="burstDots" width="11" height="11" patternUnits="userSpaceOnUse">
      <circle cx="2.4" cy="2.4" r="2.4" fill="#c98a00"/>
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
const HERO_ILLUSTRATION = `<svg viewBox="0 0 300 190" aria-hidden="true">
  <defs>
    <linearGradient id="megaBody" x1="30%" y1="100%" x2="90%" y2="0%">
      <stop offset="0%" stop-color="#9c0349"/>
      <stop offset="55%" stop-color="var(--accent)"/>
      <stop offset="100%" stop-color="#ff4b9e"/>
    </linearGradient>
    <linearGradient id="megaGrip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9c0349"/>
      <stop offset="100%" stop-color="var(--accent)"/>
    </linearGradient>
    <pattern id="heroDots" width="13" height="13" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="2.6" fill="var(--teal)"/>
    </pattern>
  </defs>
  <rect x="2" y="8" width="60" height="60" rx="12" fill="url(#heroDots)" opacity="0.55" transform="rotate(-6 32 38)"/>
  <path d="M48 26 L76 8 L62 46 L92 32 L54 82 L64 48 L36 58 Z"
    fill="var(--yellow)" stroke="var(--ink)" stroke-width="4.5" stroke-linejoin="round"
    transform="rotate(9 64 44)"/>
  <!-- Türkisfarbener Comic-Burst hinter dem Megafon (Referenz-Mockup
     2026-08-07) — rendert zuerst, damit das Megafon darüber liegt. -->
  <path d="M215 5 L228 45 L268 30 L248 68 L290 78 L248 95 L275 130 L233 118 L238 160 L208 128 L178 158 L175 115 L138 128 L165 90 L128 72 L170 60 L155 22 L195 42 Z"
    fill="var(--teal)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/>
  <g transform="translate(96,-8) rotate(-7 100 100)">
    <circle cx="34" cy="26" r="2.4" fill="var(--yellow)" opacity="0.8"/>
    <circle cx="46" cy="18" r="1.6" fill="var(--yellow)" opacity="0.6"/>
    <circle cx="24" cy="42" r="1.6" fill="var(--yellow)" opacity="0.6"/>
    <path d="M58 76 Q100 55 145 40 Q153 100 145 160 Q100 145 58 124 Q54 100 58 76 Z"
      fill="url(#megaBody)" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/>
    <ellipse cx="147" cy="100" rx="9" ry="57" fill="#fff" opacity="0.92" stroke="var(--ink)" stroke-width="3"/>
    <ellipse cx="149.5" cy="100" rx="5.5" ry="49" fill="#eef0f2"/>
    <path d="M76 68 Q92 63 106 59" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.5" fill="none"/>
    <rect x="24" y="83" width="34" height="34" rx="11" fill="url(#megaGrip)" stroke="var(--ink)" stroke-width="5"/>
    <rect x="30" y="89" width="9" height="12" rx="3.5" fill="#fff" opacity="0.45"/>
    <path d="M163 56 Q190 100 163 144" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>
    <path d="M183 38 Q217 100 183 162" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" opacity="0.45"/>
    <path d="M200 168 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4-5.6 -5.6-2.4 5.6-2.4z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.1" stroke-linejoin="round"/>
    <circle cx="90" cy="150" r="2.2" fill="var(--accent)" opacity="0.7"/>
    <circle cx="130" cy="16" r="1.8" fill="var(--yellow)" opacity="0.75"/>
  </g>
  <circle cx="18" cy="150" r="3.5" fill="var(--teal)"/>
  <circle cx="270" cy="150" r="2.6" fill="var(--yellow)" opacity="0.8"/>
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
  <path d="M32 30 C41 23 50 25 55 32" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.5"/>
  <circle cx="83" cy="66" r="5.5" fill="var(--cat-tracking)"/>
  <circle cx="18" cy="70" r="3.5" fill="var(--cat-bid)" opacity="0.88"/>
</svg>`;

const MAILGEN_ILLUSTRATION = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <pattern id="mg-dots" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="1.6" cy="1.6" r="1.6" fill="#c98a00"/>
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
