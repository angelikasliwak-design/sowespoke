/**
 * Anfragen an Microsoft — echte Inhalte aus content/microsoft-anfragen/.
 * Alle generierten E-Mails sind bewusst auf Englisch und gehen an einen
 * festen Microsoft-Kontakt (MS_CONTACT_NAME) — Ausnahme von der sonstigen
 * Deutsch-/du-ihr-Regel, weil es sich um externe Kommunikation mit
 * Microsoft handelt, nicht um Kunden-E-Mails.
 *
 * WICHTIG: Namensschreibweise des Kontakts wurde uns in zwei Varianten
 * genannt ("Anne Celine" / "Anne-Célie") — hier vorerst "Anne-Célie"
 * hinterlegt, bitte einmal bestätigen/korrigieren.
 */

const MS_CONTACT_NAME = "Anne-Célie";

// Stand: Nominierungs-Überblick Januar 2026 (aktuellste Version im Dokument,
// löst die ältere "Mid-2025 pilots & betas"-Liste ab).
const MS_BETA_PROGRAMS = [
  { id: "custom-report-builder", name: "Custom Report Builder", what: "Advanced reporting tool allowing highly customized reports beyond standard Microsoft Advertising UI", markets: "Global (targeted)", note: "Invite-only. For advertisers/partners with advanced reporting needs and active MAP usage." },
  { id: "ad-delivery-diagnostics", name: "Ad Delivery Diagnostics (Copilot)", what: "Diagnostic insights explaining delivery, pacing, and serving limitations", markets: "Global (excl. CN)", note: "Managed accounts with active campaigns and a history of delivery issues." },
  { id: "billing-diagnostics", name: "Billing Diagnostics (Copilot)", what: "Diagnostic insights explaining billing, invoicing, and spend discrepancies", markets: "Global", note: "Requires historical billing activity and past billing inquiries." },
  { id: "native-consent-legal", name: "Native Ads – Consent & Legal Notices", what: "Enables consent handling and legal disclaimers for Native Ads", markets: "Global", note: "Advertisers running Native Ads, especially regulated industries." },
  { id: "doubleverify", name: "DoubleVerify Integration", what: "Viewability and brand-safety measurement via DoubleVerify", markets: "Global", note: "Requires active Display/Video spend and acceptance of DV data-sharing." },
  { id: "modeled-conversions", name: "Modeled Conversions Reporting", what: "Enhanced conversion reporting using modeled data (when direct signals are missing)", markets: "Global", note: "UET implemented, live conversion tracking, sufficient volume." },
  { id: "vertical-ads-expansion", name: "Enable Vertical Ads – Multichannel Expansion", what: "Expands eligible Vertical Ads into additional Microsoft Advertising channels", markets: "Market-dependent", note: "Advertisers already running approved vertical ads (e.g. Auto, Travel, Finance)." },
  { id: "google-discovery-import", name: "Google Discovery Import", what: "Import Google Discovery campaigns into Microsoft Advertising", markets: "Americas / EMEA / APAC", note: "Advertisers actively running Google Discovery campaigns and willing to provide feedback." },
  { id: "debit-credit-card-ads", name: "Debit / Credit Card Ads", what: "Ads promoting debit and credit card offerings", markets: "US, CA, UK, AU, FR, DE", note: "Regulated. Financial advertiser eligibility and policy compliance required." },
  { id: "health-insurance-ads", name: "Health Insurance Ads", what: "Ads promoting health insurance plans (feed-based)", markets: "Market-dependent (mostly US / EU)", note: "Highly restricted. Requires licensing and healthcare advertiser validation." },
  { id: "lodging-solutions", name: "Lodging Solutions (Hotel Price Ads / Property Promotion Ads)", what: "Hotel ads showing pricing, availability, and property details in search", markets: "Global (phased)", note: "Travel advertisers with structured hotel/feed data." },
  { id: "audience-ads-tcpa", name: "Audience Ads – tCPA / Max Conversions", what: "Automated bidding strategies for Audience Ads using conversion goals", markets: "Americas / EMEA / APAC", note: "Requires Audience Ads usage, conversion tracking, and scale." },
  { id: "affinity-targeting", name: "Affinity Targeting (Audience Signals)", what: "Audience targeting based on user interests, habits, and affinities", markets: "Global (controlled)", note: "Limited access, strong use case required." },
  { id: "keyword-targeting-signals", name: "Keyword Targeting (Audience Signals)", what: "Audience targeting using keyword-based intent signals", markets: "Global (controlled)", note: "Similar requirements to Affinity targeting; maturity and scale required." },
];

