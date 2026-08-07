(() => {
  "use strict";

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  const ERROR_MESSAGES = {
    domain: "Zugriff nur mit einem @sowespoke.com- oder @sowespoke.de-Konto.",
    state: "Sitzung abgelaufen — bitte erneut versuchen.",
    google: "Anmeldung abgebrochen.",
    oauth: "Anmeldung fehlgeschlagen — bitte erneut versuchen.",
  };

  const googleBtn = document.getElementById("google-btn");
  if (googleBtn) {
    const next = qs("next");
    if (next) {
      const url = new URL(googleBtn.href, location.origin);
      url.searchParams.set("next", next);
      googleBtn.href = url.pathname + url.search;
    }
  }

  const errorEl = document.getElementById("auth-error");
  const errorCode = qs("error");
  if (errorEl && errorCode) {
    errorEl.textContent = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.oauth;
    errorEl.hidden = false;
  }
})();
