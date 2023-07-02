chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "receive_status") {
      sendToPopup("receive_status", request.content);
    }
    else if (request.message === "receive_feedbacks") {
      sendToPopup("receive_feedbacks", request.content);
    }

  }
)

async function sendToPopup(message, content) {
  await chrome.runtime.sendMessage({ message: message, content: content});
}
