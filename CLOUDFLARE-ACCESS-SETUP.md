# Login einrichten — Microsoft-Anmeldung nur für Firmen-Konten

Seit 2026-11-05 läuft die Anmeldung über **„Mit Microsoft anmelden"** (Microsoft Entra ID, OpenID Connect) statt über Google. Umgesetzt im Projekt selbst: `functions/_middleware.js`, `functions/_lib/microsoft.js`, `functions/api/auth/microsoft/*`, `login.html`. Akzeptiert werden nur Konten **aus dem Sowespoke-Tenant** mit einer `@sowespoke.com`- oder `@sowespoke.de`-Adresse (`ALLOWED_DOMAINS` in `functions/_lib/auth.js`). Kein eigenes Passwort, keine Nutzerdatenbank: Microsoft prüft die Identität, die Seite prüft Signatur, Tenant und Domain.

Die Gmail-Verbindung zum Mailversand (`functions/api/auth/gmail/*`, Secrets `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`) ist davon unabhängig und bleibt bestehen.

> **Wichtig:** Solange die drei Microsoft-Secrets unten nicht gesetzt sind, kann sich nach dem Deploy niemand anmelden (die Login-Seite meldet „Microsoft-Login nicht konfiguriert"). Erst einrichten, dann den Branch nach `main` übernehmen.

## 1. App in Microsoft Entra registrieren

Im [Microsoft Entra Admin Center](https://entra.microsoft.com) mit einem Konto, das App-Registrierungen anlegen darf (z. B. Anwendungsadministrator):

1. **Identität → Anwendungen → App-Registrierungen → Neue Registrierung**
   - Name: z. B. „Sowespoke Wissenszentrum"
   - Unterstützte Kontotypen: **Nur Konten in diesem Organisationsverzeichnis (einzelner Mandant)**
   - Umleitungs-URI: Plattform **Web**, `https://sowespoke.pages.dev/api/auth/microsoft/callback`
   - Registrieren.
2. Auf der Übersichtsseite der App notieren:
   - **Anwendungs-ID (Client-ID)** → wird `MICROSOFT_CLIENT_ID`
   - **Verzeichnis-ID (Mandanten-ID)** → wird `MICROSOFT_TENANT_ID` (eine GUID, nicht „common")
3. **Zertifikate & Geheimnisse → Neuer geheimer Clientschlüssel** → Beschreibung, Ablauf (z. B. 24 Monate) → den **Wert** sofort kopieren (wird nur einmal angezeigt) → wird `MICROSOFT_CLIENT_SECRET`. Ablaufdatum im Kalender vormerken.
4. **API-Berechtigungen:** `Microsoft Graph → openid`, `email`, `profile` (delegiert) genügen; `User.Read` ist standardmäßig da und kann bleiben. Optional „Administratorzustimmung erteilen", damit Mitarbeitende keinen Zustimmungsdialog sehen.
5. Optional, um den Zugriff auf eine Gruppe zu begrenzen: **Unternehmensanwendungen → die App → Eigenschaften → „Zuweisung erforderlich" = Ja**, dann unter „Benutzer und Gruppen" die berechtigten Personen/Gruppen zuweisen.

## 2. Secrets im Cloudflare-Pages-Projekt setzen

Pages-Projekt „sowespoke" → **Settings → Variables and secrets** → für **Production** (und **Preview**, falls die Vorschau-URL auch funktionieren soll):
- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_TENANT_ID`
- `SESSION_SECRET` — bereits gesetzt, bleibt

Alternativ per CLI:

```
wrangler pages secret put MICROSOFT_CLIENT_ID --project-name=sowespoke
wrangler pages secret put MICROSOFT_CLIENT_SECRET --project-name=sowespoke
wrangler pages secret put MICROSOFT_TENANT_ID --project-name=sowespoke
```

Für eine Vorschau-URL (`<branch>.sowespoke.pages.dev`) muss deren Callback zusätzlich als Umleitungs-URI in der App-Registrierung stehen, z. B. `https://stil-tool-factory.sowespoke.pages.dev/api/auth/microsoft/callback`.

## 3. Deploy auslösen

Secrets gelten erst ab der **nächsten** Deployment — nach dem Setzen einmal im Dashboard unter **Deployments** die neueste Deployment über „..." → **Retry deployment** anstoßen (oder einen neuen Commit pushen).

## 4. Testen

`sowespoke.pages.dev` in einem privaten Fenster öffnen → leitet auf `/login` um. „Mit Microsoft anmelden" klicken, mit dem Sowespoke-Microsoft-Konto anmelden → Startseite. Ein Konto aus einem anderen Microsoft-Verzeichnis landet gar nicht erst beim Rücksprung (einzelner Mandant); ein Konto im Tenant mit fremder Domain wird mit „Zugriff nur mit einem @sowespoke.com- oder @sowespoke.de-Konto" abgelehnt.

Bestehende Google-Sessions bleiben bis zu ihrem Ablauf (max. 14 Tage) gültig, weil die Session selbst unverändert ist. Sofort alle abmelden: `SESSION_SECRET` durch einen neuen Zufallswert ersetzen.

## Falls die Domain mal wechselt oder eine weitere hinzukommt

`ALLOWED_DOMAINS` in `functions/_lib/auth.js` anpassen und in der App-Registrierung ggf. eine weitere Umleitungs-URI hinterlegen, falls die Seite unter einer eigenen Domain statt `sowespoke.pages.dev` läuft.
