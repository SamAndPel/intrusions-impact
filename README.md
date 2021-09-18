# Intrusions and Impact
A Cyber Security discussion game based on Decisions and Disruptions

This is a web-port of the card/tabletop/lego game [Decisions and Disruptions](https://www.decisions-disruptions.org/), originally designed by Lancaster University. It was built by four placement students in 4 weeks during our 2021 summer placement with Atkins.

## View the game online
Access the live demo at [https://samandpel.github.io/intrusions-impact/](https://samandpel.github.io/intrusions-impact/)

## Running the game locally
1. Clone or download
   * `git clone https://github.com/SamAndPel/decisions-disruptions-clone.git`
   * `git clone git@github.com:SamAndPel/decisions-disruptions-clone.git`
   * Click https://github.com/SamAndPel/decisions-disruptions-clone/archive/master.zip
1. Open `/index.html` in a modern web browser (Chrome/Firefox/Edge recommended)

## Adapting the game to suit your needs
### Application structure
This is a pretty standard Web Project, written in raw HTML, CSS and JS
- `static/defences_JSON.js` is the master datafile for defining defences and their associated consequences. See the section on editing defences_JSON.js for more. The file is a JSON object stored in a JS variable to prevent CORS issues.
- `static/conclusions_JSON.js` contains conclusion data for the final endgame conclusion.
- `static/threatass_JSON.js` contains data for computing advice to be given when the Threat Assessment card is played.
- `static/audio/` contains audio assets (only one file - `workaudio.mp3` - which is played whilst defence installation animations are being played).
- `static/images/` contains all image assets for the project.
- `static/scripts/` contains all scripts for the project (game logic and visuals).
- `static/styles/` contains all CSS for the project.

I've endeavoured to comment my code clearly and exhaustively, normally down to codeblock-level. I haven't used JSDoc annotations (@param etc) but the code structure should be clear enough.

### Editing defences_JSON.js
Defences_JSON.js is the master data file for all defences and consequences. It contains a JSON object associating an integer ID with a defence object. Each defence object contains the following keys:

- `id` - Integer ID of defence. Should align with the defence's key in defences.json.
- `name` - Display name of the defence.
- `location` - Either 'plant', 'office' or 'both'. Not currently used.
- `image` - Name of image to be displayed on card. Path not neccessary as the code knows to look in `/app/static/images/cards/`.
- `graphic` - Name of relevant overlay to render on gameboard. Path not neccessary as the code knows to look in `/app/static/images/board/`.
- `cost` - Integer cost of the card.
- `shortdesc` - Short description, displayed large at the top of info card.
- `longdesc` - Longer description, displayed small at the bottom of info card.
- `outlink` - Link to more information on the defence. Displayed at the bottom of info card.
- `prerequisite` - ID of defence which needs to be played before this defence can be, or -1 if this defence can be played freely at any time. Used to make the Asset Audit defence work.
- `onplay-scoredelta` - List of 4 values (>= number of turns in the game), defining the change in score when the card is played. Played on turn 2 means that `onplay-scoredelta[2]` is added to the score etc.
- `neverplayed-scoredelta` - Score used to ensure important defences are included in the final conclusion 'improvements' page if they're not played. -2 means not playing the defence ends the game early, -1 means not playing the card leads to a bad ending, 0 or greater means it's a very low priority card.
- `onplay-text` - Text to be displayed as a consequence on the turn the card is played. Currently used for Threat Assessment and Asset Audit defences.
- `consequences` - List of 4 (>= number of turns in the game) objects, each containing an `installed` key and a `notinstalled` key. Each turn, the application iterates over every defence, finds the item in the consequence object at the index equal to the current turn, and adds the relevant consequence to the list of consequences to display. Each `consequence` object is structured the same, whether under `installed` or `notinstalled`. This structure is:
  - `text` - Text to be displayed when this consequence is triggered. If this is blank, the consequence is considered to be blank. This is okay (if not reccomeded a lot of the time) as too many consequences each turn can overload players.
  - `scoredelta` - Integer score change to be applied if this consequence is triggered. If this is +VE, it's considered 'good' and green is used for display. If 0 or -VE, it's considered 'bad' and red is used. 
  - `type` - Source of the attack. Used for the 'xyz Attack!' or 'xyz Blocked!' stinger.
  - `image` Name of relevant image to display under the consequence. Path not neccessary as the code knows to look in `/app/static/images/consequences/`. If left blank, no image is displayed.
  - `stat` - Short statistic relevant to the consequence.
  - `stat-source` - Link to the source website for the stat.
  - `example` - Short real-world example of a similar consequence.
  - `example-source` - Link to a more in-depth article/case study of the example.
  - `improvement` - Improvement to be displayed on the final conclusion page if this consequence is reached. Can be left blank.
  - `causes-end` - Boolean - should this consequence being reached trigger the endgame immediately?


### Game logic
Game logic is contained mostly in `static/scripts/gamemanager.js` and `static/scripts/actionturn.js`, with other scripts handling specific elements (eg. modals) or providing helper functions.

Not much should need to change in the game logic if adapting the game to your environment, the only element of the game which is hardcoded in is the 'Threat Assessment' card, which is in lines 69-75 of file `static/scripts/actionturn.js` and the entirety of the `static/threat_assessment.json` file.

### Cards and Consequences
If score values are changed, it may be wise to revisit the endgame score thresholding values (`static/scripts/gamemanager.js`, lines 36-52).

### Graphical elements
The graphics work using PNG transparency. All defences are visualised as 'overlays', files of the same dimension as the baseplate image with areas of transparency surrounding the upgraded component. All assets sit on top of the gameboard baseplate image using absolute positioning, and are defined at page request when Nunjucks preprocesses the page. When a defence is played, it's associated overlay if located and has its opacity faded from 0 to 1 over two seconds. Whilst this occurs, the 'cyber steve' overlay `static/images/board/hammersteve/.png` (again, transparent background) is animated using CSS keyframes in `static/styles/playspace.css`.
