const { game_board } = require("./Piece_utils.js");
const { colors } = require("./Piece_utils.js");
const { gamePieces } = require("./Piece_utils.js");
const {DIR} = require("./Piece_utils");

class Piece {
    /*getColor = () => {
        return new Promise((resolve, reject) => {
            resolve(colors[Math.floor(Math.random() * colors.length)]);
        });
    };*/

    getPiece = () => {
        return new Promise((resolve, reject) => {
            let type = gamePieces[Math.floor(Math.random() * gamePieces.length)];
            resolve({type: type, dir: DIR.UP, x: 2, y: 0});
        });
    };

    /*play = () => {
        while (1) {

        }
    }*/

}

module.exports = Piece;