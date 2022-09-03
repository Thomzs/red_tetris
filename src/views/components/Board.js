import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "@types/react";

const Board = () => {
    const {game} = useSelector((state) => state); //useless for now
    const [piece, setPiece] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (game._gameStatus !== 'readyNext') return; //Don't send it unless a piece is placed
        dispatch(setBoard()) //Will send the board to server, so we can broadcast it to the room
    }, [game._board]);



    //Foreach rows and for each column of game._bord, display each cell
    return (
    )
}
