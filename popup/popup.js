// override inline cors policy error
// const inline = 1;
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

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "receive_status"){
      if (request.status){
        document.getElementById("gradingornot").checked = true;
      } else{
        document.getElementById("gradingornot").checked = false;
      }
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