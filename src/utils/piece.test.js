import {
   checkSingleLine, getBlock, makeArray, move, setBlock, eachBlock, unoccupied,
   occupied, dropPiece, rotate
} from "./piece";
import { l, j, DIR } from "../classes/Piece_utils";


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

   test('checkSingleLine a empty line -> should be false', () => {
      expect(checkSingleLine([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(false);
   });

   test('checkSingleLine a full line -> should be true', () => {
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

   test('occupied test for an empty area', () => {
      let block = makeArray(10, 20, 0);
      let piece = l;
      expect(occupied(block, l, 5, 5, 2)).toBe(false);
   });

   test('occupied test for an occupied area', () => {
      let block = makeArray(10, 20, 0);
      let piece = l;
      block = setBlock(block, 5, 5, piece);
      expect(occupied(block, l, 5, 5, 2)).toBe(true);
   });

   test('unoccupied test for an empty area', () => {
      let block = makeArray(10, 20, 0);
      let piece = l;
      expect(unoccupied(block, piece, 5, 5, 2)).toBe(true);
   });

   test('unoccupied test for an occupied area', () => {
      let block = makeArray(10, 20, 0);
      let piece = l;
      block = setBlock(block, 5, 5, piece);
      expect(unoccupied(block, piece, 5, 5, 2)).toBe(false);
   });

   /*test('rotate from DIR 2 to DIR 3 unoccupied', () => {
      let block = makeArray(10, 20, 0);
      let piece = j;
      piece.DIR = 2;
      block = setBlock(block, 5, 5, piece);
      piece = rotate(block, piece);
      expect(piece.DIR).toBe(3);
   });*/

   /*test('dropPiece test', () => {
      let block = makeArray(10, 20, 0);
      let piece = l;
      block = setBlock(block, 5, 5, piece);
      dropPiece(block, piece);
      expect(block[6][5]).toStrictEqual({"blocks": [52224, 52224, 52224, 52224], "color": "yellow"});
   });*/

   /*test('move test, moving block piece one row down', () => {
      let block = makeArray(10, 20, 0);
      let piece = l;
      block = setBlock(block, 5, 5, l);

      move(block, piece, DIR.DOWN);
      expect(block[6][5]).toStrictEqual({"blocks": [52224, 52224, 52224, 52224], "color": "yellow"}
      );
   })*/

});
