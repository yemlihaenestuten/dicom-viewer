/* ---------- Görüntüleyici: durum, düzen, çizim ---------- */
const $=s=>document.querySelector(s);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const S={cur:null,series:[],c:[0,0,0],ww:400,wl:40,gamma:1,cmap:'gray',invert:false,tool:'cross',active:'ax',main:'ax',full:false,closed:[],angles:false,angDev:'varian',
  ov:null,ovCmap:'fire',ovA:.55,ovLo:0,ovHi:1,ovOff:[0,0,0],offs:{},mode:'mpr',lastGrid:null,
  grid:{r:2,c:2,cells:[],sel:0,sync:true}};
const VIEWS=[{id:'ax',name:'Aksiyel',hex:'#4cc2b0',d:2},{id:'co',name:'Koronal',hex:'#7aa2ff',d:1},{id:'sa',name:'Sagittal',hex:'#e58fc0',d:0}];
const HEX={ax:'#4cc2b0',co:'#7aa2ff',sa:'#e58fc0'},MARK='#f2b84b';
const CROSS={ax:[HEX.sa,HEX.co],co:[HEX.sa,HEX.ax],sa:[HEX.co,HEX.ax]}; /* [dikey çizgi, yatay çizgi] */
const geo={ax:v=>({w:v.nx,h:v.ny,pw:v.sx,ph:v.sy}),co:v=>({w:v.nx,h:v.nz,pw:v.sx,ph:v.sz}),sa:v=>({w:v.ny,h:v.nz,pw:v.sy,ph:v.sz})};
const toUV=(id,c,v)=>id==='ax'?[c[0],c[1]]:id==='co'?[c[0],v.nz-1-c[2]]:[c[1],v.nz-1-c[2]];
const fromUV=(id,u,w,c,v)=>id==='ax'?[u,w,c[2]]:id==='co'?[u,c[1],v.nz-1-w]:[c[0],u,v.nz-1-w];
const dimsOf=v=>[v.nx,v.ny,v.nz];

/* --- panelleri kur --- */
const viewsEl=$('#views');
VIEWS.forEach(v=>{
  viewsEl.insertAdjacentHTML('beforeend',`<section class="pane mini" id="pane-${v.id}"><div class="ph"><span class="dot" style="background:${v.hex}"></span><h2>${v.name}</h2><span class="sl" id="sl-${v.id}"></span></div><div class="cvw" id="cw-${v.id}"><canvas id="cv-${v.id}" aria-label="${v.name} kesit"></canvas><button class="mx" id="mx-${v.id}" type="button"></button></div><input class="slice" type="range" id="rg-${v.id}" min="0" max="0" value="0" aria-label="${v.name} kesit numarası"></section>`);
  Object.assign(v,{cv:$('#cv-'+v.id),zoom:1,panx:0,pany:0,key:'',dpr:1,g:null,off:document.createElement('canvas')});
  v.ctx=v.cv.getContext('2d');v.octx=v.off.getContext('2d');
  new ResizeObserver(()=>{const r=$('#cw-'+v.id).getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);v.dpr=d;v.cv.width=Math.max(1,Math.round(r.width*d));v.cv.height=Math.max(1,Math.round(r.height*d));requestRender();}).observe($('#cw-'+v.id));
});

/* --- düzen: büyük ana görünüm (2) + sağda küçük iki görünüm (1) --- */
const EXPAND='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2h4v4M6 14H2v-4M14 2L9.5 6.5M2 14l4.5-4.5"/></svg>';
const SHRINK='<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 6h-4V2M2 10h4v4M10 6l4-4M6 10l-4 4"/></svg>';
function layout(){
  const single=!!(S.cur&&S.cur.vol.nz<2);
  if(single)S.main='ax';
  $('#views').classList.toggle('full',S.full||single);
  VIEWS.forEach(v=>{
    const main=v.id===S.main,p=$('#pane-'+v.id),b=$('#mx-'+v.id);
    p.classList.toggle('main',main);p.classList.toggle('mini',!main);
    b.hidden=single;b.innerHTML=main&&S.full?SHRINK:EXPAND;
    b.title=b.ariaLabel=main?(S.full?'Küçült':'Tam genişlik'):'Büyüt';
    v.panx=0;v.pany=0;
  });
  S.active=S.main;requestRender();
}
VIEWS.forEach(v=>{$('#mx-'+v.id).onclick=()=>{if(v.id===S.main)S.full=!S.full;else{S.main=v.id;S.full=false;}layout();};});

