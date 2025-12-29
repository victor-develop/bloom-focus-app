
const APP_PREFIX = 'BloomFocus_';     // Identifier for this app
const VERSION = 'v1.1';              // Version of the off-line cache
const CACHE_NAME = APP_PREFIX + VERSION;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './components/Timer.tsx',
  './components/Meadow.tsx'
];

// Cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(ASSETS);
    })
  );
});

// Delete outdated caches belonging ONLY to this app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      const cacheWhitelist = keyList.filter((key) => {
        // Only track caches starting with our app prefix
        return key.indexOf(APP_PREFIX) === 0;
      });
      // Add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map((key) => {
        // If the key belongs to this app but isn't the current version, delete it
        if (key.indexOf(APP_PREFIX) === 0 && key !== CACHE_NAME) {
          console.log('Deleting old BloomFocus cache : ' + key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Respond with cached resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
