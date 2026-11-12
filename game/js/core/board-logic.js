/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Дошка розслідування: перевірка зв’язку між доказами, умова перемоги.
   ============================================================ */
'use strict';
function tryLink(a,b){
  const k=[a,b].sort().join('|');
  if(S.links.some(l=>[l[0],l[1]].sort().join('|')===k)){log('Ці картки вже з’єднано.');return;}
  if(VALID[k]){S.links.push([a,b]);log('Зв’язок підтверджено: '+VALID[k],'ok');beep(780,.1,'triangle');checkWin();}
  else{S.flash={a,b,until:performance.now()+900};after(950,drawLinks);addHeat(8,'суперечність на дошці, ці докази не пов’язані');beep(140,.2,'sawtooth');}
}
function requiredDone(){
  const ids=['gps','mac','history','zip','syn','k1','k2','k3','loc'];
  if(!ids.every(has))return false;
  const L=k=>S.links.some(l=>[l[0],l[1]].sort().join('|')===k);
  if(!(L('gps|mac')&&L('history|mac')&&L('history|zip')&&L('syn|zip')&&L('k1|loc')&&L('k2|loc')&&L('k3|loc')&&L('loc|syn')))return false;
  if(has('hint')&&!L('hint|zip'))return false;
  return true;
}
function checkWin(){if(requiredDone())end(true);}
