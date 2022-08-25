import { io, Socket } from "socket.io-client";
import { setConnected, startConnecting } from "../slices/connectionSlice";
import { setUsername } from "../slices/playerSlice";
import {
    increment,
    decrement,
    addBy,
    setCounter
} from "../slices/counterSlice";
import {setStatusHome, setRooms} from "../slices/statusSlice";

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
            socket.on("connect", () => {
                store.dispatch(setConnected());
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
            }
        }
    };
};