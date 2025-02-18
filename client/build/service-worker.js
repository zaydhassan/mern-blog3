const CACHE_NAME = "blog-app-cache-v1";
const urlsToCache = [
  "/",
  "/blogs",
  "/my-blogs",
  "/create-blog",
  "/offline.html",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache).catch((err) => {
          console.error("Failed to cache during install:", err);
        });
      })
    );
  });


self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/v1/blog/")) {
        event.respondWith(
          caches.match(event.request).then((response) => {
            return (
              response ||
              fetch(event.request)
                .then((fetchedResponse) => {
                  return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchedResponse.clone());
                    return fetchedResponse;
                  });
                })
                .catch(() => caches.match("/offline.html"))
            );
          })
        );
      }
      
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
