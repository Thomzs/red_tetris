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
rooms.push({id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame, chat: []}, {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby, chat: []});

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

    socket.on('readyNext', () => {
        _Piece.getPiece()
            .then((piece) => {
                socket.emit('newPiece', piece);
            })
    });
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
    if (!rooms.length || !players.length || room === id) return;

    let player = players.find(p => p.socket.id === id);
    if (!player) return;

    _Room.joinRoom(rooms, room, player)
        .then((_room) => {
            let tmp = Object.assign({}, _room);
            tmp = removeKeys(tmp, 'socket'); //Socket object should be private,
            player?.socket.emit('joinRoomOk', tmp);
            player?.socket.to(room).emit('newPlayer', removeKeys(player, 'socket'));
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

app.get('/getPiece', (req, res) => {
   //So here to send a piece: something like
    //_Piece.getPiece().then(r => res.send(r)); because its asynchronous.
});

io.listen(3001);

app.listen(8080, () => {
    console.log('Listening on por 8080');
});