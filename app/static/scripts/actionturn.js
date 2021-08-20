// Play sequence actioning controller
// Actions play sequence on user clicking the play button

function doturn() {
    // Verify cards to be played are valid
    // All cards in staging have prerequisites played, total cost is cheap enough
    let stagedcardids = getstagedcards();
    console.log("[+] Staged cards: " + stagedcardids);
    if (validatecards(stagedcardids)) {
        // Log cards played in master log
        gamelog[turn] = stagedcardids;

        // Have any new cards been revealed by prerequisite?
        Object.values(rawdata).forEach(card => {
            const idno = card.id;
            const prereq = card.prerequisite;
            if (card.prerequisite != -1) {
                if (cardpositionmaster[prereq] == "staged") {
                    console.log("[*] New card revealed - card " + idno);
                    const cardid = "card" + idno;
                    document.getElementById(cardid).classList.remove("unplayable");
                }
            }
        });

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

        // Build onplays list
        let onplays = []
        stagedcardids.forEach(idno => {
            if (rawdata[idno]["onplay-text"]) {
                onplays.push(rawdata[idno]["onplay-text"]);
            }
        });

        // Action results of consequences on score
        conseqs.forEach(cons => {
            currentscore += cons.scoredelta;
        });

        // Action results of onplay-scoredeltas on score
        stagedcardids.forEach(idno => {
            if (rawdata[idno]["onplay-scoredelta"].length) {
                currentscore += rawdata[idno]["onplay-scoredelta"][turn];
                console.log("[+] OnplayScoredelta for card " + idno + " applied: " + rawdata[idno]["onplay-scoredelta"][turn]);
            }
        });
        console.log("[*] Global score is now " + currentscore);

        // Increment turn counter
        turn += 1;

        // Render consequence modal
        showconsequences(onplays, conseqs, () => {
            // After consequence window has been closed
            closeallmodals();

            // Should the game continue?
            if (turn < maxturns) {
                // Set budget to 100k + leftover cash
                let totalcost = getcostfromidlist(stagedcardids);
                let newbudget = (currentbudget - totalcost) + budgeteachturn;
                currentbudget = newbudget;
                document.getElementById("budget").innerHTML = moneyformat(currentbudget);
                document.getElementById("turndisplay").innerHTML = "Year " + (turn + 1);
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
        // Staged cards may also be rejected as their prerequisite hasn't been played,
        // but that *shouldnt* be possible unless the user has been playing around with
        // the source code.
        alert("Over Budget!\nYour defences are too expensive - try again.");
    }
}

function validatecards(stagedcards) {
    let valid = true;

    // Is the total cost of the staged cards less than the budget?
    let totalcost = getcostfromidlist(stagedcards);
    if (totalcost > currentbudget) {
        console.log("[-] Staged cards invalid due to finance");
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
            console.log("[-] Staged cards invalid due to prerequisites");
        }
    });
    return valid;
}

// Renders a consequences modal
function showconsequences(onplaylist, consequencelist, callback) {
    // Generate HTML for each consequence in list and append it to the modal
    let modalroot = document.getElementById("conseqmodalroot");

    // Wipe existing content in the consequence modal
    modalroot.innerHTML = ""

    // Create the stinger at the top
    const stinger = document.createElement("p");
    stinger.classList.add("stinger");
    const stingertext = document.createTextNode("Here are the consequences of your actions:");
    stinger.appendChild(stingertext);
    modalroot.appendChild(stinger);

    // For each onplay
    onplaylist.forEach(onplay => {
        // Create the div for the onplay
        const onplaydiv = document.createElement("div");
        onplaydiv.classList.add("consequence-div");

        // Display the onplay text
        const onplayelement = document.createElement("p");
        onplayelement.classList.add("info-body-text");
        const onplaytext = document.createTextNode(onplay);
        onplayelement.appendChild(onplaytext);
        onplaydiv.appendChild(onplayelement);

        modalroot.appendChild(onplaydiv);
    });

    // For each consequence
    consequencelist.forEach(conseq => {
        // Create the div for the consequence
        const consdiv = document.createElement("div");
        consdiv.classList.add("consequence-div");

        // Create the div for the top bar
        const topbar = document.createElement("div");
        topbar.classList.add("topbar");

        // Display the topbar, containing attack stinger and point delta
        let verb = "";
        let goodorbad = "";
        let score = conseq.scoredelta;
        if (conseq.scoredelta > 0) {
            verb = "blocked!";
            goodorbad = "good";
            score = "+" + score;
        } else {
            verb = "attack!";
            goodorbad = "bad";
        }
        const sourcetextelement = document.createElement("p");
        sourcetextelement.classList.add("sourcetext");
        sourcetextelement.classList.add(goodorbad);
        const sourcetext = document.createTextNode(conseq["type"] + " " + verb);
        sourcetextelement.appendChild(sourcetext);
        topbar.appendChild(sourcetextelement);

        const scoretextelement = document.createElement("p");
        scoretextelement.classList.add("scoretext");
        scoretextelement.classList.add(goodorbad);
        const scoretext = document.createTextNode(score + " points");
        scoretextelement.appendChild(scoretext);
        topbar.appendChild(scoretextelement);

        // Display the whole topbar
        consdiv.appendChild(topbar);

        // Display the main text
        const maintextelement = document.createElement("p");
        maintextelement.classList.add("info-body-text");
        const maintext = document.createTextNode(conseq["text"]);
        maintextelement.appendChild(maintext);
        consdiv.appendChild(maintextelement);

        // Display image if present
        if (conseq["image"]) {
            const imageelement = document.createElement("img");
            imageelement.classList.add("conseqimage");
            imageelement.src = "/images/consequences/" + conseq["image"];
            imageelement.alt = "Image showing result of the above consequence";
            consdiv.appendChild(imageelement);
        }

        // Display collapsible ribbon with fact and stat inside, if provided
        if (conseq["stat"] && conseq["example"]) {
            // Collapsible trigger
            const collapsibletrigger = document.createElement("p");
            collapsibletrigger.classList.add("collapsibletrigger");
            const collapsibletriggertext = document.createTextNode("In the real world...");
            collapsibletrigger.appendChild(collapsibletriggertext);
            consdiv.appendChild(collapsibletrigger);

            // Set up handler for collapsible region
            collapsibletrigger.addEventListener("click", () => {
                collapsibletrigger.classList.toggle("collapsibleopen");
                let content = collapsibletrigger.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });

            // Collapsible content
            const collapsiblecontent = document.createElement("div");
            collapsiblecontent.classList.add("collapsiblecontent");

            const exampleelement = document.createElement("p");
            exampleelement.classList.add("info-body-text");
            const exampletext = document.createTextNode(conseq["example"]);
            exampleelement.appendChild(exampletext);
            collapsiblecontent.appendChild(exampleelement);

            const statelement = document.createElement("p");
            statelement.classList.add("info-body-text");
            const stattext = document.createTextNode(conseq["stat"]);
            statelement.appendChild(stattext);
            collapsiblecontent.appendChild(statelement);

            const srcbtndiv = document.createElement("div");
            srcbtndiv.classList.add("modallinkspace");
            const srcbtnexample = document.createElement("a");
            srcbtnexample.href = conseq["example-source"];
            srcbtnexample.target = "_blank";
            const srcbtnstat = document.createElement("a");
            srcbtnstat.href = conseq["stat-source"];
            srcbtnstat.target = "_blank";
            srcbtnexample.classList.add("modallink");
            srcbtnstat.classList.add("modallink");
            const srcbtnexampletext = document.createTextNode("Case Study");
            const srcbtnstattext = document.createTextNode("Stat Source");
            srcbtnexample.appendChild(srcbtnexampletext);
            srcbtnstat.appendChild(srcbtnstattext);
            srcbtndiv.appendChild(srcbtnexample);
            srcbtndiv.appendChild(srcbtnstat);
            collapsiblecontent.appendChild(srcbtndiv);

            consdiv.appendChild(collapsiblecontent);
        }

        // Add the consequence to the modal
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

    // Show the consequences modal
    document.getElementById("conseqmodal").style.display = "block";
    document.getElementById("conseqmodal").scrollTop = 0;
    console.log("[+] Consequence modal rendered, waiting for user input");

    // Only trigger the callback when the user clicks continue
    let continuebtn = document.getElementById("conseqcontinue");
    continuebtn.addEventListener("click", function conseqcont(e) {
        continuebtn.removeEventListener("click", conseqcont, false);
        callback();
    }, false);
}