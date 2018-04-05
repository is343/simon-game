"use strict";

var round = $('#round');
var start = $('#start');
var strict = $('#strict');
var gAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var rAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var yAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var bAudio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
var wrongAudio = new Audio('https://freesound.org/data/previews/270/270308_5123851-lq.mp3');
var winAudio = new Audio('https://freesound.org/data/previews/270/270330_5123851-lq.mp3');
var colorsAndSounds = [
    [$('.green'), gAudio, 'green-active'],
    [$('.red'), rAudio, 'red-active'],
    [$('.yellow'), yAudio, 'yellow-active'],
    [$('.blue'), bAudio, 'blue-active']
];
var order = [];
var index = 0;
var replayRounds;
var strictGame = false;
var delay;

function colorListeners() {
    colorsAndSounds.forEach(function(color) {
        color[0].on('click', function() {
            humanPlay($(this).text());
        });
        color[0].addClass('go'); // highlight when clicked
    })
}

// disable color listeners
function disableColors() {
    colorsAndSounds.forEach(function(color) {
        color[0].off();
        color[0].removeClass('go');
    })
}

function strictListeners() {
    strict.on('click', function() {
        if (strictGame) {
            strictGame = false;
            strict.toggleClass('strict');
        } else {
            strictGame = true;
            strict.toggleClass('strict');
        }
    })
}

function startListeners() {
    start.on('click', function() {
        if (start.text() === 'START') {
            start.text('RESET'); // become reset button
            strict.off(); // disable strict button
            compPlay(randNum());
        } else { // if is reset button
            disableColors();
            strictListeners(); // enable strict
            start.text('START');
            reset();
        }
    })
}

function randNum() {
    return Math.floor(Math.random() * 4);
}

function humanPlay(move) {
    if (order[index] == move) { // comparing number to string
        index++;
        // play sound
        colorsAndSounds[move][1].play();
    } else { // if wrong
        wrongAudio.play();
        if (strictGame) { // if a strict game
            reset();
            compPlay(randNum());
        }
        index = 0;
        compPlay(null);
    }
    if (index === order.length) {
        if (index === 20) { // trigger end of game
            disableColors();
            reset();
            winAudio.play();
            round.text('YOU WIN!');
            return;
        }
        // trigger comp turn
        index = 0;
        compPlay(randNum());
    }
}

function compPlay(move) {
    // if it's not just to replay the sequence on a wrong guess
    if (move !== null) {
        // add move to list
        order.push(move);
        // keep the tally
        round.text(verifyZeros(order.length));
    }
    // go through list after a delay
    delay = setTimeout(function() {
        replayOrder();
    }, 1000);;
}

// replay the order after an incorrect guess
function replayOrder() {
    // disable buttons
    disableColors();
    replayRounds = 0;
    // recursive subfunction to add the delay
    function replayOrderSub() {
        compMove(order[replayRounds]);
        replayRounds++;
        if (replayRounds < order.length) {
            setTimeout(replayOrderSub, 1000);
        } else if (replayRounds === order.length) {
            // enable buttons
            colorListeners();
        }
    }
    replayOrderSub();
}

// animates the button and plays the sound
function compMove(move) {
    colorsAndSounds[move][1].play();
    colorsAndSounds[move][0].addClass(colorsAndSounds[move][2]);
    delay = setTimeout(function() {
        colorsAndSounds[move][0].removeClass(colorsAndSounds[move][2]);
    }, 500);
}

// adds leading zeros to the round numbers
function verifyZeros(rounds) {
    // num => str
    rounds = rounds.toString();
    // makes sure there is a there are leading zeros to rounds
    if (rounds.length < 2) {
        return '0'.concat(rounds[0]);
    }
    return rounds;
}

// resets everything for strict mode or reset button
function reset() {
    index = 0;
    // resetting replayRounds stops the computer if it's in the middle of a string of moves
    replayRounds = 0;
    order = [];
    round.text('--');
}

$(document).ready(function() {
    strictListeners();
    startListeners();
});