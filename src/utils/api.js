import fetch from "node-fetch";

const getRooms = async () => {
    const response = await fetch('http://localhost:8080/rooms');
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
};

const checkRoomPassword = async (roomId, password) => {
    const response = await fetch('http://localhost:8080/askRoom?' + new URLSearchParams({
        room: roomId,
        password: password,
    }));
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
};

const requestCreateRoom = async (name, mode, password) => {
    const response = await fetch('http://localhost:8080/createRoom?' + new URLSearchParams({
        name: name,
        mode: mode,
        password: password,
    }));
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message)
    }
    return body;
};

const directRoomRequest = async (room, password) => {
    const response = await fetch('http://localhost:8080/directRequest?' + new URLSearchParams({
        room: room,
        password: password,
    }));
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body.message);
    }
    return body;
}

module.exports = {
    getRooms,
    checkRoomPassword,
    requestCreateRoom,
    directRoomRequest,
};