// Quelle: Screenshot "External (client facing) tasks" aus content/microsoft-anfragen/bulkteam.png
const MS_BULK_TEAM_TASKS = [
  { id: "bulk-conversion-goals", name: "Bulk Conversion Goal Creation", what: "Create and configure standardized conversion goals." },
  { id: "audience-network-optout", name: "Search Workflow > Audience Network Opt-Outs", what: "Update account level settings to disable the search ad extension into Audience." },
  { id: "sitelink-optout", name: "Automated Extension Opt-Outs (Sitelinks)", what: "Disable automatically generated sitelinks and extensions so manually approved assets are served." },
  { id: "human-reviewed-images", name: "Human Reviewed Image Extensions", what: "Manually review and replace auto-selected image assets to improve quality & address DSAT issues." },
  { id: "scaled-pmax-setup", name: "Scaled PMAX Campaign Setup", what: "Build PMAX campaigns using a defined setup framework." },
  { id: "scaled-awf-setup", name: "Scaled AWF Campaign Setup", what: "Build AWF campaigns using a defined setup framework." },
  { id: "impression-remarketing-lists", name: "Impression-Based Remarketing Lists", what: "Create and apply remarketing lists aligned to specified impression thresholds and UET lookback windows for use in eligible campaigns." },
  { id: "syndication-enablements", name: "Syndication Enablements at Scale", what: "Enable or validate syndication-related settings and requirements based on partner eligibility and provided instructions." },
  { id: "url-exclusions", name: "Account Level Website URL Exclusions", what: "Apply URL exclusion rules to prevent spend on low quality or non-strategic domains as defined by policy or AM guidance." },
  { id: "auto-generated-assets-optout", name: "Auto-Generated Assets (Opt-Out)", what: "Disable auto-generated creatives (MMAs, images, RSAs) at the account/campaign level to keep assets manual." },
];

const MS_AUTOBIDDING_REPORT = {
  cautionDE:
    "Solche Reports können jederzeit über Anne-Célie angefragt werden. Bitte prüft jedoch vor einer Weiterleitung an den Kunden immer kritisch, ob die Empfehlungen im jeweiligen Account und in Bezug auf die vereinbarten Ziele sinnvoll sind.\n\nEinige Punkte sehe ich insbesondere bei Accounts mit festen Performance-Zielen kritisch. Zum Beispiel die Empfehlung, auf Max Clicks oder Max Conversions umzusteigen: Diese Strategien können zwar dabei helfen, zusätzliche Lernsignale für den Algorithmus zu generieren und mehr Volumen zu erzielen, priorisieren jedoch in erster Linie Volumen statt Effizienz.\n\nDadurch erhält der Algorithmus zwar mehr Daten zum Lernen, gleichzeitig besteht jedoch die Gefahr, dass sich die Kampagne von den eigentlichen Performance-Zielen (z. B. Ziel-ROAS oder Ziel-CPA) entfernt und die Effizienz sinkt.",
  exampleReport:
    "I would like to share the autobidding report which helps identify optimization opportunities across campaigns\nThe report flags campaigns that are:\nMissing their CPA/ROAS targets\nLimited by budget\nUsing overly aggressive bid goals\nLacking sufficient conversion volume for automation\nCandidates for bidding strategy or tracking improvements\nIt also provides recommended actions, such as increasing budgets, adjusting targets, consolidating low-volume campaigns, or reviewing conversion tracking setup\nThis can be particularly useful during performance reviews, budget discussions, and Smart Bidding/PMax optimization conversations, helping prioritize actions that could unlock additional volume and improve efficiency\n\nHere below you can find an AI summary that comes with the excel file >\nThe summary below is generated using AI. As always, your account should be your primary source of truth for finer details.\n\nHere are the latest Microsoft Ads Autobidding recommendations for 2026-06-04 To 2026-07-03:\n\nExecutive Summary\nAuto-bidding is broadly healthy, with 43 total Portfolios/Campaigns: 29 within target, 14 missed. The primary pattern behind misses is target/strategy fit — several Portfolios/Campaigns are running with targets that don't align to observed performance or don't have enough conversion volume to reliably optimize. The single priority focus this period (Opportunity-driven) is to unlock incremental volume by relieving budget constraints on in-target campaigns, while keeping targets stable where conversion volume is still building.\n\n🔧 Tune-ups needed\n– Adjust TROAS/MaxConversionValue targets to better match historical performance (affects 20 Portfolios/Campaigns) — to reduce missed-target pressure and stabilize delivery.\n– Address low conversion volume before expecting target adherence (affects 3 Portfolios/Campaigns) — by simplifying structure (portfolio consolidation) and/or using a strategy that can learn with fewer signals (e.g., MaxClicks/MaxConversions, add mid-funnel goals).\n\n⏳ Still optimizing (do not change yet)\n– Maintain current targets, no bid/goal changes (affects 3 Portfolios/Campaigns) — where performance is within target but conversion volume is still low, to avoid resetting optimization and destabilizing results.\n\n💰 Budget opportunities\n– Increase budgets on constrained, within-target Portfolios/Campaigns (affects 27 Portfolios/Campaigns) — to capture additional volume without changing bid goals.\n\n✅ Healthy snapshot\n– Keep the current setup (affects 2 Portfolios/Campaigns) — where targets are being met without constraints, use these as benchmarks for pacing and structure.",
};
