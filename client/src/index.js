import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { mainReducer } from "./reducers/mainReducer";
import { GlobalStateProvider } from "./globalState";


const initialState = {
  authenticated: true,
  token: localStorage.getItem("sessionToken"),
};

ReactDOM.render(
  <GlobalStateProvider initialState={initialState} reducer={mainReducer}>
    <React.StrictMode>
      <App />
    </React.StrictMode>{" "}
  </GlobalStateProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
