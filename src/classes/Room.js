const {v4: uuidv4} = require("uuid");
const {Status} = require("../utils/status");
const removeKeys = require("../utils/removeKeys");

class Room {

    getRoomListNoPasswords = (rooms) => {
        return new Promise((resolve => {
            let tmp = Array.from(rooms);

            for (let i = 0; i < tmp.length; i++) {
                tmp[i] = removeKeys(tmp[i], 'socket');
                delete tmp[i].password;
            }

            resolve(tmp);
        }));
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
                    chat: [],
                };
                rooms.push(newRoom);
                resolve(newRoom);
            }
        });
    }

    getRoom = (rooms, id, password) => {
        return new Promise((resolve, reject) => {
            let room = rooms.find(obj => obj.id === id && obj.password === password);

            if (room) resolve(room);
            else reject();
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

    joinRoom = (rooms, name, player) => {
        return new Promise(((resolve, reject) => {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].name === name) {
                    rooms[i].players.push(player);
                    resolve(rooms[i]);
                    return;
                }
            }
            reject();
        }))
    }

    leaveRoom = (rooms, socketId) => {
    }
}

module.exports = Room;