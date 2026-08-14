# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Statisches HTML/CSS/JS als Frontend (kein Build-Prozess), erweitert um **Cloudflare Pages Functions** für serverseitige Aufgaben, die im Browser nicht gehen: RSS-Aggregation (CORS), Login, künftig ein API-basierter Chatbot. Kein eigener Server, keine Datenbank — bleibt auf Cloudflare Pages betreibbar. Zugriffsschutz über **Google OAuth im Anwendungscode** (`functions/_middleware.js`, `functions/api/auth/google/*`), nicht mehr über Cloudflare Access.

## Users

Mitarbeiter:innen der eigenen Firma (rein interne Nutzung, Zugriff auf die Firmen-Domain beschränkt), insbesondere im Bereich Online-Marketing/Kundenbetreuung. Die Firma betreut als Agentur viele andere Agenturen (Support, Analysen, Neuigkeiten) mit Fokus auf Microsoft Advertising, perspektivisch auch weitere Kanäle (Google, Meta, TikTok, Snapchat).

## Product Purpose

Internes Wissenszentrum ("Sowespoke"), zentrale Anlaufstelle für: aktuelle Online-Marketing-News (automatisch aus RSS-Quellen), offizielle Microsoft-Präsentationen mit Beta-/Feature-Guides, Case Studies mit echten Kundenergebnissen, und eine Sammlung aller E-Mail-Vorlagen samt Best Practices. Ziel: alles an einem Ort, sicher (nur firmenintern zugänglich), und die tägliche Arbeit spürbar erleichtern.

## Positioning

Statt verstreuter Präsentationsfolien, einzelner Blog-Lesezeichen und einer Sammlung alter E-Mails an unterschiedlichen Orten: ein zentrales, durchsuchbares System, das Wissen strukturiert bewahrt, aktuell hält (RSS) und direkt in kommunizierbares Kundenmaterial übersetzt (Teaser-Mails mit anpassbaren Feldern).

## Operating Context

- **Startseite:** automatisch aktualisierter News-Feed aus mehreren Branchen-RSS-Quellen (Kanal-getaggt: Microsoft/Google/Meta/TikTok/Snapchat/Rechtliches/Allgemein), Fokus Microsoft Advertising.
- **Präsentationen:** offizielle Microsoft-Präsentationen (vom Nutzer als PDF bereitgestellt, manuell eingepflegt, nach Datum sortiert) mit treuer Zusammenfassung (nur Dokumentinhalt, keine Erfindungen), extrahierten Beta-/Feature-Guides, E-Mail-Generierung pro Feature, und Download-Link zur Originaldatei.
- **Vorlagen & Wissensdatenbank:** alle E-Mail-Vorlagen gesammelt, mit vorlagenspezifischen Zusatzfeldern (z. B. Kontonummer bei einer Konto-Erstellungs-Vorlage, nicht nur Kundenname), plus Best-Practices-Sammlung.
- **Case Studies:** Sammlung echter Kundenergebnisse/Testresultate aus den Konten (z. B. "+45% ROAS durch Autobidding-Umstellung"), manuell gepflegt wie die Präsentationen (`case-studies-data.js`), laufend erweiterbar.
- **Anstehende Termine:** Widget mit wiederkehrenden Marketing-Terminen (Black Friday, Prime Day, Muttertag usw.) und Countdown.
- **Zugriffsschutz:** nur Personen mit einem `@sowespoke.com`/`@sowespoke.de`-Google-Konto kommen rein — Login über "Mit Google anmelden" (`/login`), Google verifiziert die E-Mail, die Domain-Prüfung läuft serverseitig im Code.
- **Geplant, noch nicht entschieden:** ein Chatbot, der Fragen ausschließlich auf Basis der hinterlegten Präsentationen und des offiziellen Microsoft-Blogs beantwortet (RAG-Ansatz, mit Quellenangabe) — braucht einen LLM-API-Key, den der Nutzer noch bereitstellen muss.

## Capabilities and Constraints

- Automatischer RSS-Feed über eine Cloudflare Pages Function (Browser kann fremde Feeds wegen CORS nicht direkt laden); Caching serverseitig (~15 Min.).
- Live-Übersetzung der englischsprachigen RSS-Quellen (Microsoft Advertising Blog, Search Engine Land) ins Deutsche über die Google-Gemini-API (`functions/api/news.js`, Secret `GEMINI_API_KEY`, Modell konfigurierbar über `GEMINI_MODEL`, Default `gemini-2.0-flash`) — läuft serverseitig als Batch-Übersetzung, Ergebnis liegt im ohnehin bestehenden 15-Minuten-Response-Cache. Ohne gesetztes/funktionierendes Secret bleibt das bisherige Verhalten (Original-Text + "EN"-Badge) unverändert, kein Fehler (Fehler beim API-Call werden abgefangen, kein Absturz).
  - **Aktuell pausiert (Stand 2026-08-07):** Googles Gemini-API-Nutzungsbedingungen erlauben den kostenlosen Tarif nicht für Nutzer in der EU/EWR/Schweiz/UK (unabhängig von Konto-Typ — sowohl das Firmen- als auch ein privates Google-Konto lieferten `free_tier_requests limit: 0`). Für echte Nutzung wäre eine Zahlungsmethode im Google-Konto nötig (bei diesem Volumen nur Cent-Beträge/Monat) — bewusst zurückgestellt, bis der Nutzer das einrichten möchte. Gleiche Einschränkung gilt für OpenAI/Anthropic (auch dort kein kostenloser EU-Tarif) — der Anbieter ist also nicht das Problem, die Zahlungsmethode ist unvermeidbar für jede LLM-API in der EU.
