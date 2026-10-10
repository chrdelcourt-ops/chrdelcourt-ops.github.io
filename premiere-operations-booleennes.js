(() => {
  "use strict";

  let A = 0;
  let B = 0;

  const toggleA = document.getElementById("logic-a");
  const toggleB = document.getElementById("logic-b");
  const explain = document.getElementById("logic-explain");

  function setToggle(button, value) {
    button?.setAttribute("aria-pressed", value ? "true" : "false");
    const strong = button?.querySelector("strong");
    if (strong) strong.textContent = value;
    button?.classList.toggle("active", Boolean(value));
  }

  function updateLogic() {
    const notA = A ? 0 : 1;
    const and = A && B ? 1 : 0;
    const or = A || B ? 1 : 0;
    const nand = and ? 0 : 1;
    const nor = or ? 0 : 1;
    const xor = A !== B ? 1 : 0;

    setToggle(toggleA, A);
    setToggle(toggleB, B);

    const values = {
      "out-not": notA,
      "out-and": and,
      "out-or": or,
      "out-nand": nand,
      "out-nor": nor,
      "out-xor": xor
    };

    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value;
        el.closest("article")?.classList.toggle("logic-one", value === 1);
      }
    });

    if (explain) {
      explain.textContent =
        `A=${A} et B=${B} : ET=${and}, OU=${or}, NAND=${nand}, NOR=${nor}, XOR=${xor}.`;
    }
  }

  toggleA?.addEventListener("click", () => {
    A = A ? 0 : 1;
    updateLogic();
  });

  toggleB?.addEventListener("click", () => {
    B = B ? 0 : 1;
    updateLogic();
  });

  function expectedForRow(row) {
    const a = Number(row.dataset.a);
    const b = Number(row.dataset.b);
    const c = Number(row.dataset.c);
    const notA = a ? 0 : 1;
    const bc = b && c ? 1 : 0;
    const f = notA || bc ? 1 : 0;
    return [notA, bc, f];
  }

  const ex1Rows = [...document.querySelectorAll("#ex1-table tr")];
  const resultEx1 = document.getElementById("result-ex1");

  document.querySelectorAll("#ex1-table input").forEach(input => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^01]/g, "").slice(0, 1);
      input.classList.remove("ok", "bad");
    });
  });

  document.getElementById("check-ex1")?.addEventListener("click", () => {
    let correct = 0;
    let total = 0;

    ex1Rows.forEach(row => {
      const expected = expectedForRow(row);
      const inputs = [...row.querySelectorAll("input")];
      inputs.forEach((input, index) => {
        total++;
        input.classList.remove("ok", "bad");
        if (input.value === String(expected[index])) {
          correct++;
          input.classList.add("ok");
        } else {
          input.classList.add("bad");
        }
      });
    });

    if (resultEx1) {
      resultEx1.textContent = `${correct}/${total} cases correctes`;
      resultEx1.className = "exercise-result visible " + (correct === total ? "success" : "partial");
    }
  });

  document.getElementById("reset-ex1")?.addEventListener("click", () => {
    document.querySelectorAll("#ex1-table input").forEach(input => {
      input.value = "";
      input.classList.remove("ok", "bad");
    });
    if (resultEx1) {
      resultEx1.textContent = "";
      resultEx1.className = "exercise-result";
    }
  });


  // ---------- Animations pédagogiques ----------
  const demoButtons = [...document.querySelectorAll(".logic-demo-run")];

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function setNode(card, name, value) {
    const node = card.querySelector(`[data-node="${name}"]`);
    if (!node) return;
    const strong = node.querySelector("strong");
    if (strong) strong.textContent = value;
    node.classList.toggle("signal-on", value === 1);
  }

  function pulseWire(card, name, on) {
    const wire = card.querySelector(`[data-wire="${name}"]`);
    if (!wire) return;
    wire.classList.remove("pulse", "signal-on");
    void wire.offsetWidth;
    if (on) wire.classList.add("signal-on");
    wire.classList.add("pulse");
  }

  function setLamp(card, value) {
    const lamp = card.querySelector('[data-lamp="out"]');
    if (!lamp) return;
    const strong = lamp.querySelector("strong");
    if (strong) strong.textContent = value;
    lamp.classList.toggle("signal-on", value === 1);
  }

  async function runGateDemo(type, button) {
    const card = document.getElementById(`demo-${type}`);
    const caption = document.getElementById(`caption-${type}`);
    if (!card || !caption) return;

    const combos = [[0,0],[0,1],[1,0],[1,1]];
    button.disabled = true;

    for (const [a,b] of combos) {
      const out = type === "and"
        ? (a && b ? 1 : 0)
        : (a !== b ? 1 : 0);

      setNode(card, "a", a);
      setNode(card, "b", b);
      setLamp(card, 0);

      pulseWire(card, "a", a);
      pulseWire(card, "b", b);
      caption.textContent = `A=${a}, B=${b} : les deux entrées arrivent à la porte ${type === "and" ? "ET" : "XOR"}…`;
      await wait(650);

      pulseWire(card, "out", out);
      setLamp(card, out);
      caption.textContent = type === "and"
        ? `A=${a}, B=${b} → ET = ${out}. La sortie vaut 1 seulement pour 1 et 1.`
        : `A=${a}, B=${b} → XOR = ${out}. La sortie vaut 1 seulement si les entrées sont différentes.`;
      await wait(900);
    }

    button.disabled = false;
  }

  async function runExpressionDemo(button) {
    const card = document.getElementById("demo-expr");
    const caption = document.getElementById("caption-expr");
    if (!card || !caption) return;

    button.disabled = true;
    const stages = [...card.querySelectorAll("[data-stage]")];
    stages.forEach(s => s.classList.remove("active"));

    setNode(card, "a", 0);
    setNode(card, "b", 1);
    setNode(card, "c", 0);

    caption.textContent = "Entrées choisies : A=0, B=1, C=0.";
    await wait(700);

    const notStage = card.querySelector('[data-stage="not"]');
    notStage?.classList.add("active");
    caption.textContent = "Étape 1 : NON A. Comme A=0, ¬A=1.";
    await wait(950);

    const andStage = card.querySelector('[data-stage="and"]');
    andStage?.classList.add("active");
    caption.textContent = "Étape 2 : B ET C. 1 ET 0 donne 0.";
    await wait(950);

    const orStage = card.querySelector('[data-stage="or"]');
    orStage?.classList.add("active");
    caption.textContent = "Étape 3 : ¬A OU (B·C). 1 OU 0 donne F=1.";
    await wait(1100);

    button.disabled = false;
  }

  demoButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const demo = button.dataset.demo;
      if (demo === "and" || demo === "xor") {
        await runGateDemo(demo, button);
      } else if (demo === "expr") {
        await runExpressionDemo(button);
      }
    });
  });

  updateLogic();
})();