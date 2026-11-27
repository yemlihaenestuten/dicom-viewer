
/* ---------- Seriler paneli, ızgara görünümleri, elle füzyon ---------- */
const GRIDS=[[1,1],[1,2],[2,1],[2,2],[2,3],[3,3],[4,4],[6,6]];
{
  const sel=$('#layoutSel');sel.add(new Option('3 kesit (MPR)','mpr'));
  GRIDS.forEach(([r,c])=>sel.add(new Option(`${r} × ${c}`,`${r}x${c}`)));
}
const tick=()=>new Promise(r=>setTimeout(r));
const shortName=s=>`${s.mod||'?'}${s.snum?' #'+s.snum:''}${s.desc?' · '+s.desc:''}`;
const autoGrid=n=>n<=2?[1,2]:n<=4?[2,2]:n<=6?[2,3]:n<=9?[3,3]:n<=16?[4,4]:[6,6];
S.stOpen=true;

/* --- küçük resim --- */
function makeThumb(s){
  s.thumb='';
  try{
    const T=72,cv=document.createElement('canvas');cv.width=cv.height=T;
    const x=cv.getContext('2d'),img=x.createImageData(T,T),px=new Uint32Array(img.data.buffer);px.fill(0xFF000000);
    let w,h,val,rgb,mono1=false;const color=!!s.color;
    if(s.vol){
      const v=s.vol,b=(v.nz>>1)*v.nx*v.ny*v.stride;w=v.nx;h=v.ny;mono1=v.mono1;
      val=i=>v.data[b+i]*v.slope+v.icpt;rgb=i=>{const q=b+3*i;return [v.data[q],v.data[q+1],v.data[q+2]];};
    }else if(s.entries&&s.entries.length){
      const L=[...s.entries].sort((a,b)=>(a.m.inst||0)-(b.m.inst||0)),e=L[L.length>>1],d=e.data;
      w=e.m.info.cols;h=e.m.info.rows;mono1=e.m.info.photo==='MONOCHROME1';
      val=i=>d[i]*e.m.slope+e.m.icpt;rgb=i=>[d[3*i],d[3*i+1],d[3*i+2]];
    }else return;
    const pet=isPET(s.mod);let lo=0,hi=1;
    if(!color){
      if(s.mod==='CT'){lo=-160;hi=240;}
      else{
        const arr=[],st=Math.max(1,Math.floor(w*h/3000));
        for(let i=0;i<w*h;i+=st)arr.push(val(i));arr.sort((a,b)=>a-b);
        lo=pet?0:arr[Math.floor(arr.length*.01)];hi=arr[Math.min(arr.length-1,Math.floor(arr.length*(pet?.997:.995)))];
        if(!(hi>lo))hi=lo+1;
      }
    }
    const inv=pet!==mono1,sc=Math.min(T/w,T/h),dw=Math.max(1,Math.round(w*sc)),dh=Math.max(1,Math.round(h*sc)),ox=(T-dw)>>1,oy=(T-dh)>>1;
    for(let y=0;y<dh;y++)for(let xx=0;xx<dw;xx++){
      const i=Math.min(h-1,Math.floor(y/sc))*w+Math.min(w-1,Math.floor(xx/sc));let r,g,b;
      if(color){const c=rgb(i);r=Math.min(255,c[0]);g=Math.min(255,c[1]);b=Math.min(255,c[2]);}
      else{let t=(val(i)-lo)/(hi-lo);t=t<0?0:t>1?1:t;if(inv)t=1-t;r=g=b=(t*255)|0;}
      px[(oy+y)*T+ox+xx]=0xFF000000|(b<<16)|(g<<8)|r;
    }
    x.putImageData(img,0,0);s.thumb=cv.toDataURL('image/png');
  }catch(_){s.thumb='';}
}

/* --- seriler paneli --- */
function renderStudies(){
  const L=$('#stList');L.innerHTML='';
  S.series.forEach((s,i)=>{
    if(s.thumb===undefined)makeThumb(s);
    const b=document.createElement('button');b.type='button';b.className='scard';b.title=s.name;
    b.innerHTML='<img alt=""><span class="stx"><b></b><i></i></span><span class="sx" role="button" aria-label="Seriyi kapat" title="Seriyi kapatır. Üzerindeki işaretler alttaki listede kalır ve işarete basınca seri yeniden açılır">×</span>';
    b.querySelector('.sx').onclick=e=>{e.stopPropagation();e.preventDefault();closeSeries(i);};
    const im=b.querySelector('img');im.draggable=false;if(s.thumb)im.src=s.thumb;else im.style.visibility='hidden';
    b.querySelector('b').textContent=s.desc||'(açıklama yok)';
    b.querySelector('i').textContent=`${s.mod||'?'}${s.snum?' #'+s.snum:''} · ${s.n} görüntü${s.color?' · renkli':''}`;
    b.onclick=()=>{if(!suppressClick)pickSeries(i);};
    watchDrag(b,()=>({type:'series',si:i}));
    L.appendChild(b);
  });
  $('#stN').textContent=S.series.length+' seri';
  $('#stBtn').hidden=S.series.length<2;
  $('#clearBtn').hidden=S.series.every(s=>s.sample)&&!S.closed.length;
  updateStPanel();markStudies();renderAllMarks();
}
function updateStPanel(){
  $('#shell').classList.toggle('nost',S.series.length<2||!S.stOpen);
  $('#stBtn').setAttribute('aria-pressed',S.stOpen);
}
$('#stBtn').onclick=()=>{S.stOpen=!S.stOpen;updateStPanel();};
function markStudies(){
  const ovs=S.ov?S.series.indexOf(S.ov.series):-1,used=new Set();
  let cur;
  if(S.mode==='grid'){S.grid.cells.forEach(c=>{if(c.si>=0)used.add(c.si);});const c=S.grid.cells[S.grid.sel];cur=c?c.si:-1;}
  else{cur=S.series.indexOf(S.cur);used.add(cur);}
  [...$('#stList').children].forEach((b,i)=>{
    b.classList.toggle('in',used.has(i));b.classList.toggle('cur',i===cur);b.classList.toggle('ov',i===ovs&&S.mode==='mpr');
  });
}
function syncSeriesSel(){
  const c=S.mode==='grid'?S.grid.cells[S.grid.sel]:null,i=c?c.si:S.series.indexOf(S.cur);
  $('#seriesSel').value=i>=0?String(i):'';
}
function pickSeries(i){
  const s=S.series[i];if(!s)return;
  try{
    if(S.mode==='grid'){
      const c=S.grid.cells[S.grid.sel];assignCell(c,i,S.grid.cells);selectCell(S.grid.sel);requestRender();
    }else{setSeries(s);setStatus(s.name);}
  }catch(err){setStatus('Seri açılamadı: '+err.message,true);}
  syncSeriesSel();markStudies();
}

