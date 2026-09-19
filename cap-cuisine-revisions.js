(() => {
  "use strict";
  const cards=[...document.querySelectorAll(".qa-card")];
  const count=document.getElementById("cap-mastered-count");
  const bar=document.getElementById("cap-mastered-bar");
  function update(){const n=cards.filter(c=>c.classList.contains("mastered")).length;if(count)count.textContent=n;if(bar)bar.style.width=`${n/cards.length*100}%`;}
  cards.forEach(card=>{
    const answer=card.querySelector(".qa-answer"), toggle=card.querySelector(".qa-toggle"), master=card.querySelector(".qa-master"), review=card.querySelector(".qa-review");
    toggle?.addEventListener("click",()=>{answer.hidden=!answer.hidden;toggle.textContent=answer.hidden?"Voir la réponse":"Masquer la réponse";});
    master?.addEventListener("click",()=>{card.classList.add("mastered");card.classList.remove("to-review");update();});
    review?.addEventListener("click",()=>{card.classList.remove("mastered");card.classList.add("to-review");update();});
  });
  const num=(id)=>Number(document.getElementById(id).value.trim().replace(",","."));
  document.getElementById("cap-conv-run")?.addEventListener("click",()=>{
    const v=num("cap-conv-value"), from=document.getElementById("cap-conv-from").value, to=document.getElementById("cap-conv-to").value, out=document.getElementById("cap-conv-result");
    const mass={kg:1000,g:1}, vol={L:1000,cL:10,mL:1};
    const group=from in mass?mass:vol;
    if(!(to in group)||!Number.isFinite(v)){out.textContent="Unités incompatibles";return;}
    out.textContent=`${(v*group[from]/group[to]).toLocaleString("fr-FR",{maximumFractionDigits:4})} ${to}`;
  });
  document.getElementById("cap-rec-run")?.addEventListener("click",()=>{
    const b=Number(document.getElementById("cap-rec-base").value), t=Number(document.getElementById("cap-rec-target").value), q=num("cap-rec-qty");
    const out=document.getElementById("cap-rec-result"), det=document.getElementById("cap-rec-detail");
    if(!(b>0&&t>0&&Number.isFinite(q))){out.textContent="Valeurs invalides";return;}
    const c=t/b, r=q*c; out.textContent=r.toLocaleString("fr-FR",{maximumFractionDigits:3}); det.textContent=`Coefficient = ${t} ÷ ${b} = ${c.toLocaleString("fr-FR",{maximumFractionDigits:3})}`;
  });
  document.getElementById("cap-loss-run")?.addEventListener("click",()=>{
    const m=num("cap-loss-mass"), r=num("cap-loss-rate"), out=document.getElementById("cap-loss-result"), det=document.getElementById("cap-loss-detail");
    if(!(m>=0&&r>=0&&r<=100)){out.textContent="Valeurs invalides";return;}
    const loss=m*r/100, usable=m-loss, yieldRate=100-r;
    out.textContent=`${usable.toLocaleString("fr-FR",{maximumFractionDigits:3})} utilisables`;
    det.textContent=`Perte : ${loss.toLocaleString("fr-FR",{maximumFractionDigits:3})} • rendement : ${yieldRate} %`;
  });
  update();
})();