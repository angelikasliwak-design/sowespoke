/**
 * Anfragen an Microsoft — echte Inhalte aus content/microsoft-anfragen/.
 * Programmnamen bleiben auf Englisch (offizielle Microsoft-Produktnamen),
 * Beschreibungen/Hinweise sind auf Deutsch übersetzt. Alle generierten
 * E-Mails sind bewusst auf Englisch und gehen an einen festen
 * Microsoft-Kontakt (MS_CONTACT_NAME) — Ausnahme von der sonstigen
 * Deutsch-/du-ihr-Regel, weil es sich um externe Kommunikation mit
 * Microsoft handelt, nicht um Kunden-E-Mails.
 */

const MS_CONTACT_NAME = "Anne-Celine";

// Quelle: content/microsoft-anfragen/Pilot Activation (1).docx — enthält
// drei Tabellen. Verwendet werden die aktuelle Tabelle "Closed Beta /
// Experiment nomination overview (Jan 2026)" (löst die ältere "Mid-2025
// pilots & betas"-Liste ab) sowie der allgemeine Experiment-/Alpha-/
// Beta-Katalog (erste Tabelle im Dokument, ohne Datum). Stufe (Experiment/
// Alpha/Beta) ist im Dokument nur bei drei Einträgen des Katalogs explizit
// angegeben — bei den übrigen steht im Dokument keine Stufe, deshalb bleibt
// das Feld dort leer statt geraten zu werden.
const MS_BETA_PROGRAMS = [
  { id: "custom-report-builder", group: "Nominierungs-Überblick Januar 2026", name: "Custom Report Builder", what: "Erweitertes Reporting-Tool für stark individualisierte Reports über die Standard-Microsoft-Advertising-Oberfläche hinaus", markets: "Global (gezielt)", note: "Nur auf Einladung. Für Advertiser/Partner mit fortgeschrittenem Reporting-Bedarf und aktiver MAP-Nutzung." },
  { id: "ad-delivery-diagnostics", group: "Nominierungs-Überblick Januar 2026", name: "Ad Delivery Diagnostics (Copilot)", what: "Diagnose-Einblicke zu Auslieferung, Pacing und Ausspielungs-Einschränkungen", markets: "Global (außer China)", note: "Verwaltete Konten mit aktiven Kampagnen und einer Historie von Auslieferungsproblemen." },
  { id: "billing-diagnostics", group: "Nominierungs-Überblick Januar 2026", name: "Billing Diagnostics (Copilot)", what: "Diagnose-Einblicke zu Abrechnung, Rechnungsstellung und Spend-Abweichungen", markets: "Global", note: "Erfordert historische Abrechnungsaktivität und frühere Abrechnungsanfragen." },
  { id: "native-consent-legal", group: "Nominierungs-Überblick Januar 2026", name: "Native Ads – Consent & Legal Notices", what: "Ermöglicht Consent-Handling und rechtliche Hinweise für Native Ads", markets: "Global", note: "Advertiser mit Native Ads, insbesondere regulierte Branchen." },
  { id: "doubleverify", group: "Nominierungs-Überblick Januar 2026", name: "DoubleVerify Integration", what: "Viewability- und Brand-Safety-Messung über DoubleVerify", markets: "Global", note: "Erfordert aktive Display-/Video-Ausgaben und Zustimmung zum DV-Datenaustausch." },
  { id: "modeled-conversions", group: "Nominierungs-Überblick Januar 2026", name: "Modeled Conversions Reporting", what: "Erweitertes Conversion-Reporting mit modellierten Daten (wenn direkte Signale fehlen)", markets: "Global", note: "UET implementiert, laufendes Conversion-Tracking, ausreichendes Volumen." },
  { id: "vertical-ads-expansion", group: "Nominierungs-Überblick Januar 2026", name: "Enable Vertical Ads – Multichannel Expansion", what: "Erweiterung der zulässigen Vertical Ads auf weitere Microsoft-Advertising-Kanäle", markets: "Marktabhängig", note: "Advertiser, die bereits genehmigte Vertical Ads schalten (z. B. Auto, Reise, Finanzen)." },
  { id: "google-discovery-import", group: "Nominierungs-Überblick Januar 2026", name: "Google Discovery Import", what: "Import von Google-Discovery-Kampagnen in Microsoft Advertising", markets: "Amerika / EMEA / APAC", note: "Advertiser mit aktiven Google-Discovery-Kampagnen, die Feedback geben möchten." },
  { id: "debit-credit-card-ads", group: "Nominierungs-Überblick Januar 2026", name: "Debit / Credit Card Ads", what: "Anzeigen für Debit- und Kreditkarten-Angebote", markets: "US, CA, UK, AU, FR, DE", note: "Reguliert. Finanzielle Advertiser-Eignung und Policy-Konformität erforderlich." },
  { id: "health-insurance-ads", group: "Nominierungs-Überblick Januar 2026", name: "Health Insurance Ads", what: "Feed-basierte Anzeigen für Krankenversicherungstarife", markets: "Marktabhängig (v. a. USA/EU)", note: "Stark eingeschränkt. Erfordert Lizenzierung und Validierung als Gesundheits-Advertiser." },
  { id: "lodging-solutions", group: "Nominierungs-Überblick Januar 2026", name: "Lodging Solutions (Hotel Price Ads / Property Promotion Ads)", what: "Hotel-Anzeigen mit Preisen, Verfügbarkeit und Objektdetails in der Suche", markets: "Global (phasenweise)", note: "Reise-Advertiser mit strukturierten Hotel-/Feed-Daten." },
  { id: "audience-ads-tcpa", group: "Nominierungs-Überblick Januar 2026", name: "Audience Ads – tCPA / Max Conversions", what: "Automatisierte Gebotsstrategien für Audience Ads auf Basis von Conversion-Zielen", markets: "Amerika / EMEA / APAC", note: "Erfordert Audience-Ads-Nutzung, Conversion-Tracking und ausreichendes Volumen." },
  { id: "affinity-targeting", group: "Nominierungs-Überblick Januar 2026", name: "Affinity Targeting (Audience Signals)", what: "Zielgruppen-Targeting basierend auf Interessen, Gewohnheiten und Affinitäten", markets: "Global (kontrolliert)", note: "Eingeschränkter Zugang, klarer Anwendungsfall erforderlich." },
  { id: "keyword-targeting-signals", group: "Nominierungs-Überblick Januar 2026", name: "Keyword Targeting (Audience Signals)", what: "Zielgruppen-Targeting über keyword-basierte Intent-Signale", markets: "Global (kontrolliert)", note: "Ähnliche Anforderungen wie Affinity-Targeting; Reife und Skalierung erforderlich." },

  { id: "enable-uet-rep", group: "Katalog – Tracking & Conversions", name: "Enable UET REP", what: "Interner Schalter, um UET-Reporting zwangsweise für Tests und Validierung zu aktivieren", note: "Stufe laut Dokument: Experiment." },
  { id: "disable-uet-rep", group: "Katalog – Tracking & Conversions", name: "Disable UET REP", what: "Interne Testfunktion zum Deaktivieren des UET-Reportings" },
  { id: "showroom-ads", group: "Katalog – Creative & Ad-Formate", name: "Showroom Ads", what: "Frühes experimentelles Anzeigenformat, das Produkte in einer immersiven Oberfläche präsentiert" },
  { id: "custom-segments-targeting", group: "Katalog – Targeting & Planung", name: "Custom Segments Targeting", what: "Experimentelles Zielgruppen-Targeting auf Basis selbst definierter Segmente" },
  { id: "category-insights-click-coverage", group: "Katalog – Reporting, Diagnostics & Messung", name: "Category Insights and Click Coverage Reports", what: "Diagnose-Einblicke zu Kategorien-Performance und Click-Coverage-Lücken", note: "Stufe laut Dokument: Alpha." },
  { id: "ads-globalization-korea", group: "Katalog – Kampagnentypen & Expansion", name: "Ads Globalization: PA Korea", what: "Frühe Erweiterung der Anzeigenfunktionen für den südkoreanischen Markt" },
  { id: "website-control-lists", group: "Katalog – Kampagnentypen & Expansion", name: "Website Control Lists – Exclusions", what: "Kontrollen zum Ausschluss bestimmter Websites oder Platzierungen" },
  { id: "html5-display-ads", group: "Katalog – Creative & Ad-Formate", name: "HTML5 Display Ads", what: "Neues Display-Creative-Format mit HTML5-Assets" },
  { id: "conversions-api-capi", group: "Katalog – Tracking & Conversions", name: "Conversions API (CAPI)", what: "Serverseitiges Conversion-Tracking zur Stärkung der Optimierungssignale" },
  { id: "sponsored-promotions-brands", group: "Katalog – Creative & Ad-Formate", name: "Sponsored Promotions by Brands", what: "Von Marken finanzierte Promotions in Partner-/Handelsumgebungen", note: "Stufe laut Dokument: Beta." },
  { id: "conversion-value-rules", group: "Katalog – Gebotsstrategien", name: "Conversion Value Rules", what: "Anpassung von Conversion-Werten zur Beeinflussung wertbasierten Bietens" },
  { id: "autobidding-vertical-ads", group: "Katalog – Gebotsstrategien", name: "Autobidding (tCPA / Max Conv) for Vertical Ads", what: "Automatisiertes Bieten erweitert auf vertikal-spezifische Anzeigen" },
  { id: "offline-conversions-error-report", group: "Katalog – Reporting, Diagnostics & Messung", name: "Offline Conversions Error Report in API", what: "Einblick in Fehler beim Hochladen von Offline-Conversions über die API" },
  { id: "ads-studio-video-templates", group: "Katalog – Creative & Ad-Formate", name: "Ads Studio – Video Templates", what: "Vorgefertigte Video-Vorlagen zur schnelleren Creative-Produktion" },
  { id: "nielsen-demo-new-clients", group: "Katalog – Reporting, Diagnostics & Messung", name: "Nielsen demo (new clients)", what: "Nielsen-Messintegration für Neukunden" },
  { id: "nielsen-one-existing-clients", group: "Katalog – Reporting, Diagnostics & Messung", name: "Nielsen One (existing clients)", what: "Erweiterte Nielsen-One-Messung für Bestandskunden" },
  { id: "placement-targeting-planner", group: "Katalog – Targeting & Planung", name: "Placement targeting in Planner", what: "Möglichkeit, Media nach Platzierung zu planen" },
  { id: "search-campaign-diagnostic-tile", group: "Katalog – Reporting, Diagnostics & Messung", name: "Search Campaign Diagnostic Tile", what: "Diagnose-Einblicke direkt in der Search-Kampagnen-Oberfläche" },
  { id: "device-topics-targeting-planner", group: "Katalog – Targeting & Planung", name: "Device & topics targeting support in Planner", what: "Planungsunterstützung für Geräte- und Themen-Targeting" },
  { id: "lia-only-shopping-pmax", group: "Katalog – Kampagnentypen & Expansion", name: "LIA-only Shopping & PMAX campaigns", what: "Local Inventory Ads ausschließlich über Shopping und PMax unterstützt" },
  { id: "new-customer-acquisition-pmax", group: "Katalog – Gebotsstrategien", name: "Support New Customer Acquisition Goal for PMax", what: "Neues Optimierungsziel zur Gewinnung von Neukunden" },
  { id: "enhanced-keyword-planner-intl", group: "Katalog – Targeting & Planung", name: "Enhanced Keyword Planner – INTL languages", what: "Verbesserte Keyword-Recherche für internationale Sprachen" },
  { id: "data-driven-attribution", group: "Katalog – Tracking & Conversions", name: "Data-Driven Attribution", what: "Datenbasierte Zuordnung von Conversion-Wert über alle Touchpoints" },
  { id: "ad-preview-hub-awf", group: "Katalog – Creative & Ad-Formate", name: "Ad preview hub – AWF", what: "Zentralisierte Vorschau-Erfahrung für AWF-Anzeigen" },
  { id: "pmax-self-serve-negative-keywords", group: "Katalog – Kampagnentypen & Expansion", name: "Performance Max – self-serve negative keywords", what: "Möglichkeit, negative Keywords direkt in PMax zu verwalten" },
  { id: "ads-studio-brand-kit-native", group: "Katalog – Creative & Ad-Formate", name: "Ads Studio – Brand Kit on Native", what: "Anwendung von Markenstyling auf Native Ads" },
  { id: "predictive-targeting-planner", group: "Katalog – Targeting & Planung", name: "Predictive targeting in Planner", what: "Vorausschauende Zielgruppen- und Targeting-Vorschläge in der Planung" },
  { id: "optout-autogen-assets-rsas", group: "Katalog – Creative & Ad-Formate", name: "Opt-out: autogen assets in new RSAs", what: "Möglichkeit, automatisch generierte RSA-Assets zu deaktivieren" },
  { id: "mobile-app-install-pmax", group: "Katalog – Kampagnentypen & Expansion", name: "Mobile app install powered by PMAX", what: "App-Install-Kampagnen über Performance Max" },
  { id: "ad-strength-pmax-mma-awf", group: "Katalog – Reporting, Diagnostics & Messung", name: "Ad strength for PMAX, MMA, AWF", what: "Diagnose zu Anzeigenqualität und -stärke über mehrere Formate hinweg" },
  { id: "linkedin-job-seniority", group: "Katalog – Targeting & Planung", name: "LinkedIn Job Seniority", what: "Targeting auf Basis des LinkedIn-Karrierelevel-Signals" },
];

