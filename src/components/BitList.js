import React, { useCallback, useEffect } from "react";
import useState from "react-usestateref";
import "./BitList.css";
import Bit from "./Bit.js";
import DragSelect from "dragselect";
import classNames from "classnames/bind";

const BitList = ({ areaId = 0, initialBitString }) => {
  const [cursorPosition, setCursorPosition, refCursorPosition] = useState(0);
  const [bitString, setBitString, refBitString] = useState(initialBitString);
  const [dragSelector, setDragSelector, refDragSelector] = useState({});
  const [selection, setSelection] = useState([]);

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
    if (pos < 0 || pos > refBitString.current.length * 2 || pos % 2 !== 0) {
      return;
    }
    document.getElementById(`bitElement_${pos}`).focus();
  };

  const deleteSingleFromList = useCallback(
    (pos) => {
      setBitString(
        refBitString.current.substr(0, pos - 1) +
          refBitString.current.substr(pos)
      );
    },
    [setBitString]
  );

  const deleteMultipleFromList = useCallback(
    (selection) => {
      const selectionDirectionObject = findOutSelectionDirection(selection);
      if (selectionDirectionObject.direction) {
        const cropStart = Math.ceil(selectionDirectionObject.first / 2 - 1);
        const cropEnd = Math.ceil(selectionDirectionObject.last / 2);
        setBitString(
          refBitString.current.substr(0, cropStart) +
            refBitString.current.substr(cropEnd)
        );
        moveCursor(selectionDirectionObject.first - 1);
      } else {
        const cropStart = Math.ceil(selectionDirectionObject.first / 2 - 1);
        const cropEnd = Math.ceil(selectionDirectionObject.last / 2);
        setBitString(
          refBitString.current.substr(0, cropStart) +
            refBitString.current.substr(cropEnd)
        );
        moveCursor(selectionDirectionObject.first - 1);
      }
      refDragSelector.current.clearSelection();
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
      refDragSelector.current.clearSelection();
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
      if (refDragSelector.current.getSelection().length > 0) {
        deleteMultipleFromList(refDragSelector.current.getSelection());
      } else {
        deleteSingleFromList(refCursorPosition.current / 2);
        moveCursorBackwards();
      }
    } else if (e.which === 46) {
      if (refDragSelector.current.getSelection().length > 0) {
        deleteMultipleFromList(refDragSelector.current.getSelection());
      } else {
        deleteSingleFromList((refCursorPosition.current + 2) / 2);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyInput);

    return () => {
      window.removeEventListener("keydown", handleKeyInput);
    };
  }, [handleKeyInput]);

  useEffect(() => {
    const dragSelect = new DragSelect({
      selectables: document.getElementsByClassName("selectable_bits"),
      area: document.getElementById(`bitlist_area_${areaId}`),
      draggability: false,
    });
    dragSelect.subscribe("callback", onSelection);
    setDragSelector(dragSelect);

    moveCursor(cursorPosition);
  }, []);

  const onFocusTextArea = useCallback(
    (event, id) => {
      setCursorPosition(id ?? parseInt(event.target.id.split("_")[1]));
    },
    [setCursorPosition]
  );

  const onSelection = useCallback(
    (selectionRes) => {
      if (
        selectionRes &&
        selectionRes.items &&
        selectionRes.items.length &&
        selectionRes.items.length > 0
      ) {
        const selectionDirectionObject = findOutSelectionDirection(
          selectionRes.items
        );

        if (selectionDirectionObject.direction) {
          moveCursor(selectionDirectionObject.last + 1);
        } else {
          moveCursor(selectionDirectionObject.first - 1);
        }
      }

      setSelection(selectionRes.items);
    },
    [selection]
  );

  const focusTextArea = (e) => {
    if (
      e.relatedTarget ||
      e.target.classList.contains("text_spacer") ||
      refDragSelector.current.getSelection().length > 0
    ) {
      return;
    }

    moveCursorToEnd();
  };

  const findOutSelectionDirection = (selectionItems) => {
    const first = parseInt(selectionItems[0].id.split("_")[1]);
    const last = parseInt(
      selectionItems[selectionItems.length - 1].id.split("_")[1]
    );
    let items = selectionItems.map((item) => parseInt(item.id.split("_")[1]));
    items.sort((a, b) => a - b);
    return {
      direction: first < last,
      first: items[0],
      last: items[items.length - 1],
    };
  };

  const renderFillerBits = () => {};

  const renderBits = () => {
    let counter = 1,
      cellCounter = -1,
      bitCounter = refBitString.current.length - 1;
    const renderBitsResult = [];

    const firstInputElement = (
      <input
        maxLength="0"
        className="text_spacer"
        type="text"
        dir="rtl"
        id={`bitElement_0`}
        key={0}
        onFocus={(e) => {
          onFocusTextArea(e, 0);
        }}
      />
    );

    bitString.split("").forEach((bit) => {
      if (["0", "1"].includes(bit)) {
        const bitElement = (
          <Bit id={`bitElement_${counter}`} key={counter} index={bitCounter}>
            {bit}
          </Bit>
        );
        counter++;
        bitCounter--;

        const inputElement = (
          <input
            maxLength="0"
            className="text_spacer"
            type="text"
            dir="rtl"
            id={`bitElement_${counter}`}
            key={counter}
            onFocus={onFocusTextArea}
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
    });

    if (renderBitsResult.length === 0) {
      renderBitsResult.push(
        <div key={cellCounter} className="cell bit_cell bit_cell_first">
          {firstInputElement}
        </div>
      );
    }
    if (refDragSelector.current.addSelectables) {
      refDragSelector.current.addSelectables(
        document.getElementsByClassName("selectable_bits")
      );
    }

    return renderBitsResult;
  };

  const renderBitNumbers = () => {};
  const renderByteRulers = () => {};
  const renderByteValues = () => {};
  const renderByteButtons = () => {};

  return (
    <div
      className="bitlist"
      id={`bitlist_area_${areaId}`}
      onClick={(e) => focusTextArea(e)}
    >
      {renderFillerBits()}
      {renderBits()}
      {renderBitNumbers()}
      {renderByteRulers()}
      {renderByteValues()}
      {renderByteButtons()}
    </div>
  );
};

export default BitList;
