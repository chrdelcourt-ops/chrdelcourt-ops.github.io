(() => {
  "use strict";
  const root = document.getElementById("electrique");
  if (!root) return;
  const $ = id => document.getElementById(id);

  const gates = {
    and: {
      name:"ET", formula:"S = A · B",
      note:"Les deux contacts normalement ouverts sont en série : A et B doivent valoir 1.",
      branches:[[{signal:"A",nf:false},{signal:"B",nf:false}]]
    },
    or: {
      name:"OU", formula:"S = A + B",
      note:"Les deux contacts normalement ouverts sont en parallèle : un seul contact fermé suffit.",
      branches:[[{signal:"A",nf:false}],[{signal:"B",nf:false}]]
    },
    not: {
      name:"NON", formula:"S = ¬A",
      note:"Le contact normalement fermé est conducteur lorsque A vaut 0, puis s’ouvre lorsque A vaut 1.",
      branches:[[{signal:"A",nf:true}]]
    },
    nand: {
      name:"NAND (NON-ET)", formula:"S = ¬(A · B) = ¬A + ¬B",
      note:"Deux contacts normalement fermés en parallèle : la lampe s’éteint seulement si A et B valent 1.",
      branches:[[{signal:"A",nf:true}],[{signal:"B",nf:true}]]
    },
    nor: {
      name:"NOR (NON-OU)", formula:"S = ¬(A + B) = ¬A · ¬B",
      note:"Deux contacts normalement fermés en série : la lampe ne s’allume que si A et B valent 0.",
      branches:[[{signal:"A",nf:true},{signal:"B",nf:true}]]
    },
    xor: {
      name:"XOR (OU exclusif)", formula:"S = A ⊕ B = A · ¬B + ¬A · B",
      note:"Deux branches parallèles avec contacts complémentaires : une seule des deux entrées doit valoir 1.",
      branches:[
        [{signal:"A",nf:false},{signal:"B",nf:true}],
        [{signal:"A",nf:true},{signal:"B",nf:false}]
      ]
    }
  };
  const order = ["and","or","not","nand","nor","xor"];
  const states = {A:0,B:0};
  const op = $("ec-operation"), standard = $("ec-standard");
  const aButton = $("ec-a"), bButton = $("ec-b");
  const svg = $("ec-diagram"), table = $("ec-table");
  const symbol = $("ec-symbol");
  const ink = "#748f98", activeInk = "#12835f";

  function closed(contact, inputs=states) {
    const value = inputs[contact.signal];
    return contact.nf ? value === 0 : value === 1;
  }
  function branchesOn(def, inputs=states) {
    return def.branches.map(branch => branch.every(c => closed(c,inputs)));
  }
  function output(def, inputs=states) {
    return Number(branchesOn(def,inputs).some(Boolean));
  }
  function line(x1,y1,x2,y2,on) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${on?activeInk:ink}" stroke-width="${on?4.3:2.8}" stroke-linecap="round"/>`;
  }
  function text(x,y,value,extra="") {
    return `<text x="${x}" y="${y}" font-size="15" text-anchor="middle" fill="#23434d" font-family="system-ui,sans-serif" ${extra}>${value}</text>`;
  }
  function contactDrawing(x,y,c,illuminated) {
    const isClosed=closed(c);
    const color=illuminated?activeInk:ink;
    const label=c.signal+" "+(c.nf?"NF":"NO");
    return `<g aria-label="${label}, ${isClosed?"fermé":"ouvert"}">
      <circle cx="${x-18}" cy="${y}" r="3.5" fill="${color}"/>
      <circle cx="${x+18}" cy="${y}" r="3.5" fill="${color}"/>
      <line x1="${x-18}" y1="${y}" x2="${x+13}" y2="${isClosed?y:y-14}" stroke="${color}" stroke-width="3.4" stroke-linecap="round"/>
      ${text(x,y-31,label,"font-weight=\"700\"")}
      ${text(x,y+32,isClosed?"fermé":"ouvert","font-size=\"12\"")}
    </g>`;
  }
  function draw(def) {
    const conduction=branchesOn(def);
    const isOn=conduction.some(Boolean);
    const ys=def.branches.length===1?[150]:[95,205];
    let out=`<rect width="700" height="300" fill="#fff"/>`;
    out+=text(60,32,"+24 V CC","font-weight=\"800\"");
    out+=text(638,32,"0 V","font-weight=\"800\"");
    out+=line(65,47,65,255,isOn)+line(635,47,635,255,isOn);
    out+=line(65,150,150,150,isOn);
    out+=line(450,150,495,150,isOn);
    out+=line(545,150,635,150,isOn);
    if(ys.length===2){
      out+=line(150,95,150,205,isOn);
      out+=line(450,95,450,205,isOn);
      out+=`<circle cx="150" cy="150" r="4" fill="${isOn?activeInk:ink}"/><circle cx="450" cy="150" r="4" fill="${isOn?activeInk:ink}"/>`;
    }
    def.branches.forEach((branch,index)=>{
      const y=ys[index],lit=conduction[index];
      const positions=branch.length===1?[295]:[235,365];
      let prev=150;
      branch.forEach((c,i)=>{
        const x=positions[i];
        out+=line(prev,y,x-18,y,lit);
        out+=contactDrawing(x,y,c,lit);
        prev=x+18;
      });
      out+=line(prev,y,450,y,lit);
    });
    out+=`<circle cx="520" cy="150" r="25" stroke="${isOn?"#b47e08":ink}" stroke-width="3" fill="${isOn?"#ffe386":"#fff"}"/>`;
    out+=`<path d="M507 137L533 163M533 137L507 163" stroke="${isOn?"#8e6508":ink}" stroke-width="2.5" stroke-linecap="round"/>`;
    out+=text(520,198,isOn?"S = 1 · allumée":"S = 0 · éteinte","font-weight=\"800\"");
    out+=text(350,271,"Représentation pédagogique de contacts et d’un voyant","font-size=\"13\"");
    svg.innerHTML=out;
    svg.setAttribute("aria-label",`${def.name}. A vaut ${states.A}, B vaut ${states.B}. Voyant S ${isOn?"allumé":"éteint"}.`);
  }
  function drawSymbol(){
    const cards = Array.from(document.querySelectorAll("#gate-grid .bool-gate"));
    const idx = order.indexOf(op.value);
    const figures = cards[idx]?.querySelectorAll(".bool-symbol-pair figure");
    const chosen = figures?.[standard.value==="iec"?0:1]?.querySelector("svg");
    if(chosen) symbol.replaceChildren(chosen.cloneNode(true));
    $("ec-symbol-label").textContent=standard.value==="iec"?"IEC":"ANSI / IEEE";
  }
  function drawTable(def){
    const unary=op.value==="not";
    const columns=unary?["A","S","Tester"]:["A","B","S","Tester"];
    table.tHead.innerHTML="<tr>"+columns.map(label=>`<th scope="col">${label}</th>`).join("")+"</tr>";
    const combinations=unary?[[0,0],[1,0]]:[[0,0],[0,1],[1,0],[1,1]];
    const body=document.createDocumentFragment();
    combinations.forEach(([a,b])=>{
      const row=document.createElement("tr");
      if(states.A===a&&(unary||states.B===b)) row.setAttribute("aria-current","true");
      const values=unary?[a,output(def,{A:a,B:b})]:[a,b,output(def,{A:a,B:b})];
      values.forEach(value=>{const cell=row.insertCell();cell.textContent=value;});
      const action=row.insertCell();
      const button=document.createElement("button");
      button.type="button";
      button.textContent="Essayer";
      button.setAttribute("aria-label",`Essayer A = ${a}${unary?"":", B = "+b}`);
      button.addEventListener("click",()=>{states.A=a;if(!unary)states.B=b;render();});
      action.appendChild(button);
      body.appendChild(row);
    });
    table.tBodies[0].replaceChildren(body);
  }
  function render(){
    const def=gates[op.value], unary=op.value==="not";
    aButton.setAttribute("aria-pressed",String(states.A===1));
    bButton.setAttribute("aria-pressed",String(states.B===1));
    aButton.querySelector("strong").textContent=states.A;
    bButton.querySelector("strong").textContent=states.B;
    bButton.disabled=unary;
    $("ec-formula").textContent=def.formula;
    const result=output(def);
    const state=$("ec-status");
    state.dataset.lit=String(result);
    state.textContent=`S = ${result} — lampe ${result?"allumée":"éteinte"}`;
    $("ec-explain").textContent=def.note;
    draw(def);drawSymbol();drawTable(def);
  }
  aButton.addEventListener("click",()=>{states.A=1-states.A;render();});
  bButton.addEventListener("click",()=>{states.B=1-states.B;render();});
  op.addEventListener("change",render);
  standard.addEventListener("change",drawSymbol);
  render();
})();