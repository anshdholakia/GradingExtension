// Open or create the database
const openRequest = indexedDB.open("myDatabase", 1);
const inline = 1;
openRequest.onupgradeneeded = function (event) {
  let db = event.target.result;
  let objectStore = db.createObjectStore('gradestate', { keyPath: 'id' });
  let feedbackStorage = db.createObjectStore('feedback_storage', { keyPath: 'id', autoIncrement: true });
  feedbackStorage.createIndex('title', 'title', { unique: false });
  feedbackStorage.createIndex('feedback_array', 'feedback_array', { unique: false });
  objectStore.createIndex('state', 'state', { unique: false });
};

openRequest.onsuccess = function (event) {
  let db = event.target.result;
  let transaction = db.transaction('gradestate', 'readwrite');
  let objectStore = transaction.objectStore('gradestate');
  objectStore.add({ id: 1, state: false });
  getData(db, 1);
}

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
        store.put(record);
      }
    };
  };
}

function addFeedbackToTable(array_of_feedbacks, title, type) {
  if (!title) {
    return;
  }
  array_of_feedbacks = array_of_feedbacks.filter(x => x[0] || x[1])
  console.log(array_of_feedbacks);
  if (array_of_feedbacks.length == 0) {
    alert('Empty feedback not allowed');
    return;
  }
  let openRequest = indexedDB.open("myDatabase", 1);
  openRequest.onsuccess = function (e) {
    let db = e.target.result;
    let transaction = db.transaction("feedback_storage", "readwrite");
    let store = transaction.objectStore("feedback_storage");
    let request = store.openCursor();
    request.onsuccess = function (event) {
      let cursor = event.target.result;
      if (cursor) {
        if (cursor.value.title == title) {
          if (type == "edit") {
            const updateData = cursor.value; // Get the old value
            updateData.feedback_array = array_of_feedbacks; // Modify the property
            const requestUpdate = cursor.update(updateData);
            requestUpdate.onsuccess = function () {
              alert("Update successful.");
            };
            requestUpdate.onerror = function () {
              alert("Update failed.");
            }
            return;
          }
          alert('Feedback with same title already exists');
          return;
        }
        cursor.continue();
      } else {
        let addRequest = store.add({ feedback_array: array_of_feedbacks, title: title });
        addRequest.onsuccess = function (event) {
          alert('Record added successfully');
        };
        addRequest.onerror = function (event) {
          alert('Error adding record');
        };

      }
    };
  };
}

function removeGradingSection() {
  let element = document.getElementById("gradingsec");
  if (element) {
    element.style.display = "none";
  }
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
  let title = prompt("Please enter preferred title", "Assignment 1 Feedback");
  addFeedbackToTable(array_of_feedbacks, title, "save");
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
  plate.id = "plate";
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
    if (request.result.state) {
      addGradingSection();
    }
    else {
      removeGradingSection();
    }
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
      const transaction_feedback = db.transaction("feedback_storage", "readonly");
      const store_feedback = transaction_feedback.objectStore("feedback_storage");
      let request_feedback = store_feedback.openCursor();
      const final_feedback_array = [];
      const transaction_grade = db.transaction("gradestate", "readonly");
      const store_grade = transaction_grade.objectStore("gradestate");
      const request_grade = store_grade.get(1);
      request_feedback.onsuccess = async function (event) {
        let cursor = event.target.result;
        if (cursor) {
          final_feedback_array.push({ title: cursor.value.title, feedback_array: cursor.value.feedback_array });
          cursor.continue();
        }
        else {
          await chrome.runtime.sendMessage({ message: "receive_status", status: request_grade.result.state, feedbacks: final_feedback_array });
        }
      }
    }
  } else if (request.message === "send_feedback") {
    received_feedbacks(request.content, request.title);
  }

})

function received_feedbacks(content, title) {
  var userResponse = confirm("Do you want to continue importing new feedback? This will clear existing feedback on screen");
  if (userResponse) {
    let gradingsec = document.getElementById("gradingsec");
    if(gradingsec.childNodes[0].childNodes.length > 2){
      gradingsec.childNodes[0].childNodes[1].remove();
      gradingsec.childNodes[0].childNodes[1].remove();
    }
    gradingsec.childNodes[0].childNodes[0].insertAdjacentHTML('afterend', `<p style="overflow-y: auto;height: inherit;">Title: ${title}</p><button id="edit_button">Edit</button>`);
    let edit_button = document.getElementById("edit_button");
    edit_button.style.cssText = 'display:flex; justify-content:center; align-items:center; background-color: navy; color:white; padding:2px; width:50px;margin-left:auto;';
    let plate = document.getElementById("plate");
    plate.innerHTML = "";
    content.forEach(element => {
      point = addGradingPoint(plate);
      point.getElementsByTagName('textarea')[0].value = element[0];
      point.getElementsByTagName('textarea')[1].value = element[1];
      plate.appendChild(point);
    });
    edit_button.addEventListener('click', () => {
      let userResponse = confirm("Do you want to edit existing feedback?");
      if (userResponse) {
        array_of_feedbacks = []
        plate.childNodes.forEach(element => {
          labels = element.getElementsByTagName('label');
          textarea = labels[0].children[0]
          scorearea = labels[1].children[0]
          array_of_feedbacks.push([textarea.value, scorearea.value]);
        });
        addFeedbackToTable(array_of_feedbacks, title, "edit");
      }
    })
  }
}