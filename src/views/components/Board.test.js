/**
 * @jest-environment jsdom
 */

import {Board, computeRemovedLinesScore, getInterval} from "./Board";
import {initialState} from "../../slices/playerSlice";

import configureStore from "redux-mock-store";
import {Status} from "../../utils/status";
import {DIR} from "../../classes/Piece_utils";
import {i} from "../../classes/Piece_utils";
import { render, screen } from "@testing-library/react";
import {v4} from "uuid";
import {Provider} from "react-redux";
const mockStore = configureStore();


describe('board tests', () => {
   test('initTest', () => {
       let it = initialState;
       let it2 = initialState;
       let store = mockStore({
           connection: {
               _connected: true,
               _connecting: true,
           },
           status: {
               _status: 'INTRO',
               _gameStatus: 'initial',
           },
           player: it,
           room: {
               _id: v4(),
               _admin: false,
               _chat: [],
               _players: [it, it2],
               _mode: 'classic',
               _name: 'test',
               _password: '',
               _currentPiece: {type: i, dir: DIR.UP, x: 2, y: 0},
               _score: 0,
               _won: true,
               _countLost: 0,
               _malus: 0,
               _countRemoved: 0,
               _level: 0,
               _status: Status.Lobby,
           }
       });

       let result = render(
           <Provider store={store}>
               <Board />
           </Provider>
       );

       expect(result.container.querySelectorAll('div[id^=row]').length).toEqual(20);

       // let elem = screen.getByText('rotate');
       // expect(elem).toBeInTheDocument();
   });

    test('computeRemovedLinesScore', () => {
        expect(computeRemovedLinesScore(1)).toBe(40);
        expect(computeRemovedLinesScore(2)).toBe(100);
        expect(computeRemovedLinesScore(3)).toBe(300);
        expect(computeRemovedLinesScore(4)).toBe(1200);
        expect(computeRemovedLinesScore(12)).toBe(1200);
        expect(computeRemovedLinesScore(0)).toBe(0);
    });

    /*describe('Component', () => {
        it('Login::', () => {
            const initialState = { room: { players: [{ id: 'test', name: 'Zobane'}] } }
            const store = createStore(reducers, initialState, applyMiddleware( thunk ))
            const component = renderer.create(
                <Provider store={store}>
                    <Login />
                </Provider>
            )
            expect(component.root.findByProps({className: "content"}).children.length).toEqual(1)
            expect(component.root.findByProps({className: "menu-login"}).children.length).toEqual(2)
        })
    })*/
    test('getInterval', () => {
        let rate = 16.74;
        expect(getInterval(0)).toEqual(rate * 53);
        expect(getInterval(1)).toEqual(rate * 49);
        expect(getInterval(2)).toEqual(rate * 45);
        expect(getInterval(3)).toEqual(rate * 41);
        expect(getInterval(4)).toEqual(rate * 37);
        expect(getInterval(5)).toEqual(rate * 33);
        expect(getInterval(6)).toEqual(rate * 28);
        expect(getInterval(7)).toEqual(rate * 22);
        expect(getInterval(8)).toEqual(rate * 17);
        expect(getInterval(9)).toEqual(rate * 11);
        expect(getInterval(10)).toEqual(rate * 10);
        expect(getInterval(11)).toEqual(rate * 9);
        expect(getInterval(12)).toEqual(rate * 8);
        expect(getInterval(13)).toEqual(rate * 7);
        expect(getInterval(14)).toEqual(rate * 6);
        expect(getInterval(15)).toEqual(rate * 6);
        expect(getInterval(16)).toEqual(rate * 5);
        expect(getInterval(17)).toEqual(rate * 5);
        expect(getInterval(18)).toEqual(rate * 4);
        expect(getInterval(19)).toEqual(rate * 4);
        expect(getInterval(20)).toEqual(rate * 3);
    })
})

    // it('init component', () => {
    //     const _initialState = initialState;
    //
    //     const reducer = [statusReducer, playerReducer, roomReducer];
    //     const _store = store;
    // });
