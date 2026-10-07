"""Übernimmt versendete Newsletter aus .eml-Dateien in newsletters-data.js.

Ablauf: Newsletter in Gmail öffnen → ⋮ → "Nachricht herunterladen" (.eml),
Dateien nach content/newsletter/ legen, dann im Repo-Root ausführen:

    python tools/import-newsletters.py

Was passiert:
- Betreff, Versanddatum, Absender und HTML-Inhalt werden ausgelesen.
- Personalisierte Abmelde-/Profil-Links und Tracking-Pixel werden entfernt,
  damit Kolleg:innen im Intranet nicht versehentlich das Abo der Person
  abmelden, die die Mail heruntergeladen hat.
- Typ (operativ/strategisch) wird aus Betreff und Inhalt geraten und kann
  danach in newsletters-data.js von Hand korrigiert werden.
- Doppelte Mails (gleicher Betreff + gleiches Datum) werden nur einmal
  übernommen. Bestehende Einträge bleiben erhalten (auch die Typ-Korrektur).
Die .eml-Dateien selbst werden NICHT ins Repo übernommen (.gitignore).
"""
import email, email.policy, json, re, html, hashlib, pathlib, sys
from email.utils import parsedate_to_datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "newsletter"
OUT = ROOT / "newsletters-data.js"

def load_existing():
    if not OUT.exists():
        return []
    m = re.search(r"const NEWSLETTERS = (\[.*\]);", OUT.read_text(encoding="utf-8"), re.S)
    return json.loads(m.group(1)) if m else []

def clean_html(h):
    h = re.sub(r"(?is)<script.*?</script>", "", h)
    # Tracking-Pixel (1x1) und unsichtbare Bilder entfernen
    h = re.sub(r'(?is)<img[^>]*(?:width=["\']?1["\']?[^>]*height=["\']?1["\']?|height=["\']?1["\']?[^>]*width=["\']?1["\']?)[^>]*>', "", h)
    # Personalisierte Abmelde-/Profil-Links: Link entfernen, Text behalten
    h = re.sub(r'(?is)<a\b[^>]*href=["\'][^"\']*(?:unsub|optout|opt-out|abmeld|unsubscribe|/ua/|manage[-_]?pref|updateprofile|profile)[^"\']*["\'][^>]*>(.*?)</a>',
               r"\1", h)
    return h

def guess_type(subject, text):
    s = (subject + " " + text[:3000]).lower()
    strat = sum(k in s for k in ["strateg", "geschäftsführ", "management", "trend", "markt", "quartal", "alliance", "coins", "event", "offsite"])
    oper = sum(k in s for k in ["operativ", "update", "beta", "feature", "kampagne", "uet", "tracking", "anleitung", "tipp", "pmax", "performance max", "audience"])
    return "strategisch" if strat > oper else "operativ"

def main():
    files = sorted(SRC.glob("*.eml"))
    if not files:
        print(f"Keine .eml-Dateien in {SRC}")
        return
    items = load_existing()
    known = {i["id"] for i in items}
    added = 0
    for f in files:
        msg = email.message_from_bytes(f.read_bytes(), policy=email.policy.default)
        subject = str(msg.get("subject", "")).strip() or f.stem
        try:
            date = parsedate_to_datetime(msg.get("date")).date().isoformat()
        except Exception:
            date = ""
        sender = re.sub(r"\s*<.*?>", "", str(msg.get("from", ""))).strip().strip('"')
        part = msg.get_body(preferencelist=("html", "plain"))
        body = part.get_content() if part else ""
        if part and part.get_content_type() == "text/plain":
            body = "<pre style='white-space:pre-wrap;font-family:inherit'>" + html.escape(body) + "</pre>"
        body = clean_html(body)
        text = re.sub(r"\s+", " ", html.unescape(re.sub(r"(?s)<style.*?</style>|<[^>]+>", " ", body))).strip()
        nid = hashlib.sha1((subject + date).encode("utf-8")).hexdigest()[:12]
        if nid in known:
            continue
        items.append({"id": nid, "subject": subject, "date": date, "from": sender,
                      "type": guess_type(subject, text), "excerpt": text[:260], "searchText": text[:5000], "html": body})
        known.add(nid); added += 1
    items.sort(key=lambda i: i["date"], reverse=True)
    js = ("/**\n * Bisher versendete Newsletter (Archiv), erzeugt von tools/import-newsletters.py\n"
          " * aus .eml-Dateien in content/newsletter/. Feld \"type\" (operativ/strategisch)\n"
          " * wird geraten und darf hier von Hand korrigiert werden – ein erneuter Import\n"
          " * überschreibt bestehende Einträge nicht.\n */\n"
          "const NEWSLETTERS = " + json.dumps(items, ensure_ascii=False, indent=1) + ";\n")
    OUT.write_text(js, encoding="utf-8", newline="\n")
    print(f"{added} neu übernommen, {len(items)} insgesamt.")

if __name__ == "__main__":
    sys.exit(main())
