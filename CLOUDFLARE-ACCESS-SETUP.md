# Login einrichten — Google-Anmeldung nur für Firmen-Konten

Die Seite ist **nicht mehr** über Cloudflare Access (Zero Trust) abgesperrt, sondern über ein eigenes Login, das direkt im Projekt liegt: `functions/_middleware.js`, `functions/api/auth/google/*`, `login.html`. Anmeldung läuft über **„Mit Google anmelden"** — nur `@sowespoke.com`- oder `@sowespoke.de`-Google-Konten werden akzeptiert (`ALLOWED_DOMAINS` in `functions/_lib/auth.js`). Es gibt kein eigenes Passwort und keine Nutzerdatenbank — Google übernimmt die Identitätsprüfung, die Seite prüft nur die Domain der bestätigten E-Mail.

## 1. Google OAuth-Client anlegen

In der [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (mit dem Google-Workspace-Konto, das zu sowespoke.com/.de gehört):

1. Projekt auswählen oder neu anlegen (z. B. „Sowespoke Wissenszentrum").
2. **APIs & Services → OAuth consent screen**:
   - User Type: **Internal** (nur Konten der eigenen Google-Workspace-Organisation können sich überhaupt am Consent-Screen anmelden — zusätzliche Sicherheitsebene neben der Domain-Prüfung im Code).
   - App-Name, Support-E-Mail ausfüllen, speichern.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**
   - Name: z. B. „Sowespoke Pages"
   - **Authorized redirect URIs:** `https://sowespoke.pages.dev/api/auth/google/callback`
   - Erstellen — Client-ID und Client-Secret werden angezeigt.

## 2. Secrets im Cloudflare-Pages-Projekt setzen

Pages-Projekt „sowespoke" → **Settings → Variables and secrets** → je einen Secret hinzufügen:
- `GOOGLE_CLIENT_ID` — die Client-ID aus Schritt 1
- `GOOGLE_CLIENT_SECRET` — das Client-Secret aus Schritt 1
- `SESSION_SECRET` — ein langer Zufallswert zum Signieren der Login-Session (bereits gesetzt)

Alternativ per CLI:

```
wrangler pages secret put GOOGLE_CLIENT_ID --project-name=sowespoke
wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=sowespoke
```

## 3. Deploy auslösen

Secrets gelten erst ab der **nächsten** Deployment — nach dem Setzen einmal im Dashboard unter **Deployments** die neueste Production-Deployment über „..." → **Retry deployment** anstoßen (oder einen neuen Commit pushen).

## 4. Testen

`sowespoke.pages.dev` in einem privaten Fenster öffnen → sollte auf `/login` umleiten. „Mit Google anmelden" klicken, mit einer `@sowespoke.com`/`@sowespoke.de`-Adresse einloggen. Mit einer fremden Google-Adresse sollte die Anmeldung mit „Zugriff nur mit einem @sowespoke.com- oder @sowespoke.de-Konto" abgelehnt werden.

## Falls die Domain mal wechselt oder eine weitere hinzukommt

`ALLOWED_DOMAINS` in `functions/_lib/auth.js` anpassen und in der Google Cloud Console ggf. eine weitere Redirect-URI hinterlegen, falls die Seite unter einer eigenen Domain statt `sowespoke.pages.dev` läuft.
