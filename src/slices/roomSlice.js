import {createSlice} from "@reduxjs/toolkit";
import {v4 as uuidv4} from "uuid";
import {Status} from "../utils/status";

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        _id: null,
        _gameStatus: 'ReadyForNextPiece',
        _admin: false,
        _chat: [],
        _players: [],
        _mode: 'classic',
        _name: null,
        _password: ''
    },
    reducers: {
        setRoom: (state, action) => {
            state._id = action.payload.id;
            state._mode = action.payload.mode;
            state._name = action.payload.name;
            state._password = action.payload.password;
            state._players = action.payload.players;
        },
        setAdmin: (state, action) => {
            state._admin = action.payload;
        },
        addToChat: (state, action) => {
            state._chat.push(action.payload);
        },
        addPlayer: (state, action) => {
            state._players.push(action.payload);
        },
        setPlayers: (state, action) => {
            state._players = action.payload;
        }
    },
});

export const {
    setRoom,
    setAdmin,
    addToChat,
    addPlayer,
    setPlayers,
} = roomSlice.actions;

export default roomSlice.reducer;