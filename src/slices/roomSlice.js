import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    _id: null,
    _admin: false,
    _chat: [],
    _players: [],
    _mode: 'classic',
    _name: null,
    _password: '',
    _currentPiece: null,
    _score: 0,
    _won: false,
    _countLost: 0,
    _malus: 0,
    _countRemoved: 0,
    _level: 0,
}

const roomSlice = createSlice({
    name: 'room',
    initialState: initialState,
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
        sendChat: (state, action) => {
            state._chat.push(action.payload);
        },
        addPlayer: (state, action) => {
            state._players.push(action.payload);
        },
        setPlayers: (state, action) => {
            state._players = action.payload;
        },
        removePlayer: (state, action) => {
            state._players.filter((p) => p.id !== action.payload);
        },
        setPiece: (state, action) => {
            state._currentPiece = action.payload;
        },
        setScore: (state, action) => {
            state._score = action.payload;
        },
        setWin: (state) => {
            state._win = true;
        },
        setMalus: (state, action) => {
            state._malus = action.payload;
        },
        playerLost: (state, action) => {
            let player = state._players.findIndex((p) => p.id === action.payload);

            state._players[player].loose = true;
            state._countLost++;
        },
        setCountRemoved: (state, action) => {
            state._countRemoved = action.payload;
        },
        setLevel: (state, action) => {
            state._level = action.payload;
        },
        setLevelAndCountRemoved: (state, action) => {
            state._level = action.payload.level;
            state._countRemoved = action.payload.countRemoved;
        },
        resetGame: (state) => {
            state._score = 0;
            state._currentPiece = null;
            state._won = false;
            state._countLost = 0;
            state._malus = 0;
            state._countRemoved = 0;
            state._level = 0;
        },
        reset: () => initialState,
    },
});

export const {
    setRoom,
    setAdmin,
    addToChat,
    addPlayer,
    setPlayers,
    setPiece,
    setScore,
    setWin,
    setMalus,
    removePlayer,
    sendChat,
    playerLost,
    setCountRemoved,
    setLevel,
    setLevelAndCountRemoved,
    resetGame,
    reset,
} = roomSlice.actions;

export default roomSlice.reducer;