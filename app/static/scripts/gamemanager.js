// Master game management script

let rawdata = [];
let cardpositionmaster = [];

function initialise() {
    rawdata = getJSON("defenses.json");
    
}

function getJSON(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null)
    return JSON.parse(request.responseText);
}

window.onload = function () {
    initialise();
}