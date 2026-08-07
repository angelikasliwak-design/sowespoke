(() => {
  "use strict";

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function showError(el, message) {
    el.textContent = message;
    el.hidden = false;
  }

  function submitForm(form, url, errorEl, buildBody, onSuccess) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errorEl.hidden = true;
      const btn = form.querySelector("button[type=submit]");

      let body;
      try {
        body = buildBody(new FormData(form));
      } catch (err) {
        showError(errorEl, err.message);
        return;
      }

      btn.disabled = true;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          showError(errorEl, data.error || "Etwas ist schiefgelaufen.");
          return;
        }
        onSuccess();
      } catch {
        showError(errorEl, "Netzwerkfehler — bitte erneut versuchen.");
      } finally {
        btn.disabled = false;
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    submitForm(
      loginForm,
      "/api/auth/login",
      document.getElementById("login-error"),
      (fd) => ({ email: fd.get("email"), password: fd.get("password") }),
      () => { location.href = qs("next") || "/"; }
    );
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    submitForm(
      registerForm,
      "/api/auth/register",
      document.getElementById("register-error"),
      (fd) => {
        const email = fd.get("email");
        const password = fd.get("password");
        const passwordConfirm = fd.get("passwordConfirm");
        if (password !== passwordConfirm) throw new Error("Passwörter stimmen nicht überein");
        return { email, password };
      },
      () => { location.href = "/"; }
    );
  }
})();
