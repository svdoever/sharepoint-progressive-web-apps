// service-worker.js provides offline functionality
//
// We can't pre-install artifacts when hosted in SharePoint, we need authenticated requests for caching

/* Increase caching version for new releases */
var CACHE_NAME = 'sptitle-cache-v1';

self.addEventListener('install', function (event) {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');  
});

self.addEventListener('fetch', function (event) {
    var prefix = 'http://localhost:8081';
    console.log("service worker intercepting fetch(" + event.request.url + "," +  event.request.method + ")");
    if (event.request.method !== 'GET') return;
    if (!event.request.url.toLowerCase().startsWith(prefix.toLowerCase())) return;

    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                console.log('caches match executed, response:', response);
                // Cache hit - return response
                if (response) {
                    console.log('respond from cache for url ' + response.url);
                    return response;
                }
                // no match from cache

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                console.log("intercepting fetch request: ", event.request);
                var fetchRequest = new Request(event.request.url, {
                    method: 'GET', //event.request.method,
                    headers: event.request.headers,
                    context: event.request.context,
                    referrer:event.request.url, //event.request.referrer,
                    referrerPolicy: event.request.referrerPolicy,
                    mode: 'cors', 
                    credentials: 'include',
                    redirect: 'manual',
                    body: event.request.body
                });
                console.log("fetching request: ", fetchRequest);
                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            console.log("Invalid response from fetch(): ", response);
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
                ).catch(function(error) {
                    console.error('Fetching failed:', error);

                    throw error;
                });
            }
            )
            .catch(function(error) {
                console.error('Cache match failed:', error);

                throw error;
            })
    );
});