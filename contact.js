(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  const subjectField = document.getElementById("formspree-subject");
  const topic = document.getElementById("contact-topic");
  const classe = document.getElementById("contact-class");

  if (!form) return;

  function updateSubject() {
    const sujet = topic?.value || "Contact";
    const niveau = classe?.value || "";
    if (subjectField) {
      subjectField.value = `[Site pédagogique] ${sujet}${niveau ? " – " + niveau : ""}`;
    }
  }

  topic?.addEventListener("change", updateSubject);
  classe?.addEventListener("change", updateSubject);
  updateSubject();

  // Initialisation recommandée par Formspree pour un site sans bundler.
  window.formspree =
    window.formspree ||
    function () {
      (window.formspree.q = window.formspree.q || []).push(arguments);
    };

  window.formspree("initForm", {
    formElement: "#contact-form",
    formId: "xeaogldn"
  });
})();