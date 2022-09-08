import { computeRemovedLinesScore, Board } from "./Board";
import { shallow } from "enzyme";
import React from 'react';
import Adapter from 'enzyme-adapter-react-18';
import { Provider } from "react-redux";

import { o, DIR } from "../../classes/Piece_utils";
import {render, screen, cleanup, fireEvent} from "@testing-library/react";
//import '@testing-library/jest-dom'

// runs after each test suit is executed to clean react doms and everything
/*afterEach(() => {
    cleanup(); // Resets the DOM after each test suite
})*/

describe('board tests', () => {
    test('computeRemovedLinesScore', () => {
        expect(computeRemovedLinesScore(1)).toBe(40);
        expect(computeRemovedLinesScore(2)).toBe(100);
        expect(computeRemovedLinesScore(3)).toBe(300);
        expect(computeRemovedLinesScore(4)).toBe(1200);
        expect(computeRemovedLinesScore(12)).toBe(1200);
        expect(computeRemovedLinesScore(0)).toBe(0);
    });

    test('init component', () => {
        const wrapper = shallow(<Board />);

        expect(1).toBe(1);
    });
    /*it("should render components without crashing", () => {
        const wrapper = mount(
            <Provider store={store}>
                <Game
                    data={{
                        clicked: 1,
                        setclicked: () => {},
                        username: "khaoula",
                        setusername: () => {},
                        roomName: "room",
                        setroomName: () => {},
                        setmode: () => {},
                        start: true,
                        setstart: () => {},
                    }}
                />
            </Provider>
        );*/

    /*test('basic Board component test', () => {
        render(<Board/>);
        const button = screen.getByTestId("left-button");
        fireEvent.click(button);
    });*/
})