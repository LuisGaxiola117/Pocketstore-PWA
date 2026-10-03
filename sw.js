const CACHE_NAME = 'pocket-store-shell-v3';
const DATA_CACHE = 'pocket-store-data-v3';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => ![CACHE_NAME, DATA_CACHE].includes(key)).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === 'https://jsonplaceholder.typicode.com') {
    event.respondWith(networkFirst(event.request, DATA_CACHE));
    return;
  }
  if (event.request.method !== 'GET') return;
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request).then((response) => {
    const responseCopy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
    return response;
  });
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    const responseCopy = response.clone();
    caches.open(cacheName).then((cache) => cache.put(request, responseCopy));
    return response;
  } catch {
    return caches.match(request) || new Response('{"products":[]}', { headers: { 'Content-Type': 'application/json' } });
  }
}