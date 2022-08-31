class Player {

    newPlayer = (players, socket) => {
        return new Promise(((resolve, reject) => {
            let newPlayer = {
              socket: socket
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
                resolve(players[i]);
                return;
            }
            resolve(null);
        }));
    }
}

module.exports = Player;