// Modal controller
// Attaches modal triggers to correct buttons etc

function bindmodals() {
    const cards = document.getElementsByClassName("card");
    const cardmodals = document.getElementsByClassName("cardmodal");
    const consequencemodal = document.getElementById("consequencemodal");
    const playbutton = document.getElementById("playbutton");
    const closers = document.getElementsByClassName("closemodal");

    // Add handlers for each card
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", () => {
            let cardid = cards[i].id;
            let idno = cardid.charAt(cardid.length - 1);
            let modal = document.getElementById(cardid + "modal");
            modal.style.display = "block";
            console.log("[+] Showing modal for card " + idno);
        });
    }

    playbutton.addEventListener("click", () => {
        consequencemodal.style.display = "block";
    });

    // Close modals if an 'x' is clicked
    for (let i = 0; i < closers.length; i++) {
        closers[i].addEventListener("click", () => {
            closeallmodals();
        });
    }
}

function closeallmodals() {
    const cardmodals = document.getElementsByClassName("cardmodal");
    const consequencemodal = document.getElementById("consequencemodal");

    for (let i = 0; i < cardmodals.length; i++) {
        cardmodals[i].style.display = "none";
    }
    //consequencemodal.style.display = "none";
    console.log("[-] All modals hidden.");
}

// Close modals if they're clicked off
window.onclick = function (event) {
    if (event.target.classList.contains("cardmodal") || event.target.id == "consequencemodal") {
        closeallmodals();
    }
}