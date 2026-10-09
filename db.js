// ======================================================
// PenguinLogic HSE Dashboard
// db.js
// Local IndexedDB Storage
// ======================================================


// ======================================================
// DATABASE CONFIGURATION
// ======================================================

const DB_NAME =
  "PenguinLogicHSE";

const DB_VERSION =
  1;

const STORE_NAME =
  "nearMissRecords";


// ======================================================
// OPEN DATABASE
// ======================================================

function openDatabase() {

  return new Promise(
    (resolve, reject) => {

      if (
        !("indexedDB" in window)
      ) {

        reject(
          new Error(
            "IndexedDB is not supported by this browser."
          )
        );

        return;

      }


      const request =
        indexedDB.open(
          DB_NAME,
          DB_VERSION
        );


      // --------------------------------------------------
      // CREATE DATABASE STRUCTURE
      // Runs only when database is first created
      // or DB_VERSION changes.
      // --------------------------------------------------

      request.onupgradeneeded =
        (event) => {

          const db =
            event.target.result;


          if (
            !db.objectStoreNames.contains(
              STORE_NAME
            )
          ) {

            const store =
              db.createObjectStore(
                STORE_NAME,
                {
                  keyPath: "id",
                  autoIncrement: true
                }
              );


            store.createIndex(
              "date",
              "date",
              {
                unique: false
              }
            );


            store.createIndex(
              "area",
              "area",
              {
                unique: false
              }
            );


            store.createIndex(
              "hazard",
              "hazard",
              {
                unique: false
              }
            );


            store.createIndex(
              "riskLevel",
              "riskLevel",
              {
                unique: false
              }
            );


            store.createIndex(
              "createdAt",
              "createdAt",
              {
                unique: false
              }
            );

          }

        };


      // --------------------------------------------------
      // DATABASE OPENED SUCCESSFULLY
      // --------------------------------------------------

      request.onsuccess =
        () => {

          const db =
            request.result;


          // If a future app version
          // needs a database upgrade,
          // close this connection automatically.
          db.onversionchange =
            () => {

              db.close();

            };


          resolve(
            db
          );

        };


      // --------------------------------------------------
      // DATABASE OPEN ERROR
      // --------------------------------------------------

      request.onerror =
        () => {

          reject(
            request.error ||
            new Error(
              "Unable to open local database."
            )
          );

        };


      // --------------------------------------------------
      // DATABASE UPGRADE BLOCKED
      // --------------------------------------------------

      request.onblocked =
        () => {

          console.warn(
            "Database update blocked. Close other open tabs of PenguinLogic HSE."
          );

        };

    }
  );

}


// ======================================================
// ADD RECORD
// Includes text fields + optional image/PDF evidence
// ======================================================

async function addRecord(record) {

  if (
    !record ||
    typeof record !== "object"
  ) {

    throw new Error(
      "Invalid record data."
    );

  }


  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      let newRecordId;


      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      /*
        IndexedDB supports structured cloning.

        This means record.evidenceFile may contain
        a File or Blob object and can be stored
        directly without converting it to Base64.
      */

      const request =
        store.add(
          record
        );


      request.onsuccess =
        () => {

          newRecordId =
            request.result;

        };


      transaction.oncomplete =
        () => {

          db.close();


          resolve(
            newRecordId
          );

        };


      transaction.onerror =
        () => {

          const error =
            transaction.error ||
            request.error ||
            new Error(
              "Unable to save record."
            );


          db.close();


          reject(
            error
          );

        };


      transaction.onabort =
        () => {

          const error =
            transaction.error ||
            new Error(
              "Saving record was cancelled."
            );


          db.close();


          reject(
            error
          );

        };

    }
  );

}


// ======================================================
// GET ALL RECORDS
// Includes optional stored evidence
// ======================================================

async function getAllRecords() {

  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      let records =
        [];


      const transaction =
        db.transaction(
          STORE_NAME,
          "readonly"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      const request =
        store.getAll();


      request.onsuccess =
        () => {

          records =
            Array.isArray(
              request.result
            )
              ? request.result
              : [];

        };


      transaction.oncomplete =
        () => {

          db.close();


          resolve(
            records
          );

        };


      transaction.onerror =
        () => {

          const error =
            transaction.error ||
            request.error ||
            new Error(
              "Unable to load records."
            );


          db.close();


          reject(
            error
          );

        };


      transaction.onabort =
        () => {

          const error =
            transaction.error ||
            new Error(
              "Loading records was cancelled."
            );


          db.close();


          reject(
            error
          );

        };

    }
  );

}


// ======================================================
// DELETE RECORD
// Deletes record + attached evidence together
// ======================================================

async function deleteRecord(id) {

  const numericId =
    Number(
      id
    );


  if (
    !Number.isInteger(
      numericId
    ) ||
    numericId <= 0
  ) {

    throw new Error(
      "Invalid record ID."
    );

  }


  const db =
    await openDatabase();


  return new Promise(
    (resolve, reject) => {

      const transaction =
        db.transaction(
          STORE_NAME,
          "readwrite"
        );


      const store =
        transaction.objectStore(
          STORE_NAME
        );


      /*
        Evidence is stored inside the same record.

        Therefore deleting the record also deletes
        its image/PDF evidence automatically.
      */

      const request =
        store.delete(
          numericId
        );


      transaction.oncomplete =
        () => {

          db.close();


          resolve();

        };


      transaction.onerror =
        () => {

          const error =
            transaction.error ||
            request.error ||
            new Error(
              "Unable to delete record."
            );


          db.close();


          reject(
            error
          );

        };


      transaction.onabort =
        () => {

          const error =
            transaction.error ||
            new Error(
              "Deleting record was cancelled."
            );


          db.close();


          reject(
            error
          );

        };

    }
  );

}