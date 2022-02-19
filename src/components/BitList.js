import React, { useCallback, useEffect } from "react";
import useState from "react-usestateref";
import "./BitList.css";
import Bit from "./Bit.js";
import DragSelect from "dragselect";
import classNames from "classnames/bind";

const BitList = ({ areaId = 0, initialBitString }) => {
  const [cursorPosition, setCursorPosition, refCursorPosition] = useState(0);
  const [bitString, setBitString, refBitString] = useState(initialBitString);
  const [dragSelector, setDragSelector] = useState({});

  const moveCursorToEnd = useCallback(() => {
    moveCursor(refBitString.current.length * 2);
  }, [cursorPosition]);

  const moveCursorForwards = useCallback(() => {
    moveCursor(refCursorPosition.current + 2);
  }, [cursorPosition]);

  const moveCursorBackwards = useCallback(() => {
    moveCursor(refCursorPosition.current - 2);
  }, [refCursorPosition.current]);

  const moveCursor = (pos) => {
    if (pos < 0 || pos > refBitString.current.length * 2) {
      return;
    }
    document.getElementById(`bitElement_${pos}`).focus();
  };

  const deleteFromList = useCallback(
    (pos) => {
      setBitString(
        refBitString.current.substr(0, pos - 1) +
          refBitString.current.substr(pos)
      );
      moveCursorBackwards();
    },
    [setBitString]
  );

  const addToList = useCallback(
    (pos, key) => {
      setBitString(
        refBitString.current.substr(0, pos) +
          key +
          refBitString.current.substr(pos)
      );
      moveCursorForwards();
    },
    [setBitString]
  );

  const handleKeyInput = useCallback((e) => {
    const numRegex = new RegExp("^[01]*$");
    if (numRegex.test(parseInt(e.key))) {
      addToList(refCursorPosition.current / 2, parseInt(e.key));
    } else if (e.which === 39) {
      //right
      moveCursorForwards();
    } else if (e.which === 37) {
      //left
      moveCursorBackwards();
    } else if (e.which === 8) {
      deleteFromList(refCursorPosition.current / 2);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyInput);

    return () => {
      window.removeEventListener("keydown", handleKeyInput);
    };
  }, [handleKeyInput]);

  useEffect(() => {
    setDragSelector(
      new DragSelect({
        selectables: document.querySelectorAll(".selectable_bits"),
        area: document.getElementById(`bitlist_area_${areaId}`),
        draggability: false,
      })
    );

    moveCursor(cursorPosition);
  }, []);

  const onFocusTextArea = useCallback(
    (event, id) => {
      setCursorPosition(id);
    },
    [setCursorPosition]
  );

  const focusTextArea = (e) => {
    e.preventDefault();
    // moveCursorToEnd();
  };

  const renderBits = () => {
    let counter = 1,
      cellCounter = -1;
    const renderBitsResult = [];

    const firstInputElement = (
      <input
        maxLength="0"
        className="text_spacer bit_cell"
        type="text"
        dir="rtl"
        id={`bitElement_0`}
        key={0}
        onFocus={(e) => {
          onFocusTextArea(e, 0);
        }}
      />
    );

    for (const bit of bitString) {
      if (["0", "1"].includes(bit)) {
        const bitElement = (
          <Bit id={`bitElement_${counter}`} key={counter}>
            {bit}
          </Bit>
        );
        counter++;

        const inputElement = (
          <input
            maxLength="0"
            className="text_spacer"
            type="text"
            dir="rtl"
            id={`bitElement_${counter}`}
            key={counter}
            onFocus={((e) => {
              // e.preventDefault();
              onFocusTextArea(counter, e);
            }).bind(null, counter)}
          />
        );
        counter++;

        renderBitsResult.push(
          <div
            key={cellCounter}
            className={classNames("cell", "bit_cell", {
              bit_cell_first: counter === 3,
            })}
          >
            {counter === 3 && firstInputElement}
            {bitElement}
            {inputElement}
          </div>
        );
        cellCounter--;
      }
    }

    if (renderBitsResult.length === 0) {
      renderBitsResult.push(
        <div key={cellCounter} className="cell bit_cell bit_cell_first">
          {firstInputElement}
        </div>
      );
    }

    return renderBitsResult;
  };

  return (
    <div
      className="bitlist"
      id={`bitlist_area_${areaId}`}
      onClick={(e) => focusTextArea(e)}
    >
      {renderBits()}
    </div>
  );
};

export default BitList;
