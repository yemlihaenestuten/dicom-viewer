/* ---------- Hacim oluşturma ---------- */
let volCounter=0;
function buildVolume(entries){
  const m0=entries[0].m,ny=m0.info.rows,nx=m0.info.cols,color=!!m0.info.color,stride=color?3:1;
  const iop=m0.iop||[1,0,0,0,1,0],r=iop.slice(0,3),cc=iop.slice(3,6);
  const nrm=[r[1]*cc[2]-r[2]*cc[1],r[2]*cc[0]-r[0]*cc[2],r[0]*cc[1]-r[1]*cc[0]];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const hasPos=entries.every(e=>e.m.ipp);
  entries.forEach(e=>{e.pos=hasPos?dot(e.m.ipp,nrm)+e.fi*e.m.thick:(e.m.inst||0)*1000+e.fi;});
  entries.sort((a,b)=>a.pos-b.pos);
  const list=entries;
  const nz=list.length;let sz=m0.thick||1,uniform=true;
  if(hasPos&&nz>1){
    const d=[];for(let i=1;i<nz;i++)d.push(list[i].pos-list[i-1].pos);
    const pos=d.filter(x=>Math.abs(x)>1e-3).sort((a,b)=>a-b);
    if(pos.length){sz=pos[pos.length>>1];uniform=d.every(x=>Math.abs(x-sz)<=0.1*Math.abs(sz));}else uniform=false;
  }
  const nxy=nx*ny;let data,slope=m0.slope,icpt=m0.icpt;
  const needQ=!color&&list.some(e=>e.data instanceof Float32Array||e.m.slope!==m0.slope||e.m.icpt!==m0.icpt);
  if(needQ){
    /* kesit başına farklı rescale (PET gibi): fiziksel değere çevirip 16 bite nicemle */
    let lo=Infinity,hi=-Infinity;
    for(const e of list){
      let a=Infinity,b=-Infinity;const d=e.data;
      for(let i=0;i<d.length;i++){const v=d[i];if(v<a)a=v;if(v>b)b=v;}
      const A=a*e.m.slope+e.m.icpt,B=b*e.m.slope+e.m.icpt;lo=Math.min(lo,A,B);hi=Math.max(hi,A,B);
    }
    const rng=hi-lo||1;slope=rng/65535;icpt=lo;data=new Uint16Array(nxy*nz);
    list.forEach((e,k)=>{const d=e.data,s=e.m.slope,o=e.m.icpt,b=k*nxy;for(let i=0;i<nxy;i++)data[b+i]=Math.round(((d[i]*s+o)-lo)/rng*65535);});
  }else{
    data=new (list[0].data.constructor)(nxy*stride*nz);
    list.forEach((e,k)=>data.set(e.data,k*nxy*stride));
  }
  let mn=Infinity,mx=-Infinity;
  for(let i=0;i<data.length;i++){const v=data[i];if(v<mn)mn=v;if(v>mx)mx=v;}
  let hist=null;
  if(!color){hist=new Uint32Array(mx-mn+1);for(let i=0;i<data.length;i++)hist[data[i]-mn]++;}
  const hA=mn*slope+icpt,hB=mx*slope+icpt;
  return {id:++volCounter,nx,ny,nz,sx:m0.ps[1],sy:m0.ps[0],sz:Math.abs(sz)||1,data,color,stride,min:mn,max:mx,slope,icpt,hist,
    psKnown:m0.psKnown,hmin:Math.min(hA,hB),hmax:Math.max(hA,hB),mono1:m0.info.photo==='MONOCHROME1',wc:m0.wc,ww:m0.ww,uniform,mod:m0.mod,units:m0.units,forUid:m0.forUid,
    geom:{O:hasPos?list[0].m.ipp.slice():[0,0,0],r,c:cc,n:nrm,hasPos},
    std:Math.abs(r[0]-1)<.05&&Math.abs(cc[1]-1)<.05&&nrm[2]>.95,sliceTags:list.map(e=>e.m.tags),lut:null,lutKey:''};
}
function ensureVol(s){if(!s.vol){s.vol=buildVolume(s.entries);s.entries=null;}return s.vol;}

/* yüzde dilimi (histogramdan), fiziksel değer döndürür */
function pct(vol,p){
  if(!vol.hist)return vol.hmin;
  const target=vol.nx*vol.ny*vol.nz*p/100;let acc=0;
  for(let i=0;i<vol.hist.length;i++){acc+=vol.hist[i];if(acc>=target)return (i+vol.min)*vol.slope+vol.icpt;}
  return vol.hmax;
}

