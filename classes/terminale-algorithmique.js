(() => {
  "use strict";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // -------- Serre connectée --------
  const greenTemp = document.getElementById("green-temp");
  const greenHum = document.getElementById("green-hum");
  const greenTempValue = document.getElementById("green-temp-value");
  const greenHumValue = document.getElementById("green-hum-value");
  const greenRun = document.getElementById("green-run");

  function syncGreenValues() {
    if (greenTempValue && greenTemp) greenTempValue.textContent = greenTemp.value;
    if (greenHumValue && greenHum) greenHumValue.textContent = greenHum.value;
  }
  if (greenTemp) greenTemp.addEventListener("input", syncGreenValues);
  if (greenHum) greenHum.addEventListener("input", syncGreenValues);

  if (greenRun) {
    greenRun.addEventListener("click", () => {
      const temperature = Number(greenTemp.value);
      const humidite = Number(greenHum.value);
      const fan = temperature >= 28;
      const pump = humidite < 35;

      const fanCard = document.getElementById("fan-card");
      const pumpCard = document.getElementById("pump-card");
      fanCard.classList.toggle("active", fan);
      pumpCard.classList.toggle("active", pump);
      document.getElementById("fan-state").textContent = fan ? "ON" : "OFF";
      document.getElementById("pump-state").textContent = pump ? "ON" : "OFF";
      document.getElementById("green-output").textContent =
        `(${fan ? "True" : "False"}, ${pump ? "True" : "False"}) — ` +
        `ventilateur ${fan ? "ON" : "OFF"}, pompe ${pump ? "ON" : "OFF"}`;
    });
  }

  // -------- Méthode Exigence -> Tests --------
  const methodPlay = document.getElementById("method-play");
  if (methodPlay) {
    methodPlay.addEventListener("click", async () => {
      const steps = [...document.querySelectorAll(".method-step")];
      methodPlay.disabled = true;
      steps.forEach((s) => s.classList.remove("active"));
      for (const step of steps) {
        step.classList.add("active");
        await sleep(650);
        step.classList.remove("active");
      }
      steps.forEach((s) => s.classList.add("done"));
      setTimeout(() => steps.forEach((s) => s.classList.remove("done")), 1800);
      methodPlay.disabled = false;
    });
  }

  // -------- Algorigramme ventilation --------
  const flowRun = document.getElementById("flow-run");
  if (flowRun) {
    flowRun.addEventListener("click", async () => {
      const ids = ["flow-start","flow-read","flow-test","flow-on","flow-off"];
      ids.forEach((id) => document.getElementById(id)?.classList.remove("active"));
      flowRun.disabled = true;

      const t = Number(document.getElementById("flow-temp").value);
      const output = document.getElementById("flow-output");
      const sequence = ["flow-start","flow-read","flow-test"];

      for (const id of sequence) {
        const el = document.getElementById(id);
        el.classList.add("active");
        await sleep(500);
        el.classList.remove("active");
      }

      const target = t >= 28 ? "flow-on" : "flow-off";
      const el = document.getElementById(target);
      el.classList.add("active");
      output.textContent = `${t} °C : condition ${t >= 28 ? "VRAIE" : "FAUSSE"} → ventilateur ${t >= 28 ? "ON" : "OFF"}`;
      await sleep(900);
      el.classList.remove("active");
      flowRun.disabled = false;
    });
  }

  // -------- Passage piéton --------
  const trafficRun = document.getElementById("traffic-run");
  const carRed = document.getElementById("car-red");
  const carAmber = document.getElementById("car-amber");
  const carGreen = document.getElementById("car-green");
  const pedRed = document.getElementById("ped-red");
  const pedGreen = document.getElementById("ped-green");

  function resetTraffic() {
    [carRed, carAmber, carGreen, pedRed, pedGreen].forEach((l) => l?.classList.remove("on"));
    carGreen?.classList.add("on");
    pedRed?.classList.add("on");
    document.querySelectorAll(".traffic-steps li").forEach((li) => li.classList.remove("active"));
  }

  if (trafficRun) {
    trafficRun.addEventListener("click", async () => {
      resetTraffic();
      trafficRun.disabled = true;
      const status = document.getElementById("traffic-status");

      const activateStep = (n, text) => {
        document.querySelectorAll(".traffic-steps li").forEach((li) => li.classList.remove("active"));
        document.getElementById(`traffic-step-${n}`)?.classList.add("active");
        status.textContent = text;
      };

      // Étape 1 : orange
      activateStep(1, "Étape 1 — voitures orange (3 s dans le scénario).");
      carGreen.classList.remove("on"); carAmber.classList.add("on");
      await sleep(1100);

      // Étape 2 : rouge
      activateStep(2, "Étape 2 — voitures rouge.");
      carAmber.classList.remove("on"); carRed.classList.add("on");
      await sleep(700);

      // Étape 3 : piétons vert
      activateStep(3, "Étape 3 — piétons vert (8 s dans le scénario).");
      pedRed.classList.remove("on"); pedGreen.classList.add("on");
      await sleep(1800);

      // Étape 4 : piétons rouge
      activateStep(4, "Étape 4 — piétons rouge.");
      pedGreen.classList.remove("on"); pedRed.classList.add("on");
      await sleep(650);

      // Étape 5 : voitures vert
      activateStep(5, "Étape 5 — voitures vert. Séquence terminée.");
      carRed.classList.remove("on"); carGreen.classList.add("on");
      await sleep(900);

      document.querySelectorAll(".traffic-steps li").forEach((li) => li.classList.remove("active"));
      trafficRun.disabled = false;
    });
  }

  // -------- Tri de colis --------
  const packageMass = document.getElementById("package-mass");
  if (packageMass) {
    packageMass.addEventListener("input", () => {
      document.getElementById("package-mass-value").textContent = Number(packageMass.value).toFixed(1);
    });
  }

  const sorterRun = document.getElementById("sorter-run");
  if (sorterRun) {
    sorterRun.addEventListener("click", async () => {
      const mass = Number(packageMass.value);
      const a = document.getElementById("conveyor-a");
      const b = document.getElementById("conveyor-b");
      const box = document.getElementById("package-box");
      a.classList.remove("active"); b.classList.remove("active");
      box.classList.remove("move-a","move-b");
      void box.offsetWidth;

      const toA = mass <= 2;
      box.classList.add(toA ? "move-a" : "move-b");
      await sleep(650);
      (toA ? a : b).classList.add("active");
      document.getElementById("sorter-output").textContent =
        `${mass.toFixed(1)} kg → ${toA ? "Convoyeur A" : "Convoyeur B"}`;
    });
  }

  // -------- WHILE : SOC --------
  const socStart = document.getElementById("soc-start");
  if (socStart) {
    socStart.addEventListener("input", () => {
      const v = Number(socStart.value);
      document.getElementById("soc-value").textContent = v;
      document.getElementById("battery-fill").style.width = `${Math.min(v,100)}%`;
      document.getElementById("battery-text").textContent = `${v} %`;
    });
  }

  const socRun = document.getElementById("soc-run");
  if (socRun) {
    socRun.addEventListener("click", async () => {
      let soc = Number(socStart.value);
      const fill = document.getElementById("battery-fill");
      const text = document.getElementById("battery-text");
      const output = document.getElementById("soc-output");
      socRun.disabled = true;

      if (soc >= 80) {
        output.textContent = `SOC = ${soc} % : la condition SOC < 80 est FAUSSE. La boucle ne s'exécute pas.`;
        socRun.disabled = false;
        return;
      }

      output.textContent = "Chargeur ON — boucle WHILE en cours…";
      while (soc < 80) {
        soc = Math.min(80, soc + 2);
        fill.style.width = `${soc}%`;
        text.textContent = `${soc} %`;
        output.textContent = `SOC = ${soc} % → ${soc < 80 ? "on recommence" : "condition devenue FAUSSE"}`;
        await sleep(240);
      }
      output.textContent = "SOC = 80 % → sortie de boucle → chargeur OFF.";
      socRun.disabled = false;
    });
  }

  // -------- FOR : moyenne --------
  async function animateAverage(sumEl, outputEl, button) {
    const values = [21.8, 22.1, 21.9, 22.2, 22.0];
    let sum = 0;
    button.disabled = true;
    sumEl.textContent = "0";
    outputEl.textContent = "Boucle FOR en cours…";
    for (const value of values) {
      sum += value;
      sumEl.textContent = sum.toFixed(1).replace(".", ",");
      outputEl.textContent = `Ajout de ${value.toFixed(1).replace(".", ",")} °C`;
      await sleep(420);
    }
    const avg = sum / values.length;
    outputEl.textContent = `Moyenne = ${avg.toFixed(1).replace(".", ",")} °C`;
    button.disabled = false;
  }

  const averageRun = document.getElementById("average-run");
  if (averageRun) {
    averageRun.addEventListener("click", () =>
      animateAverage(document.getElementById("average-sum"), document.getElementById("average-output"), averageRun)
    );
  }

  // -------- Programmes simulés --------
  const ventRun = document.getElementById("vent-run");
  if (ventRun) {
    ventRun.addEventListener("click", () => {
      const t = Number(document.getElementById("vent-temp").value);
      const seuil = Number(document.getElementById("vent-threshold").value);
      document.getElementById("vent-console").textContent =
        `> ${t >= seuil ? "Ventilation ON" : "Ventilation OFF"}`;
    });
  }

  const averageCodeRun = document.getElementById("average-code-run");
  if (averageCodeRun) {
    averageCodeRun.addEventListener("click", async () => {
      const consoleEl = document.getElementById("average-console");
      averageCodeRun.disabled = true;
      consoleEl.textContent = "> exécution...";
      await sleep(650);
      consoleEl.textContent = "> 22.0";
      averageCodeRun.disabled = false;
    });
  }

  const serreCodeRun = document.getElementById("serre-code-run");
  if (serreCodeRun) {
    serreCodeRun.addEventListener("click", () => {
      const t = Number(document.getElementById("serre-code-temp").value);
      const h = Number(document.getElementById("serre-code-hum").value);
      const fan = t >= 28;
      const pump = h < 35;
      document.getElementById("serre-code-console").textContent =
        `> (${fan ? "True" : "False"}, ${pump ? "True" : "False"})`;
    });
  }

  // -------- Débogage --------
  const debugReveal = document.getElementById("debug-reveal");
  if (debugReveal) {
    debugReveal.addEventListener("click", () => {
      const correction = document.getElementById("debug-correction");
      correction.hidden = !correction.hidden;
      debugReveal.textContent = correction.hidden ? "Afficher la correction" : "Masquer la correction";
    });
  }

  // -------- Quiz --------
  const quiz = document.getElementById("algo-quiz");
  const score = document.getElementById("algo-quiz-score");
  if (quiz && score) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = [...quiz.querySelectorAll("fieldset[data-correct]")];
      let points = 0;
      let answered = 0;

      fields.forEach((field) => {
        field.classList.remove("correct","incorrect");
        const selected = field.querySelector("input[type='radio']:checked");
        if (!selected) return;
        answered++;
        if (selected.value === field.dataset.correct) {
          points++;
          field.classList.add("correct");
        } else {
          field.classList.add("incorrect");
        }
      });

      score.classList.add("visible");
      score.textContent = answered < fields.length
        ? `Tu as répondu à ${answered}/${fields.length}. Score : ${points}/${fields.length}.`
        : points === fields.length
          ? `Excellent : ${points}/${fields.length}.`
          : `Score : ${points}/${fields.length}. Revois les éléments en rouge.`;
    });

    quiz.addEventListener("reset", () => {
      quiz.querySelectorAll("fieldset").forEach((f) => f.classList.remove("correct","incorrect"));
      score.textContent = "";
      score.classList.remove("visible");
    });
  }

  syncGreenValues();
})();