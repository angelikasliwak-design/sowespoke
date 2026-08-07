# Login einrichten — Zugriff nur für Firmen-E-Mails

Die Seite ist **nicht mehr** über Cloudflare Access (Zero Trust) abgesperrt, sondern über ein eigenes Login (E-Mail + Passwort), das direkt im Projekt liegt: `functions/_middleware.js`, `functions/api/auth/*`, `login.html`, `register.html`. Registrierung ist nur mit einer `@sowespoke.com`- oder `@sowespoke.de`-E-Mail möglich (siehe `ALLOWED_DOMAINS` in `functions/_lib/auth.js`).

Damit das läuft, braucht das Cloudflare-Pages-Projekt zwei Dinge, die **nicht im Repo** liegen (genau wie die bestehende KV-Bindung `NEWS_RATINGS`): eine D1-Datenbank und ein Secret.

## 1. D1-Datenbank anlegen

Im Cloudflare-Dashboard oder per Wrangler (`wrangler login` einmalig nötig):

```
wrangler d1 create sowespoke-auth
wrangler d1 execute sowespoke-auth --remote --file=schema.sql
```

## 2. D1-Bindung am Pages-Projekt setzen

Pages-Projekt „sowespoke" → **Settings → Functions → D1 database bindings** → Add binding:
- **Variable name:** `DB`
- **D1 database:** `sowespoke-auth`

## 3. Session-Secret setzen

Ein zufälliger, langer String, mit dem Login-Sessions signiert werden. Pages-Projekt → **Settings → Environment variables** → Variable hinzufügen, als **Secret** markieren:
- **Variable name:** `SESSION_SECRET`
- **Wert:** ein langer Zufallswert, z. B. mit `openssl rand -base64 32` erzeugt

Alternativ per CLI:

```
wrangler pages secret put SESSION_SECRET --project-name=sowespoke
```

## 4. Testen

Nach dem nächsten Deploy (Push auf `main`) `sowespoke.pages.dev` in einem privaten Fenster öffnen — es sollte auf `/login.html` umleiten. Mit `register.html` ein Konto mit einer `@sowespoke.com`/`@sowespoke.de`-Adresse anlegen, danach normal einloggen.

## Wichtig — bekannte Einschränkung

Die Registrierung prüft nur, ob die eingegebene E-Mail-Adresse auf eine erlaubte Domain endet — sie verifiziert **nicht**, dass die Person diese Adresse wirklich besitzt (kein Bestätigungslink/-code). Wer die Domain-Regel kennt, könnte sich theoretisch mit einer fremden `@sowespoke.com`-Adresse registrieren, ohne Zugriff auf das echte Postfach zu haben. Für ein rein internes Tool ist das meist ein akzeptables Risiko; falls echte Verifizierung gewünscht ist, braucht es einen E-Mail-Versand (z. B. über einen Dienst wie Resend) für einen Bestätigungslink vor der Kontoaktivierung.
