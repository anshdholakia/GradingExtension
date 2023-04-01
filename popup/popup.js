function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // send a message to the content js to get the status of the grading
    popup();
});


// getting back the message from the content js about the status of the grading
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.status === "off" ) {
            console.log("It is off");
        }
        else{
            console.log("It is on");
        }
    }
);