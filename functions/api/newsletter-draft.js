/**
 * Cloudflare Pages Function — formuliert die ausgewählten Newsletter-Themen
 * (2026-10-07, Nutzer: "unser Newsletter ist immer auf Deutsch … gleicher
 * Stil, gleiche Informationsrichtung") im Stil der bisherigen Ausgaben von
 * "Neues aus der SWS-Alliance". Nutzt denselben optionalen Gemini-Zugang wie
 * die News-Übersetzung (Secret GEMINI_API_KEY, Modell GEMINI_MODEL).
 *
 * Gesendet werden nur Titel, Kurztext, Quelle und Link der ausgewählten
 * Themen (öffentliche News bzw. Zusammenfassungen unserer Präsentationen),
 * keine Kunden- oder Kontodaten. Ohne Key antwortet die Function mit
 * {error:"no-key"}; das Frontend fällt dann auf den regelbasierten Entwurf
 * zurück.
 */

const STYLE = `Du schreibst Themenblöcke für "Neues aus der SWS-Alliance", den deutschen Newsletter der Sowespoke AG (Microsoft-Advertising-Partner) an ihre Partneragenturen.

Stil der bisherigen Ausgaben:
- Immer Deutsch. Anrede der Agenturen mit "ihr/euch/eure", sachlich, freundlich, knapp, keine Werbesprache, keine Emojis.
- Englische Produkt- und Fachbegriffe bleiben englisch (Performance Max, AI Max for Search, Microsoft Audience Network/MSAN, tROAS, tCPA, Max CPC, Ad Preview Hub, Import Center, Negative Keywords).
- Überschrift = Feature + was passiert, z. B. "AI Max for Search ist jetzt verfügbar", "Max CPC wird für neue Kampagnen eingeschränkt", "Ad Preview Hub jetzt auch für Performance Max verfügbar", "tROAS für Microsoft Audience Network testen", "Neue LinkedIn-Karrierestufen in Microsoft Advertising".
- Absatz 1 (body): was sich ändert bzw. neu ist, mit Datum, Kampagnentypen, Märkten und Bedingungen, soweit im Ausgangstext genannt; ggf. Microsofts Begründung in einem Satz.
- Absatz 2 (forYou): die Perspektive der Kontoentwicklung/Kontoführung: für welche Konten oder Advertiser das interessant ist (z. B. E-Commerce mit Conversion Values, B2B, Konten, die über bestehende Keywords hinaus wachsen wollen) und wie Kampagnen künftig gesteuert werden sollten. Wird im Newsletter mit "Was bedeutet das für euch?" eingeleitet, beginnt also direkt mit der Antwort.
- important (optional): ein Satz mit Einschränkung/Ausnahme, wird mit "Wichtig:" eingeleitet (z. B. bestehende Kampagnen behalten die Einstellung).
- cta (optional): bei Betas, Piloten oder Whitelisting: "Bei Interesse meldet euch gerne mit dem entsprechenden Account bei uns. Wir prüfen gemeinsam, ob der Account geeignet ist, und können anschließend das Whitelisting bei Microsoft anfragen." Sonst leer lassen.
- Insgesamt 70–130 Wörter pro Thema.

Regeln: Nur Fakten aus dem Ausgangstext verwenden, nichts erfinden (keine Daten, Zahlen, Märkte, die nicht dort stehen). Reicht der Ausgangstext nicht, lieber kürzer schreiben. Ist der Ausgangstext englisch, sinngemäß auf Deutsch.

Antworte ausschließlich mit JSON der Form {"items":[{"id":string,"headline":string,"body":string,"forYou":string,"important":string,"cta":string}]}, ein Eintrag je Eingabe-Thema, gleiche Reihenfolge.`;

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env.GEMINI_API_KEY) return json({ error: "no-key" }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Ungültiger Request-Body" }, 400); }
  const items = (Array.isArray(body && body.items) ? body.items : []).slice(0, 8).map((x) => ({
    id: String(x.id || "").slice(0, 300),
    title: String(x.title || "").slice(0, 300),
    text: String(x.text || "").slice(0, 2000),
    source: String(x.source || "").slice(0, 120),
    beta: !!x.beta,
  }));
  if (!items.length) return json({ items: [] });

  try {
    const modelId = env.GEMINI_MODEL || "gemini-2.0-flash";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE}\n\nThemen:\n${JSON.stringify({ items })}` }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
      }),
    });
    if (!res.ok) return json({ error: `KI-Dienst antwortet mit ${res.status}` }, 502);
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return json({ error: "Leere Antwort vom KI-Dienst" }, 502);
    const parsed = JSON.parse(raw);
    const out = (parsed.items || []).map((t) => ({
      id: String(t.id || ""),
      headline: String(t.headline || ""),
      body: String(t.body || ""),
      forYou: String(t.forYou || ""),
      important: String(t.important || ""),
      cta: String(t.cta || ""),
    }));
    return json({ items: out });
  } catch (err) {
    return json({ error: "Antwort des KI-Dienstes nicht lesbar" }, 502);
  }
}
