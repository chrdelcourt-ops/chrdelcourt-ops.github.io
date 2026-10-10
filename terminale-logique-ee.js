(() => {
  "use strict";
  const gates = (a, b) => ({ not: Number(!a), and: Number(a && b), or: Number(a || b), nand: Number(!(a && b)), nor: Number(!(a || b)), xor: Number(a !== b) });
  const ventilation = (a, b, c) => Number((a || b) && !c);
  if (typeof module !== "undefined" && module.exports) module.exports = { gates, ventilation };
  if (typeof document === "undefined") return;
  const inputA = document.getElementById("ee-logic-a");
  const inputB = document.getElementById("ee-logic-b");
  if (!inputA || !inputB) return;
  const updateGates = () => {
    const a = inputA.checked, b = inputB.checked, values = gates(a, b);
    document.getElementById("ee-a-state").textContent = Number(a);
    document.getElementById("ee-b-state").textContent = Number(b);
    for (const [key, value] of Object.entries(values)) {
      const output = document.getElementById(`ee-out-${key}`);
      output.textContent = value;
      output.closest("article").classList.toggle("is-one", value === 1);
    }
    document.querySelectorAll("#ee-gate-truth tbody tr").forEach(row => row.classList.toggle("logic-current", row.dataset.inputs === `${Number(a)}${Number(b)}`));
    document.getElementById("ee-gate-message").textContent = `A = ${Number(a)}, B = ${Number(b)} : ET = ${values.and}, OU = ${values.or}, XOR = ${values.xor}. ${a === b ? "Les entrées sont identiques : XOR vaut 0." : "Les entrées sont différentes : XOR vaut 1."}`;
  };
  inputA.addEventListener("change", updateGates);
  inputB.addEventListener("change", updateGates);
  updateGates();

  const controls = ["ee-vent-a", "ee-vent-b", "ee-vent-c"].map(id => document.getElementById(id));
  const updateVentilation = () => {
    const [a, b, c] = controls.map(input => input.checked);
    const f = ventilation(a, b, c);
    document.getElementById("ee-vent-or").textContent = Number(a || b);
    document.getElementById("ee-vent-not").textContent = Number(!c);
    document.getElementById("ee-vent-f").textContent = f;
    document.getElementById("ee-vent-result").classList.toggle("is-one", f === 1);
    document.getElementById("ee-vent-message").textContent = c ? "F = 0 : le défaut bloque la ventilation, même avec une commande forcée." : f ? "F = 1 : une demande est présente et aucun défaut n'est détecté." : "F = 0 : aucune demande de ventilation.";
  };
  controls.forEach(input => input.addEventListener("change", updateVentilation));
  updateVentilation();

  const form = document.getElementById("ee-vent-exercise");
  const feedback = document.getElementById("ee-exercise-feedback");
  const selects = [...form.querySelectorAll("select[data-inputs]")];
  const clearFeedback = () => {
    feedback.textContent = "";
    selects.forEach(select => {
      select.removeAttribute("aria-invalid");
      select.closest("td").querySelector(".logic-cell-feedback").textContent = "";
    });
  };
  form.addEventListener("submit", event => {
    event.preventDefault();
    clearFeedback();
    const missing = selects.filter(select => select.value === "");
    if (missing.length) {
      feedback.textContent = `Il reste ${missing.length} sortie${missing.length > 1 ? "s" : ""} à renseigner.`;
      missing[0].focus();
      return;
    }
    let score = 0;
    selects.forEach(select => {
      const [a, b, c] = [...select.dataset.inputs].map(value => value === "1");
      const expected = ventilation(a, b, c);
      const correct = Number(select.value) === expected;
      score += Number(correct);
      select.setAttribute("aria-invalid", String(!correct));
      select.closest("td").querySelector(".logic-cell-feedback").textContent = correct ? "Correct" : `À revoir : F = ${expected}`;
    });
    feedback.textContent = `${score} / 8 sorties correctes. Un défaut C = 1 impose toujours F = 0.`;
  });
  form.addEventListener("reset", clearFeedback);
  form.addEventListener("change", clearFeedback);
})();