/* --- konum eşleme --- */
const parallel=(a,b)=>{
  if(!a.geom.hasPos||!b.geom.hasPos)return true;
  const p=a.geom.n,q=b.geom.n;return Math.abs(p[0]*q[0]+p[1]*q[1]+p[2]*q[2])>.9;
};
function kFrom(src,k,dst){
  if(src.geom.hasPos&&dst.geom.hasPos){
    const g=src.geom,P=[g.O[0]+g.n[0]*src.sz*k,g.O[1]+g.n[1]*src.sz*k,g.O[2]+g.n[2]*src.sz*k],h=dst.geom;
    const d=(P[0]-h.O[0])*h.n[0]+(P[1]-h.O[1])*h.n[1]+(P[2]-h.O[2])*h.n[2];
    return clamp(Math.round(d/dst.sz),0,dst.nz-1);
  }
  return clamp(Math.round(k/Math.max(1,src.nz-1)*(dst.nz-1)),0,dst.nz-1);
}

/* --- ızgara hücreleri --- */
function assignCell(c,si,pool){
  c.si=si;c.lutKey='';
  if(si<0||!S.series[si]){c.si=-1;c.vol=null;c.series=null;return;}
  const s=S.series[si];let vol;
  try{vol=ensureVol(s);}catch(err){c.si=-1;c.vol=null;c.series=null;throw err;}
  s.rulers=s.rulers||[];s.trul=s.trul||[];
  Object.assign(c,{series:s,vol,k:vol.nz>>1,zoom:1,panx:0,pany:0,invert:false,gamma:1,cmap:isPET(vol.mod)?'igray':'gray',preset:defaultPreset(vol)});
  [c.ww,c.wl]=presetWL(vol,c.preset);
  if(pool&&S.grid.sync){const ref=pool.find(o=>o!==c&&o.vol&&parallel(o.vol,vol));if(ref)c.k=kFrom(ref.vol,ref.k,vol);}
}
const tileRO=new ResizeObserver(es=>{
  for(const e of es){
    const c=e.target._cell;if(!c||!c.el)continue;
    const r=e.target.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);
    c.el.dpr=d;c.el.cv.width=Math.max(1,Math.round(r.width*d));c.el.cv.height=Math.max(1,Math.round(r.height*d));c.el.key='';
  }
  requestRender();
});
function buildGridDOM(){
  const G=S.grid,el=$('#grid');tileRO.disconnect();el.innerHTML='';
  el.style.gridTemplateColumns=`repeat(${G.c},minmax(0,1fr))`;el.style.gridTemplateRows=`repeat(${G.r},minmax(0,1fr))`;
  G.cells.forEach((c,i)=>{
    el.insertAdjacentHTML('beforeend',`<section class="tile" data-i="${i}"><div class="th" title="Tutup başka kutuya sürükleyin: yer değiştirir"><button class="tpick" type="button" title="Seri seç" aria-label="Seri seç">${LIST}</button><span class="tnm"></span><span class="tsl"></span></div><div class="tcv"><canvas aria-label="Kesit ${i+1}"></canvas><button class="mx" type="button" title="3 kesitte aç" aria-label="3 kesitte aç">${EXPAND}</button></div></section>`);
    const t=el.lastElementChild,box=t.querySelector('.tcv');
    c.el={t,cv:t.querySelector('canvas'),sl:t.querySelector('.tsl'),nm:t.querySelector('.tnm'),key:'',dpr:1,off:document.createElement('canvas'),img:null};
    c.el.ctx=c.el.cv.getContext('2d');c.el.octx=c.el.off.getContext('2d');box._cell=c;
    t.addEventListener('pointerdown',()=>{if(G.sel!==i)selectCell(i);});
    t.querySelector('.tpick').onclick=()=>{selectCell(i);openPicker(i);};
    watchDrag(t.querySelector('.th'),()=>c.vol?{type:'tile',i}:null);
    t.querySelector('.mx').onclick=()=>openInMPR(i);
    tileRO.observe(box);bindTile(c,i);
  });
}
function adoptCell(c){
  const vol=c.vol;S.cur=c.series;S.c=[vol.nx>>1,vol.ny>>1,c.k];
  S.ww=c.ww;S.wl=c.wl;S.gamma=c.gamma;S.cmap=c.cmap;S.invert=c.invert;
  configWLRange(vol);
  $('#preset').value=c.preset;$('#wwR').value=S.ww;$('#wlR').value=S.wl;$('#wwN').value=fmt(S.ww);$('#wlN').value=fmt(S.wl);
  $('#cmap').value=S.cmap;$('#cmap').disabled=vol.color;$('#gamR').value=S.gamma;$('#gamR').disabled=vol.color;
  $('#gamO').textContent=S.gamma.toFixed(2).replace('.',',');$('#inv').checked=S.invert;
  refreshOvSelect();renderTags();
}
function selectCell(i){
  const G=S.grid;G.sel=i;
  G.cells.forEach((c,j)=>c.el&&c.el.t.classList.toggle('sel',j===i));
  const c=G.cells[i];if(c&&c.vol)adoptCell(c);
  syncSeriesSel();markStudies();requestRender();
}
function stepCell(d){const c=S.grid.cells[S.grid.sel];if(c&&c.vol)setCellK(c,c.k+d);}
function setCellK(c,k){
  c.k=clamp(k,0,c.vol.nz-1);
  if(S.grid.sync)S.grid.cells.forEach(o=>{if(o!==c&&o.vol&&parallel(c.vol,o.vol))o.k=kFrom(c.vol,c.k,o.vol);});
  if(c===S.grid.cells[S.grid.sel]){S.c[2]=c.k;renderTags();}
  requestRender();
}
function zoomCellAt(c,f,x,y){
  const z=clamp(c.zoom*f,.5,24),ff=z/c.zoom,W=c.el.cv.width,H=c.el.cv.height;
  c.panx=x-ff*(x-W/2-c.panx)-W/2;c.pany=y-ff*(y-H/2-c.pany)-H/2;c.zoom=z;requestRender();
}
function gridZoom(f){
  S.grid.cells.forEach(c=>{
    if(!c.vol)return;
    if(!f){c.zoom=1;c.panx=0;c.pany=0;}else zoomCellAt(c,f,c.el.cv.width/2,c.el.cv.height/2);
  });requestRender();
}
$('#syncChk').onchange=e=>{
  S.grid.sync=e.target.checked;
  if(S.grid.sync){const c=S.grid.cells[S.grid.sel];if(c&&c.vol)setCellK(c,c.k);}
};

