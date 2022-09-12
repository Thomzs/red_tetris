import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {requestPiece} from "../utils/api";
import Chat from "./components/Chat";
import {Container} from "react-bootstrap";
import Board from "./components/Board";
import {setGameStatus, setStatusGame} from "../slices/statusSlice";
import {resetGame} from "../slices/roomSlice";
import BoardList from "./components/BoardList";
import {Allotment} from "allotment";
import "allotment/dist/style.css";
import {debounce} from "../utils/debounce";

//TODO if not connected go connect

const Game = () => {
    const { room, status, player} = useSelector((state) => state); //useless for now

    const dispatch = useDispatch(); //react stuff

    const startGame = () => {
        if (status._gameStatus === 'initial') {
            dispatch(setGameStatus({gameStatus: 'readyNext', board: null}));
            document.getElementById('tetris').focus();
        } else {
            dispatch(resetGame());
            dispatch(setGameStatus({gameStatus: 'initial'}));
        }
    }

    const splitChange = debounce((event) => {
        localStorage.setItem('splitPos', event[0]);
    }, 300);

    useState(() => {
        let pass = "";
        if (room._password.length > 1) {
            pass = `?password=${room._password}`;
        }
        // eslint-disable-next-line no-restricted-globals
        history.replaceState(null, 'Tetris', `/#${room._name}[${player._username}]${pass}`);
    });

    return (
        <section className="container-fluid h-100">
            <div className="row d-flex h-100">
                <div className="col-8 d-flex justify-content-center p-0">
                    <div className="row w-100">
                        <div className="col d-flex align-self-center justify-content-center">
                            <button className="btn btn-outline-dark mt-4" onClick={startGame} disabled={!room._admin}>Start Game</button>
                        </div>
                        <div className="col-4 p-0 align-self-center">
                            <Board />
                        </div>
                        <div className="col d-flex align-self-center justify-content-center">
                            <div className="row d-flex justify-content-center">
                                <div>
                                <p style={{color: 'red', fontSize: '3rem'}}>{room._score}</p>
                                <p style={{color: 'red', fontSize: '3rem'}}>Level {room._level}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4 bg-light p-0 sideBar">
                    <div className="d-flex flex-column w-100 h-100">
                            <Allotment vertical={true} onChange={splitChange} className="h-100 w-100">
                                <Allotment.Pane minSize={10} preferredSize={parseInt(localStorage.getItem('splitPos'), 10) ?? "50%"}>
                                    <BoardList />
                                </Allotment.Pane>
                                <Allotment.Pane className="chatPane">
                                    <Chat />
                                </Allotment.Pane>
                            </Allotment>

                        {/*<Container fluid className="w-100 h-50 p-0">*/}
                        {/*    <BoardList />*/}
                        {/*</Container>*/}
                        {/*<Container fluid className="w-100 h-50 p-0 border-top border-dark">*/}
                        {/*    <Chat />*/}
                        {/*</Container>*/}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Game;