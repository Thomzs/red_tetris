import {configureStore} from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import { socketMiddleware } from "../middleware/socket";
import counterReducer from '../slices/counterSlice'
import connectionReducer from "../slices/connectionSlice";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        connection: connectionReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([socketMiddleware, thunk]),
});

export default store;