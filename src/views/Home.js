import {useDispatch, useSelector} from "react-redux";
import {setStatusGame} from "../slices/statusSlice";

//TODO if not connected go connect

const Home = () => {
    const { player, status } = useSelector((state) => state);

    const dispatch = useDispatch();

    const goGame = () => {
        dispatch(setStatusGame());
    };

    return (
        <section className="container">
            <button onClick={goGame}>{player._username}</button>
        </section>
    );
}

export default Home;