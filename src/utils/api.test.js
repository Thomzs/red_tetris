import React from "react";
const express = require("express");
const app = express();
const cors = require("cors");

import {checkRoomPassword, directRoomRequest, getRooms, requestCreateRoom} from "./api";
import "../setupTests";

let server;
let serverError;
let response = [{id:1, room:'bla'}, {id:2, room:'bla'}, {id:3, room:'bla'}];
let errorResponse = {message: 'test'};

describe("api tests no Errors", () => {
    beforeAll((done) => {
        app.use(cors());

        app.get('/rooms', (req,res) => {
            res.send(JSON.stringify(response));
        });
        app.get('/askRoom', (req, res) => {
           res.send(JSON.stringify(response));
        });
        app.get('/createRoom', (req, res) => {
            res.send(JSON.stringify(response));
        });
        app.get('/directRequest?', (req, res) => {
            res.send(JSON.stringify(response));
        });
        serverError = app.listen(8080, done);
    });

    afterAll((done) => {
        serverError.close(done);
    })

    test('getRooms', () => {
        getRooms().then((ret) => {
            expect(ret).toEqual(response);
        });
    });

    test('askRoom', () => {
        checkRoomPassword('1', 'pass').then((ret) => {
            expect(ret).toEqual(response);
        })
    });

    test('requestCreateRoom', () => {
        requestCreateRoom('name', 'normal', 'pass').then((ret) => {
            expect(ret).toEqual(response);
        })
    });

    test('directRoomRequest', () => {
        directRoomRequest('name', 'pass').then((ret) => {
            expect(ret).toEqual(response);
        })
    });
});

describe("api tests with Errors", () => {
    beforeAll((done) => {
        app.use(cors());

        app.get('/rooms', (req,res) => {
            res.status(500);
            res.send(JSON.stringify(errorResponse));
        });
        app.get('/askRoom', (req, res) => {
            res.status(500);
            res.send(JSON.stringify(errorResponse));
        });
        app.get('/createRoom', (req, res) => {
            res.status(500);
            res.send(JSON.stringify(errorResponse));
        });
        app.get('/directRequest?', (req, res) => {
            res.status(500);
            res.send(JSON.stringify(errorResponse));
        });
        server = app.listen(8080, done);
    });

    test('getRooms', () => {
        getRooms().then((ret) => {
            expect(ret).toEqual(errorResponse);
        });
    });

    test('askRoom', () => {
        checkRoomPassword('1', 'pass').catch((ret) => {
            expect(ret).toEqual(errorResponse);
        })
    });

    test('requestCreateRoom', () => {
        requestCreateRoom('name', 'normal', 'pass').catch((ret) => {
            expect(ret).toEqual(errorResponse);
        })
    });

    test('directRoomRequest', () => {
        directRoomRequest('name', 'pass').catch((ret) => {
            expect(ret).toEqual(errorResponse);
        })
    });
});