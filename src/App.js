import React from "react";
import { hot } from "react-hot-loader";
import BitList from "./components/BitList.js";
import DragSelect from "dragselect";

const App = () => {
  return <BitList />;
};
const ds = new DragSelect({
  selectables: document.querySelectorAll(".selectable_bits"),
});

export default hot(module)(App);
