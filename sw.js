const V='showcase-v1',SH='shared-shots';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method==='POST'&&u.pathname.endsWith('/share-target')){
  e.respondWith((async()=>{
   const files=(await r.formData()).getAll('shots'),c=await caches.open(SH);
   for(let i=0;i<files.length;i++){const f=files[i];
    await c.put(new URL('shared/'+i+'-'+encodeURIComponent(f.name||'shot.png'),self.registration.scope).href,new Response(f,{headers:{'Content-Type':f.type||'image/png'}}))}
   return Response.redirect(new URL('./?shared=1',self.registration.scope).href,303)})());
  return}
 if(r.method!=='GET')return;
 if(u.hostname==='cdn.jsdelivr.net'){
  e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r);if(m)return m;const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}));return}
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(n=>{if(n.ok){const k=n.clone();caches.open(V).then(c=>c.put(r,k))}return n}).catch(()=>caches.match(r,{ignoreSearch:true})))}
});
