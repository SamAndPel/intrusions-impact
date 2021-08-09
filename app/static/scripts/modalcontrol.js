// Modal controller
// Attaches modal triggers to correct buttons etc

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