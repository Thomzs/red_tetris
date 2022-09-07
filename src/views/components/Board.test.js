import { computeRemovedLinesScore, Board } from "./Board";


describe('board tests', () => {
    test('computeRemovedLinesScore', () => {
        expect(computeRemovedLinesScore(1)).toBe(40);
        expect(computeRemovedLinesScore(2)).toBe(100);
        expect(computeRemovedLinesScore(3)).toBe(300);
        expect(computeRemovedLinesScore(4)).toBe(1200);
        expect(computeRemovedLinesScore(12)).toBe(1200);
        expect(computeRemovedLinesScore(0)).toBe(0);
    });
})