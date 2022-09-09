import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {requestPiece} from "../utils/api";
import Chat from "./components/Chat";
import {Container} from "react-bootstrap";
import Board from "./components/Board";
import {setGameStatus, setStatusGame} from "../slices/statusSlice";
import {resetGame} from "../slices/roomSlice";
import BoardList from "./components/BoardList";

//TODO if not connected go connect

const Game = () => {
    const { room, status} = useSelector((state) => state); //useless for now

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

    return (
        <section className="container-fluid h-100">
            <div className="row d-flex h-100">
                <div className="col-8 border-end d-flex justify-content-center p-0">
                    <div className="row w-100">
                        <div className="col d-flex align-self-center justify-content-center">
                            <button className="btn btn-outline-dark mt-4" onClick={startGame} disabled={!room._admin}>Start Game</button>
                        </div>
                        <div className="col-4 p-0 align-self-center">
                            <div className="row justify-content-center">
                                <div className="d-flex justify-content-center">
                                    <Board />
                                </div>
                            </div>
                        </div>
                        <div className="col d-flex align-self-center justify-content-center">
                            <p style={{color: 'red', fontSize: '3rem'}}>{room._score}</p>
                        </div>
                    </div>
                </div>
                <div className="col-4 bg-light p-0">
                    <div className="d-flex flex-column w-100 h-100">
                        <Container fluid className="w-100 h-50 p-0">
                            <BoardList />
                        </Container>
                        <Container fluid className="w-100 h-50 p-0 border-top">
                            <Chat />
                        </Container>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Game;