//contains functions for most game operations

//board dimensions
const boardWidth = 11;
const boardHeight = 11;

const shotsPerTurn = 5;


var gameData = {
    ships: [{name: "Carrier", sunk: false, coords: new Array(5)},
        {name: "Battleship", sunk: false, coords: new Array(4)}, 
        {name: "Cruiser", sunk: false, coords: new Array(3)}, 
        {name: "Submarine", sunk: false, coords: new Array(3)}, 
        {name: "Destroyer", sunk: false, coords: new Array(2)}],
    shotList: [],
    shotHistory: [],
    hitHistory: []
}

function generateHistoryHTML(){
    //create html for 'previous shot' table
    let shotTableHTML = "<table><tr><th style='width: 11em'>Previous</th>" +
    "<th style='width: 11em'>Result</th></tr>";

    for(let i=0; i<gameData.shotHistory.length; i++){
        shotTableHTML += "<tr class='previousShot' id='" + i + "'><td>" + gameData.shotHistory[i] + 
            "</td><td>" + gameData.hitHistory[i] + "</td></tr>";
    }

    shotTableHTML += "</table>";

    return shotTableHTML;
}

/**
 * Adds square's id to current shotlist
 * @param {object} square html element representing square being shot at
 * @return {boolean} true if added successfully
 */
function addToShotList(square) {
    var added = false;
    if(gameData.shotList.length < shotsPerTurn){
        gameData.shotList.push(square.attr("id"));
        added = true;
    }
    return added;
}



/**
 * Adds shot list as well as resulting hits and misses to shot history
 * and clears current shot list for the next turn
 * @param {array} shots array of shot locations to check
 */
function resolveShots(shots){
    if(shots.length > 0){
        //update shot history
        gameData.shotHistory.unshift(shots);

        //check hits and misses
        let ships = gameData.ships;
        var hits = 0;
        var misses = 0;
        for(let shotNum=0; shotNum<shots.length; shotNum++){
            let shotHit = false;
            for(let shipNum=0; shipNum<gameData.ships.length; shipNum++){
                if(shipIsHit(ships[shipNum], shots[shotNum])){
                    hits++;
                    //subtract from ship hp, check if sunk
                    console.log(ships[shipNum].name + " hit at " + shots[shotNum]);
                    shotHit = true;
                    break;
                }
            }
            if(!shotHit){
                misses++;
            }
        }
        
        gameData.hitHistory.unshift("" + hits + " hits, " + misses + " misses");
    }
}

/**
 * Checks if a shot fired at a given board square has hit the given ship
 * @param {object} ship ship to check if hit
 * @param {string} coordinate id of board square to check
 * @return {boolean} true if ship was hit
 */
function shipIsHit(ship, coordinate){
    var hit = false;
    ship.coords.forEach((coord) => {
        if(coord == coordinate){
            hit = true;
        }
    });
    return hit;
}

/**
 * Clears shot list array in game data
 */
function resetShotList(){
    gameData.shotList = [];
}


/**
 * Converts int values 1 - 10 to corresponding capital letter
 * @param {number} int integer to convert to capital letter
 * @return {string} capital letter corresponding to integer
 */
function intToLetter(int){
    var letter= "invalid";
    switch(int){
        case 1:
            letter = "A";
            break;
        case 2:
            letter = "B";
            break;
        case 3:
            letter = "C";
            break;
        case 4:
            letter = "D";
            break;
        case 5:
            letter = "E";
            break;
        case 6:
            letter = "F";
            break;
        case 7:
            letter = "G";
            break;
        case 8:
            letter = "H";
            break;
        case 9:
            letter = "I";
            break;
        case 10:
            letter = "J";
            break;
        default:
            console.log("intToLetter() invalid value : " + int);
    }
    return letter;
}

/**
 * Creates html for the table the game will be played on
 * @return {string} html for table representing game board
 */
function generateBoardHTML(){
    var boardHTML = "<table id='board'>";

    //create top row (letters)
    boardHTML += "<tr>";
    for(let i=0; i<boardWidth; i++){
        if(i == 0){
            boardHTML += "<td></td>";
        }else{
            boardHTML += "<td class='boardHeader'>" + intToLetter(i) + "</td>"
        }
    }
    boardHTML += "</tr>"

    //create rows and columns
    for(let row = 1; row<boardHeight; row++){
        boardHTML += "<tr>"
        for(let col=0; col<boardWidth; col++){
            if(col == 0){
                boardHTML += "<td class='boardHeader'>" + row + "</td>";
            }else{
                boardHTML += "<td class='water' id='" + intToLetter(col) + row + "'></td>";
            }
        }
        boardHTML += "</tr>";
    }

    boardHTML += "</table>";
    return boardHTML;
}

/**
 * Places ships in ship array on board in random, non-overlapping positions
 * @param {object} ship ship object being placed
 * @param {number} index index of ship in array
 * @param {array} shipArray array ship belongs to
 */
function placeShip(ship, index, shipArray){
    var invalidPlacement;

    do{
        invalidPlacement = false;

        //50% chance for ship to be horizontal or vertical
        if(Math.random() < .5){
            //place vertically
            var startY = Math.ceil(Math.random() * (10 - ship.coords.length));
            var startX = intToLetter(Math.ceil(Math.random() * 10));
            for(let i=0; i<ship.coords.length; i++){
                ship.coords[i] = startX + (startY + i);
            }
        } else {
            //place horizontally
            var startX = Math.ceil(Math.random() * (10 - ship.coords.length));
            var startY = Math.ceil(Math.random() * 10);
            for(let i=0; i<ship.coords.length; i++){
                ship.coords[i] = intToLetter(startX + i) + startY;
            }
        }

        console.log(ship.name + " " + ship.coords);

        //check if ship overlaps w/ already placed ship
        for(let i=0; i<index; i++){
            if(overlaps(ship, shipArray[i])){
                invalidPlacement = true;
                break;
            }
        }
    } while(invalidPlacement);
}

/**
 * Checks whether or not two ships have been placed in overlapping positions
 * @param {object} ship1 first ship being checked
 * @param {object} ship2 second ship being checked
 * @return {boolean} true if ships overlap
 */
function overlaps(ship1, ship2){
    var shipsOverlap = false;
    for(let i=0; i<ship1.coords.length; i++){
        for(let j=0; j<ship2.coords.length; j++){
            if(ship1.coords[i] == ship2.coords[j]){
                shipsOverlap = true;
                console.log(ship1.name + " overlaps at " + ship1.coords[i]);
                break;
            }
        }
        if(shipsOverlap){
            break;
        }
    }

    return shipsOverlap;
}