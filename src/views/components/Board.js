import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {drop, dropPiece, loose, makeArray, move, rotate} from "../../utils/piece";
import {setGameStatus} from "../../slices/statusSlice";
import {DIR, KEY} from "../../classes/Piece_utils";
import {occupied, eachBlock} from "../../utils/piece";

//Render the board, and the piece above the board.
//rotate, move left, move right update the piece, not the board.
//drop updates the piece if it can go down. Otherwise, it calls dropPiece to update the board.

function bit_test(num, bit) {
    return ((1 << bit) & (num & 0xFFFF));
}

const Board = () => {
    const {status, room} = useSelector((state) => state); //useless for now
    const [piece, setPiece] = useState(null);
    const [board, setBoard] = useState(makeArray(10, 20, 0));
    const [score, setScore] = useState(0);

    const dispatch = useDispatch();

    const removeLine = (board) => {
        return board //TODO remove line if there is line(s) to be removed
    }

    const doDrop = () => { //Running every second, AND on key.Down pressed
        let ret = move(board, piece, DIR.DOWN); //update the piece

        if (!ret) {
            setScore(score + 10);
            ret = removeLine(dropPiece(board, piece));
            setPiece(null);
            setBoard(ret);
            setGameStatus({status: 'readyNext', board: board});
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
        if (piece === null) return;

        if (occupied(board, piece.type, piece.x, piece.y, piece.dir)) { //Checking if the new piece can be dropped
            loose(); //if not Loose;
            setGameStatus({gameStatus: 'loose', board: board});
        }
   //     setInterval(doDrop, 1000);
    }, [piece]);

    useEffect(() => {
        if (room._currentPiece !== null)
            setPiece(room._currentPiece);
    }, [room._currentPiece]);

    //Foreach rows and for each column of game._bord, display each cell
    return (
        <section id="board-section" tabIndex="0" onKeyDown={handleKey}>
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
                                    && [0, 1, 2, 3].includes(j - piece.y)) {
                                    inputPros.className += ' border border-dark';

                                    if (bit_test(tmp, 15 - ((j - piece.y) * 4 + (i - piece.x)))) {

                                        inputPros.style.background = piece.type.color;
                                        //inputPros.className += ' border border-dark';
                                    }
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
        </section>
    );
}

export default Board;