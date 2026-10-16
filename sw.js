// Bump VERSION whenever you change index.html so phones pick up the new copy.
const VERSION="equity-lab-v10";
const CORE=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);
  // Google Fonts: cache on first use so they also work offline
  if(url.hostname.endsWith("googleapis.com")||url.hostname.endsWith("gstatic.com")){
    e.respondWith(caches.open(VERSION).then(c=>c.match(req).then(hit=>hit||fetch(req).then(r=>{c.put(req,r.clone());return r}).catch(()=>hit))));return}
  // App files: network first (so updates arrive), fall back to cache offline
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));return r}).catch(()=>caches.match(req).then(h=>h||caches.match("index.html"))));
});
