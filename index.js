const express = require("express");
const app = express();
const cors = require("cors");
const {Server} = require("socket.io");
const {Status} = require("./src/utils/status");
const { v4: uuidv4 } = require('uuid');
const Room = require("./src/classes/Room");
const Player = require("./src/classes/Player");
const Piece = require("./src/classes/Piece");
const removeKeys = require("./src/utils/removeKeys");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

const _Room = new Room();
const _Player = new Player();
const _Piece = new Piece();

let players = [];
let rooms = [];

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
io.adapter(createAdapter(pubClient, subClient));

app.use(cors());
pubClient.connect().then();
subClient.connect().then();

io.on("connection", async(socket) => {
    console.log("CONNECTION FROM: ", socket.handshake.headers.origin);
    await _Player.newPlayer(players, socket);


    const sendPiece = (_room, piece) => {
        if (_room.status !== Status.InGame) {//Game has just started
            _room.status = Status.InGame;
            _room.lost = _room.players.length;
        }
        io.to(_room.name).emit('newPiece', piece);
        _room.countWaiting = _room.players.length;
    }

    //On disconnect, remove player from the room he was in.
    //if player was admin, set the first one in the list as the new admin
    //And tell him
    socket.on("disconnect", async () => {
        _Room.removePlayer(rooms, socket.id)
            .then((_room) => {
                if (_room !== null) { //null room means the player was last to leave, and the room is deleted.
                    let tmp = Object.assign(_room.players);
                    socket.to(_room.name).emit('updatePlayers', removeKeys(tmp, 'socket')); //REMOVE PLAYER WITH ID
                    let index = players.findIndex(p => p.socket.id === socket.id);

                    io.to(_room.name).emit('newChat', {from: 'system', text: `${players[index]._username} has left the room`});

                    if (players[index].admin && _room.players[0]) {
                        let newAdmin = players.findIndex(p => p.socket.id === _room.players[0].socket.id);
                        players[newAdmin].admin = true;
                        players[newAdmin].socket.emit('admin');
                    }

                    if (_room.countWaiting === 0) {
                        _Piece.getPiece(rooms, _room.name)
                            .then((piece) => {
                                sendPiece(_room, piece);
                            })
                            .catch((r) => console.log(r));
                    }
                }
                players = players.filter(p => { return p.socket.id !== socket.id });
            })
            .catch(() => {console.log('Error removing player from a room')});
    });

    //User joining a room
    socket.on('requestJoinRoom', async (data) => {
        await _Player.updatePlayer(players, socket.id, data.player);
        _Room.checkRoomPassword(rooms, data.room.id, data.room.password)
            .then(_ => socket.join(data.room.name))///If yes join
            .catch(_ => socket.emit('joinError'))///Else joinError.
    });

    socket.on('requestStart', (data) => {
        let index = rooms.findIndex((room) => room.name = data.room);
        rooms[index].status = Status.willStart;
        io.to(data.room).emit('willStart');
        io.to(data.room).emit('newChat', {from: 'system', text: 'Get Ready! Next game will start in five seconds.'});
        setTimeout(() => {
            _Piece.getPiece(rooms, data.room)
                .then((piece) => {
                    sendPiece(rooms[index], piece);
                })
                .catch((r) => console.log(r));
        }, 5000);
    });

    //Player asking for a tetrimino
    //Send to everyone a new piece only if every player in the room is done with the current piece.
    socket.on('readyNext', async (data) => {
        _Room.updateBoard(rooms, data.room, socket.id, data.board)
            .then((_room) => {
                if (data.board !== null) {
                    let tmp = Object.assign(_room.players);
                    socket.to(_room.name).emit('updatePlayers', removeKeys(tmp, 'socket'));
                }
                if (_room.countWaiting === 0) {
                    _Piece.getPiece(rooms, data.room)
                        .then((piece) => {
                            sendPiece(_room, piece);
                        })
                        .catch((r) => console.log(r));
                }
                console.log('removedLines: ', data.removedLines);
                if (data.removedLines && data.removedLines > 1) {
                    let toAdd = data.removedLines <= 4 ? data.removedLines - 1 : 3;
                    console.log('sending malus: ', toAdd);
                    socket.to(_room.name).emit('malus', toAdd);
                }
            })
            .catch((reason => socket.emit('error', reason)));
    });

    //A player has lost. Keep tracks of it, share the update in the room.
    //Then, if the is only one player left in the room that did not lose, tell him he's the winner
    socket.on('loose', (data) => {
        _Room.setLoose(rooms, data.room, socket.id)
            .then((players) => {
                let tmp = Object.assign(players);
                socket.to(data.room).emit('updatePlayers', removeKeys(tmp, 'socket'));
                _Room.getWinner(rooms, data.room)
                    .then((winner) => {
                        winner.socket.emit('winner');
                    })
                    .catch(r => console.log(r));
            });
    });

    //User has acknowledged that he was the winner. Reset the room state for everyone.
    socket.on('gameEnd', (data) => {
        _Room.resetLost(rooms, data.room)
            .then((_room) => {
                let tmp = Object.assign(_room);
                io.to(data.room).emit('lobby', removeKeys(tmp, 'socket'));
            })
            .catch(r => console.log(`Error accessing room ${data.room}`));
    });

    //Just broadcast messages
    socket.on('chat', (data) => {
        socket.to(data.room).emit('newChat', data.message);
    })
});

//User has joiner a room. Keep tracks of the room he is in.
//If he is the first in the room, he is the admin.
//Share the update within the room
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
    if (!rooms.length || !players.length || room === id) return;

    let player = players.find(p => p.socket.id === id);
    if (!player) return;

    _Room.joinRoom(rooms, room, player)
        .then((ret) => {
            let tmp = Object.assign({}, ret.room);
            tmp = removeKeys(tmp, 'socket'); //Socket object should be private,
            player?.socket.emit('joinRoomOk', {room: tmp, admin: ret.admin, id: player._id});
            player?.socket.to(room).emit('newPlayer', removeKeys(player, 'socket'));
            io.to(room).emit('newChat', {from: 'system', text: `${player._username} has joined the room`, key: 'join', playerId: player._id});
            player.admin = ret.admin;
        })
        .catch(() => player?.socket.emit('joinError'));
});

pubClient.on("error", (err) => {
    console.log(err.message);
});

subClient.on("error", (err) => {
    console.log(err.message);
});

app.get('/rooms', (req,res) => {
    _Room.getRoomListNoPasswords(rooms).then(r => res.send(r));
})

app.get('/askRoom', (req, res) => {
    let roomId = req.query.room;
    let password = req.query.password;

    _Room.checkRoomPassword(rooms, roomId, password)
        .then(r => res.send(r))
        .catch(() => res.send(JSON.stringify({ message: 'This room does not exist.'})));
})

app.get('/createRoom', (req, res) => {
    let name = req.query.name;
    let password = req.query.password;
    let mode = req.query.mode

    _Room.createRoom(rooms, name, password, mode)
        .then((r) => res.send(r))
        .catch(() => res.send(JSON.stringify('ROOMNAME-TAKEN')));
});

io.listen(3001);

app.listen(8080, () => {
    console.log('Listening on por 8080');
});