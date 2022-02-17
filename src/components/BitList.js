import React, { useEffect, useState } from "react";
import "./BitList.css";
import Bit from "./Bit.js";

const BitList = () => {
  const [bitString, setBitString] = useState("0101");
  const [cursorPosition, setCursorPosition] = useState(0);

  const moveCursor = (pos) => {};

  const handleKeyInput = React.useCallback((e) => {
    const numRegex = new RegExp("^[01]*$");
    if (activeInput) {
      if (numRegex.test(parseInt(e.key))) {
        list.addSaveToList(true, e.key, 0);
      } else if (e.which === 39) {
        //right
        list.moveCursor(false);
      } else if (e.which === 37) {
        //left
        list.moveCursor(true);
      } else if (e.which === 8) {
        list.deleteSaveFromList();
      }
      // console.log(list, '-----------------------------------------');
      forceUpdate();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyInput);

    return () => {
      window.removeEventListener("keydown", handleKeyInput);
    };
  }, [handleKeyInput]);

  const renderBits = () => {
    return ["", ...bitString].map((bit, ind) =>
      ["0", "1"].includes(bit) ? (
        <>
          <Bit>{bit}</Bit>
          <input className="text_spacer" type="text" dir="rtl" />
        </>
      ) : (
        <input className="text_spacer" type="text" dir="rtl" />
      )
    );
  };

  return (
    <div className="bitlist">
      <div className="inner_box">{renderBits()}</div>
    </div>
  );
};

export default BitList;
