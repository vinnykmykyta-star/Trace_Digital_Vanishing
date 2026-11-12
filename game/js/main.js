/* ============================================================
   Роль: Керівник проєкту   (гілка Git: main)
   Точка входу: запуск гри, головний цикл (100 мс). Збирає роботу всіх гілок.
   ============================================================ */
'use strict';
function startGame(){S.on=true;last=performance.now();log('Справа відкрита. Завдання в README.txt (cat README.txt у терміналі).','inf');motd();renderIcons();$('#cmd').focus();}
newGame();
boot();
setInterval(tick,100);
