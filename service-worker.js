// ======================================================
// PenguinLogic HSE Dashboard
// service-worker.js
// Offline PWA Support
// ======================================================


// ======================================================
// CACHE CONFIGURATION
// ======================================================

const CACHE_PREFIX =
  "penguinlogic-hse-";

const CACHE_NAME =
  `${CACHE_PREFIX}v4`;


// Core files required for the app
const CORE_FILES = [

  "./",

  "./index.html",

  "./style.css",

  "./app.js",

  "./db.js",

  "./manifest.json"

];


// Additional PWA assets
const OPTIONAL_FILES = [

  "./icons/icon-192.png",

  "./icons/icon-512.png"

];


// ======================================================
// INSTALL
// Cache core application files
// ======================================================

self.addEventListener(
  "install",
  (event) => {

    event.waitUntil(

      (async () => {

        const cache =
          await caches.open(
            CACHE_NAME
          );


        // Core files must be cached
        await cache.addAll(
          CORE_FILES
        );


        // Icons are cached individually
        // so a missing icon will not break
        // the entire service worker install.
        await Promise.allSettled(

          OPTIONAL_FILES.map(
            file =>
              cache.add(
                file
              )
          )

        );


        await self.skipWaiting();

      })()

    );

  }
);


// ======================================================
// ACTIVATE
// Remove old PenguinLogic HSE caches only
// ======================================================

self.addEventListener(
  "activate",
  (event) => {

    event.waitUntil(

      (async () => {

        const cacheNames =
          await caches.keys();


        await Promise.all(

          cacheNames

            .filter(
              cacheName =>

                cacheName.startsWith(
                  CACHE_PREFIX
                ) &&

                cacheName !==
                  CACHE_NAME
            )

            .map(
              cacheName =>
                caches.delete(
                  cacheName
                )
            )

        );


        await self.clients.claim();

      })()

    );

  }
);


// ======================================================
// FETCH
// ======================================================

self.addEventListener(
  "fetch",
  (event) => {

    const request =
      event.request;


    // Only process GET requests
    if (
      request.method !== "GET"
    ) {

      return;

    }


    const requestURL =
      new URL(
        request.url
      );


    // Ignore external resources
    if (
      requestURL.origin !==
      self.location.origin
    ) {

      return;

    }


    // ==================================================
    // PAGE NAVIGATION
    // Network first → cached app fallback
    // ==================================================

    if (
      request.mode ===
      "navigate"
    ) {

      event.respondWith(

        (async () => {

          try {

            const networkResponse =
              await fetch(
                request
              );


            if (
              networkResponse &&
              networkResponse.ok
            ) {

              const cache =
                await caches.open(
                  CACHE_NAME
                );


              await cache.put(
                "./index.html",
                networkResponse.clone()
              );

            }


            return networkResponse;

          } catch (error) {

            const cachedPage =
              await caches.match(
                "./index.html"
              );


            if (
              cachedPage
            ) {

              return cachedPage;

            }


            const cachedRoot =
              await caches.match(
                "./"
              );


            if (
              cachedRoot
            ) {

              return cachedRoot;

            }


            throw error;

          }

        })()

      );


      return;

    }


    // ==================================================
    // STATIC APP FILES
    // Network first → cache fallback
    //
    // This avoids old cached app.js/style.css
    // being used when a new version is available.
    // ==================================================

    event.respondWith(

      (async () => {

        try {

          const networkResponse =
            await fetch(
              request
            );


          if (
            networkResponse &&
            networkResponse.ok
          ) {

            const cache =
              await caches.open(
                CACHE_NAME
              );


            await cache.put(
              request,
              networkResponse.clone()
            );

          }


          return networkResponse;

        } catch (error) {

          const cachedResponse =
            await caches.match(
              request
            );


          if (
            cachedResponse
          ) {

            return cachedResponse;

          }


          console.error(
            "Offline resource unavailable:",
            request.url
          );


          throw error;

        }

      })()

    );

  }
);