// Contact form handling (Formspree + Turnstile)
(function () {
  const form = document.getElementById("gsp-contact-form");
  const statusEl = document.getElementById("gsp-form-status");
  const submitBtn = document.getElementById("gsp-submit");

  if (!form || !statusEl || !submitBtn) return;

  function setStatus(type, message) {
    statusEl.classList.remove("is-success", "is-error");
    statusEl.classList.add(type === "success" ? "is-success" : "is-error");
    statusEl.textContent = message;
    statusEl.style.display = "block";
  }

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.value = isSubmitting ? "Sending..." : "Send Message";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Honeypot bot trap
    const honeypot = document.getElementById("company");
    if (honeypot && honeypot.value) {
      form.reset();
      if (window.turnstile) window.turnstile.reset();
      setStatus("success", "Thank you — your message has been sent.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData(form);

      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        form.reset();
        if (window.turnstile) window.turnstile.reset();
        setStatus("success", "Thank you — your message has been sent.");
      } else {
        let msg =
          "Sorry — something went wrong. Please email us directly at contact@glassspinepress.com.";
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map(err => err.message).join(" ");
          }
        } catch (_) {}
        if (window.turnstile) window.turnstile.reset();
        setStatus("error", msg);
      }
    } catch (err) {
      if (window.turnstile) window.turnstile.reset();
      setStatus(
        "error",
        "Sorry — something went wrong. Please email us directly at contact@glassspinepress.com."
      );
    } finally {
      setSubmitting(false);
    }
  });
})();
