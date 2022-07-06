import {configureStore} from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import { socketMiddleware } from "../middleware/socket";
import playerReducer from '../slices/playerSlice'
import connectionReducer from "../slices/connectionSlice";

const store = configureStore({
    reducer: {
        player: playerReducer,
        connection: connectionReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([socketMiddleware, thunk]),
});

export default store;