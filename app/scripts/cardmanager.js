//Gets JSON representation of defenses (and hence consequences) from file
function getDefenseJson() {
    let request = new XMLHttpRequest();
    request.open("GET", "../data/defenses.json", false);
    request.overrideMimeType("application/json");
    request.send(null);
    let data = JSON.parse(request.responseText);
    return data;
}

// Builds a HTML representation of a card from a specified source
// Accepts ID of card to generate
// Returns HTML representation
function buildcard(id, json) {
    console.log(id);
    console.log(json);
}