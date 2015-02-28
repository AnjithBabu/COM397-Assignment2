/// <reference path="objects/button.ts" />


var canvas;
var stage: createjs.Stage;

// GAME CONSTANTS
var NUM_REELS: number = 3;

// Game Objects 
var game: createjs.Container;
var background: createjs.Bitmap;
var jackpotImg: createjs.Bitmap;
var spinButton: objects.Button;
var powerButton: objects.Button;
var resetButton: objects.Button;
var betTenButton: objects.Button;
var betMaxButton: objects.Button;
var tiles: createjs.Bitmap[] = [];
var tileContainers: createjs.Container[] = [];

// Game Variables
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 20;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;
var checkPower = true;
var winningText = new createjs.Text("0", "23px play", "#000000");
var pointsWonText = new createjs.Text("0", "23px play", "#000000");
var scoreText = new createjs.Text("000000", "23px play", "#000000");
var jackpotText = new createjs.Text("Good Luck", "48px jiggler", "#000000");
var onOffText = new createjs.Text("", "37px play", "#000000");


/* Tally Variables */
var red = 0;
var bomb = 0;
var hal = 0;
var chuck = 0;
var matilda = 0;
var terence = 0;
var blues = 0;
var pigs = 0;

function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20); // Enable mouse events
    createjs.Ticker.setFPS(60); // 60 frames per second
    createjs.Ticker.addEventListener("tick", gameLoop);

    main();
}

// Function to refresh stage
function gameLoop() {
    stage.update(); // Refreshes our stage
}


/* Utility function to reset all bird reels */
function resetBirdsTally() {
    red = 0;
    bomb = 0;
    hal = 0;
    chuck = 0;
    matilda = 0;
    terence = 0;
    blues = 0;
    pigs = 0;
}


/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    turn = 0;
    playerBet = 20;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;

    // removes all the texts from the canvas before redrawing the texts with updates values
    game.removeChild(scoreText);
    game.removeChild(pointsWonText);
    game.removeChild(winningText);
    game.removeChild(jackpotText);
    game.removeChild(jackpotImg);


    scoreText = new createjs.Text(playerMoney.toString(), "23px play", "#000000"); // initilizes createJs text
    scoreText.x = 92
    scoreText.y = 411;
    game.addChild(scoreText);

    winningText = new createjs.Text(winNumber.toString(), "23px play", "#000000");
    winningText.x = 330
    winningText.y = 411;
    game.addChild(winningText);

    pointsWonText = new createjs.Text(winnings.toString(), "23px play", "#000000");
    pointsWonText.x = 213
    pointsWonText.y = 411;
    game.addChild(pointsWonText);
}

// function called when spin button is called
function spinReels() {
    
    resetBirdsTally(); // reset all reel values to zero
    spinResult = Reels(); // call the spinning reel function
    determineWinnings(); // call the function to determine the winnings
    playerMoney = playerMoney + winnings; // adding the winnings to the playermoney

    // removes all the texts from the canvas before redrawing the texts with updates values
    game.removeChild(scoreText);
    game.removeChild(pointsWonText);
    game.removeChild(winningText);
    game.removeChild(jackpotText);
    game.removeChild(jackpotImg);
    

    scoreText = new createjs.Text(playerMoney.toString(), "23px play", "#000000"); // initilizes createJs text
    scoreText.x = 92
    scoreText.y = 411;
    game.addChild(scoreText);

    winningText = new createjs.Text(winNumber.toString(), "23px play", "#000000");
    winningText.x = 330
    winningText.y = 411;
    game.addChild(winningText);

    pointsWonText = new createjs.Text(winnings.toString(), "23px play", "#000000");
    pointsWonText.x = 213
    pointsWonText.y = 411;
    game.addChild(pointsWonText);


    if (red == 2) { // when jackpot is hit, it is set to two reels of reds because it is very hard to win jackpot otherwise
        console.log("entered here");
        jackpotImg = new createjs.Bitmap("assets/images/jackpot.gif");
        jackpotImg.x = 108;
        jackpotImg.y = 111;
        game.addChild(jackpotImg);
        playSound("jackpot");  // call the generic sound playing function

    }
    else if (winnings == 0) { // when player loose, show text
        jackpotText = new createjs.Text("Snap! Pigs", "48px jiggler", "#000000");
        jackpotText.x = 108
        jackpotText.y = 120;
        game.addChild(jackpotText);
        playSound("Fail");   // call the generic sound playing function

    } else // otherwise player wins , show that player won
    {
        jackpotText = new createjs.Text("Woo! Birds You won", "38px jiggler", "#000000");
        jackpotText.x = 71
        jackpotText.y = 120;
        game.addChild(jackpotText);
        playSound("Win"); // call the generic sound playing function
    }

    // Iterate over the number of reels
    for (var index = 0; index < NUM_REELS; index++) {
        tileContainers[index].removeAllChildren();
        tiles[index] = new createjs.Bitmap("assets/images/" + spinResult[index] + ".png");
        tileContainers[index].addChild(tiles[index]);
    }

    // update the player money and reset winnings
    winnings = 0;
    playerMoney = playerMoney - (playerBet + 30);
    pigs = 0;

    if (playerMoney < 0) // disable the spin button when there is not enough credits to play
    {
        spinButton.getImage().removeEventListener("click", loadCoin, false);
    }
}

