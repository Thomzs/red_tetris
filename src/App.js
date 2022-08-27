import './App.css';
import './assets/styles/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useSelector} from 'react-redux';
import Intro from "./views/Intro";
import Home from "./views/Home";
import NavBar from "./views/components/NavBar";
import Game from "./views/Game";
import {Container} from "react-bootstrap";

//TODO When the backend server is unreachable or on disconnection, let the user know in a clean way,
// e.g: status=UNREACHABLE => return <div>It seems we're having some issues right now, pls refresh the page or try again a bit later</div>

function WhatToRender(props) {
    const status = props.status;

    if (status === 'INTRO') return <Intro />;
    else if (status === 'HOME') return <div className="d-flex flex-column vh-100 vw-100"><NavBar /><Home /></div>;
    else if (status === 'GAME') return <div className="d-flex flex-column vh-100 vw-100"><NavBar /><Game /></div>;
}

function App() {
  const { status : {_status} } = useSelector((state) => state);

  return (
      <WhatToRender status={_status} />
  );
}

export default App;
