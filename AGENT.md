# Agent Notes

## Service Worker Upgrade Behavior
- Current service worker version: `v1.6` (`public/sw.js`).
- Uses a `BloomFocus_` cache prefix with `KNOWN_PREFIXES` to delete any older caches on activate.
- `skipWaiting()` in install + `clients.claim()` in activate for immediate takeover.
- On activate, it forces open clients to reload (`client.navigate(client.url)`) so pages pick up new assets right away after deploys.
- When bumping the SW, increment `VERSION` to invalidate caches and trigger the above flow.
