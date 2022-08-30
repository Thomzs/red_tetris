const gamePieces = require("../classes/Piece_utils.js");
const KEY = require("../classes/Piece_utils");
const DIR = require("../classes/Piece_utils");
const speed = require("../classes/Piece_utils");
const sizeX = require("../classes/Piece_utils");
const sizeY = require("../classes/Piece_utils");
const nu = require("../classes/Piece_utils");
//const pieces = require("../classes/Piece_utils");
const i = require("../classes/Piece_utils");
const j = require("../classes/Piece_utils");
const k = require("../classes/Piece_utils");
const l = require("../classes/Piece_utils");
const m = require("../classes/Piece_utils");
const n = require("../classes/Piece_utils");
const o = require("../classes/Piece_utils");

// Generate board game
export function makeArray(w, h, val) {
    let arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
};

let playing = false;
let pieces = []; // List of generated pieces
let dx, dy  = 20; // Pixel size of a single tetris block
let blocks  = makeArray(sizeX, sizeY, 0); // Game board
let actions = []; // List of actions taken by the user
let nextPiece; // Next piece to be generated
let currPiece; // Last piece generated, which is currently present in the board and falling
let timer; // Game timer since start of the game
let score = 0;
let rows = 0; // Number of cleaned row
let cumulativeCleanedRows = 0; // If multiple rows cleaned at onces, allows score calculation
let nextStep; // How long before current piece drops by 1 row
let invalid;

// ---------- Setters and getters ---------- //

function setScore(n) {
    score = n; invalidateScore();
};

function addScore(n) {
    score = score + n;
};

function setRows(n) {
    rows = n; nextStep = Math.max(speed.min, speed.start - (speed.decrement * rows));
    invalidateRows();
};

function addRows(n) {
    setRows(rows + n);
};

// Checks whether a (x, y) position is already occupied
function getBlock(x,y) {
    return (blocks && blocks[x] ? blocks[x][y] : null);
};

function setBlock(x,y,type) {
    blocks[x] = blocks[x] || []; blocks[x][y] = type; invalidate();
};

function setCurrentPiece(piece) {
    currPiece = piece || randomPiece(); invalidate();
};

function setNextPiece(piece) {
    nextStep = piece || randomPiece(); invalidateNext();
};

// ----------------------------------------- //

function invalidate() {
    invalid.court  = true;
};

function invalidateNext() {
    invalid.next   = true;
};

function invalidateScore() {
    invalid.score  = true;
};

function invalidateRows() {
    invalid.rows   = true;
};

export function keydown(ev) {
    switch(ev.keyCode) {
        case KEY.LEFT:   actions.push(DIR.LEFT);  break;
        case KEY.RIGHT:  actions.push(DIR.RIGHT); break;
        case KEY.UP:     actions.push(DIR.UP);    break;
        case KEY.DOWN:   actions.push(DIR.DOWN);  break;
        case KEY.ESC:    lose();                  break;
    }
};

export function handle(action) {
    switch(action) {
        case DIR.LEFT:  move(DIR.LEFT);  break;
        case DIR.RIGHT: move(DIR.RIGHT); break;
        case DIR.UP:    rotate();        break;
        case DIR.DOWN:  drop();          break;
    }
};

export function update(idt) {
    if (playing) {
        handle(actions.shift());
        timer = timer + idt;
        if (timer > nextStep) {
            timer = timer - nextStep;
            drop();
        }
    }
};

export function move(dir) {
    let x = currPiece.x, y = currPiece.y;
    switch(dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT:  x = x - 1; break;
        case DIR.DOWN:  y = y + 1; break;
    }
    if (unoccupied(currPiece.type, x, y, currPiece.dir)) {
        currPiece.x = x;
        currPiece.y = y;
        invalidate();
        return true;
    }
    else {
        return false;
    }
};


// TODO better implementation, this is only temporary
export function lose() {
    alert("GAME OVER");
}

export function drop() {
    if (!move(DIR.DOWN)) {
        addScore(10);
        dropPiece();
        //removeLines(); TODO implement removeLines function
        setCurrentPiece(nextPiece);
        setNextPiece(randomPiece());
        if (occupied(currPiece.type, currPiece.x, currPiece.y, currPiece.dir)) {
            lose();
        }
    }
};

export function dropPiece() {
    eachBlock(currPiece.type, currPiece.x, currPiece.y, currPiece.dir, function(x, y) {
        setBlock(x, y, currPiece.type);
    });
};

export function rotate(dir) {
    let newDir = (currPiece.dir === DIR.MAX ? DIR.MIN : currPiece.dir + 1);
    if (unoccupied(currPiece.type, currPiece.x, currPiece.y, newDir)) {
        currPiece.dir = newDir;
        invalidate();
    }
};

// Helped function that iterates over all the cells in the tetris grid that the piece will occupy
function eachBlock(type, x, y, dir, fn) {
    let bit, result, row = 0, col = 0, blocks = type.blocks[dir];
    for(bit = 0x8000 ; bit > 0 ; bit = bit >> 1) {
        if (blocks & bit) {
            fn(x + col, y + row);
        }
        if (++col === 4) {
            col = 0;
            ++row;
        }
    }
};

// Selects random piece available pieces pool, duplicates inside pool to avoid not getting any piece
function randomPiece() {
    if (pieces.length === 0)
        pieces = [i, i ,i , i, j, j, j, j, k, k, k, k, l, l, l, l, m, m, m, m, n, n, n, n, o, o, o, o];
    // Not sure about the random piece selection below, may need to rework this line
    //var type = pieces.splice(Math.random(0, pieces.length-1), 1)[0]; // remove a single piece

    let type = pieces.splice(Math.floor(Math.random() * pieces.length - 1), 1)[0]; // remove a single piece
    return { type: type, dir: DIR.UP, x: 2, y: 0 };
};

// Checks if any of the required blocks to place the next piece are occupied or not
function occupied(type, x, y, dir) {
    let result = false
    eachBlock(type, x, y, dir, function(x, y) {
        if ((x < 0) || (x >= sizeX) || (y < 0) || (y >= sizeY) || getBlock(x,y))
            result = true;
    });
    return (result);
};

// Same as occupied but the other way around
export function unoccupied(type, x, y, dir) {
    return !occupied(type, x, y, dir);
};

