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

// Quelle: content/microsoft-anfragen/Pilot Activation (1).docx — Tabelle
// "Closed Beta / Experiment nomination overview (Jan 2026)", aktuellste
// Version im Dokument (löst die ältere "Mid-2025 pilots & betas"-Liste ab).
const MS_BETA_PROGRAMS = [
  { id: "custom-report-builder", name: "Custom Report Builder", what: "Erweitertes Reporting-Tool für stark individualisierte Reports über die Standard-Microsoft-Advertising-Oberfläche hinaus", markets: "Global (gezielt)", note: "Nur auf Einladung. Für Advertiser/Partner mit fortgeschrittenem Reporting-Bedarf und aktiver MAP-Nutzung." },
  { id: "ad-delivery-diagnostics", name: "Ad Delivery Diagnostics (Copilot)", what: "Diagnose-Einblicke zu Auslieferung, Pacing und Ausspielungs-Einschränkungen", markets: "Global (außer China)", note: "Verwaltete Konten mit aktiven Kampagnen und einer Historie von Auslieferungsproblemen." },
  { id: "billing-diagnostics", name: "Billing Diagnostics (Copilot)", what: "Diagnose-Einblicke zu Abrechnung, Rechnungsstellung und Spend-Abweichungen", markets: "Global", note: "Erfordert historische Abrechnungsaktivität und frühere Abrechnungsanfragen." },
  { id: "native-consent-legal", name: "Native Ads – Consent & Legal Notices", what: "Ermöglicht Consent-Handling und rechtliche Hinweise für Native Ads", markets: "Global", note: "Advertiser mit Native Ads, insbesondere regulierte Branchen." },
  { id: "doubleverify", name: "DoubleVerify Integration", what: "Viewability- und Brand-Safety-Messung über DoubleVerify", markets: "Global", note: "Erfordert aktive Display-/Video-Ausgaben und Zustimmung zum DV-Datenaustausch." },
  { id: "modeled-conversions", name: "Modeled Conversions Reporting", what: "Erweitertes Conversion-Reporting mit modellierten Daten (wenn direkte Signale fehlen)", markets: "Global", note: "UET implementiert, laufendes Conversion-Tracking, ausreichendes Volumen." },
  { id: "vertical-ads-expansion", name: "Enable Vertical Ads – Multichannel Expansion", what: "Erweiterung der zulässigen Vertical Ads auf weitere Microsoft-Advertising-Kanäle", markets: "Marktabhängig", note: "Advertiser, die bereits genehmigte Vertical Ads schalten (z. B. Auto, Reise, Finanzen)." },
  { id: "google-discovery-import", name: "Google Discovery Import", what: "Import von Google-Discovery-Kampagnen in Microsoft Advertising", markets: "Amerika / EMEA / APAC", note: "Advertiser mit aktiven Google-Discovery-Kampagnen, die Feedback geben möchten." },
  { id: "debit-credit-card-ads", name: "Debit / Credit Card Ads", what: "Anzeigen für Debit- und Kreditkarten-Angebote", markets: "US, CA, UK, AU, FR, DE", note: "Reguliert. Finanzielle Advertiser-Eignung und Policy-Konformität erforderlich." },
  { id: "health-insurance-ads", name: "Health Insurance Ads", what: "Feed-basierte Anzeigen für Krankenversicherungstarife", markets: "Marktabhängig (v. a. USA/EU)", note: "Stark eingeschränkt. Erfordert Lizenzierung und Validierung als Gesundheits-Advertiser." },
  { id: "lodging-solutions", name: "Lodging Solutions (Hotel Price Ads / Property Promotion Ads)", what: "Hotel-Anzeigen mit Preisen, Verfügbarkeit und Objektdetails in der Suche", markets: "Global (phasenweise)", note: "Reise-Advertiser mit strukturierten Hotel-/Feed-Daten." },
  { id: "audience-ads-tcpa", name: "Audience Ads – tCPA / Max Conversions", what: "Automatisierte Gebotsstrategien für Audience Ads auf Basis von Conversion-Zielen", markets: "Amerika / EMEA / APAC", note: "Erfordert Audience-Ads-Nutzung, Conversion-Tracking und ausreichendes Volumen." },
  { id: "affinity-targeting", name: "Affinity Targeting (Audience Signals)", what: "Zielgruppen-Targeting basierend auf Interessen, Gewohnheiten und Affinitäten", markets: "Global (kontrolliert)", note: "Eingeschränkter Zugang, klarer Anwendungsfall erforderlich." },
  { id: "keyword-targeting-signals", name: "Keyword Targeting (Audience Signals)", what: "Zielgruppen-Targeting über keyword-basierte Intent-Signale", markets: "Global (kontrolliert)", note: "Ähnliche Anforderungen wie Affinity-Targeting; Reife und Skalierung erforderlich." },
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
