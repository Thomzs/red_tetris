import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {dropPiece, makeArray, move, rotate, occupied, removeLines, addMalus} from "../../utils/piece";
import {setGameStatus} from "../../slices/statusSlice";
import {DIR, KEY} from "../../classes/Piece_utils";
import {useInterval} from "../../utils/useInterval";
import {setCountRemoved, setLevelAndCountRemoved, setScore} from "../../slices/roomSlice";
import {Status} from "../../utils/status";
import Modal from 'react-bootstrap/Modal';

//Render the board, and the piece above the board.
//rotate, move left, move right update the piece, not the board.
//drop updates the piece if it can go down. Otherwise, it calls dropPiece to update the board.

function getInterval(level) {
    const rate = 16.74;

    switch (level) {
        case 0:
            return 53 * rate;
        case 1:
            return 49 * rate;
        case 2:
            return 45 * rate;
        case 3:
            return 41 * rate;
        case 4:
            return 37 * rate;
        case 5:
            return 33 * rate;
        case 6:
            return 28 * rate;
        case 7:
            return 22 * rate;
        case 8:
            return 17 * rate;
        case 9:
            return 11 * rate;
        case 10:
            return 10 * rate;
        case 11:
            return 9 * rate;
        case 12:
            return 8 * rate;
        case 13:
            return 7 * rate;
        case 14:
        case 15:
            return 6 * rate;
        case 16:
        case 17:
            return 5 * rate;
        case 18:
        case 19:
            return 4 * rate;
        default:
            return 3 * rate;
    }
}

function bit_test(num, bit) {
    return ((1 << bit) & (num & 0xFFFF));
}

