function addGradingSection() {
  let element = document.getElementById("gradingsec");
  if (element) {
    element.style.display = "block";
    return;
  }
  element = document.createElement("div");
  element.id = "gradingsec";
  element.style.width = "350px";
  element.style.height = "400px";
  element.style.position = "absolute";
  element.style.border = "2px solid black";
  element.style.right = "20px";
  element.style.bottom = "0px";
  element.style.overflowY = "hidden";
  element.style.backgroundColor = "white";
  element.style.zIndex = "10000";
  document.body.appendChild(element);
  addMenuAndPlate();
}

function updateState(id, newState) {
  let openRequest = indexedDB.open("myDatabase", 1);
  openRequest.onsuccess = function (e) {
    let db = e.target.result;
    let transaction = db.transaction("gradestate", "readwrite");
    let store = transaction.objectStore("gradestate");
    let getRequest = store.get(id);
    getRequest.onsuccess = function (e) {
      let record = getRequest.result;
      if (record) {
        record.state = newState;
        let putRequest = store.put(record);
        putRequest.onsuccess = function (e) {
          console.log("Success in updating record");
        };
        putRequest.onerror = function (e) {
          console.log("Error in updating record: " + e.target.error.name);
        };
      }
    };
    getRequest.onerror = function (e) {
      console.log("Error in getting record: " + e.target.error.name);
    };
  };
}



function removeGradingSection() {
  let element = document.getElementById("gradingsec");
  if (element) {
    element.style.display = "none";
  }
}


// Open or create the database
const openRequest = indexedDB.open("myDatabase", 1);

openRequest.onupgradeneeded = function (event) {
  let db = event.target.result;
  let objectStore = db.createObjectStore('gradestate', { keyPath: 'id' });
  objectStore.createIndex('state', 'state', { unique: false });
};

openRequest.onsuccess = function (event) {
  let db = event.target.result;
  let transaction = db.transaction('gradestate', 'readwrite');
  let objectStore = transaction.objectStore('gradestate');
  let addRequest = objectStore.add({ id: 1, state: false });
  addRequest.onsuccess = function (event) {
    console.log('Record added successfully');
  };
  addRequest.onerror = function (event) {
    console.log('Error adding record');
  };
  getData(db, 1);
}

function addFeedbackToBB(text, score) {
  console.log(text);
  console.log(score);
}

function addGradingPoint(plate) {
  let element = document.createElement("div");
  element.style.cssText = 'display: flex; background-color: #0f294e; height:55px; margin:0px 0px 2px 0px; justify-content: center;'
  const add_button = document.createElement("button");
  add_button.innerText = "Apply";
  add_button.style.color = "black";
  add_button.style.backgroundColor = "white";
  add_button.style.padding = "2px";

  element.appendChild(add_button);
  add_button.addEventListener('click', () => {
    addFeedbackToBB(feedback_area.value, textarea.value);
  })
  const feedbacklabel = document.createElement("label");
  feedbacklabel.style.cssText = "color:white; font-size:10px; margin:0px 4px;";
  feedbacklabel.innerText = "Feedback";
  const feedback_area = document.createElement("textarea");
  feedback_area.style.cssText = 'width:215px; height:40px; resize:none;';
  feedbacklabel.appendChild(feedback_area);
  element.appendChild(feedbacklabel);
  const gradelabel = document.createElement("label");
  gradelabel.style.cssText = 'color:white; font-size:10px; margin-left:auto;';
  gradelabel.innerText = "+/- Score";
  const textarea = document.createElement("textarea");
  textarea.style.width = "70px";
  textarea.style.height = "40px";
  textarea.style.marginLeft = "auto";
  textarea.style.resize = "none";
  textarea.addEventListener('input', (e) => {

    e.target.value = e.target.value.replace(/[^0-9-+]/g, '');

    if (e.target.value.length > 5) {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1);
    } else if (e.target.value.length > 1) {
      // check for users inputting - & + in the middle of scores
      if (e.target.value[e.target.value.length - 1] === '+' | e.target.value[e.target.value.length - 1] === '-') {
        e.target.value = e.target.value.slice(0, e.target.value.length - 1);
      }
    }
  });


  gradelabel.appendChild(textarea);

  element.appendChild(gradelabel);
  const delete_button = document.createElement("button");
  delete_button.innerText = "X";
  delete_button.style.color = "white";
  delete_button.style.backgroundColor = "red";
  delete_button.style.padding = "2px";

  element.appendChild(delete_button);
  delete_button.addEventListener('click', () => {
    plate.removeChild(element);
  })
  return element;
}

