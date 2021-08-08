// INITIAL PROGRAM SETUP ------------------------------------------------------
// Import required libraries
const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

// Load game data from JSON
const gamedata = require(__dirname + "/defenses.json");

// Configure Express and Nunjucks
app.use(express.static(__dirname + "/static/"));
nunjucks.configure(__dirname + "/templates/", {
    autoescape: true,
    express: app
});

// Set port to .env variable value if found, else set port to 3000
const PORT = process.env.PORT || 3000;

// ROUTES ---------------------------------------------------------------------
app.get("/", (req, res) => {
    return res.render("home.html.njk");
});

app.get("/game", (req, res) => {
    return res.render("game.html.njk", {
        defenses: gamedata
    });
});

app.get("/howtoplay", (req, res) => {
    return res.render("howtoplay.html.njk");
});

app.get("/about", (req, res) => {
    return res.render("about.html.njk");
});

// HOST HTTP SERVER -----------------------------------------------------------
app.listen(PORT, () => {
    console.log("[+] Server listening on port " + PORT);
});