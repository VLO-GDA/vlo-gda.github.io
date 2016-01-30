var CACHE = 'v1';
var API_HOST = 'vapi.maciekmm.net';

this.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  if (url.hostname === API_HOST) {
    event.respondWith(
      fetch(event.request)
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
		if(response) {
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
