import React from "react";
import ReactDOM from "react-dom";
import { Widget } from "./components/Widget";
import "./styles.css";

function App() {
  const from = {
    day: 27,
    month: 2,
    year: 2019,
  };
  const until = {
    day: 29,
    month: 2,
    year: 2019,
  };
  return <Widget disabledRanges={ [{ from, until }] } />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
