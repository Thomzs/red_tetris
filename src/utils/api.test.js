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
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            };
        });
        app.get('/askRoom', (req, res) => {
            if (error) {
                res.status(500);
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            };
        });
        app.get('/createRoom', (req, res) => {
            if (error) {
                res.status(500);
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            };
        });
        app.get('/directRequest?', (req, res) => {
            if (error) {
                res.status(500);
                res.send(message);
            } else {
                res.send(JSON.stringify(response));
            };
        });
        server = app.listen(8080, done);
    });


    test('getRooms', () => {
        error = false;
        getRooms().then((ret) => {
            expect(ret).toEqual(response);
        });
        error = true;
        expect(getRooms()).toThrow(Error);
        exect(getRooms()).toThrow(message.message);
        // try {
        //     getRooms().then();
        // } catch (e) {
        //     expect(e).toEqual(message);
        // }
    });

    // test('askRoom', () => {
    //     error = false;
    //     checkRoomPassword('1', 'pass').then((ret) => {
    //         expect(ret).toEqual(response);
    //     });
    //     error = true;
    //     try {
    //         checkRoomPassword('1', 'pass').then();
    //     } catch (e) {
    //         expect(e).toEqual(message);
    //     }
    // });
    //
    // test('requestCreateRoom', () => {
    //     error = false;
    //     requestCreateRoom('name', 'normal', 'pass').then((ret) => {
    //         expect(ret).toEqual(response);
    //     });
    //     error = true;
    //     try {
    //         requestCreateRoom('name', 'normal', 'pass').then();
    //     } catch (e) {
    //         expect(e).toEqual(message);
    //     }
    // });
    //
    // test('directRoomRequest', () => {
    //     error = false;
    //     directRoomRequest('name', 'pass').then((ret) => {
    //         expect(ret).toEqual(response);
    //     });
    //     error = true;
    //     try {
    //         directRoomRequest('name', 'pass').then();
    //     } catch (e) {
    //         expect(e).toEqual(message);
    //     }
    // });
});