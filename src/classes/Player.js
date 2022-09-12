const { v4: uuidv4 } = require('uuid');

class Player {

    newPlayer = (players, socket) => {
        return new Promise(((resolve, reject) => {
            let newPlayer = {
                socket: socket,
                _id: null,
                lost: false,
            };
            players.push(newPlayer);
            resolve();
        }));
    }

    updatePlayer = (players, socketId, info) => {
        return new Promise(((resolve) => {
            for (let i = 0; i < players.length; i++) {
                if (players[i].socket.id !== socketId) continue;

                Object.assign(players[i], info);
                players[i]._id = uuidv4();
                resolve(players[i]);
                return;
            }
            resolve(null);
        }));
    }
}

module.exports = Player;