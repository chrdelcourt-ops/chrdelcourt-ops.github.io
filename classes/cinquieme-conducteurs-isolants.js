(() => {
  "use strict";

  const materials = {
    cuivre: {name:"Fil de cuivre", conductive:true},
    acier: {name:"Trombone en acier", conductive:true},
    aluminium: {name:"Papier aluminium", conductive:true},
    plastique: {name:"Règle en plastique", conductive:false},
    bois: {name:"Bois sec", conductive:false},
    gomme: {name:"Gomme", conductive:false}
  };

  let selected = "cuivre";
  let switchClosed = false;
  let hypothesis = null;

  const pickerButtons = [...document.querySelectorAll("[data-material]")];
  const switchControl = document.getElementById("switch-control");
  const stage = document.getElementById("circuit-stage");
  const lamp = document.getElementById("lamp-visual");
  const samplePiece = document.getElementById("sample-piece");
  const sampleName = document.getElementById("sample-name");
  const message = document.getElementById("circuit-message");

  function updateCircuit() {
    const material = materials[selected];
    const currentFlows = switchClosed && material.conductive;

    pickerButtons.forEach(btn => btn.classList.toggle("selected", btn.dataset.material === selected));
    if (sampleName) sampleName.textContent = material.name;
    samplePiece?.classList.toggle("conductor", material.conductive);
    samplePiece?.classList.toggle("insulator", !material.conductive);

    switchControl?.classList.toggle("closed", switchClosed);
    switchControl?.classList.toggle("open", !switchClosed);
    switchControl?.setAttribute("aria-pressed", switchClosed ? "true" : "false");
    const switchLabel = switchControl?.querySelector("strong");
    if (switchLabel) switchLabel.textContent = switchClosed ? "Interrupteur fermé" : "Interrupteur ouvert";

    stage?.classList.toggle("current-flow", currentFlows);
    stage?.classList.toggle("blocked", switchClosed && !material.conductive);
    lamp?.classList.toggle("on", currentFlows);

    const lampLabel = lamp?.querySelector("strong");
    if (lampLabel) lampLabel.textContent = currentFlows ? "Lampe allumée" : "Lampe éteinte";

    document.getElementById("switch-state").textContent = switchClosed ? "FERMÉ" : "OUVERT";
    document.getElementById("lamp-state").textContent = currentFlows ? "ALLUMÉE" : "ÉTEINTE";

    const conclusion = document.getElementById("material-conclusion");
    if (!switchClosed) {
      conclusion.textContent = "Ferme le circuit pour tester";
      message.textContent = "Le circuit est ouvert : le courant ne peut pas circuler.";
    } else if (material.conductive) {
      conclusion.textContent = "CONDUCTEUR";
      message.textContent = `${material.name} ferme la boucle : le courant circule et la lampe s'allume.`;
    } else {
      conclusion.textContent = "ISOLANT";
      message.textContent = `${material.name} ne permet pas au courant de circuler dans ce test : la lampe reste éteinte.`;
    }
  }

  pickerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selected = btn.dataset.material;
      switchClosed = false;
      hypothesis = null;
      document.querySelectorAll("[data-hypothesis]").forEach(b => b.classList.remove("selected"));
      const hr = document.getElementById("hypothesis-result");
      if (hr) hr.textContent = "";
      updateCircuit();
    });
  });

  switchControl?.addEventListener("click", () => {
    switchClosed = !switchClosed;
    updateCircuit();
  });

  document.querySelectorAll("[data-hypothesis]").forEach(btn => {
    btn.addEventListener("click", () => {
      hypothesis = btn.dataset.hypothesis;
      document.querySelectorAll("[data-hypothesis]").forEach(b => b.classList.toggle("selected", b === btn));
    });
  });

  document.getElementById("run-material-test")?.addEventListener("click", async () => {
    const material = materials[selected];
    switchClosed = true;
    updateCircuit();

    const card = document.querySelector(`[data-result="${selected}"]`);
    if (card) {
      card.classList.remove("tested-conductor", "tested-insulator");
      void card.offsetWidth;
      card.classList.add(material.conductive ? "tested-conductor" : "tested-insulator");
      const strong = card.querySelector("strong");
      if (strong) strong.textContent = material.conductive ? "Conducteur" : "Isolant";
    }

    const result = document.getElementById("hypothesis-result");
    if (!result) return;

    if (!hypothesis || hypothesis === "inconnu") {
      result.textContent = `Résultat : ${material.name} est ${material.conductive ? "conducteur" : "isolant"} dans ce test.`;
      result.className = "hypothesis-result visible";
    } else {
      const correct = (hypothesis === "conducteur") === material.conductive;
      result.textContent = correct
        ? `Bonne hypothèse : ${material.name} est bien ${material.conductive ? "conducteur" : "isolant"}.`
        : `Hypothèse à corriger : l'observation montre que ${material.name} est ${material.conductive ? "conducteur" : "isolant"}.`;
      result.className = "hypothesis-result visible " + (correct ? "success" : "partial");
    }
  });

  document.querySelectorAll(".test-choice-grid[data-answer]").forEach(grid => {
    grid.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        grid.querySelectorAll("button").forEach(b => b.classList.remove("correct","incorrect"));
        const ok = btn.dataset.value === grid.dataset.answer;
        btn.classList.add(ok ? "correct" : "incorrect");
        const result = grid.parentElement.querySelector(".exercise-result");
        if (result) {
          result.textContent = ok ? "Bonne réponse." : "Réponse à revoir.";
          result.className = "exercise-result visible " + (ok ? "success" : "partial");
        }
      });
    });
  });

  updateCircuit();
})();