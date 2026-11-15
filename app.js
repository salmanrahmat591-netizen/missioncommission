
/* Fonts load after the page is already usable, so a slow connection never blocks the first screen. */
setTimeout(function(){try{var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap';document.head.appendChild(l)}catch(e){}},400);
const MINUTES = 30;
const SECS = MINUTES*60;
const app = document.getElementById('app');
const LS = {get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const L = 'ABCDEF';
/* Picture questions load from images/<name>. */
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
  return h('div',{class:'mast'},h('div',{class:'wrap'},
    h('div',{class:'brand'},svgBox('badge',BADGE),h('div',{},h('h1',{},'Mission Commission'),h('p',{},sub))),btns));
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
const FILES={"tcc": [{"name": "TCC English Most Repeated MCQs", "path": "pdfs/TCC-English-Most-Repeated-MCQs.pdf", "note": "PDF  |  23 pages  |  143 KB"}, {"name": "TCC Top Physics Questions", "path": "pdfs/TCC-Top-Physics-Questions.pdf", "note": "PDF  |  14 pages  |  147 KB"}, {"name": "TCC Physics Important Questions", "path": "pdfs/TCC-Physics-Important-Questions.pdf", "note": "PDF  |  9 pages  |  107 KB"}, {"name": "TCC37 Previously Most Repeated Physics", "path": "pdfs/TCC37-Previously-Most-Repeated-Physics.pdf", "note": "PDF  |  15 pages  |  145 KB"}, {"name": "TCC35 Warranted Academic", "path": "pdfs/TCC35-Warranted-Academic.pdf", "note": "PDF  |  15 pages  |  145 KB"}, {"name": "TCC37 Guaranteed Academic", "path": "pdfs/TCC37-Guaranteed-Academic.pdf", "note": "PDF  |  44 pages  |  213 KB"}, {"name": "TCC37 Past Papers Questions", "path": "pdfs/TCC37-Past-Papers-Questions.pdf", "note": "PDF  |  13 pages  |  119 KB"}, {"name": "TCC37 Initial Test Past Papers", "path": "pdfs/TCC37-Initial-Test-Past-Papers.pdf", "note": "PDF  |  9 pages  |  101 KB"}, {"name": "TCC Initial Test Academic Questions", "path": "pdfs/TCC-Initial-Test-Academic-Questions.pdf", "note": "PDF  |  5 pages  |  37 KB"}, {"name": "TCC Math and Chemistry Most Repeated", "path": "pdfs/TCC-Math-Chemistry-Most-Repeated.pdf", "note": "PDF  |  11 pages  |  56 KB"}, {"name": "TCC37 Guaranteed Verbal", "path": "pdfs/TCC37-Guaranteed-Verbal.pdf", "note": "PDF  |  12 pages  |  119 KB"}, {"name": "Maths Definitions HSSC-I (FSc Part 1)", "path": "pdfs/Definition-Maths-HSSC-I.pdf", "note": "PDF  |  10 pages  |  191 KB"}, {"name": "Maths Definitions HSSC-II (FSc Part 2)", "path": "pdfs/Definition-Maths-HSSC-II.pdf", "note": "PDF  |  6 pages  |  159 KB"}]};
/* ---------- Course access (WhatsApp request -> owner-signed unlock code, 30 days per course) ---------- */
const PUBKEY={kty:'EC',crv:'P-256',x:'B9zNDyali6CUTAOBnnvAhDmsU7bbpVZ7qV6vSuQyKbM',y:'N9ID3D8zQfM920r36i_Wjqo2AQh9GD8BshbI9Rg6mp8',ext:true};
const OWNER_WA='923187504964', ACCESS_DAYS=30;
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
    if(c!==id)return {ok:false,msg:'This code is for a different course.'};
    if(d!==deviceId())return {ok:false,msg:'This code was issued for another device. Send a new request from this device.'};
    if(!(exp>iss)||exp-iss>32*86400)return {ok:false,msg:'This code is not valid.'};
    if(Date.now()>=exp*1000)return {ok:false,msg:'This code has expired. Send a new request.'};
    if(Date.now()<iss*1000-86400000)return {ok:false,msg:'Your device clock looks wrong. Fix the date and time, then try again.'};
    const all=LS.get('mc-access')||{};all[id]={d,iss,exp};LS.set('mc-access',all);
    LS.set('mc-seen',Math.max(LS.get('mc-seen')||0,Date.now()));
    return {ok:true,exp};
  }catch(e){return {ok:false,msg:'Could not check the code. Try again.'}}
}
const fmtDate=s=>new Date(s*1000).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
function lock(id){
  curSec=id;
  const sec=SECTIONS.find(s=>s.id===id), info=accessInfo(id), dev=deviceId();
  const reqCode='MC-'+id.toUpperCase()+'-'+dev;
  const msg='Assalam o Alaikum. I would like access to *'+sec.name+'* on Mission Commission.\nRequest code: '+reqCode;
  const wa='https://wa.me/'+OWNER_WA+'?text='+encodeURIComponent(msg);
  const note=info.s==='expired'?'Your 30-day access to this course ended on '+fmtDate(info.exp)+'. Send a new request to continue.':
    info.s==='clock'?'Your device clock was set back. Access is paused. Send a new request to continue.':
    'This course needs the owner’s permission. Access lasts 30 days.';
  const out=h('div',{class:'lockmsg',id:'lock-msg','aria-live':'polite'});
  const inp=h('input',{type:'text',id:'code-in',class:'codein',placeholder:'MC1.…  paste unlock code',autocomplete:'off',autocapitalize:'off',spellcheck:'false','aria-label':'Unlock code'});
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
        h('li',{},h('b',{},'Wait. '),'The owner replies with an unlock code, or declines.'),
        h('li',{},h('b',{},'Unlock. '),'Copy the code from WhatsApp and paste it below.')),
      h('div',{class:'lockacts'},h('a',{class:'btn',id:'wa-req',href:wa,target:'_blank',rel:'noopener'},'Request on WhatsApp'),copy),
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
  nodes.push(grid);
  nodes.push(h('p',{class:'label sitefoot'},'Free practice tests. Your answers and scores stay on this device. ',h('a',{href:'privacy.html'},'Privacy')));
  const run=savedRun();
  if(run){
    const t=TESTS[run.i], left=Math.max(0,Math.ceil((run.end-Date.now())/1000));
    nodes.splice(2,0,h('div',{class:'resume',id:'resume-box'},
      h('div',{},h('b',{},'Test in progress: '+t.sub),h('span',{class:'label'},left>0?'Time left '+fmt(left):'Time is up. Your saved answers will be marked.')),
      h('div',{class:'nav'},
        h('button',{class:'btn ghost',type:'button',id:'discard-run',on:{click:()=>{dropRun();home()}}},'Discard'),
        h('button',{class:'btn',type:'button',id:'resume-run',on:{click:()=>resume(run)}},left>0?'Resume':'See result'))));
  }
  mount(...nodes);
}

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
  const parts=sec.parts?sec.parts.filter(p=>allIdx.some(i=>inPart(i,p.id))):null;
  const idxs=sec.parts&&tab!=='files'?allIdx.filter(i=>inPart(i,tab)):allIdx;
  const saved=LS.get('issb-results')||{};
  const nodes=[masthead(sec.name,home),
    h('div',{class:'filters'},
      h('button',{class:'chip',type:'button',id:'back-courses',on:{click:home}},'All courses'),
      ...(parts?parts.map(p=>h('button',{class:'chip',type:'button',id:'tab-'+p.id,'aria-pressed':tab===p.id,on:{click:()=>section(id,p.id)}},p.name+' ('+allIdx.filter(i=>inPart(i,p.id)).length+')'))
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
      h('li',{},'Keys: number keys or A to E to answer, left and right arrows to move, F to flag.'))));
  mount(...nodes);
}

