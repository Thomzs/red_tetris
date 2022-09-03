import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {requestPiece} from "../utils/api";
import Chat from "./components/Chat";

//TODO if not connected go connect

const Piece = (props) => {
    //For now, it's displaying a 4x4 grid.

    if (props.piece === null) return;

    let inputPros = {
        style: {
            height: 25,
            width: 25,
            backgroundColor: 'darkRed'
        },
        className: "border border-dark ratio-1x1",
    };

    // return (
    //     <div className="ratio-1x1 d-block" style={{backgroundColor: 'darkred', content: ''}}>
    //     </div>
    // );

    return (
        <div>
            <div className="row">
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
            </div>
            <div className="row">
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
            </div>
            <div className="row">
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
            </div>
            <div className="row">
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
                <div {...inputPros}/>
            </div>
        </div>
    );
}

const Game = () => {
    const { player, status } = useSelector((state) => state); //useless for now
    const [piece, setPiece] = useState(null); //the piece sent by the server and a function to set it

    const dispatch = useDispatch(); //react stuff

    const getPiece = () => { //For testing purposes;    Ask a piece to the server
        requestPiece()
            .then(r => setPiece(r)) //set it when the query returns
            .catch(r => {console.log(r); alert(r)}); //if errors
    }

    useEffect(() => { //This is to ensure that we only set the piece once at the beginning
        getPiece();
    });

    return (
        <section className="container-fluid h-100">
            <div className="row d-flex h-100">
                <div className="col-8 border-end d-flex justify-content-center">
                    <div className="row align-self-center">
                        <div className="d-flex justify-content-center">
                            <Board />
                        </div>
                        <button className="btn btn-outline-dark mt-4" onClick={getPiece}>Get Next Piece</button>
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