const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {Server} = require("socket.io");
const server = http.createServer(app);

let clients = [];

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

    socket.on("updatedCounter", (data) => {
       io.emit("updateCounter", data.counter);
    });

    socket.on("disconnect", () => {
        clients = clients.filter(m => { return m.id !== socket.id});
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
});