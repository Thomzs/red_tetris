const {v4: uuidv4} = require("uuid");
const {Status} = require("../utils/status");
const removeKeys = require("../utils/removeKeys");
const {i, j, k, l, m, n, o} = require('./Piece_utils');

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
                    pieces: [i, j, k, l, m, n, o],
                    status: Status.Lobby,
                    countWaiting: 0,
                    chat: [],
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
                if (room.status === Status.Lobby) {
                    resolve(room);
                } else {
                    reject();
                }
            } else {
                resolve(false);
            }
        })
    }

    joinRoom = (rooms, name, player) => {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].name === name) {
                    rooms[i].players.push(player);
                    let admin = (rooms[i].players.length === 1);
                    resolve({room: rooms[i], admin: admin});
                    return;
                }
            }
            reject();
        });
    }

    removePlayer = (rooms, socketId) => {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < rooms.length; i++) {
                for (let j = 0; j < rooms[i].players.length; j++) {
                    if (rooms[i].players[j].socket.id === socketId) {
                        rooms[i].players.splice(j, 1);
                        if (rooms[i].players.length === 0) {
                            rooms.splice(i, 1);
                            resolve(null);
                        } else if (rooms[i].countWaiting > 0) {
                            rooms[i].countWaiting--;
                        }
                        if (rooms[i].players[j].lost) {
                            rooms[i].lost--;
                        }
                        resolve(rooms[i]);
                        return;
                    }
                }
            }
            reject();
        });
    }

    updateBoard = (rooms, room, id, board) => {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].name === room) {
                    for (let j = 0; j < rooms[i].players.length; j++) {
                        if (rooms[i].players[j].socket.id === id) {
                            rooms[i].players[j]._map = board;
                            if (rooms[i].countWaiting > 0) {
                                rooms[i].countWaiting--;
                            }
                            resolve(rooms[i]);
                            return;
                        }
                    }
                }
            }
            reject('No such room');
        })
    }

    setLoose = (rooms, name, id) => {
        return new Promise((resolve) => {
            let roomIndex = rooms.findIndex((room) => room.name === name);
            let playerIndex = rooms[roomIndex].players.findIndex((player) => player.socket.id === id);

            if (rooms[roomIndex].countWaiting > 0) {
                rooms[roomIndex].countWaiting--;
                rooms[roomIndex].lost++;
            }
            rooms[roomIndex].players[playerIndex].lost = true;
            resolve(rooms[roomIndex].players);
        });
    }

    getWinner = (rooms, name) => {
        return new Promise((resolve, reject) => {
            let roomIndex = rooms.findIndex((room) => room.name === name);
            let winner = false;

            for (let i = 0; i < rooms[roomIndex].players.length; i++) {
                if (rooms[roomIndex].players[i].lost === false) {
                    if (winner !== false) {
                        reject();
                        return;
                    }
                    winner = rooms[roomIndex].players[i];
                }
            }
            if (winner !== false) {
                resolve(winner);
            } else {
                reject();
            }
        });
    }

    resetLost = (rooms, name) => {
        return new Promise((resolve) => {
            let roomIndex = rooms.findIndex((room) => room.name === name);

            for (let i = 0; i < rooms[roomIndex].players.length; i++) {
                rooms[roomIndex].players[i].lost = false;
            }
            rooms[roomIndex].status = Status.Lobby;
            resolve(rooms[roomIndex]);
        });
    }

    createRoomIfNotExist = (rooms, name, password, mode) => {
        return new Promise((resolve, reject) => {
            let room = rooms.find(obj => obj.name === name);

            if (!room) {
                let newRoom = {
                    id: uuidv4(),
                    name: name,
                    password: password,
                    private: (password !== ''),
                    players: [],
                    mode: mode,
                    pieces: [i, j, k, l, m, n, o],
                    status: Status.Lobby,
                    countWaiting: 0,
                    chat: [],
                };
                rooms.push(newRoom);
                resolve(newRoom);
            } else if (room.password === password) {
                if (room.status === Status.Lobby) {
                    resolve(room);
                } else {
                    reject();
                }
            } else {
                resolve(false);
            }
        });
    }
}

module.exports = Room;