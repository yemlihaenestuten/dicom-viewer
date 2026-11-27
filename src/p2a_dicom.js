'use strict';
/* ---------- DICOM ayrıştırıcı ---------- */
const TS={IMPL:'1.2.840.10008.1.2',EXPL:'1.2.840.10008.1.2.1',DEFL:'1.2.840.10008.1.2.1.99',BE:'1.2.840.10008.1.2.2',RLE:'1.2.840.10008.1.2.5',JPB:'1.2.840.10008.1.2.4.50',JPL1:'1.2.840.10008.1.2.4.57',JPL:'1.2.840.10008.1.2.4.70'};
const TSNAME={'1.2.840.10008.1.2.4.51':'JPEG genişletilmiş','1.2.840.10008.1.2.4.80':'JPEG-LS kayıpsız','1.2.840.10008.1.2.4.81':'JPEG-LS','1.2.840.10008.1.2.4.90':'JPEG 2000 kayıpsız','1.2.840.10008.1.2.4.91':'JPEG 2000','1.2.840.10008.1.2.4.201':'HTJ2K','1.2.840.10008.1.2.4.202':'HTJ2K','1.2.840.10008.1.2.4.203':'HTJ2K'};
const LONG_VR=new Set(['OB','OW','OF','OD','OL','OV','SQ','UC','UR','UT','UN']);
const PAL_DESC=new Set([0x00281101,0x00281102,0x00281103]),PAL_DATA=new Set([0x00281201,0x00281202,0x00281203]);
const US_TAGS=new Set([0x00280002,0x00280006,0x00280010,0x00280011,0x00280100,0x00280101,0x00280102,0x00280103,...PAL_DESC]);
const T={rows:0x00280010,cols:0x00280011,spp:0x00280002,photo:0x00280004,planar:0x00280006,nf:0x00280008,ps:0x00280030,bits:0x00280100,pr:0x00280103,
  wc:0x00281050,ww:0x00281051,icpt:0x00281052,slope:0x00281053,ipp:0x00200032,iop:0x00200037,inst:0x00200013,snum:0x00200011,suid:0x0020000E,for:0x00200052,
  thick:0x00180050,sbs:0x00180088,mod:0x00080060,desc:0x0008103E,ts:0x00020010,cs:0x00080005,units:0x00541001,pix:0x7FE00010};
const CHARSETS={'ISO_IR 192':'utf-8','ISO_IR 148':'iso-8859-9','ISO_IR 100':'iso-8859-1','ISO_IR 144':'iso-8859-5','ISO_IR 126':'iso-8859-7'};

function decodeVal(c,vr,p,len){
  const {dv,u8,le}=c;
  const arr=(sz,f)=>{const n=Math.min(Math.floor(len/sz),64),a=[];for(let i=0;i<n;i++)a.push(f(p+i*sz));return a;};
  switch(vr){
    case 'US':return arr(2,q=>dv.getUint16(q,le));
    case 'SS':return arr(2,q=>dv.getInt16(q,le));
    case 'UL':return arr(4,q=>dv.getUint32(q,le));
    case 'SL':return arr(4,q=>dv.getInt32(q,le));
    case 'FL':return arr(4,q=>+dv.getFloat32(q,le).toPrecision(6));
    case 'FD':return arr(8,q=>+dv.getFloat64(q,le).toPrecision(10));
    case 'OB':case 'OW':case 'OF':case 'OD':case 'OL':case 'OV':case 'SQ':case 'AT':return null;
    case 'UN':
      if(len>64)return null;
      for(let i=0;i<len;i++){const b=u8[p+i];if((b<32||b>126)&&b!==0)return null;}
  }
  const s=c.dec.decode(u8.subarray(p,p+len)).replace(/[\0 ]+$/,'');
  return (vr==='UT'||vr==='LT'||vr==='ST')?[s]:s.split('\\').map(x=>x.trim());
}

