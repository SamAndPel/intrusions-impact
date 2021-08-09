// Card movement controller
// Functions to change the location of cards representationally

// If card is currently unstaged, stage it
// If card is currently staged, unstage it
function togglestage(cardid) {
    if (cardpositionmaster[cardid] == "unstaged") {
        stagecard(cardid);
    } else if (cardpositionmaster[cardid] == "staged") {
        unstagecard(cardid);
    } else {
        console.log("[*] Card neither staged nor unstaged - taking no action.");
    }
    closeallmodals();
}

// Stage card
// Move card element
// Modify root data structure
// Modify innerhtml on card popup modal move button
function stagecard(cardid) {
    console.log("[+] Staging " + cardid);
    cardpositionmaster[cardid] = "staged";
    let modalid = "card" + cardid + "modal";
    let modal = document.getElementById(modalid);
    modal.getElementsByClassName("togglestage")[0].innerHTML = "Remove card";
    let source = document.getElementById("card" + cardid);
    document.getElementById("stageddeck").appendChild(source);
}

//
function unstagecard(cardid) {
    console.log("[-] Unstaging " + cardid);
    cardpositionmaster[cardid] = "unstaged";
    let modalid = "card" + cardid + "modal";
    let modal = document.getElementById(modalid);
    modal.getElementsByClassName("togglestage")[0].innerHTML = "Play card";
    let source = document.getElementById("card" + cardid);
    document.getElementById("unstageddeck").appendChild(source);
}