// Quelle: Screenshot "External (client facing) tasks" aus content/microsoft-anfragen/bulkteam.png
const MS_BULK_TEAM_TASKS = [
  { id: "bulk-conversion-goals", name: "Bulk Conversion Goal Creation", what: "Erstellung und Konfiguration standardisierter Conversion-Ziele." },
  { id: "audience-network-optout", name: "Search Workflow > Audience Network Opt-Outs", what: "Aktualisierung der Kontoeinstellungen, um die Suchanzeigen-Erweiterung ins Audience Network zu deaktivieren." },
  { id: "sitelink-optout", name: "Automated Extension Opt-Outs (Sitelinks)", what: "Deaktivierung automatisch generierter Sitelinks/Erweiterungen, sodass nur manuell freigegebene Assets ausgespielt werden." },
  { id: "human-reviewed-images", name: "Human Reviewed Image Extensions", what: "Manuelle Prüfung und Ersetzung automatisch ausgewählter Bild-Assets zur Qualitätsverbesserung & Behebung von DSAT-Problemen." },
  { id: "scaled-pmax-setup", name: "Scaled PMAX Campaign Setup", what: "Aufbau von PMax-Kampagnen nach einem definierten Setup-Framework." },
  { id: "scaled-awf-setup", name: "Scaled AWF Campaign Setup", what: "Aufbau von AWF-Kampagnen nach einem definierten Setup-Framework." },
  { id: "impression-remarketing-lists", name: "Impression-Based Remarketing Lists", what: "Erstellung und Anwendung von Remarketing-Listen nach festgelegten Impression-Schwellenwerten und UET-Lookback-Fenstern für geeignete Kampagnen." },
  { id: "syndication-enablements", name: "Syndication Enablements at Scale", what: "Aktivierung bzw. Prüfung syndizierungsbezogener Einstellungen je nach Partner-Eignung und vorgegebenen Anweisungen." },
  { id: "url-exclusions", name: "Account Level Website URL Exclusions", what: "Anwendung von URL-Ausschlussregeln, um Ausgaben auf minderwertigen oder nicht-strategischen Domains zu vermeiden (laut Policy oder AM-Vorgabe)." },
  { id: "auto-generated-assets-optout", name: "Auto-Generated Assets (Opt-Out)", what: "Deaktivierung automatisch generierter Creatives (MMAs, Bilder, RSAs) auf Konto-/Kampagnenebene, damit Assets manuell bleiben." },
];

