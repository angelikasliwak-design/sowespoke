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
};

/* Maskottchen: freundliche Lupe im Pop-Art-Comic-Stil — kräftige Füllung,
   dicke schwarze Comic-Konturen, Stern-Badge. Bewusste Abkehr vom reinen
   Line-Art-Look nach explizitem Nutzerwunsch nach mehr Comic-Charakter. */
const MASCOT_SVG = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <circle cx="28" cy="28" r="19" fill="var(--accent)" stroke="var(--ink)" stroke-width="3"/>
  <path d="M41 41 L57 57" stroke="var(--ink)" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M41 41 L57 57" stroke="var(--yellow)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="21" cy="26" r="3.6" fill="#fff"/>
  <circle cx="35" cy="26" r="3.6" fill="#fff"/>
  <circle cx="21.5" cy="26.5" r="1.7" fill="var(--ink)"/>
  <circle cx="35.5" cy="26.5" r="1.7" fill="var(--ink)"/>
  <path d="M20 35c3 3.6 9 3.6 12 0" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M7 7 l3.2 7.6 7.6 3.2 -7.6 3.2 -3.2 7.6 -3.2 -7.6 -7.6 -3.2 7.6 -3.2z" fill="var(--yellow)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
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

/* Verspielte Eck-Illustrationen im Line-Art-Stil der übrigen Icons, statt
   reiner Halbton-Punkte — für Hero-Bereiche und Seitenkarten. Ersetzen die
   Halbton-Textur, keine dicken Konturen/Panels (No-Border-Regel bleibt). */
const HERO_ILLUSTRATION = `<svg viewBox="0 0 200 200" aria-hidden="true">
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
  </defs>
  <g transform="rotate(-7 100 100)">
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
  </g>
  <circle cx="156" cy="14" r="5" fill="var(--yellow)"/>
  <circle cx="16" cy="156" r="3.5" fill="var(--teal)"/>
</svg>`;

const SIDECARD_ILLUSTRATION = `<svg viewBox="0 0 200 200" aria-hidden="true">
  <path d="M70 10 C95 -4 122 -2 132 20 C156 14 178 28 176 52 C196 58 202 82 184 98
    C196 116 186 140 162 142 C160 166 134 180 112 168 C96 186 66 186 54 166
    C28 172 6 154 12 130 C-8 120 -8 94 12 82 C4 60 20 36 46 38 C50 18 60 8 70 10 Z"
    fill="var(--yellow)"/>
  <circle cx="70" cy="60" r="5" fill="var(--accent)" opacity="0.5"/>
  <circle cx="120" cy="90" r="4" fill="var(--accent)" opacity="0.4"/>
  <circle cx="90" cy="115" r="3.5" fill="var(--accent)" opacity="0.35"/>
  <circle cx="130" cy="55" r="3" fill="var(--accent)" opacity="0.4"/>
</svg>`;

const CATEGORY_ICON = {
  "KI & Automatisierung": "sparkle",
  "Gebotsstrategien": "gauge",
  "Targeting": "crosshair",
  "Kreativ & Formate": "layoutGrid",
  "Tracking & Messung": "chartLine",
};
