const scope = self.registration.scope;
const prefix = 'japantrip-' + scope + '-';
const version = prefix + '__BUILD_VERSION__';
const files = __PRECACHE_FILES__;
const indexUrl = new URL('index.html', scope).href;
const staticUrls = new Set(files.map(path => new URL(path, scope).href));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(version);
    await cache.addAll([...staticUrls].map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== version).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const navigation = request.mode === 'navigate' && (
    url.pathname === new URL(scope).pathname || url.pathname === new URL(indexUrl).pathname
  ) && url.origin === self.location.origin;
  if (!navigation && !staticUrls.has(url.href)) return;
  event.respondWith((async () => {
    const cache = await caches.open(version);
    const cached = await cache.match(navigation ? indexUrl : url.href, { ignoreVary: true });
    return cached ?? fetch(request);
  })());
});