/* --- hücre çizimi --- */
function cellLUT(c){
  const vol=c.vol,key=`${c.ww}|${c.wl}|${c.invert}|${c.gamma}|${c.cmap}|${vol.id}`;if(c.lutKey===key)return;
  const n=vol.max-vol.min+1;
  if(!c.lutG||c.lutG.length!==n){c.lutG=new Uint8Array(n);c.lut=new Uint32Array(n);}
  const lo=c.wl-c.ww/2,inv=c.invert!==vol.mono1,gi=1/c.gamma,cm=CMAPS[c.cmap];
  for(let i=0;i<n;i++){
    let t=((i+vol.min)*vol.slope+vol.icpt-lo)/c.ww;t=t<0?0:t>1?1:t;
    if(c.gamma!==1)t=Math.pow(t,gi);
    let g=Math.round(t*255);if(inv)g=255-g;
    c.lutG[i]=g;c.lut[i]=cm[g];
  }
  c.lutKey=key;
}
/* --- lokalizer: seçili kutunun kesit düzleminin diğer kutudaki kesişim çizgisi --- */
S.refLines=true;
const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
function refSeg(src,dst){
  const A=src.vol,B=dst.vol;
  if(!A.geom.hasPos||!B.geom.hasPos)return null;
  if(A.forUid&&B.forUid&&A.forUid!==B.forUid)return null;
  const ga=A.geom,gb=B.geom,ns=ga.n;
  if(Math.abs(dot3(ns,gb.n))>.98)return null; /* paralel kesitler: çizgi yok */
  const ps=[ga.O[0]+ns[0]*A.sz*src.k,ga.O[1]+ns[1]*A.sz*src.k,ga.O[2]+ns[2]*A.sz*src.k];
  const pb=[gb.O[0]+gb.n[0]*B.sz*dst.k-ps[0],gb.O[1]+gb.n[1]*B.sz*dst.k-ps[1],gb.O[2]+gb.n[2]*B.sz*dst.k-ps[2]];
  const a=B.sx*dot3(ns,gb.r),b=B.sy*dot3(ns,gb.c),d=dot3(ns,pb); /* a*i + b*j + d = 0 */
  const x0=-.5,x1=B.nx-.5,y0=-.5,y1=B.ny-.5,pts=[],e=1e-6;
  if(Math.abs(b)>1e-9)[x0,x1].forEach(i=>{const j=-(a*i+d)/b;if(j>=y0-e&&j<=y1+e)pts.push([i,j]);});
  if(Math.abs(a)>1e-9)[y0,y1].forEach(j=>{const i=-(b*j+d)/a;if(i>=x0-e&&i<=x1+e)pts.push([i,j]);});
  if(pts.length<2)return null;
  let best=null,bd=-1;
  for(let p=0;p<pts.length;p++)for(let q=p+1;q<pts.length;q++){const dd=Math.hypot(pts[p][0]-pts[q][0],pts[p][1]-pts[q][1]);if(dd>bd){bd=dd;best=[pts[p],pts[q]];}}
  return bd>1e-6?best:null;
}
function drawRefLine(c,src,ctx,g,dpr){
  const seg=refSeg(src,c);if(!seg)return;
  const px=p=>g.x0+(p[0]+.5)/g.w*g.dw,py=p=>g.y0+(p[1]+.5)/g.h*g.dh;
  ctx.save();ctx.globalAlpha=.95;ctx.strokeStyle='#ffd54a';ctx.fillStyle='#ffd54a';ctx.lineWidth=1.5*dpr;ctx.setLineDash([7*dpr,4*dpr]);
  line(ctx,px(seg[0]),py(seg[0]),px(seg[1]),py(seg[1]));ctx.setLineDash([]);
  if(c.el.cv.width/dpr>170){
    const tx=px(seg[0]),ty=py(seg[0]);ctx.font=`${11*dpr}px "IBM Plex Mono",monospace`;
    const txt=`${src.vol.mod||''} ${src.k+1}`,tw=ctx.measureText(txt).width,bx=clamp(tx,tw/2+6*dpr,c.el.cv.width-tw/2-6*dpr),by=clamp(ty,16*dpr,c.el.cv.height-8*dpr);
    ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(bx-tw/2-3*dpr,by-12*dpr,tw+6*dpr,15*dpr);ctx.fillStyle='#ffd54a';ctx.textAlign='center';ctx.fillText(txt,bx,by);ctx.textAlign='left';
  }
  ctx.restore();
}
$('#refChk').onchange=e=>{S.refLines=e.target.checked;requestRender();};
function renderGrid(){
  const G=S.grid,sc=G.cells[G.sel];
  if(sc&&sc.vol){sc.ww=S.ww;sc.wl=S.wl;sc.gamma=S.gamma;sc.cmap=S.cmap;sc.invert=S.invert;sc.preset=$('#preset').value;}
  G.cells.forEach(renderTile);
}
function renderTile(c){
  const el=c.el;if(!el)return;
  const cv=el.cv,ctx=el.ctx,W=cv.width,H=cv.height,dpr=el.dpr;
  ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);ctx.textAlign='left';
  if(!c.vol){
    el.sl.textContent='';el.nm.textContent='(boş)';ctx.fillStyle='#4b5662';ctx.font=`${13*dpr}px sans-serif`;ctx.textAlign='center';
    {const m=TX('Boş. Dokunup seri seçin');let fs=13*dpr;while(fs>8*dpr){ctx.font=`${fs}px sans-serif`;if(ctx.measureText(m).width<=W-10*dpr)break;fs-=dpr;}ctx.fillText(m,W/2,H/2);}ctx.textAlign='left';return;
  }
  const vol=c.vol,nx=vol.nx,ny=vol.ny,nxy=nx*ny;
  cellLUT(c);
  const key=`${vol.id}|${c.k}|${c.lutKey}`;
  if(key!==el.key){
    if(el.off.width!==nx||el.off.height!==ny){el.off.width=nx;el.off.height=ny;el.img=el.octx.createImageData(nx,ny);}
    const px=new Uint32Array(el.img.data.buffer),d=vol.data,lut=c.lut,lg=c.lutG,mn=vol.min,b=c.k*nxy;
    if(vol.color){for(let n=0;n<nxy;n++){const q=3*(b+n);px[n]=0xFF000000|(lg[d[q+2]-mn]<<16)|(lg[d[q+1]-mn]<<8)|lg[d[q]-mn];}}
    else for(let n=0;n<nxy;n++)px[n]=lut[d[b+n]-mn];
    el.octx.putImageData(el.img,0,0);el.key=key;
  }
  const pw=vol.sx,ph=vol.sy,fit=Math.min(W/(nx*pw),H/(ny*ph)),s=fit*c.zoom,dw=nx*pw*s,dh=ny*ph*s,x0=(W-dw)/2+c.panx,y0=(H-dh)/2+c.pany;
  ctx.imageSmoothingEnabled=dw/nx<3;ctx.drawImage(el.off,x0,y0,dw,dh);
  c.g={x0,y0,dw,dh,w:nx,h:ny};
  ctx.font=`${11*dpr}px "IBM Plex Mono",monospace`;
  if(S.refLines){const src=S.grid.cells[S.grid.sel];if(src&&src!==c&&src.vol)drawRefLine(c,src,ctx,c.g,dpr);}
  const rl=(c.series.trul||[]).filter(r=>r.k===c.k);if(c.tmp)rl.push(c.tmp);
  rl.forEach(r=>{
    const ax=x0+r.a[0]/nx*dw,ay=y0+r.a[1]/ny*dh,bx=x0+r.b[0]/nx*dw,by=y0+r.b[1]/ny*dh;
    ctx.strokeStyle=ctx.fillStyle='#ffe066';ctx.lineWidth=1.6*dpr;line(ctx,ax,ay,bx,by);
    [[ax,ay],[bx,by]].forEach(([px,py])=>{ctx.beginPath();ctx.arc(px,py,3.5*dpr,0,6.2832);ctx.fill();});
    const d=Math.hypot((r.b[0]-r.a[0])*vol.sx,(r.b[1]-r.a[1])*vol.sy),txt=vol.psKnown?`${d.toFixed(1)} mm`:`${d.toFixed(1)} px`;
    const tw=ctx.measureText(txt).width,mx=(ax+bx)/2,my=(ay+by)/2-10*dpr;
    ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(mx-tw/2-4*dpr,my-11*dpr,tw+8*dpr,16*dpr);
    ctx.fillStyle='#ffe066';ctx.textAlign='center';ctx.fillText(txt,mx,my+1*dpr);ctx.textAlign='left';
  });
  ctx.globalAlpha=.85;ctx.fillStyle='#c9d3dc';
  if(W/dpr>170)ctx.fillText(`W ${Math.round(c.ww)}  L ${Math.round(c.wl)}`,6*dpr,H-6*dpr);
  if(c.zoom!==1&&W/dpr>170){ctx.textAlign='right';ctx.fillText(`×${c.zoom.toFixed(2)}`,W-6*dpr,H-6*dpr);ctx.textAlign='left';}
  ctx.globalAlpha=1;
  drawAngles(ctx,W,H,dpr);
  el.sl.textContent=`${c.k+1}/${vol.nz}`;
  const nm=shortName(c.series);if(el.nm.textContent!==nm)el.nm.textContent=nm;
}

