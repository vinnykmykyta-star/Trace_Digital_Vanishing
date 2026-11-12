/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Віконний менеджер: іконки, вікна, панель завдань, блокування інструментів.
   ============================================================ */
'use strict';
/* ---------- OS: icons, windows, taskbar ---------- */
const IC={
 dossier:'<path d="M9 5h12l5 5v19H9z"/><path d="M21 5v5h5M13 16h9M13 20h9M13 24h6"/>',
 board:'<rect x="4" y="6" width="26" height="20" rx="1"/><circle cx="11" cy="13" r="2"/><circle cx="23" cy="12" r="2"/><circle cx="17" cy="21" r="2"/><path d="M13 13.5l8-1M12 15l4 5M22 14l-4 6"/>',
 exif:'<rect x="4" y="9" width="26" height="18" rx="2"/><circle cx="17" cy="18" r="5"/><path d="M11 9l2-4h8l2 4"/>',
 net:'<path d="M4 14a19 19 0 0126 0M9 19a12 12 0 0116 0M14 24a5 5 0 016 0"/><circle cx="17" cy="28" r="1"/>',
 fx:'<rect x="7" y="15" width="20" height="14" rx="1"/><path d="M11 15v-4a6 6 0 0112 0v4M17 20v4"/>',
 soc:'<path d="M5 7h24v16H15l-6 5v-5H5z"/><path d="M10 13h14M10 17h9"/>',
 notes:'<path d="M8 4h18v26H8z"/><path d="M12 10h10M12 15h10M12 20h6M8 8H5M8 14H5M8 20H5"/>',
 term:'<rect x="3" y="6" width="28" height="22" rx="1"/><path d="M8 13l5 4-5 4M16 22h8"/>'
};
IC.browser='<circle cx="17" cy="17" r="12"/><path d="M5 17h24M17 5c-5 6-5 18 0 24M17 5c5 6 5 18 0 24"/>';
IC.modem='<rect x="6" y="20" width="22" height="8"/><path d="M10 20v-6M24 20v-6M12 11q5-5 10 0"/>';
const WT={modem:'Wi-Fi модем',browser:'TraceFox Browser',notes:'Notepad — notes.txt',dossier:'README.txt',board:'Evidence Board',term:'trace@kali: ~/marta',exif:'EXIF Metadata Analyzer',net:'Network Log Scanner',fx:'Forensics Utility',soc:'Social Engineering Messenger'};
const IL={modem:'Router',browser:'Browser',notes:'Notepad',dossier:'README.txt',board:'Дошка розслідування',term:'Terminal',exif:'EXIF Analyzer',net:'Network Log Scanner',fx:'Forensics Utility',soc:'Messenger'};
const ORDER=['dossier','notes','board','soc','browser','modem','term'];
const LOCK={
 net:{ok:()=>has('gps'),need:'Network Log Scanner: спершу закріпіть GPS-координати з EXIF.'},
 fx:{ok:()=>has('history'),need:'Forensics Utility: потрібна історія підключень з мережевих логів.'},
 soc:{ok:()=>has('zip'),need:'Messenger: спершу знайдіть зашифрований архів.'}
};
const isLocked=id=>LOCK[id]&&!LOCK[id].ok();
const W={};let Z=10;
const RENDER={dossier:()=>rDossier(),soc:()=>rSoc(),modem:()=>rModem()};
function buildWindows(){
  const desk=$('#desk');
  ORDER.forEach(id=>{
    const el=document.createElement('section');el.className='w'+(id==='board'||id==='term'||id==='notes'||id==='browser'?' flush':'');el.hidden=true;el.dataset.w=id;
    el.innerHTML='<div class="wt"><span>'+WT[id]+'</span><button type="button" data-wa="min" aria-label="Згорнути">_</button><button type="button" data-wa="close" aria-label="Закрити">×</button></div>'+
      (id==='board'?'<div class="wbody"><div class="board" id="board"><div class="boardhint">Клацніть одну картку, потім іншу, щоб з’єднати. Картки можна тягнути.</div><svg id="links" aria-hidden="true"></svg><div id="cards"></div></div></div>'
       :id==='term'?'<div class="wbody"><div class="log" id="log" aria-live="polite"></div><div class="prompt"><span id="ps1"></span><input id="cmd" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Командний рядок"></div></div>'
       :id==='browser'?'<div class="wbody"><div class="brbar"><button type="button" data-br="back" aria-label="Назад">←</button><button type="button" data-br="home" aria-label="Домівка">⌂</button><input id="brurl" type="text" autocomplete="off" spellcheck="false" aria-label="Адреса"><button type="button" data-br="go" aria-label="Перейти">→</button></div><div id="brpage"></div></div>':id==='notes'?'<div class="wbody"><div class="npbar"><span>~/marta/notes.txt</span><span>автозбереження</span></div><textarea id="notes" spellcheck="false" aria-label="Нотатки" placeholder="Нотатки розслідування: координати, MAC-адреси, паролі, версії…"></textarea></div>':'<div class="wbody"></div>');
    desk.appendChild(el);W[id]={el,open:false,min:false,body:el.querySelector('.wbody')};
    el.addEventListener('pointerdown',()=>focusWin(id),true);
    const wt=el.querySelector('.wt');let d=null;
    wt.addEventListener('pointerdown',e=>{
      if(e.target.closest('button')||innerWidth<=760)return;
      d={x:e.clientX-el.offsetLeft,y:e.clientY-el.offsetTop};try{wt.setPointerCapture(e.pointerId);}catch(_){}
    });
    wt.addEventListener('pointermove',e=>{if(!d)return;const r=desk.getBoundingClientRect();
      el.style.left=Math.min(r.width-80,Math.max(-el.offsetWidth+120,e.clientX-d.x))+'px';
      el.style.top=Math.min(r.height-30,Math.max(0,e.clientY-d.y))+'px';});
    wt.addEventListener('pointerup',()=>{d=null;});wt.addEventListener('pointercancel',()=>{d=null;});
    el.addEventListener('click',e=>{const b=e.target.closest('[data-wa]');if(!b)return;if(b.dataset.wa==='close')closeWin(id);else minWin(id);});
  });
  const ta=$('#notes');
  try{ta.value=localStorage.getItem('trace_notes')||'';}catch(_){}
  ta.addEventListener('input',()=>{try{localStorage.setItem('trace_notes',ta.value);}catch(_){}});
  ta.addEventListener('keydown',e=>e.stopPropagation());
  if(window.ResizeObserver)new ResizeObserver(()=>{if(S)drawLinks();}).observe(W.board.el);
  bindTerm();bindBr();
}
function place(id,n){
  const dk=$('#desk').getBoundingClientRect(),el=W[id].el,iw=112,pad=10;
  let x,y,w,h;
  const tw=Math.max(320,Math.min(430,dk.width-iw-340)),th=Math.min(dk.height-2*pad,560);
  const termH=Math.round(dk.height*.46);
  if(id==='board'){w=Math.max(360,dk.width-iw-tw-3*pad);h=dk.height-termH-3*pad;x=iw;y=pad;}
  else if(id==='term'){w=Math.max(360,dk.width-iw-tw-3*pad);h=termH;x=iw;y=dk.height-termH-pad;}
  else{w=tw;h=th;x=dk.width-tw-pad-(n||0)*26;y=pad+(n||0)*26;}
  Object.assign(el.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
}
function openWin(id){
  if(!S||isLocked(id)){if(isLocked(id))log(LOCK[id].need,'bad');return;}
  const w=W[id];
  if(!w.open){w.open=true;w.min=false;if(!w.placed){place(id,['dossier','notes','soc','browser','modem'].filter(k=>W[k].placed).length);w.placed=true;}}
  w.min=false;if(id==='dossier')S.readSeen=true;renderWin();focusWin(id);
}
function closeWin(id){W[id].open=false;W[id].min=false;syncWins();}
function minWin(id){W[id].min=true;syncWins();}
function focusWin(id){
  const w=W[id];if(!w.open)return;w.el.style.zIndex=++Z;S&&(S.focus=id);syncWins();
}
function syncWins(){
  const top=S&&S.focus&&W[S.focus]&&W[S.focus].open&&!W[S.focus].min?S.focus:null;
  ORDER.forEach(id=>{const w=W[id];w.el.hidden=!(w.open&&!w.min);w.el.classList.toggle('active',id===top);});
  renderTask();renderIcons();
}
function renderTask(){
  const t=$('#tbtns');t.innerHTML='';
  ORDER.filter(id=>W[id].open).forEach(id=>{
    const b=document.createElement('button');b.type='button';b.textContent=IL[id];
    b.className=(S.focus===id&&!W[id].min?'on':'')+(W[id].min?' min':'');
    b.addEventListener('click',()=>{if(W[id].min||S.focus!==id){W[id].min=false;focusWin(id);}else minWin(id);});
    t.appendChild(b);});
}
function renderIcons(){
  const n=$('#icons');n.innerHTML='';
  ORDER.forEach(id=>{
    const b=document.createElement('button');b.type='button';
    b.className='ico'+(isLocked(id)?' lock':'')+(W[id].open&&!W[id].min?' on':'')+(id==='dossier'&&S&&!S.readSeen?' new':'');
    b.innerHTML='<svg viewBox="0 0 34 34">'+IC[id]+'</svg><span>'+IL[id]+'</span>';
    b.title=isLocked(id)?LOCK[id].need:'';
    b.addEventListener('click',()=>{if(S.on)openWin(id);});
    n.appendChild(b);
  });
}
function setupWindows(){
  if(!W.board)buildWindows();
  ORDER.forEach(id=>{const w=W[id];w.open=false;w.min=false;w.placed=false;w.body&&!['board','term','notes','browser'].includes(id)&&(w.body.innerHTML='');});
  $('#log').innerHTML='<div class="hd">┌──(trace㉿kali)-[~/marta]</div>';
  S.focus=null;
  ['board','term'].forEach(id=>{const w=W[id];w.open=true;w.placed=true;place(id,0);});
  S.focus='term';syncWins();ps1();
}
function renderWin(){
  Object.keys(RENDER).forEach(id=>{
    const w=W[id];if(!w.open)return;
    const st=w.body.scrollTop;w.body.innerHTML=RENDER[id]();w.body.scrollTop=st;
    const ch=w.body.querySelector('.chat');if(ch)ch.scrollTop=ch.scrollHeight;
  });
  hud();
}
function renderAll(){$('#roomov').hidden=true;brRender();renderIcons();renderBoard();renderWin();syncWins();hud();}
function renderDock(){renderIcons();}
