const CACHE='moya-robota-v15-1-multi-job-20260803-20';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=v15-1-multi-job-20260803-20',
 './manifest.webmanifest?v=v15-1-multi-job-20260803-20',
 './icon-192.png',
 './icon-512.png',
 './src/app.js?v=v15-1-multi-job-20260803-20',
 './src/state.js?v=v15-1-multi-job-20260803-20',
 './src/storage.js?v=v15-1-multi-job-20260803-20',
 './src/payroll.js?v=v15-1-multi-job-20260803-20',
 './src/format.js?v=v15-1-multi-job-20260803-20',
 './src/ui.js?v=v15-1-multi-job-20260803-20'
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
