// Open or create the database
const openRequest = indexedDB.open("myDatabase", 1);

openRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  // Create object store "gradestate" if it doesn't exist
  if (!db.objectStoreNames.contains("gradestate")) {
    db.createObjectStore("gradestate");
  }
};

function addData(db) {
  const transaction = db.transaction("gradestate", "readwrite");
  const store = transaction.objectStore("gradestate");
  const request = store.add({ state: false }, 1);

  request.onsuccess = function () {
    console.log("Data added successfully");
  };
}

openRequest.onsuccess = function (event) {
  const db = event.target.result;
  // Call CRUD operations here
  addData(db);
};