import classNames from "classnames";
import React from "react";
import ReactTooltip from "react-tooltip";
import "./Bit.css";

const Bit = (props) => {
  return (
    <div
      id={props.id}
      className={classNames("bit", `background_${props.type}`, {
        selectable_bits: props.type === "1",
      })}
      data-tip={"dummystring"}
      data-for={"bit_" + props.index}
    >
      {props.children}
      {props.type === "1" && (
        <ReactTooltip
          id={"bit_" + props.index}
          effect="solid"
          getContent={() => {
            return (
              <span>
                {props.children} x 2<sup>{props.index}</sup> = {props.children}{" "}
                x {Math.pow(2, props.index)} ={" "}
                {props.children === "0" ? "0" : Math.pow(2, props.index)}
              </span>
            );
          }}
        />
      )}
    </div>
  );
};

export default Bit;
