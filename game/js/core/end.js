/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Завершення гри: підрахунок оцінки (S/A/B/C), рекорд, екран перемоги й поразки.
   ============================================================ */
'use strict';
/* ---------- end ---------- */
function end(win,why){
  if(!S.on)return;S.on=false;S.reloc=null;S.away=false;S.hiding=null;
  $('#relov').hidden=true;$('#roomov').hidden=true;
  const sh=$('#endsheet');
  if(win){
    const left=S.t;const sc=left/TOTAL*50+(100-S.maxHeat)/100*30+(S.relocs===0?20:10)-S.hints*3;
    const rank=sc>=75?'S':sc>=60?'A':sc>=45?'B':'C';
    let best='';
    try{const b=+localStorage.getItem('trace_best')||0;if(left>b){localStorage.setItem('trace_best',String(Math.round(left)));best='Новий рекорд за залишком часу.';}else best='Рекорд за залишком часу: '+fmt(b)+'.';}catch(_){}
    sh.innerHTML='<h2>Справу розкрито</h2><p>Останній маршрут Марти відновлено: кав’ярня Downtown Coffee, потім форум з архівом, далі склад №7 у порту, де діє синдикат VANTA. Дані передано поліції.</p>'+
    '<dl class="kv"><dt>Залишок часу</dt><dd>'+fmt(left)+'</dd><dt>Пік підозри</dt><dd>'+Math.round(S.maxHeat)+'%</dd><dt>Змін схованки</dt><dd>'+S.relocs+'</dd><dt>Підказок</dt><dd>'+S.hints+'</dd><dt>Оцінка</dt><dd><b>'+rank+'</b></dd></dl><p class="dim">'+best+'</p><button class="btn pri" id="again" type="button">Нова гра</button>';
    beep(880,.3,'triangle');
  }else{
    const m=why==='time'?['Сліди замітено','Час вичерпано. Бандити встигли знищити докази, Марту не знайдено.']:why==='caught'?['Вас знайшли','Бандити обшукали квартиру й знайшли вас. Розслідування провалено.']:['Бандити виламали двері','Ви не встигли сховатися, поки бандити стояли під дверима. Розслідування провалено.'];
    sh.innerHTML='<h2>'+m[0]+'</h2><p>'+m[1]+'</p><button class="btn pri" id="again" type="button">Спробувати ще</button>';
    beep(90,.6,'sawtooth',.05);
  }
  $('#end').hidden=false;
  $('#again').addEventListener('click',()=>{$('#end').hidden=true;newGame();boot();});
}
