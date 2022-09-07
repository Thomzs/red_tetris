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

//just for dev purposes
rooms.push({id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame, chat: [], countWaiting: 0}, {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby, chat: [], countWaiting: 0});

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

    socket.on("disconnect", async () => {
        _Room.removePlayer(rooms, socket.id)
            .then((_room) => {
                if (_room !== null) { //null room means the player was last to leave, and the room is deleted.
                    let tmp = Object.assign(_room.players);
                    socket.to(_room.name).emit('updatePlayers', removeKeys(tmp, 'socket'));
                    let player = players.find(p => p.socket.id === socket.id);
                    if (player.admin && _room.players[0]) {
                        let newAdmin = players.find(p => p.socket.id === _room.players[0].socket.id);
                            newAdmin.admin = true;
                            newAdmin.socket.emit('admin');
                    }
                }
                players = players.filter(p => { return p.socket.id !== socket.id });
            })
            .catch(() => {console.log('Error removing player from a room')});
    });

    socket.on('requestJoinRoom', async (data) => {
        await _Player.updatePlayer(players, socket.id, data.player);
        _Room.checkRoomPassword(rooms, data.room.id, data.room.password)
            .then(_ => socket.join(data.room.name))///If yes join
            .catch(_ => socket.emit('joinError'))///Else joinError.
    });

    socket.on('readyNext', async (data) => {
        _Room.updateBoard(rooms, data.room, socket.id, data.board)
            .then((_room) => {
                if (data.board !== null) {
                    socket.to(_room.name).emit('updatePlayers', removeKeys(_room.players, 'socket'));
                }
                if (_room.countWaiting === 0) {
                    _Piece.getPiece()
                        .then((piece) => {
                            io.to(_room.name).emit('newPiece', piece);
                            _room.countWaiting = _room.players.length;
                        });
                }
            })
            .catch((reason => socket.emit('error', reason)));
    });
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
    if (!rooms.length || !players.length || room === id) return;

    let player = players.find(p => p.socket.id === id);
    if (!player) return;

    _Room.joinRoom(rooms, room, player)
        .then((ret) => {
            let tmp = Object.assign({}, ret.room);
            tmp = removeKeys(tmp, 'socket'); //Socket object should be private,
            player?.socket.emit('joinRoomOk', {room: tmp, admin: ret.admin});
            player?.socket.to(room).emit('newPlayer', removeKeys(player, 'socket'));
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