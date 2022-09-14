import {useSelector} from "react-redux";

const Intro = () => {
    const { player }  = useSelector((state) => state);

    return (
        <section className="intro">
            <div className="animated-title">
                <div className="text-top">
                    <div>
                        <span className="topSpan">Good evening,</span>
                        <span className="topSpan2">
                            <span><img src={player._avatar}
                                       alt="Avatar" className="avatar"/></span> {player._username}
                        </span></div>
                </div>
                <div className="text-bottom">
                    <div><span className="tetris">Red</span>Tetris.</div>
                </div>
            </div>
        </section>
    );
};

export default Intro