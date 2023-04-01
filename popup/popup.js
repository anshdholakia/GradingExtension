function popup() {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
    });
}

document.getElementById("#flexSwitchCheckDefault").addEventListener("click", ()=>{
    
})