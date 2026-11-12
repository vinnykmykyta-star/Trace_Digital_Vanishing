/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Панель стану (таймери, Heat), вікно модема, екран квартири.
   ============================================================ */
'use strict';
/* ---------- HUD ---------- */
function hud(){
  $('#clock').textContent=fmt(S.t);
  $('#clockbox').classList.toggle('low',S.t<120);
  $('#heatbox').hidden=true;
  const ib=$('#idsbox');ib.hidden=!S.net.conn;
  if(S.net.conn){$('#idsnum').textContent=fmt(S.ids);const nb=$('#netbar');if(nb)nb.style.width=Math.max(0,S.ids/IDS_T*100)+'%';}
  $('#safename').textContent=ROOMS[S.room].n;
  $('#smreloc').disabled=!!S.reloc;
  const al=$('#alert');
  if(S.cleanup!==null){al.hidden=false;$('#altime').textContent=fmt(S.cleanup);$('#altbtn').hidden=!!(S.reloc||S.away||S.hiding);al.firstElementChild.textContent=S.hiding?'Ви сховались. Бандити шукають…':'СТУК У ДВЕРІ! ВСТАНЬТЕ Й СХОВАЙТЕСЬ';}
  else al.hidden=true;
  if(S.reloc){$('#relbar').style.width=(S.reloc.p/(S.reloc.T||RELOC_T)*100)+'%';}
  if(S.away){const rk=$('#rk');if(rk)rk.textContent=fmt(S.cleanup||0);const hp=$('#rhp');if(hp&&S.hiding)hp.style.width=(S.hiding.p/S.hiding.T*100)+'%';}
  const bl=$('#nblock');if(bl)bl.textContent=fmt(S.soc.block);
  const nl=$('#nlock');if(nl)nl.textContent=fmt(S.net.lock);
}

function rModem(){
  const vpn=!!S.inst['vpn-pro'];
  let h='<h3>Wi-Fi модем</h3><p class="dim">Модем у кімнаті «'+ROOMS[S.room].n+'». Адреса: '+S.addr+(S.vpn!==null?' (VPN: '+VPN[S.vpn].n+')':'')+'.</p><p class="dim">Перенести модем можна лише власноруч: встаньте з-за комп’ютера (кнопка внизу). Сліди ростуть непомітно, тож час від часу міняйте адресу.</p><h3>VPN: змінити адресу</h3>';
  if(!vpn)return h+'<p class="dim">VPN не встановлено. Купіть VPN Pro в DarkMart і встановіть: sudo apt install vpn-pro. З ним адресу можна змінювати з комп’ютера, не переносячи модем.</p>';
  return h+'<p class="dim">Без фізичного переносу: −15 с.</p><div class="files">'+VPN.map((v,i)=>'<button type="button" class="file '+(i===S.vpn?'on':'')+'" data-act="vpnsw" data-v="'+i+'"><span><b>'+v.n+'</b></span></button>').join('')+'</div>';
}

function renderRoom(){
  const sh=$('#roomsheet');if(!sh)return;
  const k=S.cleanup!==null;
  let h='<h2>Квартира</h2><p class="dim">'+(S.hiding?'Ви ховаєтесь '+ROOMS[S.hiding.room].hide+'. Бандити обшукують квартиру…':k?'СТУК У ДВЕРІ! Швидко сховайтесь. Бандити спершу перевіряють вітальню біля входу та кімнату, де блимає модем.':'Ви встали з-за комп’ютера. Тут можна перенести Wi-Fi модем в іншу кімнату.')+'</p>';
  if(k&&!S.hiding)h+='<div class="bal" style="border-color:var(--warn);color:var(--warn)">До виламування дверей: <b id="rk">'+fmt(S.cleanup)+'</b></div>';
  if(S.hiding)h+='<div class="prog"><i id="rhp" style="width:'+(S.hiding.p/S.hiding.T*100)+'%"></i></div>';
  h+='<div class="plan">'+ROOMS.map((r,i)=>'<div class="rm '+(i===S.room?'has':'')+'"><b>'+r.n+'</b><small>'+(i===S.room?'Модем тут. ':'')+(r.door?'Біля входу. ':'')+r.q+'</small>'+(k?'<button class="btn danger" type="button" data-rm="hide" data-v="'+i+'" '+(S.hiding||S.reloc?'disabled':'')+'>Сховатися '+r.hide+'</button>':'<button class="btn" type="button" data-rm="move" data-v="'+i+'" '+(i===S.room||S.reloc?'disabled':'')+'>Перенести модем сюди (−'+r.t+' с)</button>')+'</div>').join('')+'<div class="rm door"><b>Вхідні двері</b><small>Тут стукають.</small></div></div>';
  sh.innerHTML=h+'<button class="btn pri" type="button" data-rm="sit" '+(S.hiding||S.reloc?'disabled':'')+'>Сісти за комп’ютер</button>';
}

