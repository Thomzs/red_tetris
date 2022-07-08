import {useDispatch, useSelector} from "react-redux";

//TODO if not connected go connect

const Home = () => {
    const { player, status } = useSelector((state) => state);

    const dispatch = useDispatch();

    return (
        <section className="container">
            <h1>{player._username}</h1>
        </section>
    );
}

export default Home;