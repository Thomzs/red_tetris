import React from "react";
const express = require("express");
const app = express();
const cors = require("cors");

import {checkRoomPassword, directRoomRequest, getRooms, requestCreateRoom} from "./api";
import "../setupTests";

let server;
let response = [{id:1, room:'bla'}, {id:2, room:'bla'}, {id:3, room:'bla'}];
let message = {message: 'test'};
let error = false;

describe("api tests", () => {
    beforeAll((done) => {
        app.use(cors());

        app.get('/rooms', (req,res) => {
            if (error) {
                res.status(500);
                res.send(JSON.stringify(message));
            } else {
                res.send(JSON.stringify(response));
            }
        });
        app.get('/askRoom', (req, res) => {
            if (error) {
                res.status(500);
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            }
        });
        app.get('/createRoom', (req, res) => {
            if (error) {
                res.status(500);
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            }
        });
        app.get('/directRequest?', (req, resdo) => {
            if (error) {
                res.status(500);
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            }
        });
        server = app.listen(8080, done);
    });

    test('getRooms', () => {
        error = false;
        getRooms().then((ret) => {
            expect(ret).toEqual(response);
        });
    });

    // test('it should throw', async () => {
    //     error = true;
    //
    //     expect.assertions(1);
    //     // await getRooms().catch(error => {
    //     //     console.log(error);
    //     //     expect(error).toBe(Error);
    //     // });
    //
    //     // await expect(getRooms())
    //     //     .rejects
    //     //     .toThrowError(Error);
    //
    //    // expect(getBadResult().rejects).toMatchObject({ message: 'foo' })
    //    //  await expect(async () => {await getRooms()}).rejects.toThrow(message.message);
    //    //  await expect(async () => {await getRooms()}).rejects.toThrow(message.message);
    //     try {
    //         await getRooms();
    //     } catch (e) {
    //  //       console.log(e.message);
    //         expect(e).toEqual(Error(message.message));
    //  //       expect(e.message).toBe(message.message);
    //     }
    // });

    test('askRoom', () => {
        error = false;
        checkRoomPassword('1', 'pass').then((ret) => {
            expect(ret).toEqual(response);
        });
    });

    // it('askRoom throw', async () => {
    //     error = true;
    //     try {
    //         await checkRoomPassword('1', 'pass');
    //     } catch (e) {
    //         expect(e).toBe(Error);
    //         expect(e).toBe(message.message);
    //     }
    // })

    test('requestCreateRoom', () => {
        error = false;
        requestCreateRoom('name', 'normal', 'pass').then((ret) => {
            expect(ret).toEqual(response);
        });

    });

    // it('requestCreate throw', async() => {
    //     error = true;
    //     try {
    //         await requestCreateRoom('name', 'normal', 'pass');
    //     } catch (e) {
    //         expect(e).toBe(Error);
    //         expect(e).toBe(message.message);
    //     }
    // })

    test('directRoomRequest', () => {
        error = false;
        directRoomRequest('name', 'pass').then((ret) => {
            expect(ret).toEqual(response);
        });
    });

    // it('directRoomRequest throw', async () => {
    //     error = true;
    //     try {
    //         await directRoomRequest('name', 'pass');
    //     } catch (e) {
    //         expect(e).toBe(Error);
    //         expect(e).toBe(message.message);
    //     }
    // });*/
})