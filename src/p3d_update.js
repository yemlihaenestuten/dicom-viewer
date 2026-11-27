/* ---------- Çevrimdışı kayıt (PWA) ve sürüm güncelleme ---------- */
(function(){
  const btn=$('#updBtn');if(!btn)return;
  /* Tek dosya olarak (file://) açıldığında: yalnızca yayın adresi varsa düğme o adresi açar */
  if(UPD_FILE){
    if(UPDATE_URL){btn.hidden=false;btn.addEventListener('click',()=>{window.open(UPDATE_URL,'_blank','noopener');});}
    return;
  }
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
    if(!navigator.onLine){if(!silent)setStatus('Çevrimdışısınız. Güncelleme için internet gerekir. Program mevcut sürümle çalışmaya devam eder.',true);return;}
    if(!silent)setStatus('Sürüm kontrol ediliyor.');
    let j;
    try{
      const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)throw new Error('http '+r.status);
      j=await r.json();
    }catch(_){if(!silent)setStatus('Sürüm bilgisi alınamadı. İnternet bağlantısını kontrol edin.',true);return;}
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
