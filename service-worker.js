var CACHE = 'v3';
var API_HOST = 'vapi.maciekmm.net';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/js/bundle.js'
      ]);
    })
  );
});

this.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE) {
          return caches.delete(key);
        }
      }));
    })
  );
});

this.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  if (url.hostname === API_HOST) {
    event.respondWith(
      fetch(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          return caches.open(CACHE).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