function readFragments(c,p,end){
  const {dv,le}=c;const frags=[];let first=true;
  while(p+8<=end){
    const tag=((dv.getUint16(p,le)<<16)|dv.getUint16(p+2,le))>>>0,len=dv.getUint32(p+4,le);
    p+=8;
    if(tag!==0xFFFEE000)break;
    if(!first)frags.push({start:p,len:Math.min(len,end-p)});
    first=false;p+=len;
  }
  return {frags,pos:p};
}
function skipSeq(c,p,end,explicit){
  const {dv,le}=c;
  while(p+8<=end){
    const tag=((dv.getUint16(p,le)<<16)|dv.getUint16(p+2,le))>>>0,len=dv.getUint32(p+4,le);
    if(tag!==0xFFFEE000)return p+8;
    p+=8;
    if(len===0xFFFFFFFF)p=readElements(c,p,end,explicit,null,undefined,true).pos;else p+=len;
  }
  return p;
}
function readElements(c,start,end,explicit,out,onlyGroup,nested){
  const {dv,u8,le}=c;let p=start;
  while(p+8<=end){
    const g=dv.getUint16(p,le),e=dv.getUint16(p+2,le),tag=((g<<16)|e)>>>0;
    if(onlyGroup!==undefined&&g!==onlyGroup)break;
    if(g===0xFFFE){if(tag===0xFFFEE00D||tag===0xFFFEE0DD)return {pos:p+8};p+=8;continue;}
    let vr,len,hdr;
    if(explicit){
      vr=String.fromCharCode(u8[p+4],u8[p+5]);
      if(LONG_VR.has(vr)){len=dv.getUint32(p+8,le);hdr=12;}else{len=dv.getUint16(p+6,le);hdr=8;}
    }else{vr=US_TAGS.has(tag)?'US':'UN';len=dv.getUint32(p+4,le);hdr=8;}
    const vs=p+hdr;
    if(tag===T.pix&&!nested){
      if(len===0xFFFFFFFF)c.frags=readFragments(c,vs,end).frags;else c.pixel={start:vs,len:Math.min(len,end-vs)};
      return {pos:end};
    }
    if(len===0xFFFFFFFF){p=(tag===T.pix)?readFragments(c,vs,end).pos:skipSeq(c,vs,end,explicit);continue;}
    if(vs+len>end)break;
    if(out){
      if(PAL_DATA.has(tag)){const a=[];for(let i=0;i<(len>>1);i++)a.push(dv.getUint16(vs+2*i,le));out.set(tag,{vr:'OW',v:a});}
      else{
        const v=decodeVal(c,vr,vs,len);out.set(tag,{vr,v});
        if(tag===T.cs&&v&&CHARSETS[v[v.length-1]]){try{c.dec=new TextDecoder(CHARSETS[v[v.length-1]]);}catch(_){}}
      }
    }
    p=vs+len;
  }
  return {pos:p};
}
async function inflate(buf){
  const s=new Blob([buf]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return await new Response(s).arrayBuffer();
}

/* ---------- RLE ---------- */
function decodeRLE(b,n,bpp,spp){
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength),nseg=dv.getUint32(0,true),offs=[];
  for(let i=0;i<nseg;i++)offs.push(dv.getUint32(4+4*i,true));
  const out=new Uint8Array(n*bpp*spp);
  for(let s=0;s<nseg;s++){
    const seg=new Uint8Array(n),end=s+1<nseg?offs[s+1]:b.length;let p=offs[s],q=0;
    while(q<n&&p<end){
      const h=b[p++];
      if(h<128){for(let k=0;k<=h&&q<n;k++)seg[q++]=b[p++];}
      else if(h>128){const v=b[p++];for(let k=0;k<257-h&&q<n;k++)seg[q++]=v;}
    }
    const sample=Math.floor(s/bpp),byteIdx=s%bpp;
    if(spp>1)out.set(seg,sample*n);
    else for(let i=0;i<n;i++)out[i*bpp+(bpp-1-byteIdx)]=seg[i];
  }
  return out;
}