/* --- hücre etkileşimi --- */
function pickT(c,e){
  const g=c.g;if(!g)return null;
  const r=c.el.cv.getBoundingClientRect(),k=c.el.cv.width/r.width,x=(e.clientX-r.left)*k,y=(e.clientY-r.top)*k;
  return {u:clamp((x-g.x0)/g.dw*g.w,0,g.w),w:clamp((y-g.y0)/g.dh*g.h,0,g.h),x,y,inside:x>=g.x0&&y>=g.y0&&x<g.x0+g.dw&&y<g.y0+g.dh};
}
function bindTile(c,i){
  const cv=c.el.cv,ptrs=new Map();let drag=null;
  const pd=()=>{const a=[...ptrs.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);};
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('dblclick',()=>openInMPR(i));
  cv.addEventListener('pointerdown',e=>{
    if(S.grid.sel!==i)selectCell(i);
    if(!c.vol){openPicker(i);e.preventDefault();return;}
    cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===2){c.tmp=null;drag={mode:'pinch',d0:pd(),z0:c.zoom};return;}
    let tool=e.button===2?'wl':e.button===1?'pan':S.tool;
    if(tool==='mark')setStatus('İşaretleme için bir kutuya çift tıklayın. Seri 3 kesit görünümünde açılır.');
    if(tool==='cross'||tool==='mark'||tool==='align')tool='scroll';
    drag={mode:tool,x:e.clientX,y:e.clientY,ww:S.ww,wl:S.wl,px:c.panx,py:c.pany,k:c.k};
    if(tool==='ruler'){const p=pickT(c,e);if(p){c.tmp={k:c.k,a:[p.u,p.w],b:[p.u,p.w]};requestRender();}}
    e.preventDefault();
  });
  cv.addEventListener('pointermove',e=>{
    if(!c.vol)return;
    if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(drag&&drag.mode==='pinch'){if(ptrs.size===2){const z=clamp(drag.z0*pd()/drag.d0,.5,24);zoomCellAt(c,z/c.zoom,cv.width/2,cv.height/2);}return;}
    if(drag){
      const r=cv.getBoundingClientRect(),k=cv.width/r.width,dx=e.clientX-drag.x,dy=e.clientY-drag.y,vol=c.vol;
      if(drag.mode==='scroll'){const per=clamp(r.height/vol.nz,1.5,14);setCellK(c,drag.k+Math.round(dy/per));}
      else if(drag.mode==='wl'){const rg=Math.max(1e-6,vol.hmax-vol.hmin),sens=rg/400;setWL(clamp(drag.ww+dx*sens,rg/2000,rg*2),drag.wl+dy*sens);}
      else if(drag.mode==='zoom'){zoomCellAt(c,Math.exp(-(e.clientY-drag.y)*.01),cv.width/2,cv.height/2);drag.y=e.clientY;}
      else if(drag.mode==='pan'){c.panx=drag.px+dx*k;c.pany=drag.py+dy*k;requestRender();}
      else if(drag.mode==='ruler'){const p=pickT(c,e);if(p&&c.tmp){c.tmp.b=[p.u,p.w];requestRender();}}
      return;
    }
    const p=pickT(c,e);
    if(!p||!p.inside){$('#probe').textContent='';return;}
    const vol=c.vol,ix=Math.min(vol.nx-1,Math.floor(p.u)),iy=Math.min(vol.ny-1,Math.floor(p.w));
    $('#probe').textContent=`${shortName(c.series)}  ·  x ${ix}  y ${iy}  kesit ${c.k+1}  ·  ${vol.color?'parlaklık':'değer'} ${fmt(volAt(vol,[ix,iy,c.k]))}`;
  });
  const up=e=>{
    if(drag&&drag.mode==='ruler'&&c.tmp){
      const t=c.tmp,d=Math.hypot((t.b[0]-t.a[0])*c.vol.sx,(t.b[1]-t.a[1])*c.vol.sy);
      if(d>.3)c.series.trul.push(t);c.tmp=null;requestRender();
    }
    ptrs.delete(e.pointerId);if(!ptrs.size||(drag&&drag.mode==='pinch'))drag=null;
  };
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('wheel',e=>{
    e.preventDefault();if(S.grid.sel!==i)selectCell(i);if(!c.vol)return;
    if(e.ctrlKey||e.metaKey){const r=cv.getBoundingClientRect(),k=cv.width/r.width;zoomCellAt(c,e.deltaY<0?1.15:1/1.15,(e.clientX-r.left)*k,(e.clientY-r.top)*k);}
    else setCellK(c,c.k+(e.deltaY>0?1:-1));
  },{passive:false});
}
function openInMPR(i){
  const c=S.grid.cells[i];if(!c||!c.vol)return;
  S.lastGrid=[S.grid.r,S.grid.c];goMPR(c.series);
}


