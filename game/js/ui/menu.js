/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Меню «Applications», кнопки стартового меню, клік у екрані квартири.
   ============================================================ */
'use strict';
function sm(open){$('#startmenu').hidden=!open;}
$('#startbtn2').addEventListener('click',e=>{e.stopPropagation();sm($('#startmenu').hidden);});
document.addEventListener('click',e=>{if(!e.target.closest('#startmenu'))sm(false);});
function reloc(){sm(false);standUp();}
$('#smreloc').addEventListener('click',reloc);
$('#altbtn').addEventListener('click',reloc);
$('#smsnd').addEventListener('click',e=>{snd=!snd;e.currentTarget.textContent='Звук: '+(snd?'увімк.':'вимк.');e.currentTarget.setAttribute('aria-pressed',String(snd));beep(500,.08);});
$('#standbtn').addEventListener('click',standUp);
$('#smsnd').addEventListener('click',()=>{sndTouched=true;});
$('#roomsheet').addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(!b||!S.on)return;const k=b.dataset.rm,v=+b.dataset.v;if(k==='sit')sitDown();else if(k==='move'&&S.cleanup===null)moveModem(v);else if(k==='hide')hideIn(v);});
$('#smdoss').addEventListener('click',()=>{sm(false);openWin('dossier');});
$('#smnew').addEventListener('click',()=>{sm(false);S.on=false;newGame();boot();});
