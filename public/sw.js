const APP_PREFIX = 'BloomFocus_';
const VERSION = 'v1.7';
const CACHE_NAME = `${APP_PREFIX}${VERSION}`;
const KNOWN_PREFIXES = [APP_PREFIX, 'BloomFocus_'];

// Scope-aware base path so caching works on GitHub Pages subdirectories.
const BASE_PATH = (() => {
  const scopePath = new URL(self.registration.scope).pathname;
  return scopePath.endsWith('/') ? scopePath : `${scopePath}/`;
})();

const ASSETS = [
  BASE_PATH,
  `${BASE_PATH}index.html`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => {
        const isKnown = KNOWN_PREFIXES.some((prefix) => key.startsWith(prefix));
        if (isKnown && key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return undefined;
      })
    );
    await self.clients.claim();
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    clients.forEach((client) => {
      client.navigate(client.url);
    });
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
