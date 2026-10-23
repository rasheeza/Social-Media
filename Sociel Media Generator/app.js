const $=id=>document.getElementById(id), C=$("canvas");let items=[],selected=null,photoData="";
const presets={
 headline:{text:"DEINE HEADLINE",font:"Work Sans",size:58,weight:900,color:"#ffffff",bg:"#ed1c24",a:0,w:78,pad:0,r:0,line:92,x:7,y:9},
 text:{text:"Text",font:"Inter",size:25,weight:400,color:"#ffffff",bg:"#000000",a:0,w:72,pad:0,r:0,line:115,x:7,y:48},
 meta:{text:"Datum · Uhrzeit · Ort",font:"Work Sans",size:22,weight:800,color:"#ffffff",bg:"#ed1c24",a:100,w:58,pad:10,r:0,line:100,x:7,y:38},
 source:{text:"Quelle: …",font:"Inter",size:11,weight:400,color:"#ffffff",bg:"#000000",a:0,w:65,pad:0,r:0,line:120,x:7,y:88},
 box:{text:"",font:"Inter",size:12,weight:400,color:"#ffffff",bg:"#ed1c24",a:100,w:45,pad:20,r:0,line:100,x:7,y:65}
};
function rgba(h,a){let n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a/100})`}
function add(type,data){let d={...presets[type],...data,id:"e"+Date.now()+Math.random().toString(16).slice(2),type};items.push(d);renderItem(d);select(d.id);renderLayers()}
function renderItem(d){let e=document.createElement("div");e.id=d.id;e.className="el";C.appendChild(e);apply(d);drag(e,d);e.onclick=ev=>{ev.stopPropagation();select(d.id)}}
function apply(d){let e=$(d.id);if(!e)return;e.textContent=d.text;e.style.cssText+=`;left:${d.x}%;top:${d.y}%;width:${d.w}%;font-family:${d.font},Arial,sans-serif;font-size:${d.size}px;font-weight:${d.weight};color:${d.color};background:${rgba(d.bg,d.a)};padding:${d.pad}px;border-radius:${d.r}px;line-height:${d.line/100};text-align:${d.align||"left"};`}
function drag(e,d){e.onpointerdown=ev=>{e.setPointerCapture(ev.pointerId);let sx=ev.clientX,sy=ev.clientY,x=d.x,y=d.y;let move=m=>{d.x=x+(m.clientX-sx)/C.clientWidth*100;d.y=y+(m.clientY-sy)/C.clientHeight*100;apply(d)};e.addEventListener("pointermove",move);e.addEventListener("pointerup",()=>e.removeEventListener("pointermove",move),{once:true})}}
function select(id){selected=items.find(x=>x.id===id)||null;document.querySelectorAll(".el").forEach(e=>e.classList.toggle("selected",e.id===id));$("none").hidden=!!selected;$("props").hidden=!selected;if(selected){let d=selected;$("pText").value=d.text;$("pFont").value=d.font;$("pWeight").value=d.weight;$("pSize").value=d.size;$("pColor").value=d.color;$("pBg").value=d.bg;$("pBgAlpha").value=d.a;$("pWidth").value=d.w;$("pPad").value=d.pad;$("pRadius").value=d.r;$("pLine").value=d.line;$("pAlign").value=d.align||"left"}renderLayers()}
function sync(){if(!selected)return;Object.assign(selected,{text:$("pText").value,font:$("pFont").value,weight:+$("pWeight").value,size:+$("pSize").value,color:$("pColor").value,bg:$("pBg").value,a:+$("pBgAlpha").value,w:+$("pWidth").value,pad:+$("pPad").value,r:+$("pRadius").value,line:+$("pLine").value,align:$("pAlign").value});apply(selected);renderLayers()}
["pText","pFont","pWeight","pSize","pColor","pBg","pBgAlpha","pWidth","pPad","pRadius","pLine","pAlign"].forEach(x=>$(x).oninput=sync);
function renderLayers(){$("layers").innerHTML="";[...items].reverse().forEach(d=>{let r=document.createElement("div");r.className="layerrow";r.innerHTML=`<button class="select ${selected?.id===d.id?"active":""}">${d.text||"Fläche"}</button><button class="remove">×</button>`;r.children[0].onclick=()=>select(d.id);r.children[1].onclick=()=>remove(d.id);$("layers").appendChild(r)})}
function remove(id){let e=$(id);if(e)e.remove();items=items.filter(x=>x.id!==id);if(selected?.id===id)selected=null;select(selected?.id)}
document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(b.dataset.add));
$("delete").onclick=()=>selected&&remove(selected.id);$("duplicate").onclick=()=>selected&&add(selected.type,{...selected,x:selected.x+3,y:selected.y+3});
$("photoFile").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{photoData=r.result;photo()};r.readAsDataURL(f)};
function photo(){$("photo").style.backgroundImage=photoData?`url("${photoData}")`:"none";$("photo").style.transform=`translate(${$("photoX").value}%,${$("photoY").value}%) scale(${$("photoZoom").value/100})`;$("photo").style.filter=`brightness(${$("brightness").value}%) saturate(${$("saturation").value}%)`;$("veil").style.opacity=$("overlay").value/100}
["photoZoom","photoX","photoY","brightness","saturation","overlay"].forEach(x=>$(x).oninput=photo);$("removePhoto").onclick=()=>{photoData="";photo()};$("resetPhoto").onclick=()=>{$("photoZoom").value=100;$("photoX").value=$("photoY").value=0;photo()};
$("format").onchange=()=>{let f=$("format").value;C.style.width=f==="9:16"?"432px":"540px";C.style.height=f==="1:1"?"540px":f==="9:16"?"768px":"675px"};$("canvasColor").oninput=()=>C.style.background=$("canvasColor").value;
function logo() {let e=$("brandLogo"),p=$("logoPos").value,m=+$("logoMargin").value;e.style.width=$("logoSize").value+"%";e.style.left=e.style.right=e.style.top=e.style.bottom="auto";e.style[p.includes("r")?"right":"left"]=m+"%";e.style[p.includes("b")?"bottom":"top"]=m+"%"}
["logoPos","logoSize","logoMargin"].forEach(x=>$(x).oninput=logo);

$("exportBtn").onclick=async()=>{
  const f=$("format").value;
  const W=1080, H=f==="1:1"?1080:(f==="9:16"?1920:1350);
  const out=document.createElement("canvas"); out.width=W; out.height=H;
  const ctx=out.getContext("2d");
  ctx.fillStyle=$("canvasColor").value; ctx.fillRect(0,0,W,H);

  const load=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});
  const cover=(img,x,y,w,h)=>{
    const r=Math.max(w/img.width,h/img.height), sw=w/r, sh=h/r;
    const sx=(img.width-sw)/2, sy=(img.height-sh)/2;
    ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
  };

  if(photoData){
    try{
      const img=await load(photoData);
      ctx.save();
      ctx.filter=`brightness(${$("brightness").value}%) saturate(${$("saturation").value}%)`;
      const zoom=$("photoZoom").value/100;
      const pw=W*zoom, ph=H*zoom;
      const px=(W-pw)/2 + W*(+$("photoX").value/100);
      const py=(H-ph)/2 + H*(+$("photoY").value/100);
      cover(img,px,py,pw,ph); ctx.restore();
    }catch(e){}
  }

  const ov=+$("overlay").value/100;
  const g=ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,`rgba(0,0,0,${.12*ov})`);
  g.addColorStop(.45,`rgba(0,0,0,${.22*ov})`);
  g.addColorStop(1,`rgba(0,0,0,${.68*ov})`);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);

  const sx=W/C.clientWidth, sy=H/C.clientHeight;
  for(const d of items){
    const x=d.x/100*W, y=d.y/100*H, w=d.w/100*W;
    const pad=d.pad*sx, fs=d.size*sx;
    if(d.a>0){ctx.fillStyle=rgba(d.bg,d.a);ctx.fillRect(x,y,w,pad*2+fs*(d.line/100)*Math.max(1,(d.text||" ").split("\n").length));}
    ctx.fillStyle=d.color;ctx.textAlign=d.align||"left";ctx.textBaseline="top";
    ctx.font=`${d.weight} ${fs}px "${d.font}", Arial, sans-serif`;
    const tx=(d.align==="center"?x+w/2:d.align==="right"?x+w:x)+pad*(d.align==="left"?1:d.align==="right"?-1:0);
    const max=w-pad*2, lh=fs*(d.line/100);
    let yy=y+pad;
    for(const para of (d.text||"").split("\n")){
      let line="", words=para.split(/\s+/);
      for(const word of words){
        const test=line?line+" "+word:word;
        if(ctx.measureText(test).width>max && line){ctx.fillText(line,tx,yy);yy+=lh;line=word}else line=test;
      }
      ctx.fillText(line,tx,yy);yy+=lh;
    }
  }

  try{
    const li=await load($("brandLogo").src);
    const el=$("brandLogo"), r=el.getBoundingClientRect(), cr=C.getBoundingClientRect();
    ctx.drawImage(li,(r.left-cr.left)*sx,(r.top-cr.top)*sy,r.width*sx,r.height*sy);
  }catch(e){}

  const a=document.createElement("a");
  a.download="Migrantische-Linke-NRW-Post.png";
  a.href=out.toDataURL("image/png");
  a.click();
};
C.onclick=()=>select(null);add("headline");add("meta");add("text");add("source");logo();photo();
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{const v=b.dataset.view;$("socialGuide").style.display=v==="social"?"block":"none";$("securityGuide").style.display=v==="security"?"block":"none";});
