/* ---------- Çevrimdışı kayıt (PWA) ve sürüm güncelleme ---------- */
(function(){
  const btn=$('#updBtn');if(!btn)return;
  /* Tek dosya olarak (file://) açıldığında: yalnızca yayın adresi varsa düğme o adresi açar */
  if(UPD_FILE){fileUpdater(btn);return;}
  const net=()=>setNetOff(!navigator.onLine);
  window.addEventListener('online',net);window.addEventListener('offline',net);net();
  if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol))return;
  let reg=null,waiting=null,busy=false;
  function head(tag,attrs){const e=document.createElement(tag);Object.keys(attrs).forEach(k=>e.setAttribute(k,attrs[k]));document.head.appendChild(e);}
  function waitInstalled(w){
    return new Promise((res,rej)=>{
      if(!w)return rej(new Error('no worker'));
      if(w.state==='installed')return res(w);
      w.addEventListener('statechange',()=>{if(w.state==='installed')res(w);else if(w.state==='redundant')rej(new Error('redundant'));});
    });
  }
  function ready(ver){
    btn.classList.add('ready');
    setStatus('Yeni sürüm hazır: '+ver+'. Yüklü görüntüler kapanacak. Güncellemek için düğmeye tekrar basın.');
  }
  async function check(silent){
    if(!navigator.onLine){setNetOff(true);if(!silent)setStatus('Çevrimdışısınız. Güncelleme için internet gerekir. Program mevcut sürümle çalışmaya devam eder.',true);return;}
    if(!silent)setStatus('Sürüm kontrol ediliyor.');
    let j;
    try{
      const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('http '+r.status);
      j=await r.json();
    }catch(_){setNetOff(true);if(!silent)setStatus('Sürüm bilgisi alınamadı. İnternet bağlantısını kontrol edin.',true);return;}
    setNetOff(false);
    if(!j||!j.version||j.version===VER){if(!silent)setStatus('Program güncel. Sürüm: '+VER);return;}
    if(!silent)setStatus('Yeni sürüm indiriliyor.');
    try{
      await reg.update();
      waiting=reg.waiting||await waitInstalled(reg.installing);
      ready(j.version);
    }catch(_){waiting=null;if(!silent)setStatus('Güncelleme tamamlanamadı. Sayfayı yenileyip tekrar deneyin.',true);}
  }
  function apply(){
    let done=false;
    const go=()=>{if(done)return;done=true;location.reload();};
    navigator.serviceWorker.addEventListener('controllerchange',go);
    try{waiting.postMessage('skip');}catch(_){}
    setTimeout(go,4000);
  }
  btn.addEventListener('click',async()=>{
    if(busy)return;busy=true;btn.disabled=true;
    try{if(waiting&&btn.classList.contains('ready'))apply();else await check(false);}
    finally{busy=false;btn.disabled=false;}
  });
  navigator.serviceWorker.register('sw.js').then(r=>{
    reg=r;btn.hidden=false;
    head('link',{rel:'manifest',href:'manifest.webmanifest'});
    head('link',{rel:'apple-touch-icon',href:'icon-192.png'});
    if(navigator.onLine)setTimeout(()=>check(true),2500);
  }).catch(()=>{});
})();

/* Tek dosya (file://) güncellemesi: yayın adresindeki version.json okunur, yeni sürüm varsa
   HTML dosyası indirilip "DICOM GÖRÜNTÜLEYİCİ_GG.AA.YYYY_V.n.html" adıyla kaydedilir.
   Otomatik kontrol yalnızca açılıştan sonraki ilk 1 dakika içinde yapılır (15 sn arayla dener).
   Sonrasında yalnızca Güncelle düğmesi kontrol eder. */
