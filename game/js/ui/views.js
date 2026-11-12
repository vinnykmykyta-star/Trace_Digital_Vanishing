/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Вміст вікон інструментів: README, EXIF, Network, Forensics, Messenger.
   ============================================================ */
'use strict';
/* dossier */
function currentHint(){
  if(!has('gps'))return !S.inst.exiftool?'Купіть exiftool у магазині (Browser → darkmart.example), встановіть: sudo apt install exiftool. Потім cd evidence/photos і exiftool post_0412_latte.jpg.':'cd evidence/photos, потім exiftool post_0412_latte.jpg: GPS і час потраплять на дошку.';
  if(!has('mac'))return 'wigle search --lat ... --lon ... із картки GPS, далі ssh на знайдений шлюз. На шлюзі: cat README. У dnsmasq.leases знайдіть пристрій Левчук о 21:14, потім grep його IP у access.log.';
  if(!has('zip'))return 'curl https://shadow-board.example/t/4471 покаже файли; у ~/marta/loot виконайте wget для marta_backup.zip.';
  if(!S.fx.dec&&!has('hint'))return 'Messenger: пишіть Денису ввічливо, без погроз і грошей. Пароль складається з клички кота й дати.';
  if(!S.fx.dec)return 'unzip marta_backup.zip: кличка малими літерами та чотири цифри (день і місяць з EXIF-дати).';
  if(!has('loc'))return !S.inst['tor-browser']?'Ворон згадав vanta.onion. Купіть Tor Browser у DarkMart і встановіть: sudo apt install tor-browser. Потім відкрийте hidden-wiki.onion.':'Ключ має 3 частини. armory.onion: завантажте фото лота через torsocks wget у ~/marta/loot і прочитайте exiftool. fluffnet.onion: закодований рядок, base64 -d. bazaar.onion: torsocks curl .../lot/0412 і код сторінки. Зберіть KEY-1-KEY-2-KEY-3 і введіть на vanta.onion.';
  return 'З’єднайте картки: ключі 1, 2, 3 та VANTA ведуть до місця утримання (Склад №7).';
}
function rDossier(){
  const items=[
   ['Фото в Instagram: знайти місце й час',has('gps')],
   ['Знайти пристрій Марти в мережевих логах',has('mac')],
   ['Знайти й завантажити зашифрований архів',has('zip')],
   ['З’ясувати пароль від архіву',S.fx.dec||has('hint')],
   ['Розшифрувати архів',S.fx.dec],
   ['Знайти 3 частини ключа (Armory, FluffNet, Bazaar)',has('k1')&&has('k2')&&has('k3')],
   ['Відкрити портал VANTA і дізнатися, де Марта',has('loc')],
   ['З’єднати докази на дошці у ланцюг',requiredDone()]
  ];
  return '<h3>README.txt</h3><p>Марта Левчук, 19 років, студентка, зникла дванадцятого квітня. Поліція не має зачіпок, телефон вимкнено, профілі видалено. Її мати наймає вас як кібер-детектива.</p>'+
  '<h3>Правила</h3><ul class="chk" style="gap:4px"><li>У вас 30 хвилин, поки бандити замітають сліди.</li><li>Кожна дія залишає сліди, і бандити наближаються непомітно. Шкали немає: час від часу міняйте адресу (VPN з комп’ютера) або переносьте модем.</li><li>Почуєте стук у двері: швидко встаньте з-за комп’ютера й сховайтесь у кімнаті без модема (не у вітальні). Ховатися й переносити модем можна лише поки ви не за комп’ютером.</li><li>Під час підключення до серверів працює IDS Counter: 2 хвилини, щоб узяти потрібні логи.</li><li>Докази автоматично потрапляють на Evidence Board; з’єднуйте їх між собою. Хибний зв’язок підвищує підозру.</li><li>Нотатки ведіть у Notepad (nano notes.txt). Основна робота йде в Terminal (help). Не знаєте Linux: Browser → Linux Guide. Інструменти купуються в магазині darkmart.example.</li></ul>'+
  '<h3>Пошук ключів</h3><ul class="chk" style="gap:4px"><li>Ключ до vanta.onion має формат XXXX-XXXX-XXXX і складається з трьох частин.</li><li>Спершу Tor Browser: купіть у DarkMart, потім sudo apt install tor-browser. Каталог сайтів: hidden-wiki.onion.</li><li>Armory: фото лота, torsocks wget у ~/marta/loot, далі exiftool. FluffNet: дивний рядок у дописах, base64 -d. Bazaar: код сторінки лота, torsocks curl.</li><li>Складіть частини по порядку 1-2-3 і введіть ключ на vanta.onion.</li></ul>'+
  '<h3>Завдання</h3><ul class="chk">'+items.map(i=>'<li class="'+(i[1]?'done':'')+'">'+i[0]+'</li>').join('')+'</ul>'+
  '<p class="dim">Підказка: '+(S.hints?esc(currentHint()):'доступна за 30 секунд таймера.')+'</p>'+
  '<button class="btn" data-act="hint" type="button">Підказка (−30 с)</button>';
}

