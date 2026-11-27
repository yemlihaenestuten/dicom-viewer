/* DICOM Görüntüleyici: çevrimdışı önbellek. Sürüm değişince bu dosya da değişir. */
const VERSION='V.3';
const CACHE='dicom-viewer-'+VERSION;
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('dicom-viewer-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.endsWith('/version.json'))return;           /* sürüm kontrolü her zaman ağdan */
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
});
