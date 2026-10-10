(() => {
  "use strict";
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const STORAGE_KEY = "snt_internet_revision_skills_v1";
  const checks = [...document.querySelectorAll("#revision-check-grid input[data-skill]")];
  const progressFill = document.getElementById("revision-progress-fill");
  const progressText = document.getElementById("revision-progress-text");

  function loadSkills() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}
    checks.forEach(input => input.checked = Boolean(saved[input.dataset.skill]));
    updateSkills();
  }
  function updateSkills() {
    const saved = {};
    checks.forEach(input => saved[input.dataset.skill] = input.checked);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (_) {}
    const done = checks.filter(input => input.checked).length;
    const pct = checks.length ? Math.round(done / checks.length * 100) : 0;
    if (progressFill) progressFill.style.width = pct + "%";
    if (progressText) progressText.textContent = done + " / " + checks.length + " maîtrisés";
  }
  checks.forEach(input => input.addEventListener("change", updateSkills));
  loadSkills();

  const routePacket = document.getElementById("route-packet");
  const routeMessage = document.getElementById("route-message");
  const routeBreak = document.getElementById("route-break");
  const routePlay = document.getElementById("route-play");
  let broken = false;
  const routePositions = [5,18,31,44,56,69,82,95];
  const routeMessages = [
    "P1 prépare un paquet pour T1.",
    "Le paquet rejoint SW-A dans le LAN A.",
    "SW-A transmet le paquet vers la passerelle.",
    "Le routeur R1 reçoit le paquet sur 192.168.1.254.",
    "R1 choisit la sortie vers le réseau 192.168.2.0/24.",
    "Le paquet atteint SW-B.",
    "SW-B transmet dans le LAN B.",
    "Le paquet arrive à T1 : 192.168.2.10."
  ];
  function resetRoute() {
    document.querySelectorAll(".route-link").forEach(link => link.classList.remove("active"));
    if (routePacket) { routePacket.classList.remove("visible"); routePacket.style.left = "5%"; }
    if (routeMessage) routeMessage.textContent = broken ? "Le lien R1 → SW-B est coupé : aucun chemin n'existe dans ce mini-réseau." : "P1 et T1 appartiennent à deux sous-réseaux différents : le paquet doit passer par le routeur.";
  }
  routeBreak?.addEventListener("click", () => {
    broken = !broken;
    document.querySelector('[data-link="r1-sw"]')?.classList.toggle("broken", broken);
    routeBreak.textContent = broken ? "Rétablir le lien R1 → SW-B" : "Couper le lien R1 → SW-B";
    resetRoute();
  });
  document.getElementById("route-reset")?.addEventListener("click", () => {
    broken = false;
    document.querySelector('[data-link="r1-sw"]')?.classList.remove("broken");
    if (routeBreak) routeBreak.textContent = "Couper le lien R1 → SW-B";
    resetRoute();
  });
  routePlay?.addEventListener("click", async () => {
    resetRoute();
    if (!routePacket || !routePlay) return;
    routePlay.disabled = true;
    routePacket.classList.add("visible");
    const links = [...document.querySelectorAll(".route-link")];
    for (let i = 0; i < routePositions.length; i++) {
      routePacket.style.left = routePositions[i] + "%";
      if (routeMessage) routeMessage.textContent = routeMessages[i];
      if (i > 0 && i - 1 < links.length) {
        if (broken && links[i - 1]?.dataset.link === "r1-sw") {
          routeMessage.textContent = "Échec : le lien R1 → SW-B est coupé. Le paquet ne peut pas atteindre T1.";
          break;
        }
        links[i - 1]?.classList.add("active");
      }
      await sleep(620);
    }
    routePlay.disabled = false;
  });

  const dnsPlay = document.getElementById("dns-play");
  const dnsMessage = document.getElementById("dns-message");
  function resetDns() {
    document.querySelectorAll("[data-dns-step]").forEach(step => step.classList.remove("active"));
    if (dnsMessage) dnsMessage.textContent = "D'abord le nom doit être traduit en adresse IP. Ensuite le navigateur contacte le serveur Web.";
  }
  document.getElementById("dns-reset")?.addEventListener("click", resetDns);
  dnsPlay?.addEventListener("click", async () => {
    resetDns();
    if (!dnsPlay) return;
    dnsPlay.disabled = true;
    const messages = ["P1 veut ouvrir www.snt-lab.fr.","P1 interroge le serveur DNS 192.168.2.20.","Le DNS répond : www.snt-lab.fr → 192.168.2.30.","Le navigateur contacte alors le serveur Web 192.168.2.30 et demande la page."];
    for (let i = 1; i <= 4; i++) {
      document.querySelector('[data-dns-step="' + i + '"]')?.classList.add("active");
      if (dnsMessage) dnsMessage.textContent = messages[i - 1];
      await sleep(850);
    }
    dnsPlay.disabled = false;
  });
  resetDns();

  const outputs = {
    ipconfig:{title:"ipconfig",output:"P1> ipconfig\\nAdresse IP : 192.168.1.10\\nMasque     : 255.255.255.0\\nPasserelle : 192.168.1.254\\nDNS        : 192.168.2.20",explain:"ipconfig sert à vérifier la configuration locale du poste : IP, masque, passerelle et DNS."},
    "ping-lan":{title:"ping 192.168.1.12",output:"P1> ping 192.168.1.12\\nRéponse de 192.168.1.12\\nRéponse de 192.168.1.12\\n\\nRésultat : P1 et P3 communiquent dans le même LAN.",explain:"Un ping vers une machine du même LAN vérifie la connectivité locale. Ici aucun routeur n'est nécessaire."},
    "ping-wan":{title:"ping 192.168.2.10",output:"P1> ping 192.168.2.10\\nRéponse de 192.168.2.10\\n\\nChemin logique : P1 → SW-A → R1 → SW-B → T1",explain:"Pour joindre un autre sous-réseau, P1 envoie le paquet à sa passerelle : le routeur R1."},
    tracert:{title:"tracert 192.168.2.10",output:"P1> tracert 192.168.2.10\\n1  192.168.1.254   R1\\n2  192.168.2.10    T1",explain:"tracert permet d'observer les étapes du chemin. Sur Internet réel, certains routeurs peuvent ne pas répondre."},
    nslookup:{title:"nslookup www.snt-lab.fr",output:"P1> nslookup www.snt-lab.fr\\nServeur DNS : 192.168.2.20\\nNom          : www.snt-lab.fr\\nAdresse      : 192.168.2.30",explain:"nslookup interroge le DNS : il relie le nom www.snt-lab.fr à l'adresse IP 192.168.2.30."}
  };
  document.querySelectorAll("[data-command]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-command]").forEach(b => b.classList.toggle("active", b === button));
    const item = outputs[button.dataset.command]; if (!item) return;
    document.getElementById("command-title").textContent = item.title;
    document.getElementById("command-output").textContent = item.output;
    document.getElementById("command-explain").textContent = item.explain;
  }));

  document.querySelectorAll(".diagnostic-card").forEach(card => {
    const answer = card.dataset.answer, result = card.querySelector(".diagnostic-result");
    card.querySelectorAll("[data-choice]").forEach(button => button.addEventListener("click", () => {
      card.querySelectorAll("[data-choice]").forEach(b => b.classList.remove("correct","incorrect"));
      const ok = button.dataset.choice === answer;
      button.classList.add(ok ? "correct" : "incorrect");
      if (result) { result.textContent = ok ? "Bon réflexe." : "Pas encore : procède du plus local vers le service concerné."; result.className = "diagnostic-result " + (ok ? "success" : "partial"); }
    }));
  });

  const quiz = document.getElementById("internet-ds-quiz"), score = document.getElementById("internet-ds-score");
  quiz?.addEventListener("submit", event => {
    event.preventDefault();
    const fields = [...quiz.querySelectorAll("fieldset[data-correct]")]; let correct = 0, answered = 0;
    fields.forEach(field => {
      field.classList.remove("correct","incorrect"); const selected = field.querySelector("input:checked"); if (!selected) return; answered++;
      if (selected.value === field.dataset.correct) { correct++; field.classList.add("correct"); } else field.classList.add("incorrect");
    });
    if (!score) return;
    const pct = Math.round(correct / fields.length * 100);
    score.textContent = answered < fields.length ? "Tu as répondu à " + answered + " / " + fields.length + " questions. Score actuel : " + correct + " / " + fields.length + "." : "Score : " + correct + " / " + fields.length + " (" + pct + " %).";
    score.className = "internet-ds-score " + (pct >= 75 ? "good" : "review");
    if (answered === fields.length) score.textContent += pct >= 90 ? " Très bonne maîtrise du thème." : pct >= 75 ? " Bon niveau : reprends seulement les erreurs." : " Reprends les notions indiquées en rouge puis recommence.";
  });
  quiz?.addEventListener("reset", () => { quiz.querySelectorAll("fieldset").forEach(field => field.classList.remove("correct","incorrect")); if (score) { score.textContent = ""; score.className = "internet-ds-score"; } });
  resetRoute();
})();