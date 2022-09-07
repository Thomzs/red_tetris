import { io, Socket } from "socket.io-client";
import {setConnected, setDisconnected, startConnecting} from "../slices/connectionSlice";
import { setUsername } from "../slices/playerSlice";
import {setGameStatus, setStatusGame, setStatusHome} from "../slices/statusSlice";
import {addPlayer, setAdmin, setPiece, setPlayers, setRoom} from "../slices/roomSlice";
import {DIR} from "../classes/Piece_utils";

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
                console.log(data);
                store.dispatch(setPiece(data));
            });

            socket.on('admin', () => {
                store.dispatch(setAdmin(true));
                //socket.emit('message', {from: 'chat': 'xxx is now admin of the room'});
                //store.dispatch(addToChat(from: 'chat', 'You are now admin of the room'));
            })
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
            }
        }
    };
};