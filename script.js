
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


  // Quiz complet du thème Web
  const webQuiz = document.getElementById("web-quiz");
  const webScore = document.getElementById("web-score");

  if (webQuiz) {
    webQuiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = [...webQuiz.querySelectorAll("fieldset[data-correct]")];
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

      if (webScore) {
        webScore.classList.add("visible");
        if (answered < questions.length) {
          webScore.textContent = `Tu as répondu à ${answered} question(s) sur ${questions.length}. Score provisoire : ${score}/${questions.length}.`;
        } else if (score === questions.length) {
          webScore.textContent = `Excellent : ${score}/${questions.length}. Toutes les réponses sont correctes.`;
        } else if (score >= 8) {
          webScore.textContent = `Très bien : ${score}/${questions.length}.`;
        } else if (score >= 5) {
          webScore.textContent = `Score : ${score}/${questions.length}. Revois la fiche « À retenir », puis recommence.`;
        } else {
          webScore.textContent = `Score : ${score}/${questions.length}. Relis le cours avant une nouvelle tentative.`;
        }
      }
    });

    webQuiz.addEventListener("reset", () => {
      webQuiz.querySelectorAll("fieldset").forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
      });
      if (webScore) {
        webScore.textContent = "";
        webScore.classList.remove("visible");
      }
    });
  }



  // ===== Numération / Terminale STI2D =====
  const decimalInput = document.getElementById("decimal-input");
  const convertNumberBtn = document.getElementById("convert-number");
  const conversionResult = document.getElementById("conversion-result");

  if (convertNumberBtn && decimalInput && conversionResult) {
    convertNumberBtn.addEventListener("click", () => {
      const value = Number(decimalInput.value);
      const outputs = conversionResult.querySelectorAll("strong");
      if (!Number.isInteger(value) || value < 0) {
        outputs[0].textContent = "Valeur invalide";
        outputs[1].textContent = "Valeur invalide";
        return;
      }
      outputs[0].textContent = value.toString(2);
      outputs[1].textContent = value.toString(16).toUpperCase();
    });
  }

  const bitsInput = document.getElementById("bits-input");
  const calcRangeBtn = document.getElementById("calc-range");
  const rangeResult = document.getElementById("range-result");

  if (calcRangeBtn && bitsInput && rangeResult) {
    calcRangeBtn.addEventListener("click", () => {
      const n = Number(bitsInput.value);
      const outputs = rangeResult.querySelectorAll("strong");
      if (!Number.isInteger(n) || n < 1 || n > 31) {
        outputs[0].textContent = "Choisir 1 à 31 bits";
        outputs[1].textContent = "Choisir 1 à 31 bits";
        return;
      }
      const unsignedMax = (2 ** n) - 1;
      const signedMin = -(2 ** (n - 1));
      const signedMax = (2 ** (n - 1)) - 1;
      outputs[0].textContent = `0 à ${unsignedMax.toLocaleString("fr-FR")}`;
      outputs[1].textContent = `${signedMin.toLocaleString("fr-FR")} à ${signedMax.toLocaleString("fr-FR")}`;
    });
  }

  const asciiInput = document.getElementById("ascii-input");
  const asciiBtn = document.getElementById("convert-ascii");
  const asciiResult = document.getElementById("ascii-result");

  if (asciiBtn && asciiInput && asciiResult) {
    asciiBtn.addEventListener("click", () => {
      const char = asciiInput.value;
      const outputs = asciiResult.querySelectorAll("strong");
      if (!char) {
        outputs.forEach((o) => o.textContent = "—");
        return;
      }
      const code = char.charCodeAt(0);
      if (code > 127) {
        outputs[0].textContent = "hors ASCII";
        outputs[1].textContent = "hors ASCII";
        outputs[2].textContent = "hors ASCII";
        return;
      }
      outputs[0].textContent = code;
      outputs[1].textContent = code.toString(16).toUpperCase().padStart(2, "0");
      outputs[2].textContent = code.toString(2).padStart(8, "0");
    });
  }

  const numQuiz = document.getElementById("numeration-quiz");
  const numScore = document.getElementById("numeration-score");

  if (numQuiz && numScore) {
    numQuiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = [...numQuiz.querySelectorAll("fieldset[data-correct]")];
      let score = 0;
      let answered = 0;

      questions.forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
        const selected = fieldset.querySelector("input[type='radio']:checked");
        if (!selected) return;
        answered++;
        if (selected.value === fieldset.dataset.correct) {
          score++;
          fieldset.classList.add("correct");
        } else {
          fieldset.classList.add("incorrect");
        }
      });

      numScore.classList.add("visible");
      if (answered < questions.length) {
        numScore.textContent = `Tu as répondu à ${answered}/${questions.length} questions. Score provisoire : ${score}/${questions.length}.`;
      } else if (score === questions.length) {
        numScore.textContent = `Excellent : ${score}/${questions.length}.`;
      } else if (score >= 4) {
        numScore.textContent = `Très bien : ${score}/${questions.length}. Revois la question en rouge.`;
      } else {
        numScore.textContent = `Score : ${score}/${questions.length}. Revois les chapitres correspondants puis recommence.`;
      }
    });

    numQuiz.addEventListener("reset", () => {
      numQuiz.querySelectorAll("fieldset").forEach((fieldset) => fieldset.classList.remove("correct", "incorrect"));
      numScore.textContent = "";
      numScore.classList.remove("visible");
    });
  }

});
