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

// adding a listener to the content to listen to messages from the popup js when it is opened
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "start") {
            // sending a message to the popup.js to keep the switch unchecked
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, { "status": "off" });
            });

        }
    }
);
