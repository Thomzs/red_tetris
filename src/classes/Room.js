const {v4: uuidv4} = require("uuid");
const {Status} = require("../utils/status");

class Room {

    getRoomListNoPasswords = (rooms) => {
        return new Promise((resolve => resolve(rooms.map(({password, ...item}) => item))))
    }

    createRoom = (rooms, name, password, mode) => {
        return new Promise((resolve, reject) => {
            let room = rooms.find(obj => obj.name === name);

            if (room) { //name is already taken
                reject();
            } else {
                let newRoom = {
                    id: uuidv4(),
                    name: name,
                    password: password,
                    private: (password !== ''),
                    players: [],
                    mode: mode,
                    status: Status.Lobby,
                };
                rooms.push(newRoom);
                resolve(newRoom);
            }
        });
    }

    checkRoomPassword = (rooms, id, password) => {
        return new Promise((resolve, reject) => {
            let room = rooms.find(obj => obj.id === id);

            if (!room) {
                reject();
            } else if (room.password === password) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    }
}

module.exports = Room;