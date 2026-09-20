(() => {
  "use strict";

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ---------- Premier Gantt ----------
  const miniPlay = document.getElementById("mini-gantt-play");
  const miniReset = document.getElementById("mini-gantt-reset");
  const miniMsg = document.getElementById("mini-gantt-message");

  function resetMini() {
    document.querySelectorAll("#mini-gantt-board [data-step]").forEach((cell) => {
      cell.classList.remove("show");
    });
    if (miniMsg) {
      miniMsg.textContent = "Une barre indique quand une tâche commence et combien de jours elle occupe.";
    }
  }

  if (miniPlay) {
    miniPlay.addEventListener("click", async () => {
      resetMini();
      miniPlay.disabled = true;
      const messages = {
        1: "L'étude du besoin occupe lundi et mardi.",
        2: "Le choix de la solution peut commencer mercredi après la fin de l'étude.",
        3: "Le losange du vendredi représente un jalon : un événement de durée nulle."
      };

      for (let step = 1; step <= 3; step++) {
        document.querySelectorAll(`#mini-gantt-board [data-step="${step}"]`).forEach((cell) => {
          cell.classList.add("show");
        });
        miniMsg.textContent = messages[step];
        await sleep(850);
      }
      miniPlay.disabled = false;
    });
  }

  miniReset?.addEventListener("click", resetMini);

  // ---------- Moteur de planification ----------
  function scheduleTasks(tasks) {
    const computed = {};
    let pending = [...tasks];

    while (pending.length) {
      let progress = false;

      pending = pending.filter((task) => {
        const deps = task.after || [];
        if (deps.every((dep) => computed[dep])) {
          const start = deps.length
            ? Math.max(...deps.map((dep) => computed[dep].end)) + 1
            : 1;
          const end = start + task.duration - 1;
          computed[task.id] = {...task, start, end};
          progress = true;
          return false;
        }
        return true;
      });

      if (!progress) break;
    }

    return computed;
  }

  function renderGantt(container, tasks, options = {}) {
    if (!container) return;

    const computed = scheduleTasks(tasks);
    const maxDay = Math.max(...Object.values(computed).map((t) => t.end));
    const critical = new Set(options.critical || []);

    let html = `<div class="gantt-chart" style="--days:${maxDay}">`;
    html += `<div class="gantt-chart-head gantt-chart-task">Tâche</div>`;
    for (let day = 1; day <= maxDay; day++) {
      html += `<div class="gantt-chart-head">J${day}</div>`;
    }

    tasks.forEach((task) => {
      const item = computed[task.id];
      const criticalClass = critical.has(task.id) ? " critical-task" : "";
      html += `<div class="gantt-chart-label${criticalClass}" data-task="${task.id}"><strong>${task.id}</strong> ${task.name}</div>`;
      for (let day = 1; day <= maxDay; day++) {
        const active = day >= item.start && day <= item.end;
        const classes = [
          "gantt-chart-cell",
          active ? "active" : "",
          active && critical.has(task.id) ? "critical" : "",
          active && options.animate ? "waiting" : ""
        ].filter(Boolean).join(" ");
        html += `<div class="${classes}" data-task="${task.id}" data-day="${day}"></div>`;
      }
    });

    html += `</div>`;
    container.innerHTML = html;
    return {computed, maxDay};
  }

  async function animateGantt(container, tasks, critical = []) {
    const result = renderGantt(container, tasks, {critical, animate:true});
    if (!result) return;
    for (const task of tasks) {
      const cells = container.querySelectorAll(`.gantt-chart-cell.active[data-task="${task.id}"]`);
      cells.forEach((cell) => cell.classList.remove("waiting"));
      const label = container.querySelector(`.gantt-chart-label[data-task="${task.id}"]`);
      label?.classList.add("current-task");
      await sleep(480);
      label?.classList.remove("current-task");
    }
  }

  // ---------- Station météo ----------
  const weatherTasks = [
    {id:"A", name:"Cahier des charges", duration:2, after:[]},
    {id:"B", name:"Étude des capteurs", duration:3, after:["A"]},
    {id:"C", name:"Carte électronique", duration:4, after:["B"]},
    {id:"D", name:"Programme du capteur", duration:5, after:["C"]},
    {id:"E", name:"Maquette du boîtier", duration:3, after:["B"]},
    {id:"F", name:"Tests et validation", duration:2, after:["D","E"]}
  ];
  const weatherCritical = ["A","B","C","D","F"];
  const weatherContainer = document.getElementById("weather-gantt");

  renderGantt(weatherContainer, weatherTasks);

  document.getElementById("weather-play")?.addEventListener("click", async (event) => {
    event.currentTarget.disabled = true;
    await animateGantt(weatherContainer, weatherTasks);
    event.currentTarget.disabled = false;
  });

  document.getElementById("weather-critical")?.addEventListener("click", () => {
    renderGantt(weatherContainer, weatherTasks, {critical:weatherCritical});
  });

  document.getElementById("weather-reset")?.addEventListener("click", () => {
    renderGantt(weatherContainer, weatherTasks);
  });

  // ---------- Borne solaire ----------
  const solarContainer = document.getElementById("solar-gantt");
  const solarSlider = document.getElementById("solar-d-duration");

  function solarTasks(durationD) {
    return [
      {id:"A", name:"Étude du besoin", duration:1, after:[]},
      {id:"B", name:"Choix des composants", duration:2, after:["A"]},
      {id:"C", name:"Schéma électrique", duration:2, after:["B"]},
      {id:"D", name:"Modèle du support", duration:durationD, after:["A"]},
      {id:"E", name:"Assemblage", duration:2, after:["C","D"]},
      {id:"F", name:"Tests et validation", duration:2, after:["E"]},
      {id:"G", name:"Présentation", duration:1, after:["F"]}
    ];
  }

  function renderSolar() {
    const dDuration = Number(solarSlider?.value || 3);
    const tasks = solarTasks(dDuration);
    const computed = scheduleTasks(tasks);
    const initialEnd = 10;
    const projectEnd = computed.G.end;
    const delay = projectEnd - initialEnd;

    // Chemin critique : initialement branche C ; au-delà de 4 j, branche D.
    const critical = dDuration <= 4
      ? ["A","B","C","E","F","G"]
      : ["A","D","E","F","G"];

    renderGantt(solarContainer, tasks, {critical});

    document.getElementById("solar-d-duration-value").textContent = dDuration;
    document.getElementById("solar-d-duration-label").textContent = `${dDuration} j`;
    document.getElementById("solar-d-end").textContent = `J${computed.D.end}`;
    document.getElementById("solar-e-start").textContent = `J${computed.E.start}`;
    document.getElementById("solar-g-end").textContent = `J${projectEnd}`;
    document.getElementById("solar-project-delay").textContent =
      delay === 0 ? "0 jour" : `${delay} jour${delay > 1 ? "s" : ""}`;

    const message = document.getElementById("solar-message");
    if (dDuration === 3) {
      message.textContent = "D finit J4. E attend aussi C, qui finit J5 : D possède donc 1 jour de marge.";
    } else if (dDuration === 4) {
      message.textContent = "D finit J5 comme C : la marge de D est consommée, mais E commence encore J6. La date finale ne change pas.";
    } else if (dDuration === 5) {
      message.textContent = "D finit J6. E ne peut commencer que J7 : D prend 2 jours de plus, mais le projet ne prend qu'1 jour de retard.";
    } else {
      message.textContent = `D finit J${computed.D.end}. La branche D devient la branche qui fixe le début de E et la fin du projet.`;
    }
  }

  solarSlider?.addEventListener("input", renderSolar);

  document.querySelectorAll("[data-duration]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!solarSlider) return;
      solarSlider.value = button.dataset.duration;
      renderSolar();
    });
  });

  renderSolar();

  // ---------- Quiz ----------
  const quiz = document.getElementById("gantt-quiz");
  const score = document.getElementById("gantt-quiz-score");

  quiz?.addEventListener("submit", (event) => {
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
    score.textContent =
      answered < fields.length
        ? `Tu as répondu à ${answered}/${fields.length}. Score : ${points}/${fields.length}.`
        : `Score : ${points}/${fields.length}.`;
  });

  quiz?.addEventListener("reset", () => {
    quiz.querySelectorAll("fieldset").forEach((field) => {
      field.classList.remove("correct","incorrect");
    });
    score.textContent = "";
    score.classList.remove("visible");
  });

  resetMini();
})();