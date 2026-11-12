/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Стан гри S, newGame(), журнал подій, шкала Heat, додавання карток на дошку.
   ============================================================ */
'use strict';
let S=null,last=0,timers=[];
function newGame(){
  timers.forEach(clearTimeout);timers=[];
  S={on:false,t:TOTAL,heat:5,maxHeat:5,ids:0,safe:0,relocs:0,reloc:null,cleanup:null,away:false,hiding:null,kn:0,
    cards:[],links:[],sel:null,pos:{},flash:null,
    exif:{sel:null,res:{},busy:false},
    net:{venue:null,conn:false,done:false,lock:0,bad:{}},
    fx:{dl:false,dec:false,brute:false,tries:0},
    soc:{stage:0,trust:0,bad:0,picked:{},msgs:[{w:'den',t:STAGES[0].q}],done:false,block:0},
    hints:0,money:60,room:0,addr:'77.120.14.209',vpn:null,vanta:false,sawBaz:false,bought:{},inst:{},br:{url:'trace://home',h:[]},term:{mode:'sh',cwd:['home','trace','marta'],saved:null,remote:null,hist:[],hi:0,dl:false,scanned:{},post:[],pwPrompt:''}};
  Object.keys(CARDS).forEach(k=>S.pos[k]=CARDS[k].pos.slice());
  setupWindows();
  renderAll();
}
const has=id=>S.cards.includes(id);
function after(ms,fn){timers.push(setTimeout(()=>{if(S&&S.on)fn();},ms));}

/* ---------- log / heat ---------- */
function log(txt,cls){const l=$('#log');const d=document.createElement('div');if(cls)d.className=cls;d.textContent=txt;l.appendChild(d);l.scrollTop=l.scrollHeight;}
function addHeat(n){S.heat=Math.min(100,Math.max(0,S.heat+n));S.maxHeat=Math.max(S.maxHeat,S.heat);}
function addCard(id){if(has(id))return;S.cards.push(id);renderBoard();renderDock();log('На дошку додано: '+CARDS[id].title,'ok');beep(660,.07,'square');}
