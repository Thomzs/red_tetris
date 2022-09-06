import {createSlice} from "@reduxjs/toolkit";
import {makeArray} from "../utils/piece";
const { uniqueNamesGenerator, adjectives, names } = require('unique-names-generator');

function bzeroMap() {
    let rows = 20;
    let columns = 10;

    return new Array(rows).fill(0).map(() => new Array(columns).fill(0));
}

function makeAvatar(username) { //TODO randomize colors a bit more
    return 'https://source.boringavatars.com/marble/120/' + username + '?colors=264653,2a9d8f,e9c46a,f4a261,e76f51';
}

function makeUsername() {
    let username;

    do {
        username = uniqueNamesGenerator({ dictionaries: [adjectives, names] });
    } while (username.length > 15);
    return username.replace('_', ' ');
}

const username = makeUsername();

const playerSlice = createSlice( {
    name: "player",
    initialState: {
        _username: username,
        _avatar: makeAvatar(username),
        _role: 0,
        _score: 0,
        _map: makeArray(10, 20, 0),
        _error: null,
    },
    reducers: {
        setUsername: (state, action) => {
            state._username = action.payload;
            state._avatar = makeAvatar(action.payload);
        },
        setRole: (state, action) => {
            state._role = action.payload.role;
        },
        setError: (state, action) => {
            state._error = action.payload.error;
        },
        resetMap: (state) => {
            state._map = makeArray(10, 20, 0);
        }
    },
});

export const {
    setUsername,
    setRole,
    setError,
    resetMap
} = playerSlice.actions;

export default playerSlice.reducer;