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
        // Prune empty consequences from list
        conseqs = conseqs.filter(conseq => (conseq["text"]));

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
    // Generate HTML for each consequence in list and append it to the modal
    // EXAMPLE -------------------------------------------------------------------
    // <p class="info-body-text"><b>Here are the consequences of your actions</b></p>
    // <p class="info-body-text">Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! </p>
    // <div class="modallinkspace">
    //     <a href="google.co.uk" class="modallink" target="_blank">Read more</a>
    //     <a href="google.co.uk" class="modallink" target="_blank">Example details</a>
    // </div>
    // <p class="info-body-text">Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! </p>
    // <div class="modallinkspace">
    //     <a href="google.co.uk" class="modallink" target="_blank">Read more</a>
    //     <a href="google.co.uk" class="modallink" target="_blank">Example details</a>
    // </div>
    // <p class="info-body-text">Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! Here's a whole lot of consequence text blah blah blah don't read me I repeat! </p>
    // <div class="modallinkspace">
    //     <a href="google.co.uk" class="modallink" target="_blank">Read more</a>
    //     <a href="google.co.uk" class="modallink" target="_blank">Example details</a>
    // </div>
    // <div class="modallinkspace">
    //     <p id="conseqcontinue" class="modallink">Continue</p>
    // </div>

    let modalroot = document.getElementById("conseqmodalroot");

    // Wipe existing content in the consequence modal
    modalroot.innerHTML = ""

    // Create the stinger at the top
    let stinger = document.createElement("p");
    let embolden = document.createElement("b");
    let stingertext = document.createTextNode("Here are the consequences of your actions:");
    embolden.appendChild(stingertext);
    stinger.appendChild(embolden);
    modalroot.appendChild(stinger);

    consequencelist.forEach(conseq => {
        const consdiv = document.createElement("div");
        consdiv.classList.add("consequence-div");
        consdiv.innerHTML = JSON.stringify(conseq);
        modalroot.appendChild(consdiv);
    });

    // Create the continue button
    let contbtndiv = document.createElement("div");
    contbtndiv.classList.add("modallinkspace");
    let contbtn = document.createElement("p");
    contbtn.classList.add("modallink");
    contbtn.id = "conseqcontinue";
    let contbtntext = document.createTextNode("Continue");
    contbtn.appendChild(contbtntext);
    contbtndiv.appendChild(contbtn);
    modalroot.appendChild(contbtndiv);

    document.getElementById("conseqmodal").style.display = "block";
    console.log("[+] Consequence modal rendered, waiting for user input");

    // Only trigger the callback when the user clicks continue
    let continuebtn = document.getElementById("conseqcontinue");
    continuebtn.addEventListener("click", function conseqcont(e) {
        continuebtn.removeEventListener("click", conseqcont, false);
        callback();
    }, false);
}