// Runs scripts to be run on window load
// Kicks everything off

window.onload = function () {
    // Initialise game data structures
    console.log("[*] Initialising game environment");
    initialise();

    // Bind onclick events to modals where necessary
    console.log("[*] Binding modal button to respective elements");
    bindmodals();
}