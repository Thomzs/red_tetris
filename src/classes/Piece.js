const { game_board } = require("./Piece_utils.js");
const { colors } = require("./Piece_utils.js");
const { gamePieces } = require("./Piece_utils.js");
const {DIR} = require("./Piece_utils");
const {i, j, k, l, m, n, o} = require('./Piece_utils');


class Piece {

    getPiece = (rooms, name) => {
        return new Promise((resolve, reject) => {
            let idx_room = rooms.findIndex((room) => room.name === name);
            if (rooms[idx_room].pieces.length === 0) {
                rooms[idx_room].pieces = [i, j, k, l, m, n, o];
            }
            let type = rooms[idx_room].pieces.splice(Math.floor(Math.random() * rooms[idx_room].pieces.length), 1);

            //let type = gamePieces[Math.floor(Math.random() * gamePieces.length)];
            resolve({type: type[0], dir: DIR.UP, x: 2, y: 0});
        });
    };

}

module.exports = Piece;