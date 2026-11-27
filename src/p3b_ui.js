/* ---------- Arayüz: kontrast, füzyon, işaret, etiket, fare, yükleme ---------- */
const NAMES={0x00020010:'Transfer Syntax',0x00080005:'Karakter Seti',0x00080008:'Image Type',0x00080016:'SOP Class',0x00080020:'Study Date',0x00080060:'Modality',0x00080070:'Manufacturer',0x00080080:'Institution',0x00080090:'Referring Physician',0x0008103E:'Series Description',0x00100010:'Patient Name',0x00100020:'Patient ID',0x00100030:'Birth Date',0x00100040:'Sex',0x00180050:'Slice Thickness',0x00180060:'kVp',0x00180088:'Spacing Between Slices',0x00181164:'Imager Pixel Spacing',0x00200013:'Instance Number',0x00200032:'Image Position',0x00200037:'Image Orientation',0x00200052:'Frame of Reference',0x00201041:'Slice Location',0x00280002:'Samples/Pixel',0x00280004:'Photometric',0x00280010:'Rows',0x00280011:'Columns',0x00280030:'Pixel Spacing',0x00280100:'Bits Allocated',0x00280101:'Bits Stored',0x00280103:'Pixel Representation',0x00281050:'Window Center',0x00281051:'Window Width',0x00281052:'Rescale Intercept',0x00281053:'Rescale Slope',0x00541001:'Units (PET)'};
const PRESET_GROUPS=[
 ['Otomatik',[['dicom','Dosyadaki pencere'],['p1_99','Otomatik %1–%99'],['p01_999','Kontrastı artır %0,1–%99,9'],['p5_95','Yüksek kontrast %5–%95'],['pet','PET sıcak nokta %0–%99,5'],['full','Tam aralık']]],
 ['BT',[['abd','Abdomen 400 / 50'],['soft','Yumuşak doku 400 / 40'],['medi','Mediasten 350 / 50'],['liver','Karaciğer 150 / 60'],['renal','Böbrek 500 / 100'],['fat','Yağ 250 / −80'],['lung','Akciğer 1500 / −600'],['lungn','Akciğer dar 800 / −600'],['bone','Kemik 2000 / 500'],['bonen','Kemik dar 1000 / 300'],['spine','Omurga yumuşak doku 250 / 50'],['brain','Beyin 80 / 40'],['stroke','İnme 40 / 40'],['subd','Subdural 250 / 80'],['pf','Posterior fossa 140 / 40'],['angio','Anjiyo 700 / 200']]],
 ['Elle',[['custom','Özel']]]];
const PRE={abd:[400,50],soft:[400,40],medi:[350,50],liver:[150,60],renal:[500,100],fat:[250,-80],lung:[1500,-600],lungn:[800,-600],bone:[2000,500],bonen:[1000,300],spine:[250,50],brain:[80,40],stroke:[40,40],subd:[250,80],pf:[140,40],angio:[700,200]};
const PCT={p1_99:[1,99],p01_999:[.1,99.9],p5_95:[5,95],pet:[0,99.5]};
const isPET=m=>m==='PT'||m==='NM',isAnat=m=>m==='CT'||m==='MR';
{
  const sel=$('#preset');
  PRESET_GROUPS.forEach(([n,items])=>{const g=document.createElement('optgroup');g.label=n;items.forEach(([v,t])=>g.appendChild(new Option(t,v)));sel.appendChild(g);});
  [$('#cmap'),$('#ovCmap')].forEach(s=>CMAP_LIST.forEach(([v,t])=>s.add(new Option(t,v))));
}
const fmt=x=>Math.abs(x)>=100?String(Math.round(x)):String(+x.toFixed(2));

