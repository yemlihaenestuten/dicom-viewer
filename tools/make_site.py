#!/usr/bin/env python3
"""Kullanım: python3 tools/make_site.py V.1 [YAYIN_URL]  -> depo köküne yazar"""
import sys,os,json,re,subprocess
from PIL import Image,ImageDraw
ver=sys.argv[1] if len(sys.argv)>1 else 'V.1'
url=sys.argv[2] if len(sys.argv)>2 else ''
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d=root+'/src/'
o=root+'/'
os.makedirs(o,exist_ok=True)
parts=['p1_head.html','p0_i18n.js','p2a_dicom.js','p2b_volume.js','p3a_core.js','p3b_ui.js','p3c_studies.js','p3d_update.js','p4_tail.html']
html=''.join(open(d+p,encoding='utf-8').read() for p in parts)
assert len(re.findall(r"const VER='[^']*';",html))==1
html=re.sub(r"const VER='[^']*';","const VER='%s';"%ver,html)
html=html.replace("const UPDATE_URL='';","const UPDATE_URL=%s;"%json.dumps(url))
open(o+'index.html','w',encoding='utf-8').write(html)
open(o+'DICOM_Goruntuleyici.html','w',encoding='utf-8').write(html)
open(o+'version.json','w').write(json.dumps({'version':ver,'date':__import__('datetime').date.today().isoformat(),'name':'DICOM Görüntüleyici'},ensure_ascii=False)+'\n')
open(o+'sw.js','w',encoding='utf-8').write("""/* DICOM Görüntüleyici: çevrimdışı önbellek. Sürüm değişince bu dosya da değişir. */
const VERSION='%s';
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
"""%ver)
open(o+'manifest.webmanifest','w',encoding='utf-8').write(json.dumps({
 'name':'DICOM Görüntüleyici','short_name':'DICOM','description':'CT, MR, X-ray, PET DICOM viewer. Offline, single file.',
 'start_url':'./','scope':'./','display':'standalone','background_color':'#0d1013','theme_color':'#0d1013','lang':'tr',
 'icons':[{'src':'icon-192.png','sizes':'192x192','type':'image/png'},{'src':'icon-512.png','sizes':'512x512','type':'image/png'},{'src':'icon-maskable.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]},ensure_ascii=False,indent=1)+'\n')
def icon(size,pad,round_):
    S=size*4;im=Image.new('RGBA',(S,S),(0,0,0,0));g=ImageDraw.Draw(im)
    bg=(13,16,19,255);ac=(76,194,176,255);dim=(37,45,53,255)
    if round_:g.rounded_rectangle([0,0,S-1,S-1],radius=int(S*.22),fill=bg)
    else:g.rectangle([0,0,S,S],fill=bg)
    c=S/2;r=S*(0.5-pad)*0.78
    g.ellipse([c-r,c-r,c+r,c+r],outline=ac,width=int(S*.035))
    r2=r*.55;g.ellipse([c-r2,c-r2,c+r2,c+r2],outline=dim,width=int(S*.03))
    w=int(S*.03);g.line([c-r*1.12,c,c+r*1.12,c],fill=ac,width=w);g.line([c,c-r*1.12,c,c+r*1.12],fill=ac,width=w)
    g.ellipse([c-S*.03,c-S*.03,c+S*.03,c+S*.03],fill=(242,184,75,255))
    return im.resize((size,size),Image.LANCZOS)
icon(192,.14,True).save(o+'icon-192.png');icon(512,.14,True).save(o+'icon-512.png');icon(512,.24,False).save(o+'icon-maskable.png')
print('site hazır',ver,url or '(adres yok)',len(html)//1024,'KB')
