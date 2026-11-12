/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Малювання Дошки розслідування, лінії зв’язків, перетягування карток.
   ============================================================ */
'use strict';
/* ---------- board ---------- */
let drag=null;
function renderBoard(){
  const c=$('#cards');if(!c)return;c.innerHTML='';
  if(!S.cards.length)c.innerHTML='<div class="empty">Дошка порожня. Знайдені докази з’являтимуться тут.</div>';
  const linked=new Set();S.links.forEach(l=>{linked.add(l[0]);linked.add(l[1]);});
  S.cards.forEach(id=>{
    const d=CARDS[id],p=S.pos[id];
    const el=document.createElement('div');
    el.className='card '+(d.key?'key':'noise')+(S.sel===id?' sel':'')+(linked.has(id)?' linked':'');
    el.tabIndex=0;el.dataset.id=id;el.style.left=(p[0]*100)+'%';el.style.top=(p[1]*100)+'%';
    el.innerHTML='<div class="ct"><span>'+esc(d.tag)+'</span><span>'+(linked.has(id)?'зв’язано':'')+'</span></div><b>'+esc(d.title)+'</b><p>'+esc(d.body)+'</p>';
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();clickCard(id);}});
    c.appendChild(el);
  });
  drawLinks();
}
function drawLinks(){
  const bd=$('#board');if(!bd)return;const b=bd.getBoundingClientRect(),svg=$('#links');
  svg.setAttribute('viewBox','0 0 '+b.width+' '+b.height);
  let h='';
  const line=(a,c,cls)=>{const pa=S.pos[a],pc=S.pos[c];return '<line class="lnk '+cls+'" x1="'+pa[0]*b.width+'" y1="'+pa[1]*b.height+'" x2="'+pc[0]*b.width+'" y2="'+pc[1]*b.height+'"/>';};
  S.links.forEach(l=>h+=line(l[0],l[1],''));
  if(S.flash&&S.flash.until>performance.now())h+=line(S.flash.a,S.flash.b,'bad');
  svg.innerHTML=h;
}
function clickCard(id){
  if(!S.on||S.reloc)return;
  if(S.sel===null){S.sel=id;beep(400,.04);}
  else if(S.sel===id){S.sel=null;}
  else{const a=S.sel;S.sel=null;tryLink(a,id);}
  renderBoard();
}

/* pointer drag */
(function(){
  const bd=$('#desk');
  bd.addEventListener('pointerdown',e=>{
    const el=e.target.closest('.card');if(!el||!S||!S.on)return;
    const r=$('#board').getBoundingClientRect();
    drag={id:el.dataset.id,el,sx:e.clientX,sy:e.clientY,moved:false,r};
    try{el.setPointerCapture(e.pointerId);}catch(_){}
  });
  bd.addEventListener('pointermove',e=>{
    if(!drag)return;
    const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
    if(!drag.moved&&Math.hypot(dx,dy)<6)return;
    drag.moved=true;
    const x=Math.min(.95,Math.max(.05,(e.clientX-drag.r.left)/drag.r.width));
    const y=Math.min(.95,Math.max(.07,(e.clientY-drag.r.top)/drag.r.height));
    S.pos[drag.id]=[x,y];drag.el.style.left=(x*100)+'%';drag.el.style.top=(y*100)+'%';drawLinks();
  });
  const up=()=>{if(!drag)return;const d=drag;drag=null;if(!d.moved)clickCard(d.id);};
  bd.addEventListener('pointerup',up);bd.addEventListener('pointercancel',()=>{drag=null;});
  window.addEventListener('resize',()=>{if(S)drawLinks();});
})();
