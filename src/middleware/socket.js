import { io, Socket } from "socket.io-client";
import { setConnected, startConnecting } from "../slices/connectionSlice";
import {
    increment,
    decrement,
    addBy,
    setCounter
} from "../slices/counterSlice";

export const socketMiddleware = (store) => {
    let socket = Socket;

    return (next) => (action) => {
        next(action); //Sure ?

        const connected = store.getState()?.connection?.connected;

        if (startConnecting.match(action)) {
            //TODO connection error and disconnect
            if (!connected) {
                socket = io("http://localhost:3001");
            }
            socket.on("connect", () => {
                store.dispatch(setConnected());
            });
            socket.on("updateCounter", (data) => {
               store.dispatch(setCounter(data));
            });
        }
        if (connected) {
            if (increment.match(action) || decrement.match(action) || addBy.match(action)) {
                socket?.emit('updatedCounter', {
                    counter: store.getState().counter,
                });
            }
        }
    };
};