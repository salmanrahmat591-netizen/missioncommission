
/* Fonts load after the page is already usable, so a slow connection never blocks the first screen. */
setTimeout(function(){try{var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap';document.head.appendChild(l)}catch(e){}},400);
const TESTS = window.TESTS;
const MINUTES = 30;
const SECS = MINUTES*60;
const app = document.getElementById('app');
const LS = {get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const L = 'ABCDEF';
let IMGDATA=null;
/* Picture questions: standalone file keeps every picture inside the page (json block #imgdata); the web version loads img/<name>. */
function imgSrc(q){ return 'images/'+q.img; }
let timer=null, S=null;

function h(tag,attrs,...kids){
  const el=document.createElement(tag);
  for(const k in (attrs||{})){
    const v=attrs[k];
    if(k==='class')el.className=v; else if(k==='on')for(const ev in v)el.addEventListener(ev,v[ev]);
    else if(v===true)el.setAttribute(k,''); else if(v!==false&&v!=null)el.setAttribute(k,v);
  }
  for(const c of [].concat(...kids.map(k=>Array.isArray(k)?k:[k]))){ if(c==null||c===false)continue; el.appendChild(c.nodeType?c:document.createTextNode(c)); }
  return el;
}
function setKids(nodes){ while(app.firstChild)app.removeChild(app.firstChild); nodes.forEach(n=>app.appendChild(n)); }
function mount(...nodes){ clearInterval(timer); timer=null; setKids(nodes); window.scrollTo(0,0); }
const pad=n=>String(n).padStart(2,'0');
const fmt=s=>pad(Math.floor(s/60))+':'+pad(s%60);

const BADGE='<svg viewBox="0 0 48 56" width="44" height="52" aria-hidden="true"><path d="M24 2 44 9v19c0 14-10 22-20 26C14 50 4 42 4 28V9z" fill="#01411C" stroke="#f4f1de" stroke-width="2.5"/><circle cx="22" cy="29" r="11" fill="#f4f1de"/><circle cx="26" cy="27" r="9.2" fill="#01411C"/><polygon points="32.5,17.2 33.9,21.1 38.0,21.2 34.8,23.7 35.9,27.7 32.5,25.4 29.1,27.7 30.2,23.7 27.0,21.2 31.1,21.1" fill="#f4f1de"/></svg>';
const BANNER='<svg viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="300" height="100" fill="#01411C"/><rect width="75" height="100" fill="#f4f1de"/><circle cx="178" cy="50" r="27" fill="#f4f1de"/><circle cx="188" cy="44" r="22.5" fill="#01411C"/><polygon points="212.0,23.0 215.1,31.7 224.4,32.0 217.0,37.6 219.6,46.5 212.0,41.3 204.4,46.5 207.0,37.6 199.6,32.0 208.9,31.7" fill="#f4f1de"/><rect class="sweep" x="-60" width="50" height="100" fill="#fff" opacity=".12" transform="skewX(-20)"/></svg>';
const ICONS={tcc:'<g class="a-spin"><circle cx="14" cy="14" r="8" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="3.1 3.1"/><circle cx="14" cy="14" r="5.2" fill="none" stroke="currentColor" stroke-width="2.6"/></g><circle cx="14" cy="14" r="1.8" fill="currentColor"/>',long:'<g class="a-twinkle"><polygon points="14.0,2.5 16.9,10.5 25.4,10.8 18.8,16.0 21.1,24.2 14.0,19.5 6.9,24.2 9.2,16.0 2.6,10.8 11.1,10.5" fill="currentColor"/></g>',amc:'<g class="a-beat"><circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 7h4v5h5v4h-5v5h-4v-5H7v-4h5z" fill="currentColor"/></g>',pn:'<g class="a-sway" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="14" cy="6" r="3"/><path d="M14 9v16M8 13h12M4 18c1 5 5 7 10 7s9-2 10-7"/></g>',issb:'<circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M14 1.5v4M14 22.5v4M1.5 14h4M22.5 14h4" stroke="currentColor" stroke-width="2.2"/><polygon class="a-needle" points="14,5 17.2,14 14,23 10.8,14" fill="currentColor"/><circle cx="14" cy="14" r="1.6" fill="var(--panel)"/>',interview:'<g class="a-bob"><path d="M3 4h13a2 2 0 012 2v7a2 2 0 01-2 2H9l-4 4v-4H3a2 2 0 01-2-2V6a2 2 0 012-2z" fill="currentColor"/><path d="M21 10h2a2 2 0 012 2v6a2 2 0 01-2 2h-1v3.5L18.5 20H13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></g>',afns:'<g class="a-beat"><path d="M14 25C4 18 2 12.5 2 9 2 5.5 4.6 3 7.7 3 10.7 3 13 5 14 7 15 5 17.3 3 20.3 3 23.4 3 26 5.5 26 9c0 3.500-2 9-12 16z" fill="currentColor"/><path d="M13 9h2v4h4v2h-4v4h-2v-4H9v-2h4z" fill="var(--panel)"/></g>',lcc:'<mask id="lccm"><rect width="28" height="28" fill="#fff"/><circle cx="19" cy="11.5" r="8.6" fill="#000"/></mask><circle cx="13" cy="14" r="11" fill="currentColor" mask="url(#lccm)"/><g class="a-twinkle2"><polygon points="21.5,7.2 22.5,10.1 25.6,10.1 23.1,11.9 24.1,14.9 21.5,13.1 18.9,14.9 19.9,11.9 17.4,10.1 20.5,10.1" fill="currentColor"/></g>',paf:'<g class="a-fly"><path d="M14 1.5l2.3 9.5L26 16v3.200l-9.500-2.600-.5 5.600 3 2.100V26L14 25l-5 1v-1.200l3-2.100-.5-5.600L2 19.200V16l9.700-5z" fill="currentColor"/></g>',scc:'<g class="a-chev" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path class="c1" d="M4.500 21L14 15.500 23.500 21"/><path class="c2" d="M4.500 14.500L14 9 23.500 14.500"/><path class="c3" d="M4.500 8L14 2.500 23.500 8"/></g>',pma:'<path d="M5 26V12h3.200v-2h2.300v2h2.300v-2h2.400v2h2.300v-2h2.300v2H23V26z" fill="currentColor"/><path d="M14 10V1.800" stroke="currentColor" stroke-width="2"/><path class="a-flag" d="M14 2h8.500l-2.300 2.700L22.500 7.500H14z" fill="currentColor"/><rect x="11.500" y="18" width="5" height="8" fill="var(--panel)"/>'};
function svgBox(cls,html){const s=document.createElement('span');s.className=cls;s.innerHTML=html;return s}
function icon(id){return svgBox('cico ico-'+id,'<svg viewBox="0 0 28 28" width="34" height="34" aria-hidden="true">'+ICONS[id]+'</svg>')}
function masthead(sub,back){
  const btns=h('div',{class:'mbtns'},
    back?h('button',{class:'theme',id:'back-btn',type:'button',on:{click:back}},'\u2190 Back'):null,
    h('button',{class:'theme',id:'theme-btn',type:'button',on:{click:toggleTheme}},'Theme'));
  const lg=h('button',{class:'mlogo',id:'home-logo',type:'button','aria-label':'Mission Commission home',on:{click:()=>intro()}},
    h('img',{src:LOGO_S,alt:'',width:'64',height:'64',draggable:'false'}));
  return h('div',{class:'mast'},adminBtn(),h('div',{class:'wrap'},
    h('div',{class:'brand'},lg,h('div',{},h('h1',{},'Mission Commission'),h('p',{},sub))),btns));
}
function toggleTheme(){
  const r=document.documentElement;
  const dark=r.getAttribute('data-theme')==='dark'||(!r.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
  r.setAttribute('data-theme',dark?'light':'dark');
}

/* ---------- COURSES ---------- */
/* Each course owns a test filter and a file list. FILES entries look like {name:'Notes', path:'files/notes.pdf', note:'PDF, 2 MB'}. */
const PARTS=[{id:'verbal',name:'Verbal'},{id:'nonverbal',name:'Non-Verbal'},{id:'academics',name:'Academics'}];
/* Tests marked shared:true (the verbal ones) show in the Verbal portion of every course. */
const SECTIONS=[
  {id:'tcc',name:'Technical Cadet Course',short:'TCC',tests:i=>true,defPart:'verbal',parts:PARTS},
  {id:'long',name:'Long Course',short:'LC',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'amc',name:'Army Medical Course',short:'AMC',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'pn',name:'PN Cadet',short:'PNC',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'issb',name:'ISSB (Inter Services Selection Board)',short:'ISSB',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'interview',name:'Initial Interview',short:'INT',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'afns',name:'AFNS (Armed Forces Nursing Service)',short:'AFNS',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'lcc',name:'LCC (Lady Cadet Course)',short:'LCC',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'paf',name:'PAF (Pakistan Air Force)',short:'PAF',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'scc',name:'SCC (Short Commission Course)',short:'SCC',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS},
  {id:'pma',name:'PMA (Pakistan Military Academy)',short:'PMA',tests:i=>!!TESTS[i].shared,defPart:'verbal',parts:PARTS}];
const FILES=window.FILES;
/* ---------- Course access (WhatsApp request -> owner-signed unlock code, 30 days per course) ---------- */
const PUBKEY={kty:'EC',crv:'P-256',x:'B9zNDyali6CUTAOBnnvAhDmsU7bbpVZ7qV6vSuQyKbM',y:'N9ID3D8zQfM920r36i_Wjqo2AQh9GD8BshbI9Rg6mp8',ext:true};
const OWNER_WA='923187504964', OWNER_SHOW='0318 7504964', ACCESS_DAYS=30;
const waLink=m=>'https://api.whatsapp.com/send?phone='+OWNER_WA+'&text='+encodeURIComponent(m);
const waWebLink=m=>'https://web.whatsapp.com/send?phone='+OWNER_WA+'&text='+encodeURIComponent(m);
const B64={dec(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}};
let MEMDEV=null;
function deviceId(){
  if(!MEMDEV){
    let d=LS.get('mc-device');
    if(!d||typeof d!=='string'){const a=new Uint8Array(5);(window.crypto||{getRandomValues:x=>x.forEach((_,i)=>x[i]=Math.random()*256)}).getRandomValues(a);d=Array.from(a,x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join('');LS.set('mc-device',d)}
    MEMDEV=d;
  }
  return MEMDEV;
}
function accessInfo(id){
  const g=(LS.get('mc-access')||{})[id], n=Date.now(), seen=LS.get('mc-seen')||0;
  if(!g||g.d!==deviceId())return {s:'none'};
  if(n<seen-3600000)return {s:'clock'};
  if(n>=g.exp*1000)return {s:'expired',exp:g.exp};
  if(n>seen)LS.set('mc-seen',n);
  return {s:'ok',exp:g.exp,left:Math.max(1,Math.ceil((g.exp*1000-n)/864e5))};
}
const hasAccess=id=>accessInfo(id).s==='ok';
async function checkCode(raw,id){
  const code=String(raw||'').replace(/\s+/g,'');
  const m=code.match(/MC1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)/);
  if(!m)return {ok:false,msg:'That does not look like an unlock code. Paste the whole code the owner sent.'};
  if(!(window.crypto&&crypto.subtle))return {ok:false,msg:'This browser cannot check codes here. Open the app in Chrome or Safari.'};
  try{
    const key=await crypto.subtle.importKey('jwk',PUBKEY,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
    const body=B64.dec(m[1]);
    const good=await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,B64.dec(m[2]),body);
    if(!good)return {ok:false,msg:'This code is not valid.'};
    const p=new TextDecoder().decode(body).split('|');
    const c=p[0], d=p[1], iss=+p[2], exp=+p[3];
    if(!SECTIONS.some(s=>s.id===c))return {ok:false,msg:'This code is not valid.'};
    if(id&&c!==id)return {ok:false,msg:'This code is for a different course.'};
    if(d!==deviceId())return {ok:false,msg:'This code was issued for another device. Send a new request from this device.'};
    if(!(exp>iss)||exp-iss>32*86400)return {ok:false,msg:'This code is not valid.'};
    if(Date.now()>=exp*1000)return {ok:false,msg:'This code has expired. Send a new request.'};
    if(Date.now()<iss*1000-86400000)return {ok:false,msg:'Your device clock looks wrong. Fix the date and time, then try again.'};
    const all=LS.get('mc-access')||{};all[c]={d,iss,exp};LS.set('mc-access',all);
    LS.set('mc-seen',Math.max(LS.get('mc-seen')||0,Date.now()));
    return {ok:true,exp,id:c};
  }catch(e){return {ok:false,msg:'Could not check the code. Try again.'}}
}
const fmtDate=s=>new Date(s*1000).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
function lock(id){
  curSec=id;
  const sec=SECTIONS.find(s=>s.id===id), info=accessInfo(id), dev=deviceId();
  const reqCode='MC-'+id.toUpperCase()+'-'+dev;
  const msg='Assalam o Alaikum. I would like access to *'+sec.name+'* on Mission Commission.\nRequest code: '+reqCode;
  const wa=waLink(msg), waWeb=waWebLink(msg);
  const note=info.s==='expired'?'Your 30-day access to this course ended on '+fmtDate(info.exp)+'. Send a new request to continue.':
    info.s==='clock'?'Your device clock was set back. Access is paused. Send a new request to continue.':
    'This course needs the owner’s permission. Access lasts 30 days.';
  const out=h('div',{class:'lockmsg',id:'lock-msg','aria-live':'polite'});
  const inp=h('input',{type:'text',id:'code-in',class:'codein',placeholder:'MC1.…  or paste code here',autocomplete:'off',autocapitalize:'off',spellcheck:'false','aria-label':'Unlock code'});
  const go=async()=>{
    out.className='lockmsg';out.textContent='Checking…';
    const r=await checkCode(inp.value,id);
    if(r.ok){out.className='lockmsg good';out.textContent='Access granted until '+fmtDate(r.exp)+'.';setTimeout(()=>section(id,'tests'),700)}
    else{out.className='lockmsg bad';out.textContent=r.msg}
  };
  const ub=h('button',{class:'btn',type:'button',id:'unlock-btn',on:{click:go}},'Unlock');
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  const copy=h('button',{class:'btn ghost',type:'button',id:'copy-req',on:{click:()=>{
    try{navigator.clipboard.writeText(msg).then(()=>{copy.textContent='Copied'},()=>{})}catch(e){}
    const ta=document.getElementById('req-text');if(ta){ta.focus();ta.select()}}}},'Copy request');
  mount(masthead(sec.name,home),
    h('div',{class:'lockcard'},
      svgBox('lockico','<svg viewBox="0 0 28 28" width="46" height="46" aria-hidden="true"><rect x="5" y="12" width="18" height="12" rx="1" fill="currentColor"/><path d="M9 12V9a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>'),
      h('h2',{},sec.name),
      h('p',{class:'locknote'},note),
      h('ol',{class:'locksteps'},
        h('li',{},h('b',{},'Request. '),'Tap the button. WhatsApp opens with your request already written. Send it.'),
        h('li',{},h('b',{},'Wait. '),'The owner replies on WhatsApp with an access link, or declines.'),
        h('li',{},h('b',{},'Unlock. '),'Tap the link. The course opens by itself. If the link does not open the app, paste its code below.')),
      h('div',{class:'lockacts'},h('a',{class:'btn',id:'wa-req',href:wa,target:'_blank',rel:'noopener'},'Request on WhatsApp'),h('a',{class:'btn ghost',id:'wa-web',href:waWeb,target:'_blank',rel:'noopener'},'WhatsApp Web'),copy),
      h('p',{class:'label',style:'display:block;margin:0 0 8px'},'Owner number: '+OWNER_SHOW+'. You do not need to save it. If WhatsApp does not open, send the request text below to this number.'),
      h('textarea',{id:'req-text',class:'reqtext',readonly:'readonly',rows:'2','aria-label':'Request message'},msg),
      h('div',{class:'lockrow'},inp,ub),out,
      h('p',{class:'label lockdev'},'Device '+dev+'  ·  Access is tied to this device and course')));
}

let curSec='tcc', curTab='tests';
const secIdx=sec=>TESTS.map((t,i)=>i).filter(sec.tests);

function home(){
  const nodes=[masthead('Select your course'),
    h('div',{class:'group'},h('h2',{},h('span',{},'Courses'),h('span',{class:'label'},SECTIONS.length+' sections')))];
  const grid=h('div',{class:'grid'});
  SECTIONS.forEach(sec=>{
    const ai=accessInfo(sec.id), nt=secIdx(sec).length, nq=secIdx(sec).reduce((a,i)=>a+TESTS[i].qs.length,0), nf=(FILES[sec.id]||[]).length;
    grid.appendChild(h('div',{class:'card'},
      h('div',{class:'cardhead'},h('span',{class:'label'},sec.short),icon(sec.id)),
      h('h3',{},sec.name),
      h('div',{class:'meta'},h('span',{},nt+(nt===1?' test':' tests')),h('span',{},nq+' questions'),h('span',{},nf+(nf===1?' file':' files'))),
      h('div',{class:'label accl'+(ai.s==='ok'?' on':'')},ai.s==='ok'?'Unlocked \u00b7 '+ai.left+(ai.left===1?' day left':' days left'):ai.s==='expired'?'Access ended':'Locked'),
      h('button',{class:'btn',type:'button',id:'sec-'+sec.id,on:{click:()=>section(sec.id,'tests')}},ai.s==='ok'?'Enter':'Request access')));
  });
  nodes.splice(1,0,(function(){const d=svgBox('banner',BANNER);d.appendChild(h('div',{class:'txt'},'Prepare. Train. Commission.'));return d})());
  const u=LS.get('mc-user');
  if(u)nodes.push(h('p',{class:'locknote',id:'welcome',style:'margin:10px 0 0'},'Welcome, '+u+'.'));
  nodes.push(grid);
  mount(...nodes);
}

/* ---------- Logo, intro, student login, admin ---------- */
const LOGO_L='icons/logo-460.webp', LOGO_S='icons/logo-120.webp';
const ADMIN_WRAP=window.ADMIN_WRAP;
const WA_SVG='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-8.1 14.5L2.6 21.4l4.5-1.2A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8.6 7.6c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.5l.7 1.7c.1.2 0 .4-.1.5l-.5.6c-.1.2-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.7-.8c.1-.2.3-.2.5-.1l1.7.8c.2.1.3.2.3.4 0 .5-.3 1.1-.8 1.5-.6.4-1.4.5-2.4.1-2.2-.8-3.9-2.5-4.7-4.5-.4-1-.2-2 .1-2.9z" fill="currentColor"/></svg>';
const KEY_SVG='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2" fill="currentColor"/><path d="M12 12v4" stroke="currentColor" stroke-width="2"/></svg>';
function adminBtn(){
  const b=h('button',{class:'admin',id:'admin-btn',type:'button','aria-label':'Admin',on:{click:adminLogin}});
  b.innerHTML=KEY_SVG+'<span>Admin</span>';return b;
}
function wmark(){return h('img',{class:'wm',src:LOGO_L,alt:'','aria-hidden':'true',width:'300',height:'300'})}
function sealImg(cls,src,px){return h('img',{class:cls,src:src||LOGO_S,alt:'Mission Commission logo',width:String(px||96),height:String(px||96),draggable:'false'})}

function intro(){
  const name=LS.get('mc-user');
  const wa=waLink('Assalam o Alaikum. I want to join Mission Commission and need course access.\nDevice: '+deviceId());
  const title=h('h1',{class:'it','aria-label':'Mission Commission'});
  let n=0;
  ['MISSION','COMMISSION'].forEach(w=>{
    const line=h('span',{class:'itl','aria-hidden':'true'});
    w.split('').forEach(ch=>line.appendChild(h('span',{class:'ch',style:'animation-delay:'+(0.7+0.05*n++)+'s'},ch)));
    title.appendChild(line);
  });
  const stars=h('div',{class:'stars','aria-hidden':'true'});
  for(let i=0;i<16;i++)stars.appendChild(h('i',{style:'left:'+((i*37+11)%96)+'%;top:'+((i*53+7)%92)+'%;animation-delay:'+((i%7)*0.45)+'s;--s:'+(6+(i%4)*3)+'px'}));
  const wa_btn=h('a',{class:'btn ibtn wa',id:'intro-wa',href:wa,target:'_blank',rel:'noopener'});
  wa_btn.innerHTML=WA_SVG+'<span>WhatsApp</span>';
  const root=h('div',{class:'intro-pg',id:'intro'},
    stars,
    (function(){const b=adminBtn();return b})(),
    h('div',{class:'emblem'},h('span',{class:'ring r1'}),h('span',{class:'ring r2'}),
      h('img',{class:'logo-big',src:LOGO_L,alt:'Mission Commission logo',width:'460',height:'460',draggable:'false'})),
    title,
    h('p',{class:'is'},'ISSB preparation for armed forces'),
    h('p',{class:'iq'},'Prepare today, lead tomorrow'),
    h('div',{class:'iacts'},wa_btn,
      h('button',{class:'btn ibtn lg',id:'intro-login',type:'button',on:{click:login}},name?'Login':'Login')),
    h('button',{class:'ilink',id:'intro-browse',type:'button',on:{click:home}},name?'Welcome back, '+name+'. Browse courses':'Browse courses'),
    h('a',{class:'ilink iprivacy',href:'privacy.html',id:'intro-privacy'},'Privacy'),
    h('div',{class:'istripe','aria-hidden':'true'}));
  mount(root);
}

function login(){
  const hasAny=SECTIONS.some(s=>hasAccess(s.id));
  const nameIn=h('input',{type:'text',id:'login-name',class:'codein',placeholder:'Your name',autocomplete:'name','aria-label':'Your name',value:LS.get('mc-user')||''});
  const codeIn=h('input',{type:'text',id:'login-code',class:'codein',placeholder:hasAny?'Unlock code (optional)':'Unlock code from the owner',autocomplete:'off',autocapitalize:'off',spellcheck:'false','aria-label':'Unlock code'});
  const out=h('div',{class:'lockmsg',id:'login-msg','aria-live':'polite'});
  const go=async()=>{
    const nm=nameIn.value.trim().replace(/\s+/g,' ');
    out.className='lockmsg';
    if(nm.length<2){out.className='lockmsg bad';out.textContent='Enter your name.';return}
    if(!codeIn.value.trim()){
      if(hasAny){LS.set('mc-user',nm);home();return}
      out.className='lockmsg bad';out.textContent='Enter the unlock code the owner sent you. No code yet? Request a course on WhatsApp.';return;
    }
    out.textContent='Checking…';
    const r=await checkCode(codeIn.value,null);
    if(r.ok){LS.set('mc-user',nm);out.className='lockmsg good';out.textContent='Welcome, '+nm+'. Access granted until '+fmtDate(r.exp)+'.';setTimeout(()=>section(r.id,'tests'),800)}
    else{out.className='lockmsg bad';out.textContent=r.msg}
  };
  [nameIn,codeIn].forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')go()}));
  mount(masthead('Student login',intro),
    h('div',{class:'lockcard logincard'},
      sealImg('seal',LOGO_L,110),
      h('h2',{},'Login'),
      h('p',{class:'locknote'},'Tap the access link the owner sent on WhatsApp and the course opens by itself. If you only have a code, enter your name and the code here.'),
      nameIn,codeIn,
      h('div',{class:'lockacts',style:'margin-top:12px'},
        h('button',{class:'btn',type:'button',id:'login-go',on:{click:go}},'Login'),
        h('button',{class:'btn ghost',type:'button',id:'login-browse',on:{click:home}},'Request a course')),
      out,
      h('p',{class:'label lockdev'},'Device '+deviceId()+'  ·  Codes work on the device that requested them')));
}

/* ---------- Admin (credentials decrypt the signing key, nothing is stored in the app) ---------- */
let ADMINKEY=null;
const u64=u=>btoa(String.fromCharCode(...u)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function adminUnlock(user,pass){
  const norm=String(pass).toUpperCase().replace(/[^A-Z0-9]/g,'');
  const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(user).trim().toLowerCase()+'|'+norm),'PBKDF2',false,['deriveKey']);
  const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:B64.dec(ADMIN_WRAP.salt),iterations:ADMIN_WRAP.it,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:B64.dec(ADMIN_WRAP.iv)},k,B64.dec(ADMIN_WRAP.ct));
  return crypto.subtle.importKey('jwk',JSON.parse(new TextDecoder().decode(pt)),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
}
function adminLogin(){
  if(ADMINKEY){adminPanel();return}
  const uIn=h('input',{type:'text',id:'adm-user',class:'codein',placeholder:'Username',autocomplete:'username',autocapitalize:'off',spellcheck:'false','aria-label':'Admin username'});
  const pIn=h('input',{type:'password',id:'adm-pass',class:'codein',placeholder:'Password',autocomplete:'current-password','aria-label':'Admin password'});
  const out=h('div',{class:'lockmsg',id:'adm-msg','aria-live':'polite'});
  const go=async()=>{
    const f=LS.get('mc-adm-fail')||{n:0,t:0}, now=Date.now();
    if(f.n>=5&&now<f.t+60000){out.className='lockmsg bad';out.textContent='Too many attempts. Wait a minute and try again.';return}
    if(!(window.crypto&&crypto.subtle)){out.className='lockmsg bad';out.textContent='Open the app in Chrome or Safari to use Admin.';return}
    out.className='lockmsg';out.textContent='Checking…';
    try{ADMINKEY=await adminUnlock(uIn.value,pIn.value);LS.set('mc-adm-fail',{n:0,t:0});pIn.value='';adminPanel()}
    catch(e){const n=(f.n>=5?0:f.n)+1;LS.set('mc-adm-fail',{n,t:Date.now()});out.className='lockmsg bad';out.textContent='Wrong username or password.'}
  };
  [uIn,pIn].forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter')go()}));
  mount(masthead('Admin',intro),
    h('div',{class:'lockcard logincard'},
      sealImg('seal',LOGO_L,96),
      h('h2',{},'Admin login'),
      h('p',{class:'locknote'},'For the owner only. Approve or deny course requests and issue unlock codes.'),
      uIn,pIn,
      h('div',{class:'lockacts',style:'margin-top:12px'},h('button',{class:'btn',type:'button',id:'adm-go',on:{click:go}},'Login')),
      out));
}
function adminPanel(){
  if(!ADMINKEY){adminLogin();return}
  const NAMES={};SECTIONS.forEach(s=>NAMES[s.id]=s.name);
  let cur=null;
  const req=h('textarea',{id:'adm-req',class:'reqtext',rows:'3',style:'margin-top:8px',placeholder:'Paste the student’s WhatsApp message or the request code (MC-TCC-ABCDE)','aria-label':'Student request'});
  const info=h('div',{class:'lockmsg',id:'adm-info'});
  const days=h('input',{type:'number',id:'adm-days',class:'codein',value:'30',min:'1',max:'31','aria-label':'Days of access',style:'max-width:110px;flex:0 0 110px'});
  const linkIn=h('input',{type:'text',id:'adm-link',class:'codein',placeholder:'https://your-site.netlify.app',autocapitalize:'off',spellcheck:'false','aria-label':'App website link',value:LS.get('mc-applink')||(/^https?:/.test(location.href)?location.href.split('#')[0]:'')});
  const out=h('textarea',{id:'adm-out',class:'reqtext',rows:'4',readonly:'readonly','aria-label':'Reply to send',style:'margin-top:12px'});
  const outbox=h('div',{hidden:true},out);
  const status=h('div',{class:'lockmsg',id:'adm-status','aria-live':'polite'});
  const wa=h('a',{class:'btn ghost',id:'adm-wa',href:'#',target:'_blank',rel:'noopener'},'Open WhatsApp');
  const copy=h('button',{class:'btn ghost',type:'button',id:'adm-copy',on:{click:()=>{try{navigator.clipboard.writeText(out.value).then(()=>{copy.textContent='Copied'},()=>{})}catch(e){}out.focus();out.select()}}},'Copy reply');
  outbox.appendChild(h('div',{class:'lockacts'},copy,wa));
  const allow=h('button',{class:'btn',type:'button',id:'adm-allow',on:{click:doAllow}},'Allow');
  const deny=h('button',{class:'btn danger',type:'button',id:'adm-deny',on:{click:doDeny}},'Deny');
  allow.disabled=deny.disabled=true;
  const logBox=h('div',{class:'admlog',id:'adm-log'});
  function drawLog(){
    const l=LS.get('mc-log')||[];logBox.textContent='';
    if(!l.length){logBox.appendChild(h('p',{class:'label'},'No approvals yet on this device.'));return}
    const t=h('table',{class:'admtab'},h('tr',{},h('th',{},'Course'),h('th',{},'Device'),h('th',{},'Until')));
    l.slice(0,15).forEach(x=>t.appendChild(h('tr',{},h('td',{},NAMES[x.id]||x.id),h('td',{},x.dev),h('td',{},fmtDate(x.exp)))));
    logBox.appendChild(t);
  }
  function show(text){out.value=text;outbox.hidden=false;wa.href='https://wa.me/?text='+encodeURIComponent(text)}
  req.addEventListener('input',()=>{
    const m=req.value.toUpperCase().match(/MC-([A-Z]+)-([A-HJ-NP-Z2-9]{5})/);
    cur=null;allow.disabled=deny.disabled=true;outbox.hidden=true;status.textContent='';
    if(!m){info.className='lockmsg';info.textContent=req.value?'No request code found.':'';return}
    const id=m[1].toLowerCase();
    if(!NAMES[id]){info.className='lockmsg bad';info.textContent='Unknown course in code.';return}
    cur={id,dev:m[2]};info.className='lockmsg';info.textContent='Course: '+NAMES[id]+'   Device: '+m[2];allow.disabled=deny.disabled=false;
  });
  async function doAllow(){
    if(!cur)return;
    const d=Math.min(31,Math.max(1,+days.value||30)),iss=Math.floor(Date.now()/1000),exp=iss+d*86400;
    const body=new TextEncoder().encode([cur.id,cur.dev,iss,exp].join('|'));
    const sig=new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},ADMINKEY,body));
    const code='MC1.'+u64(body)+'.'+u64(sig), base=linkIn.value.trim().split('#')[0];
    if(base)LS.set('mc-applink',base);
    show('Allowed ✅ '+NAMES[cur.id]+' is unlocked for '+d+' days (until '+fmtDate(exp)+').\n'+(base?'Tap this link to unlock:\n'+base+'#unlock='+code:'Open the app, press Login, paste this code and continue:\n'+code));
    const log=LS.get('mc-log')||[];log.unshift({id:cur.id,dev:cur.dev,exp,days:d});LS.set('mc-log',log.slice(0,50));drawLog();
    status.className='lockmsg good';status.textContent='Code created. Send it to the student.';
  }
  function doDeny(){if(!cur)return;show('Sorry, your request for '+NAMES[cur.id]+' was not approved.');status.className='lockmsg bad';status.textContent='Denied. No code created.'}
  drawLog();
  mount(masthead('Admin tool',home),
    h('div',{class:'lockcard admincard'},
      h('h2',{},'Course requests'),
      h('p',{class:'locknote'},'Paste the request the student sent on WhatsApp, then allow or deny.'),
      req,info,
      h('div',{class:'lockrow',style:'align-items:center;margin-top:6px'},h('label',{class:'label',for:'adm-days'},'Days of access'),days),
      h('label',{class:'label',for:'adm-link',style:'display:block;margin-top:10px'},'App website link (sent to the student)'),linkIn,
      h('div',{class:'lockacts',style:'margin-top:12px'},allow,deny),status,outbox),
    h('div',{class:'lockcard admincard'},h('h2',{},'Recent approvals'),logBox,
      h('div',{class:'lockacts',style:'margin-top:12px'},h('button',{class:'btn ghost',type:'button',id:'adm-lock',on:{click:()=>{ADMINKEY=null;intro()}}},'Lock admin'))));
}