/*
 Generic function to play songs. Fuctions accepts song name as input. It should be 
 an mp3 file and should be in assets>audio folder. 
*/
function playSound(songName)
{
    createjs.Sound.registerSound({ id: songName, src: "assets/audio/" + songName +".mp3" }); // register sound using sound name
    createjs.Sound.addEventListener("fileload", handleFileLoad); // after the sound is preloaded this even is called 
    function handleFileLoad(event) {
        // A sound has been preloaded.
        if (event.id == songName) { // checks the song id
            var soundInstance = createjs.Sound.play(songName);
            soundInstance.on("complete", resetAudio); // fires after the current audio is completed.
        }
    }

    function resetAudio() { // removes the sound after player it, so that it can be replayed.
    
        createjs.Sound.removeSound("assets/audio/" + songName +".mp3", "");
    }
}



/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}


/* When this function is called it determines the betLine results.
e.g. red - chuck - blues */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):  // 41.5% probability
                betLine[spin] = "minion";
                pigs++;
                break;
            case checkRange(outCome[spin], 28, 37): // 15.4% probability
                betLine[spin] = "red";
                red++;
                break;
            case checkRange(outCome[spin], 38, 46): // 13.8% probability
                betLine[spin] = "bomb";
                bomb++;
                break;
            case checkRange(outCome[spin], 47, 54): // 12.3% probability
                betLine[spin] = "hal";
                hal++;
                break;
            case checkRange(outCome[spin], 55, 59): //  7.7% probability
                betLine[spin] = "chuck";
                chuck++;
                break;
            case checkRange(outCome[spin], 60, 62): //  4.6% probability
                betLine[spin] = "matilda";
                matilda++;
                break;
            case checkRange(outCome[spin], 63, 64): //  3.1% probability
                betLine[spin] = "terence";
                terence++;
                break;
            case checkRange(outCome[spin], 65, 65): //  1.5% probability
                betLine[spin] = "blues";
                blues++;
                break;
        }
    }
    return betLine;
}


/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (pigs == 0) {
        if (red == 3) {
            winnings = playerBet * 10;
            
        }
        else if (bomb == 3) {
            winnings = playerBet * 20;
            bomb = 0;
        }
        else if (hal == 3) {
            winnings = playerBet * 30;
            hal = 0;
        }
        else if (chuck == 3) {
            winnings = playerBet * 40;
            chuck = 0;
        }
        else if (matilda == 3) {
            winnings = playerBet * 50;
            matilda = 0;
        }
        else if (terence == 3) {
            winnings = playerBet * 75;
            terence = 0;
        }
        else if (blues == 3) {
            winnings = playerBet * 100;
            blues = 0;
        }
        else if (red == 2) {
            winnings = playerBet * 2;
            red = 0;
        }
        else if (bomb == 2) {
            winnings = playerBet * 2;
            bomb = 0;
        }
        else if (hal == 2) {
            winnings = playerBet * 3;
            hal = 0;
        }
        else if (chuck == 2) {
            winnings = playerBet * 4;
            chuck = 0;
        }
        else if (matilda == 2) {
            winnings = playerBet * 5;
            matilda = 0;
        }
        else if (terence == 2) {
            winnings = playerBet * 10;
            terence = 0;
        }
        else if (blues == 2) {
            winnings = playerBet * 20;
            blues = 0;
        }
        else {
            winnings = playerBet * 1;
        }

        if (blues == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
    }
    else {
        lossNumber++;
    }

}