/* --- arayüz eşitleme --- */
function syncUI(){
  const vol=S.cur.vol,dims=dimsOf(vol);
  VIEWS.forEach(v=>{const r=$('#rg-'+v.id);r.max=dims[v.d]-1;r.value=S.c[v.d];r.disabled=dims[v.d]<2;$('#sl-'+v.id).textContent=`${S.c[v.d]+1} / ${dims[v.d]}`;});
  ['ww','wl'].forEach(k=>{$(`#${k}R`).value=S[k];$(`#${k}N`).value=Math.round(S[k]);});
  $('#inv').checked=S.invert;renderTags();
}
function setWL(ww,wl,custom=true){
  S.ww=Math.max(1e-6,ww);S.wl=wl;if(custom)$('#preset').value='custom';
  $('#wwR').value=S.ww;$('#wlR').value=S.wl;$('#wwN').value=fmt(S.ww);$('#wlN').value=fmt(S.wl);requestRender();
}
function presetWL(vol,val){
  if(val==='dicom'&&vol.ww>0)return [vol.ww,vol.wc];
  if(PCT[val]){const lo=pct(vol,PCT[val][0]),hi=pct(vol,PCT[val][1]);return [hi-lo||1,(hi+lo)/2];}
  if(PRE[val])return PRE[val];
  return [vol.hmax-vol.hmin||1,(vol.hmax+vol.hmin)/2];
}
function defaultPreset(vol){return vol.color?'full':vol.ww>0?'dicom':isPET(vol.mod)?'pet':vol.mod==='CT'?'soft':'p1_99';}
function applyPreset(val){const [a,b]=presetWL(S.cur.vol,val);setWL(a,b,false);}
function configWLRange(vol){
  const range=Math.max(1e-6,vol.hmax-vol.hmin),stp=range>500?1:range/500;
  $('#wwR').min=stp;$('#wwR').max=range*1.5;$('#wwR').step=stp;$('#wlR').min=vol.hmin-range*.25;$('#wlR').max=vol.hmax+range*.25;$('#wlR').step=stp;
  $('#wwN').step=$('#wlN').step=stp;
}
function setStatus(t,err){const e=$('#status');e.textContent=t;e.title=t;e.classList.toggle('err',!!err);}

function setSeries(s){
  const vol=ensureVol(s);
  s.rulers=s.rulers||[];
  S.cur=s;S.ov=null;S.c=[vol.nx>>1,vol.ny>>1,vol.nz>>1];S.invert=false;S.gamma=1;S.cmap=isPET(vol.mod)?'igray':'gray';S.full=false;
  VIEWS.forEach(v=>{v.zoom=1;v.panx=0;v.pany=0;v.key='';});
  configWLRange(vol);
  const pre=defaultPreset(vol);
  $('#preset').value=pre;applyPreset(pre);
  $('#cmap').value=S.cmap;$('#gamR').value=1;$('#gamO').textContent='1,00';$('#cmap').disabled=vol.color;$('#gamR').disabled=vol.color;
  refreshOvSelect();updateOvUI();layout();renderMarks();renderRulers();syncUI();requestRender();markStudies();syncSeriesSel();
  if(!vol.uniform)setStatus(`${s.name}. Uyarı: kesit aralığı düzensiz ya da kesitler aynı konumda, koronal ve sagittal görünümler bozuk olabilir.`);
}

/* --- füzyon --- */
function refreshOvSelect(){
  const sel=$('#ovSel');sel.innerHTML='';sel.add(new Option('Yok',''));
  S.series.forEach((s,i)=>{if(s!==S.cur&&!s.color)sel.add(new Option(s.name,i));});
  sel.value=S.ov?String(S.series.indexOf(S.ov.series)):'';
}
function updateOvUI(){
  const on=!!S.ov;
  if(typeof updateFusUI==='function')updateFusUI();
  ['ovCmap','ovA','ovLo','ovHi','ovAuto'].forEach(id=>$('#'+id).disabled=!on);
  $('#ovCmap').value=S.ovCmap;$('#ovA').value=Math.round(S.ovA*100);
  $('#ovLo').value=on?fmt(S.ovLo):'';$('#ovHi').value=on?fmt(S.ovHi):'';
  if(on){const r=S.ov.vol.hmax-S.ov.vol.hmin,st=r>500?1:r/200;$('#ovLo').step=$('#ovHi').step=st;}
}
function ovAuto(){
  const O=S.ov.vol,hi=pct(O,99.7);
  S.ovHi=hi;S.ovLo=isPET(O.mod)?hi*.08:pct(O,5);updateOvUI();requestRender();
}
function setOverlay(s){
  if(!s){S.ov=null;refreshOvSelect();updateOvUI();requestRender();return;}
  if(s===S.cur){setStatus('Taban ve kaplama aynı seri olamaz.',true);return;}
  try{
    const O=ensureVol(s);
    const key=S.series.indexOf(S.cur)+'-'+S.series.indexOf(s);
    S.ovOff=(S.offs[key]||[0,0,0]).slice();
    S.ov={series:s,vol:O,key,M:makeOverlayMap(S.cur.vol,O,S.ovOff)};
    S.ovCmap=isPET(O.mod)?'fire':'jet';S.ovA=.55;ovAuto();
    const b=S.cur.vol;
    if(b.forUid&&O.forUid&&b.forUid!==O.forUid)setStatus('Uyarı: iki seri farklı referans çerçevesinde (Frame of Reference). Hizalama doğru olmayabilir.',true);
  }catch(err){S.ov=null;setStatus('Füzyon kurulamadı: '+err.message,true);}
  refreshOvSelect();updateOvUI();requestRender();
}
$('#ovSel').onchange=e=>{const s=e.target.value===''?null:S.series[+e.target.value];if(s&&S.mode==='grid')goMPR(S.cur);setOverlay(s);};
$('#ovCmap').onchange=e=>{S.ovCmap=e.target.value;requestRender();};
$('#ovA').oninput=e=>{S.ovA=+e.target.value/100;requestRender();};
$('#ovLo').onchange=e=>{S.ovLo=+e.target.value;requestRender();};
$('#ovHi').onchange=e=>{S.ovHi=+e.target.value;requestRender();};
$('#ovAuto').onclick=ovAuto;
$('#cmap').onchange=e=>{S.cmap=e.target.value;requestRender();};
$('#gamR').oninput=e=>{S.gamma=+e.target.value;$('#gamO').textContent=S.gamma.toFixed(2).replace('.',',');requestRender();};