function save_to_indexdb(plate) {
  array_of_feedbacks = []
  plate.childNodes.forEach(element => {
    labels = element.getElementsByTagName('label');
    textarea = labels[0].children[0]
    scorearea = labels[1].children[0]
    array_of_feedbacks.push([textarea.value, scorearea.value]);
  });
  console.log(array_of_feedbacks);
}

function addMenuAndPlate() {
  let element = document.getElementById("gradingsec");
  let parentMenu = document.createElement("div");
  parentMenu.style.cssText = 'display: flex; height:30px;';
  let saveButton = document.createElement("button");
  let newButton = document.createElement("button");
  newButton.innerText = "New +";
  saveButton.innerText = "Save";
  let buttonStyle = 'display:flex; justify-content:center; align-items:center; background-color: navy; color:white; padding:2px; width:50px;';
  newButton.style.cssText = buttonStyle
  saveButton.style.cssText = buttonStyle + 'margin-left:auto;';
  parentMenu.appendChild(newButton);
  parentMenu.appendChild(saveButton);
  element.appendChild(parentMenu);
  let plate = document.createElement("div");
  plate.classList.add("scrollable");
  plate.style.height = "366px";
  plate.style.overflowX = "hidden";
  plate.style.overflowY = "auto";
  let scrollbar_style = document.createElement("style");
  scrollbar_style.textContent = `
  /* For WebKit browsers (Chrome, Safari, etc.) */
.scrollable::-webkit-scrollbar {
  width: 4px;
}

.scrollable::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable::-webkit-scrollbar-thumb {
  background: #888;
}

.scrollable::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* For Firefox */
.scrollable {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
`;
  document.head.appendChild(scrollbar_style);
  element.appendChild(plate);
  newButton.addEventListener('click', () => {
    plate.appendChild(addGradingPoint(plate));
  })
  saveButton.addEventListener('click', () => save_to_indexdb(plate));
}

function getData(db, key) {
  const transaction = db.transaction("gradestate", "readonly");
  const store = transaction.objectStore("gradestate");
  const request = store.get(key);
  request.onsuccess = function () {
    console.log(request.result.state);
    if (request.result.state) {
      console.log("Inserting grading section");
      addGradingSection();
    }
    else {
      console.log("Removing grading section");
      removeGradingSection();
    }
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.message);
  if (request.message == "show_panel") {
    updateState(1, true);
    let openRequest = indexedDB.open("myDatabase", 1);
    openRequest.onsuccess = function (e) {
      let db = e.target.result;
      getData(db, 1);
    }
  }
  else if (request.message == "hide_panel") {
    updateState(1, false);
    let openRequest = indexedDB.open("myDatabase", 1);
    openRequest.onsuccess = function (e) {
      let db = e.target.result;
      getData(db, 1);
    }
  }
  else if (request.message == "get_status_of_panel") {
    let openRequest = indexedDB.open("myDatabase", 1);
    openRequest.onsuccess = function (e) {
      let db = e.target.result;
      const transaction = db.transaction("gradestate", "readonly");
      const store = transaction.objectStore("gradestate");
      const request = store.get(1);
      request.onsuccess = async function () {
          await chrome.runtime.sendMessage({ message: "receive_status", status: request.result.state });
      }
    }

  }
})