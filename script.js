
document.addEventListener("DOMContentLoaded", () => {
  // Question flash de la page d'accueil
  const homeButtons = document.querySelectorAll("[data-home-answer]");
  const homeResult = document.getElementById("home-result");

  homeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.homeAnswer === "true";
      if (!homeResult) return;
      if (correct) {
        homeResult.textContent = "✓ Bonne réponse. Le DNS permet notamment d'associer un nom de domaine à une adresse IP.";
        homeResult.style.color = "#16845b";
      } else {
        homeResult.textContent = "✗ Ce n'est pas la bonne réponse. Essaie encore.";
        homeResult.style.color = "#9a6410";
      }
    });
  });

  // Quiz complet du thème Internet
  const quiz = document.getElementById("internet-quiz");
  const scoreBox = document.getElementById("quiz-score");

  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();

      const questions = [...quiz.querySelectorAll("fieldset[data-correct]")];
      let score = 0;
      let answered = 0;

      questions.forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
        const selected = fieldset.querySelector("input[type='radio']:checked");

        if (!selected) return;
        answered += 1;

        if (selected.value === fieldset.dataset.correct) {
          score += 1;
          fieldset.classList.add("correct");
        } else {
          fieldset.classList.add("incorrect");
        }
      });

      if (scoreBox) {
        scoreBox.classList.add("visible");

        if (answered < questions.length) {
          scoreBox.textContent = `Tu as répondu à ${answered} question(s) sur ${questions.length}. Score provisoire : ${score}/${questions.length}.`;
        } else if (score === questions.length) {
          scoreBox.textContent = `Excellent : ${score}/${questions.length}. Toutes les réponses sont correctes.`;
        } else if (score >= 6) {
          scoreBox.textContent = `Très bien : ${score}/${questions.length}. Relis seulement les questions en rouge.`;
        } else if (score >= 4) {
          scoreBox.textContent = `Score : ${score}/${questions.length}. Revois la fiche « À retenir », puis recommence.`;
        } else {
          scoreBox.textContent = `Score : ${score}/${questions.length}. Relis le cours avant une nouvelle tentative.`;
        }
      }
    });

    quiz.addEventListener("reset", () => {
      quiz.querySelectorAll("fieldset").forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
      });
      if (scoreBox) {
        scoreBox.textContent = "";
        scoreBox.classList.remove("visible");
      }
    });
  }
});