const MS_AUTOBIDDING_REPORT = {
  cautionDE:
    "Solche Reports können jederzeit über Anne-Celine angefragt werden. Bitte prüft jedoch vor einer Weiterleitung an den Kunden immer kritisch, ob die Empfehlungen im jeweiligen Account und in Bezug auf die vereinbarten Ziele sinnvoll sind.\n\nEinige Punkte sehe ich insbesondere bei Accounts mit festen Performance-Zielen kritisch. Zum Beispiel die Empfehlung, auf Max Clicks oder Max Conversions umzusteigen: Diese Strategien können zwar dabei helfen, zusätzliche Lernsignale für den Algorithmus zu generieren und mehr Volumen zu erzielen, priorisieren jedoch in erster Linie Volumen statt Effizienz.\n\nDadurch erhält der Algorithmus zwar mehr Daten zum Lernen, gleichzeitig besteht jedoch die Gefahr, dass sich die Kampagne von den eigentlichen Performance-Zielen (z. B. Ziel-ROAS oder Ziel-CPA) entfernt und die Effizienz sinkt.",
  exampleReport:
    "I would like to share the autobidding report which helps identify optimization opportunities across campaigns\nThe report flags campaigns that are:\nMissing their CPA/ROAS targets\nLimited by budget\nUsing overly aggressive bid goals\nLacking sufficient conversion volume for automation\nCandidates for bidding strategy or tracking improvements\nIt also provides recommended actions, such as increasing budgets, adjusting targets, consolidating low-volume campaigns, or reviewing conversion tracking setup\nThis can be particularly useful during performance reviews, budget discussions, and Smart Bidding/PMax optimization conversations, helping prioritize actions that could unlock additional volume and improve efficiency\n\nHere below you can find an AI summary that comes with the excel file >\nThe summary below is generated using AI. As always, your account should be your primary source of truth for finer details.\n\nHere are the latest Microsoft Ads Autobidding recommendations for 2026-06-04 To 2026-07-03:\n\nExecutive Summary\nAuto-bidding is broadly healthy, with 43 total Portfolios/Campaigns: 29 within target, 14 missed. The primary pattern behind misses is target/strategy fit — several Portfolios/Campaigns are running with targets that don't align to observed performance or don't have enough conversion volume to reliably optimize. The single priority focus this period (Opportunity-driven) is to unlock incremental volume by relieving budget constraints on in-target campaigns, while keeping targets stable where conversion volume is still building.\n\n🔧 Tune-ups needed\n– Adjust TROAS/MaxConversionValue targets to better match historical performance (affects 20 Portfolios/Campaigns) — to reduce missed-target pressure and stabilize delivery.\n– Address low conversion volume before expecting target adherence (affects 3 Portfolios/Campaigns) — by simplifying structure (portfolio consolidation) and/or using a strategy that can learn with fewer signals (e.g., MaxClicks/MaxConversions, add mid-funnel goals).\n\n⏳ Still optimizing (do not change yet)\n– Maintain current targets, no bid/goal changes (affects 3 Portfolios/Campaigns) — where performance is within target but conversion volume is still low, to avoid resetting optimization and destabilizing results.\n\n💰 Budget opportunities\n– Increase budgets on constrained, within-target Portfolios/Campaigns (affects 27 Portfolios/Campaigns) — to capture additional volume without changing bid goals.\n\n✅ Healthy snapshot\n– Keep the current setup (affects 2 Portfolios/Campaigns) — where targets are being met without constraints, use these as benchmarks for pacing and structure.",
};
