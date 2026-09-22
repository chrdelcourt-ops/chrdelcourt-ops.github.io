(() => {
  "use strict";

  const form = document.getElementById("contact-form");
  const sendButton = document.getElementById("contact-send");
  const state = document.getElementById("contact-submit-state");
  const subjectField = document.getElementById("formspree-subject");

  if (!form) return;

  function setState(message, type = "") {
    if (!state) return;
    state.textContent = message;
    state.className = "contact-submit-state" + (type ? " " + type : "");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const topic = document.getElementById("contact-topic")?.value || "Contact";
    const classe = document.getElementById("contact-class")?.value || "";
    if (subjectField) {
      subjectField.value = `[Site pédagogique] ${topic}${classe ? " – " + classe : ""}`;
    }

    const data = new FormData(form);

    sendButton.disabled = true;
    sendButton.textContent = "Envoi en cours…";
    setState("Envoi du message en cours…", "sending");

    try {
      const response = await fetch("https://formspree.io/f/xeaogldn", {
        method: "POST",
        body: data,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        setState("Message envoyé. Merci, votre demande a bien été transmise.", "success");
        form.reset();
      } else if (response.status === 429) {
        setState("Trop de messages ont été envoyés en peu de temps. Merci de patienter puis de réessayer.", "error");
      } else {
        let detail = "";
        try {
          const payload = await response.json();
          if (payload?.errors?.length) {
            detail = " " + payload.errors.map(e => e.message).join(" ");
          }
        } catch (_) {}
        setState("Le message n'a pas pu être envoyé." + detail, "error");
      }
    } catch (error) {
      setState("Impossible de joindre le service d'envoi. Vérifiez votre connexion Internet puis réessayez.", "error");
    } finally {
      sendButton.disabled = false;
      sendButton.textContent = "Envoyer le message";
    }
  });

  form.addEventListener("reset", () => {
    setTimeout(() => setState(""), 0);
  });
})();