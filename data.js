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
      { key: "Konten", label: "Betroffene Konten (eine Zeile pro Konto)", placeholder: "z. B.\nKonto A (F1104JH6)\nKonto B (X7598960)" },
    ],
    subject: "Erinnerung: Manuelle Änderung für Quartal {Quartal} nötig",
    contentIhr:
      "Wir haben soeben die Liste von Microsoft erhalten, die zeigt, in welchen Konten im Quartal {Quartal} keine Änderungen durch eure Agentur durchgeführt wurden.\n\nBitte über den Login in eurem Agentur-Konto eine manuelle Änderung an den folgenden Konten vornehmen:\n\n{Konten}\n\nAnleitung zur Änderung:\n1. Im Manager-Konto anmelden.\n2. Vom Manager-Konto in das jeweilige Unterkonto wechseln.\n3. Eine manuelle Änderung an der Kampagne vornehmen, z. B. Hinzufügen einer Labelsetzung, neue Keywords, Anpassung der Zielgruppen, oder Änderung von Gebotsstrategie/Budget.\n\nDie Änderungen sollten bis spätestens Ende des Quartals {Quartal} vorgenommen werden, damit der Ad-Spend für das komplette Quartal eurer Agentur angerechnet werden kann. Kurze Rückmeldung ist willkommen, sobald das erledigt ist — oder falls es bei einem Konto nicht möglich sein sollte.",
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
