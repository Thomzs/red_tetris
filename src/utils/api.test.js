import React from "react";
const express = require("express");
const app = express();
const cors = require("cors");

import { getRooms, checkRoomPassword, directRoomRequest,
        requestCreateRoom} from "./api";

describe("api tests", () => {
        beforeAll(() => {
                app.use(cors());

                app.get('/rooms', (req,res) => {
                        res.send({});
                });
                app.listen(8080, () => {
                        console.log("ah jcapote jcomprand po");
                        console.log("aujourd'hui c'est la fin des haricots");
                        console.log('Listening on port 8080');
                });
        });
        afterAll(() => {

        });
});