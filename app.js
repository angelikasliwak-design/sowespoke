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

  const NAV_ICON = { news: "home", praesentationen: "layers", vorlagen: "book", "microsoft-learn": "sparkle", anfragen: "mail" };
  railLinks.forEach((a) => { a.innerHTML = ICONS[NAV_ICON[a.dataset.nav]]; });

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

  function findPresentation(id) {
    return PRESENTATIONS.find((p) => p.id === id);
  }
  function findStandaloneTemplate(id) {
    return STANDALONE_TEMPLATES.find((t) => t.id === id);
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
    return `
      <h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(${iconColor})">${icon}</span>${escapeHtml(title)}</h2>
      <div class="mailgen msreq">
        <p class="msreq__intro">${escapeHtml(introDE)}</p>
        <div class="msreq__checklist">
          ${options
            .map((o, i) => {
              const divider =
                o.group && o.group !== (options[i - 1] || {}).group
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
    const copyBtn = view.querySelector(`[data-msreq-copy="${key}"]`);

    function fill() {
      const selected = checks.filter((c) => c.checked).map((c) => options.find((o) => o.id === c.value).name);
      const accounts = accountsEl.value.split("\n").map((s) => s.trim()).filter(Boolean);
      const { subject, body } = composeMsMail(subjectBase, bodyIntro, selected, accountsEl.value);
      subjectEl.value = subject;
      bodyEl.value = body;

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
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
        <div class="hero__intro">
          <h1>Anfragen an <mark>Microsoft</mark>.</h1>
          <p>Vorbereitete E-Mails auf Englisch an ${escapeHtml(MS_CONTACT_NAME)} — Beta-/Pilot-Programme, Bulk-Team-Aufgaben, Reports und Formulare.</p>
        </div>
      </section>

      ${renderMsChecklistSection("beta", "Beta- & Pilot-Programme", "Aktueller Nominierungs-Überblick (Stand Januar 2026) — auswählen, was für den Kunden angefragt werden soll.", MS_BETA_PROGRAMS)}

      ${renderMsChecklistSection("bulk", "Bulk Team", "Aufgaben, die das Bulk Team im Kundenauftrag übernehmen kann.", MS_BULK_TEAM_TASKS)}

      ${renderMsAutobiddingSection()}

      <h2 class="feed__title feed__title--icon"><span class="feed__title__icon" style="background:var(--teal)">${ICONS.fileText}</span>SAP-ID-Erstellung</h2>
      <div class="info-box">
        <div class="info-box__illustration">${SIDECARD_ILLUSTRATION}</div>
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

  function showMascot() {
    const root = document.getElementById("mascot-root");
    let fact = factOfTheDay();
    root.innerHTML = `
      <div class="mascot" role="status">
        <div class="mascot__figure">${MASCOT_SVG}</div>
        <div class="mascot__bubble">
          <button type="button" class="mascot__close" aria-label="Schließen">${ICONS.close}</button>
          <p>${escapeHtml(fact)}</p>
          <button type="button" class="mascot__more">Noch ein Fakt ${ICONS.arrowRight}</button>
        </div>
      </div>
    `;
    const mascotEl = root.querySelector(".mascot");
    const factEl = root.querySelector(".mascot__bubble p");
    let cycleTimer;

    function nextFact() {
      fact = randomFact(fact);
      factEl.style.opacity = "0";
      setTimeout(() => {
        factEl.textContent = fact;
        factEl.style.opacity = "1";
      }, 160);
    }
    function scheduleCycle() {
      clearInterval(cycleTimer);
      cycleTimer = setInterval(nextFact, 15000); // wechselt von selbst, bleibt dauerhaft sichtbar
    }

    root.querySelector(".mascot__close").addEventListener("click", () => {
      clearInterval(cycleTimer);
      mascotEl.classList.add("is-leaving");
      mascotEl.addEventListener("animationend", () => { root.innerHTML = ""; }, { once: true });
    });
    root.querySelector(".mascot__more").addEventListener("click", () => {
      nextFact();
      scheduleCycle(); // Timer neu starten, damit nicht gleich nochmal automatisch wechselt
    });
    scheduleCycle();
  }

  function initMascot() {
    setTimeout(showMascot, 600);
  }

  /* ---------------------------------------------------------------- Mailgen */

  function renderMailGen(topicKey, extraFields, subjectBase, contentIhr, extra) {
    return `
      <div class="mailgen">
        <h2>Teaser-Mail an Kund:innen</h2>
        <div class="mailgen__field">
          <span class="mailgen__radiogroup-label">Empfänger:in</span>
          <div class="mailgen__radiogroup" role="radiogroup" aria-label="Anzahl Empfänger:innen">
            <label><input type="radio" name="mode-${topicKey}" value="multi" checked /> Mehrere Personen (ihr)</label>
            <label><input type="radio" name="mode-${topicKey}" value="single" /> Eine Person (du)</label>
          </div>
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
        <div class="mailgen__actions">
          <button class="btn btn--primary" data-copy="${topicKey}" type="button">${ICONS.copy} In Zwischenablage kopieren</button>
          <span class="mailgen__status" id="status-${topicKey}">${ICONS.check} Kopiert</span>
        </div>
      </div>
    `;
  }

  function wireMailGen(topicKey, extraFields, subjectBase, contentIhr, extra) {
    const nameEl = document.getElementById(`f-${topicKey}-name`);
    const modeEls = Array.from(view.querySelectorAll(`input[name="mode-${topicKey}"]`));
    const extraInputs = extraFields.map((f) => document.getElementById(`f-${topicKey}-${f.key}`));
    const subjectEl = document.getElementById(`subject-${topicKey}`);
    const bodyEl = document.getElementById(`body-${topicKey}`);
    const warningEl = document.getElementById(`warning-${topicKey}`);
    const copyBtn = view.querySelector(`[data-copy="${topicKey}"]`);

    function fill() {
      const mode = (modeEls.find((r) => r.checked) || {}).value || "multi";
      let content = contentIhr;
      const missing = [];
      extraFields.forEach((f, i) => {
        const val = extraInputs[i].value.trim();
        if (!val) missing.push(f.label);
        content = content.replaceAll(`{${f.key}}`, val || `{${f.key}}`);
      });
      const { subject, body } = composeMail(subjectBase, content, extra, mode, nameEl.value.trim());
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
    }
    nameEl.addEventListener("input", fill);
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
      <section class="hero">
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
        <div class="hero__intro">
          <h1>Neuigkeiten aus der <mark>Online-Marketing-Welt</mark>.</h1>
          <p>Automatisch aktualisiert aus mehreren Branchen-Quellen — Fokus Microsoft Advertising.</p>
        </div>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="News durchsuchen …" value="${escapeHtml(query || "")}" aria-label="News durchsuchen" />
        </label>
      </section>
      <nav class="tabs" aria-label="Kanäle">
        <button type="button" class="tabs__item ${ch === "all" ? "is-active" : ""}" data-ch="all">Alle</button>
        ${channels.map((c) => `<button type="button" class="tabs__item ${ch === c ? "is-active" : ""}" data-ch="${c}">${c}</button>`).join("")}
      </nav>
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

    feed.innerHTML = `
      <h2 class="feed__title">Aktuelle Beiträge${items.length ? ` (${items.length})` : ""}</h2>
      ${failedNotice}
      ${
        items.length
          ? `<ul class="article-list">${items.map(newsRow).join("")}</ul>`
          : `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff oder Kanal.</p></div>`
      }
    `;
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
              ${item.lang === "en" ? `<span class="flash flash--muted">EN</span>` : ""}
            </span>
            <span class="row__title">${escapeHtml(item.title)}</span>
            ${item.description ? `<span class="row__summary">${escapeHtml(item.description)}</span>` : ""}
          </span>
          <span class="row__arrow">${ICONS.external}</span>
        </a>
      </li>
    `;
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
      <section class="hero">
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
        <div class="hero__intro">
          <h1>Offizielle <mark>Microsoft-Präsentationen</mark>.</h1>
          <p>Zusammenfassungen, Beta-/Feature-Guides und Kunden-Mails direkt aus den echten Präsentationsfolien — neueste zuerst, Einträge ohne bekanntes Datum am Ende.</p>
        </div>
        <label class="search">
          ${ICONS.search}
          <input type="search" id="search-input" placeholder="Präsentation durchsuchen …" value="${escapeHtml(query || "")}" aria-label="Präsentationen durchsuchen" />
        </label>
      </section>
      <nav class="tabs" aria-label="Art">
        <button type="button" class="tabs__item ${dt === "all" ? "is-active" : ""}" data-dt="all">Alle</button>
        ${docTypes.map((d) => `<button type="button" class="tabs__item ${dt === d ? "is-active" : ""}" data-dt="${escapeHtml(d)}">${escapeHtml(d)}</button>`).join("")}
      </nav>
      <div class="feed">
        ${items.length ? presentationList(items) : `<div class="empty-state">${ICONS.magnifyEmpty}<strong>Kein Treffer</strong><p>Versuch einen anderen Begriff oder Filter.</p></div>`}
      </div>
    `;

    wireTopControls(
      () => renderPresentations(document.getElementById("search-input").value, dt),
      (nextDt) => renderPresentations(query, nextDt),
      "dt"
    );
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
    return `
      <li>
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
        <div class="info-box__illustration">${SIDECARD_ILLUSTRATION}</div>
              <h2>Kernfakten aus der Präsentation</h2>
              <ul>${p.keyFactsDE.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
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

  function renderTemplates() {
    const linkedTemplates = [...PRESENTATIONS].sort((a, b) => {
      if (a.dateKnown !== b.dateKnown) return a.dateKnown ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });

    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
        <div class="hero__intro">
          <h1>Vorlagen &amp; <mark>Wissensdatenbank</mark>.</h1>
          <p>Best Practices und alle E-Mail-Vorlagen an einem Ort — inklusive Vorlagen mit individuellen Zusatzfeldern.</p>
        </div>
      </section>

      <h2 class="feed__title">Best Practices</h2>
      <div class="card-grid">
        ${BEST_PRACTICES.map(
          (bp, i) => `<div class="side-card"><span class="side-card__icon" style="background-color: var(${i % 2 ? "--teal" : "--accent"})">${ICONS.flash}</span><h3>${escapeHtml(bp.title)}</h3><p class="pre-line">${escapeHtml(bp.body)}</p></div>`
        ).join("")}
      </div>

      <h2 class="feed__title">Eigenständige Vorlagen</h2>
      <ul class="article-list">
        ${STANDALONE_TEMPLATES.map(
          (t) => `
          <li>
            <a class="row" href="#/vorlagen/${t.id}">
              <span class="row__thumb" style="background-color: var(--teal)">${ICONS.mail}</span>
              <span class="row__body">
                <span class="row__meta">${t.isPlaceholder ? `<span class="flash flash--muted">Beispiel</span>` : ""}</span>
                <span class="row__title">${escapeHtml(t.title)}</span>
                <span class="row__summary">${escapeHtml(t.summary)}</span>
              </span>
              <span class="row__arrow">${ICONS.arrowRight}</span>
            </a>
          </li>`
        ).join("")}
      </ul>

      <h2 class="feed__title">Vorlagen aus Präsentationen (${linkedTemplates.length})</h2>
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
      </ul>
    `;
  }

  async function renderMicrosoftLearn() {
    view.innerHTML = `
      <section class="hero hero--compact">
        <div class="hero__illustration">${HERO_ILLUSTRATION}</div>
        <div class="hero__intro">
          <h1>Von <mark>Microsoft Learn</mark>.</h1>
          <p>Offizielle Kurzbeschreibungen ausgewählter Microsoft-Learn-Seiten, mit Link zur vollständigen Originalseite.</p>
        </div>
      </section>
      <div id="learn-feed">
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
    } else if (!learnData.items || learnData.items.length === 0) {
      learnFeed.innerHTML = `<div class="empty-state">${ICONS.book}<strong>Noch keine Quellen hinterlegt</strong><p>Sobald konkrete Microsoft-Learn-Links hinterlegt sind, erscheinen hier die offiziellen Kurzbeschreibungen mit Link zur Originalseite.</p></div>`;
    } else {
      learnFeed.innerHTML = `<ul class="article-list">${learnData.items
        .map(
          (it) => `
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
        </li>`
        )
        .join("")}</ul>`;
    }
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
        <div class="info-box__illustration">${SIDECARD_ILLUSTRATION}</div>
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
        (a.dataset.nav === "microsoft-learn" && path.startsWith("/microsoft-learn")) ||
        (a.dataset.nav === "anfragen" && path.startsWith("/anfragen"));
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function render() {
    const { path, params } = currentRoute();
    updateNav(path);

    if (path === "/") {
      renderNews(params.get("q") || "", params.get("ch") || "all");
    } else if (path.startsWith("/praesentationen/")) {
      renderPresentationDetail(path.slice("/praesentationen/".length));
    } else if (path === "/praesentationen") {
      renderPresentations(params.get("q") || "", params.get("dt") || "all");
    } else if (path.startsWith("/vorlagen/")) {
      renderStandaloneTemplateDetail(path.slice("/vorlagen/".length));
    } else if (path === "/vorlagen") {
      renderTemplates();
    } else if (path === "/microsoft-learn") {
      renderMicrosoftLearn();
    } else if (path === "/anfragen") {
      renderMicrosoftRequests();
    } else {
      renderNews("", "all");
    }
    view.focus({ preventScroll: true });
  }

  window.addEventListener("hashchange", render);
  render();
  initMascot();
})();
