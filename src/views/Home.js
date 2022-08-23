import {useDispatch, useSelector} from "react-redux";
import {setStatusGame} from "../slices/statusSlice";

import Modal from 'react-bootstrap/Modal';
import {useState} from "react";
import {Form} from "react-bootstrap";

//TODO if not connected go connect

const Home = () => {
    const { player, status } = useSelector((state) => state);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch();

    const goGame = () => {
        dispatch(setStatusGame());
    };

    return (
        <section className="container">
            <div className="row">
                <div className="d-flex justify-content-center">
                    <button type="button" onClick={handleShow} className="btn btn-outline-dark mt-4">Create room</button>
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
                    <div className="row border-bottom" style={{height: 50}}>
                        <div className="col border-end h-100 d-flex align-items-center">La room des bg</div>
                        <div className="col border-end h-100 d-flex align-items-center">Classic</div>
                        <div className="col border-end h-100 d-flex align-items-center">2/8</div>
                        <div className="col h-100 d-flex align-items-center">Password</div>
                    </div>
                    <div className="row" style={{height: 50}}>
                        <div className="col border-end h-100 d-flex align-items-center">La room des bg</div>
                        <div className="col border-end h-100 d-flex align-items-center">Classic</div>
                        <div className="col border-end h-100 d-flex align-items-center">2/8</div>
                        <div className="col h-100 d-flex align-items-center">Password</div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create your room</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="room-name">
                            <Form.Label>Room name:</Form.Label>
                            <Form.Control type="email" placeholder="Room name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="room-password">
                            <Form.Label>Password:
                                <small> you can leave it empty</small>
                            </Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="game-mode">
                            <Form.Label>
                                Game mode:
                            </Form.Label>
                            <Form.Select defaultValue="Classical">
                                <option value='classical'>Classical</option>
                                <option value='infinite' disabled>Infinite <small>(tba)</small></option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-outline-dark" onClick={handleClose}>
                            Save Changes
                        </button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </section>
    );
}

export default Home;