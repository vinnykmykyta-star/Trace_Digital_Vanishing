/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Ігровий такт tick(): загальний таймер, IDS Counter, Heat, «група зачистки».
   ============================================================ */
'use strict';
function tick(){
  if(!S||!S.on)return;
  const now=performance.now();const dt=Math.min(.5,(now-last)/1000);last=now;
  S.t-=dt;
  if(S.t<=0){S.t=0;hud();return end(false,'time');}
  if(S.net.conn){S.ids-=dt;addHeat(.5*dt);if(S.ids<=0)idsBurn();}
  else if(!S.reloc&&S.cleanup===null&&S.heat<100)S.heat=Math.max(0,S.heat-.15*dt);
  if(S.net.lock>0){S.net.lock=Math.max(0,S.net.lock-dt);if(S.net.lock===0)renderWin();}
  if(S.soc.block>0){S.soc.block=Math.max(0,S.soc.block-dt);if(S.soc.block===0){S.soc.picked={};renderWin();}}
  if(S.heat>=100&&S.cleanup===null&&!S.reloc&&!S.hiding){S.cleanup=CLEAN_T;S.kn=0;log('Стук у двері! Бандити біля квартири. Швидко встаньте з-за комп’ютера й сховайтесь.','bad');knock();if(S.away)renderRoom();}
  if(S.cleanup!==null&&!S.hiding){S.cleanup-=dt;S.kn+=dt;if(S.kn>=2.4){S.kn=0;knock();}if(S.cleanup<=0){S.cleanup=0;hud();return end(false,'cleanup');}}
  if(S.hiding){S.hiding.p+=dt;if(S.hiding.p>=S.hiding.T)finishHide();}
  if(S.reloc){S.reloc.p+=dt;if(S.reloc.p>=(S.reloc.T||RELOC_T))finishReloc();}
  hud();
}
function idsBurn(){
  S.net.conn=false;S.net.lock=20;S.ids=0;rshDrop('Connection to '+GW+' closed by remote host.');
  addHeat(35,'IDS виявила вторгнення, з’єднання розірвано');beep(100,.4,'sawtooth',.05);
  renderWin();
}

