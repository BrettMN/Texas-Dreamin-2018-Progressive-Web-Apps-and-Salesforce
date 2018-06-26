
importScripts(localForageUrl);

const version = '1.0.4';
const cacheName = `scoreboard-${version}`;
const appShellFiles = filesFromPwaStaticResource;

const contentToCache = appShellFiles;

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache
        .addAll(contentToCache)
        .then(() => {
          self.skipWaiting();
        })
        .catch(error => console.error('Error occured in cache.addAll', { error }));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Listen for etch events and return cached version if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return (
          response ||
          fetch(event.request).catch(error => {
            console.log(error);
          })
        );
      })
      .catch(error => {
        console.log(error);
      })
  );
});

function checkForNewGamesToUpdate() {
  localforage.getItem('gamesToSync').then(gamesToUpdate => {
    console.table(gamesToUpdate);

    if (gamesToUpdate && gamesToUpdate.length > 0) {
      localforage.getItem('accessToken').then(accessToken => {
        let headers = new Headers();
        headers.append('Authorization', `Bearer ${accessToken}`);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        let body = JSON.stringify({ scoresString: JSON.stringify(gamesToUpdate) });
        console.log({ body });

        fetch('/services/apexrest/v1/games/', {
          method: 'put',
          headers: headers,
          body: body
        })
          .then(results => {
            results.json().then(values => {
              localforage.setItem('gamesToSync', [], () => {
                console.log('Updated games from SW');
                console.log(values);
              });
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  });
}

let update = setInterval(() => {
  console.log('SW update');
  checkForNewGamesToUpdate();
}, 5000);
