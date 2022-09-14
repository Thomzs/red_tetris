//const Piece = require("Piece");
import {i, j, k, l, m, n, o} from "./Piece_utils";
import Piece from "./Piece";
import {v4 as uuidv4} from 'uuid';
import {Status} from "../utils/status";

let _Piece = new Piece();

describe('Piece class tests', () => {

    test('wrong index', () => {
        let rooms = [{id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]},
            {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]}];

        _Piece.getPiece(rooms, 'aaaa')
            .catch((err) => {
                expect(err).toEqual(`Error accessing room named: aaaa`);
            });
    });

    test('no pieces left', () => {
        let rooms = [{id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]},
            {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby, chat: [], countWaiting: 0, pieces: []}];
        _Piece.getPiece(rooms, 'Wesh les bgs').then((piece) => {
           expect(rooms[1].pieces.length).toBe(6);
        });

    });

    test('One pieces less', () => {
        let rooms = [{id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]},
            {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]}];

        _Piece.getPiece(rooms, 'La room 1')
            .then((piece) => {
               expect(rooms[0].pieces.length).toEqual(6);
               expect(rooms[0].pieces.includes(piece)).toBeFalsy();
            });
    });
});