function addGradingSection() {
  let element = document.getElementById("gradingsec");
  if (element) {
    element.style.display = "auto";
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

function removeGradingSection() {
  let element = document.getElementById("gradingsec");
  if (element) {
    element.style.display = "none";
  }
}


// Open or create the database
const openRequest = indexedDB.open("myDatabase", 1);


function getData(db, key) {
  const transaction = db.transaction("gradestate", "readonly");
  const store = transaction.objectStore("gradestate");
  const request = store.get(key);
  request.onsuccess = function () {
    console.log("Inside success");
    console.log(request.result.state);
  };
}

function addFeedbackToBB(text, deduction) {
  console.log(text);
  console.log(deduction);
}

function addGradingPoint(plate) {
  let element = document.createElement("div");
  const add_feedback_button = document.createElement("button");
  add_feedback_button.innerText = "Apply";
  add_feedback_button.style.color="white";
  add_feedback_button.style.backgroundColor="#14294f";
  add_feedback_button.style.padding="1px";
  element.appendChild(add_feedback_button);
  add_feedback_button.addEventListener('click',()=>{
    console.log("Hiii");
    // addFeedbackToBB(feedback_area.value,textarea.value)
  });
  element.style.cssText = 'display: flex; background-color: #0f294e; height:55px; margin:0px 0px 2px 0px; justify-content: center;'
  element.innerHTML += '<label style="color:white; font-size:10px; margin:0px 4px">Feedback</label>';
  const feedback_area = document.createElement("textarea");
  feedback_area.style.cssText = 'width:215px; height:40px; resize:none;';
  element.getElementsByTagName("label")[0].appendChild(feedback_area);
  const gradelabel = document.createElement("label");
  gradelabel.style.cssText = 'color:white; font-size:10px; margin-left:auto;';
  gradelabel.innerText = "Deduction";
  const textarea = document.createElement("textarea");
  textarea.style.width = "70px";
  textarea.style.height = "40px";
  textarea.style.marginLeft = "auto";
  textarea.style.resize = "none";
  textarea.addEventListener('input', (e) => {
    if (e.target.value.length <= 5) {
      e.target.value = e.target.value.replace(/[^0-9-+]/g, '');
    }
    else{
      e.target.value=e.target.value.slice(0, e.target.value.length-1);
    }
  });
  

  gradelabel.appendChild(textarea);
  
  element.appendChild(gradelabel);
  const delete_button = document.createElement("button");
  delete_button.innerText = "X";
  delete_button.style.color="white";
  delete_button.style.backgroundColor="red";
  delete_button.style.padding="2px";
  
  element.appendChild(delete_button);
  delete_button.addEventListener('click', ()=>{
    plate.removeChild(element);
  })

  

  return element;
}

function addMenuAndPlate() {
  let element = document.getElementById("gradingsec");
  let parentMenu = document.createElement("div");
  parentMenu.style.cssText = 'display: flex; height:30px;';
  let saveButton = document.createElement("button");
  let newButton = document.createElement("button");
  saveButton.classList.add('btn', 'btn-primary');
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
  plate.style.overflowX="hidden";
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

}

function getData(db, key) {
  const transaction = db.transaction("gradestate", "readonly");
  const store = transaction.objectStore("gradestate");
  const request = store.get(key);
  request.onsuccess = function () {
    console.log(request.result.state);
    if (!request.result.state) {
      console.log("Inserting grading section");
      addGradingSection();
    }
    else {
      console.log("Removing grading section");
      removeGradingSection();
    }
  };
}

openRequest.onsuccess = function (event) {
  const db = event.target.result;
  // Call CRUD operations here
  getData(db, 1);

};