(() => {
"use strict";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const temp = document.getElementById("ee-temp");
const power = document.getElementById("ee-power");
function sync(){
  document.getElementById("ee-temp-value").textContent = temp.value;
  document.getElementById("ee-power-value").textContent = Number(power.value).toFixed(1);
}
temp?.addEventListener("input", sync); power?.addEventListener("input", sync); sync();

document.getElementById("ee-building-run")?.addEventListener("click", () => {
  const t = Number(temp.value), p = Number(power.value);
  const pac = t < 19, batt = p > 6;
  document.getElementById("pac-card").classList.toggle("active", pac);
  document.getElementById("battery-card").classList.toggle("active", batt);
  document.getElementById("pac-state").textContent = pac ? "ON" : "OFF";
  document.getElementById("battery-state-ee").textContent = batt ? "DÉCHARGE" : "ATTENTE";
  document.getElementById("ee-building-output").textContent =
    `PAC ${pac ? "ON" : "OFF"} • batterie ${batt ? "DÉCHARGE" : "ATTENTE"}`;
});

document.getElementById("ee-method-play")?.addEventListener("click", async (e) => {
  const steps = [...document.querySelectorAll(".ee-method")];
  e.currentTarget.disabled = true;
  for(const s of steps){ s.classList.add("active"); await sleep(550); s.classList.remove("active"); }
  e.currentTarget.disabled = false;
});

document.getElementById("ee-flow-run")?.addEventListener("click", async (e) => {
  const p = Number(document.getElementById("ee-flow-power").value);
  const ids = ["eef-start","eef-read","eef-test"];
  e.currentTarget.disabled = true;
  document.querySelectorAll("#bases .flow-node").forEach(n => n.classList.remove("active"));
  for(const id of ids){ const el=document.getElementById(id); el.classList.add("active"); await sleep(420); el.classList.remove("active"); }
  const target = document.getElementById(p > 6 ? "eef-off":"eef-on");
  target.classList.add("active");
  document.getElementById("ee-flow-output").textContent =
    `${p.toFixed(1)} kW : ${p>6 ? "délestage du chauffe-eau" : "chauffe-eau maintenu"}`;
  await sleep(850); target.classList.remove("active"); e.currentTarget.disabled=false;
});

document.getElementById("pac-run")?.addEventListener("click", async (e) => {
  e.currentTarget.disabled = true;
  const seq = [
    ["pac-sec","Sécurités vérifiées"],
    ["pac-circ","Circulateur ON"],
    ["pac-delay","Temporisation 5 s"],
    ["pac-comp","Compresseur ON"]
  ];
  document.querySelectorAll(".ee-device").forEach(d => d.classList.remove("active"));
  for(const [id,msg] of seq){
    const el=document.getElementById(id); el.classList.add("active");
    document.getElementById("pac-status").textContent=msg;
    if(id==="pac-circ") el.querySelector("small").textContent="ON";
    if(id==="pac-comp") el.querySelector("small").textContent="ON";
    await sleep(id==="pac-delay"?1000:650);
  }
  document.getElementById("pac-status").textContent="PAC en service.";
  e.currentTarget.disabled=false;
});

const prod=document.getElementById("pv-prod"), need=document.getElementById("pv-need");
function syncPV(){
  document.getElementById("pv-prod-value").textContent=Number(prod.value).toFixed(1);
  document.getElementById("pv-need-value").textContent=Number(need.value).toFixed(1);
}
prod?.addEventListener("input",syncPV); need?.addEventListener("input",syncPV); syncPV();

document.getElementById("pv-run")?.addEventListener("click", () => {
  const p=Number(prod.value), n=Number(need.value), surplus=p-n;
  const batt=document.getElementById("pv-battery"), grid=document.getElementById("pv-grid");
  batt.classList.remove("active"); grid.classList.remove("active");
  if(surplus>=0){
    batt.classList.add("active");
    document.getElementById("pv-output").textContent=`Surplus ${surplus.toFixed(1)} kW → charger la batterie`;
  } else {
    grid.classList.add("active");
    document.getElementById("pv-output").textContent=`Déficit ${Math.abs(surplus).toFixed(1)} kW → fournir l'énergie manquante`;
  }
});

const thermal=document.getElementById("thermal-start");
thermal?.addEventListener("input",()=>{
  const v=Number(thermal.value);
  document.getElementById("thermal-value").textContent=v;
  document.getElementById("thermal-text").textContent=`${v} °C`;
  document.getElementById("thermal-fill").style.width=`${Math.max(0,Math.min(100,(v-40)/25*100))}%`;
});

document.getElementById("thermal-run")?.addEventListener("click", async (e)=>{
  let v=Number(thermal.value); e.currentTarget.disabled=true;
  const out=document.getElementById("thermal-output");
  if(v>=60){ out.textContent=`${v} °C : la boucle ne s'exécute pas.`; e.currentTarget.disabled=false; return; }
  let minute=0;
  while(v<60 && minute<15){
    v=Math.min(60,v+1); minute++;
    document.getElementById("thermal-text").textContent=`${v} °C`;
    document.getElementById("thermal-fill").style.width=`${(v-40)/25*100}%`;
    out.textContent=`Minute ${minute} : ${v} °C`;
    await sleep(220);
  }
  out.textContent=v>=60?`60 °C atteint → chauffage OFF.`:`15 min atteintes → arrêt de sécurité.`;
  e.currentTarget.disabled=false;
});

document.getElementById("ee-average-run")?.addEventListener("click", async (e)=>{
  const vals=[920,980,950,1020,930]; let sum=0; e.currentTarget.disabled=true;
  for(const v of vals){
    sum+=v; document.getElementById("ee-average-sum").textContent=`${sum} W`;
    document.getElementById("ee-average-output").textContent=`Ajout de ${v} W`;
    await sleep(380);
  }
  document.getElementById("ee-average-output").textContent=`Moyenne = ${sum/vals.length} W`;
  e.currentTarget.disabled=false;
});

document.getElementById("heat-run")?.addEventListener("click",()=>{
  const t=Number(document.getElementById("heat-temp").value);
  const c=Number(document.getElementById("heat-setpoint").value);
  document.getElementById("heat-console").textContent=`> ${t<c?"Chauffage ON":"Chauffage OFF"}`;
});
document.getElementById("power-code-run")?.addEventListener("click",()=>{
  document.getElementById("power-console").textContent="> 960";
});
document.getElementById("energy-run")?.addEventListener("click",()=>{
  const p=Number(document.getElementById("energy-prod").value);
  const b=Number(document.getElementById("energy-need").value);
  const soc=Number(document.getElementById("energy-soc").value);
  const surplus=p-b, charge=surplus>0&&soc<95, decharge=surplus<0&&soc>20, reseau=surplus<0&&!decharge;
  document.getElementById("energy-console").textContent=
    `> charge=${charge?"True":"False"}, decharge=${decharge?"True":"False"}, reseau=${reseau?"True":"False"}`;
});

document.getElementById("ee-debug-reveal")?.addEventListener("click",(e)=>{
  const box=document.getElementById("ee-debug-correction");
  box.hidden=!box.hidden; e.currentTarget.textContent=box.hidden?"Afficher la correction":"Masquer la correction";
});

const quiz=document.getElementById("ee-algo-quiz"), score=document.getElementById("ee-algo-score");
quiz?.addEventListener("submit",(ev)=>{
  ev.preventDefault(); const fields=[...quiz.querySelectorAll("fieldset[data-correct]")]; let ok=0, answered=0;
  fields.forEach(f=>{f.classList.remove("correct","incorrect");const s=f.querySelector("input:checked");if(!s)return;answered++;if(s.value===f.dataset.correct){ok++;f.classList.add("correct")}else f.classList.add("incorrect")});
  score.classList.add("visible"); score.textContent=`Score : ${ok}/${fields.length}${answered<fields.length?` • ${answered} réponse(s) donnée(s)`:""}.`;
});
quiz?.addEventListener("reset",()=>{quiz.querySelectorAll("fieldset").forEach(f=>f.classList.remove("correct","incorrect"));score.textContent="";score.classList.remove("visible")});
})();