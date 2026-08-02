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

/* Verspielte Eck-Illustrationen im Line-Art-Stil der übrigen Icons, statt
   reiner Halbton-Punkte — für Hero-Bereiche und Seitenkarten. Ersetzen die
   Halbton-Textur, keine dicken Konturen/Panels (No-Border-Regel bleibt). */
const HERO_ILLUSTRATION = `<svg viewBox="0 0 200 200" aria-hidden="true">
  <g fill="none" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M58 78 L142 48 L142 152 L58 122 Z"/>
    <rect x="32" y="88" width="26" height="24" rx="6"/>
  </g>
  <g fill="none" stroke="var(--accent)" stroke-width="3.2" stroke-linecap="round">
    <path d="M156 65 Q176 100 156 135"/>
    <path d="M174 50 Q202 100 174 150"/>
  </g>
  <path d="M30 34 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="var(--yellow)"/>
  <path d="M166 158 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="var(--yellow)"/>
  <circle cx="148" cy="20" r="4" fill="var(--teal)"/>
</svg>`;

const SIDECARD_ILLUSTRATION = `<svg viewBox="0 0 100 100" aria-hidden="true">
  <path d="M22 14 l3.4 8.6 8.6 3.4 -8.6 3.4 -3.4 8.6 -3.4 -8.6 -8.6 -3.4 8.6 -3.4z" fill="var(--yellow)"/>
  <circle cx="62" cy="12" r="3.4" fill="var(--accent)"/>
  <circle cx="82" cy="32" r="2.6" fill="var(--accent)"/>
  <circle cx="46" cy="36" r="2.2" fill="var(--teal)"/>
</svg>`;

const CATEGORY_ICON = {
  "KI & Automatisierung": "sparkle",
  "Gebotsstrategien": "gauge",
  "Targeting": "crosshair",
  "Kreativ & Formate": "layoutGrid",
  "Tracking & Messung": "chartLine",
};
