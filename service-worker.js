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
  `${CACHE_PREFIX}v8`;


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
  event => {

    event.waitUntil(

      (async () => {

        const cache =
          await caches.open(
            CACHE_NAME
          );


        /*
          Core application files must be available
          for the app to work offline.
        */
        await cache.addAll(
          CORE_FILES
        );


        /*
          Cache PWA icons separately.

          If an icon is temporarily unavailable,
          it will not prevent the whole Service
          Worker from installing.
        */
        await Promise.allSettled(

          OPTIONAL_FILES.map(
            file =>
              cache.add(
                file
              )
          )

        );


        /*
          Activate the new Service Worker
          without waiting for old tabs to close.
        */
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
  event => {

    event.waitUntil(

      (async () => {

        const cacheNames =
          await caches.keys();


        /*
          Delete only old caches belonging to
          PenguinLogic HSE.

          Other caches on the same origin are
          left untouched.
        */
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


        /*
          Allow this Service Worker to control
          currently open pages immediately.
        */
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
  event => {

    const request =
      event.request;


    /*
      Only handle GET requests.

      IndexedDB records and other browser
      operations are not affected.
    */
    if (
      request.method !==
      "GET"
    ) {

      return;

    }


    const requestURL =
      new URL(
        request.url
      );


    /*
      Only handle files from the same origin.

      External websites, APIs or third-party
      resources are ignored.
    */
    if (
      requestURL.origin !==
      self.location.origin
    ) {

      return;

    }


    // ==================================================
    // PAGE NAVIGATION
    // Network first → cached page fallback
    // ==================================================

    if (
      request.mode ===
      "navigate"
    ) {

      event.respondWith(

        (async () => {

          try {

            /*
              Prefer the latest online version.
            */
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


              /*
                Store the latest page as the
                offline fallback.
              */
              await cache.put(

                "./index.html",

                networkResponse.clone()

              );

            }


            return networkResponse;


          } catch (
            error
          ) {

            /*
              Device is offline or the network
              request failed.
            */

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
    // STATIC APPLICATION FILES
    // Network first → cache fallback
    //
    // This prevents outdated app.js, style.css,
    // manifest.json or icons from being used
    // when a newer version is available.
    // ==================================================

    event.respondWith(

      (async () => {

        try {

          const networkResponse =
            await fetch(
              request
            );


          /*
            Cache only successful responses.
          */
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


        } catch (
          error
        ) {

          /*
            Network unavailable:
            try the cached copy.
          */
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
