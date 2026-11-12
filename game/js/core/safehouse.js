/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Схованка: перенесення модема, VPN, встати/сісти, сховатися від бандитів.
   ============================================================ */
'use strict';
const rndAddr=p=>p+(20+Math.floor(Math.random()*200))+'.'+(20+Math.floor(Math.random()*200));
function beginMove(o){
  if(!S.on||S.reloc)return;
  S.reloc={p:0,T:o.T,heat:o.heat,apply:o.apply,msg:o.msg};S.relocs++;S.t-=o.t;S.net.conn=false;
  rshDrop('Connection closed ('+o.title+').');
  $('#relov').hidden=false;$('#relbar').style.width='0%';$('#relov h2').textContent=o.title;$('#relmsg').textContent=o.sub;
  log(o.title+': з таймера знято '+o.t+' с.','inf');renderWin();
}
function moveModem(i){
  const r=ROOMS[i];if(!r||i===S.room)return;
  beginMove({T:8,t:r.t,heat:r.h,title:'Перенесення модема',sub:'Модем переноситься в кімнату «'+r.n+'». Зачистка слідів і перепідключення.',msg:'Модем тепер у кімнаті «'+r.n+'».',apply:()=>{S.room=i;}});
}
function vpnSwitch(i){
  const v=VPN[i];if(!v||S.away||!S.inst['vpn-pro'])return;const ad=rndAddr(v.ip);
  beginMove({T:4,t:15,heat:20,title:'Зміна адреси через VPN',sub:'Підключення до сервера: '+v.n+'.',msg:'Нова адреса '+ad+' ('+v.n+').',apply:()=>{S.vpn=i;S.addr=ad;}});
}
function finishReloc(){
  const R=S.reloc;S.reloc=null;S.cleanup=null;S.heat=R.heat;R.apply();
  $('#relov').hidden=true;log(R.msg,'ok');beep(520,.12,'triangle');renderWin();if(S.away)renderRoom();
}

function standUp(){
  if(!S.on||S.reloc||S.away)return;
  S.away=true;const c=$('#cmd');if(c)c.blur();
  $('#roomov').hidden=false;renderRoom();
}
function sitDown(){
  if(!S.on||S.hiding||S.reloc)return;
  S.away=false;$('#roomov').hidden=true;const c=$('#cmd');if(c)c.focus();
}
function hideIn(i){
  if(!S.on||!S.away||S.cleanup===null||S.hiding||S.reloc)return;
  S.hiding={p:0,T:6,room:i};log('Ви сховались '+ROOMS[i].hide+'. Бандити заходять…','inf');renderRoom();
}
function finishHide(){
  const H=S.hiding;S.hiding=null;
  if(H.room===S.room||ROOMS[H.room].door)return end(false,'caught');
  S.cleanup=null;S.heat=25;log('Бандити обшукали квартиру й пішли. Вони можуть повернутись.','ok');renderRoom();
}
