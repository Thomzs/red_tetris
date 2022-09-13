import {createSlice} from "@reduxjs/toolkit";

export const initialState = {
    _status: 'INTRO',
    _gameStatus: 'initial'
};


export const statusSlice = createSlice({
    name: 'status',
    initialState: initialState,
    reducers: {
        setStatusHome: (state) => {
            state._status = 'HOME';
        },
        setStatusGame: (state) => {
            state._status = 'GAME';
        },
        setGameStatus: (state, action) => {
            state._gameStatus = action.payload.gameStatus;
        },
        requestStart: () => {},
    },
});

export const {
    setStatusHome,
    setStatusGame,
    setGameStatus,
    requestStart,
} = statusSlice.actions;

export default statusSlice.reducer;