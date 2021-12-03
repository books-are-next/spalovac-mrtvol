/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-fe7befc';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./spalovac_mrtvol_002.html","./spalovac_mrtvol_006.html","./spalovac_mrtvol_007.html","./spalovac_mrtvol_008.html","./spalovac_mrtvol_009.html","./spalovac_mrtvol_010.html","./spalovac_mrtvol_011.html","./spalovac_mrtvol_012.html","./spalovac_mrtvol_013.html","./spalovac_mrtvol_014.html","./spalovac_mrtvol_015.html","./spalovac_mrtvol_016.html","./spalovac_mrtvol_017.html","./spalovac_mrtvol_018.html","./spalovac_mrtvol_019.html","./spalovac_mrtvol_020.html","./fonts/Literata-Italic-var.woff2","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/LiterataTT-TextRegular.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/SpaceGroteskVF.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image001_fmt.png","./resources/image002_fmt.png","./resources/obalka_spalovac_mrtvol_fmt.png","./resources/upoutavka_eknihy_fmt.png","./scripts/bundle.js","./template-images/circles.png","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
