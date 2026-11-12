/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Введення в терміналі: Enter, історія ↑↓, Tab, Ctrl+C / Ctrl+L.
   ============================================================ */
'use strict';
function bindTerm(){
  const inp=$('#cmd');
  $('#log').addEventListener('click',()=>{if(!String(getSelection()))inp.focus();});
  inp.addEventListener('keydown',e=>{
    e.stopPropagation();const T=S.term;
    if(e.key==='Enter'){
      e.preventDefault();const v=inp.value;inp.value='';
      if(T.mode==='pw'){T.mode='sh';echo(T.pwPrompt+' ');if(S.on&&!S.reloc)unzipTry(v);ps1();}
      else run(v);
    }else if(e.key==='ArrowUp'&&T.mode==='sh'){e.preventDefault();if(T.hi>0)inp.value=T.hist[--T.hi]||'';}
    else if(e.key==='ArrowDown'&&T.mode==='sh'){e.preventDefault();T.hi=Math.min(T.hist.length,T.hi+1);inp.value=T.hist[T.hi]||'';}
    else if(e.key==='Tab'&&T.mode==='sh'){e.preventDefault();const c=complete(inp.value);if(c)inp.value=c;}
    else if(e.ctrlKey&&e.key==='c'&&!String(getSelection())){echo($('#ps1').textContent+' '+(T.mode==='pw'?'':inp.value)+'^C');inp.value='';T.mode='sh';ps1();}
    else if(e.ctrlKey&&e.key==='l'){e.preventDefault();$('#log').innerHTML='';}
  });
}
