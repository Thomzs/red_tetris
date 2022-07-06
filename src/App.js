import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from "react";
import {startConnecting} from "./slices/connectionSlice";
import './assets/styles/app.scss';


function App() {
  const { player }  = useSelector((state) => state);
  const dispatch = useDispatch();

  const {
      connection: { connected },
  } = useSelector((state) => state);

  useEffect(() => {
      console.log("CONNECT");
      dispatch(startConnecting());
    }, []);

  return (
      <section className="container">
          <div className="animated-title">
              <div className="text-top">
                  <div>
                      <span className="topSpan">Good evening,</span>
                      <span className="topSpan2">
                            <span><img src={player._avatar}
                                       alt="Avatar" className="avatar"/></span> {player._username}
                        </span>
                  </div>
              </div>
              <div className="text-bottom">
                  <div><span className="tetris">Red</span>Tetris.</div>
              </div>
          </div>
      </section>
  );
}

export default App;
