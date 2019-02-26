import React from "react";
import ReactDOM from "react-dom";
import { Widget } from "./components/Widget";
import "./styles.css";

function App() {
  return <Widget />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
