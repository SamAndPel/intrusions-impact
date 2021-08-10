// Master game management script

let rawdata = {};
let cardpositionmaster = {};
let budget = 100000

function initialise() {
    rawdata = getJSON("defences.json");
    Object.values(rawdata).forEach(element => {
        let id = element.id;
        let location = "unstaged";
        cardpositionmaster[id] = location;
    });
    recalculatecost();
}

function getJSON(path) {
    var request = new XMLHttpRequest();
    request.open("GET", path, false);
    request.send(null)
    return JSON.parse(request.responseText);
}

function recalculatecost() {
    let accumulator = 0;
    for (const idno in cardpositionmaster) {
        const loc = cardpositionmaster[idno];
        if (loc == "staged") {
            const cardcost = rawdata[idno].cost;
            accumulator += cardcost;
        }
    }
    console.log("[+] Total cost of staged cards: " + accumulator);
    const moneyleft = budget - accumulator;
    document.getElementById("budget").innerHTML = moneyformat(moneyleft);
    let budgetdisplay = document.getElementById("budget");
    if (moneyleft < 0) {
        budgetdisplay.classList.remove("funded");
        budgetdisplay.classList.add("underfunded");
    } else {
        budgetdisplay.classList.remove("underfunded");
        budgetdisplay.classList.add("funded");
    }
}

function moneyformat(val) {
    return "£" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}