import React, { useRef } from "react";
import './App.css';
import Demo from './components/Demo'

function App() {
  const innerRef = useRef();

  const getLocation = () => {
    innerRef.current && innerRef.current.getLocation();
  };

  return (
    <div className="App">
      <article style={{ textAlign: "center" }}>
        <Demo onError={(error) => console.log(error)} ref={innerRef} />
        <button
          className="pure-button pure-button-primary"
          onClick={getLocation}
          type="button"
        >
          Get location
        </button>
      </article>
    </div>
  );
}

export default App;
