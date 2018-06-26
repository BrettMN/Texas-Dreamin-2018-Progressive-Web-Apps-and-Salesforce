// If using page contenttype application/json

// Files to cache
var version = '1.0.0';
var cacheName = `scoreboard-${version}`;
var appShellFiles = [
  'localforage.min.js',
  'vue.js',
  'vue-router.js',
  'data.js',
  'components.js',
  'router.js',
  'app.js'
];

// var gamesImages = [];
// for (var i = 0; i < games.length; i++) {
//   gamesImages.push('data/img/' + games[i].slug + '.jpg');
// }

var contentToCache = appShellFiles; //.concat(gamesImages);

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache).then(() => self.skipWaiting());
    })
  );
});

// Fetching content using Service Worker
// self.addEventListener('fetch', function(e) {
//   e.respondWith(
//     caches.match(e.request).then(function(r) {
//       console.log('[Service Worker] Fetching resource: ' + e.request.url);
//       return (
//         r ||
//         fetch(e.request).then(function(response) {
//           return caches.open(cacheName).then(function(cache) {
//             console.log('[Service Worker] Caching new resource: ' + e.request.url);
//             cache.put(e.request, response.clone());
//             return response;
//           });
//         })
//       );
//     })
//   );
// });

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console
  event.respondWith(
    caches
      .open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
