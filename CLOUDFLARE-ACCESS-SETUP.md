# Cloudflare Access einrichten — Zugriff nur für Firmen-E-Mails

Diese Anleitung sperrt das Wissenszentrum so ab, dass nur Personen mit einer `@sowespoke.com`-E-Mail-Adresse (oder welche Domain ihr sonst nutzt) reinkommen. Läuft komplett im Cloudflare-Dashboard, kein Code nötig.

## Voraussetzung

Die Cloudflare-Pages-Seite muss bereits mit dem GitHub-Repo verbunden sein (siehe vorheriger Schritt im Dashboard).

## Schritte

1. **Zero Trust Dashboard öffnen**
   Im Cloudflare-Dashboard links im Menü zu **Zero Trust** wechseln (falls noch nie genutzt: einmalig einen kostenlosen Zero-Trust-Plan aktivieren — bis 50 Nutzer:innen kostenlos, für ein internes Team locker ausreichend).

2. **Neue Access-Application anlegen**
   Zero Trust → **Access** → **Applications** → **Add an application** → **Self-hosted**.

3. **Application konfigurieren**
   - **Application name:** z. B. „Sowespoke Wissenszentrum"
   - **Session duration:** z. B. 24 Stunden (wie oft sich Kolleg:innen neu einloggen müssen)
   - **Application domain:** die Domain eurer Cloudflare-Pages-Seite auswählen (z. B. `sowespoke-wissenszentrum.pages.dev` oder eine eigene verbundene Domain)

4. **Zugriffsregel setzen (Policy)**
   - **Policy name:** z. B. „Nur Firmen-Domain"
   - **Action:** Allow
   - **Include:** Regeltyp **Emails ending in** → `@sowespoke.com` eintragen (eure echte Domain)
   - Speichern.

5. **Login-Methode wählen**
   Unter **Settings → Authentication** könnt ihr festlegen, wie sich Mitarbeiter:innen einloggen:
   - **One-time PIN per E-Mail** (Standard, braucht nichts weiter — jede:r bekommt einen Code per Mail)
   - Oder falls ihr Microsoft 365 als Firmen-Login nutzt: **Add new → Azure AD** verbinden, dann loggen sich Kolleg:innen mit ihrem gewohnten Microsoft-Konto ein (etwas mehr Einrichtungsaufwand, aber nahtloser).

6. **Testen**
   Seite in einem privaten/Inkognito-Fenster aufrufen — es sollte jetzt ein Cloudflare-Login-Bildschirm erscheinen, bevor die Seite lädt. Mit einer Firmen-E-Mail einloggen zum Testen; mit einer privaten E-Mail sollte der Zugriff verweigert werden.

## Wichtig

- Das schützt die **gesamte Seite**, inklusive der `/api/news`-Funktion.
- Ihr könnt jederzeit weitere E-Mail-Adressen oder -Domains zur Policy hinzufügen (z. B. für externe Partner:innen, falls später gewünscht).
- Kein Code im Projekt nötig — falls ihr das Repo je wechselt oder neu deployt, bleibt die Access-Konfiguration in Cloudflare bestehen, solange die Domain gleich bleibt.
