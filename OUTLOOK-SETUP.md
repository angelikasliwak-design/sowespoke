# Outlook-Versand einrichten (Microsoft 365 / Entra ID)

Für den Versand aus dem Wissenszentrum über Outlook (wie heute über Gmail)
braucht es **eine App-Registrierung** im Microsoft-365-Konto der Firma.
Das kann nur ein Admin (Rolle *Anwendungsadministrator* oder *Globaler Admin*).
Aufwand: ca. 10 Minuten.

## Schritte für den Admin

1. <https://entra.microsoft.com> → **Identität → Anwendungen → App-Registrierungen → Neue Registrierung**
2. Name: `SOWESPOKE Wissenszentrum – Mailversand`
3. Unterstützte Kontotypen: **Nur Konten in diesem Organisationsverzeichnis** (Single Tenant)
4. Umleitungs-URI: Plattform **Web**, Adresse
   `https://sowespoke.pages.dev/api/auth/outlook/callback`
   (falls das Intranet unter einer eigenen Domain läuft, diese stattdessen)
5. **Registrieren** → auf der Übersichtsseite notieren:
   - Anwendungs-ID (Client-ID)
   - Verzeichnis-ID (Tenant-ID)
6. **Zertifikate & Geheimnisse → Neuer geheimer Clientschlüssel** (Laufzeit z. B. 24 Monate)
   → den **Wert** sofort kopieren (wird nur einmal angezeigt).
7. **API-Berechtigungen → Berechtigung hinzufügen → Microsoft Graph →
   Delegierte Berechtigungen**: `Mail.Send`, `offline_access`, `User.Read`
   → **Administratorzustimmung erteilen** (damit nicht jede Person einzeln zustimmen muss).

Wichtig: **delegierte** Berechtigungen, keine Anwendungsberechtigungen –
jede Person sendet nur in ihrem eigenen Namen, nach eigener Anmeldung.

## Übergabe

Client-ID, Tenant-ID und geheimen Schlüssel **nicht per Mail/Chat** schicken,
sondern direkt im Cloudflare-Pages-Projekt als Secrets eintragen
(Einstellungen → Variablen und Geheimnisse):

- `MS_CLIENT_ID`
- `MS_TENANT_ID`
- `MS_CLIENT_SECRET`

Danach wird die Verbindung wie bei Gmail gebaut: Knopf „Mit Outlook
verbinden“ (eigene Zustimmung, Token verschlüsselt pro Person in KV),
„Jetzt per Outlook senden“, Terminierung über denselben Planer.