/* ---------- JPEG baseline (tarayıcı çözer) ---------- */
async function jpegDecode(bytes,color){
  const bmp=await createImageBitmap(new Blob([bytes],{type:'image/jpeg'}));
  const cv=document.createElement('canvas');cv.width=bmp.width;cv.height=bmp.height;
  const x=cv.getContext('2d',{willReadFrequently:true});x.drawImage(bmp,0,0);
  const d=x.getImageData(0,0,bmp.width,bmp.height).data,n=bmp.width*bmp.height;
  if(color){const o=new Uint8Array(n*3);for(let i=0;i<n;i++){o[3*i]=d[4*i];o[3*i+1]=d[4*i+1];o[3*i+2]=d[4*i+2];}return o;}
  const o=new Uint8Array(n);for(let i=0;i<n;i++)o[i]=d[4*i];return o;
}

/* ---------- JPEG kayıpsız (SOF3, Huffman) ---------- */
function huffBuild(cnt,vals){
  const mincode=new Int32Array(17),maxcode=new Int32Array(18).fill(-1),valptr=new Int32Array(17);
  let code=0,k=0;
  for(let l=1;l<=16;l++){valptr[l]=k;mincode[l]=code;code+=cnt[l-1];k+=cnt[l-1];maxcode[l]=cnt[l-1]?code-1:-1;code<<=1;}
  return {mincode,maxcode,valptr,vals};
}
function jpegLossless(b){
  let p=2,w=0,h=0,P=16,Nf=1,Ri=0,Ss=1;const dht={},comps=[];
  while(p<b.length){
    if(b[p]!==0xFF){p++;continue;}
    const m=b[p+1];p+=2;
    if(m===0xD8||m===0x01||m===0xFF||(m>=0xD0&&m<=0xD7))continue;
    if(m===0xD9)break;
    const L=(b[p]<<8)|b[p+1];
    if(m===0xC4){
      let q=p+2;const end=p+L;
      while(q<end){const th=b[q]&15;q++;const cnt=b.subarray(q,q+16);q+=16;let n=0;for(let i=0;i<16;i++)n+=cnt[i];dht[th]=huffBuild(cnt,b.subarray(q,q+n));q+=n;}
    }else if(m===0xC3){P=b[p+2];h=(b[p+3]<<8)|b[p+4];w=(b[p+5]<<8)|b[p+6];Nf=b[p+7];for(let i=0;i<Nf;i++)comps.push({});}
    else if(m===0xDD)Ri=(b[p+2]<<8)|b[p+3];
    else if(m===0xDA){
      const ns=b[p+2];for(let i=0;i<ns;i++)comps[i].td=b[p+4+2*i]>>4;
      Ss=b[p+3+2*ns];const Pt=b[p+5+2*ns]&15;
      return scanLossless(b,p+L,w,h,P,Nf,Ri,Ss,Pt,comps.map(c=>dht[c.td]));
    }else if(m>=0xC0&&m<=0xCF&&m!==0xC4&&m!==0xC8&&m!==0xCC)throw new Error('Bu JPEG türü desteklenmiyor');
    p+=L;
  }
  throw new Error('JPEG verisi çözülemedi');
}
function scanLossless(b,start,w,h,P,Nf,Ri,Ss,Pt,tabs){
  const out=new Uint16Array(w*h*Nf);let bp=start,bb=0,bc=0;
  const bit=()=>{
    if(!bc){let v=b[bp++];if(v===0xFF){if(b[bp]===0)bp++;else{bp--;v=0;}}bb=v;bc=8;}
    bc--;return (bb>>bc)&1;
  };
  const dec=(t)=>{let code=0;for(let l=1;l<=16;l++){code=(code<<1)|bit();if(t.maxcode[l]>=0&&code<=t.maxcode[l])return t.vals[t.valptr[l]+code-t.mincode[l]];}throw new Error('Huffman hatası');};
  const mask=P>=16?0xFFFF:(1<<P)-1,init=1<<(P-Pt-1),row=w*Nf;let mcu=0,fresh=true;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++,mcu++){
    if(Ri&&mcu>0&&mcu%Ri===0){bc=0;while(bp<b.length&&!(b[bp]===0xFF&&b[bp+1]>=0xD0&&b[bp+1]<=0xD7))bp++;bp+=2;fresh=true;}
    const first=fresh;fresh=false;
    for(let c=0;c<Nf;c++){
      const i=(y*w+x)*Nf+c;let pred;
      if(first)pred=init;
      else if(y===0||(Ri&&mcu%Ri<w))pred=x===0?init:out[i-Nf];
      else if(x===0)pred=out[i-row];
      else{
        const a=out[i-Nf],bq=out[i-row],cq=out[i-row-Nf];
        switch(Ss){case 1:pred=a;break;case 2:pred=bq;break;case 3:pred=cq;break;case 4:pred=a+bq-cq;break;case 5:pred=a+((bq-cq)>>1);break;case 6:pred=bq+((a-cq)>>1);break;case 7:pred=(a+bq)>>1;break;default:pred=0;}
      }
      const s=dec(tabs[c]);let diff=0;
      if(s===16)diff=32768;
      else if(s>0){let v=0;for(let k=0;k<s;k++)v=(v<<1)|bit();diff=v<(1<<(s-1))?v-(1<<s)+1:v;}
      out[i]=(pred+diff)&mask;
    }
  }
  if(Pt)for(let i=0;i<out.length;i++)out[i]<<=Pt;
  return {w,h,P,Nf,data:out};
}

