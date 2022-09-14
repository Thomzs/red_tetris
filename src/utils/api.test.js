import React from "react";
const express = require("express");
const app = express();
const cors = require("cors");

import { getRooms } from "./api";
import "../setupTests";

describe("api tests", () => {
        beforeAll((done) => {
                app.use(cors());

                app.get('/rooms', (req,res) => {
                        res.send([{id:1, room:'bla'}, {id:2, room:'bla'}, {id:3, room:'bla'}]);
                });
                app.listen(8080, done);
        });

        test('getRooms', () => {
                // const ret = await getRooms().then(ret);
                // expect(ret).toEqual(
                //         [{id:1, room:'bla'},
                //         {id:2, room:'bla'}, {id:3, room:'bla'}]
                // );
                getRooms().then((ret) => {
                         expect(ret).toEqual(
                             [{id:1, room:'bla'},
                                     {id:2, room:'bla'}, {id:3, room:'bla'}]
                         );
                });

        });
});