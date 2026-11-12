/* ============================================================
   Роль: Керівник проєкту   (гілка Git: main)
   Спільні дрібні помічники: селектор $, формат часу, екранування HTML.
   ============================================================ */
'use strict';
const $=s=>document.querySelector(s);

const fmt=s=>{s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
