// Open the database
const openRequest = indexedDB.open("myDatabase");

function getData(db, key) {
  const transaction = db.transaction("gradestate", "readonly");
  const store = transaction.objectStore("gradestate");
  const request = store.get(key);
  request.onsuccess = function () {
    console.log("Inside success");
    if (request.result.state){


    }
  };
}

document.getElementById("flexSwitchCheckDefault").addEventListener('click', ()=>{
  console.log("Click");
})

openRequest.onsuccess = function (event) {
  const db = event.target.result;
  // Call CRUD operations here
  getData(db, 1);
};