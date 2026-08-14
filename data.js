/**
 * Best Practices sind meist allgemeine, von uns formulierte Empfehlungen —
 * einzelne Einträge stammen aber direkt aus echten Microsoft-Foliensätzen
 * (dann mit Quellenangabe am Ende des Texts markiert). STANDALONE_TEMPLATES
 * sind eure echten
 * E-Mail-Vorlagen (aus content/email-vorlagen/ ausgelesen). Anrede-Sätze
 * (Grußzeile, "ich hoffe es geht gut", Abschluss) kommen einheitlich aus
 * app.js/composeMail — die contentIhr-Texte hier tragen nur den fachlichen
 * Teil, im ihr-Register, ohne Imperativ-Verben (Instruktionen im Infinitiv),
 * damit die du/ihr-Umschaltung grammatisch sauber funktioniert.
 */

const BEST_PRACTICES = [
  {
    id: "search-experiments-ai-max",
    title: "Search Experiments mit AI Max: Setup & Best Practices",
    body:
      "Setup in drei Schritten:\n1. Such-Experiment anlegen und die Kontrollkampagne (die ursprüngliche Search-Kampagne) sowie Start-/Enddatum wählen — die Treatment-Kampagne wird automatisch als Kopie erstellt.\n2. In der Treatment-Kampagne AI Max aktivieren und 2–4 Wochen laufen lassen, währenddessen die Experiment-Scorecard beobachten.\n3. Ergebnisse auswerten — das Experiment kann jederzeit beendet werden; bei Uplift lässt sich AI Max auf die Original- oder eine neue Kampagne anwenden.\n\nBest Practices: Hochvolumige Kampagnen wählen, sonst dauert es länger bis zur statistischen Signifikanz. Kampagnen mit Shared- oder Lifetime-Budget werden aktuell nicht unterstützt, und eine Kampagne kann nicht in mehreren aktiven Experimenten gleichzeitig laufen. Beim Traffic-Split 50/50 und Cookie-basiert (nicht Search-basiert) wählen — der Split lässt sich nach Start nicht mehr ändern. Nur eine Variable gleichzeitig testen und mindestens 2, idealerweise 4 Wochen laufen lassen.\n\nQuelle: Microsoft-Foliensatz „Experiments: Best Practices“ / „Experiments: Setup“.",
  },
];