- Präsentationen werden manuell vom Nutzer bereitgestellt (PDF, Ordner `content/presentations/`), nicht über ein Live-Upload-Formular — bewusste Entscheidung, kein Datei-Backend nötig.
- E-Mail-Vorlagen mit variablen, vorlagenspezifischen Feldern (nicht nur ein einheitliches "Kundenname"-Feld).
- **Direktversand aus dem Mail-Generator** (2026-08-10): "In Gmail öffnen"-Button neben "In Zwischenablage kopieren" öffnet ein Gmail-Compose-Fenster (`mail.google.com/mail/?view=cm&...`) mit vorausgefülltem Empfänger/Betreff/Text — kein serverseitiger Versand, keine Zugangsdaten/Tokens auf der Seite. Ursprünglich als `mailto:`-Link gebaut, aber sofort auf Nutzer-Feedback umgestellt: `mailto:` geht an den vom Betriebssystem registrierten Standard-Handler (unter Windows meist Outlook), unabhängig vom tatsächlich genutzten Mail-Dienst — da der Login hier über Google Workspace läuft, ist Gmail der echte Mail-Dienst aller Nutzer:innen, die Compose-URL umgeht das Handler-Problem komplett. Bewusste Entscheidung gegen echten API-Versand (z. B. Gmail API mit `gmail.send`-Scope): hätte einen erweiterten OAuth-Scope (Neu-Login für alle) und sicher gespeicherte, versandfähige Tokens serverseitig gebraucht — deutlich mehr Angriffsfläche für relativ wenig Zusatznutzen, da die Mail auch so ganz normal im echten Gesendet-Ordner landet. **Diese Entscheidung gilt weiterhin unverändert** — Stand 2026-08-14 ist ein dreiphasiger Plan zur Erweiterung um Serienversand entstanden (Phase A: mehrere personalisierte Empfänger:innen, weiter manueller Versand — bereits umgesetzt; Phase B: echter Gmail-API-Versand mit erweitertem, nur bei Bedarf angeforderten OAuth-Scope; Phase C: Terminierung), aber noch NICHT über Phase A hinaus umgesetzt. Dieser Absatz wird erst bei Phase B umgeschrieben, nicht vorher.
- **Mehrfach-Empfänger mit individueller Personalisierung** (2026-08-14, Phase A): dritter Anrede-Modus im Mail-Generator ("Mehrere Personen, einzeln personalisiert") neben den bestehenden zwei — pro Empfänger:in eigener Name, eigene, separate Mail (kein gemeinsamer Verteiler). Die Empfänger-Liste wird serverseitig gespeichert (`functions/api/recipients.js`, Cloudflare-KV `RECIPIENT_LISTS`, an die Login-E-Mail gebunden), damit sie geräteübergreifend erhalten bleibt statt nur im Browser.
- Zugriffsschutz über Google OAuth ("Mit Google anmelden"), umgesetzt in `functions/_middleware.js` und `functions/api/auth/google/*` — sperrt die gesamte Seite inkl. `/api/*`, außer `/login` selbst. Erfordert die Secrets `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` im Cloudflare-Pages-Projekt (Setup-Doku: `CLOUDFLARE-ACCESS-SETUP.md`). Keine eigene Nutzerdatenbank — Google übernimmt die Identitätsprüfung, die App prüft nur die E-Mail-Domain.
- Suchfunktion über alle Inhalte.

## Brand Commitments

Name: "Sowespoke". Visuelle Marke: Magenta als dominante Akzentfarbe, Petrol/Gelb sparsam, siehe DESIGN.md.

## Evidence on Hand

18 echte Microsoft-/Branchen-Präsentationen liegen als PDF vor (`content/presentations/`), Inhalt wird ausgewertet und nur mit tatsächlich im Dokument enthaltenen Informationen zusammengefasst — keine Ergänzung aus Allgemeinwissen. RSS-Quellen bestätigt funktionsfähig: Microsoft Advertising Blog (offiziell), Search Engine Land, adseed SEA-News, OMR. t3n wurde am 2026-08-02 wieder entfernt (nur fachfremder Gesamt-Feed verfügbar, kein Marketing-spezifischer Feed). Drei weitere Quellen (THINK with Google, analyticsmania, PPC Hero) sind technisch noch ungeklärt (kein einfacher RSS-Zugang bzw. blockierter Abruf).

## Product Principles

1. Schneller Zugriff bleibt das Ziel — aber seit dem Case-Wall-Redesign (2026-08-07, explizite Nutzerentscheidung) darf mehr visuelle Wirkung/Erlebnis dafür ein minimal langsameres Scannen in Kauf nehmen; reine Vollständigkeit bleibt weiterhin nachrangig.
2. Wissen aus Präsentationen wird strukturiert bewahrt und bleibt an der Quelle nachprüfbar (Originaldatei verlinkt), nicht nur einmalig gezeigt.
3. Jede Beta-Funktion ist direkt in kommunizierbares Kundenmaterial (Teaser-Mail) übersetzbar.
4. Wiederverwendbarkeit vor Neuerfindung — bestehende Vorlagen und Best Practices werden sichtbar gemacht statt jedes Mal neu geschrieben.
5. Nur firmenintern zugänglich — Sicherheit ist keine Zusatzoption, sondern Grundvoraussetzung.

## Accessibility & Inclusion

Zugriff auf Personen mit `@sowespoke.com`/`@sowespoke.de`-Google-Konto beschränkt (Google OAuth im Code, nicht Cloudflare Access), sonst keine öffentliche Zugänglichkeit. Keine zusätzlichen rechtlichen Pflichtangaben (z. B. Impressum) nötig, da nicht öffentlich zugänglich.
