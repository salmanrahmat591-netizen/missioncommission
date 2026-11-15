/* Offline support. Bump VERSION whenever you upload changed files so phones pick up the new version. */
const VERSION='mc-v1';
const SHELL=['./','index.html','style.css','app.js','data/tests.js','manifest.webmanifest','privacy.html','icons/icon-192.png','icons/favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  const media=/\/(images|pdfs|icons)\//.test(u.pathname);
  if(media){ /* pictures and PDFs: cache first, saved the first time they are opened */
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res})));
  }else{ /* pages, code, questions: network first so updates arrive, cache when offline */
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(hit=>hit||caches.match('index.html'))));
  }
});