/* --- sürükle bırak (fare ve dokunma) ve seri seçici --- */
const LIST='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2.5" width="12" height="3.2" rx="1"/><rect x="2" y="7.2" width="12" height="3.2" rx="1"/><path d="M2 13h12"/></svg>';
let dragState=null,suppressClick=false,ghost=null;
const KEYS=['si','series','vol','k','zoom','panx','pany','ww','wl','gamma','cmap','invert','preset','lutKey','lut','lutG'];
function swapCells(a,b){
  const A=S.grid.cells[a],B=S.grid.cells[b];
  KEYS.forEach(k=>{const t=A[k];A[k]=B[k];B[k]=t;});A.el.key='';B.el.key='';
}
function showGhost(pl){
  const s=pl.type==='series'?S.series[pl.si]:S.grid.cells[pl.i].series;if(!s)return;
  ghost=document.createElement('div');ghost.className='ghost';
  ghost.innerHTML='<img alt="" draggable="false"><span></span>';
  if(s.thumb)ghost.querySelector('img').src=s.thumb;else ghost.querySelector('img').style.display='none';
  ghost.querySelector('span').textContent=shortName(s);document.body.appendChild(ghost);
}
const moveGhost=(x,y)=>{if(ghost){ghost.style.left=x+'px';ghost.style.top=y+'px';}};
function dropTargetAt(x,y){
  const el=document.elementFromPoint(x,y);if(!el)return null;
  const t=el.closest('.tile');if(t&&!$('#grid').hidden)return {type:'tile',i:+t.dataset.i,el:t};
  const v=el.closest('#views');if(v&&!$('#views').hidden)return {type:'views',el:v};
  return null;
}
const clearDrop=()=>document.querySelectorAll('.drop').forEach(e=>e.classList.remove('drop'));
function doDrop(pl,t){
  try{
    if(t.type==='views'){if(pl.type==='series'){setSeries(S.series[pl.si]);setStatus(S.cur.name);}return;}
    const G=S.grid,c=G.cells[t.i];
    if(pl.type==='series'){
      try{assignCell(c,pl.si,G.cells);}catch(err){setStatus('Seri açılamadı: '+err.message,true);}
      selectCell(t.i);
    }else if(pl.type==='tile'&&pl.i!==t.i){swapCells(pl.i,t.i);selectCell(t.i);}
    markStudies();requestRender();
  }catch(err){setStatus('Bırakılamadı: '+err.message,true);}
}
function watchDrag(el,payloadFn){
  el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{
    if(e.button!==0||dragState||(e.target.closest&&e.target.closest('.sx')))return;
    const st={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,id:e.pointerId,touch:e.pointerType!=='mouse',active:false,timer:0,pl:null};
    const begin=()=>{
      const pl=payloadFn();if(!pl){cleanup();return;}
      st.active=true;st.pl=pl;dragState=st;showGhost(pl);moveGhost(st.lx,st.ly);document.body.classList.add('dragging');hilite();
      if(navigator.vibrate)try{navigator.vibrate(15);}catch(_){}
    };
    const hilite=()=>{clearDrop();const t=dropTargetAt(st.lx,st.ly);if(t)t.el.classList.add('drop');};
    const move=ev=>{
      if(ev.pointerId!==st.id)return;
      st.lx=ev.clientX;st.ly=ev.clientY;
      if(!st.active){
        const d=Math.hypot(st.lx-st.x,st.ly-st.y);
        if(st.touch){if(d>10)cleanup();}else if(d>6)begin();
        return;
      }
      moveGhost(st.lx,st.ly);hilite();
    };
    const end=ev=>{
      if(ev.pointerId!==st.id)return;
      const was=st.active;
      if(was&&ev.type==='pointerup'){const t=dropTargetAt(st.lx,st.ly);if(t)doDrop(st.pl,t);}
      cleanup();
      if(was){suppressClick=true;setTimeout(()=>{suppressClick=false;},50);}
    };
    function cleanup(){
      clearTimeout(st.timer);removeEventListener('pointermove',move);removeEventListener('pointerup',end);removeEventListener('pointercancel',end);
      if(ghost){ghost.remove();ghost=null;}
      if(dragState===st)dragState=null;document.body.classList.remove('dragging');clearDrop();
    }
    if(st.touch)st.timer=setTimeout(begin,320);
    addEventListener('pointermove',move);addEventListener('pointerup',end);addEventListener('pointercancel',end);
  });
}
document.addEventListener('touchmove',e=>{if(dragState)e.preventDefault();},{passive:false});