/* ---------- Piksel kareleri ---------- */
function applyPal(idx,pal){
  const n=idx.length,o=new Uint8Array(n*3),L=pal.lr.length;
  for(let i=0;i<n;i++){let q=idx[i]-pal.first;q=q<0?0:q>=L?L-1:q;o[3*i]=pal.lr[q]>>pal.shift;o[3*i+1]=pal.lg[q]>>pal.shift;o[3*i+2]=pal.lb[q]>>pal.shift;}
  return o;
}
function nativeFrame(buf,off,info,le,planar){
  const {rows,cols,spp,bits,pr,photo}=info,n=rows*cols;
  if(spp===1){
    if(bits===8)return new Uint8Array(buf.slice(off,off+n));
    if(bits===32){
      const A=pr?Int32Array:Uint32Array,dv=new DataView(buf,off,n*4),a=new Float32Array(n);
      for(let i=0;i<n;i++)a[i]=pr?dv.getInt32(4*i,le):dv.getUint32(4*i,le);
      return a;
    }
    const A=pr?Int16Array:Uint16Array;
    if(le&&off%2===0)return new A(buf.slice(off,off+n*2));
    const a=new A(n),dv=new DataView(buf,off,n*2);
    for(let i=0;i<n;i++)a[i]=pr?dv.getInt16(2*i,le):dv.getUint16(2*i,le);
    return a;
  }
  const b=new Uint8Array(buf,off,n*3),o=new Uint8Array(n*3),ybr=photo.startsWith('YBR');
  for(let i=0;i<n;i++){
    let r=planar?b[i]:b[3*i],g=planar?b[n+i]:b[3*i+1],bl=planar?b[2*n+i]:b[3*i+2];
    if(ybr){const Y=r,cb=g-128,cr=bl-128;r=Y+1.402*cr;g=Y-0.344136*cb-0.714136*cr;bl=Y+1.772*cb;r=r<0?0:r>255?255:r;g=g<0?0:g>255?255:g;bl=bl<0?0:bl>255?255:bl;}
    o[3*i]=r;o[3*i+1]=g;o[3*i+2]=bl;
  }
  return o;
}
async function getFrames(c,info,ts,le){
  const {rows,cols,spp,bits,nf}=info,n=rows*cols;
  if(bits!==8&&bits!==16&&bits!==32)throw new Error('Desteklenmeyen piksel biti: '+bits);
  if(spp!==1&&!(spp===3&&bits===8))throw new Error('Desteklenmeyen örnek sayısı: '+spp);
  let frames=[];
  if(c.pixel){
    const per=n*spp*bits/8;
    for(let f=0;f<nf;f++){
      const off=c.pixel.start+f*per;
      if(off+per>c.buf.byteLength)break;
      frames.push(nativeFrame(c.buf,off,info,le,info.planar===1));
    }
    if(!frames.length)throw new Error('Piksel verisi eksik');
  }else{
    const fr=c.frags||[];
    if(!fr.length)throw new Error('Piksel verisi yok');
    const cat=(list)=>{let L=0;list.forEach(f=>L+=f.len);const o=new Uint8Array(L);let q=0;list.forEach(f=>{o.set(c.u8.subarray(f.start,f.start+f.len),q);q+=f.len;});return o;};
    const groups=nf===1?[fr]:(fr.length===nf?fr.map(f=>[f]):null);
    if(!groups)throw new Error('Çok kareli sıkıştırılmış veri desteklenmiyor');
    for(const g of groups){
      const bytes=cat(g);
      if(ts===TS.RLE){
        frames.push(nativeFrame(decodeRLE(bytes,n,bits/8,spp).buffer,0,info,true,true));
      }else if(ts===TS.JPB){
        if(bits!==8)throw new Error('12 bit JPEG desteklenmiyor');
        frames.push(await jpegDecode(bytes,spp===3));
      }else if(ts===TS.JPL||ts===TS.JPL1){
        const r=jpegLossless(bytes);
        if(r.w*r.h!==n)throw new Error('JPEG boyutu etiketle uyuşmuyor');
        if(r.Nf===1)frames.push(r.P<=8?Uint8Array.from(r.data):(info.pr?new Int16Array(r.data.buffer):r.data));
        else{const o=new Uint8Array(n*3);for(let i=0;i<n*3;i++)o[i]=r.data[i];frames.push(o);}
      }else throw new Error('Sıkıştırma desteklenmiyor: '+(TSNAME[ts]||ts)+'. Bu dosyayı sıkıştırılmamış (decompressed) dışa aktarın');
    }
  }
  if(info.pal)frames=frames.map(f=>applyPal(f,info.pal));
  return frames;
}

