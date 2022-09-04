const { game_board } = require("./Piece_utils.js");
const { colors } = require("./Piece_utils.js");
const { gamePieces } = require("./Piece_utils.js");

class Piece {
    /*getColor = () => {
        return new Promise((resolve, reject) => {
            resolve(colors[Math.floor(Math.random() * colors.length)]);
        });
    };*/

    getPiece = () => {
        return new Promise((resolve, reject) => {
            resolve(gamePieces[Math.floor(Math.random() * gamePieces.length)]);
            });
    };

    /*play = () => {
        while (1) {

        }
    }*/

}

module.exports = Piece;