
function checkAnswer(button, isCorrect) {
  const result = document.getElementById("result");
  if (isCorrect) {
    result.textContent = "Bonne réponse ! Le DNS associe un nom de domaine à une adresse IP.";
  } else {
    result.textContent = "Pas tout à fait. Essaie encore.";
  }
}