/* ---------- Füzyon: taban voksel dizini -> bindirme voksel dizini (3x4 matris) ---------- */
function makeOverlayMap(B,O,off){
  off=off||[0,0,0];
  const gb=B.geom,go=O.geom;
  if(gb.hasPos&&go.hasPos){
    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],d0=[gb.O[0]-go.O[0]-off[0],gb.O[1]-go.O[1]-off[1],gb.O[2]-go.O[2]-off[2]];
    const vi=gb.r.map(x=>x*B.sx),vj=gb.c.map(x=>x*B.sy),vk=gb.n.map(x=>x*B.sz);
    return [[go.r,O.sx],[go.c,O.sy],[go.n,O.sz]].map(([a,sp])=>[dot(vi,a)/sp,dot(vj,a)/sp,dot(vk,a)/sp,dot(d0,a)/sp]);
  }
  const f=(no,nb)=>nb>1?(no-1)/(nb-1):0;
  return [[f(O.nx,B.nx),0,0,0],[0,f(O.ny,B.ny),0,0],[0,0,f(O.nz,B.nz),0]];
}
function sampleVol(O,x,y,z){
  const {nx,ny,nz,data}=O;
  if(x<-0.5||y<-0.5||z<-0.5||x>nx-0.5||y>ny-0.5||z>nz-0.5)return NaN;
  x=x<0?0:x>nx-1?nx-1:x;y=y<0?0:y>ny-1?ny-1:y;z=z<0?0:z>nz-1?nz-1:z;
  const x0=x|0,y0=y|0,z0=z|0,x1=x0+1<nx?x0+1:x0,y1=y0+1<ny?y0+1:y0,z1=z0+1<nz?z0+1:z0,fx=x-x0,fy=y-y0,fz=z-z0,nxy=nx*ny;
  const a=z0*nxy,b=z1*nxy;
  const c00=data[a+y0*nx+x0]*(1-fx)+data[a+y0*nx+x1]*fx,c10=data[a+y1*nx+x0]*(1-fx)+data[a+y1*nx+x1]*fx;
  const d00=data[b+y0*nx+x0]*(1-fx)+data[b+y0*nx+x1]*fx,d10=data[b+y1*nx+x0]*(1-fx)+data[b+y1*nx+x1]*fx;
  return (c00*(1-fy)+c10*fy)*(1-fz)+(d00*(1-fy)+d10*fy)*fz;
}

/* ---------- Renk haritaları ---------- */
function mkCmap(stops){
  const o=new Uint32Array(256);
  for(let i=0;i<256;i++){
    const t=i/255;let k=0;while(k<stops.length-2&&t>stops[k+1][0])k++;
    const [t0,a]=stops[k],[t1,b]=stops[k+1],f=t1>t0?Math.min(1,Math.max(0,(t-t0)/(t1-t0))):0;
    const c=a.map((v,j)=>Math.round(v+(b[j]-v)*f));
    o[i]=0xFF000000|(c[2]<<16)|(c[1]<<8)|c[0];
  }
  return o;
}
const CMAP_LIST=[['gray','Gri'],['igray','Ters gri'],['hot','Sıcak'],['fire','Ateş (PET)'],['jet','Jet'],['rainbow','Gökkuşağı'],['viridis','Viridis'],['coolwarm','Soğuk-sıcak'],['bone','Kemik']];
const CMAPS={
  gray:mkCmap([[0,[0,0,0]],[1,[255,255,255]]]),
  igray:mkCmap([[0,[255,255,255]],[1,[0,0,0]]]),
  hot:mkCmap([[0,[0,0,0]],[.4,[230,0,0]],[.8,[255,220,0]],[1,[255,255,255]]]),
  fire:mkCmap([[0,[0,0,0]],[.2,[60,0,110]],[.45,[200,30,60]],[.7,[255,150,0]],[.9,[255,240,80]],[1,[255,255,255]]]),
  jet:mkCmap([[0,[0,0,128]],[.125,[0,0,255]],[.375,[0,255,255]],[.625,[255,255,0]],[.875,[255,0,0]],[1,[128,0,0]]]),
  rainbow:mkCmap([[0,[75,0,130]],[.2,[0,0,255]],[.4,[0,200,0]],[.6,[255,255,0]],[.8,[255,128,0]],[1,[255,0,0]]]),
  viridis:mkCmap([[0,[68,1,84]],[.25,[59,82,139]],[.5,[33,145,140]],[.75,[94,201,98]],[1,[253,231,37]]]),
  coolwarm:mkCmap([[0,[59,76,192]],[.5,[221,221,221]],[1,[180,4,38]]]),
  bone:mkCmap([[0,[0,0,0]],[.375,[84,84,116]],[.75,[166,198,198]],[1,[255,255,255]]])
};

