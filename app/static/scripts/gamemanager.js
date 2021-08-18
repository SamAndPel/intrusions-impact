// Master game management script

// Define global variables
let rawdata = {};               // Raw immutable object containing JSON data
let cardpositionmaster = {};    // Lookup table (Card ID Number --> Position as string (can be 'unstaged', 'staged' or 'played'))

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
        cardpositionmaster[id] = "unstaged";
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

    // Use score to generate conclusion from conclusions.json

    // Show final conclusion modal
    showconclusion(null, () => {
        // If user clicks 'review board', set board up for review
        // WORKING POINT
        
        // Then remove the conclusion modal
        closeallmodals();

        // END OF MAIN CLIENT-SIDE SCRIPT EXECUTION
        console.log("[*] Main script execution complete");
    });
}

function showconclusion(concl, callback) {
    // Generate modal content
    const modalroot = document.getElementById("conclusionmodalroot");

    // Wipe existing content in the conclusion modal
    modalroot.innerHTML = ""

    // Generate stinger
    const stingerelement = document.createElement("p");
    stingerelement.classList.add("stinger");
    const stingertext = document.createTextNode("You have completed your tenure as Head of Cyber Security at AquaVolt Power.");
    stingerelement.appendChild(stingertext);
    modalroot.appendChild(stingerelement);

    // Generate conclusion from concl argument

    // Display buttons
    const btndiv = document.createElement("div");
    btndiv.classList.add("modallinkspace");
    const homebtnelement = document.createElement("a");
    const reviewbtnelement = document.createElement("p");
    homebtnelement.href = "/";
    homebtnelement.classList.add("modallink");
    reviewbtnelement.classList.add("modallink");
    const homebtntext = document.createTextNode("Home");
    const reviewbtntext = document.createTextNode("Review board");
    homebtnelement.appendChild(homebtntext);
    reviewbtnelement.appendChild(reviewbtntext);
    btndiv.appendChild(homebtnelement);
    btndiv.appendChild(reviewbtnelement);
    modalroot.appendChild(btndiv);

    // Display modal
    document.getElementById("endgamemodal").style.display = "block";
    document.getElementById("endgamemodal").scrollTop = 0;
    console.log("[+] Conclusion modal rendered, waiting for user input");

    // Set up event listeners if the user clicks either button
    homebtnelement.addEventListener("click", function homebtn(e) {
        if (!confirm('Are you sure you want to leave the page?')) {
            e.preventDefault();
        }
    }, false);

    reviewbtnelement.addEventListener("click", function reviewbtn(e) {
        reviewbtnelement.removeEventListener("click", reviewbtn, false);
        callback();
    }, false);
}