/* --- değer okuma --- */
function volAt(vol,c){
  const q=c[2]*vol.nx*vol.ny+c[1]*vol.nx+c[0];
  if(vol.color){const b=3*q,d=vol.data;return Math.round(.299*d[b]+.587*d[b+1]+.114*d[b+2]);}
  return vol.data[q]*vol.slope+vol.icpt;
}
function ovValueAt(c){
  if(!S.ov)return null;const M=S.ov.M,O=S.ov.vol;
  const v=sampleVol(O,M[0][0]*c[0]+M[0][1]*c[1]+M[0][2]*c[2]+M[0][3],M[1][0]*c[0]+M[1][1]*c[1]+M[1][2]*c[2]+M[1][3],M[2][0]*c[0]+M[2][1]*c[1]+M[2][2]*c[2]+M[2][3]);
  return v!==v?null:v*O.slope+O.icpt;
}

/* --- işaretler --- */
function addMarker(c){const s=S.cur;s.markers.push({name:'İşaret '+(s.markers.length+1),c:[...c]});renderMarks();}
function renderMarks(){
  const s=S.cur,vol=s.vol,ul=$('#markList');$('#mkN').textContent=s.markers.length;ul.innerHTML='';
  s.markers.forEach((m,i)=>{
    const li=document.createElement('li'),ov=ovValueAt(m.c);
    li.innerHTML=`<button class="go" aria-label="İşarete git">${i+1}</button><input class="nm" type="text" aria-label="İşaret adı"><button class="del" aria-label="İşareti sil">×</button><span class="co"></span>`;
    li.querySelector('.nm').value=m.name;
    li.querySelector('.co').textContent=`kesit ${m.c[2]+1} · x ${(m.c[0]*vol.sx).toFixed(1)} y ${(m.c[1]*vol.sy).toFixed(1)} z ${(m.c[2]*vol.sz).toFixed(1)} mm · ${fmt(volAt(vol,m.c))}${ov==null?'':' · '+fmt(ov)}`;
    li.querySelector('.go').onclick=()=>{S.c=[...m.c];syncUI();requestRender();};
    li.querySelector('.nm').oninput=e=>{m.name=e.target.value;renderAllMarks();};
    li.querySelector('.del').onclick=()=>{s.markers.splice(i,1);renderMarks();requestRender();};
    ul.appendChild(li);
  });
  renderAllMarks();requestRender();
}
function renderRulers(){
  const s=S.cur,ul=$('#rulerList');$('#rlN').textContent=s.rulers.length;ul.innerHTML='';
  s.rulers.forEach((r,i)=>{
    const li=document.createElement('li'),v=VIEWS.find(x=>x.id===r.id);
    li.innerHTML='<button class="go"></button><button class="del" aria-label="Ölçümü sil">×</button>';
    li.querySelector('.go').textContent=`${i+1}. ${v.name} · kesit ${r.depth+1} · ${rulerText(r.id,s.vol,r)}`;
    li.querySelector('.go').onclick=()=>{S.main=r.id;S.full=false;S.c[v.d]=r.depth;layout();syncUI();requestRender();};
    li.querySelector('.del').onclick=()=>{s.rulers.splice(i,1);renderRulers();requestRender();};
    ul.appendChild(li);
  });
}
$('#mkClear').onclick=()=>{S.cur.markers.length=0;S.cur.rulers.length=0;S.cur.trul=[];renderMarks();renderRulers();};
$('#mkCopy').onclick=async()=>{
  const vol=S.cur.vol,rows=['ad,i,j,k,x_mm,y_mm,z_mm,deger,bindirme_degeri'];
  S.cur.markers.forEach(m=>{const ov=ovValueAt(m.c);rows.push([`"${m.name.replace(/"/g,'""')}"`,...m.c,(m.c[0]*vol.sx).toFixed(2),(m.c[1]*vol.sy).toFixed(2),(m.c[2]*vol.sz).toFixed(2),fmt(volAt(vol,m.c)),ov==null?'':fmt(ov)].join(','));});
  const txt=rows.join('\n'),box=$('#csvBox');
  try{await navigator.clipboard.writeText(txt);box.hidden=true;setStatus('İşaretler panoya kopyalandı.');}
  catch(_){box.hidden=false;box.value=txt;box.select();setStatus('Pano erişimi reddedildi. Metni kutudan elle kopyalayın.',true);}
};

