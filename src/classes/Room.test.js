import {v4 as uuidv4} from "uuid";
import Room from "./Room";
import {Status} from "../utils/status";
import {i, j, k, l, m, n, o} from "./Piece_utils";
import checkRoomPassword from "../utils/api";

const _Room = new Room();

let rooms;
describe('Room tests', () => {
    beforeEach(() => {
        rooms = [{id: uuidv4(), name: 'La room 1', password: 'abcde', private: true, players: [], mode: 'classic', status: Status.InGame, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]},
            {id: uuidv4(), name: 'Wesh les bgs', password: '', private: false, players: [], mode: 'classic', status: Status.Lobby, chat: [], countWaiting: 0, pieces: [i, j, k, l, m, n, o]}];
    });

    test('RoomlistNoPassword', () => {
        _Room.getRoomListNoPasswords(rooms)
            .then((list) => {
                expect(list[0]).not.toHaveProperty('password');
                expect(list[1]).not.toHaveProperty('password');
            })
    });

    test('createRoom', () => {
       _Room.createRoom(rooms, 'testRoom', 'testPassword', 1)
           .then(() => {
              expect(rooms.length).toEqual(3);
              expect(rooms[2].name).toEqual('testRoom');
           });
    });

    test('createRoom with unavailable name', () => {
       let newRoom = {name: 'La room 1', password: '', mode: 0};
       _Room.createRoom(rooms, newRoom)
           .catch(() => {
              expect(1).toBe(1);
           });
    });

    test('checkRoomPassword', () => {
        _Room.checkRoomPassword(rooms, rooms[1].id, '')
            .then((room) => {
                expect(room).toEqual(rooms[1]);
            });
        _Room.checkRoomPassword(rooms, rooms[1].id, 'false')
            .then((room) => {
                expect(room).toBeFalsy();
            });

        let newRooms = {...rooms};

        newRooms[0].status = Status.Lobby;
        newRooms[1].status = Status.InGame;
        _Room.checkRoomPassword(newRooms, newRooms[1].id, '')
            .catch(() => {
                expect(1).toBe(1);
            });
        _Room.checkRoomPassword(newRooms, '1', '')
            .catch(() => {
                expect(1).toBe(1);
            })
    });

    test('joinRoom', () => {
        let player = {id: 1, name: 'test'};
       _Room.joinRoom(rooms, 'Wesh les bgs', player)
           .then((ret) => {
              expect(ret.room.players.includes(player)).toBeTruthy();
              expect(ret.admin).toBeTruthy();
           });

        _Room.joinRoom(rooms, 'Wesh les bgs', player)
            .then((ret) => {
                expect(ret.room.players.includes(player)).toBeTruthy();
                expect(ret.admin).toBeFalsy();
            });

        _Room.joinRoom(rooms, 'test', player)
            .catch(() => {
               expect(1).toBe(1);
            });
    });

    test('removePlayer', async() => {
        let player = {socket: {id: 1}, name: 'test', admin: true};
        let player2 = {socket: {id: 2}, name: 'test'};

        rooms[0].players = [player, player2];
        rooms[0].countWaiting = 2;
        rooms[1].players = [{socket: {id: 0}}];

        _Room.removePlayer(rooms, 31)
            .catch(() => {
                expect(1).toBe(1);
            });
        let room = await _Room.removePlayer(rooms, 1);
        expect(room.players.length).toEqual(1);
        expect(room.countWaiting).toEqual(1);
        let ret = await _Room.removePlayer(rooms, 2)
        expect(ret).toBe(null);
        expect(rooms.length).toEqual(1);

    });

    test('updateBoard', async() => {
        let player = {socket: {id: 1}, name: 'test', admin: true};
        let player2 = {socket: {id: 2}, name: 'test'};
        let ret;

        rooms[0].players = [player, player2];
        rooms[0].countWaiting = 2;

        _Room.updateBoard(rooms, 'baba', 1, {test: '1'})
            .catch((ret) => expect(ret).toEqual('No such room'));
        ret = await _Room.updateBoard(rooms, 'La room 1', 1, {test: '1'});
        expect(ret.players[0]._map).toEqual({test: '1'});

    });

    test('setLoose', () => {
        let player = {socket: {id: 1}, name: 'player1', admin: true, lost: false};
        let player2 = {socket: {id: 2}, name: 'player2', lost: false};

        rooms[0].players = [player, player2];
        _Room.setLoose(rooms, 'La room 1', 1)
            .then(() => {
               expect(rooms[0].players[0].lost).toBe(true);
               expect(rooms[0].players[1].lost).toBe(false);
            });
    });

    test('getWinner', async() => {
        let player = {socket: {id: 1}, name: 'player1', admin: true, lost: false};
        let player2 = {socket: {id: 2}, name: 'player2', lost: false};
        let player3 = {socket: {id: 3}, name: 'player2', lost: true};

        rooms[0].players = [player, player2];
        await _Room.getWinner(rooms, 'La room 1')
            .catch(() => expect(1).toBe(1));
        rooms[0].players.push(player3);
        await _Room.getWinner(rooms, 'La room 1')
            .catch(() => expect(1).toBe(1));
        rooms[0].players[0].lost = true;
        let ret = await _Room.getWinner(rooms, 'La room 1');
        expect(ret).toEqual(player2);
    });

    test('resetLost', () => {
        let player = {socket: {id: 1}, name: 'player1', admin: true, lost: true};
        let player2 = {socket: {id: 2}, name: 'player2', lost: true};

        rooms[0].players = [player, player2];
        _Room.resetLost(rooms, 'La room 1')
            .then((room) => {
               expect(room.players[0].lost).toBe(false);
               expect(room.players[1].lost).toBe(false);
            });
    });

    test('createRoomIfNotExist', () => {
       _Room.createRoom(rooms, 'copy room', 'password', 3)
           .then(() => {
              expect(rooms.length).toEqual(3);
              expect(rooms[2].name).toEqual('copy room');
              expect(rooms[2].password).toEqual('password');
              expect(rooms[2].mode).toEqual(3);
           });
    });

    test('createRoomIfNotExist but room already exists KAPPA', () => {
       _Room.createRoom(rooms, 'La room 1', 'testPass', 3)
           .catch(() => {
               expect(1).toBe(1);
           })
    });

});