// TODO add level variable
export const computeRemovedLinesScore = (removedLines) => {
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

export const Board = () => {
    const {status, room} = useSelector((state) => state); //useless for now
    const [piece, setPiece] = useState(null);
    const [board, setBoard] = useState(makeArray(10, 20, 0));
    const [removed, setRemoved] = useState(0);
    const [smShow, setSmShow] = useState(false);
    const [title, setTitle] = useState("Game Over");
    const [text, setText] = useState("You lost!");

    const dispatch = useDispatch();

    const updateCount = (count) => {
        let _threshold = 0;
        let level = room._level;

        if (level < 9) {
            _threshold = (level + 1) * 10 / 2;
        } else if (level >= 9 && level < 16) {
            _threshold = 100 / 2;
        } else if (level >= 16 && level <= 25) {
            _threshold = 100 + ((level - 15) * 10) / 2;
        } else {
            _threshold = 200 / 2;
        }

        if (count + room._countRemoved >= _threshold) {
            dispatch(setLevelAndCountRemoved({
                level: level + 1,
                countRemoved: count + room._countRemoved - _threshold
            }));
        } else {
            dispatch(setCountRemoved(count + room._countRemoved));
        }
    };

    const doDrop = () => { //Running every second, AND on key.Down pressed
        if (!piece || status._gameStatus !== 'placing') return

        let ret = move(board, piece, DIR.DOWN); //update the piece

        if (!ret) {
            let tmp = board.map(inner => inner.slice());
            ret = removeLines(dropPiece(tmp, piece));
            setPiece(null);
            setBoard(ret.board);
            dispatch(setScore(10 + room._score + computeRemovedLinesScore(ret.removedLines)))
            updateCount(ret.removedLines);
            setRemoved(ret.removedLines);
            clearInterval(doDrop); //If the piece is placed, then wait for another
        } else {
            setPiece(ret);
        }
    };

    const onClickMoveListener = (event) => {
        if (!piece || status._gameStatus !== 'placing') return

        let keyCode;
        switch (event.target.id) {
            case "left-button":
                keyCode = KEY.LEFT;
                break;
            case "right-button":
                keyCode = KEY.RIGHT;
                break;
            case "down-button":
                keyCode = KEY.DOWN;
                break;
            case "up-button":
                keyCode = KEY.UP;
                break;
            default:
                break;
        }
        handleKey({keyCode:keyCode});
    }

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

        document.getElementById('tetris').focus();
    };

    const lose = () => {
        dispatch(setGameStatus({gameStatus: 'loose', board: board}));
        setPiece(null);
        setText('You lost!');
        setTitle('Game Over');
        setSmShow(true);
    }

    useEffect(() => {
        if (room._status === Status.willStart) {
            setBoard(makeArray(10, 20, 0));
            setPiece(null);
            setSmShow(false);
        }
    }, [room._status]);

    useEffect(() => {
        if (room.status !== Status.InGame && status._gameStatus !== 'initial' && piece === null) {
            dispatch(setGameStatus({gameStatus: 'readyNext', board: board, removedLines: removed}));
        }
    }, [board]);

    useEffect(() => {
        if (room._currentPiece !== null && status._gameStatus !== 'loose') {
            setPiece(room._currentPiece);
            dispatch(setGameStatus({gameStatus:'placing'}));
            if (occupied(board, room._currentPiece.type, room._currentPiece.x, room._currentPiece.y, room._currentPiece.dir)) { //Checking if the new piece can be dropped
                lose(); //if not Loose;
            }
        }
    }, [room._currentPiece]);

    useEffect(() => {
        if (room._malus === 0 || !['placing', 'readyNext'].includes(status._gameStatus)) return;

        let tmp = addMalus(board, room._malus);
        if (!tmp) {
            lose();
        }
        else {
            setBoard(tmp);
            if (piece !== null) {
                let newPiece = {...piece};
                newPiece.y -= room._malus;
                if (newPiece.y < 0) newPiece.y = 0;
                setPiece(newPiece);
                if (occupied(board, piece.type, piece.x, piece.y, piece.dir)) { //Checking if the new piece can be dropped
                    lose(); //if not Loose;
                }
            }
        }
    }, [room._malus]);

    useEffect(() => {
        if (room._win) {
            setText('You won!');
            setTitle('Congratulations');
            setSmShow(true);
        }
    }, [room._win]);

    useInterval(doDrop, getInterval(room._level));

    //Foreach rows and for each column of game._bord, display each cell
    return (
        <section id="board-section">
            <div className="col" >
                <div className="row d-flex justify-content-center m-auto" style={{width: '300px'}}>
                <div className="col border border-dark p-0" id='tetris' style={{outline: 'none'}} tabIndex="0" onKeyDown={handleKey}>
                {board.map((row, j) => {
                return ( //Don't remove the key attribute
                    <div key={j} id={"row-" + j} className="row m-0" style={{width: '300px'}}>
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
                                <div key={i} id={"col" + i} {...inputPros}/>
                            );
                        })}
                    </div>
                );
            })}
                </div>
                </div>
                <div className="row d-flex justify-content-center">
                <div className="btn-toolbar justify-content-center mt-3 position-absolute">
                    <div className="btn-group" role="group">
                        <button className="btn btn-outline-dark me-1 d-inline-block" id="left-button" onClick={onClickMoveListener}>left ←</button>
                    </div>
                    <div className="btn-group" role="group">
                        <button className="btn btn-outline-dark me-1 d-inline-block" id="right-button" onClick={onClickMoveListener}>right →</button>
                    </div>
                    <div className="btn-group" role="group">
                        <button className="btn btn-outline-dark me-1 d-inline-block" id="down-button" onClick={onClickMoveListener}>down ↓</button>
                    </div>
                    <div className="btn-group" role="group">
                        <button className="btn btn-outline-dark d-inline-block" id="up-button" onClick={onClickMoveListener}>rotate ↑</button>
                    </div>
                </div>
                </div>
            </div>

            <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>{text}</Modal.Body>
            </Modal>
        </section>
    );
}

//module.exports = { Board };
//export default Board;