async function parseDicom(buf){
  const c={dv:new DataView(buf),u8:new Uint8Array(buf),le:true,dec:new TextDecoder('iso-8859-1'),pixel:null,frags:null,buf};
  const tags=new Map();let p=0,ts=TS.IMPL,explicit=false;
  const u8=c.u8,has=buf.byteLength>132&&u8[128]===68&&u8[129]===73&&u8[130]===67&&u8[131]===77;
  if(buf.byteLength<16)throw new Error('DICOM dosyası değil');
  const g0=c.dv.getUint16(0,true);
  if(has)p=132;
  if(has||g0===2){
    p=readElements(c,p,buf.byteLength,true,tags,2).pos;
    const t=tags.get(T.ts);ts=t&&t.v&&t.v[0]?t.v[0]:TS.EXPL;explicit=ts!==TS.IMPL;
  }else if(g0===8){explicit=u8[4]>=65&&u8[4]<=90&&u8[5]>=65&&u8[5]<=90;}
  else throw new Error('DICOM dosyası değil');
  if(ts===TS.DEFL){
    const rest=await inflate(buf.slice(p));
    c.buf=rest;c.dv=new DataView(rest);c.u8=new Uint8Array(rest);p=0;
  }
  c.le=ts!==TS.BE;
  readElements(c,p,c.buf.byteLength,explicit,tags);
  const num=(t,i=0,d)=>{const e=tags.get(t);if(!e||!e.v)return d;const x=Number(e.v[i]);return Number.isFinite(x)&&e.v[i]!==''?x:d;};
  const nums=(t)=>{const e=tags.get(t);if(!e||!e.v)return null;const a=e.v.map(Number);return a.every(Number.isFinite)?a:null;};
  const str=(t,d='')=>{const e=tags.get(t);return e&&e.v&&e.v[0]!=null?String(e.v[0]):d;};
  const info={rows:num(T.rows),cols:num(T.cols),spp:num(T.spp,0,1),bits:num(T.bits,0,16),pr:num(T.pr,0,0),nf:num(T.nf,0,1)||1,planar:num(T.planar,0,0),photo:str(T.photo,'MONOCHROME2')};
  if(!info.rows||!info.cols)throw new Error('Görüntü verisi içermiyor (RT yapı, rapor vb. olabilir)');
  if(info.photo==='PALETTE COLOR'){
    const d=tags.get(0x00281101),R=tags.get(0x00281201),G=tags.get(0x00281202),B=tags.get(0x00281203);
    if(d&&R&&G&&B)info.pal={first:d.v[1]|0,lr:R.v,lg:G.v,lb:B.v,shift:d.v[2]===16?8:0};
  }
  info.color=info.spp===3||!!info.pal;
  const frames=await getFrames(c,info,ts,c.le);
  const psTag=nums(T.ps)||nums(0x00181164)||nums(0x00182010),ps=psTag||[1,1];
  const vec=(t,n)=>{const a=nums(t);return a&&a.length>=n?a:null;};
  return {frames,info,tags,ts,slope:num(T.slope,0,1)||1,icpt:num(T.icpt,0,0),ps:[ps[0],ps[1]??ps[0]],psKnown:!!psTag,
    thick:num(T.sbs,0,num(T.thick,0,1))||1,ipp:vec(T.ipp,3),iop:vec(T.iop,6),inst:num(T.inst,0,0),snum:num(T.snum,0,0),suid:str(T.suid,'?'),forUid:str(T.for),
    wc:num(T.wc,0,null),ww:num(T.ww,0,null),mod:str(T.mod),desc:str(T.desc),units:str(T.units)};
}

