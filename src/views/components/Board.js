import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {dropPiece, loose, makeArray, move, rotate, occupied, removeLines} from "../../utils/piece";
import {setGameStatus} from "../../slices/statusSlice";
import {DIR, KEY} from "../../classes/Piece_utils";
import {useInterval} from "../../utils/useInterval";
import {setScore} from "../../slices/roomSlice";
import Chat from "./Chat";

//Render the board, and the piece above the board.
//rotate, move left, move right update the piece, not the board.
//drop updates the piece if it can go down. Otherwise, it calls dropPiece to update the board.

function bit_test(num, bit) {
    return ((1 << bit) & (num & 0xFFFF));
}

// TODO add level variable
const computeRemovedLinesScore = (removedLines) => {
    let score = 0;
    switch (removedLines) {
        case 0:
            break;
        case 1:
            score = 40;
            break;
        case 2:
            score = 100;
            break;
        case 3:
            score = 300;
            break;
        default:
            score = 1200;
            break
    }
    return score;
}

const Board = () => {
    const {status, room} = useSelector((state) => state); //useless for now
    const [piece, setPiece] = useState(null);
    const [board, setBoard] = useState(makeArray(10, 20, 0));

    const dispatch = useDispatch();

    const doDrop = () => { //Running every second, AND on key.Down pressed
        if (!piece || status._gameStatus !== 'placing') return

        let ret = move(board, piece, DIR.DOWN); //update the piece

        if (!ret) {
            let tmp = board.map(inner => inner.slice());
            ret = removeLines(dropPiece(tmp, piece));
            setPiece(null);
            setBoard(ret.board);
            //dispatch(setScore(room._score + ret.removedLines + 10));
            dispatch(setScore(10 + room._score + computeRemovedLinesScore(ret.removedLines)))
            dispatch(setGameStatus({gameStatus: 'readyNext', board: board}));
            clearInterval(doDrop); //If the piece is placed, then wait for another
        } else {
            setPiece(ret);
        }
    };

    const handleKey = (event) => { //Handle keys
        let ret;

        switch (event.keyCode) {
            case KEY.LEFT:
                ret = move(board, piece, DIR.LEFT);
                if (ret !== false) setPiece(ret);
                break;
            case KEY.RIGHT:
                ret = move(board, piece, DIR.RIGHT);
                if (ret !== false) setPiece(ret);
                break;
            case KEY.UP:
                ret = rotate(board, piece);
                if (ret !== false) setPiece(ret);
                break;
            case KEY.DOWN:
                doDrop();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (status._gameStatus === 'initial') {
            setBoard(makeArray(10, 20, 0));
            setPiece(null);
        }
    }, [status._gameStatus]);

    useEffect(() => {
        if (piece === null || piece === undefined || status.gameStatus === 'placing') return;

        dispatch(setGameStatus({gameStatus:'placing'}));
        if (occupied(board, piece.type, piece.x, piece.y, piece.dir)) { //Checking if the new piece can be dropped
            loose(); //if not Loose;
            dispatch(setGameStatus({gameStatus: 'loose', board: board}));
        }
    }, [piece]);

    useEffect(() => {
        if (room._currentPiece !== null)
            setPiece(room._currentPiece);
    }, [room._currentPiece]);

    useInterval(doDrop, 1000);

    //Foreach rows and for each column of game._bord, display each cell
    return (
        <section id="board-section" tabIndex="0" onKeyDown={handleKey}>
            <div className="col" style={{width: '300px'}}>
                <div className="col border border-dark" style={{width: '300px'}}>
                {board.map((row, j) => {
                return ( //Don't remove the key attribute
                    <div key={j} className="row m-0" style={{width: '300px'}}>
                        {row.map((cell, i) => { //Drawing coordinates are reverted (y, x)
                            let inputPros = {
                                style: {
                                    height: '30px',
                                    width: '30px',
                                },
                                className: "ratio-1x1 d-inline",
                            };

                            if (cell !== 0) {
                                inputPros.style.background = cell.color;
                                inputPros.className += ' border border-dark'
                            } else if (piece !== null && piece !== undefined) {
                                let tmp = piece.type.blocks[piece.dir];

                                if ([0, 1, 2, 3].includes(i - piece.x)
                                    && [0, 1, 2, 3].includes(j - piece.y)
                                    && bit_test(tmp, 15 - ((j - piece.y) * 4 + (i - piece.x)))) {

                                    inputPros.style.background = piece.type.color;
                                    inputPros.className += ' border border-dark';
                                }
                            }

                            return ( //Don't remove the key attribute
                                <div key={i} {...inputPros}/>
                            );
                        })}
                    </div>
                );
            })}
                </div>
                <div className="row d-flex mt-3">
                    <div className="col d-flex align-content-center justify-content-center">
                        <button className="btn btn-outline-dark me-1">left ←</button>
                        <button className="btn btn-outline-dark me-1">right →</button>
                        <button className="btn btn-outline-dark me-1">down ↓</button>
                        <button className="btn btn-outline-dark me-1">rotate ↑</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Board;