(() => {
  "use strict";

  const view = document.getElementById("view");
  const railLinks = document.querySelectorAll(".rail__nav a");

  // Auf reine Marken-Farben umgestellt (2026-08-14, Nutzer-Feedback: "die
  // Farben passen überhaupt nicht" — die --cat-*-Töne (Lila/Oliv/Rost/
  // Dunkelblau) waren nie echte Sowespoke-Farben, sondern eine separate
  // Kategorisierungs-Palette). Zyklus aus den vier echten Marken-Farben
  // (Magenta/Türkis/Grün/Gelb, siehe tokens.css) statt neun individueller
  // Töne — der sichtbare Quellen-Name daneben bleibt die eigentliche
  // Unterscheidung, Farbe ist nur noch ein Akzent, kein zweites
  // Label-System. Kein Schwarz/Grau/Weiß für diese Boxen (Nutzer-Vorgabe).
  const CHANNEL_VAR = {
    Microsoft: "--teal",
    Google: "--accent",
    Meta: "--turquoise",
    TikTok: "--teal",
    Snapchat: "--accent",
    Rechtliches: "--turquoise",
    KI: "--teal",
    CRO: "--accent",
    Allgemein: "--turquoise",
  };

  const NAV_ICON = { news: "home", praesentationen: "layers", vorlagen: "book", "case-studies": "trophy", tickets: "ticket", "microsoft-learn": "sparkle", anfragen: "mail", ideen: "lightbulb", serienmails: "hourglass", nutzer: "gauge", "microsoft-ads-kontopruefung": "crosshair" };
  railLinks.forEach((a) => {
    const iconSlot = a.querySelector(".rail__nav-icon");
    if (iconSlot) iconSlot.innerHTML = ICONS[NAV_ICON[a.dataset.nav]];
    else a.innerHTML = ICONS[NAV_ICON[a.dataset.nav]];
  });

  // Aufklappbares Untermenü (2026-08-14, Nutzer-Wunsch: Serienmails als
  // Unterkategorie von Vorlagen) — erstes verschachteltes Nav-Element in
  // dieser App, deshalb bewusst generisch über data-nav-group gebaut statt
  // hart auf "vorlagen" verdrahtet, falls später weitere Gruppen dazukommen.
  // Auf/Zu bleibt reiner DOM-Zustand (kein localStorage) — die Nav-Leiste
  // selbst wird von render() nie neu erzeugt (nur #view ändert sich), der
  // Zustand übersteht also jeden Routenwechsel von allein.
  const navGroups = document.querySelectorAll("[data-nav-group]");
  navGroups.forEach((group) => {
    const toggle = group.querySelector("[data-nav-toggle]");
    const sub = group.querySelector("[data-nav-sub]");
    toggle.innerHTML = ICONS.arrowRight;
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      sub.classList.toggle("is-expanded", !expanded);
    });
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function formatDate(iso) {
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "numeric" });
  }

  // Mit Uhrzeit, für Serienmail-Termine (2026-08-14, Phase C) — formatDate()
  // reicht dort nicht, die Uhrzeit ist der eigentliche Sinn der Terminierung.
  function formatDateTime(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("de-DE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  // Kurzform ohne Jahr, nur für Chart-Achsenbeschriftungen (Performance-
  // Chart-Karte) — die Datenpunkte liegen alle im selben Jahr, das
  // Jahr sechsmal auf der x-Achse zu wiederholen wäre reiner Ballast.
  function formatShortDate(iso) {
    const d = new Date(iso + "T00:00:00");
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  }

  function formatTime(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }

  /* Comic-"NEU"-Sticker nur für tatsächlich neue Inhalte (Brief: "nicht auf
     jeder Karte"), datumsbasiert statt zufällig. */
  function isRecent(iso, days) {
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    if (Number.isNaN(d.getTime())) return false;
    return (Date.now() - d.getTime()) / 86400000 <= days;
  }

  function findPresentation(id) {
    return PRESENTATIONS.find((p) => p.id === id);
  }
  function findStandaloneTemplate(id) {
    return STANDALONE_TEMPLATES.find((t) => t.id === id);
  }
  function findCaseStudy(id) {
    return CASE_STUDIES.find((c) => c.id === id);
  }

  /* ------------------------------------------------- Anrede: du/ihr-Register */
  /* Alle Fließtexte in data.js/presentations-data.js sind bewusst im
     ihr-Register geschrieben (eure/euch/ihr, nie mit ihr als Satzsubjekt
     + Verb außer in bekannt-sicheren Fällen). toDu() wandelt das für den
     Einzelempfänger-Modus um. Feste Grußzeilen werden separat verwaltet,
     da sie Verbformen enthalten, die diese einfache Ersetzung nicht abdeckt. */
  function toDu(text) {
    return text
      .replace(/\bIhr\b/g, "Du")
      .replace(/\bihr\b/g, "du")
      .replace(/\beuch\b/g, "dich")
      .replace(/\bEuer\b/g, "Dein")
      .replace(/\beuer\b/g, "dein")
      .replace(/\beuren\b/g, "deinen")
      .replace(/\beurem\b/g, "deinem")
      .replace(/\beurer\b/g, "deiner")
      .replace(/\beure\b/g, "deine");
  }

  const GREETING = {
    multi: { open: "ich hoffe, es geht euch gut!", close: "Falls ihr Fragen habt, könnt ihr mich jederzeit kontaktieren." },
    single: { open: "ich hoffe, es geht dir gut!", close: "Falls du Fragen hast, kannst du mich jederzeit kontaktieren." },
  };

  function composeMail(subjectBase, contentIhr, extra, mode, name) {
    const g = GREETING[mode] || GREETING.multi;
    const content = mode === "single" ? toDu(contentIhr) : contentIhr;
    const greetLine = name ? `Hallo ${name},` : mode === "single" ? "Hallo," : "Hallo zusammen,";
    const body = `${greetLine}\n\n${g.open}\n\n${content}${extra ? `\n\n${extra}` : ""}\n\n${g.close}\n\nBeste Grüße`;
    return { subject: subjectBase, body };
  }

  /* ---------------------------------------------------- Anfragen an Microsoft */
  /* Bewusst auf Englisch, fester Kontakt — Ausnahme von der du/ihr-Regel,
     da es sich um externe Kommunikation mit Microsoft handelt. */

  function composeMsMail(subjectBase, bodyIntro, selectedLines, accountsRaw) {
    const accounts = accountsRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    const parts = [`Hi ${MS_CONTACT_NAME},`, "", "I hope you're doing well.", "", bodyIntro];
    if (selectedLines && selectedLines.length) {
      parts.push(selectedLines.map((l) => `- ${l}`).join("\n"));
    }
    parts.push("", `Account(s): ${accounts.length ? accounts.join(", ") : "{Account}"}`, "", "Best regards,");
    return { subject: subjectBase, body: parts.join("\n") };
  }

  function wireMsCopyButton(key, subjectEl, bodyEl, copyBtn) {
    const statusEl = document.getElementById(`msreq-${key}-status`);
    let timer;
    copyBtn.addEventListener("click", async () => {
      const text = `To: ${MS_CONTACT_NAME}\nSubject: ${subjectEl.value}\n\n${bodyEl.value}`;
      if (/\{[^}]+\}/.test(text)) return;
      try {
        await navigator.clipboard.writeText(text);
        statusEl.innerHTML = `${ICONS.check} Kopiert`;
      } catch {
        statusEl.innerHTML = "Bitte Text manuell markieren und kopieren";
      }
      statusEl.classList.add("is-visible");
      clearTimeout(timer);
      timer = setTimeout(() => statusEl.classList.remove("is-visible"), 2600);
    });
  }

  function renderMsChecklistSection(key, title, introDE, options, includeHeading = true) {
    const iconColor = key === "bulk" ? "--teal" : "--accent";
    const icon = key === "bulk" ? ICONS.layers : ICONS.sparkle;
    // Nach Gruppe sortieren (stabil, erste Erscheinung entscheidet die
    // Reihenfolge) — sonst wechseln sich Gruppen-Labels chaotisch ab, weil
    // die Rohdaten in Dokument-Reihenfolge stehen, nicht nach Gruppe.
    const groupOrder = [];
    options.forEach((o) => { if (o.group && !groupOrder.includes(o.group)) groupOrder.push(o.group); });
    const sorted = [...options].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
    return `
      ${includeHeading ? `<h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(${iconColor})">${icon}</span>${escapeHtml(title)}</h2>` : ""}
      <div class="mailgen msreq">
        <p class="msreq__intro">${escapeHtml(introDE)}</p>
        <div class="msreq__checklist">
          ${sorted
            .map((o, i) => {
              const divider =
                o.group && o.group !== (sorted[i - 1] || {}).group
                  ? `<div class="msreq__group-label">${escapeHtml(o.group)}</div>`
                  : "";
              const noteText = escapeHtml([o.what, o.note].filter(Boolean).join(" — "));
              return `${divider}
            <label class="msreq__option">
              <input type="checkbox" data-msreq-opt="${key}" value="${o.id}" />
              <span><strong>${escapeHtml(o.name)}</strong>${o.markets ? ` <span class="msreq__meta">(${escapeHtml(o.markets)})</span>` : ""}<br /><span class="msreq__note">${noteText}</span></span>
            </label>`;
            })
            .join("")}
        </div>
        <p class="msreq__count" id="msreq-${key}-count">0 ausgewählt</p>
        <div class="mailgen__field">
          <label for="msreq-${key}-accounts">Konto-Nummer(n) (eine pro Zeile)</label>
          <textarea id="msreq-${key}-accounts" placeholder="z. B.&#10;123-456-789&#10;987-654-321"></textarea>
        </div>
        <div class="mailgen__field">
          <label>An</label>
          <input type="text" value="${escapeHtml(MS_CONTACT_NAME)}" readonly />
        </div>
        <div class="mailgen__field">
          <label for="msreq-${key}-subject">Subject</label>
          <input type="text" id="msreq-${key}-subject" readonly />
        </div>
        <div class="mailgen__field">
          <label for="msreq-${key}-body">Text</label>
          <textarea id="msreq-${key}-body" readonly></textarea>
        </div>
        <p class="mailgen__warning" id="msreq-${key}-warning" hidden>${ICONS.flash}<span></span></p>
        <div class="mailgen__actions">
          <button class="btn btn--primary" data-msreq-copy="${key}" type="button">${ICONS.copy} In Zwischenablage kopieren</button>
          <span class="mailgen__status" id="msreq-${key}-status">${ICONS.check} Kopiert</span>
        </div>
      </div>
    `;
  }

  function wireMsChecklistSection(key, options, subjectBase, bodyIntro) {
    const checks = Array.from(view.querySelectorAll(`input[data-msreq-opt="${key}"]`));
    const accountsEl = document.getElementById(`msreq-${key}-accounts`);
    const subjectEl = document.getElementById(`msreq-${key}-subject`);
    const bodyEl = document.getElementById(`msreq-${key}-body`);
    const warningEl = document.getElementById(`msreq-${key}-warning`);
    const countEl = document.getElementById(`msreq-${key}-count`);
    const copyBtn = view.querySelector(`[data-msreq-copy="${key}"]`);

    // Eingaben lokal merken — dieselben Kundenkonten werden meist täglich
    // wieder angefragt, erneutes Abtippen bei jedem Besuch war ein
    // konkreter Kritikpunkt.
    const savedAccounts = localStorage.getItem(`msreq-accounts:${key}`);
    if (savedAccounts) accountsEl.value = savedAccounts;
    try {
      const savedSelected = JSON.parse(localStorage.getItem(`msreq-selected:${key}`) || "[]");
      checks.forEach((c) => { if (savedSelected.includes(c.value)) c.checked = true; });
    } catch {
      // beschädigter localStorage-Eintrag ignorieren
    }

    function fill() {
      const selectedIds = checks.filter((c) => c.checked).map((c) => c.value);
      const selected = selectedIds.map((id) => options.find((o) => o.id === id).name);
      const accounts = accountsEl.value.split("\n").map((s) => s.trim()).filter(Boolean);
      const { subject, body } = composeMsMail(subjectBase, bodyIntro, selected, accountsEl.value);
      subjectEl.value = subject;
      bodyEl.value = body;
      countEl.textContent = selected.length === 1 ? "1 ausgewählt" : `${selected.length} ausgewählt`;
      localStorage.setItem(`msreq-accounts:${key}`, accountsEl.value);
      localStorage.setItem(`msreq-selected:${key}`, JSON.stringify(selectedIds));

      const missing = [];
      if (!selected.length) missing.push("mindestens einen Punkt auswählen");
      if (!accounts.length) missing.push("mindestens ein Konto angeben");
      if (missing.length) {
        warningEl.querySelector("span").textContent = "Bitte " + missing.join(" und ") + ".";
        warningEl.hidden = false;
        copyBtn.disabled = true;
      } else {
        warningEl.hidden = true;
        copyBtn.disabled = false;
      }
    }
    checks.forEach((c) => c.addEventListener("change", fill));
    accountsEl.addEventListener("input", fill);
    fill();

    wireMsCopyButton(key, subjectEl, bodyEl, copyBtn);
  }

  function renderMsAutobiddingSection(includeHeading = true) {
    return `
      ${includeHeading ? `<h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(--accent)">${ICONS.gauge}</span>Autobidding Report</h2>` : ""}
      <div class="mailgen msreq">
        <p class="msreq__intro pre-line">${escapeHtml(MS_AUTOBIDDING_REPORT.cautionDE)}</p>
        <details class="msreq__example">
          <summary>Beispiel-Report ansehen</summary>
          <pre class="msreq__example-text">${escapeHtml(MS_AUTOBIDDING_REPORT.exampleReport)}</pre>
        </details>
        <div class="mailgen__field">
          <label for="msreq-auto-accounts">Konto-Nummer(n) (eine pro Zeile)</label>
          <textarea id="msreq-auto-accounts" placeholder="z. B.&#10;123-456-789"></textarea>
        </div>
        <div class="mailgen__field">
          <label>An</label>
          <input type="text" value="${escapeHtml(MS_CONTACT_NAME)}" readonly />
        </div>
        <div class="mailgen__field">
          <label for="msreq-auto-subject">Subject</label>
          <input type="text" id="msreq-auto-subject" readonly />
        </div>
        <div class="mailgen__field">
          <label for="msreq-auto-body">Text</label>
          <textarea id="msreq-auto-body" readonly></textarea>
        </div>
        <p class="mailgen__warning" id="msreq-auto-warning" hidden>${ICONS.flash}<span></span></p>
        <div class="mailgen__actions">
          <button class="btn btn--primary" data-msreq-copy="auto" type="button">${ICONS.copy} In Zwischenablage kopieren</button>
          <span class="mailgen__status" id="msreq-auto-status">${ICONS.check} Kopiert</span>
        </div>
      </div>
    `;
  }

  function wireMsAutobiddingSection() {
    const accountsEl = document.getElementById("msreq-auto-accounts");
    const subjectEl = document.getElementById("msreq-auto-subject");
    const bodyEl = document.getElementById("msreq-auto-body");
    const warningEl = document.getElementById("msreq-auto-warning");
    const copyBtn = view.querySelector(`[data-msreq-copy="auto"]`);

    const savedAccounts = localStorage.getItem("msreq-accounts:auto");
    if (savedAccounts) accountsEl.value = savedAccounts;

    function fill() {
      const accounts = accountsEl.value.split("\n").map((s) => s.trim()).filter(Boolean);
      const { subject, body } = composeMsMail(
        "Autobidding Report Request",
        "I would like to request the autobidding report for the following account(s):",
        null,
        accountsEl.value
      );
      subjectEl.value = subject;
      bodyEl.value = body;
      localStorage.setItem("msreq-accounts:auto", accountsEl.value);
      if (!accounts.length) {
        warningEl.querySelector("span").textContent = "Bitte mindestens ein Konto angeben.";
        warningEl.hidden = false;
        copyBtn.disabled = true;
      } else {
        warningEl.hidden = true;
        copyBtn.disabled = false;
      }
    }
    accountsEl.addEventListener("input", fill);
    fill();

    wireMsCopyButton("auto", subjectEl, bodyEl, copyBtn);
  }

  /* Distill (2026-08-13, Nutzer-Feedback: "zu vollgeladen") — die Seite
     stapelte vorher vier vollständige Formulare (je mit eigenem Konto-Feld,
     Betreff, Text, Warnhinweis, Kopieren-Button) untereinander auf einer
     einzigen, sehr langen Scroll-Seite. Nutzer-Vorschlag direkt umgesetzt:
     eigene Unterseite pro Anfrage-Art, gleiches Listen→Detail-Muster wie
     Präsentationen/Vorlagen/Case Studies (Übersicht mit .row-Einträgen,
     Klick führt zur jeweils EINEN vollständigen Anfrage). Wer eine Beta-
     Anfrage stellen will, sieht nicht mehr zusätzlich drei fremde
     Formulare auf demselben Bildschirm. */
  const MS_REQUEST_TYPES = [
    { id: "beta", title: "Beta- & Pilot-Programme", short: "Aktueller Nominierungs-Überblick — auswählen, was für den Kunden angefragt werden soll.", icon: "sparkle", color: "--accent" },
    { id: "bulk", title: "Bulk Team", short: "Aufgaben, die das Bulk Team im Kundenauftrag übernehmen kann.", icon: "layers", color: "--teal" },
    { id: "autobidding", title: "Autobidding Report", short: "Reporting zur automatisierten Gebotsstrategie für ein Kundenkonto anfordern.", icon: "gauge", color: "--accent" },
    { id: "sap-id", title: "SAP-ID-Erstellung", short: "Formular zur Anlage einer neuen SAP-ID — Rechnungs-/Kontodaten, VAT, Kundennummer.", icon: "fileText", color: "--teal" },
  ];

  function renderMicrosoftRequestsHub() {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Anfragen an <mark>Microsoft</mark>.</h1>
          <p>Vorbereitete E-Mails auf Englisch an ${escapeHtml(MS_CONTACT_NAME)} — nach Anfrage-Art sortiert, jede mit eigenem Formular.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
      </section>

      <ul class="article-list">
        ${MS_REQUEST_TYPES.map(
          (t) => `
        <li>
          <a class="row" href="#/anfragen/${t.id}">
            <span class="row__thumb" style="background-color: var(${t.color})">${ICONS[t.icon]}</span>
            <span class="row__body">
              <span class="row__title">${escapeHtml(t.title)}</span>
              <span class="row__summary">${escapeHtml(t.short)}</span>
            </span>
            <span class="row__arrow">${ICONS.arrowRight}</span>
          </a>
        </li>`
        ).join("")}
      </ul>
    `;
  }

  function renderMicrosoftRequestDetail(id) {
    const type = MS_REQUEST_TYPES.find((t) => t.id === id);
    if (!type) {
      view.innerHTML = `<a class="back-link" href="#/anfragen">${ICONS.arrowLeft} Zu den Anfragen</a>
        <div class="empty-state">${ICONS.magnifyEmpty}<strong>Anfrage-Art nicht gefunden</strong></div>`;
      return;
    }

    let sectionHtml = "";
    if (id === "beta") {
      sectionHtml = renderMsChecklistSection("beta", type.title, "Aktueller Nominierungs-Überblick (Stand Januar 2026) — auswählen, was für den Kunden angefragt werden soll.", MS_BETA_PROGRAMS, false);
    } else if (id === "bulk") {
      sectionHtml = renderMsChecklistSection("bulk", type.title, "Aufgaben, die das Bulk Team im Kundenauftrag übernehmen kann.", MS_BULK_TEAM_TASKS, false);
    } else if (id === "autobidding") {
      sectionHtml = renderMsAutobiddingSection(false);
    } else if (id === "sap-id") {
      sectionHtml = `
        <div class="info-box">
          <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
          <p>Formular zur Anlage einer neuen SAP-ID (Rechnungs-/Kontodaten, VAT, Microsoft-Advertising-Kundennummer). Direkt im Dokument ausfüllen und an ${escapeHtml(MS_CONTACT_NAME)} senden.</p>
          <a class="btn btn--secondary" href="content/microsoft-anfragen/${encodeURIComponent("SAP ID Creation Form .docx")}" download>${ICONS.download} Formular herunterladen</a>
        </div>`;
    }

    view.innerHTML = `
      <a class="back-link" href="#/anfragen">${ICONS.arrowLeft} Zu den Anfragen</a>
      <article class="detail">
        <h1>${escapeHtml(type.title)}</h1>
        ${sectionHtml}
      </article>
    `;

    if (id === "beta") {
      wireMsChecklistSection("beta", MS_BETA_PROGRAMS, "Beta / Pilot Program Request", "I would like to request access to the following beta/pilot program(s):");
    } else if (id === "bulk") {
      wireMsChecklistSection("bulk", MS_BULK_TEAM_TASKS, "Bulk Team Support Request", "I would like to request the Bulk Team's support with the following task(s):");
    } else if (id === "autobidding") {
      wireMsAutobiddingSection();
    }
  }

  /* ------------------------------------------------------- Kalender-Widget */

  function renderCalendarCard() {
    const events = upcomingEvents(new Date(), 3);
    return `
      <div class="side-card">
        <div class="side-card__illustration">${SIDECARD_ILLUSTRATION}</div>
        <h2>${ICONS.calendar} Anstehende Termine</h2>
        <ul class="side-card__list">
          ${events
            .map((ev) => {
              const p = ev.presentationId ? findPresentation(ev.presentationId) : null;
              return `
            <li class="event-row">
              <div class="event-row__top">
                <span>
                  <strong>${escapeHtml(ev.name)}</strong>
                  <p>${formatDate(ev.date.toISOString().slice(0, 10))}${ev.note ? " · " + escapeHtml(ev.note) : ""}${ev.approx ? " (ca.)" : ""}</p>
                </span>
                <span class="event-row__days">${ev.days === 0 ? "heute" : `in ${ev.days} Tg.`}</span>
              </div>
              ${ev.relevantFor ? `<p class="event-row__branches">Relevant für: ${escapeHtml(ev.relevantFor)}</p>` : ""}
              ${p ? `<a class="event-row__link" href="#/praesentationen/${p.id}">${ICONS.fileText} Passende Präsentation: ${escapeHtml(p.title)}</a>` : ""}
            </li>`;
            })
            .join("")}
        </ul>
      </div>
    `;
  }

  /* ---------------------------------------------------------------- Mascot */
  /* Bleibt dauerhaft sichtbar (Nutzerwunsch), wird aber auf Seiten mit
     Mail-Generator/Checklisten ausgeblendet — dort hat die Sprechblase
     nachweislich Buttons/Formularfelder verdeckt (Kritik-Fund P0). Kein
     dauerhaftes Schließen durch die Route, nur durch den X-Button. */
  let mascotDismissedByUser = false;
  let mascotCycleTimer = null;

  /* MOMO (2026-08-13): ursprünglich versucht, MASCOT_SVG per ID-Suffix
     mehrfach gleichzeitig instanzierbar zu machen (schwebende Bubble +
     .fact-widget). Verworfen — das SVGator-Player-Skript nimmt bei
     geänderten IDs einen anderen internen Codepfad, der ein verschlüsseltes
     Datenfeld anders (und fehlerhaft) verarbeitet, mit unverändertem Inhalt
     aber bei nachweislich unverändertem Byte-Inhalt dieses Feldes (per
     Bisektion verifiziert: Platzierung allein unschuldig, ID-Ersetzung
     allein reproduziert den Crash) — reines Reverse-Engineering von
     Fremdcode wäre hier unverhältnismäßig riskant. Stattdessen einfacher:
     MASCOT_SVG läuft nur noch UNVERÄNDERT und nur als jeweils EINE Instanz
     pro Seite (siehe routeBlocksMascot: die schwebende Bubble wird auf der
     Präsentationen-Liste jetzt zusätzlich unterdrückt, weil dort schon
     .fact-widget denselben Hund zeigt). */
  /* <script>-Tags werden von Browsern ignoriert, wenn sie per innerHTML
     eingefügt werden (wie der Rest dieser App das macht) — die Animation
     muss deshalb über ein echtes, per DOM-API erzeugtes <script>-Element
     nachträglich ausgeführt werden. */
  function runMascotAnimation() {
    const el = document.createElement("script");
    el.textContent = MASCOT_ANIMATION_SCRIPT;
    document.body.appendChild(el);
  }

  function routeBlocksMascot(path) {
    // "/praesentationen" (ohne Slash, die Liste) blockt die schwebende
    // Bubble jetzt zusätzlich (2026-08-13) — dort zeigt .fact-widget schon
    // denselben Hund, siehe Kommentar bei runMascotAnimation weiter oben.
    return path.startsWith("/praesentationen") || path.startsWith("/vorlagen/") || path.startsWith("/anfragen") || path === "/ideen";
  }

  function showMascot() {
    if (mascotDismissedByUser) return;
    const root = document.getElementById("mascot-root");
    if (root.querySelector(".mascot")) return; // schon sichtbar
    let fact = factOfTheDay();
    root.innerHTML = `
      <div class="mascot" role="status">
        <div class="mascot__figure">${MASCOT_SVG}</div>
        <div class="mascot__bubble">
          <button type="button" class="mascot__close" aria-label="Schließen">${ICONS.close}</button>
          <span class="mascot__label">Wusstest du schon?</span>
          <p>${escapeHtml(fact)}</p>
          <button type="button" class="mascot__more">Noch ein Fakt ${ICONS.arrowRight}</button>
        </div>
      </div>
    `;
    const mascotEl = root.querySelector(".mascot");
    const factEl = root.querySelector(".mascot__bubble p");

    function nextFact() {
      fact = randomFact(fact);
      factEl.style.opacity = "0";
      setTimeout(() => {
        factEl.textContent = fact;
        factEl.style.opacity = "1";
      }, 160);
    }
    function scheduleCycle() {
      clearInterval(mascotCycleTimer);
      mascotCycleTimer = setInterval(nextFact, 15000); // wechselt von selbst, bleibt dauerhaft sichtbar
    }

    root.querySelector(".mascot__close").addEventListener("click", () => {
      mascotDismissedByUser = true;
      clearInterval(mascotCycleTimer);
      mascotEl.classList.add("is-leaving");
      mascotEl.addEventListener("animationend", () => { root.innerHTML = ""; }, { once: true });
    });
    root.querySelector(".mascot__more").addEventListener("click", () => {
      nextFact();
      scheduleCycle(); // Timer neu starten, damit nicht gleich nochmal automatisch wechselt
    });
    scheduleCycle();
    avoidMascotCollision(mascotEl);
    updateMascotCollapse(mascotEl);
    runMascotAnimation();
  }

  // Kritik-Fund (2026-08-10, Assessment A): die Bubble hat pointer-events:
  // auto und blockierte beim Scrollen echte Taps auf Artikelkarten darunter
  // — nicht nur optisch überlappend. Statt die Blase über Inhalte zu
  // schieben, klappt sie beim Überlappen mit .feed auf ein kleines,
  // weiterhin schwebendes Icon zusammen (viel kleinere Trefffläche),
  // sobald keine Überlappung mehr besteht, klappt sie automatisch wieder auf.
  // .chart-card ergänzt (2026-08-14): die Performance-Chart-Karte auf
  // Case-Study-Seiten sitzt (anders als .side-rail/.toolbar/.ticket-list,
  // die schon oben im Viewport liegen) weiter unten im Fließtext — genau
  // der Fall, für den avoidEls/avoidMascotCollision NICHT gedacht ist (nur
  // eine einmalige Prüfung beim ersten Erscheinen, nicht bei jedem Scroll).
  // Gehört deshalb zur Kollaps-Logik hier, nicht zur Lift-Logik oben.
  function mascotOverlapsFeed(mascotEl) {
    const target = document.querySelector(".feed, .chart-card");
    if (!target) return false;
    const mRect = mascotEl.getBoundingClientRect();
    const fRect = target.getBoundingClientRect();
    return mRect.left < fRect.right && mRect.right > fRect.left && mRect.top < fRect.bottom && mRect.bottom > fRect.top;
  }
  function updateMascotCollapse(mascotEl) {
    mascotEl.classList.toggle("mascot--collapsed", mascotOverlapsFeed(mascotEl));
  }

  /* Screenshot-Selbsttest (2026-08-10) deckte auf: die fixe Maskottchen-
     Ecke unten rechts überlappt strukturell die "Anstehende Termine"-Karte
     im .side-rail der News-Seite — unabhängig von der Feed-Länge, weil die
     Kartenposition nur von Hero+Toolbar-Höhe abhängt. Statt eines
     Fixwerts: echte Kollisionsprüfung, die die Blase nach oben schiebt,
     wenn sie eine begrenzt-hohe Sidebar-Karte träfe. Bewusst NICHT gegen
     .feed geprüft — darüber hinwegzuscrollen ist normales, akzeptiertes
     Verhalten für ein schwebendes Element. */
  function mascotNeededLift(mascotEl) {
    // .toolbar zusätzlich zu .side-rail geprüft (2026-08-10): auf schmalen
    // Viewports rutscht .side-rail unter den Feed (einspaltiges Layout) und
    // ist beim ersten Auftritt oft noch gar nicht im Viewport — dort
    // überlappte die Blase stattdessen Suchfeld/Filter-Pills, die anders
    // als der Feed wirklich bedienbar bleiben müssen.
    // .ticket-list zusätzlich (Kritik-Fund 2026-08-11): die sonst für .feed
    // akzeptierte Kollaps-auf-Icon-Lösung reicht hier nicht — selbst das
    // verkleinerte Icon saß direkt auf echtem Ticket-Fließtext (News-Karten
    // haben dort Bild-/Leerraum, Ticket-Zeilen sind dichter Lesetext). Wie
    // bei .side-rail/.toolbar: wegschieben statt nur verkleinern; wird der
    // nötige Versatz unrealistisch groß, bleibt die Blase bis zum nächsten
    // Scroll unsichtbar (bestehendes, bereits etabliertes Verhalten).
    // .chart-card bewusst NICHT hier (sondern in mascotOverlapsFeed unten) —
    // sitzt wie .feed weiter unten im Fließtext, nicht oben im Viewport wie
    // die drei hier geprüften Elemente; eine einmalige Prüfung beim ersten
    // Erscheinen würde eine erst später beim Scrollen entstehende
    // Überlappung nicht erfassen.
    // .msads-workspace zusätzlich (2026-08-20, Nutzer-Fund): auf 600–768px-
    // Viewports überlappte die Blase strukturell die Route-/Frage-Karten der
    // Kontoprüfung-Seite (.msads-panel/.msads-choice-card) — dieselbe Art
    // Überlappung wie bei .toolbar, nie in dieser Liste geprüft worden.
    const avoidEls = document.querySelectorAll(".side-rail, .toolbar, .ticket-list, .msads-workspace");
    const mRect = mascotEl.getBoundingClientRect();
    let maxLift = 0;
    avoidEls.forEach((avoidEl) => {
      const aRect = avoidEl.getBoundingClientRect();
      const overlaps = mRect.left < aRect.right && mRect.right > aRect.left && mRect.top < aRect.bottom && mRect.bottom > aRect.top;
      if (!overlaps) return;
      const lift = mRect.bottom - aRect.top + 16;
      if (lift > maxLift) maxLift = lift;
    });
    return maxLift;
  }

  // Auf kurzen Mobile-Viewports gibt es im ersten Sichtfenster manchmal
  // GAR keine kollisionsfreie Stelle (Hero-Headline nimmt den ganzen
  // Bildschirm ein) — ein sehr großer Lift-Wert würde die Blase dann in
  // die Headline schieben. Ab dieser Schwelle lieber bis zum ersten
  // Scrollen unsichtbar bleiben, statt eine schlechte Position zu erzwingen.
  const MASCOT_MAX_REASONABLE_LIFT = 180;

  function avoidMascotCollision(mascotEl) {
    const lift = mascotNeededLift(mascotEl);
    if (lift <= 0) {
      mascotEl.style.bottom = "";
      return;
    }
    if (lift > MASCOT_MAX_REASONABLE_LIFT) {
      mascotEl.style.visibility = "hidden";
      mascotEl.style.pointerEvents = "none";
      const onScroll = () => {
        const stillNeeded = mascotNeededLift(mascotEl);
        if (stillNeeded <= MASCOT_MAX_REASONABLE_LIFT) {
          mascotEl.style.visibility = "";
          mascotEl.style.pointerEvents = "";
          const base = parseFloat(getComputedStyle(mascotEl).bottom) || 0;
          mascotEl.style.bottom = stillNeeded > 0 ? base + stillNeeded + "px" : "";
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return;
    }
    const currentBottom = parseFloat(getComputedStyle(mascotEl).bottom) || 0;
    mascotEl.style.bottom = currentBottom + lift + "px";
  }

  function hideMascotForRoute() {
    clearInterval(mascotCycleTimer);
    const root = document.getElementById("mascot-root");
    root.innerHTML = "";
  }

  let mascotIntroduced = false;

  function updateMascotForRoute(path) {
    if (mascotDismissedByUser) return;
    if (routeBlocksMascot(path)) {
      hideMascotForRoute();
      return;
    }
    if (!mascotIntroduced) {
      mascotIntroduced = true;
      setTimeout(showMascot, 600); // sanfter erster Auftritt, danach sofortiges Ein-/Ausblenden
    } else {
      showMascot();
    }
  }

  let mascotResizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(mascotResizeTimer);
    mascotResizeTimer = setTimeout(() => {
      const mascotEl = document.querySelector(".mascot");
      if (!mascotEl) return;
      // Kollisionsprüfung von neuem starten statt Lift/Sichtbarkeit von der
      // vorherigen Fensterbreite fortzuschreiben.
      mascotEl.style.bottom = "";
      mascotEl.style.visibility = "";
      mascotEl.style.pointerEvents = "";
      avoidMascotCollision(mascotEl);
      updateMascotCollapse(mascotEl);
    }, 200);
  });

  // Passiv + ungedrosselt: reines Klassen-Toggle ist billig genug, um bei
  // jedem Scroll-Frame zu laufen, und muss sofort reagieren (kein Delay),
  // damit die Blase nicht kurz über einer Karte "aufblitzt".
  window.addEventListener(
    "scroll",
    () => {
      const mascotEl = document.querySelector(".mascot");
      if (mascotEl) updateMascotCollapse(mascotEl);
    },
    { passive: true }
  );

  /* ----------------------------------------------------- Fakten-Widget */

  function renderFactWidget() {
    const fact = factOfTheDay();
    return `
      <section class="fact-widget" aria-label="Wusstest du schon?">
        <div class="fact-widget__figure">${MASCOT_SVG}</div>
        <div class="fact-widget__bubble">
          <span class="fact-widget__label">Wusstest du schon?</span>
          <p id="fact-widget-text">${escapeHtml(fact)}</p>
          <button type="button" class="fact-widget__more" id="fact-widget-more">Noch ein Fakt ${ICONS.arrowRight}</button>
        </div>
      </section>
    `;
  }

  function wireFactWidget() {
    const textEl = document.getElementById("fact-widget-text");
    const btn = document.getElementById("fact-widget-more");
    if (!textEl || !btn) return;
    btn.addEventListener("click", () => {
      const next = randomFact(textEl.textContent);
      textEl.style.opacity = "0";
      setTimeout(() => {
        textEl.textContent = next;
        textEl.style.opacity = "1";
      }, 160);
    });
    runMascotAnimation();
  }

  /* ---------------------------------------------------------------- Mailgen */

  // Personalisierter Mehrfach-Versand (2026-08-14, Nutzer-Wunsch, Phase A
  // aus dem Serienmail-Plan — siehe DESIGN.md-Eintrag vom selben Tag).
  // Dritter Anrede-Modus additiv zu den bestehenden zwei ("Mehrere
  // Personen (ihr)" bleibt für den Fall einer echten Gruppen-Mail an ein
  // Team, das ohnehin weiß, dass es eine gemeinsame Mail ist — kein
  // Ersatz, ein eigener Anwendungsfall). Jede Zeile bekommt eine stabile
  // ID (crypto.randomUUID(), gleiche Grundtechnik wie schon in
  // functions/api/ideas.js), damit Entfernen/Fokus-Tracking nicht auf den
  // Array-Index angewiesen ist, der sich beim Löschen einer mittleren
  // Zeile verschieben würde.
  function recipientRowHtml(topicKey, id, prefill) {
    const name = (prefill && prefill.name) || "";
    const email = (prefill && prefill.email) || "";
    return `
      <div class="mailgen__recipient-row" data-recip-row="${id}">
        <input type="text" data-recip-name placeholder="Name (optional)" aria-label="Name der Ansprechperson" value="${escapeHtml(name)}" />
        <input type="text" data-recip-email placeholder="name@kunde.de" aria-label="E-Mail-Adresse" autocomplete="off" value="${escapeHtml(email)}" />
        <button type="button" class="mailgen__recipient-remove" data-recip-remove aria-label="Empfänger:in entfernen">${ICONS.close}</button>
      </div>
    `;
  }

  function renderMailGen(topicKey, extraFields, subjectBase, contentIhr, extra) {
    return `
      <div class="mailgen">
        <div class="mailgen__illustration">${MAILGEN_ILLUSTRATION}</div>
        <h2>Teaser-Mail an Kund:innen</h2>
        <div class="mailgen__field">
          <span class="mailgen__radiogroup-label">Empfänger:in</span>
          <div class="mailgen__radiogroup" role="radiogroup" aria-label="Anzahl Empfänger:innen">
            <label><input type="radio" name="mode-${topicKey}" value="multi" /> Mehrere Personen (ihr)</label>
            <label><input type="radio" name="mode-${topicKey}" value="single" checked /> Eine Person (du)</label>
            <label><input type="radio" name="mode-${topicKey}" value="einzeln" /> Mehrere Personen, einzeln personalisiert</label>
          </div>
        </div>
        <div class="mailgen__single-fields" id="single-fields-${topicKey}">
          <div class="mailgen__field">
            <label for="to-${topicKey}">E-Mail-Adresse(n) der Kundschaft</label>
            <input type="text" id="to-${topicKey}" placeholder="name@kunde.de — mehrere mit Komma trennen" autocomplete="off" />
          </div>
          <div class="mailgen__field">
            <label for="f-${topicKey}-name">Name der Ansprechperson (optional)</label>
            <input type="text" id="f-${topicKey}-name" placeholder="z. B. Frau Meyer" />
          </div>
        </div>
        <div class="mailgen__field mailgen__recipients" id="recipients-${topicKey}" hidden>
          <span class="mailgen__radiogroup-label">Empfänger:innen — jede Person bekommt eine eigene, separate Mail</span>
          <p class="mailgen__hint">"In Gmail öffnen" und "In Zwischenablage kopieren" wirken immer nur auf die gerade aktive Zeile (unten als "Vorschau für: …" markiert) — für jede weitere Person erst in ihre Zeile klicken, dann erneut "In Gmail öffnen". "Alle jetzt per Gmail senden" verschickt stattdessen automatisch an alle auf einmal.</p>
          <div class="mailgen__recipient-rows" data-recip-rows>
            ${recipientRowHtml(topicKey, crypto.randomUUID())}
            ${recipientRowHtml(topicKey, crypto.randomUUID())}
          </div>
          <div class="mailgen__recipients-listactions">
            <button type="button" class="btn btn--secondary mailgen__recipients-add" data-recip-add>+ Empfänger:in hinzufügen</button>
            <button type="button" class="btn btn--secondary" data-recip-csv-btn>CSV hochladen</button>
            <input type="file" accept=".csv,text/csv" data-recip-csv-input hidden />
            <button type="button" class="btn btn--secondary" data-recip-load>Gespeicherte Liste laden</button>
            <span class="mailgen__signature-status" data-recip-save-status></span>
          </div>
          <p class="mailgen__hint">Die Liste wird beim Tippen automatisch gespeichert — an dein Konto gebunden, für alle Vorlagen und auf jedem Gerät wiederverwendbar. CSV-Datei: eine Zeile pro Person, Spalten „Name" (optional) und „E-Mail" — mit oder ohne Kopfzeile, Komma oder Semikolon als Trennzeichen.</p>
          <p class="mailgen__warning" data-recip-warning hidden>${ICONS.flash}<span>Eine oder mehrere Zeilen haben keine gültige E-Mail-Adresse — diese Empfänger:innen bekommen keine Mail.</span></p>
          <p class="mailgen__hint mailgen__recipients-preview-label" data-recip-preview-label></p>
        </div>
        ${extraFields
          .map(
            (f) => `
          <div class="mailgen__field">
            <label for="f-${topicKey}-${f.key}">${escapeHtml(f.label)}</label>
            ${
              f.multiline
                ? `<textarea id="f-${topicKey}-${f.key}" data-field="${f.key}" class="mailgen__field-textarea--compact" rows="3" placeholder="${escapeHtml(f.placeholder || "")}"></textarea>`
                : `<input type="text" id="f-${topicKey}-${f.key}" data-field="${f.key}" placeholder="${escapeHtml(f.placeholder || "")}" />`
            }
          </div>`
          )
          .join("")}
        <div class="mailgen__field">
          <label for="subject-${topicKey}">Betreff</label>
          <input type="text" id="subject-${topicKey}" />
        </div>
        <div class="mailgen__field">
          <label for="body-${topicKey}">Text</label>
          <textarea id="body-${topicKey}"></textarea>
        </div>
        <p class="mailgen__hint mailgen__reset-row" data-reset-row hidden>Manuell bearbeitet — Änderungen an Name/Feldern oben aktualisieren Betreff/Text jetzt nicht mehr automatisch. <button type="button" class="mailgen__reset-link" data-reset-content>Vorlage neu einsetzen</button></p>
        <p class="mailgen__warning" id="warning-${topicKey}" hidden>${ICONS.flash}<span>Noch nicht ausgefüllt: <strong></strong> — wird sonst als Platzhalter mitkopiert.</span></p>
        <details class="mailgen__signature">
          <summary>Signatur<span class="mailgen__signature-status" id="sig-status-${topicKey}"></span></summary>
          <p class="mailgen__hint">Einmal hinterlegen, gilt für alle Vorlagen in diesem Browser — wird automatisch als Text an jede generierte Mail angehängt (Gmail übernimmt die eigene Signatur beim Öffnen über einen vorausgefüllten Link nicht zuverlässig).</p>
          <textarea id="sig-${topicKey}" data-signature-input rows="4" placeholder="z. B.&#10;Beste Grüße&#10;Angelika Sliwak&#10;Sowespoke"></textarea>
          <div class="mailgen__signature-rich">
            <button class="btn btn--secondary" data-copy-rich-signature="${topicKey}" type="button">${ICONS.copy} Signatur mit Logo kopieren</button>
            <span class="mailgen__status" id="sig-rich-status-${topicKey}">${ICONS.check} Kopiert</span>
          </div>
          <p class="mailgen__hint">Gmails Compose-Link kann keine Bilder/Schriftarten übertragen (harte Grenze, kein Darstellungsfehler) — diese Version landet mit Logo und Verdana-Schrift in der Zwischenablage, danach im Gmail-Fenster einmal manuell mit Strg+V an gewünschter Stelle einfügen.</p>
        </details>
        <div class="mailgen__actions">
          <a class="btn btn--primary" data-send="${topicKey}" href="#" target="_blank" rel="noopener">${ICONS.mail} In Gmail öffnen</a>
          <button class="btn btn--secondary" data-copy="${topicKey}" type="button">${ICONS.copy} In Zwischenablage kopieren</button>
          <span class="mailgen__status" id="status-${topicKey}">${ICONS.check} Kopiert</span>
        </div>
        <div class="mailgen__gmail-send">
          <p class="mailgen__hint"><span class="flash">${ICONS.hourglass} Im Aufbau</span> Direkter Versand über die Gmail-API — verschickt sofort im Hintergrund, ohne Gmail-Compose-Fenster zum letzten Check. Vorschau oben vorher genau prüfen. Die Verbindung zur Gmail-API wird gerade eingerichtet — kann daher noch nicht bei jeder Person zuverlässig funktionieren.</p>
          <div class="mailgen__gmail-send-row">
            <button type="button" class="btn btn--secondary" data-gmail-connect hidden>${ICONS.mail} Mit Gmail verbinden</button>
            <button type="button" class="btn btn--primary" data-gmail-send-btn hidden disabled>${ICONS.mail} Jetzt per Gmail senden</button>
            <span class="mailgen__signature-status" data-gmail-status></span>
          </div>
          <div class="mailgen__gmail-send-row" data-schedule-row hidden>
            <input type="datetime-local" data-gmail-schedule-at aria-label="Zeitpunkt für den terminierten Versand" />
            <button type="button" class="btn btn--secondary" data-gmail-schedule-btn disabled>${ICONS.hourglass} Terminieren</button>
            <span class="mailgen__signature-status" data-schedule-status></span>
          </div>
          <p class="mailgen__hint" data-schedule-link hidden><a href="#/serienmails">${ICONS.hourglass} Geplante Mails ansehen</a></p>
        </div>
        <details class="mailgen__hint-toggle">
          <summary aria-label="Hinweis zum Versand anzeigen">${ICONS.info}</summary>
          <p class="mailgen__hint">„In Gmail öffnen" öffnet ein neues Gmail-Compose-Fenster mit fertig ausgefüllter Nachricht — du prüfst und schickst sie von dort aus ab, sie landet danach ganz normal in deinem Gesendet-Ordner. Bei sehr langem Text lieber „In Zwischenablage kopieren" nutzen.</p>
        </details>
      </div>
    `;
  }

  function wireMailGen(topicKey, extraFields, subjectBase, contentIhr, extra) {
    const nameEl = document.getElementById(`f-${topicKey}-name`);
    const toEl = document.getElementById(`to-${topicKey}`);
    const modeEls = Array.from(view.querySelectorAll(`input[name="mode-${topicKey}"]`));
    const extraInputs = extraFields.map((f) => document.getElementById(`f-${topicKey}-${f.key}`));
    const subjectEl = document.getElementById(`subject-${topicKey}`);
    const bodyEl = document.getElementById(`body-${topicKey}`);
    // Nur ein .mailgen-Block pro Seite (siehe Aufrufstellen von wireMailGen)
    // — view.querySelector() ist hier eindeutig, kein Scoping-Risiko.
    const resetRowEl = view.querySelector("[data-reset-row]");
    const resetBtn = resetRowEl.querySelector("[data-reset-content]");
    // Betreff/Text frei editierbar (2026-08-14, Nutzer-Wunsch) — solange
    // contentDirty false ist, überschreibt fill() beide Felder bei jeder
    // Eingabe weiterhin automatisch aus der Vorlage (bisheriges Verhalten).
    // Sobald jemand direkt in Betreff/Text tippt, wird contentDirty true und
    // fill() lässt die Felder danach in Ruhe, bis "Vorlage neu einsetzen"
    // geklickt wird oder sich der Kontext grundlegend ändert (Anrede-Modus-
    // Wechsel, andere aktive Empfänger-Zeile bei "einzeln").
    let contentDirty = false;
    const warningEl = document.getElementById(`warning-${topicKey}`);
    const copyBtn = view.querySelector(`[data-copy="${topicKey}"]`);
    const sendBtn = view.querySelector(`[data-send="${topicKey}"]`);
    const sigEl = document.getElementById(`sig-${topicKey}`);
    const sigStatusEl = document.getElementById(`sig-status-${topicKey}`);
    const singleFieldsEl = document.getElementById(`single-fields-${topicKey}`);
    const recipientsEl = document.getElementById(`recipients-${topicKey}`);
    const recipRowsEl = recipientsEl.querySelector("[data-recip-rows]");
    const recipAddBtn = recipientsEl.querySelector("[data-recip-add]");
    const recipCsvBtn = recipientsEl.querySelector("[data-recip-csv-btn]");
    const recipCsvInput = recipientsEl.querySelector("[data-recip-csv-input]");
    const recipPreviewLabel = recipientsEl.querySelector("[data-recip-preview-label]");
    const recipWarningEl = recipientsEl.querySelector("[data-recip-warning]");
    const recipLoadBtn = recipientsEl.querySelector("[data-recip-load]");
    const recipSaveStatusEl = recipientsEl.querySelector("[data-recip-save-status]");
    let activeRecipRowId = recipRowsEl.querySelector("[data-recip-row]").dataset.recipRow;
    // Nur ein .mailgen-Block pro Seite (siehe Aufrufstellen von wireMailGen)
    // — view.querySelector() ist hier eindeutig, kein Scoping-Risiko.
    const gmailConnectBtn = view.querySelector("[data-gmail-connect]");
    const gmailSendBtn = view.querySelector("[data-gmail-send-btn]");
    const gmailStatusEl = view.querySelector("[data-gmail-status]");
    const scheduleRowEl = view.querySelector("[data-schedule-row]");
    const scheduleAtInput = view.querySelector("[data-gmail-schedule-at]");
    const scheduleBtn = view.querySelector("[data-gmail-schedule-btn]");
    const scheduleStatusEl = view.querySelector("[data-schedule-status]");
    const scheduleLinkEl = view.querySelector("[data-schedule-link]");
    let gmailConnected = false;
    let lastToAddr = null;

    // Empfänger-Liste dauerhaft UND geräteübergreifend speichern (2026-08-14,
    // Nutzer-Wunsch: "einmal hochladen, bleibt für immer, pro Person
    // einzeln" — bewusst NICHT localStorage wie die Signatur darunter,
    // sondern serverseitig via /api/recipients, an die Login-E-Mail
    // gebunden (functions/api/recipients.js, Cloudflare-KV-Namespace
    // RECIPIENT_LISTS, gleiches Muster wie IDEAS_BOARD bei ideas.js).
    // Automatisches Speichern (debounced, kein Speichern-Button nötig) bei
    // jeder Eingabe sowie beim Hinzufügen/Entfernen einer Zeile.
    let recipSaveTimer;
    async function saveRecipientsToServer() {
      const rows = getRecipRows()
        .map((row) => ({
          name: row.querySelector("[data-recip-name]").value.trim(),
          email: row.querySelector("[data-recip-email]").value.trim(),
        }))
        .filter((r) => r.name || r.email);
      try {
        const res = await fetch("/api/recipients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: rows }),
        });
        if (!res.ok) throw new Error();
        recipSaveStatusEl.textContent = rows.length ? `✓ ${rows.length} gespeichert` : "";
      } catch {
        recipSaveStatusEl.textContent = "Speichern fehlgeschlagen";
      }
    }
    function scheduleRecipientsSave() {
      clearTimeout(recipSaveTimer);
      recipSaveStatusEl.textContent = "Speichert …";
      recipSaveTimer = setTimeout(saveRecipientsToServer, 700);
    }
    async function loadRecipientsFromServer(showEmptyState) {
      try {
        const res = await fetch("/api/recipients");
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        if (!items.length) {
          if (showEmptyState) recipSaveStatusEl.textContent = "Keine gespeicherte Liste vorhanden";
          return items;
        }
        recipSaveStatusEl.textContent = `✓ ${items.length} gespeichert`;
        return items;
      } catch {
        if (showEmptyState) recipSaveStatusEl.textContent = "Laden fehlgeschlagen";
        return [];
      }
    }
    recipLoadBtn.addEventListener("click", async () => {
      const items = await loadRecipientsFromServer(true);
      if (!items.length) return;
      recipRowsEl.innerHTML = items.map((r) => recipientRowHtml(topicKey, crypto.randomUUID(), r)).join("");
      activeRecipRowId = getRecipRows()[0].dataset.recipRow;
      updateRecipHighlight();
      fill();
    });
    // Beim ersten Öffnen der Seite still im Hintergrund prüfen, ob schon
    // eine gespeicherte Liste existiert, damit der Status sofort stimmt,
    // ohne dass man extra auf "Laden" klicken muss, um das zu erfahren.
    loadRecipientsFromServer(false);

    // Signatur ist bewusst EIN geteilter localStorage-Wert für alle
    // Vorlagen (Nutzer-Feedback 2026-08-10: Gmail übernimmt beim Öffnen
    // über einen vorausgefüllten Compose-Link die eigene Signatur nicht
    // zuverlässig) — einmal einrichten, gilt überall.
    const SIGNATURE_KEY = "sowespoke:signature";
    sigEl.value = localStorage.getItem(SIGNATURE_KEY) || "";
    function updateSigStatus() {
      sigStatusEl.textContent = sigEl.value.trim() ? "✓ hinterlegt" : "";
    }
    updateSigStatus();
    sigEl.addEventListener("input", () => {
      localStorage.setItem(SIGNATURE_KEY, sigEl.value);
      updateSigStatus();
      fill();
    });

    // Rich-Signatur mit Logo + Verdana (Nutzer-Feedback 2026-08-10) — der
    // Gmail-Compose-Link selbst kann das nicht transportieren (reiner Text
    // im URL-Parameter, harte Grenze), also über die Zwischenablage als
    // echtes HTML anbieten, das man einmal manuell in Gmail einfügt. Gmails
    // Compose-Fenster ist ein Rich-Text-Editor und übernimmt eingefügtes
    // HTML (Bild, Schriftart) korrekt — nur der automatisierte Link kann
    // das nicht.
    const copyRichBtn = view.querySelector(`[data-copy-rich-signature="${topicKey}"]`);
    const sigRichStatusEl = document.getElementById(`sig-rich-status-${topicKey}`);
    let sigRichTimer;
    copyRichBtn.addEventListener("click", async () => {
      const lines = sigEl.value.split("\n").map((l) => escapeHtml(l)).join("<br>");
      const logoUrl = `${location.origin}/assets/brand/${encodeURIComponent("logo-sowespoke-logo horizontal kleiner.png")}`;
      // Bewusste Ausnahme vom Token-System (Marken-Token-Umstellung,
      // 2026-08-10): dieses HTML landet im Gmail-Compose-Fenster, das
      // keinen Zugriff auf unsere CSS-Variablen hat — Literal-Wert nötig,
      // aktualisiert auf den verifizierten Marken-Ink-Ton (--c-ink).
      const html = `<div style="font-family:Verdana,Geneva,sans-serif;font-size:13px;color:#111111;">
        <img src="${logoUrl}" alt="Sowespoke" height="40" style="display:block;margin-bottom:8px;" />
        ${lines}
      </div>`;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([sigEl.value], { type: "text/plain" }),
          }),
        ]);
        sigRichStatusEl.innerHTML = `${ICONS.check} Kopiert — in Gmail mit Strg+V einfügen`;
      } catch {
        sigRichStatusEl.innerHTML = "Kopieren nicht möglich — Browser unterstützt das nicht";
      }
      sigRichStatusEl.classList.add("is-visible");
      clearTimeout(sigRichTimer);
      sigRichTimer = setTimeout(() => sigRichStatusEl.classList.remove("is-visible"), 3200);
    });

    function parseRecipients(raw) {
      const addrs = raw.split(",").map((a) => a.trim()).filter(Boolean);
      const valid = addrs.every((a) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a));
      return { addrs, valid: addrs.length > 0 && valid };
    }

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // CSV-Import für die Empfänger-Liste (2026-08-14, Nutzer-Wunsch): bewusst
    // ein eigener, kleiner Parser statt einer Library — Trennzeichen wird aus
    // der ersten Zeile geraten (Semikolon vs. Komma, je nachdem was häufiger
    // vorkommt, deckt deutsche Excel-Exporte ab), Kopfzeile wird erkannt,
    // indem geprüft wird, ob überhaupt eine Zelle wie eine E-Mail aussieht.
    function parseCsvLine(line, delimiter) {
      const cells = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
          if (ch === '"') {
            if (line[i + 1] === '"') { cur += '"'; i++; }
            else inQuotes = false;
          } else cur += ch;
        } else if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          cells.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
      cells.push(cur);
      return cells.map((c) => c.trim());
    }
    function parseCsvRecipients(text) {
      const lines = text.split(/\r\n|\r|\n/).map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return { rows: [], skipped: 0 };
      const delimiter = (lines[0].match(/;/g) || []).length > (lines[0].match(/,/g) || []).length ? ";" : ",";
      const firstCells = parseCsvLine(lines[0], delimiter);
      const dataLines = firstCells.some((c) => EMAIL_RE.test(c)) ? lines : lines.slice(1);
      const rows = [];
      let skipped = 0;
      for (const line of dataLines) {
        const cells = parseCsvLine(line, delimiter).filter((c) => c !== "");
        if (!cells.length) continue;
        const emailIdx = cells.findIndex((c) => EMAIL_RE.test(c));
        if (emailIdx === -1) {
          skipped++;
          continue;
        }
        const email = cells[emailIdx];
        const name = cells.find((c, i) => i !== emailIdx) || "";
        rows.push({ name, email });
      }
      return { rows, skipped };
    }

    function getRecipRows() {
      return Array.from(recipRowsEl.querySelectorAll("[data-recip-row]"));
    }
    function getActiveRecipRow() {
      const rows = getRecipRows();
      return rows.find((r) => r.dataset.recipRow === activeRecipRowId) || rows[0];
    }
    function updateRecipHighlight() {
      const active = getActiveRecipRow();
      getRecipRows().forEach((row) => row.classList.toggle("is-active", row === active));
    }
    function updateModeVisibility() {
      const mode = (modeEls.find((r) => r.checked) || {}).value || "single";
      const isEinzeln = mode === "einzeln";
      singleFieldsEl.hidden = isEinzeln;
      recipientsEl.hidden = !isEinzeln;
    }

    // Event-Delegation auf dem Zeilen-Container statt pro-Zeile-Listener —
    // funktioniert automatisch auch für per "+ Empfänger:in hinzufügen"
    // nachträglich eingefügte Zeilen, ohne erneutes Verdrahten.
    recipRowsEl.addEventListener("focusin", (e) => {
      const row = e.target.closest("[data-recip-row]");
      if (!row) return;
      // Nur bei echtem Zeilenwechsel zurücksetzen — sonst würde schon das
      // Klicken ins Namens-/E-Mail-Feld DERSELBEN, bereits aktiven Zeile
      // (die auch ein focusin auslöst) eine gerade laufende manuelle
      // Bearbeitung von Betreff/Text verwerfen.
      if (row.dataset.recipRow !== activeRecipRowId) contentDirty = false;
      activeRecipRowId = row.dataset.recipRow;
      updateRecipHighlight();
      fill();
    });
    recipRowsEl.addEventListener("input", (e) => {
      if (!e.target.closest("[data-recip-row]")) return;
      fill();
      scheduleRecipientsSave();
    });
    recipRowsEl.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-recip-remove]");
      if (!removeBtn) return;
      const rows = getRecipRows();
      if (rows.length <= 1) return; // mindestens eine Zeile muss stehen bleiben
      const row = removeBtn.closest("[data-recip-row]");
      const wasActive = row.dataset.recipRow === activeRecipRowId;
      row.remove();
      if (wasActive) activeRecipRowId = getRecipRows()[0].dataset.recipRow;
      updateRecipHighlight();
      fill();
      scheduleRecipientsSave();
    });
    recipAddBtn.addEventListener("click", () => {
      recipRowsEl.insertAdjacentHTML("beforeend", recipientRowHtml(topicKey, crypto.randomUUID()));
      fill();
    });

    const RECIP_MAX_ROWS = 200; // gleiche Grenze wie die serverseitige Validierung, functions/api/recipients.js
    recipCsvBtn.addEventListener("click", () => recipCsvInput.click());
    recipCsvInput.addEventListener("change", async () => {
      const file = recipCsvInput.files[0];
      recipCsvInput.value = ""; // erlaubt erneutes Auswählen derselben Datei
      if (!file) return;
      const text = await file.text();
      const { rows: parsed, skipped } = parseCsvRecipients(text);
      if (!parsed.length) {
        recipSaveStatusEl.textContent = "Keine gültigen E-Mail-Adressen in der Datei gefunden";
        return;
      }
      const existing = getRecipRows()
        .map((row) => ({
          name: row.querySelector("[data-recip-name]").value.trim(),
          email: row.querySelector("[data-recip-email]").value.trim(),
        }))
        .filter((r) => r.name || r.email);
      const seen = new Set(existing.map((r) => r.email.toLowerCase()).filter(Boolean));
      const added = [];
      for (const r of parsed) {
        const key = r.email.toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        added.push(r);
      }
      const combined = [...existing, ...added].slice(0, RECIP_MAX_ROWS);
      const truncated = existing.length + added.length > RECIP_MAX_ROWS;
      recipRowsEl.innerHTML = combined.map((r) => recipientRowHtml(topicKey, crypto.randomUUID(), r)).join("");
      activeRecipRowId = getRecipRows()[0].dataset.recipRow;
      updateRecipHighlight();
      fill();
      recipSaveStatusEl.textContent = "Speichert …";
      await saveRecipientsToServer();
      const dupSkipped = parsed.length - added.length;
      const parts = [`✓ ${added.length} aus CSV importiert`];
      if (skipped) parts.push(`${skipped} Zeile(n) ohne gültige E-Mail übersprungen`);
      if (dupSkipped) parts.push(`${dupSkipped} bereits vorhanden`);
      if (truncated) parts.push(`Liste auf ${RECIP_MAX_ROWS} gekürzt`);
      recipSaveStatusEl.textContent = parts.join(" · ");
    });

    // Modus "einzeln": jede Zeile bekommt beim Versand ihren eigenen
    // composeMail()-Aufruf im du-Register (toDu() kennt keine Verbformen,
    // siehe Kommentar dort — eine "individuelle" Mail ist deshalb immer
    // du-Register, nie "ihr"). "In Gmail öffnen"/"Kopieren" wirken auf die
    // gerade AKTIVE Zeile (die zuletzt fokussierte) — für jede weitere
    // Person wird die jeweilige Zeile fokussiert und der Button erneut
    // geklickt, exakt wie man zuvor auch einmalig geklickt hat.
    // Aus fill() herausgezogen (2026-08-14, Phase B: Gmail-API-Direktversand)
    // — der "Alle jetzt per Gmail senden"-Lauf im Modus "einzeln" braucht
    // dieselbe Platzhalter-Ersetzung und Betreff/Text-Zusammensetzung pro
    // Empfänger:in, nicht nur für die gerade aktive Vorschau-Zeile.
    function getFilledTemplate() {
      let content = contentIhr;
      let subjectFilled = subjectBase;
      const missing = [];
      extraFields.forEach((f, i) => {
        const val = extraInputs[i].value.trim();
        if (!val) missing.push(f.label);
        content = content.replaceAll(`{${f.key}}`, val || `{${f.key}}`);
        // Bug-Fund (Nutzer-Feedback 2026-08-10): subjectBase lief bisher nie
        // durch dieselbe Ersetzung — ein {Quartal} o. Ä. im Betreff blieb
        // für immer als wörtlicher Platzhalter stehen, z. B. bei "Erinnerung:
        // Konten ohne Änderungen" (subject enthält {Quartal}).
        subjectFilled = subjectFilled.replaceAll(`{${f.key}}`, val || `{${f.key}}`);
      });
      return { content, subjectFilled, missing };
    }
    function composeForName(content, subjectFilled, mode, name) {
      const { subject, body: bodyBase } = composeMail(subjectFilled, content, extra, mode, name);
      const signature = sigEl.value.trim();
      const body = signature ? `${bodyBase}\n\n--\n${signature}` : bodyBase;
      return { subject, body };
    }

    function fill() {
      const mode = (modeEls.find((r) => r.checked) || {}).value || "single";
      const { content, subjectFilled, missing } = getFilledTemplate();

      if (missing.length) {
        warningEl.querySelector("strong").textContent = missing.join(", ");
        warningEl.hidden = false;
        copyBtn.disabled = true;
      } else {
        warningEl.hidden = true;
        copyBtn.disabled = false;
      }

      let previewName = nameEl.value.trim();
      let toAddrForSend = null;
      let ready;

      if (mode === "einzeln") {
        const rows = getRecipRows().map((row) => ({
          row,
          name: row.querySelector("[data-recip-name]").value.trim(),
          email: row.querySelector("[data-recip-email]").value.trim(),
        }));
        const hasInvalidRow = rows.some((r) => (r.email && !EMAIL_RE.test(r.email)) || (!r.email && r.name));
        recipWarningEl.hidden = !hasInvalidRow;

        const activeData = rows.find((r) => r.row === getActiveRecipRow()) || rows[0];
        recipPreviewLabel.textContent = activeData ? `Vorschau für: ${activeData.name || activeData.email || "(neue Zeile)"}` : "";
        previewName = activeData ? activeData.name : "";
        toAddrForSend = activeData && EMAIL_RE.test(activeData.email) ? activeData.email : null;
        ready = !!toAddrForSend && !missing.length;
      } else {
        recipWarningEl.hidden = true;
        // "E-Mail senden" braucht zusätzlich eine gültige Empfänger-Adresse —
        // "In Zwischenablage kopieren" kam schon vorher ohne aus (Nutzer
        // trägt die Adresse dann selbst im E-Mail-Programm ein).
        const { addrs, valid: recipientsValid } = parseRecipients(toEl.value.trim());
        toAddrForSend = recipientsValid ? addrs.join(",") : null;
        ready = recipientsValid && !missing.length;
      }

      if (!contentDirty) {
        const { subject, body } = composeForName(content, subjectFilled, mode === "einzeln" ? "single" : mode, previewName);
        subjectEl.value = subject;
        bodyEl.value = body;
      }
      resetRowEl.hidden = !contentDirty;
      lastToAddr = toAddrForSend;

      sendBtn.classList.toggle("is-disabled", !ready);
      sendBtn.setAttribute("aria-disabled", String(!ready));
      // Gmail-Compose-URL statt mailto: (Nutzer-Feedback 2026-08-10):
      // mailto: geht immer an den vom Betriebssystem registrierten
      // Standard-Handler (unter Windows meist Outlook), unabhängig davon,
      // welchen Mail-Dienst man tatsächlich nutzt. Da der Login hier über
      // Google Workspace läuft, ist Gmail der echte Mail-Dienst aller
      // Nutzer:innen — die Compose-URL öffnet Gmail direkt im Browser-Tab,
      // umgeht das Standard-Handler-Problem komplett.
      // Liest bewusst subjectEl.value/bodyEl.value (nicht die lokalen
      // subject/body-Variablen von oben) — bei contentDirty=true weichen
      // die Feld-Werte vom automatisch generierten Text ab, der Gmail-Link
      // muss die tatsächlich sichtbare, ggf. handbearbeitete Version öffnen.
      //
      // Bug-Fund (2026-08-14, Nutzer-Test): bei mehreren, komma-getrennten
      // Adressen im "to"-Feld öffnete Gmail nur die erste Adresse als
      // Empfänger:in. Ursache: encodeURIComponent() auf die GESAMTE,
      // bereits komma-verbundene Adressliste kodiert auch das trennende
      // Komma zu "%2C" — Gmails eigener Compose-URL-Parser erkennt das
      // offenbar nicht zuverlässig als Trennzeichen zwischen mehreren
      // Empfänger:innen. Fix: jede Adresse EINZELN kodieren, das
      // trennende Komma dazwischen bewusst unkodiert (literal) lassen.
      const toParam = toAddrForSend ? toAddrForSend.split(",").map((a) => encodeURIComponent(a)).join(",") : "";
      sendBtn.href = ready
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${toParam}&su=${encodeURIComponent(subjectEl.value)}&body=${encodeURIComponent(bodyEl.value)}`
        : "#";

      updateGmailSendLabel(mode);
      gmailSendBtn.disabled = !ready;
      scheduleBtn.disabled = !ready || !scheduleAtInput.value;
    }
    nameEl.addEventListener("input", fill);
    toEl.addEventListener("input", fill);
    // Moduswechsel = grundlegend anderer Kontext (anderer Empfängerkreis/
    // Anrede) — eine manuelle Bearbeitung von vorher passt danach meist
    // nicht mehr, deshalb contentDirty zurücksetzen statt sie zu behalten.
    modeEls.forEach((r) => r.addEventListener("change", () => { contentDirty = false; updateModeVisibility(); fill(); }));
    extraInputs.forEach((el) => el.addEventListener("input", fill));
    subjectEl.addEventListener("input", () => { contentDirty = true; fill(); });
    bodyEl.addEventListener("input", () => { contentDirty = true; fill(); });
    resetBtn.addEventListener("click", () => { contentDirty = false; fill(); });
    updateModeVisibility();
    updateRecipHighlight();

    // Phase B (2026-08-14): echter Versand über die Gmail-API, zusätzlich
    // zum bestehenden "In Gmail öffnen"/"Kopieren" (die bleiben unverändert
    // als manueller Weg bestehen). Erfordert einen einmaligen, separaten
    // Zustimmungs-Flow für den gmail.send-Scope (functions/api/auth/gmail/
    // start.js+callback.js) — bewusst NICHT Teil des normalen Logins, damit
    // niemand ungefragt den erweiterten Scope bekommt. Läuft in einem Popup
    // statt per Redirect, weil diese App eine Hash-Router-SPA ist — ein
    // vollständiger Redirect zurück würde den aktuellen Hash-Pfad verlieren.
    function updateGmailSendLabel(mode) {
      gmailSendBtn.innerHTML = mode === "einzeln"
        ? `${ICONS.mail} Alle jetzt per Gmail senden`
        : `${ICONS.mail} Jetzt per Gmail senden`;
    }
    function updateGmailUi() {
      gmailConnectBtn.hidden = gmailConnected;
      gmailSendBtn.hidden = !gmailConnected;
      // Terminieren setzt serverseitig ebenfalls eine bestehende Gmail-
      // Verbindung voraus (siehe functions/api/mail-schedule/jobs.js) — ein
      // Job ohne Verbindung würde beim Fälligwerden zwangsläufig scheitern,
      // deshalb dieselbe Sichtbarkeitsbedingung wie beim Sofortversand.
      scheduleRowEl.hidden = !gmailConnected;
      scheduleLinkEl.hidden = !gmailConnected;
    }
    (async () => {
      try {
        const res = await fetch("/api/gmail/status");
        const data = await res.json();
        gmailConnected = !!data.connected;
      } catch {
        gmailConnected = false;
      }
      updateGmailUi();
    })();
    gmailConnectBtn.addEventListener("click", () => {
      gmailStatusEl.textContent = "Verbindung wird geöffnet …";
      const popup = window.open("/api/auth/gmail/start", "sowespoke-gmail-connect", "width=480,height=640");
      if (!popup) {
        gmailStatusEl.textContent = "Popup wurde blockiert — bitte Popups für diese Seite erlauben";
        return;
      }
      function onMessage(e) {
        if (e.origin !== location.origin || e.data?.source !== "sowespoke-gmail-connect") return;
        cleanup();
        if (e.data.ok) {
          gmailConnected = true;
          updateGmailUi();
          gmailStatusEl.textContent = "✓ Mit Gmail verbunden";
        } else {
          gmailStatusEl.textContent = "Verbindung fehlgeschlagen — bitte erneut versuchen";
        }
      }
      // Falls das Popup ohne Rückmeldung geschlossen wird (Nutzer bricht ab,
      // o. Ä.) — sonst bliebe "Verbindung wird geöffnet …" für immer stehen.
      const pollClosed = setInterval(() => {
        if (popup.closed) cleanup();
      }, 500);
      function cleanup() {
        window.removeEventListener("message", onMessage);
        clearInterval(pollClosed);
      }
      window.addEventListener("message", onMessage);
    });
    async function sendOne(to, subject, body) {
      try {
        const res = await fetch("/api/gmail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to, subject, body }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.error === "not_connected") {
            gmailConnected = false;
            updateGmailUi();
          }
          return false;
        }
        return true;
      } catch {
        return false;
      }
    }
    async function sendAllRows() {
      const { content, subjectFilled, missing } = getFilledTemplate();
      if (missing.length) {
        gmailStatusEl.textContent = `Erst ausfüllen: ${missing.join(", ")}`;
        return;
      }
      const rows = getRecipRows()
        .map((row) => ({
          name: row.querySelector("[data-recip-name]").value.trim(),
          email: row.querySelector("[data-recip-email]").value.trim(),
        }))
        .filter((r) => EMAIL_RE.test(r.email));
      if (!rows.length) {
        gmailStatusEl.textContent = "Keine gültigen Empfänger:innen in der Liste";
        return;
      }
      let sent = 0;
      const failed = [];
      for (const r of rows) {
        gmailStatusEl.textContent = `Sende … (${sent + failed.length + 1}/${rows.length})`;
        const { subject, body } = composeForName(content, subjectFilled, "single", r.name);
        const ok = await sendOne(r.email, subject, body);
        if (ok) sent++;
        else failed.push(r);
      }
      gmailStatusEl.textContent = failed.length
        ? `✓ ${sent} gesendet · ${failed.length} fehlgeschlagen (${failed.map((f) => f.email || f.name).join(", ")})`
        : `✓ ${sent} E-Mail(s) gesendet`;
    }
    gmailSendBtn.addEventListener("click", async () => {
      if (gmailSendBtn.disabled) return;
      const mode = (modeEls.find((r) => r.checked) || {}).value || "single";
      gmailSendBtn.disabled = true;
      if (mode === "einzeln") {
        await sendAllRows();
      } else if (lastToAddr) {
        gmailStatusEl.textContent = "Sende …";
        const ok = await sendOne(lastToAddr, subjectEl.value, bodyEl.value);
        gmailStatusEl.textContent = ok ? "✓ Gesendet" : "Versand fehlgeschlagen";
      }
      gmailSendBtn.disabled = false;
      fill();
    });

    // Phase C (2026-08-14): Terminierung. Der Client komponiert wie beim
    // Sofortversand fertigen Betreff/Text pro Empfänger:in und schickt sie
    // fertig gerendert an /api/mail-schedule/jobs — der Server löst zur
    // Sendezeit KEINE Platzhalter mehr auf, sondern verschickt exakt das,
    // was hier steht (siehe Kommentar in functions/api/mail-schedule/jobs.js).
    scheduleAtInput.addEventListener("input", fill);
    // "Jetzt" als Minimum, damit die Datumsauswahl nicht trivial in die
    // Vergangenheit zeigen kann — der Server prüft das zusätzlich noch
    // einmal (Client-Validierung ist nur Komfort, kein Sicherheitsnetz).
    scheduleAtInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    scheduleBtn.addEventListener("click", async () => {
      if (scheduleBtn.disabled) return;
      const sendAtLocal = scheduleAtInput.value;
      if (!sendAtLocal) return;
      const sendAtIso = new Date(sendAtLocal).toISOString();
      if (new Date(sendAtIso).getTime() <= Date.now()) {
        scheduleStatusEl.textContent = "Zeitpunkt liegt in der Vergangenheit";
        return;
      }
      const mode = (modeEls.find((r) => r.checked) || {}).value || "single";
      scheduleBtn.disabled = true;
      scheduleStatusEl.textContent = "Terminiere …";

      let items;
      if (mode === "einzeln") {
        const { content, subjectFilled, missing } = getFilledTemplate();
        if (missing.length) {
          scheduleStatusEl.textContent = `Erst ausfüllen: ${missing.join(", ")}`;
          scheduleBtn.disabled = false;
          return;
        }
        const rows = getRecipRows()
          .map((row) => ({
            name: row.querySelector("[data-recip-name]").value.trim(),
            email: row.querySelector("[data-recip-email]").value.trim(),
          }))
          .filter((r) => EMAIL_RE.test(r.email));
        items = rows.map((r) => {
          const { subject, body } = composeForName(content, subjectFilled, "single", r.name);
          return { to: r.email, subject, body, sendAt: sendAtIso, label: r.name || r.email };
        });
      } else if (lastToAddr) {
        items = [{ to: lastToAddr, subject: subjectEl.value, body: bodyEl.value, sendAt: sendAtIso, label: nameEl.value.trim() }];
      } else {
        items = [];
      }

      if (!items.length) {
        scheduleStatusEl.textContent = "Keine gültigen Empfänger:innen";
        scheduleBtn.disabled = false;
        return;
      }

      try {
        const res = await fetch("/api/mail-schedule/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Terminieren fehlgeschlagen");
        scheduleStatusEl.innerHTML = `✓ ${data.items.length} ${data.items.length === 1 ? "Mail" : "Mails"} terminiert für ${escapeHtml(formatDateTime(sendAtIso))} — <a href="#/serienmails">ansehen</a>`;
      } catch (err) {
        scheduleStatusEl.textContent = err.message || "Terminieren fehlgeschlagen";
      }
      scheduleBtn.disabled = false;
    });

    fill();

    const statusEl = document.getElementById(`status-${topicKey}`);
    let timer;
    copyBtn.addEventListener("click", async () => {
      const text = `Betreff: ${subjectEl.value}\n\n${bodyEl.value}`;
      if (/\{[^}]+\}/.test(text)) return; // Sicherheitsnetz: nie unausgefüllte Platzhalter kopieren
      try {
        await navigator.clipboard.writeText(text);
        statusEl.innerHTML = `${ICONS.check} Kopiert`;
      } catch {
        statusEl.innerHTML = "Bitte Text manuell markieren und kopieren";
      }
      statusEl.classList.add("is-visible");
      clearTimeout(timer);
      timer = setTimeout(() => statusEl.classList.remove("is-visible"), 2600);
    });
  }

  /* --------------------------------------------------------------- Seite: News */

  let newsCache = null;
  let learnCache = null;
  const isLocalDev = ["localhost", "127.0.0.1"].includes(location.hostname);

  async function loadNews(force) {
    if (newsCache && !force) return newsCache;
    try {
      const res = await fetch("/api/news", { cache: force ? "no-store" : "default" });
      if (!res.ok) {
        newsCache = { error: true, kind: isLocalDev ? "local" : "server", status: res.status };
        return newsCache;
      }
      newsCache = await res.json();
    } catch (err) {
      newsCache = { error: true, kind: isLocalDev ? "local" : "network", message: String((err && err.message) || err) };
    }
    return newsCache;
  }

  async function loadLearn() {
    if (learnCache) return learnCache;
    try {
      const res = await fetch("/api/learn");
      if (!res.ok) {
        learnCache = { error: true, kind: isLocalDev ? "local" : "server", status: res.status };
        return learnCache;
      }
      learnCache = await res.json();
    } catch (err) {
      learnCache = { error: true, kind: isLocalDev ? "local" : "network", message: String((err && err.message) || err) };
    }
    return learnCache;
  }

  async function renderNews(query, channel) {
    const q = (query || "").trim().toLowerCase();
    const ch = channel || "all";
    const channels = ["Microsoft", "Google", "Meta", "TikTok", "Snapchat", "KI", "CRO", "Rechtliches", "Allgemein"];

    view.innerHTML = `
      <section class="hero hero--connected">
        <div class="hero__intro">
          <h1>Neuigkeiten aus der<br>Online-<mark>Marketing-Welt</mark>.</h1>
          <p>Aktuelle Trends, Updates &amp; Insights aus der Online-Marketing-Welt – mit besonderem Fokus auf Microsoft Advertising.</p>
        </div>
        <div class="hero__scene">
          <div class="hero__bubble">Wissen weitergeben.<br>Erfolg vervielfachen.</div>
          <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
        </div>
      </section>
      <div class="toolbar">
        <span class="toolbar__label">Was möchtest du finden?</span>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="News durchsuchen …" value="${escapeHtml(query || "")}" aria-label="News durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
        <nav class="tabs" aria-label="Kanäle">
          <button type="button" class="tabs__item ${ch === "all" ? "is-active" : ""}" data-ch="all">Alle</button>
          ${channels.map((c) => `<button type="button" class="tabs__item ${ch === c ? "is-active" : ""}" data-ch="${c}">${c}</button>`).join("")}
        </nav>
      </div>
      <div class="layout-2col">
        <div class="feed" id="news-feed">
          <h2 class="feed__title">Aktuelle Beiträge</h2>
          <div class="empty-state">${ICONS.news}<strong>Lade News …</strong></div>
        </div>
        <aside class="side-rail">${renderCalendarCard()}${renderRecentCard()}</aside>
      </div>
    `;

    wireTopControls(() => renderNews(document.getElementById("search-input").value, ch), (nextCh) => renderNews(query, nextCh), "ch");

    const data = await loadNews();
    const feed = document.getElementById("news-feed");
    if (!feed) return; // Route hat sich zwischenzeitlich geändert

    if (data.error) {
      const copy = {
        local: {
          title: "News-Feed lokal nicht verfügbar",
          text: "Der automatische News-Feed läuft über eine Cloudflare Pages Function und ist nur im Live-Deployment verfügbar, nicht auf einem lokalen Testserver.",
          retry: false,
        },
        network: {
          title: "News-Feed gerade nicht erreichbar",
          text: "Die Verbindung zum News-Feed ist fehlgeschlagen. Das kann an eurer Internetverbindung liegen oder daran, dass der Dienst kurzzeitig nicht antwortet.",
          retry: true,
        },
        server: {
          title: "News-Feed meldet einen Fehler",
          text: `Der News-Dienst hat mit einem Fehler geantwortet (Status ${data.status || "unbekannt"}). Das ist wahrscheinlich ein vorübergehendes Problem bei einer der Quellen.`,
          retry: true,
        },
      }[data.kind || "network"];

      feed.innerHTML = `
        <h2 class="feed__title">Aktuelle Beiträge</h2>
        <div class="empty-state">
          ${ICONS.news}
          <strong>${copy.title}</strong>
          <p>${copy.text}</p>
          ${copy.retry ? `<button class="btn btn--secondary" id="news-retry" type="button">Erneut versuchen</button>` : ""}
        </div>`;
      const retryBtn = document.getElementById("news-retry");
      if (retryBtn) retryBtn.addEventListener("click", async () => {
        retryBtn.disabled = true;
        retryBtn.textContent = "Lädt …";
        await loadNews(true);
        renderNews(query, ch);
      });
      return;
    }

    let items = data.items || [];
    if (ch !== "all") items = items.filter((i) => i.channel === ch);
    if (q) items = items.filter((i) => [i.title, i.description, i.source].join(" ").toLowerCase().includes(q));

    const failedNotice = data.failedSources && data.failedSources.length
      ? `<p class="feed__notice">${ICONS.flash} ${data.failedSources.length} von ${data.failedSources.length + new Set(items.map((i) => i.source)).size} Quellen gerade nicht erreichbar (${data.failedSources.map((s) => escapeHtml(s.source)).join(", ")}).</p>`
      : "";

    const updatedNotice = data.generatedAt
      ? `<p class="feed__updated">${ICONS.check} Zuletzt aktualisiert um ${formatTime(data.generatedAt)} Uhr</p>`
      : "";

    feed.innerHTML = `
      <h2 class="feed__title">Aktuelle Beiträge${items.length ? `<span class="feed__title__count">${items.length} Ergebnisse</span>` : ""}</h2>
      ${updatedNotice}
      ${failedNotice}
      ${
        items.length
          ? `<ul class="article-list">${items.map(newsRow).join("")}</ul>`
          : `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff oder Kanal.</p></div>`
      }
    `;
    if (items.length) wireNewsRatings(feed);
  }

  function newsRow(item) {
    const chVar = CHANNEL_VAR[item.channel] || "--ink-soft";
    return `
      <li>
        <a class="row" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
          <span class="row__thumb" style="background-color: var(${chVar})">${ICONS.news}</span>
          <span class="row__body">
            <span class="row__meta">
              ${item.pubDate ? `<span class="row__date">— ${formatDate(item.pubDate)}</span>` : ""}
              <span class="row__cat">${escapeHtml(item.source)}</span>
              ${item.translated ? `<span class="flash flash--muted" title="Automatisch aus dem Englischen übersetzt">Übersetzt</span>` : item.lang === "en" ? `<span class="flash flash--muted">EN</span>` : ""}
            </span>
            <span class="row__title">${escapeHtml(item.title)}</span>
            ${item.description ? `<span class="row__summary">${escapeHtml(item.description)}</span>` : ""}
          </span>
          <span class="row__arrow">${ICONS.external}</span>
        </a>
        <div class="row__rate" data-rate-link="${escapeHtml(item.link)}" data-rate-title="${escapeHtml(item.title)}">
          <button type="button" class="row__rate-btn" data-vote="up" aria-label="Relevant, mehr davon">${ICONS.thumbUp}</button>
          <button type="button" class="row__rate-btn" data-vote="down" aria-label="Nicht relevant">${ICONS.thumbDown}</button>
          <span class="row__rate-status" aria-live="polite"></span>
        </div>
      </li>
    `;
  }

  function wireNewsRatings(feed) {
    feed.querySelectorAll(".row__rate").forEach((rateEl) => {
      const link = rateEl.dataset.rateLink;
      const voted = localStorage.getItem(`newsVote:${link}`);
      if (voted) {
        rateEl.querySelector(`[data-vote="${voted}"]`).classList.add("is-voted");
        rateEl.querySelectorAll(".row__rate-btn").forEach((b) => (b.disabled = true));
        const statusEl = rateEl.querySelector(".row__rate-status");
        if (statusEl) statusEl.textContent = voted === "up" ? "Danke für dein Feedback." : "Danke, notiert.";
      }
      rateEl.querySelectorAll(".row__rate-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const vote = btn.dataset.vote;
          rateEl.querySelectorAll(".row__rate-btn").forEach((b) => (b.disabled = true));
          btn.classList.add("is-voted");
          localStorage.setItem(`newsVote:${link}`, vote);
          const statusEl = rateEl.querySelector(".row__rate-status");
          if (statusEl) statusEl.textContent = vote === "up" ? "Danke für dein Feedback." : "Danke, notiert.";
          try {
            await fetch("/api/rate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ link, title: rateEl.dataset.rateTitle, rating: vote }),
            });
          } catch {
            // Stimme bleibt lokal gemerkt, auch wenn der Request fehlschlägt.
          }
        });
      });
    });
  }

  function wireTopControls(onSearch, onTab, tabKey) {
    const input = document.getElementById("search-input");
    if (input) {
      let debounceTimer;
      input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(onSearch, 250);
      });
    }
    const submitBtn = document.getElementById("search-submit");
    if (submitBtn && input) {
      // Suche filtert schon live beim Tippen — der Button ist der visuelle
      // Abschluss aus dem Referenz-Mockup, holt sich per Klick den Fokus.
      submitBtn.addEventListener("click", () => input.focus());
    }
    view.querySelectorAll(".tabs__item").forEach((btn) => {
      btn.addEventListener("click", () => onTab(btn.dataset[tabKey]));
    });
  }

  /* ------------------------------------------------------- Seite: Präsentationen */

  function renderPresentations(query, docType) {
    const q = (query || "").trim().toLowerCase();
    const dt = docType || "all";
    const docTypes = Object.keys(DOCTYPE_VAR);

    let items = [...PRESENTATIONS].sort((a, b) => {
      if (a.dateKnown !== b.dateKnown) return a.dateKnown ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });
    if (dt !== "all") items = items.filter((p) => p.docType === dt);
    if (q) items = items.filter((p) => [p.title, p.summaryDE, p.docType].join(" ").toLowerCase().includes(q));

    view.innerHTML = `
      <section class="hero hero--connected">
        <div class="hero__intro">
          <h1>Offizielle <mark>Microsoft-Präsentationen</mark>.</h1>
          <p>Zusammenfassungen, Beta-/Feature-Guides und Kunden-Mails direkt aus den echten Präsentationsfolien — neueste zuerst, Einträge ohne bekanntes Datum am Ende.</p>
        </div>
        <div class="hero__scene">
          <div class="hero__bubble">Wissen, das<br>weiterbringt!</div>
          <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
        </div>
      </section>
      <div class="toolbar">
        <span class="toolbar__label">Was möchtest du finden?</span>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="Präsentation durchsuchen …" value="${escapeHtml(query || "")}" aria-label="Präsentationen durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
        <nav class="tabs" aria-label="Art">
          <button type="button" class="tabs__item ${dt === "all" ? "is-active" : ""}" data-dt="all">Alle</button>
          ${docTypes.map((d) => `<button type="button" class="tabs__item ${dt === d ? "is-active" : ""}" data-dt="${escapeHtml(d)}">${escapeHtml(d)}</button>`).join("")}
        </nav>
      </div>
      <div class="feed">
        <h2 class="feed__title">Präsentationen${items.length ? `<span class="feed__title__count">${items.length} Ergebnisse</span>` : ""}</h2>
        ${items.length ? presentationList(items) : `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff oder Filter.</p></div>`}
      </div>
      ${renderFactWidget()}
    `;

    wireTopControls(
      () => renderPresentations(document.getElementById("search-input").value, dt),
      (nextDt) => renderPresentations(query, nextDt),
      "dt"
    );
    wireFactWidget();
  }

  function presentationList(items) {
    const knownCount = items.filter((p) => p.dateKnown).length;
    const hasMix = knownCount > 0 && knownCount < items.length;
    let html = `<ul class="article-list">`;
    items.forEach((p, i) => {
      if (hasMix && i === knownCount) html += `<li class="feed__divider" role="presentation">Ohne bekanntes Datum</li>`;
      html += presentationRow(p);
    });
    html += `</ul>`;
    return html;
  }

  function presentationRow(p) {
    const dtVar = DOCTYPE_VAR[p.docType] || "--ink-soft";
    const isNew = p.dateKnown && isRecent(p.date, 21);
    return `
      <li${isNew ? ' class="is-new"' : ""}>
        ${isNew ? `<span class="card-badge card-badge--new">Neu</span>` : ""}
        <a class="row" href="#/praesentationen/${p.id}">
          <span class="row__thumb" style="background-color: var(${dtVar})">${ICONS.fileText}</span>
          <span class="row__body">
            <span class="row__meta">
              ${p.dateKnown ? `<span class="row__date">— ${formatDate(p.date)}</span>` : ""}
              <span class="row__cat">${escapeHtml(p.docType)}</span>
            </span>
            <span class="row__title">${escapeHtml(p.title)}</span>
            <span class="row__summary">${escapeHtml(p.summaryDE.slice(0, 180))}${p.summaryDE.length > 180 ? "…" : ""}</span>
          </span>
          <span class="row__arrow">${ICONS.arrowRight}</span>
        </a>
      </li>
    `;
  }

  function renderPresentationDetail(id) {
    const p = findPresentation(id);
    if (!p) {
      view.innerHTML = `<a class="back-link" href="#/praesentationen">${ICONS.arrowLeft} Zu den Präsentationen</a>
        <div class="empty-state">${ICONS.magnifyEmpty}<strong>Präsentation nicht gefunden</strong></div>`;
      return;
    }
    const dtVar = DOCTYPE_VAR[p.docType] || "--ink-soft";
    const downloadHref = `content/presentations/${encodeURIComponent(p.file)}`;
    // PDF.js-Viewer (self-hosted unter assets/pdfjs/, kein externes CDN) zeigt
    // die Präsentation direkt im Browserfenster an — kein Download, keine
    // Extension nötig. `file` muss die volle absolute URL sein, weil
    // viewer.html relative Pfade sonst zu sich selbst statt zur App auflöst.
    const pdfAbsoluteUrl = `${location.origin}/${downloadHref}`;
    const viewerHref = `assets/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfAbsoluteUrl)}`;
    pushRecent({ href: `#/praesentationen/${p.id}`, title: p.title, kind: "Präsentation" });

    view.innerHTML = `
      <a class="back-link" href="#/praesentationen">${ICONS.arrowLeft} Zu den Präsentationen</a>
      <article class="detail">
        <div class="detail__meta">
          <span class="chip" style="background-color: var(${dtVar})">${escapeHtml(p.docType)}</span>
          <span class="detail__date">— ${p.dateKnown ? formatDate(p.date) + " · " : ""}${p.pageCount} Seiten</span>
        </div>
        <h1>${escapeHtml(p.title)}</h1>
        <div class="detail__body">
          <div class="detail__main">
            <nav class="tabs detail__tabs" aria-label="Ansicht" role="tablist">
              <button type="button" class="tabs__item is-active" data-detail-tab="facts" role="tab" aria-selected="true">Kernfakten</button>
              <button type="button" class="tabs__item" data-detail-tab="pdf" role="tab" aria-selected="false">Original-Präsentation</button>
            </nav>
            <div class="detail__tab-panel" data-detail-panel="facts">
              <div class="info-box">
                <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
                <h2>Kernfakten aus der Präsentation</h2>
                <ul>${p.keyFactsDE.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
              </div>
            </div>
            <div class="detail__tab-panel" data-detail-panel="pdf" hidden>
              <div class="pdf-viewer">
                <div class="pdf-viewer__bar">
                  <span class="pdf-viewer__label">${ICONS.fileText} Original-Präsentation</span>
                  <a class="pdf-viewer__expand" href="${viewerHref}" target="_blank" rel="noopener">${ICONS.arrowRight} Groß öffnen</a>
                </div>
                <iframe class="pdf-viewer__frame" data-src="${viewerHref}" title="${escapeHtml(p.title)}" loading="lazy"></iframe>
              </div>
              <a class="btn btn--secondary" href="${downloadHref}" download>${ICONS.download} Original-PDF herunterladen</a>
            </div>
          </div>
          <div class="detail__side">
            ${renderMailGen(p.id, [], `Neu bei Microsoft Advertising: ${p.title}`, p.customerBlurb, p.emailHookDE)}
          </div>
        </div>
      </article>
    `;

    wireMailGen(p.id, [], `Neu bei Microsoft Advertising: ${p.title}`, p.customerBlurb, p.emailHookDE);
    wireDetailTabs();
  }

  // Tabs statt Stapel (2026-08-14, Nutzer-Feedback: Detailseite wirkte
  // "zu voll geladen" — Kernfakten UND der komplette eingebettete PDF-
  // Viewer standen gleichzeitig sichtbar untereinander, der Viewer war mit
  // Abstand der schwerste Block auf der Seite). Der zusammenfassende
  // Fließtext-Absatz (`.detail__summary`, seit 2026-08-13 nur noch geklammert
  // sichtbar) wurde dabei ganz entfernt statt weiter geklammert — er
  // duplizierte ohnehin nur, was die Kernfakten-Liste besser sagt.
  // Reiner Client-Side-Umschalter (kein renderPresentationDetail-Re-Render
  // beim Tab-Wechsel!) — sonst würde ein Wechsel auf "Original-Präsentation"
  // den Mail-Generator daneben zurücksetzen, falls dort schon getippt wurde.
  // iframe bekommt ihre src erst beim ersten Öffnen des PDF-Tabs (nicht
  // beim Laden der Seite) — PDF.js + die PDF-Datei selbst laden dadurch nur,
  // wenn tatsächlich gebraucht, nicht bei jedem Seitenaufruf.
  function wireDetailTabs() {
    const tabs = view.querySelectorAll("[data-detail-tab]");
    const panels = view.querySelectorAll("[data-detail-panel]");
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const key = tab.dataset.detailTab;
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        panels.forEach((panel) => {
          panel.hidden = panel.dataset.detailPanel !== key;
        });
        if (key === "pdf") {
          const frame = view.querySelector(".pdf-viewer__frame");
          if (frame && !frame.src) frame.src = frame.dataset.src;
        }
      });
    });
  }

  /* ------------------------------------------------------------- Seite: Vorlagen */

  /* Distill (2026-08-13, Nutzer-Wunsch): "Vorlagen" soll nur noch echte
     E-Mail-Vorlagen zeigen — Best Practices (fachliches Nachschlagewissen,
     keine versendbare Mail) sind konzeptionell etwas anderes und standen
     bisher einfach mit auf derselben Seite. Neue Unterkategorie über einen
     zweiten Tab (Muster wie News-Kanäle/Präsentations-Dokumenttyp/Tickets-
     Status — kein neues UI-Konzept), Standard-Tab zeigt ausschließlich
     E-Mail-Vorlagen. */
  function renderTemplates(query, tab) {
    const q = (query || "").trim().toLowerCase();
    const activeTab = tab === "practices" ? "practices" : "mail";

    let bestPractices = BEST_PRACTICES;
    let standalone = STANDALONE_TEMPLATES;
    let linkedTemplates = [...PRESENTATIONS].sort((a, b) => {
      if (a.dateKnown !== b.dateKnown) return a.dateKnown ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });
    if (q) {
      bestPractices = bestPractices.filter((bp) => [bp.title, bp.body].join(" ").toLowerCase().includes(q));
      standalone = standalone.filter((t) => [t.title, t.summary].join(" ").toLowerCase().includes(q));
      linkedTemplates = linkedTemplates.filter((p) => [p.title, p.summaryDE, p.docType].join(" ").toLowerCase().includes(q));
    }
    const noResults = activeTab === "practices" ? !bestPractices.length : !standalone.length && !linkedTemplates.length;

    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1><mark>Vorlagen</mark> &amp; Wissen.</h1>
          <p>E-Mail-Vorlagen zum direkten Versand oder Best Practices zum Nachschlagen — beides an einem Ort, klar getrennt.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
      </section>
      <div class="toolbar">
        <span class="toolbar__label">Was möchtest du finden?</span>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="${activeTab === "practices" ? "Best Practices durchsuchen …" : "E-Mail-Vorlagen durchsuchen …"}" value="${escapeHtml(query || "")}" aria-label="Vorlagen durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
        <nav class="tabs" aria-label="Kategorie">
          <button type="button" class="tabs__item ${activeTab === "mail" ? "is-active" : ""}" data-view="mail">E-Mail-Vorlagen</button>
          <button type="button" class="tabs__item ${activeTab === "practices" ? "is-active" : ""}" data-view="practices">Best Practices</button>
        </nav>
      </div>

      ${noResults ? `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff.</p></div>` : ""}

      ${activeTab === "mail" ? `
      ${standalone.length ? `
      <h2 class="feed__title">Eigenständige Vorlagen<span class="feed__title__count">${standalone.length} Ergebnisse</span></h2>
      <ul class="article-list">
        ${standalone.map(
          (t) => `
          <li>
            <a class="row" href="#/vorlagen/${t.id}">
              <span class="row__thumb" style="background-color: var(--teal)">${ICONS.mail}</span>
              <span class="row__body">
                <span class="row__meta">${t.isPlaceholder ? `<span class="flash flash--muted">Beispiel</span>` : ""}</span>
                <span class="row__title">${escapeHtml(t.title)}</span>
                <span class="row__summary">${escapeHtml(t.summary.slice(0, 180))}${t.summary.length > 180 ? "…" : ""}</span>
              </span>
              <span class="row__arrow">${ICONS.arrowRight}</span>
            </a>
          </li>`
        ).join("")}
      </ul>` : ""}

      ${linkedTemplates.length ? `
      <h2 class="feed__title">Vorlagen aus Präsentationen<span class="feed__title__count">${linkedTemplates.length} Ergebnisse</span></h2>
      <ul class="article-list">
        ${linkedTemplates
          .map(
            (p) => `
          <li>
            <a class="row" href="#/praesentationen/${p.id}">
              <span class="row__thumb" style="background-color: var(${DOCTYPE_VAR[p.docType] || "--ink-soft"})">${ICONS.fileText}</span>
              <span class="row__body">
                <span class="row__meta"><span class="row__cat">${escapeHtml(p.docType)}</span></span>
                <span class="row__title">${escapeHtml(p.title)}</span>
                <span class="row__summary">${escapeHtml(p.summaryDE.slice(0, 180))}${p.summaryDE.length > 180 ? "…" : ""}</span>
              </span>
              <span class="row__arrow">${ICONS.arrowRight}</span>
            </a>
          </li>`
          )
          .join("")}
      </ul>` : ""}
      ` : `
      ${bestPractices.length ? `
      <h2 class="feed__title">Best Practices<span class="feed__title__count">${bestPractices.length} Ergebnisse</span></h2>
      <div class="card-grid">
        ${bestPractices.map(
          (bp, i) => `
          <div class="side-card">
            <span class="side-card__icon" style="background-color: var(${i % 2 ? "--teal" : "--accent"})">${ICONS.flash}</span>
            <h3>${escapeHtml(bp.title)}</h3>
            <p class="pre-line side-card__body">${escapeHtml(bp.body)}</p>
            <button type="button" class="side-card__expand" data-expand>Vollständig anzeigen ${ICONS.arrowRight}</button>
          </div>`
        ).join("")}
      </div>` : ""}
      `}
    `;

    wireTopControls(
      () => renderTemplates(document.getElementById("search-input").value, activeTab),
      (nextView) => renderTemplates(document.getElementById("search-input").value, nextView),
      "view"
    );
    wireBestPracticeCards();
  }

  // Bug-Fund (Nutzer-Screenshot 2026-08-10): Best-Practices-Karten ohne
  // Höhenbegrenzung liefen bei langen Texten beliebig weit runter und
  // sprengten das gleichmäßige Karten-Raster. Clamp per CSS, Button nur
  // einblenden, wenn tatsächlich etwas abgeschnitten wurde (scrollHeight
  // vs. clientHeight — funktioniert unabhängig von der Textlänge, statt
  // eine Zeichen-Grenze zu raten).
  function wireBestPracticeCards() {
    view.querySelectorAll(".side-card").forEach((card) => {
      const body = card.querySelector(".side-card__body");
      const btn = card.querySelector("[data-expand]");
      if (!body || !btn) return;
      if (body.scrollHeight <= body.clientHeight + 2) {
        btn.remove();
        return;
      }
      btn.addEventListener("click", () => {
        const expanded = body.classList.toggle("is-expanded");
        btn.innerHTML = expanded ? `Weniger anzeigen ${ICONS.arrowRight}` : `Vollständig anzeigen ${ICONS.arrowRight}`;
      });
    });
  }

  /* ------------------------------------------------------- Seite: Case Studies */

  function renderCaseStudies(query, channel) {
    const q = (query || "").trim().toLowerCase();
    const ch = channel || "all";
    const channels = [...new Set(CASE_STUDIES.map((c) => c.channel))];

    let items = [...CASE_STUDIES].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (ch !== "all") items = items.filter((c) => c.channel === ch);
    if (q) items = items.filter((c) => [c.title, c.metricHeadline, c.summaryDE, c.client].join(" ").toLowerCase().includes(q));

    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Case <mark>Studies</mark>.</h1>
          <p>Echte Ergebnisse und Testresultate aus den Kundenkonten — laufend gepflegt.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
      </section>
      ${channels.length > 1 ? `
      <div class="toolbar">
        <span class="toolbar__label">Was möchtest du finden?</span>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="Case Studies durchsuchen …" value="${escapeHtml(query || "")}" aria-label="Case Studies durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
        <nav class="tabs" aria-label="Kanal">
          <button type="button" class="tabs__item ${ch === "all" ? "is-active" : ""}" data-ch="all">Alle</button>
          ${channels.map((c) => `<button type="button" class="tabs__item ${ch === c ? "is-active" : ""}" data-ch="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("")}
        </nav>
      </div>` : `
      <div class="toolbar">
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="Case Studies durchsuchen …" value="${escapeHtml(query || "")}" aria-label="Case Studies durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
      </div>`}
      <div class="feed">
        <h2 class="feed__title">Case Studies${items.length ? `<span class="feed__title__count">${items.length} Ergebnisse</span>` : ""}</h2>
        ${
          items.length
            ? `<ul class="article-list">${items.map(caseStudyRow).join("")}</ul>`
            : CASE_STUDIES.length
            ? `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff oder Filter.</p></div>`
            : `<div class="empty-state">${ICONS.trophy}<strong>Noch keine Case Study hinterlegt</strong><p>Sobald Ergebnisse aus einem Kundenkonto dokumentiert sind, erscheinen sie hier.</p></div>`
        }
      </div>
    `;

    wireTopControls(
      () => renderCaseStudies(document.getElementById("search-input").value, ch),
      (nextCh) => renderCaseStudies(query, nextCh),
      "ch"
    );
  }

  function caseStudyRow(c) {
    const chVar = CHANNEL_VAR[c.channel] || "--accent";
    return `
      <li>
        <a class="row" href="#/case-studies/${c.id}">
          <span class="row__thumb" style="background-color: var(${chVar})">${ICONS.trophy}</span>
          <span class="row__body">
            <span class="row__meta">
              <span class="row__date">— ${formatDate(c.date)}</span>
              <span class="row__cat">${escapeHtml(c.client)}</span>
              ${c.isPlaceholder ? `<span class="flash flash--muted">Beispiel</span>` : ""}
            </span>
            <span class="row__title">${escapeHtml(c.metricHeadline)} — ${escapeHtml(c.title)}</span>
            <span class="row__summary">${escapeHtml(c.summaryDE.slice(0, 180))}${c.summaryDE.length > 180 ? "…" : ""}</span>
          </span>
          <span class="row__arrow">${ICONS.arrowRight}</span>
        </a>
      </li>
    `;
  }

  function renderCaseStudyDetail(id) {
    const c = findCaseStudy(id);
    if (!c) {
      view.innerHTML = `<a class="back-link" href="#/case-studies">${ICONS.arrowLeft} Zu den Case Studies</a>
        <div class="empty-state">${ICONS.magnifyEmpty}<strong>Case Study nicht gefunden</strong></div>`;
      return;
    }
    const chVar = CHANNEL_VAR[c.channel] || "--accent";
    pushRecent({ href: `#/case-studies/${c.id}`, title: c.title, kind: "Case Study" });

    view.innerHTML = `
      <a class="back-link" href="#/case-studies">${ICONS.arrowLeft} Zu den Case Studies</a>
      <article class="detail">
        <div class="detail__meta">
          <span class="chip" style="background-color: var(${chVar})">${escapeHtml(c.channel)}</span>
          <span class="detail__date">— ${formatDate(c.date)} · ${escapeHtml(c.client)}</span>
          ${c.isPlaceholder ? `<span class="flash flash--muted">Beispiel</span>` : ""}
        </div>
        <h1>${escapeHtml(c.metricHeadline)} — ${escapeHtml(c.title)}</h1>
        <div class="detail__body">
          <div class="detail__main">
            <p>${escapeHtml(c.summaryDE)}</p>
            <div class="info-box">
              <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
              <h2>Kernfakten</h2>
              <ul>${c.keyFactsDE.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
            </div>
          </div>
          <div class="detail__side">
            ${c.performanceData ? chartCardHtml(c.performanceData) : ""}
          </div>
        </div>
      </article>
    `;

    if (c.performanceData) {
      wireChartCard(c.performanceData);
      wireChartTilesAndSummary(c.performanceData);
    }
  }

  // Performance-Chart-Karte (2026-08-14, Nutzer-Wunsch: Reporting aus dem
  // Microsoft-Konto zeigen, wie sich die Performance nach Einführung eines
  // Beta/Features entwickelt hat, um daraus eine Case Study abzuleiten).
  // Zwei Korrekturrunden am ursprünglichen Entwurf: (1) Tabs sind keine
  // Single-Select-Tabs mehr, sondern Toggle-Buttons für bis zu ZWEI
  // gleichzeitig aktive Kennzahlen ("ROAS und Spend auf der Grafik sehen"),
  // Chart bekommt bei zwei aktiven Kennzahlen eine zweite Y-Achse (unter-
  // schiedliche Einheiten/Skalen, z. B. "x" vs. "€", lassen sich nicht auf
  // einer Achse sinnvoll vergleichen). (2) Die "Vollständige Übersicht"
  // (KPI-Kacheln + Auto-Text) war zunächst ein Modal, ist jetzt fest
  // Bestandteil der Karte — kein Popup mehr. Standard-Bestandteil von
  // renderCaseStudyDetail, nicht nur dieser einen Seite — jede künftige
  // Case Study kann `performanceData` mitliefern.
  function chartCardHtml(perf) {
    const metrics = perf.metrics;
    return `
      <div class="side-card chart-card">
        <div class="chart-card__head">
          <h2>Performance-Entwicklung</h2>
          <p class="chart-card__hint">Bis zu zwei Kennzahlen gleichzeitig vergleichen</p>
          <nav class="tabs chart-card__tabs" role="group" aria-label="Kennzahlen auswählen">
            ${metrics.map((m) => `<button type="button" class="tabs__item" data-chart-metric="${m.key}" aria-pressed="false">${escapeHtml(m.label)}</button>`).join("")}
          </nav>
        </div>
        <div class="chart-card__callouts" id="chart-callouts"></div>
        <div class="chart-card__canvas-wrap"><canvas id="case-study-chart"></canvas></div>
        <p class="chart-card__note">${ICONS.flash} ${escapeHtml(perf.changeLabel)} am ${formatDate(perf.changeDate)} — gestrichelte Linie markiert die Umstellung.</p>

        <div class="chart-card__divider"></div>
        <h3 class="chart-card__section-title">Alle Kennzahlen im Überblick</h3>
        <div class="chart-card__tiles" id="chart-tiles"></div>

        <div class="chart-card__summary">
          <div class="chart-card__summary-head">
            <h3>Automatisch generierte Zusammenfassung</h3>
            <span class="mailgen__status" id="chart-copy-status">${ICONS.check} Kopiert</span>
          </div>
          <p id="chart-summary-text"></p>
          <button type="button" class="btn btn--secondary" id="chart-copy">${ICONS.copy} In Zwischenablage kopieren</button>
        </div>
      </div>
    `;
  }

  // m.plural (Conversions/Impressionen/Klicks) steuert die Verbform — sonst
  // liest sich der Auto-Text falsch ("Impressionen stieg" statt "stiegen").
  function metricClause(stat) {
    const beforeStr = formatMetricValue(stat.m, stat.beforeAvg);
    const afterStr = formatMetricValue(stat.m, stat.afterAvg);
    if (Math.abs(stat.pct) < 5) {
      const bleiben = stat.m.plural ? "blieben" : "blieb";
      return `${stat.m.label} ${bleiben} mit ${beforeStr} → ${afterStr} nahezu stabil`;
    }
    const verb = stat.pct >= 0 ? (stat.m.plural ? "stiegen" : "stieg") : (stat.m.plural ? "sanken" : "sank");
    return `${stat.m.label} ${verb} um ${Math.abs(stat.pct).toFixed(0)} % (${beforeStr} → ${afterStr})`;
  }

  function joinList(arr) {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    return `${arr.slice(0, -1).join(", ")} und ${arr[arr.length - 1]}`;
  }

  // Reiner Text-Baustein aus vorhandenen Zahlen zusammengesetzt (keine
  // KI-Textgenerierung — die App hat keine LLM-Anbindung), aber genau der
  // Text, den man sonst von Hand in eine Case-Study-Zusammenfassung
  // schreiben würde. "Seit der {changeLabel}" setzt grammatisch eine
  // "-ung"-Endung voraus (Autobidding-Umstellung, Einführung, …) — passt zu
  // allen bisherigen und realistisch erwartbaren changeLabel-Werten.
  function generateChangeSummary(perf, stats) {
    const outcome = stats.filter((s) => !s.m.neutral);
    const neutral = stats.filter((s) => s.m.neutral);
    let text = `Seit der ${perf.changeLabel} am ${formatDate(perf.changeDate)} entwickelten sich die wichtigsten Kennzahlen wie folgt: ${joinList(outcome.map(metricClause))}.`;
    if (neutral.length) {
      const neutralText = joinList(neutral.map(metricClause));
      text += ` ${neutralText.charAt(0).toUpperCase()}${neutralText.slice(1)}.`;
    }
    return text;
  }

  // Ersetzt das frühere wireChartModal (2026-08-14) — Kacheln + Auto-Text
  // rendern jetzt einmal beim Laden und bleiben fest sichtbar, kein Öffnen/
  // Schließen, kein Fokus-Trap, kein Maskottchen-Ausblenden mehr nötig.
  function wireChartTilesAndSummary(perf) {
    const tilesEl = view.querySelector("#chart-tiles");
    const summaryEl = view.querySelector("#chart-summary-text");
    const copyBtn = view.querySelector("#chart-copy");
    const copyStatus = view.querySelector("#chart-copy-status");
    if (!tilesEl || !summaryEl) return;
    let copyTimer;

    const stats = perf.metrics.map((m) => computeMetricStat(perf, m));
    tilesEl.innerHTML = stats
      .map((s) => {
        const deltaClass = s.favorable === null ? "" : s.favorable ? "kpi-tile__delta--good" : "kpi-tile__delta--bad";
        const sign = s.pct > 0 ? "+" : "";
        return `
          <div class="kpi-tile">
            <span class="kpi-tile__label">${escapeHtml(s.m.label)}</span>
            <div class="kpi-tile__value-row">
              <strong class="kpi-tile__value">${formatMetricValue(s.m, s.afterAvg)}</strong>
              <span class="kpi-tile__delta ${deltaClass}">${sign}${s.pct.toFixed(0)}%</span>
            </div>
            <span class="kpi-tile__hint">vorher ${formatMetricValue(s.m, s.beforeAvg)}</span>
          </div>
        `;
      })
      .join("");
    summaryEl.textContent = generateChangeSummary(perf, stats);

    copyBtn?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(summaryEl.textContent);
        copyStatus.innerHTML = `${ICONS.check} Kopiert`;
      } catch {
        copyStatus.textContent = "Bitte Text manuell markieren und kopieren";
      }
      copyStatus.classList.add("is-visible");
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => copyStatus.classList.remove("is-visible"), 2600);
    });
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  // de-DE statt .toFixed() (2026-08-14, beim Ergänzen von Impressionen/
  // Klicks nötig geworden) — .toFixed() liefert weder Tausendertrennzeichen
  // ("225000" statt "225.000") noch das im Rest der App durchgängig
  // genutzte Dezimalkomma. Gilt rückwirkend auch für ROAS/CPA/CTR, nicht
  // nur die neuen groß-zahligen Kennzahlen — einheitliches Format, kein
  // Sonderfall pro Kennzahl.
  function formatMetricValue(m, value) {
    const formatted = value.toLocaleString("de-DE", { minimumFractionDigits: m.decimals, maximumFractionDigits: m.decimals });
    return `${m.prefix || ""}${formatted}${m.suffix || ""}`;
  }

  // Vorher/Nachher-Kennwerte EINER Kennzahl — gemeinsame Grundlage für den
  // Callout in der kompakten Chart-Karte UND die KPI-Kacheln im Overlay,
  // damit beide garantiert dieselbe Zahl zeigen statt zwei leicht
  // abweichender Berechnungen zu pflegen.
  function computeMetricStat(perf, m) {
    const changeIndex = m.points.findIndex((p) => p.date >= perf.changeDate);
    const before = m.points.slice(0, changeIndex);
    const after = m.points.slice(changeIndex);
    const avg = (arr) => arr.reduce((s, p) => s + p.value, 0) / arr.length;
    const beforeAvg = avg(before);
    const afterAvg = avg(after);
    const pct = ((afterAvg - beforeAvg) / beforeAvg) * 100;
    // neutral: true (Spend/Impressionen/Klicks) hat keine eindeutige
    // "mehr/weniger ist besser"-Richtung — favorable bleibt null, die
    // Kachel/das Callout färbt dann bewusst nicht ein.
    const favorable = m.neutral ? null : m.lowerIsBetter ? pct < 0 : pct > 0;
    return { m, changeIndex, beforeAvg, afterAvg, pct, favorable };
  }

  // Bis zu zwei gleichzeitig aktive Kennzahlen (2026-08-14, Nutzer-Wunsch:
  // "ROAS und Spend auf der Grafik sehen"). Ein Klick auf eine inaktive
  // Kennzahl fügt sie hinzu (bei bereits zwei aktiven ersetzt sie die
  // älteste); ein Klick auf eine aktive Kennzahl entfernt sie, außer es
  // wäre die letzte verbleibende — ein leerer Chart ist kein sinnvoller
  // Zustand. Bei genau EINER aktiven Kennzahl bleibt die bisherige, fein
  // abgestimmte Vorher/Nachher-Einfärbung erhalten (grau→türkis pro
  // Linien-Segment); bei ZWEI aktiven bekommt jede Kennzahl eine eigene
  // Volltonfarbe + eigene Y-Achse (unterschiedliche Einheiten/Skalen, z. B.
  // "x" vs. "€", lassen sich nicht auf einer gemeinsamen Achse ablesen) und
  // eine Legende, weil Farbe allein die beiden Linien nicht eindeutig genug
  // benennt (WCAG "color-not-only").
  function wireChartCard(perf) {
    const canvas = view.querySelector("#case-study-chart");
    const tabs = [...view.querySelectorAll("[data-chart-metric]")];
    const calloutsEl = view.querySelector("#chart-callouts");
    if (!canvas || typeof Chart === "undefined") return;

    const metrics = perf.metrics;
    const beforeColor = cssVar("--ink-soft");
    const singleColor = cssVar("--turquoise");
    const primaryColor = cssVar("--accent");
    const secondaryColor = cssVar("--turquoise");
    const gridColor = cssVar("--line");
    let chart = null;
    let activeKeys = [metrics[0].key];

    const changeLinePlugin = {
      id: "changeLine",
      afterDraw(c) {
        const idx = c.$changeIndex;
        if (idx == null) return;
        const { ctx, chartArea, scales } = c;
        const x = scales.x.getPixelForValue(idx);
        ctx.save();
        ctx.strokeStyle = beforeColor;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.restore();
      },
    };

    function renderCallouts(activeMetrics, stats) {
      calloutsEl.innerHTML = activeMetrics
        .map((m, i) => {
          const s = stats[i];
          const goodClass = s.favorable === true ? "chart-card__callout--good" : "";
          const swatchColor = activeMetrics.length === 2 ? (i === 0 ? primaryColor : secondaryColor) : singleColor;
          return `
            <span class="chart-card__callout ${goodClass}" style="--callout-swatch: ${swatchColor}">
              ${escapeHtml(m.label)}: ${s.pct > 0 ? "+" : ""}${s.pct.toFixed(0)}% (${formatMetricValue(m, s.beforeAvg)} → ${formatMetricValue(m, s.afterAvg)})
            </span>
          `;
        })
        .join("");
    }

    function renderChart() {
      const activeMetrics = activeKeys.map((k) => metrics.find((m) => m.key === k));
      const stats = activeMetrics.map((m) => computeMetricStat(perf, m));
      const isDual = activeMetrics.length === 2;
      const changeIndex = stats[0].changeIndex;
      const labels = activeMetrics[0].points.map((p) => formatShortDate(p.date));

      renderCallouts(activeMetrics, stats);

      const datasets = activeMetrics.map((m, i) => {
        if (!isDual) {
          return {
            data: m.points.map((p) => p.value),
            borderWidth: 2.5,
            tension: 0.3,
            fill: false,
            pointRadius: 3,
            pointBackgroundColor: (ctx) => (ctx.dataIndex >= changeIndex ? singleColor : beforeColor),
            pointBorderColor: (ctx) => (ctx.dataIndex >= changeIndex ? singleColor : beforeColor),
            segment: { borderColor: (ctx) => (ctx.p1DataIndex <= changeIndex ? beforeColor : singleColor) },
            yAxisID: "y",
          };
        }
        const color = i === 0 ? primaryColor : secondaryColor;
        return {
          label: m.label,
          data: m.points.map((p) => p.value),
          borderWidth: 2.5,
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          borderColor: color,
          backgroundColor: color,
          pointBackgroundColor: color,
          pointBorderColor: color,
          yAxisID: i === 0 ? "y" : "y1",
        };
      });

      const scales = {
        x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 6 }, grid: { color: gridColor } },
        y: {
          position: "left",
          ticks: { callback: (v) => formatMetricValue(activeMetrics[0], v) },
          grid: { color: gridColor },
          title: isDual ? { display: true, text: activeMetrics[0].label, color: primaryColor, font: { weight: "700" } } : undefined,
        },
      };
      if (isDual) {
        scales.y1 = {
          position: "right",
          ticks: { callback: (v) => formatMetricValue(activeMetrics[1], v) },
          grid: { drawOnChartArea: false },
          title: { display: true, text: activeMetrics[1].label, color: secondaryColor, font: { weight: "700" } },
        };
      }

      if (chart) chart.destroy();
      chart = new Chart(canvas, {
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 260 },
          plugins: {
            legend: { display: isDual, position: "top", align: "start", labels: { usePointStyle: true, boxWidth: 8, font: { size: 12 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => `${isDual ? `${ctx.dataset.label}: ` : ""}${formatMetricValue(activeMetrics[ctx.datasetIndex], ctx.parsed.y)}`,
              },
            },
          },
          scales,
        },
        plugins: [changeLinePlugin],
      });
      chart.$changeIndex = changeIndex;
      chart.update();
    }

    function updateTabStates() {
      tabs.forEach((tab) => {
        const idx = activeKeys.indexOf(tab.dataset.chartMetric);
        tab.classList.toggle("chart-card__tab--1", idx === 0);
        tab.classList.toggle("chart-card__tab--2", idx === 1);
        tab.setAttribute("aria-pressed", String(idx !== -1));
      });
    }

    function toggleMetric(key) {
      const idx = activeKeys.indexOf(key);
      if (idx !== -1) {
        if (activeKeys.length > 1) activeKeys.splice(idx, 1);
      } else {
        activeKeys.push(key);
        if (activeKeys.length > 2) activeKeys.shift();
      }
      updateTabStates();
      renderChart();
    }

    updateTabStates();
    renderChart();

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => toggleMetric(tab.dataset.chartMetric));
    });
  }

  /* ------------------------------------------------------------ Seite: Tickets */
  /* Nur Beispieldaten (tickets-data.js, alle isPlaceholder:true) — kein
     Zoho-Desk-API-Zugriff, siehe DESIGN-MASTERPROMPT.md Abschnitt 8
     "Einordnung" (fehlende Org-ID/OAuth-Client). Felder bewusst nah an
     einer echten Zoho-Desk-Antwort, damit ein späterer Umstieg nur
     tickets-data.js ersetzt, nicht das UI. Zeilen sind absichtlich NICHT
     klickbar (kein `.row`-Link-Pattern) — es gibt keine echte Detailseite
     dahinter, ein Link ins Leere wäre eine vorgetäuschte Funktion. */

  // Kritik-Fund (2026-08-11, dual-agent /impeccable critique): --yellow
  // (#FFC600) und --teal (#609274) direkt als Fließtext lagen bei ~1.5:1
  // bzw. ~3.6:1 Kontrast auf Papier — das Projekt hatte dieses Problem für
  // Türkis bereits gelöst (--teal-text), aber hier nicht wiederverwendet.
  // Jetzt konsequent die Text-sicheren Varianten für beide Farben.
  //
  // Nutzer-Entscheidung (2026-08-11, danach): reines Pop-Art-Gelb soll
  // trotzdem sichtbar bleiben, nur eben nicht als Fließtext (dort bleibt
  // Kontrast eine harte Grenze, kein Geschmacksthema). Deshalb `borderVar`
  // getrennt von `var`: `var` bleibt die text-sichere Farbe (Status-Label),
  // `borderVar` ist die volle Pop-Art-Farbe für Flächen/Ränder (Avatar-Rand,
  // Stat-Kachel) — bei "pending" bewusst unterschiedlich, sonst identisch.
  const TICKET_STATUS_META = {
    open: { label: "Offen", var: "--accent", borderVar: "--accent" },
    pending: { label: "In Bearbeitung", var: "--yellow-text", borderVar: "--yellow" },
    completed: { label: "Erledigt", var: "--teal-text", borderVar: "--teal-text" },
    cancelled: { label: "Storniert", var: "--ink-soft", borderVar: "--ink-soft" },
  };
  const TICKET_PRIORITY_META = {
    high: { label: "Hoch", var: "--accent" },
    medium: { label: "Mittel", var: "--yellow-text" },
    low: { label: "Niedrig", var: "--ink-soft" },
  };
  // Systematische statt zufällige Zuweisung (wie CHANNEL_VAR) — dieselben
  // Initialen bekommen immer dieselbe Farbe, statt bei jedem Render zu wechseln.
  // --teal-text statt --teal: weißer Avatar-Text auf rohem --teal maß nur
  // 3.58:1 (Kritik-Fund), die Text-sichere Variante schafft ~5.2:1. Gleicher
  // Grund für --turquoise-text (roh nur ~3.0:1, siehe tokens.css).
  // Auf reine Marken-Farben reduziert (2026-08-14, Nutzer-Feedback zu
  // --cat-*-Farben, die nicht zur Marke passen, UND explizit kein
  // Schwarz/Grau/Weiß für diese Boxen) — --yellow ausgelassen, weil
  // weißer Avatar-Text darauf keinen Kontrast hätte (--on-yellow verlangt
  // dunklen Text, hier aber fest weiß).
  const AVATAR_VAR_CYCLE = ["--accent", "--teal-text", "--turquoise-text"];
  function avatarColorVar(initials) {
    const code = initials.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return AVATAR_VAR_CYCLE[code % AVATAR_VAR_CYCLE.length];
  }

  function ticketRow(t) {
    const status = TICKET_STATUS_META[t.status];
    const prio = TICKET_PRIORITY_META[t.priority];
    return `
      <li class="ticket-row">
        <span class="ticket-row__avatar" aria-hidden="true" style="background-color: var(${avatarColorVar(t.assigneeInitials)}); border-color: var(${status.borderVar})">${escapeHtml(t.assigneeInitials)}</span>
        <span class="ticket-row__body">
          <span class="ticket-row__top">
            <span class="ticket-row__who"><strong>${escapeHtml(t.contactName)}</strong> · ${escapeHtml(t.id)}</span>
            <span class="ticket-row__created">${formatDate(t.createdDate)}</span>
          </span>
          <span class="ticket-row__subject">${escapeHtml(t.subject)}</span>
          <span class="ticket-row__meta">
            <span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Kunde</span>${escapeHtml(t.accountName)}</span>
            <span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Zuständig</span>${escapeHtml(t.assigneeName)}</span>
            <span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Fällig</span>${formatDate(t.dueDate)}</span>
            <span class="ticket-row__status" style="color: var(${status.var})">
              ${t.status === "completed" ? ICONS.check : t.status === "cancelled" ? ICONS.xCircle : t.status === "pending" ? ICONS.hourglass : ICONS.flash}
              ${status.label}
            </span>
            <span class="ticket-row__prio" style="color: var(${prio.var})">${escapeHtml(prio.label)}</span>
          </span>
        </span>
      </li>
    `;
  }

  // Layout-Fund (2026-08-11, /impeccable critique P1): nur nach
  // Erstellungsdatum sortierbar half beim eigentlichen Zweck der Seite
  // (Triage: "was ist gerade dringend?") nicht weiter. Fälligkeit/
  // Priorität als echte Sortier-Optionen statt nur Status-Filter.
  const TICKET_SORTERS = {
    created: (a, b) => new Date(b.createdDate) - new Date(a.createdDate),
    due: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    priority: (a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] - { high: 0, medium: 1, low: 2 }[b.priority]),
  };

  function renderTickets(query, statusFilter, sortBy) {
    const q = (query || "").trim().toLowerCase();
    const st = statusFilter || "all";
    const sort = TICKET_SORTERS[sortBy] ? sortBy : "created";

    let items = [...TICKETS_DATA];
    if (st !== "all") items = items.filter((t) => t.status === st);
    // Kritik-Fund (2026-08-11): assigneeName fehlte hier — "Zuständig"
    // steht sichtbar auf jeder Zeile, eine Suche danach lieferte trotzdem
    // 0 Treffer und der Leerzustand suggerierte fälschlich einen Tippfehler.
    if (q) items = items.filter((t) => [t.subject, t.contactName, t.accountName, t.assigneeName, t.id, t.category].join(" ").toLowerCase().includes(q));
    items.sort(TICKET_SORTERS[sort]);

    const counts = TICKETS_DATA.reduce(
      (acc, t) => {
        acc.all++;
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      },
      { all: 0 }
    );
    const categoryCounts = TICKETS_DATA.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    // Auf reine Marken-Farben umgestellt (2026-08-14, Nutzer-Feedback per
    // Screenshot: Abrechnung/Zugriffsrechte-Chips in Oliv/Rost passten
    // "überhaupt nicht", plus explizit kein Schwarz/Grau/Weiß) — gleicher
    // Drei-Farben-Zyklus wie AVATAR_VAR_CYCLE.
    const catVarCycle = ["--accent", "--teal-text", "--turquoise-text"];

    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Tickets<mark>-Übersicht</mark>.</h1>
          <p>Alle Anfragen von Kundenagenturen an einem Ort. Diese Ansicht zeigt aktuell Beispieldaten — die Anbindung an das echte Ticketsystem folgt.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
      </section>
      <div class="toolbar">
        <span class="toolbar__label">Was möchtest du finden?</span>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="Tickets durchsuchen …" value="${escapeHtml(query || "")}" aria-label="Tickets durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
        <nav class="tabs" aria-label="Status">
          <button type="button" class="tabs__item ${st === "all" ? "is-active" : ""}" data-st="all">Alle<span class="tabs__item-count">${counts.all}</span></button>
          <button type="button" class="tabs__item ${st === "open" ? "is-active" : ""}" data-st="open">Offen<span class="tabs__item-count">${counts.open || 0}</span></button>
          <button type="button" class="tabs__item ${st === "pending" ? "is-active" : ""}" data-st="pending">In Bearbeitung<span class="tabs__item-count">${counts.pending || 0}</span></button>
          <button type="button" class="tabs__item ${st === "completed" ? "is-active" : ""}" data-st="completed">Erledigt<span class="tabs__item-count">${counts.completed || 0}</span></button>
          <button type="button" class="tabs__item ${st === "cancelled" ? "is-active" : ""}" data-st="cancelled">Storniert<span class="tabs__item-count">${counts.cancelled || 0}</span></button>
        </nav>
        <label class="select-field">
          <span class="select-field__label">Sortieren</span>
          <select id="ticket-sort">
            <option value="created" ${sort === "created" ? "selected" : ""}>Neueste zuerst</option>
            <option value="due" ${sort === "due" ? "selected" : ""}>Fälligkeit — bald zuerst</option>
            <option value="priority" ${sort === "priority" ? "selected" : ""}>Priorität — hoch zuerst</option>
          </select>
        </label>
      </div>
      <div class="layout-2col">
        <div class="feed">
          <h2 class="feed__title">Tickets${items.length ? `<span class="feed__title__count">${items.length} Ergebnisse</span>` : ""}<span class="flash flash--muted">Beispieldaten</span></h2>
          ${
            items.length
              ? `<ul class="ticket-list">${items.map(ticketRow).join("")}</ul>`
              : `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff oder Filter.</p></div>`
          }
        </div>
        <aside class="side-rail">
          <div class="ticket-stats">
            <button type="button" class="ticket-stat" style="--stat-color: var(--accent)" data-st="all" title="Alle Tickets anzeigen">
              <span class="ticket-stat__icon">${ICONS.ticket}</span>
              <strong>${counts.all}</strong>
              <span>Alle Tickets</span>
            </button>
            <button type="button" class="ticket-stat" style="--stat-color: var(--yellow); --stat-icon-color: var(--on-yellow)" data-st="pending" title="Nur „In Bearbeitung“ anzeigen">
              <span class="ticket-stat__icon">${ICONS.hourglass}</span>
              <strong>${counts.pending || 0}</strong>
              <span>In Bearbeitung</span>
            </button>
            <button type="button" class="ticket-stat" style="--stat-color: var(--teal)" data-st="completed" title="Nur „Erledigt“ anzeigen">
              <span class="ticket-stat__icon">${ICONS.check}</span>
              <strong>${counts.completed || 0}</strong>
              <span>Erledigt</span>
            </button>
            <button type="button" class="ticket-stat" style="--stat-color: var(--ink-soft)" data-st="cancelled" title="Nur „Storniert“ anzeigen">
              <span class="ticket-stat__icon">${ICONS.xCircle}</span>
              <strong>${counts.cancelled || 0}</strong>
              <span>Storniert</span>
            </button>
          </div>
          <div class="side-card">
            <div class="side-card__illustration">${SIDECARD_ILLUSTRATION}</div>
            <h2>${ICONS.layoutGrid} Top-Kategorien</h2>
            <div class="ticket-cats">
              ${topCategories.map(([cat, count], i) => `<button type="button" class="chip" style="background-color: var(${catVarCycle[i % catVarCycle.length]})" data-cat="${escapeHtml(cat)}" title="Nach „${escapeHtml(cat)}“ filtern">${escapeHtml(cat)} · ${count}</button>`).join("")}
            </div>
          </div>
          <a class="info-box info-box--link" href="#/anfragen">
            <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
            <h2>Eigene Anfrage stellen</h2>
            <p class="pre-line">Du hast selbst ein Anliegen an Microsoft oder ein internes Ticket-Thema? Nutze vorerst unseren bestehenden Anfragen-Bereich.</p>
            <span class="btn btn--primary" style="margin-top: var(--space-4)">${ICONS.mail} Zu den Anfragen</span>
          </a>
        </aside>
      </div>
    `;

    wireTopControls(
      () => renderTickets(document.getElementById("search-input").value, st, sort),
      (nextSt) => renderTickets(query, nextSt, sort),
      "st"
    );
    document.getElementById("ticket-sort").addEventListener("change", (e) => renderTickets(query, st, e.target.value));
    // Stat-Kacheln filtern jetzt echt nach Status (statt nur Anzeige) —
    // dieselbe Statuslogik wie die Tabs, nur ein zweiter, gleichwertiger
    // Einstieg dahin.
    view.querySelectorAll(".ticket-stat").forEach((btn) => {
      btn.addEventListener("click", () => renderTickets(query, btn.dataset.st, sort));
    });
    // Kategorie-Chips filtern über die bestehende Suche (Kategorie ist
    // bereits Teil des Such-Joins) — kein zweiter, paralleler Filter-
    // Mechanismus nötig.
    view.querySelectorAll(".ticket-cats .chip").forEach((btn) => {
      btn.addEventListener("click", () => renderTickets(btn.dataset.cat, st, sort));
    });
  }

  function learnRow(it) {
    return `
        <li>
          <a class="row" href="${escapeHtml(it.url)}" target="_blank" rel="noopener">
            <span class="row__thumb" style="background-color: var(--teal)">${ICONS.external}</span>
            <span class="row__body">
              <span class="row__meta"><span class="row__cat">Microsoft Learn</span></span>
              <span class="row__title">${escapeHtml(it.title || it.label)}</span>
              <span class="row__summary">${escapeHtml(it.description || "")}</span>
            </span>
            <span class="row__arrow">${ICONS.external}</span>
          </a>
        </li>`;
  }

  async function renderMicrosoftLearn(query) {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Von <mark>Microsoft Learn</mark>.</h1>
          <p>Offizielle Kurzbeschreibungen ausgewählter Microsoft-Learn-Seiten, mit Link zur vollständigen Originalseite.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
      </section>
      <div class="feed" id="learn-feed">
        <div class="empty-state">${ICONS.book}<strong>Lade Quellen …</strong></div>
      </div>
    `;

    const learnData = await loadLearn();
    const learnFeed = document.getElementById("learn-feed");
    if (!learnFeed) return;

    if (learnData.error) {
      const copy = {
        local: "Diese Funktion läuft über eine Cloudflare Pages Function und ist auf einem lokalen Testserver nicht verfügbar.",
        network: "Die Verbindung zu den Microsoft-Learn-Quellen ist fehlgeschlagen.",
        server: "Der Dienst hat mit einem Fehler geantwortet — vermutlich vorübergehend.",
      }[learnData.kind || "network"];
      learnFeed.innerHTML = `<div class="empty-state">${ICONS.book}<strong>Gerade nicht verfügbar</strong><p>${copy}</p></div>`;
      return;
    }
    if (!learnData.items || learnData.items.length === 0) {
      learnFeed.innerHTML = `<div class="empty-state">${ICONS.book}<strong>Noch keine Quellen hinterlegt</strong><p>Sobald konkrete Microsoft-Learn-Links hinterlegt sind, erscheinen hier die offiziellen Kurzbeschreibungen mit Link zur Originalseite.</p></div>`;
      return;
    }

    const renderList = (q) => {
      const query = (q || "").trim().toLowerCase();
      const items = query
        ? learnData.items.filter((it) => [it.title || it.label, it.description].join(" ").toLowerCase().includes(query))
        : learnData.items;
      const listHtml = items.length
        ? `<h2 class="feed__title">Quellen<span class="feed__title__count">${items.length} Ergebnisse</span></h2><ul class="article-list">${items.map(learnRow).join("")}</ul>`
        : `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff.</p></div>`;
      learnFeed.innerHTML = `
        <div class="toolbar">
          <label class="search">
            ${ICONS.search}
            <input type="search" id="search-input" placeholder="Microsoft-Learn-Quellen durchsuchen …" value="${escapeHtml(q || "")}" aria-label="Microsoft-Learn-Quellen durchsuchen" />
            <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
          </label>
        </div>
        ${listHtml}
      `;
      wireTopControls(() => renderList(document.getElementById("search-input").value), () => {}, "x");
    };
    renderList(query);
  }

  function renderStandaloneTemplateDetail(id) {
    const t = findStandaloneTemplate(id);
    if (!t) {
      view.innerHTML = `<a class="back-link" href="#/vorlagen">${ICONS.arrowLeft} Zu den Vorlagen</a>
        <div class="empty-state">${ICONS.magnifyEmpty}<strong>Vorlage nicht gefunden</strong></div>`;
      return;
    }
    pushRecent({ href: `#/vorlagen/${t.id}`, title: t.title, kind: "Vorlage" });
    view.innerHTML = `
      <a class="back-link" href="#/vorlagen">${ICONS.arrowLeft} Zu den Vorlagen</a>
      <article class="detail">
        <div class="detail__meta">
          ${t.isPlaceholder ? `<span class="flash flash--muted">Beispiel-Vorlage</span>` : ""}
        </div>
        <h1>${escapeHtml(t.title)}</h1>
        <div class="detail__body">
          <div class="detail__main">
            <p>${escapeHtml(t.summary)}</p>
            <div class="info-box">
        <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
              <h2>Vorlagentext (Referenz)</h2>
              <p class="pre-line info-box__preview">${escapeHtml(t.contentIhr)}</p>
            </div>
          </div>
          <div class="detail__side">
            ${renderMailGen(t.id, t.extraFields || [], t.subject, t.contentIhr, null)}
          </div>
        </div>
      </article>
    `;
    wireMailGen(t.id, t.extraFields || [], t.subject, t.contentIhr, null);
  }

  /* ------------------------------------------------------------- Seite: Ideen */
  /* Neues Ideenboard (2026-08-13, Nutzer-Wunsch nach Referenz-Mockup).
     Echtes Backend (functions/api/ideas.js, Cloudflare KV) statt Demo-Daten
     — bewusste Nutzer-Entscheidung, damit "ist jetzt für das Team sichtbar"
     stimmt, siehe DESIGN.md. Autor:in kommt aus der Session (kein freies
     Namensfeld, siehe Backend-Kommentar), mit bewusst wählbarer
     "Anonym"-Option. Kein Abstimmen/Voting in dieser ersten Fassung
     (Nutzer-Entscheidung: schlanker erster Wurf). */
  function renderIdeas() {
    view.innerHTML = `
      <div class="ideas-page">
      <div class="ideas-team-bg" aria-hidden="true"></div>
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Hast du eine <mark>Idee</mark>? Dann her damit!</h1>
          <p>Teile neue Ansätze, Verbesserungsvorschläge oder kreative Impulse mit dem Team. Jede Idee zählt und wird für alle sichtbar.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-rakete.png" alt="" /></div>
      </section>

      <div class="ideas-layout">
        <form class="side-card idea-form" id="idea-form" novalidate>
          <h2>Neue Idee einreichen</h2>
          <div class="mailgen__field">
            <label for="idea-title">Titel deiner Idee</label>
            <input type="text" id="idea-title" maxlength="120" placeholder="Kurz und treffend formulieren …" required />
          </div>
          <div class="mailgen__field">
            <label for="idea-description">Beschreibe deine Idee</label>
            <textarea id="idea-description" maxlength="1000" rows="4" placeholder="Erzähl uns kurz, worum es geht und was die Idee bringen würde …" required></textarea>
          </div>
          <div class="mailgen__field">
            <label for="idea-benefit">Welchen Nutzen hätte die Idee? (optional)</label>
            <input type="text" id="idea-benefit" maxlength="500" placeholder="Welche Vorteile bringt sie dem Team oder unserer Arbeit?" />
          </div>
          <label class="idea-form__anon">
            <input type="checkbox" id="idea-anonymous" />
            <span>Anonym einreichen</span>
          </label>
          <p class="idea-form__hint" id="idea-author-hint"></p>
          <p class="mailgen__warning" id="idea-form-error" role="alert" hidden>${ICONS.flash}<span></span></p>
          <div class="mailgen__actions">
            <button type="submit" class="btn btn--primary" id="idea-submit">${ICONS.rocket} Idee abschicken</button>
            <span class="mailgen__status" id="idea-submit-status">${ICONS.check} Danke, ist eingereicht!</span>
          </div>
        </form>

        <div class="idea-team-panel">
          <h2 class="feed__title">Ideen aus dem Team<span class="feed__title__count" id="idea-count"></span></h2>
          <div class="idea-team-panel__list" id="idea-list" aria-live="polite">
            <p class="idea-list__status">Lädt …</p>
          </div>
        </div>
      </div>
      </div>
    `;
    wireIdeas();
  }

  // Löschen-Button (2026-08-13, Nutzer-Wunsch: Admin soll Ideen löschen
  // können) nur, wenn isAdmin — serverseitig über functions/_lib/auth.js
  // geprüft (/api/auth/me liefert isAdmin, dieselbe feste Liste sichert
  // auch den DELETE-Endpunkt selbst ab). Frontend zeigt den Button also nur
  // echten Admins, verlässt sich aber nicht allein darauf.
  function ideaCardHtml(idea, i, isAdmin) {
    // Rahmen wechselt bewusst zwischen Magenta und Gelb (2026-08-14,
    // Nutzer-Feedback: "nicht alles rosa auf dieser Seite") — echte
    // Ausnahme von der sonst geltenden Bunte-Rahmen-Regel (Farbe = fester
    // Komponenten-Typ, siehe DESIGN.md), hier bewusst für Abwechslung
    // innerhalb EINER Liste gleichwertiger Karten statt für verschiedene
    // Komponenten-Typen. Icon-Textfarbe folgt mit (--on-yellow auf Gelb,
    // nie Weiß).
    const isYellow = i % 2 === 1;
    const cardColor = isYellow ? "--yellow" : "--accent";
    const iconTextColor = isYellow ? "var(--on-yellow)" : "var(--c-surface)";
    return `
      <div class="side-card idea-card" style="--idea-accent: var(${cardColor}); border-color: var(--idea-accent)">
        <span class="side-card__icon" style="background-color: var(${cardColor}); color: ${iconTextColor}">${ICONS.lightbulb}</span>
        ${isAdmin ? `
        <div class="idea-card__admin" data-idea-admin="${escapeHtml(idea.id)}">
          <button type="button" class="idea-card__delete" data-delete-trigger title="Idee löschen" aria-label="Idee löschen">${ICONS.close}</button>
        </div>` : ""}
        <h3>${escapeHtml(idea.title)}</h3>
        <p class="pre-line side-card__body">${escapeHtml(idea.description)}${idea.benefit ? `\n\nNutzen: ${escapeHtml(idea.benefit)}` : ""}</p>
        <button type="button" class="side-card__expand" data-expand>Vollständig anzeigen ${ICONS.arrowRight}</button>
        <div class="idea-card__meta">
          <span>${escapeHtml(idea.authorLabel === "Anonym" ? "Anonym" : idea.authorLabel.split("@")[0])}</span>
          <span>${formatDate(idea.createdAt)}</span>
        </div>
      </div>`;
  }

  // Inline-Bestätigung statt nativem confirm()/alert() — diese App nutzt an
  // keiner anderen Stelle Browser-Dialoge, ein Löschen-Sonderfall hätte
  // hier einen fremden Interaktions-Stil eingeführt.
  function wireIdeaDeleteButtons(isAdmin) {
    if (!isAdmin) return;
    document.querySelectorAll("[data-idea-admin]").forEach((box) => {
      const id = box.dataset.ideaAdmin;
      box.querySelector("[data-delete-trigger]")?.addEventListener("click", () => {
        box.innerHTML = `
          <span class="idea-card__confirm">Wirklich löschen?
            <button type="button" data-delete-confirm>Ja</button>
            <button type="button" data-delete-cancel>Abbrechen</button>
          </span>`;
        box.querySelector("[data-delete-cancel]").addEventListener("click", () => {
          box.innerHTML = `<button type="button" class="idea-card__delete" data-delete-trigger title="Idee löschen" aria-label="Idee löschen">${ICONS.close}</button>`;
          wireIdeaDeleteButtons(isAdmin);
        });
        box.querySelector("[data-delete-confirm]").addEventListener("click", async (e) => {
          e.target.disabled = true;
          try {
            const res = await fetch(`/api/ideas/${encodeURIComponent(id)}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            loadIdeaList(isAdmin);
          } catch {
            box.innerHTML = `<span class="idea-card__confirm">Löschen fehlgeschlagen.</span>`;
          }
        });
      });
    });
  }

  async function loadIdeaList(isAdmin) {
    const list = document.getElementById("idea-list");
    const count = document.getElementById("idea-count");
    if (!list) return;
    try {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      const items = data.items || [];
      if (data.error && !items.length) {
        list.innerHTML = `<p class="idea-list__status">${escapeHtml(data.error)} — Ideen können aktuell nicht geladen werden.</p>`;
        return;
      }
      if (!items.length) {
        list.innerHTML = `<p class="idea-list__status">Noch keine Ideen eingereicht — sei die erste Person!</p>`;
        if (count) count.textContent = "";
        return;
      }
      list.innerHTML = items.map((idea, i) => ideaCardHtml(idea, i, isAdmin)).join("");
      if (count) count.textContent = `${items.length} ${items.length === 1 ? "Idee" : "Ideen"}`;
      wireBestPracticeCards();
      wireIdeaDeleteButtons(isAdmin);
    } catch {
      list.innerHTML = `<p class="idea-list__status">Ideen konnten nicht geladen werden — später erneut versuchen.</p>`;
    }
  }

  function wireIdeas() {
    const authorHint = document.getElementById("idea-author-hint");
    const anonCheckbox = document.getElementById("idea-anonymous");
    let currentEmail = "";
    let isAdmin = false;
    function updateAuthorHint() {
      if (!authorHint) return;
      authorHint.textContent = anonCheckbox.checked
        ? "Wird ohne deinen Namen eingereicht."
        : currentEmail
        ? `Wird eingereicht als ${currentEmail}.`
        : "";
    }
    anonCheckbox?.addEventListener("change", updateAuthorHint);

    // Erst die Session prüfen (Name fürs Formular, isAdmin fürs Löschen),
    // dann die Liste laden — sonst müsste die Liste nach dem Auth-Check ein
    // zweites Mal neu gerendert werden, nur um Löschen-Buttons nachträglich
    // einzublenden.
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          currentEmail = data.email || "";
          isAdmin = !!data.isAdmin;
        }
      } catch {
        // Hint bleibt leer, Löschen-Buttons bleiben aus, wenn die Abfrage fehlschlägt.
      }
      updateAuthorHint();
      loadIdeaList(isAdmin);
    })();

    const form = document.getElementById("idea-form");
    const errorEl = document.getElementById("idea-form-error");
    const submitBtn = document.getElementById("idea-submit");
    const statusEl = document.getElementById("idea-submit-status");
    let statusTimer;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.hidden = true;
      const title = document.getElementById("idea-title").value.trim();
      const description = document.getElementById("idea-description").value.trim();
      const benefit = document.getElementById("idea-benefit").value.trim();
      const anonymous = anonCheckbox.checked;
      if (!title || !description) {
        errorEl.querySelector("span").textContent = "Titel und Beschreibung sind erforderlich.";
        errorEl.hidden = false;
        return;
      }
      submitBtn.disabled = true;
      try {
        const res = await fetch("/api/ideas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, benefit, anonymous }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Einreichen fehlgeschlagen");
        form.reset();
        updateAuthorHint();
        // Distill (2026-08-14, Nutzer-Wunsch): das vorherige "Danke"-Panel
        // ist weg, an seiner Stelle steht jetzt dauerhaft "Ideen aus dem
        // Team" — Bestätigung läuft stattdessen als kurzer Inline-Status
        // neben dem Button, gleiches Muster wie "Kopiert" beim Mail-
        // Generator (wireMsCopyButton).
        statusEl.classList.add("is-visible");
        clearTimeout(statusTimer);
        statusTimer = setTimeout(() => statusEl.classList.remove("is-visible"), 3200);
        loadIdeaList(isAdmin);
      } catch (err) {
        errorEl.querySelector("span").textContent = err.message || "Einreichen fehlgeschlagen — später erneut versuchen.";
        errorEl.hidden = false;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ------------------------------------------------------ Seite: Serienmails */
  /* Phase C (2026-08-14) — Übersicht der über den Mail-Generator
     terminierten Sendungen (functions/api/mail-schedule/*). Struktur folgt
     bewusst dem bestehenden Tickets-Zeilenmuster (.ticket-row/.ticket-list)
     statt neuer CSS: gleiche Form (Zeile mit Titel/Meta/Status-Pille), nur
     ohne Avatar-Spalte — Wiederverwendung statt Neuerfindung. Status-Farben
     übernehmen 1:1 die Bedeutung aus TICKET_STATUS_META ("pending" = gelb/
     in Bearbeitung, "completed"-Äquivalent = türkis, "braucht Aufmerksamkeit"
     = Akzent-Magenta), keine neue Farbsprache. */

  const SCHEDULE_STATUS_META = {
    pending: { label: "Geplant", var: "--yellow-text", icon: ICONS.hourglass },
    sent: { label: "Gesendet", var: "--teal-text", icon: ICONS.check },
    failed: { label: "Fehlgeschlagen", var: "--accent", icon: ICONS.flash },
  };

  function scheduleRowHtml(job) {
    const meta = SCHEDULE_STATUS_META[job.status] || SCHEDULE_STATUS_META.pending;
    return `
      <li class="ticket-row">
        <span class="ticket-row__body">
          <span class="ticket-row__top">
            <span class="ticket-row__who"><strong>${escapeHtml(job.to)}</strong>${job.label ? ` · ${escapeHtml(job.label)}` : ""}</span>
            <span class="ticket-row__created">${formatDateTime(job.sendAt)}</span>
          </span>
          <span class="ticket-row__subject">${escapeHtml(job.subject)}</span>
          <span class="ticket-row__meta">
            <span class="ticket-row__status" style="color: var(${meta.var})">${meta.icon} ${meta.label}</span>
            ${job.status === "failed" && job.error ? `<span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Fehler</span>${escapeHtml(job.error)}</span>` : ""}
            ${job.status === "pending" ? `<button type="button" class="schedule-row__cancel" data-cancel-job="${escapeHtml(job.id)}">${ICONS.close} Stornieren</button>` : ""}
          </span>
        </span>
      </li>`;
  }

  function renderScheduledMails() {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Geplante <mark>Serienmails</mark>.</h1>
          <p>Über den Mail-Generator terminierte Nachrichten — werden automatisch zum gewählten Zeitpunkt über deine verbundene Gmail-Adresse verschickt.</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-megafon.png" alt="" /></div>
      </section>
      <div class="feed">
        <h2 class="feed__title">Deine geplanten Mails<span class="feed__title__count" id="schedule-count"></span></h2>
        <div id="schedule-list" aria-live="polite"><p class="idea-list__status">Lädt …</p></div>
      </div>
    `;
    wireScheduledMails();
  }

  function wireScheduleCancelButtons() {
    document.querySelectorAll("[data-cancel-job]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          const res = await fetch(`/api/mail-schedule/jobs/${encodeURIComponent(btn.dataset.cancelJob)}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          loadScheduleList();
        } catch {
          btn.disabled = false;
        }
      });
    });
  }

  async function loadScheduleList() {
    const list = document.getElementById("schedule-list");
    const count = document.getElementById("schedule-count");
    if (!list) return;
    try {
      const res = await fetch("/api/mail-schedule/jobs");
      const data = await res.json();
      const items = data.items || [];
      if (data.error && !items.length) {
        list.innerHTML = `<p class="idea-list__status">${escapeHtml(data.error)} — geplante Mails können aktuell nicht geladen werden.</p>`;
        return;
      }
      if (!items.length) {
        list.innerHTML = `<div class="empty-state">${ICONS.hourglass}<strong>Noch keine Mail geplant</strong><p>Im Mail-Generator unten bei "Direkter Versand" ein Datum wählen und auf "Terminieren" klicken.</p></div>`;
        if (count) count.textContent = "";
        return;
      }
      list.innerHTML = `<ul class="ticket-list">${items.map(scheduleRowHtml).join("")}</ul>`;
      if (count) count.textContent = `${items.length} ${items.length === 1 ? "Mail" : "Mails"}`;
      wireScheduleCancelButtons();
    } catch {
      list.innerHTML = `<p class="idea-list__status">Geplante Mails konnten nicht geladen werden — später erneut versuchen.</p>`;
    }
  }

  function wireScheduledMails() {
    loadScheduleList();
  }

  /* --------------------------------------------------- Seite: Nutzungsübersicht */
  /* Nur für Admins (2026-08-14, Nutzer-Wunsch: "sehen wer das nutzt") —
     Server prüft isAdminEmail (functions/api/admin/login-log.js), Frontend
     blendet den Nav-Link zusätzlich nur für Admins ein (siehe IIFE ganz
     unten), reine UX-Höflichkeit, keine echte Zugriffsschranke. Direkter
     URL-Aufruf durch Nicht-Admins zeigt serverseitig korrekt "Keine
     Berechtigung" statt Daten preiszugeben. */

  function loginRowHtml(u) {
    return `
      <li class="ticket-row">
        <span class="ticket-row__body">
          <span class="ticket-row__top">
            <span class="ticket-row__who"><strong>${escapeHtml(u.email)}</strong></span>
            <span class="ticket-row__created">Zuletzt aktiv: ${formatDateTime(u.lastActiveAt || u.lastLoginAt)}</span>
          </span>
          <span class="ticket-row__meta">
            <span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Logins</span>${u.loginCount || 1}</span>
            <span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Letzter Login</span>${formatDateTime(u.lastLoginAt)}</span>
            <span class="ticket-row__meta-item"><span class="ticket-row__meta-label">Erster Login</span>${formatDate(u.firstLoginAt)}</span>
          </span>
        </span>
      </li>`;
  }

  function renderLoginLog() {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <h1>Wer <mark>nutzt</mark> Sowespoke?</h1>
          <p>Nur für Admins sichtbar. "Zuletzt aktiv" aktualisiert sich bei echter Nutzung (höchstens einmal pro Tag), "Letzter Login" nur bei einer neuen Anmeldung (Session hält 14 Tage).</p>
        </div>
        <div class="hero__illustration"><img src="assets/brand/hero-rakete.png" alt="" /></div>
      </section>
      <div class="feed">
        <h2 class="feed__title">Eingeloggte Personen<span class="feed__title__count" id="login-log-count"></span></h2>
        <div id="login-log-list" aria-live="polite"><p class="idea-list__status">Lädt …</p></div>
      </div>
    `;
    wireLoginLog();
  }

  function wireLoginLog() {
    const list = document.getElementById("login-log-list");
    const count = document.getElementById("login-log-count");
    if (!list) return;
    (async () => {
      try {
        const res = await fetch("/api/admin/login-log");
        const data = await res.json();
        if (res.status === 403) {
          list.innerHTML = `<div class="empty-state">${ICONS.xCircle}<strong>Keine Berechtigung</strong><p>Diese Übersicht ist nur für Admins sichtbar.</p></div>`;
          return;
        }
        const items = data.items || [];
        if (!res.ok) {
          list.innerHTML = `<p class="idea-list__status">${escapeHtml(data.error || "Konnte nicht geladen werden")}</p>`;
          return;
        }
        if (!items.length) {
          list.innerHTML = `<div class="empty-state">${ICONS.gauge}<strong>Noch keine Logins protokolliert</strong><p>Sobald sich jemand einloggt, erscheint die Person hier.</p></div>`;
          if (count) count.textContent = "";
          return;
        }
        list.innerHTML = `<ul class="ticket-list">${items.map(loginRowHtml).join("")}</ul>`;
        if (count) count.textContent = `${items.length} ${items.length === 1 ? "Person" : "Personen"}`;
      } catch {
        list.innerHTML = `<p class="idea-list__status">Konnte nicht geladen werden — später erneut versuchen.</p>`;
      }
    })();
  }

  /* ------------------------------------------------ Seite: Microsoft Ads Kontoprüfung */
  /* Interaktiver Prüfassistent für Direct-Manager-/Bill-to-Kontoprüfungen
     (2026-08-20, Nutzer-Wunsch). Fachliche Logik/Texte 1:1 aus einer bereits
     fertigen externen Referenz portiert (React/TSX, useState-Zustandsmaschine)
     — hier auf das in dieser App etablierte Closure-State-plus-manuelles-
     Re-Render-Muster übertragen (gleiches Prinzip wie fill() im Mail-
     Generator, nur für eine mehrstufige Sequenz statt ein einzelnes
     Formular). Läuft komplett im Browser, keine Function/kein KV — "Ergebnis
     kopieren" nutzt dieselbe Zwischenablage-API wie an anderen Stellen der
     App. Visuell ausschließlich bestehende Bausteine (siehe DESIGN.md-
     Eintrag): .side-card für das Prüfprotokoll (3px-Akzent-Rahmen passt
     exakt zur Nutzer-Vorgabe "deutlich sichtbare magentafarbene Kontur"),
     dasselbe Rahmen/Schatten-Vokabular wie .article-list li/.ticket-row für
     die große Fragekarte, .btn für alle Aktionen — keine neue Designwelt.

     Ergebnis-Farben bewusst auf das schon etablierte Dreier-Schema gemappt
     (wie Tickets/Serienmails: --teal-text = erledigt/korrekt, --yellow-text
     = Zwischenzustand/Ausnahme, --accent = braucht Aufmerksamkeit) statt
     neuer Farben — auch Rot/Grün aus der Referenz hätten hier keine echte
     Bedeutung gehabt, die nicht schon durch dieses Schema abgedeckt ist. */

  /* Direct-Manager-Prüfung ist eine Ebenen-Schleife, kein fester
     2-/3-Fragen-Block (Nutzer-Klärung 2026-08-20, anhand realer Microsoft-
     Advertising-Hierarchie-Screenshots: zwischen Agentur-Shell und dem
     tatsächlich geprüften Advertiser-Konto können beliebig viele weitere
     Kunden-/Verwaltungs-MCCs hängen – "es zählt immer die unterste
     Verknüpfung"). Route B ("einzelnes Advertiser-Konto") bleibt bewusst
     einstufig: dort ist das zu prüfende Konto per Definition bereits als
     konkretes Leaf-Konto bekannt, keine Tiefenschleife nötig. Route A
     ("ganze Agentur-Shell") startet immer mit dem SOWESPOKE-Check auf der
     Shell, danach wird nach jeder bestandenen Ebene gefragt, ob darunter
     noch eine weitere Manager-MCC hängt oder das Advertiser-Konto erreicht
     ist – erst bei "das ist das Konto" endet die Schleife. */
  const MSADS_TOP_LEVEL_QUESTION = {
    agency: {
      title: "Agentur-Shell prüfen",
      question: "Ist SOWESPOKE auf der Agentur-Shell als Direct Manager sichtbar?",
      help: "Dabei den Namen SOWESPOKE und die MCC-Nummer kontrollieren.",
      log: "SOWESPOKE ist Direct Manager der Agentur-Shell; MCC-Name und Nummer stimmen.",
    },
    account: {
      title: "Advertiser-Konto prüfen",
      question: "Ist SOWESPOKE auf dem Advertiser-Konto als Direct Manager sichtbar?",
      help: "Dabei den Namen SOWESPOKE und die MCC-Nummer kontrollieren.",
      log: "SOWESPOKE ist Direct Manager des Advertiser-Kontos; MCC-Name und Nummer stimmen.",
    },
  };
  const msadsRecencyQuestion = (subject) => ({
    title: "Reihenfolge prüfen",
    question: `Ist ${subject} bei mehreren Direct Managern auf dieser Ebene der zuletzt verknüpfte?`,
    help: "Entscheidend ist auf derselben Hierarchieebene das jüngste Verknüpfungsdatum.",
    log: `${subject.charAt(0).toUpperCase()}${subject.slice(1)} ist bei Gleichstand zuletzt verknüpft.`,
  });
  /* Nur die oberste (SOWESPOKE↔Agentur-Shell) und die unterste Ebene (die
     mit uns verknüpfte Agentur-MCC↔tatsächliches Advertiser-Konto) werden
     geprüft – dazwischen liegende MCCs sind reine Durchgangsstationen ohne
     eigene Prüfung (Nutzer-Bestätigung 2026-08-20: "es zählt immer die
     unterste Ebene", selbst wenn eine Zwischenebene den falschen Direct
     Manager zeigt). */
  const MSADS_ACCOUNT_LEVEL_QUESTION = {
    title: "Advertiser-Konto prüfen",
    question: "Ist auf dem eigentlichen Advertiser-Konto die mit uns verknüpfte Agentur-MCC als Direct Manager sichtbar?",
    help: "Den Namen der Agentur-MCC und ihre MCC-Nummer prüfen – nicht die SOWESPOKE-Daten. Es muss genau die Shell sein, die mit uns verknüpft ist, nicht eine andere Shell derselben Agentur.",
    log: "Richtige, mit uns verknüpfte Agentur-MCC ist Direct Manager des Advertiser-Kontos; Name und Nummer stimmen.",
  };

  const MSADS_BILLTO_OPTIONS = [
    { id: "customer", title: "Kunde", text: "Der Kunde übernimmt die Rechnung." },
    { id: "current", title: "Richtige / neue Agentur-Shell", text: "Die korrekte beziehungsweise neu erstellte Shell steht im Bill-to." },
    { id: "old", title: "Alte Agentur-Shell", text: "Eine frühere Shell der Agentur steht im Bill-to." },
    { id: "unclear", title: "Andere oder unklare Shell", text: "Der Eintrag lässt sich nicht eindeutig zuordnen." },
  ];

  /* Fristen-Info (Nutzer-Notizen 2026-08-20) – reiner Hinweis, keine
     Ja/Nein-Prüfung: bewertet keine bestehende Verknüpfung, sondern nennt
     den Stichtag für künftiges Handeln. Deshalb als Info-Box im Ergebnis
     gezeigt statt als weitere Frage. */
  const msadsDeadlineNote = (route) =>
    route === "agency"
      ? {
          title: "Frist bei Verknüpfung über eine Agentur-MCC",
          text: "Deadline ist der 20. des Monats. Hier zählt nicht das Linking-Datum, sondern der Eingang der Autorisierung.",
        }
      : {
          title: "Frist bei direkter Verknüpfung mit dem Endkunden-Konto",
          text: "Deadline ist der 30./31. des Monats. Hier zählt das Linking-Datum.",
        };

  function renderMsAdsCheck() {
    view.innerHTML = `
      <div class="msads">
        <section class="hero hero--compact">
          <div class="hero__intro">
            <h1>Microsoft Ads <mark>Kontoprüfung</mark>.</h1>
            <p>Eine Frage nach der anderen – zuerst die Direct-Manager-Verknüpfung, danach der Rechnungsempfänger.</p>
          </div>
        </section>
        <div class="msads-toolbar">
          <a class="btn btn--secondary" href="content/microsoft-ads-kontopruefung/Microsoft_Ads_Kontopruefung_Lernset.pdf" download>${ICONS.download} PDF-Lernset herunterladen</a>
        </div>
        <ol class="msads-progress" data-msads-progress aria-label="Prüffortschritt"></ol>
        <div class="msads-workspace layout-2col">
          <section class="msads-panel" data-msads-panel aria-live="polite"></section>
          <aside class="side-card msads-protocol" data-msads-protocol></aside>
        </div>
        <p class="msads-disclaimer">Interne Prüfhilfe – kein offizielles Microsoft-Produkt. Es werden keine Kontodaten automatisch geändert.</p>
      </div>
    `;
    wireMsAdsCheck();
  }

  function wireMsAdsCheck() {
    const progressEl = document.querySelector("[data-msads-progress]");
    const panelEl = document.querySelector("[data-msads-panel]");
    const protocolEl = document.querySelector("[data-msads-protocol]");

    let stage = "route";
    let route = null;
    let levelQuestions = [];
    let atLeafCheck = false;
    let questionIndex = 0;
    let checks = [];
    let failedQuestion = "";
    let billTo = "";
    let owner = "";
    let result = null;
    let copyTimer;

    const progressLabel = () =>
      route === "agency" ? "Ganze Agentur-Shell" : route === "account" ? "Einzelnes Advertiser-Konto" : "Noch nicht ausgewählt";
    const activeStepNumber = () =>
      stage === "route" ? 1 : stage === "manager" || stage === "manager-error" || stage === "manager-note" ? 2 : 3;

    function buildResultText() {
      if (!result) return "";
      return [
        `Microsoft Advertising Kontoprüfung: ${result.title}`,
        `Prüfweg: ${progressLabel()}`,
        ...checks.map((item) => `✓ ${item}`),
        `Bill-to: ${billTo || "nicht erreicht"}`,
        owner ? `Besitzer: ${owner}` : "",
        result.text,
        ...result.actions.map((item) => `• ${item}`),
      ]
        .filter(Boolean)
        .join("\n");
    }

    function renderProgress() {
      const active = activeStepNumber();
      const labels = ["Prüfweg", "Direct Manager", "Bill-to"];
      progressEl.innerHTML = labels
        .map((label, i) => {
          const number = i + 1;
          const complete = number < active;
          const isActive = number === active;
          return `<li class="msads-progress__step ${isActive ? "is-active" : complete ? "is-complete" : ""}">
            <span class="msads-progress__num">${complete ? ICONS.check : number}</span>
            <small>${escapeHtml(label)}</small>
          </li>`;
        })
        .join("");
    }

    function renderProtocol() {
      protocolEl.innerHTML = `
        <h2>Prüfprotokoll</h2>
        <dl class="msads-protocol__row"><dt>Prüfweg</dt><dd>${escapeHtml(progressLabel())}</dd></dl>
        <div class="msads-protocol__list">
          ${
            checks.length === 0
              ? `<p class="msads-protocol__empty">Noch keine Prüfung bestätigt.</p>`
              : checks.map((item) => `<div class="msads-protocol__item">${ICONS.check}<p>${escapeHtml(item)}</p></div>`).join("")
          }
        </div>
        ${billTo ? `<dl class="msads-protocol__row"><dt>Bill-to</dt><dd>${escapeHtml(billTo)}</dd></dl>` : ""}
        ${owner ? `<dl class="msads-protocol__row"><dt>Besitzer</dt><dd>${escapeHtml(owner)}</dd></dl>` : ""}
        <p class="msads-protocol__note"><strong>Reihenfolge merken:</strong> Direct Manager und MCC zuerst. Bill-to erst nach bestandenem Gate 1.</p>
      `;
    }

    function focusHeading() {
      const heading = panelEl.querySelector("h2");
      if (!heading) return;
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }

    function renderStage() {
      renderProgress();
      renderProtocol();

      if (stage === "route") {
        panelEl.innerHTML = `
          <div class="msads-step-label">SCHRITT 1 VON 3</div>
          <h2>Was wird geprüft?</h2>
          <p class="msads-lead">Wählen Sie den Fall, der im Microsoft-Advertising-Konto tatsächlich vorliegt.</p>
          <div class="msads-choice-grid">
            <button type="button" class="msads-choice-card msads-choice-card--teal" data-msads-route="agency">
              <span class="msads-choice-letter">A</span>
              <span><strong>Ganze Agentur-Shell</strong><small>SOWESPOKE → Agentur-Shell → mehrere Advertiser-Konten</small></span>
            </button>
            <button type="button" class="msads-choice-card msads-choice-card--accent" data-msads-route="account">
              <span class="msads-choice-letter">B</span>
              <span><strong>Einzelnes Advertiser-Konto (Endkunde)</strong><small>SOWESPOKE wird direkt mit einem Konto verknüpft</small></span>
            </button>
          </div>
        `;
        panelEl.querySelectorAll("[data-msads-route]").forEach((btn) => {
          btn.addEventListener("click", () => chooseRoute(btn.dataset.msadsRoute));
        });
      } else if (stage === "manager") {
        const q = levelQuestions[questionIndex];
        const levelLabel = route === "agency" ? (atLeafCheck ? " · ADVERTISER-KONTO" : " · AGENTUR-SHELL") : "";
        panelEl.innerHTML = `
          <div class="msads-step-label">SCHRITT 2 VON 3${levelLabel} · PRÜFUNG ${questionIndex + 1} VON ${levelQuestions.length}</div>
          <h2>${escapeHtml(q.title)}</h2>
          <div class="msads-question-box">
            ${ICONS.info}
            <div><h3>${escapeHtml(q.question)}</h3><p>${escapeHtml(q.help)}</p></div>
          </div>
          <div class="msads-yesno">
            <button type="button" class="btn btn--primary" data-msads-answer="yes">${ICONS.check} Ja, stimmt</button>
            <button type="button" class="btn btn--secondary" data-msads-answer="no">Nein / unklar</button>
          </div>
        `;
        panelEl.querySelector('[data-msads-answer="yes"]').addEventListener("click", () => answerManager(true));
        panelEl.querySelector('[data-msads-answer="no"]').addEventListener("click", () => answerManager(false));
      } else if (stage === "manager-note") {
        panelEl.innerHTML = `
          <div class="msads-step-label">SCHRITT 2 VON 3 · HINWEIS</div>
          <h2>Zusätzliche Kunden-MCC möglich</h2>
          <p class="msads-lead">Zwischen der Agentur-Shell und dem tatsächlichen Advertiser-Konto kann noch eine zusätzliche Kunden-MCC liegen. Das ist normal und wird nicht einzeln geprüft.</p>
          <div class="msads-callout">
            <strong>Falls vorhanden</strong>
            <p>Unabhängig davon, wer dort als Direct Manager steht: einfach bis zum tatsächlichen Advertiser-Konto weitergehen. Es zählt ausschließlich die unterste Ebene.</p>
          </div>
          <div class="msads-yesno">
            <button type="button" class="btn btn--primary" data-msads-continue>Weiter zur Konto-Prüfung</button>
          </div>
        `;
        panelEl.querySelector("[data-msads-continue]").addEventListener("click", continueToLeaf);
      } else if (stage === "manager-error") {
        panelEl.innerHTML = `
          <div class="msads-status-symbol msads-status-symbol--action">${ICONS.flash}</div>
          <div class="msads-step-label msads-step-label--danger">GATE 1 NICHT BESTANDEN</div>
          <h2>Hierarchie zuerst korrigieren</h2>
          <p class="msads-lead">Die Prüfung wurde bei „${escapeHtml(failedQuestion)}" gestoppt. Bill-to wird noch nicht bewertet.</p>
          <div class="msads-callout">
            <strong>Zwei mögliche Wege</strong>
            <ol><li>Die andere Agentur entknüpft sich.</li><li>Die betroffene Agentur-Shell entknüpft sich und verknüpft sich erneut, um die zuletzt verknüpfte zu sein.</li></ol>
          </div>
          <button type="button" class="btn btn--primary" data-msads-reset>Neue Prüfung starten</button>
        `;
        panelEl.querySelector("[data-msads-reset]").addEventListener("click", resetAll);
      } else if (stage === "billto") {
        panelEl.innerHTML = `
          <div class="msads-step-label msads-step-label--success">GATE 1 BESTANDEN · SCHRITT 3 VON 3</div>
          <h2>Wer steht bei „Rechnung an Kunde" / Bill-to?</h2>
          <p class="msads-lead">Wählen Sie den Eintrag genau so, wie er in der Kontenübersicht erscheint.</p>
          <div class="msads-billto-grid">
            ${MSADS_BILLTO_OPTIONS.map(
              (o) => `
              <button type="button" class="msads-billto-card" data-msads-billto="${escapeHtml(o.title)}">
                <span class="msads-radio" aria-hidden="true"></span>
                <span><strong>${escapeHtml(o.title)}</strong><small>${escapeHtml(o.text)}</small></span>
              </button>`
            ).join("")}
          </div>
        `;
        panelEl.querySelectorAll("[data-msads-billto]").forEach((btn) => {
          btn.addEventListener("click", () => chooseBillTo(btn.dataset.msadsBillto));
        });
      } else if (stage === "owner") {
        panelEl.innerHTML = `
          <div class="msads-step-label">BILL-TO · AUSNAHME PRÜFEN</div>
          <h2>Wer ist Besitzer des Kontos?</h2>
          <p class="msads-lead">Eine alte Agentur-Shell ist nur dann als Ausnahme korrekt, wenn genau diese Shell das Konto ursprünglich erstellt hat und als Besitzer eingetragen ist.</p>
          <div class="msads-choice-grid">
            <button type="button" class="msads-choice-card msads-choice-card--teal" data-msads-owner="same">
              <span class="msads-choice-letter">1</span>
              <span><strong>Dieselbe alte Shell</strong><small>Besitzer und Bill-to sind identisch</small></span>
            </button>
            <button type="button" class="msads-choice-card msads-choice-card--action" data-msads-owner="other">
              <span class="msads-choice-letter">2</span>
              <span><strong>Kunde oder neue Agentur-Shell</strong><small>Besitzer und alte Bill-to-Shell sind nicht identisch</small></span>
            </button>
          </div>
        `;
        panelEl.querySelector('[data-msads-owner="same"]').addEventListener("click", () => chooseOwner(true));
        panelEl.querySelector('[data-msads-owner="other"]').addEventListener("click", () => chooseOwner(false));
      } else if (stage === "payment") {
        panelEl.innerHTML = `
          <div class="msads-step-label msads-step-label--danger">BILL-TO NICHT KORREKT</div>
          <h2>Wer soll die Rechnung künftig übernehmen?</h2>
          <p class="msads-lead">Davon hängt die notwendige Korrektur ab.</p>
          <div class="msads-choice-grid">
            <button type="button" class="msads-choice-card msads-choice-card--accent" data-msads-payment="agency">
              <span class="msads-choice-letter">A</span>
              <span><strong>Die Agentur</strong><small>Neue SAP-ID für die neue Agentur-MCC beantragen</small></span>
            </button>
            <button type="button" class="msads-choice-card msads-choice-card--teal" data-msads-payment="customer">
              <span class="msads-choice-letter">K</span>
              <span><strong>Der Kunde</strong><small>Bill-to auf den Kunden ändern</small></span>
            </button>
          </div>
        `;
        panelEl.querySelector('[data-msads-payment="agency"]').addEventListener("click", () => choosePayment(true));
        panelEl.querySelector('[data-msads-payment="customer"]').addEventListener("click", () => choosePayment(false));
      } else if (stage === "result" && result) {
        const kindVar = result.kind === "ok" ? "--teal-text" : result.kind === "exception" ? "--yellow-text" : "--accent";
        const kindIcon = result.kind === "action" ? ICONS.flash : ICONS.check;
        panelEl.innerHTML = `
          <div class="msads-status-symbol" style="color: var(${kindVar})">${kindIcon}</div>
          <div class="msads-step-label" style="color: var(${kindVar})">${escapeHtml(result.eyebrow.toUpperCase())}</div>
          <h2>${escapeHtml(result.title)}</h2>
          <p class="msads-lead">${escapeHtml(result.text)}</p>
          <div class="msads-callout">
            <strong>Nächste Schritte</strong>
            <ul>${result.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            ${
              result.needsSapForm
                ? `<a class="btn btn--secondary" href="content/microsoft-anfragen/${encodeURIComponent("SAP ID Creation Form .docx")}" download>${ICONS.download} SAP-ID-Formular herunterladen</a>`
                : ""
            }
          </div>
          <div class="msads-callout">
            <strong>${escapeHtml(msadsDeadlineNote(route).title)}</strong>
            <p>${escapeHtml(msadsDeadlineNote(route).text)}</p>
          </div>
          ${
            result.kind === "action"
              ? ""
              : `<div class="msads-callout">
            <strong>Kontoklärungsliste</strong>
            <p>Dieses Konto ist korrekt verknüpft. Steht es trotzdem auf der Kontoklärungsliste, die wir von Microsoft erhalten (aus Microsofts Sicht falsch verknüpfte Konten ohne Spend-Zurechnung): über Elina bei Microsoft flaggen, sie gibt es an Anne-Celine weiter.</p>
          </div>`
          }
          <div class="msads-yesno">
            <button type="button" class="btn btn--primary" data-msads-copy>${ICONS.copy} Ergebnis kopieren</button>
            <button type="button" class="btn btn--secondary" data-msads-reset>Neue Prüfung</button>
            <span class="mailgen__status" data-msads-copy-status>${ICONS.check} Kopiert</span>
          </div>
        `;
        panelEl.querySelector("[data-msads-reset]").addEventListener("click", resetAll);
        panelEl.querySelector("[data-msads-copy]").addEventListener("click", copyResult);
      }

      focusHeading();
    }

    function chooseRoute(value) {
      route = value;
      checks = [];
      atLeafCheck = value === "account";
      levelQuestions = [MSADS_TOP_LEVEL_QUESTION[value], msadsRecencyQuestion("SOWESPOKE")];
      questionIndex = 0;
      stage = "manager";
      renderStage();
    }

    function answerManager(answer) {
      const q = levelQuestions[questionIndex];
      if (!q) return;
      if (!answer) {
        failedQuestion = q.title;
        stage = "manager-error";
        renderStage();
        return;
      }
      checks = [...checks, q.log];
      if (questionIndex + 1 < levelQuestions.length) {
        questionIndex += 1;
      } else if (route === "account" || atLeafCheck) {
        stage = "billto";
      } else {
        stage = "manager-note";
      }
      renderStage();
    }

    /* Zwischen Agentur-Shell und dem tatsächlichen Advertiser-Konto kann
       höchstens eine zusätzliche Kunden-MCC liegen, kein beliebig tiefer
       Baum – deshalb ein einmaliger Hinweis statt einer wiederholbaren
       Schleife (Nutzer-Korrektur 2026-08-20: das mehrfach anklickbare
       "weitere Ebene"-Muster suggerierte fälschlich unbegrenzte Tiefe). */
    function continueToLeaf() {
      atLeafCheck = true;
      levelQuestions = [MSADS_ACCOUNT_LEVEL_QUESTION, msadsRecencyQuestion("unsere verknüpfte Agentur-MCC")];
      questionIndex = 0;
      stage = "manager";
      renderStage();
    }

    function chooseBillTo(value) {
      billTo = value;
      if (value === "Kunde") {
        result = {
          kind: "ok",
          eyebrow: "Prüfung bestanden",
          title: "Korrekt",
          text: "Der Kunde ist Rechnungsempfänger und übernimmt die Rechnung.",
          actions: ["Ergebnis dokumentieren und das geprüfte Konto flaggen."],
        };
        stage = "result";
      } else if (value === "Richtige / neue Agentur-Shell") {
        result = {
          kind: "ok",
          eyebrow: "Prüfung bestanden",
          title: "Korrekt nach Datenabgleich",
          text: "Die richtige beziehungsweise neu erstellte Agentur-Shell ist Rechnungsempfänger.",
          actions: ["MCC-Name, MCC-Nummer und SAP-ID der Shell dokumentieren.", "Geprüftes Konto flaggen."],
        };
        stage = "result";
      } else if (value === "Alte Agentur-Shell") {
        stage = "owner";
      } else {
        owner = "Nicht eindeutig";
        stage = "payment";
      }
      renderStage();
    }

    function chooseOwner(isSameOldShell) {
      if (isSameOldShell) {
        owner = "Dieselbe alte Agentur-Shell";
        result = {
          kind: "exception",
          eyebrow: "Zulässige Ausnahme",
          title: "Ausnahme: korrekt",
          text: "Dieselbe alte Shell ist Besitzer und Bill-to. Das ist plausibel, wenn sie das Konto ursprünglich erstellt hat.",
          actions: ["Ownership und Bill-to gemeinsam dokumentieren.", "Geprüftes Konto als Ausnahme flaggen."],
        };
        stage = "result";
      } else {
        owner = "Kunde oder neue Agentur-Shell";
        stage = "payment";
      }
      renderStage();
    }

    function choosePayment(agencyPays) {
      result = {
        kind: "action",
        eyebrow: "Korrektur erforderlich",
        title: "Noch nicht korrekt",
        text: agencyPays
          ? "Die Agentur soll zahlen, aber die passende neue Agentur-Shell ist noch nicht sauber im Billing hinterlegt."
          : "Der Kunde soll zahlen, steht aber noch nicht als Rechnungsempfänger im Bill-to.",
        actions: agencyPays
          ? [
              "Neue SAP-ID für die neue Agentur-MCC über Anne-Celine beantragen.",
              "Sobald die SAP-ID freigegeben ist: im Konto umstellen.",
              "Danach Bill-to und SAP-ID erneut prüfen.",
            ]
          : ["Bill-to auf den Kunden ändern.", "Danach die Prüfung erneut durchführen."],
        needsSapForm: agencyPays,
      };
      stage = "result";
      renderStage();
    }

    function resetAll() {
      stage = "route";
      route = null;
      levelQuestions = [];
      atLeafCheck = false;
      questionIndex = 0;
      checks = [];
      failedQuestion = "";
      billTo = "";
      owner = "";
      result = null;
      renderStage();
    }

    async function copyResult() {
      const statusEl = panelEl.querySelector("[data-msads-copy-status]");
      try {
        await navigator.clipboard.writeText(buildResultText());
        statusEl.innerHTML = `${ICONS.check} Kopiert`;
      } catch {
        statusEl.textContent = "Kopieren nicht möglich";
      }
      statusEl.classList.add("is-visible");
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => statusEl.classList.remove("is-visible"), 2200);
    }

    renderStage();
  }

  /* ------------------------------------------------------- Zuletzt angesehen */

  const RECENT_KEY = "sowespoke-recent";
  // Auf 2 Einträge gekürzt (2026-08-14, Nutzer-Feedback: "reicht auch nur
  // zwei Positionen") — war vorher 5, wirkte als eigene lange Liste neben
  // der Sidebar zu dominant für einen reinen Schnellzugriff.
  const RECENT_LIMIT = 2;

  function pushRecent(entry) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { list = []; }
    list = list.filter((e) => e.href !== entry.href);
    list.unshift(entry);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_LIMIT)));
  }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
  }

  function renderRecentCard() {
    // .slice() zusätzlich zum Kürzen beim Speichern — schützt auch gegen
    // altes localStorage mit noch bis zu 5 Einträgen aus der Zeit vor
    // RECENT_LIMIT.
    const items = getRecent().slice(0, RECENT_LIMIT);
    if (!items.length) return "";
    return `
      <div class="side-card">
        <div class="side-card__illustration">${SIDECARD_ILLUSTRATION}</div>
        <h2>${ICONS.book} Zuletzt angesehen</h2>
        <ul class="side-card__list">
          ${items.map((e) => `<li><a href="${e.href}" class="side-card__recent"><strong>${escapeHtml(e.title)}</strong><p>${escapeHtml(e.kind)}</p></a></li>`).join("")}
        </ul>
      </div>
    `;
  }

  /* -------------------------------------------------------- Tastenkürzel */

  document.addEventListener("keydown", (e) => {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const input = document.getElementById("search-input");
    if (input) {
      e.preventDefault();
      input.focus();
    }
  });

  /* ------------------------------------------------------------ Routing */

  function currentRoute() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = hash.split("?");
    const params = new URLSearchParams(qs || "");
    return { path, params };
  }

  function updateNav(path) {
    railLinks.forEach((a) => {
      const active =
        (a.dataset.nav === "news" && path === "/") ||
        (a.dataset.nav === "praesentationen" && path.startsWith("/praesentationen")) ||
        (a.dataset.nav === "vorlagen" && path.startsWith("/vorlagen")) ||
        (a.dataset.nav === "case-studies" && path.startsWith("/case-studies")) ||
        (a.dataset.nav === "tickets" && path.startsWith("/tickets")) ||
        (a.dataset.nav === "microsoft-learn" && path.startsWith("/microsoft-learn")) ||
        (a.dataset.nav === "anfragen" && path.startsWith("/anfragen")) ||
        (a.dataset.nav === "ideen" && path.startsWith("/ideen")) ||
        (a.dataset.nav === "serienmails" && path.startsWith("/serienmails")) ||
        (a.dataset.nav === "nutzer" && path.startsWith("/nutzer")) ||
        (a.dataset.nav === "microsoft-ads-kontopruefung" && path.startsWith("/microsoft-ads-kontopruefung"));
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    // Untermenü automatisch aufklappen, wenn die aktuelle Route zur Gruppe
    // gehört (z. B. direkt auf #/serienmails gelandet) — klappt aber nie
    // von allein wieder zu, wenn man weiternavigiert (kein nervöses
    // Zuspringen; manuelles Zuklappen bleibt der Person selbst überlassen).
    navGroups.forEach((group) => {
      const belongsToGroup = Array.from(group.querySelectorAll("[data-nav]")).some((a) => path.startsWith(`/${a.dataset.nav}`));
      if (belongsToGroup) {
        group.querySelector("[data-nav-toggle]").setAttribute("aria-expanded", "true");
        group.querySelector("[data-nav-sub]").classList.add("is-expanded");
      }
    });
  }

  function renderNotFound(path) {
    view.innerHTML = `
      <div class="empty-state">
        ${ICONS.magnifyEmpty}
        <strong>Seite nicht gefunden</strong>
        <p>Für "${escapeHtml(path)}" gibt es hier nichts — vermutlich ein veralteter oder falsch getippter Link.</p>
        <a class="btn btn--secondary" href="#/">${ICONS.home} Zur Startseite</a>
      </div>`;
  }

  function render() {
    const { path, params } = currentRoute();
    updateNav(path);
    updateMascotForRoute(path);

    if (path === "/") {
      renderNews(params.get("q") || "", params.get("ch") || "all");
    } else if (path.startsWith("/praesentationen/")) {
      renderPresentationDetail(path.slice("/praesentationen/".length));
    } else if (path === "/praesentationen") {
      renderPresentations(params.get("q") || "", params.get("dt") || "all");
    } else if (path.startsWith("/vorlagen/")) {
      renderStandaloneTemplateDetail(path.slice("/vorlagen/".length));
    } else if (path === "/vorlagen") {
      renderTemplates(params.get("q") || "", params.get("t") || "mail");
    } else if (path.startsWith("/case-studies/")) {
      renderCaseStudyDetail(path.slice("/case-studies/".length));
    } else if (path === "/case-studies") {
      renderCaseStudies(params.get("q") || "", params.get("ch") || "all");
    } else if (path === "/tickets") {
      renderTickets(params.get("q") || "", params.get("st") || "all", params.get("sort") || "created");
    } else if (path === "/microsoft-learn") {
      renderMicrosoftLearn(params.get("q") || "");
    } else if (path.startsWith("/anfragen/")) {
      renderMicrosoftRequestDetail(path.slice("/anfragen/".length));
    } else if (path === "/anfragen") {
      renderMicrosoftRequestsHub();
    } else if (path === "/ideen") {
      renderIdeas();
    } else if (path === "/serienmails") {
      renderScheduledMails();
    } else if (path === "/nutzer") {
      renderLoginLog();
    } else if (path === "/microsoft-ads-kontopruefung") {
      renderMsAdsCheck();
    } else {
      renderNotFound(path);
    }
    // Beim allerersten Laden Fokus nicht stehlen — sonst ist der
    // Skip-Link per Tab nie erreichbar. Bei echter Navigation (Klick,
    // hashchange) ist das Fokus-Verschieben auf den neuen Inhalt dagegen
    // gewünscht (Screenreader-Nutzer sollen wissen, dass sich was ändert).
    if (!isInitialRender) view.focus({ preventScroll: true });
    isInitialRender = false;
  }

  let isInitialRender = true;
  window.addEventListener("hashchange", render);
  render();

  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      location.href = "/login";
    });
  }

  /* Kleiner Profil-Bereich unten in der Sidebar (Referenz-Mockup). Nur die
     E-Mail ist bekannt (Google liefert kein Name/Foto/Rolle) — zeigt einen
     Avatar-Kreis mit dem ersten Buchstaben statt eines erfundenen Fotos. */
  (async () => {
    const root = document.getElementById("rail-profile");
    if (!root) return;
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const { email, isAdmin } = await res.json();
      const initial = (email || "?").charAt(0).toUpperCase();
      root.innerHTML = `
        <span class="rail__profile-avatar">${escapeHtml(initial)}</span>
        <span class="rail__profile-info">
          <strong title="${escapeHtml(email)}">${escapeHtml(email)}</strong>
          <span>Team-Mitglied</span>
        </span>
        <span class="rail__profile-chevron">${ICONS.arrowRight}</span>
      `;
      // Nutzungsübersicht (2026-08-14) nur für Admins im Nav einblenden —
      // Standardzustand ist hidden (siehe index.html), reine UX-Höflichkeit,
      // die echte Schranke steht serverseitig in login-log.js.
      if (isAdmin) {
        const nutzerLink = document.querySelector('[data-nav="nutzer"]');
        if (nutzerLink) nutzerLink.hidden = false;
      }
    } catch {
      // Profil-Bereich bleibt einfach leer, wenn die Abfrage fehlschlägt.
    }
  })();
})();
