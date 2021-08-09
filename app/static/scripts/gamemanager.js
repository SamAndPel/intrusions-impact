// Master game management script

let rawdata = [];
let cardpositionmaster = {};

function initialise() {
    rawdata = getJSON("defences.json");
    rawdata.forEach(element => {
        let id = element.id;
        let location = "unstaged";
        cardpositionmaster[id] = location;
    });
}

function getJSON(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null)
    return JSON.parse(request.responseText);
}