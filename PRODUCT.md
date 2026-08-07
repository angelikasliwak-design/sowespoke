# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Statisches HTML/CSS/JS als Frontend (kein Build-Prozess), erweitert um **Cloudflare Pages Functions** für serverseitige Aufgaben, die im Browser nicht gehen: RSS-Aggregation (CORS), Login, künftig ein API-basierter Chatbot. Kein eigener Server, keine Datenbank — bleibt auf Cloudflare Pages betreibbar. Zugriffsschutz über **Google OAuth im Anwendungscode** (`functions/_middleware.js`, `functions/api/auth/google/*`), nicht mehr über Cloudflare Access.

## Users

Mitarbeiter:innen der eigenen Firma (rein interne Nutzung, Zugriff auf die Firmen-Domain beschränkt), insbesondere im Bereich Online-Marketing/Kundenbetreuung. Die Firma betreut als Agentur viele andere Agenturen (Support, Analysen, Neuigkeiten) mit Fokus auf Microsoft Advertising, perspektivisch auch weitere Kanäle (Google, Meta, TikTok, Snapchat).

## Product Purpose

Internes Wissenszentrum ("Sowespoke"), zentrale Anlaufstelle für: aktuelle Online-Marketing-News (automatisch aus RSS-Quellen), offizielle Microsoft-Präsentationen mit Beta-/Feature-Guides, und eine Sammlung aller E-Mail-Vorlagen samt Best Practices. Ziel: alles an einem Ort, sicher (nur firmenintern zugänglich), und die tägliche Arbeit spürbar erleichtern.

## Positioning

Statt verstreuter Präsentationsfolien, einzelner Blog-Lesezeichen und einer Sammlung alter E-Mails an unterschiedlichen Orten: ein zentrales, durchsuchbares System, das Wissen strukturiert bewahrt, aktuell hält (RSS) und direkt in kommunizierbares Kundenmaterial übersetzt (Teaser-Mails mit anpassbaren Feldern).

## Operating Context

- **Startseite:** automatisch aktualisierter News-Feed aus mehreren Branchen-RSS-Quellen (Kanal-getaggt: Microsoft/Google/Meta/TikTok/Snapchat/Rechtliches/Allgemein), Fokus Microsoft Advertising.
- **Präsentationen:** offizielle Microsoft-Präsentationen (vom Nutzer als PDF bereitgestellt, manuell eingepflegt, nach Datum sortiert) mit treuer Zusammenfassung (nur Dokumentinhalt, keine Erfindungen), extrahierten Beta-/Feature-Guides, E-Mail-Generierung pro Feature, und Download-Link zur Originaldatei.
- **Vorlagen & Wissensdatenbank:** alle E-Mail-Vorlagen gesammelt, mit vorlagenspezifischen Zusatzfeldern (z. B. Kontonummer bei einer Konto-Erstellungs-Vorlage, nicht nur Kundenname), plus Best-Practices-Sammlung.
- **Anstehende Termine:** Widget mit wiederkehrenden Marketing-Terminen (Black Friday, Prime Day, Muttertag usw.) und Countdown.
- **Zugriffsschutz:** nur Personen mit einem `@sowespoke.com`/`@sowespoke.de`-Google-Konto kommen rein — Login über "Mit Google anmelden" (`/login`), Google verifiziert die E-Mail, die Domain-Prüfung läuft serverseitig im Code.
- **Geplant, noch nicht entschieden:** ein Chatbot, der Fragen ausschließlich auf Basis der hinterlegten Präsentationen und des offiziellen Microsoft-Blogs beantwortet (RAG-Ansatz, mit Quellenangabe) — braucht einen LLM-API-Key, den der Nutzer noch bereitstellen muss.

## Capabilities and Constraints

- Automatischer RSS-Feed über eine Cloudflare Pages Function (Browser kann fremde Feeds wegen CORS nicht direkt laden); Caching serverseitig (~15 Min.).
- **Offen:** Live-Übersetzung der (teils englischen) RSS-Inhalte ins Deutsche ist noch nicht umgesetzt — braucht denselben LLM-API-Key wie der geplante Chatbot. Bis dahin erscheinen Original-Sprache-Inhalte mit Sprach-Badge.
- Präsentationen werden manuell vom Nutzer bereitgestellt (PDF, Ordner `content/presentations/`), nicht über ein Live-Upload-Formular — bewusste Entscheidung, kein Datei-Backend nötig.
- E-Mail-Vorlagen mit variablen, vorlagenspezifischen Feldern (nicht nur ein einheitliches "Kundenname"-Feld).
- Zugriffsschutz über Google OAuth ("Mit Google anmelden"), umgesetzt in `functions/_middleware.js` und `functions/api/auth/google/*` — sperrt die gesamte Seite inkl. `/api/*`, außer `/login` selbst. Erfordert die Secrets `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` im Cloudflare-Pages-Projekt (Setup-Doku: `CLOUDFLARE-ACCESS-SETUP.md`). Keine eigene Nutzerdatenbank — Google übernimmt die Identitätsprüfung, die App prüft nur die E-Mail-Domain.
- Suchfunktion über alle Inhalte.

## Brand Commitments

Name: "Sowespoke". Visuelle Marke: Magenta als dominante Akzentfarbe, Petrol/Gelb sparsam, siehe DESIGN.md.

## Evidence on Hand

18 echte Microsoft-/Branchen-Präsentationen liegen als PDF vor (`content/presentations/`), Inhalt wird ausgewertet und nur mit tatsächlich im Dokument enthaltenen Informationen zusammengefasst — keine Ergänzung aus Allgemeinwissen. RSS-Quellen bestätigt funktionsfähig: Microsoft Advertising Blog (offiziell), Search Engine Land, adseed SEA-News, OMR. t3n wurde am 2026-08-02 wieder entfernt (nur fachfremder Gesamt-Feed verfügbar, kein Marketing-spezifischer Feed). Drei weitere Quellen (THINK with Google, analyticsmania, PPC Hero) sind technisch noch ungeklärt (kein einfacher RSS-Zugang bzw. blockierter Abruf).

## Product Principles

1. Schneller Zugriff schlägt Vollständigkeit — man muss in Sekunden zum gesuchten Thema finden.
2. Wissen aus Präsentationen wird strukturiert bewahrt und bleibt an der Quelle nachprüfbar (Originaldatei verlinkt), nicht nur einmalig gezeigt.
3. Jede Beta-Funktion ist direkt in kommunizierbares Kundenmaterial (Teaser-Mail) übersetzbar.
4. Wiederverwendbarkeit vor Neuerfindung — bestehende Vorlagen und Best Practices werden sichtbar gemacht statt jedes Mal neu geschrieben.
5. Nur firmenintern zugänglich — Sicherheit ist keine Zusatzoption, sondern Grundvoraussetzung.

## Accessibility & Inclusion

Zugriff auf Personen mit `@sowespoke.com`/`@sowespoke.de`-Google-Konto beschränkt (Google OAuth im Code, nicht Cloudflare Access), sonst keine öffentliche Zugänglichkeit. Keine zusätzlichen rechtlichen Pflichtangaben (z. B. Impressum) nötig, da nicht öffentlich zugänglich.
