import {useDispatch, useSelector} from "react-redux";
import {setStatusGame, requestJoinRoom} from "../slices/statusSlice";

import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import styled, { keyframes } from "styled-components";
import Tada from "@bit/formidablelabs.react-animations.tada";
import {startConnecting} from "../slices/connectionSlice";
import {checkRoomPassword, getRooms, requestCreateRoom} from "../utils/api";
import {ArrowClockwise} from 'react-bootstrap-icons'
import {useForm} from "react-hook-form";
import {Status} from "../utils/status";

//TODO if not connected go connect

let clickedRoom = null;
const TadaAnimation = keyframes`${Tada}`;
const TadaDiv = styled.div`
      animation: 1s ${TadaAnimation};
    `;

function RoomsList(props) {
    const rooms = props.rooms;
    let ret = [];

    if (!rooms || rooms.length === 0) {
        return <div className="row">
            It looks like there is no room now. Why don’t you create yours?
        </div>
    }

    rooms.forEach((room, index) => {
        let inputPros = {
            className: 'row',
            style: {
                height: 50
            },
            key: room.id,
        };

        if (room.status === Status.InGame) {
            inputPros.style.backgroundColor = '#ed958f'
        }

        if (index + 1 < rooms.length) {  //No bottom border for the last one
            inputPros.className = 'row border-bottom';
        }

        if (room.private && room.status !== Status.InGame) {  //Password prompt for a private room
            inputPros.onClick = () => {
                clickedRoom = room;
                props.handle()
            };
        }

        ret.push(
            <div {...inputPros}>
                <div className="col border-end h-100 d-flex align-items-center text-nowrap overflow-hidden">{room.name}</div>
                <div className="col border-end h-100 d-flex align-items-center">{room.mode}</div>
                <div className="col border-end h-100 d-flex align-items-center">{room.players.length}/8</div>
                <div className="col h-100 d-flex align-items-center">{room.private ? 'Private' : 'Public'}</div>
            </div>
        );
    });
    return ret;
}

const Home = () => {
    const dispatch = useDispatch();

    const initialState = {password: '', roomName: '', mode: 'classical'};

    const [showForm, setShowForm] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [wrongPassword, setWrongPassword] = useState("visually-hidden");
    const [nameTaken, setNameTaken] = useState("visually-hidden");
    const [reRenderTrick1, setReRenderTrick1] = useState(1);
    const [reRenderTrick2, setReRenderTrick2] = useState(1);
    const [rooms, setRooms] = useState([]);
    const {register, handleSubmit, reset, formState, formState: { isSubmitSuccessful }} = useForm({
        defaultValues: initialState
    });

    const initGameConnection = () => {};
    const getUpdateRooms = () => {
        getRooms()
            .then(r => setRooms(r.sort((a, b) => b.status - a.status || b.players.length - a.players.length)))
            .catch(err => console.log(err));
        return false;
    }

    const showWrongPassword = () => setWrongPassword("");
    const hideWrongPassword = () => setWrongPassword("visually-hidden");
    const showNameTaken = () => setNameTaken("");
    const hideNameTaken = () => setNameTaken("visually-hidden");
    const handleCloseForm = () => {
        hideNameTaken();
        setShowForm(false);
        reset(initialState);
    }
    const handleShowForm = () => setShowForm(true);
    const handleCreateForm = async (data) => {
        let ret;

        try {
            ret = await requestCreateRoom(data.roomName, data.mode, data.password);
        } catch (e) {
            alert('Something unexpected happened. Please try again');
            return false;
        }

        if (ret === 'ROOMNAME-TAKEN') {
            if (nameTaken !== '') {
                showNameTaken();
            } else { //If the password is still wrong, play the animation again
                setReRenderTrick2(reRenderTrick2 === 1 ? 2 : 1);
            }
        } else if (ret === 'ROOM-SUCCESS') {
            handleCloseForm();
            dispatch(setStatusGame()); //TODO it ain't done yet
        } else {
            handleCloseForm();
            alert('Something unexpected happened. Please try again');
        }
        return false;
    }
    const handleClosePrompt = () => {
        hideWrongPassword();
        setShowPrompt(false);
        reset(initialState);
    };
    const handleShowPrompt = () => setShowPrompt(true);
    const handlePasswordForm = async (data) => {
        let ret;

        try {
            ret = await checkRoomPassword(clickedRoom.id, data.password);
        } catch (e) {
            alert(e);
            getUpdateRooms();
            return false;
        }
        if (ret === true) {
            handleClosePrompt();
            dispatch(setStatusGame()); //TODO it ain't done yet
            //initGameConnection(); //params: room id, password}
        } else {
             if (wrongPassword !== '') {
                 showWrongPassword();
             } else { //If the password is still wrong, play the animation again
                 setReRenderTrick1(reRenderTrick1 === 1 ? 2 : 1);
             }
        }
        return false;
    };

    const goGame = () => {
        dispatch(setStatusGame());
    };

    useEffect(() => {
        getUpdateRooms();
    }, []);

    return (
        <section className="container">
            <div className="row">
                <div className="d-flex justify-content-center">
                    <button type="button" onClick={handleShowForm} className="btn btn-outline-dark mt-4 me-2">Create room</button>
                    <button type="button" className="btn btn-outline-dark mt-4 ms-2" onClick={getUpdateRooms}><ArrowClockwise /> Refresh list</button>
                </div>
            </div>
            <div className="row border border-dark rounded mt-4">
                <div className="col">
                    <div className="row border-bottom border-dark" style={{height: 75}}>
                        <div className="col border-end h-100 d-flex align-items-center"><b>Room name</b></div>
                        <div className="col border-end h-100 d-flex align-items-center"><b>Game mode</b></div>
                        <div className="col border-end h-100 d-flex align-items-center"><b>Players</b></div>
                        <div className="col h-100 d-flex align-items-center"><b>Access</b></div>
                    </div>
                    <RoomsList rooms={rooms} handle={handleShowPrompt} />
                </div>
            </div>

            <Modal show={showForm} onHide={handleCloseForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Create your room</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(handleCreateForm)}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="room-name">
                            <Form.Label>Room name:</Form.Label>
                            <Form.Control type="text"  placeholder="Room name" required={true}
                                          {...register("roomName")}
                            />
                        </Form.Group>
                        <TadaDiv key={reRenderTrick2} className={nameTaken} style={{color: "red"}}>This name is already taken</TadaDiv>
                        <Form.Group className="mb-3" controlId="room-password">
                            <Form.Label>Password:
                                <small> you can leave it empty</small>
                            </Form.Label>
                            <Form.Control type="password" placeholder="Password"
                                          {...register("password", {required: false})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="game-mode">
                            <Form.Label>
                                Game mode:
                            </Form.Label>
                            <Form.Select defaultValue="Classical" {...register("mode")}>
                                <option value='classical'>Classical</option>
                                <option value='infinite' disabled>Infinite (tba)</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-outline-dark">
                            Go play!
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showPrompt} onHide={handleClosePrompt}>
                <Modal.Header closeButton>
                    <Modal.Title>Join "{clickedRoom?.name}"</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(handlePasswordForm)}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="room-password">
                            <Form.Label>Password: </Form.Label>
                            <Form.Control type="text" placeholder="Room password"
                                {...register("password", {required: "You need to enter a password"})}
                            />
                        </Form.Group>
                        <TadaDiv key={reRenderTrick1} className={wrongPassword} style={{color: "red"}}>Oops... The password you entered is incorrect</TadaDiv>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-outline-dark">
                            Join in!
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </section>
    );
}

export default Home;