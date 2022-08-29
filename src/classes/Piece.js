const { game_board } = require("./Piece_utils.js");
const { colors } = require("./Piece_utils.js");
const { game_pieces } = require("./Piece_utils.js");

class Piece {
    getColor = () => {
        return new Promise((resolve, reject) => {
            resolve(colors[Math.floor(Math.random() * colors.length)]);
        });
    }

    getPiece = () => {
        return new Promise((resolve, reject) => {
            resolve(game_pieces[Math.floor(Math.random() * game_pieces.length)]);
            });
    }

}

module.exports = Piece;