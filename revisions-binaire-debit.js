(() => {
  "use strict";

  const cards = [...document.querySelectorAll(".qa-card")];
  const count = document.getElementById("question-count");
  const masteredCount = document.getElementById("mastered-count");
  const masteredBar = document.getElementById("mastered-bar");
  const finalMastered = document.getElementById("final-mastered");

  if (count) count.textContent = cards.length;

  function updateProgress() {
    const mastered = cards.filter(card => card.classList.contains("mastered")).length;
    if (masteredCount) masteredCount.textContent = mastered;
    if (masteredBar) masteredBar.style.width = `${cards.length ? (mastered / cards.length) * 100 : 0}%`;
    if (finalMastered) finalMastered.textContent = `${mastered} / ${cards.length}`;
  }

  cards.forEach((card) => {
    const answer = card.querySelector(".qa-answer");
    const toggle = card.querySelector(".qa-toggle");
    const master = card.querySelector(".qa-master");
    const review = card.querySelector(".qa-review");

    toggle?.addEventListener("click", () => {
      const hidden = answer.hidden;
      answer.hidden = !hidden;
      toggle.textContent = hidden ? "Masquer la réponse" : "Voir la réponse";
      card.classList.toggle("answer-open", hidden);
    });

    master?.addEventListener("click", () => {
      card.classList.add("mastered");
      card.classList.remove("to-review");
      master.setAttribute("aria-pressed", "true");
      review.setAttribute("aria-pressed", "false");
      updateProgress();
    });

    review?.addEventListener("click", () => {
      card.classList.remove("mastered");
      card.classList.add("to-review");
      master.setAttribute("aria-pressed", "false");
      review.setAttribute("aria-pressed", "true");
      updateProgress();
    });
  });

  document.getElementById("show-all")?.addEventListener("click", () => {
    cards.forEach((card) => {
      const answer = card.querySelector(".qa-answer");
      const toggle = card.querySelector(".qa-toggle");
      answer.hidden = false;
      card.classList.add("answer-open");
      if (toggle) toggle.textContent = "Masquer la réponse";
    });
  });

  document.getElementById("hide-all")?.addEventListener("click", () => {
    cards.forEach((card) => {
      const answer = card.querySelector(".qa-answer");
      const toggle = card.querySelector(".qa-toggle");
      answer.hidden = true;
      card.classList.remove("answer-open");
      if (toggle) toggle.textContent = "Voir la réponse";
    });
  });

  document.getElementById("random-question")?.addEventListener("click", () => {
    const reviewCards = cards.filter(card => card.classList.contains("to-review"));
    const pool = reviewCards.length ? reviewCards : cards.filter(card => !card.classList.contains("mastered"));
    const source = pool.length ? pool : cards;
    const card = source[Math.floor(Math.random() * source.length)];

    cards.forEach(c => c.classList.remove("random-focus"));
    card.classList.add("random-focus");

    const answer = card.querySelector(".qa-answer");
    const toggle = card.querySelector(".qa-toggle");
    answer.hidden = true;
    card.classList.remove("answer-open");
    if (toggle) toggle.textContent = "Voir la réponse";

    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => card.classList.remove("random-focus"), 2200);
  });

  updateProgress();
})();