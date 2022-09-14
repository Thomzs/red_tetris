import './App.css';
import './assets/styles/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useDispatch, useSelector} from 'react-redux';
import Intro from "./views/Intro";
import Home from "./views/Home";
import NavBar from "./views/components/NavBar";
import Game from "./views/Game";
import {useEffect, useState} from "react";
import {startConnecting} from "./slices/connectionSlice";
import {setUsername} from "./slices/playerSlice";
import {checkRoomPassword, directRoomRequest} from "./utils/api";
import {setStatusGame, setStatusHome} from "./slices/statusSlice";

//TODO When the backend server is unreachable or on disconnection, let the user know in a clean way,
// e.g: status=UNREACHABLE => return <div>It seems we're having some issues right now, pls refresh the page or try again a bit later</div>

function WhatToRender(props) {
    const status = props.status;

    if (status === 'INTRO') return <Intro />;
    else if (status === 'HOME') return <div className="d-flex flex-column vh-100 vw-100 container-large"><NavBar /><Home args={props.args}/></div>;
    else if (status === 'GAME') return <div className="d-flex flex-column vh-100 vw-100 container-large"><NavBar /><Game /></div>;
}

function App() {
    const { status : {_status}, connection: { _connected } } = useSelector((state) => state);
    const [props, setProps] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
         if (_connected) {
          dispatch(setStatusGame());
         }
    }, [_connected]);

    const init = async () => {

    };

    useEffect(() => {
        let href = decodeURI(window.location.hash);
        let searchParams = new URLSearchParams(window.location.href);
        let ret = null;

        let room = RegExp("^#.*?(?=\\[)").exec(href);
        let player = RegExp("\\[.*?(?=])").exec(href);
        let password = RegExp("\\?password.*?(?=($|&))").exec(href);

        if (room && player) {
            room = room[0].substring(1);
            player = player[0].substring(1);
            if (!password) password = "";
            else password = password[0].substring(10);
            dispatch(setUsername(player));
            directRoomRequest(room, password)
                .then((_ret) => {
                    if (_ret && !_ret.message) {
                        const timer = setTimeout(() => dispatch(startConnecting({room: _ret, password: password})), 4500);
                        ret = _ret;
                        return () => clearTimeout(timer);
                    } else {
                        ret = _ret;
                    }
                })
                .catch((e) => {
                    ret = e;
                })
                .finally(() => {
                    if (!ret || ret.message) {
                        // eslint-disable-next-line no-restricted-globals
                        history.replaceState(null, 'Tetris', "/");
                        const timer = setTimeout(() => dispatch(setStatusHome()), 4500);
                        setProps({reason: ret, room: room, password: password});
                        return () => clearTimeout(timer);
                    }
                })
        } else {
            // eslint-disable-next-line no-restricted-globals
            history.replaceState(null, 'Tetris', "/");
            const timer = setTimeout(() => dispatch(setStatusHome()), 5000);
            setProps({reason: ret, room: room, password: password});
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <WhatToRender status={_status} args={props}/>
    );
}

export default App;