/* --- etiketler --- */
const hex4=n=>n.toString(16).toUpperCase().padStart(4,'0');
function renderTags(){
  if($('#tabTags').hidden||!S.cur)return;
  const tg=S.cur.vol.sliceTags[S.c[2]],q=$('#tagQ').value.toLowerCase(),hide=$('#hidePHI').checked,rows=[];
  [...tg.entries()].sort((a,b)=>a[0]-b[0]).forEach(([t,e])=>{
    const g=t>>>16;let val=e.v==null?'(ikili veri)':e.v.join(' \\ ');
    if(hide&&(g===0x10||t===0x00080080||t===0x00080090))val='••••••';
    const key=`(${hex4(g)},${hex4(t&0xFFFF)})`,nm=NAMES[t]||'';
    if(q&&!(key+nm+val).toLowerCase().includes(q))return;
    rows.push(`<tr><td>${key}</td><td>${esc(nm)}</td><td>${esc(val.slice(0,160))}</td></tr>`);
  });
  $('#tagTbl').innerHTML=rows.slice(0,400).join('')||'<tr><td>Etiket yok</td></tr>';
}
function showTab(t){
  $('#tabMarks').hidden=t!=='m';$('#tabTags').hidden=t!=='t';
  $('#tbMarks').setAttribute('aria-selected',t==='m');$('#tbTags').setAttribute('aria-selected',t==='t');renderTags();
}
$('#tbMarks').onclick=()=>showTab('m');$('#tbTags').onclick=()=>showTab('t');
$('#tagQ').oninput=renderTags;$('#hidePHI').onchange=renderTags;

/* --- fare, dokunma, klavye --- */
const dims3=()=>dimsOf(S.cur.vol);
function step(v,dir){S.c[v.d]=clamp(S.c[v.d]+dir,0,dims3()[v.d]-1);syncUI();requestRender();}
function pick(v,e){
  const g=v.g;if(!g)return null;
  const r=v.cv.getBoundingClientRect(),k=v.cv.width/r.width,x=(e.clientX-r.left)*k,y=(e.clientY-r.top)*k;
  const u=Math.floor((x-g.x0)/g.dw*g.w),w=Math.floor((y-g.y0)/g.dh*g.h);
  if(u<0||w<0||u>=g.w||w>=g.h)return null;
  return {c:fromUV(v.id,u,w,S.c,S.cur.vol),x,y};
}
function pickF(v,e){
  const g=v.g;if(!g)return null;
  const r=v.cv.getBoundingClientRect(),k=v.cv.width/r.width,x=(e.clientX-r.left)*k,y=(e.clientY-r.top)*k;
  return {u:clamp((x-g.x0)/g.dw*g.w,0,g.w),w:clamp((y-g.y0)/g.dh*g.h,0,g.h)};
}
function zoomAt(v,f,x,y){
  const z=clamp(v.zoom*f,.5,24),ff=z/v.zoom,W=v.cv.width,H=v.cv.height;
  v.panx=x-ff*(x-W/2-v.panx)-W/2;v.pany=y-ff*(y-H/2-v.pany)-H/2;v.zoom=z;requestRender();
}
function zoomAll(f){if(S.mode==='grid'){gridZoom(f);return;}VIEWS.forEach(v=>zoomAt(v,f,v.cv.width/2,v.cv.height/2));}
function pointAction(v,e,mark){const p=pick(v,e);if(!p)return;S.c=p.c;if(mark)addMarker(p.c);syncUI();requestRender();}

