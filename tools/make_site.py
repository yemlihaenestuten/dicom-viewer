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
import datetime as _dt
assert html.count("const BUILD_DATE='';")==1
html=html.replace("const BUILD_DATE='';","const BUILD_DATE='%s';"%_dt.date.today().strftime('%d.%m.%Y'))
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
open(o+'indir.html','w',encoding='utf-8').write(open(d+'indir.html',encoding='utf-8').read())  # tek tıkla indirme sayfası
open(o+'manifest.webmanifest','w',encoding='utf-8').write(json.dumps({
 'name':'DICOM Görüntüleyici','short_name':'DICOM','description':'CT, MR, X-ray, PET DICOM viewer. Offline, single file.',
 'start_url':'./','scope':'./','display':'standalone','background_color':'#0d1013','theme_color':'#0d1013','lang':'tr',
 'icons':[{'src':'icon-192.png','sizes':'192x192','type':'image/png'},{'src':'icon-512.png','sizes':'512x512','type':'image/png'},{'src':'icon-maskable.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]},ensure_ascii=False,indent=1)+'\n')
# ---- simge: koyu camgöbeği zemin, aksiyel beyin kesiti, nişangâh ----
LOGO_SVG=("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>"
 "<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1b4b55'/><stop offset='1' stop-color='#0a1317'/></linearGradient>"
 "<radialGradient id='b' cx='.5' cy='.45' r='.6'><stop offset='0' stop-color='#b3bec7'/><stop offset='1' stop-color='#6c7a85'/></radialGradient></defs>"
 "<rect width='64' height='64' rx='14' fill='url(#g)'/>"
 "<ellipse cx='32' cy='33' rx='15.5' ry='18.5' fill='#eef3f6'/>"
 "<ellipse cx='32' cy='33' rx='12.6' ry='15.6' fill='url(#b)'/>"
 "<path d='M32 18.5V47.5' stroke='#566470' stroke-width='.9'/>"
 "<ellipse cx='28.6' cy='31.5' rx='2.1' ry='5.2' transform='rotate(-14 28.6 31.5)' fill='#27323a'/>"
 "<ellipse cx='35.4' cy='31.5' rx='2.1' ry='5.2' transform='rotate(14 35.4 31.5)' fill='#27323a'/>"
 "<g stroke='#4cc2b0' stroke-width='2.4' stroke-linecap='round'><path d='M7 33H14M50 33H57M32 7V12M32 54V57'/></g>"
 "<circle cx='32' cy='33' r='2' fill='#f2b84b'/></svg>")
import urllib.parse as _up
LOGO_URI='data:image/svg+xml,'+_up.quote(LOGO_SVG,safe=":/=' ")
for f in ('index.html','DICOM_Goruntuleyici.html'):
    t=open(o+f,encoding='utf-8').read()
    assert t.count('LOGO_DATA_URI')==2
    open(o+f,'w',encoding='utf-8').write(t.replace('LOGO_DATA_URI',LOGO_URI))
def icon(size,full):
    """full=True: maskable (kenarsız zemin, içerik güvenli bölgede)"""
    S=size*4;im=Image.new('RGBA',(S,S),(0,0,0,0))
    bg=Image.new('RGBA',(S,S));gd=ImageDraw.Draw(bg)
    for y in range(S):
        k=y/(S-1);gd.line([(0,y),(S,y)],fill=(int(27+(10-27)*k),int(75+(19-75)*k),int(85+(23-85)*k),255))
    mask=Image.new('L',(S,S),0);md=ImageDraw.Draw(mask)
    if full:md.rectangle([0,0,S,S],fill=255)
    else:md.rounded_rectangle([0,0,S-1,S-1],radius=int(S*14/64),fill=255)
    im.paste(bg,(0,0),mask)
    g=ImageDraw.Draw(im)
    sc=(S/64)*(0.78 if full else 1.0);ox=S/2-32*sc;oy=S/2-32*sc
    X=lambda v:ox+v*sc;Y=lambda v:oy+v*sc
    def ell(cx,cy,rx,ry,fill):g.ellipse([X(cx-rx),Y(cy-ry),X(cx+rx),Y(cy+ry)],fill=fill)
    ell(32,33,15.5,18.5,(238,243,246,255))
    # beyin: içten dışa koyulaşan katmanlar
    for i in range(24):
        k=i/23;c=(int(108+(179-108)*k),int(122+(190-122)*k),int(133+(199-133)*k),255)
        ell(32,33-1.2*k,12.6*(1-0.55*k),15.6*(1-0.55*k),c)
    g.line([X(32),Y(18.5),X(32),Y(47.5)],fill=(86,100,112,255),width=max(1,int(.9*sc)))
    for cx,ang in ((28.6,-14),(35.4,14)):
        v=Image.new('RGBA',(S,S),(0,0,0,0));vd=ImageDraw.Draw(v)
        vd.ellipse([X(cx-2.1),Y(31.5-5.2),X(cx+2.1),Y(31.5+5.2)],fill=(39,50,58,255))
        v=v.rotate(-ang,center=(X(cx),Y(31.5)),resample=Image.BICUBIC);im.alpha_composite(v);g=ImageDraw.Draw(im)
    w=max(2,int(2.4*sc));ac=(76,194,176,255)
    for (x1,y1,x2,y2) in ((7,33,14,33),(50,33,57,33),(32,7,32,12),(32,54,32,57)):
        g.line([X(x1),Y(y1),X(x2),Y(y2)],fill=ac,width=w)
        for (px,py) in ((x1,y1),(x2,y2)):g.ellipse([X(px)-w/2,Y(py)-w/2,X(px)+w/2,Y(py)+w/2],fill=ac)
    ell(32,33,2,2,(242,184,75,255))
    return im.resize((size,size),Image.LANCZOS)
icon(192,False).save(o+'icon-192.png');icon(512,False).save(o+'icon-512.png');icon(512,True).save(o+'icon-maskable.png')
print('site hazır',ver,url or '(adres yok)',len(html)//1024,'KB')
