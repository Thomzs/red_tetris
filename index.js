const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const {Status} = require("./src/utils/status");
const server = http.createServer(app);
const { v4: uuidv4 } = require('uuid');
const Room = require("./src/classes/Room");

const _Room = new Room();

let clients = [];
let rooms = [];

//just for dev purposes
rooms.push({id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame}, {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("CONNECTION FROM: ", socket.handshake.headers.origin);
    clients.push(socket);


    socket.on("disconnect", () => {
        clients = clients.filter(m => { return m.id !== socket.id });
        //TODO remove client from the room he was in;
    });

    socket.on('readyForNextPiece', () => {

    })
});

server.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
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

app.listen(8080, () => {
    console.log('Listening on por 8080');
})