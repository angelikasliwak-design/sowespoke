/**
 * Empfehlungs-Cockpit (2026-10-14, Stufe 1)
 *
 * Microsoft-Advertising-Empfehlungen aus mehreren Dateien (CSV/Excel) je
 * Konto zu EINER Liste zusammenführen (Schritt 0), Kampagnen-Check
 * (Schritt 1), Regelfilter (Schritt 2) und regelbasierte Bewertung
 * (Schritt 3), dazu Dashboard je Konto mit Abhaken, Agenda und
 * Protokoll-Entwurf (Teile von Schritt 4/5).
 *
 * Datenschutz Stufe 1: Dateien werden NUR im Browser gelesen, nichts geht
 * an einen Server. Kontoprofil, Einstellungen und Abhak-Status liegen im
 * localStorage dieses Browsers. Serverseitige Rechte je Account Manager,
 * MCP-/API-Anbindung, Fathom und Erinnerungen folgen in Stufe 2.
 *
 * Keine KI, keine erfundenen Zahlen: Ist-Werte werden nur aus den
 * importierten Kampagnendaten berechnet; fehlt etwas, steht das in der
 * Begründung und die Empfehlung landet unter "Prüfen".
 */
window.SWS_COCKPIT = (() => {
  "use strict";

  let H = null; // Helfer aus app.js: escapeHtml, formatDate, ICONS
  let view = null;
  let state = { files: [], result: null, konto: null, tab: "umsetzen", demo: false };

  /* ---------------------------------------------------- Speicher (lokal) */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem("sws-cockpit:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("sws-cockpit:" + k, JSON.stringify(v)); } catch { /* privat/gesperrt */ } },
  };
  const DEFAULT_SETTINGS = { budgetLossPct: 10, rejectDays: 90, newDays: 14 };
  const settings = () => ({ ...DEFAULT_SETTINGS, ...LS.get("settings", {}) });
  const profileOf = (konto) => ({ ziel: "", zielwert: "", monatsbudget: "", keinBroad: false, keineBudgeterhoehung: false, keineAutoAssets: false, verboten: "", saison: "", letztePruefung: "", notizen: "", naechsterCall: "", ...LS.get("profil:" + konto, {}) });
  const statusOf = (konto) => LS.get("status:" + konto, {});

  /* ------------------------------------------------- Spalten erkennen */
  // Spaltennamen aus deutschen und englischen Microsoft-Exporten (Web-
  // Oberfläche, Editor, Berichte). Vergleich nach norm(): klein, ohne
  // Leer- und Sonderzeichen.
  const COLS = {
    konto: ["konto", "kontoname", "account", "accountname", "kontonummer", "accountnumber", "kunde"],
    kampagne: ["kampagne", "kampagnenname", "campaign", "campaignname"],
    anzeigengruppe: ["anzeigengruppe", "anzeigengruppenname", "adgroup", "adgroupname"],
    typ: ["empfehlungstyp", "typ", "recommendationtype", "type", "kategorie", "category", "empfehlungsart"],
    vorschlag: ["empfehlung", "vorschlag", "recommendation", "description", "beschreibung", "details", "empfehlungsdetails", "recommendationdetails"],
    effekt: ["geschätzteauswirkung", "geschaetzteauswirkung", "auswirkung", "estimatedimpact", "impact", "erwarteteeffekt", "erwarteterEffekt".toLowerCase(), "potenzial", "estimatedimprovement", "geschätzteverbesserung"],
    keyword: ["keyword", "schlüsselwort", "schluesselwort", "suggestedkeyword", "vorgeschlageneskeyword", "suchbegriff"],
    matchtyp: ["übereinstimmungstyp", "uebereinstimmungstyp", "matchtype", "keywordmatchtype", "keywordoption", "übereinstimmungsoption"],
    // Kampagnenbericht
    status: ["status", "kampagnenstatus", "campaignstatus"],
    strategie: ["gebotsstrategie", "gebotsstrategietyp", "bidstrategy", "bidstrategytype", "bidstrategyname"],
    zielCpa: ["zielcpa", "ziel-cpa".replace("-", ""), "targetcpa", "tcpa"],
    zielRoas: ["zielroas", "targetroas", "troas"],
    kosten: ["kosten", "ausgaben", "spend", "cost", "spent"],
    conversions: ["conversions", "konversionen", "conv", "alleconversions", "allconversions"],
    umsatz: ["umsatz", "conversionwert", "einnahmen", "revenue", "conversionvalue", "allrevenue", "alleconversionwerte"],
    verlustBudget: ["anteilverlorenerimpressionenbudget", "verloreneimpressionenbudget", "imprsharelostbudget", "impressionsharelosttobudget", "lostisbudget", "verlorenerimpressionsanteilbudget", "anteilverlorenerimpressionenwegenbudget", "impressionsharelostbudget"],
    startdatum: ["startdatum", "startdate", "kampagnenstart", "erstellt", "created"],
  };
  const norm = (s) => String(s || "").toLowerCase().replace(/[\s_\-.()%/:|]+/g, "").replace(/€/g, "");
  const COL_LOOKUP = new Map();
  Object.entries(COLS).forEach(([k, list]) => list.forEach((n) => COL_LOOKUP.set(norm(n), k)));

  function mapHeader(row) {
    const map = {};
    row.forEach((h, i) => {
      const k = COL_LOOKUP.get(norm(h));
      if (k && map[k] === undefined) map[k] = i;
    });
    return map;
  }

  /* --------------------------------------------------- Dateien lesen */
  function parseCsv(text) {
    text = text.replace(/^﻿/, "");
    const sample = text.split(/\r?\n/).slice(0, 20).join("\n");
    const delim = [";", ",", "\t"].map((d) => [d, sample.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === delim) { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += c;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => String(x).trim() !== ""));
  }

  let xlsxLoading = null;
  function loadXlsx() {
    if (window.XLSX) return Promise.resolve();
    if (!xlsxLoading) xlsxLoading = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "assets/vendor/xlsx.full.min.js"; s.onload = res; s.onerror = () => rej(new Error("Excel-Leser konnte nicht geladen werden"));
      document.head.appendChild(s);
    });
    return xlsxLoading;
  }

  // Liefert je Datei eine oder mehrere Tabellen (Excel: je Blatt eine).
  async function readFile(name, data) {
    if (/\.(xlsx|xlsm|xls)$/i.test(name)) {
      await loadXlsx();
      const wb = window.XLSX.read(data, { type: "array" });
      return wb.SheetNames.map((sn) => ({ sheet: sn, rows: window.XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1, raw: false, defval: "" }) }));
    }
    const text = typeof data === "string" ? data : new TextDecoder("utf-8").decode(data);
    return [{ sheet: "", rows: parseCsv(text) }];
  }

  // Kopfzeile suchen: Microsoft-Exporte haben oft Titel-/Zeitraum-Zeilen
  // davor. Genommen wird die Zeile mit den meisten erkannten Spalten.
  function findHeader(rows) {
    let best = { idx: -1, map: {}, n: 0 };
    rows.slice(0, 20).forEach((r, idx) => {
      const map = mapHeader(r); const n = Object.keys(map).length;
      if (n > best.n) best = { idx, map, n };
    });
    return best.n >= 2 ? best : null;
  }

  /* ----------------------------------------------------------- Zahlen */
  function num(v) {
    if (v === undefined || v === null) return null;
    let s = String(v).replace(/[€$\s %]|EUR|CHF/gi, "");
    if (s === "" || s === "-" || s === "--") return null;
    const hasC = s.includes(","), hasD = s.includes(".");
    if (hasC && hasD) s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
    else if (hasC) s = /^-?\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
    else if (hasD && /^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  // Prozentwerte: "18,5 %" → 18.5, "0,185" → 18.5
  function pct(v) {
    const n = num(v); if (n === null) return null;
    return /%/.test(String(v)) || n > 1 ? n : n * 100;
  }
  const fmt = (n, d = 0) => n === null || n === undefined ? "–" : n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
  const eur = (n) => n === null ? "–" : fmt(n, n < 100 ? 2 : 0) + " €";

  /* ------------------------------------------- Empfehlungs-Kategorien */
  const CATS = [
    { key: "tracking", label: "Conversion-Tracking", re: /conversion.?tracking|uet|zielvorhaben|conversion.?goal|conversion-ziel|tag/i },
    { key: "negativ", label: "Negative Keywords", re: /negativ|negative|ausschluss/i },
    { key: "broad", label: "Broad Match", re: /broad|weitgehend|weit passend|weitgehende übereinstimmung/i },
    { key: "budget", label: "Budget", re: /budget/i },
    { key: "gebot", label: "Gebotsstrategie", re: /gebot|bid|cpa|roas|maximi[sz]e|maximier|smart bidding/i },
    { key: "keyword", label: "Neue Keywords", re: /keyword|schlüsselwort|schluesselwort|suchbegriff/i },
    { key: "anzeige", label: "Anzeigen & Assets", re: /anzeige|\bads?\b|rsa|responsive|asset|erweiterung|extension|sitelink|callout|bild|image|headline|titel/i },
    { key: "zielgruppe", label: "Zielgruppen", re: /zielgruppe|audience|in-market|remarketing/i },
  ];
  const CAT = Object.fromEntries(CATS.map((c) => [c.key, c]));
  function categorize(r) {
    if (r.matchtyp && /broad|weitgehend/i.test(r.matchtyp)) return "broad";
    const t = `${r.typ} ${r.vorschlag}`;
    const hit = CATS.find((c) => c.re.test(r.typ || "")) || CATS.find((c) => c.re.test(t));
    if (!hit && r.keyword) return "keyword";
    return hit ? hit.key : "sonst";
  }
  const catLabel = (k) => (CAT[k] ? CAT[k].label : "Sonstiges");

  /* ---------------------------------------------- Schritt 0: Zusammenführen */
  const low = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
  const noNums = (s) => low(s).replace(/[\d.,]+\s*(€|%|eur)?/g, "#");

  async function importFiles(inputs) {
    const recs = []; const camps = []; const fileInfo = [];
    for (const f of inputs) {
      let tables;
      try { tables = await readFile(f.name, f.data); }
      catch (e) { fileInfo.push({ name: f.name, kind: "Fehler", rows: 0, note: e.message }); continue; }
      let used = false;
      for (const t of tables) {
        const hd = findHeader(t.rows);
        if (!hd) continue;
        const m = hd.map; const src = f.name + (t.sheet && tables.length > 1 ? ` (${t.sheet})` : "");
        const body = t.rows.slice(hd.idx + 1).filter((r) => r.some((x) => String(x).trim()));
        const get = (r, k) => (m[k] !== undefined ? String(r[m[k]] ?? "").trim() : "");
        const isRec = m.vorschlag !== undefined || m.typ !== undefined || m.keyword !== undefined;
        const isCamp = !isRec && (m.strategie !== undefined || m.verlustBudget !== undefined || m.kosten !== undefined);
        if (!isRec && !isCamp) continue;
        used = true;
        body.forEach((r) => {
          if (isRec) {
            const rec = { konto: get(r, "konto"), kampagne: get(r, "kampagne"), anzeigengruppe: get(r, "anzeigengruppe"), typ: get(r, "typ"), vorschlag: get(r, "vorschlag"), effekt: get(r, "effekt"), keyword: get(r, "keyword"), matchtyp: get(r, "matchtyp"), quelle: src };
            if (!rec.vorschlag && rec.keyword) rec.vorschlag = `Keyword „${rec.keyword}“ hinzufügen${rec.matchtyp ? ` (${rec.matchtyp})` : ""}`;
            if (!rec.typ && rec.keyword) rec.typ = "Neues Keyword";
            if (!rec.konto) rec.konto = "Ohne Kontoangabe";
            rec.cat = categorize(rec);
            recs.push(rec);
          } else {
            camps.push({ konto: get(r, "konto") || "Ohne Kontoangabe", kampagne: get(r, "kampagne"), status: get(r, "status"), strategie: get(r, "strategie"), zielCpa: num(get(r, "zielCpa")), zielRoas: num(get(r, "zielRoas")), kosten: num(get(r, "kosten")), conversions: num(get(r, "conversions")), umsatz: num(get(r, "umsatz")), verlustBudget: pct(get(r, "verlustBudget")), startdatum: get(r, "startdatum"), quelle: src });
          }
        });
        fileInfo.push({ name: src, kind: isRec ? "Empfehlungen" : "Kampagnendaten", rows: body.length, cols: Object.keys(m).length });
      }
      if (!used) fileInfo.push({ name: f.name, kind: "Nicht erkannt", rows: 0, note: "Keine bekannten Spalten gefunden" });
    }

    // 1) exakte Duplikate (alle Inhaltsfelder gleich, Quelle egal)
    const exact = new Map();
    recs.forEach((r) => {
      const k = [r.konto, r.kampagne, r.anzeigengruppe, r.typ, r.vorschlag, r.keyword, r.matchtyp].map(low).join("|");
      if (exact.has(k)) { const e = exact.get(k); e.rows++; e.quellen.add(r.quelle); }
      else exact.set(k, { ...r, rows: 1, quellen: new Set([r.quelle]) });
    });
    // 2) ähnliche: gleiches Konto, gleicher Ort, gleiche Art Vorschlag –
    //    z. B. dieselbe Budget-Empfehlung einmal deutsch, einmal englisch,
    //    oder mit anderem Betrag aus einem späteren Export.
    const sim = new Map();
    exact.forEach((r) => {
      const where = [r.konto, r.kampagne, r.anzeigengruppe].map(low).join("|");
      const what = r.keyword ? low(r.keyword) + "|" + low(r.matchtyp) : ["budget", "gebot", "broad", "tracking"].includes(r.cat) ? "" : noNums(r.vorschlag);
      const k = `${where}|${r.cat}|${what}`;
      if (sim.has(k)) { const s = sim.get(k); s.rows += r.rows; r.quellen.forEach((q) => s.quellen.add(q)); s.varianten.push(r); }
      else sim.set(k, { ...r, simKey: k, quellen: new Set(r.quellen), varianten: [r] });
    });

    const kampMap = new Map();
    camps.forEach((c) => { const k = low(c.konto) + "|" + low(c.kampagne); kampMap.set(k, { ...(kampMap.get(k) || {}), ...Object.fromEntries(Object.entries(c).filter(([, v]) => v !== null && v !== "")) }); });

    return { fileInfo, rowsTotal: recs.length, exactUnique: exact.size, singles: [...sim.values()], kampagnen: [...kampMap.values()] };
  }

  /* ------------------------------------------- Schritt 1: Kampagnen-Check */
  const SMART_RE = /cpa|roas|conversion|maximi[sz]e conv|conversions maximieren|conversionwert/i;
  function checkCampaign(c, st) {
    const out = { ...c, ziel: null, zielwert: null, ist: null, erreicht: null, begrenzt: null, klasse: "", hinweis: "", fehlt: [] };
    if (c.zielCpa) { out.ziel = "CPA"; out.zielwert = c.zielCpa; }
    else if (c.zielRoas) { out.ziel = "ROAS"; out.zielwert = c.zielRoas > 20 ? c.zielRoas / 100 : c.zielRoas; }
    if (out.ziel === "CPA") {
      if (c.kosten != null && c.conversions) out.ist = c.kosten / c.conversions;
      else out.fehlt.push(c.conversions === 0 ? "keine Conversions in 30 Tagen" : "Kosten/Conversions");
      if (out.ist != null) out.erreicht = out.ist <= out.zielwert;
    } else if (out.ziel === "ROAS") {
      if (c.kosten && c.umsatz != null) out.ist = c.umsatz / c.kosten;
      else out.fehlt.push("Kosten/Umsatz");
      if (out.ist != null) out.erreicht = out.ist >= out.zielwert;
    }
    if (c.verlustBudget != null) out.begrenzt = c.verlustBudget > st.budgetLossPct;
    else out.fehlt.push("Anteil verlorener Impressionen (Budget)");
    out.pausiert = /pausiert|paused|angehalten/i.test(c.status || "");
    out.lernphase = /lern|learning/i.test(c.status || "");
    const start = c.startdatum ? parseDate(c.startdatum) : null;
    out.neu = !!(start && (Date.now() - start) / 86400000 < st.newDays);
    out.tracking = c.conversions == null ? null : c.conversions > 0;
    out.smart = c.strategie ? SMART_RE.test(c.strategie) : null;

    if (out.pausiert) { out.klasse = "pausiert"; out.hinweis = "Kampagne pausiert"; }
    else if (!out.ziel) { out.klasse = "kein-ziel"; out.hinweis = "Kein Ziel eingestellt – mit der Agentur Ziel-CPA oder Ziel-ROAS festlegen."; }
    else if (out.erreicht === null || out.begrenzt === null) { out.klasse = "daten"; out.hinweis = "Daten fehlen: " + out.fehlt.join(", "); }
    else if (out.erreicht && out.begrenzt) { out.klasse = "chance"; out.hinweis = "Budget-Chance: Ziel erreicht und durch Budget begrenzt – Budgeterhöhung empfehlen."; }
    else if (out.erreicht) { out.klasse = "ok"; out.hinweis = "Ziel erreicht, nicht budgetbegrenzt – nichts tun."; }
    else if (out.begrenzt) { out.klasse = "effizienz"; out.hinweis = "Ziel nicht erreicht, aber budgetbegrenzt – kein zusätzliches Budget, zuerst Effizienz verbessern."; }
    else { out.klasse = "verfehlt"; out.hinweis = "Ziel nicht erreicht – Effizienz verbessern."; }
    return out;
  }
  function parseDate(s) {
    let m = String(s).match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
    if (m) return new Date(+(m[3].length === 2 ? "20" + m[3] : m[3]), m[2] - 1, +m[1]).getTime();
    m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], m[2] - 1, +m[3]).getTime();
    m = String(s).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], m[1] - 1, +m[2]).getTime();
    return null;
  }
  const istText = (c) => c.ziel === "CPA" ? `CPA ${eur(c.ist)} bei Ziel ${eur(c.zielwert)}` : c.ziel === "ROAS" ? `ROAS ${fmt(c.ist * 100)} % bei Ziel ${fmt(c.zielwert * 100)} %` : "";

  /* ------------------------------- Schritt 2 + 3: Filter und Bewertung */
  function evaluate(s, camp, prof, stat, st) {
    const name = s.kampagne || "das Konto";
    const ev = (urteil, prio, grund) => ({ urteil, prio, grund });
    const aus = (grund) => ({ urteil: "aussortiert", prio: "", grund });
    // Schritt 2 – Regelfilter
    if (stat && stat.status === "abgelehnt" && stat.datum && (Date.now() - new Date(stat.datum)) / 86400000 <= st.rejectDays)
      return aus(`Am ${new Date(stat.datum).toLocaleDateString("de-DE")} abgelehnt${stat.grund ? ` („${stat.grund}“)` : ""} – innerhalb von ${st.rejectDays} Tagen nicht erneut vorschlagen.`);
    if (camp && camp.pausiert) return aus(`${name} ist pausiert.`);
    if (camp && camp.neu) return aus(`${name} läuft seit weniger als ${st.newDays} Tagen – erst Daten sammeln.`);
    if (camp && camp.lernphase) return aus(`${name} ist noch in der Lernphase.`);
    if (s.cat === "broad" && prof.keinBroad) return aus("Kundenvorgabe: kein Broad Match.");
    if (s.cat === "budget" && prof.keineBudgeterhoehung) return aus("Kundenvorgabe: keine Budgeterhöhung.");
    if (s.cat === "anzeige" && prof.keineAutoAssets && /automat|auto-generated|automatically/i.test(s.vorschlag + " " + s.typ)) return aus("Kundenvorgabe: keine automatisch erstellten Assets.");
    const verboten = String(prof.verboten || "").split(/\n|;/).map((x) => x.trim()).filter(Boolean)
      .find((w) => low(`${s.vorschlag} ${s.keyword} ${s.typ}`).includes(low(w)));
    if (verboten) return aus(`Kundenvorgabe: „${verboten}“ ist ausgeschlossen.`);

    const fehlt = (was) => ev("prüfen", "mittel", `Daten fehlen (${was}) – vor dem Call prüfen.`);
    switch (s.cat) {
      case "budget":
        if (!camp) return fehlt(`Kampagnendaten zu ${name}`);
        if (!camp.ziel) return aus(`${name} hat kein Ziel – erst Ziel festlegen, dann über Budget sprechen.`);
        if (camp.erreicht === null || camp.begrenzt === null) return fehlt(camp.fehlt.join(", "));
        if (!camp.erreicht) return aus(`${name} verfehlt das Ziel (${istText(camp)}) – zuerst Effizienz verbessern, kein zusätzliches Budget.`);
        if (!camp.begrenzt) return aus(`${name} verliert nur ${fmt(camp.verlustBudget, 1)} % der Impressionen wegen Budget – Budget ist nicht der Engpass.`);
        return ev("umsetzen", "hoch", `${name} erreicht das Ziel (${istText(camp)}) und verliert ${fmt(camp.verlustBudget, 1)} % der Impressionen wegen Budget – mehr Budget bringt zusätzliche Conversions im Zielbereich.`);
      case "broad":
        if (!camp || camp.tracking === null || camp.smart === null) return fehlt("Conversion-Tracking bzw. Gebotsstrategie");
        if (!camp.tracking || !camp.smart) return aus(`Broad Match nur mit funktionierendem Conversion-Tracking und Smart Bidding – ${name} hat ${!camp.tracking ? "keine Conversions in 30 Tagen" : `„${camp.strategie}“ als Gebotsstrategie`}.`);
        return ev("prüfen", "mittel", `${name} misst Conversions und bietet mit „${camp.strategie}“ – Broad Match kann zusätzliche Suchanfragen erschließen; Suchbegriffe danach eng beobachten.`);
      case "gebot":
        if (camp && camp.tracking === false) return aus(`${name} hat keine Conversions in 30 Tagen – Smart Bidding hätte keine Daten zum Lernen.`);
        if (camp && !camp.ziel) return ev("prüfen", "hoch", `${name} hat noch kein Ziel – mit der Agentur Ziel-CPA oder Ziel-ROAS festlegen und dabei den Strategiewechsel besprechen.`);
        if (!camp) return fehlt(`Kampagnendaten zu ${name}`);
        return ev("prüfen", "mittel", `Strategiewechsel für ${name} besprechen – nach dem Umstellen Lernphase einplanen und Zielwert festhalten.`);
      case "tracking":
        return ev("umsetzen", "hoch", "Ohne sauberes Conversion-Tracking greifen weder Gebotsstrategien noch unsere Bewertung – zuerst beheben.");
      case "negativ":
        return ev("umsetzen", "mittel", "Negative Keywords reduzieren Streuverluste – Liste vor dem Einbuchen kurz auf Begriffe prüfen, die doch relevant sind.");
      case "keyword":
        return ev("prüfen", "mittel", "Neue Keywords zu bestehenden Themen – Relevanz für das Angebot prüfen, dann mit passender Match-Option einbuchen.");
      case "anzeige":
        return ev("prüfen", "niedrig", "Zusätzliche Anzeigentexte/Assets erhöhen die Abdeckung – Texte gegen Marke und Kundenvorgaben prüfen.");
      case "zielgruppe":
        return ev("prüfen", "mittel", "Zielgruppen-Vorschlag – passt er zu Zielkunden und Saison des Kontos? Erst als Beobachtung hinzufügen.");
      default:
        return ev("prüfen", "niedrig", "Typ nicht automatisch eingeordnet – kurz manuell prüfen.");
    }
  }

  /* ------------------------------------------------ alles berechnen */
  function analyse(imp) {
    const st = settings();
    const konten = new Map();
    const kontoOf = (name) => {
      if (!konten.has(name)) konten.set(name, { name, kampagnen: [], items: [] });
      return konten.get(name);
    };
    imp.kampagnen.forEach((c) => kontoOf(c.konto).kampagnen.push(checkCampaign(c, st)));
    imp.singles.forEach((s) => kontoOf(s.konto));
    konten.forEach((k) => {
      const prof = profileOf(k.name); const stats = statusOf(k.name);
      const singles = imp.singles.filter((s) => s.konto === k.name).map((s) => {
        const camp = k.kampagnen.find((c) => low(c.kampagne) === low(s.kampagne));
        return { ...s, ...evaluate(s, camp, prof, stats[s.simKey], st), status: stats[s.simKey] || null };
      });
      // Bündeln: gleiche Art Vorschlag mit gleichem Urteil und Grund-Typ.
      // Keyword-Vorschläge je Kampagne, Kampagnen-Vorschläge über alle
      // Kampagnen, sofern die Begründung gleich lautet (z. B. 3 Budget-
      // Empfehlungen, die alle wegen fehlender Zielerreichung rausfallen).
      const groups = new Map();
      singles.forEach((s) => {
        const perCamp = ["keyword", "broad", "negativ", "anzeige"].includes(s.cat);
        const gk = [s.cat, s.urteil, perCamp ? low(s.kampagne) : "", ["budget", "gebot"].includes(s.cat) ? "" : s.grund].join("|");
        if (!groups.has(gk)) groups.set(gk, []);
        groups.get(gk).push(s);
      });
      k.items = [...groups.values()].map((list) => {
        const f = list[0];
        const quellen = new Set(); let rows = 0;
        list.forEach((s) => { s.quellen.forEach((q) => quellen.add(q)); rows += s.rows; });
        const kamps = [...new Set(list.map((s) => s.kampagne).filter(Boolean))];
        const prioRank = { hoch: 0, mittel: 1, niedrig: 2, "": 3 };
        const prio = list.map((s) => s.prio).sort((a, b) => prioRank[a] - prioRank[b])[0];
        const titel = list.length === 1 ? f.vorschlag || catLabel(f.cat)
          : `${catLabel(f.cat)}: ${list.length} Vorschläge${kamps.length > 1 ? ` in ${kamps.length} Kampagnen` : kamps.length ? ` · ${kamps[0]}` : ""}`;
        const grund = list.length > 1 && new Set(list.map((s) => s.grund)).size > 1 ? "Je Kampagne unterschiedlich – siehe Einzelpunkte." : f.grund;
        const effekte = [...new Set(list.map((s) => s.effekt).filter(Boolean))];
        const allStat = list.map((s) => s.status && s.status.status);
        return { id: f.simKey, cat: f.cat, urteil: f.urteil, prio, titel, grund, kampagnen: kamps, singles: list, quellen: [...quellen], rows, effekt: effekte.length === 1 ? effekte[0] : effekte.length ? `${effekte.length} Angaben, siehe Einzelpunkte` : "", erledigt: allStat.every((x) => x === "umgesetzt" || x === "abgelehnt"), besprochen: allStat.every((x) => x) };
      }).sort((a, b) => ({ hoch: 0, mittel: 1, niedrig: 2, "": 3 })[a.prio] - ({ hoch: 0, mittel: 1, niedrig: 2, "": 3 })[b.prio]);
      k.profil = prof;
    });
    const bundled = [...konten.values()].reduce((n, k) => n + k.items.length, 0);
    return { ...imp, konten: [...konten.values()].sort((a, b) => a.name.localeCompare(b.name)), summary: { dateien: imp.fileInfo.length, zeilen: imp.rowsTotal, exakt: imp.rowsTotal - imp.exactUnique, aehnlich: imp.exactUnique - imp.singles.length, gebuendelt: imp.singles.length - bundled, empfehlungen: bundled } };
  }

  /* ------------------------------------------------------------ Demo */
  // 5 Beispieldateien mit erfundenen Demo-Konten (keine echten Kunden):
  // zwei Empfehlungs-Exporte (DE/EN) mit Überschneidungen, ein erneuter
  // Export mit exakten Duplikaten, eine Excel-Datei mit Keyword-Vorschlägen
  // und ein Kampagnenbericht für den Kampagnen-Check.
  function demoFiles() {
    const today = new Date();
    const daysAgo = (n) => { const d = new Date(today - n * 86400000); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`; };
    const G = "Demo Gartenwelt GmbH", S = "Demo Sportshop";
    const f1 = [
      "Empfehlungen – Microsoft Advertising", "Zeitraum: letzte 30 Tage", "",
      "Konto;Kampagne;Anzeigengruppe;Empfehlungstyp;Empfehlung;Geschätzte Auswirkung",
      `${G};Search | Gartenmöbel;;Budget;Tagesbudget von 80 € auf 120 € erhöhen;+410 Klicks pro Woche`,
      `${G};Search | Pflanzen;;Budget;Tagesbudget von 60 € auf 90 € erhöhen;+260 Klicks pro Woche`,
      `${G};Shopping | Grills;;Budget;Tagesbudget von 50 € auf 70 € erhöhen;+90 Klicks pro Woche`,
      `${G};Search | Gartenmöbel;Lounge;Negative Keywords;Negatives Keyword „gebraucht“ hinzufügen;`,
      `${G};Search | Gartenmöbel;Lounge;Negative Keywords;Negatives Keyword „ikea“ hinzufügen;`,
      `${G};Search | Gartenmöbel;Lounge;Negative Keywords;Negatives Keyword „selber bauen“ hinzufügen;`,
      `${G};Search | Pflanzen;Zimmerpflanzen;Weitgehend passende Keywords;Keywords auf weitgehende Übereinstimmung umstellen;+18 % Impressionen`,
      `${G};Search | Marke;;Gebotsstrategie;Auf „Conversions maximieren“ umstellen;+12 % Conversions`,
      `${G};Search | Marke;Marke allgemein;Responsive Suchanzeige;Zwei weitere Anzeigentitel ergänzen;+4 % Klicks`,
      `${G};Audience | Herbst;;Zielgruppe;In-Market-Zielgruppe „Haus & Garten“ hinzufügen;+1.200 Impressionen pro Woche`,
    ].join("\r\n");
    const f2 = [
      "Account name,Campaign,Ad group,Recommendation type,Recommendation,Estimated impact",
      `${G},Search | Gartenmöbel,,Budget,Raise daily budget from €80 to €125,+430 clicks per week`,
      `${S},Search | Laufschuhe,,Budget,Raise daily budget from €100 to €140,+300 clicks per week`,
      `${S},Search | Laufschuhe,,Budget,Raise daily budget from €100 to €140,+300 clicks per week`,
      `${S},Search | Winterjacken,,Budget,Raise daily budget from €40 to €70,+150 clicks per week`,
      `${S},Search | Fahrräder,,Bid strategy,Switch to Maximize conversions,+20% conversions`,
      `${S},Search | Fahrräder,,Conversion tracking,"UET tag: no conversions recorded for goal ""Kauf"" in 30 days",`,
      `${S},Search | Laufschuhe,Trail,Sitelink extensions,Add 4 sitelink extensions,+3% clicks`,
      `${S},Search | Laufschuhe,Trail,Sitelink extensions,Add 4 sitelink extensions,+3% clicks`,
    ].join("\r\n");
    const f3rows = [
      ["Account", "Campaign", "Ad group", "Keyword", "Match type", "Estimated impact"],
      [G, "Search | Gartenmöbel", "Lounge", "lounge set outdoor", "Phrase", "+40 clicks/week"],
      [G, "Search | Gartenmöbel", "Lounge", "gartenlounge wetterfest", "Phrase", "+25 clicks/week"],
      [G, "Search | Gartenmöbel", "Lounge", "loungemöbel balkon", "Phrase", "+18 clicks/week"],
      [G, "Search | Gartenmöbel", "Tische", "gartentisch ausziehbar", "Exact", "+30 clicks/week"],
      [G, "Search | Gartenmöbel", "Tische", "gartentisch holz", "Exact", "+22 clicks/week"],
      [G, "Search | Pflanzen", "Zimmerpflanzen", "monstera kaufen", "Broad", "+60 clicks/week"],
      [G, "Search | Pflanzen", "Zimmerpflanzen", "zimmerpflanzen online", "Broad", "+45 clicks/week"],
      [S, "Search | Laufschuhe", "Trail", "trailschuhe damen", "Phrase", "+35 clicks/week"],
      [S, "Search | Laufschuhe", "Trail", "trailschuhe damen", "Phrase", "+35 clicks/week"],
      [S, "Search | Laufschuhe", "Straße", "laufschuhe dämpfung", "Phrase", "+28 clicks/week"],
      [S, "Search | Fahrräder", "E-Bikes", "e-bike günstig", "Broad", "+80 clicks/week"],
    ];
    const f4 = [
      "Konto;Kampagne;Anzeigengruppe;Empfehlungstyp;Empfehlung;Geschätzte Auswirkung",
      `${G};Search | Gartenmöbel;;Budget;Tagesbudget von 80 € auf 120 € erhöhen;+410 Klicks pro Woche`,
      `${G};Search | Gartenmöbel;Lounge;Negative Keywords;Negatives Keyword „gebraucht“ hinzufügen;`,
      `${G};Search | Gartenmöbel;Lounge;Negative Keywords;Negatives Keyword „ikea“ hinzufügen;`,
      `${G};Search | Marke;;Gebotsstrategie;Auf „Conversions maximieren“ umstellen;+12 % Conversions`,
      `${G};Search | Gartenmöbel;Tische;Negative Keywords;Negatives Keyword „reparatur“ hinzufügen;`,
    ].join("\r\n");
    const f5 = [
      "Kampagnenbericht;letzte 30 Tage", "",
      "Konto;Kampagne;Status;Gebotsstrategie;Ziel-CPA;Ziel-ROAS;Kosten;Conversions;Umsatz;Anteil verlorener Impressionen (Budget);Startdatum",
      `${G};Search | Gartenmöbel;Aktiv;Ziel-CPA;30,00 €;;2.400,00 €;100;;18,2 %;${daysAgo(400)}`,
      `${G};Search | Pflanzen;Aktiv;Ziel-CPA;25,00 €;;1.800,00 €;50;;22,0 %;${daysAgo(300)}`,
      `${G};Shopping | Grills;Aktiv;Ziel-ROAS;;400 %;1.500,00 €;75;9.000,00 €;4,1 %;${daysAgo(200)}`,
      `${G};Search | Marke;Aktiv;Erweiterte CPC;;;300,00 €;40;;0,0 %;${daysAgo(500)}`,
      `${G};Audience | Herbst;Pausiert;Conversions maximieren;;;0,00 €;0;;;${daysAgo(60)}`,
      `${S};Search | Laufschuhe;Aktiv;Ziel-CPA;40,00 €;;2.000,00 €;60;;12,4 %;${daysAgo(250)}`,
      `${S};Search | Winterjacken;Aktiv;Ziel-CPA;35,00 €;;120,00 €;2;;30,5 %;${daysAgo(5)}`,
      `${S};Search | Fahrräder;Aktiv;Manueller CPC;;;600,00 €;0;;8,0 %;${daysAgo(180)}`,
    ].join("\r\n");
    return { files: [
      { name: "Empfehlungen_Gartenwelt_Oktober.csv", data: f1 },
      { name: "Recommendations_All_Accounts.csv", data: f2 },
      { name: "Keyword_Opportunities.xlsx", rows: f3rows },
      { name: "Empfehlungen_Gartenwelt_Oktober (1).csv", data: f4 },
      { name: "Kampagnenbericht_30_Tage.csv", data: f5 },
    ] };
  }

  async function loadDemo() {
    await loadXlsx();
    const d = demoFiles();
    const files = d.files.map((f) => {
      if (!f.rows) return f;
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, window.XLSX.utils.aoa_to_sheet(f.rows), "Keywords");
      return { name: f.name, data: new Uint8Array(window.XLSX.write(wb, { type: "array", bookType: "xlsx" })) };
    });
    // Demo-Kontoprofile (Ziel, nächster Call, eine Kundenvorgabe, damit der
    // Regelfilter sichtbar wird) – nur beim ersten Laden, danach gilt, was
    // im Profil geändert wurde.
    const inDays = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
    const demoProfiles = {
      "Demo Gartenwelt GmbH": { ziel: "CPA", zielwert: "30 €", monatsbudget: "8.000 €", naechsterCall: inDays(6), saison: "Hauptsaison März–Juli", notizen: "Demo: Fokus Gartenmöbel, Marke soll ein Ziel bekommen." },
      "Demo Sportshop": { ziel: "CPA", zielwert: "40 €", monatsbudget: "4.000 €", naechsterCall: inDays(2), keinBroad: true, notizen: "Demo: Kunde möchte kein Broad Match." },
    };
    Object.entries(demoProfiles).forEach(([k, p]) => { if (!LS.get("profil:" + k, null)) LS.set("profil:" + k, { ...profileOf(k), ...p }); });
    return files;
  }

  /* ----------------------------------------------------------- Oberfläche */
  const esc = (s) => H.escapeHtml(String(s ?? ""));
  const URTEIL = { umsetzen: "Umsetzen", "prüfen": "Prüfen", aussortiert: "Aussortiert" };
  const KLASSE = { chance: ["Budget-Chance", "good"], ok: ["Im Ziel", "ok"], effizienz: ["Effizienz zuerst", "warn"], verfehlt: ["Ziel verfehlt", "warn"], "kein-ziel": ["Kein Ziel", "info"], daten: ["Daten fehlen", "info"], pausiert: ["Pausiert", "muted"] };

  function render(v, helpers, params) {
    H = helpers; view = v;
    const k = params.get("konto");
    if (state.result && k) { state.konto = k; renderKonto(); return; }
    state.konto = null;
    renderStart();
  }

  function shell(inner) {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Empfehlungs-Cockpit</h1>
          <p>Microsoft-Empfehlungen je Konto zusammenführen, gegen Kampagnenziele prüfen und für den Monthly Call sortieren: Umsetzen, Prüfen, Aussortiert.</p>
        </div>
      </section>${inner}`;
  }

  function summaryHtml(r) {
    const s = r.summary;
    return `
      <div class="ck-summary" aria-label="Zusammenfassung des Imports">
        <div class="ck-flow">
          <div class="ck-flow__step"><strong>${s.dateien}</strong><span>Dateien</span></div><span class="ck-flow__arrow">→</span>
          <div class="ck-flow__step"><strong>${s.zeilen}</strong><span>Zeilen</span></div><span class="ck-flow__arrow">→</span>
          <div class="ck-flow__step ck-flow__step--minus"><strong>−${s.exakt}</strong><span>exakt doppelt</span></div>
          <div class="ck-flow__step ck-flow__step--minus"><strong>−${s.aehnlich}</strong><span>ähnlich zusammengeführt</span></div>
          <div class="ck-flow__step ck-flow__step--minus"><strong>−${s.gebuendelt}</strong><span>in Themen gebündelt</span></div><span class="ck-flow__arrow">→</span>
          <div class="ck-flow__step ck-flow__step--result"><strong>${s.empfehlungen}</strong><span>Empfehlungen</span></div>
        </div>
        <details class="ck-files">
          <summary>Eingelesene Dateien</summary>
          <ul>${r.fileInfo.map((f) => `<li><span class="ck-src">${esc(f.name)}</span> ${esc(f.kind)} · ${f.rows} Zeilen${f.note ? ` · ${esc(f.note)}` : ""}</li>`).join("")}</ul>
        </details>
      </div>`;
  }

  function renderStart() {
    const r = state.result;
    const st = settings();
    shell(`
      <div class="ck-import side-card">
        <div class="ck-import__text">
          <h2>Import</h2>
          <p>Alle Dateien eines Exports auf einmal hineinziehen: Empfehlungen (CSV/Excel, deutsch oder englisch) und den Kampagnenbericht der letzten 30 Tage mit Gebotsstrategie, Zielwert, Kosten, Conversions, Umsatz und Anteil verlorener Impressionen wegen Budget. Die Dateien bleiben in diesem Browser, nichts wird hochgeladen.</p>
        </div>
        <label class="ck-drop" id="ck-drop">
          <input type="file" id="ck-file" multiple accept=".csv,.txt,.xlsx,.xls,.xlsm" />
          <span>${H.ICONS.download} Dateien auswählen oder hierher ziehen</span>
        </label>
        <div class="ck-import__actions">
          <button type="button" class="btn btn--secondary" id="ck-demo">Beispiel-Import (5 Dateien) laden</button>
          ${r ? `<button type="button" class="btn btn--secondary" id="ck-reset">Import leeren</button>` : ""}
        </div>
        <details class="ck-settings">
          <summary>Regeln einstellen</summary>
          <div class="ck-settings__grid">
            <label>Budgetbegrenzt ab verlorenen Impressionen (Budget) über <input type="number" min="0" max="100" id="ck-s-loss" value="${st.budgetLossPct}" /> %</label>
            <label>Abgelehnte Vorschläge ausblenden für <input type="number" min="0" id="ck-s-rej" value="${st.rejectDays}" /> Tage</label>
            <label>Kampagne gilt als neu unter <input type="number" min="0" id="ck-s-new" value="${st.newDays}" /> Tagen</label>
          </div>
        </details>
        <p class="ck-status" id="ck-status" aria-live="polite"></p>
      </div>
      ${r ? summaryHtml(r) + kontenHtml(r) : `<div class="empty-state">${H.ICONS.layers}<strong>Noch kein Import</strong><p>Dateien wählen oder den Beispiel-Import laden.</p></div>`}`);
    wireStart();
  }

  function kontoKpis(k) {
    const kc = k.kampagnen.filter((c) => !c.pausiert);
    const mitZiel = kc.filter((c) => c.erreicht !== null);
    const offen = k.items.filter((i) => !i.erledigt);
    return {
      imZiel: `${mitZiel.filter((c) => c.erreicht).length} von ${kc.length}`,
      chancen: kc.filter((c) => c.klasse === "chance").length,
      umsetzen: offen.filter((i) => i.urteil === "umsetzen").length,
      pruefen: offen.filter((i) => i.urteil === "prüfen").length,
      ziel: kontoZiel(k),
    };
  }
  function kontoZiel(k) {
    const p = k.profil; const c = k.kampagnen.filter((x) => !x.pausiert);
    const kosten = c.reduce((s, x) => s + (x.kosten || 0), 0), conv = c.reduce((s, x) => s + (x.conversions || 0), 0), ums = c.reduce((s, x) => s + (x.umsatz || 0), 0);
    const zw = num(p.zielwert);
    if (p.ziel === "CPA") { const ist = conv ? kosten / conv : null; return { text: `CPA ${eur(ist)} / Ziel ${zw ? eur(zw) : "–"}`, ok: ist != null && zw ? ist <= zw : null }; }
    if (p.ziel === "ROAS") { const ist = kosten ? ums / kosten : null; const z = zw ? (zw > 20 ? zw / 100 : zw) : null; return { text: `ROAS ${ist != null ? fmt(ist * 100) + " %" : "–"} / Ziel ${z ? fmt(z * 100) + " %" : "–"}`, ok: ist != null && z ? ist >= z : null }; }
    return { text: "Kontoziel im Profil eintragen", ok: null };
  }

  function kontenHtml(r) {
    return `
      <h2 class="feed__title">Konten<span class="feed__title__count">${r.konten.length}</span></h2>
      <ul class="ck-konten">${r.konten.map((k) => {
        const x = kontoKpis(k);
        return `<li><a class="ck-konto" href="#/cockpit?konto=${encodeURIComponent(k.name)}">
          <span class="ck-konto__name">${esc(k.name)}</span>
          <span class="ck-konto__ziel ${x.ziel.ok === true ? "is-good" : x.ziel.ok === false ? "is-bad" : ""}">${esc(x.ziel.text)}</span>
          <span class="ck-kpis">
            <span><strong>${x.imZiel}</strong> Kampagnen im Ziel</span>
            <span class="${x.chancen ? "is-good" : ""}"><strong>${x.chancen}</strong> Budget-Chancen</span>
            <span><strong>${x.umsetzen}</strong> Umsetzen</span>
            <span><strong>${x.pruefen}</strong> Prüfen</span>
          </span>
          <span class="ck-konto__call">${k.profil.naechsterCall ? `Nächster Call: ${H.formatDate(k.profil.naechsterCall)}` : "Kein Call eingetragen"}</span>
        </a></li>`; }).join("")}</ul>`;
  }

  async function runImport(files, label) {
    const stEl = document.getElementById("ck-status");
    if (stEl) stEl.textContent = "Lese Dateien …";
    try {
      const imp = await importFiles(files);
      state.files = files; state.result = analyse(imp);
      if (stEl) stEl.textContent = label || "";
      renderStart();
    } catch (e) { if (stEl) stEl.textContent = "Import fehlgeschlagen: " + e.message; }
  }
  const reanalyse = async () => { if (state.files.length) state.result = analyse(await importFiles(state.files)); };

  function wireStart() {
    const input = document.getElementById("ck-file");
    const drop = document.getElementById("ck-drop");
    const take = async (list) => {
      const files = await Promise.all([...list].map(async (f) => ({ name: f.name, data: new Uint8Array(await f.arrayBuffer()) })));
      runImport(files);
    };
    input.addEventListener("change", () => input.files.length && take(input.files));
    ["dragover", "dragenter"].forEach((e) => drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((e) => drop.addEventListener(e, () => drop.classList.remove("is-over")));
    drop.addEventListener("drop", (ev) => { ev.preventDefault(); if (ev.dataTransfer.files.length) take(ev.dataTransfer.files); });
    document.getElementById("ck-demo").addEventListener("click", async () => { const f = await loadDemo(); runImport(f); });
    const reset = document.getElementById("ck-reset");
    if (reset) reset.addEventListener("click", () => { state = { files: [], result: null, konto: null, tab: "umsetzen" }; renderStart(); });
    const save = async () => {
      LS.set("settings", { budgetLossPct: num(document.getElementById("ck-s-loss").value) ?? 10, rejectDays: num(document.getElementById("ck-s-rej").value) ?? 90, newDays: num(document.getElementById("ck-s-new").value) ?? 14 });
      await reanalyse(); renderStart();
    };
    ["ck-s-loss", "ck-s-rej", "ck-s-new"].forEach((id) => document.getElementById(id).addEventListener("change", save));
  }

  /* --------------------------------------------------------- Kontodetail */
  function renderKonto() {
    const k = state.result.konten.find((x) => x.name === state.konto);
    if (!k) { renderStart(); return; }
    const p = k.profil;
    const x = kontoKpis(k);
    const buckets = { umsetzen: k.items.filter((i) => i.urteil === "umsetzen"), "prüfen": k.items.filter((i) => i.urteil === "prüfen"), aussortiert: k.items.filter((i) => i.urteil === "aussortiert") };
    const tab = buckets[state.tab] ? state.tab : "umsetzen";
    view.innerHTML = `
      <a class="back-link" href="#/cockpit">${H.ICONS.arrowLeft} Alle Konten</a>
      <div class="detail">
        <div class="detail__meta"><span class="chip" style="background-color: var(--accent)">Empfehlungs-Cockpit</span></div>
        <h1>${esc(k.name)}</h1>
      </div>
      <div class="ck-head">
        <div class="ck-head__actions">
          <button type="button" class="btn btn--secondary" id="ck-agenda">${H.ICONS.copy} Agenda kopieren</button>
          <button type="button" class="btn btn--secondary" id="ck-protokoll">${H.ICONS.copy} Protokoll-Entwurf kopieren</button>
          <button type="button" class="btn btn--secondary" id="ck-export">${H.ICONS.download} Übersicht als CSV</button>
          <span class="ck-status" id="ck-status" aria-live="polite"></span>
        </div>
      </div>
      <div class="ck-kpirow">
        <div class="ck-kpi ${x.ziel.ok === true ? "is-good" : x.ziel.ok === false ? "is-bad" : ""}"><span>Kontoziel vs. Ist</span><strong>${esc(x.ziel.text)}</strong></div>
        <div class="ck-kpi"><span>Kampagnen im Ziel</span><strong>${x.imZiel}</strong></div>
        <div class="ck-kpi ${x.chancen ? "is-good" : ""}"><span>Budget-Chancen</span><strong>${x.chancen}</strong></div>
        <div class="ck-kpi"><span>Offen: Umsetzen / Prüfen</span><strong>${x.umsetzen} / ${x.pruefen}</strong></div>
        <div class="ck-kpi"><span>Nächster Call</span><strong>${p.naechsterCall ? H.formatDate(p.naechsterCall) : "–"}</strong></div>
      </div>

      <div class="ck-cols">
        <section class="ck-main">
          <h3 class="ck-h3">Empfehlungen</h3>
          <nav class="tabs" aria-label="Urteil">
            ${Object.keys(buckets).map((b) => `<button type="button" class="tabs__item ${tab === b ? "is-active" : ""}" data-ck-tab="${b}">${URTEIL[b]}<span class="tabs__item-count">${buckets[b].length}</span></button>`).join("")}
          </nav>
          <div class="ck-items">${buckets[tab].length ? buckets[tab].map(itemHtml).join("") : `<p class="ck-empty">Keine Empfehlungen in diesem Bereich.</p>`}</div>

          <h3 class="ck-h3">Kampagnen-Check</h3>
          ${k.kampagnen.length ? `<div class="ck-table-wrap"><table class="ck-table">
            <thead><tr><th>Kampagne</th><th>Gebotsstrategie</th><th>Ziel</th><th>Ist (30 Tage)</th><th>Verlust Budget</th><th>Einordnung</th></tr></thead>
            <tbody>${k.kampagnen.map((c) => `<tr>
              <td>${esc(c.kampagne)}${c.neu ? ` <span class="ck-tag">neu</span>` : ""}</td>
              <td>${esc(c.strategie || "–")}</td>
              <td>${c.ziel === "CPA" ? "CPA " + eur(c.zielwert) : c.ziel === "ROAS" ? "ROAS " + fmt(c.zielwert * 100) + " %" : "–"}</td>
              <td>${c.ist == null ? "–" : c.ziel === "CPA" ? eur(c.ist) : fmt(c.ist * 100) + " %"}</td>
              <td>${c.verlustBudget == null ? "–" : fmt(c.verlustBudget, 1) + " %"}</td>
              <td><span class="ck-klasse ck-klasse--${KLASSE[c.klasse][1]}">${KLASSE[c.klasse][0]}</span><small>${esc(c.hinweis)}</small></td>
            </tr>`).join("")}</tbody></table></div>` : `<p class="ck-empty">Kein Kampagnenbericht im Import – ohne Ziel- und Budgetdaten landen Budget- und Broad-Match-Empfehlungen unter „Prüfen“.</p>`}
        </section>

        <aside class="ck-side side-card">
          <h3 class="ck-h3">Kontoprofil</h3>
          <form id="ck-profil" class="ck-form">
            <div class="ck-form__row">
              <label>Hauptziel<select name="ziel"><option value="">–</option>${["CPA", "ROAS"].map((z) => `<option ${p.ziel === z ? "selected" : ""}>${z}</option>`).join("")}</select></label>
              <label>Zielwert<input name="zielwert" value="${esc(p.zielwert)}" placeholder="z. B. 30 € oder 400 %" /></label>
            </div>
            <div class="ck-form__row">
              <label>Monatsbudget<input name="monatsbudget" value="${esc(p.monatsbudget)}" placeholder="z. B. 5.000 €" /></label>
              <label>Nächster Call<input type="date" name="naechsterCall" value="${esc(p.naechsterCall)}" /></label>
            </div>
            <fieldset><legend>Kundenvorgaben</legend>
              <label class="ck-check"><input type="checkbox" name="keinBroad" ${p.keinBroad ? "checked" : ""} /> kein Broad Match</label>
              <label class="ck-check"><input type="checkbox" name="keineBudgeterhoehung" ${p.keineBudgeterhoehung ? "checked" : ""} /> keine Budgeterhöhung</label>
              <label class="ck-check"><input type="checkbox" name="keineAutoAssets" ${p.keineAutoAssets ? "checked" : ""} /> keine automatisch erstellten Assets</label>
              <label>Weitere Ausschlüsse (je Zeile ein Begriff)<textarea name="verboten" rows="2" placeholder="z. B. Wettbewerber-Marke">${esc(p.verboten)}</textarea></label>
            </fieldset>
            <label>Saisonalität<input name="saison" value="${esc(p.saison)}" placeholder="z. B. Hauptsaison März–Juni" /></label>
            <label>Letzte Kontoprüfung<textarea name="letztePruefung" rows="2">${esc(p.letztePruefung)}</textarea></label>
            <label>Notizen aus dem letzten Call<textarea name="notizen" rows="3">${esc(p.notizen)}</textarea></label>
            <p class="ck-note">Wird in diesem Browser gespeichert. Änderungen an den Vorgaben bewerten die Empfehlungen sofort neu.</p>
          </form>
        </aside>
      </div>`;
    wireKonto(k);
  }

  function itemHtml(i) {
    const multi = i.singles.length > 1;
    const st = i.singles[0].status;
    return `
      <article class="ck-item ck-item--${i.urteil === "prüfen" ? "pruefen" : i.urteil}${i.erledigt ? " is-done" : ""}" data-item="${esc(i.id)}">
        <div class="ck-item__top">
          <span class="ck-cat">${esc(catLabel(i.cat))}</span>
          ${i.prio ? `<span class="ck-prio ck-prio--${i.prio}">Priorität ${i.prio}</span>` : ""}
          <span class="ck-count">${i.rows} Einzelvorschl${i.rows === 1 ? "ag" : "äge"}${multi ? ` · ${i.singles.length} gebündelt` : ""}</span>
        </div>
        <h4 class="ck-item__title">${esc(i.titel)}</h4>
        ${!multi && i.kampagnen.length ? `<p class="ck-item__where">${esc(i.kampagnen[0])}${i.singles[0].anzeigengruppe ? " › " + esc(i.singles[0].anzeigengruppe) : ""}</p>` : ""}
        <p class="ck-item__grund">${i.urteil === "aussortiert" ? "<strong>Grund:</strong> " : ""}${esc(i.grund)}</p>
        ${i.effekt ? `<p class="ck-item__effekt">Effekt laut Microsoft: ${esc(i.effekt)}</p>` : ""}
        <p class="ck-item__src">Aus: ${i.quellen.map((q) => `<span class="ck-src">${esc(q)}</span>`).join(" ")}</p>
        ${multi ? `<details class="ck-singles"><summary>Einzelpunkte anzeigen</summary><ul>${i.singles.map((s) => `
          <li><span>${esc(s.vorschlag)}</span><small>${esc([s.kampagne, s.anzeigengruppe].filter(Boolean).join(" › "))}${s.effekt ? " · " + esc(s.effekt) : ""}${s.rows > 1 ? ` · ${s.rows}× in den Dateien` : ""}${i.grund.startsWith("Je Kampagne") ? `<br>${esc(s.grund)}` : ""}</small><small class="ck-singles__src">${[...s.quellen].map(esc).join(", ")}</small></li>`).join("")}</ul></details>` : ""}
        ${i.urteil !== "aussortiert" || st ? `<div class="ck-item__actions">
          ${["besprochen", "umgesetzt", "abgelehnt"].map((a) => `<button type="button" class="ck-act ${st && st.status === a ? "is-on" : ""}" data-act="${a}">${{ besprochen: "Im Call besprochen", umgesetzt: "Umgesetzt", abgelehnt: "Abgelehnt …" }[a]}</button>`).join("")}
          ${st ? `<span class="ck-act__info">${{ besprochen: "Besprochen", umgesetzt: "Umgesetzt", abgelehnt: "Abgelehnt" }[st.status]} am ${new Date(st.datum).toLocaleDateString("de-DE")}${st.grund ? ` – ${esc(st.grund)}` : ""}</span>` : ""}
        </div>` : ""}
      </article>`;
  }

  function wireKonto(k) {
    view.querySelectorAll("[data-ck-tab]").forEach((b) => b.addEventListener("click", () => { state.tab = b.dataset.ckTab; renderKonto(); }));
    const form = document.getElementById("ck-profil");
    form.addEventListener("change", async () => {
      const fd = new FormData(form); const prof = profileOf(k.name);
      ["ziel", "zielwert", "monatsbudget", "naechsterCall", "verboten", "saison", "letztePruefung", "notizen"].forEach((f) => (prof[f] = fd.get(f) || ""));
      ["keinBroad", "keineBudgeterhoehung", "keineAutoAssets"].forEach((f) => (prof[f] = fd.get(f) === "on"));
      LS.set("profil:" + k.name, prof);
      await reanalyse(); renderKonto();
    });
    view.querySelectorAll(".ck-item").forEach((el) => {
      const item = k.items.find((i) => i.id === el.dataset.item);
      el.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", async () => {
        const act = b.dataset.act; const stats = statusOf(k.name);
        const cur = stats[item.singles[0].simKey];
        let entry = null;
        if (cur && cur.status === act) entry = null; // erneut klicken = zurücknehmen
        else if (act === "abgelehnt") {
          const grund = window.prompt("Grund für die Ablehnung (für Protokoll und spätere Filterregeln):", "");
          if (grund === null) return;
          entry = { status: act, datum: new Date().toISOString(), grund: grund.trim() };
        } else entry = { status: act, datum: new Date().toISOString() };
        item.singles.forEach((s) => { if (entry) stats[s.simKey] = entry; else delete stats[s.simKey]; });
        LS.set("status:" + k.name, stats);
        await reanalyse(); renderKonto();
      }));
    });
    const status = (t) => { document.getElementById("ck-status").innerHTML = t; };
    const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); status(`${H.ICONS.check} ${ok}`); } catch { status("Kopieren nicht möglich."); } };
    document.getElementById("ck-agenda").addEventListener("click", () => copy(agendaText(k), "Agenda kopiert"));
    document.getElementById("ck-protokoll").addEventListener("click", () => copy(protokollText(k), "Protokoll-Entwurf kopiert"));
    document.getElementById("ck-export").addEventListener("click", () => exportCsv(k));
  }

  /* ----------------------------------------- Agenda, Protokoll, Export */
  function agendaText(k) {
    const p = k.profil; const lines = [`Agenda Monthly Call – ${k.name}${p.naechsterCall ? ` – ${new Date(p.naechsterCall).toLocaleDateString("de-DE")}` : ""}`, ""];
    const chancen = k.kampagnen.filter((c) => c.klasse === "chance");
    let n = 1;
    if (chancen.length) { lines.push(`${n++}. Budget-Chancen`); chancen.forEach((c) => lines.push(`   – ${c.kampagne}: ${istText(c)}, ${fmt(c.verlustBudget, 1)} % Impressionen wegen Budget verloren`)); lines.push(""); }
    const um = k.items.filter((i) => i.urteil === "umsetzen" && !i.erledigt && i.cat !== "budget");
    if (um.length) { lines.push(`${n++}. Umsetzen`); um.forEach((i) => lines.push(`   – ${i.titel}: ${i.grund}`)); lines.push(""); }
    const pr = k.items.filter((i) => i.urteil === "prüfen" && !i.erledigt);
    if (pr.length) { lines.push(`${n++}. Prüfen`); pr.forEach((i) => lines.push(`   – ${i.titel}: ${i.grund}`)); lines.push(""); }
    const kz = k.kampagnen.filter((c) => c.klasse === "kein-ziel");
    if (kz.length) { lines.push(`${n++}. Ziele festlegen`); kz.forEach((c) => lines.push(`   – ${c.kampagne}: noch kein Ziel-CPA/Ziel-ROAS`)); }
    return lines.join("\n").trim();
  }
  function protokollText(k) {
    const today = new Date().toLocaleDateString("de-DE");
    const lines = [`Protokoll Monthly Call – ${k.name} – ${today} (Entwurf)`, ""];
    const by = (s) => k.items.filter((i) => i.singles.some((x) => x.status && x.status.status === s));
    [["umgesetzt", "Umgesetzt / beschlossen"], ["besprochen", "Besprochen, noch offen"], ["abgelehnt", "Abgelehnt"]].forEach(([s, t]) => {
      const list = by(s); if (!list.length) return;
      lines.push(t + ":"); list.forEach((i) => { const st = i.singles.find((x) => x.status && x.status.status === s).status; lines.push(`  – ${i.titel}${st.grund ? ` (Grund: ${st.grund})` : ""}`); }); lines.push("");
    });
    const offen = k.items.filter((i) => i.urteil !== "aussortiert" && !i.singles.some((x) => x.status));
    if (offen.length) { lines.push("Nicht besprochen:"); offen.forEach((i) => lines.push(`  – ${i.titel}`)); }
    return lines.join("\n").trim();
  }
  function exportCsv(k) {
    const q = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const rows = [["Konto", "Urteil", "Priorität", "Bereich", "Empfehlung", "Kampagnen", "Begründung", "Effekt laut Microsoft", "Einzelvorschläge", "Quelldateien", "Status"]];
    k.items.forEach((i) => rows.push([k.name, URTEIL[i.urteil], i.prio, catLabel(i.cat), i.titel, i.kampagnen.join(", "), i.grund, i.effekt, i.rows, i.quellen.join(", "), (i.singles[0].status || {}).status || ""]));
    const blob = new Blob(["﻿" + rows.map((r) => r.map(q).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `Empfehlungen_${k.name.replace(/[^\wäöüÄÖÜß-]+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return { render, _test: { importFiles, analyse, demoFiles, num, pct } };
})();
