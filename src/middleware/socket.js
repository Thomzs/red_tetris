import { io, Socket } from "socket.io-client";
import {setConnected, setDisconnected, startConnecting} from "../slices/connectionSlice";
import { setUsername } from "../slices/playerSlice";
import {setStatusHome} from "../slices/statusSlice";
import {addPlayer, setPlayers, setRoom} from "../slices/roomSlice";

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
                store.dispatch(setRoom(data));
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
        }
    };
};