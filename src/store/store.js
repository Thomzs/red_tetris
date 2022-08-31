import {configureStore} from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import { socketMiddleware } from "../middleware/socket";
import playerReducer from '../slices/playerSlice'
import connectionReducer from "../slices/connectionSlice";
import statusReducer from "../slices/statusSlice"
import roomReducer from "../slices/roomSlice";

const store = configureStore({
    reducer: {
        player: playerReducer,
        status: statusReducer,
        room: roomReducer,
        connection: connectionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([socketMiddleware, thunk]),
});

export default store;