import {
   checkSingleLine, getBlock, makeArray, move, setBlock, unoccupied,
   occupied, dropPiece, rotate, getFreeLinesFromTop, addMalus, removeLines
} from "./piece";
import { l, j, o, i, DIR } from "../classes/Piece_utils";


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

   test('dropPiece to unoccupied area', () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: l, dir: DIR.DOWN, x: 5, y: 5};
      block = setBlock(block, 5, 5, piece);
      dropPiece(block, piece);
      expect(block[6][5]).toStrictEqual({"blocks": [52224, 52224, 52224, 52224], "color": "yellow"});
   });

   test("dropPiece to an occupied area", () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: o, dir: DIR.UP, x: 5, y: 5};
      let newPiece = {type: i, dir: DIR.RIGHT, x: 5, y: 6};
      block = setBlock(block, 5, 5, piece);
      block = setBlock(block, 6, 5, newPiece)

      dropPiece(block, piece);
      expect(block[6][5]).toStrictEqual({"blocks": [3168, 19584, 50688, 9792], "color": "red"});
   });

   test('move piece to the right', () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: l, dir: DIR.DOWN, x: 5, y: 5};
      block = setBlock(block, 5, 5, piece);
      let ret = move(block, piece, DIR.RIGHT);
      expect([ret.x, ret.y]).toStrictEqual([6, 5]);
   });

   test('move piece to the left', () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: o, dir: DIR.UP, x: 5, y: 5};
      block = setBlock(block, piece, 5, 5);
      let ret = move(block, piece, DIR.LEFT);
      expect([ret.x, ret.y]).toStrictEqual([4, 5]);
   })

   test('move piece down', () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: o, dir: DIR.UP, x: 5, y: 5};
      block = setBlock(block, piece, 5, 5);
      let ret = move(block, piece, DIR.DOWN);
      expect([ret.x, ret.y]).toStrictEqual([5, 6]);
   });

   test('rotate straight line with unoccupied space', () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: i, dir: DIR.DOWN, x: 5, y: 5};
      block = setBlock(block, piece, 5, 5);
      let ret = rotate(block, piece);
      expect(ret.dir).toBe(3);
   });

   test('rotate straight line with occupied space because of border', () => {
      let block = makeArray(10, 20, 0);
      let piece = {type: i, dir: DIR.DOWN, x: 9, y: 5};
      block = setBlock(block, piece, piece.x, piece.y);
      let ret = rotate(block, piece);
      expect(ret.dir).toBe(2); //means the direction is the same
   });

   test('getFreeLinesFromTop', () => {
      let block = makeArray(10, 20, 1);
      let ret = getFreeLinesFromTop(block);
      expect(ret).toBe(0);

      block = makeArray(10, 20, 0);
      block[19] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      ret = getFreeLinesFromTop(block);
      expect(ret).toBe(19);
   });

   test('addMalus with available lines', () => {
      let block = makeArray(10, 20, 0);
      block = addMalus(block, 1);
      expect(block[19][0]).toStrictEqual({'color': '#34362c', 'removable': false});
   });

   test('addMalus with no available lines', () => {
      let block = makeArray(10, 20, 1);
      block = addMalus(block, 1);
      expect(block).toBe(false);
   });

   test('removeLines', () => {
      let block = makeArray(10, 20, 0);
      for (let i = 19; i >= 16; i--) {
        block[i] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      };
      let removedLines = removeLines(block);
      expect(block[19]).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
   });
});
