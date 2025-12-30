const APP_PREFIX = 'BloomFocus_';
const VERSION = 'v1.3';
const CACHE_NAME = `${APP_PREFIX}${VERSION}`;

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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key.startsWith(APP_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
