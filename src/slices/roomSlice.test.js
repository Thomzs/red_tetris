import React from "react";
import reducer, {
    initialState, roomSlice, setRoom, setLevel, setMalus,
    setAdmin, setPiece, setScore, setWin, setPlayers, reset,
    setCountRemoved, setLevelAndCountRemoved, addToChat, sendChat, addPlayer, removePlayer, playerLost, resetGame
} from "./roomSlice";

describe('roomSlice tests', () => {
    test('setRoom test', () => {
        let _initialState = {...initialState};
        _initialState.name = "testRoom";
        _initialState.id = 1;
        _initialState.password = "testPassword";
        _initialState.mode = 'classic';
        _initialState.players = [];
        expect(reducer(initialState, setRoom(_initialState))).toEqual({
            _id: 1,
            _mode: 'classic',
            _name: "testRoom",
            _password: "testPassword",
            _players: [],
            _chat: [],
            _admin: false,
            _currentPiece: null,
            _score: 0,
            _won: false,
            _countLost: 0,
            _malus: 0,
            _countRemoved: 0,
            _level: 0
        });
    });


    test('setAdmin', () => {
        let it = initialState;

        let copy = {... initialState};
        copy._admin = true;
        expect(reducer(initialState, setAdmin(true))).toEqual(copy);
    });

    test('addToChat/SendToChat', () => {
        let newMessage = {id: 3, text:'bla'};
        let it = {...initialState};
        let chat = [{id:1, text: 'bla'}, {id:2, text:'bla'}];
        it._chat = chat;

        expect(reducer(it, addToChat(newMessage))._chat).toEqual([
            {id:1, text: 'bla'}, {id:2, text:'bla'}, {id: 3, text:'bla'}
        ]);
        expect(reducer(it, sendChat(newMessage))._chat).toEqual([
            {id:1, text: 'bla'}, {id:2, text:'bla'}, {id: 3, text:'bla'}
        ]);
    });

    test('addPlayer', () => {
        let _initialState = {...initialState};
        expect(reducer(initialState, addPlayer({player: "testPlayer"}))).toEqual({
            _admin: false,
            _chat: [],
            _countLost: 0,
            _countRemoved: 0,
            _currentPiece: null,
            _id: null,
            _level: 0,
            _malus: 0,
            _mode: 'classic',
            _name: null,
            _password: "",
            _players: [{"player": "testPlayer"}],
            _score: 0,
            _won: false,
            });
    });

    test('setPlayers', () => {
        let it = {...initialState};
        let players = [{id:1, text: 'bla'}, {id:2, text:'bla'}, {id:3, text:'bla'}];
        let copy = {...initialState};

        copy._players = players;
        expect(reducer(initialState, setPlayers(players))).toEqual(copy);
    });

    test('setPiece', () => {
       let it = {...initialState};
       let piece = {blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow' };

       let copy = {...initialState};
       copy._currentPiece = piece;
       expect(reducer(it, setPiece(piece))).toEqual(copy);
    });

    test('setScore', () => {
       let it = {...initialState};
       let copy = {...initialState};
       let addedScore = 100;
       copy._score += addedScore;
       expect(reducer(it, setScore(addedScore))).toEqual(copy);
    });

    test('setWin', () => {
       let it = {...initialState};
       let copy = {...initialState};
       let win = true;
       copy._win = win;
       expect(reducer(it, setWin(win))).toEqual(copy);
    });

    test('setMalus', () => {
       let it = {...initialState};
       let copy = {...initialState};
       let malus = 3;
       copy._malus = malus;
       expect(reducer(it, setMalus(malus))).toEqual(copy);
    });

    test('setLevel', () => {
       let it = {...initialState};
       let copy = {...initialState};
       let level = 2;
       copy._level = level;
       expect(reducer(it, setLevel(level))).toEqual(copy);
    });

    test('setCountRemoved', () => {
       let it = {...initialState};
       let copy = {...initialState};
       let countRemoved = 10;
       copy._countRemoved = countRemoved;
       expect(reducer(it, setCountRemoved(countRemoved))).toEqual(copy);
    });

    test('setLevelAndCountRemoved', () => {
       let it = {...initialState};
       let copy = {...initialState};
       let level = 2;
       let countRemoved = 5;
       copy._level = level;
       copy._countRemoved = countRemoved;
       expect(reducer(it, setLevelAndCountRemoved({level: level, countRemoved: countRemoved}))).toEqual(copy);
    });

    test('resetGame', () => {
        let it = {...initialState};
        let copy = {...initialState};
        it._score = 100;
        it._malus = 2;
        it._level = 2;
        expect(reducer(it, resetGame())).toEqual({
            _id: null,
            _admin: false,
            _chat: [],
            _mode: 'classic',
            _password: "",
            _name: null,
            _players: [],
            _score: 0,
            _currentPiece: null,
            _won: false,
            _countLost: 0,
            _malus: 0,
            _countRemoved: 0,
            _level: 0,
        });
    });

    test('playerLost', () => {
        let it = {...initialState};
        let players = [{id:1, text: 'bla'}, {id:2, text:'bla'}, {id:3, text:'bla'}];
        it._players = players;

        let copy = {...initialState};
        let expected = [{id:1, text: 'bla'}, {id:2, text:'bla', loose: true}, {id:3, text:'bla'}];
        copy._players = expected;
        copy._countLost = 1;

        let id=2;
        expect(reducer(it, playerLost(id))).toEqual(copy);
    });

    test('reset', () => {
       let it = {...initialState};
       let copy = {...initialState};
       it._score = 100;
       expect(reducer(it, reset())).toEqual(copy);
    });
})