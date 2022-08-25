import {useDispatch, useSelector} from "react-redux";
import {startConnecting} from "../slices/connectionSlice";
import {useEffect} from "react";

//TODO if not connected go connect

const Game = () => {
    const { player, status } = useSelector((state) => state);

    const dispatch = useDispatch();

    const {
        connection: { _connected },
    } = useSelector((state) => state);

    useEffect(() => {
        console.log("CONNECT");
        dispatch(startConnecting());
    }, []);

    return (
        <section className="container">
            <div>GAME</div>
        </section>
    );
}

export default Game;