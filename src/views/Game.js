import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {requestPiece} from "../utils/api";
import Chat from "./components/Chat";
import Board from "./components/Board";
import {setGameStatus, setStatusGame} from "../slices/statusSlice";

//TODO if not connected go connect

const Game = () => {
    const { player, status } = useSelector((state) => state); //useless for now

    const dispatch = useDispatch(); //react stuff

    const startGame = () => {
        if (status._gameStatus === 'initial') {
            dispatch(setGameStatus({gameStatus: 'readyNext', board: null}));
        } else {
            dispatch(setGameStatus({gameStatus: 'initial'}));
        }
    }

    return (
        <section className="container-fluid h-100">
            <div className="row d-flex h-100">
                <div className="col-8 border-end d-flex justify-content-center">
                    <div className="row align-self-center">
                        <div className="d-flex justify-content-center">
                            <Board />
                        </div>
                        <button className="btn btn-outline-dark mt-4" onClick={startGame}>Start Game</button>
                    </div>
                </div>
                <div className="col-4 bg-light d-flex align-items-center justify-content-center">
                    <Chat />
                </div>
            </div>
        </section>
    );
}

export default Game;