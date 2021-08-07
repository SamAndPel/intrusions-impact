// INITIAL PROGRAM SETUP ------------------------------------------------------
// Import and configure required libraries
const express = require("express");
const app = express();
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

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
    return res.render("game.html.njk");
});

app.get("/about", (req, res) => {
    return res.render("about.html.njk");
});

// HOST HTTP SERVER -----------------------------------------------------------
app.listen(PORT, () => {
    console.log("[+] Server listening on port " + PORT);
});