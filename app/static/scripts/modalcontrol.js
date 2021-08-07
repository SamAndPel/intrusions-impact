// Modal controller
// Attaches modal triggers to correct buttons etc

window.onload = function () {
    const cards = document.getElementsByClassName("card");
    const playbutton = document.getElementById("playbutton");

    const closers = document.getElementsByClassName("closemodal");
    const cardmodal = document.getElementById("cardmodal");
    const consequencemodal = document.getElementById("consequencemodal");

    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", () => {
            cardmodal.style.display = "block";
        });
    }

    playbutton.addEventListener("click", () => {
        consequencemodal.style.display = "block";
    });


    for (let i = 0; i < closers.length; i++) {
        closers[i].addEventListener("click", () => {
            cardmodal.style.display = "none";
            consequencemodal.style.display = "none";
        });
    }


}

window.onclick = function (event) {
    if (event.target == cardmodal || event.target == consequencemodal) {
        cardmodal.style.display = "none";
        consequencemodal.style.display = "none";
    }
}