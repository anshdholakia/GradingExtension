function addGradingSection() {
    console.log("Hi");
    let element = document.createElement("div");
    element.style.width = "250px";
    element.style.height = "400px";
    element.style.position = "absolute";
    element.style.border = "2px solid black";
    element.style.right = "20px";
    element.style.bottom = "0px";
    element.style.backgroundColor = "white";
    element.style.zIndex = "10000";
    document.body.appendChild(element);
}

const dbName = 'logs';
const storeName = 'gradestate';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addItem = async (item) => {
  const db = await openDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  const request = store.add(item);
  request.onsuccess = () => console.log('Item added');
  request.onerror = () => console.error('Error adding item');
};

// Add an item to the IndexedDB
addItem({ "state": false });
