// Master game management script

// Define global variables
let rawdata = {};               // Raw immutable object containing JSON data
let cardpositionmaster = {};    // Lookup table (Card ID Number --> Position as string)

const budgeteachturn = 100000;  // Funding to be allocated each turn (extra carries over)
let currentbudget = 0;          // Current budget (including rollover)

const maxturns = 4;             // Turns to run before forcing endgame (may be unneeded due to causesEnd in JSON)
let turn = 0;                   // Current turn

let currentscore = 0;           // Current score (impacted by scoredeltas)

// Gets JSON and builds required data structures on game start
function initialise() {
    var request = new XMLHttpRequest();
    request.open("GET", "defences.json", false);
    request.send(null)
    rawdata = JSON.parse(request.responseText);
    Object.values(rawdata).forEach(element => {
        let id = element.id;
        let location = "unstaged";
        cardpositionmaster[id] = location;
    });
    currentbudget = budgeteachturn;
    recalculatecost();
    closeallmodals();
}

// Use card posn master to calculate cost of staged cards, current budget
// Also updates display to reflect calculated result
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
    const moneyleft = currentbudget - accumulator;
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

function endgame() {
    // Calculate final score

    // Show final score thing

    // Modals etc

    // Placeholder
    document.getElementById("endgamemodal").style.display = "block";    
}