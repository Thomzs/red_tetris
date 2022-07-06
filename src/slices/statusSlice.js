import {createSlice} from "@reduxjs/toolkit";

const statusSlice = createSlice({
    name: 'status',
    initialState: { _status: 'INTRO' },
    reducers: {
        setStatusHome: (state) => {
            console.log("updated");
            state._status = 'HOME';
        },
        setStatusGame: (state) => {
            state._status = 'GAME';
        },
    },
});

export const {
    setStatusHome,
    setStatusGame
} = statusSlice.actions;

export default statusSlice.reducer;