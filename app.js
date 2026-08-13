(() => {
  "use strict";

  const view = document.getElementById("view");
  const railLinks = document.querySelectorAll(".rail__nav a");

  const CHANNEL_VAR = {
    Microsoft: "--teal",
    Google: "--cat-tracking",
    Meta: "--cat-ai",
    TikTok: "--cat-target",
    Snapchat: "--cat-creative",
    Rechtliches: "--cat-target",
    KI: "--cat-ai",
    CRO: "--cat-bid",
    Allgemein: "--ink-soft",
  };

  const NAV_ICON = { news: "home", praesentationen: "layers", vorlagen: "book", "case-studies": "trophy", tickets: "ticket", "microsoft-learn": "sparkle", anfragen: "mail" };
  railLinks.forEach((a) => {
    const iconSlot = a.querySelector(".rail__nav-icon");
    if (iconSlot) iconSlot.innerHTML = ICONS[NAV_ICON[a.dataset.nav]];
    else a.innerHTML = ICONS[NAV_ICON[a.dataset.nav]];
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

  function renderMsChecklistSection(key, title, introDE, options) {
    const iconColor = key === "bulk" ? "--teal" : "--accent";
    const icon = key === "bulk" ? ICONS.layers : ICONS.sparkle;
    // Nach Gruppe sortieren (stabil, erste Erscheinung entscheidet die
    // Reihenfolge) — sonst wechseln sich Gruppen-Labels chaotisch ab, weil
    // die Rohdaten in Dokument-Reihenfolge stehen, nicht nach Gruppe.
    const groupOrder = [];
    options.forEach((o) => { if (o.group && !groupOrder.includes(o.group)) groupOrder.push(o.group); });
    const sorted = [...options].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group));
    return `
      <h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(${iconColor})">${icon}</span>${escapeHtml(title)}</h2>
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

  function renderMsAutobiddingSection() {
    return `
      <h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(--accent)">${ICONS.gauge}</span>Autobidding Report</h2>
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

  function renderMicrosoftRequests() {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <span class="hero__eyebrow">Service-Anfragen</span>
          <h1>Anfragen an <mark>Microsoft</mark>.</h1>
          <p>Vorbereitete E-Mails auf Englisch an ${escapeHtml(MS_CONTACT_NAME)} — Beta-/Pilot-Programme, Bulk-Team-Aufgaben, Reports und Formulare.</p>
        </div>
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
      </section>

      ${renderMsChecklistSection("beta", "Beta- & Pilot-Programme", "Aktueller Nominierungs-Überblick (Stand Januar 2026) — auswählen, was für den Kunden angefragt werden soll.", MS_BETA_PROGRAMS)}

      ${renderMsChecklistSection("bulk", "Bulk Team", "Aufgaben, die das Bulk Team im Kundenauftrag übernehmen kann.", MS_BULK_TEAM_TASKS)}

      ${renderMsAutobiddingSection()}

      <h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(--teal)">${ICONS.fileText}</span>SAP-ID-Erstellung</h2>
      <div class="info-box">
        <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
        <p>Formular zur Anlage einer neuen SAP-ID (Rechnungs-/Kontodaten, VAT, Microsoft-Advertising-Kundennummer). Direkt im Dokument ausfüllen und an ${escapeHtml(MS_CONTACT_NAME)} senden.</p>
        <a class="btn btn--secondary" href="content/microsoft-anfragen/${encodeURIComponent("SAP ID Creation Form .docx")}" download>${ICONS.download} Formular herunterladen</a>
      </div>
    `;

    wireMsChecklistSection("beta", MS_BETA_PROGRAMS, "Beta / Pilot Program Request", "I would like to request access to the following beta/pilot program(s):");
    wireMsChecklistSection("bulk", MS_BULK_TEAM_TASKS, "Bulk Team Support Request", "I would like to request the Bulk Team's support with the following task(s):");
    wireMsAutobiddingSection();
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
    return path.startsWith("/praesentationen") || path.startsWith("/vorlagen/") || path === "/anfragen";
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
  function mascotOverlapsFeed(mascotEl) {
    const feed = document.querySelector(".feed");
    if (!feed) return false;
    const mRect = mascotEl.getBoundingClientRect();
    const fRect = feed.getBoundingClientRect();
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
    const avoidEls = document.querySelectorAll(".side-rail, .toolbar, .ticket-list");
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
          </div>
        </div>
        <div class="mailgen__field">
          <label for="to-${topicKey}">E-Mail-Adresse(n) der Kundschaft</label>
          <input type="text" id="to-${topicKey}" placeholder="name@kunde.de — mehrere mit Komma trennen" autocomplete="off" />
        </div>
        <div class="mailgen__field">
          <label for="f-${topicKey}-name">Name der Ansprechperson (optional)</label>
          <input type="text" id="f-${topicKey}-name" placeholder="z. B. Frau Meyer" />
        </div>
        ${extraFields
          .map(
            (f) => `
          <div class="mailgen__field">
            <label for="f-${topicKey}-${f.key}">${escapeHtml(f.label)}</label>
            <input type="text" id="f-${topicKey}-${f.key}" data-field="${f.key}" placeholder="${escapeHtml(f.placeholder || "")}" />
          </div>`
          )
          .join("")}
        <div class="mailgen__field">
          <label for="subject-${topicKey}">Betreff</label>
          <input type="text" id="subject-${topicKey}" readonly />
        </div>
        <div class="mailgen__field">
          <label for="body-${topicKey}">Text</label>
          <textarea id="body-${topicKey}" readonly></textarea>
        </div>
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
        <p class="mailgen__hint">„In Gmail öffnen" öffnet ein neues Gmail-Compose-Fenster mit fertig ausgefüllter Nachricht — du prüfst und schickst sie von dort aus ab, sie landet danach ganz normal in deinem Gesendet-Ordner. Bei sehr langem Text lieber „In Zwischenablage kopieren" nutzen.</p>
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
    const warningEl = document.getElementById(`warning-${topicKey}`);
    const copyBtn = view.querySelector(`[data-copy="${topicKey}"]`);
    const sendBtn = view.querySelector(`[data-send="${topicKey}"]`);
    const sigEl = document.getElementById(`sig-${topicKey}`);
    const sigStatusEl = document.getElementById(`sig-status-${topicKey}`);

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

    function fill() {
      const mode = (modeEls.find((r) => r.checked) || {}).value || "single";
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
      const { subject, body: bodyBase } = composeMail(subjectFilled, content, extra, mode, nameEl.value.trim());
      const signature = sigEl.value.trim();
      const body = signature ? `${bodyBase}\n\n--\n${signature}` : bodyBase;
      subjectEl.value = subject;
      bodyEl.value = body;

      if (missing.length) {
        warningEl.querySelector("strong").textContent = missing.join(", ");
        warningEl.hidden = false;
        copyBtn.disabled = true;
      } else {
        warningEl.hidden = true;
        copyBtn.disabled = false;
      }

      // "E-Mail senden" braucht zusätzlich eine gültige Empfänger-Adresse —
      // "In Zwischenablage kopieren" kam schon vorher ohne aus (Nutzer
      // trägt die Adresse dann selbst im E-Mail-Programm ein).
      const { addrs, valid: recipientsValid } = parseRecipients(toEl.value.trim());
      const ready = recipientsValid && !missing.length;
      sendBtn.classList.toggle("is-disabled", !ready);
      sendBtn.setAttribute("aria-disabled", String(!ready));
      // Gmail-Compose-URL statt mailto: (Nutzer-Feedback 2026-08-10):
      // mailto: geht immer an den vom Betriebssystem registrierten
      // Standard-Handler (unter Windows meist Outlook), unabhängig davon,
      // welchen Mail-Dienst man tatsächlich nutzt. Da der Login hier über
      // Google Workspace läuft, ist Gmail der echte Mail-Dienst aller
      // Nutzer:innen — die Compose-URL öffnet Gmail direkt im Browser-Tab,
      // umgeht das Standard-Handler-Problem komplett.
      sendBtn.href = ready
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(addrs.join(","))}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        : "#";
    }
    nameEl.addEventListener("input", fill);
    toEl.addEventListener("input", fill);
    modeEls.forEach((r) => r.addEventListener("change", fill));
    extraInputs.forEach((el) => el.addEventListener("input", fill));
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
          <span class="hero__eyebrow">News &amp; Insights</span>
          <h1>Neuigkeiten aus der<br>Online-<mark>Marketing-Welt</mark>.</h1>
          <p>Aktuelle Trends, Updates &amp; Insights aus der Online-Marketing-Welt – mit besonderem Fokus auf Microsoft Advertising.</p>
        </div>
        <div class="hero__scene">
          <div class="hero__bubble">Wissen weitergeben.<br>Erfolg vervielfachen.</div>
          <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
          <span class="hero__sticker"><span class="hero__sticker-dot" aria-hidden="true"></span>Live Updates</span>
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
          <span class="hero__eyebrow">Offizielle Quelle</span>
          <h1>Offizielle <mark>Microsoft-Präsentationen</mark>.</h1>
          <p>Zusammenfassungen, Beta-/Feature-Guides und Kunden-Mails direkt aus den echten Präsentationsfolien — neueste zuerst, Einträge ohne bekanntes Datum am Ende.</p>
        </div>
        <div class="hero__scene">
          <div class="hero__bubble">Wissen, das<br>weiterbringt!</div>
          <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
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
            <p>${escapeHtml(p.summaryDE)}</p>
            <div class="info-box">
        <div class="info-box__illustration">${INFOBOX_ILLUSTRATION}</div>
              <h2>Kernfakten aus der Präsentation</h2>
              <ul>${p.keyFactsDE.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
            </div>
            <div class="pdf-viewer">
              <div class="pdf-viewer__bar">
                <span class="pdf-viewer__label">${ICONS.fileText} Original-Präsentation</span>
                <a class="pdf-viewer__expand" href="${viewerHref}" target="_blank" rel="noopener">${ICONS.arrowRight} Groß öffnen</a>
              </div>
              <iframe class="pdf-viewer__frame" src="${viewerHref}" title="${escapeHtml(p.title)}" loading="lazy"></iframe>
            </div>
            <a class="btn btn--secondary" href="${downloadHref}" download>${ICONS.download} Original-PDF herunterladen</a>
          </div>
          <div class="detail__side">
            ${renderMailGen(p.id, [], `Neu bei Microsoft Advertising: ${p.title}`, p.customerBlurb, p.emailHookDE)}
          </div>
        </div>
      </article>
    `;

    wireMailGen(p.id, [], `Neu bei Microsoft Advertising: ${p.title}`, p.customerBlurb, p.emailHookDE);
  }

  /* ------------------------------------------------------------- Seite: Vorlagen */

  function renderTemplates(query) {
    const q = (query || "").trim().toLowerCase();

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
    const noResults = !bestPractices.length && !standalone.length && !linkedTemplates.length;

    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <span class="hero__eyebrow">Wissensdatenbank</span>
          <h1>Vorlagen &amp; <mark>Wissensdatenbank</mark>.</h1>
          <p>Best Practices und alle E-Mail-Vorlagen an einem Ort — inklusive Vorlagen mit individuellen Zusatzfeldern.</p>
        </div>
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
      </section>
      <div class="toolbar">
        <span class="toolbar__label">Was möchtest du finden?</span>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="Best Practices, Vorlagen durchsuchen …" value="${escapeHtml(query || "")}" aria-label="Vorlagen durchsuchen" />
          <button type="button" class="search__submit" id="search-submit" aria-label="Suche fokussieren">${ICONS.search}</button>
        </label>
      </div>

      ${noResults ? `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff.</p></div>` : ""}

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
    `;

    wireTopControls(() => renderTemplates(document.getElementById("search-input").value), () => {}, "x");
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
          <span class="hero__eyebrow">Kundenergebnisse</span>
          <h1>Case <mark>Studies</mark>.</h1>
          <p>Echte Ergebnisse und Testresultate aus den Kundenkonten — laufend gepflegt.</p>
        </div>
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
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
        </div>
      </article>
    `;
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
  // 3.58:1 (Kritik-Fund), die Text-sichere Variante schafft ~5.2:1.
  const AVATAR_VAR_CYCLE = ["--accent", "--teal-text", "--cat-ai", "--cat-bid", "--cat-creative", "--cat-tracking", "--cat-target"];
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
    const catVarCycle = ["--cat-tracking", "--cat-ai", "--cat-bid", "--cat-creative", "--cat-target"];

    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__intro">
          <span class="hero__eyebrow">Support</span>
          <h1>Tickets<mark>-Übersicht</mark>.</h1>
          <p>Alle Anfragen von Kundenagenturen an einem Ort. Diese Ansicht zeigt aktuell Beispieldaten — die Anbindung an das echte Ticketsystem folgt.</p>
        </div>
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
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
          <span class="hero__eyebrow">Microsoft Learn</span>
          <h1>Von <mark>Microsoft Learn</mark>.</h1>
          <p>Offizielle Kurzbeschreibungen ausgewählter Microsoft-Learn-Seiten, mit Link zur vollständigen Originalseite.</p>
        </div>
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
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

  /* ------------------------------------------------------- Zuletzt angesehen */

  const RECENT_KEY = "sowespoke-recent";

  function pushRecent(entry) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { list = []; }
    list = list.filter((e) => e.href !== entry.href);
    list.unshift(entry);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 5)));
  }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch { return []; }
  }

  function renderRecentCard() {
    const items = getRecent();
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
        (a.dataset.nav === "anfragen" && path.startsWith("/anfragen"));
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
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
      renderTemplates(params.get("q") || "");
    } else if (path.startsWith("/case-studies/")) {
      renderCaseStudyDetail(path.slice("/case-studies/".length));
    } else if (path === "/case-studies") {
      renderCaseStudies(params.get("q") || "", params.get("ch") || "all");
    } else if (path === "/tickets") {
      renderTickets(params.get("q") || "", params.get("st") || "all", params.get("sort") || "created");
    } else if (path === "/microsoft-learn") {
      renderMicrosoftLearn(params.get("q") || "");
    } else if (path === "/anfragen") {
      renderMicrosoftRequests();
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
      const { email } = await res.json();
      const initial = (email || "?").charAt(0).toUpperCase();
      root.innerHTML = `
        <span class="rail__profile-avatar">${escapeHtml(initial)}</span>
        <span class="rail__profile-info">
          <strong title="${escapeHtml(email)}">${escapeHtml(email)}</strong>
          <span>Team-Mitglied</span>
        </span>
        <span class="rail__profile-chevron">${ICONS.arrowRight}</span>
      `;
    } catch {
      // Profil-Bereich bleibt einfach leer, wenn die Abfrage fehlschlägt.
    }
  })();
})();
