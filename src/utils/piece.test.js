//import {expect, jest, test} from '@jest/globals';
//const { checkSingleLine } = require("./piece.js");
import {checkSingleLine, getBlock, makeArray, setBlock} from "./piece";
import {l} from "../classes/Piece_utils";
describe('lines and blocks tests', () => {
   test('makeArray empty array', () => {
      let block = makeArray(10, 20, 0);
      let emptyArray = true;
      for (let i = 0; i <= 19; i++) {
         for (let j = 0; j <= 9; j++) {
            // eslint-disable-next-line no-unused-expressions
            block[i][j] !== 0 ? emptyArray = !emptyArray : emptyArray;
         }
      }
      expect(emptyArray).toBe(true);
   });

   test('checks a empty line -> should be false', () => {
      expect(checkSingleLine([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(false);
   });

   test('checks a full line -> should be true', () => {
      expect(checkSingleLine([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])).toBe(true);
   });

   test('getBlock for an empty (x, y) coordinates -> should be 0', () => {
      expect(getBlock(makeArray(10, 20, 0), 5, 5)).toBe(0);
   });

   test('getBlock at an occupied position -> should be 1', () => {
      let block = makeArray(10, 20, 0);
      block[5][5] = 1;
      expect(getBlock(block, 5, 5)).toBe(1);
   });

   test('setBlock test', () => {
      let block = makeArray(10, 20, 0);
      block = setBlock(block, 5, 5, l);
      expect(block[5][5]).toStrictEqual({"blocks": [52224, 52224, 52224, 52224], "color": "yellow"}
      );
   });



});