/* ---------- Örnek fantom: BT + PET (yapay veri) ---------- */
function phantomTags(desc,mod){return new Map([[0x00080060,{vr:'CS',v:[mod]}],[0x0008103E,{vr:'LO',v:[desc]}]]);}
function phantomVol(nx,ny,nz,sx,sy,sz,o,fn,slope,mod,desc){
  const nxy=nx*ny,data=new Int16Array(nxy*nz);let mn=1e9,mx=-1e9;
  for(let k=0;k<nz;k++){const z=(k+.5)/nz*2-1;for(let j=0;j<ny;j++){const y=(j+.5)/ny*2-1;for(let i=0;i<nx;i++){
    const v=fn((i+.5)/nx*2-1,y,z);data[k*nxy+j*nx+i]=v;if(v<mn)mn=v;if(v>mx)mx=v;}}}
  const hist=new Uint32Array(mx-mn+1);for(let i=0;i<data.length;i++)hist[data[i]-mn]++;
  const t=phantomTags(desc,mod);
  return {id:++volCounter,nx,ny,nz,sx,sy,sz,data,color:false,stride:1,psKnown:true,min:mn,max:mx,slope,icpt:0,hist,hmin:mn*slope,hmax:mx*slope,mono1:false,wc:null,ww:null,
    uniform:true,mod,units:mod==='PT'?'SUV (örnek)':'',forUid:'phantom',geom:{O:[-160+o[0],-160+o[0],-144+o[1]],r:[1,0,0],c:[0,1,0],n:[0,0,1],hasPos:true},std:true,
    sliceTags:Array.from({length:nz},()=>t),lut:null,lutKey:''};
}
function makePhantom(){
  const ell=(x,y,z,cx,cy,cz,rx,ry,rz)=>{const a=(x-cx)/rx,b=(y-cy)/ry,c=(z-cz)/rz;return a*a+b*b+c*c<1;};
  let seed=7;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296-.5;};
  const ct=phantomVol(128,128,96,2.5,2.5,3,[0,0],(x,y,z)=>{
    let v=-1000;
    if(ell(x,y,z,0,0,0,.85,.62,.95)){v=40;
      if(ell(x,y,z,.1,-.15,.2,.2,.18,.22))v=60;
      if(ell(x,y,z,-.32,-.02,-.55,.3,.25,.3))v=65;
      if(ell(x,y,z,-.38,-.05,.15,.26,.34,.5)||ell(x,y,z,.38,-.05,.15,.26,.34,.5))v=-800;
      if(ell(x,y,z,.42,-.05,.28,.06,.06,.06))v=30;
      if(ell(x,y,z,0,.4,z,.09*(.55+.45*Math.cos(z*38))+.04,.09*(.55+.45*Math.cos(z*38))+.04,2))v=650;
      if(ell(x,y,z,0,-.58,.25,.1,.05,.4))v=480;
      v+=rnd()*14;}
    return Math.round(v);},1,'CT','Örnek BT (yapay veri)');
  const pet=phantomVol(64,64,48,5,5,6,[1.25,1.5],(x,y,z)=>{
    let v=0;
    if(ell(x,y,z,0,0,0,.85,.62,.95)){v=1;
      if(ell(x,y,z,-.38,-.05,.15,.26,.34,.5)||ell(x,y,z,.38,-.05,.15,.26,.34,.5))v=.3;
      if(ell(x,y,z,.1,-.15,.2,.2,.18,.22))v=5.5;
      if(ell(x,y,z,-.32,-.02,-.55,.3,.25,.3))v=2.6;
      if(ell(x,y,z,0,.4,z,.12,.12,2))v=1.8;
      if(ell(x,y,z,.42,-.05,.28,.1,.1,.1))v=9;
      if(ell(x,y,z,-.25,.1,-.42,.07,.07,.07))v=6.5;}
    return Math.round((v+Math.abs(rnd())*.05)*100);},0.01,'PT','Örnek PET (yapay veri)');
  return [{name:'BT · Örnek fantom (yapay veri)',desc:'Örnek BT (yapay veri)',snum:1,n:ct.nz,vol:ct,markers:[],entries:null,mod:'CT'},{name:'PET · Örnek fantom (yapay veri)',desc:'Örnek PET (yapay veri)',snum:2,n:pet.nz,vol:pet,markers:[],entries:null,mod:'PT'}];
}
