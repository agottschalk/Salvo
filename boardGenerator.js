//creates html for game board, does not add game logic

var boardWidth = 11;
var boardHeight = 11;

//enemy ship objects
var ships = [{name: "Carrier", sunk: false, coords: new Array(5)},
{name: "Battleship", sunk: false, coords: new Array(4)}, 
{name: "Cruiser", sunk: false, coords: new Array(3)}, 
{name: "Submarine", sunk: false, coords: new Array(3)}, 
{name: "Destroyer", sunk: false, coords: new Array(2)}];

//converts int values 1 - 10 to corresponding capital letter
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

//returns string containing html for game board
function generateBoard(){
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

//places ship object on board in a random position
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

//checks if 2 ships overlap
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