let pickerFor=-1;
function openPicker(i){
  pickerFor=i;const L=$('#pkList');L.innerHTML='';
  const add=(si,title,sub,thumb)=>{
    const b=document.createElement('button');b.type='button';b.className='scard';
    b.innerHTML='<img alt="" draggable="false"><span class="stx"><b></b><i></i></span>';
    const im=b.querySelector('img');if(thumb)im.src=thumb;else im.style.visibility='hidden';
    b.querySelector('b').textContent=title;b.querySelector('i').textContent=sub;
    const c=S.grid.cells[i];if(c&&c.si===si)b.classList.add('cur');
    b.onclick=()=>{
      closePicker();const c=S.grid.cells[i];if(!c)return;
      try{assignCell(c,si,S.grid.cells);}catch(err){setStatus('Seri açılamadı: '+err.message,true);}
      selectCell(i);markStudies();requestRender();
    };
    L.appendChild(b);
  };
  add(-1,'(boş)','Kutuyu boşalt','');
  S.series.forEach((s,si)=>add(si,s.desc||'(açıklama yok)',`${s.mod||'?'}${s.snum?' #'+s.snum:''} · ${s.n} görüntü${s.color?' · renkli':''}`,s.thumb));
  $('#picker').hidden=false;
}
function closePicker(){$('#picker').hidden=true;}
$('#pkClose').onclick=closePicker;
$('#picker').addEventListener('click',e=>{if(e.target===$('#picker'))closePicker();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#picker').hidden)closePicker();});

/* --- görünüm geçişleri --- */
async function goGrid(r,c){
  const G=S.grid,old=G.cells.slice();
  S.mode='grid';
  if(S.ov){S.ov=null;}
  const cells=[];
  for(let i=0;i<r*c;i++)cells.push(old[i]?Object.assign({},old[i],{el:null,g:null,tmp:null}):{si:undefined});
  const used=new Set(cells.filter(x=>x.si>=0).map(x=>x.si));
  if(!used.size&&S.cur){const k=S.series.indexOf(S.cur);if(k>=0){cells[0].si=k;used.add(k);}}
  let next=0;
  cells.forEach(x=>{if(x.si===undefined){while(used.has(next))next++;x.si=next<S.series.length?next++:-1;if(x.si>=0)used.add(x.si);}});
  const errs=[];
  for(const x of cells){
    if(x.si>=0&&!x.vol){
      setStatus(`Hacim hazırlanıyor: ${shortName(S.series[x.si])}`);await tick();
      try{assignCell(x,x.si,cells);}catch(err){errs.push(`${shortName(S.series[x.si])}: ${err.message}`);assignCell(x,-1);}
    }
  }
  G.r=r;G.c=c;G.cells=cells;G.sel=clamp(G.sel,0,cells.length-1);
  if(!cells[G.sel].vol){const f=cells.findIndex(x=>x.vol);if(f>=0)G.sel=f;}
  $('#views').hidden=true;$('#grid').hidden=false;$('#layoutSel').value=`${r}x${c}`;
  refreshOvSelect();updateOvUI();buildGridDOM();selectCell(G.sel);
  setStatus(errs.length?'Bazı seriler açılamadı. '+errs.join(' | '):`${r} × ${c} düzen. Bir kutuya dokunarak seçin. Çift dokunma o seriyi 3 kesitte açar.`,!!errs.length);
}
function goMPR(series){
  const s=series||(S.grid.cells[S.grid.sel]||{}).series||S.cur||S.series[0];
  S.mode='mpr';$('#views').hidden=false;$('#grid').hidden=true;$('#layoutSel').value='mpr';
  setSeries(s);updateFusUI();markStudies();
}
$('#homeBtn').onclick=async()=>{
  try{
    const n=S.series.length;if(!n)return;
    if(n<=1){goMPR(S.series[0]);setStatus('İlk görünüme dönüldü: 3 kesit, ortalanmış, varsayılan kontrast.');return;}
    S.grid.cells=[];S.lastGrid=null;S.grid.sel=0;S.ov=null;
    const [r,c]=autoGrid(n);await goGrid(r,c);updateFusUI();
    setStatus('İlk görünüme dönüldü: tüm seriler ayrı kutularda, ortalanmış, varsayılan kontrast.');
  }catch(err){setStatus('Görünüm değiştirilemedi: '+err.message,true);}
};
$('#layoutSel').onchange=async e=>{
  const v=e.target.value;
  try{
    if(v==='mpr'){if(S.mode!=='mpr')goMPR();}
    else{const [r,c]=v.split('x').map(Number);await goGrid(r,c);}
  }catch(err){setStatus('Görünüm değiştirilemedi: '+err.message,true);}
};

/* --- füzyon --- */
function pickFusionPair(){
  const anat=s=>isAnat(s.mod)&&!s.color,pet=s=>isPET(s.mod)&&!s.color;
  const selS=S.mode==='grid'?(S.grid.cells[S.grid.sel]||{}).series:S.cur;
  const shown=S.mode==='grid'?S.grid.cells.filter(c=>c.series).map(c=>c.series):[];
  const pool=[selS,...shown,...S.series];
  const base=pool.find(s=>s&&anat(s)),ov=pool.find(s=>s&&pet(s)&&s!==base);
  return base&&ov?{base,ov}:null;
}
function toggleFusion(){
  if(S.mode==='mpr'&&S.ov){unfuse();return;}
  const p=pickFusionPair();
  if(!p){setStatus('Füzyon için bir BT ya da MR serisi ile bir PET serisi gerekli.',true);return;}
  if(S.mode==='grid')S.lastGrid=[S.grid.r,S.grid.c];
  try{
    goMPR(p.base);setOverlay(p.ov);
    setStatus(`Füzyon: ${shortName(p.base)} + ${shortName(p.ov)}. Hizala aracını ya da Ayarlar bölümündeki Kaydırma alanlarını kullanın. Başka PET için Kaplama listesini kullanın.`);
  }catch(err){setStatus('Füzyon kurulamadı: '+err.message,true);}
}
function unfuse(){
  setOverlay(null);
  if(S.lastGrid)goGrid(S.lastGrid[0],S.lastGrid[1]).catch(err=>setStatus('Görünüm değiştirilemedi: '+err.message,true));
  else updateFusUI();
}
$('#fusBtn').onclick=toggleFusion;

function updateFusUI(){
  const fused=S.mode==='mpr'&&!!S.ov,b=$('#fusBtn');
  b.setAttribute('aria-pressed',fused);b.textContent=fused?'Ayır':'Füzyon';
  $('#alignBtn').hidden=!fused;
  $('#offGrp').hidden=!fused;
  if(!fused&&S.tool==='align')setTool('cross');
  const can=fused&&S.cur&&S.cur.vol&&S.cur.vol.geom.hasPos&&S.ov.vol.geom.hasPos;
  ['offX','offY','offZ','offStep','nL','nR','nU','nD','nZu','nZd','offReset'].forEach(id=>$('#'+id).disabled=!can);
  ['offX','offY','offZ'].forEach((id,i)=>{$('#'+id).value=can?+S.ovOff[i].toFixed(2):'';});
}
function applyOff(){
  if(!S.ov)return;
  S.ov.M=makeOverlayMap(S.cur.vol,S.ov.vol,S.ovOff);S.offs[S.ov.key]=S.ovOff.slice();
  updateFusUI();requestRender();
}
function nudgeView(vid,du,dw){
  if(!S.ov||!S.cur.vol.geom.hasPos)return;
  const g=S.cur.vol.geom,ng=g.n.map(x=>-x),ax={ax:[g.r,g.c],co:[g.r,ng],sa:[g.c,ng]}[vid];
  S.ovOff=S.ovOff.map((o,i)=>o+ax[0][i]*du+ax[1][i]*dw);applyOff();
}
const offStep=()=>+$('#offStep').value||1;
$('#nL').onclick=()=>nudgeView(S.main,-offStep(),0);
$('#nR').onclick=()=>nudgeView(S.main,offStep(),0);
$('#nU').onclick=()=>nudgeView(S.main,0,-offStep());
$('#nD').onclick=()=>nudgeView(S.main,0,offStep());
const nudgeZ=d=>{if(!S.ov||!S.cur.vol.geom.hasPos)return;const n=S.cur.vol.geom.n;S.ovOff=S.ovOff.map((o,i)=>o+n[i]*d);applyOff();};
$('#nZu').onclick=()=>nudgeZ(offStep());
$('#nZd').onclick=()=>nudgeZ(-offStep());
['offX','offY','offZ'].forEach((id,i)=>{$('#'+id).onchange=e=>{S.ovOff[i]=+e.target.value||0;applyOff();};});
$('#offReset').onclick=()=>{S.ovOff=[0,0,0];applyOff();};

/* --- yükleme sonrası kurulum --- */
async function initStudies(msg,opt){
  const add=!!(opt&&opt.add);
  const sel=$('#seriesSel');sel.innerHTML='';S.series.forEach((s,i)=>sel.add(new Option(s.name,i)));
  if(add){S.ov=null;S.grid.cells.forEach(c=>{if(c.si<0)c.si=undefined;});}
  else{S.stOpen=true;S.grid.cells=[];S.lastGrid=null;S.grid.sel=0;S.ov=null;}
  renderStudies();
  const n=S.series.length;
  if(n<=1){goMPR(S.series[0]);setStatus(msg);return;}
  let [r,c]=autoGrid(n);
  if(add&&S.mode==='grid'&&r*c<=S.grid.r*S.grid.c){r=S.grid.r;c=S.grid.c;}
  await goGrid(r,c);
  if(!$('#status').classList.contains('err')){
    const both=S.series.some(s=>isAnat(s.mod)&&!s.color)&&S.series.some(s=>isPET(s.mod)&&!s.color);
    setStatus(`${msg} Seriler ayrı kutularda gösteriliyor.${both?' Birleştirmek için BT/MR ya da PET kutusunu seçip Füzyon düğmesine basın.':''}`);
  }
}

/* --- başlangıç: örnek BT + PET fantomu --- */
function loadSample(){
  const [ct,pet]=makePhantom();ct.sample=pet.sample=true;ct.color=pet.color=false;
  S.series=[ct,pet];S.offs={};S.ov=null;S.cur=null;
  return initStudies('Örnek fantom: BT ve PET ayrı gösteriliyor.').then(()=>{
    setStatus('Örnek fantom: BT ve PET ayrı gösteriliyor. Füzyon düğmesine basınca PET, BT üzerine biner. Kendi DICOM dosyalarınızı ya da bir ZIP dosyasını ZIP ekle ile, bir klasörü Klasör ekle ile seçin. İstediğiniz kadar dosya ekleyebilirsiniz. Masaüstünde sürükleyip bırakabilirsiniz.');
  });
}
let clearArm=0;
$('#clearBtn').onclick=()=>{
  const b=$('#clearBtn');
  if(!clearArm){b.textContent='Emin misiniz?';clearArm=setTimeout(()=>{clearArm=0;b.textContent='Görüntüleri kaldır';},3500);return;}
  clearTimeout(clearArm);clearArm=0;b.textContent='Görüntüleri kaldır';
  S.series.forEach(s=>{s.vol=null;s.entries=null;});S.closed.forEach(s=>{s.vol=null;s.entries=null;});S.closed=[];S.grid.cells=[];S.lastGrid=null;S.grid.sel=0;
  loadSample();
};

/* --- seri kapatma ve tüm işaretlerin alt listesi --- */
function refreshSeriesList(){
  const sel=$('#seriesSel');sel.innerHTML='';S.series.forEach((s,i)=>sel.add(new Option(s.name,i)));
  renderStudies();syncSeriesSel();
}
function renderAllMarks(){
  const box=$('#allMk'),row=$('#amRow');if(!box)return;row.innerHTML='';let n=0;
  [...S.series,...S.closed].forEach(s=>{
    const closed=S.closed.includes(s);
    (s.markers||[]).forEach(m=>{
      n++;
      const b=document.createElement('button');b.type='button';
      b.className='mki'+(closed?' closed':'')+(s===S.cur&&S.mode==='mpr'?' cur':'');
      b.title='Bu işarete gider. Seri kapalıysa yeniden açılır';
      b.innerHTML='<b class="mn"></b><span class="ms"></span><span class="mx" role="button" aria-label="İşareti sil" title="İşareti sil">×</span>';
      b.querySelector('.mn').textContent=shortName(s);
      b.querySelector('.ms').textContent=`${m.name} · kesit ${m.c[2]+1}${closed?' · kapalı':''}`;
      b.onclick=()=>goMarker(s,m);
      b.querySelector('.mx').onclick=e=>{
        e.stopPropagation();e.preventDefault();
        s.markers.splice(s.markers.indexOf(m),1);
        if(s===S.cur)renderMarks();else renderAllMarks();
        requestRender();
      };
      row.appendChild(b);
    });
  });
  $('#amN').textContent=n;box.hidden=n===0;
}
async function closeSeries(i){
  const s=S.series[i];if(!s)return;
  const hadMarks=(s.markers||[]).length>0,wasCur=S.mode==='mpr'&&S.cur===s;
  S.series.splice(i,1);
  if(hadMarks)S.closed.push(s);else{s.vol=null;s.entries=null;}
  if(S.ov&&S.ov.series===s)S.ov=null;
  try{
    if(!S.series.length){S.grid.cells=[];S.lastGrid=null;S.grid.sel=0;await loadSample();}
    else if(S.mode==='grid'){
      S.grid.cells.forEach(c=>{
        if(c.series===s){c.si=-1;c.vol=null;c.series=null;}
        else if(c.series)c.si=S.series.indexOf(c.series);
      });
      await goGrid(S.grid.r,S.grid.c);
    }else if(wasCur){goMPR(S.series[Math.min(i,S.series.length-1)]);}
  }catch(err){setStatus('Görünüm değiştirilemedi: '+err.message,true);return;}
  refreshSeriesList();
  setStatus(hadMarks?'Seri kapatıldı. İşaretleri alttaki listede kaldı.':'Seri kapatıldı.');
}
function goMarker(s,m){
  try{
    const ci=S.closed.indexOf(s);
    if(ci>=0){
      S.closed.splice(ci,1);
      if(S.series.length&&S.series.every(x=>x.sample)){S.series=[];S.offs={};S.grid.cells=[];S.lastGrid=null;S.grid.sel=0;}
      S.series.push(s);refreshSeriesList();
    }
    goMPR(s);S.c=[...m.c];syncUI();requestRender();
    renderAllMarks();
    setStatus(`${shortName(s)} · ${m.name}`);
  }catch(err){setStatus('Seri açılamadı: '+err.message,true);}
}
/* --- masaüstünde görüntü alanını pencere yüksekliğine sığdır (kaydırma gerekmesin) --- */
function fitHeights(){
  const de=document.documentElement;
  if(!matchMedia('(min-width:721px)').matches){de.style.removeProperty('--vh');return;}
  const el=$('#grid').hidden?$('#views'):$('#grid');
  const top=el.getBoundingClientRect().top+(window.scrollY||0);
  const h=Math.max(320,Math.floor(innerHeight-top-14));
  if(de.style.getPropertyValue('--vh')!==h+'px')de.style.setProperty('--vh',h+'px');
}
addEventListener('resize',fitHeights);addEventListener('load',fitHeights);
if(typeof ResizeObserver!=='undefined'){const ro=new ResizeObserver(fitHeights);['.top','#toolrow','#adv'].forEach(s=>{const e=document.querySelector(s);if(e)ro.observe(e);});}
fitHeights();
/* --- açı skalası düğmeleri --- */
(function(){
  try{const d=localStorage.getItem('dicomAngDev');if(d==='elekta'||d==='varian')S.angDev=d;}catch(_){}
  const b=$('#angBtn'),sel=$('#angDev');sel.value=S.angDev;
  b.onclick=()=>{S.angles=!S.angles;b.setAttribute('aria-pressed',S.angles);sel.hidden=!S.angles;requestRender();};
  sel.onchange=()=>{S.angDev=sel.value;try{localStorage.setItem('dicomAngDev',S.angDev);}catch(_){}requestRender();};
})();
loadSample();
