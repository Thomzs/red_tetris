export let LEFT = undefined;
let i = { blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: 'cyan'   };
let j = { blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'   };
let k = { blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange' };
let l = { blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' };
let m = { blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'  };
let n = { blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple' };
let o = { blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'    };

let gamePieces = [i, j, k, l, m, n, o];

let KEY     = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }; //Key codes
let DIR     = { UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3 }; // Direction enum
let speed   = { start: 0.6, decrement: 0.005, min: 0.1 }; //seconds until current piece drops 1 row
let sizeX   = 10; // width of grid
let sizeY   = 20; // height of grid
let nu      = 5; // width/height of upcoming preview (in blocks)

module.exports = {gamePieces, i, j, k, l, m, n, o, KEY, DIR, speed, sizeY, sizeX, nu}