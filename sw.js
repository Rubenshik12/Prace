const CACHE='moya-robota-v10-plans-20260803-1';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=v10-plans-20260803-1',
 './manifest.webmanifest?v=v10-plans-20260803-1',
 './icon-192.png',
 './icon-512.png',
 './src/app.js?v=v10-plans-20260803-1',
 './src/state.js?v=v10-plans-20260803-1',
 './src/storage.js?v=v10-plans-20260803-1',
 './src/payroll.js?v=v10-plans-20260803-1',
 './src/format.js?v=v10-plans-20260803-1',
 './src/ui.js?v=v10-plans-20260803-1'
];
self.addEventListener('install',event=>{
 self.skipWaiting();
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([
  self.clients.claim(),
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
 ]));
});
self.addEventListener('fetch',event=>{
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(
  fetch(event.request).then(response=>{
   const copy=response.clone();
   caches.open(CACHE).then(cache=>cache.put(event.request,copy));
   return response;
  }).catch(()=>caches.match(event.request))
 );
});
