// Play sequence actioning controller
// Actions play sequence on user clicking the play button

function actionturn() {
    // Verify cards to be played are valid
    // All cards in staging have prerequisites played, total cost is cheap enough
    let stagedcardids = getstagedcards();
    if (validatecards(stagedcardids)) {
        // Increment turn counter
        turn += 1;

        // RUN ANIMATION HERE

        // Generate consequence list

        // Render consequence window

        // Should the game continue?
        // If yes, render card locations and budget updates
        // Else enter the endgame routine
        if (turn < maxturns) {
            // Set budget to 100k + leftover cash
            let totalcost = getcostfromidlist(stagedcardids);
            let newbudget = (currentbudget - totalcost) + budgeteachturn;
            currentbudget = newbudget;
            document.getElementById("budget").innerHTML = moneyformat(currentbudget);

            // Move played cards to the 'played' deck
            stagedcardids.forEach(idno => {
                playcard(idno);
            });
        } else {
            endgame();
        }

    } else {
        alert("Over Budget!\nYour defences are too expensive and you've gone over budget - try again.");
    }
}

function validatecards(stagedcards) {
    let valid = true;

    // Is the total cost of the staged cards less than the budget?
    let totalcost = getcostfromidlist(stagedcards);
    if (totalcost > budget) {
        valid = false;
    }

    // Do any of the cards have prerequisites? If so, have they been played?
    let allprereqs = [];
    stagedcards.forEach(idno => {
        const cardprereqs = rawdata[idno].prerequisites;
        allprereqs = allprereqs.concat(cardprereqs);
    });
    allprereqs.forEach(prereqid => {
        if (cardpositionmaster[prereqid] != "played") {
            valid = false;
        }
    });
    valid ? console.log("[+] All staged cards valid") : console.log("[-] Staged cards invalid");
    return valid;
}

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

function getcostfromidlist(idlist) {
    let accumulator = 0;
    idlist.forEach(idno => {
        const cardcost = rawdata[idno].cost;
        accumulator += cardcost;
    });
    return accumulator;
}