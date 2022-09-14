import Player from "./Player";
import { v4 as uuidv4 } from 'uuid';

const _Player = new Player();

describe('Player class test', () => {
    let players = [{socket:{id: uuidv4()}, name: "player 1"},
                    {socket:{id: uuidv4()}, name: "montre"},
                    {socket:{id: uuidv4()}, name: 'baguette'}];

    test('newPlayer adding a new player to players list', () => {
        let tmp = players.length;
        _Player.newPlayer(players, 1)
            .then(() => {
                expect(players.length).toEqual(tmp + 1);
                expect(players[tmp]).toEqual({"_id": null, "lost": false, "socket": 1});
            });
    });

    test('updatePlayer tests', () => {
       let players = [{socket:{id: uuidv4()}, name: "player1"},
           {socket:{id:uuidv4}, name: "montre"}]
       _Player.updatePlayer(players, players[0].socket.id, {"lost": 0})
           .then(() => {
               expect(players[0].lost).toBe(0);
           });
    });

    test('id not in list', () => {
        _Player.updatePlayer(players, 'test', {test: '1'})
            .then((player) => {
                expect(player).toBeNull();
            })
    });

});