import React from "react";
import "./Bit.css";

const Bit = (props) => {
  return (
    <div id={props.id} className="bit selectable_bits">
      {props.children}
    </div>
  );
};

export default Bit;
