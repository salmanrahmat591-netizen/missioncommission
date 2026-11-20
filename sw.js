/* Mission Commission service worker.
   Pages, scripts and data: network first, so a new deploy shows up at once. Falls back to the saved copy when offline.
   Pictures, icons and PDFs: saved on first use and served from the device after that.
   Change VERSION when you want every device to drop its old saved files. */
const VERSION = 'mc-v1';
const CORE = ['./', 'index.html', 'style.css', 'app.js', 'data/tests.js', 'data/files.js', 'data/admin.js',
  'icons/logo-460.webp', 'icons/logo-120.webp', 'icons/icon-192.png', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  const staticAsset = /\/(images|icons|pdfs)\//.test(u.pathname);
  if (staticAsset) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(r, copy)); }
      return res;
    })));
    return;
  }
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
});
