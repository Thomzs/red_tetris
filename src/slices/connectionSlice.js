import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    _connected: false,
    _connecting: false,
    _room: null,
    _password: '',
};

const connectionSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {
        startConnecting: (state, action) => {
            state._connecting = true;
            state._room = action.payload.room;
            state._password = action.payload.password;
        },
        setConnected: (state) => {
            state._connected = true;
        },
        setDisconnected: (state) => {
            state._connected = false;
            state._room = null;
        }
    },
});

export const { startConnecting, setConnected, setDisconnected } = connectionSlice.actions;
export default connectionSlice.reducer;