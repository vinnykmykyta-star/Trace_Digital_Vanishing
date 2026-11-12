/* ============================================================
   Роль: Розробник інтерфейсу   (гілка Git: feature/ui)
   Екран завантаження TRACE-OS.
   ============================================================ */
'use strict';
/* ---------- boot / wiring ---------- */
const BOOT=[
 ['t','TRACE-OS 2026.4 (kali-rolling base) — kernel 6.12.0-trace-amd64'],
 ['','[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/mapper/trace-root ro quiet'],
 ['','[    0.004112] DMI: Humanitas Lab ThinkPad X1, BIOS 4.2.0'],
 ['','[    0.311870] smpboot: CPU0-7 online, 16384 MB RAM'],
 ['','[    0.842231] nvme0n1: unlocking LUKS volume ........ done'],
 ['ok','[  OK  ] Started Journal Service.'],
 ['ok','[  OK  ] Mounted /evidence.'],
 ['ok','[  OK  ] Started Network Manager.'],
 ['ok','[  OK  ] Started OpenVPN: exit node SAFEHOUSE-01.'],
 ['ok','[  OK  ] Started MAC address randomizer.'],
 ['ok','[  OK  ] Loaded module exif-analyzer.'],
 ['ok','[  OK  ] Loaded module netlog-scanner.'],
 ['ok','[  OK  ] Loaded module forensics-util.'],
 ['ok','[  OK  ] Loaded module social-messenger.'],
 ['ok','[  OK  ] Loaded module evidence-board.'],
 ['wn','[ WARN ] ids-monitor: віддалені сенсори виявлено.'],
 ['wn','[ WARN ] heat-tracker: поріг зачистки 100%.'],
 ['','[  OK  ] Reached target Graphical Interface.'],
 ['t','trace login: detective (automatic login)'],
 ['','Last login: Sun Apr 12 21:14:08 from tty1'],
 ['ok','Starting desktop session ...']
];
let bootTimer=null,booting=false;
function boot(){
  const box=$('#bootin'),ov=$('#boot');
  ov.hidden=false;booting=true;box.innerHTML='<div id="bootbar"><i></i></div>';
  let i=0;
  const bar=box.querySelector('#bootbar');
  function done(){if(!booting)return;booting=false;clearTimeout(bootTimer);ov.hidden=true;startGame();}
  function step(){
    if(i>=BOOT.length){bootTimer=setTimeout(done,500);return;}
    const l=BOOT[i++],d=document.createElement('div');d.className=l[0];d.textContent=l[1];box.insertBefore(d,bar);
    bar.firstChild.style.width=(i/BOOT.length*100)+'%';
    window.scrollTo(0,document.body.scrollHeight);ov.scrollTop=ov.scrollHeight;
    bootTimer=setTimeout(step,70+Math.random()*150);
  }
  const sk=document.createElement('div');sk.id='bootskip';sk.textContent='Натисніть будь-яку клавішу або клацніть, щоб пропустити';box.appendChild(sk);
  ov.onclick=done;
  window.onkeydown=e=>{if(booting)done();};
  step();
}
