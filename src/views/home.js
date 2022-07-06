import {useDispatch, useSelector} from "react-redux";

const Home = () => {
    const { player } = useSelector((state) => state);
    const dispatch = useDispatch();

    return (
        <section className="container">
            <h1>HOME</h1>
        </section>
    );
}

export default Home;