import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {drop, dropPiece, lose, makeArray, move, rotate} from "../../utils/piece";
import {setGameStatus} from "../../slices/statusSlice";
import {DIR, KEY} from "../../classes/Piece_utils";
import {occupied} from "../../utils/piece";

//Render the board, and the piece above the board.
//rotate, move left, move right update the piece, not the board.
//drop updates the piece if it can go down. Otherwise, it calls dropPiece to update the board.

function bit_test(num, bit) {
    return ((num>>bit) % 2 !== 0);
}

const Board = () => {
    const {status, room} = useSelector((state) => state); //useless for now
    const [piece, setPiece] = useState(null);
    const [board, setBoard] = useState(makeArray(10, 20, null));
    const [score, setScore] = useState(0);

    const dispatch = useDispatch();

    const removeLine = (board) => {
        return board //TODO remove line if there is line(s) to be removed
    }

    const doDrop = () => { //Running every seconds, AND on key.Down pressed
        let ret = move(board, piece, DIR.DOWN); //update the piece

        if (!ret) {
            setScore(score + 10);
            ret = removeLine(dropPiece(board, piece));
            setPiece(null);
            setBoard(ret);
            setGameStatus({status: 'readyNext', board: board});
            clearInterval(doDrop); //If the piece is placed, then wait for another
        } else {
            setPiece(piece);
        }
    };

    const handleKey = (event) => { //Handle keys
        let ret;

        switch (event.keyCode) {
            case KEY.LEFT:
                ret = move(board, piece, DIR.LEFT);
                if (ret !== null) setPiece(ret);
                break;
            case KEY.RIGHT:
                ret = move(board, piece, DIR.RIGHT);
                if (ret !== null) setPiece(ret);
                break;
            case KEY.UP:
                ret = rotate(board, piece);
                if (ret) setPiece(ret);
                break;
            case KEY.DOWN:
                doDrop();
                break;
        }
    };

    useEffect(() => {
        if (piece === null) return;

        if (occupied(board, piece.type, piece.x, piece.y, piece.dir)) { //Checking if the new piece can be dropped
            lose(); //if not Loose;
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
        <section onKeyUp={handleKey}>
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

                            if (cell !== null) {
                                inputPros.style.background = cell.color; //cell color
                                inputPros.className += ' border border-dark'
                            } else if (piece !== null && piece !== undefined) {
                                let tmp = piece.type.blocks[piece.dir];

                                if ([0, 1, 2, 3].includes(i - piece.x)
                                    && [0, 1, 2, 3].includes(j - piece.y)
                                    && bit_test(tmp, (i - piece.x) * 4 + (j - piece.y))) {

                                    inputPros.style.background = piece.type.color; //cell color
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
        </section>
    );
}

export default Board;