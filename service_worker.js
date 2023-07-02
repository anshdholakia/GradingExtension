chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "receive_status") {
      sendToPopup("receive_status", request.status, request.feedbacks);
    }
  }
)

async function sendToPopup(message, state, list_of_feedbacks) {
  await chrome.runtime.sendMessage({ message: message, state: state, feedbacks: list_of_feedbacks });
}
