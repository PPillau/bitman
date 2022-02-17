import React from "react";
import "./Bit.css";

const Bit = (props) => {
  return <div className="bit selectable_bits">{props.children}</div>;
};

export default Bit;