const STANDALONE_TEMPLATES = [
  {
    id: "no-change-konten",
    title: "Erinnerung: Konten ohne Änderungen",
    summary: "Erinnert Kund:innen, in gemeldeten Konten ohne Aktivität eine manuelle Änderung vorzunehmen, damit das Quartal angerechnet wird.",
    extraFields: [
      { key: "Quartal", label: "Quartal", placeholder: "z. B. 1/2026" },
      { key: "Konten", label: "Betroffene Konten (eine Zeile pro Konto)", placeholder: "z. B.\nKonto A (F1104JH6)\nKonto B (X7598960)", multiline: true },
    ],
    subject: "Erinnerung: Manuelle Änderung für Quartal {Quartal} nötig",
    // Umstrukturiert (2026-08-14) — zwei Runden: erst grob umgegliedert
    // ("Text muss besser formatiert werden"), dann exakt an die vom Nutzer
    // eingefügte Original-Vorlage angeglichen (Reihenfolge Anleitung→
    // Konten-Liste→Frist, "N. Schritt:"-Präfix, "egal ob klein oder groß"-
    // Hinweis vor den vier Beispiel-Änderungen als eigene Liste statt
    // Kommasatz, "und die Betreuung" bei der Quartals-Anrechnung ergänzt,
    // abschließendes Dankeschön). Inhaltlich 1:1 die Nutzer-Vorlage, nur
    // grammatisch auf Infinitiv/ihr-Register umgestellt (Original nutzte
    // Du-Imperative wie "Melde dich an") — toDu() in app.js wandelt nur
    // einzelne ihr-Wörter (euch/eure/eurem/…) in die Du-Form um, keine
    // Verbformen; jede Konstruktion mit konjugiertem Verb + "ihr"/"du" als
    // Subjekt bliebe im jeweils anderen Anrede-Modus falsch stehen (siehe
    // toDu()-Kommentar in app.js). Faktisch identisch, nur so geschrieben,
    // dass "Mehrere Personen (ihr)" UND "Eine Person (du)" beide korrekt
    // herauskommen.
    contentIhr:
      "Wir haben soeben die Liste von Microsoft erhalten, die zeigt, in welchen Konten im Quartal {Quartal} keine Änderungen durch eure Agentur durchgeführt wurden. Bitte über den Login in eurem Agentur-Konto eine manuelle Änderung an den unten genannten Konten vornehmen.\n\nAnleitung zur Änderung:\n1. Schritt: Im Manager-Konto anmelden.\n2. Schritt: Vom Manager-Konto in das jeweils genannte Unterkonto wechseln.\n3. Schritt: Eine manuelle Änderung an der Kampagne vornehmen — ob klein oder groß, spielt keine Rolle, zum Beispiel:\n- Hinzufügen einer Labelsetzung\n- Aufnahme neuer Keywords\n- Anpassung der Zielgruppen\n- Änderung der Gebotsstrategie oder des Budgets\n\nKonten:\n{Konten}\n\nDiese Änderungen sollten bis spätestens Ende des Quartals {Quartal} vorgenommen werden, damit der Ad-Spend und die Betreuung noch für das komplette Quartal {Quartal} eurer Agentur angerechnet werden können.\n\nKurze Rückmeldung ist willkommen, sobald die Änderungen umgesetzt wurden — oder falls es bei einem Konto nicht möglich sein sollte.\n\nVielen Dank für eure Unterstützung! :-)",
  },
  {
    id: "quartalsende-hinweis",
    title: "Quartalsende-Hinweis: Konten ohne Änderungen",
    summary: "Erinnerung kurz vor Quartalsende, ohne konkrete Konten zu nennen — mit derselben Anleitung/Struktur wie die Vorlage mit Konten-Liste.",
    // Zweite Überarbeitung (2026-08-14, Nutzer-Wunsch nach erneutem Blick auf
    // die Original-Vorlage): sollte inhaltlich/strukturell "genau so wie" die
    // Original-Vorlage (Anleitung, Beispiel-Änderungen, Frist-Begründung,
    // Rückmeldebitte, Dankeschön) sein — nur ohne die konkrete Konten-Liste
    // — und als echte Erinnerungs-Mail wirken, nicht mehr als weicher,
    // zurückhaltender "Hinweis" (erste Fassung, jetzt ersetzt). Kein
    // Konten-Feld — "ohne Konten zu nennen" bleibt explizite Vorgabe.
    extraFields: [
      { key: "Quartal", label: "Quartal", placeholder: "z. B. 1/2026" },
    ],
    subject: "Erinnerung: Kontoänderungen im Quartal {Quartal}",
    // Schlusssatz "Bei Fragen dazu sind wir gerne für euch da." entfernt
    // (2026-08-14, Nutzer-Test per Screenshot): composeMail() hängt über
    // GREETING[mode].close ohnehin automatisch eine inhaltsgleiche
    // Abschluss-Zeile an ("Falls ihr/du Fragen habt/hast, könnt/kannst
    // ihr/du mich jederzeit kontaktieren.") — beide hintereinander lasen
    // sich wie eine unbeabsichtigte Dopplung. Betreff zugleich auf
    // "Kontoänderungen" umgestellt (Nutzer-Wunsch), statt nur "Quartal
    // neigt sich dem Ende zu" — beschreibt den eigentlichen Inhalt direkter.
    contentIhr:
      "Wir haben soeben die Liste von Microsoft erhalten, die zeigt, in welchen Konten bislang keine Änderungen durch eure Agentur durchgeführt wurden. Für das Quartal {Quartal} könnte das auch eure Konten betreffen.\n\nFalls dort in diesem Quartal noch nichts angepasst wurde, bitten wir euch um eine manuelle Änderung durch den Login über euer Agentur-Konto.\n\nAnleitung zur Änderung:\n1. Schritt: Mit der E-Mail-Adresse eurer Agentur im Manager-Konto anmelden.\n2. Schritt: Vom Manager-Konto in das jeweils betroffene Unterkonto wechseln.\n3. Schritt: Eine manuelle Änderung an der Kampagne vornehmen — klein oder groß spielt keine Rolle, zum Beispiel:\n- Hinzufügen einer Labelsetzung\n- Aufnahme neuer Keywords\n- Anpassung der Zielgruppen\n- Änderung der Gebotsstrategie oder des Budgets\n\nDiese Änderungen sollten bis spätestens Ende des Quartals {Quartal} vorgenommen werden, damit der Ad-Spend und die Betreuung noch für das komplette Quartal {Quartal} eurer Agentur angerechnet werden können.\n\nKurze Rückmeldung ist willkommen, sobald die Änderungen umgesetzt wurden — oder falls es nicht möglich sein sollte.\n\nVielen Dank für eure Unterstützung! :-)",
  },
  {
    id: "neue-konto-erstellung",
    title: "Neues Konto erstellt",
    summary: "Informiert Kund:innen über ein neu erstelltes Microsoft-Advertising-Konto inkl. Verwaltungskonto, Adaccount und Verknüpfungsschritten.",
    extraFields: [
      { key: "KundenName", label: "Kundenname/Firma", placeholder: "z. B. Musterfirma GmbH" },
      { key: "Verwaltungskonto", label: "Kontonummer Verwaltungskonto (MCC)", placeholder: "z. B. K120005U88" },
      { key: "Adaccount", label: "Adaccount-Nummer", placeholder: "z. B. F1104JH6" },
    ],
    subject: "Euer neues Microsoft-Advertising-Konto ist eingerichtet",
    contentIhr:
      "Ich habe soeben folgendes Konto für {KundenName} erstellt: {Verwaltungskonto}.\n\nBei diesem Konto handelt es sich um das sogenannte Verwaltungskonto. Darin kann die Zahlungsmethode hinterlegt und für den Adaccount genutzt werden. Hinter {Adaccount} verbirgt sich der zugehörige Adaccount, der für die Anzeigenschaltung genutzt wird.\n\nBitte die Einladung annehmen, die an {KundenName} geschickt wurde. Anschließend im Verwaltungskonto unter „Kontozusammenfassung” > „Anfragen” > „Konto verknüpfen” die 8-stellige Kontonummer eingeben.\n\nEine detaillierte Anleitung dazu: https://sowespokealliance.zohodesk.eu/portal/de/kb/articles/accountverkn%C3%BCpfung\n\nBitte beachten: Die AIV-Prüfung muss innerhalb der nächsten 30 Tage durchgeführt werden.",
  },
  {
    id: "onboarding",
    title: "Onboarding nach dem Erstgespräch",
    summary: "Willkommens-Mail mit Zusammenfassung des Kennenlerngesprächs, Ticketsystem, SWS-Coins-Programm und Newsletter-Anmeldungen.",
    extraFields: [
      { key: "MeetingTermin", label: "Nächster Meeting-Termin", placeholder: "z. B. 15.03.2026 um 14 Uhr" },
    ],
    subject: "Willkommen bei Sowespoke — eure Themen aus dem Erstgespräch",
    contentIhr:
      "Es hat mich gefreut, euch kennenzulernen — ich freue mich auf die Zusammenarbeit! Hier noch einmal die besprochenen Themen mit den passenden Links.\n\nÜber das Ticketsystem (https://sowespokealliance.zohodesk.eu/portal/de/signin) lassen sich verschiedene Anfragen stellen. Wir übernehmen die Kontoerstellung mit Microsoft Ads, sodass das Konto korrekt verknüpft ist und für die SWS-Coins-Sammlung berücksichtigt wird — einlösbar über Zusatzservices.\n\nDen Kontostand der SWS-Coins können Geschäftsführung oder Teamleitung nach einmaliger Registrierung (https://sws-alliance.com/account) auf unserer Website einsehen. Dort gibt es auch alle Store-Leistungen im Überblick, buchbar über das Ticketsystem. Die Coins-Gutschrift wird immer 2,5 Monate nach Quartalsende als Rechnung versendet. Ein Coin entspricht 2 Euro; vom gesamten Ad Spend gibt es 4 % als Coins zurück. Beispiel: Bei 3.000 Euro Ad Spend im ersten Quartal wären das 120 Euro bzw. 60 Coins. Coins verfallen nicht.\n\nEs gibt zwei Newsletter-Anmeldungen: einen für strategische Themen (Geschäftsführung/Teamleitung) und einen für operative Updates (Account Manager). Anmeldung für strategische Themen: https://bwtgu-zcmp.maillist-manage.eu/ua/Optin?od=12ba7e9a21ec&zx=14ad3e4f61&lD=11d8194b40665319&n=11699f74d997743&sD=11d8194b406d3cb5\n\nIch freue mich auf unser nächstes Meeting am {MeetingTermin}!",
  },
];
