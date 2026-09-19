(() => {
"use strict";
const n=id=>Number(document.getElementById(id).value.trim().replace(",","."));
const euro=v=>`${v.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
document.querySelectorAll(".qa-toggle").forEach(b=>b.addEventListener("click",()=>{const a=b.closest(".qa-card").querySelector(".qa-answer");a.hidden=!a.hidden;b.textContent=a.hidden?"Voir la réponse":"Masquer la réponse";}));
document.getElementById("cost-run")?.addEventListener("click",()=>{const q=n("cost-qty"),u=n("cost-unit");document.getElementById("cost-result").textContent=Number.isFinite(q*u)?euro(q*u):"Valeurs invalides";});
document.getElementById("portion-run")?.addEventListener("click",()=>{const t=n("portion-total"),c=Number(document.getElementById("portion-count").value);document.getElementById("portion-result").textContent=t>=0&&c>0?euro(t/c):"Valeurs invalides";});
document.getElementById("margin-run")?.addEventListener("click",()=>{const c=Number(document.getElementById("margin-count").value),p=n("margin-price"),cost=n("margin-cost");document.getElementById("margin-result").textContent=c>0&&Number.isFinite(p)&&Number.isFinite(cost)?euro(c*p-cost):"Valeurs invalides";});
document.getElementById("discount-run")?.addEventListener("click",()=>{const p=n("discount-price"),r=n("discount-rate"),out=document.getElementById("discount-result"),det=document.getElementById("discount-detail");if(!(p>=0&&r>=0&&r<=100)){out.textContent="Valeurs invalides";return;}const remise=p*r/100,net=p-remise;out.textContent=euro(net);det.textContent=`Remise : ${euro(remise)} • calcul : ${p.toLocaleString("fr-FR")} × ${r}/100`;});
})();