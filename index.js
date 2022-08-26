const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const {Status} = require("./src/utils/status");
const server = http.createServer(app);

let clients = [];
let rooms = [];

//just for dev purposes
rooms.push({id: '574839', name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame}, {id: '574840', name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby});

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

    socket.on('statusHome', () => {
       socket.emit('roomList', rooms.map(({password, ...item}) => item)); //Send rooms but don't send password
    });

    socket.on("updatedCounter", (data) => {
        socket.broadcast.emit("updateCounter", data.counter);
    });

    socket.on("disconnect", () => {
        clients = clients.filter(m => { return m.id !== socket.id });
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
});

app.get('/rooms', (req,res) => {
    res.send(rooms);
})

app.get('/askRoom', (req, res) => {
    let roomId = req.query.room;
    let password = req.query.password;
    let room = rooms.find(obj => obj.id === roomId);

    if (!room) {
        res.status(500); //TODO status codes?
        res.send(JSON.stringify({
            message: 'This room does not exist.'
        }));
    } else if (room.password === password) {
        res.send(true);
    } else {
        res.send(false);
    }
})

app.get('/createRoom', (req, res) => {
    let name = req.query.name;
    let password = req.query.password;
    let mode = req.query.mode

    let room = rooms.find(obj => obj.name === name);

    if (room) { //name is already taken
        res.send(JSON.stringify('ROOMNAME-TAKEN'));
    } else {
        rooms.push({
            name: name,
            password: password,
            private: (password !== ''),
            players: [],
            mode: mode,
            status: Status.Lobby,
        });
        res.send(JSON.stringify('ROOM-SUCCESS'));
    }
});

app.listen(8080, () => {
    console.log('Listening on por 8080');
})