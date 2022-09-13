import reducer, {
    initialState,
    makeAvatar,
    makeUsername,
    setId,
    setRole,
    setUsername,
    setError,
    resetMap
} from "./playerSlice";
import React from "react";
import {makeArray} from "../utils/piece";

describe('playerSlice tests', () => {
    test('makeAvatar', () => {
        let username = 'bonsoir guys';
        expect(makeAvatar(username)).toBe('https://source.boringavatars.com/marble/120/' + username + '?colors=264653,2a9d8f,e9c46a,f4a261,e76f51');
    });

    test('makeUsername', () => {
       let usernames = [];
       let valid = true;
       for (let i = 0; i < 150; i++) {
           usernames.push(makeUsername());
       }
       for (let i = 0; i < usernames.length; i++) {
           expect(usernames[i].length).toBeLessThanOrEqual(15);
       }
    });

    test('setUsername for playerSlice', () => {
        let username = "testUsername";
        let map = makeArray(10, 20, 0);
        let avatar = makeAvatar(username);
        expect(reducer(initialState, setUsername(username))).toEqual({
            _id: null,
            _username: username,
            _avatar: avatar,
            _role: 0,
            _score: 0,
            _map: map,
            _error: null,
        });
    });

    test('setError for playerSlice', () => {
        let _initialState = initialState;

       expect(reducer(_initialState, setError({error: true}))).toEqual({
           _id: null,
           _username: _initialState._username,
           _avatar: _initialState._avatar,
           _role: 0,
           _score: 0,
           _map: _initialState._map,
           _error: true,
       });
    });

    test('setId', () => {
        let _initialState = initialState;

        expect(reducer(_initialState, setId('abcd1234'))).toEqual({
            _id: 'abcd1234',
            _username: _initialState._username,
            _avatar: _initialState._avatar,
            _role: 0,
            _score: 0,
            _map: _initialState._map,
            _error: null,
        });
    })

    test('setRole', () => {
        let _initialState = initialState;

        expect(reducer(_initialState, setRole({role: 'admin'}))).toEqual({
            _id: null,
            _username: _initialState._username,
            _avatar: _initialState._avatar,
            _role: 'admin',
            _score: 0,
            _map: _initialState._map,
            _error: null,
        });
    })

    test('resetMap', () => {
        let _initialState = initialState;

        expect(reducer(_initialState, resetMap())).toEqual({
            _id: null,
            _username: _initialState._username,
            _avatar: _initialState._avatar,
            _role: 0,
            _score: 0,
            _map: _initialState._map,
            _error: null,
        });
    })
});