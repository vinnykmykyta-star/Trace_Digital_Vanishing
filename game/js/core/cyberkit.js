/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Інструменти Cyber-Kit: обробка дій EXIF / Network / Forensics / Messenger.
   ============================================================ */
'use strict';
/* ---------- actions ---------- */
$('#desk').addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el||!S.on||S.reloc)return;
  const a=el.dataset.act,v=el.dataset.v;
  if(a==='hint'){S.t-=30;S.hints++;log('Підказка: '+currentHint(),'inf');renderWin();}
  else if(a==='selphoto'){S.exif.sel=v;renderWin();}
  else if(a==='scan'){
    S.exif.busy=true;renderWin();
    after(1100,()=>{S.exif.busy=false;S.exif.res[S.exif.sel]=true;addHeat(3,'аналіз метаданих');beep(500,.06);renderWin();});
  }
  else if(a==='pin'){addCard(v);renderWin();}
  else if(a==='room')moveModem(+v);
  else if(a==='vpnsw')vpnSwitch(+v);
  else if(a==='selvenue'){S.net.venue=v;renderWin();}
  else if(a==='connect'){
    const ve=VENUES.find(x=>x.id===S.net.venue);
    if(!ve.ok){addHeat(10,'на цій точці немає пристрою з потрібним профілем');S.net.venue=null;renderWin();return;}
    S.net.conn=true;S.ids=IDS_T;log('Підключення до '+ve.name+'. IDS Counter: 02:00.','inf');beep(300,.1);renderWin();
  }
  else if(a==='capture'){
    const i=+v,r=LOGS[i];
    if(r[4]){S.net.conn=false;S.net.done=true;addCard('mac');addCard('history');log('IDS-відлік зупинено. Логи захоплено.','ok');renderWin();}
    else{S.net.bad[i]=true;S.ids-=10;addHeat(6,'це не пристрій Марти');beep(140,.15,'sawtooth');renderWin();}
  }
  else if(a==='dl'){
    if(v==='1'){S.fx.dl=true;addHeat(4,'завантаження з форуму');addCard('zip');renderWin();}
    else{addHeat(2,'зайве завантаження');log('Файл не містить корисного.');}
  }
  else if(a==='decrypt')tryDecrypt();
  else if(a==='brute'){S.t-=150;addHeat(30,'brute-force викликав підозру');S.fx.brute=true;decrypted();}
  else if(a==='say')say(+v);
});
$('#desk').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='fxpw')tryDecrypt();});
function tryDecrypt(){
  const v=($('#fxpw').value||'').trim().toLowerCase();
  if(v===PASS){decrypted();}
  else{S.fx.tries++;addHeat(7,'невірний пароль');beep(140,.15,'sawtooth');log('Невірний пароль.','bad');}
}
function decrypted(){S.fx.dec=true;log('Архів розшифровано.','ok');addCard('syn');renderWin();checkWin();}
function say(i,txt){
  const C=S.soc,st=STAGES[C.stage],o=st.opts[i];
  C.msgs.push({w:'me',t:txt||o.t},{w:'den',t:o.r});C.picked[C.stage+'-'+i]=1;
  if(o.k==='good'){
    if(o.next)C.msgs.push({w:'den',t:o.next});
    C.stage++;C.picked={};
    if(C.stage>=STAGES.length){C.done=true;addCard('hint');C.msgs.push({w:'sys',t:'Денис вийшов з чату.'});}
    beep(600,.08,'triangle');
  }else if(o.k==='neutral'){addHeat(2,'безрезультатне повідомлення');}
  else{
    C.bad++;addHeat(10,'тиск на співрозмовника');beep(140,.15,'sawtooth');
    if(C.bad>=2){C.bad=0;C.block=45;C.msgs.push({w:'sys',t:'Денис заблокував вас.'});log('Денис заблокував акаунт на 45 с.','bad');}
  }
  renderWin();checkWin();
}
