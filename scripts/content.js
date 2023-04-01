window.addEventListener("locationchange", ()=>{
    console.log("Hi");
    if (document.getElementById("crumb_2") && document.getElementById("crumb_2").textContent.trim() === "Grade Center" && document.getElementById("breadcrumb_controls_id")) {
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

})

