import React from "react";
import { hot } from "react-hot-loader";
import BitList from "./components/BitList.js";

const App = () => {
  return <BitList initialBitString="" fillWith="1" />;
};

export default hot(module)(App);
