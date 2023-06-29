chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "receive_status")
      sendToPopup(request.status);
  }
);

async function sendToPopup(message) {
  await chrome.runtime.sendMessage({ message: "receive_status", status: message });
}
