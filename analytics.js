(() => {
  "use strict";

  const MEASUREMENT_ID = "G-QZ4KZNW6HN";
  const STORAGE_KEY = "mr_analytics_consent";
  let analyticsLoaded = false;

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      anonymize_ip: true
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function currentChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return null;
    }
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {}
  }

  function removeBanner() {
    document.getElementById("analytics-consent")?.remove();
  }

  function setChoice(value) {
    saveChoice(value);
    removeBanner();
    if (value === "accepted") loadAnalytics();
  }

  function showBanner() {
    if (document.getElementById("analytics-consent")) return;

    const banner = document.createElement("section");
    banner.id = "analytics-consent";
    banner.className = "analytics-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Préférences de statistiques");
    banner.innerHTML = `
      <div class="analytics-consent-text">
        <strong>Statistiques de fréquentation</strong>
        <p>
          Ce site utilise Google Analytics pour mesurer les visites, les pages consultées
          et leur provenance. Les statistiques ne sont activées qu'après votre accord.
        </p>
      </div>
      <div class="analytics-consent-actions">
        <button type="button" class="btn btn-secondary" data-analytics-choice="refused">Refuser</button>
        <button type="button" class="btn btn-primary" data-analytics-choice="accepted">Accepter</button>
      </div>
    `;

    banner.querySelectorAll("[data-analytics-choice]").forEach((button) => {
      button.addEventListener("click", () => setChoice(button.dataset.analyticsChoice));
    });

    document.body.appendChild(banner);
  }

  function addPreferenceLink() {
    const footer = document.querySelector("footer .footer-inner") || document.querySelector("footer");
    if (!footer || document.getElementById("analytics-preferences")) return;

    const wrap = document.createElement("p");
    wrap.className = "analytics-preferences-wrap";

    const button = document.createElement("button");
    button.type = "button";
    button.id = "analytics-preferences";
    button.className = "analytics-preferences";
    button.textContent = "Préférences statistiques";
    button.addEventListener("click", () => {
      saveChoice("");
      showBanner();
    });

    wrap.appendChild(button);
    footer.appendChild(wrap);
  }

  function init() {
    const choice = currentChoice();
    if (choice === "accepted") {
      loadAnalytics();
    } else if (choice !== "refused") {
      showBanner();
    }
    addPreferenceLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
