import { io, Socket } from "socket.io-client";
import {setConnected, setDisconnected, startConnecting} from "../slices/connectionSlice";
import {setId, setUsername} from "../slices/playerSlice";
import {setGameStatus, setStatusGame, setStatusHome} from "../slices/statusSlice";
import {
    addPlayer,
    setAdmin,
    setPiece,
    setPlayers,
    setRoom,
    playerLost,
    resetGame,
    reset,
    setWin
} from "../slices/roomSlice";

export const socketMiddleware = (store) => {
    let socket = Socket;

    return (next) => (action) => {
        next(action); //Sure ?

        const connected = store.getState()?.connection?._connected;

        if (startConnecting.match(action)) {
            //TODO connection error and disconnect
            if (!connected) {
                socket = io("http://localhost:3001");
            }
            socket.on('joinRoomOk', (data) => {
                store.dispatch(setRoom(data.room));
                if (data.admin) store.dispatch(setAdmin(true));
                store.dispatch(setConnected());
                store.dispatch(setId(data.id));
            });

            socket.on("connect", () => {
                socket.emit('requestJoinRoom', {
                    room: store.getState()?.connection?._room,
                    password: store.getState()?.connection?._password,
                    player: store.getState()?.player
                });
            });

            socket.on('newPlayer', (data) => {
                store.dispatch(addPlayer(data));
            });

            socket.on('updatePlayers', (data) => {
                store.dispatch(setPlayers(data));
            });

            socket.on('newPiece', (data) => {
                if (store.getState().status.gameStatus === 'loose') {
                    socket.emit('readyNext', {board: action.payload.board, room: store.getState().room._name}); //Tell server we are waiting for a tetrimino
                } else {
                    store.dispatch(setPiece(data));
                }
            });

            socket.on('admin', () => {
                store.dispatch(setAdmin(true));
                //TODO
                //socket.emit('message', {from: 'chat': 'xxx is now admin of the room'});
                //store.dispatch(addToChat(from: 'chat', 'You are now admin of the room'));
            });

            socket.on('winner', () => {
                store.dispatch(setWin());
                socket.emit('gameEnd', {room: store.getState().room._name});
            });

            socket.on('lobby', (data) => {
                store.dispatch(reset());
                store.dispatch(setPlayers(data));
                store.dispatch(setGameStatus({gameStatus:'initial'}));
            });

        }

        if (connected) {

            if (setUsername.match(action) && store.getState().status._status === 'GAME') {
                socket?.emit('updatedUsername', {
                    username: action.payload,
                });
            }

            if (setStatusHome.match(action)) {
                socket?.close();
                store.dispatch(setDisconnected());
            }

            if (setGameStatus.match(action) && action.payload.gameStatus === 'readyNext') {
                socket.emit('readyNext', {board: action.payload.board, room: store.getState().room._name}); //Tell server we are waiting for a tetrimino
            } else if (setGameStatus.match(action) && action.payload.gameStatus === 'loose') {
                socket.emit('loose', {room: store.getState().room._name});
                socket.emit('readyNext', {board: action.payload.board, room: store.getState().room._name});
            }
        }
    };
};