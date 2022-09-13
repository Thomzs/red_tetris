import React from "react";
import reducer, {initialState, setStatusGame, setGameStatus, setStatusHome} from "./statusSlice";
import intro from "../views/Intro";

describe('statusSlice tests', () => {
    test('setStatusGame', () => {
       let it = {...initialState};
       let copy = {...initialState};
       copy._status = "GAME";
       expect(reducer(it, setStatusGame())).toEqual(copy);
    });

    test('setStatusHome', () => {
       let copy = {...initialState};
       copy._status = 'HOME';

       expect(reducer(initialState, setStatusHome())).toEqual(copy);
    });

    test('setGameStatus', () => {
       let copy = {...initialState};
       copy._gameStatus = 'A test';

       expect(reducer(initialState, setGameStatus({gameStatus: 'A test'}))).toEqual(copy);
    });
})