/* ---------- BRIEFING ---------- */
function briefing(i){
  const t=TESTS[i];
  const n=TESTS.filter((x,j)=>x.sub===t.sub&&j<=i).length;
  mount(masthead('Mission briefing',()=>section(curSec,curTab)),
    h('div',{class:'group'},
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
     end:Date.now()+SECS*1000,left:SECS,done:false,sec:curSec,tab:curTab};
  drawExam();
  timer=setInterval(tick,250);
}
/* In-progress test is saved after every change, so a refresh or closed tab does not lose answers. The clock keeps running. */
const RUN='mc-run';
function saveRun(){ if(S&&!S.done)LS.set(RUN,{i:S.i,idx:S.idx,ans:S.ans,flag:S.flag,end:S.end,sec:S.sec,tab:S.tab}); }
function dropRun(){ try{localStorage.removeItem(RUN)}catch(e){} }
function savedRun(){
  const r=LS.get(RUN);
  if(!r||!TESTS[r.i]||!Array.isArray(r.ans)||r.ans.length!==TESTS[r.i].qs.length){if(r)dropRun();return null}
  return r;
}
function resume(r){
  curSec=r.sec||curSec; curTab=r.tab||curTab;
  const t=TESTS[r.i];
  S={i:r.i,t,idx:Math.min(r.idx||0,t.qs.length-1),ans:r.ans,flag:r.flag||new Array(t.qs.length).fill(false),
     end:r.end,left:Math.max(0,Math.ceil((r.end-Date.now())/1000)),done:false,sec:curSec,tab:curTab};
  if(S.left<=0){finish(true);return}
  drawExam();
  timer=setInterval(tick,250);
}
window.addEventListener('beforeunload',e=>{ if(S&&!S.done&&document.getElementById('clock')){e.preventDefault();e.returnValue=''} });
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
    h('div',{class:'t'},h('button',{class:'theme',id:'exit',type:'button',style:'margin-right:10px',on:{click:confirmExit}},'\u2190 Exit'),title()),
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
  S.swap=false; saveRun();
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
      h('button',{class:'btn danger',type:'button',id:'leave',on:{click:()=>{document.getElementById('veil').remove();S.done=true;clearInterval(timer);dropRun();section(curSec,curTab)}}},'Leave test'))));
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
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  const nopt=S.t.qs[S.idx].o.length;
  if(k==='f'){S.flag[S.idx]=!S.flag[S.idx];drawExam()}
  else if(k.length===1&&'123456789'.includes(k)&&+k<=nopt)choose(+k-1);
  else if(k.length===1&&'abcde'.includes(k)&&'abcde'.indexOf(k)<nopt)choose('abcde'.indexOf(k));
  else if(k==='arrowright'&&S.idx<S.t.qs.length-1)go(S.idx+1);
  else if(k==='arrowleft'&&S.idx>0)go(S.idx-1);
});

/* ---------- RESULTS ---------- */
function finish(auto){
  if(S.done)return; S.done=true; clearInterval(timer); dropRun();
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
home();
