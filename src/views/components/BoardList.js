import {useSelector} from "react-redux";
import Ratio from 'react-ratio';

const SmallBoard = (props) => {
    let board = props.map;

    return (
        <div className="col border border-dark" id='tetris' style={{width: '150px',  outline: 'none'}}>
            {board.map((row, j) => {
                return ( //Don't remove the key attribute
                    <div key={j} className="row m-0" style={{width: '150px'}}>
                        {row.map((cell, i) => { //Drawing coordinates are reverted (y, x)
                            let inputPros = {
                                style: {
                                    height: '15px',
                                    width: '15px',
                                },
                                className: "d-inline p-0",
                            };

                            if (cell !== 0) {
                                inputPros.style.background = cell.color;
                                inputPros.className += ' border border-dark'
                            }
                            return ( //Don't remove the key attribute
                                <Ratio key={i} {...inputPros}/>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

const BoardList = () => {
    const {room: {_players}, player: {_id}} = useSelector((state) => state);
    console.log("myID: ", _id, "| players: ", _players);

    return (
        <section className="h-100 w-100 overflow-scroll position-relative" data-mdb-perfect-scrollbar="true">
            <div className="row w-100 h-100">
                <div className="d-flex justify-content-center">
                    <div className="col position-absolute">
                    {_players.map((_player, index) => {
                        if (_player.id === _id)
                            return <></>;
                        return (
                            <div key={index} className="mt-2 mb-4">
                                <SmallBoard map={_player._map}/>
                                <div className="d-flex pt-1 justify-content-center">
                                    <img src={_player._avatar}
                                         className="small-avatar" alt="" style={{maxWidth: 30, maxHeight: 30}}/>
                                    <p className="d-inline font-weight-bold">{_player._username}</p>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BoardList;