/* --- çizim --- */
let raf=0;
const requestRender=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;renderAll();});};
function ensureLUT(vol){
  const key=`${S.ww}|${S.wl}|${S.invert}|${S.gamma}|${S.cmap}`;if(vol.lutKey===key)return;
  const n=vol.max-vol.min+1;
  if(!vol.lutG||vol.lutG.length!==n){vol.lutG=new Uint8Array(n);vol.lut=new Uint32Array(n);}
  const lo=S.wl-S.ww/2,inv=S.invert!==vol.mono1,gi=1/S.gamma,cm=CMAPS[S.cmap];
  for(let i=0;i<n;i++){
    let t=((i+vol.min)*vol.slope+vol.icpt-lo)/S.ww;t=t<0?0:t>1?1:t;
    if(S.gamma!==1)t=Math.pow(t,gi);
    let g=Math.round(t*255);if(inv)g=255-g;
    vol.lutG[i]=g;vol.lut[i]=cm[g];
  }
  vol.lutKey=key;
}
const ovKey=()=>S.ov?`${S.ov.vol.id}|${S.ovLo}|${S.ovHi}|${S.ovA}|${S.ovCmap}|${S.ovOff}`:'';
function blendOverlay(v,vol,g,px){
  const O=S.ov.vol,M=S.ov.M,id=v.id,[i0,j0,k0]=S.c,nz=vol.nz;
  let bi=0,ui=0,wi=0,bj=0,uj=0,wj=0,bk=0,uk=0,wk=0;
  if(id==='ax'){ui=1;wj=1;bk=k0;}
  else if(id==='co'){ui=1;bj=j0;bk=nz-1;wk=-1;}
  else{bi=i0;uj=1;bk=nz-1;wk=-1;}
  const co=r=>[M[r][0]*ui+M[r][1]*uj+M[r][2]*uk,M[r][0]*wi+M[r][1]*wj+M[r][2]*wk,M[r][0]*bi+M[r][1]*bj+M[r][2]*bk+M[r][3]];
  const [xu,xw,xb]=co(0),[yu,yw,yb]=co(1),[zu,zw,zb]=co(2);
  const lo=S.ovLo,rng=Math.max(1e-9,S.ovHi-S.ovLo),cm=CMAPS[S.ovCmap],a0=S.ovA,sl=O.slope,ic=O.icpt;
  for(let w=0;w<g.h;w++)for(let u=0;u<g.w;u++){
    const val=sampleVol(O,xb+xu*u+xw*w,yb+yu*u+yw*w,zb+zu*u+zw*w);
    if(val!==val)continue;
    let t=(val*sl+ic-lo)/rng;if(t<=0)continue;if(t>1)t=1;
    const c=cm[Math.round(t*255)],a=a0*(t<.25?t*4:1),o=w*g.w+u,b=px[o];
    const br=b&255,bg=(b>>8)&255,bb=(b>>16)&255;
    px[o]=0xFF000000|(((bb+(((c>>16)&255)-bb)*a)|0)<<16)|(((bg+(((c>>8)&255)-bg)*a)|0)<<8)|((br+((c&255)-br)*a)|0);
  }
}
function renderSlice(v,vol,g){
  const {nx,ny,nz}=vol,[i0,j0,k0]=S.c,lut=vol.lut,lg=vol.lutG,mn=vol.min,d=vol.data,nxy=nx*ny;
  if(v.off.width!==g.w||v.off.height!==g.h){v.off.width=g.w;v.off.height=g.h;v.img=v.octx.createImageData(g.w,g.h);}
  const px=new Uint32Array(v.img.data.buffer);let o=0;
  const put=vol.color?q=>{const b=3*q;px[o++]=0xFF000000|(lg[d[b+2]-mn]<<16)|(lg[d[b+1]-mn]<<8)|lg[d[b]-mn];}:q=>{px[o++]=lut[d[q]-mn];};
  if(v.id==='ax'){const b=k0*nxy;for(let n=0;n<nxy;n++)put(b+n);}
  else if(v.id==='co'){for(let r=0;r<nz;r++){const b=(nz-1-r)*nxy+j0*nx;for(let u=0;u<nx;u++)put(b+u);}}
  else{for(let r=0;r<nz;r++){const b=(nz-1-r)*nxy+i0;for(let u=0;u<ny;u++)put(b+u*nx);}}
  if(S.ov)blendOverlay(v,vol,g,px);
  v.octx.putImageData(v.img,0,0);
}
function rulerLen(id,vol,r){const g=geo[id](vol);return Math.hypot((r.b[0]-r.a[0])*g.pw,(r.b[1]-r.a[1])*g.ph);}
function rulerText(id,vol,r){const d=rulerLen(id,vol,r);return vol.psKnown?`${d.toFixed(1)} mm`:`${d.toFixed(1)} px`;}
function line(ctx,a,b,c,d){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();}
function renderView(v){
  const vol=S.cur.vol,ctx=v.ctx,W=v.cv.width,H=v.cv.height,dpr=v.dpr,g=geo[v.id](vol);
  ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.font=`${11*dpr}px "IBM Plex Mono",monospace`;
  if(v.id!=='ax'&&vol.nz<2){v.g=null;return;}
  const key=`${S.c[v.d]}|${vol.lutKey}|${vol.id}|${ovKey()}`;
  if(key!==v.key){renderSlice(v,vol,g);v.key=key;}
  const fit=Math.min(W/(g.w*g.pw),H/(g.h*g.ph)),s=fit*v.zoom,dw=g.w*g.pw*s,dh=g.h*g.ph*s,x0=(W-dw)/2+v.panx,y0=(H-dh)/2+v.pany;
  ctx.imageSmoothingEnabled=dw/g.w<3;ctx.drawImage(v.off,x0,y0,dw,dh);
  v.g={x0,y0,dw,dh,w:g.w,h:g.h};
  const [u,w]=toUV(v.id,S.c,vol),cx=x0+(u+.5)/g.w*dw,cy=y0+(w+.5)/g.h*dh;
  if(vol.nz>1){
    ctx.lineWidth=Math.max(1,dpr);ctx.globalAlpha=.75;
    ctx.strokeStyle=CROSS[v.id][0];line(ctx,cx,y0,cx,y0+dh);
    ctx.strokeStyle=CROSS[v.id][1];line(ctx,x0,cy,x0+dw,cy);
  }
  S.cur.markers.forEach((m,i)=>{
    const dist=Math.abs(m.c[v.d]-S.c[v.d]);if(dist!==0)return;
    const [mu,mv]=toUV(v.id,m.c,vol),mx=x0+(mu+.5)/g.w*dw,my=y0+(mv+.5)/g.h*dh;
    ctx.globalAlpha=dist?.35:1;ctx.strokeStyle=MARK;ctx.lineWidth=2*dpr;ctx.beginPath();ctx.arc(mx,my,7*dpr,0,6.2832);ctx.stroke();
    if(!dist){ctx.fillStyle=MARK;ctx.fillText(String(i+1),mx+9*dpr,my-6*dpr);}
  });
  const rl=S.cur.rulers.filter(r=>r.id===v.id&&r.depth===S.c[v.d]);if(v.tmp)rl.push(v.tmp);
  rl.forEach(r=>{
    const ax=x0+r.a[0]/g.w*dw,ay=y0+r.a[1]/g.h*dh,bx=x0+r.b[0]/g.w*dw,by=y0+r.b[1]/g.h*dh;
    ctx.globalAlpha=1;ctx.strokeStyle='#ffe066';ctx.fillStyle='#ffe066';ctx.lineWidth=1.6*dpr;line(ctx,ax,ay,bx,by);
    [[ax,ay],[bx,by]].forEach(([px,py])=>{ctx.beginPath();ctx.arc(px,py,3.5*dpr,0,6.2832);ctx.fill();});
    const txt=rulerText(v.id,vol,r),tw=ctx.measureText(txt).width,mx=(ax+bx)/2,my=(ay+by)/2-10*dpr;
    ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(mx-tw/2-4*dpr,my-11*dpr,tw+8*dpr,16*dpr);
    ctx.fillStyle='#ffe066';ctx.textAlign='center';ctx.fillText(txt,mx,my+1*dpr);ctx.textAlign='left';
  });
  ctx.globalAlpha=.85;ctx.fillStyle='#c9d3dc';
  const narrow=W/dpr<300;
  ctx.fillText(narrow?`${Math.round(S.ww)}/${Math.round(S.wl)}`:`W ${Math.round(S.ww)}  L ${Math.round(S.wl)}`,8*dpr,H-8*dpr);
  ctx.textAlign='right';if(!narrow)ctx.fillText(`×${v.zoom.toFixed(2)}`,W-8*dpr,H-8*dpr);
  if(vol.std){
    const L={ax:['R','L','A','P'],co:['R','L','S','I'],sa:['A','P','S','I']}[v.id];
    ctx.fillStyle=HEX[v.id];ctx.textAlign='left';ctx.fillText(L[0],8*dpr,H/2);ctx.textAlign='right';ctx.fillText(L[1],W-8*dpr,H/2);
    ctx.textAlign='center';ctx.fillText(L[2],W/2,16*dpr);ctx.fillText(L[3],W/2,H-22*dpr);
  }
  ctx.textAlign='left';ctx.globalAlpha=1;
  drawAngles(ctx,W,H,dpr);
}
/* --- gantri açı skalası: görüntünün kenarında 0-360° (açı düğmesi açıkken) --- */
function drawAngles(ctx,W,H,dpr){
  if(!S.angles)return;
  const cx=W/2,cy=H/2,elekta=S.angDev==='elekta';
  const small=W/dpr<190||H/dpr<190;
  ctx.save();ctx.globalAlpha=1;ctx.font=`${(small?9:11)*dpr}px sans-serif`;ctx.textBaseline='middle';ctx.textAlign='center';
  for(let a=0;a<360;a+=10){
    const phi=((elekta?a+180:a)%360)*Math.PI/180;
    const dx=Math.sin(phi),dy=-Math.cos(phi);
    const tx=Math.abs(dx)>1e-9?(W/2)/Math.abs(dx):1e9,ty=Math.abs(dy)>1e-9?(H/2)/Math.abs(dy):1e9;
    const t=Math.min(tx,ty),bx=cx+dx*t,by=cy+dy*t;
    const vert=tx<ty;                       /* dikey kenara mı çarptı */
    const nx=vert?-Math.sign(dx):0,ny=vert?0:-Math.sign(dy);
    const major=a%30===0,len=(major?14:7)*dpr;
    ctx.strokeStyle=a===0?'#7dffb0':major?'#ffd54a':'rgba(255,213,74,.65)';ctx.lineWidth=(major?1.8:1)*dpr;
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+nx*len,by+ny*len);ctx.stroke();
    if(major&&(!small||a%90===0)){
      const txt=a+'°',tw=ctx.measureText(txt).width;
      let lx=bx+nx*(vert?tw/2+20*dpr:0),ly=by+ny*(vert?0:30*dpr);
      lx=Math.min(Math.max(lx,tw/2+4*dpr),W-tw/2-4*dpr);ly=Math.min(Math.max(ly,10*dpr),H-10*dpr);
      ctx.fillStyle='rgba(0,0,0,.62)';ctx.fillRect(lx-tw/2-3*dpr,ly-7*dpr,tw+6*dpr,14*dpr);
      ctx.fillStyle=a===0?'#7dffb0':'#ffd54a';ctx.fillText(txt,lx,ly);
    }
  }
  ctx.restore();
}
function renderAll(){if(S.mode==='grid'){renderGrid();return;}if(!S.cur)return;ensureLUT(S.cur.vol);VIEWS.forEach(renderView);}
