import {createSlice} from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name:'counter',
    initialState: { counter: 0 },
    reducers: {
        increment(state, action) {
            state.counter++;
        },
        decrement(state, action) {
            state.counter--;
        },
        addBy(state, action) {
            state.counter += action.payload;
        },
        setCounter(state, action) {
            state.counter = action.payload.counter;
        }
    }
});

export const {
    increment,
    decrement,
    addBy,
    setCounter
} = counterSlice.actions;

export default counterSlice.reducer;