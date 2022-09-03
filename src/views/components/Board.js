import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {makeArray} from "../../utils/piece";
import {setGameStatus} from "../../slices/statusSlice";

const Board = () => {
    const {status, room} = useSelector((state) => state); //useless for now
    const [board, setBoard] = useState(makeArray(10, 20, null));
    const dispatch = useDispatch();

    const handleKey = (event) => {
        setBoard(); //handle key. The code of the pressed key is in the event object
    }

    useEffect(() => {
        if (room._currentPiece === null) ;

        // while (pieceCanGoDown(board, room._current_piece)) {
            setBoard(update(board, room._currentPiece));
        // }
        // dispatch(setGameStatus({gameStatus: 'readyNext', board: board}) //Update to the server once the piece is dropped.
    }, [room._currentPiece]);

    //Foreach rows and for each column of game._bord, display each cell
    return (
        <section onKeyUp={handleKey}>
            <div className="col border border-dark">
            {board.map((row, index) => {
                return (
                    <div key={index} className="row">
                        {row.map((cell, index) => {
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
                            }

                            return (
                                <div key={index} {...inputPros}/>
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