import './App.css';
import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from "react";
import {
    increment,
    decrement,
    addBy
} from './slices/counterSlice';
import {startConnecting} from "./slices/connectionSlice";

function App() {
  const { counter }  = useSelector((state) => state);
  const dispatch = useDispatch();

  const {
      connection: { connected: connected },
  } = useSelector((state) => state);

  useEffect(() => {
      console.log("CONNECT");
      dispatch(startConnecting());
    }, []);

  const incrementCounter = () => {
      dispatch(increment());
  };
  const decrementCounter = () => {
      dispatch(decrement());
  };
  const addByCounter = () => {
      dispatch(addBy(10));
  };

  return (
    <div className="App">
      <h1>Counter App</h1>
      <h2>{counter.counter}</h2>
        <button onClick={incrementCounter}>Increment</button>
        <button onClick={decrementCounter}>Decrement</button>
        <button onClick={addByCounter}>Add value</button>
    </div>
  );
}

export default App;