async function unlockFromHash(){
  const m=(location.hash||'').match(/^#unlock=(MC1\.[A-Za-z0-9_.-]+)/);
  if(!m)return false;
  try{history.replaceState(null,'',location.href.split('#')[0])}catch(e){}
  const msg=h('div',{class:'lockmsg',id:'link-msg','aria-live':'polite'},'One moment\u2026');
  const card=h('div',{class:'lockcard logincard'},sealImg('seal',LOGO_L,108),h('h2',{},'Checking your access'),msg);
  mount(masthead('Access link',intro),card);
  const r=await checkCode(m[1],null);
  if(r.ok){
    const nm=SECTIONS.find(s=>s.id===r.id).name;
    msg.className='lockmsg good';msg.textContent=nm+' is unlocked until '+fmtDate(r.exp)+'.';
    setTimeout(()=>section(r.id,'tests'),1300);
  }else{
    msg.className='lockmsg bad';msg.textContent=r.msg+' Open the link in the same browser you used to send the request, or request again.';
    card.appendChild(h('div',{class:'lockacts',style:'margin-top:12px'},h('button',{class:'btn',type:'button',id:'link-home',on:{click:()=>intro()}},'Open the app')));
  }
  return true;
}
window.addEventListener('hashchange',()=>{if(/^#unlock=/.test(location.hash))unlockFromHash()});
function openFile(f,dl){
  try{
    const bin=atob(f.b64),u8=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
    const url=URL.createObjectURL(new Blob([u8],{type:'application/pdf'}));
    if(dl){const a=document.createElement('a');a.href=url;a.download=f.path.split('/').pop();document.body.appendChild(a);a.click();a.remove()}
    else{const w=window.open(url,'_blank');if(!w)location.href=url}
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(e){}
}
function section(id,tab){
  if(!hasAccess(id)){lock(id);return}
  curSec=id; tab=tab||'tests';
  const sec=SECTIONS.find(s=>s.id===id), files=FILES[id]||[];
  if(sec.parts&&tab==='tests')tab=sec.defPart;
  curTab=tab;
  const allIdx=secIdx(sec);
  const inPart=(i,p)=>(TESTS[i].part||sec.defPart)===p;
  const idxs=sec.parts&&tab!=='files'?allIdx.filter(i=>inPart(i,tab)):allIdx;
  const saved=LS.get('issb-results')||{};
  const nodes=[masthead(sec.name,home),wmark(),
    h('div',{class:'filters'},
      h('button',{class:'chip',type:'button',id:'back-courses',on:{click:home}},'All courses'),
      ...(sec.parts?sec.parts.map(p=>h('button',{class:'chip',type:'button',id:'tab-'+p.id,'aria-pressed':tab===p.id,on:{click:()=>section(id,p.id)}},p.name+' ('+allIdx.filter(i=>inPart(i,p.id)).length+')'))
        :[h('button',{class:'chip',type:'button',id:'tab-tests','aria-pressed':tab==='tests',on:{click:()=>section(id,'tests')}},'Tests ('+idxs.length+')')]),
      h('button',{class:'chip',type:'button',id:'tab-files','aria-pressed':tab==='files',on:{click:()=>section(id,'files')}},'Files ('+files.length+')'),
      h('span',{class:'label accl on',id:'acc-left'},'Access: '+accessInfo(id).left+' days left'))];
  if(tab==='files'){
    const box=h('div',{class:'group'},h('h2',{},h('span',{},'Files'),h('span',{class:'label'},sec.short)));
    if(!files.length) box.appendChild(h('div',{class:'empty'},h('b',{},'No files in this section yet.'),h('p',{},'Files added here can be viewed and downloaded.')));
    files.forEach((f,n)=>{
      const acts=f.b64?[
        h('button',{class:'btn ghost',type:'button',id:'view-'+n,on:{click:()=>openFile(f,false)}},'View'),
        h('button',{class:'btn',type:'button',id:'dl-'+n,on:{click:()=>openFile(f,true)}},'Download')]:[
        h('a',{class:'btn ghost',href:f.path,target:'_blank',rel:'noopener'},'View'),
        h('a',{class:'btn',href:f.path,download:f.path.split('/').pop()},'Download')];
      const row=h('div',{class:'frow',style:'animation-delay:'+Math.min(n,10)*0.05+'s'},
        h('span',{class:'fico'},'PDF'),
        h('div',{class:'fn'},h('b',{},f.name),f.note?h('span',{class:'label'},f.note):null),
        h('div',{class:'facts'},...acts));
      box.appendChild(row);
    });
    nodes.push(box); mount(...nodes); return;
  }
  if(!idxs.length){
    nodes.push(h('div',{class:'empty',style:'margin-top:20px'},h('b',{},sec.parts?'No '+sec.parts.find(p=>p.id===tab).name+' tests yet.':'No tests in this section yet.'),h('p',{},'Tests added to '+(sec.parts?sec.parts.find(p=>p.id===tab).name+' in ':'')+sec.name+' will appear here.')));
    mount(...nodes); return;
  }
  const total=idxs.reduce((a,i)=>a+TESTS[i].qs.length,0);
  nodes.push(h('div',{class:'intro'},
    h('div',{},h('b',{},String(idxs.length)),h('span',{class:'label'},'Mock tests')),
    h('div',{},h('b',{},String(total)),h('span',{class:'label'},'Questions')),
    h('div',{},h('b',{},MINUTES+' min'),h('span',{class:'label'},'Per test'))));
  const groups={};
  idxs.forEach(i=>{(groups[TESTS[i].sub]=groups[TESTS[i].sub]||[]).push(i)});
  for(const sub in groups){
    const g=h('div',{class:'group'},h('h2',{},h('span',{},sub),h('span',{class:'label'},groups[sub].length+' tests')));
    const grid=h('div',{class:'grid'});
    groups[sub].forEach((i,n)=>{
      const t=TESTS[i], r=saved[i];
      grid.appendChild(h('div',{class:'card'},
        h('h3',{},sub+' Test '+pad(n+1)),
        h('div',{class:'meta'},h('span',{},t.qs.length+' questions'),h('span',{},MINUTES+' minutes')),
        h('div',{class:'best'+(r?' has':'')},r?('Best: '+r.best+'/'+r.total+'  ('+Math.round(r.best/r.total*100)+'%)'):'Not attempted'),
        h('button',{class:'btn',type:'button',id:'start-'+i,on:{click:()=>briefing(i)}},r?'Retake':'Begin')));
    });
    g.appendChild(grid); nodes.push(g);
  }
  nodes.push(h('div',{class:'rules'},h('span',{class:'label'},'Standing orders'),
    h('ul',{},h('li',{},'Each test runs on a '+MINUTES+' minute clock. It submits itself when the clock reaches zero.'),
      h('li',{},'You may leave any question unattempted. Unattempted questions score zero and are listed in your results.'),
      h('li',{},'1 mark for each correct answer. Nothing is deducted for a wrong answer.'),
      h('li',{},'Keys: number or letter keys to answer, left and right arrows to move, F to flag.'))));
  mount(...nodes);
}

/* ---------- BRIEFING ---------- */
function briefing(i){
  const t=TESTS[i];
  const n=TESTS.filter((x,j)=>x.sub===t.sub&&j<=i).length;
  mount(masthead('Mission briefing',()=>section(curSec,curTab)),
    h('div',{class:'group'},
      sealImg('seal',LOGO_L,108),
      h('h2',{},h('span',{},t.sub+' Test '+pad(n)),h('span',{class:'label'},t.qs.length+' questions  |  '+MINUTES+' min')),
      h('p',{},'Read each question and mark one option. Leave a question blank if you are unsure. You can flag questions and return to them before the clock runs out.'),
      h('p',{},'The clock starts the moment you press Start.'),
      h('div',{class:'nav'},
        h('button',{class:'btn ghost',type:'button',on:{click:()=>section(curSec,curTab)}},'Back'),
        h('button',{class:'btn',type:'button',id:'go',on:{click:()=>start(i)}},'Start test'))));
}

/* ---------- EXAM ---------- */
function start(i){
  const t=TESTS[i];
  S={i,t,idx:0,ans:new Array(t.qs.length).fill(null),flag:new Array(t.qs.length).fill(false),
     end:Date.now()+SECS*1000,left:SECS,done:false};
  drawExam();
  timer=setInterval(tick,250);
}
function title(){const n=TESTS.filter((x,j)=>x.sub===S.t.sub&&j<=S.i).length;return S.t.sub+' Test '+pad(n)}
function tick(){
  S.left=Math.max(0,Math.ceil((S.end-Date.now())/1000));
  const c=document.getElementById('clock');
  if(c){c.textContent=fmt(S.left);c.classList.toggle('low',S.left<=300)}
  if(S.left<=0)finish(true);
}
function drawExam(){
  const q=S.t.qs[S.idx], total=S.t.qs.length;
  const answered=S.ans.filter(a=>a!==null).length;
  const bar=h('div',{class:'bar'},h('div',{class:'wrap'},
    h('div',{class:'t'},h('button',{class:'theme',id:'exit',type:'button',style:'margin-right:10px',on:{click:confirmExit}},'\u2190 Exit'),h('img',{class:'blogo',src:LOGO_S,alt:'',width:'26',height:'26'}),title()),
    h('div',{class:'clock',id:'clock','aria-live':'off'},fmt(S.left))));
  const prog=h('div',{class:'prog'},h('i',{style:'width:'+(answered/total*100)+'%'}));
  const opts=h('div',{class:'opts'+(q.img?' picopts':''),role:'radiogroup','aria-label':'Answer options'});
  q.o.forEach((o,k)=>opts.appendChild(q.img
    ?h('button',{class:'opt pic'+(S.ans[S.idx]===k?' sel':''),type:'button',role:'radio','aria-checked':S.ans[S.idx]===k,id:'opt-'+k,'aria-label':'Option '+o,on:{click:()=>choose(k)}},h('span',{class:'k'},o))
    :h('button',{class:'opt'+(S.ans[S.idx]===k?' sel':''),type:'button',role:'radio','aria-checked':S.ans[S.idx]===k,id:'opt-'+k,on:{click:()=>choose(k)}},
    h('span',{class:'k'},L[k]),h('span',{class:'x'},o))));
  const qbox=h('div',{class:'qbox'+(S.swap?' swap':'')},
    h('div',{class:'qhead'},h('span',{class:'label num'},'Question '+(S.idx+1)+' of '+total),
      h('span',{class:'label'},S.ans[S.idx]===null?'Unattempted':'Answered')),
    q.img?h('img',{class:'qimg',src:imgSrc(q),alt:'Question figure. Choose one option below.'}):h('div',{class:'qtext'},q.q),opts,
    h('div',{class:'nav'},
      h('button',{class:'btn ghost',type:'button',id:'prev',disabled:S.idx===0,on:{click:()=>go(S.idx-1)}},'Previous'),
      h('button',{class:'btn ghost',type:'button',id:'next',disabled:S.idx===total-1,on:{click:()=>go(S.idx+1)}},'Next'),
      h('span',{class:'sp'}),
      h('button',{class:'btn ghost',type:'button',id:'clear',disabled:S.ans[S.idx]===null,on:{click:()=>{S.ans[S.idx]=null;drawExam()}}},'Clear'),
      h('button',{class:'btn ghost',type:'button',id:'flag','aria-pressed':S.flag[S.idx],on:{click:()=>{S.flag[S.idx]=!S.flag[S.idx];drawExam()}}},S.flag[S.idx]?'Unflag':'Flag')));
  const cells=h('div',{class:'cells'});
  S.t.qs.forEach((_,j)=>cells.appendChild(h('button',{class:'cell num'+(S.ans[j]!==null?' ans':'')+(S.flag[j]?' flag':'')+(j===S.idx?' cur':''),type:'button',
    'aria-label':'Question '+(j+1)+(S.ans[j]!==null?', answered':', unattempted')+(S.flag[j]?', flagged':''),on:{click:()=>go(j)}},String(j+1))));
  const pal=h('div',{class:'pal'},h('span',{class:'label'},'Roll call'),cells,
    h('div',{class:'legend'},h('span',{class:'a'},'Answered'),h('span',{},'Unattempted'),h('span',{class:'f'},'Flagged')),
    h('div',{class:'count num'},h('span',{},'Answered '+answered),h('span',{},'Left '+(total-answered))),
    h('div',{class:'nav'},h('button',{class:'btn danger',type:'button',id:'submit',style:'width:100%',on:{click:confirmSubmit}},'Submit test')));
  S.swap=false;
  const nodes=[bar,prog,h('div',{class:'exam'},qbox,pal)];
  const keep=timer;
  setKids(nodes); timer=keep;
}
function choose(k){S.ans[S.idx]=(S.ans[S.idx]===k?null:k);drawExam()}
function go(j){S.swap=true;S.idx=j;drawExam();window.scrollTo(0,0)}
function confirmExit(){
  const v=h('div',{class:'veil',id:'veil'},h('div',{class:'dlg',role:'dialog','aria-modal':'true'},
    h('h3',{},'Leave this test?'),
    h('p',{},'Your answers and your score for this attempt will be lost.'),
    h('div',{class:'row'},
      h('button',{class:'btn ghost',type:'button',id:'stay',on:{click:()=>document.getElementById('veil').remove()}},'Stay'),
      h('button',{class:'btn danger',type:'button',id:'leave',on:{click:()=>{document.getElementById('veil').remove();S.done=true;clearInterval(timer);section(curSec,curTab)}}},'Leave test'))));
  document.body.appendChild(v); document.getElementById('stay').focus();
}
function confirmSubmit(){
  const un=S.ans.filter(a=>a===null).length, fl=S.flag.filter(Boolean).length;
  const v=h('div',{class:'veil',id:'veil'},h('div',{class:'dlg',role:'dialog','aria-modal':'true'},
    h('h3',{},'Submit test?'),
    h('p',{},un?('You have '+un+' unattempted question'+(un>1?'s':'')+'. They will score zero.'):'You have answered every question.'),
    fl?h('p',{},fl+' question'+(fl>1?'s are':' is')+' still flagged.'):null,
    h('p',{class:'num'},'Time left: '+fmt(S.left)),
    h('div',{class:'row'},
      h('button',{class:'btn ghost',type:'button',id:'back',on:{click:()=>document.getElementById('veil').remove()}},'Keep working'),
      h('button',{class:'btn danger',type:'button',id:'yes',on:{click:()=>finish(false)}},'Submit now'))));
  document.body.appendChild(v); document.getElementById('back').focus();
}
document.addEventListener('keydown',e=>{
  if(!S||S.done||!document.getElementById('clock')||document.getElementById('veil'))return;
  const k=e.key.toLowerCase();
  const nopt=S.t.qs[S.idx].o.length;
  if(k.length===1&&'123456'.includes(k)&&+k<=nopt)choose(+k-1);
  else if(k.length===1&&'abcdef'.includes(k)&&'abcdef'.indexOf(k)<nopt)choose('abcdef'.indexOf(k));
  else if(k==='arrowright'&&S.idx<S.t.qs.length-1)go(S.idx+1);
  else if(k==='arrowleft'&&S.idx>0)go(S.idx-1);
  else if(k==='f'){S.flag[S.idx]=!S.flag[S.idx];drawExam()}
});

/* ---------- RESULTS ---------- */
function finish(auto){
  if(S.done)return; S.done=true; clearInterval(timer);
  const v=document.getElementById('veil'); if(v)v.remove();
  const used=SECS-S.left;
  const qs=S.t.qs; let ok=0,bad=0,none=0;
  qs.forEach((q,j)=>{const a=S.ans[j]; if(a===null)none++; else if(a===q.a)ok++; else bad++;});
  const saved=LS.get('issb-results')||{};
  const prev=saved[S.i];
  saved[S.i]={best:Math.max(ok,prev?prev.best:0),total:qs.length};
  LS.set('issb-results',saved);
  S.res={ok,bad,none,used,auto}; results('all');
}
function countUp(el,to){
  if(!el||to<1||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const t0=performance.now();
  (function step(now){const k=Math.min(1,(now-t0)/800);el.textContent=String(Math.round(to*k));if(k<1)requestAnimationFrame(step)})(t0);
}
function results(filter){
  const {ok,bad,none,used,auto}=S.res, qs=S.t.qs, n=qs.length, pct=Math.round(ok/n*100);
  const verdict=pct>=80?'Outstanding':pct>=65?'Well done':pct>=50?'Pass. Keep drilling':'Below standard. Retrain';
  const seg=(v,c)=>h('i',{style:'width:'+(v/n*100)+'%;background:var(--'+c+')'});
  const top=[masthead('Debrief  |  '+title(),()=>section(curSec,curTab)),
    sealImg('stamp',LOGO_L,84),
    h('div',{class:'score'},
      h('div',{class:'big num'},h('span',{class:'n'},String(ok)),h('small',{},' / '+n)),
      h('div',{},h('div',{class:'verdict'},verdict),
        h('div',{class:'label num'},pct+'% correct  |  Time used '+fmt(used)+(auto?'  |  Time expired':'')),
        h('div',{class:'bars','aria-hidden':'true'},seg(ok,'ok'),seg(bad,'bad'),seg(none,'none')))),
    h('div',{class:'stats'},
      h('div',{class:'stat ok'},h('b',{class:'num'},String(ok)),h('span',{class:'label'},'Correct')),
      h('div',{class:'stat bad'},h('b',{class:'num'},String(bad)),h('span',{class:'label'},'Wrong')),
      h('div',{class:'stat none'},h('b',{class:'num'},String(none)),h('span',{class:'label'},'Unattempted')),
      h('div',{class:'stat'},h('b',{class:'num'},String(S.flag.filter(Boolean).length)),h('span',{class:'label'},'Flagged'))),
    h('div',{class:'filters'},h('span',{class:'label'},'Review'),
      ...[['all','All'],['bad','Wrong'],['none','Unattempted'],['ok','Correct']].map(([f,t])=>
        h('button',{class:'chip',type:'button',id:'f-'+f,'aria-pressed':filter===f,on:{click:()=>results(f)}},t)))];
  const list=[];
  qs.forEach((q,j)=>{
    const a=S.ans[j], st=a===null?'none':a===q.a?'ok':'bad';
    if(filter!=='all'&&filter!==st)return;
    const r=h('div',{class:'rev '+st},
      h('div',{class:'qhead'},h('span',{class:'label num'},'Question '+(j+1)),
        h('span',{class:'tag '+st},st==='ok'?'Correct':st==='bad'?'Wrong':'Unattempted')),
      q.img?h('img',{class:'qimg',src:imgSrc(q),alt:'Question figure'}):h('div',{class:'qtext',style:'font-size:1.05rem;margin-bottom:6px'},q.q));
    if(q.img){
      r.appendChild(h('div',{class:'picrev'},
        h('span',{class:'tag '+(a===q.a?'ok':'none')},'Your answer: '+(a===null?'none':q.o[a])),
        h('span',{class:'tag ok'},'Correct answer: '+q.o[q.a])));
      list.push(r);return;
    }
    q.o.forEach((o,k)=>{
      const cls=k===q.a?'right':(k===a?'wrong':'');
      r.appendChild(h('div',{class:'ro '+cls},h('span',{class:'k'},L[k]),h('span',{class:'x'},o),
        k===q.a?h('em',{style:'color:var(--ok)'},'Correct answer'):(k===a?h('em',{style:'color:var(--bad)'},'Your answer'):null)));
    });
    list.push(r);
  });
  if(!list.length)list.push(h('p',{class:'label'},'Nothing in this list.'));
  const foot=h('div',{class:'footer nav',style:'justify-content:center'},
    h('button',{class:'btn',type:'button',id:'retake',on:{click:()=>start(S.i)}},'Retake test'),
    h('button',{class:'btn ghost',type:'button',id:'home',on:{click:()=>section(curSec,curTab)}},'All tests'),
    h('button',{class:'btn ghost',type:'button',id:'courses',on:{click:home}},'All courses'));
  mount(...top,...list,foot);
  if(filter==='all'&&!S.counted){S.counted=true;countUp(document.querySelector('.big .n'),ok)}
}
unlockFromHash().then(d=>{if(!d)intro()});

if('serviceWorker' in navigator && /^https?:/.test(location.protocol)){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})})}