/* exif */
function thumb(p){return '<svg viewBox="0 0 86 46" fill="none" stroke="#76858f" stroke-width="1.5">'+p.svg+'</svg>';}
function rExif(){
  const E=S.exif;
  let h='<h3>Оберіть файл</h3><div class="files">'+PHOTOS.map(p=>'<button type="button" class="file '+(E.sel===p.id?'on':'')+'" data-act="selphoto" data-v="'+p.id+'">'+thumb(p)+'<span>'+p.name+'</span></button>').join('')+'</div>';
  if(E.sel){
    const p=PHOTOS.find(x=>x.id===E.sel);
    if(E.busy)h+='<p class="dim">Читання метаданих…</p>';
    else if(!E.res[p.id])h+='<button class="btn pri" data-act="scan" type="button">Аналізувати (+3% Heat)</button>';
    else if(!p.exif)h+='<p class="warn">EXIF відсутній: метадані видалено платформою.</p>';
    else{
      const pinMap={gps:'gps',home:'home',time:'time',cam:'cam'};
      h+='<div class="tblwrap"><table class="tbl"><tbody>'+p.exif.map(r=>{
        const pin=r[2]?('<button class="btn" data-act="pin" data-v="'+r[2]+'" type="button" '+(has(r[2])?'disabled':'')+'>'+(has(r[2])?'на дошці':'на дошку')+'</button>'):'';
        return '<tr><td>'+r[0]+'</td><td>'+esc(r[1])+'</td><td>'+pin+'</td></tr>';}).join('')+'</tbody></table></div>';
    }
  }
  return h;
}

/* network */
function rNet(){
  const N=S.net;
  if(S.reloc)return '<p class="dim">Триває перенесення модема. Інструмент недоступний.</p>';
  if(N.done)return '<h3>Логи захоплено</h3><p class="okc">Пристрій Марти знайдено, історія підключень збережена на дошці.</p>';
  if(N.conn){
    return '<h3>Підключено до Downtown Coffee</h3><p class="warn">IDS шукає вторгнення. Знайдіть пристрій Марти до кінця відліку.</p><div class="prog"><i id="netbar" style="width:'+(S.ids/IDS_T*100)+'%"></i></div>'+
    '<p class="dim">Шукайте за прізвищем і часом знімка. Хибний вибір: +6% Heat і −10 с IDS.</p><div class="rows">'+
    LOGS.map((r,i)=>'<button type="button" data-act="capture" data-v="'+i+'" class="'+(N.bad[i]?'x':'')+'"><span>'+r[0]+'</span><span>'+esc(r[1])+'</span><small>'+r[2]+' · '+r[3]+'</small></button>').join('')+'</div>';
  }
  let h='<h3>Оберіть точку підключення</h3><p class="dim">Звірте координати з карткою GPS на дошці.</p>';
  h+=VENUES.map(v=>'<label class="venue"><input type="radio" name="venue" data-act="selvenue" data-v="'+v.id+'" '+(N.venue===v.id?'checked':'')+'><span>'+v.name+'<small>'+v.c+'</small></span></label>').join('');
  if(N.lock>0)h+='<p class="warn">Канал заблоковано. Повторне підключення через <b id="nlock">'+fmt(N.lock)+'</b>.</p>';
  h+='<button class="btn pri" data-act="connect" type="button" '+(N.lock>0||!N.venue?'disabled':'')+'>Підключитись (IDS 02:00)</button>';
  return h;
}

/* forensics */
function rFx(){
  const F=S.fx;
  let h='<h3>Ціль: shadow-board.example /t/4471</h3><div class="tblwrap"><table class="tbl"><tbody>'+
   [['readme.txt','1 КБ',0],['thumbs.db','12 КБ',0],['marta_backup.zip','4,2 МБ · AES-256',1]].map(f=>'<tr><td>'+f[0]+'</td><td>'+f[1]+'</td><td>'+(f[2]&&F.dl?'<span class="okc">завантажено</span>':'<button class="btn" data-act="dl" data-v="'+f[2]+'" type="button">Завантажити</button>')+'</td></tr>').join('')+'</tbody></table></div>';
  if(F.dl&&!F.dec){
    h+='<h3>Архів зашифровано</h3><div class="field"><input id="fxpw" type="text" autocomplete="off" spellcheck="false" placeholder="Пароль" aria-label="Пароль"><button class="btn pri" data-act="decrypt" type="button">Розшифрувати</button></div>'+
    '<p class="dim">Хибна спроба: +7% Heat.</p><button class="btn danger" data-act="brute" type="button">Brute-force (−150 с, +30% Heat)</button>';
  }
  if(F.dec){
    h+='<h3>Вміст архіву</h3><pre class="doc">[chat_export.txt]\n21:52 Марта: Я принесла флешку.\n21:53 Ворон: Склад №7, порт. Ніхто не має знати.\n21:53 Ворон: VANTA не пробачає помилок.\n\n[ledger.csv]\n12.04; склад №7; 3 передачі; рахунок VANTA-3</pre>';
  }
  return h;
}

/* social */
function rSoc(){
  const C=S.soc;
  let h='<h3>Денис, одногрупник</h3><div class="trust" title="Довіра">'+[0,1].map(i=>'<s class="'+(C.stage>i?'on':'')+'"></s>').join('')+'</div>';
  h+='<div class="chat">'+C.msgs.map(m=>'<div class="msg '+m.w+'">'+esc(m.t)+'</div>').join('')+'</div>';
  if(C.done)h+='<p class="okc">Розмову завершено. Підказка до пароля на дошці.</p>';
  else if(C.block>0)h+='<p class="warn">Денис заблокував вас. Знову написати можна через <b id="nblock">'+fmt(C.block)+'</b>.</p>';
  else h+='<div class="opts">'+STAGES[C.stage].opts.map((o,i)=>'<button class="btn" type="button" data-act="say" data-v="'+i+'" '+(C.picked[C.stage+'-'+i]?'disabled':'')+'>'+esc(o.t)+'</button>').join('')+'</div><p class="dim">Нейтральна відповідь: +2% Heat. Тиск або гроші: +10% Heat, два таких кроки призводять до блокування.</p>';
  return h;
}
