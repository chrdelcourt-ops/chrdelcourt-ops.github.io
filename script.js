
document.addEventListener("DOMContentLoaded", () => {
  // Question flash de la page d'accueil
  const homeButtons = document.querySelectorAll("[data-home-answer]");
  const homeResult = document.getElementById("home-result");

  homeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.homeAnswer === "true";
      if (!homeResult) return;
      if (correct) {
        homeResult.textContent = "✓ Bonne réponse. Le DNS permet notamment d'associer un nom de domaine à une adresse IP.";
        homeResult.style.color = "#16845b";
      } else {
        homeResult.textContent = "✗ Ce n'est pas la bonne réponse. Essaie encore.";
        homeResult.style.color = "#9a6410";
      }
    });
  });

  // Quiz complet du thème Internet
  const quiz = document.getElementById("internet-quiz");
  const scoreBox = document.getElementById("quiz-score");

  if (quiz) {
    quiz.addEventListener("submit", (event) => {
      event.preventDefault();

      const questions = [...quiz.querySelectorAll("fieldset[data-correct]")];
      let score = 0;
      let answered = 0;

      questions.forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
        const selected = fieldset.querySelector("input[type='radio']:checked");

        if (!selected) return;
        answered += 1;

        if (selected.value === fieldset.dataset.correct) {
          score += 1;
          fieldset.classList.add("correct");
        } else {
          fieldset.classList.add("incorrect");
        }
      });

      if (scoreBox) {
        scoreBox.classList.add("visible");

        if (answered < questions.length) {
          scoreBox.textContent = `Tu as répondu à ${answered} question(s) sur ${questions.length}. Score provisoire : ${score}/${questions.length}.`;
        } else if (score === questions.length) {
          scoreBox.textContent = `Excellent : ${score}/${questions.length}. Toutes les réponses sont correctes.`;
        } else if (score >= 6) {
          scoreBox.textContent = `Très bien : ${score}/${questions.length}. Relis seulement les questions en rouge.`;
        } else if (score >= 4) {
          scoreBox.textContent = `Score : ${score}/${questions.length}. Revois la fiche « À retenir », puis recommence.`;
        } else {
          scoreBox.textContent = `Score : ${score}/${questions.length}. Relis le cours avant une nouvelle tentative.`;
        }
      }
    });

    quiz.addEventListener("reset", () => {
      quiz.querySelectorAll("fieldset").forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
      });
      if (scoreBox) {
        scoreBox.textContent = "";
        scoreBox.classList.remove("visible");
      }
    });
  }


  // Quiz complet du thème Web
  const webQuiz = document.getElementById("web-quiz");
  const webScore = document.getElementById("web-score");

  if (webQuiz) {
    webQuiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = [...webQuiz.querySelectorAll("fieldset[data-correct]")];
      let score = 0;
      let answered = 0;

      questions.forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
        const selected = fieldset.querySelector("input[type='radio']:checked");
        if (!selected) return;
        answered += 1;

        if (selected.value === fieldset.dataset.correct) {
          score += 1;
          fieldset.classList.add("correct");
        } else {
          fieldset.classList.add("incorrect");
        }
      });

      if (webScore) {
        webScore.classList.add("visible");
        if (answered < questions.length) {
          webScore.textContent = `Tu as répondu à ${answered} question(s) sur ${questions.length}. Score provisoire : ${score}/${questions.length}.`;
        } else if (score === questions.length) {
          webScore.textContent = `Excellent : ${score}/${questions.length}. Toutes les réponses sont correctes.`;
        } else if (score >= 8) {
          webScore.textContent = `Très bien : ${score}/${questions.length}.`;
        } else if (score >= 5) {
          webScore.textContent = `Score : ${score}/${questions.length}. Revois la fiche « À retenir », puis recommence.`;
        } else {
          webScore.textContent = `Score : ${score}/${questions.length}. Relis le cours avant une nouvelle tentative.`;
        }
      }
    });

    webQuiz.addEventListener("reset", () => {
      webQuiz.querySelectorAll("fieldset").forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
      });
      if (webScore) {
        webScore.textContent = "";
        webScore.classList.remove("visible");
      }
    });
  }



  // ===== Numération / Terminale STI2D =====
  const decimalInput = document.getElementById("decimal-input");
  const convertNumberBtn = document.getElementById("convert-number");
  const conversionResult = document.getElementById("conversion-result");

  if (convertNumberBtn && decimalInput && conversionResult) {
    convertNumberBtn.addEventListener("click", () => {
      const value = Number(decimalInput.value);
      const outputs = conversionResult.querySelectorAll("strong");
      if (!Number.isInteger(value) || value < 0) {
        outputs[0].textContent = "Valeur invalide";
        outputs[1].textContent = "Valeur invalide";
        return;
      }
      outputs[0].textContent = value.toString(2);
      outputs[1].textContent = value.toString(16).toUpperCase();
    });
  }

  const bitsInput = document.getElementById("bits-input");
  const calcRangeBtn = document.getElementById("calc-range");
  const rangeResult = document.getElementById("range-result");

  if (calcRangeBtn && bitsInput && rangeResult) {
    calcRangeBtn.addEventListener("click", () => {
      const n = Number(bitsInput.value);
      const outputs = rangeResult.querySelectorAll("strong");
      if (!Number.isInteger(n) || n < 1 || n > 31) {
        outputs[0].textContent = "Choisir 1 à 31 bits";
        outputs[1].textContent = "Choisir 1 à 31 bits";
        return;
      }
      const unsignedMax = (2 ** n) - 1;
      const signedMin = -(2 ** (n - 1));
      const signedMax = (2 ** (n - 1)) - 1;
      outputs[0].textContent = `0 à ${unsignedMax.toLocaleString("fr-FR")}`;
      outputs[1].textContent = `${signedMin.toLocaleString("fr-FR")} à ${signedMax.toLocaleString("fr-FR")}`;
    });
  }

  const asciiInput = document.getElementById("ascii-input");
  const asciiBtn = document.getElementById("convert-ascii");
  const asciiResult = document.getElementById("ascii-result");

  if (asciiBtn && asciiInput && asciiResult) {
    asciiBtn.addEventListener("click", () => {
      const char = asciiInput.value;
      const outputs = asciiResult.querySelectorAll("strong");
      if (!char) {
        outputs.forEach((o) => o.textContent = "—");
        return;
      }
      const code = char.charCodeAt(0);
      if (code > 127) {
        outputs[0].textContent = "hors ASCII";
        outputs[1].textContent = "hors ASCII";
        outputs[2].textContent = "hors ASCII";
        return;
      }
      outputs[0].textContent = code;
      outputs[1].textContent = code.toString(16).toUpperCase().padStart(2, "0");
      outputs[2].textContent = code.toString(2).padStart(8, "0");
    });
  }

  const numQuiz = document.getElementById("numeration-quiz");
  const numScore = document.getElementById("numeration-score");

  if (numQuiz && numScore) {
    numQuiz.addEventListener("submit", (event) => {
      event.preventDefault();
      const questions = [...numQuiz.querySelectorAll("fieldset[data-correct]")];
      let score = 0;
      let answered = 0;

      questions.forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
        const selected = fieldset.querySelector("input[type='radio']:checked");
        if (!selected) return;
        answered++;
        if (selected.value === fieldset.dataset.correct) {
          score++;
          fieldset.classList.add("correct");
        } else {
          fieldset.classList.add("incorrect");
        }
      });

      numScore.classList.add("visible");
      if (answered < questions.length) {
        numScore.textContent = `Tu as répondu à ${answered}/${questions.length} questions. Score provisoire : ${score}/${questions.length}.`;
      } else if (score === questions.length) {
        numScore.textContent = `Excellent : ${score}/${questions.length}.`;
      } else if (score >= 4) {
        numScore.textContent = `Très bien : ${score}/${questions.length}. Revois la question en rouge.`;
      } else {
        numScore.textContent = `Score : ${score}/${questions.length}. Revois les chapitres correspondants puis recommence.`;
      }
    });

    numQuiz.addEventListener("reset", () => {
      numQuiz.querySelectorAll("fieldset").forEach((fieldset) => fieldset.classList.remove("correct", "incorrect"));
      numScore.textContent = "";
      numScore.classList.remove("visible");
    });
  }



  // ===== Première STI2D : Idéation & brainstorming =====
  const choiceRows = [...document.querySelectorAll("[data-choice-row]")];
  const choiceResult = document.getElementById("choice-result");

  function updateChoiceMatrix() {
    if (!choiceRows.length || !choiceResult) return;

    let bestScore = -1;
    let bestNames = [];

    choiceRows.forEach((row) => {
      const nameInput = row.querySelector('td:first-child input');
      const scores = [...row.querySelectorAll(".choice-score")].map((input) => {
        let value = Number(input.value);
        if (!Number.isFinite(value)) value = 0;
        value = Math.max(1, Math.min(5, value));
        input.value = value;
        return value;
      });

      const total = scores.reduce((sum, value) => sum + value, 0);
      const totalCell = row.querySelector(".choice-total");
      if (totalCell) totalCell.textContent = total;

      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Solution";
      if (total > bestScore) {
        bestScore = total;
        bestNames = [name];
      } else if (total === bestScore) {
        bestNames.push(name);
      }
    });

    if (bestScore >= 0) {
      if (bestNames.length === 1) {
        choiceResult.textContent = `Score le plus élevé : ${bestNames[0]} avec ${bestScore}/20. Le groupe doit maintenant justifier ce choix.`;
      } else {
        choiceResult.textContent = `Égalité à ${bestScore}/20 entre : ${bestNames.join(", ")}. Discutez des critères prioritaires pour départager les solutions.`;
      }
    }
  }

  choiceRows.forEach((row) => {
    row.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", updateChoiceMatrix);
    });
  });
  updateChoiceMatrix();

  const pitchText = document.getElementById("pitch-text");
  const pitchCount = document.getElementById("pitch-count");
  if (pitchText && pitchCount) {
    const updatePitchCount = () => {
      pitchCount.textContent = pitchText.value.length;
    };
    pitchText.addEventListener("input", updatePitchCount);
    updatePitchCount();
  }

  const ideationQuiz = document.getElementById("ideation-quiz");
  const ideationScore = document.getElementById("ideation-score");

  if (ideationQuiz && ideationScore) {
    ideationQuiz.addEventListener("submit", (event) => {
      event.preventDefault();

      const questions = [...ideationQuiz.querySelectorAll("fieldset[data-correct]")];
      let score = 0;
      let answered = 0;

      questions.forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
        const selected = fieldset.querySelector("input[type='radio']:checked");
        if (!selected) return;

        answered++;
        if (selected.value === fieldset.dataset.correct) {
          score++;
          fieldset.classList.add("correct");
        } else {
          fieldset.classList.add("incorrect");
        }
      });

      ideationScore.classList.add("visible");

      if (answered < questions.length) {
        ideationScore.textContent = `Tu as répondu à ${answered}/${questions.length} questions. Score provisoire : ${score}/${questions.length}.`;
      } else if (score === questions.length) {
        ideationScore.textContent = `Excellent : ${score}/${questions.length}. Les notions essentielles sont acquises.`;
      } else if (score >= 6) {
        ideationScore.textContent = `Très bien : ${score}/${questions.length}. Revois seulement les questions en rouge.`;
      } else if (score >= 4) {
        ideationScore.textContent = `Score : ${score}/${questions.length}. Relis la méthode brainstorming et la partie choix de solution.`;
      } else {
        ideationScore.textContent = `Score : ${score}/${questions.length}. Reprends le cours depuis la partie idéation, puis réessaie.`;
      }
    });

    ideationQuiz.addEventListener("reset", () => {
      ideationQuiz.querySelectorAll("fieldset").forEach((fieldset) => {
        fieldset.classList.remove("correct", "incorrect");
      });
      ideationScore.textContent = "";
      ideationScore.classList.remove("visible");
    });
  }


  const sntDecimal=document.getElementById("snt-decimal");
  const sntDecimalBtn=document.getElementById("snt-convert-decimal");
  const sntDecimalResult=document.getElementById("snt-decimal-result");
  if(sntDecimal&&sntDecimalBtn&&sntDecimalResult){
    sntDecimalBtn.addEventListener("click",()=>{
      const v=Number(sntDecimal.value),o=sntDecimalResult.querySelectorAll("strong");
      if(!Number.isInteger(v)||v<0||v>255){o[0].textContent="0 à 255";o[1].textContent="0 à 255";return;}
      o[0].textContent=v.toString(2).padStart(8,"0");
      o[1].textContent=v.toString(16).toUpperCase().padStart(2,"0");
    });
  }

  const sntBinary=document.getElementById("snt-binary");
  const sntBinaryBtn=document.getElementById("snt-convert-binary");
  const sntBinaryResult=document.getElementById("snt-binary-result");
  if(sntBinary&&sntBinaryBtn&&sntBinaryResult){
    sntBinaryBtn.addEventListener("click",()=>{
      const raw=sntBinary.value.trim(),o=sntBinaryResult.querySelectorAll("strong");
      if(!/^[01]{1,8}$/.test(raw)){o[0].textContent="Binaire invalide";o[1].textContent="Binaire invalide";return;}
      const v=parseInt(raw,2);o[0].textContent=v;o[1].textContent=v.toString(16).toUpperCase().padStart(2,"0");
    });
  }

  const sizeMo=document.getElementById("snt-size-mo");
  const speed=document.getElementById("snt-speed");
  const transferBtn=document.getElementById("snt-transfer-calc");
  const transferResult=document.getElementById("snt-transfer-result");
  if(sizeMo&&speed&&transferBtn&&transferResult){
    transferBtn.addEventListener("click",()=>{
      const s=Number(sizeMo.value),d=Number(speed.value),o=transferResult.querySelector("strong");
      if(!(s>=0)||!(d>0)){o.textContent="Valeurs invalides";return;}
      const sec=s*8/d;
      o.textContent=sec<60?`${sec.toFixed(1)} s`:`${Math.floor(sec/60)} min ${Math.round(sec%60)} s`;
    });
  }

  const binaryQuiz=document.getElementById("binary-quiz");
  const binaryScore=document.getElementById("binary-score");
  if(binaryQuiz&&binaryScore){
    binaryQuiz.addEventListener("submit",(e)=>{
      e.preventDefault();const qs=[...binaryQuiz.querySelectorAll("fieldset[data-correct]")];
      let score=0,answered=0;
      qs.forEach(f=>{f.classList.remove("correct","incorrect");const s=f.querySelector("input[type='radio']:checked");if(!s)return;answered++;if(s.value===f.dataset.correct){score++;f.classList.add("correct")}else f.classList.add("incorrect")});
      binaryScore.classList.add("visible");
      binaryScore.textContent=answered<qs.length?`Tu as répondu à ${answered}/${qs.length}. Score : ${score}/${qs.length}.`:score===qs.length?`Excellent : ${score}/${qs.length}.`:`Score : ${score}/${qs.length}.`;
    });
    binaryQuiz.addEventListener("reset",()=>{binaryQuiz.querySelectorAll("fieldset").forEach(f=>f.classList.remove("correct","incorrect"));binaryScore.textContent="";binaryScore.classList.remove("visible")});
  }



  // ===== Animation pédagogique du routage =====
  const routingNormal=document.getElementById("routing-normal");
  const routingFailure=document.getElementById("routing-failure");
  const routingMulti=document.getElementById("routing-multi");
  const routingReset=document.getElementById("routing-reset");
  if(routingNormal&&routingFailure&&routingMulti&&routingReset){
    const p1=document.getElementById("routing-packet-1"),p2=document.getElementById("routing-packet-2"),p3=document.getElementById("routing-packet-3");
    const stepN=document.getElementById("routing-step-number"),stepT=document.getElementById("routing-step-title"),stepX=document.getElementById("routing-step-text"),failX=document.getElementById("routing-failure-x");
    const links={ar1:document.getElementById("route-link-a-r1"),r1r2:document.getElementById("route-link-r1-r2"),r2b:document.getElementById("route-link-r2-b"),r1r3:document.getElementById("route-link-r1-r3"),r3b:document.getElementById("route-link-r3-b")};
    const pts={A:[70,180],R1:[285,180],R2:[505,90],R3:[505,270],B:[810,180]};
    const normal=["A","R1","R2","B"],alternate=["A","R1","R3","B"];
    let run=0;
    const node=(name)=>document.querySelector(`.routing-node[data-node="${name}"]`);
    function msg(n,t,x){stepN.textContent=n;stepT.textContent=t;stepX.textContent=x}
    function reset(show=true){run++;[p1,p2,p3].forEach(p=>{p.classList.remove("visible");p.setAttribute("cx",70);p.setAttribute("cy",180)});Object.values(links).forEach(l=>l.classList.remove("active","broken"));failX.classList.remove("visible");document.querySelectorAll(".routing-node.current").forEach(n=>n.classList.remove("current"));if(show)msg("0","Choisis une animation","Le paquet part de A. Chaque routeur décide ensuite du prochain saut en fonction de la destination.")}
    function highlight(name){document.querySelectorAll(".routing-node.current").forEach(n=>n.classList.remove("current"));const n=node(name);if(n)n.classList.add("current")}
    function link(from,to){const map={"A-R1":"ar1","R1-R2":"r1r2","R2-B":"r2b","R1-R3":"r1r3","R3-B":"r3b"};const k=map[`${from}-${to}`];if(k)links[k].classList.add("active")}
    function animate(packet,a,b,duration,myRun){return new Promise(resolve=>{const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(reduce)duration=80;const start=performance.now();function frame(now){if(myRun!==run)return resolve(false);const u=Math.min(1,(now-start)/duration);const e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;packet.setAttribute("cx",a[0]+(b[0]-a[0])*e);packet.setAttribute("cy",a[1]+(b[1]-a[1])*e);if(u<1)requestAnimationFrame(frame);else resolve(true)}requestAnimationFrame(frame)})}
    async function route(path,packet,scenario="normal",delay=0,explain=true){const myRun=run;if(delay){await new Promise(r=>setTimeout(r,delay));if(myRun!==run)return}packet.classList.add("visible");for(let i=0;i<path.length-1;i++){const from=path[i],to=path[i+1];link(from,to);if(explain){highlight(from);if(from==="A")msg("1","A prépare le paquet","L'adresse IP de B est dans le paquet. A l'envoie vers le premier routeur.");else if(from==="R1"&&scenario==="failure")msg("2","R1 choisit une autre route","Le lien vers R2 est en panne : R1 envoie le paquet vers R3.");else if(from==="R1")msg("2","R1 choisit le prochain saut","R1 consulte ses informations de routage et transmet le paquet vers R2.");else if(from==="R2")msg("3","R2 rapproche le paquet de B","R2 connaît une route permettant de rejoindre le réseau de B.");else if(from==="R3")msg("3","R3 prend le relais","R3 permet au paquet de continuer vers la destination malgré la panne.")}
      const ok=await animate(packet,pts[from],pts[to],850,myRun);if(!ok)return;
    }if(explain){highlight("B");msg("4","Le paquet arrive à destination","B reçoit le paquet après plusieurs décisions successives de routage.")}}
    routingNormal.addEventListener("click",async()=>{reset(false);msg("1","Trajet normal","Chemin illustré : A → R1 → R2 → B.");await route(normal,p1,"normal",150,true)});
    routingFailure.addEventListener("click",async()=>{reset(false);links.r1r2.classList.add("broken");failX.classList.add("visible");msg("1","Un lien est en panne","La liaison R1 → R2 est indisponible. Une autre route est utilisée.");await route(alternate,p1,"failure",300,true)});
    routingMulti.addEventListener("click",async()=>{reset(false);msg("1","Plusieurs paquets sont envoyés","Observe que plusieurs paquets peuvent emprunter des chemins différents.");const myRun=run;await Promise.all([route(normal,p1,"normal",100,false),route(alternate,p2,"normal",450,false),route(normal,p3,"normal",800,false)]);if(myRun===run){highlight("B");msg("4","Les paquets arrivent à B","Ils ont pu emprunter des chemins différents avant d'atteindre la même destination.")}});
    routingReset.addEventListener("click",()=>reset(true));
    reset(true);
  }

});
