/**
 * Case Studies — Kundenergebnisse und Testresultate aus den Konten.
 * Manuell gepflegt (wie presentations-data.js/data.js), kein Backend nötig.
 * Neue Einträge einfach unten anfügen — die Anzeige sortiert automatisch
 * nach "date", neueste zuerst.
 */
const CASE_STUDIES = [
  {
    id: "beispiel-autobidding-roas",
    isPlaceholder: true,
    client: "Beispiel-Kunde GmbH",
    title: "Autobidding-Umstellung: so würde ein echter Eintrag aussehen",
    date: "2026-06-15",
    channel: "Microsoft",
    metricHeadline: "+45 % ROAS",
    summaryDE:
      "Platzhalter-Eintrag. Ersetzt werden sollte er durch eine echte, aus dem Kundenkonto belegte Case Study: was wurde getestet, über welchen Zeitraum, mit welchem Ergebnis.",
    keyFactsDE: [
      "Testzeitraum: 8 Wochen",
      "Ausgangswert vor dem Test dokumentieren",
      "Ergebnis mit Datenquelle (Screenshot/Export) belegen",
    ],
    // Beispieldaten für die Performance-Chart-Karte (2026-08-14, Nutzer-
    // Wunsch: Reporting aus dem Microsoft-Konto zeigen, wie sich die
    // Performance nach Einführung eines Beta/Feature entwickelt hat).
    // Rein illustrativ — bei einem echten Eintrag ersetzen jeweils
    // exportierte Wochenwerte aus dem Kundenkonto diese Platzhalter-Zahlen,
    // `changeDate` markiert den Tag der Umstellung. Vier Metriken als
    // Auswahl, weil ein Advertising-Ergebnis selten an nur einer Kennzahl
    // hängt (ROAS kann steigen, während CPA gleichzeitig sinkt — beides
    // gehört zur vollständigen Geschichte).
    performanceData: {
      changeDate: "2026-04-19",
      changeLabel: "Autobidding-Umstellung",
      metrics: [
        {
          key: "roas",
          label: "ROAS",
          suffix: "x",
          decimals: 2,
          points: [
            { date: "2026-03-23", value: 2.9 },
            { date: "2026-03-30", value: 2.95 },
            { date: "2026-04-06", value: 3.05 },
            { date: "2026-04-13", value: 3.1 },
            { date: "2026-04-20", value: 3.3 },
            { date: "2026-04-27", value: 3.7 },
            { date: "2026-05-04", value: 4.0 },
            { date: "2026-05-11", value: 4.2 },
            { date: "2026-05-18", value: 4.4 },
            { date: "2026-05-25", value: 4.6 },
            { date: "2026-06-01", value: 4.7 },
            { date: "2026-06-08", value: 4.9 },
          ],
        },
        {
          key: "cpa",
          label: "CPA",
          prefix: "€",
          decimals: 0,
          lowerIsBetter: true,
          points: [
            { date: "2026-03-23", value: 41 },
            { date: "2026-03-30", value: 43 },
            { date: "2026-04-06", value: 40 },
            { date: "2026-04-13", value: 44 },
            { date: "2026-04-20", value: 39 },
            { date: "2026-04-27", value: 36 },
            { date: "2026-05-04", value: 34 },
            { date: "2026-05-11", value: 32 },
            { date: "2026-05-18", value: 30 },
            { date: "2026-05-25", value: 29 },
            { date: "2026-06-01", value: 28 },
            { date: "2026-06-08", value: 30 },
          ],
        },
        {
          key: "conversions",
          label: "Conversions",
          decimals: 0,
          points: [
            { date: "2026-03-23", value: 82 },
            { date: "2026-03-30", value: 88 },
            { date: "2026-04-06", value: 84 },
            { date: "2026-04-13", value: 86 },
            { date: "2026-04-20", value: 92 },
            { date: "2026-04-27", value: 98 },
            { date: "2026-05-04", value: 104 },
            { date: "2026-05-11", value: 108 },
            { date: "2026-05-18", value: 112 },
            { date: "2026-05-25", value: 115 },
            { date: "2026-06-01", value: 118 },
            { date: "2026-06-08", value: 120 },
          ],
        },
        {
          key: "ctr",
          label: "CTR",
          suffix: "%",
          decimals: 2,
          points: [
            { date: "2026-03-23", value: 2.05 },
            { date: "2026-03-30", value: 2.12 },
            { date: "2026-04-06", value: 2.08 },
            { date: "2026-04-13", value: 2.15 },
            { date: "2026-04-20", value: 2.2 },
            { date: "2026-04-27", value: 2.25 },
            { date: "2026-05-04", value: 2.3 },
            { date: "2026-05-11", value: 2.35 },
            { date: "2026-05-18", value: 2.4 },
            { date: "2026-05-25", value: 2.42 },
            { date: "2026-06-01", value: 2.45 },
            { date: "2026-06-08", value: 2.48 },
          ],
        },
      ],
    },
  },
];
