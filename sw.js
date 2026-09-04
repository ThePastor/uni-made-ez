/* UNI Made EZ — service worker, build 2.12.
   Keeps a copy of the page so it opens with no connection, and lets the browser install it
   to a home screen. The whole app is one file, so the "offline copy" really is just that file
   plus its icons; nothing here touches your subjects, which live in the browser's own storage. */
const V = '2.12';
const APP = 'umez-app-v' + V;      // the page and its icons, replaced whole on every build
const RUNTIME = 'umez-runtime-v1'; // web fonts, kept across builds

const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  // addAll fails as a unit; a partial cache would be worse than none, so let it reject quietly
  e.waitUntil(caches.open(APP).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== APP && k !== RUNTIME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// the page asks for the new build to take over when you press Reload on its toast
self.addEventListener('message', e => { if (e.data && e.data.type === 'skip-waiting') self.skipWaiting(); });

// A stalled connection is not the same as no connection. Without a deadline the worker can sit
// waiting on a request that will never answer — and because the worker owns the response, the
// page's load event never fires and the tab spins. Every network call it makes gets a deadline.
function timedFetch(req, ms) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(req, { signal: ctl.signal }).finally(() => clearTimeout(t));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // The page itself: network first, so a new build is picked up as soon as it is published,
  // and the cached copy is only used when the network cannot answer.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await timedFetch(req, 4000);
        if (fresh && fresh.ok) { const c = await caches.open(APP); await c.put('./index.html', fresh.clone()); }
        return fresh;
      } catch (err) {
        const c = await caches.open(APP);
        return (await c.match('./index.html')) || (await c.match('./')) ||
          new Response('<h1>Offline</h1><p>Open UNI Made EZ once with a connection and it will work without one after that.</p>',
            { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  // Icons and the manifest: from the cache, which is where they were put at install.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || timedFetch(req, 6000).then(res => {
      if (res && res.ok) { const copy = res.clone(); caches.open(APP).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit || Response.error())));
    return;
  }

  // Google's web fonts: serve the copy we have, refresh it in the background. Everything else
  // off-origin (the scan reader, reading a web address) is left alone — those need the network.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(RUNTIME).then(async c => {
      const hit = await c.match(req);
      const net = timedFetch(req, 5000).then(res => {
        if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone());
        return res;
      }).catch(() => hit || Response.error());
      return hit || net;
    }));
  }
});
