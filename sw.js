const CACHE='moya-robota-v16-5-shell-padding-fix-20260803-34';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=v16-5-shell-padding-fix-20260803-34',
 './manifest.webmanifest?v=v16-5-shell-padding-fix-20260803-34',
 './icon-192.png',
 './icon-512.png',
 './src/app.js?v=v16-5-shell-padding-fix-20260803-34',
 './src/state.js?v=v16-5-shell-padding-fix-20260803-34',
 './src/storage.js?v=v16-5-shell-padding-fix-20260803-34',
 './src/payroll.js?v=v16-5-shell-padding-fix-20260803-34',
 './src/format.js?v=v16-5-shell-padding-fix-20260803-34',
 './src/ui.js?v=v16-5-shell-padding-fix-20260803-34'
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

self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil(
  clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
   for(const client of list){
    if('focus' in client)return client.focus();
   }
   if(clients.openWindow)return clients.openWindow('./');
  })
 );
});
