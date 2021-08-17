// Play sequence actioning controller
// Actions play sequence on user clicking the play button

function doturn() {
    // Verify cards to be played are valid
    // All cards in staging have prerequisites played, total cost is cheap enough
    let stagedcardids = getstagedcards();
    console.log("[+] Staged cards: " + stagedcardids);
    if (validatecards(stagedcardids)) {
        // Move played cards to the 'played' deck
        stagedcardids.forEach(idno => {
            playcard(idno);
        });

        // RUN ANIMATION HERE

        // Generate consequence list
        let conseqs = [];
        Object.values(rawdata).forEach(card => {
            let idno = card.id;
            if (cardpositionmaster[idno] == "played") {
                conseqs.push(card.consequences[turn].installed);
            } else {
                conseqs.push(card.consequences[turn].notinstalled);
            }
        });
        // TODO: Prune empty consequences from conseqs[] data structure before continuing

        // Action results of consequences on score etc
        conseqs.forEach(cons => {
            currentscore = currentscore + cons.scoredelta;
        });
        console.log("[*] Global score is now " + currentscore);

        // Increment turn counter
        turn += 1;

        // Render consequence modal
        showconsequences(conseqs, () => {
            // After consequence window has been closed
            closeallmodals();

            // Should the game continue?
            if (turn < maxturns) {
                // Set budget to 100k + leftover cash
                let totalcost = getcostfromidlist(stagedcardids);
                let newbudget = (currentbudget - totalcost) + budgeteachturn;
                currentbudget = newbudget;
                document.getElementById("budget").innerHTML = moneyformat(currentbudget);
            } else {
                // Subtract staged cards from budget
                let totalcost = getcostfromidlist(stagedcardids);
                let newbudget = (currentbudget - totalcost);
                currentbudget = newbudget;
                document.getElementById("budget").innerHTML = moneyformat(currentbudget);
                // Enter endgame routine
                endgame();
            }
        });
    } else {
        alert("Over Budget!\nYour defences are too expensive - try again.");
    }
}

function validatecards(stagedcards) {
    let valid = true;

    // Is the total cost of the staged cards less than the budget?
    let totalcost = getcostfromidlist(stagedcards);
    if (totalcost > currentbudget) {
        valid = false;
    }

    // Do any of the cards have prerequisites? If so, have they been played?
    let allprereqs = [];
    stagedcards.forEach(idno => {
        const cardprereq = rawdata[idno].prerequisite;
        allprereqs.push(cardprereq);
    });
    allprereqs.forEach(prereqid => {
        if (prereqid != -1 && cardpositionmaster[prereqid] != "played") {
            valid = false;
        }
    });
    valid ? console.log("[+] All staged cards valid") : console.log("[-] Staged cards invalid");
    return valid;
}

// Renders a consequences modal
function showconsequences(consequencelist, callback) {
    console.log("[+] Consequence modal rendered, waiting for user input");
    document.getElementById("conseqmodal").style.display = "block";

    // Only trigger the callback when the user clicks continue
    let continuebtn = document.getElementById("conseqcontinue");
    continuebtn.addEventListener("click", function conseqcont(e) {
        continuebtn.removeEventListener("click", conseqcont, false);
        callback();
    }, false);
}