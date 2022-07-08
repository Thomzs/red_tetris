import {useDispatch, useSelector} from "react-redux";
import {setStatusGame} from "../slices/statusSlice";

//TODO if not connected go connect

const Game = () => {
    const { player, status } = useSelector((state) => state);

    const dispatch = useDispatch();

    return (
        <section className="container">
            <div>GAME</div>
        </section>
    );
}

export default Game;