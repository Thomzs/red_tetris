/**
 * @jest-environment jsdom
 */

import { computeRemovedLinesScore } from "./Board";
const { Board } = require('./Board');
const { initialState } = require('../../slices/roomSlice');
import React from 'react';
//import renderer, {act} from "react-test-renderer";
import playerReducer from "../../slices/playerSlice";
import roomReducer from "../../slices/roomSlice";
import statusReducer from "../../slices/statusSlice";
const { store } = require('../../store/store');
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import {unmountComponentAtNode} from "react-dom";
import {render} from "sass";
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html\>`)
const document = dom.window.document;

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

describe('board tests', () => {
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

    it('init component', () => {
        const _initialState = initialState;

        const reducer = [statusReducer, playerReducer, roomReducer];
        const _store = store;
        //const component = renderer.create();
        act(() => {
            render(
                <Provider store={store}>
                    <Board />
                </Provider>,
                container
            )
        })
            /*<Provider store={store}>
                <Board />
            </Provider>*/
        //expect(component.root.findByProps({id: "col-0"}).length).toEqual(1);
        //const _board = TestRenderer.create(<Board/>);
        //const testInstance = _board.root;

        //expect(testInstance.findByType(<section/>)).toBe(<section/>);
        //const wrapper = shallow(<Board />);
        //expect(1).toBe(1);
    });

})