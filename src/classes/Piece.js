const {DIR} = require("./Piece_utils");
const {i, j, k, l, m, n, o} = require('./Piece_utils');

class Piece {

    getPiece = (rooms, name) => {
        return new Promise((resolve, reject) => {
            let idx_room = rooms.findIndex((room) => room.name === name);

            if (idx_room < 0 || rooms[idx_room] === undefined) {
                reject(`Error accessing room named: ${name}`);
            }
            if (rooms[idx_room].pieces.length === 0) {
                rooms[idx_room].pieces = [i, j, k, l, m, n, o];
            }
            let type = rooms[idx_room].pieces.splice(Math.floor(Math.random() * rooms[idx_room].pieces.length), 1);

            resolve({type: type[0], dir: DIR.UP, x: 2, y: 0});
        });
    };

}

module.exports = Piece;