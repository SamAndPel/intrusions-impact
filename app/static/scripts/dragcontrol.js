// Drag and Drop controller
// Triggers dropzone popups and calls passthrough functions on drop

function dragStart(ev) {
    console.log("[+] Began dragging element " + ev.target.id);
    ev.dataTransfer.setData("text", ev.target.id);
    document.getElementById("leftdrag").style.visibility = "visible";
    document.getElementById("stagedrag").style.visibility = "visible";
}

function dragStop(ev) {
    console.log("[-] Finished dragging element " + ev.target.id);
    document.getElementById("leftdrag").style.visibility = "hidden";
    document.getElementById("stagedrag").style.visibility = "hidden";
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains("droppable")) {
        let origin = ev.dataTransfer.getData("text");
        let siblings = ev.target.parentNode.children;
        for (var i = 0; i < siblings.length; i++) {
            let child = siblings.item(i);
            if (child.classList.contains("carddeck")) {
              child.appendChild(document.getElementById(origin));
              break;
            }        
        }
    }
}