import {createSlice} from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: 'status',
    initialState: {
        _status: 'INTRO',
        _gameStatus: 'initial',
    },
    reducers: {
        setStatusHome: (state) => {
            state._status = 'HOME';
        },
        setStatusGame: (state) => {
            state._status = 'GAME';
        },
        setGameStatus: (state, action) => {
            state._gameStatus = action.payload.gameStatus;
        }
    },
});

export const {
    setStatusHome,
    setStatusGame,
    setGameStatus,
} = statusSlice.actions;

export default statusSlice.reducer;