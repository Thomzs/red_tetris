import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from "react";
import {startConnecting} from "./slices/connectionSlice";
import Intro from "./views/Intro";
import Home from "./views/Home";
import NavBar from "./views/components/NavBar";
import Game from "./views/Game";

function WhatToRender(props) {
    const status = props.status;

    if (status === 'INTRO') return <Intro />;
    else if (status === 'HOME') return <><NavBar /><Home /></>;
    else if (status === 'GAME') return <><NavBar /><Game /></>;
}

function App() {
  const { status : {_status} } = useSelector((state) => state);

  const dispatch = useDispatch();

  const {
      connection: { connected },
  } = useSelector((state) => state);

  useEffect(() => {
      console.log("CONNECT");
      dispatch(startConnecting());
    }, []);

  return (
      <WhatToRender status={_status} />
  );
}

export default App;
