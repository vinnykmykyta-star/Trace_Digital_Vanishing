/* ============================================================
   Роль: Розробник ядра   (гілка Git: feature/core)
   Рушій bash-подібного терміналу: файлова система, розбір рядка, команди (exec).
   ============================================================ */
'use strict';
function manPage(c){const g=GUIDE[c];return c.toUpperCase()+' — '+g[0]+'\n\n'+g[1]+'\n\nПРИКЛАДИ\n'+g[2].map(e=>'  '+e).join('\n');}

const sh=m=>({sh:m});
const isDir=v=>!!v&&typeof v==='object'&&!v.bin;
const cont=v=>typeof v==='function'?v():String(v);
function fsRoot(){
  const T=S.term;
  if(T.remote)return {root:{README:REMOTE_README},etc:{hostname:'gw-downtown\n'},var:{lib:{misc:{'dnsmasq.leases':LEASES}},log:{squid:{'access.log':ACCESS}}}};
  const loot={};if(T.dl)loot['marta_backup.zip']={bin:'zip'};
  if(S.fx.dec){loot['chat_export.txt']=CHAT;loot['ledger.csv']=LEDGER;}
  if(T.lot17)loot['lot17.jpg']={bin:1,p:{id:'lot17',name:'lot17.jpg',exif:[['Камера','Redmi Note 9',null],['Коментар','KEY-1: 7F3A','k1']]}};
  const photos={};PHOTOS.forEach(p=>photos[p.name]={bin:1,p});
  return {home:{trace:{marta:{'README.txt':README_TXT,'notes.txt':()=>($('#notes')||{}).value||'',evidence:{photos},captures:S.net.done?{'marta_device.log':CAPLOG}:{},loot}}}};
}
function parts(p){
  const T=S.term;let a;
  if(p[0]==='/')a=[];else if(p[0]==='~'){a=T.remote?['root']:['home','trace'];p=p.slice(1);}else a=T.cwd.slice();
  p.split('/').forEach(s=>{if(!s||s==='.')return;if(s==='..')a.pop();else a.push(s);});return a;
}
function node(a){let v=fsRoot();for(const s of a){if(!isDir(v)||!(s in v))return undefined;v=v[s];}return v;}
function expand(list){const r=[];list.forEach(p=>{
  if(!p.includes('*')){r.push(p);return;}
  const i=p.lastIndexOf('/'),dir=p.slice(0,i+1)||'.',pre=i>=0?p.slice(0,i+1):'';
  const re=new RegExp('^'+p.slice(i+1).replace(/[.+?^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*')+'$');
  const d=node(parts(dir)),m=isDir(d)?Object.keys(d).filter(k=>re.test(k)).map(k=>pre+k):[];
  r.push(...(m.length?m:[p]));});return r;}
function tok(s){const r=[],re=/"([^"]*)"|'([^']*)'|(\S+)/g;let m;while((m=re.exec(s)))r.push(m[1]!==undefined?m[1]:m[2]!==undefined?m[2]:m[3]);return r;}
function out(t,c){const l=$('#log'),d=document.createElement('div');d.className='o '+(c||'');d.textContent=t;l.appendChild(d);l.scrollTop=l.scrollHeight;}
function echo(t){const l=$('#log'),d=document.createElement('div');d.className='cmd';d.textContent=t;l.appendChild(d);l.scrollTop=l.scrollHeight;}
const post=fn=>S.term.post.push(fn);
function ps1(){
  const T=S.term,el=$('#ps1'),inp=$('#cmd');if(!el)return;
  if(T.mode==='pw'){el.textContent=T.pwPrompt;inp.type='password';return;}
  inp.type='text';let p='/'+T.cwd.join('/');
  if(T.remote)el.textContent='root@'+T.remote+':'+(p==='/root'?'~':p)+'#';
  else el.textContent='trace@kali:'+p.replace(/^\/home\/trace/,'~')+'$';
}
function rshDrop(msg){
  const T=S&&S.term;if(!T||!T.remote)return;
  T.remote=null;T.cwd=T.saved||['home','trace','marta'];S.net.conn=false;
  if(msg)out(msg,'bad');ps1();
}
function motd(){out('TRACE-OS terminal. Введіть help. Не знаєте Linux? Відкрийте Browser → Linux Guide. Почніть з: cat README.txt','inf');ps1();}

function run(line){
  const T=S.term;line=line.trim();
  echo($('#ps1').textContent+' '+line);
  if(!line||!S.on||S.away)return;
  T.hist.push(line);T.hi=T.hist.length;
  if(S.reloc){out('bash: система зайнята: триває перенесення.','bad');return;}
  T.post=[];
  try{
    let inp=null;const st=line.split('|');
    for(const s of st){let a=tok(s);if(a[0]==='sudo')a.shift();T.tor=false;if(a[0]==='torsocks'){if(!S.inst['tor-browser'])throw sh('bash: torsocks: command not found');a.shift();T.tor=true;}if(!a.length)continue;inp=exec(a,inp);}
    if(inp)out(inp);
    T.post.forEach(f=>f());
  }catch(e){
    if(e&&e.sh!==undefined)out(e.sh,'bad');else{console.error(e);out('bash: внутрішня помилка','bad');}
  }
  T.post=[];ps1();
}
function unzipTry(pw){
  out('Archive:  marta_backup.zip');
  if(pw.toLowerCase()===PASS){out('  inflating: chat_export.txt\n  inflating: ledger.csv','ok');decrypted();}
  else{S.fx.tries++;out('   skipping: chat_export.txt         incorrect password\n   skipping: ledger.csv              incorrect password','bad');addHeat(7,'невірний пароль');beep(140,.15,'sawtooth');}
}
function capture(){
  S.net.done=true;addCard('mac');addCard('history');
  log('IDS-відлік зупинено. Журнал клієнта '+MIP+' збережено в ~/marta/captures.','ok');
  rshDrop();out('Connection to '+GW+' closed.');renderWin();
}

function exec(a,inp){
  const T=S.term,c=a[0],R=!!T.remote;
  const flags=a.slice(1).filter(x=>/^-./.test(x)),args=expand(a.slice(1).filter(x=>!/^-./.test(x)));
  if(R&&LOCAL.includes(c))throw sh('-bash: '+c+': command not found');
  if(GATED.includes(c)&&!S.inst[c])throw sh('bash: '+c+': command not found');
  if(a[1]==='--help'&&GUIDE[c])return manPage(c);
  const rd=p=>{const v=node(parts(p));if(v===undefined)throw sh(c+': '+p+': No such file or directory');if(isDir(v))throw sh(c+': '+p+': Is a directory');if(v.bin)throw sh(c+': '+p+': двійковий файл');return cont(v);};
  switch(c){
  case 'help':return R?'Віддалений шелл: ls cd pwd cat head tail grep wc find tree echo clear exit\nПодивіться README: cat README':
`Команди (Tab доповнює, ↑/↓ історія). Новачок? Браузер → Linux Guide або man <команда>
  Навігація: pwd ls cd tree find
  Файли:     cat head tail grep wc file echo nano
  Система:   clear history whoami id hostname uname date which man
  Програми:  sudo apt install <пакет>   (пакети купуються в darkmart.example)
  Розслідування:
    exiftool <файл>                    метадані фото (купити!)
    wigle search --lat X --lon Y       Wi-Fi точки за координатами
    ssh [user@]host / exit             віддалений доступ (IDS 02:00)
    curl / wget <url>                  веб
    unzip / fcrackzip                  архіви
  Гра: hint (−30 с)   modem (стан модема)   vpn-pro (зміна адреси)`;
  case 'man':if(!args[0])throw sh('What manual page do you want?');if(!GUIDE[args[0]])throw sh('No manual entry for '+args[0]);return manPage(args[0]);
  case 'clear':$('#log').innerHTML='';return '';
  case 'pwd':return '/'+T.cwd.join('/');
  case 'whoami':return R?'root':'trace';
  case 'id':return R?'uid=0(root) gid=0(root) groups=0(root)':'uid=1000(trace) gid=1000(trace) groups=1000(trace),27(sudo)';
  case 'hostname':return R?T.remote:'kali';
  case 'uname':return flags.length?'Linux '+(R?T.remote+' 5.10.0-21-amd64':'kali 6.12.0-trace-amd64')+' #1 SMP x86_64 GNU/Linux':'Linux';
  case 'date':return new Date().toString();
  case 'echo':return a.slice(1).join(' ');
  case 'history':return T.hist.map((h,i)=>String(i+1).padStart(4)+'  '+h).join('\n');
  case 'exit':case 'logout':
    if(!R)throw sh('bash: exit: цю сесію закрити не можна');
    out('logout\nConnection to '+GW+' closed.');post(()=>rshDrop());return '';
  case 'cd':{const p=args[0]||'~',a2=parts(p),v=node(a2);
    if(v===undefined)throw sh('bash: cd: '+p+': No such file or directory');
    if(!isDir(v))throw sh('bash: cd: '+p+': Not a directory');T.cwd=a2;return '';}
  case 'ls':{
    const long=flags.some(f=>/l/.test(f)),all=flags.some(f=>/a/.test(f)),tg=args.length?args:['.'],o=[];
    const sz=x=>typeof x==='function'?x().length:typeof x==='string'?x.length:isDir(x)?4096:x.p?2202009:4404019;
    tg.forEach(p=>{const v=node(parts(p));
      if(v===undefined){o.push('ls: cannot access \''+p+'\': No such file or directory');return;}
      if(tg.length>1)o.push(p+':');
      if(!isDir(v)){o.push(p);return;}
      let ks=Object.keys(v);if(all)ks=['.','..'].concat(ks);
      o.push(long?ks.map(k=>{const x=v[k];return (k==='.'||k==='..'||isDir(x)?'d':'-')+'rw-r--r-- 1 trace trace '+String(sz(x||{})).padStart(7)+' Apr 12 21:40 '+k;}).join('\n'):ks.map(k=>isDir(v[k])?k+'/':k).join('  '));});
    return o.join('\n');}
  case 'cat':return args.length?args.map(rd).join('\n'):(inp==null?'':inp);
  case 'head':case 'tail':{
    let n=10;const ni=a.indexOf('-n');if(ni>0)n=+a[ni+1]||10;else{const m=flags.find(f=>/^-\d+$/.test(f));if(m)n=+m.slice(1);}
    const fa=args.filter(x=>!/^\d+$/.test(x)),l=(fa.length?fa.map(rd).join('\n'):inp||'').split('\n');
    return (c==='head'?l.slice(0,n):l.slice(-n)).join('\n');}
  case 'wc':{const t=args.length?args.map(rd).join('\n'):(inp||''),l=t?t.split('\n').length:0;
    return flags.some(f=>/l/.test(f))?String(l):l+' '+t.split(/\s+/).filter(Boolean).length+' '+t.length;}
  case 'file':return args.map(p=>{const v=node(parts(p));
    if(v===undefined)return p+': cannot open `'+p+'\' (No such file or directory)';
    return p+': '+(isDir(v)?'directory':v.p?(/png$/.test(p)?'PNG image data, 1080 x 1920, 8-bit/color RGBA':'JPEG image data, Exif standard'):v.bin?'Zip archive data, at least v5.1 to extract, compression method=AES Encrypted':'UTF-8 Unicode text');}).join('\n');
  case 'nano':if(/notes\.txt$/.test(args[0]||'')){post(()=>openWin('notes'));return '';}throw sh('nano: відкривається лише notes.txt');
  case 'rm':case 'mv':case 'cp':case 'mkdir':case 'touch':throw sh(c+': operation not permitted (chain of custody lock)');
  case 'grep':{
    let fl='',pat=null;const fs=[];
    a.slice(1).forEach(x=>{if(/^-[a-zA-Z]+$/.test(x)&&pat===null)fl+=x.slice(1);else if(pat===null)pat=x;else fs.push(x);});
    if(pat===null)throw sh('Usage: grep [OPTION]... PATTERN [FILE]...');
    let re;try{re=new RegExp(pat,fl.includes('i')?'i':'');}catch(_){re=new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),fl.includes('i')?'i':'');}
    const srcs=fs.length?expand(fs).map(p=>[p,rd(p)]):[['(stdin)',inp==null?'':inp]],o=[];
    srcs.forEach(([p,t])=>t.split('\n').forEach((l,i)=>{if(re.test(l)!==fl.includes('v'))o.push((srcs.length>1?p+':':'')+(fl.includes('n')?(i+1)+':':'')+l);}));
    if(R&&o.length&&o.every(l=>l.includes('TCP_MISS'))){
      if(o.some(l=>l.includes('shadow-board'))){if(!S.net.done)post(capture);}
      else if(o.length<=2)post(()=>{S.ids-=10;addHeat(6,'запит до чужого пристрою');beep(140,.15,'sawtooth');});
    }
    return o.join('\n');}
  case 'tree':{const p=args[0]||'.',v=node(parts(p));
    if(v===undefined)throw sh(p+' [error opening dir]');if(!isDir(v))return p;
    const w=(d,pre)=>Object.keys(d).map((k,i,ar)=>{const l=i===ar.length-1,x=d[k];return pre+(l?'└── ':'├── ')+k+(isDir(x)&&Object.keys(x).length?'\n'+w(x,pre+(l?'    ':'│   ')):'');}).join('\n');
    return p+'\n'+w(v,'');}
  case 'find':{const ni=a.indexOf('-name'),pat=ni>0?a[ni+1]:'*',base=args.filter(x=>x!==pat)[0]||'.',bp=parts(base),bv=node(bp);
    if(bv===undefined)throw sh('find: ‘'+base+'’: No such file or directory');
    const re=new RegExp('^'+pat.replace(/[.+?^${}()|[\]\\]/g,'\\$&').replace(/\*/g,'.*')+'$'),o=[];
    const w=(d,pa)=>Object.keys(d).forEach(k=>{const q=pa+'/'+k;if(re.test(k))o.push(q);if(isDir(d[k]))w(d[k],q);});
    w(isDir(bv)?bv:{},bp.length?'/'+bp.join('/'):'');return o.join('\n');}
  case 'which':return args.map(x=>CMDS.includes(x)&&(!GATED.includes(x)||S.inst[x])?'/usr/bin/'+x:'').filter(Boolean).join('\n');
  case 'apt':case 'apt-get':{
    if(a[1]==='update')return 'Hit:1 http://kali.download/kali kali-rolling InRelease\nReading package lists... Done';
    if(a[1]!=='install'||!args.filter(x=>x!=='install').length)throw sh('Usage: apt install <пакет>');
    args.filter(x=>x!=='install'&&x!=='-y').forEach(p=>{
      if(!PKG[p]||!S.bought[p]){out('E: Unable to locate package '+p+(PKG[p]?'\n(пакет платний: спершу придбайте його в darkmart.example)':''),'bad');return;}
      if(S.inst[p]){out(p+' is already the newest version.');return;}
      out('Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed:\n  '+p+'\n0 upgraded, 1 newly installed, 0 to remove.\nSetting up '+PKG[p]+' ...','ok');
      S.inst[p]=1;if(p==='vpn-pro'){addHeat(-15);out('vpn-pro: тунель активовано. Адресу тепер можна змінювати у вікні Router або командою vpn-pro connect.','ok');}
      beep(660,.07,'square');renderWin();});
    return '';}
  case 'base64':{const d=flags.some(f=>/d/.test(f)),t=args.length?rd(args[0]):(inp==null?'':inp);
    try{if(d){const r=decodeURIComponent(escape(atob(t.trim())));if(/KEY-2/.test(r))post(()=>addCard('k2'));return r;}return btoa(unescape(encodeURIComponent(t)));}
    catch(e){throw sh('base64: invalid input');}}
  case 'hint':S.t-=30;S.hints++;return 'Підказка (−30 с): '+currentHint();
  case 'modem':{
    if(a[1]==='place'||a[1]==='move')throw sh('modem: віддалено перенести модем неможливо. Встаньте з-за комп’ютера й перенесіть його власноруч.');
    return 'Модем: кімната «'+ROOMS[S.room].n+'», адреса '+S.addr+(S.vpn!==null?' (VPN: '+VPN[S.vpn].n+')':'')+'\nПеренести модем можна лише власноруч: кнопка «Встати з-за комп’ютера».';}
  case 'vpn-pro':{
    const sub=a[1]||'status';
    if(sub==='status')return S.vpn===null?'vpn-pro: відключено. Адреса '+S.addr:'vpn-pro: підключено, '+VPN[S.vpn].n+', адреса '+S.addr;
    if(sub==='list')return VPN.map((v,i)=>(i+1)+'  '+v.n).join('\n');
    if(sub!=='connect')throw sh('Usage: vpn-pro [status|list|connect <№|країна>]');
    const q=(a[2]||'').toLowerCase(),i=/^\d+$/.test(q)?+q-1:VPN.findIndex(v=>v.n.toLowerCase().startsWith(q));
    if(!q||!VPN[i])throw sh('vpn-pro: невідомий сервер. Подивіться: vpn-pro list');
    out('vpn-pro: підключення до '+VPN[i].n+'…');post(()=>vpnSwitch(i));return '';}
  case 'exiftool':{
    if(!args.length)throw sh('Usage: exiftool [OPTIONS] FILE ...');
    args.forEach(p=>{const v=node(parts(p));
      if(v===undefined){out('Error: File not found - '+p,'bad');return;}
      if(!v.p){out('Error: Unsupported file type - '+p,'bad');return;}
      const P=v.p,row=(k,x)=>k.padEnd(32)+': '+x;
      let t=[row('ExifTool Version Number','12.76'),row('File Name',P.name),row('Directory','evidence/photos'),row('File Type',/png$/.test(P.name)?'PNG':'JPEG'),row('Image Size','1080x1920')];
      if(P.exif)P.exif.forEach(r=>t.push(row(EXL[r[0]]||r[0],r[1])));
      out(t.join('\n'));
      if(!S.term.scanned[P.id]){S.term.scanned[P.id]=1;addHeat(3,'аналіз метаданих');beep(500,.06);}
      if(P.exif)P.exif.forEach(r=>{if(r[2])addCard(r[2]);});
    });return '';}
  case 'wigle':{
    const n=a.join(' ').match(/-?\d+\.\d+/g)||[];
    if(a[1]!=='search'||n.length<2)throw sh('usage: wigle search --lat <deg> --lon <deg>');
    out('WiGLE: lat='+n[0]+' lon='+n[1]+' radius=50m');
    const hit=VENUES.find(v=>{const m=v.c.match(/(\d+\.\d+) N, (\d+\.\d+) E/);return Math.hypot(+m[1]-n[0],+m[2]-n[1])<.0006;});
    if(hit&&hit.ok)out('SSID                  BSSID              ENC   GATEWAY\nDowntownCoffee_Free   70:4F:57:C2:19:A8  WPA2  '+GW+'   (gw-downtown)');
    else{out('0 networks found.');addHeat(2,'порожній запит до WiGLE');}
    return '';}
  case 'ssh':{
    const tgt=(a.slice(1).find(x=>!x.startsWith('-'))||'').split('@').pop();
    if(!tgt)throw sh('usage: ssh [-i identity] [user@]hostname');
    if(S.net.lock>0)throw sh('ssh: connect to host '+tgt+' port 22: Connection refused (канал заблоковано ще '+fmt(S.net.lock)+')');
    if(S.net.done)throw sh('ssh: журнал уже захоплено, повторне підключення не потрібне');
    if(tgt!==GW){out('ssh: connect to host '+tgt+' port 22: Connection timed out','bad');addHeat(4,'спроба підключення до чужого вузла');return '';}
    T.saved=T.cwd;T.remote='gw-downtown';T.cwd=['root'];S.net.conn=true;S.ids=IDS_T;
    out('Warning: Permanently added \''+GW+'\' (ED25519) to the list of known hosts.\nLinux gw-downtown 5.10.0-21-amd64 #1 SMP Debian x86_64\nLast login: Sun Apr 12 20:02:17 2026\n\nВи на шлюзі кафе. Почніть з: ls, cat README, tree /var');
    log('IDS Counter: 02:00. Знайдіть пристрій Марти до кінця відліку.','inf');beep(300,.1);renderWin();return '';}
  case 'curl':case 'wget':{
    const vt=c==='curl'?['-o']:['-o','-O','-P'];let u=null,skip=false;
    a.slice(1).forEach(x=>{if(skip){skip=false;return;}if(vt.includes(x)){skip=true;return;}if(!x.startsWith('-')&&u===null)u=x;});
    if(!u)throw sh(c==='curl'?'curl: try \'curl --help\' for more information':'wget: missing URL');
    const m=u.match(/^(?:https?:\/\/)?([^\/]+)(\/.*)?$/),host=m[1],path=(m[2]||'/').replace(/\/$/,'');
    if(/\.onion$/.test(host)){
      if(!T.tor)throw sh(c==='curl'?'curl: (6) Could not resolve host: '+host:'wget: unable to resolve host address ‘'+host+'’');
      if(host==='bazaar.onion'&&path==='/lot/0412'){post(()=>addCard('k3'));return BAZ_SRC;}
      if(host==='armory.onion'&&path==='')return ARM_INDEX;
      if(host==='armory.onion'&&path==='/files/lot17.jpg'){
        if(c==='curl'&&!flags.includes('-O'))throw sh('Warning: Binary output can mess up your terminal. Use "--output -" to tell curl to output it to your terminal anyway, or consider "--output <FILE>" to save to a file.');
        if(T.cwd.join('/')!=='home/trace/marta/loot')throw sh('Cannot write to ‘lot17.jpg’ (Permission denied). Завантаження дозволено лише в ~/marta/loot');
        out('Saving to: ‘lot17.jpg’\n‘lot17.jpg’ saved [2196402/2196402]','ok');T.lot17=1;addHeat(3,'завантаження з dark web');return '';}
      if(['fluffnet.onion','vanta.onion','bazaar.onion','armory.onion','hidden-wiki.onion'].includes(host))return '<html><title>'+host+'</title>Потрібен JavaScript: відкрийте сторінку в браузері.</html>';
      throw sh('curl: (7) Failed to connect to '+host+' port 80: Connection refused');
    }
    if(host!=='shadow-board.example'||!has('history')){
      if(c==='curl')throw sh('curl: (6) Could not resolve host: '+host);
      throw sh('--21:20:11--  '+u+'\nResolving '+host+'... failed: Name or service not known.\nwget: unable to resolve host address ‘'+host+'’');}
    if(path==='/t/4471')return '<html><title>Index of /t/4471</title>\n<a href="readme.txt">readme.txt</a>            1K\n<a href="thumbs.db">thumbs.db</a>            12K\n<a href="marta_backup.zip">marta_backup.zip</a>    4.2M';
    const fn=path.split('/').pop();
    if(path.indexOf('/t/4471/')!==0||!['readme.txt','thumbs.db','marta_backup.zip'].includes(fn))throw sh(c==='curl'?'curl: (22) The requested URL returned error: 404':'HTTP request sent, awaiting response... 404 Not Found');
    if(fn!=='marta_backup.zip'){out('‘'+fn+'’ saved');addHeat(2,'зайве завантаження');return '';}
    if(c==='curl'&&!flags.includes('-O'))throw sh('Warning: Binary output can mess up your terminal. Use "--output -" to tell curl to output it to your terminal anyway, or consider "--output <FILE>" to save to a file.');
    if(T.cwd.join('/')!=='home/trace/marta/loot')throw sh('Cannot write to ‘'+fn+'’ (Permission denied). Завантаження дозволено лише в ~/marta/loot');
    out(c==='wget'?'--21:20:11--  '+u+'\nResolving shadow-board.example... 185.220.101.47\nConnecting to shadow-board.example|185.220.101.47|:443... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 4404019 (4.2M) [application/zip]\nSaving to: ‘marta_backup.zip’\n\nmarta_backup.zip   100%[===================>]   4.20M  1.83MB/s    in 2.3s\n\n‘marta_backup.zip’ saved [4404019/4404019]':'  % Total    % Received  Time\n100 4301k  100 4301k    0     0  1840k      0  0:00:02  --:--:--  1840k');
    T.dl=true;S.fx.dl=true;addHeat(4,'завантаження з форуму');addCard('zip');renderWin();return '';}
  case 'unzip':{
    const pi=a.indexOf('-P'),pw=pi>0?a[pi+1]:null,f=args.filter(x=>x!==pw)[0];
    if(!f)throw sh('Usage: unzip [-Z] [-opts[modifiers]] file[.zip] [list]');
    const v=node(parts(f));
    if(!v||v.bin!=='zip')throw sh('unzip:  cannot find or open '+f+', '+f+'.zip or '+f+'.ZIP.');
    if(flags.includes('-l'))return 'Archive:  '+f+'\n  Length      Date    Time    Name\n---------  ---------- -----   ----\n      212  2026-04-12 21:52   chat_export.txt\n       58  2026-04-12 21:52   ledger.csv\n---------                     -------\n      270                     2 files';
    if(S.fx.dec)throw sh('Archive уже розпаковано (chat_export.txt, ledger.csv).');
    if(pw!==null){unzipTry(pw);return '';}
    out('Archive:  '+f);T.mode='pw';T.pwPrompt='[marta_backup.zip] chat_export.txt password:';return '';}
  case 'fcrackzip':{
    const f=args.filter(x=>!/^\//.test(x)&&/\.zip$/.test(x))[0];
    if(!a.includes('-D')&&!a.includes('-b'))throw sh('usage: fcrackzip -u -D -p WORDLIST file.zip');
    const v=f&&node(parts(f));if(!v||v.bin!=='zip')throw sh('fcrackzip: '+(f||'file')+': No such file or directory');
    if(S.fx.dec)throw sh('fcrackzip: архів уже розшифровано');
    out('checking pw 123456\nchecking pw qwerty\nchecking pw kotik2020\n...\n\nPASSWORD FOUND!!!!: pw == '+PASS,'ok');
    S.t-=150;addHeat(30,'brute-force викликав підозру');S.fx.brute=true;post(decrypted);return '';}
  default:throw sh('bash: '+c+': command not found');
  }
}
function complete(v){
  const m=v.match(/^(.*?)(\S*)$/),pre=m[1],w=m[2];
  if(!pre.trim()){const c=CMDS.filter(x=>x.startsWith(w)&&(!GATED.includes(x)||S.inst[x]));return c.length===1?c[0]+' ':null;}
  const i=w.lastIndexOf('/'),dir=w.slice(0,i+1),base=w.slice(i+1),d=node(parts(dir||'.'));
  if(!isDir(d))return null;
  const c=Object.keys(d).filter(k=>k.startsWith(base));
  return c.length===1?pre+dir+c[0]+(isDir(d[c[0]])?'/':' '):null;
}