VIEWS.forEach(v=>{
  const el=v.cv,ptrs=new Map();let drag=null;
  const pdist=()=>{const a=[...ptrs.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);};
  el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{
    if(!S.cur)return;S.active=v.id;el.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===2){v.tmp=null;drag={mode:'pinch',d0:pdist(),z0:v.zoom};return;}
    const tool=e.button===2?'wl':e.button===1?'pan':S.tool;
    drag={mode:tool,x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,ww:S.ww,wl:S.wl,px:v.panx,py:v.pany,sl:S.c[v.d]};
    if(tool==='cross'||tool==='mark')pointAction(v,e,tool==='mark');
    if(tool==='ruler'){const p=pickF(v,e);if(p){v.tmp={id:v.id,depth:S.c[v.d],a:[p.u,p.w],b:[p.u,p.w]};requestRender();}}
    e.preventDefault();
  });
  el.addEventListener('pointermove',e=>{
    if(!S.cur)return;
    if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(drag&&drag.mode==='pinch'){if(ptrs.size===2){const z=clamp(drag.z0*pdist()/drag.d0,.5,24);zoomAt(v,z/v.zoom,v.cv.width/2,v.cv.height/2);}return;}
    if(drag){
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y,k=v.cv.width/v.cv.getBoundingClientRect().width,vol=S.cur.vol;
      if(drag.mode==='cross')pointAction(v,e,false);
      else if(drag.mode==='scroll'){const n=dims3()[v.d],per=clamp(v.cv.getBoundingClientRect().height/n,1.5,14);S.c[v.d]=clamp(drag.sl+Math.round(dy/per),0,n-1);syncUI();requestRender();}
      else if(drag.mode==='ruler'){const p=pickF(v,e);if(p&&v.tmp){v.tmp.b=[p.u,p.w];requestRender();}}
      else if(drag.mode==='wl'){const rg=Math.max(1e-6,vol.hmax-vol.hmin),sens=rg/400;setWL(clamp(drag.ww+dx*sens,rg/2000,rg*2),drag.wl+dy*sens);}
      else if(drag.mode==='zoom'){zoomAt(v,Math.exp(-(e.clientY-drag.y)*.01),v.cv.width/2,v.cv.height/2);drag.y=e.clientY;}
      else if(drag.mode==='pan'){v.panx=drag.px+dx*k;v.pany=drag.py+dy*k;requestRender();}
      else if(drag.mode==='align'){
        if(S.ov&&v.g){const gg=geo[v.id](vol),mm=gg.w*gg.pw/v.g.dw;nudgeView(v.id,(e.clientX-drag.lx)*k*mm,(e.clientY-drag.ly)*k*mm);}
        drag.lx=e.clientX;drag.ly=e.clientY;
      }
      return;
    }
    const p=pick(v,e);
    if(!p){$('#probe').textContent='';return;}
    const ov=ovValueAt(p.c);
    $('#probe').textContent=`${v.name}  ·  x ${p.c[0]}  y ${p.c[1]}  kesit ${p.c[2]+1}  ·  ${S.cur.vol.color?'parlaklık':'değer'} ${fmt(volAt(S.cur.vol,p.c))}${ov==null?'':'  ·  bindirme '+fmt(ov)}`;
  });
  const up=e=>{
    if(drag&&drag.mode==='ruler'&&v.tmp){
      if(rulerLen(v.id,S.cur.vol,v.tmp)>0.3){S.cur.rulers.push(v.tmp);renderRulers();}
      v.tmp=null;requestRender();
    }
    ptrs.delete(e.pointerId);if(!ptrs.size||(drag&&drag.mode==='pinch'))drag=null;};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.addEventListener('wheel',e=>{
    if(!S.cur)return;e.preventDefault();S.active=v.id;
    if(e.ctrlKey||e.metaKey){const r=el.getBoundingClientRect(),k=el.width/r.width;zoomAt(v,e.deltaY<0?1.15:1/1.15,(e.clientX-r.left)*k,(e.clientY-r.top)*k);}
    else step(v,e.deltaY>0?1:-1);
  },{passive:false});
  $('#rg-'+v.id).oninput=e=>{S.c[v.d]=+e.target.value;syncUI();requestRender();};
});
function setTool(t){S.tool=t;document.querySelectorAll('.tool').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tool===t));}
document.querySelectorAll('.tool').forEach(b=>b.onclick=()=>setTool(b.dataset.tool));
const touchUI=matchMedia('(pointer:coarse)').matches;
$('#lite').checked=touchUI;
$('#advBtn').onclick=()=>{const o=$('#adv').classList.toggle('open');$('#advBtn').setAttribute('aria-expanded',o);$('#advBtn').classList.toggle('on',o);try{localStorage.setItem('dicomAdvOpen',o?'1':'0');}catch(_){}};
try{if(localStorage.getItem('dicomAdvOpen')==='1'&&matchMedia('(min-width:721px)').matches){$('#adv').classList.add('open');$('#advBtn').setAttribute('aria-expanded',true);$('#advBtn').classList.add('on');}}catch(_){}
$('#zIn').onclick=()=>zoomAll(1.25);$('#zOut').onclick=()=>zoomAll(.8);
$('#zReset').onclick=()=>{if(S.mode==='grid'){gridZoom(0);return;}VIEWS.forEach(v=>{v.zoom=1;v.panx=0;v.pany=0;});requestRender();};
$('#preset').onchange=e=>applyPreset(e.target.value);
$('#wwR').oninput=e=>setWL(+e.target.value,S.wl);$('#wlR').oninput=e=>setWL(S.ww,+e.target.value);
$('#wwN').onchange=e=>setWL(+e.target.value||1,S.wl);$('#wlN').onchange=e=>setWL(S.ww,+e.target.value||0);
$('#inv').onchange=e=>{S.invert=e.target.checked;requestRender();};
addEventListener('keydown',e=>{
  if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.ctrlKey||e.metaKey||!S.cur)return;
  const k=e.key.toLowerCase(),m={c:'cross',w:'wl',s:'scroll',z:'zoom',p:'pan',r:'ruler',m:'mark',a:'align'};
  if(m[k]){if(k==='a'&&$('#alignBtn').hidden)return;setTool(m[k]);}
  else if(k==='+'||k==='=')zoomAll(1.25);else if(k==='-')zoomAll(.8);else if(k==='0')$('#zReset').click();
  else if(k==='arrowup'||k==='arrowdown'){e.preventDefault();if(S.mode==='grid')stepCell(k==='arrowup'?1:-1);else step(VIEWS.find(v=>v.id===S.active),k==='arrowup'?1:-1);}
});

