import { useState, useRef, useCallback, useEffect, memo } from "react";
import { savePreset, loadPresets, deletePreset } from "./firebase";

function toB64(f){return new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result);x.onerror=j;x.readAsDataURL(f)})}
function fmt(n){if(!n)return"";return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function isVid(m){return m?.type==="video"}

const DEF={name:"Expert Care Face & Body Lotion Bayi & Anak - Lotion Aman Bayi & Anak Kulit Sensitif dengan Colloidal Oatmeal (50g / 150g) | Lembapkan & Bantu Cegah Ruam",price:"103400",originalPrice:"139900",discount:"-26%",sold:"10RB+",rating:"4.9",ratingCount:"82,2RB",favCount:"95,5RB",shopName:"Expert Care Official",shopOnline:"3 menit lalu",shopRating:"4.9",shopProducts:"290",shopRatings:"1,1JT",shopJoined:"4 Tahun Lalu",garantee:"30 Mar",returnDays:"15 Hari",voucherAmt:"34.859",variants:"Lotion 50g & 150g, Lotion 50g, Lotion 150g",description:"Expert Care Face & Body Lotion dengan Colloidal Oatmeal & Multiple Ceramides.\nMelembapkan hingga 99%, cocok untuk kulit sensitif bayi dan anak.\n\nHypoallergenic · Dermatologically Tested · Halal\n\nKandungan:\n- Colloidal Oatmeal\n- Multiple Ceramides\n\nNetto: 50g / 150g"};

const Field = memo(function F({label,k,ph,area,value,onChange}){
  const st={width:"100%",padding:"7px 8px",border:"1px solid #ddd",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
  if(area) return (<div style={{marginBottom:8}}><label style={{fontSize:11,color:"#888",display:"block",marginBottom:3}}>{label}</label><textarea value={value} onChange={e=>onChange(k,e.target.value)} placeholder={ph} rows={3} style={{...st,resize:"vertical"}}/></div>);
  return (<div style={{marginBottom:8}}><label style={{fontSize:11,color:"#888",display:"block",marginBottom:3}}>{label}</label><input value={value} onChange={e=>onChange(k,e.target.value)} placeholder={ph} style={st}/></div>);
});

function Stars(){return (<span style={{display:"inline-flex",gap:1}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:"#ee4d2d",fontSize:12}}>★</span>)}</span>);}

