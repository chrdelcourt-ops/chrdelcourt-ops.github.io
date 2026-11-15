(() => {
  "use strict";

  const pick = (id) => document.getElementById(id);

  const gates = {
    and: {expression: "A · B", run: (a, b) => a & b, note: "ET donne 1 si les deux entrées valent 1."},
    or: {expression: "A + B", run: (a, b) => a | b, note: "OU donne 1 si au moins une entrée vaut 1."},
    not: {expression: "¬A", run: (a) => 1 - a, note: "NON inverse A. Cette porte n’utilise qu’une entrée."},
    nand: {expression: "¬(A · B)", run: (a, b) => 1 - (a & b), note: "NAND inverse le résultat de ET."},
    nor: {expression: "¬(A + B)", run: (a, b) => 1 - (a | b), note: "NOR inverse le résultat de OU."},
    xor: {expression: "A ⊕ B", run: (a, b) => a ^ b, note: "XOR donne 1 si les deux entrées sont différentes."}
  };

  function setBit(button, value) {
    button.setAttribute("aria-pressed", String(Boolean(value)));
    button.querySelector("strong").textContent = value;
  }

  const gateSelect = pick("logic-gate");
  const aButton = pick("logic-a");
  const bButton = pick("logic-b");
  const gateOutput = pick("gate-output");
  const gateTable = pick("gate-truth");
  let a = 0;
  let b = 0;

  function updateGate() {
    const {expression, run, note} = gates[gateSelect.value];
    const unary = gateSelect.value === "not";
    const output = run(a, b);
    setBit(aButton, a);
    setBit(bButton, b);
    bButton.disabled = unary;
    gateOutput.textContent = output;
    gateOutput.closest(".bool-lab-result").classList.toggle("is-one", output === 1);
    pick("gate-formula").textContent = expression;
    pick("logic-explain").textContent = note;

    const inputCases = unary ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
    gateTable.tHead.rows[0].cells[1].hidden = unary;
    const rows = inputCases.map((inputs) => {
      const row = document.createElement("tr");
      const [first, second] = inputs;
      if (first === a && (unary || second === b)) {
        row.setAttribute("aria-current", "true");
      }
      for (const state of [...inputs, run(...inputs)]) {
        row.insertCell().textContent = state;
      }
      return row;
    });
    gateTable.tBodies[0].replaceChildren(...rows);
  }

  aButton.addEventListener("click", () => {
    a = 1 - a;
    updateGate();
  });
  bButton.addEventListener("click", () => {
    b = 1 - b;
    updateGate();
  });
  gateSelect.addEventListener("change", updateGate);

  const callBits = {p: 0, b: 0, t: 0};
  const standard = pick("schema-standard");
  const signalWires = [...document.querySelectorAll("[data-signal]")];
  const symbols = [...document.querySelectorAll("[data-diagram]")];

  function updateCircuit() {
    const r = callBits.b | callBits.t;
    const s = callBits.p & r;
    const signals = {...callBits, r, s};
    pick("borne-r").textContent = r;
    pick("borne-s").textContent = s;
    for (const wire of signalWires) {
      wire.classList.toggle("is-one", signals[wire.dataset.signal] === 1);
    }
    for (const symbol of symbols) {
      symbol.style.display = symbol.dataset.diagram === standard.value ? "" : "none";
    }
  }

  for (const button of document.querySelectorAll("[data-borne]")) {
    button.addEventListener("click", () => {
      const signal = button.dataset.borne;
      callBits[signal] = 1 - callBits[signal];
      setBit(button, callBits[signal]);
      updateCircuit();
    });
  }
  standard.addEventListener("change", updateCircuit);

  function bindAnswers(form, answers) {
    const feedback = form.querySelector("[data-feedback]");
    const fields = Object.entries(answers).map(([name, expected]) => [form.elements.namedItem(name), expected]);
    const clearCheck = (field) => {
      delete field.dataset.check;
      field.removeAttribute("aria-invalid");
    };
    for (const [field] of fields) {
      field.addEventListener("change", () => {
        clearCheck(field);
        feedback.textContent = "";
      });
    }
    form.addEventListener("reset", () => {
      for (const [field] of fields) clearCheck(field);
      feedback.textContent = "";
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let correct = 0;
      let missing = 0;
      for (const [field, expected] of fields) {
        if (field.value === expected) {
          correct += 1;
          field.dataset.check = "correct";
          field.removeAttribute("aria-invalid");
        } else if (field.value === "") {
          missing += 1;
          clearCheck(field);
        } else {
          field.dataset.check = "incorrect";
          field.setAttribute("aria-invalid", "true");
        }
      }
      const status = correct === fields.length ? "Toutes les réponses sont justes."
        : missing > 0 ? "Complétez les réponses manquantes et vérifiez les champs signalés."
          : "Revoyez les champs signalés avec la fiche méthode.";
      feedback.textContent = correct + " / " + fields.length + " réponses justes. " + status;
    });
  }

  bindAnswers(pick("cloze"), {
    nature: "binaire", presence: "1", absence: "0", memory: "maintenant", rows: "8", priority: "ET"
  });
  bindAnswers(pick("practice"), {xor: "0", size: "16", order: "0", symbol: "NOR"});

  const exerciseRows = [...pick("ex1-table").rows];
  const exerciseFeedback = pick("result-ex1");
  for (const input of pick("ex1-table").querySelectorAll("input")) {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^01]/g, "").slice(0, 1);
      input.classList.remove("ok", "bad");
      input.removeAttribute("aria-invalid");
      exerciseFeedback.textContent = "";
    });
  }

  pick("check-ex1").addEventListener("click", () => {
    let matches = 0;
    let count = 0;
    for (const row of exerciseRows) {
      const {a, b, c} = row.dataset;
      const notA = 1 - Number(a);
      const bc = Number(b) & Number(c);
      const expected = [notA, bc, notA | bc];
      [...row.querySelectorAll("input")].forEach((input, index) => {
        const correct = input.value === String(expected[index]);
        const incorrect = !correct && input.value !== "";
        input.classList.toggle("ok", correct);
        input.classList.toggle("bad", incorrect);
        if (incorrect) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
        count += 1;
        if (correct) matches += 1;
      });
    }
    exerciseFeedback.textContent = matches + " / " + count + " cases justes.";
  });

  pick("reset-ex1").addEventListener("click", () => {
    for (const input of pick("ex1-table").querySelectorAll("input")) {
      input.value = "";
      input.classList.remove("ok", "bad");
      input.removeAttribute("aria-invalid");
    }
    exerciseFeedback.textContent = "";
  });

  updateGate();
  updateCircuit();
})();

