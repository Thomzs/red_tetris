/**
 * @jest-environment node
 */

const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const {socketMiddleware} = require("./socket");

const create = () => {
    const store = {
        getState: jest.fn(() => ({})),
        dispatch: jest.fn()
    }
    const next = jest.fn()

    const invoke = action => socketMiddleware(store)(next)(action)

    return { store, next, invoke }}

describe("my awesome project", () => {
    let io, serverSocket, clientSocket;

    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test("template", (done) => {
        io.emit('')

        clientSocket.on("hello", (arg) => {
            expect(arg).toBe("world");
            done();
        });
        serverSocket.emit("hello", "world");
        expect(1).toBe(1);
    });

})