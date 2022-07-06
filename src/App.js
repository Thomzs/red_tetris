import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect, useState} from "react";
import {startConnecting} from "./slices/connectionSlice";
import Intro from "./views/intro";
import Home from "./views/home";

function WhatToRender(props) {
    const status = props.status;

    if (status === 'INTRO') return <Intro />;
    else if (status === 'HOME') return <Home />;
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
