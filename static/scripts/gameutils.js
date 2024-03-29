// Game Utility Functions
// Assorted functions used throughout the codebase
// Primarily utility functions working with game data

// Returns a list of staged card IDs 
function getstagedcards() {
    let c = [];
    for (const idno in cardpositionmaster) {
        const loc = cardpositionmaster[idno];
        if (loc == "staged") {
            c.push(idno);
        }
    }
    return c;
}

// Returns an int total cost for a provided list of card IDs
function getcostfromidlist(idlist) {
    let accumulator = 0;
    idlist.forEach(idno => {
        const cardcost = rawdata[idno].cost;
        accumulator += cardcost;
    });
    return accumulator;
}

// Prepends £ to string and adds 'money commas' every three indices
// Regex help from https://stackoverflow.com/a/2901298
function moneyformat(val) {
    return "£" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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