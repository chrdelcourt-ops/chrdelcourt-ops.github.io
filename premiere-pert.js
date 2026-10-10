(() => {
  "use strict";

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Calcul de durée attendue
  const inputA = document.getElementById("pert-a");
  const inputM = document.getElementById("pert-m");
  const inputB = document.getElementById("pert-b");

  function safeNumber(input, fallback) {
    const value = Number(input?.value);
    if (!Number.isFinite(value) || value < 0) return fallback;
    return value;
  }

  function updateDuration() {
    const a = safeNumber(inputA, 1);
    const m = safeNumber(inputM, 3);
    const b = safeNumber(inputB, 5);
    const te = (a + 4 * m + b) / 6;

    const calc = document.getElementById("pert-duration-calc");
    const result = document.getElementById("pert-duration-result");
    if (calc) calc.textContent = `(${a} + 4 × ${m} + ${b}) / 6`;
    if (result) result.textContent = Number.isInteger(te) ? te : te.toFixed(2).replace(".", ",");
  }

  [inputA, inputM, inputB].forEach(input => input?.addEventListener("input", updateDuration));
  updateDuration();

  // Réseau PERT
  const network = document.getElementById("pert-network");
  const caption = document.getElementById("pert-network-caption");
  const buildBtn = document.getElementById("pert-build");

  function resetNetwork() {
    network?.querySelectorAll(".pert-edge").forEach(edge => {
      edge.classList.remove("visible", "critical");
    });
    network?.querySelectorAll(".pert-event").forEach(event => {
      event.classList.remove("visible", "critical-event");
    });
    network?.classList.remove("show-dates");
    if (caption) {
      caption.textContent = "A démarre le projet. Après A, les branches B→D et C→E peuvent avancer en parallèle.";
    }
  }

  async function buildNetwork() {
    if (!network || !buildBtn) return;
    resetNetwork();
    buildBtn.disabled = true;

    const event1 = network.querySelector('[data-event="1"]');
    event1?.classList.add("visible");
    await sleep(350);

    const steps = [
      {n:1, text:"A relie l'événement 1 à l'événement 2 : analyser le besoin."},
      {n:2, text:"Après A, B et C peuvent commencer en parallèle."},
      {n:3, text:"D suit B et E suit C. Les deux branches progressent en parallèle."},
      {n:4, text:"F ne peut commencer qu'après la convergence de D et E."},
      {n:5, text:"G commence après F."},
      {n:6, text:"H termine le réseau et mène à l'événement final 8."}
    ];

    const revealEvents = {
      1:[2],
      2:[3,4],
      3:[5],
      4:[6],
      5:[7],
      6:[8]
    };

    for (const step of steps) {
      network.querySelectorAll(`.pert-edge[data-step="${step.n}"]`).forEach(edge => edge.classList.add("visible"));
      (revealEvents[step.n] || []).forEach(id => {
        network.querySelector(`[data-event="${id}"]`)?.classList.add("visible");
      });
      if (caption) caption.textContent = step.text;
      await sleep(800);
    }

    buildBtn.disabled = false;
  }

  buildBtn?.addEventListener("click", buildNetwork);

  document.getElementById("pert-critical")?.addEventListener("click", () => {
    network?.querySelectorAll(".pert-edge").forEach(edge => edge.classList.add("visible"));
    network?.querySelectorAll(".pert-event").forEach(event => event.classList.add("visible"));
    network?.querySelectorAll('.pert-edge[data-critical="1"]').forEach(edge => edge.classList.add("critical"));
    [1,2,4,5,6,7,8].forEach(id => {
      network?.querySelector(`[data-event="${id}"]`)?.classList.add("critical-event");
    });
    if (caption) {
      caption.textContent = "Chemin critique : A → C → E → F → G → H. Sa durée totale est de 14 jours.";
    }
  });

  document.getElementById("pert-dates")?.addEventListener("click", () => {
    network?.querySelectorAll(".pert-edge").forEach(edge => edge.classList.add("visible"));
    network?.querySelectorAll(".pert-event").forEach(event => event.classList.add("visible"));
    network?.classList.add("show-dates");
    if (caption) {
      caption.textContent = "Dates au plus tôt : 0, 2, 4, 5, 7, 9, 12 et 14 jours pour les événements 1 à 8.";
    }
  });

  document.getElementById("pert-reset")?.addEventListener("click", resetNetwork);

  // Retard sur B
  const delay = document.getElementById("pert-delay");

  function updateDelay() {
    const d = Math.max(0, Math.min(3, Number(delay?.value || 0)));
    const branchB = 4 + d;
    const branchC = 5;
    const maxBranch = Math.max(branchB, branchC);
    const convergence = 2 + maxBranch; // A dure 2 jours avant la bifurcation
    const total = convergence + 2 + 3 + 2; // F + G + H
    const projectDelay = total - 14;

    document.getElementById("pert-delay-value").textContent = d;
    document.getElementById("pert-branch-b-label").textContent = `${branchB} j`;
    document.getElementById("pert-convergence").textContent = `J${convergence}`;
    document.getElementById("pert-total").textContent = `${total} jours`;
    document.getElementById("pert-impact").textContent =
      projectDelay === 0 ? "Aucun retard final" : `+${projectDelay} jour${projectDelay > 1 ? "s" : ""}`;

    const barB = document.getElementById("pert-branch-b");
    const barC = document.getElementById("pert-branch-c");
    if (barB) barB.style.width = `${Math.min(100, branchB / 7 * 100)}%`;
    if (barC) barC.style.width = `${branchC / 7 * 100}%`;

    const message = document.getElementById("pert-delay-message");
    if (!message) return;

    if (d === 0) {
      message.textContent = "Sans retard, C→E dure 5 jours contre 4 jours pour B→D : C→E fixe la convergence.";
    } else if (d === 1) {
      message.textContent = "Avec +1 jour sur B, les deux branches durent 5 jours. La marge est consommée mais le projet reste à 14 jours.";
    } else if (d === 2) {
      message.textContent = "Avec +2 jours sur B, B→D dure 6 jours : la convergence est décalée d'un jour et le projet passe à 15 jours.";
    } else {
      message.textContent = "Avec +3 jours sur B, B→D devient clairement critique : le projet passe à 16 jours.";
    }
  }

  delay?.addEventListener("input", updateDelay);
  updateDelay();
  resetNetwork();
})();