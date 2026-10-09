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
  `${CACHE_PREFIX}v11`;


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
          Core application files are required
          for offline operation.

          If one of these files cannot be fetched,
          the Service Worker installation will fail
          instead of installing an incomplete app.
        */
        await cache.addAll(
          CORE_FILES
        );


        /*
          Icons are optional during installation.

          They are cached separately so a temporary
          missing icon does not prevent the Service
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
          Activate this Service Worker immediately
          instead of waiting for old browser tabs
          or PWA sessions to close.
        */
        await self.skipWaiting();

      })()

    );

  }
);


// ======================================================
// ACTIVATE
// Remove previous PenguinLogic HSE caches
// ======================================================

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      (async () => {

        const cacheNames =
          await caches.keys();


        /*
          Delete only old PenguinLogic HSE caches.

          Other caches that may exist on the same
          origin are not touched.
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
          Allow the new Service Worker to control
          already-open pages immediately.
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
      Only intercept GET requests.

      IndexedDB data, form operations and other
      non-GET browser actions are not affected.
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
      Ignore resources from external origins.
    */
    if (
      requestURL.origin !==
      self.location.origin
    ) {

      return;

    }


    // ==================================================
    // PAGE NAVIGATION
    // Network first → cache fallback
    // ==================================================

    if (
      request.mode ===
      "navigate"
    ) {

      event.respondWith(

        (async () => {

          try {

            /*
              Prefer the latest page from
              the network whenever online.
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
                Keep the newest index.html
                available for offline use.
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
              Network unavailable.

              Try cached index.html first.
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


            /*
              Fallback to cached app root.
            */
            const cachedRoot =
              await caches.match(
                "./"
              );


            if (
              cachedRoot
            ) {

              return cachedRoot;

            }


            /*
              No cached page is available.
            */
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
    // Applies to:
    // - app.js
    // - style.css
    // - db.js
    // - manifest.json
    // - icons
    //
    // Network-first helps prevent old app code
    // remaining active after deployment.
    // ==================================================

    event.respondWith(

      (async () => {

        try {

          const networkResponse =
            await fetch(
              request
            );


          /*
            Store only successful responses.
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
            If offline, try the cached version.
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
