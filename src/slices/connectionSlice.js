import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _connected: false,
    _connecting: false,
};

const connectionSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {
        startConnecting(state) {
            state._connecting = true;
        },
        setConnected(state) {
            state._connected = true;
        },
    },
});

export const { startConnecting, setConnected } = connectionSlice.actions;
export default connectionSlice.reducer;