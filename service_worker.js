// Open the database
const openRequest = indexedDB.open("myDatabase");


openRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  // Create object store "gradestate" if it doesn't exist
  console.log("Creating object");
  if (!db.objectStoreNames.contains("gradestate")) {
    db.createObjectStore("gradestate");
  }
};

function addData(db, value, key) {
  const transaction = db.transaction("gradestate", "readwrite");
  const store = transaction.objectStore("gradestate");
  const request = store.add({ state: value }, key);

  request.onsuccess = function () {
    console.log("Data added successfully");
  };
}


openRequest.onsuccess = function (event) {
  const db = event.target.result;
  addData(db, true, 1);
};
