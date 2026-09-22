(() => {
  "use strict";

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Lecture du premier Gantt
  const readPlay = document.getElementById("read-play");
  const readReset = document.getElementById("read-reset");
  const readMessage = document.getElementById("read-message");

  const readTexts = {
    1: "J1 : analyser le besoin.",
    2: "J2 : choisir le capteur après l'analyse.",
    3: "J3–J4 : câbler le capteur. C'est la tâche la plus longue de cet exemple.",
    4: "J5 : tester la mesure, uniquement après la fin du câblage."
  };

  function resetRead() {
    document.querySelectorAll("#read-board [data-read]").forEach(el => el.classList.remove("show"));
    if (readMessage) readMessage.textContent = "Une barre colorée montre la période prévue pour réaliser une tâche.";
  }

  readPlay?.addEventListener("click", async () => {
    resetRead();
    readPlay.disabled = true;
    for (let i = 1; i <= 4; i++) {
      document.querySelectorAll(`#read-board [data-read="${i}"]`).forEach(el => el.classList.add("show"));
      readMessage.textContent = readTexts[i];
      await sleep(700);
    }
    readPlay.disabled = false;
  });
  readReset?.addEventListener("click", resetRead);

  // Moteur de planification
  function compute(tasks) {
    const result = {};
    let pending = [...tasks];
    while (pending.length) {
      let progress = false;
      pending = pending.filter(task => {
        const deps = task.after || [];
        if (deps.every(d => result[d])) {
          const start = deps.length ? Math.max(...deps.map(d => result[d].end)) + 1 : 1;
          const end = start + task.duration - 1;
          result[task.id] = {...task, start, end};
          progress = true;
          return false;
        }
        return true;
      });
      if (!progress) break;
    }
    return result;
  }

  function render(container, tasks, options = {}) {
    if (!container) return null;
    const result = compute(tasks);
    const maxDay = Math.max(...Object.values(result).map(t => t.end));
    const critical = new Set(options.critical || []);

    let html = `<div class="gantt-chart" style="--days:${maxDay}">`;
    html += `<div class="gantt-chart-head gantt-chart-task">Tâche</div>`;
    for (let d = 1; d <= maxDay; d++) html += `<div class="gantt-chart-head">J${d}</div>`;

    tasks.forEach(task => {
      const t = result[task.id];
      html += `<div class="gantt-chart-label${critical.has(task.id) ? " critical-task" : ""}" data-task="${task.id}"><strong>${task.id}</strong> ${task.name}</div>`;
      for (let d = 1; d <= maxDay; d++) {
        const active = d >= t.start && d <= t.end;
        const classes = [
          "gantt-chart-cell",
          active ? "active" : "",
          active && critical.has(task.id) ? "critical" : "",
          active && options.animate ? "waiting" : ""
        ].filter(Boolean).join(" ");
        html += `<div class="${classes}" data-task="${task.id}" data-day="${d}"></div>`;
      }
    });
    html += "</div>";
    container.innerHTML = html;
    return {result, maxDay};
  }

  async function animate(container, tasks) {
    render(container, tasks, {animate:true});
    for (const task of tasks) {
      const label = container.querySelector(`.gantt-chart-label[data-task="${task.id}"]`);
      label?.classList.add("current-task");
      container.querySelectorAll(`.gantt-chart-cell.active[data-task="${task.id}"]`).forEach(c => c.classList.remove("waiting"));
      await sleep(420);
      label?.classList.remove("current-task");
    }
  }

  // Station météo
  const weather = [
    {id:"A",name:"Analyser le besoin",duration:1,after:[]},
    {id:"B",name:"Choisir les composants",duration:2,after:["A"]},
    {id:"C",name:"Concevoir le boîtier",duration:2,after:["A"]},
    {id:"D",name:"Programmer l'acquisition",duration:3,after:["B"]},
    {id:"E",name:"Fabriquer le boîtier",duration:2,after:["C"]},
    {id:"F",name:"Intégrer et câbler",duration:2,after:["D","E"]},
    {id:"G",name:"Tester et valider",duration:2,after:["F"]},
    {id:"H",name:"Présenter le résultat",duration:1,after:["G"]}
  ];
  const weatherCritical = ["A","B","D","F","G","H"];
  const weatherBox = document.getElementById("weather-gantt");

  render(weatherBox, weather);

  document.getElementById("weather-play")?.addEventListener("click", async e => {
    e.currentTarget.disabled = true;
    await animate(weatherBox, weather);
    e.currentTarget.disabled = false;
  });
  document.getElementById("weather-critical")?.addEventListener("click", () => {
    render(weatherBox, weather, {critical:weatherCritical});
  });
  document.getElementById("weather-reset")?.addEventListener("click", () => {
    render(weatherBox, weather);
    document.getElementById("weather-milestone-list").hidden = true;
  });
  document.getElementById("weather-milestones")?.addEventListener("click", () => {
    const el = document.getElementById("weather-milestone-list");
    el.hidden = !el.hidden;
  });

  // Borne USB solaire
  const solarBox = document.getElementById("solar-gantt");
  const slider = document.getElementById("solar-d-duration");

  function solarTasks(dDuration) {
    return [
      {id:"A",name:"Analyser besoin / contraintes",duration:1,after:[]},
      {id:"B",name:"Choisir panneau / batterie",duration:2,after:["A"]},
      {id:"C",name:"Modéliser chaîne d'énergie",duration:2,after:["A"]},
      {id:"D",name:"Concevoir le boîtier",duration:dDuration,after:["A"]},
      {id:"E",name:"Programmer suivi de charge",duration:2,after:["B"]},
      {id:"F",name:"Assembler l'électronique",duration:2,after:["B","C"]},
      {id:"G",name:"Fabriquer le support",duration:2,after:["D"]},
      {id:"H",name:"Intégrer le système",duration:2,after:["E","F","G"]},
      {id:"I",name:"Tester l'autonomie",duration:2,after:["H"]},
      {id:"J",name:"Présenter la solution",duration:1,after:["I"]}
    ];
  }

  function updateSolar() {
    const durationD = Number(slider?.value || 3);
    const tasks = solarTasks(durationD);
    const calc = compute(tasks);
    const baseEnd = 11;
    const delay = calc.J.end - baseEnd;

    // La branche D-G est critique dans la situation initiale.
    const critical = ["A","D","G","H","I","J"];
    render(solarBox, tasks, {critical});

    document.getElementById("solar-d-duration-value").textContent = durationD;
    document.getElementById("solar-d-duration-label").textContent = `${durationD} j`;
    document.getElementById("solar-d-end").textContent = `J${calc.D.end}`;
    document.getElementById("solar-h-start").textContent = `J${calc.H.start}`;
    document.getElementById("solar-j-end").textContent = `J${calc.J.end}`;
    document.getElementById("solar-project-delay").textContent =
      delay === 0 ? "0 jour" : `${delay} jour${delay > 1 ? "s" : ""}`;

    const msg = document.getElementById("solar-message");
    if (durationD === 3) {
      msg.textContent = "Situation prévue : D finit J4, G occupe J5–J6, H commence J7 et la présentation a lieu J11.";
    } else if (durationD === 4) {
      msg.textContent = "D prend 1 jour de retard : G se décale à J6–J7, H commence J8 et la présentation passe à J12.";
    } else {
      msg.textContent = `D dure ${durationD} jours : la branche D → G décale H, puis I et J. La présentation passe à J${calc.J.end}.`;
    }
  }

  slider?.addEventListener("input", updateSolar);
  document.querySelectorAll("[data-duration]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!slider) return;
      slider.value = btn.dataset.duration;
      updateSolar();
    });
  });
  updateSolar();

  // Quiz
  const quiz = document.getElementById("gantt-quiz");
  const score = document.getElementById("gantt-quiz-score");
  quiz?.addEventListener("submit", e => {
    e.preventDefault();
    const fields = [...quiz.querySelectorAll("fieldset[data-correct]")];
    let ok = 0;
    let answered = 0;
    fields.forEach(field => {
      field.classList.remove("correct","incorrect");
      const selected = field.querySelector("input:checked");
      if (!selected) return;
      answered++;
      if (selected.value === field.dataset.correct) {
        ok++;
        field.classList.add("correct");
      } else {
        field.classList.add("incorrect");
      }
    });
    score.classList.add("visible");
    score.textContent = answered < fields.length
      ? `Réponses : ${answered}/${fields.length} • Score : ${ok}/${fields.length}`
      : `Score : ${ok}/${fields.length}`;
  });
  quiz?.addEventListener("reset", () => {
    quiz.querySelectorAll("fieldset").forEach(f => f.classList.remove("correct","incorrect"));
    score.textContent = "";
    score.classList.remove("visible");
  });

  resetRead();
})();