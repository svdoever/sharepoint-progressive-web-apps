/* code from https://developers.google.com/web/fundamentals/getting-started/primers/service-workers */

var CACHE_NAME = 'sptitle-cache-v1';
var urlsToCache = [
    'favicon-16x16.png',
    'index.html',
    'es6-promise.min.js',
    'fetch.min.js'
];

self.addEventListener('install', function (event) {
    console.log('Service Worker installing.');
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');  
});

self.addEventListener('fetch', function (event) {
    console.log("service worker intercepting fetch()");
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    console.log('respond from cache for url ' + response.url);
                    return response;
                }
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();
                console.log("fetching request: " + fetchRequest);
                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            //console.log("Invalid response from fetch(): ", response);
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                console.log("Cache the fetched response for request ", event.request);
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            }
            )
    );
});