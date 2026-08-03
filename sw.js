const CACHE='moya-robota-v16-7-scroll-plans-fix-20260804-02';
const ASSETS=[
 './',
 './index.html',
 './styles.css?v=v16-7-scroll-plans-fix-20260804-02',
 './manifest.webmanifest?v=v16-7-scroll-plans-fix-20260804-02',
 './icon-192.png',
 './icon-512.png',
 './widget-state-schema.json',
 './src/app.js?v=v16-7-scroll-plans-fix-20260804-02',
 './src/state.js?v=v16-7-scroll-plans-fix-20260804-02',
 './src/storage.js?v=v16-7-scroll-plans-fix-20260804-02',
 './src/payroll.js?v=v16-7-scroll-plans-fix-20260804-02',
 './src/format.js?v=v16-7-scroll-plans-fix-20260804-02',
 './src/ui.js?v=v16-7-scroll-plans-fix-20260804-02',
 './src/widget-state.js?v=v16-7-scroll-plans-fix-20260804-02'
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

async function networkFirst(request){
 const cache=await caches.open(CACHE);
 try{
  const response=await fetch(request);
  if(response&&response.ok)cache.put(request,response.clone());
  return response;
 }catch{
  return (await cache.match(request))||(await cache.match('./index.html'));
 }
}

async function staleWhileRevalidate(request){
 const cache=await caches.open(CACHE);
 const cached=await cache.match(request);
 const network=fetch(request).then(response=>{
  if(response&&response.ok)cache.put(request,response.clone());
  return response;
 }).catch(()=>null);
 return cached||network||(await cache.match('./index.html'));
}

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 if(event.request.mode==='navigate'){
  event.respondWith(networkFirst(event.request));
  return;
 }
 event.respondWith(staleWhileRevalidate(event.request));
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
