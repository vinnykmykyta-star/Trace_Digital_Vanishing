/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Браузер TraceFox: сторінки сайтів, магазин DarkMart, ключ VANTA.
   ============================================================ */
'use strict';
/* ---------- browser ---------- */

const lk=(u,t)=>'<a data-go="'+u+'">'+t+'</a>';
const normU=u=>u.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/$/,'');
const pst=(w,t)=>'<div class="post"><b>'+w+'</b><p class="dim">'+t+'</p></div>';
const lot=(i,t,a,b)=>'<div class="item"><div style="display:flex;gap:10px;align-items:center"><img class="pix" src="'+i+'" alt="мініатюра"><div><b>'+t+'</b><small>'+a+'</small><small>'+b+'</small></div></div></div>';
function itm(img,t,pr,note){return '<div class="item"><div style="display:flex;gap:10px;align-items:center"><img class="ph" src="'+img+'" alt=""><div><b>'+t+'</b> · '+pr+(note?'<small>'+note+'</small>':'')+'</div></div></div>';}
function sitePage(u){
  const tor=!!S.inst['tor-browser'];
  if(/\.onion/.test(u)&&!tor)return '<h2>Не вдалося відкрити</h2><p class="dim">Адреси .onion відкриваються лише через Tor. Придбайте Tor Browser у DarkMart і встановіть: sudo apt install tor-browser.</p><p>'+lk('darkmart.example','DarkMart')+'</p>';
  if(!u||u==='trace://home'){
    return '<h2>TraceFox</h2><p class="dim">Закладки:</p><p>'+lk('darkmart.example','DarkMart: магазин інструментів')+'<br>'+lk('linuxguide.example','Linux Guide: усі команди для новачків')+'<br>'+lk('kyivnews.example','KyivNews: новини')+'<br>'+lk('instagram.example/marta_levchuk','Instagram: marta_levchuk')+(tor?'<br>'+lk('hidden-wiki.onion','Hidden Wiki (.onion)'):'')+'</p>';
  }
  if(u==='darkmart.example'){
    return '<h2>DarkMart</h2><p class="dim">Інструменти для розслідувань. Оплата кредитами, кожен платіж залишає слід. Після покупки встановіть пакет у терміналі: sudo apt install назва.</p><div class="bal">Баланс: '+S.money+' кр.</div><div>'+
    SHOP.map(i=>'<div class="item"><div><b>'+i.n+'</b> · '+i.p+' кр.<small>'+i.d+'</small>'+(S.bought[i.id]?'<small class="okc">'+(S.inst[i.id]?'встановлено':'куплено. Встановіть: sudo apt install '+i.id)+'</small>':'')+'</div><button class="btn pri" type="button" data-buy="'+i.id+'" '+(S.bought[i.id]||S.money<i.p?'disabled':'')+'>'+(S.bought[i.id]?'Куплено':'Купити')+'</button></div>').join('')+'</div>';
  }
  if(u==='linuxguide.example'){
    return '<h2>Linux Guide для початківців</h2><h4>Основи</h4><ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:5px">'+CONCEPTS.map(c=>'<li>'+esc(c)+'</li>').join('')+'</ul><h4>Команди</h4>'+
    Object.keys(GUIDE).map(k=>{const g=GUIDE[k];return '<details><summary><b>'+k+'</b> — '+esc(g[0])+'</summary><p>'+esc(g[1])+'</p><pre class="doc">'+esc(g[2].join('\n'))+'</pre></details>';}).join('');
  }
  if(u==='kyivnews.example'){
    return '<h2>KyivNews</h2><div class="post"><b>Студентка зникла після концерту</b><p class="dim">Марту Левчук, 19 років, востаннє бачили 12 квітня. Поліція просить відгукнутись свідків.</p></div><div class="post"><b>Порт: перевірки складів</b><p class="dim">Митниця повідомила про додаткові перевірки складів. Подробиць не розкрито.</p></div><div class="post"><b>Wi-Fi у кав’ярнях: чому не варто довіряти відкритим мережам</b><p class="dim">Експерти нагадують, що власник точки бачить, які сайти відвідують клієнти.</p></div>';
  }
  if(u==='instagram.example/marta_levchuk'){
    const pt=(i,n,c)=>'<div class="post"><div style="display:flex;gap:10px"><img class="ph" src="'+i+'" alt=""><div><b>'+n+'</b><p class="dim">'+c+'</p></div></div></div>';
    return '<h2>@marta_levchuk</h2><div style="display:flex;gap:12px;align-items:center"><img class="ph" style="width:96px;height:128px" src="'+IMG.marta+'" alt="Марта"><p class="dim">Марта Левчук · 19 · Київ<br>Профіль майже порожній.</p></div>'+pt(IMG.latte,'post_0412_latte.jpg','Кава перед концертом ☕')+pt(IMG.cat,'murka_sleeping.jpg','Хтось знову зайняв моє ліжко')+pt(IMG.crowd,'concert_crowd.jpg','Скоро почнеться 🔥');
  }
  if(u.indexOf('shadow-board.example/t/4471')===0&&has('history')){
    return '<h2>shadow-board.example / t/4471</h2><div class="post">Файлообмін. Завантаження з браузера вимкнено, тільки curl або wget.</div><div class="item"><span>readme.txt</span><span class="dim">1 КБ</span></div><div class="item"><span>thumbs.db</span><span class="dim">12 КБ</span></div><div class="item"><span>marta_backup.zip</span><span class="dim">4,2 МБ</span></div>';
  }
  if(u==='hidden-wiki.onion'){
    return '<h2>Hidden Wiki</h2><p class="dim">Каталог .onion-сайтів. Усе тут кримінальне: дивіться, але нічого не купуйте.</p><div class="item"><div><b>'+lk('armory.onion','Wolf Arms')+'</b><small>Приватний продаж зброї</small></div></div><div class="item"><div><b>'+lk('fluffnet.onion','FluffNet')+'</b><small>Форум фурі-спільноти</small></div></div><div class="item"><div><b>'+lk('bazaar.onion','Bazaar')+'</b><small>Закритий реєстр торгівлі людьми</small></div></div><div class="item"><div><b>'+lk('vanta.onion','VANTA')+'</b><small>Головний вузол мережі. Потрібен ключ із трьох частин, які лежать на сайтах каталогу.</small></div></div>';
  }
  if(u==='armory.onion'){
    return '<h2>Wolf Arms</h2><p class="dim">Приватний продаж. Оплата XMR.</p>'+itm(IMG.guns,'Лот 12 · револьвер .38 і компактний 9 мм','2.1 XMR','Б/в, стан хороший')+itm(IMG.shotgun,'Лот 15 · помпова рушниця 12/76 і набої','1.4 XMR','Набої в комплекті')+itm(IMG.parts,'Лот 17 · ударники, комплект 2 шт.','0.2 XMR','Фото без стиснення: /files/lot17.jpg')+'<h4>Дошка оголошень</h4>'+pst('Wolf','Оплата лише наперед. Без торгу. Нових надходжень до п’ятниці не буде.')+pst('anon_91','Лот 17 забрав. Повне фото відрізняється від прев’ю, у файлі є якісь позначки.')+pst('Raven','Хто з вас береться за склад у порту? Пишіть у приват.')+pst('Wolf','Правило майданчика: чужі лоти не обговорюємо, поліцію не згадуємо.');
  }
  if(u==='fluffnet.onion'){
    return '<h2>FluffNet</h2><p class="dim">Форум фурі-спільноти: фурсьюти, арти, зустрічі.</p>'+itm(IMG.blue,'Новий фурсьют: лис із неоновими вухами','RedPaw · 14 відповідей','Три місяці роботи, оцінюйте!')+itm(IMG.fox,'Мій м’язовий фурсьют, дякую за поради','MuscleFox · 22 відповіді','Тепер ще й хвіст підняв')+itm(IMG.cow,'Корова на конвенті: чи це фурі?','MooMoo · 40 відповідей','Надувний костюм, вирішив не стояти осторонь')+pst('FoxyLu','Куди поїхати на фурі-конвент у травні? Є ідеї? Думаю про Львів.')+pst('NeonTail','Хто з Києва? Збираємось у п’ятницю на кави, приходьте у фурсьютах.')+pst('ArtWolf','Ціни на арт-комісії 2026: скетч 500 грн, кольоровий арт 1500 грн.')+pst('VantaFox','Я новенький. Мій підпис-ідентифікатор для чату: '+FKEY+' . Здається, скрипт зламався.')+pst('RedPaw','VantaFox, виглядає як закодований текст.')+pst('MooMoo','Хтось має схему для надувного хвоста? Прошу в особисті.');
  }
  if(u==='bazaar.onion'||u.indexOf('bazaar.onion/')===0){
    return '<h2>BAZAAR · реєстр</h2><p class="dim">Інші записи приховано.</p>'+lot(IMG.pix,'ЛОТ 0412','Київ · утримується · склад №7','Тримач: VANTA')+lot(IMG.s1,'ЛОТ 0409','Одеса · передано','Тримач: інша група')+lot(IMG.s2,'ЛОТ 0410','Харків · у дорозі','Тримач: VANTA')+lot(IMG.s3,'ЛОТ 0411','Львів · утримується','Тримач: Ворон')+lot(IMG.s4,'ЛОТ 0413','Дніпро · очікує','Тримач: VANTA')+lot(IMG.s5,'ЛОТ 0414','Запоріжжя · передано','Тримач: інша група')+'<p class="dim">Мініатюра лота 0412 збережена з фото Марти в Instagram. Решту мініатюр замасковано.</p><h4>Оголошення</h4>'+pst('Admin','Партії підтверджує лише VANTA. Самодіяльність карається.')+pst('Raven','Склад №7 заповнений. Наступний рейс за графіком.')+pst('guest_44','Хто бачив новий лот 0412? Мініатюра схожа на фото з Instagram.');
  }
  if(u==='vanta.onion'){
    if(!S.vanta)return '<h2>VANTA</h2><p class="dim">Доступ лише за ключем. Формат: XXXX-XXXX-XXXX (частини 1, 2, 3 по порядку).</p><div style="display:flex;gap:6px"><input id="vkey" type="text" autocomplete="off" spellcheck="false" placeholder="XXXX-XXXX-XXXX" style="flex:1;background:#06090c;border:1px solid var(--line2);color:var(--fg);padding:6px 8px;font:inherit"><button class="btn pri" type="button" data-vkey="1">Увійти</button></div>';
    return '<h2>VANTA · внутрішній портал</h2><div class="post"><b>Партія 0412</b><p class="dim">Статус: утримується.<br>Місце: склад №7, причал 4.<br>Відправлення: 04:00.<br>Відповідальний: «Ворон».</p></div>'+pst('Ворон','Партію 0412 не залишати без охорони. Відвантаження не пізніше 04:00.')+pst('Admin','Хто світив мініатюри в мережі, відповість перед власником.');
  }
  return '<h2>Сторінку не знайдено</h2><p class="dim">ERR_NAME_NOT_RESOLVED: '+esc(u)+'</p><p>'+lk('trace://home','На початкову')+'</p>';
}
function brGo(u,push){
  const B=S.br;u=u&&u!=='trace://home'?normU(u):'trace://home';
  if(push!==false&&B.url!==u)B.h.push(B.url);
  B.url=u;const inp=$('#brurl'),pg=$('#brpage');if(!inp)return;
  inp.value=u==='trace://home'?'':u;pg.innerHTML=sitePage(u);pg.scrollTop=0;
  if(u==='bazaar.onion'&&S.inst['tor-browser']&&!S.sawBaz){S.sawBaz=true;log('Це реєстр торгівлі людьми. На одному з лотів ви впізнаєте Марту.','bad');}
}
function brRender(){if(S&&$('#brpage')){const pg=$('#brpage'),st=pg.scrollTop;pg.innerHTML=sitePage(S.br.url);pg.scrollTop=st;$('#brurl').value=S.br.url==='trace://home'?'':S.br.url;}}
function bindBr(){
  const inp=$('#brurl'),pg=$('#brpage');
  inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')brGo(inp.value);});
  W.browser.el.addEventListener('click',e=>{
    if(!S.on)return;
    const b=e.target.closest('[data-br]'),g=e.target.closest('[data-go]'),y=e.target.closest('[data-buy]'),vk=e.target.closest('[data-vkey]');
    if(b){const k=b.dataset.br;if(k==='go')brGo(inp.value);else if(k==='home')brGo('trace://home');else if(S.br.h.length)brGo(S.br.h.pop(),false);}
    else if(g)brGo(g.dataset.go);
    else if(vk){const k=(($('#vkey')||{}).value||'').trim().toUpperCase();
      if(k==='7F3A-9B21-D04E'){S.vanta=true;addCard('loc');log('Доступ до порталу VANTA відкрито.','ok');brRender();}
      else{addHeat(5,'невірний ключ VANTA');log('Невірний ключ. Перевірте всі три частини.','bad');beep(140,.15,'sawtooth');}}
    else if(y){const it=SHOP.find(x=>x.id===y.dataset.buy);
      if(!it||S.bought[it.id])return;
      if(S.money<it.p){log('Недостатньо кредитів.','bad');return;}
      S.money-=it.p;S.bought[it.id]=1;addHeat(2,'платіж у даркнет-магазині');
      log('Куплено: '+it.n+'. Встановіть: sudo apt install '+it.id,'ok');beep(660,.07,'square');brRender();}
  });
}
