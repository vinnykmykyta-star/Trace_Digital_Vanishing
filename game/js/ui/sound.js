/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Звук: beep() і стукіт у двері (Web Audio) + тремтіння екрана.
   ============================================================ */
'use strict';
/* ---------- sound ---------- */
let AC=null,snd=false;
function beep(f,d,type,v){ if(!snd)return; try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.value=f||440;g.gain.value=v||.03;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+(d||.08));}catch(e){} }

let sndTouched=false;
function knock(){
  if(!(snd||!sndTouched))return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    [0,.22,.44].forEach(d=>{const t=AC.currentTime+d,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(55,t+.12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.4,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.2);});}catch(e){}
  const b=$('#desk');if(b&&!matchMedia('(prefers-reduced-motion:reduce)').matches){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');}
}