/* --- dosya yükleme + otomatik PET/BT füzyonu --- */
const READ_HELP='Dosya okunamadı. Sayfa Dosyalar uygulamasının önizlemesinde açıldıysa tarayıcı seçilen dosyaya erişemez. Sayfayı Claude uygulamasındaki bağlantıdan ya da Safari ile açın.';
async function readFileBuf(f){
  try{return await f.arrayBuffer();}catch(_){}
  try{return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsArrayBuffer(f);});}catch(_){}
  try{
    const CH=4<<20,out=new Uint8Array(f.size);
    for(let o=0;o<f.size;o+=CH)out.set(new Uint8Array(await f.slice(o,o+CH).arrayBuffer()),o);
    return out.buffer;
  }catch(_){}
  throw new Error(READ_HELP);
}
async function loadFiles(list){
  const picked=[...list];if(!picked.length)return;
  const files=[];let zipErr='';
  setStatus('Dosyalar hazırlanıyor');
  for(const f of picked){
    if(/\.zip$/i.test(f.name)||f.type==='application/zip'||f.type==='application/x-zip-compressed'){
      try{zipEntries(await readFileBuf(f)).forEach(en=>files.push({name:en.name,read:en.read}));}
      catch(err){zipErr=`${f.name}: ${err.message}`;}
    }else files.push({name:f.name,read:()=>readFileBuf(f)});
  }
  if(!files.length){setStatus(zipErr||'Seçilen dosyalarda okunacak içerik bulunamadı.',true);return;}
  const all=[],why=new Map();let ok=0,bad=0,lite=0;
  setStatus(`0 / ${files.length} dosya okunuyor`);
  for(let i=0;i<files.length;i++){
    try{const m=await parseDicom(await files[i].read());if($('#lite').checked&&downsample2(m))lite++;m.frames.forEach((d,fi)=>all.push({data:d,m,fi}));ok++;}
    catch(err){bad++;why.set(err.message,(why.get(err.message)||0)+1);}
    if(i%8===0||i===files.length-1){setStatus(`${i+1} / ${files.length} dosya okundu`);await new Promise(r=>setTimeout(r));}
  }
  const reason=[...why.entries()].sort((a,b)=>b[1]-a[1])[0];
  if(!all.length){setStatus(`Hiçbir dosya açılamadı.${reason?' '+reason[0]+'.':''}`,true);return;}
  const groups=new Map();
  for(const e of all){const k=`${e.m.suid}|${e.m.info.rows}x${e.m.info.cols}|${e.m.info.color?'c':'g'}`;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(e);}
  const fresh=[...groups.entries()].map(([key,es])=>{const m=es[0].m;
    return {key,name:`${m.mod||'?'} · ${m.desc||'Seri'} · ${es.length} kesit · ${m.info.cols}×${m.info.rows}${m.info.color?' · renkli':''}`,desc:m.desc||'',snum:m.snum||0,n:es.length,entries:es,vol:null,markers:[],mod:m.mod,color:!!m.info.color};})
    .sort((a,b)=>(a.snum&&b.snum?a.snum-b.snum:0)||b.n-a.n);
  /* birikimli yükleme: önceki seriler kalır, örnek fantom ilk gerçek yüklemede kalkar */
  const old=S.series.filter(s=>!s.sample),have=new Set(old.map(s=>s.key)),added=fresh.filter(s=>!have.has(s.key)),dup=fresh.length-added.length;
  if(!added.length){setStatus(`Seçilen seri${dup>1?'ler':''} zaten yüklü. Yeni seri eklenmedi.`,true);return;}
  const first=!old.length;
  if(first){S.offs={};S.ov=null;}
  S.series=[...old,...added];
  const msg=`${ok} dosya okundu${bad?`, ${bad} dosya atlandı${reason?` (${reason[0]})`:''}`:''}. ${added.length} yeni seri eklendi${dup?`, ${dup} seri zaten yüklüydü`:''}. Toplam ${S.series.length} seri.${lite?' Hafif mod: görüntüler yarı çözünürlükte, ölçümler yine mm cinsinden.':''}`;
  try{await initStudies(msg,{add:!first});}
  catch(err){setStatus('Seri açılamadı: '+err.message,true);return;}
}
$('#fileIn').onchange=e=>{const l=[...e.target.files];e.target.value='';loadFiles(l);};
$('#dirIn').onchange=e=>{const l=[...e.target.files];e.target.value='';loadFiles(l);};
$('#seriesSel').onchange=e=>pickSeries(+e.target.value);
addEventListener('dragover',e=>e.preventDefault());
/* klasör sürüklenirse içindeki dosyalar da okunur */
async function walkEntry(en,out){
  if(en.isFile){await new Promise(r=>en.file(f=>{out.push(f);r();},r));}
  else if(en.isDirectory){
    const rd=en.createReader();
    for(;;){const part=await new Promise(r=>rd.readEntries(r,()=>r([])));if(!part.length)break;for(const c of part)await walkEntry(c,out);}
  }
}
addEventListener('drop',async e=>{
  e.preventDefault();
  const items=e.dataTransfer&&e.dataTransfer.items?[...e.dataTransfer.items]:[];
  const ents=items.map(i=>i.webkitGetAsEntry&&i.webkitGetAsEntry()).filter(Boolean);
  if(ents.some(x=>x.isDirectory)){const out=[];for(const x of ents)await walkEntry(x,out);loadFiles(out);return;}
  loadFiles(e.dataTransfer.files);
});

/* --- karşılama penceresi: her açılışta görünür --- */
(function(){
  const W=document.getElementById('welcome');
  const show=()=>{W.hidden=false;document.getElementById('wClose').focus();},hide=()=>{W.hidden=true;};
  document.getElementById('wClose').addEventListener('click',hide);
  document.getElementById('helpBtn').addEventListener('click',show);
  W.addEventListener('click',e=>{if(e.target===W)hide();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!W.hidden)hide();});
  show();
})();
