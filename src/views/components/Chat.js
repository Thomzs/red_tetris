import {useSelector} from "react-redux";

const Chat = () => {
    const { room : {_players, _chat} } = useSelector((state) => state); //useless for now

    return (
        <section style={{overflow: 'scroll'}}>
            {_players.map((player, index) => {
                return (
                    <div key={index}>{player._username} is connected</div>
                );
        })}
        </section>
    );
}

export default Chat;