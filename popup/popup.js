// override inline cors policy error
const inline = 1;
document.getElementById("gradingornot").addEventListener('click', () => {
  value = document.getElementById("gradingornot").checked;
  run_function = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes("https://learn.dcollege.net/ultra/")) {
      if (value) {
        await chrome.tabs.sendMessage(tab.id, { message: "show_panel" });
      } else {
        await chrome.tabs.sendMessage(tab.id, { message: "hide_panel" });
      }
    }
  }
  run_function();
})

async function send_feedback(title, content) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url.includes("https://learn.dcollege.net/ultra/")) {
    await chrome.tabs.sendMessage(tab.id, { message: "send_feedback", title: title, content: content });
  }
}

function display_all_feedbacks(array_of_feedbacks){
  let container = document.getElementById("list_of_feedbacks");
  container.innerHTML = "<h5>List of saved feedbacks</h5>";
  let button_id = 0;
  array_of_feedbacks.forEach(element  => {
    container.innerHTML += `<button style="padding:2px;margin:2px 0px" id="button${button_id}">${element.title}</button></br>`;
    button_id++;
  });
  button_id = 0;
  array_of_feedbacks.forEach(element  => {
    document.getElementById(`button${button_id}`).addEventListener('click', async () => {
      send_feedback(element.title, element.feedback_array);
    });
    button_id++;
  });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "receive_status") {
      if (request.content !== undefined) {
        document.getElementById("gradingornot").checked = request.content;
      }
    } else if (request.message === "receive_feedbacks") {
      display_all_feedbacks(request.content);
    }
  }
);

async function get_grading_status() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url.includes("https://learn.dcollege.net/ultra/")) {
    await chrome.tabs.sendMessage(tab.id, { message: "get_status_of_panel" });
  }
}
get_grading_status()