/*
    Function that registers the coin sound and spins the reels when the sound is finished 
    playing.
*/
function loadCoin()
{
    createjs.Sound.registerSound({ id: "coin", src: "assets/audio/Coin.mp3" });
    createjs.Sound.addEventListener("fileload", handleFileLoad);
    function handleFileLoad(event) {
        // A sound has been preloaded.
        if (event.id == 'coin') {
            var soundInstance = createjs.Sound.play("coin");
            soundInstance.on("complete", resetAudio);
        }
    }

    function resetAudio() {
        spinReels(); // call the spin reel function to spin the reels once the coin sound has played
        createjs.Sound.removeSound("assets/audio/Coin.mp3", "");
    }
}

/*
    Function to populate the game container with all the buttons and backgorund image
*/
function createUI():void {
    // instantiate background
    background = new createjs.Bitmap("assets/images/background.png");
    game.addChild(background);

    //create containers to hold the reel images
    for (var index = 0; index < NUM_REELS; index++) {
        tileContainers[index] = new createjs.Container();
        tileContainers[index].x = 100 + (118 * index);
        tileContainers[index].y = 290;
        game.addChild(tileContainers[index]);
    }

    //postion winning text
    winningText.x = 330;
    winningText.y = 411;
    game.addChild(winningText);

    //postion score text
    scoreText.x = 92;
    scoreText.y = 411;
    game.addChild(scoreText);

    //postion points Won text
    pointsWonText.x = 213;
    pointsWonText.y = 411;
    game.addChild(pointsWonText);

    //postion jackpot text
    jackpotText.x = 108
    jackpotText.y = 120;
    game.addChild(jackpotText);

    // Spin Button
    spinButton = new objects.Button("assets/images/spinButton.png", 43, 470);
    game.addChild(spinButton.getImage());

    //power Button
    powerButton = new objects.Button("assets/images/offbtn.png", 417, 460);
    game.addChild(powerButton.getImage());

    // Reset Button
    resetButton = new objects.Button("assets/images/resetButton.png", 427, 550);
    game.addChild(resetButton.getImage());

    // Bet 10
    betTenButton = new objects.Button("assets/images/bet10.png", 180, 491);
    game.addChild(betTenButton.getImage());

    // Bet Max
    betMaxButton = new objects.Button("assets/images/betMax.png", 180, 550);
    game.addChild(betMaxButton.getImage());

    //Register all the buttons with the even listeners 

    powerButton.getImage().addEventListener("click", powerOnOff);
    betTenButton.getImage().addEventListener("click", function () {
        playerBet = 10;
        game.removeChild(onOffText);
        onOffText = new createjs.Text("On", "23px play", "#2EFE2E");
        onOffText.x = 300
        onOffText.y = 491;
        game.addChild(onOffText);
    });

    betMaxButton.getImage().addEventListener("click", function () {
        playerBet = 20;
        game.removeChild(onOffText);
        onOffText = new createjs.Text("On", "23px play", "#2EFE2E");
        onOffText.x = 300
        onOffText.y = 550;
        game.addChild(onOffText);
    });

    resetButton.getImage().addEventListener("click", function () {
        resetAll();
    });

    playSound("background"); // load the background sound
}

/*
    Function that toggles the spin button and power button image when power button is clicked.
    It removes the spin button click even listener and adds it alternatively.
*/

function powerOnOff() {
    
    if (checkPower) { // truns on the spin button
        game.removeChild(powerButton.getImage());
        powerButton = new objects.Button("assets/images/onbtn.png", 417, 460); // changes power button image to on image
        game.addChild(powerButton.getImage());
        powerButton.getImage().addEventListener("click", powerOnOff);
        spinButton.getImage().addEventListener("click", loadCoin); // add click event to spin button
        checkPower = false; // toogles the check
    } else
    {
        spinButton.getImage().removeEventListener("click", loadCoin, false);
        game.removeChild(powerButton.getImage());
        powerButton = new objects.Button("assets/images/offbtn.png", 417, 460); // changes power button to off image
        game.addChild(powerButton.getImage());
        powerButton.getImage().addEventListener("click", powerOnOff); // removes the click event from spin button
        checkPower = true; // toogles the check
    }

    playSound("powerOn"); // load power sound
}


// Our Game Kicks off in here
function main() {
    // instantiate my game container
    game = new createjs.Container();
    game.x = 23;
    game.y = 6;

    // Create Slotmachine User Interface
    createUI();

    stage.addChild(game);
}