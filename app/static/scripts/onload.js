// Runs scripts to be run on window load
// Kicks everything off

window.onload = function () {
    // Initialise game data structures
    console.log("[*] Initialising game environment");
    initialise();

    // Bind onclick events to modals where necessary
    console.log("[*] Binding modals to respective elements");
    const cards = document.getElementsByClassName("card");
    const cardmodals = document.getElementsByClassName("cardmodal");
    const consequencemodal = document.getElementById("consequencemodal");
    const playbutton = document.getElementById("playbutton");
    const closers = document.getElementsByClassName("closemodal");

    // Add handlers for each card
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", () => {
            let cardid = cards[i].id;
            let modal = document.getElementById(cardid + "modal");
            modal.style.display = "block";
            console.log("[+] Showing modal for " + cardid);
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