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

  updateLogic();
})();