// Modal controller
// Attaches modal triggers to correct buttons etc

function closeallmodals() {
    const cardmodals = document.getElementsByClassName("cardmodal");
    const consequencemodal = document.getElementById("consequencemodal");
    
    for (let i = 0; i < cardmodals.length; i++) {
        cardmodals[i].style.display = "none";
    }
    consequencemodal.style.display = "none";
}

window.onload = function () {
    const cards = document.getElementsByClassName("card");
    const cardmodals = document.getElementsByClassName("cardmodal");

    const playbutton = document.getElementById("playbutton");

    const closers = document.getElementsByClassName("closemodal");
    const consequencemodal = document.getElementById("consequencemodal");

    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", () => {
            cardmodals[i].style.display = "block";
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

// Close modals if they're clicked off
window.onclick = function (event) {
    if (event.target.classList.contains("cardmodal") || event.target.id == "consequencemodal") {
        closeallmodals();
    }
}