/* Hafif mod: 384 pikselden büyük kesitleri 2x2 ortalamayla yarıya indirir */
function downsample2(m){
  const {rows,cols,color}=m.info;
  if(rows<384||cols<384)return false;
  const R=rows>>1,C=cols>>1,st=color?3:1;
  m.frames=m.frames.map(f=>{
    const o=new f.constructor(R*C*st);
    for(let y=0;y<R;y++)for(let x=0;x<C;x++)for(let c=0;c<st;c++){
      const i=((2*y)*cols+2*x)*st+c;
      o[(y*C+x)*st+c]=(f[i]+f[i+st]+f[i+cols*st]+f[i+cols*st+st])/4;
    }
    return o;
  });
  m.info.rows=R;m.info.cols=C;m.ps=[m.ps[0]*2,m.ps[1]*2];
  return true;
}

/* ---------- ZIP okuyucu (saklama ve deflate) ---------- */
function zipEntries(buf){
  const dv=new DataView(buf),u8=new Uint8Array(buf),td=new TextDecoder('utf-8');
  let e=buf.byteLength-22;
  while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;
  if(e<0)throw new Error('ZIP dosyası okunamadı');
  const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out=[];
  for(let i=0;i<n&&p+46<=buf.byteLength&&dv.getUint32(p,true)===0x02014b50;i++){
    const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lho=dv.getUint32(p+42,true);
    const name=td.decode(u8.subarray(p+46,p+46+nl));
    p+=46+nl+xl+cl;
    if(name.endsWith('/')||/(^|\/)(__MACOSX|\.DS_Store|DICOMDIR)/i.test(name))continue;
    out.push({name,read:async()=>{
      if(dv.getUint32(lho,true)!==0x04034b50)throw new Error('ZIP kaydı bozuk');
      const s=lho+30+dv.getUint16(lho+26,true)+dv.getUint16(lho+28,true),raw=u8.subarray(s,s+csize);
      if(method===0)return raw.slice().buffer;
      if(method===8)return await inflate(raw);
      throw new Error('ZIP sıkıştırma yöntemi desteklenmiyor');
    }});
  }
  return out;
}
