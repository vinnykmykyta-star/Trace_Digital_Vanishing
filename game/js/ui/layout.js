/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Розмітка робочого столу (аналог XAML у WPF). Вставляється в #app (або в body).
   Одне джерело розмітки і для гри (index.html), і для тестів (tests/tests.html).
   ============================================================ */
'use strict';
(function(){
  const HTML=`<div id="os">
  <div id="desk">
    <nav id="icons" aria-label="Робочий стіл"></nav>
    <div id="alert" hidden><span>ГРУПА ЗАЧИСТКИ ВИРУШИЛА</span><b id="altime">00:25</b><button class="btn" id="altbtn" type="button">Встати з-за комп’ютера</button></div>
  </div>
  <div id="startmenu" hidden>
    <h4>TRACE//OS</h4>
    <button type="button" id="smreloc">Встати з-за комп’ютера</button>
    <button type="button" id="smsnd" aria-pressed="false">Звук: вимк.</button>
    <button type="button" id="smdoss">Відкрити README</button>
    <button type="button" id="smnew">Нова гра</button>
  </div>
  <div id="task">
    <button id="startbtn2" type="button" aria-haspopup="true">&#9656; Applications</button>
    <button id="standbtn" type="button">Встати з-за комп’ютера</button>
    <div id="tbtns"></div>
    <div id="tray">
      <div class="stat ids" id="idsbox" hidden><label>IDS</label><b id="idsnum">02:00</b></div>
      <div class="stat heat" id="heatbox"><label>Heat</label><div class="heatrow"><div class="bar"><i id="heatfill"></i></div><b id="heatnum">5%</b></div></div>
      <div class="stat safe tr"><label>Модем у</label><span id="safename" style="font-size:11px;white-space:nowrap"></span></div>
      <div class="stat" id="clockbox"><label>Час розслідування</label><b id="clock">30:00</b></div>
    </div>
  </div>
</div>

<div class="ov" id="boot"><div id="bootin"></div></div>

<div class="ov" id="roomov" hidden><div class="sheet" id="roomsheet"></div></div>

<div class="ov" id="relov" hidden><div class="sheet">
  <h2>Перенесення модема</h2>
  <p class="dim" id="relmsg">Зачистка слідів, зміна IP, пересування обладнання.</p>
  <div class="prog"><i id="relbar"></i></div>
</div></div>

<div class="ov" id="end" hidden><div class="sheet" id="endsheet"></div></div>`;
  (document.getElementById('app')||document.body).insertAdjacentHTML('afterbegin',HTML);
})();
