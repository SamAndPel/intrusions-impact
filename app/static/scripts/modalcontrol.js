// Modal controller
// Handles modal showing/hiding

function showmodal(idno) {
    let modal = document.getElementById("card" + idno + "modal");
    modal.style.display = "block";
    console.log("[+] Showing modal for card " + idno);
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