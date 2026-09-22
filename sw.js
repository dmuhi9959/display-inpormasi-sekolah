const CACHE='display-v5';
const FILES=['./','./index.html','./manifest.json'];

self.addEventListener('install',function(e){
e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES).catch(function(){return;});}));
self.skipWaiting();
});

self.addEventListener('fetch',function(e){
if(e.request.method!=='GET')return;
e.respondWith(
caches.match(e.request).then(function(r){
if(r)return r;
return fetch(e.request).then(function(resp){
if(resp&&resp.status===200&&resp.type==='basic'){
var c=resp.clone();
caches.open(CACHE).then(function(cache){cache.put(e.request,c);});
}
return resp;
}).catch(function(){return caches.match('./index.html');});
})
);
});

self.addEventListener('activate',function(e){
e.waitUntil(caches.keys().then(function(keys){
return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
}));
self.clients.claim();
});