function fileUpdater(btn){
  if(!UPDATE_URL)return;
  btn.hidden=false;
  const BASE=UPDATE_URL.replace(/\/?$/,'/');
  const WINDOW_MS=60000,RETRY_MS=15000,T0=Date.now();
  let busy=false,autoDone=false,timer=0,file=null,pending=null,asked=false;
  const num=v=>{const m=/(\d+)/.exec(String(v||''));return m?+m[1]:0;};
  const pad=n=>String(n).padStart(2,'0');
  function fdate(iso){
    const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(iso||'');
    if(m)return m[3]+'.'+m[2]+'.'+m[1];
    const d=new Date();return pad(d.getDate())+'.'+pad(d.getMonth()+1)+'.'+d.getFullYear();
  }
  async function getJSON(){
    const r=await fetch(BASE+'version.json?t='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('http '+r.status);
    return r.json();
  }
  function save(){
    const a=document.createElement('a');
    a.href=URL.createObjectURL(file.blob);a.download=file.name;a.style.display='none';
    document.body.appendChild(a);a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},60000);
    btn.classList.add('ready');
    setStatus('Yeni sürüm kaydedildi: '+file.name+'. Dosyayı İndirilenler klasöründen açın. İndirme başlamadıysa Güncelle düğmesine tekrar basın.');
  }
  async function download(j){
    setStatus('Yeni sürüm bulundu: '+j.version+'. İndiriliyor.');
    const r=await fetch(BASE+'DICOM_Goruntuleyici.html?t='+Date.now(),{cache:'no-store'});
    if(!r.ok)throw new Error('http '+r.status);
    const t=await r.text();
    if(t.indexOf('const '+"VER='"+j.version+"';")<0)throw new Error('sürüm uyuşmuyor');
    file={blob:new Blob([t],{type:'text/html;charset=utf-8'}),name:'DICOM GÖRÜNTÜLEYİCİ_'+fdate(j.date)+'_'+j.version+'.html'};
    save();
  }
  /* silent: otomatik kontrol. Ağ hatasında false döner (yeniden denenebilir). */
  function ask(j){
    asked=true;pending=j;btn.classList.add('ready');
    const A=document.getElementById('updAsk');
    document.getElementById('uaText').textContent='Yeni sürüm yayınlandı: '+fdate(j.date)+' · '+j.version+'. İndirmek ister misiniz?';
    A.hidden=false;document.getElementById('uaYes').focus();
  }
  function closeAsk(){document.getElementById('updAsk').hidden=true;}
  document.getElementById('uaYes').addEventListener('click',async()=>{
    closeAsk();if(!pending||busy)return;busy=true;btn.disabled=true;
    try{await download(pending);pending=null;}catch(_){setStatus('Güncelleme indirilemedi. İnternet bağlantısını kontrol edin.',true);}
    finally{busy=false;btn.disabled=false;}
  });
  document.getElementById('uaNo').addEventListener('click',()=>{closeAsk();setStatus('Yeni sürüm şimdi indirilmedi. İstediğinizde Güncelle düğmesine basın.');});
  const net=()=>setNetOff(!navigator.onLine);
  window.addEventListener('online',net);window.addEventListener('offline',net);net();
  async function check(silent){
    if(!navigator.onLine){setNetOff(true);if(!silent)setStatus('Çevrimdışısınız. Güncelleme için internet gerekir. Program mevcut sürümle çalışmaya devam eder.',true);return false;}
    if(!silent)setStatus('Sürüm kontrol ediliyor.');
    let j;
    try{j=await getJSON();}catch(_){setNetOff(true);if(!silent)setStatus('Sürüm bilgisi alınamadı. İnternet bağlantısını kontrol edin.',true);return false;}
    setNetOff(false);
    if(!j||!j.version||num(j.version)<=num(VER)){if(!silent)setStatus('Program güncel. Sürüm: '+VER);return true;}
    if(silent){if(!asked)ask(j);return true;}   /* otomatik kontrolde yalnızca bir kez sorulur */
    try{await download(j);}catch(_){setStatus('Güncelleme indirilemedi. İnternet bağlantısını kontrol edin.',true);return false;}
    return true;
  }
  function stopAuto(){autoDone=true;clearTimeout(timer);window.removeEventListener('online',onOnline);}
  async function auto(){
    if(autoDone||busy)return;
    if(Date.now()-T0>WINDOW_MS){stopAuto();return;}
    busy=true;let ok=false;
    try{ok=await check(true);}finally{busy=false;}
    if(ok||file){stopAuto();return;}
    const left=WINDOW_MS-(Date.now()-T0);
    if(left<=0){stopAuto();return;}
    timer=setTimeout(auto,Math.min(RETRY_MS,left));
  }
  function onOnline(){clearTimeout(timer);auto();}
  window.addEventListener('online',onOnline);
  setTimeout(auto,1500);
  btn.addEventListener('click',async()=>{
    if(busy)return;
    if(file){save();return;}
    closeAsk();
    busy=true;btn.disabled=true;
    try{if(await check(false))stopAuto();}
    finally{busy=false;btn.disabled=false;}
  });
}
