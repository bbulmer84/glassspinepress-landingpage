document.addEventListener("DOMContentLoaded", () => {
  console.log("GSP sample modal script loaded");

  const modal = document.getElementById("gsp-sample-modal");
  console.log("Modal found:", !!modal);
  if (!modal) return;

  const titleEl = document.getElementById("gsp-sample-title");
  const subtitleEl = document.getElementById("gsp-sample-subtitle");
  const contentEl = document.getElementById("gsp-sample-content");

  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gsp-modal-open");
    const closeBtn = modal.querySelector("[data-gsp-close]");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gsp-modal-open");
    contentEl.innerHTML = `<p class="minor">Loading…</p>`;
    if (lastFocus) lastFocus.focus();
  }

  async function loadSample(url) {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load sample: ${res.status}`);
    return await res.text();
  }

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-gsp-sample]");
    if (!btn) return;

    console.log("Sample button clicked");
    e.preventDefault();

    const sampleUrl = btn.getAttribute("data-sample-url");
    const bookTitle = btn.getAttribute("data-book-title") || "Sample";
    const bookTagline = btn.getAttribute("data-book-tagline") || "";

    console.log("Sample URL:", sampleUrl);

    titleEl.textContent = bookTitle;
    subtitleEl.textContent = bookTagline;

    openModal();

    try {
      const html = await loadSample(sampleUrl);
      contentEl.innerHTML = html;
    } catch (err) {
      console.error(err);
      contentEl.innerHTML = `<p>Sorry — the sample couldn’t be loaded.</p>`;
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-gsp-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeModal();
  });
});