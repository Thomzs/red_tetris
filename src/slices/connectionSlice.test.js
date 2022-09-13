import React from "react";
import reducer, {setConnected, setDisconnected, startConnecting} from './connectionSlice';
import { initialState } from "./connectionSlice";


const thunkMiddleware =
    ({ dispatch, getState }) =>
        next =>
            action => {
                if (typeof action === 'function') {
                    return action(dispatch, getState)
                }
                return next(action)
            }

const create = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn()
    }
    const next = jest.fn()
    const invoke = action => thunkMiddleware(store)(next)(action)
    return { store, next, invoke }
}


describe('connectionSlice tests', () => {
    test('should return the initial state', () => {
        expect(reducer(undefined, { type: undefined })).toEqual(
            initialState);
    });

    test('passes through non-function action', () => {
        const { next, invoke } = create()
        const action = { type: 'TEST' }
        invoke(action)
        expect(next).toHaveBeenCalledWith(action)
    })

    test('calls the function', () => {
        const { invoke } = create()
        const fn = jest.fn()
        invoke(fn)
        expect(fn).toHaveBeenCalled()
    })

    test('passes dispatch and getState', () => {
        const { store, invoke } = create()
        invoke((dispatch, getState) => {
            dispatch('TEST DISPATCH')
            getState()
        })
        expect(store.dispatch).toHaveBeenCalledWith('TEST DISPATCH')
        expect(store.getState).toHaveBeenCalled()
    })

    test("start connecting", () => {
        expect(
            reducer(initialState, startConnecting({room:'testRoom', password:'testPassword'}))
        ).toEqual({
            _connected: false,
            _connecting: true,
            _password: 'testPassword',
            _room: 'testRoom'
        });
    });

    test("connect", () => {
        expect(
            reducer(initialState, setConnected())
        ).toEqual({
            _connected: true,
            _connecting: false,
            _password: "",
            _room: null
        });
    });

    test("disconnect", () => {
        expect(
            reducer(initialState, setDisconnected())
        ).toEqual(initialState);
    });
})
