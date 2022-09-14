const {DIR, speed, sizeY, sizeX} = require("../classes/Piece_utils");

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
}


let score = 0;
let rows = 0; // Number of cleaned row
let nextStep; // How long before current piece drops by 1 row

export function addScore(n) {
    score = score + n;
}

export function setRows(n) {
    rows = n; nextStep = Math.max(speed.min, speed.start - (speed.decrement * rows));
}

export function getBlock(blocks, x, y) {
    return (blocks && blocks[y] ? blocks[y][x] : null);
}

export function setBlock(blocks,y,x,type) {
    blocks[x] = blocks[x] || []; blocks[x][y] = type;
    return blocks;
}

export function move(blocks, currPiece, dir) {
    let x = currPiece.x, y = currPiece.y;
    switch(dir) {
        case DIR.RIGHT: x = x + 1; break;
        case DIR.LEFT:  x = x - 1; break;
        case DIR.DOWN:  y = y + 1; break;
    }
    if (unoccupied(blocks, currPiece.type, x, y, currPiece.dir)) {
        let tmp = {...currPiece};
        tmp.x = x;
        tmp.y = y;
        return tmp;
    }
    else {
        return false;
    }
}


// TODO better implementation, this is only temporary
export function loose() {
    alert("GAME OVER");
}

export function getFreeLinesFromTop(blocks) {
    let count = 0;

    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            if (blocks[i][j] !== 0) return count;
        }
        count++;
    }
    return count;
}

export function addMalus(board, malus) {
    let tmp = board.map(inner => inner.slice());

    if (getFreeLinesFromTop(tmp) < malus) return false;

    let newLine = [];
    for (let i = 0; i < 10; i++) {
        newLine.push({color: '#34362c', removable: false});
    }

    tmp.splice(0, malus);

    for (let j = 0; j < malus; j++) {
        tmp.push(newLine);
    }

    return tmp;
}

export function checkSingleLine(line) {
    for (let i = 0; i <= 9; i++) {
        if (line[i] === 0 || line[i].removable === false) {
            return false;
        }
    }
    return true;
};

export function removeLines(blocks) {
    let removedLines = 0;
    for (let y = 19; y >= 0; y--) {
        if (checkSingleLine(blocks[y])) {
            blocks.splice(y, 1);
            removedLines++;
        }
    }
    for (let tmp = 0; tmp < removedLines; tmp++) {
        blocks.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    return {board:blocks, removedLines:removedLines};
}

export function dropPiece(blocks, currPiece) {
    return eachBlock(blocks, currPiece.type, currPiece.x, currPiece.y, currPiece.dir, function(blocks, x, y) {
        setBlock(blocks, x, y, currPiece.type);
    });
}

export function rotate(blocks, currPiece) {
    let tmp = {...currPiece};
    let newDir = (currPiece.dir === DIR.MAX ? DIR.MIN : currPiece.dir + 1);
    if (unoccupied(blocks, currPiece.type, currPiece.x, currPiece.y, newDir)) {
        tmp.dir = newDir;
       // invalidate();
    }
    return tmp;
}

// Helped function that iterates over all the cells in the tetris grid that the piece will occupy
export function eachBlock(blocks, type, x, y, dir, fn) {
    let bit, row = 0, col = 0, _blocks = type.blocks[dir];
    for (bit = 0x8000 ; bit > 0 ; bit = bit >> 1) {
        if (_blocks & bit) {
            fn(blocks, x + col, y + row);
        }
        if (++col === 4) {
            col = 0;
            ++row;
        }
    }
    return blocks;
}

// Checks if any of the required blocks to place the next piece are occupied or not
export function occupied(blocks, type, x, y, dir) {
    let result = false;
    eachBlock(blocks, type, x, y, dir, function(blocks, x, y) {
        if ((x < 0 || x >= sizeX) || (y < 0 || y >= sizeY) || getBlock(blocks, x, y))
            result = true;
    });
    return (result);
}

// Same as occupied but the other way around
export function unoccupied(blocks, type, x, y, dir) {
    return !occupied(blocks, type, x, y, dir);
}