// =================== MOBILE PDP ===================
const MobilePDP = memo(function MobilePDP({media,info,logo}){
  const[idx,setIdx]=useState(0);const[gal,setGal]=useState(false);const[galIdx,setGalIdx]=useState(0);const[showDesc,setShowDesc]=useState(false);const ts=useRef(null);
  useEffect(()=>{if(idx>=media.length&&media.length>0)setIdx(media.length-1)},[media.length]);
  const g=k=>info[k]||DEF[k];const cur=media[idx];const vars=(g("variants")).split(",").map(s=>s.trim()).filter(Boolean);
  const openGal=i=>{setGalIdx(i);setGal(true)};
  return (
    <div style={{width:375,background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 24px rgba(0,0,0,0.14)",fontFamily:"-apple-system,sans-serif",position:"relative"}}>
      <div style={{maxHeight:"85vh",overflowY:"auto",paddingBottom:56}}>
        <div style={{background:"#000",padding:"6px 16px",display:"flex",justifyContent:"space-between",color:"#fff",fontSize:12,fontWeight:600,position:"sticky",top:0,zIndex:20}}><span>17:30</span><div style={{display:"flex",gap:6,fontSize:11}}>▂▄▆█ WiFi 🔋76%</div></div>
        <div style={{position:"sticky",top:28,zIndex:15,padding:"8px 12px",display:"flex",justifyContent:"space-between"}}>
          <div style={{width:32,height:32,borderRadius:16,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16}}>←</div>
          <div style={{display:"flex",gap:8}}>{["🔍","🛒","⋮"].map((ic,i)=>(<div key={i} style={{width:32,height:32,borderRadius:16,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,position:"relative"}}>{ic}{i===1&&<span style={{position:"absolute",top:-2,right:-4,background:"#ee4d2d",color:"#fff",fontSize:8,borderRadius:8,padding:"0 4px",fontWeight:700}}>94</span>}</div>))}</div>
        </div>
        <div style={{marginTop:-48,width:"100%",aspectRatio:"1/1",background:"#000",overflow:"hidden",position:"relative"}} onTouchStart={e=>{if(!isVid(cur))ts.current=e.touches[0].clientX}} onTouchEnd={e=>{if(!ts.current)return;const d=ts.current-e.changedTouches[0].clientX;if(Math.abs(d)>40){if(d>0&&idx<media.length-1)setIdx(idx+1);if(d<0&&idx>0)setIdx(idx-1)}ts.current=null}}>
          {cur&&isVid(cur) ? <video key={"mv"+idx} src={cur.src} style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:5}} controls playsInline preload="auto"/> : cur ? <img src={cur.src} alt="" style={{width:"100%",height:"100%",objectFit:"contain",cursor:"pointer"}} onClick={()=>openGal(idx)}/> : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#555",fontSize:48}}>📷</div>}
          <div style={{position:"absolute",bottom:12,right:12,background:"rgba(0,0,0,0.6)",color:"#fff",borderRadius:10,padding:"3px 10px",fontSize:12,pointerEvents:"none"}}>{idx+1}/{media.length||1}</div>
          <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,pointerEvents:"none"}}>{media.map((_,i)=><div key={i} style={{width:i===idx?16:5,height:3,borderRadius:2,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"width 0.2s"}}/>)}</div>
        </div>
        {media.length>1&&<div style={{display:"flex",gap:6,padding:"10px 12px",overflowX:"auto"}}>{media.map((m,i)=>(<div key={i} style={{position:"relative",flexShrink:0,cursor:"pointer"}} onClick={()=>setIdx(i)}>{isVid(m)?<div style={{width:56,height:56,borderRadius:4,border:i===idx?"2px solid #ee4d2d":"2px solid transparent",overflow:"hidden",position:"relative"}}><video src={m.src} style={{width:"100%",height:"100%",objectFit:"cover"}} preload="metadata"/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)"}}><span style={{color:"#fff",fontSize:16}}>▶</span></div></div>:<img src={m.src} alt="" style={{width:56,height:56,objectFit:"cover",borderRadius:4,border:i===idx?"2px solid #ee4d2d":"2px solid transparent"}}/>}</div>))}</div>}
        <div style={{background:"linear-gradient(90deg,#fff0ed,#fff5f0)",padding:"8px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:10,color:"#ee4d2d",border:"1px solid #ee4d2d",padding:"0 3px",borderRadius:2,fontWeight:700}}>%</span><span style={{fontSize:11,color:"#ee4d2d"}}>Voucher Diskon Rp{g("voucherAmt")}</span></div><div style={{display:"flex",gap:3,alignItems:"center"}}><span style={{fontSize:10,color:"#999"}}>Berakhir Dalam</span>{["00","59","53"].map((t,i)=><span key={i} style={{background:"#222",color:"#fff",borderRadius:2,padding:"1px 4px",fontSize:10,fontWeight:700}}>{t}</span>)}</div></div>
        <div style={{padding:"10px 12px 4px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#ee4d2d",fontSize:22,fontWeight:700}}>Rp{fmt(g("price"))}</span><span style={{fontSize:12,color:"#ee4d2d"}}>🎫</span><span style={{color:"#999",fontSize:12,textDecoration:"line-through",marginLeft:4}}>Rp{fmt(g("originalPrice"))}</span><span style={{fontSize:11,color:"#ee4d2d",marginLeft:2}}>{g("discount")}</span><span style={{marginLeft:"auto",fontSize:12,color:"#555"}}>{g("sold")} Terjual</span><span style={{fontSize:18,color:"#ccc"}}>♡</span></div><div style={{fontSize:11,color:"#999",marginTop:2}}>Rp{fmt(g("price"))} x 1 bulan dengan SPayLater ›</div></div>
        <div style={{display:"flex",gap:6,padding:"6px 12px 10px",flexWrap:"wrap"}}>{[`Diskon Rp${g("voucherAmt")} Sisa 1 Jam`,"Hadiah Gratis","Cicilan Pasti 0%"].map((t,i)=><span key={i} style={{border:"1px solid #ee4d2d",color:"#ee4d2d",fontSize:10,padding:"2px 6px",borderRadius:2}}>{t}</span>)}</div>
        <div style={{padding:"10px 12px",borderTop:"1px solid #f0f0f0"}}><div style={{display:"flex",gap:5,alignItems:"start"}}><span style={{background:"#ee4d2d",color:"#fff",fontSize:9,padding:"2px 5px",borderRadius:2,fontWeight:700,flexShrink:0}}>Mall</span><span style={{background:"#ee4d2d",color:"#fff",fontSize:9,padding:"2px 5px",borderRadius:2,fontWeight:700,flexShrink:0}}>ORI</span><span style={{fontSize:14,color:"#222",lineHeight:1.5}}>{g("name")}</span></div></div>
        <div style={{padding:"0 12px 10px",display:"flex",alignItems:"center",gap:4}}><Stars/><span style={{fontSize:13,color:"#222",marginLeft:2}}>{g("rating")}</span><span style={{color:"#e0e0e0",margin:"0 6px"}}>|</span><span style={{fontSize:12,color:"#555"}}>{g("ratingCount")} Penilaian</span></div>
        <div style={{padding:"8px 12px",background:"#f7f7f7",display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:6,alignItems:"center"}}><span>🛡️</span><span style={{fontSize:12,color:"#555"}}>Deteksi Efek Samping Produk</span></div><span style={{color:"#999"}}>›</span></div>
        <div style={{padding:12,borderTop:"6px solid #f5f5f5"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:500}}>Variasi</span><span style={{color:"#999"}}>›</span></div><div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>{vars.map((v,i)=><div key={i} style={{border:i===0?"1px solid #ee4d2d":"1px solid #e0e0e0",borderRadius:4,padding:"6px 10px",fontSize:12,color:i===0?"#ee4d2d":"#555",cursor:"pointer"}}>{v}</div>)}</div></div>
        <div style={{padding:12,borderTop:"1px solid #f0f0f0"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,color:"#999"}}>Pengiriman</span><span>🚚</span></div><div style={{marginTop:6}}><div style={{fontSize:12}}>Ke <b>Jakarta</b> — <span style={{color:"#26aa99"}}>Gratis Ongkir</span></div><div style={{fontSize:11,color:"#555",marginTop:4,background:"#f8f8f8",padding:"6px 8px",borderRadius:4}}>Garansi tiba {g("garantee")}. Dapatkan Voucher s/d Rp10.000 jika terlambat.</div></div></div>
        <div style={{padding:"10px 12px",borderTop:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span>↩️</span><span style={{fontSize:12,color:"#555"}}>{g("returnDays")} Pengembalian</span><span style={{color:"#e0e0e0"}}>·</span><span style={{fontSize:12,color:"#555"}}>100% Original</span><span style={{color:"#e0e0e0"}}>·</span><span style={{fontSize:12,color:"#555"}}>COD-Cek...</span><span style={{marginLeft:"auto",color:"#999"}}>›</span></div>
        <div style={{padding:12,borderTop:"8px solid #f5f5f5",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:44,height:44,borderRadius:22,overflow:"hidden",border:"1px solid #eee",flexShrink:0}}>{logo?<img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏪</div>}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600}}>{g("shopName")}</div><div style={{fontSize:11,color:"#999",marginTop:2}}>Online {g("shopOnline")}</div><div style={{display:"flex",gap:10,marginTop:3}}><span style={{fontSize:10,color:"#555"}}>⭐ {g("shopRating")} Penilaian</span><span style={{fontSize:10,color:"#555"}}>📦 {g("shopProducts")} Produk</span></div></div>
          <button style={{border:"1px solid #ee4d2d",color:"#ee4d2d",background:"transparent",borderRadius:4,padding:"6px 14px",fontSize:12,cursor:"pointer"}}>Kunjungi</button>
        </div>
        <div style={{padding:12,borderTop:"8px solid #f5f5f5"}}><div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Garansi Shopee</div><div style={{display:"flex",gap:20}}>{[{ic:"✅",l:"100% Ori"},{ic:"📦",l:"Gratis Ongkir"},{ic:"↩️",l:`${g("returnDays")} Return`}].map((x,i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:20}}>{x.ic}</div><div style={{fontSize:10,color:"#555",marginTop:4}}>{x.l}</div></div>)}</div></div>
        <div style={{padding:12,borderTop:"1px solid #f0f0f0"}}><div style={{background:"linear-gradient(90deg,#fff8e1,#fff3cd)",borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>🏆</span><div><div style={{fontSize:13,fontWeight:600}}>No.1 Terlaris</div><div style={{fontSize:11,color:"#888"}}>di kategori Baby Lotion & Cream</div></div></div></div>
        <div style={{padding:12,borderTop:"8px solid #f5f5f5"}}><div style={{display:"flex",justifyContent:"space-between",cursor:"pointer"}} onClick={()=>setShowDesc(!showDesc)}><span style={{fontSize:13,fontWeight:600}}>Deskripsi Produk</span><span style={{color:"#999",transform:showDesc?"rotate(180deg)":"none",transition:"0.2s"}}>▼</span></div>{showDesc&&<div style={{marginTop:10,fontSize:12,color:"#555",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{g("description")}</div>}</div>
        <div style={{padding:12,borderTop:"8px solid #f5f5f5"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>Penilaian Produk</span><span style={{fontSize:12,color:"#ee4d2d"}}>Lihat Semua ›</span></div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}><span style={{fontSize:20,color:"#ee4d2d",fontWeight:700}}>{g("rating")}</span><span style={{color:"#999"}}>/ 5.0</span><Stars/></div>{[{u:"r***a",d:"2 hari lalu | Variasi: 50g",t:"Produknya bagus, cocok buat kulit sensitif anak saya!"},{u:"m***n",d:"5 hari lalu | Variasi: 150g",t:"Kulit anak jadi lembap, gak iritasi. Recommended!"}].map((rv,i)=><div key={i} style={{marginTop:10,borderTop:"1px solid #f5f5f5",paddingTop:10}}><div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{width:28,height:28,borderRadius:14,background:"#e0e0e0"}}/><div><div style={{fontSize:12}}>{rv.u}</div><div style={{fontSize:10,color:"#999"}}>{rv.d}</div></div></div><div style={{marginTop:4}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:"#ffc107",fontSize:11}}>★</span>)}</div><div style={{fontSize:12,color:"#555",marginTop:4}}>{rv.t}</div></div>)}</div>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,borderTop:"1px solid #eee",display:"flex",background:"#fff",zIndex:30}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6px 14px",borderRight:"1px solid #f0f0f0"}}><span style={{fontSize:16}}>💬</span><span style={{fontSize:9,color:"#555"}}>Chat</span></div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6px 14px",borderRight:"1px solid #f0f0f0"}}><span style={{fontSize:16}}>🛒</span><span style={{fontSize:9,color:"#555"}}>Keranjang</span></div>
        <button style={{flex:1,background:"#ee4d2d",border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",padding:"8px 0",lineHeight:1.4}}>Beli Dengan Voucher<br/><span style={{fontSize:11}}>Rp{fmt(g("price"))}</span></button>
      </div>
      {gal&&<div style={{position:"fixed",inset:0,background:"#000",zIndex:200,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:22,cursor:"pointer"}} onClick={()=>setGal(false)}>←</span><span style={{color:"#fff",fontSize:14}}>{galIdx+1}/{media.length}</span><div style={{display:"flex",gap:10}}><span style={{color:"#fff",fontSize:16}}>🔍</span><span style={{color:"#fff",fontSize:16,position:"relative"}}>🛒<span style={{position:"absolute",top:-4,right:-8,background:"#ee4d2d",color:"#fff",fontSize:8,borderRadius:8,padding:"0 3px",fontWeight:700}}>94</span></span><span style={{color:"#fff",fontSize:14}}>⋮</span></div></div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}} onTouchStart={e=>{ts.current=e.touches[0].clientX}} onTouchEnd={e=>{if(!ts.current)return;const d=ts.current-e.changedTouches[0].clientX;if(Math.abs(d)>40){if(d>0&&galIdx<media.length-1)setGalIdx(galIdx+1);if(d<0&&galIdx>0)setGalIdx(galIdx-1)}ts.current=null}}>
          {media[galIdx]&&isVid(media[galIdx]) ? <video key={"gv"+galIdx} src={media[galIdx].src} style={{maxWidth:"100%",maxHeight:"100%"}} controls playsInline autoPlay preload="auto"/> : media[galIdx] ? <img src={media[galIdx].src} alt="" style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/> : null}
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:4,padding:"6px 0"}}>{media.map((_,i)=><div key={i} onClick={()=>setGalIdx(i)} style={{width:i===galIdx?20:6,height:3,borderRadius:2,background:i===galIdx?"#fff":"rgba(255,255,255,0.4)",transition:"0.2s",cursor:"pointer"}}/>)}</div>
        <div style={{padding:"8px 12px 20px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,background:"#1a1a1a",borderRadius:8,padding:8}}>{media[0]&&(isVid(media[0])?<video src={media[0].src} style={{width:40,height:40,objectFit:"cover",borderRadius:4}} preload="metadata"/>:<img src={media[0].src} alt="" style={{width:40,height:40,objectFit:"cover",borderRadius:4}}/>)}<div style={{flex:1,minWidth:0}}><div style={{color:"#ee4d2d",fontSize:13,fontWeight:700}}>Rp{fmt(g("price"))} 🎫</div><div style={{color:"#aaa",fontSize:11,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{g("name").slice(0,32)}...</div></div><div style={{display:"flex",gap:6}}><div style={{width:30,height:30,borderRadius:4,background:"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🛒</div><div style={{background:"#ee4d2d",borderRadius:4,padding:"6px 12px"}}><span style={{color:"#fff",fontSize:11,fontWeight:600}}>Beli Sekarang</span></div></div></div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>{logo?<img src={logo} alt="" style={{width:30,height:30,borderRadius:15,objectFit:"cover",border:"1px solid #333"}}/>:<div style={{width:30,height:30,borderRadius:15,background:"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🏪</div>}<span style={{color:"#ee4d2d",fontSize:8}}>Toko ›</span></div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}><div style={{width:30,height:30,borderRadius:15,background:"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>↗</div><span style={{color:"#999",fontSize:8}}>Bagikan</span></div>
        </div>
      </div>}
    </div>
  );
});

// =================== DESKTOP PDP ===================
const DesktopPDP = memo(function DesktopPDP({media,info,logo}){
  const[idx,setIdx]=useState(0);const[zoom,setZoom]=useState(null);const g=k=>info[k]||DEF[k];const cur=media[idx];const vars=(g("variants")).split(",").map(s=>s.trim()).filter(Boolean);
  useEffect(()=>{if(idx>=media.length&&media.length>0)setIdx(media.length-1)},[media.length]);
  return (
    <div style={{width:1000,background:"#fff",borderRadius:8,overflow:"hidden",boxShadow:"0 1px 12px rgba(0,0,0,0.08)",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(180deg,#f53d2d,#f63)"}}>
        <div style={{padding:"8px 20px",display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.85)"}}><div style={{display:"flex",gap:12}}>Seller Centre | Mulai Berjualan | Download</div><div style={{display:"flex",gap:12}}>🔔 Notifikasi | ❓ Bantuan | Daftar | Log In</div></div>
        <div style={{padding:"10px 20px 14px",display:"flex",alignItems:"center",gap:16}}><div style={{color:"#fff",fontSize:22,fontWeight:700}}><span style={{fontSize:28}}>S</span>hopee</div><div style={{flex:1,position:"relative"}}><input readOnly style={{width:"100%",padding:"10px 16px",borderRadius:4,border:"none",fontSize:14,outline:"none",background:"#fff"}} placeholder="Cari di Shopee"/><div style={{position:"absolute",right:0,top:0,bottom:0,background:"#fb5533",width:60,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"0 4px 4px 0"}}><span style={{fontSize:18}}>🔍</span></div></div><span style={{color:"#fff",fontSize:24}}>🛒</span></div>
      </div>
      <div style={{padding:"12px 20px",fontSize:13,color:"#999",borderBottom:"1px solid #f0f0f0"}}><span style={{color:"#05a"}}>Shopee</span> › <span style={{color:"#05a"}}>Ibu & Bayi</span> › <span style={{color:"#05a"}}>Baby Lotion & Cream</span> › <span style={{color:"#555"}}>{g("name").slice(0,50)}...</span></div>
      <div style={{display:"flex",padding:20,gap:24}}>
        <div style={{width:420,flexShrink:0}}>
          <div style={{width:"100%",aspectRatio:"1/1",background:"#fafafa",borderRadius:4,overflow:"hidden",position:"relative",cursor:isVid(cur)?"default":"crosshair"}} onMouseMove={e=>{if(isVid(cur))return;const r=e.currentTarget.getBoundingClientRect();setZoom({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100})}} onMouseLeave={()=>setZoom(null)}>
            {cur&&isVid(cur) ? <video key={"dv"+idx} src={cur.src} style={{width:"100%",height:"100%",objectFit:"contain",position:"relative",zIndex:5}} controls preload="auto"/> : cur ? <img src={cur.src} alt="" style={{width:"100%",height:"100%",objectFit:"contain",transformOrigin:zoom?`${zoom.x}% ${zoom.y}%`:"center",transform:zoom?"scale(2)":"scale(1)",transition:zoom?"none":"transform 0.15s"}}/> : <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#ccc",fontSize:64}}>📷</div>}
            {cur&&isVid(cur)&&<div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,0.6)",color:"#fff",borderRadius:4,padding:"2px 8px",fontSize:11}}>▶ 00:20</div>}
          </div>
          <div style={{display:"flex",gap:8,marginTop:12,overflowX:"auto"}}>{media.map((m,i)=><div key={i} style={{position:"relative",flexShrink:0}}><img src={m.src} alt="" onMouseEnter={()=>setIdx(i)} onClick={()=>setIdx(i)} style={{width:72,height:72,objectFit:"cover",borderRadius:2,border:i===idx?"2px solid #ee4d2d":"2px solid #e0e0e0",cursor:"pointer"}}/>{isVid(m)&&<div style={{position:"absolute",bottom:4,left:4,background:"rgba(0,0,0,0.6)",color:"#fff",borderRadius:2,padding:"1px 4px",fontSize:10}}>▶ 00:20</div>}</div>)}</div>
          <div style={{display:"flex",gap:12,marginTop:16,alignItems:"center"}}><span style={{fontSize:13,color:"#999"}}>Share:</span>{["💬","📘","📌","𝕏"].map((ic,i)=><span key={i} style={{fontSize:18,cursor:"pointer"}}>{ic}</span>)}<span style={{marginLeft:"auto",fontSize:13,color:"#999"}}>♡ Favorit ({g("favCount")})</span></div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",gap:8,alignItems:"start"}}><span style={{background:"#ee4d2d",color:"#fff",fontSize:11,padding:"3px 8px",borderRadius:2,fontWeight:600,flexShrink:0,marginTop:3}}>Mall</span><h1 style={{fontSize:20,fontWeight:400,lineHeight:1.4,color:"#222",margin:0}}>{g("name")}</h1></div>
          <div style={{display:"flex",alignItems:"center",gap:20,marginTop:12,paddingBottom:12,borderBottom:"1px solid #f0f0f0"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#ee4d2d",textDecoration:"underline",fontSize:15}}>{g("rating")}</span><Stars/></div><span style={{color:"#ccc"}}>|</span><span style={{fontSize:14,color:"#555"}}><u>{g("ratingCount")}</u> Penilaian</span><span style={{color:"#ccc"}}>|</span><span style={{fontSize:14,color:"#555"}}>{g("sold")} Terjual</span></div>
          <div style={{background:"linear-gradient(90deg,#ee4d2d,#ff6633)",padding:"10px 16px",marginTop:16,borderRadius:"4px 4px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:"#fff",fontWeight:700,fontSize:16,letterSpacing:2}}>⚡ FLASH SALE</span><div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{color:"#ffddcc",fontSize:12}}>BERAKHIR DALAM</span>{["00","29","45"].map((t,i)=><span key={i} style={{background:"#111",color:"#fff",borderRadius:3,padding:"3px 6px",fontSize:13,fontWeight:700}}>{t}</span>)}</div></div>
          <div style={{background:"#fafafa",padding:16,borderRadius:"0 0 4px 4px"}}><div style={{display:"flex",alignItems:"baseline",gap:10}}><span style={{color:"#ee4d2d",fontSize:30,fontWeight:500}}>Rp{fmt(g("price"))}</span><span style={{color:"#999",fontSize:16,textDecoration:"line-through"}}>Rp{fmt(g("originalPrice"))}</span><span style={{color:"#ee4d2d",fontSize:13,background:"#ffeee8",padding:"2px 6px",borderRadius:2,fontWeight:500}}>{g("discount")}</span></div></div>
          <div style={{padding:"14px 0",borderBottom:"1px solid #f0f0f0"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,color:"#999",width:100}}>Voucher Toko</span>{["POTONGAN 5%","POTONGAN 3%","POTONGAN Rp7RB"].map((v,i)=><span key={i} style={{border:"1px solid #ee4d2d",color:"#ee4d2d",fontSize:12,padding:"3px 8px",borderRadius:2,cursor:"pointer"}}>{v}</span>)}</div></div>
          <div style={{padding:"14px 0",borderBottom:"1px solid #f0f0f0",display:"flex",gap:8}}><span style={{fontSize:13,color:"#999",width:100,flexShrink:0}}>Pengiriman</span><div><div style={{display:"flex",gap:6,alignItems:"center"}}>🚚 <span style={{color:"#26aa99",fontSize:13}}>Gratis Ongkir</span></div><div style={{fontSize:13,color:"#222",marginTop:4}}>Garansi tiba {g("garantee")}</div></div></div>
          <div style={{padding:"14px 0",borderBottom:"1px solid #f0f0f0",display:"flex",gap:8}}><span style={{fontSize:13,color:"#999",width:100,flexShrink:0}}>Variasi</span><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{vars.map((v,i)=><div key={i} style={{border:i===0?"1px solid #ee4d2d":"1px solid #e0e0e0",borderRadius:2,padding:"8px 12px",fontSize:13,color:i===0?"#ee4d2d":"#555",cursor:"pointer"}}>{v}</div>)}</div></div>
          <div style={{padding:"16px 0",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:13,color:"#999",width:100}}>Jumlah</span><div style={{display:"flex",border:"1px solid #ccc",borderRadius:2}}><button style={{width:32,height:32,border:"none",background:"#fff",cursor:"pointer",fontSize:16}}>−</button><div style={{width:40,height:32,display:"flex",alignItems:"center",justifyContent:"center",borderLeft:"1px solid #ccc",borderRight:"1px solid #ccc",fontSize:14}}>1</div><button style={{width:32,height:32,border:"none",background:"#fff",cursor:"pointer",fontSize:16}}>+</button></div></div>
          <div style={{display:"flex",gap:12,marginTop:8}}><button style={{flex:1,padding:12,border:"1px solid #ee4d2d",background:"rgba(238,77,45,0.1)",color:"#ee4d2d",borderRadius:2,fontSize:14,cursor:"pointer",fontWeight:500}}>🛒 Masukkan Keranjang</button><button style={{flex:1,padding:12,border:"none",background:"#ee4d2d",color:"#fff",borderRadius:2,fontSize:14,cursor:"pointer",fontWeight:500}}>Beli Sekarang</button></div>
          <div style={{display:"flex",gap:20,marginTop:16,padding:"14px 0",borderTop:"1px solid #f0f0f0"}}>{[{ic:"✅",t:"100% Original"},{ic:"↩️",t:`${g("returnDays")} Pengembalian`},{ic:"📦",t:"Gratis Ongkir"}].map((gg,i)=><div key={i} style={{display:"flex",gap:6,alignItems:"center"}}><span>{gg.ic}</span><span style={{fontSize:13,color:"#555"}}>{gg.t}</span></div>)}</div>
        </div>
      </div>
      <div style={{margin:"0 20px",padding:"20px 0",borderTop:"8px solid #f5f5f5",display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:56,height:56,borderRadius:28,overflow:"hidden",border:"2px solid #eee",flexShrink:0}}>{logo?<img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🏪</div>}</div>
        <div style={{flex:1}}><div style={{fontSize:15,fontWeight:600}}>{g("shopName")}</div><div style={{fontSize:12,color:"#999",marginTop:3}}>Online {g("shopOnline")}</div></div>
        <button style={{border:"1px solid #ee4d2d",color:"#ee4d2d",background:"rgba(238,77,45,0.05)",borderRadius:4,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>💬 Chat Sekarang</button><button style={{border:"1px solid #999",color:"#555",background:"#fff",borderRadius:4,padding:"8px 20px",fontSize:13,cursor:"pointer"}}>🏪 Kunjungi Toko</button>
        <div style={{display:"flex",gap:24,marginLeft:8}}>{[{l:"Penilaian",v:g("shopRatings")},{l:"Produk",v:g("shopProducts")},{l:"Bergabung",v:g("shopJoined")}].map((s,i)=><div key={i} style={{textAlign:"center"}}><div style={{fontSize:13,color:"#ee4d2d"}}>{s.v}</div><div style={{fontSize:11,color:"#999",marginTop:2}}>{s.l}</div></div>)}</div>
      </div>
      <div style={{margin:"0 20px",padding:"20px 0",borderTop:"8px solid #f5f5f5"}}><h2 style={{fontSize:16,fontWeight:400,margin:"0 0 16px",textTransform:"uppercase",letterSpacing:0.5}}>DESKRIPSI PRODUK</h2><div style={{fontSize:14,color:"#555",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{g("description")}</div></div>
    </div>
  );
});

// =================== SEARCH CARD ===================
function SearchCard({card,style:cStyle,mobile}){
  const trunc=(s,n)=>s&&s.length>n?s.slice(0,n)+"...":s;
  return (
    <div style={{background:"#fff",borderRadius:mobile?0:4,overflow:"hidden",boxShadow:mobile?"none":"0 1px 4px rgba(0,0,0,0.06)",...cStyle}}>
      <div style={{width:"100%",aspectRatio:"1/1",background:"#f5f5f5",overflow:"hidden"}}>{card.image?<img src={card.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",color:"#ccc",fontSize:32}}>📷</div>}</div>
      <div style={{padding:mobile?"8px 6px":"10px 8px"}}>
        <div style={{display:"flex",gap:4,alignItems:"start",marginBottom:4}}>
          <span style={{background:"#ee4d2d",color:"#fff",fontSize:8,padding:"1px 4px",borderRadius:2,fontWeight:700,flexShrink:0}}>Mall</span>
          <span style={{background:"#ee4d2d",color:"#fff",fontSize:8,padding:"1px 4px",borderRadius:2,fontWeight:700,flexShrink:0}}>ORI</span>
          <span style={{fontSize:mobile?12:13,color:"#222",lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{trunc(card.name||"Nama Produk",60)}</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:4}}>
          <span style={{color:"#ee4d2d",fontSize:mobile?15:16,fontWeight:600}}>Rp{fmt(card.price||"0")}</span>
          {card.originalPrice&&<span style={{color:"#b0b0b0",fontSize:10,textDecoration:"line-through"}}>Rp{fmt(card.originalPrice)}</span>}
          {card.discount&&<span style={{color:"#ee4d2d",fontSize:10}}>{card.discount}</span>}
        </div>
        {card.badges&&card.badges.length>0&&<div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>{card.badges.map((b,i)=><span key={i} style={{border:"1px solid #ee4d2d",color:"#ee4d2d",fontSize:9,padding:"1px 4px",borderRadius:2}}>{b}</span>)}</div>}
        <div style={{display:"flex",alignItems:"center",gap:4,marginTop:6}}>
          <span style={{color:"#ee4d2d",fontSize:11}}>★</span><span style={{fontSize:11,color:"#222"}}>{card.rating||"4.9"}</span>
          <span style={{color:"#999",fontSize:10,marginLeft:2}}>{card.sold||"10RB+"} terjual</span>
          {mobile&&<span style={{fontSize:10,color:"#999",marginLeft:"auto",background:"#f5f5f5",padding:"1px 4px",borderRadius:2}}>COD</span>}
        </div>
        <div style={{fontSize:10,color:"#999",marginTop:4}}>📍 {card.location||"Jakarta"}</div>
      </div>
    </div>
  );
}

// =================== MOBILE SEARCH ===================
function MobileSearch({cards}){
  return (
    <div style={{width:375,background:"#f5f5f5",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 24px rgba(0,0,0,0.14)",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{background:"#000",padding:"6px 16px",display:"flex",justifyContent:"space-between",color:"#fff",fontSize:12,fontWeight:600,position:"sticky",top:0,zIndex:20}}><span>19:07</span><div style={{display:"flex",gap:6,fontSize:11}}>▂▄▆█ WiFi 🔋96%</div></div>
        <div style={{background:"#fff",padding:"8px 12px",display:"flex",alignItems:"center",gap:10,position:"sticky",top:28,zIndex:15}}>
          <span style={{fontSize:18,color:"#555"}}>←</span>
          <div style={{flex:1,border:"1px solid #e0e0e0",borderRadius:4,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14,color:"#999"}}>📷</span><span style={{fontSize:14,color:"#222"}}>Lotion bayi</span></div>
          <span style={{fontSize:16,color:"#555"}}>⇅</span>
        </div>
        <div style={{background:"#fff",padding:"8px 12px 8px",display:"flex",gap:8,overflowX:"auto",borderBottom:"1px solid #f0f0f0"}}>
          {["Instant","Mall","Star","SPayLater 0%","P..."].map((f,i)=><div key={i} style={{padding:"6px 14px",borderRadius:20,background:i===0?"#f5f5f5":"#fff",border:"1px solid #e0e0e0",fontSize:12,color:"#555",flexShrink:0,whiteSpace:"nowrap"}}>{f}</div>)}
          <div style={{display:"flex",alignItems:"center",gap:2,color:"#ee4d2d",fontSize:12,flexShrink:0,padding:"6px 8px"}}><span>⇅</span> Filter</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:0,padding:0}}>
          {cards.map((c,i)=><SearchCard key={i} card={c} mobile style={{width:"50%",borderBottom:"8px solid #f5f5f5",borderRight:i%2===0?"4px solid #f5f5f5":"none"}}/>)}
        </div>
      </div>
    </div>
  );
}

// =================== DESKTOP SEARCH ===================
function DesktopSearch({cards}){
  return (
    <div style={{width:1200,background:"#f5f5f5",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{background:"linear-gradient(180deg,#f53d2d,#f63)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"4px 24px"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,0.85)",padding:"0 0 6px"}}><div>Seller Centre | Mulai Berjualan | Download | Ikuti kami di 📘📸💬</div><div>🔔 Notifikasi | ❓ Bantuan | 🌐 Bahasa Indonesia ▾ | Daftar | Log In</div></div>
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"6px 0 10px"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{color:"#fff",fontSize:28,fontWeight:700}}>🛒</span><span style={{color:"#fff",fontSize:24,fontWeight:700}}>Shopee</span></div><div style={{flex:1,position:"relative"}}><input readOnly style={{width:"100%",padding:"10px 60px 10px 14px",borderRadius:4,border:"none",fontSize:13,outline:"none",boxSizing:"border-box"}} placeholder="lotion bayi"/><button style={{position:"absolute",right:0,top:0,bottom:0,width:56,background:"#fb5533",border:"none",borderRadius:"0 4px 4px 0",cursor:"pointer"}}><span style={{fontSize:16}}>🔍</span></button></div><span style={{color:"#fff",fontSize:26}}>🛒</span></div></div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"16px 24px",display:"flex",gap:20}}>
        <div style={{width:200,flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>🔽 FILTER</div>
          {["Lokasi","Tipe Penjual","Metode Pembayaran","Opsi Pengiriman"].map((f,i)=>(
            <div key={i} style={{marginBottom:16}}><div style={{fontSize:13,fontWeight:500,color:"#222",marginBottom:8}}>{f}</div>{["Jabodetabek","DKI Jakarta","Jawa Barat","Jawa Timur"].slice(0,i===0?4:3).map((o,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><div style={{width:14,height:14,border:"1px solid #ccc",borderRadius:2}}/><span style={{fontSize:12,color:"#555"}}>{i===0?o:i===1?["Dikelola Shopee","Mall","Star+"][j]:i===2?["COD","SPayLater"][j]:["Instant","Hemat"][j]}</span></div>)}{i===0&&<span style={{fontSize:12,color:"#05a",cursor:"pointer"}}>Lainnya ▾</span>}</div>
          ))}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,color:"#555",marginBottom:12}}>Hasil pencarian untuk '<span style={{color:"#ee4d2d"}}>lotion bayi</span>'</div>
          <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
            <span style={{fontSize:13,color:"#555"}}>Urutkan</span>
            {["Terkait","Terbaru","Terlaris"].map((s,i)=><div key={i} style={{padding:"6px 16px",borderRadius:2,background:i===0?"#ee4d2d":"#fff",color:i===0?"#fff":"#555",fontSize:13,cursor:"pointer",border:i===0?"none":"1px solid #e0e0e0"}}>{s}</div>)}
            <div style={{padding:"6px 16px",borderRadius:2,background:"#fff",border:"1px solid #e0e0e0",fontSize:13,color:"#555"}}>Harga ▾</div>
            <span style={{marginLeft:"auto",fontSize:13,color:"#555"}}>1/14</span>
            <span style={{cursor:"pointer",color:"#ccc"}}>‹</span><span style={{cursor:"pointer",color:"#ee4d2d"}}>›</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            {cards.map((c,i)=><SearchCard key={i} card={c}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================== MAIN APP ===================
export default function App(){
  const[mode,setMode]=useState("pdp-mobile");
  const[media,setMedia]=useState([]);const[logo,setLogo]=useState(null);const[info,setInfo]=useState({});
  const[cards,setCards]=useState([]);const[editCard,setEditCard]=useState(null);
  const[presets,setPresets]=useState([]);const[loading,setLoading]=useState(true);const[tab,setTab]=useState("upload");const[drag,setDrag]=useState(false);const[activePre,setActivePre]=useState(null);
  const[fullscreen,setFullscreen]=useState(false);const[saving,setSaving]=useState(false);
  const fRef=useRef();const lRef=useRef();const cRef=useRef();

  const isSearch=mode.startsWith("search");

  useEffect(()=>{(async()=>{try{const p=await loadPresets();setPresets(p)}catch(e){console.error(e)}setLoading(false)})()},[]);

  const addFiles=useCallback(async files=>{
    const items=[];for(const f of files){const b=await toB64(f);if(f.type.startsWith("video/"))items.push({type:"video",src:b,name:f.name});else if(f.type.startsWith("image/"))items.push({type:"image",src:b,name:f.name})}
    setMedia(p=>[...p,...items]);
  },[]);

  const addCards=useCallback(async files=>{
    const items=[];for(const f of files){if(f.type.startsWith("image/")){const b=await toB64(f);items.push({id:Date.now()+Math.random(),image:b,name:"Nama Produk",price:"99000",originalPrice:"139000",discount:"-29%",rating:"4.9",sold:"10RB+",location:"Jakarta",badges:["Pilih Lokal","Hadiah Gratis"]})}}
    setCards(p=>[...p,...items]);
  },[]);

  const drop=useCallback(e=>{e.preventDefault();setDrag(false);if(isSearch)addCards(e.dataTransfer.files);else addFiles(e.dataTransfer.files)},[addFiles,addCards,isSearch]);
  const rm=i=>setMedia(p=>p.filter((_,j)=>j!==i));
  const mv=(i,d)=>setMedia(p=>{const n=[...p];const s=i+d;if(s<0||s>=n.length)return n;[n[i],n[s]]=[n[s],n[i]];return n});
  const upd=useCallback((k,v)=>setInfo(p=>({...p,[k]:v})),[]);
  const updCard=useCallback((id,k,v)=>setCards(p=>p.map(c=>c.id===id?{...c,[k]:v}:c)),[]);
  const rmCard=id=>{setCards(p=>p.filter(c=>c.id!==id));if(editCard===id)setEditCard(null)};

  const savePre=async()=>{
    setSaving(true);
    try{
      const p={id:Date.now(),name:`${(info.name||DEF.name).slice(0,30)} — ${new Date().toLocaleDateString("id-ID")}`,media,info,logo,cards,mode,ts:new Date().toISOString()};
      await savePreset(p);
      setPresets(prev=>[p,...prev]);setActivePre(p.id);
    }catch(e){alert("Gagal save: "+e.message)}
    setSaving(false);
  };
  const loadPre=p=>{setMedia(p.media||[]);setInfo(p.info||{});setLogo(p.logo||null);setCards(p.cards||[]);if(p.mode)setMode(p.mode);setActivePre(p.id);setTab("upload")};
  const delPre=async id=>{try{await deletePreset(id);setPresets(p=>p.filter(x=>x.id!==id))}catch(e){alert("Gagal hapus: "+e.message)}};

  const fields=[
    {label:"Nama Produk",k:"name",ph:DEF.name.slice(0,50)+"..."},{label:"Harga",k:"price",ph:"103400",half:true},{label:"Harga Asli",k:"originalPrice",ph:"139900",half:true},
    {label:"Diskon",k:"discount",ph:"-26%",half:true},{label:"Terjual",k:"sold",ph:"10RB+",half:true},{label:"Nama Toko",k:"shopName",ph:"Expert Care Official"},
    {label:"Rating",k:"rating",ph:"4.9",half:true},{label:"Jml Rating",k:"ratingCount",ph:"82,2RB",half:true},{label:"Garansi Tiba",k:"garantee",ph:"30 Mar"},
    {label:"Variasi (koma)",k:"variants",ph:"Lotion 50g, Lotion 150g"},{label:"Deskripsi",k:"description",ph:"Deskripsi produk...",area:true}
  ];

  const renderFields=(list,vals,onChg)=>{const rows=[];let i=0;while(i<list.length){const f=list[i];if(f.half&&i+1<list.length&&list[i+1].half){const f2=list[i+1];rows.push(<div key={f.k} style={{display:"flex",gap:6}}><div style={{flex:1}}><Field label={f.label} k={f.k} ph={f.ph} value={vals[f.k]??""} onChange={onChg}/></div><div style={{flex:1}}><Field label={f2.label} k={f2.k} ph={f2.ph} value={vals[f2.k]??""} onChange={onChg}/></div></div>);i+=2}else{rows.push(<Field key={f.k} label={f.label} k={f.k} ph={f.ph} area={f.area} value={vals[f.k]??""} onChange={onChg}/>);i++}}return rows};

  const Preview=()=>{
    if(mode==="pdp-mobile") return (<MobilePDP media={media} info={info} logo={logo}/>);
    if(mode==="pdp-desktop") return (<DesktopPDP media={media} info={info} logo={logo}/>);
    if(mode==="search-mobile") return (<MobileSearch cards={cards}/>);
    return (<DesktopSearch cards={cards}/>);
  };

  const isMobView=mode.includes("mobile");
  const isDeskView=mode.includes("desktop");

  if(fullscreen) return (
    <div style={{position:"fixed",inset:0,background:isSearch&&isDeskView?"#f5f5f5":"#e8eaed",zIndex:9999,overflow:"auto",display:"flex",justifyContent:"center",alignItems:isMobView?"center":"flex-start",padding:isMobView?0:20}}>
      <button onClick={()=>setFullscreen(false)} style={{position:"fixed",top:12,right:12,zIndex:10000,background:"rgba(0,0,0,0.7)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,cursor:"pointer",fontWeight:600}}>✕ Exit Fullscreen</button>
      <div style={{transform:isDeskView?"scale(0.8)":"none",transformOrigin:"top center"}}><Preview/></div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#f0f2f5",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #e0e0e0",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div><div style={{fontSize:17,fontWeight:700,color:"#222"}}>🛍️ Shopee PDP Preview Tool</div><div style={{fontSize:11,color:"#999",marginTop:1}}>Preview tampilan PDP & Search Shopee</div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",gap:4,background:"#f5f5f5",borderRadius:8,padding:3}}>
            {[{k:"pdp-mobile",l:"📱 PDP"},{k:"pdp-desktop",l:"💻 PDP"},{k:"search-mobile",l:"📱 Search"},{k:"search-desktop",l:"💻 Search"}].map(v=>(
              <button key={v.k} onClick={()=>{setMode(v.k);setEditCard(null)}} style={{padding:"6px 12px",border:"none",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600,background:mode===v.k?"#ee4d2d":"transparent",color:mode===v.k?"#fff":"#666"}}>{v.l}</button>
            ))}
          </div>
          <button onClick={()=>setFullscreen(true)} style={{padding:"6px 12px",border:"1px solid #ddd",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600,background:"#fff",color:"#555"}}>⛶ Fullscreen</button>
        </div>
      </div>
      <div style={{display:"flex",minHeight:"calc(100vh - 56px)"}}>
        <div style={{width:320,background:"#fff",borderRight:"1px solid #e8e8e8",overflowY:"auto",flexShrink:0}}>
          <div style={{display:"flex",borderBottom:"1px solid #e8e8e8"}}>{[{k:"upload",l:"Upload & Edit"},{k:"saved",l:`Saved (${presets.length})`}].map(t=><button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"10px",border:"none",background:"transparent",fontSize:12,cursor:"pointer",fontWeight:600,color:tab===t.k?"#ee4d2d":"#999",borderBottom:tab===t.k?"2px solid #ee4d2d":"2px solid transparent"}}>{t.l}</button>)}</div>
          {tab==="upload"?(
            <div style={{padding:14}}>
              <div onClick={()=>(isSearch?cRef:fRef).current?.click()} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={drop}
                style={{border:`2px dashed ${drag?"#ee4d2d":"#ddd"}`,borderRadius:8,padding:16,textAlign:"center",cursor:"pointer",background:drag?"#fff5f5":"#fafafa"}}>
                <div style={{fontSize:24}}>{isSearch?"📷":"📷 🎬"}</div>
                <div style={{fontSize:12,color:"#555",fontWeight:500,marginTop:4}}>{isSearch?"Drop gambar produk di sini":"Drop gambar/video di sini"}</div>
                <div style={{fontSize:10,color:"#bbb",marginTop:2}}>{isSearch?"Setiap gambar = 1 product card":"JPG, PNG, WebP, MP4"}</div>
                <input ref={fRef} type="file" accept="image/*,video/*" multiple hidden onChange={e=>addFiles(e.target.files)}/>
                <input ref={cRef} type="file" accept="image/*" multiple hidden onChange={e=>addCards(e.target.files)}/>
              </div>
              {isSearch?(
                <>
                  {cards.length>0&&<div style={{marginTop:10}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:4}}>PRODUCT CARDS ({cards.length})</div>
                    {cards.map((c,i)=>(
                      <div key={c.id} style={{display:"flex",alignItems:"center",gap:6,padding:4,background:editCard===c.id?"#fff5f5":"#fafafa",borderRadius:6,marginBottom:3,border:editCard===c.id?"1px solid #ee4d2d":"1px solid transparent",cursor:"pointer"}} onClick={()=>setEditCard(editCard===c.id?null:c.id)}>
                        <img src={c.image} alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:3}}/>
                        <div style={{flex:1,minWidth:0}}><div style={{fontSize:11,color:"#222",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{c.name}</div><div style={{fontSize:10,color:"#ee4d2d"}}>Rp{fmt(c.price)}</div></div>
                        <button onClick={e=>{e.stopPropagation();rmCard(c.id)}} style={{border:"none",background:"transparent",cursor:"pointer",fontSize:11,color:"#e53935"}}>✕</button>
                      </div>
                    ))}
                  </div>}
                  {editCard&&cards.find(c=>c.id===editCard)&&(()=>{
                    const ec=cards.find(c=>c.id===editCard);
                    return (<div style={{marginTop:10,padding:10,background:"#fafafa",borderRadius:8}}>
                      <div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:6}}>EDIT CARD</div>
                      {[{l:"Nama",k:"name",ph:"Nama Produk"},{l:"Harga",k:"price",ph:"99000"},{l:"Harga Asli",k:"originalPrice",ph:"139000"},{l:"Diskon",k:"discount",ph:"-29%"},{l:"Terjual",k:"sold",ph:"10RB+"},{l:"Lokasi",k:"location",ph:"Jakarta"},{l:"Rating",k:"rating",ph:"4.9"}].map(f=>
                        <Field key={f.k} label={f.l} k={f.k} ph={f.ph} value={ec[f.k]??""} onChange={(k,v)=>updCard(ec.id,k,v)}/>
                      )}
                    </div>);
                  })()}
                </>
              ):(
                <>
                  {media.length>0&&<div style={{marginTop:10}}><div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:4}}>MEDIA ({media.length})</div>{media.map((m,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:4,background:"#fafafa",borderRadius:6,marginBottom:3}}>{isVid(m)?<video src={m.src} style={{width:36,height:36,objectFit:"cover",borderRadius:3}} preload="metadata"/>:<img src={m.src} alt="" style={{width:36,height:36,objectFit:"cover",borderRadius:3}}/>}<span style={{flex:1,fontSize:11,color:"#555"}}>{isVid(m)?"🎬":"📷"} {i+1}</span><button onClick={()=>mv(i,-1)} style={{border:"none",background:"transparent",cursor:"pointer",fontSize:11,opacity:i===0?0.3:1}}>↑</button><button onClick={()=>mv(i,1)} style={{border:"none",background:"transparent",cursor:"pointer",fontSize:11,opacity:i===media.length-1?0.3:1}}>↓</button><button onClick={()=>rm(i)} style={{border:"none",background:"transparent",cursor:"pointer",fontSize:11,color:"#e53935"}}>✕</button></div>)}</div>}
                  <div style={{marginTop:12}}><div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:4}}>LOGO TOKO</div><div onClick={()=>lRef.current?.click()} style={{display:"flex",alignItems:"center",gap:8,padding:8,border:"1px dashed #ddd",borderRadius:8,cursor:"pointer"}}>{logo?<img src={logo} alt="" style={{width:32,height:32,borderRadius:16,objectFit:"cover"}}/>:<div style={{width:32,height:32,borderRadius:16,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏪</div>}<span style={{fontSize:11,color:"#888"}}>{logo?"Ganti":"Upload logo"}</span>{logo&&<button onClick={e=>{e.stopPropagation();setLogo(null)}} style={{marginLeft:"auto",border:"none",background:"transparent",color:"#e53935",cursor:"pointer",fontSize:11}}>✕</button>}</div><input ref={lRef} type="file" accept="image/*" hidden onChange={async e=>{if(e.target.files[0])setLogo(await toB64(e.target.files[0]))}}/></div>
                  <div style={{marginTop:12}}><div style={{fontSize:10,fontWeight:700,color:"#888",marginBottom:6}}>DETAIL PRODUK</div>{renderFields(fields,info,upd)}</div>
                </>
              )}
              <button onClick={savePre} disabled={saving||(isSearch?cards.length===0:media.length===0)} style={{width:"100%",padding:"10px",marginTop:12,border:"none",borderRadius:8,background:(isSearch?cards.length>0:media.length>0)&&!saving?"#ee4d2d":"#ccc",color:"#fff",fontSize:13,fontWeight:700,cursor:(isSearch?cards.length>0:media.length>0)&&!saving?"pointer":"not-allowed"}}>
                {saving?"⏳ Saving...":"💾 Save & Share ke Tim"}
              </button>
            </div>
          ):(
            <div style={{padding:14}}>
              {loading?<div style={{textAlign:"center",padding:30,color:"#999"}}>⏳ Loading...</div>:
              presets.length===0?<div style={{textAlign:"center",padding:30,color:"#999"}}>📁 Belum ada</div>:
              presets.map(p=>(
                <div key={p.id} onClick={()=>loadPre(p)} style={{padding:10,borderRadius:8,cursor:"pointer",marginBottom:6,border:activePre===p.id?"2px solid #ee4d2d":"1px solid #e8e8e8",background:activePre===p.id?"#fff5f5":"#fff"}}>
                  <div style={{display:"flex",gap:4,marginBottom:6}}>{((p.media||[]).length>0?(p.media||[]):(p.cards||[]).map(c=>({src:c.image}))).slice(0,4).map((m,i)=><img key={i} src={m.src||m.image} alt="" style={{width:30,height:30,objectFit:"cover",borderRadius:3}}/>)}</div>
                  <div style={{fontSize:11,fontWeight:500}}>{p.name}</div>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:10,color:"#999"}}>{new Date(p.ts).toLocaleDateString("id-ID")}</span><button onClick={e=>{e.stopPropagation();delPre(p.id)}} style={{border:"none",background:"transparent",color:"#e53935",fontSize:10,cursor:"pointer"}}>Hapus</button></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{flex:1,overflow:"auto",padding:20,display:"flex",justifyContent:"center",alignItems:isMobView?"center":"flex-start"}}>
          <div style={{transform:isDeskView?"scale(0.72)":"none",transformOrigin:"top center"}}><Preview/></div>
        </div>
      </div>
    </div>
  );
}