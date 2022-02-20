import React from "react";
import ReactTooltip from "react-tooltip";
import "./Bit.css";

const Bit = (props) => {
  return (
    <div
      id={props.id}
      className="bit selectable_bits"
      data-tip={"dummystring"}
      data-for={"bit_" + props.index}
    >
      {props.children}
      <ReactTooltip
        id={"bit_" + props.index}
        effect="solid"
        getContent={() => {
          console.log(
            props.children,
            "-----------------------------------------"
          );
          return (
            <span>
              {props.children} x 2<sup>{props.index}</sup> = {props.children} x{" "}
              {Math.pow(2, props.index)} ={" "}
              {props.children === "0" ? "0" : Math.pow(2, props.index)}
            </span>
          );
        }}
      />
    </div>
  );
};

export default Bit;
